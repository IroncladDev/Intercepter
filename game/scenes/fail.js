const fail = () => {
  background(colors.bgRoot);
  
  textAlign(CENTER, TOP);
  textSize(40);
  fill(colors.accentHigher);
  strokeWeight(2);
  stroke(colors.accentDefault);
  text("Mission Failed", width/2, 100);
  textSize(20);
  textAlign(LEFT, TOP)
  fill(colors.accentHighest);
  text(`Mission status: Failed.
  
Mission code: ${levels[level].name}
Score: ${player.xp}
Combat level reached: ${player.tier + 1}

You screwed up big time, commander.  You had to die when we needed you most.  However, we're going to give you a second chance.  Will you take it?

Click to retry
  `, width/2 - 300, 180, 600, 1500);

  if(clicked) {
    scene = "cut";
  }
}