const succeed = () => {
  background(colors.bgRoot);
  
  textAlign(CENTER, TOP);
  textSize(40);
  fill(colors.accentHigher);
  strokeWeight(2);
  stroke(colors.accentDefault);
  text("Mission Accomplished!", width/2, 100);
  textSize(20);
  textAlign(LEFT, TOP)
  fill(colors.accentHighest);
  text(`Mission Status: Success
  
Mission code: ${levels[level].name}
Score: ${player.totalXP}
Combat level reached: ${player.tier + 1}

Congrats, commander.  You accomplished the mission.  Are you ready to move on?

Click to proceed
  `, width/2 - 300, 180, 600, 1500);

  if(clicked) {
    if(levels[level+1]){
      level++;
      scene = "cut";
    }else {
      scene = "win";
    }
  }
}