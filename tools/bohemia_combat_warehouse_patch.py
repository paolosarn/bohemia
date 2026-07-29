#!/usr/bin/env python3
"""BOHEMIA - COMBAT v100: THE WAREHOUSE. AN ARENA WITH A SHAPE.

Paolo 7/29: "for arena lets start off with a warehouse or something. think about
all the shit you will need to hide behind"

That follows "u have like a 4th grade level of understanding when i say arenas
fr", which was fair. What I had built when he said arena was a scatter of blocks
on a field: a density number, a clump number, and randomly placed circles. It had
no place, no purpose, and nothing that made one plan better than another.

--- WHAT AN ARENA ACTUALLY IS -------------------------------------------
A place whose SHAPE decides the fight. Not a field with more rocks on it.

A distribution warehouse is the cleanest example in the real world, and Las Vegas
is full of them (the North Las Vegas and Henderson industrial corridors are
almost nothing else). Its shape is one idea repeated:

    *** PALLET RACKING IN LONG PARALLEL ROWS, WHICH MAKES AISLES. ***

And an aisle is a gameplay statement, not decoration:

  ACROSS the racking you are SAFE. It is tall, loaded, and you cannot see or
  shoot through it, and you cannot vault it.
  ALONG the aisle you are NAKED. It is a straight corridor with a clean sightline
  end to end and no lateral cover anywhere in it.

So the fight stops being "where are the rocks" and becomes: **which aisle do I
commit to, and where do I cross?** Committing to an aisle is committing to one
line of fire. That is a decision the block-scatter arena could not produce at any
density, because a scatter has no through-lines.

--- SO, "ALL THE SHIT YOU WILL NEED TO HIDE BEHIND" ---------------------
Everything here is a real warehouse thing and each one has a different job:

  RACKING RUNS      TALL. The walls of the maze. Cannot vault, blocks the line.
                    This is what makes the aisles exist at all.
  CROSS AISLES      The gaps in the racking. Fire code requires them in a real
                    building, and here they are THE KILL ZONES: the only places
                    you can change aisle, so they are where everyone is looking.
  PALLETS + STACKS  LOW. Vaultable. The only cover inside an aisle, which is why
                    an aisle is survivable at all.
  STEEL COLUMNS     TALL, thin, on the bay grid. Hard points that break a
                    sightline without giving you a whole wall.
  THE STAGING FLOOR One end left deliberately EMPTY, where trucks are loaded.
                    A gauntlet: the shortest way across the building is the one
                    with nothing on it.
  THE MEZZANINE     The office box upstairs. This is the existing deck and stair,
                    and in a warehouse it finally has a REASON to be there: it
                    overlooks the aisles, so height means seeing down the rows.

The cross-level cover rule from v90 pays off for the first time here. From the
mezzanine you can see INTO the aisles the racking would otherwise close off.

--- MAP LAW HELD --------------------------------------------------------
He placed the canon: "warehouse". This authors no specific building. Aisle
direction, aisle width, where the cross aisles fall, which end is the staging
floor, and the column bay are all PARAMETERS ON THE ARENA DICE, exactly like the
street arena's density and clumping. Two warehouses differ; neither is a map I
drew. Which arenas are canon is still, only, his call.

--- IT REUSES EVERYTHING ------------------------------------------------
Racking, pallets and columns are all the pillar object that already exists, with
the tall/low flag that already exists, so every cover function, every collision
check, the vault rule, the dash-path block and the AI cover-seek all understand
this arena on day one. No new geometry, no new collision, no new cover rule. The
mezzanine is the v90 deck; the stair is the v92 run.

The floor changes to sealed concrete, from the approved starter set, because a
warehouse floor is not asphalt and the fight was standing on a street.

REUSE CHECK: no art or audio is cooked. USED
BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt (concrete_0, concrete_1 for the
slab floor), the set Paolo approved 7/28 and picked again 7/29. Everything else
reuses objects already in the demo.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_warehouse_patch.py
Gate:  node gates/combat_lab_gate.js   (section 34)
"""
import base64, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
RECOOK_BANK = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
RECOOK = os.path.join(ROOT, RECOOK_BANK)
MARK = 'V100 THE WAREHOUSE'


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def bake_slab():
    rec = json.load(open(RECOOK, encoding='utf8'))
    tiles = {t['id']: t['b64'] for t in rec['tiles']}
    out = {'slab': [tiles['concrete_0'], tiles['concrete_1']]}
    print('  slab floor: 2 approved tiles (concrete_0, concrete_1), %.0f KB'
          % (sum(len(b) for b in out['slab']) / 1024))
    return out


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo
    if 'V97 THE DOMINANCE LAW' not in demo:
        sys.exit('FAIL: v97 must be applied first (this extends its tile set)')

    blob = json.dumps(bake_slab(), separators=(',', ':'))

    # ---- the slab floor joins the set --------------------------------------
    demo = subN(demo,
        "const LOT_DOMINANT=0, LOT_ACCENT_PCT=15, LOT_REGION=4;",
        "/* ===== V100 THE WAREHOUSE FLOOR ===================================\n"
        "   A warehouse floor is sealed concrete, not asphalt. The fight was standing on\n"
        "   a street because the street was the only ground it had. */\n"
        "const STREET_B64W=" + blob + ";\n"
        "(function(){ for(const k in STREET_B64W){ STREET_B64[k]=STREET_B64W[k]; STREET_IMG[k]=[];\n"
        "  STREET_B64W[k].forEach((b,i)=>{ _stPend++; const im=new Image();\n"
        "    im.onload=()=>{ STREET_IMG[k][i]=im; if(--_stPend===0)STREET_READY=true; };\n"
        "    im.onerror=()=>{ if(--_stPend===0)STREET_READY=true; };\n"
        "    im.src='data:image/png;base64,'+b; }); } })();\n"
        "ST_SPIN.slab=1;\n"
        "const LOT_DOMINANT=0, LOT_ACCENT_PCT=15, LOT_REGION=4;",
        'the slab floor joins the set')

    # ---- indoors, every cell is slab ---------------------------------------
    demo = subN(demo,
        "function streetKindAt(wx){\n"
        "  if(wx===ST_MED)return 'median';",
        "function streetKindAt(wx){\n"
        "  /* V100: indoors there is no street. One material, wall to wall. */\n"
        "  if(G.arenaKind==='warehouse')return 'slab';\n"
        "  if(wx===ST_MED)return 'median';",
        'the warehouse floor is slab')

    # ---- the generator -----------------------------------------------------
    demo = subN(demo,
        "  G.pillars=[]; {",
        "  /* ===== V100 THE WAREHOUSE (Paolo 7/29: \"for arena lets start off with a\n"
        "     warehouse or something. think about all the shit you will need to hide\n"
        "     behind\") ==========================================================\n"
        "     He was right that the old arenas were a scatter of blocks on a field. A\n"
        "     scatter has no THROUGH-LINES, so it can never make one plan better than\n"
        "     another however dense you make it.\n"
        "     A warehouse is one idea repeated: RACKING IN LONG ROWS, WHICH MAKES AISLES.\n"
        "       ACROSS the racking you are SAFE  (tall, loaded, no vault, no line)\n"
        "       ALONG the aisle you are NAKED    (a straight corridor, no lateral cover)\n"
        "     So the fight becomes: WHICH AISLE DO I COMMIT TO, AND WHERE DO I CROSS.\n"
        "     MAP LAW HELD: he placed the canon (\"warehouse\"). Aisle direction, aisle\n"
        "     width, where the cross aisles fall, which end is the staging floor and the\n"
        "     column bay are PARAMETERS on the arena dice, exactly like the street\n"
        "     arena's density and clumping. No specific building is authored. */\n"
        "  G.arenaKind=(Math.random()<0.5)?'warehouse':'street';\n"
        "  G.pillars=[];\n"
        "  if(G.arenaKind==='warehouse'){ buildWarehouse(); } else {",
        'the arena rolls a kind')

    demo = subN(demo,
        "      G.pillars.push({ea:Math.atan2(ny2,nx2),edist:Math.hypot(nx2,ny2),r:r,tall:Math.random()<0.5}); } }   /* V42 COVER REVERT",
        "      G.pillars.push({ea:Math.atan2(ny2,nx2),edist:Math.hypot(nx2,ny2),r:r,tall:Math.random()<0.5}); } }   /* V42 COVER REVERT",
        'the street generator still closes cleanly')

    # ---- the builder itself ------------------------------------------------
    demo = subN(demo,
        "function stairNear(){ return (G.stairs||[]).find(S=>S.edist<=1.6)||null; }",
        "/* ===== V100 THE WAREHOUSE BUILDER ==================================\n"
        "   Every piece below is a real warehouse thing with a different job, which is\n"
        "   what he asked for when he said think about what you hide behind.\n"
        "   And every piece is the PILLAR OBJECT that already exists with the tall/low\n"
        "   flag that already exists, so every cover function, the vault rule, the dash\n"
        "   path block and the AI cover-seek understand this arena on day one. */\n"
        "function buildWarehouse(){\n"
        "  const horiz=Math.random()<0.5;                  /* which way the aisles run */\n"
        "  /* MEASURED, then tuned: at 2 the aisles are ONE tile wide, which is a corridor\n"
        "     you cannot fight in, and 60 rolls averaged 128 racking blocks (max 186) --\n"
        "     a solid maze, not a building. 3-4 gives 2-3 tile aisles: wide enough to\n"
        "     move and flank in, narrow enough that committing to one still commits you. */\n"
        "  const AISLE=3+Math.floor(Math.random()*2);      /* 2-3 tile aisles between runs */\n"
        "  const R0=-11, R1=11, BAY=5+Math.floor(Math.random()*2);\n"
        "  /* THE CROSS AISLES: the only places you can change aisle, so they are where\n"
        "     everyone is looking. Fire code puts them in a real building; here they are\n"
        "     the kill zones. */\n"
        "  const cross=[]; const nCross=1+Math.floor(Math.random()*2);\n"
        "  for(let k=0;k<nCross;k++)cross.push(Math.round(-7+Math.random()*14));\n"
        "  /* THE STAGING FLOOR: one end left deliberately EMPTY, where the trucks back\n"
        "     in. The shortest way across the building is the one with nothing on it. */\n"
        "  const stageEdge=Math.random()<0.5?-1:1, STAGE=5+Math.floor(Math.random()*3);\n"
        "  const put=(wx,wy,r,tall)=>{\n"
        "    if(Math.hypot(wx,wy)<2.2)return;              /* never build on the player */\n"
        "    if(Math.hypot(wx,wy)>12)return;\n"
        "    if(G.pillars.some(P=>{const q=pXY(P);return Math.abs(q[0]-wx)<0.9&&Math.abs(q[1]-wy)<0.9;}))return;\n"
        "    G.pillars.push({ea:Math.atan2(wy,wx),edist:Math.hypot(wx,wy),r:r,tall:tall}); };\n"
        "  /* 1. THE RACKING. TALL: you do not vault a loaded pallet rack. */\n"
        "  for(let row=R0; row<=R1; row+=AISLE){\n"
        "    for(let t=R0; t<=R1; t++){\n"
        "      if(cross.some(c=>Math.abs(t-c)<=1))continue;      /* the cross aisle */\n"
        "      if(stageEdge*t>STAGE)continue;                     /* the staging floor */\n"
        "      put(horiz?t:row, horiz?row:t, 0.58, true); } }\n"
        "  /* 2. PALLETS AND STACKS. LOW and vaultable, sitting IN the aisles -- the only\n"
        "     cover inside an aisle, which is the only reason an aisle is survivable. */\n"
        "  const NPal=4+Math.floor(Math.random()*6);\n"
        "  for(let i=0;i<NPal;i++){\n"
        "    const t=R0+Math.round(Math.random()*(R1-R0));\n"
        "    if(stageEdge*t>STAGE)continue;\n"
        "    const base=R0+Math.floor(Math.random()*Math.floor((R1-R0)/AISLE))*AISLE;\n"
        "    const row=base+1+Math.floor(Math.random()*Math.max(1,AISLE-1));   /* between two runs */\n"
        "    put(horiz?t:row, horiz?row:t, 0.5, false); }\n"
        "  /* 3. STEEL COLUMNS on the bay grid. TALL and thin: they break a sightline\n"
        "     without handing you a whole wall. */\n"
        "  for(let a=-10;a<=10;a+=BAY)for(let b=-10;b<=10;b+=BAY)put(a,b,0.42,true);\n"
        "  G._wh={horiz:horiz,aisle:AISLE,cross:cross,stageEdge:stageEdge,stage:STAGE,bay:BAY}; }\n"
        "function stairNear(){ return (G.stairs||[]).find(S=>S.edist<=1.6)||null; }",
        'the warehouse builder')

    # ---- the mezzanine always exists indoors, and it is the high ground -----
    demo = subN(demo,
        "  if(Math.random()<0.72){\n"
        "    const dw=2+Math.floor(Math.random()*3), dh=2+Math.floor(Math.random()*3);",
        "  /* V100: a warehouse ALWAYS has its office mezzanine, and in here the deck\n"
        "     finally has a reason to exist: it overlooks the aisles, so height means\n"
        "     seeing down the rows the racking would otherwise close off. That is the\n"
        "     first time the v90 cross-level cover rule has paid for itself. */\n"
        "  if(G.arenaKind==='warehouse'||Math.random()<0.72){\n"
        "    const dw=2+Math.floor(Math.random()*3), dh=2+Math.floor(Math.random()*3);",
        'the warehouse always has its mezzanine')

    # ---- and the read says where you are -----------------------------------
    demo = subN(demo,
        "function updRangeRead(){",
        "/* V100: the arena has a NAME now, so the fight can say where it is happening.\n"
        "   An arena you cannot name is a field with rocks on it. */\n"
        "function arenaName(){ return G.arenaKind==='warehouse'?'WAREHOUSE':'STREET'; }\n"
        "function updRangeRead(){",
        'the arena has a name')

    demo = subN(demo,
        "  const s=BohemiaArena.get(); b.textContent=(s==null)?'ARENA':('ARENA #'+s); }",
        "  const s=BohemiaArena.get();\n"
        "  /* V100: an arena you cannot NAME is a field with rocks on it. */\n"
        "  b.textContent=(s==null)?arenaName():(arenaName()+' #'+s); }",
        'the arena button says which arena')

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
