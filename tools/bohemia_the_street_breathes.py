#!/usr/bin/env python3
"""
THE STREET BREATHES (9/11/26, SOUNDS lane) - [music owned], round 2.

*** MEASURED ON THE REAL SURFACE, TWELVE MINUTES OF LISTENING: THE MUSIC NEVER
STOPS, AND EVERY SONG IS SWAPPED AT EXACTLY 128 SECONDS. ***

Round 1 fixed WHICH songs can be heard. Round 2 asked the next question and
measured it rather than guessing: what does a player actually hear over real
minutes on the walked street? A recorder in the page logged every song change.

    DUSK,  6 minutes: 3 changes, TWO distinct songs
        THE WIND LEARNS WORDS -> TWO COINS FOR THE FERRYMAN -> THE WIND LEARNS WORDS
        held for: 128s, 128s
    NIGHT, 6 minutes: 4 changes, 4 distinct songs
        held for: 24s, 128s, 128s
    EVER SILENT: false. Not once, in either phase.

Two facts fall out, and neither is a tagging question:

1. **THE MUSIC NEVER STOPS.** Twelve minutes of continuous playing, and it would
   be a hundred hours of continuous playing. There is no air anywhere in it.
2. **EVERY SONG GETS EXACTLY 128 SECONDS**, then the next one starts on the very
   next beat with nothing in between. 128s is the 64-bar pass, which is the
   engine's loop length -- a number about buffers, not about music.

*** AND THE THING THAT SHOULD BE IN THE GAP IS ALREADY BUILT AND PERMANENTLY
MASKED. *** This lane spent 9/5 building the ambience bed: 79 districts in four
kinds, a lit block that hums at the grid's own distance, wind, air, the desert
speaking every 60 to 130 seconds. All of it plays UNDERNEATH a song that never
stops. The quietest, most place-specific work in this lane is buried under a
wall of music twenty-four hours a day.

*** HIS OWN DEMO FLOW ALREADY SAYS SILENCE IS AN INSTRUMENT. *** Not my idea and
not a new law -- laws/BOHEMIA_DEMO_FLOW_7_10_26.md, his music mapping, in his
file:

    "WASH: no music or lowest-key ambient -- silence is the calm"
    "on clear + hatch approach: single sting, then silence over the purple.
     The quiet IS the reveal."

The valley is a dead city with the power out. REALISM FIRST: it does not have a
soundtrack running every minute of every day.

SO THE STREET BREATHES. When a song's pass ends, the music rests for ONE PHRASE
-- 8 bars, 128 steps, 16 seconds at 120 BPM, the same unit CITYMUS already turns
its time-of-day pool on and MENUMUS hands the opening over on -- and in that
phrase you hear the block you are standing on. Then the next song starts from
its beginning.

*** THE REST IS A DUCK, NOT A STOP, AND THAT DISTINCTION IS THE WHOLE SAFETY
ARGUMENT. *** MUS.stop() clears the scheduler and cuts the master to zero, and
the engine's own comment at the combat hook says why that is dangerous: combat
swaps the song IN PLACE on the running transport and never calls start(), so a
fight beginning during a stopped transport would be SILENT. And the 120 BPM LAW
is about a clock that does not stop.
So the transport keeps running the whole time and only the music master is
ducked. Consequences, all of them wanted:
  * the beat never stops, so the law is kept and a fight can take the music on
    the very next beat;
  * the ambience bed is on the SFX bus, not the music master, so it is untouched
    and it is the only thing left;
  * anything that wants the music back gets it instantly.

AND THE LEVEL IS CAPTURED, NOT TYPED. The engine's full master is 0.8 and that
number is already written in two places. A third copy would rot the first time
anybody moved it, so the rest reads the gain it is about to duck and restores
exactly that. If he ever turns the master down, the rest comes back to HIS level.

FOUR WAYS THE REST ENDS EARLY, because a rest must never be in the way:
  * a FIGHT starts -- the music comes back immediately, no waiting;
  * the OPENING or a ROOM takes over -- not ours any more, hands off clean;
  * the CLOCK CROSSES A PHASE -- if dawn breaks mid-rest, the rest is over,
    because a phase change is the one thing the music is supposed to announce;
  * the shuffle is turned off -- the gain is restored on the way out so OFF
    never leaves a ducked master behind for the next system that plays.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new song, no new
tag, no new message, no new number except the rest length, which is the engine's
own phrase.

  python3 tools/bohemia_the_street_breathes.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_STREET_BREATHES__'

REST_API_ANCHOR = "  startShuffle(){ this.on=true;"

REST_API = r"""  /* __THE_STREET_BREATHES__ (9/11, SOUNDS lane) -- A REST BETWEEN SONGS.
     MEASURED, twelve minutes with a recorder in the page: the music NEVER stops
     and every song is swapped at EXACTLY 128 seconds. Dusk was two songs
     ping-ponging, 128s and 128s. 128s is the 64-bar pass -- the engine's loop
     length, a number about buffers and not about music -- and the next song
     starts on the very next beat with nothing in between.
     AND THE THING THAT SHOULD BE IN THE GAP IS ALREADY BUILT AND PERMANENTLY
     MASKED: the ambience bed (79 districts, the lit block that hums, the desert
     speaking every 60 to 130 seconds) plays underneath a song that never stops.
     HIS OWN DEMO FLOW CALLS SILENCE AN INSTRUMENT, in his own file
     (laws/BOHEMIA_DEMO_FLOW_7_10_26.md): "silence is the calm", and "single
     sting, then silence over the purple. The quiet IS the reveal." The valley is
     a dead city with the power out; REALISM FIRST says it has no soundtrack
     running every minute of every day.
     A DUCK, NOT A STOP, AND THAT IS THE WHOLE SAFETY ARGUMENT. MUS.stop() clears
     the scheduler and cuts the master, and the engine's own comment at the
     combat hook says why that is dangerous: combat swaps the song IN PLACE on
     the running transport and never calls start(), so a fight beginning on a
     stopped transport would be SILENT. And the 120 BPM LAW is about a clock that
     does not stop. So the transport runs throughout and only the music master is
     ducked -- the beat survives, the bed (on the SFX bus, not this master) is
     untouched and is the only thing left, and anything that wants the music back
     gets it on the next beat.
     THE LEVEL IS CAPTURED, NOT TYPED. The engine's full master is 0.8 and that
     literal already exists in two places; a third copy would rot the first time
     anybody moved it. The rest reads the gain it is about to duck and restores
     exactly that, so if he turns the master down the rest returns to HIS level. */
  PHRASE:128,                   /* 8 bars x 16 steps, the engine's own unit */
  resting:false, restUntil:0, restGain:null,
  restLen(){ return phraseMs(); },        /* ONE formula, asked of the engine */
  /* SOMEBODY ELSE OWNS THE MUSIC. Never rest over them, never fight them. */
  restBlocked(){
    try{ if(window.FIGHTMUS&&FIGHTMUS.on)return true; }catch(e){}
    try{ if(window.MENUMUS&&MENUMUS.on)return true; }catch(e){}
    try{ if(window.INTERIORMUS&&INTERIORMUS.on)return true; }catch(e){}
    return false; },
  beginRest(){
    if(this.resting)return false;
    if(this.restBlocked())return false;
    var g=null; try{ g=MUS.MAST; }catch(e){}
    if(!g||!MUS.AC)return false;
    if(!(g.gain.value>0.01))return false;       /* already silent: nothing to rest */
    this.restGain=g.gain.value;                 /* HIS level, captured not typed */
    var t0=MUS.AC.currentTime, len=this.restLen()/1000;
    /* *** THE WAY BACK IS BOOKED ON THE AUDIO CLOCK, NOT LEFT TO A TIMER, AND
       MY OWN PROBE IS WHY. *** The first cut ducked here and relied on this
       object's own setInterval to ramp back. Measured: start a fight during a
       rest and the music NEVER RETURNS -- because FIGHTMUS.enter() CLEARS
       CITYMUS.watch, which is the only thing that could have undone the duck.
       A silent fight, from a system whose whole safety argument was "a duck can
       be taken back instantly".
       A REST WHOSE ONLY WAY OUT IS A TIMER ANOTHER SYSTEM MAY DELETE IS A TRAP.
       So both ramps are booked up front, at absolute times, on the AudioParam:
       the audio thread brings the music back at the end of the phrase even if
       every timer in this document dies. endRest() below can still pull it back
       EARLIER, which is what a fight needs; this is the floor, not the plan. */
    try{ g.gain.cancelScheduledValues(t0);
      g.gain.setValueAtTime(this.restGain,t0);
      g.gain.linearRampToValueAtTime(0,t0+1.2);
      g.gain.setValueAtTime(0,t0+len);
      g.gain.linearRampToValueAtTime(this.restGain,t0+len+0.25); }catch(e){ return false; }
    this.resting=true; this.restUntil=Date.now()+this.restLen();
    return true; },
  /* RESTORE IS IDEMPOTENT AND IS THE ONLY WAY OUT, so no path can leave the
     master ducked for whatever plays next. */
  endRest(){
    if(!this.resting)return;
    this.resting=false; this.restUntil=0;
    var lvl=this.restGain; this.restGain=null;
    try{ var g=MUS.MAST, t0=MUS.AC.currentTime;
      if(g&&lvl!=null){ g.gain.cancelScheduledValues(t0);
        g.gain.setValueAtTime(g.gain.value,t0);
        g.gain.linearRampToValueAtTime(lvl,t0+0.25); } }catch(e){} },
  startShuffle(){ this.on=true;"""

WATCH_ANCHOR = ("      if(MUS.step>=1024){ CITYMUS.pend=false; CITYMUS.pendAt=null;"
                " CITYMUS.play(); return; }")

WATCH_REPLACE = r"""      /* __THE_STREET_BREATHES__ -- THE REST, HANDLED BEFORE ANYTHING ELSE.
         Four ways it ends early, because a rest must never be in the way: a
         FIGHT or the OPENING or a ROOM taking the music (not ours any more), and
         the CLOCK CROSSING A PHASE, which is the one thing the music exists to
         announce -- if dawn breaks mid-rest the rest is over. */
      if(CITYMUS.resting){
        if(CITYMUS.restBlocked()){ CITYMUS.endRest(); return; }
        if(CITYMUS.pend || Date.now()>=CITYMUS.restUntil){
          CITYMUS.pend=false; CITYMUS.pendAt=null;
          CITYMUS.play();          /* the new song starts from its beginning */
          CITYMUS.endRest(); }
        return; }
      /* AND THE PASS ENDING NOW BUYS AIR INSTEAD OF A HARD CUT. If the rest
         cannot be taken (somebody else owns the master, or it is already
         silent) this falls through to exactly the old behaviour, so the streets
         can never end up with no music because a rest failed. */
      if(MUS.step>=1024){ CITYMUS.pend=false; CITYMUS.pendAt=null;
        if(CITYMUS.beginRest()) return;
        CITYMUS.play(); return; }"""

FIGHT_ANCHOR = """      this.cityWas=!!CITYMUS.on;"""

FIGHT_REPLACE = """      this.cityWas=!!CITYMUS.on;
      /* __THE_STREET_BREATHES__ -- AND IF THE STREET WAS RESTING, END THE REST
         NOW. This function clears CITYMUS.watch two lines down, so a rest left
         running here would have nothing left alive to undo it. The duck heals
         itself on the audio clock as a floor, but a fight cannot wait out a
         phrase to become audible: DANGER IS NOW, which is the same reason
         FIGHTMUS takes the music immediately and hands it back on a phrase. */
      try{ if(CITYMUS.resting) CITYMUS.endRest(); }catch(_e){}"""

OFF_ANCHOR = ("  stopShuffle(){ this.on=false; if(this.watch)clearInterval(this.watch);"
              " this.watch=null; MUS.stop();")

OFF_REPLACE = (
    "  stopShuffle(){ this.on=false; if(this.watch)clearInterval(this.watch);"
    " this.watch=null;\n"
    "    /* __THE_STREET_BREATHES__ -- GIVE THE MASTER BACK BEFORE LETTING GO.\n"
    "       Turning the shuffle off during a rest would otherwise hand the next\n"
    "       system a master ducked to zero, and it would have no idea why it was\n"
    "       silent. endRest() is idempotent, so this costs nothing when there is\n"
    "       no rest running. */\n"
    "    try{ this.endRest(); }catch(_e){}\n"
    "    MUS.stop();")


HELPER_MARK = '__ONE_PHRASE_IS_ONE_PHRASE__'
HELPER_ANCHOR = 'const CITYMUS={on:false,watch:null,'
HELPER = '/* __ONE_PHRASE_IS_ONE_PHRASE__ (9/11, SOUNDS lane) -- HOW LONG A PHRASE IS, ONCE.\n   I GOT THIS ARITHMETIC WRONG AND MY OWN PROBE CAUGHT IT. Two systems in this\n   lane wanted "one phrase" in milliseconds and both of them computed\n   (128/16)*(60/120)*1000, which is 8 bars times the length of a BEAT -- 4000 ms.\n   A phrase is 8 bars and a bar at 120 BPM in 4/4 is TWO seconds, so a phrase is\n   SIXTEEN THOUSAND. INTERIORMUS\'s door debounce was running at a quarter of the\n   size its own comment claimed, and the rest below would have been a three\n   second hiccup instead of a breath.\n   SO IT IS ONE FORMULA NOW, AND IT ASKS THE ENGINE INSTEAD OF DOING SUMS.\n   MUS.stepDur() is the transport\'s own sixteenth, so 128 steps of it IS the\n   phrase by construction, and if the tempo ever moves the phrase moves with it.\n   A LANE THAT WRITES THE SAME CONSTANT TWICE WILL GET IT WRONG TWICE. */\nfunction phraseMs(){\n  var d = 0.125;                              /* the engine\'s own sixteenth */\n  try{ if(MUS && MUS.stepDur) d = MUS.stepDur(); }catch(_e){}\n  return 128 * d * 1000;\n}\nwindow.__phraseMs = phraseMs;\n'


def ensure_phrase_helper(src):
    """ONE FORMULA FOR A PHRASE, installed by whichever tool runs first."""
    if HELPER_MARK in src:
        return src, False
    if src.count(HELPER_ANCHOR) != 1:
        return None, False
    return src.replace(HELPER_ANCHOR, HELPER + HELPER_ANCHOR, 1), True


def main():
    print('=== THE STREET BREATHES ===')
    src = open(ALPHA, encoding='utf8').read()
    if MARK in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    for what, anchor in (('the rest api', REST_API_ANCHOR),
                         ('the pass-end branch', WATCH_ANCHOR),
                         ('the fight stand-down', FIGHT_ANCHOR),
                         ('the off switch', OFF_ANCHOR)):
        if src.count(anchor) != 1:
            print('FAIL: anchor for %s is not unique (%d)'
                  % (what, src.count(anchor)))
            return 1

    # POSITIVE CONTROL ON THE PREMISE. A duck only works if the master is where
    # this thinks it is, and the bed only survives if it is on a DIFFERENT bus.
    if 'this.MAST=this.AC.createGain()' not in src:
        print('FAIL: the music master is not built where this expects it, so '
              'ducking it is not a safe way to rest')
        return 1
    if '__SFXBUS' not in src:
        print('FAIL: there is no separate SFX bus, so a rest would silence the '
              'ambience bed as well and the gap would be dead air')
        return 1

    src, _ = ensure_phrase_helper(src)
    if src is None:
        print('FAIL: cannot place the phrase helper')
        return 1
    src = src.replace(REST_API_ANCHOR, REST_API, 1)
    print('  BUILT  the rest: one phrase of air, a duck on the master, not a stop')
    src = src.replace(WATCH_ANCHOR, WATCH_REPLACE, 1)
    print('  WIRED  the end of a 64-bar pass now buys air instead of a hard cut')
    src = src.replace(FIGHT_ANCHOR, FIGHT_REPLACE, 1)
    print('  SAFE   a fight during a rest gets the music back on the next beat')
    src = src.replace(OFF_ANCHOR, OFF_REPLACE, 1)
    print('  SAFE   turning the shuffle off gives the master back first')

    open(ALPHA, 'w', encoding='utf8').write(src)
    print('  MEASURED FIRST: twelve minutes of listening, never once silent, '
          'every song swapped at exactly 128 seconds.')
    print('  The ambience bed this lane built on 9/5 has been masked by a song '
          'that never stops. Now you hear the block you are standing on.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
