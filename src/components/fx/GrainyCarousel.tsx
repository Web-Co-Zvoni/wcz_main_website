/**
 * Grainy Carousel — one row of photo cards drifting left to right whose ends blow away like
 * sand. Toward either side of the screen a card crumbles grain by grain, and the grains fly off
 * as dust that carries the photo's own colour and overshoots the card's edge; coming in on the
 * other side the dust settles back into a picture.
 *
 * One WebGL canvas for the whole row: each card is a textured quad whose fragments drop out
 * against a noise threshold that rises toward the screen edges, plus a cloud of points sampled
 * from the same texture that only exist while that part of the card is crumbling. The row
 * moves a card at a time on a curve that dawdles while the cards rest and hurries through the
 * moment one leaves and the next arrives. Captions are HTML laid over the canvas and kept in
 * step every frame. A card in the clear middle opens its `href` on click. Images need CORS (Pexels sends it); without WebGL the row is a static strip.
 */
import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { remScale } from "../../utils/remScale";

export type GrainyItem = {
  src: string;
  alt?: string;
  /** page the card opens when clicked */
  href?: string;
};

type Props = {
  items: GrainyItem[];
  /** caption drawn over card i (HTML, follows the card) */
  renderCaption?: (i: number) => ReactNode;
  /** seconds to move one card along */
  stepDuration?: number;
  /** where the crumbling starts, as a share of the half-width out from the centre */
  zone?: number;
  className?: string;
};

/** room above and below the cards for the dust to fly into, design px (× remScale) */
const PAD = 70;
const GAP = 16;
const RADIUS = 20;
/** dust particles per card: a jittered grid */
const DUST_COLS = 60;
const DUST_ROWS = 58;

/** smaller cards, more of them on screen — and not much taller than wide */
const cardWidth = (w: number, s: number) => Math.min(300 * s, Math.max(190 * s, w * 0.155));
const cardHeight = (cw: number) => Math.round(cw * 0.98);

const SHARED = `
precision highp float;
uniform vec4 u_rect;
uniform vec2 u_res;
uniform float u_zone;
uniform float u_aspect;
float amount(float x) {
  float d = abs(x - u_res.x * 0.5) / (u_res.x * 0.5);
  return smoothstep(u_zone, 1.0, d);
}
vec2 cover(vec2 uv) {
  float ca = u_rect.z / u_rect.w;
  vec2 s = ca > u_aspect ? vec2(1.0, u_aspect / ca) : vec2(ca / u_aspect, 1.0);
  return (uv - 0.5) * s + 0.5;
}
vec2 toClip(vec2 p) {
  vec2 c = p / u_res * 2.0 - 1.0;
  return vec2(c.x, -c.y);
}
`;

const CARD_VERT = `${SHARED}
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
  v_uv = a_uv;
  gl_Position = vec4(toClip(u_rect.xy + a_uv * u_rect.zw), 0.0, 1.0);
}
`;

const CARD_FRAG = `${SHARED}
uniform sampler2D u_tex;
uniform float u_radius;
uniform float u_grain;
uniform float u_light;
uniform float u_seed;
varying vec2 v_uv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float rbox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 px = v_uv * u_rect.zw;
  if (rbox(px - u_rect.zw * 0.5, u_rect.zw * 0.5, u_radius) > 0.0) discard;

  // each grain drops out once the edge amount passes its threshold: fine sand over soft patches
  float a = amount(u_rect.x + px.x) * 1.08;
  vec2 cell = floor(gl_FragCoord.xy / u_grain);
  float n = 0.55 * hash(cell + u_seed) + 0.45 * vnoise(v_uv * vec2(5.0, 6.5) + u_seed);
  if (n < a) discard;

  vec3 col = texture2D(u_tex, cover(v_uv)).rgb * u_light;
  // darker toward the bottom, so the caption reads
  col = mix(col, vec3(0.078, 0.071, 0.082), smoothstep(0.38, 1.0, v_uv.y) * 0.88);
  // grains about to go catch the light
  col += (1.0 - smoothstep(0.0, 0.07, n - a)) * min(a, 1.0) * 0.35;
  gl_FragColor = vec4(col, 1.0);
}
`;

const DUST_VERT = `${SHARED}
attribute vec2 a_uv;
attribute vec4 a_rnd;
uniform float u_dpr;
varying vec2 v_uv;
varying float v_alpha;
void main() {
  vec2 base = u_rect.xy + a_uv * u_rect.zw;
  float a = amount(base.x) * 1.08;
  // a speck sets off when the card has crumbled past its own threshold, and flies outward and up
  float q = clamp((a - a_rnd.x) * 2.4, 0.0, 1.0);
  float side = base.x < u_res.x * 0.5 ? -1.0 : 1.0;
  vec2 drift = vec2(side * (30.0 + 230.0 * a_rnd.y), -(8.0 + 95.0 * a_rnd.z)) * q * q;
  vec2 swirl = vec2(sin(a_rnd.w * 40.0 + q * 5.0), cos(a_rnd.y * 40.0 + q * 4.0)) * 16.0 * q;
  v_uv = a_uv;
  v_alpha = q > 0.0 ? (1.0 - q) * (0.5 + 0.5 * a_rnd.w) : 0.0;
  gl_PointSize = (1.0 + 2.2 * a_rnd.z) * u_dpr;
  gl_Position = vec4(toClip(base + drift + swirl), 0.0, 1.0);
}
`;

const DUST_FRAG = `${SHARED}
uniform sampler2D u_tex;
uniform float u_light;
varying vec2 v_uv;
varying float v_alpha;
void main() {
  if (v_alpha <= 0.0) discard;
  vec2 pc = gl_PointCoord - 0.5;
  if (dot(pc, pc) > 0.25) discard;
  vec3 col = texture2D(u_tex, cover(v_uv)).rgb * (u_light * 1.3);
  gl_FragColor = vec4(col * v_alpha, v_alpha);
}
`;

function program(gl: WebGLRenderingContext, vs: string, fs: string) {
  const make = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? "shader");
    return sh;
  };
  const p = gl.createProgram()!;
  const v = make(gl.VERTEX_SHADER, vs);
  const f = make(gl.FRAGMENT_SHADER, fs);
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  gl.deleteShader(v);
  gl.deleteShader(f);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
  return p;
}

const uniformsOf = (gl: WebGLRenderingContext, p: WebGLProgram, names: string[]) =>
  Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(p, "u_" + n)])) as Record<string, WebGLUniformLocation | null>;

/** position within a step: dawdles near whole steps, hurries in between (never quite stops) */
const stepCurve = (f: number) => f - (0.82 * Math.sin(2 * Math.PI * f)) / (2 * Math.PI);
const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export default function GrainyCarousel({ items, renderCaption, stepDuration = 3, zone = 0.6, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const [size, setSize] = useState({ w: 0, cw: 0, ch: 0, pad: PAD });

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    // a const the hoisted draw() can use without null checks
    const stage: HTMLDivElement = wrap;
    const ctx = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true });
    if (!ctx) {
      setFailed(true);
      return;
    }
    // a const, so the hoisted draw() below keeps the non-null type
    const gl: WebGLRenderingContext = ctx;

    let disposed = false;
    let raf = 0;
    let visible = false;
    let W = 0;
    let H = 0;
    let CW = 0;
    let CH = 0;
    let pitch = 0;
    let pad = PAD;
    let radius = RADIUS;
    let dpr = 1;
    let clock = 0;
    let last = 0;
    let pace = 1;
    let hoverX = -1;
    let hoverY = -1;
    /** the card under the pointer this frame, or -1 */
    let hoveredIndex = -1;
    const lights = items.map(() => 0.62);
    const textures: (WebGLTexture | null)[] = items.map(() => null);
    const aspects = items.map(() => 1);

    let cardP: WebGLProgram;
    let dustP: WebGLProgram;
    let cardU: Record<string, WebGLUniformLocation | null>;
    let dustU: Record<string, WebGLUniformLocation | null>;
    const quad = gl.createBuffer();
    const dustUV = gl.createBuffer();
    const dustRnd = gl.createBuffer();
    const dustCount = DUST_COLS * DUST_ROWS;

    try {
      cardP = program(gl, CARD_VERT, CARD_FRAG);
      dustP = program(gl, DUST_VERT, DUST_FRAG);
    } catch {
      setFailed(true);
      return;
    }
    const shared = ["rect", "res", "zone", "aspect", "tex", "light"];
    cardU = uniformsOf(gl, cardP, [...shared, "radius", "grain", "seed"]);
    dustU = uniformsOf(gl, dustP, [...shared, "dpr"]);

    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);

    // one jittered grid of specks, shared by every card
    const uv = new Float32Array(dustCount * 2);
    const rnd = new Float32Array(dustCount * 4);
    for (let r = 0, k = 0; r < DUST_ROWS; r++)
      for (let c = 0; c < DUST_COLS; c++, k++) {
        uv[k * 2] = (c + Math.random()) / DUST_COLS;
        uv[k * 2 + 1] = (r + Math.random()) / DUST_ROWS;
        for (let j = 0; j < 4; j++) rnd[k * 4 + j] = Math.random();
      }
    gl.bindBuffer(gl.ARRAY_BUFFER, dustUV);
    gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, dustRnd);
    gl.bufferData(gl.ARRAY_BUFFER, rnd, gl.STATIC_DRAW);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    items.forEach((item, i) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.onload = () => {
        if (disposed) return;
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        textures[i] = tex;
        aspects[i] = img.naturalWidth / Math.max(1, img.naturalHeight);
        if (!visible) draw(performance.now());
      };
      img.src = item.src;
    });

    const resize = () => {
      W = wrap.clientWidth;
      const s = remScale();
      pad = Math.round(PAD * s);
      radius = RADIUS * s;
      CW = Math.round(cardWidth(W, s));
      CH = cardHeight(CW);
      H = CH + pad * 2;
      pitch = CW + GAP * s;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      setSize((v) => (v.w === W && v.cw === CW && v.pad === pad ? v : { w: W, cw: CW, ch: CH, pad }));
    };

    const setShared = (u: Record<string, WebGLUniformLocation | null>, x: number, i: number) => {
      gl.uniform4f(u.rect, x, pad, CW, CH);
      gl.uniform2f(u.res, W, H);
      gl.uniform1f(u.zone, zone);
      gl.uniform1f(u.aspect, aspects[i]);
      gl.uniform1i(u.tex, 0);
      gl.uniform1f(u.light, lights[i]);
    };

    function draw(now: number) {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (!W) return;

      // hovering slows the row right down; it picks up again when the pointer leaves
      const hovering = hoverX >= 0;
      pace += ((hovering ? 0.18 : 1) - pace) * Math.min(1, dt * 3);
      if (!reduce) clock += dt * pace;

      const total = pitch * items.length;
      const f = clock / stepDuration;
      const k = Math.floor(f);
      // one card rests in the middle of the screen between steps
      const X = (k + stepCurve(f - k)) * pitch + W / 2 - CW / 2 + pitch;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.activeTexture(gl.TEXTURE0);

      const half = W / 2;
      let underPointer = -1;
      for (let i = 0; i < items.length; i++) {
        const x = ((((i * pitch + X) % total) + total) % total) - pitch;
        const cap = captionRefs.current[i];
        const centre = Math.abs(x + CW / 2 - half) / half;
        const hovered = hovering && hoverX >= x && hoverX <= x + CW && hoverY >= pad && hoverY <= pad + CH && centre < zone;
        if (hovered) underPointer = i;
        lights[i] += ((hovered ? 0.95 : 0.62) - lights[i]) * Math.min(1, dt * 6);

        if (cap) {
          cap.style.transform = `translate3d(${x.toFixed(1)}px,${pad}px,0)`;
          cap.style.opacity = String(1 - smooth(zone - 0.12, zone + 0.22, centre));
          if (cap.dataset.hover !== String(hovered)) cap.dataset.hover = String(hovered);
        }

        const tex = textures[i];
        if (!tex || x > W + 40 || x + CW < -40) continue;
        gl.bindTexture(gl.TEXTURE_2D, tex);

        gl.useProgram(cardP);
        setShared(cardU, x, i);
        gl.uniform1f(cardU.radius, radius);
        gl.uniform1f(cardU.grain, Math.max(1, 2 * dpr));
        gl.uniform1f(cardU.seed, i * 17.3);
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        const cl = gl.getAttribLocation(cardP, "a_uv");
        gl.enableVertexAttribArray(cl);
        gl.vertexAttribPointer(cl, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disableVertexAttribArray(cl);

        // dust only for cards reaching into the crumbling zone
        const reach = Math.max(Math.abs(x - half), Math.abs(x + CW - half)) / half;
        if (reach <= zone) continue;
        gl.useProgram(dustP);
        setShared(dustU, x, i);
        gl.uniform1f(dustU.dpr, dpr);
        const ul = gl.getAttribLocation(dustP, "a_uv");
        const rl = gl.getAttribLocation(dustP, "a_rnd");
        gl.bindBuffer(gl.ARRAY_BUFFER, dustUV);
        gl.enableVertexAttribArray(ul);
        gl.vertexAttribPointer(ul, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, dustRnd);
        gl.enableVertexAttribArray(rl);
        gl.vertexAttribPointer(rl, 4, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.POINTS, 0, dustCount);
        gl.disableVertexAttribArray(ul);
        gl.disableVertexAttribArray(rl);
      }

      if (underPointer !== hoveredIndex) {
        hoveredIndex = underPointer;
        stage.style.cursor = hoveredIndex >= 0 && items[hoveredIndex].href ? "pointer" : "";
      }
    }

    const loop = (now: number) => {
      raf = 0;
      if (disposed || !visible) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      last = 0;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(wrap);
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(wrap);
    resize();

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      hoverX = e.clientX - r.left;
      hoverY = e.clientY - r.top;
    };
    const onLeave = () => {
      hoverX = hoverY = -1;
    };
    const onClick = () => {
      const href = hoveredIndex >= 0 ? items[hoveredIndex].href : undefined;
      if (href) window.location.href = href;
    };
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("click", onClick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("click", onClick);
      textures.forEach((t) => t && gl.deleteTexture(t));
      [quad, dustUV, dustRnd].forEach((b) => gl.deleteBuffer(b));
      gl.deleteProgram(cardP);
      gl.deleteProgram(dustP);
    };
  }, [items, stepDuration, zone, reduce]);

  const height = size.ch ? size.ch + size.pad * 2 : undefined;

  if (failed) {
    // no WebGL: the same cards as a still strip, faded at the sides
    return (
      <div className={cn("flex justify-center gap-5 overflow-hidden py-[5.625rem] [mask-image:linear-gradient(90deg,transparent,#000_20%,#000_80%,transparent)]", className)}>
        {items.map((item, i) => (
          <div key={item.src} className="relative h-[22.5rem] w-[17.5rem] shrink-0 overflow-hidden rounded-[1.5rem]">
            <img src={item.src} alt={item.alt ?? ""} className="size-full object-cover brightness-[0.62]" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
            <div className="absolute inset-0">{renderCaption?.(i)}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className={cn("relative w-full", className)} style={{ height }}>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block size-full" />
      {items.map((item, i) => (
        <div
          key={item.src}
          ref={(el) => {
            captionRefs.current[i] = el;
          }}
          aria-hidden
          className="group/cap pointer-events-none absolute left-0 top-0 will-change-transform"
          style={{ width: size.cw, height: size.ch, opacity: 0 }}
        >
          {renderCaption?.(i)}
        </div>
      ))}
    </div>
  );
}
