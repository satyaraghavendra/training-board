// ===========================================================
//  boot.js — Entry point
//  Shows profile selector on load, calls bootProfile()
//  Depends on: all other modules
// ===========================================================
function getSmartOpenDay(savedDay, doneDays, trainingOrder, maxWeek){
  const todayJs = new Date().getDay();
  // Weekend handling
  if(todayJs === 6){
    // Saturday → last training day of the week
    return trainingOrder[trainingOrder.length - 1] || 'fri';
  }
  if(todayJs === 0){
    // Sunday → first training day of next week
    return trainingOrder[0] || 'mon';
  }

  if(!doneDays.length) return savedDay || trainingOrder[0];

  const doneThisWeek = doneDays
    .filter(k => k.startsWith(`wk${currentWeek}_`))
    .map(k => k.split('_')[1]);

  const nextIncomplete = trainingOrder.find(d => !doneThisWeek.includes(d));
  if(nextIncomplete) return nextIncomplete;

  // All training days done this week — advance
  if(currentWeek < maxWeek){
    currentWeek++;
    updateWeekBanner();
    saveState();
    return trainingOrder[0];
  }
  return savedDay || trainingOrder[0];
}

function bootProfile(profileName){
  const d = getActiveData();
  const saved = loadState();
  currentWeek      = Math.min(d.maxWeek, Math.max(1, saved.week || 1));
  window._doneDays = saved.doneDays || [];

  // Week picker limits
  document.getElementById('wp-plus').onclick = ()=>{
    if(currentWeek < d.maxWeek){
      currentWeek++; updateWeekBanner(); applyDoneDays(); saveState();
      syncWeekToCloud(currentWeek);
    }
  };
  document.getElementById('wp-minus').onclick = ()=>{
    if(currentWeek > 1){
      currentWeek--; updateWeekBanner(); applyDoneDays(); saveState();
      syncWeekToCloud(currentWeek);
    }
  };

  updateWeekBanner();
  buildDayTabs();

  const openDay = getSmartOpenDay(saved.day, window._doneDays, d.trainingDays, d.maxWeek);
  loadDay(openDay);
  applyDoneDays();

  // Background sync: fetch cloud history and merge into local state
  // Runs silently — UI already loaded, updates apply when data arrives
  fetchCloudHistory(profileName).then(rows => {
    if(!rows || !rows.length) return;

    // Check for manual week override first (stored as __week_set__ row)
    const weekSet = rows.find(r => r.day_id === '__week_set__');
    if(weekSet){
      currentWeek = Math.min(d.maxWeek, Math.max(1, weekSet.week));
      updateWeekBanner();
    }

    // Merge completed workout days (exclude special rows)
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


// Show profile selector on load
document.getElementById('profile-overlay').style.display = 'flex';
// TV only: pre-highlight first profile button for remote navigation
// window._isAndroidTV is set by the Kotlin WebView via evaluateJavascript
if(window._isAndroidTV){
  document.querySelector('.profile-btn')?.classList.add('tv-active');
}
// ===========================================================
//  TV SPATIAL CURSOR — only active in Android TV WebView
//  Injected after _isAndroidTV flag is set by Kotlin
// ===========================================================
if(window._isAndroidTV){
  document.body.classList.add('tv-mode');

  // All elements the cursor can land on
  // TV FOCUSABLE ELEMENTS — only what matters during a workout
  // Week picker, export, reset → use phone/browser for those
  const SELECTORS = [
    '.profile-btn',                              // profile cards (Satya / Tejaswi)
    '.day-tab:not(.rest-day):not(.day-done)',    // Mon Tue Wed Thu Fri
    '.phase-tab:not(.block-done)',               // Warm-Up Block A B C Cool-Down
    '#btn-prev',                                 // Previous phase
    '#btn-next',                                 // Next phase
    '#btn-start-rest',                           // Start / Pause timer
    '#btn-next-set',                             // Next Set / Skip Rest
    '#btn-minus15',                              // -15s
    '#btn-plus15',                               // +15s
    '#wdo-btn',                                  // Workout Done — Close
  ];

  let _cursor = null; // currently focused element

  function getFocusables(){
    return SELECTORS.flatMap(sel =>
      Array.from(document.querySelectorAll(sel))
           .filter(el => el.offsetParent !== null &&  // visible
                         !el.disabled &&
                         !el.classList.contains('day-done'))
    );
  }

  function setCursor(el){
    if(_cursor) _cursor.classList.remove('tv-cursor');
    _cursor = el;
    if(_cursor){
      _cursor.classList.add('tv-cursor');
      _cursor.scrollIntoView({ block:'nearest', inline:'nearest', behavior:'smooth' });
    }
  }

  function initCursor(){
    const els = getFocusables();
    if(els.length) setCursor(els[0]);
  }

  // Find the element closest in a given direction using bounding rects
  function findNeighbour(dir){
    const els = getFocusables();
    if(!_cursor || !els.length) return null;

    const cr = _cursor.getBoundingClientRect();
    const cx = cr.left + cr.width  / 2;
    const cy = cr.top  + cr.height / 2;

    let best = null, bestScore = Infinity;

    els.forEach(el => {
      if(el === _cursor) return;
      const r  = el.getBoundingClientRect();
      const ex = r.left + r.width  / 2;
      const ey = r.top  + r.height / 2;
      const dx = ex - cx, dy = ey - cy;

      // Must be generally in the right direction
      const inDir = dir === 'left'  ? dx < -10 :
                    dir === 'right' ? dx >  10  :
                    dir === 'up'    ? dy < -10  :
                                      dy >  10;
      if(!inDir) return;

      // Score: primary axis distance + penalty for off-axis drift
      const primary   = dir === 'left' || dir === 'right' ? Math.abs(dx) : Math.abs(dy);
      const secondary = dir === 'left' || dir === 'right' ? Math.abs(dy) : Math.abs(dx);
      const score = primary + secondary * 2.5; // penalise lateral drift

      if(score < bestScore){ bestScore = score; best = el; }
    });

    return best;
  }

  // Main key handler — called from Kotlin via evaluateJavascript
  // key = ArrowLeft | ArrowRight | ArrowUp | ArrowDown | Enter | init
  window.tvKey = function(key){
    if(key === 'init'){ initCursor(); return; }
    // Profile overlay open
    const overlay = document.getElementById('profile-overlay');
    if(overlay && overlay.style.display !== 'none'){
      const btns = Array.from(document.querySelectorAll('.profile-btn'));
      if(!_cursor || !btns.includes(_cursor)) setCursor(btns[0]);
      if(key === 'ArrowLeft' || key === 'ArrowRight'){
        const idx = btns.indexOf(_cursor);
        const next = key === 'ArrowRight' ? Math.min(idx+1, btns.length-1) : Math.max(idx-1, 0);
        setCursor(btns[next]);
      }
      if(key === 'Enter') _cursor?.click();
      return;
    }

    // Main screen
    if(key === 'Enter'){
      // Visual pulse feedback — flash the cursor on OK press
      if(_cursor){
        _cursor.style.transition = 'transform 0.08s ease';
        _cursor.style.transform  = 'scale(0.92)';
        setTimeout(()=>{
          if(_cursor){ _cursor.style.transform = ''; }
        }, 80);
      }
      setTimeout(()=>{ _cursor?.click(); }, 60);
      // After click re-evaluate cursor
      setTimeout(() => {
        const els = getFocusables();
        if(_cursor && !els.includes(_cursor)){
          const start = document.getElementById('btn-start-rest');
          setCursor(els.includes(start) ? start : (els[0]||null));
        }
      }, 200);
      return;
    }

    const dir = key === 'ArrowLeft'  ? 'left'  :
                key === 'ArrowRight' ? 'right' :
                key === 'ArrowUp'    ? 'up'    :
                key === 'ArrowDown'  ? 'down'  : null;
    if(!dir) return;

    if(!_cursor) { initCursor(); return; }
    const next = findNeighbour(dir);
    if(next) setCursor(next);
  };

  // Initialise cursor after DOM settles
  setTimeout(initCursor, 300);

  // Re-init cursor when UI changes (new buttons appear, overlays open)
  document.addEventListener('click', () => {
    setTimeout(() => {
      const els = getFocusables();
      // If cursor element is gone or hidden, move to best visible button
      if(!_cursor || !els.includes(_cursor)){
        // Prefer Start Rest button if visible, else first focusable
        const start = document.getElementById('btn-start-rest');
        if(start && els.includes(start)) setCursor(start);
        else if(els.length) setCursor(els[0]);
      }
    }, 250);
  });

  // Watch for overlay opens (workout done, profile switcher)
  const _obs = new MutationObserver(() => {
    setTimeout(() => {
      const els = getFocusables();
      // If a new overlay appeared with buttons, jump cursor there
      const wdoClose = document.getElementById('wdo-btn');
      if(wdoClose && els.includes(wdoClose) && _cursor !== wdoClose){
        setCursor(wdoClose);
      }
      const profileOverlay = document.getElementById('profile-overlay');
      if(profileOverlay && profileOverlay.style.display !== 'none'){
        const first = document.querySelector('.profile-btn');
        if(first && _cursor !== first) setCursor(first);
      }
    }, 200);
  });
  _obs.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['style','class'] });

  // Screen keep-awake third layer — silent event every 30s
  // Backup for when Wake Lock API and keepScreenOn both fail
  setInterval(()=>{
    document.dispatchEvent(new Event('touchstart', {bubbles:true}));
  }, 30000);
}
