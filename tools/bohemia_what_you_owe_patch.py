#!/usr/bin/env python3
"""
WHAT YOU OWE (9/5/26, RUN lane) -- VAMILY [debts named] / BB-WHAT-YOU-OWE.

THE BACKLOG CALLS THIS "THE SMALLEST ROW IN SEVEN DAYS OF STUDY AND THE BEST
EFFORT-TO-EFFECT ONE ON THE WHOLE BB BOARD. IT IS ONE LINE ON A CARD HE IS
ALREADY READING."

MEASURED 8/28 and re-confirmed today: there is exactly ONE daily cost in the
walked game, and it is not food, rent or fuel -- it is PEOPLE YOU SAID YOU WOULD
SHOW UP FOR. ctNeglectFor() walks every outfit you made a commitment to and takes
standing away if you did not turn up. "Nothing said, nothing owed", so it only
bills what you actually promised. THAT IS THE RIGHT MECHANIC AND THE PLAYER IS
NEVER TOLD IT HAPPENED.

WHAT WAS WRONG, and it is three small things in one place:
  1. ctNeglectFor hands back a list of {faction, lost, now} AND ITS RETURN VALUE
     IS THROWN AWAY. It already computes exactly what the card needs to say.
  2. THE TIMING MADE IT UNSAYABLE. showReckoning built and showed the card
     FIRST, and the charge happened on the tap that DISMISSES it -- so the bill
     was rung up at the exact moment the only surface that could have reported it
     was already gone.
  3. The card lists steps, districts, buildings entered, the job outcome and what
     you were paid, and NEVER SAYS WHO YOU LET DOWN.

WHAT THIS PATCH DOES:
  * moves the charge to the TOP of showReckoning, before a single line of the
     card is built, and keeps its return
  * puts WHO YOU LET DOWN on the card, in their own names, with what it cost
  * ADDS THE FORWARD HALF -- WHO IS EXPECTING YOU TOMORROW -- because the row
     says so and it is right: a bill you only see after it is charged teaches
     nothing and motivates nothing. That half is READ-ONLY and shares the
     module calls the charge uses, so the warning and the bill can never disagree
  * removes the old call from the dismiss callback. Two call sites for one day's
     write is the two-writers bug this file has fixed six times, and the fact
     that ctNeglectFor guards itself per day is not a reason to keep the second.

ORDERING, CHECKED RATHER THAN ASSUMED: ctVouchSweep must run after the upkeep
because it only READS the standing neglect has just written. Moving the charge
EARLIER keeps that order (charge at card build, sweep at card dismiss), so the
sweep still reads post-charge standing. It stays exactly where it is.

BOTH CALLERS OF showReckoning ARE REAL END-OF-DAY (the sleep path and
DAY.phase==='ended'), so charging at build time cannot fire on a preview.

THE WORDS ARE ATTEMPTS, draft:true, per ALWAYS MAKE AN ATTEMPT (8/11).

IDEMPOTENT: the mark is checked first and anchors are asserted to match once.
"""
import sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html')
MARK = '__WHAT_YOU_OWE__'


def main():
    src = open(CITY, encoding='utf8').read()
    if MARK in src:
        print('  already applied (%s present) -- nothing to do' % MARK)
        return 0

    # ---- 1. the forward half, read-only -----------------------------------
    anchor_fn = 'function ctNeglectFor(sv, dayEnded){'
    assert src.count(anchor_fn) == 1, 'fn anchor %d' % src.count(anchor_fn)
    forward = '''/* ==== ''' + MARK + r''' (9/5) : WHO IS EXPECTING YOU TOMORROW =========
   The backward half -- who you let down -- is ctNeglectFor's own return value,
   which nobody read for eight days. This is the FORWARD half the row asks for,
   and the reason it exists is that a bill you only ever see after it is charged
   teaches nothing and motivates nothing.

   IT IS READ-ONLY AND IT SHARES THE CHARGE'S OWN CALLS. Same stateOf, same
   neglectFor, same gaveOf. A second rule for "who will bill me" written beside
   the rule for "who billed me" is two answers to one question, and they drift:
   that is the bug this file has fixed six times under six names. So the warning
   cannot say anything the charge would not do.
   ========================================================================== */
function ctOwedTomorrow(sv){
  if(typeof BohemiaCommitment === 'undefined' || typeof BohemiaBelonging === 'undefined')
    return [];
  var out = [], rules = BohemiaBelonging.RULES || {};
  for(var k in rules){
    try{
      var st = BohemiaCommitment.stateOf(sv, k);
      var cost = BohemiaCommitment.neglectFor(st)|0;
      if(cost <= 0) continue;                        /* nothing said, nothing owed */
      var have = BohemiaBelonging.gaveOf(sv, k)|0;
      if(have <= 0) continue;                        /* nothing left to lose */
      out.push({ faction:k, cost:cost, now:have });
    }catch(_e){}
  }
  return out;
}

''' + anchor_fn
    src = src.replace(anchor_fn, forward, 1)

    # ---- 2. charge FIRST, keep the answer ---------------------------------
    anchor_show = 'function showReckoning(){\n  const s=DAY.summary();'
    assert src.count(anchor_show) == 1, 'show anchor %d' % src.count(anchor_show)
    charge = '''function showReckoning(){
  /* ''' + MARK + r''': CHARGE THE DAY BEFORE THE CARD IS BUILT, AND KEEP THE ANSWER.
     This used to happen on the tap that DISMISSED this card, and its return value
     was thrown away -- so the one daily cost in the game was rung up at the exact
     moment the only surface that could report it was already gone. It is the
     same call, the same day number, and the same once-per-day guard; only the
     moment moved, and now somebody reads it. */
  var OWED_TODAY = [], OWED_TOMORROW = [];
  try { OWED_TODAY = ctNeglectFor(ctBelongSave(), (T && T.day) || 1) || []; }catch(_e){}
  try { OWED_TOMORROW = ctOwedTomorrow(ctBelongSave()) || []; }catch(_e){}
  const s=DAY.summary();'''
    src = src.replace(anchor_show, charge, 1)

    # ---- 3. say it on the card --------------------------------------------
    anchor_day = "  h+='<h3>THE DAY</h3><ul>';"
    assert src.count(anchor_day) == 1, 'day anchor %d' % src.count(anchor_day)
    say = r'''  /* ''' + MARK + r''' -- WHO YOU LET DOWN, BY NAME, ABOVE THE STEP COUNT.
     The game he named makes you leave the house through PAYROLL, and its
     punishment is not death, it is PEOPLE LEAVING. We built our version of that
     and then hid it: the card counted steps and districts and never once said
     whose day you ruined. Silent when you owed nobody, because a heading with
     nothing under it teaches him that the heading means nothing.
     Words are attempts, draft:true. */
  if(OWED_TODAY.length){
    h+='<h3>WHO YOU LET DOWN</h3><ul>';
    for(var _i=0;_i<OWED_TODAY.length;_i++){
      var _n=OWED_TODAY[_i];
      h+='<li>'+esc(String(_n.faction).toUpperCase())+' waited on you'
       + ' · −'+(_n.lost|0)+', now '+(_n.now|0)+'</li>';
    }
    h+='</ul>';
  }
  /* AND THE FORWARD HALF, which is the one that can still change something.
     NOBODY IS FILTERED OUT OF IT, and the first cut got that wrong: it hid
     anybody already billed today, on the theory that a name said twice reads as
     two debts. But SOMEBODY YOU LET DOWN TODAY STILL EXPECTS YOU TOMORROW -- so
     that filter emptied the forward list at exactly the moment the warning was
     worth most, which is the night you already missed them. The two lines say
     different things and their headings say which: one is a charge that has
     happened, one is a cost that has not. */
  if(OWED_TOMORROW.length){
    h+='<h3>WHO IS EXPECTING YOU TOMORROW</h3><ul>';
    for(var _j=0;_j<OWED_TOMORROW.length;_j++){
      h+='<li>'+esc(String(OWED_TOMORROW[_j].faction).toUpperCase())
       + ' \u00b7 not showing up costs '+(OWED_TOMORROW[_j].cost|0)+'</li>';
    }
    h+='</ul>';
  }
''' + anchor_day
    src = src.replace(anchor_day, say, 1)

    # ---- 4. one writer, not two -------------------------------------------
    old_call = """    /* __CITY_NEGLECT__ -- charge the upkeep for the day that is ending, BEFORE
       the rollover, because the check is "did you turn up TODAY" and after
       nextDay() today is a different number. */
    try { ctNeglectFor(ctBelongSave(), (T && T.day) || 1); } catch(_e){}"""
    new_call = """    /* __CITY_NEGLECT__ -- MOVED (""" + MARK + """, 9/5). The upkeep for the day
       that is ending is charged at the TOP of showReckoning now, before the card
       is built, so the card can say who it cost. It is still charged before the
       rollover and still guarded once per day per outfit; only the moment moved.
       The call is gone from here rather than left as a harmless second one:
       two call sites for one day's write is the two-writers bug this file has
       fixed six times, and a self-guarding function is not a reason to keep it.
       ctVouchSweep below is UNCHANGED and still runs after the charge, which is
       the order it needs -- it only READS the standing neglect has written. */"""
    assert src.count(old_call) == 1, 'call anchor %d' % src.count(old_call)
    src = src.replace(old_call, new_call, 1)

    open(CITY, 'w', encoding='utf8').write(src)
    print('  added    : ctOwedTomorrow(), read-only, sharing the charge\'s own calls')
    print('  moved    : the neglect charge to the TOP of showReckoning, return kept')
    print('  added    : WHO YOU LET DOWN and WHO IS EXPECTING YOU TOMORROW on the card')
    print('  removed  : the old call from the dismiss callback (one writer, not two)')
    print('  wrote    : slices/BOHEMIA_CITY_WORLD.html')
    return 0


if __name__ == '__main__':
    sys.exit(main())
