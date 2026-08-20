#!/usr/bin/env python3
"""
BOHEMIA CITY CARD-FOLD PATCH -- the person card stopped fitting on the phone.
(8/18/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_THE_CARD_HAS_TO_FIT_8_18_26.md
Gate: gates/cardfold_gate.js

REUSE CHECK (REUSE-FIRST): cooks nothing, adds no mechanism, removes no fact.
Every row it folds is still reachable; this is where they are shown, not whether.

--------------------------------------------------------------------------
MEASURED, NOT FELT
--------------------------------------------------------------------------
Five systems write rows onto the person card now (the name, the bargain, the
wall, the claim, the favour). At iPhone portrait, 844px tall:
    first meeting          15 rows   591px   70% of the screen
    after taking three     17 rows   640px   76%
    counted and owing      22 rows   808px   96%
At 96% the card IS the phone, and the sixth system overflows it.

--------------------------------------------------------------------------
THE RULE, AND IT IS NOT A TASTE CALL
--------------------------------------------------------------------------
NIELSEN 2006, PROGRESSIVE DISCLOSURE: present only what the immediate task
needs and defer the rest to something the reader can choose to open. COWAN 2001,
THE MAGICAL NUMBER 4 IN SHORT-TERM MEMORY: the realistic working-memory limit is
about FOUR chunks, not seven.

So the question for every row is: IS THIS THE LIVE QUESTION, OR IS IT REFERENCE?
And the answer falls out of the data rather than out of my preference:

  A FACT ABOUT THE OUTFIT BELONGS TO THE OUTFIT, NOT TO EVERY PERSON IN IT.
  THEY WANT / THEY HOLD / PAID IN / CAREFUL are IDENTICAL on every member of
  that outfit, forever. They are the terms of the bargain, and you read terms
  once. Re-printing them on the ninth Church member you meet is not information,
  it is wallpaper with a high word count.

WHEN THEY FOLD: the moment you have any standing at all with that outfit
(gave > 0). That is exactly the moment you have demonstrably already acted on
their terms -- read off state that already exists, so no new save field and no
new dial. Before that, you have never seen them and they show in full.

SAID "TAP TO READ THE REST" AT FIRST, AND THE REAL CARD KILLED IT. One row above
the fold, the Cartel's name mechanic prints "HOW YOU GET THE REST -> NOTHING.
EVER." Two different "the rest", one line apart, on a 390px phone. Nothing but
looking at the rendered pixels finds that (VERIFY ON THE REAL SURFACE, 7/18) --
it is not a bug in either row, it is a collision that only exists once they are
neighbours. The affordance is "tap to read" now.

NOTHING IS DELETED. The folded rows collapse to ONE line that says what is
behind it and opens on tap. Progressive disclosure is DEFER, never DROP -- and
this repo's own history (the 8/9 authored-but-unread gate, written by this lane)
is exactly about the cost of information nobody can reach.

AND ONE ROW IS JUST REDUNDANT: the card's HEADING is the person's trade word
("WATCH"), and a TRADE row underneath repeated it verbatim. That is not
disclosure, it is a duplicate, and it goes.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_CARDFOLD__'

# ---- the fold state + the folding row helper -----------------------------
HELPERS_ANCHOR = 'function ctFavourOf(rule, given){'
HELPERS = '''/* ''' + MARKER + ''' -- THE TERMS FOLD ONCE YOU HAVE READ THEM.
   Nielsen 2006 (progressive disclosure) + Cowan 2001 (~4 chunks): show the live
   question, defer the reference. A fact about the OUTFIT belongs to the outfit,
   not to every person in it -- THEY WANT / THEY HOLD / PAID IN / CAREFUL are
   identical on every member of that outfit forever, and you read terms once.
   Measured before this: 22 rows and 808px of an 844px screen. */
var CT_TERMS_OPEN = false;
function ctTermsFolded(given){
  /* folded once you have ANY standing -- the moment you have demonstrably
     already acted on their terms. Read off state that already exists: no new
     save field, no new dial. */
  return (given|0) > 0 && !CT_TERMS_OPEN;
}
function ctFavourOf(rule, given){'''

# ---- the terms rows themselves -------------------------------------------
OLD_TERMS = """      body += ctRow('THEY WANT', bar.wantWord);
      if(bar.holds) body += ctRow('THEY HOLD', bar.holds.split('.')[0]);
      if(bar.pays) body += ctRow('PAID IN', bar.pays);
      if(bar.refuses) body += ctRow('WILL NOT TAKE', bar.refuses);
      if(bar.theyFirst) body += ctRow('CAREFUL', 'THEY HELP YOU BEFORE YOU AGREE TO ANYTHING');"""
NEW_TERMS = """      /* """ + MARKER + """ -- the terms of the bargain, read once. */
      /* THE STANDING IS READ HERE, NOT TAKEN FROM ctGave. ctGave is assigned
         further DOWN this function, so `var` hoisting left it undefined at this
         point and the fold silently never fired -- the third time this exact
         use-before-assign class has bitten this file. Order is a fact. */
      if(ctTermsFolded(BohemiaBelonging.gaveOf(bState.sv, ctFid))){
        /* THE WHOLE ROW IS THE TAP TARGET, NOT THE WORDS. Measured on a real
           touch page: the underlined span alone is 153x14px, and Apple's HIG
           minimum is 44x44. Playwright's tap() hits dead centre and passed;
           a thumb would not. The row is ~44px, so the row takes the tap and
           the underline stays as the thing that says it is tappable. */
        body += '<div class="r" id="ctterms" style="cursor:pointer;padding:15px 0;margin-top:0">'
          + '<div class="k">THEIR TERMS</div><div class="v">'
          + '<span style="text-decoration:underline">' + bar.wantWord
          + ' &middot; tap to read</span></div></div>';
      } else {
        body += ctRow('THEY WANT', bar.wantWord);
        if(bar.holds) body += ctRow('THEY HOLD', bar.holds.split('.')[0]);
        if(bar.pays) body += ctRow('PAID IN', bar.pays);
        if(bar.refuses) body += ctRow('WILL NOT TAKE', bar.refuses);
        if(bar.theyFirst) body += ctRow('CAREFUL', 'THEY HELP YOU BEFORE YOU AGREE TO ANYTHING');
      }"""

# ---- the duplicate TRADE row ---------------------------------------------
OLD_TRADE = """  body+=ctRow('TRADE', BohemiaPeople.ROLE_WORDS[who.role]||'SOMEBODY');"""
NEW_TRADE = """  /* """ + MARKER + """ -- the heading above IS the trade word, so this row said
     the same thing twice. A duplicate is not disclosure. */
  var ctTradeWord = BohemiaPeople.ROLE_WORDS[who.role]||'SOMEBODY';
  if(String(ctTradeWord).toUpperCase() !== String(nm?nm:BohemiaPeople.headingOf(who)).toUpperCase())
    body+=ctRow('TRADE', ctTradeWord);"""

# ---- the toggle ----------------------------------------------------------
OLD_WIRE = """  /* __CITY_FAVOUR__ */
  var fav=document.getElementById('ctfavour');"""
NEW_WIRE = """  /* """ + MARKER + """ -- DEFER, NEVER DROP. Everything folded is one tap away. */
  var tt=document.getElementById('ctterms');
  if(tt) tt.addEventListener('click',function(ev){
    ev.stopPropagation(); CT_TERMS_OPEN = true; ctDraw(); });
  /* __CITY_FAVOUR__ */
  var fav=document.getElementById('ctfavour');"""

# reopening a card is a fresh read: the fold resets so it never sticks open
OLD_OPENFN = """function ctOpen(){"""
NEW_OPENFN = """function ctOpen(){
  CT_TERMS_OPEN = false;   /* """ + MARKER + """: each card opens folded */"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((HELPERS_ANCHOR, HELPERS, 'the fold state'),
                           (OLD_TERMS, NEW_TERMS, 'the terms rows'),
                           (OLD_TRADE, NEW_TRADE, 'the duplicate trade row'),
                           (OLD_WIRE, NEW_WIRE, 'the tap-to-read toggle'),
                           (OLD_OPENFN, NEW_OPENFN, 'the per-card reset')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY CARDFOLD: the terms fold once read, the duplicate row is gone')


if __name__ == '__main__':
    main()
