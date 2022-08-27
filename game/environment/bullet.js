class Bullet {
  constructor(type, x, y, r, stats) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.r = r;
    this.time = 0;
    this.dead = false;
    this.l = 50;
    this.stats = {
      speed: stats?.speed || 10,
      damage: stats?.damage || 1,
      team: stats?.team || "r",
      fromId: stats?.fromId || ""
    }
    this.normal = true;
    if(this.type === 'blue-default') this.l = 75;
    if(this.type === 'smol') this.l = 15;
  }

  preDie() {
    for(let i = 10; i--;) particles.push(new Particle("spark", this.x, this.y, this.r + Math.PI));

    if(this.type === "grenade") {
      playSound("explosion.mp3", 0.075, true)
      playSound("explosion2.mp3", 0.075, true)
      shakeX = 20;
      shakeY = 20;
      for(let i = 10; i--;) particles.push(new Particle("explosion2", this.x + random(-10, 10), this.y + random(-10, 10), this.r));
    }
    if(this.type === "nuke") {
      playSound("explosion.mp3", 0.1, true)
      playSound("explosion2.mp3", 0.1, true)
      shakeX = 50;
      shakeY = 50;
      for(let i = 20; i--;) particles.push(new Particle("explosion3", this.x + random(-100, 100), this.y + random(-100, 100), this.r));
    }
  }

  kill() {
    this.preDie();
    this.dead = true;
  }

  draw() {
    stroke(255);
    strokeWeight(1);
    if(this.type === "default"){
      fill(colors.accentHighest);
      push();
      translate(this.x, this.y);
      rotate(this.r);
      rect(0, 0, 50, 3, 5);
      pop();
    }
    if(this.type === "blue-default"){
      fill(colors.blueHighest);
      push();
      translate(this.x, this.y);
      rotate(this.r);
      rect(0, 0, 75, 5, 5);
      pop();
    }
    if(this.type === "smol"){
      fill(colors.accentHighest);
      push();
      translate(this.x, this.y);
      rotate(this.r);
      rect(0, 0, 15, 3, 5);
      pop();
    }
    if(this.type === "grenade") {
      push();
      translate(this.x, this.y);
      rotate(frameCount / 25);
      image(sprites['grenades'], -25, -25, 50, 50);
      pop();
    }
    if(this.type === "nuke") {
      push();
      translate(this.x, this.y);
      rotate(this.r + Math.PI/2);
      image(sprites['nukes'], -50, -50, 100, 100);
      pop();
    }
  }

  run() {
    if(this.normal){
      this.time++;
      this.x += cos(this.r) * this.stats.speed;
      this.y += sin(this.r) * this.stats.speed;

      if(this.type === "grenade" || this.type === 'nuke') this.stats.speed -= 0.1;
  
      if(this.time > 100) this.kill();
    }else {
      
    }
  }
}