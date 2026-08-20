#!/usr/bin/env python3
"""
BOHEMIA CITY WORST-CARD PATCH -- the bar was blind to the fullest state the game
can actually reach, and it was blind BEFORE I added a row to it. (8/20/26)

Law:  laws/BOHEMIA_ADDENDUM_THE_CARD_HAS_TO_FIT_8_18_26.md
Gate: gates/cardfold_gate.js (A12 rebuilt on the real worst case)

REUSE CHECK (REUSE-FIRST): cooks nothing and writes no new rule. It applies two
rules this card already has -- A DUPLICATE IS NOT DISCLOSURE (8/18, TRADE row;
8/20, NAME row) and THE HEADLINE IS LIVE, THE EXPLANATION IS THE OUTFIT'S
(__CITY_NOTESFOLD__, same turn) -- to the FOUR places on the fullest card that
break them. Measured: 838px -> 739px, 99% -> 88%.

NOT ONE OF THE FOUR SHORTENS A SENTENCE. Every one removes something the card
says TWICE. That distinction is the whole discipline here: trimming words to get
under a number is fitting the content to the ruler and has to be re-argued the
next time somebody adds a row, whereas a duplicate rule keeps paying out.

--------------------------------------------------------------------------
I REPEATED MY OWN MISTAKE ONE COMMIT LATER
--------------------------------------------------------------------------
A12 was written this morning because A1 stood next to whoever was nearest and
therefore never saw a vouch: "A BAR THAT DOES NOT MEASURE THE WORST CASE IS NOT A
BAR." Then I wired tertius, added a row, and measured A12's card -- 734px, 87%,
green -- and moved on.

A12's card is NOT the worst case either. Measured, four states, same person:

    A12 today       (gave 6, sided, owing)            734px  87%
    at the none-wall (gave 5) + other standing        655px  78%
    at the sided-wall (gave 9), no other standing     799px  95%   <-- ALREADY OVER
    AT THE sided-WALL (gave 9) + other standing       838px  99%   <-- the real worst

THE 95% ROW IS THE ONE THAT MATTERS: the card was already through the bar at the
sided-wall BEFORE tertius existed, and no claim has ever stood there. A12 fixed
one blind spot and left the neighbouring one, which is what happens when you fix
a bar by adding the case that just bit you instead of asking what the maximum is.
THE WALL STATE IS WHERE EVERY SYSTEM IS ON AT ONCE -- terms, ladder, commitment,
neglect, claim, debt, favour, wall, pass-note, position, hear -- and it is the
one state nothing was measuring.

--------------------------------------------------------------------------
FOUR DUPLICATES, EVERY ONE ALREADY AGAINST THIS CARD'S OWN RULES
--------------------------------------------------------------------------
(3 and 4 are documented at their own edits further down: the fold row repeating
the live claim, and YOU ARE repeating the word the wall row contains.)

1. THE POSITION AND THE HEAR ROW SAY THE SAME THING.

     YOUR POSITION   YOU ARE THE ONLY ROUTE BETWEEN THEM
     WHO WILL HEAR   NOBODY. NO OUTFIT IN THIS VALLEY HAS A LINE TO THEM.

   Tertius answers GAUDENS on precisely the condition that makes the second row
   say NOBODY -- an empty `heard` IS the structural hole. So they are one fact
   printed twice, and the position row is the better half: it says what the fact
   MEANS instead of restating the graph. The NOBODY row stays wherever tertius
   has nothing to say (you stand with fewer than two outfits), which is most of
   the game.

2. "THEY ARE NOT WAITING" IS A NOTE BY ITS OWN NAME. The row is
   ctRow(BohemiaClaim.WORDS.owing, BohemiaClaim.WORDS.owing_note) -- BOTH halves
   are global constants, identical on every person of every outfit forever, which
   is word for word the test the fold applies. It explains WHY the ask came early;
   the live fact (that you owe, and how much) is on the YOU OWE THEM row directly
   below and is untouched. It only had a label rather than an empty one, which is
   the only reason the notes fold did not already catch it.

NEITHER OF THESE IS A TRIM. Shortening sentences to get under a number is fitting
the content to the ruler; removing a thing the card says twice is the card's own
standing rule, and it keeps working when the next system adds a row.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_WORSTCARD__'

# ---- 1. the position row already said it, and said it better ---------------
OLD_HEAR = """  if(!heard.length){
    body += ctRow('WHO WILL HEAR', 'NOBODY. NO OUTFIT IN THIS VALLEY HAS A LINE TO THEM.');
    return body;
  }"""
NEW_HEAR = """  if(!heard.length){
    /* """ + MARKER + """ -- ...unless YOUR POSITION just said it. Tertius answers
       GAUDENS on exactly the condition that makes this row say NOBODY, because an
       empty `heard` IS the structural hole -- so printing both is one fact twice,
       and the position row is the better half: it says what the fact MEANS rather
       than restating the graph. A DUPLICATE IS NOT DISCLOSURE (8/18). This row
       stays wherever tertius has nothing to say, which is most of the game. */
    if(!ctTer)
      body += ctRow('WHO WILL HEAR', 'NOBODY. NO OUTFIT IN THIS VALLEY HAS A LINE TO THEM.');
    return body;
  }"""

# the tertius result has to outlive the if-block that computes it
OLD_TER = """  try {
    var ctTer = BohemiaCommitment.tertius(ctStandings(), heard);
    if(ctTer){"""
NEW_TER = """  var ctTer = null;      /* """ + MARKER + """ -- read again below */
  try {
    ctTer = BohemiaCommitment.tertius(ctStandings(), heard);
    if(ctTer){"""

# ---- 2. a note by its own name folds with the other notes ------------------
OLD_OWING = """  if(BohemiaClaim.WORDS.owing && ctOwedTo(rule.key) > 0)
    body += ctRow(BohemiaClaim.WORDS.owing, BohemiaClaim.WORDS.owing_note);"""
NEW_OWING = """  /* """ + MARKER + """ -- AND THIS ROW IS A NOTE BY ITS OWN NAME. Both halves
     are global constants (WORDS.owing / WORDS.owing_note), identical on every
     person of every outfit forever, which is the fold's own test. It explains WHY
     the ask came early; the live fact -- that you owe, and how much -- is on the
     YOU OWE THEM row directly below and is untouched. It only had a LABEL rather
     than an empty one, which is the sole reason __CITY_NOTESFOLD__ missed it. */
  if(BohemiaClaim.WORDS.owing && ctOwedTo(rule.key) > 0 && !CT_NOTES_FOLDED)
    body += ctRow(BohemiaClaim.WORDS.owing, BohemiaClaim.WORDS.owing_note);"""


# ---- 3. and the fold row stopped repeating the live claim -----------------
# THIRD APPLICATION OF THE SAME RULE TODAY, on the same card:
#
#     THEIR TERMS           YOU, ON A LIST  ·  tap to read
#     THEY ARE ASKING YOU   YOU, ON A LIST
#
# The fold row summarises what the outfit wants; the claim row is them asking for
# it. Whenever a claim is live those are the SAME WORDS six rows apart. A5 says
# the live question is never folded, so the live row stays and the SUMMARY is the
# redundant half -- the label THEIR TERMS plus the underlined affordance already
# say exactly what is behind the fold.
#
# IT FAILS SAFE. ctClaimOf is a pure read of (rule, gave) with no side effects,
# but ctClaimRows can OPEN a claim that was not open yet -- so this early read can
# answer "no claim" for a row that later appears. When that happens the word stays
# and nothing is lost; the only cost is a duplicate that was there before. It can
# never remove a word the card then fails to print.
OLD_FOLDROW = """          + '<div class="k">THEIR TERMS</div><div class="v">'
          + '<span style="text-decoration:underline">' + bar.wantWord
          + ' &middot; tap to read</span></div></div>';"""
NEW_FOLDROW = """          + '<div class="k">THEIR TERMS</div><div class="v">'
          + '<span style="text-decoration:underline">'
          /* """ + MARKER + """ -- ...unless the live claim is already saying it.
             See the note in tools/bohemia_city_worstcard_patch.py: A5 keeps the
             live question, so the SUMMARY is the redundant half. Fails safe --
             an early read that misses a claim keeps the word. */
          + (ctFoldWant ? ctFoldWant + ' &middot; ' : '')
          + 'tap to read</span></div></div>';"""

OLD_FOLDIF = """      if(ctTermsFolded(ctEverDealt(bState.sv, ctFid) ? 1 : 0)){"""
NEW_FOLDIF = """      /* """ + MARKER + """ -- is the live claim about to say the want word?
         Read HERE, above the row that uses it: `var` hoisting has silently
         killed three things in this function already and order is a fact. */
      var ctFoldWant = bar.wantWord;
      try {
        var ctFoldClaim = ctClaimOf(bRule, BohemiaBelonging.gaveOf(bState.sv, ctFid));
        if(ctFoldClaim && String(ctFoldClaim.what) === String(bar.wantWord))
          ctFoldWant = null;
      } catch(_e){}
      if(ctTermsFolded(ctEverDealt(bState.sv, ctFid) ? 1 : 0)){"""

# ---- 4. and at the wall, YOU ARE is already inside THE WALL ----------------
# FOURTH AND LAST, and it fires only in the one state that was over the bar:
#
#     YOU ARE   COUNTED
#     THE WALL  TURNING UP GETS YOU NO FURTHER THAN COUNTED. INSIDE IS NOT FOR SALE.
#
# At a blocking wall, ctWall.reaches IS bar.rung.word by construction, and this
# row has already dropped its "N MORE TO ..." clause there because turning up
# buys nothing -- so YOU ARE says ONE WORD and the wall row repeats that word
# inside a fuller sentence. The wall row is strictly the more informative
# statement of the same fact.
#
# ONLY AT THE WALL, and that scope is the whole point. Everywhere else this row
# carries your position AND its progress and nothing else says either -- which is
# most of the game and all of the climb.
OLD_RUNG = """      else if(bar.rung && ctLadder) body += ctRow('YOU ARE', bar.rung.word
        + ((bar.next && (!ctWall || !ctWall.atWall))
             ? (' \\u00b7 '+bar.next.more+' MORE TO '+bar.next.rung.word) : ''));"""
NEW_RUNG = """      /* """ + MARKER + """ -- ...and not when THE WALL is about to say it.
         At a blocking wall ctWall.reaches IS the rung word, and this row has
         already dropped its progress clause because turning up buys nothing
         there -- so it says one word the wall row then repeats inside a fuller
         sentence. A DUPLICATE IS NOT DISCLOSURE. Guarded on the words actually
         matching, so a future wall that reaches somewhere else keeps both. */
      else if(bar.rung && ctLadder
              && !(ctWall && ctWall.atWall && ctWall.blocks
                   && String(ctWall.reaches) === String(bar.rung.word)))
        body += ctRow('YOU ARE', bar.rung.word
        + ((bar.next && (!ctWall || !ctWall.atWall))
             ? (' \\u00b7 '+bar.next.more+' MORE TO '+bar.next.rung.word) : ''));"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((OLD_TER, NEW_TER, 'the tertius call'),
                           (OLD_HEAR, NEW_HEAR, 'the empty-heard row'),
                           (OLD_OWING, NEW_OWING, 'the owing note'),
                           (OLD_FOLDIF, NEW_FOLDIF, 'the fold condition'),
                           (OLD_FOLDROW, NEW_FOLDROW, 'the fold row'),
                           (OLD_RUNG, NEW_RUNG, 'the rung row')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY WORSTCARD: the fullest card the game can reach fits')


if __name__ == '__main__':
    main()
