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
/* `let`, not `const`, ONLY so the surface classifier at the bottom can blank it
   and ask a probe whether it can still answer. Nothing else reassigns it. */
let RUN = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html'), 'utf8');
/* THE SURFACE HE ACTUALLY WALKS (8/15). Every probe in this file reads RUN, and
   since the coordinator ruled the CITY WORLD the walked surface on 8/14 that means
   every green below is evidence about a file the alpha preloads and NEVER DISPLAYS.
   The header of the ledger has warned about this since 8/4 and no probe acted on
   it. The FACTIONS lane's three rows are repointed here as the shape of the fix:
   a row about player-facing work must prove itself WHERE HE LOOKS.
   records/BOHEMIA_SURFACE_AUDIT_8_15_26.md lists the 24 that still do not. */
const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
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
    // the block is a real valley cell now, so what the module gives the run is
    // its footprint reader, run over the world's own grid
    RUN.indexOf('BohemiaSuburb.homeFootprints({ g:G, W:T, H:T })') >= 0,
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
    !/new\s*\(?\s*(window\.)?(webkit)?AudioContext/.test(RUN) &&
    // OFF MEANS SILENT (Paolo 7/27): stopping must cut the MASTER GAIN, not just
    // the scheduler. Notes already booked into the graph kept playing after the
    // button said off, which is why clearing the timer alone is not a stop.
    /MAST\.gain\.cancelScheduledValues/.test(ALPHA) &&
    /MAST\.gain\.linearRampToValueAtTime\(0/.test(ALPHA),

  /* BORDER WALLS (Paolo direct order 7/27). The 13 approved perimeter keys must
     really wrap the block he walks. Note what this probe does NOT do: it does not
     sample a few tiles near the front door. My first version of that check did,
     the wall is twenty tiles away, and it reported ZERO draws of approved art that
     was drawing 207 times. So: the bank's own bytes must SHIP, and the renderer
     must both PICK one per community and DRAW it. */
  banks_used: () => {
    /* THE COMMUNITY WALL WRAPS THE BLOCK, and this proves the SHIPPED bytes are
       the COOKED bytes rather than trusting the builder's own log.

       8/2: this probe used to assert his 13 approved 7/14 walls were in the run
       VERBATIM, and that was the right test right up until two things changed.
       The cooked set supersedes them on a measured difference (his edge 5.8
       against a 14.27 floor derived from the tiles he bought) - his pool stays
       loaded as the one-line revert, and the waiver in banks_used_gate.js carries
       the reason. And WB4, the one he kept out of 48, is no longer byte-identical
       to the bank on purpose: it was stored as a 3x TILING PREVIEW and the
       renderer was crushing the whole 792x264 sheet into a single 44px cell, so
       it is now recovered to its true 44x44 first. A verbatim check would have
       failed on the fix. */
    const cook = JSON.parse(fs.readFileSync(
      path.join(ROOT, 'banks/BOHEMIA_PERIMETER_8_2_26.txt'), 'utf8')).tiles;
    const walls = cook.filter(t => ['face', 'pillar', 'base'].indexOf(t.form) >= 0);
    const gates = cook.filter(t => t.form === 'gate_overlay');
    if (walls.length < 36 || gates.length < 8) return false;
    /* only the ELEVEN he approved on 8/2 ship; the seven he killed are on the judge
       page and must NOT be in the run, so this checks the approved set specifically */
    const APPROVED = ['perim_slump_0', 'perim_slump_1', 'perim_slump_2', 'perim_cmu_0',
                      'perim_cmu_1', 'perim_precast_2', 'perim_rose_0', 'perim_rose_1',
                      'perim_splitface_0', 'perim_splitface_1', 'perim_splitface_2'];
    const live = walls.filter(t => APPROVED.indexOf(t.material + '_' + t.colourway) >= 0);
    if (live.length < 11 * 3) return false;
    if (!live.every(t => RUN.indexOf(t.b64) >= 0)) return false;    // the bytes, verbatim
    if (!gates.every(t => RUN.indexOf(t.b64) >= 0)) return false;
    /* AND HIS 7/14 POOL IS OUT. It was loaded-but-not-drawing for an hour on 8/2
       while the swap was a judge item; he thumbed all thirteen down the same day,
       so the correct end state is an empty payload rather than a permanent waiver.
       None of those bytes may be in the shipped run. */
    const pool = JSON.parse(fs.readFileSync(
      path.join(ROOT, 'banks/BOHEMIA_PERIMETER_WALL_POOL_7_14_26.txt'), 'utf8')).pool;
    const tan = pool.filter(w => w.variant === 'tan');
    if (tan.length !== 13) return false;
    if (tan.some(w => RUN.indexOf(w.b64) >= 0)) return false;
    return RUN.indexOf('function perimImg(') >= 0 &&        // one wall per community
           RUN.indexOf('function drawPerim(') >= 0 &&       // and it really draws
           RUN.indexOf('function drawGateMouth(') >= 0 &&   // the aperture too
           RUN.indexOf('function perimDesign(') >= 0;
  },

  /* THE D-PAD IS A CONTROL, NOT TEXT (Paolo 7/28). iOS raised the copy/paste menu
     on every direction press. The run is the ONE tab loaded by iframe src while the
     others are base64 blobs, so both the 7/27 patch tool and its gate skipped it.
     The guard must be in the DEV SOURCE — the generated file is overwritten every
     build — and it must still be present in what ships. Inputs stay selectable. */
  touch_guard: () => {
    const dev = fs.readFileSync(
      path.join(ROOT, 'slices/BOHEMIA_RUN_SLICE_7_26_26.html'), 'utf8');
    const guarded = (s) =>
      /-webkit-touch-callout\s*:\s*none/.test(s) &&
      /user-select\s*:\s*none/.test(s) &&
      /touch-action\s*:\s*manipulation/.test(s) &&
      /input\s*,\s*textarea\s*\{[^}]*user-select\s*:\s*text/.test(s);
    return guarded(dev) && guarded(RUN);
  },

  /* ONE VEGAS (Paolo 7/28, "incorporate all of these things together"). The run and
     the city were two different valleys: hashSeed('bohemia') against a hardcoded
     2026. Three things have to hold now, and the third is the one he actually asked
     for — the city menu must know where he is standing. */
  one_seed: () => {
    // 1. the run boots the SHARED world off the shared seed text, not a number
    if (RUN.indexOf("BohemiaLoop.boot({ seed: 'bohemia' })") < 0) return false;
    if (RUN.indexOf('E.WorldGen.hashSeed(seedText)') < 0) return false;
    if (/World\.world\(\s*2026\s*\)/.test(RUN)) return false;      // the old hardcode
    // 2. home is CHOSEN and scored, never first-suburb-in-scan-order (= the map rim)
    if (RUN.indexOf('function findHomeCell(') < 0) return false;
    if (RUN.indexOf('var HOME_CELL = findHomeCell()') < 0) return false;
    // the scorer must stay on the CHEAP overmap rung: WORLD.tile() realizes a whole
    // 128x128 district and calling it per candidate took minutes to boot on a phone
    // strip comments first: the function CARRIES a comment explaining why it must
    // not call WORLD.tile(), and a probe that reads prose instead of code would
    // fail the very fix it is guarding
    const fh = RUN.slice(RUN.indexOf('function findHomeCell('),
                         RUN.indexOf('var HOME_CELL = findHomeCell()'))
                  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    if (/WORLD\.tile\(/.test(fh)) return false;
    if (!/WORLD\.at\(/.test(fh)) return false;          // the cheap overmap rung
    // 3. the position really crosses the bridge, both ways
    return RUN.indexOf("type:'BOHEMIA_RUN_WHERE'") >= 0 &&
           ALPHA.indexOf("d.type==='BOHEMIA_RUN_WHERE'") >= 0 &&
           ALPHA.indexOf("type:'BOHEMIA_GOTO_CELL'") >= 0;
  },
  /* THE VISUAL CONSTITUTION (Paolo's CBB verdict on the target, 7/26): the run
     is laid from the FROZEN starter tileset, consumed byte-for-byte, and the
     tiles are really used by the renderer rather than merely shipped. */
  target_tiles: () => {
    const constPath = path.join(ROOT, 'records/target/BOHEMIA_VISUAL_CONSTITUTION.json');
    if (!fs.existsSync(constPath)) return false;
    const con = JSON.parse(fs.readFileSync(constPath, 'utf8'));
    const bankPath = path.join(ROOT, con.frozen.tileset.path);
    const md5 = require('crypto').createHash('md5').update(fs.readFileSync(bankPath)).digest('hex');
    if (md5 !== con.frozen.tileset.md5) return false;      // the frozen set moved
    const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
    // every approved tile ships verbatim...
    if (!bank.tiles.every(t => RUN.indexOf(t.b64) >= 0)) return false;
    // ...and the renderer actually lays them, in the target's own language
    return RUN.indexOf('function bodyTile(') >= 0 && RUN.indexOf('function groundTile(') >= 0 &&
           RUN.indexOf("'roof_ridge'") >= 0 && RUN.indexOf("'wall_window'") >= 0 &&
           RUN.indexOf("'road_gutter'") >= 0 && RUN.indexOf("'garage_bottom'") >= 0;
  },
  /* CITY's UP-ONLY interior pool, consumed by the run: the tiles really ship,
     a room's floor is chosen ONCE per room, and props never become collision. */
  interior_pool: () => {
    const pool = JSON.parse(fs.readFileSync(path.join(ROOT, 'banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt'), 'utf8'));
    if (!/UP-ONLY/.test(pool.law || '')) return false;
    // the surfaces ship whole; props ship capped, so check a real sample of each
    const shipped = (b, n) => (pool.buckets[b] || []).slice(0, n).every(e => RUN.indexOf(e.b64) >= 0);
    if (!shipped('floors', pool.buckets.floors.length)) return false;
    if (!shipped('dirtfloor', pool.buckets.dirtfloor.length)) return false;
    if (!['furniture', 'container', 'clutter', 'debris', 'tools', 'plant', 'light'].every(b => shipped(b, 4))) return false;
    return RUN.indexOf('function roomFloor(') >= 0 && RUN.indexOf('function propAt(') >= 0 &&
           RUN.indexOf('ROLE_PROPS') >= 0 && RUN.indexOf('_roomFloor[k]') >= 0 &&
           // walls inside are the constitution's own, not the pool's patchwork
           RUN.indexOf("if(ic.g==='wall'){ tput(['wall_0','wall_1','wall_2']") >= 0;
  },
  /* THE SENTENCE THE GAME SPEAKS: the run's verbs go through the PORTED
     resolver, not a private copy, and the moments carry HIS sizes. */
  resolver: () => {
    const mod = fs.readFileSync(path.join(ROOT, 'engine/bohemia_resolve.js'), 'utf8');
    return RUN.indexOf(mod) >= 0 &&                        // the approved port itself
      RUN.indexOf('BOH_RESOLVE.makeReach(1)') >= 0 &&      // one declared reach
      RUN.indexOf('BOH_RESOLVE.makeResolver({ moments: MOMENTS })') >= 0 &&
      /name:'SLEEP', spends:8/.test(RUN) && /name:'HANGOUT', spends:1/.test(RUN) &&
      /name:'EAT', spends:null/.test(RUN) &&               // unpriced: a cost table is canon
      RUN.indexOf('function contextVerb(') >= 0 && RUN.indexOf('function spendTime(') >= 0 &&
      RUN.indexOf("RESOLVER.register('block-clock','WORLD'") >= 0;
  },
  walk_feel: () =>
    /var WALKMODES=\['GRID','SLIDE','HYBRID','FREE'\]/.test(RUN) &&
    RUN.indexOf('function walkModeSet(') >= 0 && RUN.indexOf('function drawOffset(') >= 0 &&
    RUN.indexOf('function freeNudge(') >= 0 && RUN.indexOf('walkbtn') >= 0,
  /* THE VALLEY IS REAL: the run reads the world model's own tile rung one cell
     at a time, and the edge is a crossing rather than a wall. */
  real_valley: () =>
    RUN.indexOf('function loadCell(') >= 0 && RUN.indexOf('WORLD.tile(cx*T+x, cy*T+y)') >= 0 &&
    RUN.indexOf('function findHomeCell(') >= 0 &&
    RUN.indexOf('You crossed into the') >= 0 &&
    // passability is the world's answer now, not a private list of suburb codes
    RUN.indexOf('return !SOLIDG[y][x];') >= 0 &&
    RUN.indexOf("BohemiaSuburb.generate(SEED, 'ring', 1, 1)") < 0,
  district_material: () =>
    RUN.indexOf('function genericTile(') >= 0 && RUN.indexOf('NAMEG[gy][gx]') >= 0 &&
    RUN.indexOf('function isSuburbCell(') >= 0,
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
  /* RE-POINTED AT THE SURFACE HE PLAYS (8/21, RUN lane). This proved combat on
     the RUN SLICE -- BOHEMIA_RUN_ENCOUNTER, runEncounterIn -- a file the RUN tab
     does not display and which, since today, is not even downloaded. The row
     said INTEGRATED and it was true about the wrong building.
     THE CITY PATH IS REAL AND PROVED TODAY, end to end, by combat_entry_gate
     (14/0): walking through a real door posts BOHEMIA_CITY_ENCOUNTER with a
     roster and the room's true dimensions, the shell assembles a fight, and it
     puts him back on the block he was standing on. So the probe asks the city.
     THE RUN-SLICE HALF IS KEPT AS A SECOND CLAUSE ON PURPOSE: it is still wired,
     nothing was deleted, and if somebody re-points the tab back the row should
     not silently become unproven. `||`, not `&&` -- either surface can carry it,
     but the CITY one is what the headline counts. */
  combat_bridge: () =>
    (CITY.indexOf("type:'BOHEMIA_CITY_ENCOUNTER'") >= 0 &&
     CITY.indexOf('function cityFightOnEnter(') >= 0 &&
     ALPHA.indexOf("d.type==='BOHEMIA_CITY_ENCOUNTER'") >= 0 &&
     ALPHA.indexOf('function cityEncounterIn(') >= 0)
    ||
    (RUN.indexOf("type:'BOHEMIA_RUN_ENCOUNTER'") >= 0 &&
     RUN.indexOf('BOHEMIA_RUN_COMBAT_END') >= 0 &&
     ALPHA.indexOf('function runEncounterIn(') >= 0),
  world_bridge: () => RUN.indexOf('BohemiaLoop.boot(') >= 0 &&
    engine('bohemia_loop.js').indexOf('function applyWorldEffects(') >= 0,
  /* 8/9: the row above was PARTIAL for six weeks with the note "quest outcomes really
     move faction standing, but nothing in the run SHOWS it". Moving it to INTEGRATED
     needs a probe for the SHOWING, not just the moving -- otherwise the ledger says
     integrated because a number changed in memory where no player can see it, which is
     the exact class of claim this gate exists to refuse. So: the run must carry the
     reputation modules, and must actually render the consequence off the REAL
     FactionWorld (the rung) and the REAL clout reach. */
  world_bridge_shown: () => RUN.indexOf('function questConsequence(') >= 0 &&
    RUN.indexOf('BohemiaDeeds.reachOf(') >= 0 &&
    RUN.indexOf("standingWith('player')") >= 0 &&
    RUN.indexOf('F.rungOf(') >= 0,

  /* THE SIXTEEN INTRODUCTIONS (8/12). The organ has to be inlined, the card's NAME
     row has to be REWRITTEN from it (not printed beside people.js's answer), and the
     one button's label has to come from the organ. A file-shape probe is the weakest
     of the three checks this feature has -- gates/introductions_gate.js part C opens
     the real built run in a real browser, presses the real button and reads the real
     row -- so this one only has to catch the row silently going stale. */
  /* ON THE WALKED SURFACE. The run half is kept because the work is genuinely in
     both and the legacy file is still the harvest source; the CITY half is what
     makes this row a claim about the game he plays. */
  introductions_shown: () => CITY.indexOf('BohemiaIntros.meeting(') >= 0 &&
    CITY.indexOf('function ctIntroName(') >= 0 &&
    CITY.indexOf('function ctIntroRows(') >= 0 &&
    RUN.indexOf('BohemiaIntros.buttonFor(') >= 0,

  /* WHO KNOWS WHO (8/12). The graph has to be inlined, the run has to feed it the
     SAME faction answer the rest of the card uses, and the vouch has to reach the
     card as a named introducer rather than a silent flag. gates/ties_gate.js part
     D plays the whole thing through the real DOM; this only catches the row going
     stale. */
  ties_shown: () => CITY.indexOf('==== engine/bohemia_ties.js ====') >= 0 &&
    CITY.indexOf('function ctFactionOf(') >= 0 &&
    RUN.indexOf('BohemiaTies.vouchFor(') >= 0 &&
    RUN.indexOf("label:'INTRODUCED BY'") >= 0,

  /* WHAT THEY WANT FROM YOU (8/12). The bargain has to be inlined, drawn into its
     OWN node after cardFor() clears the card, and driven off the deed COUNT rather
     than the standing number. gates/belonging_gate.js part D reads the real node in
     a real browser; this only catches the row going stale. */
  belonging_shown: () => CITY.indexOf('BohemiaBelonging.bargain(') >= 0 &&
    CITY.indexOf('BohemiaBelonging.actFor(') >= 0 &&
    CITY.indexOf('BohemiaBelonging.record(') >= 0 &&
    RUN.indexOf('BohemiaBelonging.bargain(') >= 0 &&
    RUN.indexOf('function showBargain(') >= 0 &&
    RUN.indexOf('function gaveFor(') >= 0 &&
    /* and the act, or the bargain is legible and unactionable */
    RUN.indexOf('BohemiaBelonging.actFor(') >= 0 &&
    RUN.indexOf('BohemiaBelonging.record(') >= 0 &&
    /* and the act needs a reason, or it is a button you can press from anywhere */
    RUN.indexOf('function theirGround(') >= 0 &&
    RUN.indexOf('function actStateFor(') >= 0,
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

/* ============================================================================
   WHICH SURFACE PROVED IT (8/21, RUN lane) — the honest headline.

   THE PROBLEM, stated by the ledger's own header since 8/4 and by this file's
   own comment since 8/15, and acted on by nobody: nearly every probe reads
   slices/BOHEMIA_RUN_CURRENT.html, and THE RUN TAB DOES NOT DISPLAY THAT FILE.
   Measured today, by reading the probes themselves rather than by memory:

       25 of 29 probes are answered ONLY by the run slice.

   So "THE RUN IS THE GAME: 30 / 35 systems integrated" was a true sentence
   about the wrong building. It is the exact disease this lane has spent the
   week on -- a green about a surface nobody reaches -- sitting in the lane's
   own scoreboard, which makes it the one that steers everybody.

   WHAT THIS CHANGE DOES AND DOES NOT DO. It does NOT re-point the probes. That
   is 24 systems of careful per-system work -- these probes check bank bytes,
   approved sets and graveyard exclusions, and a scoreboard that wrongly claims
   the city has something is worse than one that is honestly stale. Checked
   today, every one of those systems DOES have a real trace in the city under
   its own spelling (save/load, the resolver, combat, quests, agents, doors,
   interiors, tiles, music, the seed, the valley), so this is a re-probing job
   and not a porting job -- which is the good news and is written down so the
   next session starts from evidence instead of repeating the search.

   WHAT IT DOES is make the scoreboard STOP LYING TODAY, mechanically: every row
   now declares WHICH SURFACE ITS PROBE READ, derived from the probe's own
   source, never typed. The headline states the split. A reader can finally tell
   which greens are about the game he plays, which was the entire complaint.
   ========================================================================== */
/* ASK THE PROBE, DO NOT READ IT (8/21). The first version of this classifier
   searched each probe's SOURCE for the identifiers RUN and CITY -- which is a
   MENTION, not a USE, the exact disease this whole scoreboard fix exists to
   cure, reproduced inside the cure. Caught by mutation: disabling the city half
   of combat_bridge with `false &&` left the word CITY in the text, so the
   classifier happily kept counting it as proved on the played surface.

   THE HONEST QUESTION IS BEHAVIOURAL AND IT IS ONE LINE: blank the run slice and
   ask the probe again. If it still answers yes, the CITY (or the shell, or a
   bank) carries that system on its own, and the row is real about the surface he
   plays. If it goes silent, the run slice was the only thing holding it up. */
const provedWithoutTheRunSlice = (name) => {
  const fn = PROBES[name];
  if (!fn) return false;
  const keep = RUN;
  RUN = '';
  let out = false;
  try { out = !!fn(); } catch (e) { out = false; }
  RUN = keep;
  return out;
};
const surfaceOf = (name) => (provedWithoutTheRunSlice(name) ? 'SHOWN' : 'RUN');

const done = rows.filter(r => r.status === 'INTEGRATED').length;
const part = rows.filter(r => r.status === 'PARTIAL').length;
const proven = rows.filter(r => r.status === 'INTEGRATED');
const bySurface = { RUN: [], SHOWN: [] };
proven.forEach(r => { bySurface[surfaceOf(r.probe)].push(r.system); });
const onShown = bySurface.SHOWN.length;

console.log('INTEGRATION GATE: ' + pass + ' passed, ' + fail + ' failed');
console.log('  ' + done + ' / ' + rows.length + ' systems integrated ('
  + part + ' partial, ' + (rows.length - done - part) + ' not yet)');
/* THE HALF THAT WAS MISSING, and it leads, because a reader who stops at the
   first number has to stop at the true one. */
console.log('  PROVED ON THE SURFACE HE PLAYS -- still true with the run slice '
  + 'blanked: ' + onShown + ' of ' + done
  + (onShown ? '  [' + bySurface.SHOWN.join(' · ') + ']' : ''));
console.log('  PROVED ONLY ON THE RUN SLICE, WHICH THE RUN TAB DOES NOT DISPLAY: '
  + bySurface.RUN.length);
if (bySurface.RUN.length) {
  console.log('  re-probing owed, in ledger order:');
  for (let i = 0; i < bySurface.RUN.length; i += 3) {
    console.log('    ' + bySurface.RUN.slice(i, i + 3).join(' · '));
  }
}
process.exit(fail ? 1 : 0);
