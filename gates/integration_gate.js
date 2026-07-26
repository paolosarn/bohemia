/* ============================================================================
   INTEGRATION GATE (7/26/26) — the run lane's scoreboard, machine-enforced.

   Paolo 7/26 (laws/BOHEMIA_ADDENDUM_THE_RUN_IS_THE_INTEGRATION_LANE_7_26_26.md):
   the run must BE the game we built, and he must be able to see whether it got
   closer without judging anything. So the ledger
   (records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md) is not a checklist a
   session can pad — every row marked INTEGRATED must name a PROBE in this file,
   and the probe has to actually find the wiring in the shipped run.

     - INTEGRATED row with no probe             -> RED (no unproven claims)
     - INTEGRATED row whose probe fails         -> RED (the claim is a lie)
     - probe defined here with no row           -> RED (the ledger drifted)
     - illegal status value                     -> RED

   It prints the score so every run ship can quote a number that goes up.
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LEDGER = path.join(ROOT, 'records/BOHEMIA_RUN_INTEGRATION_LEDGER_7_26_26.md');
const RUN = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html'), 'utf8');
const ALPHA = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
const engine = (m) => fs.readFileSync(path.join(ROOT, 'engine/' + m), 'utf8');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* Each probe answers ONE question: is this system's wiring really in the run
   that ships? They look for the load-bearing call, never a comment. */
const PROBES = {
  cast_bridge: () =>
    // the run asks for the real baked cast, the alpha bakes it off the real rig,
    // and the run decodes it with the same packed-sprite format the city uses
    RUN.indexOf("BOHEMIA_RUN_NEED_CAST") >= 0 &&
    RUN.indexOf('function castIn(') >= 0 &&
    RUN.indexOf('function decodeFrame(') >= 0 &&
    ALPHA.indexOf('function runSendCast(') >= 0 &&
    ALPHA.indexOf("bake56(d,'idle'") >= 0 &&
    ALPHA.indexOf('G.tints=L.tints') >= 0,          // bodies wear the real wardrobe, tinted
  portraits: () =>
    ALPHA.indexOf('out.portraits.you=packIdx(renderFace(buildSpec()') >= 0 &&
    RUN.indexOf('spkface') >= 0 && RUN.indexOf('CAST.portraits') >= 0,
  walk_frames: () =>
    ALPHA.indexOf("walk:PHS.map(p=>bake56(d,'walk',p))") >= 0 &&
    RUN.indexOf('PFRAME=(PFRAME+1)&3') >= 0 && RUN.indexOf('function updateFaces(') >= 0,
  body_sort: () =>
    RUN.indexOf('bodies.sort(') >= 0 && RUN.indexOf('me:true') >= 0,
  suburb_module: () => RUN.indexOf(engine('bohemia_suburb.js')) >= 0 &&
    RUN.indexOf("BohemiaSuburb.generate(SEED, 'ring', 1, 1)") >= 0,
  art_banks: () => {
    const walk = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SUBURB_WALK_7_18_26.html'), 'utf8');
    const a = walk.indexOf('var DOOR_B64=['), b = walk.indexOf('function lampAt(', a);
    return a >= 0 && b >= 0 && RUN.indexOf(walk.slice(a, walk.indexOf('\n', b))) >= 0;
  },
  /* DOOR LAW (Paolo 7/26): the approved animated bank, 1 wide x 2 tall, really
     in the shipped run — the clips themselves, not a reference to them. */
  door_anim: () => {
    if (RUN.indexOf('"tileW":1,"tileH":2') < 0) return false;
    if (RUN.indexOf('function drawDoorFace(') < 0 || RUN.indexOf('function doorPassable(') < 0) return false;
    const bank = JSON.parse(fs.readFileSync(path.join(ROOT, 'banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt'), 'utf8'));
    const res = Object.keys(bank.clips).filter(k => /^4\._Doors_a_\d+_swing$/.test(k)).sort();
    if (res.length < 6) return false;
    // every approved residential clip's every frame must be present verbatim
    return res.every(k => bank.clips[k].frames.every(f => RUN.indexOf(f) >= 0));
  },
  music_bridge: () => RUN.indexOf("type:'BOHEMIA_RUN_MUSIC'") >= 0 &&
    ALPHA.indexOf("d.type==='BOHEMIA_RUN_MUSIC'") >= 0 &&
    ALPHA.indexOf('CITYMUS.startShuffle()') >= 0 &&
    // no second synth: the run must never CONSTRUCT an audio context of its own
    !/new\s*\(?\s*(window\.)?(webkit)?AudioContext/.test(RUN),
  /* SAVE/LOAD, to the two 7/26 rulings: one versioned blob through the engine's
     own save, no private side-channel, no device prefs riding along. */
  save_blob: () =>
    RUN.indexOf('function saveBlob(') >= 0 && RUN.indexOf('function applyBlob(') >= 0 &&
    RUN.indexOf('function migrateBlob(') >= 0 &&
    RUN.indexOf('BohemiaLoop.captureSave(CTX)') >= 0 &&      // through the ENGINE save
    RUN.indexOf('function sleepSave(') >= 0 && RUN.indexOf('function manualSave(') >= 0 &&
    RUN.indexOf('function autoSave(') >= 0 &&                 // all three kinds, per "BOTH"
    RUN.indexOf('SAVE_ENV_VERSION') >= 0 &&                   // versioned from day one
    // the music toggle is a DEVICE PREFERENCE and must never be written into a blob
    !/run:\s*\{[^}]*MUSIC_ON/.test(RUN),
  death_reload: () =>
    RUN.indexOf('function loadClosest(') >= 0 &&
    /if\(!d\.victory\)\{[\s\S]{0,400}loadClosest\(\)/.test(RUN),
  floorplan_module: () => RUN.indexOf(engine('bohemia_floorplan.js')) >= 0 &&
    RUN.indexOf('BOH_FLOORPLAN.generate(') >= 0,
  agents_module: () => RUN.indexOf(engine('bohemia_agents.js')) >= 0 &&
    RUN.indexOf('BohemiaAgents.agentsForBlock(') >= 0 && RUN.indexOf('SIM.step()') >= 0,
  quest_runtime: () => RUN.indexOf(engine('bohemia_quest_runtime.js')) >= 0 &&
    RUN.indexOf(engine('bohemia_bq.js')) >= 0 &&
    RUN.indexOf(JSON.stringify(fs.readFileSync(path.join(ROOT, 'quests/bq/S01_THE_METER_READER.bq'), 'utf8')).slice(1, -1)) >= 0,
  clout_feed: () => RUN.indexOf('BohemiaLoop.buildFeed(') >= 0 &&
    RUN.indexOf('BohemiaLoop.socialProfile(') >= 0 && RUN.indexOf('BohemiaLoop.cloutWeight(') >= 0,
  combat_bridge: () => RUN.indexOf("type:'BOHEMIA_RUN_ENCOUNTER'") >= 0 &&
    RUN.indexOf('BOHEMIA_RUN_COMBAT_END') >= 0 &&
    ALPHA.indexOf('function runEncounterIn(') >= 0 && ALPHA.indexOf('startEncounter({packageId:d.packageId') >= 0,
  world_bridge: () => RUN.indexOf('BohemiaLoop.boot(') >= 0 &&
    engine('bohemia_loop.js').indexOf('function applyWorldEffects(') >= 0,
};

const LEGAL = ['INTEGRATED', 'PARTIAL', 'NOT YET'];
const text = fs.readFileSync(LEDGER, 'utf8');
const rows = [];
text.split('\n').forEach(line => {
  const m = /^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/.exec(line);
  if (!m) return;
  if (/^-+$/.test(m[1].trim()) || m[1].trim() === 'system') return;
  rows.push({ system: m[1].trim(), status: m[2].trim(), probe: m[3].trim() });
});

ok('the ledger has rows', rows.length >= 15);
rows.forEach(r => ok('legal status for "' + r.system + '" (got "' + r.status + '")', LEGAL.indexOf(r.status) >= 0));

const claimed = rows.filter(r => r.status === 'INTEGRATED' || r.status === 'PARTIAL');
claimed.forEach(r => {
  const p = PROBES[r.probe];
  ok('"' + r.system + '" names a real probe (no unproven claims)', !!p);
  if (p) {
    let good = false;
    try { good = !!p(); } catch (e) { good = false; }
    ok('PROBE ' + r.probe + ' — "' + r.system + '" is really wired into the shipped run', good);
  }
});

// the ledger cannot quietly drop a row a probe still exists for
Object.keys(PROBES).forEach(name => {
  ok('probe ' + name + ' still has a ledger row', rows.some(r => r.probe === name));
});

// the ruling itself must stay on disk: the ledger is meaningless without it
ok('the integration ruling is recorded',
  fs.existsSync(path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_THE_RUN_IS_THE_INTEGRATION_LANE_7_26_26.md')));

const done = rows.filter(r => r.status === 'INTEGRATED').length;
const part = rows.filter(r => r.status === 'PARTIAL').length;
console.log('INTEGRATION GATE: ' + pass + ' passed, ' + fail + ' failed');
console.log('  THE RUN IS THE GAME: ' + done + ' / ' + rows.length +
            ' systems integrated (' + part + ' partial, ' +
            (rows.length - done - part) + ' not yet)');
process.exit(fail ? 1 : 0);
