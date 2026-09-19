import type { CameraMove, Easing, FilmLayer, LayerKeyframe } from "@/lib/film";

export function ease(t: number, kind: Easing = "in-out"): number {
  const x = Math.max(0, Math.min(1, t));
  if (kind === "linear") return x;
  if (kind === "in") return x * x;
  if (kind === "out") return 1 - (1 - x) ** 2;
  return x * x * (3 - 2 * x);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

const imageCache = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  const hit = imageCache.get(src);
  if (hit) return hit;
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
  imageCache.set(src, promise);
  return promise;
}

function layerState(layer: FilmLayer, t: number): LayerKeyframe {
  const kfs = layer.keyframes;
  if (t <= kfs[0].t) return kfs[0];
  if (t >= kfs[kfs.length - 1].t) return kfs[kfs.length - 1];
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i];
    const b = kfs[i + 1];
    if (a.t <= t && t <= b.t) {
      const span = b.t - a.t || 1e-9;
      const u = ease((t - a.t) / span, layer.easing);
      return {
        t,
        x: lerp(a.x, b.x, u),
        y: lerp(a.y, b.y, u),
        scale: lerp(a.scale, b.scale, u),
        rot: lerp(a.rot, b.rot, u),
        opacity: lerp(a.opacity, b.opacity, u),
      };
    }
  }
  return kfs[kfs.length - 1];
}

export function parseHex(color: string): [number, number, number] {
  const c = color.replace("#", "");
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16),
  ];
}

export function drawCamera(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  cam: CameraMove,
  p: number,
  w: number,
  h: number,
  bgColor: string,
  shakeSeed: number,
) {
  const u = ease(p, cam.easing);
  let zoom = Math.max(1, lerp(cam.zoomFrom, cam.zoomTo, u));
  let cx = lerp(cam.xFrom, cam.xTo, u);
  let cy = lerp(cam.yFrom, cam.yTo, u);
  if (cam.shake) {
    const s = cam.shake;
    cx += (hash(shakeSeed) - 0.5) * 0.02 * s;
    cy += (hash(shakeSeed + 1) - 0.5) * 0.02 * s;
    zoom += (hash(shakeSeed + 2) - 0.5) * 0.01 * s;
  }
  const [r, g, b] = parseHex(bgColor);
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, w, h);
  if (!img) return;
  const scale = Math.max(w / img.width, h / img.height) * zoom;
  const dw = img.width * scale;
  const dh = img.height * scale;
  const x = w / 2 - cx * dw;
  const y = h / 2 - cy * dh;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, x, y, dw, dh);
}

export function drawLayers(
  ctx: CanvasRenderingContext2D,
  images: Map<string, HTMLImageElement>,
  layers: FilmLayer[],
  p: number,
  sceneSeconds: number,
  w: number,
  h: number,
) {
  for (const layer of layers) {
    const img = images.get(layer.image);
    if (!img) continue;
    const st = layerState(layer, p);
    if (st.opacity <= 0) continue;
    const targetH = h * 0.6 * st.scale;
    const sw = Math.max(1, (img.width * targetH) / img.height);
    const sh = Math.max(1, targetH);
    const bob = layer.bob
      ? Math.sin(sceneSeconds * layer.bobSpeed * 2 * Math.PI) * layer.bob * h
      : 0;
    const cx = st.x * w;
    const cy = st.y * h + bob;
    ctx.save();
    ctx.translate(cx, cy);
    if (st.rot) ctx.rotate((st.rot * Math.PI) / 180);
    if (layer.flip) ctx.scale(-1, 1);
    ctx.globalAlpha = st.opacity;
    if (layer.shadow) {
      ctx.save();
      ctx.globalAlpha = st.opacity * 0.4;
      ctx.filter = "blur(8px)";
      ctx.drawImage(img, -sw / 2 + 10, -sh / 2 + 12, sw, sh);
      ctx.restore();
      ctx.globalAlpha = st.opacity;
      ctx.filter = "none";
    }
    ctx.drawImage(img, -sw / 2, -sh / 2, sw, sh);
    ctx.restore();
  }
}

export function gradeFilter(grade: string | null | undefined): string {
  switch (grade) {
    case "warm":
      return "sepia(0.18) saturate(1.12) hue-rotate(-10deg)";
    case "cool":
      return "saturate(0.92) hue-rotate(14deg) contrast(1.04)";
    case "noir":
      return "grayscale(1) contrast(1.25)";
    case "vintage":
      return "sepia(0.38) contrast(0.9) saturate(0.82)";
    case "vivid":
      return "saturate(1.4) contrast(1.1)";
    default:
      return "none";
  }
}


export function drawVignette(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  strength: number,
) {
  if (strength <= 0) return;
  const g = ctx.createRadialGradient(
    w / 2,
    h / 2,
    Math.min(w, h) * 0.28,
    w / 2,
    h / 2,
    Math.max(w, h) * 0.72,
  );
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, `rgba(0,0,0,${0.85 * strength})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

export function drawLetterbox(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const bar = Math.round(h * 0.12);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, bar);
  ctx.fillRect(0, h - bar, w, bar);
}

export function mixTransition(
  ctx: CanvasRenderingContext2D,
  a: ImageData,
  b: ImageData,
  kind: string,
  pRaw: number,
) {
  const p = ease(pRaw, "in-out");
  const w = a.width;
  const h = a.height;
  const out = ctx.createImageData(w, h);
  const A = a.data;
  const B = b.data;
  const O = out.data;

  if (kind === "cut") {
    ctx.putImageData(p >= 0.5 ? b : a, 0, 0);
    return;
  }

  if (kind === "crossfade" || kind === "zoom") {
    // zoom: approximate with crossfade + we'll scale A before this is called
    for (let i = 0; i < O.length; i += 4) {
      O[i] = A[i] * (1 - p) + B[i] * p;
      O[i + 1] = A[i + 1] * (1 - p) + B[i + 1] * p;
      O[i + 2] = A[i + 2] * (1 - p) + B[i + 2] * p;
      O[i + 3] = 255;
    }
    ctx.putImageData(out, 0, 0);
    return;
  }

  if (kind === "fade-black" || kind === "fade-white") {
    const flash = kind === "fade-white" ? 255 : 0;
    for (let i = 0; i < O.length; i += 4) {
      if (p < 0.5) {
        const k = 1 - p * 2;
        O[i] = A[i] * k + flash * (1 - k);
        O[i + 1] = A[i + 1] * k + flash * (1 - k);
        O[i + 2] = A[i + 2] * k + flash * (1 - k);
      } else {
        const k = (p - 0.5) * 2;
        O[i] = B[i] * k + flash * (1 - k);
        O[i + 1] = B[i + 1] * k + flash * (1 - k);
        O[i + 2] = B[i + 2] * k + flash * (1 - k);
      }
      O[i + 3] = 255;
    }
    ctx.putImageData(out, 0, 0);
    return;
  }

  if (kind === "slide-left" || kind === "slide-right" || kind === "wipe") {
    const off = Math.round(w * p);
    out.data.set(A);
    if (kind === "wipe") {
      for (let y = 0; y < h; y++) {
        const row = y * w * 4;
        for (let x = 0; x < off; x++) {
          const i = row + x * 4;
          O[i] = B[i];
          O[i + 1] = B[i + 1];
          O[i + 2] = B[i + 2];
        }
      }
    } else if (kind === "slide-left") {
      for (let y = 0; y < h; y++) {
        const row = y * w * 4;
        for (let x = 0; x < w; x++) {
          const dest = row + x * 4;
          if (x < w - off) {
            const src = row + (x + off) * 4;
            O[dest] = A[src];
            O[dest + 1] = A[src + 1];
            O[dest + 2] = A[src + 2];
          } else {
            const src = row + (x - (w - off)) * 4;
            O[dest] = B[src];
            O[dest + 1] = B[src + 1];
            O[dest + 2] = B[src + 2];
          }
        }
      }
    } else {
      for (let y = 0; y < h; y++) {
        const row = y * w * 4;
        for (let x = 0; x < w; x++) {
          const dest = row + x * 4;
          if (x >= off) {
            const src = row + (x - off) * 4;
            O[dest] = A[src];
            O[dest + 1] = A[src + 1];
            O[dest + 2] = A[src + 2];
          } else {
            const src = row + (x + (w - off)) * 4;
            O[dest] = B[src];
            O[dest + 1] = B[src + 1];
            O[dest + 2] = B[src + 2];
          }
        }
      }
    }
    ctx.putImageData(out, 0, 0);
    return;
  }

  ctx.putImageData(b, 0, 0);
}

function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
