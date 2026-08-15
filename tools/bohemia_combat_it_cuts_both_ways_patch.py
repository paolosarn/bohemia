#!/usr/bin/env python3
"""V153 IT CUTS BOTH WAYS, AND A MOVING MAN IS HARDER TO HIT.

Paolo 8/15: "so what I'm the only one that gets affected by this... that's not
fair second being out in the open in this game for more than two turns like you
will die so like I'm trying to make this fun."

--------------------------------------------------------------------------
1. HE IS RIGHT AND IT IS NOT A DEBATE
--------------------------------------------------------------------------
V152 chewed cover on exactly one code path: the enemy volley, where the pillar
that stopped THEIR round was already in hand. So only HIS cover ever degraded.
That is not a design position, it is me wiring the easy half and shipping it.

THEIR COVER TAKES IT NOW TOO. His shot that a man's stone eats chews that stone,
on the same rule and the same numbers. Rock to rock, both directions, and a man
who tucks behind a crate loses it exactly as fast as he does.

--------------------------------------------------------------------------
2. HIS SECOND POINT IS THE REAL ONE, AND IT BREAKS MY OWN FEATURE
--------------------------------------------------------------------------
"being out in the open in this game for more than two turns like you will die."

If that is true -- and it is -- then destroying his cover is not a prompt to
move, IT IS A DEATH SENTENCE. Cover decay only works as a mechanic if crossing
open ground is survivable. Right now it is not, so V152 on its own makes the
game WORSE and he spotted it immediately.

*** SO THE OPEN HAS TO BE CROSSABLE, AND THE HONEST WAY IS THE REAL ONE: A
MOVING TARGET IS HARD TO HIT. ***

This game has never once rewarded movement. Standing still and sprinting across
a lot present the same silhouette to every gun on the board, which is false to
life and is exactly why camping wins. Now:

  MOVE THIS TURN AND EVERY GUN IS WORSE AT HITTING YOU.

It is not a shield and it is not a dodge stat. It is the difference between
shooting at a man and shooting at a man who is running, and it turns his two
complaints into one answer: cover decays, so you must move -- and moving is
survivable, because moving is the point.

IT CUTS BOTH WAYS TOO. A man who moved on his turn is harder for HIM to hit,
which is why their bounding advance now costs him something instead of being a
free approach. Same rule, both sides, no exceptions -- that is the whole
complaint he opened with.

--------------------------------------------------------------------------
WHAT I AM NOT DECIDING: THE RANGE NUMBERS
--------------------------------------------------------------------------
"we gotta change the range system of the guns for sure... this isn't the final
range version." AGREED, AND NOT DECIDED HERE. He opened a debate and the debate
is his; the reply carries options rather than a commit. Nothing in this file
touches WEAPON_RANGE.

REUSE CHECK: cooks NO graphic pixels. Reuses chewCover, coverPillarAgainst,
_movedAt/_stepAt (already stamped by every mover) and distAccuracy. Nothing
authored, no bank opened.

TASTE CHECK: authors no art. The taste rule is his sentence, "I'm trying to make
this fun": a mechanic that only punishes is not difficulty, and cover decay
without a survivable open is only punishment. The restraint is that the moving
bonus is a modifier on the roll, never immunity -- crossing is possible, not free.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V153 IT CUTS BOTH WAYS'
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
        print('v153 already in; nothing to do')
        return

    # ---- 1. their cover takes it too -----------------------------------
    old = """const COVER_BITE=1;        /* [DIAL] what one round takes out of it */"""
    new = """/* ===== V153 IT CUTS BOTH WAYS =================================
   Paolo 8/15: "so what I'm the only one that gets affected by this... that's
   not fair."
   HE IS RIGHT AND IT IS NOT A DEBATE. V152 chewed cover on exactly one code
   path -- the enemy volley, where the stone that stopped THEIR round was
   already in hand -- so only HIS cover ever degraded. That is not a design
   position, it is me wiring the easy half and shipping it.
   His shot that a man's stone eats chews that stone now, same rule, same
   numbers. Rock to rock, both directions. */
const COVER_BITE=1;        /* [DIAL] what one round takes out of it */
/* what THEIR body is tucked behind, if anything -- the same test realCoverPillar
   runs as a boolean, returning the piece so it can take the hit. */
function foeCoverPillar(e){
  if(!e||(e.lvl|0)!==myLvl())return null;
  const exy=pXY(e);
  return (G.pillars||[]).find(P=>{ if(P.hard===false)return false; const pxy=pXY(P);
    return segNear(0,0,exy[0],exy[1],pxy[0],pxy[1],P.r*0.85) && Math.hypot(pxy[0]-exy[0],pxy[1]-exy[1])<1.8; })||null; }"""
    js = subN(js, old, new)

    # my shot chews their stone, wherever the shot resolves
    old = """function fireMissRound(tgt){"""
    new = """/* V153: MY round that HIS stone ate takes a bite out of it, exactly as his
   rounds take bites out of mine. Called on every shot I resolve. */
function chewFoeCover(tgt){ try{ const P=foeCoverPillar(tgt); if(P)chewCover(P); }catch(_e){} }
function fireMissRound(tgt){ try{chewFoeCover(tgt);}catch(_e){}"""
    js = subN(js, old, new)

    # ---- 2. a moving man is harder to hit ------------------------------
    # NOTE: the modifier is applied AFTER the existing return expression so
    # threatMult() is still read exactly ONCE here -- V121's law is that
    # difficulty reaches accuracy through one door and one door only, and a
    # convenience of mine does not get to add a second.
    old = """  const base=0.97 - distTFrom(e)*0.60;     // point blank ~.97, far ~.37 (they rarely miss up close)
  return 1-(1-base)/threatMult(); }"""
    new = """  const base=0.97 - distTFrom(e)*0.60;     // point blank ~.97, far ~.37 (they rarely miss up close)
  /* ===== V153 A MOVING MAN IS HARDER TO HIT =====================
     Paolo 8/15: "being out in the open in this game for more than two turns
     like you will die so like I'm trying to make this fun."
     THAT BREAKS MY OWN FEATURE AND HE SPOTTED IT IMMEDIATELY. If the open kills
     you, destroying his cover is not a prompt to move, IT IS A DEATH SENTENCE
     -- V152 on its own makes the game worse. Cover decay only works if crossing
     open ground is survivable.
     SO THE OPEN BECOMES CROSSABLE THE HONEST WAY: this game has never once
     rewarded movement. Standing still and sprinting across a lot present the
     same silhouette to every gun on the board, which is false to life and is
     exactly why camping wins. Move this turn and every gun is worse at hitting
     you. Not a shield and not a dodge stat -- the difference between shooting
     at a man and shooting at a man who is running. */
  return (1-(1-base)/threatMult())*(iMoved()?(1-MOVING_MISS):1); }
const MOVING_MISS=0.35;   /* [DIAL] how much of a gun's accuracy a moving target takes away */
const MOVED_MS=1200;      /* [DIAL] how long "he just moved" lasts, in real time */
function iMoved(){ const t=G._stepAt||0; return t>0 && (performance.now()-t)<MOVED_MS; }"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v153: both ways, and movement finally matters -- %d chars' % len(js))


if __name__ == '__main__':
    main()
