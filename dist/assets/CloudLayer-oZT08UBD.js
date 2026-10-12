import{r as k,j as I}from"./index-Bnp2rO8Q.js";import{R as j,M as G,P as H,T as O}from"./Triangle-DfWMHKQ0.js";const m=8,Z=`#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`,$=`#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform float uBeamX;
uniform float uFloor;
// logo behind the clouds: centre x, y and radius in css px (radius 0 = no logo)
uniform vec3 uLogo;
uniform vec4 uTrail[${m}];
out vec4 fragColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  // css px, origin top-left
  vec2 px = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 uv = px / uRes.y;
  float t = uTime;
  float xN = px.x / uRes.x;

  vec2 p = uv * 2.1 + vec2(t * 0.012, -t * 0.004);
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.018)), fbm(p + vec2(5.2, 1.3) - t * 0.012));
  vec2 r = vec2(fbm(p + 3.0 * q + vec2(1.7, 9.2)), fbm(p + 3.0 * q + vec2(8.3, 2.8)));
  float n = fbm(p + 2.4 * r);

  // where clouds live: densest hugging the beam, thinning steadily with distance, gone before the card
  float dx = abs(xN - uBeamX) * uRes.x / uRes.y;
  float nearBeam = exp(-pow(dx / 0.35, 2.0));
  // long, even tail: clouds keep thinning out the further they are from the beam
  float falloff = exp(-dx / 0.45);
  // lighter on the copy side (left), heavier on the logo side (right)
  float side = mix(0.55, 1.0, smoothstep(-0.02, 0.04, xN - uBeamX));
  float zone = (0.6 * nearBeam + 0.5 * falloff) * side;
  float baseZone = zone;
  // clouds bank up around the logo: a broad, soft swell that runs into the rest of the field
  // (tall like the logo box) rather than a patch stuck on top of it
  vec2 toLogo = (px - uLogo.xy) / vec2(1.0, 1.25);
  float overLogo = uLogo.z > 0.0 ? exp(-pow(length(toLogo) / (uLogo.z * 1.6), 4.0)) : 0.0;
  float halo = uLogo.z > 0.0 ? exp(-pow(length(toLogo) / (uLogo.z * 2.6), 2.0)) : 0.0;
  // ...but it stops short of the beam, so the beam isn't buried in it
  halo *= smoothstep(0.06, 0.32, dx);
  zone += 0.45 * overLogo;
  float floorFade = smoothstep(uFloor - 10.0, uFloor - 190.0, px.y);
  float topFade = 0.45 + 0.55 * smoothstep(0.0, 120.0, px.y);
  // the beam punches a clean channel through
  float channel = 1.0 - 0.92 * exp(-pow((xN - uBeamX) / 0.03, 2.0));

  // cursor trail parts the clouds. Bell-shaped falloff with a long tail, its edge warped
  // by the cloud field, and overlapping points merge softly — so the parted patch fades
  // gradually into the untouched clouds around it instead of ending at a rim.
  float keep = 1.0;
  for (int i = 0; i < ${m}; i++) {
    vec4 tr = uTrail[i];
    if (tr.w <= 0.0) continue;
    float rad = 200.0;
    float d = max(0.0, length(px - tr.xy) + (n - 0.5) * rad * 0.7) / rad;
    float k = tr.w * exp(-tr.z * 1.05);
    keep *= 1.0 - k * exp(-d * d * 1.6);
  }
  // the haze hugging the beam holds firm — protection fades out smoothly with distance
  float beamHold = exp(-pow(dx / 0.15, 2.0));
  float clear = (1.0 - keep) * (1.0 - 0.95 * beamHold);

  // full, solid billows close in; ragged patches far out. Inside the cursor's wake
  // the thin wisps go first and the thick billows last.
  float solid = max(falloff, 0.6 * overLogo);
  float lo = mix(0.46, 0.16, solid) + 0.35 * clear;
  float hi = mix(0.7, 0.58, solid) + 0.35 * clear;
  float dens = smoothstep(lo, hi, n) * zone * floorFade * topFade * channel * (1.0 - clear);

  // two more layers with their own shape and pace — fine wisps sliding past quicker, big slow
  // banks behind — so the cover is uneven: thick in places, thin enough to see through in others
  float n2 = fbm(uv * 3.6 + r * 0.9 + vec2(-t * 0.022, t * 0.007));
  float n3 = fbm(uv * 1.15 + q * 0.7 + vec2(t * 0.006, 11.0));
  float layerW = clamp(halo + 0.25 * baseZone, 0.0, 1.0);
  float wisps = smoothstep(0.42 + 0.3 * clear, 0.74 + 0.3 * clear, n2) * 0.65 * layerW;
  float banks = smoothstep(0.36 + 0.3 * clear, 0.68 + 0.3 * clear, n3) * 0.75 * layerW;
  float extra = (1.0 - (1.0 - wisps) * (1.0 - banks)) * floorFade * topFade * channel * (1.0 - clear);
  dens = 1.0 - (1.0 - dens) * (1.0 - extra);

  // shading: billows catch light on their tops
  float body = smoothstep(0.25, 0.95, fbm(p * 1.4 + r * 1.6));
  vec3 grey = mix(vec3(0.1, 0.092, 0.105), vec3(0.52, 0.47, 0.5), body * body);
  // red cast: lit by the beam (strong close in, fading with distance), and slow patches drifting through
  float drift = smoothstep(0.56, 0.86, fbm(uv * 0.85 + vec2(t * 0.01, 3.0)));
  float beamLit = exp(-pow(dx / 0.2, 2.0));
  float beamGlow = exp(-dx / 0.35);
  vec3 red = vec3(0.64, 0.1, 0.14);
  vec3 col = mix(grey, grey * 0.45 + red * 0.95, clamp(drift * 0.7 + beamGlow * 0.75, 0.0, 0.92));
  // clouds right next to the beam catch its light
  col += vec3(0.62, 0.1, 0.13) * beamLit * body * 0.7;

  // film grain: animated per-pixel speckle so the clouds read as volume, not a smooth gradient
  float g = hash(floor(gl_FragCoord.xy) + fract(t * 6.0) * vec2(13.1, 71.7));
  float g2 = hash(floor(gl_FragCoord.xy * 0.5) + vec2(7.0, 3.0));
  col *= 0.74 + 0.5 * g;
  // the banks round the logo are darker, fading out with the swell, so the spot doesn't give the logo away
  col *= 1.0 - 0.35 * halo;
  // over the logo the grain speckles the cover less, so the logo doesn't flicker through it
  float grainA = mix((0.78 + 0.32 * g) * (0.9 + 0.2 * g2), 1.0, 0.6 * overLogo);
  float a = min(1.0, min(1.0, dens * 1.2) * grainA);
  // keep the lower beam and its flare clear and bright: clouds thin out around it towards the card
  float flare = exp(-pow(dx / 0.14, 2.0)) * smoothstep(uFloor - 520.0, uFloor - 60.0, px.y);
  a *= 1.0 - 0.6 * flare;
  fragColor = vec4(col * a, a);
}
`;function J({beamX:F,floorPx:R,logo:C,className:_}){const T=k.useRef(null),l=k.useRef({beamX:F,floorPx:R,logo:C});return l.current={beamX:F,floorPx:R,logo:C},k.useEffect(()=>{const a=T.current;if(!a)return;const z=(window.matchMedia("(hover: none)").matches?1:Math.min(window.devicePixelRatio||1,2))*.75,g=new j({dpr:z,alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1}),s=g.gl;if(!g.isWebgl2)return;s.clearColor(0,0,0,0);const n=s.canvas;n.style.width="100%",n.style.height="100%",n.style.display="block",a.appendChild(n);const c=Array.from({length:m*4},()=>0),u={uRes:{value:[1,1]},uDpr:{value:z},uTime:{value:0},uBeamX:{value:l.current.beamX},uFloor:{value:l.current.floorPx},uLogo:{value:[0,0,0]},uTrail:{value:c}},N=new G(s,{geometry:new O(s),program:new H(s,{vertex:Z,fragment:$,uniforms:u,depthTest:!1,depthWrite:!1})}),P=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,r=[];let h=a.getBoundingClientRect(),v=1,x=1;const B=()=>{v=Math.max(1,a.clientWidth),x=Math.max(1,a.clientHeight),g.setSize(v,x),u.uRes.value=[v,x],h=a.getBoundingClientRect()};B();const E=new ResizeObserver(B);E.observe(a);let d=null;const M=e=>{d={x:e.clientX,y:e.clientY}},b=e=>{e.pointerType==="touch"&&(d=null)},A=e=>{e.relatedTarget||(d=null)};window.addEventListener("pointermove",M,{passive:!0}),window.addEventListener("pointerup",b,{passive:!0}),window.addEventListener("pointercancel",b,{passive:!0}),document.addEventListener("pointerout",A,{passive:!0});const D=e=>{if(!d)return;h=a.getBoundingClientRect();const i=d.x-h.left,o=d.y-h.top;if(i<0||o<0||i>h.width||o>h.height)return;const t=r[r.length-1];!t||Math.hypot(i-t.x,o-t.y)>22?(r.push({x:i,y:o,born:e}),r.length>m&&r.shift()):(t.x=i,t.y=o,t.born=e)};let y=!0;const q=new IntersectionObserver(([e])=>{y=e.isIntersecting,y&&!f&&(f=requestAnimationFrame(L))});q.observe(a);let f=0,X=performance.now(),W=17.3;const L=e=>{f=0;const i=Math.min(.05,(e-X)/1e3);if(X=e,!document.hidden){W+=i*(P?.15:1),D(e);for(let t=r.length-1;t>=0;t--)(e-r[t].born)/1e3>3.5&&r.splice(t,1);for(let t=0;t<m;t++){const w=r[t],p=t*4;if(!w){c[p+3]=0;continue}c[p]=w.x,c[p+1]=w.y,c[p+2]=(e-w.born)/1e3,c[p+3]=1}u.uTime.value=W,u.uBeamX.value=l.current.beamX,u.uFloor.value=l.current.floorPx||x;const o=l.current.logo;u.uLogo.value=o?[o.x*v,o.y,o.r]:[0,0,0],g.render({scene:N})}y&&(f=requestAnimationFrame(L))};return f=requestAnimationFrame(L),()=>{cancelAnimationFrame(f),E.disconnect(),q.disconnect(),window.removeEventListener("pointermove",M),window.removeEventListener("pointerup",b),window.removeEventListener("pointercancel",b),document.removeEventListener("pointerout",A),s.getExtension("WEBGL_lose_context")?.loseContext(),n.parentNode&&n.parentNode.removeChild(n)}},[]),I.jsx("div",{ref:T,"aria-hidden":!0,className:_})}export{J as default};
