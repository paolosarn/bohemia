/* ============================================================================
   WHAT ACTUALLY PAINTS  (UI lane 11, 9/18) -- row [no slop].
   laws/BOHEMIA_LAW_THE_UI_MUST_NOT_LOOK_VIBE_CODED_9_11_26.md

   THE COMPANION TO THE RULER, AND THE REASON IT EXISTS IN ONE LINE:
   tools/bohemia_count_the_tells.js reads SOURCE. That is right for a floor -- it is
   cheap, it runs on a file, and it cannot be argued with. But it cannot tell a live
   declaration from one a later rule cancels, and this repo is full of the second kind:
     the walked city's SOURCE said 46 one-pixel borders and 53 rounded corners
     the OPENING STREET, measured live, was drawing THREE and THREE
   Nearly everything left in the count was a declaration the skin already overrides with
   !important, or a rule for a panel that is not open. Eight rounds of this row have been
   reported against a number fifteen times bigger than what he can see.

   THIS IS NOT A REPLACEMENT. A dead declaration is real debt: it counts, it misleads the
   next reader, and it is exactly how a killed shape comes back (GET UP was drawn with a
   bevel AND a rounded hairline because a later rule put the hairline back). The ruler
   keeps that honest. This says what HE sees. Two different questions, both worth asking,
   and quoting either one as the other is the mistake this file exists to stop.

   IT IS NOT A GATE. It is a measurement, like the ruler.

       node tools/bohemia_what_actually_paints.js              # the opening street
       node tools/bohemia_what_actually_paints.js --states     # every surface he can open

   A CIRCLE IS NOT A ROUNDED CARD. The pad's ring and face are 999px radius and they are
   the object, not the rounded-box idiom the law names, so anything at or above 100px is
   a shape and is not counted. A TRANSPARENT BORDER PAINTS NOTHING, so it is not counted
   either -- several controls carry one purely as an :active hook.
   ========================================================================== */
'use strict';

/* the one measurement, so the gate beside this file and the CLI cannot drift apart */
const SWEEP = function () {
  const name = e => (e.id ? '#' + e.id
    : (e.getAttribute('class') ? '.' + e.getAttribute('class').split(' ')[0] : e.tagName));
  const hair = [], round = [];
  document.querySelectorAll('*').forEach(e => {
    const cs = getComputedStyle(e);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return;
    const r = e.getBoundingClientRect();
    if (r.width < 3 || r.height < 3) return;
    if (r.bottom < 0 || r.top > innerHeight) return;
    const bw = ['Top', 'Right', 'Bottom', 'Left'].map(s => parseFloat(cs['border' + s + 'Width']) || 0);
    const br = ['TopLeft', 'TopRight', 'BottomRight', 'BottomLeft'].map(s => parseFloat(cs['border' + s + 'Radius']) || 0);
    const w = Math.max(...bw), rad = Math.max(...br);
    const col = cs.borderTopColor || '';
    const invisible = /rgba\(\s*[\d.]+,\s*[\d.]+,\s*[\d.]+,\s*0\s*\)/.test(col) || col === 'transparent';
    if (w > 0 && w <= 1.5 && !invisible) hair.push(name(e));
    if (rad > 4 && rad < 100) round.push(name(e) + ':' + Math.round(rad));
  });
  return { hair, round };
};

async function paints(fr) { return fr.evaluate(SWEEP); }

/* open a surface, measure, put it back exactly as it was */
async function paintsWith(fr, id) {
  return fr.evaluate(([fn, id]) => {
    const run = new Function('return (' + fn + ')')();
    const el = document.getElementById(id);
    if (!el) return { id, missing: true };
    const prev = el.style.display, had = el.classList.contains('on');
    el.style.display = 'block'; el.classList.add('on');
    const out = run();
    el.style.display = prev; if (!had) el.classList.remove('on');
    return Object.assign({ id }, out);
  }, [SWEEP.toString(), id]);
}

module.exports = { SWEEP, paints, paintsWith };

if (require.main === module) {
  (async () => {
    const { open } = require('./bohemia_drive_the_demo.js');
    const d = await open({});
    const tally = a => { const m = {}; a.forEach(x => m[x] = (m[x] || 0) + 1);
      return Object.entries(m).sort((x, y) => y[1] - x[1]); };
    const say = (label, r) => {
      console.log('  ' + label.padEnd(26)
        + String(r.hair.length).padStart(4) + ' edges'
        + String(r.round.length).padStart(5) + ' rounded   '
        + tally(r.hair.concat(r.round)).slice(0, 5).map(([k, v]) => v > 1 ? k + ' x' + v : k).join(' '));
    };
    console.log('WHAT ACTUALLY PAINTS -- ' + new Date().toISOString().slice(0, 10));
    console.log('(one-pixel edges that are really drawn, and rounded boxes 5-99px)\n');
    say('the opening street', await paints(d.fr));
    if (process.argv.includes('--states')) {
      for (const id of ['outfitpanel', 'buildpanel', 'savepanel', 'keypanel',
                        'pfgrid', 'devtray', 'cityfeed', 'daycard']) {
        const r = await paintsWith(d.fr, id);
        if (r.missing) { console.log('  ' + id.padEnd(26) + '   not built until he opens it'); continue; }
        say(id, r);
      }
    }
    console.log('\n  IT READS THE PAINTED SCREEN, NOT THE SOURCE. A dead declaration the skin');
    console.log('  cancels is invisible here and still real debt; that is the ruler\'s question,');
    console.log('  not this one. Quoting either number as the other is the whole mistake.');
    await d.close();
  })().catch(e => { console.error('FAILED: ' + String(e.message).slice(0, 200)); process.exit(1); });
}
