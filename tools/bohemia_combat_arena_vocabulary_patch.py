#!/usr/bin/env python3
"""BOHEMIA - COMBAT v89: THE GENERATOR ONLY EVER MADE ONE ARENA.

Paolo, on v88: "I dont see new arenas shit was boring if u did anything"

He is right twice, and the measurement is brutal. Six arenas rolled back to back:

  seed    cover pieces   mean spread
  82077        6            6.50
  85865        5            5.79
  14984        7            5.91
  60068        7            5.99
  97040        6            6.43
  61271        7            6.70

FIVE TO SEVEN IDENTICAL ONE-TILE PEBBLES, every single time, scattered on an empty
plane at the same mean distance. That is not six arenas, it is one arena with the
dots moved. v88 gave him dice and a notebook for a generator that only makes one
thing, and then told him to go find arenas worth keeping.

    G.pillars=[]; { const NP=5+Math.floor(Math.random()*3);
      ... G.pillars.push({..., r:0.55, tall:Math.random()<0.5}); }

One count range (5-7). One radius (0.55). One placement rule (uniform scatter,
2.2-9.2 tiles out). There was never any variety to shuffle.

--- WHAT THIS CHANGES, AND WHAT IT DELIBERATELY DOES NOT --------------------
MAP LAW: Claude never designs map layouts. Plumbing only. Paolo places canon.

So this authors NO layouts and names NO arenas. It gives the generator a
VOCABULARY instead of a single brick, which is plumbing, and lets the seed decide
what to say with it. Three mechanism changes, all of them parameters:

1. DENSITY IS A REAL RANGE, NOT NOISE. 2 to 15 pieces instead of 5 to 7. Some
   arenas are open ground you have to cross; some are a warren. 5-to-7 is a
   rounding error the eye cannot see, and that is exactly what he could not see.

2. COVER HAS A SIZE. r was 0.55 for every piece ever placed. Now 0.45 to 1.15, so
   a lot is a crate you duck behind and a lot is a block you have to go around.
   The existing cover maths already scales off P.r everywhere (myCoverAgainst,
   realCoverPillar, segNear, the dash-path block), so nothing needed rewriting --
   the number was simply never allowed to vary.

3. PIECES CLUSTER INTO RUNS. A share of them place ADJACENT to an existing piece
   instead of at a fresh random spot, so WALLS and CORNERS emerge out of the same
   circle maths that already ships. No new geometry, no new collision, no new
   cover rule: a wall is three pillars in a row, and every existing function
   already understands three pillars in a row.

That last one is the important one for his north star. A scatter of dots gives you
one positioning question (is a dot between me and him). A wall gives you a LANE,
and a corner gives you something to round -- which is the first time the ground
has ever argued for approaching from a particular side.

--- AND THE THING HE LITERALLY SAID: "I DON'T SEE" --------------------------
The button rendered as "ARENA" with no number until the first tap, because
updArenaBtn only ever ran inside the click handler. So the one control that was
supposed to advertise itself sat in a row of eleven buttons saying nothing. It now
rolls and labels itself on startup: ARENA #82077, before he touches anything.

REUSE CHECK: no art or audio assets are cooked, read or written. Three parameters
and one clustering branch inside the existing pillar loop, plus one startup call.

Every replacement asserts its anchor exists EXACTLY ONCE. Idempotent.

Usage: python3 tools/bohemia_combat_arena_vocabulary_patch.py
Gate:  node gates/combat_lab_gate.js   (section 25)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V89 THE GENERATOR GETS A VOCABULARY'


def sub1(src, old, new, tag):
    n = src.count(old)
    if n != 1:
        sys.exit('FAIL anchor [%s]: found %d times (want 1)' % (tag, n))
    return src.replace(old, new, 1)


NEW_GEN = r"""  /* ===== V89 THE GENERATOR GETS A VOCABULARY ==========================
     Paolo on v88: "I dont see new arenas shit was boring if u did anything."
     MEASURED, six arenas back to back: 6,5,7,7,6,7 pieces, mean spread 5.79-6.70.
     One count range, one radius (0.55 for every piece ever placed), one placement
     rule. That is ONE arena with the dots moved, and no seed can shuffle variety
     that does not exist.
     MAP LAW HELD: this authors no layout and names no arena. It hands the
     generator a VOCABULARY instead of a single brick and lets the SEED decide
     what to say -- density, size and clustering are parameters, which is plumbing.
     Which arenas are canon is still, only, his call. */
  G.pillars=[]; {
    /* 1. DENSITY IS A REAL RANGE. 2-15, not 5-7. Open ground you have to cross,
          or a warren. 5-to-7 is a rounding error the eye cannot see. */
    const NP=2+Math.floor(Math.random()*14);
    /* 2. this arena's own character, rolled once: how big its cover runs and how
          much of it clumps. Two numbers, so two arenas can differ in KIND. */
    const bulk=0.45+Math.random()*0.70;          /* the size of a typical piece */
    const clump=Math.random();                   /* how much of it forms runs */
    let pg=0;
    while(G.pillars.length<NP&&pg++<240){
      let nx2,ny2;
      /* 3. PIECES CLUSTER INTO RUNS. Placing adjacent to an existing piece is how
            a WALL or a CORNER emerges out of the same circle maths that already
            ships -- three pillars in a row IS a wall, and every cover function in
            the demo already understands three pillars in a row. No new geometry,
            no new collision, no new cover rule. */
      const seedP=(G.pillars.length&&Math.random()<clump*0.8)
        ? G.pillars[Math.floor(Math.random()*G.pillars.length)] : null;
      if(seedP){ const q=pXY(seedP);
        const dirs=[[1,0],[-1,0],[0,1],[0,-1]], d=dirs[Math.floor(Math.random()*4)];
        nx2=Math.round(q[0]+d[0]); ny2=Math.round(q[1]+d[1]); }
      else { const a0=Math.random()*Math.PI*2, d0=2.2+Math.random()*7.5;
        nx2=Math.round(Math.cos(a0)*d0); ny2=Math.round(Math.sin(a0)*d0); }
      if(Math.hypot(nx2,ny2)<1.5)continue;
      if(Math.hypot(nx2,ny2)>11)continue;
      if(G.pillars.some(P=>{ const q=pXY(P); return Math.abs(q[0]-nx2)<0.9&&Math.abs(q[1]-ny2)<0.9; }))continue;
      /* the radius was 0.55 for every piece ever placed. The cover maths already
         scales off P.r everywhere it is used, so the number simply was never
         allowed to vary. A crate you duck behind, or a block you go around. */
      const r=Math.max(0.45,Math.min(1.15,bulk+(Math.random()-0.5)*0.30));
      G.pillars.push({ea:Math.atan2(ny2,nx2),edist:Math.hypot(nx2,ny2),r:r,tall:Math.random()<0.5}); } }   /* V42 COVER REVERT: cover is permanent again. V54: tall=standing (can't vault), low=ducking (vaultable) */"""


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    demo = sub1(demo,
        "  /* PILLAR V5 (Paolo): shuffled hard cover, world-anchored, reshuffled per encounter */\n"
        "  G.pillars=[]; { const NP=5+Math.floor(Math.random()*3); let pg=0;\n"
        "    while(G.pillars.length<NP&&pg++<120){\n"
        "      const a0=Math.random()*Math.PI*2, d0=2.2+Math.random()*7;\n"
        "      const nx2=Math.round(Math.cos(a0)*d0), ny2=Math.round(Math.sin(a0)*d0);   /* cover sits ON a tile (integer centers, same grid as the board) */\n"
        "      if(Math.hypot(nx2,ny2)<1.5)continue;\n"
        "      if(G.pillars.some(P=>{ const q=pXY(P); return Math.abs(q[0]-nx2)<0.9&&Math.abs(q[1]-ny2)<0.9; }))continue;\n"
        "      G.pillars.push({ea:Math.atan2(ny2,nx2),edist:Math.hypot(nx2,ny2),r:0.55,tall:Math.random()<0.5}); } }   /* V42 COVER REVERT: cover is permanent again. V54: tall=standing (can't vault), low=ducking (vaultable) */",
        "  /* PILLAR V5 (Paolo): shuffled hard cover, world-anchored, reshuffled per encounter */\n"
        + NEW_GEN,
        'the arena vocabulary')

    # --- and the thing he literally said: "I don't see" ---------------------
    demo = sub1(demo,
        "  const ab=D('arenabtn'); if(ab)ab.addEventListener('click',()=>{ audio();",
        "  /* V89 HE SAID \"I DON'T SEE NEW ARENAS\" AND THE BUTTON WAS PART OF WHY: it\n"
        "     rendered as a blank \"ARENA\" until the first tap, because updArenaBtn only\n"
        "     ever ran inside the click handler below. One control in a row of eleven,\n"
        "     saying nothing about what it was for. It now labels itself on startup. */\n"
        "  try{ if(BohemiaArena.get()==null)BohemiaArena.roll(); updArenaBtn(); }catch(_e){}\n"
        "  const ab=D('arenabtn'); if(ab)ab.addEventListener('click',()=>{ audio();",
        'the button says its number from the start')

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
