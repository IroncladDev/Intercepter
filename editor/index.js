// All sprites
let sprites = {};

// Load a single sprite
function loadSprite(name, file) {
  sprites[name] = loadImage("assets/images/" + file);
}

// Load a spritesheet
function loadSpriteSheet(file, bitmap) {
  loadImage("assets/images/" + file, img => {
    let w = img.width;
    let h = img.height;
    let sizeX = w / bitmap[0].length;
    let sizeY = h / bitmap.length;
    for (let y in bitmap) {
      for (let x in bitmap[y]) {
        sprites[bitmap[y][x]] = img.get(x * sizeX, y * sizeY, sizeX, sizeY);
      }
    }
  });
}

// Load all images in the preload function
function preload() {

  loadSpriteSheet("blocks.png", [
    ["0", "s", "s", "s", "s", "s"]
  ]);

  loadSpriteSheet("turrets.png", [
    ["!", "#", "$"]
  ])

  loadSprite("B", "base.png")

  loadSpriteSheet("unit-heads.png", [
    ["b", "b-tier-1-head", "b-tier-2-head", "b-tier-3-head", "r", "r-tier-1-head", "r-tier-2-head", "@"]
  ])
}

let blockTypes = "0!$Brb@";
let out = [];
let cells = [];
let blocks = [];
let size = 25;
let cellWidth = Number(prompt("Enter level width (cells)"));
let cellHeight = Number(prompt("Enter level height (cells)"));
let currentCode = "+";
let camX = 0, camY = 0;

class Sl {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.code = " ";
  }

  run() {
    stroke("#eb1c56");
    strokeWeight(0.25);
    fill("#432443")
    rect(this.x * size, this.y * size, size, size);
    if (this.code !== " ") {
      image(sprites[this.code], this.x * size, this.y * size, size, size);

    }
    noStroke();
    if ((mouseX - camX) > this.x * size && (mouseX - camX) < this.x * size + size && (mouseY - camY) > this.y * size && (mouseY - camY) < this.y * size + size) {
      cursor("pointer");
      fill(0, 30)
      rect(this.x * size, this.y * size, size, size);
      if (mouseIsPressed) {
        this.code = currentCode;
        out[this.y][this.x] = this.code;
        console.clear()
        console.log("Paste level bitmap:")
        console.log(out.map(x => x.join``))
      }
      if (keyIsPressed && key === "z") {
        this.code = " ";
        out[this.y][this.x] = this.code;
        console.clear()
        console.log("Paste level bitmap:")
        console.log(out.map(x => x.join``))
      }

    }
  }
}

for (let y = 0; y < cellHeight; y++) {
  let u = []
  for (let x = 0; x < cellWidth; x++) {
    cells.push(new Sl(x, y));
    u.push(" ")
  }
  out.push(u)
}

class B {
  constructor(code, x, y) {
    this.x = x;
    this.y = y;
    this.code = code;
  }
  run() {
    stroke(0);
    fill(200, 225, 255)
    rect(this.x, this.y, size * 2, size * 2);
    if (this.code !== " ") {
      image(sprites[this.code], this.x, this.y, size * 2, size * 2);

    }
    noStroke();
    if (mouseX > this.x && mouseX < this.x + size * 2 && mouseY > this.y && mouseY < this.y + size * 2) {
      cursor("pointer");
      fill(0, 30)
      rect(this.x, this.y, size * 2, size * 2);
      if (mouseIsPressed) {
        currentCode = this.code
      }

    }
  }
}

for (let b in blockTypes) {
  blocks.push(new B(blockTypes[b], b * size * 2, cellHeight * size));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  cursor("default");
  background("#222435");

  push();
  translate(camX, camY);
  cells.forEach(x => x.run());
  pop();

  if (keyIsPressed) {
    if (key === "ArrowLeft") camX -= 10;
    if (key === "ArrowRight") camX += 10;
    if (key === "ArrowUp") camY -= 10;
    if (key === "ArrowDown") camY += 10;
  }

  blocks.forEach(b => b.run())
}