// fetch audio file
const audio = new Audio("../../../static/sounds/The_Rains_of_Castamere.m4a");

// select our play button
const playButton = document.getElementById(
  "play-pause-btn"
) as HTMLButtonElement;

// select our volume input
const volumeControl = document.getElementById("volume") as HTMLInputElement;
const stereoPannerControl = document.getElementById(
  "stereoPanner"
) as HTMLInputElement;
const pannerPositionXControl = document.getElementById(
  "panner_positionX"
) as HTMLInputElement;
const pannerPositionYControl = document.getElementById(
  "panner_positionY"
) as HTMLInputElement;
const pannerPositionZControl = document.getElementById(
  "panner_positionZ"
) as HTMLInputElement;

// AudioContext
const audioContext = new AudioContext();
const track = audioContext.createMediaElementSource(audio);

// GainNode
const gainNode = audioContext.createGain();

// StereoPannerNode
// --Using factory method
// const pannerNode = audioContext.createStereoPanner();
// --Using Constructor
const stereoPannerNode = new StereoPannerNode(audioContext, { pan: 0 });

// PannerNode
const pannerNode = audioContext.createPanner();
// pannerNode.panningModel = "HRTF";
// pannerNode.distanceModel = "inverse";
// pannerNode.refDistance = 1;
// pannerNode.maxDistance = 10000;
// pannerNode.rolloffFactor = 1;
// pannerNode.coneInnerAngle = 360;
// pannerNode.coneOuterAngle = 0;
// pannerNode.coneOuterGain = 0;
console.log(pannerNode);

track.connect(gainNode).connect(pannerNode).connect(audioContext.destination);

// When audio ended playButton state changes
audio.addEventListener(
  "ended",
  () => {
    playButton.dataset.playing = "false";
    playButton.innerHTML = "Play";
  },
  false
);

// On range input volume change
volumeControl.addEventListener(
  "input",
  function () {
    gainNode.gain.value = Number(this.value);
  },
  false
);

// On range input stereoPanner change
stereoPannerControl.addEventListener(
  "input",
  function () {
    // stereoPannerNode.pan.value = Number(this.value);
  },
  false
);

// On range input panner_positionX change
pannerPositionXControl.addEventListener(
  "input",
  function () {
    pannerNode.positionX.value = Number(this.value);
  },
  false
);
pannerPositionYControl.addEventListener(
  "input",
  function () {
    pannerNode.positionY.value = Number(this.value);
  },
  false
);
pannerPositionZControl.addEventListener(
  "input",
  function () {
    pannerNode.positionZ.value = Number(this.value);
  },
  false
);

// When playButton clicked we play the audio
playButton.addEventListener(
  "click",
  function () {
    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // play or pause track depending on state
    if (this.dataset.playing === "false") {
      audio.play();
      this.innerHTML = "Pause";
      this.dataset.playing = "true";
    } else if (this.dataset.playing === "true") {
      audio.pause();
      this.innerHTML = "Play";
      this.dataset.playing = "false";
    }
  },
  false
);
