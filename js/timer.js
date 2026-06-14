// ===========================================================
//  timer.js — Circuit sequencer + all timer state machines
//  Types: rest | circuit | bilateral | emom | selfpaced
//  Depends on: data.js, audio.js, ui.js
// ===========================================================
// BILATERAL_MAP defined in data.js

// Helper: get bilateral config for an exercise at current week
// getBilateralCfg defined in data.js

// ===========================================================
//  TIMER CONFIG PER PHASE BLOCK
// ===========================================================
//  PHASE TIMER CONFIG
//  type:'circuit' = sequential steps through exercises, then rest
//  type:'rest'    = straight countdown between sets
//  type:'emom'    = every-minute-on-the-minute
//  type:'selfpaced' = no timer, just prompt
//
//  Circuit step timer types:
//    'reps'      = no timer, tap DONE when finished
//    'bilateral' = count-up hold, right side → gap → left side
//    'hold'      = count-up hold (single, both sides)
//    'countdown' = countdown timer (density work)
//    'sides_reps'= right reps prompt → short gap → left reps prompt
// ===========================================================
const PHASE_TIMER = {
  // MONDAY
  mon: {
    warmup: null,
    a: { type:'rest', rest:45, totalSets:8,  label:'REST between sets' },
    b: { type:'rest', rest:90, totalSets:4,  label:'REST — superset complete' },
    c: { type:'circuit', totalSets:2, restAfterRound:45, label:'CORE CIRCUIT A→B→C',
         steps:[
           { name:'Ab Roller',        timer:'reps',      cue:'8–10 reps — slow and controlled' },
           { name:'Side Plank Hold',  timer:'bilateral', hold:20, gap:5,
             holdByPhase:{P1:20,P2:30,P3:40,P4:20}, cue:'hold each side — time-based' },
           { name:'Hollow Body Hold', timer:'hold',      hold:20,
             holdByPhase:{P1:20,P2:35,P3:50,P4:20}, cue:'legs 45° — brace & hold' },
         ]},
    cooldown: { type:'circuit', totalSets:1, restAfterRound:0, label:'COOL-DOWN',
      steps:[
        { name:'Lat Hang',         timer:'hold',      hold:45, cue:'Hang passive — decompress the spine' },
        { name:'90/90 Hip Stretch',timer:'bilateral', hold:60, gap:5, cue:'Active transitions, not passive sitting' },
        { name:"Child's Pose",     timer:'hold',      hold:60, cue:'Arms extended — let the back breathe' },
        { name:'Grip Recovery',    timer:'hold',      hold:30, cue:'Shake and release — end of pull day' },
      ]},
  },
  // TUESDAY
  tue: {
    warmup: null,
    a: { type:'rest', rest:60, totalSets:4, label:'REST between sets' },
    b: { type:'circuit', totalSets:3, restAfterRound:60, label:'ANTI-ROTATION CIRCUIT',
         steps:[
           { name:'Pallof Press',      timer:'reps', cue:'10/side · 2s hold per rep — rep-based' },
           { name:'Suitcase KB Carry', timer:'bilateral',  hold:30, gap:5, cue:'30s each side — time-based' },
           { name:'Side Plank',        timer:'bilateral',  hold:30, gap:5,
             holdByPhase:{P1:30,P2:30,P3:40,P4:20}, cue:'hold each side — time-based' },
         ]},
    c: { type:'emom', emomMin:10, repsPerMin:10, label:'LUNGE EMOM · 10 min' },
    cooldown: { type:'circuit', totalSets:1, restAfterRound:0, label:'COOL-DOWN',
      steps:[
        { name:'Lat Hang',          timer:'hold',      hold:45, cue:'Passive hang — shoulder decompression' },
        { name:'Band Chest Stretch',timer:'bilateral', hold:60, gap:5, cue:'Open the chest — breathe into it' },
        { name:'Supine Twist',      timer:'bilateral', hold:60, gap:5, cue:'Let gravity do the work — no forcing' },
        { name:'Grip Recovery',     timer:'hold',      hold:30, cue:'Shake it out — close the session' },
      ]},
  },
  // WEDNESDAY
  wed: {
    warmup: null,
    a: { type:'circuit', totalSets:3, restAfterRound:60, label:'TOWER BLAST · 3 rounds',
         roundOnly:true,
         steps:[
           { name:'Hanging Knee Raise',    timer:'reps', cue:'12–15 reps — rep-based' },
           { name:'Band Tricep Pushdown',  timer:'reps', cue:'12–15 reps — rep-based' },
           { name:'Lateral Box Step-Over', timer:'reps', cue:'8/side — rep-based' },
         ]},
    b: { type:'circuit', totalSets:5, restAfterRound:90, label:'HUMANE BURPEE · 5 rounds',
         roundOnly:true,
         steps:[
           { name:'KB Two-Hand Swing', timer:'reps', cue:'15 reps — explosive hip snap' },
           { name:'Goblet Squat',      timer:'reps', cue:'5-4-3-2-1 descending ladder' },
           { name:'Mountain Climbers', timer:'reps', cue:'10-2 descending — stay tight' },
         ]},
    cooldown: { type:'circuit', totalSets:1, restAfterRound:0, label:'COOL-DOWN',
      steps:[
        { name:'Lat Hang',              timer:'hold',      hold:45, cue:'Under bar — full passive hang' },
        { name:'Low Lunge / Couch Stretch', timer:'bilateral', hold:75, gap:5, cue:'Hip flexor release after metabolic work' },
        { name:'Legs Elevated on Bench',timer:'hold',      hold:180, cue:'3 min parasympathetic reset — eyes closed' },
        { name:'Supine Twist',          timer:'bilateral', hold:60, gap:5, cue:'Rotate gently — full body unwind' },
        { name:'Grip Recovery',         timer:'hold',      hold:30, cue:'Shake it out' },
      ]},
  },
  // THURSDAY
  thu: {
    warmup: null,
    a: { type:'circuit', totalSets:4, restAfterRound:90, label:'PULL PROGRESSION',
         steps:[
           { name:'Scapular Pull-Up',          timer:'reps', cue:'10 reps — shrug down+back, zero elbow' },
           { name:'Neutral-Grip Slow Negative', timer:'reps', cue:'3–5 reps · 5s lower — dead hang reset' },
         ],
         stepRests:[20, 90],
       },
    b: { type:'selfpaced', totalSets:1, label:'SELF-PACED — breath between sides' },
    c: { type:'circuit', totalSets:3, restAfterRound:60, label:'BENCH ROW + ROLLOUT',
         roundOnly:true,
         steps:[
           { name:'Bench-Supported Row',    timer:'reps', cue:'8/side — rep-based' },
           { name:'Stability Ball Rollout', timer:'reps', cue:'8 reps — rep-based' },
         ]},
    cooldown: { type:'circuit', totalSets:1, restAfterRound:0, label:'COOL-DOWN',
      steps:[
        { name:'Thread-the-Needle',       timer:'bilateral', hold:60, gap:5, cue:'Thoracic rotation — follow the hand' },
        { name:'Seated Hamstring Stretch',timer:'bilateral', hold:75, gap:5, cue:'Sit tall — hinge from the hip' },
        { name:'Box Breathing',           timer:'hold',      hold:180, cue:'4-4-4-4 · inhale · hold · exhale · hold' },
        { name:'Grip Recovery',           timer:'hold',      hold:30, cue:'Heavy pull day — shake it all out' },
      ]},
  },
  // FRIDAY
  fri: {
    warmup: null,
    a: { type:'rest', rest:90, totalSets:4, label:'REST between sets' },
    b: { type:'bilateral', hold:20, gap:5, totalSets:2, label:'SUITCASE CARRY · 20s per side' },
    c: { type:'circuit', totalSets:6, restAfterRound:15, label:'DENSITY CIRCUIT · 30s on / 15s off',
         steps:[
           { name:'Overspeed KB Swing',     timer:'countdown', hold:30, cue:'30s — throw-down swing' },
           { name:'KB Swing-to-Squat Catch',timer:'countdown', hold:30, cue:'30s — catch at bottom' },
           { name:'Box Step-Down Eccentric',timer:'countdown', hold:30, cue:'30s — 3s eccentric lower' },
         ]},
    cooldown: { type:'circuit', totalSets:1, restAfterRound:0, label:'COOL-DOWN',
      steps:[
        { name:'Box Hip Flexor Stretch',timer:'bilateral', hold:75, gap:5, cue:'Box 16in · deep hip flexor release' },
        { name:'Supine Figure-4',       timer:'bilateral', hold:75, gap:5, cue:'Glute and piriformis — end of leg day' },
        { name:'Brettzel',              timer:'bilateral', hold:60, gap:5, cue:'Full body rotation — close the week' },
        { name:'Grip Recovery',         timer:'hold',      hold:30, cue:'End-of-week reset — shake and release' },
      ]},
  },
};


// Phase timer config updates with week (P2 compresses rest on swings)
function getTimerConfig(dayId, phaseId){
  const d = getActiveData();
  const base = d.PHASE_TIMER[dayId]?.[phaseId];
  if(!base) return null;
  const wm = getWM(currentWeek);
  const p = d.DELOAD_MAP[wm.p] || wm.p;

  // Clone so we don't mutate
  const cfg = Object.assign({}, base);

  // Apply phase-specific rest overrides from your PDF
  if(dayId==='mon' && phaseId==='a'){
    cfg.rest = p==='P1'?45 : p==='P2'?35 : p==='P3'?25 : 45;
    cfg.totalSets = p==='P1'?8 : p==='P2'?10 : p==='P3'?9 : 5;
  }
  if(dayId==='tue' && phaseId==='c'){
    cfg.emomMin = p==='P3'?10 : p==='P4'?6 : 10;
    cfg.repsPerMin = p==='P3'?12 : p==='P4'?8 : 10;
  }
  if(dayId==='fri' && phaseId==='c'){
    cfg.totalSets = p==='P1'?6 : p==='P2'?6 : p==='P3'?5 : 4;
  }
  // Deload: reduce sets by 1
  if(wm.p.startsWith('D')){
    cfg.totalSets = Math.max(1, (cfg.totalSets||1) - 1);
  }
  return cfg;
}

// ===========================================================
//  TIMER ENGINE — Circuit Sequencer
//  Handles: rest | circuit | emom | bilateral | sides | selfpaced
// ===========================================================

// -- State -------------------------------------------------
let timerCfg     = null;
let timerInterval= null;
let timerSeconds = 0;
let timerTotal   = 0;
let timerRunning = false;
let currentSet   = 1;
let emomSeconds  = 60;
let emomRound    = 1;
// V3: Date.now() anchor for drift-corrected countdowns
let targetEndTime  = 0;   // ms epoch when current countdown reaches zero
let targetStartTime = 0;  // ms epoch when current count-up started

// Bilateral sub-state
let bilateralPhase = 'right';  // right|gap|left|done
let bilateralHold  = 20;
let bilateralGap   = 5;

// Circuit sub-state
let circuitStepIdx = 0;        // which step we're on
let circuitSubPhase = 'idle';  // idle|reps|bilateral_r|gap|bilateral_l|hold|countdown|sides_r|sides_gap|sides_l|rest

// -- DOM refs ----------------------------------------------
const timerPanel   = document.getElementById('timer-panel');
const countdownEl  = document.getElementById('countdown');
const cdLabel      = document.getElementById('cd-label');
const timerBadge   = document.getElementById('timer-type-badge');
const setDisplay   = document.getElementById('set-display');
const setDotsEl    = document.getElementById('set-dots');
const tcName       = document.getElementById('tc-name');
const tcDetail     = document.getElementById('tc-detail');
const progressFill = document.getElementById('timer-progress-fill');
const btnStartRest = document.getElementById('btn-start-rest');
const btnNextSet   = document.getElementById('btn-next-set');
const btnMinus15   = document.getElementById('btn-minus15');
const btnPlus15    = document.getElementById('btn-plus15');

// -- Helpers -----------------------------------------------
function setProgress(pct, color){
  progressFill.style.width = Math.max(0,Math.min(100,pct)) + '%';
  if(color) progressFill.style.background = color;
}
function setCountdown(val, cls){
  if(typeof val === 'number'){
    const m = Math.floor(Math.abs(val)/60);
    const s = Math.abs(val)%60;
    countdownEl.textContent = m + ':' + String(s).padStart(2,'0');
  } else {
    countdownEl.textContent = val;
  }
  countdownEl.className = cls || '';
}
function renderSetDots(){
  setDotsEl.innerHTML = '';
  const total = timerCfg?.totalSets || 1;
  for(let i=1;i<=total;i++){
    const d = document.createElement('div');
    d.className = 'set-dot' + (i<currentSet?' done':i===currentSet?' current':'');
    setDotsEl.appendChild(d);
  }
}
function updateSetDisplay(){
  setDisplay.textContent = `${currentSet} / ${timerCfg?.totalSets||1}`;
}
function setBtnStart(txt){ btnStartRest.textContent = txt; }
function showNudge(show){ btnMinus15.style.display=show?'':'none'; btnPlus15.style.display=show?'':'none'; }

// -- Core timer mechanics ----------------------------------
function stopTimer(){
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning  = false;
}
function startTick(fn){
  stopTimer();
  timerRunning  = true;
  // Anchor time for drift correction
  targetEndTime   = Date.now() + (timerSeconds * 1000);
  targetStartTime = Date.now();
  timerInterval = setInterval(fn, 250); // 250ms tick for smoother display
  ensureAudio();
}

// -- LOAD TIMER for a phase --------------------------------
function loadTimer(dayId, phaseId, exercises){
  stopTimer();
  timerCfg = getTimerConfig(dayId, phaseId);

  if(!timerCfg){
    timerPanel.classList.remove('expanded');
    timerPanel.classList.add('collapsed');
    document.getElementById('frame-viewport').style.bottom = 'var(--bot-h)';
    return;
  }
  window._inCooldown = (phaseId === 'cooldown');

  timerPanel.classList.remove('collapsed');
  timerPanel.classList.add('expanded');
  document.getElementById('frame-viewport').style.bottom = 'var(--bot-expanded)';

  currentSet = 1;

  // Context label
  if(exercises && exercises.length){
    const ex = exercises[0];
    tcName.textContent = exercises.length > 1
      ? exercises.map(e=>e.name).join(' + ')
      : ex.name;
    tcDetail.textContent = [ex.sets, ex.reps].filter(Boolean).join(' × ')
      + (ex.load ? ' · ' + ex.load : '');
  }

  renderSetDots();
  updateSetDisplay();

  if(timerCfg.type === 'circuit'){
    initCircuit();
  } else if(timerCfg.type === 'emom'){
    initEmom();
  } else if(timerCfg.type === 'bilateral'){
    initBilateral(timerCfg.hold, timerCfg.gap);
  } else if(timerCfg.type === 'reps_sides_rest'){
    initRepsSidesRest();
  } else if(timerCfg.type === 'selfpaced'){
    initSelfPaced();
  } else {
    initRest();
  }
}

// =========================================================
//  REPS + SIDES + REST  (rep-based unilateral, e.g. Floor Press)
//  Flow: RIGHT prompt → tap Done → LEFT prompt → tap Done → REST countdown
// =========================================================
function initRepsSidesRest(){
  window._rsr = 'right';  // right | left | rest
  cdLabel.textContent    = 'START — RIGHT SIDE';
  timerBadge.textContent = 'reps per side';
  setCountdown('RIGHT', '');
  setProgress(100, '#38C8FF');
  setBtnStart('✓  RIGHT done — switch to Left');
  showNudge(false);
  btnNextSet.textContent = 'Skip Rest →';
}

// =========================================================
//  REST timer
// =========================================================
function initRest(){
  timerSeconds = timerCfg.rest;
  timerTotal   = timerCfg.rest;
  cdLabel.textContent    = timerCfg.label || 'REST';
  timerBadge.textContent = 'countdown';
  setCountdown(timerCfg.rest, '');
  setProgress(100, 'var(--accent)');
  setBtnStart('▶  Start Rest');
  btnNextSet.textContent = 'Next Set →';
  showNudge(true);
}
function tickRest(){
  // V3: drift-corrected — calculate from wall clock, not tick count
  timerSeconds = Math.ceil((targetEndTime - Date.now()) / 1000);
  if(timerSeconds < 0) timerSeconds = 0;
  setCountdown(timerSeconds, timerSeconds<=3?'warning':'running');
  setProgress((timerSeconds/timerTotal)*100,
    timerSeconds<=5?'#FF5C38':'var(--accent)');
  if(timerSeconds<=3 && timerSeconds>0) sndCountdownWarning();
  if(timerSeconds<=0){
    stopTimer();
    sndRestComplete();
    setCountdown('GO!','done');
    setProgress(100,'#4ADE80');
    setBtnStart('▶  Start Rest');
  }
}

// =========================================================
//  BILATERAL timer  (hold each side)
// =========================================================
function initBilateral(hold, gap){
  bilateralHold  = hold || timerCfg.hold || 20;
  bilateralGap   = 5; // always 5s — enforced
  bilateralPhase = 'right';
  timerSeconds   = 0;
  timerTotal     = bilateralHold;
  cdLabel.textContent    = 'RIGHT SIDE — HOLD';
  timerBadge.textContent = 'bilateral';
  setCountdown(0,'');
  setProgress(0,'#38C8FF');
  setBtnStart('▶  Start Right Side');
  btnNextSet.textContent = 'Next Set →';
  showNudge(false);
}
function tickBilateral(){
  timerSeconds++;
  if(bilateralPhase==='right'){
    setCountdown(timerSeconds, 'running');
    setProgress((timerSeconds/bilateralHold)*100,'#38C8FF');
    cdLabel.textContent = `RIGHT SIDE — ${bilateralHold-timerSeconds}s left`;
    if(timerSeconds>=bilateralHold){
      stopTimer();
      sndSideTransition();
      bilateralPhase='gap'; timerSeconds=0; timerTotal=bilateralGap;
      cdLabel.textContent = `SWITCH SIDES — ${bilateralGap}s`;
      timerBadge.textContent = 'switching';
      setCountdown(bilateralGap,'warning');
      setProgress(100,'#FFC83E');
      setBtnStart('⏸  Switching...');
      startTick(tickBilateralGap);
    }
  }
}
function tickBilateralGap(){
  timerSeconds++;
  const rem = bilateralGap - timerSeconds;
  setCountdown(rem, 'warning');
  setProgress((rem/bilateralGap)*100,'#FFC83E');
  cdLabel.textContent = `SWITCH SIDES — ${rem}s`;
  if(rem<=0){
    stopTimer();
    sndLeftStart();
    bilateralPhase='left'; timerSeconds=0; timerTotal=bilateralHold;
    cdLabel.textContent = `LEFT SIDE — ${bilateralHold}s`;
    timerBadge.textContent = 'bilateral';
    setCountdown(0,'running');
    setProgress(0,'#A78BFA');
    setBtnStart('⏸  Pause');
    startTick(tickBilateralLeft);
  }
}
function tickBilateralLeft(){
  timerSeconds++;
  setCountdown(timerSeconds,'running');
  setProgress((timerSeconds/bilateralHold)*100,'#A78BFA');
  cdLabel.textContent = `LEFT SIDE — ${bilateralHold-timerSeconds}s left`;
  if(timerSeconds>=bilateralHold){
    stopTimer();
    sndHoldComplete();
    bilateralPhase='done';
    cdLabel.textContent = 'BOTH SIDES COMPLETE';
    timerBadge.textContent = 'done';
    setCountdown('✓','done');
    setProgress(100,'#4ADE80');
    setBtnStart('▶  Again');
  }
}

// =========================================================
//  CIRCUIT sequencer
// =========================================================
function initCircuit(){
  circuitStepIdx = 0;
  timerBadge.textContent = 'circuit';
  showNudge(false);

  if(timerCfg.roundOnly){
    // All reps — show single "Round done" button, no step-by-step
    const allNames = timerCfg.steps.map(s=>s.name).join(' → ');
    cdLabel.textContent    = timerCfg.label || 'CIRCUIT';
    timerBadge.textContent = 'all reps';
    setCountdown('GO!', 'running');
    setProgress(100, 'var(--accent)');
    setBtnStart('✓  Round Done → Start Rest');
    btnNextSet.textContent = 'Skip Rest →';
    tcName.textContent   = allNames;
    tcDetail.textContent = `Do all exercises back-to-back · tap when round complete`;
  } else {
    btnNextSet.textContent = 'Skip Step →';
    runCircuitStep();
  }
}

function runCircuitStep(){
  const steps = timerCfg.steps;
  if(!steps || circuitStepIdx >= steps.length){
    // All steps done — start round rest
    startCircuitRest();
    return;
  }
  const step = steps[circuitStepIdx];
  cdLabel.textContent = `Step ${circuitStepIdx+1}/${steps.length} — ${step.name}`;
  timerBadge.textContent = step.timer;

  // Update context panel with step name
  tcName.textContent = step.name;
  tcDetail.textContent = step.cue || '';

  if(step.timer === 'reps'){
    // No timer — show prompt, wait for tap
    circuitSubPhase = 'reps';
    setCountdown('GO', 'running');
    setProgress(100, 'var(--accent)');
    setBtnStart('✓  Done — Next Exercise');
    showNudge(false);

  } else if(step.timer === 'bilateral'){
    circuitSubPhase = 'bilateral_r';
    // Resolve hold time for current week phase
    const wm2 = getWM(currentWeek);
    const p2  = DELOAD_MAP[wm2.p] || wm2.p;
    bilateralHold = (step.holdByPhase && step.holdByPhase[p2]) || step.hold || 20;
    bilateralGap  = step.gap  || 5;
    timerSeconds  = 0;
    cdLabel.textContent = `${step.name} — RIGHT SIDE · ${bilateralHold}s`;
    setCountdown(0,'');
    setProgress(0,'#38C8FF');
    setBtnStart('▶  Start Right Side');

  } else if(step.timer === 'hold'){
    circuitSubPhase = 'hold';
    timerSeconds = 0;
    // Resolve hold time for current week phase
    const wm3 = getWM(currentWeek);
    const p3  = DELOAD_MAP[wm3.p] || wm3.p;
    timerTotal = (step.holdByPhase && step.holdByPhase[p3]) || step.hold || 20;
    cdLabel.textContent = `${step.name} — HOLD ${step.hold}s`;
    setCountdown(0,'');
    setProgress(0,'var(--accent)');
    setBtnStart(`▶  Start Hold ${step.hold}s`);

  } else if(step.timer === 'countdown'){
    circuitSubPhase = 'countdown';
    timerSeconds = step.hold || 30;
    timerTotal   = step.hold || 30;
    cdLabel.textContent = `${step.name} — ${step.hold}s`;
    setProgress(100,'#38C8FF');

    // First step of first round → manual start so user is ready
    // All subsequent steps → auto-start (density flow)
    const isFirstEver = (circuitStepIdx === 0 && currentSet === 1);
    if(isFirstEver){
      setCountdown(timerSeconds,'');
      setBtnStart(`▶  Start Workout`);
      showNudge(false);
    } else {
      setCountdown(timerSeconds,'running');
      setBtnStart('⏸  Pause');
      sndTimerStart();
      startTick(tickCircuitCountdown);
    }

  } else if(step.timer === 'reps' || step.timer === 'sides_reps'){
    circuitSubPhase = 'sides_r';
    cdLabel.textContent = `${step.name} — RIGHT SIDE`;
    setCountdown('RIGHT','running');
    setProgress(100,'#38C8FF');
    setBtnStart('✓  RIGHT done — switch');
    showNudge(false);
  }
}

function advanceCircuitStep(){
  circuitStepIdx++;
  stopTimer();
  runCircuitStep();
}

function startCircuitRest(){
  const rest = timerCfg.restAfterRound || 0;

  // Cooldown circuit completed — show Workout Done
  if(window._inCooldown && (rest === 0 || currentSet >= timerCfg.totalSets)){
    showWorkoutDone();
    return;
  }

  // No rest — skip straight to next round
  if(rest === 0){
    if(currentSet < timerCfg.totalSets){
      currentSet++;
      renderSetDots(); updateSetDisplay();
      circuitStepIdx = 0;
      runCircuitStep();
    } else {
      sndAllSetsDone();
      setCountdown('✓','done');
      cdLabel.textContent = 'COMPLETE!';
      setProgress(100,'#4ADE80');
      setDisplay.textContent = 'Done! ✓';
      markBlockDone();
    }
    return;
  }

  timerSeconds = rest;
  timerTotal   = rest;
  circuitSubPhase = 'rest';

  // Density circuits (short rest ≤20s) auto-advance without user tap
  const autoAdvance = rest <= 20;

  cdLabel.textContent    = autoAdvance
    ? `REST ${rest}s — next up: ${timerCfg.steps?.[0]?.name || ''}`
    : `REST — Round ${currentSet} complete`;
  timerBadge.textContent = autoAdvance ? 'auto' : 'rest';
  tcName.textContent     = timerCfg.label || 'Circuit';
  tcDetail.textContent   = `${currentSet} / ${timerCfg.totalSets} rounds done`;
  setCountdown(rest, '');
  setProgress(100, '#FF5C38');  // red for short auto-rest
  showNudge(false);

  if(autoAdvance){
    // No pause button — just counts down and fires
    setBtnStart('⏸  Auto-advancing...');
    btnNextSet.textContent = 'Skip Rest →';
  } else {
    setBtnStart('⏸  Pause Rest');
    showNudge(true);
    sndRestComplete();
  }

  startTick(autoAdvance ? tickDensityRest : tickCircuitRest);
}

// Auto-advancing rest for density circuits (15s)
function tickDensityRest(){
  timerSeconds = Math.ceil((targetEndTime - Date.now()) / 1000);
  if(timerSeconds < 0) timerSeconds = 0;
  setCountdown(timerSeconds, timerSeconds<=3?'warning':'running');
  setProgress((timerSeconds/timerTotal)*100, timerSeconds<=5?'#FF5C38':'#FFC83E');
  if(timerSeconds<=3 && timerSeconds>0) sndCountdownWarning();
  if(timerSeconds<=0){
    stopTimer();
    if(currentSet < timerCfg.totalSets){
      sndTimerStart();
      currentSet++;
      renderSetDots(); updateSetDisplay();
      circuitStepIdx = 0;
      runCircuitStep();  // auto-starts next countdown
    } else {
      sndAllSetsDone();
      setCountdown('✓','done');
      cdLabel.textContent = 'ALL ROUNDS COMPLETE!';
      setProgress(100,'#4ADE80');
      setDisplay.textContent = 'Done! ✓';
      markBlockDone();
    }
  }
}

function tickCircuitRest(){
  timerSeconds = Math.ceil((targetEndTime - Date.now()) / 1000);
  if(timerSeconds < 0) timerSeconds = 0;
  setCountdown(timerSeconds, timerSeconds<=3?'warning':'running');
  setProgress((timerSeconds/timerTotal)*100,
    timerSeconds<=5?'#FF5C38':'var(--accent)');
  if(timerSeconds<=3 && timerSeconds>0) sndCountdownWarning();
  if(timerSeconds<=0){
    stopTimer();
    if(currentSet < timerCfg.totalSets){
      sndTimerStart();
      currentSet++;
      renderSetDots(); updateSetDisplay();
      circuitStepIdx = 0;
      if(timerCfg.roundOnly){
        cdLabel.textContent    = timerCfg.label || 'CIRCUIT';
        timerBadge.textContent = 'all reps';
        setCountdown('GO!','running');
        setProgress(100,'var(--accent)');
        setBtnStart('✓  Round Done → Start Rest');
        circuitSubPhase = 'idle';
        showNudge(false);
      } else {
        runCircuitStep();
      }
    } else {
      sndAllSetsDone();
      setCountdown('✓','done');
      cdLabel.textContent = 'ALL ROUNDS COMPLETE!';
      markBlockDone();
      setProgress(100,'#4ADE80');
      setDisplay.textContent = 'Done! ✓';
    }
  }
}

// Bilateral inside circuit
function tickCircuitBilateralR(){
  timerSeconds++;
  const step = timerCfg.steps[circuitStepIdx];
  setCountdown(timerSeconds,'running');
  setProgress((timerSeconds/bilateralHold)*100,'#38C8FF');
  cdLabel.textContent = `${step.name} — RIGHT · ${bilateralHold-timerSeconds}s`;
  if(timerSeconds>=bilateralHold){
    stopTimer();
    sndSideTransition();
    circuitSubPhase='gap_l';
    timerSeconds=0;
    cdLabel.textContent = `SWITCH — ${bilateralGap}s`;
    setCountdown(bilateralGap,'warning');
    setProgress(100,'#FFC83E');
    setBtnStart('⏸  Switching...');
    startTick(tickCircuitGapL);
  }
}
function tickCircuitGapL(){
  timerSeconds++;
  const rem = bilateralGap - timerSeconds;
  setCountdown(rem,'warning');
  setProgress((rem/bilateralGap)*100,'#FFC83E');
  if(rem<=0){
    stopTimer();
    sndLeftStart();
    circuitSubPhase='bilateral_l'; timerSeconds=0;
    const step = timerCfg.steps[circuitStepIdx];
    cdLabel.textContent = `${step.name} — LEFT · ${bilateralHold}s`;
    setCountdown(0,'running');
    setProgress(0,'#A78BFA');
    setBtnStart('⏸  Pause');
    startTick(tickCircuitBilateralL);
  }
}
function tickCircuitBilateralL(){
  timerSeconds++;
  const step = timerCfg.steps[circuitStepIdx];
  setCountdown(timerSeconds,'running');
  setProgress((timerSeconds/bilateralHold)*100,'#A78BFA');
  cdLabel.textContent = `${step.name} — LEFT · ${bilateralHold-timerSeconds}s`;
  if(timerSeconds>=bilateralHold){
    stopTimer();
    sndHoldComplete();
    advanceCircuitStep();
  }
}

// Hold inside circuit
function tickCircuitHold(){
  timerSeconds++;
  const step = timerCfg.steps[circuitStepIdx];
  setCountdown(timerSeconds,'running');
  setProgress((timerSeconds/timerTotal)*100,'var(--accent)');
  cdLabel.textContent = `${step.name} — ${timerTotal-timerSeconds}s left`;
  if(timerSeconds>=timerTotal){
    stopTimer();
    sndHoldComplete();
    advanceCircuitStep();
  }
}

// Countdown inside circuit (density work) — auto-advances
function tickCircuitCountdown(){
  timerSeconds = Math.ceil((targetEndTime - Date.now()) / 1000);
  if(timerSeconds < 0) timerSeconds = 0;
  const step = timerCfg.steps[circuitStepIdx];
  setCountdown(timerSeconds, timerSeconds<=3?'warning':'running');
  setProgress((timerSeconds/timerTotal)*100,
    timerSeconds<=5?'#FF5C38':'#38C8FF');
  cdLabel.textContent = `${step.name} — ${timerSeconds}s left`;
  if(timerSeconds<=3 && timerSeconds>0) sndCountdownWarning();
  if(timerSeconds<=0){
    stopTimer();
    sndSetComplete();
    // Density: auto-advance to next step (no tap needed)
    advanceCircuitStep();
  }
}

// Sides gap inside circuit
function tickCircuitSidesGap(){
  timerSeconds++;
  const step = timerCfg.steps[circuitStepIdx];
  const gap = step.gap || 15;
  const rem = gap - timerSeconds;
  setCountdown(rem,'warning');
  setProgress((rem/gap)*100,'#FFC83E');
  cdLabel.textContent = `${step.name} — switching ${rem}s`;
  if(rem<=0){
    stopTimer();
    sndLeftStart();
    circuitSubPhase='sides_l';
    setCountdown('LEFT','running');
    setProgress(100,'#A78BFA');
    cdLabel.textContent = `${step.name} — LEFT SIDE`;
    setBtnStart('✓  LEFT done — next');
  }
}

// =========================================================
//  EMOM timer
// =========================================================
function initEmom(){
  emomSeconds = 60;
  emomRound   = 1;
  cdLabel.textContent    = `EMOM · Round ${emomRound} / ${timerCfg.emomMin}`;
  timerBadge.textContent = 'every minute';
  setCountdown(60,'');
  setProgress(100,'var(--accent)');
  setBtnStart('▶  Start EMOM');
  showNudge(false);
  btnNextSet.textContent = 'End EMOM';
}
function tickEmom(){
  emomSeconds = Math.ceil((targetEndTime - Date.now()) / 1000);
  if(emomSeconds < 0) emomSeconds = 0;
  setCountdown(emomSeconds, emomSeconds<=3?'warning':'running');
  setProgress((emomSeconds/60)*100,'var(--accent)');
  cdLabel.textContent = `EMOM · Round ${emomRound} / ${timerCfg.emomMin}`;
  if(emomSeconds<=3 && emomSeconds>0) sndCountdownWarning();
  if(emomSeconds<=0){
    sndEmomRound();
    emomRound++;
    if(emomRound > timerCfg.emomMin){
      stopTimer();
      sndEmomComplete();
      cdLabel.textContent = 'EMOM COMPLETE!';
      setCountdown('✓','done');
      setProgress(100,'#4ADE80');
    } else {
      emomSeconds  = 60;
      targetEndTime = Date.now() + 60000;
    }
  }
}

// =========================================================
//  SIDES timer (top-level, for Tue Block A / Fri Block A)
// =========================================================
function initSides(){
  cdLabel.textContent    = '▶  RIGHT SIDE';
  timerBadge.textContent = 'reps per side';
  setCountdown('RIGHT','');
  setProgress(100,'#38C8FF');
  setBtnStart('✓  RIGHT done → gap');
  showNudge(false);
  window._sidesPhase = 'right';
}

// =========================================================
//  SELF-PACED
// =========================================================
function initSelfPaced(){
  cdLabel.textContent    = timerCfg.label || 'SELF-PACED';
  timerBadge.textContent = 'self-paced';
  setCountdown('—', '');
  setProgress(100, 'rgba(255,255,255,0.1)');
  setBtnStart('✓  Done — Block Complete');
  btnNextSet.textContent = 'Skip →';
  btnNextSet.style.display = 'none';   // hide skip — only one "set"
  btnMinus15.style.display = 'none';
  btnPlus15.style.display  = 'none';
}

// =========================================================
//  START BUTTON — routes based on current state
// =========================================================
// ── Named tick functions (replaced arguments.callee) ──────

function tickStepRest(){
  timerSeconds = Math.ceil((targetEndTime - Date.now()) / 1000);
  if(timerSeconds < 0) timerSeconds = 0;
  setCountdown(timerSeconds, timerSeconds<=3?'warning':'running');
  setProgress((timerSeconds/timerTotal)*100, timerSeconds<=5?'#FF5C38':'var(--accent)');
  if(timerSeconds<=3 && timerSeconds>0) sndCountdownWarning();
  if(timerSeconds<=0){ stopTimer(); sndRestComplete(); advanceCircuitStep(); }
}

function tickSidesRest(){
  timerSeconds--;
  const rem = timerTotal - timerSeconds;
  setCountdown(rem, rem<=3?'warning':'running');
  setProgress((rem/timerTotal)*100, rem<=5?'#FF5C38':'var(--accent)');
  if(rem<=3 && rem>0) sndCountdownWarning();
  if(rem<=0){
    stopTimer();
    if(window._rsr === 'rest'){
      // reps_sides_rest: advance set after rest
      sndTimerStart();
      if(currentSet < timerCfg.totalSets){
        currentSet++; renderSetDots(); updateSetDisplay();
      } else {
        sndAllSetsDone(); setDisplay.textContent='Done! ✓';
        cdLabel.textContent='ALL SETS COMPLETE!'; markBlockDone();
        setProgress(100,'#4ADE80'); return;
      }
      window._rsr='right';
      cdLabel.textContent='START — RIGHT SIDE'; timerBadge.textContent='reps per side';
      setCountdown('RIGHT',''); setProgress(100,'#38C8FF');
      setBtnStart('✓  RIGHT done — switch to Left'); showNudge(false);
    } else {
      // sides top-level rest complete
      sndRestComplete();
      window._sidesPhase='right';
      cdLabel.textContent='▶  RIGHT SIDE'; timerBadge.textContent='reps per side';
      setCountdown('RIGHT',''); setProgress(100,'#38C8FF');
      setBtnStart('✓  RIGHT done → gap'); showNudge(false);
    }
  }
}

function tickSidesGap(){
  timerSeconds++;
  const rem = timerTotal - timerSeconds;
  setCountdown(rem,'warning');
  setProgress((rem/timerTotal)*100,'#FFC83E');
  cdLabel.textContent = `SWITCH TO LEFT — ${rem}s`;
  if(rem<=0){
    stopTimer(); sndLeftStart();
    window._sidesPhase='left';
    setCountdown('LEFT','running'); setProgress(100,'#A78BFA');
    cdLabel.textContent='▶  LEFT SIDE'; timerBadge.textContent='reps per side';
    setBtnStart('✓  LEFT done → rest');
  }
}

btnStartRest.addEventListener('click', ()=>{
  ensureAudio();
  const type = timerCfg?.type;

  // ── CIRCUIT ────────────────────────────────────────────
  if(type === 'circuit'){

    // roundOnly: single button starts rest directly
    if(timerCfg.roundOnly && circuitSubPhase !== 'rest'){
      sndSetComplete();
      startCircuitRest();
      return;
    }

    const step = timerCfg.steps?.[circuitStepIdx];

    if(circuitSubPhase === 'reps'){
      // Check if this step has a specific rest (e.g. Scapular Pull-Up 20s)
      const stepRest = timerCfg.stepRests?.[circuitStepIdx];
      if(stepRest && stepRest > 0){
        sndTimerStart();
        // Run a mini rest countdown before advancing to next step
        circuitSubPhase = 'step_rest';
        timerSeconds = stepRest;
        timerTotal   = stepRest;
        cdLabel.textContent    = `REST — ${step.name} · ${stepRest}s`;
        timerBadge.textContent = 'step rest';
        setCountdown(stepRest, '');
        setProgress(100, 'var(--accent)');
        setBtnStart('⏸  Pause');
        showNudge(false);
        startTick(tickStepRest);
      } else {
        sndSetComplete();
        advanceCircuitStep();
      }

    } else if(circuitSubPhase === 'step_rest'){
      if(timerRunning){ stopTimer(); sndTimerPause(); setBtnStart('▶  Resume Rest'); }
      else { startTick(tickStepRest); setBtnStart('⏸  Pause'); }

    } else if(circuitSubPhase === 'bilateral_r'){
      if(timerRunning){ stopTimer(); sndTimerPause(); setBtnStart('▶  Resume Right'); }
      else { startTick(tickCircuitBilateralR); setBtnStart('⏸  Pause'); }

    } else if(circuitSubPhase === 'bilateral_l'){
      if(timerRunning){ stopTimer(); sndTimerPause(); setBtnStart('▶  Resume Left'); }
      else { startTick(tickCircuitBilateralL); setBtnStart('⏸  Pause'); }

    } else if(circuitSubPhase === 'hold'){
      if(timerRunning){ stopTimer(); sndTimerPause(); setBtnStart(`▶  Resume Hold`); }
      else { startTick(tickCircuitHold); setBtnStart('⏸  Pause Hold'); }

    } else if(circuitSubPhase === 'countdown'){
      if(timerRunning){
        // Pause
        stopTimer();
        sndTimerPause();
        setBtnStart('▶  Resume');
      } else {
        // Start or Resume
        sndTimerStart();
        setCountdown(timerSeconds,'running');
        startTick(tickCircuitCountdown);
        setBtnStart('⏸  Pause');
      }

    } else if(circuitSubPhase === 'sides_r'){
      // Right reps done → start gap or go straight to left
      sndSideTransition();
      const gap = step?.gap || 0;
      if(gap > 0){
        circuitSubPhase='sides_gap'; timerSeconds=0;
        cdLabel.textContent = `${step.name} — switching ${gap}s`;
        setCountdown(gap,'warning');
        setProgress(100,'#FFC83E');
        setBtnStart('⏸  Switching...');
        startTick(tickCircuitSidesGap);
      } else {
        circuitSubPhase='sides_l';
        setCountdown('LEFT','running');
        setProgress(100,'#A78BFA');
        cdLabel.textContent = `${step.name} — LEFT SIDE`;
        setBtnStart('✓  LEFT done — next');
      }

    } else if(circuitSubPhase === 'sides_l'){
      sndSetComplete();
      advanceCircuitStep();

    } else if(circuitSubPhase === 'rest'){
      if(timerRunning){
        stopTimer();
        sndTimerPause();
        setBtnStart('▶  Resume Rest');
      } else {
        startTick(timerCfg.restAfterRound <= 20 ? tickDensityRest : tickCircuitRest);
        setBtnStart('⏸  Pause Rest');
      }
    }
    return;
  }

  // ── REPS SIDES REST (e.g. Floor Press) ────────────────
  if(type === 'reps_sides_rest'){
    const rsr = window._rsr;
    if(rsr === 'right'){
      sndSideTransition();
      window._rsr = 'left';
      cdLabel.textContent = 'NOW — LEFT SIDE';
      timerBadge.textContent = 'reps per side';
      setCountdown('LEFT','running');
      setProgress(100,'#A78BFA');
      setBtnStart('✓  LEFT done — start REST');
    } else if(rsr === 'left'){
      // Both sides done — start rest countdown
      sndRestComplete();
      window._rsr = 'rest';
      timerSeconds = timerCfg.rest || 60;
      timerTotal   = timerSeconds;
      cdLabel.textContent = timerCfg.label || 'REST';
      timerBadge.textContent = 'rest countdown';
      setCountdown(timerSeconds,'');
      setProgress(100,'var(--accent)');
      setBtnStart('⏸  Pause Rest');
      showNudge(true);
      startTick(tickSidesRest);
    } else if(rsr === 'rest'){
      if(timerRunning){ stopTimer(); sndTimerPause(); setBtnStart('▶  Resume Rest'); }
      else { startTick(tickSidesRest); setBtnStart('⏸  Pause Rest'); }
    }
    return;
  }

  // ── REST ───────────────────────────────────────────────
  if(type === 'rest'){
    if(timerRunning){ stopTimer(); sndTimerPause(); setBtnStart('▶  Resume Rest'); }
    else { sndTimerStart(); startTick(tickRest); setBtnStart('⏸  Pause Rest'); }
    return;
  }

  // ── BILATERAL ──────────────────────────────────────────
  if(type === 'bilateral'){
    if(bilateralPhase==='done'){ initBilateral(timerCfg.hold,timerCfg.gap); return; }
    if(bilateralPhase==='right'){
      if(timerRunning){ stopTimer(); sndTimerPause(); setBtnStart('▶  Resume Right'); }
      else { sndTimerStart(); startTick(tickBilateral); setBtnStart('⏸  Pause Right'); }
    } else if(bilateralPhase==='left'){
      if(timerRunning){ stopTimer(); sndTimerPause(); setBtnStart('▶  Resume Left'); }
      else { startTick(tickBilateralLeft); setBtnStart('⏸  Pause Left'); }
    }
    return;
  }

  // ── EMOM ───────────────────────────────────────────────
  if(type === 'emom'){
    if(timerRunning){ stopTimer(); sndTimerPause(); setBtnStart('▶  Resume EMOM'); }
    else { sndTimerStart(); startTick(tickEmom); setBtnStart('⏸  Pause EMOM'); }
    return;
  }

  // ── SIDES top-level ────────────────────────────────────
  if(type === 'sides'){
    const sp = window._sidesPhase;
    if(sp === 'right'){
      sndSideTransition();
      window._sidesPhase = 'gap';
      timerSeconds = 0;
      const sideRest = timerCfg.sideRest || 30;
      timerTotal = sideRest;
      cdLabel.textContent = `SWITCH TO LEFT — ${sideRest}s`;
      setCountdown(sideRest,'warning');
      setProgress(100,'#FFC83E');
      timerBadge.textContent = 'side gap';
      setBtnStart('⏸  Pause gap');
      startTick(tickSidesGap);
    } else if(sp === 'gap'){
      if(timerRunning){ stopTimer(); setBtnStart('▶  Resume gap'); }
      else { startTick(tickSidesGap); setBtnStart('⏸  Pause gap'); }
    } else if(sp === 'left'){
      sndSideTransition();
      window._sidesPhase = 'rest';
      timerSeconds = 0;
      timerTotal = timerCfg.rest || 60;
      cdLabel.textContent = timerCfg.label || 'REST';
      timerBadge.textContent = 'rest';
      setCountdown(timerTotal,'');
      setProgress(100,'var(--accent)');
      setBtnStart('⏸  Pause Rest');
      showNudge(true);
      startTick(tickSidesRest);
    } else if(sp === 'rest'){
      if(timerRunning){ stopTimer(); sndTimerPause(); setBtnStart('▶  Resume Rest'); showNudge(false); }
    }
    return;
  }

  // ── SELF-PACED (TGU) ───────────────────────────────────
  if(type === 'selfpaced'){
    sndAllSetsDone();
    setCountdown('✓', 'done');
    cdLabel.textContent = 'DONE';
    setProgress(100, '#4ADE80');
    setDisplay.textContent = 'Done! ✓';
    markBlockDone();
    return;
  }
});

// ── NEXT SET button ────────────────────────────────────────
btnNextSet.addEventListener('click', ()=>{
  stopTimer();
  const total = timerCfg?.totalSets || 1;

  if(timerCfg?.type === 'circuit'){
    // Circuit: Next Set = skip current step (emergency override)
    if(circuitSubPhase !== 'rest'){
      sndSetComplete();
      advanceCircuitStep();
    } else {
      // In rest: skip rest, start next round
      stopTimer();
      if(currentSet < total){
        sndTimerStart();
        currentSet++;
        renderSetDots(); updateSetDisplay();
        circuitStepIdx = 0;
        runCircuitStep();
      } else {
        sndAllSetsDone();
        setCountdown('✓','done');
        cdLabel.textContent = 'ALL ROUNDS COMPLETE!';
      markBlockDone();
        setDisplay.textContent = 'Done! ✓';
        setProgress(100,'#4ADE80');
      }
    }
    return;
  }

  if(currentSet < total){
    sndSetComplete();
    currentSet++;
    renderSetDots();
    updateSetDisplay();
    if(timerCfg?.type==='bilateral') initBilateral(timerCfg.hold, timerCfg.gap);
    else if(timerCfg?.type==='sides') initSides();
    else if(timerCfg?.type==='emom') initEmom();
    else { timerSeconds=timerCfg?.rest||60; timerTotal=timerSeconds; setCountdown(timerSeconds,''); setProgress(100,'var(--accent)'); setBtnStart('▶  Start Rest'); }
  } else {
    sndAllSetsDone();
    setDisplay.textContent = 'Done! ✓';
    setCountdown('✓','done');
    cdLabel.textContent = 'ALL SETS COMPLETE!';
      markBlockDone();
    setProgress(100,'#4ADE80');
  }
});

// ── NUDGE buttons ──────────────────────────────────────────
btnMinus15.addEventListener('click', ()=>{
  timerSeconds = Math.max(5, timerSeconds - 15);
  timerTotal   = Math.max(5, timerTotal - 15);
  setCountdown(timerSeconds,'');
  setProgress((timerSeconds/timerTotal)*100,'var(--accent)');
});
btnPlus15.addEventListener('click', ()=>{
  timerSeconds += 15;
  timerTotal   += 15;
  setCountdown(timerSeconds,'');
  setProgress((timerSeconds/timerTotal)*100,'var(--accent)');
});

// -- Load timer for current phase -------------------------

// -- Hook into showPhase to load timer --------------------
const _origShowPhase = showPhase;
showPhase = function(idx){
  _origShowPhase(idx);
  if(!currentDay || currentDay.rest) return;
  const pd = PHASE_DEFS.filter(p => {
    const ex = getPhaseExercises(currentDay, p.id);
    return ex && ex.length > 0;
  })[idx];
  if(pd){
    const exercises = getPhaseExercises(currentDay, pd.id) || [];
    loadTimer(currentDay.id, pd.id, exercises);
  }
};

// -- Also hook loadDay to collapse timer on day change -----
const _origLoadDay = loadDay;
loadDay = function(dayId){
  stopTimer();
  timerPanel.classList.remove('expanded');
  timerPanel.classList.add('collapsed');
  document.getElementById('frame-viewport').style.bottom = 'var(--bot-h)';
  _origLoadDay(dayId);
};

// ===========================================================
//  STATE PERSISTENCE  (saves week + last day across sessions)
// ===========================================================
// ===========================================================
