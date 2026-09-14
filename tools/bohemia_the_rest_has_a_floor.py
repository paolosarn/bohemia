#!/usr/bin/env python3
"""
THE REST HAS A FLOOR (9/14/26, SOUNDS lane) -- the five-minute break this lane found
in its own shipped work.

*** MEASURED ON THE DEMO HE PLAYED, five real minutes on a phone profile, with an ear
on the end of the audio chain (tools/bohemia_ears_five_minutes.js):

    ONE silence of two seconds or more in the whole five minutes: 14.5 SECONDS,
    from 219.9s to 234.4s, with CITYMUS.resting TRUE for every sample of it.
    16.0s of the 349.7s is silent and 14.8s of that is inside the rest.
    Ninety music notes were scheduled during the hole. The context read "running".
    The ambience bed was asked for 3 times in 350 seconds -- one every 117s.

That is a break inside his five minutes, it is "nothing's complete" in his own words,
and it is mine: [music owned] round 2 (9/11) built the rest. ***

AND MY OWN RECORD FOR THAT ROUND CLAIMS THE THING THIS FIXES. Its words: "The street
rests one phrase between songs now, as a DUCK not a stop so the beat and the bed
survive." It ducks the music master to EXACTLY ZERO -- linearRampToValueAtTime(0) then
setValueAtTime(0) for the length of the phrase. A duck to zero is a stop. I shipped a
stop and wrote down a duck.

TWO CHANGES, ONE MARK EACH.

1. __THE_REST_HAS_A_FLOOR__  the duck ramps to a FLOOR, not to zero, so the street can
   never go silent. 12% of HIS captured level, which is about eighteen decibels down:
   deep enough that the bed, a footstep and a voice all sit clearly on top of it,
   shallow enough that the valley never dies. THE NUMBER IS MINE AND I AM NAMING IT
   rather than dressing it up: his law's own figures (wilderness 30-40 dBA, night about
   7 dB under day) are about how loud a PLACE is, not about how deep a musical duck
   goes, so quoting them here would be borrowing authority the law does not give. What
   the law does give is the rule this obeys: THERE IS NO SILENT OUTDOORS.

2. __THE_REST_ASKS_THE_BED__  the rest tells the ambience bed to speak, which is what
   the 9/11 record said the rest was FOR and never wired. The bed's clock gate is
   `if(now < this.next) return;`, so setting next to 0 makes its own one-second tick
   play at the top of the rest, and again halfway through. No new sound, no new cook,
   no new event: air_day, air_night and air_inside are approved and cooked, and the bed
   picks by place and by power exactly as it already does.

WHY BOTH, AND NOT EITHER ALONE. The floor is the GUARANTEE -- it cannot fail to hold,
because it is one value on an AudioParam booked on the audio clock like the two ramps
beside it. The bed is the POINT -- a rest exists so you hear the block you are standing
on. One without the other is either a silent rest or a rest that is only quieter music.

WHAT IS NOT TOUCHED: the phrase length (the engine's own 128 steps, shared with the
opening's handoff and the drum hold), both ramps still booked up front on the audio
clock so a fight can still pull the music back early, endRest still idempotent, and the
fight/menu/off paths that end a rest early. The 9/11 record's own hard-won lesson
stands: A REST WHOSE ONLY WAY OUT IS A TIMER ANOTHER SYSTEM MAY DELETE IS A TRAP.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new song, no new tag,
no new event. Three approved air sounds get asked for when the street goes quiet, and
one ramp target changes from 0 to a floor.

  python3 tools/bohemia_the_rest_has_a_floor.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
M_FLOOR = '__THE_REST_HAS_A_FLOOR__'
M_BED = '__THE_REST_ASKS_THE_BED__'

FLOOR_OLD = """    try{ g.gain.cancelScheduledValues(t0);
      g.gain.setValueAtTime(this.restGain,t0);
      g.gain.linearRampToValueAtTime(0,t0+1.2);
      g.gain.setValueAtTime(0,t0+len);
      g.gain.linearRampToValueAtTime(this.restGain,t0+len+0.25); }catch(e){ return false; }"""

FLOOR_NEW = """    /* __THE_REST_HAS_A_FLOOR__ (9/14, SOUNDS lane) -- THE STREET MAY NEVER GO
       SILENT, AND UNTIL NOW IT DID, FOR FIFTEEN SECONDS AT EVERY SONG CHANGE.
       MEASURED on the demo he played, five real minutes with an ear on the end of
       the chain: exactly ONE silence of two seconds or more in the whole five
       minutes, 14.5s of it, with this object's own `resting` flag true for every
       sample, ninety music notes scheduled into it, and the bed -- the thing this
       rest was built to reveal -- asked for once every 117 seconds.
       AND THE 9/11 RECORD FOR THIS VERY CODE CLAIMS "a DUCK not a stop so the beat
       and the bed survive". It ramped to ZERO and held zero for the phrase. A DUCK
       TO ZERO IS A STOP; I shipped a stop and wrote down a duck.
       So the ramp lands on a FLOOR. 12% of HIS captured level, about eighteen
       decibels down: deep enough that the bed, a footstep and a voice sit clearly
       on top, shallow enough that the valley never dies. THE NUMBER IS MINE AND
       SAYING SO MATTERS -- his law's figures (wilderness 30-40 dBA, night about 7 dB
       under day) describe how loud a PLACE is, not how deep a musical duck goes, and
       quoting them here would borrow authority the law does not give. What the law
       does give is the rule this obeys: THERE IS NO SILENT OUTDOORS. */
    var floor=this.restGain*0.12;
    try{ g.gain.cancelScheduledValues(t0);
      g.gain.setValueAtTime(this.restGain,t0);
      g.gain.linearRampToValueAtTime(floor,t0+1.2);
      g.gain.setValueAtTime(floor,t0+len);
      g.gain.linearRampToValueAtTime(this.restGain,t0+len+0.25); }catch(e){ return false; }
    /* __THE_REST_ASKS_THE_BED__ -- AND THE REST TELLS THE BED TO SPEAK, which is
       what the 9/11 record said the rest was FOR and never wired: the two were
       strangers, so the street went quiet and nothing filled it. The bed's own gate
       is `if(now < this.next) return;`, so zeroing next lets its one-second tick
       play at the top of the rest; the half-phrase timer asks once more in the
       middle. No new sound and no new cook -- air_day, air_night and air_inside are
       approved, and the bed picks by place and by power exactly as it already does.
       Wrapped and swallowed: a rest must never fail because the bed is missing. */
    try{ if(window.__AMB){ window.__AMB.next=0;
      setTimeout(function(){ try{ if(CITYMUS.resting && window.__AMB) window.__AMB.next=0; }catch(_e){} },
        Math.round(len*1000/2)); } }catch(_e){}"""


def main():
    print('=== THE REST HAS A FLOOR ===')
    src = open(ALPHA, encoding='utf8').read()
    if M_FLOOR in src and M_BED in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    # POSITIVE CONTROLS ON THE PREMISE, both measured this round and both load-bearing.
    if 'resting:false, restUntil:0, restGain:null,' not in src:
        print('FAIL: the rest is not the shape this expects; re-measure before trusting')
        return 1
    if '__AMB=AMB' not in src:
        print('FAIL: the ambience bed is not exposed as __AMB, so the rest cannot ask it')
        return 1
    if 'if(now < this.next) return;' not in src:
        print('FAIL: the bed no longer has the clock gate this fix pokes; re-measure')
        return 1
    print('  PREMISE  the rest, the bed and the bed\'s own clock gate are all where '
          'this measured them')

    if src.count(FLOOR_OLD) != 1:
        print('FAIL: the duck\'s ramp block is not unique (%d)' % src.count(FLOOR_OLD))
        return 1
    src = src.replace(FLOOR_OLD, FLOOR_NEW, 1)
    open(ALPHA, 'w', encoding='utf8').write(src)
    print('  FIXED    the duck lands on a floor at 12% of his level instead of on zero')
    print('  FIXED    and the rest asks the bed to speak, at the top and in the middle')
    print('  One silence of 14.5s was the only silence of two seconds or more in his '
          'five minutes, and this lane built it.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
