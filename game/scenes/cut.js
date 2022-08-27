function romanize (num) {
    if (isNaN(num))
        return NaN;
    var digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman = "",
        i = 3;
    while (i--)
        roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    return Array(+digits.join("") + 1).join("M") + roman;
}

function cut() {
  let l = levels[level];
  background(colors.bgRoot)
  textAlign(CENTER, TOP);
  textSize(40);
  fill(colors.accentHigher);
  strokeWeight(2);
  stroke(colors.accentDefault);
  text("Mission " + romanize(level + 1) + ": " + l.name, width/2, 100);
  textSize(20);
  textAlign(LEFT, TOP)
  fill(colors.accentHighest);
  text(l.description, width/2 - 300, 180, 600, 1500);

  noFill();
  let a = mapWidth >= mapHeight ? mapHeight : mapWidth;
  let b = mapWidth <= mapHeight ? mapHeight : mapWidth;
  strokeWeight(2);
  stroke(colors.accentHigher + opac(100));
  fill(colors.accentDefault + opac(50));
  rect(300, height - 250, 200, (a/b)*200);
  noStroke();
  fill(colors.accentHighest + opac(75));

  let ix = 300;
  let iy = height - 250;
  let w = 200/levels[level].m[0].length;
  let h = ((a/b)*200)/levels[level].m.length;

  for(let y in levels[level].m){
    for(let x in levels[level].m[y]) {
      if(levels[level].m[y][x] === '0') {
        fill(colors.accentDimmer)
        rect(ix + x * w, iy + y * h, w, h); 
      }       
      if(levels[level].m[y][x] === '!' || levels[level].m[y][x] === '$') {
        fill(colors.blueDefault)
        rect(ix + x * w, iy + y * h, w, h);
      }
      if(levels[level].m[y][x] === 'B') {
        fill(colors.blueDefault)
        ellipse(ix + x * w + w, iy + y * h + h, w*2, h*2);
      }
    }
  }

  for(let y in levels[level].units){
    for(let x in levels[level].units[y]) {
      if(levels[level].units[y][x] === 'r') {
        fill(colors.accentDefault)
        ellipse(ix + x * w + w/2, iy + y * h + h/2, w, h);
      }
      if(levels[level].units[y][x] === '@') {
        fill(colors.accentHighest)
        ellipse(ix + x * w + w/2, iy + y * h + h/2, w, h);
      }
      if(levels[level].units[y][x] === 'b') {
        fill(colors.blueDefault)
        ellipse(ix + x * w + w/2, iy + y * h + h/2, w, h);
      }
       
    }
  }

  fill(colors.accentHighest);
  textSize(25);
  text("Allies: " + l.unitCount[0] + "\n" + "Enemies: " + l.unitCount[1], 550, height - 250);

  textSize(35);
  text("Click to Start", 550, height - 85);

  if(clicked) {
    setLevel();
    scene = "game";
  }
}
