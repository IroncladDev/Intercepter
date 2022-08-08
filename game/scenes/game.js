let camX = 0;
let camY = 0;
const game = () => {
  camX += (-player.body.position.x - camX)/5;
  camY += (-player.body.position.y - camY)/5;
  background(200);
  push();
  translate(camX + width/2, camY + height/2)
  stroke(200);
  for(var i = 0; i < 20; i++){
    for(var j = 0; j < 20; j++){
      rect(i*100, j*100, 100, 100);
    }
  }

  bullets.forEach(bullet => {
    bullet.draw();
    bullet.run();
  })
  bodies.forEach(body => {
    body.draw();
    body.run();
  });
  pop();
}