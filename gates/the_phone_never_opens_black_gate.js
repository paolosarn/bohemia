/* ============================================================================
   THE PHONE NEVER OPENS BLACK  (UI lane 11, 9/24) -- row [phone black].

   *** THE COORDINATOR'S WORDS, off my own 400c374: "the phone's own screen is black
   about three seconds the first time it opens, anywhere... A phone that opens black is
   the 9/22b black rectangle in miniature." ***
   (9/22b is Paolo tapping a door and getting a black rectangle for two minutes.)

   MEASURED BEFORE ANYTHING WAS WRITTEN, on a fresh cut, a real touch, photographing the
   SLOT rather than asking the iframe how it feels:
       120 ms after the tap   0.05% of the slot's pixels above black
       400 ms                 1.03%
       800 ms and after       3.24%   (the phone's own screen, settled)
   AND IDENTICAL AT 4x CPU THROTTLING, which says the wait is the 2.1 MB fetch and parse
   of the phone's page and NOT the processor. So a fix that makes it faster is a fix that
   stops holding on a slower phone. The property this gate holds is not a duration:

       AT NO MOMENT BETWEEN THE TOUCH AND THE PHONE BEING UP IS THE GLASS BLACK.

   WHAT I COULD NOT DO, SAID PLAINLY. I could not reproduce his three seconds here by
   holding the network back: a glob route matched nothing on a url that plainly contains
   the name, and with a catch-all the page made NO request for the phone's page at all --
   something between the page and the probe (the service worker this game registers)
   answers it. So the wait is held open where it actually matters instead: the game's own
   "is the page in yet" answer is pinned to false, which is exactly what a phone that has
   not finished loading looks like, and the glass is photographed through it.

   Run: node gates/the_phone_never_opens_black_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const CITY = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8');

let pass = 0, fail = 0;
const ok = (m, g, extra) => {
  if (typeof g === 'string') throw new Error('GATE BUG: ok(message, condition)');
  g ? pass++ : fail++;
  console.log((g ? '  ok   ' : '  FAIL ') + m + (extra ? '  [' + extra + ']' : ''));
};
const done = (d) => {
  console.log('\nTHE PHONE NEVER OPENS BLACK: ' + pass + ' ok, ' + fail + ' failed');
  if (d) d.close().catch(() => {});
  process.exit(fail ? 1 : 0);
};

/* HOW MUCH OF THE GLASS IS LIT, straight off the pixels. Decoding a PNG by hand rather
   than pulling in an image library the repo does not already carry: the IDAT chunks are
   inflated with node's own zlib and the filters undone, which is thirty lines and no
   dependency. The number is the fraction of pixels brighter than 40/255.
   WHERE THE FLOOR IS AND WHY, FROM THE READINGS AND NOT FROM FEEL. Black glass measured
   0.05, 0.06 and 0.06 percent across a run and two mutations. Every LIT frame -- the face,
   the phone's lock screen, the phone mid-render -- measured 0.93, 1.03, 1.10, 1.11, 1.12,
   1.69, 1.70, 1.77, 2.23 and 3.24. The gap is a factor of FIFTEEN and the floor sits in
   the middle of it: four times the darkest black, and nearly four times under the darkest
   lit frame.
   MY FIRST FLOOR WAS 1.0% AND IT WAS WRONG. It was picked off the face (1.7%) against
   black, and it then went red on a build that is right, when the phone's own page rendered
   at 0.93%. A threshold set against only one of the two things it separates is not a
   threshold, and it would have had the next lane deleting a correct screen. */
const LIT_FLOOR = 0.0025;
const zlib = require('zlib');
function litFraction(file) {
  const b = fs.readFileSync(file);
  let p = 8, w = 0, h = 0, bd = 0, ct = 0, idat = [];
  while (p < b.length) {
    const len = b.readUInt32BE(p), type = b.toString('ascii', p + 4, p + 8);
    if (type === 'IHDR') { w = b.readUInt32BE(p + 8); h = b.readUInt32BE(p + 12);
      bd = b[p + 16]; ct = b[p + 17]; }
    else if (type === 'IDAT') idat.push(b.slice(p + 8, p + 8 + len));
    else if (type === 'IEND') break;
    p += len + 12;
  }
  if (bd !== 8) throw new Error('this reader wants 8 bits a channel, got ' + bd);
  const ch = ({ 0: 1, 2: 3, 4: 2, 6: 4 })[ct];
  if (!ch) throw new Error('unsupported colour type ' + ct);
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * ch;
  const cur = Buffer.alloc(stride), prev = Buffer.alloc(stride);
  let lit = 0, q = 0;
  for (let y = 0; y < h; y++) {
    const f = raw[q++];
    raw.copy(cur, 0, q, q + stride); q += stride;
    for (let i = 0; i < stride; i++) {
      const a = i >= ch ? cur[i - ch] : 0, bb = prev[i], c = i >= ch ? prev[i - ch] : 0;
      let v = cur[i];
      if (f === 1) v += a; else if (f === 2) v += bb; else if (f === 3) v += (a + bb) >> 1;
      else if (f === 4) { const pp = a + bb - c, pa = Math.abs(pp - a), pb = Math.abs(pp - bb),
        pc = Math.abs(pp - c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? bb : c); }
      cur[i] = v & 255;
    }
    for (let x = 0; x < w; x++) {
      const o = x * ch;
      const lum = ch >= 3 ? (cur[o] * 0.299 + cur[o + 1] * 0.587 + cur[o + 2] * 0.114) : cur[o];
      if (lum > 40) lit++;
    }
    cur.copy(prev);
  }
  return lit / (w * h);
}

(async () => {
  console.log('\nTHE PHONE NEVER OPENS BLACK  (row [phone black])\n');

  /* ---- the source facts that carry it ---- */
  ok('the slot has a face underneath the frame',
     /<div id="phoneboot"/.test(CITY) && /#phoneboot\{position:absolute;inset:0;z-index:2/.test(CITY));
  ok('  and the face comes off by a class, not by a timer',
     /#phoneslot\.ready #phoneboot\{display:none\}/.test(CITY));
  ok('  and nothing in the phone path sets a timer to take it off',
     !/setTimeout[^;]*phoneslot|setTimeout[^;]*phoneboot/.test(CITY));
  ok('  and the hour on it comes from the game\'s one clock, not a literal',
     /function phoneBootFace\(\)[\s\S]{0,600}clockStr\(\)/.test(CITY));
  ok('  and the crack is CLONED from the pocket phone, not drawn a second time',
     /getElementById\('cityfeedglass'\)[\s\S]{0,200}cloneNode\(true\)/.test(CITY)
     && (CITY.match(/M88 18 L61 74/g) || []).length === 1,
     'copies of the fracture path in the file: ' + (CITY.match(/M88 18 L61 74/g) || []).length);

  const cut = path.join(os.tmpdir(), 'BOHEMIA_PHONEBLACK_CUT.html');
  require('child_process').execFileSync(process.execPath,
    [path.join(ROOT, 'tools/bohemia_cut_the_demo.js'), '--out', cut], { stdio: 'pipe' });
  const d = await open({ serve: { 'BOHEMIA_DEMO.html': cut }, file: 'BOHEMIA_DEMO.html' });
  ok('the driver is really inside the game, not still on the splash', d.doorIsBehindUs());

  const shots = fs.mkdtempSync(path.join(os.tmpdir(), 'phoneblack-'));
  const tapPhone = async () => {
    const box = await d.fr.evaluate(() => {
      const f = document.getElementById('cityfeed'), b = f.getBoundingClientRect();
      return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
    });
    const fb = await (await d.fr.frameElement()).boundingBox();
    await d.page.mouse.click(fb.x + box.x, fb.y + box.y);
  };
  /* PHOTOGRAPH THE GLASS AS FAST AS THIS CAN TAKE PICTURES, from the touch onward. A
     handful of chosen moments walks straight past a dark frame; the question is the WORST
     frame, so the answer is every frame it can get.
     IT CLIPS THE PAGE RATHER THAN SHOOTING THE ELEMENT. Measured, four shots each way:
     locator.screenshot 2,272 ms a picture, page.screenshot with a clip 211 ms. The first
     is not a sampler at all -- the first cut of this gate took ONE photograph in 2.6 s and
     reported it as a window. */
  const slotClip = async () => {
    const r = await d.fr.evaluate(() => {
      const b = document.getElementById('phoneslot').getBoundingClientRect();
      return { x: b.x, y: b.y, w: b.width, h: b.height };
    });
    const fb = await (await d.fr.frameElement()).boundingBox();
    return { x: fb.x + r.x, y: fb.y + r.y, width: r.w, height: r.h };
  };
  const watch = async (ms) => {
    const clip = await slotClip();
    const t0 = Date.now(); const seen = []; let i = 0;
    while (Date.now() - t0 < ms) {
      const f = path.join(shots, 'f' + (i++) + '.png');
      try {
        /* STRAIGHT DOWN THE PIPE. Playwright's element screenshot waits for the element to
           hold still and took 2,272 ms a picture; its page screenshot with a clip took 211
           ms when nothing was loading and about a second when something was. The browser's
           own capture, at scale 1, is the only one fast enough to call this a sample. */
        const r = await d.cdp.send('Page.captureScreenshot',
          { format: 'png', clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height, scale: 1 } });
        fs.writeFileSync(f, Buffer.from(r.data, 'base64'));
      } catch (_e) { continue; }
      seen.push({ at: Date.now() - t0, lit: litFraction(f) });
    }
    return seen;
  };
  /* the phone's own page really being in, waited for rather than assumed */
  const waitUp = async (ms) => {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) {
      if (await d.fr.evaluate(() => document.getElementById('phoneslot').classList.contains('ready'))) return true;
      await d.page.waitForTimeout(150);
    }
    return false;
  };

  /* THE PHONE IS A CITY-VIEW OBJECT, BY HIS RULING (9/23, rule 32c: "you only see the
     phone when you're zoomed out to the whole city view, not the human close shit"). So
     the seam is crossed before anything is asked, the way his thumb does it, and the
     crossing is CHECKED -- a gate that measures the street and calls it the city is the
     trap this lane has fallen into twice. */
  await d.pinchOut();
  await d.page.waitForTimeout(700);
  ok('the squeeze really reached the city view, where the phone lives',
     (await d.fr.evaluate(() => (typeof MODE !== 'undefined' ? MODE : '?'))) === 'city');
  ok('the phone is folded to start with',
     (await d.fr.evaluate(() => PHONE_ON)) === false);

  /* ---- THE ORDINARY OPEN ---- */
  await tapPhone();
  const run1 = await watch(2600);
  const worst1 = run1.reduce((a, b) => (b.lit < a.lit ? b : a), run1[0]);
  ok('a real touch opened it', (await d.fr.evaluate(() => PHONE_ON)) === true);
  ok('*** NOTHING BLACK IS EVER ON THE GLASS while it opens ***',
     worst1.lit > LIT_FLOOR,
     run1.length + ' photographs over 2.6 s, the darkest ' + (worst1.lit * 100).toFixed(2)
     + '% lit at ' + worst1.at + ' ms (black is 0.05%, the floor is 0.25%)');
  const up = await waitUp(20000);
  ok('  and the face gets out of the way once the phone is really up', up,
     'slot class: ' + (await d.fr.evaluate(() => document.getElementById('phoneslot').className)));
  /* WHAT IS ON THE GLASS THEN IS THE PHONE'S OWN PAGE, asked of the page and not of a
     brightness. The first cut of this leg compared lit fractions and went red on a build
     that is right: the phone's lock screen measures DARKER than the face (1.03% against
     1.77%), because the face's gradient and its big hour cover more of the glass than two
     cards on black do. A number that goes down is not a number that went wrong, and
     "brighter than the thing it replaced" was never the claim. */
  const after = await d.fr.evaluate(() => {
    const b = document.getElementById('phoneboot');
    let chars = -1;
    try { chars = PHONE_FR.contentDocument.body.textContent.trim().length; } catch (_e) {}
    return { faceGone: getComputedStyle(b).display === 'none', chars };
  });
  const settled = await watch(500);
  ok('  and what is on the glass then is the phone\'s own page, not the face',
     after.faceGone && after.chars > 1000 && settled.length > 0 && settled[0].lit > 0.005,
     'the face is gone: ' + after.faceGone + ', the phone\'s page carries ' + after.chars
     + ' characters, the glass reads ' + (settled.length ? (settled[0].lit * 100).toFixed(2) : '?') + '%');

  /* ---- THE PHONE THAT HAS NOT FINISHED LOADING, which is his ----
     Pin the game's own "is the page in yet" answer to false and hold the door open. This
     is what a slow phone is, without pretending I can slow this box's network down. */
  await d.fr.evaluate(() => { try { phoneClose(); } catch (_e) {} });
  await d.page.waitForTimeout(400);
  await d.fr.evaluate(() => {
    window.__realBootDone = window.phoneBootDone;
    window.phoneBootDone = function () { return false; };
    try { document.getElementById('phoneslot').classList.remove('ready'); } catch (_e) {}
  });
  await tapPhone();
  const run2 = await watch(2600);
  const worst2 = run2.reduce((a, b) => (b.lit < a.lit ? b : a), run2[0]);
  ok('*** AND ON A PHONE WHOSE PAGE NEVER ARRIVES, THE GLASS IS STILL LIT ***',
     worst2.lit > LIT_FLOOR,
     run2.length + ' photographs, the darkest ' + (worst2.lit * 100).toFixed(2) + '% lit');
  const face = await d.fr.evaluate(() => {
    const b = document.getElementById('phoneboot');
    return { shown: getComputedStyle(b).display !== 'none',
             clock: b.querySelector('.pbclock').textContent,
             where: b.querySelector('.pbwhere').textContent,
             cracks: b.querySelectorAll('path').length };
  });
  ok('  and it is the phone he knows: the hour, the place, the crack', face.shown
     && /^\d\d:\d\d$/.test(face.clock) && face.where.length > 2 && face.cracks > 4,
     face.clock + ' / ' + face.where + ' / ' + face.cracks + ' fracture lines');
  ok('  and the hour it shows is the hour the game is at',
     face.clock === (await d.fr.evaluate(() => {
       const s = clockStr(), b = String(s).split('\u00b7'); return (b.length > 1 ? b[b.length - 1] : s).trim();
     })), face.clock);

  fs.rmSync(shots, { recursive: true, force: true });
  done(d);
})().catch(e => { console.log('  FAIL the gate could not run   ' + String(e.message).slice(0, 200)); done(null); });
