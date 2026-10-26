/* ==========================================================================
   THE JOB TELLS THE TRUTH, IN BLOOD  (WORLD [the job tells the truth, in blood], 10/26/26, rule 208(f))

   PAOLO 10/25: 'make sure on the job the stars are red, and the button itself looks bloody depending on how difficult the job is,
   especially if it's gonna be super overpowered like wolves... that's one of the weak points of Battle Brothers, not really
   accurate, so try to be accurate... depending on the chance of an encounter and how dangerous the encounters are.'

   THE LIVE DEMO ON THE PHONE PROFILE (JOB_PROFILE=computer for his computer), five crews as they would stand (the Lone Wolf alone
   on day one, a new crew of three, six at level three by day twenty, twelve at level six by day fifty, and THE BLOCK WATCH'S
   TWELVE AT LEVEL ONE ON DAY ONE with EYES' own two jobs, Blues' cold box and Cartel's tigers), 50 jobs each off the valley's
   own boards (the shelf's pick, town by town; 20 for the Block Watch): 220 jobs. Each job's stars and blood are what the game
   read in the page (slices/bohemia_job_danger.js: every fight it brings rolled and played on AUTO against that crew). Then each
   job is PLAYED AGAIN 100 TIMES WITH FRESH DICE, here in node, on the fight's own rules out of BOHEMIA_FIGHT.html, with the exact
   hand-over the page used (each fight happening at its own chance). RULE 254 (Paolo 10/26, 'the same calculator as the auto
   combat'): ONE CALCULATOR, ONE SCALE. A play is worth what the AUTO button counts it (the fight's own oddsRunValue: a clean win 1,
   men down down_value times the share standing, a death or a loss 0), the trip the product over its fights, and the job's number
   on AUTO is the mean over its plays: the number the AUTO colour is painted from. 208(a)'s 'one in six laid up is clean' is STRUCK.
     J1  the five crews' jobs all read (none stuck, none broken), red stars on every one
     J2  a ONE-star job is AUTO green: its plays together worth the AUTO colour's turn (0.8) or more
     J3  a THREE-star job is where the calculator expects men down or dead: its plays together worth down_value (0.5) or less
     J4  the blood ranks with the danger: the more blood, the more often someone comes home down (rank correlation 0.6 or more;
         the stars' measured clean falls 1 > 2 > 3), and the blood painted on a town's board rows is the read's own number
     J5  the meet card counts true: twelve of the jobs' fights handed through the map's one door, the card's count and kind are
         the band read, and ENGAGE deals exactly that band on the board (the same ids, the same count)
     J6  the stars move when the crew moves: the same job reads different (or the same with cause) for the Lone Wolf and twelve men
     J7  nothing threw
     J8  NO STAR LIES (TUNING's test: pooled means cannot see a lie): a one-star job worth under the turn less a hair (0.1), or a
         three-star job over down_value and a hair, at most one in fifty; EYES' cold box and tigers for the Block Watch on day one
         say what happened to them
     J9  NO CHAMPION ON DAY ONE: every fight of every day-one crew's jobs is dressed for day one and holds only the kinds of its
         faction's first phase (ours.enemy_tiers): no Marauder, no leader, for the Block Watch's twelve as for the Lone Wolf
     J10 ONE CALCULATOR, ONE SCALE (rule 254(d)): the page's lines are the AUTO colour's own (ours.odds_colour turn and down_value,
         job_danger.json's copies equal); ONE NUMBER: 60 of the jobs' sure fights replayed here on the page's own hand-over and the
         page's own dice with the fight's own count (oddsRunValue), each on a fresh copy of the rules as the page reads it, IN THE
         PAGE (the browser's own engine), give the page's number to the last digit (MEASURED 10/26: the fight's own code carries a
         little from one fight into the next, up to 6.6 plays in 96 on a copy that had played many, so the reader reads each fight on a
         fresh copy; COMBAT's, NOTEd; and node's engine takes the same dice a little differently, up to 6.8 plays in 96, so node's
         replay is printed, not held), and every job's
         blood is its number on the AUTO colour's line, exactly; every job's blood is on the side of the turn its 100 fresh plays
         are (clean tin where AUTO is green, blood where it is red) unless they sit within 0.1 of the turn, at most one job in a
         hundred (two samples of the same dice: 96 plays and 100 each wobble about 0.04); every job whose plays lose a man
         (dead or lost) 6 in 10 or more reads three stars and the deepest blood. The blood against the 100 fresh plays is printed:
         two samples of the same dice differ, and the blood's line is steep (0.8 to 0.5 is the whole scale)
   node gates/the_job_tells_the_truth_gate.js     (about fifteen minutes: 23,000 fights played in node on four processes)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');

/* ---------------- THE REPLAY: the fight's own rules, plain, in node ---------------- */
function seedOf(s) { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
async function engine() {
  const html = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
  const grab = id => html.match(new RegExp('<script id="' + id + '">([\\s\\S]*?)<\\/script>'))[1];
  const orv = html.match(/function oddsRunValue\(E\) \{[\s\S]*?\n\}/)[0];   /* the AUTO button's own count, the one the page plays (rule 254) */
  const ctx = { console, Math, JSON, Date, Object, Array, String, Number, Error, Promise, Set, Map, LSV: {},
    localStorage: { getItem: k => (ctx.LSV[k] === undefined ? null : ctx.LSV[k]), setItem: () => {}, removeItem: () => {} },
    fetch: u => Promise.resolve({ json: () => Promise.resolve(JSON.parse(fs.readFileSync(path.join(ROOT, 'slices', u), 'utf8'))) }) };
  vm.createContext(ctx);
  vm.runInContext(grab('fight-data') + '\n' + grab('fight-rules') + '\n' + orv + '\nthis.FIGHT = FIGHT; this.DB = DB; this.loadAll = loadAll; this.run = oddsRunValue; this.seed = function (v) { SEED = v >>> 0; };', ctx);
  await ctx.loadAll();
  /* a fresh copy of the rules for each fight, as the page reads them (the fight carries a little from one fight into the next) */
  const body = grab('fight-data') + '\n' + grab('fight-rules') + '\n' + orv + '\nreturn { F: FIGHT, DB: DB, run: oddsRunValue, seed: function (v) { SEED = v >>> 0; } };';
  const MK = vm.runInContext('(function (b) { return new Function(b); })', ctx)(body);
  ctx.fresh = () => { const F = MK(); Object.keys(ctx.DB).forEach(k => { F.DB[k] = ctx.DB[k]; }); return F; };
  return ctx;
}
async function replay(file, out) {
  const E = await engine(), jobs = JSON.parse(fs.readFileSync(file, 'utf8')), res = [];
  for (const j of jobs) {
    E.LSV = { 'bohemia.fight.formation.v1': j.formation || null };
    const X = E.fresh(), FIGHT_ = X.F;   /* a fresh copy of the rules for each job */
    let literal = 0, worth = 0, plays = 0, fights = 0, deaths = 0, wiped = 0, lostMan = 0;
    for (let k = 0; k < j.plays; k++) {
      const dice = seedOf('verify:' + j.key + ':' + k); let r = dice, lit = true, w = 1, died = false, wipe = false, lose = false;
      const roll = () => { r = (r + 0x6D2B79F5) >>> 0; let t = r; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
      for (let fi = 0; fi < j.fights.length; fi++) {
        const f = j.fights[fi]; if (f.p < 1 && roll() >= f.p) continue;
        X.seed(seedOf('verify:' + j.key + ':' + k + ':' + fi));
        FIGHT_.setup(JSON.parse(JSON.stringify(f.opts)));
        let g = 0; while (!FIGHT_.S.over && g <= 6000) { const v = FIGHT_.current(); if (!v) break; FIGHT_.aiStep(v); FIGHT_.S.events = []; g++; }
        fights++;
        const v = FIGHT_.S.over ? X.run(FIGHT_) : 0; w *= v;   /* the AUTO button's count of this fight */
        const mine = FIGHT_.S.units.filter(u => u.side === 'you');
        if (mine.some(u => u.dead)) died = true; if (FIGHT_.S.result !== 'won' && mine.every(u => u.dead || u.down || u.fled)) wipe = true;
        if (v === 0) lose = true;   /* a man dead, or the fight lost */
        if (v !== 1) lit = false;
        if (v === 0) break;   /* the trip is worth nothing from here: the rest cannot move it */
      }
      plays++; if (lit) literal++; worth += w; if (died) deaths++; if (wipe) wiped++; if (lose) lostMan++;
    }
    res.push({ key: j.key, literal: literal, worth: worth, plays: plays, fights: fights, deaths: deaths, wiped: wiped, lostMan: lostMan });
  }
  fs.writeFileSync(out, JSON.stringify(res));
}
if (process.argv[2] === '--replay') { replay(process.argv[3], process.argv[4]).then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); }); return; }

/* ---------------- THE LIVE DEMO ---------------- */
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const PROFILE = process.env.JOB_PROFILE || 'phone_portrait', PLAYS = +(process.env.JOB_PLAYS || 100), PER = +(process.env.JOB_PER_CREW || 50);
const SHOTS = process.env.JOB_SHOTS || null;
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nTHE JOB TELLS THE TRUTH, IN BLOOD: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const O = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/origins.json'), 'utf8')).origins;
const OURS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8')).crew.value;
const man = (m, i, lv) => ({ name: m.name || ['YOU', 'DESI', 'RAUL', 'TINA', 'OSCAR', 'LUPE', 'BETO', 'NENA', 'CHUY', 'PALOMA', 'TONO', 'LALO'][i], background: m.background, level: lv || m.level || 1, main: i === 0 });
const CREWS = [
  { id: 'lone wolf, day 1', day: 1, men: O.filter(o => o.id === 'wolf')[0].men.map((m, i) => man(m, i)) },
  { id: 'a new crew of three, day 3', day: 3, men: O.filter(o => o.id === 'newcrew')[0].men.map((m, i) => man(m, i)) },
  { id: 'six at level 3, day 20', day: 20, men: OURS.slice(0, 6).map((m, i) => man(m, i, 3)) },
  { id: 'twelve at level 6, day 50', day: 50, men: OURS.slice(0, 12).map((m, i) => man(m, i, 6)) },
  /* EYES round three (10/26, records/BOHEMIA_EYES_EVERY_ASK_ROUND_THREE_TEN_FIGHTS_AND_AUTO_BY_EYE_10_26_26.md item 2): the Block Watch's
     twelve on day one, a one-star cold box that wiped them 3 times in 17 and two-star tigers that wiped all twelve: both jobs read */
  { id: 'the block watch, day 1', day: 1, per: 20, men: O.filter(o => o.id === 'watch')[0].men.map((m, i) => man(m, i)), must: [{ id: 'qd-c02', town: /BLUE/ }, { id: 'qd-aa15', town: /CARTEL/ }] }
];

(async () => {
  let d;
  try { d = await drive.open({ keepCards: true, profile: PROFILE, engage: false }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(400); } return false; };
  const jobs = [], tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'jobtruth-'));
  const JDF = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/job_danger.json'), 'utf8')), SURE = [];
  let scale = null;
  try {
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 40000 }).catch(() => {});
    const eng = await waitFor(() => fr.evaluate(() => !!(window.BohemiaJobDanger && BohemiaJobDanger.ready())), 60000);
    if (!eng) { ok('J1 the fight\'s own rules load in the map', false, await fr.evaluate(() => JSON.stringify(window.BohemiaJobDanger && BohemiaJobDanger.state().err))); return done(); }
    await fr.evaluate(() => { window.__JOB_DANGER_KEEP = true; });   /* the page keeps each fight's hand-over and dice for J10 */
    /* a checker's own crews (gates switch settings on for themselves only, rule 192(c)) */
    for (const C of CREWS) {
      const tc = Date.now();
      const got = await fr.evaluate(([C, PER]) => {
        PER = C.per || PER;
        localStorage.setItem('bohemia.company.v1', JSON.stringify(C.men)); localStorage.removeItem('bohemia.company.line.v1');
        localStorage.setItem('bohemia.hired.v1', '[]'); localStorage.setItem('bohemia.walked.v1', '[]'); localStorage.setItem('bohemia.taken.v1', '[]'); localStorage.setItem('bohemia.fight.after.v1', '[]');
        localStorage.setItem('bohemia.fight.met.v1', '3');
        try { LOOP.start = Object.assign({}, LOOP.start || {}, { company: C.men.map(m => ({ background: m.background, level: m.level })) }); } catch (e) {}
        try { DAY.day = C.day; } catch (e) {}
        const bs = ctBases() || {}, names = Object.keys(bs).sort(), out = [];
        /* the valley's boards as they stand on his day, then the boards of the next windows (a board turns over every three days),
           until the crew has its jobs: the same person at another town is another job (another road, another ground) */
        for (let w = 0; w < 12 && out.length < PER; w++) { const day = C.day + 3 * w;
          for (let i = 0; i < names.length && out.length < PER; i++) {
            const n = names[(i + C.day * 7 + w * 5) % names.length]; let tier = 'camp'; try { tier = mapTierOf(n) || 'camp'; } catch (e) {}
            let list = null; try { list = BohemiaBoardShelf.pick({ name: n, tier: tier }, day, { traits: [], held: [], places: BohemiaBoardShelf.mapPlaces ? BohemiaBoardShelf.mapPlaces(day) : null }); } catch (e) {}
            (list || []).forEach(o => { if (out.length < PER && !out.some(x => x.o.id === o.id && x.place === n)) out.push({ o: o, place: n }); });
          } }
        /* EYES' own jobs, at their own towns, whatever the shelf's pick said */
        (C.must || []).forEach(m => { const re = new RegExp(m.town.source || m.town, 'i'); const t = names.filter(n => re.test(n))[0];
          const o = (BohemiaBoardShelf.shelf().offers || []).filter(x => x.id === m.id)[0];
          const had = out.filter(x => x.o.id === m.id && x.place === t)[0];
          if (had) had.must = true; else if (t && o) out.unshift({ o: o, place: t, must: true }); });
        /* the reads, as a surface asks for them */
        return out.map(x => { const R = BohemiaJobDanger.read(x.o, x.place); return { id: x.o.id, place: x.place, o: x.o, has: !!R, must: !!x.must }; });
      }, [{ id: C.id, day: C.day, men: C.men, per: C.per, must: (C.must || []).map(m => ({ id: m.id, town: { source: m.town.source } })) }, PER]);
      const all = await waitFor(() => fr.evaluate((ids) => ids.every(x => { const R = BohemiaJobDanger.read(x.o, x.place); return R && R.state !== 'reading'; }), got), 900000);
      const rows = await fr.evaluate((ids) => ids.map(x => { const R = BohemiaJobDanger.read(x.o, x.place); if (!R) return { id: x.id, place: x.place, state: 'none' };
        return { id: x.id, place: x.place, skulls: x.o.skulls, state: R.state, stars: R.stars, danger: R.danger, clean: R.clean, blood: R.blood, broke: R.broke || null,
          formation: localStorage.getItem('bohemia.fight.formation.v1'),
          fights: R.fights.map(f => ({ what: f.what, why: f.why, n: f.n, p: f.p, band: f.band, faction: f.faction, days: f.days,
            opts: f.opts || BohemiaJobDanger.doorOpts({ count: f.band.length, band: f.band, faction: f.faction, days: f.days, difficulty: f.difficulty }, f.at) })) }; }), got);   /* the very hand-over the page played */
      rows.forEach((r, i) => { r.crew = C.id; r.day = C.day; r.must = !!(got[i] && got[i].must); r.key = C.id + '|' + r.place + '|' + r.id; jobs.push(r); });
      const sure = await fr.evaluate((ids) => { const P = BohemiaJobDanger.played(), out = [], seen = {};
        ids.forEach(x => { const R = BohemiaJobDanger.read(x.o, x.place); if (!R || R.state !== 'read') return;
          R.fights.forEach(f => { const Q = P[f.fk]; if (f.p < 0.25 || seen[f.fk] || !Q || !Q.opts || out.length >= 12) return; seen[f.fk] = 1;
            out.push({ fk: f.fk, runs: Q.runs, sum: Q.sum, seed: Q.seed, steps: Q.steps, formation: Q.formation, opts: Q.opts, c: f.clean, job: x.id + '@' + x.place }); }); });
        return out; }, got);
      /* J10's same dice, IN THE PAGE (the browser's own engine, as the reader's worker): each sure fight replayed on a fresh copy of
         the rules, the page's own hand-over (cloned as a worker gets it) and dice, the fight's own count */
      for (const x of sure) {
        x.inPage = await fr.evaluate(async (fk) => { const Q = BohemiaJobDanger.played()[fk]; if (!Q || !Q.opts) return null;
          const X = BohemiaJobDanger.fresh(), o = typeof structuredClone === 'function' ? structuredClone(Q.opts) : JSON.parse(JSON.stringify(Q.opts)); let sum = 0;
          for (let n = 0; n < Q.runs; n++) { X.seed((Q.seed + n * 7919) >>> 0); X.F.setup(o);
            let g = 0; while (!X.F.S.over && g <= Q.steps) { const v = X.F.current(); if (!v) break; X.F.aiStep(v); X.F.S.events = []; g++; }
            sum += X.F.S.over ? X.run(X.F) : 0; if (n % 8 === 7) await new Promise(r => setTimeout(r, 0)); }
          return sum; }, x.fk).catch(() => null);
      }
      sure.forEach(x => { x.crew = C.id; SURE.push(x); });
      console.log('  ...' + C.id + ' (' + Math.round((Date.now() - tc) / 1000) + ' s): ' + rows.length + ' jobs read, ' + [1, 2, 3].map(s => rows.filter(r => r.stars === s).length + ' at ' + s).join(', ') + (all ? '' : ' (TIMED OUT)'));
    }
    const read = jobs.filter(j => j.state === 'read');
    ok('J1 the five crews\' ' + jobs.length + ' jobs all read (played on AUTO in the page), none stuck or broken', jobs.length >= CREWS.reduce((t, c) => t + (c.per || PER), 0) * 0.9 && read.length === jobs.length,
      read.length + ' of ' + jobs.length + ' read; ' + jobs.filter(j => j.state !== 'read').map(j => j.id + ':' + j.state + (j.broke ? ' ' + j.broke : '')).slice(0, 4).join(' | '));

    /* J4's paint: a town's board, the rows' blood is the read's own number, in the clay's stages */
    const C0 = CREWS[1];
    await fr.evaluate(([C]) => { localStorage.setItem('bohemia.company.v1', JSON.stringify(C.men)); try { DAY.day = C.day; LOOP.start.company = C.men.map(m => ({ background: m.background, level: m.level })); } catch (e) {} }, [C0]);
    const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready));
    const t = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null; for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (!best || dd < best.d) best = { n, x: b.x, y: b.y, d: dd }; } return best; });
    for (let k = 0; k < 4 && !(await settleOpen()); k++) { await fr.evaluate((t) => { travelStop(); townTap({ name: t.n, x: t.x, y: t.y }); }, t); await waitFor(settleOpen, 60000);
      if (await fr.evaluate(() => !!MEET.up)) await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="back"]'); if (b) b.click(); }); }
    let paint = [];
    if (await settleOpen()) {
      const sf = await (await fr.$('#settleFrame')).contentFrame();
      const TOUCH = PROFILE !== 'computer';
      for (let k = 0; k < 4; k++) {
        const xy = await sf.evaluate(() => BohemiaSettlement.where('board')); const hb = await (await fr.$('#settleFrame')).boundingBox();
        if (xy) { if (TOUCH) await page.touchscreen.tap(hb.x + xy.x, hb.y + xy.y); else await page.mouse.click(hb.x + xy.x, hb.y + xy.y); }
        if (await waitFor(() => sf.evaluate(() => document.getElementById('sheet').classList.contains('on') && document.querySelectorAll('#sheet button.act.client').length > 0), 6000)) break;
      }
      await waitFor(() => sf.evaluate(() => [...document.querySelectorAll('#sheet button.act.client')].every(b => b.dataset.blood != null)), 120000);
      paint = await sf.evaluate(() => [...document.querySelectorAll('#sheet button.act.client')].map(b => { const L = [...b.querySelectorAll(':scope > i.jdblood')];
        return { id: b.dataset.id, danger: +b.dataset.danger, blood: +b.dataset.blood, stars: +b.dataset.jdStars, red: !!b.querySelector('[data-red]'),
          layers: L.map(l => l.className + '@' + l.style.opacity), bm: b.hasAttribute('data-bm-blood-to') ? +b.getAttribute('data-bm-blood-to') : null }; }));
      if (SHOTS) await page.screenshot({ path: path.join(SHOTS, PROFILE + '_board.png') });
      await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
    }
    const want = await fr.evaluate((P) => P.map(p => BohemiaJobDanger.bloodOf(p.danger)), paint);
    /* __ONE_BLOOD__ (UI, marked): the kit's clay layer draws the blood where the page has it; its stage is data-bm-blood-to */
    const stageOf = p => { if (p.bm != null) return p.bm; const m = p.layers.map(s => /([nmw])(\d)@([\d.]+)/.exec(s)).filter(Boolean); return m.reduce((t, x) => t + (+x[3] > 0 ? +x[2] + +x[3] : 0), 0); };
    const paintOk = paint.length > 0 && paint.every((p, i) => Math.abs(p.blood - want[i]) < 0.002 && p.red) &&
      paint.every(a => paint.every(b => !(a.blood > b.blood + 0.05) || stageOf(a) >= stageOf(b)));

    /* J5: the meet card counts true: the jobs' own fights through the one door, ENGAGE, and what stands on the board */
    const pick = [];
    ['beasts', 'brigands', 'ghosts'].forEach(fc => read.filter(j => j.fights.some(f => !f.road && f.faction === fc)).slice(0, 3).forEach(j => pick.push(j)));
    read.filter(j => j.fights.some(f => !f.road && f.faction !== 'brigands' && f.faction !== 'beasts')).slice(0, 3).forEach(j => { if (pick.indexOf(j) < 0) pick.push(j); });
    read.slice(0, 12).forEach(j => { if (pick.length < 12 && pick.indexOf(j) < 0) pick.push(j); });
    const meets = [];
    /* home from a fight, for sure: the checker ends it as won, leaves the end screen, and waits for the map */
    const home = async () => {
      for (let tries = 0; tries < 3 && await page.evaluate(() => !!window.CITYFIGHT); tries++) {
        for (let i = 0; i < 60; i++) { const h = await page.$('#fightFrame'); const ff = h ? await h.contentFrame() : null;
          if (ff && await ff.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S.board).catch(() => false)) {
            await ff.evaluate(() => { if (!FIGHT.S.over) { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; try { showOver('won'); } catch (e) {} } }); break; }
          await page.waitForTimeout(250); }
        await waitFor(() => page.evaluate(() => !!(window.SPOILS && SPOILS.frame) || !window.CITYFIGHT), 20000);
        await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
        await waitFor(() => page.evaluate(() => !window.CITYFIGHT), 30000);
      }
      await fr.evaluate(() => { try { LOOP.fighting = null; } catch (e) {} }); await page.waitForTimeout(1200);
    };
    for (const j of pick.slice(0, 12)) {
      await home();
      const C = CREWS.filter(c => c.id === j.crew)[0], f = j.fights.filter(x => !x.road)[0]; if (!f) continue;
      const card = await fr.evaluate(([C, j, f]) => {
        localStorage.setItem('bohemia.company.v1', JSON.stringify(C.men)); try { DAY.day = C.day; LOOP.start.company = C.men.map(m => ({ background: m.background, level: m.level })); } catch (e) {}
        const pm = partyMath('job', { skulls: j.skulls || 1 }); pm.count = f.n; pm.faction = f.faction === 'brigands' || f.faction === 'beasts' ? (f.faction) : 'brigands';
        if (f.faction !== 'brigands' && f.faction !== 'beasts') pm.faction = 'brigands';   /* a road faction is rolled at the door, as in the game */
        const roster = []; for (let i = 0; i < f.n; i++) roster.push({ arch: 'human' });
        meetWalk(() => cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'the checker: ' + j.id, faction: null, draft: true, roster, party: pm, street: true, why: f.why, at: { gx: city.x, gy: city.y } }));
        const el = document.getElementById('meetcard'); if (!el) return null;
        const sp = el.querySelector('.mcs [data-n]');   /* rule 224: the count is the men drawn; the number rides in data-n */
        return { n: sp ? +sp.dataset.n : null, what: sp ? sp.dataset.what : null, lone: /\d/.test(sp ? sp.textContent : '1'), band: (window.__JOB_ROLLED || {}).band || null };
      }, [C, j, f]);
      if (!card) { meets.push({ id: j.id, err: 'no card' }); continue; }
      await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="go"]'); if (b) b.click(); });
      let dealt = null;
      for (let i = 0; i < 160 && !dealt; i++) { const h = await page.$('#fightFrame'); const ff = h ? await h.contentFrame() : null;
        if (ff) dealt = await ff.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length && FIGHT.S.board) ? FIGHT.S.units.filter(u => u.side === 'them').map(u => u.kind) : null).catch(() => null);
        if (!dealt) await page.waitForTimeout(250); }
      meets.push({ id: j.id, crew: j.crew, faction: f.faction, read: f.band, card: card.n, what: card.what, lone: card.lone, rolled: card.band, dealt: dealt });
    }
    await home();
    const meetOk = meets.length >= 10 && meets.every(m => m.dealt && m.card === m.dealt.length && JSON.stringify(m.rolled) === JSON.stringify(m.dealt) && !m.lone);
    const meetSameAsRead = meets.filter(m => m.dealt && JSON.stringify(m.read) === JSON.stringify(m.dealt)).length;
    ok('J5 the meet card counts true: ' + meets.length + ' of the jobs\' fights through the one door, the card\'s count is what ENGAGE deals, id for id', meetOk,
      meets.map(m => m.id + ' ' + m.faction + ': card ' + m.card + ' ' + m.what + ', dealt ' + (m.dealt ? m.dealt.length : '-') + (JSON.stringify(m.read) === JSON.stringify(m.dealt) ? ' (= the read)' : '')).join(' | ') + '; ' + meetSameAsRead + ' dealt exactly the band the stars were read on');

    /* J6: the crew moves the stars: the Lone Wolf's first ten jobs read again, as they stand, with a crew of six at level three hired
       on (the same jobs, the same day; the job's size follows the roster, the read follows both) */
    const lone = read.filter(j => j.crew === CREWS[0].id).slice(0, 10);
    const again = await fr.evaluate(([C, L]) => {
      localStorage.setItem('bohemia.company.v1', JSON.stringify(C.men)); try { DAY.day = 1; LOOP.start.company = C.men.map(m => ({ background: m.background, level: m.level })); } catch (e) {}
      const shelf = BohemiaBoardShelf.shelf(), all = [].concat(shelf.offers || []);
      return L.map(j => { const o = all.filter(x => x.id === j.id)[0]; if (!o) return null; BohemiaJobDanger.read(o, j.place); return { id: j.id, place: j.place }; }).filter(Boolean);
    }, [CREWS[2], lone.map(j => ({ id: j.id, place: j.place }))]);
    await waitFor(() => fr.evaluate((L) => { const all = BohemiaBoardShelf.shelf().offers; return L.every(x => { const R = BohemiaJobDanger.read(all.filter(o => o.id === x.id)[0], x.place); return R && R.state !== 'reading'; }); }, again), 600000);
    const re = await fr.evaluate((L) => { const all = BohemiaBoardShelf.shelf().offers; return L.map(x => { const R = BohemiaJobDanger.read(all.filter(o => o.id === x.id)[0], x.place); return { id: x.id, place: x.place, stars: R && R.stars, danger: R && R.danger }; }); }, again);
    const moved = re.filter(r => { const j = lone.filter(x => x.id === r.id && x.place === r.place)[0]; return j && r.danger != null && (r.stars !== j.stars || Math.abs(r.danger - j.danger) > 0.05); });
    /* rule 208(d) asks that the read follows the crew, not that more men read safer: the job grows with the roster (rule 192) and
       with more men there are more who can go down, so a bigger crew moves the danger both ways (measured 10/26: 7 of 10 moved, 4 up) */
    ok('J6 the stars move with the crew: the Lone Wolf\'s first jobs read again with six men hired on', re.length >= 5 && moved.length >= Math.ceil(re.length / 2),
      re.map(r => { const j = lone.filter(x => x.id === r.id && x.place === r.place)[0]; return r.id + ' ' + (j ? j.stars + '*' + j.danger.toFixed(2) : '?') + ' -> ' + r.stars + '*' + (r.danger != null ? r.danger.toFixed(2) : '?'); }).join(', '));
    ok('J7 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
    /* J10's first half, off the page: the lines it reads with and the count its worker plays */
    scale = await fr.evaluate(() => ({ cfg: JSON.parse(JSON.stringify(BohemiaJobDanger.cfg())), orv: null, okRun: null })).catch(() => null);
    if (scale) { const src = fs.readFileSync(path.join(ROOT, 'slices/bohemia_job_danger.js'), 'utf8');
      scale.orv = /run: oddsRunValue \}/.test(src) && /E\.run\(E\.F\)/.test(src); scale.okRun = /function okRun|okRun\(/.test(src); }
    await d.close();

    /* ---------- the replay: each job 100 times with fresh dice, in node ---------- */
    const N = Math.max(1, Math.min(4, os.cpus().length)), chunks = Array.from({ length: N }, () => []);
    read.forEach((j, i) => chunks[i % N].push({ key: j.key, plays: PLAYS, formation: j.formation, fights: j.fights.map(f => ({ p: f.p, opts: f.opts })) }));
    const t0 = Date.now();
    const outs = await Promise.all(chunks.map((c, i) => new Promise((res, rej) => {
      const fi = path.join(tmp, 'in' + i + '.json'), fo = path.join(tmp, 'out' + i + '.json'); fs.writeFileSync(fi, JSON.stringify(c));
      const p = cp.spawn(process.execPath, [__filename, '--replay', fi, fo], { stdio: ['ignore', 'inherit', 'inherit'] });
      p.on('exit', code => code === 0 ? res(JSON.parse(fs.readFileSync(fo, 'utf8'))) : rej(new Error('replay ' + i + ' exited ' + code)));
    })));
    const M = {}; [].concat.apply([], outs).forEach(r => { M[r.key] = r; });
    /* rule 254: a job measures what its plays are worth on the AUTO button's count (the number its colour is painted from); the
       literal 'nobody down at all' share and the plays that lost a man are printed beside it */
    read.forEach(j => { const r = M[j.key]; j.measured = r ? r.worth / r.plays : null; j.literal = r ? r.literal / r.plays : null; j.auto = j.measured;
      j.deaths = r ? r.deaths : null; j.wiped = r ? r.wiped : null; j.lostMan = r ? r.lostMan / r.plays : null; j.plays = r ? r.plays : 0; });
    console.log('  ...replayed ' + read.length + ' jobs x ' + PLAYS + ' in ' + Math.round((Date.now() - t0) / 1000) + ' s');
    const by = s => read.filter(j => j.stars === s && j.measured != null);
    const agg = s => { const L = by(s), P = L.reduce((t, j) => t + j.plays, 0), C = L.reduce((t, j) => t + j.measured * j.plays, 0), Q = L.reduce((t, j) => t + j.literal * j.plays, 0); return { n: L.length, plays: P, clean: P ? C / P : null, literal: P ? Q / P : null }; };
    const A1 = agg(1), A2 = agg(2), A3 = agg(3);
    const OC = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8')).odds_colour.value, TURN = OC.turn, DOWNV = OC.down_value;
    const say = a => a.n + ' jobs, worth ' + (a.clean == null ? '-' : a.clean.toFixed(2)) + ' on AUTO\'s count (nobody down at all ' + (a.literal == null ? '-' : Math.round(100 * a.literal)) + ' in 100)';
    ok('J2 a ONE-star job is AUTO green: its plays together worth the turn (' + TURN + ') or more', A1.n > 0 && A1.clean >= TURN, say(A1) + '; the worst one-star job ' + (A1.n ? Math.min.apply(null, by(1).map(j => j.measured)).toFixed(2) : '-'));
    ok('J3 a THREE-star job is where the calculator expects men down or dead: its plays together worth down_value (' + DOWNV + ') or less', A3.n > 0 && A3.clean <= DOWNV, say(A3) + '; the best three-star job ' + (A3.n ? Math.max.apply(null, by(3).map(j => j.measured)).toFixed(2) : '-'));
    const rho = spearman(read.filter(j => j.measured != null).map(j => j.blood), read.filter(j => j.measured != null).map(j => 1 - j.measured));
    ok('J4 the blood ranks with the danger: rank correlation of the blood with how often someone came home down, the stars in order, the board painted the read',
      rho >= 0.6 && (A1.clean == null || A2.clean == null || A1.clean > A2.clean) && (A2.clean == null || A3.clean == null || A2.clean > A3.clean) && paintOk,
      'rho ' + rho.toFixed(2) + '; two stars: ' + say(A2) + '; the board at ' + (t && t.n) + ': ' + paint.map(p => p.id + ' ' + p.stars + '* blood ' + p.blood.toFixed(2) + ' (read ' + p.danger.toFixed(2) + ')').join(', '));
    /* J8: no star lies, job by job (TUNING 10/26: the pooled J2 and J3 pass any cut-off; a lie is one job) */
    const HAIR = 0.1, lies = read.filter(j => j.measured != null && ((j.stars === 1 && j.measured < TURN - HAIR) || (j.stars === 3 && j.measured > DOWNV + HAIR)));
    const eyes = read.filter(j => j.must);
    const eyesSay = eyes.map(j => j.id + ' at ' + j.place + ': ' + j.stars + ' red star' + (j.stars > 1 ? 's' : '') + ', played ' + j.plays + ': worth ' + j.measured.toFixed(2) + ' on AUTO, someone dead ' + j.deaths + ', wiped ' + j.wiped + ' (' + j.fights.map(f => f.band.length + ' ' + f.band.join('/')).join(' + ') + ')').join(' | ');
    const eyesTrue = eyes.length >= 2 && eyes.every(j => !(j.stars === 1 && j.measured < TURN - HAIR) && !(j.stars === 3 && j.measured > DOWNV + HAIR) && !(j.stars === 1 && j.wiped > 2));
    ok('J8 no star lies: one-star jobs worth under ' + (TURN - HAIR).toFixed(2) + ' or three-star jobs over ' + (DOWNV + HAIR).toFixed(2) + ' on AUTO, at most one in fifty; EYES\' cold box and tigers for the Block Watch say what happened',
      lies.length <= Math.floor(read.length / 50) && eyesTrue,
      lies.length + ' of ' + read.length + ' lie' + (lies.length ? ' (' + lies.slice(0, 5).map(j => j.crew + ' ' + j.id + ' ' + j.stars + '* ' + j.measured.toFixed(2)).join(', ') + ')' : '') + '; ' + eyesSay);
    /* J9: no champion on day one: every day-one fight dressed for day one, its kinds its faction's first phase */
    const T = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8')).enemy_tiers.value;
    const firstKinds = fc => { const m = (T.mix[fc] || {}).first || {}; const k = Object.keys(m); const h = (T.heads || {})[fc]; if (h) k.push(h); return k; };
    const day1 = read.filter(j => j.day <= 1), bad = [];
    day1.forEach(j => j.fights.forEach(f => { const ks = firstKinds(f.faction), off = f.band.filter(k => ks.indexOf(k) < 0);
      if ((f.days | 0) > 1 || off.length) bad.push(j.crew + ' ' + j.id + ' ' + f.what + ': day ' + f.days + ', ' + f.faction + ' ' + (off.length ? off.join('/') : f.band.join('/'))); }));
    ok('J9 no champion on day one: ' + day1.length + ' day-one jobs, every fight dressed for day one with its faction\'s first-phase kinds only', day1.length >= 40 && bad.length === 0,
      bad.length ? bad.slice(0, 6).join(' | ') : day1.reduce((t, j) => t + j.fights.length, 0) + ' fights, kinds ' + Array.from(new Set([].concat.apply([], day1.map(j => [].concat.apply([], j.fights.map(f => f.band)))))).join(', '));
    /* J10: one calculator, one scale (rule 254(d)) */
    const E = await engine(), same = [];
    for (const x of SURE.slice(0, 60)) {   /* the page's own plays, again: its hand-over, its dice, the fight's own count */
      E.LSV = { 'bohemia.fight.formation.v1': x.formation }; const o = JSON.parse(JSON.stringify(x.opts)), X = E.fresh(); let sum = 0;
      for (let n = 0; n < x.runs; n++) { X.seed((x.seed + n * 7919) >>> 0); X.F.setup(o);
        let g = 0; while (!X.F.S.over && g <= x.steps) { const v = X.F.current(); if (!v) break; X.F.aiStep(v); X.F.S.events = []; g++; }
        sum += X.F.S.over ? X.run(X.F) : 0; }
      same.push({ fk: x.fk, crew: x.crew, job: x.job, runs: x.runs, page: x.sum, inPage: x.inPage, here: sum }); }
    const differ = same.filter(x => x.inPage == null || Math.abs(x.page - x.inPage) > 1e-9), exact = same.filter(x => Math.abs(x.page - x.here) < 1e-9);
    const SIDE = 0.1, sides = [], lose = [], drawn = [];
    const bloodAt = v => Math.max(0, Math.min(1, (TURN - v) / Math.max(1e-6, TURN - DOWNV)));   /* a number on the AUTO colour's line */
    read.filter(j => j.measured != null).forEach(j => { const green = j.measured >= TURN;
      if (Math.abs(j.measured - TURN) > SIDE && ((j.blood === 0) !== green)) sides.push(j);
      if (Math.abs(j.blood - bloodAt(1 - j.danger)) > 1e-9) drawn.push(j);
      if (j.lostMan >= 0.6) lose.push(j); });
    const deep = lose.filter(j => !(j.stars === 3 && j.blood >= 0.999));
    const gaps = read.filter(j => j.measured != null).map(j => Math.abs(j.blood - bloodAt(j.measured))).sort((a, b) => a - b);
    const lineOk = !!scale && scale.orv && !scale.okRun && Math.abs(scale.cfg.cut_one - TURN) < 1e-9 && Math.abs(scale.cfg.cut_three - DOWNV) < 1e-9 &&
      Math.abs(scale.cfg.blood_from - (1 - TURN)) < 1e-6 && Math.abs(scale.cfg.blood_full - (1 - DOWNV)) < 1e-6 && scale.cfg.prior === 0 &&
      ['cut_one', 'cut_three', 'blood_from', 'blood_full'].every(k => Math.abs(JDF[k].value - scale.cfg[k]) < 1e-6);
    ok('J10 one calculator, one scale: AUTO\'s own lines; the page\'s sure fights replayed on its own dice give its own number to the last digit, every blood its number on the line; every blood on AUTO\'s side of the turn (one in a hundred for the dice); every job that loses a man in 6 plays of 10 three stars and the deepest blood',
      lineOk && same.length >= 40 && differ.length === 0 && drawn.length === 0 && sides.length <= Math.floor(read.length / 100) && deep.length === 0 && lose.length > 0,
      'lines ' + JSON.stringify(scale && { cut_one: scale.cfg.cut_one, cut_three: scale.cfg.cut_three, blood_from: scale.cfg.blood_from, blood_full: scale.cfg.blood_full, prior: scale.cfg.prior, from_fight: scale.cfg.from_fight, orv: scale.orv, okRun: scale.okRun }) +
      '; the same dice in the page: ' + same.length + ' sure fights, ' + same.reduce((t, x) => t + x.runs, 0) + ' plays, ' + differ.length + ' differ' + (differ.length ? ' (' + differ.slice(0, 3).map(x => x.job + ' the reader ' + x.page.toFixed(2) + ' again ' + (x.inPage == null ? '-' : x.inPage.toFixed(2)) + ' of ' + x.runs).join(', ') + ')' : '') +
      ' (node\'s own engine, for the record: ' + exact.length + ' of ' + same.length + ' to the last digit, the most apart ' + (same.length ? Math.max.apply(null, same.map(x => Math.abs(x.page - x.here))).toFixed(2) : '-') + ' plays)' +
      '; blood off its own line ' + drawn.length + '; off AUTO\'s side ' + sides.length + (sides.length ? ' (' + sides.slice(0, 4).map(j => j.id + ' blood ' + j.blood.toFixed(2) + ' 100 plays ' + j.measured.toFixed(2)).join(', ') + ')' : '') +
      '; lose a man 6 in 10: ' + lose.length + ' jobs, ' + (lose.length - deep.length) + ' read three stars and the deepest blood' + (deep.length ? ' (not: ' + deep.slice(0, 4).map(j => j.id + ' ' + j.stars + '* ' + j.blood.toFixed(2) + ' lost ' + Math.round(100 * j.lostMan)).join(', ') + ')' : '') +
      '; against 100 fresh plays the blood differs by ' + (gaps.length ? gaps[gaps.length >> 1].toFixed(2) + ' at the median, ' + gaps[Math.floor(gaps.length * 0.9)].toFixed(2) + ' at the 90th, ' + gaps[Math.floor(gaps.length * 0.95)].toFixed(2) + ' at the 95th' : '-'));
    fs.writeFileSync(path.join(tmp, 'jobs.json'), JSON.stringify(read.map(j => ({ crew: j.crew, place: j.place, id: j.id, skulls: j.skulls, stars: j.stars, danger: +j.danger.toFixed(3), blood: +j.blood.toFixed(3), measured: j.measured, literal: j.literal, auto: j.auto, deaths: j.deaths, wiped: j.wiped, lostMan: j.lostMan, must: j.must,
      fights: j.fights.map(f => f.what + ' ' + f.p.toFixed(2) + ' ' + f.band.join('/')) }))));
    console.log('  (every job: ' + path.join(tmp, 'jobs.json') + ')');
    if (process.env.JOB_KEEP) fs.copyFileSync(path.join(tmp, 'jobs.json'), process.env.JOB_KEEP);
  } catch (e) { ok('the gate ran [' + String(e && e.stack || e).slice(0, 300) + ']', false); }
  done();
})();
function mean(a) { return a.length ? a.reduce((t, x) => t + x, 0) / a.length : 0; }
function ranks(a) { const o = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]), r = new Array(a.length); let i = 0;
  while (i < o.length) { let j = i; while (j + 1 < o.length && o[j + 1][0] === o[i][0]) j++; for (let k = i; k <= j; k++) r[o[k][1]] = (i + j) / 2; i = j + 1; } return r; }
function spearman(a, b) { if (a.length < 3) return 0; const x = ranks(a), y = ranks(b), mx = mean(x), my = mean(y); let s = 0, sx = 0, sy = 0;
  for (let i = 0; i < x.length; i++) { s += (x[i] - mx) * (y[i] - my); sx += (x[i] - mx) ** 2; sy += (y[i] - my) ** 2; } return sx && sy ? s / Math.sqrt(sx * sy) : 0; }
