#!/usr/bin/env python3
"""
THE VOICE HE NAMED PLAYS (9/13/26, SOUNDS lane) -- [lead never sounds]
THE-VOICE-HE-NAMED-IS-SCHEDULED-ZERO-TIMES, and the shelf-wide number is 109.

*** EYES E18 (fb5e8d33) FOUND ONE SONG. MEASURED ACROSS THE LIVE LIBRARY, IT IS
109 OF 142: the lead voice the song row NAMES is scheduled ZERO TIMES in
twenty-four bars, and on 135 of 142 songs the tune is a bare triangle oscillator
through a 2200 Hz lowpass. ***

HIS RULING, and it is the reason this is not a re-cook:
  Paolo 8/2, on THE MARKER ON THE DOOR: "one of my new favorite songs that you've
  made great job." The row he liked says inst:{b:'abyssbass', l:'brokenrosary'}
  and the batch 22 verdict records it as "lead brokenrosary".
NOTES ARE RULINGS (7/19). The row IS his content. The engine ignoring the name in
it is a MECHANISM bug, and mechanism is mine.

HOW IT WAS MEASURED (the call site, not the voice name)
  The note log records the LINE NUMBER of the call site out of a stack trace, so a
  note cannot be attributed to the wrong branch by guessing from its gain: the
  bass and the lead can name the same voice. Eleven distinct call sites came back,
  and they line up with the code exactly -- kick, hat, bass twice, the section-A
  accent, two pads, the arp, the hymn cadence, the bell, and the bare oscillator.
  Counted that way:
      the section-A ACCENT       fires on 140 of 142 songs, at 0.000s
      THE TUNE (section B/D)     a bare oscillator on 135 of 142
      the named lead as the tune   6 of 142 (4 hymn + 2 bell)
      the named lead ANYWHERE      33 of 142, so 109 never sound
  And the first cut of that measurement was WRONG in a way worth keeping: it
  lumped every lead-block line together and reported the melody entering at
  0.000s on all 142 songs, contradicting EYES' 8.000s on the one song it measured.
  EYES was right. The note at 0.000s is the sparse ACCENT; the TUNE is at 8.000s.
  A BUCKET WIDE ENOUGH TO HOLD TWO THINGS ANSWERS A QUESTION ABOUT NEITHER.

WHY THE ENGINE LOST THE NAME
  The melody branch reaches the named lead only when mel==='hymn' or the lead is
  literally 'bell'. Every other song falls into an `else` that builds a bare
  triangle into a lowpass. 52 songs are mel:'longs', 51 'call', 19 'seed8', 16
  'drive16' -- four of the five mel styles could never reach the lead.

TWO CHANGES, ONE MARK EACH, because the last time this lane put two changes behind
one mark the tool declared itself done with half of it missing.

1. __THE_RACK_ANSWERS_EVERY_NAME__  synthV is 581 `kind===` branches and NO
   fallback, so an unknown name renders SILENCE. That is the trap that makes
   change 2 dangerous on its own: one typo'd voice name in a future song row would
   delete its melody and nothing would say so. The tail of synthV now builds the
   same bare triangle-into-a-lowpass voice the melody branch used to build inline
   -- literally today's sound -- so an unknown name degrades instead of vanishing.
   MEASURED FIRST: 0 of 142 live songs name a lead, a bass or an accent the rack
   does not have, so this fires ZERO times today. It is a floor, not a change.

2. __THE_VOICE_HE_NAMED_PLAYS__  the tune plays the voice the row names, resolved
   by THE MAPPING ALREADY IN THIS FUNCTION (line 16006: whistle->karp, arp->acid,
   pluck->bell). I did not invent a mapping; 'pluck', 'arp' and 'whistle' are
   abstract lead KINDS rather than rack voices, and the section-A accent has
   resolved them that way since the day it shipped. Resolved, all 142 live songs
   name a voice the rack has. 120 distinct lead voices across the shelf.
   The kill-layer 'melody' style is the same bug in two more call sites and gets
   the same resolver.

WHAT IS DELIBERATELY NOT TOUCHED
  * The hymn cadence and the bell branch already play the named lead. Left exactly
    as they are: 6 songs that work do not get rewritten to match a new line.
  * Note LENGTH stays the engine's `_fsd`, which is `sd` doubled when feel==='half'
    -- the faithful translation of the bare oscillator's own decay, so a half-time
    song keeps its long notes.
  * The gain stays 0.07, the number the branch already used. The levels are
    measured before and after, per song, on the four bars where the tune actually
    plays, and any runaway is REPORTED rather than silently re-balanced: THE GAPS
    IN THE HYMNAL already peaks 13.4x the median on this shelf, which is what a
    silent re-balance would have hidden.

REUSE CHECK: cooks nothing. No bank, no candidate, no pixel, no new song, no new
tag, no new event, no new number. 120 distinct voices that were already cooked,
already in the rack, and already named by him, get their callers back.

  python3 tools/bohemia_the_voice_he_named.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
M_FALLBACK = '__THE_RACK_ANSWERS_EVERY_NAME__'
M_LEAD = '__THE_VOICE_HE_NAMED_PLAYS__'

# ---- change 1: the rack answers every name --------------------------------
FB_ANCHOR = """  if(kind==='sousaphone'){ const o=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter(); o.type='sawtooth'; o.frequency.value=hz(semi-24); lp.type='lowpass'; lp.frequency.value=450;
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(g0*1,t+0.05); g.gain.exponentialRampToValueAtTime(0.0001,t+sd*1);
    o.connect(lp);lp.connect(g);g.connect(MAST);o.start(t);o.stop(t+sd*1.2); return; }
}"""

FB_REPLACE = """  if(kind==='sousaphone'){ const o=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter(); o.type='sawtooth'; o.frequency.value=hz(semi-24); lp.type='lowpass'; lp.frequency.value=450;
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(g0*1,t+0.05); g.gain.exponentialRampToValueAtTime(0.0001,t+sd*1);
    o.connect(lp);lp.connect(g);g.connect(MAST);o.start(t);o.stop(t+sd*1.2); return; }
  /* __THE_RACK_ANSWERS_EVERY_NAME__ (9/13, SOUNDS lane) -- A NAME THIS RACK DOES
     NOT HAVE USED TO BE SILENCE. 581 `kind===` branches above and nothing after
     them, so synthV('typo',...) scheduled nothing and said nothing. That is a
     trap rather than a bug today -- MEASURED: 0 of the 142 live songs name a
     lead, a bass or an accent the rack lacks, so this fires zero times -- but the
     melody now goes through this function by NAME, and one typo in a future song
     row would delete that song's tune with no tell anywhere.
     SO THE FLOOR IS THE SOUND THE MELODY BRANCH USED TO BUILD INLINE: a triangle
     into a 2200 Hz lowpass, the same gain, the same decay. Not a new voice, not a
     cook, not a choice -- exactly what 135 of 142 songs played before 9/13, kept
     as the thing an unrecognised name degrades to. SCREECH LAW: no delay, no
     convolver, nothing feeds back. */
  { const o=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter();
    lp.type='lowpass'; lp.frequency.value=2200;
    o.type='triangle'; o.frequency.value=hz(semi);
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(g0,t+0.01);
    g.gain.exponentialRampToValueAtTime(0.0001,t+sd*1.6);
    o.connect(lp);lp.connect(g);g.connect(MAST);o.start(t);o.stop(t+sd*2); return; }
}"""

# ---- change 2a: the resolver, one place -----------------------------------
LV_ANCHOR = " drumsHeld(){\n"
LV_REPLACE = """ /* __THE_VOICE_HE_NAMED_PLAYS__ (9/13, SOUNDS lane) -- ONE PLACE THAT TURNS THE
    LEAD NAMED IN A SONG ROW INTO A VOICE IN THE RACK.
    'pluck', 'arp' and 'whistle' are not rack voices, they are abstract lead
    KINDS, and the section-A accent has resolved them exactly this way since the
    day it shipped (see `_am` in playStep). THIS MAPPING IS NOT MINE, it is that
    line lifted into a function so the tune and the accent cannot drift apart.
    MEASURED: resolved this way, all 142 live songs name a voice the rack has --
    120 distinct lead voices across the shelf. */
 leadVoice(l){ l=l||'pluck';
   return l==='whistle'?'karp':(l==='arp'?'acid':(l==='pluck'?'bell':l)); },
 drumsHeld(){
"""

# ---- change 2b: the tune plays it -----------------------------------------
TUNE_ANCHOR = """        else if(_li==='bell')synthV('bell',AC,MAST,x=>this.noteHz(x),sd,semi,t,0.07);
        else{ const o=AC.createOscillator(),g=AC.createGain(),lp=AC.createBiquadFilter();
          lp.type='lowpass';lp.frequency.value=sc.sec==='D'?3200:2200;
          o.type='triangle';o.frequency.value=this.noteHz(semi);
          g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(0.07,t+0.01);g.gain.exponentialRampToValueAtTime(0.0001,t+_fsd*1.6);
          o.connect(lp);lp.connect(g);g.connect(MAST);o.start(t);o.stop(t+sd*2); } } } }"""

TUNE_REPLACE = """        else if(_li==='bell')synthV('bell',AC,MAST,x=>this.noteHz(x),sd,semi,t,0.07);
        /* __THE_VOICE_HE_NAMED_PLAYS__ (9/13, SOUNDS lane) -- THE TUNE IS THE
           VOICE THE ROW NAMES. This `else` used to build a bare triangle into a
           lowpass and throw the name away, so the branch reached the named lead
           only for mel==='hymn' or a lead literally called 'bell'. MEASURED on
           the live library off the engine's own schedule, with the call site read
           from a stack trace so a note cannot be blamed on the wrong branch:
           THE TUNE WAS A BARE OSCILLATOR ON 135 OF 142 SONGS, and 109 of 142
           named a lead voice scheduled ZERO TIMES in twenty-four bars.
           EYES E18 found the first one (BROKENROSARY, named in the row AND in his
           own 8/2 verdict, "one of my new favorite songs"). NOTES ARE RULINGS: the
           row is his content, and an engine that ignores the name in it is a
           mechanism bug.
           `_fsd` and not `sd`, because that is what the oscillator this replaces
           used for its own decay -- a feel:'half' song keeps its long notes.
           The gain stays 0.07, the number this branch already used. An unknown
           name lands on the floor added at the tail of synthV, which is this very
           oscillator, so nothing can go silent. */
        else synthV(this.leadVoice(_li),AC,MAST,x=>this.noteHz(x),_fsd,semi,t,0.07); } } }"""

# ---- change 2c: the kill-layer melody style, the same bug two more times ---
KL_ANCHOR = """    if(sk>=2&&(s%2===0)){ const ph2=(f.n.length*7+((s/2)|0)+1);
      if(((ph2*2654435761)>>>0)%10<7){ const dg2=((ph2*40503)>>>0)%f.scale.length;
        synthV((f.inst&&f.inst.l)||'bell',AC,MAST,x=>this.noteHz(x),sd,f.root-19+f.scale[dg2],t,0.06); } }
    if(sk>=4&&(s%4===0)){ synthV((f.inst&&f.inst.l)||'bell',AC,MAST,x=>this.noteHz(x),sd,f.root-7+f.scale[(s/4)%f.scale.length],t,0.05); } }"""

KL_REPLACE = """    /* __THE_VOICE_HE_NAMED_PLAYS__ -- the same bug in two more call sites: the
       kill-layer 'melody' style passes the RAW lead name, so an abstract kind
       ('pluck', 'arp') hit a rack that has no such voice and the layer was
       silent. Same resolver, so the layer blooms in the song's own voice. */
    if(sk>=2&&(s%2===0)){ const ph2=(f.n.length*7+((s/2)|0)+1);
      if(((ph2*2654435761)>>>0)%10<7){ const dg2=((ph2*40503)>>>0)%f.scale.length;
        synthV(this.leadVoice((f.inst&&f.inst.l)||'bell'),AC,MAST,x=>this.noteHz(x),sd,f.root-19+f.scale[dg2],t,0.06); } }
    if(sk>=4&&(s%4===0)){ synthV(this.leadVoice((f.inst&&f.inst.l)||'bell'),AC,MAST,x=>this.noteHz(x),sd,f.root-7+f.scale[(s/4)%f.scale.length],t,0.05); } }"""


def main():
    print('=== THE VOICE HE NAMED PLAYS ===')
    src = open(ALPHA, encoding='utf8').read()
    did = 0

    # POSITIVE CONTROL ON THE PREMISE, before either change: the three names the
    # resolver maps to must really be in the rack, or the fix swaps a silent
    # melody for a differently silent one.
    body = src[src.index('function synthV('):]
    kinds = set(re.findall(r"kind==='([a-z0-9_]+)'", body[:body.index('\n}\n')]))
    for need in ('bell', 'acid', 'karp'):
        if need not in kinds:
            print('FAIL: the rack has no voice called %r, so the resolver would '
                  'map a named lead onto silence' % need)
            return 1
    print('  PREMISE  the rack answers %d names, and the three the resolver maps '
          'to are all in it' % len(kinds))

    # ---- change 1 -------------------------------------------------------
    if M_FALLBACK in src:
        print('  already  %s' % M_FALLBACK)
    else:
        if src.count(FB_ANCHOR) != 1:
            print('FAIL: the tail of synthV is not where this expects it (%d)'
                  % src.count(FB_ANCHOR))
            return 1
        src = src.replace(FB_ANCHOR, FB_REPLACE, 1)
        did += 1
        print('  ADDED    an unrecognised voice name degrades to the melody\'s own '
              'old oscillator instead of to silence')

    # ---- change 2 -------------------------------------------------------
    if M_LEAD in src:
        print('  already  %s' % M_LEAD)
    else:
        for what, anchor in (('the resolver', LV_ANCHOR), ('the tune', TUNE_ANCHOR),
                             ('the kill layer', KL_ANCHOR)):
            if src.count(anchor) != 1:
                print('FAIL: the anchor for %s is not unique (%d)'
                      % (what, src.count(anchor)))
                return 1
        src = src.replace(LV_ANCHOR, LV_REPLACE, 1)
        src = src.replace(TUNE_ANCHOR, TUNE_REPLACE, 1)
        src = src.replace(KL_ANCHOR, KL_REPLACE, 1)
        did += 1
        print('  FIXED    the tune plays the lead the song row names, on 135 of '
              '142 songs that played a bare triangle instead')
        print('  FIXED    and the kill-layer melody style, two more call sites '
              'with the same bug')

    if did:
        open(ALPHA, 'w', encoding='utf8').write(src)
        print('  109 of 142 songs named a lead that was scheduled ZERO times. '
              'EYES E18 found the first one; the row is his content.')
    else:
        print('  nothing to do (idempotent, per change)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
