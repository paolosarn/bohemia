#!/usr/bin/env python3
"""
CITY TRAFFIC SIGNALS (8/1/26) -- his signals finally stand on the intersections.

Paolo 8/1: "I made not only did I make street lights, but I also made traffic
lights as well. I even made traffic lights that were broken and on the floor and I
want to see that on all intersections, we made laws about it. You know we haven't
seen these traffic lights in a fat fucking minute. What's up with that?"

MEASURED BEFORE THIS TOOL: banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt
holds 348 finished sprites, 6.6 MB. Sprites reaching the shipped alpha: 0. Sprites
reaching the CITY renderer he actually plays: 0. Not one byte, for two weeks. The
bank still says "UNJUDGED (Paolo judges on the intersection proof)" -- judgment was
made conditional on a proof surface nobody ever built. Full finding:
records/BOHEMIA_TRAFFIC_SIGNALS_NEVER_PLACED_8_1_26.md

HIS RULINGS, CARRIED FROM INSIDE THE BANK (not re-decided here)
  arm_law    lanes -> arm reach. 1 lane = short (3 cells), 2 = med (6), 3 = long (9).
  color_law  hot-dip galvanized masts weather to dull zinc GRAY; only
             coating-stripped masts brown out. So galv is the common case and
             bronze the minority, never a 50/50 coin flip.
  state      DEAD is the act-1 default. Grid power is [PENDING Paolo], so no
             signal is lit here -- lit r/a/g stay in the bank until he rules.
  wreckage   fallen_arm / dropped_heads / scattered are the "broken and on the
             floor" he asked for BY NAME, so they are placed, not filtered out.

REUSE CHECK: cooks no graphic pixels. Every sprite written here is lifted verbatim
from his 7/17 signal bank. Nothing is re-cooked, resized or recoloured; the tool
only chooses WHICH of his sprites stands at which intersection.

Idempotent: re-running finds the marker and reports NOOP.
"""
import base64
import json
import re
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
BANK = 'banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt'
MARKER = '__TRAFFIC_SIGNALS__'


def pick(sigs):
    """The act-1 set: DEAD only, both arm directions, all three arm reaches, plus
    every wreckage kind. Lit heads stay in the bank until the grid-power ruling."""
    out = {}
    for s in sigs:
        if s['kind'] == 'intact':
            if s['state'] != 'dead':
                continue                      # act-1 default; lit needs his power ruling
            key = 'i_%s_%s_%s' % (s['color'], s['arm'], s['dir'])
        else:
            key = 'w_%s_%s' % (s['kind'], s['dir'])
        out.setdefault(key, s)
    return out


def main():
    bank = json.load(open(BANK))
    chosen = pick(bank['signals'])
    if not chosen:
        print('FAIL: no signals selected from the bank'); return 1

    alpha = open(ALPHA, encoding='utf8', errors='ignore').read()
    m = re.search(r"CITY_B64\s*=\s*['\"`]([A-Za-z0-9+/=]{5000,})", alpha)
    if not m:
        print('FAIL: CITY_B64 not found'); return 1
    city = base64.b64decode(m.group(1)).decode('utf8', errors='ignore')
    if MARKER in city:
        print('NOOP: the intersections already carry his signals'); return 0

    anchor = "const SA_MAP="
    if city.count(anchor) != 1:
        print('FAIL: SA_MAP anchor not unique'); return 1
    # THE HOOK MUST BE IN renderHuman'S OWN BODY. The first attempt hooked the
    # FRONT facade pass, which lives in a NESTED helper that only runs when a
    # person is drawn behind a wall, so sigPass was never called at all. This
    # anchor is the BACK facade pass, which renderHuman calls directly every frame.
    hook = "  facadePass(ox,oy,C,false,hy,null);\n"
    if city.count(hook) != 1:
        print('FAIL: the render hook is not where this tool expects it'); return 1

    tiles = {k: {'b64': s['b64'], 'w': s['w'], 'h': s['h'],
                 'pcx': s['pcx'], 'by': s['base_y'], 'arm': s.get('arm'),
                 'kind': s['kind'], 'dir': s['dir']} for k, s in chosen.items()}

    decl = ("\n/* " + MARKER + " -- HIS 7/17 TRAFFIC SIGNALS, ON THE INTERSECTIONS.\n"
            "   Verbatim from banks/BOHEMIA_TRAFFIC_SIGNAL_CANDIDATES_7_17_26.txt; this\n"
            "   file chooses WHICH of his sprites stands where and nothing else. DEAD only\n"
            "   (act-1 default; grid power is his call), every wreckage kind included\n"
            "   because 'broken and on the floor' is what he asked for by name. */\n"
            "const SIG_TILES=" + json.dumps(tiles, separators=(',', ':')) + ";\n"
            "const SIG_IMG={};\n"
            "for(const k in SIG_TILES){ const im=new Image();\n"
            "  im.onload=()=>{ try{ render(); }catch(_e){} };\n"
            "  im.src='data:image/png;base64,'+SIG_TILES[k].b64; SIG_IMG[k]=im; }\n"
            "/* ARM LAW (his, from the bank): lanes -> reach. Read the lanes the street\n"
            "   actually has rather than assuming, so a 1-lane residential corner never\n"
            "   gets a 9-cell mast built for an arterial. */\n"
            "function sigArm(lanes){ return lanes>=3?'long':(lanes===2?'med':'short'); }\n"
            "/* COLOR LAW (his, researched 7/18): galvanized masts are the majority and\n"
            "   weather to zinc gray; bronze is the coating-stripped minority. 3:1, hashed,\n"
            "   never a coin flip. */\n"
            "function sigColor(h){ return (h%4===0)?'bronze':'galv'; }\n"
            "function sigPick(gx,gy,lanes){\n"
            "  const h=(OM.hash2(gx,gy,9137))>>>0;\n"
            "  const d=(h&1)?'e':'w';\n"
            "  /* WRECKAGE: a dead valley does not keep every mast standing. ~1 in 4\n"
            "     intersections carries a broken one, and which one is deterministic. */\n"
            "  if(h%4===1){ const W=['fallen_arm','dropped_heads','scattered'];\n"
            "    const k='w_'+W[(h>>3)%W.length]+'_'+d; if(SIG_IMG[k])return k; }\n"
            "  const k='i_'+sigColor(h)+'_'+sigArm(lanes)+'_'+d;\n"
            "  return SIG_IMG[k]?k:null;\n"
            "}\n"
            "/* Draw his signals for every intersection in view. An intersection is a road\n"
            "   tile carrying BOTH bands (tileMeta's vx and hz), which is the city's own\n"
            "   existing notion of a crossing -- no second definition invented here. */\n"
            "function sigPass(ox,oy,C){\n"
            "  if(typeof SIG_IMG==='undefined')return;\n"
            "  const gx0=Math.max(0,Math.floor(-ox/C)), gx1=Math.min(WORLD_F-1,Math.ceil((cv.width-ox)/C));\n"
            "  const gy0=Math.max(0,Math.floor(-oy/C)), gy1=Math.min(WORLD_F-1,Math.ceil((cv.height-oy)/C));\n"
            "  const t0x=(gx0/FN)|0, t1x=(gx1/FN)|0, t0y=(gy0/FN)|0, t1y=(gy1/FN)|0;\n"
            "  for(let ty=t0y;ty<=t1y;ty++)for(let tx=t0x;tx<=t1x;tx++){\n"
            "    let mm=null; try{ mm=tileMeta(tx,ty); }catch(_e){ continue; }\n"
            "    /* AN INTERSECTION IS A ROAD TILE THAT TURNS: it must connect a\n"
            "       vertical neighbour AND a horizontal one. tileMeta already computes\n"
            "       exactly those four booleans for the edge-matching law, so this reuses\n"
            "       the city's own notion of the road network instead of inventing one. */\n"
            "    if(!mm.road||!((mm.N||mm.S)&&(mm.E||mm.W)))continue;\n"
            "    const cgx=tx*FN+(FN>>1), cgy=ty*FN+(FN>>1);\n"
            "    const lanes=Math.max(1,Math.min(3,Math.round((mm.q!==undefined?mm.q:0.6)*3)));\n"
            "    const key=sigPick(cgx,cgy,lanes); if(!key)continue;\n"
            "    const im=SIG_IMG[key], sp=SIG_TILES[key];\n"
            "    if(!im||!im.complete||!im.naturalWidth)continue;\n"
            "    /* the sprites are authored against the 44px corpus cell, so at any zoom\n"
            "       they scale by C/44 -- the same integer family the render contract uses. */\n"
            "    const k=C/44, dw=Math.round(sp.w*k), dh=Math.round(sp.h*k);\n"
            "    const px=Math.round(ox+cgx*C+C/2-sp.pcx*k), py=Math.round(oy+cgy*C+C-sp.by*k);\n"
            "    g.drawImage(im,px,py,dw,dh);\n"
            "  }\n"
            "}\n")

    city = city.replace(anchor, decl + anchor, 1)
    city = city.replace(hook, hook + "  sigPass(ox,oy,C);   /* " + MARKER + " */\n", 1)

    out = base64.b64encode(city.encode('utf8')).decode('ascii')
    open(ALPHA, 'w', encoding='utf8').write(alpha[:m.start(1)] + out + alpha[m.end(1):])
    kinds = sorted(set(v['kind'] for v in tiles.values()))
    print('wrote %s' % ALPHA)
    print('  %d of his sprites embedded (kinds: %s)' % (len(tiles), ', '.join(kinds)))
    print('  sigPass draws them at every road tile carrying both bands')
    return 0


if __name__ == '__main__':
    sys.exit(main())
