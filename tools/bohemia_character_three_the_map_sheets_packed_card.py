#!/usr/bin/env python3
"""THE MAP'S PEOPLE ARE PACKED: the VOTE card (CHARACTER 3, 11/27/26, ask row 769). Puts the two pictures from
tools/bohemia_character_three_the_map_sheets_packed_card.js side by side with what the phone holds for the map's people,
the numbers measured by the gate and by IN AND OUT THE IPHONE'S WAY. Writes CHARACTER_THREE_THE_MAPS_PEOPLE_ARE_PACKED.webp and
the tab's first picture records/target/vote_first/character3-the-maps-people-are-packed-11-27.webp."""
import json, os
from PIL import Image, ImageDraw, ImageFont
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'records/target/character/the_maps_people_are_packed')
FIRST = os.path.join(ROOT, 'records/target/vote_first/character3-the-maps-people-are-packed-11-27.webp')
N = json.load(open(os.path.join(D, 'numbers.json')))


def font(sz, bold=False):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',
              '/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf'):
        if os.path.exists(p):
            return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


W, PW = 1000, 480
b, n = [Image.open(os.path.join(D, l + '.png') if os.path.exists(os.path.join(D, l + '.png')) else os.path.join(D, l + '.webp')).convert('RGB') for l in ('before', 'now')]
def crop(im, label):
    # close on his crew: a box 2/3 of the glass wide round where the map drew him (MAP_DREW.you), else the top of the glass
    try:
        y = json.load(open(os.path.join(D, label + '.you.json'))); k = im.width / float(y['cw']); cx, cy = y['x'] * k, y['y'] * k
    except Exception:
        cx, cy = im.width / 2.0, im.width * 0.6
    bw = im.width * 0.62; bh = bw * 1.25
    x0 = max(0, min(im.width - bw, cx - bw / 2)); y0 = cy - bh * 0.55   # he stands just under the middle; the glass's edge pads dark
    return im.crop((int(x0), int(y0), int(x0 + bw), int(y0 + bh))).resize((PW, int(PW * 1.25)), Image.LANCZOS)
b, n = crop(b, 'before'), crop(n, 'now')
H = 150 + b.height + 330
card = Image.new('RGB', (W, H), (22, 19, 15))
g = ImageDraw.Draw(card)
ink, dim, red, grn = (226, 214, 190), (150, 138, 116), (200, 92, 72), (140, 190, 120)
g.text((20, 18), "THE MAP'S PEOPLE ARE PACKED", font=font(34, True), fill=ink)
g.text((20, 66), 'The same people, the same pixels. Your phone holds about half as much for them,', font=font(19), fill=dim)
g.text((20, 92), 'so it has more room left before it kills the game going in and out of a fight.', font=font(19), fill=dim)
for i, (im, lab, col, q) in enumerate(((b, 'BEFORE', red, N['before']), (n, 'NOW', grn, N['now']))):
    x = 13 + i * (PW + 14)
    card.paste(im, (x, 136))
    g.rectangle((x, 136, x + PW - 1, 136 + im.height - 1), outline=col, width=3)
    g.text((x + 10, 144), lab, font=font(26, True), fill=col)
    g.text((x + 10, 136 + im.height + 8), '%d people sheets held: %d MB' % (q['sheets'], q['MB']), font=font(20, True), fill=col)
y = 136 + b.height + 46
rows = [('the map\'s people, 16 sheets, held in the phone', '253 MB', '114 MB'),
        ('pictures held back on the map after a fight', '395 MB', '256 MB'),
        ('everything held back on the map after a fight', '617 MB', '455 MB'),
        ('pixels that changed on the glass (783 draws)', '', '0')]
g.text((20, y), 'MEASURED ON A SLOWED PHONE, THE DEMO UPRIGHT', font=font(18, True), fill=dim); y += 34
g.text((620, y - 34), 'BEFORE     NOW', font=font(18, True), fill=dim)
for a, bb, c in rows:
    g.text((20, y), a, font=font(19), fill=ink); g.text((620, y), bb.rjust(7), font=font(19, True), fill=red); g.text((760, y), c.rjust(7), font=font(19, True), fill=grn); y += 32
g.text((20, y + 6), 'Every man is cut to the box his pixels fill, packed tight, the empty glass thrown away.', font=font(16), fill=dim)
g.text((20, y + 30), 'You see it on the MAP: nothing looks different. That is the point.', font=font(16), fill=dim)
g.text((20, y + 54), 'The two games started in different towns at different hours; his three men are the same men.', font=font(16), fill=dim)
card.save(os.path.join(D, 'CHARACTER_THREE_THE_MAPS_PEOPLE_ARE_PACKED.webp'), 'WEBP', quality=88)
os.makedirs(os.path.dirname(FIRST), exist_ok=True)
card.crop((0, 0, W, min(H, 1400))).resize((480, int(min(H, 1400) * 480 / W)), Image.LANCZOS).save(FIRST, 'WEBP', quality=85)
print(card.size, os.path.getsize(os.path.join(D, 'CHARACTER_THREE_THE_MAPS_PEOPLE_ARE_PACKED.webp')) // 1024, 'KB')
