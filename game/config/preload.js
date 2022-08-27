// All sprites
let sprites = {};

// Load a single sprite
function loadSprite(name, file) {
  sprites[name] = loadImage("assets/images/" + file);
}

// Load a spritesheet
function loadSpriteSheet(file, bitmap){
  loadImage("assets/images/" + file, img => {
    let w = img.width;
    let h = img.height;
    let sizeX = w / bitmap[0].length;
    let sizeY = h / bitmap.length;
    for(let y in bitmap){
      for(let x in bitmap[y]){
        sprites[bitmap[y][x]] = img.get(x * sizeX, y * sizeY, sizeX, sizeY);
      }
    }
  });
}

function preload () {
  loadSprite("robot", "logo.png");

  loadSpriteSheet("unit-bodies.png", [
    ["b-tier-0-body", "b-tier-1-body", "b-tier-3-body", "b-tier-2-body", "r-tier-0-body", "r-tier-1-body", "r-tier-3-body", "r-tier-2-body"]
  ])
  
  loadSpriteSheet("unit-heads.png", [
    ["b-tier-0-head", "b-tier-1-head", "b-tier-2-head", "b-tier-3-head", "r-tier-0-head", "r-tier-1-head", "r-tier-2-head", "r-tier-3-head"]
  ])

  loadSpriteSheet("unit-packs.png", [
    ["b-tier-0-pack", "b-tier-1-pack", "b-tier-2-pack", "b-tier-3-pack", "r-tier-0-pack", "r-tier-1-pack", "r-tier-2-pack", "r-tier-3-pack"]
  ])

  loadSpriteSheet("guns.png", [
    ["gun-phaser"],
    ["gun-shotgun"],
    ["gun-blaster"],
    ["gun-hydra"],
    ["gun-assault"],
    ["gun-sniper"],
    ['gun-locust'],
    ['gun-sidewinder'],
    ['gun-atomshred'],
    ['gun-soulsmiter']
  ])

  loadSpriteSheet("blocks.png", [
    ["block-[", 'block-=', 'block-|', 'block-L', 'block-+', 'block-o']
  ])

  loadSprite("coin", "coin.png")
  loadSprite("chest", "chest.png")
  loadSprite("base", "base.png")
  loadSprite("instructions", "instructions.png")

  loadSpriteSheet("turrets.png", [
    ["turret-!", "turret-#", "turret-$"]
  ])
  loadSpriteSheet("icons.png", [
    ["i0", "i1", "i2"]
  ])
  loadSpriteSheet("powericons.png", [
    ["grenades", "forcefields", "mines", "freezerays", "healthpacks", "nukes"]
  ])
  loadSprite("arcanium", "arcanium.png")
}

