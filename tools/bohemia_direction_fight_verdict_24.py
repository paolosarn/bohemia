#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION, FIGHT VERDICT 24: THE FLOOR BAR AFTER THE GROUND. Lays the floor he said NO to (10/18: 'I hate
the ground. I hate the floor... it's so fucking bad') beside the street he said YES to (cook2-one-real-street-10-18) at
the same pixels, measures both with THE FLOOR BAR (tools/bohemia_direction_floor_bar.py, numbers in the style guide's
classes.ground.floor_bar), re-reads FIGHT VERDICT 21's F1/F2 on the glass and recounts verdict 22's seven.
Marks are by eye on seed 1 at the 390 x 844 @3x profile; the numbers are machine.

REFERENCE CHECK (the 9/4 standing duty): his YES twin records/target/COOK2_ONE_REAL_STREET.webp at 1:1, the fight's
own block pictures at 1:1 (slices/fight_ground/), AH-01, AH-03, FIGHT VERDICT 21's pass bar. No reference game.

usage: python3 tools/bohemia_direction_fight_verdict_24.py <shots dir> <out.png>   (the .js beside it shoots the dir)
"""
import sys, os, json, importlib.util
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SRC, OUT = sys.argv[1], sys.argv[2]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
spec = importlib.util.spec_from_file_location('floor_bar', os.path.join(ROOT, 'tools/bohemia_direction_floor_bar.py'))
FB = importlib.util.module_from_spec(spec); spec.loader.exec_module(FB)
ROM = os.path.join(ROOT, 'slices/fonts/BohemiaROM-Regular.ttf')
BG, INK, GOOD, BAD, DIM, MARK = (13, 13, 18), (232, 224, 204), (199, 154, 63), (214, 110, 110), (140, 132, 118), (255, 64, 200)
KINDS = ('suburb', 'strip', 'freeway', 'scrub', 'ruin')
BLOCKS = ('subs_0', 'corner_0', 'strip_0', 'ruin_0', 'scrub_0', 'freeway_0')
F = 5851 / 1800   # his YES sheet's own scale against the 1800 px read it was marked on


def band(L):   # verdict 23's F2, unchanged
    L = L - L.mean(); P = np.abs(np.fft.fft2(L)) ** 2; P[0, 0] = 0
    fy = np.abs(np.fft.fftfreq(L.shape[0]))[:, None]; fx = np.abs(np.fft.fftfreq(L.shape[1]))[None, :]
    return round(float(P[(fx > 0.25) & (fy >= 0)].sum() / P.sum()), 4)


# ---- the numbers
B = FB.bar()
yes = FB.measure(FB.load(FB.YES, FB.YES_SCENE), B)
now = {n: FB.measure(FB.load(os.path.join(ROOT, 'slices/fight_ground/block_%s.webp' % n)), B) for n in BLOCKS}
meta = json.load(open(os.path.join(SRC, 'meta.json')))
glass = {}
for k in KINDS:
    L = np.asarray(Image.open(os.path.join(SRC, k + '_open.png')).convert('L')).astype(float)
    glass[k] = dict(unit=round(meta[k]['css'] * meta[k]['dpr'] / meta[k]['backing'], 2), band=band(L[300:1950]),
                    zoom=round(meta[k]['zoom'], 4), errors=meta[k]['errors'])
G = json.load(open(os.path.join(ROOT, 'slices/fight_ground/fight_ground.json')))
ppm_glass = round(G['px_per_metre'] * glass['suburb']['zoom'], 1)   # the ground's metres on the phone at the opening camera
sharp = sum(1 for g in glass.values() if g['band'] >= 0.020)


def rng(key, sub):
    v = [now[n][key][sub] for n in BLOCKS if now[n][key]]
    return min(v), max(v)


ROWS = [('B1', 'THE DIRT IS PALE', 'sat', yes['ground']['sat'], rng('ground', 'sat'), '<= %.2f' % B['tests']['B1_sat_max']),
        ('B2', 'DESERT DIRT, NOT ORANGE', 'hue', yes['ground']['hue'], rng('ground', 'hue'), '%d to %d deg' % tuple(B['tests']['B2_hue'])),
        ('B3', 'NO CAMOUFLAGE PRINT', 'split', yes['ground']['split'], rng('ground', 'split'), '<= %.0f' % B['tests']['B3_split_max']),
        ('B4', 'THE DIRT HAS GRIT', 'grit', yes['ground']['grit'], rng('ground', 'grit'), '%g to %g' % tuple(B['tests']['B4_grit'])),
        ('B5', 'THE ROAD NEVER REPEATS', 'peak', yes['road']['peak'], rng('road', 'peak'), '<= %.2f' % B['tests']['B5_repeat_max'])]
orng = [now[n]['orange_pct'] for n in BLOCKS]
fails = {t: sum(1 for n in BLOCKS if now[n]['tests'].get(t) is False) for t in ('B1', 'B2', 'B3', 'B4', 'B5', 'B6')}
report = dict(verdict=24, date='10/19/26', seed=1, kinds=list(KINDS), yes=yes, now=now, glass=glass,
              ground_px_per_metre_on_glass=ppm_glass, man_px_per_metre=57,
              fails_of_six_blocks=fails, F1=all(g['unit'] <= 1.5 for g in glass.values()), F2_at_bar=sharp, still_wrong_of_22=3, fixed_of_22=[4, 7], better_of_22=[2], not_seen_of_22=[3],
              F3=False, F4=False, F5=False, analog_horror_line=False,
              picture='slices/vote/DIRECTION_FIGHT_VERDICT_24_THE_FLOOR_BAR.png')
json.dump(report, open(OUT.replace('.png', '.json'), 'w'), indent=1)
print(json.dumps(dict(yes_pass=yes['pass'], fails=fails, glass=glass, ppm_glass=ppm_glass)))

# ---- the sheet
F_T, F_H, F_L, F_N = (ImageFont.truetype(ROM, s) for s in (34, 24, 21, 40))
W = 1440


def mark(im, n, b, w=6):
    d = ImageDraw.Draw(im)
    d.rectangle(b, outline=MARK, width=w)
    d.rectangle([b[0], b[1], b[0] + 50, b[1] + 52], fill=MARK); d.text((b[0] + 11, b[1] + 4), str(n), font=F_N, fill=(0, 0, 0))


Yim = Image.open(FB.YES).convert('RGB')
yes_crop = Yim.crop((int(300 * F), int(150 * F), int(300 * F) + 690, int(150 * F) + 690))
blk = Image.open(os.path.join(ROOT, 'slices/fight_ground/block_subs_0.webp')).convert('RGB')
now_crop = blk.crop((330, 250, 1020, 940))
mark(now_crop, 1, (90, 0, 600, 190)); mark(now_crop, 2, (220, 188, 680, 430))
yes_road = Yim.crop((int(20 * F), int(300 * F), int(20 * F) + 1380, int(300 * F) + 150))
now_road = blk.crop((0, 790, 1380, 940))
dr = ImageDraw.Draw(now_road)
for x in (90, 605, 1120):   # the same crack cluster, one house apart (the B5 lag, 515 px)
    dr.rectangle([x, 8, x + 150, 142], outline=MARK, width=5)
dr.rectangle([0, 0, 50, 52], fill=MARK); dr.text((11, 4), '3', font=F_N, fill=(0, 0, 0))

shots = {k: Image.open(os.path.join(SRC, k + '_open.png')).convert('RGB') for k in ('suburb', 'scrub')}
nfw = os.path.join(SRC, 'named_freeway_open.png')
shots['freeway'] = Image.open(nfw if os.path.exists(nfw) else os.path.join(SRC, 'freeway_open.png')).convert('RGB')
mark(shots['suburb'], 4, (500, 1250, 820, 1500)); mark(shots['suburb'], 5, (30, 1960, 1140, 2100))
mark(shots['suburb'], 6, (520, 760, 1080, 1150))
mark(shots['freeway'], 7, (330, 1150, 1170, 1240)); mark(shots['freeway'], 8, (0, 170, 1170, 330))
mark(shots['scrub'], 9, (300, 380, 1170, 1100))

LEG = [('WHAT EACH NUMBER MEANS, YOUR YES / THE FLOOR NOW / THE BAR', DIM)]
for t, name, _, y, (lo, hi), barline in ROWS:
    LEG.append(('%s %-24s %6s   %s to %s   %-12s %s' % (t, name, y, lo, hi, barline,
                'FAILS %d OF 6' % fails[t] if fails[t] else 'PASSES'), BAD if fails[t] else GOOD))
LEG.append(('B6 %-24s %6s   %s to %s   %-12s %s' % ('NO BRIGHT ORANGE ROOF', yes['orange_pct'], min(orng), max(orng),
            '<= %g %%' % B['tests']['B6_orange_pct_max'], 'FAILS %d OF 6' % fails['B6']), BAD))
LEG += [('', DIM), ('WHAT IS MARKED', DIM),
        ('1  a camouflage print of dark blobs on orange sand; your street is one pale dirt with grit', BAD),
        ('2  one bright orange roof, five in a row; you said roofs go tan, never medieval orange', BAD),
        ('3  the same asphalt cracks every house (515 px); your road never repeats', BAD),
        ('4  a pale grid line on every house tile, across the whole board', BAD),
        ('5  a paper card of words over the ground', BAD),
        ('6  a man as big as a house: the ground is drawn %.0f px a metre, the men 57, so a man reads 9 metres tall' % ppm_glass, BAD),
        ('7  the freeway is still the old cooked road, and its middle barrier a flat pale strip', BAD),
        ('8  a flat brown band, one colour, no ground in it', BAD),
        ('9  the desert: the same camouflage, stronger orange, green specks sprinkled evenly', BAD),
        ('%s  sharp on the glass: one art pixel is %.1f phone pixels; fine band %.3f to %.3f, %d of 5 at the bar (0.020)'
         % ('+' if sharp == 5 else '~', glass['suburb']['unit'], min(g['band'] for g in glass.values()),
            max(g['band'] for g in glass.values()), sharp), GOOD if sharp == 5 else DIM),
        ('+  the gold rings are gone: a dark shadow under each man', GOOD),
        ('', DIM), ('NOT YET: one calm wrong thing per board (a lamp on in daylight, a sign lit on a dead shop)', BAD)]

S = 0.36; TW, TH = int(1170 * S), int(2532 * S)
H = 30 + 50 + 40 + 36 + 690 + 30 + 36 + 150 + 16 + 150 + 30 + 36 + TH + 30 + len(LEG) * 31 + 30
sh = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(sh)
y = 26
d.text((30, y), 'FIGHT VERDICT 24: THE FLOOR YOU HATE, BESIDE THE STREET YOU LIKED', font=F_T, fill=INK); y += 50
d.text((30, y), 'Same pixels, no zoom. Left: your YES on one real street. Right: the fight floor now.', font=F_L, fill=DIM); y += 40
d.text((30, y), 'YOUR YES: ONE REAL STREET', font=F_H, fill=GOOD); d.text((30 + 690 + 30, y), 'THE FIGHT FLOOR NOW', font=F_H, fill=BAD); y += 36
sh.paste(yes_crop, (30, y)); sh.paste(now_crop, (30 + 690 + 30, y)); y += 690 + 30
d.text((30, y), 'THE ROAD: YOURS ON TOP, THE FIGHT\'S UNDER IT', font=F_H, fill=DIM); y += 36
sh.paste(yes_road.crop((0, 0, W - 60, 150)), (30, y)); y += 150 + 16
sh.paste(now_road.crop((0, 0, W - 60, 150)), (30, y)); y += 150 + 30
d.text((30, y), 'THE FIGHT AS YOUR PHONE SHOWS IT: THE STREET, THE FREEWAY, THE DESERT', font=F_H, fill=DIM); y += 36
for i, k in enumerate(('suburb', 'freeway', 'scrub')):
    sh.paste(shots[k].resize((TW, TH), Image.LANCZOS), (30 + i * (TW + 30), y))
y += TH + 30
for t, c in LEG:
    d.text((30, y), t, font=F_L, fill=c); y += 31
sh.save(OUT)
print('sheet', sh.size)
