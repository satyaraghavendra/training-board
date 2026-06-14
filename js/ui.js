// ===========================================================
//  ui.js — DOM rendering, navigation, video management,
//          workout-done overlay
//  Depends on: data.js, audio.js
// ===========================================================
function getWM(w){ const d=getActiveData(); return d.WEEK_META[Math.min(w,d.maxWeek)-1]; }
function getPhaseCode(w){
  const wm = getWM(w);
  return DELOAD_MAP[wm.p] ? wm.p : wm.p; // return as-is; data lookup resolves deload
}

function updateWeekBanner(){
  const d  = getActiveData();
  const wm = getWM(currentWeek);
  const phaseName = PHASE_NAMES[wm.p] || wm.name || wm.p;
  const banner = document.getElementById('week-banner');
  banner.style.background = wm.bg;
  banner.style.borderBottomColor = wm.color;
  banner.style.setProperty('--phase-color', wm.color);
  document.getElementById('wb-dot').style.background = wm.color;
  document.getElementById('wb-phase').style.color = wm.color;
  document.getElementById('wb-phase').textContent = phaseName;
  document.getElementById('wb-desc').textContent = `Wk ${currentWeek} of ${d.maxWeek}  ·  ${wm.desc}`;
  document.getElementById('wb-desc').textContent = `Wk ${currentWeek} of ${d.maxWeek}  ·  ${wm.desc}`;
  document.getElementById('week-num').textContent = `Wk ${currentWeek}`;
  if(currentDay) loadDay(currentDay.id);
}

// week picker handled in BOOT section below

// ===========================================================
//  GET EXERCISES FOR CURRENT WEEK
// ===========================================================
function getPhaseExercises(day, blockId){
  const d = getActiveData();
  const wm = getWM(currentWeek);
  const basePhase = d.DELOAD_MAP[wm.p] || wm.p;
  const dayPhases = day.phases;
  if(!dayPhases) return null;
  const phaseData = dayPhases[basePhase];
  if(!phaseData) return null;
  return phaseData[blockId] || null;
}

// ===========================================================
//  GRID LAYOUT
//  n=1 → full screen
//  n=2 → 2 equal columns
//  n=3 → 3 equal columns
//  n=4 → 2×2
//  n=5 → 3-top / 2-bottom  (uses named grid areas)
//  n=6 → 3×2
// ===========================================================
function getGridCols(n){
  if(n===1) return '1fr';
  if(n===2) return '1fr 1fr';
  if(n===3) return '1fr 1fr 1fr';
  if(n===4) return '1fr 1fr';
  if(n===5) return '1fr 1fr 1fr'; // 3 top, then 2 bottom centred
  return '1fr 1fr 1fr'; // 6 → 3×2
}
function getGridRows(n){
  if(n<=3) return '1fr';
  if(n===4) return '1fr 1fr';
  if(n===5) return '1fr 1fr';
  return '1fr 1fr'; // 6
}

// For n=5: last 2 cells span to centre them in a 3-col grid
// cell 4 → col 1 (offset by empty col before it)  col-start:1, col-end:2
// We do this by injecting a CSS class on the grid when n===5
function applyFiveLayout(grid){
  grid.classList.add('five-layout');
  grid.style.gridTemplateColumns = 'repeat(6, 1fr)';
  grid.style.gridTemplateRows    = '1fr 1fr';
  return grid;
}
function applyFiveCellSpans(cells){
  // top row: 3 cells, each span 2 of 6 cols
  cells[0].style.gridColumn = 'span 2';
  cells[1].style.gridColumn = 'span 2';
  cells[2].style.gridColumn = 'span 2';
  // bottom row: 2 cells, each span 3 of 6 cols → fills full width, centred
  cells[3].style.gridColumn = 'span 3';
  cells[4].style.gridColumn = 'span 3';
}

// ===========================================================
//  BUILD PHASE FRAME
// ===========================================================
function buildFrame(exArr, blockId, startNum){
  const frame = document.createElement('div');
  frame.className = 'phase-frame';
  const color = PC[blockId] || '#C8FF3E';
  const n = exArr.length;

  const grid = document.createElement('div');
  grid.className = 'ex-grid';
  // n=5 layout handled after cells built; others set now
  if(n !== 5){
    grid.style.gridTemplateColumns = getGridCols(n);
    grid.style.gridTemplateRows    = getGridRows(n);
  }
  frame.appendChild(grid);

  const builtCells = [];

  exArr.forEach((ex, i) => {
    const cell = document.createElement('div');
    cell.className = 'vcell';
    builtCells.push(cell);

    // Number badge
    const nb = document.createElement('div');
    nb.className = 'order-badge';
    nb.style.background = color;
    nb.textContent = startNum + i;
    cell.appendChild(nb);

    // Video or placeholder
    if(ex.path && ex.path.trim() !== ''){
      // Background layer — blurred fill (hides black bars)
      const bgVid = document.createElement('video');
      bgVid.dataset.src = ex.path; bgVid.muted = true; bgVid.loop = true;
      bgVid.playsInline = true; bgVid.preload = 'none';
      bgVid.className = 'bg-blur';
      bgVid.setAttribute('tabindex','-1');
      cell.appendChild(bgVid);

      // Main layer — contained, always shows full frame
      const vid = document.createElement('video');
      vid.dataset.src = ex.path; vid.muted = true; vid.loop = true;
      vid.playsInline = true; vid.preload = 'none';
      vid.className = 'main-vid';
      cell.appendChild(vid);
    } else {
      const ph = document.createElement('div');
      ph.className = 'vcell-placeholder';
      ph.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><polygon points="5 3 19 12 5 21 5 3"/></svg><div class="ph-name">${ex.name}</div>`;
      cell.appendChild(ph);
    }

    // HUD
    const hud = document.createElement('div');
    hud.className = 'vcell-hud';
    const hc  = document.createElement('div');
    hc.className = 'hud-content';

    const setsReps = [ex.sets, ex.reps].filter(Boolean).join(' · ');
    const wm = getWM(currentWeek);
    const isDeload = !!DELOAD_MAP[wm.p];

    hc.innerHTML = `
      <div class="hud-name">${ex.name}</div>
      <div class="hud-chips">
        ${setsReps ? `<span class="hud-chip" style="background:${color}">${setsReps}</span>` : ''}
        ${ex.load  ? `<span class="hud-chip weight">${ex.load}</span>` : ''}
        ${ex.rest  ? `<span class="hud-chip rest">Rest ${ex.rest}</span>` : ''}
      </div>
      ${isDeload ? `<div class="hud-intensity"><span class="int-chip">⚡ Deload — ${PHASE_NAMES[wm.p]}: keep loads, reduce volume</span></div>` : ''}
      ${ex.note  ? `<div class="hud-note">${ex.note}</div>` : ''}
    `;
    hud.appendChild(hc);
    cell.appendChild(hud);
    grid.appendChild(cell);
  });

  // Apply 5-cell layout AFTER all cells are in the DOM
  if(n === 5){
    applyFiveLayout(grid);
    applyFiveCellSpans(builtCells);
  }

  return frame;
}

// ===========================================================
//  LOAD DAY
// ===========================================================
function loadDay(dayId){
  stopAllVideos();
  document.getElementById('frame-viewport').innerHTML = '';
  document.getElementById('phase-tabs').innerHTML     = '';
  document.getElementById('phase-progress').innerHTML = '';
  phaseFrames = []; phaseIdx = 0;

  const day = getActiveData().DAYS.find(d => d.id === dayId);
  if(!day) return;
  currentDay = day;

  document.querySelectorAll('.day-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.dayId === dayId));
  document.getElementById('bar-workout').textContent = day.name;

  if(day.rest){
    const vp = document.getElementById('frame-viewport');
    const rf = document.createElement('div');
    rf.className = 'phase-frame visible';
    rf.innerHTML = `<div class="rest-screen">
      <div class="rest-big">Rest</div>
      <div class="rest-msg">${(day.restMessage||'').replace(/\n/g,'<br>')}</div>
    </div>`;
    vp.appendChild(rf);
    phaseFrames = [rf];
    document.getElementById('btn-prev').disabled = true;
    document.getElementById('btn-next').disabled = true;
    return;
  }

  const vp  = document.getElementById('frame-viewport');
  const ptEl = document.getElementById('phase-tabs');
  const ppEl = document.getElementById('phase-progress');
  let exNum = 1;

  PHASE_DEFS.forEach((pd, i) => {
    const exArr = getPhaseExercises(day, pd.id);
    if(!exArr || exArr.length === 0) return;

    const color = PC[pd.id] || '#C8FF3E';

    // Tab
    const tab = document.createElement('button');
    tab.className = 'phase-tab';
    tab.dataset.pid = pd.id;
    tab.textContent = pd.label;
    tab.style.setProperty('--c', color);
    const fi = phaseFrames.length;
    tab.addEventListener('click', () => showPhase(fi));
    ptEl.appendChild(tab);

    // Pill
    const pill = document.createElement('div');
    pill.className = 'pp-pill';
    pill.style.width = '16px';
    const pi = phaseFrames.length;
    pill.addEventListener('click', () => showPhase(pi));
    ppEl.appendChild(pill);

    // Frame — always start numbering from 1 per block
    const frame = buildFrame(exArr, pd.id, 1);
    vp.appendChild(frame);
    phaseFrames.push(frame);
  });

  showPhase(0);
}

// ===========================================================
//  SHOW PHASE
// ===========================================================
function showPhase(idx){
  if(idx < 0 || idx >= phaseFrames.length) return;
  const prev = phaseIdx; phaseIdx = idx;

  if(prev !== idx){
    const old = phaseFrames[prev];
    old.classList.remove('visible');
    old.classList.add('leaving');
    setTimeout(() => {
      old.classList.remove('leaving');
      unloadFrameVids(old);   // Release decode memory after animation
    }, 220);
  }

  const el = phaseFrames[idx];
  el.classList.add('visible','entering');
  setTimeout(() => el.classList.remove('entering'), 280);

  // Clear any next-up highlights, restore normal tab states
  document.querySelectorAll('.phase-tab').forEach((t,i) => {
    t.classList.remove('next-up');
    t.classList.toggle('active', i===idx);
  });
  document.querySelectorAll('.pp-pill').forEach((p,i) => {
    p.classList.remove('block-done');
    p.classList.toggle('active', i===idx);
    p.classList.toggle('done', i<idx);
  });

  // Reset Next button style
  const btnNext = document.getElementById('btn-next');
  if(btnNext){
    btnNext.style.background = '';
    btnNext.style.borderColor = '';
    btnNext.style.color = '';
    btnNext.textContent = 'Next';
  }
  // Restore any hidden timer buttons
  btnNextSet.style.display = '';

  document.getElementById('btn-prev').disabled = idx === 0;
  btnNext.disabled = idx === phaseFrames.length-1;
  playFrameVids(el);
}

// ===========================================================
//  VIDEO
// ===========================================================
function stopAllVideos(){ document.querySelectorAll('video').forEach(v=>v.pause()); }

function playFrameVids(f){
  // Pause all other videos first
  stopAllVideos();
  // Hydrate src from data-src and play
  f.querySelectorAll('.vcell').forEach(cell => {
    cell.querySelectorAll('video').forEach(v => {
      if(!v.src && v.dataset.src){
        v.src = v.dataset.src;
        v.load();
      }
      v.currentTime = 0;
      v.play().catch(()=>{});
    });
  });
}

function unloadFrameVids(f){
  f.querySelectorAll('video').forEach(v => {
    v.pause();
    v.removeAttribute('src');  // Strip source
    v.load();                  // Force browser to release decode buffer
  });
}

// ===========================================================
//  NAV
// ===========================================================
document.getElementById('btn-next').addEventListener('click', () => { sndPhaseChange(); showPhase(phaseIdx+1); });
document.getElementById('btn-prev').addEventListener('click', () => { sndPhaseChange(); showPhase(phaseIdx-1); });
document.addEventListener('keydown', e => {
  if(e.key==='ArrowRight'){ sndPhaseChange(); showPhase(phaseIdx+1); }
  if(e.key==='ArrowLeft') { sndPhaseChange(); showPhase(phaseIdx-1); }
  if(e.key==='ArrowDown'){
    const days = ['mon','tue','wed','thu','fri','sat','sun'];
    const cur = currentDay ? currentDay.id : 'mon';
    const idx = days.indexOf(cur);
    loadDay(days[(idx+1) % days.length]);
  }
  if(e.key==='ArrowUp'){
    const days = ['mon','tue','wed','thu','fri','sat','sun'];
    const cur = currentDay ? currentDay.id : 'mon';
    const idx = days.indexOf(cur);
    loadDay(days[(idx-1+days.length) % days.length]);
  }
});

// ===========================================================
//  DAY TABS
// ===========================================================
function buildDayTabs(){
  const { DAYS: days } = getActiveData();
  document.getElementById('day-tabs').innerHTML = '';
  days.forEach(day => {
    const t = document.createElement('button');
    t.className = 'day-tab' + (day.rest ? ' rest-day' : '');
    t.dataset.dayId = day.id;
    t.innerHTML = `<span class="dt-label">${day.label}</span><span class="dt-name">${day.name}</span>`;
    t.addEventListener('click', () => { loadDay(day.id); saveState(); });
    document.getElementById('day-tabs').appendChild(t);
  });
}
function getDefaultDay(){
  const map={0:'sun',1:'mon',2:'tue',3:'wed',4:'thu',5:'fri',6:'sat'};
  return map[new Date().getDay()]||'mon';
}

// ===========================================================
//  AUDIO ENGINE — loud, distinct, unmistakable sounds

// ===========================================================
//  STATE BACKUP — export / restore progress JSON
// ===========================================================
// ===========================================================
function backupState(){
  const data = localStorage.getItem('trainingboard_state');
  if(!data){ alert('No saved progress to export.'); return; }
  const blob = new Blob([data], { type:'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `kb-plan-backup-wk${currentWeek}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function restoreState(){
  const input = document.createElement('input');
  input.type   = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try{
        const parsed = JSON.parse(ev.target.result);
        // Validate it looks like our state
        if(typeof parsed.week !== 'number') throw new Error('Invalid backup file');
        localStorage.setItem('trainingboard_state', JSON.stringify(parsed));
        alert(`Restored: Week ${parsed.week}, ${(parsed.doneDays||[]).length} days completed.\nReloading...`);
        location.reload();
      }catch(err){
        alert('Could not restore: ' + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}



// ===========================================================
//  WORKOUT COMPLETE — overlay + day-done marking
// ===========================================================
// Mark current block as done, highlight next tab
function markBlockDone(){
  const tabs  = document.querySelectorAll('.phase-tab');
  const pills = document.querySelectorAll('.pp-pill');
  const isLast = phaseIdx === phaseFrames.length - 1;

  // Mark current tab done
  tabs.forEach((t,i)  => { if(i===phaseIdx){ t.classList.add('block-done'); t.classList.remove('active'); }});
  pills.forEach((p,i) => { if(i===phaseIdx) p.classList.add('block-done'); });

  if(isLast){
    // Last block (cooldown) — show workout done overlay
    showWorkoutDone();
  } else {
    // Point to next tab
    const nextIdx = phaseIdx + 1;
    tabs[nextIdx].classList.add('next-up');
    const btnNext = document.getElementById('btn-next');
    if(btnNext){
      btnNext.style.background  = 'var(--accent-dim)';
      btnNext.style.borderColor = 'var(--accent)';
      btnNext.style.color       = 'var(--accent)';
      btnNext.textContent       = '→ Next Block';
    }
  }
}

function showWorkoutDone(){
  // Mark day as done
  markDayDone();

  // Celebratory sound — big chord flourish
  sndAllSetsDone();
  setTimeout(()=>{ tone(523,0.6,0.4,'sine',0); tone(659,0.6,0.35,'sine',0.02); tone(784,0.8,0.35,'sine',0.04); tone(1047,0.9,0.30,'sine',0.06); }, 400);

  // Fill in stats
  const day = currentDay;
  const wm  = getWM(currentWeek);
  const phaseName = PHASE_NAMES[wm.p] || wm.p;
  document.getElementById('wdo-sub').textContent = `${day?.label || ''} · ${day?.name || ''} · ${phaseName} · Wk ${currentWeek}`;
  document.getElementById('wdo-stats').innerHTML = `
    <div class="wdo-stat"><div class="wdo-stat-val">Wk ${currentWeek}</div><div class="wdo-stat-label">Week</div></div>
    <div class="wdo-stat"><div class="wdo-stat-val">${phaseName}</div><div class="wdo-stat-label">Phase</div></div>
    <div class="wdo-stat"><div class="wdo-stat-val">${phaseFrames.length}</div><div class="wdo-stat-label">Blocks</div></div>
  `;

  const overlay = document.getElementById('workout-done-overlay');
  overlay.style.display = 'flex';
}

function closeWorkoutDone(){
  document.getElementById('workout-done-overlay').style.display = 'none';
  sndPhaseChange();
}