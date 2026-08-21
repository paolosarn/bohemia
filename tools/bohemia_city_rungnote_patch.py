#!/usr/bin/env python3
"""
BOHEMIA CITY RUNG-NOTE PATCH -- five authored sentences say what each rung MEANS,
and the card has never shown one of them. (8/21/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md (sec 4m)
Gate: gates/faction_arc_gate.js (part P, new)

REUSE CHECK (REUSE-FIRST): cooks nothing, writes no words, invents no mechanic.
Every sentence here is HIS, already in bohemia_belonging.js RUNGS[].note since the
ladder shipped. This renders them. The fold it renders through is
__CITY_NOTESFOLD__ (8/20), unchanged.

--------------------------------------------------------------------------
THE ELEVENTH, AND IT IS AUTHORED CONTENT RATHER THAN AN ORGAN
--------------------------------------------------------------------------
    rg 'rung\\.note' slices/BOHEMIA_CITY_WORLD.html   ->   NOTHING

Ten times this week an organ computed something nothing called. This is the same
shape one layer up: SOMEBODY WROTE THE WORDS AND NO SURFACE ASKS FOR THEM. The
card prints bar.rung.word -- one word, "USEFUL", "COUNTED", "INSIDE" -- and the
sentence explaining what that word costs and means has sat unread beside it.

    A STRANGER               They have no reason to think about you.
    SOMEBODY WHO SHOWED UP   You did the thing once. [citation] this is the whole
                             entry, and it is meant to be small.
    USEFUL                   Three times is a pattern. They start expecting you.
    COUNTED                  You are on whatever list they keep. That is a
                             different thing from being liked.
    INSIDE                   The newcomer is the old-timer now, and the next
                             newcomer is your problem.

The organ sweep cannot see this class: note is DATA, not a function, so it has no
call site to count. A GATE THAT COUNTS CALLERS CANNOT FIND UNREAD PROSE -- worth
saying out loud, because the sweep shipped this morning and would have reported
this file perfectly healthy.

--------------------------------------------------------------------------
AND THE FIELD IS DOING TWO JOBS, WHICH IS WHY IT WAS NEVER RENDERED
--------------------------------------------------------------------------
Four of the five are player copy. ONE carries a research citation mid-sentence --
it is half player copy and half author's note to himself, and putting a
bibliography on a person's card would read as a bug to anybody holding the phone.

That is very likely the actual reason this never got wired: whoever looked at it
saw one note they could not ship and dropped all five.

WHAT THIS DOES ABOUT IT IS MECHANICAL, NEVER AUTHORIAL. A leading "Name & Name:"
citation clause is DROPPED FROM THE CARD ONLY. His sentence is not rewritten,
nothing is paraphrased, and the note keeps its full original text everywhere else
so the WORDS tab still shows him the whole thing to edit. Splitting off a
bibliographic aside is punctuation, not writing. MECHANISM-MINE / CONTENTS-PAOLO'S.

If he wants the citation on the card, it is one edit in the WORDS tab and this
does not fight him.

--------------------------------------------------------------------------
IT FOLDS, BECAUSE IT IS AN EXPLAINER
--------------------------------------------------------------------------
The rung WORD is live -- it changes as you climb. The sentence under it is a
property of the RUNG, identical for every member of every outfit at that rung
forever, which is word for word the test __CITY_NOTESFOLD__ applies. So it rides
the terms fold with the other explainers and costs the card nothing until tapped.
THE PERSON CARD HAS NO HEADROOM: the fullest reachable card sits at 88% and this
lane has broken its own bar three times in three days.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_RUNGNOTE__'

# The rung row already handles two cases (the history override, and the plain
# word). The note goes after whichever fired, so both paths get it.
OLD = """      else if(bar.rung && ctLadder
              && !(ctWall && ctWall.atWall && ctWall.blocks
                   && String(ctWall.reaches) === String(bar.rung.word)))
        body += ctRow('YOU ARE', bar.rung.word
        + ((bar.next && (!ctWall || !ctWall.atWall))
             ? (' \\u00b7 '+bar.next.more+' MORE TO '+bar.next.rung.word) : ''));"""
NEW = """      else if(bar.rung && ctLadder
              && !(ctWall && ctWall.atWall && ctWall.blocks
                   && String(ctWall.reaches) === String(bar.rung.word)))
        body += ctRow('YOU ARE', bar.rung.word
        + ((bar.next && (!ctWall || !ctWall.atWall))
             ? (' \\u00b7 '+bar.next.more+' MORE TO '+bar.next.rung.word) : ''));
      /* """ + MARKER + """ -- AND WHAT THAT WORD MEANS, which he wrote when the
         ladder shipped and no surface has ever asked for. The card printed one
         word -- USEFUL, COUNTED, INSIDE -- and left the sentence saying what it
         costs you sitting unread beside it. The organ sweep cannot find this
         class: a note is DATA, so it has no call site to count.
         Folds with the terms, because the WORD is live and the sentence under it
         is a property of the RUNG -- identical on every member of every outfit at
         that rung, forever, which is the fold's own test. */
      if(bar.rung && ctLadder) body += ctNote(ctRungNote(bar.rung));"""

HELPERS_ANCHOR = 'function ctOnwardWho(p, fid){'
HELPERS = '''/* ''' + MARKER + ''' -- HIS SENTENCE, MINUS A BIBLIOGRAPHY.
   Four of the five rung notes are player copy. ONE carries a research citation
   mid-sentence -- half player copy, half author's note to himself -- and a
   bibliography on a person's card reads as a bug to whoever is holding the phone.
   That is very likely why all five were dropped instead of one.
   THIS IS MECHANICAL, NEVER AUTHORIAL: a "Name & Name:" clause is dropped FROM
   THE CARD ONLY. Nothing is rewritten or paraphrased, and the note keeps its full
   original text everywhere else, so the WORDS tab still hands him the whole thing
   to edit. Splitting off a bibliographic aside is punctuation, not writing. */
function ctRungNote(rung){
  var s = String((rung && rung.note) || '');
  /* "Lastname & Lastname: " or "Lastname 1991: " -- a citation, not a sentence */
  var cut = s.replace(/(^|\\.\\s+)[A-Z][A-Za-z]+(\\s*&\\s*[A-Z][A-Za-z]+|\\s+\\d{4})[^:]{0,20}:\\s*/g, '$1');
  /* dropping the clause leaves the next sentence starting lower-case ("You did
     the thing once. this is the whole entry"), which reads as broken copy. Only
     ever applied where the strip actually fired, and capitalising after a full
     stop is the same class of repair as removing the aside: punctuation, not
     writing. His words are untouched. */
  if(cut !== s) cut = cut.replace(/(^|\\.\\s+)([a-z])/g,
                    function(_m, a, c){ return a + c.toUpperCase(); });
  return cut.trim();
}
''' + HELPERS_ANCHOR


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((HELPERS_ANCHOR, HELPERS, 'the note helper'),
                           (OLD, NEW, 'the rung row')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY RUNGNOTE: five authored sentences reach the card')


if __name__ == '__main__':
    main()
