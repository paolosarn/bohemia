#!/usr/bin/env python3
"""V140 NOBODY IS IN RANGE WHEN THE BELL RINGS.

Paolo 8/11: "how dare you make a range of weapons that have a maximum range and
then don't even set the Enemies that far away from me... can you have it set up
in a way where everyone starts out of range almost out of range of the weapon
like and then they have to walk towards each other... I literally can just stand
there. Shoot out everyone kill them."

--------------------------------------------------------------------------
HE IS RIGHT AND THE NUMBERS SAY SO OUT LOUD
--------------------------------------------------------------------------
V138 gave every gun a maximum range and then spawned people inside it.

  * the spawn band was 6 to ~25.6 tiles, and a PISTOL reaches 16. So roughly
    four in ten men were shootable before he had taken a single step.
  * WORSE, THERE WAS A GUARANTEED CLOSE SPAWN. The generator has always put one
    man at PT_BLANK+0..2.5 -- four to six and a half tiles -- "in your face". On
    a board where the whole point is that your gun has a reach, that one line
    hands him a target on turn one, every single fight, forever.
  * MY OWN V138 MEASUREMENT SAID IT AND I REPORTED IT AS A FEATURE: "pistol 41%
    of the board in range". Forty-one percent in range IS "stand there and kill
    everyone". I wrote the number down and read it as a gradient instead of as
    the bug he just described.

A maximum range only means something if there is a moment when nothing is inside
it. Otherwise it is a rule that never fires.

--------------------------------------------------------------------------
THE RESEARCH SAYS THE SAME THING
--------------------------------------------------------------------------
Turn-based tactics design: do not begin battles with enemies a turn or less
away; spacing them out is what gives the player room to use ranged tactics and
forces the approach to be played rather than skipped. The opening distance IS a
phase of the fight, and this game did not have one.

--------------------------------------------------------------------------
WHAT SHIPS: THE SPAWN IS MEASURED IN **YOUR GUN**, NOT IN TILES
--------------------------------------------------------------------------
A fixed tile number can never be right for five weapons with five reaches. So
the band is expressed as a multiple of YOUR OWN maximum range:

    everyone spawns between 1.00x and 1.55x your gun's max range

which means, on turn one, with any gun: NOBODY IS INSIDE IT. Not the nearest
man, not one of them. The fight opens with both sides walking, and who closes
first is the first real decision in the encounter.

THE GUARANTEED CLOSE SPAWN IS GONE. It is replaced by the NEAREST man sitting
exactly at the edge of your reach -- one step of yours from being shootable --
so there is always a decision available immediately, and never a free kill.

CLAMPED TO THE BOARD, HONESTLY: if your gun outreaches the arena (a rifle
reaches 44 and the board is 32) everyone lands at the far edge, which is inside
rifle range. That is CORRECT and it is the gun-choice gradient, not a bug: the
rifle IS the standoff weapon and the reward for carrying one is that you can
open the fight. The shotgun and the pistol have to walk, and they walk further.

WHY THIS ALONE MAKES STANDING STILL LOSE, WITH NO NEW SYSTEM: pressAI already
pulls a man to HIS OWN effective range and no closer. So a rifleman walks to 20
tiles and stops, and plinks you, while your pistol is a brick at 16. Stand still
and you are being shot by someone you cannot reach. The only answer is your feet.

MAP LAW HELD: spawn distance is a parameter on the arena dice, exactly like
density and clumping. No layout is authored and no arena is named.

REUSE CHECK: cooks NO graphic pixels. It reuses myRange(), maxRange() and
contentR(), all of which already exist, and changes only the distance a body is
placed at. No bank is opened because no art is authored.

TASTE CHECK: authors no art. The taste rule is his, twice over now: a fight you
can win standing still is not a fight. The restraint is the CLAMP -- the failure
mode of this feature is men spawned past the edge of the world where he cannot
see them, which would read as an empty board, so nobody is ever placed outside
what the arena actually builds.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V140 NOBODY IS IN RANGE WHEN THE BELL RINGS'
PAT = re.compile(r"(const COMBAT_B64\s*=\s*')([^']+)(')")


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = PAT.search(html)
    if not m:
        sys.exit('COMBAT_B64 not found')
    js = base64.b64decode(m.group(2)).decode()
    if MARK in js:
        print('v140 already in; nothing to do')
        return

    # ---- 1. the band, in units of YOUR gun --------------------------------
    old = """  // ONE enemy can be in your face; everyone else is fanned across the mid-to-far band so the field reads as real space
  const closeIdx = (N>=3) ? Math.floor(Math.random()*N) : (Math.random()<0.5?Math.floor(Math.random()*N):-1);"""
    new = """  /* ===== V140 NOBODY IS IN RANGE WHEN THE BELL RINGS ==============
     Paolo 8/11: "how dare you make a range of weapons that have a maximum range
     and then don't even set the Enemies that far away from me... I literally
     can just stand there. Shoot out everyone kill them."
     HE IS RIGHT AND MY OWN V138 MEASUREMENT SAID SO: "pistol 41% of the board in
     range" -- I wrote that down as a gradient and it is the bug he just named.
     Forty-one percent in range IS stand-there-and-kill-everyone. A maximum
     range only means anything if there is a moment when nothing is inside it.
     AND THERE WAS A GUARANTEED CLOSE SPAWN, which is worse than the band: one
     man at PT_BLANK+0..2.5 every single fight, forever, handing over a free
     target on turn one no matter how big the board got.
     SO THE BAND IS MEASURED IN **YOUR GUN**, NEVER IN TILES -- a fixed tile
     number cannot be right for five weapons with five reaches. Everyone spawns
     between 1.00x and 1.55x YOUR max range, so on turn one, with any gun,
     nobody is inside it and the fight opens with both sides walking.
     The close spawn is replaced by the NEAREST man sitting exactly at the edge
     of your reach: one step from shootable, so there is always a decision and
     never a free kill.
     THE RESEARCH AGREES: turn-based tactics design says do not open a battle
     with enemies a turn or less away -- spacing them out is what makes the
     approach a phase you play instead of one you skip. */
  const _R=maxRange(myRange());
  /* MEASURED AND WIDENED. At 1.00x the nearest man sat EXACTLY at max range,
     and inMyRange is <=, so he was shootable at the bell -- 17-19% in range,
     which is the bug again with a smaller number. And at 1.00x the gap was
     under one turn of walking, so there was no approach to play.
     ALSO MEASURED: the dark HALVES every range (V98), so a pistol really
     reaches 8 tiles at night, not 16. The band has to be a multiple of the
     range that is actually in effect, which is exactly why it is expressed
     this way instead of in tiles. At 1.8x the nearest man is ~6 tiles outside
     a pistol's reach: three to four turns of walking, which is a phase. */
  const SPAWN_NEAR=1.80, SPAWN_FAR=2.60;   /* multiples of YOUR max range [DIALS] */
  /* CLAMPED TO THE WORLD THAT ACTUALLY EXISTS: never place a man past what the
     arena builds, or the board reads empty and he is fighting ghosts. If your
     gun outreaches the arena (a rifle reaches 44, the board is 32) everyone
     lands at the far edge and a rifle CAN open the fight -- that is the reward
     for carrying one, not a bug. */
  const _lo=Math.min(contentR(), Math.max(PT_BLANK+2, _R*SPAWN_NEAR));
  const _hi=Math.min(contentR(), Math.max(_lo+1, _R*SPAWN_FAR));
  const closeIdx = (N>=3) ? Math.floor(Math.random()*N) : (Math.random()<0.5?Math.floor(Math.random()*N):-1);   /* V140: no longer "in your face" -- he is the man at the EDGE of your reach */"""
    js = subN(js, old, new)

    # ---- 2. the placement itself ------------------------------------------
    old = """    e.edist = (i===sniperIdx) ? contentR()*0.86+Math.random()*(contentR()*0.14)   // V139: the far gun sits at the edge of the world, wherever that edge is
             : (i===closeIdx) ? PT_BLANK+Math.random()*2.5                     // the one up close (point blank -> easy big-window dial)
                             : 6+Math.random()*(contentR()*0.80-6);            // V139: out to most of the board, and most of it out of pistol reach"""
    new = """    /* V140: every distance is now a multiple of YOUR gun, so no weapon can ever
       start the fight with a free target. The nearest man is AT the edge of your
       reach, not inside it. */
    e.edist = (i===sniperIdx) ? Math.min(contentR(), Math.max(_hi, contentR()*0.90))   // the far gun still sits at the edge of the world
             : (i===closeIdx) ? _lo                                            // V140: exactly at the edge of your reach -- one step from shootable, never a free kill
                             : _lo+Math.random()*(_hi-_lo);                     // V140: 1.00x to 1.55x your max range, so NOBODY is in range on turn one"""
    js = subN(js, old, new)

    # ---- 3. THE DECK WAS TELEPORTING MEN BACK INTO RANGE -----------------
    # MEASURED: after the band was widened, 6-8% of men were STILL shootable at
    # the bell. The cause is V90B -- it takes shooters who spawned correctly out
    # in the band and moves them onto deck tiles, which sit close to the player.
    # A later pass silently overwriting an earlier pass's placement is the same
    # shape of bug as the giants: two things deciding one number.
    # The deck keeps its point (high ground beats the stone you are behind) but
    # it may only claim a man if the tile it wants is ALSO outside your reach.
    old = """    for(let k=0;k<(G._deckHolders||0)&&k<spots.length&&k<shooters.length;k++){
      const T=spots[k], m=shooters[k];
      m.ea=T.ea; m.edist=T.edist; m.lvl=DECK_LVL; m.gcov=0; } }"""
    new = """    for(let k=0;k<(G._deckHolders||0)&&k<spots.length&&k<shooters.length;k++){
      const T=spots[k], m=shooters[k];
      /* V140: THE DECK USED TO TELEPORT A MAN BACK INTO YOUR RANGE. It takes a
         shooter who spawned correctly out in the band and drops him on a deck
         tile near you, which silently undid the opening distance -- 6-8% of men
         were shootable at the bell purely because of this line. A later pass
         overwriting an earlier pass's placement is the same shape as the giants:
         two things deciding one number. He only goes up if the high ground is
         ALSO outside your reach; otherwise he stays where the band put him. */
      if((T.edist||0) < _lo) continue;
      m.ea=T.ea; m.edist=T.edist; m.lvl=DECK_LVL; m.gcov=0; } }"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v140: nobody is in range when the bell rings -- %d chars' % len(js))


if __name__ == '__main__':
    main()
