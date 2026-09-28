#!/usr/bin/env python3
"""BOHEMIA — THE WATER YOU COULD STAND ON (9/27/26, LIFE + CITY, row [honest grid]).

THE ROUND'S COOK (rule 22), AND IT IS THE ROUND'S FINDING, NOT A DECORATION. Rule 34(b),
Paolo 9/27: THE GRID IS HONEST -- every cell is floor, wall, door, cover or prop and the
drawing agrees with it cell for cell. This picture is the block where it did not, drawn
twice: what the game believed a body could stand on before this round, and after.

*** IT IS A REAL BLOCK OFF THE REAL GENERATOR. *** Rule 32(f), Paolo 9/23: SHOW IT FROM
THE GAME'S CAMERA. Nothing here is illustrated. The dam district's own generator is run
with a fixed seed, its own legend decides every cell's class through the kit's own table,
and the two panels are the SAME grid coloured by the answer to one question: can a body
stand here. The counts printed underneath are counted off these pixels.

WHAT THE MEASUREMENT FOUND: 72 districts, 1,171 legend entries, 19 kinds in use, and
exactly ONE kind the solidity table had never heard of -- `water`. An unknown kind falls
through to {ground, not solid} in silence, so the dam's reservoir and tailrace, 5,329
cells, and the fort's creek, 534 more, were ORDINARY WALKABLE FLOOR. A third of the dam
block. The author had written `solid: false`, which is true and is half the answer: a lake
does not stop you. There was no way to say the other half, that nothing walks into it.

THE ANALOG HORROR LINE (rule 30, every chat has one): the wrong thing here is not a
monster, it is a SURFACE THAT AGREES WITH YOU. The bible's rule 1 is an ordinary frame
with one thing wrong in it, and a reservoir you can walk out onto is exactly that: the
picture looks like water, the game says pavement, and nothing warns you. The left panel is
what that looks like drawn honestly, which is the most unsettling thing this lane has
produced, because it was shipped and green.

REUSE CHECK: the grid comes from engine/bohemia_landmarks.js's own dam generator through
the registered district kit -- not redrawn, not approximated; the class of every cell comes
from the kit's tileLayer(), the same call the walked surface asks; the palette is the dam's
own DAM_PAL read live out of the same file. Nothing about the block is authored here. This
file only colours cells by an answer and counts them. REFUSES TO RUN if the district is not
registered or the generator returns no grid.

REFERENCE CHECK:
  AH-01    the ordinary frame with ONE wrong thing. Held: two plain top-down plans of the
           same real block, no effects, and the only wrong thing is that a third of the
           left one is standable water. Nothing in the frame points at it.
  BLDG-03  three planes, ONE light direction, structure reads. Held: the dam wall, the
           powerhouse and the towers keep their own mass colour in both panels so the
           block is still legible as the place it is, and only the standing answer moves.
  BLDG-05  structural sanity: a wall meets a roof, a street meets a kerb. Held: the crest
           road still crosses the wall and the canyon rock still frames it; the fix moves
           what a body may do, never where anything is.

DETERMINISTIC: one fixed seed, no clock, no randomness of its own. Same bytes every run.

Run from repo root:  python3 tools/bohemia_the_water_you_could_stand_on_factory.py
Writes: slices/vote/LIFECITY_THE_WATER_YOU_COULD_STAND_ON_9_27.png
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_THE_WATER_YOU_COULD_STAND_ON_9_27.png')
SCALE = 4
BAND = 13

# THE ONE QUESTION EACH CELL IS COLOURED BY. Not a palette of materials: a palette of
# ANSWERS, because the defect is an answer, not a colour.
STAND = (150, 176, 150)      # a body may stand here
WALL = (74, 74, 84)          # solid: it stops you
VOIDC = (44, 66, 92)         # a void: does not stop you, nothing walks in
WRONG = (196, 92, 84)        # standable, and it is water

HARVEST = r'''
process.exit=function(){};
const fs=require('fs'),path=require('path');
const ENGINE=process.argv[2], OUTF=process.argv[3];
const K=require(path.join(ENGINE,'bohemia_district_kit.js'));
for(const f of fs.readdirSync(ENGINE).filter(n=>n.endsWith('.js'))){
  try{ require(path.join(ENGINE,f)); }catch(e){}
}
const d=K.get('dam');
if(!d){ fs.writeFileSync(OUTF, JSON.stringify({error:'the dam district is not registered'})); return; }
// THE GAME'S CALL, NOT A LOOKALIKE (9/28). bohemia_world.js builds a block as
// generate(seed>>>0, {cw,ch,streets,district}). The first cut of this file passed one object
// as the seed, a call the game never makes, and it drew a dam with 5,329 water cells; the
// game's own call draws 5,832. Same finding, a third of the block, but the number he read
// has to be the number the game makes.
const res=d.generate(7>>>0,{cw:1,ch:1,streets:['S'],district:'dam'});
const g=res&&(res.g||res.grid);
if(!g){ fs.writeFileSync(OUTF, JSON.stringify({error:'the dam generator returned no grid'})); return; }
const H=g.length, W=g[0].length, cls=[];
for(let y=0;y<H;y++){ const row=[];
  for(let x=0;x<W;x++){ const c=g[y][x], L=d.legend[c];
    const ly=K.tileLayer(L||{kind:'ground'});
    const water=!!(L&&(L.kind==='water'));
    row.push({s:!!ly.solid, v:ly['void']===true, w:water});
  } cls.push(row); }
fs.writeFileSync(OUTF, JSON.stringify({W:W,H:H,cls:cls}));
'''


def harvest():
    """ASK THE GAME, DO NOT MODEL IT. The grid and every cell's class come out of the
    engine the walked surface uses. A python re-implementation of the dam would be a
    second opinion, and a second opinion is exactly the bug this round is about."""
    tmp = os.path.join(ROOT, '.dam_harvest.js')
    outf = os.path.join(ROOT, '.dam_harvest.json')
    open(tmp, 'w').write(HARVEST)
    try:
        subprocess.run(['node', tmp, os.path.join(ROOT, 'engine'), outf],
                       cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                       timeout=300)
        if not os.path.exists(outf):
            sys.exit('REFUSING: the harvester wrote nothing. This picture is only worth '
                     'anything if the block came out of the real generator.')
        d = json.load(open(outf))
    finally:
        for f in (tmp, outf):
            if os.path.exists(f):
                os.remove(f)
    if d.get('error'):
        sys.exit('REFUSING: ' + d['error'])
    return d


def panel(d, fixed):
    """The same grid, coloured by one question. `fixed` False draws what the game believed
    before this round: an unknown kind falls to walkable floor, so live water stands."""
    W, H = d['W'], d['H']
    im = Image.new('RGB', (W, H))
    px = im.load()
    n = {'stand': 0, 'wall': 0, 'void': 0, 'wrong': 0}
    for y in range(H):
        for x in range(W):
            c = d['cls'][y][x]
            if c['s']:
                px[x, y] = WALL; n['wall'] += 1
            elif c['w'] and c['v']:
                if fixed:
                    px[x, y] = VOIDC; n['void'] += 1
                else:
                    px[x, y] = WRONG; n['wrong'] += 1
            elif c['v']:
                px[x, y] = VOIDC; n['void'] += 1
            else:
                px[x, y] = STAND; n['stand'] += 1
    return im, n


def caption(W, text):
    """ONE LABEL, LEFT, AND NOTHING ELSE. The first cut put a count on the right of the
    same 128-wide band and the two strings LANDED ON TOP OF EACH OTHER -- the default font
    is proportional, so 'how many characters fit' is not a number you can assume. The
    counts belong under the picture where there is room for them, not fighting the title
    for the same thirteen pixels."""
    im = Image.new('RGB', (W, BAND), (26, 26, 30))
    dr = ImageDraw.Draw(im)
    dr.rectangle([0, BAND - 1, W - 1, BAND - 1], fill=(70, 70, 80))
    # AND THE WIDTH IS MEASURED, NOT ASSUMED. The second cut still ran off the right edge
    # ('...YOU COULD WALK' with the last word sliced in half) because I shortened the
    # string by eye instead of asking how wide it draws. A label that does not fit its band
    # is the same defect as a cell that does not match its drawing, one layer out.
    if dr.textlength(text) > W - 6:
        sys.exit('REFUSING: the label %r draws %d px wide in a %d px band. Shorten it; do '
                 'not ship a picture with its own title cut in half.'
                 % (text, dr.textlength(text), W - 6))
    dr.text((3, 2), text, fill=(226, 232, 226))
    return im


def main():
    d = harvest()
    W, H = d['W'], d['H']
    before, nb = panel(d, False)
    after, na = panel(d, True)
    if nb['wrong'] == 0:
        sys.exit('REFUSING: nothing on this block is standable water, so there is no '
                 'before to show. If the dam legend changed, this picture is a lie.')

    sheet = Image.new('RGB', (W, (H + BAND) * 2), (26, 26, 30))
    sheet.paste(caption(W, 'BEFORE: WALKABLE'), (0, 0))
    sheet.paste(before, (0, BAND))
    sheet.paste(caption(W, 'AFTER: WATER'), (0, H + BAND))
    sheet.paste(after, (0, H + BAND * 2))
    sheet = sheet.resize((W * SCALE, (H + BAND) * 2 * SCALE), Image.NEAREST)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    sheet.save(OUT)

    tot = W * H
    print('THE WATER YOU COULD STAND ON  (row [honest grid], rule 34b)')
    print('  THE DAM, off its own generator, one fixed seed. Every cell coloured by ONE')
    print('  question: may a body stand here. Nothing illustrated.')
    print('  block                : %d x %d = %d cells' % (W, H, tot))
    print('  BEFORE  standable    : %5d  (%.1f%%)' % (nb['stand'] + nb['wrong'],
                                                      (nb['stand'] + nb['wrong']) / tot * 100))
    print('          of which WATER: %5d  (%.1f%% of the block was standable reservoir)'
          % (nb['wrong'], nb['wrong'] / tot * 100))
    print('          solid        : %5d' % nb['wall'])
    print('  AFTER   standable    : %5d  (%.1f%%)' % (na['stand'], na['stand'] / tot * 100))
    print('          void (water) : %5d' % na['void'])
    print('          solid        : %5d  (unchanged: nothing moved, only what you may do)'
          % na['wall'])
    print('  grid + classes from  : the registered dam district and the kit\'s own tileLayer')
    print('  wrote                : %s (%d x %d)'
          % (OUT, W * SCALE, (H + BAND) * 2 * SCALE))


if __name__ == '__main__':
    main()
