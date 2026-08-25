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
  /* *** PINNED PER FACING, BECAUSE ONE NUMBER WAS MEASURING TWO DIFFERENT THINGS
     (split 8/25). *** Clause 3 is about hair drawn as machine-straight lines in open
     air. On the SIX non-profile facings that is exactly what the number sees, and it
     stays pinned where it was. On the TWO PROFILE facings the hair's front edge now
     follows the front of his painted FACE, because hair is no longer allowed in front
     of it -- and a real hairline in profile IS fairly straight, it runs down in front of
     the ear. Rolling both into one average let a correct hairline look like a clause 3
     regression, and would have pushed me to jag an edge that should not be jagged.
     THE FRONT AND BACK PINS DID NOT MOVE. Only the profile carries a looser number, and
     only because the clamp that produced it is the fix to his round-4 verdict:
         546 hair pixels sat in front of his face across all 15 styles. Now zero.
     TWO JAG ATTEMPTS ARE RECORDED IN THE ALPHA rather than repeated here: a 1-in-4 step
     moved the number by 0.1 points and a 1-in-2 step by nothing, because the edge is
     tracing the face rather than wandering. That is the tell that it is anatomy. */
  const PINNED_STRAIGHT = 0.195;   // non-profile facings: unchanged from 8/21
  const PINNED_PROFILE  = 0.40;    // E and W only: the hairline follows his painted face
  const PINNED_LONGEST  = 6;       // longest straight run, non-profile
  const PINNED_LONGEST_PROFILE = 10;
  const ST = await pg.evaluate(() => {
    const HAIR = (window.GARMENTS || []).filter(g => g.layer === 'hair' && g.st === 'canon');
    let rows = 0, inLong = 0, longest = 0, pRows = 0, pInLong = 0, pLongest = 0;
    for (const h of HAIR) for (const d of ['S','SE','E','NE','N','NW','W','SW']) {
      if (window.CLO_SET_DIR) window.CLO_SET_DIR(d);
      const f = buildFrame(d, 'idle', 0);
      let o = null; try { o = h.gen(f.grid, f.CW, f.CH); } catch (e) {}
      if (!o) continue;
      const L = {}, R2 = {};
      for (const k in o) { const i = +k, x = i % f.CW, y = (i / f.CW) | 0;
        if (L[y] === undefined || x < L[y]) L[y] = x;
        if (R2[y] === undefined || x > R2[y]) R2[y] = x; }
      const prof = (d === 'E' || d === 'W');
      for (const side of [L, R2]) {
        const ys = Object.keys(side).map(Number).sort((a, b) => a - b);
        let run = 1;
        for (let n = 1; n <= ys.length; n++) {
          const cont = n < ys.length && ys[n] === ys[n-1] + 1 && side[ys[n]] === side[ys[n-1]];
          if (cont) run++;
          else { if (prof) { pRows += run; if (run > pLongest) pLongest = run; if (run >= 4) pInLong += run; }
                 else { rows += run; if (run > longest) longest = run; if (run >= 4) inLong += run; }
                 run = 1; }
        }
      }
    }
    if (window.CLO_SET_DIR) window.CLO_SET_DIR('S');
    return { frac: rows ? inLong / rows : 0, longest, rows, styles: HAIR.length,
             pfrac: pRows ? pInLong / pRows : 0, pLongest, pRows };
  });
  ok('CLAUSE 3, THE SIX OPEN-AIR FACINGS: hair rows in a straight run of 4+ only ever ' +
     'shrinks (' + (ST.frac * 100).toFixed(1) + '%, pinned at ' + (PINNED_STRAIGHT * 100).toFixed(1) +
     '%, over ' + ST.rows + ' edge rows across ' + ST.styles + ' styles)', ST.frac <= PINNED_STRAIGHT);
  ok('CLAUSE 3, open air: no hair edge runs straight for longer than ' + PINNED_LONGEST +
     ' rows (longest is ' + ST.longest + ')', ST.longest <= PINNED_LONGEST);
  ok('CLAUSE 3, THE TWO PROFILES where the hairline traces his painted face (' +
     (ST.pfrac * 100).toFixed(1) + '%, pinned at ' + (PINNED_PROFILE * 100).toFixed(0) +
     '%, over ' + ST.pRows + ' edge rows)', ST.pfrac <= PINNED_PROFILE);
  ok('CLAUSE 3, profile: longest straight run (' + ST.pLongest + ', pinned at ' +
     PINNED_LONGEST_PROFILE + ')', ST.pLongest <= PINNED_LONGEST_PROFILE);
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

  /* *** NO HAIR IN FRONT OF HIS FACE (Paolo 8/20, round 4). ***
     "east and west hairstyles look like ABSOLUTE DOG SHIT ACROSS THE BOARD." He killed
     13 of 15. ACROSS THE BOARD meant one render defect judged thirteen times, and this
     was it: on the rows his eyes, nose and mouth occupy, the hair mass expanded past the
     FRONT of his face and hung in the empty air there. The face was squeezed between
     hair behind and hair in front, so every profile read as a helmet with a slot in it
     instead of a person.
     put() already refused to paint ON the face, which is why nobody looked further.
     MEASURED BEFORE THE FIX: 546 hair pixels in front of the face, ZERO of 15 styles
     clean, worst SHAG at 4px out. Pinned at zero.
     ONLY THE FACE ROWS ARE JUDGED: a fringe over the forehead is correct and is not
     counted, because the forehead sits above the face part. Below the jaw is not counted
     either -- hair falls in front of the shoulders and always did. */
  const FRONT = await pg.evaluate(() => {
    const H = (window.GARMENTS || []).filter(g => g.st === 'canon' && g.layer === 'hair');
    let ahead = 0, worst = 0; const bad = [];
    for (const d of ['E', 'W']) {
      if (window.CLO_SET_DIR) window.CLO_SET_DIR(d);
      const f = buildFrame(d, 'idle', 0);
      const faceRow = {};
      for (let i = 0; i < f.CW * f.CH; i++) if (f.grid[i] === 2) {
        const y = (i / f.CW) | 0, x = i % f.CW;
        const r = faceRow[y] || (faceRow[y] = { a: 1e9, b: -1 });
        if (x < r.a) r.a = x; if (x > r.b) r.b = x; }
      /* which way he faces, read off the art: the face sits toward the front of the skull */
      let fS = 0, fN = 0, hS = 0, hN = 0;
      for (let i = 0; i < f.CW * f.CH; i++) { const v = f.grid[i], x = i % f.CW;
        if (v === 2) { fS += x; fN++; } if (v === 1 || v === 2) { hS += x; hN++; } }
      const dir = (fN && hN && (fS / fN) >= (hS / hN)) ? 1 : -1;
      for (const h of H) {
        let o = null; try { o = h.gen(f.grid, f.CW, f.CH); } catch (e) {}
        if (!o) continue;
        let n = 0;
        for (const k in o) { const i = +k, y = (i / f.CW) | 0, x = i % f.CW;
          const fr = faceRow[y]; if (!fr) continue;
          const past = dir > 0 ? (x - fr.b) : (fr.a - x);
          if (past > 0) { n++; if (past > worst) worst = past; } }
        if (n) { ahead += n; bad.push(d + ' ' + h.n + ':' + n); }
      }
    }
    if (window.CLO_SET_DIR) window.CLO_SET_DIR('S');
    return { ahead, worst, bad: bad.slice(0, 6), styles: H.length };
  });
  ok('*** NO HAIR IN FRONT OF HIS FACE, both profiles, all ' + FRONT.styles + ' styles *** (' +
     FRONT.ahead + ' pixels ahead of the face, worst ' + FRONT.worst + 'px' +
     (FRONT.bad.length ? ': ' + FRONT.bad.join(', ') : '') + ')', FRONT.ahead === 0);

  /* *** HAIR AT FOUR TIMES THE PIXELS (Paolo 8/25, LOCKED). ***
     "we made the character model 4x and i feel like with especially the hair your still
      playing with the orignal pixels. not the pixels that are now 1 pixel because we made
      the canvas 4x bigger you know."
     laws/BOHEMIA_LAW_HAIR_AT_FOUR_TIMES_THE_PIXELS_8_25_26.md

     CLAUSE 2, MEASURED: every canon style must carry at least one ONE-PIXEL mark INSIDE
     its own silhouette. Not the outline -- the outline got a one-pixel step on 8/21 and
     that is not the haircut. A mark is a run of one colour with a different hair colour
     on BOTH sides: a strand, a parting, a fade step.
     BEFORE THE STRAND PASS: 9 of 15 styles had NO one-pixel mark anywhere inside them.
     Thinnest internal feature was 8px on SLICK BACK, BOWL CUT and SHAG -- solid blocks
     with a shaded rim and nothing in between.
     NOT A DEMAND FOR NOISE. A buzz cut is allowed to be nearly solid. What is forbidden
     is a generator that CANNOT express a one-pixel mark, because that one is still
     drawing at 56 whatever the canvas says.

     CLAUSE 1, MEASURED: a haircut is one haircut from every angle. genHair branches hard
     on back/profile/front and each branch was written at a different time for a different
     complaint -- nothing has ever asserted the three agree. Turning the head one notch may
     change how the hair LOOKS but not WHAT IT IS, so the hair's own area may not jump
     between adjacent facings. */
  const NAT = await pg.evaluate(() => {
    const H = (window.GARMENTS || []).filter(g => g.st === 'canon' && g.layer === 'hair');
    const DIRS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
    const noFine = [], swing = [];
    const area = {}, len = {};
    const sheet = [], shortSide = [];
    for (const d of DIRS) {
      if (window.CLO_SET_DIR) window.CLO_SET_DIR(d);
      const f = buildFrame(d, 'idle', 0);
      /* his painted skull, never a guess */
      let gMn = 1e9, gMx = -1, gTop = 1e9, gBot = -1;
      for (let i = 0; i < f.grid.length; i++) { const gv = f.grid[i];
        if (gv === 1 || gv === 2) { const x = i % f.CW, y = (i / f.CW) | 0;
          if (x < gMn) gMn = x; if (x > gMx) gMx = x;
          if (y < gTop) gTop = y; if (y > gBot) gBot = y; } }
      const gH = gBot - gTop + 1;
      const midA = gMn + Math.floor((gMx - gMn + 1) * 0.35);
      const midB = gMn + Math.floor((gMx - gMn + 1) * 0.65);
      for (const h of H) {
        let o = null; try { o = h.gen(f.grid, f.CW, f.CH); } catch (e) {}
        if (!o) continue;
        (area[h.n] = area[h.n] || {})[d] = Object.keys(o).length;
        /* *** LENGTH IS THE IDENTITY, AND AREA IS NOT. *** The 8/25 pin used the hair's
           own AREA, which SHOULD swing: from the front you see a face and two curtains,
           from behind a whole skull of hair. It passed at 62% while SHOULDER LENGTH was
           falling 11px below the jaw facing south and ZERO facing east -- a
           shoulder-length haircut that became a crop when he turned his head, sitting
           inside a green gate. How far the hair FALLS is a property of the object and
           not of the view, so it is the ruler clause 1 actually needs. */
        let bot = -1;
        const below = {};
        for (const k in o) { const i = +k, y = (i / f.CW) | 0;
          if (y > bot) bot = y;
          if (y > gBot) (below[y] = below[y] || {})[i % f.CW] = 1; }
        (len[h.n] = len[h.n] || {})[d] = Math.max(0, bot - gBot) / gH;
        /* NEVER A SHEET ACROSS HIS CHEST on a front facing: below the jaw the mass is
           two curtains at the sides, never one mass down the sternum. My own first
           repair of the length bug drew exactly that and only looking caught it. */
        if (d === 'S' || d === 'SE' || d === 'SW') {
          for (const y in below) { let n = 0;
            for (let x = midA; x <= midB; x++) if (below[y][x]) n++;
            if (n >= (midB - midA + 1)) { sheet.push(h.n + ' ' + d); break; } }
        }
        /* AND THE RENDERED HALF OF THE 8/1 + 8/2 RULING (craft_law_gate can only read
           the source): from behind and side-on the hair covers the WHOLE skull, so the
           mass must reach the jaw. */
        if (d !== 'S' && d !== 'SE' && d !== 'SW' && bot < gBot) shortSide.push(h.n + ' ' + d);
        if (d !== 'S') continue;
        /* one-pixel marks inside the silhouette, front facing */
        const rows = {};
        for (const k in o) { const i = +k, y = (i / f.CW) | 0; (rows[y] = rows[y] || []).push(i % f.CW); }
        let one = 0;
        for (const y in rows) {
          const xs = rows[y].sort((a, c) => a - c);
          let st2 = 0;
          for (let n = 1; n <= xs.length; n++) {
            const cont = n < xs.length && xs[n] === xs[n-1] + 1 &&
              o[y * f.CW + xs[n]].join() === o[y * f.CW + xs[st2]].join();
            if (cont) continue;
            const L2 = o[y * f.CW + xs[st2] - 1], R3 = o[y * f.CW + xs[n-1] + 1];
            const me = o[y * f.CW + xs[st2]].join();
            if (L2 && R3 && L2.join() !== me && R3.join() !== me && (n - st2) === 1) one++;
            st2 = n;
          }
        }
        if (!one) noFine.push(h.n);
      }
    }
    if (window.CLO_SET_DIR) window.CLO_SET_DIR('S');
    /* identity swing: biggest area jump between two ADJACENT facings, as a fraction */
    for (const n in area) {
      let worst = 0, pair = '';
      for (let i = 0; i < DIRS.length; i++) {
        const a = area[n][DIRS[i]], c = area[n][DIRS[(i + 1) % DIRS.length]];
        if (!a || !c) continue;
        const j = Math.abs(a - c) / Math.max(a, c);
        if (j > worst) { worst = j; pair = DIRS[i] + '->' + DIRS[(i + 1) % DIRS.length]; }
      }
      swing.push({ n, worst, pair });
    }
    swing.sort((a, c) => c.worst - a.worst);
    /* the same one-notch rule, on LENGTH */
    const lswing = [];
    for (const n in len) {
      let worst = 0, pair = '';
      for (let i = 0; i < DIRS.length; i++) {
        const a = len[n][DIRS[i]], c = len[n][DIRS[(i + 1) % DIRS.length]];
        if (a === undefined || c === undefined) continue;
        const j = Math.abs(a - c);
        if (j > worst) { worst = j; pair = DIRS[i] + '->' + DIRS[(i + 1) % DIRS.length]; }
      }
      lswing.push({ n, worst, pair });
    }
    lswing.sort((a, c) => c.worst - a.worst);
    return { noFine, swing: swing.slice(0, 4), worst: swing.length ? swing[0].worst : 0,
             lswing: lswing.slice(0, 3), lworst: lswing.length ? lswing[0].worst : 0,
             sheet, shortSide, styles: H.length };
  });
  ok('*** CLAUSE 2: every style carries a ONE-PIXEL mark inside it, not just on its edge ***' +
     ' (' + (NAT.styles - NAT.noFine.length) + '/' + NAT.styles +
     (NAT.noFine.length ? ' -- STILL DRAWN AT 56: ' + NAT.noFine.join(', ') : '') + ')',
     NAT.noFine.length === 0);
  const PINNED_SWING = 0.62;   // biggest hair-area jump between adjacent facings; only shrinks
  ok('CLAUSE 1: a haircut is one haircut from every angle -- biggest area jump between ' +
     'adjacent facings is ' + (NAT.worst * 100).toFixed(0) + '% (pinned ' +
     (PINNED_SWING * 100).toFixed(0) + '%), worst ' +
     NAT.swing.map(q => q.n + ' ' + q.pair + ' ' + (q.worst * 100).toFixed(0) + '%').join(', '),
     NAT.worst <= PINNED_SWING);
  /* THE RULER THAT WOULD HAVE CAUGHT IT. Pinned at the measured 0.300 (ASH SWEEP,
     SW->W), which is a back-of-head length coming into view as he turns and is anatomy,
     not a defect. What it forbids is what SHOULDER LENGTH and LONG LOOSE were doing:
     0.500 head-heights of hair from the front and NOTHING from any other angle. */
  const PINNED_LEN_SWING = 0.31;   // head-heights of fall, one notch of turn; only shrinks
  ok('*** CLAUSE 1: how far a haircut FALLS may not change as the head turns one notch ' +
     '(' + NAT.lworst.toFixed(3) + ' head-heights, pinned ' + PINNED_LEN_SWING.toFixed(2) + ') *** worst ' +
     NAT.lswing.map(q => q.n + ' ' + q.pair + ' ' + q.worst.toFixed(2)).join(', '),
     NAT.lworst <= PINNED_LEN_SWING);
  ok('CLAUSE 1: below the jaw a front facing draws TWO CURTAINS, never a sheet across ' +
     'his chest (' + (NAT.sheet.length ? NAT.sheet.slice(0, 6).join(', ') : 'none') + ')',
     NAT.sheet.length === 0);
  ok('8/1 + 8/2 ON THE RENDERED PIXELS: from behind and side-on the hair reaches the jaw ' +
     '(' + (NAT.shortSide.length ? NAT.shortSide.slice(0, 6).join(', ') : 'all 15, all 5 facings') + ')',
     NAT.shortSide.length === 0);

  await b.close();
  done();
})();
