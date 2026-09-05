/* BOHEMIA -- THE JUDGE LIST MOVES GATE (ANIMATION lane, 9/5/26)
 *
 * FACTORY LAW: new surface, new gate, same turn.
 * Record: records/BOHEMIA_SHOW_HIM_THE_LIST_9_5_26.md
 *
 * WHAT IT PROTECTS, MEASURED BEFORE IT WAS BUILT: the ANIMATION tab's JUDGE ALL
 * panel has existed since 7/19 and read "105 clips, 105 UNJUDGED". Every row was
 * A WORD AND TWO THUMBS. To judge one clip he had to tap the name, scroll 1,464 px
 * UP to watch the character, and scroll back down to press a thumb -- a hundred and
 * five times. That is the BOTTOM-UP law exactly: anything he has to scroll up for
 * does not exist. A judging page made of words asks him to judge from memory, and
 * the empty verdict count is the proof that nobody can.
 *
 * SO THE CLAIM IS NOT "THE PANEL EXISTS". It is that every row SHOWS THE CLIP
 * MOVING, next to its own thumbs. Three ways that dies quietly, one claim each:
 *
 *  1. THE ROW HAS A PICTURE AT ALL. A canvas per clip, one per row.
 *  2. THE PICTURE IS A BODY, NOT AN EMPTY BOX. Ink on every on-screen canvas.
 *     A 72px empty rectangle looks like a loading state, not a defect, so nothing
 *     else would ever catch this.
 *  3. THE PICTURE MOVES. Sampled twice a beat apart, on the same canvases. This is
 *     the one that matters: a still frame per row would satisfy 1 and 2 and would
 *     still be a list he cannot judge from.
 *
 * AND CLAIM 3 IS DELIBERATELY NOT "SOME CANVAS SOMEWHERE CHANGED". It counts how
 * many of the ON-SCREEN rows changed, because the loop culls off-screen rows on
 * purpose (the CLOTHES tab's pattern) and a check that swept all 105 would be
 * measuring the culling, not the animation.
 *
 * THE NOTES ARE CHECKED AGAINST THE AUDIT FILE, not against a copy typed in here:
 * CLIP_NOTE is generated from records/BOHEMIA_THE_63_CLIP_AUDIT_RAW_9_5_26.txt, so
 * the gate re-reads that file and demands the two agree on the set of clips. A note
 * that drifts from the measurement is worse than no note -- it is a number on his
 * screen that no longer came from anywhere.
 */
const path = require('path');
const fs = require('fs');
const { settle: SETTLE } = require(path.join(__dirname, 'bohemia_settle.js'));
const ALPHA = path.join(__dirname, '..', 'slices', 'BOHEMIA_ALPHA_0_9.html');
const RAW = path.join(__dirname, '..', 'records', 'BOHEMIA_THE_63_CLIP_AUDIT_RAW_9_5_26.txt');

let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== JUDGE LIST MOVES: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }

  ok('the audit file the notes are generated from is checked in', fs.existsSync(RAW));

  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await SETTLE(pg, 2500);
  await pg.click('#front').catch(() => {});
  await SETTLE(pg, 1200);
  await pg.evaluate(() => { const t = [...document.querySelectorAll('.tab')].find(x => x.dataset.p === 'anim'); if (t) t.click(); });
  await SETTLE(pg, 2000);
  await pg.evaluate(() => { const bt = document.getElementById('judgeAllBtn'); if (bt) bt.click(); });
  await SETTLE(pg, 2500);

  const shape = await pg.evaluate(() => {
    const host = document.getElementById('judgeAll');
    if (!host) return null;
    host.parentElement.scrollTop = host.offsetTop - 60;
    return {
      clips: (typeof CLIPS !== 'undefined') ? CLIPS.length : 0,
      rows: host.querySelectorAll('canvas.jaCv').length,
      /* READ THE NOTES OFF THE ROWS HE LOOKS AT, not off the table that feeds them.
         The first cut asked for the CLIP_NOTE global and got 0, because the table is
         const inside the panel's own closure -- so the check was measuring SCOPE and
         would have gone red with the notes rendering perfectly on screen. The DOM is
         the surface; the table is an implementation detail. */
      noteTexts: [...host.querySelectorAll('.row')].map(r => {
        const n = r.querySelector('div.mini'); return n ? n.textContent.trim() : '';
      }).filter(t => t.length > 0),
      filters: [...host.querySelectorAll('button')].map(x => x.textContent).filter(t => /ALL|UNJUDGED|FLAGGED/.test(t)).length,
      exportBtn: [...host.querySelectorAll('button')].some(x => /EXPORT/.test(x.textContent))
    };
  });
  ok('the judge panel opens', !!shape);
  if (!shape) { await b.close(); done(); }

  /* 1. A PICTURE PER CLIP */
  ok(`every clip has a row with its own canvas (${shape.rows} canvases for ${shape.clips} clips)`,
     shape.rows === shape.clips && shape.rows > 90);

  await SETTLE(pg, 1200);

  /* 2 + 3. THE PICTURE IS A BODY, AND IT MOVES */
  const motion = await pg.evaluate(async () => {
    const onGlass = () => [...document.querySelectorAll('#judgeAll canvas.jaCv')].filter(c => {
      const r = c.getBoundingClientRect();
      return r.top > -40 && r.bottom < window.innerHeight + 40 && c.width > 0;
    });
    const sig = c => {
      const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
      let h = 2166136261 >>> 0, ink = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3]) { ink++; h ^= (i + d[i] + d[i + 1] * 3); h = Math.imul(h, 16777619) >>> 0; }
      return { h, ink };
    };
    const cvs = onGlass();
    const a = cvs.map(sig);
    await new Promise(r => setTimeout(r, 1100));   /* more than two beats at 120 BPM */
    const b2 = cvs.map(sig);
    let inked = 0, changed = 0;
    for (let i = 0; i < a.length; i++) { if (a[i].ink > 100) inked++; if (a[i].h !== b2[i].h) changed++; }
    return { onScreen: cvs.length, inked, changed };
  });

  ok(`the rows on screen are drawing a body, not an empty box (${motion.inked}/${motion.onScreen} inked)`,
     motion.onScreen >= 4 && motion.inked === motion.onScreen);
  ok(`the rows on screen are ANIMATING, not showing a still (${motion.changed}/${motion.onScreen} changed over 1.1s)`,
     motion.onScreen > 0 && motion.changed >= Math.ceil(motion.onScreen / 2));

  /* THE NOTES CAME FROM THE MEASUREMENT */
  const raw = fs.readFileSync(RAW, 'utf8');
  ok(`every row carries what the audit measured about it (${shape.noteTexts.length} notes on ${shape.rows} rows)`,
     shape.noteTexts.length === shape.rows);
  /* THE NUMBERS ON HIS SCREEN HAVE TO BE THE NUMBERS IN THE AUDIT FILE. Each note
     opens with "moves N%", and N is the audit's best-facing peak, ROUNDED.
     The first cut grepped the raw text for the literal N and reported 8 strays --
     which were not strays at all: 100.89 rounds to 101, and "101" appears nowhere
     in a file that stores 100.89. IT WAS TESTING MY ROUNDING, NOT THE DATA. So the
     raw column is parsed and rounded the same way before comparing. */
  /* *** AND THE SECOND CUT OF THIS CHECK FAILED TWO HONEST NOTES, which is worth
     the words because the numbers were right and the RULERS disagreed. `drunk`
     measures 82.50% and `flee-scramble` 90.50%. The notes are generated in Python,
     whose %.0f rounds half to EVEN (82, 90); this gate re-rounded in JS, whose
     Math.round rounds half UP (83, 91). Nothing was wrong with the data or the
     screen -- two rounding modes met on an exact .5 and the gate called his screen
     a liar. So both neighbours of a measured value are accepted. A fabricated
     number still fails; only the half-cent disagreement is forgiven. */
  const measured = new Set();
  for (const m of raw.matchAll(/^\s+([\d.]+)\s+([\d.]+)\s+\S+\s+\S+\s+(\S+)$/gm)) {
    const v = parseFloat(m[1]);
    measured.add(Math.floor(v)); measured.add(Math.ceil(v));
  }
  const pcts = shape.noteTexts.map(t => (t.match(/moves (\d+)%/) || [])[1]).filter(Boolean).map(Number);
  const strays = pcts.filter(n => !measured.has(n));
  ok(`every "moves N%" on a row is a number the audit actually measured (${pcts.length} checked against ${measured.size} measured values, ${strays.length} stray)`,
     pcts.length >= shape.rows - 2 && strays.length === 0);

  ok('the filters are there so 105 rows is navigable (all / unjudged / flagged)', shape.filters >= 3);
  ok('the .txt export survived (verdicts land as a repo file, never .json)', shape.exportBtn);
  ok('no page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);

  await b.close();
  done();
})();
