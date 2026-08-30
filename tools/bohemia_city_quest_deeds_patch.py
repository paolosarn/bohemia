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
1. THE FULL CORPUS IS INLINED, not the five that were there.
   loadCorpus normalises every weight by the LARGEST DEED IN THE CORPUS -- the
   module's rule is that the biggest thing a quest can do, done in front of the
   whole faction, moves you exactly one rung. Measured: the full 27 answer 20;
   the five that were inlined answer 12. Loading only those five would have
   inflated every weight in the game by 20/12 and quietly moved every rung
   boundary. Inlining the sources rather than baking a weight table means the
   numbers are re-derived from his files at every boot and can never drift from
   what he wrote.

2. loadCorpus() IS CALLED, so DEED_WEIGHT gets its 82 rows.
   MECHANISM-MINE / CONTENTS-PAOLO'S is kept exactly: this file names no faction
   and types no number. standing.js still ships the table EMPTY; the only thing
   that fills it is a scan of his .bq files, and every row traces to a line in
   one of them.

3. A RESOLVED STAGE IS PUBLISHED INTO THE HEADS OF THE PEOPLE STANDING THERE.
   Hooked at D._toStage, which is the one place every stage entry goes through
   -- a choice, a world event, and nightfall's fail branch all land there.

   AND AT D.spoke, WHICH IS THE TRAP. A chosen @OPT can carry `@DO set_stage
   20`, which runs the stage's verbs through the canonical Runtime.setStage
   BEFORE the UI ever asks what happened; D.spoke exists to report that, and its
   own comment warns that calling _toStage there would run everything twice.
   So both paths call ONE publisher and it is IDEMPOTENT per (quest, stage):
   the same resolution can never be witnessed twice, however it was reached.

==========================================================================
THE BUG THIS FOUND ON THE WAY, WHICH IS BIGGER THAN THE WIRING
==========================================================================
publish() picked its witnesses with `factionOfOwner(owner) === faction`, a
strict string compare between the CITY's faction id and the QUEST's spelling of
it. Measured across the corpus before anything was wired:

    82 authored deltas
    23 matched
    59 named a real faction IN A DIFFERENT CASE and matched nothing

He writes `faction TRADES +8`; the canon id in BOHEMIA_faction_graph.json is
`Trades`. ZERO of the 82 name a faction that does not exist. So fifty-nine lines
of his writing would have gone into nobody's head, and publish() would have
returned witnesses:0 -- indistinguishable from "nobody was standing there".
Fixed in engine/bohemia_deeds.js (sameFaction) and resynced into this page, so
it is one canonical body per ENGINE SYNC LAW rather than a patch on a copy.

REUSE CHECK: cooks no graphic pixels. Opens no art bank and draws nothing. It
reads quests/bq/*.bq (his), engine/bohemia_deeds.js and engine/bohemia_standing.js
(already built, already gated), and the ctMindsList / ctFactionOfMind bridges
this lane added on 8/28.
"""
import json
import os
import re
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
BQDIR = 'quests/bq'
MARKER = '__CITY_QUESTDEEDS__'


def build_corpus():
    """Every .bq he has written, keyed by the stem the demo spec already uses."""
    out = {}
    for f in sorted(os.listdir(BQDIR)):
        if not f.endswith('.bq'):
            continue
        out[f[:-3]] = open(os.path.join(BQDIR, f), encoding='utf-8').read()
    return out


# ------------------------------------------------------ 1. THE WHOLE CORPUS
def patch_corpus(s):
    i = s.find('const DEMO_BQ=')
    if i < 0:
        sys.exit('FAIL: no DEMO_BQ in the city')
    j = s.find('\n', i)
    corpus = build_corpus()
    if not corpus:
        sys.exit('FAIL: no .bq files found')
    head = ('/* ' + MARKER + ' -- ALL ' + str(len(corpus)) + ' OF HIS QUESTS, NOT THE FIVE THE DEMO PLAYS.\n'
            '   loadCorpus normalises every deed weight by the LARGEST DEED IN THE CORPUS,\n'
            '   so the set that is loaded decides the whole scale. Measured 8/28: the full\n'
            '   corpus answers 20, the five that used to be here answer 12. Loading only\n'
            '   those five inflated every weight in the game by 20/12 and moved every rung\n'
            '   boundary with it. The SOURCES are inlined rather than a baked weight table\n'
            '   on purpose: the numbers are re-derived from his files at every boot, so they\n'
            '   cannot drift from what he actually wrote. */\n'
            'const DEMO_BQ=')
    return s[:i] + head + json.dumps(corpus) + ';' + s[j:]


# ------------------------------------------- 2. FILL HIS TABLE FROM HIS FILES
OLD_MAKE = """const DQ=BohemiaDemoQuests.make({BQ:BQ,BQRuntime:BQRuntime,sources:DEMO_BQ,loop:DAY});"""
NEW_MAKE = """const DQ=BohemiaDemoQuests.make({BQ:BQ,BQRuntime:BQRuntime,sources:DEMO_BQ,loop:DAY});
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
(function(){
  try {
    if (typeof BohemiaDeeds === 'undefined') return;
    var srcs = [];
    for (var k in DEMO_BQ) srcs.push({ id: k, src: DEMO_BQ[k] });
    var r = BohemiaDeeds.loadCorpus(srcs);
    CT_DEED_ROWS = (r && r.deeds) ? r.deeds.length : 0;
  } catch(_e){
    console.error('BOHEMIA: the quest corpus did not load, so no deed weighs '
      + 'anything and every faction stays blank. ' + _e.message);
  }
})();"""


# ------------------------------ 3. THE PEOPLE STANDING THERE ACTUALLY SEE IT
OLD_TOSTAGE = """    D._toStage = function (n) {
      D.rt.setStage(n);
      var log = stageLog(D.Q, n);
      if (loop) loop.stage(D.spec.id, n, log, (stageTags(D.Q, n)[0] || null));
      D.lastNarrated = n;"""
NEW_TOSTAGE = """    /* """ + MARKER + """ -- SOMEBODY DID SOMETHING AND THE PEOPLE THERE SAW IT.
       His `faction REDS +10` used to move a number in a ledger, valley-wide and
       instantly, with nobody watching. That is KARMA, and the game everybody
       measures this corpus against shipped karma next to reputation and proved
       which one matters: its karma is "almost completely irrelevant", while its
       reputation -- which moves when somebody CATCHES you -- is the half the
       whole game is built on. This puts his numbers on the reputation path.

       IDEMPOTENT PER (QUEST, STAGE), AND THAT IS NOT DEFENSIVE PROGRAMMING, IT
       IS THE ONLY WAY BOTH CALLERS CAN BE CORRECT. A chosen @OPT can carry
       `@DO set_stage 20`, which runs the stage's verbs through the canonical
       Runtime.setStage before the UI ever asks what happened -- D.spoke exists
       to report exactly that, and its own comment warns that re-entering the
       stage there would pay every bond twice and double every faction move. So
       both paths call this, and a resolution can only ever be witnessed once,
       however it was reached. */
    D._seen = {};
    D._witness = function (n) {
      if (!D.Q || !D.spec || n == null) return null;
      var key = D.spec.id + ':' + n;
      if (D._seen[key]) return null;
      D._seen[key] = 1;
      if (typeof BohemiaDeeds === 'undefined') return null;
      if (typeof ctMindsList !== 'function' || typeof ctFactionOfMind !== 'function') return null;
      try {
        var res = BohemiaDeeds.publishStage(
          ctMindsList(), ctMinuteNow(), '@', DEMO_BQ[D.spec.file], n,
          hx, hy, '@', ctFactionOfMind, D.spec.id);
        if (res && res.rows && res.rows.length) {
          D.lastWitness = res;
          window.__QUEST_DEEDS = (window.__QUEST_DEEDS || 0) + res.rows.length;
          window.__QUEST_WITNESSES = (window.__QUEST_WITNESSES || 0) + (res.witnesses || 0);
        }
        return res;
      } catch(_e){
        if (!D._witness.__warned){ D._witness.__warned = 1;
          console.error('BOHEMIA: a resolved quest stage was never witnessed by '
            + 'anybody, so no outfit can have learned about it. ' + _e.message); }
        return null;
      }
    };

    D._toStage = function (n) {
      D.rt.setStage(n);
      var log = stageLog(D.Q, n);
      if (loop) loop.stage(D.spec.id, n, log, (stageTags(D.Q, n)[0] || null));
      D._witness(n);
      D.lastNarrated = n;"""

OLD_SPOKE = """      D.lastNarrated = n;
      var log = stageLog(D.Q, n);
      if (loop) loop.stage(D.spec.id, n, log, (stageTags(D.Q, n)[0] || null));
      var out = { stage: n, log: log, objectives: D.rt.objectives(), spoke: true };"""
NEW_SPOKE = """      D.lastNarrated = n;
      var log = stageLog(D.Q, n);
      if (loop) loop.stage(D.spec.id, n, log, (stageTags(D.Q, n)[0] || null));
      D._witness(n);          /* """ + MARKER + """: idempotent, see _witness */
      var out = { stage: n, log: log, objectives: D.rt.objectives(), spoke: true };"""


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
                 'deltas will match nobody')

    s = patch_corpus(s)
    for old, new, what in ((OLD_MAKE, NEW_MAKE, 'the corpus load'),
                           (OLD_TOSTAGE, NEW_TOSTAGE, 'the stage hook'),
                           (OLD_SPOKE, NEW_SPOKE, 'the spoken-stage hook')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    n = len(build_corpus())
    print('CITY QUEST DEEDS: his ' + str(n) + ' quests are loaded and a resolved')
    print('  stage is now witnessed by the people standing there.')
    print('  TAB: RUN. Finish a day\'s quest, then read the card of anybody who')
    print('  runs with the outfit it touched, or open the OUTFIT board.')


if __name__ == '__main__':
    main()
