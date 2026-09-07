/* BOHEMIA -- EYES AND EARS -- WHO ACTUALLY GETS THE TAP  (E13 round 2, 9/7/26)
 *
 * THE JOB (VAMILY lane 17, E13 [half size check]):
 *   "check Paolo's 9/6 order landed: every UI element on the walked surface at 50%,
 *    and every touch target still 44 px."
 *
 * WHAT SCHOOL CHANGED, AND THE MODE REQUIRES ME TO SAY IT
 *   records/BOHEMIA_EYES_E13_ROUND_1_SCHOOL_DRAWN_IS_NOT_TOUCHED_9_6_26.md
 *
 *   School's finding: DRAWN SIZE IS NOT TOUCH SIZE, and splitting them on purpose is
 *   the recommended technique. getBoundingClientRect measures PAINT and cannot see a
 *   hit area at all, so the check has to hit-test. That alone would have been half an
 *   instrument, because of what the UI lane wrote in the shipped file:
 *
 *     "a real driven tap landed 2 of 11 while an in-page hit test insisted on 12 of 12"
 *     "three harnesses disagreed with each other"
 *
 *   An in-page hit test and a real tap are not the same measurement, and when they
 *   disagree the real tap is the one the player performs. So this tool measures THREE
 *   things per control and prints all three side by side:
 *
 *     1 DRAWN    getBoundingClientRect, CSS px, in the PHONE's coordinates
 *     2 REACH    hit-tested with elementFromPoint walking out from the centre
 *     3 THE TAP  a real driven tap, and WHICH ELEMENT ACTUALLY RECEIVED IT
 *
 *   The third column is the one nobody had. When a tap does not land it names the
 *   element that took it instead, which is the difference between "the presses do not
 *   land" and knowing who is stealing them.
 *
 * RULE ZERO (E9): a zero needs a positive control, and this job has a specific trap.
 *   A broken hit-test silently degrades into the old wrong check: it returns the drawn
 *   box every time and looks completely plausible. So before any number is believed,
 *   two controls are planted -- one drawn small WITH an expanded reach (its reach must
 *   measure BIGGER than its paint) and one with none (they must measure the SAME) --
 *   and a third that is known tappable, to prove the driven tap works at all.
 *
 * OUT: records/BOHEMIA_EYES_THUMBS_9_7_26.json
 */
const path = require('path'), fs = require('fs');
function pw(){ for (const p of ['/opt/node22/lib/node_modules/playwright','playwright','/usr/lib/node_modules/playwright','/usr/local/lib/node_modules/playwright']) { try { return require(p); } catch(e){} } throw new Error('playwright not found'); }
const { chromium } = pw();
const PHONE = { viewport:{width:390,height:844}, deviceScaleFactor:2, isMobile:true, hasTouch:true };
const AAA = 44, AA = 24;

/* runs inside the city frame */
const RECORDER = `(() => {
  if (window.__EYES_TAPS) return 'already';
  window.__EYES_TAPS = [];
  const grab = (ev) => {
    const t = ev.target;
    window.__EYES_TAPS.push({
      type: ev.type,
      x: Math.round(ev.clientX), y: Math.round(ev.clientY),
      id: (t && t.id) || '', tag: (t && t.tagName) || '',
      cls: (t && t.className && String(t.className).slice(0,60)) || '',
      // the chain up to the first thing with an id, so a hit on an inner span still names its button
      owner: (() => { let n = t; for (let i=0;i<6 && n;i++){ if (n.id) return n.id; n = n.parentElement; } return ''; })()
    });
  };
  ['pointerdown','click'].forEach(t => document.addEventListener(t, grab, true));
  return 'installed';
})()`;

/* measure one control: drawn rect + hit-tested reach, all frame-local CSS px.
   BUG 1: this was a template STRING. Playwright evaluates a string as an expression and
   hands back its value, so a string holding an arrow function came back as undefined and
   the instrument could not see a control it had planted itself. It refused to report,
   which is the behaviour I wanted, but the cause was mine. It is a real function now. */
const MEASURE = (id) => {
  const e = document.getElementById(id);
  if (!e) return { id, missing: true };
  const r = e.getBoundingClientRect();
  if (!(r.width > 0 && r.height > 0)) return { id, hidden: true };
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  const mine = (n) => { while (n) { if (n === e) return true; n = n.parentElement; } return false; };
  const walk = (dx, dy) => {
    let d = 0;
    for (let i = 1; i <= 120; i++) {
      const x = cx + dx * i, y = cy + dy * i;
      if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) break;
      if (!mine(document.elementFromPoint(x, y))) break;
      d = i;
    }
    return d;
  };
  const centreIsMine = mine(document.elementFromPoint(cx, cy));
  const L = walk(-1, 0), R = walk(1, 0), T = walk(0, -1), B = walk(0, 1);
  const nameAt = () => {
    const n = document.elementFromPoint(cx, cy); if (!n) return 'nothing';
    let m = n; for (let i = 0; i < 6 && m; i++) { if (m.id) return m.id; m = m.parentElement; }
    return (n.tagName || '?') + '.' + String(n.className || '').slice(0, 30);
  };
  return { id,
    drawn: { w: +r.width.toFixed(1), h: +r.height.toFixed(1), left: +r.left.toFixed(1), top: +r.top.toFixed(1) },
    reach: { w: centreIsMine ? L + R + 1 : 0, h: centreIsMine ? T + B + 1 : 0 },
    centreIsMine, topAtCentre: nameAt(),
    centre: { x: +cx.toFixed(1), y: +cy.toFixed(1) } };
};


/* WHAT IS COVERING THE SCREEN, AND CLEARING IT THE WAY A FINGER WOULD.
   BUG 2, AND IT WAS ABOUT TO BE THE HEADLINE. The first honest run reported that
   11 of 14 controls on the shipped build clear no touch bar at all and 8 of them
   take no tap. That is a game with unpressable buttons, and it was false: the day
   card (#daycard, class "on", z-index 40, 378x773) was up over the whole screen.
   A modal blocking what is under it is correct behaviour, not a defect, and this
   lane has shipped a false "the button is broken" headline once already (E0's
   SLEEP button, withdrawn). So the sweep now REFUSES to measure while anything is
   covering the screen, and clears it by tapping the scrim the way the game says it
   is cleared, never by calling the game's own hide function. */
async function clearOverlays(page, city, off) {
  const log = [];
  for (let pass = 0; pass < 4; pass++) {
    const cover = await city.evaluate(() => {
      const area = innerWidth * innerHeight;
      let best = null;
      for (const n of document.querySelectorAll('div,section,dialog')) {
        const cs = getComputedStyle(n);
        if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') continue;
        if (cs.pointerEvents === 'none') continue;
        if (cs.position === 'static') continue;
        const r = n.getBoundingClientRect();
        if (r.width * r.height < area * 0.25) continue;
        const z = parseInt(cs.zIndex, 10);
        if (!(z > 0)) continue;                       // the stage and the canvas are z:auto
        if (!best || z > best.z) {
          // the biggest child is the card itself; the gap around it is the scrim
          let kid = null;
          for (const k of n.children) {
            const kr = k.getBoundingClientRect();
            if (!kid || kr.width * kr.height > kid.w * kid.h) kid = { w: kr.width, h: kr.height, left: kr.left, top: kr.top, right: kr.right, bottom: kr.bottom };
          }
          best = { id: n.id || '', cls: String(n.className).slice(0, 30), z,
                   w: Math.round(r.width), h: Math.round(r.height), left: r.left, top: r.top, right: r.right, bottom: r.bottom, kid };
        }
      }
      return best;
    });
    if (!cover) return { cleared: true, log };
    // tap the scrim: a point inside the overlay but outside its card
    let x, y;
    if (cover.kid && cover.top < cover.kid.top - 8) { x = cover.left + cover.w / 2; y = cover.top + (cover.kid.top - cover.top) / 2; }
    else if (cover.kid && cover.bottom > cover.kid.bottom + 8) { x = cover.left + cover.w / 2; y = cover.bottom - (cover.bottom - cover.kid.bottom) / 2; }
    else if (cover.kid && cover.left < cover.kid.left - 8) { x = cover.left + (cover.kid.left - cover.left) / 2; y = cover.top + cover.h / 2; }
    else { x = cover.left + 4; y = cover.top + 4; }
    log.push({ pass, covering: cover.id || cover.cls, z: cover.z, size: cover.w + 'x' + cover.h, tappedAt: { x: Math.round(x), y: Math.round(y) } });
    try { await page.mouse.click(off.x + x, off.y + y); } catch (e) {}
    await page.waitForTimeout(700);
  }
  const still = await city.evaluate(() => {
    const area = innerWidth * innerHeight;
    for (const n of document.querySelectorAll('div,section,dialog')) {
      const cs = getComputedStyle(n);
      if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0' || cs.pointerEvents === 'none' || cs.position === 'static') continue;
      const r = n.getBoundingClientRect();
      if (r.width * r.height >= area * 0.25 && parseInt(cs.zIndex, 10) > 0) return (n.id || String(n.className)).slice(0, 40);
    }
    return null;
  });
  return { cleared: !still, stillCovering: still, log };
}

/* BUG 4, AND IT IS THE SUBTLEST ONE THIS ROUND: A SWEEP THAT TAPS CHANGES THE SCREEN
   IT IS MEASURING. Tapping the controls in order meant tapping phonebtn, which OPENS
   THE PHONE PANEL, and every control measured after that was measured underneath an
   open phone. Six controls read as unpressable and the thing on top of them was
   #phoneslot -- a panel my own previous tap had opened. So the screen is put back
   between every single control now, and each measurement is independent of the last. */
async function resetScreen(page, city, off) {
  // close anything with a close glyph, then clear any full-screen scrim
  const closed = await city.evaluate(() => {
    let n = 0;
    for (const e of document.querySelectorAll('*')) {
      const t = (e.textContent || '').trim();
      if (t !== '\u2715' && t !== '\u00d7' && t !== 'X') continue;
      const r = e.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && getComputedStyle(e).pointerEvents !== 'none') { e.click(); n++; }
    }
    return n;
  }).catch(() => 0);
  if (closed) await page.waitForTimeout(400);
  return clearOverlays(page, city, off);
}

async function measureAll(page, city, ids, off) {
  const out = [];
  for (const id of ids) {
    await resetScreen(page, city, off);
    const m = await city.evaluate(MEASURE, id).catch(e => ({ id, err: String(e).slice(0,80) }));
    if (m.missing || m.hidden || m.err) { out.push(m); continue; }
    // THE REAL TAP, in the phone's coordinates. The frame's own offset is added here
    // because a frame-local coordinate driven at the page is a tap somewhere else.
    await city.evaluate('window.__EYES_TAPS.length = 0');
    await page.evaluate('if (window.__EYES_TAPS) window.__EYES_TAPS.length = 0').catch(() => {});
    const px = off.x + m.centre.x, py = off.y + m.centre.y;
    let tapErr = null;
    try { await page.mouse.click(px, py); } catch (e) { tapErr = String(e).slice(0,80); }
    await page.waitForTimeout(140);
    const taps = await city.evaluate('window.__EYES_TAPS.slice()').catch(() => []);
    // BUG 3, AND IT IS THE ONE THE UI LANE'S THREE DISAGREEING HARNESSES WERE HITTING:
    // the recorder only listened INSIDE the walked surface's frame. A real tap can be
    // taken by the ALPHA SHELL that the frame sits in, and then nothing at all arrives
    // in the frame, which reads as "NOBODY" and says nothing about who is at fault.
    // Listening in the parent too is what turns "the press does not land" into a name.
    const shell = await page.evaluate('window.__EYES_TAPS ? window.__EYES_TAPS.slice() : []').catch(() => []);
    const got = taps.find(t => t.type === 'click') || taps[0] || null;
    const shellGot = shell.find(t => t.type === 'click') || shell[0] || null;
    m.tap = { at: { x: Math.round(px), y: Math.round(py) },
              landed: !!(got && (got.owner === id || got.id === id)),
              receivedBy: got ? (got.owner || got.id || (got.tag + '.' + got.cls))
                        : (shellGot ? 'THE SHELL: ' + (shellGot.owner || shellGot.id || (shellGot.tag + '.' + shellGot.cls)) : 'NOBODY'),
              insideFrame: taps.length, inShell: shell.length, err: tapErr };
    out.push(m);
  }
  return out;
}

function verdict(m) {
  if (m.missing) return 'MISSING';
  if (m.hidden) return 'HIDDEN';
  const w = m.reach.w, h = m.reach.h;
  if (!m.centreIsMine) return 'BURIED';
  if (w >= AAA && h >= AAA) return 'CLEARS 44';
  if (w >= AA && h >= AA) return 'CLEARS 24';
  return 'UNDER 24';
}

(async () => {
  const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium' });
  const ctx = await browser.newContext(PHONE);
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0,140)));
  await page.goto('file://' + path.resolve('slices/BOHEMIA_ALPHA_0_9.html'), { waitUntil:'load' });
  await page.waitForTimeout(2500);
  try { await page.click('#front', { timeout:4000 }); } catch(e){}
  await page.waitForTimeout(8000);

  const city = page.frames().find(f => f.url().includes('CITY_WORLD'));
  if (!city) { console.log('NO CITY FRAME. Nothing to measure.'); await browser.close(); process.exit(1); }
  const fe = await page.$('#cityFrame');
  const box = await fe.boundingBox();
  const off = { x: box.x, y: box.y };
  console.log('the walked surface sits at ' + Math.round(off.x) + ',' + Math.round(off.y) +
              ' and is ' + Math.round(box.width) + 'x' + Math.round(box.height) + ' CSS px inside a 390x844 phone');
  await city.evaluate(RECORDER);
  await page.evaluate(RECORDER);   // the shell too: a tap the frame never sees was taken by somebody

  const overlays = await clearOverlays(page, city, off);
  if (overlays.log.length) {
    console.log('');
    console.log('SOMETHING WAS COVERING THE SCREEN, AND A MODAL IS NOT A BROKEN BUTTON:');
    for (const l of overlays.log) console.log('   ' + l.covering + ' (z ' + l.z + ', ' + l.size + ') -- tapped the scrim at ' + l.tappedAt.x + ',' + l.tappedAt.y);
  }
  if (!overlays.cleared) {
    console.log('');
    console.log('   REFUSING TO REPORT. ' + overlays.stillCovering + ' is still covering the screen, so every');
    console.log('   control under it would read as unpressable and that would be a lie about the game.');
    await browser.close();
    process.exit(1);
  }

  /* ---- RULE ZERO: prove the instrument separates paint from reach ---------- */
  const planted = await city.evaluate(`(() => {
    const mk = (id, expand) => {
      const d = document.createElement('div');
      d.id = id; d.textContent = '.';
      d.style.cssText = 'position:fixed;left:40px;top:' + (expand ? 300 : 400) + 'px;width:10px;height:10px;' +
        'background:#111;color:#111;z-index:2147483000;font-size:4px;line-height:10px';
      if (expand) { d.style.position = 'fixed'; }
      document.body.appendChild(d);
      if (expand) {
        const s = document.createElement('style');
        s.id = id + 'css';
        s.textContent = '#' + id + '{position:fixed}#' + id + '::before{content:"";position:absolute;inset:-20px;pointer-events:auto}';
        document.head.appendChild(s);
      }
      return d;
    };
    mk('__eyes_reach_big', true);
    mk('__eyes_reach_none', false);
    return true;
  })()`);
  const cBig = await city.evaluate(MEASURE, '__eyes_reach_big').catch(e => ({ err: String(e).slice(0,120) }));
  const cNone = await city.evaluate(MEASURE, '__eyes_reach_none').catch(e => ({ err: String(e).slice(0,120) }));
  if (!cNone || !cNone.centre || !cBig || !cBig.centre) {
    console.log('   the planted controls did not measure: big=' + JSON.stringify(cBig) + ' none=' + JSON.stringify(cNone));
    console.log('   REFUSING TO REPORT: the instrument cannot even see a control it planted itself.');
    await browser.close();
    process.exit(1);
  }
  await city.evaluate('window.__EYES_TAPS.length = 0');
  await page.mouse.click(off.x + cNone.centre.x, off.y + cNone.centre.y);
  await page.waitForTimeout(140);
  const tapProof = await city.evaluate('window.__EYES_TAPS.slice()');
  const controls = [
    ['a planted control with an expanded reach measures BIGGER than its paint',
     cBig.reach && cBig.drawn && cBig.reach.w > cBig.drawn.w + 4],
    ['a planted control with no expansion measures the SAME as its paint',
     cNone.reach && cNone.drawn && Math.abs(cNone.reach.w - cNone.drawn.w) <= 3],
    ['a real driven tap reaches the page at all',
     tapProof.some(t => (t.owner || t.id) === '__eyes_reach_none')],
  ];
  console.log('');
  console.log('RULE ZERO -- the instrument has to separate paint from reach before any number counts');
  let ok = true;
  for (const [n, good] of controls) { console.log((good ? '   PASS  ' : '   FAIL  ') + n); ok = ok && good; }
  console.log('   planted big:  paint ' + (cBig.drawn ? cBig.drawn.w + 'x' + cBig.drawn.h : '?') + '  reach ' + (cBig.reach ? cBig.reach.w + 'x' + cBig.reach.h : '?'));
  console.log('   planted none: paint ' + (cNone.drawn ? cNone.drawn.w + 'x' + cNone.drawn.h : '?') + '  reach ' + (cNone.reach ? cNone.reach.w + 'x' + cNone.reach.h : '?'));
  await city.evaluate(`(() => { ['__eyes_reach_big','__eyes_reach_none','__eyes_reach_bigcss','__eyes_reach_nonecss']
    .forEach(id => { const n = document.getElementById(id); if (n) n.remove(); }); })()`);
  if (!ok) {
    console.log('');
    console.log('   REFUSING TO REPORT. An instrument that cannot tell paint from reach would print the');
    console.log('   old wrong check and look completely plausible. Nothing below can be trusted.');
    await browser.close();
    process.exit(1);
  }

  /* ---- the controls the run actually has ---------------------------------- */
  const ids = await city.evaluate(`(() => {
    const half = window.BOHEMIA_HALF;
    const known = ['musbtn','savebtn','phonebtn','outfitbtn','rungbtn','buildbtn','mktbtn',
                   'modechip','fitbtn','bikebtn','sleepbtn','hud','note','hmode','hclock','hslot','modeLbl'];
    const found = known.filter(id => document.getElementById(id));
    // plus anything else that looks pressable and has an id
    const extra = [...document.querySelectorAll('button,[role=button],.pb')]
      .map(n => n.id).filter(id => id && !found.includes(id));
    return { found, extra, halfPresent: !!half, halfOn: half ? half.on() : null };
  })()`);
  const all = [...ids.found, ...ids.extra];
  console.log('');
  console.log('CONTROLS FOUND: ' + all.length + '   (the half-size code is ' +
              (ids.halfPresent ? 'present and currently ' + (ids.halfOn ? 'ON' : 'OFF') : 'NOT PRESENT') + ')');

  const passA = await measureAll(page, city, all, off);

  /* ---- turn the halving ON and measure the same controls again ------------- */
  let passB = null, turnedOn = null;
  if (ids.halfPresent) {
    turnedOn = await city.evaluate(`(() => { try { BOHEMIA_HALF.back(); return BOHEMIA_HALF.on(); } catch(e) { return 'err: ' + String(e).slice(0,80); } })()`);
    await page.waitForTimeout(1200);
    passB = await measureAll(page, city, all, off);
    await city.evaluate(`(() => { try { BOHEMIA_HALF.off(); } catch(e){} })()`);
  }

  await browser.close();

  const table = (rows, title) => {
    console.log('');
    console.log('=== ' + title + ' ===');
    console.log('   control          paint       reach       clears     tap lands   who got it');
    for (const m of rows) {
      if (m.missing || m.hidden || m.err) { console.log('   ' + m.id.padEnd(16) + (m.missing ? 'not on this screen' : m.hidden ? 'zero size' : m.err)); continue; }
      console.log('   ' + m.id.padEnd(16) +
        (m.drawn.w + 'x' + m.drawn.h).padEnd(12) +
        (m.reach.w + 'x' + m.reach.h).padEnd(12) +
        verdict(m).padEnd(11) +
        (m.tap.landed ? 'yes' : 'NO ').padEnd(12) +
        (m.tap.landed ? '' : m.tap.receivedBy));
    }
    const real = rows.filter(m => !m.missing && !m.hidden && !m.err);
    const land = real.filter(m => m.tap.landed).length;
    const c44 = real.filter(m => verdict(m) === 'CLEARS 44').length;
    const c24 = real.filter(m => verdict(m) === 'CLEARS 24').length;
    const bad = real.filter(m => verdict(m) === 'UNDER 24' || verdict(m) === 'BURIED').length;
    console.log('   -> ' + real.length + ' measured: ' + c44 + ' clear 44, ' + c24 + ' clear 24 only, ' + bad + ' clear neither');
    console.log('   -> THE TAP LANDS ON ' + land + ' OF ' + real.length);
    return { measured: real.length, landed: land, clears44: c44, clears24: c24, neither: bad };
  };

  const sumA = table(passA, 'HALVING OFF (what ships today)');
  const sumB = passB ? table(passB, 'HALVING ON (BOHEMIA_HALF.back(), turned on for this measurement only)') : null;

  if (sumB) {
    console.log('');
    console.log('=== DID IT ACTUALLY HALVE? ===');
    // School worried this was unanswerable: half of WHAT, if no file holds the before.
    // It IS answerable, and for a reason school did not predict: the halving ships as a
    // SWITCH that is off, so both states can be measured in one run and the ratio is exact.
    const ratios = [];
    for (const a of passA) {
      const b = passB.find(x => x.id === a.id);
      if (!a.drawn || !b || !b.drawn) continue;
      ratios.push({ id: a.id, w: a.drawn.w / b.drawn.w ? +(b.drawn.w / a.drawn.w).toFixed(2) : null,
                    h: +(b.drawn.h / a.drawn.h).toFixed(2), from: a.drawn.w + 'x' + a.drawn.h, to: b.drawn.w + 'x' + b.drawn.h });
    }
    for (const r of ratios) console.log('   ' + r.id.padEnd(14) + r.from.padEnd(13) + '-> ' + r.to.padEnd(12) + 'width x' + r.w + '   height x' + r.h);
    const ws = ratios.map(r => r.w).filter(v => v && isFinite(v)).sort((x, y) => x - y);
    const med = ws.length ? ws[Math.floor(ws.length / 2)] : null;
    console.log('   MEDIAN WIDTH RATIO: x' + med + '   (half is x0.50)');

    console.log('');
    console.log('=== WHAT THE HALVING DOES ===');
    console.log('   taps landing:  ' + sumA.landed + '/' + sumA.measured + '  ->  ' + sumB.landed + '/' + sumB.measured);
    console.log('   clear 44:      ' + sumA.clears44 + '  ->  ' + sumB.clears44);
    console.log('   clear neither: ' + sumA.neither + '  ->  ' + sumB.neither);
    const lost = passA.filter(a => a.tap && a.tap.landed).map(a => a.id)
      .filter(id => { const b = passB.find(x => x.id === id); return b && b.tap && !b.tap.landed; });
    if (lost.length) {
      console.log('   CONTROLS THAT WORK NOW AND STOP WORKING WHEN IT IS TURNED ON: ' + lost.length);
      for (const id of lost) {
        const b = passB.find(x => x.id === id);
        console.log('      ' + id.padEnd(14) + ' tap taken instead by: ' + b.tap.receivedBy);
      }
    } else {
      console.log('   no control that works today stops working when the halving is turned on.');
    }
  }

  fs.writeFileSync('records/BOHEMIA_EYES_THUMBS_9_7_26.json', JSON.stringify({
    what: 'EYES AND EARS -- E13 [half size check] round 2. Who actually gets the tap.',
    date: '9/7/26',
    school: 'records/BOHEMIA_EYES_E13_ROUND_1_SCHOOL_DRAWN_IS_NOT_TOUCHED_9_6_26.md',
    bars: { AAA_enhanced: AAA, AA_minimum: AA,
            note: 'WCAG 2.2 AA is 24x24 CSS px with a spacing rule; 44 is the AAA bar and the Apple guideline. Both are reported, never collapsed.' },
    phone: PHONE, frameOffset: off,
    ruleZero: { plantedBig: cBig, plantedNone: cNone, passed: ok },
    overlays,
    halfPresent: ids.halfPresent, halfWasOn: ids.halfOn, turnedOn,
    blind_spots: [
      'one viewport and one device pixel ratio is not every phone',
      'controls only reachable down a path this walk never takes are not enumerated',
      'a control hidden at capture time is not the same as one that does not exist',
      'this measures geometry and event delivery, never whether the thing is legible'
    ],
    passOff: passA, passOn: passB, summaryOff: sumA, summaryOn: sumB, pageErrors: errs,
    note: 'the before exists because the halving ships as a switch that is off, so both states are measured in one run'
  }, null, 1));
  console.log('');
  console.log('written: records/BOHEMIA_EYES_THUMBS_9_7_26.json');
})();
