#!/usr/bin/env python3
"""
BOHEMIA CITY CLAIM PATCH -- the outfit asks YOU, on the surface he walks.
(8/16/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_WHAT_BEING_INSIDE_COSTS_8_16_26.md
Gate: gates/claim_gate.js

REUSE CHECK (REUSE-FIRST): cooks no pixels. Wires an existing organ
(engine/bohemia_claim.js, generated) onto an existing card. Nothing is rebuilt.

WHY A CLAIM OPENS WHERE IT DOES. A surface has to decide WHEN an outfit starts
asking, and the honest place is the moment the game can see you are counted --
which is when you open the card of somebody who runs with them. No timer, no
background tick, no roll: you walk into the person, and the person's outfit has
something to say. That also means the ask can never arrive somewhere you cannot
answer it.

THE RATION LIMITS ARE NOT SET HERE EITHER. bohemia_claim refuses to invent them
and so does this: the surface passes `{}` , which makeRation reads as unlimited,
and the day Paolo rules item (c) of the 7/26 verdict the number lands in ONE
place. An unlimited ration still EXERCISES the pipe (EVERYTHING COSTS ONE sec 4:
a cost that is skipped teaches us nothing), it just never refuses yet.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_CLAIM__'
MODULE = 'engine/bohemia_claim.js'

INJECT_AT = '/* ==== engine/bohemia_commitment.js ==== */'

# ---- the helpers, next to the lane's others -------------------------------
HELPERS_ANCHOR = 'function ctHearRows(body, fid){'
HELPERS = '''/* ''' + MARKER + ''' -- WHAT THEY ASK OF YOU.
   Portes 1998's second dark side of social capital: EXCESS CLAIMS ON GROUP
   MEMBERS. Every faction system models what you spend to get in; almost none
   models the outfit leaning back on you once you are in. Once they COUNT you,
   they start asking, and saying no costs the rung that made you worth asking.

   THE LIMITS ARE PASSED EMPTY ON PURPOSE. How many times a week an outfit may
   lean on you is item (c) of the 7/26 lab verdict and still [PENDING Paolo].
   makeRation reads {} as unlimited, so the pipe RUNS and simply never refuses
   yet -- which is the shape EVERYTHING COSTS ONE asks for, not a bypass. */
function ctClaimWindow(){
  var d = (T && T.day) || 1;
  return { day: d, week: Math.floor((d - 1) / 7) + 1 };
}
function ctOpenClaim(fid){
  if(typeof BohemiaClaim === 'undefined' || !fid) return null;
  try { return BohemiaClaim.open(ctBelongSave(), fid, (T && T.day) || 1,
                                 ctClaimWindow(), {}); }
  catch(_e){ return null; }
}
/* THEY ASK WHEN YOU WALK INTO THEM. No tick, no timer, no roll -- the ask can
   never arrive somewhere you are not standing to answer it. */
function ctClaimRows(body, rule, fid, given){
  if(typeof BohemiaClaim === 'undefined' || !rule || !fid) return body;
  var sv = ctBelongSave(), day = (T && T.day) || 1;
  var c = BohemiaClaim.claimFor(rule, given, day, sv);
  if(!c){
    var idx = -1, bar = BohemiaBelonging.bargain(rule, given);
    if(bar && bar.rung)
      for(var i=0;i<BohemiaBelonging.RUNGS.length;i++)
        if(BohemiaBelonging.RUNGS[i].word === bar.rung.word) idx = i;
    if(idx >= BohemiaClaim.TRIGGER_RUNG && !BohemiaClaim.openOf(sv, rule.key))
      ctOpenClaim(rule.key);
    c = BohemiaClaim.claimFor(rule, given, day, sv);
    if(!c) return body;
  }
  body += ctRow(c.ask, c.what);
  body += ctRow('', c.askNote);
  body += ctRow(c.dueWord, c.dueNote || 'TODAY.');
  return body;
}
function ctClaimOf(rule, given){
  if(typeof BohemiaClaim === 'undefined' || !rule) return null;
  return BohemiaClaim.claimFor(rule, given, (T && T.day) || 1, ctBelongSave());
}

''' + HELPERS_ANCHOR

# ---- the rows, right after the wall so the ask leads the bargain ----------
OLD_WALL = """      if(ctWall && ctWall.state !== 'none') body += ctRow('HOW FAR IN', ctWall.word);"""
NEW_WALL = """      if(ctWall && ctWall.state !== 'none') body += ctRow('HOW FAR IN', ctWall.word);
      /* """ + MARKER + """ -- and what THEY want from you now, which only exists
         once they count you. It sits under YOU ARE because it is the consequence
         of that line, not a separate feature. */
      body = ctClaimRows(body, bRule, ctFid, ctGave);
      var ctClaim = ctClaimOf(bRule, ctGave);"""

# ---- the two buttons ------------------------------------------------------
OLD_BTN = """  if(ctWall && ctWall.atWall && ctWall.passWord && ctOnGround)
    body+='<button id="ctcommit">'+ctWall.passWord+'</button>';"""
NEW_BTN = """  if(ctWall && ctWall.atWall && ctWall.passWord && ctOnGround)
    body+='<button id="ctcommit">'+ctWall.passWord+'</button>';
  /* """ + MARKER + """ -- BOTH ANSWERS, ALWAYS. A demand you can only accept is
     not a decision, and the whole point of Portes' claim is that refusing is
     possible and expensive. */
  if(ctClaim){
    body+='<button id="ctclaimyes">'+ctClaim.yes+'</button>';
    body+='<button id="ctclaimno">'+ctClaim.no+'</button>';
  }"""

# ---- the wiring -----------------------------------------------------------
OLD_WIRE = """  /* __CITY_STANDING__ */
  var commit=document.getElementById('ctcommit');"""
NEW_WIRE = """  /* """ + MARKER + """ */
  function ctAnswerClaim(said){
    var sv=ctBelongSave();
    var r=BohemiaClaim.answer(sv, ctFid, said, BohemiaBelonging.gaveOf(sv, ctFid));
    /* THE COUNT HAS ONE WRITER. A refusal returns a DELTA and the count is
       moved through BohemiaBelonging, never written here -- a second writer is
       how two ladders start disagreeing, which this lane has now fixed six
       times. */
    if(r.answered && r.delta) BohemiaBelonging.adjust(sv, ctFid, r.delta);
    advance(60);
    ctDraw(); render();
  }
  var cy=document.getElementById('ctclaimyes');
  if(cy) cy.addEventListener('click',function(){ ctAnswerClaim('yes'); });
  var cn=document.getElementById('ctclaimno');
  if(cn) cn.addEventListener('click',function(){ ctAnswerClaim('no'); });
  /* __CITY_STANDING__ */
  var commit=document.getElementById('ctcommit');"""


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

    for old, new, what in ((HELPERS_ANCHOR, HELPERS, 'the claim helpers'),
                           (OLD_WALL, NEW_WALL, 'the claim rows'),
                           (OLD_BTN, NEW_BTN, 'the two answer buttons'),
                           (OLD_WIRE, NEW_WIRE, 'the answer wiring')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY CLAIM: the outfit asks you back, on the walked surface')
    print('  + ' + MODULE)


if __name__ == '__main__':
    main()
