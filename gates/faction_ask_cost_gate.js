#!/usr/bin/env node
/*
 * FACTION ASK COST GATE -- WHAT ASKING COSTS, BEFORE HE ASKS.
 * (9/12/26, PLUMBER lane, VAMILY row [suite runs]. The checks are FACTIONS'
 * work, moved verbatim; only the file they live in is this lane's.)
 *
 * ## WHY THIS IS A SEPARATE FILE, AND IT IS NOT A STYLE PREFERENCE
 *
 * These three checks were section K of gates/faction_arc_gate.js. That gate is
 * GREEN -- 102 checks pass -- and the suite has never once seen a single one of
 * them, because the gate needed 1,228 s and GATE_CAP is 600. It was killed every
 * run and filed under the reds, so 102 working checks on the faction system read
 * as a failure for weeks and would have sent somebody hunting a bug that is not
 * there.
 *
 * Measured, in this lane's round on that row:
 *
 *     whole gate, before      1,228 s      cap 600 s   killed
 *     section K, before         594 s      48% of it
 *     after the repeat-skip     357 s      (5,112 card opens -> 441)
 *     whole gate after          887 s      cap 600 s   STILL killed
 *
 * Speeding it up was not enough, so the section came out. Both halves now fit:
 * FACTION ARC lands near 530 s and this lands near 357 s, and the checks finally
 * RUN instead of being reported as a failure nobody could act on.
 *
 * NOTHING ABOUT THE CHECKS CHANGED. The block below is section K moved verbatim,
 * with the same preamble it always ran against. The proof is a diff: the three
 * K lines this prints are compared word for word against what the unsplit gate
 * printed, including the exact wording of the three outfits that charge.
 *
 * ## WHAT IT HOLDS (FACTIONS' claim, not this lane's)
 *
 * BohemiaIntros.askOutcome says what a direct ask costs, and three of the sixteen
 * outfits charge for one: CARTEL a smile and a redirect forever, MOB a small
 * permanent mark, ANARCHISTS an insult. The other thirteen are free, which is
 * exactly why it stayed invisible -- the common case looked fine. The law is the
 * 8/15 one in a line: the consequence is printed BEFORE the button, never after.
 */
const path = require('path');

const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');

/* ============================================================================
   *** THIS GATE NEEDS A SPARSE VALLEY, AND NOW IT SAYS SO INSTEAD OF ASSUMING
   ONE. *** (8/28, added by the PEOPLE lane, which is what created the need.)

   Ten places in this file pick "the first affiliated person in the valley" and
   build a whole ladder test on them. One of the comments below says out loud
   what that used to mean: "the Cartel, AND IT IS THE FIRST AFFILIATED PERSON IN
   THE VALLEY". That sentence was true for exactly as long as the population
   default was 1, which puts about one person on a block.

   On 8/28 the default moved to the module's own story landmark (GDD v5's
   ~69,000) because Paolo ruled on 8/25 that a dead city is not an acceptable
   default. First-affiliated became a different person, in a different outfit,
   whose act is once-only, and six claims about climbing a ladder reported a
   broken ladder while nothing was broken.

   A TEST THAT DEPENDS ON HOW MANY PEOPLE ARE IN THE WORLD MUST PIN THAT NUMBER,
   exactly the way it already pins the seed. This gate is about BELONGING, not
   about population, so it pins the sparse valley it was written against.

   WHAT THIS NO LONGER COVERS, said rather than hidden: belonging behaviour that
   only appears in a CROWD. Nothing here sees the shipped density any more, and
   a crowd-side belonging test is a real row that does not exist yet.

   *** PINNED AT EIGHT, NOT AT ONE (9/5, FACTIONS). *** The rule above is right
   and is kept: a test that depends on how many people are in the world must PIN
   that number. It does not say pin it at 1; 1 was simply the default on the day
   this was written. MEASURED, on the same seed, over the roster this gate reads:

       dial  1   298 people    7 of 14 outfits present   Colorful  0
       dial  2   595           10                        Colorful  1
       dial  4  1189           11                        Colorful  3
       dial  8  2377           14                        Colorful  4
       dial 16  4486           14                        Colorful 11

   AT DIAL 1 HALF THE VALLEY'S OUTFITS DO NOT EXIST, so six claims here -- the
   Colorful's whole screening arc, an outfit with no act to compare, the coverage
   of every act type -- were asking about people the pinned world did not
   contain. They passed while faction seats sat on an even stride through a
   y-ordered district list, which happened to drop a base near the few dial-1
   people; they went red the moment seats moved onto the ground each faction's
   own canon names, and NOTHING ABOUT BELONGING HAD CHANGED.

   Eight is the smallest dial at which all fourteen outfits are present, which is
   the property this gate actually needs -- and the smallest is the point: at
   sixteen the roster is 4486 and every scan in this file walks it, which took
   the whole run past its ten-minute budget. It is still pinned, still far below the
   shipped density, and the stability that dial 1 was really protecting -- "the
   FIRST affiliated person in the valley" being the same person every run -- is
   now supplied properly by __pickAffiliated below, which chooses deliberately
   instead of taking whoever comes first.
   ========================================================================== */
const SPARSE = `(function(){
  try { BohemiaPopulation.setDial(8); } catch (e) {}
  try { PPL_PEOPLE.clear(); } catch (e) {}
})()`;

const VIEW = { width: 390, height: 844 };

let pass = 0, fail = 0;
/* ---- STAND WHERE THE CARD WILL ACTUALLY OPEN ON THEM --------------------
   (9/5.) ctOpen() shows whoever ctAdjacent() returns, and ctAdjacent takes the
   CLOSEST person within one cell, first-wins on ties. Every site in this gate
   stood at `person.x + 1` and assumed that person's card would open. It usually
   did, and it stopped being true the moment faction seats moved onto the ground
   each faction's canon names: at the Anarchists' new seat the chosen person was
   affiliated, the person who actually opened was not, and TWENTY-NINE claims
   went red about a stack that was working.

   THE ASSUMPTION WAS ALWAYS WRONG, the old geography just hid it. This stands on
   the neighbour where the target is the ONLY person within a cell, so the card
   that opens is the card the claim is about. It returns false when no such cell
   exists, which is a real answer -- a person hemmed in by a crowd is somebody
   you genuinely cannot read alone -- rather than a silent wrong subject. */
const STAND_BESIDE = `window.__standBeside = function (who) {
  if (!who) return false;
  var at = ctAt(who);
  var around = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];
  /* IT ASKS THE GAME, IT DOES NOT MODEL THE GAME. The first cut of this
     reimplemented ctAdjacent's rule -- "stand where nobody else is within a
     cell" -- and was still wrong at half the sites, because a second copy of a
     rule is a second chance to be wrong about it. ctAdjacent IS the function
     that decides whose card opens, so this stands and then ASKS IT. */
  for (var i = 0; i < around.length; i++) {
    hx = at[0] + around[i][0]; hy = at[1] + around[i][1];
    if (typeof ctAdjacent === 'function' && ctAdjacent() === who) return true;
  }
  hx = at[0] + 1; hy = at[1];          /* no side works: the old behaviour */
  return false;
};
/* AND ONE PLACE THAT PICKS THE SUBJECT, for the same reason. Every walk in this
   gate used to take the first affiliated person at the first base. That person
   is often standing in a crowd, and a long walk -- eight days, a dozen presses,
   a day roll between each -- only holds together if the card keeps being THEIRS.
   This prefers somebody with nobody else within two cells, and falls back to
   first-found so an empty answer still means "the valley has nobody", which is a
   real finding rather than a skipped test. */
window.__pickAffiliated = function (wantFid) {
  /* AN OPTIONAL PREDICATE ON THE OUTFIT, because several walks are ABOUT a
     property only some outfits have. B10 is "the outfit GIVES as well as takes,
     and taking it puts you in their debt" -- that is his they-give-first
     shape (Cartel, Church, Network), and the step's own comment says so: "for a
     debt outfit this is the same button that did the climbing, which is his own
     Cartel canon". Drawing a you-give-first outfit and reporting that nothing
     was owed measures the draw, not the game. Selecting for the property under
     test is the same thing the Homeless and Colorful walks already do. */
  var bases = ctBases() || {}, fb = null, fbF = null;
  var ok = (typeof wantFid === 'function') ? wantFid : function () { return true; };
  var tries = 0;
  for (var k in bases) {
    var b = bases[k];
    hx = b.x * FN + 2; hy = b.y * FN + 2;
    tries = 0;
    var all = ctEveryone();
    for (var i = 0; i < all.length; i++) {
      var f = ctFactionOf(all[i]); if (!f) continue;
      if (!fb) { fb = all[i]; fbF = f; }
      if (!ok(f)) continue;
      /* BOUNDED, because verifying is not free: __standBeside asks ctAdjacent up
         to eight times and ctAdjacent walks everybody, so verifying every
         candidate at every base is cubic and timed this gate out at ten minutes.
         Forty per base finds somebody standable and stays inside the budget. */
      if (++tries > 40) break;
      /* AND IT PROVES IT CAN STAND THERE BEFORE HANDING THE SUBJECT OVER.
         (9/5, second pass.) This used to accept anybody with nobody within two
         cells, which is a MODEL of what ctAdjacent does rather than a question
         put to it -- the same mistake __standBeside made and had corrected one
         screenful above. In a valley with every outfit actually in it, a walk of
         eight days and a dozen presses would be handed somebody whose card
         another person answers. Asking costs one call and removes the whole
         class. */
      if (__standBeside(all[i])) return { who: all[i], fid: f };
    }
  }
  return fb ? { who: fb, fid: fbF } : null;
};
/* AND A MEMBER OF A NAMED OUTFIT THAT CAN ACTUALLY BE READ. (9/5.) Three scans
   took R.filter(...)[0] -- the first member of that outfit in the roster -- and
   reported the whole outfit unreachable if that one person happened to be hemmed
   in by neighbours. R1 said so in its own output: "CHURCH(cannot stand beside),
   HOMELESS(cannot stand beside)". One person you cannot get alone is not an
   outfit that fails to pay what it declares, and a scan that cannot tell those
   apart is measuring the crowd. */
window.__standableOf = function (R, norm) {
  var pool = R.filter(function (a) { return String(a.faction || '').toUpperCase() === norm; });
  for (var i = 0; i < pool.length; i++) {
    var row = pool[i];
    var q = String(row.__id).split(':'), span = BohemiaPopulation.NB * FN;
    hx = (+q[0]) * span + 4; hy = (+q[1]) * span + 4; CT_SPAWN = null; ctSpawn();
    var rec = ctEveryone().filter(function (x) { return x.id === row.__id; })[0];
    if (!rec) continue;
    if (__standBeside(rec)) return { rec: rec, tried: i + 1, pool: pool.length };
  }
  return { rec: null, tried: pool.length, pool: pool.length };
};`;

function ok(claim, cond, detail) {
  if (cond) { pass++; console.log('  ok  ' + claim); }
  else { fail++; console.log('  FAIL ' + claim + (detail ? '\n       ' + detail : '')); }
}
function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

(async function main() {
  console.log('FACTION ASK COST GATE \u2014 what asking costs, before he asks\n');

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();

  try {
    /* ---- K. WHAT ASKING COSTS, BEFORE HE ASKS -----------------------------
       FOUND BY SWEEPING, NOT BY TRIPPING OVER IT. Six times this week an organ
       computed something and nothing on the walked surface called it, so instead
       of waiting for the seventh I counted the call sites of every function this
       lane exports. BohemiaIntros.askOutcome: ZERO CALLERS.
       It is the function that says what asking costs, and three of the sixteen
       charge for a direct ask -- CARTEL a smile and a redirect forever, MOB a
       small permanent mark, ANARCHISTS an insult. The other thirteen are free,
       which is exactly why it stayed invisible: the common case looked fine.
       AND THE ROW FOR THE CONSEQUENCE ALREADY EXISTED. ctIntroRows has printed
       `if(m.cost) ctRow('AND', m.cost)` all along -- but that is meeting().cost,
       empty BEFORE you ask and filled in AFTER. The card could always say what
       asking DID cost and never what it WOULD. That is the 8/15 law in one line:
       the consequence is printed before the button, never after. */
    const askc = await (async () => {
      const pg = await browser.newPage({ viewport: VIEW });
      await pg.addInitScript(STAND_BESIDE);
      try {
        await pg.goto('file://' + CITY);
        await pg.waitForTimeout(6000);
        await pg.evaluate(SPARSE);
        return await pg.evaluate(() => {
          const bases = ctBases() || {}, seen = {}, answered = {};
          const row = (k) => {
            const rows = [...document.querySelectorAll('#ctcard .r')];
            const r = rows.find(x => { const kk = x.querySelector('.k');
                                       return kk && kk.textContent.trim() === k; });
            return r ? r.querySelector('.v').textContent.trim() : null;
          };
          for (const b of Object.values(bases)) {
            /* A WIDER RING, BECAUSE THE CAPITALS MOVED. (9/5.) Six offsets down one
             diagonal from the base centre was enough while seats sat on an even
             stride through the district list, which put every one of them in a
             dense suburb. Seats now sit on the ground each faction's own note
             names -- an arsenal, an intake, a boneyard -- and three of those
             have NOBODY affiliated within the old six samples, so the walk
             could reach twelve outfits and press only some of them. This
             samples a ring instead of a line. It is a change to the PROBE, not
             to the game: a scan that only finds members when every capital sits
             in a suburb was always measuring the suburb. */
            for (const d of [2, 4, 6, 8, 10, 12, -2, -4, -6, -8, -10, -12]) {
              hx = b.x * FN + d; hy = b.y * FN + d;
              /* DO NOT RE-OPEN A CARD ON SOMEBODY ALREADY ANSWERED (PLUMBER 9/12).
                 The ring walks 14 bases x 12 offsets, and the rings overlap heavily, so
                 the SAME PEOPLE keep turning up. MEASURED on this scan: 5,112 passes over
                 441 DISTINCT PEOPLE -- 4,671 of them (91%) re-opening a card on somebody
                 whose outfit was already read. At 116 ms a pass that is where this section's
                 594 s went, not in the arithmetic and not in the four page boots (9%).
                 SKIPPING IS RESULT-IDENTICAL, and the reason is in the line below: `seen`
                 only ever records a fid the FIRST time it appears, so every later pass over
                 the same person already fell through `seen[fid]` and changed nothing. Only
                 people whose card ANSWERED are skipped -- a null read is retried, because a
                 card that failed to fill once may fill at another spot, and losing that would
                 lose an outfit. The scan still visits every distinct person the ring reaches.
                 Before 594 s, after: see the commit. */
              for (const q of ctEveryone()) {
                const pk = (q && (q.id || q.key || q.name)) || null;
                if (pk && answered[pk]) continue;
                __standBeside(q);
                ctSawCell(); ctClose(); ctOpen();
                const fid = row('RUNS WITH');
                if (pk && fid) answered[pk] = 1;
                if (!fid || seen[fid]) { ctClose(); continue; }
                const rule = BohemiaIntros.ruleOf(fid);
                const organCost = (BohemiaIntros.askOutcome(rule,
                                    { full: 'X Y', trade: 'WATCH' }, { asked: false }) || {}).cost || '';
                seen[fid] = { organCost, rest: row('HOW YOU GET THE REST') || '' };
                ctClose();
              }
            }
          }
          return seen;
        });
      } finally { await pg.close(); }
    })();

    const charged = Object.keys(askc).filter(f => askc[f].organCost);
    const free = Object.keys(askc).filter(f => !askc[f].organCost);

    ok('K1 the valley contains at least one outfit that CHARGES for a direct ask '
      + 'and one that does not — otherwise this part is asserting nothing',
      charged.length >= 1 && free.length >= 1,
      JSON.stringify({ charged, free }));

    for (const f of charged) {
      ok('K2 ' + f + ' TELLS HIM WHAT ASKING COSTS BEFORE HE ASKS ("'
        + askc[f].organCost + '"). A price you discover by paying it is a '
        + 'punishment; a price you read first is a decision — and with the Mob '
        + 'it is THE decision, because you are meant to wait to be introduced',
        askc[f].rest.indexOf(askc[f].organCost) >= 0,
        JSON.stringify(askc[f]));
    }

    ok('K3 …and an outfit that charges NOTHING says nothing about a cost. '
      + 'Printing "this costs you nothing" on thirteen of sixteen is noise, the '
      + 'same reason the quiet-day row only appears above zero',
      free.every(f => !/ASKING COSTS/.test(askc[f].rest)),
      JSON.stringify(free.map(f => f + ': ' + askc[f].rest)));

  } finally { await browser.close(); }

  console.log('\nFACTION ASK COST GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('FACTION ASK COST GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
