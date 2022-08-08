let curSounds = 0;
const playSound = (sound, volume=0.5, rate=1) => {
  if(curSounds <= 4){ // only play a max of 3 sfx at once
    let aud = new Audio(`assets/audio/${sound}`)
    aud.autoplay = true;
    aud.src = "assets/audio/" + sound;
    aud.volume = (parseFloat(volume)>1?1:parseFloat(volume)||1);
    aud.playbackRate = rate||1;
    curSounds++;
    aud.onended = function(){ aud.remove(); curSounds--; }
  }  
}
