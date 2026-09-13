/* IS THE ONE COMING FOR YOU DRESSED? (9/13/26, CHARACTER lane,
 * VAMILY [enemy dressed] A-HOSTILE-WEARS-ITS-FACTION)
 *
 * THE ROW: "hostiles walk the street now and PEOPLE shipped outfits at spawn; every hostile
 * wears its faction's colour and the runway cut, so WHO IS COMING FOR YOU IS READABLE FROM
 * THE CLOTHES (COLOUR IS TERRITORY, the style card)."
 *
 * MEASURED BEFORE ANYTHING IS BUILT, because this lane has thrown away seven rulers in four
 * rounds and every one of them was a number taken on trust. The row asserts three things and
 * none of them has ever been checked on the walked surface:
 *   1. THERE ARE HOSTILES. How many, out of how many bodies the renderer actually blitted?
 *   2. A HOSTILE HAS A FACTION. Hostility and allegiance are different facts -- ctAgainstMe
 *      answers the first, ctFactionOf the second -- and nothing says they travel together.
 *   3. THE HOSTILE IS WEARING IT. ctBody prefers the faction body over the trade fit, so a
 *      hostile with a faction SHOULD be in its outfit. Whether it is, is a picture question.
 *
 * AND THE ROW'S OWN SENTENCE HIDES THE INTERESTING CASE. "Every hostile wears its faction's
 * colour" is only meaningful for a hostile that HAS a faction. A hostile who runs with
 * nobody is not a faction soldier, it is somebody who has a problem with you personally, and
 * dressing them in a flag would be inventing an allegiance the game does not model. So this
 * counts those separately instead of calling them misses, the same way round 1 of [faction
 * colour] refused to call civilians misses.
 *
 * THE 9/6 VALUE STEP IS IN THIS PATH. [stands out] puts a hostile one value step off the
 * civilians around it, and 9/12 proved that step holds hue exactly. So a hostile in its
 * faction's colour should still read as that colour, and this checks it on the real street
 * rather than on a bench.
 *
 * RIG CHECK (RIG IS LAW): reads only. REUSE CHECK: cooks zero pixels -- the crowd harness is
 * [stands out]'s, the hostility answer is the city's own, the colours are his published file.
 *
 *   node tools/bohemia_is_the_one_coming_for_you_dressed.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle: SETTLE } = require(path.join(__dirname, '..', 'gates', 'bohemia_settle.js'));
const REPO = path.dirname(__dirname);
const OUT = path.join(REPO, 'records/BOHEMIA_IS_THE_ONE_COMING_FOR_YOU_DRESSED_9_13_26.txt');

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('file://' + path.join(REPO, 'slices/BOHEMIA_DEMO.html'));
  await SETTLE(p, 15000);
  await p.evaluate(() => { const f = document.getElementById('fronttap') || document.getElementById('front'); if (f) f.click(); });
  await SETTLE(p, 12000);
  await new Promise(r => setTimeout(r, 3000));
  const fr = p.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
  if (!fr) { console.error('no city frame'); await b.close(); process.exit(1); }

  /* THE POPULATION SWEEP, which asks about EVERY person rather than only the handful the
     renderer happens to have on glass this frame. [faction colour] round 3 learned the
     coordinate spaces the hard way: pplPeople is keyed to the population grid, pplAt answers
     in FINE coords, and POWER answers in overmap CELLS. */
  const POP = await fr.evaluate(() => {
    const o = { probed: 0, hostile: 0, hostileWithFaction: 0, hostileNoFaction: 0,
                fids: {}, err: null };
    try {
      const NB = BohemiaPopulation.NB, span = NB * FN;
      const cx0 = Math.floor(hx / span), cy0 = Math.floor(hy / span);
      for (let ny = Math.max(0, cy0 - 8); ny <= cy0 + 8; ny++)
      for (let nx = Math.max(0, cx0 - 8); nx <= cx0 + 8; nx++) {
        let ppl = [];
        try { ppl = pplPeople(nx, ny) || []; } catch (e) { continue; }
        for (const q of ppl) {
          o.probed++;
          let h = 0, f = null;
          try { h = ctAgainstMe(q); } catch (e) {}
          try { f = ctFactionOf(q); } catch (e) {}
          if (h) {
            o.hostile++;
            if (f) { o.hostileWithFaction++; o.fids[f] = (o.fids[f] || 0) + 1; }
            else o.hostileNoFaction++;
          }
        }
      }
    } catch (e) { o.err = String(e.message).slice(0, 160); }
    return o;
  });

  /* AND THE PICTURE QUESTION, on the bodies the renderer actually put on glass: is the
     hostile holding its faction's sprite, or the trade fit? */
  const DREW = await fr.evaluate(async () => {
    const o = { drew: 0, hostile: 0, wearingFaction: 0, wantedButNotBaked: [], err: null };
    try {
      /* STAND WHERE THE CROWD IS FIRST. Rendering from wherever the harness happens to
         boot draws two bodies, and "0 hostiles on glass" out of a crowd of two is not a
         finding about the game, it is a finding about where I was standing. Same step
         [stands out] used: walk to the fullest neighbourhood and render there. */
      const NB = BohemiaPopulation.NB, span = NB * FN;
      const cx0 = Math.floor(hx / span), cy0 = Math.floor(hy / span);
      /* *** AND IT IS THE NEIGHBOURHOOD WITH THE MOST HOSTILES, NOT THE MOST PEOPLE. ***
         The first cut walked to the densest crowd and drew 183 bodies of whom ALL 183 ran
         with nobody, so it reported "0 hostiles on glass" about a street where no hostile
         lives. That is the same shape as [faction colour] round 3's whole lesson: the
         population and the territory are clustered differently, so WHERE YOU STAND DECIDES
         WHAT YOU CAN SEE. A row about hostiles has to be measured where the hostiles are. */
      let best = null;
      for (let ny = Math.max(0, cy0 - 6); ny <= cy0 + 6; ny++)
      for (let nx = Math.max(0, cx0 - 6); nx <= cx0 + 6; nx++) {
        let ppl = []; try { ppl = pplPeople(nx, ny) || []; } catch (e) { continue; }
        if (!ppl.length) continue;
        let hos = 0;
        for (const q of ppl) { try { if (ctAgainstMe(q)) hos++; } catch (e) {} }
        if (!best || hos > best.hos || (hos === best.hos && ppl.length > best.n))
          best = { n: ppl.length, hos: hos, ppl: ppl };
      }
      o.bestHostiles = best ? best.hos : 0;
      if (best) {
        const pts = best.ppl.map(q => { try { return pplAt(q); } catch (e) { return null; } }).filter(Boolean);
        if (pts.length) {
          const xs = pts.map(a => a[0]).sort((a, c) => a - c), ys = pts.map(a => a[1]).sort((a, c) => a - c);
          hx = xs[xs.length >> 1]; hy = ys[ys.length >> 1];
        }
      }
      o.stoodAt = [hx, hy];
      render();
      const want = {};
      for (let i = 0; i < BARK_DREW.length; i++) {
        const q = BARK_DREW[i].p;
        o.drew++;
        let h = 0, f = null;
        try { h = ctAgainstMe(q); } catch (e) {}
        try { f = ctFactionOf(q); } catch (e) {}
        o.drawnFids = o.drawnFids || {};
        o.drawnFids[f || '(nobody)'] = (o.drawnFids[f || '(nobody)'] || 0) + 1;
        if (!h) continue;
        o.hostile++;
        if (f) { want[f] = 1; if (CAST_FID[f]) o.wearingFaction++; else o.wantedButNotBaked.push(f); }
      }
      /* ask for anything missing and wait, the way the street itself does */
      Object.keys(want).forEach(f => { try { ctNeedFaction(f); } catch (e) {} });
      for (let t = 0; t < 12; t++) {
        await new Promise(r => setTimeout(r, 1000));
        if (Object.keys(want).every(f => CAST_FID[f])) break;
      }
      o.afterWait = Object.keys(want).filter(f => !CAST_FID[f]);
      o.asked = Object.keys(want);
      /* *** AND COUNT AGAIN AFTER THE BAKE LANDS, WHICH IS WHAT A PLAYER ACTUALLY SEES. ***
         The count above is taken on the FIRST frame a hostile appears, and on that frame
         CAST_FID is empty by design -- ctBody's own comment says so: "NO HOLE WHILE IT
         BAKES. The request goes out and this frame keeps drawing the trade fit, so the swap
         is a body getting MORE specific, never a person appearing out of nothing."
         Reporting that first frame as "0 hostiles wear their faction" would be true for
         about one second and false for the rest of the game, which is a worse lie than a
         wrong number. */
      render();
      o.afterDrew = 0; o.afterHostile = 0; o.afterWearing = 0;
      for (let i = 0; i < BARK_DREW.length; i++) {
        const q = BARK_DREW[i].p;
        o.afterDrew++;
        let h = 0, f = null;
        try { h = ctAgainstMe(q); } catch (e) {}
        try { f = ctFactionOf(q); } catch (e) {}
        if (!h) continue;
        o.afterHostile++;
        if (f && CAST_FID[f]) {
          /* AND IT IS THE FACTION SPRITE IN HIS HAND, not just a table entry: ask ctBody
             for the body it would actually draw and compare it against the faction set. */
          let dir = 'S'; try { dir = pplFace(q, BARK_DREW[i].at); } catch (e) {}
          let got = null; try { got = ctBody(q, dir); } catch (e) {}
          const set = CAST_FID[f], s2 = set && (set[dir] || set.S);
          const isFaction = !!(got && s2 && (got === s2.idle
            || (s2.breathe && s2.breathe.indexOf(got) >= 0)));
          if (isFaction) o.afterWearing++;
        }
      }
      /* AND WHETHER HOSTILITY EVEN CAN BE TRUE WHERE I AM STANDING. ctAgainstMe keys on
         the cell the PLAYER is on -- "crossing a border changes the answer in one step" --
         so walking to the fullest neighbourhood can itself change who is against me. */
      o.hereCell = [ (hx/FN)|0, (hy/FN)|0 ];
      o.relTo = {};
      try { ['Trades','Colorful','Homeless','Mob','Blues','Church'].forEach(function(fa){
        o.relTo[fa] = ctRelToMine(fa); }); } catch (e) { o.relErr = String(e.message).slice(0,120); }
    } catch (e) { o.err = String(e.message).slice(0, 160); }
    return o;
  });

  await b.close();

  const L = [];
  L.push('IS THE ONE COMING FOR YOU DRESSED? -- CHARACTER lane, 9/13/26');
  L.push('VAMILY row [enemy dressed] A-HOSTILE-WEARS-ITS-FACTION, round 1 (measurement)');
  L.push('');
  L.push('THE ROW SAYS: "every hostile wears its faction\'s colour and the runway cut, so who');
  L.push('is coming for you is readable from the clothes." It asserts three things and nobody');
  L.push('has checked any of them on the walked surface. Here they are.');
  L.push('');
  L.push('=== 1. ARE THERE HOSTILES AT ALL? (every person in a 17x17 neighbourhood block) ===');
  L.push('  people probed                    ' + POP.probed);
  L.push('  hostile to me                    ' + POP.hostile
    + '   ' + (POP.probed ? (100 * POP.hostile / POP.probed).toFixed(1) : '0') + '%');
  if (POP.err) L.push('  (threw: ' + POP.err + ')');
  L.push('');
  L.push('=== 2. DOES A HOSTILE HAVE A FACTION? ===');
  L.push('Hostility and allegiance are DIFFERENT FACTS and nothing says they travel together.');
  L.push('  hostile AND runs with somebody   ' + POP.hostileWithFaction
    + (POP.hostile ? '   ' + (100 * POP.hostileWithFaction / POP.hostile).toFixed(1) + '% of hostiles' : ''));
  L.push('  hostile and runs with NOBODY     ' + POP.hostileNoFaction);
  L.push('  THE SECOND GROUP IS NOT A MISS. A hostile with no faction is not a soldier, it is');
  L.push('  somebody with a problem with YOU, and putting a flag on them would invent an');
  L.push('  allegiance this game does not model.');
  if (Object.keys(POP.fids).length) {
    L.push('');
    L.push('  WHO THE ARMED ONES RUN WITH:');
    for (const k of Object.keys(POP.fids).sort((a, c) => POP.fids[c] - POP.fids[a]))
      L.push('      ' + k.padEnd(14) + String(POP.fids[k]).padStart(5));
  }
  L.push('');
  L.push('=== 3. IS THE HOSTILE ACTUALLY WEARING IT, on the bodies the renderer blitted? ===');
  L.push('  bodies drawn this frame          ' + DREW.drew);
  L.push('  of those, hostile                ' + DREW.hostile);
  L.push('  hostile holding its faction body ' + DREW.wearingFaction);
  if (DREW.asked && DREW.asked.length) {
    L.push('  faction bodies asked for         ' + DREW.asked.join(', '));
    L.push('  still not baked after 12s        ' + (DREW.afterWait.length ? DREW.afterWait.join(', ') : 'none'));
  }
  if (DREW.err) L.push('  (threw: ' + DREW.err + ')');
  L.push('');
  L.push('  *** AND AFTER THE BAKE LANDS, WHICH IS WHAT A PLAYER SEES: ***');
  L.push('  bodies drawn                     ' + DREW.afterDrew);
  L.push('  of those, hostile                ' + DREW.afterHostile);
  L.push('  hostile WEARING its faction      ' + DREW.afterWearing
    + (DREW.afterHostile ? '   ' + (100 * DREW.afterWearing / DREW.afterHostile).toFixed(0) + '%' : ''));
  L.push('  The first count above is the FIRST FRAME, when CAST_FID is empty by design --');
  L.push('  ctBody keeps drawing the trade fit so the swap is a body getting more specific,');
  L.push('  never a person appearing out of nothing. Reporting that frame as the answer');
  L.push('  would be true for one second and false for the rest of the game.');
  L.push('');
  L.push('  WHO THE DRAWN BODIES RUN WITH:');
  for (const k of Object.keys(DREW.drawnFids || {}).sort((a, c) => DREW.drawnFids[c] - DREW.drawnFids[a]))
    L.push('      ' + k.padEnd(14) + String(DREW.drawnFids[k]).padStart(5));
  L.push('  standing on cell ' + JSON.stringify(DREW.hereCell)
    + ', and this is how the valley feels about me from here:');
  for (const k in (DREW.relTo || {})) L.push('      ' + k.padEnd(14) + String(DREW.relTo[k]));
  if (DREW.relErr) L.push('      (threw: ' + DREW.relErr + ')');
  L.push('');
  L.push('=== WHAT THIS DOES NOT CLAIM ===');
  L.push('Nothing here has been fixed. This is the measurement the row needed before anybody');
  L.push('touched the picker, and it is written down first precisely because this lane has');
  L.push('thrown away seven rulers in four rounds and every one of them was a number somebody');
  L.push('trusted. If a count below looks impossible, suspect this tool before the game.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
})();
