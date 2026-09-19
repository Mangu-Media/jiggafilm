import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as Play, c as Clapperboard, d as Aperture, i as Scan, l as Captions, n as Volume2, o as Pause, s as Layers, t as VolumeX, u as AudioLines } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as Slot } from "../_libs/@radix-ui/react-popper+[...].mjs";
import { t as Root } from "../_libs/radix-ui__react-separator.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DjyGLBat.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatTimecode(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
}
var badgeVariants = cva("inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-xs uppercase tracking-wider", {
	variants: { variant: {
		default: "bg-raised text-muted-foreground",
		solid: "bg-primary text-primary-foreground",
		outline: "shadow-border text-muted-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-[color,background-color,box-shadow,opacity,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40 active:enabled:scale-[0.96] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			outline: "shadow-border bg-transparent text-foreground hover:bg-raised",
			ghost: "text-foreground hover:bg-raised",
			muted: "bg-raised text-muted-foreground hover:text-foreground"
		},
		size: {
			default: "h-10 px-4 text-sm",
			sm: "h-8 px-3 text-xs",
			lg: "h-11 px-5 text-sm",
			icon: "size-11",
			"icon-sm": "size-8"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
function Separator({ className, orientation = "horizontal", decorative = true, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		decorative,
		orientation,
		className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className),
		...props
	});
}
var TooltipProvider = Provider;
function ease(t, kind = "in-out") {
	const x = Math.max(0, Math.min(1, t));
	if (kind === "linear") return x;
	if (kind === "in") return x * x;
	if (kind === "out") return 1 - (1 - x) ** 2;
	return x * x * (3 - 2 * x);
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
var imageCache = /* @__PURE__ */ new Map();
function loadImage(src) {
	const hit = imageCache.get(src);
	if (hit) return hit;
	const promise = new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error(`Failed to load ${src}`));
		img.src = src;
	});
	imageCache.set(src, promise);
	return promise;
}
function layerState(layer, t) {
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
				opacity: lerp(a.opacity, b.opacity, u)
			};
		}
	}
	return kfs[kfs.length - 1];
}
function parseHex(color) {
	const c = color.replace("#", "");
	return [
		parseInt(c.slice(0, 2), 16),
		parseInt(c.slice(2, 4), 16),
		parseInt(c.slice(4, 6), 16)
	];
}
function drawCamera(ctx, img, cam, p, w, h, bgColor, shakeSeed) {
	const u = ease(p, cam.easing);
	let zoom = Math.max(1, lerp(cam.zoomFrom, cam.zoomTo, u));
	let cx = lerp(cam.xFrom, cam.xTo, u);
	let cy = lerp(cam.yFrom, cam.yTo, u);
	if (cam.shake) {
		const s = cam.shake;
		cx += (hash(shakeSeed) - .5) * .02 * s;
		cy += (hash(shakeSeed + 1) - .5) * .02 * s;
		zoom += (hash(shakeSeed + 2) - .5) * .01 * s;
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
function drawLayers(ctx, images, layers, p, sceneSeconds, w, h) {
	for (const layer of layers) {
		const img = images.get(layer.image);
		if (!img) continue;
		const st = layerState(layer, p);
		if (st.opacity <= 0) continue;
		const targetH = h * .6 * st.scale;
		const sw = Math.max(1, img.width * targetH / img.height);
		const sh = Math.max(1, targetH);
		const bob = layer.bob ? Math.sin(sceneSeconds * layer.bobSpeed * 2 * Math.PI) * layer.bob * h : 0;
		const cx = st.x * w;
		const cy = st.y * h + bob;
		ctx.save();
		ctx.translate(cx, cy);
		if (st.rot) ctx.rotate(st.rot * Math.PI / 180);
		if (layer.flip) ctx.scale(-1, 1);
		ctx.globalAlpha = st.opacity;
		if (layer.shadow) {
			ctx.save();
			ctx.globalAlpha = st.opacity * .4;
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
function gradeFilter(grade) {
	switch (grade) {
		case "warm": return "sepia(0.18) saturate(1.12) hue-rotate(-10deg)";
		case "cool": return "saturate(0.92) hue-rotate(14deg) contrast(1.04)";
		case "noir": return "grayscale(1) contrast(1.25)";
		case "vintage": return "sepia(0.38) contrast(0.9) saturate(0.82)";
		case "vivid": return "saturate(1.4) contrast(1.1)";
		default: return "none";
	}
}
function drawVignette(ctx, w, h, strength) {
	if (strength <= 0) return;
	const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .28, w / 2, h / 2, Math.max(w, h) * .72);
	g.addColorStop(0, "rgba(0,0,0,0)");
	g.addColorStop(1, `rgba(0,0,0,${.85 * strength})`);
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, h);
}
function drawLetterbox(ctx, w, h) {
	const bar = Math.round(h * .12);
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, w, bar);
	ctx.fillRect(0, h - bar, w, bar);
}
function mixTransition(ctx, a, b, kind, pRaw) {
	const p = ease(pRaw, "in-out");
	const w = a.width;
	const h = a.height;
	const out = ctx.createImageData(w, h);
	const A = a.data;
	const B = b.data;
	const O = out.data;
	if (kind === "cut") {
		ctx.putImageData(p >= .5 ? b : a, 0, 0);
		return;
	}
	if (kind === "crossfade" || kind === "zoom") {
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
			if (p < .5) {
				const k = 1 - p * 2;
				O[i] = A[i] * k + flash * (1 - k);
				O[i + 1] = A[i + 1] * k + flash * (1 - k);
				O[i + 2] = A[i + 2] * k + flash * (1 - k);
			} else {
				const k = (p - .5) * 2;
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
		if (kind === "wipe") for (let y = 0; y < h; y++) {
			const row = y * w * 4;
			for (let x = 0; x < off; x++) {
				const i = row + x * 4;
				O[i] = B[i];
				O[i + 1] = B[i + 1];
				O[i + 2] = B[i + 2];
			}
		}
		else if (kind === "slide-left") for (let y = 0; y < h; y++) {
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
		else for (let y = 0; y < h; y++) {
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
		ctx.putImageData(out, 0, 0);
		return;
	}
	ctx.putImageData(b, 0, 0);
}
function hash(n) {
	const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
}
function KenBurnsStage({ scene, camera, grade, progress, loop = false, className }) {
	const canvasRef = (0, import_react.useRef)(null);
	const sceneRef = (0, import_react.useRef)(scene);
	const cameraRef = (0, import_react.useRef)(camera);
	const gradeRef = (0, import_react.useRef)(grade);
	const progressRef = (0, import_react.useRef)(progress);
	const loopRef = (0, import_react.useRef)(loop);
	sceneRef.current = scene;
	cameraRef.current = camera;
	gradeRef.current = grade;
	progressRef.current = progress;
	loopRef.current = loop;
	const assetKey = `${scene.id}|${scene.background ?? ""}|${scene.layers.map((l) => l.image).join(",")}`;
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		if (!ctx) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		let cancelled = false;
		let raf = 0;
		let bg = null;
		const layerImgs = /* @__PURE__ */ new Map();
		const started = performance.now();
		const layers = sceneRef.current.layers;
		function size() {
			const node = canvasRef.current;
			if (!node) return {
				w: 0,
				h: 0
			};
			const rect = node.getBoundingClientRect();
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const w = Math.max(1, Math.round(rect.width * dpr));
			const h = Math.max(1, Math.round(rect.height * dpr));
			if (node.width !== w || node.height !== h) {
				node.width = w;
				node.height = h;
			}
			return {
				w,
				h
			};
		}
		function paint(now) {
			if (!canvasRef.current || !ctx) return;
			const { w, h } = size();
			if (!w || !h) return;
			const sc = sceneRef.current;
			const cam = cameraRef.current ?? sc.camera;
			const usedGrade = gradeRef.current === void 0 ? sc.grade : gradeRef.current;
			const duration = Math.max(sc.end - sc.start, 2.5);
			let p;
			const prog = progressRef.current;
			if (typeof prog === "number") p = Math.max(0, Math.min(1, prog));
			else if (reduced) p = .45;
			else if (loopRef.current) p = (now - started) / 1e3 / duration % 1;
			else p = .45;
			const seconds = p * duration;
			ctx.filter = gradeFilter(usedGrade);
			drawCamera(ctx, bg, cam, p, w, h, sc.bgColor, Math.floor(now / 32));
			drawLayers(ctx, layerImgs, sc.layers, p, seconds, w, h);
			ctx.filter = "none";
			drawVignette(ctx, w, h, sc.vignette);
			if (sc.letterbox) drawLetterbox(ctx, w, h);
		}
		function tick(now) {
			if (cancelled) return;
			paint(now);
			raf = requestAnimationFrame(tick);
		}
		async function boot() {
			const sc = sceneRef.current;
			if (sc.background) try {
				bg = await loadImage(sc.background);
			} catch {
				bg = null;
			}
			await Promise.all(layers.map(async (layer) => {
				try {
					layerImgs.set(layer.image, await loadImage(layer.image));
				} catch {}
			}));
			if (cancelled) return;
			raf = requestAnimationFrame(tick);
		}
		boot();
		const ro = new ResizeObserver(() => paint(performance.now()));
		ro.observe(canvas);
		return () => {
			cancelled = true;
			cancelAnimationFrame(raf);
			ro.disconnect();
		};
	}, [assetKey]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		className: cn("h-full w-full bg-background", className),
		"aria-label": `${scene.name} camera preview`
	});
}
var CAMERA_PRESETS = {
	static: cam(),
	zoom_in: cam({
		zoomFrom: 1,
		zoomTo: 1.25
	}),
	zoom_out: cam({
		zoomFrom: 1.25,
		zoomTo: 1
	}),
	pan_left: cam({
		zoomFrom: 1.2,
		zoomTo: 1.2,
		xFrom: .62,
		xTo: .38
	}),
	pan_right: cam({
		zoomFrom: 1.2,
		zoomTo: 1.2,
		xFrom: .38,
		xTo: .62
	}),
	tilt_up: cam({
		zoomFrom: 1.2,
		zoomTo: 1.2,
		yFrom: .62,
		yTo: .38
	}),
	tilt_down: cam({
		zoomFrom: 1.2,
		zoomTo: 1.2,
		yFrom: .38,
		yTo: .62
	}),
	push_in: cam({
		zoomFrom: 1.05,
		zoomTo: 1.45,
		easing: "in"
	}),
	drift: cam({
		zoomFrom: 1.1,
		zoomTo: 1.18,
		xFrom: .47,
		xTo: .53,
		yFrom: .52,
		yTo: .48
	}),
	handheld: cam({
		zoomFrom: 1.15,
		zoomTo: 1.15,
		shake: .5
	}),
	dolly_zoom: cam({
		zoomFrom: 1.4,
		zoomTo: 1,
		easing: "out"
	})
};
function cam(partial = {}) {
	return {
		zoomFrom: 1,
		zoomTo: 1,
		xFrom: .5,
		yFrom: .5,
		xTo: .5,
		yTo: .5,
		easing: "in-out",
		shake: 0,
		...partial
	};
}
var TRANSITIONS = [
	{
		id: "cut",
		label: "Cut",
		note: "Hard join at the midpoint"
	},
	{
		id: "crossfade",
		label: "Crossfade",
		note: "Dissolve A into B"
	},
	{
		id: "fade-black",
		label: "Fade black",
		note: "Down to black, up on B"
	},
	{
		id: "fade-white",
		label: "Fade white",
		note: "Flash through white"
	},
	{
		id: "slide-left",
		label: "Slide left",
		note: "A exits, B pushes in"
	},
	{
		id: "slide-right",
		label: "Slide right",
		note: "A exits the other way"
	},
	{
		id: "wipe",
		label: "Wipe",
		note: "B reveals left to right"
	},
	{
		id: "zoom",
		label: "Zoom",
		note: "A punches in while B arrives"
	}
];
var GRADES = [
	{
		id: "none",
		label: "None",
		note: "Straight still"
	},
	{
		id: "warm",
		label: "Warm",
		note: "Lifted red, held blue"
	},
	{
		id: "cool",
		label: "Cool",
		note: "Held red, lifted blue"
	},
	{
		id: "noir",
		label: "Noir",
		note: "Contrast grayscale"
	},
	{
		id: "vintage",
		label: "Vintage",
		note: "Soft contrast, tea stains"
	},
	{
		id: "vivid",
		label: "Vivid",
		note: "Pushed saturation"
	}
];
var KEEPER = "/film/assets/keeper.png";
var FILM = {
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
		pitch: "−2 Hz"
	},
	guestVoice: {
		name: "Aria",
		id: "en-US-AriaNeural"
	},
	music: {
		file: "theme.wav",
		volume: .28,
		duckDb: 12,
		fadeIn: 2,
		fadeOut: 4
	}
};
var PIPELINE = [
	{
		step: "01",
		title: "Screenplay",
		body: "A YAML (or JSON) script names stills, camera moves, cut-out actors, captions, narration, and the join into the next scene. Defaults cascade so each scene only writes what changed."
	},
	{
		step: "02",
		title: "Voice & clock",
		body: "Each narration line is voiced, then cached by a hash of text + voice + rate + pitch. Scenes marked auto size themselves to speech plus a short pad, so the edit breathes with the read."
	},
	{
		step: "03",
		title: "Mix",
		body: "Voices and effects are placed on an absolute timeline. The music bed loops, fades, and ducks under speech with a sidechain compressor so the narrator always sits in front."
	},
	{
		step: "04",
		title: "Frame",
		body: "Every frame oversamples the still 1.5×, crops a Ken Burns window, composites actors and type, then grades, vignettes, and letterboxes. Frames stream into the encoder so memory stays flat."
	}
];
var SCENES = [
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
		vignette: .35,
		letterbox: true,
		transition: "fade-black",
		transitionDuration: 1.2,
		layers: [],
		texts: [{
			text: "The Last Lighthouse",
			style: "title",
			start: .4,
			anim: "rise"
		}, {
			text: "a CinemaForge production",
			style: "subtitle",
			start: 1.4,
			anim: "fade"
		}],
		narration: []
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
		vignette: .35,
		letterbox: false,
		transition: "crossfade",
		transitionDuration: .8,
		layers: [{
			image: KEEPER,
			easing: "in-out",
			flip: false,
			shadow: true,
			bob: .006,
			bobSpeed: 2.2,
			keyframes: [{
				t: 0,
				x: .15,
				y: .72,
				scale: .7,
				rot: 0,
				opacity: 1
			}, {
				t: 1,
				x: .42,
				y: .66,
				scale: .85,
				rot: 0,
				opacity: 1
			}]
		}],
		texts: [{
			text: "Maren, keeper of the light",
			style: "lower-third",
			start: 1,
			end: 4.5,
			anim: "fade"
		}],
		narration: ["Every autumn, when the fog rolled in from the north, old Maren climbed the cliff path to light the lamp."]
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
		vignette: .35,
		letterbox: false,
		transition: "zoom",
		transitionDuration: .8,
		layers: [{
			image: KEEPER,
			easing: "in-out",
			flip: true,
			shadow: true,
			bob: 0,
			bobSpeed: 1,
			keyframes: [
				{
					t: 0,
					x: .8,
					y: .7,
					scale: .9,
					rot: 0,
					opacity: 0
				},
				{
					t: .2,
					x: .75,
					y: .7,
					scale: .9,
					rot: 0,
					opacity: 1
				},
				{
					t: 1,
					x: .55,
					y: .66,
					scale: 1.05,
					rot: 0,
					opacity: 1
				}
			]
		}],
		texts: [],
		narration: ["But this year the fog did not roll. It surged.", "And somewhere inside it, something was coming home."],
		voices: ["Ryan, slowed", "Aria"]
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
		vignette: .35,
		letterbox: false,
		transition: "fade-white",
		transitionDuration: 1,
		layers: [],
		texts: [{
			text: "She struck the match.",
			style: "caption",
			start: .2,
			anim: "typewriter"
		}],
		narration: ["She struck the match."]
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
		vignette: .35,
		letterbox: false,
		transition: "cut",
		transitionDuration: 0,
		layers: [],
		texts: [{
			text: "Written & directed by You",
			style: "title",
			start: 0,
			anim: "rise"
		}, {
			text: "Voices: Ryan · Aria  —  Music: procedural theme",
			style: "subtitle",
			start: 1.2,
			anim: "fade"
		}],
		narration: []
	}
];
function sceneAt(time, duration = 24.7) {
	const scenes = SCENES.map((s, i) => i === SCENES.length - 1 ? {
		...s,
		end: Math.max(s.end, duration)
	} : s);
	for (let i = scenes.length - 1; i >= 0; i--) {
		const s = scenes[i];
		if (time + 1e-4 >= s.start) return s;
	}
	return scenes[0];
}
var SCRIPT_YAML = `# CinemaForge screenplay
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
function FilmPlayer({ time, duration, onTime, onDuration, seekRef }) {
	const videoRef = (0, import_react.useRef)(null);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [captions, setCaptions] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		seekRef.current = (t) => {
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
	(0, import_react.useEffect)(() => {
		const v = videoRef.current;
		if (!v) return;
		const tracks = v.textTracks;
		for (let i = 0; i < tracks.length; i++) tracks[i].mode = captions ? "showing" : "hidden";
	}, [captions]);
	function togglePlay() {
		const v = videoRef.current;
		if (!v) return;
		if (v.paused) {
			if (v.ended || v.duration && v.currentTime >= v.duration - .05) {
				v.currentTime = 0;
				onTime(0);
			}
			v.play();
		} else v.pause();
	}
	const ended = duration > 0 && time >= duration - .08;
	const showOverlay = !playing && (time < .15 || ended);
	const pct = duration > 0 ? time / duration * 100 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-xl bg-card shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-video bg-background",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("video", {
				ref: videoRef,
				className: "h-full w-full object-cover",
				playsInline: true,
				preload: "auto",
				poster: FILM.poster,
				onClick: togglePlay,
				onPlay: () => setPlaying(true),
				onPause: () => setPlaying(false),
				onEnded: () => setPlaying(false),
				onTimeUpdate: (e) => onTime(e.currentTarget.currentTime),
				onLoadedMetadata: (e) => onDuration(e.currentTarget.duration),
				onDurationChange: (e) => onDuration(e.currentTarget.duration),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
					src: FILM.videoSrc,
					type: "video/mp4"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("track", {
					kind: "subtitles",
					src: FILM.captionsSrc,
					srcLang: "en",
					label: "English",
					default: true
				})]
			}), showOverlay ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: togglePlay,
				className: "absolute inset-0 flex items-center justify-center bg-background/35",
				"aria-label": ended ? "Replay film" : "Play film",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
						className: "ml-0.5 size-7",
						fill: "currentColor"
					})
				})
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "group relative h-11 w-full",
				"aria-label": "Seek",
				onClick: (e) => {
					const rect = e.currentTarget.getBoundingClientRect();
					const x = (e.clientX - rect.left) / rect.width;
					seekRef.current?.(x * duration);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-raised" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-primary",
						style: { width: `${pct}%` }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary",
						style: { left: `${pct}%` }
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: togglePlay,
						"aria-label": playing ? "Pause" : "Play",
						children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "ml-px" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => {
							const v = videoRef.current;
							if (!v) return;
							v.muted = !v.muted;
							setMuted(v.muted);
						},
						"aria-label": muted ? "Unmute" : "Mute",
						children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setCaptions((c) => !c),
						"aria-label": captions ? "Hide captions" : "Show captions",
						className: cn(!captions && "text-faint"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Captions, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "ml-auto font-mono text-xs tabular-nums text-muted-foreground",
						children: [formatTimecode(time), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-faint",
							children: [" / ", formatTimecode(duration)]
						})]
					})
				]
			})]
		})]
	});
}
function TransitionStage({ from, to, kind, progress, className }) {
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
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
			async function frame(scene, p) {
				let img = null;
				if (scene.background) try {
					img = await loadImage(scene.background);
				} catch {
					img = null;
				}
				octx.filter = gradeFilter(scene.grade);
				drawCamera(octx, img, scene.camera, p, w, h, scene.bgColor, 0);
				octx.filter = "none";
				drawVignette(octx, w, h, scene.vignette);
				return octx.getImageData(0, 0, w, h);
			}
			const a = await frame(from, .92);
			const b = await frame(to, .08);
			if (cancelled) return;
			mixTransition(ctx, a, b, kind, progress);
		}
		paint();
		const ro = new ResizeObserver(() => void paint());
		ro.observe(canvas);
		return () => {
			cancelled = true;
			ro.disconnect();
		};
	}, [
		from,
		to,
		kind,
		progress
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvasRef,
		className: cn("h-full w-full bg-background", className),
		"aria-label": `${kind} transition preview`
	});
}
function Studio() {
	const [time, setTime] = (0, import_react.useState)(0);
	const [duration, setDuration] = (0, import_react.useState)(24.7);
	const seekRef = (0, import_react.useRef)(null);
	const onTime = (0, import_react.useCallback)((t) => setTime(t), []);
	const onDuration = (0, import_react.useCallback)((d) => {
		if (Number.isFinite(d) && d > 0) setDuration(d);
	}, []);
	const scene = sceneAt(time, duration);
	function seekScene(s) {
		setTime(s.start + .05);
		seekRef.current?.(s.start + .05);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 200,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-dvh bg-background text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-6 md:px-8 md:pt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-6 lg:grid-cols-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "lg:col-span-7",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilmPlayer, {
								time,
								duration,
								onTime,
								onDuration,
								seekRef
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneInspector, {
							scene,
							duration,
							time
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SceneStrip, {
						scene,
						onSelect: seekScene
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EngineBay, { scene }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScriptPanel, {})
				]
			})]
		})
	});
}
function Header() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "border-b border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-9 items-center justify-center rounded-md bg-raised shadow-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, { className: "size-4 text-primary" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg leading-tight tracking-display",
					children: "CinemaForge"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Screening room"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "outline",
				children: [
					FILM.resolution,
					" · ",
					FILM.fps,
					" fps"
				]
			})]
		})
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground",
				children: "Engine 1.0 · demo reel"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl leading-tight tracking-display md:text-5xl",
				children: FILM.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-xl text-base text-muted-foreground",
				children: "A YAML screenplay, stills, and a cut-out keeper become a narrated short. Watch the cut, then step through camera, grade, and mix — the same moves the renderer used to draw every frame."
			})
		]
	});
}
function SceneInspector({ scene, duration, time }) {
	const span = Math.max(scene.end - scene.start, .001);
	const progress = Math.max(0, Math.min(1, (time - scene.start) / span));
	const next = SCENES[SCENES.findIndex((s) => s.id === scene.id) + 1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex flex-col gap-4 rounded-xl bg-card p-4 shadow-border lg:col-span-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs uppercase tracking-wider text-muted-foreground",
					children: ["Scene ", scene.number]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-display",
					children: scene.name
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: formatTimecode(scene.start) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-lg bg-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-video",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KenBurnsStage, {
						scene,
						progress
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-x-4 gap-y-3 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
						label: "Camera",
						value: scene.cameraName.replaceAll("_", " ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
						label: "Grade",
						value: scene.grade ?? "none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
						label: "Join",
						value: next ? `${scene.transition} · ${scene.transitionDuration}s` : "end card"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
						label: "Duration",
						value: scene.durationLabel
					})
				]
			}),
			scene.narration.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
				className: "border-l-2 border-primary/40 pl-3 text-sm leading-relaxed text-muted-foreground",
				children: scene.narration.join(" ")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: scene.texts.map((t) => t.text).join(" · ") || "No narration on this card."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-mono text-xs tabular-nums text-faint",
				children: [
					Math.round(progress * 100),
					"% through the scene · film ",
					formatTimecode(time),
					" /",
					" ",
					formatTimecode(duration)
				]
			})
		]
	});
}
function Spec({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "font-mono text-xs uppercase tracking-wider text-faint",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "capitalize text-foreground",
		children: value
	})] });
}
function SceneStrip({ scene, onSelect }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 flex items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-2xl tracking-display",
			children: "The cut"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Five scenes, one lighthouse."
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0",
		children: SCENES.map((s) => {
			const active = s.id === scene.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSelect(s),
				className: cn("min-w-40 shrink-0 overflow-hidden rounded-lg bg-card text-left shadow-border transition-[box-shadow,transform] duration-150 ease-out md:min-w-0", "hover:shadow-border-hover active:scale-[0.96]", active && "ring-2 ring-ring ring-offset-2 ring-offset-background"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-video bg-raised",
					children: [s.background ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: s.background,
						alt: "",
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-background" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute left-2 top-2 font-mono text-xs text-primary",
						children: s.number
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "px-3 py-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: s.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs capitalize text-muted-foreground",
						children: [
							s.cameraName.replaceAll("_", " "),
							" · ",
							s.grade ?? "ungraded"
						]
					})]
				})]
			}, s.id);
		})
	})] });
}
function EngineBay({ scene }) {
	const presetNames = Object.keys(CAMERA_PRESETS);
	const [preset, setPreset] = (0, import_react.useState)(scene.cameraName);
	const [grade, setGrade] = (0, import_react.useState)(scene.grade ?? "none");
	const [transition, setTransition] = (0, import_react.useState)(scene.transition);
	const [join, setJoin] = (0, import_react.useState)(.45);
	(0, import_react.useEffect)(() => {
		setPreset(scene.cameraName);
		setGrade(scene.grade ?? "none");
		setTransition(scene.transition);
	}, [
		scene.id,
		scene.cameraName,
		scene.grade,
		scene.transition
	]);
	const playgroundScene = (0, import_react.useMemo)(() => ({
		...scene,
		camera: CAMERA_PRESETS[preset] ?? scene.camera,
		grade: grade === "none" ? null : grade
	}), [
		scene,
		preset,
		grade
	]);
	const from = scene;
	const to = SCENES[Math.min(SCENES.length - 1, SCENES.findIndex((s) => s.id === scene.id) + 1)] ?? scene;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-display",
				children: "Inside the engine"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted-foreground",
				children: "CinemaForge is a small renderer, not a timeline app. The script names a still and a camera; the rest is crop, composite, grade, and a mix that ducks under speech."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
				children: PIPELINE.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg bg-card p-4 shadow-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs text-faint",
							children: step.step
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-2 font-display text-xl tracking-display",
							children: step.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: step.body
						})
					]
				}, step.step))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-card p-4 shadow-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scan, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl tracking-display",
								children: "Camera"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 overflow-hidden rounded-lg bg-background",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "aspect-video",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KenBurnsStage, {
									scene: playgroundScene,
									camera: CAMERA_PRESETS[preset],
									grade: grade === "none" ? null : grade,
									loop: true
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: presetNames.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: preset === name ? "default" : "outline",
								onClick: () => setPreset(name),
								className: "capitalize",
								children: name.replaceAll("_", " ")
							}, name))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: "Presets are just from/to zoom and pan. Handheld adds a seeded shake. Stills are oversampled 1.5× so a push-in stays sharp."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-card p-4 shadow-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Aperture, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-xl tracking-display",
									children: "Grade"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: GRADES.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: grade === g.id ? "default" : "outline",
									onClick: () => setGrade(g.id),
									children: g.label
								}, g.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: [GRADES.find((g) => g.id === grade)?.note, ". Applied after actors and type, before vignette."]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl bg-card p-4 shadow-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-4 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-xl tracking-display",
									children: "Join"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-4 overflow-hidden rounded-lg bg-background",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "aspect-video",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TransitionStage, {
										from,
										to,
										kind: transition,
										progress: join
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: TRANSITIONS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: transition === t.id ? "default" : "outline",
									onClick: () => setTransition(t.id),
									children: t.label
								}, t.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-4 flex items-center gap-3 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "w-16 shrink-0 font-mono",
									children: ["Mix ", Math.round(join * 100)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: 100,
									value: Math.round(join * 100),
									onChange: (e) => setJoin(Number(e.target.value) / 100),
									className: "h-11 w-full accent-primary"
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MixCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioLines, { className: "size-4" }),
						title: "Narration",
						body: `Default voice ${FILM.voice.name} at ${FILM.voice.rate}, ${FILM.voice.pitch}. The storm’s second line switches to ${FILM.guestVoice.name}. Clips cache so a re-render does not re-voice.`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MixCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioLines, { className: "size-4" }),
						title: "Music bed",
						body: `A looping theme at volume ${FILM.music.volume}, faded ${FILM.music.fadeIn}s in and ${FILM.music.fadeOut}s out, ducked ${FILM.music.duckDb} dB under speech.`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MixCard, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, { className: "size-4" }),
						title: "Actors",
						body: "PNG layers with alpha sit on the still. Keyframes are 0–1 of the scene; scale 1 is 60% of frame height. A light bob sells a walk without a walk cycle."
					})
				]
			})
		]
	});
}
function MixCard({ icon, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-lg bg-card p-4 shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-muted-foreground",
			children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-lg text-foreground tracking-display",
				children: title
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: body
		})]
	});
}
function ScriptPanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-display",
				children: "The screenplay"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted-foreground",
				children: "This is the YAML that produced the reel. Duration auto fits the read; cameras and grades are named presets you can override per scene."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-hidden rounded-xl bg-card shadow-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-4 py-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs text-muted-foreground",
					children: "script.yaml"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "outline",
					children: [SCENES.length, " scenes"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "max-h-96 overflow-auto p-4 font-mono text-xs leading-relaxed text-muted-foreground",
				children: SCRIPT_YAML
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "mt-10" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "pt-6 text-sm text-faint",
			children: [
				"CinemaForge ",
				FILM.version,
				" — stills, keyframes, voice, mix. The reel is the bundled demo, The Last Lighthouse."
			]
		})
	] });
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studio, {});
}
//#endregion
export { Home as component };
