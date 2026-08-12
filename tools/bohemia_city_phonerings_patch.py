#!/usr/bin/env python3
"""
THE PHONE RINGS (8/12/26).

The last two turns put a phone in his pocket and made it know where he is. It was
still a VIEWER: it showed him things, nothing ever arrived on it, and nothing he
did on it changed the day. A phone that only reports is a HUD with extra taps.

WHAT WAS ALREADY CANON AND ALREADY BUILT. engine/bohemia_loop.js has had a channel
model on quests this whole time, with the rule written into its own comment:

    THE FEED OFFERS: the quests you can pick up OVER THE PHONE right now -- the
    'feed' channel, live, not done. In-person quests (the phoneless: homeless)
    are deliberately EXCLUDED; the only way to get those is to pull up on them.
    This is "you can't get their quest over the phone."

So "a job comes in on your phone" is not a mechanic I invented. It is the shape
the loop engine was built around, and the demo has been skipping it by handing him
the day's job as a fait accompli on the wake card.

WHAT CHANGES: THE DAY NO LONGER STARTS WITH A JOB. It starts with a phone.

    06:00   you wake. the card says a job came in overnight. no objective yet.
    tap     PHONE (badge: 1)
            the offer is there in the quest's OWN words, with ACCEPT
    accept  the objective goes live on the HUD and the day is a working day
    ignore  it stays on the phone. the day is YOURS.

AND NOT TAKING A JOB IS NOT FAILING IT. This is the distinction the old code could
not express, because a quest that auto-started could only ever be resolved or
FAILED at nightfall. Now:
    accepted, resolved     -> the quest's own COMPLETE stage
    accepted, ran out of light -> the quest's own FAIL stage (its author wrote it)
    never accepted         -> nothing. You did not take the job. The reckoning says
                              so, and it is not a failure, because it isn't one.

WHY THIS IS THE RIGHT NEXT THING RATHER THAN MORE SURFACE: it makes the phone
LOAD-BEARING. Until now every phone feature could be deleted and the game would
play identically. From here, the phone is how work reaches you -- which is what
the loop engine always assumed, and what the 7/27 backlog entry meant by "the
phone system isn't in here".

REUSE CHECK: cooks no graphic pixels of any kind. The offer card is the day card's
existing CSS (.dcbtn/.dcgo/.sub, already in the file), and the badge reuses the
phone button's own face. No bank is opened because nothing is drawn.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__THE_PHONE_RINGS__'

# ---- the wake card stops handing him the job -------------------------------
OLD_WAKE = """function showWake(){
  DAYOPEN=DQ.openDay(DAY.day);
  updQline();
  const o=DAYOPEN;
  let h='<h2>DAY '+DAY.day+'</h2><div class="sub">'+esc(DAY.hhmm(DAY.WAKE_MIN))
       +' \\u00b7 light until '+esc(DAY.hhmm(DAY.NIGHT_MIN))+'</div>';
  if(o){ h+='<h3>'+esc((o.title||'').toUpperCase())+'</h3><p>'+esc(o.log||o.brief)+'</p>';
    const ob=(o.objectives||[]).filter(x=>x.status==='active');
    if(ob.length){ h+='<ul>'+ob.map(x=>'<li>'+esc(x.text)+'</li>').join('')+'</ul>'; } }
  h+='<div class="dcgo" data-act="go">GET UP</div>';
  cardShow(h,function(){ cardHide(); if(DQ.pending)showChoice(DQ.pending); });
}"""

NEW_WAKE = """/* """ + MARK + """ -- THE DAY NO LONGER STARTS WITH A JOB, IT STARTS WITH A
   PHONE. showWake used to call DQ.openDay() and hand him the objective on the wake
   card, which made the phone decorative: the work reached him whether he opened it
   or not. Now the day's job is an OFFER sitting on the phone, in the 'feed' channel
   the loop engine has modelled since it was written ("the quests you can pick up
   OVER THE PHONE right now"). No objective exists until he accepts it. */
function showWake(){
  DAYOPEN=null;
  offerRing();
  updQline();
  const o=OFFER;
  let h='<h2>DAY '+DAY.day+'</h2><div class="sub">'+esc(DAY.hhmm(DAY.WAKE_MIN))
       +' \\u00b7 light until '+esc(DAY.hhmm(DAY.NIGHT_MIN))+'</div>';
  if(o){ h+='<p>Something came in on your phone overnight.</p>'
          +'<h3>'+esc((o.title||'').toUpperCase())+'</h3>'
          +'<div class="sub">on the network \\u00b7 not taken</div>'; }
  h+='<div class="dcgo" data-act="go">GET UP</div>';
  cardShow(h,function(){ cardHide(); });
}

/* THE OFFER. Its words are the quest's own -- the same law the resolution buttons
   live under: nothing here is prose I wrote about the job. */
function offerRing(){
  OFFER=null; OFFER_TAKEN=false;
  var spec=DQ.specForDay(DAY.day); if(!spec)return;
  var Q=null; try{ Q=BQ.parse(DEMO_BQ[spec.file]); }catch(_e){ return; }
  var st=(Q.stages||[]).filter(function(s){ return s.n===spec.open; })[0];
  OFFER={ id:spec.id, title:Q.title||spec.id, text:(st&&st.log)||spec.brief, day:DAY.day };
  window.__OFFER_RANG=(window.__OFFER_RANG||0)+1;
  phoneBadge();
  phonePush(true);
}
/* he took it: NOW the quest exists, and the objective is live. */
function offerAccept(){
  if(!OFFER||OFFER_TAKEN)return false;
  OFFER_TAKEN=true;
  DAYOPEN=DQ.openDay(DAY.day);
  window.__OFFER_TAKEN=(window.__OFFER_TAKEN||0)+1;
  phoneBadge(); updQline(); phonePush(true);
  if(DQ.pending){ phoneClose(); showChoice(DQ.pending); }
  return true;
}
function phoneBadge(){
  var el=document.getElementById('phonebadge'); if(!el)return;
  var n=(OFFER&&!OFFER_TAKEN)?1:0;
  el.textContent=n?String(n):''; el.style.display=n?'block':'none';
}"""

# ---- nightfall: not taking a job is not failing it --------------------------
OLD_NIGHT = """function onNightfall(){
  const r=DQ.nightfall();        /* unresolved -> the quest's OWN fail stage */
  if(r)updQline();
  showReckoning();
}"""
NEW_NIGHT = """function onNightfall(){
  /* """ + MARK + """ -- NOT TAKING A JOB IS NOT FAILING IT. The old code could not
     say this: a quest that started itself could only ever be resolved or FAILED at
     nightfall. If he never accepted the offer, no quest ever ran, so there is
     nothing to fail -- the day was his. Only an ACCEPTED job that ran out of light
     takes the quest author's own FAIL stage. */
  if(OFFER_TAKEN){ const r=DQ.nightfall(); if(r)updQline(); }
  showReckoning();
}"""

# ---- the reckoning tells the truth about an untaken job --------------------
OLD_RECK = """  const oc=DQ.outcome();
  if(oc)h+='<li>'+esc((DAYOPEN&&DAYOPEN.title)||'the job')+': '+esc(oc)
        +(DQ.tags().length?' ('+esc(DQ.tags()[0])+')':'')+'</li>';"""
NEW_RECK = """  const oc=OFFER_TAKEN?DQ.outcome():null;
  if(oc)h+='<li>'+esc((DAYOPEN&&DAYOPEN.title)||'the job')+': '+esc(oc)
        +(DQ.tags().length?' ('+esc(DQ.tags()[0])+')':'')+'</li>';
  /* """ + MARK + """ */
  else if(OFFER&&!OFFER_TAKEN)h+='<li>'+esc(OFFER.title)+': never taken</li>';"""

# ---- the badge on the button ------------------------------------------------
OLD_BTN = '    <div id="phonebtn">\U0001f4f1 PHONE</div>'
NEW_BTN = '    <div id="phonebtn">\U0001f4f1 PHONE<span id="phonebadge"></span></div>'

OLD_CSS = '#phonebtn:active{border-color:var(--acc);color:#fff}'
NEW_CSS = """#phonebtn:active{border-color:var(--acc);color:#fff}
/* """ + MARK + """ -- the badge. Reuses the button's own face; nothing new drawn. */
#phonebtn{position:relative}
#phonebadge{display:none;position:absolute;top:-5px;right:-5px;min-width:14px;height:14px;
  border-radius:7px;background:#c8503a;color:#fff;font-size:9px;font-weight:700;
  line-height:14px;text-align:center;padding:0 3px}"""

# ---- state + the message from the phone ------------------------------------
GLUE = """
/* """ + MARK + """ -- the offer's state, and the phone's half of the handshake.
   var, not let: offerRing() is reached from showWake, which the boot timer can run
   before this line would have executed under `let` (the temporal dead zone that
   silently killed the wake-at-home hook on 8/11). */
var OFFER=null, OFFER_TAKEN=false;
window.addEventListener('message',function(ev){
  var d=ev&&ev.data; if(!d||!d.bohemiaPhoneAccept)return;
  try{ offerAccept(); }catch(_e){}
});
"""


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: ' + CITY + ' not found')
    s = open(CITY, encoding='utf-8').read()
    if MARK in s:
        print('NOOP: ' + MARK + ' already present')
        return
    for name, old, new in [
        ('wake card', OLD_WAKE, NEW_WAKE),
        ('nightfall', OLD_NIGHT, NEW_NIGHT),
        ('reckoning', OLD_RECK, NEW_RECK),
        ('phone button', OLD_BTN, NEW_BTN),
        ('css', OLD_CSS, NEW_CSS),
    ]:
        if old not in s:
            sys.exit('FAIL: anchor not found -- ' + name)
        s = s.replace(old, new, 1)

    anchor = 'function applyRestore(st){'
    if anchor not in s:
        sys.exit('FAIL: applyRestore not found')
    s = s.replace(anchor, GLUE + '\n' + anchor, 1)

    # the phone must be told about the offer along with everything else
    old_state = "           done:(function(){ try{ return DQ.done(); }catch(_e){ return false; } })() };"
    new_state = ("           done:(function(){ try{ return DQ.done(); }catch(_e){ return false; } })(),\n"
                 "           offer:(OFFER&&!OFFER_TAKEN)?OFFER:null, taken:!!OFFER_TAKEN };   /* "
                 + MARK + " */")
    if old_state not in s:
        sys.exit('FAIL: phoneState not found')
    s = s.replace(old_state, new_state, 1)

    open(CITY, 'w', encoding='utf-8').write(s)
    print('PATCHED ' + CITY + ' (' + str(len(s)) + ' bytes)')


if __name__ == '__main__':
    main()
