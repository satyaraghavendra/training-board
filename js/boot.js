// ── Smart open day ─────────────────────────────────────────
function getSmartOpenDay(savedDay, doneDays, trainingOrder, maxWeek){
  for(const d of trainingOrder){
    const key = `wk${currentWeek}_${d.id}`;
    if(!doneDays.includes(key)) return d;
  }
  return trainingOrder[trainingOrder.length-1];
}

// ── Boot a profile ──────────────────────────────────────────
function bootProfile(profileName){
  const d = getActiveData();
  const saved = loadState();
  currentWeek      = Math.min(d.maxWeek, Math.max(1, saved.week || 1));
  window._doneDays = saved.doneDays || [];

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
    const weekSet = rows.find(r => r.day_id === '__week_set__');
    if(weekSet){
      currentWeek = Math.min(d.maxWeek, Math.max(1, weekSet.week));
      updateWeekBanner();
    }
    let changed = false;
    rows.filter(r => r.day_id !== '__week_set__').forEach(row => {
      const key = `wk${row.week}_${row.day_id}`;
      if(!window._doneDays.includes(key)){ window._doneDays.push(key); changed = true; }
    });
    if(!changed && !weekSet) return;
    saveState();
    applyDoneDays();
    const betterDay = getSmartOpenDay(saved.day, window._doneDays, d.trainingDays, d.maxWeek);
    if(betterDay !== currentDay?.id) loadDay(betterDay);
  }).catch(() => {});
}

// ── Show profile selector on load ───────────────────────────
document.getElementById('profile-overlay').style.display = 'flex';
