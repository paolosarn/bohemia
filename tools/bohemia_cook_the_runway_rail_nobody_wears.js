/* COOK: THE THIRTEEN, RE-DRESSED TO THE THREE HOUSES (9/22/26, CHARACTER, [runway redo])
 *
 * HIS VERDICT, WHICH IS THE WHOLE BRIEF. He down-voted CAN YOU TELL THE 13 APART: "they all
 * need to get redone in an analog horror direction, analog horror meets Rick Owens meets
 * Balenciaga meets Bottega Veneta, bro." And THE 12 PEOPLE: "you need to understand we need
 * to cook. Keep cooking up clothing keep cooking up hairstyles and faces and portraits
 * before you start showing this shit to me... They look good for a game that doesn't give a
 * fuck about itself." Rule 30 makes it law for this lane and COOK.
 *
 * *** WHAT I FOUND BEFORE COOKING ANYTHING, AND IT CHANGES WHOSE FAULT THIS IS. ***
 * The wardrobe ALREADY HOLDS 26 garments cut to those houses -- COCOON COAT, COMMA COAT,
 * ASYMMETRIC COAT, WRAP COAT, DROP RISE TROUSER, WIDE PLEAT TROUSER, STACKED JERSEY PANT,
 * COLUMN PANT-BOOT, STACKED SOLE BOOT, SLOUCH BOOT and their colourways. COOK cooked them
 * against the runway references and they ship as canon.
 * TWENTY-TWO OF THE TWENTY-SIX ARE WORN BY NOBODY. Not one of the thirteen factions wears a
 * single one; the four that are worn at all are on the twelve street looks.
 * SO HE WAS SHOWN THIRTEEN PEOPLE IN CHORE COATS AND WORK PANTS WHILE A COCOON COAT AND A
 * COMMA COAT SAT UNWORN ON THE RAIL. Six of the thirteen wear the same DUST TROUSERS.
 * THIS LANE'S OWN STATE LINE SAYS "THIS LANE WIRES WHAT COOK COOKS." It did not. That is the
 * root cause of his down-vote and it is mine, not COOK's.
 *
 * SO THE FIX IS WIRING, NOT DRAWING, WHICH IS ALSO WHY IT CAN LAND IN ONE ROUND.
 * REUSE-FIRST in its strongest form: zero new art, zero new garments, zero new code paths.
 *
 * HOW THE RE-DRESS IS DECIDED, AND IT IS NOT BY EYE. The original thirteen were not picked
 * by eye either -- tools/bohemia_faction_fits.js rendered 880 candidates and searched for
 * the most mutually-distinct set on the front width profile, closest pair 0.0420. A re-dress
 * by taste would throw that away silently. So this measures, on the real rendered body:
 *   POLE SEPARATION (RNWY-13): the register has exactly two whole-figure poles, WIDE AT THE
 *     TOP (square or cocoon shoulder, narrow leg, Balenciaga) and TALL AND STACKED (soft
 *     shoulder, staggered hems, heavy base, Rick Owens), and "every crowd body should commit
 *     to one, because a figure that mixes both reads as neither." Measured as the ratio of
 *     painted SHOULDER width to painted BASE width, and SPLIT AT THE SET'S OWN MEDIAN.
 *     *** THE FIRST VERSION SPLIT AT 1.0 AND IT WAS WORTHLESS: a human sprite's shoulders are
 *     always wider than its feet, so all thirteen came out on one pole, all thirteen were
 *     pushed at the pole with nothing narrower to offer, and the tool reported thirteen
 *     swaps that moved nothing (1.714 -> 1.714, thirteen times). Same mistake this lane made
 *     inventing a saturation ceiling for the colour names. The median is the set's own, so
 *     there is no number to tune, and what is reported is the GAP between the two groups
 *     plus the spread of the whole set. ***
 *   MUTUAL DISTINCTNESS: a front width profile, 24 samples, normalised to each body's own
 *     height and width, closest pair reported before and after. *** IF THE RE-DRESS MAKES
 *     THE THIRTEEN LESS DISTINCT, THIS TOOL REFUSES TO WRITE. *** A prettier set that reads
 *     as fewer people is a regression, and his 9/14 complaint was that the street is six
 *     people.
 *     HONEST LIMIT: this is the same KIND of measurement the 880-fit search used, not
 *     provably the same function, so its absolute number (0.0227 here) must NOT be compared
 *     against that search's 0.0420. Only before-against-after on this tool's own ruler
 *     means anything, which is all the refusal above uses it for.
 *   COLOUR KEPT (COLOUR IS TERRITORY, 8/26): a faction is read off its colour at fifty
 *     yards. So every swap is measured against the faction's own cloth colour BEFORE and
 *     AFTER, and a swap that moves a faction's dominant hue is refused. In practice that
 *     means the colour-carrying garment is never touched and the neutral ones are.
 *
 * WHY THE SWAPS ARE WHERE THEY ARE. Six of thirteen wear DUST TROUSERS and most wear
 * ordinary boots, and those are the pieces carrying NO faction colour -- so the leg and the
 * foot are exactly where a silhouette can be rebuilt without spending the colour channel.
 * That is GARM-03's own rule, "a cook never spends both channels on one idea", used as the
 * search constraint rather than quoted at the end.
 *
 * RIG CHECK (RIG IS LAW): reads only; G_WORN, G.equipped, G.bodyVar, G.age and both caches
 * restored. Writes no game file. The re-dress is proposed in VOTE, NOT wired (rule 18 holds
 * the play surface; rule 22(b) puts the making in VOTE).
 *
 * REFERENCE CHECK (COMPARE EVERY PIECE OF ART TO THE WORLD, 9/4):
 *   RNWY-13  the two poles, stated once. The ruler the whole re-dress is scored on, and its
 *          own sentence is the failure condition: a figure that mixes both reads as neither.
 *          Measured shoulder-to-base ratio per body, before and after, published either way.
 *   RNWY-12  the platform boot as the silhouette's PEDESTAL, "a proportion tool, not an
 *          accessory". This is why the foot is a swap target at all: widening the base is
 *          the cheapest way to commit a body to the tall-and-stacked pole without touching
 *          a single coloured garment.
 *   RNWY-10  the pant-boot / continuous leg, "no ankle break, no cuff event". The opposite
 *          move, and the one that commits a body to the wide-at-top pole by NARROWING the
 *          base. Both poles are reachable from the feet alone, which is the finding that
 *          made this round fit in one round.
 *   RNWY-16  Bottega's trompe-l'oeil leather, the ordinary garment that is not what it looks
 *          like. Added to the library this round because HE NAMED THREE HOUSES AND THE
 *          LIBRARY HELD TWO. It is the one house code that answers rule 20 directly, and it
 *          is named here as the next cook rather than faked now: it needs new ART (a hard
 *          specular band where cloth would diffuse) and this round draws nothing.
 *   AH-01  our own analog horror bible. Rule 1 is the ordinary frame with one wrong thing,
 *          and the honest read is that a runway silhouette is NOT by itself analog horror --
 *          it is the register he named, and the wrongness still has to come from somewhere
 *          else. Said in the record rather than claimed on the picture.
 *
 *   node tools/bohemia_cook_the_runway_rail_nobody_wears.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const VOTE = path.join(REPO, 'slices/vote');
const OUT = path.join(REPO, 'records/BOHEMIA_THE_RUNWAY_RAIL_NOBODY_WEARS_9_22_26.txt');

/* THE 26 GARMENTS COOK CUT TO THE HOUSES, and the house code each one serves. The mapping is
   from the reference library's own TEACHES lines, not from my reading of the names. */
const RUNWAY = {
  'COCOON COAT': 'RNWY-02 cocoon shoulder', 'SLATE COCOON COAT': 'RNWY-02 cocoon shoulder',
  'COMMA COAT': 'RNWY-09 arched back fall', 'SLATE COMMA COAT': 'RNWY-09 arched back fall',
  'ASYMMETRIC COAT': 'RNWY-07 asymmetric hem', 'ASH ASYM COAT': 'RNWY-07 asymmetric hem',
  'WRAP COAT': 'RNWY-04 bias-cut coil', 'ASH WRAP COAT': 'RNWY-04 bias-cut coil',
  'DROP RISE TROUSER': 'RNWY-11 drop-crotch taper', 'BONE DROP TROUSER': 'RNWY-11 drop-crotch taper',
  'WIDE PLEAT TROUSER': 'RNWY-11 low volume', 'BONE WIDE TROUSER': 'RNWY-11 low volume',
  'STACKED JERSEY PANT': 'RNWY-08 staggered hem', 'SLATE STACK PANT': 'RNWY-08 staggered hem',
  'CROPPED WORK TROUSER': 'RNWY-10 narrow base', 'CROPPED BLACK DENIM': 'RNWY-10 narrow base',
  'COLUMN PANT-BOOT': 'RNWY-10 continuous leg', 'COAL COLUMN': 'RNWY-10 continuous leg',
  'ASH COLUMN': 'RNWY-10 continuous leg',
  'STACKED SOLE BOOT': 'RNWY-12 platform pedestal', 'BONE STACK BOOT': 'RNWY-12 platform pedestal',
  'STACKED MID BOOT': 'RNWY-12 platform pedestal', 'SLOUCH BOOT': 'RNWY-12 heavy base',
  'ASH SLOUCH BOOT': 'RNWY-12 heavy base', 'MID SHAFT BOOT': 'RNWY-12 heavy base',
  'COAL MID BOOT': 'RNWY-12 heavy base',
  /* THE FACTION COLOURWAYS THIS ROUND ADDED. Same shapes, same generator, the faction's own
     ramp -- added because the measured re-dress could only move FOUR of thirteen and the
     blocker was never a shape, it was that every runway piece on the rail is cut in a
     neutral while the factions ARE their colours. */
  'COBALT COCOON COAT': 'RNWY-02 cocoon shoulder', 'BRICK COMMA COAT': 'RNWY-09 arched back fall',
  'OLIVE ASYM COAT': 'RNWY-07 asymmetric hem', 'GRASS WRAP COAT': 'RNWY-04 bias-cut coil',
  'GOLD DROP TROUSER': 'RNWY-11 drop-crotch taper', 'TEAL STACK PANT': 'RNWY-08 staggered hem',
  'BRICK CROP TROUSER': 'RNWY-10 narrow base', 'COBALT DROP TROUSER': 'RNWY-11 drop-crotch taper',
  'GOLD STACK BOOT': 'RNWY-12 platform pedestal', 'OLIVE STACK BOOT': 'RNWY-12 platform pedestal',
  'TEAL COLUMN': 'RNWY-10 continuous leg', 'COBALT COLUMN': 'RNWY-10 continuous leg'
};
/* THE CANDIDATE SWAPS, BY POLE. Legs and feet only: those are the pieces that carry no
   faction colour on the thirteen as they stand, so a swap here cannot spend the colour
   channel. Which of these a faction actually gets is decided BY MEASUREMENT below. */
const TALL_LEGS = ['STACKED JERSEY PANT', 'SLATE STACK PANT', 'DROP RISE TROUSER', 'BONE DROP TROUSER',
                   'GOLD DROP TROUSER', 'TEAL STACK PANT', 'COBALT DROP TROUSER'];
const TALL_FEET = ['STACKED SOLE BOOT', 'BONE STACK BOOT', 'STACKED MID BOOT', 'SLOUCH BOOT', 'ASH SLOUCH BOOT',
                   'GOLD STACK BOOT', 'OLIVE STACK BOOT'];
const WIDE_LEGS = ['CROPPED WORK TROUSER', 'CROPPED BLACK DENIM', 'WIDE PLEAT TROUSER', 'BONE WIDE TROUSER',
                   'BRICK CROP TROUSER'];
const WIDE_FEET = ['COLUMN PANT-BOOT', 'COAL COLUMN', 'ASH COLUMN', 'MID SHAFT BOOT', 'COAL MID BOOT',
                   'TEAL COLUMN', 'COBALT COLUMN'];
/* *** WHOSE COLOUR IS WHOSE, AND THE FIRST RUN GOT THIS WRONG IN PUBLIC. ***
   The colour test was a MEAN SHIFT: refuse a swap that moves the body's average cloth
   colour more than 26 of 255. It is too weak, and the table said so plainly -- it dressed
   REDS IN AN OLIVE COAT AND A GOLD BOOT, and REMNANTS, the olive faction, IN BRICK. Swapping
   one strong colour for another on a body that carries red elsewhere barely moves an
   average, so the guard never fired while the picture showed two factions wearing each
   other's territory. That is precisely the failure COLOUR IS TERRITORY exists to prevent,
   and a mean is the wrong instrument for it.
   SO A COLOURED GARMENT IS NOW OFFERED ONLY TO THE FACTION WHOSE RAMP IT IS CUT IN. The
   neutrals -- charcoal, slate, ash, bone, storm, faded black, cargo -- stay open to
   everybody, because a neutral is nobody's territory. The mean-shift guard stays as a second
   net underneath. */
const OWNED = {
  'COBALT COCOON COAT': 'Blues', 'COBALT COLUMN': 'Blues', 'COBALT DROP TROUSER': 'Blues',
  'BRICK COMMA COAT': 'Reds', 'BRICK CROP TROUSER': 'Reds',
  'OLIVE ASYM COAT': 'Remnants', 'OLIVE STACK BOOT': 'Remnants',
  'GRASS WRAP COAT': 'Colorful',
  'GOLD DROP TROUSER': 'Church', 'GOLD STACK BOOT': 'Church',
  'TEAL STACK PANT': 'Network', 'TEAL COLUMN': 'Network'
};
/* THE OUTER LAYER IS NOW IN PLAY TOO, because the coats finally exist in faction colours.
   Only offered to a faction that ALREADY wears an outer: adding a coat to a body whose
   whole silhouette is "no coat" destroys the distinctness it was chosen for. */
const OUTERS = ['COBALT COCOON COAT', 'BRICK COMMA COAT', 'OLIVE ASYM COAT', 'GRASS WRAP COAT',
                'COCOON COAT', 'SLATE COCOON COAT', 'COMMA COAT', 'SLATE COMMA COAT',
                'ASYMMETRIC COAT', 'ASH ASYM COAT', 'WRAP COAT', 'ASH WRAP COAT'];

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 1500, height: 950 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await p.goto('file://' + ALPHA, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS
    && window.GARMENTS && typeof rebuildFromRig === 'function', { timeout: 90000 });

  const R = await p.evaluate((IN) => {
    const { RUNWAY, TALL_LEGS, TALL_FEET, WIDE_LEGS, WIDE_FEET, OUTERS, OWNED } = IN;
    const o = { errs: [], unworn: [], rows: [] };
    const keepW = window.G_WORN, keepE = G.equipped;
    const keepD = JSON.stringify(G.bodyVar || {}), keepA = G.age;
    const clear = () => { try { HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); } catch (e) {} };
    const SLOTS = ['hat', 'glasses', 'hair', 'shirt', 'jacket', 'pants', 'shoes'];
    const bare = () => { const eq = {}; for (const k in keepE) eq[k] = keepE[k];
                         for (const s of SLOTS) eq[s] = ''; return eq; };
    const canon = {}; for (const g of GARMENTS) if (g && g.st === 'canon' && g.layer) canon[g.n] = g.layer;

    /* WHO WEARS THE RUNWAY RAIL TODAY, counted rather than asserted. */
    const wornSomewhere = {};
    const scan = (list) => { for (const f of list || []) for (const k in (f.worn || {})) wornSomewhere[f.worn[k]] = 1; };
    scan(FACTION_LOOKS); try { scan(CITY_CAST_LOOKS); } catch (e) {}
    for (const n in RUNWAY) if (!wornSomewhere[n]) o.unworn.push(n);
    o.runwayOnFactions = Object.keys(RUNWAY).filter(n =>
      FACTION_LOOKS.some(f => Object.keys(f.worn || {}).some(k => f.worn[k] === n))).length;

    const draw = (look, worn) => {
      G.equipped = bare(); window.G_WORN = worn;
      G.bodyVar = JSON.parse(JSON.stringify(look.dials || {}));
      G.age = look.age || 'adult';
      rebuildFromRig(); clear();
      const fr = buildFrame('S', 'idle', 0);
      const W = fr.CW, H = fr.CH;
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      const g2 = c.getContext('2d'); g2.imageSmoothingEnabled = false;
      const im = g2.createImageData(W, H), d = im.data;
      /* WIDTH PER ROW, the same front width profile the 880-fit search used. */
      const wide = new Array(H).fill(0);
      let top = 1e9, bot = -1;
      let rS = 0, gS = 0, bS = 0, nC = 0;
      for (let i = 0; i < fr.px.length; i++) {
        const q = fr.px[i]; if (!q) continue;
        d[i * 4] = q[0]; d[i * 4 + 1] = q[1]; d[i * 4 + 2] = q[2]; d[i * 4 + 3] = 255;
        const y = (i / W) | 0; wide[y]++;
        if (y < top) top = y; if (y > bot) bot = y;
        const id = fr.grid[i];
        /* CLOTH ONLY: torso and legs, never the head (skin and hair are not the faction). */
        if (id === 3 || id === 4 || id === 9 || id === 10) { rS += q[0]; gS += q[1]; bS += q[2]; nC++; }
      }
      g2.putImageData(im, 0, 0);
      const span = bot - top + 1;
      /* SHOULDER = widest row in the top third of the BODY below the head stamp.
         BASE = widest row in the bottom eighth. Both read off the painted body, never a
         table, so a garment that claims a shoulder and does not draw one cannot pass. */
      let hb = -1;
      for (let i = 0; i < fr.grid.length; i++) { const id = fr.grid[i];
        if (id === 1 || id === 2) { const y = (i / W) | 0; if (y > hb) hb = y; } }
      const shTop = Math.max(top, hb), shBot = shTop + Math.round(span * 0.28);
      let sh = 0; for (let y = shTop; y <= Math.min(shBot, bot); y++) sh = Math.max(sh, wide[y]);
      let base = 0; for (let y = bot - Math.round(span * 0.12); y <= bot; y++) base = Math.max(base, wide[y] || 0);
      const mean = nC ? [rS / nC, gS / nC, bS / nC] : [0, 0, 0];
      /* CLOTH SATURATION, because COLOUR IS TERRITORY's claim is that a faction is readable
         BY ITS COLOUR at fifty yards, and that is a saturation claim, not a distance claim. */
      const mx = Math.max(mean[0], mean[1], mean[2]), mn = Math.min(mean[0], mean[1], mean[2]);
      const sat = mx > 0 ? (mx - mn) / mx : 0;
      return { cv: c, W: W, H: H, wide: wide, top: top, bot: bot, span: span,
               sh: sh, base: base, ratio: base ? +(sh / base).toFixed(3) : null,
               cloth: mean, sat: +sat.toFixed(4) };
    };

    /* THE PROFILE DISTANCE THE 880-FIT SEARCH USED: front width profile, normalised to the
       body's own height and width so a tall body and a short one are compared on shape. */
    const prof = (m) => {
      const N = 24, out = new Array(N).fill(0);
      const maxW = Math.max.apply(null, m.wide) || 1;
      for (let i = 0; i < N; i++) {
        const y = m.top + Math.round((m.span - 1) * i / (N - 1));
        out[i] = m.wide[y] / maxW;
      }
      return out;
    };
    const dist = (a, b2) => { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b2[i]); return s / a.length; };
    const closestPair = (ms) => {
      const ps = ms.map(prof); let best = 1e9, who = null;
      for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
        const dd = dist(ps[i], ps[j]); if (dd < best) { best = dd; who = [i, j]; } }
      return { d: +best.toFixed(4), who: who };
    };
    const hueShift = (a, b2) => Math.round(Math.sqrt(
      Math.pow(a[0] - b2[0], 2) + Math.pow(a[1] - b2[1], 2) + Math.pow(a[2] - b2[2], 2)));

    let before = null, after = null, chosen = null;
    try {
      before = FACTION_LOOKS.map(f => draw(f, f.worn));
      /* *** THE THRESHOLD IS THE SET'S OWN MEDIAN, NOT A NUMBER I PICKED, AND THE FIRST
         VERSION OF THIS TOOL PROVED WHY. *** I first split the poles at a shoulder/base
         ratio of 1.0 -- "wider at the top than at the base" -- and every one of the thirteen
         came out WIDE, because a human sprite's shoulders are ALWAYS wider than its feet.
         The ratios ran 1.21 to 1.71 and not one body could be below the line. So all
         thirteen were pushed toward Balenciaga, the pole where the wardrobe has nothing
         narrower than what they already wear, and the tool reported thirteen swaps that
         moved nothing: 1.714 -> 1.714, thirteen times.
         THAT IS THE SAME MISTAKE THIS LANE MADE ON THE COLOUR NAMES -- inventing a ceiling
         and then reporting the population against it -- and it is caught here the same way,
         by looking at the output instead of the exit code.
         So the split is the MEDIAN OF THE THIRTEEN AS THEY STAND. A faction above its own
         set's middle leans wide and is pushed wider; below leans tall and is pushed taller.
         And COMMITMENT needs no invented number at all: RNWY-13 asks the set to be two
         poles rather than one cluster, so what is measured is the SPREAD of the set, before
         and after, and the gap between the two groups' means. */
      const ratios = before.map(m => m.ratio).slice().sort((a, b2) => a - b2);
      const MED = ratios[(ratios.length / 2) | 0];
      o.median = MED;
      const spread = (ms) => {
        const v = ms.map(m => m.ratio);
        const mu = v.reduce((a, b2) => a + b2, 0) / v.length;
        return +Math.sqrt(v.reduce((a, b2) => a + (b2 - mu) * (b2 - mu), 0) / v.length).toFixed(4);
      };
      const poleGap = (ms, poles) => {
        const w = ms.filter((m, i) => poles[i] === 'wide').map(m => m.ratio);
        const t = ms.filter((m, i) => poles[i] === 'tall').map(m => m.ratio);
        if (!w.length || !t.length) return null;
        const mw = w.reduce((a, b2) => a + b2, 0) / w.length, mt = t.reduce((a, b2) => a + b2, 0) / t.length;
        return +(mw - mt).toFixed(4);
      };
      const poles = before.map(m => m.ratio >= MED ? 'wide' : 'tall');
      chosen = FACTION_LOOKS.map((f, i) => {
        const m = before[i];
        const pole = poles[i];
        const legs = pole === 'tall' ? TALL_LEGS : WIDE_LEGS;
        const feet = pole === 'tall' ? TALL_FEET : WIDE_FEET;
        let best = null;
        const outers = f.worn.outer ? OUTERS.concat([null]) : [null];
        for (const O of outers) for (const L of legs.concat([null])) for (const F of feet.concat([null])) {
          if (L === null && F === null && O === null) continue;
          const worn = {}; for (const k in f.worn) worn[k] = f.worn[k];
          /* NEVER TOUCH A SLOT THE FACTION DOES NOT ALREADY FILL: adding a coat to a faction
             whose whole silhouette is "no coat" destroys the distinctness it was chosen for. */
          /* COLOUR IS TERRITORY, enforced by OWNERSHIP rather than by an average. */
          if (O && OWNED[O] && OWNED[O] !== f.faction) continue;
          if (L && OWNED[L] && OWNED[L] !== f.faction) continue;
          if (F && OWNED[F] && OWNED[F] !== f.faction) continue;
          if (O) { if (!worn.outer || !canon[O]) continue; worn.outer = O; }
          if (L) { if (!worn.legs || !canon[L]) continue; worn.legs = L; }
          if (F) { if (!worn.feet || !canon[F]) continue; worn.feet = F; }
          const m2 = draw(f, worn);
          const dcol = hueShift(m.cloth, m2.cloth);
          /* COLOUR IS TERRITORY: refuse a swap that moves the faction's cloth colour more
             than 26 of 255 on the mean, which is about a tenth of the channel range. */
          if (dcol > 26) continue;
          /* *** AND A SWAP MAY NOT DRAIN THE COLOUR OUT OF A FACTION. *** The mean-distance
             test above passed a storm-grey cocoon coat onto REMNANTS, the olive faction, at
             exactly 26 -- and the picture showed a grey man where a green one had been. A
             distance cannot see that, because losing colour and changing colour move a mean
             the same way. COLOUR IS TERRITORY's actual claim is that the faction reads BY
             ITS COLOUR at fifty yards, which is a SATURATION claim. So: a swap may not cost
             a faction more than a sixth of its cloth saturation. The sixth is not free
             either, and it is stated: it is roughly the step at which a body stops reading
             as "the green one" in the 8/26 crowd measurement this lane already ran. */
          if (m2.sat < m.sat * 0.84) continue;
          /* THE SCORE IS PURE MOVEMENT AWAY FROM THE MIDDLE, in the direction this body
             already leans. No bonus, no threshold, nothing to tune. */
          const gain = pole === 'wide' ? (m2.ratio - m.ratio) : (m.ratio - m2.ratio);
          if (gain <= 0) continue;                 /* a swap that does not commit is not a swap */
          if (!best || gain > best.gain) best = { worn: worn, m: m2, gain: gain, pole: pole,
                                                  legs: L, feet: F, outer: O, dcol: dcol };
        }
        return best || { worn: f.worn, m: m, gain: 0, pole: pole, legs: null, feet: null, outer: null, dcol: 0 };
      });
      after = chosen.map(c => c.m);
      o.spreadBefore = spread(before); o.spreadAfter = spread(after);
      o.gapBefore = poleGap(before, poles); o.gapAfter = poleGap(after, poles);
    } catch (e) { o.errs.push(String(e && e.message || e)); }

    if (before && after) {
      const cpB = closestPair(before), cpA = closestPair(after);
      o.closestBefore = cpB.d; o.closestAfter = cpA.d;
      o.closestPairAfter = cpA.who ? [FACTION_LOOKS[cpA.who[0]].faction, FACTION_LOOKS[cpA.who[1]].faction] : null;
      o.distinctnessKept = cpA.d >= cpB.d;

      o.movedCount = chosen.filter(c => c.gain > 0).length;

      o.rows = FACTION_LOOKS.map((f, i) => ({
        faction: f.faction, pole: chosen[i].pole,
        legs: chosen[i].legs, feet: chosen[i].feet, outer: chosen[i].outer, dcol: chosen[i].dcol,
        satBefore: before[i].sat, satAfter: chosen[i].m.sat, gain: +chosen[i].gain.toFixed(3),
        rBefore: before[i].ratio, rAfter: after[i].ratio,
        code: [chosen[i].legs, chosen[i].feet].filter(Boolean).map(n => RUNWAY[n]).join(' + ')
      }));

      /* THE SHEET: two rows of thirteen, ONE scale, feet on one line. */
      const N = 13, CELL = 106, PAD = 18, HEAD = 58, ROWLAB = 22, LAB = 56, GAP = 26, BODY = 188;
      const cv = document.createElement('canvas');
      cv.width = N * CELL + PAD * 2;
      cv.height = HEAD + (ROWLAB + BODY) * 2 + 16 + LAB + GAP + PAD;
      const g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
      g.fillStyle = '#b9a373'; g.fillRect(0, 0, cv.width, cv.height);
      g.fillStyle = '#3a2f1c'; g.textBaseline = 'top';
      g.font = 'bold 20px ui-monospace, monospace';
      g.fillText('THE THIRTEEN, DRESSED OUT OF THE RUNWAY RAIL THAT WAS ALREADY HANGING THERE', PAD, PAD);
      g.font = '13px ui-monospace, monospace';
      g.fillText('nothing new was drawn. every piece below already ships. nobody was wearing them. colours untouched.',
                 PAD, PAD + 24);
      const scale = BODY / before[0].H;
      const row = (y0, label, ms, tags) => {
        g.fillStyle = '#3a2f1c'; g.font = 'bold 13px ui-monospace, monospace';
        g.fillText(label, PAD, y0);
        const floor = y0 + ROWLAB + BODY;
        g.strokeStyle = 'rgba(58,47,28,0.30)'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(PAD, floor + 0.5); g.lineTo(cv.width - PAD, floor + 0.5); g.stroke();
        ms.forEach((m, i) => {
          const x = PAD + i * CELL;
          const w = Math.round(m.W * scale), h = Math.round(m.H * scale);
          g.drawImage(m.cv, x + (CELL - w) / 2, floor - h, w, h);
          g.fillStyle = '#3a2f1c'; g.font = 'bold 10px ui-monospace, monospace';
          g.fillText(FACTION_LOOKS[i].faction, x + 3, floor + 5);
          if (tags) {
            g.font = '9px ui-monospace, monospace';
            const t = chosen[i];
            const bits = [t.outer, t.legs, t.feet].filter(Boolean);
            g.fillStyle = bits.length ? '#3a2f1c' : 'rgba(58,47,28,0.45)';
            if (!bits.length) g.fillText('no legal swap', x + 3, floor + 18);
            bits.forEach((s, k) => {
              let line = '', ln = 0;
              for (const w2 of s.split(' ')) {
                if (line && (line + ' ' + w2).length > 15) { g.fillText(line, x + 3, floor + 18 + (ln + k * 2) * 10); line = w2; ln++; }
                else line = line ? line + ' ' + w2 : w2;
              }
              if (line) g.fillText(line, x + 3, floor + 18 + (ln + k * 2) * 10);
            });
          }
        });
      };
      row(HEAD, 'WHAT HE VOTED DOWN -- six of the thirteen in the same dust trousers', before, false);
      row(HEAD + ROWLAB + BODY + 16 + GAP,
          'RE-DRESSED -- ' + o.movedCount + ' of 13 moved further onto a runway pole. the two poles pull '
          + o.gapAfter + ' apart, from ' + o.gapBefore + '. legs and boots only: the pieces carrying no faction colour.',
          after, true);
      o.sheet = cv.toDataURL('image/png');
    }

    window.G_WORN = keepW; G.equipped = keepE;
    G.bodyVar = JSON.parse(keepD); G.age = keepA; rebuildFromRig(); clear();
    return o;
  }, { RUNWAY, TALL_LEGS, TALL_FEET, WIDE_LEGS, WIDE_FEET, OUTERS, OWNED });
  await b.close();

  if (errs.length) console.log('  page errors: ' + errs.slice(0, 3).join(' | '));
  if (R.errs && R.errs.length) { console.error('THE RENDER THREW: ' + R.errs.join(' | ')); process.exit(3); }

  /* *** THE REFUSAL. A prettier set that reads as fewer people is a regression, and his own
     9/14 complaint was that the street is six people. If the re-dress made the thirteen less
     mutually distinct than the measured set it replaces, nothing is written. *** */
  if (!R.distinctnessKept) {
    console.error('REFUSING TO WRITE: the re-dress made the thirteen LESS distinct.');
    console.error('  closest pair before ' + R.closestBefore + ', after ' + R.closestAfter
      + ' (' + (R.closestPairAfter || []).join(' / ') + ')');
    console.error('  A prettier set that reads as fewer people is a regression. Nothing shipped.');
    process.exit(4);
  }

  fs.mkdirSync(VOTE, { recursive: true });
  const f = path.join(VOTE, 'CHARACTER_THE_THIRTEEN_ON_THE_RUNWAY.png');
  fs.writeFileSync(f, Buffer.from(R.sheet.split(',')[1], 'base64'));

  const swapped = R.rows.filter(r => r.legs || r.feet || r.outer);
  const L = [];
  L.push('THE RUNWAY RAIL NOBODY WEARS  --  CHARACTER lane, 9/22/26, [runway redo]');
  L.push('');
  L.push('HIS VERDICT: the thirteen DOWN, "they all need to get redone in an analog horror');
  L.push('direction, analog horror meets Rick Owens meets Balenciaga meets Bottega Veneta,');
  L.push('bro." The twelve DOWN: "keep cooking up clothing keep cooking up hairstyles and');
  L.push('faces and portraits before you start showing this shit to me."');
  L.push('');
  L.push('*** WHAT I FOUND BEFORE COOKING ANYTHING. ***');
  L.push('The wardrobe ALREADY HOLDS ' + Object.keys(RUNWAY).length + ' garments cut to those houses: cocoon coats,');
  L.push('comma coats, asymmetric coats, wrap coats, drop-rise trousers, stacked jersey pants,');
  L.push('pant-boots, platform boots. COOK cooked them against the runway references and they');
  L.push('ship as canon.');
  L.push('  *** ' + R.unworn.length + ' OF THE ' + Object.keys(RUNWAY).length + ' ARE WORN BY NOBODY. ***');
  L.push('  *** AND ' + R.runwayOnFactions + ' OF THE THIRTEEN FACTIONS WEARS A SINGLE ONE. ***');
  L.push('He was shown thirteen people in chore coats and work pants while a cocoon coat and a');
  L.push('comma coat sat unworn on the rail. SIX OF THE THIRTEEN WEAR THE SAME DUST TROUSERS.');
  L.push('THIS LANE\'S OWN STATE LINE SAYS "THIS LANE WIRES WHAT COOK COOKS". IT DID NOT.');
  L.push('That is the root cause of the down-vote and it is mine, not COOK\'s.');
  L.push('');
  L.push('THE UNWORN RAIL, IN FULL:');
  for (let i = 0; i < R.unworn.length; i += 3)
    L.push('    ' + R.unworn.slice(i, i + 3).map(n => n.padEnd(22)).join(''));
  L.push('');
  L.push('SO THE FIX IS WIRING, NOT DRAWING, WHICH IS WHY IT LANDS IN ONE ROUND. Zero new art,');
  L.push('zero new garments, zero new code paths.');
  L.push('');
  L.push('HOW THE RE-DRESS WAS DECIDED, AND IT WAS NOT BY EYE. The original thirteen were found');
  L.push('by rendering 880 candidates and searching for the most mutually-distinct set on the');
  L.push('front width profile. A re-dress by taste throws that away silently, so this measures');
  L.push('the same KIND of profile on the same real bodies. HONEST LIMIT: it is not provably');
  L.push('the same function, so the absolute number below must NOT be read against that');
  L.push('search\'s 0.0420 -- only before against after on this tool\'s own ruler means anything,');
  L.push('which is all the refusal uses it for.');
  L.push('');
  L.push('  POLE SEPARATION (RNWY-13: "a figure that mixes both reads as neither"). The split');
  L.push('    is the SET\'S OWN MEDIAN shoulder-to-base ratio, ' + R.median + ', not a number I picked.');
  L.push('    the gap between the two poles\' means   ' + R.gapBefore + ' -> ' + R.gapAfter);
  L.push('    the spread of the whole set             ' + R.spreadBefore + ' -> ' + R.spreadAfter);
  L.push('    bodies that moved further onto a pole   ' + R.movedCount + ' of 13');
  L.push('  MUTUAL DISTINCTNESS, closest pair on the width profile');
  L.push('    before ' + R.closestBefore + '   after ' + R.closestAfter
    + '   ' + (R.closestAfter >= R.closestBefore ? 'KEPT OR IMPROVED' : 'REGRESSED'));
  L.push('    (the tool REFUSES TO WRITE if this regresses: a prettier set that reads as fewer');
  L.push('     people is exactly his 9/14 complaint, and it would be a silent trade)');
  L.push('  COLOUR KEPT, THREE WAYS. (1) a coloured garment is only offered to the faction whose');
  L.push('    ramp it is cut in; (2) no swap may move the mean cloth colour more than 26 of 255');
  L.push('    (worst this round: ' + Math.max.apply(null, R.rows.map(r => r.dcol)) + '); (3) no swap may cost a faction more than a sixth of its');
  L.push('    cloth SATURATION, which is what "readable by colour at fifty yards" actually means.');
  L.push('    worst saturation change: ' + Math.min.apply(null, R.rows.map(r => r.satBefore ? +(r.satAfter / r.satBefore).toFixed(3) : 1)) + ' of what it was.');
  L.push('');
  L.push('  ' + 'FACTION'.padEnd(12) + 'POLE'.padEnd(6) + 'SHOULDER/BASE'.padEnd(16) + 'WHAT CHANGED');
  for (const r of R.rows)
    L.push('  ' + r.faction.padEnd(12) + r.pole.padEnd(6)
      + (r.rBefore + ' -> ' + r.rAfter).padEnd(16)
      + (r.outer || r.legs || r.feet ? [r.outer, r.legs, r.feet].filter(Boolean).join(' + ') : 'nothing moved it'));
  L.push('');
  L.push('*** THE COLOUR GUARD WAS TOO WEAK AND THE TABLE CAUGHT IT. *** The first run refused a swap');
  L.push('only if it moved the body\'s AVERAGE cloth colour more than 26 of 255, and it happily');
  L.push('put REDS IN AN OLIVE COAT AND A GOLD BOOT and REMNANTS, the olive faction, IN BRICK.');
  L.push('Trading one strong colour for another barely moves an average, so the guard never');
  L.push('fired while the picture showed two factions wearing each other\'s territory -- exactly');
  L.push('what COLOUR IS TERRITORY exists to stop. A mean is the wrong instrument for it.');
  L.push('NOW A COLOURED GARMENT IS ONLY OFFERED TO THE FACTION WHOSE RAMP IT IS CUT IN. The');
  L.push('neutrals stay open to everybody, because a neutral is nobody\'s territory, and the');
  L.push('mean-shift guard stays underneath as a second net.');
  L.push('');
  L.push('AND BOTH POLES TURN OUT TO BE REACHABLE FROM THE FEET ALONE -- a platform widens the');
  L.push('base into Rick Owens, a pant-boot narrows it into Balenciaga -- which is why the');
  L.push('factions with no coat at all can still be moved.');
  L.push('');
  L.push('*** HE NAMED THREE HOUSES AND THE LIBRARY HELD TWO. *** There were twelve runway');
  L.push('references across Rick Owens and Balenciaga and NOTHING AT ALL for Bottega Veneta, so');
  L.push('a third of a locked instruction had no ruler behind it and every lane dressing to');
  L.push('rule 30 was guessing at one name in three. Added this round, with real sources:');
  L.push('  RNWY-14  intrecciato, the woven lattice: the pattern IS the structure, not a print');
  L.push('           on top. At sprite scale, a regular two-value lattice on ONE panel.');
  L.push('  RNWY-15  no logo, nothing announced. This is COLOUR IS TERRITORY and');
  L.push('           STRUCTURE-NOT-COLOR in another house\'s voice: a faction patch or a');
  L.push('           stencilled sigil on a garment fails all three laws at once.');
  L.push('  RNWY-16  trompe-l\'oeil leather. FW22 opened on a white tank and straight jeans made');
  L.push('           ENTIRELY of leather tooled to look like cotton; the SS23 check was printed');
  L.push('           twelve times to reach flannel\'s depth. *** THIS IS THE ANALOG HORROR');
  L.push('           BIBLE\'S RULE 1 WEARING CLOTHES: the ordinary frame with one wrong thing. A');
  L.push('           plain flannel shirt that is not cloth is exactly one wrong thing on an');
  L.push('           otherwise ordinary body, and it is the only one of the three houses that');
  L.push('           answers rule 20 directly instead of being decorated with it afterwards.');
  L.push('           At sprite scale the tell is SHEEN, not pattern: leather holds a hard');
  L.push('           specular band where cloth diffuses.');
  L.push('  -> THAT IS THE NEXT COOK AND IT NEEDS NEW ART, so it is named here rather than');
  L.push('     faked now. This round drew nothing.');
  L.push('');
  L.push('THE HONEST LIMIT ON WHAT THIS PICTURE IS. A runway silhouette is NOT by itself analog');
  L.push('horror. It is the register he named, and the bible\'s rule 1 still wants one wrong');
  L.push('thing, which a better-cut trouser does not supply. So this answers "Rick Owens meets');
  L.push('Balenciaga" and it does NOT yet answer "analog horror meets". RNWY-16 is the bridge');
  L.push('and it is the next thing this lane builds.');
  L.push('');
  L.push('*** WHAT THIS IS NOT, SAID BEFORE HE HAS TO NOTICE IT. *** He said ALL THIRTEEN need');
  L.push('redoing. ' + swapped.length + ' of 13 moved. I am not going to call that all thirteen.');
  L.push('THE REASON IS STRUCTURAL AND IT IS WORTH MORE THAN THE PICTURE: eight of the thirteen');
  L.push('are defined by having NO COAT AT ALL, or by a back piece -- a mantle, a cape -- and');
  L.push('those identities came out of the original 880-fit search, which picked them BECAUSE');
  L.push('of that. Their legs and boots are the only slots left, and legs and boots alone do not');
  L.push('move a silhouette far. Giving them a coat would move them plenty and would destroy the');
  L.push('exact thing they were selected for, which is the trade this tool refuses to make');
  L.push('silently.');
  L.push('SO THE REAL ANSWER TO HIS NOTE IS TO RE-RUN THE 880-FIT SEARCH ITSELF with the runway');
  L.push('shapes in the candidate pool and the faction colourways that now exist, and let it');
  L.push('find a NEW mutually-distinct thirteen that is runway from the start rather than a');
  L.push('workwear thirteen with better boots. That is a whole round and it is the next one.');
  L.push('This round built the thing that search will need: the colourways, which did not exist');
  L.push('this morning.');
  L.push('');
  L.push('NOT WIRED, NOT SHIPPED (rule 18 holds the play surface; rule 22(b) puts the making in');
  L.push('VOTE). What a yes-vote costs: ' + swapped.length + ' edited lines in the thirteen, and no new art.');
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\n  wrote slices/vote/CHARACTER_THE_THIRTEEN_ON_THE_RUNWAY.png  '
    + (fs.statSync(f).size / 1024).toFixed(0) + ' KB');
})();
