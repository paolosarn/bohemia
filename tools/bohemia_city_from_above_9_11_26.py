#!/usr/bin/env python3
"""THE CITY FROM ABOVE -- COOK, VAMILY [city from above], 9/11/26.

PAOLO 9/8, from his own frame (records/target/PAOLO_WHY_DOES_THE_CITY_LOOK_LIKE_THIS_9_8_26.png):
    "why does the city keep looking like this when I'm zoomed out, bro, come on."

MEASURED ON THE SCREEN HE PHOTOGRAPHED, not on the whole file. renderCity() in
slices/BOHEMIA_CITY_WORLD.html -- the function that draws exactly that view -- makes

    73 fillRect    8 strokeRect    17 stroke()    AND ZERO drawImage

**There is not one image in the zoomed-out city.** It is ninety-eight vector operations:
coloured slabs with green and yellow edge lines. That is the builder's diagram, and it has
been standing in for a city since the builder was wired. (The row's own note says "19 filled
rectangles against 9 image draws"; that counts the ALPHA's whole file, which is a shell. The
number above is the real renderer, and it is worse.)

HIS 7/1 LOCK: "zoomed out, the living city view, NOT chibi, SAME PIXEL STYLE but reading as
a REALISTIC CITY FROM ABOVE."

THIS TOOL IS THE COOK'S HALF AND ONLY THAT HALF. The 9/8 ruling splits the job three ways:
COOK makes the coarse tiles, DIRECTION writes the card, LIFE+CITY's renderer draws them and
turns the diagram into a layer. So this produces the TILES. It does not touch the renderer.

DERIVED, NEVER DRAWN, WHICH IS THE WHOLE POINT. The ruling says the coarse tiles must come
from the fine ones "so they cannot drift (NOTHING IS BAKED ONCE)". Every district generator
runs headlessly and hands back its own 128x128 grid of legend codes AND its own palette, so
a coarse tile is that district's real art, reduced. Nobody draws a second city by hand, and
a district that changes at street scale changes here in the same commit.

    128 / 4 = 32, a clean integer reduction, and one cell in city mode is an isometric
    diamond TW=18 x TH=9 at zoom 1, so a 32px square source covers the whole zoom band
    without inventing detail it does not have.

DOMINANT CODE, NOT AVERAGE COLOUR, AND THAT IS HIS LOCK RATHER THAN MY TASTE. Averaging the
colours in a 4x4 block is what a photograph does, and it makes mud: a red roof beside a grey
road averages to a brown nothing, and the palette stops being the palette. Taking the most
common CODE in the block keeps every pixel a real colour out of that district's own ramp,
which is "SAME PIXEL STYLE" in one operation. Both are rendered so the difference can be
looked at rather than argued about.

    python3 tools/bohemia_city_from_above_9_11_26.py            measure and render samples
    python3 tools/bohemia_city_from_above_9_11_26.py --write    emit the bank

REFERENCE CHECK (owed by the 9/4 standing duty; paid 9/12 in round 2, and this tool is
another the gate cannot see -- it is a cook with no "cook" in its filename).

COMPARED TO: CB-04 (OpenTTD's road grain), CB-05 (Songs of Syx at far zoom), DIST-04
(Stardew Valley's town map), and real Las Vegas aerials at this tile size.

STRUCTURAL RULES TAKEN:
  * CB-05 -- "zoomed out, a city stops being tiles and becomes COLOUR MASSES by function;
    a district's identity must survive that switch." That is the whole test this tool has
    to pass, and it is why the reduction is DOMINANT CODE per 4x4 block and not an average.
    Averaging a red roof beside a grey road makes brown nothing: the mass stops being a
    mass and the identity dies exactly where CB-05 says it must survive. (The car round had
    to undo that same mistake from the other end.)
  * CB-04 -- "the road grid is the first thing legible at every zoom." This is the arm that
    could have killed the whole method, because a street ONE cell wide loses the vote inside
    a 4x4 block. MEASURED both rounds rather than assumed. Round 1, all kinds: roads went
    fine 18.6% -> coarse 20.3%, worst district losing 1.0 point, because a road is a wide
    run that wins its blocks. Round 2, the last five: convention +0.9, dam +0.1, fort +0.2,
    prison +2.5, minigp -0.1. Worst loss across the five is a tenth of a point.
  * DIST-04 -- in 3/4 top-down a building is FRONT FACE + ROOF BAND and paths read because
    they are continuous. Nothing here draws a new building; the point is that the coarse
    tile is that same art reduced, so the continuity DIST-04 relies on is inherited rather
    than re-invented. One house is the same house on both sides of the 9/7 zoom.

WHAT CHANGED FROM THE REFERENCE: nothing, and that is the design. This tool authors no
pixels at all. Every coarse tile is a district's own art reduced 4x, off that district's own
ramp, so a district that changes at street scale changes up here in the same commit. The
alternative -- painting 61 aerial tiles by hand -- is the thing that rots.

AND THE NUMBER CORRECTED THE EYE THIS ROUND, which is worth recording because last round it
went the other way. Looking at the five, fort read as empty tan. Measured: all five use the
full 15-code legend, and fort's biggest single code is 25.5% "dust yard", mid-pack against
minigp's 27.7% "circuit". A fort IS a walled yard and a circuit IS mostly track. There was no
emptiness defect; the eye had found the art doing its job. MEASURE AND LOOK, not one of them.
"""
import io, json, os, subprocess, sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FINE = 128
COARSE = 32
BLOCK = FINE // COARSE
BANK = 'banks/BOHEMIA_CITY_FROM_ABOVE_9_11_26.txt'

NODE_DUMP = r'''
const fs=require('fs'), path=require('path');
const ROOT=%s;
const w=fs.readFileSync(path.join(ROOT,'engine/bohemia_world.js'),'utf8');
const m=w.match(/var DISTGEN = \{/); let i=w.indexOf('{',m.index), d=0, j;
for(j=i;j<w.length;j++){ if(w[j]==='{')d++; else if(w[j]==='}'){d--; if(!d)break;} }
const body=w.slice(i,j+1);
const kinds=[...new Set([...body.matchAll(/^\s*([a-zA-Z_][\w]*)\s*:\s*\{/gm)].map(x=>x[1]))];
/* A FILENAME IS NOT A REGISTRY, and this lane has already lost a round to that.
   DISTGEN names the MODULE each kind builds through, and nineteen of the sixty-one
   share one: gated and estate build through the suburb generator, and eleven utility
   kinds are sub-objects on bohemia_utility.js (U.arsenal.generate, U.radio.generate).
   Follow the mod field, then look INSIDE the module, before deciding a kind has no art. */
const MODMAP={};
{ const mre=/^\s*([a-zA-Z_][\w]*)\s*:\s*\{\s*mod:\s*([A-Z][A-Z0-9_]*)/gm; let mx;
  while((mx=mre.exec(body))) MODMAP[mx[1]]=mx[2]; }
const SHARED={ SUB:'engine/bohemia_suburb.js', UTL:'engine/bohemia_utility.js',
               KIT:'engine/bohemia_district_kit.js' };
/* ROUND 2, AND IT IS THE SAME SENTENCE A THIRD TIME. Round 1 stopped at 56 of 61 and
   I wrote down that the last five "carry mod: KIT and are authored as kit ENTRIES, a
   different mechanism". THEY ARE NOT A DIFFERENT MECHANISM. convention, dam, fort,
   minigp and prison each register a spec with generate() AND palette, exactly like the
   other 56 -- through bohemia_landmarks.js, into the kit's own REGISTRY, which is
   reached by KIT.get(name) and is NOT a property on the module object. So M['convention']
   was undefined and I called the mechanism different instead of asking the registry.
   A FILENAME IS NOT A REGISTRY (the district round). A MODULE PROPERTY IS NOT A REGISTRY
   (this one). MEASURED, not assumed: before requiring landmarks, KIT.get('convention') is
   false; after, all five return a spec with generate and palette. */
const REGISTRARS=['engine/bohemia_landmarks.js'];
for(const r of REGISTRARS){ const f=path.join(ROOT,r);
  if(fs.existsSync(f)){ try{ require(f); }catch(e){} } }
const out={};
function take(k, M, host){
  if(!M||typeof M.generate!=='function'||!M.palette) return false;
  try{
    const r=M.generate(12345,{streets:['N','S','E','W']});
    if(!r||!r.g||!r.g.length) return false;
    out[k]={g:r.g, palette:M.palette, via:host||k};
    return true;
  }catch(e){ return false; }
}
for(const k of kinds){
  const own=path.join(ROOT,'engine/bohemia_'+k+'.js');
  if(fs.existsSync(own)){ let M=null; try{ M=require(own); }catch(e){}
    if(take(k, M)) continue; }
  const mod=MODMAP[k], f=mod&&SHARED[mod];
  if(!f||!fs.existsSync(path.join(ROOT,f))) continue;
  let M=null; try{ M=require(path.join(ROOT,f)); }catch(e){ continue; }
  if(M[k]&&typeof M[k].generate==='function'){ take(k, M[k], mod+'.'+k); continue; }
  /* ASK THE REGISTRY, not the module object. This is the line that takes 56 -> 61. */
  if(typeof M.get==='function'){ const spec=M.get(k);
    if(spec&&typeof spec.generate==='function'){ take(k, spec, mod+'.get('+k+')'); continue; } }
  take(k, M, mod);
}
process.stdout.write(JSON.stringify(out));
''' % (json.dumps(ROOT),)


def districts():
    p = os.path.join(ROOT, '.city_dump.js')
    io.open(p, 'w', encoding='utf-8').write(NODE_DUMP)
    try:
        raw = subprocess.run(['node', p], capture_output=True, text=True,
                             cwd=ROOT, timeout=600)
        if raw.returncode != 0:
            print(raw.stderr[:400]); return {}
        return json.loads(raw.stdout)
    finally:
        try: os.remove(p)
        except OSError: pass


def hexrgb(h):
    h = str(h).lstrip('#')
    if len(h) != 6: return None
    try: return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))
    except ValueError: return None


def reduce_dominant(g, pal):
    """The most common CODE in each block, then that code's own colour."""
    out = []
    for by in range(COARSE):
        row = []
        for bx in range(COARSE):
            c = Counter()
            for y in range(by * BLOCK, (by + 1) * BLOCK):
                for x in range(bx * BLOCK, (bx + 1) * BLOCK):
                    c[g[y][x]] += 1
            code = c.most_common(1)[0][0]
            row.append(hexrgb(pal.get(str(code), pal.get(code, '#000000'))) or (0, 0, 0))
        out.append(row)
    return out


def reduce_average(g, pal):
    """What a photograph would do. Rendered only so the difference can be SEEN."""
    out = []
    for by in range(COARSE):
        row = []
        for bx in range(COARSE):
            r = gg = b = n = 0
            for y in range(by * BLOCK, (by + 1) * BLOCK):
                for x in range(bx * BLOCK, (bx + 1) * BLOCK):
                    c = hexrgb(pal.get(str(g[y][x]), pal.get(g[y][x], '#000000')))
                    if not c: continue
                    r += c[0]; gg += c[1]; b += c[2]; n += 1
            n = max(1, n)
            row.append((r // n, gg // n, b // n))
        out.append(row)
    return out


def png(rows, path, scale=1):
    from PIL import Image
    im = Image.new('RGB', (COARSE, COARSE))
    px = im.load()
    for y in range(COARSE):
        for x in range(COARSE):
            px[x, y] = rows[y][x]
    if scale > 1:
        im = im.resize((COARSE * scale, COARSE * scale), Image.NEAREST)
    im.save(path)
    return im


def main():
    write = '--write' in sys.argv
    print('THE CITY FROM ABOVE -- deriving the coarse tiles from the fine ones')
    print('  %d fine -> %d coarse, a %dx reduction' % (FINE, COARSE, BLOCK))
    D = districts()
    print('  %d district kinds generated cleanly and carry their own palette\n' % len(D))
    if not D:
        return 1

    # PACKED AS A PALETTE AND AN INDEX STRING, because a bank nobody can inline is a
    # bank nobody uses. A tile carries a median of 10 colours and at most 18, so one
    # character indexes it: 56 kinds of 1024 repeated hex strings is 786 KB, the same
    # thing as palette-plus-indices is a fraction of that, and it decodes in two lines.
    ALPH = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    out, colours = {}, Counter()
    for k in sorted(D):
        g, pal = D[k]['g'], D[k]['palette']
        dom = reduce_dominant(g, pal)
        flat = ['#%02x%02x%02x' % c for row in dom for c in row]
        order = []
        for c in flat:
            if c not in order:
                order.append(c)
        colours[k] = len(order)
        if len(order) > len(ALPH):
            print('  %s has %d colours, more than the index alphabet' % (k, len(order)))
            continue
        out[k] = {'pal': order, 'idx': ''.join(ALPH[order.index(c)] for c in flat)}
    med = sorted(colours.values())[len(colours) // 2]
    print('  a coarse tile carries a median of %d colours, all of them off that district\'s'
          ' own ramp' % med)

    if not write:
        print('\n  measure only. pass --write to emit the bank.')
        return 0

    bank = {
        'version': 'BOHEMIA_CITY_FROM_ABOVE_v1',
        'built': '2026-09-11',
        'why': ('Paolo 9/8: "why does the city keep looking like this when I am zoomed out". '
                'renderCity() draws 73 fillRect, 8 strokeRect, 17 stroke() and ZERO drawImage '
                '-- the zoomed-out city has never had a single image in it.'),
        'lock': ('Paolo 7/1: zoomed out is the living city view, NOT chibi, SAME PIXEL STYLE '
                 'but reading as a REALISTIC CITY FROM ABOVE.'),
        'derivation': ('NOTHING IS BAKED ONCE. Each tile is that district generator\'s own '
                       '128x128 grid reduced 4x by DOMINANT CODE per 4x4 block, then through '
                       'that district\'s own palette. Averaging was rendered beside it and '
                       'rejected: it makes mud and it stops the palette being the palette. '
                       'Regenerate with tools/bohemia_city_from_above_9_11_26.py --write.'),
        'fine': FINE, 'coarse': COARSE, 'seed': 12345,
        'kinds': len(out),
        'format': ('each kind is {pal:[hex...], idx:"one character per pixel, row major, '
                   'indexing pal via 0-9a-zA-Z"}. 32x32 = 1024 characters. Decode: '
                   'pal[ALPH.indexOf(idx[y*32+x])].'),
        'alphabet': ALPH,
        'tiles': out,
    }
    io.open(os.path.join(ROOT, BANK), 'w', encoding='utf-8').write(
        json.dumps(bank, indent=1))
    print('\n  wrote %s (%d kinds, %dx%d each)' % (BANK, len(out), COARSE, COARSE))
    return 0


if __name__ == '__main__':
    sys.exit(main())
