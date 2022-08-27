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

let mapWidth = 1000;
let mapHeight = 1000;
let mapRatio = 10;
let level = 0;

let blockSize = 100;

let scene = "menu";

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

const guns = {
  "phaser": {
    upg: ['shotgun', 'blaster'],
    damage: 5,
    regen: 0.15,
    capacity: 25,
    bulletType: 'default',
    fireRate: 15,
    bullets: 1,
    speed: 20,
    accuracy: 10,
    cost: 0,
    sound: "gun1.mp3"
  },

  "shotgun": {
    upg: ['hydra', 'assault'],
    damage: 2,
    regen: 0.25,
    capacity: 40,
    bulletType: 'smol',
    fireRate: 15,
    bullets: 10,
    speed: 15,
    accuracy: 120,
    cost: 35,
    sound: "gun2.mp3"
  },
  "blaster": {
    upg: ['assault', 'sniper'],
    damage: 10,
    regen: 0.25,
    capacity: 50,
    bulletType: 'default',
    fireRate: 15,
    bullets: 1,
    speed: 25,
    accuracy: 7.5,
    cost: 30,
    sound: "gun3.mp3"
  },

  "hydra": {
    upg: ['locust', 'sidewinder'],
    damage: 3,
    regen: 0.35,
    capacity: 50,
    bulletType: 'smol',
    fireRate: 5,
    bullets: 1,
    speed: 15,
    accuracy: 40,
    cost: 75,
    sound: "gun1.mp3"
  },
  "assault": {
    upg: ['locust', 'sidewinder', 'atomshred'],
    damage: 5,
    regen: 0.5,
    capacity: 30,
    bulletType: 'default',
    fireRate: 5,
    bullets: 1,
    speed: 25,
    accuracy: 7.5,
    cost: 70,
    sound: "gun3.mp3"
  },
  "sniper": {
    upg: ['atomshred', 'soulsmiter'],
    damage: 60,
    regen: 0.5,
    capacity: 100,
    bulletType: 'default',
    fireRate: 20,
    bullets: 1,
    speed: 30,
    accuracy: 0,
    cost: 90,
    sound: "gun4.mp3"
  },

  "locust": {
    upg: false,
    damage: 2,
    regen: 1,
    capacity: 100,
    bulletType: 'smol',
    fireRate: 2,
    bullets: 3,
    speed: 20,
    accuracy: 60,
    cost: 225,
    sound: "gun3.mp3"
  },
  "sidewinder": {
    upg: false,
    damage: 15,
    regen: 1,
    capacity: 100,
    bulletType: 'default',
    fireRate: 5,
    bullets: 1,
    speed: 25,
    accuracy: 20,
    cost: 250,
    sound: "gun2.mp3"
  },
  "atomshred": {
    upg: false,
    damage: 80,
    regen: 1,
    capacity: 160,
    bulletType: 'default',
    fireRate: 15,
    bullets: 2,
    speed: 25,
    accuracy: 50,
    cost: 275,
    sound: "gun4.mp3"
  },
  "soulsmiter": {
    upg: false,
    damage: 100,
    regen: 2,
    capacity: 300,
    bulletType: 'default',
    fireRate: 35,
    bullets: 1,
    speed: 25,
    accuracy: 0,
    cost: 300,
    sound: "gun4.mp3"
  }
}
const tiers = [
  {
    health: 100,
    healthRegen: 0.025,
    tierXP: 250,
    speed: 5
  },
  {
    health: 150,
    healthRegen: 0.05,
    tierXP: 750,
    speed: 4
  },
  {
    health: 250,
    healthRegen: 0.035,
    tierXP: 1500,
    speed: 4
  },
  {
    health: 300,
    healthRegen: 0.05,
    tierXP: 30,
    speed: 3
  }
]