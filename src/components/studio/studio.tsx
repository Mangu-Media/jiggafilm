import type { ReactNode } from "react";
import {
  Aperture,
  AudioLines,
  Clapperboard,
  Layers,
  Scan,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { KenBurnsStage } from "@/components/studio/ken-burns";
import { FilmPlayer } from "@/components/studio/player";
import { TransitionStage } from "@/components/studio/transition-stage";
import {
  CAMERA_PRESETS,
  FILM,
  GRADES,
  PIPELINE,
  SCENES,
  SCRIPT_YAML,
  TRANSITIONS,
  sceneAt,
  type FilmScene,
} from "@/lib/film";
import { cn, formatTimecode } from "@/lib/utils";

export function Studio() {
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(24.7);
  const seekRef = useRef<((t: number) => void) | null>(null);
  const onTime = useCallback((t: number) => setTime(t), []);
  const onDuration = useCallback((d: number) => {
    if (Number.isFinite(d) && d > 0) setDuration(d);
  }, []);

  const scene = sceneAt(time, duration);

  function seekScene(s: FilmScene) {
    setTime(s.start + 0.05);
    seekRef.current?.(s.start + 0.05);
  }

  return (
    <TooltipProvider delayDuration={200}>
      <div className="min-h-dvh bg-background text-foreground">
        <Header />
        <main className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-6 md:px-8 md:pt-8">
          <Hero />
          <section className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <FilmPlayer
                time={time}
                duration={duration}
                onTime={onTime}
                onDuration={onDuration}
                seekRef={seekRef}
              />
            </div>
            <SceneInspector scene={scene} duration={duration} time={time} />
          </section>
          <SceneStrip scene={scene} onSelect={seekScene} />
          <EngineBay scene={scene} />
          <ScriptPanel />
        </main>
      </div>
    </TooltipProvider>
  );
}

function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-raised shadow-border">
            <Clapperboard className="size-4 text-primary" />
          </span>
          <div>
            <p className="font-display text-lg leading-tight tracking-display">
              CinemaForge
            </p>
            <p className="text-xs text-muted-foreground">Screening room</p>
          </div>
        </div>
        <Badge variant="outline">{FILM.resolution} · {FILM.fps} fps</Badge>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="max-w-2xl">
      <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        Engine 1.0 · demo reel
      </p>
      <h1 className="font-display text-4xl leading-tight tracking-display md:text-5xl">
        {FILM.title}
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted-foreground">
        A YAML screenplay, stills, and a cut-out keeper become a narrated short.
        Watch the cut, then step through camera, grade, and mix — the same
        moves the renderer used to draw every frame.
      </p>
    </section>
  );
}

function SceneInspector({
  scene,
  duration,
  time,
}: {
  scene: FilmScene;
  duration: number;
  time: number;
}) {
  const span = Math.max(scene.end - scene.start, 0.001);
  const progress = Math.max(0, Math.min(1, (time - scene.start) / span));
  const next = SCENES[SCENES.findIndex((s) => s.id === scene.id) + 1];

  return (
    <aside className="flex flex-col gap-4 rounded-xl bg-card p-4 shadow-border lg:col-span-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Scene {scene.number}
          </p>
          <h2 className="font-display text-2xl tracking-display">{scene.name}</h2>
        </div>
        <Badge>{formatTimecode(scene.start)}</Badge>
      </div>
      <div className="overflow-hidden rounded-lg bg-background">
        <div className="aspect-video">
          <KenBurnsStage scene={scene} progress={progress} />
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
        <Spec label="Camera" value={scene.cameraName.replaceAll("_", " ")} />
        <Spec label="Grade" value={scene.grade ?? "none"} />
        <Spec
          label="Join"
          value={
            next
              ? `${scene.transition} · ${scene.transitionDuration}s`
              : "end card"
          }
        />
        <Spec label="Duration" value={scene.durationLabel} />
      </dl>
      {scene.narration.length ? (
        <blockquote className="border-l-2 border-primary/40 pl-3 text-sm leading-relaxed text-muted-foreground">
          {scene.narration.join(" ")}
        </blockquote>
      ) : (
        <p className="text-sm text-muted-foreground">
          {scene.texts.map((t) => t.text).join(" · ") || "No narration on this card."}
        </p>
      )}
      <p className="font-mono text-xs tabular-nums text-faint">
        {Math.round(progress * 100)}% through the scene · film {formatTimecode(time)} /{" "}
        {formatTimecode(duration)}
      </p>
    </aside>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-wider text-faint">
        {label}
      </dt>
      <dd className="capitalize text-foreground">{value}</dd>
    </div>
  );
}

function SceneStrip({
  scene,
  onSelect,
}: {
  scene: FilmScene;
  onSelect: (s: FilmScene) => void;
}) {
  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl tracking-display">The cut</h2>
        <p className="text-sm text-muted-foreground">Five scenes, one lighthouse.</p>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
        {SCENES.map((s) => {
          const active = s.id === scene.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s)}
              className={cn(
                "min-w-40 shrink-0 overflow-hidden rounded-lg bg-card text-left shadow-border transition-[box-shadow,transform] duration-150 ease-out md:min-w-0",
                "hover:shadow-border-hover active:scale-[0.96]",
                active && "ring-2 ring-ring ring-offset-2 ring-offset-background",
              )}
            >
              <div className="relative aspect-video bg-raised">
                {s.background ? (
                  <img
                    src={s.background}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-background" />
                )}
                <span className="absolute left-2 top-2 font-mono text-xs text-primary">
                  {s.number}
                </span>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-sm font-medium">{s.name}</p>
                <p className="text-xs capitalize text-muted-foreground">
                  {s.cameraName.replaceAll("_", " ")} · {s.grade ?? "ungraded"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function EngineBay({ scene }: { scene: FilmScene }) {
  const presetNames = Object.keys(CAMERA_PRESETS);
  const [preset, setPreset] = useState(scene.cameraName);
  const [grade, setGrade] = useState(scene.grade ?? "none");
  const [transition, setTransition] = useState(scene.transition);
  const [join, setJoin] = useState(0.45);

  useEffect(() => {
    setPreset(scene.cameraName);
    setGrade(scene.grade ?? "none");
    setTransition(scene.transition);
  }, [scene.id, scene.cameraName, scene.grade, scene.transition]);

  const playgroundScene = useMemo(
    () => ({
      ...scene,
      camera: CAMERA_PRESETS[preset] ?? scene.camera,
      grade: grade === "none" ? null : grade,
    }),
    [scene, preset, grade],
  );

  const from = scene;
  const to = SCENES[Math.min(SCENES.length - 1, SCENES.findIndex((s) => s.id === scene.id) + 1)] ?? scene;

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="font-display text-2xl tracking-display">Inside the engine</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          CinemaForge is a small renderer, not a timeline app. The script names
          a still and a camera; the rest is crop, composite, grade, and a mix
          that ducks under speech.
        </p>
      </div>

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PIPELINE.map((step) => (
          <li key={step.step} className="rounded-lg bg-card p-4 shadow-border">
            <p className="font-mono text-xs text-faint">{step.step}</p>
            <h3 className="mt-2 font-display text-xl tracking-display">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-card p-4 shadow-border">
          <div className="mb-4 flex items-center gap-2">
            <Scan className="size-4 text-muted-foreground" />
            <h3 className="font-display text-xl tracking-display">Camera</h3>
          </div>
          <div className="mb-4 overflow-hidden rounded-lg bg-background">
            <div className="aspect-video">
              <KenBurnsStage
                scene={playgroundScene}
                camera={CAMERA_PRESETS[preset]}
                grade={grade === "none" ? null : grade}
                loop
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {presetNames.map((name) => (
              <Button
                key={name}
                size="sm"
                variant={preset === name ? "default" : "outline"}
                onClick={() => setPreset(name)}
                className="capitalize"
              >
                {name.replaceAll("_", " ")}
              </Button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Presets are just from/to zoom and pan. Handheld adds a seeded shake.
            Stills are oversampled 1.5× so a push-in stays sharp.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl bg-card p-4 shadow-border">
            <div className="mb-4 flex items-center gap-2">
              <Aperture className="size-4 text-muted-foreground" />
              <h3 className="font-display text-xl tracking-display">Grade</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {GRADES.map((g) => (
                <Button
                  key={g.id}
                  size="sm"
                  variant={grade === g.id ? "default" : "outline"}
                  onClick={() => setGrade(g.id)}
                >
                  {g.label}
                </Button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {GRADES.find((g) => g.id === grade)?.note}. Applied after actors
              and type, before vignette.
            </p>
          </div>

          <div className="rounded-xl bg-card p-4 shadow-border">
            <div className="mb-4 flex items-center gap-2">
              <Layers className="size-4 text-muted-foreground" />
              <h3 className="font-display text-xl tracking-display">Join</h3>
            </div>
            <div className="mb-4 overflow-hidden rounded-lg bg-background">
              <div className="aspect-video">
                <TransitionStage
                  from={from}
                  to={to}
                  kind={transition}
                  progress={join}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRANSITIONS.map((t) => (
                <Button
                  key={t.id}
                  size="sm"
                  variant={transition === t.id ? "default" : "outline"}
                  onClick={() => setTransition(t.id)}
                >
                  {t.label}
                </Button>
              ))}
            </div>
            <label className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="w-16 shrink-0 font-mono">Mix {Math.round(join * 100)}</span>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(join * 100)}
                onChange={(e) => setJoin(Number(e.target.value) / 100)}
                className="h-11 w-full accent-primary"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MixCard
          icon={<AudioLines className="size-4" />}
          title="Narration"
          body={`Default voice ${FILM.voice.name} at ${FILM.voice.rate}, ${FILM.voice.pitch}. The storm’s second line switches to ${FILM.guestVoice.name}. Clips cache so a re-render does not re-voice.`}
        />
        <MixCard
          icon={<AudioLines className="size-4" />}
          title="Music bed"
          body={`A looping theme at volume ${FILM.music.volume}, faded ${FILM.music.fadeIn}s in and ${FILM.music.fadeOut}s out, ducked ${FILM.music.duckDb} dB under speech.`}
        />
        <MixCard
          icon={<Clapperboard className="size-4" />}
          title="Actors"
          body="PNG layers with alpha sit on the still. Keyframes are 0–1 of the scene; scale 1 is 60% of frame height. A light bob sells a walk without a walk cycle."
        />
      </div>
    </section>
  );
}

function MixCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-lg bg-card p-4 shadow-border">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <h3 className="font-display text-lg text-foreground tracking-display">
          {title}
        </h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </article>
  );
}

function ScriptPanel() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-display text-2xl tracking-display">The screenplay</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          This is the YAML that produced the reel. Duration auto fits the read;
          cameras and grades are named presets you can override per scene.
        </p>
      </div>
      <div className="overflow-hidden rounded-xl bg-card shadow-border">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <p className="font-mono text-xs text-muted-foreground">script.yaml</p>
          <Badge variant="outline">{SCENES.length} scenes</Badge>
        </div>
        <pre className="max-h-96 overflow-auto p-4 font-mono text-xs leading-relaxed text-muted-foreground">
          {SCRIPT_YAML}
        </pre>
      </div>
      <Separator className="mt-10" />
      <p className="pt-6 text-sm text-faint">
        CinemaForge {FILM.version} — stills, keyframes, voice, mix. The reel is
        the bundled demo, The Last Lighthouse.
      </p>
    </section>
  );
}
