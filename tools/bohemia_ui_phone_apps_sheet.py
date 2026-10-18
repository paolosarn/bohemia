"""THE PHONE'S APPS, the sheet (UI [the phone's apps], 10/18/26).
Composes, never draws: the driver's shots of the opened phone NOW and with the home screen laid (look A, look B, and look A before
the first crisis) at one art pixel to one phone pixel, upright on one sheet and sideways on a second; the twelve pack props pasted
whole at 1:1 as the twins; and a manifest the gate reads.
python3 tools/bohemia_ui_phone_apps_sheet.py <dir with portrait*.png landscape*.png portrait.json landscape.json>"""
import sys, json, os
from PIL import Image, ImageDraw, ImageFont
S = sys.argv[1]; D = 'records/target/ui_phone_apps/'; os.makedirs(D, exist_ok=True)
BG = (28, 24, 20, 255); INK = (242, 228, 198, 255); AMB = (240, 196, 106, 255); GREY = (190, 180, 160, 255)
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 16)
sm = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
shot = lambda n: Image.open(os.path.join(S, n)).convert('RGBA')
J = lambda n: json.load(open(os.path.join(S, n)))
def label(d, y, t, font=f, fill=INK, x=16): d.text((x, y), t, font=font, fill=fill); return y + 28
def d10(rows):
    return {'gradients': sum(r['grad'] for r in rows), 'rounded': sum(r['radius'] > 1 for r in rows), 'blur': sum(r['blur'] for r in rows),
            'glow': sum(r['glow'] for r in rows), 'system_font_runs': sum(1 for r in rows if r['font'] and not r['font'].startswith('Bohemia'))}

def upright(P):
    W = 1170; sh = Image.new('RGBA', (W, 12000), BG); d = ImageDraw.Draw(sh); y = 12
    y = label(d, y, "THE PHONE'S APPS: THE HOME SCREEN ON THE CRACKED PHONE  (UI, 1 art px = 1 phone px, upright)", F, AMB) + 6
    y = label(d, y, 'Tap the phone on the map and it opens on its apps: the game screens you already have, one icon each, cut whole from your packs.')
    y = label(d, y, 'TIMELINE (the flip) shows up only after the first crisis. Nothing is in the game yet.') + 10
    n = d10(P['now']); man = {'upright': {}}
    for name, cap in [('now', 'NOW: the opened phone as it is (%d gradients, %d rounded corners, %d glows, %d lines in system fonts)' % (n['gradients'], n['rounded'], n['glow'], n['system_font_runs'])),
                      ('A', 'A: cardboard tiles taped to the glass, the name on a receipt tag (after the crisis: six apps)'),
                      ('B', 'B: the prop straight on the glass, the name printed in amber (after the crisis: six apps)'),
                      ('A_before', 'A before the first crisis: five apps, no TIMELINE')]:
        im = shot('portrait_' + name + '.png'); h = 1250 if name != 'now' else 1300
        y = label(d, y, cap, f, AMB) + 4; sh.alpha_composite(im.crop((0, 0, W, h)), (0, y)); man['upright'][name] = {'y': y, 'h': h}; y += h + 22
    y = label(d, y, 'THE TWINS AT 1:1: the twelve pack props the icons are, whole, as they sit in your packs (top row A, bottom row B)', f, AMB) + 8
    for look in ['A', 'B']:
        x = 16; hmax = 0
        for k, fn in P[look]['pick'].items():
            tw = Image.open('reference/art_bank/prop/' + fn + '.png').convert('RGBA'); sh.alpha_composite(tw, (x, y))
            d.text((x, y + tw.height + 4), k.upper(), font=sm, fill=GREY); d.text((x, y + tw.height + 18), fn.replace('pack_', '#')[:24], font=sm, fill=GREY)
            x += max(tw.width, 150) + 34; hmax = max(hmax, tw.height)
        y += hmax + 46
    sh = sh.crop((0, 0, W, y + 8)); out = D + 'UI_ONE_AT_A_TIME_THE_PHONES_APPS.png'; sh.save(out, optimize=True)
    man['sheet'] = out; man['size'] = sh.size; return man

def sideways(L):
    W = 2532; sh = Image.new('RGBA', (W, 5000), BG); d = ImageDraw.Draw(sh); y = 12
    y = label(d, y, "THE PHONE'S APPS, THE PHONE ON ITS SIDE (1 art px = 1 phone px): the six in one row", F, AMB) + 10
    for name, cap in [('now', 'NOW'), ('A', 'A'), ('B', 'B')]:
        im = shot('landscape_' + name + '.png'); y = label(d, y, cap, f, AMB) + 4; sh.alpha_composite(im.crop((0, 0, W, 900)), (0, y)); y += 920
    sh = sh.crop((0, 0, W, y)); out = D + 'UI_THE_PHONES_APPS_SIDEWAYS.png'; sh.save(out, optimize=True); return {'sheet_sideways': out}

P = J('portrait.json'); L = J('landscape.json')
man = upright(P); man.update(sideways(L))
man['d10_now'] = {'portrait': d10(P['now']), 'landscape': d10(L['now'])}
man['laid'] = {}
for prof, X in [('portrait', P), ('landscape', L)]:
    for name in ['A', 'B', 'A_before']:
        m = X[name]['measure']; man['laid'][prof + '_' + name] = {'apps': m['apps'], 'css': m['css'], 'home': m['home'], 'W': m['W'], 'pick': X[name]['pick'], 'crisis': X[name]['laid']['crisis']}
json.dump(man, open(D + 'UI_THE_PHONES_APPS.json', 'w'), indent=1)
print(man['sheet'], man['size'], man['d10_now'])
