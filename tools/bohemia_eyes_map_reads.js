/* BOHEMIA -- HOW DOES THE MAP READ ON A PHONE, IN NUMBERS
 * EYES AND EARS, lane 17, [bb reads] round one (school), rule 33. 9/24/26.
 *
 * THE ROW: "how BB's map reads at a glance and what fails at 390 px wide; the instrument for our
 * map when RUN ships it."  Rule 33(a): THE MAP IS THE CITY VIEW WE ALREADY HAVE, reached by one
 * squeeze out. So the school round can take a real first reading instead of describing one.
 *
 * WHAT IT MEASURES, all on the served cut at 390x844:
 *   THE TEXT      every visible mark with words on the map: its pixel height, and its CONTRAST
 *                 against the canvas pixels directly behind it (WCAG ratio, 4.5 is the readable
 *                 bar for body text and 3.0 for large text).
 *   THE MARKS     the smallest thing PAINTED on the map canvas, taken from a drawImage hook armed
 *                 before the page runs. The published floor for a map icon a person must
 *                 recognise is about 11 px; the touch floor is 44x44.
 *   THE REACH     the box of anything tappable on the map, against the same 44 px law this lane
 *                 has measured on the street since round 2.
 *
 * RULE ZERO, and it is the lesson of [song length]: three controls, and no numbers unless all
 * three pass.
 *   C0 THE DOOR IS BEHIND US   the shared driver says so itself (doorIsBehindUs), never a guess
 *   C1 THE GAME SAYS IT IS THE MAP   MODE/CZOOM from the game's own state before and after the
 *                                    squeeze, so "this is the map" is the game's claim, not mine
 *   C2 THE HOOK RECORDED SOMETHING   a draw count above zero, or the sizes below are a zero that
 *                                    means "I measured nothing"
 *
 * REUSE-FIRST: the boot, the door, the squeeze and the screenshot are PLUMBER's one driver
 * (tools/bohemia_drive_the_demo.js), not a fourth copy of them.
 */
const path = require('path');
const fs = require('fs');
const D = require('./bohemia_drive_the_demo.js');
const ROOT = path.resolve(__dirname, '..');
const arg = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : d; };
const CUT = arg('--surface', null);
const OUT = path.join(ROOT, 'records', 'BOHEMIA_EYES_MAP_READS_9_24_26.json');
const SHOT = path.join(ROOT, 'records', 'eyes_bb_map');

const lum = (r, g, b) => {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => { const l1 = Math.max(a, b), l2 = Math.min(a, b); return +((l1 + 0.05) / (l2 + 0.05)).toFixed(2); };

(async () => {
  try { fs.mkdirSync(SHOT, { recursive: true }); } catch (e) {}
  const out = { what: 'how the map reads on a phone', row: '[bb reads] round one, rule 33',
                when: new Date().toISOString(), surface: CUT || 'the repo demo', controls: [] };
  const opts = CUT ? { serve: { '/slices/BOHEMIA_DEMO.html': CUT } } : {};
  const d = await D.open(opts);
  try {
    /* the hook has to be armed inside the frame before the map is drawn; the driver exposes
       frame evaluation, so this rides on it rather than opening a second browser */
    /* THE DRIVER EXPOSES pageEval AND NOT FRAME EVAL, so the hop into the game frame is done
       here rather than by adding a method to another lane's tool. */
    await d.pageEval(() => {
      /* THE FIRST IFRAME IS NOT THE GAME. The shared driver finds the world frame by URL
         (BOHEMIA_CITY_WORLD); querySelector('iframe') took whichever came first in the document
         and the hook armed a window that never draws, so the probe reported "0 painted images"
         and its own control refused the numbers -- which is the control working, and the
         cheapest possible version of a wrong reading. The game frame is the one whose document
         HAS A CANVAS, and if none does, the game is the top document itself. */
      const pick = () => {
        let best = null, area = 0;
        for (const f of document.querySelectorAll('iframe')) {
          try {
            const doc = f.contentDocument; if (!doc) continue;
            for (const c of doc.querySelectorAll('canvas')) {
              const a = c.width * c.height;
              if (a > area) { area = a; best = f.contentWindow; }
            }
          } catch (e) {}
        }
        if (best) return best;
        for (const c of document.querySelectorAll('canvas')) if (c.width * c.height > 0) return window;
        return null;
      };
      const w = pick();
      if (!w) return 'no canvas anywhere';
      w.__eyesDraws = [];
      const w2 = w;
      const p = w.CanvasRenderingContext2D.prototype;
      const orig = p.drawImage;
      p.drawImage = function (...a) {
        try {
          const w = a.length >= 9 ? a[7] : a.length >= 5 ? a[3] : (a[0] && a[0].width);
          const h = a.length >= 9 ? a[8] : a.length >= 5 ? a[4] : (a[0] && a[0].height);
          if (w > 0 && h > 0) w2.__eyesDraws.push([Math.round(w), Math.round(h),
            (this.canvas && this.canvas.width) + 'x' + (this.canvas && this.canvas.height)]);
        } catch (e) {}
        return orig.apply(this, a);
      };
      return 'armed';
    }).catch(() => null);

    out.controls.push({ name: 'C0 THE DOOR IS BEHIND US, and the driver says so itself',
                        pass: !!d.doorIsBehindUs(),
                        detail: 'the door held ' + d.doorMs() + ' ms after the first knock' });
    const before = await d.state();
    await d.pinchOut();
    /* *** THE FLAG IS NOT THE PICTURE, AND THE FIRST CUT OF THIS PROBE BELIEVED THE FLAG. ***
       One squeeze flips the game's MODE to 'city' immediately while the camera is still where it
       was: measured, mode human -> city with CZOOM UNCHANGED AT 1, and the screenshot taken at
       that moment is the STREET with the phone on it, not the map. RUN measured the seam as
       CZOOM 1 -> 0.208, so the zoom is a movement and not a jump. So this waits for the camera
       to SETTLE and records how long it took, and the control demands the camera moved, not just
       the flag. A probe that photographs the street and calls it the map would have handed its
       numbers to the wrong screen. */
    /* AND IT TAKES TWO SQUEEZES, MEASURED: after ONE the mode flag reads city for ten full
       seconds while CZOOM stays 1 and the picture is still the street; the SECOND squeeze is
       what zooms (CZOOM 0.208, tile width 18 -> 3.7). Identical on the demo cut and on the
       alpha. So this squeezes until THE CAMERA moves, up to three times, and records how many
       it took -- the number is the finding as much as the reading that follows it. */
    let after = await d.state(), settleMs = 0, squeezes = 1;
    const moved = () => after && before && after.czoom != null && after.czoom < before.czoom;
    for (let i = 0; i < 12 && !moved(); i++) {
      await new Promise(r => setTimeout(r, 1000));
      settleMs += 1000;
      after = await d.state();
      if (!moved() && settleMs % 3000 === 0 && squeezes < 3) { await d.pinchOut(); squeezes++; }
    }
    out.squeezes_the_camera_needed = squeezes;
    out.street = before; out.map = after; out.camera_settled_after_ms = settleMs;
    const cameraMoved = !!(after && before && after.czoom != null && before.czoom != null
                           && after.czoom < before.czoom);
    out.controls.push({ name: 'C1 THE CAMERA ACTUALLY MOVED TO THE MAP, not just the mode flag',
                        pass: cameraMoved && after.mode !== before.mode,
                        detail: 'before ' + JSON.stringify(before) + ' after ' + JSON.stringify(after)
                          + ' (' + squeezes + ' squeeze(s), settled after ' + settleMs + ' ms)'
                          + (cameraMoved ? '' : ' -- THE MODE FLIPPED AND THE CAMERA DID NOT MOVE, '
                            + 'so anything below would be the street wearing the map\'s name') });
    await d.shot(path.join(SHOT, '01_the_map.png'));

    const reading = await d.pageEval(() => {
      const pick = () => {
        let best = null, area = 0;
        for (const f of document.querySelectorAll('iframe')) {
          try {
            const doc2 = f.contentDocument; if (!doc2) continue;
            for (const c of doc2.querySelectorAll('canvas')) {
              const a = c.width * c.height;
              if (a > area) { area = a; best = f.contentWindow; }
            }
          } catch (e) {}
        }
        if (best) return best;
        for (const c of document.querySelectorAll('canvas')) if (c.width * c.height > 0) return window;
        return null;
      };
      const win = pick();
      const doc = win && win.document;
      if (!doc || !win) return { marks: [], draws: [], world: null };
      const getComputedStyle = win.getComputedStyle.bind(win);
      const innerHeight = win.innerHeight;
      const vis = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
        return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden'
               && +cs.opacity > 0.1 && r.top < innerHeight && r.bottom > 0; };
      /* the biggest canvas is the map; a scratch canvas is not the thing he looks at */
      let world = null;
      for (const c of doc.querySelectorAll('canvas'))
        if (!world || c.width * c.height > world.width * world.height) world = c;
      const ctx = world && world.getContext('2d');
      const behind = (x, y, w, h) => {
        if (!ctx) return null;
        try {
          const sx = Math.max(0, Math.round(x * world.width / world.getBoundingClientRect().width));
          const sy = Math.max(0, Math.round(y * world.height / world.getBoundingClientRect().height));
          const px = ctx.getImageData(sx, sy, Math.max(1, Math.min(8, Math.round(w))),
                                     Math.max(1, Math.min(8, Math.round(h)))).data;
          let r = 0, g = 0, b = 0, n = 0;
          for (let i = 0; i < px.length; i += 4) { r += px[i]; g += px[i + 1]; b += px[i + 2]; n++; }
          return n ? [Math.round(r / n), Math.round(g / n), Math.round(b / n)] : null;
        } catch (e) { return null; }
      };
      const marks = [];
      for (const el of doc.querySelectorAll('div,span,button,a')) {
        if (!vis(el)) continue;
        if (el.querySelector('div,span,button,a')) continue;
        const t = (el.innerText || '').replace(/\s+/g, ' ').trim();
        if (!t || t.length > 30) continue;
        const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
        marks.push({ text: t.slice(0, 24), id: el.id || '', w: Math.round(r.width), h: Math.round(r.height),
                     fontPx: Math.round(parseFloat(cs.fontSize) || 0), color: cs.color,
                     pointer: cs.pointerEvents !== 'none',
                     behind: behind(r.x, r.y, r.width, r.height) });
      }
      const draws = (win.__eyesDraws || []).slice(-4000);
      return { marks, draws, world: world ? world.width + 'x' + world.height : null };
    });

    const draws = reading.draws || [];
    out.controls.push({ name: 'C2 THE DRAW HOOK RECORDED SOMETHING, so a small number is a '
                              + 'measurement and not an empty log',
                        pass: draws.length > 0, detail: draws.length + ' painted images seen' });

    const parse = (c) => { const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c || ''); return m ? [+m[1], +m[2], +m[3]] : null; };
    out.text_marks = reading.marks.map((m) => {
      const fg = parse(m.color), bg = m.behind;
      return { ...m, contrast: (fg && bg) ? ratio(lum(...fg), lum(...bg)) : null };
    });
    const hs = draws.map(d2 => Math.min(d2[0], d2[1])).filter(x => x > 0).sort((a, b) => a - b);
    out.painted = { count: draws.length,
                    smallest_side_px: hs[0] || null,
                    p10_side_px: hs.length ? hs[Math.floor(hs.length * 0.1)] : null,
                    median_side_px: hs.length ? hs[Math.floor(hs.length / 2)] : null,
                    biggest_side_px: hs.length ? hs[hs.length - 1] : null,
                    world_canvas: reading.world };
    const tappable = out.text_marks.filter(m => m.pointer);
    out.numbers = {
      squeezes_the_camera_needed: out.squeezes_the_camera_needed,
      text_marks_on_the_map: out.text_marks.length,
      smallest_text_height_px: Math.min(...out.text_marks.map(m => m.h).concat([Infinity])),
      smallest_font_px: Math.min(...out.text_marks.map(m => m.fontPx).filter(Boolean).concat([Infinity])),
      marks_under_the_44px_touch_law: tappable.filter(m => m.w < 44 || m.h < 44).length,
      tappable_text_marks: tappable.length,
      worst_contrast: out.text_marks.map(m => m.contrast).filter(x => x != null).sort((a, b) => a - b)[0] || null,
      marks_under_the_4_5_contrast_bar: out.text_marks.filter(m => m.contrast != null && m.contrast < 4.5).length,
      smallest_painted_side_px: out.painted.smallest_side_px,
      median_painted_side_px: out.painted.median_side_px,
    };
  } catch (e) { out.ok = false; out.why = String(e).slice(0, 300); }
  try { await d.close(); } catch (e) {}
  const bad = out.controls.filter(c => !c.pass).map(c => c.name);
  out.failing_controls = bad;
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log('  controls: ' + (bad.length ? 'FAILED -> ' + bad.join(' | ') : 'all green'));
  if (bad.length) console.log('  THE NUMBERS BELOW MEAN NOTHING UNTIL THE CONTROLS PASS.');
  if (out.why) console.log('  why: ' + out.why);
  for (const [k, v] of Object.entries(out.numbers || {})) console.log('    ' + k.padEnd(36) + ' ' + JSON.stringify(v));
  for (const m of (out.text_marks || []).slice(0, 12))
    console.log('    "' + m.text + '" ' + m.w + 'x' + m.h + ' font ' + m.fontPx + 'px contrast ' + m.contrast);
  process.exit(0);
})();
