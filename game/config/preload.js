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
  loadSprite("player-head", "player/player-head.png")
  loadSprite("player-body", "player/player-body.png")
  loadSprite("player-pack", "player/player-pack.png")

  loadSprite("gun-rifle-1", "weapons/gun-rifle-1.png")
}

