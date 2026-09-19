export type Easing = "linear" | "in" | "out" | "in-out";

export type CameraMove = {
  zoomFrom: number;
  zoomTo: number;
  xFrom: number;
  yFrom: number;
  xTo: number;
  yTo: number;
  easing: Easing;
  shake: number;
};

export type LayerKeyframe = {
  t: number;
  x: number;
  y: number;
  scale: number;
  rot: number;
  opacity: number;
};

export type FilmLayer = {
  image: string;
  keyframes: LayerKeyframe[];
  easing: Easing;
  flip: boolean;
  shadow: boolean;
  bob: number;
  bobSpeed: number;
};

export type FilmText = {
  text: string;
  style: "title" | "subtitle" | "caption" | "lower-third" | "custom";
  start: number;
  end?: number;
  anim: "fade" | "rise" | "typewriter" | "none";
};

export type FilmScene = {
  id: string;
  number: string;
  name: string;
  start: number;
  end: number;
  durationLabel: string;
  background: string | null;
  bgColor: string;
  camera: CameraMove;
  cameraName: string;
  grade: string | null;
  vignette: number;
  letterbox: boolean;
  transition: string;
  transitionDuration: number;
  layers: FilmLayer[];
  texts: FilmText[];
  narration: string[];
  voices?: string[];
};

export const CAMERA_PRESETS: Record<string, CameraMove> = {
  static: cam(),
  zoom_in: cam({ zoomFrom: 1.0, zoomTo: 1.25 }),
  zoom_out: cam({ zoomFrom: 1.25, zoomTo: 1.0 }),
  pan_left: cam({ zoomFrom: 1.2, zoomTo: 1.2, xFrom: 0.62, xTo: 0.38 }),
  pan_right: cam({ zoomFrom: 1.2, zoomTo: 1.2, xFrom: 0.38, xTo: 0.62 }),
  tilt_up: cam({ zoomFrom: 1.2, zoomTo: 1.2, yFrom: 0.62, yTo: 0.38 }),
  tilt_down: cam({ zoomFrom: 1.2, zoomTo: 1.2, yFrom: 0.38, yTo: 0.62 }),
  push_in: cam({ zoomFrom: 1.05, zoomTo: 1.45, easing: "in" }),
  drift: cam({
    zoomFrom: 1.1,
    zoomTo: 1.18,
    xFrom: 0.47,
    xTo: 0.53,
    yFrom: 0.52,
    yTo: 0.48,
  }),
  handheld: cam({ zoomFrom: 1.15, zoomTo: 1.15, shake: 0.5 }),
  dolly_zoom: cam({ zoomFrom: 1.4, zoomTo: 1.0, easing: "out" }),
};

function cam(partial: Partial<CameraMove> = {}): CameraMove {
  return {
    zoomFrom: 1,
    zoomTo: 1,
    xFrom: 0.5,
    yFrom: 0.5,
    xTo: 0.5,
    yTo: 0.5,
    easing: "in-out",
    shake: 0,
    ...partial,
  };
}

export const TRANSITIONS = [
  { id: "cut", label: "Cut", note: "Hard join at the midpoint" },
  { id: "crossfade", label: "Crossfade", note: "Dissolve A into B" },
  { id: "fade-black", label: "Fade black", note: "Down to black, up on B" },
  { id: "fade-white", label: "Fade white", note: "Flash through white" },
  { id: "slide-left", label: "Slide left", note: "A exits, B pushes in" },
  { id: "slide-right", label: "Slide right", note: "A exits the other way" },
  { id: "wipe", label: "Wipe", note: "B reveals left to right" },
  { id: "zoom", label: "Zoom", note: "A punches in while B arrives" },
] as const;

export const GRADES = [
  { id: "none", label: "None", note: "Straight still" },
  { id: "warm", label: "Warm", note: "Lifted red, held blue" },
  { id: "cool", label: "Cool", note: "Held red, lifted blue" },
  { id: "noir", label: "Noir", note: "Contrast grayscale" },
  { id: "vintage", label: "Vintage", note: "Soft contrast, tea stains" },
  { id: "vivid", label: "Vivid", note: "Pushed saturation" },
] as const;

const KEEPER = "/film/assets/keeper.png";

export const FILM = {
  title: "The Last Lighthouse",
  engine: "CinemaForge",
  version: "1.0",
  resolution: "1080p",
  fps: 30,
  runtimeLabel: "about 25 seconds",
  videoSrc: "/film/the_last_lighthouse.mp4",
  captionsSrc: "/film/the_last_lighthouse.vtt",
  poster: "/film/assets/sea_dusk.png",
  voice: {
    name: "Ryan",
    id: "en-GB-RyanNeural",
    rate: "−5%",
    pitch: "−2 Hz",
  },
  guestVoice: {
    name: "Aria",
    id: "en-US-AriaNeural",
  },
  music: {
    file: "theme.wav",
    volume: 0.28,
    duckDb: 12,
    fadeIn: 2,
    fadeOut: 4,
  },
};

export const PIPELINE = [
  {
    step: "01",
    title: "Screenplay",
    body: "A YAML (or JSON) script names stills, camera moves, cut-out actors, captions, narration, and the join into the next scene. Defaults cascade so each scene only writes what changed.",
  },
  {
    step: "02",
    title: "Voice & clock",
    body: "Each narration line is voiced, then cached by a hash of text + voice + rate + pitch. Scenes marked auto size themselves to speech plus a short pad, so the edit breathes with the read.",
  },
  {
    step: "03",
    title: "Mix",
    body: "Voices and effects are placed on an absolute timeline. The music bed loops, fades, and ducks under speech with a sidechain compressor so the narrator always sits in front.",
  },
  {
    step: "04",
    title: "Frame",
    body: "Every frame oversamples the still 1.5×, crops a Ken Burns window, composites actors and type, then grades, vignettes, and letterboxes. Frames stream into the encoder so memory stays flat.",
  },
] as const;

export const SCENES: FilmScene[] = [
  {
    id: "title",
    number: "01",
    name: "Title",
    start: 0,
    end: 3.8,
    durationLabel: "5.0s",
    background: "/film/assets/sea_dusk.png",
    bgColor: "#000000",
    camera: CAMERA_PRESETS.zoom_out,
    cameraName: "zoom_out",
    grade: "cool",
    vignette: 0.35,
    letterbox: true,
    transition: "fade-black",
    transitionDuration: 1.2,
    layers: [],
    texts: [
      { text: "The Last Lighthouse", style: "title", start: 0.4, anim: "rise" },
      {
        text: "a CinemaForge production",
        style: "subtitle",
        start: 1.4,
        anim: "fade",
      },
    ],
    narration: [],
  },
  {
    id: "arrival",
    number: "02",
    name: "Arrival",
    start: 3.8,
    end: 10.35,
    durationLabel: "auto",
    background: "/film/assets/coast.png",
    bgColor: "#000000",
    camera: CAMERA_PRESETS.pan_right,
    cameraName: "pan_right",
    grade: "warm",
    vignette: 0.35,
    letterbox: false,
    transition: "crossfade",
    transitionDuration: 0.8,
    layers: [
      {
        image: KEEPER,
        easing: "in-out",
        flip: false,
        shadow: true,
        bob: 0.006,
        bobSpeed: 2.2,
        keyframes: [
          { t: 0, x: 0.15, y: 0.72, scale: 0.7, rot: 0, opacity: 1 },
          { t: 1, x: 0.42, y: 0.66, scale: 0.85, rot: 0, opacity: 1 },
        ],
      },
    ],
    texts: [
      {
        text: "Maren, keeper of the light",
        style: "lower-third",
        start: 1.0,
        end: 4.5,
        anim: "fade",
      },
    ],
    narration: [
      "Every autumn, when the fog rolled in from the north, old Maren climbed the cliff path to light the lamp.",
    ],
  },
  {
    id: "storm",
    number: "03",
    name: "Storm",
    start: 10.35,
    end: 18.12,
    durationLabel: "auto",
    background: "/film/assets/storm.png",
    bgColor: "#000000",
    camera: CAMERA_PRESETS.handheld,
    cameraName: "handheld",
    grade: "noir",
    vignette: 0.35,
    letterbox: false,
    transition: "zoom",
    transitionDuration: 0.8,
    layers: [
      {
        image: KEEPER,
        easing: "in-out",
        flip: true,
        shadow: true,
        bob: 0,
        bobSpeed: 1,
        keyframes: [
          { t: 0.0, x: 0.8, y: 0.7, scale: 0.9, rot: 0, opacity: 0 },
          { t: 0.2, x: 0.75, y: 0.7, scale: 0.9, rot: 0, opacity: 1 },
          { t: 1.0, x: 0.55, y: 0.66, scale: 1.05, rot: 0, opacity: 1 },
        ],
      },
    ],
    texts: [],
    narration: [
      "But this year the fog did not roll. It surged.",
      "And somewhere inside it, something was coming home.",
    ],
    voices: ["Ryan, slowed", "Aria"],
  },
  {
    id: "lamp",
    number: "04",
    name: "Lamp",
    start: 18.12,
    end: 19.71,
    durationLabel: "auto",
    background: "/film/assets/lamp.png",
    bgColor: "#000000",
    camera: CAMERA_PRESETS.push_in,
    cameraName: "push_in",
    grade: "vivid",
    vignette: 0.35,
    letterbox: false,
    transition: "fade-white",
    transitionDuration: 1.0,
    layers: [],
    texts: [
      {
        text: "She struck the match.",
        style: "caption",
        start: 0.2,
        anim: "typewriter",
      },
    ],
    narration: ["She struck the match."],
  },
  {
    id: "credits",
    number: "05",
    name: "Credits",
    start: 19.71,
    end: 24.7,
    durationLabel: "5.0s",
    background: null,
    bgColor: "#05070c",
    camera: CAMERA_PRESETS.static,
    cameraName: "static",
    grade: null,
    vignette: 0.35,
    letterbox: false,
    transition: "cut",
    transitionDuration: 0,
    layers: [],
    texts: [
      {
        text: "Written & directed by You",
        style: "title",
        start: 0,
        anim: "rise",
      },
      {
        text: "Voices: Ryan · Aria  —  Music: procedural theme",
        style: "subtitle",
        start: 1.2,
        anim: "fade",
      },
    ],
    narration: [],
  },
];

export function sceneAt(time: number, duration = 24.7): FilmScene {
  const scenes = SCENES.map((s, i) =>
    i === SCENES.length - 1 ? { ...s, end: Math.max(s.end, duration) } : s,
  );
  for (let i = scenes.length - 1; i >= 0; i--) {
    const s = scenes[i];
    if (time + 0.0001 >= s.start) return s;
  }
  return scenes[0];
}

export const SCRIPT_YAML = `# CinemaForge screenplay
title: "The Last Lighthouse"
resolution: 1080p
fps: 30
output: the_last_lighthouse.mp4
assets_dir: assets
subtitles: true
watermark: "CinemaForge demo"

voice:
  name: en-GB-RyanNeural
  rate: "-5%"
  pitch: "-2Hz"

music:
  file: theme.wav
  volume: 0.28
  duck: true
  duck_db: 12
  fade_in: 2
  fade_out: 4

defaults:
  duration: auto
  camera: drift
  transition: crossfade
  transition_duration: 0.8
  vignette: 0.35

scenes:
  - id: title
    background: sea_dusk.png
    duration: 5
    camera: zoom_out
    color_grade: cool
    letterbox: true
    text:
      - {text: "The Last Lighthouse", style: title, anim: rise, start: 0.4}
      - {text: "a CinemaForge production", style: subtitle, anim: fade, start: 1.4}
    transition: fade-black
    transition_duration: 1.2

  - id: arrival
    background: coast.png
    camera: pan_right
    color_grade: warm
    narration: "Every autumn, when the fog rolled in from the north, old Maren climbed the cliff path to light the lamp."
    layers:
      - image: keeper.png
        shadow: true
        from: {x: 0.15, y: 0.72, scale: 0.7}
        to:   {x: 0.42, y: 0.66, scale: 0.85}
        bob: 0.006
        bob_speed: 2.2
    text:
      - {text: "Maren, keeper of the light", style: lower-third, start: 1.0, end: 4.5}

  - id: storm
    background: storm.png
    camera: handheld
    color_grade: noir
    narration:
      - text: "But this year the fog did not roll. It surged."
        rate: "-12%"
      - text: "And somewhere inside it, something was coming home."
        voice: en-US-AriaNeural
        pitch: "-6Hz"
    layers:
      - image: keeper.png
        flip: true
        shadow: true
        keyframes:
          - {t: 0.0, x: 0.8, y: 0.7, scale: 0.9, opacity: 0}
          - {t: 0.2, x: 0.75, y: 0.7, scale: 0.9, opacity: 1}
          - {t: 1.0, x: 0.55, y: 0.66, scale: 1.05, opacity: 1}
    transition: zoom

  - id: lamp
    background: lamp.png
    camera: push_in
    color_grade: vivid
    narration: "She struck the match."
    text:
      - {text: "She struck the match.", style: caption, anim: typewriter, start: 0.2}
    transition: fade-white
    transition_duration: 1.0

  - id: credits
    background: null
    bg_color: "#05070c"
    duration: 5
    camera: static
    text:
      - {text: "Written & directed by You", style: title, size: 84, y: 0.42, anim: rise}
      - {text: "Voices: Ryan · Aria  —  Music: procedural theme", style: subtitle, start: 1.2}
`;
