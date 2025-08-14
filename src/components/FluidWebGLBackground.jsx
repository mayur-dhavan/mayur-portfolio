import React, { useEffect, useRef } from 'react';

const FluidWebGLBackground = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef();
  const glRef = useRef(null);
  const pointersRef = useRef([]);
  const splatStackRef = useRef([]);
  
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
    const getWebGLContext = (canvas) => {
      const params = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false
      };

      let gl = canvas.getContext('webgl2', params);
      const isWebGL2 = !!gl;

      if (!isWebGL2) {
        gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
      }

      if (!gl) {
        console.error('WebGL not supported');
        return null;
      }

      console.log('WebGL context initialized successfully');

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
      constructor(gl, vertexShader, fragmentShader) {
        this.uniforms = {};
        this.program = gl.createProgram();

        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
          console.error('Program linking error:', gl.getProgramInfoLog(this.program));
          throw new Error(gl.getProgramInfoLog(this.program) || 'Program linking failed');
        }

        console.log('Program linked successfully');

        const uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
        
        for (let i = 0; i < uniformCount; i++) {
          const uniformName = gl.getActiveUniform(this.program, i)?.name;
          if (uniformName) {
            this.uniforms[uniformName] = gl.getUniformLocation(this.program, uniformName);
          }
        }
      }

      bind(gl) {
        gl.useProgram(this.program);
      }
    }

    // Compile shader function
    const compileShader = (gl, type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        throw new Error(gl.getShaderInfoLog(shader) || 'Shader compilation failed');
      }

      console.log('Shader compiled successfully:', type === gl.VERTEX_SHADER ? 'VERTEX' : 'FRAGMENT');
      return shader;
    };

    const webglContext = getWebGLContext(canvas);
    if (!webglContext) return;

    const { gl, ext, support_linear_float } = webglContext;
    glRef.current = gl;

    // Shader sources
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

    const advectionManualFilteringShaderSource = `
      precision highp float; 
      precision mediump sampler2D; 
      varying vec2 vUv; 
      varying vec2 vL; 
      varying vec2 vR; 
      varying vec2 vT; 
      varying vec2 vB; 
      uniform sampler2D uVelocity; 
      uniform sampler2D uSource; 
      uniform vec2 texelSize; 
      uniform float dt; 
      uniform float dissipation; 
      vec4 bilerp (in sampler2D sam, in vec2 uv) {     
        vec4 st;     
        st.xy = floor(uv - 0.5) + 0.5;     
        st.zw = st.xy + 1.0;     
        vec4 uv1 = vec4(st.xy, st.xy) * texelSize.xyxy;     
        vec4 uv2 = vec4(st.zw, st.zw) * texelSize.xyxy;     
        vec4 tex11 = texture2D(sam, uv1.xy);     
        vec4 tex21 = texture2D(sam, uv1.zy);     
        vec4 tex12 = texture2D(sam, uv2.xy);     
        vec4 tex22 = texture2D(sam, uv2.zy);     
        vec2 f = uv - st.xy;     
        return mix(mix(tex11, tex21, f.x), mix(tex12, tex22, f.x), f.y); 
      } 
      void main () {     
        vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;     
        gl_FragColor = dissipation * bilerp(uSource, coord);     
        gl_FragColor.w = 1.0; 
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

    const divergenceShaderSource = `
      precision highp float; 
      precision mediump sampler2D; 
      varying vec2 vUv; 
      varying vec2 vL; 
      varying vec2 vR; 
      varying vec2 vT; 
      varying vec2 vB; 
      uniform sampler2D uVelocity; 
      vec2 boundary (in vec2 uv) {     
        uv = min(max(uv, 0.0), 1.0);     
        return uv; 
      } 
      void main () {     
        float L = texture2D(uVelocity, boundary(vL)).x;     
        float R = texture2D(uVelocity, boundary(vR)).x;     
        float T = texture2D(uVelocity, boundary(vT)).y;     
        float B = texture2D(uVelocity, boundary(vB)).y;     
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
        float L = texture2D(uCurl, vL).x;     
        float R = texture2D(uCurl, vR).x;     
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

    console.log('All shader programs created successfully!');

    // Initialize framebuffers and simulation
    let textureWidth;
    let textureHeight;
    let density;
    let velocity;
    let divergence;
    let curl;
    let pressure;

    const createFBO = (texId, w, h, internalFormat, format, type, param) => {
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

      return {
        texture,
        fbo,
        texId
      };
    };

    const createDoubleFBO = (texId, w, h, internalFormat, format, type, param) => {
      const fbo1 = createFBO(texId, w, h, internalFormat, format, type, param);
      const fbo2 = createFBO(texId + 1, w, h, internalFormat, format, type, param);

      return {
        get read() {
          return fbo1;
        },
        get write() {
          return fbo2;
        },
        swap() {
          const temp = fbo1;
          Object.assign(fbo1, fbo2);
          Object.assign(fbo2, temp);
        }
      };
    };

    const resizeCanvas = () => {
      const displayWidth = Math.floor(canvas.clientWidth);
      const displayHeight = Math.floor(canvas.clientHeight);

      console.log('Canvas dimensions:', displayWidth, 'x', displayHeight);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;

        textureWidth = Math.floor(displayWidth / config.TEXTURE_DOWNSAMPLE);
        textureHeight = Math.floor(displayHeight / config.TEXTURE_DOWNSAMPLE);

        const filterType = support_linear_float ? gl.LINEAR : gl.NEAREST;

        // Clean up existing framebuffers if they exist
        if (density && density.read && density.read.fbo) {
          gl.deleteFramebuffer(density.read.fbo);
          gl.deleteFramebuffer(density.write.fbo);
        }
        if (velocity && velocity.read && velocity.read.fbo) {
          gl.deleteFramebuffer(velocity.read.fbo);
          gl.deleteFramebuffer(velocity.write.fbo);
        }
        if (divergence && divergence.fbo) gl.deleteFramebuffer(divergence.fbo);
        if (curl && curl.fbo) gl.deleteFramebuffer(curl.fbo);
        if (pressure && pressure.read && pressure.read.fbo) {
          gl.deleteFramebuffer(pressure.read.fbo);
          gl.deleteFramebuffer(pressure.write.fbo);
        }

        // Create new framebuffers
        density = createDoubleFBO(0, textureWidth, textureHeight, ext.internalFormat, gl.RGBA, ext.texType, filterType);
        velocity = createDoubleFBO(2, textureWidth, textureHeight, ext.internalFormatRG, ext.formatRG, ext.texType, filterType);
        divergence = createFBO(4, textureWidth, textureHeight, ext.internalFormatRG, ext.formatRG, ext.texType, gl.NEAREST);
        curl = createFBO(5, textureWidth, textureHeight, ext.internalFormatRG, ext.formatRG, ext.texType, gl.NEAREST);
        pressure = createDoubleFBO(6, textureWidth, textureHeight, ext.internalFormatRG, ext.formatRG, ext.texType, gl.NEAREST);
      }
    };

    // Create vertex buffer
    const vertices = new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Enable vertex attribute
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // Initial resize to set up framebuffers
    resizeCanvas();

    // Splat function
    const splat = (x, y, dx, dy, color) => {
      if (!density || !velocity) return;
      
      console.log('Splat function called:', x, y, dx, dy, color); // Debug log
      
      splatProgram.bind(gl);
      gl.uniform1i(splatProgram.uniforms.uTarget, density.read.texId);
      gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height);
      gl.uniform2f(splatProgram.uniforms.point, x / canvas.width, 1.0 - y / canvas.height);
      gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0);
      gl.uniform1f(splatProgram.uniforms.radius, config.SPLAT_RADIUS);
      blit(density.write.fbo);
      density.swap();

      splatProgram.bind(gl);
      gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.texId);
      gl.uniform3f(splatProgram.uniforms.color, dx, -dy, 1.0);
      blit(velocity.write.fbo);
      velocity.swap();
    };

    const blit = (destination) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, destination);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    };

    // Main update function
    const update = () => {
      resizeCanvas();

      // Check if all required variables are initialized
      if (!density || !velocity || !divergence || !curl || !pressure) {
        animationFrameRef.current = requestAnimationFrame(update);
        return;
      }

      // Add occasional automatic splats for visibility
      if (Math.random() < 0.02) { // 2% chance each frame
        const color = [Math.random() * 0.5 + 0.2, Math.random() * 0.5 + 0.2, Math.random() * 0.8 + 0.4];
        splat(
          Math.random() * canvas.width, 
          Math.random() * canvas.height, 
          500 * (Math.random() - 0.5), 
          500 * (Math.random() - 0.5), 
          color
        );
      }

      if (splatStackRef.current.length > 0) {
        for (let i = 0; i < splatStackRef.current.pop(); i++) {
          const color = [Math.random() * 10, Math.random() * 10, Math.random() * 10];
          splat(Math.random() * canvas.width, Math.random() * canvas.height, 1000 * (Math.random() - 0.5), 1000 * (Math.random() - 0.5), color);
        }
      }

      curlProgram.bind(gl);
      gl.uniform2f(curlProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.texId);
      blit(curl.fbo);

      vorticityProgram.bind(gl);
      gl.uniform2f(vorticityProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.texId);
      gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.texId);
      gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
      gl.uniform1f(vorticityProgram.uniforms.dt, 0.016);
      blit(velocity.write.fbo);
      velocity.swap();

      divergenceProgram.bind(gl);
      gl.uniform2f(divergenceProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.texId);
      blit(divergence.fbo);

      clearProgram.bind(gl);
      let pressureTexId = pressure.read.texId;
      gl.activeTexture(gl.TEXTURE0 + pressureTexId);
      gl.bindTexture(gl.TEXTURE_2D, pressure.read.texture);
      gl.uniform1i(clearProgram.uniforms.uTexture, pressureTexId);
      gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE_DISSIPATION);
      blit(pressure.write.fbo);
      pressure.swap();

      pressureProgram.bind(gl);
      gl.uniform2f(pressureProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.texId);

      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.texId);
        blit(pressure.write.fbo);
        pressure.swap();
      }

      gradientSubtractProgram.bind(gl);
      gl.uniform2f(gradientSubtractProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      gl.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.texId);
      gl.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.texId);
      blit(velocity.write.fbo);
      velocity.swap();

      advectionProgram.bind(gl);
      gl.uniform2f(advectionProgram.uniforms.texelSize, 1.0 / textureWidth, 1.0 / textureHeight);
      
      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.texId);
      gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read.texId);
      gl.uniform1f(advectionProgram.uniforms.dt, 0.016);
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
      blit(velocity.write.fbo);
      velocity.swap();

      gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.texId);
      gl.uniform1i(advectionProgram.uniforms.uSource, density.read.texId);
      gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
      blit(density.write.fbo);
      density.swap();

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      displayProgram.bind(gl);
      gl.uniform1i(displayProgram.uniforms.uTexture, density.read.texId);
      
      console.log('Rendering to screen, density texture ID:', density.read.texId); // Debug log
      
      blit(null);

      animationFrameRef.current = requestAnimationFrame(update);
    };

    // Event handlers
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      console.log('Mouse move:', x, y, 'Canvas bounds:', rect); // Debug log

      if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        const pointer = pointersRef.current[0];
        const colorArr = [Math.random() * 0.3 + 0.2, Math.random() * 0.3 + 0.2, Math.random() * 0.6 + 0.3];
        
        pointer.moved = true;
        pointer.dx = (x - pointer.x) * 5.0;
        pointer.dy = (y - pointer.y) * 5.0;
        pointer.x = x;
        pointer.y = y;
        pointer.color = colorArr;

        console.log('Splat triggered:', pointer.dx, pointer.dy); // Debug log

        if (Math.abs(pointer.dx) > 1 || Math.abs(pointer.dy) > 1) {
          splat(x, y, pointer.dx, pointer.dy, colorArr);
        }
      }
    };

    const handleTouchMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const touches = e.touches;

      for (let i = 0; i < touches.length && i < pointersRef.current.length; i++) {
        if (pointersRef.current.length <= i) {
          pointersRef.current.push(pointerPrototype());
        }

        const colorArr = [Math.random() * 0.3, Math.random() * 0.3, Math.random() * 0.6];
        const x = touches[i].clientX - rect.left;
        const y = touches[i].clientY - rect.top;

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

          if (Math.abs(pointer.dx) > 1 || Math.abs(pointer.dy) > 1) {
            splat(x, y, pointer.dx, pointer.dy, colorArr);
          }
        }
      }
    };

    // Add event listeners
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
      zIndex: -1 // Above galaxy background but behind content
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none', // Let events pass through to window
          opacity: 0.8, // Semi-transparent to let galaxy show through
        }}
      />
    </div>
  );
};

export default FluidWebGLBackground;
