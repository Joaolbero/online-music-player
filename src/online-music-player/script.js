const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeBar = document.getElementById("volume-bar");
const playlistEl = document.getElementById("playlist");
const playlistInfoEl = document.getElementById("playlist-info");
const trackTitleEl = document.getElementById("track-title");
const trackArtistEl = document.getElementById("track-artist");
const discEl = document.querySelector(".disc");
const muteBtn = document.getElementById("mute-btn");
const repeatBtn = document.getElementById("repeat-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const nowPlayingLabel = document.getElementById("now-playing-label");
const fileInput = document.getElementById("file-input");
const seekBackBtn = document.getElementById("seek-back-btn");
const seekForwardBtn = document.getElementById("seek-forward-btn");
const coverImageEl = document.querySelector(".cover-image");
const themeToggleBtn = document.getElementById("theme-toggle");
const miniPlayer = document.getElementById("mini-player");
const miniCover = document.getElementById("mini-cover");
const miniTitle = document.getElementById("mini-title");
const miniPlay = document.getElementById("mini-play");
const miniProgress = document.getElementById("mini-progress");

const DEFAULT_COVER = "assets/img/default-cover.png";

let currentTheme = "dark";

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
  }
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

function applyTheme(theme) {
  currentTheme = theme === "light" ? "light" : "dark";
  if (currentTheme === "light") {
    document.body.classList.add("light-theme");
    themeToggleBtn.textContent = "Dark mode";
  } else {
    document.body.classList.remove("light-theme");
    themeToggleBtn.textContent = "Light mode";
  }
  localStorage.setItem("onlineMusicPlayerTheme", currentTheme);
}

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

function seekRelative(seconds) {
  if (!audio.duration) {
    return;
  }
  const newTime = Math.min(Math.max(0, audio.currentTime + seconds), audio.duration);
  audio.currentTime = newTime;
}

function setTrack(index) {
  currentTrackIndex = index;
  const track = tracks[currentTrackIndex];
  audio.src = track.file;
  trackTitleEl.textContent = track.title;
  trackArtistEl.textContent = track.artist;
  if (coverImageEl) {
    if (track.cover) {
      coverImageEl.src = track.cover;
    } else {
      coverImageEl.src = DEFAULT_COVER;
    }
  }
  nowPlayingLabel.textContent = "Now playing";
  updatePlaylistActive();
  updateMiniPlayer();
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

function updateMiniPlayer() {
  const track = tracks[currentTrackIndex];
  miniCover.src = track.cover || DEFAULT_COVER;
  miniTitle.textContent = track.title;
  miniPlay.textContent = isPlaying ? "⏸" : "▶";
}

function updatePlaylistInfo() {
  if (!playlistInfoEl) {
    return;
  }
  let totalSeconds = 0;
  tracks.forEach(t => {
    if (t.lengthDisplay) {
      const parts = t.lengthDisplay.split(":");
      if (parts.length === 2) {
        const m = Number(parts[0]) || 0;
        const s = Number(parts[1]) || 0;
        totalSeconds += m * 60 + s;
      }
    }
  });
  const totalMin = Math.floor(totalSeconds / 60);
  const totalSec = totalSeconds % 60;
  const totalFormatted = `${totalMin}:${String(totalSec).padStart(2, "0")}`;
  playlistInfoEl.textContent = `${tracks.length} tracks · ${totalFormatted} total`;
}

function playTrack() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸";
  discEl.classList.add("playing");
  updateMiniPlayer();
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
  discEl.classList.remove("playing");
  updateMiniPlayer();
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
    miniProgress.value = progress;
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
  updatePlaylistInfo();
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
      const duration = tempAudio.duration || 0;
      const title = file.name.replace(/\.[^/.]+$/, "");
      const newTrack = {
        title,
        artist: "Local file",
        file: objectUrl,
        lengthDisplay: duration ? formatTime(duration) : ""
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
    seekRelative(-5);
    event.preventDefault();
  }
  if (event.code === "ArrowRight") {
    seekRelative(5);
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
seekBackBtn.addEventListener("click", () => seekRelative(-5));
seekForwardBtn.addEventListener("click", () => seekRelative(5));
miniPlay.addEventListener("click", togglePlay);
miniProgress.addEventListener("input", () => {
  if (!audio.duration) {
    return;
  }
  const percent = parseFloat(miniProgress.value);
  const newTime = (percent / 100) * audio.duration;
  audio.currentTime = newTime;
});

themeToggleBtn.addEventListener("click", () => {
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

window.addEventListener("load", () => {
  const savedTheme = localStorage.getItem("onlineMusicPlayerTheme");
  if (savedTheme === "light") {
    applyTheme("light");
  } else {
    applyTheme("dark");
  }
  buildPlaylist();
  setTrack(currentTrackIndex);
  volumeBar.value = 0.8;
  audio.volume = 0.8;
  lastVolume = 0.8;
  updateModeButtons();
});