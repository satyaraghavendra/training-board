// ===========================================================
//  audio.js — Hybrid Audio Engine v3
//
//  Two-layer system:
//  Layer 1: Real MP3 files from R2 CDN (voice cues + energy hits)
//  Layer 2: Web Audio API synth tones (instant fallback if file fails)
//
//  Philosophy for 6am gym use:
//  • Real voice cues fire you up — synth tones just inform
//  • Every sound falls back gracefully if offline or file missing
//  • No jarring sounds — smooth envelopes on all synth tones
//  • Sonic hierarchy: nav(quiet) → cue(clear) → reward(loud)
// ===========================================================

// ===========================================================
//  LAYER 1 — Real Audio Files
//  Upload these to R2 bucket under /audio/ folder
//  All CC0 / royalty-free — sources listed below
// ===========================================================

const AUDIO_CDN = 'https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/audio';

// File map — what each file sounds like and when it plays
// Source guide (all CC0 from freesound.org):
//   go.mp3          → search "go shout energetic" — pick a sharp 1s clip
//   lets_go.mp3     → search "lets go motivational voice" — 1-2s clip
//   rest.mp3        → search "rest calm voice" — soft 1s clip
//   switch.mp3      → search "switch voice cue" — sharp 0.8s clip
//   well_done.mp3   → search "well done coaching voice" — 1.5s positive clip
//   workout_done.mp3→ search "great work session complete voice" — 2-3s clip
//   bell.mp3        → search "boxing bell ring short" — clean 1s ring
//   air_horn.mp3    → search "air horn stab short" — 0.8s punch
//   crowd_cheer.mp3 → search "crowd cheer short applause" — 2-3s energy burst
//   countdown_3.mp3 → search "countdown beep low" — single low beep
//   countdown_2.mp3 → search "countdown beep mid" — single mid beep
//   countdown_1.mp3 → search "countdown beep high" — single high beep

const AUDIO_FILES = {
  go:            `${AUDIO_CDN}/go.mp3`,
  lets_go:       `${AUDIO_CDN}/lets_go.mp3`,
  rest:          `${AUDIO_CDN}/rest.mp3`,
  switch:        `${AUDIO_CDN}/switch.mp3`,
  well_done:     `${AUDIO_CDN}/well_done.mp3`,
  workout_done:  `${AUDIO_CDN}/workout_done.mp3`,
  come_on:       `${AUDIO_CDN}/come_on.mp3`,
  halfway:       `${AUDIO_CDN}/halfway.mp3`,
  last_round:    `${AUDIO_CDN}/last_round.mp3`,
  breathe:       `${AUDIO_CDN}/breathe.mp3`,
  bell:          `${AUDIO_CDN}/bell.mp3`,
  air_horn:      `${AUDIO_CDN}/air_horn.mp3`,
  crowd_cheer:   `${AUDIO_CDN}/crowd_cheer.mp3`,
  countdown_3:   `${AUDIO_CDN}/countdown_3.mp3`,
  countdown_2:   `${AUDIO_CDN}/countdown_2.mp3`,
  countdown_1:   `${AUDIO_CDN}/countdown_1.mp3`,
};

// Preloaded Audio objects — loaded once, played instantly
const _audio = {};
let _audioReady = false;

function preloadAudioFiles(){
  Object.entries(AUDIO_FILES).forEach(([key, url]) => {
    const a = new Audio();
    a.preload = 'auto';
    a.volume  = 0.85;
    a.src     = url;
    a.load();
    _audio[key] = a;
  });
  _audioReady = true;
}

// Play a real audio file — falls back to synthFn if file fails
function playFile(key, synthFn, volume){
  const a = _audio[key];
  if(a && _audioReady){
    const clone = a.cloneNode(); // clone so overlapping plays work
    clone.volume = volume || 0.85;
    clone.play().catch(() => {
      // File failed (offline, missing) — use synth fallback
      if(synthFn) synthFn();
    });
  } else {
    if(synthFn) synthFn();
  }
}

// Preload on first user interaction (browsers require gesture)
let _preloaded = false;
function tryPreload(){
  if(!_preloaded){
    _preloaded = true;
    preloadAudioFiles();
  }
}

// ===========================================================
//  LAYER 2 — Web Audio API Synth Engine
//  Used as fallback + for sounds with no audio file
// ===========================================================

const ACtx = window.AudioContext || window.webkitAudioContext;
let audioCtx   = null;
let masterGain = null;

function ensureAudio(){
  if(!audioCtx){
    audioCtx   = new ACtx();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.80, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }
  if(audioCtx.state === 'suspended') audioCtx.resume();
}

// Single tone with smooth envelope (no clicks)
function tone(freq, dur, gain, type, delay){
  try{
    ensureAudio();
    const t = audioCtx.currentTime + (delay || 0);
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(masterGain);
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain || 0.6, t + 0.005);
    g.gain.setValueAtTime(gain || 0.6, t + dur * 0.65);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t); o.stop(t + dur + 0.01);
  }catch(e){}
}

// Frequency glide
function sweep(startF, endF, dur, gain, type, delay){
  try{
    ensureAudio();
    const t = audioCtx.currentTime + (delay || 0);
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(masterGain);
    o.type = type || 'sine';
    o.frequency.setValueAtTime(startF, t);
    o.frequency.exponentialRampToValueAtTime(endF, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain || 0.6, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t); o.stop(t + dur + 0.01);
  }catch(e){}
}

// ===========================================================
//  SOUND EVENTS — hybrid real + synth
//  Format: playFile('key', synthFallback)
// ===========================================================

// ── Navigation (subtle) ────────────────────────────────────

function sndPhaseChange(){
  // No audio file — synth only (navigation is subtle)
  sweep(300, 600, 0.18, 0.20, 'sine', 0);
  tone(600, 0.12, 0.13, 'sine', 0.16);
}

function sndTimerPause(){
  playFile('rest',
    () => sweep(520, 260, 0.18, 0.28, 'sine', 0)
  );
}

// ── Timer cues ─────────────────────────────────────────────

function sndTimerStart(){
  // "GO!" voice + synth rising chime
  playFile('go',
    ()=>{ tone(392,0.10,0.45,'sine',0); tone(523,0.15,0.55,'sine',0.10); }
  );
}

function sndRestComplete(){
  // Boxing bell → REST OVER, GO AGAIN
  // Most important cue in the session
  playFile('bell',
    ()=>{
      tone(523, 0.15, 0.65, 'sine', 0);    // C5
      tone(659, 0.15, 0.70, 'sine', 0.16); // E5
      tone(784, 0.35, 0.80, 'sine', 0.32); // G5 loudest
    }
  );
  // Voice overlay 0.4s after bell — "LET'S GO"
  setTimeout(() => playFile('lets_go', null, 0.75), 400);
}

function sndCountdownWarning(secsLeft){
  // Escalating countdown beeps — low/mid/high
  const key  = secsLeft === 3 ? 'countdown_3'
             : secsLeft === 2 ? 'countdown_2' : 'countdown_1';
  const freq = secsLeft === 3 ? 660 : secsLeft === 2 ? 880 : 1100;
  const gain = secsLeft === 1 ? 0.70 : 0.55;
  playFile(key, () => tone(freq, 0.07, gain, 'square', 0));
}

// ── Side / bilateral cues ──────────────────────────────────

function sndSideTransition(){
  // "SWITCH!" voice + sawtooth chirp
  playFile('switch',
    () => sweep(440, 880, 0.12, 0.50, 'sawtooth', 0)
  );
}

function sndLeftStart(){
  // Same as side transition — left side starting
  playFile('switch',
    ()=>{ tone(523,0.10,0.45,'sine',0); tone(784,0.18,0.55,'sine',0.10); }
  );
}

// ── Set / hold completions ─────────────────────────────────

function sndSetComplete(){
  // Low thunk + high ping — satisfying mechanical feel
  tone(196, 0.25, 0.65, 'triangle', 0);
  tone(784, 0.12, 0.40, 'sine',     0.12);
}

function sndHoldComplete(){
  // Descending sweep → landing — hold is done, switch or rest
  sweep(880, 440, 0.25, 0.55, 'sine', 0);
  tone(349,  0.35, 0.45, 'sine',     0.22);
}

// ── Block complete ─────────────────────────────────────────

function sndAllSetsDone(){
  // "Well done!" voice + air horn
  playFile('air_horn',
    ()=>{
      sweep(300, 900, 0.35, 0.75, 'sine', 0);
      tone(523, 0.50, 0.60, 'sine', 0.30);
      tone(659, 0.50, 0.55, 'sine', 0.32);
      tone(784, 0.50, 0.55, 'sine', 0.34);
    }
  );
  setTimeout(() => playFile('well_done', null, 0.80), 600);
}

// ── EMOM ───────────────────────────────────────────────────

function sndEmomRound(){
  // Hard double-tap square + high note — unmistakable new round
  tone(523,  0.07, 0.75, 'square', 0);
  tone(523,  0.07, 0.75, 'square', 0.10);
  tone(1047, 0.18, 0.65, 'square', 0.22);
}

function sndEmomComplete(){
  playFile('well_done',
    ()=>{
      tone(392, 0.90, 0.45, 'sine', 0);
      tone(523, 0.90, 0.45, 'sine', 0.02);
      tone(784, 0.90, 0.40, 'sine', 0.04);
    }
  );
}

// ── WORKOUT COMPLETE — biggest moment ─────────────────────

function sndWorkoutComplete(){
  // Crowd cheer + full voice congratulation
  playFile('crowd_cheer',
    ()=>{
      // 5-note victory fanfare C-E-G-C-E
      tone(523,  0.20, 0.60, 'sine', 0);
      tone(659,  0.20, 0.65, 'sine', 0.18);
      tone(784,  0.20, 0.70, 'sine', 0.36);
      tone(1047, 0.20, 0.75, 'sine', 0.54);
      tone(1319, 0.50, 0.80, 'sine', 0.72);
      // Echo
      tone(523,  0.40, 0.25, 'sine', 0.85);
      tone(784,  0.40, 0.25, 'sine', 0.90);
      tone(1047, 0.40, 0.25, 'sine', 0.95);
    }
  );
  // Voice overlay after crowd cheer settles
  setTimeout(() => playFile('workout_done', null, 0.90), 800);
}

// ── Profile select ─────────────────────────────────────────

function sndProfileSelect(){
  tone(659,  0.12, 0.35, 'sine', 0);
  tone(784,  0.12, 0.35, 'sine', 0.10);
  tone(1047, 0.20, 0.40, 'sine', 0.20);
}

// COME ON — fires mid-hold for motivation push
function sndComeOn(){
  playFile('come_on',
    ()=>{ tone(523,0.12,0.55,'sine',0); tone(659,0.20,0.65,'sine',0.12); }
  );
}

// HALFWAY — EMOM and long hold midpoint cue
function sndHalfway(){
  playFile('halfway',
    ()=>{ tone(440,0.10,0.40,'sine',0); tone(554,0.16,0.45,'sine',0.10); }
  );
}

// LAST ROUND — final set energy burst
function sndLastRound(){
  playFile('last_round',
    ()=>{
      tone(392,0.08,0.60,'square',0);
      tone(523,0.08,0.65,'square',0.10);
      tone(659,0.22,0.72,'square',0.20);
    }
  );
}

// BREATHE — cooldown / deload entry cue
function sndBreathe(){
  playFile('breathe',
    ()=>{ sweep(440,330,0.40,0.25,'sine',0); }
  );
}

// ===========================================================
//  CLOCK
// ===========================================================
function tickClock(){
  const now = new Date();
  document.getElementById('clock').textContent =
    String(now.getHours()).padStart(2,'0') + ':' +
    String(now.getMinutes()).padStart(2,'0') + ':' +
    String(now.getSeconds()).padStart(2,'0');
}
setInterval(tickClock, 250);
tickClock();

// ===========================================================
//  AUDIO UNLOCK + PRELOAD
// ===========================================================
function ensureAndResumeAudio(){
  ensureAudio();
  if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  tryPreload(); // preload real audio files on first gesture
}
document.addEventListener('click',      ensureAndResumeAudio);
document.addEventListener('keydown',    ensureAndResumeAudio);
document.addEventListener('touchstart', ensureAndResumeAudio);

document.addEventListener('visibilitychange', () => {
  if(document.visibilityState === 'visible'){
    if(audioCtx && audioCtx.state === 'suspended')
      audioCtx.resume().catch(e => console.warn('Audio resume:', e));
    if(wakeLock !== null) requestWakeLock();
  }
});
