#!/usr/bin/env python3
"""BOHEMIA — THE STREET FALLS AND THE EMPTY HOUSE STAYS LIT (9/28/26, LIFE + CITY, [three cities]).

THE ROUND'S COOK (rule 22), AND IT IS THE ROW ITSELF, BOTH WAYS.

WHAT HE RULED, IN ORDER:
  - He voted UP "THE SAME STREET, THREE TIMES", whose card said "Thumbs up and this is how
    the city screen draws the act you are in." NOTES ARE RULINGS: that is the LOOK of the
    better direction, approved.
  - Rule 37(c), his third votes: "the future could get worse... you could choose the origin
    as a raiding party and then three acts later the buildings that you destroyed or the
    people that you raided... really the future is a reflection of your past actions."
So act 3 is no longer one picture. It is whatever the family's past left standing.

*** EVERY COUNT HERE IS THE GAME'S, NONE IS MINE. ***
  - The PASTS are WORLD's own fixtures from gates/three_acts_gate.js, the ones that gate
    proves the derive with: a BUILDING past (16 homes put up), DOING NOTHING (10 put up), a
    RAIDING past (10 put up, 6 torn down). Recorded into the real century ledger
    (engine/bohemia_century.js) and handed to the real derive (engine/bohemia_future.js)
    over the real valley (seed 1337's overmap, measured the same way that gate measures it).
  - WHAT STANDS in each panel is the derive's own `valley.standing`, and WHAT WAS TORN DOWN
    is the ledger's own `demolished`, both scaled onto this block's eight built things by one
    fixed ratio: the BUILDING past is the full approved act-3 street, because that is the
    picture he approved as "a street that got better". That anchor is the one choice in this
    file, it is written here, and it is the same for every panel.

*** AND THE ONE THING THE DERIVE CANNOT DO, THIS PICTURE DOES NOT DO EITHER. *** Razing the
city that was ALREADY standing is UNREAD in the derive -- WORLD names it by name ('razed':
"homes() returns [] on a fresh valley"). So no panel knocks down an original house. What a
raiding past destroys here is what the family itself put up: the panels, the cabinet, the
swap stand. When the derive learns to count 'razed', this picture learns with it.

THE SPINE, AND IT IS TRUE TO THE DATA, NOT A STYLE: the derive's `reclaimed.lit` is ALWAYS 0
("what relights a circuit is a price and prices are his") -- so the old circuit's light
never changes in any past. The third house is lit with nobody in it after a building past,
after doing nothing, and after a raid. THE STREET FALLS AND THE EMPTY HOUSE STAYS LIT.
Analog horror (bible rules 1 and 7): one ordinary frame, one wrong thing, drawn from data.

REUSE CHECK: every pixel is the approved street's own panel() out of
tools/bohemia_the_same_street_three_times_factory.py, imported, with its built things named
and switched instead of redrawn (the approved picture was proved byte-identical after the
split). The counts come from engine/bohemia_century.js and engine/bohemia_future.js; the
valley from engine/bohemia_overmap.js, bohemia_powergrid.js and bohemia_housing.js. The only
new pixels are the remains of a torn-down thing.

REFERENCE CHECK:
  AH-01    the ordinary frame with ONE wrong thing. Held: four quiet night plans, and the
           one warm window is the only thing identical in all four.
  BLDG-03  three planes, one light direction. Held: the approved street's own planes; the
           remains sit on the same roofs and slabs under the same light.
  BLDG-05  structural sanity. Held: a stripped cabinet is still a box on the ground, a
           torn array leaves its rack on the roof, a scorched stand leaves its slab.

DETERMINISTIC. REFUSES if the derive stops ranking the pasts the way his ruling says
(raid < nothing < building), because then the picture would be illustrating a claim the
game no longer makes.

Run from repo root:  python3 tools/bohemia_the_street_falls_and_the_house_stays_lit_factory.py
Writes: slices/vote/LIFECITY_THE_STREET_FALLS_AND_THE_HOUSE_STAYS_LIT_9_28.png
"""
import importlib.util, json, os, subprocess, sys
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
spec = importlib.util.spec_from_file_location(
    'street', os.path.join(HERE, 'bohemia_the_same_street_three_times_factory.py'))
street = importlib.util.module_from_spec(spec)
spec.loader.exec_module(street)

OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_THE_STREET_FALLS_AND_THE_HOUSE_STAYS_LIT_9_28.png')
W, H, BAND, SCALE = street.W, street.H, 13, 3

# WORLD's fixtures, verbatim from gates/three_acts_gate.js section 'the future goes BOTH ways'.
PASTS = [('BUILT', 16, 0), ('DID NOTHING', 10, 0), ('RAIDED', 10, 6)]

# THE LABELS SAY WHAT THE LEDGER SAYS. WORLD's gate calls its middle fixture "doing nothing",
# but that past BUILT TEN HOMES; printing "you did nothing" over it would be a false sentence
# in his tab. So each panel is named by what its ledger actually holds.
LABEL = {'BUILT': 'ACT 3: YOU BUILT A LOT', 'DID NOTHING': 'ACT 3: YOU BUILT SOME',
         'RAIDED': 'ACT 3: YOU TORE IT DOWN'}

# What a raider takes first. Hardware and the thing that pays go before the road does; the
# windows an array fed go dark with it. Only ever applied to things the ledger says stood.
STRIP_ORDER = ['array1', 'topwin', 'swap', 'array2', 'lamp2', 'kerbs', 'farwin', 'patches']

HARVEST = r'''
process.exit=function(){}; console.log=function(){};
const path=require('path'), fs=require('fs'); const ROOT=process.argv[2], OUTF=process.argv[3];
const R=p=>require(path.join(ROOT,p));
const C=R('engine/bohemia_century.js'), F=R('engine/bohemia_future.js');
const OM=R('engine/bohemia_overmap.js'), CE=R('engine/bohemia_cityedit.js');
const PG=R('engine/bohemia_powergrid.js'), HO=R('engine/bohemia_housing.js');
/* the real valley, measured exactly as gates/three_acts_gate.js realLayout(1337) does */
const m=OM.buildOvermap(1337), grid=PG.powerMap(m,1337);
let lit=0, st=0; for(let y=0;y<96;y++) for(let x=0;x<96;x++){ const s=grid.at(x,y); if(s&&s.id>=0){ st++; if(s.live) lit++; } }
let standing=0; try{ standing=HO.homes?(HO.homes(m,CE.cat)||[]).length:0; }catch(e){}
const LAYOUT={cells:96*96, lit:lit, standing:standing, people:HO.valleyPeople(m,CE.cat)|0, street:st};
function past(built,razed){ const c=C.make({act:1});
  for(let i=0;i<built;i++) C.note(c,'build',{type:'home',x:i*3,y:1,w:2,h:2},i);
  for(let i=0;i<razed;i++) C.note(c,'demolish',{type:'home',x:i*3,y:1,w:2,h:2},50+i);
  return c; }
const out={layout:LAYOUT, pasts:[]};
for(const [label,b,r] of JSON.parse(process.argv[4])){
  const c=past(b,r), d=F.derive(LAYOUT,{century:c},3), t=C.through(c,3);
  out.pasts.push({label:label, ok:d.ok, standing:d.valley.standing, went:d.went.standing,
                  lit:d.valley.lit, litWent:d.went.lit, built:t.built, demolished:t.demolished,
                  unread:d.unread});
}
fs.writeFileSync(OUTF, JSON.stringify(out));
'''


def harvest():
    tmp, outf = os.path.join(ROOT, '.falls_harvest.js'), os.path.join(ROOT, '.falls_harvest.json')
    open(tmp, 'w').write(HARVEST)
    try:
        subprocess.run(['node', tmp, ROOT, outf, json.dumps(PASTS)], cwd=ROOT,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=300)
        if not os.path.exists(outf):
            sys.exit('REFUSING: the harvester wrote nothing.')
        return json.load(open(outf))
    finally:
        for f in (tmp, outf):
            if os.path.exists(f):
                os.remove(f)


def caption(text):
    im = Image.new('RGB', (W, BAND), (22, 22, 26))
    dr = ImageDraw.Draw(im)
    if dr.textlength(text) > W - 6:
        sys.exit('REFUSING: the label %r does not fit its band.' % text)
    dr.rectangle([0, BAND - 1, W - 1, BAND - 1], fill=(64, 64, 72))
    dr.text((3, 2), text, fill=(226, 232, 226))
    return im


def main():
    data = harvest()
    ps = data['pasts']
    if not all(p['ok'] for p in ps):
        sys.exit('REFUSING: the derive did not answer for every past: %r' % ps)
    by = {p['label']: p for p in ps}
    if not (by['RAIDED']['standing'] < by['DID NOTHING']['standing'] < by['BUILT']['standing']):
        sys.exit('REFUSING: the derive no longer ranks raid < nothing < building, so this picture '
                 'would illustrate a claim the game does not make: %r' % ps)
    if any(p['litWent'] != 0 for p in ps):
        sys.exit('REFUSING: the derive now moves the light (%r). The spine of this picture -- the '
                 'empty house stays lit whatever you did -- stopped being true; redraw it.' % ps)

    ref = by['BUILT']['standing']
    n = len(street.ITEMS)
    P = street._pal()
    panels = [('ACT 1: THE RUIN', street.panel(P, 1))]
    plan = []
    for p in ps:
        ever = min(n, round(n * p['built'] / ref))
        stand = max(0, min(ever, round(n * p['standing'] / ref)))
        built_items = street.ITEMS[:ever]
        torn = [k for k in STRIP_ORDER if k in built_items][:ever - stand]
        has = [k for k in built_items if k not in torn]
        plan.append((p, has, torn))
        panels.append((LABEL[p['label']], street.panel(P, 3, has=has, torn=torn)))

    sheet = Image.new('RGB', (W * 2 + 2, (H + BAND) * 2 + 2), (12, 12, 14))
    for i, (lab, im) in enumerate(panels):
        cx, cy = (i % 2) * (W + 2), (i // 2) * (H + BAND + 2)
        sheet.paste(caption(lab), (cx, cy))
        sheet.paste(im, (cx, cy + BAND))
    sheet = sheet.resize((sheet.width * SCALE, sheet.height * SCALE), Image.NEAREST)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    sheet.save(OUT)

    L = data['layout']
    print('THE STREET FALLS AND THE EMPTY HOUSE STAYS LIT  ([three cities], rule 37c)')
    print('  the real valley, seed 1337: %d cells, %d street, %d lit, %d people, %d standing'
          % (L['cells'], L['street'], L['lit'], L['people'], L['standing']))
    for p, has, torn in plan:
        print('  %-12s built %2d  torn down %d  -> act 3 standing %2d (went %+d), lit went %+d'
              % (p['label'], p['built'], p['demolished'], p['standing'], p['went'], p['litWent']))
        print('               on this block: standing %s' % (', '.join(has) or 'nothing'))
        print('                              torn down %s' % (', '.join(torn) or 'nothing'))
    print('  UNREAD, named not faked: %s' % ', '.join(ps[-1]['unread']))
    print('  wrote %s (%d x %d)' % (OUT, sheet.width, sheet.height))


if __name__ == '__main__':
    main()
