/* ============================================================================
   THE FACE ON THE MAP IS HIS (9/22/26, LIFE + CITY lane, row [see me])
   Un-held under rule 18f: Paolo's own ask, so it ships.

   HIS WORDS, 9/22, looking at CITY mode at 20:15
   (records/BOHEMIA_PAOLO_CITY_MODE_9_22_26.md):
     "Why do I not see my person on this map? ... what are the peach colored dots
      that are in different parts of the map what are they supposed to be?"

   TWO THINGS, AND THE FIRST ONE IS NOT WHAT THE ROW SAID.

   1. THE MARK WAS ALREADY THE LOUDEST THING ON THE GLASS -- that was [white rings],
      and the numbers still hold: 86 bright pixels against a town's 74. So "I do not
      see my person" was never about finding the mark. WHAT THE MARK CARRIED IN THE
      MIDDLE WAS A FLAT DISC OF SKIN COLOUR. A brown dot is not a person.

      *** AND THE ROW ASKED FOR THE WRONG FACE. *** It says "faceFor on his id".
      faceFor ROLLS a face out of a hash of the id; the head the pad wears is
      buildSpec(), the face he BUILT. Two different people. Drawing faceFor on his
      pin would have put a stranger on his map wearing his mark, which is the exact
      ONE ID, ONE WHOLE PERSON defect. Leg C is that distinction, measured: the face
      the bridge hands the city for him is byte-identical to his own portrait bake
      and NOT equal to the rolled one.

   2. THE PEACH DOTS ARE LAMPS ON LIVE CIRCUITS. LIGHT IS TERRITORY (7/20): a lamp
      is drawn only where the circuit under it is live, so those dots are a map of
      which parts of the valley still have power and who is paying for it. He was
      reading the one picture that answers "who runs what" and nothing told him. It
      goes in the readout the panel already has, never a popup (rule 19).

   AND THE SIZE OF THE FACE IS MEASURED, NOT PICKED. The white annulus is what puts
   bright pixels on the glass, and the guard that he is never fainter than a town had
   TWELVE PIXELS of headroom. A face at 0.78 of the head would have spent all of it.
   0.66 keeps the ring. Leg B holds both at once: a real face on the glass AND the
   old loudness rule still true.
   ========================================================================== */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
               '.webmanifest': 'application/manifest+json' };

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  ok   ' + n)) : (fail++, console.log('  FAIL ' + n)); };

console.log('='.repeat(74));
console.log('  THE FACE ON THE MAP IS HIS  ·  LIFE + CITY  ·  row [see me]');
console.log('='.repeat(74));

/* ---- A. THE SOURCE SAYS THE RIGHT THING ------------------------------- */
const world = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');
const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');

ok('A1 the pin asks for the player by the reserved id, not by a rolled one',
   /ctFaceAsk\('you'\)/.test(world));
ok('A2 *** the bridge hands the player his OWN spec and everybody else a rolled one ***',
   /_who==='you'&&typeof buildSpec==='function'\)\?buildSpec\(\):faceFor\(_who\)/.test(alpha));
ok('A3 the face is drawn clipped and NOT smoothed, the way the bark bubble does it',
   /imageSmoothingEnabled=false/.test(world.slice(world.indexOf('__IT_IS_HIS_OWN_FACE_ON_THE_MAP__'),
     world.indexOf('__IT_IS_HIS_OWN_FACE_ON_THE_MAP__') + 2200)));
ok('A4 a face that arrives after the last paint asks for a repaint, or it is never seen',
   /if \(c\) \{ try \{ render\(\); \} catch \(_e2\) \{\} \}/.test(world));
ok('A5 the lamp line reads the SAME two facts the render reads (the district, and '
   + 'POWER.at().live), so the words and the dot cannot disagree',
   /function cbLampLine/.test(world) && /String\(d\)!=='arterial'/.test(world)
   && /POWER\.at\(x,y\)/.test(world.slice(world.indexOf('function cbLampLine'),
        world.indexOf('function cbLampLine') + 900)));
ok('A6 a doused circuit still names its holder (the light went out, the claim did not)',
   /s\.doused\) return 'a street lamp, out: '\+wire/.test(world));

/* ---- B and C. THE GLASS ------------------------------------------------ */
(async () => {
  const server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(ROOT, u.replace(/^\//, ''));
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port;
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  try {
    await page.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_ALPHA_0_9.html',
      { waitUntil: 'load', timeout: 300000 });
    await page.waitForTimeout(15000);
    await page.evaluate(() => {
      const f = document.getElementById('fronttap') || document.getElementById('front');
      if (f) f.click(); });
    await page.waitForTimeout(25000);
    const fr = page.frames().filter(f => /BOHEMIA_CITY_WORLD/.test(f.url()))[0] || null;
    if (!fr) { ok('B0 the city frame is there', false); }
    else {
      await fr.evaluate(() => { const dc = document.getElementById('daycard');
        if (dc) { const x = dc.querySelector('#daycardX,.x,button'); if (x) x.click();
                  dc.classList.remove('on'); dc.style.display = 'none'; } });
      await page.waitForTimeout(300);

      /* *** C. WHOSE FACE IS IT. Asked of the bridge itself, in the shell, because
         this is an identity question and identity is bytes, not pixels. *** */
      const who = await page.evaluate(() => {
        try {
          const mine = packIdx(renderFace(buildSpec(), { ramp: portraitRamp() }), 64, 64);
          const sp = faceFor('you');
          const rp = (typeof faceRampFor === 'function') ? faceRampFor(sp) : portraitRamp();
          const rolled = packIdx(renderFace(sp, { ramp: rp }), 64, 64);
          const s = x => (typeof x === 'string') ? x : JSON.stringify(x);
          return { mine: s(mine).length, rolled: s(rolled).length,
                   same: s(mine) === s(rolled) };
        } catch (e) { return { err: String(e).slice(0, 120) }; }
      });
      if (who.err) ok('C0 the shell could bake both faces: ' + who.err, false);
      else {
        console.log('  WHOSE FACE: his own bake ' + who.mine + ' bytes, the rolled one '
          + who.rolled + ' bytes, identical: ' + who.same);
        ok('C1 *** HIS OWN FACE AND A ROLLED faceFor("you") ARE NOT THE SAME PERSON ***, '
           + 'which is why the row\'s wording would have put a stranger on his map',
           who.same === false);
      }

      /* *** C4. AND WHOSE FACE IS ON THE GLASS, NOT JUST IN THE SOURCE. ***
         The first cut of this gate caught the mutation with A2 alone, which READS
         THE FILE. This lane's own [white rings] gate says it in as many words: a
         gate that computes from its own copy of the rule cannot fail when the game
         changes. So the same twelve points are read off BOTH candidate bakes in the
         shell and off the face the CITY actually holds, and the city's face has to
         match the one he built and not the rolled one. */
      const PTS = [[20, 22], [32, 22], [44, 22], [26, 30], [38, 30], [32, 36],
                   [24, 44], [40, 44], [32, 48], [16, 32], [48, 32], [32, 14]];
      const cand = await page.evaluate(pts => {
        try {
          const pick = buf => pts.map(p => { const i = (p[1] * 64 + p[0]) * 4;
            return [buf[i], buf[i + 1], buf[i + 2]]; });
          const mine = renderFace(buildSpec(), { ramp: portraitRamp() });
          const sp = faceFor('you');
          const rp = (typeof faceRampFor === 'function') ? faceRampFor(sp) : portraitRamp();
          const rolled = renderFace(sp, { ramp: rp });
          return { mine: pick(mine), rolled: pick(rolled) };
        } catch (e) { return { err: String(e).slice(0, 120) }; }
      }, PTS);
      const onGlass = await fr.evaluate(async pts => {
        try { ctFaceAsk('you'); } catch (e) {}
        await new Promise(r => setTimeout(r, 2500));
        const c = (window.FACE_CV || {})['you'];
        if (!c) return null;
        const g2 = c.getContext('2d', { willReadFrequently: true });
        return pts.map(p => { const d = g2.getImageData(p[0], p[1], 1, 1).data;
          return [d[0], d[1], d[2]]; });
      }, PTS);
      if (cand.err || !onGlass) {
        ok('C4 the two candidate bakes and the city\'s own face could all be read'
           + (cand.err ? ': ' + cand.err : ''), false);
      } else {
        const d2 = (a, b) => a.reduce((s, v, i) =>
          s + Math.abs(v[0] - b[i][0]) + Math.abs(v[1] - b[i][1]) + Math.abs(v[2] - b[i][2]), 0);
        const dMine = d2(onGlass, cand.mine), dRolled = d2(onGlass, cand.rolled);
        console.log('  THE FACE ON THE GLASS, 12 points: ' + dMine
          + ' away from the one he BUILT, ' + dRolled + ' away from the ROLLED one');
        ok('C4 *** THE FACE THE CITY IS DRAWING IS THE ONE HE BUILT, MEASURED ON ITS '
           + 'OWN PIXELS *** (' + dMine + ' vs ' + dRolled + ' away)',
           dMine < dRolled && dMine <= 12);
      }

      /* the face the city actually received for him */
      const got = await fr.evaluate(async () => {
        try { ctFaceAsk('you'); } catch (e) {}
        await new Promise(r => setTimeout(r, 2500));
        const c = (window.FACE_CV || {})['you'];
        if (!c) return { has: false };
        const g2 = c.getContext('2d', { willReadFrequently: true });
        const d = g2.getImageData(0, 0, c.width, c.height).data;
        let n = 0, seen = {};
        for (let i = 0; i < d.length; i += 4) {
          if (d[i + 3] < 8) continue;
          n++; seen[d[i] + ',' + d[i + 1] + ',' + d[i + 2]] = 1;
        }
        return { has: true, w: c.width, h: c.height, lit: n, colours: Object.keys(seen).length };
      });
      console.log('  THE FACE THE CITY HOLDS FOR HIM: '
        + (got.has ? got.w + 'x' + got.h + ', ' + got.lit + ' opaque px, '
                     + got.colours + ' colours' : 'NONE'));
      ok('C2 the city really received a face for him, not an empty answer', got.has === true);
      ok('C3 and it is a face and not a flat disc (' + (got.colours || 0)
         + ' colours in it; a disc is 1)', (got.colours || 0) >= 6);

      /* *** B. ON THE GLASS, at the zoom his frame was taken at and one either side.
         The face must be THERE, and the loudness rule [white rings] shipped must
         still hold, because spending that margin is how this change breaks him. *** */
      const zooms = [];
      for (const TWv of [18, 30, 48]) {
        await fr.evaluate(t => { MODE = 'city'; TW = t; TH = t / 2; panX = 0; panY = 0; render(); }, TWv);
        await page.waitForTimeout(500);
        zooms.push(await fr.evaluate(() => {
          const ox = Math.round(cv.width / 2 - (city.x - city.y) * TW / 2 + panX);
          const oy = Math.round(cv.height / 2 - (city.x + city.y) * TH / 2 + panY);
          const gg = cv.getContext('2d', { willReadFrequently: true });
          const litIn = (cx, cy) => {
            const R = Math.round(TW * 1.25); let n = 0;
            try {
              const d = gg.getImageData(Math.round(cx - R), Math.round(cy - R * 1.6), R * 2, R * 2.6).data;
              for (let i = 0; i < d.length; i += 4)
                if (d[i] > 200 && d[i + 1] > 200 && d[i + 2] > 195) n++;
            } catch (e) { return -1; }
            return n;
          };
          const rings = []; const pg = pplGrid();
          if (pg) for (let y = 0; y < pg.n; y++) for (let x = 0; x < pg.n; x++) {
            if (pg.zone[y * pg.n + x] !== 'cluster') continue;
            const cx = x * pg.NB + (pg.NB >> 1), cy = y * pg.NB + (pg.NB >> 1);
            if (cx >= om.n || cy >= om.n) continue;
            const c = iso(cx, cy, ox, oy); const my = c.sy + TH / 2;
            if (c.sx < 20 || c.sx > cv.width - 20 || my < 20 || my > cv.height - 20) continue;
            rings.push(litIn(c.sx, my));
          }
          const p = iso(city.x, city.y, ox, oy);
          const gx = p.sx, gy = p.sy + TH * 0.4;
          const hr = Math.max(6, TW * 0.36), st = Math.max(8, TW * 0.50);
          const hy = gy - st;
          /* HOW MANY DIFFERENT COLOURS ARE INSIDE HIS HEAD. A flat disc of skin is
             one or two after antialiasing; a face is many. This is the whole claim
             of the round, read off the canvas rather than off the source. */
          const ff = 0.66, kk = 1 / Math.sqrt(1 - ff * ff);
          const fr2 = hr * kk * ff;
          const HR = (fr2 >= 7) ? hr * kk : hr;
          let cols = {}, npx = 0;
          try {
            const R = Math.max(2, Math.floor(fr2 * 0.80));
            const d = gg.getImageData(Math.round(gx - R), Math.round(hy - R), R * 2, R * 2).data;
            for (let i = 0; i < d.length; i += 4) { npx++; cols[d[i] + ',' + d[i + 1] + ',' + d[i + 2]] = 1; }
          } catch (e) {}
          return { TW, playerLit: litIn(gx, gy - st * 0.5),
                   townLit: rings.length ? rings[0] : null, towns: rings.length,
                   headColours: Object.keys(cols).length, headPx: npx,
                   faceRadius: +fr2.toFixed(1), headRadius: +HR.toFixed(1) };
        }));
      }
      console.log('  ON THE GLASS:');
      for (const z of zooms)
        console.log('    TW=' + z.TW + '  you ' + z.playerLit + ' bright px vs town '
          + z.townLit + '   inside his head: ' + z.headColours + ' colours over '
          + z.headPx + ' px (face radius ' + z.faceRadius + ')');

      const withT = zooms.filter(z => z.townLit !== null && z.townLit > 0);
      ok('B1 *** HE IS STILL NEVER FAINTER THAN A TOWN ***, which is the rule '
         + '[white rings] shipped and the margin this change spends ('
         + withT.map(z => 'TW' + z.TW + ' ' + z.playerLit + ' vs ' + z.townLit).join(', ') + ')',
         withT.length > 0 && withT.every(z => z.playerLit >= z.townLit));
      const close = zooms.filter(z => z.faceRadius >= 7);
      ok('B2 *** THERE IS A FACE INSIDE THE MARK, NOT A DISC *** — colours inside his '
         + 'head at the zooms that carry one: '
         + close.map(z => 'TW' + z.TW + ' ' + z.headColours).join(', '),
         close.length > 0 && close.every(z => z.headColours >= 5));
      ok('B3 far out he stays a clean disc rather than four muddy pixels (TW18 face '
         + 'radius ' + zooms[0].faceRadius + ' is under the 7 px floor)',
         zooms[0].faceRadius < 7);

      /* ---- D. THE PEACH DOTS ANSWER FOR THEMSELVES ---------------------- */
      const lamp = await fr.evaluate(() => {
        const out = { found: 0, live: 0, named: 0, unnamed: 0, sample: null,
                      sampleNamed: false, dark: null, nolamp: null };
        for (let y = 0; y < om.n && out.found < 4000; y++)
          for (let x = 0; x < om.n; x++) {
            let d = null; try { d = CBdistAt(x, y); } catch (e) { continue; }
            if (String(d) !== 'arterial') continue;
            out.found++;
            const line = cbLampLine(x, y, d);
            let s = null; try { s = POWER.at(x, y); } catch (e) {}
            if (s && s.live) {
              out.live++;
              var held = null; try { held = POWER.holderAt(x, y); } catch (e) {}
              if (held) out.named++; else out.unnamed++;
              /* PREFER A LAMP SOMEBODY OWNS. Taking whichever cell came first is
                 taking whatever the sweep order happened to hand over, and the half
                 of the sentence that carries the ruling -- LIGHT IS TERRITORY, so
                 WHOSE wire -- would go unmeasured whenever cell zero is unowned.
                 Both are counted and both are printed. */
              if (!out.sample || (held && !out.sampleNamed)) {
                out.sample = { at: [x, y], line: line, held: held || null };
                out.sampleNamed = !!held;
              }
            }
            else if (s && s.doused && !out.dark) out.dark = { at: [x, y], line };
            else if (!out.nolamp) out.nolamp = { at: [x, y], line };
          }
        /* AND IT SAYS NOTHING AT ALL ON GROUND THAT CARRIES NO LAMP */
        let quiet = null;
        for (let y = 0; y < om.n && quiet === null; y++)
          for (let x = 0; x < om.n; x++) {
            let d = null; try { d = CBdistAt(x, y); } catch (e) { continue; }
            if (String(d) === 'arterial') continue;
            quiet = cbLampLine(x, y, d); break;
          }
        out.quiet = quiet;
        return out;
      });
      console.log('  THE PEACH DOTS: ' + lamp.found + ' lamp cells on the map, '
        + lamp.live + ' of them live  (' + lamp.named + ' on a named wire, '
        + lamp.unnamed + ' on nobody\'s)');
      if (lamp.sample) console.log('    tapping ' + lamp.sample.at.join(',')
        + ' says: "' + lamp.sample.line + '"');
      if (lamp.dark) console.log('    a doused one says: "' + lamp.dark.line + '"');
      ok('D1 there are lamp cells on his map at all (' + lamp.found + ')', lamp.found > 0);
      ok('D2 *** TAPPING A PEACH DOT SAYS WHAT IT IS *** and names whose wire it is on'
         + (lamp.sample ? ': "' + lamp.sample.line + '"' : ' — NO LIVE LAMP FOUND'),
         !!(lamp.sample && /street lamp/.test(lamp.sample.line) && /wire/.test(lamp.sample.line)));
      ok('D2b and where a faction holds the wire it is NAMED, which is the half of '
         + 'the sentence that carries LIGHT IS TERRITORY ('
         + (lamp.named ? lamp.named + ' held lamps, sample says "' + lamp.sample.line + '"'
                       : 'NO HELD LAMP ANYWHERE ON THE MAP') + ')',
         lamp.named === 0 || (lamp.sampleNamed && !/nobody/.test(lamp.sample.line)));
      ok('D3 and ground with no lamp on it says nothing, so the line is never noise ('
         + JSON.stringify(lamp.quiet) + ')', lamp.quiet === '');
      ok('D4 nothing threw' + (errs.length ? ' -> ' + errs[0] : ''), errs.length === 0);
    }
  } catch (e) {
    ok('B harness ran: ' + String(e).slice(0, 160), false);
  }
  await browser.close();
  server.close();
  console.log('='.repeat(74));
  console.log('  THE FACE ON THE MAP IS HIS: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})();
