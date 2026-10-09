#!/usr/bin/env python3
"""BOHEMIA — A DAY ON THE MAP IN TWENTY SECONDS: the stitcher (10/9/26, LIFE + CITY, [the living map]).

Takes the frames tools/bohemia_a_day_on_the_map_reel.js photographed off THE ALPHA's own map, a game
half-hour apart, and makes the moving picture for the VOTE tab (THE VOTE TAB SHOWS THE THING, first
votes: animations play). Nothing in a frame is drawn here; the only thing added is a strip under each
frame carrying the clock the game itself reported for that frame, and how many prints it drew.

REFUSES if any frame's log says two parties stood on one cell, or if no frame drew a single print.

REUSE CHECK: every pixel above the strip is the game's own canvas (the driver's shot); the strip is
the reel's caption, nothing else.
REFERENCE CHECK:
  AH-01   the ordinary frame with ONE wrong thing. Held: the game's own frames, nothing composed.
  BLDG-03 one light direction. Held: the game's renderer, untouched.
  BLDG-05 structural sanity. Held: the game's renderer, untouched.

Run from repo root after the .js:  python3 tools/bohemia_a_day_on_the_map_reel.py
Writes: slices/vote/LIFECITY_A_DAY_ON_THE_MAP_10_9.gif
"""
import glob, json, os, sys
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, 'records', 'lifecity_pictures', 'reel')
OUT = os.path.join(ROOT, 'slices', 'vote', 'LIFECITY_A_DAY_ON_THE_MAP_10_9.gif')
WIDE, STRIP, MS = 390, 26, 620


def main():
    frames = sorted(glob.glob(os.path.join(SRC, 'f*.png')))
    log = json.load(open(os.path.join(SRC, 'log.json')))
    if len(frames) != len(log) or not frames:
        sys.exit('REFUSING: %d frames against %d log lines.' % (len(frames), len(log)))
    if any(l['stacks'] for l in log):
        sys.exit('REFUSING: a frame had two parties on one cell.')
    if not any(l['drawn'] for l in log):
        sys.exit('REFUSING: not one print was drawn in the whole day.')
    out = []
    for f, l in zip(frames, log):
        im = Image.open(f).convert('RGB')
        h = round(im.height * WIDE / im.width)
        im = im.resize((WIDE, h), Image.LANCZOS)
        c = Image.new('RGB', (WIDE, h + STRIP), (18, 14, 10))
        c.paste(im, (0, 0))
        d = ImageDraw.Draw(c)
        hh, mm = divmod(int(l['min']), 60)
        market = sum(1 for x in l['crowd'] if x[2])
        d.text((6, h + 7), '%02d:%02d   PRINTS %d   MARKET DAY AT %d GATES' % (hh, mm, l['drawn'], market),
               fill=(232, 220, 192))
        out.append(c.quantize(colors=64, method=Image.MEDIANCUT))
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    out[0].save(OUT, save_all=True, append_images=out[1:], duration=MS, loop=0, optimize=True)
    print('A DAY ON THE MAP: %d frames, %.1f s, %s to %s, %.0f KB' % (
        len(out), len(out) * MS / 1000, log[0]['min'], log[-1]['min'], os.path.getsize(OUT) / 1024))


if __name__ == '__main__':
    main()
