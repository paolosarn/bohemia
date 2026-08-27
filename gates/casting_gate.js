/* BOHEMIA CASTING GATE (8/26/26, PEOPLE lane) -- a quest role is a PERSON you
 * can walk up to, not a word.
 *
 * Paolo 8/25, THE PLAYTEST DISPATCH item 2:
 *   "THE QUESTS ARE SO BAD AND NOT WIRED TO ANY LOCATIONS OR PEOPLE IN THE CITY.
 *    AND THE ART FOR THE QUEST LOGS IS SO FUCKING BAD WHEN ITS ON MY FEED"
 * and his dispatch makes it demand-side, not [PENDING]:
 *   "A QUEST THAT IS NOT ATTACHED TO A PLACE AND A PERSON IS NOT A QUEST."
 *
 * WHAT WAS TRUE BEFORE, IN THE CITY'S OWN WORDS (it says so in a comment):
 *   "SCAFFOLD -- the casting. The real system casts @ROLE against people who
 *    actually exist in the world and places the quest where they are. This binds
 *    stages to WORLD EVENTS instead."
 * `@ROLE lineman REQ faction=TRADES` resolved to the STRING "lineman". Nobody in
 * the valley had ever been the lineman.
 *
 * THE DESIGN, AND IT COMES OUT OF COUNTING THE ROLES RATHER THAN GUESSING:
 *   faction=X             53 uses across the nine canon quests -- A REAL DEMAND
 *   ~60 other predicates   1 use each: keeps_the_tunnel, reads_the_sky,
 *                          found_the_stairwell, speaks_for_the_crew...
 * The faction is MATCHED against people who really run with that outfit. The
 * one-off predicates are the quest describing the person it needs, and nothing
 * in the sim computes them or ever will, so they are CONFERRED: the quest does
 * not hunt for somebody who already keeps the tunnel, it makes the person it
 * cast into the one who keeps it.
 *
 * PROVES:
 *   A  the caster is deterministic, respects the faction demand, and answers
 *      NULL rather than faking one when the outfit has nobody here
 *   B  one person never holds two parts in one quest, and REQ beats OPT
 *   C  ON THE WALKED CITY: a role resolves to a real person, on real ground
 *   D  ON THE CARD HE OPENS: the row is there, it names the quest and the role,
 *      it is ENGLISH, and it AGREES WITH THE RUNS WITH ROW two lines below it
 *
 * D is the one that matters. The card printing "wants the fixer" over a person
 * whose own card says they run with the CARTEL would be worse than no row.
 *
 * WHAT THIS DOES NOT CLAIM, said plainly: the PLACE half. bohemia_loop.js
 * castTarget() has picked a real district cell for each quest since 7/26 and the
 * demo day loop still binds to world events instead. Casting runs against the
 * people standing here, which is why the row says "on this block" -- and why
 * this gate does not pretend item 2 is closed.
 *
 * Law: laws/BOHEMIA_ADDENDUM_THE_PLAYTEST_DISPATCH_8_25_26.md
 *   node gates/casting_gate.js
 */
'use strict';
var fs = require('fs');
var path = require('path');

var ROOT = path.dirname(__dirname);
process.chdir(ROOT);

var pass = 0, fail = 0;
function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  ok   ' + name + (detail ? '   ' + detail : '')); }
  else { fail++; console.log('  FAIL ' + name + (detail ? '   ' + detail : '')); }
}
function head(s) { console.log('\n' + s); }

var P = require('../engine/bohemia_people.js');

/* ==========================================================================
   A. THE CASTER
   ========================================================================== */
head('A. THE CASTER');
ok('the identity module can cast a role',
  typeof P.castRole === 'function' && typeof P.castAddresses === 'function');

function crowd(n, plan) {
  var out = [];
  for (var i = 0; i < n; i++) out.push({ key: 'P:city:9:9:' + i, faction: plan(i) });
  return out;
}
var people = crowd(60, function (i) {
  return i % 7 === 0 ? 'TRADES' : (i % 5 === 0 ? 'NETWORK' : null);
});
var lineman = { name: 'lineman', req: true, cond: 'faction=TRADES  block=browned' };
var fixer = { name: 'fixer', req: false, cond: 'faction=NETWORK met_before=false' };
var anyone = { name: 'runner', req: false, cond: 'faction_any knows_the_load=true' };

var c1 = P.castRole(lineman, people, { questId: 'bq_meter_reader' });
ok('a role casts to a real person', !!c1 && !!c1.key, c1 && c1.key);
ok('and that person really runs with the outfit the role demands',
  !!c1 && c1.person.faction === 'TRADES', c1 && String(c1.person.faction));

/* THE PREDICATES ARE CONFERRED, NOT MATCHED, and the cast has to hand them back
   or the surface cannot say the most interesting sentence a quest ever writes
   about a stranger. */
ok('the one-off predicates come back as CONFERRED traits, not as filters',
  !!c1 && c1.traits.indexOf('block=browned') >= 0, c1 && JSON.stringify(c1.traits));
ok('and the faction is not smuggled into the traits list',
  !!c1 && c1.traits.every(function (t) { return t.indexOf('faction') !== 0; }));

/* DETERMINISM. A quest giver who moves between reloads is not a quest giver. */
var c1b = P.castRole(lineman, people, { questId: 'bq_meter_reader' });
ok('casting the same role twice casts the same person', !!c1b && c1b.key === c1.key);
var shuffled = people.slice().reverse();
var c1c = P.castRole(lineman, shuffled, { questId: 'bq_meter_reader' });
ok('and the ORDER the caller iterates the block in cannot change the answer',
  !!c1c && c1c.key === c1.key, c1c && c1c.key);
var c1d = P.castRole(lineman, people, { questId: 'bq_a_different_quest' });
ok('a different quest casts somebody else', !!c1d && c1d.key !== c1.key, c1d && c1d.key);

/* NULL IS A REAL ANSWER. Two of the eleven outfits the canon quests demand had
   nobody at all in the walked sweep; faking one would put a stranger in a part
   the story says belongs to an insider. */
ok('*** NOBODY OF THAT OUTFIT HERE MEANS NULL, NOT A FAKE ***',
  P.castRole({ name: 'boss', req: true, cond: 'faction=REDS' }, people, { questId: 'q' }) === null);
ok('and faction_any casts anybody at all',
  !!P.castRole(anyone, people, { questId: 'q' }));
ok('an empty block casts nobody rather than throwing',
  P.castRole(lineman, [], { questId: 'q' }) === null);

/* ==========================================================================
   B. A WHOLE QUEST
   ========================================================================== */
head('B. A WHOLE QUEST AT ONCE');
/* *** THESE CLAIMS USED TO CALL castQuest, WHICH IS GONE. *** It cast every role
   against ONE roster, and its two rules -- REQ first, and nobody holds two parts
   -- now live in castAddresses, which is what the game runs. Rather than delete
   the claims with the function, they are pointed at castAddresses with a
   ONE-BLOCK WORLD: same rules, same starving cases, and now exercising the
   real path instead of a parallel one. */
function onBlock(roles, roster, opts) {
  return P.castAddresses(roles, {
    peopleAt: function () { return roster; },
    originFor: function () { return [0, 0]; },
    radius: 0,
    questId: (opts && opts.questId) || 'q',
    factionOf: function (p) { return p.faction; }
  });
}
var full = onBlock([fixer, lineman], people, { questId: 'bq_meter_reader' });
ok('both roles cast', !!full.lineman && !!full.fixer,
  Object.keys(full).join(', '));
/* TWO ROLES THAT WANT THE SAME OUTFIT, because that is the only case where a
   collision is even possible. The first cut of this compared lineman (TRADES)
   against fixer (NETWORK) and passed with the dedupe DELETED -- two different
   factions cannot land on one person, so the claim was named after the rule and
   never once exercised it. Same shape as the fallback claim caught yesterday:
   A CLAIM WHOSE SAMPLE DOES NOT CONTAIN ITS SUBJECT IS A VACUOUS PASS. */
var twins = onBlock(
  [{ name: 'crew_a', req: true, cond: 'faction=TRADES speaks_for_the_crew=true' },
   { name: 'crew_b', req: true, cond: 'faction=TRADES fixed_the_roof=true' }],
  people, { questId: 'bq_meter_reader' });
ok('two roles wanting the SAME outfit both cast', !!twins.crew_a && !!twins.crew_b,
  Object.keys(twins).join(', '));
ok('and they are different people', !!twins.crew_a && !!twins.crew_b
  && twins.crew_a.key !== twins.crew_b.key,
  twins.crew_a && twins.crew_b ? twins.crew_a.key + ' vs ' + twins.crew_b.key : 'one did not cast');
ok('and so are two roles wanting different outfits',
  full.lineman.key !== full.fixer.key,
  full.lineman.key + ' vs ' + full.fixer.key);

/* *** AND THE DEDUPE IS PROVED BY STARVING THE BLOCK, WHICH IS THE ONLY
   DETERMINISTIC WAY. *** The two claims above are about pool sufficiency, not
   about the dedupe: on nine eligible people two roles land apart BY LUCK, and
   they kept passing with the dedupe deleted. A pool of ONE is the only case
   where the rule is the sole thing standing between two roles and one person.
   TWO ATTEMPTS AT THIS CLAIM WERE VACUOUS BEFORE THIS ONE. The lesson is the
   same one this lane keeps paying for: a claim has to be built so that the rule
   it names is the ONLY thing that can make it pass. */
var only = [{ key: 'P:city:1:1:1', faction: 'TRADES' }];
var starved = onBlock([{ name: 'part_a', req: true, cond: 'faction_any' },
                       { name: 'part_b', req: true, cond: 'faction_any' }],
                      only, { questId: 'q' });
ok('*** ONE PERSON NEVER HOLDS TWO PARTS IN ONE QUEST ***',
  Object.keys(starved).length === 1,
  Object.keys(starved).join(', ') + ' from a block of one person');

/* REQ BEATS OPT, checked the same way: one person, one required part, one
   optional. The required one must get them. */
var scarce = onBlock([{ name: 'opt_one', req: false, cond: 'faction_any' },
                      { name: 'req_one', req: true, cond: 'faction_any' }],
                     only, { questId: 'q' });
ok('and when they can only fill one, the REQUIRED part gets them',
  !!scarce.req_one && !scarce.opt_one, Object.keys(scarce).join(', ') || 'nobody cast');

/* ==========================================================================
   C + D. THE WALKED CITY, AND THE CARD HE OPENS
   ========================================================================== */
function requirePlaywright() {
  for (var i = 0, g = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']; i < g.length; i++) {
    try { return require(path.join(g[i], 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}
var SETTLE = require(__dirname + '/bohemia_settle.js').settle;
var CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');

(async function () {
  head('C. THE WALKED CITY');
  var browser = null;
  try {
    browser = await requirePlaywright().chromium.launch({ args: ['--no-sandbox'] });
    var page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    var errs = [];
    page.on('pageerror', function (e) { errs.push(String(e.message).slice(0, 140)); });
    await page.goto('file://' + CITY);
    await SETTLE(page, 9000);

    /* TAKE THE JOB. The day's work sits on the PHONE -- the quest does not exist
       until it is taken -- so a probe that skipped this would measure a valley
       with no quest in it and report "nothing casts", which is true and useless. */
    await page.evaluate(function () {
      for (var i = 0; i < 3; i++) {
        var g = document.querySelector('#daycardIn .dcgo') || document.querySelector('#daycardIn .dcbtn');
        if (g) g.click();
      }
      try { window.DAYOPEN = DQ.openDay(DAY.day); } catch (e) {}
    });
    await SETTLE(page, 2500);

    var m = await page.evaluate(function () {
      var sp = BohemiaPopulation.NB * FN;
      var quest = null;
      try { quest = { id: DQ.Q && DQ.Q.id, title: DQ.Q && DQ.Q.title,
                      roles: (DQ.Q && DQ.Q.roles || []).map(function (r) { return r.name; }) }; }
      catch (e) { quest = null; }
      var blocks = 0, castBlocks = 0, rolesSeen = {}, card = null, cardRole = null;
      var runsWith = null, wantFaction = null, mismatch = null;
      for (var cx = 6; cx < 30; cx++) for (var cy = 6; cy < 30; cy++) {
        hx = cx * sp + 4; hy = cy * sp + 4; CT_SPAWN = null;
        var R = [];
        try { ctSpawn(); R = ctEveryone(); } catch (e) { continue; }
        if (!R.length) continue;
        blocks++;
        var c = null;
        try { c = ctCast(); } catch (e) {}
        if (!c) continue;
        var names = Object.keys(c);
        if (!names.length) continue;
        castBlocks++;
        names.forEach(function (n) { rolesSeen[n] = (rolesSeen[n] || 0) + 1; });

        /* AND OPEN THAT PERSON'S CARD FOR REAL, once, on the first block that
           casts. Not cardFor(), not a return value: the text on the glass. */
        if (card) continue;
        var nm = names[0], tgt = null;
        for (var i = 0; i < R.length; i++) if ('P:city:' + R[i].id === c[nm].key) tgt = R[i];
        if (!tgt) continue;
        var at = ctAt(tgt), dd = [[1, 0], [-1, 0], [0, 1], [0, -1]], stood = false;
        for (var d = 0; d < dd.length; d++) {
          hx = at[0] + dd[d][0]; hy = at[1] + dd[d][1];
          try { render(); } catch (e) {}
          if (ctAdjacent()) { stood = true; break; }
        }
        if (!stood) continue;
        var vb = document.getElementById('cttalk');
        if (!vb || getComputedStyle(vb).display === 'none') continue;
        vb.click();
        var cc = document.getElementById('ctcard');
        card = cc ? cc.innerText : null;
        cardRole = nm;
        wantFaction = c[nm].faction;
        try { runsWith = ctFactionOf(tgt); } catch (e) {}
        if (wantFaction && runsWith && String(runsWith).toUpperCase() !== wantFaction)
          mismatch = runsWith + ' vs ' + wantFaction;
        try { ctClose(); } catch (e) {}
      }
      return { quest: quest, blocks: blocks, castBlocks: castBlocks, rolesSeen: rolesSeen,
               card: card, cardRole: cardRole, runsWith: runsWith,
               wantFaction: wantFaction, mismatch: mismatch };
    });

    ok('the city was walked with a real quest running', !!m.quest && !!m.quest.id,
      m.quest ? m.quest.id + ' (' + m.quest.title + ')' : 'NO QUEST');
    ok('nothing threw while walking it', errs.length === 0, errs.slice(0, 2).join(' | '));
    /* *** THIS CLAIM WAS REWRITTEN THE SAME WEEK IT WAS WRITTEN, BECAUSE THE
       TRUTH GOT BETTER. *** It used to demand `castBlocks > 5`, which was the
       right claim for a cast computed against whatever block you stood on: many
       blocks casting meant the caster was alive. The cast is the DAY'S now, one
       part to one person on one block, so the old floor would have been a gate
       DEMANDING THE BUG BACK. A GATE MUST NEVER OUTRANK A RULING -- fix the
       ruler, never the target -- and the replacement is strictly stronger: not
       "several", exactly ONE, out of every populated block in the valley. It
       still catches a caster that quietly stops working (that reads zero) and it
       now also catches one that starts working everywhere again. */
    ok('*** A ROLE RESOLVES TO ONE REAL PERSON, ON ONE REAL BLOCK ***',
      m.castBlocks === 1,
      m.castBlocks + ' of ' + m.blocks + ' populated blocks can cast somebody');
    ok('the quest declares roles for the caster to fill',
      !!m.quest && m.quest.roles.length > 0, m.quest && m.quest.roles.join(', '));

    head('D. THE CARD HE OPENS');
    ok('a cast person\'s card was actually opened', !!m.card,
      String(m.card || '').slice(0, 60));
    ok('*** THE CARD SAYS WHAT THE JOB WANTS THEM FOR ***',
      /THE JOB\n/.test(String(m.card)),
      String(m.card || '').split('\n').slice(0, 8).join(' | '));
    ok('and it names the quest and the role by name',
      m.quest && String(m.card).indexOf(m.quest.title) >= 0
        && String(m.card).indexOf(String(m.cardRole).replace(/_/g, ' ')) >= 0,
      m.quest && (m.quest.title + ' / ' + m.cardRole));
    /* THE CROSS-CHECK, AND IT IS THE POINT OF SECTION D. The card printing
       "wants the fixer" over somebody whose own card says they run with the
       CARTEL would be worse than no row at all. */
    ok('*** AND IT AGREES WITH THE RUNS WITH ROW TWO LINES BELOW IT ***',
      !m.mismatch, m.mismatch || (m.runsWith + ' matches the role\'s ' + m.wantFaction));
    /* REQUIRED INFORMATION IS ENGLISH (THEY SPEAK SPANGLISH, the hard rule).
       This row tells him which door to knock on. */
    var jobLine = (String(m.card || '').split('\n')[
      String(m.card || '').split('\n').indexOf('THE JOB') + 1] || '');
    ok('and the row is English, because it is telling him what to do',
      !!jobLine && P.esWordsIn(jobLine).length === 0,
      jobLine + '   ' + JSON.stringify(P.esWordsIn(jobLine)));
  } catch (e) {
    ok('the walked city could be measured at all', false, String(e && e.message || e));
  } finally {
    if (browser) await browser.close();
  }

  console.log('\n' + (fail ? 'RED' : 'GREEN') + '  ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
