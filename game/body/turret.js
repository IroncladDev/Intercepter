class Turret extends Body {
  constructor(t, x, y) {
    super(Bodies.circle(x, y, blockSize/2, {
      isStatic: true
    }), "turret");

    this.r = 0;
    this.ar = 0;
    this.t = t;
    
    this.health = 500;
    this.maxHealth = 500;
    this.regen = 0.0025;

    this.hbtime = 255;
    this.team = "b"

    this.targetId = "";
    this.targetX = 0;
    this.targetY = 0;

    this.xp = 0;
    this.credits = 0;
    this.tier = 1;

    this.fireRate = 50;
    this.damage = 10;
    this.bulletType = "blue-default";
    this.fireCount = Math.floor((Math.random() * 50))
    this.sound = "gun4.mp3"

    if(this.t === "$") {
      this.fireRate = 10;
      this.damage = 1.5;
      this.bulletType = "blue-default";
      this.sound = "gun3.mp3"
    }
  }

  kill() {
    if(this.dead) return;
    World.remove(world, this.body)
    if(onScreen(this.body.position.x, this.body.position.y)){
      playSound("explosion.mp3", 0.05, true)
      playSound("explosion2.mp3", 0.05, true)
      for(let u = 5; u--;) particles.push(new Particle("explosion", this.body.position.x + random(-30, 30), this.body.position.y + random(-30, 30)))
      shakeX = 10;
      shakeY = 10; 
    }
    this.dead = true;
  }

  draw() {
    let m = blockSize/2;
    push();
    translate(this.body.position.x, this.body.position.y);
    rotate(this.ar);
    image(sprites['turret-' + this.t], blockSize/3, 0, blockSize * 1.5, blockSize);
    rotate(-this.ar)
    stroke(colors.blueHighest + opac(this.hbtime));
    strokeWeight(1);
    noFill();
    quad(-m + 5, -m, -m - 5, -m + 20, -m - 5 + (blockSize), -m + 20, -m + 5 + (blockSize), -m);
    fill(colors.blueHigher + opac(this.hbtime));
    noStroke();
    quad(-m + 5, -m, -m - 5, -m + 20, -m - 5 + (blockSize*(this.health/this.maxHealth)), -m + 20, -m + 5 + (blockSize*(this.health/this.maxHealth)), -m);
    pop();
  }

  run() {
    this.fireCount++;
    this.ar += shortAng(this.ar, this.r) / 10;
    let self = this;
    let { x, y } = this.body.position;
    if(!this.targetId) {
      let tgs = bodies.filter(u => 
        (u.type === 'player' || u.type === 'unit') &&
        (u.team === "r")
      ).sort((a,b) => bodyDist(a, self) - bodyDist(b, self));
      if(tgs.length > 0) {
        this.targetId = tgs[0].id;
      }
    }else {
      let target = bodies[bodies.findIndex(u => u.id === self.targetId)];
      if(target){
        this.r = atan2(target.body.position.y - y, target.body.position.x - x);
        if(this.fireCount % this.fireRate === 0) {
          let b = new Bullet(this.bulletType, x, y, this.ar, {
            speed: 25,
            damage: this.damage,
            team: this.team,
            fromId: this.id
          });
          bullets.push(b)
          if(onScreen(this.body.position.x, this.body.position.y)){
            playSound(this.sound, 0.05, true)
          }
        }
      }else {
        this.targetId = ""
      }
    }

    if(this.health < this.maxHealth) this.health += this.regen;
    if(this.hbtime > 0) {
      this.hbtime -= 5;
    }

    if(this.health <= 0) {
      this.kill();
    }

    bullets.forEach((b, i) => {
      let s = blockSize/2;
      if(dist(b.x, b.y, x, y) <= blockSize/2 && b.stats.team === 'r'){
        self.health -= b.stats.damage;
        self.hbtime = 255;
        this.targetId = b.stats.fromId;
        if(self.health <= 0) self.kill();
        b.kill();
      }
    })
  }
}