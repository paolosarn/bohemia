#!/usr/bin/env python3
"""BOHEMIA — TWO DAYS OF BUILDING ON YOUR LOT (9/29/26, LIFE + CITY, row [build a lot]).

THE ROUND'S COOK (rule 22): rule 40(b) running for real, on the street he approved.

WHY THIS AND NOT A CATALOG SHEET. The first cook this round cut every buildable out of its district's
map block, and two passes later the cards still read as flat blocks -- the look he has killed three
times ("this isn't Atari"). That sheet is kept under records/ and never registered. The finished art
for each piece is COOK's and DIRECTION's. What THIS lane owns is what a building DOES, so this picture
shows that, in the only art for these things he has already approved: THE SAME STREET (UP, three
times over), whose act-2 and act-3 pictures already draw two of the seven things on the build list --
the SOLAR PANEL with its cabinet on the first roof, and the battery SWAP STAND, which is a stall.

*** THE MONEY UNDER EACH PANEL IS THE BUILD MODULE'S, NOT MINE. *** A home base with two batteries is
handed to engine/bohemia_lotbuild.js and it is run exactly as the settlement screen will run it:
  day 0   build a solar panel on a lot           (one battery, one day)
  day 1   it stands and pays; build a vendor stall (one battery, one day)
  day 2   both stand; the panel pays again and the stall makes a name
The purse is the real one and the century ledger is the real one, and the act-3 count printed at the
end is the real derive's, so what he sees under each day is what the game would hold that day.

THE PAIRING, WRITTEN DOWN: the catalog's SOLAR PANEL is drawn with the street's own array, cabinet and
the windows it lights; the catalog's VENDOR STALL is drawn with the street's own swap stand. The other
five on the list (shed, pump house, garden bed, roof, wall) have no drawing on this street yet; that is
said on the card and routed to COOK, not faked.

THE ANALOG HORROR LINE (rule 30): the family lights the street two windows at a time with a panel and a
stall, and the third house is lit already, with nobody in it, on a circuit nobody pays for.

REUSE CHECK: every pixel is the approved street's own panel() out of
tools/bohemia_the_same_street_three_times_factory.py, with its built things switched by name; the day
by day money is engine/bohemia_lotbuild.js on engine/bohemia_purse.js and engine/bohemia_century.js,
and the act-3 figure is engine/bohemia_future.js. Only captions are drawn here.

REFERENCE CHECK:
  AH-01    the ordinary frame with ONE wrong thing. Held: the approved street's own frames; the one
           warm window is the only light nobody built.
  BLDG-03  three planes, one light direction. Held: the approved street's own planes.
  BLDG-05  structural sanity. Held: the panel sits on a roof, the stall on its slab, the cabinet on
           the ground beside the house, exactly as approved.

DETERMINISTIC. REFUSES if the module's day-by-day money stops matching what the panels show (a panel
drawn standing on a day the module says it is not built, or the other way round).

Run from repo root:  python3 tools/bohemia_two_days_of_building_factory.py
Writes: slices/vote/LIFECITY_TWO_DAYS_OF_BUILDING_9_29.png
"""
import importlib.util, json, os, subprocess, sys
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
spec = importlib.util.spec_from_file_location(
    'street', os.path.join(HERE, 'bohemia_the_same_street_three_times_factory.py'))
street = importlib.util.module_from_spec(spec)
spec.loader.exec_module(street)

OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_TWO_DAYS_OF_BUILDING_9_29.png')
W, H, BAND, SCALE = street.W, street.H, 26, 2
DRAWN_AS = {'solar': ['array1', 'topwin'], 'stall': ['swap']}

HARVEST = r'''
process.exit=function(){}; console.log=function(){};
const path=require('path'), fs=require('fs'); const ROOT=process.argv[2], OUTF=process.argv[3];
const R=p=>require(path.join(ROOT,p));
const LB=R('engine/bohemia_lotbuild.js'), P=R('engine/bohemia_purse.js'), C=R('engine/bohemia_century.js'), F=R('engine/bohemia_future.js');
const purse=P.create({}); P.credit(purse,'electricity',2,'start','home base',0);
const s=LB.site({base:'yours'}), cen=C.make({act:1});
const bal=()=>({battery:P.balance(purse,'electricity'), material:P.balance(purse,'resources'), name:P.balance(purse,'clout')});
const days=[];
function standingIds(){ return Object.values(s.lots).filter(l=>l.done).map(l=>l.id); }
const a=LB.start(s,purse,{x:1,y:1},'solar',0); LB.tick(s,purse,cen,0);
days.push({day:0, did:'BUILD A SOLAR PANEL', ok:a.ok, standing:standingIds(), money:bal()});
LB.tick(s,purse,cen,1); const b=LB.start(s,purse,{x:4,y:1},'stall',1);
days.push({day:1, did:'IT STANDS; BUILD A STALL', ok:b.ok, standing:standingIds(), money:bal()});
LB.tick(s,purse,cen,2);
days.push({day:2, did:'BOTH STAND', ok:true, standing:standingIds(), money:bal()});
const L={cells:9216,lit:425,standing:0,people:215};
fs.writeFileSync(OUTF, JSON.stringify({days:days, act3:F.derive(L,{century:cen},3).valley.standing}));
'''


def harvest():
    tmp, outf = os.path.join(ROOT, '.twodays.js'), os.path.join(ROOT, '.twodays.json')
    open(tmp, 'w').write(HARVEST)
    try:
        subprocess.run(['node', tmp, ROOT, outf], cwd=ROOT, stdout=subprocess.DEVNULL,
                       stderr=subprocess.DEVNULL, timeout=120)
        if not os.path.exists(outf):
            sys.exit('REFUSING: the harvester wrote nothing.')
        return json.load(open(outf))
    finally:
        for f in (tmp, outf):
            if os.path.exists(f):
                os.remove(f)


def caption(lines):
    im = Image.new('RGB', (W, BAND), (22, 22, 26))
    d = ImageDraw.Draw(im)
    for i, (t, col) in enumerate(lines):
        if d.textlength(t) > W - 6:
            sys.exit('REFUSING: %r does not fit its band.' % t)
        d.text((3, 2 + i * 12), t, fill=col)
    return im


def main():
    data = harvest()
    P = street._pal()
    panels = []
    for dd in data['days']:
        if not dd['ok']:
            sys.exit('REFUSING: the module refused a build this picture shows: %r' % dd)
        has = sorted({k for i in dd['standing'] for k in DRAWN_AS.get(i, [])})
        m = dd['money']
        panels.append((caption([('DAY %d: %s' % (dd['day'], dd['did']), (232, 234, 228)),
                                ('BATTERIES %d  MATERIAL %d  NAME %d' % (m['battery'], m['material'], m['name']),
                                 (190, 204, 170))]),
                       street.panel(P, 1, has=has)))
    sheet = Image.new('RGB', (W * 3 + 4, H + BAND), (12, 12, 14))
    for i, (cap, im) in enumerate(panels):
        sheet.paste(cap, (i * (W + 2), 0))
        sheet.paste(im, (i * (W + 2), BAND))
    sheet = sheet.resize((sheet.width * SCALE, sheet.height * SCALE), Image.NEAREST)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    sheet.save(OUT)
    print('TWO DAYS OF BUILDING ON YOUR LOT  ([build a lot], rule 40b)')
    for dd in data['days']:
        print('  day %d  %-26s standing %-16s %s' % (dd['day'], dd['did'], ','.join(dd['standing']) or '-', dd['money']))
    print('  act 3 inherits: %d standing (the real derive)' % data['act3'])
    print('  wrote %s (%d x %d)' % (OUT, sheet.width, sheet.height))


if __name__ == '__main__':
    main()
