#!/usr/bin/env node
/* ============================================================================
   A NEW VALLEY EVERY GAME GATE (WORLD 6, 11/2/26, rule 318, ask line 315).

   PAOLO 11/2: "I am not getting really generated vibes right now playing on the map. The Remnants are on the same part
   of the map... I don't even know if you have a number seed system in place."
   MEASURED BEFORE: fourteen bases baked at fixed blocks, every new game the same valley; no campaign seed.

   THE LAND STAYS REAL; WHO STANDS ON IT COMES FROM ONE CODE (engine/bohemia_world_seed.js, records/target/bb/world_seed.json).
   LEGS (the demo, through the one driver; node reads the files):
     N1 the page carries the data file and the placer as they are on disk (no drift)
     N2 the bench (the dark lifted, no code) keeps the old valley: ctBases() is CT_BASES_BAKED
     N3 every faction has at least min_sites real places on the real map
     N4 TEN SEEDS: ten codes, ten layouts, logged; the same code twice is the same world; no two bases closer than the
        floor; every base on a block of its own kinds
     N5 EVERY CANDIDATE OPENS ITS TOWN: every real place a base can stand on has a walkable door touching its ground and
        the map's own route reaches that door from the valley's middle
     N6 TWO SEEDED VALLEYS (the bench walking a code): ctBases(), the turf's seats and every roaming party's home are the
        seed's bases; every base's door opens that base's town (townAtDoor) and the map can walk to it (townDoorWalk)
     N7 A STRANGER'S NEW GAME WITH A TYPED CODE: the code is the game's, saved with it; the town he starts in is a seeded
        base; the same code in a second new game starts in the same corner and the same town
     N8 nothing threw
   BOHEMIA_SHOT_DIR=dir writes each seeded valley zoomed all the way out, and both side by side (seeds.png).
   node gates/a_new_valley_every_game_gate.js
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const W = require(path.join(ROOT, 'engine', 'bohemia_world_seed.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('A NEW VALLEY EVERY GAME: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const SHOTS = process.env.BOHEMIA_SHOT_DIR || null;
const CODES = ['K7QM9X', 'VEGAS7', 'DUST42', 'NEONHB', 'BATT3R', 'MEADXX', 'CRASH5', 'REDRK9', 'SAHARA', 'HOOVER'];
const TWO = ['K7QM9X', 'VEGAS7'];
const ready = (fr) => fr.waitForFunction(() => typeof ctBases === 'function' && typeof om !== 'undefined' && window.BohemiaTowns
  && window.BohemiaCityEdit && window.BohemiaWorldSeed && typeof cityRoute === 'function', null, { timeout: 90000 });

(async () => {
  const errs = [];
  /* N1: the page's copy */
  const page = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html'), 'utf8');
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'records', 'target', 'bb', 'world_seed.json'), 'utf8'));
  const mod = fs.readFileSync(path.join(ROOT, 'engine', 'bohemia_world_seed.js'), 'utf8').trimEnd();
  const m = page.match(/var BOHEMIA_WORLD_SEED_DATA = (\{.*?\});\n/);
  ok('N1 the page carries the data file as it is (re-run tools/bohemia_world_seed_patch.py)', !!m && JSON.stringify(JSON.parse(m[1])) === JSON.stringify(data));
  ok('N1 the page carries the placer as it is', page.indexOf(mod) >= 0);

  /* bench, no code */
  let d = await open({ profile: 'computer', fog: false });
  try {
    await ready(d.fr);
    const r = await d.fr.evaluate(({ CODES }) => {
      const out = {};
      out.ws = WORLD_SEED; out.from = WORLD_SEED_FROM;
      out.bench = JSON.stringify(ctBases()) === JSON.stringify(CT_BASES_BAKED);
      const ds = BohemiaTowns.districtsOf(om, BohemiaCityEdit.cat), D = BohemiaWorldSeed.data();
      const S = BohemiaWorldSeed.sites(ds, D); out.sites = {}; for (const f in S) out.sites[f] = S[f].length;
      out.places = {}; const P0 = BohemiaWorldSeed.place(ds, 'PLACES', { classic: CT_BASES_BAKED, n: om.n }); for (const f in P0.bases) out.places[f] = P0.bases[f].places; out.minPlaces = D.min_places || 3;
      out.min = D.min_sites; out.floor = D.spread.floor_apart; out.kinds = {}; for (const f in D.factions) out.kinds[f] = Object.keys(D.factions[f].kinds);
      out.lay = {}; out.relaxed = {};
      CODES.forEach(c => { const P = BohemiaWorldSeed.place(ds, c, { classic: CT_BASES_BAKED, n: om.n }); out.lay[c] = P.bases; out.relaxed[c] = P.relaxed; });
      out.again = JSON.stringify(BohemiaWorldSeed.place(ds, CODES[0], { classic: CT_BASES_BAKED, n: om.n }).bases) === JSON.stringify(out.lay[CODES[0]]);
      out.classic = CT_BASES_BAKED;
      /* N5: every candidate, from the valley's middle */
      let mid = null; for (let q = 0; q < 12 && !mid; q++) for (let a = -q; a <= q && !mid; a++) for (let b = -q; b <= q && !mid; b++) if (cityWalkable(48 + a, 48 + b)) mid = [48 + a, 48 + b];
      /* one flood from the middle by straight steps (a straight step is a step every route takes), so 2,700 candidates cost one
         walk of the valley; a door the flood misses still gets the map's own route before it counts as unreachable */
      const N = om.n | 0, reach = new Uint8Array(N * N), q = [mid]; reach[mid[1] * N + mid[0]] = 1;
      for (let h = 0; h < q.length; h++) { const [x, y] = q[h]; [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { const u = x + a, v = y + b;
        if (u < 0 || v < 0 || u >= N || v >= N || reach[v * N + u] || !cityWalkable(u, v)) return; reach[v * N + u] = 1; q.push([u, v]); }); }
      const cityRoute2 = (ax, ay, bx, by) => (reach[by * N + bx] ? true : cityRoute(ax, ay, bx, by));
      const seen = {}, t0 = performance.now(); out.cand = { n: 0, door: 0, route: 0, bad: [] };
      for (const f in S) S[f].forEach(s => {
        const k = f + '@' + s.x + ',' + s.y; if (seen[k]) return; seen[k] = 1; out.cand.n++;
        const t = { name: f, x: s.x, y: s.y, tier: mapTierOf(f) }, F = townFoot(t); let door = null;
        for (let yy = F.y0 - 1; yy <= F.y0 + F.n && !door; yy++) for (let xx = F.x0 - 1; xx <= F.x0 + F.n && !door; xx++) if (townTouches(t, F, xx, yy) && cityWalkable(xx, yy)) door = [xx, yy];
        if (!door) { if (out.cand.bad.length < 12) out.cand.bad.push(k + ' no door'); return; } out.cand.door++;
        const p = cityRoute2(mid[0], mid[1], door[0], door[1]);
        if (p) out.cand.route++; else if (out.cand.bad.length < 12) out.cand.bad.push(k + ' no road');
      });
      out.cand.ms = Math.round(performance.now() - t0); out.mid = mid;
      return out;
    }, { CODES });
    ok('N2 the bench keeps the old valley (no code, the baked bases)', r.ws === '' && r.bench, r.from);
    const thin = Object.keys(r.sites).filter(f => r.sites[f] < r.min);
    ok('N3 every faction has at least ' + r.min + ' blocks it could stand on', !thin.length, Object.keys(r.sites).map(f => f + ' ' + r.sites[f]).join(', '));
    const fewP = Object.keys(r.places).filter(f => r.places[f] < r.minPlaces);
    ok('N3 and at least ' + r.minPlaces + ' separate real places (touching blocks of one kind are one place)', !fewP.length, Object.keys(r.places).map(f => f + ' ' + r.places[f]).join(', '));
    /* N4: the ten seeds */
    const names = Object.keys(r.classic).sort();
    console.log('\n  THE TEN SEEDS (each faction\'s base: x,y and the kind of place)');
    console.log('  ' + 'faction'.padEnd(11) + ['OLD'].concat(CODES).map(c => c.padEnd(15)).join(''));
    names.forEach(f => console.log('  ' + f.padEnd(11) + [r.classic[f].x + ',' + r.classic[f].y].concat(CODES.map(c => { const b = r.lay[c][f]; return b ? b.x + ',' + b.y + ' ' + String(b.kind || '?').slice(0, 7) : '-'; })).map(s => s.padEnd(15)).join('')));
    const lays = new Set(CODES.map(c => JSON.stringify(names.map(f => r.lay[c][f] && [r.lay[c][f].x, r.lay[c][f].y]))));
    const per = names.map(f => new Set(CODES.map(c => r.lay[c][f] && r.lay[c][f].place)).size);
    console.log('  distinct layouts: ' + lays.size + ' of ' + CODES.length + '; distinct real places per faction in ten seeds: ' + names.map((f, i) => f + ' ' + per[i]).join(', '));
    ok('N4 ten codes, ten different valleys', lays.size === CODES.length, lays.size);
    ok('N4 every faction moves between seeds (at least 3 different real places in ten)', per.every(n => n >= 3), names.filter((f, i) => per[i] < 3).join(',') || Math.min.apply(null, per));
    ok('N4 the same code twice is the same world', r.again);
    let crowd = [], offKind = [], missing = [];
    CODES.forEach(c => { const L = r.lay[c], ks = Object.keys(L);
      names.forEach(f => { if (!L[f]) missing.push(c + ' ' + f); else if (r.kinds[f].indexOf(L[f].kind) < 0) offKind.push(c + ' ' + f + ' ' + L[f].kind); });
      for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) { const a = L[ks[i]], b = L[ks[j]]; const dd = Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)); if (dd < r.floor) crowd.push(c + ' ' + ks[i] + '/' + ks[j] + ' ' + dd); } });
    ok('N4 every seed seats all fourteen', !missing.length, missing.slice(0, 4).join('; '));
    ok('N4 no two bases closer than ' + r.floor + ' blocks', !crowd.length, crowd.slice(0, 4).join('; '));
    ok('N4 every base stands on a place of its own kind', !offKind.length, offKind.slice(0, 4).join('; '));
    const relaxed = CODES.reduce((a, c) => a + r.relaxed[c].length, 0);
    console.log('  spacing relaxed (a faction squeezed below ' + data.spread.min_apart + ' blocks, never below ' + r.floor + '): ' + relaxed + ' times in ten seeds');
    ok('N5 every candidate has a door onto the street', r.cand.door === r.cand.n, r.cand.door + '/' + r.cand.n + (r.cand.bad.length ? ' ' + r.cand.bad.join('; ') : ''));
    ok('N5 the map walks to every candidate\'s door from the middle', r.cand.route === r.cand.door, r.cand.route + '/' + r.cand.door + ', ' + r.cand.ms + ' ms');
    errs.push(...(d.errs || []));
  } catch (e) { ok('the bench measured', false, String(e && e.message || e).slice(0, 200)); }
  await d.browser.close().catch(() => {}); try { d.server.close(); } catch (_e) {}

  /* N6: two seeded valleys on the bench, zoomed all the way out */
  const shots = [];
  for (const code of TWO) {
    d = await open({ profile: 'computer', fog: false, arm: "try { localStorage.setItem('bohemia.world.bench.v1', '" + code + "'); } catch (e) {}" });
    try {
      await ready(d.fr);
      await d.page.waitForTimeout(2500);
      const r = await d.fr.evaluate(() => {
        const bs = ctBases(), P = window.__WORLD_BASES, seats = turfSeats(), parties = partiesAll() || [];
        const seatBad = seats.filter(s => bs[s.faction] && (bs[s.faction].x !== s.x || bs[s.faction].y !== s.y)).map(s => s.faction);
        const partyBad = parties.filter(p => p.from && bs[p.from.faction] && (bs[p.from.faction].x !== p.from.x || bs[p.from.faction].y !== p.from.y)).length;
        const doors = [], walks = [];
        for (const n in bs) { const t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }, F = townFoot(t); let door = null;
          for (let yy = F.y0 - 1; yy <= F.y0 + F.n && !door; yy++) for (let xx = F.x0 - 1; xx <= F.x0 + F.n && !door; xx++) if (townTouches(t, F, xx, yy) && cityWalkable(xx, yy)) door = [xx, yy];
          const at = door ? townAtDoor(door[0], door[1]) : null; if (!at || at.name !== n) doors.push(n + (at ? '->' + at.name : ' none'));
          if (!townDoorWalk(t)) walks.push(n); }
        return { ws: WORLD_SEED, from: WORLD_SEED_FROM, bs, match: !!P && JSON.stringify(P.bases) === JSON.stringify(bs), seats: seats.length, seatBad, parties: parties.length, partyBad, doors, walks,
          old: JSON.stringify(bs) === JSON.stringify(CT_BASES_BAKED) };
      });
      ok('N6 ' + code + ': the bench walks the code it was given', r.ws === code, r.from);
      ok('N6 ' + code + ': ctBases() is the seed\'s bases, not the old valley', r.match && !r.old);
      ok('N6 ' + code + ': the turf\'s seats stand on the seeded bases', r.seats >= 14 && !r.seatBad.length, r.seats + ' seats' + (r.seatBad.length ? ', off: ' + r.seatBad.join(',') : ''));
      ok('N6 ' + code + ': every roaming party leaves from its faction\'s seeded base', r.parties > 0 && r.partyBad === 0, r.parties + ' parties, ' + r.partyBad + ' off');
      ok('N6 ' + code + ': every base\'s door opens that base\'s town', !r.doors.length, r.doors.join('; '));
      ok('N6 ' + code + ': the map can walk to every base', !r.walks.length, r.walks.join(','));
      if (SHOTS) {
        /* the valley framed (the region's whole square makes the 96 blocks a postage stamp): zoomed out until the valley fills the glass */
        await d.fr.evaluate(() => { try { const zb = zoomBounds(); setZoomAt(Math.min(zb[1], zb[0] * 4), CVW / 2, CVH / 2); } catch (e) {} try { render(); } catch (e) {} });
        await d.page.waitForTimeout(1500);
        const f = path.join(SHOTS, 'seed_' + code + '.png'); await d.page.screenshot({ path: f }); shots.push([code, f]);
      }
      errs.push(...(d.errs || []));
    } catch (e) { ok('N6 ' + code + ' measured', false, String(e && e.message || e).slice(0, 200)); }
    await d.browser.close().catch(() => {}); try { d.server.close(); } catch (_e) {}
  }

  /* N7: a stranger's new game with a typed code, twice */
  const starts = [];
  for (let k = 0; k < 2; k++) {
    d = await open({ profile: 'phone_portrait', fog: true, arm: "try { localStorage.setItem('bohemia.world.next.v1', 'k7q-m9x'); var s = JSON.parse(localStorage.getItem('bohemia.start') || '{}'); s.origin = 'faith'; s.reveal = 0; localStorage.setItem('bohemia.start', JSON.stringify(s)); } catch (e) {}" });
    try {
      for (let i = 0; i < 120; i++) { if (await d.fr.evaluate(() => !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened)).catch(() => false)) break; await d.page.waitForTimeout(250); }
      const r = await d.fr.evaluate(() => { const S = window.__START_IN_TOWN || {}, F = window.__FRESH_START || {}, bs = ctBases() || {}, P = window.__WORLD_BASES;
        let stored = null; try { stored = JSON.parse(localStorage.getItem('bohemia.world.v1') || 'null'); } catch (e) {}
        const town = S.town || S.place || (LOOP.open && LOOP.open.name) || null;
        return { ws: WORLD_SEED, from: WORLD_SEED_FROM, stored, at: F.at, world: F.world, town, open: LOOP.open && LOOP.open.name, match: !!P && JSON.stringify(P.bases) === JSON.stringify(bs), bases: Object.keys(bs) }; });
      starts.push(r);
      ok('N7 new game ' + (k + 1) + ': the typed code is the game\'s', r.ws === 'K7QM9X' && r.from === 'typed', r.ws + ' ' + r.from);
      ok('N7 new game ' + (k + 1) + ': it is saved with the game', !!r.stored && r.stored.code === 'K7QM9X');
      ok('N7 new game ' + (k + 1) + ': the bases are the code\'s and he starts in one of its towns', r.match && !!r.open && r.bases.indexOf(r.open) >= 0, (r.open || '-') + ' at ' + (r.at || []).join(','));
      errs.push(...(d.errs || []));
      if (k === 0) {
        /* the game opens again on the same phone, once it has saved: the same code, the same bases (the save engine's own slots) */
        const saved = () => d.page.evaluate(() => ['bohemia_city_save.a', 'bohemia_city_save.b', 'bohemia_city_save'].some(k => { const v = localStorage.getItem(k); return !!v && v !== '{"bohemia":"DEAD"}'; })).catch(() => false);
        for (let i = 0; i < 60 && !(await saved()); i++) await d.page.waitForTimeout(500);
        const before = await d.fr.evaluate(() => JSON.stringify(ctBases()));
        const e = await open({ again: d, fog: true });
        await ready(e.fr);
        const r2 = await e.fr.evaluate(() => ({ ws: WORLD_SEED, from: WORLD_SEED_FROM, bs: JSON.stringify(ctBases()) }));
        ok('N7 the game opened again on the same phone keeps its valley (the code is saved with the game)', r2.ws === 'K7QM9X' && r2.from === 'saved' && r2.bs === before, r2.ws + ' ' + r2.from);
      }
    } catch (e) { ok('N7 new game ' + (k + 1) + ' measured', false, String(e && e.message || e).slice(0, 200)); }
    await d.browser.close().catch(() => {}); try { d.server.close(); } catch (_e) {}
  }
  if (starts.length === 2) ok('N7 the same code twice: the same corner and the same town', JSON.stringify(starts[0].at) === JSON.stringify(starts[1].at) && starts[0].open === starts[1].open,
    (starts[0].at || []).join(',') + ' ' + starts[0].open + ' / ' + (starts[1].at || []).join(',') + ' ' + starts[1].open);

  if (SHOTS && shots.length === 2) {
    try { require('child_process').execFileSync('python3', ['-c', [
      'import sys; from PIL import Image, ImageDraw',
      'a=Image.open(sys.argv[1]).convert("RGB"); b=Image.open(sys.argv[2]).convert("RGB")',
      'w=a.width+b.width+12; h=max(a.height,b.height)+30; o=Image.new("RGB",(w,h),(8,8,8)); o.paste(a,(0,30)); o.paste(b,(a.width+12,30))',
      'd=ImageDraw.Draw(o); d.text((8,8),"SEED "+sys.argv[3],fill=(220,230,200)); d.text((a.width+20,8),"SEED "+sys.argv[4],fill=(220,230,200)); o.save(sys.argv[5])'].join('\n'),
      shots[0][1], shots[1][1], W.show(shots[0][0]), W.show(shots[1][0]), path.join(SHOTS, 'seeds.png')]); console.log('  side by side: ' + path.join(SHOTS, 'seeds.png')); }
    catch (e) { console.log('  (side by side not made: ' + String(e.message).slice(0, 120) + ')'); }
  }
  const real = errs.filter(e => !/favicon|net::ERR|404/.test(String(e)));
  ok('N8 nothing threw', !real.length, real.slice(0, 3).join(' | ').slice(0, 300));
  done();
})().catch(e => { console.error(e); process.exit(1); });
