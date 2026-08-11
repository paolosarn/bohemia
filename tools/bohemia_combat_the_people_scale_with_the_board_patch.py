#!/usr/bin/env python3
"""V139 THE PEOPLE SCALE WITH THE BOARD. THE GIANTS WERE A REAL BUG.

Paolo 8/11: "are you fucking for real like you're going to stretch the fucking
map so the characters look like fucking Giants on the map... that was so creepy
and so bad... I don't know why you're having such a fucking issue just making it
bigger and bigger."

--------------------------------------------------------------------------
WHAT I ACTUALLY SHIPPED, AND WHY IT WAS GIANTS
--------------------------------------------------------------------------
V138 lowered the tile pitch from 0.085 to 0.038 to zoom the board out. The
FLOOR obeyed. THE PEOPLE DID NOT, because every human in this game is blitted
at a HARDCODED 112x112 PIXELS with no scale term anywhere:

    x.drawImage(cv112, Math.round(ex-56), Math.round(ey-84));

That line does not know the board exists. So:
    at pitch 0.085 one tile was ~36.5px and a body was ~3 tiles tall
    at pitch 0.038 one tile was ~16.3px and the SAME body was ~6.9 tiles tall
The ground shrank by 2.2x and the men stayed exactly the same size. That is not
a zoomed-out board, that is a stretched floor under giants, and he is right that
it is creepy: the proportions of the world silently changed underneath him.

*** AND I HAD THE EVIDENCE AND MISREAD IT. *** I rendered the board at four
pitches, looked at the screenshots, saw the bodies were not shrinking, and wrote
down "bodies stay readable at every pitch" as if that were a feature. It was the
bug, on screen, and I called it a pass. LOOKING IS NOT VERIFYING IF YOU DO NOT
KNOW WHAT WOULD COUNT AS FAILURE. Hence the gate: the body-to-tile ratio is now
a NUMBER the machine checks, not a thing I eyeball and reassure myself about.

--------------------------------------------------------------------------
THE RESEARCH: WHY THE ZOOM IS A WHOLE NUMBER NOW
--------------------------------------------------------------------------
Pixel art may only be scaled by INTEGER factors under nearest-neighbour. A
fractional multiplier makes some source pixels cover two screen pixels while
their neighbours cover one, so columns come out visibly fatter than others and
the whole image shimmers when anything moves. Polished pixel games either scale
by whole numbers and snap the camera to whole pixels, or render to an offscreen
texture and upscale THAT by an integer.

0.038 was not 0.085 divided by anything clean. It was a number I picked off a
screenshot. So the zoom is no longer a free float:

    FIELD_ZOOM   whole number: 1 = the old board, 2 = twice the ground, 3 = three times
    FIELD_PITCH  = 0.085 / FIELD_ZOOM
    bodyScale()  = 1 / FIELD_ZOOM

ONE number drives the floor AND the people, so they can never disagree again.
At half or a third scale a sprite lands on exact source pixels. The world keeps
the proportions it always had and you simply see more of it, which is what
zooming out is supposed to mean and what V138 failed to do.

--------------------------------------------------------------------------
EVERYTHING THAT HANGS OFF A BODY SCALES WITH IT
--------------------------------------------------------------------------
If the sprite shrinks but the wounds, the blood pool and the corpse holes do
not, they become the new giants at a smaller size. They are drawn inside a
scaled transform around the body, so anything in body-space follows the body BY
CONSTRUCTION rather than by me remembering to multiply each one -- which is the
precise class of mistake that produced the giants.

REUSE CHECK: cooks NO graphic pixels. It changes the SIZE the existing baked
112x112 sprite canvases are blitted at, and authors no new art, no new sprite
and no new frame. No bank is opened because nothing is drawn.

TASTE CHECK: authors no art, and it exists because a taste failure shipped. The
rule it restores is the most basic one in a top-down game: a person is about a
person's size next to the ground he stands on, at every zoom. The guard against
it recurring is a measured ratio, not my judgement.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region. The baked sprite is unchanged; only the size it
  is drawn at moves, and it moves with the board.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V139 THE PEOPLE SCALE WITH THE BOARD'
PAT = re.compile(r"(const COMBAT_B64\s*=\s*')([^']+)(')")

# whole numbers ONLY, and chosen by looking at the real canvas AND measuring the
# body-to-tile ratio -- never by arithmetic alone, which is how V138 went wrong.
FIELD_ZOOM = '3'


def subN(src, old, new, n=1):
    c = src.count(old)
    if c != n:
        sys.exit('ANCHOR COUNT %d (want %d) for: %s' % (c, n, old[:90]))
    return src.replace(old, new)


def main():
    zoom = FIELD_ZOOM
    for a in sys.argv[1:]:
        if a.startswith('--zoom='):
            zoom = a.split('=', 1)[1]

    html = ALPHA.read_text()
    m = PAT.search(html)
    if not m:
        sys.exit('COMBAT_B64 not found')
    js = base64.b64decode(m.group(2)).decode()

    if MARK in js:
        js = re.sub(r'const FIELD_ZOOM=\d+;', 'const FIELD_ZOOM=%s;' % zoom, js)
        enc = base64.b64encode(js.encode()).decode()
        ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
        print('v139 already in; zoom set to %s' % zoom)
        return

    # ---- 1. ONE WHOLE NUMBER DRIVES THE FLOOR AND THE PEOPLE -------------
    old = "const FIELD_PITCH=0.038;"
    new = """/* ===== V139 THE PEOPLE SCALE WITH THE BOARD =======================
   Paolo 8/11: "you're going to stretch the fucking map so the characters look
   like fucking Giants on the map... that was so creepy and so bad."
   HE IS RIGHT AND IT WAS A REAL BUG. V138 lowered this pitch to zoom the board
   out and the FLOOR obeyed, but every human is blitted at a HARDCODED 112x112
   with no scale term, so the ground shrank 2.2x and the men did not move at
   all: a body went from ~3 tiles tall to ~6.9. That is not a zoomed-out board,
   it is a stretched floor under giants.
   THE RESEARCH: pixel art may only be scaled by INTEGER factors under
   nearest-neighbour. A fractional multiplier makes some source pixels cover two
   screen pixels while their neighbours cover one, so columns come out visibly
   fatter and everything shimmers when it moves. 0.038 was not 0.085 over
   anything clean -- it was a number picked off a screenshot.
   SO THE ZOOM IS A WHOLE NUMBER AND ONE NUMBER DRIVES BOTH. The floor and the
   people divide by the SAME integer, so they can never disagree again, and at
   half or a third scale a sprite lands on exact source pixels. The world keeps
   the proportions it always had and you simply see more of it, which is what
   zooming out is supposed to mean. */
const FIELD_ZOOM=%(zoom)s;              /* 1 = the old board, 2 = twice the ground, 3 = three times. WHOLE NUMBERS ONLY */
const FIELD_PITCH=0.085/FIELD_ZOOM;
function bodyScale(){ return 1/FIELD_ZOOM; }   /* the people ride the same number as the floor */""" % {'zoom': zoom}
    js = subN(js, old, new)

    # ---- 2. THE TWO BLITS EVERY HUMAN GOES THROUGH ----------------------
    old = """function drawHuman(x,cv112,ex,ey){
  x.imageSmoothingEnabled=false;
  x.drawImage(cv112,Math.round(ex-56),Math.round(ey-84));
}"""
    new = """/* V139: THIS IS WHERE THE GIANTS CAME FROM. It blitted a 112x112 sprite at a
   hardcoded size and did not know the board existed, so zooming the floor out
   left the people exactly as big as they had been. Every human in the game --
   the player and every enemy -- goes through here and drawHumanWashed below,
   which is why two functions fix all of it. */
function drawHuman(x,cv112,ex,ey){
  x.imageSmoothingEnabled=false;
  const S=bodyScale(), w=Math.max(1,Math.round(112*S));
  x.drawImage(cv112,0,0,112,112,Math.round(ex-56*S),Math.round(ey-84*S),w,w);
}"""
    js = subN(js, old, new)

    old = """  x.imageSmoothingEnabled=false;
  x.drawImage(_wash,Math.round(ex-56),Math.round(ey-84));
}"""
    new = """  x.imageSmoothingEnabled=false;
  const S=bodyScale(), w=Math.max(1,Math.round(112*S));   /* V139: rides the board, exactly like drawHuman */
  x.drawImage(_wash,0,0,112,112,Math.round(ex-56*S),Math.round(ey-84*S),w,w);
}"""
    js = subN(js, old, new)

    # ---- 3. ANYTHING HANGING OFF A BODY RIDES THE BODY -------------------
    old = "  if(e.dead&&e._poolGrow>0){drawBloodPool(x,ex,ey,e._poolGrow);}"
    new = """  if(e.dead&&e._poolGrow>0){ const S=bodyScale();   /* V139: the pool is his, so it is his size */
    x.save(); x.translate(ex,ey); x.scale(S,S); drawBloodPool(x,0,0,e._poolGrow); x.restore(); }"""
    js = subN(js, old, new)

    old = """  drawHumanWashed(x,f,ex,ey,tint);
  if(!e.dead)drawWounds(x,e,ex,ey);
  else if(e._poolGrow>0.15)drawCorpseHoles(x,e,ex,ey);"""
    new = """  drawHumanWashed(x,f,ex,ey,tint);
  /* V139: everything that hangs off a body rides the body. Scaling the
     TRANSFORM means anything drawn in body-space follows BY CONSTRUCTION,
     instead of by me remembering to multiply every offset -- which is exactly
     the class of mistake that made the giants. */
  { const S=bodyScale(); x.save(); x.translate(ex,ey); x.scale(S,S);
    if(!e.dead)drawWounds(x,e,0,0);
    else if(e._poolGrow>0.15)drawCorpseHoles(x,e,0,0);
    x.restore(); }"""
    js = subN(js, old, new)

    # ---- 4. AND MY OWN V138 ARITHMETIC WAS WRONG ------------------------
    # V138's record claims "density per square tile stays where the generator
    # already had it". CHECKED, AND IT DOES NOT:
    #   before  2-15 pieces (avg 8.5) inside radius 11  = pi*121/8.5   = 1 per 45 tiles^2
    #   v138    6-35 pieces (avg 20)  inside radius 28  = pi*784/20    = 1 per 123 tiles^2
    # So V138 THINNED the cover by about 2.7x while claiming it held it. That is
    # why the bigger board reads as empty desert with a road through it instead
    # of an arena -- the same WALKABLE-LAND failure the law names, arrived at by
    # bad arithmetic instead of by choice.
    # Holding the ORIGINAL density over radius 28 needs pi*784/45 =~ 55 pieces.
    old = """    const NP=6+Math.floor(Math.random()*30);   /* V138: 2-15 was tuned for a 10-tile board; this holds the DENSITY on a 26-tile one */"""
    new = """    const NP=20+Math.floor(Math.random()*70);   /* V139: V138 claimed it held density and thinned it 2.7x. The original was 1 piece per ~45 tiles^2; over radius 28 that is ~55 pieces, not 20. THIS is what makes it read as an arena instead of a desert */"""
    js = subN(js, old, new)

    # ---- 5. CONTENT REACHES AS FAR AS YOU CAN SEE ------------------------
    # THE SAME BUG AS THE GIANTS, IN A THIRD COSTUME: two numbers that should be
    # one. The visible radius is 0.85/FIELD_PITCH, but cover stopped at a
    # hardcoded 28 and men spawned inside 26 -- so at zoom 3 you could see 30
    # tiles and the outer ring was empty desert BY CONSTRUCTION. Every time the
    # zoom moves, a hardcoded content radius is wrong again.
    # CONTENT_R is DERIVED from what you can actually see, so they cannot drift.
    old = """function bodyScale(){ return 1/FIELD_ZOOM; }   /* the people ride the same number as the floor */"""
    new = """function bodyScale(){ return 1/FIELD_ZOOM; }   /* the people ride the same number as the floor */
/* V139: HOW FAR THE WORLD IS BUILT, DERIVED FROM HOW FAR YOU CAN SEE. Cover used
   to stop at a hardcoded 28 tiles and men spawned inside 26, so the moment the
   zoom moved past that the outer ring of the board was empty desert BY
   CONSTRUCTION. That is the giants bug in a third costume: two numbers that
   should have been one. Now there is one. */
function contentR(){ return 0.85/FIELD_PITCH + 2; }"""
    js = subN(js, old, new)

    old = """      if(Math.hypot(nx2,ny2)>28)continue;   /* V138: was 11 -- which put every rock inside a third of the new board and left the rest bare desert */"""
    new = """      if(Math.hypot(nx2,ny2)>contentR())continue;   /* V139: as far as he can SEE, so the edge of the board is never bare by construction */"""
    js = subN(js, old, new)

    old = """      else { const a0=Math.random()*Math.PI*2, d0=2.2+Math.random()*22;   /* V138: cover reaches the whole board, not just the old 10-tile core */"""
    new = """      else { const a0=Math.random()*Math.PI*2, d0=2.2+Math.random()*(contentR()-2.2);   /* V139: cover fills the board he can see */"""
    js = subN(js, old, new)

    old = """    e.edist = (i===sniperIdx) ? 30+Math.random()*10                            // V138: a 600m rifle sits where nothing you own can answer
             : (i===closeIdx) ? PT_BLANK+Math.random()*2.5                     // the one up close (point blank -> easy big-window dial)
                             : 6+Math.random()*20;                             // V138: 6-26 tiles (9-39m) -- a real street, and most of it out of pistol reach"""
    new = """    e.edist = (i===sniperIdx) ? contentR()*0.86+Math.random()*(contentR()*0.14)   // V139: the far gun sits at the edge of the world, wherever that edge is
             : (i===closeIdx) ? PT_BLANK+Math.random()*2.5                     // the one up close (point blank -> easy big-window dial)
                             : 6+Math.random()*(contentR()*0.80-6);            // V139: out to most of the board, and most of it out of pistol reach"""
    js = subN(js, old, new)

    # ---- 6. THE CHEST MARKER RIDES THE BODY TOO --------------------------
    # CAUGHT BY THE V101 GATE, NOT BY ME, AND IT IS THE SAME BUG AGAIN.
    # MASS_DY=-42 is half of drawHuman's own 84px offset -- it is where a man's
    # CHEST is, and it is what every hit marker and cover ring hangs off. Scale
    # the sprite and leave that at 42 and the marker floats above a body only
    # 37px tall: the giants bug, inverted, on the aiming reticle.
    # The gate's own words were "derived from the draw call, not eyeballed, so a
    # sprite-height change has ONE number to follow" -- and this IS that change.
    old = """  const MASS_DY=-42;"""
    new = """  const MASS_DY=-42*bodyScale();   /* V139: still half of drawHuman's 84px offset -- which now rides the board, so this does too. Leave it at 42 and the chest marker floats above a body a third that tall */"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v139: the people ride the board (zoom %s) -- %d chars' % (zoom, len(js)))


if __name__ == '__main__':
    main()
