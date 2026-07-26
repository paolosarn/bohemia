#!/usr/bin/env python3
"""BOHEMIA - COMBAT v78: NEW ENCOUNTER CHANGES THE SONG. REVERTING MY OWN v76.

Paolo: "OK, the only thing I don't like that you try to implement was that when I
pressed new encounter this song doesn't change like that's so fucking retarded
bro."

RULED. It is out. NEW ENCOUNTER pulls the next song out of the bag, every single
time, exactly like it did before I touched it.

WHY I GOT IT WRONG, recorded so the next session does not repeat it: he said his
songs felt like 30-40 second loops and asked whether they could "play out and go
longer." That was TRUE and the cause was real (every encounter reset the 2:08
arrangement to bar 0, so the FULL section at 0:48 was unreachable). But I reached
for the wrong lever. Making the song PERSIST across encounters fixed the form at
the direct cost of the thing he presses the button FOR. NEW ENCOUNTER means new
encounter. A button that visibly does nothing is worse than a form he has not
heard yet.

THE RULE THIS LEAVES BEHIND: when a fix trades away something the player can feel
IMMEDIATELY for something they would only feel LATER, it is not a fix, it is a
bet -- and it is his bet to place, not mine.

WHAT GOES, exactly:
  - SONG_PASS / songPlayedOut() / rollSongIfDone() -- deleted outright, not left
    behind as dead logic with force=true wired through it. A function that
    pretends to make a decision it no longer makes is worse than no function.
  - the "wait for the form" gating on NEW ENCOUNTER and on the day phase.

WHAT STAYS (he did not object to any of it, and none of it is the swap):
  - THE SINGLE PULL POINT. The song used to be pulled from the bag TWICE per
    encounter (once by pickDayPhase, again by the V71 line), which burned the
    shuffle bag at double speed and skipped songs he never heard. That was a
    plain bug and it stays fixed: one pull, one encounter, one new song.
  - THE PULSE YIELDING instead of doubling hits his songs already play.
  - The corrected 2.17 / 2.33 measurement.

WHAT THIS COSTS, stated plainly rather than buried: he is back to hearing roughly
the first forty seconds of any song in combat, because a fresh song starts at bar
0 and section D lands at 0:48. The 2:08 form is still there and the overworld
still plays it in full. If he ever wants combat to reach it, the answer has to be
something that does NOT cost him the button, and that is his call to make.

REUSE CHECK: no audio assets are cooked, read or written. This only removes
control flow I added in v76. His song banks are untouched and song_lock_gate
proves it on every run.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_newenc_song_patch.py
Gate:  node gates/combat_lab_gate.js   (section 15 now holds the REVERSAL)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V78 NEW ENCOUNTER = NEW SONG'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


OLD_CORE_HEAD = """/* ===== V76 THE SONGS PLAY OUT =========================================="""

NEW_CORE = r"""/* ===== V78 NEW ENCOUNTER = NEW SONG (Paolo 7/26, reverting my own V76) ===
   "the only thing I don't like that you try to implement was that when I pressed
   new encounter this song doesn't change like that's so fucking retarded bro."
   RULED, and it is out. He was right that his songs felt like 30-40 second
   loops -- every encounter reset the 2:08 form to bar 0 and the FULL section at
   0:48 was unreachable -- but I pulled the wrong lever. Making the song persist
   across encounters fixed the form at the direct cost of the thing the button is
   FOR. NEW ENCOUNTER means new encounter.
   The V76 play-out gating is DELETED, not left behind as dead logic with a force
   flag wired through it. What survives is the plain bug it uncovered: the song
   used to be pulled from the bag TWICE an encounter (pickDayPhase, then the V71
   line), burning the shuffle at double speed and skipping songs he never heard.
   ONE PULL, ONE ENCOUNTER, ONE NEW SONG. */
function rollSong(){
  try{ G._owSong=pickOverworldSong(); }catch(_e){}
  if(_seq.on){ _seq.step=0; seqAnchor(); }   /* V67 ONE CLOCK: a new song is a new beat one */
  return true; }
/* ===== V78 END ===== */
"""


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # rip the v76 core out whole and put the plain one in its place
    i = demo.index(OLD_CORE_HEAD)
    j = demo.index('/* ===== V76 PLAY-OUT END ===== */\n') + len('/* ===== V76 PLAY-OUT END ===== */\n')
    old_core = demo[i:j]
    if old_core.count('function rollSongIfDone(force){') != 1:
        sys.exit('FAIL: v76 core not shaped as expected')
    demo = sub1(demo, old_core, NEW_CORE, 'swap the core')

    demo = sub1(demo,
        "  /* V76: the bag hands over the next song when this one has PLAYED OUT, not\n"
        "     every encounter. V71's ask was that the WHOLE pool be in the bag (a bag\n"
        "     problem, fixed there); this is the FORM problem underneath it. */\n"
        "  if(G.factionShuffle) rollSongIfDone();",
        "  /* V78 (Paolo ruled): NEW ENCOUNTER = NEW SONG, every single time. The bag\n"
        "     is the whole approved pool (V71) and this is the one place it is pulled. */\n"
        "  if(G.factionShuffle) rollSong();",
        'new encounter always rolls')

    demo = sub1(demo,
        "G._dayPhaseAt=performance.now(); rollSongIfDone(); }",
        "G._dayPhaseAt=performance.now(); }   /* V78: the song is rolled by NEW ENCOUNTER / SHUFFLE, in one place, never twice an encounter */",
        'day phase stops pulling')

    demo = sub1(demo,
        "pickRandomFaction(); pickDayPhase(); rollSongIfDone(true); });   /* V76: an explicit tap still forces a new song */",
        "pickRandomFaction(); pickDayPhase(); rollSong(); });   /* V78: the SHUFFLE tap rolls the song too */",
        'shuffle tap rolls')

    # the faction re-roll re-anchor: in SHUFFLE the song is rolled by rollSong()
    # right after, which anchors. Restore the plain V67 line so there is exactly
    # one rule and no leftover V76 conditional pretending to matter.
    demo = sub1(demo,
        "function pickRandomFaction(){ G.faction=Math.floor(Math.random()*FACTIONS.length);\n"
        "  /* V76: in SHUFFLE the faction is NOT the song (owSong reads G._owSong), so\n"
        "     re-anchoring here restarted the arrangement for nothing. ONE CLOCK still\n"
        "     holds where the faction IS the song. */\n"
        "  if(_seq.on&&!G.factionShuffle){_seq.step=0;seqAnchor();}   /* V67 ONE CLOCK */",
        "function pickRandomFaction(){ G.faction=Math.floor(Math.random()*FACTIONS.length); if(_seq.on){_seq.step=0;seqAnchor();}   /* V67 ONE CLOCK */",
        'faction reroll back to plain')

    return demo


def main():
    src = open(ALPHA, encoding='utf8').read()
    key = "const COMBAT_B64='"
    i = src.index(key) + len(key)
    j = src.index("'", i)
    demo = base64.b64decode(src[i:j]).decode('utf8')
    print('decoded COMBAT_B64: %d bytes' % len(demo))
    new = patch(demo)
    if new is not demo:
        b64 = base64.b64encode(new.encode('utf8')).decode('ascii')
        src = src[:i] + b64 + src[j:]
        open(ALPHA, 'w', encoding='utf8').write(src)
        print('  demo: re-embedded (%d bytes, %+d)' % (len(new), len(new) - len(demo)))
    print('OK -> slices/BOHEMIA_ALPHA_0_9.html')


if __name__ == '__main__':
    main()
