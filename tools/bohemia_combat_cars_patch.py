#!/usr/bin/env python3
"""BOHEMIA - COMBAT v103: THE CARS. 2 TILES BY 3, HIS RULING.

Paolo 7/29: "we have hella cars on file that are aproved. and when u slide a car
in it should be 2 tiles by 3 tiles so yeah"
Paolo 7/30: "I DIDNT SEE ANY CARS BRO WTF IS WRONG WITH YOU!"

He is right. That was a ruling with a size in it and I deferred it twice and then
asked him a question about it instead of building it. Built.

--- THE SHOPPING CHECK, DONE, AND IT IS A CLEAN REUSE --------------------
USED BOHEMIA_STREET_PROP_POOLS_7_18_26.txt, pool `car_wreck`, 20 items.
Its own provenance line reads: HD_TILE_REPO part2 / "10. Abandoned cars"
(top-down, the V11 bake family).

RENDERED ALL 20 AND LOOKED AT THEM before writing a line of this. They are real
top-down abandoned cars: sedans, a pickup, a cop car, every one sun-bleached and
rust-blotched, all chalky and desaturated. Exactly the Mojave failure mode
TF-CMB-003 spent a page describing (they BAKE, they do not rot). Nothing is
cooked here and nothing needs to be. TF-CMB-003 is answered by reuse.

--- HIS SIZE RULING IS THE FOOTPRINT, NOT A STRETCH ----------------------
The art is ~44 x 96 px, which on the 44px grid is 1 tile wide by 2.2 long. His
ruling is 2 x 3. So THE FOOTPRINT IS 2 x 3 TILES exactly as he said, and the
sprite is scaled by HEIGHT into it and centred, which keeps the car undistorted
instead of fattening it to fill the box. A real car does not fill its stall edge
to edge either.

--- THE ENGINEERING, AND WHY IT IS SMALL --------------------------------
I said last turn this needed rectangle maths in about five cover functions,
because pillars are circles. That was the wrong plan. THE RIGHT ONE COSTS
NOTHING:

*** A CAR IS SIX PILLAR CELLS THAT SHARE AN ID, WITH ONE SPRITE DRAWN OVER
    THEM. ***

Every cover function, the vault rule, the dash-path block, the AI cover-seek and
the occupancy check already understand a cell. So a car gets, for free:
  * rectangle blocking, because six cells IS a rectangle
  * cover along its LENGTH, because a line crossing it meets several cells --
    which is the thing a car has and a block does not
  * and the asymmetry, using the tall/low flag that already exists:
        ENGINE + CABIN cells are TALL  -> hidden to the chest, cannot vault
        BOOT cells are LOW            -> hidden to the waist, CAN vault
    ONE OBJECT WITH TWO COVER VALUES, which is exactly what makes a car more
    interesting than any block, and it needed no new geometry to say it.

No new collision, no new cover rule, no rectangle intersection code, nothing for
a future patch to get subtly wrong.

--- WHERE THEY GO -------------------------------------------------------
MAP LAW: he placed the canon ("slide a car in"). Count, position and orientation
are PARAMETERS on the arena dice, like every other arena vocabulary term.
  STREET arena: parked along the roadway, squared to the kerb, 1-3 of them.
  WAREHOUSE:    at the staging end, where a vehicle could actually have driven
                in. Never buried inside the racking.
Never on the player, never overlapping another car, and the deck filter that
already evicts cover from under a slab evicts them too.

REUSE CHECK: no art or audio is cooked, read or written.
USED BOHEMIA_STREET_PROP_POOLS_7_18_26.txt (pool car_wreck, 20 items, top-down
abandoned cars from the HD repo's "10. Abandoned cars"). Every pixel out is a
pixel in.

Every replacement asserts its anchor count EXACTLY. Idempotent.

Usage: python3 tools/bohemia_combat_cars_patch.py
Gate:  node gates/combat_lab_gate.js   (section 37)
"""
import base64, io, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
CARS_BANK = 'banks/BOHEMIA_STREET_PROP_POOLS_7_18_26.txt'
CARS = os.path.join(ROOT, CARS_BANK)
MARK = 'V103 THE CARS'
N_CARS = 8   # of the 20; enough variety, modest payload


def subN(src, old, new, tag, n=1):
    got = src.count(old)
    if got != n:
        sys.exit('FAIL anchor [%s]: found %d times (want %d)' % (tag, got, n))
    return src.replace(old, new)


def bake_cars():
    """Take the approved wrecks as they are. Only the canvas they sit on changes:
    each is centred, unstretched, inside the 2x3 tile box he ruled."""
    from PIL import Image
    pool = json.load(open(CARS, encoding='utf8'))['car_wreck'][:N_CARS]
    CELL = 44
    BOX_W, BOX_H = CELL * 2, CELL * 3          # HIS RULING: 2 tiles by 3
    out = []
    for b in pool:
        im = Image.open(io.BytesIO(base64.b64decode(b))).convert('RGBA')
        k = min(BOX_W / im.width, BOX_H / im.height)   # fit, never stretch
        w, h = max(1, int(round(im.width * k))), max(1, int(round(im.height * k)))
        sc = im.resize((w, h), Image.NEAREST)
        box = Image.new('RGBA', (BOX_W, BOX_H), (0, 0, 0, 0))
        box.alpha_composite(sc, ((BOX_W - w) // 2, (BOX_H - h) // 2))
        buf = io.BytesIO(); box.save(buf, format='PNG', optimize=True)
        out.append(base64.b64encode(buf.getvalue()).decode('ascii'))
    size = sum(len(b) for b in out)
    print('  cars: %d approved wrecks, %dx%d px each (2x3 tiles), %.0f KB'
          % (len(out), BOX_W, BOX_H, size / 1024))
    return out


def patch(demo):
    if MARK in demo:
        print('  demo: already patched, skipping')
        return demo

    blob = json.dumps(bake_cars(), separators=(',', ':'))

    # ---- the art + the loader ---------------------------------------------
    demo = subN(demo,
        "function buildWarehouse(){",
        "/* ===== V103 THE CARS (Paolo: \"when u slide a car in it should be 2 tiles by\n"
        "   3 tiles\", then \"I DIDNT SEE ANY CARS BRO\") =========================\n"
        "   The art is the approved car_wreck pool: real top-down abandoned cars, all\n"
        "   sun-bleached and rust-blotched. Nothing cooked.\n"
        "   *** A CAR IS SIX PILLAR CELLS THAT SHARE AN ID, WITH ONE SPRITE OVER THEM. ***\n"
        "   Every cover function, the vault rule, the dash-path block, the AI cover-seek\n"
        "   and the occupancy check already understand a CELL, so a car gets rectangle\n"
        "   blocking and cover-along-its-LENGTH for free -- the thing a car has that a\n"
        "   block does not. And the asymmetry rides the tall/low flag that already\n"
        "   exists: ENGINE and CABIN are TALL (hidden to the chest, no vault), the BOOT\n"
        "   is LOW (hidden to the waist, vaultable). ONE OBJECT, TWO COVER VALUES.\n"
        "   No new geometry, no rectangle intersection code, nothing for a later patch\n"
        "   to get subtly wrong. */\n"
        "const CAR_B64=" + blob + ";\n"
        "const CAR_IMG=[]; let CAR_READY=false; let _carPend=0;\n"
        "(function(){ CAR_B64.forEach((b,i)=>{ _carPend++; const im=new Image();\n"
        "  im.onload=()=>{ CAR_IMG[i]=im; if(--_carPend===0)CAR_READY=true; };\n"
        "  im.onerror=()=>{ if(--_carPend===0)CAR_READY=true; };\n"
        "  im.src='data:image/png;base64,'+b; }); })();\n"
        "const CAR_W=2, CAR_L=3;   /* HIS RULING, in tiles */\n"
        "/* place one car with its nose at (ox,oy). vert=true means it points up-screen,\n"
        "   which is how a car sits in a stall on a north-south street. */\n"
        "function putCar(ox,oy,vert,cid){\n"
        "  const cells=[];\n"
        "  for(let a=0;a<(vert?CAR_W:CAR_L);a++)for(let b=0;b<(vert?CAR_L:CAR_W);b++){\n"
        "    const wx=ox+a, wy=oy+b;\n"
        "    if(Math.hypot(wx,wy)<2.6)return false;      /* never park on the player */\n"
        "    if(Math.hypot(wx,wy)>12)return false;\n"
        "    if(G.pillars.some(P=>{const q=pXY(P);return Math.abs(q[0]-wx)<0.9&&Math.abs(q[1]-wy)<0.9;}))return false;\n"
        "    cells.push([wx,wy]); }\n"
        "  /* the far HALF along the car's length is the BOOT: low, vaultable. The near\n"
        "     half is engine and cabin: tall. That is the asymmetry, for free. */\n"
        "  const along=c=>vert?c[1]-oy:c[0]-ox, span=(vert?CAR_L:CAR_W)-1;\n"
        "  for(const c of cells){\n"
        "    const tall=along(c)<span*0.6;\n"
        "    G.pillars.push({ea:Math.atan2(c[1],c[0]),edist:Math.hypot(c[0],c[1]),\n"
        "      r:0.5,tall:tall,car:cid,carOx:ox,carOy:oy,carVert:!!vert,\n"
        "      carArt:cid%Math.max(1,CAR_B64.length)}); }\n"
        "  return true; }\n"
        "/* MAP LAW: he placed the canon. Count, position and orientation are PARAMETERS\n"
        "   on the arena dice, exactly like the racking and the cover density. */\n"
        "function scatterCars(kind){\n"
        "  const n=1+Math.floor(Math.random()*3), placed=[];\n"
        "  let guard=0, cid=1;\n"
        "  while(placed.length<n&&guard++<60){\n"
        "    let ox,oy,vert;\n"
        "    if(kind==='warehouse'){\n"
        "      /* at the staging end, where a vehicle could actually have driven in */\n"
        "      const w=G._wh||{}; const se=w.stageEdge||1, st=w.stage||6;\n"
        "      const t=Math.round(se*(st+1+Math.random()*3));\n"
        "      const row=Math.round(-8+Math.random()*16);\n"
        "      vert=!w.horiz; ox=w.horiz?t:row; oy=w.horiz?row:t;\n"
        "    } else {\n"
        "      /* parked along the roadway, squared to the kerb */\n"
        "      const side=Math.random()<0.5?ST_LANE_L-1:ST_LANE_R;\n"
        "      ox=side; oy=Math.round(-9+Math.random()*18); vert=true;\n"
        "    }\n"
        "    if(putCar(ox,oy,vert,cid)){ placed.push(cid); cid++; } }\n"
        "  G._cars=placed.length; }\n"
        "function buildWarehouse(){",
        'the cars: art, loader, placement')

    # ---- they get scattered into both arenas -------------------------------
    demo = subN(demo,
        "  G.deck=[]; G.stairs=[]; G.lvl=0;",
        "  scatterCars(G.arenaKind);   /* V103: after the cover, before the deck, so the\n"
        "                                 deck's own filter evicts any car under a slab */\n"
        "  G.deck=[]; G.stairs=[]; G.lvl=0;",
        'cars are scattered into both arenas')

    # ---- and the block draw hands car cells over to the sprite -------------
    demo = subN(demo,
        "  for(const P of (G.pillars||[])){ const pp=fieldPos(P,W,H,cx,cy), pxs=pp[0], pys=pp[1];\n"
        "    const s=ring*0.62;   /* a block fills its tile */",
        "  /* V103: a car's six cells are covered by ONE sprite, drawn once from its nose\n"
        "     cell. The other five draw nothing -- they are still real cover, they just\n"
        "     are not blocks. */\n"
        "  for(const P of (G.pillars||[])){\n"
        "    if(P.car){\n"
        "      const q0=pXY(P);\n"
        "      if(Math.abs(q0[0]-P.carOx)>0.01||Math.abs(q0[1]-P.carOy)>0.01)continue;   /* only the nose cell draws */\n"
        "      const im=CAR_READY?CAR_IMG[P.carArt|0]:null;\n"
        "      const wq=P.carVert?CAR_W:CAR_L, hq=P.carVert?CAR_L:CAR_W;\n"
        "      const p0=fieldPos(P,W,H,cx,cy);\n"
        "      const bw=ring*wq, bh=ring*hq;\n"
        "      const bx=p0[0]-ring*0.5, by=p0[1]-ring*0.5;\n"
        "      x.fillStyle='rgba(0,0,0,0.30)';\n"
        "      x.beginPath(); x.ellipse(bx+bw*0.5,by+bh*0.72,bw*0.42,bh*0.16,0,0,7); x.fill();\n"
        "      if(im){ x.save(); x.imageSmoothingEnabled=false;\n"
        "        if(!P.carVert){ x.translate(bx+bw*0.5,by+bh*0.5); x.rotate(Math.PI/2);\n"
        "          x.drawImage(im,-bh*0.5,-bw*0.5,bh,bw); }\n"
        "        else x.drawImage(im,bx,by,bw,bh);\n"
        "        x.restore(); }\n"
        "      else { x.fillStyle='#5a5346'; x.fillRect(bx,by,bw,bh); }\n"
        "      continue; }\n"
        "    const pp=fieldPos(P,W,H,cx,cy), pxs=pp[0], pys=pp[1];\n"
        "    const s=ring*0.62;   /* a block fills its tile */",
        'the car draws as one sprite over its cells')

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
