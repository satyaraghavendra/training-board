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
    if(currentWeek < d.maxWeek){ currentWeek++; updateWeekBanner(); applyDoneDays(); saveState(); }
  };
  document.getElementById('wp-minus').onclick = ()=>{
    if(currentWeek > 1){ currentWeek--; updateWeekBanner(); applyDoneDays(); saveState(); }
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

    let changed = false;
    rows.forEach(row => {
      const key = `wk${row.week}_${row.day_id}`;
      if(!window._doneDays.includes(key)){
        window._doneDays.push(key);
        changed = true;
      }
    });

    if(!changed) return;

    // Find the highest week from cloud records
    const maxCloudWeek = Math.max(...rows.map(r => r.week));
    if(maxCloudWeek > currentWeek){
      currentWeek = Math.min(d.maxWeek, maxCloudWeek);
      updateWeekBanner();
    }

    // Save merged state locally so next load is instant
    saveState();
    applyDoneDays();

    // Re-evaluate smart open day with merged data
    const betterDay = getSmartOpenDay(saved.day, window._doneDays, d.trainingDays, d.maxWeek);
    if(betterDay !== currentDay?.id){
      loadDay(betterDay);
    }
  }).catch(() => {
  });
}

// Show profile selector on load
document.getElementById('profile-overlay').style.display = 'flex';