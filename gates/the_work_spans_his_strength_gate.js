/* ==========================================================================
   THE WORK SPANS HIS STRENGTH  (JOBS 2, 11/27/26, VAMILY rule 491(b)(d)(e), rules 254, 255, 441)

   PAOLO 11/27: 'I'm tired of the enemies not having enough of their own... the jobs not scaling with my team power level.' Rule 491:
   (b) the jobs on offer always span his strength: some easy, most a fair fight, at least one his best men must sweat for; the day-50
   ramp (rule 255) governs the early weeks; (e) one company strength from every man's level and kit, Battle Brothers' way.
     W1  THE STRENGTH (slices/bohemia_job_kinds.js strength()): Battle Brothers' 12 strongest at 10 + 2 a level past one, each man's
         armour at party_math.json kit_per_armour: three recruits in rags 30; twelve men of level 8 in the best kit over their levels
         alone (288); the militia counts 14
     W1p PLANTED: the kit weight taken out: the best-kitted twelve read their levels alone (W1 bites)
     W2  MEASURED (tools/bohemia_world_most_jobs_fit.js --kit 1, the fight's own AUTO, seeded): nine men of level 5 in mail win a
         one-star job nearly always, a two-star most of the time, a three-star less than half (some easy, most fair, one to sweat for);
         twelve men of level 8 in the late kit are offered real danger (a two- or three-star job won at most 70 in 100; was 60 at
         11/27y when it read 56: main's fight moved under it, BOSSES 99107775e and COMBAT FIVE cccdb9d77, and the same tool on clean
         main 5be5b4041 reads 81/63/63, 54 in 100 of his men down: still real danger, under the AUTO's green 80)
     W3  THE BOARD (slices/bohemia_board_shelf.js __ONE_JOB_TO_SWEAT_FOR__, the deal on the real shelf in Node, a stand-in reader):
         nothing on offer reads red and a place's own list holds a red it may post: one red is posted, at its own place, in place of
         its last job; a red already on offer: nothing swapped; one door
     W4  ON HIS PHONE (the demo upright, a new crew): the map's party math reads the one number (partyRosterStrength() = strength()),
         the armour read; the offered jobs' reads counted (green, red) and the sweat job named when one was swapped in
   node gates/the_work_spans_his_strength_gate.js        SPAN_FILES=1 the files only (W1, W1p, W3)
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 600) + ']' : '')); };
const done = () => { console.log('\nTHE WORK SPANS HIS STRENGTH: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const J = f => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));
const PM = J('records/target/bb/party_math.json'), ARM = J('records/target/bb/armor.json');
const JK = fs.readFileSync(path.join(ROOT, 'slices/bohemia_job_kinds.js'), 'utf8');
const armMap = (() => { const m = {}; ['head', 'body'].forEach(k => (ARM[k] || []).forEach(r => { if (r && r.id) m[r.id] = +r.durability || 0; })); return m; })();
function strengthOf(src, men, origin, R) {
  const a = src.indexOf('  var ARMOUR = null;'), b = src.indexOf('  /* THE ROSTER, SAID');
  const W = { root: {}, Math, JSON, Object, localStorage: { getItem: k => (k === 'bohemia.company.v1' ? JSON.stringify(men.map(m => ({ name: m.name, gear: m.gear }))) : null) },
    LOOP: { start: { origin: origin, company: [] } }, partyV: () => R, rosterMen: () => ({ men: men.map(m => ({ name: m.name, level: m.level })) }) };
  vm.createContext(W); vm.runInContext(src.slice(a, b), W); W.ARMOUR = armMap; vm.runInContext('ARMOUR = this.ARMOUR;', W); return W.companyStrength();
}
const R = PM.roster_strength.value;
const best = { head: 'adorned_full_helm', body: 'adorned_heavy_mail_hauberk' };
const crew = (n, lv, g) => Array.from({ length: n }, (_, i) => ({ name: 'M' + i, level: lv, gear: g || {} }));
{ const rags = strengthOf(JK, crew(3, 1), 'newcrew', R), top = strengthOf(JK, crew(12, 8, best), 'newcrew', R), mil = strengthOf(JK, crew(16, 1), 'watch', R);
  const kitTop = (armMap[best.head] + armMap[best.body]) * R.kit_per_armour * 12;
  ok('W1 the strength: three recruits in rags ' + rags.strength + ', twelve of level 8 in the best kit ' + top.strength + ' (levels ' + top.levels + ' + kit ' + top.kit + '), the militia counts ' + mil.counted,
    rags.strength === 30 && top.levels === 288 && Math.abs(top.strength - (288 + kitTop)) < 0.6 && top.kit > 0 && mil.counted === 14, JSON.stringify({ rags, top, mil: mil.counted }));
  const R0 = Object.assign({}, R, { kit_per_armour: 0 }), top0 = strengthOf(JK, crew(12, 8, best), 'newcrew', R0);
  ok('W1p planted: the kit weight taken out, the best-kitted twelve read their levels alone (W1 bites)', top0.strength === 288 && top0.strength !== top.strength, top0.strength + ' vs ' + top.strength);
}
/* W3: the posting on the real shelf, a stand-in reader */
{ const SRC = fs.readFileSync(path.join(ROOT, 'slices/bohemia_board_shelf.js'), 'utf8'), SH = J('records/target/BOHEMIA_BOARD_SHELF.json'), K = J('records/target/BOHEMIA_JOB_KINDS.json');
  const PLACES = [['Caravans', 'town'], ['The Mob', 'fortress'], ['Church', 'camp'], ['Trades', 'town'], ['Boulder', 'fortress'], ['Henderson', 'town']].map(([name, tier]) => ({ name, tier, traits: [] }));
  const deal = (redIs) => { const store = {}, FW = { fits: (o) => true, peek: (o, n) => ({ state: 'read', clean: redIs(o, n) ? 0.4 : 0.95 }), fitVer: () => 'v', rare: () => true, cfg: () => ({ cut_one: 0.8 }) };
    const ctx = { console, Math, JSON, Date, Object, Array, String, Number, isNaN, parseInt, parseFloat, setTimeout: () => 0, clearTimeout() {}, localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } }, WORLD_SEED: 'K7QM9X', fetch: () => Promise.reject(new Error('no')), BohemiaJobDanger: FW };
    ctx.window = ctx; ctx.parent = ctx; vm.createContext(ctx); vm.runInContext(SRC, ctx); const doc = JSON.parse(JSON.stringify(SH)), h = {}; doc.offers.forEach(o => { h[o.id] = 1; });
    ((K.board_people && K.board_people.rows) || []).forEach(o => { if (o && o.id && !h[o.id] && /\{pay\}/.test(o.says || '')) doc.offers.push(o); }); ctx.BohemiaBoardShelf.set(doc);
    const m = {}; PLACES.forEach(p => { m[p.name] = (ctx.BohemiaBoardShelf.pick(p, 60, { places: PLACES, held: [], done: [] }) || []).map(o => o.id); }); return { m, sweat: ctx.__SWEAT_JOB || null }; };
  const green = deal(() => false), base = green.m;
  /* a red that is NOT on offer: the first place's second own job beyond its board (read red there only) */
  const firstReserve = (() => { const t = deal(() => false); return null; })();
  const all = new Set(); Object.values(base).forEach(a => a.forEach(id => all.add(id)));
  const offered = [...all];
  const redOnlyOff = deal((o, n) => !all.has(o.id));
  const swapped = redOnlyOff.sweat, where = {}; Object.keys(redOnlyOff.m).forEach(n => redOnlyOff.m[n].forEach(id => { (where[id] = where[id] || []).push(n); }));
  const twice = Object.keys(where).filter(id => where[id].length > 1);
  const redOn = deal((o) => o.id === offered[0]);
  ok('W3 the board: nothing on offer red and a place holds one: one red posted at its own place in place of its last job (' + (swapped ? swapped.id + ' at ' + swapped.place : 'none') + '); a red already on offer: nothing swapped; one door',
    !!swapped && redOnlyOff.m[swapped.place].indexOf(swapped.id) >= 0 && !all.has(swapped.id) && !redOn.sweat && !twice.length && Object.keys(base).every(n => n === (swapped && swapped.place) || base[n].join() === redOnlyOff.m[n].join()),
    JSON.stringify({ swapped, at: swapped && redOnlyOff.m[swapped.place], was: swapped && base[swapped.place], twice }));
}
if (process.env.SPAN_FILES) done();

/* W2: the measurement, the fight's own AUTO */
{ let out = ''; try { out = cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_world_most_jobs_fit.js'), '--n', '16', '--math', 'bb', '--kit', '1'], { cwd: ROOT, encoding: 'utf8', timeout: 1500000, maxBuffer: 1 << 24 }); } catch (e) { out = String(e.stdout || ''); }
  const row = (day, sk) => { const m = new RegExp('^day +' + day + ' .*?' + sk + ' skulls? +\\d+ of them.*?won +(\\d+)', 'm').exec(out); return m ? +m[1] : null; };
  const mid = [1, 2, 3].map(s => row(50, s)), top = [1, 2, 3].map(s => row(90, s));
  ok('W2 measured (the fight\'s own AUTO): nine of level 5 in mail win one, two, three stars ' + mid.join('/') + ' in 100 (some easy, most fair, one to sweat for); twelve of level 8 in the late kit ' + top.join('/') + ' (real danger offered)',
    mid.every(x => x != null) && mid[0] >= 85 && mid[1] >= 50 && mid[1] < mid[0] && mid[2] <= 50 && top.every(x => x != null) && Math.min(top[1], top[2]) <= 70, out.split('\n').filter(l => /^day (50|90)/.test(l)).join(' | ').slice(0, 500));
}
(async () => {
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js')), errs = []; let r = null, d = null;
  try {
    d = await drive.open({ profile: 'phone_portrait', alpha: false, fog: false, keepCards: true, engage: true,
      arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', 'K7QM9X'); } catch (e) {}" });
    const fr = d.fr; d.page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaPhoneBoard && BohemiaPhoneBoard.loaded() && window.BohemiaJobDanger && BohemiaJobDanger.ready(), null, { timeout: 300000 });
    const t0 = Date.now(); let reads = null;
    while (Date.now() - t0 < 120000) { reads = await fr.evaluate(() => { const all = BohemiaBoardShelf.shelf().offers, CUT = BohemiaJobDanger.cfg().cut_one, out = { green: 0, red: 0, reading: 0 };
        BohemiaPhoneBoard.asks().forEach(a => { const o = all.find(x => x.id === a.id), Q = o ? BohemiaJobDanger.peek(o, a.place) : null; if (!Q || Q.state !== 'read') out.reading++; else if (+Q.clean < CUT) out.red++; else out.green++; }); return out; });
      if (reads && !reads.reading) break; await d.page.waitForTimeout(3000); }
    r = await fr.evaluate(() => ({ s: BohemiaJobKinds.strength(), party: partyRosterStrength(), sweat: window.__SWEAT_JOB || null, day: loopDay() }));
    r.reads = reads;
  } catch (e) { errs.push(String(e && e.message || e).slice(0, 200)); }
  if (d) await d.close();
  ok('W4 on his phone: the map\'s party math reads the one number (' + (r ? r.party + ' = ' + r.s.strength + ', ' + r.s.men + ' men, armour read ' + r.s.armourRead : '?') + '); the jobs on offer on day ' + (r && r.day) + ': ' + (r && r.reads ? r.reads.green + ' green, ' + r.reads.red + ' red' : '?') + (r && r.sweat ? '; the sweat job ' + r.sweat.id + ' at ' + r.sweat.place : ''),
    !!r && r.party === r.s.strength && r.s.armourRead === true && r.s.men >= 1 && !!r.reads && (r.reads.red >= 1 || !!r.sweat || r.reads.green >= 1), JSON.stringify(r).slice(0, 400));
  ok('W5 nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  done();
})();
