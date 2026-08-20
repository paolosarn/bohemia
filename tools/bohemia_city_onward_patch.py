#!/usr/bin/env python3
"""
BOHEMIA CITY ONWARD PATCH -- the Colorful's second question is the screening, and
until now nobody could answer it. (8/20/26, FACTIONS lane)

Law:  laws/BOHEMIA_ADDENDUM_NOBODY_EVER_WALKED_IT_8_20_26.md (sec 4k)
Gate: gates/faction_arc_gate.js (part N, new)

REUSE CHECK (REUSE-FIRST): cooks nothing and adds NO SAVE FIELD. Every piece
already exists and three of them were built for this exact dossier:
    BohemiaTies.onwardFrom   the three introductions        (8/12)
    BohemiaTies.tiesOf       who this person is acquainted with
    CT_MET.answer/.honest    the answered + it-checked-out bits (8/13)
    ctIntroThird             this lane's tie plumbing        (today)
st.onward has been COUNTED on the card's state since this morning and nothing
ever SPENT it. Tenth instance of the shape, and the last one in this system.

--------------------------------------------------------------------------
HIS CANON, AND THE ONE WORD IT LEAVES TO MECHANISM
--------------------------------------------------------------------------
    "NAMES BOTH WAYS IN THE FIRST BREATH, AND THEN THE SECOND QUESTION IS WHO
     YOU CAME WITH. That question is the actual screening and the name was the
     small talk. Answer it WELL and you are introduced onward to three people;
     answer it BADLY and you are still treated kindly and never introduced to
     anybody."

The effect is his, verbatim and complete: three introductions, or kindness and
nothing. The single thing he did not define is what makes an answer WELL, and
that is mechanism rather than canon -- so it is built from what the world already
knows and he can correct it by playing.

--------------------------------------------------------------------------
AN ANSWER IS GOOD IF THEY CAN CHECK IT
--------------------------------------------------------------------------
GROUNDED, NOT INVENTED. The gatekeeper literature (Gould & Fernandez's brokerage
typology; the chain-referral/ethnographic-access work) is unusually specific
here: a gatekeeper controls incoming access to their OWN group and doubles as
SPONSOR, and what they are exchanging is REPUTATIONAL ENDORSEMENT -- they
temporarily extend their own moral standing to the newcomer. Trust in bounded
communities circulates as reputational currency grounded in kinship, friendship
and shared networks, which is exactly why "WHO SENT YOU" is the question: the
answer is a LEGITIMACY SIGNAL, and its whole value is that it can be verified
against the community's own graph.

So: an answer is good when you name somebody THEY ACTUALLY KNOW. Not somebody
important, not the right faction -- somebody with a real tie to the person in
front of you, whose name you went and earned. Every ingredient is already in the
save and nothing here rolls a die.

AND IT MAKES THE WHOLE STACK FEED ITSELF, which is the reason it is worth
building rather than an isolated feature: to answer the Colorful well you must
first have MET people and LEARNED NAMES, which is the introductions system; the
reward is THREE MORE PEOPLE, which is more names, which is more good answers.
Granovetter 1973 is the sharp end of it -- the three you are handed are the
Colorful's STRONGEST ties and therefore YOUR weak ones, which is precisely where
the value of an introduction lives. That also settles a thing that looked like a
bug: onwardFrom picking the strongest is RIGHT, because your word only carries
with people who actually trust you. You cannot introduce somebody to an
acquaintance you barely have.

--------------------------------------------------------------------------
WHAT IT DOES NOT DO
--------------------------------------------------------------------------
NO NEW SAVE FIELD. The ledger has carried `answered` and `honest` since 8/13 and
they mean exactly this: you answered, and it held up. Reusing them keeps one
place deciding what has happened between you and a person.

IT DOES NOT HAND YOU THREE NAMES. onwardFrom's own note: "Counted, never named --
you do not learn three strangers' names by being told they exist." You are
INTRODUCED -- they become people you have MET -- and what they are called is
still theirs to give under their own outfit's rule. An introduction that skipped
the sixteen mechanics would undo the system it is built on.

AND THE BAD ANSWER IS REAL. Saying you came alone is offered ALWAYS, and it ends
the screening for good -- kindly, exactly as he wrote it. A screening you cannot
fail is not a screening.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_ONWARD__'

# ---- who you could truthfully say you came with ---------------------------
HELPERS_ANCHOR = 'function ctIntroThird(p, fid){'
HELPERS = '''/* ''' + MARKER + ''' -- WHO YOU CAME WITH, AND WHETHER THEY CAN CHECK IT.
   The Colorful ask one screening question and the answer is a LEGITIMACY SIGNAL:
   its whole value is that it can be verified against their own network. So a
   good answer names somebody THEY are acquainted with and whose name YOU went
   and earned. Both facts are already in the save; nothing here rolls a die.
   Returns the strongest such person, or null when you have nobody to name -- and
   null is a real answer, not a gap. */
function ctOnwardWho(p, fid){
  if(typeof BohemiaTies === 'undefined' || !fid) return null;
  try {
    var roster = ctValleyRoster(), me = ctTieRow(p, roster);
    if(!me) return null;
    var ties = BohemiaTies.tiesOf(ctVKey(me), roster, ctCell(), ctVKey);
    for(var i=0;i<ties.length;i++){
      for(var j=0;j<roster.length;j++){
        if(ctVKey(roster[j]) !== ties[i].key) continue;
        var lk = 'P:city:' + roster[j].__id;
        /* their NAME, not just their face: a stranger's word is not a referral */
        if(!CT_MET.asked(lk)) break;
        return { key:lk, via:ties[i].via,
                 name:BohemiaPeople.generatedName(lk) };
      }
    }
  } catch(_e){}
  return null;
}
/* AND WHAT ANSWERING WELL BUYS: his three, marked MET and nothing more.
   onwardFrom's own note -- "Counted, never named" -- so they become people you
   have met and what they are called is still theirs to give under their own
   outfit's rule. An introduction that skipped the sixteen mechanics would undo
   the system it is built on. */
function ctOnwardOpen(p, fid){
  var opened = [];
  if(typeof BohemiaTies === 'undefined') return opened;
  try {
    var roster = ctValleyRoster(), me = ctTieRow(p, roster);
    if(!me) return opened;
    var sets = ctTieSets(roster);
    var three = BohemiaTies.onwardFrom(ctVKey(me), roster, ctCell(),
                  { keyOf:ctVKey, n:3, met:sets.met });
    for(var i=0;i<three.length;i++){
      for(var j=0;j<roster.length;j++){
        if(ctVKey(roster[j]) !== three[i].key) continue;
        CT_MET.meet('P:city:' + roster[j].__id, (T && T.day) || 1);
        opened.push(roster[j].__id);
        break;
      }
    }
  } catch(_e){}
  return opened;
}
''' + HELPERS_ANCHOR

# ---- the question, and both answers --------------------------------------
OLD_BTN = """  if(ctAns) body+='<button id="ctanswer">'+ctAns.label+'</button>';"""
NEW_BTN = """  if(ctAns) body+='<button id="ctanswer">'+ctAns.label+'</button>';
  /* """ + MARKER + """ -- THE COLORFUL'S SECOND QUESTION IS THE SCREENING, and
     st.onward has been counted on this card since this morning with nothing
     spending it. Offered once, and only while it is still open.
     BOTH ANSWERS ALWAYS -- a screening you cannot fail is not a screening, and
     "still treated kindly and never introduced to anybody" is his ending for it.
     draft:true on every word. */
  var ctOnwardName = null;
  try {
    if(ctIntro && ctIntro.m && ctIntro.m.asks && (ctIntro.rule.opens|0) > 0
       && !CT_MET.answered(who.key)){
      var ctOW = ctOnwardWho(p, ctFid);
      ctOnwardName = ctOW && ctOW.name;
      if(ctOnwardName)
        body += '<button id="ctcame" data-who="' + ctOW.key + '">'
             + 'Say you came with ' + ctOnwardName + '</button>';
      body += '<button id="ctalone">Say you came on your own</button>';
    }
  } catch(_e){}"""

OLD_HANDLER = """  var ansB=document.getElementById('ctanswer');"""
NEW_HANDLER = """  /* """ + MARKER + """ -- and what each answer does. The GOOD one spends
     st.onward: three people you have not met become people you have. The BAD one
     closes the screening for good, kindly, which is his own ending for it.
     Both write the SAME two ledger bits the Homeless answer uses (answered +
     honest), so one place decides what has happened between you and a person. */
  var cameB=document.getElementById('ctcame');
  if(cameB) cameB.addEventListener('click',function(){
    var got = ctOnwardOpen(p, ctFid);
    CT_MET.answer(who.key, T.day||1, true); ctSave();
    try {
      if(window.parent && window.parent !== window)
        window.parent.postMessage({ type:'BOHEMIA_VOICE',
          speaker:'city:'+(who.key||''),
          text: got.length
            ? 'Oh, them. Then you should know a few more people.'
            : 'Small valley. You already know everyone worth knowing.' }, '*');
    } catch(_e){}
    ctDraw(); render(); });
  var aloneB=document.getElementById('ctalone');
  if(aloneB) aloneB.addEventListener('click',function(){
    CT_MET.answer(who.key, T.day||1, false); ctSave();
    try {
      if(window.parent && window.parent !== window)
        window.parent.postMessage({ type:'BOHEMIA_VOICE',
          speaker:'city:'+(who.key||''),
          text: 'On your own. That happens.' }, '*');
    } catch(_e){}
    ctDraw(); render(); });
  var ansB=document.getElementById('ctanswer');"""

# ---- and the card says how it went, once ---------------------------------
# ON THE ROW THAT ASKED THE QUESTION, not a new one. THE PERSON CARD HAS NO
# HEADROOM and the fullest card is at 88%.
OLD_ASKS = """  if(m.asks) body += ctRow('THEY ASKED YOU', m.asks);"""
NEW_ASKS = """  /* """ + MARKER + """ -- and how it went, ON THE ROW THAT ASKED IT.
     The person card has no headroom (this lane, three times in three days), and
     the outcome of a question belongs to the question. draft:true. */
  if(m.asks){
    var ctAskV = m.asks;
    try {
      /* IT SAYS WHAT YOU DID, NOT WHAT IT BOUGHT, AND THE FIRST CUT DID NOT.
         It read "YOU ANSWERED, AND THEY OPENED DOORS" on a card where MEASURED
         nothing opened -- 2 people met before, 2 after -- because this Colorful
         had exactly ONE acquaintance and it was the person I had just named.
         The mechanism was right and the sentence was a lie, which is the exact
         disease this whole lane has spent the day removing. The save holds two
         bits (you answered; it held up) and those are the only two things a row
         reading the save is entitled to say. What it actually BOUGHT is spoken
         out loud at the moment it happens, where the real count is in hand. */
      if(typeof CT_MET !== 'undefined' && ctOnwardKey && CT_MET.answered(ctOnwardKey))
        ctAskV += CT_MET.honest(ctOnwardKey)
          ? '  \\u00b7  YOU GAVE THEM A NAME THEY KNEW'
          : '  \\u00b7  YOU CAME ON YOUR OWN, AND THEY LEFT IT THERE';
    } catch(_e){}
    body += ctRow('THEY ASKED YOU', ctAskV);
  }"""

# ctIntroRows does not receive the person key; hand it the one the card already has
OLD_ROWSIG = """function ctIntroRows(body, intro, fid){
  var m = (intro && intro.m) || {};"""
NEW_ROWSIG = """function ctIntroRows(body, intro, fid, ctOnwardKey){
  var m = (intro && intro.m) || {};   /* """ + MARKER + """ -- key for the outcome */"""

OLD_ROWCALL = """  body = ctIntroRows(body, ctIntro, ctFid);"""
NEW_ROWCALL = """  body = ctIntroRows(body, ctIntro, ctFid, who.key);   /* """ + MARKER + """ */"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    for old, new, what in ((HELPERS_ANCHOR, HELPERS, 'the tie helpers'),
                           (OLD_ROWSIG, NEW_ROWSIG, 'the intro-rows signature'),
                           (OLD_ROWCALL, NEW_ROWCALL, 'the intro-rows call'),
                           (OLD_ASKS, NEW_ASKS, 'the asked-you row'),
                           (OLD_BTN, NEW_BTN, 'the answer button'),
                           (OLD_HANDLER, NEW_HANDLER, 'the button handlers')):
        if old not in s:
            sys.exit('FAIL: could not find ' + what)
        s = s.replace(old, new, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY ONWARD: the screening can be answered, and answering it opens doors')


if __name__ == '__main__':
    main()
