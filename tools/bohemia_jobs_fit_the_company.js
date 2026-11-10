#!/usr/bin/env node
// JOBS [jobs that fit] 11/8 -- THE MEASUREMENT FIRST (VAMILY rule 436(c), ask lines 102, 114, 521; rules 183, 192, 208, 254, 255).
// Paolo: the first fifty days reward a small strong crew (the Lone Wolf plays like he remembers); most jobs fit the company the way
// Battle Brothers sizes its contracts (never 75% overpowered); the stars on a job tell the truth about how hard it is.
//
// ON THE DEMO ITSELF (slices/BOHEMIA_DEMO.html through tools/bohemia_drive_the_demo.js), the game's own pieces, never a copy of their math:
//   THE COMPANY  one boot per origin, picked at the door (bohemia.start): the origin's own men as they walk out of the door (kit,
//                levels, the rolled man), handed to every fight by the shell's own door (nfOpts, through the reader's doorOpts)
//   THE VALLEYS  20+ campaign seeds switched inside the boot (WORLD_SEED: the fourteen bases stand where the code puts them, so a job's
//                places, roads and grounds are that valley's)
//   THE DAYS     the calendar (DAY.day) at 1, 5, 10, 20, 30, 40, 50
//   A JOB        every offer the shelf holds for a place's tier (THE DEALT VIEW: what the job math deals before any filter), its fights
//                as the reader rolls them (BohemiaJobDanger.fightsFor: the job kinds' plan, partyMath's count, the fight's own band
//                roll), each fight played on AUTO both sides on the fight's own rules (BohemiaJobDanger.fresh, a fresh copy a fight,
//                the AUTO button's count oddsRunValue); the job's worth the reader's own product (1 - p(1 - clean)), its stars the
//                reader's own lines (cfg cut_one, cut_three, read from the fight's AUTO colour)
//   THE BOARD    the shelf's own deal (BohemiaBoardShelf.pick over the valley's places), its day-fifty filter answered from the same
//                worth with the reader's own floor and red share (rampFloor, rampReds) and its rare rows (rule 389)
//   THE TRUTH    a sample of posted jobs replayed on fresh dice (--truth N a deal, --truth-runs R): the stars against the fresh plays
//   HIRES        --hires K: K ordinary level-1 hires join the origin's men (bohemia.hired.v1, the post's own record), to ask whether
//                growing the crew early pays (rule 183(a))
// Every read is a DAYTIME read (the map's clock is pinned to day for the survey: the hour moves the worth). The plays are this tool's own (--runs R a fight, cached by the crew, the band, its kind, its dress day and its ground, as the
// reader caches them), so the numbers are the reader's numbers on other dice; the posted boards are the shelf's own deal.
// node tools/bohemia_jobs_fit_the_company.js [--seeds 20 | --codes A,B] [--origins wolf,newcrew,watch] [--days 1,5,10,20,30,40,50]
//      [--runs 10] [--sample 5 places a day for the dealt view] [--truth 1] [--truth-runs 24] [--hires 0] [--json out.json]
// Every number it prints is a MEASUREMENT of the demo as it is; nothing in the game reads it.
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
/* the campaign codes: the seed alphabet's own letters (no 0, O, 1, I, L), a fixed list so a re-run is the same valleys */
const ALL_CODES = ['K7QM9X', 'VEGAS7', 'DUST42', 'NEXNHB', 'BATT3R', 'MEADXX', 'CRASH5', 'REDRK9', 'SAHARA', 'HQQVER',
  'BQNANZ', 'MQJAVE', 'FREMNT', 'SPRNGS', 'TRQPCA', 'PAHRMP', 'BQUZDR', 'NE22S7', 'SUMMRN', 'CHARZ5', 'GQQDSP', 'PRMM7X', 'APX99Z', 'JEAN44'];
const CODES = (arg('--codes', '') || '').split(',').filter(Boolean).length ? arg('--codes').split(',').filter(Boolean) : ALL_CODES.slice(0, +arg('--seeds', 20));
const ORIGINS = (arg('--origins', 'wolf,newcrew,watch')).split(',').filter(Boolean);
const DAYS = (arg('--days', '1,5,10,20,30,40,50')).split(',').filter(Boolean).map(Number);
const RUNS = +arg('--runs', 10), TRUTH = +arg('--truth', 1), TRUTH_RUNS = +arg('--truth-runs', 24), HIRES = +arg('--hires', 0), SAMPLE = +arg('--sample', 5);
const OUT = arg('--json', null), PROFILE = arg('--profile', 'computer');
/* --plant old: the job math before JOBS 11/8 in this page only (party_math.json job_contract taken away: every beast one for one,
   a hunt's kills fixed), for the gate's planted fail; nothing else changes */
const PLANT = arg('--plant', '');

/* the in-page instrument: one function, evaluated in the map's frame */
const PAGE = function () {
  if (window.__JOBS) return true;
  const J = window.__JOBS = { fight: {}, job: {}, plays: 0, ms: 0 };
  /* THE HOUR IS PINNED TO DAY (measured 11/9: the map's clock runs while the survey runs, so one valley was read at noon and the next
     at night, where the dark takes a third off every shot and the hour picks who walks; a before and an after a few hours apart
     moved by 0.08 on jobs the change never touched). Every read of the survey is a daytime read: the job's worth by day */
  J.pin = function (fn) { const n0 = window.isNight; window.isNight = function () { return false; }; try { return fn(); } finally { window.isNight = n0; } };
  const seedOf = (s) => { let h = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const district = (at) => { try { const t = om.at(at[0] | 0, at[1] | 0); return t ? t.district : null; } catch (e) { return null; } };
  /* one fight, played `runs` times on AUTO both sides through the shell's door, a fresh copy of the rules (the reader's own way) */
  J.play = function (f, runs, salt) {
    const at = f.at || null;
    /* the hand-over itself is the key: the same door options are the same fight (the reader's own opts carry no cell, so the board is
       dealt from the dice alone), so a fight met again on another day or in another valley is not played twice */
    const opts = BohemiaJobDanger.doorOpts({ count: f.band.length, band: f.band, faction: f.faction, days: f.days, difficulty: f.difficulty }, at);
    const key = JSON.stringify(opts) + '|' + runs + '|' + (salt || 0);
    if (J.fight[key]) return J.fight[key];
    const t0 = performance.now();
    const E = BohemiaJobDanger.fresh(); let sum = 0, won = 0, dead = 0, down = 0, n = 0;
    /* COMMON DICE (measured 11/10: seeded off the whole hand-over, the same band met in a before and an after got other dice, and at a
       few plays a fight that noise, about 0.1 a job, repeated in every valley the fight was cached for): the dice are the fight's own,
       its band, its kind, its dress day, its ground, the hour and the crew, so a fight the change did not touch plays the same */
    const s0 = seedOf('jobs:' + BohemiaJobDanger.crewKey() + '|' + f.band.join(',') + '|' + f.faction + '|' + (f.days | 0) + '|' + (at ? district(at) : '') + '|' + (opts.night ? 'n' : 'd') + '|' + (salt || 0));
    for (let r = 0; r < runs; r++) {
      E.seed((s0 + r * 7919) >>> 0); E.F.setup(JSON.parse(JSON.stringify(opts)));
      let g = 0; while (!E.F.S.over && g <= 6000) { const v = E.F.current(); if (!v) break; E.F.aiStep(v); E.F.S.events = []; g++; }
      const w = E.F.S.over ? E.run(E.F) : 0; sum += w; n++;
      if (E.F.S.result === 'won') won++;
      E.F.S.units.forEach(u => { if (u.side === 'you') { if (u.dead) dead++; else if (u.down) down++; } });
    }
    J.plays += n; J.ms += performance.now() - t0;
    return (J.fight[key] = { clean: sum / n, won: won / n, dead: dead / n, down: down / n, runs: n, men: (opts.company || []).length });
  };
  /* a job at a place: its fights as the reader rolls them, each played, the reader's product */
  J.worth = function (o, place, runs, salt) {
    const k = BohemiaJobDanger.crewKey() + '|' + o.id + '@' + place + '|' + WORLD_SEED + '|' + runs + '|' + (salt || 0);
    if (J.job[k] !== undefined) return J.job[k];
    let fsx = null; try { fsx = BohemiaJobDanger.fightsFor(o, place); } catch (e) { fsx = null; }
    if (!fsx) return (J.job[k] = null);
    let clean = 1; const fights = [];
    fsx.forEach(f => { const P = J.play(f, f.p >= 0.25 ? runs : Math.max(4, runs >> 2), salt); clean *= 1 - f.p * (1 - P.clean);
      fights.push({ what: f.what, p: +f.p.toFixed(4), faction: f.faction, n: f.band.length, band: f.band, days: f.days, road: !!f.road, clean: P.clean, won: P.won, dead: P.dead, down: P.down }); });
    const C = BohemiaJobDanger.cfg();
    const sure = fights.filter(f => f.p >= 0.999 && !f.road);
    return (J.job[k] = { clean, stars: clean >= C.cut_one ? 1 : clean <= C.cut_three ? 3 : 2, fights,
      sure: sure.length, sure_men: sure.reduce((t, f) => t + f.n, 0), most: Math.max(0, ...sure.map(f => f.n)), won_sure: sure.reduce((t, f) => t * f.won, 1) });
  };
  /* the board's filter, answered from the same worth with the reader's own lines (fits(): the rare rows, the day's floor, the reds) */
  J.fits = function (o, place, day, have, size, runs) {
    const r = o && o.rare; if (r != null && r < 1) { const h = seedOf(o.id + ':rare:' + place + ':' + Math.floor((day | 0) / 3)); if (!(((h % 10000) / 10000) < +r)) return false; }
    const C = BohemiaJobDanger.cfg(); if (!o || !o.id || !(C.ramp_floor > 0)) return true;
    const W = J.worth(o, place, runs); if (!W) return true;
    if (W.clean < BohemiaJobDanger.rampFloor(day)) return false;
    if (W.clean >= C.cut_one) return true;
    let reds = 0; (have || []).forEach(h => { const Q = J.worth(h, place, runs); if (Q && Q.clean < C.cut_one) reds++; });
    return reds < BohemiaJobDanger.rampReds(day, size);
  };
  /* the day in one valley: the dealt view, then the shelf's own deal through the filter */
  J.day = function (day, code, runs, si, sample) { return J.pin(function () { return J.day0(day, code, runs, si, sample); }); };
  J.day0 = function (day, code, runs, si, sample) {
    WORLD_SEED = code; WORLD_BASES = null; try { window.WORLD_SEED = code; } catch (e) {}
    DAY.day = day;
    /* the job's own dice (make() rolls on the job, the town, the day and the jobs done) and the targets the plan keeps (keyed the same
       way) move with the valley: each seed is a campaign that has done its own count of jobs; put back after */
    if (J.done0 === undefined) J.done0 = LOOP.done | 0;
    LOOP.done = J.done0 + 1000 * (si + 1);
    const P = BohemiaBoardShelf.mapPlaces(day) || [], S = BohemiaBoardShelf.shelf(), dealt = [], boards = {};
    /* THE DEALT VIEW on a sample of the valley's places (every tier among them over the seeds); the boards are every place's */
    const PS = sample < 0 ? [] : P.filter((p, i) => !sample || ((i + si * 3 + day) % P.length) < sample);   /* --sample -1: the boards only */
    PS.forEach(p => S.offers.filter(o => !o.when && (o.tiers || []).indexOf(p.tier) >= 0).forEach(o => {
      const W = J.worth(o, p.name, runs); if (!W) return;
      let plays = null; try { plays = BohemiaJobKinds.kindOf ? String(BohemiaJobKinds.kindOf(o)) : null; } catch (e) {}   /* the kind's id ('hunt-kind', 'lair' ...) */
      dealt.push({ id: o.id, place: p.name, tier: p.tier, skulls: o.skulls | 0, pay: o.pay | 0, plays,
        rare: !!(o.rare != null && o.rare < 1), clean: W.clean, stars: W.stars, sure: W.sure, sure_men: W.sure_men, most: W.most, won_sure: W.won_sure,
        faction: (W.fights.filter(f => f.p >= 0.999 && !f.road)[0] || W.fights[0] || {}).faction || null,
        f: W.fights.filter(f => !f.road).map(f => [f.what, f.faction, f.n, +f.clean.toFixed(2), +f.won.toFixed(2), +f.p.toFixed(2)]) }); }));   /* each fight: what, who, how many, worth, won, chance */
    const F0 = BohemiaJobDanger.fits; BohemiaJobDanger.fits = function (o, place, d2, have, size) { return J.fits(o, place, d2, have, size, runs); };
    try { P.forEach(p => { const L = BohemiaBoardShelf.pick({ name: p.name, tier: p.tier }, day, { traits: p.traits || [], held: [], places: P, crew: 'a crew ' + code }) || [];
      boards[p.name] = L.map(o => { const W = J.worth(o, p.name, runs) || {}; return { id: o.id, place: p.name, tier: p.tier, skulls: o.skulls | 0, pay: o.pay | 0, clean: W.clean, stars: W.stars, sure_men: W.sure_men, most: W.most, fights: W.fights }; }); }); }
    finally { BohemiaJobDanger.fits = F0; LOOP.done = J.done0; }
    const cb = (ctBases() || {}).Church;
    return { places: P.length, dealt, boards, church: cb ? [cb.x, cb.y] : null };
  };
  return true;
};

async function one(origin) {
  const arm = "try { localStorage.setItem('bohemia.world.bench.v1', '" + CODES[0] + "'); var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = '" + origin + "'; localStorage.setItem('bohemia.start', JSON.stringify(s)); } catch (e) {}";
  const d = await drive.open({ profile: PROFILE, fog: false, engage: false, keepCards: true, arm });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const out = { origin, codes: CODES, days: [], errs };
  try {
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready() && window.BohemiaBoardShelf && BohemiaBoardShelf.ready() && window.BohemiaJobDanger && BohemiaJobDanger.ready() && window.LOOP && LOOP.start && LOOP.start.company, null, { timeout: 120000 });
    await fr.evaluate((k) => { const H = []; for (let i = 0; i < k; i++) H.push({ name: 'HIRE ' + (i + 1), background: ['daytaler', 'farmhand', 'militia', 'miller', 'poacher', 'vagabond'][i % 6], level: 1 });
      ['bohemia.company.v1', 'bohemia.company.line.v1'].forEach(x => localStorage.removeItem(x));
      ['bohemia.walked.v1', 'bohemia.taken.v1', 'bohemia.fight.after.v1'].forEach(x => localStorage.setItem(x, '[]'));
      localStorage.setItem('bohemia.hired.v1', JSON.stringify(H)); localStorage.setItem('bohemia.fight.met.v1', '3'); }, HIRES);
    await fr.evaluate('(' + PAGE.toString() + ')()');
    if (PLANT === 'old') await fr.evaluate(() => { try { delete PARTY_MATH.job_contract; } catch (e) {} window.__JOBS_PLANTED = 'old'; });
    /* --plant nosplit: the 11/10d math (the beasts' cost, the hunts) without 11/10's one contract for a job of several fights (the
       split and the legs' shares taken away in this page): the before of that change alone */
    if (PLANT === 'nosplit') await fr.evaluate(() => { try { delete PARTY_MATH.job_contract.value.split; } catch (e) {}
      try { const D = BohemiaJobKinds.data(); const off = L => (L || []).forEach(x => { if (x && x.fight && x.fight.share) { delete x.fight.share; x.fight.n = x.fight.n === 'party' ? 2 : x.fight.n; } });
        Object.values(D.kinds || {}).forEach(k => k && off(k.legs)); Object.values(D.offers || {}).forEach(o => o && off(o.legs)); } catch (e) {}
      window.__JOBS_PLANTED = 'nosplit'; });
    out.plant = PLANT || null;
    out.contract = await fr.evaluate(() => { try { return partyV('job_contract') || null; } catch (e) { return null; } });
    out.company = await fr.evaluate(() => (LOOP.start.company || []).map(m => ({ background: m.background, level: m.level, gear: m.gear || null })));
    out.crew = await fr.evaluate(() => ({ men: crewCount(), strength: partyRosterStrength(), levels: BohemiaJobKinds.rosterLevels(), cfg: (function () { const C = BohemiaJobDanger.cfg(); return { cut_one: C.cut_one, cut_three: C.cut_three, ramp_floor: C.ramp_floor, ramp_calm_until: C.ramp_calm_until, ramp_full_at: C.ramp_full_at }; })() }));
    for (const day of DAYS) for (const [si, code] of CODES.entries()) {
      const t0 = Date.now();
      const r = await fr.evaluate(([day, code, runs, si, sample]) => window.__JOBS.day(day, code, runs, si, sample), [day, code, RUNS, si, SAMPLE]);
      const posted = [].concat(...Object.values(r.boards));
      /* the truth: a sample of posted jobs, fresh dice */
      const pickT = posted.filter(j => j.clean != null).slice().sort((a, b) => (a.id + a.place < b.id + b.place ? -1 : 1));
      const step = Math.max(1, Math.floor(pickT.length / Math.max(1, TRUTH)));
      for (let i = 0, k = 0; i < pickT.length && k < TRUTH; i += step, k++) {
        const j = pickT[i];
        j.truth = await fr.evaluate(([id, place, runs, si, code]) => { const J = window.__JOBS; WORLD_SEED = code; WORLD_BASES = null; LOOP.done = J.done0 + 1000 * (si + 1);
          try { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0]; const W = J.pin(() => J.worth(o, place, runs, 77)); return W ? { clean: W.clean, stars: W.stars } : null; } finally { LOOP.done = J.done0; } }, [j.id, j.place, TRUTH_RUNS, si, code]);
      }
      const row = { day, code, church: r.church, places: r.places, dealt: r.dealt, posted, secs: Math.round((Date.now() - t0) / 1000) };
      out.days.push(row);
      /* written as it goes: a run cut short keeps every day it measured */
      if (OUT) try { fs.writeFileSync(OUT + '.part', JSON.stringify({ draft: true, partial: true, hires: HIRES, runs_a_fight: RUNS, runs: [out] })); } catch (e) {}
      const lost = L => L.filter(j => j.clean != null && j.clean < 0.5).length;
      console.log('  ' + code + ' ' + origin + (HIRES ? '+' + HIRES : '') + ' day ' + day + ' (' + row.secs + ' s): dealt ' + r.dealt.length + ' (lost>won ' + lost(r.dealt) + '), posted ' + posted.length + ' (lost>won ' + lost(posted) + '); posted stars ' +
        [1, 2, 3].map(s => posted.filter(j => j.stars === s).length).join('/'));
    }
    out.plays = await fr.evaluate(() => ({ plays: window.__JOBS.plays, ms: Math.round(window.__JOBS.ms), fights: Object.keys(window.__JOBS.fight).length }));
  } catch (e) { out.err = String(e && e.stack || e).slice(0, 400); console.log('  ' + origin + ' FAILED ' + out.err.slice(0, 300)); }
  await d.close().catch(() => {});
  return out;
}

(async () => {
  const res = [];
  for (const o of ORIGINS) res.push(await one(o));
  const doc = { draft: true, tool: 'tools/bohemia_jobs_fit_the_company.js', at: new Date().toISOString(), argv: process.argv.slice(2), days: DAYS, hires: HIRES, runs_a_fight: RUNS, dealt_sample: SAMPLE, runs: res };
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(doc));
  console.log('done ' + res.length + ' boots' + (OUT ? ' -> ' + OUT : ''));
})();
