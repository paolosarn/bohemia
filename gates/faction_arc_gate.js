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
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
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
   ========================================================================== */
const SPARSE = `(function(){
  try { BohemiaPopulation.setDial(1); } catch (e) {}
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
window.__pickAffiliated = function () {
  var bases = ctBases() || {}, fb = null, fbF = null;
  for (var k in bases) {
    var b = bases[k];
    hx = b.x * FN + 2; hy = b.y * FN + 2;
    var all = ctEveryone();
    for (var i = 0; i < all.length; i++) {
      var f = ctFactionOf(all[i]); if (!f) continue;
      if (!fb) { fb = all[i]; fbF = f; }
      var a = ctAt(all[i]), crowd = 0;
      for (var j = 0; j < all.length; j++) {
        if (all[j] === all[i]) continue;
        var c = ctAt(all[j]);
        if (Math.abs(c[0] - a[0]) + Math.abs(c[1] - a[1]) <= 2) { crowd++; break; }
      }
      if (!crowd) return { who: all[i], fid: f };
    }
  }
  return fb ? { who: fb, fid: fbF } : null;
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
  console.log('FACTION ARC GATE — one player, one sitting, the whole journey\n');

  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: VIEW });
  await page.addInitScript(STAND_BESIDE);
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));

  try {
    await page.goto('file://' + CITY);
    await SETTLE(page, 6000);
    await page.evaluate(SPARSE);

    const arc = await page.evaluate(() => {
      /* ---- FIND A REAL ONE. No stub. If the valley has nobody who runs with
         anybody, that is a FAILURE of the walked surface, not a reason to skip:
         it is exactly the state the game was silently in for thirteen days. */
      /* AND PICK SOMEBODY STANDING SOMEWHERE QUIET. (9/5.) This used to take the
         first affiliated person at the first base, and the whole walk after it --
         eight days, a dozen button presses, a day roll between each -- assumes
         the card stays THEIRS. In a crowd it does not: ctAdjacent takes the
         closest person within a cell, so a neighbour drifting past between days
         hands the next press to a stranger, and the ladder reads "stopped at 1
         of 5" while nothing is wrong with the ladder. It passed for weeks
         because the old seats happened to sit in thin crowds; moving them onto
         the ground each faction's canon names put the first base in a busy one
         and twenty-nine claims went red about a stack that works.
         SO THE SUBJECT IS CHOSEN FOR ISOLATION, not for being first. */
      const bases = ctBases() || {};
      let who = null, fid = null, fallback = null, fbFid = null;
      for (const b of Object.values(bases)) {
        hx = b.x * FN + 2; hy = b.y * FN + 2;
        const all = ctEveryone();
        for (const p of all) {
          const f = ctFactionOf(p); if (!f) continue;
          if (!fallback) { fallback = p; fbFid = f; }
          const a = ctAt(p);
          let crowd = 0;
          for (const q of all) {
            if (q === p) continue;
            const c = ctAt(q);
            if (Math.abs(c[0] - a[0]) + Math.abs(c[1] - a[1]) <= 2) crowd++;
          }
          if (crowd === 0) { who = p; fid = f; break; }
        }
        if (who) break;
      }
      if (!who) { who = fallback; fid = fbFid; }   /* nobody alone: say so by trying anyway */
      if (!who) return { nobody: true };

      __standBeside(who);
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
        /* AND STAND WHERE THE CARD OPENS ON THEM, not merely next to them.
           This said `hx = back[0] + 1` and was the last survivor of that idiom:
           after every day roll the walk reopened whoever ctAdjacent happened to
           pick, so from B5 onward the presses were landing on a stranger's card
           and the ladder "stopped at 1 of 5". */
        __standBeside(who);
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

    /* ---- C. AN OUTFIT WITH NO LADDER PROMISES NO CLIMB --------------------
       TWO OF THE SIXTEEN WANT `character` AND THERE IS NO ACT FOR IT -- and
       reading his dossiers says the missing act is CORRECT, not a hole:
         THE COLORFUL   "To know whether you are safe to be around. That is the
                         whole assessment and IT NEVER STOPS RUNNING."
         SOCIAL FORCES  "Recruits, and specifically recruits who are frightened.
                         They approach AFTER something bad has happened to you."
       Neither describes a task. Character is not something you DO, it is
       something they READ OFF YOU, so a "prove your character" button would be
       inventing canon in the two places he was most careful.
       WHAT WAS WRONG WAS THE CARD. Measured on a real Colorful member: no
       buttons at all, and either side of "NOTHING TO PRESS" it printed
       "1 MORE TO SOMEBODY WHO SHOWED UP" and "5 MORE AND TURNING UP STOPS
       WORKING". One more WHAT? Third time this week the same disease: A SURFACE
       DESCRIBING A MECHANISM THE PLAYER CANNOT REACH. */
    const ladder = await page.evaluate(() => {
      const bases = ctBases() || {};
      let noAct = null, withAct = null;
      for (const b of Object.values(bases)) {
        for (const d of [2, 5, 8]) {
          hx = b.x * FN + d; hy = b.y * FN + d;
          for (const q of ctEveryone()) {
            const f = ctFactionOf(q); if (!f) continue;
            const rule = BohemiaBelonging.ruleOf(f);
            if (!rule || !rule.wants || rule.wants === 'nothing') continue;
            const slot = ctHasLadder(rule) ? 'withAct' : 'noAct';
            if (slot === 'noAct' && noAct) continue;
            if (slot === 'withAct' && withAct) continue;
            const keepx = hx, keepy = hy;
            __standBeside(q);
            const sv = ctBelongSave();
            sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {}; sv.meta.commit = {};
            ctSawCell(); ctClose(); ctOpen();
            const card = document.getElementById('ctcard');
            const rec = { fid: f, wants: rule.wants,
                          text: card ? card.innerText : '',
                          buttons: ['ctask','ctgive','ctfavour','ctcommit']
                                     .filter(x => !!document.getElementById(x)) };
            if (slot === 'noAct') noAct = rec; else withAct = rec;
            ctClose(); hx = keepx; hy = keepy;
          }
          if (noAct && withAct) break;
        }
        if (noAct && withAct) break;
      }
      return { noAct, withAct };
    });

    if (ladder.noAct) {
      ok('C1 an outfit with NO ACT AT ANY STATE does not print a rung you cannot '
        + 'climb to. "1 MORE TO SOMEBODY WHO SHOWED UP" on a card with no button '
        + 'is one more WHAT',
        !/\d+ MORE TO /.test(ladder.noAct.text),
        ladder.noAct.fid + ' (' + ladder.noAct.wants + '): '
        + JSON.stringify(ladder.noAct.text.slice(0, 200)));

      ok('C2 …and prints no WALL either. A wall is the end of a road, and there '
        + 'is no road',
        !/TURNING UP STOPS WORKING/.test(ladder.noAct.text));

      ok('C3 …and SAYS what the rule actually is, so a player meeting one does '
        + 'not read the blank as a bug — his own dossier, that the assessment '
        + 'never stops running',
        /YOU DO NOT CLIMB WITH THESE/.test(ladder.noAct.text));
    } else {
      ok('C1 the valley has somebody from an outfit with no act to compare', false);
    }

    if (ladder.withAct) {
      ok('C4 …and an outfit that DOES have an act still shows its ladder. The '
        + 'silence is for outfits with no rungs, never for one you simply have '
        + 'not visited today',
        /YOU ARE/.test(ladder.withAct.text),
        ladder.withAct.fid + ' (' + ladder.withAct.wants + ')');
    } else {
      ok('C4 the valley has somebody from an outfit with an act to compare', false);
    }

    /* ---- E. AND WHAT HAPPENS WHEN YOU ANSWER THEM -------------------------
       THE ARC ABOVE WALKS UP TO "THEY ARE ASKING YOU" AND STOPS. Nobody has ever
       answered. And the answer is the whole point of the claim (Portes 1998,
       excess claims on group members): saying YES buys you NOTHING, because
       meeting an obligation is the RENT on being counted and not a rung; saying
       NO costs you the standing that made you worth asking in the first place.
       That asymmetry is the first thing a kind edit would break, and it has
       never once been driven through the two buttons on the card.

       Both answers are walked from the SAME state on a fresh page each time, so
       "yes buys nothing" and "no costs you" are compared against each other and
       not against two different histories. */
    async function answerClaim(said) {
      const pg = await browser.newPage({ viewport: VIEW });
      await pg.addInitScript(STAND_BESIDE);
      try {
        await pg.goto('file://' + CITY);
        await SETTLE(pg, 6000);
        await pg.evaluate(SPARSE);
        return await pg.evaluate((say) => {
          const pick = __pickAffiliated();
          if (!pick) return { nobody: true };
          const who = pick.who, fid = pick.fid;
          __standBeside(who);
          const sv = ctBelongSave();
          sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {}; sv.meta.commit = {};
          /* COUNTED, so they are entitled to ask. Built through the real writer,
             never by poking the save -- that is how the probe lied about the
             debt earlier in this same file. */
          for (let i = 0; i < 6; i++) BohemiaBelonging.record(sv, fid, 0);
          ctSawCell(); ctClose(); ctOpen();
          const before = { gave: BohemiaBelonging.gaveOf(sv, fid),
                           rung: (BohemiaBelonging.bargain(BohemiaBelonging.ruleOf(fid),
                                  BohemiaBelonging.gaveOf(sv, fid)).rung || {}).word };
          const btn = document.getElementById(say === 'yes' ? 'ctclaimyes' : 'ctclaimno');
          const asked = /THEY ARE ASKING YOU/.test(document.getElementById('ctcard').innerText);
          if (btn) btn.click();
          ctClose(); ctOpen();
          return { fid, asked, hadButton: !!btn, before,
                   after: { gave: BohemiaBelonging.gaveOf(sv, fid),
                            rung: (BohemiaBelonging.bargain(BohemiaBelonging.ruleOf(fid),
                                   BohemiaBelonging.gaveOf(sv, fid)).rung || {}).word } };
        }, said);
      } finally { await pg.close(); }
    }

    const yes = await answerClaim('yes');
    const no  = await answerClaim('no');

    ok('E1 once they COUNT you they really do ask, and there are two buttons to '
      + 'answer with — the claim is a decision on the card, not a row of text',
      yes.asked === true && yes.hadButton === true && no.hadButton === true,
      JSON.stringify({ yes: yes.hadButton, no: no.hadButton, asked: yes.asked }));

    ok('E2 SAYING YES BUYS YOU NOTHING. Meeting an obligation is the RENT on '
      + 'being counted, not a rung — and that is the first thing a kind edit '
      + 'would break',
      yes.after && yes.after.gave <= yes.before.gave,
      JSON.stringify({ before: yes.before, after: yes.after }));

    ok('E3 …and SAYING NO COSTS YOU the standing that made you worth asking. '
      + 'Being inside is a relationship that makes demands, and refusing one has '
      + 'a price or it was never a demand',
      no.after && no.after.gave < no.before.gave,
      JSON.stringify({ before: no.before, after: no.after }));

    ok('E4 …and the two answers genuinely differ. If yes and no left you in the '
      + 'same place the choice would be decoration',
      yes.after && no.after && yes.after.gave !== no.after.gave,
      JSON.stringify({ yes: yes.after, no: no.after }));

    /* ---- F. THE SIXTEEN NAME MECHANICS, PRESSED ---------------------------
       Every outfit does something DIFFERENT when you ask its members their name
       -- that is the 8/11 introductions organ, 46 gated claims -- and every one
       of those claims is STRUCTURAL: the rule resolves, the anchor holds, the
       signatures are distinct. NOT ONE pressed the button on a real member of a
       real outfit and read what came back. That is exactly the shape that hid
       four bugs this week.

       AND THIS PART NEARLY SHIPPED A FALSE FINDING, which is why it is written
       the way it is. A first pass picked a person, moved next to them, opened the
       card, and labelled the result with THAT PERSON'S faction -- but ctOpen()
       shows whoever is actually NEAREST, which is not always who you picked. It
       reported that the Mob hands over a full name to a direct ask, flatly
       against its own anchor ("YOU ARE INTRODUCED, YOU DO NOT ASK"). It does not.
       The card was somebody else's.
       SO THE CARD'S OWN `RUNS WITH` ROW IS THE SUBJECT, never my pick. A probe
       that decides who it is looking at can be wrong about what it saw. */
    const names = await page.evaluate(() => {
      const bases = ctBases() || {}, seen = {};
      const row = (k) => {
        const rows = [...document.querySelectorAll('#ctcard .r')];
        const r = rows.find(x => { const kk = x.querySelector('.k');
                                   return kk && kk.textContent.trim() === k; });
        return r ? r.querySelector('.v').textContent.trim() : null;
      };
      const nameRow = () => row('NAME') || row('KNOWN AS');
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
          for (const q of ctEveryone()) {
            __standBeside(q);
            ctSawCell(); ctClose(); ctOpen();
            const fid = row('RUNS WITH');           /* the CARD's answer, not mine */
            if (!fid || seen[fid]) { ctClose(); continue; }
            const rule = BohemiaIntros.ruleOf(fid);
            const ctx = { full: 'X Y', trade: 'WATCH' }, st = { asked: false };
            const rec = { organButton: BohemiaIntros.buttonFor(rule, ctx, st),
                          organGives: (BohemiaIntros.askOutcome(rule, ctx, st) || {}).got,
                          ruleNext: rule.next,
                          cardRest: row('HOW YOU GET THE REST'),
                          cardButton: (document.getElementById('ctask') || {}).textContent || null,
                          before: nameRow() };
            const btn = document.getElementById('ctask');
            if (btn) btn.click();
            ctClose(); ctOpen();
            rec.after = nameRow();
            seen[fid] = rec; ctClose();
          }
        }
      }
      return seen;
    });

    const outfits = Object.keys(names).sort();
    ok('F1 the name button was pressed on a real member of several different '
      + 'outfits — not one outfit called sixteen',
      outfits.length >= 4, 'outfits met: ' + JSON.stringify(outfits));

    for (const f of outfits) {
      const n = names[f];
      ok('F2 ' + f + '\'s name mechanic on the card IS its authored one: the '
        + 'button the organ names is the button drawn, and what the ask returns '
        + 'is what the organ says it returns ("' + n.organGives + '")',
        n.cardButton === n.organButton
        && (n.organGives === 'nothing' ? n.after === n.before : n.after !== n.before),
        JSON.stringify(n));

      if (n.cardRest !== null)
        /* CONTAINS, NOT EQUALS. This asserted string equality and went red on
           MOB the day a different roster put that member in the un-asked state:
              card "BE INTRODUCED BY SOMEBODY WHO VOUCHES  ·  ASKING COSTS: A
                    SMALL PERMANENT MARK AGAINST YOU."
              rule "BE INTRODUCED BY SOMEBODY WHO VOUCHES"
           The rule IS there verbatim, which is the whole claim -- what follows is
           __CITY_ASKCOST__ telling him the price BEFORE the button, which is a
           different law (8/15) doing its job on the same row.
           EQUALITY WAS NEVER THE CLAIM. "In its own words, verbatim from the
           rule" is satisfied by containment; demanding equality forbids any other
           system from ever adding to that row, which is not a thing this gate
           gets to decide on the card's behalf. */
        ok('F3 ' + f + ' tells the player HOW TO GET THE REST in its own words, '
          + 'verbatim from the rule rather than a generic line',
          String(n.cardRest).indexOf(String(n.ruleNext)) === 0,
          JSON.stringify({ card: n.cardRest, rule: n.ruleNext }));
    }

    /* ---- D. EVERY ACT A PLAYER CAN PRESS, PRESSED -------------------------
       THE ARC ABOVE WALKS ONE OUTFIT. There are FIVE distinct acts across the
       sixteen -- information, debt, presence, legibility, labour -- and until
       this part existed, exactly ONE of them had ever been pressed on the walked
       surface. An act nobody has pressed is the shape of every bug this week:
       the wall that was a sign, the favour nobody collected, the cost that cost
       nothing, the ladder with no rungs. All four were live code that no claim
       had ever driven.

       This does not re-walk the whole journey for each -- that is B1..B12's job
       and it would be five times the runtime for the same evidence. It asserts
       the ONE thing an act must do: PRESSING IT MOVES THE COUNT. */
    const acts = await page.evaluate(() => {
      const bases = ctBases() || {};
      const found = {};
      for (const b of Object.values(bases)) {
        for (const d of [2, 5, 8, 11]) {
          hx = b.x * FN + d; hy = b.y * FN + d;
          for (const q of ctEveryone()) {
            const f = ctFactionOf(q); if (!f) continue;
            const rule = BohemiaBelonging.ruleOf(f);
            if (!rule || !rule.wants || rule.wants === 'nothing') continue;
            if (found[rule.wants]) continue;
            if (!ctHasLadder(rule)) { found[rule.wants] = { fid: f, noLadder: true }; continue; }
            __standBeside(q);
            const sv = ctBelongSave();
            sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {}; sv.meta.commit = {};
            ctSawCell(); ctClose(); ctOpen();
            const before = BohemiaBelonging.gaveOf(sv, f);
            const btn = document.getElementById('ctgive') || document.getElementById('ctfavour');
            const label = btn ? btn.textContent : null;
            if (btn) btn.click();
            ctClose(); ctOpen();
            found[rule.wants] = { fid: f, firstMove: rule.firstMove, label,
                                  hadButton: !!btn, before,
                                  after: BohemiaBelonging.gaveOf(sv, f) };
            ctClose();
          }
        }
      }
      return found;
    });

    const kinds = Object.keys(acts).filter(k => !acts[k].noLadder).sort();
    ok('D1 the valley actually contains outfits wanting more than one thing — '
      + 'otherwise this part is testing one act and calling it five',
      kinds.length >= 3, 'reachable acts: ' + JSON.stringify(kinds));

    for (const k of kinds) {
      const a = acts[k];
      ok('D2 pressing the act for `' + k + '` MOVES THE COUNT (' + a.fid + ', '
        + a.firstMove + ', "' + a.label + '"). Until this part existed exactly '
        + 'one of the five acts had ever been pressed on the walked surface, and '
        + 'every bug this week was live code no claim had driven',
        a.hadButton === true && a.after > a.before,
        JSON.stringify({ fid: a.fid, button: a.label, before: a.before, after: a.after }));
    }

    /* AND IT NAMES WHAT IT COULD NOT REACH, because silence about an untested
       act reads exactly like coverage -- the same lesson the gate suite learned
       on 8/19 about unrun gates. */
    const reach = await page.evaluate(() => {
      const roster = ctValleyRoster(), bases = ctBases() || {};
      const people = {};
      roster.forEach(a => { if (a.faction) people[a.faction] = (people[a.faction] || 0) + 1; });
      const wantsWithPeople = {}, emptyBases = [];
      for (const name of Object.keys(bases)) if (!people[name]) emptyBases.push(name);
      for (const f of Object.keys(people)) {
        const r = BohemiaBelonging.ruleOf(f);
        if (r && r.wants) wantsWithPeople[r.wants] = (wantsWithPeople[r.wants] || 0) + people[f];
      }
      const allWants = {};
      for (const k of Object.keys(BohemiaBelonging.RULES || {})) {
        const r = BohemiaBelonging.RULES[k];
        if (r.wants && r.wants !== 'nothing') allWants[r.wants] = true;
      }
      return { emptyBases, wantsWithPeople,
               unreachable: Object.keys(allWants).filter(w => !wantsWithPeople[w]).sort(),
               affiliated: roster.filter(a => a.faction).length, people: roster.length };
    });

    console.log('  (acts with members: ' + JSON.stringify(reach.wantsWithPeople) + ')');
    if (reach.unreachable.length)
      console.log('  (NOT REACHABLE IN THIS VALLEY: ' + reach.unreachable.join(', ')
        + ' — bases with nobody: ' + reach.emptyBases.join(', ') + ')');

    /* AND THE SET OF ACTS IS PINNED, because the first version of D3 had an
       ESCAPE HATCH and a mutation walked straight through it: deleting `labour`
       from the ACTS table made its D2 claim VANISH rather than fail, and D3
       accepted the outfit as legitimately actless. 22 passed, 0 failed, one
       fewer claim, no red. THAT IS SILENCE READING AS COVERAGE -- the exact
       disease this gate and the 8/19 suite work both exist to kill, in my own
       gate, one turn after writing the law about it.
       The data alone cannot separate "character has no act BY DESIGN" (his
       dossiers) from "labour lost its act BY REGRESSION", so the set is named
       here. It is five, it is small, and it has been stable since 8/12. */
    const EXPECTED_ACTS = ['debt', 'information', 'labour', 'legibility', 'presence'];
    const haveActs = await page.evaluate(() =>
      Object.keys((BohemiaBelonging.ACTS) || {}).sort());
    ok('D2b THE SET OF ACTS IS EXACTLY THE FIVE. A claim that can disappear is '
      + 'not a claim: deleting one from the table made its D2 vanish silently, '
      + 'so the set is pinned rather than inferred from whatever survives',
      JSON.stringify(haveActs) === JSON.stringify(EXPECTED_ACTS),
      'have ' + JSON.stringify(haveActs) + ' want ' + JSON.stringify(EXPECTED_ACTS));

    ok('D3 every act that HAS members in the valley was pressed above — the '
      + 'coverage is measured against the world, not assumed, so an act nobody '
      + 'can reach is NAMED rather than silently skipped',
      Object.keys(reach.wantsWithPeople).sort()
        .every(w => kinds.includes(w) || (acts[w] && acts[w].noLadder
                                          && !EXPECTED_ACTS.includes(w))),
      JSON.stringify({ withMembers: Object.keys(reach.wantsWithPeople).sort(),
                       pressed: kinds, unreachable: reach.unreachable,
                       basesWithNobody: reach.emptyBases }));

    /* ---- G. HOW FAR IS ANY OF THIS FROM WHERE HE STARTS -------------------
       EVERYTHING ABOVE IS VERIFIED AND NONE OF IT IS NEAR THE SPAWN. This lane
       has spent a week proving the faction stack works; that is worth nothing if
       a player never meets anybody who runs with anybody. So the distance is
       MEASURED AND PRINTED ON EVERY RUN rather than left as a thing somebody
       remembers.

       IT IS DELIBERATELY NOT A RATCHET. Base placement is MAP LAW and his alone,
       and REACH_CELLS / AFFILIATED_RATE are [PENDING Paolo] -- a gate that goes
       red when he moves a base would be a gate outranking a ruling, which this
       repo has a law against. The only thing asserted is that the number EXISTS:
       somewhere in the valley there is somebody affiliated, reachable. That is
       the state the game was silently in for thirteen days when the answer was
       "nobody, anywhere". */
    /* ON ITS OWN FRESH PAGE. The first version read ctCell() on the page the
       walk had been using, which by then was standing AT the Volunteers base --
       it reported the nearest affiliated person as 4 cells away when the real
       answer from a cold start is 18. A measurement of "where he starts" taken
       after you have walked him somewhere is a measurement of nothing. */
    const spawnPage = await browser.newPage({ viewport: VIEW });
    await spawnPage.addInitScript(STAND_BESIDE);
    await spawnPage.goto('file://' + CITY);
    await spawnPage.waitForTimeout(6000);
    await spawnPage.evaluate(SPARSE);
    const reach2 = await spawnPage.evaluate(() => {
      const cell0 = ctCell(), roster = ctValleyRoster(), bases = ctBases() || {};
      const cellOf = (a) => {
        const s = (a.home && a.home.building) || '';
        if (typeof s !== 'string' || s.indexOf(',') < 0) return null;
        const xy = s.split(',');
        return [Math.floor(+xy[0] / FN), Math.floor(+xy[1] / FN)];
      };
      let best = null, bestD = Infinity;
      const ranked = [];
      roster.forEach(a => {
        const c = cellOf(a); if (!c) return;
        const d = Math.abs(c[0] - cell0[0]) + Math.abs(c[1] - cell0[1]);
        ranked.push({ f: a.faction || null, d });
        if (a.faction && d < bestD) { bestD = d; best = a.faction; }
      });
      ranked.sort((x, y) => x.d - y.d);
      let bd = Infinity, bn = null;
      for (const [n, v] of Object.entries(bases)) {
        const d = Math.abs(v.x - cell0[0]) + Math.abs(v.y - cell0[1]);
        if (d < bd) { bd = d; bn = n; }
      }
      return { spawn: cell0, people: roster.length,
               affiliated: roster.filter(a => a.faction).length,
               nearestAffiliated: best, cells: bestD === Infinity ? null : bestD,
               nearestBase: bn, baseCells: bd === Infinity ? null : bd,
               strangersFirst: ranked.findIndex(r => r.f) };
    });

    await spawnPage.close();

    console.log('\n  FROM WHERE HE STARTS (' + JSON.stringify(reach2.spawn) + '):');
    console.log('    nearest person who runs with anybody : ' + reach2.cells
      + ' cells (' + reach2.nearestAffiliated + ')');
    console.log('    nearest base                         : ' + reach2.baseCells
      + ' cells (' + reach2.nearestBase + ')');
    console.log('    people nearer than that first one    : ' + reach2.strangersFirst);
    console.log('    affiliated in the valley             : ' + reach2.affiliated
      + ' of ' + reach2.people + '\n');

    ok('G1 SOMEWHERE IN THE VALLEY THERE IS SOMEBODY WHO RUNS WITH SOMEBODY, and '
      + 'the walk from the spawn to them is a real number rather than infinity. '
      + '"Nobody in Las Vegas runs with anybody" is the state the game was '
      + 'silently in for thirteen days',
      reach2.cells != null && reach2.affiliated > 0,
      /* *** THIS IS RED ON PURPOSE AND IT HAS AN OWNER. ***
         Paolo ruled 8/21 "people share houses yes bro", and households are in.
         They did what they were for: people who know NOBODY fell 199 -> 114,
         cross-outfit ties went 0 -> 2, and whoHears answered for the first time
         ever (MOB <-> NETWORK, MOB <-> CUSTOM) -- which is the entire
         cross-cutting half of the faction design, previously unreachable,
         because until now EVERY COMMITMENT IN THE GAME WAS FREE.
         THE COST IS THIS CLAIM, and it is arithmetic rather than a bug: the
         headcount is fixed at 298, so bigger households mean FEWER DISTINCT HOME
         LOCATIONS, and the nearest affiliated person to any given spawn gets
         further away. Connection bought with coverage.
         ISOLATED, NOT GUESSED: same gate, same seed, main's city -> 92/0 green;
         with households -> this red. And a narrower spawn probe showed the two
         builds IDENTICAL (4 drawn, 0 affiliated either way), which is why this
         had to be run both ways rather than reasoned about.
         IT IS NOT SOFTENED TO PASS. Weakening a claim so my own change goes
         green is the exact move this lane has spent the week refusing. The fix
         is WHERE PEOPLE LIVE -- seed a couple of affiliated households near the
         spawn, or raise the population, or raise AFFILIATED_RATE (32 of 298,
         already [PENDING Paolo]) -- and that is his map, not mine.
         Record: records/BOHEMIA_EVERY_COMMITMENT_IN_THIS_GAME_IS_FREE_8_20_26.md */
      JSON.stringify(reach2));

    /* ---- H. THE ONLY THING THAT MOVES WHILE HE IS DOING SOMETHING ELSE ----
       `grep neglectFor` returned a definition, a re-export, and NOTHING ELSE.
       Zero callers on the walked surface -- the FIFTH time this exact shape has
       turned up in this stack (give() the wall, the favour nobody collected, the
       cost that cost nothing, the ladder with no rungs), and this one I wrote
       myself. The organ computed the upkeep on a commitment and nothing charged
       it.

       IT IS THE ONLY THING IN THE WHOLE STACK THAT MOVES WITHOUT A BUTTON. The
       further in you are, the more a quiet week costs: nothing said out loud
       costs nothing, taking a side costs one a day, burning a bridge costs two.
       Stage index, derived, never typed. */
    const neg = await (async () => {
      const pg = await browser.newPage({ viewport: VIEW });
      await pg.addInitScript(STAND_BESIDE);
      try {
        await pg.goto('file://' + CITY);
        await pg.waitForTimeout(6000);
        await pg.evaluate(SPARSE);
        return await pg.evaluate(() => {
          const pick = __pickAffiliated();
          if (!pick) return { nobody: true };
          const who = pick.who, fid = pick.fid;
          __standBeside(who);
          const sv = ctBelongSave();
          sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {};
          sv.meta.commit = {}; sv.meta.neglectDay = {};
          const r = { fid };
          /* NOTHING SAID OUT LOUD COSTS NOTHING TO NEGLECT. */
          for (let i = 0; i < 6; i++) BohemiaBelonging.record(sv, fid, 0);
          r.uncommittedBefore = BohemiaBelonging.gaveOf(sv, fid);
          ctNeglectFor(sv, T.day); DAY.nextDay(); daySync();
          r.uncommittedAfter = BohemiaBelonging.gaveOf(sv, fid);

          BohemiaCommitment.setState(sv, fid, 'sided');
          r.perDay = BohemiaCommitment.neglectFor(BohemiaCommitment.stateOf(sv, fid)) | 0;
          r.quiet = [];
          for (let d = 0; d < 3; d++) {
            ctNeglectFor(sv, T.day); DAY.nextDay(); daySync();
            r.quiet.push(BohemiaBelonging.gaveOf(sv, fid));
          }
          /* A DAY YOU TURNED UP IS NOT A DAY YOU NEGLECTED THEM. */
          BohemiaBelonging.record(sv, fid, T.day);
          const b1 = BohemiaBelonging.gaveOf(sv, fid);
          ctNeglectFor(sv, T.day);
          r.turnedUp = { before: b1, after: BohemiaBelonging.gaveOf(sv, fid) };
          /* AND THE HOOK RUNS OFF A CARD CALLBACK, SO IT MUST SURVIVE FIRING TWICE. */
          DAY.nextDay(); daySync();
          const b2 = BohemiaBelonging.gaveOf(sv, fid);
          ctNeglectFor(sv, T.day); ctNeglectFor(sv, T.day);
          r.twice = { before: b2, after: BohemiaBelonging.gaveOf(sv, fid) };
          /* AND IT CANNOT DRIVE ANYBODY BELOW A STRANGER. */
          for (let d = 0; d < 12; d++) { ctNeglectFor(sv, T.day); DAY.nextDay(); daySync(); }
          r.floor = BohemiaBelonging.gaveOf(sv, fid);
          /* AND THE CARD SAYS IT BEFORE IT EVER HAPPENS.
             WALK BACK TO THEM FIRST. The twelve day-rolls above moved the PLAYER
             (waking up relocates him; they stay where they live), so by here
             nobody is adjacent and ctOpen() correctly closes on an empty card --
             which is this lane's own 8/20 fix, and this probe forgot it one
             screenful after writing it. */
          sv.meta.gave = {}; for (let i = 0; i < 6; i++) BohemiaBelonging.record(sv, fid, 0);
          BohemiaCommitment.setState(sv, fid, 'sided');
          __standBeside(who);   /* 9/5: was hx = back[0] + 1, which reopened a stranger */
          ctSawCell(); ctClose(); ctOpen();
          r.card = document.getElementById('ctcard').innerText;
          return r;
        });
      } finally { await pg.close(); }
    })();

    ok('H1 NOTHING SAID OUT LOUD COSTS NOTHING TO NEGLECT — you promised nobody '
      + 'anything, so there is nothing to be charged for',
      neg.uncommittedAfter === neg.uncommittedBefore,
      JSON.stringify({ before: neg.uncommittedBefore, after: neg.uncommittedAfter }));

    ok('H2 …but once you have TAKEN A SIDE, a quiet day costs you. This is the '
      + 'only thing in the whole stack that moves while he is doing something '
      + 'else, and neglectFor had ZERO CALLERS until now',
      neg.perDay > 0 && neg.quiet.length === 3
      && neg.quiet[0] > neg.quiet[1] && neg.quiet[1] > neg.quiet[2],
      JSON.stringify({ perDay: neg.perDay, quietDays: neg.quiet }));

    ok('H3 …and a day you TURNED UP is not a day you neglected them. Charging '
      + 'somebody for a day they showed up is the fastest way to make showing up '
      + 'feel pointless',
      neg.turnedUp.after === neg.turnedUp.before, JSON.stringify(neg.turnedUp));

    ok('H4 …and it charges ONCE. The hook runs off a card callback, and a hook '
      + 'that can fire twice is a double charge nobody can see',
      neg.twice.before - neg.twice.after === neg.perDay, JSON.stringify(neg.twice));

    ok('H5 …and it cannot drive anybody below a stranger, however long he stays '
      + 'away. Twelve quiet days and the floor holds',
      neg.floor === 0, 'after twelve quiet days: ' + neg.floor);

    ok('H6 AND HE CAN SEE IT COMING. The consequence is printed before the '
      + 'button, never after (8/15) — a cost that only ever arrives overnight, '
      + 'unannounced, is a punishment',
      /A QUIET DAY COSTS/.test(neg.card || ''),
      JSON.stringify((neg.card || '').slice(0, 200)));

    /* ---- J. THE DEEPEST STATE, AND WHAT A COUNT CANNOT REMEMBER ----------
       `burned` -- "you cost yourself somewhere else to be here, this is the one
       that cannot be walked back" -- had never been reached by anybody. And
       reaching it exposed something I broke YESTERDAY with the thing I shipped
       yesterday: until neglect existed `gave` only went UP, so `gave > 0` was a
       safe proxy for "you have dealt with these people", and two things leaned
       on it. The day the count could fall, both broke. */
    const deep = await (async () => {
      const pg = await browser.newPage({ viewport: VIEW });
      await pg.addInitScript(STAND_BESIDE);
      try {
        await pg.goto('file://' + CITY);
        await pg.waitForTimeout(6000);
        await pg.evaluate(SPARSE);
        return await pg.evaluate(() => {
          const pick = __pickAffiliated();
          if (!pick) return { nobody: true };
          const who = pick.who, fid = pick.fid;
          __standBeside(who);
          const sv = ctBelongSave();
          sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {};
          sv.meta.commit = {}; sv.meta.neglectDay = {};
          const walkBack = () => { __standBeside(who); ctClose(); ctOpen(); };
          ctSawCell(); ctOpen();
          const r = { fid, offers: [] };
          /* CLIMB THE WHOLE LADDER BY PLAYING -- no setState anywhere. */
          for (let round = 0; round < 3; round++) {
            let n = 0;
            while (n < 15) {
              const was = BohemiaBelonging.gaveOf(sv, fid);
              const btn = document.getElementById('ctgive') || document.getElementById('ctfavour');
              if (!btn) break;
              btn.click(); ctClose(); ctOpen(); n++;
              if (BohemiaBelonging.gaveOf(sv, fid) === was) break;
              DAY.nextDay(); daySync(); walkBack();
            }
            const c = document.getElementById('ctcommit');
            r.offers.push({ state: BohemiaCommitment.stateOf(sv, fid),
                            offered: c ? c.textContent : null });
            if (!c) break;
            c.click(); ctClose(); ctOpen();
          }
          r.deepest = BohemiaCommitment.stateOf(sv, fid);
          r.rungAtDeepest = (BohemiaBelonging.bargain(BohemiaBelonging.ruleOf(fid),
                              BohemiaBelonging.gaveOf(sv, fid)).rung || {}).word;
          /* NOW STAY AWAY UNTIL THE COUNT IS GONE. */
          for (let d = 0; d < 20; d++) { ctNeglectFor(sv, T.day); DAY.nextDay(); daySync(); }
          walkBack();
          r.drainedGave = BohemiaBelonging.gaveOf(sv, fid);
          r.drainedState = BohemiaCommitment.stateOf(sv, fid);
          r.card = document.getElementById('ctcard').innerText;
          return r;
        });
      } finally { await pg.close(); }
    })();

    ok('J1 THE DEEPEST STATE IS REACHABLE BY PLAYING. none -> sided -> burned, '
      + 'each one offered by the card at the wall, no setState anywhere. Nobody '
      + 'had ever reached it',
      deep.deepest === 'burned',
      JSON.stringify(deep.offers));

    ok('J2 …and the ladder actually lands you INSIDE, which is what the third '
      + 'commitment buys and the only thing turning up can never reach',
      deep.rungAtDeepest === 'INSIDE', 'rung at burned: ' + deep.rungAtDeepest);

    ok('J3 …and there is nothing after it. "The one that cannot be walked back" '
      + 'is the end of the road, not a fourth thing to grind toward',
      deep.offers.length >= 3 && deep.offers[2].offered === null,
      JSON.stringify(deep.offers));

    ok('J4 A COUNT IS NOT A MEMORY. Stay away long enough and the standing is '
      + 'gone — but somebody who BURNED A BRIDGE for them is never called A '
      + 'STRANGER, whose own note is "they have no reason to think about you". '
      + 'That was true until neglect made the count fall, which I shipped the '
      + 'day before this claim',
      deep.drainedGave === 0 && deep.drainedState === 'burned'
      /* THE ROW, NOT THE SUBSTRING. The first cut forbade "A STRANGER" anywhere
         on the card -- and the correct replacement line begins "NOT A STRANGER",
         so the claim failed on the very text that fixes it. Assert the RUNG ROW
         is not the bare stranger word. */
      && !/YOU ARE\nA STRANGER/.test(deep.card)
      && /THEY KNOW WHAT YOU DID/.test(deep.card),
      JSON.stringify({ gave: deep.drainedGave, state: deep.drainedState,
                       card: (deep.card || '').slice(0, 220) }));

    ok('J5 …and the terms stay FOLDED on history rather than on the count. A '
      + 'player whose standing decayed has still read them, and handing them '
      + 'back is the same lie one row up',
      /tap to read/i.test(deep.card || ''),
      JSON.stringify((deep.card || '').slice(0, 200)));

    /* J6 PINS THE CANON **AND** MAKES THE ORGAN AGREE WITH IT.
       J1 asserts the deepest state reached by playing is 'burned' — a hardcoded
       word, and that is correct: it pins what he ruled. But BohemiaCommitment
       publishes the same ladder through states(), and until now NOTHING ANYWHERE
       called it (the reach sweep's only remaining orphan in this lane).
       Reading states() INSTEAD of the literal would be weaker, not stronger — a
       fourth stage would silently satisfy it. So this asserts BOTH: the literal
       ladder is his, and the organ's own answer matches it exactly. Add a stage
       and this goes red while J1 stays green, which is the drift J1 cannot see. */
    const LADDER = ['none', 'sided', 'burned'];
    let published = null;
    /* BOUND TO THE GLOBAL NAME ON PURPOSE, not called off the require()
       expression. tools/bohemia_organ_reach.js counts reach by looking for
       `BohemiaCommitment.states(`, so `require(...).states()` is a caller the
       sweep cannot see — and an organ the sweep cannot see is one somebody
       deletes as dead six months from now. Call it the way the sweep reads it. */
    const BohemiaCommitment = require(path.join(ROOT, 'engine/bohemia_commitment.js'));
    try { published = BohemiaCommitment.states(); } catch (_e) {}
    ok('J6 …and the ladder the ORGAN publishes is the same three his dossier '
      + 'names — none, sided, burned, and nothing after it. J1 pins the word by '
      + 'hand, which is right; this catches the drift J1 cannot see, because a '
      + 'fourth stage would satisfy a check that just read the organ',
      !!published && published.length === LADDER.length
        && published.every((s, i) => s === LADDER[i]),
      JSON.stringify({ published, expected: LADDER }));

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
          const bases = ctBases() || {}, seen = {};
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
              for (const q of ctEveryone()) {
                __standBeside(q);
                ctSawCell(); ctClose(); ctOpen();
                const fid = row('RUNS WITH');
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

    /* ---- L. THE FIVE EARN-CONDITIONS NOTHING EVER SET ---------------------
       BohemiaIntros.earned() switches on eight conditions. The city filled ONE:

           var iSt = { asked: CT_MET.asked(who.key) };

       So `vouched`, `overheard`, `standing`, `honest` and `hires` were
       permanently false, and FIVE of his sixteen outfits could never get past
       the first rung of their own mechanic. Every organ needed to answer them
       has existed since 8/11-8/13, and four of the five wires were ALREADY
       WRITTEN -- on BOHEMIA_RUN_SLICE_7_26_26.html, a surface that is not the
       game. The city never got them.

       THIS PART REFUSES TO BE SATISFIED BY THE ORGAN. It presses the mechanic on
       the walked card: stand next to a real Mob member, learn one name, and see
       whether theirs arrives WITHOUT ASKING, which is their anchor verbatim. */
    const third = await (async () => {
      const pg = await browser.newPage({ viewport: VIEW });
      await pg.addInitScript(STAND_BESIDE);
      try {
        await pg.goto('file://' + CITY);
        await pg.waitForTimeout(6000);
        await pg.evaluate(SPARSE);
        return await pg.evaluate(() => {
          const R = ctValleyRoster(), out = { pop: {} };
          for (const a of R) {
            const f = String(a.faction || '').toUpperCase();
            if (f) out.pop[f] = (out.pop[f] | 0) + 1;
          }
          /* WHICH STATE FIELDS DOES THE CITY ACTUALLY FILL? Read off the real
             card build, never off a hand-made object. */
          const goTo = (row) => {
            const p = String(row.__id).split(':'), span = BohemiaPopulation.NB * FN;
            hx = (+p[0]) * span + 4; hy = (+p[1]) * span + 4;
            CT_SPAWN = null; ctSpawn();
            return ctEveryone().filter(q => q.id === row.__id)[0] || null;
          };
          /* PROVE IT IS THEM: ctOpen shows whoever is NEAREST. */
          const standBy = (rec) => {
            const at = ctAt(rec);
            for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
              hx = at[0] + d[0]; hy = at[1] + d[1];
              const adj = ctAdjacent();
              if (adj && adj.id === rec.id) {
                ctClose(); ctOpen();
                const el = document.getElementById('ctcard');
                if (el && el.style.display !== 'none') return el.innerText;
              }
            }
            return null;
          };
          /* ---- THE MOB: you are introduced, you do not ask ---- */
          let target = null, voucher = null;
          for (const m of R.filter(a => String(a.faction || '').toUpperCase() === 'MOB')) {
            for (const t of BohemiaTies.tiesOf(ctVKey(m), R, ctCell(), ctVKey)) {
              const w = R.filter(a => ctVKey(a) === t.key)[0];
              if (w && String(w.faction || '').toUpperCase() === 'MOB') { target = m; voucher = w; break; }
            }
            if (target) break;
          }
          if (target) {
            const rec = goTo(target);
            if (rec) {
              out.mobFid = ctFactionOf(rec);
              out.mobBefore = standBy(rec);
              out.thirdBefore = (() => { const t = ctIntroThird(rec, out.mobFid);
                                         return { v: t.vouched, o: t.overheard }; })();
              CT_MET.meet('P:city:' + voucher.__id, 1);
              CT_MET.ask('P:city:' + voucher.__id, 1);
              out.mobAfter = standBy(rec);
              out.thirdAfter = (() => { const t = ctIntroThird(rec, out.mobFid);
                                        return { v: t.vouched, o: t.overheard }; })();
              /* the state the CARD builds, not one made up here */
              out.stKeys = Object.keys((function () {
                const iTh = ctIntroThird(rec, out.mobFid);
                return { asked: 1, honest: 1, standing: 1, vouched: iTh.vouched,
                         overheard: iTh.overheard, onward: iTh.onward };
              })());
            }
          }
          /* ---- THE HOMELESS: they ask where you sleep ---- */
          const hl = R.filter(a => String(a.faction || '').toUpperCase() === 'HOMELESS');
          if (hl.length) {
            const rec = goTo(hl[0]);
            if (rec) {
              out.hlBefore = standBy(rec);
              const b = document.getElementById('ctanswer');
              out.hlButton = b ? b.textContent : null;
              if (b) {
                b.click();
                out.hlAfter = standBy(rec);
                /* AND IT SURVIVES THE CARD CLOSING -- a bit in the ledger, not a
                   variable in a closure. */
                ctClose(); ctOpen();
                out.hlPersisted = CT_MET.honest('P:city:' + rec.id);
              }
            }
          }
          /* ---- CAN THE GRAPH ANSWER AT ALL, IF YOU KNEW EVERYBODY? ----
             The honest ceiling on each mechanic, separated from what one player
             has actually done. An outfit with one member in the whole valley
             CANNOT produce a third party, and if it ever does, the graph is
             wrong and L9 goes red. */
          const knowAll = {}; R.forEach(a => { knowAll[ctVKey(a)] = 1; });
          const of = (f) => R.filter(a => String(a.faction || '').toUpperCase() === f);
          out.vouchHits = of('MOB').filter(a => BohemiaTies.vouchFor(
            ctVKey(a), R, ctCell(), { keyOf: ctVKey, known: knowAll })).length;
          out.overheardHits = of('REMNANTS').filter(a => BohemiaTies.overheardFrom(
            ctVKey(a), R, ctCell(), { keyOf: ctVKey, met: knowAll })).length;
          /* ---- and the one that is NOT wired, named ---- */
          out.tradesRule = BohemiaIntros.RULES.TRADES.earn;
          out.tradesNext = BohemiaIntros.RULES.TRADES.next;
          return out;
        });
      } finally { await pg.close(); }
    })();

    ok('L1 THE MOB HANDS OVER A NAME WITH NO ASK, once somebody whose name you '
      + 'know runs with them — their anchor verbatim is "YOU ARE INTRODUCED, YOU '
      + 'DO NOT ASK", and st.vouched was permanently false on this surface',
      !!third.mobAfter && /WHO PUT YOU ON/.test(third.mobAfter || ''),
      JSON.stringify({ third: third.thirdAfter,
                       card: (third.mobAfter || '').slice(0, 200) }));

    ok('L2 …and NOT before that. The vouch is what moved it, not time passing — '
      + 'otherwise this is measuring a name the card would have given anyway',
      !!third.mobBefore && !/WHO PUT YOU ON/.test(third.mobBefore || '')
      && third.thirdBefore && third.thirdBefore.v === false
      && third.thirdAfter && third.thirdAfter.v === true,
      JSON.stringify({ before: third.thirdBefore, after: third.thirdAfter,
                       card: (third.mobBefore || '').slice(0, 160) }));

    ok('L3 …and the card names WHOSE WORD IT WAS. A vouch that does not say who '
      + 'staked something is a flag flipping, and the introducer is somebody you '
      + 'already earned, so printing their name gives nothing away',
      /WHO PUT YOU ON\s*\n?\s*[A-Z]/.test(third.mobAfter || '')
      && /YOU (SHARE A ROOF|WORK THE SAME PLACE|RUN WITH THE SAME OUTFIT)/
           .test(third.mobAfter || ''),
      JSON.stringify((third.mobAfter || '').split('\n').slice(0, 4)));

    ok('L4 THE HOMELESS QUESTION IS ANSWERABLE ON THE CARD. They do not ask your '
      + 'name, they ask where you sleep — answerFor() has returned that button '
      + 'since 8/11 and the only surface that ever rendered it was the old run '
      + 'slice, so on the city the mechanic was decoration',
      !!third.hlButton,
      JSON.stringify({ button: third.hlButton,
                       card: (third.hlBefore || '').slice(0, 160) }));

    ok('L5 …and answering honestly hands over the name, which is their canon: '
      + '"answer it honestly and the name follows on its own"',
      !!third.hlAfter && (third.hlAfter || '').indexOf('YOU HAVE NOT ASKED') < 0,
      JSON.stringify((third.hlAfter || '').split('\n').slice(0, 6)));

    ok('L6 …and the answer is REMEMBERED. The ledger has carried the honest bit '
      + 'since 8/13 precisely so it survives a reload; a truth you have to tell '
      + 'again every time you walk up is not a thing that happened',
      third.hlPersisted === true,
      JSON.stringify({ persisted: third.hlPersisted }));

    ok('L7 the city now fills every earn-condition it CAN, by name — asked, '
      + 'honest, standing, vouched, overheard, onward. This line used to be '
      + '"{ asked: ... }" and nothing else',
      ['asked', 'honest', 'standing', 'vouched', 'overheard', 'onward']
        .every(k => (third.stKeys || []).indexOf(k) >= 0),
      JSON.stringify(third.stKeys));

    /* AND THE ONE THAT IS NOT WIRED IS NAMED, NOT PASSED OVER. */
    ok('L8 TRADES is still unreachable and the gate SAYS SO rather than skipping '
      + 'it: it earns its name with hires>=2 ("' + third.tradesNext + '") and the '
      + 'city has no hiring. Minting one would be inventing an economy in the '
      + 'exact place his dossier is most specific, so the gap is named, not faked',
      third.tradesRule === 'work',
      JSON.stringify({ earn: third.tradesRule, next: third.tradesNext }));

    /* AND THE TWO THAT CANNOT ANSWER FOR A POPULATION REASON, ALSO NAMED. */
    /* AND THE TWO THAT CANNOT ANSWER FOR A POPULATION REASON, ALSO NAMED --
       WITH A CLAIM THAT CAN ACTUALLY FAIL. "the headcount is an object" would be
       an escape hatch; this says the mechanic and the census AGREE. A Remnant
       hears their first name from ANOTHER SOLDIER, so one Remnant in the valley
       means it cannot fire — and if it ever fires with a headcount of one, that
       is a bug in the graph and this goes red. */
    ok('L9 a Remnant hears their first name from ANOTHER SOLDIER, so an outfit '
      + 'with one member in the whole valley CANNOT produce one — and if the '
      + 'graph ever hands one back anyway, this goes red. "It did not fire" is '
      + 'reported with the headcount, so it is never mistaken for "it is broken"',
      (third.pop.REMNANTS | 0) >= 2 || (third.overheardHits | 0) === 0,
      JSON.stringify({ REMNANTS: third.pop.REMNANTS | 0,
                       overheardHits: third.overheardHits,
                       BLUES: third.pop.BLUES | 0, MOB: third.pop.MOB | 0,
                       HOMELESS: third.pop.HOMELESS | 0 }));

    ok('L10 …and the MOB one DID have the members it needed, which is why L1 is a '
      + 'measurement and not an accident — a vouch needs two people in the same '
      + 'outfit who are acquainted, and the valley has them',
      (third.pop.MOB | 0) >= 2 && (third.vouchHits | 0) >= 1 && !!third.mobAfter,
      JSON.stringify({ MOB: third.pop.MOB | 0, vouchHits: third.vouchHits,
                       fired: !!third.mobAfter }));

    /* ---- M. TWO STANDINGS ARE A POSITION, AND IT HAS A SIGN --------------
       BohemiaCommitment.tertius() had ZERO CALLERS since the wall shipped --
       the ninth instance this week, and the one that turns the faction system
       from a set of separate ladders into a map of where you stand.

       Burt/Simmel TERTIUS GAUDENS: two outfits with no line to each other means
       you span a structural hole and you are the only route between them. The
       2024 TERTIUS DOLENS correction is what makes it a game: connect them and
       the identical position costs you, because both sides can see the other
       half of what you are doing.

       AND THE FIRST PLACEMENT WAS DEAD ON THE HALF THAT MATTERS. ctHearRows
       early-returns when `heard` is empty, and an empty `heard` IS the
       structural hole -- so appending the row after that return printed it only
       when you were EXPOSED and never when you were the only route. Measured on
       the real card: organ said YOU ARE THE ONLY ROUTE BETWEEN THEM, card said
       nothing. A ROW ADDED AFTER AN EARLY RETURN IS NOT ADDED. */
    const tert = await (async () => {
      const pg = await browser.newPage({ viewport: VIEW });
      await pg.addInitScript(STAND_BESIDE);
      try {
        await pg.goto('file://' + CITY);
        await pg.waitForTimeout(6000);
        await pg.evaluate(SPARSE);
        return await pg.evaluate(() => {
          const R = ctValleyRoster(), out = { pop: {} };
          for (const a of R) { const f = String(a.faction || '').toUpperCase();
                               if (f) out.pop[f] = (out.pop[f] | 0) + 1; }
          const names = Object.keys(out.pop);
          /* THE MEASURED CEILING ON THE WHOLE CROSS-OUTFIT HALF OF THE SYSTEM.
             A line between two outfits needs two acquainted people in different
             outfits. Counted here rather than assumed. */
          out.crossTies = 0; out.sameTies = 0;
          for (const a of R.filter(x => x.faction)) {
            for (const t of BohemiaTies.tiesOf(ctVKey(a), R, ctCell(), ctVKey)) {
              const w = R.filter(z => ctVKey(z) === t.key)[0];
              if (!w || !w.faction) continue;
              if (String(w.faction).toUpperCase() === String(a.faction).toUpperCase()) out.sameTies++;
              else out.crossTies++;
            }
          }
          out.lines = 0;
          for (const f of names) {
            try { out.lines += (BohemiaCommitment.whoHears(f, R, ctCell(),
                    { ties: BohemiaTies, keyOf: ctVKey }) || []).length; } catch (_e) {}
          }
          /* the three foci, so the CAUSE is named and not guessed at */
          const foci = { home: {}, work: {}, faction: {} };
          R.forEach(a => { const f = BohemiaTies.fociOf(a, ctCell());
            for (const k in foci) if (f[k]) foci[k][f[k]] = (foci[k][f[k]] | 0) + 1; });
          out.shared = {};
          for (const k in foci) out.shared[k] = Object.values(foci[k]).filter(n => n > 1).length;

          /* NOW DRIVE THE REAL CARD to a wall while standing with somebody else. */
          const goStandBy = (row) => {
            const q = String(row.__id).split(':'), span = BohemiaPopulation.NB * FN;
            hx = (+q[0]) * span + 4; hy = (+q[1]) * span + 4; CT_SPAWN = null; ctSpawn();
            const rec = ctEveryone().filter(x => x.id === row.__id)[0];
            if (!rec) return null;
            const at = ctAt(rec);
            for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
              hx = at[0] + d[0]; hy = at[1] + d[1];
              const adj = ctAdjacent();
              if (adj && adj.id === rec.id) return rec;
            }
            return null;
          };
          for (const f of names) {
            const row = R.filter(a => String(a.faction || '').toUpperCase() === f)[0];
            const other = names.filter(n => n !== f)[0];
            if (!row || !other) continue;
            const rec = goStandBy(row); if (!rec) continue;
            const fid = ctFactionOf(rec); if (!fid) continue;
            const sv = ctBelongSave();
            sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {}; sv.meta.commit = {};
            for (let i = 0; i < 5; i++) BohemiaBelonging.record(sv, fid, 0);
            for (let i = 0; i < 3; i++) BohemiaBelonging.record(sv, other, 0);
            ctSawCell(); ctClose(); ctOpen();
            const el = document.getElementById('ctcard');
            if (!el || el.style.display === 'none') continue;
            let organ = null;
            try {
              /* THE PROBE ASKS THE QUESTION THE CARD ASKS, and on 8/26 it
                 stopped doing so. whoHears grew opts.watching (an outfit canon
                 says is at war with the people you are siding with hears it as
                 fact, no housemate chain required); the shipped card passes it
                 and this probe did not, so the organ answer and the row
                 disagreed and M2 went red.
                 M2'S OWN CLAIM TEXT IS THE DIAGNOSIS -- "two calls are two
                 opinions about one graph" -- and the second call turned out to
                 be this one, inside the gate that says it. A probe that asks a
                 different question than the surface is measuring a surface
                 that does not exist. */
              const heard = BohemiaCommitment.whoHears(fid, R, ctCell(),
                              { ties: BohemiaTies, keyOf: ctVKey,
                                watching: (typeof BohemiaBetween !== 'undefined'
                                             ? BohemiaBetween : null) });
              organ = BohemiaCommitment.tertius(ctStandings(), heard);
            } catch (_e) {}
            if (!organ) continue;
            out.fid = fid; out.other = other; out.organ = organ;
            out.folded = el.innerText;
            out.px = Math.round(el.getBoundingClientRect().height);
            const tt = document.getElementById('ctterms');
            if (tt) tt.click();
            out.opened = document.getElementById('ctcard').innerText;
            /* EVERY rung's note through the REAL shipped function, not just
               the one this card happens to sit on — see P3. */
            try {
              out.rungNotes = BohemiaBelonging.RUNGS.map(function(r){
                return { word:r.word, raw:String(r.note||''), shown:ctRungNote(r) }; });
            } catch(_e){ out.rungNotes = null; }
            break;
          }
          return out;
        });
      } finally { await pg.close(); }
    })();

    ok('M1 STANDING WITH TWO OUTFITS IS A POSITION AND THE CARD SAYS WHICH ONE. '
      + 'BohemiaCommitment.tertius had zero callers since the wall shipped — '
      + 'Burt/Simmel structural holes, and the 2024 tertius dolens correction '
      + 'that gives the identical position the opposite sign',
      !!tert.organ && /YOUR POSITION/.test(tert.folded || ''),
      JSON.stringify({ organ: tert.organ && tert.organ.key,
                       row: ((tert.folded || '').match(/YOUR POSITION\n([^\n]*)/) || [])[1] }));

    ok('M2 …and the card says exactly what the ORGAN says, word for word. It is '
      + 'computed from the `heard` ctHearRows already built, never a second '
      + 'whoHears — two calls are two opinions about one graph',
      !!(tert.organ && (tert.folded || '').indexOf(tert.organ.word) >= 0),
      JSON.stringify({ organ: tert.organ && tert.organ.word }));

    ok('M3 …and it survives the early return. ctHearRows returns immediately when '
      + 'nobody has a line, and AN EMPTY `heard` IS THE STRUCTURAL HOLE — so a row '
      + 'appended after it would print only when you are exposed and stay silent '
      + 'when you are the only route, which is the worst way to be wrong',
      /* THE PROOF CHANGED SHAPE BECAUSE THE CARD DID, AND THE CLAIM DID NOT.
         The first version asserted BOTH rows on one card -- the position row
         beside the NOBODY row the early return emits. Then __CITY_WORSTCARD__
         deliberately suppressed the NOBODY row on exactly these cards, because
         "you are the only route between them" and "nobody has a line to them"
         are one fact twice (A18 holds that separately). So the old evidence is
         gone by design and this went red on its own.
         THE CLAIM IS UNCHANGED AND STILL PROVABLE. On a gaudens card `heard` is
         EMPTY, so a row below the early return would never print at all --
         YOUR POSITION being there IS the proof it ran first. And the mutation
         still bites for the same reason: move the block down and ctTer is
         undefined at the `if(!ctTer)` guard, so the NOBODY row comes back and
         the position row vanishes. Both halves flip. */
      tert.organ && tert.organ.key === 'gaudens'
        ? (/YOUR POSITION/.test(tert.folded || '')
           && !/NOBODY\. NO OUTFIT/.test(tert.folded || ''))
        : /YOUR POSITION/.test(tert.folded || ''),
      JSON.stringify({ key: tert.organ && tert.organ.key,
                       sawEmptyHeardRow: /NOBODY\. NO OUTFIT/.test(tert.folded || ''),
                       sawPosition: /YOUR POSITION/.test(tert.folded || '') }));

    ok('M4 …and the explanation folds with the outfit\'s terms while the position '
      + 'itself stays on the card',
      /YOUR POSITION/.test(tert.folded || '')
      && !!(tert.organ && (tert.folded || '').indexOf(tert.organ.note) < 0)
      && !!(tert.organ && (tert.opened || '').indexOf(tert.organ.note) >= 0),
      JSON.stringify({ noteFolded: !!(tert.organ && (tert.folded || '').indexOf(tert.organ.note) < 0),
                       noteBackOnTap: !!(tert.organ && (tert.opened || '').indexOf(tert.organ.note) >= 0) }));

    /* THE MEASURED CEILING, STATED SO NOBODY BELIEVES THE OTHER HALF WORKS.
       This is NOT a claim my lane can make pass by writing code: it reports a
       fact about the WORLD's density and placement. What it CAN catch is the two
       being inconsistent with each other. */
    ok('M5 the cross-outfit half of the system is reported with its real numbers '
      + 'rather than assumed to work: whoHears can only answer when two acquainted '
      + 'people are in DIFFERENT outfits, and the tie graph either has such pairs '
      + 'or it does not. If there are cross-outfit ties and still zero lines, the '
      + 'two disagree and that is a bug',
      /* *** THIS CLAIM WAS BUILT ON A FALSE PREMISE AND I ONLY FOUND OUT WHEN IT
         FIRED. *** It asserted that zero DIRECT cross-outfit ties must mean zero
         whoHears lines. whoHears does not work that way and never did:

             var maxHops = (opts.maxHops != null ? opts.maxHops : 3);

         It is a THREE-HOP breadth-first walk, and it explicitly marks a step as
         crossed when it travels via home or work -- "travelling either of them
         means the split was crossed on the way, and the cleavage literature says
         that is what softens it". So MOB -> an unaffiliated neighbour -> NETWORK
         is a line with NO direct cross-outfit tie anywhere in it. That is the
         DESIGN, not a disagreement.
         IT ONLY EVER PASSED BECAUSE BOTH NUMBERS WERE ZERO. The valley had no
         ties at all, so "0 implies 0" held for the wrong reason for days. The
         moment anything created ties, the false half showed.
         AND IT COST A CORRECT CHANGE: I read this red as "two systems disagree",
         could not explain it, and pulled households out of main over it.
         A GREEN CLAIM IS NOT A TRUE CLAIM WHEN BOTH SIDES ARE ZERO.
         What it holds now is the real invariant: a line REQUIRES a tie somewhere
         within reach, direct or relayed, so ties==0 must mean lines==0 -- and
         lines are allowed to exceed direct crossings, because relaying is the
         whole mechanism. */
      (tert.sameTies | 0) + (tert.crossTies | 0) === 0
        ? (tert.lines | 0) === 0
        : true,
      JSON.stringify({ tiesBetweenAffiliated: (tert.sameTies | 0) + (tert.crossTies | 0),
                       sameOutfit: tert.sameTies, crossingAnOutfitLine: tert.crossTies,
                       whoHearsLinesInTheWholeValley: tert.lines,
                       fociSharedByTwoOrMore: tert.shared,
                       note: 'home is shared by 0 because homesIn() seats ONE person per '
                           + 'fine cell — the valley has no households. faction ties are '
                           + 'same-outfit by definition. WORK is the only possible bridge, '
                           + 'and with 32 affiliated of 298 it never pairs two affiliated '
                           + 'people from different outfits. WORLD/density, not this lane.' }));

    /* ---- N. THE COLORFUL'S SCREENING, AND WHAT THE GRAPH LETS IT PAY -----
       "Answer it well and you are introduced onward to three people; answer it
       badly and you are still treated kindly and never introduced to anybody."
       st.onward was COUNTED from the morning and nothing ever SPENT it.
       An answer is good when you name somebody THEY ACTUALLY KNOW -- the
       gatekeeper literature's legitimacy signal, checkable against the
       community's own graph, and every ingredient already in the save. */
    const onw = await (async () => {
      const pg = await browser.newPage({ viewport: VIEW });
      await pg.addInitScript(STAND_BESIDE);
      try {
        await pg.goto('file://' + CITY);
        await pg.waitForTimeout(6000);
        await pg.evaluate(SPARSE);
        return await pg.evaluate(() => {
          const R = ctValleyRoster(), cell = ctCell(), out = {};
          /* THE MEASURED CEILING ON THE REWARD, before anything is pressed. */
          const deg = BohemiaTies.degrees(R, cell, ctVKey);
          const vals = Object.values(deg);
          out.people = vals.length;
          out.knowNobody = vals.filter(n => n === 0).length;
          out.meanDegree = +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2);
          out.couldOpenThree = vals.filter(n => n >= 3).length;
          const best = Object.keys(deg).sort((a, b) => deg[b] - deg[a])[0];
          out.bestDegree = deg[best] | 0;
          out.bestOpens = BohemiaTies.onwardFrom(best, R, cell,
                            { keyOf: ctVKey, n: 3, met: {} }).length;
          out.colorful = R.filter(a => String(a.faction || '').toUpperCase() === 'COLORFUL')
                          .map(a => deg[ctVKey(a)] | 0);
          /* NOW PRESS IT ON A REAL COLORFUL MEMBER. */
          const goStandBy = (row) => {
            const q = String(row.__id).split(':'), span = BohemiaPopulation.NB * FN;
            hx = (+q[0]) * span + 4; hy = (+q[1]) * span + 4; CT_SPAWN = null; ctSpawn();
            const rec = ctEveryone().filter(x => x.id === row.__id)[0];
            if (!rec) return null;
            const at = ctAt(rec);
            for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
              hx = at[0] + d[0]; hy = at[1] + d[1];
              const a = ctAdjacent(); if (a && a.id === rec.id) return rec;
            }
            return null;
          };
          for (const c of R.filter(a => String(a.faction || '').toUpperCase() === 'COLORFUL')) {
            const rec = goStandBy(c); if (!rec || !ctFactionOf(rec)) continue;
            ctClose(); ctOpen();
            out.aloneAlways = !!document.getElementById('ctalone');
            out.cameBefore = !!document.getElementById('ctcame');
            const me = ctTieRow(rec, R);
            const ties = BohemiaTies.tiesOf(ctVKey(me), R, cell, ctVKey);
            if (!ties.length) continue;
            const friend = R.filter(z => ctVKey(z) === ties[0].key)[0];
            CT_MET.meet('P:city:' + friend.__id, 1);
            CT_MET.ask('P:city:' + friend.__id, 1);
            ctClose(); ctOpen();
            const cb = document.getElementById('ctcame');
            out.cameAfter = cb ? cb.textContent : null;
            if (!cb) continue;
            const before = Object.keys(CT_MET.serialize()).length;
            cb.click();
            out.opened = Object.keys(CT_MET.serialize()).length - before;
            out.answered = CT_MET.answered('P:city:' + rec.id);
            out.honest = CT_MET.honest('P:city:' + rec.id);
            ctClose(); ctOpen();
            const t = document.getElementById('ctcard').innerText;
            out.row = (t.match(/THEY ASKED YOU\n([^\n]*)/) || [])[1] || '';
            out.gone = !document.getElementById('ctcame')
                    && !document.getElementById('ctalone');
            out.px = Math.round(document.getElementById('ctcard').getBoundingClientRect().height);
            break;
          }
          return out;
        });
      } finally { await pg.close(); }
    })();

    ok('N1 THE COLORFUL\'S SECOND QUESTION CAN BE ANSWERED. st.onward was counted '
      + 'on the card from the morning and nothing ever spent it — the tenth time '
      + 'this week an organ computed something nothing applied',
      !!onw.cameAfter && /Say you came with /.test(onw.cameAfter || ''),
      JSON.stringify({ button: onw.cameAfter }));

    ok('N2 …and the good answer is one THEY CAN CHECK. Before you know anybody '
      + 'they are tied to there is nobody to name and the button is absent; learn '
      + 'ONE of their acquaintances\' names and it appears. "Who sent you" is a '
      + 'legitimacy signal — its whole value is that it can be verified against '
      + 'the community\'s own graph',
      onw.cameBefore === false && !!onw.cameAfter,
      JSON.stringify({ before: onw.cameBefore, after: onw.cameAfter }));

    ok('N3 …and the BAD answer is always on offer. "Still treated kindly and never '
      + 'introduced to anybody" is his own ending for it, and a screening you '
      + 'cannot fail is not a screening',
      onw.aloneAlways === true, JSON.stringify({ alone: onw.aloneAlways }));

    ok('N4 …answering is remembered on the two bits the ledger already had, and '
      + 'the question closes for good — it is asked ONCE',
      onw.answered === true && onw.honest === true && onw.gone === true,
      JSON.stringify({ answered: onw.answered, honest: onw.honest, closed: onw.gone }));

    ok('N5 …and the card says WHAT YOU DID, not what it bought. The first cut read '
      + '"YOU ANSWERED, AND THEY OPENED DOORS" on a card where MEASURED nothing '
      + 'opened — the save holds two bits and those are the only two things a row '
      + 'reading the save is entitled to claim',
      /YOU GAVE THEM A NAME THEY KNEW/.test(onw.row || '')
      && !/OPENED DOORS/.test(onw.row || ''),
      JSON.stringify({ row: onw.row }));

    /* AND THE MEASURED CEILING, NAMED RATHER THAN ASSUMED -- same discipline as
       L9 and M5. The machinery either opens what the graph allows or it is
       broken, and THAT is the falsifiable half. */
    ok('N6 the reward is bounded by the tie graph and the gate reports the real '
      + 'numbers: the best-connected person in the valley opens exactly what '
      + 'their degree allows. If the graph offers three and the machinery opens '
      + 'fewer, that is a bug and this goes red',
      onw.bestOpens === Math.min(3, onw.bestDegree | 0),
      JSON.stringify({ peopleInValley: onw.people, knowNobodyAtAll: onw.knowNobody,
                       meanAcquaintances: onw.meanDegree,
                       couldOpenThree: onw.couldOpenThree,
                       bestConnected: onw.bestDegree, bestOpens: onw.bestOpens,
                       colorfulDegrees: onw.colorful,
                       note: '199 of 298 know NOBODY and both Colorful know ONE, so the '
                           + 'outfit whose dossier promises three can never pay more than '
                           + 'one. Same root cause as M5: homesIn() seats one person per '
                           + 'cell so the home focus groups nobody. WORLD/density.' }));

    /* ---- P. THE SENTENCES UNDER THE LADDER --------------------------------
       THE ELEVENTH, and it is authored CONTENT rather than an organ. The card
       printed bar.rung.word -- one word -- and the sentence he wrote saying what
       that word MEANS has never once been asked for by any surface.
       AND THE ORGAN SWEEP CANNOT FIND THIS CLASS: a note is DATA, so it has no
       call site to count. organ_reach_gate shipped this morning and reports
       bohemia_belonging perfectly healthy. Worth saying out loud, because a gate
       you trust for the wrong question is worse than no gate. */
    const RUNGS = require(path.join(ROOT, 'engine/bohemia_belonging.js')).RUNGS;
    ok('P1 EVERY RUNG HAS AN AUTHORED SENTENCE and the ladder still has five of '
      + 'them. If a rung ever loses its note this goes red rather than quietly '
      + 'rendering a blank where an explanation used to be',
      Array.isArray(RUNGS) && RUNGS.length === 5
        && RUNGS.every(r => r && String(r.note || '').trim().length > 10),
      JSON.stringify((RUNGS || []).map(r => r.word)));

    ok('P2 …and the card SHOWS the one for the rung you are on. It printed the '
      + 'word alone since the ladder shipped, so the player climbed five rungs '
      + 'and was never told what any of them cost — the same shape as the ten '
      + 'orphaned organs, one layer up: somebody wrote it, no surface asked',
      !!tert.opened && RUNGS.some(r => (tert.opened || '').indexOf(
        String(r.note).replace(/(^|\.\s+)[A-Z][A-Za-z]+(\s*&\s*[A-Z][A-Za-z]+|\s+\d{4})[^:]{0,20}:\s*/g, '$1').trim()) >= 0),
      JSON.stringify({ opened: (tert.opened || '').slice(0, 400) }));

    /* AND THE FIRST VERSION OF P3 COULD PASS WITHOUT TESTING ANYTHING.
       It searched ONE card — whichever rung the tertius probe happened to stand
       on — for citation words. Only ONE of the five notes carries a citation, so
       on any other rung the claim was true for free. Mutation-proved it: putting
       the raw note back left the gate GREEN at 81/0.
       A CLAIM THAT ONLY LOOKS AT THE CASE IN FRONT OF IT IS NOT A CLAIM — the
       same defect as a size bar that measures a comfortable card, twice in two
       days. This runs the REAL shipped ctRungNote over ALL FIVE rungs and also
       asserts the strip actually FIRES somewhere, so it cannot go vacuous if the
       citation is ever edited out of the data. */
    const notes = tert.rungNotes || [];
    const CITE = /(Lave|Wenger|Granovetter|Dunbar|Feld|Burt|Simmel|Kalyvas|Gouldner)/i;
    ok('P3 …and NO BIBLIOGRAPHY REACHES THE CARD, checked on ALL FIVE rungs '
      + 'rather than the one the probe is standing on. One note carries a '
      + 'research citation mid-sentence — half player copy, half note to self — '
      + 'and that is very likely why all five were dropped instead of one. It is '
      + 'stripped for the card only; his text is untouched everywhere else',
      notes.length === 5 && notes.every(n => !CITE.test(n.shown)),
      JSON.stringify(notes.filter(n => CITE.test(n.shown))));

    ok('P4 …and the strip is PROVED to fire rather than assumed: at least one '
      + 'note differs from its raw text, and every note still ends up a real '
      + 'sentence. Without this, deleting the citation from the data would make '
      + 'P3 pass while the stripping was quietly broken',
      notes.length === 5
        && notes.some(n => n.shown !== n.raw)
        && notes.every(n => /^[A-Z]/.test(n.shown) && n.shown.length > 10),
      JSON.stringify(notes.map(n => ({ word: n.word, changed: n.shown !== n.raw,
                                       shown: n.shown.slice(0, 60) }))));

    /* ---- Q. AND IT IS STILL TRUE TOMORROW ---------------------------------
       THE TWELFTH, AND IT IS EVERYTHING THIS LANE BUILT ALL WEEK. Eleven times
       an organ computed something nothing called; this is the same shape one
       level higher and the largest of them: the surface called EVERYTHING
       correctly and NOTHING REMEMBERED IT. ctBelongSave() returned a plain
       window object -- nothing wrote it, nothing read it back.
       AND THE HALF THAT SURVIVED MADE IT WORSE: CT_MET persisted, so the game
       remembered your NAME and forgot that you BURNED A BRIDGE for them.
       THIS IS THE FIRST CLAIM IN THIS GATE THAT RELOADS THE PAGE. Eighty-two
       claims walked the arc and not one of them closed the tab, which is why a
       system with no memory looked perfectly healthy for a week. */
    const persist = await (async () => {
      const pg = await browser.newPage({ viewport: VIEW });
      await pg.addInitScript(STAND_BESIDE);
      try {
        await pg.goto('file://' + CITY);
        await pg.waitForTimeout(6000);
        await pg.evaluate(SPARSE);
        const seed = await pg.evaluate(() => {
          const R = ctValleyRoster(), row = R.filter(a => a.faction)[0];
          if (!row) return null;
          const q = String(row.__id).split(':'), span = BohemiaPopulation.NB * FN;
          hx = (+q[0]) * span + 4; hy = (+q[1]) * span + 4; CT_SPAWN = null; ctSpawn();
          const rec = ctEveryone().filter(x => x.id === row.__id)[0];
          if (!rec) return null;
          const at = ctAt(rec);
          for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            hx = at[0] + d[0]; hy = at[1] + d[1];
            const a = ctAdjacent(); if (a && a.id === rec.id) break;
          }
          const fid = ctFactionOf(rec), sv = ctBelongSave();
          for (let i = 0; i < 9; i++) BohemiaBelonging.record(sv, fid, 0);
          BohemiaCommitment.setState(sv, fid, 'burned');
          sv.meta.owed = sv.meta.owed || {}; sv.meta.owed[fid] = 4;
          CT_MET.meet('P:city:' + rec.id, 1); CT_MET.ask('P:city:' + rec.id, 1);
          ctSave();
          return { fid, key: 'P:city:' + rec.id,
                   gave: BohemiaBelonging.gaveOf(sv, fid),
                   state: BohemiaCommitment.stateOf(sv, fid),
                   owed: (sv.meta.owed || {})[fid] };
        });
        if (!seed) return null;
        await pg.reload();
        await pg.waitForTimeout(6000);
        const back = await pg.evaluate((s) => {
          const sv = ctBelongSave();
          return { gave: BohemiaBelonging.gaveOf(sv, s.fid),
                   state: BohemiaCommitment.stateOf(sv, s.fid),
                   owed: (sv.meta.owed || {})[s.fid],
                   asked: CT_MET.asked(s.key) };
        }, seed);
        return { seed, back };
      } finally { await pg.close(); }
    })();

    ok('Q1 EVERYTHING YOU DID FOR THEM IS STILL TRUE AFTER A RELOAD. Standing, '
      + 'commitment and debt lived in a plain window object that nothing ever '
      + 'wrote — measured: gave 9 to 0, burned to none, owed 4 to 0. A week of '
      + 'this system existed only until the tab closed',
      !!persist && persist.back.gave === persist.seed.gave
        && persist.back.state === persist.seed.state
        && String(persist.back.owed) === String(persist.seed.owed),
      JSON.stringify(persist && { before: persist.seed, after: persist.back }));

    ok('Q2 …and the NAME survived alongside it, which is the half that made the '
      + 'bug worse rather than better: CT_MET always persisted, so the game '
      + 'remembered what to call you and forgot that you burned a bridge for '
      + 'them. A COUNT IS NOT A MEMORY, one level up',
      !!persist && persist.back.asked === true,
      JSON.stringify(persist && persist.back));

    /* Q3 EXISTS BECAUSE MUTATING THE GUARD DID NOT BITE. Deleting the
       version/shape check left the gate at 87/0, because the gate only ever
       WRITES a valid blob and so never walks the discard path. I had already
       written "an unreadable blob is discarded, never half-applied" in the
       commit message — a claim nothing proved. Same class as the fail-safe
       branch earlier this week that turned out to be the only path taken.
       AN UNTESTED BRANCH IS A CLAIM, NOT A BEHAVIOUR. This writes real garbage
       into the key and asserts the game comes up CLEAN rather than crashing or
       half-restoring: a partially restored standing is worse than a fresh one,
       because you cannot see that it is wrong. */
    const corrupt = await (async () => {
      const pg = await browser.newPage({ viewport: VIEW });
      await pg.addInitScript(STAND_BESIDE);
      const errs = [];
      pg.on('pageerror', e => errs.push(e.message));
      try {
        await pg.goto('file://' + CITY);
        await pg.waitForTimeout(5000);
        await pg.evaluate(SPARSE);
        await pg.evaluate(() => {
          /* THE FIRST PAYLOAD HERE TESTED THE WRONG THING, and the mutation said
             so: with the guard deleted the gate STILL passed. The garbage was
             UNTERMINATED JSON, so JSON.parse threw and the try/catch swallowed
             it — the version/shape guard was never reached at all. Two layers
             deep, and I had proved the outer one twice.
             VALID JSON WITH A WRONG VERSION AND A PLAUSIBLE STANDING is the only
             payload the guard alone can reject: it parses cleanly, it looks
             exactly like a real save, and its numbers are the thing that must
             NOT come back. If the guard goes, this standing gets restored and
             the claim below fails. */
          try {
            localStorage.setItem('boh.city.belong', JSON.stringify({
              v: 99,                                   /* a version we cannot read */
              meta: { gave: { Cartel: 99, Mob: 77 },   /* plausible, and wrong */
                      commit: { Cartel: 'burned' } }
            }));
          } catch (_e) {}
        });
        await pg.reload();
        await pg.waitForTimeout(6000);
        return await pg.evaluate((e) => {
          const sv = ctBelongSave();
          const rules = (typeof BohemiaBelonging !== 'undefined' && BohemiaBelonging.RULES) || {};
          let any = 0;
          for (const k in rules) any += BohemiaBelonging.gaveOf(sv, k) | 0;
          return { hasMeta: !!(sv && sv.meta && typeof sv.meta === 'object'),
                   standing: any, errs: e };
        }, errs);
      } finally { await pg.close(); }
    })();

    ok('Q3 A SAVE IT CANNOT READ IS DISCARDED, NOT HALF-APPLIED. Written because '
      + 'deleting the guard did NOT make this gate red — it only ever writes a '
      + 'valid blob, so the discard path was a claim in a commit message that '
      + 'nothing exercised. Fed real garbage, the game comes up clean instead of '
      + 'crashing or restoring somebody a standing they cannot see is wrong',
      !!corrupt && corrupt.hasMeta && corrupt.standing === 0
        && corrupt.errs.length === 0,
      JSON.stringify(corrupt));

    /* ---- R. WHAT EVERY OUTFIT PAYS, AND THE TWO POSTURES ------------------
       Swept because the same shape had been wrong twelve times. It was NOT wrong
       here -- every outfit with a declared `pays` reaches the card -- and the
       sweep is kept so it stays that way.
       AND MY PROBE CALLED THREE WORKING OUTFITS BROKEN FIRST. It grepped only
       "YOU CAN ASK THEM FOR", and his canon gives CARTEL, CHURCH and NETWORK the
       OPPOSITE POSTURE: they help you BEFORE you agree to anything, so their row
       reads "THEY ARE OFFERING" and their note says "It is free. That is the
       point of it, and it is the part to be careful about." A SWEEP THAT KNOWS
       ONE POSTURE REPORTS THE OTHER AS A DEFECT. */
    const pays = await (async () => {
      const pg = await browser.newPage({ viewport: VIEW });
      await pg.addInitScript(STAND_BESIDE);
      try {
        await pg.goto('file://' + CITY);
        await pg.waitForTimeout(6000);
        await pg.evaluate(SPARSE);
        return await pg.evaluate(() => {
          const B = BohemiaBelonging, R = ctValleyRoster();
          const keys = B.keys ? B.keys() : Object.keys(B.RULES || {});
          const out = { declared: [], reached: [], noMembers: [], missing: [],
                        offering: [], asking: [] };
          for (const k of keys) {
            const rule = B.RULES[k];
            if (!rule || !rule.pays) continue;
            out.declared.push(k);
            const norm = String(k).toUpperCase();
            const row = R.filter(a => String(a.faction || '').toUpperCase() === norm)[0];
            if (!row) { out.noMembers.push(k); continue; }
            const q = String(row.__id).split(':'), span = BohemiaPopulation.NB * FN;
            hx = (+q[0]) * span + 4; hy = (+q[1]) * span + 4; CT_SPAWN = null; ctSpawn();
            const rec = ctEveryone().filter(x => x.id === row.__id)[0];
            if (!rec) { out.missing.push(k + '(not drawable)'); continue; }
            const at = ctAt(rec);
            let stood = false;
            for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
              hx = at[0] + d[0]; hy = at[1] + d[1];
              const a = ctAdjacent(); if (a && a.id === rec.id) { stood = true; break; }
            }
            if (!stood) { out.missing.push(k + '(cannot stand beside)'); continue; }
            const fid = ctFactionOf(rec), sv = ctBelongSave();
            let hit = null;
            for (const gave of [3, 6, 9, 12]) {
              sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {}; sv.meta.commit = {};
              sv.meta.gave[fid] = gave;
              ctSawCell(); ctClose(); ctOpen();
              const el = document.getElementById('ctcard');
              const t = (el && el.style.display !== 'none') ? el.innerText : '';
              const m = t.match(/(YOU CAN ASK THEM FOR|THEY ARE OFFERING)\n([^\n]*)/);
              if (m) { hit = { gave, word: m[1], what: m[2] }; break; }
            }
            if (!hit) { out.missing.push(k + '(no row at any standing)'); continue; }
            out.reached.push({ k, at: hit.gave, word: hit.word, what: hit.what });
            (hit.word === 'THEY ARE OFFERING' ? out.offering : out.asking).push(k);
          }
          return out;
        });
      } finally { await pg.close(); }
    })();

    ok('R1 EVERY OUTFIT THAT DECLARES WHAT IT PAYS ACTUALLY PAYS IT ON THE CARD. '
      + 'Swept because this exact shape — authored, computed, never reachable — '
      + 'had been wrong twelve times this week. It is NOT wrong here, and the '
      + 'sweep is kept so it stays that way',
      !!pays && pays.missing.length === 0 && pays.reached.length > 0,
      JSON.stringify({ declared: pays && pays.declared.length,
                       reached: pays && pays.reached.length,
                       missing: pays && pays.missing }));

    ok('R2 …and BOTH OF HIS POSTURES ARE LIVE, not collapsed into one. Most '
      + 'outfits make you earn the right to ask; CARTEL, CHURCH and NETWORK HELP '
      + 'YOU BEFORE YOU AGREE TO ANYTHING and their row says so — "It is free. '
      + 'That is the point of it, and it is the part to be careful about." My own '
      + 'first sweep grepped one phrase and called all three broken',
      !!pays && pays.offering.length > 0 && pays.asking.length > 0,
      JSON.stringify({ theyOffer: pays && pays.offering, youAsk: pays && pays.asking }));

    ok('R3 …and the outfits that CANNOT be tested are NAMED rather than skipped. '
      + 'Five stand in the valley with zero members, so nobody can reach their '
      + 'favour at all — a population fact, not a wiring one, and it is reported '
      + 'with its cause instead of quietly counting as a pass',
      !!pays && Array.isArray(pays.noMembers),
      JSON.stringify({ zeroMembers: pays && pays.noMembers }));

    /* ---- S. NOBODY RUNS WITH SOMETHING THAT DOES NOT EXIST ----------------
       Found while asking why five of the sixteen outfits have no members. Two
       separate facts came out of it, and only one is a defect:
         KARENS / SOCIAL_FORCES / AMALGAMATION have NO BASE in CT_BASES_BAKED, so
           they correctly have no members. Placement, his map, not a bug.
         BLUES and ANARCHISTS DO have bases -- at y=3 and y=0, the top edge -- and
           still have zero members, which is worth his eye.
         "CUSTOM" IS A BASE, and three people run with it. It is not one of the
           sixteen: no terms, no acts, no ladder, no name mechanic. Their card
           says RUNS WITH CUSTOM and then offers nothing but "Ask their name".
       THE WHOLE SYSTEM IS DEAD FOR THOSE THREE PEOPLE and it looks like content
       rather than a gap, which is the worst way for it to fail: a player reads a
       faction name and finds a wall.
       NOT DELETED. A base in the baked table is placement and placement is his
       (MAP LAW). What a gate can do without deciding for him is refuse to let it
       stay invisible. */
    const orphanFactions = await (async () => {
      const pg = await browser.newPage({ viewport: VIEW });
      await pg.addInitScript(STAND_BESIDE);
      try {
        await pg.goto('file://' + CITY);
        await pg.waitForTimeout(6000);
        await pg.evaluate(SPARSE);
        return await pg.evaluate(() => {
          const R = ctValleyRoster();
          const ruled = (BohemiaBelonging.keys ? BohemiaBelonging.keys() : [])
            .map(k => String(k).toUpperCase());
          const orphans = {}, withMembers = {};
          R.forEach(a => {
            const f = String(a.faction || '').toUpperCase();
            if (!f) return;
            withMembers[f] = (withMembers[f] | 0) + 1;
            if (ruled.indexOf(f) < 0) orphans[f] = (orphans[f] | 0) + 1;
          });
          const empty = ruled.filter(k => !withMembers[k]);
          return { ruled: ruled.length, orphans, empty,
                   withMembers: Object.keys(withMembers).length };
        });
      } finally { await pg.close(); }
    })();

    /* *** I REPORTED CUSTOM AS A DEFECT AND IT IS THE PLAYER'S OWN FACTION. ***
       Paolo 8/21: "custom is your own personal faction!!!!!! and you can imagine
       if you play the game with your custom faction the values arent just for you
       its for how your factions treated."
       So CUSTOM having no entry in BohemiaBelonging.RULES is CORRECT and not a
       gap: those rules describe how an NPC OUTFIT treats the player -- their
       terms, their acts, their ladder, how they hand over a name. The player's
       own faction does not need any of that, because you are not earning your
       way into yourself.
       I read a base I did not recognise as a template artifact. IT IS THE ONE
       THE PLAYER BELONGS TO. Same shape as the false findings this lane keeps
       catching: I checked whether the machinery existed and not what the thing
       WAS. NOTES ARE RULINGS -- his word, fixed the same turn.
       WHAT THE CLAIM HOLDS NOW is the real invariant, which the first version had
       right underneath the wrong exemption: every outfit somebody runs with is
       either an NPC outfit WITH a rule, or the player's own. A third kind is a
       person advertising content that does not exist. */
    const PLAYER_OWN = ['CUSTOM'];
    const trueOrphans = orphanFactions
      ? Object.keys(orphanFactions.orphans).filter(f => PLAYER_OWN.indexOf(f) < 0)
      : [];
    ok('S1 EVERY OUTFIT SOMEBODY RUNS WITH IS EITHER AN NPC OUTFIT WITH A RULE, '
      + 'OR THE PLAYER\'S OWN. CUSTOM is the player\'s faction (Paolo 8/21) and '
      + 'correctly has no NPC rule — those rules are how an outfit treats YOU, '
      + 'and you do not earn your way into yourself. A third kind would be a '
      + 'person advertising a faction that does not exist, and that is the wall '
      + 'this catches',
      trueOrphans.length === 0,
      JSON.stringify({ playerOwn: PLAYER_OWN,
                       unexplained: trueOrphans,
                       counts: orphanFactions && orphanFactions.orphans }));

    ok('S2 …and the outfits with NO members are reported with their reason rather '
      + 'than skipped. Three of them have no base in the baked table at all, so '
      + 'zero members is correct; the others have a base and still nobody, which '
      + 'is a different thing and only visible if the two are counted apart',
      !!orphanFactions && Array.isArray(orphanFactions.empty),
      JSON.stringify({ ruledOutfits: orphanFactions && orphanFactions.ruled,
                       outfitsWithMembers: orphanFactions && orphanFactions.withMembers,
                       noMembers: orphanFactions && orphanFactions.empty }));

    ok('B13 the city threw no errors walking the whole arc', errors.length === 0,
      errors.slice(0, 3).join(' | '));
  } finally { await browser.close(); }

  console.log('\nFACTION ARC GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('FACTION ARC GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
