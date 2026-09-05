/* ============================================================================
   SAVE IPHONE GATE (8/11/26) — the demo is played on an iPhone, so the save is
   driven against a HOSTILE BROWSER, not a friendly one.

   A save that round-trips in Node proves nothing. Every failure below is one iOS
   Safari really produces, and CITYSAVE v1 lost the run to four of them:

     A. a store that refuses big writes but accepts small ones (the 1-byte probe)
     B. a store that fills up MID-RUN (the stale-save time machine)
     C. a store that accepts a write and does not keep it (silent write)
     D. a store that hands back a TRUNCATED blob (the torn write)
     E. a store that is wiped between launches (ITP's 7-day eviction)
     F. a launcher with no localStorage at all, or one that throws on access
     G. a 7/7-era single-slot save on disk (migration)

   The assertion that matters most is B: after a failed write, the NEXT LAUNCH
   must not silently load the old save. v1 did exactly that, under a comment
   promising it never would.

   EXTENDED 9/5 -- __THE_GATE_WALKS_THE_PEOPLE__.
   Everything above was written on 8/11 and every check A through K ran on a
   save that was the WORLD and nothing else: met, minds, known, belong and
   deedweight appeared ZERO times in this file. A harness that proves half a
   save survives an iPhone is proving the wrong half survives, and the half it
   never walked is the half four separate BB-study days called the point.

     L. the five walk every hostile mode (tiny writes, silent store, eviction,
        no storage at all, and the pre-9/4 save that has no people in it)
     M. THE DESYNC CASE, the one this harness was built for: force a torn
        write, roll the world back one generation, and assert THE PEOPLE CAME
        WITH IT -- plus M2, the time machine asked about the population
     N. what the people cost, and the new edge they created: a store that fits
        the world and not its people must say MEMORY out loud, never half-save
     O. all of it again on the surface he plays, through the real city's own
        snapshot, the real CITYSAVE and the real localStorage

   MUTATION PROOF, run 9/5, because a check that cannot fail is not a check:
     * the engine save dropping `people`            -> 9 red (L, M, M2, N)
     * the city snapshot blanking `people`          -> 7 red (all of O)
     * THE PRE-9/4 ARCHITECTURE ITSELF -- the world versioned per slot and the
       people in ONE shared place beside it -> EXACTLY ONE RED, O's desync
       claim: the world came back at generation 1 and the belonging came back
       at generation 9. Every other check stayed green, which is the whole
       reason this bug lived for a month: IT IS INVISIBLE FROM INSIDE EITHER
       SYSTEM. Only a check that reads the world and the population off the
       SAME loaded blob and asks whether they agree can see it.

   AND ONE LESSON THE MUTATION TAUGHT ABOUT THIS GATE ITSELF: the second
   mutation first made section O THROW out of the page and killed the run before
   a single claim printed, which reads as a broken gate rather than a broken
   game. A GATE MUST GO RED, NEVER EXPLODE. A missing population is a finding,
   so it is reported as one.
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const Save = require(path.join(ROOT, 'engine/bohemia_save.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* ---- the hostile browser ------------------------------------------------ */
function fakeStore(cfg) {
  cfg = cfg || {};
  const d = Object.create(null);
  let used = 0;
  return {
    _d: d,
    _wipe() { for (const k in d) delete d[k]; used = 0; },
    _bytes() { return used; },
    /* Fill the device the way another app would. TWO things this has to get
       right, and the first draft of this gate got both wrong:
       1. it MUST count against `used`, or the quota never bites and every test
          below passes vacuously (it did, on the first run);
       2. it must fill exactly TO the cap and never past it, because a real
          localStorage cannot be over its own quota. Overshooting made even a
          SHRINKING write throw, which no real store does, and that fake failure
          looked exactly like a bug in the save. */
    _fillToCap() { const room = cfg.cap - used; d.__ballast = new Array(Math.max(1, room + 1)).join('z'); used += d.__ballast.length; },
    _unballast() { if (d.__ballast) { used -= d.__ballast.length; delete d.__ballast; } },
    getItem(k) {
      if (cfg.throwOnRead) throw new Error('read refused');
      return k in d ? d[k] : null;
    },
    setItem(k, v) {
      v = String(v);
      if (cfg.refuseAll) { const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e; }
      if (cfg.maxWrite !== undefined && v.length > cfg.maxWrite) {
        const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e;
      }
      if (cfg.cap !== undefined && used - (d[k] ? d[k].length : 0) + v.length > cfg.cap) {
        const e = new Error('quota'); e.name = 'QuotaExceededError'; throw e;
      }
      if (cfg.silent) return;                       // accepts, keeps nothing
      if (cfg.truncate) v = v.slice(0, Math.max(0, v.length - cfg.truncate));
      used += v.length - (d[k] ? d[k].length : 0);
      d[k] = v;
    },
    removeItem(k) {
      if (cfg.refuseDelete) throw new Error('delete refused');
      if (k in d) { used -= d[k].length; delete d[k]; }
    }
  };
}

const STATE = (n) => ({ day: n, gold: n * 10, pos: [n, n], junk: new Array(400).join('q') });
const mk = (store, extra) => Save.make(Object.assign({ store, ios: true, standalone: false }, extra || {}));

/* ---- THE FIVE (9/5) ------------------------------------------------------
   __THE_GATE_WALKS_THE_PEOPLE__. Everything above this line was written on
   8/11 and every check below A through K ran on a save that was the WORLD and
   nothing else. met, minds, known, belong and deedweight appeared ZERO times in
   this file, so the hostile-browser harness was pointed at half the save, and
   the half it never walked is the half four separate BB-study days concluded
   was the point.

   THE SHAPE IS THE REAL ONE, not an invented one: measured off citySnapshot()
   in the running city on 9/5 and mirrored here field for field, because a
   harness that carries a shape the game never writes proves nothing about the
   game.

   EVERY PEOPLE FIELD IS KEYED TO THE GENERATION NUMBER n. That is not
   decoration, it is the whole desync test: after a rollback the world's day and
   the population's generation must be THE SAME NUMBER. Two systems that roll
   back independently is exactly the bug, and it is invisible from inside either
   one of them. */
const PEOPLE = (n) => ({
  met:    { v: 1, rows: [['block:' + n, n]] },
  minds:  { ['probe:' + n]: { seen: n } },
  known:  { v: 1, rows: [['who:' + n, n]] },
  belong: { CARTEL: { gave: n, owed: n * 2, burned: n > 1 } },
  deed:   { QUIET: n, NOTABLE: n * 2 }
});
const STATE_P = (n) => Object.assign(STATE(n), { people: PEOPLE(n) });
/* the one question that matters: is the population the same generation as the
   world it was loaded with? Read entirely off the loaded blob, so it cannot be
   satisfied by anything the test itself still holds in memory. */
const SAME_GEN = (got) => {
  if (!got || !got.data || !got.data.people) return false;
  const d = got.data, p = d.people;
  try {
    return p.belong.CARTEL.gave === d.day
      && p.deed.QUIET === d.day
      && Object.keys(p.minds)[0] === 'probe:' + d.day
      && p.met.rows[0][1] === d.day
      && p.known.rows[0][1] === d.day;
  } catch (e) { return false; }
};

/* ---- 0. the honest case ------------------------------------------------- */
{
  const st = fakeStore({});
  const s = mk(st);
  ok('healthy store probes as disk', s.probe() === 'disk');
  s.save(STATE(1));
  const got = s.load();
  ok('a save round-trips', got && got.data.day === 1 && got.data.gold === 10);
  ok('status tells the truth on a healthy device', s.status().mode === 'disk');
  ok('and still warns about the 7-day wipe on a tab-launched iPhone', s.status().evictionRisk === true);
  const home = mk(fakeStore({}), { standalone: true }); home.probe();
  ok('a home-screen install is NOT warned (ITP exempts it)', home.status().evictionRisk === false);
}

/* ---- A. the store that accepts small writes and refuses big ones ---------
   THE 1-BYTE PROBE BUG. v1 wrote '1', succeeded, reported 'disk', and then lost
   every real autosave to memory without telling anyone. */
{
  const st = fakeStore({ maxWrite: 64 });           // one byte fine, a save never
  const s = mk(st);
  ok('A: a store that only takes tiny writes is NOT called disk', s.probe() === 'memory');
  s.save(STATE(3));
  const got = s.load();
  ok('A: the run still saves, in memory, and loads back', got && got.data.day === 3);
  ok('A: and the player is TOLD it is memory only', /MEMORY ONLY/.test(s.status().line));
  ok('A: v1 would have passed its own probe here (proof this test bites)',
     (() => { try { st.setItem('__bp_probe', '1'); st.removeItem('__bp_probe'); return true; } catch (e) { return false; } })());
}

/* ---- B. THE TIME MACHINE — the one that mattered ------------------------- */
{
  const st = fakeStore({ cap: 200000 });
  const s1 = mk(st);
  s1.probe();
  s1.save(STATE(1));                                 // day 1 lands on disk
  ok('B: day 1 is on disk', s1.load().data.day === 1);

  st._fillToCap();                                   // the device fills up
  const s2 = mk(st); s2.probe(); s2.mem = null;
  const before = s2.load();
  ok('B: day 1 is still readable before the failure', before && before.data.day === 1);
  s2.save(STATE(9));                                 // day 9 is refused
  ok('B: the failed write drops to memory', s2.status().mode === 'memory');
  ok('B: THIS session still sees day 9, not day 1', s2.load().data.day === 9);

  // THE NEXT LAUNCH. Fresh object, empty memory, same disk.
  st._unballast();                                   // room is free again
  const s3 = mk(st);
  s3.probe();
  const after = s3.load();
  ok('B: NEXT LAUNCH DOES NOT RESURRECT DAY 1 — no time machine',
     after === null || after.data.day !== 1);
  ok('B: a tombstone records why the disk is dead', !!st._d['bohemia_city_save.dead']);
}

/* ---- B2. the store that also refuses to delete --------------------------- */
{
  const st = fakeStore({ cap: 150000, refuseDelete: true });
  const s1 = mk(st); s1.probe(); s1.save(STATE(2));
  st._fillToCap();
  const s2 = mk(st); s2.probe(); s2.save(STATE(8));
  st._unballast();
  const s3 = mk(st); s3.probe();
  const after = s3.load();
  ok('B2: slots that could not be deleted are still ignored via the tombstone',
     after === null || after.data.day !== 2);
}

/* ---- C. the store that accepts a write and keeps nothing ----------------- */
{
  const s = mk(fakeStore({ silent: true }));
  ok('C: a silent store is caught by the read-back and called memory', s.probe() === 'memory');
  s.save(STATE(4));
  ok('C: the run survives in memory', s.load().data.day === 4);
}

/* ---- D. the torn write --------------------------------------------------- */
{
  const st = fakeStore({});
  const s1 = mk(st); s1.probe();
  s1.save(STATE(1));                                 // slot a, gen 1, intact
  s1.save(STATE(2));                                 // slot b, gen 2, intact
  const keys = Object.keys(st._d).filter(k => /\.(a|b)$/.test(k));
  ok('D: two slots exist, not one', keys.length === 2);

  // corrupt the NEWEST slot the way a truncated write would
  const newest = keys.map(k => ({ k, g: JSON.parse(st._d[k]).gen })).sort((x, y) => y.g - x.g)[0].k;
  st._d[newest] = st._d[newest].slice(0, st._d[newest].length - 40);
  const s2 = mk(st); s2.probe();
  const got = s2.load();
  ok('D: a truncated newest slot is DETECTED, not parsed', s2.status().corrupt >= 1);
  ok('D: and load falls back to the intact older slot', got && got.data.day === 1);
}

/* ---- D2. checksum, not just length -------------------------------------- */
{
  const st = fakeStore({});
  const s1 = mk(st); s1.probe(); s1.save(STATE(5));
  const k = Object.keys(st._d).find(x => /\.(a|b)$/.test(x));
  const env = JSON.parse(st._d[k]);
  env.p = env.p.replace('"day":5', '"day":6');       // same length, different bytes
  st._d[k] = JSON.stringify(env);
  const s2 = mk(st); s2.probe();
  ok('D2: a same-length byte flip is caught by the checksum',
     s2.load() === null && s2.status().corrupt >= 1);
}

/* ---- E. ITP wipes the device between launches ---------------------------- */
{
  const st = fakeStore({});
  const s1 = mk(st); s1.probe(); s1.save(STATE(7));
  st._wipe();                                        // 7 quiet days later
  const s2 = mk(st); s2.probe();
  ok('E: an evicted save reads as GONE, never as garbage', s2.load() === null);
  ok('E: and the device is still writable afterwards', s2.status().mode === 'disk');
}

/* ---- F. no localStorage, and localStorage that throws on access ---------- */
{
  const s = Save.make({ store: null, ios: true });
  ok('F: a launcher with no storage probes memory and does not throw', s.probe() === 'memory');
  s.save(STATE(6));
  ok('F: and the run still saves and loads in memory', s.load().data.day === 6);

  const hostile = mk(fakeStore({ refuseAll: true }));
  ok('F: a store that refuses every write is memory', hostile.probe() === 'memory');
  hostile.save(STATE(11));
  ok('F: and that run is still playable', hostile.load().data.day === 11);
}

/* ---- G. the 7/7 single-slot save on disk --------------------------------- */
{
  const st = fakeStore({});
  st._d['bohemia_city_save'] = JSON.stringify({ v: 1, t: 1, data: { day: 42 }, prefabs: null });
  const s = mk(st); s.probe();
  const got = s.load();
  ok('G: a 7/7 v1 save is still loadable', got && got.data.day === 42);
  s.save(STATE(43));
  ok('G: and after the first v2 write the old key is retired',
     st._d['bohemia_city_save'] === undefined);
  ok('G: without losing the run', s.load().data.day === 43);
}

/* ---- H. the A/B rule itself: the newest good save is NEVER the target ----- */
{
  const st = fakeStore({});
  const s = mk(st); s.probe();
  let violations = 0;
  for (let i = 1; i <= 12; i++) {
    const pre = {};
    for (const k of ['bohemia_city_save.a', 'bohemia_city_save.b'])
      pre[k] = st._d[k] ? JSON.parse(st._d[k]).gen : -1;
    const newestKey = pre['bohemia_city_save.a'] >= pre['bohemia_city_save.b']
      ? 'bohemia_city_save.a' : 'bohemia_city_save.b';
    const newestBefore = st._d[newestKey];
    s.save(STATE(i));
    if (pre[newestKey] > -1 && st._d[newestKey] !== newestBefore &&
        pre['bohemia_city_save.a'] !== pre['bohemia_city_save.b']) violations++;
  }
  ok('H: across 12 autosaves the newest good slot was never overwritten', violations === 0);
  ok('H: and the newest state is what loads back', s.load().data.day === 12);
}

/* ---- I. prefabs ride along ----------------------------------------------- */
{
  const st = fakeStore({});
  const s = mk(st); s.probe();
  s.save(STATE(1), { p: [1, 2, 3] });
  const got = s.load();
  ok('I: prefabs survive the round trip', got && got.prefabs && got.prefabs.p.length === 3);
}

/* ---- J. the module is actually IN the surface he plays -------------------
   MEASURE THE THING HE NAMED, clause 1: a module that only exists in engine/ is
   a module the player never runs. */
{
  const fs = require('fs');
  const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  ok('J: the iPhone-proof save is INLINED in the alpha, not just in engine/',
     alpha.indexOf('__SAVE_V2__') >= 0);
  ok('J: and the alpha builds CITYSAVE from it', /CITYSAVE\s*=\s*BohemiaSave\.make/.test(alpha));
  ok('J: the dead 1-byte probe is gone from the alpha',
     alpha.indexOf("setItem('__bp_probe'") < 0);

  /* J2 (9/5): THE DEMO IS THE BUILD A PLAYER TAPS, and the save is the thing
     that has to survive on THEIR phone, not on his bench. The demo is CUT from
     the alpha rather than forked, so this is a check that the cut kept the
     hardened save and did not strip it with the dev tabs. */
  const demoPath = path.join(ROOT, 'slices/BOHEMIA_DEMO.html');
  const demo = fs.existsSync(demoPath) ? fs.readFileSync(demoPath, 'utf8') : '';
  ok('J2: the demo build exists', demo.length > 0);
  ok('J2: and the cut kept the iPhone-proof save, not just the workshop',
     demo.indexOf('__SAVE_V2__') >= 0 && /CITYSAVE\s*=\s*BohemiaSave\.make/.test(demo));
  ok('J2: and the demo carries the same city file the people ride in',
     demo.indexOf('BOHEMIA_CITY_WORLD') >= 0);
}

/* ==========================================================================
   L. THE FIVE WALK EVERY HOSTILE MODE (9/5, __THE_GATE_WALKS_THE_PEOPLE__)
   A through G are the seven ways an iPhone really loses a save. Every one of
   them has now been walked with the people in the blob, because a save that
   survives an iPhone with only the world in it is proving the wrong half.
   ========================================================================= */
{
  /* L-A: the store that only takes tiny writes. The people made the save
     BIGGER, so this is the mode most likely to change behaviour. */
  const s = mk(fakeStore({ maxWrite: 64 }));
  ok('L-A: with the people aboard, a tiny-write store is still called memory',
     s.probe() === 'memory');
  s.save(STATE_P(3));
  const got = s.load();
  ok('L-A: and the run keeps its population in memory-only mode', SAME_GEN(got));
}
{
  /* L-C: accepts the write, keeps nothing. */
  const s = mk(fakeStore({ silent: true }));
  s.probe(); s.save(STATE_P(4));
  ok('L-C: a silent store loses the disk, never the people', SAME_GEN(s.load()));
}
{
  /* L-E: ITP wipes the device between launches. The claim is not that the
     people survive -- nothing survives an eviction -- it is that they are lost
     CLEANLY. A HALF-RESTORED POPULATION IS WORSE THAN A FRESH ONE BECAUSE YOU
     CANNOT SEE THAT IT IS WRONG (the belonging code's own rule). */
  const st = fakeStore({});
  const s1 = mk(st); s1.probe(); s1.save(STATE_P(7));
  st._wipe();
  const s2 = mk(st); s2.probe();
  const after = s2.load();
  ok('L-E: an evicted save takes the people with it, whole -- never half a '
    + 'population on a fresh world', after === null);
  ok('L-E: and the device still writes people afterwards',
     (s2.save(STATE_P(8)), SAME_GEN(s2.load())));
}
{
  /* L-F: no localStorage at all. */
  const s = Save.make({ store: null, ios: true });
  s.probe(); s.save(STATE_P(6));
  ok('L-F: a launcher with no storage still carries the people in memory',
     SAME_GEN(s.load()));
}
{
  /* L-G: THE SAVE THAT PREDATES THEM. Every save written before 9/4 has no
     people block at all, and that is CORRECT -- it never had them. The failure
     to guard against is a load path that throws, or one that invents an empty
     population and writes it over the live one. */
  const st = fakeStore({});
  st._d['bohemia_city_save'] = JSON.stringify({ v: 1, t: 1, data: { day: 42 }, prefabs: null });
  const s = mk(st); s.probe();
  const old = s.load();
  ok('L-G: a people-less save from before 9/4 still loads and does not throw',
     !!(old && old.data.day === 42));
  ok('L-G: and it reports NO people rather than an empty population',
     old.data.people === undefined || old.data.people === null);
  s.save(STATE_P(43));
  ok('L-G: and the first write after it carries them', SAME_GEN(s.load()));
}

/* ==========================================================================
   M. THE DESYNC CASE -- THE ONE THIS HARNESS WAS BUILT FOR.
   The row's own sentence: force a torn write, roll the world back one
   generation, and assert THE PEOPLE CAME WITH IT.

   Before 9/4 this could not have passed. The world lived in the two-slot
   checksummed save and the five lived in five raw keys beside it, so tearing
   the newest slot rolled the WORLD back one generation and left the POPULATION
   where it was: yesterday's valley with today's people in it. Nothing crashes,
   nothing looks wrong, and the save cannot reproduce the run it recorded.
   ========================================================================= */
{
  const st = fakeStore({});
  const s1 = mk(st); s1.probe();
  s1.save(STATE_P(1));                               // slot a, gen 1
  s1.save(STATE_P(2));                               // slot b, gen 2
  const keys = Object.keys(st._d).filter(k => /\.(a|b)$/.test(k));
  ok('M: two slots, each holding a whole run -- world and people', keys.length === 2);

  const newest = keys.map(k => ({ k, g: JSON.parse(st._d[k]).gen }))
                     .sort((x, y) => y.g - x.g)[0].k;
  const beforeTear = st._d[newest];
  st._d[newest] = beforeTear.slice(0, beforeTear.length - 40);   // a truncated write
  /* ANTI-VACUITY. A rollback test that never rolled back passes for the wrong
     reason, and I have been fooled by exactly that shape twice this week: a
     mutation that never executed, and a harness whose reset it forgot. */
  ok('M: *** THE TEAR ACTUALLY LANDED ON THE NEWEST SLOT ***',
     st._d[newest] !== beforeTear && st._d[newest].length < beforeTear.length);

  const relaunch = mk(st);                           // no memory of the session that tore it
  relaunch.probe();
  const back = relaunch.load();
  ok('M: the torn newest slot is detected, not parsed', relaunch.status().corrupt >= 1);
  ok('M: and the world really fell back a generation (day '
    + (back && back.data && back.data.day) + ', not 2)',
     !!(back && back.data && back.data.day === 1));
  ok('M: *** AND THE PEOPLE CAME WITH IT *** -- the world and its population '
    + 'are the same generation, which is the whole bug', SAME_GEN(back));
}
{
  /* M2: THE TIME MACHINE, WITH PEOPLE. B proved a failed write cannot
     resurrect an old WORLD on the next launch. It has never been asked whether
     it can resurrect an old POPULATION, which is the same bug wearing the other
     half of the save. */
  const st = fakeStore({ cap: 200000 });
  const s1 = mk(st); s1.probe(); s1.save(STATE_P(1));
  st._fillToCap();
  const s2 = mk(st); s2.probe(); s2.mem = null;
  s2.save(STATE_P(9));                               // refused; drops to memory
  ok('M2: the failed write drops to memory with the people', s2.status().mode === 'memory');
  ok('M2: and THIS session still holds generation 9', SAME_GEN(s2.load()));
  st._unballast();
  const s3 = mk(st); s3.probe();
  const after = s3.load();
  ok('M2: the next launch does not resurrect generation 1 -- no time machine '
    + 'for the people either',
     after === null || !(after.data && after.data.people
       && after.data.people.belong.CARTEL.gave === 1));
}

/* ==========================================================================
   N. WHAT THE PEOPLE COST, AND WHETHER THEY STILL FIT.
   THE PROBE WRITES A PROBE THE SIZE OF THE REAL SAVE. That is the design that
   killed the 1-byte-probe bug, and it means the save getting bigger is not a
   free change: it moves the line between a device that is called disk and a
   device that is called memory. Yesterday's row made the save several times
   bigger and nobody measured it, so this measures it and holds a ceiling.
   ========================================================================= */
{
  const world  = JSON.stringify(STATE(1)).length;
  const whole  = JSON.stringify(STATE_P(1)).length;
  const people = whole - world;

  /* the honest case first: a device with room takes the whole thing */
  const roomy = mk(fakeStore({ cap: 5 * 1024 * 1024 }));   // a real iPhone origin quota
  ok('N: on a phone-sized quota the whole run -- world and people -- is disk',
     roomy.probe() === 'disk');
  roomy.save(STATE_P(5));
  ok('N: and it round-trips there', SAME_GEN(roomy.load()));

  /* THE NEW EDGE THE PEOPLE CREATED: a store that could hold the world alone
     and cannot hold the world plus its population. The only wrong answer is a
     SILENT half-save -- the world on disk, the people dropped -- which is the
     exact shape of the bug that was fixed yesterday. It must be called memory,
     out loud, and it must keep the whole run. */
  const tight = mk(fakeStore({ maxWrite: world + Math.floor(people / 2) }));
  ok('N: a store that fits the world but not the people is called MEMORY, '
    + 'never a silent half-save', tight.probe() === 'memory');
  tight.save(STATE_P(2));
  ok('N: and that run is whole in memory, world and people together',
     SAME_GEN(tight.load()));
  ok('N: and the player is told (' + String(tight.status().line).slice(0, 40) + ')',
     /MEMORY ONLY/.test(tight.status().line));

  /* the ceiling. Not a taste rule: a save whose size nobody watches is a save
     whose probe threshold nobody watches. 3,683 bytes measured in the running
     city on 9/5, of which 3,170 were the people and 2,928 of those were the
     deed table. 64KB is generous and still an order of magnitude under any
     real quota; it exists so a future row cannot quietly put a roster in here. */
  const CEIL = 65536;
  const real = JSON.stringify(STATE_P(1)).length;
  ok('N: the harness payload is under the 64KB ceiling (' + real + ' bytes, '
    + people + ' of them people)', real < CEIL);
}

/* ---- K. THE REAL SURFACE -------------------------------------------------
   VERIFY ON THE REAL SURFACE (7/18): everything above ran in Node against a fake
   browser I wrote, which proves the LOGIC and proves nothing about the page he
   taps. So the last thing this gate does is boot the actual alpha and drive the
   actual CITYSAVE that the actual game built. */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) {
    ok('K: playwright is available to drive the real surface', false);
    console.log('SAVE IPHONE GATE: ' + pass + ' passed, ' + fail + ' failed');
    process.exit(1);
  }
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil: 'load' });
  await SETTLE(pg, 2500);

  const live = await pg.evaluate(() => {
    const out = { has: typeof CITYSAVE !== 'undefined' };
    if (!out.has) return out;
    out.v = CITYSAVE.V;
    out.mode = CITYSAVE.mode;
    out.line = CITYSAVE.status ? CITYSAVE.status().line : null;
    CITYSAVE.save({ day: 2, hx: 1, hy: 2 });
    CITYSAVE.save({ day: 3, hx: 11, hy: 22 });   // TWO autosaves: A then B
    const got = CITYSAVE.load();
    out.roundTrip = !!(got && got.data && got.data.day === 3 && got.data.hx === 11);
    out.slots = Object.keys(localStorage).filter(k => /^bohemia_city_save\.(a|b)$/.test(k)).length;
    // and the integrity check, on the real store: tear the newest slot
    const ks = Object.keys(localStorage).filter(k => /^bohemia_city_save\.(a|b)$/.test(k));
    if (ks.length) {
      const raw = localStorage.getItem(ks[0]);
      localStorage.setItem(ks[0], raw.slice(0, raw.length - 30));
      const s2 = BohemiaSave.make({ name: 'bohemia_city_save' });
      s2.probe(); s2.load();
      out.detectsTear = s2.status().corrupt >= 1;
    }
    return out;
  });
  ok('K: the alpha still loads with ZERO page errors after the save swap'
     + (errs.length ? ' -- first: ' + errs[0] : ''), errs.length === 0);
  ok('K: CITYSAVE exists at runtime in the real page', live.has === true);
  ok('K: and it is v2, not the 7/7 body', live.v === 2);
  ok('K: it round-trips a real save in a real browser', live.roundTrip === true);
  ok('K: two autosaves land in TWO slots on the real localStorage, not one'
     + ' (slots=' + live.slots + ')', live.slots === 2);
  ok('K: it detects a torn slot on the real store', live.detectsTear === true);
  ok('K: and the player is given a real status line', typeof live.line === 'string' && live.line.length > 10);

  /* ========================================================================
     O. THE DESYNC CASE ON THE SURFACE HE PLAYS (9/5).
     M proved it in Node against a fake browser I wrote myself. VERIFY ON THE
     REAL SURFACE says that proves the logic and nothing about the page he taps,
     so this walks the same failure through the REAL city's own snapshot, the
     REAL CITYSAVE the alpha built, and the REAL localStorage, and models a
     RELAUNCH rather than a next call -- load() prefers the in-session copy,
     which is correct, and a harness that forgets it measures itself.
     ====================================================================== */
  await pg.evaluate(() => { try { localStorage.clear(); } catch (e) { } });
  await SETTLE(pg, 400);
  await pg.click('#front').catch(() => { });
  await SETTLE(pg, 40000, async () => {
    const f = pg.frames().find(x => x.name() === 'cityFrame');
    if (!f) return false;
    try { return await f.evaluate(() => typeof citySnapshot === 'function' && DAY.day >= 1); }
    catch (e) { return false; }
  });
  const city = pg.frames().find(x => x.name() === 'cityFrame');
  ok('O: the walked world is up', !!city);

  let real = { skipped: true };
  if (city) {
    /* seed people memory the way playing does, then take the city's own
       snapshot -- not a shape this gate invented. */
    const snap = await city.evaluate(() => {
      try {
        ctMind('gate:one'); ctMind('gate:two'); ctMindSave();
        window.__CT_BELONG = window.__CT_BELONG || {};
        window.__CT_BELONG.meta = { CARTEL: { gave: 1, owed: 2, burned: false } };
        ctBelongPersist(); knownSave(); ctSave();
      } catch (e) { }
      return citySnapshot();
    });
    real = await pg.evaluate((s0) => {
      const out = {};
      const NAME = 'bohemia_city_save';
      out.carriesFive = !!(s0 && s0.people && ['met', 'minds', 'known', 'belong', 'deed']
        .every(k => k in s0.people));
      out.bytes = JSON.stringify(s0).length;
      out.peopleBytes = (s0 && s0.people) ? JSON.stringify(s0.people).length : 0;
      /* A GATE MUST GO RED, NEVER EXPLODE. Found by mutation: blanking the
         snapshot's people made this throw out of the page and killed the run
         before a single claim was printed, which reads as a broken gate rather
         than a broken game. A missing population is a FINDING, so it reports. */
      if (!out.carriesFive) return out;
      /* generation 1: the city's real snapshot, marked */
      const g1 = JSON.parse(JSON.stringify(s0));
      g1.day = 1; g1.people.belong = { CARTEL: { gave: 1, owed: 2, burned: false } };
      /* generation 2: a later day AND a later population */
      const g2 = JSON.parse(JSON.stringify(s0));
      g2.day = 2; g2.people.belong = { CARTEL: { gave: 9, owed: 4, burned: true } };

      const s = BohemiaSave.make({ name: NAME });
      out.mode = s.probe();                       // with the people aboard
      s.save(g1); s.save(g2);
      const ks = Object.keys(localStorage).filter(k => new RegExp('^' + NAME + '\\.(a|b)$').test(k));
      out.slots = ks.length;
      if (ks.length === 2) {
        const newest = ks.map(k => ({ k, g: JSON.parse(localStorage.getItem(k)).gen }))
                         .sort((x, y) => y.g - x.g)[0].k;
        const raw = localStorage.getItem(newest);
        localStorage.setItem(newest, raw.slice(0, raw.length - 40));
        out.tore = localStorage.getItem(newest).length < raw.length;
        /* THE RELAUNCH: a fresh instance over the same real store */
        const s2 = BohemiaSave.make({ name: NAME });
        s2.probe();
        const back = s2.load();
        out.corrupt = s2.status().corrupt;
        out.day = back && back.data ? back.data.day : null;
        out.gave = (back && back.data && back.data.people && back.data.people.belong
          && back.data.people.belong.CARTEL) ? back.data.people.belong.CARTEL.gave : null;
      }
      try { localStorage.clear(); } catch (e) { }
      return out;
    }, snap);
  }

  ok('O: the real city snapshot carries all five (' + real.bytes + ' bytes, '
    + real.peopleBytes + ' of them people)', real.carriesFive === true);
  ok('O: and the save still probes DISK on a real browser with them aboard',
     real.mode === 'disk');
  ok('O: two real generations land in two real slots', real.slots === 2);
  ok('O: *** THE TEAR ACTUALLY LANDED ON THE NEWEST REAL SLOT ***', real.tore === true);
  ok('O: the real store detects it rather than parsing it', real.corrupt >= 1);
  ok('O: the world really fell back a generation on the real surface (day '
    + real.day + ', not 2)', real.day === 1);
  ok('O: *** AND THE PEOPLE CAME WITH IT, ON THE SURFACE HE PLAYS *** -- '
    + 'the belonging came back at generation ' + real.gave + ', and the world it '
    + 'came back with is generation 1', real.gave === 1);

  await b.close();

  console.log('SAVE IPHONE GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
