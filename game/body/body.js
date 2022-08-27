class Body {
  constructor(body, type) {
    this.body = body;
    this.type = type || "body";
    this.dead = false;
    this.invis = false;
    this.id = Math.random().toString(36).slice(2);
    
    // Add the body to the world
    World.add(world, this.body);
  }

  kill() {
    World.remove(world, this.body);
    this.dead = true;
  }
  
  draw() {
    // Draw the body by its vertices
    fill(100);
    let pos = this.body.position;
    let angle = this.body.angle;
    beginShape();
    for (var i = 0; i < this.body.vertices.length; i++) {
      vertex(this.body.vertices[i].x, this.body.vertices[i].y);
    }
    endShape();
  }

  run() { }
}