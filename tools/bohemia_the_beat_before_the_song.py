#!/usr/bin/env python3
"""
THE BEAT BEFORE THE SONG (9/5/26, SOUNDS lane) - [heartbeat first].

THE MANAGER'S OWN CALL, off the board: "the city makes no sound and the law is
120 BPM. Put a heartbeat on the walked street from the first second, before any
song loads, at 120, quiet, that the first fight's music lands on."

MEASURED FIRST, ON THE REAL SURFACE. A headless run that tapped the splash and
then watched the master bus, sampling every 100ms with a timestamp:

    110 ms    the tap itself (ui_tap)
    401 ms    that sound ends
    ...       NOTHING
    9,824 ms  the first thing you hear after it

*** TEN SECONDS OF SILENCE, AND THE CAUSE IS NOT A MISSING FEATURE. *** The
opening music has been wired since 8/19 and its own comment explains the order:
MENUMUS.open() is the LAST line of the splash handler, after runTab.click(),
because the tab handler calls MUS.stop() on the way out of the studio. And
runTab.click() is where the city iframe is BUILT -- the handler says so in as
many words. So the opening song cannot start until a 3.7 MB document has been
constructed, and on this machine that is nine and a half seconds of nothing.
The main thread is not idle during it, it is BLOCKED: the energy meter's own
100ms sampler recorded zero samples across that whole window.

THAT LAST FACT DECIDES THE DESIGN. A beat driven by setInterval cannot exist
here, because setInterval is exactly what stopped running. Nor is a lookahead
scheduler enough: a 4-second lookahead still dies in a 9-second stall. So the
pulse is ONE LOOPING AudioBufferSourceNode, half a second long, handed to the
audio thread and never touched again. The audio thread does not care that the
main thread is building a city. It is also perfect 120 BPM by construction --
no drift, no jitter, no scheduler -- which is what the law actually asks for.

WHAT IT SOUNDS LIKE, AND WHAT IT DELIBERATELY IS NOT. It is a heart: two
thumps, low, quiet, felt more than heard. The gap between them is 0.3125
seconds, which is not a number I chose -- it is `hits: [0, 0.3125]` from HIS
APPROVED `heartbeat` recipe, the double-thump timing he thumbed up 3 of 5 on
8/20. The SHAPE is reused; the EVENT is not touched. `heartbeat` is labelled
"YOUR HEART, TOO LOUD -- low health, the sound that is inside your head, not in
the room", and firing it here would tell the player they are dying. Reusing an
approved moment for a different meaning is not reuse, it is a lie in his own
vocabulary.

SO THIS IS MUSIC, NOT AN SFX CANDIDATE, and it says so out loud. It is the
transport: two sine thumps with a scheduled decay, on the effects bus, no
delay, no convolver, no feedback (7/8 screech law), one node total. It does not
enter the bank, it does not go on a judging sheet, and it is not a moment. The
music side of this lane has always shipped without a per-sound thumb -- MENUMUS
did -- and EVERYTHING IS A THUMB says he meets it playing and corrects it.

AND THE SONG LANDS ON IT, which is the half the brief cares about most. MUS.
start() sets `nextT = currentTime + 0.06` and `step = 0`, so the song begins
6/100ths of a second after whenever the code happened to run: the music started
wherever it liked, and there was nothing for it to land on anyway. Now, while
the pulse is running, step 0 is booked for the pulse's NEXT BEAT. The first note
of the first song lands on the beat you have been hearing since you tapped. The
pulse then rides its gain to zero ending at that exact moment, so it does not
stop and then the music start -- the music takes the beat off it.

WHERE IT STARTS: the FIRST line of the splash handler, before the city is
built, because the whole point is to be there during the build. The gesture is
already on the stack there (the document-level capture listener has created the
AudioContext by then), which is what a browser wants before it will make sound.

WHEN IT ENDS: at the first song, and it does not come back. The opening is one
moment, not a metronome living under the game. If the transport later stops,
the street has the ambience bed for that, which shipped this morning.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new approved
event. It reuses the timing of his approved heartbeat and the effects bus that
already exists, and it adds one AudioBuffer.

  python3 tools/bohemia_the_beat_before_the_song.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
MARK = '__THE_BEAT_BEFORE_THE_SONG__'

PULSE = r"""
  /* === THE BEAT BEFORE THE SONG (9/5, SOUNDS lane) =======================
     [heartbeat first]. MEASURED on the real surface before this existed: the
     tap makes a sound at 110ms, it is over by 401ms, and THE NEXT THING YOU
     HEAR IS AT 9,824ms. The opening music has been wired since 8/19; it is the
     LAST line of the splash handler, and the line before it builds the city
     iframe. So the song cannot start until a 3.7 MB document is constructed.
     THE MAIN THREAD IS NOT IDLE ACROSS THAT GAP, IT IS BLOCKED -- the meter's
     own 100ms sampler recorded ZERO samples in the whole window -- and that is
     what decides the design. A setInterval beat is impossible here, because
     setInterval is the thing that stopped running, and a lookahead scheduler
     with a four-second horizon still dies in a nine-second stall.
     SO IT IS ONE LOOPING BUFFER, half a second long, handed to the audio
     thread and never touched again. The audio thread does not care that the
     main thread is building a city. It is also EXACTLY 120 BPM by
     construction: no scheduler, no drift, no jitter.
     THE SHAPE IS HIS. The two thumps are 0.3125 seconds apart, which is
     `hits: [0, 0.3125]` from his approved `heartbeat` recipe (3 of 5, 8/20).
     THE EVENT IS NOT TOUCHED: `heartbeat` means "YOUR HEART, TOO LOUD -- low
     health", and firing it here would tell the player they are dying. Reusing
     an approved moment for a different meaning is a lie in his own vocabulary.
     THIS IS MUSIC, NOT A CANDIDATE. Two sines with a scheduled decay, on the
     effects bus, no delay, no convolver, no feedback (7/8 screech law), one
     node. It never enters the bank and never goes on a judging sheet. */
  var PULSE = {
    BPM: 120,
    SEC: 0.5,            /* one beat at 120, and the loop length */
    GAP: 0.3125,         /* lub to dub -- HIS number, off the approved recipe */
    /* MEASURED, not chosen. At 0.085 this peaked at 0.0678 against a
       footstep at 0.0346 -- LOUDER than the quietest thing in the game,
       which is the opposite of what he asked for. Scaled to land at
       about 40% of a step: quiet enough to be under everything, and the
       only thing playing while it plays. */
    LEVEL: 0.020,
    src: null, bus: null, buf: null, startedAt: 0, done: false,

    /* ONE BEAT, RENDERED ONCE. A low thump that falls in pitch as it decays,
       which is what a struck body actually does and what every modal recipe in
       this engine is built on. */
    render: function (AC) {
      var sr = AC.sampleRate, n = Math.round(sr * this.SEC);
      var buf = AC.createBuffer(1, n, sr), d = buf.getChannelData(0);
      function thump(at, amp, f0, f1, dur) {
        var s = Math.round(at * sr), len = Math.round(dur * sr), ph = 0;
        for (var i = 0; i < len && s + i < n; i++) {
          var u = i / len;
          ph += 2 * Math.PI * (f0 + (f1 - f0) * u) / sr;
          /* a 4ms attack so it is a thump and not a click, then a decay */
          var env = Math.pow(1 - u, 2.2) * (1 - Math.exp(-i / (sr * 0.004)));
          d[s + i] += Math.sin(ph) * env * amp;
        }
      }
      thump(0,        1.00, 58, 34, 0.16);   /* lub */
      thump(this.GAP, 0.62, 50, 30, 0.13);   /* dub, softer, as a real one is */
      return buf;
    },

    start: function () {
      try {
        if (this.src || this.done) return;                 /* once per session */
        if (typeof MUS === 'undefined' || !MUS.AC) return;
        if (MUS.playing) { this.done = true; return; }      /* already singing */
        var AC = MUS.AC;
        if (!this.buf) this.buf = this.render(AC);
        this.bus = AC.createGain();
        this.bus.gain.value = this.LEVEL;
        /* the effects bus, so his slider reaches it. NEVER MUS.MAST as a first
           choice: MUS.stop() ducks that to zero, and this has to survive the
           tab handler stopping the studio on the way into the game. */
        this.bus.connect(sfxBus() || MUS.OUT || MUS.MAST || AC.destination);
        var s = AC.createBufferSource();
        s.buffer = this.buf; s.loop = true;
        s.connect(this.bus);
        this.startedAt = AC.currentTime + 0.03;
        s.start(this.startedAt);
        this.src = s;
      } catch (_e) {}
    },

    /* THE AUDIO TIME OF THE NEXT BEAT. This is the whole handoff: the song
       books its step 0 here, so its first note lands on the beat the player has
       been hearing since the tap. */
    nextBeat: function () {
      try {
        if (!this.src || typeof MUS === 'undefined' || !MUS.AC) return null;
        var t = MUS.AC.currentTime, k = Math.ceil((t - this.startedAt) / this.SEC);
        if (k < 0) k = 0;
        var at = this.startedAt + k * this.SEC;
        /* a beat that is already on top of us is no use to a scheduler */
        if (at < t + 0.03) at += this.SEC;
        return at;
      } catch (_e) { return null; }
    },

    /* THE MUSIC TAKES THE BEAT OFF IT. Not stop-then-start: the gain rides to
       zero ENDING at the moment the song's first note is booked for, so the
       handover is one beat rather than a gap and an entry. */
    handOff: function (atT) {
      try {
        if (!this.src) { this.done = true; return; }
        var AC = MUS.AC, t = AC.currentTime;
        var end = (atT && atT > t) ? atT : t + 0.12;
        this.bus.gain.cancelScheduledValues(t);
        this.bus.gain.setValueAtTime(this.bus.gain.value, t);
        this.bus.gain.linearRampToValueAtTime(0, end);
        this.src.stop(end + 0.02);
        this.src = null; this.done = true;
      } catch (_e) { this.done = true; }
    }
  };
  window.__pulseStart    = function () { PULSE.start(); };
  window.__pulseNextBeat = function () { return PULSE.nextBeat(); };
  window.__pulseHandOff  = function (t) { PULSE.handOff(t); };
  window.__pulseState    = function () {
    return { on: !!PULSE.src, done: PULSE.done, bpm: PULSE.BPM,
             sec: PULSE.SEC, gap: PULSE.GAP, level: PULSE.LEVEL,
             startedAt: PULSE.startedAt }; };
  /* EXPOSED SO IT CAN BE MEASURED EXACTLY. The opening is a ONE-SHOT, and a
     measurement of a one-shot has to be able to arm it again -- otherwise the
     only run you can meter is the one happening during a nine-second city
     build, and a main-thread meter records NO SAMPLES AT ALL across that
     window. THE GAME NEVER CALLS THIS. Same reason __sfxInSpace exists. */
  window.__PULSE_RESET = function () {
    try { if (PULSE.src) { PULSE.src.stop(); PULSE.src = null; } } catch (_e) {}
    PULSE.done = false;
  };
  /* AND IT DOES NOT PLAY OVER HIM JUDGING. Same rule the ambience bed uses
     (8/16, THE GAME DOES NOT PLAY TO AN EMPTY ROOM): if the run tab is not the
     open tab, the opening is not happening and the pulse ends. Cheap and slow
     on purpose -- it decides, it does not keep time. */
  setInterval(function () {
    try {
      if (!PULSE.src) return;
      var tab = document.querySelector('.tab[data-p="run"]');
      var onRun = tab && tab.classList.contains('on');
      /* THE MUSIC IS NOT THIS CHECK'S BUSINESS, AND IT WAS AT FIRST. This read
         `|| MUS.playing` and killed the pulse the instant the transport was
         STARTED -- which happens half a second after the tap and nine seconds
         before a note comes out. Worse, it raced the scheduler: whichever timer
         woke first after the block won, and when this one won it took the pulse
         away before the scheduler could ask it where the next beat was, so the
         song re-anchored to `now + 0.06` and landed 29ms off its own beat.
         Measured exactly that. The handoff belongs to the one place that knows
         a note is really going into the graph. This only ever answers "is he
         still looking at the game" (8/16). */
      if (!onRun) PULSE.handOff(null);
    } catch (_e) {}
  }, 500);
"""

WIRES = [
    ('the pulse itself, next to the ambience bed it shares a bus with',
     "  function unlock(){\n    claimPlayback();",
     PULSE + "\n  function unlock(){\n    claimPlayback();"),

    ('it starts on the FIRST line of the splash tap, before the city is built',
     "document.getElementById('front').addEventListener('click',()=>{\n"
     "  document.getElementById('front').style.display='none';",
     "document.getElementById('front').addEventListener('click',()=>{\n"
     "  /* __THE_BEAT_BEFORE_THE_SONG__ -- FIRST LINE, ON PURPOSE. Everything\n"
     "     below this builds the city iframe, and that build blocks the main\n"
     "     thread for about nine seconds on a phone-sized run. The pulse is a\n"
     "     looping buffer on the AUDIO thread, so it is the one thing that can\n"
     "     be heard while that happens. The document-level capture listener has\n"
     "     already made the AudioContext by the time this line runs. */\n"
     "  try{ window.__pulseStart && window.__pulseStart(); }catch(_e){}\n"
     "  document.getElementById('front').style.display='none';"),

    ('and the song lands on the beat instead of wherever it happened to run',
     " this.nextT=this.AC.currentTime+0.06; this.step=0;",
     " /* __THE_BEAT_BEFORE_THE_SONG__ -- THE FIRST NOTE LANDS ON THE BEAT.\n"
     "    This read `currentTime+0.06` unconditionally, so a song began six\n"
     "    hundredths of a second after whenever the code happened to run -- and\n"
     "    before today there was nothing for it to land on anyway. While the\n"
     "    opening pulse is running, step 0 is booked for its NEXT BEAT.\n"
     "    THE HANDOFF IS NOT HERE, AND THAT IS THE WHOLE POINT. MEASURED: the\n"
     "    opening song calls this HALF A SECOND after the tap, not after the\n"
     "    nine-second city build -- so it was never late. IT WAS STARVED. The\n"
     "    scheduler below is a setInterval on the main thread, and the main\n"
     "    thread is busy parsing a 3.7 MB iframe, so the transport starts on\n"
     "    time and cannot produce a note for nine seconds. Handing the beat\n"
     "    over here would hand it to a song that makes no sound. It is handed\n"
     "    over in the scheduler instead, on the tick that actually books step\n"
     "    0. */\n"
     " var _pb=null; try{ _pb=window.__pulseNextBeat&&window.__pulseNextBeat(); }catch(_e){}\n"
     " this.nextT=(_pb&&_pb>this.AC.currentTime+0.02)?_pb:(this.AC.currentTime+0.06);\n"
     " this.step=0;"),

    ('and a transport that fell behind re-anchors onto the beat instead of '
     'firing seventy-two sixteenths at once',
     "  this.timer=setInterval(()=>{ while(MUS.nextT<MUS.AC.currentTime+0.12){",
     "  this.timer=setInterval(()=>{\n"
     "    /* __THE_BEAT_BEFORE_THE_SONG__ -- A CATCH-UP IS NOT A SONG STARTING.\n"
     "       This loop books every step it is behind on, and the times it books\n"
     "       them for are IN THE PAST, which Web Audio plays immediately. After\n"
     "       the nine-second iframe parse that meant SEVENTY-TWO SIXTEENTHS\n"
     "       fired at once: not a song coming in, a noise. So a transport that\n"
     "       finds itself more than a quarter second behind re-anchors instead\n"
     "       of catching up, and it re-anchors ONTO THE PULSE'S NEXT BEAT, which\n"
     "       is the beat the player has actually been hearing. */\n"
     "    var _n=MUS.AC.currentTime;\n"
     "    if(MUS.nextT < _n-0.25){\n"
     "      var _p=null; try{ _p=window.__pulseNextBeat&&window.__pulseNextBeat(); }catch(_e){}\n"
     "      MUS.nextT=(_p&&_p>_n+0.02)?_p:(_n+0.06); MUS.step=0; MUS.uiBar=0;\n"
     "    }\n"
     "    while(MUS.nextT<MUS.AC.currentTime+0.12){\n"
     "    /* AND THE MUSIC TAKES THE BEAT OFF THE PULSE HERE -- INSIDE the loop, on\n"
     "       the iteration that actually books step 0 into the audio graph.\n"
     "       IT WAS ABOVE THE LOOP FIRST AND THAT WAS STILL TOO EARLY: the timer\n"
     "       fires every 25ms whether or not there is anything to book, so it ran\n"
     "       once at half a second, handed the beat over, and THEN the thread blocked\n"
     "       for nine seconds with no note booked. Measured: 0.5 seconds of pulse\n"
     "       covering a ten-second silence. A TRANSPORT BEING STARTED IS NOT A SONG\n"
     "       BEING AUDIBLE, and the only honest test of the second one is a note\n"
     "       going into the graph. */\n"
     "    if(MUS.step===0){ try{ window.__pulseHandOff&&window.__pulseHandOff(MUS.nextT); }catch(_e){} }"),
]


def main():
    src = open(ALPHA, encoding='utf8').read()
    print('=== THE BEAT BEFORE THE SONG ===')

    if MARK in src:
        print('  already installed (idempotent, nothing to do)')
        return 0

    for what, anchor, rep in WIRES:
        if src.count(anchor) != 1:
            print('FAIL: anchor for %s is not unique (%d)' % (what, src.count(anchor)))
            return 1
        src = src.replace(anchor, rep, 1)
        print('  WIRED  %s' % what)

    open(ALPHA, 'w', encoding='utf8').write(src)
    print('  one looping buffer, 0.5s, 120 BPM by construction, on the audio thread')
    print('  wrote %d bytes' % len(src))
    return 0


if __name__ == '__main__':
    sys.exit(main())
