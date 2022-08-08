
    
function setup(){
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  frameRate(60);
  noStroke();
  smooth();
  pixelDensity(2);
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

  player = new Player(Bodies.circle(width/2, height/2, 30));
  bodies.push(player);
}


function draw() {
  cursor("default");
  background(0);

  switch(scene){
    case "menu": menu(); break;
    case "game": game(); break;
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