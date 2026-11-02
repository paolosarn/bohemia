#!/usr/bin/env node
/* ==========================================================================
   THE BOARDS ALWAYS HAVE WORK  (PLUMBER 3, 11/2/26, rule 335, ask line 335)

   PAOLO 11/2: 'now I have an issue where no one has any jobs anymore. I don't know why, it's annoying, so fix that and make
   sure it doesn't happen again.'

   MEASURED (records/BOHEMIA_PLUMBER_NO_TOWN_HAD_ANY_JOBS_11_2_26.md): the board's deal (slices/bohemia_board_shelf.js) asks the
   day's floor (rule 255, slices/bohemia_job_danger.js fits(): through day ten no job the crew wins under half its runs) of every
   job it would post, and nothing stood under the floor: the deal's own 'a board is never empty' pass asked the floor too. COMBAT
   49666e21 (11/3zg) and 02a94193 (11/3zm) made the same fight harder for his AUTO crew (three brigands against a new crew of
   three: 80 in 100 clean runs, then 64, then 54), so every raid job (fights of three to six men) and most fight jobs fell under
   the floor: on the save, every town raided, 13 of 14 boards stood EMPTY. NOW the floor thins a board and never empties it (a
   raided place whose raid jobs are all past the day posts its ordinary work; a place whose every job the floor kept back posts
   the least dangerous of them; a place whose every job is done posts the one finished longest ago).

   LEGS
     THE DEAL ITSELF (node, the shelf's own file, the real shelf and the job kinds' board people, fourteen places of the three tiers):
       W1 every place offers work under every case: no trait, every place RAIDED, SICK, MARKET DAY, both; days 1 to 80; no floor, a
          floor that keeps back EVERY job (read or not read yet), a floor at half
       W2 the held jobs are never on any board, in any case
       W3 every job on the shelf done: every place still offers one, and it is the one finished longest ago its tier carries
       W4 a floor that keeps back every job: the job posted is the least dangerous of the place's own
       W5 MUTATION: the last-job rule taken out of the shelf's own file, the floor that keeps back every job empties boards (the gate bites)
       W6 the floor still stands (rule 255): while a place has a job the floor lets through, nothing under the floor is posted there
     THE GAME ON HIS PHONE (the demo, upright, 390 x 844, real taps on the board):
       B1 a NEW GAME (a rolled campaign code), B2 a typed campaign code (K7QM9X): every home base through the map's own door, its
          board opened by a tap: at least one person; every person tapped says his job with Take it (or the swap); the two codes'
          valleys differ. The game drives chromium through playwright (tools/bohemia_drive_the_demo.js): a browser gate
       B4 AN OLD SAVE (a phone's storage after a game played on 11/3zd, before the campaign seed: gates/fixtures/old_save_11_3zd.json,
          a job held, a job finished): the old valley comes back, every board offers work, the held job is on top of its board, and
          neither it nor the finished one is offered
       B5 THE MEASURED CASE: the old save, every place RAIDED, after the board's own danger reads for its crew of three are in:
          every board offers work (13 of 14 were empty)
       B6 the phone's list has jobs; nothing threw on any page
   node gates/the_boards_always_have_work_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const T0 = Date.now();
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + String(x).slice(0, 300) + ']' : '') + '  (' + Math.round((Date.now() - T0) / 1000) + ' s)'); };
const done = () => { console.log('\nTHE BOARDS ALWAYS HAVE WORK: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* ---------------- THE DEAL ITSELF ---------------- */
const SRC = fs.readFileSync(path.join(ROOT, 'slices/bohemia_board_shelf.js'), 'utf8');
const SHELF = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_BOARD_SHELF.json'), 'utf8'));
const KINDS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_JOB_KINDS.json'), 'utf8'));
function shelfDoc() {   /* what the shelf's own withMore makes of the two files */
  const doc = JSON.parse(JSON.stringify(SHELF)), have = {};
  doc.offers.forEach(o => { have[o.id] = 1; });
  ((KINDS.board_people && KINDS.board_people.rows) || []).forEach(o => { if (o && o.id && !have[o.id] && /\{pay\}/.test(o.says || '')) doc.offers.push(o); });
  return doc;
}
function loadShelf(src, danger) {
  const ctx = { console, Math, JSON, String, Array, Object };
  ctx.window = ctx; ctx.parent = ctx; if (danger) ctx.BohemiaJobDanger = danger;
  vm.createContext(ctx); vm.runInContext(src, ctx);
  ctx.BohemiaBoardShelf.set(shelfDoc());
  return ctx.BohemiaBoardShelf;
}
function seedOf(s) { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
const cleanOf = (id, place) => (seedOf(id + '@' + place) % 1000) / 1000;
/* the floors: none, every job kept back (read, each its own number), every job kept back (none read yet), half */
const FLOORS = {
  none: null,
  every_job_kept_back: { fits: () => false, fitVer: () => 'all', peek: (o, p) => ({ state: 'read', clean: cleanOf(o.id, p) }) },
  every_job_kept_back_unread: { fits: () => false, fitVer: () => 'unread', peek: () => null },
  half: { fits: (o, p) => cleanOf(o.id, p) >= 0.5, fitVer: () => 'half', peek: (o, p) => ({ state: 'read', clean: cleanOf(o.id, p) }) }
};
const PLACES = [['Anarchists', 'town'], ['Blues', 'town'], ['Caravans', 'fortress'], ['Cartel', 'fortress'], ['Church', 'town'], ['Colorful', 'camp'],
  ['Custom', 'camp'], ['Homeless', 'camp'], ['Mob', 'fortress'], ['Network', 'fortress'], ['Reds', 'town'], ['Remnants', 'fortress'], ['Trades', 'camp'], ['Volunteers', 'camp']];
const TRAITS = { none: () => [], raided: () => ['raided'], sickness: () => ['sickness'], market_day: () => ['market_day'], both: () => ['sickness', 'market_day'],
  mixed: (i) => [[], ['raided'], ['sickness'], ['market_day'], ['sickness', 'market_day']][i % 5] };
function deal(SH, day, traitsOf, held, doneIds) {
  const places = PLACES.map(([name, tier], i) => ({ name, tier, traits: traitsOf(i) }));
  const out = {};
  places.forEach(p => { out[p.name] = SH.pick({ name: p.name, tier: p.tier }, day, { traits: p.traits, held: held || [], done: doneIds || [], places }) || []; });
  return out;
}
{
  const empties = [], heldShown = [];
  let cases = 0;
  const HELD = ['qd-s01', 'jk-scout-wells'];
  for (const fk in FLOORS) {
    const SH = loadShelf(SRC, FLOORS[fk]);
    for (const tk in TRAITS) for (const day of [1, 5, 10, 20, 30, 50, 80]) {
      const b = deal(SH, day, TRAITS[tk], HELD, []); cases++;
      for (const n in b) { if (!b[n].length) empties.push(fk + '/' + tk + '/day ' + day + ': ' + n); if (b[n].some(o => HELD.indexOf(o.id) >= 0)) heldShown.push(fk + '/' + tk + '/day ' + day + ': ' + n); }
    }
  }
  ok('W1 every place offers work: ' + cases + ' valleys of 14 places (no trait, raided, sick, market day, both, mixed; days 1 to 80; no floor, every job kept back read and unread, half)', empties.length === 0, empties.slice(0, 4).join(' | '));
  ok('W2 a held job is never on any board', heldShown.length === 0, heldShown.slice(0, 4).join(' | '));
}
{
  const SH = loadShelf(SRC, null), all = shelfDoc().offers.map(o => o.id);
  const doneIds = all.slice().sort((a, b) => seedOf(a) - seedOf(b));   /* every job done, in an order (oldest first) */
  const b = deal(SH, 7, TRAITS.mixed, [], doneIds), bad = [];
  PLACES.forEach(([n, tier], i) => {
    const got = b[n] || [], tr = TRAITS.mixed(i), raided = tr.indexOf('raided') >= 0;
    if (!got.length) return bad.push(n + ' empty');
    /* the one finished longest ago its pool carries (the raid jobs and the ordinary ones for a raided place) */
    const pool = shelfDoc().offers.filter(o => raided ? (o.when === 'raided' || (!o.when && (o.tiers || []).indexOf(tier) >= 0)) : (!o.when && (o.tiers || []).indexOf(tier) >= 0)).map(o => o.id);
    if (pool.indexOf(got[0].id) < 0) bad.push(n + ' posted ' + got[0].id + ', not its own kind of work');
    /* a place on its own (the deal hands each job to one place, so only the first in the deal's order gets the oldest) */
    const own = SH.pick({ name: n, tier }, 7, { traits: tr, done: doneIds }) || [], first = doneIds.filter(id => pool.indexOf(id) >= 0)[0];
    if (own.length !== 1 || own[0].id !== first) bad.push(n + ' alone posted ' + (own[0] && own[0].id) + ', the oldest done is ' + first);
  });
  ok('W3 every job on the shelf done (' + doneIds.length + '): every place still offers one of its own kind, and a place on its own the one finished longest ago', bad.length === 0, bad.slice(0, 4).join(' | '));
}
{
  const SH = loadShelf(SRC, FLOORS.every_job_kept_back), bad = [];
  PLACES.forEach(([n, tier]) => {
    const got = SH.pick({ name: n, tier }, 3, { traits: [] }) || [];
    const pool = shelfDoc().offers.filter(o => !o.when && (o.tiers || []).indexOf(tier) >= 0);
    const best = Math.max.apply(null, pool.map(o => cleanOf(o.id, n)));
    if (got.length !== 1 || cleanOf(got[0].id, n) !== best) bad.push(n + ': ' + (got[0] ? got[0].id + ' ' + cleanOf(got[0].id, n) : 'none') + ' vs best ' + best);
  });
  ok('W4 the floor keeps back every job: each place posts ONE, the least dangerous of its own', bad.length === 0, bad.slice(0, 3).join(' | '));
}
{
  /* the other side (rule 255 stands): while a place has any job the floor lets through, nothing under the floor is posted there */
  const SH = loadShelf(SRC, FLOORS.half), bad = [];
  for (const tk in TRAITS) for (const day of [1, 10, 30]) {
    const b = deal(SH, day, TRAITS[tk], [], []);
    PLACES.forEach(([n, tier], i) => { const tr = TRAITS[tk](i), raided = tr.indexOf('raided') >= 0;
      const pool = shelfDoc().offers.filter(o => (raided && o.when === 'raided') || (!o.when && (o.tiers || []).indexOf(tier) >= 0) || (o.when && tr.indexOf(o.when) >= 0));
      if (pool.some(o => cleanOf(o.id, n) >= 0.5) && (b[n] || []).some(o => cleanOf(o.id, n) < 0.5)) bad.push(tk + '/day ' + day + ': ' + n + ' posted ' + b[n].filter(o => cleanOf(o.id, n) < 0.5).map(o => o.id).join(',')); });
  }
  ok('W6 the floor still stands: while a place has a job the floor lets through, nothing under the floor is posted there', bad.length === 0, bad.slice(0, 3).join(' | '));
}
{
  const cut = SRC.replace(/return never\(out, kept, raid\.concat\(ordinary\)\);/, 'return out;').replace(/return never\(out, kept, ordinary\);/, 'return out;');
  let empt = 0;
  if (cut !== SRC) { const SH = loadShelf(cut, FLOORS.every_job_kept_back); const b = deal(SH, 5, TRAITS.raided, [], []); for (const n in b) if (!b[n].length) empt++; }
  ok('W5 MUTATION: the last-job rule taken out, the floor that keeps back every job empties boards (' + empt + ' of 14), so this gate bites', cut !== SRC && empt > 0);
}

/* ---------------- THE GAME ON HIS PHONE ---------------- */
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const errsOf = (d) => (d.errs || []).filter(e => !/favicon|net::ERR|404/.test(String(e)));

async function settleFrame(P, name) {
  for (let k = 0; k < 80; k++) {
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) {
      if (await x.evaluate((n) => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === n && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }, name).catch(() => false)) return x;
    }
    await P.waitForTimeout(250);
  }
  return null;
}
/* every home base through the map's own door; its board opened by a tap; every person tapped */
async function everyBoard(d, label) {
  const P = d.page, fr = d.fr, rows = [];
  const names = await fr.evaluate(() => Object.keys(ctBases() || {}));
  for (const name of names) {
    await fr.evaluate((n) => { try { loopClose(); } catch (e) {} const b = ctBases()[n]; const t = { name: n, x: b.x | 0, y: b.y | 0, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }, name);
    const sf = await settleFrame(P, name);
    if (!sf) { rows.push({ name, err: 'no town screen' }); continue; }
    await sf.waitForFunction(() => window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 20000 }).catch(() => {});
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {});
    const box = await (await sf.frameElement()).boundingBox();
    const openBoard = async () => {
      for (let i = 0; i < 6; i++) {
        if (await sf.evaluate(() => BohemiaSettlement.state.open === 'board' && !!document.querySelector('#sbody .acts'))) return true;
        const w = await sf.evaluate(() => BohemiaSettlement.where && BohemiaSettlement.where('board'));
        if (!w) return false;
        await P.touchscreen.tap(box.x + w.x, box.y + w.y); await P.waitForTimeout(700);
      }
      return false;
    };
    const opened = await openBoard();
    const people = await sf.evaluate(() => [...document.querySelectorAll('#sbody .act.client')].map(b => b.textContent.replace(/\s+/g, ' ').trim().slice(0, 60)));
    const held = await sf.evaluate(() => ({ rows: [...document.querySelectorAll('#sbody .act.held')].map(b => b.dataset.held), ids: BohemiaSettlement.state.held.slice() }));
    const spoke = [];
    for (let i = 0; i < people.length; i++) {   /* by his title: a board re-dealt as the danger reads come in may have let him go (skipped, never a fail) */
      const r = await sf.evaluate((t) => { const b = [...document.querySelectorAll('#sbody .act.client')].filter(x => x.textContent.replace(/\s+/g, ' ').trim().slice(0, 60) === t)[0]; if (!b) return { gone: true }; b.click();
        const say = document.querySelector('#sbody .say'), acts = [...document.querySelectorAll('#sbody .acts .act')].map(a => a.textContent.replace(/\s+/g, ' ').trim());
        return { says: !!say && /\S/.test(say.textContent), yes: acts.some(t => /^Take it/.test(t)) || !!document.querySelector('#sbody [data-swap]'), acts: acts.slice(0, 3) }; }, people[i]);
      if (r && r.gone) { await openBoard(); continue; }
      spoke.push(r);
      await sf.evaluate(() => { const n = [...document.querySelectorAll('#sbody .acts .act')].filter(a => /^Not now/.test(a.textContent.trim()))[0]; if (n) n.click(); });
      await P.waitForTimeout(200);
      if (!(await sf.evaluate(() => BohemiaSettlement.state.open === 'board' && !!document.querySelector('#sbody .act.client')))) await openBoard();
    }
    rows.push({ name, opened, people, spoke, held });
  }
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} });
  const empty = rows.filter(r => r.err || !r.opened || !r.people.length).map(r => r.name + (r.err ? ' (' + r.err + ')' : ''));
  const mute = rows.filter(r => !(r.spoke || []).length || (r.spoke || []).some(s => !s || !s.says || !s.yes)).map(r => r.name + ': ' + JSON.stringify((r.spoke || []).filter(s => !s || !s.says || !s.yes)[0] || 'nobody spoke'));
  const total = rows.reduce((a, r) => a + (r.people ? r.people.length : 0), 0);
  ok(label + ': every one of the ' + rows.length + ' home bases, its board opened by a tap through the map\'s door, offers work (' + total + ' people: ' + rows.map(r => r.name + ' ' + (r.people ? r.people.length : 0)).join(', ') + ')',
    rows.length >= 14 && empty.length === 0, empty.join(', '));
  ok(label + ': every person tapped says his job, with Take it or the swap', mute.length === 0 && total > 0, mute.slice(0, 2).join(' | '));
  return rows;
}
async function phoneHasJobs(d, label) {
  const r = await d.fr.evaluate(async () => { for (let i = 0; i < 40; i++) { try { if (BohemiaPhoneBoard.loaded()) return BohemiaPhoneBoard.asks().length; } catch (e) {} await new Promise(f => setTimeout(f, 250)); } return -1; });
  ok(label + ': the phone\'s list has jobs (' + r + ')', r > 0);
}
const seedNow = (d) => d.fr.evaluate(() => ({ code: WORLD_SEED, from: WORLD_SEED_FROM, bases: JSON.stringify(ctBases()) }));
const ready = (fr) => fr.waitForFunction(() => typeof ctBases === 'function' && typeof loopOpenTown === 'function' && window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && window.BohemiaPhoneBoard, null, { timeout: 120000 });

async function seeded(code) {
  const d = await drive.open({ profile: 'phone_portrait', fog: true, arm: "try { localStorage.setItem('bohemia.world.next.v1', '" + code + "'); } catch (e) {}" });
  try {
    await ready(d.fr);
    const s = await seedNow(d);
    ok('B ' + code + ': the game is that campaign code\'s (' + s.code + ', ' + s.from + ')', s.code === code && s.from === 'typed');
    await everyBoard(d, 'B ' + code);
    await phoneHasJobs(d, 'B ' + code);
    ok('B ' + code + ': nothing threw', errsOf(d).length === 0, errsOf(d).slice(0, 2).join(' | '));
    return s.bases;
  } catch (e) { ok('B ' + code + ' measured', false, e && e.message); return null; }
  finally { await d.close().catch(() => {}); }
}

async function fresh() {
  const d = await drive.open({ profile: 'phone_portrait', fog: true });
  let first = null;
  try {
    await ready(d.fr);
    const s = await seedNow(d); first = s;
    ok('B1 a NEW GAME: a rolled campaign code (' + s.code + ', ' + s.from + ')', !!s.code && s.from === 'rolled');
    await everyBoard(d, 'B1 a NEW GAME');
    await phoneHasJobs(d, 'B1 a NEW GAME');
    ok('B1 a NEW GAME: nothing threw', errsOf(d).length === 0, errsOf(d).slice(0, 2).join(' | '));
  } catch (e) { ok('B1 measured', false, e && e.message); }
  finally { await d.close().catch(() => {}); }
  return first;
}

/* AN OLD SAVE: a phone's whole storage after a game played on BUILD 11/3zd, before the campaign seed (gates/fixtures/old_save_11_3zd.json:
   a new crew of three, day 5, one job held, one finished), put on a fresh phone once; the game CONTINUEs it */
async function oldSave() {
  const F = JSON.parse(fs.readFileSync(path.join(ROOT, 'gates/fixtures/old_save_11_3zd.json'), 'utf8')).storage;
  const held0 = 'qd-ar06', done0 = 'qd-s01';
  const arm = 'try { if (!sessionStorage.getItem("__old")) { sessionStorage.setItem("__old", "1"); var L = ' + JSON.stringify(F) + '; for (var k in L) localStorage.setItem(k, L[k]); } } catch (e) {}';
  const d = await drive.open({ profile: 'phone_portrait', fog: true, arm });
  try {
    await ready(d.fr);
    const o = await d.fr.evaluate(() => ({ from: WORLD_SEED_FROM, code: WORLD_SEED, classic: typeof CT_BASES_BAKED !== 'undefined' && JSON.stringify(ctBases()) === JSON.stringify(CT_BASES_BAKED), day: loopDay(), held: LOOP.held.map(h => h.id + '@' + h.from), done: (LOOP.doneIds || []).slice() }));
    ok('B4 AN OLD SAVE (made on 11/3zd) opens on the old valley, day ' + o.day + ', with its job and its finished job (' + o.from + ', ' + o.held.join(',') + ')',
      o.from === 'old_save' && !o.code && o.classic && o.held.some(h => h.indexOf(held0 + '@') === 0) && o.done.indexOf(done0) >= 0);
    const rows = await everyBoard(d, 'B4 AN OLD SAVE');
    const heldTop = rows.filter(r => r.held && r.held.rows.indexOf(held0) >= 0).length;
    const offered = await d.fr.evaluate((ids) => { const SH = BohemiaBoardShelf, day = loopDay() || 1, places = SH.mapPlaces(day); return places.filter(p => (SH.pick({ name: p.name, tier: p.tier }, day, { traits: p.traits, held: LOOP.held.map(h => h.id), done: LOOP.doneIds || [], places }) || []).some(x => ids.indexOf(x.id) >= 0)).map(p => p.name); }, [held0, done0]);
    ok('B4 AN OLD SAVE: the held job is on top of the boards as ON THE JOB (' + heldTop + ' boards); neither it nor the finished one is offered (' + offered.join(',') + ')', heldTop > 0 && offered.length === 0);
    await phoneHasJobs(d, 'B4 AN OLD SAVE');
    /* B5 THE MEASURED CASE: every place raided, after the board's own danger reads for this crew are in */
    await d.fr.evaluate(() => { const D = BohemiaJobDanger, SH = BohemiaBoardShelf, day = loopDay() || 1; D.engine(); SH.shelf().offers.filter(o => o.when === 'raided').forEach(o => Object.keys(ctBases()).forEach(n => { try { D.fits(o, n, day, [], 1); } catch (e) {} })); });
    let reads = null;
    for (let i = 0; i < 480; i++) { reads = await d.fr.evaluate(() => { const s = BohemiaJobDanger.state(); return { engine: s.engine, q: s.queue, busy: s.busy }; }); if (i > 4 && reads.engine && !reads.q && !reads.busy) break; await d.page.waitForTimeout(500); }
    const r5 = await d.fr.evaluate(() => { const SH = BohemiaBoardShelf, D = BohemiaJobDanger, day = loopDay() || 1; const places = SH.mapPlaces(day).map(p => Object.assign({}, p, { traits: ['raided'] }));
      const kept = []; SH.shelf().offers.filter(o => o.when === 'raided').forEach(o => places.forEach(p => { if (D.fits(o, p.name, day, [], 1) === false) kept.push(o.id + '@' + p.name); }));
      return { floor: D.rampFloor(day), kept: kept.length, of: 4 * places.length, boards: places.map(p => [p.name, (SH.pick({ name: p.name, tier: p.tier }, day, { traits: ['raided'], held: LOOP.held.map(h => h.id), done: LOOP.doneIds || [], places }) || []).length]) }; });
    ok('B5 THE MEASURED CASE: every place raided, the danger reads in (' + r5.kept + ' of ' + r5.of + ' raid jobs kept back by the floor ' + r5.floor + '): every board offers work (' + r5.boards.map(b => b[0] + ' ' + b[1]).join(', ') + ')',
      reads && reads.engine && r5.boards.length >= 14 && r5.boards.every(b => b[1] >= 1));
    ok('B4 AN OLD SAVE: nothing threw', errsOf(d).length === 0, errsOf(d).slice(0, 2).join(' | '));
  } catch (e) { ok('B4/B5 measured', false, e && e.message); }
  finally { await d.close().catch(() => {}); }
}

(async () => {
  /* three phones side by side (the suite's clock): a new game (a rolled code), a typed code, an old save */
  const [rolled, typed] = await Promise.all([fresh(), seeded('K7QM9X'), oldSave()]);
  ok('B1/B2 two different campaign codes (' + (rolled && rolled.code) + ', K7QM9X) deal two different valleys', !!rolled && !!typed && rolled.code !== 'K7QM9X' && rolled.bases !== typed);
  done();
})().catch(e => { console.error(e); process.exit(1); });
