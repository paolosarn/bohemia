/* ==========================================================================
   THE MAP IS HOW YOU TRAVEL  (RUN, 9/28/26, VAMILY [bb map] + [no city walk])

   PAOLO 9/24, rule 33: "the valley is crossed on a map the Battle Brothers way: a
   party marker, tap where to go, time passes, roads faster than dirt."
   PAOLO 9/28, rule 38: "your character moving tile to tile throughout the city,
   it's not gonna be like that anymore, that has to change immediately."
   Rule 38c, the demo: LOADING, TRAVEL on the map, ARRIVAL, THE FIGHT, THE FIRST
   PERSON; nothing in it walks the city.

   MEASURED ON THE GLASS BEFORE ANY OF IT WAS BUILT (records/BOHEMIA_BB_MAP_SCHOOL_
   9_28_26.md): seven of the nine map behaviours already existed on the far view.
   The two that did not: A TAP ON THE MAP DID NOT TRAVEL (it selected a builder plot
   the demo had stripped, so it answered nothing; CB.sel [27,35], he moved 0 cells)
   and THE CLOCK WAS FLAT (a typed advance(10) per cell, so a freeway cost what a dry
   wash cost). And the demo opened on the walked street.

   WHAT THIS HOLDS, every leg through a real finger on the baked demo:
     the demo opens ON THE MAP, with no squeeze;
     the walk pad and DROP IN are not on the demo's screen;
     a road cell costs less than a dirt cell, and both are the street's own numbers;
     a tap on the map sets a route and the marker walks it on the beat;
     every travelled cell charges exactly its own terrain's minutes;
     a short journey ARRIVES and says so;
     a second tap stops a journey;
     a spread on the demo's map never drops him onto a walked street;
     a fight ends the journey at the door every fight comes through.

   node gates/the_map_is_how_you_travel_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const drive = require(path.join(__dirname, '..', 'tools', 'bohemia_drive_the_demo.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const say = (s) => console.log('  ' + s);
const done = () => {
  console.log('THE MAP IS HOW YOU TRAVEL: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
};

(async () => {
  const WORLD = fs.readFileSync(path.join(__dirname, '..', 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  const CUTTER = fs.readFileSync(path.join(__dirname, '..', 'tools/bohemia_cut_the_demo.js'), 'utf8');
  ok('the map step is not a typed ten minutes any more', !/city\.x=nx; city\.y=ny; advance\(10\)/.test(WORLD));
  ok('the map step reads the street\'s own baseline and road factor (one number, one place)',
     /function cityStepMins[\s\S]{0,400}MIN_PER_CELL[\s\S]{0,300}PAVED_SPEED\.factor/.test(WORLD));
  ok('the cutter strips the walk pad and DROP IN from the demo', /#nav\{display:none !important\}/.test(CUTTER));

  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr;
  try {
    await d.page.waitForTimeout(1500);

    /* 1. THE DEMO OPENS ON THE MAP */
    const st0 = await d.state();
    say('the demo opened in mode ' + st0.mode + ' (no squeeze was made)');
    ok('*** THE DEMO OPENS ON THE MAP, not on a walked street ***', st0.mode === 'city');

    /* 2. NO PAD, NO DROP IN, on the glass */
    const nav = await fr.evaluate(() => {
      const n = document.getElementById('nav'); if (!n) return { gone: true };
      const r = n.getBoundingClientRect();
      return { d: getComputedStyle(n).display, w: Math.round(r.width), h: Math.round(r.height) };
    });
    say('the walk pad and DROP IN: ' + JSON.stringify(nav));
    ok('the walk pad and DROP IN are not on the demo\'s screen',
       nav.gone || nav.d === 'none' || (nav.w === 0 && nav.h === 0));

    /* 3. ROADS FASTER THAN DIRT, from the game's own table */
    const sp = await fr.evaluate(() => {
      const n = om.n | 0, out = {};
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        const t = om.at(x, y); if (!t || !cityWalkable(x, y) || out[t.district] != null) continue;
        out[t.district] = cityStepMins(x, y);
      }
      return { per: out, base: MIN_PER_CELL * FN, factor: PAVED_SPEED.factor };
    });
    say('minutes per block: ' + Object.keys(sp.per).map(k => k + ' ' + sp.per[k].toFixed(2)).join(', '));
    const road = sp.per.freeway != null ? sp.per.freeway : sp.per.arterial;
    const dirt = sp.per.wash;
    ok('a road block costs less than a dirt block (' + (road || 0).toFixed(2) + ' < ' + (dirt || 0).toFixed(2) + ')',
       road != null && dirt != null && road < dirt);
    ok('and both are the street\'s numbers: dirt = FN x MIN_PER_CELL, road = that x the road factor',
       Math.abs(dirt - sp.base) < 1e-9 && Math.abs(road - sp.base * sp.factor) < 1e-9);

    /* WATCH THE GAME, NOT THE FINGER: every step the map takes, with what it cost. */
    await fr.evaluate(() => {
      window.__TRIPS = [];
      const realAdv = window.advance;
      window.advance = function (m) { window.__LASTADV = m; return realAdv.apply(this, arguments); };
      const realStep = window.stepOnce;
      window.stepOnce = function (di) {
        const bx = city.x, by = city.y; window.__LASTADV = null;
        const r = realStep.apply(this, arguments);
        if (MODE === 'city' && (city.x !== bx || city.y !== by))
          window.__TRIPS.push({ x: city.x, y: city.y, paid: window.__LASTADV, owed: cityStepMins(city.x, city.y) });
        return r;
      };
      window.__HANDS = 0;
      const realHand = window.cityHandOver;
      window.cityHandOver = function () { window.__HANDS++; return realHand.apply(this, arguments); };
      /* the road director is left alone: whatever the road does is part of travelling */
    });

    /* FIND A SHORT JOURNEY ON THE SCREEN, the way a thumb would: a point whose block
       can be stood on and is three to six blocks of route away. */
    const near = await fr.evaluate(() => {
      const c = document.getElementById('cv'), r = c.getBoundingClientRect();
      const kx = (window.CVW || c.width) / r.width, ky = (window.CVH || c.height) / r.height;   /* CSS pixels: the backing store is the phone pixels on the map (10/1) */
      let best = null;
      for (let sy = 60; sy < r.height - 60; sy += 9) for (let sx = 20; sx < r.width - 20; sx += 9) {
        const cell = CBcellAt(sx * kx, sy * ky); if (!cell || !cityWalkable(cell[0], cell[1])) continue;
        const p = cityRoute(city.x, city.y, cell[0], cell[1]); if (!p) continue;
        const L = p.length - 1;
        if (L >= 3 && L <= 6 && (!best || L > best.L)) best = { x: r.x + sx, y: r.y + sy, L: L, to: cell };
      }
      return best;
    });
    ok('the map has a place three to six blocks away to tap', !!near);
    if (!near) { await d.close(); return done(); }
    say('tapping a block ' + near.L + ' blocks of road away at ' + JSON.stringify(near.to));
    const min0 = await fr.evaluate(() => DAY.min);
    await d.tapAt(near.x, near.y);
    await d.page.waitForTimeout(400);
    const set = await fr.evaluate(() => TRAVEL ? { len: TRAVEL.path.length, to: TRAVEL.to } : null);
    ok('*** A TAP ON THE MAP SETS A JOURNEY *** (it used to select an invisible plot)', !!set);
    let arrived = false, line = '';
    for (let k = 0; k < 12; k++) {
      await d.page.waitForTimeout(700);
      const s = await fr.evaluate(() => ({ t: !!TRAVEL, h: window.__HANDS,
        line: (document.getElementById('packline') || {}).textContent || '' }));
      line = s.line;
      if (!s.t) { arrived = !s.h; break; }
    }
    const trips = await fr.evaluate(() => window.__TRIPS.slice());
    const min1 = await fr.evaluate(() => DAY.min);
    const hands = await fr.evaluate(() => window.__HANDS);
    say('the marker took ' + trips.length + ' steps on its own; the clock went '
        + min0.toFixed(1) + ' -> ' + min1.toFixed(1) + '; fights on the way: ' + hands);
    say('the map said: "' + line + '"');
    ok('the marker walked the route on its own, one block a beat', trips.length >= 3 || hands > 0);
    const wrong = trips.filter(t => t.paid == null || Math.abs(t.paid - t.owed) > 1e-9);
    ok('*** EVERY TRAVELLED BLOCK CHARGED EXACTLY ITS OWN GROUND\'S MINUTES *** ('
       + (trips.length - wrong.length) + ' of ' + trips.length + (wrong.length ? '; off: ' + JSON.stringify(wrong.slice(0, 3)) : '') + ')', trips.length > 0 && wrong.length === 0);
    if (hands === 0) {
      ok('*** THE SHORT JOURNEY ARRIVED *** and said so', arrived && /^Arrived/.test(line));
      const at = await fr.evaluate(() => [city.x, city.y]);
      ok('and he stands where the route ended', !!set && at[0] === set.to[0] && at[1] === set.to[1]);
    } else {
      say('a road party met him on the way; the journey was cut short by a fight, which is travelling');
      ok('and the fight ended the journey', !(await fr.evaluate(() => !!TRAVEL)));
    }

    /* A SECOND TAP STOPS A JOURNEY (volume 01's right-click) -- on a long route */
    if (hands === 0) {
      const far = await fr.evaluate(() => {
        const c = document.getElementById('cv'), r = c.getBoundingClientRect();
        const kx = (window.CVW || c.width) / r.width, ky = (window.CVH || c.height) / r.height;   /* CSS pixels: the backing store is the phone pixels on the map (10/1) */
        let best = null;
        for (let sy = 60; sy < r.height - 60; sy += 13) for (let sx = 20; sx < r.width - 20; sx += 13) {
          const cell = CBcellAt(sx * kx, sy * ky); if (!cell || !cityWalkable(cell[0], cell[1])) continue;
          const p = cityRoute(city.x, city.y, cell[0], cell[1]); if (!p) continue;
          if (!best || p.length > best.L) best = { x: r.x + sx, y: r.y + sy, L: p.length };
        }
        return best;
      });
      if (far) {
        await d.tapAt(far.x, far.y);
        await d.page.waitForTimeout(1200);
        const going = await fr.evaluate(() => !!TRAVEL);
        await d.tapAt(far.x, far.y);
        await d.page.waitForTimeout(700);
        const at1 = await fr.evaluate(() => [city.x, city.y, !!TRAVEL, window.__HANDS]);
        await d.page.waitForTimeout(1500);
        const at2 = await fr.evaluate(() => [city.x, city.y]);
        if (at1[3] === 0) {
          ok('a second tap stops a journey where it stands',
             going && !at1[2] && at1[0] === at2[0] && at1[1] === at2[1]);
        } else say('(a road party met him before the second tap; the stop leg is left to the fight leg)');
      }
    }

    /* A SPREAD ON THE DEMO'S MAP NEVER DROPS HIM ON A WALKED STREET */
    if (await fr.evaluate(() => MODE === 'city' && !document.hidden)) {
      await d.pinchIn(); await d.pinchIn();
      const m = await fr.evaluate(() => MODE);
      say('after two spreads on the demo\'s map: mode ' + m);
      ok('*** A SPREAD ON THE DEMO\'S MAP DOES NOT PUT HIM ON A WALKED STREET ***', m === 'city');
    }

    /* A FIGHT ENDS THE JOURNEY, at the one door. Last, because it opens a fight. */
    const fightStops = await fr.evaluate(() => {
      TRAVEL = { path: [[city.x, city.y], [city.x, city.y]], i: 1, cells: 0, mins: 0, to: [city.x, city.y] };
      try { cityHandOver({ type: 'BOHEMIA_GATE_NOT_A_FIGHT' }); } catch (_e) {}
      return TRAVEL === null;
    });
    ok('a fight ends the journey at the door every fight comes through', fightStops);
    say('page errors: ' + d.errs.length);
    ok('nothing threw', d.errs.length === 0);
    await d.close();
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
    try { await d.close(); } catch (_e) {}
  }
  done();
})();
