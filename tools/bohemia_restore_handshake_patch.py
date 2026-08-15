#!/usr/bin/env python3
"""
THE CITY ASKS FOR ITS SAVE INSTEAD OF BEING THROWN ONE (8/15/26, RUN lane).
The second bug the demo gate found, and it is the one that actually loses runs.

MEASURED, on the real alpha, playing a real day and reloading:

    CITYSAVE before reload : 2755 bytes, day 2, purse yes, market yes
    CITYSAVE after  reload : day 2, purse yes, market yes      (the save is FINE)
    the world came back as : day 1, purse 0, market null, DAY_RESTORED false
    T.day after the boot   : 1        <- applyRestore was NEVER CALLED
    applyRestore(that exact payload), called by hand a moment later:
                             returns true, day 2, purse 499.75, water 702

So the save was perfect, the restore function was perfect, and the two were
never introduced. The run silently started over with a correct save sitting in
localStorage.

THE CAUSE IS THE HANDOFF ITSELF, not any one line of it. The shell GUESSES when
the city is ready:

    fr.addEventListener('load', () => { ...
      setTimeout(() => { ...postMessage({bohemiaCityRestore: sv.data})... }, 320); });

One `setTimeout`, fired once, at a moment picked by hand, with no acknowledgement
and no retry. The city is ~1.6 MB of script that grows every day and boots
against whatever else the phone is doing. When 320ms after `load` happens to fall
on the wrong side of the city's readiness -- and it does, reproducibly, after a
played day -- the message lands in a document that cannot act on it yet and
NOTHING SAYS SO. A number tuned by hand against a boot time that changes daily is
not a handshake, it is a bet, and this is the same disease as every other
hand-passed value this repo has paid for.

THE FIX IS THE IDIOM THE FILE ALREADY USES. The city ALREADY asks the shell for
things when it is ready rather than waiting to be handed them:

    postMessage({type:'BOHEMIA_CITY_NEED_PLAYER'})     -- CITY_WORLD:18992

The save now works the same way. THE CITY ASKS, because the city is the only
party that knows when the city is ready:

    city  -> shell : {bohemiaCityNeedRestore:1}       "I am up, do I have a save?"
    shell -> city  : {bohemiaCityRestore: <data>}     or {bohemiaCityRestoreNone:1}

and the boot does not decide whether to open a fresh DAY 1 card until it has an
answer. The old 320ms push is LEFT IN PLACE on purpose: it is harmless, it is
idempotent (applyRestore is a pure apply), and if it happens to win the race the
handshake simply finds the day already restored. Belt and braces, not a rewrite.

WHY THE WAKE CARD HAD TO MOVE TOO. The boot ran

    setTimeout(function(){ if(!DAY_RESTORED) showWake(); else updQline(); }, 60);

SIXTY MILLISECONDS. That is a decision about whether this is a new game, taken
before any answer about the save could possibly have arrived -- so on every
reload the returning player got a DAY 1 wake card thrown over the top of their
own run, and only a restore that beat 60ms could stop it. It now waits for the
answer, with a cap so a shell that never replies (the city opened directly as its
own page, which is how half the gates run it) still starts a normal day.

NOTE ON ORDER: this only works because the shell can hear the city at all, which
it could not until __THE_CITY_CAN_TALK__ earlier today -- combatMsgIn dropped
every untyped bohemia* message on its second line. The two fixes are one story.

REUSE CHECK: cooks no graphic pixels of any kind and opens no art bank, because
nothing here is drawn. It reuses the existing BOHEMIA_CITY_NEED_PLAYER
ask-on-boot idiom and the existing applyRestore; it adds no new save format and
no second code path for restoring.

Idempotent: re-running finds the marker and reports NOOP.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_CITY_ASKS_FOR_ITS_SAVE__'

# ---- 1. the city asks, and waits for the answer before deciding it is day 1 ----
CITY_OLD = """setTimeout(function(){ if(!DAY_RESTORED) showWake(); else updQline(); },60);"""

CITY_NEW = """/* """ + MARK + """ -- THE CITY ASKS FOR ITS SAVE, because the city is the
   only party that knows when the city is ready.
   THIS LINE USED TO BE A SIXTY MILLISECOND TIMER. It decided "is this a new
   game?" 60ms into a boot, long before any answer about the save could arrive,
   so a returning player got a DAY 1 wake card thrown over their own run unless
   the restore beat 60ms. MEASURED 8/15: after a played day the shell's restore
   push (one setTimeout, 320ms after the iframe load, no ack, no retry) missed
   entirely -- applyRestore was never called, T.day stayed 1, and a perfect 2755
   byte save sat in localStorage while the run started over.
   Same idiom as BOHEMIA_CITY_NEED_PLAYER above: ASK, then act on the answer.
   The shell's old 320ms push is deliberately left alone -- applyRestore is a
   pure apply, so if it wins the race this just finds the day already restored. */
var RESTORE_ANSWERED=false;
function bootWake(){
  if(window.__BOOTED_WAKE)return; window.__BOOTED_WAKE=true;
  if(!DAY_RESTORED) showWake(); else updQline();
}
try{ if(window.parent&&window.parent!==window)
  window.parent.postMessage({bohemiaCityNeedRestore:1},'*'); }catch(_e){}
/* the cap is not a guess about the shell's speed, it is the answer to "there is
   no shell": every gate that opens this page DIRECTLY has no parent to reply,
   and a returning player must never be stuck looking at nothing. */
setTimeout(function(){ if(!RESTORE_ANSWERED) bootWake(); },1200);"""

# the city acts the moment the answer lands, whichever answer it is
CITY_OLD2 = """  if(d&&d.bohemiaCityRestore)applyRestore(d.bohemiaCityRestore);"""
CITY_NEW2 = """  if(d&&d.bohemiaCityRestore){ applyRestore(d.bohemiaCityRestore);
    /* """ + MARK + """ */ RESTORE_ANSWERED=true; try{ bootWake(); }catch(_e){} }
  if(d&&d.bohemiaCityRestoreNone){ RESTORE_ANSWERED=true;   /* """ + MARK + """ --
    "you have no save" IS an answer, and it is the one that starts a new game. */
    try{ bootWake(); }catch(_e){} }"""

# ---- 2. the shell answers -------------------------------------------------
ALPHA_OLD = """  if(d.bohemiaCityState!==undefined){"""
ALPHA_NEW = """  if(d.bohemiaCityNeedRestore!==undefined){
    /* """ + MARK + """ -- THE CITY ASKED. The old arrangement had this shell
       GUESS when the city was ready (one setTimeout, 320ms after the iframe
       load, no ack, no retry) and after a played day it missed: a perfect save
       sat in localStorage while the run started over at day 1. The city is the
       only party that knows when it is up, so now it asks and this answers.
       "No save" is answered too -- silence is what the 60ms boot timer used to
       have to guess about. */
    const cf=document.getElementById('cityFrame');
    const sv=CITYSAVE.load();
    if(cf&&cf.contentWindow)try{
      cf.contentWindow.postMessage((sv&&sv.data)?{bohemiaCityRestore:sv.data}
                                               :{bohemiaCityRestoreNone:1},'*');
    }catch(e){}
    return true;
  }
  if(d.bohemiaCityState!==undefined){"""


def main():
    for f in (CITY, ALPHA):
        if not os.path.exists(f):
            sys.exit('FAIL: ' + f + ' not found')
    c = open(CITY, encoding='utf-8').read()
    a = open(ALPHA, encoding='utf-8').read()
    if MARK in c and MARK in a:
        print('NOOP: ' + MARK + ' already present')
        return
    for name, old in [('city boot wake', CITY_OLD), ('city restore listener', CITY_OLD2)]:
        if old not in c:
            sys.exit('FAIL: anchor not found -- ' + name)
    if ALPHA_OLD not in a:
        sys.exit('FAIL: anchor not found -- alpha city-state handler')
    c = c.replace(CITY_OLD, CITY_NEW, 1).replace(CITY_OLD2, CITY_NEW2, 1)
    a = a.replace(ALPHA_OLD, ALPHA_NEW, 1)
    open(CITY, 'w', encoding='utf-8').write(c)
    open(ALPHA, 'w', encoding='utf-8').write(a)
    print('PATCHED ' + CITY + ' + ' + ALPHA)


if __name__ == '__main__':
    main()
