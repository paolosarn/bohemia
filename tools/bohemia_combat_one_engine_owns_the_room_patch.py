#!/usr/bin/env python3
"""
V186 ONE ENGINE OWNS THE ROOM -- his 8/26 bug, and it was a one-word logic error
inside a law we already had.

  PAOLO, playing: "I don't know if you're not doing a good job making sure music
  don't play from the other tabs into the combat. Like, when I'm doing combat,
  bro, there shouldn't be other music playing from other tabs, and same vice
  versa the other way around. So first off, I identify if that's an issue. I feel
  like it is. And then when I'm playing the combat, bro, IT'S LIKE TWO SONGS AT
  THE SAME TIME. What the fuck is going on?"
  And: "you're fucking up the music show. I CAN'T EVEN BEGIN JUDGING IT because
  it sounds like shit."

HE ASKED ME TO CONFIRM IT FIRST, SO IT WAS MEASURED BEFORE IT WAS TOUCHED.
Counting every oscillator and buffer start per frame, per second:

    on RUN, idle                      0.0 / s
    COMBAT open, idle                 0.0 / s
    IN A FIGHT                       22.9 / s
    AFTER LEAVING COMBAT FOR RUN     19.9 / s     <-- still going

Nineteen sounds a second on a tab that is not combat. He is right, twice over,
and in a fight two separate audio contexts were live at once.

-------------------------------------------------------------------------
*** THE LAW ALREADY EXISTED. THE CONDITION WAS JUST WRONG. ***
-------------------------------------------------------------------------
ONE ENGINE LAW (Paolo 7/3/26, crunch hunt), written in this file already:
    "the studio and combat never play at once; two unsynced drum machines FLAM
     INTO MUSH. MUSIC tab open = combat loop silent; back to combat = loop
     returns."

The wire is built: the shell posts {bohemiaMusicMute}, combat obeys it and calls
stopFactionLoop / startFactionLoop. It works. It is aimed at the wrong target:

    if(t.dataset.p==='music'){ ... postMessage({bohemiaMusicMute:true}) }
    if(t.dataset.p!=='music'){ ... postMessage({bohemiaMusicMute:false}) }

*** SO GOING TO ANY TAB THAT IS NOT THE MUSIC STUDIO **STARTS** COMBAT'S MUSIC. ***
Leave a fight for RUN and the shell tells combat to play. That is not a leak, it
is an instruction, and it is exactly the 19.9/s measured above.

The law was written when the only rival engine was the STUDIO, so it asks "is the
studio open?" when the question it means is "IS COMBAT ON SCREEN?". Every tab
added since then inherited the wrong answer.

-------------------------------------------------------------------------
AND THE SECOND SONG IS A SECOND BUG, IN THE SAME HANDLER
-------------------------------------------------------------------------
    if(t.dataset.p!=='music' && MUS.playing){ ...stop CITYMUS or MUS... }

The whole branch is guarded on **MUS.playing**. If the studio is NOT playing but
the CITY SHUFFLE is, nothing stops it -- so the city's music walks straight into a
fight and plays over the combat loop. That is his "two songs at the same time",
and it is why the guard is dropped below: the city shuffle has to stop when combat
opens whether or not the studio happens to be running.

-------------------------------------------------------------------------
WHAT SHIPS: ONE RULE, STATED ONCE.
-------------------------------------------------------------------------
    THE COMBAT TAB OWNS THE AUDIO WHILE IT IS ON SCREEN, AND NOTHING ELSE DOES.

  * combat's loop is muted unless the COMBAT tab is the visible one -- both
    directions of his complaint, from one condition
  * opening COMBAT stops the studio AND the city shuffle, unconditionally
  * the studio still wins over combat while the studio is open, which is the
    original 7/3 ruling and is untouched

REUSE CHECK: cooks no graphic pixels, opens no bank, adds no audio code. It uses
the shipped {bohemiaMusicMute} wire, the shipped MUS.stop() and the shipped
CITYMUS.stopShuffle(). Nothing new plays or is drawn; things stop.

TASTE CHECK: nothing new on screen. What changes is what he stops HEARING.

RIG CHECK: touches no rig, no pose, no painted region, no character pixel.
"""
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = 'V186 ONE ENGINE OWNS THE ROOM'


def sub(src, old, new, n=1, what=''):
    got = src.count(old)
    if got != n:
        sys.exit('ANCHOR %s: expected %d, found %d\n  %r' % (what, n, got, old[:200]))
    return src.replace(old, new)


def main():
    h = open(ALPHA, encoding='utf-8').read()
    if MARK in h:
        print('v186: already applied')
        return

    # ---- 1. THE STUDIO/CITY STOP LOSES ITS WRONG GUARD ----
    h = sub(h,
        "  if(t.dataset.p!=='music'&&MUS.playing){\n"
        "    if(t.dataset.p==='city'&&CITYMUS.on){/* city shuffle owns playback here */}\n"
        "    else { if(CITYMUS.on)CITYMUS.stopShuffle(); else MUS.stop(); } }",
        "  /* ===== V186 ONE ENGINE OWNS THE ROOM ==========================\n"
        "     Paolo 8/26, playing: \"when I'm playing the combat, bro, IT'S LIKE TWO\n"
        "     SONGS AT THE SAME TIME\" and \"I can't even begin judging it because it\n"
        "     sounds like shit.\" MEASURED BEFORE TOUCHING ANYTHING, because he asked\n"
        "     me to confirm it first: 22.9 sound starts a second in a fight, and\n"
        "     19.9 A SECOND AFTER LEAVING COMBAT FOR RUN.\n"
        "     THE SECOND SONG IS THIS BRANCH. It was guarded on MUS.playing, so if\n"
        "     the studio was NOT playing but the CITY SHUFFLE was, nothing stopped\n"
        "     the shuffle and the city's music walked straight into a fight. The\n"
        "     guard is gone: opening COMBAT stops both, whether or not the studio\n"
        "     happens to be running. */\n"
        "  if(t.dataset.p==='combat'){ try{ if(CITYMUS.on)CITYMUS.stopShuffle(); }catch(e){}\n"
        "                              try{ MUS.stop(); }catch(e){} }\n"
        "  else if(t.dataset.p!=='music'&&MUS.playing){\n"
        "    if(t.dataset.p==='city'&&CITYMUS.on){/* city shuffle owns playback here */}\n"
        "    else { if(CITYMUS.on)CITYMUS.stopShuffle(); else MUS.stop(); } }",
        what='stop the other engines')

    # ---- 2. THE MUTE ASKS THE RIGHT QUESTION ----
    h = sub(h,
        "  if(t.dataset.p!=='music'){ const cf=document.getElementById('combatFrame');\n"
        "    if(cf&&cf.contentWindow)try{cf.contentWindow.postMessage({bohemiaMusicMute:false},'*');}catch(e){} }",
        "  /* V186: *** THE ONE-WORD LOGIC ERROR, AND IT IS THE WHOLE BUG. ***\n"
        "     This read `if(t.dataset.p!=='music')` and posted mute:FALSE -- so going\n"
        "     to ANY tab that is not the studio TOLD COMBAT TO START PLAYING. Leaving\n"
        "     a fight for RUN did not leak music, it ORDERED it, which is the 19.9\n"
        "     sounds a second measured on the RUN tab.\n"
        "     THE ONE ENGINE LAW (Paolo 7/3/26) was written when the only rival was\n"
        "     THE STUDIO, so it asks \"is the studio open?\" when what it means is\n"
        "     \"IS COMBAT ON SCREEN?\". Every tab added since inherited the wrong\n"
        "     answer. One condition now covers both directions of his complaint:\n"
        "     COMBAT'S LOOP PLAYS ONLY WHILE THE COMBAT TAB IS THE VISIBLE ONE. */\n"
        "  { const cf=document.getElementById('combatFrame');\n"
        "    const _combatOwnsIt=(t.dataset.p==='combat');\n"
        "    if(cf&&cf.contentWindow)try{cf.contentWindow.postMessage({bohemiaMusicMute:!_combatOwnsIt},'*');}catch(e){} }",
        what='the mute condition')

    open(ALPHA, 'w', encoding='utf-8').write(h)
    print('v186: one engine owns the room -- parent shell patched')


if __name__ == '__main__':
    main()
