/* ==========================================================================
   THE KINDS HE MEETS  (JOBS 2, 11/27/26, VAMILY rule 494(a)(b); rules 425, 453, 255, 335)

   PAOLO 11/27: 'in Battle Brothers there's so many different quest types... I haven't seen one caravan quest... go from one city
   to another.' Measured first (tools/bohemia_jobs_the_kinds_he_meets.js: a run like his on the real board code, the real shelf, the
   valley K7QM9X's places and news day by day, the real floor and rare roll, his name growing as BohemiaRenown counts it): CLEAR A CAMP
   and PATROL first offered on day 18, a camp's board one job (no choice), a fortress's board two caravans and nothing else, and not
   one of the thirteen escorts going from one of the valley's towns to another.
     K1  EVERY KIND, EARLY: every one of the nine kinds the map plays is posted on a board by day 6 (his first two board windows), the
         caravan on day 1, and a caravan that goes TOWN TO TOWN by day 3
     K1p PLANTED: the deal before this build (main's board code at 5be5b4041 without the kinds reader, QUESTS QR-O's camp 1, town 2,
         fortress 3): a kind is first offered past day 6 (K1 bites)
     K2  A BOARD MIXES KINDS: of the board-days with two or more jobs, at most 1 in 100 are all one kind
     K3  THE CHOICE IS REAL: the shelf's counts camp 2, town 3, fortress 4 (never over 4: it fits the phone, row 737); on day 1
         every camp and town board holds at least two jobs, and the valley at least 26
     K4  THE CARAVAN GOES TOWN TO TOWN (slices/bohemia_job_kinds.js __THE_CARAVAN_GOES_TOWN_TO_TOWN__, on the demo upright): every
         town-to-town caravan row, planned at its own town, goes to the town its words name, to that town's door
     K6  ON THE DEMO, THE BOARDS AS THE PAGE DEALS THEM (EYES 2's sweep, ask row 784: no name, every window, his crew's reads as they
         come): every one of the nine by day 10, at least seven on day 1, the caravan on day 1. What comes later is what the day's floor
         keeps back from a new crew of three until a read says it fits (rule 255, Paolo 10/26: 'I don't even want you to have jobs
         available like six wolves'): every hunt on the shelf, and a patrol when its read is in
     K5  nothing threw
   node gates/the_kinds_he_meets_gate.js        KINDS_FILES=1 the files only (K1 to K3)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 600) + ']' : '')); };
const done = () => { console.log('\nTHE KINDS HE MEETS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'kinds-'));
const TOOL = path.join(ROOT, 'tools/bohemia_jobs_the_kinds_he_meets.js');
const run = (extra, env) => { const out = path.join(TMP, 'k' + Math.random().toString(36).slice(2) + '.json');
  cp.execFileSync('node', [TOOL, '--quiet', '--json', out].concat(extra || []), { cwd: ROOT, encoding: 'utf8', timeout: 300000, env: Object.assign({}, process.env, env || {}) });
  return JSON.parse(fs.readFileSync(out, 'utf8')); };
const K = J('records/target/BOHEMIA_JOB_KINDS.json'), SH = J('records/target/BOHEMIA_BOARD_SHELF.json');
const townRows = Object.keys(K.offers || {}).filter(id => K.offers[id] && K.offers[id].kind === 'haul-caravan' && K.offers[id].place && K.offers[id].place.town);
const late = r => r.built9.filter(b => b.first == null || b.first > 6);
let now = null;
try { now = run(); } catch (e) { ok('K1 the measure ran', false, String(e).slice(0, 300)); done(); }
{ const ttFirst = (() => { try { return firstTownCaravan(now); } catch (e) { return null; } })();
  ok('K1 every kind early: ' + now.built9.map(b => b.say + ' day ' + b.first).join(', ') + '; a caravan town to town on day ' + ttFirst,
    !late(now).length && now.firstDay['haul-caravan'] === 1 && ttFirst != null && ttFirst <= 3, JSON.stringify(late(now)));
}
function firstTownCaravan(r) { let d = null; (r.per_day_ids || []).forEach(x => { if (d == null && x.ids.some(id => townRows.indexOf(id) >= 0)) d = x.day; }); return d; }
{ let was = null; const src = path.join(TMP, 'shelf_before.js');
  try { fs.writeFileSync(src, cp.execFileSync('git', ['show', '5be5b4041:slices/bohemia_board_shelf.js'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 24 }));
    was = run(['--no-kinds', '--counts', 'camp:1,town:2,fortress:3'], { SHELF_SRC: src }); } catch (e) { was = null; }
  ok('K1p planted: the deal before this build: ' + (was ? late(was).map(b => b.say + ' day ' + b.first).join(', ') || 'nothing late' : '?') + ' (K1 bites)', !!was && late(was).length > 0);
}
{ const share = now.boards_one_kind / Math.max(1, now.boards_two_plus);
  ok('K2 a board mixes kinds: ' + now.boards_one_kind + ' of ' + now.boards_two_plus + ' board-days of two or more jobs are all one kind' + (now.one_kind_examples.length ? ' (' + now.one_kind_examples.slice(0, 2).join('; ') + ')' : ''), share <= 0.01);
}
{ const C = SH.counts || {}, d1 = (now.per_day_mix || []).find(x => x.day === 1) || { mix: [] };
  const thin = !d1.mix.length ? [{ no: 'day 1 not measured' }] : d1.mix.filter(m => (m.tier === 'camp' || m.tier === 'town') && m.n < 2), total = (now.per_town[0] || {}).total;
  ok('K3 the choice is real: counts camp ' + C.camp + ', town ' + C.town + ', fortress ' + C.fortress + ', at most ' + C.max + '; day 1: ' + total + ' jobs in the valley, ' + thin.length + ' camp or town boards under two',
    C.camp === 2 && C.town === 3 && C.fortress === 4 && C.max === 4 && total >= 26 && !thin.length, JSON.stringify(thin));
}
if (process.env.KINDS_FILES) done();
(async () => {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js')), errs = []; let d = null, r = null;
  try {
    d = await drive.open({ profile: 'phone_portrait', alpha: false, fog: false, keepCards: true, engage: true,
      arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
    const fr = d.fr; d.page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && BohemiaBoardShelf.mapPlaces(1), null, { timeout: 300000 });
    await d.page.waitForTimeout(3000);
    r = await fr.evaluate((ids) => { const all = BohemiaBoardShelf.shelf().offers, bs = ctBases(), D = BohemiaJobKinds.data(), out = [];
      ids.forEach(id => { const o = all.find(x => x.id === id), row = D.offers[id]; if (!o) { out.push({ id, missing: true }); return; }
        const from = o.towns && o.towns[0], b = bs[from]; if (!b) { out.push({ id, from, noTown: true }); return; }
        const j = BohemiaJobKinds.plan(o, { name: from, x: b.x, y: b.y }), want = row.place.town, wb = bs[want], door = wb && typeof townDoor === 'function' ? townDoor(wb.x, wb.y) : null;
        out.push({ id, from, want, to: j && j.dest ? j.dest.name : null, town: !!(j && j.dest && j.dest.town), plays: j && j.plays, atDoor: !!(door && j && j.target && j.target.x === door[0] && j.target.y === door[1]), say: j && j.sayTake ? String(j.sayTake).slice(0, 140) : null }); });
      return out; }, townRows);
    var sweep = await fr.evaluate(() => { const first = {}, nine = ['haul-caravan', 'find-place', 'find-person', 'hunt-kind', 'clear-camp', 'carry', 'hold-defend', 'recover-return', 'patrol'];
      for (let D = 1; D <= 13; D += 3) { const places = BohemiaBoardShelf.mapPlaces(D) || [];
        places.forEach(p => (BohemiaBoardShelf.pick(p, D, { places, traits: p.traits, held: [], done: [] }) || []).forEach(o => { const k = BohemiaJobKinds.kindOf(o); if (first[k] == null) first[k] = D; })); }
      return nine.map(k => [k, first[k] == null ? null : first[k]]); });
    global.__SWEEP = sweep;
  } catch (e) { errs.push('drive: ' + String(e).slice(0, 200)); }
  finally { try { await d.close(); } catch (e) {} }
  { const sw = global.__SWEEP || [], at = k => (sw.find(x => x[0] === k) || [])[1];
    ok('K6 on the demo, the boards as the page deals them: ' + sw.map(x => x[0] + ' day ' + x[1]).join(', '),
      sw.length === 9 && sw.every(x => x[1] != null && x[1] <= 10) && sw.filter(x => x[1] === 1).length >= 7 && at('haul-caravan') === 1, JSON.stringify(sw)); }
  const good = (r || []).filter(x => x.to && x.want && String(x.to).toUpperCase() === String(x.want).toUpperCase() && x.town && x.plays === 'haul-caravan' && x.atDoor);
  ok('K4 the caravan goes town to town: ' + good.length + ' of ' + townRows.length + ' planned at their own town go to the town their words name, to its door' + (good[0] ? ' (' + good[0].from + ' to ' + good[0].to + ': ' + good[0].say + ')' : ''),
    !!r && townRows.length >= 6 && good.length === townRows.length, JSON.stringify((r || []).filter(x => good.indexOf(x) < 0)));
  ok('K5 nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  done();
})();
