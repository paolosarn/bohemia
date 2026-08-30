#!/usr/bin/env python3
"""
BOHEMIA CITY QUEST DEEDS PATCH -- 82 AUTHORED CONSEQUENCES THAT NOBODY EVER SAW.
(8/28/26, FACTIONS lane.)

Patches slices/BOHEMIA_CITY_WORLD.html. Idempotent; marker __CITY_QUESTDEEDS__.

==========================================================================
THE HOLE
==========================================================================
Paolo has written 82 faction consequences into quests/bq/*.bq -- `faction REDS
+10`, `faction CARAVANS +12` -- across 25 of his 27 quests, every one carrying
the clout tag that says how loud it was. The demo plays three of those quests
with the real parser and the real runtime, and the `faction` verb IS handled:
it adds the number to quest state and to the shared ledger.

And that is the whole of it. The number moves in a ledger, valley-wide,
instantly, and NOT ONE PERSON IN LAS VEGAS SEES IT HAPPEN. No card changes. No
outfit forms a view. The people standing next to you when you did it remember
nothing.

engine/bohemia_deeds.js was built on 8/6 to close exactly this and its own
comment names what it is for -- "the convenience the run lane will actually
call". Nothing has ever called it. tools/bohemia_organ_reach.js reported
publishStage, sayWhy and labels reached by NOTHING ANYWHERE the moment the
module was finally registered in its table on 8/28.

==========================================================================
WHY THIS IS THE RIGHT SHAPE, AND IT IS NOT MY OPINION
==========================================================================
Fallout: New Vegas is the game this corpus is most often measured against, and
it shipped BOTH designs at once, which makes it an unusually clean experiment:

  KARMA is omniscient. It moves whether or not anybody saw, it is global, and
  it is invisible. The settled verdict on it is that it "is almost completely
  irrelevant... the score doesn't matter in any but a few isolated cases".

  REPUTATION is per-faction and it moves when SOMEBODY CATCHES YOU: "if someone
  catches you performing an action that causes negative Karma against their
  faction, you will often lose reputation with that faction." That is the half
  everybody remembers and the half the whole game is built around.

Bohemia's `s.faction[NAME] += delta` ledger is, precisely, karma. It is
omniscient, unwitnessed and unseen. This patch does not add a system; it moves
his authored numbers off the karma path and onto the reputation path that was
already built, already gated, and already on the card.

==========================================================================
WHAT IT DOES
==========================================================================
1. THE FULL CORPUS IS INLINED, not the five that were there, AND IT IS MOVED
   OUT OF THE MODULE BODY IT WAS HIDING IN (see patch_corpus).

2. loadCorpus() IS CALLED, so DEED_WEIGHT gets its 82 rows.
   MECHANISM-MINE / CONTENTS-PAOLO'S is kept exactly: this file names no faction
   and types no number. standing.js still ships the table EMPTY; the only thing
   that fills it is a scan of his .bq files, and every row traces to a line in
   one of them.

3. A RESOLVED STAGE IS PUBLISHED INTO THE HEADS OF THE PEOPLE STANDING THERE,
   through a `witness` seam THIS FILE ONLY FILLS IN. The hook itself lives in
   engine/bohemia_demoquests.js, because the first cut of this patched the
   INLINED COPY of that module in the page and the resync then reported it STALE
   against its own canon file -- the exact drift ENGINE SYNC LAW exists to kill,
   and the same drift that meant nobody in Las Vegas had a faction for thirteen
   days in August with every gate green.

   The split: the MODULE owns WHEN a resolution counts, the HOST owns WHO WAS
   THERE. The module fires on D._toStage (a choice, a world event and
   nightfall's fail branch all land there) AND on D.spoke, which is the trap --
   a chosen @OPT can carry `@DO set_stage 20`, which runs the stage's verbs
   through the canonical Runtime.setStage before the UI ever asks what happened,
   and D.spoke's own comment warns that re-entering the stage there would pay
   every bond twice. So both paths call one guarded function, IDEMPOTENT per
   (quest, stage): a resolution can only ever be witnessed once, however it was
   reached. That guard lives in the module because the hazard is the module's.

==========================================================================
TWO BUGS THIS FOUND ON THE WAY, BOTH BIGGER THAN THE WIRING
==========================================================================
A. publish() picked its witnesses with `factionOfOwner(owner) === faction`, a
   strict string compare between the CITY's faction id and the QUEST's spelling
   of it. Measured across the corpus before anything was wired:

       82 authored deltas
       23 matched
       59 named a real faction IN A DIFFERENT CASE and matched nothing

   He writes `faction TRADES +8`; the canon id in BOHEMIA_faction_graph.json is
   `Trades`. ZERO of the 82 name a faction that does not exist. So fifty-nine
   lines of his writing would have gone into nobody's head, and publish() would
   have returned witnesses:0 -- indistinguishable from "nobody was standing
   there". Fixed in engine/bohemia_deeds.js (sameFaction) and resynced.

B. scanQuest called LOOP.cloutTagFrom directly, and the walked city loads
   BohemiaClout, NOT the 75 KB BohemiaLoop. So LOOP was null there and the
   function threw on its first line. THAT IS WHY THIS BRIDGE HAD NEVER RUN
   ANYWHERE A PLAYER COULD REACH: loadCorpus could not fill the table and
   publishStage could not publish, on the one surface all of it was for.
   cloutWeight had been given exactly this fallback on 8/21; scanQuest was
   missed. The half-applied fix was the whole bug.

REUSE CHECK: cooks no graphic pixels. Opens no art bank and draws nothing. It
reads quests/bq/*.bq (his), engine/bohemia_deeds.js and engine/bohemia_standing.js
(already built, already gated), and the ctMindsList / ctFactionOfMind bridges
this lane added on 8/28.
"""
import json
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
BQDIR = 'quests/bq'
MARKER = '__CITY_QUESTDEEDS__'


def build_corpus():
    """Every .bq he has written, keyed by the stem the demo spec already uses."""
    out = {}
    for f in sorted(os.listdir(BQDIR)):
        if f.endswith('.bq'):
            out[f[:-3]] = open(os.path.join(BQDIR, f), encoding='utf-8').read()
    return out


LIFT_NOTE = ('/* ' + MARKER + ': the quest text used to be declared HERE, inside the\n'
             '   demoquests module body, which is exactly where a module resync cuts.\n'
             '   It is declared whole beside the code that uses it instead. */\n')

CORPUS_HEAD = (
    '/* ' + MARKER + ' -- ALL {n} OF HIS QUESTS, NOT THE FIVE THE DEMO PLAYS.\n'
    '   loadCorpus normalises every deed weight by the LARGEST DEED IN THE CORPUS,\n'
    '   so the set that is loaded decides the whole scale. Measured 8/28: the full\n'
    '   corpus answers 20, the five that used to be here answer 12. Loading only\n'
    '   those five inflated every weight in the game by 20/12 and moved every rung\n'
    '   boundary with it. The SOURCES are inlined rather than a baked weight table\n'
    '   on purpose: the numbers are re-derived from his files at every boot, so they\n'
    '   cannot drift from what he actually wrote.\n'
    '   AND IT IS DECLARED HERE, OUTSIDE EVERY MODULE BANNER. A resync cuts from a\n'
    '   module banner to the next one, so 250 KB of quest text parked inside a 17 KB\n'
    '   module body makes tools/bohemia_city_module_resync.py refuse to run -- and\n'
    '   that resync is the only thing keeping 99 inlined engine copies from drifting\n'
    '   a week behind canon, which is the bug that cost this lane thirteen days. */\n'
    'const DEMO_BQ=')


def patch_corpus(s):
    """Lift the quest text OUT of the demoquests module body, then re-declare it
    whole, next to the code that uses it.

    IT HAS TO MOVE, AND THE TOOL THAT CAUGHT THAT IS RIGHT TO EXIST.
    `const DEMO_BQ=` sat INSIDE the `==== engine/bohemia_demoquests.js ====`
    banner, which has no closing banner, so a module resync cuts from that banner
    to the next one and swallows the quest text with it. At five quests nobody
    noticed. At twenty-seven, tools/bohemia_city_module_resync.py refused:
    "278742 bytes against a 17216 byte module -- that is not one module, it is
    this one plus whatever follows it. NOTHING WAS WRITTEN."

    That refusal is the tool working as designed. The fix is to stop hiding a
    250 KB data blob inside a 17 KB module body, never to loosen the check.
    """
    corpus = build_corpus()
    if not corpus:
        sys.exit('FAIL: no .bq files found')

    i = s.find('const DEMO_BQ=')
    if i < 0:
        sys.exit('FAIL: no DEMO_BQ in the city')
    if 'engine/bohemia_demoquests.js' not in s[:i]:
        sys.exit('FAIL: DEMO_BQ is not where this tool expects it')
    j = s.find('\n', i)
    s = s[:i] + LIFT_NOTE + s[j + 1:]

    anchor = 'const DQ=BohemiaDemoQuests.make('
    k = s.find(anchor)
    if k < 0:
        sys.exit('FAIL: no DQ make call to declare the corpus in front of')
    head = CORPUS_HEAD.replace('{n}', str(len(corpus)))
    return s[:k] + head + json.dumps(corpus) + ';\n' + s[k:]


# ------------------------------------------- 2. FILL HIS TABLE FROM HIS FILES
OLD_MAKE = """const DQ=BohemiaDemoQuests.make({BQ:BQ,BQRuntime:BQRuntime,sources:DEMO_BQ,loop:DAY});"""
NEW_MAKE = """const DQ=BohemiaDemoQuests.make({BQ:BQ,BQRuntime:BQRuntime,sources:DEMO_BQ,loop:DAY,
  /* """ + MARKER + """ -- THE WORLD, HANDED TO THE QUEST MODULE.
     The module owns WHEN a resolution counts (once per quest+stage, however it
     was reached); this owns WHO WAS THERE. Neither knows the other's job. */
  witness: function(file, stageN, questId){
    if (typeof BohemiaDeeds === 'undefined') return null;
    if (typeof ctFactionOfMind !== 'function') return null;
    /* THE WITNESS SET IS BARK_DREW, EXACTLY AS ctDeed BUILDS IT.
       REUSE-FIRST: ctDeed is the city's existing single-deed publisher and this
       is its witness set, not a second idea about who can see you -- who the
       game actually DREW this frame, with the position it drew them at.
       AND `where` IS A FUNCTION, owner -> {x,y}. The first cut passed the string
       '@' for it, which is truthy, so bohemia_standing's `where && where(owner)`
       called it and threw "where is not a function" -- swallowed by the catch
       below, reported as witnesses:0, which is indistinguishable from nobody
       having been there. That is the exact ambiguity this whole bridge exists to
       remove, reintroduced one argument to the left. */
    var drew = (typeof BARK_DREW !== 'undefined' && BARK_DREW) ? BARK_DREW : [];
    var pos = {}, minds = [];
    for (var i = 0; i < drew.length; i++) {
      var d = drew[i]; if (!d || !d.p || !d.at) continue;
      pos[d.p.id] = { x: d.at[0], y: d.at[1] };
      minds.push(ctMind(d.p.id));
    }
    if (!minds.length) return null;
    var res = BohemiaDeeds.publishStage(
      minds, ctMinuteNow(), '@', DEMO_BQ[file], stageN,
      hx, hy, function(o){ return pos[o] || null; }, ctFactionOfMind, questId);
    if (res && res.rows && res.rows.length) {
      window.__QUEST_DEEDS = (window.__QUEST_DEEDS || 0) + res.rows.length;
      window.__QUEST_WITNESSES = (window.__QUEST_WITNESSES || 0) + (res.witnesses || 0);
    }
    return res;
  }});
/* """ + MARKER + """ -- HIS OWN FILES FILL HIS OWN TABLE.
   bohemia_standing.js ships DEED_WEIGHT EMPTY and its gate asserts that it does.
   This is the ONLY thing in the codebase that puts a row in it, and every row it
   writes traces to a `faction NAME +N` line in one of his .bq files. Nothing here
   names a faction or types a number: MECHANISM-MINE / CONTENTS-PAOLO'S, kept by
   construction rather than by promising.

   Until 8/28 this call did not exist anywhere on a surface a player can reach, so
   the table stayed empty, every opinion weighed zero, and the reputation organ was
   inert in a game whose whole spine is factions. */
var CT_DEED_ROWS = 0;
function ctCorpusLoad(){
  try {
    if (typeof BohemiaDeeds === 'undefined' || typeof DEMO_BQ === 'undefined') return 0;
    var srcs = [];
    for (var k in DEMO_BQ) srcs.push({ id: k, src: DEMO_BQ[k] });
    var r = BohemiaDeeds.loadCorpus(srcs);
    CT_DEED_ROWS = (r && r.deeds) ? r.deeds.length : 0;
    return CT_DEED_ROWS;
  } catch(_e){
    /* DEMO_BQ is a const declared below the dial's boot restore, so the first
       call lands in its temporal dead zone and throws. That is expected and it
       is why this is a no-op rather than a warning: the corpus load that counts
       is the one at the bottom of this file, after the const exists. */
    return 0;
  }
}
ctCorpusLoad();
if (!CT_DEED_ROWS) console.error('BOHEMIA: the quest corpus did not load, so no '
  + 'deed weighs anything and every faction in the game stays blank.');"""


# ------------------------------ 3. THE PEOPLE STANDING THERE ACTUALLY SEE IT
# THE HOOK ITSELF LIVES IN engine/bohemia_demoquests.js, NOT HERE, AND THAT IS
# ENGINE SYNC LAW rather than taste. The first cut of this patched the INLINED
# COPY of the module in the page; tools/bohemia_city_module_resync.py then
# reported the module STALE against its own canon file, which is exactly the
# drift that law exists to kill -- and the same drift that meant NOBODY in Las
# Vegas had a faction for thirteen days in August with every gate green.
# So the module got a `witness` seam and the host passes the world in. The
# module owns the idempotence (the double-entry hazard is its own) and knows
# nothing about the city; the city owns the minds and the position and knows
# nothing about stages.


# ---------------------- 4. THE DIAL MAY NOT WIPE THE ROWS IT DOES NOT OWN
# MEASURED, and it is why this looked broken in the alpha while working perfectly
# on the standalone city page: boot table 82 standing alone, 0 inside the alpha.
#
# ctDialApply deletes EVERY row in DEED_WEIGHT before writing the dial's, and its
# comment gives the right reason -- "a kind he has cleared must actually clear...
# taking it back is half of a dial". True, for THE FOUR CITY KINDS THE DIAL OWNS
# (claim:met, claim:refused, commit, favour). The 82 `q:` rows come from his .bq
# files, the dial cannot name them and cannot put them back, and the DIRECT tab
# pushes its weights into the frame at alpha boot -- so his quest corpus was
# being wiped by an empty dial before he ever touched anything.
#
# The fix keeps both halves honest: clear, RELOAD THE CORPUS, then apply the dial
# ON TOP. A cleared dial kind still clears. A quest row survives. And if he ever
# dials a `q:` kind by hand, his dial wins, which is the correct precedence.
OLD_DIAL = """  for (var k in T0) if (Object.prototype.hasOwnProperty.call(T0, k)) delete T0[k];
  for (var j in w) {"""
NEW_DIAL = """  for (var k in T0) if (Object.prototype.hasOwnProperty.call(T0, k)) delete T0[k];
  /* """ + MARKER + """ -- AND HIS QUESTS GO STRAIGHT BACK IN.
     The clear above is right about the kinds THIS DIAL OWNS and wrong about the
     82 rows that come from his .bq files: the dial cannot name them, so it can
     never put them back. Measured before this line existed: the corpus loaded
     82 rows on the standalone city page and 0 inside the alpha, because the
     DIRECT tab posts its weights across the frame at boot and an EMPTY dial was
     wiping his whole quest corpus before he had touched a thing.
     Reloading here rather than skipping the delete keeps the dial's own
     property intact -- a kind he clears really does clear -- while the quest
     rows, which are derived from his files and not from this table, come back.
     His dial then lands ON TOP, so a hand-set weight still wins. */
  if (typeof ctCorpusLoad === 'function') ctCorpusLoad();
  for (var j in w) {"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: no ' + CITY)
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    if 'ctMindsList' not in s:
        sys.exit('FAIL: run tools/bohemia_city_theirview_patch.py first '
                 '(publishStage needs the minds list and the faction bridge)')
    if 'sameFaction' not in s:
        sys.exit('FAIL: the city carries a pre-8/28 bohemia_deeds; run '
                 'tools/bohemia_city_module_resync.py first, or 59 of his 82 '
                 'deltas will match nobody and scanQuest will throw on LOOP')

    if 'cfg.witness' not in s:
        sys.exit('FAIL: the city carries a pre-8/28 bohemia_demoquests with no '
                 'witness seam; run tools/bohemia_city_module_resync.py first')
    s = patch_corpus(s)
    for old, new, what in ((OLD_MAKE, NEW_MAKE, 'the corpus load'),
                           (OLD_DIAL, NEW_DIAL, 'the dial clear')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    n = len(build_corpus())
    print('CITY QUEST DEEDS: his ' + str(n) + ' quests are loaded and a resolved')
    print('  stage is now witnessed by the people standing there.')
    print("  TAB: RUN. Finish a day's quest, then read the card of anybody who")
    print('  runs with the outfit it touched, or open the OUTFIT board.')


if __name__ == '__main__':
    main()
