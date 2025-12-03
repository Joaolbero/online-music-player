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

const tracks = [
  {
    title: "Cyber Skyline",
    artist: "Albero",
    file: "assets/music/track1.mp3",
    lengthDisplay: "3:24"
  },
  {
    title: "Neon Waves",
    artist: "Russo",
    file: "assets/music/track2.mp3",
    lengthDisplay: "4:02"
  },
  {
    title: "Midnight Circuit",
    artist: "João",
    file: "assets/music/track3.mp3",
    lengthDisplay: "2:57"
  }
];

let currentTrackIndex = 0;
let isPlaying = false;
let isSeeking = false;

function formatTime(seconds) {
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  const padded = s < 10 ? `0${s}` : s;
  return `${m}:${padded}`;
}

function setTrack(index) {
  currentTrackIndex = index;
  const track = tracks[currentTrackIndex];
  audio.src = track.file;
  trackTitleEl.textContent = track.title;
  trackArtistEl.textContent = track.artist;
  updatePlaylistActive();
}

function updatePlaylistActive() {
  const items = playlistEl.querySelectorAll("li");
  items.forEach((item, index) => {
    if (index === currentTrackIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
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
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
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
  audio.volume = parseFloat(volumeBar.value);
}

function buildPlaylist() {
  playlistEl.innerHTML = "";
  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    const meta = document.createElement("div");
    meta.className = "track-meta";
    const nameSpan = document.createElement("span");
    nameSpan.className = "track-name";
    nameSpan.textContent = track.title;
    const artistSpan = document.createElement("span");
    artistSpan.className = "track-artist";
    artistSpan.textContent = track.artist;
    meta.appendChild(nameSpan);
    meta.appendChild(artistSpan);
    const lengthSpan = document.createElement("span");
    lengthSpan.className = "track-length";
    lengthSpan.textContent = track.lengthDisplay;
    li.appendChild(meta);
    li.appendChild(lengthSpan);
    li.addEventListener("click", () => {
      setTrack(index);
      playTrack();
    });
    playlistEl.appendChild(li);
  });
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

window.addEventListener("load", () => {
  buildPlaylist();
  setTrack(currentTrackIndex);
  volumeBar.value = 0.8;
  audio.volume = 0.8;
});