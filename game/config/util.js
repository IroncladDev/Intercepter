// numeric value to hex code (helps with opacity)
const opac = o => {
  let u = Math.floor(o).toString(16)
  return u.length === 2 ? u : u + "0"
}

// Shortest angle from one angle to another
const shortAng = (b, a) => {
  let tests = [a - b, (a + Math.PI * 2) - b, (a - Math.PI * 2) - b];
  return tests.sort((a, b) => Math.abs(a) - Math.abs(b))[0]
}

