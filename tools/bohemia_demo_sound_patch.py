#!/usr/bin/env python3
"""
BOHEMIA — THE DEMO'S OWN BEATS MAKE HIS OWN SOUNDS (8/22/26, SOUND lane).

REUSE CHECK: cooks NOTHING. Every sound here is already approved, already cooked
and already in the bank -- come_up (4 of 5, his 8/16b sweep) and sleep_sink
(5 of 5). The only new thing is one STING figure built from voices already in
the rack. No new candidate, no new voice, nothing for him to judge.

WHY. gates/demo_sound_gate.js walked the actual demo -- splash, decline, get up,
phone, take the job, six steps, sleep, day two, the valley -- and recorded every
sound the game asked for. Five of ten beats were silent, and two of the silences
are sounds HE ALREADY APPROVED:

    GET UP -- the first morning     silent    come_up   is approved 4 of 5
    SLEEP  -- the day ends          silent    sleep_sink is approved 5 of 5

THE REASON IS THAT THE GAME MOVED HOUSE. Both are wired -- in
slices/BOHEMIA_RUN_SLICE, the panel the player never opens any more. The RUN tab
shows the CITY now, so the demo runs in the city and the wake and sleep sounds
sit in a room nobody walks into. Seven approved moments are in that position.
This is APPROVED-BUT-UNUSED wearing a new coat: the wire exists, it is just
attached to the old building.

HOW, AND WHY IT IS THE CITY THAT POSTS. The city already owns exactly this seam
and already uses it for exactly this reason -- `bohemiaCitySfx` was added for
phone_buzz, with the note "the city is an iframe, so it asks the alpha, which
owns the audio bus and the approved bank, rather than cooking a tone of its own."
Two more posts on that same channel; no new mechanism.

AND ONE THING I GOT WRONG TWO TURNS AGO. The same walk caught QUESTSTING playing
`loss` when the player goes to sleep with the day's job unfinished. `loss` is the
figure authored for LOSING A FIGHT -- "falling, and it lands heavy" -- and firing
it on the ordinary sleep beat says you were defeated when what happened is you
did not get round to a job. That is the mistake the `paid` figure's own note
warns about in the other direction: "a water run in a dead valley is not a boss
kill, and if it were scored like one then neither would mean anything." So a
missed job gets its own figure: `missed`, two notes, falling, the exact inverse
of `paid`, on the same voice so it reads as the same size of life event.

  python3 tools/bohemia_demo_sound_patch.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# ---- 1. GET UP. The wake card's only button. --------------------------------
WAKE_OLD = ("  cardShow(h,function(){ cardHide(); "
            "try{ vistaBeatMaybe(); }catch(_e){} });")
WAKE_NEW = """  cardShow(h,function(){ cardHide();
    /* __THE_MORNING_MAKES_A_SOUND__ (8/22, SOUND lane) -- HIS OWN, APPROVED AND
       STRANDED. come_up is 4 of 5 from his 8/16b sweep and it was wired only in
       the RUN slice, the panel nobody opens since the RUN tab started showing
       the city. Measured silent on the real demo walk by gates/demo_sound_gate.js.
       Same channel the phone already uses: the city asks the alpha, which owns
       the bus and the bank. */
    try{ if(window.parent&&window.parent!==window)
      window.parent.postMessage({bohemiaCitySfx:{ev:'come_up'}},'*'); }catch(_e){}
    try{ vistaBeatMaybe(); }catch(_e){} });"""

# ---- 2. SLEEP. The button, not the card that follows it. --------------------
SLEEP_OLD = """document.getElementById('sleepbtn').addEventListener('click',function(){
  if(DAY.phase!=='awake')return; DAY.sleep(); daySync(); onNightfall(); updHud();
});"""
SLEEP_NEW = """document.getElementById('sleepbtn').addEventListener('click',function(){
  if(DAY.phase!=='awake')return;
  /* __SETTLING IN IS A SOUND HE PICKED__ (8/22, SOUND lane) -- sleep_sink is
     5 of 5, his cleanest sweep, and it was stranded in the RUN slice exactly
     like come_up. It goes BEFORE the state change, on the tap, so it lands with
     the button rather than after eight hours of clock have already moved. */
  try{ if(window.parent&&window.parent!==window)
    window.parent.postMessage({bohemiaCitySfx:{ev:'sleep_sink'}},'*'); }catch(_e){}
  DAY.sleep(); daySync(); onNightfall(); updHud();
});"""

# ---- 2b. THE DOOR DRAGS OPEN. -----------------------------------------------
# Measured silent on the walk (8/22): entering a building -- the commonest thing
# a player does, and the way every fight starts -- made no sound at all, while
# door_drag sat approved from his 8/9 sweep and wired only in the run slice.
#
# AND IT DOES NOT BREAK THE DOOR RULING. He killed all ten door_open/door_shut
# candidates and the game owes those silence; sfx_wired_gate asserts neither is
# ever banked. door_drag is a SEPARATE, LATER, APPROVED sound, and his ruling on
# it is already written down in this lane's wire tool: "the door DRAGS open (his
# 8/9 thumb); the SHUT stays silent, also his." Opening is the half he said yes
# to. The shut stays silent here too.
DOOR_OLD = """  try{ cityFightOnEnter(); }catch(_e){}
  advance(0.5); return true;"""
DOOR_NEW = """  /* __THE_DOOR_DRAGS_OPEN__ (8/22, SOUND lane) -- his 8/9 thumb, approved and
     stranded in the run slice. inEnter is, in this file's own words, "the ONE
     place a body goes through a door", so this is the only hook needed.
     BEFORE the fight assembles, because the door is what you hear first.
     THE SHUT STAYS SILENT, also his ruling: door_open and door_shut died 10 for
     10 and the game owes them nothing. Only the drag was approved. */
  try{ if(window.parent&&window.parent!==window)
    window.parent.postMessage({bohemiaCitySfx:{ev:'door_drag'}},'*'); }catch(_e){}
  try{ cityFightOnEnter(); }catch(_e){}
  advance(0.5); return true;"""

# ---- 3. A MISSED JOB IS NOT A LOST FIGHT. -----------------------------------
FIG_OLD = """    done: { v:'bell',      g:0.20, sd:0.34, oct:0,
            n:[[5,0],[0,2],[0,5],[12,5]] }"""
FIG_NEW = """    done: { v:'bell',      g:0.20, sd:0.34, oct:0,
            n:[[5,0],[0,2],[0,5],[12,5]] },
    /* A MISSED JOB IS NOT A LOST FIGHT (8/22). QUESTSTING was playing `loss` --
       "falling, and it lands heavy", authored for losing a FIGHT -- when the
       player slept with the day's job unfinished. Caught by walking the demo:
       going to bed sounded like being beaten. This is the exact inverse of
       `paid` (root up to the fifth), on the SAME voice, so a job you missed and
       a job you got paid for read as the same size of event pointing opposite
       ways. Small on purpose: the day is not over, and tomorrow exists. */
    missed: { v:'coldpiano', g:0.18, sd:0.22, oct:0,
            n:[[7,0],[0,3]] }"""

PLAY_OLD = "      STING.play((b[2]==='COMPLETE')?'done':'loss');"
PLAY_NEW = """      /* 8/22: NOT `loss` -- see the `missed` figure. A job you did not get
         round to is not a fight you lost. */
      STING.play((b[2]==='COMPLETE')?'done':'missed');"""


def main():
    changed = []

    c = open(CITY, encoding='utf8').read()
    if "ev:'come_up'" not in c:
        if WAKE_OLD not in c:
            print('FAIL: the wake card handler is not where this tool expects it')
            return 1
        c = c.replace(WAKE_OLD, WAKE_NEW, 1)
        changed.append('GET UP now plays come_up (his 8/16b, 4 of 5)')
    if "ev:'sleep_sink'" not in c:
        if SLEEP_OLD not in c:
            print('FAIL: the sleep button handler is not where this tool expects it')
            return 1
        c = c.replace(SLEEP_OLD, SLEEP_NEW, 1)
        changed.append('SLEEP now plays sleep_sink (5 of 5, his cleanest sweep)')
    if "ev:'door_drag'" not in c:
        if DOOR_OLD not in c:
            print('FAIL: inEnter is not where this tool expects it')
            return 1
        c = c.replace(DOOR_OLD, DOOR_NEW, 1)
        changed.append('walking through a door now drags it open (his 8/9 thumb)')
    if changed:
        open(CITY, 'w', encoding='utf8').write(c)

    a = open(ALPHA, encoding='utf8').read()
    if "missed: { v:'coldpiano'" not in a:
        if FIG_OLD not in a:
            print('FAIL: the STING figure table is not where this tool expects it')
            return 1
        a = a.replace(FIG_OLD, FIG_NEW, 1)
        changed.append('STING.missed added: falling, small, the inverse of paid')
    if PLAY_OLD in a:
        a = a.replace(PLAY_OLD, PLAY_NEW, 1)
        changed.append('a missed job no longer plays the fight-loss cadence')
    open(ALPHA, 'w', encoding='utf8').write(a)

    for x in changed:
        print('  ' + x)
    if not changed:
        print('  everything is already applied')
    else:
        print('  NEXT: node gates/demo_sound_gate.js')
    return 0


if __name__ == '__main__':
    sys.exit(main())
