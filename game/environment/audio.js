let curSounds = 0;
let sounds = ["bullet-impact.mp3", "chest-break.mp3", "click.wav", "coin.mp3", "explosion.mp3", "explosion2.mp3", "gun1.mp3", "gun2.mp3", "gun3.mp3", "gun4.mp3", "hover.wav", "hurt.mp3"];
let soundPlayer = {};
sounds.forEach(sound => {
  soundPlayer[sound] = new Howl({
    src: ["assets/audio/" + sound]
  })
})
// const playSound = (sound, volume=0.5, ign=false) => {
//   let play = () => {
//     let aud = document.createElement("audio")
//     aud.autoplay = true;
//     aud.src = "assets/audio/" + sound;
//     aud.volume = (parseFloat(volume)>1?1:parseFloat(volume)||1);
//     aud.playbackRate = 1;
//     curSounds++;
//     aud.onended = function(){ aud.remove(); curSounds--; }
//   }
//   if(!ign && curSounds <= 5){ // only play a max of 3 sfx at once
//     play();
//   }  
//   if(ign) play();
// }

const playSound = (sound, volume, ign) => {
  let snd = new Howl({
    src: ["assets/audio/" + sound],
    volume: volume,
    onend: () => {
      curSounds--;
    }
  })
  if(ign) snd.play();
  else if(!ign && curSounds <= 3) {
    curSounds++;
    snd.play();
  }
}