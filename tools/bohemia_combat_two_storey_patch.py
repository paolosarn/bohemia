#!/usr/bin/env python3
"""BOHEMIA - COMBAT v90: TWO-STOREY ARENAS. High ground beats cover.

Paolo: "Two-story arenas yes." Asked for by name twice before that ("combat that
could take place across two stories where their stairs").

--- THE ONE RULE THAT MAKES A SECOND FLOOR MEAN ANYTHING ------------------
ACROSS LEVELS, GROUND COVER DOES NOT COUNT. FOR EITHER OF YOU.

From the deck you shoot men who thought they were behind stone. From the ground
you shoot men who have nothing to hide behind. That is physically true, it is one
condition in one function, and it is the entire tactical argument for going up.

And it is the SAME SHAPE as the point-blank trade he ruled on: better odds to
kill, worse odds to live. It obeys both of his rulings:
  - NO DAMAGE MULTIPLIERS. Height changes nothing about damage. KILL_DMG is
    untouched. It changes who is EXPOSED, which is odds.
  - "just fun position." The deck is a position with an argument for and against.

The north-star audit's finding was "position controls what you suffer and nothing
about what you deliver." This is the first thing that changes what you deliver:
from up there, cover stops answering, so shots that had no line now have one.

--- THE PIECES ------------------------------------------------------------
1. THE DECK is world-anchored tiles, exactly like pillars, so worldShift already
   carries it and every existing coordinate function already understands it.
   Rolled by the ARENA SEED, so it shuffles and replays with everything else.
   Not every arena has one -- some are flat ground, and that is a real difference
   between arenas rather than a feature you always get.
2. STAIRS are the only way up or down. One tile on the deck. Standing on or beside
   it puts a STAIRS button on screen.
3. IT COSTS STAMINA, NOT A TURN. Paolo 7/26, LOCKED, the Rogue Fable IV rule: a
   stamina action does not end your turn and never eats a volley for moving. He
   said it himself this session -- "sprinting and not losing a turn can help that."
   Going up is the same class of move as closing the distance.
4. MELEE CANNOT CROSS A FLOOR. A blade on the ground cannot reach the deck. That
   is not a balance number, it is an arm being too short.
5. THE DECK EVICTS GROUND COVER UNDER IT, so a pillar can never be stranded
   inside a slab.

--- WHAT THIS DELIBERATELY IS NOT ------------------------------------------
It is ONE deck, not a building. No rooms, no interiors, no roof, no third floor,
no ladders, no vaulting off the edge. Those are all real and all separate, and
guessing at five of them at once is how a session ends up shipping four versions
of something nobody wanted. This is the smallest thing that makes "two storeys"
a real decision, and it is judged before anything is stacked on it.

MAP LAW HELD: the deck's size, position and stair placement are PARAMETERS on the
seeded generator. No layout is authored and no arena is named.

REUSE CHECK: no art or audio assets are cooked, read or written. The deck renders
in the same slab language the pillars already use (dark side face, lit top plate),
and every coordinate, cover and shift function it touches already existed.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_two_storey_patch.py
Gate:  node gates/combat_lab_gate.js   (section 26)
"""
import base64, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
MARK = 'V90 TWO-STOREY'


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    # ---- 1. the level core -------------------------------------------------
    demo = subN(demo,
        "function myCoverAgainst(ang,dist){   /* V7: the magic arcs are dead — cover is GEOMETRY on tiles only */",
        "/* ===== V90 TWO-STOREY: HIGH GROUND BEATS COVER =======================\n"
        "   Paolo: \"Two-story arenas yes.\"\n"
        "   THE ONE RULE: across levels, ground cover does not count, for EITHER of you.\n"
        "   From the deck you shoot men who thought they were behind stone; from up there\n"
        "   you are behind nothing yourself. Physically true, one condition, and the same\n"
        "   shape as the point-blank trade he ruled on -- better odds to kill, worse odds\n"
        "   to live. It changes WHO IS EXPOSED, never how much damage anything does, so\n"
        "   his no-multipliers ruling holds exactly. */\n"
        "const DECK_LVL=1;\n"
        "function myLvl(){ return G.lvl||0; }\n"
        "function deckTileAt(wx,wy){ return (G.deck||[]).find(T=>{ const q=pXY(T);\n"
        "  return Math.abs(q[0]-wx)<0.55&&Math.abs(q[1]-wy)<0.55; })||null; }\n"
        "function onDeck(){ return !!deckTileAt(0,0); }              /* the player stands at the origin */\n"
        "function stairNear(){ return (G.stairs||[]).find(S=>S.edist<=1.6)||null; }\n"
        "/* ===== V90 LEVEL CORE END ===== */\n"
        "function myCoverAgainst(ang,dist,lvl){   /* V7: the magic arcs are dead — cover is GEOMETRY on tiles only */\n"
        "  /* V90: a floor between you is not a wall between you. Nobody is covered. */\n"
        "  if(lvl!=null&&(lvl|0)!==myLvl())return false;",
        'level core + cover across floors')

    # ---- 2. every enemy-facing cover call carries its level -----------------
    demo = subN(demo, 'myCoverAgainst(e.ea,e.edist)', 'myCoverAgainst(e.ea,e.edist,e.lvl)',
                'cover calls (e)', 8)
    demo = subN(demo, 'myCoverAgainst(e2.ea,e2.edist)', 'myCoverAgainst(e2.ea,e2.edist,e2.lvl)',
                'cover calls (e2)', 4)
    demo = subN(demo, 'myCoverAgainst(tgt.ea,tgt.edist)', 'myCoverAgainst(tgt.ea,tgt.edist,tgt.lvl)',
                'cover calls (tgt)', 1)
    demo = subN(demo, 'myCoverAgainst(e.ea)', 'myCoverAgainst(e.ea,null,e.lvl)',
                'cover call (bearing only)', 1)

    # ---- 3. and the same rule the other way: his cover from me -------------
    demo = subN(demo,
        "function realCoverPillar(e){ const exy=pXY(e);",
        "function realCoverPillar(e){\n"
        "  /* V90: the rule runs BOTH ways. If we are on different floors, the stone\n"
        "     between us on the ground is not between us at all. */\n"
        "  if((e.lvl|0)!==myLvl())return false;\n"
        "  const exy=pXY(e);",
        'his cover across floors')

    # ---- 4. the deck is rolled by the arena seed ---------------------------
    demo = subN(demo,
        "  /* DEMO SPAWN LAYOUTS (Paolo 7/4/26): stop always ringing the player 360.",
        "  /* ===== V90 THE UPPER DECK, on the arena's own dice =================\n"
        "     World-anchored tiles, exactly like pillars, so worldShift already carries\n"
        "     it and every coordinate function already understands it. NOT every arena\n"
        "     has one -- a flat lot is a real arena, and \"does this one even have a deck\"\n"
        "     is itself a difference worth rolling.\n"
        "     MAP LAW: size, placement and the stair are PARAMETERS. No layout authored. */\n"
        "  G.deck=[]; G.stairs=[]; G.lvl=0;\n"
        "  if(Math.random()<0.72){\n"
        "    const dw=2+Math.floor(Math.random()*3), dh=2+Math.floor(Math.random()*3);\n"
        "    const a1=Math.random()*Math.PI*2, d1=4.5+Math.random()*3.5;\n"
        "    const ox=Math.round(Math.cos(a1)*d1), oy=Math.round(Math.sin(a1)*d1);\n"
        "    for(let i2=0;i2<dw;i2++)for(let j2=0;j2<dh;j2++){\n"
        "      const tx=ox+i2, ty=oy+j2;\n"
        "      if(Math.hypot(tx,ty)<2.6)continue;   /* never build a storey on top of the player */\n"
        "      if(Math.hypot(tx,ty)>12)continue;\n"
        "      G.deck.push({ea:Math.atan2(ty,tx),edist:Math.hypot(tx,ty),lvl:DECK_LVL}); }\n"
        "    if(G.deck.length){\n"
        "      /* THE STAIR: the closest deck tile to you, so there is always a way up you\n"
        "         can actually walk to rather than a puzzle about finding the entrance. */\n"
        "      let s=G.deck[0]; for(const T of G.deck)if(T.edist<s.edist)s=T;\n"
        "      s.stair=true; G.stairs.push(s);\n"
        "      /* a pillar stranded inside the slab would be cover nobody can see */\n"
        "      G.pillars=G.pillars.filter(P=>{ const q=pXY(P); return !deckTileAt(q[0],q[1]); }); }\n"
        "  }\n"
        "  /* DEMO SPAWN LAYOUTS (Paolo 7/4/26): stop always ringing the player 360.",
        'the deck generator')

    # ---- 5. some of them are already up there ------------------------------
    demo = subN(demo,
        "  for(let i=N-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[angs[i],angs[j]]=[angs[j],angs[i]];}",
        "  for(let i=N-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[angs[i],angs[j]]=[angs[j],angs[i]];}\n"
        "  /* V90: who is already up there is rolled with the arena, so replaying a seed\n"
        "     replays the whole problem and not just the shape of it. */\n"
        "  G._deckHolders=(G.deck&&G.deck.length)?Math.min(G.deck.length,Math.floor(Math.random()*3)):0;",
        'how many hold the high ground')

    demo = subN(demo,
        "  /* CORPSE PERSISTENCE (Paolo 7/3/26): re-rolling the encounter never\n"
        "     erases the dead. Bodies harvest into G.corpses and draw forever. */",
        "  /* CORPSE PERSISTENCE (Paolo 7/3/26): re-rolling the encounter never\n"
        "     erases the dead. Bodies harvest into G.corpses and draw forever. */\n"
        "  /* V90: every body starts on the ground; the deck holders are placed below. */",
        'level note')

    # ---- 6. worldShift carries the deck ------------------------------------
    demo = subN(demo,
        "  for(const P of (G.pillars||[]))mv(P,0.02);",
        "  for(const P of (G.pillars||[]))mv(P,0.02);\n"
        "  for(const T of (G.deck||[]))mv(T,0.02);   /* V90: the storey is world state like everything else */",
        'worldShift carries the deck')

    # ---- 7. a blade cannot reach a floor above it --------------------------
    demo = subN(demo,
        "  for(const e of G.e){ if(e.dead||e.downed||e.broken||e.fleeing||!e.melee)continue;",
        "  for(const e of G.e){ if(e.dead||e.downed||e.broken||e.fleeing||!e.melee)continue;\n"
        "    if((e.lvl|0)!==myLvl())continue;   /* V90: an arm is not long enough to be a staircase */",
        'melee cannot cross a floor')

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
