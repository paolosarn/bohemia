#!/usr/bin/env python3
"""
BOHEMIA CITY FAMILY PATCH -- THE FOLD, AND WHAT THE VALLEY STILL SAYS ABOUT YOU.
(8/31/26, FACTIONS lane. Paolo: "FAMILY".)

Patches slices/BOHEMIA_CITY_WORLD.html. Idempotent; marker __CITY_FAMILY__.

==========================================================================
WHY THIS IS THE WORK
==========================================================================
CLAUDE.md's own top, ruled by Paolo on 8/28 ("YEAH THREE GENERATIONS BRO
CMON"), says the handoff INHERITS EVERYTHING the last life built, and lists
what: "compound, STANDINGS, territory, the family tree, and the unhealed
wounds." Standings are named. They are this lane's.

engine/bohemia_standing.js has carried inherit() and legendOf() since 8/20 and
tools/bohemia_organ_reach.js has reported both as reached by NOTHING ANYWHERE
every time it has been run. The module states the rule in its own words:

    A QUIET GOOD DEED DIES WITH THE WITNESS.
    A NOTORIOUS ONE BECOMES THE THING YOUR CHILD IS JUDGED FOR.

...because inherit() keeps only deeds with hops > 0 -- the ones that were
RETOLD, by somebody who is still alive when the eyewitnesses are not. That rule
could not mean anything until a deed's loudness actually decided its hop budget,
and that only became true on 8/28 when the quest corpus started filling
DEED_WEIGHT and clout tags started driving reachOf/hopsFor on the walked
surface. The dynasty half was waiting on the reputation half.

==========================================================================
MEASURED FIRST, THROUGH THE REAL ORGANS, AND THE FIRST MEASUREMENT WAS WRONG
==========================================================================
400 people spread over 40x40, one deed of each loudness published, gossiped for
ten rounds, then a generation folds:

    CLOUT       saw  gossiped   held  retold  CARRIED   died
      quiet       33        20     53      20       20     33
      notable     86        25    111      25       25     86
      risky      154        71    225      71       71    154
      reckless   285        60    345      60       60    285

*** AND THE RUN BEFORE THAT ONE SAID inherit() CARRIED NOTHING AT ALL, AT EVERY
LOUDNESS, IN EVERY VALLEY SIZE. *** I had placed the valley with
`x=(i*7919)%W, y=(i*104729)%W`, which collapses onto a lattice line rather than
filling the square, so almost nobody had a gossip neighbour, so nothing was ever
retold, so nothing could cross. I was one step from filing "the louder the deed
the less survives" as an engine bug in the dynasty's own premise.

THE RULER WAS BROKEN, NOT THE TARGET, and the tell was that the answer was too
dramatic: a organ whose every unit test passes does not usually fail totally.
WHEN A MEASUREMENT INDICTS SOMETHING THIS OLD, MEASURE THE MEASUREMENT FIRST.

One honest observation kept rather than fixed: reckless (60) carries less than
risky (71) because at reach 24 nearly everybody is an EYEWITNESS, and an
eyewitness cannot be told what they already saw -- gossip's dedupe is on
(actor, kind, turn). So saturation shrinks the pool of people who can carry the
story. The ordering quiet << notable < risky ~ reckless still holds and the
7/21 CLOUT_WEIGHTS are HIS, so this is written down and not retuned.

==========================================================================
WHAT SHIPS
==========================================================================
1. ctFold() -- THE GENERATIONAL HANDOFF, RUN FOR REAL. Every mind in the valley
   is folded through BohemiaStanding.inherit. Eyewitness memory dies with the
   eyewitness; what was retold is re-attributed to the heir and marked with the
   generation it crossed and whose deed it originally was.

   THE HEIR IS ALSO '@'. Not laziness: the player is '@' on every surface in
   this city, and the whole ruling is that the heir INHERITS rather than starts
   over. Keeping the id means every card, every rung and every outfit view keeps
   working and now reads the family's history as the player's own -- which is
   exactly "you are born owing what your father owed". legendOf() is what
   separates the two again, because it counts ONLY deeds carrying `inherited`.

2. ctLegendRows() -- WHAT THE VALLEY STILL SAYS ABOUT YOUR FAMILY, in his own
   words. legendOf returns deed KINDS, which are machine ids; the sentence is
   the quest's own @LOG line out of BohemiaDeeds.labels(), the same source the
   card's reasons already use. A legend you cannot hear is a legend that is not
   doing any work -- the module's own comment, finally true.

3. It is on the OUTFIT board, under the outfits, because that board is already
   where this lane puts things he goes looking for rather than is interrupted by.

WHAT IS NOT HERE, ON PURPOSE: WHEN a generation turns is a STORY decision and
his. Nothing in this file triggers a fold on its own -- no timer, no act
boundary, no death. It is a verb the game can call when his story says so, plus
a control in DIRECT so he can turn it himself and watch what it does.

REUSE CHECK: cooks no graphic pixels, opens no art bank, draws nothing. Reads
engine/bohemia_standing.js (inherit, legendOf, GEN_LOSS -- already built,
already gated), BohemiaDeeds.labels() for his sentences, and the ctMindsList /
ctMindSave bridges this lane added on 8/28.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_FAMILY__'

# ------------------------------------------------------------------ THE FOLD
OLD_ORGAN = """/* __CITY_THEIRVIEW__ -- A FACTION'S VIEW IS ITS MEMBERS' VIEWS."""
NEW_ORGAN = """/* """ + MARKER + """ -- THE GENERATION TURNS, AND THE VALLEY REMEMBERS.
   Paolo 8/28, ruling the dynasty alive: a handoff "INHERITS EVERYTHING the last
   life built (compound, STANDINGS, territory, the family tree, and the unhealed
   wounds)". Standings are named in that list and they are this lane's.

   bohemia_standing.js has carried inherit() since 8/20 and organ_reach reported
   it reached by NOTHING ANYWHERE every single run. It could not have meant
   anything sooner: it keeps only deeds with hops > 0, the ones somebody RETOLD,
   and a deed's loudness did not decide its hop budget on the walked surface
   until the quest corpus started filling DEED_WEIGHT on 8/28. The dynasty half
   was waiting on the reputation half without either one saying so. */
var CT_GEN = 1;
function ctGenLoad(){
  try { var g = parseInt(localStorage.getItem('boh.city.gen') || '1', 10);
        if (g > 0) CT_GEN = g; } catch(_e){}
  return CT_GEN;
}
function ctGenSave(){
  try { localStorage.setItem('boh.city.gen', String(CT_GEN)); } catch(_e){}
}
/* THE HEIR IS ALSO '@', AND THAT IS THE RULING RATHER THAN A SHORTCUT. The
   player is '@' on every surface in this city, and the whole point is that the
   heir INHERITS rather than starts over -- a run resets you to nothing, a
   handoff is the opposite. Keeping the id means every card, every rung and
   every outfit view keeps working and now reads the family's history as the
   player's own, which is exactly "you are born owing what your father owed".
   legendOf() is what tells the two apart again: it counts ONLY deeds carrying
   `inherited`, so what your father did is still nameable as his. */
function ctFold(){
  if (typeof BohemiaStanding === 'undefined') return null;
  var minds = ctMindsList();
  var res;
  try { res = BohemiaStanding.inherit(minds, '@', '@', ctMinuteNow()); }
  catch(_e){
    console.error('BOHEMIA: the generation could not be folded, so nothing your '
      + 'family did survives it. ' + _e.message);
    return null;
  }
  CT_GEN = (CT_GEN | 0) + 1;
  ctGenSave();
  try { ctMindSave(); } catch(_e){}
  try { if (CT_OPEN) ctDraw(); } catch(_e){}
  return { gen: CT_GEN, carried: res.carried, died: res.died };
}
/* WHAT THE VALLEY STILL SAYS ABOUT YOUR FAMILY, IN HIS OWN SENTENCES.
   legendOf returns deed KINDS, which are machine ids nobody can read. The line
   is the quest's own @LOG out of BohemiaDeeds.labels() -- the same source the
   card's reasons already use, so the family's history and the day's gossip are
   never two different voices. Nothing is authored here. */
function ctLegendRows(limit){
  if (typeof BohemiaStanding === 'undefined') return [];
  var minds = ctMindsList(); if (!minds.length) return [];
  var rows = [];
  try { rows = BohemiaStanding.legendOf(minds, '@', ctMinuteNow()) || []; }
  catch(_e){ return []; }
  var labels = {};
  try { labels = BohemiaDeeds.labels() || {}; } catch(_e){}
  var out = [];
  for (var i = 0; i < rows.length && out.length < (limit || 4); i++){
    var r = rows[i], say = labels[r.kind];
    if (!say) continue;                 /* no sentence, no row: never a raw id */
    out.push({ kind: r.kind, tellers: r.tellers, force: r.force,
               generations: r.generations, say: say });
  }
  return out;
}
function ctLegendHtml(){
  var rows = ctLegendRows(4);
  if (!rows.length) return '';
  var h = '<div class="obhead2">WHAT THEY STILL SAY ABOUT YOUR FAMILY</div>';
  for (var i = 0; i < rows.length; i++){
    var r = rows[i];
    /* HOW MANY LIVES BACK, said in words rather than a number nobody can place */
    var ago = r.generations >= 3 ? 'THREE LIVES BACK'
            : (r.generations === 2 ? 'YOUR GRANDFATHER' : 'YOUR FATHER');
    h += '<div class="obv"><span class="obvwho">' + ago + '</span>'
       + '<span class="obvwhere">' + r.tellers + ' STILL '
       + (r.tellers === 1 ? 'TELLS IT' : 'TELL IT') + '</span></div>'
       + ctNote(r.say);
  }
  return h;
}
/* __CITY_THEIRVIEW__ -- A FACTION'S VIEW IS ITS MEMBERS' VIEWS."""

# ------------------------------------------------------- ON THE BOARD HE OPENS
# THE TAIL IS ANCHORED ON ctSeenByHtml() ALONE, not on the whole line. Another
# lane added ctWhoVouchesHtml() between the calls between 8/28 and 8/31 and this
# tool failed outright on the exact-line match -- which is the tool working (it
# refused rather than writing something wrong), but a patch that breaks whenever
# a neighbour adds a section to the same board is a patch that will keep breaking.
# The legend goes immediately after the seen-by list in BOTH tails, and
# ctOutfitHtml has TWO of them: the empty-state return fires whenever your own
# outfit holds no positions, which is most of the game, and patching one and not
# the other shipped the vouch list into the branch nobody was in on 8/28.
BOARD_ANCHOR = 'ctSeenByHtml()'
BOARD_REPLACE = 'ctSeenByHtml() + ctLegendHtml()'


def patch_board(s):
    n = s.count(BOARD_ANCHOR + ' +')
    if n < 2:
        sys.exit('FAIL: expected both outfit-board tails to call ' + BOARD_ANCHOR
                 + ', found ' + str(n))
    return s.replace(BOARD_ANCHOR + ' +', BOARD_REPLACE + ' +', 2)

# ----------------------------------------------- AND HE CAN TURN IT HIMSELF
OLD_MSG = """  window.addEventListener('message', function(ev){
    var d = ev && ev.data;
    if (d && d.type === 'BOHEMIA_DEED_WEIGHTS' && d.weights)"""
NEW_MSG = """  /* """ + MARKER + """ -- HE MUST BE ABLE TO DIRECT IT (8/12). WHEN a generation
     turns is a STORY decision and it is his; nothing in this file folds on its
     own -- no timer, no act boundary, no death. This is the door, on the same
     postMessage seam the STANDING dial already uses, so he can turn a life into
     a legend and watch what survives instead of being told it works. */
  window.addEventListener('message', function(ev){
    var d = ev && ev.data;
    if (d && d.type === 'BOHEMIA_FOLD_GENERATION'){
      var r = ctFold();
      try { if (ev.source) ev.source.postMessage(
        { type:'BOHEMIA_FOLDED', result:r }, '*'); } catch(_e){}
      return;
    }
    if (d && d.type === 'BOHEMIA_DEED_WEIGHTS' && d.weights)"""

OLD_BOOT = """  try {
    var raw = JSON.parse(localStorage.getItem('boh.city.deedweight') || 'null');
    if (raw && typeof raw === 'object') ctDialApply(raw, false);
  } catch(_e){}"""
NEW_BOOT = """  try {
    var raw = JSON.parse(localStorage.getItem('boh.city.deedweight') || 'null');
    if (raw && typeof raw === 'object') ctDialApply(raw, false);
  } catch(_e){}
  try { ctGenLoad(); } catch(_e){}     /* """ + MARKER + """ */"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: no ' + CITY)
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    if 'ctMindsList' not in s:
        sys.exit('FAIL: run tools/bohemia_city_theirview_patch.py first')
    if 'BohemiaDeeds.labels()' not in s:
        sys.exit('FAIL: the quest corpus is not wired; run '
                 'tools/bohemia_city_quest_deeds_patch.py first, or a legend has '
                 'no sentence to say and every row is dropped')

    s = patch_board(s)
    for old, new, what in ((OLD_ORGAN, NEW_ORGAN, 'the organ block'),
                           (OLD_MSG, NEW_MSG, 'the message seam'),
                           (OLD_BOOT, NEW_BOOT, 'the boot restore')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY FAMILY: the generation folds and the valley remembers.')
    print('  TAB: RUN -> the OUTFIT board, under the outfits.')


if __name__ == '__main__':
    main()
