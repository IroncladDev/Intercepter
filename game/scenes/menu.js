const startButton = new MenuButton();
const next1 = new MenuButton();
const next2 = new MenuButton();

let intro = 0;

const menu = () => {
  background(colors.bgRoot);

  if(intro === 0){
    textSize(60);
    textAlign(CENTER, TOP);
    stroke(colors.accentDefault);
    strokeWeight(5);
    fill(colors.accentHigher);
    text("Intercepter", width/2, height/2 - 200);
    
    image(sprites.robot, width/2 - 150, height/2 - 150, 300, 300);
  
    
    startButton.config("Start", width/2, height - 50, () => intro++);
    startButton.display();
  }
  if(intro === 1) {
    imageMode(CENTER, CENTER)
    image(sprites["instructions"], width/2, height/2 - 50);
    next1.config("Next", width/2, height - 50, () => intro++);
    next1.display();
  }
  if(intro === 2) {
    let initialX = (width - 600)/2;
    imageMode(CORNER, TOP);

    image(sprites.i0, initialX, 50, 100, 100);
    image(sprites.i1, initialX, 200, 100, 100);
    image(sprites.i2, initialX, 350, 100, 100);
    
    textAlign(LEFT, TOP);
    textSize(25);
    stroke(colors.accentDefault);
    strokeWeight(2);
    fill(colors.accentHigher);
    text("Accomplish Missions", initialX + 120, 50);
    text("Upgrade Arsenal", initialX + 120, 200);
    text("Fight for survival", initialX + 120, 350);

    textSize(15);
    noStroke();
    fill(colors.accentHighest);
    text("Destroy enemy bases, blow things up, and feel free to be a trigger-happy battle commander.  Use your skills to destroy your enemies and finally overwhelm and defeat them.", initialX + 120, 80, 480, 300);
    text("Earn money from kills, from chests, and\nfrom the ground.  With your credits you may purchase new\nweapons, powerups, and more.", initialX + 120, 230, 480, 300);
    text("You only have one shot per mission.\nFight for your life, defend your teammates, and reign victorious.", initialX + 120, 380, 480, 300);
    next2.config("Start", width/2, height - 50, () => scene = "cut");
    next2.display();
  }
}