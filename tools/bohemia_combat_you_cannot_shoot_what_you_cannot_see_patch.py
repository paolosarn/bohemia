#!/usr/bin/env python3
"""V160 YOU CANNOT SHOOT WHAT YOU CANNOT SEE: THE RANGES, OFF THE RESEARCH.

Paolo 8/16: "I think the weapon range is still aren't good" and then, plainly:
"Look up rogue fable four weapon ranges please for the love of God."

Fair. He has said the ranges are wrong four times and I answered by asking him
which way instead of going and finding out. So: the research, and what it says.

--------------------------------------------------------------------------
WHAT ROGUE FABLE IV ACTUALLY DOES
--------------------------------------------------------------------------
From the dev's own Steam threads (Weapon Range Geometry / Simplified range):

  A BOW HAS 7 RANGE. It hits any tile whose true distance is 7.0 or less,
  measured a^2 + b^2 = c^2 against 49.
  THE PLAYER HAS 7.5 TILES OF VISION.
  Sight is "7 tiles in the best approximation of a circle".
  Staves (RF3, same designer) are range 5.
  MINIMUM RANGE ON BOWS WAS REMOVED -- they shipped it, then cut it.
  A handful of abilities use SQUARE range (lightning bolt, storm shot), which
  buys reach on the diagonal and is the deliberate exception.

*** THE HEADLINE IS NOT THE NUMBER 7. IT IS THAT RANGE EQUALS SIGHT. ***
You can shoot very nearly exactly as far as you can see. There is no state in
that game where you are looking at a man you cannot touch, and none where you
are touching a man you cannot see. And the whole spread from worst weapon to
best is 5 -> 7, a factor of 1.4.

--------------------------------------------------------------------------
WHAT BOHEMIA WAS DOING, MEASURED ON THE REAL CANVAS
--------------------------------------------------------------------------
Walked fieldPos outward on eight bearings until it left the screen:

  YOU CAN SEE 17.5 tiles to the sides, 27.5 on the diagonal.
  Men spawn at 8.9 nearest, 16.6 average, 29.1 furthest.

Against that, the guns:

  shotgun max 14   0.8x sight
  pistol  max 16   0.9x sight
  smg     max 26   1.5x sight
  rifle   max 44   2.5x SIGHT      <- shoots two and a half screens past his eyes
  sniper  max 64   3.7x SIGHT

*** THE RIFLE COULD SHOOT TWO AND A HALF TIMES FURTHER THAN HE COULD SEE. ***
That is not a balance problem, it is an incoherent rule: half the range on the
weapon does nothing except exist. And the spread was 14 -> 64, a factor of 4.6
against RF4's 1.4, so "which gun am I holding" swung the board by more than the
board is.

--------------------------------------------------------------------------
WHAT SHIPS
--------------------------------------------------------------------------
NOTHING REACHES PAST SIGHT. SIGHT_TILES is the narrow-axis number, 17, because
that is the distance guaranteed visible in every direction rather than only on
the diagonal. Every gun is capped there, the sniper included, and so is the
V151 floor -- his own ruling still gives him the edge over the field, it just
cannot push him past his own eyes.

  shotgun   9   a knife with a bang
  pistol   12
  smg      15
  rifle    17   = sight. Nothing may see further than this.
  sniper   17   same reach, better everything else

Spread 9 -> 17 is 1.9x. Still wider than RF4's 1.4 because these are guns and
not bows, but the same order.

AND THE GUNS DO NOT STOP BEING DIFFERENT, which is the part that matters and the
part RF4 gets right: once everything is capped at sight, RANGE STOPS BEING THE
AXIS THAT SEPARATES WEAPONS. They already differ by shots per turn (WEAPON_CAP),
by how far the muzzle swings (V155 SWING_ARC), by lethality, and by EFF -- the
distance each one actually wants to be at, which is untouched and is now the
real decision.

THE SPAWNS FIX THEMSELVES: SPAWN_NEAR/SPAWN_FAR are multiples of the player's max
range, so capping the range pulls the men in with it. No separate change, and no
second number to keep in sync.

NOT DONE HERE: minimum range. RF4 shipped it and cut it. Bohemia has never had
it and this is not the turn to add something its own designer threw away.

REUSE CHECK: cooks NO graphic pixels. Changes one table and adds one cap inside
the existing maxRange. Nothing authored, no bank opened.

TASTE CHECK: authors no art. The taste rule is his: "the weapon range is still
aren't good." The restraint is that EFF -- where each gun wants to fight -- is
left exactly as it was, because that is the part he has never complained about.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V160 YOU CANNOT SHOOT WHAT YOU CANNOT SEE'
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
        print('v160 already in; nothing to do')
        return

    old = """const WEAPON_RANGE={
  shotgun:{eff:5,  max:14},   /* buckshot 30-50yd, and the pattern is open long before that */
  pistol :{eff:6,  max:16},   /* EFF is the FIGHT distance (3-7yd), not the 50yd ballistic one */
  smg    :{eff:10, max:26},   /* pistol-calibre carbine: reaches, but it is not a rifle */
  rifle  :{eff:20, max:44}    /* excellent at 100m; on this board it simply outranges everything you own */
};"""
    new = """/* ===== V160 YOU CANNOT SHOOT WHAT YOU CANNOT SEE ==============
   Paolo 8/16: "the weapon range is still aren't good... look up rogue fable
   four weapon ranges please for the love of God." Fair -- he said it four times
   and I kept asking him which way instead of going and finding out.
   WHAT RF4 DOES (the dev's own Steam threads): a bow has 7 RANGE, hitting any
   tile whose true distance is <= 7.0 (a^2+b^2=c^2 against 49). THE PLAYER HAS
   7.5 TILES OF VISION. Staves are 5. Minimum range on bows was shipped and then
   REMOVED. A few abilities use SQUARE range (lightning bolt, storm shot) as the
   deliberate exception.
   *** THE HEADLINE IS NOT THE NUMBER 7, IT IS THAT RANGE EQUALS SIGHT. *** In
   that game there is no state where you are looking at a man you cannot touch,
   and none where you are touching a man you cannot see. Whole spread: 5 -> 7,
   a factor of 1.4.
   WHAT WE WERE DOING, measured by walking fieldPos out on eight bearings until
   it left the real canvas: YOU CAN SEE 17.5 TILES to the sides, 27.5 on the
   diagonal, and men spawn at 8.9 / 16.6 / 29.1. Against that the rifle's max of
   44 was 2.5x SIGHT and the sniper's 64 was 3.7x. That is not a balance problem,
   it is an incoherent rule: half the number on the weapon did nothing but exist.
   And the spread 14 -> 64 is 4.6x, so which gun he held swung the board by more
   than the board is.
   NOTHING REACHES PAST SIGHT NOW. The cap is the NARROW axis, because that is
   the distance guaranteed visible in every direction rather than only on the
   diagonal.
   AND THE GUNS DO NOT STOP BEING DIFFERENT -- that is the part RF4 gets right.
   Once everything is capped at sight, RANGE STOPS BEING THE AXIS THAT SEPARATES
   WEAPONS. They already differ by shots per turn (WEAPON_CAP), by how far the
   muzzle swings (V155), by lethality, and by EFF -- where each gun actually
   wants to fight, which is untouched and is now the real decision. */
const SIGHT_TILES=17;   /* [DIAL] measured off the real canvas: 17.5 to the sides */
/* AND REACH SITS JUST INSIDE SIGHT, WHICH IS RF4'S ACTUAL RATIO. A bow is 7
   against 7.5 tiles of vision -- 0.93, a THIN band where you can watch a man
   walk in before you can touch him. That band is the whole approach phase, and
   it is exactly what Paolo asked for on 8/11: "everyone starts out of range
   almost out of range of the weapon and then they have to walk towards each
   other." Reach == sight would delete it; reach > sight is what we had. */
const REACH_CEIL=16;   /* [DIAL] 0.94 of sight, RF4's own ratio */
const WEAPON_RANGE={
  shotgun:{eff:5,  max:9},   /* a knife with a bang. Buckshot opens up long before it stops */
  pistol :{eff:6,  max:12},   /* EFF is the FIGHT distance (3-7yd), not the 50yd ballistic one */
  smg    :{eff:10, max:15},   /* pistol-calibre carbine: reaches, but it is not a rifle */
  rifle  :{eff:20, max:16}    /* the ceiling: just inside sight, so there is always a band you can watch and not touch */
};"""
    js = subN(js, old, new)

    old = """const SNIPER_RANGE={eff:30,max:64};   /* 600m+: he is the reason the board is this big */"""
    new = """const SNIPER_RANGE={eff:30,max:16};   /* V160: same reach as the rifle, because SIGHT is the ceiling for everybody. He is still the worst man on the board -- by accuracy and by EFF, not by seeing through walls */"""
    js = subN(js, old, new)

    # the cap is enforced in ONE place, so nothing can route around it
    old = """function maxRange(R){ return Math.max(PT_BLANK+2, R.max*rangeMult()); }"""
    new = """/* V160: ONE DOOR. Every reach in the game -- yours, theirs, the sniper's, and
   the V151 floor that hands you the edge over the field -- comes through here,
   so the sight ceiling cannot be routed around by adding a number somewhere
   else. His V151 ruling still applies underneath it: he outranges the field,
   he just cannot outrange his own eyes. */
function maxRange(R){ return Math.min(REACH_CEIL, Math.max(PT_BLANK+2, R.max*rangeMult())); }"""
    js = subN(js, old, new)

    # ---- the spawn clamp, because my first claim about it was wrong --------
    old = """  const _lo=Math.min(contentR(), Math.max(PT_BLANK+2, _R*SPAWN_NEAR));
  const _hi=Math.min(contentR(), Math.max(_lo+1, _R*SPAWN_FAR));"""
    new = """  /* V160: AND THEY START WHERE HE CAN SEE THEM. I claimed these multipliers
     would "fix themselves" once the ranges came down, and MEASURED THEY DID NOT:
     SPAWN_FAR 1.65 x 16 is 26 tiles against 17.5 of sight, so 20% of every fight
     began off screen -- invisible AND unreachable, which is not an approach, it
     is a rumour. Clamped to sight, so the bell always shows him every man who is
     coming, and the thin REACH_CEIL band is what he watches them cross. */
  const _lo=Math.min(SIGHT_TILES, contentR(), Math.max(PT_BLANK+2, _R*SPAWN_NEAR));
  const _hi=Math.min(SIGHT_TILES, contentR(), Math.max(_lo+1, _R*SPAWN_FAR));"""
    js = subN(js, old, new)

    # ---- and the sniper, whose whole justification just retired -----------
    old = """    e.edist = (i===sniperIdx) ? Math.min(contentR(), Math.max(_hi, contentR()*0.90))   // the far gun still sits at the edge of the world"""
    new = """    /* V160: THE SNIPER COMES INSIDE SIGHT TOO. He was parked at 90% of the
       arena radius -- measured 29 tiles against 17.5 of vision -- on the stated
       grounds that "he is the reason the board is this big". That reason is
       retired: his reach is the same 16 as everybody else now, so out there he
       could not see, shoot, or be shot. He was a rumour with a health bar. He is
       still the worst man on the board, by accuracy and by EFF, at a distance
       where he exists. */
    e.edist = (i===sniperIdx) ? Math.min(SIGHT_TILES, contentR(), Math.max(_hi, contentR()*0.90))   // the far gun still sits at the far edge of what he can SEE"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v160: nothing reaches past sight -- %d chars' % len(js))


if __name__ == '__main__':
    main()
