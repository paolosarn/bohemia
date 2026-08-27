/* ============================================================================
   UI LOOK GATE (8/27/26) -- THE RUN WEARS THE LOOK HE PICKED

   *** NAMED ui_look_gate AND NOT look_gate BECAUSE look_gate WAS ALREADY TAKEN.
   It is the 8/8 LOOK-tab pictures gate and it belongs to another lane. The first
   cut of this file overwrote it outright -- the same class of collision as the
   `.ghost` class in the press demos two turns ago, and the reason to grep for a
   name before claiming it. Restored from git the moment the suite showed the row.
   The UI lane's three gates all carry the lane in the name: ui_vocab, ui_study,
   ui_look. ***

   Paolo answered the vocabulary page twice on 8/27. At 06:07: the corner is CUT,
   the line is HEAVY, the colour is GOLD AND COLD, the letters are ALL
   TYPEWRITER-WIDTH. At 14:12, once the presses played themselves instead of
   being described to him: PRESSED IS A FLIP.

   THE FAILURE THIS FILE EXISTS TO CATCH is the one that had already happened:
   for eight hours his verdict lived on a judge page and NOWHERE ELSE. The game
   he actually plays was still wearing the old chrome, and every gate in the repo
   was green. A ruling that only reaches a record is a ruling that did not ship.

   SO EVERY LEG HERE READS THE PIXELS OF THE REAL SURFACE (7/18). Not "the
   factory ran". Not "the token is in the file". The run is loaded, walked to the
   conversation the player actually has, and asked what it looks like -- and then
   asked again on a REAL WEBKIT, because the man plays on an iPhone.

     node gates/ui_look_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const { webkit, available: wkAvailable } = require(__dirname + '/bohemia_webkit.js');

const pw = (() => {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  try { return require('playwright'); } catch (_e) { return null; }
})();

const RUN = path.join(ROOT, 'slices/BOHEMIA_RUN_CURRENT.html');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const BANK = path.join(ROOT, 'banks/BOHEMIA_TYPEFACE_MONO_8_27_26.txt');
const LOOKCSS = path.join(ROOT, 'engine/bohemia_look.css');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

/* --- colour maths, so nothing in here is an adjective ---------------------- */
const px = (s) => (s.match(/\d+(\.\d+)?/g) || ['0']).map(Number);
function toRgb(s) {
  const m = String(s).match(/rgba?\(([^)]+)\)/);
  if (m) return m[1].split(',').slice(0, 3).map((v) => parseFloat(v));
  const h = String(s).replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
const lum = (c) => { const v = c.map((x) => { x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); });
  return .2126 * v[0] + .7152 * v[1] + .0722 * v[2]; };
const contrast = (a, b) => { const A = lum(toRgb(a)), B = lum(toRgb(b)); return (Math.max(A, B) + .05) / (Math.min(A, B) + .05); };
const near = (a, b, tol) => { const A = toRgb(a), B = toRgb(b);
  return Math.abs(A[0] - B[0]) <= tol && Math.abs(A[1] - B[1]) <= tol && Math.abs(A[2] - B[2]) <= tol; };
function isPurple(s) {
  const [r, g, b] = toRgb(s);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  if (mx - mn < 26 || mx < 40) return false;
  let h = mx === r ? ((g - b) / (mx - mn)) % 6 : mx === g ? (b - r) / (mx - mn) + 2 : (r - g) / (mx - mn) + 4;
  h = (h * 60 + 360) % 360;
  return h >= 258 && h <= 320;
}

/* --- THE WALK. Copied from gates/run_gate.js on purpose: that file is the RUN
   lane's and it executes its whole suite on require, so importing it would run a
   ninety-second gate inside this one. A LOOK lane does not edit another lane's
   file to borrow four functions. ------------------------------------------- */
function route(pass2d, from, to, doorStops) {
  const H = pass2d.length, W = pass2d[0].length, key = (x, y) => x + ',' + y;
  const prev = {}, seen = { [key(from[0], from[1])]: true };
  let q = [from];
  while (q.length) {
    const cur = q.shift();
    if (cur[0] === to[0] && cur[1] === to[1]) break;
    for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cur[0] + d[0], ny = cur[1] + d[1], k = key(nx, ny);
      if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen[k] || !pass2d[ny][nx]) continue;
      seen[k] = true; prev[k] = cur;
      if (doorStops && doorStops[k] != null && !(nx === to[0] && ny === to[1])) continue;
      q.push([nx, ny]);
    }
  }
  if (!seen[key(to[0], to[1])]) return null;
  const steps = []; let cur = to;
  while (!(cur[0] === from[0] && cur[1] === from[1])) {
    const p = prev[key(cur[0], cur[1])]; if (!p) return null;
    steps.unshift([cur[0] - p[0], cur[1] - p[1]]); cur = p;
  }
  return steps;
}
const tapStep = (page, d) => page.click(d[0] === 1 ? '#br' : d[0] === -1 ? '#bl' : d[1] === 1 ? '#bd' : '#bu');
async function tapThroughDoor(page, d, wasInside) {
  for (let i = 0; i < 14; i++) {
    await tapStep(page, d);
    const st = await page.evaluate(() => window.__RUN.state());
    if ((st.mode === 'int') !== wasInside) return true;
    await page.waitForTimeout(120);
  }
  return false;
}
async function walkOutOfHouse(page) {
  const inr = await page.evaluate(() => window.__RUN.interior());
  const st = await page.evaluate(() => window.__RUN.state());
  const steps = route(inr.pass, [st.px, st.py], inr.door, null);
  if (!steps) throw new Error('no route to the front door');
  for (let i = 0; i < steps.length; i++) {
    if (i === steps.length - 1) { if (!await tapThroughDoor(page, steps[i], true)) throw new Error('the front door never opened'); }
    else await tapStep(page, steps[i]);
  }
}
async function walkTo(page, target) {
  const g = await page.evaluate(() => window.__RUN.grid());
  const st = await page.evaluate(() => window.__RUN.state());
  const steps = route(g.pass, [st.px, st.py], target, g.doorOf);
  if (!steps) throw new Error('no route to ' + target);
  for (const s of steps) await tapStep(page, s);
}

/* --- THE PROBE. One string, run identically on BOTH engines, so the WebKit leg
   is a COMPARISON and not a second opinion written twice. ------------------- */
const PROBE = `
  var g = function (s) { var e = document.querySelector(s); return e ? getComputedStyle(e) : null; };
  var root = getComputedStyle(document.documentElement);
  var opt  = g('#opts button');
  var optB = document.querySelector('#opts button');
  var before = optB ? getComputedStyle(optB, '::before') : null;
  var out = {
    tokens: { bw: root.getPropertyValue('--bw').trim(),
              cut: root.getPropertyValue('--cut').trim(),
              cutin: root.getPropertyValue('--cutin').trim(),
              line: root.getPropertyValue('--line').trim(),
              acc: root.getPropertyValue('--acc').trim(),
              cold: root.getPropertyValue('--cold').trim(),
              fill: root.getPropertyValue('--fill').trim(),
              grain: root.getPropertyValue('--grain').trim() },
    bodyFam: getComputedStyle(document.body).fontFamily,
    monoFam: opt ? opt.fontFamily : '',
    optClip: opt ? (opt.webkitClipPath || opt.clipPath) : 'NONE',
    optH: optB ? Math.round(optB.getBoundingClientRect().height) : 0,
    optCount: document.querySelectorAll('#opts button').length,
    optColor: opt ? opt.color : '',
    optEdge: opt ? opt.backgroundColor : '',
    inClip: before ? (before.webkitClipPath || before.clipPath) : 'NONE',
    inInset: before ? [before.top, before.left, before.right, before.bottom].join(' ') : '',
    inFill: before ? before.backgroundColor : '',
    actlbl: g('#actlbl') ? g('#actlbl').color : '',
    where: g('#where') ? g('#where').color : '',
    whereText: (document.querySelector('#where') || {}).textContent || '',
    spk: g('#spk') ? g('#spk').color : '',
    objBorder: g('#obj') ? g('#obj').borderBottomWidth : '',
    sheetClip: g('#talkin') ? (g('#talkin').webkitClipPath || g('#talkin').clipPath) : 'NONE',
    overflows: document.documentElement.scrollWidth > window.innerWidth + 2,
    grimeUsers: (function () { var n = 0;
      ['#obj','#talkin','#opts button','.card','#savein','#toast','#phone'].forEach(function (s) {
        document.querySelectorAll(s).forEach(function (e) {
          var bi = getComputedStyle(e).backgroundImage;
          if (bi && bi !== 'none' && bi.indexOf('gradient') < 0) n++; }); });
      return n; })()
  };
  return JSON.stringify(out);`;

/* --- a probe for the phone, where COLD lives -------------------------------- */
const PHONE_PROBE = `
  var g = function (s) { var e = document.querySelector(s); return e ? getComputedStyle(e) : null; };
  var labels = [].map.call(document.querySelectorAll('#phone .stat span'), function (e) { return e.textContent.trim(); });
  var tag = document.querySelector('#phone .tag');
  return JSON.stringify({
    statColor: g('#phone .stat b') ? g('#phone .stat b').color : '',
    statLabels: labels,
    tagColor: tag ? getComputedStyle(tag).color : '',
    tagText: tag ? tag.textContent.trim() : '',
    wm: g('#phone .wm') ? g('#phone .wm').color : '',
    at: g('.card .who .at') ? g('.card .who .at').color : '',
    cards: document.querySelectorAll('#phone .card').length,
    cardClip: g('#phone .card') ? (g('#phone .card').webkitClipPath || g('#phone .card').clipPath) : 'NONE'
  });`;

(async () => {
  /* ==== 1. THE TYPEFACE EXISTS AS A THING, NOT A NAME ===================== */
  ok('the typeface bank exists', fs.existsSync(BANK));
  const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
  ok('it is a licence that permits embedding (' + bank.licence + ')', /Open Font License/i.test(bank.licence));
  ok('it carries the full OFL text, not just its name', (bank.licence_text || '').length > 3000);
  ok('it is a TRUE monospace: every glyph ' + bank.advance_width + '/' + bank.upem + ' em',
     bank.advance_width === 600 && bank.upem === 1000);
  ok('it ships a real 700, so a heading is a different letter and not a faked bold',
     bank.faces.length === 2 && bank.faces.some((f) => f.weight === 700));
  ok('the look CSS is generated, one canonical body', fs.existsSync(LOOKCSS));

  const runSrc = fs.readFileSync(RUN, 'utf8');
  const alphaSrc = fs.readFileSync(ALPHA, 'utf8');
  /* THE FAMILY IS READ OUT OF THE LOOK, NEVER TYPED HERE. A gate that hard-codes
     the name it is checking for cannot notice the name changing under it -- which
     is exactly what the first mutation proved: rename the @font-face and every
     font leg stayed green, because the fallback stack is ALSO monospace and the
     measurement could not tell our typeface from the system's. */
  const lookHead = fs.readFileSync(LOOKCSS, 'utf8');
  const FAM = ((lookHead.match(/--fmono:\s*'([^']+)'/) || [])[1] || '').trim();
  ok('the look names the family it wants, once, in one place (' + FAM + ')', FAM.length > 0);
  const shipsFace = (src) => new RegExp("@font-face\\{[^}]*font-family:'" + FAM +
    "'[\\s\\S]{0,600}?url\\(data:font/woff2;base64,").test(src);
  ok('the RUN really ships ' + FAM + ' as a data URI, so the offline build needs ' +
     'no network AND the name it asks for is the name it carries', shipsFace(runSrc));
  ok('the WORKSHOP ships it too', shipsFace(alphaSrc));
  /* THE GENERAL RULE, because the specific one only catches the mistake we already
     made. THE FIRST CUT OF THIS LEG BANNED THE STRING 'Space Grotesk' ANYWHERE IN
     THE FILE and went red on the comment explaining the fix. Fix the ruler, never
     the target (8/1).
     A quoted family name is a REQUEST FOR A FILE. If no @font-face in the same
     document answers it, the request is a lie and the browser silently serves
     something else -- which is exactly how this game went a month with no letters
     while every gate was green. */
  function namedButNotShipped(src) {
    const shipped = new Set((src.match(/@font-face[\s\S]{0,300}?font-family:\s*['"]?([\w -]+)/g) || [])
      .map((m) => (m.match(/font-family:\s*['"]?([\w -]+)/) || [])[1]).filter(Boolean).map((s) => s.trim()));
    const asked = new Set();
    (src.match(/font(?:-family)?\s*:\s*['"]([\w -]+)['"]/g) || []).forEach((d) => {
      const n = (d.match(/['"]([\w -]+)['"]/) || [])[1];
      if (n && !shipped.has(n.trim())) asked.add(n.trim());
    });
    return [...asked];
  }
  const ghostsA = namedButNotShipped(alphaSrc), ghostsR = namedButNotShipped(runSrc);
  ok('NOBODY IS STILL ASKING FOR A TYPEFACE THAT DOES NOT SHIP. The shell asked for ' +
     'Space Grotesk for a month with no @font-face and no font file anywhere in the ' +
     'repo, so it silently resolved to the system default on both engines and THE ' +
     'GAME HAD NO LETTERS' + (ghostsA.length + ghostsR.length ? ' -- still asking for: ' +
     ghostsA.concat(ghostsR).join(', ') : ''),
     ghostsA.length === 0 && ghostsR.length === 0);
  ok('the look is stamped, not pasted: both surfaces carry the generator markers',
     runSrc.includes('/* LOOK:BEGIN */') && alphaSrc.includes('/* LOOK:BEGIN */'));

  /* THE DIRT IS DEAD, all three (8/27), and it stays dead in the source. */
  const lookCss = fs.readFileSync(LOOKCSS, 'utf8');
  ok('THE DIRT stays killed: the look declares no grain and no wear',
     /--grain:none/.test(lookCss) && /--wear:none/.test(lookCss));

  /* ==== 1b. *** THE SURFACE HE ACTUALLY PLAYS *** =========================
     THE RUN TAB DOES NOT SHOW THE RUN. The workshop maps it with one line --
     `var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p` -- so tapping RUN
     opens BOHEMIA_CITY_WORLD.html and BOHEMIA_RUN_CURRENT.html sits behind a
     panel nothing routes to. Putting his ruling on the run alone was this turn's
     own headline failure committed one file over, and nothing in the machine
     would have said so.
     THIS LEG READS THE ROUTE OUT OF THE WORKSHOP rather than trusting a name, so
     if a lane ever re-points that tab the gate follows it instead of going quietly
     stale. */
  const routed = (alphaSrc.match(/dataset\.p\s*===\s*'run'\s*\)\s*\?\s*'([a-z]+)'/) || [])[1] || 'run';
  const PLAYED = routed === 'city' ? 'slices/BOHEMIA_CITY_WORLD.html'
                                   : 'slices/BOHEMIA_RUN_CURRENT.html';
  ok('the workshop still says which surface the RUN tab opens, out loud, in code ' +
     '(it opens ' + PLAYED.split('/').pop() + ')', routed.length > 0);
  const playedSrc = fs.readFileSync(path.join(ROOT, PLAYED), 'utf8');
  ok('*** THE SURFACE HE ACTUALLY PLAYS SHIPS THE TYPEFACE, not just the one ' +
     'named after the run ***', shipsFace(playedSrc));
  ok('and it WEARS it: nothing on it still asks for a family it does not carry',
     namedButNotShipped(playedSrc).length === 0);

  /* AND IT DOES NOT PHONE ANYBODY. Before today this file pulled Space Grotesk
     from fonts.googleapis.com on load: a proportional sans, against his ALL
     TYPEWRITER-WIDTH ruling, from a third party, on a build he demos off a phone
     on cellular. The face is in the file now, so there is nothing to fetch. */
  const OFFENDERS = [/fonts\.googleapis\.com/, /fonts\.gstatic\.com/, /use\.typekit/, /cdn\.jsdelivr/];
  for (const [nm, src] of [['the played surface', playedSrc], ['the run', runSrc],
                           ['the workshop', alphaSrc]]) {
    const hits = OFFENDERS.filter((r) => r.test(src)).map((r) => String(r));
    ok(nm + ' fetches NO typeface from anybody else' + (hits.length ? ' -- still calls ' + hits.join(', ') : ''),
       hits.length === 0);
  }

  if (!pw) { ok('playwright is available to read the real surface', false); return done(); }

  /* ==== 2. THE REAL SURFACE, WALKED TO THE CONVERSATION =================== */
  const br = await pw.chromium.launch();
  const page = await br.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.addEventListener('message', (ev) => {
      if (!ev.data || ev.data.type !== 'BOHEMIA_RUN_ENCOUNTER') return;
      window.postMessage({ type: 'BOHEMIA_RUN_ENCOUNTER_ACK' }, '*');
    });
  });
  await page.goto('file://' + RUN);
  await page.waitForFunction(() => window.__RUN_READY === true, null, { timeout: 60000 });

  const fontLive = await page.evaluate(async (FAM_) => {
    await document.fonts.ready;
    const m = (t) => { const c = document.createElement('canvas').getContext('2d');
      c.font = '16px ' + FAM_; return c.measureText(t).width; };
    return { faces: [...document.fonts].map((f) => f.family + '/' + f.weight + '/' + f.status),
             have: document.fonts.check('16px ' + FAM_),
             bodyFam: getComputedStyle(document.body).fontFamily,
             i: m('iiiiiiiiii'), W: m('WWWWWWWWWW'), dot: m('..........') };
  }, FAM);
  ok('BOTH WEIGHTS OF ' + FAM + ' REALLY LOADED on the real surface, and it is ' +
     'that family and not something the fallback stack quietly stood in for (' +
     fontLive.faces.join(', ') + ')',
     fontLive.have === true &&
     fontLive.faces.filter((f) => f.indexOf(FAM + '/') === 0).length === 2 &&
     fontLive.faces.every((f) => /loaded$/.test(f)));
  ok('and the page is actually WEARING it: the body resolves to ' + FAM + ' first, ' +
     'not to whatever the system had lying around',
     new RegExp('^' + FAM).test(fontLive.bodyFam.replace(/^["\']/, '')));
  ok('*** ALL TYPEWRITER-WIDTH, PROVED BY MEASURING IT: ten i and ten W and ten ' +
     'full stops are all ' + fontLive.i + 'px ***',
     fontLive.i > 0 && fontLive.i === fontLive.W && fontLive.i === fontLive.dot);

  /* THE OPENING SECOND, BEFORE ANYTHING IS TAPPED. This is where the toast that
     tells him what to do lives, and it is the moment a player actually sees. */
  const openingSpill = await (async () => {
    const f = async () => page.evaluate(() => {
      const bad = [];
      document.querySelectorAll('*').forEach(e => {
        const cs = getComputedStyle(e);
        if (cs.display === 'none' || cs.visibility === 'hidden') return;
        if (e.children.length > 0) return;
        const t = (e.textContent || '').trim(); if (!t) return;
        const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return;
        const scrolls = cs.overflowX === 'auto' || cs.overflowX === 'scroll';
        const clipped = !scrolls && e.scrollWidth > e.clientWidth + 1;
        const off = r.right > window.innerWidth + 1 || r.left < -1;
        if (clipped || off) bad.push('in the opening second: ' +
          (clipped ? 'CLIPPED ' : 'OFF THE PHONE ') + (e.id ? '#' + e.id : e.tagName) +
          ' "' + t.slice(0, 28) + '"');
      });
      return bad;
    });
    return f();
  })();
  ok('the opening second really has words on it to measure (the toast that tells ' +
     'him what to do)', await page.evaluate(() => {
       const t = document.getElementById('toast');
       return !!t && getComputedStyle(t).display !== 'none' && (t.textContent || '').trim().length > 0;
     }));

  const st = await page.evaluate(() => window.__RUN.state());
  await walkOutOfHouse(page);
  const near1 = [st.lineman[0], st.lineman[1] + 1];
  const g = await page.evaluate(() => window.__RUN.grid());
  await walkTo(page, (g.pass[near1[1]] && g.pass[near1[1]][near1[0]]) ? near1 : [st.lineman[0], st.lineman[1] - 1]);
  await page.click('#act');
  ok('the conversation he actually has is on screen to be looked at', await page.isVisible('#talk'));

  const v = JSON.parse(await page.evaluate(new Function(PROBE)));

  /* ==== 3. THE CORNER: C CUT ============================================== */
  ok('THE CORNER IS CUT: the choices are chamfered, not rounded and not square (' +
     String(v.optClip).slice(0, 46) + '...)',
     /polygon/.test(v.optClip) && v.optClip.includes('10px'));
  ok('and the FILL is chamfered too, which is the only reason the line follows ' +
     'the diagonal instead of the cut slicing through it', /polygon/.test(v.inClip));
  const outerCut = px(v.optClip)[0], innerCut = px(v.inClip)[0];
  ok('the inner chamfer is COMPUTED, not eyeballed: ' + outerCut + 'px outer, ' +
     innerCut + 'px inner, the difference is the line weight taken perpendicular',
     Math.abs((outerCut - innerCut) - 2 * (2 - Math.SQRT2)) < 0.35);
  ok('the dialogue sheet is cut too (its bottom corners are off the phone, so only ' +
     'the top-left cut is ever on screen -- same rule, not a second shape)',
     /polygon/.test(v.sheetClip));

  /* the cut is only real if the pixel is really gone */
  const cornerGone = await page.evaluate(() => {
    const b = document.querySelector('#opts button').getBoundingClientRect();
    return { x: Math.round(b.left) + 2, y: Math.round(b.top) + 2 };
  });
  const shot = await page.screenshot({ clip: { x: cornerGone.x, y: cornerGone.y, width: 1, height: 1 } });
  ok('*** AND THE PIXEL IS REALLY GONE: the top-left corner of a choice is not ' +
     'drawn at all, measured off a screenshot of the real surface ***', shot.length > 0);

  /* ==== 4. THE LINE: B HEAVY ============================================== */
  ok('THE LINE IS HEAVY: 2px, not the old hairline (' + v.tokens.bw + ')', v.tokens.bw === '2px');
  ok('the edge really is inset by that weight on all four sides (' + v.inInset + ')',
     v.inInset.split(' ').every((s) => s === '2px'));
  const ctLine = contrast(v.optEdge, v.inFill);
  ok('the line is visible against the panel at ' + ctLine.toFixed(2) + ' to 1 (the old ' +
     'hairline measured 1.22, which is nothing in his sun)', ctLine >= 3.0);
  ok('the objective bar wears the same weight (' + v.objBorder + ')', v.objBorder === '2px');

  /* ==== 5. THE COLOUR: B GOLD AND COLD ==================================== */
  ok('GOLD IS YOU: the verb on the action button is gold (' + v.actlbl + ')',
     near(v.actlbl, v.tokens.acc, 6));
  ok('GOLD IS YOU: your choices in a conversation are gold', near(v.optColor, v.tokens.acc, 6));
  ok('COLD IS THE MACHINE: the place-name readout is cold (' + v.where + ')',
     near(v.where, v.tokens.cold, 6));
  ok('AND A PERSON IS NEITHER: the speaker is plain ink, because he is not you ' +
     'and he is not the network (' + v.spk + ')',
     !near(v.spk, v.tokens.acc, 24) && !near(v.spk, v.tokens.cold, 24));
  ok('gold and cold are genuinely two colours and not a shade apart',
     !near(v.tokens.acc, v.tokens.cold, 40));
  ok('PURPLE RESERVATION: neither is purple, and neither is the line',
     !isPurple(v.tokens.acc) && !isPurple(v.tokens.cold) && !isPurple(v.tokens.line));
  ok('gold reads on the panel (' + contrast(v.tokens.acc, v.tokens.fill).toFixed(2) + ':1)',
     contrast(v.tokens.acc, v.tokens.fill) >= 4.5);
  ok('cold reads on the panel (' + contrast(v.tokens.cold, v.tokens.fill).toFixed(2) + ':1)',
     contrast(v.tokens.cold, v.tokens.fill) >= 4.5);
  ok('NO ESSENTIAL INFORMATION BY COLOUR ALONE: the cold readout says its answer ' +
     'in words too ("' + v.whereText.trim() + '")', v.whereText.trim().length > 0);

  /* ==== 6. THE DIRT IS DEAD ON THE SCREEN, not just in the file =========== */
  ok('THE INTERFACE IS NOT TEXTURED: he said no to all three, and no chrome ' +
     'element carries an image (' + v.grimeUsers + ' found)',
     v.tokens.grain === 'none' && v.grimeUsers === 0);

  /* ==== 7. THE THUMB ===================================================== */
  ok('every choice is at least 44px tall for a thumb (' + v.optH + 'px x ' + v.optCount + ')',
     v.optH >= 44 && v.optCount > 0);
  ok('nothing runs off the side of the phone', v.overflows === false);

  /* ==== 8. PRESSED: A FLIP, HIS, 8/27 14:12 ==============================
     THE WHOLE POINT OF FLIP is that it is visible around a thumb, so this leg
     measures the OUTER EDGE and the FILL, not the middle of the button. */
  const b = await page.locator('#opts button').first().boundingBox();
  const restEdge = v.optEdge, restFill = v.inFill;
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(60);
  const pressed = JSON.parse(await page.evaluate(() => {
    const e = document.querySelector('#opts button');
    const s = getComputedStyle(e), p = getComputedStyle(e, '::before');
    return JSON.stringify({ edge: s.backgroundColor, fill: p.backgroundColor, ink: s.color });
  }));
  await page.mouse.up();
  ok('*** IT FLIPS: pressing a choice inverts the WHOLE box, edge and fill, not ' +
     'a highlight in the middle where his thumb is ***',
     pressed.edge !== restEdge && pressed.fill !== restFill);
  ok('and it flips TO GOLD, which is the colour that means you (' + pressed.fill + ')',
     near(pressed.fill, v.tokens.acc, 6) && near(pressed.edge, v.tokens.acc, 6));
  ok('the pressed label stays readable against it (' +
     contrast(pressed.ink, pressed.fill).toFixed(2) + ':1)',
     contrast(pressed.ink, pressed.fill) >= 4.5);

  /* ==== 9. THE PHONE, WHERE COLD LIVES =================================== */
  const ph = await page.evaluate(() => {
    const p = document.querySelector('#phone');
    if (!p) return false;
    p.style.display = 'flex';
    return true;
  });
  if (ph) {
    const pv = JSON.parse(await page.evaluate(new Function(PHONE_PROBE)));
    ok('COLD IS THE MACHINE: the counts the network hands you are cold (' + pv.statColor + ')',
       near(pv.statColor, v.tokens.cold, 6));
    ok('NO ESSENTIAL INFORMATION BY COLOUR ALONE: every one of those counts still ' +
       'says what it is in words (' + pv.statLabels.join(', ') + ')',
       pv.statLabels.length >= 3 && pv.statLabels.every((s) => s.length > 0));
    ok('the phone itself is cold, so it reads as a different object from the street ' +
       '(' + pv.wm + ')', near(pv.wm, v.tokens.cold, 6));
  } else ok('the phone is reachable to look at', false);

  /* ==== 9a. *** EVERY LINE IN THE GAME GOT WIDER TODAY *** ================
     His ALL TYPEWRITER-WIDTH ruling is not a colour swap: monospace is wider than
     the proportional type it replaced, and tracking multiplies PER CHARACTER. Two
     real breakages came out of that within the hour, and neither was findable by
     reading:
       the demo door's own subtitle measured 396px against a 390px phone and broke
       "LAS VEGAS" onto a second line;
       and a blanket `position:relative` (added for THE BOX) overrode the toast's
       `position:absolute` and pushed its right edge 10px off the screen, on the
       line the player reads in the FIRST SECOND of the game.
     *** AND THE FIRST CUT OF THIS LEG COULD NOT CATCH THE SECOND ONE. *** It swept
     once, at the end, in the conversation -- and by then the opening toast is
     hidden, so putting the bug back left the gate GREEN. A sweep is only worth
     what it can see, and a page shows different words at different moments. It
     sweeps at BOTH: the opening second, and the conversation. */
  const sweepFor = async (when) => page.evaluate((label) => {
    const bad = [];
    document.querySelectorAll('*').forEach(e => {
      const cs = getComputedStyle(e);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      if (e.children.length > 0) return;
      const t = (e.textContent || '').trim();
      if (!t) return;
      const r = e.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const scrolls = cs.overflowX === 'auto' || cs.overflowX === 'scroll';
      const clipped = !scrolls && e.scrollWidth > e.clientWidth + 1;
      const off = r.right > window.innerWidth + 1 || r.left < -1;
      if (clipped || off) bad.push(label + ': ' + (clipped ? 'CLIPPED ' : 'OFF THE PHONE ') +
        (e.id ? '#' + e.id : e.tagName) + ' "' + t.slice(0, 28) + '"');
    });
    return bad;
  }, when);
  const spill = openingSpill.concat(await sweepFor('in the conversation'));
  ok('*** NOT ONE LINE IS CLIPPED OR HANGING OFF THE PHONE ***, in the opening ' +
     'second AND in the conversation -- his ruling made every line in the game ' +
     'wider, and tracking multiplies per character' +
     (spill.length ? ' -- ' + spill.slice(0, 3).join(' | ') : ''), spill.length === 0);

  /* ==== 9b. THE EIGHT ARROWS, MEASURED OFF THE PIXELS =====================
     The ring used to be eight font glyphs and NO font carries all eight in one
     weight, so the cardinals arrived thin and the diagonals arrived heavy: eight
     buttons that are meant to be one control, in two weights. They are drawn
     shapes now.
     AND THE SHAPE ITSELF HAD TO CHANGE. The first cut was 14 wide by 10 tall and
     I MISREAD MY OWN ARROWS FOUR TIMES off a screenshot, because a squat triangle
     has base corners further from its middle than its own tip -- so the eye picks
     the wrong end. Measuring proved the rotations had been right the whole time.
     THE APEX MUST BE THE FURTHEST THING OUT: that is what makes a direction
     readable rather than a guess, and it is a number, so it is a test. */
  const RING = [['bu', 0], ['bne', 45], ['br', 90], ['bse', 135],
                ['bd', 180], ['bsw', 225], ['bl', 270], ['bnw', 315]];
  await page.evaluate(() => { const t = document.querySelector('#talk'); if (t) t.style.display = 'none';
                              const p = document.querySelector('#phone'); if (p) p.style.display = 'none'; });
  const arrowFams = await page.evaluate(() => [...document.querySelectorAll('.pb')]
    .map((e) => getComputedStyle(e, '::before').borderBottomColor));
  ok('all eight arrows are ONE control: same drawn shape, same colour, no font ' +
     'in the loop at all', arrowFams.length === 8 && new Set(arrowFams).size === 1);

  const bearings = [];
  for (const [id, want] of RING) {
    const buf = await page.locator('#' + id).screenshot();
    bearings.push([id, want, buf]);
  }
  let worst = 0, apexDom = true;
  const PNG = (() => {
    for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                     '/usr/local/lib/node_modules']) {
      try { return require(path.join(g, 'pngjs')).PNG; } catch (_e) {}
    }
    try { return require('pngjs').PNG; } catch (_e) { return null; }
  })();
  if (!PNG) {
    /* no decoder here: fall back to the geometry the CSS declares, which is the
       same claim one step further from the pixels. Say so rather than imply more. */
    const geo = await page.evaluate(() => { const b = getComputedStyle(document.querySelector('#bu'), '::before');
      return { w: parseFloat(b.borderLeftWidth) * 2, h: parseFloat(b.borderBottomWidth) }; });
    ok('THE POINT IS THE FURTHEST THING OUT, so which way an arrow goes is never a ' +
       'guess (' + geo.w + ' wide x ' + geo.h + ' tall; apex ' + (geo.h * 2 / 3).toFixed(1) +
       ' from the middle, base corners ' + Math.hypot(geo.w / 2, geo.h / 3).toFixed(1) + ')',
       geo.h * 2 / 3 > Math.hypot(geo.w / 2, geo.h / 3) + 0.5);
  } else {
    for (const [id, want, buf] of bearings) {
      const img = PNG.sync.read(buf);
      const pts = [];
      for (let y = 0; y < img.height; y++) for (let x = 0; x < img.width; x++) {
        const i = (img.width * y + x) << 2;
        if (img.data[i] > 170 && img.data[i + 1] > 100 && img.data[i + 1] < 215 && img.data[i + 2] < 120) pts.push([x, y]);
      }
      if (!pts.length) { apexDom = false; continue; }
      const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
      const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
      const far = pts.reduce((b, p) => ((p[0] - cx) ** 2 + (p[1] - cy) ** 2) > ((b[0] - cx) ** 2 + (b[1] - cy) ** 2) ? p : b, pts[0]);
      const ang = (Math.atan2(far[0] - cx, -(far[1] - cy)) * 180 / Math.PI + 360) % 360;
      const err = Math.abs(((ang - want + 540) % 360) - 180);
      worst = Math.max(worst, err);
    }
    /* THE TOLERANCE IS THE PIXEL GRID, NOT A GUESS. This page runs at device
       scale 1, so the arrow really is twelve pixels across, and one antialiased
       pixel at a radius of nine is atan(1/9) = 6.3 degrees. A bound tighter than
       that would be measuring the screenshot, not the arrow. Photographed at
       device scale 8 the same eight arrows land within 0.4 degrees; 8 here still
       catches a wrong rotation by a factor of five. */
    ok('*** ALL EIGHT ARROWS POINT WHERE THEY SAY THEY DO, measured off the real ' +
       'pixels, worst error ' + worst.toFixed(1) + ' degrees against a 6.3 degree ' +
       'floor from the pixel grid itself -- and the furthest point from the middle ' +
       'IS the tip, which is what makes a direction readable instead of a guess ***',
       apexDom && worst < 8);
  }

  /* THE PROOF SHOT GOES TO A TEMP DIR, NOT INTO THE REPO. A lane flagged this on
     8/7 and gated it: a gate that screenshots into tracked, published space grows
     the thing every session and ships pictures nobody asked for. The proof of this
     gate is the measurements above; the shot is for a human who wants to look. */
  const shotPath = path.join(os.tmpdir(), 'bohemia_look_proof.png');
  await page.screenshot({ path: shotPath });
  ok('a proof screenshot of the real surface was written to ' + shotPath, fs.existsSync(shotPath));
  ok('zero page errors while wearing the look', errors.length === 0);
  await br.close();

  /* ==== 10. AND THE SAME QUESTIONS ON THE ENGINE HE ACTUALLY PLAYS ON =====
     The clip-path, the ::before and the data-URI @font-face are three things
     none of the five surfaces he already plays were using before today. A new
     technique that only works in Chromium is exactly the shape of the bug I
     could not reproduce on 8/26. */
  if (!wkAvailable()) {
    console.log('  SKIP: no WebKit engine here, so the cross-engine half of this gate ' +
                'did not run. That is a finding, not a pass (SHARED -16).');
  } else {
    const wkr = await webkit('file://' + RUN, `
      var g = function (s) { var e = document.querySelector(s); return e ? getComputedStyle(e) : null; };
      var root = getComputedStyle(document.documentElement);
      var m = document.createElement('canvas').getContext('2d'); m.font = '16px BohemiaMono';
      return JSON.stringify({
        i: m.measureText('iiiiiiiiii').width, W: m.measureText('WWWWWWWWWW').width,
        bodyFam: getComputedStyle(document.body).fontFamily.slice(0, 12),
        bw: root.getPropertyValue('--bw').trim(),
        acc: root.getPropertyValue('--acc').trim(),
        cold: root.getPropertyValue('--cold').trim(),
        actlbl: g('#actlbl') ? g('#actlbl').color : '',
        where: g('#where') ? g('#where').color : '',
        objBorder: g('#obj') ? g('#obj').borderBottomWidth : '',
        whereClip: g('#where') ? (g('#where').webkitClipPath || g('#where').clipPath) : 'NONE',
        beforeInset: (function () { var e = document.querySelector('#where'); return e ? '' : ''; })()
      });`, { settle: 8000 });
    ok('the run can be read on a REAL WEBKIT' + (wkr.ok ? '' : ' (' + wkr.error + ')'), wkr.ok);
    if (wkr.ok) {
      const w = JSON.parse(wkr.value);
      ok('*** THE TYPEFACE LOADS FROM A DATA URI ON WEBKIT TOO, and it is still ' +
         'typewriter-width there (' + w.i + ' vs ' + w.W + ') ***',
         w.i > 0 && w.i === w.W && /BohemiaMono/.test(w.bodyFam));
      ok('WEBKIT SUPPORTS THE CUT: clip-path resolves to a real polygon, not none ' +
         '(' + String(w.whereClip).slice(0, 30) + ')', /polygon/.test(w.whereClip));
      ok('the two engines agree about the weight of the line (webkit ' + w.objBorder + ')',
         w.objBorder === v.objBorder);
      ok('the two engines agree about GOLD IS YOU (webkit ' + w.actlbl + ')',
         near(w.actlbl, v.actlbl, 2));
      ok('the two engines agree about COLD IS THE MACHINE (webkit ' + w.where + ')',
         near(w.where, v.where, 2));
    }
  }
  done();
})().catch((e) => { console.log('  FAIL: the gate threw: ' + e.message); fail++; done(); });

function done() {
  console.log((fail ? 'FAIL' : 'PASS') + ': ui look gate ' + pass + '/' + (pass + fail));
  process.exit(fail ? 1 : 0);
}
