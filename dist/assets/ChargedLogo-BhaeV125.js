import{r as ct,j as Mt}from"./index-CoyNCdvM.js";import{R as re,M as ne,P as he,T as ce}from"./Triangle-DfWMHKQ0.js";const Wt=new Uint8Array(4);function Ot(s){return(s&s-1)===0}let ue=1;class Yt{constructor(e,{image:i,target:t=e.TEXTURE_2D,type:g=e.UNSIGNED_BYTE,format:a=e.RGBA,internalFormat:o=a,wrapS:x=e.CLAMP_TO_EDGE,wrapT:c=e.CLAMP_TO_EDGE,wrapR:u=e.CLAMP_TO_EDGE,generateMipmaps:r=t===(e.TEXTURE_2D||e.TEXTURE_CUBE_MAP),minFilter:R=r?e.NEAREST_MIPMAP_LINEAR:e.LINEAR,magFilter:T=e.LINEAR,premultiplyAlpha:A=!1,unpackAlignment:G=4,flipY:I=t==(e.TEXTURE_2D||e.TEXTURE_3D),anisotropy:y=0,level:P=0,width:C,height:j=C,length:S=1}={}){this.gl=e,this.id=ue++,this.image=i,this.target=t,this.type=g,this.format=a,this.internalFormat=o,this.minFilter=R,this.magFilter=T,this.wrapS=x,this.wrapT=c,this.wrapR=u,this.generateMipmaps=r,this.premultiplyAlpha=A,this.unpackAlignment=G,this.flipY=I,this.anisotropy=Math.min(y,this.gl.renderer.parameters.maxAnisotropy),this.level=P,this.width=C,this.height=j,this.length=S,this.texture=this.gl.createTexture(),this.store={image:null},this.glState=this.gl.renderer.state,this.state={},this.state.minFilter=this.gl.NEAREST_MIPMAP_LINEAR,this.state.magFilter=this.gl.LINEAR,this.state.wrapS=this.gl.REPEAT,this.state.wrapT=this.gl.REPEAT,this.state.anisotropy=0}bind(){this.glState.textureUnits[this.glState.activeTextureUnit]!==this.id&&(this.gl.bindTexture(this.target,this.texture),this.glState.textureUnits[this.glState.activeTextureUnit]=this.id)}update(e=0){const i=!(this.image===this.store.image&&!this.needsUpdate);if((i||this.glState.textureUnits[e]!==this.id)&&(this.gl.renderer.activeTexture(e),this.bind()),!!i){if(this.needsUpdate=!1,this.flipY!==this.glState.flipY&&(this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,this.flipY),this.glState.flipY=this.flipY),this.premultiplyAlpha!==this.glState.premultiplyAlpha&&(this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,this.premultiplyAlpha),this.glState.premultiplyAlpha=this.premultiplyAlpha),this.unpackAlignment!==this.glState.unpackAlignment&&(this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT,this.unpackAlignment),this.glState.unpackAlignment=this.unpackAlignment),this.minFilter!==this.state.minFilter&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_MIN_FILTER,this.minFilter),this.state.minFilter=this.minFilter),this.magFilter!==this.state.magFilter&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_MAG_FILTER,this.magFilter),this.state.magFilter=this.magFilter),this.wrapS!==this.state.wrapS&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_WRAP_S,this.wrapS),this.state.wrapS=this.wrapS),this.wrapT!==this.state.wrapT&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_WRAP_T,this.wrapT),this.state.wrapT=this.wrapT),this.wrapR!==this.state.wrapR&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_WRAP_R,this.wrapR),this.state.wrapR=this.wrapR),this.anisotropy&&this.anisotropy!==this.state.anisotropy&&(this.gl.texParameterf(this.target,this.gl.renderer.getExtension("EXT_texture_filter_anisotropic").TEXTURE_MAX_ANISOTROPY_EXT,this.anisotropy),this.state.anisotropy=this.anisotropy),this.image){if(this.image.width&&(this.width=this.image.width,this.height=this.image.height),this.target===this.gl.TEXTURE_CUBE_MAP)for(let t=0;t<6;t++)this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X+t,this.level,this.internalFormat,this.format,this.type,this.image[t]);else if(ArrayBuffer.isView(this.image))this.target===this.gl.TEXTURE_2D?this.gl.texImage2D(this.target,this.level,this.internalFormat,this.width,this.height,0,this.format,this.type,this.image):(this.target===this.gl.TEXTURE_2D_ARRAY||this.target===this.gl.TEXTURE_3D)&&this.gl.texImage3D(this.target,this.level,this.internalFormat,this.width,this.height,this.length,0,this.format,this.type,this.image);else if(this.image.isCompressedTexture)for(let t=0;t<this.image.length;t++)this.gl.compressedTexImage2D(this.target,t,this.internalFormat,this.image[t].width,this.image[t].height,0,this.image[t].data);else this.target===this.gl.TEXTURE_2D?this.gl.texImage2D(this.target,this.level,this.internalFormat,this.format,this.type,this.image):this.gl.texImage3D(this.target,this.level,this.internalFormat,this.width,this.height,this.length,0,this.format,this.type,this.image);this.generateMipmaps&&(!this.gl.renderer.isWebgl2&&(!Ot(this.image.width)||!Ot(this.image.height))?(this.generateMipmaps=!1,this.wrapS=this.wrapT=this.gl.CLAMP_TO_EDGE,this.minFilter=this.gl.LINEAR):this.gl.generateMipmap(this.target)),this.onUpdate&&this.onUpdate()}else if(this.target===this.gl.TEXTURE_CUBE_MAP)for(let t=0;t<6;t++)this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,this.gl.RGBA,1,1,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,Wt);else this.width?this.target===this.gl.TEXTURE_2D?this.gl.texImage2D(this.target,this.level,this.internalFormat,this.width,this.height,0,this.format,this.type,null):this.gl.texImage3D(this.target,this.level,this.internalFormat,this.width,this.height,this.length,0,this.format,this.type,null):this.gl.texImage2D(this.target,0,this.gl.RGBA,1,1,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,Wt);this.store.image=this.image}}}const $t=`data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><path d="M39 3 12 37h17l-4 24 27-34H35z" fill="#fff"/></svg>')}`,fe=560,L=4,mt=1e20,J=5,dt=3,st=10,ge=4e6,Kt=s=>{let e=String(s||"").replace("#","");e.length===3&&(e=e.replace(/./g,t=>t+t));const i=parseInt(e.slice(0,6),16);return Number.isNaN(i)?[1,1,1]:[(i>>16&255)/255,(i>>8&255)/255,(i&255)/255]},Vt=(s,e,i,t,g)=>{let a=0;i[0]=0,t[0]=-mt,t[1]=mt;for(let o=1;o<g;o++){let x=(s[o]+o*o-(s[i[a]]+i[a]*i[a]))/(2*o-2*i[a]);for(;x<=t[a];)a--,x=(s[o]+o*o-(s[i[a]]+i[a]*i[a]))/(2*o-2*i[a]);a++,i[a]=o,t[a]=x,t[a+1]=mt}a=0;for(let o=0;o<g;o++){for(;t[a+1]<o;)a++;e[o]=(o-i[a])*(o-i[a])+s[i[a]]}},Jt=(s,e,i)=>{const t=Math.max(e,i),g=new Float64Array(t),a=new Float64Array(t),o=new Int32Array(t),x=new Float64Array(t+1);for(let c=0;c<e;c++){for(let u=0;u<i;u++)g[u]=s[u*e+c];Vt(g,a,o,x,i);for(let u=0;u<i;u++)s[u*e+c]=a[u]}for(let c=0;c<i;c++){for(let u=0;u<e;u++)g[u]=s[c*e+u];Vt(g,a,o,x,e);for(let u=0;u<e;u++)s[c*e+u]=a[u]}},Qt=(s,e,i,t,g,a)=>{const o=1/(2*a+1);let x=0;for(let c=0;c<=a&&c<g;c++)x+=s[i+c*t];for(let c=0;c<g;c++)e[i+c*t]=x*o,c+a+1<g&&(x+=s[i+(c+a+1)*t]),c-a>=0&&(x-=s[i+(c-a)*t])},Zt=(s,e,i,t)=>{const g=new Float32Array(e*i);for(let a=0;a<3;a++){for(let o=0;o<i;o++)Qt(s,g,o*e,1,e,t);for(let o=0;o<e;o++)Qt(g,s,o,e,i,t)}},pe=(s,e,i)=>{const t=new Float32Array(e*i);let g=0;for(let r=0;r<e*i;r++)s[r*4+3]<250&&g++;if(g>e*i*.01){for(let r=0;r<e*i;r++)t[r]=s[r*4+3]/255;return t}let a=0,o=0,x=0,c=0;const u=r=>{a+=s[r*4],o+=s[r*4+1],x+=s[r*4+2],c++};for(let r=0;r<e;r++)u(r),u((i-1)*e+r);for(let r=0;r<i;r++)u(r*e),u(r*e+e-1);a/=c,o/=c,x/=c;for(let r=0;r<e*i;r++){const R=Math.max(Math.abs(s[r*4]-a),Math.abs(s[r*4+1]-o),Math.abs(s[r*4+2]-x));t[r]=Math.min(1,Math.max(0,(R-24)/48))}return t},te=(s,e,i)=>{const{field:t,width:g,height:a}=s,o=Math.min(Math.max(e,.5),g-.5),x=Math.min(Math.max(i,.5),a-.5),c=Math.min(Math.floor(o-.5),g-2),u=Math.min(Math.floor(x-.5),a-2),r=o-.5-c,R=x-.5-u,T=u*g+c,A=t[T]+(t[T+1]-t[T])*r,G=t[T+g]+(t[T+g+1]-t[T+g])*r;return A+(G-A)*R+Math.hypot(e-o,i-x)},me=s=>{const e=s.naturalWidth||s.width,i=s.naturalHeight||s.height;if(!e||!i)return null;const t=fe/Math.max(e,i),g=Math.max(2,Math.round(e*t)),a=Math.max(2,Math.round(i*t)),o=document.createElement("canvas");o.width=g,o.height=a;const x=o.getContext("2d",{willReadFrequently:!0});if(!x)return null;x.drawImage(s,0,0,g,a);const c=pe(x.getImageData(0,0,g,a).data,g,a);let u=g,r=a,R=-1,T=-1;for(let n=0;n<a;n++)for(let b=0;b<g;b++)c[n*g+b]<=.01||(b<u&&(u=b),b>R&&(R=b),n<r&&(r=n),n>T&&(T=n));if(R<0)return null;const A=R-u+1,G=T-r+1,I=Math.ceil(Math.max(A,G)*.25)+2,y=A+I*2,P=G+I*2,C=new Float32Array(y*P),j=new Float32Array(y*P);for(let n=0;n<P;n++)for(let b=0;b<y;b++){const l=b-I+u,H=n-I+r,z=l>=0&&H>=0&&l<g&&H<a?c[H*g+l]:0,m=n*y+b;if(z>=1)C[m]=0,j[m]=mt;else if(z<=0)C[m]=mt,j[m]=0;else{const v=.5-z;C[m]=v>0?v*v:0,j[m]=v<0?v*v:0}}Jt(C,y,P),Jt(j,y,P);const S=new Float32Array(y*P);for(let n=0;n<y*P;n++)S[n]=Math.sqrt(C[n])-Math.sqrt(j[n]);const W=[];for(let n=1;n<P-1;n++)for(let b=1;b<y-1;b++){const l=n*y+b,H=S[l];if(H>0||S[l-1]<=0&&S[l+1]<=0&&S[l-y]<=0&&S[l+y]<=0)continue;const z=S[l+1]-S[l-1],m=S[l+y]-S[l-y],v=Math.hypot(z,m)||1;W.push(b+.5-H*z/v,n+.5-H*m/v)}const Q=Math.max(1,Math.ceil(W.length/2/3e3))*2,lt=[];for(let n=0;n<W.length;n+=Q)lt.push(W[n],W[n+1]);const rt=Math.max(A,G),M=Math.ceil(rt*.7/L),F=Math.ceil(A/L)+M*2,w=Math.ceil(G/L)+M*2,$=new Float32Array(F*w);for(let n=0;n<P;n++){const b=Math.floor((n-I)/L)+M;for(let l=0;l<y;l++){const H=Math.floor((l-I)/L)+M;$[b*F+H]+=Math.exp(-Math.abs(S[n*y+l])/1.5)/(L*L)}}const B=$.slice(),Z=Math.max(1,Math.round(rt*.035/L)),D=Math.max(2,Math.round(rt*.13/L));Zt($,F,w,Z),Zt(B,F,w,D);const tt=Math.sqrt(2*Math.PI*(Z*Z+Z))*L/3,et=Math.sqrt(2*Math.PI*(D*D+D))*L/3,O=new Float32Array(F*w*2);for(let n=0;n<F*w;n++)O[n*2]=$[n]*tt,O[n*2+1]=B[n]*et;return{field:S,edges:lt,width:y,height:P,pad:I,logoWidth:A,logoHeight:G,glow:O,glowWidth:F,glowHeight:w,glowOffset:I-M*L}},Pt=(s,e,i)=>{const{edges:t,logoWidth:g,logoHeight:a}=s,o=t.length/2;if(o<2)return null;const x=Math.max(g,a);let c=Math.floor(Math.random()*o);if(i){let R=!1;for(let T=0;T<40&&!R;T++){const A=Math.floor(Math.random()*o);Math.hypot(t[A*2]-i.x,t[A*2+1]-i.y)<i.radius&&(c=A,R=!0)}if(!R)return null}const u=t[c*2],r=t[c*2+1];for(let R=0;R<24;R++){const T=Math.floor(Math.random()*o),A=t[T*2],G=t[T*2+1],I=Math.hypot(A-u,G-r);if(I<x*.08||I>x*.3)continue;const y=-(G-r)/I,P=(A-u)/I,C=I*(.2+Math.random()*.3),j=(u+A)/2,S=(r+G)/2,W=te(s,j+y*C,S+P*C),Q=te(s,j-y*C,S-P*C);if(!(Math.max(W,Q)<=0))return{ax:u,ay:r,bx:A,by:G,bow:W>=Q?C:-C,seed:1+Math.random()*60,born:e,life:.35+Math.random()*.45}}return null},de=`#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,ve=`#version 300 es
precision highp float;
precision highp int;

uniform sampler2D tFieldFrom;
uniform sampler2D tGlowFrom;
uniform sampler2D tFieldTo;
uniform sampler2D tGlowTo;
uniform vec4 uMapFrom;
uniform vec4 uSizeFrom;
uniform vec4 uMapTo;
uniform vec4 uSizeTo;
uniform float uMorph;
uniform vec2 uResolution;
uniform float uUnit;
uniform float uTime;
uniform float uPresence;
uniform vec3 uHover;
uniform float uHoverRadius;
uniform vec4 uPulses[${dt}];
uniform vec4 uDrops[${st}];
uniform vec4 uDropDrag[${st}];
uniform float uPulseBoost;
uniform float uFlash;
uniform vec3 uColor;
uniform vec3 uGlowColor;
uniform float uIntensity;
uniform float uGlow;
uniform float uThickness;
uniform float uStrands;
uniform float uBend;
uniform float uCrackle;
uniform float uFlicker;
uniform float uFill;
uniform float uInk;
uniform vec4 uArcEnds[${J}];
uniform vec4 uArcShape[${J}];

in vec2 vUv;
out vec4 fragColor;

uint scramble(uint x) {
  x ^= x >> 16u;
  x *= 0x7feb352du;
  x ^= x >> 15u;
  x *= 0x846ca68bu;
  x ^= x >> 16u;
  return x;
}

float fieldAt(sampler2D tex, vec4 map, vec4 size, vec2 p) {
  vec2 f = (p - map.xy) / map.z;
  vec2 c = clamp(f, vec2(0.5), size.xy - 0.5);
  return (textureLod(tex, c / size.xy, 0.0).r + length(f - c)) * map.z;
}

vec2 glowAt(sampler2D tex, vec4 map, vec4 size, vec2 p) {
  vec2 f = (p - map.xy) / map.z - map.w;
  return textureLod(tex, f / (size.zw * ${L}.0), 0.0).rg;
}

float shape(vec2 p, float k) {
  float to = fieldAt(tFieldTo, uMapTo, uSizeTo, p);
  if (k >= 1.0) return to;
  return mix(fieldAt(tFieldFrom, uMapFrom, uSizeFrom, p), to, k);
}

vec2 aura(vec2 p, float k) {
  vec2 to = glowAt(tGlowTo, uMapTo, uSizeTo, p);
  if (k >= 1.0) return to;
  return mix(glowAt(tGlowFrom, uMapFrom, uSizeFrom, p), to, k);
}

vec4 corner(ivec2 c, uint seed) {
  uint h = scramble(uint(c.x) * 0x8da6b343u + uint(c.y) * 0xd8163841u + seed * 0xcb1ab31fu);
  return vec4(uvec4(h, h >> 8u, h >> 16u, h >> 24u) & 255u) / 127.5 - 1.0;
}

vec2 drift(vec2 p, uint seed, out mat2 jac) {
  vec2 i = floor(p);
  vec2 f = p - i;
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
  ivec2 c = ivec2(i);
  vec4 ga = corner(c, seed);
  vec4 gb = corner(c + ivec2(1, 0), seed);
  vec4 gc = corner(c + ivec2(0, 1), seed);
  vec4 gd = corner(c + ivec2(1, 1), seed);
  vec2 fb = f - vec2(1.0, 0.0);
  vec2 fc = f - vec2(0.0, 1.0);
  vec2 fd = f - vec2(1.0);
  vec2 va = vec2(dot(ga.xy, f), dot(ga.zw, f));
  vec2 vb = vec2(dot(gb.xy, fb), dot(gb.zw, fb));
  vec2 vc = vec2(dot(gc.xy, fc), dot(gc.zw, fc));
  vec2 vd = vec2(dot(gd.xy, fd), dot(gd.zw, fd));
  vec2 k = va - vb - vc + vd;
  vec4 g = ga + u.x * (gb - ga) + u.y * (gc - ga) + u.x * u.y * (ga - gb - gc + gd);
  jac = mat2(
    g.xy + du * (u.yx * k.x + vec2(vb.x - va.x, vc.x - va.x)),
    g.zw + du * (u.yx * k.y + vec2(vb.y - va.y, vc.y - va.y))
  );
  return va + u.x * (vb - va) + u.y * (vc - va) + u.x * u.y * k;
}

float wobble(vec2 p, uint seed) {
  mat2 jac;
  return drift(p, seed, jac).x;
}

// liquid hover: every trail point drags the outline along the cursor path,
// overshoots back like a jelly and settles within a couple of seconds
vec2 liquidPush(vec2 p) {
  vec2 push = vec2(0.0);
  float rad = uUnit * 13.0;
  for (int i = 0; i < ${st}; i++) {
    vec4 d = uDrops[i];
    if (d.w <= 0.0) continue;
    vec2 rel = p - d.xy;
    float fall = exp(-dot(rel, rel) / (rad * rad));
    if (fall < 0.002) continue;
    float age = d.z;
    float wob = exp(-age * 2.1) * cos(age * 8.5);
    push += uDropDrag[i].xy * fall * wob * d.w;
    // a soft swell around the touch point, like surface tension
    push += rel / max(length(rel), 1.0) * fall * exp(-age * 3.2) * sin(age * 7.0) * uUnit * 0.07 * d.w;
  }
  return push;
}

vec2 ripple(vec2 p, out float surge) {
  vec2 push = vec2(0.0);
  surge = 0.0;
  float width = uUnit * 10.0;
  for (int i = 0; i < ${dt}; i++) {
    vec4 pulse = uPulses[i];
    if (pulse.w <= 0.0) continue;
    vec2 d = p - pulse.xy;
    float dist = length(d);
    float front = (dist - pulse.z * uUnit * 150.0) / width;
    float env = exp(-front * front) * pulse.w * exp(-pulse.z * 1.7) * smoothstep(0.0, uUnit * 8.0, dist);
    push += d / max(dist, 1.0) * env * cos(front * 2.2) * uUnit * 7.5;
    surge += env;
  }
  return push;
}

vec2 wander(vec2 p, float t, uint seed, float reachScale, out mat2 jac, out vec2 sway) {
  vec2 q = p / uUnit;
  mat2 ja;
  mat2 jb;
  mat2 jc;
  mat2 jd;
  vec2 a = drift(q * 0.028 + vec2(t * 0.29, t * 0.21), seed, ja);
  vec2 b = drift(q * 0.085 + a * 0.4 + vec2(t * 0.83, -t * 0.61) + 17.0, seed + 1u, jb);
  vec2 c = drift(p / 9.0 + b * 0.6 + vec2(t * 1.9, t * 1.3) + 5.0, seed + 2u, jc);
  vec2 d = drift(p / 4.1 + vec2(-t * 2.7, t * 2.2) + 11.0, seed + 3u, jd);
  float bendAmp = uBend * 8.0 * reachScale;
  float rippleAmp = uBend * 3.2 * reachScale;
  float crinkleAmp = uCrackle * 1.5 * reachScale;
  jac = ja * (0.028 * bendAmp) + jb * (0.085 * rippleAmp) + jc * (crinkleAmp / 9.0) + jd * (crinkleAmp * 0.35 / 4.1);
  sway = (a * bendAmp + b * rippleAmp) * uUnit;
  return sway + (c + d * 0.35) * crinkleAmp;
}

vec2 glowShape(float line, float spread, float w) {
  float x = abs(line);
  float y = abs(spread);
  return vec2(exp(-x * x / (w * w * 0.5)) + exp(-y / (w * 2.2)) * 0.6, exp(-y / (w * 4.5)) * 0.5);
}

void addArc(vec2 p, vec4 ends, vec4 info, float t, inout vec3 light, inout float energy, inout float hot) {
  if (info.y < 0.002) return;
  vec2 ab = ends.zw - ends.xy;
  float len = max(length(ab), 1.0);
  vec2 dir = ab / len;
  vec2 rel = p - ends.xy;
  float s = dot(rel, dir);
  float h = dot(rel, vec2(-dir.y, dir.x));
  float margin = abs(info.x) + uCrackle * (2.0 + len * 0.08) + uThickness * 12.0 + 10.0;
  if (s < -margin || s > len + margin || abs(h) > margin) return;
  float u = clamp(s / len, 0.0, 1.0);
  float taper = sin(3.14159265 * u);
  float bendSlope = s > 0.0 && s < len ? 3.14159265 / len * cos(3.14159265 * u) : 0.0;
  float beyond = max(-s, 0.0) + max(s - len, 0.0);
  for (int c = 0; c < 2; c++) {
    uint seed = uint(info.z * 131.0) + uint(c) * 29u + 7u;
    float jag = 0.0;
    float jagSlope = 0.0;
    float wave = max(len * 0.3, 14.0);
    float weight = uCrackle * (1.5 + len * 0.05) * (c == 0 ? 1.0 : 1.5);
    for (int o = 0; o < 3; o++) {
      mat2 jac;
      float n = drift(vec2(s / wave + info.z * 3.0, t * (1.4 + float(o) * 1.1)), seed + uint(o), jac).x;
      jag += n * weight;
      jagSlope += jac[0].x * weight / wave;
      wave *= 0.42;
      weight *= 0.4;
    }
    float offset = (info.x + jag) * taper;
    float offsetSlope = (info.x + jag) * bendSlope + jagSlope * taper;
    float across = (h - offset) / sqrt(1.0 + offsetSlope * offsetSlope);
    float gap = length(vec2(beyond, across));
    float w = uThickness * (c == 0 ? 0.9 : 0.6);
    vec2 g = glowShape(gap, gap, w);
    float k = info.y * (c == 0 ? 1.0 : 0.45);
    light += (uColor * g.x + uGlowColor * g.y * uGlow) * k;
    energy += (g.x + g.y * uGlow) * k;
    hot += exp(-gap * gap / (w * w * 0.16)) * k * (c == 0 ? 1.0 : 0.0);
  }
}

void main() {
  vec2 p = vec2(vUv.x, 1.0 - vUv.y) * uResolution;
  float t = uTime;
  vec3 light = vec3(0.0);
  float energy = 0.0;
  float hot = 0.0;

  float surge;
  vec2 pr = p - ripple(p, surge) - liquidPush(p);
  float k = uMorph >= 1.0 ? 1.0 : smoothstep(0.0, 1.0, clamp(uMorph * 1.7 - 0.35 + 0.35 * wobble(p / uUnit * 0.018, 41u), 0.0, 1.0));
  float transit = uMorph >= 1.0 ? 0.0 : sin(3.14159265 * uMorph);
  float base = shape(pr, k);

  vec2 toHover = p - uHover.xy;
  float heat = min(uHover.z * exp(-dot(toHover, toHover) / (uHoverRadius * uHoverRadius)) + surge * 1.4 + transit * 0.5, 2.0);
  float heatCap = min(uHover.z + uPulseBoost * 1.4 + transit * 0.5, 2.0);
  float breath = 1.0 + uFlicker * 0.6 * wobble(vec2(t * 2.1, 7.0), 3u);
  float grow = uPresence;

  float edge = abs(base);
  vec2 halo = aura(pr, k);
  float ink = uInk;
  float bloom = (halo.x * 0.16 + halo.y * 0.08) * (1.0 - ink * 0.65) * uGlow * (1.0 + heat * 1.2);
  float body = smoothstep(0.75, -0.75, base) * uFill * (0.06 + 1.2 * min(halo.x, 1.0)) * (1.0 + heat * 0.5);
  light += uGlowColor * bloom * grow * grow;
  energy += bloom * grow * grow;

  float reachScale = mix(0.15, 1.0, grow) * (1.0 + heat * 0.9);
  float reach = (uUnit * uBend * 16.0 + uCrackle * 3.0) * (1.0 + heatCap * 0.9) + uThickness * 20.0 + 8.0;
  if (edge < reach && grow > 0.0) {
    float fade = smoothstep(reach, reach * 0.55, edge);
    vec2 q = pr / uUnit;
    float count = min(uStrands + heat * 2.5, 6.0);
    float limit = min(uStrands + heatCap * 2.5, 6.0);
    for (int i = 0; i < 6; i++) {
      float fi = float(i);
      if (fi >= limit) break;
      float present = clamp(count - fi, 0.0, 1.0);
      if (present <= 0.0) continue;
      uint seed = uint(i) * 7u + 3u;
      mat2 jac;
      vec2 sway;
      float lead = i == 0 ? 1.0 : 0.0;
      vec2 warped = pr + wander(pr, t * (1.0 + fi * 0.19), seed, reachScale * mix(0.6 + fi * 0.2, 0.7, lead), jac, sway);
      float dw = shape(warped, k);
      vec2 slope = vec2(shape(warped + vec2(1.0, 0.0), k), shape(warped + vec2(0.0, 1.0), k)) - dw;
      float d = dw / max(length(slope + jac * slope), 0.3);
      float spread = shape(pr + sway, k);
      float swell = 0.5 + 0.5 * wobble(q * 0.06 + vec2(t * 0.9, fi * 5.1 - t * 0.6), seed + 8u);
      float w = uThickness * mix(0.5, 1.0, lead) * (0.5 + swell);
      float vis = mix(0.3 + 0.45 * smoothstep(-0.25, 0.2, wobble(q * 0.035 + vec2(t * 0.21, fi * 3.7), seed + 5u)), 1.0, lead);
      float spark = 1.0 - uFlicker * 0.3 * (0.5 + 0.5 * wobble(vec2(t * 6.0, fi * 2.3), seed + 6u));
      float weight = max(vis, heat * 0.85) * spark * fade * present * (0.7 + 0.6 * swell);
      vec2 g = glowShape(d, spread, w) * weight;
      float soft = mix(1.0, mix(0.5, 1.0, lead), ink);
      vec3 stroke = mix(uColor, uGlowColor, ink * (1.0 - lead) * 0.65);
      float haze = uGlow * (1.0 + heat) * (1.0 - ink * 0.7);
      light += stroke * g.x * soft + uGlowColor * g.y * haze;
      energy += g.x * soft + g.y * haze;
      hot += exp(-d * d / (w * w * 0.16)) * lead * weight;
    }
    light *= grow;
    energy *= grow;
  }

  for (int i = 0; i < ${J}; i++) addArc(pr, uArcEnds[i], uArcShape[i], t, light, energy, hot);

  float gain = uIntensity * breath * (1.0 + heat * 0.45) * (1.0 + uFlash * 0.3) * 1.4;
  float alpha = 1.0 - exp(-energy * gain);
  vec3 color = mix(1.0 - exp(-light * gain), alpha * light / max(energy, 1e-4), ink);
  color = mix(color, vec3(alpha), clamp(hot * grow, 0.0, 1.0) * ink * 0.85);
  float tint = (1.0 - exp(-body * gain * 1.2)) * grow * grow * (1.0 - ink * 0.82);
  color += uGlowColor * tint * (1.0 - alpha);
  alpha += tint * (1.0 - alpha);
  float grain = (fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715)))) - 0.5) / 255.0;
  alpha = clamp(alpha + grain, 0.0, 1.0);
  fragColor = vec4(clamp(color + grain, 0.0, alpha), alpha);
}
`,xe=({src:s=$t,color:e="#ecc7ff",glowColor:i="#ad6dff",scale:t=.7,intensity:g=1,glow:a=1,thickness:o=1.5,strands:x=4,bend:c=.6,crackle:u=1.5,arcs:r=1,flicker:R=.6,fill:T=0,speed:A=2.5,interactive:G=!0,cursorIntensity:I=.75,cursorRadius:y=100,liquid:P=0,theme:C="dark",onRender:j,className:S="",style:W})=>{const Q=ct.useRef(null),lt=ct.useRef(null),rt=ct.useRef(null);return ct.useEffect(()=>{lt.current={color:e,glowColor:i,scale:t,intensity:g,glow:a,thickness:o,strands:x,bend:c,crackle:u,arcs:r,flicker:R,fill:T,speed:A,interactive:G,cursorIntensity:I,cursorRadius:y,liquid:P,theme:C,onRender:j}}),ct.useEffect(()=>{let M=!0;const F=new Image;return F.crossOrigin="anonymous",F.decoding="async",F.onload=()=>{if(!M)return;let w=null;try{w=me(F)}catch{w=null}w&&(rt.current=w)},F.src=s||$t,()=>{M=!1,F.onload=null}},[s]),ct.useEffect(()=>{const M=Q.current;if(!M)return;const F=new re({dpr:Math.min(window.devicePixelRatio||1,2),alpha:!0,premultipliedAlpha:!0,antialias:!1}),w=F.gl,$=w;if(!F.isWebgl2){w.getExtension("WEBGL_lose_context")?.loseContext();return}w.clearColor(0,0,0,0);const B=w.canvas;B.style.display="block",B.style.width="100%",B.style.height="100%",M.appendChild(B);const Z=()=>({shape:null,field:new Yt(w,{image:new Float32Array([1e3]),width:1,height:1,internalFormat:$.R16F,format:$.RED,type:w.FLOAT,minFilter:w.LINEAR,magFilter:w.LINEAR,generateMipmaps:!1,flipY:!1,unpackAlignment:1}),glow:new Yt(w,{image:new Float32Array([0,0]),width:1,height:1,internalFormat:$.RG16F,format:$.RG,type:w.FLOAT,minFilter:w.LINEAR,magFilter:w.LINEAR,generateMipmaps:!1,flipY:!1,unpackAlignment:1})}),D=[Z(),Z()],tt=Array.from({length:J*4},()=>0),et=Array.from({length:J*4},()=>0),O=Array.from({length:dt*4},()=>0),n=Array.from({length:st*4},()=>0),b=Array.from({length:st*4},()=>0),l={tFieldFrom:{value:D[1].field},tGlowFrom:{value:D[1].glow},tFieldTo:{value:D[0].field},tGlowTo:{value:D[0].glow},uMapFrom:{value:[0,0,1,0]},uSizeFrom:{value:[1,1,1,1]},uMapTo:{value:[0,0,1,0]},uSizeTo:{value:[1,1,1,1]},uMorph:{value:1},uResolution:{value:[1,1]},uUnit:{value:1},uTime:{value:0},uPresence:{value:0},uHover:{value:[0,0,0]},uHoverRadius:{value:120},uPulses:{value:O},uDrops:{value:n},uDropDrag:{value:b},uPulseBoost:{value:0},uFlash:{value:0},uColor:{value:[1,1,1]},uGlowColor:{value:[.43,.48,1]},uIntensity:{value:1},uGlow:{value:1},uThickness:{value:1.8},uStrands:{value:3},uBend:{value:1},uCrackle:{value:1},uFlicker:{value:.4},uFill:{value:.5},uInk:{value:0},uArcEnds:{value:tt},uArcShape:{value:et}},H=new ne(w,{geometry:new ce(w),program:new he(w,{vertex:de,fragment:ve,uniforms:l,depthTest:!1,depthWrite:!1})}),z=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches??!1,m={x:0,y:0,over:!1},v={x:0,y:0,vx:0,vy:0,power:0},X=[],it=[],K=[],_={x:0,y:0,vx:0,vy:0,has:!1};let Y=0,ut=null,N=1,vt=null,ft=0,Et=0;const xt=[[1,1,1],[1,1,1]];let Ct=!1,at=0,nt=1,ht=1,gt=0,bt=performance.now(),wt=!0;const ie=(d,f)=>{d.shape=f,d.field.image=f.field,d.field.width=f.width,d.field.height=f.height,d.field.needsUpdate=!0,d.glow.image=f.glow,d.glow.width=f.glowWidth,d.glow.height=f.glowHeight,d.glow.needsUpdate=!0},Dt=(d,f)=>{const k=Math.max(1e-4,Math.min(nt*f.scale/d.logoWidth,ht*f.scale/d.logoHeight));return{fit:k,ox:nt/2-(d.pad+d.logoWidth/2)*k,oy:ht/2-(d.pad+d.logoHeight/2)*k,unit:Math.max(d.logoWidth,d.logoHeight)*k/100}},Gt=()=>{nt=Math.max(1,M.clientWidth),ht=Math.max(1,M.clientHeight),F.dpr=Math.min(window.devicePixelRatio||1,2,Math.sqrt(ge/(nt*ht))),F.setSize(nt,ht),l.uResolution.value=[nt,ht]},Lt=d=>{gt=0;const f=lt.current,k=Math.min(.05,Math.max(0,(d-bt)/1e3));bt=d;const Tt=rt.current;Tt&&Tt!==D[Y].shape&&(ut=Tt),ut&&N>=1&&(D[Y].shape&&(Y=1-Y,N=0,X.length=0),ie(D[Y],ut),ut=null),N<1&&(N=Math.min(1,N+k/(ut?.3:1.6)));const q=D[Y].shape,V=N<1?D[1-Y].shape:null;q&&(ft=Math.min(1,ft+k/1.4));const Ft=ft*ft*(3-2*ft);if(q&&f){const U=Dt(q,f),pt=V?Dt(V,f):U,ae=N*N*(3-2*N),kt=pt.unit+(U.unit-pt.unit)*ae,Rt=f.interactive&&m.over;Rt&&v.power<.01&&(v.x=m.x,v.y=m.y,v.vx=0,v.vy=0),v.vx+=((m.x-v.x)*120-v.vx*19)*k,v.vy+=((m.y-v.y)*120-v.vy*19)*k,v.x+=v.vx*k,v.y+=v.vy*k,v.power+=((Rt?1:0)-v.power)*(1-Math.exp(-k/(Rt?.3:.55)));const oe=z?.2:1;at+=k*f.speed*oe;for(let h=X.length-1;h>=0;h--)at-X[h].born>X[h].life&&X.splice(h,1);const Ht=h=>({x:(h.x-U.ox)/U.fit,y:(h.y-U.oy)/U.fit,radius:Math.max(1,f.cursorRadius)/U.fit});if(vt&&N>=1&&f.arcs>0)for(let h=0;h<3&&X.length<J;h++){const p=Pt(q,at,Ht(vt));p&&X.push(p)}if(vt=null,!z&&Ft>.8&&N>=1&&X.length<J){const h=k*f.speed*f.arcs;if(Math.random()<h*6*v.power*f.cursorIntensity){const p=Pt(q,at,Ht(v));p&&X.push(p)}else if(Math.random()<h*2.2){const p=Pt(q,at,null);p&&X.push(p)}}for(let h=0;h<J;h++){const p=h*4,E=X[h];if(!E){et[p+1]=0;continue}const ot=(at-E.born)/E.life;tt[p]=U.ox+E.ax*U.fit,tt[p+1]=U.oy+E.ay*U.fit,tt[p+2]=U.ox+E.bx*U.fit,tt[p+3]=U.oy+E.by*U.fit,et[p]=E.bow*U.fit,et[p+1]=Math.sin(Math.PI*Math.min(1,Math.max(0,ot)))*Ft,et[p+2]=E.seed}if(f.liquid>0&&!z&&f.interactive&&m.over&&k>0){_.has||(_.x=m.x,_.y=m.y,_.vx=0,_.vy=0,_.has=!0);const h=m.x-_.x,p=m.y-_.y,E=1-Math.exp(-k/.06);_.vx+=(h/k-_.vx)*E,_.vy+=(p/k-_.vy)*E;const ot=Math.max(6,kt*4),_t=K[K.length-1];if(!_t||Math.hypot(m.x-_t.x,m.y-_t.y)>ot){const Ut=Math.hypot(_.vx,_.vy),It=Math.min(Ut*.0034,kt*.62)*f.liquid;It>.3&&(K.push({x:m.x,y:m.y,dx:_.vx/(Ut||1)*It,dy:_.vy/(Ut||1)*It,born:d}),K.length>st&&K.shift())}_.x=m.x,_.y=m.y}else _.has=!1;for(let h=K.length-1;h>=0;h--)(d-K[h].born)/1e3>2.6&&K.splice(h,1);for(let h=0;h<st;h++){const p=h*4,E=K[h];if(!E){n[p+3]=0;continue}n[p]=E.x,n[p+1]=E.y,n[p+2]=(d-E.born)/1e3,n[p+3]=1,b[p]=E.dx,b[p+1]=E.dy}let St=0,Xt=0;for(let h=it.length-1;h>=0;h--)(d-it[h].born)/1e3>2&&it.splice(h,1);for(let h=0;h<dt;h++){const p=h*4,E=it[h];if(!E){O[p+3]=0;continue}const ot=(d-E.born)/1e3;O[p]=E.x,O[p+1]=E.y,O[p+2]=ot,O[p+3]=1,St=Math.max(St,Math.exp(-ot*1.7)),Xt+=Math.exp(-ot*7)}const qt=D[1-Y];l.tFieldTo.value=D[Y].field,l.tGlowTo.value=D[Y].glow,l.tFieldFrom.value=qt.field,l.tGlowFrom.value=qt.glow,l.uMapTo.value=[U.ox,U.oy,U.fit,q.glowOffset],l.uSizeTo.value=[q.width,q.height,q.glowWidth,q.glowHeight],V&&(l.uMapFrom.value=[pt.ox,pt.oy,pt.fit,V.glowOffset],l.uSizeFrom.value=[V.width,V.height,V.glowWidth,V.glowHeight]),l.uMorph.value=N,l.uUnit.value=kt,l.uTime.value=at,l.uPresence.value=Ft,l.uHover.value=[v.x,v.y,v.power*Math.max(0,f.cursorIntensity)],l.uHoverRadius.value=Math.max(1,f.cursorRadius),l.uPulseBoost.value=St,l.uFlash.value=Xt;const se=[Kt(f.color),Kt(f.glowColor)],le=Ct?1-Math.exp(-k/.35):1;Ct=!0;for(let h=0;h<2;h++)for(let p=0;p<3;p++)xt[h][p]+=(se[h][p]-xt[h][p])*le;l.uColor.value=xt[0].slice(),l.uGlowColor.value=xt[1].slice(),l.uIntensity.value=f.intensity,l.uGlow.value=f.glow,l.uThickness.value=f.thickness,l.uStrands.value=Math.max(1,Math.min(6,Math.round(f.strands))),l.uBend.value=f.bend,l.uCrackle.value=f.crackle,l.uFlicker.value=z?0:f.flicker,Et+=((f.theme==="light"?1:0)-Et)*(1-Math.exp(-k/.25)),l.uFill.value=f.fill,l.uInk.value=Et,F.render({scene:H}),f.onRender?.(B)}wt&&(gt=requestAnimationFrame(Lt))},jt=()=>{gt||!wt||(bt=performance.now(),gt=requestAnimationFrame(Lt))},At=d=>{const f=M.getBoundingClientRect();m.x=d.clientX-f.left,m.y=d.clientY-f.top,m.over=!0},zt=d=>{At(d),!(!lt.current?.interactive||z)&&(it.push({x:m.x,y:m.y,born:performance.now()}),it.length>dt&&it.shift(),vt={x:m.x,y:m.y})},yt=()=>{m.over=!1};M.addEventListener("pointermove",At),M.addEventListener("pointerdown",zt),M.addEventListener("pointerleave",yt),M.addEventListener("pointercancel",yt);const Nt=new ResizeObserver(Gt);Nt.observe(M);const Bt=new IntersectionObserver(([d])=>{wt=d.isIntersecting,jt()});return Bt.observe(M),Gt(),jt(),()=>{wt=!1,cancelAnimationFrame(gt),Nt.disconnect(),Bt.disconnect(),M.removeEventListener("pointermove",At),M.removeEventListener("pointerdown",zt),M.removeEventListener("pointerleave",yt),M.removeEventListener("pointercancel",yt),w.getExtension("WEBGL_lose_context")?.loseContext(),B.parentNode&&B.parentNode.removeChild(B)}},[]),Mt.jsx("div",{ref:Q,className:`electric-logo ${S}`.trim(),style:W})},ee="linear-gradient(to right, transparent, #000 18%, #000 82%, transparent), linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)",we={maskImage:ee,WebkitMaskImage:ee,maskComposite:"intersect",WebkitMaskComposite:"source-in"};function Ee({src:s,scale:e=.7,className:i}){return Mt.jsx("div",{className:i,children:Mt.jsx("div",{className:"h-full w-full",style:we,children:Mt.jsx(xe,{src:s,color:"#fff0ea",glowColor:"#ff3b47",scale:e,strands:3,bend:.32,crackle:.9,arcs:.9,flicker:.45,fill:.3,glow:.5,thickness:1.7,speed:2.2,cursorIntensity:.9,cursorRadius:110,liquid:1,interactive:!0})})})}export{Ee as default};
