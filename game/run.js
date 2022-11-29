// This is a comment which I've commited through git!
let bg, bgTex;
let bgSize = 100;

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const configBg = () => {
  noStroke();
  let xoff = 0;
  for (let x = 0; x < mapWidth/mapRatio; x+=5) {
      let yoff = 0;
      for (let y = 0; y < mapHeight/mapRatio; y+=5) {
          let bright = map(noise(xoff, yoff), 0, 1, 15, 200);
          fill(bright);
          rect(x, y, 5, 5)
          yoff += 0.25;
      }
      xoff += 0.25;
  }
  bgTex = get(0, 0, mapWidth/mapRatio, mapHeight/mapRatio);

  bg = createGraphics(mapWidth/mapRatio, mapHeight/mapRatio);
  bg.pixelDensity(5);
  bg.noStroke();
  let xoff1 = 0;
  for (let x = 0; x < mapWidth/mapRatio; x+=5) {
      let yoff1 = 0;
      for (let y = 0; y < mapHeight/mapRatio; y+=5) {
          let bright = map(noise(xoff1, yoff1), 0, 1, 15, 200);
          bg.fill(bright * 0.5, bright * 0.6, bright * 0.7);
          bg.rect(x, y, 5, 5)
          yoff1 += 0.25;
      }
      xoff1 += 0.25;
  }
  
  
}
const setLevel = () => {
  failTimer = 100;
  succeedTimer = 100;
  bodies = [];
  particles = [];
  bullets = [];
  World.clear(engine.world);
  Engine.clear(engine);
  mapWidth = blockSize * levels[level].m[0].length;
  mapHeight = blockSize * levels[level].m.length;
  
  let emptySpaces = [];
  let walls = [
    new Body(Bodies.rectangle(mapWidth/2, -25, mapWidth, 50, { isStatic: true })),
    new Body(Bodies.rectangle(mapWidth/2, mapHeight + 25, mapWidth, 50, { isStatic: true })),
    new Body(Bodies.rectangle(-25, mapHeight/2, 50, mapHeight, { isStatic: true })),
    new Body(Bodies.rectangle(mapWidth + 25, mapHeight/2, 50, mapHeight, { isStatic: true }))
  ];
  walls.forEach(w => {
    w.invis = true;
    bodies.push(w);
  });
  
  
  configBg();

  if(!levels[level].units.some(x => x.includes("@"))) throw new Error("Player was not added into level " + level)

  // Make sure to first add the player!
  for(let y = 0; y < levels[level].units.length; y++) {
    let row = levels[level].units[y];
    for(let x = 0; x < row.length; x++) {
      let char = row[x];
      let [cx, cy] = [x * blockSize, y * blockSize];
      if(char === "@") {
        player = new Player(Bodies.circle(cx, cy, 50, {
          restitution: 0.9
        }));
        bodies.push(player);
      }
      if(char === "r") {
        bodies.push(new Unit(Bodies.circle(cx, cy, 50, {
          restitution: 0.9
        }), 'unit', 'r'));
      }
      if(char === "b") {
        bodies.push(new Unit(Bodies.circle(cx, cy, 50, {
          restitution: 0.9
        }), 'unit', 'b'));
      }
      if(char === "A") {
        bodies.push(new Item("arcanium", cx, cy));
      }
      if(char === "C") {
        bodies.push(new Item("chest", cx, cy));
      }
    }
  }

  for(let y = 0; y < levels[level].m.length; y++) {
    let row = levels[level].m[y];
    for(let x = 0; x < row.length; x++) {
      let char = row[x];
      let [cx, cy] = [x * blockSize, y * blockSize];
      if(char === "0"){
        let top = (
          y == 0 ? 
          false : 
          (levels[level].m[y - 1][x] === "0")
        );

        let left = (
          x === 0 ? 
          false : 
          row[x - 1] === '0'
        );
        
        let bot = (
          y == (levels[level].m.length - 1) ? 
          false : 
          (levels[level].m[y + 1][x] === '0')
        )
        
        let right = (
          x == row.length - 1 ? 
          false : 
          (row[x + 1] == '0')
        );
        
        let code = 'o';
        let rot = 0;

        if(!top && !left && !bot && !right) code = 'o'

        else if(!top && !left && !bot && right) code = '['
        else if(top && !left && !bot && !right) code = '[', rot = -Math.PI/2
        else if(!top && left && !bot && !right) code = '[', rot = Math.PI
        else if(!top && !left && bot && !right) code = '[', rot = Math.PI/2

        else if(!top && left && bot && !right) code = "L", rot = Math.PI
        else if(top && !left && !bot && right) code = "L"
        else if(!top && !left && bot && right) code = "L", rot = Math.PI/2
        else if(top && left && !bot && !right) code = "L", rot = -Math.PI/2

        else if(top && left && bot && !right) code = '|', rot = Math.PI
        else if(!top && left && bot && right) code = '|', rot = Math.PI/2
        else if(top && !left && bot && right) code = '|'
        else if(top && left && !bot && right) code = '|', rot = -Math.PI/2
        
        else if(top && bot && !left && !right) code = "=", rot = Math.PI/2
        else if(!top && !bot && left && right) code = "="

        else if(top && left && bot && right) code = "+"
        
         
        bodies.push(new Block(
          code,
          cx,
          cy,
          rot, [top, left, bot, right]
        ))
      }
      if(char === 'B'){
        bodies.push(new Base(x * blockSize + blockSize, y * blockSize + blockSize))
      }
      if(char === '!' || char === '$') {
        bodies.push(new Turret(char, x * blockSize + blockSize/2, y * blockSize + blockSize/2))
      }
      if(char === " ") emptySpaces.push({ x, y })
    }
  }

  let { coinCount, chestCount } = levels[level];
  let coinC = 0;
  let chestC = 0;
  let spaces1 = shuffle(emptySpaces)
  let spaces2 = shuffle(emptySpaces)
  for(let { x, y } of spaces1) {
    if(coinC < coinCount) {
      bodies.push(new Item("coin", x * blockSize, y * blockSize));
      coinC++;
    }
  }

  for(let { x, y } of spaces2) {
    if(chestC < chestCount) {
      bodies.push(new Item("chest", x * blockSize, y * blockSize));
      chestC++;
    }
  }
}

function setup(){
  //createCanvas(1200, 600);
  createCanvas(constrain(windowWidth, 600, 1800), constrain(windowHeight, 500, 1000))
  angleMode(RADIANS);
  frameRate(60);
  noStroke();
  rectMode(LEFT, TOP);
  textAlign(LEFT, TOP);
  textFont("Orbitron");

  const canvas = document.querySelector("canvas")
  canvas.oncontextmenu = (e) => {
    e.preventDefault();
    return false;
  };
  
  engine = Engine.create({
    gravity: {
      y: 0,
      x: 0
    },
    enableSleeping: true
  });
  world = engine.world;
  Matter.Runner.run(engine);

  if(window.location !== window.parent.location){
    document.body.innerHTML = `<a target="_blank" rel="noreferrer" href="https://intercepter.ironcladdev.repl.co/"><div id="window-overlay">
      <h1>Please open this in a new window for the best experience.</h1>
      <h2>Click to open</h2>
    </div></a>`
  }
}

function draw() {
  cursor("default");
  background(0);

  switch(scene){
    case "menu": menu(); break;
    case "game": game(); break;
    case "cut": cut(); break;
    case "fail": fail(); break;
    case "succeed": succeed(); break;
    case "win": win(); break;
    case "powerups": powerups(); break;
  }
  
  clicked = false;
  currentKeyReleased = false;
  mir = false;
}

function mouseClicked(){
  clicked = true;
}

function mouseReleased(){
  mir = true;
}

function keyPressed(){
  keys[key.length === 1 ? key.toLowerCase() : key] = true;
}

function keyReleased(){
  keys[key.length === 1 ? key.toLowerCase() : key] = false;
  currentKeyReleased = key;
}

function mousePressed(e){
  mouseButtons[e.which] = true;
}

function mouseReleased(e){
  mouseButtons[e.which] = false;
}

function windowResized() {
  resizeCanvas(constrain(windowWidth, 600, 1800), constrain(windowHeight, 500, 1000));
}