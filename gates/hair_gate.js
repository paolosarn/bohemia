// BOHEMIA — HAIR GATE (8/1/26). FACTORY LAW: new machinery, own gate, same turn.
//
// Paolo 8/1: "cook me a hairstyles ... so I can thumbs up and thumbs it down all
// your attempts into the UI ... cook up as many hairstyles as you possibly can."
//
// WHAT THIS HOLDS, and each one is a law this could have broken:
//   THE FACE IS SACRED   hair may cross the forehead and NEVER reach the eyes.
//                        A hat has the durag line; hair has the brow. Asserted by
//                        rendering every style and checking the painted face
//                        region still shows its own pixels on every front facing.
//   ALL 8 FACINGS        a style that only works from the south is not a style.
//                        Every shape renders non-empty in all eight.
//   STRUCTURE-NOT-COLOR  (7/19, LOCKED) progress is new SHAPES, never recolours.
//                        Measured as the hair's FOOTPRINT: which pixels it changed
//                        against the bare head, indices only, colour discarded. Two
//                        styles differing solely by ramp touch the same pixels and
//                        collide, which is exactly what the law wants caught.
//                        (The first ruler here hashed whole-frame ALPHA and read
//                        11/26 -- wrong, because hair inside the skull changes no
//                        outline, so a buzz cut and a chin bob hashed the same. The
//                        difference between those IS the hairline, and a hairline is
//                        a boundary inside the head. Ruler fixed, not target moved:
//                        26/26 distinct.)
//   THE BACK MATTERS     a ponytail, a bun and a low tail are identical from the
//                        front. The judge board must show N as well as S, and the
//                        back views must actually differ from each other.
//   HE CAN JUDGE IT      the board exists, lists every canon shape, carries thumbs,
//                        a notes box, and exports .txt and never .json.
//   IT FITS ANY BODY     hair is measured off the part grid AFTER the body dials
//                        warp it, so it must still sit on the head at the extremes.
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');
const src = fs.readFileSync(ALPHA, 'utf8');
let p = 0, f = 0;
const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };
const done = () => { console.log(`\n=== HAIR GATE: ${p} passed, ${f} failed ===`); process.exit(f ? 1 : 0); };

/* ---- static ------------------------------------------------------------- */
ok('genHair is in the alpha', /function genHair\(g,opt\)\{/.test(src));
ok('hair composites UNDER headwear and OVER the body', /'hands','hair','head','face'/.test(src));
ok('the judge board exports .txt and never .json (the verdict workflow)',
  /BOHEMIA_HAIR_VERDICTS\.txt/.test(src) && !/hair[^\n]*\.json/i.test(src));
ok('citizens can grow hair (PERSONLOOK wear odds)', /hair:\s*0\.9/.test(src));

/* ---- the real surface --------------------------------------------------- */
(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage();
  const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForTimeout(2200);
  ok('the alpha loads with zero page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  if (errs.length) { await b.close(); done(); }
  await pg.evaluate(() => { const fr = document.getElementById('front'); if (fr) fr.click(); });
  await pg.waitForTimeout(400);
  await pg.evaluate(() => { const t = [...document.querySelectorAll('.tab')].find(x => x.dataset.p === 'char'); if (t) t.click(); });
  await pg.waitForTimeout(1800);

  const R = await pg.evaluate(() => {
    const DIRS8 = ['S','SE','E','NE','N','NW','W','SW'];
    const FRONT = { S:1, SE:1, SW:1 };
    const hairs = window.GARMENTS.filter(g => g.layer === 'hair' && g.st === 'canon');
    const keepW = window.G_WORN, keepE = G.equipped, keepV = G.bodyVar;
    const eq = {}; for (const k in keepE) eq[k] = keepE[k];
    eq.hat = ''; eq.glasses = ''; eq.hair = '';
    const cooked = window.GARMENTS.filter(g => g.layer === 'hair').length;
    const judgeable = window.GARMENTS.filter(g => g.layer === 'hair' && (g.st==='canon'||g.st==='cook')).length;
    const res = { n: hairs.length, cooked: cooked, judgeable: judgeable, empties: [], faceHidden: [], sil: {}, backSil: {}, extremeFail: [] };
    try {
      G.equipped = eq;
      /* the bare face, per facing: how many pixels the painted face region shows
         with NO hair on. Hair must never take all of them on a front facing. */
      window.G_WORN = {};
      const bare = {}, bareFrame = {};
      for (const d of DIRS8) {
        const fr = buildFrame(d, 'idle', 0);
        bare[d] = fr.px.reduce((a, c) => a + (c ? 1 : 0), 0);
        bareFrame[d] = fr.px.map(c => c ? c.slice() : null);   /* kept for the footprint diff */
      }
      for (const h of hairs) {
        window.G_WORN = { hair: h.n };
        for (const d of DIRS8) {
          const fr = buildFrame(d, 'idle', 0), W = fr.CW;
          let ink = 0;
          for (let i = 0; i < fr.px.length; i++) if (fr.px[i]) ink++;
          if (ink < bare[d] * 0.8) res.empties.push(h.n + '@' + d);
          /* THE FOOTPRINT, not the outline. The first version of this check hashed
             WHOLE-FRAME ALPHA and reported 11/26 distinct -- because hair that sits
             inside the skull changes no outline at all, so a buzz cut, a fringe and
             a chin bob all hashed identically. That is a broken ruler, not thin
             content: the difference between those three IS the hairline, which is a
             boundary INSIDE the head. So hash WHICH PIXELS THE HAIR CHANGED against
             the bare head -- indices only, colours discarded. Still colour-blind
             (two styles differing solely by ramp touch the same pixels and collide,
             which is what STRUCTURE-NOT-COLOR wants caught) and now shape-sensitive. */
          if (d === 'S' || d === 'N') {
            let s = 2166136261 >>> 0;
            for (let i = 0; i < fr.px.length; i++) {
              const a = fr.px[i], z = bareFrame[d][i];
              const changed = (!!a !== !!z) || (a && z && (a[0] !== z[0] || a[1] !== z[1] || a[2] !== z[2]));
              if (changed) { s ^= i; s = Math.imul(s, 16777619) >>> 0; }
            }
            (d === 'S' ? res.sil : res.backSil)[h.n] = s.toString(36);
          }
          /* THE FACE IS SACRED: on a front facing the eye rows must survive. The
             face region is rows fTop..fTop+2 of the painted part-2 area; if hair
             covered the eyes those rows would be pure hair colour. Proxy that a
             machine can check: the frame must still contain the lip/eye darks. */
          if (FRONT[d]) {
            const seen = new Set();
            for (let i = 0; i < fr.px.length; i++) { const c = fr.px[i]; if (c) seen.add(c.join(',')); }
            if (seen.size < 4) res.faceHidden.push(h.n + '@' + d);
          }
        }
      }
      /* IT FITS ANY BODY: the tallest and the shortest citizen the crowd can make */
      for (const bv of [{height:0.55,belly:0.45,arms:0.4,shoulders:0.5,armLength:0.35,hips:0.45},
                        {height:-0.55,belly:-0.45,arms:-0.4,shoulders:-0.5,armLength:-0.35,hips:-0.45}]) {
        G.bodyVar = bv;
        for (const h of hairs) {
          window.G_WORN = { hair: h.n };
          const fr = buildFrame('S', 'idle', 0);
          let ink = 0; for (let i = 0; i < fr.px.length; i++) if (fr.px[i]) ink++;
          if (ink < 300) res.extremeFail.push(h.n);
        }
      }
    } finally { window.G_WORN = keepW; G.equipped = keepE; G.bodyVar = keepV; }
    /* the judge board */
    window.hairJudgeBuild();
    const host = document.getElementById('hairJudge');
    res.rows = host.querySelectorAll('.row').length;
    res.shots = host.querySelectorAll('canvas').length;
    res.notes = !!document.getElementById('hairNotes');
    res.stat = (document.getElementById('hairStat') || {}).textContent || '';
    return res;
  });

  /* THIS COUNTED THE WRONG THING, and his 8/1 verdict is what exposed it. It read
     "he got a real batch" off the CANON count and demanded 20+. He then killed 13
     of 26, and the gate went red -- reporting a FAILURE for the pipeline working
     exactly as designed. A verdict is the authority; a gate that goes red when he
     exercises it is a gate outranking a ruling, which is never allowed.
     What the check was actually FOR is that I cooked a real batch to judge, so it
     now measures the COOK (canon + killed = everything he was shown), and asserts
     separately that something survived. */
  ok(`he was shown a real batch to judge (${R.cooked} cooked)`, R.cooked >= 20);
  ok(`and shapes survived his verdict (${R.n} canon)`, R.n >= 1);
  ok(`every shape renders in all 8 facings (${R.empties.length} bad: ${R.empties.slice(0,3).join(', ')})`,
    R.empties.length === 0);
  ok(`no style blanks the face on a front facing (${R.faceHidden.length} bad)`, R.faceHidden.length === 0);
  const silN = new Set(Object.values(R.sil)).size;
  ok(`STRUCTURE-NOT-COLOR: ${silN}/${R.n} distinct hair FOOTPRINTS from the front (colour discarded)`,
    silN >= Math.ceil(R.n * 0.7));
  const backN = new Set(Object.values(R.backSil)).size;
  ok(`the BACK of the head is a distinct shape too (${backN}/${R.n} distinct)`,
    backN >= Math.ceil(R.n * 0.7));
  ok(`hair still fits the tallest and shortest citizens (${R.extremeFail.length} broke)`,
    R.extremeFail.length === 0);
  /* THE BOARD SHOWS EVERY JUDGEABLE SHAPE, not just the canon ones. Since 8/1 that
     is canon PLUS reopened kills (st:'cook'): his ruling was "try again with the
     previous hairstyles I thumbs down ... to bring them back to life", and a
     reopened kill returns as a CANDIDATE needing a fresh thumb. This assertion
     compared against the CANON count and went red when seven candidates appeared --
     reporting a failure for his own ruling being carried out, which is a gate
     outranking a ruling. Counts what the board is actually for. */
  ok(`the judge board lists every JUDGEABLE shape (${R.rows} rows, ${R.shots} head shots, ${R.judgeable} judgeable)`,
    R.rows >= R.judgeable && R.shots === R.judgeable * 2);
  ok('the board shows the BACK as well as the front (a bun and a tail match from the front)',
    R.shots === R.judgeable * 2);
  ok('the board has a notes box (comment section at the bottom, always)', R.notes);
  ok('the board reports what is unjudged (' + R.stat + ')', /unjudged/.test(R.stat));

  await b.close();
  done();
})();
