import fragmentShader from "./shaders/gradient.frag.glsl?raw";
import vertexShader from "./shaders/gradient.vert.glsl?raw";

export { fragmentShader, vertexShader };

export const MODE_IDS = {
  mesh: 0,
  aurora: 1,
  grainy: 2,
  "deep-sea": 3,
  holographic: 4,
  impasto: 5,
  spectral: 6,
  fractal: 7,
};
