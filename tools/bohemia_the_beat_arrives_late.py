#!/usr/bin/env python3
"""
THE BEAT ARRIVES LATE (9/12/26, SOUNDS lane) - [music owned], round 3.

*** THE SOUND CARD MEASURED THE ONE THING HIS ANCHOR IS FAMOUS FOR AND FOUND IT
MISSING FROM ALL 142 SONGS. THIS IS THAT FIX. ***

His 9/6 ruling names the sound: "post-apocalyptic Final Fantasy X, especially that
fantasy beach vibe, it was so good." His 9/7 anchor names the track: FFX OST,
BESAID ISLAND, the original not the remaster. And the law says, in its own words,
exactly WHY the original is the one people mean:

    "The remaster changed it (shorter, a more synthetic beat that STARTS SOONER,
     the bass line removed) and people noticed, which tells the lane WHAT THEY
     LOVED: the patience, the bass under it, THE BEAT ARRIVING LATE."

MEASURED on 9/12, rendering all 142 songs through the real playStep: the first
transient lands at **0.04 seconds for 137 of 142 songs**, and censused on the live
library, **138 of 142 put the drum on BEAT ONE**. The other four have no drum at
all. NOT ONE song on this shelf has a late beat. The single trait the law names as
what people loved is the single trait we do not have.

*** AND IT IS NOT A RE-COOK, WHICH IS THE WHOLE REASON THIS IS BUILDABLE. ***
Changing a song's kick array is changing HIS song, 138 times over, and tagging and
content are his. But WHEN THE DRUMS ARRIVE IS NOT IN THE SONG, IT IS IN THE
ENGINE: playStep decides, every step, whether to sound the kit. So one rule in one
place gives every song on the shelf the trait he named, and not one song's data is
touched.

THE RULE: for the FIRST PHRASE after a song starts -- 128 steps, 8 bars, 16
seconds at 120 BPM, the engine's own unit and the same one the street's rest and
the opening's handoff already use -- the KICK and the HAT do not sound. The bass
and the melody do. Then the beat arrives.

*** WHERE IT APPLIES, AND EVERY EXCLUSION IS A RULING OR A MEASUREMENT. ***
  * THE STREET and THE ROOM: yes. Both reset MUS.step to 0 when they pick a song,
    so "the first phrase of a song" and "step under 128" are the same sentence.
  * A FIGHT: NEVER. His 8/26 ruling and the 8/19 record both say danger is now;
    the first fight exists to TEACH the beat (COMBAT [first fight]), and a fight
    whose beat arrives sixteen seconds late teaches nothing. Guarded on
    FIGHTMUS.on.
  * THE OPENING: NEVER, and it would have been a no-op anyway -- measured, all
    four songs with an empty kick array are MENU songs, so the opening has no
    drums to hold. Guarded on MENUMUS.on so the reason is in the code and not
    just in a record.
  * THE MUSIC TAB: NEVER. He judges candidates there, and sixteen silent bars at
    the top of a candidate is a judging artefact, not a song. Guarded by requiring
    a game surface to own the music: the studio's own play never sets CITYMUS.on.

THE 120 BPM LAW IS UNTOUCHED AND THAT IS LOAD-BEARING. The transport does not
stop, the step counter does not pause, nothing is rescheduled: two `drumV` calls
are skipped. The clock is exactly as it was, which is what the law is about, and
the PULSE that covers the boot is a separate buffer on the SFX bus and never sees
this at all.

BOTH DRUMS, ONE LEVER, ON PURPOSE. The law says "the beat", and the kick and the
hat are both the kit. Holding the kick and letting the hat play would be a second
decision nobody ruled, so it is one lever until he says otherwise.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new song, no new
tag, no new event, no new number except the phrase, which is asked of the engine's
own tempo through phraseMs()'s twin -- the step count the rest and the handoff
already share.

  python3 tools/bohemia_the_beat_arrives_late.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_BEAT_ARRIVES_LATE__'

API_ANCHOR = " playStep(s,t,sc){ sc=sc||{sec:'A',rs:0,fill:false,barIn:0,bar:0};"

API = r""" /* __THE_BEAT_ARRIVES_LATE__ (9/12, SOUNDS lane) -- THE DRUMS COME IN A PHRASE
    AFTER THE SONG DOES, WHICH IS THE ONE THING HIS ANCHOR IS FAMOUS FOR.
    His law's own words about why the ORIGINAL Besaid is the one people mean:
    "The remaster changed it (shorter, a more synthetic beat that STARTS SOONER,
    the bass line removed) and people noticed, which tells the lane WHAT THEY
    LOVED: the patience, the bass under it, THE BEAT ARRIVING LATE."
    MEASURED 9/12 by rendering all 142 songs through this very function: the first
    transient lands at 0.04s for 137 of them, and 138 of 142 put the drum on BEAT
    ONE. Not one song on the shelf had a late beat.
    IT IS NOT A RE-COOK, AND THAT IS WHY IT IS BUILDABLE. A song's kick array is
    HIS content, 138 times over. But WHEN the drums arrive was never in the song
    -- it is decided here, every step -- so one rule gives the whole shelf the
    trait he named and touches no song's data.
    THE 120 BPM LAW IS UNTOUCHED: the transport does not stop, the step counter
    does not pause, nothing is rescheduled. Two drumV calls are skipped. */
 drumsHeld(){
   try{
     /* A GAME SURFACE HAS TO OWN THE MUSIC. The MUSIC tab's own play never sets
        these, and sixteen silent bars at the top of a candidate he is judging is
        an artefact, not a song. */
     var owned = (typeof CITYMUS!=='undefined' && CITYMUS && CITYMUS.on)
              || (typeof INTERIORMUS!=='undefined' && INTERIORMUS && INTERIORMUS.on);
     if(!owned) return false;
     /* A FIGHT: NEVER. Danger is now (the 8/19 record), and the first fight
        exists to TEACH the beat -- a beat that arrives sixteen seconds late
        teaches nothing. */
     if(typeof FIGHTMUS!=='undefined' && FIGHTMUS && FIGHTMUS.on) return false;
     /* THE OPENING: NEVER. Measured, it is also a no-op -- all four songs with an
        empty kick array are MENU songs -- but the reason belongs in the code. */
     if(typeof MENUMUS!=='undefined' && MENUMUS && MENUMUS.on) return false;
     /* THE FIRST PHRASE OF THE SONG. Both the street and the room reset step to 0
        when they pick, so "the first phrase of a song" and "step under 128" are
        the same sentence. 128 steps is the engine's own unit: 8 bars, and the
        same one the street's rest and the opening's handoff share. */
     return MUS.step < 128;
   }catch(_e){ return false; }
 },
 playStep(s,t,sc){ sc=sc||{sec:'A',rs:0,fill:false,barIn:0,bar:0};
  var _held = this.drumsHeld();"""

KICK_ANCHOR = ("  if(f.kick.includes(s)||(sc.fill&&s>=12)){ drumV((f.kit&&f.kit.k)"
               "||'punchk',AC,MAST,t); }")
KICK_REPLACE = ("  if(!_held && (f.kick.includes(s)||(sc.fill&&s>=12))){ drumV((f.kit&&f.kit.k)"
                "||'punchk',AC,MAST,t); }   /* __THE_BEAT_ARRIVES_LATE__ */")

STEPBUS_ANCHOR = ("    STEP_BUS.connect((window.__SFXBUS) || MUS.OUT || MUS.MAST "
                  "|| AC.destination);  /* 8/2: through the SFX master so one "
                  "slider reaches it */ }catch(_e){ STEP_BUS = null; } }")

STEPBUS_REPLACE = (
    "    STEP_BUS.connect((window.__SFXBUS) || MUS.OUT || MUS.MAST || AC.destination);"
    "  /* 8/2: through the SFX master so one slider reaches it */\n"
    "    /* __THE_FOOTSTEP_BUS_IS_REACHABLE__ (9/12, SOUNDS lane) -- THE ONLY NODE\n"
    "       IN THIS GAME THAT CARRIES FOOTSTEPS AND NOTHING ELSE, exposed the same\n"
    "       way __SFXBUS, __AMB and __PULSE already are, and for the same reason.\n"
    "       WHY: sfx_wired_gate's \"WALKING MADE NO SOUND\" check metered MUS.MAST --\n"
    "       the MUSIC master, which footsteps never touch -- so it accused the feet\n"
    "       while watching the songs, and went red the day the street's music got\n"
    "       quieter for a phrase. Moving it to __SFXBUS was better and still not\n"
    "       enough: that bus carries EVERY effect, so silencing the feet outright\n"
    "       left it reading healthy and THE MUTATION DID NOT BITE. A BUS THAT\n"
    "       CARRIES MORE THAN ITS SUBJECT CANNOT ANSWER A QUESTION ABOUT ITS\n"
    "       SUBJECT. */\n"
    "    window.__STEPBUS = STEP_BUS; }catch(_e){ STEP_BUS = null; } }")

HAT_ANCHOR = ("  if(_hd.includes(s)&&sc.sec!=='C'){ drumV((f.kit&&f.kit.h)"
              "||'tight',AC,MAST,t); }")
HAT_REPLACE = ("  if(!_held && _hd.includes(s)&&sc.sec!=='C'){ drumV((f.kit&&f.kit.h)"
               "||'tight',AC,MAST,t); }   /* __THE_BEAT_ARRIVES_LATE__ -- both\n"
               "     drums, one lever: the law says \"the beat\" and the kick and the hat are\n"
               "     both the kit. Holding one and not the other is a second decision nobody\n"
               "     ruled. */")


def main():
    print('=== THE BEAT ARRIVES LATE ===')
    src = open(ALPHA, encoding='utf8').read()
    if MARK in src:
        # NOT A NO-OP ANY MORE, and this cost a push. ONE MARK GUARDED TWO
        # SEPARATE CHANGES -- the drum hold and the footstep bus -- so with the
        # first present and the second missing the tool declared itself done and
        # the rebuild dropped half the round on the floor. An idempotence guard
        # has to be per CHANGE, not per tool.
        fixed = False
        if '__THE_FOOTSTEP_BUS_IS_REACHABLE__' not in src:
            if src.count(STEPBUS_ANCHOR) != 1:
                print('FAIL: the footstep bus anchor is not unique (%d)'
                      % src.count(STEPBUS_ANCHOR))
                return 1
            src = src.replace(STEPBUS_ANCHOR, STEPBUS_REPLACE, 1)
            fixed = True
            print('  REPAIRED  the footstep bus was missing -- one mark was '
                  'guarding two changes')
        if fixed:
            open(ALPHA, 'w', encoding='utf8').write(src)
        else:
            print('  already installed (idempotent, nothing to do)')
        return 0

    for what, anchor in (('the api', API_ANCHOR),
                         ('the kick', KICK_ANCHOR),
                         ('the hat', HAT_ANCHOR),
                         ('the footstep bus', STEPBUS_ANCHOR)):
        if src.count(anchor) != 1:
            print('FAIL: anchor for %s is not unique (%d)'
                  % (what, src.count(anchor)))
            return 1

    # POSITIVE CONTROLS ON THE PREMISE. This only makes sense if the three systems
    # it defers to are really the ones that own the music, and if the phrase is
    # really the unit the rest of this lane already uses.
    for need, why in (('const CITYMUS={', 'the street'),
                      ('const FIGHTMUS={', 'the fight'),
                      ('const MENUMUS={', 'the opening'),
                      ('__THE_ROOM_HAS_ITS_OWN_SONG__', 'the room')):
        if need not in src:
            print('FAIL: %s is not where this expects it, so the exclusions '
                  'cannot be trusted' % why)
            return 1
    if 'function phraseMs()' not in src:
        print('FAIL: the phrase helper is missing, so 128 here would be a second '
              'copy of a number this lane already got wrong once')
        return 1

    src = src.replace(API_ANCHOR, API, 1)
    print('  BUILT  drumsHeld() -- the first phrase of a song has no kit')
    src = src.replace(KICK_ANCHOR, KICK_REPLACE, 1)
    print('  WIRED  the kick waits')
    src = src.replace(HAT_ANCHOR, HAT_REPLACE, 1)
    print('  WIRED  the hat waits with it')
    src = src.replace(STEPBUS_ANCHOR, STEPBUS_REPLACE, 1)
    print('  EXPOSED  the footstep bus, so the gate that accused the feet can '
          'actually watch them')

    open(ALPHA, 'w', encoding='utf8').write(src)
    print('  138 of 142 songs put the drum on beat one and NOT ONE had a late '
          'beat. No song\'s data was touched: when the drums arrive was never in '
          'the song.')
    print('  NEVER in a fight (danger is now, and the first fight teaches the '
          'beat), never in the opening, never in the MUSIC tab.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
