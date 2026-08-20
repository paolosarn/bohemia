#!/usr/bin/env node
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
/* OCCUPANCY GATE (8/18/26, WORLD lane) — THE GAME AND THE MODEL MUST AGREE ABOUT EVERY
 * TILE, AND UNTIL TODAY NOTHING HAD EVER ASKED.
 *
 * WHAT IT FOUND ON ITS FIRST RUN, measured on the real page across 40 real district cells:
 *
 *     before   4,327 of 4,327 cells disagreed with the occupancy model
 *     after    0 of 4,327
 *
 * engine/bohemia_district_kit.js models tile occupancy PER TILE and documents it:
 *   "prop  - an object sitting on the ground (cart, pump, tree, furniture); SOLID PER ITS SIZE"
 *   "solid = does the tile block a body's cell (occupancy) at grade"
 * Its default for `prop` and `tree-dead` is solid:TRUE, so every `solid:false` in a legend
 * is a district author DELIBERATELY declaring that a body may stand there — you push
 * through creosote, you walk over rubble drift, you step past a survey stake. There were 48
 * such declarations across 41 districts, written into dossiers and held by tilespec_gate
 * and district_kit_gate.
 *
 * The walked surface threw away all 48 in one line — `if(tl.layer==='prop'){ c.walk=false; }`
 * — which never mentioned tl.solid at all.
 *
 * WHY NO EXISTING GATE COULD SEE IT, and this is the whole reason this file exists.
 * district_kit_gate holds the MODEL. walkable_gate holds land STATISTICS. tilespec_gate
 * holds the DOSSIER. Every one of them was green, because each was checking its own side of
 * a seam nobody was standing on. A CONTRADICTION BETWEEN TWO LIVE SYSTEMS IS A BUG AND NEVER
 * AN INTERPRETATION CHOICE, but it can only be a bug once something compares them.
 *
 * SO THIS GATE IS A COMPARISON AND NOTHING ELSE. It boots the real page, walks real district
 * cells in the real valley, and for every fine cell asks BOTH sides the same question:
 *   the model  — K.tileLayer(legend[code]).solid
 *   the game   — cellAt(gx,gy).walk
 * and requires them to be each other's negation. It asserts nothing about which answer is
 * right for any particular tile; that is the district author's call and it lives in the
 * legend. It only refuses to let the two disagree.
 *
 * IT ALSO HOLDS THE HALF THAT MADE THE FIX SAFE. Honouring the flag immediately exposed
 * fifteen declarations that were simply wrong — twelve dead trees, a map kiosk and a
 * landscaping planter marked walk-through — and shipping the fix without correcting them
 * would have put the player through tree trunks. A TRUNK BLOCKS, so the gate keeps that
 * true: nothing whose name is a tree may be non-solid.
 *
 *   node gates/occupancy_gate.js
 */
const path = require('path');
const ROOT = path.dirname(__dirname);
let pass = 0, fail = 0;
function ok(what, cond) {
  if (cond) { pass++; console.log('  ok   ' + what); }
  else { fail++; console.log('  FAIL ' + what); }
}

require(path.join(ROOT, 'engine/bohemia_world.js'));
const K = require(path.join(ROOT, 'engine/bohemia_district_kit.js'));

console.log('OCCUPANCY GATE — the game and the model agree about every tile\n');

/* ── 1. THE MODEL STILL MODELS IT ──────────────────────────────────────────────
   If the kit ever stops answering per tile, the comparison below becomes vacuous — it
   would be comparing the surface against a constant. Check the ruler before the reading. */
console.log('THE MODEL STILL ANSWERS PER TILE');
{
  const soft = K.tileLayer({ kind: 'prop', solid: false });
  const hard = K.tileLayer({ kind: 'prop' });
  ok('a prop that declares solid:false is non-solid', soft.solid === false);
  ok('and a prop that declares nothing is SOLID by default — which is what makes a ' +
     'declaration meaningful rather than decorative', hard.solid === true);
  ok('tree-dead defaults to solid too', K.tileLayer({ kind: 'tree-dead' }).solid === true);
  ok('and ground is never solid', K.tileLayer({ kind: 'ground' }).solid === false);
}

/* ── 2. A TRUNK BLOCKS ─────────────────────────────────────────────────────────
   The half that made honouring the flag safe. Fifteen declarations were wrong; if any
   comes back, the fix turns into a player walking through a tree. */
console.log('\nA TRUNK BLOCKS');
{
  const trees = [], objects = [];
  for (const d of K.types()) {
    const sp = K.get(d);
    if (!sp || !sp.legend) continue;
    for (const c in sp.legend) {
      const L = sp.legend[c], ly = K.tileLayer(L);
      if (ly.solid) continue;
      const n = String(L.name || '').toLowerCase();
      if (/\btree\b/.test(n)) trees.push(d + ':' + c + ' ' + L.name);
      else if (/\bkiosk\b/.test(n)) objects.push(d + ':' + c + ' ' + L.name);
    }
  }
  ok('no tile named a TREE is walk-through' + (trees.length ? ' — ' + trees.join(', ') : ''),
     trees.length === 0);
  ok('and no kiosk is either' + (objects.length ? ' — ' + objects.join(', ') : ''),
     objects.length === 0);
  /* AND THE ONE I CORRECTED AND THEN PUT BACK, recorded because a silent revert is
     indistinguishable from an oversight: strip:7 "planter" reads, in its own act1, "a tree
     well cut into the promenade, the tree gone, the pit full of grit and trash". That is a
     recess at grade, not a mass, and it stays walk-through. */
  const strip = K.get('strip');
  if (strip && strip.legend[7]) {
    ok('the Strip tree well stays walk-through — its own description says it is a pit, ' +
       'not a planter mass', K.tileLayer(strip.legend[7]).solid === false);
  }
}

/* ── 3. SOMETHING IS ACTUALLY DECLARED ─────────────────────────────────────────
   The comparison below passes trivially if no district declares a walk-through prop at
   all. Count them, so a future "tidy-up" that deletes the declarations cannot look green. */
console.log('\nTHE DECLARATIONS EXIST TO BE HONOURED');
let declared = 0, districts = 0;
for (const d of K.types()) {
  const sp = K.get(d);
  if (!sp || !sp.legend) continue;
  let any = 0;
  for (const c in sp.legend) {
    const ly = K.tileLayer(sp.legend[c]);
    if (ly.layer === 'prop' && !ly.solid) { declared++; any++; }
  }
  if (any) districts++;
}
console.log('       ' + declared + ' walk-through prop tiles declared across ' + districts +
            ' districts');
ok('district authors really do declare walk-through props (' + declared + ' tiles in ' +
   districts + ' districts), so the comparison below is not vacuous',
   declared >= 20 && districts >= 20);

/* ── 4. THE COMPARISON, ON THE REAL PAGE ───────────────────────────────────────
   The only assertion that matters. Everything above is about the ruler. */
const PAGE = 'slices/BOHEMIA_CITY_WORLD.html';
function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

(async () => {
  console.log('\nTHE GAME AND THE MODEL, ASKED THE SAME QUESTION ABOUT THE SAME CELLS');
  let browser;
  try {
    const { chromium } = requirePlaywright();
    browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 },
                                           hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto('file://' + path.join(ROOT, PAGE));
    await SETTLE(p, 3500);

    const r = await p.evaluate(() => {
      const out = { cells: 0, districts: 0, agree: 0, disagree: [], solidChecked: 0,
                    solidAgree: 0, kinds: {}, solidDisagree: [], solidGround: 0,
                    voidChecked: 0, voidAgree: 0, voidDisagree: [], voidBy: {}, voidLit: [] };
      const KIT = BohemiaDistrictKit, N = om.n;
      /* COVER EVERY DISTRICT TYPE, NOT THE FIRST FORTY CELLS. The first version sampled
         "the first 40 cells with a kit grid" and they were all ordinary districts, where no
         GROUND tile is solid. So when the ground branch was reintroducing the walk=true bug,
         this gate reported 0 disagreements and stayed green -- because the interesting case
         (water:0 open water, ground AND solid) was never in the sample.
         A COMPARISON THAT NEVER SEES THE INTERESTING CASE REPORTS AGREEMENT. One cell per
         district TYPE now, and the coverage itself is asserted below. */
      const typeSeen = {};
      let seen = 0;
      for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
        const t = om.at(tx, ty); if (!t) continue;
        if (typeSeen[t.district]) continue;
        let m; try { m = tileMeta(tx, ty); } catch (e) { continue; }
        if (!m.kit) continue;                        /* roads/terrain have no plot grid */
        const sp = KIT.get(m.d); if (!sp || !sp.legend) continue;
        /* EVERY CODE, ON EVERY LAYER -- and the widening is a bug this gate MISSED.
           It used to sweep only `prop` tiles, because that is where the first defect was.
           On 8/18 the GROUND branch turned out to have the same bug one layer down: it set
           walk=true for every ground tile and never looked at tl.solid, so `water:0 open
           water` -- which DECLARES solid:true, because deep water blocks a body -- came back
           16,384 of 16,384 WALKABLE. The whole reservoir, strollable, with this gate green.
           A GATE SCOPED TO WHERE THE LAST BUG WAS ONLY EVER CATCHES THE LAST BUG. */
        /* AND A THIRD STATE, 8/20. This map used to hold one boolean per code, because the
           world had two answers: solid (you bump) or not (you walk). A VOID is neither --
           it does not block AND it is not walkable -- so a boolean could only ever describe
           it wrongly, and the honest bug is that this gate would have called every hole in
           the valley a disagreement. Two booleans, three states. */
        const props = {};
        for (const cd in sp.legend) {
          const ly = KIT.tileLayer(sp.legend[cd]);
          if (ly.layer === 'overhead' || ly.layer === 'portal') continue;  /* pass under / go through */
          props[+cd] = { solid: ly.solid, isVoid: !!ly['void'] };
        }
        if (!Object.keys(props).length) continue;
        typeSeen[m.d] = 1; seen++; out.districts++;
        for (let ly2 = 0; ly2 < FN; ly2++) for (let lx = 0; lx < FN; lx++) {
          const code = m.kit[ly2 * FN + lx];
          if (!(code in props)) continue;
          const solid = props[code].solid;
          const cc = cellAt(tx * FN + lx, ty * FN + ly2);
          const walk = !!(cc && cc.walk);
          /* A VOID IS CHECKED AGAINST BOTH OF ITS CLAIMS, not one. It must refuse a body
             (walk false) AND say out loud that it is a hole (void true), because those are
             two different promises to two different consumers: pathing reads the first,
             combat reads the second. A cell that refuses you but never says why is
             indistinguishable from a wall, which is the bug this whole pass exists to end. */
          if (props[code].isVoid) {
            out.voidChecked++;
            /* NAME THE TILES, not just the count. A bare number cannot be checked against
               anything: "2,405 voids" is equally consistent with the four real drops and
               with some legend accidentally declaring half a district a hole. */
            out.voidBy[m.d + ':' + code] = (out.voidBy[m.d + ':' + code] || 0) + 1;
            /* AND IT HAS TO LOOK LIKE A HOLE, NOT JUST BEHAVE LIKE ONE. The mountain taught
               this the hard way on 8/18: every flag was correct, every number was green, and
               927 cells rendered as brickwork. A void draws on the GROUND channel at a
               DARKER value than the tile's own palette colour, so it reads as floor that
               dropped away rather than as a mass that rose. Checked here because the flags
               and the picture are two different claims and only one of them is what he sees. */
            const lum = h => { const m2 = /^#([0-9a-f]{6})$/i.exec(String(h || '')); if (!m2) return null;
              const n = parseInt(m2[1], 16); return ((n>>16&255) + (n>>8&255) + (n&255)) / 3; };
            const palL = lum(sp.palette && sp.palette[code]), gotL = lum(cc && cc.g);
            if (palL !== null && (gotL === null || gotL >= palL))
              out.voidLit.push(m.d + ':' + code + ' (drawn ' + (cc && cc.g) + ', not darker than ' +
                (sp.palette && sp.palette[code]) + ')');
            if (!walk && cc && cc['void'] === true) out.voidAgree++;
            else if (out.voidDisagree.length < 8)
              out.voidDisagree.push(m.d + ':' + code + ' ' + sp.legend[code].name +
                ' (walk=' + walk + ', void=' + (cc && cc['void'] === true) + ')');
            continue;
          }
          if (solid && KIT.tileLayer(sp.legend[code]).layer !== 'prop') out.solidGround++;
          if (solid) { out.solidChecked++; if (!walk) out.solidAgree++;
            else if (out.solidDisagree.length < 8)
              out.solidDisagree.push(m.d + ':' + code + ' ' + sp.legend[code].name); }
          else {
            out.cells++;
            if (walk) out.agree++;
            else if (out.disagree.length < 8)
              out.disagree.push(m.d + ':' + code + ' ' + sp.legend[code].name);
          }
        }
      }
      return out;
    });

    console.log('       ' + r.districts + ' real district cells sampled in the real valley');
    console.log('       walk-through props : ' + r.agree + ' of ' + r.cells + ' agree');
    console.log('       solid props        : ' + r.solidAgree + ' of ' + r.solidChecked + ' agree');
    ok('the sample actually contained walk-through cells (' + r.cells + ')', r.cells > 100);
    /* THE COVERAGE ASSERTION, and it is the one that makes the two above mean anything.
       A SOLID GROUND tile is the case this gate was blind to for a day: ground-layer and
       solid at once (open water, and anything else a legend declares that way). If the
       sample contains none of them, "0 disagreements" is a statement about the sample. */
    ok('and it contained SOLID GROUND tiles (' + r.solidGround + ') — ground-layer and solid ' +
       'at once, which is the exact case this gate was blind to until 8/18',
       r.solidGround > 0);
    ok('EVERY cell the model calls walk-through, the game lets him stand on' +
       (r.disagree.length ? ' — ' + r.disagree.join(', ') : ''),
       r.cells > 0 && r.agree === r.cells);
    ok('and EVERY cell the model calls solid, the game blocks — the seam is checked in ' +
       'both directions, so "make everything walkable" is not a way to pass this' +
       (r.solidDisagree.length ? ' — ' + r.solidDisagree.join(', ') : ''),
       r.solidChecked > 0 && r.solidAgree === r.solidChecked);
    /* THE THIRD STATE, ON THE GLASS (8/20). The same coverage discipline as above, because
       the same trap is available: a void assertion that never meets a void is a green tick
       for nothing. quarry, gypsum, intake and reclaim all exist in the seed valley, so if
       this count is zero something upstream stopped emitting holes and the two claims below
       are vacuous. */
    console.log('       voids              : ' + r.voidAgree + ' of ' + r.voidChecked + ' agree  [' +
                Object.keys(r.voidBy).map(k => k + ' x' + r.voidBy[k]).join(', ') + ']');
    ok('the sample actually contained VOIDS (' + r.voidChecked + ') — the four lethal drops ' +
       'are real cells in the real valley, not four lines in a legend', r.voidChecked > 0);
    ok('and EVERY void refuses a body AND says it is a hole — a cell that refuses you ' +
       'without saying why is indistinguishable from a wall, which is the bug this ends' +
       (r.voidDisagree.length ? ' — ' + r.voidDisagree.join(', ') : ''),
       r.voidChecked > 0 && r.voidAgree === r.voidChecked);
    ok('and every void is DRAWN darker than the rock it is cut from — a hole that is not '
       + 'darker is a hole he cannot see, which is how the mountain shipped as brickwork'
       + (r.voidLit.length ? ' — ' + r.voidLit.slice(0, 4).join(', ') : ''),
       r.voidChecked > 0 && r.voidLit.length === 0);
    ok('no page errors while walking the valley' + (errs.length ? ' — ' + errs[0] : ''),
       errs.length === 0);
    await browser.close();
  } catch (e) {
    if (browser) try { await browser.close(); } catch (_e) {}
    ok('the real-surface comparison ran at all — ' + String(e).split('\n')[0], false);
  }

  console.log('\nOCCUPANCY GATE: ' + pass + ' passed, ' + fail + ' failed  (the game and the ' +
              'model answer the same question the same way, in both directions, on the ' +
              'surface he walks)');
  process.exit(fail ? 1 : 0);
})();
