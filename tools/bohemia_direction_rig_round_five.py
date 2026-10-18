#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the rig round five]: THE ROBOT THROUGH THE TEN CHECKS, AND THE SHEET (research round two
Section E: 'do not start a third character until the robot passes D1 to D10 green and he has thumbed the finished
eight'; rule 114b: PLUMBER's ten checks are tools/bohemia_not_vibe_coded.py, read here, never copied).

Reads the round-five renders in records/target/direction_rig_round_five/ (robot, truck, drum, drum_seed2; made by
tools/bohemia_direction_master_rig.py round five, the robot finished by tools/bohemia_direction_hand_finish.py) and:
  1. THE REPORT (report.json): every subject's S facing through D1 to D10 the way the NOT VIBE CODED gate holds a
     rendered class (D1 and D6 to D9 as measured, D2 to D5 as the gate's held verdict reads them under the style
     guide), round two's R2 (binary alpha, no boundary-only colour) on every facing, and R8 (the eight facings agree)
     under the guide's field 10 per class; the robot twice, raw and finished; and last round's renders beside them so
     the change is a number.
  2. THE SHEET (DIRECTION_THE_RIG_ROUND_FIVE.png): the robot's eight raw above the finished eight, the truck last round
     beside this round, the drum's two wear seeds, every one at 1:1 on his ground and again at 2x, the shadow laid
     under each body from its own layer, and the report's rows printed under it in the project's font.

    python3 tools/bohemia_direction_rig_round_five.py
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools')); sys.path.insert(0, os.path.join(ROOT, 'gates'))
import bohemia_not_vibe_coded as N  # noqa: E402

D = os.path.join(ROOT, 'records/target/direction_rig_round_five')
OLD = os.path.join(ROOT, 'records/target/direction_style_guide')
F = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
T = json.load(open(os.path.join(ROOT, 'gates/not_vibe_coded_thresholds.json')))
BANDS = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_NOT_VIBE_CODED_BANDS.json')))
G = N.guide()
FONT = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
BG, INK, DIM, RED, GREEN = (24, 23, 22, 255), (226, 214, 190, 255), (150, 140, 124, 255), (214, 74, 60, 255), (126, 178, 120, 255)
BOARD = os.path.join(ROOT, 'reference/art_bank/fight_board/COMBAT2_BOARD_SMALL_10_16.webp')
SUBJECTS = [('robot', 'person', 'rig'), ('robot', 'person', 'fin'), ('truck', 'vehicle', 'rig'), ('drum', 'prop', 'rig'), ('drum_seed2', 'prop', 'rig')]


def g6(paths, cls):
    """field 10's eight-facing rule as the guide now reads it per class (decisions_against_the_research[3])"""
    rule = G['fields'][9]['value']['eight_facings_agree']
    per = rule.get('per_class', {}).get(cls)
    r = N.r8_facings(paths, T)
    if per is None: return r['ok'], r['why'] or 'ok', r['value']
    v = r['value']; why = []
    if per['area'] and v['area_spread'] > rule['area_tolerance_pct'] / 100.0: why.append('area spread %.2f' % v['area_spread'])
    rig = json.load(open(os.path.join(os.path.dirname(paths[0]), 'rig.json')))
    if not rig.get('ground_px') or not rig.get('crop_box_px'): why.append('no pivot in rig.json')
    if v['lit_facings'] < per['lit_facings_min']: why.append('light agrees in %d of 8' % v['lit_facings'])
    return not why, '; '.join(why) or 'ok (%s)' % per['reads'], v


def held(p, cls):
    from not_vibe_coded_gate import held_verdict   # the gate's own reading of D1 to D5 for a rendered class
    rep = N.sprite_report(p, 'character', 'upper-left', None, T)
    hv = held_verdict(rep, 'prop' if cls != 'person' else 'all', BANDS, cls, p, G)
    out = {d: [hv[d][0], hv[d][1]] for d in ('D1', 'D2', 'D3', 'D4', 'D5')}
    for d in ('D6', 'D7', 'D8'):
        out[d] = [rep[d]['ok'], rep[d]['why']]
    rgb, a = N.load(p); m = N.d9_mirror(rgb, a, T); out['D9'] = [m['ok'], m['why']]
    out['D10'] = [None, 'the UI leg; a sprite carries no CSS']
    return out


def report_one(subj, cls, pre, base=D):
    paths = [os.path.join(base, subj, '%s_%s.png' % (pre, f)) for f in F]
    if not all(os.path.exists(p) for p in paths): return None
    s = paths[4]
    r2 = [N.r2_alpha(*N.load(p), T) for p in paths]
    ok6, why6, v6 = g6(paths, cls)
    rig = json.load(open(os.path.join(base, subj, 'rig.json')))
    return dict(subject=subj, cls=cls, files=pre, held=held(s, cls),
                R2=[all(x['ok'] for x in r2), '; '.join(sorted(set(x['why'] for x in r2 if x['why']))) or 'ok'],
                R8_research=[N.r8_facings(paths, T)['ok'], N.r8_facings(paths, T)['why'] or 'ok'],
                G6_guide=[ok6, why6], facings=v6, card=rig['card_guide']['verdict'], card_out=[r for r in rig['card_guide']['rows'] if r.startswith('OUT')])


def font(n): return ImageFont.truetype(FONT, n)


def body(subj, pre, f, base=D):
    a = Image.open(os.path.join(base, subj, '%s_%s.png' % (pre, f))).convert('RGBA')
    sp = os.path.join(base, subj, 'shadow_%s.png' % f)
    out = Image.new('RGBA', a.size, (0, 0, 0, 0))
    if os.path.exists(sp): out.alpha_composite(Image.open(sp).convert('RGBA'))
    out.alpha_composite(a); return out


def sheet(rep):
    board = Image.open(BOARD).convert('RGBA')
    rows = [('THE ROBOT, RAW FROM THE RIG (round five)', [body('robot', 'rig', f) for f in F]),
            ('THE ROBOT, FINISHED BY HAND (eyes, lit edge, three highlights, specks out)', [body('robot', 'fin', f) for f in F]),
            ('THE TRUCK, LAST ROUND (frosted) | THIS ROUND (repainted from the palette)', [body('truck', 'rig', f, OLD) for f in ('SE', 'S')] + [body('truck', 'rig', f) for f in ('SE', 'S', 'NW')]),
            ('THE DRUM, TWO WEAR SEEDS (one model, other dirt)', [body('drum', 'rig', f) for f in ('S', 'SE', 'E')] + [body('drum_seed2', 'rig', f) for f in ('S', 'SE', 'E')])]
    W = 2400; pad = 16; y = 60
    heights = [max(i.height for i in ims) for _, ims in rows]
    H = 60 + sum(h * 5 + 120 for h in heights) + 40 + 22 * 26
    out = Image.new('RGBA', (W, H), BG); dr = ImageDraw.Draw(out)
    dr.text((pad, 14), 'THE RIG, ROUND FIVE: THE ROBOT THROUGH THE TEN CHECKS. 57 PX A METRE, ONE SUN FROM THE UPPER LEFT (155.4 DEG ON SCREEN), PALETTE records/target/BOHEMIA_STYLE_PALETTE.json. 1:1 ON HIS GROUND, THEN 2X', font=font(16), fill=INK)
    for (title, ims), h in zip(rows, heights):
        dr.text((pad, y), title, font=font(15), fill=INK); y += 24
        gw = sum(i.width + 6 for i in ims) + 6
        out.paste(board.crop((1640, 1860, 1640 + gw, 1860 + h + 8)), (pad, y))
        xx = pad + 6
        for i in ims: out.alpha_composite(i, (xx, y + 4 + h - i.height)); xx += i.width + 6
        y += h + 20; x2 = pad
        for i in ims:   # the 2x copies wrap onto their own rows, the way a phone shows them
            big = i.resize((i.width * 2, i.height * 2), Image.NEAREST); tile = Image.new('RGBA', big.size, (78, 72, 64, 255)); tile.alpha_composite(big)
            if x2 + big.width > W - pad: x2 = pad; y += h * 2 + 8
            out.paste(tile, (x2, y + (h * 2 - big.height))); x2 += big.width + 8
        y += h * 2 + 40
    mark = {True: 'ok', False: 'NO', None: '--'}
    for r in rep['subjects']:
        hv = r['held']
        line = '%-10s %-3s ' % (r['subject'], r['files']) + ' '.join('%s %s' % (d, mark[hv[d][0]]) for d in ('D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10'))
        line += '  R2 %s  G6 %s  R8(research) %s   %s' % (mark[r['R2'][0]], mark[r['G6_guide'][0]], mark[r['R8_research'][0]], r['card'])
        bad = [d for d in ('D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9') if hv[d][0] is False] + (['R2'] if not r['R2'][0] else []) + (['G6'] if not r['G6_guide'][0] else [])
        dr.text((pad, y), line, font=font(14), fill=RED if bad else GREEN); y += 22
        for d in bad[:3]:
            why = hv[d][1] if d in hv else r[d if d == 'R2' else 'G6_guide'][1]
            dr.text((pad + 30, y), '%s: %s' % (d, str(why)[:150]), font=font(13), fill=DIM); y += 20
    out = out.crop((0, 0, W, y + 20))
    p = os.path.join(D, 'DIRECTION_THE_RIG_ROUND_FIVE.png'); out.convert('RGB').save(p, optimize=True); return p


def main():
    rep = dict(round=5, made='10/18', tool='tools/bohemia_direction_rig_round_five.py', checks='tools/bohemia_not_vibe_coded.py (PLUMBER), read through gates/not_vibe_coded_gate.py held_verdict',
               subjects=[x for x in (report_one(*s) for s in SUBJECTS) if x],
               last_round=[x for x in (report_one(s, c, 'rig', OLD) for s, c in (('robot', 'person'), ('truck', 'vehicle'), ('drum', 'prop'))) if x])
    json.dump(rep, open(os.path.join(D, 'report.json'), 'w'), indent=1)
    print(sheet(rep))
    for r in rep['subjects'] + rep['last_round']:
        print('%-10s %-3s %s R2 %s G6 %s R8 %s | %s' % (r['subject'], r['files'], ' '.join('%s:%s' % (d, r['held'][d][0]) for d in r['held']), r['R2'][0], r['G6_guide'][0], r['R8_research'][0], r['card']))


if __name__ == '__main__':
    main()
