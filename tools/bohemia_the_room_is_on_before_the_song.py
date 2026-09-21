#!/usr/bin/env python3
"""
THE ROOM IS ON BEFORE THE SONG (9/21/26, SOUNDS lane) -- [first sound].

*** THE ROW IS UN-HELD BECAUSE IT IS LOADING, WHICH IS RULE 18 ITEM ONE. The
coordinator's default, off this lane's own measurement (c88d7cc2): the loading
screen ends in one BEGIN tap, the first sound plays ON that tap, and it covers
the measured gap to the first song. "A room hum under the bible, not a jingle."
Ship test: sound within one beat of the tap on a 4x phone profile. ***

WHAT WAS ALREADY THERE, AND WHY IT IS NOT ENOUGH ON ITS OWN. The PULSE (9/5) is a
looping half-second buffer handed to the audio thread, built for exactly this
window, and it is the right MECHANISM: the main thread blocks for seconds while
the city builds, and a buffer loop is the only thing that can be heard through
that. But measured against this lane's own school page (9/21,
records/BOHEMIA_WHAT_ANALOG_HORROR_SOUNDS_LIKE_9_21_26.md) it is a HEARTBEAT,
which is a body, not a room:

    it is two thumps at 58->34 Hz and 50->30 Hz, so it is ENTIRELY sub-bass
    it is rhythmic, so it is an event repeating, never a continuous bed
    measured on the whole shipped mix: 96% of this game's sound energy is already
      below 320 Hz and 0.02% is above 5 kHz, which is the hiss band, empty

So this does NOT touch the heartbeat. His approved recipe, his GAP number, his
level all stay exactly as they are. THIS ADDS THE ROOM THE HEARTBEAT IS IN, and
it is the one piece of work that satisfies three of the school page's ten rules
at once:

    RULE 1  there is always a room, and it is never digital zero
    RULE 3  hiss is broadband and it lives UP HIGH, opposite the hum
    RULE 7  silence is ON, not off: there is a carrier under everything

AND IT IS THE HALF A PHONE CAN ACTUALLY PLAY. A phone loudspeaker is a few
millimetres of cone in a sealed body and it rolls off hard below a few hundred
hertz. The heartbeat lives at 30 to 58 Hz, where a handset has no speaker. The
room's energy is in the 100 Hz to 5 kHz band, which is where a phone works, so on
the only surface that counts this is what he will actually hear on the tap.

FOUR THINGS IN IT, AND EVERY NUMBER IS A MACHINE'S OR HIS, NOT MINE.

1. THE HUM IS 60 Hz (school rule 2). Mains hum in North America is 60 Hz with
   harmonics at 120 and 180, and this valley is Las Vegas. It is dead steady,
   because a grid frequency is: the wobble in school rule 5 belongs to sounds that
   came off tape, and a mains hum did not.

2. THE HISS IS BROADBAND AND BAND-LIMITED TO ONE NAMED MACHINE (school rules 3
   and 4): 100 Hz to 5 kHz, which is an AM broadcast, because 10 kHz channel
   spacing leaves 5 kHz of audio. That is the same machine the FFX sound
   amendment resolved to ("a warm melody heard through a dead broadcast"), so the
   loading room and the music are the same transmitter, and rule 4 is satisfied by
   DECLARING a machine rather than by being vaguely narrow.
   *** AND THE TWO FILTERS ARE NOT A FILTER PASS (rule 20b, school rule 10). They
   are inside this one voice's own chain, which IS the machine the sound came off.
   Nothing is added to the master bus, and nothing should ever be. ***

3. THE LOOP SEAM IS SILENT BY ARITHMETIC. The buffer is 4.0 s, which is 8 beats at
   120 BPM and exactly 240 cycles of 60 Hz, so the hum crosses the loop point in
   phase. The hiss cannot be made periodic that way, so its own tail is blended
   into its head over 80 ms. A bed with a tick in it is worse than no bed.

4. THE LEVEL IS MEASURED OFF HIS OWN HEARTBEAT, NOT CHOSEN. The one number this
   tool picks is a RATIO: the room sits at 60% of the heartbeat's energy, so the
   heartbeat stays the thing you notice and the room is what it sits in. It is
   matched on RMS and not on peak, on purpose: the heartbeat is impulsive (high
   peak, low energy) and a bed is continuous, so matching peaks would have put the
   room far louder than the thing it is supposed to sit under. The pulse buffer is
   rendered and measured at run time, so if he ever changes the heartbeat's level
   the room follows it and cannot drift. THE 60% IS THE ONLY TASTE IN HERE AND IT
   GOES TO THE VOTE TAB.

WHAT IT DOES WHEN THE SONG ARRIVES, WHICH IS THE ONE JUDGEMENT BEYOND THE ROW.
The row asks for the gap covered. School rule 1 says the bed never reads digital
zero and rule 7 says a silence keeps its carrier. A room that dies the instant the
song starts would satisfy the row and break the law written in the same round. So
it DUCKS to a third of itself and keeps running. It ducks from the one place in
the build that knows a note is really going into the graph, the same line the
heartbeat hands over on, which the build's own comment explains is the only honest
test. Extending the bed across the whole street is [quiet floor], which is HELD,
and this does not do that.

REUSE CHECK: cooks nothing, banks nothing, adds no event, adds no candidate, adds
no pixel. It does not touch BOH_SFX, the 65 approved sounds, the 142 songs, the
transport, the 120 BPM law or the heartbeat. Two new nodes exist for one voice.

  python3 tools/bohemia_the_room_is_on_before_the_song.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_ROOM_IS_ON_BEFORE_THE_SONG__'

# ---- 1. THE ROOM ITSELF, next to the heartbeat it sits under -----------------
ANCHOR_OBJ = "  window.__pulseStart    = function () { PULSE.start(); };"

ROOM_JS = r'''  /* ===== __THE_ROOM_IS_ON_BEFORE_THE_SONG__ (9/21, SOUNDS lane) ==========
     [first sound], un-held under rule 18 because it is LOADING. The heartbeat
     above is the right MECHANISM and the wrong SOUND for this job: measured, it
     is two thumps at 58->34 and 50->30 Hz, so it is all sub-bass, and it is
     rhythmic, so it is an event repeating rather than a room. This lane's school
     page (9/21) says the genre's two instruments are hum and hiss and they sit at
     OPPOSITE ends of the band, and measured the shipped mix at 96% of its energy
     below 320 Hz with 0.02% above 5 kHz. The hiss end is empty.
     SO THIS IS THE ROOM THE HEARTBEAT IS IN. It does not touch the heartbeat:
     his recipe, his GAP, his level are all untouched above.
     AND IT IS THE HALF A PHONE CAN PLAY. A handset speaker rolls off hard below
     a few hundred hertz; 30 to 58 Hz is where it has nothing. This lives at
     100 Hz to 5 kHz, which is where a phone works. */
  var ROOM = {
    /* 4.0 s = 8 beats at 120 BPM = EXACTLY 240 cycles of 60 Hz, so the mains hum
       crosses the loop point in phase and the seam cannot tick. */
    SEC: 4.0,
    HUM: 60,              /* the grid's own pitch: North American mains, and this
                             valley is Las Vegas. Dead steady, because a grid
                             frequency is; the tape wobble belongs to sounds that
                             came off tape and a mains hum did not. */
    LO: 100, HI: 5000,    /* THE MACHINE THIS ROOM CAME OFF: an AM broadcast is
                             about 100 Hz to 5 kHz, because 10 kHz channel spacing
                             leaves 5 kHz of audio. Same transmitter the music's
                             own ruling resolved to. */
    SEAM: 0.08,           /* the hiss cannot be periodic, so its tail blends into
                             its head over 80 ms */
    REL: 0.60,            /* THE ONLY CHOSEN NUMBER IN HERE: the room carries 60%
                             of the heartbeat's ENERGY, so the heartbeat stays the
                             thing you notice. Matched on rms, never on peak: a
                             thump has a high peak and little energy, a bed is the
                             other way round, and matching peaks would have put
                             this far louder than the thing it sits under. Goes to
                             the VOTE tab. */
    DUCK: 0.33,           /* when the song arrives it ducks to a third and KEEPS
                             RUNNING. It never reaches zero: school rule 1 (never
                             digital zero) and rule 7 (a silence keeps its
                             carrier). */
    src: null, bus: null, buf: null, startedAt: 0, level: 0, ducked: false,

    /* ONE LOOP, RENDERED ONCE, HANDED TO THE AUDIO THREAD. The 9/5 finding is
       why this is a buffer and not a scheduler: the main thread blocks for
       seconds while the city builds, and the audio thread does not care. */
    render: function (AC) {
      var sr = AC.sampleRate, n = Math.round(sr * this.SEC);
      var buf = AC.createBuffer(1, n, sr), d = buf.getChannelData(0);
      var i, seam = Math.max(1, Math.round(this.SEAM * sr));

      /* THE HISS, first, into its own pass so the seam blend cannot touch the
         hum's phase. White noise; the band comes from the two filters at play
         time, which are this voice's machine and not a master pass. */
      var hiss = new Float32Array(n + seam);
      for (i = 0; i < hiss.length; i++) hiss[i] = Math.random() * 2 - 1;
      /* blend the tail into the head so the loop point is not a tick */
      for (i = 0; i < seam; i++) {
        var u = i / seam;
        hiss[i] = hiss[i] * u + hiss[n + i] * (1 - u);
      }

      /* THE HUM: 60 Hz and its harmonics, falling away as real mains hum does.
         Integer cycle counts over the loop, so every one of them is in phase at
         the seam by construction and not by luck. */
      var parts = [[1, 1.00], [2, 0.42], [3, 0.18]];
      for (i = 0; i < n; i++) {
        var t = i / sr, h = 0;
        for (var k = 0; k < parts.length; k++)
          h += Math.sin(2 * Math.PI * this.HUM * parts[k][0] * t) * parts[k][1];
        /* the hum carries the weight, the hiss sits on top of it */
        d[i] = h * 0.55 + hiss[i] * 0.30;
      }

      /* normalise to a peak of 1, so the bus gain below is the ONLY level and
         nothing has to be re-tuned if the recipe above ever changes */
      var pk = 0;
      for (i = 0; i < n; i++) { var a = Math.abs(d[i]); if (a > pk) pk = a; }
      if (pk > 0) for (i = 0; i < n; i++) d[i] /= pk;
      return buf;
    },

    /* RMS OF A BUFFER. Used on BOTH buffers, so the comparison is like for like. */
    rmsOf: function (buf) {
      try {
        var d = buf.getChannelData(0), s = 0;
        for (var i = 0; i < d.length; i++) s += d[i] * d[i];
        return Math.sqrt(s / d.length);
      } catch (_e) { return 0; }
    },

    /* THE LEVEL IS MEASURED OFF HIS HEARTBEAT AT RUN TIME, NEVER TYPED. If he
       changes the heartbeat's level, this follows and cannot drift out of date. */
    levelFor: function (AC) {
      try {
        if (!PULSE.buf) PULSE.buf = PULSE.render(AC);
        var pulseRms = this.rmsOf(PULSE.buf) * PULSE.LEVEL;
        var roomRms = this.rmsOf(this.buf);
        if (!(roomRms > 0)) return PULSE.LEVEL * 0.25;
        return (pulseRms * this.REL) / roomRms;
      } catch (_e) { return PULSE.LEVEL * 0.25; }
    },

    start: function () {
      try {
        if (this.src) return;                               /* once per session */
        if (typeof MUS === 'undefined' || !MUS.AC) return;
        var AC = MUS.AC;
        if (!this.buf) this.buf = this.render(AC);
        this.level = this.levelFor(AC);

        this.bus = AC.createGain();
        this.bus.gain.value = this.level;
        /* the effects bus, so his one slider reaches it, and NEVER MUS.MAST as a
           first choice: MUS.stop() ducks that to zero, and a room does not stop
           because the studio did. Same reasoning as the heartbeat above. */
        this.bus.connect(sfxBus() || MUS.OUT || MUS.MAST || AC.destination);

        /* THE MACHINE, IN THIS VOICE'S OWN CHAIN. Two nodes, once. */
        var hp = AC.createBiquadFilter();
        hp.type = 'highpass'; hp.frequency.value = this.LO; hp.Q.value = 0.7;
        var lp = AC.createBiquadFilter();
        lp.type = 'lowpass';  lp.frequency.value = this.HI; lp.Q.value = 0.7;
        hp.connect(lp); lp.connect(this.bus);

        var s = AC.createBufferSource();
        s.buffer = this.buf; s.loop = true;
        s.connect(hp);
        this.startedAt = AC.currentTime + 0.02;
        s.start(this.startedAt);
        this.src = s;
      } catch (_e) {}
    },

    /* THE SONG ARRIVES AND THE ROOM GETS QUIETER. IT DOES NOT STOP. School rule
       1 is that a bed never reads digital zero and rule 7 is that a silence keeps
       its carrier, so there is no branch in here that reaches zero. Called from
       the one place in the build that knows a note is really going into the
       graph, which is the same line the heartbeat hands over on. */
    duck: function (atT) {
      try {
        if (!this.src || this.ducked) return;
        var AC = MUS.AC, t = AC.currentTime;
        var end = (atT && atT > t) ? atT : t + 0.25;
        var to = this.level * this.DUCK;
        this.bus.gain.cancelScheduledValues(t);
        this.bus.gain.setValueAtTime(this.bus.gain.value, t);
        this.bus.gain.linearRampToValueAtTime(to, end);
        this.bus.gain.value = to;
        this.ducked = true;
      } catch (_e) {}
    }
  };
  window.__roomStart = function () { ROOM.start(); };
  window.__roomDuck  = function (t) { ROOM.duck(t); };
  /* REPORTING FOR ITSELF, the way the heartbeat does, because while the build
     holds the one thread an outside observer reads nothing at all. */
  window.__roomState = function () {
    return { on: !!ROOM.src, ducked: ROOM.ducked, sec: ROOM.SEC, hum: ROOM.HUM,
             lo: ROOM.LO, hi: ROOM.HI, rel: ROOM.REL, duck: ROOM.DUCK,
             level: ROOM.level, startedAt: ROOM.startedAt,
             cycles60: ROOM.SEC * ROOM.HUM, beats: ROOM.SEC / 0.5 };
  };
  /* EVERYTHING A CHECKER NEEDS, IN ONE PLACE, FOR MEASUREMENT ONLY. THE GAME
     NEVER CALLS THIS. It hands back the room's buffer and level AND the
     heartbeat's, because the only honest way to claim "the room sits under the
     heartbeat" is to measure both through the same ruler in the same breath. */
  window.__ROOM_PROBE = function (AC) {
    try {
      AC = AC || MUS.AC;
      if (!PULSE.buf) PULSE.buf = PULSE.render(AC);
      return { roomBuf: ROOM.render(AC), roomLevel: ROOM.levelFor(AC),
               pulseBuf: PULSE.buf, pulseLevel: PULSE.LEVEL,
               lo: ROOM.LO, hi: ROOM.HI, hum: ROOM.HUM, sec: ROOM.SEC,
               rel: ROOM.REL, duck: ROOM.DUCK, seam: ROOM.SEAM };
    } catch (_e) { return null; }
  };
  /* AND A WAY TO ARM IT AGAIN, for measurement only. THE GAME NEVER CALLS THIS.
     Same reason __PULSE_RESET exists: the only run you could otherwise meter is
     the one happening during the city build. */
  window.__ROOM_RESET = function () {
    try { if (ROOM.src) { ROOM.src.stop(); ROOM.src = null; } } catch (_e) {}
    ROOM.ducked = false;
  };
'''

# ---- 2. IT STARTS ON THE SAME TAP -------------------------------------------
ANCHOR_TAP = "  try{ window.__pulseStart && window.__pulseStart(); }catch(_e){}"
TAP_ADD = (
    "\n  /* __THE_ROOM_IS_ON_BEFORE_THE_SONG__ -- ON THE SAME TAP, ONE LINE LATER.\n"
    "     A browser will not start audio without a gesture, so this tap is the\n"
    "     earliest instant in the whole game that any sound is legal: measured\n"
    "     (c88d7cc2) there are ZERO audio objects in existence before it, not even\n"
    "     a suspended one. The heartbeat above is a body; this is the room it is\n"
    "     standing in, and it is the part of the pair a phone speaker can play. */\n"
    "  try{ window.__roomStart && window.__roomStart(); }catch(_e){}"
)

# ---- 3. IT DUCKS WHERE THE HEARTBEAT HANDS OVER ------------------------------
ANCHOR_DUCK = ("    if(MUS.step===0){ try{ window.__pulseHandOff&&window.__pulseHandOff(MUS.nextT); "
               "}catch(_e){} }")
DUCK_ADD = (
    "\n    /* __THE_ROOM_IS_ON_BEFORE_THE_SONG__ -- AND THE ROOM GETS QUIETER HERE,\n"
    "       ON THE SAME LINE AND FOR THE SAME REASON THE COMMENT ABOVE GIVES: this\n"
    "       is the one place that knows a note is really going into the graph.\n"
    "       IT DUCKS, IT DOES NOT HAND OFF. The heartbeat's job ends when the song\n"
    "       starts; a room's does not. School rule 1 is that a bed never reads\n"
    "       digital zero and rule 7 is that a silence keeps its carrier, so there is\n"
    "       no path in duck() that reaches zero. */\n"
    "    if(MUS.step===0){ try{ window.__roomDuck&&window.__roomDuck(MUS.nextT); }catch(_e){} }"
)


def main():
    print('=== THE ROOM IS ON BEFORE THE SONG ===')
    src = open(ALPHA, encoding='utf8').read()
    if MARK in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    # POSITIVE CONTROLS ON EVERY PREMISE THIS PATCH STANDS ON.
    for word, why in (
            ('var PULSE = {', 'the heartbeat this measures its level against'),
            ('LEVEL: 0.020', "his approved heartbeat level, which the room's level is derived from"),
            ('GAP: 0.3125', 'his own heartbeat number, which this must not touch'),
            ('function sfxBus()', 'the one effects bus his volume slider reaches'),
            ('__pulseHandOff&&window.__pulseHandOff(MUS.nextT)',
             'the one line that knows a note is really going into the graph')):
        if word not in src:
            print('FAIL: %s is gone; re-measure before trusting this' % why)
            return 1
    print('  PREMISE  the heartbeat, its approved level and number, the effects bus '
          'and the note-is-real line are all where this expects them')

    for anchor, name in ((ANCHOR_OBJ, 'the room object'),
                         (ANCHOR_TAP, 'the start on the tap'),
                         (ANCHOR_DUCK, 'the duck when the song lands')):
        if src.count(anchor) != 1:
            print('FAIL: anchor for %s is not unique (%d)' % (name, src.count(anchor)))
            return 1

    src = src.replace(ANCHOR_OBJ, ROOM_JS + ANCHOR_OBJ, 1)
    src = src.replace(ANCHOR_TAP, ANCHOR_TAP + TAP_ADD, 1)
    src = src.replace(ANCHOR_DUCK, ANCHOR_DUCK + DUCK_ADD, 1)
    open(ALPHA, 'w', encoding='utf8').write(src)

    print('  CHANGED  a room hum starts on the door tap and ducks, never stops, '
          'when the first song lands')
    print('  60 Hz mains plus hiss, band-limited 100 Hz to 5 kHz, one 4 s loop on '
          'the audio thread')
    print('  The heartbeat, the 65 sounds, the 142 songs and the transport are untouched.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
