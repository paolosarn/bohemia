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
STING_OLD = """function offerAccept(){
  if(!OFFER||OFFER_TAKEN)return false;
  OFFER_TAKEN=true;"""

STING_NEW = """function offerAccept(){
  if(!OFFER||OFFER_TAKEN)return false;
  OFFER_TAKEN=true;
  /* __TAKING_THE_JOB_SOUNDS_LIKE_SOMETHING__ (8/25, SOUND lane). The pivot of
     ONE GOOD DAY, and the last beat of the demo that made no sound of its own.
     IT IS POSTED FROM HERE, NOT DIFFED FROM THE SAVE STATE. The parent CAN see
     a job appear in bohemiaCityState -- but MEASURED: the city broadcasts that
     state only on save-worthy moments, and ZERO arrive during the whole of day
     one, so a diff-based watcher is starved exactly when this fires. A musical
     beat must not wait on a save.
     ONE OWNER, DELIBERATELY: QUESTSTING briefly had a '?' -> id branch for this
     and it was REMOVED when this line landed. Two owners for one moment is the
     bug, not the belt-and-braces. */
  try{ if(window.parent&&window.parent!==window)
    window.parent.postMessage({bohemiaCitySting:{fig:'taken'}},'*'); }catch(_e){}"""

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

# ---- 2c. EVERY BUTTON IN THE CITY IS A UI TAP TOO. --------------------------
# Measured silent on the walk: opening the phone made no sound, and neither does
# any other button inside the city. The shell has ticked its buttons since 8/12.
#
# I MISREAD HIS RULING LAST TURN AND WROTE THE WRONG REASON DOWN. I said
# blanket-wiring city taps would hit his 8/4 complaint ("I CANT HEAR THE SOUNDS
# IF THE UI THAT PLAYS SOUNDS EVERYTIME I CLICK A BUTTON ALSO MAKE A SOUND WHEN
# I CLICK PLAY ON A NEW SOUND IM TESTING"). Re-read on the surface that
# implements it: that ruling is NOT a ban on UI sound. The shell's own handler
# says so -- "every button on the phone is a UI TAP, EXCEPT ON A SURFACE WHOSE
# JOB IS PLAYING A SOUND", excluded BY CONTAINER (#sfxWrap, #sbWrap, #mixWrap,
# the music transport, [data-noui]). UI taps are the design. The exclusion is
# judging surfaces, and the city has none.
#
# SO IT WAS NEVER A POLICY DECISION, IT WAS PLUMBING: that handler is bound to
# the PARENT document, and a click inside an iframe never reaches it. Same
# policy, same three sounds, bound where the clicks actually happen.
TAP_ANCHOR = "document.getElementById('sleepbtn').addEventListener('click',function(){"
TAP_NEW = """/* __THE_CITY_ANSWERS_A_TAP__ (8/22, SOUND lane) -- the shell has ticked its own
   buttons since 8/12 and the city never has, purely because that handler is
   bound to the PARENT document and a click inside an iframe never reaches it.
   Same policy as the shell's, mirrored rather than reinvented: a refusal is
   ui_deny, a way out is ui_back, everything else is ui_tap, all three his and
   all three approved. Read off what the button ALREADY says -- never a new
   attribute nobody sets.
   TWO THINGS ARE EXCLUDED AND BOTH FOR THE SAME REASON: the movement pad
   already makes a FOOTSTEP, and SLEEP and the day-card GO already carry their
   own moment sound (sleep_sink, come_up). Stacking a tick on top of those is
   exactly the two-sounds-on-one-click problem he complained about on 8/4, which
   is the thing this policy exists to avoid, not to cause. [data-noui] stays the
   escape hatch for any panel built later. */
(function(){
  var NOUI='#pad,#sleepbtn,.dcgo,[data-noui]';
  document.addEventListener('click',function(e){
    try{
      var t=e&&e.target; if(!t||!t.closest) return;
      if(t.closest(NOUI)) return;
      /* THE CITY'S CONTROLS ARE DIVS, NOT BUTTONS. The first version of this
         matched only `button` and missed #phonebtn entirely -- measured silent
         on the walk, which is the fourth time this week a too-narrow matcher
         has told me something was missing when it was my selector that was.
         The city's chrome is #topbar and #devtray, one div per control, so ask
         for a direct child of those (closest() resolves the badge SPAN inside
         PHONE up to the control itself). */
      var btn=t.closest('button')||t.closest('.dcbtn')||t.closest('.tab')||t.closest('.opt')
             ||t.closest('#topbar>div')||t.closest('#devtray>div');
      if(!btn) return;
      var lab=(((btn.getAttribute&&(btn.getAttribute('aria-label')||''))+' '+
                (btn.textContent||''))).trim().toLowerCase();
      var refused = btn.disabled===true
                 || (btn.classList && (btn.classList.contains('off')
                                    || btn.classList.contains('disabled')));
      var ev = refused ? 'ui_deny'
             : (/^(back|close|cancel|done|x|<|\\u2039|\\u00d7|\\u2190)$/.test(lab) ? 'ui_back'
             : 'ui_tap');
      if(window.parent&&window.parent!==window)
        window.parent.postMessage({bohemiaCitySfx:{ev:ev}},'*');
    }catch(_e){}
  },true);
})();
document.getElementById('sleepbtn').addEventListener('click',function(){"""

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
            n:[[7,0],[0,3]] },
    /* YOU SAID YES, AND NOTHING HAS HAPPENED YET (8/25). Taking the job is the
       pivot of ONE GOOD DAY and it was the last silent beat of the demo. It is
       NOT a sound effect: nothing in the world makes a noise when you accept
       work, and a chime with no source is the UI convention that killed ten
       SOMEBODY TURNS TO YOU candidates. It is the same KIND of thing as paid,
       done and missed -- a narrative beat carried by the music -- so it joins
       that family and completes it:
           taken   you commit          root -> FOURTH, rising, UNRESOLVED
           paid    you get paid        root -> fifth,  rising, settled
           missed  you let it go       fifth -> root,  falling
           done    you finish it       IV -> I, four notes, plagal
       The FOURTH is the point: it is the interval that does not resolve. You
       have agreed to something and none of it has happened yet. Same voice as
       paid and missed so the four read as one size of life event. */
    taken:  { v:'coldpiano', g:0.19, sd:0.22, oct:0,
            n:[[0,0],[5,3]] }"""

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
    if '__THE_CITY_ANSWERS_A_TAP__' not in c:
        if TAP_ANCHOR not in c:
            print('FAIL: the sleep button handler (the tap anchor) moved')
            return 1
        c = c.replace(TAP_ANCHOR, TAP_NEW, 1)
        changed.append("the city's buttons answer a tap, same policy as the shell's")
    if 'bohemiaCitySting' not in c:
        if STING_OLD not in c:
            print('FAIL: offerAccept moved'); return 1
        c = c.replace(STING_OLD, STING_NEW, 1)
        changed.append('taking the job posts its own sting, from offerAccept')
    if "ev:'door_drag'" not in c:
        if DOOR_OLD not in c:
            print('FAIL: inEnter is not where this tool expects it')
            return 1
        c = c.replace(DOOR_OLD, DOOR_NEW, 1)
        changed.append('walking through a door now drags it open (his 8/9 thumb)')
    if changed:
        open(CITY, 'w', encoding='utf8').write(c)

    a = open(ALPHA, encoding='utf8').read()
    # GUARD ON THE NEW THING, NOT AN OLD ONE (8/25). This keyed on `missed`,
    # which the alpha already had, so the block was skipped and the `taken`
    # figure added later never landed -- the tool printed "already applied"
    # about work it had not done. An idempotence check must name what THIS
    # version adds, or it silently protects a stale build.
    if "taken:  { v:'coldpiano'" not in a:
        if FIG_OLD not in a:
            print('FAIL: the STING figure table is not where this tool expects it')
            return 1
        a = a.replace(FIG_OLD, FIG_NEW, 1)
        changed.append('STING.missed added: falling, small, the inverse of paid')
    if PLAY_OLD in a:
        a = a.replace(PLAY_OLD, PLAY_NEW, 1)
        changed.append('a missed job no longer plays the fight-loss cadence')
    if 'bohemiaCitySting!==undefined' not in a:
        if """  if(d.bohemiaCitySfx!==undefined){""" not in a:
            print('FAIL: the city-sfx message handler moved'); return 1
        a = a.replace("""  if(d.bohemiaCitySfx!==undefined){""", """  /* 8/25: and the MUSICAL beats, beside the sound ones. A sting is not a
     playSFX -- it is a figure in the score -- so it gets its own key rather
     than being smuggled through the sfx channel. */
  if(d.bohemiaCitySting!==undefined){
    try{ if(window.STING) STING.play(String(d.bohemiaCitySting.fig||'')); }catch(e){}
    return true;
  }
  if(d.bohemiaCitySfx!==undefined){""", 1)
        changed.append('the shell answers a sting message from the city')

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
