#!/usr/bin/env python3
"""
BOHEMIA JUDGE CARDS (8/2/26, WORLD lane) — THE ANSWER TO "I DON'T KNOW WHICH IS WHICH".

PAOLO, 8/2/26, VERBATIM:
    "You are showing me pictures, but I don't know which is which"

He is right and it is a straight presentation failure. I sent him four district
renders in a grid and three hero icons in a row, all unlabelled, and then asked him
to score them. A picture he cannot identify is a picture he CANNOT JUDGE, so asking
for a verdict on one wastes his turn -- which is the same failure as "he never digs
in files", in a different medium. HE DOES NOT HAVE MY CONTEXT. He has a phone and
whatever is burned into the pixels.

THE LAW THIS TOOL ENFORCES (laws/BOHEMIA_ADDENDUM_LABEL_EVERY_PICTURE_8_2_26.md):
    EVERY IMAGE SENT TO PAOLO CARRIES ITS OWN NAME, IN THE PIXELS.
Not in the caption, not in the message above it, not in the order they were sent --
IN THE IMAGE, because that is the only place that survives a scroll, a re-send, a
screenshot, or him coming back to it tomorrow.

WHAT A CARD IS: one district, big enough to read on a phone held in one hand.
    - the DISTRICT NAME across the top, large
    - the plot render at 3x nearest-neighbour (this is the surface he judges)
    - its HERO ICON beside it, because the icon and the ground are judged together
      and he has caught them disagreeing before
    - one line of WHAT IT IS and one line of WHAT IT WAS BUILT ON (the real
      reference), so he never has to ask what he is looking at
    - TWO SCORE lines along the bottom, one for THE WALKING and one for THE ICON.
      Paolo, 8/2: "For the walking and icon." A district is TWO artefacts and they are
      not the same quality -- the plot you walk is drawn by the engine module, the icon
      is baked by the hero factory, and a bug in one is invisible in the other (the tarp
      roofs were icon-only; the greenwashed lawns were plot-only). One number for both
      forces him to average two different things, and an average tells me which file to
      open exactly never.

REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks NO new graphic pixels. Every pixel of
the district plot comes from the shared painter path used by
tools/bohemia_answer_sheet.py (the same surface he already judges), and every icon
pixel is read straight out of the already-baked bank
banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt. This tool composes and LABELS;
it never draws world art.

    python3 tools/bohemia_judge_cards.py                 # every registered district
    python3 tools/bohemia_judge_cards.py cityhall chapel # just these
OUTPUT: records/judgecards/BOHEMIA_JUDGE_<district>.png
"""
import base64
import io
import json
import os
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)
OUTDIR = 'records/judgecards'
BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt'

BG = (26, 25, 22)
INK = (238, 232, 216)
DIM = (156, 148, 130)
GOLD = (201, 154, 63)
RULE = (62, 58, 50)

F = '/usr/share/fonts/truetype/dejavu/DejaVuSans%s.ttf'


def _font(size, bold=False):
    try:
        return ImageFont.truetype(F % ('-Bold' if bold else ''), size)
    except OSError:
        return ImageFont.load_default()


def _wrap(draw, text, font, width):
    """Greedy wrap. Returns a list of lines that each fit inside width."""
    words, lines, cur = text.split(), [], ''
    for w in words:
        trial = (cur + ' ' + w).strip()
        if draw.textlength(trial, font=font) <= width or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def district_plot(name):
    """The plot grid, painted through the district's own palette — the same pixels
    the answer sheet shows him, so the card cannot drift from the surface he judges."""
    js = '''
      const K = require('./engine/bohemia_district_kit.js');
      require('./engine/bohemia_%s.js');
      const spec = K.get('%s');
      const r = spec.generate(7, { streets: ['S'] });
      process.stdout.write(JSON.stringify({ g: r.g, pal: spec.palette,
        summary: (spec.notes && spec.notes.summary) || '',
        reference: (spec.notes && spec.notes.reference && spec.notes.reference[0]) || '' }));
    ''' % (name, name)
    out = subprocess.run(['node', '-e', js], capture_output=True, text=True)
    if out.returncode != 0:
        raise RuntimeError('%s: %s' % (name, out.stderr.strip()[:300]))
    d = json.loads(out.stdout)
    g, pal = d['g'], d['pal']
    H, W = len(g), len(g[0])
    im = Image.new('RGB', (W, H), BG)
    px = im.load()
    for y in range(H):
        for x in range(W):
            # MAGENTA IS A BUG REPORT, NOT A COLOUR. It stays as the last resort so a
            # missing palette entry is impossible to miss -- but it must never be the
            # normal path, and until 8/4 it was, for every tile of code 0 in sixteen
            # districts. Those all carry a real colour now.
            h = pal.get(str(g[y][x])) or pal.get(g[y][x]) or '#ff00ff'
            px[x, y] = (int(h[1:3], 16), int(h[3:5], 16), int(h[5:7], 16))
    return im, d['summary'], d['reference']


def hero_icon(name):
    if not os.path.exists(BANK):
        return None
    for h in json.load(open(BANK))['heroes']:
        if h['district'] == name:
            return Image.open(io.BytesIO(base64.b64decode(h['b64']))).convert('RGB')
    return None


def card(name):
    plot, summary, reference = district_plot(name)
    icon = hero_icon(name)

    SCALE, PAD = 3, 34
    plot = plot.resize((plot.width * SCALE, plot.height * SCALE), Image.NEAREST)
    if icon is not None:
        iw = 300
        icon = icon.resize((iw, max(1, round(icon.height * iw / icon.width))), Image.NEAREST)

    f_name = _font(52, bold=True)
    f_tag = _font(21, bold=True)
    f_body = _font(20)
    f_small = _font(18)

    probe = ImageDraw.Draw(Image.new('RGB', (8, 8)))
    ICON_CAP, PLOT_CAP = 'THE ICON — what you see on the map', 'THE PLOT — what you walk'
    W = PAD * 2 + plot.width + (PAD + max(icon.width,
        round(probe.textlength(ICON_CAP, font=_font(21, bold=True))) + 10) if icon else 0)
    W = max(W, PAD * 2 + 620)
    body_w = W - PAD * 2
    sum_lines = _wrap(probe, summary, f_body, body_w)
    ref_lines = _wrap(probe, 'BUILT ON: ' + reference, f_small, body_w)[:3]
    H = (PAD + 62 + 16 + max(plot.height, (icon.height + 30) if icon else 0)
         + 24 + len(sum_lines) * 26 + 12 + len(ref_lines) * 23 + 22 + 84 + PAD)

    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)

    # THE NAME, in the pixels, where a scroll cannot take it away.
    d.text((PAD, PAD), name.upper(), font=f_name, fill=INK)
    y = PAD + 62
    d.line([(PAD, y), (W - PAD, y)], fill=GOLD, width=3)
    y += 16

    im.paste(plot, (PAD, y))
    d.rectangle([PAD - 1, y - 1, PAD + plot.width, y + plot.height], outline=RULE)
    d.text((PAD + 6, y + plot.height + 6), PLOT_CAP, font=f_tag, fill=DIM)
    if icon:
        ix = PAD + plot.width + PAD
        im.paste(icon, (ix, y))
        d.text((ix + 4, y + icon.height + 8), ICON_CAP, font=f_tag, fill=DIM)

    y += max(plot.height, (icon.height + 30) if icon else 0) + 24
    for ln in sum_lines:
        d.text((PAD, y), ln, font=f_body, fill=INK)
        y += 26
    y += 12
    for ln in ref_lines:
        d.text((PAD, y), ln, font=f_small, fill=DIM)
        y += 23

    y += 22
    d.line([(PAD, y), (W - PAD, y)], fill=RULE, width=2)
    # TWO numbers, never one (Paolo 8/2: "for the walking and icon").
    f_score = _font(26, bold=True)
    d.text((PAD, y + 12), name.upper() + ' — THE WALKING  =  ____ %', font=f_score, fill=GOLD)
    d.text((PAD, y + 46), name.upper() + ' — THE ICON     =  ____ %', font=f_score, fill=GOLD)
    return im


def main():
    os.makedirs(OUTDIR, exist_ok=True)
    want = [a for a in sys.argv[1:] if not a.startswith('-')]
    if not want:
        out = subprocess.run(['node', '-e',
                              "const K=require('./engine/bohemia_district_kit.js');"
                              "require('./engine/bohemia_world.js');"
                              "process.stdout.write(JSON.stringify(K.types()));"],
                             capture_output=True, text=True)
        want = json.loads(out.stdout) if out.returncode == 0 else []
    made = 0
    for name in want:
        try:
            im = card(name)
        except Exception as e:                                   # noqa: BLE001
            print('  SKIP %-14s %s' % (name, str(e)[:90]))
            continue
        p = os.path.join(OUTDIR, 'BOHEMIA_JUDGE_%s.png' % name)
        im.save(p)
        made += 1
        print('  %-14s %dx%d -> %s' % (name, im.width, im.height, p))
    print('judge cards: %d written to %s/ (every one carries its own NAME in the pixels)'
          % (made, OUTDIR))


if __name__ == '__main__':
    main()
