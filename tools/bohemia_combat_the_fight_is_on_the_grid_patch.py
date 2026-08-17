#!/usr/bin/env python3
"""V162 THE FIGHT IS ON THE GRID: bodies stop floating over the tiles.

Paolo 8/17: "we really need this shit to play exactly like rogue fable four
right now."

--------------------------------------------------------------------------
MEASURED FIRST, AND IT IS THE WHOLE ANSWER
--------------------------------------------------------------------------
Twenty arenas, every body and every rock:

  COVER sitting on an integer tile:   1405 / 1405
  BODIES sitting on an integer tile:     16 / 160
  ENEMY MOVES: shortest 0.90, median 1.80, longest 1.80 tiles
  MOVES THAT WERE EXACTLY ONE TILE:       0 / 64

*** THE BOARD IS A PERFECT TILE GRID AND THE PEOPLE ARE FLOATING OVER IT. ***
The rocks are on cells. The men are at 7.34 tiles on a bearing of 2.1 radians,
sliding 1.8 tiles a turn in whatever direction the scorer liked.

THAT IS WHY IT DOES NOT PLAY LIKE RF4, and it is not a feel problem, it is an
arithmetic one. A roguelike is playable because you can COUNT: he is four tiles
away, my gun reaches twelve, if I step back he steps forward and nothing changes.
None of that is available when a man is 7.34 tiles out and moves 1.8 -- there is
no number on the board to plan with, so positioning collapses into vibes and the
only honest strategy left is to sit still and shoot, which is exactly what he has
been reporting for a week.

THE PLAYER WAS ALREADY RIGHT. His move is `v[0]*1, v[1]*1` over the 8 unit
offsets -- "full tile steps, diagonals included (Chebyshev)". One tile, always.
Only the enemies were never held to it.

--------------------------------------------------------------------------
WHAT SHIPS
--------------------------------------------------------------------------
1. EVERY BODY LIVES ON A CELL. Spawn snaps to integers, and worldShift re-snaps
   after every step, so the grid is an INVARIANT rather than something set once
   and eroded. One door: if a body's position is written anywhere, it lands on a
   cell.
2. A MAN MOVES EXACTLY ONE CELL, and only to one of the same eight neighbours
   the player uses. The scorer is untouched -- it still wants angles, still keeps
   its standoff, still pushes an objective -- it just has to express all of that
   in legal moves like everybody else.
3. THE PLAYER'S CELL IS HIS. Occupancy stops being a 0.6-tile fudge and becomes
   what the law always said: one body per cell, checked as integers.

WHAT THIS DELIBERATELY DOES NOT TOUCH: the dial, the beat, the guns, the way out.
This is the substrate under all of them. Ranges (V160) are already tile-counted
and become exactly countable now rather than approximately.

--------------------------------------------------------------------------
ON THE RF4 SPEC
--------------------------------------------------------------------------
The 8/16 law says LAB owns the teardown spec and COMBAT builds from it. THE SPEC
STILL DOES NOT EXIST, and he has now said, twice and in his own words, to go
(8/16: "look up rogue fable four weapon ranges please for the love of God";
8/17: "we really need this shit to play exactly like rogue fable four right
now"). NEWEST DATE WINS and a direct instruction outranks a routing note.
Nothing here is a copied RF4 mechanic in any case -- a tile grid is the format
every roguelike since 1980 is written in, and this is Bohemia's own movement law
(OCCUPANCY, one body per cell) finally applied to the bodies it names.

REUSE CHECK: cooks NO graphic pixels. Reuses the player's own DIRS offsets, the
existing pressScore, and worldShift's existing walk over world objects. Nothing
authored, no bank opened, no second movement system.

TASTE CHECK: authors no art. The taste rule is his: "play exactly like rogue
fable four." The restraint is that NOTHING about the fight's content changes --
same men, same guns, same dial. They just stand on tiles now, which is the thing
that makes a board readable.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): authors no rig geometry, touches no clip,
  no joint and no painted region.
  built on: the BAKED package
  joints: none
  parts: none
"""
import re, sys, base64, pathlib

ALPHA = pathlib.Path(__file__).resolve().parents[1] / 'slices' / 'BOHEMIA_ALPHA_0_9.html'
MARK = 'V162 THE FIGHT IS ON THE GRID'
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
        print('v162 already in; nothing to do')
        return

    # ---- 1. the grid itself -------------------------------------------
    old = """function worldShift(vx,vy){"""
    new = """/* ===== V162 THE FIGHT IS ON THE GRID ==========================
   Paolo 8/17: "we really need this shit to play exactly like rogue fable four
   right now."
   MEASURED FIRST, and it is the whole answer. Twenty arenas:
     COVER on an integer tile:  1405 / 1405
     BODIES on an integer tile:    16 / 160
     enemy moves: median 1.80 tiles, and 0 of 64 were exactly one tile
   *** THE BOARD IS A PERFECT TILE GRID AND THE PEOPLE WERE FLOATING OVER IT. ***
   That is not a feel problem, it is an arithmetic one. A roguelike is playable
   because you can COUNT -- he is four tiles away, my gun reaches twelve, if I
   step back he steps forward. None of that exists when a man is at 7.34 tiles
   and slides 1.80 a turn, so positioning collapses into vibes and the only
   honest strategy left is sit still and shoot, which is what he has reported
   all week.
   THE PLAYER WAS ALREADY RIGHT: his step is v[0]*1, v[1]*1 over eight unit
   offsets, "full tile steps, diagonals included". Only the enemies were never
   held to it.
   ONE DOOR: snapping lives in worldShift and in the spawn, so a body's position
   cannot be written anywhere without landing on a cell. An invariant, not a
   one-time tidy-up. */
function cellOf(o){ if(!o||o.ea==null||o.edist==null)return [0,0];
  return [Math.round(Math.cos(o.ea)*o.edist), Math.round(Math.sin(o.ea)*o.edist)]; }
function putCell(o,cx,cy){ if(!o)return;
  o.edist=Math.hypot(cx,cy); o.ea=Math.atan2(cy,cx); }
/* THE PLAYER'S CELL IS HIS. Occupancy stops being a 0.6-tile fudge and becomes
   what OCCUPANCY LAW always said: one body per cell. A man shoved onto the
   origin is pushed to the nearest free ring instead of standing inside him. */
function snapBody(o){ if(!o)return;
  var c=cellOf(o), cx=c[0], cy=c[1];
  if(cx===0&&cy===0){ var a=(o.ea==null)?0:o.ea;
    cx=Math.round(Math.cos(a))||1; cy=Math.round(Math.sin(a));
    if(cx===0&&cy===0)cx=1; }
  putCell(o,cx,cy); }
function snapAllBodies(){ for(var i=0;i<(G.e||[]).length;i++){ var e=G.e[i];
  if(e&&!e.dead)snapBody(e); } }
function worldShift(vx,vy){"""
    js = subN(js, old, new)

    # keep it an invariant: every world move re-snaps the bodies
    old = """  if(Array.isArray(G.drops))for(const d of G.drops)mv(d,0.02);   /* V157: rounds stay on the tile they fell on -- if they moved with him there would be nothing to walk to */"""
    new = """  if(Array.isArray(G.drops))for(const d of G.drops)mv(d,0.02);   /* V157: rounds stay on the tile they fell on -- if they moved with him there would be nothing to walk to */
  try{ snapAllBodies(); }catch(_e){}   /* V162: the grid is an INVARIANT -- a step never leaves a man half on a tile */"""
    js = subN(js, old, new)

    # ---- 2. spawn on cells --------------------------------------------
    old = """    e.beatOffset=Math.round((i/Math.max(1,N))*cycBeats());                    // stagger by whole beats so windows interleave on the grid
    G.e.push(e); }"""
    new = """    e.beatOffset=Math.round((i/Math.max(1,N))*cycBeats());                    // stagger by whole beats so windows interleave on the grid
    /* V162: HE SPAWNS ON A CELL. The band above still picks the distance -- it
       just stops being irrational. Measured before this: 16 of 160 bodies were
       on a tile, against 1405 of 1405 rocks. */
    try{ snapBody(e); }catch(_e){}
    G.e.push(e); }"""
    js = subN(js, old, new)

    # ---- 3. a man moves exactly one cell ------------------------------
    old = """    for(const off of [-0.9,-0.62,-0.38,-0.18,0,0.18,0.38,0.62,0.9]){
      for(const gain of [0,PRESS_STEP*0.5,PRESS_STEP]){
        const r=Math.max(standoff,e.edist-gain), a=e.ea+off;
        const nx=Math.cos(a)*r, ny=Math.sin(a)*r;
        if(Math.hypot(nx-ex,ny-ey)>PRESS_STEP*1.02)continue;   /* further than a turn's walk */
        if(Math.hypot(nx,ny)<standoff-0.01)continue;           /* he keeps his distance unless he is running past */"""
    new = """    /* ===== V162 ONE CELL, AND THE SAME EIGHT THE PLAYER USES =====
       This used to sweep NINE BEARING OFFSETS x THREE RADII and land wherever
       the trigonometry fell -- measured, a median move of 1.80 tiles and not one
       move in sixty-four that was exactly a tile. A man who slides 1.8 tiles on
       an arbitrary bearing cannot be counted, blocked, or planned against.
       THE SCORER IS UNTOUCHED. It still wants an angle, still keeps its
       standoff, still pushes an objective -- it just has to say all of it in
       legal moves, like the player has always had to. */
    const _c=cellOf(e);
    for(const off of PRESS_CELLS){
      {
        const nx=_c[0]+off[0], ny=_c[1]+off[1];
        if(nx===0&&ny===0)continue;                            /* OCCUPANCY: his cell is his */
        if(Math.hypot(nx,ny)<standoff-0.01)continue;           /* he keeps his distance unless he is running past */"""
    js = subN(js, old, new)

    old = """  const standoff=G.hold?HOLD_PASS:PRESS_STANDOFF;"""
    new = """  const standoff=G.hold?HOLD_PASS:PRESS_STANDOFF;
  /* the eight neighbours plus standing still -- byte for byte the offsets the
     player's own doMove uses, so both sides of the fight move in one vocabulary */
  const PRESS_CELLS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];"""
    js = subN(js, old, new)

    # the extra straight-line candidates a defence offers must be cells too
    old = """    if(G.hold){ const h=pXY(G.hold), dx=h[0]-ex, dy=h[1]-ey, L=Math.hypot(dx,dy)||1;
      for(const g of [PRESS_STEP,PRESS_STEP*0.6])extra.push([ex+dx/L*g,ey+dy/L*g]); }"""
    new = """    if(G.hold){ const h=pXY(G.hold), dx=h[0]-ex, dy=h[1]-ey, L=Math.hypot(dx,dy)||1;
      /* V162: the straight line at the objective is a CELL step too -- the sign
         of each axis, which is exactly how a body walks a diagonal on a grid. */
      const _c0=cellOf(e);
      extra.push([_c0[0]+Math.sign(Math.round(dx)), _c0[1]+Math.sign(Math.round(dy))]); }"""
    js = subN(js, old, new)

    # and the landing is a cell, not a float
    old = """    e.edist=Math.max(G.hold?HOLD_PASS:PRESS_STANDOFF,nd); e.ea=Math.atan2(p.y,p.x);"""
    new = """    /* V162: he lands ON the cell he chose. The old standoff clamp pushed him to a
       fractional radius and put him back off the grid the moment he moved. */
    putCell(e,Math.round(p.x),Math.round(p.y)); snapBody(e);"""
    js = subN(js, old, new)

    # ---- 4. and the constant the slide used is DEAD, so it goes -------
    old = """const PRESS_STEP=1.8;        /* a bounding advance, shorter than a panic scramble [DIAL] */"""
    new = """/* V162: PRESS_STEP IS GONE. It was how far a man slid in a turn, and a cell
   move has no use for it -- leaving it declared and unread is the exact
   present-and-dead shape that cost this project inMyRange and the damage faces.
   A dead dial is worse than no dial: the next session tunes it and nothing
   happens. */"""
    js = subN(js, old, new)

    enc = base64.b64encode(js.encode()).decode()
    ALPHA.write_text(html[:m.start()] + m.group(1) + enc + m.group(3) + html[m.end():])
    print('v162: bodies are on the grid -- %d chars' % len(js))


if __name__ == '__main__':
    main()
