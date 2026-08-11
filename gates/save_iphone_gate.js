/* ============================================================================
   SAVE IPHONE GATE (8/6/26) — the demo is played on an iPhone, so the save is
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
   ========================================================================== */
'use strict';
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
  await pg.waitForTimeout(2500);

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
  await b.close();

  ok('K: the alpha still loads with ZERO page errors after the save swap'
     + (errs.length ? ' -- first: ' + errs[0] : ''), errs.length === 0);
  ok('K: CITYSAVE exists at runtime in the real page', live.has === true);
  ok('K: and it is v2, not the 7/7 body', live.v === 2);
  ok('K: it round-trips a real save in a real browser', live.roundTrip === true);
  ok('K: two autosaves land in TWO slots on the real localStorage, not one'
     + ' (slots=' + live.slots + ')', live.slots === 2);
  ok('K: it detects a torn slot on the real store', live.detectsTear === true);
  ok('K: and the player is given a real status line', typeof live.line === 'string' && live.line.length > 10);

  console.log('SAVE IPHONE GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
