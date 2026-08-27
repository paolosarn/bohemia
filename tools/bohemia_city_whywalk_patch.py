#!/usr/bin/env python3
"""
BOHEMIA CITY WHY-WALK PATCH -- A GUARD THAT COULD NOT FIRE, AND A LIST OF
DIRECTIONS WITH NO REASONS ON IT.  (8/27/26, FACTIONS lane)

Patches slices/BOHEMIA_CITY_WORLD.html. Idempotent; marker __CITY_WHYWALK__.

==========================================================================
ONE. THE GUARD IN ctBases() COMPARES TWO CONSTANTS.
==========================================================================
    function ctBases(){
      if(String(BOH_SEED_TEXT) !== String(CT_BASES_SEED)) return null;
      return CT_BASES_BAKED;
    }
BOH_SEED_TEXT is `const BOH_SEED_TEXT='bohemia'`. CT_BASES_SEED is baked as
"bohemia". Neither can ever change. THE CHECK CAN NEVER FIRE.

Its own comment says what it is for: "keyed to the seed TEXT they were
produced for: a different seed gets NULL rather than a confidently wrong
answer." The intent is right and the variable is wrong.

WHAT ACTUALLY MAKES A DIFFERENT WORLD IS `seed`, NOT `BOH_SEED_TEXT`:
    let seed = BOH_ONE_SEED();                       // boot, from the text
    ...
    seed=(seed*1103515245+12345)>>>0;                // REROLL, one LCG step
REROLL builds a whole new overmap off that number and never touches the text.
So after a reroll the baked bases describe a world that no longer exists, and
the guard written to catch exactly that watches a variable that cannot move.

MEASURED, so this is not a story about what might happen: booted the city,
recorded the census, pressed the real REROLL button, recorded it again.
    seed 2691674296 -> 3182853632      the world IS new
    ctBases() null? false -> false     the guard never fired
The people and the assignment come out identical, so the damage is not that
factions vanish -- it is that the bases now sit on whatever terrain the new
overmap put under those coordinates. Quieter than a crash and exactly the kind
of wrong this lane keeps finding.

THE FIX IS THE COMPARISON THE COMMENT MEANT. `BOH_ONE_SEED()` is the number
boot derived from the text, so "are we still in the world the bases were made
for" is `seed === BOH_ONE_SEED()`. The text check STAYS -- it catches a
different thing (somebody edits the seed text and forgets to re-bake).

AND WHEN IT FIRES IT SAYS SO. Returning null silently is how this lane lost
thirteen days: factionOf answered null for every person in the valley and
"nobody runs with anybody" is indistinguishable from a world where nobody
does. A guard that goes quiet is the bug it was written to prevent. The board
now prints why it is empty, and it prints it once to the console.

==========================================================================
TWO. THE VALLEY LIST TOLD HIM WHERE TO WALK AND NEVER WHY.
==========================================================================
Yesterday's measurement: the nearest outfit is 29 cells from the spawn, which
is 3,712 tiles. Yesterday's fix put every outfit on the board with a bearing
and a distance. That makes the system FINDABLE. It does not give anybody a
reason to make that walk.

AND THE REASONS ARE ALREADY WRITTEN. engine/bohemia_belonging.js RULES carries,
for all sixteen outfits:
    anchorWant  one line on what they want from you
    pays        what they give back, in his own capitals
    CARTEL   "They want you to OWE them"  ->  WHATEVER YOU NEEDED THAT WEEK
    REDS     "A counterparty. They want you solvent, productive and slightly
              in debt"                    ->  CREDIT
    CHURCH   "You inside the structure"   ->  STORED FOOD AND A PLACE ON THE LIST
    COLORFUL "To know whether you are safe to be around"
                                          ->  A NETWORK INSIDE EVERY OTHER FACTION
Every one of those is on the card of somebody you have ALREADY MET -- which is
to say, it is shown to you only after you have already made the walk it would
have justified. Same shape as the four garments cooked for the Colorful in
July and worn by nobody for five weeks: THE MATERIAL EXISTED AND NEVER REACHED
THE PLAYER AT THE MOMENT IT WOULD HAVE MATTERED.

So the board says it now, for every outfit, before you go. Nothing is written
here; it is read out of the rules table and shown one screen earlier.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_WHYWALK__'

# ---------------------------------------------------------------- 1. THE GUARD
OLD_GUARD = """function ctBases(){
  if(String(BOH_SEED_TEXT) !== String(CT_BASES_SEED)) return null;
  return CT_BASES_BAKED;
}"""

NEW_GUARD = """function ctBases(){
  /* """ + MARKER + """ -- THIS CHECK COULD NOT FIRE.
     It compared BOH_SEED_TEXT (a const, 'bohemia') against CT_BASES_SEED
     (baked, "bohemia"). Two constants. Its own comment says what it is for --
     "a different seed gets NULL rather than a confidently wrong answer" --
     and the intent is right while the variable is wrong.
     WHAT MAKES A DIFFERENT WORLD IS `seed`:
         let seed = BOH_ONE_SEED();            // boot, derived from the text
         seed=(seed*1103515245+12345)>>>0;     // REROLL, one LCG step
     REROLL builds an entire new overmap off that number and never touches the
     text, so the bases end up describing a world that no longer exists while
     the guard watches a variable that cannot move.
     MEASURED by pressing the real button: seed 2691674296 -> 3182853632, and
     ctBases() went on answering. Both checks are kept -- the text one catches
     somebody editing the seed and forgetting to re-bake, this one catches the
     world moving underneath the bake. */
  if(String(BOH_SEED_TEXT) !== String(CT_BASES_SEED)) return null;
  try {
    if(typeof seed !== 'undefined' && typeof BOH_ONE_SEED === 'function'
       && (seed >>> 0) !== (BOH_ONE_SEED() >>> 0)){
      /* AND IT SAYS SO, ONCE. Returning null in silence is how this lane lost
         thirteen days: factionOf answered null for all 166 people and "nobody
         in Las Vegas runs with anybody" looks exactly like a world where
         nobody does. A guard that goes quiet IS the bug it was written to
         prevent. */
      if(!ctBases.__said){
        ctBases.__said = 1;
        console.warn('BOHEMIA: the world was rerolled, so the baked faction '
          + 'bases are for a world that no longer exists. Nobody will run with '
          + 'anybody until the city is re-baked (tools/bohemia_city_factions_'
          + 'patch.py). This is a builder-tool consequence, not a save bug.');
      }
      return null;
    }
  } catch(_e){}
  return CT_BASES_BAKED;
}
/* """ + MARKER + """ -- and the ONE place that can explain an empty valley.
   Kept beside the guard rather than inside the board, so the board and the
   console cannot drift into two different explanations of one fact. */
function ctBasesWhyNone(){
  try {
    if(String(BOH_SEED_TEXT) !== String(CT_BASES_SEED))
      return 'THE FACTION GROUND WAS BAKED FOR A DIFFERENT SEED. Nobody runs '
           + 'with anybody until the city is re-baked.';
    if(typeof seed !== 'undefined' && typeof BOH_ONE_SEED === 'function'
       && (seed >>> 0) !== (BOH_ONE_SEED() >>> 0))
      return 'YOU REROLLED THE WORLD. The outfits\\' ground was mapped for the '
           + 'valley that was here before, so none of it applies any more and '
           + 'nobody runs with anybody. Reload to get that valley back.';
  } catch(_e){}
  return null;
}"""

# ------------------------------------------------- 2. THE REASON TO WALK THERE
OLD_ROW = """    h += '<div class="obv' + (r.mine ? ' isyours' : '') + '">'
       + '<span class="obvwho">' + r.who + '</span>'
       + '<span class="obvwhere">' + r.where + ' \\u00b7 ' + r.far + '</span>'
       + '<span class="obvmet">' + (r.mine ? '' : (r.met ? 'YOU HAVE DEALT WITH THEM'
                                                         : 'NEVER MET')) + '</span>'
       + '</div>';"""

NEW_ROW = """    h += '<div class="obv' + (r.mine ? ' isyours' : '') + '">'
       + '<span class="obvwho">' + r.who + '</span>'
       + '<span class="obvwhere">' + r.where + ' \\u00b7 ' + r.far + '</span>'
       + '<span class="obvmet">' + (r.mine ? '' : (r.met ? 'YOU HAVE DEALT WITH THEM'
                                                         : 'NEVER MET')) + '</span>'
       + '</div>'
       /* """ + MARKER + """ -- AND WHY YOU WOULD MAKE THAT WALK.
          The nearest of these is 29 cells from the spawn, which is 3,712
          tiles. A bearing tells him where; it does not tell him what is at the
          end of it. Both answers are already written in bohemia_belonging's
          RULES (anchorWant, pays) and both were only ever shown on the card of
          somebody he had ALREADY MET -- shown, in other words, one walk too
          late. Nothing is authored here; it is read out of the table and
          printed one screen earlier. */
       + (r.want || r.pays
            ? '<div class="obvwhy">'
              + (r.want ? '<span class="obvwant">' + r.want + '</span>' : '')
              + (r.pays ? '<span class="obvpays">THEY PAY: ' + r.pays + '</span>' : '')
              + '</div>'
            : '');"""

OLD_ROWSPUSH = """    out.push({ who:String(name).toUpperCase(), cells:d, mine:isMine,
               where:isMine ? 'YOURS' : ctBearing(dx, dy),
               far:isMine ? 'THIS IS YOUR GROUND' : ctFarWord(d),
               met:ctMetAnyOf(name) });"""

NEW_ROWSPUSH = """    /* """ + MARKER + """ -- what they want and what they pay, read from the
       rules table. A missing rule is a real answer (not every base on the map
       has one) and prints nothing rather than an empty label. */
    var rule = null;
    try { if(typeof BohemiaBelonging !== 'undefined')
            rule = BohemiaBelonging.ruleOf(name); } catch(_e){}
    out.push({ who:String(name).toUpperCase(), cells:d, mine:isMine,
               where:isMine ? 'YOURS' : ctBearing(dx, dy),
               far:isMine ? 'THIS IS YOUR GROUND' : ctFarWord(d),
               want:(isMine || !rule) ? null : (rule.anchorWant || null),
               pays:(isMine || !rule) ? null : (rule.pays || null),
               met:ctMetAnyOf(name) });"""

# and the board explains an empty valley instead of rendering nothing
OLD_EMPTYVALLEY = """function ctValleyHtml(){
  var rows = ctValleyRows();
  if(!rows || !rows.length) return '';"""

NEW_EMPTYVALLEY = """function ctValleyHtml(){
  var rows = ctValleyRows();
  if(!rows || !rows.length){
    /* """ + MARKER + """ -- AN EMPTY VALLEY IS EXPLAINED, NEVER BLANK.
       ctValleyRows returns null when ctBases() does, and the only reason that
       happens is a guard firing. Rendering '' there would show him a board
       with a missing half and no way to know why -- which is the silent-null
       failure this lane already paid thirteen days for, moved up one level. */
    var why = (typeof ctBasesWhyNone === 'function') ? ctBasesWhyNone() : null;
    return why ? '<div class="obhead2">THE VALLEY</div>'
                 + '<div class="obempty">' + why + '</div>'
               : '';
  }"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: no ' + CITY)
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    if '__CITY_VALLEY__' not in s:
        sys.exit('FAIL: the valley board is not in this city -- run '
                 'tools/bohemia_city_valley_patch.py first')

    for old, new, what in ((OLD_GUARD, NEW_GUARD, 'the ctBases guard'),
                           (OLD_ROWSPUSH, NEW_ROWSPUSH, 'the valley row build'),
                           (OLD_ROW, NEW_ROW, 'the valley row render'),
                           (OLD_EMPTYVALLEY, NEW_EMPTYVALLEY, 'the empty valley')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)

    css_at = '/* ==== __CITY_VALLEY__ -- the valley half of the board.'
    if css_at not in s:
        sys.exit('FAIL: could not find the valley css')
    s = s.replace(css_at, """
/* ==== """ + MARKER + """ -- the reason-to-walk lines. Same tokens, and the
   row grows downward rather than sideways so a long want does not squeeze the
   bearing off the right edge of a phone. */
#outfitpanel .obv{flex-wrap:wrap}
#outfitpanel .obvwhy{flex:1 1 100%;padding:3px 0 1px;line-height:1.5}
#outfitpanel .obvwant{display:block;font-size:9px;opacity:.75}
#outfitpanel .obvpays{display:block;font-size:9px;color:var(--acc);opacity:.9;
  letter-spacing:1px;padding-top:2px}
""" + css_at, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY WHY-WALK:')
    print('  + the ctBases guard can actually fire now, and it says so when it does')
    print('  + the valley list says what each outfit wants and what it pays')
    print('  TAB: RUN, the ⚔ OUTFIT chip.')


if __name__ == '__main__':
    main()
