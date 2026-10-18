/* ==========================================================================
   THE MAP HAS ITS PEOPLE  (RUN, 9/29/26, VAMILY [bb map] + [map pixels], rule 40f)

   PAOLO 9/29, with a screenshot of the map: "I should def be seeing the player
   character on this screen bro all those little circles should be icons or people."
   And 9/22, the same screen: "Why do I not see my person on this map?"

   MEASURED ON THE DEMO BEFORE THE CHANGE: 13 cream rings (people clusters), 14
   hollow gold diamonds (home bases), 0 parties drawn (28 exist), and him as a pin
   with a white head. AND THE 28 PARTIES NEVER MOVED IN DAYLIGHT: a map block is 0.93
   of a party step and a street step 0.008, and the mover floored every call to zero,
   so five game hours moved 0 of 28 a single cell.

   WHAT THIS HOLDS, on the baked demo that opens on the map:
     HE IS DRAWN AS HIMSELF: his own baked rig, not a symbol, exactly once a frame,
       the biggest figure on the map, and the SAME SIZE at every zoom.
     NO CIRCLE IS LEFT: every people cluster is drawn as a crowd, every home base as
       the building of its tier (fortress, town, camp), and the ring code is gone.
     THE PARTIES ARE ON THE ROAD: after five game hours they have left home and are
       drawn where they are.
     THE ART IS COOK'S, BYTE FOR BYTE: the embed equals the two banks it came from.

   node gates/the_map_has_its_people_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const drive = require(path.join(__dirname, '..', 'tools', 'bohemia_drive_the_demo.js'));
const ROOT = path.join(__dirname, '..');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const say = s => console.log('  ' + s);
const done = () => { console.log('THE MAP HAS ITS PEOPLE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

(async () => {
  const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

  /* A. THE SOURCE */
  const m = CITY.match(/var MAP_ART = (\{.*?\});\n/);
  ok('the map carries COOK\'s art', !!m);
  if (m) {
    const art = JSON.parse(m[1]);
    const mk = JSON.parse(fs.readFileSync(path.join(ROOT, 'banks/BOHEMIA_THE_MAP_MARKERS_9_24_26.txt'), 'utf8'));
    const pb = JSON.parse(fs.readFileSync(path.join(ROOT, 'banks/BOHEMIA_THE_PARTIES_ON_THE_MAP_9_27_26.txt'), 'utf8'));
    const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    let drift = [];
    if (!same(art.pal, mk.palette)) drift.push('palette');
    for (const k in mk.markers) {
      const a = art.mk[k], b = mk.markers[k];
      if (!a || !same(a.body, b.body) || !same(a.part, b.part)) drift.push(k);
    }
    for (const k in pb.shapes) {
      const a = art.sh[k], b = pb.shapes[k];
      if (!a || !same(a.body, b.body) || !same(a.part, b.part)) drift.push(k);
    }
    for (const k in pb.parties) {
      const a = art.fac[k], b = pb.parties[k];
      if (!a || a.shape !== b.shape || a.banner !== b.banner) drift.push(k);
    }
    ok('*** THE ART IS COOK\'S, BYTE FOR BYTE *** (the embed equals both banks'
       + (drift.length ? '; drifted: ' + drift.join(', ') : '') + ')', drift.length === 0);
  }
  ok('the cream settlement ring is gone from the map (no bare circle is drawn)',
     !/g\.fillStyle = '#f4ead2'; g\.fill\(\);/.test(CITY));
  ok('and the hollow gold diamond is gone from the home bases',
     !/g\.lineTo\(__p\.sx - __r, __cy\);\s*g\.closePath\(\); g\.stroke\(\);/.test(CITY));
  ok('the parties\' clock carries its remainder instead of flooring it away',
     /PARTIES_CARRY \+= partiesCellsPerDay\(\)/.test(CITY));

  let d;
  try { d = await drive.open({ keepCards: true }); }
  catch (e) { ok('the demo boots [' + String(e.message).slice(0, 120) + ']', false); return done(); }
  const fr = d.fr;
  try {
    await d.page.waitForTimeout(1500);
    await fr.waitForFunction(() => typeof PARTIES !== 'undefined' && !!PARTIES, null, { timeout: 60000 }).catch(() => {});
    ok('the demo is on the map', await fr.evaluate(() => MODE === 'city'));

    /* B. HIM */
    const drewAt = () => fr.evaluate(() => { render(); return JSON.parse(JSON.stringify(MAP_DREW)); });
    const z1 = await drewAt();
    say('him: ' + JSON.stringify(z1.you) + ', drawn ' + z1.youCount + ' time(s) this frame');
    ok('*** HE IS DRAWN AS HIMSELF, HIS OWN BAKED BODY, NOT A SYMBOL ***', !!z1.you && z1.you.how === 'rig');
    ok('and exactly once', z1.youCount === 1);
    const biggest = await fr.evaluate(() => {
      let h = 0;
      for (const k in MAP_ART.mk) if (k !== 'YOU') h = Math.max(h, mapArtSprite(MAP_ART.mk[k], 0, null).height);
      for (const k in MAP_ART.sh) h = Math.max(h, mapArtSprite(MAP_ART.sh[k], 0, null).height);
      return h;
    });
    ok('*** HE IS THE BIGGEST FIGURE ON THE MAP *** (' + (z1.you && z1.you.h) + ' px against the tallest marker\'s ' + biggest + ')',
       !!z1.you && z1.you.h >= biggest * 1.5);
    /* one size at every zoom: the ground may zoom, the person may not */
    const sizes = [];
    for (const zz of [0.6, 1.0, 1.8]) {
      await fr.evaluate(z => setZoomAt(z), zz);
      const q = await drewAt();
      sizes.push(q.you ? q.you.w + 'x' + q.you.h : 'none');
    }
    await fr.evaluate(() => setZoomAt(1));
    ok('and he is ONE SIZE at every zoom (' + sizes.join(', ') + ')', new Set(sizes).size === 1 && sizes[0] !== 'none');

    /* C. NO CIRCLES: people and buildings */
    const c = await fr.evaluate(() => { render(); return { drew: JSON.parse(JSON.stringify(MAP_DREW)), marks: window.__PPL_MARKS | 0 }; });
    const places = c.drew.places || {};
    say('crowds ' + c.drew.crowds + ' (people clusters on screen ' + c.marks + '), buildings ' + JSON.stringify(places));
    ok('*** EVERY PEOPLE CLUSTER ON SCREEN IS DRAWN AS A CROWD *** (' + c.drew.crowds + ' of ' + c.marks + ')',
       c.marks > 0 && c.drew.crowds === c.marks);
    const kinds = Object.keys(places).filter(k => places[k] > 0);
    ok('*** EVERY HOME BASE ON SCREEN IS A BUILDING OF ITS TIER *** (' + kinds.join(', ') + ')',
       kinds.length >= 2 && kinds.every(k => ['fortress', 'town', 'camp'].indexOf(k) >= 0));
    /* C2. THE ICONS ARE THE GAME'S OWN ART (RUN 10/1; PAOLO: "the icons fucking suck ass"). A crowd
       is three of the street's own dressed people, a base its tier's own building from the art the
       ground is painted with. Counted by the render as it draws them, not guessed from pixels. */
    const art = c.drew.art || {};
    const nBases = kinds.reduce((n, k) => n + (places[k] || 0), 0);
    ok('*** EVERY CROWD IS THREE OF THE GAME\'S OWN PEOPLE *** (' + (art.crowdPeople | 0) + ' people for ' + c.drew.crowds + ' crowds)',
       c.drew.crowds > 0 && art.crowdPeople === c.drew.crowds * 3);
    ok('*** EVERY HOME BASE IS ITS TIER\'S OWN BUILDING *** (' + (art.buildings | 0) + ' of ' + nBases + ')',
       nBases > 0 && art.buildings === nBases);

    /* D. THE PARTIES ARE ON THE ROAD */
    const moved = await fr.evaluate(() => {
      const ps = partiesAll() || [];
      const a = ps.map(p => p.at.x + ',' + p.at.y);
      for (let i = 0; i < 30; i++) advance(10);
      const b = ps.map(p => p.at.x + ',' + p.at.y);
      render();
      return { n: ps.length, moved: a.filter((v, i) => v !== b[i]).length, drawn: MAP_DREW.parties };
    });
    say('five game hours: ' + moved.moved + ' of ' + moved.n + ' parties moved; ' + moved.drawn + ' drawn on screen');
    ok('*** THE PARTIES MOVE IN DAYLIGHT *** (' + moved.moved + ' of ' + moved.n + '; it was 0)', moved.moved >= moved.n / 2);
    ok('*** AND THEY ARE DRAWN ON THE ROAD *** (' + moved.drawn + ')', moved.drawn > 0);
    const pp = await fr.evaluate(() => { render(); return { parties: MAP_DREW.parties, people: (MAP_DREW.art || {}).partyPeople | 0 }; });
    ok('*** AND EVERY CREW ON THE ROAD IS TWO OF THE GAME\'S OWN PEOPLE UNDER A FLAG *** (' + pp.people + ' people for ' + pp.parties + ' crews)',
       pp.parties > 0 && pp.people === pp.parties * 2);

    /* E. HE WALKS WHEN HE TRAVELS */
    const walk = await fr.evaluate(() => {
      const c2 = document.getElementById('cv'), r = c2.getBoundingClientRect();
      const kx = (window.CVW || c2.width) / r.width, ky = (window.CVH || c2.height) / r.height;   /* CSS pixels (10/1) */
      for (let sy = 80; sy < r.height - 80; sy += 13) for (let sx = 30; sx < r.width - 30; sx += 13) {
        const cell = CBcellAt(sx * kx, sy * ky); if (!cell || !cityWalkable(cell[0], cell[1])) continue;
        const p = cityRoute(city.x, city.y, cell[0], cell[1]);
        if (p && p.length - 1 >= 4 && p.length - 1 <= 8) { travelTo(sx * kx, sy * ky); return true; }
      }
      return false;
    });
    await d.page.waitForTimeout(900);
    const w = await fr.evaluate(() => { render(); return MAP_DREW.you; });
    ok('while he travels he is drawn walking, facing the way he goes (' + (w && (w.moving + ' ' + w.face)) + ')',
       walk && !!w && w.moving === true && w.how === 'rig');

    ok('nothing threw (' + d.errs.length + ')', d.errs.length === 0);
    await d.close();
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 160) + ']', false);
    try { await d.close(); } catch (_e) {}
  }
  done();
})();
