const win = () => {
  background(colors.bgRoot);
  
  textAlign(CENTER, TOP);
  textSize(40);
  fill(colors.accentHigher);
  strokeWeight(2);
  stroke(colors.accentDefault);
  text("You Won!", width/2, 100);
  textSize(20);
  textAlign(LEFT, TOP)
  fill(colors.accentHighest);
  text(`Amazing job, commander, you've won the game!
  
If you want to see more content like this, don't forget to follow IroncladDev on Replit!

Click to restart.`, width/2 - 300, 180, 600, 1500);

  if(clicked) {
    window.open("https://replit.com/@IroncladDev");
    location.reload();
  }
}