#!/usr/bin/env python3
"""
BOHEMIA — LOOK AGAIN (7/29/26): the self-critique rig

Paolo: "GO DO MORE LEARNING KNOW WHAT YOU DONT KNOW I NEED YOU TO BE THE BEST
PIXEL ARTIST OF ALL TIME."

Yesterday I wrote down ten things I do not know. Number seven was the worst:
**I do not know how to look at my own work and say "that's wrong" without first
computing something.** Every judgement I have made on this project reduced to a
measurement, and every time a measurement was green and the picture was bad, I
was wrong (the camouflage tile, the empty sidewalks, the 0.8 MB "loaded" alpha,
the 33x seam that meant nothing).

So I went and learned what real artists actually do, and it turns out the answer
is not "have a better eye". It is a SET OF MECHANICAL TRICKS that force a fresh
eye, every one of which a program can perform:

  FLIP IT       "Flipping the canvas horizontally helps you see issues you may
                not notice with the naked eye." Composition and balance errors
                that your brain has learned to ignore jump straight out when the
                image is mirrored.
  SQUINT        "Squinting blurs out extraneous details to help you see the main
                forms and values." If the read dies when the detail goes, the
                detail was carrying the picture, which means the picture had no
                structure.
  GREYSCALE     "Greyscale conversions and value checks help assess structure."
                Value is what carries a drawing; hue is decoration. If it does
                not read in grey, it does not read.
  STAND BACK    "Looking at your work from a distance simplifies forms and
                colors." For us that is real size and map zoom - the sizes it is
                actually seen at, not the 6x zoom I keep judging things at.
  LIVE WITH IT  "Hang work and live with it for a few days." A machine cannot
                wait days, but the doctrine already demands the equivalent:
                verification runs as a DIFFERENT code path than the work.

WHAT THIS TOOL IS NOT: a judge. It renders NO opinion, computes no score, and
passes nothing. It is a mirror, a squint, a grey filter and a step backwards -
the four things I could not do before. Paolo's thumb is still the only verdict in
this project, and the tool that finally lets me see my own work is not a tool that
replaces him. It is the tool that stops me wasting his time.

REUSE CHECK: cooks no graphic pixels and opens no bank. It reads an image that
already exists and re-presents it. Every transform is NEAREST except the squint,
which is a deliberate blur and is the whole point of that panel.

  python3 tools/bohemia_look_again.py <image> [out.png]
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageOps

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)


def panels(im):
    """The four fresh-eye views, plus the original to compare against."""
    rgb = im.convert('RGB')
    w, h = rgb.size

    # SQUINT: blur proportional to the image, then back up NEAREST so what you
    # see is the blurred READ, not a smooth picture pretending to be pixel art.
    small = rgb.resize((max(1, w // 8), max(1, h // 8)), Image.BILINEAR)
    squint = small.filter(ImageFilter.GaussianBlur(1.2)).resize((w, h), Image.NEAREST)

    # STAND BACK: the size it is really seen at. A 6x zoom judgement is a lie
    # about a game played on a phone.
    back = rgb.resize((max(1, w // 4), max(1, h // 4)), Image.NEAREST).resize(
        (w, h), Image.NEAREST)

    return [
        ('AS IS', rgb, 'what I think I made'),
        ('FLIPPED', ImageOps.mirror(rgb),
         'mirrored — balance errors your eye has stopped seeing jump out'),
        ('GREYSCALE', ImageOps.grayscale(rgb).convert('RGB'),
         'value only — if it does not read here, it does not read'),
        ('SQUINTED', squint,
         'detail removed — is there structure under it, or was detail the picture?'),
        ('STAND BACK', back,
         'the size it is actually seen at, not the size I judge it at'),
    ]


def main():
    if len(sys.argv) < 2:
        print(__doc__.strip().splitlines()[-1])
        return 1
    src = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else (
        os.path.splitext(src)[0] + '_LOOK_AGAIN.png')
    im = Image.open(src)
    ps = panels(im)

    # lay them out at a size that fits a phone-ish column, side by side in pairs
    k = min(1.0, 460.0 / im.width)
    tw, th = max(1, int(im.width * k)), max(1, int(im.height * k))
    cols = 2 if tw * 2 + 36 < 1100 else 1
    rows_n = (len(ps) + cols - 1) // cols
    pad, head = 12, 46
    W = pad + cols * (tw + pad)
    H = head + rows_n * (th + 44)
    sheet = Image.new('RGB', (W, H), (18, 18, 15))
    d = ImageDraw.Draw(sheet)
    d.text((pad, 10), 'LOOK AGAIN — %s' % os.path.basename(src), fill=(238, 220, 168))
    d.text((pad, 26), 'the four things a real artist does before showing anybody. '
                      'No score, no verdict — just fresh eyes.', fill=(150, 142, 120))
    for i, (name, img, why) in enumerate(ps):
        x = pad + (i % cols) * (tw + pad)
        y = head + (i // cols) * (th + 44)
        sheet.paste(img.resize((tw, th), Image.NEAREST), (x, y))
        d.text((x, y + th + 4), name, fill=(206, 194, 164))
        d.text((x, y + th + 18), why[:78], fill=(140, 134, 116))
    sheet.save(out)
    print('OK -> %s  (%d views)' % (out, len(ps)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
