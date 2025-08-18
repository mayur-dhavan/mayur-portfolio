"use strict";exports.id=216,exports.ids=[216],exports.modules={2216:(a,b,c)=>{c.r(b),c.d(b,{default:()=>f});var d=c(8732),e=c(2015);let f=()=>{let a=(0,e.useRef)(null),b=(0,e.useRef)(0),c=(0,e.useRef)(null),f=(0,e.useRef)([]),g=(0,e.useRef)([]),h={TEXTURE_DOWNSAMPLE:1,DENSITY_DISSIPATION:.98,VELOCITY_DISSIPATION:.99,PRESSURE_DISSIPATION:.8,PRESSURE_ITERATIONS:25,CURL:30,SPLAT_RADIUS:.005};return(0,e.useEffect)(()=>{let d,e,i,j,k,l,m,n=a.current;if(!n)return;function o(){return{id:-1,x:0,y:0,dx:0,dy:0,down:!1,moved:!1,color:[30,0,300]}}f.current=[],f.current.push(o());class p{constructor(a,b,c){if(this.uniforms={},this.program=a.createProgram(),a.attachShader(this.program,b),a.attachShader(this.program,c),a.linkProgram(this.program),!a.getProgramParameter(this.program,a.LINK_STATUS))throw Error(a.getProgramInfoLog(this.program)||"Program linking failed");let d=a.getProgramParameter(this.program,a.ACTIVE_UNIFORMS);for(let b=0;b<d;b++){let c=a.getActiveUniform(this.program,b)?.name;c&&(this.uniforms[c]=a.getUniformLocation(this.program,c))}}bind(a){a.useProgram(this.program)}}let q=(a,b,c)=>{let d=a.createShader(b);if(a.shaderSource(d,c),a.compileShader(d),!a.getShaderParameter(d,a.COMPILE_STATUS))throw Error(a.getShaderInfoLog(d)||"Shader compilation failed");return d},r=(a=>{let b={alpha:!0,depth:!1,stencil:!1,antialias:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1},c=a.getContext("webgl2",b),d=!!c;if(d||(c=a.getContext("webgl",b)||a.getContext("experimental-webgl",b)),!c)return console.error("WebGL not supported"),null;let e=c.getExtension("OES_texture_half_float"),f=c.getExtension("OES_texture_half_float_linear");d&&(c.getExtension("EXT_color_buffer_float"),f=c.getExtension("OES_texture_float_linear")),c.clearColor(0,0,0,0);let g=d?c.RGBA16F:c.RGBA,h=d?c.RG16F:c.RGBA,i=d?c.RG:c.RGBA,j=d?c.HALF_FLOAT:e?.HALF_FLOAT_OES??c.UNSIGNED_BYTE;return{gl:c,ext:{internalFormat:g,internalFormatRG:h,formatRG:i,texType:j},support_linear_float:f}})(n);if(!r)return;let{gl:s,ext:t,support_linear_float:u}=r;c.current=s;let v=`
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
    `,w=`
      precision highp float; 
      precision mediump sampler2D; 
      varying vec2 vUv; 
      uniform sampler2D uTexture; 
      uniform float value; 
      void main () {     
        gl_FragColor = value * texture2D(uTexture, vUv); 
      }
    `,x=`
      precision highp float; 
      precision mediump sampler2D; 
      varying vec2 vUv; 
      uniform sampler2D uTexture; 
      void main () {     
        gl_FragColor = texture2D(uTexture, vUv); 
      }
    `,y=`
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
    `,z=`
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
    `,A=`
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
    `,B=`
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
    `,C=`
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
    `,D=`
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
    `,E=`
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
    `,F=`
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
    `,G=q(s,s.VERTEX_SHADER,v),H=q(s,s.FRAGMENT_SHADER,w),I=q(s,s.FRAGMENT_SHADER,x),J=q(s,s.FRAGMENT_SHADER,y),K=q(s,s.FRAGMENT_SHADER,A),L=q(s,s.FRAGMENT_SHADER,z),M=q(s,s.FRAGMENT_SHADER,B),N=q(s,s.FRAGMENT_SHADER,C),O=q(s,s.FRAGMENT_SHADER,D),P=q(s,s.FRAGMENT_SHADER,E),Q=q(s,s.FRAGMENT_SHADER,F),R=new p(s,G,H),S=new p(s,G,I),T=new p(s,G,J),U=new p(s,G,u?L:K),V=new p(s,G,M),W=new p(s,G,N),X=new p(s,G,O),Y=new p(s,G,P),Z=new p(s,G,Q),$=(a,b,c,d,e,f,g)=>{s.activeTexture(s.TEXTURE0+a);let h=s.createTexture();s.bindTexture(s.TEXTURE_2D,h),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,g),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,g),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),s.texImage2D(s.TEXTURE_2D,0,d,b,c,0,e,f,null);let i=s.createFramebuffer();return s.bindFramebuffer(s.FRAMEBUFFER,i),s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,h,0),s.viewport(0,0,b,c),s.clear(s.COLOR_BUFFER_BIT),[h,i,a]},_=(a,b,c,d,e,f,g)=>{let h=$(a,b,c,d,e,f,g),i=$(a+1,b,c,d,e,f,g);return{get first(){return h},get second(){return i},swap(){let a=h;h=i,i=a}}},aa=()=>{d=s.drawingBufferWidth>>h.TEXTURE_DOWNSAMPLE,e=s.drawingBufferHeight>>h.TEXTURE_DOWNSAMPLE;let a=t.internalFormat,b=t.internalFormatRG,c=t.formatRG,f=t.texType??s.UNSIGNED_BYTE;i=_(0,d,e,a,s.RGBA,f,u?s.LINEAR:s.NEAREST),j=_(2,d,e,b,c,f,u?s.LINEAR:s.NEAREST),k=$(4,d,e,b,c,f,s.NEAREST),l=$(5,d,e,b,c,f,s.NEAREST),m=_(6,d,e,b,c,f,s.NEAREST)};n.width=n.clientWidth,n.height=n.clientHeight,aa(),s.bindBuffer(s.ARRAY_BUFFER,s.createBuffer()),s.bufferData(s.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),s.STATIC_DRAW),s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,s.createBuffer()),s.bufferData(s.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),s.STATIC_DRAW),s.vertexAttribPointer(0,2,s.FLOAT,!1,0,0),s.enableVertexAttribArray(0);let ab=a=>{s.bindFramebuffer(s.FRAMEBUFFER,a),s.drawElements(s.TRIANGLES,6,s.UNSIGNED_SHORT,0)},ac=(a,b,c,d,e)=>{T.bind(s),s.uniform1i(T.uniforms.uTarget,j.first[2]),s.uniform1f(T.uniforms.aspectRatio,n.width/n.height),s.uniform2f(T.uniforms.point,a/n.width,1-b/n.height),s.uniform3f(T.uniforms.color,c,-d,1),s.uniform1f(T.uniforms.radius,h.SPLAT_RADIUS),ab(j.second[1]),j.swap(),s.uniform1i(T.uniforms.uTarget,i.first[2]),s.uniform3f(T.uniforms.color,.3*e[0],.3*e[1],.3*e[2]),ab(i.second[1]),i.swap()},ad=Date.now(),ae=0,af=[Math.random()+.2,Math.random()+.2,Math.random()+.2],ag=()=>{(n.width!==n.clientWidth||n.height!==n.clientHeight)&&(n.width=n.clientWidth,n.height=n.clientHeight,aa());let a=Math.min((Date.now()-ad)/1e3,.016);if(ad=Date.now(),s.viewport(0,0,d,e),g.current.length>0)for(let a=0;a<g.current.pop();a++){let a=[10*Math.random(),10*Math.random(),10*Math.random()],b=n.width*Math.random();ac(b,n.height*Math.random(),1e3*(Math.random()-.5),1e3*(Math.random()-.5),a)}U.bind(s),s.uniform2f(U.uniforms.texelSize,1/d,1/e),s.uniform1i(U.uniforms.uVelocity,j.first[2]),s.uniform1i(U.uniforms.uSource,j.first[2]),s.uniform1f(U.uniforms.dt,a),s.uniform1f(U.uniforms.dissipation,h.VELOCITY_DISSIPATION),ab(j.second[1]),j.swap(),s.uniform1i(U.uniforms.uVelocity,j.first[2]),s.uniform1i(U.uniforms.uSource,i.first[2]),s.uniform1f(U.uniforms.dissipation,h.DENSITY_DISSIPATION),ab(i.second[1]),i.swap();for(let a=0;a<f.current.length;a++){let b=f.current[a];b.moved&&(ac(b.x,b.y,b.dx,b.dy,b.color),b.moved=!1)}W.bind(s),s.uniform2f(W.uniforms.texelSize,1/d,1/e),s.uniform1i(W.uniforms.uVelocity,j.first[2]),ab(l[1]),X.bind(s),s.uniform2f(X.uniforms.texelSize,1/d,1/e),s.uniform1i(X.uniforms.uVelocity,j.first[2]),s.uniform1i(X.uniforms.uCurl,l[2]),s.uniform1f(X.uniforms.curl,h.CURL),s.uniform1f(X.uniforms.dt,a),ab(j.second[1]),j.swap(),V.bind(s),s.uniform2f(V.uniforms.texelSize,1/d,1/e),s.uniform1i(V.uniforms.uVelocity,j.first[2]),ab(k[1]),R.bind(s);let c=m.first[2];s.activeTexture(s.TEXTURE0+c),s.bindTexture(s.TEXTURE_2D,m.first[0]),s.uniform1i(R.uniforms.uTexture,c),s.uniform1f(R.uniforms.value,h.PRESSURE_DISSIPATION),ab(m.second[1]),m.swap(),Y.bind(s),s.uniform2f(Y.uniforms.texelSize,1/d,1/e),s.uniform1i(Y.uniforms.uDivergence,k[2]);let o=m.first[2];s.activeTexture(s.TEXTURE0+o);for(let a=0;a<h.PRESSURE_ITERATIONS;a++)s.bindTexture(s.TEXTURE_2D,m.first[0]),s.uniform1i(Y.uniforms.uPressure,o),ab(m.second[1]),m.swap();Z.bind(s),s.uniform2f(Z.uniforms.texelSize,1/d,1/e),s.uniform1i(Z.uniforms.uPressure,m.first[2]),s.uniform1i(Z.uniforms.uVelocity,j.first[2]),ab(j.second[1]),j.swap(),s.viewport(0,0,s.drawingBufferWidth,s.drawingBufferHeight),S.bind(s),s.uniform1i(S.uniforms.uTexture,i.first[2]),ab(null),b.current=requestAnimationFrame(ag)},ah=a=>{let b=n.getBoundingClientRect(),c=a.clientX-b.left,d=a.clientY-b.top;if(c<0||c>n.width||d<0||d>n.height)return;++ae>25&&(af=[Math.random()+.2,Math.random()+.2,Math.random()+.2],ae=0);let e=f.current[0];e.down=!0,e.color=af,e.moved=e.down,e.dx=(c-e.x)*10,e.dy=(d-e.y)*10,e.x=c,e.y=d},ai=a=>{let b=a.targetTouches;++ae>25&&(af=[Math.random()+.2,Math.random()+.2,Math.random()+.2],ae=0);let c=n.getBoundingClientRect();for(let a=0;a<b.length;a++){a>=f.current.length&&f.current.push(o());let d=b[a].clientX-c.left,e=b[a].clientY-c.top;if(d>=0&&d<=n.width&&e>=0&&e<=n.height){let c=f.current[a];c.id=b[a].identifier,c.down=!0,c.color=af,c.moved=c.down,c.dx=(d-c.x)*10,c.dy=(e-c.y)*10,c.x=d,c.y=e}}};return window.addEventListener("mousemove",ah),window.addEventListener("touchmove",ai,{passive:!0}),ag(),()=>{b.current&&cancelAnimationFrame(b.current),window.removeEventListener("mousemove",ah),window.removeEventListener("touchmove",ai)}},[]),(0,d.jsx)("div",{style:{position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:-1,opacity:.8},children:(0,d.jsx)("canvas",{ref:a,style:{width:"100%",height:"100%",position:"absolute",top:0,left:0,pointerEvents:"none"}})})}}};