import { useEffect, useRef } from "react";
import type { CameraMove, FilmLayer, FilmScene } from "@/lib/film";
import {
  drawCamera,
  drawLayers,
  drawLetterbox,
  drawVignette,
  gradeFilter,
  loadImage,
} from "@/lib/compositor";
import { cn } from "@/lib/utils";

type KenBurnsProps = {
  scene: FilmScene;
  camera?: CameraMove;
  grade?: string | null;
  progress?: number;
  loop?: boolean;
  className?: string;
};

export function KenBurnsStage({
  scene,
  camera,
  grade,
  progress,
  loop = false,
  className,
}: KenBurnsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef(scene);
  const cameraRef = useRef(camera);
  const gradeRef = useRef(grade);
  const progressRef = useRef(progress);
  const loopRef = useRef(loop);
  sceneRef.current = scene;
  cameraRef.current = camera;
  gradeRef.current = grade;
  progressRef.current = progress;
  loopRef.current = loop;

  const assetKey = `${scene.id}|${scene.background ?? ""}|${scene.layers.map((l) => l.image).join(",")}`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    let raf = 0;
    let bg: HTMLImageElement | null = null;
    const layerImgs = new Map<string, HTMLImageElement>();
    const started = performance.now();
    const layers: FilmLayer[] = sceneRef.current.layers;

    function size() {
      const node = canvasRef.current;
      if (!node) return { w: 0, h: 0 };
      const rect = node.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (node.width !== w || node.height !== h) {
        node.width = w;
        node.height = h;
      }
      return { w, h };
    }

    function paint(now: number) {
      const node = canvasRef.current;
      if (!node || !ctx) return;
      const { w, h } = size();
      if (!w || !h) return;
      const sc = sceneRef.current;
      const cam = cameraRef.current ?? sc.camera;
      const usedGrade =
        gradeRef.current === undefined ? sc.grade : gradeRef.current;
      const duration = Math.max(sc.end - sc.start, 2.5);
      let p: number;
      const prog = progressRef.current;
      if (typeof prog === "number") {
        p = Math.max(0, Math.min(1, prog));
      } else if (reduced) {
        p = 0.45;
      } else if (loopRef.current) {
        p = ((now - started) / 1000 / duration) % 1;
      } else {
        p = 0.45;
      }
      const seconds = p * duration;
      ctx.filter = gradeFilter(usedGrade);
      drawCamera(ctx, bg, cam, p, w, h, sc.bgColor, Math.floor(now / 32));
      drawLayers(ctx, layerImgs, sc.layers, p, seconds, w, h);
      ctx.filter = "none";
      drawVignette(ctx, w, h, sc.vignette);
      if (sc.letterbox) drawLetterbox(ctx, w, h);
    }

    function tick(now: number) {
      if (cancelled) return;
      paint(now);
      raf = requestAnimationFrame(tick);
    }

    async function boot() {
      const sc = sceneRef.current;
      if (sc.background) {
        try {
          bg = await loadImage(sc.background);
        } catch {
          bg = null;
        }
      }
      await Promise.all(
        layers.map(async (layer) => {
          try {
            layerImgs.set(layer.image, await loadImage(layer.image));
          } catch {
            /* skip */
          }
        }),
      );
      if (cancelled) return;
      raf = requestAnimationFrame(tick);
    }

    void boot();
    const ro = new ResizeObserver(() => paint(performance.now()));
    ro.observe(canvas);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [assetKey]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-full w-full bg-background", className)}
      aria-label={`${scene.name} camera preview`}
    />
  );
}
