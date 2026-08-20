#!/usr/bin/env python3
"""
BOHEMIA CITY TERTIUS PATCH -- standing with two outfits was two numbers. It is a
POSITION, and the organ that says which one has never been called. (8/20/26)

Law:  laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md (sec 4j)
Gate: gates/faction_arc_gate.js (part M, new)

REUSE CHECK (REUSE-FIRST): cooks nothing, invents nothing, adds no mechanic and
makes no second call. BohemiaCommitment.tertius() has existed since the wall
shipped and takes exactly two arguments -- the standings and the whoHears output
-- BOTH of which ctHearRows already has in hand at the moment it runs. This
prints what they already say, from inside the function that already computed
them, so the two can never disagree about the same graph.

--------------------------------------------------------------------------
THE NINTH TIME, AND IT IS THE PAYOFF OF THE WHOLE SYSTEM
--------------------------------------------------------------------------
    node tools/bohemia_organ_reach.js  ->  BohemiaCommitment.tertius  0 CALLERS

Ninth instance this week of AN ORGAN COMPUTES SOMETHING AND NOTHING CALLS IT, and
this one is not a detail. It is the moment the faction system stops being a set of
separate ladders and becomes a MAP OF WHERE YOU STAND.

Until now, standing with the Cartel and standing with the Mob were two numbers on
two different cards, and the game never once had an opinion about holding both.

--------------------------------------------------------------------------
BURT / SIMMEL, AND THE 2024 CORRECTION THAT MAKES IT A GAME
--------------------------------------------------------------------------
TERTIUS GAUDENS -- "the third who benefits" (Simmel; Burt's structural holes).
If the two outfits you stand with have NO line to each other, you span a
structural hole: you are the only route between them, neither side can see the
other half of what you are doing, and that position is worth more than either
standing on its own.

TERTIUS DOLENS -- "the third who suffers" (2024). If they ARE connected, the
IDENTICAL position costs you, because both sides can see the other half. The same
behaviour, the same two standings, opposite sign -- decided entirely by a fact
about the graph rather than about you.

That is the whole reason this is worth wiring: it is a strategic position the
player can actually read and actually move, and it is not a stat. The brokerage
literature calls this the GATEKEEPER/LIAISON position and it is measured, not
opined: `heard` is whoHears() output on this valley's real tie graph.

NOTHING IN THIS FILE DECIDES THAT ANY TWO OUTFITS ARE ENEMIES -- the organ says so
itself, and connectedness here is a measured line between two groups, never a
ruling about who hates whom. MECHANISM-MINE / CONTENTS-PAOLO'S.

--------------------------------------------------------------------------
WHERE IT SITS, AND WHY THERE
--------------------------------------------------------------------------
AT THE WALL, beside WHO WILL HEAR and AND IT COSTS YOU -- the one moment the
player is deciding whether to say out loud that they are with somebody. THE
CONSEQUENCE IS PRINTED BEFORE THE BUTTON, NEVER AFTER (this lane, 8/15): a
position you only discover after committing is a punishment; one you read first
is the decision.

It is NOT on every person's card. Where you stand across outfits is a fact about
YOU, and pasting it onto all 298 people would be noise on 297 of them.

AND THE EXPLANATION FOLDS (__CITY_NOTESFOLD__, same turn). The headline is the
live fact; the sentence explaining what a structural hole buys you is the same on
every card forever, which is the fold's own test. THE PERSON CARD HAS NO HEADROOM
and this lane has broken its own 90% bar three times in three days.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_TERTIUS__'

# Placed inside ctHearRows, which already holds both arguments -- a second
# whoHears() here would be a second opinion about the same graph.
#
# AND IT GOES **ABOVE THE EARLY RETURN**, WHICH THE FIRST CUT DID NOT.
# ctHearRows returns immediately when `heard` is empty ("NOBODY. NO OUTFIT IN
# THIS VALLEY HAS A LINE TO THEM"), and I first appended the row after that
# return. Measured on the real card: the organ said YOU ARE THE ONLY ROUTE
# BETWEEN THEM and the card said nothing at all.
#
# THE EARLY RETURN FIRES IN EXACTLY THE CASE THE ROW IS MOST ABOUT. An empty
# `heard` IS the structural hole -- nobody has a line, which is the whole
# definition of tertius gaudens. So the first placement was dead precisely on the
# good half of the mechanic and live only on the bad half, which is the worst
# possible way for it to be wrong: the game would have told you when you were
# exposed and stayed silent when you were the only route.
# A ROW ADDED AFTER AN EARLY RETURN IS NOT ADDED. Same family as the border pass
# that was individually correct and sat in the wrong place in the pipeline
# (8/16) -- reading the function does not find it; running it does.
OLD = """  if(!heard.length){
    body += ctRow('WHO WILL HEAR', 'NOBODY. NO OUTFIT IN THIS VALLEY HAS A LINE TO THEM.');
    return body;
  }"""
NEW = """  /* """ + MARKER + """ -- AND WHAT POSITION THAT PUTS YOU IN.
     BohemiaCommitment.tertius() has had ZERO CALLERS since the wall shipped: the
     ninth time this week an organ computed something nothing applied, and the
     one that turns two separate standings into a place to stand.
     Burt/Simmel TERTIUS GAUDENS -- two outfits with no line to each other means
     you span a structural hole and you are the only route between them. The 2024
     TERTIUS DOLENS correction is what makes it a game: connect them and the
     identical position costs you instead, because both sides can see the other
     half of what you are doing. Same behaviour, opposite sign, decided by the
     graph and not by you.
     Computed from the `heard` THIS function already built, never a second
     whoHears -- two calls are two opinions about one graph.
     ABOVE THE EARLY RETURN ON PURPOSE. An empty `heard` IS the structural hole,
     so returning first would have killed this row in exactly the case it is most
     about: the game would announce that both sides can see you and say nothing
     at all when you are the only route between them. */
  try {
    var ctTer = BohemiaCommitment.tertius(ctStandings(), heard);
    if(ctTer){
      body += ctRow('YOUR POSITION', ctTer.word);
      body += ctNote(ctTer.note);
    }
  } catch(_e){}
  if(!heard.length){
    body += ctRow('WHO WILL HEAR', 'NOBODY. NO OUTFIT IN THIS VALLEY HAS A LINE TO THEM.');
    return body;
  }"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    if OLD not in s:
        sys.exit('FAIL: could not find the hear rows')
    s = s.replace(OLD, NEW, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY TERTIUS: two standings are a position now, and it has a sign')


if __name__ == '__main__':
    main()
