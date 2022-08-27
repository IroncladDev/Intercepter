class Player extends Unit {
  constructor(body) {
    super(body, "player", 'r');
    this.credits = 500;
    this.powerups = {
      "grenades": 0,
      "forcefields": 0,
      "mines": 0,
      "freezerays": 0,
      "healthpacks": 0,
      "nukes": 0
    };
    this.selectedPowerup = null;
    this.sheild = 0;
    this.totalXP = 0;
  }

  draw() {
    push();
    translate(this.body.position.x, this.body.position.y);
    fill(255, 0, 0)
    ellipse(0, 0, 10, 10)
    translate(
      -this.body.position.x,
      -this.body.position.y
    );

    let mx = mouseX, my = mouseY;
    let x = this.body.position.x;
    let y = this.body.position.y;
    this.rot = atan2(my - height / 2, mx - width / 2);
    this.rotations[0] += shortAng(this.rotations[0], this.rot) / 5;
    this.rotations[1] += shortAng(this.rotations[1], this.rot) / 10;
    this.rotations[2] += shortAng(this.rotations[2], this.rot) / 12.5;

    this.rotations[4] += (75 - this.rotations[4]) / 5

    let gunX = x + cos(this.rotations[2]) * this.rotations[4];
    let gunY = y + sin(this.rotations[2]) * this.rotations[4];

    let gr = atan2(
      my - (height / 2 + (sin(this.rotations[2]) * this.rotations[4])),
      mx - (width / 2 + (cos(this.rotations[2]) * this.rotations[4]))
    );
    this.rotations[3] += shortAng(this.rotations[3], gr) / 5;

    let l1x = gunX + cos(this.rotations[3] + Math.PI) * 30;
    let l1y = gunY + sin(this.rotations[3] + Math.PI) * 30;

    if (mouseButtons[1]) {
      if (this.fireCount % guns[this.weapon].fireRate === 0) {
        this.shoot(
          guns[this.weapon].bulletType,
          gunX + cos(this.rotations[3]) * (this.wl),
          gunY + sin(this.rotations[3]) * (this.wl),
          this.rotations[3],
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
    pop();

    if(this.shield > 0){
      fill(colors.accentHigher + opac(50));
      stroke(colors.accentHigher + opac(100));
      strokeWeight(3);
      ellipse(this.body.position.x, this.body.position.y, 150, 150);
      noFill();
      strokeWeight(5);
      strokeCap(SQUARE);
      arc(this.body.position.x, this.body.position.y, 150, 150, 0, this.shield/this.maxHealth * (Math.PI * 2));
    }
  }

  run() {
    this.fireCount++;
    if (this.xp >= this.tierXP) {//Work here
      if (this.tier === tiers.length - 1) {
        this.credits += 100;
        this.xp -= this.tierXP;
      } else {
        particles.push(new Particle("fade", this.body.position.x, this.body.position.y, 0, {text: "Level Up", color: [255,255,255]}));
        this.tier++;
        this.totalXP += this.xp;
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
    if(this.health < this.maxHealth) this.health += this.healthRegen;

    if (keys['a']) {
      bd.applyForce(this.body, this.body.position, { x: -0.01, y: 0 })
      this.xVel += (-this.speed - this.xVel) / 5
    }
    if (keys['d']) {
      bd.applyForce(this.body, this.body.position, { x: -0.01, y: 0 })
      this.xVel += (this.speed - this.xVel) / 5
    }
    if (!keys['a'] && !keys['d']) this.xVel += -this.xVel / 5


    if (keys['w']) {
      bd.applyForce(this.body, this.body.position, { x: 0, y: -0.01 })
      this.yVel += (-this.speed - this.yVel) / 5
    }
    if (keys['s']) {
      bd.applyForce(this.body, this.body.position, { x: 0, y: 0.01 })
      this.yVel += (this.speed - this.yVel) / 5
    }
    if (!keys['w'] && !keys['s']) this.yVel += -this.yVel / 5

    if (mouseButtons[3]) {
      let r = atan2(mouseY - height / 2, mouseX - width / 2);
      this.move(r);
    }

    this.updateVelocity();

    for(let i = bullets.length; i--;) {
      let b = bullets[i];
      if(dist(this.body.position.x, this.body.position.y, b.x, b.y) <= 37.5 && b.stats.team !== this.team) {
        if(this.shield > 0) {
          this.shield -= b.stats.damage;
        }else {
          this.health -= b.stats.damage;
          playSound("hurt.mp3", 0.05, true)
          for(var n = b.stats.damage*2; n--;) particles.push(new Particle("blood", b.x, b.y, b.r))
          bd.applyForce(this.body, {
            x: b.x,
            y: b.y
          }, {
            x: (cos(b.r) * b.stats.damage)/100,
            y: (sin(b.r) * b.stats.damage)/100
          })
        }
        if(this.health <= 0) {
          let u = bodies.findIndex(x => x.id === b.stats.fromId);
          bodies[u].xp += ((this.tier+1)/(bodies[u].tier+1)) * 500;
          this.kill();
        }
        b.kill();
      }
    }

    this.runPowerups();
  }

  runPowerups() {
    let ps = Object.entries(this.powerups).filter(([key, value]) => value > 0);
    if(ps.length <= 0) this.selectedPowerup = null;

    //messy code moment
    if(keys["1"] && ps.length >= 1) this.selectedPowerup = ps[0][0];
    if(keys["2"] && ps.length >= 2) this.selectedPowerup = ps[1][0];
    if(keys["3"] && ps.length >= 3) this.selectedPowerup = ps[2][0];
    if(keys["4"] && ps.length >= 4) this.selectedPowerup = ps[3][0];
    if(keys["5"] && ps.length >= 5) this.selectedPowerup = ps[4][0];
    if(keys["6"] && ps.length >= 6) this.selectedPowerup = ps[5][0];
    
    if(keys["f"]) {
      if(this.selectedPowerup && this.powerups[this.selectedPowerup] > 0) {
        switch(this.selectedPowerup){
          case "grenades":
            bullets.push(new Bullet(
              "grenade", this.body.position.x, this.body.position.y, this.rotations[0],
              {
                speed: 10,
                damage: 30,
                fromId: this.id
              }
            ))
          break;
          case "forcefields":
            this.shield = this.maxHealth;
          break;
          case "mines":
            particles.push(new Particle("mine", this.body.position.x, this.body.position.y))
          break;
          case "freezerays":
            particles.push(new Particle("freezeray", this.body.position.x, this.body.position.y))
          break;
          case "healthpacks":
            this.health = this.maxHealth;
            particles.push(new Particle("fade", this.body.position.x, this.body.position.y, 0, {text: "Health Restored", color: [255,255,255]}));
          break;
          case "nukes":
            bullets.push(new Bullet(
              "nuke", this.body.position.x, this.body.position.y, this.rotations[0],
              {
                speed: 15,
                damage: 500,
                fromId: this.id
              }
            ))
          break;
        }
        this.powerups[this.selectedPowerup] -= 1;
      }else{
        if(ps.length > 0) {
          this.selectedPowerup = ps[0][0];
        }else {
          this.selectedPowerup = null;
        }
      }
      keys['f'] = false;
    }
  }
}