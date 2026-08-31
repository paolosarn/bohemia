#!/usr/bin/env python3
"""
V196 THE ANSWER TO THE MAN AT THE BACK IS YOUR LEGS, AND THE GAME NEVER SAID SO.

  PAOLO: "we are trying to create the best funnest DEEPEST videogame ever."

RF4-37 is the row about priority targets, and it is the one thing this lane could
not measure all session. Three instruments failed and I wrote each failure down:
a passive player saturating a 100-health bar, then the same player at 600 health
where a one-body difference is smaller than the run-to-run noise. The record from
that turn named the fix in advance: "the honest next step is a PLAYING A/B -- the
same policy clearing the same boards, measuring TURNS TO CLEAR and DAMAGE TO
CLEAR rather than damage over a fixed window."

-------------------------------------------------------------------------
SO IT WAS RUN AS A RACE, AND THE ANSWER IS UNAMBIGUOUS
-------------------------------------------------------------------------
Same 30 boards, three repeats, 90 fights per policy, everything identical except
what the player does about the man at the back:

  POLICY                                    ROOMS CLEARED   DAMAGE TO CLEAR
  never cross the room, shoot what is near      31.1%            80.9
  WALK at him                                   18.9%           123.4
  MANEUVER at him over the safest ground        13.3%           146.1
  *** SPRINT at him and still take the shot     37.8%           117.0 ***

*** THE PRIORITY-TARGET PUZZLE IS REAL, AND IT IS GATED ENTIRELY ON YOUR LEGS. ***
Crossing the room is the BEST play in the game and the WORST play in the game, and
the only difference is whether you spend a stamina pip to do it. Walking at him
clears barely half as many rooms as ignoring him. Sprinting at him beats ignoring
him outright.

AND THE REASON IS RF4-49, WHICH THIS GAME ALREADY SHIPS: "SP is not movement, it
is a currency that buys FREE ACTIONS OUTSIDE THE TURN ECONOMY ENTIRELY." A walk
costs your whole turn, so every step across the room is a turn where four men
shoot you and you shoot nobody. A sprint costs a pip and leaves the turn intact,
so you close AND fire. One mechanic, already built, turns the worst plan in the
fight into the best one.

*** AND THE MANEUVERING RESULT IS THE SHARPEST THING IN THE TABLE. *** Routing the
walk over the tiles V193's read scores as SAFEST was the worst policy measured --
13.3%, worse than walking straight at him. THE READ OPTIMISES FOR THIS TURN AND
CROSSING A ROOM IS A MULTI-TURN PLAN, so the safest next tile is frequently
backwards. That is an honest limit of a shipped feature, found by using it, and it
is written into its own record rather than left for somebody to trip over.

-------------------------------------------------------------------------
WHAT SHIPS: THE GAME SAYS IT
-------------------------------------------------------------------------
Nothing in this fight has ever told a player any of that. The spotter line said
"break his line or put him down" without saying he was reachable, how far, or that
the legs are free. The sprint's own label -- "2 TILES, 1 PIP, FREE MOVE" -- only
appears AFTER you have already armed it, which is the wrong way round: it is the
answer to a question you have to have asked first.

  * WHILE HE HAS THE ROOM, HE IS NAMED ON THE FIELD. A small mark over the man
    who is doing it, so "the priority target" stops being a thing you infer from
    a health bar. V179's ring says who can see you; this says WHICH ONE IS THE
    REASON.
  * AND THE LINE NAMES THE GAP AND THE MOVE: how many tiles, and that your legs
    do not cost your turn. Said once when it starts, never repeated -- a warning
    that repeats every turn is furniture.

NO DAMAGE BEFORE THE DIAL: draws a mark and writes a line. Not one damage,
accuracy, hp, armour, range, resource or rule changes. Nothing about who can shoot
whom moves; this is the fight explaining itself.

REUSE CHECK: cooks no graphic pixels and opens no bank. The mark is the label draw
the drop marker already uses, the line is setRead, and the fact is V195's own
spotterCall.

TASTE CHECK: no new HUD, no new button, no new row, and it is silent unless a
spotter actually has the room.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import base64
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V196 THE ANSWER TO THE MAN AT THE BACK IS YOUR LEGS'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:160]))
    return src.replace(old, new)


def main():
    html = open(ALPHA, encoding='utf-8').read()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    d = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in d:
        print('v196: already applied')
        return
    if 'V195 THE SPOTTER TAKES YOUR STONE' not in d:
        sys.exit('v196 needs v195 -- run the spotter patch first')

    # ---- 1. THE LINE NAMES THE GAP AND THE MOVE ----
    d = sub(d,
        """  try{ if(on)setRead('THE SPOTTER HAS THE ROOM','your stone is not working \\u2014 break his line or put him down','#e8593a');
       else setRead('HIS LINE IS BROKEN','the stone is yours again','#8fe89a'); }catch(_e){} }""",
        """  /* ===== V196 THE ANSWER IS YOUR LEGS, AND THE GAME NEVER SAID SO =====
     MEASURED AS A RACE, 90 fights a policy on the same 30 boards, everything
     identical except what the player does about the man at the back:
       never cross the room      31.1% of rooms cleared, 80.9 damage
       WALK at him               18.9%                  123.4
       MANEUVER over safe ground 13.3%                  146.1
       SPRINT at him             37.8%                  117.0
     *** CROSSING THE ROOM IS THE BEST PLAY IN THE GAME AND THE WORST PLAY IN THE
     GAME, AND THE ONLY DIFFERENCE IS WHETHER YOU SPEND A PIP. *** RF4-49, which
     this fight already ships: "SP is not movement, it is a currency that buys
     FREE ACTIONS OUTSIDE THE TURN ECONOMY ENTIRELY." A walk costs your whole
     turn, so every step across is a turn four men shoot you and you shoot
     nobody. A sprint costs a pip and leaves the turn intact.
     NOTHING HAS EVER TOLD A PLAYER ANY OF THAT. This line said "break his line
     or put him down" without saying he was reachable, how far, or that the legs
     are free -- and the sprint's own label only appears AFTER you arm it, which
     is the answer to a question you had to have asked already. */
  try{ if(on){ const _s=spotterMan();
         const _d=_s?Math.round(_s.edist):0;
         const _reach=_s?inMyRange(_s):false;
         setRead('THE SPOTTER HAS THE ROOM',
           _reach ? ('your stone is not working \\u2014 he is '+_d+' tiles out and INSIDE your reach, put him down')
                  : ('your stone is not working \\u2014 he is '+_d+' tiles out. RUN at him: your legs do not cost your turn'),
           '#e8593a'); }
       else setRead('HIS LINE IS BROKEN','the stone is yours again','#8fe89a'); }catch(_e){} }""",
        what='the line names the gap and the move')

    # ---- 2. WHICH MAN IS DOING IT ----
    d = sub(d,
        "function calledOnMe(e){ return !!e && !(e.E&&e.E.spotter) && spotterCall(); }",
        """function calledOnMe(e){ return !!e && !(e.E&&e.E.spotter) && spotterCall(); }
/* V196: WHICH MAN IS ACTUALLY DOING IT. spotterCall answers "is this happening";
   this answers "who", which is the thing a player has to act on. Same loop, same
   predicate, so the two can never name different men. */
function spotterMan(){
  for(const e of (G.e||[])){ if(!e||!e.E||!e.E.spotter)continue;
    if(seesMe(e))return e; }
  return null; }""",
        what='which man is doing it')

    # ---- 3. AND HE IS NAMED ON THE FIELD, NOT IN A MENU ----
    d = sub(d,
        """    if(EYES_RING&&!e.dead&&!e.downed){ let _eyes=false;""",
        """    /* ===== V196 THE ONE WHO HAS THE ROOM, NAMED ON THE FIELD ==========
       RF4-48 is a pass/fail: "if a mechanic can only be understood from a menu,
       the recreation has failed on RF4's own terms." V179's ring says WHO CAN
       SEE YOU; it cannot say which of them is the reason your stone stopped
       working. Without this, "the priority target" is a thing you infer from a
       health bar, and the race says getting that inference right or wrong is the
       difference between clearing 37.8% of rooms and clearing 13.3%. */
    if(!e.dead&&!e.downed&&e.E&&e.E.spotter){
      let _has=false; try{ _has=(spotterMan()===e); }catch(_x){}
      if(_has){ x.save();
        x.fillStyle='rgba(20,16,12,0.72)';
        x.font='bold '+Math.max(8,Math.round(er*0.72))+'px Space Grotesk,sans-serif';
        x.textAlign='center'; x.textBaseline='middle';
        x.fillText('HAS THE ROOM',ex+1,ey-er*1.9+1);
        x.fillStyle='#ffb4a0';
        x.fillText('HAS THE ROOM',ex,ey-er*1.9);
        x.textAlign='left'; x.textBaseline='alphabetic';
        x.restore(); } }
    if(EYES_RING&&!e.dead&&!e.downed){ let _eyes=false;""",
        what='named on the field')

    enc = base64.b64encode(d.encode('utf-8')).decode('ascii')
    html = html[:m.start(1)] + enc + html[m.end(1):]
    open(ALPHA, 'w', encoding='utf-8').write(html)
    print('v196: the legs reach the back -- %d chars' % len(d))


if __name__ == '__main__':
    main()
