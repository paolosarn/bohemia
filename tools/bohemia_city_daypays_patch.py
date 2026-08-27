#!/usr/bin/env python3
"""
THE DAY PAYS (8/12/26).

The demo cut, ruled 8/4, row 3: "THEN ONE GOOD DAY: wake -> 2-3 quests -> walk
finished-looking streets -> one talk, one dial fight -> GET PAID -> spend at a
trading hub -> camp -> sleep-save holds."

GET PAID DID NOT HAPPEN. Not because it was unbuilt -- because it was built and
never called.

MEASURED, not assumed: engine/bohemia_payday.js exports questEvent, payForQuest,
hubs, reachable, nearestHub, shelf, price, buy and dayReport. Every one of them is
referenced EXACTLY ZERO times outside its own module. The entire "get paid, spend
at a hub" half of the demo cut has been sitting in the build, dormant, since 8/11.
That is the sixth time this week this lane has found the same shape.

AND ONE PIECE REALLY WAS MISSING, and it is a good one. Paolo ruled on 8/11, asked
what a day's work should pay: "Whatever currency the quest decida to give." The
payday bridge was built that same day to honour it -- questReward() reads
questState.reward and pays exactly that -- and THE .bq LANGUAGE HAD NO WAY TO SAY
IT. There was no verb. A quest could not declare a reward, so every finished job
fell through to the empty global table and got the honest refusal NO_RULING.
The ruling was made, the bridge was built, and the sentence could not be written.
engine/bohemia_quest_runtime.js now has `@DO pay <currency> <n>`, on the stage, so
the reward belongs to the OUTCOME -- a quiet fix and a public spectacle are
different jobs and should not pay the same.

WHAT THIS FILE DOES: gives the run a real purse, pays it when a job finishes, and
SHOWS the answer -- including the refusal.

THE REFUSAL IS THE POINT, NOT A BUG. The three canon demo quests declare no reward
yet, because AMOUNTS ARE CONTENTS and the ALWAYS MAKE AN ATTEMPT law (8/11, LOCKED)
is explicit that "numbers, dials, rates, prices" still wait for him. So the
reckoning does not fake a number. It says:

    The Meter Reader: nobody has ruled what this pays

That is the machine asking for exactly one ruling, in the place he will see it,
without blocking the demo or inventing his canon. The moment a .bq file says
`@DO pay resources 3`, that line becomes a number and nothing here changes.

REUSE CHECK: cooks no graphic pixels of any kind. The balance reuses the phone's
existing standing-row treatment (.st-row/.st-who/.st-n) and the reckoning reuses
the day card's own list. No bank is opened because nothing is drawn.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_DAY_PAYS__'

GLUE = """
/* """ + MARK + """ -- THE RUN HAS A PURSE, AND FINISHING A JOB REACHES IT.
   engine/bohemia_payday.js was built 8/11 and called ZERO times from anywhere: the
   demo cut's "GET PAID" beat has been in the build, dormant, ever since. var, not
   let, for the same temporal-dead-zone reason as HOME (8/11). */
var PURSEV=null, PAID_TODAY=null, PAY_REFUSED=null;
function purseGet(){
  if(PURSEV) return PURSEV;
  try{ PURSEV=BohemiaPurse.create(); }catch(_e){ PURSEV=null; }
  return PURSEV;
}
function purseBalances(){
  try{ return BohemiaPurse.balances(purseGet()); }catch(_e){ return null; }
}
/* A JOB ENDED. TELL THE PURSE. The payday bridge takes the runtime's finished state
   as-is -- no third shape in between -- and answers verbatim, INCLUDING its refusal,
   so we can tell "worth nothing" from "nobody has ruled what it is worth". */
function payForToday(){
  PAID_TODAY=null; PAY_REFUSED=null;
  var p=purseGet(); if(!p||!DQ.rt||!DQ.rt.state.done) return null;
  var r=null;
  try{ r=BohemiaPayday.payForQuest(p, DQ.rt.state, DAY.day, DQ.spec&&DQ.spec.id, DQ.Q); }
  catch(_e){ return null; }
  if(r&&r.applied){ PAID_TODAY=r.paid; window.__PAID=(window.__PAID||0)+1; }
  else if(r){ PAY_REFUSED=r.reason||'NO_RULING'; window.__PAY_REFUSED=(window.__PAY_REFUSED||0)+1; }
  try{ phonePush(true); }catch(_e){}
  return r;
}
"""

# pay the moment the job actually ends, both ways it can end
OLD_RES = """    D_RESOLVE_HOOK"""
OLD_AFTER = """function dayAfterQuest(r){
  updQline();"""
NEW_AFTER = """function dayAfterQuest(r){
  /* """ + MARK + """ -- the job ended, so the purse hears about it. Both endings
     come through here: a resolution he chose, and the quest's own FAIL stage at
     nightfall. */
  try{ if(DQ.rt&&DQ.rt.state.done) payForToday(); }catch(_e){}
  updQline();"""

# nightfall's fail branch does not go through dayAfterQuest
OLD_NIGHT = """  if(OFFER_TAKEN){ const r=DQ.nightfall(); if(r)updQline(); }
  showReckoning();"""
NEW_NIGHT = """  if(OFFER_TAKEN){ const r=DQ.nightfall(); if(r)updQline();
    try{ payForToday(); }catch(_e){}   /* """ + MARK + """ */ }
  showReckoning();"""

# the reckoning tells him what the day was worth, or that nobody has said
OLD_RECK = """  /* __THE_PHONE_RINGS__ */
  else if(OFFER&&!OFFER_TAKEN)h+='<li>'+esc(OFFER.title)+': nobody picked it up</li>';"""
NEW_RECK = """  /* __THE_PHONE_RINGS__ */
  else if(OFFER&&!OFFER_TAKEN)h+='<li>'+esc(OFFER.title)+': nobody picked it up</li>';
  /* """ + MARK + """ -- WHAT THE DAY WAS WORTH, and the refusal is not a bug.
     Amounts are CONTENTS (ALWAYS MAKE AN ATTEMPT, 8/11: "numbers, dials, rates,
     prices" still wait for him), so this never fakes one. It says who has not
     ruled yet, in the place he will see it. */
  if(PAID_TODAY){ var pd=[]; for(var cc in PAID_TODAY) pd.push(PAID_TODAY[cc]+' '+cc);
    h+='<li>paid: '+esc(pd.join(', '))+'</li>'; }
  else if(PAY_REFUSED==='NO_RULING')
    h+='<li>'+esc((DAYOPEN&&DAYOPEN.title)||'the job')+': nobody has ruled what this pays</li>';"""

# the phone carries the balance
OLD_STATE = """           standing:(function(){ try{ return DQ.standing(); }catch(_e){ return null; } })() };"""
NEW_STATE = ("""           standing:(function(){ try{ return DQ.standing(); }catch(_e){ return null; } })(),
           purse:purseBalances(), paid:PAID_TODAY, payRefused:PAY_REFUSED };   /* """ + MARK + """ */""")

# and it rides the save, or a day's pay dies with the tab
OLD_SAVE = """    loop:DAY.serialize(),quest:DQ.serialize()      /* __DAY_LOOP__ */"""
NEW_SAVE = ("""    loop:DAY.serialize(),quest:DQ.serialize(),      /* __DAY_LOOP__ */
      purse:(function(){ try{ return BohemiaPurse.save(purseGet()); }catch(_e){ return null; } })()"""
            + """   /* """ + MARK + """ */""")

OLD_RESTORE = """  if(st.loop&&DAY.restore(st.loop)){ daySync(); DAY_RESTORED=true;"""
NEW_RESTORE = ("""  /* """ + MARK + """ -- a day's pay that dies with the tab is not pay. */
  if(st.purse){ try{ PURSEV=BohemiaPurse.load(st.purse); }catch(_e){} }
  if(st.loop&&DAY.restore(st.loop)){ daySync(); DAY_RESTORED=true;""")


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    for name, old, new in [
        ('quest resolved', OLD_AFTER, NEW_AFTER),
        ('nightfall', OLD_NIGHT, NEW_NIGHT),
        ('reckoning', OLD_RECK, NEW_RECK),
        ('phone state', OLD_STATE, NEW_STATE),
        ('save', OLD_SAVE, NEW_SAVE),
        ('restore', OLD_RESTORE, NEW_RESTORE),
    ]:
        if old not in s:
            sys.exit('FAIL: anchor not found -- ' + name)
        s = s.replace(old, new, 1)

    anchor = 'function applyRestore(st){'
    if anchor not in s:
        sys.exit('FAIL: applyRestore not found')
    s = s.replace(anchor, GLUE + '\n' + anchor, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + CITY + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
