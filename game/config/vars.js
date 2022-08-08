const { Engine, World, Bodies, Vector, Collision, SAT, Common } = Matter;
const bd = Matter.Body;
Common.setDecomp(decomp);

// Our world and engine
let world, engine, player;

// An array of all bodies
let bodies = [];
let bullets = [];
let particles = [];

// What keys are currently being pressed down
let keys = {};

// If a click has been executed
let clicked = false;
let currentKeyReleased = false;
let mir = false;
let mouseButtons = {};

let scene = "game";

const colors = {
  bgRoot: "#222435",
  bgDimmer: "#2d2d44",
  bgDefault: "#373a52",
  bgHigher: "#3d4461",
  bgHighest: "#53597b",
  bgHighester: "#6c739c",

  accentDimmest: "#432443",
  accentDimmer: "#5e1a41",
  accentDefault: "#a80f56",
  accentHigher: "#eb1c56",
  accentHighest: "#ff4072",

  blueDimmest: "#0a4063",
  blueDimmer: "#1e5f8a",
  blueDefault: "#3d80ad",
  blueHigher: "#69aedb",
  blueHighest: "#98d3fa"
}