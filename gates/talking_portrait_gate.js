/* BOHEMIA — THE PORTRAIT THAT TALKS BACK (8/27). FACTORY LAW: new law, own gate.
 *
 * Paolo 8/26: "every time you speak to someone, their portrait will pop up on screen
 * so you feel like you're relating to them... facial animations too, bro, like talking
 * and shit... from eyebrows moving."
 *
 * WHAT THE 8/26 TURN ACTUALLY SHIPPED WAS HALF OF THIS, and the half nobody could see.
 * facePerform() could say what a face should be doing at millisecond N; renderFace()
 * could draw it. Nothing called either one, because ONLY THE PLAYER HAD A FACE --
 * renderFace has always been invoked exactly one way, renderFace(buildSpec()), and
 * buildSpec() clones `pface`. So "their portrait pops up" had no portrait to pop.
 *
 * THE THREE CLAIMS THIS GATE HOLDS, in the order they can rot:
 *   1  EVERYBODY HAS A FACE, and they are different people (measured pairwise, on
 *      rendered pixels, not on the dials that produced them)
 *   2  THE FACE IS ON SCREEN WHEN SOMEBODY TALKS, and not when nobody does
 *   3  IT IS DRIVEN BY THE LETTERS THEY ARE SAYING, and moves real pixels
 *
 * AND THE ONE THAT IS EASY TO LOSE: A DIAL THAT CANNOT MOVE THE PIXELS IS NOT A DIAL.
 * The first cut of faceFor rolled five hair-style names when renderFace tests for two,
 * and jittered eyeY by less than half a pixel so all forty people had the same eyes.
 * Both looked like variety in the source and were nothing on screen. Test 1c is that
 * lesson: every dial must take more than one value ACROSS A POPULATION.
 *
 *   node gates/talking_portrait_gate.js
 */
'use strict';
const path = require('path');
const fs = require('fs');
const ALPHA = path.join(__dirname, '../slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => { console.log('\n=== TALKING PORTRAIT GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

/* PINS. Distances are FLOORS that may only rise; the dye share is a CEILING. */
const PINNED_CLOSEST = 0.012;   /* closest of 60 faces, measured 0.015 */
const PINNED_MEAN    = 0.080;   /* mean distance, measured 0.100 */
const DYE_CAP        = 8.0;     /* % of a crowd with dyed hair, measured ~5 */
const N              = 60;

(async () => {
  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(String(e)));
  await pg.goto('file://' + ALPHA, { waitUntil: 'load' });
  await pg.waitForFunction(() => typeof faceFor === 'function' && typeof speakingPortrait === 'function',
    { timeout: 30000 });
  ok('the alpha loads with zero page errors' + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);

  const R = await pg.evaluate((cfg) => {
    const out = {};

    /* ---- 1. EVERYBODY HAS A FACE, AND THEY ARE DIFFERENT PEOPLE ------------ */
    const faces = [];
    for (let i = 0; i < cfg.N; i++) {
      const id = 'gate:crowd:' + i, sp = faceFor(id);
      faces.push({ id, sp, buf: renderFace(sp, { ramp: faceRampFor(sp) }) });
    }
    const dist = (a, c) => { let d = 0;
      for (let i = 0; i < 64 * 64; i++) { const o = i * 4;
        d += Math.abs((a[o]*0.30 + a[o+1]*0.59 + a[o+2]*0.11) - (c[o]*0.30 + c[o+1]*0.59 + c[o+2]*0.11)) / 255; }
      return d / (64 * 64); };
    let worst = 1, worstPair = null, sum = 0, cnt = 0;
    for (let i = 0; i < cfg.N; i++) for (let j = i + 1; j < cfg.N; j++) {
      const dd = dist(faces[i].buf, faces[j].buf); sum += dd; cnt++;
      if (dd < worst) { worst = dd; worstPair = faces[i].id + ' / ' + faces[j].id; } }
    out.closest = worst; out.closestPair = worstPair; out.mean = sum / cnt;

    /* 1b. THE SAME PERSON IS THE SAME PERSON. Nothing is stored, so this is the
       only thing making a face you met yesterday the face you remember. */
    const a1 = renderFace(faceFor('gate:crowd:7'), { ramp: faceRampFor(faceFor('gate:crowd:7')) });
    const a2 = renderFace(faceFor('gate:crowd:7'), { ramp: faceRampFor(faceFor('gate:crowd:7')) });
    out.deterministic = a1.every((v, i) => v === a2[i]);

    /* 1c. EVERY DIAL MOVES. */
    const grab = { len:f=>f.face.len, jawW:f=>f.face.jawW, chinW:f=>f.face.chinW, cheekW:f=>f.face.cheekW,
      craniumH:f=>f.face.craniumH, browY:f=>f.face.browY, eyeY:f=>f.face.eyeY, noseY:f=>f.face.noseY,
      mouthY:f=>f.face.mouthY, eyeGap:f=>f.eyes.gap, browThick:f=>f.brows.thick, browLen:f=>f.brows.len,
      mouthW:f=>f.mouth.w, noseW:f=>f.nose.w, hairLen:f=>f.hair.len };
    out.deadDials = [];
    for (const k in grab) { const s = new Set(); faces.forEach(f => s.add(grab[k](f.sp)));
      if (s.size < 2) out.deadDials.push(k + '=' + [...s][0]); }

    /* 1d. NOT A CLOWN PARADE. Dye is rare in a collapsed economy and is therefore a
       statement -- COLOUR IS TERRITORY (8/26) applied to a head.
       MEASURED ON A CROWD, NOT ON THE SIXTY. The pairwise distance above is O(n^2)
       over 4096 pixels so it has to stay small, but a SHARE measured on 60 people
       is noise: the first run of this read 10% against a true 5% and would have
       failed a correct build. Sample size is part of the claim, so the share gets
       its own bigger walk. */
    /* MEASURED AGAINST THE LIST THE HAIR ACTUALLY COMES FROM. The first cut of
       this check read the alpha's portrait palette HAIR_COLORS -- but since
       "one id, one whole person" (8/27) hair comes from NPCFactory, whose pink
       is [196,150,150] and whose red is [200,60,40]. The old check therefore
       searched for a colour NOBODY WEARS ANY MORE and reported a confident
       0.0%, which is a check that has stopped watching anything.
       A CHECK THAT CANNOT FIND THE THING IT IS LOOKING FOR REPORTS PERFECTION. */
    let dyed = 0;
    const NBIG = 600;
    const dyeSet = { '196,150,150': 1, '200,60,40': 1 };   /* NPCFactory's pink and red */
    for (let i = 0; i < NBIG; i++) { const c = faceFor('gate:pop:' + i).hair.color;
      if (c && dyeSet[c.join(',')]) dyed++; }
    out.dyedPct = 100 * dyed / NBIG; out.dyedOf = NBIG;
    /* and prove the ruler can SEE those colours at all, so a future palette
       change makes this go red instead of quietly reading zero forever */
    out.dyeColoursExistInFactory = (typeof NPC_FACTORY !== 'undefined') &&
      NPC_FACTORY.hairColors.filter(c => c && dyeSet[c.join(',')]).length === 2;

    /* ---- 1f. *** ONE ID, ONE WHOLE PERSON *** (Paolo 8/26: "eye colors matching
       the portrait again"). THE PORTRAIT AND THE BODY MUST BE THE SAME PERSON.
       Measured 8/27, before the fix, over 200 citizens:
           SKIN agreed  8.0%
           HAIR agreed  0.0%   -- not one person in two hundred
           EYES: the portrait had 6 colours, the body had ONE for everybody, the
                 PLAYER'S, because the body's facial ramp read `pface`.
       So the face that popped up when somebody talked was a different person from
       the body in front of you. faceFor now READS NPCFactory for skin and hair
       (deleting the younger of two mechanisms, ENGINE SYNC LAW) and the body takes
       the person's own iris/brow/lip through G.faceAs. */
    let skinOK = 0, hairOK = 0;
    const NAG = 200;
    const effHair = (np) => { if (np.hairColor) return np.hairColor.join(',');
      try { const r = PD_DATA.ramps[np.equipped.hair];
            return (r && r.length) ? (r[Math.min(1, r.length - 1)] || r[0]).join(',') : 'null';
      } catch (e) { return 'null'; } };
    for (let i = 0; i < NAG; i++) { const id = 'gate:agree:' + i;
      const np = NPC_FACTORY.npcFrom(id), fc = faceFor(id);
      if (fc._tone && fc._tone[0] === np.skinToneName) skinOK++;
      if (fc.hair.color && fc.hair.color.join(',') === effHair(np)) hairOK++; }
    out.skinAgreePct = 100 * skinOK / NAG;
    out.hairAgreePct = 100 * hairOK / NAG;
    /* *** AND THE BODY MUST ACTUALLY DRAW THOSE EYES. ***
       THE FIRST CUT OF THIS CHECK WAS VACUOUS AND A MUTATION CAUGHT IT: it asserted
       that G.faceAs held a spec with an iris in it, which is true whether or not the
       renderer ever looks at it. Reverting the body to `var _pf=pface` -- deleting
       the entire feature -- left this gate at 27/0.
       A GATE THAT PASSES WITH THE FEATURE DELETED IS NOT A GATE, and this is the
       second time this session I have written one (the other was the every-garment-
       appears sweep on 8/26). The tell is the same both times: THE CHECK LOOKED AT
       THE INPUT INSTEAD OF THE OUTPUT.
       So: render a real body wearing somebody else's face and count the iris pixels
       the renderer actually put down. */
    const keepFace = G.faceAs, keepEq2 = G.equipped, keepVar2 = G.bodyVar, keepWorn2 = window.G_WORN;
    const other = faceFor('gate:agree:3');
    const npEq = NPC_FACTORY.npcFrom('gate:agree:3').equipped;
    const irisPix = (spec) => {
      G.equipped = npEq; G.bodyVar = {}; window.G_WORN = {};
      G.faceAs = spec;
      try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}
      const fr = buildFrame('S', 'idle', 0);
      const want = (spec ? spec.eyes.iris : pface.eyes.iris).map(v => v * 0.55 | 0);
      let n = 0;
      for (let i = 0; i < fr.px.length; i++) { const c = fr.px[i]; if (!c) continue;
        if (c[0] === want[0] && c[1] === want[1] && c[2] === want[2]) n++; }
      return n;
    };
    out.playerIrisPixels = irisPix(null);          /* the player's own eyes, drawn */
    out.otherIrisPixels  = irisPix(other);         /* somebody else's, drawn */
    out.otherIrisDiffers = other.eyes.iris.join(',') !== pface.eyes.iris.join(',');
    G.faceAs = keepFace; G.equipped = keepEq2; G.bodyVar = keepVar2; window.G_WORN = keepWorn2;
    try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {}

    /* 1e. A CHILD IS NOT A SMALL ADULT. */
    const kid = faceFor('gate:kid', { age: 'child' }), grown = faceFor('gate:kid', { age: 'adult' });
    out.childDiffersFromAdult = kid.face.craniumH > grown.face.craniumH && kid.face.len < grown.face.len;

    /* ---- 2. THE FACE IS THERE WHEN SOMEBODY TALKS, AND ONLY THEN ----------- */
    const cv = document.getElementById('openFace');
    out.canvasExists = !!cv;
    openCaption({ line: { speaker: 'mother', text: 'Ray. RAY. Somebody is at the door.' } });
    out.shownWhenTalking = cv && cv.style.visibility === 'visible';
    out.speakerResolved = (typeof OPEN_FACE !== 'undefined' && OPEN_FACE) ? OPEN_FACE._who() : null;
    /* 2b. A REPAINT IS NOT A NEW LINE. The cold open repaints several times per
       beat; a mouth restarted on each repaint is the stutter the voice engine
       already had to fix twice. say() must refuse the echo. */
    out.repaintRestarts = OPEN_FACE.say(OPEN_FACE._who(), 'Ray. RAY. Somebody is at the door.', null);
    /* 2c. a title card has no speaker, so it has no face */
    openCaption({ line: null, era: 'pre_collapse' });
    out.hiddenOnTitleCard = cv && cv.style.visibility === 'hidden';

    /* ---- 3. DRIVEN BY THE LETTERS, AND IT MOVES REAL PIXELS ---------------- */
    openCaption({ line: { speaker: 'mother', text: 'Ray. RAY. Somebody is at the door.' } });
    const shapes = {};
    for (let ms = 0; ms < 4000; ms += 40) { const s = OPEN_FACE._perf(ms).mouth; shapes[s] = (shapes[s] || 0) + 1; }
    out.mouthShapes = Object.keys(shapes).sort();
    /* the same line must always look the same -- no dice anywhere in the performance */
    const walk = () => { const a = []; for (let ms = 0; ms < 2000; ms += 50) a.push(OPEN_FACE._perf(ms).mouth); return a.join(''); };
    out.performanceRepeatable = walk() === walk();
    /* and a DIFFERENT line must look different, or the mouth is not reading letters */
    const sig1 = walk();
    OPEN_FACE.say(OPEN_FACE._who(), 'Ooooo. Wooo. Mmmm.', null);
    out.differentWordsDifferentMouth = walk() !== sig1;

    const sp = faceFor('MOTHER:DENISE', { age: 'adult' }), rp = faceRampFor(sp);
    const base = renderFace(sp, { ramp: rp });
    const moved = (o) => { const bb = renderFace(sp, Object.assign({ ramp: rp }, o)); let n = 0;
      for (let i = 0; i < bb.length; i += 4) if (bb[i] !== base[i] || bb[i+1] !== base[i+1] || bb[i+2] !== base[i+2]) n++;
      return n; };
    out.mouthPixels = { mid: moved({ mouth: 'mid' }), open: moved({ mouth: 'open' }), wide: moved({ mouth: 'wide' }) };
    out.blinkPixels = moved({ blink: 1 });
    out.browPixels  = moved({ brow: 1 });
    /* 3b. NOTHING ASKED == THE APPROVED FACE. The only way to add performance to
       art that is already signed off (8/26 clause). */
    const asked = renderFace(sp, { ramp: rp, mouth: 'closed', blink: 0, brow: 0 });
    out.nothingAskedIsApproved = base.every((v, i) => v === asked[i]);

    /* ---- 4. NO STRAIGHT LINE DOWN THE CROWN (HOW HAIR AND SHAPE WORK, 8/1) -- */
    let ruled = 0;
    faces.forEach(f => { const rt = f.sp.hair.roots, xs = new Set();
      for (let y = 0; y < 30; y++) for (let x = 0; x < 64; x++) { const o = (y * 64 + x) * 4;
        if (f.buf[o] === rt[0] && f.buf[o+1] === rt[1] && f.buf[o+2] === rt[2]) xs.add(x); }
      if (xs.size <= 1) ruled++; });
    out.ruledParts = ruled;
    return out;
  }, { N });
  await b.close();

  /* ---- 1 ----------------------------------------------------------------- */
  ok('*** EVERYBODY IN BOHEMIA HAS A FACE, AND NO TWO ARE THE SAME PERSON *** (closest of ' +
     N + ': ' + R.closest.toFixed(4) + ' >= ' + PINNED_CLOSEST + ', ' + R.closestPair + ')',
     R.closest >= PINNED_CLOSEST);
  ok('and the whole crowd is spread, not two faces with jitter (mean ' + R.mean.toFixed(4) +
     ' >= ' + PINNED_MEAN + ')', R.mean >= PINNED_MEAN);
  ok('THE SAME PERSON IS THE SAME PERSON, on any device, with nothing stored', R.deterministic);
  ok('*** EVERY DIAL MOVES THE PIXELS *** (a dial stuck on one value is a comment' +
     (R.deadDials.length ? ' -- DEAD: ' + R.deadDials.join(', ') : '') + ')', R.deadDials.length === 0);
  ok('the dye check is looking at colours that actually exist in the factory ' +
     '(a check that cannot find its target reports perfection)', R.dyeColoursExistInFactory);
  ok('dyed hair is rare enough to be a statement (' + R.dyedPct.toFixed(1) + '% of ' + R.dyedOf + ' <= ' + DYE_CAP + '%)',
     R.dyedPct <= DYE_CAP);
  ok('a child is not a small adult (bigger cranium, shorter face)', R.childDiffersFromAdult);
  ok('*** ONE ID, ONE WHOLE PERSON: the portrait\'s SKIN is the body\'s skin *** (' +
     R.skinAgreePct.toFixed(1) + '% of 200, was 8.0%)', R.skinAgreePct >= 99.5);
  ok('*** and the portrait\'s HAIR is the body\'s hair *** (' + R.hairAgreePct.toFixed(1) +
     '% of 200, was 0.0% -- not one person)', R.hairAgreePct >= 99.5);
  ok('*** AND THE BODY ACTUALLY DRAWS SOMEBODY ELSE\'S EYES *** (their iris on the ' +
     'rendered body: ' + R.otherIrisPixels + 'px; the player\'s own: ' + R.playerIrisPixels +
     'px) -- measured on pixels, because the first version of this check looked at ' +
     'the input and passed with the whole feature deleted',
     R.otherIrisDiffers && R.playerIrisPixels > 0 && R.otherIrisPixels > 0);

  /* ---- 2 ----------------------------------------------------------------- */
  ok('the cold open has a face canvas beside its words', R.canvasExists);
  ok('*** THE PORTRAIT POPS UP WHEN SOMEBODY TALKS *** (speaker resolved to ' + R.speakerResolved + ')',
     R.shownWhenTalking && !!R.speakerResolved);
  ok('and the speaker is the person the cast says it is, not a role string',
     /^(MOTHER|FATHER|BROTHER|SISTER):/.test(String(R.speakerResolved || '')));
  ok('A REPAINT IS NOT A NEW LINE (the caption repaints several times a beat; the ' +
     'mouth must not restart)', R.repaintRestarts === false);
  ok('a title card has no speaker, so it has no face', R.hiddenOnTitleCard);

  /* ---- 3 ----------------------------------------------------------------- */
  ok('*** THE MOUTH IS DRIVEN BY THE LETTERS THEY ARE SAYING *** (shapes used: ' +
     R.mouthShapes.join(' ') + ')', R.mouthShapes.length >= 3);
  ok('different words make a different mouth', R.differentWordsDifferentMouth);
  ok('the same line always looks the same -- no dice in the performance', R.performanceRepeatable);
  ok('and every knob moves REAL PIXELS (mouth mid/open/wide ' +
     R.mouthPixels.mid + '/' + R.mouthPixels.open + '/' + R.mouthPixels.wide +
     ', blink ' + R.blinkPixels + ', brow ' + R.browPixels + ')',
     R.mouthPixels.mid > 4 && R.mouthPixels.open > 4 && R.mouthPixels.wide > 4 &&
     R.blinkPixels > 8 && R.browPixels > 8);
  ok('A FACE WITH NOTHING ASKED OF IT IS EXACTLY THE APPROVED FACE', R.nothingAskedIsApproved);

  /* ---- 4 ----------------------------------------------------------------- */
  ok('HOW HAIR AND SHAPE WORK (8/1) clause 3: no ruled straight line down the crown (' +
     R.ruledParts + ' of ' + N + ' heads still ruled, cap 6)', R.ruledParts <= 6);

  /* ---- and the source keeps its promises --------------------------------- */
  const src = fs.readFileSync(ALPHA, 'utf8');
  /* SLICE FROM THE `/*`, NOT FROM THE HEADLINE INSIDE IT. The first cut of this
     started at the title text -- which sits AFTER the comment opener -- so the
     block began mid-comment, the stripper had no `/*` to match, and the gate read
     the block's own prose as code. It then failed on the sentence "No Math.random
     anywhere in this block", which is a sentence PROMISING the thing it was
     accusing me of breaking.
     THAT IS THE 8/26 CRAFT-LAW BUG EXACTLY, REPRODUCED BY ME ONE DAY LATER: a
     checker that cannot tell a MENTION from a USE is the broken one, and the fix
     is always the ruler. */
  const HEAD = '/* ===== A FACE FOR SOMEBODY WHO IS NOT THE PLAYER';
  const block = src.slice(src.indexOf(HEAD), src.indexOf('function paintPortrait'));
  const CODE = block.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1');
  ok('the ruler found the block at all (' + block.length + ' chars)', block.length > 2000);
  /* and the stripper really strips: the block SAYS "Math.random" in prose, so if
     comments survived, the test below would fire on the promise instead of a call */
  ok('the comment stripper actually strips (the block mentions the thing in prose)',
     /Math\.random/.test(block) && !/Math\.random/.test(CODE));
  ok('NO DICE ANYWHERE IN THE FACE OR THE PERFORMANCE (a person who shimmers is not a person)',
     !/Math\.random/.test(CODE));

  /* *** NO TWO FUNCTIONS IN THE ALPHA SHARE A NAME. ***
     This turn shipped a second `function faceHash` eighty lines below the existing
     one. That is not an error and not a warning -- the last declaration silently
     wins for the entire file -- so the 8/26 blink scheduler quietly started calling
     MY hash with its salt undefined. Deterministic, no crash, all twenty-two checks
     above still green, and every person in the game blinking to a clock nobody
     measured. It was found by grepping a name, which is not a thing that reliably
     happens. This is that miss, made mechanical.
     Scoped to top-level `function NAME(` so a method or a local helper inside a
     closure is not accused of colliding with anything. */
  const declared = {}, dupes = [];
  const re = /^function\s+([A-Za-z_$][\w$]*)\s*\(/gm;
  let m; while ((m = re.exec(src))) { if (declared[m[1]]) { if (dupes.indexOf(m[1]) < 0) dupes.push(m[1]); } declared[m[1]] = 1; }
  /* A RATCHET, NOT A ZERO, AND HERE IS THE HONEST REASON. On its first run this
     found my own faceHash (fixed) AND TWO THAT WERE ALREADY THERE: CombatBridge and
     clampPkg, each inlined TWICE, byte-identical, from the COMBAT lane. Identical
     copies make last-wins a no-op, so nothing is broken today -- but the day
     somebody fixes one copy and not the other, the fix silently loses, which is the
     ENGINE SYNC failure mode with no gate on it. That is a row for the lane that
     owns those bytes, not a thing this lane may quietly rewrite mid-turn.
     So it is pinned where it is and can only ever fall. A THIRD collision fires. */
  const PINNED_DUPES = 2;   /* CombatBridge, clampPkg -- both COMBAT's, both exact copies */
  ok('*** NO NEW TOP-LEVEL FUNCTION NAME COLLISIONS *** (the last one silently wins and ' +
     'takes over every call the first was answering; ' + dupes.length + ' known, pinned ' +
     PINNED_DUPES + (dupes.length ? ' -- ' + dupes.join(', ') : '') + ')', dupes.length <= PINNED_DUPES);
  if (dupes.length < PINNED_DUPES)
    console.log('  *** FEWER COLLISIONS THAN THE PIN. Lower PINNED_DUPES to ' + dupes.length + '. ***');
  ok('a ruling wins outright: a named character can be handed a face and it beats the roll',
     /if\s*\(over\)/.test(CODE));

  console.log('\n  faces      closest ' + R.closest.toFixed(4) + '   mean ' + R.mean.toFixed(4) +
              '   dyed ' + R.dyedPct.toFixed(1) + '%   ruled parts ' + R.ruledParts + '/' + N);
  console.log('  mouth      ' + R.mouthShapes.join(' ') + '   pixels ' +
              JSON.stringify(R.mouthPixels) + '  blink ' + R.blinkPixels + '  brow ' + R.browPixels);
  if (R.closest > PINNED_CLOSEST + 0.004)
    console.log('  *** FACES ARE FURTHER APART THAN THE PIN. Raise PINNED_CLOSEST toward ' +
                R.closest.toFixed(3) + ' so it cannot slide back. ***');
  done();
})();
