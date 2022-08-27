class Particle {
  constructor(type, x, y, r, stats) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.r = r + ((Math.random() * Math.PI/2) - Math.PI/4);
    this.time = Math.random() * 10;
    this.s = Math.random() * 15;
    this.stats = stats;
    this.dead = false;
    this.behind = true;

    if(this.type === "blood") this.time = 5 + Math.random() * 10;
    if(this.type === "explosion" || this.type === "explosion2" || this.type === "explosion3" || this.type === "freezeray") {
      this.time = 0;
      this.s = Math.random() * 20;
      this.op = 100;
      this.fscale = 200 + Math.random() * 500;
      this.rc = Math.random() * (255-175);
    }
    if(this.type === 'freezeray') {
      this.fscale = 800;
    }
    if(this.type === "fade") {
      this.op = 255;
      this.s = stats.s||20;
      this.behind = false;
    }
    if(this.type === 'mine'){
      this.time = 2500;
    }
  } 
  draw() {
    if(this.type === "spark") {
      stroke(255, 200, 0);
      fill(255);
      strokeWeight(1);
      push();
      translate(this.x, this.y);
      rotate(this.r);
      rect(0, 0, this.time, 3);
      pop();
    }
    if(this.type === 'blood') {
      noStroke();
      fill(200 - this.time/10, 0, 0, this.time/10 * 255);
      ellipse(this.x, this.y, this.s, this.s);
    }
    if(this.type === "explosion" || this.type === "explosion2" || this.type === "explosion3") {
      noStroke();
      fill(255, 175 + this.rc, 0, this.op);
      ellipse(this.x, this.y, this.s, this.s);
    }
    if(this.type === "freezeray") {
      stroke(0, 175 + this.rc, 255, this.op*2);
      fill(0, 175 + this.rc, 255, this.op);
      ellipse(this.x, this.y, this.s, this.s);
    }
    if(this.type === "fade") {
      fill(...this.stats.color, this.op);
      noStroke();
      textAlign(CENTER, CENTER);
      textSize(this.s);
      text(this.stats.text, this.x, this.y);
    }
    if(this.type === 'mine') {
      image(sprites.mines, this.x - 25, this.y - 25, 50, 50);
    }
  }
  run() {
    if(this.type === "spark") {
      this.x += cos(this.r) * this.time;
      this.y += sin(this.r) * this.time;
      this.time--;
      if(this.time <= 0) this.dead = true;
    }
    if(this.type === "blood") {
      if(this.time > 5) this.time -= 0.5;
      else this.time -= 0.025;
      //if(this.s > 10) this.s -= 0.5;
      if(this.time > 5){
        this.x += cos(this.r + 180) * this.time;
        this.y += sin(this.r + 180) * this.time;
      }
      if(this.time <= 0 || this.s <= 1) this.dead = true;
    }
    if(this.type === 'explosion') {
      this.s += (this.fscale - this.s)/20;
      this.op += -this.op/20;
      if(this.op <= 0.1) this.dead = true;
    }
    if(this.type === 'explosion2') {
      this.s += (this.fscale - this.s)/20;
      this.op += -this.op/20;
      if(this.op <= 0.1) this.dead = true;
      for(let u of bodies) {
        if(
          u.team == 'b' && 
          u.type === 'unit' &&
          dist(this.x, this.y, u.body.position.x, u.body.position.y) <= this.s/2
        ) {
          u.health -= this.op/250;
        }
      }
    }
    if(this.type === 'explosion3') {
      this.s += (this.fscale - this.s)/20;
      this.op += -this.op/20;
      if(this.op <= 0.1) this.dead = true;
      for(let u of bodies) {
        if(
          u.type === 'unit' &&
          dist(this.x, this.y, u.body.position.x, u.body.position.y) <= this.s/2
        ) {
          let rt = Math.PI + atan2(this.y - u.body.position.y, this.x - u.body.position.x);
          if(u.team === 'b') u.health -= this.op/100;
          bd.applyForce(u.body, {
            x: this.x, y: this.y
          }, {
            x: cos(rt)/5,
            y: sin(rt)/5
          })
        }
      }
    }
    if(this.type === 'freezeray') {
      this.s += (this.fscale - this.s)/20;
      this.op += -this.op/20;
      if(this.op <= 0.1) this.dead = true;
      for(let u of bodies) {
        if(
          u.type === 'unit' &&
          dist(this.x, this.y, u.body.position.x, u.body.position.y) <= this.s/2
        ) {
          if(u.team === 'b') u.freeze = 200;
        }
      }
    }
    if(this.type === "fade") {
      this.op -= 5;
      this.s++;
      if(this.op <= 1) this.dead = true;
    }
    if(this.type === 'mine'){
      this.time--;
      for(let u of bodies) {
        if(
          u.type === 'unit' &&
          u.team === 'b' && 
          dist(this.x, this.y, u.body.position.x, u.body.position.y) <= 100
        ) {
          u.health -= 50;
          playSound("explosion.mp3", 0.075, true)
      playSound("explosion2.mp3", 0.075, true)
          for(let i = 5; i--;) particles.push(new Particle("explosion2", this.x + random(-10, 10), this.y + random(-10, 10), this.r));
          this.dead = true;
        }
      }

      if(this.time <= 0){
        playSound("explosion.mp3", 0.075, true)
        playSound("explosion2.mp3", 0.075, true)
        for(let i = 5; i--;) particles.push(new Particle("explosion2", this.x + random(-10, 10), this.y + random(-10, 10), this.r));
        this.dead = true;
      }
    }
  }
}