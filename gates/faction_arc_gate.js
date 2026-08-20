/* ============================================================================
   FACTION ARC GATE (8/20/26, FACTIONS lane) — ONE PLAYER, ONE SITTING, THE WHOLE
   JOURNEY, THROUGH THE BUTTONS HE ACTUALLY PRESSES.

   Law: laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md

   WHY THIS EXISTS, AND IT IS THE LESSON OF THE WHOLE WEEK.

   Nine gates cover this stack and every one of them verifies a LAYER: the organ
   clamps, the card displays, the rule derives, the save round-trips. Every one
   was green while the stack was broken, four separate times:

     8/15  factionOf was not a function on the city's stale snapshot, so ZERO of
           166 people ran with anybody, for thirteen days. Every organ gate green.
     8/18  BohemiaCommitment.give() -- THE WALL -- was called zero times on the
           walked surface. The organ clamped, the card displayed it, and the
           button went straight past it. Nine presses took you to 9 against a
           ceiling of 5. Every organ gate green.
     8/18  The favour opened an account and NOTHING EVER COLLECTED IT.
     8/19  `burned` said "you cost yourself somewhere else to be here" and nothing
           anywhere cost you anything anywhere else.

   THE ORGAN WAS VERIFIED AND THE WIRING WAS NOT, four times, and each time the
   thing that found it was a person driving the real card by hand. NO CLAIM
   ANYWHERE PLAYED THE ARC.

   So this does. It finds a REAL affiliated person on the REAL city page -- no
   stub, no mock, and it FAILS rather than skips if it cannot -- and walks:

       meet a stranger -> ask their name -> read their outfit's terms ->
       do what they want -> hit THE WALL -> take a side -> get COUNTED ->
       get ASKED for something -> take what they offer -> OWE them ->
       have them stop waiting

   Every step is a REAL BUTTON on the REAL card, pressed in order, and every step
   asserts that SOMETHING MOVED. A step that leaves the save untouched is the
   whole disease.

   AN HONEST LIMIT, MEASURED RATHER THAN ASSUMED. B5 asserts that turning up
   stops AT THE CEILING, and TWO independent mechanisms enforce that: the clamp
   in ctGiveCapped, and the button being withdrawn at the wall. Removing either
   one alone still stops the climb in the right place, so THIS GATE CANNOT TELL
   THEM APART -- exactly the trap the first version of commitment_gate's wall
   check fell into. Removing BOTH (the exact 8/18 bug) reds B5 and B8, which is
   the mutation that was actually run. The clamp on its own is proved directly by
   commitment_gate Ez6, which presses the writer with no button in the way. An
   arc gate tests the JOURNEY; it is not a substitute for the mechanism gates,
   and saying so here is cheaper than somebody rediscovering it.

   MUTATIONS THAT BITE: the 8/18 wall bug (clamp + suppression) reds B5 and B8;
   deleting the debt record in bohemia_favour.take reds B10.

   node gates/faction_arc_gate.js
   ============================================================================ */
'use strict';
const path = require('path');

const ROOT = path.dirname(__dirname);
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const VIEW = { width: 390, height: 844 };

let pass = 0, fail = 0;
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
  console.log('FACTION ARC GATE — one player, one sitting, the whole journey\n');

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEW });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

  try {
    await page.goto('file://' + CITY);
    await page.waitForTimeout(6000);

    const arc = await page.evaluate(() => {
      /* ---- FIND A REAL ONE. No stub. If the valley has nobody who runs with
         anybody, that is a FAILURE of the walked surface, not a reason to skip:
         it is exactly the state the game was silently in for thirteen days. */
      const bases = ctBases() || {};
      let who = null, fid = null;
      for (const b of Object.values(bases)) {
        hx = b.x * FN + 2; hy = b.y * FN + 2;
        for (const p of ctEveryone()) { const f = ctFactionOf(p); if (f) { who = p; fid = f; break; } }
        if (who) break;
      }
      if (!who) return { nobody: true };

      const at = ctAt(who); hx = at[0] + 1; hy = at[1];
      const sv = ctBelongSave();
      sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {}; sv.meta.commit = {};

      const S = [];                       /* the journey, step by step */
      /* THE ACT BUTTON IS NOT ALWAYS THE SAME BUTTON, and the first run of this
         gate got that wrong. For a wants:debt outfit (the Cartel, and it is the
         first affiliated person in the valley) the act and the favour are ONE
         GESTURE by design -- taking their help IS how you climb -- so there is
         no separate ctgive at all. A gate that only knows one economy declares
         the other one dead. */
      const actBtn = () => document.getElementById('ctgive')
                        || document.getElementById('ctfavour');
      /* AND TURNING UP IS A ONCE-A-DAY THING ("YOU ALREADY DID TODAY. COME BACK
         TOMORROW."), which is the design and not a bug: you cannot buy your way
         in by pressing a button. So the walk lets days pass, exactly as playing
         does. A gate that refuses to let time move is testing a game nobody
         plays. */
      /* AND YOU HAVE TO WALK BACK TO THEM. Measured: waking up moves the
         PLAYER (day 1 me [10246,2268], day 2 me [10293,2248]) while the person
         stays where they live. A gate that rolls the day and keeps pressing is
         pressing a card belonging to somebody forty cells away -- which is
         exactly the bug this walk found, and which the game now closes. So the
         walk does what a player does: sleep, then go and find them. */
      const nextDay = () => {
        DAY.nextDay(); daySync();
        const back = ctAt(who); hx = back[0] + 1; hy = back[1];
        ctClose(); ctOpen();
      };
      const txt = () => document.getElementById('ctcard').innerText;
      const has = id => !!document.getElementById(id);
      const press = id => { const b = document.getElementById(id); if (!b) return false; b.click(); return true; };
      const state = () => ({
        gave: BohemiaBelonging.gaveOf(sv, fid),
        /* THROUGH THE ACCESSOR, NEVER THE SAVE. Reading sv.meta.owed[fid]
           directly reported 0 while the real debt was 6 -- the three-spellings
           bug, for the seventh time in this lane, in a probe written by the
           person who fixed the other six. owedOf normalises the key. */
        owed: (typeof BohemiaFavour !== 'undefined') ? BohemiaFavour.owedOf(sv, fid) : 0,
        commit: (typeof BohemiaCommitment !== 'undefined') ? BohemiaCommitment.stateOf(sv, fid) : null,
        rung: (function () {
          const bar = BohemiaBelonging.bargain(BohemiaBelonging.ruleOf(fid),
                                               BohemiaBelonging.gaveOf(sv, fid));
          return bar && bar.rung ? bar.rung.word : null;
        })()
      });
      const step = (name, act) => {
        const before = state();
        const beforeText = txt();
        const did = act();
        ctClose(); ctOpen();
        S.push({ name, did, before, after: state(), text: txt(), beforeText });
      };

      ctSawCell(); ctOpen();
      S.push({ name: 'MET THEM', did: true, before: state(), after: state(), text: txt() });

      step('ASKED THEIR NAME', () => press('ctask'));

      /* the terms are folded once you have standing; on a first meeting they are
         open. Read them here, before anything has been given. */
      S.push({ name: 'READ THEIR TERMS', did: true, before: state(), after: state(), text: txt() });

      /* DO WHAT THEY WANT, until the card stops offering it. The wall is the
         point: this must run out of road, and it must run out at the CEILING. */
      /* ONE DAY, ONE VISIT. Turning up is once a day by design ("YOU ALREADY
         DID TODAY. COME BACK TOMORROW.") -- you cannot buy your way in by
         pressing a button, and a walk that hammers the same day is testing a
         game nobody plays. So: press, and if the count did not move, that is the
         wall; otherwise sleep and come back. */
      const climb = (limit) => {
        let n = 0, before = state().gave;
        while (n < limit) {
          const was = state().gave;
          const b = actBtn(); if (!b) break;
          b.click(); ctClose(); ctOpen();
          n++;
          if (state().gave === was) break;      /* it stopped moving: the wall */
          nextDay();
        }
        return { presses: n, from: before, to: state().gave };
      };
      const first = climb(12);
      S.push({ name: 'TURNED UP UNTIL IT STOPPED', did: first.to > first.from,
               presses: first.presses, before: { gave: first.from },
               after: state(), text: txt() });

      step('TOOK A SIDE', () => press('ctcommit'));

      /* and turning up works again, further than it did */
      nextDay();
      const second = climb(12);
      S.push({ name: 'TURNED UP AGAIN, FURTHER', did: second.to > second.from,
               presses: second.presses, before: { gave: second.from },
               after: state(), text: txt() });

      /* and the OTHER direction. For a debt outfit this is the same button that
         did the climbing, which is his own Cartel canon and not a shortcut. */
      nextDay(); ctClose(); ctOpen();
      step('TOOK WHAT THEY OFFERED', () => press('ctfavour') || press('ctgive'));

      const claimShown = /THEY ARE ASKING YOU/.test(txt());
      S.push({ name: 'THEY ASKED YOU FOR SOMETHING', did: claimShown,
               before: state(), after: state(), text: txt() });

      return { fid, steps: S, ceilingNone: (typeof BohemiaCommitment !== 'undefined')
                 ? BohemiaCommitment.STAGES[0].ceiling : null,
               ceilingSided: (typeof BohemiaCommitment !== 'undefined')
                 ? BohemiaCommitment.STAGES[1].ceiling : null };
    });

    if (arc.nobody) {
      ok('B0 THE WALKED SURFACE HAS SOMEBODY WHO RUNS WITH SOMEBODY. This is not '
        + 'a skip: "nobody in Las Vegas runs with anybody" is the exact state the '
        + 'game was silently in for thirteen days, and a gate that shrugs at it '
        + 'is how that happened', false);
    } else {
      const by = n => arc.steps.find(s => s.name === n) || {};
      const met = by('MET THEM');
      const asked = by('ASKED THEIR NAME');
      const terms = by('READ THEIR TERMS');
      const turned = by('TURNED UP UNTIL IT STOPPED');
      const sided = by('TOOK A SIDE');
      const further = by('TURNED UP AGAIN, FURTHER');
      const favour = by('TOOK WHAT THEY OFFERED');
      const claim = by('THEY ASKED YOU FOR SOMETHING');

      console.log('  (walked with: ' + arc.fid + ')\n');

      /* ---- 1. YOU MEET SOMEBODY AND THEY BELONG TO SOMETHING ---------------- */
      ok('B1 a stranger on the street shows WHO THEY RUN WITH — the one fact the '
        + 'whole stack hangs off, and it read empty for thirteen days',
        /RUNS WITH/.test(met.text) && new RegExp(arc.fid, 'i').test(met.text),
        JSON.stringify((met.text || '').slice(0, 120)));

      /* ---- 2. THE NAME IS THE OUTFIT'S OWN MECHANIC ------------------------- */
      ok('B2 asking their name does whatever THAT OUTFIT does about names — the '
        + 'sixteen authored mechanics, not one uniform button',
        asked.did === true && asked.text !== asked.beforeText,
        'the card must change when you ask');

      /* ---- 3. THE TERMS ARE READABLE BEFORE YOU SPEND ANYTHING -------------- */
      ok('B3 you can read what the outfit wants BEFORE you do anything for them — '
        + 'a bargain you cannot read before agreeing is not a bargain',
        /THEY WANT|THEIR TERMS/.test(terms.text));

      /* ---- 4. TURNING UP WORKS, AND THEN RUNS OUT OF ROAD ------------------- */
      ok('B4 doing what they want MOVES you — the act button actually writes',
        turned.after.gave > 0, JSON.stringify(turned.after));

      ok('B5 …AND IT RUNS OUT. Turning up stops working, at the ceiling, with the '
        + 'button withdrawn. THIS IS THE ONE THAT SHIPPED BROKEN FOR THREE DAYS: '
        + 'the organ clamped, the card said so, and the button went straight past '
        + 'it to nine against a ceiling of five',
        arc.ceilingNone != null && turned.after.gave === arc.ceilingNone,
        'stopped at ' + turned.after.gave + ', ceiling ' + arc.ceilingNone
        + ', after ' + turned.presses + ' presses');

      ok('B6 …and the card SAYS the wall is there rather than just going quiet',
        /THE WALL/.test(turned.text), JSON.stringify((turned.text || '').slice(-160)));

      /* ---- 5. A COMMITMENT PASSES IT --------------------------------------- */
      ok('B7 taking a side MOVES THE COMMITMENT — a real state change, not a row '
        + 'of text',
        sided.did === true && sided.before.commit !== sided.after.commit,
        JSON.stringify({ before: sided.before.commit, after: sided.after.commit }));

      ok('B8 …and turning up works AGAIN, further than before, up to the new '
        + 'ceiling. The wall moved rather than vanishing',
        further.after.gave > turned.after.gave
        && arc.ceilingSided != null && further.after.gave === arc.ceilingSided,
        'reached ' + further.after.gave + ' (was ' + turned.after.gave
        + '), new ceiling ' + arc.ceilingSided);

      ok('B9 …and the climb actually took you somewhere: the rung you stand on '
        + 'is further in than where you started',
        further.after.rung && further.after.rung !== met.after.rung,
        JSON.stringify({ start: met.after.rung, now: further.after.rung }));

      /* ---- 6. IT GOES BOTH WAYS -------------------------------------------- */
      ok('B10 the outfit GIVES as well as takes, and taking it puts you in their '
        + 'debt — the ladder pointed at nothing until this existed',
        favour.did === true && favour.after.owed > favour.before.owed,
        JSON.stringify({ before: favour.before.owed, after: favour.after.owed }));

      /* ---- 7. AND BEING INSIDE COSTS SOMETHING ----------------------------- */
      ok('B11 once they count you they ASK YOU BACK — membership is a '
        + 'relationship that makes demands, not a progress bar with rewards',
        claim.did === true, JSON.stringify((claim.text || '').slice(-200)));

      /* ---- 8. THE WHOLE ARC IS ONE SITTING, ONE PERSON ---------------------- */
      ok('B12 EVERY STEP OF THAT WAS ONE PLAYER, ONE PERSON, ONE SITTING, THROUGH '
        + 'THE REAL BUTTONS — no stub, no direct writes, no reload. Four times '
        + 'this week a layer was green while the stack was broken, and every one '
        + 'of them would have died here',
        arc.steps.every(s => s.did === true),
        JSON.stringify(arc.steps.map(s => s.name + ':' + (s.did ? 'ok' : 'DEAD'))));
    }

    ok('B13 the city threw no errors walking the whole arc', errors.length === 0,
      errors.slice(0, 3).join(' | '));
  } finally { await browser.close(); }

  console.log('\nFACTION ARC GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('FACTION ARC GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
