import { Captions, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { Button } from "@/components/ui/button";
import { FILM } from "@/lib/film";
import { cn, formatTimecode } from "@/lib/utils";

type PlayerProps = {
  time: number;
  duration: number;
  onTime: (t: number) => void;
  onDuration: (d: number) => void;
  seekRef: MutableRefObject<((t: number) => void) | null>;
};

export function FilmPlayer({
  time,
  duration,
  onTime,
  onDuration,
  seekRef,
}: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [captions, setCaptions] = useState(true);

  useEffect(() => {
    seekRef.current = (t: number) => {
      const v = videoRef.current;
      onTime(t);
      if (!v) return;
      const apply = () => {
        v.currentTime = t;
      };
      if (v.readyState >= 1) apply();
      else v.addEventListener("loadedmetadata", apply, { once: true });
    };
    return () => {
      seekRef.current = null;
    };
  }, [seekRef, onTime]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tracks = v.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = captions ? "showing" : "hidden";
    }
  }, [captions]);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      if (v.ended || (v.duration && v.currentTime >= v.duration - 0.05)) {
        v.currentTime = 0;
        onTime(0);
      }
      void v.play();
    } else {
      v.pause();
    }
  }

  const ended = duration > 0 && time >= duration - 0.08;
  const showOverlay = !playing && (time < 0.15 || ended);

  const pct = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <div className="overflow-hidden rounded-xl bg-card shadow-border">
      <div className="relative aspect-video bg-background">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          preload="auto"
          poster={FILM.poster}
          onClick={togglePlay}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(e) => onTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => onDuration(e.currentTarget.duration)}
          onDurationChange={(e) => onDuration(e.currentTarget.duration)}
        >
          <source src={FILM.videoSrc} type="video/mp4" />
          <track
            kind="subtitles"
            src={FILM.captionsSrc}
            srcLang="en"
            label="English"
            default
          />
        </video>
        {showOverlay ? (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-background/35"
            aria-label={ended ? "Replay film" : "Play film"}
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-border">
              <Play className="ml-0.5 size-7" fill="currentColor" />
            </span>
          </button>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 px-4 py-3">
        <button
          type="button"
          className="group relative h-11 w-full"
          aria-label="Seek"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            seekRef.current?.(x * duration);
          }}
        >
          <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-raised" />
          <span
            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-primary"
            style={{ width: `${pct}%` }}
          />
          <span
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
            style={{ left: `${pct}%` }}
          />
        </button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause /> : <Play className="ml-px" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const v = videoRef.current;
              if (!v) return;
              v.muted = !v.muted;
              setMuted(v.muted);
            }}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX /> : <Volume2 />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCaptions((c) => !c)}
            aria-label={captions ? "Hide captions" : "Show captions"}
            className={cn(!captions && "text-faint")}
          >
            <Captions />
          </Button>
          <p className="ml-auto font-mono text-xs tabular-nums text-muted-foreground">
            {formatTimecode(time)}
            <span className="text-faint"> / {formatTimecode(duration)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
