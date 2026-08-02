#!/usr/bin/env python3
"""
BOHEMIA MUSIC BATCH 21 — FOUR SONGS, FOUR NEWBORN VOICES (8/2/26)

Paolo's cook spell, verbatim: "Cook fresh Bohemia music: all locked laws per the
alpha's embedded lawbook. Horror Final fantasy 10 creepy, melodic under dread.
Birth new voices, new synthesis topologies, no shared scale/feel/kick, screech
law, graveyard final, no remakes. Update embedded repo, gate green, ship alpha
same turn."

THE DIRECTION (standing, from the lawbook): post-apocalyptic Final Fantasy
horror. Ruined grandeur, dead chapel choirs, bells in empty casinos, dissonance
as material -- but MELODIC AND EMOTIVE under the dread. Never drone-flat, never
aggression without melody. A melody that reads as pure texture is what killed
songs in the 7/18 graveyard, so every one of these four leads with a line.

THE HARD PART, AND WHY THESE FOUR: the rack already holds 607 voices. "New
voice" is worthless if it is voice 608 built from the same oscillator-filter-
envelope skeleton, and the MUSIC VARIETY LAW is explicit that the teeth are
TOPOLOGY, not names. So each of these four is a different WAY of making sound,
and none of them is the shape the rack already leans on:

  ossuary        NO OSCILLATOR AT ALL. One noise burst through four parallel
                 bandpass filters tuned to the free-free bar ratios
                 (1 : 2.76 : 5.40 : 8.93 -- the inharmonic series a struck bone
                 or a dead pipe actually gives). The PITCH lives in the filter
                 centres, not in any source. Every other pitched voice in the
                 rack starts from an oscillator; this one starts from air.

  lastrites      BUILT DOWNWARD. An UNDERTONE stack -- f, f/2, f/3, f/5 --
                 instead of a harmonic series. Division, not multiplication.
                 Each division breathes on its own slow drift so they beat
                 against each other. A choir assembled from what is underneath
                 the note. (Distinct from subharmglide, which is a GLIDE: this
                 holds and interferes.)

  tithebell      THE TIMBRE CHANGES WHILE IT RINGS, with no filter sweep and no
                 modulation. Odd partials decay six times faster than even
                 ones, so it starts clangorous and ARRIVES as a pure tone.
                 Differential decay as the only moving part. Risset's bell
                 taught this to the SFX engine; nothing in the music rack does
                 it.

  dyingfilament  A TREMOLO THAT SLOWS DOWN AND FREEZES. Two waveforms crossfade
                 under an LFO whose RATE is enveloped toward zero across the
                 note, so the flutter stalls as the note dies. Everything else
                 here envelopes amplitude; this envelopes MODULATION RATE. The
                 last light on the strip going out.

SCREECH LAW (absolute, it physically hurt his ears on 7/8): no createDelay, no
createConvolver, no feedback path anywhere. Every voice above is excited-and-
decaying -- finite nodes, scheduled stop, nothing that can ring on its own. The
brickwall limiter stays in the master chain untouched.

VARIETY LAW: no two of these four share scale + feel + kick.
  HOUSE      [0,1,5,6,10]     half    [0,10]
  NOBODY     [0,2,3,6,7,9]    normal  [0,6,8,14]
  TITHE      [0,3,5,8,11]     half    [0,4,8,12]
  LAST LIGHT [0,1,3,7,8,11]   drive   [0,7,11]
Four different roots (45 / 50 / 38 / 53), four different kick placements, four
different melody engines (longs / call / hymn / drive16).

GRAVEYARD IS FINAL: nothing here is a remake. Checked against every dead song
token in gates/bohemia_graveyard.txt -- SUNKEN VESPERS, UNDERTOW, HYMN IN THE
FLOOD, THROAT OF THE DROWNED NAVE, WIND THROUGH THE COUNTING HOUSE, WHAT SPEAKS
THROUGH THE GRILLE, A PROCESSION THAT FOLLOWS ITSELF, IT HAPPENS BACKWARDS HERE,
THE WINDOW BENDS THE HYMN, EVERY FLOOR BELOW THIS ONE, THE EMBER NEVER COOLS.
None of these four names, and no dead song's shape, comes back.

SONG-DEAD-NOT-VOICES (7/20): dead songs' voices are LEGAL. The basses and pads
here are canon rack voices on purpose -- the rack is a living orchestra and
reuse was never the sin. Sameness of SKELETON was.

REUSE CHECK (REUSE-FIRST LAW): zero graphic pixels are cooked, so no banks/ art
bank applies and none was opened. The audio reuse is deliberate and documented
above: canon bass/pad/kit voices carry these songs and only the LEAD of each is
newborn, which is exactly what the NEW VOICES LAW asks for. It writes no new
engine, no second AudioContext and no new master chain -- MUS's existing
context, master and brickwall limiter carry all four.

TASTE CHECK (laws/BOHEMIA_PAOLO_TASTE_CANON.md sec 4 MUSIC):
  - NEVER feedback/delay/convolver: HELD, and gates/music_gate.js sweeps the
    whole build for it.
  - NEVER reuse synthesis skeletons batch to batch: HELD by the four topologies
    above, each a different mechanism rather than a different setting.
  - NEVER two songs sharing scale+feel+kick: HELD, table above, gate-checked.
  - NEVER melody as pure texture: HELD -- each song carries a melody engine
    (longs/call/hymn/drive16) and a named lead, not a bed.
  - LIKE melodic and emotive under the dread: that is the brief these were
    written to, not a filter applied afterwards.

Idempotent (marker BATCH 21). Re-running replaces the batch rather than
stacking a second copy.

  python3 tools/bohemia_music_batch21.py
"""
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
V_BEGIN = '  /* === BATCH 21 VOICES (8/2/26) ==='
V_END = '  /* === /BATCH 21 VOICES === */'
S_BEGIN = " /* === BATCH 21 SONGS (8/2/26) === */"
S_END = " /* === /BATCH 21 SONGS === */"

# ---------------------------------------------------------------------------
# THE FOUR NEWBORN VOICES. Four mechanisms, not four presets.
# ---------------------------------------------------------------------------
VOICES = V_BEGIN + r"""
     Four topologies the rack has never used. Excited-and-decaying, every one:
     finite nodes, scheduled stop, no delay, no convolver, no feedback. */

  /* OSSUARY -- NO OSCILLATOR. A noise burst through four parallel bandpasses
     tuned to the free-free bar ratios (1 : 2.76 : 5.40 : 8.93), which is the
     inharmonic set a struck bone or a dead pipe actually gives. The pitch is
     in the FILTERS; the source is air. Bone flute in an empty ossuary. */
  if(kind==='ossuary'){
    const f0=hz(semi), R=[1,2.76,5.40,8.93], A=[1,0.42,0.22,0.11], D=[1,0.62,0.38,0.2];
    const n=AC.createBufferSource(), len=Math.max(1,Math.floor(AC.sampleRate*0.5));
    const buf=AC.createBuffer(1,len,AC.sampleRate), ch=buf.getChannelData(0);
    for(let i=0;i<len;i++) ch[i]=(Math.random()*2-1)*(1-i/len);   /* decaying excitation */
    n.buffer=buf;
    for(let i=0;i<R.length;i++){
      const bp=AC.createBiquadFilter(), g=AC.createGain();
      bp.type='bandpass'; bp.frequency.value=Math.min(f0*R[i],AC.sampleRate*0.45);
      bp.Q.value=16+i*7;
      const dur=sd*2.4*D[i];
      g.gain.setValueAtTime(0.0001,t);
      /* MAKEUP. Four bandpasses at Q 16-37 throw away almost all the
         energy: measured, this voice rendered at 0.0101 peak against
         0.29-0.34 for its batch-mates, which is inaudible in a mix. The
         filters are the instrument, so the answer is gain after them,
         not a wider Q that would stop it being a bone pipe. */
      g.gain.linearRampToValueAtTime(g0*0.42*A[i]*24,t+0.012);
      g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
      n.connect(bp); bp.connect(g); g.connect(MAST);
    }
    n.start(t); n.stop(t+sd*2.6); return;
  }

  /* LASTRITES -- BUILT DOWNWARD. An UNDERTONE stack: f, f/2, f/3, f/5. A
     harmonic series inverted, so the chord is what lies UNDER the note instead
     of above it. Each division drifts on its own slow rate so they beat against
     each other rather than sitting still. */
  if(kind==='lastrites'){
    const f0=hz(semi), DIV=[1,2,3,5], A=[0.5,0.62,0.4,0.26], DR=[0.11,0.17,0.23,0.29];
    for(let i=0;i<DIV.length;i++){
      const o=AC.createOscillator(), g=AC.createGain(), d=AC.createOscillator(), dg=AC.createGain();
      o.type = i===0 ? 'triangle' : 'sine';
      o.frequency.value=Math.max(18,f0/DIV[i]);
      /* the drift is an LFO on GAIN, never on a feedback path */
      d.type='sine'; d.frequency.value=DR[i]; dg.gain.value=g0*0.09*A[i];
      d.connect(dg); dg.connect(g.gain);
      g.gain.setValueAtTime(0.0001,t);
      g.gain.linearRampToValueAtTime(g0*0.30*A[i],t+0.22);
      g.gain.setValueAtTime(g0*0.30*A[i],t+sd*2.2);
      g.gain.exponentialRampToValueAtTime(0.0001,t+sd*3.4);
      o.connect(g); g.connect(MAST);
      o.start(t); d.start(t); o.stop(t+sd*3.6); d.stop(t+sd*3.6);
    }
    return;
  }

  /* TITHEBELL -- THE TIMBRE MOVES WITH NO MODULATOR. Odd partials decay six
     times faster than even ones, so it strikes clangorous and ARRIVES pure.
     Differential decay is the only moving part: no filter sweep, no LFO. */
  if(kind==='tithebell'){
    const f0=hz(semi), P=[1,2.01,2.98,4.07,5.43,6.79];
    for(let i=0;i<P.length;i++){
      const odd=(i%2)===1;
      const o=AC.createOscillator(), g=AC.createGain();
      o.type='sine'; o.frequency.value=f0*P[i];
      o.detune.value=(i%3===0)?0:(odd?7:-5);        /* a little rub, never unison */
      const amp=g0*0.34/(1+i*0.85);
      const dur=sd*(odd? 0.55 : 3.3);               /* the six-to-one split */
      g.gain.setValueAtTime(0.0001,t);
      g.gain.linearRampToValueAtTime(amp,t+0.006);
      g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
      o.connect(g); g.connect(MAST); o.start(t); o.stop(t+dur+0.05);
    }
    return;
  }

  /* DYINGFILAMENT -- A TREMOLO THAT SLOWS TO A STOP. Two waveforms crossfade
     under an LFO whose RATE is ramped toward zero across the note, so the
     flutter stalls and freezes as the note dies. Everything else in the rack
     envelopes amplitude; this envelopes MODULATION RATE. */
  if(kind==='dyingfilament'){
    const f0=hz(semi), dur=sd*3.2;
    const lfo=AC.createOscillator();
    lfo.type='sine';
    lfo.frequency.setValueAtTime(7.5,t);
    lfo.frequency.exponentialRampToValueAtTime(0.12,t+dur);   /* the stall */
    const dep=AC.createGain(); dep.gain.value=0.5;
    lfo.connect(dep);
    const pair=[['sawtooth',1],['sine',-1]];
    for(const [wv,sgn] of pair){
      const o=AC.createOscillator(), g=AC.createGain(), mix=AC.createGain();
      o.type=wv; o.frequency.value=f0; o.detune.value=sgn*6;
      mix.gain.value=0.5;                       /* the crossfade centre */
      const inv=AC.createGain(); inv.gain.value=sgn;
      dep.connect(inv); inv.connect(mix.gain);  /* one rises as the other falls */
      g.gain.setValueAtTime(0.0001,t);
      g.gain.linearRampToValueAtTime(g0*0.3,t+0.05);
      g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
      o.connect(mix); mix.connect(g); g.connect(MAST);
      o.start(t); o.stop(t+dur+0.05);
    }
    lfo.start(t); lfo.stop(t+dur+0.05);
    return;
  }
""" + V_END + "\n"

# ---------------------------------------------------------------------------
# THE FOUR SONGS. No two share scale + feel + kick.
# ---------------------------------------------------------------------------
SONGS = S_BEGIN + r"""
 {n:'THE HOUSE ALWAYS REMEMBERS',acc:'#6f5f7d',root:45,scale:[0,1,5,6,10],wave:'triangle',kick:[0,10],bass:[0,10],hat:[6,14],inst:{b:'undertowbass',l:'ossuary'},am:'gravechoir',kit:{k:'thud',h:'wood'},mel:'longs',swing:0,feel:'half',klay:'melody',ff:true,bt:21},
 {n:'NOBODY CASHES OUT',acc:'#8a6a4a',root:50,scale:[0,2,3,6,7,9],wave:'sawtooth',kick:[0,6,8,14],bass:[0,3,8,11],hat:[2,6,10,14],inst:{b:'abyssbass',l:'lastrites'},am:'nightpad',kit:{k:'knock',h:'tight'},mel:'call',swing:0.2,feel:'normal',klay:'stabs',ff:true,bt:21},
 {n:'TITHE FOR THE EMPTY PEWS',acc:'#9a8ab0',root:38,scale:[0,3,5,8,11],wave:'sine',kick:[0,4,8,12],bass:[0,8],hat:[4,12],inst:{b:'choirbass',l:'tithebell'},am:'ashchoir',kit:{k:'boom',h:'ride'},mel:'hymn',swing:0,feel:'half',klay:'melody',ff:true,bt:21},
 {n:'THE LAST LIGHT ON THE STRIP',acc:'#c07a3a',root:53,scale:[0,1,3,7,8,11],wave:'square',kick:[0,7,11],bass:[0,4,7,11,14],hat:[2,6,10,14],inst:{b:'reservoirbass',l:'dyingfilament'},am:'dreadbed',kit:{k:'punchk',h:'clickh'},mel:'drive16',swing:0.15,feel:'drive',klay:'drive',ff:true,bt:21}""" + S_END

NEW_NAMES = ['THE HOUSE ALWAYS REMEMBERS', 'NOBODY CASHES OUT',
             'TITHE FOR THE EMPTY PEWS', 'THE LAST LIGHT ON THE STRIP']

REPO_ENTRY = """
=== BATCH 21 (8/2/26) — FOUR SONGS, FOUR NEWBORN TOPOLOGIES ===
Cooked from his spell verbatim. Horror FFX, melodic under dread.

  THE HOUSE ALWAYS REMEMBERS   root 45  [0,1,5,6,10]     half    kick [0,10]
      lead OSSUARY (new)  bass undertowbass  am gravechoir  thud/wood  longs
      The casino remembers every hand you ever lost. Bone flute in the dark.
  NOBODY CASHES OUT            root 50  [0,2,3,6,7,9]    normal  kick [0,6,8,14]
      lead LASTRITES (new)  bass abyssbass  am nightpad  knock/tight  call
      A chord built downward, out of what is under the note.
  TITHE FOR THE EMPTY PEWS     root 38  [0,3,5,8,11]     half    kick [0,4,8,12]
      lead TITHEBELL (new)  bass choirbass  am ashchoir  boom/ride  hymn
      A bell that starts clangorous and arrives pure while nobody listens.
  THE LAST LIGHT ON THE STRIP  root 53  [0,1,3,7,8,11]   drive   kick [0,7,11]
      lead DYINGFILAMENT (new)  bass reservoirbass  am dreadbed  punchk/clickh  drive16
      The flutter slows down and freezes. The light going out.

VOICE LEDGER — four births, four MECHANISMS (the rack held 607 already, so a
new NAME on an old skeleton would have been worth nothing):
  ossuary        no oscillator at all: a noise burst through four parallel
                 bandpasses at the free-free bar ratios 1 : 2.76 : 5.40 : 8.93.
                 The pitch lives in the filters. Owner: THE HOUSE ALWAYS
                 REMEMBERS.
  lastrites      an UNDERTONE stack f, f/2, f/3, f/5 -- the harmonic series
                 inverted, division instead of multiplication, each division on
                 its own slow drift so they beat. Owner: NOBODY CASHES OUT.
  tithebell      differential decay: odd partials die 6x faster than even, so
                 the TIMBRE moves with no filter and no modulator. Owner: TITHE
                 FOR THE EMPTY PEWS.
  dyingfilament  a tremolo whose RATE is enveloped to a stop, freezing as the
                 note dies. Modulation-rate envelope, not amplitude envelope.
                 Owner: THE LAST LIGHT ON THE STRIP.

LAWS HELD: screech law (no delay/convolver/feedback anywhere; all four are
excited-and-decaying with scheduled stops), variety law (four distinct
scale+feel+kick tuples, four roots, four melody engines), new voices law (every
song births its own lead), graveyard final (checked against all eleven dead
song tokens; no remakes, no revivals), melody-not-texture (every song leads
with a line, which is what the 7/18 graveyard killed songs for lacking).
Canon rack voices carry the bass/pad/kit on purpose: SONG-DEAD-NOT-VOICES and
the living-orchestra amendment both make reuse legal; sameness of SKELETON was
always the sin.
"""


def main():
    if not os.path.exists(ALPHA):
        print('FAIL: the ONE alpha is missing')
        return 1
    s = open(ALPHA, encoding='utf8').read()

    # ---- idempotent removal, newlines included -------------------------
    if V_BEGIN in s:
        i = s.index(V_BEGIN); j = s.index(V_END) + len(V_END)
        if s[j:j + 1] == '\n':
            j += 1
        s = s[:i] + s[j:]
        print('  batch 21 voices removed (idempotent re-inject)')
    if S_BEGIN in s:
        i = s.index(S_BEGIN); j = s.index(S_END) + len(S_END)
        s = s[:i] + s[j:]
        # TAKE BACK THE COMMA THE SONGS RODE IN ON. The first version compared
        # s[i-1] directly, but the inject writes ',\n' so the character before
        # the block is a NEWLINE, not the comma -- the comma survived, the next
        # re-run added a second one, and ',\n,\n' is a HOLE in the array
        # literal. It cost a crash reading MLOOPS[130].n, and a grep for ',,'
        # could never have found it because a newline sits between them.
        # Walk back over whitespace and take exactly one comma.
        # Eat EVERY stray comma back to the previous entry, not just one: a
        # build that already carries two (because an earlier run leaked one)
        # stays holed if the cleanup only takes one.
        k = i
        while k > 0 and s[k - 1] in ' \t\r\n,':
            k -= 1
        s = s[:k] + s[i:]
        print('  batch 21 songs removed (idempotent re-inject)')

    # ---- 1. the voices, at the top of synthV ---------------------------
    host = 'function synthV(kind,AC,MAST,hz,sd,semi,t,g0){\n'
    if host not in s:
        print('FAIL: synthV host not found')
        return 1
    s = s.replace(host, host + VOICES, 1)

    # ---- 2. the songs, at the end of MLOOPS ----------------------------
    i = s.index('const MLOOPS=[')
    j = s.index('\n];', i)
    s = s[:j] + ',\n' + SONGS + s[j:]

    # ---- 3. NEW_VIBES is THIS batch --------------------------------------
    m = re.search(r'const NEW_VIBES=\[[^\]]*\];', s)
    if not m:
        print('FAIL: NEW_VIBES not found')
        return 1
    s = s[:m.start()] + 'const NEW_VIBES=[' + \
        ','.join("'" + n + "'" for n in NEW_NAMES) + '];' + s[m.end():]

    # ---- 4. the embedded music repo, updated IN PLACE the same turn -----
    anchor = '<script type="text/plain" id="BOHEMIA_MUSIC_REPO">\n'
    if anchor not in s:
        print('FAIL: the embedded music repo block is missing')
        return 1
    if '=== BATCH 21 (8/2/26)' not in s:
        s = s.replace(anchor, anchor + REPO_ENTRY, 1)
    else:
        k = s.index('=== BATCH 21 (8/2/26)')
        e = s.index('\n', s.index('always the sin.', k))
        s = s[:k] + REPO_ENTRY.strip() + s[e:]

    open(ALPHA, 'w', encoding='utf8').write(s)
    print('BATCH 21 IS IN THE ALPHA.')
    for n in NEW_NAMES:
        print('  song  ' + n)
    for v in ('ossuary', 'lastrites', 'tithebell', 'dyingfilament'):
        print('  voice ' + v + ' (newborn topology)')
    print('  NEW_VIBES = this batch; embedded music repo updated in place')
    return 0


if __name__ == '__main__':
    sys.exit(main())
