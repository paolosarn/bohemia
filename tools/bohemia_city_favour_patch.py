#!/usr/bin/env python3
"""
BOHEMIA CITY FAVOUR PATCH -- the ladder finally points at something.
(8/16/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_WHAT_YOU_CAN_ASK_OF_THEM_8_16_26.md
Gate: gates/favour_gate.js

REUSE CHECK (REUSE-FIRST): cooks no pixels. Wires the generated
engine/bohemia_favour.js onto the existing person card. Nothing is rebuilt.

WHY THE REFUSAL IS PRINTED RATHER THAN THE BUTTON JUST BEING ABSENT. A button
that silently is not there teaches nobody anything -- the player cannot tell an
outfit that will never give from one that has not counted them yet, and those
are completely different facts about the world. So the card always says what
this outfit holds and, when it will not hand it over, why not.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_FAVOUR__'
MODULE = 'engine/bohemia_favour.js'
INJECT_AT = '/* ==== engine/bohemia_claim.js ==== */'

HELPERS_ANCHOR = 'function ctClaimWindow(){'
HELPERS = '''/* ''' + MARKER + ''' -- WHAT YOU CAN ASK OF THEM.
   Scott 1972 / Eisenstadt & Roniger 1984: a patron tie is not a transaction, it
   is a RUNNING ACCOUNT -- "long-range credit and obligations". His own Cartel
   dossier wrote that mechanic on 8/2 before any of this existed: "They want you
   to OWE them... the first thing they give you is free and it is exactly the
   thing you needed that week."
   The three economies are read off his firstMove axis, which until now only
   produced one warning row on this card. */
function ctFavourOf(rule, given){
  if(typeof BohemiaFavour === 'undefined' || !rule) return null;
  return BohemiaFavour.askFor(rule, given, ctBelongSave());
}
function ctFavourRows(body, rule, given){
  if(typeof BohemiaFavour === 'undefined' || !rule) return body;
  var sv = ctBelongSave();
  var owed = BohemiaFavour.owedRow(sv, rule.key);
  if(owed) body += ctRow(owed.word, owed.note);
  var a = ctFavourOf(rule, given);
  if(!a) return body;
  if(a.can){
    body += ctRow(a.word, a.what);
    if(a.note) body += ctRow('', a.note);
  } else if(a.why){
    /* THE REFUSAL IS A ROW, NOT AN ABSENCE. "they will never give anybody
       anything" and "they do not know you well enough yet" are different facts
       and a missing button says neither. */
    body += ctRow('YOU CANNOT ASK', a.why);
  }
  return body;
}

''' + HELPERS_ANCHOR

# the rows go under the claim, so the card reads: what they want -> where you
# stand -> what they are asking -> what you can ask.
OLD_ROWS = """      body = ctClaimRows(body, bRule, ctFid, ctGave);
      var ctClaim = ctClaimOf(bRule, ctGave);"""
NEW_ROWS = """      body = ctClaimRows(body, bRule, ctFid, ctGave);
      var ctClaim = ctClaimOf(bRule, ctGave);
      /* """ + MARKER + """ -- and the other direction: what THEY hold for YOU. */
      body = ctFavourRows(body, bRule, ctGave);
      var ctFav = ctFavourOf(bRule, ctGave);
      /* ONE GESTURE, ONE BUTTON. For an outfit whose WANT is `debt`, TAKING
         their help IS the thing they want from you, so the act and the favour
         are the same motion -- the card was offering it twice ("Take what they
         are offering" beside "Take it"). That is not a wiring accident to paper
         over, it is his Cartel canon being cleverer than the wiring: with them,
         helping yourself is how you climb and every rung is a debt.
         Computed HERE, above the buttons, because `var` hoisting would have
         left it undefined at the first button that reads it and the suppression
         would have silently never fired. */
"""

OLD_BTN = """  if(ctClaim){
    body+='<button id="ctclaimyes">'+ctClaim.yes+'</button>';
    body+='<button id="ctclaimno">'+ctClaim.no+'</button>';
  }"""
NEW_BTN = """  if(ctClaim){
    body+='<button id="ctclaimyes">'+ctClaim.yes+'</button>';
    body+='<button id="ctclaimno">'+ctClaim.no+'</button>';
  }
  /* """ + MARKER + """ -- the favour button absorbs the act when they are one
     gesture (see where ctFavIsAct is computed) and fires both halves. */
  if(ctFav && ctFav.can)
    body+='<button id="ctfavour">'+(ctFavIsAct ? ctAct.label : ctFav.label)+'</button>';"""

OLD_ASSIGN = """      ctAct = BohemiaBelonging.actFor(bRule, bState.st);"""
NEW_ASSIGN = ("""      ctAct = BohemiaBelonging.actFor(bRule, bState.st);
      /* """ + MARKER + """ -- ONE GESTURE, ONE BUTTON, and it has to be computed
         HERE, after ctAct is actually assigned. For an outfit whose WANT is
         `debt`, TAKING their help IS the thing they want from you, so the act
         and the favour are the same motion and the card was offering it twice
         ("Take what they are offering" beside "Take it"). That is not a wiring
         accident to paper over -- it is his Cartel canon being cleverer than the
         wiring: with them, helping yourself is how you climb and every rung is a
         debt.
         BOTH must exist: ctAct is null whenever a precondition blocks the act
         (not on their ground, nothing to tell them, already gave today) while
         the favour is still takeable, and the first version read .label off that
         null and threw on the real card. */
      var ctFavIsAct = !!(ctFav && ctFav.can && ctFav.owes && ctAct
                      && bRule.wants === 'debt');""")

OLD_ACT = """  if(ctAct) body+='<button id="ctgive">'+ctAct.label+'</button>';"""
NEW_ACT = ("""  /* """ + MARKER + """ -- ctFavIsAct is set above, with ctAct. It is NOT
     re-declared here: `var` hoists, so a second `var x = false` at this line
     would run AFTER the assignment above and clobber it back to false, and the
     suppression would silently never fire. Undefined here (when there is no
     bargain at all) reads as false, which is the safe default: show the act. */
  if(ctAct && !ctFavIsAct) body+='<button id="ctgive">'+ctAct.label+'</button>';""")

OLD_WIRE = """  /* __CITY_CLAIM__ */
  function ctAnswerClaim(said){"""
NEW_WIRE = """  /* """ + MARKER + """ */
  var fav=document.getElementById('ctfavour');
  if(fav) fav.addEventListener('click',function(){
    var sv=ctBelongSave();
    var r=BohemiaFavour.take(bRule, BohemiaBelonging.gaveOf(sv, ctFid), sv);
    /* ONE WRITER FOR THE COUNT, same law the refused claim follows: the favour
       returns a DELTA and bohemia_belonging moves it. */
    if(r.took && r.delta) BohemiaBelonging.adjust(sv, ctFid, r.delta);
    /* the same motion counts as the act for a debt outfit -- one press, both
       halves, and the count still moves through its one writer. */
    if(r.took && ctFavIsAct) BohemiaBelonging.record(sv, ctFid, T.day||1);
    advance(60);
    ctDraw(); render();
  });
  /* __CITY_CLAIM__ */
  function ctAnswerClaim(said){"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    if not os.path.exists(MODULE):
        sys.exit('FAIL: missing ' + MODULE)

    body = ('/* ==== engine/' + os.path.basename(MODULE) + ' ==== */\n'
            + open(MODULE, encoding='utf-8').read())
    if INJECT_AT not in s:
        sys.exit('FAIL: could not find the lane module block to inject beside')
    s = s.replace(INJECT_AT, body + '\n' + INJECT_AT, 1)

    for old, new, what in ((HELPERS_ANCHOR, HELPERS, 'the favour helpers'),
                           (OLD_ROWS, NEW_ROWS, 'the favour rows'),
                           (OLD_ASSIGN, NEW_ASSIGN, 'the one-gesture merge'),
                           (OLD_ACT, NEW_ACT, 'the act button (deduped)'),
                           (OLD_BTN, NEW_BTN, 'the ask button'),
                           (OLD_WIRE, NEW_WIRE, 'the ask wiring')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY FAVOUR: you can ask them for something now')
    print('  + ' + MODULE)


if __name__ == '__main__':
    main()
