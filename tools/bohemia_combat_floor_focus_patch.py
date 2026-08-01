#!/usr/bin/env python3
"""V113 FLOOR FOCUS: THE FLOOR YOU ARE NOT ON RECEDES.

Paolo: "you need to work long and hard do big brain online video game pixel
asymmetric research of how games create second stories and it just works and
makes sense because right now your shit is broken... it's not smart enough to
know like when I am behind it how it looks camera wise for the player".

I DID THE RESEARCH, AND IT SAYS BOHEMIA IS DOING THE OPPOSITE OF WHAT
EVERY OTHER GAME DOES.

--------------------------------------------------------------------------
THE FINDING, AND IT IS UNANIMOUS
--------------------------------------------------------------------------
Across Unreal, Unity, Godot and Roblox floor-system threads, the More
Mountains TopDown Engine docs, Larian's own forum on camera height, and the
Princeton "Adaptive Cutaways" paper, every source lands on the same sentence:

    AN UPPER FLOOR CANNOT BE FULLY VISIBLE AT ALL TIMES, BECAUSE IT
    OBSTRUCTS THE CAMERA. HIDE OR FADE THE FLOOR THE PLAYER IS NOT ON.

The standard implementation is a raycast from camera to player that culls
every floor except the player's. Cutaway rendering (the academic name) is
defined as "omitting portions of secondary objects to expose objects of
interest" -- and the operative word is PORTIONS: you cut what occludes, not
everything.

And Project Zomboid's specific answer to the stair case is DRAW ORDER, not
transparency: "when characters were stood on stairs, tiles behind would
already be drawn before the character, so he would draw correctly and not be
cut off."

--------------------------------------------------------------------------
WHAT BOHEMIA WAS DOING INSTEAD
--------------------------------------------------------------------------
Both floors drew at FULL STRENGTH, always, and then we ghosted the BODIES:
  * v93 x-rayed a man standing under the deck into a blue silhouette
  * v105 thinned only the individual deck tiles with a body under them
Which is backwards. We were fading the thing he is trying to LOOK AT, and
leaving the thing in the way at full contrast. That is why no amount of
tuning the ghost ever made it read, and it is the honest reason this has
come back at me three times.

--------------------------------------------------------------------------
WHAT SHIPS: ONE RULE, THE ONE THE RESEARCH NAMES
--------------------------------------------------------------------------
floorFocus(lvl) -> 1 for the floor you are standing on, less for the other.

  ON THE LOT, the deck is OVERHEAD. It drops to FLOOR_OFF so you are looking
  UNDER a structure instead of at a wall. Every tile, not just the ones with
  a body beneath -- because "which tiles happen to have a man under them" is
  not a thing a player can read, and a floor that changes opacity per-tile
  reads as a glitch, not as a storey.

  ON THE DECK, the LOT should recede the same way -- and that half is NOT in
  this patch. The lot's floor, blood, pillars and cars are drawn at four
  different points in drawField, some of them AFTER the deck, so doing it
  honestly means reordering the renderer, not dropping in one fillRect. A
  half-dimmed lot reads worse than an undimmed one. It is the next step and
  the record says so rather than pretending it shipped.

WHAT IS DELIBERATELY KEPT: the v93 x-ray silhouette stays as the BACKSTOP.
Two independent reads of the same fact, because he has asked to see who is
underneath more times than any other single thing in this lane. And the v105
scaffold structure -- legs, X-bracing, slatted boards, kick rail -- is
untouched: value contrast is the height cue and that is what the isometric
sources say too.

WHAT THIS DOES NOT DO, AND I AM SAYING SO: this is the OCCLUSION half of his
complaint. The other half -- "if I were on top of it like do I jump off or am
I not allowed to move in a certain direction because that's the end of the
second story" -- was answered in v106 (THE EDGE refuses a step into air, the
stairs walk both ways) and JUMPING OFF is a verb he has named but not ruled
on. It is not invented here.

REUSE CHECK: cooks NO graphic pixels. It multiplies existing draw calls by a
scalar. No bank is opened because no art is authored.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no
  clip, no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import base64, re, sys, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V113 FLOOR FOCUS'


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    html = ALPHA.read_text()
    m = re.search(r"const COMBAT_B64\s*=\s*'([^']+)'", html)
    if not m:
        sys.exit('no COMBAT_B64')
    s = base64.b64decode(m.group(1)).decode('utf-8')
    if MARK in s:
        print('v113 already in; nothing to do')
        return

    # ---- the rule ------------------------------------------------------
    old = """  const lvlDY=l=>-(((l|0)-(G.lvl||0))*DECK_H);"""
    new = """  const lvlDY=l=>-(((l|0)-(G.lvl||0))*DECK_H);
  /* ===== V113 FLOOR FOCUS ==========================================
     THE RESEARCH IS UNANIMOUS AND WE WERE DOING THE OPPOSITE OF IT. Every
     floor-system source -- Unreal, Unity, Godot and Roblox threads, the
     TopDown Engine docs, Larian's camera-height forum, the Princeton
     Adaptive Cutaways paper -- lands on one sentence: AN UPPER FLOOR CANNOT
     BE FULLY VISIBLE AT ALL TIMES BECAUSE IT OBSTRUCTS THE CAMERA, SO YOU
     FADE THE FLOOR THE PLAYER IS NOT ON.
     Bohemia drew BOTH floors at full strength and then ghosted the BODIES
     (v93's x-ray, v105's per-tile thinning). That is backwards: it fades the
     thing he is trying to look AT and leaves the thing in the way at full
     contrast. Which is the honest reason no amount of tuning the ghost ever
     made this read, three rejections running.
     ONE RULE NOW: the floor you are standing on is the solid one. */
  const FLOOR_OFF=0.42;   /* how far the floor you are NOT on recedes [DIAL] */
  const floorFocus=l=>((l|0)===(G.lvl||0))?1:FLOOR_OFF;"""
    s = subN(s, old, new)

    # ---- ON THE LOT: the whole deck goes light, not just tiles with a body
    old = """    const DECK_SEE=0.34, NBOARD=4;
    for(const T of G.deck){ const p=fieldPos(T,W,H,cx,cy), ty=p[1]-t2*0.5+dz;
      const thin=!T.stair&&_below(T);   /* V106: the run is not a floor, so it never goes see-through */
      x.save(); if(thin)x.globalAlpha=DECK_SEE;"""
    new = """    const DECK_SEE=0.34, NBOARD=4;
    for(const T of G.deck){ const p=fieldPos(T,W,H,cx,cy), ty=p[1]-t2*0.5+dz;
      const thin=!T.stair&&_below(T);   /* V106: the run is not a floor, so it never goes see-through */
      /* V113: the WHOLE deck recedes when you are not on it, not just the
         tiles that happen to have a man beneath them. Per-tile opacity reads
         as a glitch, not as a storey -- "which tiles have a body under them"
         is not something a player can see or use. The v105 per-tile thin
         survives on top of it, so a body underneath is doubly legible. */
      x.save(); x.globalAlpha=floorFocus(DECK_LVL)*(thin?DECK_SEE:1);"""
    s = subN(s, old, new)

    # NOTE: the OTHER direction -- standing ON the deck, the lot recedes -- is
    # deliberately NOT shipped here. The lot's floor, its blood, its pillars and
    # its cars are drawn at four different points in drawField, some of them
    # AFTER the deck, so doing it honestly means reordering the renderer rather
    # than dropping one fillRect in. A half-dimmed lot would read worse than an
    # undimmed one. It is written up in the record as the next step.

    out = base64.b64encode(s.encode('utf-8')).decode('ascii')
    html = html.replace(m.group(1), out, 1)
    ALPHA.write_text(html)
    print('v113: the floor you are not on recedes (%d chars)' % len(s))


if __name__ == '__main__':
    main()
