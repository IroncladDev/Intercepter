let camX = 0;
let camY = 0;
let shakeX = 0;
let shakeY = 0;
let failTimer = 100;
let succeedTimer = 100;
let onScreen = (X, Y) => {
  let { x, y } = player.body.position;
  return (X > x - width*0.75 && X < x + width*0.75 && Y > y - height*0.75 && Y < y + height*0.75)
}

const game = () => {
  clear();
  
  bullets = bullets.filter(x => !x.dead);
  bodies = bodies.filter(x => !!x.body && !x.dead);
  particles = particles.filter(x => !x.dead);
  camX += (-player.body.position.x - camX)/5;
  camY += (-player.body.position.y - camY)/5;

  shakeX += -shakeX/10
  shakeY += -shakeY/10
  
  background(0);
  push();
  translate(camX + width/2, camY + height/2);
  translate(random(-shakeX, shakeX), random(-shakeY, shakeY));
  image(bg, 0, 0, mapWidth, mapHeight);

  particles.filter(x => x.behind).forEach(particle => {
    if(onScreen(particle.x, particle.y)) {
      particle.draw()
    }
    particle.run()
  })
  bullets.forEach(bullet => {
    if(onScreen(bullet.x, bullet.y)) bullet.draw();
    bullet.run();
  })
  bodies.forEach(body => {
    if(!body.invis) body.draw();
    body.run();
  });
  particles.filter(x => !x.behind).forEach(particle => {
    if(onScreen(particle.x, particle.y)) {
      particle.draw()
    }
    particle.run()
  })
  
  pop();

  runGameUI();

  if(player.dead || levels[level].fail()){
    failTimer--;
  }
  if(levels[level].succeed()) {
    succeedTimer--;
  }
  if(failTimer <= 0) {
    scene = "fail";
  }
  if(succeedTimer <= 0) {
    scene = "succeed";
  }
}