import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";

/**
 * Drifting clouds around the hero beam. Domain-warped fbm, grey with a red cast
 * where the beam lights them (and now and then on its own). The cursor parts the
 * clouds along its path; they drift back in after a couple of seconds.
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
  float nearBeam = exp(-pow(dx / 0.28, 2.0));
  float farBeam = exp(-pow(dx / 0.75, 2.0));
  float zone = clamp(0.95 * nearBeam + 0.35 * farBeam, 0.0, 1.0);
  float floorFade = smoothstep(uFloor - 10.0, uFloor - 190.0, px.y);
  float topFade = 0.45 + 0.55 * smoothstep(0.0, 120.0, px.y);
  // the beam punches a clean channel through
  float channel = 1.0 - 0.92 * exp(-pow((xN - uBeamX) / 0.03, 2.0));
  float dens = smoothstep(0.38 - 0.2 * nearBeam, 0.64, n) * zone * floorFade * topFade * channel;

  // shading: billows catch light on their tops
  float body = smoothstep(0.25, 0.95, fbm(p * 1.4 + r * 1.6));
  vec3 grey = mix(vec3(0.1, 0.092, 0.105), vec3(0.52, 0.47, 0.5), body * body);
  // red cast: lit by the beam, and slow patches drifting through
  float drift = smoothstep(0.56, 0.86, fbm(uv * 0.85 + vec2(t * 0.01, 3.0)));
  float beamLit = exp(-pow(dx / 0.12, 2.0));
  vec3 red = vec3(0.6, 0.12, 0.16);
  vec3 col = mix(grey, grey * 0.5 + red * 0.85, clamp(drift * 0.7 + beamLit * 0.55, 0.0, 0.85));
  // clouds right next to the beam catch its light
  col += vec3(0.55, 0.12, 0.15) * beamLit * body * 0.5;

  // cursor trail parts the clouds; ragged edge from the cloud field itself
  float clear = 0.0;
  for (int i = 0; i < ${TRAIL}; i++) {
    vec4 tr = uTrail[i];
    if (tr.w <= 0.0) continue;
    float d = length(px - tr.xy);
    float rad = 175.0 * (0.8 + 0.45 * n);
    float k = tr.w * exp(-tr.z * 1.05);
    clear = max(clear, k * (1.0 - smoothstep(rad * 0.3, rad, d)));
  }
  dens *= 1.0 - clear;

  // film grain: animated per-pixel speckle so the clouds read as volume, not a smooth gradient
  float g = hash(floor(gl_FragCoord.xy) + fract(t * 6.0) * vec2(13.1, 71.7));
  float g2 = hash(floor(gl_FragCoord.xy * 0.5) + vec2(7.0, 3.0));
  col *= 0.74 + 0.5 * g;
  float a = min(1.0, dens * 1.2) * (0.78 + 0.32 * g) * (0.9 + 0.2 * g2);
  fragColor = vec4(col * a, a);
}
`;

export default function CloudLayer({
  beamX,
  floorPx,
  className,
}: {
  /** beam x as a fraction of the layer width */
  beamX: number;
  /** y of the card top under the beam, css px — clouds dissolve above it */
  floorPx: number;
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef({ beamX, floorPx });
  propsRef.current = { beamX, floorPx };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    // clouds are soft — a reduced buffer keeps it cheap and makes the grain a touch coarser
    const dpr = Math.min(window.devicePixelRatio || 1, 2) * 0.75;
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

    const onMove = (e: PointerEvent) => {
      rect = mount.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      const last = points[points.length - 1];
      if (!last || Math.hypot(x - last.x, y - last.y) > 22) {
        points.push({ x, y, born: performance.now() });
        if (points.length > TRAIL) points.shift();
      } else {
        // keep the newest point glued to the cursor and fresh while hovering in place
        last.x = x;
        last.y = y;
        last.born = performance.now();
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

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
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return <div ref={mountRef} aria-hidden className={className} />;
}
