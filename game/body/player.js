class Player extends Body {
  constructor(body) {
    super(body, "player");
    this.rot = 0;
    this.rotations = [0, 0, 0, 0, 0];
    this.speed = 5;
    this.xVel = 0;
    this.yVel = 0;

    
    this.fireRate = 20;
    this.bulletType = "default";
    this.fireRegen = 5;
    this.damage = 5;
    this.bulletSpeed = 20;
    this.capacity = 50;
  }

  shoot(t, x, y, r, stats){
    if(this.capacity >= this.damage){
      this.capacity -= this.damage;
    }
    this.capacity += this.fireRegen;
    bullets.push(new Bullet(t, x, y, r, stats));
  }
  
  draw() {
    let mx = mouseX, my = mouseY;
    let x = this.body.position.x;
    let y = this.body.position.y;
    this.rot = atan2(my - height/2, mx - width/2);
    this.rotations[0] += shortAng(this.rotations[0], this.rot) / 5;
    this.rotations[1] += shortAng(this.rotations[1], this.rot) / 10;
    this.rotations[2] += shortAng(this.rotations[2], this.rot) / 12.5;
    
    this.rotations[4] += (75-this.rotations[4])/5
    
    let gunX = x + cos(this.rotations[2]) * this.rotations[4];
    let gunY = y + sin(this.rotations[2]) * this.rotations[4];

    let gr = atan2(
      my - (height/2 + (sin(this.rotations[2]) * this.rotations[4])),
      mx - (width/2 + (cos(this.rotations[2]) * this.rotations[4]))
    );
    this.rotations[3] += shortAng(this.rotations[3], gr)/5;

    let l1x = gunX + cos(this.rotations[3] + Math.PI) * 30;
    let l1y = gunY + sin(this.rotations[3] + Math.PI) * 30;

    if(mouseButtons[1]){
      if(frameCount % this.fireRate === 0){
        this.rotations[4] -= constrain(this.damage, 0, 25)
        this.shoot(
          this.bulletType, 
          gunX + cos(this.rotations[3])*50,
          gunY + sin(this.rotations[3])*50,
          this.rotations[3],
          {
            speed: this.bulletSpeed,
            damage: this.damage
          }
        )
      }
    }

    imageMode(CENTER);
    stroke(colors.bgDimmer);
    strokeWeight(15);
    line(gunX, gunY, x + cos(this.rotations[1] - Math.PI / 2) * 50, y + sin(this.rotations[1] - Math.PI / 2) * 50);
    line(l1x, l1y, x + cos(this.rotations[1] + Math.PI / 2) * 50, y + sin(this.rotations[1] + Math.PI / 2) * 50);

    push();
    translate(gunX, gunY);
    rotate(this.rotations[3]);
    image(sprites['gun-rifle-1'], 10, 0, 100, 20);
    pop();

    push();
    translate(x, y);
    rotate(this.rotations[2]);
    image(sprites['player-pack'], -20, 0, 75 * 1.5, 75);
    rotate(-this.rotations[2]);

    rotate(this.rotations[1]);
    image(sprites['player-body'], 0, 0, 75, 150);
    rotate(-this.rotations[1]);

    rotate(this.rotations[0]);
    image(sprites['player-head'], 0, 0, 75, 75);
    pop();

  }

  run() {

    if (keys['a']) {
      bd.applyForce(this.body, this.body.position, { x: -0.01, y: 0 })
      this.xVel += (-this.speed - this.xVel)/5
    }
    if (keys['d']) {
      bd.applyForce(this.body, this.body.position, { x: -0.01, y: 0 })
      this.xVel += (this.speed - this.xVel)/5
    }
    if(!keys['a'] && !keys['d']) this.xVel += -this.xVel/5


    if (keys['w']) {
      bd.applyForce(this.body, this.body.position, { x: 0, y: -0.01 })
      this.yVel += (-this.speed - this.yVel)/5
    }
    if (keys['s']) {
      bd.applyForce(this.body, this.body.position, { x: 0, y: 0.01 })
      this.yVel += (this.speed - this.yVel)/5
    }
    if(!keys['w'] && !keys['s']) this.yVel += -this.yVel/5

    if(mouseButtons[3]){
      let r = atan2(mouseY - height/2, mouseX - width/2);
      bd.applyForce(this.body, this.body.position, {
        x: constrain(cos(r) * this.speed, -0.01, 0.01),
        y: constrain(sin(r) * this.speed, -0.01, 0.01)
      })
      this.xVel += ((cos(r) * this.speed) - this.xVel);
      this.yVel += ((sin(r) * this.speed) - this.yVel);
      
    }

    bd.setVelocity(this.body, {
      x: Math.round(this.xVel),
      y: Math.round(this.yVel)
    });
  }
}