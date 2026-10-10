import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

/**
 * Drifting clouds around the hero beam. Domain-warped fbm, grey with a red cast
 * where the beam lights them (and now and then on its own). A bank of cloud sits
 * over the logo, letting it glow faintly through. The cursor parts the clouds along
 * its path and holds them open where it rests; the trail drifts shut after a couple
 * of seconds.
 */

const TRAIL = 8;

const vertex = /* glsl */ `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform float uBeamX;
uniform float uFloor;
// logo behind the clouds: centre x, y and radius in css px (radius 0 = no logo)
uniform vec3 uLogo;
uniform vec4 uTrail[${TRAIL}];
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
  for (int i = 0; i < ${TRAIL}; i++) {
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
`;

export default function CloudLayer({
  beamX,
  floorPx,
  logo,
  className,
}: {
  /** beam x as a fraction of the layer width */
  beamX: number;
  /** y of the card top under the beam, css px — clouds dissolve above it */
  floorPx: number;
  /** logo hidden behind the clouds: x as a fraction of the width, y and radius in css px */
  logo?: { x: number; y: number; r: number };
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef({ beamX, floorPx, logo });
  propsRef.current = { beamX, floorPx, logo };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    // clouds are soft — a reduced buffer keeps it cheap and makes the grain a touch coarser
    // phones and tablets (no hover) get a plain 0.75× buffer — dense screens would otherwise fill 2–3× the pixels
    const touch = window.matchMedia("(hover: none)").matches;
    const dpr = (touch ? 1 : Math.min(window.devicePixelRatio || 1, 2)) * 0.75;
    const renderer = new Renderer({ dpr, alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
    const gl = renderer.gl;
    if (!renderer.isWebgl2) return;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    mount.appendChild(canvas);

    const trail = Array.from({ length: TRAIL * 4 }, () => 0);
    const uniforms = {
      uRes: { value: [1, 1] },
      uDpr: { value: dpr },
      uTime: { value: 0 },
      uBeamX: { value: propsRef.current.beamX },
      uFloor: { value: propsRef.current.floorPx },
      uLogo: { value: [0, 0, 0] },
      uTrail: { value: trail },
    };
    const mesh = new Mesh(gl, {
      geometry: new Triangle(gl),
      program: new Program(gl, { vertex, fragment, uniforms, depthTest: false, depthWrite: false }),
    });

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const points: { x: number; y: number; born: number }[] = [];
    let rect = mount.getBoundingClientRect();
    let w = 1;
    let h = 1;

    const resize = () => {
      w = Math.max(1, mount.clientWidth);
      h = Math.max(1, mount.clientHeight);
      renderer.setSize(w, h);
      uniforms.uRes.value = [w, h];
      rect = mount.getBoundingClientRect();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // where the cursor is (viewport coords); the trail is fed from it every frame, so the
    // clouds stay parted under a cursor that's resting — or while the page scrolls under it
    let cursor: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      cursor = { x: e.clientX, y: e.clientY };
    };
    // a finger lifts off and leaves no cursor behind; the mouse leaving the window neither
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") cursor = null;
    };
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) cursor = null;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });

    const feedTrail = (now: number) => {
      if (!cursor) return;
      rect = mount.getBoundingClientRect();
      const x = cursor.x - rect.left;
      const y = cursor.y - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      const last = points[points.length - 1];
      if (!last || Math.hypot(x - last.x, y - last.y) > 22) {
        points.push({ x, y, born: now });
        if (points.length > TRAIL) points.shift();
      } else {
        // keep the newest point glued to the cursor and fresh while hovering in place
        last.x = x;
        last.y = y;
        last.born = now;
      }
    };

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(mount);

    let raf = 0;
    let last = performance.now();
    let time = 17.3;
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!document.hidden) {
        time += dt * (reduce ? 0.15 : 1);
        feedTrail(now);
        for (let i = points.length - 1; i >= 0; i--) {
          if ((now - points[i].born) / 1000 > 3.5) points.splice(i, 1);
        }
        for (let i = 0; i < TRAIL; i++) {
          const pt = points[i];
          const o = i * 4;
          if (!pt) {
            trail[o + 3] = 0;
            continue;
          }
          trail[o] = pt.x;
          trail[o + 1] = pt.y;
          trail[o + 2] = (now - pt.born) / 1000;
          trail[o + 3] = 1;
        }
        uniforms.uTime.value = time;
        uniforms.uBeamX.value = propsRef.current.beamX;
        uniforms.uFloor.value = propsRef.current.floorPx || h;
        const lg = propsRef.current.logo;
        uniforms.uLogo.value = lg ? [lg.x * w, lg.y, lg.r] : [0, 0, 0];
        renderer.render({ scene: mesh });
      }
      if (visible) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("pointerout", onOut);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return <div ref={mountRef} aria-hidden className={className} />;
}
