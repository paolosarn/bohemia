#!/usr/bin/env python3
"""
BOHEMIA CITY COLLECT PATCH -- the debt gets called in.  (8/18/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_THE_DEBT_GETS_CALLED_IN_8_18_26.md
Gate: gates/claim_gate.js (extended), gates/favour_gate.js

REUSE CHECK (REUSE-FIRST): cooks no pixels, builds no mechanism. It passes one
NUMBER -- what you owe -- from the ledger that owns it (bohemia_favour) into the
module that owns asking (bohemia_claim), and applies the settlement back through
the ledger's own writer. Nothing is duplicated and neither module reaches into
the other's store.

WHY THE NUMBER IS PASSED RATHER THAN LOOKED UP. bohemia_claim could import
bohemia_favour and read the debt itself, and that would be one import and a
circular dependency waiting to happen (favour already anchors on claim). Passing
an int keeps the direction of knowledge one-way: the surface knows both, each
organ knows only its own facts.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_COLLECT__'

# ---- the ask now knows what you owe --------------------------------------
OLD_OPEN = """function ctOpenClaim(fid){
  if(typeof BohemiaClaim === 'undefined' || !fid) return null;
  try { return BohemiaClaim.open(ctBelongSave(), fid, (T && T.day) || 1,
                                 ctClaimWindow(), {}); }
  catch(_e){ return null; }
}"""
NEW_OPEN = """function ctOwedTo(fid){
  if(typeof BohemiaFavour === 'undefined' || !fid) return 0;
  try { return BohemiaFavour.owedOf(ctBelongSave(), fid)|0; } catch(_e){ return 0; }
}
function ctOpenClaim(fid){
  if(typeof BohemiaClaim === 'undefined' || !fid) return null;
  /* """ + MARKER + """ -- AN OUTFIT YOU OWE DOES NOT WAIT ITS TURN. The debt is
     read from the ledger that owns it and handed to the module that owns asking;
     neither reaches into the other's store. */
  try { return BohemiaClaim.open(ctBelongSave(), fid, (T && T.day) || 1,
                                 ctClaimWindow(), {}, ctOwedTo(fid)); }
  catch(_e){ return null; }
}"""

# ---- the answer costs more, or pays down ---------------------------------
OLD_ANSWER = """  function ctAnswerClaim(said){
    var sv=ctBelongSave();
    var r=BohemiaClaim.answer(sv, ctFid, said, BohemiaBelonging.gaveOf(sv, ctFid));"""
NEW_ANSWER = """  function ctAnswerClaim(said){
    var sv=ctBelongSave();
    /* """ + MARKER + """ -- what you owe decides what a refusal costs, and a
       claim you MEET works some of it off. */
    var owed=ctOwedTo(ctFid);
    var r=BohemiaClaim.answer(sv, ctFid, said, BohemiaBelonging.gaveOf(sv, ctFid), owed);
    if(r.answered && r.settle && typeof BohemiaFavour !== 'undefined')
      BohemiaFavour.settle(sv, ctFid, r.settle);"""

# ---- and the card says they are not waiting ------------------------------
OLD_ROWS = """  body += ctRow(c.ask, c.what);
  body += ctRow('', c.askNote);
  body += ctRow(c.dueWord, c.dueNote || 'TODAY.');
  return body;"""
NEW_ROWS = """  body += ctRow(c.ask, c.what);
  body += ctRow('', c.askNote);
  body += ctRow(c.dueWord, c.dueNote || 'TODAY.');
  /* """ + MARKER + """ -- and WHY they are asking again so soon. Without this row
     the bypass is invisible: the player just sees an outfit that will not leave
     them alone and cannot tell it is the free thing they took, which is the one
     fact that would have made it a decision. */
  if(BohemiaClaim.WORDS.owing && ctOwedTo(rule.key) > 0)
    body += ctRow(BohemiaClaim.WORDS.owing, BohemiaClaim.WORDS.owing_note);
  return body;"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((OLD_OPEN, NEW_OPEN, 'the ask (owed passed in)'),
                           (OLD_ANSWER, NEW_ANSWER, 'the answer (cost + settle)'),
                           (OLD_ROWS, NEW_ROWS, 'the not-waiting row')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY COLLECT: the debt gets called in')


if __name__ == '__main__':
    main()
