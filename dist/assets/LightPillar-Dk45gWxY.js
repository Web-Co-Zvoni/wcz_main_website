import{r as F,j as Re}from"./index-C9hU_oKZ.js";const Je=`#version 300 es
in vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`,Ze=`#version 300 es
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
}`,et=`#version 300 es
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
}`,Ee={low:.35,medium:.5,high:.6},tt=2.1,ye=1.4,Te=.25,W=(i,c,m)=>Math.min(m,Math.max(c,i)),ot=i=>1-Math.pow(1-i,3),it=i=>i*i*i*(i*(i*6-15)+10),Me=(i,c)=>{const m=i.createShader(i.VERTEX_SHADER),p=i.createShader(i.FRAGMENT_SHADER),h=i.createProgram();return!m||!p||!h?null:(i.shaderSource(m,Je),i.compileShader(m),i.shaderSource(p,c),i.compileShader(p),i.attachShader(h,m),i.attachShader(h,p),i.bindAttribLocation(h,0,"aPosition"),i.linkProgram(h),{program:h,vertex:m,fragment:p})},be=(i,{program:c,vertex:m,fragment:p})=>{if(i.deleteShader(m),i.deleteShader(p),!i.getProgramParameter(c,i.LINK_STATUS))return i.deleteProgram(c),null;const h={},X=i.getProgramParameter(c,i.ACTIVE_UNIFORMS);for(let C=0;C<X;C++){const I=i.getActiveUniform(c,C);I&&(h[I.name.replace(/\[0\]$/,"")]=i.getUniformLocation(c,I.name))}return{program:c,uniforms:h}};function nt({topColor:i="#5227FF",bottomColor:c="#FF9FFC",intensity:m=1,rotationSpeed:p=.3,flow:h=1,interactive:X=!0,clickPulse:C=!0,glowAmount:I=.002,bloom:Fe=.5,pillarWidth:Ae=3,pillarHeight:Pe=.4,pillarRotation:_e=25,twist:Se=.4,detail:Le=4,noiseIntensity:Ce=.5,fade:Ie=0,intro:Ue=!0,mixBlendMode:De="screen",quality:ke="high",resolution:Ne,maxDpr:qe=2,lightMode:ze=!1,paused:Be=!1,className:Q="",style:We}){const J=F.useRef(null),Z=F.useRef(null),O=F.useRef(null),[Xe,Oe]=F.useState(0),ee={topColor:String(i),bottomColor:String(c),intensity:Math.max(0,m),rotationSpeed:p,flow:h,interactive:X,clickPulse:C,glowAmount:Math.max(0,I),bloom:Math.max(0,Fe),pillarWidth:Math.max(.05,Ae),pillarHeight:Pe,pillarRotation:_e,twist:Se,detail:Math.round(W(Le,1,6)),noiseIntensity:Math.max(0,Ce),fade:W(Ie,0,1),intro:Ue,scale:W(Ne??Ee[ke]??Ee.high,Te,2),maxDpr:Math.max(.5,qe),lightMode:ze,paused:Be},A=F.useRef(ee);return A.current=ee,F.useEffect(()=>{const te=J.current,G=Z.current,oe=G?.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1,stencil:!1,powerPreference:"high-performance"});if(!te||!G||!oe)return;const e=oe,d=G,U=te,Ge=!!e.getExtension("EXT_color_buffer_float"),ie=e.getExtension("KHR_parallel_shader_compile"),k=Me(e,Ze),N=Me(e,et);if(!k||!N)return;const He=(v,P)=>{const ne=t=>{t.preventDefault()},ae=()=>Oe(t=>t+1);d.addEventListener("webglcontextlost",ne),d.addEventListener("webglcontextrestored",ae);const ue=e.createBuffer(),j=e.createVertexArray();e.bindVertexArray(j),e.bindBuffer(e.ARRAY_BUFFER,ue),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);let g=null;const Y=e.createFramebuffer(),x={width:0,height:0},je=(t,r)=>{if(x.width===t&&x.height===r)return;x.width=t,x.height=r,g&&e.deleteTexture(g),g=e.createTexture(),e.bindTexture(e.TEXTURE_2D,g);const n=Math.floor(Math.log2(Math.max(t,r)))+1;e.texStorage2D(e.TEXTURE_2D,n,Ge?e.RGBA16F:e.RGBA8,t,r),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,Y),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,g,0)},_=document.createElement("canvas").getContext("2d",{willReadFrequently:!0}),se=new Map,q=t=>{const r=se.get(t);if(r)return r;let n=[1,1,1];if(_){_.clearRect(0,0,1,1),_.fillStyle="#ffffff",_.fillStyle=t,_.fillRect(0,0,1,1);const[s,R,f]=_.getImageData(0,0,1,1).data;n=[s/255,R/255,f/255]}return se.set(t,n),n},D=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,a={width:1,height:1,ratio:1},S={x:0,y:0,inside:!1},w=[],K=new Float32Array(12),o={clock:0,intro:A.current.intro&&!D?0:1,touch:0,spin:0,lean:0,shift:0,governor:1,slow:0,quick:0};let M=0,E=0,z=!0;const Ye=(t,r,n)=>{const s=a.width/a.height,R=(t/a.width*2-1)*s-o.shift,f=1-r/a.height*2;return Math.sin(n)*R+Math.cos(n)*f};function $(){const t=A.current,r=Math.max(Te,t.scale*o.governor),n=Math.max(1,Math.round(a.width*r)),s=Math.max(1,Math.round(a.height*r));je(n,s);const R=it(o.intro),f=ot(o.intro),y=(t.pillarRotation+o.lean)*Math.PI/180,B=o.clock*.3+o.spin,T=t.pillarWidth*(.3+.7*R);e.bindVertexArray(j);const l=v.uniforms;e.bindFramebuffer(e.FRAMEBUFFER,Y),e.viewport(0,0,x.width,x.height),e.useProgram(v.program),e.uniform1f(l.uTime,o.clock*t.flow),e.uniform2f(l.uResolution,a.width,a.height),e.uniform2f(l.uTarget,x.width,x.height),e.uniform2f(l.uRot,Math.cos(B),Math.sin(B)),e.uniform2f(l.uPillarRot,Math.cos(y),Math.sin(y)),e.uniform2f(l.uWave,Math.sin(t.twist),Math.cos(t.twist)),e.uniform1f(l.uShift,o.shift),e.uniform1f(l.uPillarWidth,T),e.uniform1f(l.uPillarHeight,t.pillarHeight),e.uniform1i(l.uDetail,t.detail),e.uniform3fv(l.uTopColor,q(t.topColor)),e.uniform3fv(l.uBottomColor,q(t.bottomColor)),e.uniform1f(l.uGlowAmount,t.glowAmount),e.uniform1f(l.uWidthNorm,T/3),e.drawArrays(e.TRIANGLES,0,3),e.bindTexture(e.TEXTURE_2D,g),t.bloom>0&&e.generateMipmap(e.TEXTURE_2D),K.fill(0),w.forEach((L,Qe)=>{K.set([L.axis+L.age*1.7,Math.exp(-L.age/(ye*.45)),0,0],Qe*4)});const u=P.uniforms;e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,d.width,d.height),e.useProgram(P.program),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,g),e.uniform1i(u.uField,0),e.uniform2f(u.uFieldSize,x.width,x.height),e.uniform2f(u.uView,d.width,d.height),e.uniform2f(u.uAspect,a.width/a.height,1),e.uniform2f(u.uPillarRot,Math.cos(y),Math.sin(y)),e.uniform1f(u.uShift,o.shift),e.uniform1f(u.uIntensity,t.intensity*(.15+.85*f)*(1+.12*o.touch)),e.uniform1f(u.uNoiseIntensity,t.noiseIntensity),e.uniform1f(u.uLightMode,t.lightMode?1:0);const ge=L=>Math.max(...L)-Math.min(...L),$e=Math.max(ge(q(t.topColor)),ge(q(t.bottomColor)));e.uniform1f(u.uNeutral,1-W(($e-.08)/.12,0,1)),e.uniform1f(u.uBloom,t.bloom),e.uniform1f(u.uFade,t.fade);const we=a.width/a.height+1.2;e.uniform1f(u.uReveal,o.intro>=1?1e4:-we+f*(we*2+1.2)),e.uniform1f(u.uFlare,o.intro>=1?0:(1-f)*1.3*Math.min(1,o.intro*8)),e.uniform4fv(u.uPulses,K),e.drawArrays(e.TRIANGLES,0,3)}const Ke=t=>{t>1/40?(o.slow+=1,o.quick=0):t<1/55&&(o.quick+=1,o.slow=0),o.slow>20?(o.governor=Math.max(.5,o.governor*.85),o.slow=0):o.quick>180&&o.governor<1&&(o.governor=Math.min(1,o.governor*1.1),o.quick=0)},le=t=>{if(M=0,!z||document.hidden)return;const r=A.current,n=E?Math.min(.05,(t-E)/1e3):1/60;E&&Ke((t-E)/1e3),E=t;const s=!r.paused&&!D&&r.rotationSpeed!==0;s&&(o.clock+=n*.96*r.rotationSpeed),!r.intro||D?o.intro=1:o.intro<1&&(o.intro=Math.min(1,o.intro+n/tt));const R=r.interactive&&S.inside&&!D,f=R?S.x/a.width-.5:0,y=1-Math.exp(-n*2.4);o.spin+=(f*1.4-o.spin)*y,o.lean+=(f*9-o.lean)*y,o.shift+=(f*.35*(a.width/a.height)-o.shift)*y,o.touch+=((R?1:0)-o.touch)*(1-Math.exp(-n*3));for(let T=w.length-1;T>=0;T--)w[T].age+=n,w[T].age>ye*2.2&&w.splice(T,1);$();const B=o.intro<1||w.length>0||Math.abs(f*1.4-o.spin)>5e-4||Math.abs((R?1:0)-o.touch)>.002;s||B?M=requestAnimationFrame(le):E=0},b=()=>{!M&&z&&!document.hidden&&(M=requestAnimationFrame(le))},ce=()=>{const t=Math.max(1,U.clientWidth),r=Math.max(1,U.clientHeight),n=Math.min(window.devicePixelRatio||1,A.current.maxDpr);a.width=t,a.height=r,a.ratio=n,d.width=Math.max(1,Math.round(t*n)),d.height=Math.max(1,Math.round(r*n)),M||$(),b()},fe=t=>{const r=U.getBoundingClientRect(),n=t.clientX-r.left,s=t.clientY-r.top;return{x:n,y:s,inside:n>=0&&s>=0&&n<=r.width&&s<=r.height}},me=t=>{const r=fe(t);S.x=r.x,S.y=r.y,S.inside=r.inside,b()},he=t=>{const r=A.current;if(!r.clickPulse||D)return;const n=fe(t);if(!n.inside)return;const s=(r.pillarRotation+o.lean)*Math.PI/180;w.push({axis:Ye(n.x,n.y,s),age:0}),w.length>3&&w.shift(),b()},de=()=>{S.inside=!1,b()},ve=()=>{E=0,b()},xe=new ResizeObserver(ce);xe.observe(U);const pe=new IntersectionObserver(t=>{z=t.some(r=>r.isIntersecting),z&&(E=0,b())});return pe.observe(U),window.addEventListener("pointermove",me,{passive:!0}),window.addEventListener("pointerdown",he,{passive:!0}),document.documentElement.addEventListener("pointerleave",de),document.addEventListener("visibilitychange",ve),ce(),O.current=()=>{M||$(),b()},()=>{cancelAnimationFrame(M),O.current=null,d.removeEventListener("webglcontextlost",ne),d.removeEventListener("webglcontextrestored",ae),xe.disconnect(),pe.disconnect(),window.removeEventListener("pointermove",me),window.removeEventListener("pointerdown",he),document.documentElement.removeEventListener("pointerleave",de),document.removeEventListener("visibilitychange",ve),g&&e.deleteTexture(g),e.deleteFramebuffer(Y),e.deleteProgram(v.program),e.deleteProgram(P.program),e.deleteBuffer(ue),e.deleteVertexArray(j)}};let H,V=0;const Ve=()=>!ie||[k,N].every(v=>e.getProgramParameter(v.program,ie.COMPLETION_STATUS_KHR)),re=()=>{if(V=0,!Ve()){V=requestAnimationFrame(re);return}const v=be(e,k),P=be(e,N);v&&P&&(H=He(v,P))};return re(),()=>{cancelAnimationFrame(V),H?H():[k,N].forEach(v=>e.deleteProgram(v.program)),setTimeout(()=>{!d.isConnected&&!e.isContextLost()&&e.getExtension("WEBGL_lose_context")?.loseContext()})}},[Xe]),F.useEffect(()=>{O.current?.()}),Re.jsx("div",{ref:J,className:`light-pillar-container${Q?` ${Q}`:""}`,style:{mixBlendMode:De,...We},children:Re.jsx("canvas",{ref:Z,className:"light-pillar-canvas","aria-hidden":"true"})})}export{nt as default};
