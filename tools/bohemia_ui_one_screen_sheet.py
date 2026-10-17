"""ONE SCREEN, the sheet (UI [one screen], rule 110's swing, 10/17/26).
Composes, never draws: the driver's shots of the map, the settlement and the fight as they are and with the one HUD laid over them,
at one art pixel to one phone pixel, upright on one sheet (the phone's width) and sideways on a second (the phone's height); his pack
twins pasted whole at 1:1 beside the bar's own pieces; and a manifest the gate reads (every code-drawn box found on the three screens,
with its replacement, and the measured boxes of the one bar on every screen and profile).
python3 tools/bohemia_ui_one_screen_sheet.py <dir with *_now.png *_cand.png *_now.json *_cand.json>"""
import sys, json, os
from PIL import Image, ImageDraw, ImageFont
S = sys.argv[1]; D = 'records/target/ui_one_screen/'
BG = (28, 24, 20, 255); INK = (242, 228, 198, 255); AMB = (240, 196, 106, 255); GREY = (190, 180, 160, 255)
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 16)
sm = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 12)
SCREENS = [('map', 'THE MAP'), ('settlement', 'THE SETTLEMENT'), ('fight', 'THE FIGHT')]
shot = lambda n: Image.open(os.path.join(S, n)).convert('RGBA')
J = lambda n: json.load(open(os.path.join(S, n)))

# WHAT EACH CODE-DRAWN BOX BECOMES, by the selector the sweep prints
REPLACE = {
  '#bar': 'the one bar: cut cardboard with its flutes along the foot, the place and the day on receipt tags',
  '#crew': 'CREW as a receipt tag at the bar\'s right end, 44 points, the same place on all three screens',
  '#leave': 'LEAVE on the taped cardboard card in the bottom right corner, the speed pad\'s place',
  '#heard': 'the heard line printed on a receipt like the fight\'s hint; empty, it draws nothing',
  '#sheet': 'the building\'s sheet a cardboard card with a strip of tape, no gold rule',
  '#top': 'the one bar; the round, the turn strip and AUTO ride on it as the fight\'s own row',
  '#gearbtn': 'the gear on the speed pad\'s cardboard card, under the bar, square corners',
  '.sp.now': 'not a box: the lit amber of the speed you are at, the materials\' own light',
  '#cityfeed.on.ring': 'his phone, kept as he voted it (9/27, one crack); its crack is its own candidate (10/16)',
  '#cityfeedscreen': 'his phone\'s glass, kept',
  '#cityfeedglass': 'his phone\'s glass, kept',
  '#cityfeedfade': 'his phone\'s glass, kept',
  '.bar': 'the three meters printed on receipt paper, ink and amber on paper',
  '#ap i': 'the action pips as receipt chips, the spent ones blank, the ready ones lit amber',
  '#scene': 'not a box: the floor under the picture',
  '#cityfeedbatt': 'his phone\'s battery glyph, kept',
  '#bhp': 'the health meter\'s fill: colour printed on the receipt meter, not a box',
  '#barm': 'the armour meter\'s fill: colour printed on the receipt meter, not a box',
  '#bfat': 'the fatigue meter\'s fill: colour printed on the receipt meter, not a box',
  '.on': 'the action pips, ready: receipt chips lit amber',
  '#stage': 'not a box: the floor under the map',
}
def boxes():
    rows = []
    for key, _ in SCREENS:
        for prof in ['portrait', 'landscape']:
            inv = J(key + '_' + prof + '_now.json')['inventory']
            for r in inv['rows']:
                if r['made'] != 'code': continue
                sel = r['sel']; base = sel.split('.')[0] if sel.startswith('#') else '.' + sel.split('.')[1] if '.' in sel else sel
                rep = REPLACE.get(sel) or REPLACE.get(base) or ''
                rows.append({'screen': key, 'profile': prof, 'sel': sel, 'box': r['box'], 'bg': r['bg'], 'radius': r['radius'], 'font': r['font'], 'replacement': rep})
    return rows

def label(d, y, t, font=f, fill=INK): d.text((16, y), t, font=font, fill=fill); return y + 28

def upright():
    """the before and the after of the SAME thing, side by side in one picture (rule 89): the top of each screen (the bar) as it is
    and with the one bar laid, then the bottom corner (the big action) the same way; one whole laid screen at the end"""
    W = 1170; sh = Image.new('RGBA', (W, 24000), BG); d = ImageDraw.Draw(sh); y = 12
    y = label(d, y, 'ONE SCREEN: THE SAME BAR ON THE MAP, THE SETTLEMENT AND THE FIGHT  (UI, one sheet, 1 art px = 1 phone px, upright)', F, AMB) + 6
    y = label(d, y, 'The top of every screen is the one bar: the clock it runs on, the place, the six supplies from your packs on glass, CREW and NOTES. The big action keeps the bottom right.')
    y = label(d, y, 'For each screen: the top as it is NOW, then the top with the ONE HUD; the bottom corner NOW, then with the ONE HUD. Nothing is in the game.') + 10
    man = {'upright': {}, 'twins': []}
    for key, name in SCREENS:
        now = shot(key + '_portrait_now.png'); cand = shot(key + '_portrait_cand.png'); hb = int(round(J(key + '_portrait_cand.json')['hud']['hud'][3] * 3))
        y = label(d, y, name + ', THE TOP: NOW (above) and ONE HUD (below), the bar and 30 points of the world under it', f, AMB) + 4
        sh.alpha_composite(now.crop((0, 0, W, 150 + 90)), (0, y)); y += 240 + 6
        sh.alpha_composite(cand.crop((0, 0, W, hb + 90)), (0, y)); man['upright'][key] = {'y': y, 'h': hb + 90}; y += hb + 90 + 14
        y = label(d, y, name + ', THE BOTTOM CORNER: NOW (above) and ONE HUD (below), the last 80 points', f, AMB) + 4
        sh.alpha_composite(now.crop((0, now.height - 240, W, now.height)), (0, y)); y += 240 + 6
        sh.alpha_composite(cand.crop((0, cand.height - 240, W, cand.height)), (0, y)); y += 240 + 26
    y = label(d, y, 'THE TWINS AT 1:1: your pack\'s boards (left) beside the bar\'s pieces cut from the fight above (right). Three differences are named on the card.', f, AMB) + 8
    cand = shot('fight_portrait_cand.png'); H = J('fight_portrait_cand.json')['hud']
    cuts = [('twin_19_21.png', 'Signs and village boards #21, the notice board', 'bar', H['hud'][:2] + [390, 60]),
            ('twin_signage_09.png', 'Signage, menus and cafe accessories #9, the menu', 'place tag', H['place']),
            ('twin_6_17.png', 'Control panels and consoles #17, the console strip', 'six on glass', H['six']),
            ('twin_19_27.png', 'Signs and village boards #27, a paper sign on a post', 'CREW tag', H['crew'])]
    x = 16
    for fn, cap, what, box in cuts:
        tw = Image.open(D + fn).convert('RGBA'); sh.alpha_composite(tw, (x, y)); man['twins'].append({'src': D + fn, 'x': x, 'y': y, 'w': tw.width, 'h': tw.height})
        bx = [int(round(v * 3)) for v in box]; piece = cand.crop((bx[0], bx[1], min(W, bx[0] + bx[2]), bx[1] + bx[3]))
        if piece.width > 300: piece = piece.crop((0, 0, 300, piece.height))
        sh.alpha_composite(piece, (x + tw.width + 12, y))
        d.text((x, y + max(tw.height, piece.height) + 4), cap, font=sm, fill=GREY); d.text((x, y + max(tw.height, piece.height) + 18), 'ours: the ' + what + ' at 1:1', font=sm, fill=GREY)
        y += max(tw.height, piece.height) + 40
    # the whole laid screen is its own file (2.7 MB of world art), linked from the record, so the card's sheet stays light
    cand.save(D + 'UI_ONE_SCREEN_THE_FIGHT_WHOLE.png', optimize=True); man['whole'] = D + 'UI_ONE_SCREEN_THE_FIGHT_WHOLE.png'
    sh = sh.crop((0, 0, W, y + 8)); out = D + 'UI_ONE_AT_A_TIME_ONE_SCREEN.png'; sh.save(out, optimize=True); man['sheet'] = out; man['size'] = sh.size
    return man

def sideways():
    W = 2532; sh = Image.new('RGBA', (W, 6000), BG); d = ImageDraw.Draw(sh); y = 12
    y = label(d, y, 'ONE SCREEN, THE PHONE ON ITS SIDE  (1 art px = 1 phone px): the same bar in one row, the big action in the same corner', F, AMB) + 10
    man = {}
    for key, name in SCREENS:
        now = shot(key + '_landscape_now.png'); cand = shot(key + '_landscape_cand.png'); hb = int(round(J(key + '_landscape_cand.json')['hud']['hud'][3] * 3))
        y = label(d, y, name + ': the top NOW (above) and with the ONE HUD (below); then the bottom corner NOW and with the ONE HUD', f, AMB) + 4
        sh.alpha_composite(now.crop((0, 0, W, 165)), (0, y)); y += 165 + 6
        sh.alpha_composite(cand.crop((0, 0, W, hb + 60)), (0, y)); man[key] = {'y': y, 'h': hb + 60}; y += hb + 60 + 10
        sh.alpha_composite(now.crop((0, now.height - 170, W, now.height)), (0, y)); y += 170 + 6
        sh.alpha_composite(cand.crop((0, cand.height - 170, W, cand.height)), (0, y)); y += 170 + 24
    sh = sh.crop((0, 0, W, y + 8)); out = D + 'UI_ONE_SCREEN_SIDEWAYS.png'; sh.save(out, optimize=True)
    return {'sheet_sideways': out, 'size_sideways': sh.size, 'sideways': man}

man = upright(); man.update(sideways()); man['boxes'] = boxes()
man['hud'] = {}
for key, _ in SCREENS:
    for prof in ['portrait', 'landscape']:
        c = J(key + '_' + prof + '_cand.json'); man['hud'][key + '_' + prof] = c['hud']; man['hud'][key + '_' + prof]['code_left'] = [r['sel'] for r in c['inventory']['rows'] if r['made'] == 'code']
json.dump(man, open(D + 'UI_ONE_SCREEN.json', 'w'), indent=1)
print(man['sheet'], man['size'], 'boxes', len(man['boxes']), 'sideways', man['sideways'])
for k, v in man['hud'].items(): print(k, 'code left:', v['code_left'])
