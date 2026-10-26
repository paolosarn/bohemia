#!/usr/bin/env node
/* AN EARLY RETREAT GETS OUT, MEASURED (COMBAT [an early retreat gets out], rule 256, Paolo 10/26: 'if I retreat immediately at the
   beginning of the battle, most of the time I should be able to escape... things that can traverse farther than a human should start
   back a couple tiles... in Battle Brothers every time I retreated I watched my people run tile to tile and they always made it').
   Rolled fights on the live fight's rules (tools/bohemia_fight_headless.js): his company (3, 6 or 12), the five road factions, two
   to ten of them, days 1 to 90, every district's board; the line as the fight deals it, FIGHT, and RETREAT the moment the first man of
   his is up; both sides play on to the end (his men run for the edge, theirs hunt them). Counts:
     out        his men off the board of all his men
     allOut     fights where every man of his got out
     inReach    his men who stood within a turn's run (his AP over a flat step) of the nearest edge at the bell
     firstHit   fights where a man of theirs struck one of his on that man's own first turn (a shot or a blow)
     firstBlow  the same, a blow (a man who closed to melee on his first turn: the wiki's 'cannot close within 1 round')
     byKind     the same, by faction
   Run: node tools/bohemia_combat_early_retreat.js [--n 1000]; module: require(...).measure(n) */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const FACTIONS = ['brigands', 'beasts', 'kids', 'machines', 'heavies'], SIZES = [3, 6, 12];

function measure(n) {
  const ctx = engine(), F = ctx.FIGHT, DB = ctx.DB, districts = DB.boardKinds.districts;
  const flat = require('vm').runInContext("R('ap.move_cost.flat')", ctx);
  const T = { fights: 0, men: 0, out: 0, allOut: 0, inReach: 0, firstHit: 0, firstBlow: 0, broke: 0, byKind: {}, worst: [] };
  for (let k = 0; k < n; k++) {
    const fac = FACTIONS[k % 5], size = SIZES[Math.floor(k / 5) % 3], count = 2 + ((k * 7) % 9), days = 1 + ((k * 13) % 90);
    const d = districts[(k * 11 + 3) % districts.length], seed = 7000 + k;
    const company = []; for (let i = 0; i < size; i++) company.push({});
    let S;
    try {
      ctx.setSeed(seed);
      F.setup({ seed, company, cap: size, formation: null, party: { faction: fac, count, days }, district: d.district, cell: { x: 11 + (k % 29), y: 7 + (k % 31) }, act: 1 });
      S = F.S;
      if (S.deploy) F.startFight();
      const mine0 = S.units.filter(v => v.side === 'you' && F.onField(v));
      const edge = v => Math.min(v.x, v.y, S.w - 1 - v.x, S.h - 1 - v.y);
      mine0.forEach(v => { if (edge(v) <= Math.floor(v.apTurn / flat)) T.inReach++; });
      const firstOf = {}; let ordered = false, hitFirst = false, blowFirst = false;
      for (let g = 0; g < 6000 && !S.over; g++) {
        const u = F.current(); if (!u) break;
        if (u.side === 'you' && !ordered) { ordered = true; F.retreat(); S.events = []; continue; }
        if (u.side === 'them' && !(u.id in firstOf)) firstOf[u.id] = S.round;
        const n0 = S.log.length;
        F.aiStep(u); S.events = [];
        if (u.side === 'them' && firstOf[u.id] === S.round && S.log.slice(n0).some(e => e.t === 'attack' && e.id === u.id && F.byId(e.to) && F.byId(e.to).side === 'you')) { hitFirst = true; if (!F.isRanged(u.weapon)) blowFirst = true; }
      }
      const mine = S.units.filter(v => v.side === 'you'), got = mine.filter(v => v.escaped).length;
      T.fights++; T.men += mine.length; T.out += got; if (got === mine.length) T.allOut++; if (hitFirst) T.firstHit++; if (blowFirst) T.firstBlow++;
      const K = T.byKind[fac] || (T.byKind[fac] = { fights: 0, men: 0, out: 0, firstHit: 0, firstBlow: 0 });
      K.fights++; K.men += mine.length; K.out += got; if (hitFirst) K.firstHit++; if (blowFirst) K.firstBlow++;
      if (got < mine.length && T.worst.length < 8) T.worst.push({ k, fac, size, count, days, district: d.district, out: got + '/' + mine.length });
    } catch (e) { T.broke++; if (T.worst.length < 8) T.worst.push({ k, broke: String(e.message).slice(0, 100) }); }
  }
  T.inReachShare = T.men ? T.inReach / T.men : 0; T.outShare = T.men ? T.out / T.men : 0;
  return T;
}
module.exports = { measure };
if (require.main === module) {
  const n = Number(process.argv[process.argv.indexOf('--n') + 1]) || 1000;
  const t0 = Date.now(), T = measure(n);
  console.log('fights ' + T.fights + ' (broke ' + T.broke + ') in ' + Math.round((Date.now() - t0) / 1000) + ' s; his men out ' + T.out + ' of ' + T.men + ' (' + (100 * T.outShare).toFixed(1) + '%), every man out in ' + T.allOut
    + '; within a turn of an edge at the bell ' + T.inReach + ' of ' + T.men + ' (' + (100 * T.inReachShare).toFixed(1) + '%); a man of theirs struck on his first turn in ' + T.firstHit + ' fights, a blow (melee) in ' + T.firstBlow);
  Object.keys(T.byKind).forEach(k => { const K = T.byKind[k]; console.log('  ' + k + ': out ' + K.out + '/' + K.men + ' (' + (100 * K.out / K.men).toFixed(1) + '%), first-turn hits in ' + K.firstHit + ' (blows ' + K.firstBlow + ') of ' + K.fights); });
  T.worst.forEach(w => console.log('  e.g. ' + JSON.stringify(w)));
}
