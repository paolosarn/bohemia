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
            const at = ctAt(q); const keepx = hx, keepy = hy;
            hx = at[0] + 1; hy = at[1];
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
      try {
        await pg.goto('file://' + CITY);
        await pg.waitForTimeout(6000);
        return await pg.evaluate((say) => {
          const bases = ctBases() || {};
          let who = null, fid = null;
          for (const b of Object.values(bases)) {
            hx = b.x * FN + 2; hy = b.y * FN + 2;
            for (const q of ctEveryone()) { const f = ctFactionOf(q); if (f) { who = q; fid = f; break; } }
            if (who) break;
          }
          if (!who) return { nobody: true };
          const at = ctAt(who); hx = at[0] + 1; hy = at[1];
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
        for (const d of [2, 4, 6, 8, 10, 12]) {
          hx = b.x * FN + d; hy = b.y * FN + d;
          for (const q of ctEveryone()) {
            const at = ctAt(q); hx = at[0] + 1; hy = at[1];
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
        ok('F3 ' + f + ' tells the player HOW TO GET THE REST in its own words, '
          + 'verbatim from the rule rather than a generic line',
          n.cardRest === n.ruleNext,
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
            const at = ctAt(q); hx = at[0] + 1; hy = at[1];
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

    ok('B13 the city threw no errors walking the whole arc', errors.length === 0,
      errors.slice(0, 3).join(' | '));
  } finally { await browser.close(); }

  console.log('\nFACTION ARC GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('FACTION ARC GATE CRASHED: ' + (e && e.stack || e)); process.exit(1); });
