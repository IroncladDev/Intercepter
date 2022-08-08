const startButton = new MenuButton();

const menu = () => {
  background(colors.bgRoot);

  textSize(60);
  textAlign(CENTER, TOP);
  stroke(colors.accentDefault);
  strokeWeight(5);
  fill(colors.accentHigher);
  text("Intercepter", width/2, height/2 - 200);
  
  image(sprites.robot, width/2 - 150, height/2 - 150, 300, 300);

  
  startButton.config("Start", width/2, height/2 + 170, () => scene = "game");
  startButton.display();
}