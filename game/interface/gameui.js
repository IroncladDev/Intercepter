const polygon = (...arguments) => {
  beginShape();
  for(var i = 0; i < arguments.length; i+=2){
    vertex(arguments[i], arguments[i+1])
  } 
  endShape(CLOSE);
}
const polyline = (...arguments) => {
  beginShape();
  for(var i = 0; i < arguments.length; i+=2){
    vertex(arguments[i], arguments[i+1])
  } 
  endShape();
}


let hp = 0;
let xp = 0;

const runGameUI = () => {
  cursor("none")
  strokeWeight(1);
  stroke(colors.accentHigher)
  fill(colors.accentDefault + opac(50));
  rect(width - 170, 180, 150, 30);
  rect(width - 170, 220, 150, 30);
  rect(width - 170, 260, 150, 30);
  rect(width - 170, height - 220, 150, 200)
  fill(colors.accentHigher);
  textAlign(LEFT, TOP);
  textSize(15);
  text("Credits: " + player.credits, width - 165, 187.5);
  text("Allies: " + 0, width - 165, 187.5 + 40);
  text("Enemies: " + 0, width - 165, 187.5 + 80);

  //Gun menu
  let __w = guns[player.weapon];
  if(__w.upg) {
    if(Array.isArray(__w.upg)) {
      for(let g = 0; g < __w.upg.length; g++) {
        let xdf = 220 + g * 220;
        let U = guns[__w.upg[g]];
        fill(player.credits >= U.cost ? colors.accentHighest + opac(100) : colors.accentDefault + opac(100));
        noStroke();
        if(mouseX > 20 + xdf && mouseX < 20 + xdf + 200 && mouseY > 20 && mouseY < 95) {
          if(player.credits >= U.cost) fill(colors.accentHighest + opac(150));
          if(clicked && player.credits >= guns[__w.upg[g]].cost) {
            player.setWeapon(__w.upg[g])
          }
        }
        rect(20 + xdf, 20, 200, 75);
        image(sprites['gun-' + __w.upg[g]], 20 + xdf, 20, 200, 200/4);
        textAlign(LEFT, TOP);
        textSize(15);
        fill(player.credits >= U.cost ? colors.accentHigher : colors.accentDefault)
        text(__w.upg[g][0].toUpperCase() + __w.upg[g].slice(1) + " - " + "$" + U.cost, 30 + xdf, 70);
      }
    }
  }

  let stx = width - 170;
  let sty = height - 220;
  hp += (player.health/player.maxHealth - hp)/10;
  xp += (player.xp/player.tierXP - xp)/10;
  fill(colors.accentHigher);
  stroke(colors.accentHighest);
  strokeWeight(1);
  rect(stx + 10, sty + 200 - (170 * hp), 30, 170 * hp)

  fill(colors.accentDefault);
  stroke(colors.accentHigher);
  rect(stx + 60, sty + 200 - (170 * (player.capacity/player.maxCapacity)), 30, 170 * (player.capacity/player.maxCapacity))

  fill(colors.accentDimmer);
  stroke(colors.accentDefault);
  rect(stx + 110, sty + 200 - (170 * xp), 30, 170 * xp);

  textAlign(CENTER, TOP);
  fill(colors.accentHigher)
  textSize(10)
  text("Health", stx + 25, sty + 10)
  text("Ammo", stx + 75, sty + 10)
  text("XP", stx + 125, sty + 10)

  //Minimap
  let a = mapWidth >= mapHeight ? mapHeight : mapWidth;
  let b = mapWidth <= mapHeight ? mapHeight : mapWidth;
  strokeWeight(2);
  stroke(colors.accentHigher + opac(100));
  fill(colors.accentDefault + opac(50));
  rect(width - 170, 20, 150, (a/b)*150);
  noStroke();
  fill(colors.accentHighest + opac(75));

  let ix = width - 170;
  let iy = 20;
  let w = 150/levels[level].m[0].length;
  let h = ((a/b)*150)/levels[level].m.length;

  for(let y in levels[level].m){
    for(let x in levels[level].m[y]) {
      if(levels[level].m[y][x] === '0') rect(ix + x * w, iy + y * h, w, h);    
    }
  }

  for(let b of bodies) {
    if(b.type === "chest") {
      fill(255, 200, 0, 150);
      rect(ix + b.body.position.x/blockSize * w - w/2, iy + b.body.position.y/blockSize * h - h/2, w, h)
    }
    if(b.type === 'unit' || b.type === 'turret') {
      fill((b.team === 'r' ? colors.accentHigher : colors.blueHigher) + opac(100));
      ellipse(ix + b.body.position.x/blockSize * w, iy + b.body.position.y/blockSize * h, w, h);
    }
    if(b.type === 'base') {
      fill((b.team === 'r' ? colors.accentHigher : colors.blueHigher) + opac(100));
      ellipse(ix + b.body.position.x/blockSize * w, iy + b.body.position.y/blockSize * h, w*2, h*2);
    }
  }

  fill(colors.accentHighest);
  ellipse(ix + player.body.position.x / blockSize * w, iy + player.body.position.y / blockSize * h, 5, 5)

  //Cursor
  push();
  translate(mouseX, mouseY);
  rotate((pmouseX - mouseX/pmouseY - mouseY)/(Math.PI*180))
  noFill();
  stroke(colors.accentHighest + opac(150));
  strokeWeight(3);
  ellipse(0, 0, 30, 30);
  line(0 + 15, 0, 0 + 35, 0)
  line(0 - 15, 0, 0 - 35, 0)
  line(0, 0 + 15, 0, 0 + 35)
  line(0, 0 - 15, 0, 0 - 35)
  stroke(colors.accentHigher + opac(150));
  strokeWeight(10);
  strokeCap(SQUARE)
  arc(0, 0, 30, 30, 0, Math.PI/2);
  arc(0, 0, 30, 30, Math.PI, Math.PI + Math.PI/2);
  pop();

  // Powerup button
  noStroke();
  fill(colors.accentDefault + opac(150));
  if(mouseX > 20 && mouseX < 220 && mouseY > 20 && mouseY < 95) {
    fill(colors.accentDefault + opac(200));
    if(clicked) {
      scene = "powerups";
      clicked = false;
    }
  }
  if(keys['q']) {
    scene = "powerups"
    keys['q'] = false;
  }
  
  rect(20, 20, 200, 75);
  image(sprites.i1, 20, 20, 75, 75);
  fill(colors.accentHigher);
  textSize(15);
  textAlign(LEFT, CENTER);
  text("Powerups", 85, 115/2)

  // Powerup Icons
  Object.entries(player.powerups).filter(([key, value]) => value).forEach(([key, value], index) => {
    if(player.selectedPowerup === key) {
      strokeWeight(3);
      stroke(colors.accentHigher);
    }else {
      noStroke();
    }
    fill(colors.accentDefault + opac(150));
    rect(20, 160 + index * 60, 50, 50);   
    image(sprites[key], 25, 165 + index * 60, 40, 40);
    textSize(10);
    fill(colors.accentHighest);
    textAlign(LEFT, TOP);
    noStroke();
    text(index + 1, 22, 162 + index * 60);
    text(player.powerups[key], 58, 158 + 40 + index * 60);
    
    if(mouseX > 20 && mouseX < 70 && mouseY > 160 + index * 60 && mouseY < 160 + index * 60 + 50) {
      if(clicked) {
        player.selectedPowerup = key;
        clicked = false;
      }
    }
  })
}