// ===========================================================
//  audio.js — Web Audio API engine
//  Synthesized tones/sweeps, 12 distinct sound events
//  Standalone — no dependencies
// ===========================================================
// ===========================================================
const ACtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function ensureAudio(){
  if(!audioCtx) audioCtx = new ACtx();
  // CRITICAL: browsers suspend AudioContext until user gesture
  // Resume it every time before playing
  if(audioCtx.state === 'suspended') audioCtx.resume();
}

// Core tone: freq, duration(s), gain(0-1), wavetype, startDelay(s)
function tone(freq, dur, gain, type, delay){
  gain  = gain  || 0.7;
  type  = type  || 'sine';
  delay = delay || 0;
  try{
    ensureAudio();
    const now = audioCtx.currentTime;
    const t   = now + delay;
    const o   = audioCtx.createOscillator();
    const g   = audioCtx.createGain();
    o.connect(g);
    g.connect(audioCtx.destination);
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0,     t);
    g.gain.linearRampToValueAtTime(gain, t + 0.01);
    g.gain.setValueAtTime(gain,  t + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t);
    o.stop(t + dur + 0.01);
  }catch(e){ console.warn('Audio error:', e); }
}

// Frequency sweep (rising or falling glide)
function sweep(startFreq, endFreq, dur, gain, type, delay){
  gain  = gain  || 0.7;
  type  = type  || 'sine';
  delay = delay || 0;
  try{
    ensureAudio();
    const now = audioCtx.currentTime;
    const t   = now + delay;
    const o   = audioCtx.createOscillator();
    const g   = audioCtx.createGain();
    o.connect(g);
    g.connect(audioCtx.destination);
    o.type = type;
    o.frequency.setValueAtTime(startFreq, t);
    o.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
    g.gain.setValueAtTime(0,    t);
    g.gain.linearRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t);
    o.stop(t + dur + 0.01);
  }catch(e){}
}

// ============================================================
//  SOUND LIBRARY — every sound clearly distinct
// ============================================================

// 1. TIMER START — rising two-tone blip (GO signal)
function sndTimerStart(){
  tone(440,  0.10, 0.5, 'sine',     0);
  tone(660,  0.12, 0.6, 'sine',     0.10);
}

// 2. COUNTDOWN WARNING — 3 rapid sharp pips (3 seconds left)
function sndCountdownWarning(){
  tone(880, 0.07, 0.55, 'square', 0);
}

// 3. REST COMPLETE — bold 3-note fanfare (go again!)
function sndRestComplete(){
  tone(523,  0.18, 0.70, 'sine',  0);      // C5
  tone(659,  0.18, 0.65, 'sine',  0.18);   // E5
  tone(784,  0.30, 0.75, 'sine',  0.36);   // G5  longest, loudest
}

// 4. SIDE TRANSITION — rising sawtooth chirp (unique: only sawtooth+sweep in the app)
function sndSideTransition(){
  sweep(300, 1200, 0.18, 0.65, 'sawtooth', 0);  // fast rising chirp
  tone(880,  0.12, 0.45, 'sine',           0.22); // clean confirmation ping
}

// 5. HOLD COMPLETE — descending sweep + final low tone
function sndHoldComplete(){
  sweep(1200, 600, 0.25, 0.70, 'sine',  0);
  tone(440,   0.30, 0.60, 'sine',       0.28);
}

// 6. SET COMPLETE — satisfying low thud + mid click
function sndSetComplete(){
  tone(220,  0.20, 0.75, 'triangle', 0);   // low thud
  tone(550,  0.12, 0.55, 'sine',     0.10); // mid confirm
}

// 7. ALL SETS DONE — rising sweep + big chord (celebrate!)
function sndAllSetsDone(){
  sweep(300, 900,  0.35, 0.80, 'sine', 0);
  tone(523,  0.50, 0.60, 'sine',      0.30);  // C5
  tone(659,  0.50, 0.55, 'sine',      0.32);  // E5 (slight offset = chorus)
  tone(784,  0.50, 0.55, 'sine',      0.34);  // G5
}

// 8. EMOM NEW ROUND — hard square pulse (unmistakable)
function sndEmomRound(){
  tone(698,  0.08, 0.80, 'square', 0);
  tone(698,  0.08, 0.80, 'square', 0.12);
  tone(1047, 0.15, 0.70, 'square', 0.24);
}

// 9. EMOM COMPLETE — warm held chord (session over)
function sndEmomComplete(){
  tone(523,  0.60, 0.55, 'sine', 0);
  tone(659,  0.60, 0.50, 'sine', 0.02);
  tone(784,  0.80, 0.50, 'sine', 0.04);
}

// 10. LEFT SIDE START — rising sweep (fresh side, go!)
function sndLeftStart(){
  sweep(400, 900, 0.20, 0.70, 'sine', 0);
  tone(880,  0.15, 0.65, 'sine',     0.20);
}

// 11. TIMER PAUSE — single low descending blip
function sndTimerPause(){
  sweep(600, 300, 0.15, 0.45, 'sine', 0);
}

// 12. PHASE CHANGE — soft whoosh (navigation)
function sndPhaseChange(){
  sweep(200, 500, 0.12, 0.30, 'sine', 0);
}

// Legacy shim
function beep(freq, dur, gain){
  tone(freq || 880, dur || 0.1, gain || 0.6, 'sine', 0);
}

// -- CLOCK — display only, no beep ------------------------
function tickClock(){
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');
  document.getElementById('clock').textContent = `${h}:${m}:${s}`;
}
setInterval(tickClock, 250);
tickClock();

// Unlock audio on ANY interaction (click, keydown, touch)
function unlockAudio(){
  ensureAudio();
  if(audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}
document.addEventListener('click',   unlockAudio);
document.addEventListener('keydown', unlockAudio);
document.addEventListener('touchstart', unlockAudio);

// Re-arm audio context when screen wakes or tab becomes visible
document.addEventListener('visibilitychange', () => {
  if(document.visibilityState === 'visible' && audioCtx && audioCtx.state === 'suspended'){
    audioCtx.resume().catch(e => console.warn('Audio resume failed on wake:', e));
  }
  // Re-request wake lock if it was released when tab was backgrounded
  if(wakeLock !== null && document.visibilityState === 'visible'){
    requestWakeLock();
  }
});

// ===========================================================