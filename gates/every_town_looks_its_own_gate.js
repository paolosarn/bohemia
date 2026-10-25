#!/usr/bin/env node
/* EVERY TOWN LOOKS ITS OWN (COOK [every town looks its own], rule 186(b), and line 8 of his list, rule 154). Paolo 10/25: 'every
   settlement has to look unique and different a little bit; they can borrow from each other, especially if they're in the same
   tier, but still they look the same... a settlement that's deep in the heart of the city should give more city vibes'; and,
   asked many times, the towns sit in the ground, never a sticker (EYES 10/25: 'Blues on the map is a flag and a lot inside the
   blocks'). The demo's map (the one driver, the fog lifted), every home base and every place on the region's land drawn ALONE by
   the game's own painter (tools/bohemia_cook_every_town_its_own_10_25_26.js LIKENESS: the town's blocks, its streets and what is
   not the town cut away) and compared pair by pair: likeness = 0.35 its colours (off the picture) + 0.35 what stands there (the
   share of its ground under each kind of thing, its landmark and variant their own kind) + 0.15 its heights + 0.15 how full.
     1. NO TWO TOWNS READ THE SAME: every pair of the 48 under 0.85.
     2. THE MEASURE BITES: a TWIN of three towns (the same rules, blocks, faction, trade, palette and landmark, only its lots
        rolled again) scores 0.85 or more against its town: two towns made the same way are caught.
     3. EVERY TOWN IS BUILT: every one has its plan, its own landmark, and its lots carry at least 0.55 of the ground a lot can
        stand on (inside its wall, off its streets): a town, never a lot round a flag.
     4. THE HEART LOOKS LIKE THE CITY: the towns deep in it (u >= 0.6) stand at least twice as tall (their lots, the landmark aside) as the towns at its edge
        (u < 0.3), and their ground is mostly boxes of concrete; the edge's mostly not.
     5. NO FLAG STANDS IN FOR A TOWN: the map drawn on Blues at the opening and the near stops draws the town painted in its
        blocks and no flag over any painted town.
     6. NO RAINBOW, NEVER GREY (rule 159, 167(b)): every town's median colour (chroma, the picture's own a/b) between 2 and 16.
   Measured before (BUILD 10/25, the towns painted in by a6e1ad1d): the most alike pair Anarchists ~ Blues 0.958 on colour and
   edges alone, eight pairs over 0.91; a flag on every painted town; camps a cleared lot.
   Run: node gates/every_town_looks_its_own_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { LIKENESS } = require(path.join(ROOT, 'tools/bohemia_cook_every_town_its_own_10_25_26.js'));
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
(async () => {
  const d = await D.open({ fog: false });
  try {
    for (let i = 0; i < 160; i++) {
      const ok = await d.fr.evaluate(() => { try { if (typeof vbReady === 'function') vbReady(); return !!(VB && VB.day && VBC && VBC.day && VB_TOWNS.list && VBC.key && VBC.key.indexOf(':t') >= 0); } catch (e) { return false; } });
      if (ok) break; await d.page.waitForTimeout(500);
    }
    const L = await d.fr.evaluate(LIKENESS);
    const T = L.towns, P = L.pairs, top = P[0] || {};
    leg(T.length >= 40 && P.length && top.like < 0.85, '*** NO TWO TOWNS READ THE SAME *** (every pair of ' + T.length + ' under 0.85; it was 0.958 between Anarchists and Blues)',
      P.slice(0, 4).map(p => p.a + ' ~ ' + p.b + ' ' + p.like).join(', '));
    leg(L.twins.length >= 3 && L.twins.every(p => p.like >= 0.85), 'the measure bites: a town built twice the same way (only its lots rolled again) scores 0.85 or more',
      L.twins.map(p => p.a + ' ~ ' + p.b + ' ' + p.like).join(', '));
    const home = T.filter(t => !t.region), trades = home.map(t => t.trade);
    leg(T.every(t => t.lots >= 1 && t.mark) && new Set(trades).size === trades.length, 'every town has its plan and its own landmark; no two home bases share a trade',
      home.map(t => t.name + ' ' + t.mark).join(', '));
    const thin = T.filter(t => t.filled < 0.55);
    leg(!thin.length, '*** A TOWN, NEVER A LOT ***: its lots carry at least 0.55 of the ground a lot can stand on, every town', thin.length ? thin.map(t => t.name + ' ' + t.filled).join(', ') : 'least ' + Math.min(...T.map(t => t.filled)));
    const heart = home.filter(t => t.u >= 0.6), edge = home.filter(t => t.u < 0.3), mh = a => a.reduce((s, t) => s + t.meanH, 0) / (a.length || 1);
    const boxShare = t => { const k = t.kinds || {}, n = Object.values(k).reduce((s, v) => s + v, 0) || 1; return (k.box || 0) / n; };
    leg(heart.length >= 2 && edge.length >= 3 && mh(heart) >= 2 * mh(edge) && heart.every(t => boxShare(t) >= 0.5) && edge.every(t => boxShare(t) < 0.5),
      '*** THE HEART LOOKS LIKE THE CITY ***: the towns deep in it stand twice as tall as the edge\'s, mostly concrete boxes; the edge\'s not',
      'heart ' + heart.map(t => t.name).join('/') + ' ' + mh(heart).toFixed(1) + ' T, edge ' + edge.map(t => t.name).join('/') + ' ' + mh(edge).toFixed(1) + ' T');
    const F = await d.fr.evaluate(async () => {
      let flags = 0; const o = mapFlagDraw; window.mapFlagDraw = mapFlagDraw = function (px, fy, tall, col, beat, moving) { if (!moving) flags++; return o.apply(this, arguments); };
      const b = ctBases().Blues || ctBases()[Object.keys(ctBases())[0]], out = [];
      for (const z of [1, zoomBounds()[1]]) {
        CZOOM = z; TW = TW0 * CZOOM; TH = TH0 * CZOOM; try { camLetGo(); } catch (_e) {}
        const put = () => { panX = ((city.x - city.y) - (b.x - b.y)) * TW / 2; panY = ((city.x + city.y) - (b.x + b.y + 1)) * TH / 2; };
        flags = 0; put(); MAP_GROUND.key = ''; render();
        for (let i = 0; i < 30; i++) { await new Promise(r => setTimeout(r, 200)); put(); MAP_GROUND.key = ''; flags = 0; render(); if (!VBT.busy && !VBT.want) break; }
        out.push({ z: +z.toFixed(2), flags: flags, painted: MAP_DREW && MAP_DREW.art ? MAP_DREW.art.painted | 0 : 0, blues: !!vbTownPainted('Blues') });
      }
      window.mapFlagDraw = mapFlagDraw = o; return out;
    });
    leg(F.every(f => f.flags === 0 && f.painted > 0 && f.blues), '*** NO FLAG STANDS IN FOR A TOWN *** (it stood over every painted town): the town is its blocks, its name and its people at the gate say whose',
      F.map(f => 'zoom ' + f.z + ': ' + f.flags + ' flags, ' + f.painted + ' towns painted in').join('; '));
    const off = T.filter(t => !(t.chroma >= 2 && t.chroma <= 16));
    leg(!off.length, 'no rainbow, never grey (rules 159, 167(b)): every town\'s median colour between 2 and 16', off.length ? off.map(t => t.name + ' ' + t.chroma).join(', ') : 'from ' + Math.min(...T.map(t => t.chroma)) + ' to ' + Math.max(...T.map(t => t.chroma)));
    leg(!L.err && !d.errs.length, 'no page error, no town look error', (L.err || '') + (d.errs[0] || ''));
  } catch (e) { leg(false, 'the gate ran', String(e && e.message || e).slice(0, 200)); }
  finally { await d.close(); }
  console.log('=== EVERY TOWN LOOKS ITS OWN: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
