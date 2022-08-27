class Block extends Body {
  constructor(code, x, y, r, sides){
    super(Bodies.rectangle(x + blockSize/2, y + blockSize/2, blockSize, blockSize, { isStatic: true, chamfer: 5 }), "block");
    this.code = code;
    this.r = r;
    this.sides = sides;
  }

  draw() {
    imageMode(CENTER);
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.r)
    image(sprites['block-' + this.code], 0, 0, 100, 100);
    pop();
    noStroke();
  }

  run() {
    let self = this;
    bullets.forEach((b, i) => {
      let { x, y } = self.body.position;
      let s = blockSize/2;
      if(b.x > x - s && b.y > y - s && b.x < x + s && b.y < y + s){
        if(onScreen(b.x, b.y)){
          playSound("bullet-impact.mp3", 0.05, true)
        }
        b.kill();
      }
    })
  }
}