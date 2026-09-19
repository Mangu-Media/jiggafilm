import { useEffect, useRef } from "react";
import type { FilmScene } from "@/lib/film";
import {
  drawCamera,
  drawVignette,
  gradeFilter,
  loadImage,
  mixTransition,
} from "@/lib/compositor";
import { cn } from "@/lib/utils";

type Props = {
  from: FilmScene;
  to: FilmScene;
  kind: string;
  progress: number;
  className?: string;
};

export function TransitionStage({ from, to, kind, progress, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    let cancelled = false;

    async function paint() {
      const node = canvasRef.current;
      if (!node || !ctx) return;
      const rect = node.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (node.width !== w || node.height !== h) {
        node.width = w;
        node.height = h;
      }
      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;

      async function frame(scene: FilmScene, p: number): Promise<ImageData> {
        let img: HTMLImageElement | null = null;
        if (scene.background) {
          try {
            img = await loadImage(scene.background);
          } catch {
            img = null;
          }
        }
        octx!.filter = gradeFilter(scene.grade);
        drawCamera(octx!, img, scene.camera, p, w, h, scene.bgColor, 0);
        octx!.filter = "none";
        drawVignette(octx!, w, h, scene.vignette);
        return octx!.getImageData(0, 0, w, h);
      }

      const a = await frame(from, 0.92);
      const b = await frame(to, 0.08);
      if (cancelled) return;
      mixTransition(ctx, a, b, kind, progress);
    }

    void paint();
    const ro = new ResizeObserver(() => void paint());
    ro.observe(canvas);
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [from, to, kind, progress]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("h-full w-full bg-background", className)}
      aria-label={`${kind} transition preview`}
    />
  );
}
