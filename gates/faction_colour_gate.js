/* BOHEMIA — FACTION COLOUR GATE (8/26/26). FACTORY LAW: new law, own gate, same turn.
 *
 * laws/BOHEMIA_LAW_COLOUR_IS_TERRITORY_8_26_26.md, Paolo 8/26:
 *   "the colorful, like, that guy was not colorful, bro. Like, that shit was crazy ...
 *    people get shot in Los Angeles for wearing the wrong color or whatever ... when it
 *    comes down to how we wanna communicate, like, who would defend us"
 *
 * THE FOUR TESTS, all on RENDERED CLOTH PIXELS -- skin and the black outline removed, so
 * a suntan cannot pass for a flag and the 1px border cannot vote:
 *   1  COORDINATED     a faction's cloth agrees with itself
 *   2  SATURATED       a signal you can read, unless drabness IS the statement
 *   3  NOBODY ELSE'S   two factions may not own the same dominant hue
 *   4  THE NAME IS NOT A LIE   a faction named for a colour wears it
 *
 * WHAT THIS DELIBERATELY DOES NOT DO: rank colours, or decide who owns what. Which
 * faction owns which hue is HIS (MECHANISM-MINE / CONTENTS-PAOLO'S). The gate holds the
 * SHAPE of the law -- coordinated, saturated, unique, honest -- and never the contents.
 *
 * AND IT DOES NOT REPLACE STRUCTURE-NOT-COLOR. gates/faction_outfit_gate.js still holds
 * the silhouette set, which is what reads in a valley that opens at 06:00 in the dark.
 * Colour is the SECOND channel. If these two ever disagree, the silhouette wins.
 *
 *   node gates/faction_colour_gate.js
 */
'use strict';
const path = require('path');
const ALPHA = path.join(__dirname, '../slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('\n=== FACTION COLOUR GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS, { timeout: 30000 });
  ok('the alpha loads with zero page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);

  const R = await pg.evaluate(() => {
    const hsv = (r, g, bb) => { r /= 255; g /= 255; bb /= 255;
      const mx = Math.max(r, g, bb), mn = Math.min(r, g, bb), d = mx - mn;
      let h = 0;
      if (d) { if (mx === r) h = ((g - bb) / d) % 6; else if (mx === g) h = (bb - r) / d + 2; else h = (r - g) / d + 4;
        h *= 60; if (h < 0) h += 360; }
      return { h: h, s: mx ? d / mx : 0, v: mx }; };
    const keepW = window.G_WORN, keepE = G.equipped, keepV = G.bodyVar;
    const PD_OFF = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const out = [];
    for (const f of window.FACTION_LOOKS) {
      const eq = {}; for (const k in keepE) eq[k] = keepE[k];
      for (const s of PD_OFF) eq[s] = '';
      G.equipped = eq; G.bodyVar = f.dials; window.G_WORN = f.worn;
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const fr = buildFrame('S', 'idle', 0);
      const bins = {}; let n = 0, satSum = 0;
      for (let i = 0; i < fr.px.length; i++) { const c = fr.px[i]; if (!c) continue;
        const gv = fr.grid[i]; if (gv === 1 || gv === 2) continue;      /* skin and face */
        const q = hsv(c[0], c[1], c[2]);
        if (q.v < 0.12) continue;                                       /* the outline */
        n++; satSum += q.s;
        /* 30-degree buckets: finer than that and two shades of the same red read as
           two colours, which is not how anybody sees a person across a street. */
        const key = q.s < 0.18 ? 'neutral' : String((Math.round(q.h / 30) * 30) % 360);
        bins[key] = (bins[key] || 0) + 1; }
      const rank = Object.keys(bins).map(k => [k, bins[k]]).sort((a, c) => c[1] - a[1]);
      out.push({ n: f.faction, px: n, sat: satSum / Math.max(1, n),
                 dom: rank[0] ? rank[0][0] : '-',
                 domShare: rank[0] ? rank[0][1] / Math.max(1, n) : 0,
                 second: rank[1] ? rank[1][0] : '-',
                 neutral: (bins['neutral'] || 0) / Math.max(1, n) });
    }
    window.G_WORN = keepW; G.equipped = keepE; G.bodyVar = keepV;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    return out;
  });
  await b.close();

  /* ---- 4. THE NAME IS NOT A LIE -----------------------------------------
     Only factions NAMED for a colour are asked this, and only the ones whose name
     maps to a hue without argument. This is the check that would have caught the
     Blues wearing red for five weeks. */
  const NAMED = { Blues: '210', Reds: '0' };
  const wrong = [];
  for (const q of R) { const want = NAMED[q.n]; if (!want) continue;
    if (q.dom !== want) wrong.push(q.n + ' is dominantly ' + q.dom + ', not ' + want); }
  ok('*** A FACTION NAMED FOR A COLOUR WEARS THAT COLOUR *** (' +
     (wrong.length ? wrong.join('; ') : 'Blues blue, Reds red') + ')', wrong.length === 0);

  /* ---- 2. SATURATED ENOUGH TO BE A SIGNAL --------------------------------
     DRAB IS LEGAL WHERE DRABNESS IS THE STATEMENT. The Volunteers own nothing and
     the Homeless bought nothing; dressing either of them in a flag would be a lie
     about who they are. Everybody else is claiming ground and has to look like it.
     Named, not inferred, so nobody can quietly add themselves to the exemption. */
  const DRAB_ON_PURPOSE = { Volunteers: 1, Homeless: 1, Cartel: 1 };
  const FLOOR = 0.28;
  const washed = R.filter(q => !DRAB_ON_PURPOSE[q.n] && q.sat < FLOOR);
  ok('every faction that claims ground looks like it (colour strength >= ' + FLOOR.toFixed(2) +
     (washed.length ? ' -- WASHED OUT: ' + washed.map(q => q.n + ' ' + q.sat.toFixed(2)).join(', ') : '') + ')',
     washed.length === 0);
  /* AND THE EXEMPTION MUST BE EARNED, or it is just a hole. The three drab factions
     have to actually BE drab; if one of them creeps up into a real colour it has
     stopped being the thing the exemption was written for and should be judged. */
  const notDrab = R.filter(q => DRAB_ON_PURPOSE[q.n] && q.sat >= FLOOR + 0.10);
  ok('the drab exemption is still describing drab people (' +
     R.filter(q => DRAB_ON_PURPOSE[q.n]).map(q => q.n + ' ' + q.sat.toFixed(2)).join(', ') + ')',
     notDrab.length === 0);

  /* ---- 1. COORDINATED ----------------------------------------------------
     A faction's biggest colour has to actually be its colour. COLORFUL was 54%
     grey/brown with a bone coat over a striped tee -- one loud item under a beige
     coat is not a coordinated outfit, because a coat is most of a person. */
  const CO = 0.38;
  const scattered = R.filter(q => !DRAB_ON_PURPOSE[q.n] && q.domShare < CO);
  ok('a faction\'s cloth agrees with itself (biggest hue >= ' + (CO * 100).toFixed(0) + '% of the cloth' +
     (scattered.length ? ' -- SCATTERED: ' + scattered.map(q => q.n + ' ' + (100 * q.domShare).toFixed(0) + '%').join(', ') : '') + ')',
     scattered.length === 0);

  /* ---- 3. NOBODY ELSE'S --------------------------------------------------
     RATCHET, NOT A ZERO. The valley is thirteen factions and the desert palette is
     real: hue 30 is leather, dust and sun-bleached canvas, and five factions
     legitimately live there. Pinning collisions at zero today would mean inventing
     colour ownership for five factions, which is HIS to give and not mine to take.
     So this pins the number where it is and lets it only ever shrink -- the same
     downward ratchet the hair laws use, and it still fires the moment somebody adds
     a fourteenth faction in a colour that is already spoken for. */
  const PINNED_CLASH = 4;   // 8 -> 5 the day it was written, 5 -> 4 on 9/6 when
                            // the gate itself said so and nobody had done it
  const byHue = {};
  for (const q of R) { if (q.dom === 'neutral') continue; (byHue[q.dom] = byHue[q.dom] || []).push(q.n); }
  let clashes = 0; const clashList = [];
  for (const h in byHue) if (byHue[h].length > 1) {
    clashes += byHue[h].length - 1;
    clashList.push(h + ': ' + byHue[h].join('/')); }
  ok('*** NO TWO FACTIONS OWN THE SAME COLOUR *** (' + clashes + ' sharing, pinned ' + PINNED_CLASH +
     (clashList.length ? ' -- ' + clashList.join('  ') : '') + ')', clashes <= PINNED_CLASH);
  if (clashes < PINNED_CLASH)
    console.log('  *** FEWER CLASHES THAN THE PIN. Lower PINNED_CLASH to ' + clashes + ' so it cannot slide back. ***');

  /* ---- 5. HIS ANSWER IS READABLE OUTSIDE THE WARDROBE (9/6, [colours fixed])
     Every faction already HAD a colour -- he answered it garment by garment on
     8/26 -- and it existed only as PIXELS. This gate could reach it by launching
     a browser; nothing in the game could. The ramps live in the alpha and the
     city carried a grep count of NOUGHT, so three rows were stopped on it:
     FACTIONS [who holds] drew its borders in a two-colour language for want of a
     hue, UI [owner shown] wants "the owner of every district IN ITS COLOUR", and
     COOK [border marked] wants the edge painted in the holder's.
     tools/bohemia_faction_colour.js runs THIS MEASUREMENT and writes it down.
     These claims are the thing that stops it rotting: the published number is
     compared against the render, here, every run. ------------------------- */
  const FS = require('fs');
  const CJ = path.join(__dirname, '../engine/BOHEMIA_faction_colours.json');
  let PUB = null;
  try { PUB = JSON.parse(FS.readFileSync(CJ, 'utf8')); } catch (_e) {}
  ok('*** A FACTION\'S COLOUR IS READABLE WITHOUT RENDERING A BODY. *** It was his '
     + 'answer all along and it was locked in a browser; three rows were blocked on '
     + 'it', !!(PUB && PUB.factions && Object.keys(PUB.factions).length === R.length));

  const drift = [];
  for (const q of R) {
    const e = PUB && PUB.factions && PUB.factions[q.n];
    if (!e) { drift.push(q.n + ' missing'); continue; }
    const wantHue = q.dom === 'neutral' ? null : (q.dom | 0);
    if (e.hue !== wantHue) drift.push(q.n + ' hue ' + e.hue + ' but renders ' + wantHue);
    if (!!e.drab !== (q.dom === 'neutral')) drift.push(q.n + ' drab flag wrong');
  }
  ok('AND IT IS THE SAME ANSWER THE CLOTH GIVES, re-measured here every run so it '
     + 'cannot rot into a list somebody believes -- the contract NOT_A_TOWN and the '
     + 'seat bake already carry' + (drift.length ? ' -- DRIFT: ' + drift.join('; ') : ''),
     drift.length === 0);

  ok('and every published colour is tagged draft, because it is MEASURED and never '
     + 'RULED -- the day he thumbs one, the flag is what changes',
     !!PUB && Object.values(PUB.factions).every(e => e.draft === true));

  /* THE WALKED SURFACE CARRIES IT, or the whole exercise was a file nobody reads. */
  const CITY_SRC = FS.readFileSync(path.join(__dirname, '../slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
  const m = /window\.BOHEMIA_FACTION_COLOURS=(.*?);\n/.exec(CITY_SRC);
  let cityMatches = false;
  try { cityMatches = !!m && JSON.stringify(JSON.parse(m[1]).factions) === JSON.stringify(PUB.factions); }
  catch (_e) {}
  ok('*** AND THE WALKED SURFACE CARRIES THE SAME NUMBERS. *** A JSON in engine/ is '
     + 'still unreachable from the city, which is the exact reason the ramps were '
     + 'stranded in the alpha in the first place. The tool re-writes it every run '
     + 'rather than checking a marker and no-opping, which is the defect the seat '
     + 'bake paid for one round ago', cityMatches);

  ok('and the map draws its territory border with it', /__holderInk/.test(CITY_SRC));

  /* *** VERIFY ON THE REAL SURFACE. *** The line above is a grep and a grep proves
     the code exists, not that anything was painted. The border loop publishes the
     ink it actually used per faction -- the same way this renderer already
     publishes its label boxes, and for the same reason: counting coloured pixels
     near a border reads the neighbour's line as yours. */
  const inks = await (async () => {
    const b2 = await chromium.launch();
    try {
      const p2 = await b2.newPage({ viewport: { width: 390, height: 844 } });
      await p2.route(/^https?:/, r => r.abort());
      await p2.goto('file://' + path.join(__dirname, '../slices/BOHEMIA_CITY_WORLD.html'),
                    { waitUntil: 'load', timeout: 180000 });
      await p2.waitForFunction(() => typeof renderCity === 'function' && typeof turfGrid === 'function',
                               { timeout: 60000 });
      return await p2.evaluate(() => {
        try { if (typeof MAPON !== 'undefined') MAPON = true; } catch (_e) {}
        try { openMap(); } catch (_e) {}
        for (let i = 0; i < 3; i++) { try { renderCity(); } catch (_e) {} }
        return window.__TURF_INK || null;
      });
    } finally { await b2.close(); }
  })();

  const painted = inks ? Object.keys(inks) : [];
  const distinct = inks ? new Set(Object.values(inks)).size : 0;
  ok('*** AND A REAL CANVAS REALLY PAINTED THEM. *** ' + painted.length + ' factions\' '
     + 'ground drawn in ' + distinct + ' distinct inks. Before this round the border '
     + 'was two colours for the whole valley, yours and theirs, because there was no '
     + 'hue to use' + (inks ? ' -- ' + painted.slice(0, 4).map(k => k + ' ' + inks[k]).join(', ') : ''),
     painted.length >= 6 && distinct >= 4);

  /* ---- 6. THE AUDIT THIS ROW WAS OPENED FOR, MEASURED --------------------
     "the gate holds contradictions, this row fixes them". Two were found, and
     the honest answer to both is that they are HIS, not mine -- so they are
     NAMED here every run instead of sitting silently inside a pin. */
  const GRAPH = JSON.parse(FS.readFileSync(path.join(__dirname, '../engine/BOHEMIA_faction_graph.json'), 'utf8')).factions;
  const rel = (a, c) => (GRAPH[a] && GRAPH[a].relations && GRAPH[a].relations[c])
                     || (GRAPH[c] && GRAPH[c].relations && GRAPH[c].relations[a]) || null;
  const related = [];
  for (const h in byHue) if (byHue[h].length > 1) {
    const F = byHue[h];
    for (let i = 0; i < F.length; i++) for (let j = i + 1; j < F.length; j++)
      if (rel(F[i], F[j])) related.push(F[i] + '/' + F[j] + ' (' + rel(F[i], F[j]) + ') both on ' + h);
  }
  ok('*** NO COLOUR CLASH IS BETWEEN TWO FACTIONS HIS CANON PUTS IN A RELATION. *** '
     + 'The law\'s own research is that colour choice is OPPOSITIONAL -- the Bloods '
     + 'took red against the Crips\' blue -- so two ENEMIES in one hue is a lie about '
     + 'his graph and two strangers in one hue is only a coincidence. Measured '
     + 'against his relations: every clashing pair is unrelated'
     + (related.length ? ' -- BUT: ' + related.join('; ') : ''),
     related.length === 0);

  console.log('  note: the drab exemption names ' + Object.keys(DRAB_ON_PURPOSE).length
    + ' factions (' + Object.keys(DRAB_ON_PURPOSE).join(', ') + ') and COLOUR IS '
    + 'TERRITORY names TWO -- "drab is legal, but only when drabness IS the statement '
    + '(the Volunteers, the Homeless)". The Cartel was added to the list and not to '
    + 'the law. Its note is "organized human predation" with supply chains, so the '
    + 'law\'s reason ("the Volunteers own nothing and the Homeless bought nothing") '
    + 'does not describe it -- but a predator not advertising is a real reading too. '
    + 'That is TASTE, so it is [PENDING Paolo] and printed here rather than settled.');
  ok('and the exemption cannot quietly GROW while it waits for him',
     Object.keys(DRAB_ON_PURPOSE).length <= 3);

  /* ---- and the instrument he asked for, which is half of the ruling ------- */
  const src = require('fs').readFileSync(ALPHA, 'utf8');
  ok('HE CAN VOTE ON THE THIRTEEN: the faction board carries thumbs (Paolo 8/26 ' +
     '"I definitely would have voted")', /facUp/.test(src) && /facDn/.test(src) && /FAC_VOTE_KEY/.test(src));
  ok('and it exports .txt and never .json (the verdict workflow)',
     /BOHEMIA_FACTION_OUTFIT_VERDICTS\.txt/.test(src) && !/faction[^\n]*verdicts[^\n]*\.json/i.test(src));
  ok('and it has a notes box, because every judge board does', /id="facNotes"/.test(src));

  /* ---- 4b  AND HE CAN SEE WHETHER THEY WEAR THE COLOUR HE PICKED (9/12) -----
     The VAMILY row [one colour table] asks for "the aim-to-landing distance per faction as
     a NUMBER HE CAN READ". A number in a record file is not that: he never digs in files,
     and NAME THE TAB says a thing he cannot reach does not exist. So it is on the board in
     the CHARACTER tab, and this holds it there.
     A SOURCE GREP IS NOT ENOUGH FOR THIS ONE. The readout is computed at build time from
     his MFACTIONS table and a live render, so the only honest check opens the board and
     reads what it says -- which is also the check that catches it agreeing with nothing. */
  {
    /* its own browser: the four tests above closed theirs at line 80 and everything
       between there and here is arithmetic on numbers already in hand. */
    const bB = await chromium.launch({ args: ['--no-sandbox'] });
    const pgB = await bB.newPage({ viewport: { width: 390, height: 844 } });
    const bErr = [];
    pgB.on('pageerror', e => bErr.push(String(e.message).slice(0, 120)));
    await pgB.goto('file://' + ALPHA, { waitUntil: 'load' });
    await pgB.waitForFunction(() => typeof outfitBuild === 'function' && window.FACTION_LOOKS, { timeout: 30000 });
    const B = await pgB.evaluate(() => {
      try { outfitBuild(); } catch (e) { return { threw: String(e.message) }; }
      const sum = document.getElementById('facColourSum');
      const cards = [...document.querySelectorAll('#outfitBoard .famCard')];
      return {
        summary: sum ? sum.textContent : null,
        cards: cards.length,
        verdicts: cards.filter(c => /MATCH|OFF BY|ON PURPOSE/.test(c.textContent)).length,
        /* the faction names the board itself calls wrong, read off the board */
        off: (function () {
          const m = (sum ? sum.textContent : '').match(/These do not: ([^.]*)\./);
          return m ? m[1].split(',').map(s => s.trim()).filter(Boolean) : [];
        })(),
        wear: (function () {
          const m = (sum ? sum.textContent : '').match(/(\d+) of (\d+) wear it/);
          return m ? [ +m[1], +m[2] ] : null;
        })(),
      };
    });
    await pgB.close(); await bB.close();
    ok('*** HE CAN SEE WHETHER THEY WEAR THE COLOUR HE PICKED *** -- the thirteen-outfit '
       + 'board opens with no page error and prints it' + (B.threw ? ' -- THREW: ' + B.threw : ''),
       !B.threw && bErr.length === 0);
    ok('and EVERY card carries a verdict, not just the broken ones ('
       + B.verdicts + ' of ' + B.cards + ')', B.cards === 13 && B.verdicts === 13);
    ok('and the headline is a NUMBER he can read, not an adjective ("'
       + String(B.summary || '').slice(0, 60) + '...")', !!(B.wear && B.wear[1] > 0));
    /* A RATCHET, NOT A SNAPSHOT. Naming today's two factions here would go red the moment
       somebody FIXES one, which is a gate punishing the work it exists to protect. The
       debt may shrink and may never grow: two are off today (ANARCHISTS and NETWORK, both
       needing a cook this lane cannot do alone -- the wardrobe has no magenta at all, and
       Network's teal shirt alone fails the coordination floor). Lower this number when one
       lands; never raise it. */
    const OFF_PIN = 2;
    ok('*** AND THE NUMBER OF FACTIONS NOT WEARING HIS COLOUR NEVER GOES UP *** (at most '
       + OFF_PIN + '; the board says ' + B.off.length + ' [' + B.off.join(', ') + '])',
       B.off.length <= OFF_PIN);
  }

  console.log('\n  faction        colour strength   biggest hue   share');
  for (const q of R) console.log('  ' + q.n.padEnd(14) + q.sat.toFixed(2).padStart(13) +
    String(q.dom).padStart(14) + ((100 * q.domShare).toFixed(0) + '%').padStart(8));

  /* ==== 5  DOES THE COLOUR REACH THE STREET? (9/12/26, CHARACTER) ==========
     The four tests above all measure the wardrobe, in the alpha, at native 112. NOTHING
     HAS EVER CHECKED THAT ANY OF IT ARRIVES. Between the wardrobe and a person you walk
     past there is a bake to 56, a halve, a pack, a postMessage across a frame boundary,
     an unpack, a scale back up, and -- since 9/6 -- a VALUE STEP that repaints every
     hostile body's pixels. A law about what people wear is not enforced by a gate that
     stops at the changing room.
     WHY IT IS HERE AND NOT IN ITS OWN FILE: two rulers for one law is worse than one.
     This is the same law, measured one room further along.
     ITS OWN BROWSER, ON PURPOSE. The four tests above finish with the page's numbers in
     hand and close the browser at line 80, which is right -- everything between there and
     here is arithmetic on data already collected. Hanging a second surface off the closed
     handle is the trap that cost this lane a run on 9/11; a fresh one costs a few seconds
     and cannot rot. */
  const DEMO = path.join(__dirname, '../slices/BOHEMIA_DEMO.html');
  const { settle: SETTLE } = require(path.join(__dirname, 'bohemia_settle.js'));
  const b2 = await chromium.launch({ args: ['--no-sandbox'] });
  const pg2 = await b2.newPage({ viewport: { width: 390, height: 844 } });
  const cerr = [];
  pg2.on('console', m => { if (m.type() === 'error') cerr.push(m.text()); });
  await pg2.goto('file://' + DEMO);
  await SETTLE(pg2, 15000);
  await pg2.evaluate(() => { const f = document.getElementById('fronttap') || document.getElementById('front'); if (f) f.click(); });
  await SETTLE(pg2, 12000);
  await new Promise(r => setTimeout(r, 3000));
  const cf = pg2.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
  ok('the walked city is reachable from the demo at all', !!cf);

  if (cf) {
    /* ONE READER, USED ON BOTH SIDES. A hue gap between two DIFFERENT readers is a fact
       about the readers. This is the whole reason the 9/12 measurement had to be redone:
       its first cut compared this gate's cloth-only numbers against a reader that counts
       skin, and reported a 43-degree "drift" that was entirely the two rulers. */
    const READER = `(px) => { const B5=new Array(72).fill(0); let col=0,tot=0,lum=0;
      for(let i=0;i<px.length;i++){ const q=px[i]; if(!q) continue;
        const R=q[0],G=q[1],B=q[2]; tot++; lum+=0.2126*R+0.7152*G+0.0722*B;
        const mx=Math.max(R,G,B),mn=Math.min(R,G,B);
        if((mx?(mx-mn)/mx:0)<0.25||mx<40) continue; col++;
        let h; if(mx===mn)h=0; else if(mx===R)h=60*(((G-B)/(mx-mn))%6);
        else if(mx===G)h=60*(((B-R)/(mx-mn))+2); else h=60*(((R-G)/(mx-mn))+4);
        if(h<0)h+=360; B5[Math.floor(h/5)%72]++; }
      let bi=0; for(let i=1;i<72;i++) if(B5[i]>B5[bi]) bi=i;
      return { hue: B5[bi]? bi*5+2.5 : null, coloured: tot? col/tot : 0,
               luma: tot? lum/tot : 0 }; }`;

    const names = await pg2.evaluate(() => (window.FACTION_LOOKS || []).map(f => f.faction));
    /* the alpha side: the very px array bake56 halves */
    const A = await pg2.evaluate(([NS, SRC]) => {
      const hueOfPx = eval(SRC);
      const PD = ['shirt', 'jacket', 'pants', 'shoes', 'hat', 'glasses', 'hair'];
      const kW = window.G_WORN, kD = G.bodyVar, kA = G.age, kE = {};
      PD.forEach(s => { if (s in G.equipped) { kE[s] = G.equipped[s]; G.equipped[s] = ''; } });
      const out = {};
      try {
        for (const n of NS) {
          const src = (window.FACTION_LOOKS || []).filter(f => f.faction === n)[0];
          if (!src) continue;
          window.G_WORN = src.worn; G.bodyVar = src.dials; G.age = src.age || 'adult';
          rebuildFromRig();
          out[n] = hueOfPx(buildFrame('S', 'idle', 0.25, true).px);
        }
      } catch (e) { out.__err = String(e.message); }
      finally {
        window.G_WORN = kW; G.bodyVar = kD; G.age = kA;
        for (const s in kE) G.equipped[s] = kE[s];
        try { rebuildFromRig(); } catch (e) {}
        try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      }
      return out;
    }, [names, READER]);

    await cf.evaluate((NS) => { NS.forEach(n => ctNeedFaction(n)); }, names);
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 1000));
      if (await cf.evaluate(() => Object.keys(CAST_FID).length) >= names.length) break;
    }
    const landed = await cf.evaluate(() => Object.keys(CAST_FID));
    ok('*** EVERY FACTION OUTFIT ACTUALLY BAKES AND REACHES THE WALKED CITY *** '
       + '(' + landed.length + ' of ' + names.length + ')', landed.length === names.length);

    const C = await cf.evaluate((SRC) => {
      const hueOfPx = eval(SRC);
      const readImg = (img) => {
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data, px = [];
        for (let i = 0; i < d.length; i += 4) px.push(d[i + 3] < 128 ? null : [d[i], d[i + 1], d[i + 2]]);
        return hueOfPx(px);
      };
      const out = {};
      for (const f in CAST_FID) {
        const s = CAST_FID[f].S || CAST_FID[f][Object.keys(CAST_FID[f])[0]];
        if (!s || !s.idle) continue;
        const plain = readImg(s.idle);
        const want = plain.luma <= 127 ? plain.luma + 60 : plain.luma - 60;
        let hostile = null;
        try { hostile = readImg(ctStepped(s.idle, want)); } catch (e) {}
        out[f] = { plain, hostile };
      }
      return out;
    }, READER);

    const dH = (a, b) => { const d = Math.abs(((a - b) % 360 + 360) % 360); return d > 180 ? 360 - d : d; };
    const NEAR = 30;                       /* one twelfth of the wheel: still the same colour */
    const tripBad = [], hostBad = []; let moved = 0, movedN = 0;
    for (const f of names) {
      const a = A[f], c = C[f];
      if (!a || !c || a.hue == null || c.plain.hue == null) continue;
      if (c.plain.coloured < 0.35) continue;          /* drab: no hue to lose */
      const t = dH(a.hue, c.plain.hue);
      if (t > NEAR) tripBad.push(f + ' ' + t.toFixed(0) + 'deg');
      if (c.hostile && c.hostile.hue != null) {
        const h = dH(c.hostile.hue, c.plain.hue);
        if (h > NEAR) hostBad.push(f + ' ' + h.toFixed(0) + 'deg');
        moved += Math.abs(c.hostile.luma - c.plain.luma); movedN++;
      }
    }
    ok('*** THE COLOUR SURVIVES THE TRIP FROM THE WARDROBE TO THE STREET *** -- bake, '
       + 'halve, pack, frame hop, unpack, and the hue is still the same colour'
       + (tripBad.length ? ' -- BUT: ' + tripBad.join(', ') : ''), tripBad.length === 0);
    /* THE 9/6 VALUE STEP BROKE THIS LAW AND NOTHING CAUGHT IT FOR SIX DAYS. Scaling every
       channel holds the ratios only while nothing clips; a red body's R saturates first and
       the hue rotates toward yellow. MEASURED before the 9/12 fix: Mob swung 35 degrees on
       becoming hostile -- a soldier changing colour because he noticed you. */
    ok('*** AND A HOSTILE DOES NOT CHANGE WHOSE HE IS *** -- the value step that makes an '
       + 'enemy stand out of the crowd moves VALUE only, never hue'
       + (hostBad.length ? ' -- BUT: ' + hostBad.join(', ') : ''), hostBad.length === 0);
    /* AND THE CHECK ON THAT CHECK: holding the hue is trivial if the step stops stepping. */
    const avg = movedN ? moved / movedN : 0;
    ok('and it holds that hue by clipping carefully, NOT by doing nothing: the step still '
       + 'moved ' + avg.toFixed(0) + ' of the 60 it was asked for', avg >= 40);

    /* THE SILENCE THAT MADE A TYPO LOOK LIKE A BROKEN MACHINE (9/12). A faction with no
       outfit returned false into an empty catch, so a body stayed in its trade fit for the
       session with nothing anywhere going red -- and a test that asked for 'REDS' instead
       of 'Reds' got a hole written into the record that was never in the game. */
    cerr.length = 0;
    await pg2.evaluate(() => { try { cityBakeFaction('NOBODY_WEARS_THIS'); } catch (e) {} });
    await new Promise(r => setTimeout(r, 300));
    ok('*** A FACTION WITH NO OUTFIT SAYS SO OUT LOUD *** -- silence here is how a typo '
       + 'becomes a recorded fact about the world',
       cerr.some(t => /no outfit for faction/.test(t)));

    /* ==== 6  AND THE ONE COMING FOR YOU IS DRESSED (9/13, [enemy dressed]) ==========
       "every hostile wears its faction's colour and the runway cut, so WHO IS COMING FOR
       YOU IS READABLE FROM THE CLOTHES." Measured on the walked street and it already
       holds -- so this gate is here to stop it QUIETLY STOPPING, which is the only thing
       standing between a working feature and a broken one nobody notices.
       THREE THINGS THIS CHECK HAD TO LEARN, all of them the hard way:
       (a) STAND WHERE THE HOSTILES ARE, not where the crowd is densest. The first cut
           walked to the fullest neighbourhood, drew 183 bodies of whom ALL 183 ran with
           nobody, and would have reported "0 hostiles wear their faction" about a street
           with no hostile on it.
       (b) COUNT AFTER THE BAKE, not on the first frame. ctBody's own comment: "NO HOLE
           WHILE IT BAKES ... the swap is a body getting MORE specific, never a person
           appearing out of nothing." On frame one CAST_FID is empty BY DESIGN, so the
           first-frame count is 0 for a second and wrong for the rest of the game.
       (c) COMPARE THE SPRITE, not the table. CAST_FID having an entry proves a bake
           landed; it does not prove ctBody handed that body to the renderer. */
    const H = await cf.evaluate(async () => {
      const o = { drew: 0, hostile: 0, wearing: 0, fids: {} };
      const NB = BohemiaPopulation.NB, span = NB * FN;
      const cx0 = Math.floor(hx / span), cy0 = Math.floor(hy / span);
      let best = null;
      for (let ny = Math.max(0, cy0 - 6); ny <= cy0 + 6; ny++)
      for (let nx = Math.max(0, cx0 - 6); nx <= cx0 + 6; nx++) {
        let ppl = []; try { ppl = pplPeople(nx, ny) || []; } catch (e) { continue; }
        if (!ppl.length) continue;
        let hos = 0;
        for (const q of ppl) { try { if (ctAgainstMe(q)) hos++; } catch (e) {} }
        if (!best || hos > best.hos) best = { hos: hos, ppl: ppl };
      }
      if (best && best.hos) {
        const pts = best.ppl.map(q => { try { return pplAt(q); } catch (e) { return null; } }).filter(Boolean);
        if (pts.length) {
          const xs = pts.map(a => a[0]).sort((a, c) => a - c), ys = pts.map(a => a[1]).sort((a, c) => a - c);
          hx = xs[xs.length >> 1]; hy = ys[ys.length >> 1];
        }
      }
      render();
      const want = {};
      for (let i = 0; i < BARK_DREW.length; i++) {
        const q = BARK_DREW[i].p;
        let h = 0, f = null;
        try { h = ctAgainstMe(q); } catch (e) {}
        try { f = ctFactionOf(q); } catch (e) {}
        if (h && f) want[f] = 1;
      }
      Object.keys(want).forEach(f => { try { ctNeedFaction(f); } catch (e) {} });
      for (let t = 0; t < 15; t++) {
        await new Promise(r => setTimeout(r, 1000));
        if (Object.keys(want).every(f => CAST_FID[f])) break;
      }
      render();
      for (let i = 0; i < BARK_DREW.length; i++) {
        const q = BARK_DREW[i].p;
        o.drew++;
        let h = 0, f = null;
        try { h = ctAgainstMe(q); } catch (e) {}
        try { f = ctFactionOf(q); } catch (e) {}
        if (!h) continue;
        o.hostile++;
        o.fids[f || '(nobody)'] = (o.fids[f || '(nobody)'] || 0) + 1;
        if (!f || !CAST_FID[f]) continue;
        let dir = 'S'; try { dir = pplFace(q, BARK_DREW[i].at); } catch (e) {}
        let got = null; try { got = ctBody(q, dir); } catch (e) {}
        const set = CAST_FID[f], s2 = set && (set[dir] || set.S);
        if (got && s2 && (got === s2.idle || (s2.breathe && s2.breathe.indexOf(got) >= 0)))
          o.wearing++;
      }
      return o;
    });
    /* THE HARNESS FINDING NOBODY IS NOT THE GAME HAVING NOBODY, and this lane has published
       that mistake twice. If the walk turns up no hostile at all, the check says so and
       fails, rather than passing vacuously on an empty street. */
    ok('*** THE WALK FINDS HOSTILES ON THE STREET AT ALL *** -- a green over an empty '
       + 'street is the vacuous pass this lane has shipped twice (' + H.hostile
       + ' hostile of ' + H.drew + ' drawn)', H.hostile > 0);
    ok('*** AND EVERY ONE OF THEM IS WEARING ITS FACTION *** -- who is coming for you is '
       + 'readable from the clothes (' + H.wearing + ' of ' + H.hostile + ', '
       + Object.keys(H.fids).join(', ') + ')',
       H.hostile > 0 && H.wearing === H.hostile);
  }
  /* ===== 7. ONE GENERATOR, MANY PEOPLE, AND IT STILL CANNOT TOUCH HIS COLOURS ==========
     (9/15, CHARACTER, VAMILY [six people].) The street was six baked bodies in eight
     facings and 74% of the crowd was a repeat of somebody else. Baking more costs 530 ms
     of frozen page each, so the variety is made at DRAW TIME: one generator, a ramp per
     person, keyed off his id.
     THAT PUTS A PIXEL WRITER IN THE DRAW PATH OF EVERY BODY ON SCREEN, which is exactly
     where COLOUR IS TERRITORY (8/26) is easiest to break by accident and hardest to
     notice -- ctStepped broke it on 9/12 with a value step that looked mathematically
     safe and swung Mob 35 degrees. So this section is not about variety. It is about the
     variety being unable to cost him the law, MEASURED ON THE SURFACE rather than argued
     from the code.
     AND IT REFUSES TO PASS ON AN EMPTY STREET, which this lane has shipped twice. */
  {
    const V = await cf.evaluate(() => {
      const o = { drew: 0, satPixels: 0, satMoved: 0, before: {}, after: {}, unstable: 0 };
      /* STAND WHERE THE CROWD IS: the question is how varied a CROWD looks. */
      const NB = BohemiaPopulation.NB, span = NB * FN;
      const cx0 = Math.floor(hx / span), cy0 = Math.floor(hy / span);
      let best = null;
      for (let ny = Math.max(0, cy0 - 6); ny <= cy0 + 6; ny++)
      for (let nx = Math.max(0, cx0 - 6); nx <= cx0 + 6; nx++) {
        let ppl = []; try { ppl = pplPeople(nx, ny) || []; } catch (e) { continue; }
        if (ppl.length && (!best || ppl.length > best.n)) best = { n: ppl.length, ppl: ppl };
      }
      if (best) {
        const pts = best.ppl.map(q => { try { return pplAt(q); } catch (e) { return null; } }).filter(Boolean);
        if (pts.length) {
          const xs = pts.map(a => a[0]).sort((a, c) => a - c), ys = pts.map(a => a[1]).sort((a, c) => a - c);
          hx = xs[xs.length >> 1]; hy = ys[ys.length >> 1];
        }
      }
      render();
      const L = HC >= 64 ? 224 : (HC >= 32 ? 112 : (HC < 17 ? 28 : 56));
      const px = (s, w, h) => { const c = document.createElement('canvas'); c.width = w || s.width; c.height = h || s.height;
        const g2 = c.getContext('2d', { willReadFrequently: true }); g2.imageSmoothingEnabled = false;
        g2.drawImage(s, 0, 0, c.width, c.height); return g2.getImageData(0, 0, c.width, c.height).data; };
      const hashAt = (s) => {
        const d = px(s, L, L); let h = 2166136261;
        for (let k = 0; k < d.length; k += 4) {
          const a = d[k + 3] < 128 ? 0 : 1;
          const l = a ? Math.round((0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2]) / 52) : 0;
          h ^= (a * 7 + l); h = Math.imul(h, 16777619);
        }
        return (h >>> 0).toString(16);
      };
      /* THE BUDGET IS LIFTED FOR THE COUNT AND RESTORED AFTER: rationing new recolours to
         a handful a frame decides WHEN the crowd is itself, not how varied it is, and
         counting under the ration would measure the ration. */
      const keepBudget = CT_RAMP_LEFT; CT_RAMP_LEFT = Infinity;
      for (let i = 0; i < BARK_DREW.length; i++) {
        const d = BARK_DREW[i], q = d.p;
        let dir = 'S'; try { dir = pplFace(q, d.at); } catch (e) {}
        /* ONE BREATH PHASE FOR EVERYBODY, or breathing counts as variety and reads 38%
           repeats where the truth is 74%. The flattering reading is the dangerous one. */
        let s = null;
        try {
          const f2 = ctFactionOf(q), set = (f2 && CAST_FID[f2]) ? CAST_FID[f2] : (CAST_CV && CAST_CV[ctFitIndex(q)]);
          const sd = set && (set[dir] || set.S);
          s = sd ? sd.idle : ctBody(q, dir);
        } catch (e) { try { s = ctBody(q, dir); } catch (e2) {} }
        if (!s) continue;
        o.drew++;
        const kB = hashAt(s); o.before[kB] = (o.before[kB] || 0) + 1;
        let s2 = s; try { s2 = ctRamped(s, q); } catch (e) {}
        const kA = hashAt(s2); o.after[kA] = (o.after[kA] || 0) + 1;
        /* SAME PERSON, SAME COLOURS, ASKED TWICE. "He does not change as you walk past"
           is the claim the id key exists to make, so it gets measured, not asserted. */
        let s3 = s; try { s3 = ctRamped(s, q); } catch (e) {}
        if (s3 !== s2) o.unstable++;
        if (s2 === s) continue;
        /* AND THE LAW: how many of his saturated pixels moved. Zero is the only pass. */
        const A = px(s), B2 = px(s2);
        if (A.length !== B2.length) continue;
        const KEEP = CT_RAMP.keep;
        for (let k = 0; k < A.length; k += 4) {
          if (!A[k + 3]) continue;
          const Rr = A[k], G = A[k + 1], B3 = A[k + 2];
          const mx = Rr > G ? (Rr > B3 ? Rr : B3) : (G > B3 ? G : B3);
          if (!mx) continue;
          const mn = Rr < G ? (Rr < B3 ? Rr : B3) : (G < B3 ? G : B3);
          if ((mx - mn) / mx < KEEP) continue;
          o.satPixels++;
          if (A[k] !== B2[k] || A[k + 1] !== B2[k + 1] || A[k + 2] !== B2[k + 2]) o.satMoved++;
        }
      }
      CT_RAMP_LEFT = keepBudget;
      o.distinctBefore = Object.keys(o.before).length;
      o.distinctAfter = Object.keys(o.after).length;
      o.biggestBefore = Math.max(0, ...Object.values(o.before));
      o.biggestAfter = Math.max(0, ...Object.values(o.after));
      o.repeatAfter = +(1 - (o.distinctAfter / Math.max(1, o.drew))).toFixed(3);
      delete o.before; delete o.after;
      return o;
    });

    /* THE VACUOUS-PASS GUARD FIRST, because every number under it is meaningless without
       a crowd and this lane has published an empty street as a green twice. */
    ok('*** THE WALK FINDS A CROWD AT ALL *** -- every variety number below is meaningless '
       + 'over an empty street (' + V.drew + ' bodies drawn)', V.drew >= 20);
    ok('*** THE RAMP MOVES NONE OF HIS FACTION COLOURS *** -- COLOUR IS TERRITORY says the '
       + 'saturated piece states who would defend you, and ctStepped already broke that '
       + 'once with a step that looked safe (' + V.satMoved + ' moved of ' + V.satPixels
       + ' saturated pixels on the crowd)',
       V.satPixels > 0 && V.satMoved === 0);
    ok('and the saturated band is skipped by a CONTINUE, so no ramp value can reach it',
       /if\s*\(\s*sat\s*>=\s*CT_RAMP\.keep\s*\)\s*continue/.test(CITY_SRC));
    ok('and nothing is ever scaled past its own clip point, so a hue cannot rotate in the '
       + 'bands it DOES write either (the lesson ctStepped paid for on 9/12)',
       /const k = k0 > 1 \? Math\.min\(k0, 255 \/ mx\) : k0/.test(CITY_SRC));
    ok('and alpha is never written, so the silhouette cannot move by one pixel',
       /function ctRamped[\s\S]*?if \(!d\[i \+ 3\]\) continue;/.test(CITY_SRC));
    ok('*** AND THE CROWD IS ACTUALLY LESS OF A UNIFORM *** -- different pictures '
       + V.distinctBefore + ' -> ' + V.distinctAfter + ' over ' + V.drew + ' bodies, '
       + 'biggest group of identical people ' + V.biggestBefore + ' -> ' + V.biggestAfter,
       V.distinctAfter > V.distinctBefore && V.biggestAfter <= V.biggestBefore);
    /* A RATCHET, not a target. Measured 4% the round it shipped; this only stops it
       creeping back toward the uniform it was built to end. */
    ok('and the share of the crowd repeating somebody stays at or under 15% (measured '
       + (V.repeatAfter * 100).toFixed(0) + '%)', V.repeatAfter <= 0.15);
    ok('*** AND A MAN DOES NOT CHANGE COLOUR AS YOU WALK PAST HIM *** -- asked twice for '
       + 'the same person and the same body, same answer (' + V.unstable + ' unstable)',
       V.unstable === 0);
    ok('and the recolour cache is capped and reset per frame, so a draw path cannot leak',
       /CT_RAMP_CV\.size > CT_RAMP_MAX/.test(CITY_SRC)
       && /CT_RAMP_LEFT = CT_RAMP_PER_FRAME/.test(CITY_SRC));
  }

  await b2.close();

  done();
})();
