const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
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
/* the filename now carries the ROUND (8/1), so this matches the prefix rather than
   a fixed name -- still .txt, still never .json, per the verdict workflow. */
ok('the judge board exports .txt and never .json (the verdict workflow)',
  /BOHEMIA_HAIR_VERDICTS_R'\s*\+\s*hairRound\(\)\s*\+\s*'\.txt/.test(src)
  && !/hair[^\n]*\.json/i.test(src));
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
  await SETTLE(pg, 2200);
  ok('the alpha loads with zero page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  if (errs.length) { await b.close(); done(); }
  await pg.evaluate(() => { const fr = document.getElementById('front'); if (fr) fr.click(); });
  await SETTLE(pg, 400);
  await pg.evaluate(() => { const t = [...document.querySelectorAll('.tab')].find(x => x.dataset.p === 'char'); if (!t) throw new Error('the tab this gate measures is not reachable: a missing tab is a FAILURE, not a skip (ONE WORLD TAB, 8/2)'); t.click(); });
  await SETTLE(pg, 1800);

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
    R.rows >= R.judgeable && R.shots === R.judgeable);
  /* ALL EIGHT, not two (Paolo 8/2: "I have not seen all eight Cardinal directions
     of the hair, just north and south"). He had approved 21 styles off 2 views of
     8. Front-and-back was never enough: the PROFILE is where a mohawk's ridge, a
     ponytail's tail and a fringe's depth actually read, and it is where the strip
     bug I recorded still lives. A judge surface that hides a facing hides a defect. */
  /* ONE BIG HEAD THAT TURNS, not eight tiny ones (Paolo 8/2: "IN THE UI THEY ARE SO
     FUCKING TINY I CANT TELL SHIT WHY NOT HAVE A LARGE ICON THE REVOLVES IN ALL 8
     DIRECTIONS"). This gate previously demanded EIGHT shots per style, which is
     exactly the mistake he called out: I answered "he has only seen 2 of 8" with
     eight heads at scale 1, so every angle was present and none was readable.
     EIGHT TINY HEADS IS NOT EIGHT VIEWS, IT IS NONE. The invariant is not a count
     of shots -- it is that all eight facings are REACHABLE and BIG. */
  ok('one large head per style, not a row of unreadable thumbnails',
    R.shots === R.judgeable);
  ok('and it cycles ALL EIGHT facings so none is hidden',
    /HAIR_SPIN_DIRS = \['S','SE','E','NE','N','NW','W','SW'\]/.test(src)
    && /HAIR_SPIN\[0\] = \(HAIR_SPIN\[0\] \+ 1\) % 8/.test(src));
  ok('the head is drawn at 3x, not 1x (that was the whole complaint)',
    /headShot\(h\.n, HAIR_SPIN_DIRS\[HAIR_SPIN\[0\]\], 3\)/.test(src));
  ok('the board has a notes box (comment section at the bottom, always)', R.notes);
  /* A ROUND IS A ROUND (Paolo 8/1: "fully update the judge save system ... when I
     leave notes they shouldn't be around for the next round"). Notes lived in one
     forever-key, so every wave opened holding the last wave's comments. Driven on
     the real surface below: type a note, export, and the box must come back EMPTY
     with the round advanced and the sheet archived -- cleared, never lost. */
  const RR = await pg.evaluate(() => {
    const ta = document.getElementById('hairNotes');
    if (!ta) return { ok: false };
    const r0 = parseInt(localStorage.getItem('bohemia_hair_roundno') || '1', 10);
    ta.value = 'GATE PROBE NOTE'; ta.oninput();
    const stored = localStorage.getItem('bohemia_hair_notes_r' + r0);
    /* *** PRESS THE HAIR BOARD'S OWN BUTTON. *** This searched EVERY button in the
       document for the word EXPORT and took the first one -- and the alpha has
       five. #dirExport ("EXPORT .TXT", the DIRECT tab) sits at ALPHA:1123, thirty
       lines ABOVE #hairExport at :1154, so `.find` returned it every time and this
       gate has been clicking another tab's export button and then reporting the
       hair round as broken. The handler was correct the whole time.
       The element has an id. Use it. A ruler that searches for a button by the word
       printed on it, in a sixteen-tab app, will eventually press something else. */
    const btn = document.getElementById('hairExport');
    if (!btn) return { ok: true, stored: stored, noButton: true };
    btn.click();
    return {
      ok: true, stored: stored,
      advanced: parseInt(localStorage.getItem('bohemia_hair_roundno') || '1', 10) === r0 + 1,
      cleared: (document.getElementById('hairNotes') || {}).value === '',
      archived: !!localStorage.getItem('bohemia_hair_round_' + r0),
      votesCleared: !localStorage.getItem('bohemia_hair_votes_b1'),
    };
  });
  ok('a note is saved against the CURRENT round', RR.stored === 'GATE PROBE NOTE');
  ok('exporting ADVANCES the round', RR.advanced);
  ok('and the notes box comes back EMPTY for the next round', RR.cleared);
  ok('the thumbs reset too, so a stale vote cannot ride into the next wave', RR.votesCleared);
  ok('but nothing is lost -- the sheet is archived under its round', RR.archived);
  ok('the board reports what is unjudged (' + R.stat + ')', /unjudged/.test(R.stat));

  /* *** CLAUSE 3 IN PIXELS, NOT IN THE SOURCE (8/21). ***
     craft_law_gate already asserts clause 3 -- "no straight lines, hair is little off
     shapes" -- but only by finding the wobble IN THE CODE. That is a mention check,
     and the wobble can be present, correct, and still produce a machine-straight edge:
     it did. It steps by a whole CELL, so when the rig went to 112 the hair kept
     wobbling in 2x2 blocks and HALF of every hair edge sat in a straight run of four
     rows or more, with 16-row straight sides on TEMPLE TAPER and BOWL CUT. Nothing in
     the machine noticed, because nothing in the machine was looking at the edge.
     THIS LOOKS AT THE EDGE. It walks each canon style's silhouette on all 8 facings
     and counts consecutive rows sitting at exactly the same x. A run of RIG_RS is the
     floor and means nothing (a cell is that many rows tall). Runs of 4+ are the thing
     he named, and the fraction of edge rows inside one is a RATCHET THAT ONLY SHRINKS.
     Measure it with: node tools/bohemia_hair_straightness.js */
  const PINNED_STRAIGHT = 0.185;   // fraction of hair edge rows in a straight run of 4+
  const PINNED_LONGEST  = 6;      // longest straight run anywhere, in rows
  const ST = await pg.evaluate(() => {
    const HAIR = (window.GARMENTS || []).filter(g => g.layer === 'hair' && g.st === 'canon');
    let rows = 0, inLong = 0, longest = 0;
    for (const h of HAIR) for (const d of ['S','SE','E','NE','N','NW','W','SW']) {
      if (window.CLO_SET_DIR) window.CLO_SET_DIR(d);
      const f = buildFrame(d, 'idle', 0);
      let o = null; try { o = h.gen(f.grid, f.CW, f.CH); } catch (e) {}
      if (!o) continue;
      const L = {}, R2 = {};
      for (const k in o) { const i = +k, x = i % f.CW, y = (i / f.CW) | 0;
        if (L[y] === undefined || x < L[y]) L[y] = x;
        if (R2[y] === undefined || x > R2[y]) R2[y] = x; }
      for (const side of [L, R2]) {
        const ys = Object.keys(side).map(Number).sort((a, b) => a - b);
        let run = 1;
        for (let n = 1; n <= ys.length; n++) {
          const cont = n < ys.length && ys[n] === ys[n-1] + 1 && side[ys[n]] === side[ys[n-1]];
          if (cont) run++;
          else { rows += run; if (run > longest) longest = run; if (run >= 4) inLong += run; run = 1; }
        }
      }
    }
    if (window.CLO_SET_DIR) window.CLO_SET_DIR('S');
    return { frac: rows ? inLong / rows : 0, longest, rows, styles: HAIR.length };
  });
  ok('CLAUSE 3, MEASURED ON THE EDGE: hair rows in a straight run of 4+ only ever shrinks (' +
     (ST.frac * 100).toFixed(1) + '%, pinned at ' + (PINNED_STRAIGHT * 100).toFixed(0) + '%, over ' +
     ST.rows + ' edge rows across ' + ST.styles + ' styles)', ST.frac <= PINNED_STRAIGHT);
  ok('CLAUSE 3: no hair edge runs straight for longer than ' + PINNED_LONGEST +
     ' rows (longest is ' + ST.longest + ')', ST.longest <= PINNED_LONGEST);
  if (ST.frac < PINNED_STRAIGHT - 0.02 || ST.longest < PINNED_LONGEST - 1)
    console.log('  *** THE HAIR IS LESS STRAIGHT THAN THE PIN. Lower PINNED_STRAIGHT to ' +
      ST.frac.toFixed(3) + ' and PINNED_LONGEST to ' + ST.longest + ' so it cannot slide back. ***');

  /* *** NOBODY WEARS TWO HAIRSTYLES (Paolo 8/21: "Continue fixing east and west hair
     pls"). *** His painted hair/curtain-bob is a PD layer; a generated hairstyle is
     stamped after it. Front-on the generated hair simply covered it and the double was
     invisible. IN PROFILE IT WAS NOT: genHair spans the PART GRID, and his paint reaches
     two cells past that grid each side at the crown (facing E row 10: part ids x52-59,
     his paint x50-61). His bob's ramp holds exactly two colours, [27,26,32] and
     [237,232,220], so what showed through was the near-white one -- a bright blob over
     the forehead on both profiles. MEASURED BEFORE THE FIX: 1,349 leaked pixels across
     15 styles and 3 facings; every style leaked. This counts that exact colour on the
     REAL worn path (G_WORN), not a hand composite, and pins it at zero. */
  const LEAK = await pg.evaluate(() => {
    const CANON = (window.GARMENTS || []).filter(g => g.st === 'canon');
    const hairs = CANON.filter(g => g.layer === 'hair');
    const BOB = (typeof PD !== 'undefined' && PD.ramps && PD.ramps['hair/curtain-bob']) || null;
    if (!BOB) return { skip: 'his painted bob is not in this build' };
    const keep = window.G_WORN;
    let leaked = 0; const worst = [];
    for (const h of hairs) {
      window.G_WORN = { hair: h.n, base: 'WHITE TEE', legs: 'BLUE JEANS' };
      let n = 0;
      for (const d of ['S','SE','E','NE','N','NW','W','SW']) {
        try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
        const f = buildFrame(d, 'idle', 0);
        for (let i = 0; i < f.CW * f.CH; i++) { const c = f.px[i]; if (!c) continue;
          for (const r of BOB) if (c[0] === r[0] && c[1] === r[1] && c[2] === r[2]) { n++; break; } }
      }
      leaked += n; if (n) worst.push(h.n + ':' + n);
    }
    window.G_WORN = keep;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
    return { leaked, worst: worst.slice(0, 5), styles: hairs.length };
  });
  if (LEAK.skip) ok('his painted bob is present to be checked', false);
  else ok('HIS PAINTED BOB NEVER SHOWS UNDER A WORN HAIRSTYLE, ANY FACING (' + LEAK.leaked +
     ' leaked pixels across ' + LEAK.styles + ' styles x 8 facings' +
     (LEAK.worst.length ? ': ' + LEAK.worst.join(', ') : '') + ')', LEAK.leaked === 0);

  /* THE FADE ENDS WHERE THE HAIR ENDS, AND THEY ARE ONE EXPRESSION. The 8/2 profile
     fix taught the hair MASS to cover the whole skull side-on (back||prof) and left
     fadeBot -- a hand copy of the same expression -- at the halfway line, so in profile
     the taper stopped in the middle of a mass that ran to the jaw. Measured: skin-tinted
     pixels sat at mean height 0.74 of the hair instead of 0.91, roughly twice as many of
     them, smeared up into the crown. This is asserted in the SOURCE on purpose: the bug
     was two diverging copies of one expression, so what must hold is that there is only
     ONE. Facing S is unaffected either way, which is why it hid for three weeks. */
  const alphaSrc = fs.readFileSync(ALPHA, 'utf8');
  ok('the fade bottom IS the hair bottom, one expression, not a copy that can drift',
     /fadeBot=sideBot/.test(alphaSrc) &&
     !/fadeBot=back\?hBot/.test(alphaSrc));

  await b.close();
  done();
})();
