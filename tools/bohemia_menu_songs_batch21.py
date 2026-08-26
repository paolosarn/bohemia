#!/usr/bin/env python3
"""
BOHEMIA — MENU BATCH 21 (8/19/26, SOUND lane). Three songs for the way in.

REUSE CHECK. Banks opened: the alpha's own 602-voice rack (synthV) and the
MLOOPS song list, both read in full before writing a note. What was reused: the
BASS and AMBIENCE of all three songs are voices Paolo already has -- dawnpad,
faythhum, coldpiano, glasshope, solarhymn, edenmist -- and the drum kit is the
one his canon MENU song already uses (thud/wood). What is new and WHY: exactly
three LEAD voices, one per song, because the NEW VOICES LAW in music_gate.js
requires a fresh song to birth a voice no other song uses as its own. Reusing a
lead here would fail the gate by design: a batch that borrows every lead is a
recolour, and STRUCTURE-NOT-COLOR says a recolour is filler.

WHY THREE SONGS EXIST AT ALL
MENUMUS shipped the same turn and it opens the game on a MENU song. The MENU
pool at that moment held exactly ONE live song -- MENU: DEAD VALLEY DAWN -- so
every single time Paolo opened the link he would hear the same sixteen seconds.
Four of the other five MENU songs are thumbed down and the fifth was buried this
same turn (graveyard final, 7/8). A pool of one is a pool that gets old in a
day, and the front door is the most-heard music in the product by a mile.

THIS IS NOT A QUEUE. Per EVERYTHING IS A THUMB (8/9) these are not being put to
him for approval: they PLAY, at the front door, from the next deploy, and he
corrects what he hates. They are badged NEW in the MUSIC tab only so he can find
them if he wants to -- and because music_gate refuses a song that is neither
badged nor ruled, which is the rule that stops a song being cooked-and-hidden.

THE THREE, and what each one is trying to be. Bohemia's front door is the moment
before you play a game about an economy that already collapsed, so none of them
resolve; they are all held open.
  1. THE POWER STILL ON SOMEWHERE  -- major pentatonic, no drum at all. The 12%
     that is lit, seen from far off. New lead: `gridglow`, a slow two-saw swell
     under a bandpass that opens over eight seconds and never quite arrives.
  2. WHAT THE VALLEY KEPT          -- harmonic minor, one kick on the one. What
     is still here rather than what is gone. New lead: `keptkeys`, a struck
     bell-piano with two inharmonic partials, so it reads as a real object being
     hit in a room rather than a synth pad.
  3. NOBODY IS COMING              -- aeolian, a kick on 1 and 9, the bleakest.
     New lead: `nobodyswell`, a very low sine breathing under a slow LFO with a
     single filtered breath of noise on top.

SCREECH LAW: no createDelay, no convolver, nothing self-feeding. Every voice
here is excited-and-decaying. The LFOs modulate a gain PARAM, which is a one-way
wire, not a loop.

WORDS ARE AN ATTEMPT (8/11): the three titles are real attempts, written as if
they ship. He edits them whenever he likes; a blank name would have been a blank
page, and he does not write from nothing.

Idempotent: keyed on the song names, safe to re-run.

  python3 tools/bohemia_menu_songs_batch21.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

# ---- THE NEW VOICES ------------------------------------------------------
# synthV(kind, AC, MAST, hz, sd, semi, t, g0). MAST is the destination the
# caller hands in, which is why these connect to MAST and never to
# AC.destination: the SFX engine borrows these same voices and routes them
# through its own gain and panner, and a voice that ignores its destination is
# a voice that cannot be borrowed.
VOICES = r"""
  /* ---- MENU BATCH 21 (8/19/26) -- three leads, one per song ------------
     NEW VOICES LAW: a fresh song births a voice no other song uses as its
     lead. These are those three. SCREECH LAW: excited-and-decaying only, no
     delay line, no convolver, and the LFOs write to a gain PARAM, which is a
     one-way wire and not a loop. */
  if(kind==='gridglow'){ /* B21-1: THE POWER STILL ON SOMEWHERE -- two saws a
      hair apart under a bandpass that opens over eight seconds and never quite
      arrives. The 12% that is lit, seen from a long way off. */
    const f0=hz(semi);
    const bp=AC.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=1.6;
    bp.frequency.setValueAtTime(240,t); bp.frequency.linearRampToValueAtTime(1600,t+sd*14);
    const g=AC.createGain();
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(g0*0.34,t+1.2);
    g.gain.setValueAtTime(g0*0.34,t+sd*10); g.gain.exponentialRampToValueAtTime(0.0001,t+sd*16);
    bp.connect(g); g.connect(MAST);
    for(const dt of [-6,7]){ const o=AC.createOscillator();
      o.type='sawtooth'; o.frequency.value=f0; o.detune.value=dt;
      o.connect(bp); o.start(t); o.stop(t+sd*16.5); }
    /* the mains hum underneath it, one octave down, barely there */
    const sub=AC.createOscillator(), sg=AC.createGain();
    sub.type='sine'; sub.frequency.value=f0*0.5;
    sg.gain.setValueAtTime(0.0001,t); sg.gain.linearRampToValueAtTime(g0*0.14,t+1.6);
    sg.gain.exponentialRampToValueAtTime(0.0001,t+sd*15);
    sub.connect(sg); sg.connect(MAST); sub.start(t); sub.stop(t+sd*15.5); return; }

  if(kind==='keptkeys'){ /* B21-2: WHAT THE VALLEY KEPT -- a struck bell-piano.
      Two INHARMONIC partials over the fundamental, each with its own shorter
      decay, which is what makes it read as an object being hit in a room
      instead of a pad holding a note. */
    const f0=hz(semi);
    const P=[[1,1.0,1.0],[2.76,0.34,0.55],[5.41,0.16,0.3]];
    for(const [r,a,d] of P){ const f=f0*r; if(f<20||f>17000)continue;
      const o=AC.createOscillator(), g=AC.createGain();
      o.type=(r===1)?'triangle':'sine'; o.frequency.value=f;
      g.gain.setValueAtTime(0.0001,t);
      g.gain.linearRampToValueAtTime(g0*a*0.5,t+0.004);
      g.gain.exponentialRampToValueAtTime(0.0001,t+1.5*d);
      o.connect(g); g.connect(MAST); o.start(t); o.stop(t+1.5*d+0.05); }
    /* the felt: a breath of highpassed noise on the hammer, 12 ms */
    const nb=AC.createBuffer(1,Math.ceil(AC.sampleRate*0.05),AC.sampleRate);
    const nd=nb.getChannelData(0);
    for(let i=0;i<nd.length;i++) nd[i]=(Math.random()*2-1)*(1-i/nd.length);
    const ns=AC.createBufferSource(); ns.buffer=nb;
    const hp=AC.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=2200;
    const ng=AC.createGain();
    ng.gain.setValueAtTime(g0*0.16,t); ng.gain.exponentialRampToValueAtTime(0.0001,t+0.012);
    ns.connect(hp); hp.connect(ng); ng.connect(MAST); ns.start(t); ns.stop(t+0.06); return; }

  if(kind==='nobodyswell'){ /* B21-3: NOBODY IS COMING -- a very low sine
      breathing under a slow LFO, with one filtered breath of air over the top.
      The LFO writes into a gain PARAM: one-way, nothing feeds back. */
    const f0=hz(semi);
    const o=AC.createOscillator(), g=AC.createGain();
    o.type='sine'; o.frequency.value=f0*0.5;
    g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(g0*0.46,t+1.4);
    g.gain.setValueAtTime(g0*0.46,t+sd*9); g.gain.exponentialRampToValueAtTime(0.0001,t+sd*15);
    o.connect(g); g.connect(MAST); o.start(t); o.stop(t+sd*15.5);
    const lfo=AC.createOscillator(), lg=AC.createGain();
    lfo.type='sine'; lfo.frequency.value=0.16; lg.gain.value=g0*0.2;
    lfo.connect(lg); lg.connect(g.gain); lfo.start(t); lfo.stop(t+sd*15.5);
    const ab=AC.createBuffer(1,Math.ceil(AC.sampleRate*2.2),AC.sampleRate);
    const ad=ab.getChannelData(0);
    for(let i=0;i<ad.length;i++) ad[i]=(Math.random()*2-1);
    const as=AC.createBufferSource(); as.buffer=ab;
    const lp=AC.createBiquadFilter(); lp.type='lowpass'; lp.Q.value=0.7;
    lp.frequency.setValueAtTime(900,t); lp.frequency.exponentialRampToValueAtTime(260,t+sd*12);
    const ag=AC.createGain();
    ag.gain.setValueAtTime(0.0001,t); ag.gain.linearRampToValueAtTime(g0*0.1,t+2.0);
    ag.gain.exponentialRampToValueAtTime(0.0001,t+sd*13);
    as.connect(lp); lp.connect(ag); ag.connect(MAST); as.start(t); as.stop(t+sd*13.5); return; }
"""

SONGS = [
    ("MENU — THE POWER STILL ON SOMEWHERE",
     "{n:'MENU — THE POWER STILL ON SOMEWHERE',menu:true,acc:'#c8b878',root:45,"
     "scale:[0,2,4,7,9],wave:'sine',kick:[],bass:[0,7],hat:[],"
     "inst:{b:'dawnpad',l:'gridglow'},am:'faythhum',kit:{k:'thud',h:'wood'},"
     "mel:'longs',swing:0,feel:'half',klay:'melody',ff:true}"),
    ("MENU — WHAT THE VALLEY KEPT",
     "{n:'MENU — WHAT THE VALLEY KEPT',menu:true,acc:'#9a8ac8',root:43,"  # DOWN 8/26, GRAVEYARD FINAL -- the GUARD below refuses to re-add this
     "scale:[0,2,3,5,7,8,11],wave:'triangle',kick:[0],bass:[0,7,12],hat:[],"
     "inst:{b:'coldpiano',l:'keptkeys'},am:'dawnwash',kit:{k:'thud',h:'wood'},"
     "mel:'call',swing:0,feel:'half',klay:'melody',ff:true}"),
    ("MENU — NOBODY IS COMING",
     "{n:'MENU — NOBODY IS COMING',menu:true,acc:'#7a8a9a',root:38,"  # DOWN 8/26, GRAVEYARD FINAL -- the GUARD below refuses to re-add this
     "scale:[0,2,3,5,7,8,10],wave:'sine',kick:[0,8],bass:[0],hat:[],"
     "inst:{b:'nobodyswell',l:'glasshope'},am:'edenmist',kit:{k:'thud',h:'wood'},"
     "mel:'longs',swing:0,feel:'normal',klay:'melody',ff:true}"),
]

VOICE_ANCHOR = "  if(kind==='dawnpad'){"


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

    if "kind==='gridglow'" not in s:
        if VOICE_ANCHOR not in s:
            print('FAIL: could not find the rack to add voices to')
            return 1
        s = s.replace(VOICE_ANCHOR, VOICES.rstrip() + '\n' + VOICE_ANCHOR, 1)
        changed.append('3 lead voices added to the rack (gridglow, keptkeys, nobodyswell)')

    # ---- the songs, into MLOOPS -----------------------------------------
    i0 = s.index('const MLOOPS=[')
    j0 = s.index('\n];', i0)
    have = set(re.findall(r"\{n:'([^']+)'", s[i0:j0]))
    # GRAVEYARD IS FINAL, CHECKED AT THE MOMENT OF INJECTION. Not a comment on
    # the entry, not a note in a docstring -- the actual list this tool is about
    # to write into MLOOPS, filtered against the registry. Re-running this file
    # after 8/26 must not put MENU - WHAT THE VALLEY KEPT or MENU - NOBODY IS
    # COMING back into the game, and the only way to be sure of that is to ask.
    LIVE = refuse_the_dead(SONGS)
    add = [lit for name, lit in LIVE if name not in have]
    if add:
        s = s[:j0] + ',\n ' + ',\n '.join(add) + s[j0:]
        changed.append('%d songs added to MLOOPS' % len(add))

    # ---- tagged MENU so the opening can find them ------------------------
    m = re.search(r'const CAT_DEFAULTS=\{(.*?)\};', s, re.S)
    cur = dict(re.findall(r"'([^']+)':\[([^\]]*)\]", m.group(1)))
    newtags = 0
    for name, _ in LIVE:
        if cur.get(name + '#1') != "'MENU'":
            cur[name + '#1'] = "'MENU'"
            newtags += 1
    if newtags:
        rb = ',\n '.join("'%s':[%s]" % (k, v) for k, v in sorted(cur.items()))
        s = s[:m.start()] + 'const CAT_DEFAULTS={\n ' + rb + '};' + s[m.end():]
        changed.append('%d songs tagged MENU' % newtags)

    # ---- badged NEW ------------------------------------------------------
    # NOT a queue: they play at the front door from the next deploy either way.
    # music_gate refuses a song that is neither badged nor ruled, which is the
    # rule that stops a song being cooked-and-hidden, and the badge is how he
    # FINDS them in the MUSIC tab if he ever wants to.
    m2 = re.search(r'const NEW_VIBES=\[(.*?)\];', s, re.S)
    if m2 is None:
        print('FAIL: NEW_VIBES not found')
        return 1
    names = re.findall(r"'([^']+)'", m2.group(1))
    missing = [n for n, _ in LIVE if n not in names]
    if missing:
        allnames = names + missing
        s = (s[:m2.start()] + 'const NEW_VIBES=['
             + ','.join("'%s'" % n for n in allnames) + '];' + s[m2.end():])
        changed.append('%d songs badged NEW in the MUSIC tab' % len(missing))

    if not changed:
        print('  already installed (idempotent, nothing to do)')
        return 0
    open(ALPHA, 'w', encoding='utf8').write(s)
    for c in changed:
        print('  ' + c)
    return 0


if __name__ == '__main__':
    sys.exit(main())
