// ===========================================================
//  V3 CONFIGURATION
//  Replace CDN_BASE with your actual Cloudflare R2 URL
//  e.g. https://pub-abc123.r2.dev  or  https://media.yourdomain.com
//  Steps: Cloudflare Dashboard → R2 → Create bucket → Upload videos/
//         → Settings → Public access → copy URL
// ===========================================================
const CDN_BASE = 'https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev';

// ===========================================================
//  data.js — All program data
//  Satya 13-week KB macrocycle (5-day Mon–Fri)
//  Tejaswi 12-week postpartum fat loss (3-day Mon/Wed/Fri)
// ===========================================================
// ===========================================================
//  WEEK → PHASE MAPPING  (13-week macrocycle)
// ===========================================================
const WEEK_META = [
  {w:1,  p:"P1",desc:"Foundation — Learn the Pattern · Max rest · Technique focus",      color:"#C8FF3E",bg:"rgba(200,255,62,.07)"},
  {w:2,  p:"P1",desc:"Foundation — Learn the Pattern · Max rest · Technique focus",      color:"#C8FF3E",bg:"rgba(200,255,62,.07)"},
  {w:3,  p:"D1",desc:"Deload Wk 3 — Drop sets, keep loads, max rest",                   color:"#94A3B8",bg:"rgba(148,163,184,.06)"},
  {w:4,  p:"P2",desc:"Density — Less rest on swings · Same load · More grit",            color:"#38C8FF",bg:"rgba(56,200,255,.07)"},
  {w:5,  p:"P2",desc:"Density — Less rest on swings · Same load · More grit",            color:"#38C8FF",bg:"rgba(56,200,255,.07)"},
  {w:6,  p:"D2",desc:"Deload Wk 6 — Drop sets, keep loads, max rest",                   color:"#94A3B8",bg:"rgba(148,163,184,.06)"},
  {w:7,  p:"P3",desc:"Mechanical — Slow eccentrics · 4s down = harder than heavier",     color:"#A78BFA",bg:"rgba(167,139,250,.07)"},
  {w:8,  p:"P3",desc:"Mechanical — Slow eccentrics · 4s down = harder than heavier",     color:"#A78BFA",bg:"rgba(167,139,250,.07)"},
  {w:9,  p:"P3",desc:"Mechanical — Slow eccentrics · 4s down = harder than heavier",     color:"#A78BFA",bg:"rgba(167,139,250,.07)"},
  {w:10, p:"P3",desc:"Mechanical — Slow eccentrics · 4s down = harder than heavier",     color:"#A78BFA",bg:"rgba(167,139,250,.07)"},
  {w:11, p:"P3",desc:"Mechanical — Slow eccentrics · 4s down = harder than heavier",     color:"#A78BFA",bg:"rgba(167,139,250,.07)"},
  {w:12, p:"D3",desc:"Deload Wk 12 — Drop 1 set per block · Keep loads · Max rest",      color:"#94A3B8",bg:"rgba(148,163,184,.06)"},
  {w:13, p:"P4",desc:"Full Deload Wk 13 — All loads back to P1 · CNS reset · Test +5%", color:"#4ADE80",bg:"rgba(74,222,128,.07)"},
];

const PHASE_NAMES = {P1:"Foundation",P2:"Density",P3:"Mechanical",D1:"Deload",D2:"Deload",D3:"Deload",P4:"Full Deload"};

// ===========================================================
//  PHASE ACCENT COLOURS
// ===========================================================
const PC = {warmup:"#FF9F38", a:"#38C8FF", b:"#A78BFA", c:"#F472B6", cooldown:"#4ADE80"};

// ===========================================================
//  EXERCISE DATA  — keyed by phase code (P1/P2/P3/P4/D1/D2/D3)
//  Each day has: warmup[], a[], b[], c[]|null, cooldown[]
//  Each exercise: { name, sets, reps, load, rest, note, path }
//  D1/D2/D3 = deload: same as previous phase but −1 set
// ===========================================================
const DAYS = [
  // ==========================================================
  // MONDAY  —  Swing Power + Posterior Chain
  // ==========================================================
  {
    id:"mon", label:"Mon", name:"Swing Power + Posterior Chain",
    phases:{
      P1:{
        warmup:[
          {name:"KB Goblet Squat",   sets:"8 reps",    reps:"",     load:"8 kg",   rest:"",     note:"ISO warmup",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/goblet_squat.mp4"},
          {name:"Hip 90/90 Rotations",sets:"60 reps",  reps:"",     load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_9090_rotation.mp4"},
          {name:"Deadbugs",          sets:"10 reps",   reps:"",     load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/deadbugs.mp4"},
          {name:"KB Halos",          sets:"5/side",    reps:"",     load:"8 kg",   rest:"",     note:"→ ISO",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_halo.mp4"},
        ],
        a:[
          {name:"KB One-Arm Swing",  sets:"8 sets",    reps:"10/set",load:"35 lb",  rest:"45s",  note:"Alternate hands · park bell quietly · explosive hip snap · exhale at snap",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_one_arm_swing.mp4"},
        ],
        b:[
          {name:"KB Romanian Deadlift",sets:"4 sets",  reps:"8/side",load:"35 lb",  rest:"→",    note:"3s eccentric · hips back · lower silently · SUPERSET with Hip Thrust",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_romanian_deadlift.mp4"},
          {name:"Hip Thrust",         sets:"4 sets",   reps:"12",   load:"BW",     rest:"→",    note:"Shoulders on bench · ribs down · squeeze top · directly under bar vertical",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_thrust.mp4"},
          {name:"Lat Hang Stretch",   sets:"4 sets",   reps:"20s",  load:"BW",     rest:"90s",  note:"Directly under bar vertical · ISO rests 1+2",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
        ],
        c:[
          {name:"Ab Roller",          sets:"2 rounds",  reps:"8–10", load:"BW",     rest:"→",    note:"Core circuit A→B→C",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/abroller.mp4"},
          {name:"Side Plank Hold",    sets:"2 rounds",  reps:"20s/side",load:"BW",  rest:"→",    note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/sideplankhold.mp4"},
          {name:"Hollow Body Hold",   sets:"2 rounds",  reps:"20s",  load:"BW · legs 45°",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hollow_body_hold.mp4"},
        ],
        cooldown:[
          {name:"Lat Hang",           sets:"",          reps:"45s",  load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
          {name:"90/90 Hip Stretch",  sets:"",          reps:"60s/side",load:"BW",  rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_9090_rotation.mp4"},
          {name:"Child's Pose",       sets:"",          reps:"60s",  load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/childpose.mp4"},
          {name:"Grip Recovery",      sets:"",          reps:"30s",  load:"",       rest:"",     note:"shake",path:""},
        ],
      },
      P2:{
        warmup:[
          {name:"KB Goblet Squat",    sets:"8 reps",   reps:"",     load:"8 kg",   rest:"",     note:"unchanged from P1",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/goblet_squat.mp4"},
          {name:"Hip 90/90 Rotations",sets:"60 reps",  reps:"",     load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_9090_rotation.mp4"},
          {name:"Deadbugs",           sets:"10 reps",  reps:"",     load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/deadbugs.mp4"},
          {name:"KB Halos",           sets:"5/side",   reps:"",     load:"8 kg",   rest:"",     note:"→ ISO",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_halo.mp4"},
        ],
        a:[
          {name:"KB One-Arm Swing",   sets:"10 sets",  reps:"10/set",load:"44 lb", rest:"35s",  note:"NEW: 44 lb · 35s rest · 10 sets · alternate hands · exhale at snap",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_one_arm_swing.mp4"},
        ],
        b:[
          {name:"KB Romanian Deadlift",sets:"4 sets",  reps:"8/side",load:"35 lb", rest:"→",    note:"4s eccentric · SUPERSET with Hip Thrust +26 lb",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_romanian_deadlift.mp4"},
          {name:"Hip Thrust",          sets:"4 sets",  reps:"12",   load:"26 lb",  rest:"→",    note:"1s hold at top",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_thrust.mp4"},
          {name:"Lat Hang",            sets:"4 sets",  reps:"25s",  load:"BW",     rest:"90s",  note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
        ],
        c:[
          {name:"Ab Roller / Suspension Fallout",sets:"3 rounds",reps:"10",load:"Straps · face away",rest:"→",note:"Core circuit 3 rounds · Straps",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/abroller.mp4"},
          {name:"Side Plank Hold",     sets:"3 rounds",reps:"30s/side",load:"BW",  rest:"→",    note:"feet stacked",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/sideplankhold.mp4"},
          {name:"Hollow Body Hold",    sets:"3 rounds",reps:"35s",  load:"BW · legs 30°",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hollow_body_hold.mp4"},
        ],
        cooldown:[
          {name:"Lat Hang",            sets:"",        reps:"45s",  load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
          {name:"90/90 Hip Stretch",   sets:"",        reps:"60s/side",load:"BW",  rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_9090_rotation.mp4"},
          {name:"Child's Pose",        sets:"",        reps:"60s",  load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/childpose.mp4"},
          {name:"Grip Recovery",       sets:"",        reps:"30s",  load:"",       rest:"",     note:"",path:""},
        ],
      },
      P3:{
        warmup:[
          {name:"KB Goblet Squat",    sets:"8 reps",   reps:"",     load:"8 kg",   rest:"",     note:"unchanged",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/goblet_squat.mp4"},
          {name:"Hip 90/90 Rotations",sets:"60 reps",  reps:"",     load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_9090_rotation.mp4"},
          {name:"Deadbugs",           sets:"10 reps",  reps:"",     load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/deadbugs.mp4"},
          {name:"KB Halos",           sets:"5/side",   reps:"",     load:"8 kg",   rest:"",     note:"→ ISO",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_halo.mp4"},
        ],
        a:[
          {name:"KB One-Arm Swing",   sets:"9 sets",   reps:"10/set",load:"53 lb", rest:"25s",  note:"21d gate for overspeed · exhale at snap",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_one_arm_swing.mp4"},
        ],
        b:[
          {name:"KB Romanian Deadlift",sets:"3 sets",  reps:"8/side",load:"35 lb", rest:"→",    note:"4s+3s pause eccentric · SUPERSET 4s+3s · 35 lb thrust",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_romanian_deadlift.mp4"},
          {name:"Hip Thrust",          sets:"3 sets",  reps:"12",   load:"35 lb",  rest:"→",    note:"2s hold at top",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_thrust.mp4"},
          {name:"Lat Hang",            sets:"3 sets",  reps:"30s",  load:"BW",     rest:"90s",  note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
        ],
        c:[
          {name:"Ab Roller / Fallout", sets:"2 rounds",reps:"10",   load:"Straps · face away",rest:"→",note:"Core 2 rounds · longer holds",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/abroller.mp4"},
          {name:"Side Plank Hold",     sets:"2 rounds",reps:"40s/side",load:"BW",  rest:"→",    note:"+reach",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/sideplankhold.mp4"},
          {name:"Hollow Body Hold",    sets:"2 rounds",reps:"50s",  load:"BW · legs 6in",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hollow_body_hold.mp4"},
        ],
        cooldown:[
          {name:"Lat Hang",            sets:"",        reps:"45s",  load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
          {name:"90/90 Hip Stretch",   sets:"",        reps:"60s/side",load:"BW",  rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_9090_rotation.mp4"},
          {name:"Child's Pose",        sets:"",        reps:"60s",  load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/childpose.mp4"},
          {name:"Grip Recovery",       sets:"",        reps:"30s",  load:"",       rest:"",     note:"",path:""},
        ],
      },
      P4:{
        warmup:[
          {name:"KB Goblet Squat",    sets:"8 reps",   reps:"",     load:"8 kg",   rest:"",     note:"Full deload — back to P1 levels",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/goblet_squat.mp4"},
          {name:"Hip 90/90 Rotations",sets:"60 reps",  reps:"",     load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_9090_rotation.mp4"},
          {name:"Deadbugs",           sets:"10 reps",  reps:"",     load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/deadbugs.mp4"},
          {name:"KB Halos",           sets:"5/side",   reps:"",     load:"8 kg",   rest:"",     note:"→ ISO",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_halo.mp4"},
        ],
        a:[
          {name:"KB One-Arm Swing",   sets:"5 sets",   reps:"10/set",load:"35 lb", rest:"45s",  note:"Full deload · back to P1 · CNS reset",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_one_arm_swing.mp4"},
        ],
        b:[
          {name:"KB Romanian Deadlift",sets:"3 sets",  reps:"8/side",load:"35 lb", rest:"→",    note:"Easy pace · deload week",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_romanian_deadlift.mp4"},
          {name:"Hip Thrust",          sets:"4 sets",  reps:"12",   load:"BW",     rest:"→",    note:"Back to bodyweight",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_thrust.mp4"},
          {name:"Lat Hang",            sets:"3 sets",  reps:"20s",  load:"BW",     rest:"90s",  note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
        ],
        c:[
          {name:"Ab Roller",           sets:"2 rounds",reps:"8–10", load:"BW",     rest:"→",    note:"BW reset",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/abroller.mp4"},
          {name:"Side Plank Hold",     sets:"2 rounds",reps:"20s/side",load:"BW",  rest:"→",    note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/sideplankhold.mp4"},
          {name:"Hollow Body Hold",    sets:"2 rounds",reps:"20s",  load:"BW",     rest:"45s",  note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hollow_body_hold.mp4"},
        ],
        cooldown:[
          {name:"Lat Hang",            sets:"",        reps:"45s",  load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
          {name:"90/90 Hip Stretch",   sets:"",        reps:"60s/side",load:"BW",  rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_9090_rotation.mp4"},
          {name:"Child's Pose",        sets:"",        reps:"60s",  load:"BW",     rest:"",     note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/childpose.mp4"},
          {name:"Grip Recovery",       sets:"",        reps:"30s",  load:"",       rest:"",     note:"",path:""},
        ],
      },
    }
  },
  // ==========================================================
  // TUESDAY  —  Push + Core Stability
  // ==========================================================
  {
    id:"tue", label:"Tue", name:"Push + Core Stability",
    phases:{
      P1:{
        warmup:[
          {name:"Arm Circles + Shoulder CARs",sets:"10/dir",reps:"",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/shoulder_cars.mp4"},
          {name:"Band Face Pull",sets:"2×12",reps:"",load:"Lt band",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_face_pull.mp4"},
          {name:"Band Dislocates",sets:"2×10",reps:"",load:"Lt band",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_dislocates.mp4"},
          {name:"Cat-Cow",sets:"10 reps",reps:"",load:"BW",rest:"",note:"→ ISO",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/cat_cow.mp4"},
        ],
        a:[
          {name:"Push-Up",sets:"4 sets",reps:"10–15",load:"BW · knuckle",rest:"→",note:"⚠️ Wrist 14d gate: knuckle only · ISO rests 1+2",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pushup.mp4"},
          {name:"KB Floor Press",sets:"4 sets",reps:"5–6/side",load:"35 lb",rest:"60s",note:"1s pause · floor limits ROM · ISO rests 1+2",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_floor_press.mp4"},
        ],
        b:[
          {name:"Pallof Press",sets:"3 rounds",reps:"10/side · 2s hold",load:"Lt band",rest:"→",note:"Anti-rotation 3 rounds",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pallof_press.mp4"},
          {name:"Suitcase KB Carry",sets:"3 rounds",reps:"30s/side",load:"35 lb",rest:"→",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suitcase_carry.mp4"},
          {name:"Side Plank",sets:"3 rounds",reps:"30s/side",load:"BW · knee",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/sideplankhold.mp4"},
        ],
        c:[
          {name:"Alt Reverse Lunge",sets:"10 min",reps:"10/min",load:"BW",rest:"~35s built-in",note:"Lunge EMOM 10 min · C block",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/alt_reverse_lunge.mp4"},
        ],
        cooldown:[
          {name:"Lat Hang",sets:"",reps:"45s",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
          {name:"Band Chest Stretch",sets:"",reps:"60s/side",load:"",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_chest_stretch.mp4"},
          {name:"Supine Twist",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_twist.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"",path:""},
        ],
      },
      P2:{
        warmup:[
          {name:"Arm Circles + Shoulder CARs",sets:"10/dir",reps:"",load:"BW",rest:"",note:"unchanged",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/shoulder_cars.mp4"},
          {name:"Band Face Pull",sets:"2×12",reps:"",load:"Lt band",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_face_pull.mp4"},
          {name:"Band Dislocates",sets:"2×10",reps:"",load:"",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_dislocates.mp4"},
          {name:"Cat-Cow",sets:"10 reps",reps:"",load:"BW",rest:"",note:"→ ISO",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/cat_cow.mp4"},
        ],
        a:[
          {name:"Push-Up",sets:"4 sets",reps:"12–15",load:"BW · feet on bench",rest:"→",note:"ISO rests 1+2",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pushup.mp4"},
          {name:"KB Floor Press",sets:"4 sets",reps:"6/side",load:"35 lb",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_floor_press.mp4"},
        ],
        b:[
          {name:"Pallof Press",sets:"3 rounds",reps:"10/side · 3s hold",load:"Lt band",rest:"→",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pallof_press.mp4"},
          {name:"Suitcase KB Carry",sets:"3 rounds",reps:"30s/side",load:"35+26 lb",rest:"→",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suitcase_carry.mp4"},
          {name:"Side Plank",sets:"3 rounds",reps:"30s/side",load:"BW · feet stacked",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/sideplankhold.mp4"},
        ],
        c:[
          {name:"Alt Reverse Lunge",sets:"10 min",reps:"10/min",load:"26 lb",rest:"~30s",note:"Lunge EMOM +26 lb · ~30s rest",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/alt_reverse_lunge.mp4"},
        ],
        cooldown:[
          {name:"Lat Hang",sets:"",reps:"45s",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
          {name:"Band Chest Stretch",sets:"",reps:"60s/side",load:"",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_chest_stretch.mp4"},
          {name:"Supine Twist",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_twist.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"",path:""},
        ],
      },
      P3:{
        warmup:[
          {name:"Arm Circles + Shoulder CARs",sets:"10/dir",reps:"",load:"BW",rest:"",note:"unchanged",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/shoulder_cars.mp4"},
          {name:"Band Face Pull",sets:"2×12",reps:"",load:"",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_face_pull.mp4"},
          {name:"Band Dislocates",sets:"2×10",reps:"",load:"",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_dislocates.mp4"},
          {name:"Cat-Cow",sets:"10 reps",reps:"",load:"BW",rest:"",note:"→ ISO",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/cat_cow.mp4"},
        ],
        a:[
          {name:"Push-Up",sets:"4 sets",reps:"10–12",load:"BW · 3s+2s pause",rest:"→",note:"No SSC — dead stop at bottom",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pushup.mp4"},
          {name:"KB Floor Press",sets:"3 sets",reps:"6/side",load:"44 lb",rest:"60s",note:"44 lb · 3s descent + 2s pause",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_floor_press.mp4"},
        ],
        b:[
          {name:"Pallof Press",sets:"2 rounds",reps:"10/side · 3s+step",load:"Med band",rest:"→",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pallof_press.mp4"},
          {name:"Suitcase KB Carry",sets:"2 rounds",reps:"30s/side",load:"35 lb",rest:"→",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suitcase_carry.mp4"},
          {name:"Side Plank",sets:"2 rounds",reps:"30s/side",load:"BW +reach",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/sideplankhold.mp4"},
        ],
        c:[
          {name:"Alt Reverse Lunge",sets:"10 min",reps:"12/min",load:"26 lb",rest:"~25s",note:"Lunge EMOM 12/min · ~25s rest",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/alt_reverse_lunge.mp4"},
        ],
        cooldown:[
          {name:"Lat Hang",sets:"",reps:"45s",load:"BW",rest:"",note:"unchanged",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
          {name:"Band Chest Stretch",sets:"",reps:"60s/side",load:"",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_chest_stretch.mp4"},
          {name:"Supine Twist",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_twist.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"",path:""},
        ],
      },
      P4:{
        warmup:[
          {name:"Arm Circles + Shoulder CARs",sets:"10/dir",reps:"",load:"BW",rest:"",note:"Full deload",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/shoulder_cars.mp4"},
          {name:"Band Face Pull",sets:"2×12",reps:"",load:"Lt band",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_face_pull.mp4"},
          {name:"Band Dislocates",sets:"2×10",reps:"",load:"Lt band",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_dislocates.mp4"},
          {name:"Cat-Cow",sets:"10 reps",reps:"",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/cat_cow.mp4"},
        ],
        a:[
          {name:"Push-Up",sets:"3 sets",reps:"10",load:"BW · knuckle",rest:"→",note:"Back to P1 — deload",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pushup.mp4"},
          {name:"KB Floor Press",sets:"3 sets",reps:"5",load:"35 lb",rest:"60s",note:"3×5 · 35 lb",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_floor_press.mp4"},
        ],
        b:[
          {name:"Pallof Press",sets:"2 rounds",reps:"10/side · 2s hold",load:"Lt band",rest:"→",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pallof_press.mp4"},
          {name:"Suitcase KB Carry",sets:"2 rounds",reps:"30s/side",load:"35 lb",rest:"→",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suitcase_carry.mp4"},
          {name:"Side Plank",sets:"2 rounds",reps:"30s/side",load:"BW · knee",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/sideplankhold.mp4"},
        ],
        c:[
          {name:"Alt Reverse Lunge",sets:"6 min",reps:"8/min",load:"BW",rest:"",note:"6 min · BW · 8/min · deload",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/alt_reverse_lunge.mp4"},
        ],
        cooldown:[
          {name:"Lat Hang",sets:"",reps:"45s",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
          {name:"Band Chest Stretch",sets:"",reps:"60s/side",load:"",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_chest_stretch.mp4"},
          {name:"Supine Twist",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_twist.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"",path:""},
        ],
      },
    }
  },
  // ==========================================================
  // WEDNESDAY  —  Full Body Metabolic
  // ==========================================================
  {
    id:"wed", label:"Wed", name:"Full Body Metabolic",
    phases:{
      P1:{
        warmup:[
          {name:"Suspension Hip Hinge",sets:"8 reps",reps:"",load:"under bar",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_hip_hinge.mp4"},
          {name:"World's Greatest Stretch",sets:"5/side",reps:"",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/worlds_greatest_stretch.mp4"},
          {name:"Glute Bridge",sets:"15 reps",reps:"",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/glute_bridge.mp4"},
          {name:"KB Deadlift Light",sets:"2×6",reps:"",load:"18 lb",rest:"→ ISO 3×45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_deadlift_light.mp4"},
        ],
        a:[
          {name:"Hanging Knee Raise",sets:"3 sets",reps:"12–15",load:"BW",rest:"→",note:"Tower Blast 3 rounds · first · grip fresh",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hanging_knee_raise.mp4"},
          {name:"Band Tricep Pushdown",sets:"3 sets",reps:"12–15",load:"Med band",rest:"→",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_tricep_pushdown.mp4"},
          {name:"Lateral Box Step-Over",sets:"3 sets",reps:"8/side",load:"BW",rest:"60s",note:"Then 90s seated rest before Burpee",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lateral_box_stepover.mp4"},
        ],
        b:[
          {name:"KB Two-Hand Swing",sets:"5 rounds",reps:"15",load:"35 lb",rest:"→",note:"Humane Burpee 5 rounds",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_two_hand_swing.mp4"},
          {name:"Goblet Squat",sets:"5 rounds",reps:"5-4-3-2-1",load:"35 lb",rest:"→",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/goblet_squat.mp4"},
          {name:"Mountain Climbers",sets:"5 rounds",reps:"10–2",load:"BW",rest:"90s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/mountain_climbers.mp4"},
        ],
        cooldown:[
          {name:"Lat Hang",sets:"",reps:"45s",load:"under bar",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
          {name:"Low Lunge / Couch Stretch",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/low_lunge.mp4"},
          {name:"Legs Elevated on Bench",sets:"",reps:"3 min",load:"BW",rest:"",note:"parasympathetic",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/legs_elevated_on_bench.mp4"},
          {name:"Supine Twist",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_twist.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"",path:""},
        ],
      },
      P2:{
        warmup:[
          {name:"Suspension Hip Hinge",sets:"8 reps",reps:"",load:"under bar",rest:"",note:"unchanged",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_hip_hinge.mp4"},
          {name:"World's Greatest Stretch",sets:"5/side",reps:"",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/worlds_greatest_stretch.mp4"},
          {name:"Glute Bridge",sets:"15 reps",reps:"",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/glute_bridge.mp4"},
          {name:"KB DL Light",sets:"2×6",reps:"",load:"18 lb → ISO 3×45s",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_deadlift_light.mp4"},
        ],
        a:[
          {name:"Hanging Knee Raise",sets:"4 rounds",reps:"12–15 · knees to chest",load:"BW",rest:"→",note:"Tower Blast 4 rounds · +HVY BAND · +26 lb STEP",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hanging_knee_raise.mp4"},
          {name:"Band Tricep Pushdown",sets:"4 rounds",reps:"15",load:"Hvy band",rest:"→",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_tricep_pushdown.mp4"},
          {name:"Lateral Box Step-Over",sets:"4 rounds",reps:"8/side",load:"BW",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lateral_box_stepover.mp4"},
        ],
        b:[
          {name:"KB Two-Hand Swing",sets:"5 rounds",reps:"15",load:"44 lb",rest:"→",note:"Humane Burpee 44 lb swing · 75s rest",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_two_hand_swing.mp4"},
          {name:"Goblet Squat",sets:"5 rounds",reps:"5-4-3-2-1",load:"35 lb",rest:"→",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/goblet_squat.mp4"},
          {name:"Mountain Climbers",sets:"5 rounds",reps:"12–4",load:"BW",rest:"75s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/mountain_climbers.mp4"},
        ],
        cooldown:[
          {name:"Lat Hang",sets:"",reps:"45s",load:"under bar",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
          {name:"Low Lunge / Couch Stretch",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/low_lunge.mp4"},
          {name:"Legs Elevated on Bench",sets:"",reps:"3 min",load:"BW",rest:"",note:"parasympathetic",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/legs_elevated_on_bench.mp4"},
          {name:"Supine Twist",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_twist.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"unchanged from P1",path:""},
        ],
      },
      P3:{
        warmup:[
          {name:"Suspension Hip Hinge",sets:"8 reps",reps:"",load:"under bar",rest:"",note:"unchanged",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_hip_hinge.mp4"},
          {name:"World's Greatest Stretch",sets:"5/side",reps:"",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/worlds_greatest_stretch.mp4"},
          {name:"Glute Bridge",sets:"15 reps",reps:"",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/glute_bridge.mp4"},
          {name:"KB DL Light",sets:"2×6",reps:"",load:"18 lb → ISO 3×45s",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_deadlift_light.mp4"},
        ],
        a:[
          {name:"Hanging Knee Raise",sets:"3 rounds",reps:"12–15 · straight-leg",load:"BW",rest:"→",note:"Tower Blast 4 rounds · HVY BAND · 26 lb STEP",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hanging_knee_raise.mp4"},
          {name:"Band Tricep Pushdown",sets:"3 rounds",reps:"15",load:"Hvy band",rest:"→",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_tricep_pushdown.mp4"},
          {name:"Lateral Box Step-Over",sets:"3 rounds",reps:"8/side",load:"26 lb",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lateral_box_stepover.mp4"},
        ],
        b:[
          {name:"KB Two-Hand Swing",sets:"4 rounds",reps:"15",load:"44 lb",rest:"→",note:"Humane Burpee 4 rounds · 60s rest",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_two_hand_swing.mp4"},
          {name:"Goblet Squat",sets:"4 rounds",reps:"5-4-3-2-1",load:"35 lb",rest:"→",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/goblet_squat.mp4"},
          {name:"Mountain Climbers",sets:"4 rounds",reps:"12–4",load:"BW",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/mountain_climbers.mp4"},
        ],
        cooldown:[
          {name:"Lat Hang",sets:"",reps:"45s",load:"under bar",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
          {name:"Low Lunge / Couch Stretch",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/low_lunge.mp4"},
          {name:"Legs Elevated on Bench",sets:"",reps:"3 min",load:"BW",rest:"",note:"parasympathetic",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/legs_elevated_on_bench.mp4"},
          {name:"Supine Twist",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_twist.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"unchanged from P1",path:""},
        ],
      },
      P4:{
        warmup:[
          {name:"Suspension Hip Hinge",sets:"8 reps",reps:"",load:"under bar",rest:"",note:"Full deload",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_hip_hinge.mp4"},
          {name:"World's Greatest Stretch",sets:"5/side",reps:"",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/worlds_greatest_stretch.mp4"},
          {name:"Glute Bridge",sets:"15 reps",reps:"",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/glute_bridge.mp4"},
          {name:"KB DL Light",sets:"2×6",reps:"",load:"18 lb",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_deadlift_light.mp4"},
        ],
        a:[
          {name:"Hanging Knee Raise",sets:"3 rounds",reps:"12–15",load:"BW",rest:"→",note:"deload — back to P1",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hanging_knee_raise.mp4"},
          {name:"Band Tricep Pushdown",sets:"3 rounds",reps:"12–15",load:"Med band",rest:"→",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_tricep_pushdown.mp4"},
          {name:"Lateral Box Step-Over",sets:"3 rounds",reps:"8/side",load:"BW",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lateral_box_stepover.mp4"},
        ],
        b:[
          {name:"KB Two-Hand Swing",sets:"5 rounds",reps:"15",load:"35 lb",rest:"→",note:"Humane Burpee 5 rounds · 35 lb",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_two_hand_swing.mp4"},
          {name:"Goblet Squat",sets:"5 rounds",reps:"5-4-3-2-1",load:"35 lb",rest:"→",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/goblet_squat.mp4"},
          {name:"Mountain Climbers",sets:"5 rounds",reps:"10–2",load:"BW",rest:"90s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/mountain_climbers.mp4"},
        ],
        cooldown:[
          {name:"Lat Hang",sets:"",reps:"45s",load:"under bar",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lat_hang.mp4"},
          {name:"Low Lunge / Couch Stretch",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/low_lunge.mp4"},
          {name:"Legs Elevated on Bench",sets:"",reps:"3 min",load:"BW",rest:"",note:"parasympathetic",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/legs_elevated_on_bench.mp4"},
          {name:"Supine Twist",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_twist.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"unchanged from P1",path:""},
        ],
      },
    }
  },
  // ==========================================================
  // THURSDAY  —  Pull + TGU + Row
  // ==========================================================
  {
    id:"thu", label:"Thu", name:"Pull + TGU + Row",
    phases:{
      P1:{
        warmup:[
          {name:"Scapular Pull-Up",sets:"3×10",reps:"",load:"BW",rest:"20s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/scapular_pullup.mp4"},
          {name:"Suspension Row",sets:"2×8",reps:"",load:"BW · 65–70°",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_row.mp4"},
          {name:"KB Halo",sets:"5/dir",reps:"",load:"8 kg",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_halo.mp4"},
          {name:"Hip Flexor March",sets:"10/side",reps:"",load:"BW",rest:"→ ISO",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_flexor_march.mp4"},
        ],
        a:[
          {name:"Scapular Pull-Up",sets:"3 sets",reps:"10",load:"BW",rest:"20s",note:"Pull Progression · shrug down+back · zero elbow",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/scapular_pullup.mp4"},
          {name:"Neutral-Grip Slow Negative",sets:"4 sets",reps:"3–5 · 5s lower",load:"BW",rest:"90s",note:"ISO rests 3+4 only — skip 1+2 (tendon cold)",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/neutral_grip_slow_negative.mp4"},
        ],
        b:[
          {name:"Turkish Get-Up",sets:"1 set",reps:"3/side",load:"8 kg",rest:"breath rest",note:"Before row · self-paced · ⚠️ Wrist 21d gate — every transition counts",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/turkish_getup.mp4"},
        ],
        c:[
          {name:"Bench-Supported Row",sets:"3 rounds",reps:"8/side",load:"35 lb",rest:"→",note:"Bench Row + Rollout 3 rounds · 100% lat",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/bench_supported_row.mp4"},
          {name:"Stability Ball Rollout",sets:"3 rounds",reps:"8",load:"BW",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/stability_ball_rollout.mp4"},
        ],
        cooldown:[
          {name:"Thread-the-Needle",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/thread_the_needle.mp4"},
          {name:"Seated Hamstring Stretch",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/seated_hamstring_stretch.mp4"},
          {name:"Box Breathing",sets:"",reps:"3 min · 4-4-4-4",load:"",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_breathing.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"heavy pull day",path:""},
        ],
      },
      P2:{
        warmup:[
          {name:"Scapular Pull-Up",sets:"3×10",reps:"",load:"BW",rest:"20s",note:"SUSP ROW · BW+8LB",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/scapular_pullup.mp4"},
          {name:"Suspension Row",sets:"2×8",reps:"",load:"BW+8lb",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_row.mp4"},
          {name:"KB Halo",sets:"5/dir",reps:"",load:"8 kg",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_halo.mp4"},
          {name:"Hip Flexor March",sets:"10/side",reps:"",load:"BW",rest:"→ ISO",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_flexor_march.mp4"},
        ],
        a:[
          {name:"Scapular Pull-Up",sets:"3 sets",reps:"10",load:"BW",rest:"20s",note:"Pull Progression",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/scapular_pullup.mp4"},
          {name:"Neutral-Grip Slow Negative",sets:"4 sets",reps:"3–5+1 chin · 5s lower",load:"BW",rest:"90s",note:"ISO rests 3+4 only",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/neutral_grip_slow_negative.mp4"},
        ],
        b:[
          {name:"Turkish Get-Up",sets:"1 set",reps:"4/side",load:"8 kg → test 26 lb",rest:"breath",note:"TEST 26 LB END OF PHASE · Wrist 21d gate",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/turkish_getup.mp4"},
        ],
        c:[
          {name:"Bench-Supported Row",sets:"3 rounds",reps:"8/side",load:"44 lb",rest:"→",note:"Bench Row + Rollout 44 lb",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/bench_supported_row.mp4"},
          {name:"Stability Ball Rollout",sets:"3 rounds",reps:"8",load:"BW",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/stability_ball_rollout.mp4"},
        ],
        cooldown:[
          {name:"Thread-the-Needle",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/thread_the_needle.mp4"},
          {name:"Seated Hamstring Stretch",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/seated_hamstring_stretch.mp4"},
          {name:"Box Breathing",sets:"",reps:"3 min",load:"",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_breathing.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"",path:""},
        ],
      },
      P3:{
        warmup:[
          {name:"Scapular Pull-Up",sets:"3×10",reps:"",load:"BW",rest:"",note:"unchanged from P2",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/scapular_pullup.mp4"},
          {name:"Suspension Row",sets:"2×8",reps:"",load:"BW+8lb",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_row.mp4"},
          {name:"KB Halo",sets:"5/dir",reps:"",load:"8 kg",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_halo.mp4"},
          {name:"Hip Flexor March",sets:"10/side",reps:"",load:"BW",rest:"→ ISO",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_flexor_march.mp4"},
        ],
        a:[
          {name:"Scapular Pull-Up",sets:"2 sets",reps:"10",load:"BW",rest:"20s",note:"Pull Progression",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/scapular_pullup.mp4"},
          {name:"Neutral-Grip Slow Negative",sets:"3 sets",reps:"3–5+2 chins · 5s lower",load:"BW",rest:"90s",note:"ISO rests 3+4 only",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/neutral_grip_slow_negative.mp4"},
        ],
        b:[
          {name:"Turkish Get-Up",sets:"1 set",reps:"5/side",load:"26 lb",rest:"breath",note:"21D GATE · 26 lb · 21d wrist gate must be clear first",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/turkish_getup.mp4"},
        ],
        c:[
          {name:"Bench-Supported Row",sets:"2 rounds",reps:"8/side · 2s pause",load:"44 lb",rest:"→",note:"Bench Row +2s pause · 44 lb",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/bench_supported_row.mp4"},
          {name:"Stability Ball Rollout",sets:"2 rounds",reps:"8 · 3s hold",load:"BW",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/stability_ball_rollout.mp4"},
        ],
        cooldown:[
          {name:"Thread-the-Needle",sets:"",reps:"60s/side",load:"BW",rest:"",note:"unchanged",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/thread_the_needle.mp4"},
          {name:"Seated Hamstring Stretch",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/seated_hamstring_stretch.mp4"},
          {name:"Box Breathing",sets:"",reps:"3 min",load:"",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_breathing.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"",path:""},
        ],
      },
      P4:{
        warmup:[
          {name:"Scapular Pull-Up",sets:"3×10",reps:"",load:"BW",rest:"20s",note:"Full deload",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/scapular_pullup.mp4"},
          {name:"Suspension Row",sets:"2×8",reps:"",load:"BW",rest:"",note:"back to BW",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_row.mp4"},
          {name:"KB Halo",sets:"5/dir",reps:"",load:"8 kg",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_halo.mp4"},
          {name:"Hip Flexor March",sets:"10/side",reps:"",load:"BW",rest:"→ ISO",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_flexor_march.mp4"},
        ],
        a:[
          {name:"Scapular Pull-Up",sets:"3 sets",reps:"10",load:"BW",rest:"20s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/scapular_pullup.mp4"},
          {name:"Neutral-Grip Slow Negative",sets:"3 sets",reps:"3/side · 5s lower",load:"BW",rest:"90s",note:"3/side · 8 kg · deload",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/neutral_grip_slow_negative.mp4"},
        ],
        b:[
          {name:"Turkish Get-Up",sets:"1 set",reps:"3/side",load:"8 kg",rest:"breath",note:"Back to 8 kg · self-paced · deload",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/turkish_getup.mp4"},
        ],
        c:[
          {name:"Bench-Supported Row",sets:"3 rounds",reps:"8/side",load:"35 lb",rest:"→",note:"3×8 · 35 lb · deload",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/bench_supported_row.mp4"},
          {name:"Stability Ball Rollout",sets:"3 rounds",reps:"8",load:"BW",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/stability_ball_rollout.mp4"},
        ],
        cooldown:[
          {name:"Thread-the-Needle",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/thread_the_needle.mp4"},
          {name:"Seated Hamstring Stretch",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/seated_hamstring_stretch.mp4"},
          {name:"Box Breathing",sets:"",reps:"3 min",load:"",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_breathing.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"",path:""},
        ],
      },
    }
  },
  // ==========================================================
  // FRIDAY  —  Unilateral Lower + Density
  // ==========================================================
  {
    id:"fri", label:"Fri", name:"Unilateral Lower + Density",
    phases:{
      P1:{
        warmup:[
          {name:"Leg + Lateral Swings",sets:"10/dir",reps:"",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/leg_lateral_swings.mp4"},
          {name:"Band Face Pull",sets:"2×12",reps:"",load:"Lt band",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_face_pull.mp4"},
          {name:"Suspension Lunge",sets:"6/side",reps:"",load:"BW",rest:"",note:"near-vertical",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_lunge.mp4"},
          {name:"Lateral Band Walk",sets:"10/side",reps:"",load:"BW",rest:"→ ISO",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lateral_band_walk.mp4"},
        ],
        a:[
          {name:"KB Lumberjack Squat",sets:"3 sets",reps:"8",load:"35 lb",rest:"90s · ISO 1+2",note:"Unilateral Lower · NOT supersetted",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_lumberjack_squat.mp4"},
          {name:"Bulgarian Split Squat",sets:"4 sets",reps:"8/side",load:"BW only",rest:"90s",note:"Learn position — BW only this phase",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/bulgarian_squat.mp4"},
          {name:"Single-Leg Deadlift",sets:"3 sets",reps:"8/side",load:"35 lb",rest:"→ Bridge",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/single_leg_deadlift.mp4"},
        ],
        b:[
          {name:"Suitcase Carry",sets:"2 rounds",reps:"20s/side",load:"35 lb",rest:"→ B",note:"Carry Bridge → Block B",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suitcase_carry.mp4"},
        ],
        c:[
          {name:"Overspeed KB Swing",sets:"6 rounds",reps:"30s on",load:"35 lb",rest:"15s",note:"Density Circuit 6 rounds · 30s on / 15s off",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/overspeed_kb_swing.mp4"},
          {name:"KB Swing-to-Squat Catch",sets:"6 rounds",reps:"30s on",load:"35 lb",rest:"15s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_swing_squat_catch.mp4"},
          {name:"Box Step-Down Eccentric",sets:"6 rounds",reps:"30s · 3s lower",load:"BW",rest:"15s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_step_down_eccentric.mp4"},
        ],
        cooldown:[
          {name:"Box Hip Flexor Stretch",sets:"",reps:"75s/side",load:"BW · box 16in",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_hip_flexor_stretch.mp4"},
          {name:"Supine Figure-4",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_figure4.mp4"},
          {name:"Brettzel",sets:"",reps:"60s/side",load:"BW",rest:"",note:"close the week",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/brettzel.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"end-of-week reset",path:""},
        ],
      },
      P2:{
        warmup:[
          {name:"Leg + Lateral Swings",sets:"10/dir",reps:"",load:"BW",rest:"",note:"unchanged",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/leg_lateral_swings.mp4"},
          {name:"Band Face Pull",sets:"2×12",reps:"",load:"",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_face_pull.mp4"},
          {name:"Suspension Lunge",sets:"6/side",reps:"",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_lunge.mp4"},
          {name:"Lateral Band Walk",sets:"10/side",reps:"",load:"BW",rest:"→ ISO",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lateral_band_walk.mp4"},
        ],
        a:[
          {name:"KB Lumberjack Squat",sets:"4 sets",reps:"8 · 3s ecc",load:"35 lb",rest:"90s · ISO 1+2",note:"Bulgarian +26 lb · Lumberjack 4 sets",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_lumberjack_squat.mp4"},
          {name:"Bulgarian Split Squat",sets:"4 sets",reps:"6/side",load:"26 lb farmer",rest:"90s",note:"Farmer hold — wrist-safe · vertical shin",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/bulgarian_squat.mp4"},
          {name:"Single-Leg Deadlift",sets:"3 sets",reps:"8/side",load:"26 lb",rest:"→ Bridge",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/single_leg_deadlift.mp4"},
        ],
        b:[
          {name:"Suitcase Carry",sets:"2 rounds",reps:"20s/side",load:"35 lb",rest:"→ B",note:"Carry Bridge",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suitcase_carry.mp4"},
        ],
        c:[
          {name:"Overspeed KB Swing",sets:"6 rounds",reps:"30s on · throw-down",load:"35 lb",rest:"15s",note:"Density Circuit 6 rounds",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/overspeed_kb_swing.mp4"},
          {name:"KB Swing-to-Squat Catch",sets:"6 rounds",reps:"30s on · 1s hold",load:"35 lb",rest:"15s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_swing_squat_catch.mp4"},
          {name:"Box Step-Down Eccentric",sets:"6 rounds",reps:"30s · 3s lower",load:"18 lb",rest:"15s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_step_down_eccentric.mp4"},
        ],
        cooldown:[
          {name:"Box Hip Flexor Stretch",sets:"",reps:"75s/side",load:"BW",rest:"",note:"unchanged",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_hip_flexor_stretch.mp4"},
          {name:"Supine Figure-4",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_figure4.mp4"},
          {name:"Brettzel",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/brettzel.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"",path:""},
        ],
      },
      P3:{
        warmup:[
          {name:"Leg + Lateral Swings",sets:"10/dir",reps:"",load:"BW",rest:"",note:"unchanged",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/leg_lateral_swings.mp4"},
          {name:"Band Face Pull",sets:"2×12",reps:"",load:"",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_face_pull.mp4"},
          {name:"Suspension Lunge",sets:"6/side",reps:"",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_lunge.mp4"},
          {name:"Lateral Band Walk",sets:"10/side",reps:"",load:"BW",rest:"→ ISO",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lateral_band_walk.mp4"},
        ],
        a:[
          {name:"KB Lumberjack Squat",sets:"3 sets",reps:"8 · 3s+2s pause",load:"35 lb",rest:"90s · ISO 1+2",note:"2×26 lb Bulgarian · 45 eccentric",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_lumberjack_squat.mp4"},
          {name:"Bulgarian Split Squat",sets:"3 sets",reps:"5/side",load:"2×26 lb farmer",rest:"90s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/bulgarian_squat.mp4"},
          {name:"Single-Leg Deadlift",sets:"2 sets",reps:"8/side · 2s pause",load:"26 lb",rest:"→ Bridge",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/single_leg_deadlift.mp4"},
        ],
        b:[
          {name:"Suitcase Carry",sets:"2 rounds",reps:"20s/side",load:"35 lb",rest:"→ B",note:"Carry Bridge",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suitcase_carry.mp4"},
        ],
        c:[
          {name:"Overspeed KB Swing",sets:"5 rounds",reps:"30s on · 21d gate",load:"35 lb",rest:"15s",note:"Density Circuit 5 rounds · MAX G-FORCE GATE",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/overspeed_kb_swing.mp4"},
          {name:"KB Swing-to-Squat Catch",sets:"5 rounds",reps:"30s on · 2s hold",load:"35 lb",rest:"15s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_swing_squat_catch.mp4"},
          {name:"Box Step-Down Eccentric",sets:"5 rounds",reps:"30s · 4s lower",load:"26 lb",rest:"15s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_step_down_eccentric.mp4"},
        ],
        cooldown:[
          {name:"Box Hip Flexor Stretch",sets:"",reps:"75s/side",load:"BW",rest:"",note:"unchanged",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_hip_flexor_stretch.mp4"},
          {name:"Supine Figure-4",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_figure4.mp4"},
          {name:"Brettzel",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/brettzel.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"",path:""},
        ],
      },
      P4:{
        warmup:[
          {name:"Leg + Lateral Swings",sets:"10/dir",reps:"",load:"BW",rest:"",note:"Full deload",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/leg_lateral_swings.mp4"},
          {name:"Band Face Pull",sets:"2×12",reps:"",load:"Lt band",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_face_pull.mp4"},
          {name:"Suspension Lunge",sets:"6/side",reps:"",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_lunge.mp4"},
          {name:"Lateral Band Walk",sets:"10/side",reps:"",load:"BW",rest:"→ ISO",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lateral_band_walk.mp4"},
        ],
        a:[
          {name:"KB Lumberjack Squat",sets:"3 sets",reps:"8",load:"35 lb",rest:"90s · ISO 1+2",note:"back to P1 loads",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_lumberjack_squat.mp4"},
          {name:"Bulgarian Split Squat",sets:"4 sets",reps:"6",load:"BW",rest:"90s",note:"4×6 · BW · deload",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/bulgarian_squat.mp4"},
          {name:"Single-Leg Deadlift",sets:"2 sets",reps:"8/side",load:"26 lb",rest:"→ Bridge",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/single_leg_deadlift.mp4"},
        ],
        b:[
          {name:"Suitcase Carry",sets:"2 rounds",reps:"20s/side",load:"35 lb",rest:"→ B",note:"Carry Bridge",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suitcase_carry.mp4"},
        ],
        c:[
          {name:"Overspeed KB Swing",sets:"4 rounds",reps:"30s on",load:"35 lb",rest:"15s",note:"Density Circuit 4 rounds · 35 lb",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/overspeed_kb_swing.mp4"},
          {name:"KB Swing-to-Squat Catch",sets:"4 rounds",reps:"30s on",load:"35 lb",rest:"15s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_swing_squat_catch.mp4"},
          {name:"Box Step-Down Eccentric",sets:"4 rounds",reps:"30s · 3s lower",load:"BW",rest:"15s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_step_down_eccentric.mp4"},
        ],
        cooldown:[
          {name:"Box Hip Flexor Stretch",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_hip_flexor_stretch.mp4"},
          {name:"Supine Figure-4",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_figure4.mp4"},
          {name:"Brettzel",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/brettzel.mp4"},
          {name:"Grip Recovery",sets:"",reps:"30s",load:"",rest:"",note:"end-of-week reset",path:""},
        ],
      },
    }
  },
  // -- REST DAYS --------------------------------------------
  {id:"sat",label:"Sat",name:"Rest Day",rest:true,restMessage:"Rest & recover.\nWalk, stretch, hydrate — you've earned it."},
  {id:"sun",label:"Sun",name:"Rest Day",rest:true,restMessage:"Rest & recover.\nZone 2 walk optional — 30–40 min conversational pace."},
];


// ===========================================================
//  TEJASWI'S 12-WEEK POSTPARTUM FAT LOSS PROGRAM
//  3 days/week Mon/Wed/Fri · Full Body · 6kg KB
//  P1 Restore (Wk1-3) → P2 Build (Wk4-7) → P3 Strengthen (Wk8-11) → P4 Deload (Wk12)
//  No spinal flexion · Pelvic floor priority · Silent/low-impact
// ===========================================================
const WEEK_META_T = [
  {w:1, p:"TP1",name:"Restore",  color:"#4ADE80",bg:"rgba(74,222,128,.07)",  desc:"Breathing · Pelvic floor · BW patterns only — no load"},
  {w:2, p:"TP1",name:"Restore",  color:"#4ADE80",bg:"rgba(74,222,128,.07)",  desc:"Breathing · Pelvic floor · BW patterns only — no load"},
  {w:3, p:"TD1",name:"Deload",   color:"#94A3B8",bg:"rgba(148,163,184,.06)", desc:"Micro-deload — reduce volume, maintain patterns"},
  {w:4, p:"TP2",name:"Build",    color:"#38C8FF",bg:"rgba(56,200,255,.07)",  desc:"Introduce 6kg load · Hip hinge · Carry · Press"},
  {w:5, p:"TP2",name:"Build",    color:"#38C8FF",bg:"rgba(56,200,255,.07)",  desc:"Introduce 6kg load · Hip hinge · Carry · Press"},
  {w:6, p:"TP2",name:"Build",    color:"#38C8FF",bg:"rgba(56,200,255,.07)",  desc:"Introduce 6kg load · Hip hinge · Carry · Press"},
  {w:7, p:"TD2",name:"Deload",   color:"#94A3B8",bg:"rgba(148,163,184,.06)", desc:"Micro-deload — reduce volume, maintain patterns"},
  {w:8, p:"TP3",name:"Strengthen",color:"#C8FF3E",bg:"rgba(200,255,62,.07)", desc:"Progressive load · Circuit training · Metabolic work"},
  {w:9, p:"TP3",name:"Strengthen",color:"#C8FF3E",bg:"rgba(200,255,62,.07)", desc:"Progressive load · Circuit training · Metabolic work"},
  {w:10,p:"TP3",name:"Strengthen",color:"#C8FF3E",bg:"rgba(200,255,62,.07)", desc:"Progressive load · Circuit training · Metabolic work"},
  {w:11,p:"TP3",name:"Strengthen",color:"#C8FF3E",bg:"rgba(200,255,62,.07)", desc:"Progressive load · Circuit training · Metabolic work"},
  {w:12,p:"TD3",name:"Deload",   color:"#94A3B8",bg:"rgba(148,163,184,.06)", desc:"Full deload — reassess, celebrate progress"},
];

const DELOAD_MAP_T = {TD1:"TP1", TD2:"TP2", TD3:"TP3"};

const DAYS_T = [
  // ── MONDAY — Full Body A ──────────────────────────────
  {
    id:"mon", label:"Mon", name:"Full Body A",
    phases:{
      TP1:{
        warmup:[
          {name:"Diaphragmatic Breathing",sets:"3 rounds",reps:"5 breaths",load:"BW",rest:"",note:"360° breath — ribs expand all directions · activate pelvic floor on exhale",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/diaphragmatic_breathing.mp4"},
          {name:"Pelvic Floor Activation",sets:"2 rounds",reps:"10 reps",load:"BW",rest:"",note:"Heel slides — gentle contraction and release",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pelvic_floor_activation.mp4"},
          {name:"Cat-Cow",sets:"2 rounds",reps:"8 reps",load:"BW",rest:"",note:"Coordinate breath with movement — mobilise the spine",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/cat_cow.mp4"},
          {name:"Dead Bug",sets:"1 round",reps:"5 each",load:"BW",rest:"",note:"Activate core before loading — slow and controlled",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/deadbugs.mp4"},
        ],
        a:[
          {name:"Glute Bridge",sets:"3 sets",reps:"12",load:"BW",rest:"60s",note:"Hold 2s at top · exhale on lift · pelvic floor engaged",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/glute_bridge.mp4"},
          {name:"KB Deadlift Light",sets:"3 sets",reps:"10",load:"6 kg",rest:"60s",note:"Hip hinge — push the floor away · neutral spine",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_deadlift_light.mp4"},
        ],
        b:[
          {name:"Modified Push-Up",sets:"3 sets",reps:"8",load:"BW",rest:"60s",note:"Kneeling — hands wide · exhale on push · no breath hold",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/modified_pushup.mp4"},
          {name:"Band Face Pull",sets:"3 sets",reps:"12",load:"Light band",rest:"60s",note:"Pull to nose · elbows high · retract scapula",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_face_pull.mp4"},
        ],
        c:[
          {name:"Dead Bug",sets:"2 sets",reps:"6 each",load:"BW",rest:"60s",note:"Lower back flat · exhale throughout · move slowly",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/deadbugs.mp4"},
          {name:"Bird Dog",sets:"2 sets",reps:"6 each",load:"BW",rest:"60s",note:"Opposite arm/leg · no rotation · exhale to extend",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/bird_dog.mp4"},
        ],
        cooldown:[
          {name:"Child's Pose",sets:"",reps:"60s",load:"BW",rest:"",note:"Arms extended · breathe into the back",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/childpose.mp4"},
          {name:"90/90 Hip Stretch",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_9090_rotation.mp4"},
          {name:"Thread-the-Needle",sets:"",reps:"45s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/thread_the_needle.mp4"},
          {name:"Box Breathing",sets:"",reps:"3 min",load:"BW",rest:"",note:"4-4-4-4 · close the session",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_breathing.mp4"},
        ],
      },
      TP2:{
        warmup:[
          {name:"Diaphragmatic Breathing",sets:"2 rounds",reps:"5 breaths",load:"BW",rest:"",note:"Re-establish breath pattern before loading",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/diaphragmatic_breathing.mp4"},
          {name:"Hip Circles",sets:"2 rounds",reps:"8 each",load:"BW",rest:"",note:"Standing — controlled rotation",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_circles.mp4"},
          {name:"Cat-Cow",sets:"2 rounds",reps:"8 reps",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/cat_cow.mp4"},
          {name:"Glute Bridge",sets:"2 rounds",reps:"10 reps",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/glute_bridge.mp4"},
        ],
        a:[
          {name:"Hip Thrust",sets:"3 sets",reps:"12",load:"6 kg",rest:"60s",note:"Bell on hips · shoulders on bench · 2s hold at top",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_thrust.mp4"},
          {name:"KB Romanian Deadlift",sets:"3 sets",reps:"10",load:"6 kg",rest:"60s",note:"Hinge from hip · soft knee · feel the hamstring",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_romanian_deadlift.mp4"},
          {name:"Goblet Squat",sets:"3 sets",reps:"10",load:"6 kg",rest:"60s",note:"Shallow depth · elbows inside knees · no breath hold",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/goblet_squat.mp4"},
        ],
        b:[
          {name:"Modified Push-Up",sets:"3 sets",reps:"10",load:"BW",rest:"60s",note:"Kneeling — progress toward full when ready",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/modified_pushup.mp4"},
          {name:"KB Halo",sets:"3 sets",reps:"8 each",load:"6 kg",rest:"60s",note:"Slow circles · decompress shoulder",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_halo.mp4"},
          {name:"Suitcase Carry",sets:"3 sets",reps:"20s/side",load:"6 kg",rest:"45s",note:"Stay tall · don't lean · brace gently",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suitcase_carry.mp4"},
        ],
        c:[
          {name:"Dead Bug",sets:"3 sets",reps:"8 each",load:"BW",rest:"45s",note:"Build reps gradually · exhale throughout",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/deadbugs.mp4"},
          {name:"Side Plank Modified",sets:"3 sets",reps:"20s/side",load:"BW",rest:"45s",note:"Kneeling — build to full side plank in P3",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/side_plank_modified.mp4"},
        ],
        cooldown:[
          {name:"Child's Pose",sets:"",reps:"60s",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/childpose.mp4"},
          {name:"90/90 Hip Stretch",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_9090_rotation.mp4"},
          {name:"Supine Twist",sets:"",reps:"45s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_twist.mp4"},
          {name:"Box Breathing",sets:"",reps:"3 min",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_breathing.mp4"},
        ],
      },
      TP3:{
        warmup:[
          {name:"Hip Circles",sets:"2 rounds",reps:"10 each",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_circles.mp4"},
          {name:"Lateral Band Walk",sets:"2 rounds",reps:"12/side",load:"Light loop",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lateral_band_walk.mp4"},
          {name:"Glute Bridge",sets:"2 rounds",reps:"12",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/glute_bridge.mp4"},
          {name:"Dead Bug",sets:"1 round",reps:"6 each",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/deadbugs.mp4"},
        ],
        a:[
          {name:"Hip Thrust",sets:"4 sets",reps:"12",load:"6 kg",rest:"60s",note:"2s hold at top · squeeze hard",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_thrust.mp4"},
          {name:"KB Romanian Deadlift",sets:"4 sets",reps:"10",load:"6 kg",rest:"60s",note:"3s eccentric — slow the down",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_romanian_deadlift.mp4"},
          {name:"Goblet Squat",sets:"3 sets",reps:"12",load:"6 kg",rest:"60s",note:"Full depth if comfortable",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/goblet_squat.mp4"},
          {name:"Single-Leg Deadlift",sets:"3 sets",reps:"8/side",load:"6 kg",rest:"60s",note:"Hinge and balance — slow",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/single_leg_deadlift.mp4"},
        ],
        b:[
          {name:"KB Floor Press",sets:"3 sets",reps:"10",load:"6 kg",rest:"60s",note:"Full ROM · pause at chest",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_floor_press.mp4"},
          {name:"Suspension Row",sets:"3 sets",reps:"10",load:"BW",rest:"60s",note:"Body angle determines difficulty",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_row.mp4"},
          {name:"KB Halo",sets:"3 sets",reps:"10 each",load:"6 kg",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_halo.mp4"},
        ],
        c:[
          {name:"Dead Bug",sets:"3 sets",reps:"10 each",load:"BW",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/deadbugs.mp4"},
          {name:"Side Plank Hold",sets:"3 sets",reps:"20s/side",load:"BW",rest:"45s",note:"Full side plank — build to 30s",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/sideplankhold.mp4"},
          {name:"Pallof Press",sets:"3 sets",reps:"10/side",load:"Light band",rest:"45s",note:"Anti-rotation — exhale on press",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pallof_press.mp4"},
        ],
        cooldown:[
          {name:"Pigeon Pose",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pigeon_pose.mp4"},
          {name:"Supine Twist",sets:"",reps:"45s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_twist.mp4"},
          {name:"Seated Hamstring Stretch",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/seated_hamstring_stretch.mp4"},
          {name:"Box Breathing",sets:"",reps:"3 min",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_breathing.mp4"},
        ],
      },
    }
  },
  // ── WEDNESDAY — Full Body B ────────────────────────────
  {
    id:"wed", label:"Wed", name:"Full Body B",
    phases:{
      TP1:{
        warmup:[
          {name:"Diaphragmatic Breathing",sets:"3 rounds",reps:"5 breaths",load:"BW",rest:"",note:"Reconnect breath and core",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/diaphragmatic_breathing.mp4"},
          {name:"Cat-Cow",sets:"2 rounds",reps:"8 reps",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/cat_cow.mp4"},
          {name:"Bird Dog",sets:"2 rounds",reps:"5 each",load:"BW",rest:"",note:"Slow and controlled — no rotation",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/bird_dog.mp4"},
          {name:"Hip Circles",sets:"2 rounds",reps:"8 each",load:"BW",rest:"",note:"Standing — warm the hip joint before loading",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_circles.mp4"},
        ],
        a:[
          {name:"Glute Bridge",sets:"3 sets",reps:"15",load:"BW",rest:"60s",note:"3s hold at top · march if comfortable",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/glute_bridge.mp4"},
          {name:"Step-Up",sets:"3 sets",reps:"10/side",load:"BW",rest:"60s",note:"Low step only (plyo box lowest) · drive through heel",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/step_up.mp4"},
        ],
        b:[
          {name:"Band Face Pull",sets:"3 sets",reps:"15",load:"Light band",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_face_pull.mp4"},
          {name:"KB Halo",sets:"3 sets",reps:"8 each",load:"6 kg",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_halo.mp4"},
        ],
        c:[
          {name:"90/90 Breathing",sets:"3 rounds",reps:"5 breaths",load:"BW",rest:"60s",note:"Legs at 90/90 on wall · exhale fully · pelvic floor release",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/90_90_breathing.mp4"},
          {name:"Dead Bug",sets:"2 sets",reps:"6 each",load:"BW",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/deadbugs.mp4"},
        ],
        cooldown:[
          {name:"Child's Pose",sets:"",reps:"90s",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/childpose.mp4"},
          {name:"Supine Figure-4",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_figure4.mp4"},
          {name:"Legs Elevated on Bench",sets:"",reps:"3 min",load:"BW",rest:"",note:"Parasympathetic reset",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/legs_elevated_on_bench.mp4"},
        ],
      },
      TP2:{
        warmup:[
          {name:"Hip Circles",sets:"2 rounds",reps:"8 each",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_circles.mp4"},
          {name:"Cat-Cow",sets:"2 rounds",reps:"8 reps",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/cat_cow.mp4"},
          {name:"Lateral Band Walk",sets:"2 rounds",reps:"10/side",load:"Light loop",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lateral_band_walk.mp4"},
          {name:"Dead Bug",sets:"1 round",reps:"5 each",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/deadbugs.mp4"},
        ],
        a:[
          {name:"Goblet Squat",sets:"3 sets",reps:"12",load:"6 kg",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/goblet_squat.mp4"},
          {name:"Step-Up",sets:"3 sets",reps:"10/side",load:"6 kg",rest:"60s",note:"Hold KB at chest · drive through heel",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/step_up.mp4"},
          {name:"KB Deadlift Light",sets:"3 sets",reps:"10",load:"6 kg",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_deadlift_light.mp4"},
        ],
        b:[
          {name:"KB One-Arm Press",sets:"3 sets",reps:"8/side",load:"6 kg",rest:"60s",note:"Standing · brace gently · exhale on press",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_one_arm_press.mp4"},
          {name:"Suspension Row",sets:"3 sets",reps:"10",load:"BW",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_row.mp4"},
          {name:"Pallof Press",sets:"3 sets",reps:"10/side",load:"Light band",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pallof_press.mp4"},
        ],
        c:[
          {name:"Bird Dog",sets:"3 sets",reps:"8 each",load:"BW",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/bird_dog.mp4"},
          {name:"90/90 Breathing",sets:"2 rounds",reps:"5 breaths",load:"BW",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/90_90_breathing.mp4"},
        ],
        cooldown:[
          {name:"Pigeon Pose",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pigeon_pose.mp4"},
          {name:"Thread-the-Needle",sets:"",reps:"45s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/thread_the_needle.mp4"},
          {name:"Legs Elevated on Bench",sets:"",reps:"3 min",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/legs_elevated_on_bench.mp4"},
        ],
      },
      TP3:{
        warmup:[
          {name:"Hip Circles",sets:"2 rounds",reps:"10 each",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_circles.mp4"},
          {name:"Lateral Band Walk",sets:"2 rounds",reps:"12/side",load:"Light loop",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lateral_band_walk.mp4"},
          {name:"Cat-Cow",sets:"2 rounds",reps:"8 reps",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/cat_cow.mp4"},
          {name:"Glute Bridge",sets:"2 rounds",reps:"12",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/glute_bridge.mp4"},
        ],
        a:[
          {name:"Goblet Squat",sets:"4 sets",reps:"12",load:"6 kg",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/goblet_squat.mp4"},
          {name:"Step-Up",sets:"3 sets",reps:"12/side",load:"6 kg",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/step_up.mp4"},
          {name:"KB Romanian Deadlift",sets:"4 sets",reps:"10",load:"6 kg",rest:"60s",note:"3s slow eccentric",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_romanian_deadlift.mp4"},
        ],
        b:[
          {name:"KB One-Arm Press",sets:"3 sets",reps:"10/side",load:"6 kg",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_one_arm_press.mp4"},
          {name:"Suspension Row",sets:"4 sets",reps:"12",load:"BW",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_row.mp4"},
          {name:"Suitcase Carry",sets:"3 sets",reps:"25s/side",load:"6 kg",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suitcase_carry.mp4"},
        ],
        c:[
          {name:"Dead Bug",sets:"3 sets",reps:"10 each",load:"BW",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/deadbugs.mp4"},
          {name:"Pallof Press",sets:"3 sets",reps:"12/side",load:"Light band",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pallof_press.mp4"},
          {name:"Side Plank Hold",sets:"3 sets",reps:"25s/side",load:"BW",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/sideplankhold.mp4"},
        ],
        cooldown:[
          {name:"Pigeon Pose",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pigeon_pose.mp4"},
          {name:"Supine Twist",sets:"",reps:"45s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_twist.mp4"},
          {name:"Supine Figure-4",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_figure4.mp4"},
          {name:"Box Breathing",sets:"",reps:"3 min",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/box_breathing.mp4"},
        ],
      },
    }
  },
  // ── FRIDAY — Full Body C ───────────────────────────────
  {
    id:"fri", label:"Fri", name:"Full Body C",
    phases:{
      TP1:{
        warmup:[
          {name:"Diaphragmatic Breathing",sets:"3 rounds",reps:"5 breaths",load:"BW",rest:"",note:"End of week — reconnect",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/diaphragmatic_breathing.mp4"},
          {name:"Pelvic Floor Activation",sets:"2 rounds",reps:"10 reps",load:"BW",rest:"",note:"Heel slides",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pelvic_floor_activation.mp4"},
          {name:"Hip Circles",sets:"2 rounds",reps:"8 each",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_circles.mp4"},
          {name:"Cat-Cow",sets:"2 rounds",reps:"8 reps",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/cat_cow.mp4"},
        ],
        a:[
          {name:"Glute Bridge",sets:"3 sets",reps:"12",load:"BW",rest:"60s",note:"Vary foot position — wide / narrow",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/glute_bridge.mp4"},
          {name:"Step-Up",sets:"3 sets",reps:"10/side",load:"BW",rest:"60s",note:"Low box · controlled descent",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/step_up.mp4"},
        ],
        b:[
          {name:"KB Halo",sets:"3 sets",reps:"8 each",load:"6 kg",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_halo.mp4"},
          {name:"Band Face Pull",sets:"3 sets",reps:"15",load:"Light band",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_face_pull.mp4"},
        ],
        c:[
          {name:"Bird Dog",sets:"3 sets",reps:"8 each",load:"BW",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/bird_dog.mp4"},
          {name:"90/90 Breathing",sets:"2 rounds",reps:"5 breaths",load:"BW",rest:"60s",note:"End of week reset",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/90_90_breathing.mp4"},
        ],
        cooldown:[
          {name:"Child's Pose",sets:"",reps:"90s",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/childpose.mp4"},
          {name:"Pigeon Pose",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pigeon_pose.mp4"},
          {name:"Supine Figure-4",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_figure4.mp4"},
          {name:"Legs Elevated on Bench",sets:"",reps:"3 min",load:"BW",rest:"",note:"End of week parasympathetic reset",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/legs_elevated_on_bench.mp4"},
        ],
      },
      TP2:{
        warmup:[
          {name:"Hip Circles",sets:"2 rounds",reps:"8 each",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_circles.mp4"},
          {name:"Glute Bridge",sets:"2 rounds",reps:"10",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/glute_bridge.mp4"},
          {name:"Lateral Band Walk",sets:"2 rounds",reps:"10/side",load:"Light loop",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lateral_band_walk.mp4"},
          {name:"Cat-Cow",sets:"2 rounds",reps:"8 reps",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/cat_cow.mp4"},
        ],
        a:[
          {name:"Hip Thrust",sets:"3 sets",reps:"12",load:"6 kg",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_thrust.mp4"},
          {name:"Goblet Squat",sets:"3 sets",reps:"10",load:"6 kg",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/goblet_squat.mp4"},
          {name:"Suitcase Carry",sets:"3 sets",reps:"20s/side",load:"6 kg",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suitcase_carry.mp4"},
        ],
        b:[
          {name:"Modified Push-Up",sets:"3 sets",reps:"10",load:"BW",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/modified_pushup.mp4"},
          {name:"KB One-Arm Press",sets:"3 sets",reps:"8/side",load:"6 kg",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_one_arm_press.mp4"},
          {name:"Band Face Pull",sets:"3 sets",reps:"15",load:"Light band",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/band_face_pull.mp4"},
        ],
        c:[
          {name:"Side Plank Modified",sets:"3 sets",reps:"20s/side",load:"BW",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/side_plank_modified.mp4"},
          {name:"Dead Bug",sets:"3 sets",reps:"8 each",load:"BW",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/deadbugs.mp4"},
        ],
        cooldown:[
          {name:"Child's Pose",sets:"",reps:"90s",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/childpose.mp4"},
          {name:"Pigeon Pose",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pigeon_pose.mp4"},
          {name:"Thread-the-Needle",sets:"",reps:"45s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/thread_the_needle.mp4"},
          {name:"Legs Elevated on Bench",sets:"",reps:"3 min",load:"BW",rest:"",note:"End of week reset",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/legs_elevated_on_bench.mp4"},
        ],
      },
      TP3:{
        warmup:[
          {name:"Hip Circles",sets:"2 rounds",reps:"10 each",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_circles.mp4"},
          {name:"Lateral Band Walk",sets:"2 rounds",reps:"12/side",load:"Light loop",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/lateral_band_walk.mp4"},
          {name:"Glute Bridge",sets:"2 rounds",reps:"12",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/glute_bridge.mp4"},
          {name:"Dead Bug",sets:"1 round",reps:"6 each",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/deadbugs.mp4"},
        ],
        a:[
          {name:"Hip Thrust",sets:"4 sets",reps:"15",load:"6 kg",rest:"60s",note:"2s hold · squeeze at top",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/hip_thrust.mp4"},
          {name:"Goblet Squat",sets:"3 sets",reps:"12",load:"6 kg",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/goblet_squat.mp4"},
          {name:"Step-Up",sets:"3 sets",reps:"12/side",load:"6 kg",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/step_up.mp4"},
          {name:"Suitcase Carry",sets:"3 sets",reps:"30s/side",load:"6 kg",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suitcase_carry.mp4"},
        ],
        b:[
          {name:"KB Floor Press",sets:"3 sets",reps:"10",load:"6 kg",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_floor_press.mp4"},
          {name:"Suspension Row",sets:"4 sets",reps:"12",load:"BW",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/suspension_row.mp4"},
          {name:"KB One-Arm Press",sets:"3 sets",reps:"10/side",load:"6 kg",rest:"60s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/kb_one_arm_press.mp4"},
        ],
        c:[
          {name:"Dead Bug",sets:"3 sets",reps:"10 each",load:"BW",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/deadbugs.mp4"},
          {name:"Side Plank Hold",sets:"3 sets",reps:"30s/side",load:"BW",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/sideplankhold.mp4"},
          {name:"Bird Dog",sets:"3 sets",reps:"10 each",load:"BW",rest:"45s",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/bird_dog.mp4"},
        ],
        cooldown:[
          {name:"Pigeon Pose",sets:"",reps:"75s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/pigeon_pose.mp4"},
          {name:"Seated Hamstring Stretch",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/seated_hamstring_stretch.mp4"},
          {name:"Supine Figure-4",sets:"",reps:"60s/side",load:"BW",rest:"",note:"",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/supine_figure4.mp4"},
          {name:"Legs Elevated on Bench",sets:"",reps:"3 min",load:"BW",rest:"",note:"End of week — full parasympathetic reset",path:"https://pub-64f509a2e7fd41e8a99344a43271fd4f.r2.dev/videos/legs_elevated_on_bench.mp4"},
        ],
      },
    }
  },
  // ── REST DAYS ──────────────────────────────────────────
  {id:"tue",label:"Tue",name:"Rest Day",rest:true,restMessage:"Active recovery today.\nWalk, gentle stretch, hydrate well."},
  {id:"thu",label:"Thu",name:"Rest Day",rest:true,restMessage:"Active recovery today.\nWalk, gentle stretch, hydrate well."},
  {id:"sat",label:"Sat",name:"Rest Day",rest:true,restMessage:"Rest & recover.\nYou showed up 3 times this week — well done."},
  {id:"sun",label:"Sun",name:"Rest Day",rest:true,restMessage:"Rest & recover.\nMonday is a new week — you've got this."},
];

// Tejaswi phase timer config
const PHASE_TIMER_T = {
  mon:{
    warmup:null,
    a:{ type:'rest', rest:60, totalSets:3, label:'REST between sets' },
    b:{ type:'rest', rest:60, totalSets:3, label:'REST between sets' },
    c:{ type:'circuit', totalSets:2, restAfterRound:60, label:'CORE RESTORE CIRCUIT',
        steps:[
          {name:'Dead Bug',        timer:'reps', cue:'Exhale throughout — no breath hold'},
          {name:'Bird Dog',        timer:'reps', cue:'Slow and controlled — no rotation'},
        ]},
    cooldown:{ type:'circuit', totalSets:1, restAfterRound:0, label:'COOL-DOWN',
      steps:[
        {name:"Child's Pose",            timer:'hold',      hold:60,  cue:'Breathe into the back'},
        {name:'90/90 Hip Stretch',       timer:'bilateral', hold:60, gap:5, cue:'Active transitions'},
        {name:'Thread-the-Needle',       timer:'bilateral', hold:45, gap:5, cue:'Follow the hand'},
        {name:'Box Breathing',           timer:'hold',      hold:180, cue:'4-4-4-4 close the session'},
      ]},
  },
  wed:{
    warmup:null,
    a:{ type:'rest', rest:60, totalSets:3, label:'REST between sets' },
    b:{ type:'rest', rest:60, totalSets:3, label:'REST between sets' },
    c:{ type:'circuit', totalSets:2, restAfterRound:60, label:'CORE RESTORE CIRCUIT',
        steps:[
          {name:'Bird Dog',         timer:'reps', cue:'Opposite arm/leg — no rotation'},
          {name:'90/90 Breathing',  timer:'hold', hold:60, cue:'Exhale fully — pelvic floor release'},
        ]},
    cooldown:{ type:'circuit', totalSets:1, restAfterRound:0, label:'COOL-DOWN',
      steps:[
        {name:'Pigeon Pose',             timer:'bilateral', hold:60, gap:5, cue:'Hip flexor release'},
        {name:'Thread-the-Needle',       timer:'bilateral', hold:45, gap:5, cue:''},
        {name:'Legs Elevated on Bench',  timer:'hold',      hold:180, cue:'Parasympathetic reset — eyes closed'},
      ]},
  },
  fri:{
    warmup:null,
    a:{ type:'rest', rest:60, totalSets:3, label:'REST between sets' },
    b:{ type:'rest', rest:60, totalSets:3, label:'REST between sets' },
    c:{ type:'circuit', totalSets:2, restAfterRound:60, label:'CORE RESTORE CIRCUIT',
        steps:[
          {name:'Bird Dog',         timer:'reps', cue:'Build control — end of week'},
          {name:'90/90 Breathing',  timer:'hold', hold:60, cue:'Full breath reset'},
        ]},
    cooldown:{ type:'circuit', totalSets:1, restAfterRound:0, label:'COOL-DOWN',
      steps:[
        {name:'Pigeon Pose',             timer:'bilateral', hold:75, gap:5, cue:'End of week — hold longer'},
        {name:'Supine Figure-4',         timer:'bilateral', hold:60, gap:5, cue:''},
        {name:'Legs Elevated on Bench',  timer:'hold',      hold:180, cue:'Full end-of-week parasympathetic reset'},
      ]},
  },
};

// Deload phases reuse previous phase with label override
const DELOAD_MAP = {D1:"P1", D2:"P2", D3:"P3"};

// Phase tab definitions per day
// Global state declared in index.html before module load


// ===========================================================
//  PHASE DEFINITIONS — tab structure for each day
// ===========================================================
const PHASE_DEFS = [
  {id:"warmup", label:"Warm-Up"},
  {id:"a",      label:"Block A"},
  {id:"b",      label:"Block B"},
  {id:"c",      label:"Block C"},
  {id:"cooldown",label:"Cool-Down"},
];

// ===========================================================
//  BILATERAL MAP — time-based exercises needing side timers
// ===========================================================
const BILATERAL_MAP = {
  // -- Timed holds (count-up per side) --
  "Side Plank Hold":           { type:'bilateral', hold:20, gapP1:5, holdByPhase:{P1:20,P2:30,P3:40,P4:20} },
  "Side Plank":                { type:'bilateral', hold:20, gapP1:5, holdByPhase:{P1:20,P2:30,P3:40,P4:20} },
  "Suitcase Carry":            { type:'bilateral', hold:20, gap:5  },
  "Suitcase KB Carry":         { type:'bilateral', hold:20, gap:5  },
  "Lat Hang":                  { type:'bilateral', hold:20, gap:5  },
  "90/90 Hip Stretch":         { type:'bilateral', hold:60, gap:5  },
  "Thread-the-Needle":         { type:'bilateral', hold:60, gap:5  },
  "Seated Hamstring Stretch":  { type:'bilateral', hold:75, gap:5  },
  "Pigeon Pose":               { type:'bilateral', hold:60, gap:5  },
  "Supine Figure-4":           { type:'bilateral', hold:75, gap:5  },
  "Box Hip Flexor Stretch":    { type:'bilateral', hold:75, gap:5  },
  "Brettzel":                  { type:'bilateral', hold:60, gap:5  },
  "Low Lunge / Couch Stretch": { type:'bilateral', hold:75, gap:5  },
  "Supine Twist":              { type:'bilateral', hold:60, gap:5  },
  "Standing Quad Stretch":     { type:'bilateral', hold:30, gap:5  },
  "Wrist Flexor Stretch":      { type:'bilateral', hold:30, gap:5  },
  "Lat Stretch (on tower)":    { type:'bilateral', hold:45, gap:5  },
  "Hip Flexor March":          { type:'bilateral', hold:0,  gap:0, note:"10/side — pace yourself" },

  // -- Reps per side (no hold timer, just RIGHT/LEFT prompt) --
  "KB Floor Press":            { type:'sides', restBetweenSides:30,
                                  note:"Complete all reps RIGHT → 30s → LEFT → rest" },
  "KB Single-Arm Press":       { type:'sides', restBetweenSides:20 },
  "Pallof Press":              { type:'sides', restBetweenSides:15 },
  "Bench-Supported Row":       { type:'sides', restBetweenSides:15 },
  "KB Bent-Over Row":          { type:'sides', restBetweenSides:15 },
  "KB Bicep Curl":             { type:'sides', restBetweenSides:10 },
  "KB Alternating Clean":      { type:'sides', restBetweenSides:0,  note:"Alternating — no side rest needed" },
  "Bulgarian Split Squat":     { type:'sides', restBetweenSides:15 },
  "Single-Leg Deadlift":       { type:'sides', restBetweenSides:15 },
  "Step-Up (Plyo Box 20\")":   { type:'sides', restBetweenSides:10 },
  "Single-Leg Glute Bridge":   { type:'sides', restBetweenSides:10 },
  "KB Lumberjack Squat":       { type:'sides', restBetweenSides:0,  note:"Bilateral — both feet, no side split" },
  "Suspension Lunge":          { type:'sides', restBetweenSides:5  },
  "KB One-Arm Swing":          { type:'sides', restBetweenSides:0,  note:"Alternate sets not sides" },
  "KB Clean & Press":          { type:'sides', restBetweenSides:15 },
  "Overspeed KB Swing":        { type:'sides', restBetweenSides:0,  note:"Single arm — alternate each round" },
  "Lat Hang Stretch":          { type:'bilateral', hold:20, gap:5  },

  // -- Self-paced (shows prompt only) --
  "Turkish Get-Up":            { type:'selfpaced', note:"Breathe between sides — no rush" },
  "Dead Hang":                 { type:'selfpaced', note:"Both arms — decompress the spine" },
};

// Helper: get bilateral config for an exercise at current week
function getBilateralCfg(exName){
  const cfg = BILATERAL_MAP[exName];
  if(!cfg) return null;
  const wm = getWM(currentWeek);
  const p  = DELOAD_MAP[wm.p] || wm.p;
  const result = Object.assign({}, cfg);
  if(cfg.holdByPhase) result.hold = cfg.holdByPhase[p] || cfg.hold;
  return result;
}
