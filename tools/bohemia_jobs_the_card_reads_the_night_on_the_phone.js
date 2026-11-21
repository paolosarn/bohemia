#!/usr/bin/env node
// JOBS [the card reads the night] 11/20 -- ON HIS PHONE (VAMILY rules 461, 441). The game on a phone (upright and sideways), the demo or
// the alpha (--alpha), A NEW CREW, the valley K7QM9X, a company that has met --met fights (3: past the first, so the road's factions
// walk; the one shortcut, said: the game's own count, bohemia.fight.met.v1).
//   Every job whose card has a fight in the dark (a night watch, a bounty after dark), at its town: the card read at noon on the map's
//   clock (BohemiaJobKinds.asks, the danger reader's fightsFor); then the job taken by the map's own door and walked by the map's own
//   steps and clock (the leg waits for dark itself); the moment each fight is handed over, the band the game rolls for it is read off the
//   hand-over (cityHandOver wrapped: the danger reader's own rollInto runs, the message is kept, and the fight is not started, so the
//   walk goes on to the next fight the same way). The card's crowd against the fight's, fight by fight.
// Writes <out>/card_night_<tag>.json.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const ALPHA = process.argv.indexOf('--alpha') > 0, CODE = arg('--code', 'K7QM9X'), MET = +arg('--met', 3);
/* --hour M (JOBS 11/21, the card reads the hour): every job with a sure fight, the card read standing in its town at minute M of the day, and
   each fight met after the trip's own minutes to it (the card's 'comes'), the clock moved on by them; --jobs N the first N such jobs */
const HOUR = process.argv.indexOf('--hour') > 0 ? +arg('--hour', 990) : null, NJOBS = +arg('--jobs', 40);
const SHAPES = arg('--shapes', 'phone_portrait,phone_landscape').split(','), OUTD = path.resolve(ROOT, arg('--out', 'records/target/jobs_11_20')), TAG = arg('--tag', ALPHA ? 'alpha' : 'demo');
fs.mkdirSync(OUTD, { recursive: true });

async function walk(shape) {
  const d = await drive.open({ profile: shape, alpha: ALPHA, fog: false, keepCards: true, engage: true,
    arm: "try { var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'newcrew'; localStorage.setItem('bohemia.start', JSON.stringify(s)); localStorage.setItem('bohemia.world.next.v1', '" + CODE + "'); } catch (e) {}" });
  const fr = d.fr, page = d.page, errs = [], row = { shape, alpha: ALPHA, jobs: [] };
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  try {
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && window.BohemiaJobDanger && BohemiaJobDanger.ready() && window.LOOP && LOOP.start && typeof advance === 'function', null, { timeout: 180000 });
    await page.waitForTimeout(4000);
    row.jobs = await fr.evaluate(([MET, HOUR, NJOBS]) => {
      localStorage.setItem('bohemia.fight.met.v1', String(MET));
      const noon = () => { let g = 0; while ((T.min < 11 * 60 || T.min > 13 * 60) && g++ < 48) advance(30); };
      const bs = ctBases(), out = [], seen = {}, real = cityHandOver;
      BohemiaBoardShelf.shelf().offers.forEach(o => { if (seen[o.id]) return; Object.keys(bs).forEach(n => { if (seen[o.id]) return;
        if (HOUR != null && out.length >= NJOBS) return;
        if (HOUR != null) { travelStop(); city.x = bs[n].x; city.y = bs[n].y; let g = 0; while (Math.abs(T.min - HOUR) > 20 && g++ < 200) advance(15); } else noon();
        let A = null; try { A = BohemiaJobKinds.asks(o, n); } catch (e) {} if (!A || (HOUR != null ? !(A.sure >= 1) || A.maybe || A.choose || /hunt/.test(A.plays || '') : !/in the dark/.test(A.words))) return;
        const start = T.min, startDay = loopDay();
        seen[o.id] = 1; const J = { id: o.id, town: n, day: loopDay(), hour: Math.floor(T.min / 60), words: A.words, card: [], met: [], elapsed: 0, start: T.min };
        try { J.card = (BohemiaJobDanger.fightsFor(o, n) || []).filter(f => !f.road).map(f => ({ what: f.what, band: f.band, dark: !!f.dark, p: f.p, comes: f.comes, at: f.at })); } catch (e) { J.cardErr = String(e.message); }
        /* the trip's own minutes to each fight (the test's clock, not the card's: the road to the town is none, he stands in it; then the
           walk's legs to the stop nearest the fight) */
        if (HOUR != null) { let TR = null; try { TR = BohemiaJobKinds.trip(o, n); } catch (e) {} J.card.forEach(c => { c.walk = null; if (!TR || !TR.job || !c.at) return; const L = TR.job.legs || [], E = TR.job.ends || []; let k = -1, sum = 0;
          for (let i = 0; i < E.length; i++) { const e = E[i]; if (!e) continue; const ex = e.x != null ? e.x : e[0], ey = e.y != null ? e.y : e[1]; if (Math.abs(ex - c.at[0]) + Math.abs(ey - c.at[1]) <= 4) { k = i; break; } }
          if (k < 0) k = 0; for (let j = 0; j <= k && j < L.length; j++) sum += +L[j].mins || 0; c.walk = Math.round(sum); }); }

        try { loopClose(); } catch (e) {} LOOP.held = []; LOOP.fighting = null; travelStop(); city.x = bs[n].x; city.y = bs[n].y;
        const c = Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) }); loopTakeContract(c);
        /* the card after the yes (the phone's card of the job he holds), read at the same minute: the hour's own test; the board's card and
           the held job's plan can differ (measured on the alpha: a spot two blocks apart, a camp off the map), JOBS' next job */
        try { const hj = LOOP.held.filter(h => h.id === o.id)[0]; J.held = hj ? (BohemiaJobDanger.fightsFor(hj, hj.from) || []).filter(f => !f.road).map(f => ({ what: f.what, band: f.band, comes: f.comes, waits: f.waits, at: f.at })) : []; } catch (e) { J.held = []; J.heldErr = String(e.message); }
        /* the hand-over, read: the game's own roll, kept; no fight started (the job walks on as if it was won) */
        window.cityHandOver = function (msg) { try { BohemiaJobDanger.rollInto(msg); } catch (e) {}
          let now = null; try { const hj = LOOP.held.filter(h => h.id === o.id)[0]; const F = hj ? (BohemiaJobDanger.fightsFor(hj, hj.from) || []).filter(f => !f.road) : []; now = F.length ? { band: F[0].band, comes: F[0].comes } : null; } catch (e) {}
          if (msg && msg.type === 'BOHEMIA_CITY_ENCOUNTER') J.met.push({ now: now, party: msg.party ? { count: msg.party.count, faction: msg.party.faction, days: msg.party.days, difficulty: msg.party.difficulty } : null, rollDistrict: msg.rollDistrict || null, district: msg.district || null, why: msg.why, band: msg.party && msg.party.band ? msg.party.band.slice() : null, night: isNight(), hour: Math.floor(T.min / 60), min: T.min, elapsed: J.elapsed, day: loopDay(), met: Number(localStorage.getItem('bohemia.fight.met.v1')) || 0 });
          return true; };   /* the fight is 'on' (LOOP.fighting), and ended below the way the map ends one it won */
        try { for (let s = 0; s < 30; s++) { const j = LOOP.held.filter(h => h.id === o.id)[0]; if (!j) break;
            const waitBand = !j.band && !!j.bandDue, p = waitBand ? null : (j.band ? j.band : (j.stage === 'look' && j.spot ? j.spot : (j.target || j.spot))); travelStop(); if (p) { city.x = p.x; city.y = p.y; }   /* 11/21: a patrol's band on the road is walked to; while one is due he stays on the post's road (a post at a town is quiet, no band comes there) */
            if (HOUR != null) { const nx = J.card[J.met.length]; const hx = (J.held || [])[J.met.length], go = hx && hx.comes != null ? hx.comes - (hx.waits || 0) : (nx ? nx.walk : null);   /* the walk; the job makes its own waits */ if (nx && go != null && !nx.dark) { while (J.elapsed < go) { const st = Math.min(15, go - J.elapsed); advance(st); J.elapsed += st; } } }   /* the clock moved by the walk's own minutes, exactly */   /* the walk's own minutes to this fight */
            const before = J.met.length; if (waitBand) BohemiaJobKinds.step(); else if (!BohemiaJobKinds.owns(j)) loopArrived(); else (p && BohemiaJobKinds.arrived(p.x, p.y)) || BohemiaJobKinds.step();   /* 11/21: the map's own crew job is the map's arrival (loopArrived), as on his phone */   /* 11/21: a patrol's band comes a few steps after its post (the walk steps on till it is on the road) */
            if (J.met.length > before && LOOP.fighting) { /* won, the way the map's own end handler hands a job its won fight (fightEnd); the count of fights moves as the fight's own does */
              const m = J.met[J.met.length - 1], n = (m.band || []).length || 1; LOOP.fighting = null;
              localStorage.setItem('bohemia.fight.met.v1', String((Number(localStorage.getItem('bohemia.fight.met.v1')) || 0) + 1));
              BohemiaJobKinds.fightEnd(j, { result: 'win', victory: true, dead: n, fled: 0, alive: 0, newFight: true }); }
            if (J.met.length >= J.card.length) break; }
        } catch (e) { J.walkErr = String(e.message).slice(0, 120); }
        window.cityHandOver = real; try { loopClose(); } catch (e) {} LOOP.held = []; LOOP.fighting = null; localStorage.setItem('bohemia.fight.met.v1', String(MET));
        out.push(J); }); });
      return out; }, [MET, HOUR, NJOBS]);
    row.jobs.forEach(J => { J.pairs = J.card.map((c, i) => ({ what: c.what, dark: c.dark, card: c.band, met: (J.met[i] || {}).band || null, night: (J.met[i] || {}).night }));
      J.same = J.pairs.length > 0 && J.pairs.every(p => p.met && JSON.stringify(p.card) === JSON.stringify(p.met));
      J.sameHeld = (J.held || []).length > 0 && J.met.length > 0 && J.met.every((m, i) => J.held[i] && JSON.stringify(J.held[i].band) === JSON.stringify(m.band));
      J.boardIsHeld = (J.held || []).length === J.card.length && J.card.every((c, i) => JSON.stringify(c.at) === JSON.stringify(J.held[i].at) && JSON.stringify(c.band) === JSON.stringify(J.held[i].band)); });
  } catch (e) { row.err = String(e && e.message || e).slice(0, 300); }
  row.errs = errs.slice(0, 5);
  (row.jobs || []).forEach(J => console.log('  ' + TAG + ' ' + shape + ' ' + J.id + ' @' + J.town + ': ' + (J.walkErr ? 'ERR ' + J.walkErr + ' ' : '') + J.pairs.map(p => p.what + (p.dark ? ' (dark)' : '') + ' card ' + JSON.stringify(p.card) + ' met ' + JSON.stringify(p.met) + (p.night ? ' at night' : '')).join('; ') + ' -> ' + (J.same ? 'SAME' : 'DIFFERENT')));
  if (row.err) console.log('  ' + TAG + ' ' + shape + ' ERR ' + row.err);
  await d.close().catch(() => {});
  return row;
}
(async () => {
  const res = [];
  for (const s of SHAPES) res.push(await walk(s));
  const f = path.join(OUTD, 'card_night_' + TAG + '.json');
  fs.writeFileSync(f, JSON.stringify({ draft: true, tool: 'tools/bohemia_jobs_the_card_reads_the_night_on_the_phone.js', tag: TAG, alpha: ALPHA, met: MET, walks: res }, null, 1));
  console.log('wrote ' + path.relative(ROOT, f));
})();
