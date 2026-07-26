#!/usr/bin/env python3
"""BOHEMIA - COMBAT v76: THE SONGS PLAY OUT, AND THE PULSE STOPS DOUBLING.

Paolo, after hearing v75 and liking it: "I hate to hear that we're locking great
parts of a song... especially in the overworld... I was wondering if we can maybe
transition the old 2 to 4 kills maybe just like when the song plays out and it
goes longer, cause right now I think each song is like just a 30 or 40 second
loop."

THREE DEFECTS, all found by reading the shipped code, none of them a taste call.
The taste call underneath (should the MELODY be what the 2/4 rungs unlock) is
HIS and is NOT touched here.

--- 1. MY OWN WRONG NUMBER, SHIPPED IN HIS UI -------------------------------
v75 told him his creepers average 0.54 kicks and 0.58 hats per bar. The gate
divided each pattern by 4, treating a 16-step pattern as four bars. It is ONE
bar: stepDur is (60/120)/4 = 0.125s, and 16 x 0.125 = 2.0s = four beats at 120.
The true figures are 2.17 KICKS and 2.33 HATS per bar.

The diagnosis survives (about half the kick density and a quarter to a third of
the hat density of a lockable track, every song half-time, and the pulse works)
but the number was wrong by 4x and it was printed in his settings panel. Fixed
here, in the panel text, in the law and in the gate's own arithmetic.

The sharper true finding, now that the count is right, is PLACEMENT rather than
density: SLOW CREEP kicks on steps 0 and 10, and step 10 is the offbeat between
beats 3 and 4. THE PIT BOSS IS GONE kicks on 0, 7 and 12. Two of the thirteen
kicks in the whole encounter pool land off the beat entirely, and no song has
anything on beats 2 and 4. There is no steady pulse to lock to because the hits
that exist are not evenly spaced.

--- 2. THE SONGS NEVER PLAY OUT --------------------------------------------
His songs are NOT 30-40 second loops. His own 7/3 TWO MINUTE LAW built them as
64-bar arrangements, ~2:08, sixteen 4-bar sections:

  0:00 A   0:08 B   0:16 B   0:24 A
  0:32 C   0:40 B   0:48 D   0:56 B
  1:04 A   1:12 B   1:20 C   1:28 A
  1:36 D   1:44 D   1:52 B   2:00 A

D is the FULL section (everything plus the high line). The first D lands at 0:48
and the back-to-back double D at 1:36.

But every NEW ENCOUNTER threw the arrangement back to bar 0 (pickRandomFaction
reset the step counter, and the song was re-pulled from the bag twice per
encounter -- once by pickDayPhase and once by the V71 line). So a fight shorter
than 48 seconds NEVER REACHED A SINGLE D, and what he heard over and over was
A B B A C: the first forty seconds. His "30 or 40 second loop" was measured
correctly off what the game actually played him.

THE FIX, and it is not a new idea, it is the behaviour THE OVERWORLD ALREADY
HAS: CITYMUS waits for MUS.step >= 1024 (64 bars x 16 steps) and only then
shuffles to the next track. Combat now does the same. A new song comes out of
the bag when the current one has finished its pass; otherwise the encounter
joins the song already in progress. Both of his complaints reconcile: V71's
"put ALL the overworld music in the shuffle" is a BAG problem (fixed at v71),
and this is a FORM problem. Variety comes from the bag over time; each song
still gets its full front-loaded identity and its D payoff.

V67 ONE CLOCK IS PRESERVED EXACTLY: a real song change still re-anchors beat
one. What stops is re-anchoring for a faction re-roll that does not change the
song at all, which in SHUFFLE it never does (owSong() reads G._owSong, not the
faction).

--- 3. THE PULSE WAS DOUBLING HITS THAT WERE ALREADY THERE ------------------
The pulse and the kill ladder both spend their budget on percussion, and three
of the collisions were literal duplicates:

  pulse clap on steps 4 and 12   vs   the 2-kill rung's clap on steps 4 and 12
  pulse kick on 0/4/8/12         vs   the song's own kick, which is on 0 and 8
  pulse hat on every even step   vs   the song's own hat on its own even steps

The doubled kick on step 0 is the same class of bug v70 and v71 already had to
kill twice: two loud hits at the same instant slam the master limiter (-14dB,
6:1) and it ducks the very thing being announced.

So the pulse now YIELDS. It is a FLOOR, which means it fills what his song does
not play and never stacks on top of what it does. His approved arrangement and
his 7/3 kill ladder are the canon; the floor gets out of their way. This also
thins out exactly the mud he was asking about at 4 kills.

REUSE CHECK: no new audio assets are cooked. Same drumV voices, same song kit,
same BohemiaPulse core shipped at v75; this moves where the floor fires and adds
the yield conditions. Nothing about his 13 approved songs is edited.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_songs_play_out_patch.py
Gate:  node gates/combat_lab_gate.js   (section 15 executes the play-out rule)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V76 THE SONGS PLAY OUT'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


OLD_PULSE = """  /* V75 THE FIGHT PULSE: the floor his creepers do not have. Four-on-the-
     floor + eighth hats + a backbeat, in the song's OWN kit, under his mix.
     Combat only, and dead the moment the fight is over. */
  if(BohemiaPulse.on(G.pulse||'hard') && !G.over && !G._musMuted){
    try{
      const _pm=BohemiaPulse.mix(G.pulse||'hard',BohemiaGroove.level(G.groove));
      const _pk=(f.kit&&f.kit.k)||'punchk', _ph=(f.kit&&f.kit.h)||'tight';
      const _pg=(v)=>{ const g=AC.createGain(); g.gain.value=v; g.connect(MAST); return g; };
      if(BohemiaPulse.kick(s)) drumV(_pk,AC,_pg(_pm.kick/0.085*0.9),t);
      if(BohemiaPulse.hat(s))  drumV(_ph,AC,_pg(_pm.hat/0.030*0.55),t);
      if(BohemiaPulse.back(s)) drumV('clap',AC,_pg(_pm.back/0.055*0.7),t);
    }catch(_e){}
  }
"""

NEW_PULSE = """  /* V76 THE FIGHT PULSE, AND IT YIELDS. A floor FILLS WHAT IS NOT PLAYED; it
     never stacks on top of what is. Three duplicates were live at v75: the
     pulse clap sat on the 2-kill rung's clap (same voice, same steps 4 and 12),
     the pulse kick sat on the song's own kick (steps 0 and 8 in every creeper),
     and the pulse hat sat on the song's own hat. The doubled kick on step 0 is
     the same bug v70 and v71 each had to kill: two loud hits at one instant
     slam the master limiter and it ducks the thing being announced.
     His arrangement and his 7/3 kill ladder are canon. The floor gets out of
     their way, which also thins the mud at four kills. Combat only, dead the
     moment the fight is over. */
  if(BohemiaPulse.on(G.pulse||'hard') && !G.over && !G._musMuted){
    try{
      const _pm=BohemiaPulse.mix(G.pulse||'hard',BohemiaGroove.level(G.groove));
      const _pk=(f.kit&&f.kit.k)||'punchk', _ph=(f.kit&&f.kit.h)||'tight';
      const _pg=(v)=>{ const g=AC.createGain(); g.gain.value=v; g.connect(MAST); return g; };
      const _songKick=(f.kick||[]).indexOf(s)>=0, _songHat=(f.hat||[]).indexOf(s)>=0;
      /* the 2-kill rung already claps 2 and 4, and klay 'drums' claps them at
         four kills. When his ladder is playing the backbeat, the floor is not. */
      const _rungClap=(_sk>=2)||(_sk>=4&&(f.klay||'drive')==='drums');
      if(BohemiaPulse.kick(s) && !_songKick) drumV(_pk,AC,_pg(_pm.kick/0.085*0.9),t);
      if(BohemiaPulse.hat(s)  && !_songHat)  drumV(_ph,AC,_pg(_pm.hat/0.030*0.55),t);
      if(BohemiaPulse.back(s) && !_rungClap) drumV('clap',AC,_pg(_pm.back/0.055*0.7),t);
    }catch(_e){}
  }
"""

PLAY_OUT = r"""/* ===== V76 THE SONGS PLAY OUT ==========================================
   Paolo: "I think each song is like just a 30 or 40 second loop... I was
   wondering if we can maybe transition the old 2 to 4 kills maybe just like
   when the song plays out and it goes longer."
   They are not loops. The 7/3 TWO MINUTE LAW built them as 64-bar arrangements
   (~2:08) whose FULL section D lands at 0:48 and again, doubled, at 1:36. But
   every NEW ENCOUNTER threw the arrangement back to bar 0, so a fight shorter
   than 48 seconds never reached a single D and he heard A B B A C on repeat --
   the first forty seconds, exactly the loop length he reported.
   THE OVERWORLD ALREADY DOES THIS RIGHT: CITYMUS waits for a full 1024-step
   pass and only then shuffles. Combat now matches it. */
const SONG_PASS=1024;   /* 64 bars x 16 steps = one complete arrangement */
function songPlayedOut(){ return !_seq.on || _seq.step>=SONG_PASS; }
/* Pull the next song only when the current one has finished its form. force=true
   is the studio / explicit-faction path, which must still swap on demand. */
function rollSongIfDone(force){
  if(!force && G._owSong && !songPlayedOut()) return false;
  try{ G._owSong=pickOverworldSong(); }catch(_e){}
  if(_seq.on){ _seq.step=0; seqAnchor(); }   /* V67 ONE CLOCK: a REAL new song is a new beat one */
  return true; }
/* ===== V76 PLAY-OUT END ===== */
"""


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # --- 3. the pulse yields (and moves below _sk so it can see the rung) ---
    demo = sub1(demo, OLD_PULSE, '', 'strip v75 pulse emission')
    demo = sub1(demo,
        "      BohemiaGroove.musicFloor(G.groove)):0);\n",
        "      BohemiaGroove.musicFloor(G.groove)):0);\n" + NEW_PULSE,
        'pulse below the rung')

    # --- 2. the songs play out ---
    demo = sub1(demo, 'function owSong(){', PLAY_OUT + 'function owSong(){', 'play-out core')

    # a faction re-roll is NOT a song change in SHUFFLE: owSong() reads G._owSong,
    # so re-anchoring there threw away the arrangement for nothing.
    demo = sub1(demo,
        "function pickRandomFaction(){ G.faction=Math.floor(Math.random()*FACTIONS.length); if(_seq.on){_seq.step=0;seqAnchor();}   /* V67 ONE CLOCK */",
        "function pickRandomFaction(){ G.faction=Math.floor(Math.random()*FACTIONS.length);\n"
        "  /* V76: in SHUFFLE the faction is NOT the song (owSong reads G._owSong), so\n"
        "     re-anchoring here restarted the arrangement for nothing. ONE CLOCK still\n"
        "     holds where the faction IS the song. */\n"
        "  if(_seq.on&&!G.factionShuffle){_seq.step=0;seqAnchor();}   /* V67 ONE CLOCK */",
        'faction reroll keeps the form')

    demo = sub1(demo,
        "function pickDayPhase(){ G.dayPhase=['morning','dusk','night'][Math.floor(Math.random()*3)]; G._dayPhaseAt=performance.now(); try{G._owSong=pickOverworldSong();}catch(_e){} }",
        "function pickDayPhase(){ G.dayPhase=['morning','dusk','night'][Math.floor(Math.random()*3)]; G._dayPhaseAt=performance.now(); rollSongIfDone(); }",
        'day phase respects the form')

    demo = sub1(demo,
        "  if(G.factionShuffle) try{ G._owSong=pickOverworldSong(); }catch(_e){}   /* V71: NEW ENCOUNTER always pulls the next song out of the bag */",
        "  /* V76: the bag hands over the next song when this one has PLAYED OUT, not\n"
        "     every encounter. V71's ask was that the WHOLE pool be in the bag (a bag\n"
        "     problem, fixed there); this is the FORM problem underneath it. */\n"
        "  if(G.factionShuffle) rollSongIfDone();",
        'new encounter respects the form')

    # tapping SHUFFLE is an EXPLICIT ask for a different song, so it still forces
    # one. Only the automatic per-encounter swap now waits for the form to finish.
    demo = sub1(demo,
        "sh.classList.add('on'); pickRandomFaction(); pickDayPhase(); });",
        "sh.classList.add('on'); pickRandomFaction(); pickDayPhase(); rollSongIfDone(true); });   /* V76: an explicit tap still forces a new song */",
        'shuffle tap forces')

    # --- 1. the wrong number, in the text he can read ---
    demo = sub1(demo,
        'FIGHT PULSE: the overworld creepers average 0.54 kicks a bar (half-time, ambient) so there is '
        'nothing to lock onto.',
        'FIGHT PULSE: the overworld creepers run 2.2 kicks and 2.3 hats a bar, all half-time, and the '
        'kicks sit unevenly (not one of the six kicks on beat 2, only THE PIT BOSS ever kicks on beat 4, '
        'and SLOW CREEP hits the offbeat before it). Against the 4 kicks and 8 hats of anything you can '
        'lock to, there is nothing steady to lock onto.',
        'the corrected number')

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
