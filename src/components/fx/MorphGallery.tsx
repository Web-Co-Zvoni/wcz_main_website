/**
 * Morph Gallery — photos that dissolve into each other through noise instead of cutting or
 * cross-fading. One full-screen shader pass over two textures: an fbm field gives every pixel
 * a threshold, progress sweeps past it, and the threshold is biased by the brightness of the
 * incoming frame so its lit areas burn through first.
 *
 * Adapted for this site from the "morph-gallery" component (raw WebGL, no deps): controlled
 * index (the parent renders the caption), Czech labels, autoplay that also rests while the
 * gallery is off screen, and a canvas that only redraws while something changes instead of
 * every frame. Images need CORS (Pexels sends it); without WebGL or CORS it falls back to a
 * plain cross-fade.
 */
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "../../utils/cn";

export type MorphItem = {
  src: string;
  /** small image for the strip; falls back to `src`, which is wasteful */
  thumb?: string;
  alt?: string;
};

type Props = {
  items: MorphItem[];
  /** controlled index */
  index: number;
  onIndexChange: (index: number) => void;
  /** milliseconds of dissolve */
  duration?: number;
  /** fbm frequency — higher tears into finer shreds */
  noiseScale?: number;
  /** width of the dissolve front; 0 is a hard edge */
  edge?: number;
  /** how far the frames slide against each other while dissolving */
  drift?: number;
  arrows?: boolean;
  thumbnails?: boolean;
  /** ms between automatic advances; 0 is off */
  autoplay?: number;
  label?: string;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
};

export const wrapIndex = (i: number, n: number) => (n <= 0 ? 0 : ((i % n) + n) % n);

/** quintic in-out: the dissolve starts and ends still, and hurries the middle */
const easeInOutQuint = (t: number) => {
  const x = Math.min(Math.max(t, 0), 1);
  return x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2;
};

const VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform vec2 u_resolution;
uniform float u_fromAspect;
uniform float u_toAspect;
uniform float u_scale;
uniform float u_direction;
uniform float u_edge;
uniform float u_drift;
varying vec2 v_uv;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 v) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(v);
    v *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// drift pushes UVs past the image edge; reflect instead of smearing the last row of pixels
vec2 mirror(vec2 uv) { return 1.0 - abs(1.0 - mod(uv, 2.0)); }

vec2 coverUV(vec2 uv, float imgAspect) {
  float canvasAspect = u_resolution.x / u_resolution.y;
  vec2 scale = (canvasAspect > imgAspect) ? vec2(1.0, imgAspect / canvasAspect) : vec2(canvasAspect / imgAspect, 1.0);
  return mirror((uv - 0.5) * scale + 0.5);
}

void main() {
  float adjusted = u_progress * (1.0 + 2.0 * u_edge) - u_edge;
  float noise = fbm(v_uv * u_scale + vec2(0.0, u_progress * u_direction)) * 0.5 + 0.5;
  // the incoming frame's bright areas cross the front first, so it burns through the old one
  noise = smoothstep(0.0, 2.0, length(texture2D(u_to, coverUV(v_uv, u_toAspect)).rgb) + noise);
  float mixFactor = 1.0 - smoothstep(adjusted - u_edge, adjusted + u_edge, noise);
  vec2 fromUV = coverUV(v_uv + vec2(0.0, noise * u_progress * u_drift * u_direction), u_fromAspect);
  vec2 toUV = coverUV(v_uv + vec2(0.0, noise * (1.0 - u_progress) * -0.5 * u_drift * u_direction), u_toAspect);
  gl_FragColor = mix(texture2D(u_from, fromUV), texture2D(u_to, toUV), mixFactor);
}
`;

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("could not create shader");
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("shader compile failed: " + log);
  }
  return shader;
};

const link = (gl: WebGLRenderingContext) => {
  const vert = compile(gl, gl.VERTEX_SHADER, VERT);
  const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!program) throw new Error("could not create program");
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error("program link failed: " + log);
  }
  return program;
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("could not load " + src));
    img.src = src;
  });

export default function MorphGallery({
  items,
  index,
  onIndexChange,
  duration = 1500,
  noiseScale = 3.5,
  edge = 0.15,
  drift = 0.5,
  arrows = true,
  thumbnails = true,
  autoplay = 0,
  label = "Galerie",
  prevLabel = "Předchozí",
  nextLabel = "Další",
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const active = wrapIndex(index, items.length);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [held, setHeld] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const go = useCallback((next: number) => onIndexChange(wrapIndex(next, items.length)), [items.length, onIndexChange]);

  // the render loop reads live values through refs, so retuning never tears down the context
  const tuning = useRef({ duration, noiseScale, edge, drift, reduced });
  tuning.current = { duration, noiseScale, edge, drift, reduced };

  // a transition is requested by index changes and consumed by the loop
  const request = useRef<{ from: number; to: number } | null>(null);
  const wake = useRef<() => void>(() => {});
  const previous = useRef(active);
  useEffect(() => {
    if (previous.current === active) return;
    request.current = { from: previous.current, to: active };
    previous.current = active;
    wake.current();
  }, [active]);

  const sources = items.map((i) => i.src).join("\n");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || items.length === 0) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) {
      setFailed(true);
      return;
    }

    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    const textures: (WebGLTexture | null)[] = items.map(() => null);
    const aspects: number[] = items.map(() => 1);
    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    let raf = 0;
    let disposed = false;
    let dirty = true;

    let from = previous.current;
    let to = previous.current;
    let progress = 1;
    let startedAt = 0;
    let direction = 1;

    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onRestored = () => setGeneration((g) => g + 1);
    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (w === 0 || h === 0 || (canvas.width === w && canvas.height === h)) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      dirty = true;
      schedule();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    // until every image is in, show the nearest texture that exists rather than binding null
    const pick = (i: number) => textures[i] ?? textures.find((t) => t) ?? null;

    const draw = () => {
      const t = tuning.current;
      const pending = request.current;
      if (pending) {
        request.current = null;
        if (pending.from !== pending.to) {
          from = pending.from;
          to = pending.to;
          progress = 0;
          startedAt = performance.now();
          // the shortest way round, so a wrap from last to first drifts forward too
          const n = items.length;
          direction = ((pending.to - pending.from + n) % n) * 2 <= n ? 1 : -1;
        }
      }
      if (progress < 1) {
        const span = t.reduced ? 0 : Math.max(t.duration, 1);
        progress = span === 0 ? 1 : easeInOutQuint(Math.min((performance.now() - startedAt) / span, 1));
      }

      const fromTex = pick(from);
      const toTex = pick(to);
      if (!fromTex || !toTex) return;

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fromTex);
      gl.uniform1i(uniforms.from, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, toTex);
      gl.uniform1i(uniforms.to, 1);
      gl.uniform1f(uniforms.progress, progress);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.fromAspect, aspects[from] ?? 1);
      gl.uniform1f(uniforms.toAspect, aspects[to] ?? 1);
      gl.uniform1f(uniforms.scale, t.noiseScale);
      gl.uniform1f(uniforms.direction, direction);
      gl.uniform1f(uniforms.edge, Math.max(t.edge, 0.001));
      gl.uniform1f(uniforms.drift, t.drift);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      dirty = false;
    };

    // draw only while a dissolve runs or something changed; idle galleries cost nothing
    const frame = () => {
      raf = 0;
      if (disposed) return;
      draw();
      if (progress < 1 || request.current || dirty) raf = requestAnimationFrame(frame);
    };
    function schedule() {
      if (!raf && !disposed && program) raf = requestAnimationFrame(frame);
    }
    wake.current = schedule;

    const start = async () => {
      try {
        program = link(gl);
        gl.useProgram(program);
        buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        for (const name of ["from", "to", "progress", "resolution", "fromAspect", "toAspect", "scale", "direction", "edge", "drift"]) {
          uniforms[name] = gl.getUniformLocation(program, "u_" + name);
        }
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

        // upload each image as it arrives and start on the first, not after the slowest
        let refused = 0;
        await Promise.all(
          items.map((item, i) =>
            loadImage(item.src).then(
              (img) => {
                if (disposed) return;
                const tex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                // photos aren't powers of two: clamp + linear is the only legal pair in WebGL1
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                textures[i] = tex;
                aspects[i] = img.naturalWidth / Math.max(img.naturalHeight, 1);
                resize();
                dirty = true;
                setReady(true);
                schedule();
              },
              () => {
                refused += 1;
                if (refused === items.length && !disposed) setFailed(true);
              }
            )
          )
        );
      } catch {
        if (!disposed) setFailed(true);
      }
    };
    void start();

    return () => {
      disposed = true;
      wake.current = () => {};
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      for (const tex of textures) if (tex) gl.deleteTexture(tex);
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
    };
    // `active` seeds the first frame through `previous`; later changes arrive via `request`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources, generation, items.length]);

  // autoplay: rests while hovered or focused, in a background tab, or scrolled away
  useEffect(() => {
    const sync = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", sync);
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.3 });
    if (rootRef.current) io.observe(rootRef.current);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      io.disconnect();
    };
  }, []);
  useEffect(() => {
    if (!autoplay || reduced || held || hidden || !onScreen || items.length < 2) return;
    const id = window.setInterval(() => go(active + 1), Math.max(autoplay, 600));
    return () => window.clearInterval(id);
  }, [autoplay, reduced, held, hidden, onScreen, active, go, items.length]);

  // swipe and keys
  const swipe = useRef<number | null>(null);
  const onPointerDown = (e: PointerEvent) => {
    swipe.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    const startX = swipe.current;
    swipe.current = null;
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 48) go(active + (dx < 0 ? 1 : -1));
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    }
  };

  const arrowCls =
    "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
  const current = items[active];

  return (
    <div
      ref={rootRef}
      className={cn("relative size-full touch-pan-y select-none overflow-hidden bg-black", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      {failed ? (
        // the same gallery without the shader: stacked images, opacity only
        items.map((item, i) => (
          <img
            key={item.src}
            src={item.src}
            alt={item.alt ?? ""}
            className="absolute inset-0 block size-full object-cover transition-opacity duration-700 motion-reduce:transition-none"
            style={{ maxWidth: "none", opacity: i === active ? 1 : 0 }}
            aria-hidden={i !== active}
          />
        ))
      ) : (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block size-full"
          // nothing is on the canvas until the textures land; fading in avoids a black flash
          style={{ opacity: ready ? 1 : 0, transition: "opacity 400ms ease" }}
          aria-hidden="true"
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-56 bg-gradient-to-b from-transparent to-black/65" aria-hidden="true" />

      {arrows && items.length > 1 && (
        <>
          <button type="button" className={cn(arrowCls, "left-4 sm:left-8")} onClick={() => go(active - 1)} aria-label={prevLabel}>
            <ChevronLeft className="size-5" strokeWidth={2.5} />
          </button>
          <button type="button" className={cn(arrowCls, "right-4 sm:right-8")} onClick={() => go(active + 1)} aria-label={nextLabel}>
            <ChevronRight className="size-5" strokeWidth={2.5} />
          </button>
        </>
      )}

      {thumbnails && items.length > 1 && (
        <ul className="absolute inset-x-0 bottom-8 z-10 mx-auto flex w-max max-w-[calc(100%-2rem)] list-none gap-2 overflow-x-auto scroll-smooth p-0 pb-2.5 max-sm:hidden [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-track]:bg-white/10 [&::-webkit-scrollbar]:h-1.5">
          {items.map((item, i) => (
            <li key={item.src} className="shrink-0 list-none">
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={i === active}
                aria-label={item.alt ? `Ukázat: ${item.alt}` : `Ukázat obrázek ${i + 1}`}
                className={cn(
                  "block cursor-pointer overflow-hidden rounded border-2 bg-transparent p-0 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  i === active ? "border-white opacity-100" : "border-transparent opacity-55 hover:opacity-85"
                )}
              >
                <img
                  src={item.thumb ?? item.src}
                  alt=""
                  width={80}
                  height={50}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="block object-cover"
                  // preflight's img { max-width: 100% } would shrink these inside the scroller
                  style={{ maxWidth: "none", width: 80, height: 50 }}
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      <span className="sr-only" aria-live="polite">
        {current ? (current.alt ?? `Obrázek ${active + 1}`) : ""} — {active + 1} z {items.length}
      </span>
    </div>
  );
}
