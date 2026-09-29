#!/usr/bin/env python3
"""BOHEMIA — THE BUILD LIST (9/29/26, LIFE + CITY, row [build a lot]).

THE ROUND'S COOK (rule 22): what you can build on a lot in your home base, rule 40(b), each thing
shown AS THE GAME ALREADY DRAWS IT, beside what it costs and what it does.

*** EVERY PICTURE IS CUT OUT OF THE GAME, NONE IS DRAWN HERE. *** Rule 32(f): show it from the
game's camera. For each entry of engine/bohemia_lotbuild.js's CATALOG, this runs that piece's own
district generator with the call the game makes (generate(seed>>>0, {cw,ch,streets,district})),
finds the piece's legend code on the block, and crops the biggest run of it with a margin, coloured
by that district's own palette. The words under each card come from the same module's list(): the
cost, the days, what it makes -- so the card and the game cannot say different things.

THE ANALOG HORROR LINE (rule 30): a list of ordinary things a family puts up to stay alive, cut out
of a dead city's own ground. The shed is out of a burned trailer park; the pump house is out of the
station that stopped; the stall is out of a swap meet nobody comes to. Nothing on the sheet is new.

REUSE CHECK: every card is a crop of a registered district kit's own generated block, coloured by
that kit's own palette; the catalog, costs and yields are engine/bohemia_lotbuild.js's, which reads
its yields from the purse and WORLD's power-building ruling. This file draws only frames and words.

REFERENCE CHECK:
  AH-01    the ordinary frame with ONE wrong thing. Held: plain cards, one quiet colour each; the
           only loud thing is a thing you can build, on the ground it came from.
  BLDG-03  structure reads. Held: every piece keeps its own kit's planes and palette, untouched.
  BLDG-05  structural sanity. Held: each crop keeps a margin of the ground it stood on, so a shed
           is still standing in a yard and a panel still sits in a field.

DETERMINISTIC. REFUSES if any catalog piece cannot be found on its own district's block.

Run from repo root:  python3 tools/bohemia_the_build_list_factory.py
Writes: slices/vote/LIFECITY_THE_BUILD_LIST_9_29.png
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# NOT PUBLISHED, AND WHY (9/29). Two passes and the cards still read as flat map-colour blocks: the
# pump house came out a blank roof and the first wall was a whole neighbourhood's perimeter. That is
# the look he has killed three times ('this isn't Atari'), and the finished art for these pieces is
# COOK's and DIRECTION's, from the street he approved. Kept for the record, never registered.
OUT = os.path.join(ROOT, 'records', 'lifecity_pictures', 'LIFECITY_THE_BUILD_LIST_9_29.png')
CARD, PIC, MARGIN, SCALE = 132, 104, 4, 3

HARVEST = r'''
process.exit=function(){}; console.log=function(){};
const fs=require('fs'), path=require('path'); const ROOT=process.argv[2], OUTF=process.argv[3];
const E=path.join(ROOT,'engine'); const K=require(path.join(E,'bohemia_district_kit.js'));
for(const f of fs.readdirSync(E).filter(n=>n.endsWith('.js'))){ try{require(path.join(E,f));}catch(e){} }
const LB=require(path.join(E,'bohemia_lotbuild.js')), P=require(path.join(E,'bohemia_purse.js'));
const purse=P.create({}); P.credit(purse,'electricity',1,'card','card',0);
const rows=LB.list(LB.site({}),purse), out=[];
for(const e of LB.CATALOG){
  const d=K.get(e.piece.kit); const r=d.generate(7>>>0,{cw:1,ch:1,streets:['S'],district:e.piece.kit});
  const g=r.g||r.grid, H=g.length, W=g[0].length, code=e.piece.code;
  /* ONE OF THEM, NOT THE BIGGEST. The first cut cropped the biggest run of each code, and the
     biggest run of 'wall' is a whole neighbourhood's perimeter and the biggest 'pump house' is a
     whole station, so the cards showed places instead of things. The run whose size is the MEDIAN
     is the ordinary one: one shed, one stretch of wall. */
  const seen=new Uint8Array(W*H); const runs=[];
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){ if(g[y][x]!==code||seen[y*W+x]) continue;
    const st=[[x,y]]; seen[y*W+x]=1; let n=0,x0=x,x1=x,y0=y,y1=y;
    while(st.length){ const [cx,cy]=st.pop(); n++; x0=Math.min(x0,cx);x1=Math.max(x1,cx);y0=Math.min(y0,cy);y1=Math.max(y1,cy);
      for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=cx+dx, ny=cy+dy;
        if(nx>=0&&ny>=0&&nx<W&&ny<H&&!seen[ny*W+nx]&&g[ny][nx]===code){ seen[ny*W+nx]=1; st.push([nx,ny]); } } }
    runs.push({n,x0,x1,y0,y1}); }
  runs.sort((a,b)=>a.n-b.n); const best=runs.length?runs[Math.floor(runs.length/2)]:null;
  if(!best){ out.push({id:e.id, error:'piece '+e.piece.kit+':'+code+' is not on its block'}); continue; }
  const pal=d.palette||{}; const row=rows.find(x=>x.id===e.id);
  out.push({id:e.id, name:e.name, says:e.says, box:best, grid:g, pal:pal, W:W, H:H, list:row});
}
fs.writeFileSync(OUTF, JSON.stringify(out));
'''


def harvest():
    tmp, outf = os.path.join(ROOT, '.buildlist.js'), os.path.join(ROOT, '.buildlist.json')
    open(tmp, 'w').write(HARVEST)
    try:
        subprocess.run(['node', tmp, ROOT, outf], cwd=ROOT, stdout=subprocess.DEVNULL,
                       stderr=subprocess.DEVNULL, timeout=300)
        if not os.path.exists(outf):
            sys.exit('REFUSING: the harvester wrote nothing.')
        res = json.load(open(outf))
    finally:
        for f in (tmp, outf):
            if os.path.exists(f):
                os.remove(f)
    bad = [r for r in res if r.get('error')]
    if bad:
        sys.exit('REFUSING: ' + '; '.join(r['id'] + ': ' + r['error'] for r in bad))
    return res


def hexrgb(h, fallback=(40, 38, 34)):
    try:
        return (int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16))
    except Exception:
        return fallback


def crop(r):
    b = r['box']
    # a window, not the whole run: a long wall is shown as a stretch of wall with its yard
    side = min(max(b['x1'] - b['x0'], b['y1'] - b['y0']) + 1, 22) + 2 * MARGIN
    cx, cy = (b['x0'] + b['x1']) // 2, (b['y0'] + b['y1']) // 2
    x0, y0 = cx - side // 2, cy - side // 2
    im = Image.new('RGB', (side, side), (18, 18, 20))
    px = im.load()
    for y in range(side):
        for x in range(side):
            gx, gy = x0 + x, y0 + y
            if 0 <= gx < r['W'] and 0 <= gy < r['H']:
                px[x, y] = hexrgb(r['pal'].get(str(r['grid'][gy][gx])))
    return im.resize((PIC, PIC), Image.NEAREST)


def makes_line(row):
    if row['houses']:
        return 'HOUSES A FAMILY'
    m = row['makes']
    if not m:
        return 'MAKES NOTHING'
    word = {'resources': 'MATERIAL', 'electricity': 'BATTERY', 'clout': 'NAME'}
    k = list(m)[0]
    return 'MAKES %d %s A DAY' % (m[k], word.get(k, k.upper()))


def card(r):
    row = r['list']
    im = Image.new('RGB', (CARD, CARD + 36), (24, 24, 28))
    im.paste(crop(r), ((CARD - PIC) // 2, 4))
    d = ImageDraw.Draw(im)
    lines = [(r['name'], (232, 234, 228)),
             ('%d BATTERY, %d DAY' % (row['cost']['amount'], row['days']), (160, 176, 168)),
             (makes_line(row), (200, 214, 176))]
    y = PIC + 7
    for text, col in lines:
        if d.textlength(text) > CARD - 6:
            sys.exit('REFUSING: %r does not fit its card.' % text)
        d.text(((CARD - d.textlength(text)) // 2, y), text, fill=col)
        y += 10
    return im


def main():
    res = harvest()
    cols = 4
    rows = (len(res) + cols - 1) // cols
    ch = CARD + 36
    sheet = Image.new('RGB', (cols * CARD + (cols - 1) * 2, rows * ch + (rows - 1) * 2), (12, 12, 14))
    for i, r in enumerate(res):
        sheet.paste(card(r), ((i % cols) * (CARD + 2), (i // cols) * (ch + 2)))
    # the empty slot says what we do that Battle Brothers does not
    if len(res) % cols:
        d = ImageDraw.Draw(sheet)
        x, y = (len(res) % cols) * (CARD + 2), (rows - 1) * (ch + 2)
        for j, t in enumerate(['YOU BUILD IT', 'YOURSELF,', 'ON YOUR OWN LOT,', 'AND THE NEXT', 'GENERATION', 'INHERITS IT', '', 'PIECES FROM THE', 'CITY MAP; THE', 'FINISHED ART IS', 'COOK\'S, FROM YOUR', 'APPROVED STREET']):
            d.text((x + (CARD - d.textlength(t)) // 2, y + 12 + j * 12), t,
                   fill=(214, 200, 160) if j < 6 else (140, 150, 146))
    sheet = sheet.resize((sheet.width * SCALE // 2, sheet.height * SCALE // 2), Image.NEAREST)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    sheet.save(OUT)
    print('THE BUILD LIST  ([build a lot], rule 40b)')
    for r in res:
        print('  %-13s from %-12s %s' % (r['name'], r['id'] and r['list'] and '', makes_line(r['list'])))
    print('  wrote %s (%d x %d)' % (OUT, sheet.width, sheet.height))


if __name__ == '__main__':
    main()
