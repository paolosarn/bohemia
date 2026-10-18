"""RUN TWO [the fresh portraits wired in], 10/18/26 (rule 115(h) amended: 'I liked it when it was the portrait, not
when you zoom in on the creepy model's face... it has to be made fresh portrait').

Lays tools/bohemia_run2_fresh_faces_shots.js's two runs side by side for the VOTE tab: BEFORE (the old tree, the
rig body's head zoomed) on the left, AFTER (PORTRAIT's fresh portraits) on the right, the crew screen down to the
man's card, the scavenge sheet and the hiring post, at half his phone's pixels. The AFTER side TALKS: an animated
PNG whose frames are the shots tool's own off-the-glass frames of the card's man and YOU at the lot, one mouth a
half beat (250 ms, 120 BPM), in the order BohemiaCrewFaces.sounds gives the line; the rest of the sheet holds still.
Run: python3 tools/bohemia_run2_fresh_faces_sheet.py <before dir> <after dir> <out.png>
"""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

BEFORE, AFTER, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
K = 0.5                       # half of his phone's 3x
W = int(1170 * K)
GAP, BAR = 24, 44
BG = (11, 9, 7, 255)
INK = (232, 200, 140, 255)
try:
    FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 20)
except OSError:
    FONT = ImageFont.load_default()

talk = json.load(open(os.path.join(AFTER, 'talk.json')))
card_bottom = int(round(talk['cardBottom'] * 3))


def half(im):
    return im.resize((int(im.width * K), int(im.height * K)), Image.LANCZOS)


def column(d, label):
    """one side: the parts stacked, and where each part starts (for pasting the talking faces)"""
    roster = Image.open(os.path.join(d, 'roster.png')).convert('RGBA')
    roster = roster.crop((0, 0, roster.width, min(card_bottom + 30, roster.height)))
    parts = [(label, None), ('THE CREW SCREEN, DOWN TO THE CARD', roster),
             ('SCAVENGE: YOU SPEAK THE LOT', Image.open(os.path.join(d, 'lot.png')).convert('RGBA')),
             ('THE HIRING POST', Image.open(os.path.join(d, 'hall.png')).convert('RGBA'))]
    h = sum(BAR + (int(p.height * K) if p is not None else 0) for _, p in parts)
    col = Image.new('RGBA', (W, h), BG)
    dr = ImageDraw.Draw(col)
    y, at = 0, {}
    for i, (t, p) in enumerate(parts):
        dr.text((12, y + 12), t, font=FONT, fill=INK)
        y += BAR
        if p is not None:
            at[i] = y
            col.alpha_composite(half(p), (0, y))
            y += int(p.height * K)
    return col, at


bcol, _ = column(BEFORE, 'BEFORE: A ZOOM ON THE CLAY MODEL\'S FACE')
acol, at = column(AFTER, 'AFTER: PORTRAIT\'S FRESH PORTRAITS, AND THEY TALK')
H = max(bcol.height, acol.height)
base = Image.new('RGBA', (W * 2 + GAP, H), BG)
base.alpha_composite(bcol, (0, 0))
base.alpha_composite(acol, (W + GAP, 0))

# where each talking face sits on the sheet: part 1 is the roster (document coords), part 2 the lot (sheet coords)
faces = {}
for name, part in (('card', 1), ('lot', 2)):
    m = talk.get(name)
    if not m:
        continue
    fr = {k: half(Image.open(os.path.join(AFTER, name + '_' + k + '.png')).convert('RGBA'))
          for k in ['rest'] + sorted(set(m['seq']))}
    faces[name] = (m['seq'], fr, (W + GAP + int(round(m['x'] * 3 * K)), at[part] + int(round(m['y'] * 3 * K))))

LEAD, HOLD, STEP = 2, 6, 250  # two rest frames in, the line, six rest frames out; a mouth a half beat
n = LEAD + max(len(s) for s, _, _ in faces.values()) + HOLD
frames = []
for i in range(n):
    f = base.copy()
    for seq, fr, xy in faces.values():
        j = i - LEAD
        key = seq[j] if 0 <= j < len(seq) else 'rest'
        f.alpha_composite(fr[key], xy)
    frames.append(f.convert('RGB'))
frames[0].save(OUT, save_all=True, append_images=frames[1:], duration=STEP, loop=0, optimize=True)
print(OUT, base.size, len(frames), 'frames', os.path.getsize(OUT), 'bytes')
