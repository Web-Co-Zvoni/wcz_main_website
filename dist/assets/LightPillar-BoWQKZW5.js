import{r as b,j as ve}from"./index-Beq024vx.js";const Ge=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,Ve=`#version 300 es
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uTarget;
uniform vec2 uRot;
uniform vec2 uPillarRot;
uniform vec2 uWave;
uniform float uShift;
uniform float uPillarWidth;
uniform float uPillarHeight;
uniform int uDetail;
uniform vec3 uTopColor;
uniform vec3 uBottomColor;
uniform float uGlowAmount;
uniform float uWidthNorm;
out vec4 outColor;

void main() {
  vec2 vUv = gl_FragCoord.xy / uTarget;
  vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
  uv.x -= uShift;
  uv = vec2(uPillarRot.x * uv.x - uPillarRot.y * uv.y, uPillarRot.y * uv.x + uPillarRot.x * uv.y);

  vec3 ro = vec3(0.0, 0.0, -10.0);
  vec3 rd = normalize(vec3(uv, 1.0));
  vec3 origin = vec3(uRot.x * ro.x - uRot.y * ro.z, ro.y, uRot.y * ro.x + uRot.x * ro.z);
  vec3 dir = vec3(uRot.x * rd.x - uRot.y * rd.z, rd.y, uRot.y * rd.x + uRot.x * rd.z);

  float glow = 0.0;
  float lift = 0.0;
  float t = 0.1;
  for (int i = 0; i < 80; i++) {
    vec3 p = origin + dir * t;
    vec3 q = p;
    q.y = p.y * uPillarHeight + uTime;

    float freq = 1.0;
    float amp = 1.0;
    for (int j = 0; j < 6; j++) {
      if (j >= uDetail) break;
      q.xz = vec2(uWave.y * q.x - uWave.x * q.z, uWave.x * q.x + uWave.y * q.z);
      q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
      freq *= 2.0;
      amp *= 0.5;
    }

    float d = length(cos(q.xz)) - 0.2;
    float bound = length(p.xz) - uPillarWidth;
    float h = max(4.0 - abs(d - bound), 0.0);
    d = max(d, bound) + h * h * 0.015625;
    d = abs(d) * 0.15 + 0.01;

    float weight = 1.0 / d;
    glow += weight;
    lift += clamp((15.0 - p.y) / 30.0, 0.0, 1.0) * weight;

    t += d;
    if (t > 50.0) break;
  }

  vec3 col = tanh((uBottomColor * glow + (uTopColor - uBottomColor) * lift) * uGlowAmount / uWidthNorm);
  float peak = max(col.r, max(col.g, col.b));
  outColor = vec4(col, smoothstep(0.62, 1.0, peak));
}`,He=`#version 300 es
precision highp float;
uniform sampler2D uField;
uniform vec2 uFieldSize;
uniform vec2 uView;
uniform vec2 uAspect;
uniform vec2 uPillarRot;
uniform float uShift;
uniform float uIntensity;
uniform float uNoiseIntensity;
uniform float uLightMode;
uniform float uNeutral;
uniform float uBloom;
uniform float uFade;
uniform float uReveal;
uniform float uFlare;
uniform vec4 uPulses[3];
out vec4 outColor;

vec3 tap(vec2 uv) {
  return textureLod(uField, uv, 0.0).rgb;
}

vec3 bicubic(vec2 uv) {
  vec2 position = uv * uFieldSize;
  vec2 center = floor(position - 0.5) + 0.5;
  vec2 f = position - center;
  vec2 w0 = f * (-0.5 + f * (1.0 - 0.5 * f));
  vec2 w1 = 1.0 + f * f * (-2.5 + 1.5 * f);
  vec2 w2 = f * (0.5 + f * (2.0 - 1.5 * f));
  vec2 w3 = f * f * (-0.5 + 0.5 * f);
  vec2 w12 = w1 + w2;
  vec2 t0 = (center - 1.0) / uFieldSize;
  vec2 t3 = (center + 2.0) / uFieldSize;
  vec2 t12 = (center + w2 / w12) / uFieldSize;
  vec3 result = vec3(0.0);
  result += tap(vec2(t0.x, t0.y)) * w0.x * w0.y;
  result += tap(vec2(t12.x, t0.y)) * w12.x * w0.y;
  result += tap(vec2(t3.x, t0.y)) * w3.x * w0.y;
  result += tap(vec2(t0.x, t12.y)) * w0.x * w12.y;
  result += tap(vec2(t12.x, t12.y)) * w12.x * w12.y;
  result += tap(vec2(t3.x, t12.y)) * w3.x * w12.y;
  result += tap(vec2(t0.x, t3.y)) * w0.x * w3.y;
  result += tap(vec2(t12.x, t3.y)) * w12.x * w3.y;
  result += tap(vec2(t3.x, t3.y)) * w3.x * w3.y;
  return max(result, 0.0);
}

float smootherstep01(float t) {
  t = clamp(t, 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uView;
  vec3 col = bicubic(uv);

  if (uBloom > 0.0) {
    vec4 l3 = textureLod(uField, uv, 3.0);
    vec4 l4 = textureLod(uField, uv, 4.0);
    vec4 l5 = textureLod(uField, uv, 5.0);
    vec4 l6 = textureLod(uField, uv, 6.0);
    float halo = l3.a * 0.3 + l4.a * 0.3 + l5.a * 0.25 + l6.a * 0.15;
    vec3 tint = l4.rgb + l5.rgb;
    tint /= max(max(tint.r, max(tint.g, tint.b)), 0.001);
    vec3 glow = clamp(tint * halo * uBloom * 1.1, 0.0, 1.0);
    col = 1.0 - (1.0 - clamp(col, 0.0, 1.0)) * (1.0 - glow);
  }

  vec2 p = (uv * 2.0 - 1.0) * uAspect;
  p.x -= uShift;
  float axis = uPillarRot.y * p.x + uPillarRot.x * p.y;

  float boost = 0.0;
  for (int i = 0; i < 3; i++) {
    vec4 pulse = uPulses[i];
    if (pulse.y <= 0.0) continue;
    float offset = (axis - pulse.x) / 0.24;
    boost += exp(-offset * offset) * pulse.y;
  }
  float head = (axis - uReveal + 0.35) / 0.3;
  boost += exp(-head * head) * uFlare;
  float lum = max(col.r, max(col.g, col.b));
  col += mix(col, vec3(lum), 0.45) * boost * 1.8;

  col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;
  vec3 result = clamp(col * uIntensity, 0.0, 1.0);

  float mask = smoothstep(uReveal, uReveal - 0.9, axis);
  float edge = uFade * 0.5;
  if (edge > 0.0) {
    mask *= smootherstep01(uv.x / edge) * smootherstep01((1.0 - uv.x) / edge);
    mask *= smootherstep01(uv.y / edge) * smootherstep01((1.0 - uv.y) / edge);
  }

  if (uLightMode > 0.5) {
    float energy = max(result.r, max(result.g, result.b));
    vec3 hue = result / max(energy, 0.001);
    float coverage = smoothstep(0.025, 0.95, energy);
    hue = pow(clamp(hue, 0.0, 1.0), vec3(1.25));
    vec3 tinted = mix(vec3(1.0), hue, coverage * 0.94 * mask);
    vec3 ink = vec3(1.0) - pow(result, vec3(1.6)) * 0.85 * mask;
    result = mix(tinted, ink, uNeutral);
  } else {
    result *= mask;
  }
  outColor = vec4(result, 1.0);
}`,xe={low:.35,medium:.5,high:.6},je=2.1,pe=1.4,ge=.25,B=(i,y,v)=>Math.min(v,Math.max(y,i)),Ye=i=>1-Math.pow(1-i,3),$e=i=>i*i*i*(i*(i*6-15)+10),we=(i,y,v)=>{const f=i.createShader(y);return f?(i.shaderSource(f,v),i.compileShader(f),i.getShaderParameter(f,i.COMPILE_STATUS)?f:(i.deleteShader(f),null)):null},Re=(i,y)=>{const v=we(i,i.VERTEX_SHADER,Ge),f=we(i,i.FRAGMENT_SHADER,y),c=i.createProgram();if(!v||!f||!c)return null;if(i.attachShader(c,v),i.attachShader(c,f),i.bindAttribLocation(c,0,"aPosition"),i.linkProgram(c),i.deleteShader(v),i.deleteShader(f),!i.getProgramParameter(c,i.LINK_STATUS))return i.deleteProgram(c),null;const U={},W=i.getProgramParameter(c,i.ACTIVE_UNIFORMS);for(let _=0;_<W;_++){const L=i.getActiveUniform(c,_);L&&(U[L.name.replace(/\[0\]$/,"")]=i.getUniformLocation(c,L.name))}return{program:c,uniforms:U}};function Qe({topColor:i="#5227FF",bottomColor:y="#FF9FFC",intensity:v=1,rotationSpeed:f=.3,flow:c=1,interactive:U=!0,clickPulse:W=!0,glowAmount:_=.002,bloom:L=.5,pillarWidth:Ee=3,pillarHeight:ye=.4,pillarRotation:Te=25,twist:Me=.4,detail:be=4,noiseIntensity:Fe=.5,fade:Ae=0,intro:Pe=!0,mixBlendMode:Se="screen",quality:_e="high",resolution:Le,maxDpr:Ce=2,lightMode:Ie=!1,paused:Ue=!1,className:Y="",style:De}){const $=b.useRef(null),K=b.useRef(null),X=b.useRef(null),[ke,Ne]=b.useState(0),Q={topColor:String(i),bottomColor:String(y),intensity:Math.max(0,v),rotationSpeed:f,flow:c,interactive:U,clickPulse:W,glowAmount:Math.max(0,_),bloom:Math.max(0,L),pillarWidth:Math.max(.05,Ee),pillarHeight:ye,pillarRotation:Te,twist:Me,detail:Math.round(B(be,1,6)),noiseIntensity:Math.max(0,Fe),fade:B(Ae,0,1),intro:Pe,scale:B(Le??xe[_e]??xe.high,ge,2),maxDpr:Math.max(.5,Ce),lightMode:Ie,paused:Ue},F=b.useRef(Q);return F.current=Q,b.useEffect(()=>{const J=$.current,O=K.current,Z=O?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"});if(!J||!O||!Z)return;const e=Z,h=O,C=J,qe=!!e.getExtension("EXT_color_buffer_float"),D=Re(e,Ve),k=Re(e,He);if(!D||!k)return;const ee=t=>{t.preventDefault()},te=()=>Ne(t=>t+1);h.addEventListener("webglcontextlost",ee),h.addEventListener("webglcontextrestored",te);const oe=e.createBuffer(),G=e.createVertexArray();e.bindVertexArray(G),e.bindBuffer(e.ARRAY_BUFFER,oe),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);let x=null;const V=e.createFramebuffer(),d={width:0,height:0},ze=(t,r)=>{if(d.width===t&&d.height===r)return;d.width=t,d.height=r,x&&e.deleteTexture(x),x=e.createTexture(),e.bindTexture(e.TEXTURE_2D,x);const n=Math.floor(Math.log2(Math.max(t,r)))+1;e.texStorage2D(e.TEXTURE_2D,n,qe?e.RGBA16F:e.RGBA8,t,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,V),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,x,0)},A=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),ie=new Map,N=t=>{const r=ie.get(t);if(r)return r;let n=[1,1,1];if(A){A.clearRect(0,0,1,1),A.fillStyle="#ffffff",A.fillStyle=t,A.fillRect(0,0,1,1);const[s,g,m]=A.getImageData(0,0,1,1).data;n=[s/255,g/255,m/255]}return ie.set(t,n),n},I=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,a={width:1,height:1,ratio:1},P={x:0,y:0,inside:!1},p=[],H=new Float32Array(12),o={clock:0,intro:F.current.intro&&!I?0:1,touch:0,spin:0,lean:0,shift:0,governor:1,slow:0,quick:0};let T=0,w=0,q=!0;const Be=(t,r,n)=>{const s=a.width/a.height,g=(t/a.width*2-1)*s-o.shift,m=1-r/a.height*2;return Math.sin(n)*g+Math.cos(n)*m};function j(){const t=F.current,r=Math.max(ge,t.scale*o.governor),n=Math.max(1,Math.round(a.width*r)),s=Math.max(1,Math.round(a.height*r));ze(n,s);const g=$e(o.intro),m=Ye(o.intro),R=(t.pillarRotation+o.lean)*Math.PI/180,z=o.clock*.3+o.spin,E=t.pillarWidth*(.3+.7*g);e.bindVertexArray(G);const l=D.uniforms;e.bindFramebuffer(e.FRAMEBUFFER,V),e.viewport(0,0,d.width,d.height),e.useProgram(D.program),e.uniform1f(l.uTime,o.clock*t.flow),e.uniform2f(l.uResolution,a.width,a.height),e.uniform2f(l.uTarget,d.width,d.height),e.uniform2f(l.uRot,Math.cos(z),Math.sin(z)),e.uniform2f(l.uPillarRot,Math.cos(R),Math.sin(R)),e.uniform2f(l.uWave,Math.sin(t.twist),Math.cos(t.twist)),e.uniform1f(l.uShift,o.shift),e.uniform1f(l.uPillarWidth,E),e.uniform1f(l.uPillarHeight,t.pillarHeight),e.uniform1i(l.uDetail,t.detail),e.uniform3fv(l.uTopColor,N(t.topColor)),e.uniform3fv(l.uBottomColor,N(t.bottomColor)),e.uniform1f(l.uGlowAmount,t.glowAmount),e.uniform1f(l.uWidthNorm,E/3),e.drawArrays(e.TRIANGLES,0,3),e.bindTexture(e.TEXTURE_2D,x),t.bloom>0&&e.generateMipmap(e.TEXTURE_2D),H.fill(0),p.forEach((S,Oe)=>{H.set([S.axis+S.age*1.7,Math.exp(-S.age/(pe*.45)),0,0],Oe*4)});const u=k.uniforms;e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,h.width,h.height),e.useProgram(k.program),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,x),e.uniform1i(u.uField,0),e.uniform2f(u.uFieldSize,d.width,d.height),e.uniform2f(u.uView,h.width,h.height),e.uniform2f(u.uAspect,a.width/a.height,1),e.uniform2f(u.uPillarRot,Math.cos(R),Math.sin(R)),e.uniform1f(u.uShift,o.shift),e.uniform1f(u.uIntensity,t.intensity*(.15+.85*m)*(1+.12*o.touch)),e.uniform1f(u.uNoiseIntensity,t.noiseIntensity),e.uniform1f(u.uLightMode,t.lightMode?1:0);const he=S=>Math.max(...S)-Math.min(...S),Xe=Math.max(he(N(t.topColor)),he(N(t.bottomColor)));e.uniform1f(u.uNeutral,1-B((Xe-.08)/.12,0,1)),e.uniform1f(u.uBloom,t.bloom),e.uniform1f(u.uFade,t.fade);const de=a.width/a.height+1.2;e.uniform1f(u.uReveal,o.intro>=1?1e4:-de+m*(de*2+1.2)),e.uniform1f(u.uFlare,o.intro>=1?0:(1-m)*1.3*Math.min(1,o.intro*8)),e.uniform4fv(u.uPulses,H),e.drawArrays(e.TRIANGLES,0,3)}const We=t=>{t>1/40?(o.slow+=1,o.quick=0):t<1/55&&(o.quick+=1,o.slow=0),o.slow>20?(o.governor=Math.max(.5,o.governor*.85),o.slow=0):o.quick>180&&o.governor<1&&(o.governor=Math.min(1,o.governor*1.1),o.quick=0)},re=t=>{if(T=0,!q||document.hidden)return;const r=F.current,n=w?Math.min(.05,(t-w)/1e3):1/60;w&&We((t-w)/1e3),w=t;const s=!r.paused&&!I&&r.rotationSpeed!==0;s&&(o.clock+=n*.96*r.rotationSpeed),!r.intro||I?o.intro=1:o.intro<1&&(o.intro=Math.min(1,o.intro+n/je));const g=r.interactive&&P.inside&&!I,m=g?P.x/a.width-.5:0,R=1-Math.exp(-n*2.4);o.spin+=(m*1.4-o.spin)*R,o.lean+=(m*9-o.lean)*R,o.shift+=(m*.35*(a.width/a.height)-o.shift)*R,o.touch+=((g?1:0)-o.touch)*(1-Math.exp(-n*3));for(let E=p.length-1;E>=0;E--)p[E].age+=n,p[E].age>pe*2.2&&p.splice(E,1);j();const z=o.intro<1||p.length>0||Math.abs(m*1.4-o.spin)>5e-4||Math.abs((g?1:0)-o.touch)>.002;s||z?T=requestAnimationFrame(re):w=0},M=()=>{!T&&q&&!document.hidden&&(T=requestAnimationFrame(re))},ne=()=>{const t=Math.max(1,C.clientWidth),r=Math.max(1,C.clientHeight),n=Math.min(window.devicePixelRatio||1,F.current.maxDpr);a.width=t,a.height=r,a.ratio=n,h.width=Math.max(1,Math.round(t*n)),h.height=Math.max(1,Math.round(r*n)),T||j(),M()},ae=t=>{const r=C.getBoundingClientRect(),n=t.clientX-r.left,s=t.clientY-r.top;return{x:n,y:s,inside:n>=0&&s>=0&&n<=r.width&&s<=r.height}},ue=t=>{const r=ae(t);P.x=r.x,P.y=r.y,P.inside=r.inside,M()},se=t=>{const r=F.current;if(!r.clickPulse||I)return;const n=ae(t);if(!n.inside)return;const s=(r.pillarRotation+o.lean)*Math.PI/180;p.push({axis:Be(n.x,n.y,s),age:0}),p.length>3&&p.shift(),M()},le=()=>{P.inside=!1,M()},ce=()=>{w=0,M()},fe=new ResizeObserver(ne);fe.observe(C);const me=new IntersectionObserver(t=>{q=t.some(r=>r.isIntersecting),q&&(w=0,M())});return me.observe(C),window.addEventListener("pointermove",ue,{passive:!0}),window.addEventListener("pointerdown",se,{passive:!0}),document.documentElement.addEventListener("pointerleave",le),document.addEventListener("visibilitychange",ce),ne(),X.current=()=>{T||j(),M()},()=>{cancelAnimationFrame(T),X.current=null,h.removeEventListener("webglcontextlost",ee),h.removeEventListener("webglcontextrestored",te),fe.disconnect(),me.disconnect(),window.removeEventListener("pointermove",ue),window.removeEventListener("pointerdown",se),document.documentElement.removeEventListener("pointerleave",le),document.removeEventListener("visibilitychange",ce),x&&e.deleteTexture(x),e.deleteFramebuffer(V),e.deleteProgram(D.program),e.deleteProgram(k.program),e.deleteBuffer(oe),e.deleteVertexArray(G),setTimeout(()=>{!h.isConnected&&!e.isContextLost()&&e.getExtension("WEBGL_lose_context")?.loseContext()})}},[ke]),b.useEffect(()=>{X.current?.()}),ve.jsx("div",{ref:$,className:`light-pillar-container${Y?` ${Y}`:""}`,style:{mixBlendMode:Se,...De},children:ve.jsx("canvas",{ref:K,className:"light-pillar-canvas","aria-hidden":"true"})})}export{Qe as default};
