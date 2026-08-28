import { Mesh, Program, Renderer, Triangle, Vec3 } from "ogl";

import { fragmentShader, MODE_IDS, vertexShader } from "./gradient-shaders.js";

const DEFAULT_DPR = 0.75;
const TARGET_FPS = 30;
const FRAME_DURATION = 1000 / TARGET_FPS;
const TIME_PER_MILLISECOND = 0.0006;
const MAX_FRAME_DELTA = 100;

export class LuminaGradientRenderer {
  animationId = 0;
  lastFrameTime = 0;
  time = 0;
  speed = 1;
  shouldRun = false;
  resizeObserver = null;

  constructor(options) {
    this.container = resolveContainer(options.container);
    this.fixedSize = options.fixedSize ?? null;
    this.observeResize = options.observeResize ?? !this.fixedSize;
    this.time = options.initialTime ?? 0;

    this.renderer = new Renderer({
      alpha: false,
      dpr: options.dpr ?? DEFAULT_DPR,
      preserveDrawingBuffer: false,
    });
    this.gl = this.renderer.gl;
    this.container.appendChild(this.gl.canvas);
    Object.assign(this.gl.canvas.style, {
      width: "100%",
      height: "100%",
      display: "block",
    });

    this.geometry = new Triangle(this.gl);
    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: this.time },
        uColor1: { value: new Vec3() },
        uColor2: { value: new Vec3() },
        uColor3: { value: new Vec3() },
        uColor4: { value: new Vec3() },
        uColor5: { value: new Vec3() },
        uNoiseStrength: { value: 0.2 },
        uMode: { value: 0 },
      },
    });
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.updateUniforms(options.colors, options.mode, options.noiseStrength);

    this.resize = this.resize.bind(this);
    this.update = this.update.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.resize();

    document.addEventListener("visibilitychange", this.handleVisibilityChange);

    if (this.observeResize) {
      this.resizeObserver = new ResizeObserver(this.resize);
      this.resizeObserver.observe(this.container);
    }

    if (options.autoStart ?? true) {
      this.start();
    } else {
      this.renderFrame();
    }
  }

  updateUniforms(colors, mode = "mesh", noiseStrength = 0.2) {
    const rgbColors = colors.map(toRgb);
    while (rgbColors.length < 5) rgbColors.push([0, 0, 0]);

    const uniforms = this.program.uniforms;
    uniforms.uColor1.value.set(...rgbColors[0]);
    uniforms.uColor2.value.set(...rgbColors[1]);
    uniforms.uColor3.value.set(...rgbColors[2]);
    uniforms.uColor4.value.set(...rgbColors[3]);
    uniforms.uColor5.value.set(...rgbColors[4]);
    uniforms.uNoiseStrength.value = noiseStrength;
    uniforms.uMode.value = MODE_IDS[mode] ?? MODE_IDS.mesh;
  }

  resize() {
    const width = this.fixedSize?.width ?? this.container.clientWidth;
    const height = this.fixedSize?.height ?? this.container.clientHeight;

    // OGL reallocates the canvas backing store on every setSize call.
    if (this.renderer.width === width && this.renderer.height === height) return;
    this.renderer.setSize(width, height);
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  getCanvas() {
    return this.gl.canvas;
  }

  getCurrentTime() {
    return this.time;
  }

  setTime(time) {
    this.time = time;
    this.program.uniforms.uTime.value = time;
  }

  setFixedSize(width, height) {
    this.fixedSize = { width, height };
    this.resize();
  }

  renderFrame({ width, height, time } = {}) {
    if (typeof width === "number" && typeof height === "number") {
      this.setFixedSize(width, height);
    }
    if (typeof time === "number") this.setTime(time);

    this.renderer.render({ scene: this.mesh });
  }

  update(timestamp) {
    this.animationId = requestAnimationFrame(this.update);
    if (typeof timestamp !== "number") return;

    if (!this.lastFrameTime) {
      this.lastFrameTime = timestamp;
      return;
    }

    const elapsed = timestamp - this.lastFrameTime;
    if (elapsed < FRAME_DURATION) return;

    this.lastFrameTime = timestamp;
    this.time += Math.min(elapsed, MAX_FRAME_DELTA) * TIME_PER_MILLISECOND * this.speed;
    this.program.uniforms.uTime.value = this.time;
    this.renderer.render({ scene: this.mesh });
  }

  start() {
    this.shouldRun = true;
    if (!document.hidden && !this.animationId) {
      this.animationId = requestAnimationFrame(this.update);
    }
  }

  stop() {
    this.shouldRun = false;
    this.pause();
  }

  pause() {
    if (!this.animationId) return;

    cancelAnimationFrame(this.animationId);
    this.animationId = 0;
    this.lastFrameTime = 0;
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.pause();
    } else if (this.shouldRun && !this.animationId) {
      this.animationId = requestAnimationFrame(this.update);
    }
  }

  dispose() {
    this.stop();
    this.resizeObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);

    this.geometry.remove();
    this.program.remove();

    if (this.gl.canvas.parentNode === this.container) {
      this.container.removeChild(this.gl.canvas);
    }
  }
}

function resolveContainer(container) {
  if (typeof container !== "string") return container;

  const element = document.querySelector(container);
  if (!element) throw new Error(`Container not found: ${container}`);
  return element;
}

function toRgb(color) {
  if (Array.isArray(color)) return color;

  const hex = color.replace("#", "");
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
}

function trackEvent(eventName, details = {}) {
  const event = {
    event: "lumina_event",
    event_name: eventName,
    ...details,
  };

  if (Array.isArray(window.dataLayer)) window.dataLayer.push(event);
  if (typeof window.clarity === "function") {
    try {
      window.clarity("event", eventName);
    } catch {
      // Analytics must never break the gradient.
    }
  }
}

function createGradient(options, kind) {
  const gradient = new LuminaGradientRenderer(options);
  trackEvent("embed_init", {
    source: "embed",
    kind,
    mode: options.mode || "mesh",
  });
  return gradient;
}

function initializeEmbeddedGradients() {
  document.querySelectorAll("[data-lumina-gradient]").forEach((container) => {
    const encodedColors = container.getAttribute("data-colors");
    if (!encodedColors) return;

    try {
      const mode = container.getAttribute("data-mode") || "mesh";
      const noise = container.getAttribute("data-noise");
      const speed = container.getAttribute("data-speed");
      const gradient = createGradient(
        {
          container,
          colors: JSON.parse(encodedColors),
          mode,
          noiseStrength: noise ? parseFloat(noise) : 0.2,
        },
        "auto",
      );

      if (speed) gradient.setSpeed(parseFloat(speed));
    } catch (error) {
      console.error("LuminaGradient: Invalid configuration", error);
    }
  });
}

window.LuminaGradient = {
  init(options) {
    return createGradient(options, "manual");
  },
};

document.addEventListener("DOMContentLoaded", initializeEmbeddedGradients);
