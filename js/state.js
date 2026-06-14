// ===========================================================
//  V3 SUPABASE CONFIGURATION
//  1. Create project at supabase.com (free)
//  2. Run this SQL in Supabase SQL Editor:
//
//     create table workout_logs (
//       id           bigint generated always as identity primary key,
//       profile      text not null,
//       week         integer not null,
//       day_id       text not null,
//       completed_at timestamptz default now()
//     );
//     alter table workout_logs enable row level security;
//     create policy "anon insert" on workout_logs for insert to anon with check (true);
//     create policy "anon select" on workout_logs for select to anon using (true);
//
//  3. Replace SUPABASE_URL and SUPABASE_ANON_KEY below with your project values
//     Dashboard → Settings → API → Project URL + anon key
// ===========================================================
const SUPABASE_URL      = 'https://rwelcdnezqdjzwiwlloe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3ZWxjZG5lenFkanp3aXdsbG9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MTEzODYsImV4cCI6MjA5Njk4NzM4Nn0.Cji8kDZ-wHkE13lRfYf4KOzSXJASdrqLbvUle7NUixA';

// Sync manual week change to cloud
// Stored as a special row: day_id = '__week_set__'
async function syncWeekToCloud(week){
  try{
    // Delete previous week_set rows for this profile first
    await fetch(
      `${SUPABASE_URL}/rest/v1/workout_logs?profile=eq.${currentProfile}&day_id=eq.__week_set__`,
      { method:'DELETE', headers:{
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal',
      }}
    );
    // Insert new week_set row
    await fetch(`${SUPABASE_URL}/rest/v1/workout_logs`, {
      method: 'POST',
      headers:{
        'apikey':        SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal',
      },
      body: JSON.stringify({ profile: currentProfile, week, day_id: '__week_set__' }),
    });
  }catch(err){
    console.warn('Week sync failed:', err.message);
  }
}

// Silent fire-and-forget sync — localStorage is always source of truth
// Network failure silently logged, never interrupts the workout
async function syncToCloud(week, dayId, profile){
  try{
    await fetch(`${SUPABASE_URL}/rest/v1/workout_logs`, {
      method:  'POST',
      headers: {
        'apikey':       SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer':       'return=minimal',
      },
      body: JSON.stringify({ profile, week, day_id: dayId }),
    });
  }catch(err){
    console.warn('Offline: sync deferred —', err.message);
  }
}

// Fetch full workout history from cloud (call on boot if online)
async function fetchCloudHistory(profile){
  try{
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/workout_logs?profile=eq.${profile}&select=week,day_id,completed_at&order=completed_at.desc`,
      { headers:{ 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }}
    );
    if(!res.ok) return null;
    return await res.json();
  }catch(err){
    console.warn('Could not fetch cloud history:', err.message);
    return null;
  }
}

// ===========================================================
//  state.js — Profile system, localStorage persistence,
//             Wake Lock API, backup/restore
//  Depends on: data.js, audio.js, ui.js, timer.js
// ===========================================================

// ===========================================================
//  WAKE LOCK — keep screen on during workout
// ===========================================================
let wakeLock = null;

async function requestWakeLock(){
  try{
    if('wakeLock' in navigator){
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => {
      });
    }
  }catch(err){
    console.warn('Wake Lock failed:', err);
  }
}

// Acquire on first interaction
document.addEventListener('click', requestWakeLock, { once: true });
//  PROFILE SYSTEM
// ===========================================================
// currentProfile declared in data.js
const PROFILE_STATE_KEYS = {
  satya:   'trainingboard_state_satya',
  tejaswi: 'trainingboard_state_tejaswi',
};

function switchProfile(){
  stopTimer();
  // Reset accent to default lime so profile selector always looks correct
  document.documentElement.style.setProperty('--accent','#C8FF3E');
  document.documentElement.style.setProperty('--accent-dim','rgba(200,255,62,0.13)');
  document.getElementById('profile-overlay').style.display = 'flex';
}

function selectProfile(name){
  currentProfile = name;
  document.getElementById('profile-overlay').style.display = 'none';

  // Update profile button initial + colour
  const initial = name === 'tejaswi' ? 'T' : 'S';
  document.getElementById('profile-initial').textContent = initial;
  const btnColor = name === 'tejaswi' ? '#F472B6' : '#C8FF3E';
  document.getElementById('btn-switch-profile').style.background  = btnColor;
  document.getElementById('btn-switch-profile').style.borderColor = btnColor;
  document.getElementById('btn-switch-profile').style.color       = '#080808';

  // Update accent colour
  if(name === 'tejaswi'){
    document.documentElement.style.setProperty('--accent','#F472B6');
    document.documentElement.style.setProperty('--accent-dim','rgba(244,114,182,0.13)');
  } else {
    document.documentElement.style.setProperty('--accent','#C8FF3E');
    document.documentElement.style.setProperty('--accent-dim','rgba(200,255,62,0.13)');
  }

  document.querySelector('.bar-eyebrow').textContent = name === 'tejaswi'
    ? '12-Week Postpartum Plan · 3-Day · Tejaswi'
    : '13-Week KB Plan · 5-Day Fat Loss · Home Gym';

  bootProfile(name);
  sndProfileSelect();
  requestWakeLock();
}

function getActiveData(){
  if(currentProfile === 'tejaswi') return {
    DAYS:       DAYS_T,
    WEEK_META:  WEEK_META_T,
    DELOAD_MAP: DELOAD_MAP_T,
    PHASE_TIMER:PHASE_TIMER_T,
    maxWeek:    12,
    trainingDays:['mon','wed','fri'],
  };
  return {
    DAYS:       DAYS,
    WEEK_META:  WEEK_META,
    DELOAD_MAP: DELOAD_MAP,
    PHASE_TIMER:PHASE_TIMER,
    maxWeek:    13,
    trainingDays:['mon','tue','wed','thu','fri'],
  };
}

const STATE_KEY = 'trainingboard_state'; // legacy — now uses profile keys

function saveState(){
  try{
    const key = PROFILE_STATE_KEYS[currentProfile] || STATE_KEY;
    localStorage.setItem(key, JSON.stringify({
      week:     currentWeek,
      day:      currentDay?.id || 'mon',
      doneDays: window._doneDays || [],
    }));
  }catch(e){}
}

function loadState(){
  try{
    const key = PROFILE_STATE_KEYS[currentProfile] || STATE_KEY;
    const s = JSON.parse(localStorage.getItem(key) || '{}');
    return { week:s.week||1, day:s.day||'mon', doneDays:s.doneDays||[] };
  }catch(e){ return {week:1,day:'mon',doneDays:[]}; }
}

// Hard Reset — wipes localStorage AND Supabase cloud history for current profile
async function hardReset(){
  const confirmed = confirm(
    `⚠️ HARD RESET — ${currentProfile.toUpperCase()}\n\n` +
    `This will permanently delete:\n` +
    `• All completed days (local + cloud)\n` +
    `• Current week progress\n` +
    `• Everything back to Week 1\n\n` +
    `This cannot be undone. Continue?`
  );
  if(!confirmed) return;

  // 1. Reset local state immediately (don't wait for network)
  window._doneDays = [];
  currentWeek = 1;

  // 2. Save cleared state to localStorage
  try{
    const key = PROFILE_STATE_KEYS[currentProfile] || STATE_KEY;
    localStorage.setItem(key, JSON.stringify({ week:1, day:'mon', doneDays:[] }));
  }catch(e){}

  // 3. Clear all visual markers immediately
  document.querySelectorAll('.day-tab').forEach(t => {
    t.classList.remove('day-done','active');
  });
  document.querySelectorAll('.phase-tab').forEach(t => {
    t.classList.remove('block-done','next-up','active');
  });

  // 4. Reload UI to Week 1 Day 1 immediately
  updateWeekBanner();
  loadDay(getActiveData().trainingDays[0]);
  sndPhaseChange();

  // 5. Delete Supabase rows in background (non-blocking)
  fetch(
    `${SUPABASE_URL}/rest/v1/workout_logs?profile=eq.${currentProfile}`,
    {
      method: 'DELETE',
      headers:{
        'apikey':        SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer':        'return=minimal',
      }
    }
  ).catch(e => console.warn('[HardReset] Cloud delete failed:', e.message));
}

// resetState() removed — use hardReset() instead

// Mark current day as done — disable tab, persist
function markDayDone(){
  if(!currentDay || currentDay.rest) return;
  const key = `wk${currentWeek}_${currentDay.id}`;  // e.g. "wk2_tue"
  if(!window._doneDays.includes(key)){
    window._doneDays.push(key);
  }
  // Disable the day tab visually
  document.querySelectorAll('.day-tab').forEach(t => {
    if(t.dataset.dayId === currentDay.id){
      t.classList.add('day-done');
      t.classList.remove('active');
    }
  });
  saveState();
  // V3: silent background sync — never blocks or throws
  syncToCloud(currentWeek, currentDay.id, currentProfile);
}

// Apply done state to tabs — only for current week
function applyDoneDays(){
  document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('day-done'));
  (window._doneDays || []).forEach(key => {
    const [wkPart, dayId] = key.split('_');
    const wk = parseInt(wkPart.replace('wk',''));
    if(wk === currentWeek){
      document.querySelectorAll('.day-tab').forEach(t => {
        if(t.dataset.dayId === dayId) t.classList.add('day-done');
      });
    }
  });
}

// Persist state whenever week or day changes
// week picker wired in bootProfile per-profile
// week picker handled in BOOT section below
// wp-reset button removed — use hard reset ⚠ instead
document.getElementById('wp-hardreset').addEventListener('click', ()=>{ hardReset(); });
const _exportBtn = document.getElementById('wp-export');
if(_exportBtn){
  _exportBtn.addEventListener('click', backupState);
  _exportBtn.addEventListener('mousedown', ()=>{ exportPressTimer = setTimeout(()=>{ restoreState(); }, 600); });
  _exportBtn.addEventListener('mouseup',   ()=> clearTimeout(exportPressTimer));
  _exportBtn.addEventListener('mouseleave',()=> clearTimeout(exportPressTimer));
}

// ===========================================================
//  BOOT
// ===========================================================