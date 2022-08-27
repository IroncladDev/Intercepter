const pinfo = [
  [
    {
      name: "Grenades",
      cost: 100,
      count: 5,
      code: "grenades",
      description: "Five grenades which can be thrown at enemies or structures"
    },
    {
      name: "Force Field",
      cost: 75,
      count: 1,
      code: "forcefields",
      description: "Applies a temporary shield around the player, protects from damage."
    },
    {
      name: "Mines",
      cost: 100,
      count: 5,
      code: "mines",
      description: "Five mines are granted, which can be placed on the ground.  Explodes on contact with an enemy."
    }
  ],

  [
    {
      name: "FreezeRay",
      cost: 50,
      count: 1,
      code: "freezerays",
      description: "Grants a single-use freeze ray.  Will temporary freeze enemies within a certain radius."
    },
    {
      name: "Health Packs",
      cost: 150,
      count: 3,
      code: "healthpacks",
      description: "Grants three health packs, where each on use can heal you completely."
    },
    {
      name: "Nuke",
      cost: 300,
      count: 2,
      code: "nukes",
      description: "Two extremely powerful bombs that stun enemies, massively damage structures, and wrecks havoc."
    }
  ]
];
let pw = 320;
let ph = 170;

const powerups = () => {
  noStroke();
  for(let y in pinfo) {
    let col = pinfo[y];
    for(let i in col) {
      let item = col[i];
      let ix = (width - pw*3)/2 + i * pw + 10;
      let iy = y * ph + 10;
      fill(colors.accentDefault + opac(150));
      if(mouseX > ix && mouseY > iy && mouseX < ix + pw && mouseY < iy + ph) {
        fill(colors.accentDefault + opac(200));
        if(player.credits >= item.cost) {
          cursor("pointer");
          if(clicked) {
            player.credits -= item.cost;
            player.powerups[item.code] += item.count;
          }
        }else {
          cursor("not-allowed")
        }
      }
      
      rect(ix, iy, pw - 20, ph - 20);
      fill(colors.accentHigher);
      textSize(20);
      textAlign(CENTER, TOP);
      text(item.name + ` (x${item.count}) - $${item.cost}`, ix + pw/2 - 10, iy + 10);
      textSize(15);
      textAlign(LEFT, TOP);
      fill(colors.accentHighest);
      text(item.description, ix + 10, iy + 40, pw - 40, ph - 60);
      
    }
  }
  textAlign(LEFT, CENTER);
  textSize(20);
  fill(255)
  text("Credits: " + player.credits, 130, 360);
  fill(colors.accentDefault + opac(150));
  if(mouseX > 20 && mouseX < 300 && mouseY > height - 80 && mouseY < height - 20) {
    fill(colors.accentDefault + opac(200));
    cursor("pointer")
    textSize(25);
    if(clicked) {
      scene = "game";
      clicked = false;
    }
  }
  rect(20, height - 80, 60, 60);
  image(sprites.i2, 20, height - 80, 60, 60);
  fill(255);
  text("Return to game", 100, height - 50)

  if(keys['q']) {
    scene = "game"
    keys['q'] = false;
  }
}