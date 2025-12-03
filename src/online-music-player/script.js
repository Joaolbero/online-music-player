const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeBar = document.getElementById("volume-bar");
const playlistEl = document.getElementById("playlist");
const trackTitleEl = document.getElementById("track-title");
const trackArtistEl = document.getElementById("track-artist");
const discEl = document.querySelector(".disc");
const muteBtn = document.getElementById("mute-btn");
const repeatBtn = document.getElementById("repeat-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const nowPlayingLabel = document.getElementById("now-playing-label");
const fileInput = document.getElementById("file-input");

let tracks = [
  {
    title: "Fases",
    artist: "Aka Rasta",
    file: "assets/music/Aka Rasta - Fases.mp3",
    lengthDisplay: "03:39"
  },
  {
    title: "Ofício",
    artist: "Leviano",
    file: "assets/music/Leviano - Ofício.mp3",
    lengthDisplay: "02:54"
  },
  {
    title: "Alexa",
    artist: "LH Chucro",
    file: "assets/music/LH Chucro - Alexa.mp3",
    lengthDisplay: "02:34"
  },
  {
    title: "Poetas no Topo 4",
    artist: "Jotapê, Cesar Mc, Sain, Dk47, Leall, Don L, Ajuliacosta, Major RD, Xamã, Bc Raff & Froid",
    file: "assets/music/Poetas no Topo 4 - Jotapê, Cesar Mc, Sain, Dk47, Leall, Don L, Ajuliacosta, Major RD, Xamã, Bc Raff & Froid.mp3",
    lengthDisplay: "17:53"
  },
];

let currentTrackIndex = 0;
let isPlaying = false;
let isSeeking = false;
let isMuted = false;
let lastVolume = 0.8;
let isShuffle = false;
let repeatMode = "off";
let spacePressedAt = null;
let spaceSpeedActive = false;
let spaceHoldTimeout = null;

function formatTime(seconds) {
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  const padded = s < 10 ? `0${s}` : s;
  return `${m}:${padded}`;
}

function getNextIndex() {
  if (repeatMode === "one") {
    return currentTrackIndex;
  }
  if (isShuffle && tracks.length > 1) {
    let next = currentTrackIndex;
    while (next === currentTrackIndex) {
      next = Math.floor(Math.random() * tracks.length);
    }
    return next;
  }
  return (currentTrackIndex + 1) % tracks.length;
}

function setTrack(index) {
  currentTrackIndex = index;
  const track = tracks[currentTrackIndex];
  audio.src = track.file;
  trackTitleEl.textContent = track.title;
  trackArtistEl.textContent = track.artist;
  nowPlayingLabel.textContent = "Now playing";
  updatePlaylistActive();
}

function updatePlaylistActive() {
  const items = playlistEl.querySelectorAll("li");
  const nextIndex = getNextIndex();
  items.forEach((item, index) => {
    const statusEl = item.querySelector(".track-status");
    item.classList.remove("active");
    item.classList.remove("upnext");
    if (statusEl) {
      statusEl.textContent = "";
    }
    if (index === currentTrackIndex) {
      item.classList.add("active");
      if (statusEl) {
        statusEl.textContent = "Now";
      }
    } else if (index === nextIndex && repeatMode !== "one") {
      item.classList.add("upnext");
      if (statusEl) {
        statusEl.textContent = "Next";
      }
    }
  });
}

function playTrack() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸";
  discEl.classList.add("playing");
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
  discEl.classList.remove("playing");
}

function togglePlay() {
  if (!audio.src) {
    setTrack(currentTrackIndex);
  }
  if (isPlaying) {
    pauseTrack();
  } else {
    playTrack();
  }
}

function playNext() {
  currentTrackIndex = getNextIndex();
  setTrack(currentTrackIndex);
  playTrack();
}

function playPrevious() {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  setTrack(currentTrackIndex);
  playTrack();
}

function handleTimeUpdate() {
  if (isSeeking) {
    return;
  }
  if (audio.duration) {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
}

function handleProgressChange() {
  if (!audio.duration) {
    return;
  }
  const percent = parseFloat(progressBar.value);
  const newTime = (percent / 100) * audio.duration;
  audio.currentTime = newTime;
}

function handleProgressMouseDown() {
  isSeeking = true;
}

function handleProgressMouseUp() {
  isSeeking = false;
  handleProgressChange();
}

function handleVolumeChange() {
  const value = parseFloat(volumeBar.value);
  audio.volume = value;
  if (value === 0) {
    isMuted = true;
    muteBtn.textContent = "🔇";
  } else {
    isMuted = false;
    lastVolume = value;
    muteBtn.textContent = "🔊";
  }
}

function toggleMute() {
  if (!isMuted) {
    lastVolume = audio.volume || 0.5;
    audio.volume = 0;
    volumeBar.value = 0;
    isMuted = true;
    muteBtn.textContent = "🔇";
  } else {
    audio.volume = lastVolume;
    volumeBar.value = lastVolume;
    isMuted = false;
    muteBtn.textContent = "🔊";
  }
}

function toggleRepeatMode() {
  if (repeatMode === "off") {
    repeatMode = "one";
  } else {
    repeatMode = "off";
  }
  updateModeButtons();
  updatePlaylistActive();
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  updateModeButtons();
  updatePlaylistActive();
}

function updateModeButtons() {
  if (repeatMode === "one") {
    repeatBtn.classList.add("mode-active");
  } else {
    repeatBtn.classList.remove("mode-active");
  }
  if (isShuffle) {
    shuffleBtn.classList.add("mode-active");
  } else {
    shuffleBtn.classList.remove("mode-active");
  }
}

function buildPlaylist() {
  playlistEl.innerHTML = "";
  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.dataset.index = String(index);

    const meta = document.createElement("div");
    meta.className = "track-meta";

    const nameSpan = document.createElement("span");
    nameSpan.className = "track-name";
    nameSpan.textContent = track.title;

    const artistSpan = document.createElement("span");
    artistSpan.className = "track-artist";
    artistSpan.textContent = track.artist;

    const statusSpan = document.createElement("span");
    statusSpan.className = "track-status";

    meta.appendChild(nameSpan);
    meta.appendChild(artistSpan);
    meta.appendChild(statusSpan);

    const lengthSpan = document.createElement("span");
    lengthSpan.className = "track-length";
    lengthSpan.textContent = track.lengthDisplay || "";

    li.appendChild(meta);
    li.appendChild(lengthSpan);

    li.addEventListener("click", () => {
      setTrack(index);
      playTrack();
    });

    playlistEl.appendChild(li);
  });
  updatePlaylistActive();
}

function handleFilesSelected(event) {
  const files = event.target.files;
  if (!files || !files.length) {
    return;
  }
  Array.from(files).forEach(file => {
    const objectUrl = URL.createObjectURL(file);
    const tempAudio = document.createElement("audio");
    tempAudio.src = objectUrl;
    tempAudio.addEventListener("loadedmetadata", () => {
      const duration = tempAudio.duration;
      if (duration > 900) {
        alert(`A faixa "${file.name}" ultrapassa 15 minutos e não será adicionada.`);
        URL.revokeObjectURL(objectUrl);
        return;
      }
      const title = file.name.replace(/\.[^/.]+$/, "");
      const newTrack = {
        title,
        artist: "Local file",
        file: objectUrl,
        lengthDisplay: formatTime(duration)
      };
      tracks.push(newTrack);
      buildPlaylist();
    });
  });
}

function handleKeyDown(event) {
  const activeTag = document.activeElement && document.activeElement.tagName;
  if (activeTag === "INPUT") {
    return;
  }
  if (event.code === "Space") {
    if (spacePressedAt === null) {
      spacePressedAt = Date.now();
      spaceHoldTimeout = setTimeout(() => {
        if (spacePressedAt !== null && audio && !audio.paused) {
          audio.playbackRate = 2;
          spaceSpeedActive = true;
        }
      }, 3000);
    }
    event.preventDefault();
  }
  if (event.code === "ArrowUp") {
    const step = 0.05;
    const newVol = Math.min(1, (audio.volume || 0) + step);
    audio.volume = newVol;
    volumeBar.value = newVol;
    if (newVol > 0) {
      isMuted = false;
      muteBtn.textContent = "🔊";
      lastVolume = newVol;
    }
    event.preventDefault();
  }
  if (event.code === "ArrowDown") {
    const step = 0.05;
    const newVol = Math.max(0, (audio.volume || 0) - step);
    audio.volume = newVol;
    volumeBar.value = newVol;
    if (newVol === 0) {
      isMuted = true;
      muteBtn.textContent = "🔇";
    } else {
      isMuted = false;
      muteBtn.textContent = "🔊";
      lastVolume = newVol;
    }
    event.preventDefault();
  }
  if (event.code === "ArrowLeft") {
    if (audio.duration) {
      audio.currentTime = Math.max(0, audio.currentTime - 5);
    }
    event.preventDefault();
  }
  if (event.code === "ArrowRight") {
    if (audio.duration) {
      audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    }
    event.preventDefault();
  }
}

function handleKeyUp(event) {
  const activeTag = document.activeElement && document.activeElement.tagName;
  if (activeTag === "INPUT") {
    return;
  }
  if (event.code === "Space") {
    if (spaceHoldTimeout) {
      clearTimeout(spaceHoldTimeout);
      spaceHoldTimeout = null;
    }
    if (spaceSpeedActive) {
      audio.playbackRate = 1;
      spaceSpeedActive = false;
    } else {
      togglePlay();
    }
    spacePressedAt = null;
    event.preventDefault();
  }
}

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrevious);
audio.addEventListener("timeupdate", handleTimeUpdate);
audio.addEventListener("ended", playNext);
progressBar.addEventListener("input", handleProgressChange);
progressBar.addEventListener("mousedown", handleProgressMouseDown);
progressBar.addEventListener("mouseup", handleProgressMouseUp);
volumeBar.addEventListener("input", handleVolumeChange);
muteBtn.addEventListener("click", toggleMute);
repeatBtn.addEventListener("click", toggleRepeatMode);
shuffleBtn.addEventListener("click", toggleShuffle);
fileInput.addEventListener("change", handleFilesSelected);
window.addEventListener("keydown", handleKeyDown);
window.addEventListener("keyup", handleKeyUp);

window.addEventListener("load", () => {
  buildPlaylist();
  setTrack(currentTrackIndex);
  volumeBar.value = 0.8;
  audio.volume = 0.8;
  lastVolume = 0.8;
  updateModeButtons();
});