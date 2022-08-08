class Bullet {
  constructor(type, x, y, r, stats) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.r = r;
    this.stats = {
      speed: stats?.speed || 10,
      damage: stats?.damage || 1,
    }
  }

  draw() {
    fill(255);
    stroke(colors.accentHighest);
    strokeWeight(1);
    push();
    translate(this.x, this.y);
    rotate(this.r);
    rect(0, 0, 50, 3, 5);
    pop();
  }

  run() {
    this.x += cos(this.r) * this.stats.speed;
    this.y += sin(this.r) * this.stats.speed;
  }
}