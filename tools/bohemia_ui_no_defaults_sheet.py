"""NO BROWSER DEFAULTS ON THE HUD, the sheet (UI [no browser defaults on the HUD], rule 114 D10, 10/18/26).
Composes, never draws: the driver's shots of each game screen NOW and AFTER the strip, side by side at one phone pixel to one sheet
pixel, each pair captioned with what the browser resolved on it (gradients, blur, glow, corners over 1, hue 250-290 panels, words in
a phone face) before and after; and a manifest the gate reads.
python3 tools/bohemia_ui_no_defaults_sheet.py <dir with <screen>_<profile>_now.png, _after.png, .json>"""
import sys, json, os
from PIL import Image, ImageDraw, ImageFont
S = sys.argv[1]; D = 'records/target/ui_no_defaults/'; os.makedirs(D, exist_ok=True)
BG = (28, 24, 20, 255); INK = (242, 228, 198, 255); AMB = (240, 196, 106, 255); RED = (214, 96, 72, 255)
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 19)
SCREENS = [('map', 'portrait', 'THE MAP (the HUD you play on)'), ('phone', 'portrait', 'THE CRACKED PHONE, OPENED'),
           ('fight', 'portrait', 'THE FIGHT\'S BAR'), ('settlement', 'portrait', 'THE SETTLEMENT SCREEN'),
           ('vote', 'portrait', 'THE VOTE TAB'), ('map', 'landscape', 'THE MAP, PHONE ON ITS SIDE')]
KEYS = ['gradient', 'blur', 'glow', 'radius', 'hue 250-290', 'system font', 'font not loaded']
def tot(reads): return {k: sum(r['total'][k] for r in reads) for k in KEYS}
def words(t): return ', '.join('%d %s' % (v, k) for k, v in t.items() if v) or 'none'
man = {'screens': {}}
GAP = 30; CROP_H = {'portrait': 1400, 'landscape': 1000}
for scr, prof, title in SCREENS:
    tag = scr + '_' + prof
    if not os.path.exists(os.path.join(S, tag + '.json')):
        continue
    j = json.load(open(os.path.join(S, tag + '.json')))
    now, aft = Image.open(os.path.join(S, tag + '_now.png')).convert('RGBA'), Image.open(os.path.join(S, tag + '_after.png')).convert('RGBA')
    tn, ta = tot(j['now']), tot(j['after'])
    man['screens'][tag] = {'title': title, 'now': tn, 'after': ta, 'size': now.size, 'strip': j['strip'],
                           'faces_after': [r['faces'] for r in j['after']], 'boxes': len(j.get('boxes_now', {})), 'moved': j.get('moved', []), 'rows_after': [x for r in j['after'] for x in r['rows']][:20]}
W = 1170 * 2 + GAP * 3
parts = []
for scr, prof, title in SCREENS:
    tag = scr + '_' + prof
    if tag not in man['screens']:
        continue
    m = man['screens'][tag]
    now, aft = Image.open(os.path.join(S, tag + '_now.png')).convert('RGBA'), Image.open(os.path.join(S, tag + '_after.png')).convert('RGBA')
    h = min(now.size[1], CROP_H[prof])
    if prof == 'landscape':   # on its side the pair stacks: each shot is 2532 wide, shown at 1:1 cropped to the sheet's width
        parts.append((tag, title, m, [now.crop((0, 0, min(now.size[0], W - 2 * GAP), h)), aft.crop((0, 0, min(aft.size[0], W - 2 * GAP), h))], 'stack'))
    else:
        parts.append((tag, title, m, [now.crop((0, 0, now.size[0], h)), aft.crop((0, 0, aft.size[0], h))], 'side'))
H = 200 + sum(140 + (p[3][0].size[1] if p[4] == 'side' else 2 * p[3][0].size[1] + 70) for p in parts)
sh = Image.new('RGBA', (W, H), BG); d = ImageDraw.Draw(sh); y = 16
d.text((GAP, y), 'NO BROWSER DEFAULTS: EVERY GAME SCREEN, NOW AND AFTER  (UI, 1 phone px = 1 sheet px, his phone)', font=F, fill=AMB); y += 40
d.text((GAP, y), 'Left is the game today. Right is the same screen with the phone look taken out: no fades, no glow, no blur, no round corners,', font=f, fill=INK); y += 28
d.text((GAP, y), 'every word in the game\'s own letters. Where a fade was, its own lightest and darkest colours are now a hard 1 px edge. The layout does not move.', font=f, fill=INK); y += 28
d.text((GAP, y), 'Nothing is in the game yet: the strip is laid over the real screens in the browser and photographed.', font=f, fill=INK); y += 50
for tag, title, m, (a, b), mode in parts:
    man['screens'][tag]['y'] = y
    d.text((GAP, y), title, font=F, fill=AMB); y += 38
    d.text((GAP, y), 'NOW: ' + words(m['now']), font=f, fill=RED); y += 28
    d.text((GAP, y), 'AFTER: ' + words(m['after']), font=f, fill=INK); y += 40
    if mode == 'side':
        sh.alpha_composite(a, (GAP, y)); sh.alpha_composite(b, (GAP * 2 + 1170, y)); y += a.size[1] + 34
    else:
        sh.alpha_composite(a, (GAP, y)); y += a.size[1] + 12; d.text((GAP, y), 'AFTER', font=f, fill=AMB); y += 28
        sh.alpha_composite(b, (GAP, y)); y += b.size[1] + 34
sh = sh.crop((0, 0, W, y + 10)); out = D + 'UI_NO_BROWSER_DEFAULTS.png'
# 256 colours, no dither (the screens are flat pixel art and words; a full-colour sheet was 14 MB, too big for the tab on a phone)
sh.convert('RGB').quantize(256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(out, optimize=True)
man['sheet'] = out; man['sheet_size'] = sh.size
man['total_now'] = {k: sum(s['now'][k] for s in man['screens'].values()) for k in KEYS}
man['total_after'] = {k: sum(s['after'][k] for s in man['screens'].values()) for k in KEYS}
json.dump(man, open(D + 'UI_NO_BROWSER_DEFAULTS.json', 'w'), indent=1)
print(out, sh.size, 'now', man['total_now'], 'after', man['total_after'])
