"""THE PHONE'S FRONT SCREEN, the sheet (UI [the phone's front screen], 10/18/26).
Composes, never draws: the driver's shots of the opened phone NOW (the lock screen as it is) and with the new front screen laid
(look A, look B) at one art pixel to one phone pixel, side by side upright and stacked sideways, the game's face at 1:1 as the twin,
and a manifest the gate reads.
python3 tools/bohemia_ui_phone_lock_sheet.py <dir with portrait*.png landscape*.png portrait.json landscape.json>"""
import sys, json, os
from PIL import Image, ImageDraw, ImageFont
S = sys.argv[1]; D = 'records/target/ui_phone_lock/'; os.makedirs(D, exist_ok=True)
BG = (28, 24, 20, 255); INK = (242, 228, 198, 255); AMB = (240, 196, 106, 255)
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 26)
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 20)
shot = lambda n: Image.open(os.path.join(S, n)).convert('RGBA')
J = lambda n: json.load(open(os.path.join(S, n)))
def label(d, y, t, font=f, fill=INK, x=20): d.text((x, y), t, font=font, fill=fill); return y + 32
def d10(now):
    r = now['rows']
    return {'gradients': sum(x['grad'] for x in r), 'rounded': sum(x['radius'] > 1 for x in r), 'blur': sum(x['blur'] for x in r),
            'glow': sum(x['glow'] for x in r), 'flicker': sum(x['anim'] for x in r), 'system_font_runs': sum(1 for x in r if x['font'] and not x['font'].startswith('Bohemia')),
            'cards': now['cards']}

def upright(P):
    W = 1170; G = 30; H = 2532; n = d10(P['now'])
    sh = Image.new('RGBA', (W * 3 + G * 4, H + 260), BG); d = ImageDraw.Draw(sh); y = 16
    y = label(d, y, "THE PHONE'S FRONT SCREEN: THE FIRST THING YOU SEE WHEN THE PHONE OPENS  (UI, 1 art px = 1 phone px, upright)", F, AMB)
    y = label(d, y, 'One clock, one message from one face, one press. The 41-quests card moves into JOBS. The last owner\'s lock screen is burned into the glass, and one row of pixels is dead.')
    y = label(d, y, 'NOW: %d gradients, %d rounded corners, %d glows, %d flicker, %d lines in phone fonts, %d cards with coloured squares for faces.' % (n['gradients'], n['rounded'], n['glow'], n['flicker'], n['system_font_runs'], n['cards'])) + 14
    man = {'upright': {}}
    for i, (name, cap) in enumerate([('now', 'NOW (what he called dog shit)'), ('A', 'A: the message on a receipt taped to the glass'), ('B', 'B: printed straight on the glass')]):
        x = G + i * (W + G); d.text((x, y), cap, font=F, fill=AMB)
        sh.alpha_composite(shot('portrait_' + name + '.png').crop((0, 0, W, H)), (x, y + 40)); man['upright'][name] = {'x': x, 'y': y + 40, 'h': H}
    out = D + 'UI_ONE_AT_A_TIME_THE_PHONES_FRONT_SCREEN.png'; sh.save(out, optimize=True); man['sheet'] = out; man['size'] = sh.size; return man

def sideways():
    W = 2532; sh = Image.new('RGBA', (W, 3 * 1230 + 80), BG); d = ImageDraw.Draw(sh); y = 16
    y = label(d, y, "THE PHONE'S FRONT SCREEN, THE PHONE ON ITS SIDE (1 art px = 1 phone px): the clock left, the message and READ right", F, AMB) + 8
    for name in ['now', 'A', 'B']:
        y = label(d, y, name.upper() if name != 'now' else 'NOW', f, AMB); sh.alpha_composite(shot('landscape_' + name + '.png').crop((0, 0, W, 1170)), (0, y)); y += 1190
    sh = sh.crop((0, 0, W, y)); out = D + 'UI_THE_PHONES_FRONT_SCREEN_SIDEWAYS.png'; sh.save(out, optimize=True); return out

P = J('portrait.json'); L = J('landscape.json')
man = upright(P); man['sheet_sideways'] = sideways()
man['d10_now'] = {'portrait': d10(P['now']), 'landscape': d10(L['now'])}
man['now_text'] = P['now']['text']; man['msg'] = P['msg']
man['laid'] = {prof + '_' + look: X[look]['measure'] for prof, X in [('portrait', P), ('landscape', L)] for look in ['A', 'B']}
json.dump(man, open(D + 'UI_THE_PHONES_FRONT_SCREEN.json', 'w'), indent=1)
print(man['sheet'], man['size'], man['d10_now'])
