#!/usr/bin/env python3
"""BOHEMIA THE SIX NEIGHBOURS WERE ONE PERSON IN SIX COLOURS (8/17/26, CHARACTER lane)

MEASURED FIRST. Rendered all six city residents side by side, then again with the
colour removed. In colour they read as six people. IN GREYSCALE THEY ARE SIX
IDENTICAL SILHOUETTES -- same body, same garment shapes, same proportions, same
height, broken only by a durag on every third one.

Here is the whole cast, and it is three lines:

    const rc=()=>[0,0,0].map(()=>64+Math.floor(Math.random()*150));
    const L={tints:{jacket:rc(),shirt:rc(),pants:rc(),shoes:rc()},
             hat:(i%3===0)?'hat/durag':'', dirs:{}};

Every resident is THE PLAYER'S OWN BODY AND THE PLAYER'S OWN CLOTHES, tinted a
random colour. Three rulings say no:

  STRUCTURE-NOT-COLOR (7/19, LOCKED)  colourways are legal but they are never the
      thing itself. AMENDED 8/15 to govern IDENTITY, not just progress: "every
      faction must be identifiable by SILHOUETTE -- garment shape, proportion,
      headwear -- with colour as the BACK-UP channel, never the carrier."
  PAOLO 8/3   "have it not be a copy of me." They are copies of him, recoloured.
  AND THE GAME ITSELF   the valley is dark. The demo opens at 06:00 and the
      streets are near-black. Colour is the one channel that is not reliably there,
      and it was carrying the entire cast.

*** THE FIX IS NOT A NEW SYSTEM. THIS LANE ALREADY BUILT THE RIGHT ONE. *** The
FAMILY CAST is four people who differ by BODYVAR dials plus a real fit out of the
canon wardrobe, and its notes already think in outlines -- Nina's reads "smallest
silhouette in the room". The city cast simply never got the same treatment. So the
six residents become six SHAPES, using the same borrow-and-restore path
famPaintBody proved (dials + worn + age, rebuildFromRig, put the player back in a
finally), and every garment named below is st:'canon' and already in the wardrobe:

    1  THE LONG COAT      tallest, narrowest column -- a floor-length duster
    2  THE BARE ARMS      short and broad, a tank and suspenders, no coat at all
    3  THE PACK           a bulk on the back nobody else has, under a knit cap
    4  THE SKIRT          smallest, and the only one whose LOWER half is not legs
    5  THE WIDE BRIM      a hat you can identify from across the street
    6  THE PONCHO         a triangle, and the only trailing hem

Six different outlines, readable with every colour stripped out -- which is the
test, and the gate.

REUSE CHECK (REUSE-FIRST LAW, Paolo 7/22): cooks ZERO new graphic pixels. Every
garment is an existing st:'canon' entry in the alpha's own GARMENTS catalogue (145
canon pieces across 12 layers, inventoried before choosing); every body is the ONE
painted rig reshaped by BODYVAR dials that already exist. Nothing is drawn,
generated or invented -- this is assignment, which is what the backlog's SIL row
says it is.

RIG CHECK (RIG IS LAW, Paolo 7/26/26): does not touch his painted art. It sets
  G.bodyVar / G.age / window.G_WORN around a bake and restores all three plus the
  PD slots in a finally, exactly as famPaintBody does -- the globals are borrowed,
  never left installed, because leaving one would silently reshape every other
  surface in the game.
  built on: BAKED, BOH_BODYVAR
  joints: none named
  parts: none named

CONTENTS ARE STILL HIS. Which shape belongs to which person is taste and he can
retune any line of the table; what is not a taste call, and what these three lines
were breaking, is that six people in a dark street must not be one body recoloured.

    python3 tools/bohemia_city_cast_silhouettes.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD = """const CITY_LOOKS=6;                               /* the same six the run gets */"""

NEW = """const CITY_LOOKS=6;                               /* the same six the run gets */
/* ===== SIX SHAPES, NOT SIX COLOURS (Paolo 7/19 STRUCTURE-NOT-COLOR, amended 8/15
   to govern IDENTITY; Paolo 8/3 "have it not be a copy of me") ==================
   MEASURED BEFORE IT WAS CHANGED: the six residents were the player's body in the
   player's clothes under random tints, and rendered in greyscale they were SIX
   IDENTICAL SILHOUETTES. The valley is dark -- the demo opens at 06:00 -- so
   colour is exactly the channel that is not reliably there, and it was carrying
   the whole cast.
   Same construction as FAMILY_CAST, which this lane already got right: BODYVAR
   dials for the body, a real fit from the canon wardrobe for the shape. Every
   garment here is st:'canon' and already exists; nothing is cooked.
   THE TEST IS GREYSCALE: strip the colour and six different outlines must remain.
   gates/city_cast_silhouette_gate.js holds it.
   His table to retune -- which shape belongs to whom is taste. */
const CITY_CAST_LOOKS = [
  { id:'longcoat', why:'tallest, narrowest column -- a floor-length duster',
    dials:{height:0.70,belly:-0.20,arms:0.10,shoulders:0.20,hips:-0.10},
    worn:{hair:'BUZZ CUT',base:'FADED BLACK LONGSLEEVE',outer:'WASTELAND DUSTER',
          legs:'BLACK DENIM',feet:'TALL MOTO BOOTS'} },
  { id:'barearms', why:'short and broad, bare arms, no coat to hide the shoulders',
    dials:{height:-0.35,belly:0.50,arms:0.30,shoulders:0.60,hips:0.10},
    worn:{hair:'SLICK BACK',base:'SOOT TANK',gear:'BRICK SUSPENDERS',
          legs:'KHAKI CARGOS',feet:'RANCH BOOTS'} },
  { id:'pack', why:'a bulk on the back nobody else has, under a knit cap',
    dials:{height:0.10,belly:0.15,arms:0.00,shoulders:0.35,hips:0.00},
    worn:{hair:'CROP',base:'OLIVE HOODIE',back:'RUCK PACK',head:'STORM KNIT CAP',
          legs:'SOOT CARGOS',feet:'WRAPPED BOOTS'} },
  { id:'skirt', why:'smallest, and the only one whose lower half is not two legs',
    dials:{height:-0.55,belly:-0.25,arms:-0.30,shoulders:-0.35,hips:0.30},
    worn:{hair:'SHOULDER LENGTH',base:'STRIPED TEE',legs:'ANKLE WRAP SKIRT',
          feet:'SLATE SNEAKERS'} },
  { id:'widebrim', why:'a hat you can identify from across the street',
    dials:{height:-0.10,belly:0.05,arms:-0.05,shoulders:-0.10,hips:0.05},
    worn:{hair:'GREY WISPS',base:'DUST PLAID SHIRT',head:'CHINESE RICE FARMER HAT',
          legs:'DUST TROUSERS',feet:'SANDWALKERS',waist:'SCAV TOOL BELT'} },
  { id:'poncho', why:'a triangle, and the only trailing hem',
    dials:{height:0.25,belly:0.10,arms:0.05,shoulders:0.15,hips:0.00},
    worn:{hair:'SHAG',base:'BONE HENLEY',outer:'DUST PONCHO',neck:'TRAILING SCARF',
          legs:'OLIVE PANTS',feet:'BROWN BOOTS'} }
];
window.CITY_CAST_LOOKS = CITY_CAST_LOOKS;"""

OLD_BAKE = """  const out={type:'BOHEMIA_CITY_CAST',w:56,h:56,packed:true,looks:[]};
  const rc=()=>[0,0,0].map(()=>64+Math.floor(Math.random()*150));
  const plan=[];
  for(let i=0;i<CITY_LOOKS;i++){
    const L={tints:{jacket:rc(),shirt:rc(),pants:rc(),shoes:rc()},
             hat:(i%3===0)?'hat/durag':'', dirs:{}};
    plan.push(L); out.looks.push({dirs:L.dirs});
  }
  const withLook=(L,fn)=>{
    const kt=JSON.parse(JSON.stringify(G.tints)),kh=G.equipped.hat;
    G.tints=L.tints;G.equipped.hat=L.hat;
    try{fn();}finally{G.tints=kt;G.equipped.hat=kh;}
  };"""

NEW_BAKE = """  const out={type:'BOHEMIA_CITY_CAST',w:56,h:56,packed:true,looks:[]};
  const plan=[];
  for(let i=0;i<CITY_LOOKS;i++){
    const src=CITY_CAST_LOOKS[i%CITY_CAST_LOOKS.length];
    const L={id:src.id,dials:src.dials,worn:src.worn,age:src.age||'adult',dirs:{}};
    plan.push(L); out.looks.push({dirs:L.dirs});
  }
  /* BORROW THE BODY, THEN GIVE IT BACK -- the path famPaintBody proved. A resident
     is not the player, and dials/age reach the renderer ONLY through
     rebuildFromRig(); setting them and baking changes nothing without it. The PD
     clothing slots are cleared too, or the player's own garments render underneath
     this person's fit. Everything is restored in the finally, because these are
     GLOBALS: leaving one installed silently reshapes every other surface in the
     game and surfaces as a rendering bug with no connection to here. */
  const PD_CLOTHES=['shirt','jacket','pants','shoes','hat','glasses','hair'];
  const withLook=(L,fn)=>{
    const kW=window.G_WORN, kD=G.bodyVar, kA=G.age, kE={};
    PD_CLOTHES.forEach(s=>{ if(s in G.equipped){ kE[s]=G.equipped[s]; G.equipped[s]=''; } });
    try{
      window.G_WORN=L.worn; G.bodyVar=L.dials; G.age=L.age;
      rebuildFromRig();
      fn();
    }finally{
      window.G_WORN=kW; G.bodyVar=kD; G.age=kA;
      for(const s in kE) G.equipped[s]=kE[s];
      try{ rebuildFromRig(); }catch(_e){}
      try{ HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); }catch(_e){}
    }
  };"""


def main():
    alpha = open(ALPHA, encoding='utf8').read()
    applied, missed = [], []
    for label, old, new in [
        ('the six residents are six SHAPES, from the canon wardrobe', OLD, NEW),
        ('the bake borrows body + fit and gives them back', OLD_BAKE, NEW_BAKE),
    ]:
        if new in alpha:
            applied.append('(already) ' + label); continue
        n = alpha.count(old)
        if n != 1:
            missed.append('%s -- expected exactly 1 match, found %d' % (label, n)); continue
        alpha = alpha.replace(old, new, 1)
        applied.append(label)
    for l in applied: print('  ok   ' + l)
    for l in missed:  print('  MISS ' + l)
    if missed:
        print('CITY CAST SILHOUETTES: refused to write -- %d edit(s) did not match exactly once' % len(missed))
        return 1
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('CITY CAST SILHOUETTES: applied to %s' % ALPHA)
    return 0


if __name__ == '__main__':
    sys.exit(main())
