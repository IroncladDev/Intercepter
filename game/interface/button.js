class MenuButton {
  constructor() {
    this.txt = "";
    this.x = 0;
    this.y = 0;
    this.callback = () => {};
    this.transition = 0;
    this.configed = false;
  }

  config(text, x, y, callback){
    if(this.configed) return;
    this.txt = text;
    this.x = x;
    this.y = y;
    this.callback = callback;
    this.configed = true;
    this.playedHoversound = false;
  }

  display(){
    fill(0,0,0,0);
    stroke(colors.accentDefault);
    strokeWeight(3);
    fill(colors.accentDimmer + opac(this.transition))
    rect(this.x - 75,this.y - 25, 150, 50, 5);
  
    textAlign(CENTER,CENTER);
    textSize(25);
    noStroke();
    fill(colors.accentHigher);
    text(this.txt, this.x, this.y);
    if(mouseX > this.x - 75 && mouseY > this.y - 25 && mouseX < this.x + 75 && mouseY < this.y + 25){
      if(!this.playedHoversound) {
        playSound("hover.wav");
        this.playedHoversound = true;
      }
      cursor("pointer");
      if(this.transition < 255) this.transition += 255/10;
      if(clicked) {
        playSound("click.wav")
        this.callback();
      }
    }else{
      this.playedHoversound = false;
      if(this.transition > 0) this.transition -= 255/10;
    }
  }
}