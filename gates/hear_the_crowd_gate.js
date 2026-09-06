/* ============================================================================
   YOU HEAR IT BEFORE YOU SEE IT (9/6/26, LIFE + CITY lane)
   Round 4 of VAMILY [more people] POPULATION-DEFAULT. The row stays OPEN.

   Round 3 put the crowds on the MAP, which is a thing he has to think to open.
   NOTHING HAS EVER TOLD HIM A CROWD IS THERE WHILE HE IS WALKING, and the
   population module's own phrase for what that should feel like is "you hear a
   settlement before you see it". The walked status line has been the hard-coded
   string 'walking your own block.' since it was written.

   THE RANGE IS DERIVED, NOT PICKED, and that matters because this lane may not
   invent numbers about people. Sound from N sources falls off as 1/d^2, so a crowd
   of N carries to sqrt(N) times the distance one person does. One person is the
   repo's OWN SEE_RANGE -- 9 cells, BohemiaStanding's number for how far a body can
   be made out -- which makes the module's phrase literally true: heard further than
   seen, and a crowd much further.

   MEASURED BEFORE IT WAS BUILT, because a mechanism that is right and never happens
   is not a deliverable:
       biggest crowd standing at one place anywhere      18 people
       what that buys it                                 38 cells, about 4 screens
       at the cell he wakes on, every hour               NOTHING, correctly: the
                                                         nearest place is 97 cells
                                                         off and holds 8
       four 400-step walks from there at 10:00           two come within earshot,
                                                         first at step 91 and 156
   He has to walk toward it. That is the point, and B4 holds it: THIS IS NOT A
   COMPASS. The valley speaks only when a crowd is close enough to hear, goes quiet
   at night when everybody is indoors, and never says where anything is that you
   cannot hear.

   WORDS, NOT AN ARROW -- this repo's own ruling, from the address gate: "Morrowind
   put its directions in dialogue and no marker on the map ... Bohemia is a city
   whose phones do not work, so a compass that always knows where everybody is would
   be the strangest object in it." The line is an attempt, draft:true.
   ========================================================================== */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
               '.json': 'application/json', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

console.log('='.repeat(74));
console.log('YOU HEAR IT BEFORE YOU SEE IT — the street says a crowd is near');
console.log('='.repeat(74));

const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

/* A1. THE RANGE IS THE REPO'S OWN NUMBER AND A LAW OF PHYSICS, not a constant typed
   here. A literal earshot would be this lane inventing a fact about people. */
ok('A1 earshot is the repo\'s own SEE_RANGE times sqrt(how many are there), never a '
   + 'number typed on the surface',
   /BohemiaStanding\.SEE_RANGE/.test(CITY)
   && /SEE \* Math\.sqrt\(n\)/.test(CITY));

/* A2. THE DEFAULT LINE SURVIVES. Most of a valley this empty has nothing to hear,
   and that is the honest answer, not a gap to paper over. */
ok('A2 the walked line keeps its old default when there is nothing to hear',
   /walking your own block\./.test(CITY)
   && /if\(MODE!=='city'\)\{ try\{ var _h=pplHeardLine\(\); if\(_h\) _note=_h; \}/.test(CITY));

/* A3. THE LOUDEST, NOT THE NEAREST. A big crowd further off carries over a pair of
   voices next door, and getting that backwards would make the line point at the
   wrong thing exactly when it matters most. */
ok('A3 the one you hear is the LOUDEST, not the nearest (n over distance squared)',
   /var loud = n \/ Math\.max\(1, d \* d\)/.test(CITY));

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

  async function open(file, framed) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(String(e).slice(0, 140)));
    await page.goto('http://127.0.0.1:' + port + '/slices/' + file, { waitUntil: 'load', timeout: 300000 });
    await page.waitForTimeout(framed ? 15000 : 9000);
    if (framed) {
      await page.evaluate(() => {
        const f = document.getElementById('fronttap') || document.getElementById('front');
        if (f) f.click(); });
      await page.waitForTimeout(20000);
    }
    const target = framed
      ? (page.frames().filter(f => /BOHEMIA_CITY_WORLD/.test(f.url()))[0] || null)
      : page;
    return { ctx, page, target, errs };
  }

  const D = await open('BOHEMIA_DEMO.html', true);

  /* B1. *** IT SPEAKS ON A WALK, AND IT NAMES A WAY TO GO. *** */
  const walk = D.target ? await D.target.evaluate(() => {
    try {
      const home = [hx, hy], was = T.min;
      T.min = 10 * 60; if (typeof DAY !== 'undefined') DAY.min = 10 * 60;
      const dirs = { N: [0, -1], W: [-1, 0], E: [1, 0], S: [0, 1] };
      const out = { walks: {}, spokeIn: 0, lines: [] };
      for (const d in dirs) {
        hx = home[0]; hy = home[1];
        const v = dirs[d]; let steps = 0, spoke = 0, first = null;
        for (let i = 0; i < 400; i++) {
          if (pplStandable(hx + v[0], hy + v[1])) { hx += v[0]; hy += v[1]; }
          else if (pplStandable(hx + v[1], hy + v[0])) { hx += v[1]; hy += v[0]; }
          else break;
          steps++;
          if (i % 5) continue;
          const L = pplHeardLine();
          if (L) { spoke++; if (first === null) first = steps;
                   if (out.lines.indexOf(L) < 0 && out.lines.length < 4) out.lines.push(L); }
        }
        out.walks[d] = { steps, spoke, first };
        if (spoke) out.spokeIn++;
      }
      hx = home[0]; hy = home[1]; T.min = was;
      if (typeof DAY !== 'undefined') DAY.min = was;
      return out;
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'NO CITY FRAME' };
  const WAYS = /(north|south|east|west)/;
  ok('B1 *** THE STREET SAYS A CROWD IS NEAR, ON A WALK *** — ' + (walk.err || (
       walk.spokeIn + ' of 4 walks from where he wakes heard something: '
       + JSON.stringify(walk.lines))),
     !walk.err && walk.spokeIn > 0 && walk.lines.length > 0
     && walk.lines.every(l => WAYS.test(l)));

  /* B2. *** AND IT REACHES THE GLASS, THROUGH THE REAL HUD. *** An authored line no
     surface reads is the disease this repo has a gate against. The first probe of
     this called a function that does not exist (`hud()` rather than `updHud()`) and
     reported the line missing -- which looks exactly like a real defect. */
  const glass = D.target ? await D.target.evaluate(() => {
    try {
      const home = [hx, hy], was = T.min;
      T.min = 10 * 60; if (typeof DAY !== 'undefined') DAY.min = 10 * 60;
      let at = null;
      for (let i = 0; i < 400; i++) {
        if (pplStandable(hx, hy - 1)) hy--; else if (pplStandable(hx - 1, hy)) hx--; else break;
        if (pplHeardLine()) { at = [hx, hy]; break; }
      }
      updHud();
      const said = document.getElementById('note').textContent;
      hx = home[0]; hy = home[1]; T.min = was;
      if (typeof DAY !== 'undefined') DAY.min = was;
      updHud();
      return { at: at, said: said, backTo: document.getElementById('note').textContent };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'NO CITY FRAME' };
  ok('B2 *** IT IS ON THE GLASS *** — the walked line reads "' + (glass.said || glass.err)
     + '" where it can hear one, and goes back to "' + (glass.backTo || '?')
     + '" where it cannot',
     !glass.err && WAYS.test(String(glass.said))
     && /walking your own block/.test(String(glass.backTo)));

  /* B3. *** THE DAY HAS A SHAPE IN THE EAR. *** A street that sounds the same at two
     in the morning as at six in the evening is a spawner, not a valley. */
  const hours = D.target ? await D.target.evaluate(() => {
    try {
      const home = [hx, hy], was = T.min, rows = {};
      for (const h of [2, 6, 10, 14, 18, 22]) {
        T.min = h * 60; if (typeof DAY !== 'undefined') DAY.min = h * 60;
        hx = home[0]; hy = home[1];
        let L = null;
        for (let i = 0; i < 400; i++) {
          if (pplStandable(hx, hy - 1)) hy--; else if (pplStandable(hx - 1, hy)) hx--; else break;
          L = pplHeardLine(); if (L) break;
        }
        rows[h] = L;
      }
      hx = home[0]; hy = home[1]; T.min = was;
      if (typeof DAY !== 'undefined') DAY.min = was;
      return rows;
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'NO CITY FRAME' };
  ok('B3 the street is QUIET when everybody is indoors and speaks when they are out ('
     + (hours.err || Object.keys(hours).map(h => h + ':00 ' + (hours[h] ? 'heard' : 'quiet')).join(', ')) + ')',
     !hours.err && !hours[2] && !hours[22] && (!!hours[10] || !!hours[18]));

  /* B4. *** IT IS NOT A COMPASS, AND THIS IS THE LEG THAT KEEPS IT HONEST. *** The
     nearest crowd to the cell he wakes on is out of earshot at every hour, so the
     street must say NOTHING there. A rule that always knows where everybody is
     would be, in this repo's own words, the strangest object in a city whose phones
     do not work. */
  const notCompass = D.target ? await D.target.evaluate(() => {
    try {
      const home = [hx, hy], was = T.min, said = [];
      for (const h of [6, 10, 14, 18, 22]) {
        T.min = h * 60; if (typeof DAY !== 'undefined') DAY.min = h * 60;
        hx = home[0]; hy = home[1];
        const L = pplHeardLine();
        if (L) said.push(h + ':00 ' + L);
      }
      /* and how far the nearest crowd actually is, so the silence is explained */
      T.min = 10 * 60; if (typeof DAY !== 'undefined') DAY.min = 10 * 60;
      const P = BohemiaPopulation, span = P.NB * FN;
      const n0 = [Math.floor(hx / span), Math.floor(hy / span)];
      let near = 1e9;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++)
        for (const pl of pplPlaces(n0[0] + dx, n0[1] + dy)) {
          const d = Math.max(Math.abs(pl[0] - hx), Math.abs(pl[1] - hy));
          if (d < near) near = d;
        }
      hx = home[0]; hy = home[1]; T.min = was;
      if (typeof DAY !== 'undefined') DAY.min = was;
      return { spokeAtTheWakeCell: said, nearestPlaceCells: near === 1e9 ? null : near };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'NO CITY FRAME' };
  ok('B4 *** NOT A COMPASS *** — it says nothing at the cell he wakes on, at any hour, '
     + 'because the nearest place is ' + (notCompass.nearestPlaceCells || '?')
     + ' cells off and out of earshot'
     + (notCompass.spokeAtTheWakeCell && notCompass.spokeAtTheWakeCell.length
        ? ' BUT IT SPOKE: ' + JSON.stringify(notCompass.spokeAtTheWakeCell) : ''),
     !notCompass.err && notCompass.spokeAtTheWakeCell
     && notCompass.spokeAtTheWakeCell.length === 0
     && notCompass.nearestPlaceCells > 40);

  /* B5. WHAT IT COSTS, STATED. The lane's own [draw budget] row says anything new
     arrives with its cost in milliseconds; this draws nothing but it does walk nine
     neighbourhoods, and the HUD repaints on every step. */
  const cost = D.target ? await D.target.evaluate(() => {
    try {
      const home = [hx, hy], was = T.min;
      T.min = 10 * 60; if (typeof DAY !== 'undefined') DAY.min = 10 * 60;
      let t0 = performance.now();
      for (let i = 0; i < 200; i++) { hx = home[0] + (i % 3); PPL_HEARD_KEY = null; pplHeard(); }
      const cold = (performance.now() - t0) / 200;
      hx = home[0];
      t0 = performance.now();
      for (let i = 0; i < 2000; i++) pplHeard();
      const warm = (performance.now() - t0) / 2000;
      hx = home[0]; hy = home[1]; T.min = was;
      if (typeof DAY !== 'undefined') DAY.min = was;
      return { cold: +cold.toFixed(3), warm: +warm.toFixed(4), pctOfBeat: +(cold / 500 * 100).toFixed(2) };
    } catch (e) { return { err: String(e).slice(0, 140) }; }
  }) : { err: 'NO CITY FRAME' };
  ok('B5 it costs ' + (cost.cold || '?') + ' ms when it recomputes and '
     + (cost.warm || '?') + ' ms cached — ' + (cost.pctOfBeat || '?')
     + '% of a 500 ms beat, and it is cached per cell per ten minutes',
     !cost.err && cost.cold < 5 && cost.warm < 0.01);

  ok('B6 nothing threw' + (D.errs.length ? ' -> ' + D.errs[0] : ''), D.errs.length === 0);
  await D.ctx.close();

  console.log('  MEASURED IN THE CUT DEMO:');
  console.log('    walks that heard     : ' + (walk.spokeIn || 0) + ' of 4');
  console.log('    what it said         : ' + JSON.stringify(walk.lines || []));
  console.log('    the day in the ear   : '
    + Object.keys(hours || {}).map(h => h + ':00 ' + (hours[h] ? 'heard' : 'quiet')).join(', '));
  console.log('    cost                 : ' + (cost.cold || '?') + ' ms cold, '
    + (cost.warm || '?') + ' ms cached  [THE JOB STAYS OPEN]');

  await browser.close();
  server.close();

  console.log('='.repeat(74));
  console.log('  YOU HEAR IT BEFORE YOU SEE IT: ' + pass + ' pass / ' + fail + ' fail');
  console.log('='.repeat(74));
  process.exit(fail ? 1 : 0);
})().catch(e => {
  console.log('  FAIL harness: ' + e.message);
  console.log('  YOU HEAR IT BEFORE YOU SEE IT: ' + pass + ' pass / ' + (fail + 1) + ' fail');
  process.exit(1);
});
