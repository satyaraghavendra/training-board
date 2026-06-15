// ── Smart open day ─────────────────────────────────────────
function getSmartOpenDay(savedDay, doneDays, trainingOrder, maxWeek){
  // Find first incomplete day in current week
  for(const d of trainingOrder){
    const key = `wk${currentWeek}_${d.id}`;
    if(!doneDays.includes(key)) return d;
  }
  // All done — stay on last day
  return trainingOrder[trainingOrder.length-1];
}

// ── Boot a profile ──────────────────────────────────────────
function bootProfile(profileName){
  const d = getActiveData();
  const saved = loadState();
  currentWeek      = Math.min(d.maxWeek, Math.max(1, saved.week || 1));
  window._doneDays = saved.doneDays || [];

  // Week picker
  document.getElementById('wp-plus').onclick = ()=>{
    if(currentWeek < d.maxWeek){ currentWeek++; updateWeekBanner(); applyDoneDays(); saveState(); syncWeekToCloud(currentWeek); }
  };
  document.getElementById('wp-minus').onclick = ()=>{
    if(currentWeek > 1){ currentWeek--; updateWeekBanner(); applyDoneDays(); saveState(); syncWeekToCloud(currentWeek); }
  };

  updateWeekBanner();
  buildDayTabs();

  const openDay = getSmartOpenDay(saved.day, window._doneDays, d.trainingDays, d.maxWeek);
  loadDay(openDay);
  applyDoneDays();
  sndProfileSelect();

  // Background cloud sync
  fetchCloudHistory(profileName).then(rows => {
    if(!rows || !rows.length) return;

    // Manual week override from cloud
    const weekSet = rows.find(r => r.day_id === '__week_set__');
    if(weekSet){
      currentWeek = Math.min(d.maxWeek, Math.max(1, weekSet.week));
      updateWeekBanner();
    }

    // Merge completed days
    let changed = false;
    rows
      .filter(r => r.day_id !== '__week_set__')
      .forEach(row => {
        const key = `wk${row.week}_${row.day_id}`;
        if(!window._doneDays.includes(key)){
          window._doneDays.push(key);
          changed = true;
        }
      });

    if(!changed && !weekSet) return;
    saveState();
    applyDoneDays();

    const betterDay = getSmartOpenDay(saved.day, window._doneDays, d.trainingDays, d.maxWeek);
    if(betterDay !== currentDay?.id) loadDay(betterDay);

  }).catch(() => {});
}

// ── Show profile selector ───────────────────────────────────
document.getElementById('profile-overlay').style.display = 'flex';
// tv-active comment — cursor set by initTVMode()

// ===========================================================
//  TV SPATIAL CURSOR
//  initTVMode() called by Kotlin after page load
//  window.tvCursorInit() called by Kotlin to place cursor
//  Both are global — safe to define always, only used by TV
// ===========================================================

// The SELECTORS and cursor state live outside initTVMode
// so Kotlin can call tvCursorInit() separately from initTVMode()
var _tvCursor      = null;
var _tvModeActive  = false;

var TV_SELECTORS = [
  '.profile-btn',
  '.day-tab:not(.rest-day):not(.day-done)',
  '.phase-tab:not(.block-done)',
  '#btn-prev',
  '#btn-next',
  '#btn-start-rest',
  '#btn-next-set',
  '#btn-minus15',
  '#btn-plus15',
  '#wdo-btn',
];

function tvGetFocusables(){
  // Profile overlay open — only profile buttons
  const overlay = document.getElementById('profile-overlay');
  if(overlay && overlay.style.display !== 'none'){
    return [
      document.getElementById('profile-satya'),
      document.getElementById('profile-tejaswi'),
    ].filter(Boolean);
  }
  // Main screen
  return TV_SELECTORS.filter(s => s !== '.profile-btn').flatMap(sel =>
    Array.from(document.querySelectorAll(sel))
         .filter(el => !el.disabled && !el.classList.contains('day-done') &&
                       (el.offsetParent !== null || el.closest('[style*="fixed"]')))
  );
}

function tvSetCursor(el){
  if(_tvCursor) _tvCursor.classList.remove('tv-cursor');
  _tvCursor = el;
  if(_tvCursor){
    _tvCursor.classList.add('tv-cursor');
    if(!_tvCursor.classList.contains('profile-btn')){
      _tvCursor.scrollIntoView({ block:'nearest', inline:'nearest', behavior:'smooth' });
    }
  }
}

function tvFindNeighbour(dir){
  const els = tvGetFocusables();
  if(!_tvCursor || !els.length) return null;
  const cr = _tvCursor.getBoundingClientRect();
  const cx = cr.left + cr.width  / 2;
  const cy = cr.top  + cr.height / 2;
  let best = null, bestScore = Infinity;
  els.forEach(el => {
    if(el === _tvCursor) return;
    const r  = el.getBoundingClientRect();
    const ex = r.left + r.width  / 2;
    const ey = r.top  + r.height / 2;
    const dx = ex - cx, dy = ey - cy;
    const inDir = dir==='left' ? dx<-10 : dir==='right' ? dx>10 : dir==='up' ? dy<-10 : dy>10;
    if(!inDir) return;
    const primary   = dir==='left'||dir==='right' ? Math.abs(dx) : Math.abs(dy);
    const secondary = dir==='left'||dir==='right' ? Math.abs(dy) : Math.abs(dx);
    const score = primary + secondary * 2.5;
    if(score < bestScore){ bestScore = score; best = el; }
  });
  return best;
}

// Called by Kotlin ONCE to activate TV mode
function initTVMode(){
  if(_tvModeActive) return;
  _tvModeActive = true;
  document.body.classList.add('tv-mode');

  // MutationObserver — re-place cursor when UI changes
  const obs = new MutationObserver(() => {
    const els = tvGetFocusables();
    if(_tvCursor && !els.includes(_tvCursor)){
      const start = document.getElementById('btn-start-rest');
      tvSetCursor(els.includes(start) ? start : (els[0]||null));
    }
    // Auto-jump to workout-done close button
    const wdoBtn = document.getElementById('wdo-btn');
    const wdoOverlay = document.getElementById('workout-done-overlay');
    if(wdoOverlay && wdoOverlay.style.display !== 'none' && _tvCursor !== wdoBtn && wdoBtn){
      tvSetCursor(wdoBtn);
    }
  });
  obs.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['style','class'] });

  // Keep-awake: silent touch event every 30s
  setInterval(()=>{
    document.dispatchEvent(new Event('touchstart', {bubbles:true}));
  }, 30000);
}

// Called by Kotlin SEPARATELY to place the cursor — decoupled from initTVMode
// This allows Kotlin to retry cursor placement independently
function tvCursorInit(){
  // Profile screen
  const overlay = document.getElementById('profile-overlay');
  if(overlay && overlay.style.display !== 'none'){
    const satya = document.getElementById('profile-satya');
    if(satya){
      tvSetCursor(satya);
      return true;
    }
  }
  // Main screen
  const els = tvGetFocusables();
  if(els.length){ tvSetCursor(els[0]); return true; }
  return false;
}

// Main key handler — called by Kotlin for every remote button press
window.tvKey = function(key){
  if(!_tvModeActive) return;

  // Profile overlay
  const overlay = document.getElementById('profile-overlay');
  if(overlay && overlay.style.display !== 'none'){
    const satya   = document.getElementById('profile-satya');
    const tejaswi = document.getElementById('profile-tejaswi');
    if(!_tvCursor || (_tvCursor !== satya && _tvCursor !== tejaswi)){
      tvSetCursor(satya);
    }
    if(key === 'ArrowLeft')  { tvSetCursor(satya);   return; }
    if(key === 'ArrowRight') { tvSetCursor(tejaswi); return; }
    if(key === 'Enter')      { _tvCursor?.click();   return; }
    return;
  }

  // OK press — pulse + click
  if(key === 'Enter'){
    if(_tvCursor){
      _tvCursor.style.transition = 'transform 0.08s';
      _tvCursor.style.transform  = 'scale(0.92)';
      setTimeout(()=>{ if(_tvCursor) _tvCursor.style.transform = ''; }, 80);
    }
    setTimeout(()=>{ _tvCursor?.click(); }, 60);
    setTimeout(()=>{
      const els = tvGetFocusables();
      if(_tvCursor && !els.includes(_tvCursor)){
        const start = document.getElementById('btn-start-rest');
        tvSetCursor(els.includes(start) ? start : (els[0]||null));
      }
    }, 250);
    return;
  }

  // Direction keys
  const dir = key==='ArrowLeft' ? 'left' : key==='ArrowRight' ? 'right' :
              key==='ArrowUp'   ? 'up'   : key==='ArrowDown'  ? 'down'  : null;
  if(!dir) return;
  if(!_tvCursor){ tvCursorInit(); return; }
  const next = tvFindNeighbour(dir);
  if(next) tvSetCursor(next);
};
