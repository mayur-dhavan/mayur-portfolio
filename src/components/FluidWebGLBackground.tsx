import React, { useEffect, useRef } from 'react';

const FluidWebGLBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const glRef = useRef<WebGLRenderingContext | WebGL2RenderingContext | null>(null);
  const pointersRef = useRef<any[]>([]);
  const splatStackRef = useRef<number[]>([]);
  
  // Configuration
  const config = {
    TEXTURE_DOWNSAMPLE: 1,
    DENSITY_DISSIPATION: 0.98,
    VELOCITY_DISSIPATION: 0.99,
    PRESSURE_DISSIPATION: 0.8,
    PRESSURE_ITERATIONS: 25,
    CURL: 30,
    SPLAT_RADIUS: 0.005
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL context
    const getWebGLContext = (canvas: HTMLCanvasElement) => {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      };

      let gl = canvas.getContext('webgl2', params) as WebGL2RenderingContext;
      const isWebGL2 = !!gl;

      if (!isWebGL2) {
        gl = (canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params)) as WebGL2RenderingContext;
      }

      if (!gl) {
        console.error('WebGL not supported');
        return null;
      }

      const halfFloat = gl.getExtension('OES_texture_half_float');
      let support_linear_float = gl.getExtension('OES_texture_half_float_linear');

      if (isWebGL2) {
        gl.getExtension('EXT_color_buffer_float');
        support_linear_float = gl.getExtension('OES_texture_float_linear');
      }

      gl.clearColor(0.0, 0.0, 0.0, 0.0); // Transparent background

      const internalFormat = isWebGL2 ? gl.RGBA16F : gl.RGBA;
      const internalFormatRG = isWebGL2 ? gl.RG16F : gl.RGBA;
      const formatRG = isWebGL2 ? gl.RG : gl.RGBA;
      const texType = isWebGL2 ? gl.HALF_FLOAT : halfFloat?.HALF_FLOAT_OES;

      return {
        gl,
        ext: {
          internalFormat,
          internalFormatRG,
          formatRG,
          texType
        },
        support_linear_float
      };
    };

    // Pointer prototype
    function pointerPrototype() {
      return {
        id: -1,
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        down: false,
        moved: false,
        color: [30, 0, 300]
      };
    }

    // Initialize pointers - clear existing ones first
    pointersRef.current = [];
    pointersRef.current.push(pointerPrototype());

    // GLProgram class
    class GLProgram {
      uniforms: { [key: string]: WebGLUniformLocation | null } = {};
      program: WebGLProgram;

      constructor(gl: WebGLRenderingContext | WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        this.program = gl.createProgram()!;

        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(this.program) || 'Program linking failed');
        }

        const uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
        
        for (let i = 0; i < uniformCount; i++) {
          const uniformName = gl.getActiveUniform(this.program, i)?.name;
          if (uniformName) {
            this.uniforms[uniformName] = gl.getUniformLocation(this.program, uniformName);
          }
        }
      }

      bind(gl: WebGLRenderingContext | WebGL2RenderingContext) {
        gl.useProgram(this.program);
      }
    }

    // Compile shader function
    const compileShader = (gl: WebGLRenderingContext | WebGL2RenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) || 'Shader compilation failed');
      }

      return shader;
    };

    const webglContext = getWebGLContext(canvas);
    if (!webglContext) return;

    const { gl, ext, support_linear_float } = webglContext;
    glRef.current = gl;

    // Shader sources (same as your HTML file)
    const baseVertexShaderSource = `
      precision highp float; 
      precision mediump sampler2D; 
      attribute vec2 aPosition; 
      varying vec2 vUv; 
      varying vec2 vL; 
      varying vec2 vR; 
      varying vec2 vT; 
      varying vec2 vB; 
      uniform vec2 texelSize; 
      void main () {     
        vUv = aPosition * 0.5 + 0.5;     
        vL = vUv - vec2(texelSize.x, 0.0);     
        vR = vUv + vec2(texelSize.x, 0.0);     
        vT = vUv + vec2(0.0, texelSize.y);     
        vB = vUv - vec2(0.0, texelSize.y);     
        gl_Position = vec4(aPosition, 0.0, 1.0); 
      }
    `;

    const clearShaderSource = `
      precision highp float; 
      precision mediump sampler2D; 
      varying vec2 vUv; 
      uniform sampler2D uTexture; 
      uniform float value; 
      void main () {     
        gl_FragColor = value * texture2D(uTexture, vUv); 
      }
    `;

    const displayShaderSource = `
      precision highp float; 
      precision mediump sampler2D; 
      varying vec2 vUv; 
      uniform sampler2D uTexture; 
      void main () {     
        gl_FragColor = texture2D(uTexture, vUv); 
      }
    `;

    const splatShaderSource = `
      precision highp float; 
      precision mediump sampler2D; 
      varying vec2 vUv; 
      uniform sampler2D uTarget; 
      uniform float aspectRatio; 
      uniform vec3 color; 
      uniform vec2 point; 
      uniform float radius; 
      void main () {     
        vec2 p = vUv - point.xy;     
        p.x *= aspectRatio;     
        vec3 splat = exp(-dot(p, p) / radius) * color;     
        vec3 base = texture2D(uTarget, vUv).xyz;     
        gl_FragColor = vec4(base + splat, 1.0); 
      }
    `;

    const advectionShaderSource = `
      precision highp float; 
      precision mediump sampler2D; 
      varying vec2 vUv; 
      uniform sampler2D uVelocity; 
      uniform sampler2D uSource; 
      uniform vec2 texelSize; 
      uniform float dt; 
      uniform float dissipation; 
      void main () {     
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;     
        gl_FragColor = dissipation * texture2D(uSource, coord); 
      }
    `;

    const advectionManualFilteringShaderSource = `
      precision highp float; 
      precision mediump sampler2D; 
      varying vec2 vUv; 
      uniform sampler2D uVelocity; 
      uniform sampler2D uSource; 
      uniform vec2 texelSize; 
      uniform float dt; 
      uniform float dissipation; 
      vec4 bilerp (in sampler2D sam, in vec2 p) {     
        vec4 st;     
        st.xy = floor(p - 0.5) + 0.5;     
        st.zw = st.xy + 1.0;     
        vec4 uv = st * texelSize.xyxy;     
        vec4 a = texture2D(sam, uv.xy);     
        vec4 b = texture2D(sam, uv.zy);     
        vec4 c = texture2D(sam, uv.xw);     
        vec4 d = texture2D(sam, uv.zw);     
        vec2 f = p - st.xy;     
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y); 
      } 
      void main () {     
        vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;     
        gl_FragColor = dissipation * bilerp(uSource, coord);     
        gl_FragColor.a = 1.0; 
      }
    `;

    const divergenceShaderSource = `
      precision highp float; 
      precision mediump sampler2D; 
      varying vec2 vUv; 
      varying vec2 vL; 
      varying vec2 vR; 
      varying vec2 vT; 
      varying vec2 vB; 
      uniform sampler2D uVelocity; 
      vec2 sampleVelocity (in vec2 uv) {     
        vec2 multiplier = vec2(1.0, 1.0);     
        if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; }     
        if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; }     
        if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; }     
        if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; }     
        return multiplier * texture2D(uVelocity, uv).xy; 
      } 
      void main () {     
        float L = sampleVelocity(vL).x;     
        float R = sampleVelocity(vR).x;     
        float T = sampleVelocity(vT).y;     
        float B = sampleVelocity(vB).y;     
        float div = 0.5 * (R - L + T - B);     
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0); 
      }
    `;

    const curlShaderSource = `
      precision highp float; 
      precision mediump sampler2D; 
      varying vec2 vUv; 
      varying vec2 vL; 
      varying vec2 vR; 
      varying vec2 vT; 
      varying vec2 vB; 
      uniform sampler2D uVelocity; 
      void main () {     
        float L = texture2D(uVelocity, vL).y;     
        float R = texture2D(uVelocity, vR).y;     
        float T = texture2D(uVelocity, vT).x;     
        float B = texture2D(uVelocity, vB).x;     
        float vorticity = R - L - T + B;     
        gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0); 
      }
    `;

    const vorticityShaderSource = `
      precision highp float; 
      precision mediump sampler2D; 
      varying vec2 vUv; 
      varying vec2 vL; 
      varying vec2 vR; 
      varying vec2 vT; 
      varying vec2 vB; 
      uniform sampler2D uVelocity; 
      uniform sampler2D uCurl; 
      uniform float curl; 
      uniform float dt; 
      void main () {     
        float L = texture2D(uCurl, vL).y;     
        float R = texture2D(uCurl, vR).y;     
        float T = texture2D(uCurl, vT).x;     
        float B = texture2D(uCurl, vB).x;     
        float C = texture2D(uCurl, vUv).x;     
        vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L));     
        force *= 1.0 / length(force + 0.00001) * curl * C;     
        vec2 vel = texture2D(uVelocity, vUv).xy;     
        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0); 
      }
    `;

    const pressureShaderSource = `
      precision highp float; 
      precision mediump sampler2D; 
      varying vec2 vUv; 
      varying vec2 vL; 
      varying vec2 vR; 
      varying vec2 vT; 
      varying vec2 vB; 
      uniform sampler2D uPressure; 
      uniform sampler2D uDivergence; 
      vec2 boundary (in vec2 uv) {     
        uv = min(max(uv, 0.0), 1.0);     
        return uv; 
      } 
      void main () {     
        float L = texture2D(uPressure, boundary(vL)).x;     
        float R = texture2D(uPressure, boundary(vR)).x;     
        float T = texture2D(uPressure, boundary(vT)).x;     
        float B = texture2D(uPressure, boundary(vB)).x;     
        float C = texture2D(uPressure, vUv).x;     
        float divergence = texture2D(uDivergence, vUv).x;     
        float pressure = (L + R + B + T - divergence) * 0.25;     
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0); 
      }
    `;

    const gradientSubtractShaderSource = `
      precision highp float; 
      precision mediump sampler2D; 
      varying vec2 vUv; 
      varying vec2 vL; 
      varying vec2 vR; 
      varying vec2 vT; 
      varying vec2 vB; 
      uniform sampler2D uPressure; 
      uniform sampler2D uVelocity; 
      vec2 boundary (in vec2 uv) {     
        uv = min(max(uv, 0.0), 1.0);     
        return uv; 
      } 
      void main () {     
        float L = texture2D(uPressure, boundary(vL)).x;     
        float R = texture2D(uPressure, boundary(vR)).x;     
        float T = texture2D(uPressure, boundary(vT)).x;     
        float B = texture2D(uPressure, boundary(vB)).x;     
        vec2 velocity = texture2D(uVelocity, vUv).xy;     
        velocity.xy -= vec2(R - L, T - B);     
        gl_FragColor = vec4(velocity, 0.0, 1.0); 
      }
    `;

    // Compile shaders
    const baseVertexShader = compileShader(gl, gl.VERTEX_SHADER, baseVertexShaderSource);
    const clearShader = compileShader(gl, gl.FRAGMENT_SHADER, clearShaderSource);
    const displayShader = compileShader(gl, gl.FRAGMENT_SHADER, displayShaderSource);
    const splatShader = compileShader(gl, gl.FRAGMENT_SHADER, splatShaderSource);
    const advectionManualFilteringShader = compileShader(gl, gl.FRAGMENT_SHADER, advectionManualFilteringShaderSource);
    const advectionShader = compileShader(gl, gl.FRAGMENT_SHADER, advectionShaderSource);
    const divergenceShader = compileShader(gl, gl.FRAGMENT_SHADER, divergenceShaderSource);
    const curlShader = compileShader(gl, gl.FRAGMENT_SHADER, curlShaderSource);
    const vorticityShader = compileShader(gl, gl.FRAGMENT_SHADER, vorticityShaderSource);
    const pressureShader = compileShader(gl, gl.FRAGMENT_SHADER, pressureShaderSource);
    const gradientSubtractShader = compileShader(gl, gl.FRAGMENT_SHADER, gradientSubtractShaderSource);

    // Create programs
    const clearProgram = new GLProgram(gl, baseVertexShader, clearShader);
    const displayProgram = new GLProgram(gl, baseVertexShader, displayShader);
    const splatProgram = new GLProgram(gl, baseVertexShader, splatShader);
    const advectionProgram = new GLProgram(gl, baseVertexShader, support_linear_float ? advectionShader : advectionManualFilteringShader);
    const divergenceProgram = new GLProgram(gl, baseVertexShader, divergenceShader);
    const curlProgram = new GLProgram(gl, baseVertexShader, curlShader);
    const vorticityProgram = new GLProgram(gl, baseVertexShader, vorticityShader);
    const pressureProgram = new GLProgram(gl, baseVertexShader, pressureShader);
    const gradientSubtractProgram = new GLProgram(gl, baseVertexShader, gradientSubtractShader);

    // Create framebuffers and textures
    let textureWidth: number;
    let textureHeight: number;
    let density: any;
    let velocity: any;
    let divergence: any;
    let curl: any;
    let pressure: any;

    const createFBO = (texId: number, w: number, h: number, internalFormat: number, format: number, type: number, param: number) => {
      gl.activeTexture(gl.TEXTURE0 + texId);

      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return [texture, fbo, texId];
    };

    const createDoubleFBO = (texId: number, w: number, h: number, internalFormat: number, format: number, type: number, param: number) => {
      let fbo1 = createFBO(texId, w, h, internalFormat, format, type, param);
      let fbo2 = createFBO(texId + 1, w, h, internalFormat, format, type, param);

      return {
        get first() {
          return fbo1;
        },
        get second() {
          return fbo2;
        },
        swap() {
          const temp = fbo1;
          fbo1 = fbo2;
          fbo2 = temp;
        }
      };
    };

    const initFramebuffers = () => {
      textureWidth = gl.drawingBufferWidth >> config.TEXTURE_DOWNSAMPLE;
      textureHeight = gl.drawingBufferHeight >> config.TEXTURE_DOWNSAMPLE;

      const iFormat = ext.internalFormat;
      const iFormatRG = ext.internalFormatRG;
      const formatRG = ext.formatRG;
      const texType = ext.texType;

      density = createDoubleFBO(0, textureWidth, textureHeight, iFormat, gl.RGBA, texType, support_linear_float ? gl.LINEAR : gl.NEAREST);
      velocity = createDoubleFBO(2, textureWidth, textureHeight, iFormatRG, formatRG, texType, support_linear_float ? gl.LINEAR : gl.NEAREST);
      divergence = createFBO(4, textureWidth, textureHeight, iFormatRG, formatRG, texType, gl.NEAREST);
      curl = createFBO(5, textureWidth, textureHeight, iFormatRG, formatRG, texType, gl.NEAREST);
      pressure = createDoubleFBO(6, textureWidth, textureHeight, iFormatRG, formatRG, texType, gl.NEAREST);
    };

    // Initialize framebuffers
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    initFramebuffers();

    // Create vertex buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const blit = (destination: WebGLFramebuffer | null) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    const splat = (x: number, y: number, dx: number, dy: number, color: number[]) => {
      splatProgram.bind(gl);
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.first[2]);
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.point, x / canvas.width, 1.0 - y / canvas.height);
      gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0);
      gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS);
      blit(velocity.second[1]);
      velocity.swap();

      gl.uniform1i(splatProgram.uniforms.uTarget, density.first[2]);
      gl.uniform3f(splatProgram.uniforms.color, color[0] * 0.3, color[1] * 0.3, color[2] * 0.3);
      blit(density.second[1]);
      density.swap();
    };

    const resizeCanvas = () => {
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        initFramebuffers();
      }
    };

    let lastTime = Date.now();
    let count = 0;
    let colorArr = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2];

    // Animation loop
    const update = () => {
      resizeCanvas();

      const dt = Math.min((Date.now() - lastTime) / 1000, 0.016);
      lastTime = Date.now();

      gl.viewport(0, 0, textureWidth, textureHeight);

      if (splatStackRef.current.length > 0) {
        for (let m = 0; m < splatStackRef.current.pop()!; m++) {
          const color = [Math.random() * 10, Math.random() * 10, Math.random() * 10];
          const x = canvas.width * Math.random();
          const y = canvas.height * Math.random();
          const dx = 1000 * (Math.random() - 0.5);
          const dy = 1000 * (Math.random() - 0.5);

          splat(x, y, dx, dy, color);
        }
      }

      // Advection step
      advectionProgram.bind(gl);
      gl.uniform2f(advectionProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.first[2]);
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.first[2]);
      gl.uniform1f(advectionProgram.uniforms.dt, dt);
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.second[1]);
      velocity.swap();

      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.first[2]);
      gl.uniform1i(advectionProgram.uniforms.uSource, density.first[2]);
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(density.second[1]);
      density.swap();

      // Handle pointer interactions
      for (let i = 0; i < pointersRef.current.length; i++) {
        const pointer = pointersRef.current[i];
        if (pointer.moved) {
          splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color);
          pointer.moved = false;
        }
      }

      // Curl step
      curlProgram.bind(gl);
      gl.uniform2f(curlProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.first[2]);
      blit(curl[1]);

      // Vorticity step
      vorticityProgram.bind(gl);
      gl.uniform2f(vorticityProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.first[2]);
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl[2]);
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, dt);
      blit(velocity.second[1]);
      velocity.swap();

      // Divergence step
      divergenceProgram.bind(gl);
      gl.uniform2f(divergenceProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.first[2]);
      blit(divergence[1]);

      // Clear pressure
      clearProgram.bind(gl);
      const pressureTexId = pressure.first[2];
      gl.activeTexture(gl.TEXTURE0 + pressureTexId);
      gl.bindTexture(gl.TEXTURE_2D, pressure.first[0]);
      gl.uniform1i(clearProgram.uniforms.uTexture, pressureTexId);
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION);
      blit(pressure.second[1]);
      pressure.swap();

      // Pressure solve
      pressureProgram.bind(gl);
      gl.uniform2f(pressureProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence[2]);
      const currentPressureTexId = pressure.first[2];
      gl.activeTexture(gl.TEXTURE0 + currentPressureTexId);

      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.bindTexture(gl.TEXTURE_2D, pressure.first[0]);
        gl.uniform1i(pressureProgram.uniforms.uPressure, currentPressureTexId);
        blit(pressure.second[1]);
        pressure.swap();
      }

      // Gradient subtract
      gradientSubtractProgram.bind(gl);
      gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.first[2]);
      gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.first[2]);
      blit(velocity.second[1]);
      velocity.swap();

      // Display
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      displayProgram.bind(gl);
      gl.uniform1i(displayProgram.uniforms.uTexture, density.first[2]);
      blit(null);

      animationFrameRef.current = requestAnimationFrame(update);
    };

    // Mouse event handlers - attach to window instead of canvas
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Only process if mouse is over the canvas area
      if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
        return;
      }

      count++;
      if (count > 25) {
        colorArr = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2];
        count = 0;
      }

      const pointer = pointersRef.current[0];
      pointer.down = true;
      pointer.color = colorArr;
      pointer.moved = pointer.down;
      pointer.dx = (x - pointer.x) * 10.0;
      pointer.dy = (y - pointer.y) * 10.0;
      pointer.x = x;
      pointer.y = y;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touches = e.targetTouches;

      count++;
      if (count > 25) {
        colorArr = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2];
        count = 0;
      }

      const rect = canvas.getBoundingClientRect();

      for (let i = 0; i < touches.length; i++) {
        if (i >= pointersRef.current.length) {
          pointersRef.current.push(pointerPrototype());
        }

        const x = touches[i].clientX - rect.left;
        const y = touches[i].clientY - rect.top;

        // Only process if touch is over the canvas area
        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          const pointer = pointersRef.current[i];
          pointer.id = touches[i].identifier;
          pointer.down = true;
          pointer.color = colorArr;
          pointer.moved = pointer.down;
          pointer.dx = (x - pointer.x) * 10.0;
          pointer.dy = (y - pointer.y) * 10.0;
          pointer.x = x;
          pointer.y = y;
        }
      }
    };

    // Add event listeners - use window but don't prevent default for normal scrolling
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Start animation
    update();

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1, // Above galaxy background but behind content
      opacity: 0.8, // Semi-transparent to let galaxy show through
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none', // Don't interfere with page interactions
        }}
      />
    </div>
  );
};

export default FluidWebGLBackground;
