/* NOTHING INVISIBLE SITS OVER A CONTROL
   ================================================================================
   PLUMBER, row [covered controls], 9/24. Coordinator: FOUR TIMES IN TWO ROUNDS a
   lane spent a whole round on a control that was alive underneath something
   invisible -- the loading canvas (#loadgl), the VOTE landing, the hidden fight
   frame, and the opening banner (#openInvite).

   It is the same defect this lane hit from the other side: 17 dead presses of 24,
   where the CITY FRAME was being asked whether its own button was topmost while the
   card that covered it lived in the PARENT page. And it is rule 14(h)'s other half:
   a dead button is indistinguishable from a close button, so "did the screen change"
   proves nothing in either direction. THE ONLY HONEST QUESTION IS WHERE A FINGER
   ACTUALLY LANDS, and the browser will answer it exactly.

   WHAT IT ASKS, per named control, at NINE POINTS ACROSS THE CONTROL:
     1. the TOP page's elementFromPoint returns that control, or the frame holding it
     2. and for a control inside the frame, the FRAME'S OWN elementFromPoint returns
        that control too
   A control passes if a finger reaches it at ANY of the nine. A covered control is
   one a finger cannot reach ANYWHERE on it.

   *** "AT THE CONTROL'S OWN CENTRE", WHICH IS THE ROW'S OWN WORDING, GOES RED ON THE
   WALKING PAD, AND THE PAD WORKS. *** Rule 12: the row is a premise, so I measured it.
   #pad is a 90x90 RING (its only child is svg#padring) and the canvas #modeFace sits
   in the hole. A centre-only rule calls that covered, on BOTH the alpha and the demo.
   So I pressed it like a finger, through the top page, and read his coordinates:
       12 presses at the pad's TOP EDGE   hy 6268 -> 6145   HE MOVED
       12 presses at the pad's CENTRE     hy 6145 -> 6145   nothing, correctly
   The centre of a D-pad is a dead zone by design. A gate that goes red on the working
   walk pad is a gate the fleet switches off within a round, and then it protects
   nothing -- the same lesson as the marker check that went red on a record quoting a
   marker. So the question is not "is this control topmost at one pixel", it is CAN A
   FINGER REACH THIS CONTROL AT ALL, and that is what the four incidents actually were:
   a full-surface overlay, not a speck.

   AND THE ROW'S SUGGESTED MUTATION IS A TEST OF THE WRONG THING. "Park a 1x1
   transparent div over the pad, red" would fail a centre-only rule and pass this one,
   and THIS ONE IS RIGHT: a 1x1 div does not stop anybody pressing a 90x90 ring. The
   mutation that matches the bug is a FULL-SIZE overlay, which is what the loading
   canvas, the VOTE landing, the fight frame and the banner each were. Both are run
   below, and the 1x1 is kept as a deliberate NEGATIVE: it must stay green.

   LEG 2 IS NOT IN THE ROW AND IT IS HALF THE BUG. The row asks only for the top
   page. But the top page hands a finger to `iframe#cityFrame` for EVERYTHING inside
   it, so a card sitting over the pad INSIDE the frame passes leg 1 with room to
   spare. That in-frame overlay is exactly the 9/21 finding where the first card of
   the game sat over all eight direction buttons and 544 presses moved him zero
   cells. One leg catches an overlay above the frame; the other catches one below it.

   *** AND THE FIRST CUT OF THIS GATE REPORTED 24 COVERED CONTROLS OUT OF 29, WHICH
   WAS ENTIRELY WRONG. *** It found the frame with `querySelector('iframe')`. The
   alpha carries THIRTEEN iframes and twelve of them are 0x0 shells; the first in
   document order is #voteOver at 0x0. So every offset was computed against the wrong
   box and every containment test compared against the wrong element. The number it
   printed was specific, plausible and false. The fix is to stop guessing: ask
   playwright which frame it is driving (`fr.frameElement()`), which cannot be wrong
   about the frame it is already talking to.

   FLOORS, because a check that finds nothing must never pass:
     - if the door is still in front of us, FAIL. Everything behind a splash answers
       happily and the answers are about a screen nobody is looking at.
     - if fewer than MIN_CONTROLS are found on a surface, FAIL. An empty sweep is
       the loudest form of green over nothing.
   ================================================================================ */
const path = require('path');
const { open } = require(path.join(path.dirname(__dirname), 'tools', 'bohemia_drive_the_demo.js'));

const MIN_CONTROLS = 8;        /* the alpha shows 25 and the demo fewer; 8 is a floor,
                                  not a target, and it is measured: the smallest real
                                  surface this gate has seen carried 20 in the frame. */
let pass = 0, fail = 0;
const ok = (n, c, why) => {
  if (c) { pass++; console.log('  ok   ' + n); return; }
  fail++; console.log('  FAIL ' + n);
  if (why) console.log('         ' + why);
};

/* the page-side sweep, run in BOTH the top page and the frame */
const SWEEP = function () {
  const out = [];
  for (const el of Array.from(document.querySelectorAll('[id]'))) {
    const r = el.getBoundingClientRect();
    if (r.width < 10 || r.height < 10) continue;
    if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) continue;
    const st = getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden' || +st.opacity === 0) continue;
    if (st.pointerEvents === 'none') continue;      /* not a control, by its own say-so */
    if (el.children.length > 3) continue;           /* a container, not a thing you press */
    out.push({ id: el.id, x: r.x, y: r.y, w: r.width, h: r.height });
  }
  return out;
};

async function surface(label, opts) {
  console.log('\n--- ' + label + ' ---');
  const d = await open(opts);
  try {
    console.log('  ' + d.says());

    const behind = await d.doorIsBehindUs();
    ok('the door is behind us, so these are the controls he can actually reach', behind,
      'everything under a splash answers happily and the answers are about a screen '
      + 'nobody is looking at. Nothing below this line would mean anything.');
    if (!behind) { await d.close(); return; }

    /* ASK PLAYWRIGHT WHICH FRAME IT DRIVES. Never querySelector('iframe'). */
    const feh = await d.fr.frameElement();
    const fb = await feh.evaluate((f) => {
      const r = f.getBoundingClientRect();
      return { id: f.id || '', x: r.x, y: r.y, w: Math.round(r.width), h: Math.round(r.height) };
    });
    console.log('  the driven frame: #' + (fb.id || '(no id)') + ' ' + fb.w + 'x' + fb.h
      + ' at ' + Math.round(fb.x) + ',' + Math.round(fb.y));

    /* ---- THE MUTATION HOOK, off unless asked for. Same shape as this lane's
       ratchet --plant: a gate you cannot make fail is a gate nobody has tested.
         frame-full  a full-size invisible div over the pad, INSIDE the frame
         page-full   a full-size invisible div over the whole city frame, on the page
         tiny        one transparent pixel at the pad's centre (a deliberate NEGATIVE:
                     it must stay GREEN, because it does not stop anybody pressing) */
    const plant = process.env.BOHEMIA_COVERED_PLANT || '';
    if (plant) {
      console.log('  [planted] ' + plant);
      if (plant === 'page-full') {
        await d.page.evaluate((fid) => {
          const f = document.getElementById(fid); if (!f) return;
          const r = f.getBoundingClientRect(), o = document.createElement('div');
          o.id = 'plantedOverlay';
          o.style.cssText = 'position:fixed;left:' + r.x + 'px;top:' + r.y + 'px;width:'
            + r.width + 'px;height:' + r.height + 'px;background:transparent;z-index:99999';
          document.body.appendChild(o);
        }, fb.id);
      } else {
        await d.fr.evaluate((kind) => {
          const pad = document.getElementById('pad'); if (!pad) return;
          const r = pad.getBoundingClientRect(), o = document.createElement('div');
          o.id = 'plantedOverlay';
          const w = kind === 'tiny' ? 1 : r.width, h = kind === 'tiny' ? 1 : r.height;
          const x = kind === 'tiny' ? r.x + r.width / 2 : r.x;
          const y = kind === 'tiny' ? r.y + r.height / 2 : r.y;
          o.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:' + w
            + 'px;height:' + h + 'px;background:transparent;z-index:99999';
          document.body.appendChild(o);
        }, plant);
      }
    }

    const top = await d.page.evaluate(SWEEP);
    const inside = await d.fr.evaluate(SWEEP);
    console.log('  named controls: ' + top.length + ' on the page, ' + inside.length + ' in the frame');
    ok('enough controls were found to be checking anything ('
      + (top.length + inside.length) + ', floor ' + MIN_CONTROLS + ')',
      top.length + inside.length >= MIN_CONTROLS,
      'a sweep that finds nothing passes every test in it. That is green over nothing, '
      + 'and this gate refuses it.');

    /* LEG 1: the top page */
    const l1 = await d.page.evaluate((a) => {
      const { fb, top, inside } = a;
      const name = (el) => !el ? '(nothing at all)' : (el.tagName.toLowerCase()
        + (el.id ? '#' + el.id : '')
        + (el.className && typeof el.className === 'string' && el.className.trim()
           ? '.' + el.className.trim().split(/\s+/)[0] : ''));
      const frame = fb.id ? document.getElementById(fb.id) : null;
      /* NINE POINTS: the centre and a 3x3 grid inset 15% from each edge, so every
         point is inside the box and a ring is sampled on its stroke, not its hole. */
      const pts = (b, ox, oy) => { const f = [0.15, 0.5, 0.85], out = [];
        for (const fx of f) for (const fy of f)
          out.push([ox + b.x + b.w * fx, oy + b.y + b.h * fy]);
        return out; };
      const rows = [];
      for (const c of top) {
        const el = document.getElementById(c.id);
        let reached = false, last = null;
        for (const [x, y] of pts(c, 0, 0)) {
          const hit = document.elementFromPoint(x, y);
          if (!last) last = hit;
          if (hit && el && (hit === el || el.contains(hit) || hit.contains(el))) { reached = true; break; }
          last = hit;
        }
        rows.push({ id: c.id, where: 'page', ok: reached, hit: name(last) });
      }
      for (const c of inside) {
        let reached = false, last = null;
        for (const [x, y] of pts(c, fb.x, fb.y)) {
          const hit = document.elementFromPoint(x, y);
          if (!last) last = hit;
          if (hit && frame && (hit === frame || frame.contains(hit) || hit.contains(frame))) { reached = true; break; }
          last = hit;
        }
        rows.push({ id: c.id, where: 'frame', ok: reached, hit: name(last) });
      }
      return rows;
    }, { fb, top, inside });

    const covered1 = l1.filter(r => !r.ok);
    ok('NOTHING ON THE PAGE SITS OVER A CONTROL -- ' + l1.length + ' checked at nine points each',
      covered1.length === 0,
      covered1.length ? covered1.slice(0, 8).map(r =>
        '#' + r.id + ' is alive but a finger cannot reach it anywhere; it lands on ' + r.hit).join('\n         ') : '');

    /* LEG 2: inside the frame, where the top page cannot see */
    const l2 = await d.fr.evaluate((list) => {
      const name = (el) => !el ? '(nothing at all)' : (el.tagName.toLowerCase()
        + (el.id ? '#' + el.id : '')
        + (el.className && typeof el.className === 'string' && el.className.trim()
           ? '.' + el.className.trim().split(/\s+/)[0] : ''));
      const f = [0.15, 0.5, 0.85];
      return list.map((c) => {
        const el = document.getElementById(c.id);
        let reached = false, last = null;
        for (const fx of f) for (const fy of f) {
          if (reached) continue;
          const hit = document.elementFromPoint(c.x + c.w * fx, c.y + c.h * fy);
          if (!last) last = hit;
          if (hit && el && (hit === el || el.contains(hit) || hit.contains(el))) { reached = true; }
          else last = hit;
        }
        return { id: c.id, ok: reached, hit: name(last) };
      });
    }, inside);

    const covered2 = l2.filter(r => !r.ok);
    ok('AND NOTHING INSIDE THE FRAME SITS OVER ONE EITHER -- ' + l2.length + ' checked',
      covered2.length === 0,
      covered2.length ? covered2.slice(0, 8).map(r =>
        '#' + r.id + ' is alive but a finger cannot reach it anywhere; it lands on ' + r.hit).join('\n         ')
        + '\n         The top page cannot see this: it hands a finger to the frame for '
        + 'everything inside it, so an overlay BELOW the frame passes that check with room '
        + 'to spare. This is the 9/21 card that sat over all eight direction buttons while '
        + '544 presses moved him zero cells.' : '');
  } finally {
    try { await d.close(); } catch (e) { /* already gone */ }
  }
}

(async () => {
  console.log('\nNOTHING INVISIBLE SITS OVER A CONTROL (row [covered controls])');
  await surface('THE ALPHA, where every lane ships', { alpha: true });
  await surface('THE DEMO, what he actually opens', {});
  console.log('\n=== COVERED CONTROLS: ' + pass + ' passed, ' + fail + ' failed ===');
  console.log('    a control he cannot press is a control that does not exist.');
  process.exit(fail ? 1 : 0);
})().catch((e) => {
  console.log('  FAIL the gate could not drive a surface at all: ' + e.message);
  console.log('\n=== COVERED CONTROLS: ' + pass + ' passed, ' + (fail + 1) + ' failed ===');
  process.exit(1);
});
