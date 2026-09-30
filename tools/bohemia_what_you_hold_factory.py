#!/usr/bin/env python3
"""BOHEMIA — WHAT YOU HOLD (9/30/26, LIFE + CITY, row [build a lot], round 2, rule 43).

THE ROUND'S COOK (rule 22): rule 43 running for real, on the street he approved.

HIS QUESTION, 9/29: "can you only build on your base... is the base not a base anymore but a
settlement that will be blocks and blocks of Las Vegas... or the Pocket City 2 route". The board's
default A: YOU BUILD WHAT YOU HOLD, AND WHAT YOU HOLD GROWS. Who holds a part is FACTIONS' ledger
(engine/bohemia_homebases.js), and the build module asks it on every start and every day. THREE
PANELS, THE SAME STREET, the module and the ledger run exactly as the settlement screen will run them:

  day 0   the Mob holds this part: the build is REFUSED, by name, and costs nothing
  day 2   the company took it on day 1 and put up the first two things a held part builds (the
          invasive round: a WALL, because hogs eat the gardens, and a lidded WATER TANK, because
          pigeons foul open water); the tank has made its first water
  day 3   a raid RUINED the part: everything built there falls, as demolishes the real derive
          counts, and act 3 inherits that many fewer

The captions under each panel are the module's and the ledger's own words and numbers; the factory
refuses if what a panel draws and what the module says stands (or fell) ever disagree.

THE ANALOG HORROR LINE (rule 30): the wall and the tank go up and come down, and the third house's
window is lit the whole time, on a circuit nobody pays for, through every owner the street has.

REUSE CHECK: every pixel is the approved street's own panel() out of
tools/bohemia_the_same_street_three_times_factory.py; the wall and the tank were added to it this round
as LOT_ITEMS, drawn only when a panel names them, so the approved pictures are byte-identical (checked
with md5 the round they were added). Money: engine/bohemia_lotbuild.js on engine/bohemia_purse.js;
deeds: engine/bohemia_century.js; the act-3 figure: engine/bohemia_future.js; who holds the part:
engine/bohemia_homebases.js. Only captions are drawn here.

REFERENCE CHECK:
  AH-01    the ordinary frame with ONE wrong thing. Held: the approved street's own frames; the warm
           window is the only light nobody built, and it outlasts every owner.
  BLDG-03  three planes, one light direction. Held: the wall's lit top faces north like every roof
           edge on the street; the tank's shadow falls south like the houses'.
  BLDG-05  structural sanity. Held: the wall joins the side walls the block already has and leaves
           the driveway open; the tank stands on a stand behind the house with a downpipe off the
           roof; fallen, the footing stays, the stand stays, the drum lies on its side.

DETERMINISTIC.

Run from repo root:  python3 tools/bohemia_what_you_hold_factory.py
Writes: slices/vote/LIFECITY_WHAT_YOU_HOLD_9_30.png
"""
import importlib.util, json, os, subprocess, sys
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
spec = importlib.util.spec_from_file_location(
    'street', os.path.join(HERE, 'bohemia_the_same_street_three_times_factory.py'))
street = importlib.util.module_from_spec(spec)
spec.loader.exec_module(street)

OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_WHAT_YOU_HOLD_9_30.png')
W, H, BAND, SCALE = street.W, street.H, 50, 2
DRAWN_AS = {'wall': ['wall'], 'tank': ['tank']}

HARVEST = r'''
process.exit=function(){}; console.log=function(){};
const path=require('path'), fs=require('fs'); const ROOT=process.argv[2], OUTF=process.argv[3];
const R=p=>require(path.join(ROOT,p));
const LB=R('engine/bohemia_lotbuild.js'), P=R('engine/bohemia_purse.js'), C=R('engine/bohemia_century.js'),
      F=R('engine/bohemia_future.js'), HB=R('engine/bohemia_homebases.js');
const purse=P.create({}); P.credit(purse,'electricity',3,'start','the company',0);
const hold={rec:HB.make({act:1}),act:1}, s=LB.site({base:'mob'}), cen=C.make({act:1});
const L={cells:9216,lit:425,standing:0,people:215};
const water=()=>purse.entries.filter(e=>/^produce:lot:(tank|pump)$/.test(e.reason)).reduce((a,e)=>a+e.amount,0);
const bal=()=>({battery:P.balance(purse,'electricity'), water:water()});
const standingIds=()=>Object.values(s.lots).filter(l=>l.done).map(l=>l.id);
const days=[];
const no=LB.start(s,purse,{x:1,y:1},'wall',0,hold);
days.push({day:0, holder:LB.holderOf(s,hold).holder, why:no.why||null, standing:standingIds(), fell:[], money:bal(),
           act3:F.derive(L,{century:cen},3).valley.standing});
HB.took(hold.rec,{base:'mob',to:HB.YOU,day:1,why:'contract'});
const a=LB.start(s,purse,{x:1,y:1},'wall',1,hold), b=LB.start(s,purse,{x:2,y:0},'tank',1,hold);
LB.tick(s,purse,cen,1,hold); LB.tick(s,purse,cen,2,hold);
days.push({day:2, holder:LB.holderOf(s,hold).holder, ok:a.ok&&b.ok, standing:standingIds(), fell:[], money:bal(),
           act3:F.derive(L,{century:cen},3).valley.standing});
HB.ruined(hold.rec,{base:'mob',day:3,why:'raid'});
const t=LB.tick(s,purse,cen,3,hold);
days.push({day:3, holder:null, state:t.state, standing:standingIds(), fell:t.fell, money:bal(),
           act3:F.derive(L,{century:cen},3).valley.standing});
fs.writeFileSync(OUTF, JSON.stringify({days:days}));
'''


def harvest():
    tmp, outf = os.path.join(ROOT, '.whatyouhold.js'), os.path.join(ROOT, '.whatyouhold.json')
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
    d0, d2, d3 = data['days']
    # THE REFUSALS: the picture only says what the module and the ledger said.
    if d0['why'] != 'NOT_HELD' or d0['holder'] != 'mob' or d0['money']['battery'] != 3:
        sys.exit('REFUSING: day 0 is not a refusal on the Mob\'s part that cost nothing: %r' % d0)
    if not d2.get('ok') or d2['holder'] != 'you' or sorted(d2['standing']) != ['tank', 'wall']:
        sys.exit('REFUSING: day 2 does not have the wall and the tank standing on a part you hold: %r' % d2)
    if d3['state'] != 'ruined' or sorted(d3['fell']) != ['tank', 'wall'] or d3['standing']:
        sys.exit('REFUSING: day 3 is not everything falling on a ruined part: %r' % d3)
    if d3['act3'] != d2['act3'] - 2:
        sys.exit('REFUSING: the real derive did not lose the two that fell (%s -> %s).' % (d2['act3'], d3['act3']))

    P = street._pal()
    WHITE, GREEN, RED = (232, 234, 228), (190, 204, 170), (226, 150, 132)
    def money(dd):
        return 'BATTERIES %d  WATER %d' % (dd['money']['battery'], dd['money']['water'])
    rows = [
        ([('DAY 0: THE MOB HOLDS IT', WHITE), ('BUILD A WALL? REFUSED', RED),
          (money(d0), GREEN), ('ACT 3 KEEPS %d' % d0['act3'], GREEN)], [], []),
        ([('DAY 2: YOU TOOK IT', WHITE), ('UP: A WALL, A LIDDED TANK', GREEN),
          (money(d2), GREEN), ('ACT 3 KEEPS %d' % d2['act3'], GREEN)],
         sorted({k for i in d2['standing'] for k in DRAWN_AS.get(i, [])}), []),
        ([('DAY 3: RAIDED AND RUINED', WHITE), ('WHAT YOU BUILT FELL', RED),
          (money(d3), GREEN), ('ACT 3 KEEPS %d' % d3['act3'], RED)],
         [], sorted({k for i in d3['fell'] for k in DRAWN_AS.get(i, [])})),
    ]
    sheet = Image.new('RGB', (W * 3 + 4, H + BAND), (12, 12, 14))
    for i, (cap, has, torn) in enumerate(rows):
        sheet.paste(caption(cap), (i * (W + 2), 0))
        sheet.paste(street.panel(P, 1, has=has, torn=torn), (i * (W + 2), BAND))
    sheet = sheet.resize((sheet.width * SCALE, sheet.height * SCALE), Image.NEAREST)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    sheet.save(OUT)
    print('WHAT YOU HOLD  ([build a lot] round 2, rule 43)')
    for dd in data['days']:
        print('  day %d  holder %-5s standing %-10s fell %-10s %s' % (
            dd['day'], dd.get('holder'), ','.join(dd['standing']) or '-', ','.join(dd['fell']) or '-', dd['money']))
    print('  act 3 keeps %d, then %d (the real derive)' % (d2['act3'], d3['act3']))
    print('  wrote %s (%d x %d)' % (OUT, sheet.width, sheet.height))


if __name__ == '__main__':
    main()
