#!/usr/bin/env python3
"""
BOHEMIA — COOK BATCH 24 (8/24/26, SOUND lane). Four songs, four newborn voices.

DIRECTION (standing default, no invocation needed): POST-APOCALYPTIC FINAL
FANTASY, HORROR, CREEPY -- ruined grandeur, dissonance as material, but MELODIC
AND EMOTIVE UNDERNEATH. Never drone-flat, never aggression without melody. Every
one of these four carries a hook you could hum; the dread is what it is played
ON, not a substitute for the tune.

MUSIC VARIETY LAW: a batch must introduce synthesis TOPOLOGIES THE CATALOG HAS
NEVER USED, not reskinned skeletons -- "different clothes, same body" is the
exact failure Paolo named on 7/8. So the four topologies below were chosen by
first reading what the 577-voice rack already does and ruling out the near
misses:

  * `brokenrosary` is a BEAD TRAIN -- five separate plucks at sd*0.16 spacing.
    That is a rhythmic echo, NOT grain-per-period synthesis, where hundreds of
    grains a second FUSE into one tone. atriumvox is the second thing.
  * `aeolianharp` and `windpsaltery` are RESONATOR BANKS: noise poured through
    bandpass filters. That is filtering. signalrot MULTIPLIES, which is a
    different operation with a different result -- the tone is eaten, not shaped.
  * `emberharp` is FM with ONE carrier and a decaying index. twintoll has TWO
    carriers on ONE modulator with OPPOSED index envelopes, which no voice has.
  * `glassrequiem` is additive struck ALL AT ONCE with random decays.
    fissionhymn staggers the ONSETS and drives the partials APART.

THE FOUR NEWBORNS:

1. atriumvox    FOF / GRAIN-PER-PERIOD FORMANT SYNTHESIS, computed into a buffer.
                The IRCAM CHANT technique and the first of its kind here: one
                damped-sinusoid grain per pitch period, each grain ringing at a
                FORMANT rather than at the note. The PITCH comes from the grain
                RATE and the VOWEL from the grain's own frequency, so the thing
                singing is not an oscillator at all -- it is a rate. A hotel
                voice still announcing floors to an empty atrium.

2. signalrot    RING MODULATION BY BAND-LIMITED NOISE. A sawtooth through a VCA
                whose gain is a DC floor PLUS bandpassed noise, so the noise
                MULTIPLIES the tone instead of being mixed under it. The melody
                survives and corrodes at the same time, which is what a hymn on
                a dying transmitter actually does. Every other noise voice in
                this rack filters; this one modulates.

3. twintoll     DUAL-CARRIER FM ON ONE MODULATOR AT AN IRRATIONAL RATIO, WITH
                OPPOSED INDEX ENVELOPES. Two bells a few cents apart, both bent
                by the same root-2 modulator; one starts clangorous and purifies
                while the other starts pure and sours. They cross in the middle
                and beat against each other the whole way. Two towers that do
                not agree what time it is.

4. fissionhymn  ADDITIVE WITH STAGGERED ONSETS AND DIVERGENT DETUNE. The
                partials arrive one at a time during the decay rather than at
                the strike, and each one drifts further out of tune as it holds.
                One note that will not stay one note.

SCREECH LAW: no createDelay, no createConvolver, no feedback path anywhere.
Everything here is excited-and-decaying: buffers are finite, oscillators are
scheduled with explicit stops, and the two modulators drive frequency and gain
only -- nothing returns to its own input.

GRAVEYARD IS FINAL: all four titles checked against the 63 dead titles in
gates/bohemia_graveyard.txt. Zero collisions. No remakes.

  python3 tools/bohemia_music_batch24.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

ANCHOR = 'function synthV(kind,AC,MAST,hz,sd,semi,t,g0){\n'

VOICES = r"""
  /* ===== BATCH 24 VOICES (8/24/26) — four topologies this rack has never had.
     Chosen by reading the 577 that already exist and ruling out the near misses;
     see tools/bohemia_music_batch24.py for why each is not the thing it
     resembles. SCREECH LAW: nothing here feeds back, no delay, no convolver. */
  if(kind==='atriumvox'){
    /* FOF / GRAIN-PER-PERIOD FORMANT SYNTHESIS (the IRCAM CHANT technique), and
       the first in this rack. ONE damped-sinusoid grain per pitch period, each
       grain ringing at a FORMANT, not at the note. The PITCH is the grain RATE;
       the VOWEL is the grain's own frequency. What sings is a rate, not an
       oscillator -- which is why it fuses into a voice instead of a tremolo.
       Computed into a finite buffer: cheaper than 400 oscillator nodes, exact,
       and it cannot ring on. */
    var f0=hz(semi), dur=Math.min(6,sd*4.2), SR=AC.sampleRate;
    var n=Math.max(1,(SR*dur)|0), buf=AC.createBuffer(1,n,SR), d=buf.getChannelData(0);
    var per=SR/Math.max(20,f0);            /* samples per grain = the pitch */
    var F1=690, F2=1180;                   /* a dark 'aw' -- open, mournful */
    var decay=0.0016*SR;                   /* grain damping, in samples */
    for(var i=0;i<n;i++){
      var ph=i%per;                        /* position inside this grain */
      var env=Math.exp(-ph/decay);
      /* the vowel opens slightly across the note: a mouth widening */
      var k=i/n, a=F1*(1+0.06*k), b=F2*(1-0.04*k);
      d[i]=env*(0.62*Math.sin(2*Math.PI*a*ph/SR)+0.38*Math.sin(2*Math.PI*b*ph/SR));
    }
    var s=AC.createBufferSource(); s.buffer=buf;
    var lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2600; lp.Q.value=0.6;
    var g=AC.createGain();
    g.gain.setValueAtTime(0.0001,t);
    g.gain.linearRampToValueAtTime(g0*0.5,t+0.09);          /* a breath, not a hit */
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    s.connect(lp); lp.connect(g); g.connect(MAST);
    s.start(t); s.stop(t+dur+0.02); return; }
  if(kind==='signalrot'){
    /* RING MODULATION BY BAND-LIMITED NOISE. The rack's other noise voices
       FILTER (aeolianharp, windpsaltery: noise poured through resonators). This
       one MULTIPLIES: the noise drives the VCA's gain on top of a DC floor, so
       the tone is eaten rather than accompanied. Melody survives, corroding --
       a hymn on a transmitter that is failing. */
    var o=AC.createOscillator(); o.type='sawtooth'; o.frequency.value=hz(semi);
    var tone=AC.createBiquadFilter(); tone.type='lowpass'; tone.frequency.value=2200; tone.Q.value=0.8;
    var vca=AC.createGain(); vca.gain.value=0.58;          /* the floor: the tone lives */
    var ln=Math.max(1,(AC.sampleRate*Math.min(6,sd*4))|0);
    var nb=AC.createBuffer(1,ln,AC.sampleRate), nd=nb.getChannelData(0);
    for(var i2=0;i2<ln;i2++)nd[i2]=Math.random()*2-1;
    var ns=AC.createBufferSource(); ns.buffer=nb;
    var bp=AC.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1750; bp.Q.value=1.1;
    var ng=AC.createGain(); ng.gain.value=0.42;            /* how hard it corrodes */
    ns.connect(bp); bp.connect(ng); ng.connect(vca.gain);  /* MULTIPLY, not mix */
    var g2=AC.createGain();
    g2.gain.setValueAtTime(0.0001,t);
    g2.gain.linearRampToValueAtTime(g0*0.42,t+0.02);
    g2.gain.exponentialRampToValueAtTime(0.0001,t+sd*3.6);
    o.connect(tone); tone.connect(vca); vca.connect(g2); g2.connect(MAST);
    o.start(t); o.stop(t+sd*3.7); ns.start(t); ns.stop(t+sd*3.7); return; }
  if(kind==='twintoll'){
    /* DUAL-CARRIER FM ON ONE MODULATOR AT AN IRRATIONAL RATIO, OPPOSED INDEX
       ENVELOPES. emberharp is FM with ONE carrier and a decaying index; this is
       TWO, both bent by the same root-2 modulator, with their index envelopes
       running OPPOSITE ways -- one purifies as the other sours, so the timbre
       crosses over inside the note. The carriers sit four cents apart and beat
       the whole way. Two towers that do not agree what time it is. */
    var f=hz(semi);
    var mod=AC.createOscillator(); mod.type='sine'; mod.frequency.value=f*1.41421356;
    var mg1=AC.createGain(), mg2=AC.createGain();
    var c1=AC.createOscillator(), c2=AC.createOscillator();
    c1.type='sine'; c1.frequency.value=f;
    c2.type='sine'; c2.frequency.value=f; c2.detune.value=4;   /* the beat */
    /* clangorous -> pure */
    mg1.gain.setValueAtTime(f*2.6,t); mg1.gain.exponentialRampToValueAtTime(f*0.05,t+sd*2.6);
    /* pure -> sour */
    mg2.gain.setValueAtTime(f*0.05,t); mg2.gain.exponentialRampToValueAtTime(f*1.9,t+sd*2.6);
    mod.connect(mg1); mg1.connect(c1.frequency);
    mod.connect(mg2); mg2.connect(c2.frequency);
    var ga=AC.createGain(), gb=AC.createGain(), g3=AC.createGain();
    ga.gain.value=0.55; gb.gain.value=0.45;
    g3.gain.setValueAtTime(0.0001,t);
    g3.gain.linearRampToValueAtTime(g0*0.44,t+0.012);
    g3.gain.exponentialRampToValueAtTime(0.0001,t+sd*3.2);
    c1.connect(ga); ga.connect(g3); c2.connect(gb); gb.connect(g3); g3.connect(MAST);
    mod.start(t); c1.start(t); c2.start(t);
    mod.stop(t+sd*3.3); c1.stop(t+sd*3.3); c2.stop(t+sd*3.3); return; }
  if(kind==='fissionhymn'){
    /* ADDITIVE WITH STAGGERED ONSETS AND DIVERGENT DETUNE. glassrequiem strikes
       all its partials at once and lets them decay at random rates; this one
       lets them ARRIVE one at a time DURING the decay, each drifting further out
       of tune the longer it holds. The note starts single and ends a crowd. */
    var f4=hz(semi), P=[1,2,3,4.5,6], DT=[0,-9,11,-17,23];
    /* NO MASTER DECAY HERE, and that is the whole trick. The first version put
       an exponential decay on `out` as well as on each partial, and because the
       partials ARRIVE LATE the two decays compounded -- by the time the fifth
       one spoke the bus had already faded. Measured peak 0.031 against
       emberharp's 0.165: a lead nobody would hear under a mix. The partial
       envelopes ARE the shape; the bus just carries them. */
    var out=AC.createGain(); out.gain.value=g0*0.95;
    out.connect(MAST);
    for(var q=0;q<P.length;q++){
      var os=AC.createOscillator(); os.type='sine'; os.frequency.value=f4*P[q];
      var t0=t+sd*0.42*q;                       /* it arrives late, and later */
      /* it leaves in tune and drifts: the crowd pulls apart */
      os.detune.setValueAtTime(0,t0);
      os.detune.linearRampToValueAtTime(DT[q],t0+sd*3.0);
      var pg=AC.createGain();
      pg.gain.setValueAtTime(0.0001,t0);
      pg.gain.linearRampToValueAtTime(0.60/(1+q*0.38),t0+sd*0.5);
      pg.gain.exponentialRampToValueAtTime(0.0001,t0+sd*3.4);
      os.connect(pg); pg.connect(out);
      os.start(t0); os.stop(t+sd*4.7);
    }
    return; }
"""

SONGS = (
    "{n:'THE VOICE THAT STILL ANNOUNCES FLOORS',acc:'#6a7f8e',root:44,"
    "scale:[0,1,3,7,8],wave:'sine',kick:[0,6,11],bass:[0,3,7,8],hat:[4,12],"
    "inst:{b:'abyssbass',l:'atriumvox'},am:'chapelbreath',kit:{k:'thud',h:'wood'},"
    "mel:'hymn',swing:0,feel:'half',klay:'melody',ff:true,nu:true},\n"

    "{n:'THE LAST BROADCAST CORRODES',acc:'#b07a3a',root:51,"
    "scale:[0,2,3,6,8,10],wave:'sawtooth',kick:[0,4,7,10,13],bass:[0,6,8,10],hat:[2,6,10,14],"
    "inst:{b:'necrobass',l:'signalrot'},am:'vacancyhum',kit:{k:'punchk',h:'tight'},"
    "mel:'call',swing:0,feel:'drive',klay:'drums',ff:true,nu:true},\n"

    "{n:'THE BELLS DISAGREE',acc:'#8e6a9a',root:39,"
    "scale:[0,3,6,7,10],wave:'triangle',kick:[0,9],bass:[0,6,7,10],hat:[6,14],"
    "inst:{b:'boneyardbass',l:'twintoll'},am:'styxhaze',kit:{k:'knock',h:'clickh'},"
    "mel:'call',swing:0.14,feel:'normal',klay:'stabs',ff:true,nu:true},\n"

    "{n:'THE NOTE THAT WOULD NOT STAY ONE',acc:'#7f9a86',root:57,"  # DOWN 8/26, GRAVEYARD FINAL -- the GUARD below refuses to re-add this
    "scale:[0,2,5,6,9,11],wave:'sine',kick:[0,5,8,12],bass:[0,5,9,11],hat:[3,7,11,15],"
    "inst:{b:'reservoirbass',l:'fissionhymn'},am:'edenmist',kit:{k:'boom',h:'shakerh'},"
    "mel:'hymn',swing:0,feel:'half',klay:'melody',ff:true,nu:true}"
)


# ---- THE EMBEDDED REPO ENTRY -------------------------------------------------
# The music repo is a <script type="text/plain" id="BOHEMIA_MUSIC_REPO"> block
# inside the alpha: the lawbook and the batch history travel WITH the build.
# Newest batch on top, which is the order every previous batch used.
REPO_ENTRY = open(os.path.join(ROOT, 'records',
                  'BOHEMIA_MUSIC_BATCH24_ENTRY.txt'), encoding='utf8').read()
REPO_ANCHOR = 'id="BOHEMIA_MUSIC_REPO">\n'

NEW_NAMES = ['THE VOICE THAT STILL ANNOUNCES FLOORS', 'THE LAST BROADCAST CORRODES',
             'THE BELLS DISAGREE', 'THE NOTE THAT WOULD NOT STAY ONE']


# ===== GRAVEYARD IS FINAL, APPLIED TO THE GENERATOR (8/26/26) ==============
# A batch tool holds the full text of every song it ever cooked. When Paolo
# kills one, tools/bohemia_music_bury_the_dead.py takes it out of MLOOPS -- and
# this file still has it, so RE-RUNNING THIS TOOL PUTS IT BACK. That is not a
# hypothetical: the graveyard gate flagged exactly these entries as live
# references the moment three songs were buried on 8/26, and a live reference is
# the pointer that survives the kill.
# GRAVEYARD IS FINAL binds the machine, not just the person. This refuses.
def _graveyard_names():
    """Every song name the registry has a tombstone for."""
    import os as _os
    reg = _os.path.join(ROOT, 'gates', 'bohemia_graveyard.txt')
    try:
        txt = open(reg, encoding='utf8').read()
    except Exception:
        return set()          # no registry: refuse nothing, but say so at the call site
    # THE REGISTRY'S ACTUAL SHAPE, checked against the file rather than assumed:
    #     n:'MENU - NOBODY IS COMING'    | 8/26/26 | DOWN. GRAVEYARD FINAL...
    # The first version of this looked for "is dead" and matched NOTHING, so the
    # guard reported zero corpses and would have refused nobody. A checker that
    # silently sees an empty world reads exactly like a checker that passed.
    return set(re.findall(r"^n:'([^']+)'\s*\|", txt, re.M))


def refuse_the_dead(songs):
    """Drop any song Paolo has already killed, loudly. Never silently.

    Accepts whatever shape the batch happens to use: a list of (name, entry)
    pairs, or a list of raw entry strings. The first cut assumed strings and
    threw a TypeError on the tuples this very file uses -- assuming a data shape
    instead of reading it is how three of this week's bugs started.
    """
    dead = _graveyard_names()
    if not dead:
        print('  WARNING: no graveyard registry could be read, so NOTHING was checked')
        return songs
    kept, refused = [], []
    for s in songs:
        text = s[1] if isinstance(s, (tuple, list)) and len(s) > 1 else s
        name = s[0] if isinstance(s, (tuple, list)) else None
        if name is None:
            m = re.search(r"\{n:'([^']+)'", text if isinstance(text, str) else '')
            name = m.group(1) if m else None
        if name and name in dead:
            refused.append(name)
        else:
            kept.append(s)
    for b in refused:
        print('  REFUSED (graveyard is final, he killed it): %s' % b)
    return kept

def main():
    s = open(ALPHA, encoding='utf8').read()
    changed = []

    # ---- the voices
    if "kind==='atriumvox'" not in s:
        if ANCHOR not in s:
            print('FAIL: synthV signature moved'); return 1
        s = s.replace(ANCHOR, ANCHOR + VOICES.lstrip('\n'), 1)
        changed.append('4 voices born: atriumvox, signalrot, twintoll, fissionhymn')

    # ---- the songs, appended to MLOOPS
    if "THE BELLS DISAGREE" not in s:
        i = s.index('const MLOOPS=')
        st = s.index('[', i); d = 0; end = -1
        for k in range(st, len(s)):
            if s[k] == '[':
                d += 1
            elif s[k] == ']':
                d -= 1
                if not d:
                    end = k
                    break
        if end < 0:
            print('FAIL: could not find the end of MLOOPS'); return 1
        # PRESERVE THE CLOSING `\n];` EXACTLY, and this is not cosmetic.
        # gates/song_lock_gate.js extracts MLOOPS as the span from
        # `const MLOOPS=[` to the FIRST `\n];`. The first version of this tool
        # inserted before the `]` and left `...nu:true}];` -- no newline -- so
        # that anchor vanished and the lock's span ran on to the NEXT `\n];` in
        # the file: MLOOPS measured 991,094 bytes instead of 31,446, a 31x
        # over-grab for four songs. Regenerating the manifest then would have
        # baked a hash of the wrong region and quietly wrecked the lock that
        # exists to protect his songs. Rebuild the tail instead of splicing it.
        tail = s[end - 1:end + 2]
        if tail != '\n];':
            print('FAIL: MLOOPS does not close with a newline + ]; -- the song '
                  'lock anchors on that exact shape, refusing to guess')
            return 1
        # GRAVEYARD IS FINAL, CHECKED AT THE MOMENT OF INJECTION. This batch
        # holds its songs as one text blob rather than a list, so it cannot
        # filter entry by entry -- it REFUSES THE WHOLE RUN instead, loudly,
        # rather than quietly putting a song Paolo killed back in the game.
        # Louder and cruder than batch21's filter on purpose: a tool that cannot
        # be precise about a corpse should stop, not guess.
        _dead = sorted(n for n in _graveyard_names() if ("{n:'%s'" % n) in SONGS)
        if _dead:
            print('REFUSING TO RUN: this batch still contains song(s) Paolo has '
                  'killed, and running it would put them back in MLOOPS:')
            for _n in _dead:
                print('   %s' % _n)
            print('GRAVEYARD IS FINAL. Delete the entry from SONGS above, then re-run.')
            return 1
        s = s[:end - 1] + ',\n' + SONGS + '\n];' + s[end + 2:]
        changed.append('4 songs appended to MLOOPS (closing newline preserved)')

    # ---- NEW badges. APPEND, never replace: the three menu songs in there are
    #      unjudged, and dropping them would bury three of his songs on his
    #      behalf and trip the gate's own cooked-but-hidden check.
    m = re.search(r'const NEW_VIBES=\[([^\]]*)\]', s)
    if not m:
        print('FAIL: NEW_VIBES not found'); return 1
    if NEW_NAMES[0] not in m.group(1):
        add = ','.join("'%s'" % n for n in NEW_NAMES)
        body = m.group(1).strip()
        s = s[:m.start()] + 'const NEW_VIBES=[' + (body + ',' if body else '') + add + ']' + s[m.end():]
        changed.append('4 NEW badges added (the 3 unjudged menu songs KEPT)')

    # ---- the batch record, into the embedded repo
    if 'COOK BATCH 24' not in s:
        if REPO_ANCHOR not in s:
            print('FAIL: the embedded music repo block moved'); return 1
        s = s.replace(REPO_ANCHOR, REPO_ANCHOR + REPO_ENTRY, 1)
        changed.append('batch 24 written into the embedded music repo')

    open(ALPHA, 'w', encoding='utf8').write(s)
    for c in changed:
        print('  ' + c)
    if not changed:
        print('  already applied')
    else:
        print('  NEXT: node gates/music_gate.js')
    return 0


if __name__ == '__main__':
    sys.exit(main())
