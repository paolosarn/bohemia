#!/usr/bin/env python3
"""
BOHEMIA CITY THIRD-PARTY PATCH -- five of his sixteen outfits could never hand
over a name on the surface he walks. (8/20/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md (sec 4i)
Gate: gates/faction_arc_gate.js (part L, new)

REUSE CHECK (REUSE-FIRST): COOKS NOTHING AND WRITES NO NEW MECHANIC. Every organ
this needs already exists and four of the five wires were ALREADY WRITTEN, on a
surface that is not the game:

    engine/bohemia_ties.js                vouchFor / overheardFrom / onwardFrom
                                          (8/12, Feld 1981 foci + Dunbar layers)
    engine/bohemia_introductions.js       earned() / answerFor()  (8/11)
    engine/bohemia_people.js  makeLedger  .answer/.honest/.lied bits (8/13)
    slices/BOHEMIA_RUN_SLICE_7_26_26.html introStateFor/tieRoster/tieLedgerSets

That last line is the whole story. The run slice wired all of this on 8/12 and
the CITY -- the surface Paolo actually walks -- never got it. This PORTS that
wiring rather than writing a second one, in the city's own vocabulary
(ctValleyRoster / ctVKey / ctCell / CT_MET / ctEverDealt), which is why nothing
below invents a roster, a key, a set or a threshold.

--------------------------------------------------------------------------
FIVE OF SIXTEEN, AND IT WAS THE SWEEP THAT FOUND THEM
--------------------------------------------------------------------------
BohemiaIntros.earned() switches on eight conditions. The city fills exactly ONE
of the state fields those conditions read:

    var iSt = { asked: CT_MET.asked(who.key) };

That is the whole thing. So `vouched`, `overheard`, `standing`, `honest` and
`hires` were all permanently false, and five outfits could never get past the
first rung of their own mechanic:

    MOB       earn 'vouch'      st.vouched     never set   ANCHOR "YOU ARE INTRODUCED, YOU DO NOT ASK"
    REMNANTS  earn 'overheard'  st.overheard   never set   ANCHOR "...A FIRST NAME ALMOST NEVER"
    BLUES     earn 'standing'   st.standing    never set   ANCHOR "YOU GET THE GROUP'S NAME FIRST AND THEIRS LAST"
    HOMELESS  earn 'honesty'    st.honest      never set   ANCHOR "THEY DO NOT ASK YOUR NAME, THEY ASK WHERE YOU SLEEP"
    TRADES    earn 'work'       st.hires       never set   ANCHOR "YOU GET A TRADE, NOT A NAME"

Four of those five are pure plumbing and are wired here. THE FIFTH IS NOT, AND
IT IS NAMED RATHER THAN FAKED -- see the bottom of this file.

--------------------------------------------------------------------------
THE KEYS RECONCILE, AND THAT WAS MEASURED, NOT ASSUMED
--------------------------------------------------------------------------
Two key spaces meet here and a wrong guess would have shipped a wire that is
dead in exactly the way this patch exists to fix. Measured on the real page:

    card person   who.key   'P:city:20:4:0'
    valley roster a.__id    '20:4:0'          <- matches exactly one row
                  a.__vid   '20,4:20:4:0'     <- what the tie graph is keyed on

So the ledger key is `'P:city:' + a.__id` and the tie key is `ctVKey(a)`, and the
sets handed to the graph are built by walking the roster once and asking the
ledger about each row. Nothing is parsed, nothing is reconstructed.

AND THE MECHANIC ACTUALLY ANSWERS. Measured on the same page, with the graph
handed a known-everybody set: all THREE Mob members in the valley are vouchable.
The Remnants are not, and that is not this wiring: THERE IS ONE REMNANT IN THE
WHOLE VALLEY, so there is no second soldier to overhear it from. That is the
density finding this lane already recorded (32 affiliated of 298), it is a MAP
LAW / population matter and it is not mine to fix by loosening the rule.

--------------------------------------------------------------------------
WHAT THE CARD GAINS, AND WHY IT DOES NOT GROW
--------------------------------------------------------------------------
A vouch that does not say WHOSE WORD IT WAS is a flag flipping. The card names
the person and how you know them (BohemiaTies.viaWords: SHARE A ROOF / WORK THE
SAME PLACE / RUN WITH THE SAME OUTFIT), and the introducer's name is one you
already earned, so printing it gives nothing away.

IT IS HEIGHT-NEUTRAL AND THAT IS BY CONSTRUCTION, not by luck. THE PERSON CARD
HAS NO HEADROOM (this lane, twice in two days). meeting().next is empty once
there is nothing left to earn, so HOW YOU GET THE REST disappears on exactly the
cards where WHO PUT YOU ON appears. One row leaves, one row arrives.

--------------------------------------------------------------------------
THE ONE THAT IS NOT WIRED, SAID OUT LOUD
--------------------------------------------------------------------------
TRADES earns its name with `hires >= 2`. THE CITY HAS NO HIRING. Minting one
would be inventing an economy in the exact place his dossier is most specific
("HIRE THEM TWICE AND THE REAL NAME ARRIVES UNPROMPTED"), and a fake hire button
would be worse than the gap. So st.hires stays 0, the card keeps saying HIRE THEM
TWICE in his words, and the gate NAMES Trades as the one outfit still unreachable
rather than passing over it. MECHANISM-MINE / CONTENTS-PAOLO'S.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_THIRDPARTY__'

# ---- the two sets the graph needs, and the third-party answers ------------
HELPERS_ANCHOR = '/* __CITY_VALLEYKEY__ -- THE VALLEY-UNIQUE KEY, IN ONE PLACE.'
HELPERS = '''/* ''' + MARKER + ''' -- WHO CAN INTRODUCE YOU, AND WHO YOU OVERHEARD IT FROM.
   engine/bohemia_ties.js answered these on 8/12 and the CITY never asked. Ported
   from BOHEMIA_RUN_SLICE_7_26_26.html's introStateFor/tieLedgerSets, which wired
   the same three calls to a surface that is not the game.
   THE KEY SPACES RECONCILE AND IT WAS MEASURED: the ledger is keyed
   'P:city:'+a.__id and the graph is keyed ctVKey(a)=a.__vid, so the sets are
   built by walking the roster once and asking the ledger about each row. */
function ctTieSets(roster){
  var met={}, known={};
  for(var i=0;i<roster.length;i++){
    var a=roster[i], lk='P:city:'+a.__id, k=ctVKey(a);
    if(!CT_MET.get(lk)) continue;
    met[k]=1;
    if(CT_MET.asked(lk)) known[k]=1;        /* you know what to CALL them */
  }
  return { met:met, known:known };
}
/* the roster row for the person whose card is open, matched on the id the record
   already carries. Returns null rather than guessing. */
function ctTieRow(p, roster){
  for(var i=0;i<roster.length;i++) if(roster[i].__id === p.id) return roster[i];
  return null;
}
function ctIntroThird(p, fid){
  var out = { vouched:false, overheard:false, onward:0 };
  if(typeof BohemiaTies === 'undefined' || !fid) return out;
  try {
    var roster = ctValleyRoster(), me = ctTieRow(p, roster);
    if(!me) return out;
    var key = ctVKey(me), cell = ctCell(), sets = ctTieSets(roster);
    /* MOB: a third person supplies the name and that person is VOUCHING, so the
       voucher must be somebody whose name you know and who is in the same
       outfit. Both conditions live in the organ, not here. */
    out.vouchedBy   = BohemiaTies.vouchFor(key, roster, cell,
                        { keyOf:ctVKey, known:sets.known });
    /* REMNANTS: weaker on purpose. You only have to have MET the other soldier,
       not to know what to call them -- overhearing costs the speaker nothing. */
    out.overheardBy = BohemiaTies.overheardFrom(key, roster, cell,
                        { keyOf:ctVKey, met:sets.met });
    /* COLORFUL: "introduced onward to three people". Counted, never named -- you
       do not learn three strangers' names by being told they exist. */
    out.onward      = BohemiaTies.onwardFrom(key, roster, cell,
                        { keyOf:ctVKey, n:3, met:sets.met }).length;
    out.vouched   = !!out.vouchedBy;
    out.overheard = !!out.overheardBy;
  } catch(_e){}
  return out;
}
/* the introducer in words: their name if you have it, and how you know them. */
function ctIntroWho(t, roster){
  if(!t) return null;
  var name=null;
  try {
    for(var i=0;i<roster.length;i++) if(ctVKey(roster[i])===t.by){
      name = BohemiaPeople.generatedName('P:city:'+roster[i].__id); break; }
  } catch(_e){}
  var via = BohemiaTies.viaWords(t.via);
  return (name ? name.toUpperCase() : 'SOMEBODY') + (via ? ' \\u00b7 YOU ' + via : '');
}
''' + HELPERS_ANCHOR

# ---- the state the organ actually reads ----------------------------------
OLD_ST = """    var iSt   = { asked: CT_MET.asked(who.key) };"""
NEW_ST = """    /* """ + MARKER + """ -- AND THE OTHER FOUR CONDITIONS earned() SWITCHES ON.
       This line used to be the whole state, so `vouched`, `overheard`,
       `standing` and `honest` were permanently false and FIVE of his sixteen
       outfits could never get past the first rung of their own mechanic. The
       organs answering all four have existed since 8/11-8/13; nothing here is
       new and nothing here is a threshold I chose. */
    var iTh   = ctIntroThird(p, ctFid);
    var iSt   = { asked:     CT_MET.asked(who.key),
                  /* HOMELESS: they ask where you sleep. The ledger has carried
                     the honest/lied bits since 8/13 and the CITY never set or
                     read them -- only the old run slice did. */
                  honest:    CT_MET.honest(who.key),
                  /* BLUES: "the personal name arrives only once you have done
                     something the group has an opinion about". Belonging IS the
                     city's standing, and ctEverDealt is the same history test
                     the terms fold uses -- not a second idea of the same fact. */
                  standing:  (typeof ctEverDealt==='function' && ctFid)
                               ? ctEverDealt(ctBelongSave(), ctFid) : false,
                  vouched:   iTh.vouched,
                  overheard: iTh.overheard,
                  onward:    iTh.onward,
                  vouchedBy: iTh.vouchedBy,
                  overheardBy: iTh.overheardBy };"""

# ---- and the card says whose word it was ---------------------------------
# HEIGHT-NEUTRAL BY CONSTRUCTION: meeting().next is empty once there is nothing
# left to earn, so HOW YOU GET THE REST disappears on exactly the cards where
# this appears. One row leaves, one row arrives. (THE PERSON CARD HAS NO
# HEADROOM -- this lane broke its own 90% bar twice in two days.)
OLD_NAMEROW = """  var nameRow = ctIntro ? ctIntroName(ctIntro, CT_MET.asked(who.key))
                        : ['NAME', nm?nm:'YOU HAVE NOT ASKED'];
  body+=ctRow(nameRow[0], nameRow[1]);"""
NEW_NAMEROW = """  var nameRow = ctIntro ? ctIntroName(ctIntro, CT_MET.asked(who.key))
                        : ['NAME', nm?nm:'YOU HAVE NOT ASKED'];
  body+=ctRow(nameRow[0], nameRow[1]);
  /* """ + MARKER + """ -- AND WHOSE WORD IT WAS. A vouch that does not name the
     person who staked something is a flag flipping, and the introducer's name is
     one you already earned, so printing it gives nothing away.
     draft:true -- a real attempt, his to edit. */
  try {
    if(ctIntro && (ctIntro.st.vouchedBy || ctIntro.st.overheardBy)){
      var ctTR = ctValleyRoster();
      if(ctIntro.st.vouchedBy)
        body += ctRow('WHO PUT YOU ON', ctIntroWho(ctIntro.st.vouchedBy, ctTR));
      else
        body += ctRow('YOU HEARD IT FROM', ctIntroWho(ctIntro.st.overheardBy, ctTR));
    }
  } catch(_e){}"""

# ---- the Homeless question is answerable ---------------------------------
OLD_BTN = """  if(ctBtn) body+='<button id="ctask">'+ctBtn+'</button>';"""
NEW_BTN = """  if(ctBtn) body+='<button id="ctask">'+ctBtn+'</button>';
  /* """ + MARKER + """ -- THE OTHER MOVE. The Homeless do not ask your name, they
     ask WHERE YOU SLEEP, and answering it honestly is the unlock -- so it has to
     be pressable or the mechanic is decoration. answerFor() has returned this
     button since 8/11 and the only surface that ever rendered it was the old run
     slice. The label and the effect are BOTH the organ's; nothing is chosen here,
     and the lie is deliberately not offered because the organ does not offer one. */
  var ctAns = null;
  try { ctAns = ctIntro && BohemiaIntros.answerFor(ctIntro.rule, ctIntro.ctx, ctIntro.st); }
  catch(_e){}
  if(ctAns) body+='<button id="ctanswer">'+ctAns.label+'</button>';"""

OLD_HANDLER = """  /* __ASK_ABOUT__ -- bound here with every other card button, so there is
     one place that knows how this card responds to a press. */"""
NEW_HANDLER = """  /* """ + MARKER + """ -- and the answer is remembered the way asking is.
     CT_MET.answer() writes BOTH bits (answered, honest); the second one has
     existed since 8/13 precisely so "has not answered" and "answered and lied"
     stop being the same state. */
  var ansB=document.getElementById('ctanswer');
  if(ansB) ansB.addEventListener('click',function(){
    CT_MET.answer(who.key, T.day||1, true); ctSave();
    ctDraw(); render(); });
  /* __ASK_ABOUT__ -- bound here with every other card button, so there is
     one place that knows how this card responds to a press. */"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((HELPERS_ANCHOR, HELPERS, 'the valley-key anchor'),
                           (OLD_ST, NEW_ST, 'the intro state'),
                           (OLD_NAMEROW, NEW_NAMEROW, 'the name row'),
                           (OLD_BTN, NEW_BTN, 'the ask button'),
                           (OLD_HANDLER, NEW_HANDLER, 'the button handlers')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY THIRDPARTY: four of the five dead earn-conditions are wired')


if __name__ == '__main__':
    main()
