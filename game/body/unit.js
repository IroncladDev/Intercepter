let finder = new PF.AStarFinder({
  allowDiagonal: false
});
class Unit extends Body {
  constructor(body, type, team) {
    super(body, type || "unit");
    this.rot = 0;
    this.rotations = [0, 0, 0, 0, 0, 0];
    this.tier = 0;
    this.speed = tiers[this.tier].speed;
    this.xVel = 0;
    this.yVel = 0;

    this.health = tiers[this.tier].health;
    this.maxHealth = tiers[this.tier].health;
    this.healthRegen = tiers[this.tier].healthRegen;

    this.weapon = "phaser"

    this.capacity = guns[this.weapon].capacity;
    this.maxCapacity = guns[this.weapon].capacity;

    this.credits = 0;
    this.xp = 0;
    this.tierXP = tiers[this.tier].tierXP;
    this.team = team || "r";

    this.fireCount = Math.floor(Math.random() * 100);

    this.wl = 50;
    this.freeze = 0;

    this.targetId = "";
    this.targetX = 0;
    this.targetY = 0;
    this.movX = 0;
    this.movY = 0;
    this.Map = new PF.Grid(levels[level].m.map(r => r.split``.map(u => u === ' ' ? 0 : 1)));
    this.path = [];
    this.pathIndex = 0;
  }

  shoot(t, x, y, r, stats) {
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
    let {
      damage,
      bulletType,
      bullets: numBullets,
      accuracy,
      sound
    } = guns[this.weapon];
    if (this.capacity >= damage * numBullets) {
      if(this.type === 'player'){
        if(onScreen(this.body.position.x, this.body.position.y)){
          playSound(sound, 0.15, true);
        }
      }
      for (var i = numBullets; i--;) {
        let ar = (accuracy / (Math.PI * 180));
        let b = new Bullet(
          bulletType, x, y,
          r + ((Math.random() * ar) * 2) - ar,
          stats);
        bullets.push(b);
      }
      this.rotations[4] -= constrain(damage, 0, 25)
      this.capacity -= damage * numBullets;
    }
  }

  kill() {
    if(this.dead) return;
    World.remove(world, this.body);
    let vl = 0;
    while(vl < this.credits) {
      let cvl = Math.floor(Math.random() * 5);
      bodies.push(new Item("coin", this.body.position.x + random(-1, 1), this.body.position.y + random(-1, 1), cvl));
      vl += cvl;
    }
    if(onScreen(this.body.position.x, this.body.position.y)) {
      playSound("explosion.mp3", 0.075, true)
      playSound("explosion2.mp3", 0.075, true)
      shakeX = 10;
      shakeY = 10;
      for(var n = 50; n--;) particles.push(new Particle("blood", this.body.position.x + random(-20, 20), this.body.position.y + random(-20, 20), Math.random() * Math.PI*2))
      for(var n = 5; n--;) particles.push(new Particle("explosion", this.body.position.x + random(-20, 20), this.body.position.y + random(-20, 20)))
    }
    
    this.dead = true;
  }

  setWeapon(wp) {
    this.weapon = wp;
    this.capacity = guns[this.weapon].capacity;
    this.maxCapacity = guns[this.weapon].capacity;
    this.credits -= guns[this.weapon].cost;
  }

  draw() {
    let mx = this.targetX, my = this.targetY;
    let x = this.body.position.x;
    let y = this.body.position.y;
    this.rot = atan2(my - this.body.position.y, mx - this.body.position.x);
    this.rotations[0] += shortAng(this.rotations[0], this.rot) / 5;
    this.rotations[1] += shortAng(this.rotations[1], this.rot) / 10;
    this.rotations[2] += shortAng(this.rotations[2], this.rot) / 12.5;

    this.rotations[4] += (75 - this.rotations[4]) / 5

    let gunX = x + cos(this.rotations[2]) * this.rotations[4];
    let gunY = y + sin(this.rotations[2]) * this.rotations[4];

    let gr = this.rotations[2]
    this.rotations[3] += shortAng(this.rotations[3], gr) / 5;

    let l1x = gunX + cos(this.rotations[3] + Math.PI) * 30;
    let l1y = gunY + sin(this.rotations[3] + Math.PI) * 30;

    if(this.targetId) {
      if (this.fireCount % guns[this.weapon].fireRate === 0) {
        this.shoot(
          guns[this.weapon].bulletType,
          gunX + cos(this.rotations[3]) * (this.wl),
          gunY + sin(this.rotations[3]) * (this.wl),
          gr,
          {
            speed: guns[this.weapon].speed,
            damage: guns[this.weapon].damage,
            team: this.team,
            fromId: this.id
          }
        )
      }
    }

    imageMode(CENTER);
    stroke(colors.bgDimmer);
    strokeWeight(15);
    line(gunX, gunY, x + cos(this.rotations[1] - Math.PI / 2) * 50, y + sin(this.rotations[1] - Math.PI / 2) * 50);
    line(l1x, l1y, x + cos(this.rotations[1] + Math.PI / 2) * 50, y + sin(this.rotations[1] + Math.PI / 2) * 50);

    stroke(colors.bgDefault);
    strokeWeight(7.5);
    line(gunX, gunY, x + cos(this.rotations[1] - Math.PI / 2) * 50, y + sin(this.rotations[1] - Math.PI / 2) * 50);
    line(l1x, l1y, x + cos(this.rotations[1] + Math.PI / 2) * 50, y + sin(this.rotations[1] + Math.PI / 2) * 50);

    push();
    translate(gunX, gunY);
    rotate(this.rotations[3]);
    image(sprites['gun-' + this.weapon], 20, 0, 192, 48);
    pop();

    push();
    translate(x, y);
    rotate(this.rotations[2]);
    image(sprites[this.team + '-tier-' + this.tier + "-pack"], -20, 0, 75, 75 * 0.75);
    rotate(-this.rotations[2]);

    rotate(this.rotations[1]);
    image(sprites[this.team + '-tier-' + this.tier + "-body"], 0, 0, 75, 150);
    rotate(-this.rotations[1]);

    rotate(this.rotations[0]);
    image(sprites[this.team + '-tier-' + this.tier + "-head"], 0, 0, 75, 75);
    pop();

    noFill();
    strokeCap(SQUARE);
    strokeWeight(5);
    stroke((this.team === "b" ? colors.blueHigher : colors.accentHigher) + opac(50))
    arc(this.body.position.x, this.body.position.y, 100, 100, Math.PI, Math.PI * 2)
    stroke((this.team === "b" ? colors.blueHigher : colors.accentHigher) + opac(150))
    arc(this.body.position.x, this.body.position.y, 100, 100, Math.PI, Math.PI + (this.health/this.maxHealth) * Math.PI)
  }
  run() {
    if(this.freeze > 0) {
      this.freeze--;
      bd.setVelocity(this.body, {
        x: 0,
        y: 0
      });
    }
    if(this.freeze <= 0){
      this.fireCount++;
      if (this.xp >= this.tierXP) {
        if (this.tier === tiers.length - 1) {
          this.credits += 100;
          this.xp -= this.tierXP;
        } else {
          particles.push(new Particle("fade", this.body.position.x, this.body.position.y, 0, {text: "Level Up", color: [255,255,255]}));
          this.tier++;
          this.xp = 0;
          this.speed = tiers[this.tier].speed;
          this.health = tiers[this.tier].health;
          this.maxHealth = tiers[this.tier].health;
          this.healthRegen = tiers[this.tier].healthRegen;
          this.capacity = guns[this.weapon].capacity;
          this.maxCapacity = guns[this.weapon].capacity;
          this.tierXP = tiers[this.tier].tierXP;
        }
      }
  
      if (this.capacity < this.maxCapacity) this.capacity += guns[this.weapon].regen;
    }

    if(this.health < this.maxHealth) this.health += this.healthRegen;

    for(let i = bullets.length; i--;) {
      let b = bullets[i];
      if(dist(this.body.position.x, this.body.position.y, b.x, b.y) <= 37.5 && b.stats.team !== this.team && !b.dead && !this.dead) {
        this.health -= b.stats.damage;
        bd.applyForce(this.body, {
            x: b.x,
            y: b.y
          }, {
            x: (cos(b.r) * b.stats.damage)/100,
            y: (sin(b.r) * b.stats.damage)/100
          })
        //if(!this.targetId) {
          this.targetId = b.stats.fromId;
        //}
        if(this.health <= 0) {
          let u = bodies.findIndex(x => x.id === b.stats.fromId);
          if(bodies[u] && bodies[u].xp) bodies[u].xp += ((this.tier+1) * 100) + this.xp;
          this.kill()
        }
        b.kill();
      }
    }

    if(this.health <= 0) {
      this.kill();
    }

    if(this.freeze <= 0){
      this.runAI();
  
      this.updateVelocity();
    }
  }
  
  move(r) {
    bd.applyForce(this.body, this.body.position, {
      x: constrain(cos(r) * this.speed, -0.001, 0.001),
      y: constrain(sin(r) * this.speed, -0.001, 0.001)
    })
    this.xVel += ((cos(r) * this.speed) - this.xVel);
    this.yVel += ((sin(r) * this.speed) - this.yVel);
  }
  updateVelocity() {
    bd.setVelocity(this.body, {
      x: Math.round(this.xVel),
      y: Math.round(this.yVel)
    });
  }
  createPath(x, y, x2, y2) {
    try{
      return finder.findPath(x, y, x2, y2, new PF.Grid(levels[level].m.map(r => r.split``.map(u => u !== '0' ? 0 : 1))));
    }catch(e){
      return []
    }
  }
          
  runAI() {
    if(this.freeze > 0) return;
    let { x, y } = this.body.position;
    
    let hasTarget = !!this.targetId;
    let self = this;
    let unitsInRange = bodies.filter(u => (u.type === 'unit'||u.type === 'player'||u.type === 'base'||u.type === "turret"||u.type === 'chest') && u.team !== this.team && bodyDist(self, u) <= 600 && u.id !== self.id).sort((a,b) => bodyDist(self, a) - bodyDist(self, b));

    if(unitsInRange.length > 0 && !hasTarget) {
      this.targetId = unitsInRange[0].id;
      hasTarget = !!this.targetId;
    }

                                                                                                                                                                                   
    
    if(hasTarget) {
      let target = bodies[bodies.findIndex(x => x.id === this.targetId)];
      if(!target) this.targetId = "";
      else{
        this.targetX = target.body.position.x;
        this.targetY = target.body.position.y;
        let cx = target.body.position.x;
        let cy = target.body.position.y;
        let posX = Math.floor(cx/blockSize);
        let posY = Math.floor(cy/blockSize);
        let p = this.createPath(Math.floor(x/blockSize), Math.floor(y/blockSize), posX, posY);
        this.path = p;
      }
    }else {
      let closestCoin = bodies.filter(x => x.type === 'coin' && x.body).sort((a,b) => bodyDist(self, a) - bodyDist(self, b))[0];
      if(closestCoin) {
        let cx = closestCoin.body.position.x;
        let cy = closestCoin.body.position.y;
        let posX = Math.floor(cx/blockSize);
        let posY = Math.floor(cy/blockSize);
        let p = this.createPath(Math.floor(x/blockSize), Math.floor(y/blockSize), posX, posY);
        this.path = p;
      }
    }

    

    if(this.path.length > 0){
        try{
          this.movX = this.path[this.pathIndex][0] * blockSize + blockSize/2;
          this.movY = this.path[this.pathIndex][1] * blockSize + blockSize/2;
        }catch(e){}
        if(!hasTarget){
          this.move(atan2(this.movY - y, this.movX - x));
        }else {
          if(hasTarget && dist(x, y, this.targetX, this.targetY) > 200) {
            this.move(atan2(this.movY - y, this.movX - x));
          }else {
            this.xVel = 0;
            this.yVel = 0;
            this.updateVelocity();
          }
        }
        if(dist(x, y, this.movX, this.movY) <= 20) {
          this.pathIndex++;
          if(this.pathIndex >= this.path.length) {
            this.pathIndex = 0;
            this.path = [];
          }
        }
      }

    let upgs = guns[this.weapon].upg.map(f => guns[f]);
    if(upgs.every(u => self.credits > u.cost)) {
      let ind = Math.floor(Math.random() * guns[this.weapon].upg.length);
      this.weapon = guns[this.weapon].upg[ind];
      this.credits -= guns[guns[this.weapon].upg[ind]].cost
    }
  }
}