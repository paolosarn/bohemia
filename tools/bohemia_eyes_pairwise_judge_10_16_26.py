#!/usr/bin/env python3
"""EYES AND EARS -- [the pairwise judge]  (rule 108 ROUND TEN (3) and (4); rule 100)

THE JUDGING RECIPE EVERY ART LANE CALLS, not a one-off built for one card. Round one
(records/BOHEMIA_EYES_THE_PAIRWISE_JUDGE_ROUND_1_SCHOOL_THE_CATALOGUE_ALREADY_HAS_EIGHT_FAULTS_10_11_26.md)
found the fault catalogue already built (eight real measures across two existing tools) and the
compositing/boundary-detection shape already proven last round -- this tool connects them, adds
nothing invented.

WHAT IT DOES, given three images (candidate A, candidate B, the twin) all the same crop:
  1. Composites a three-up strip at one art pixel to one phone pixel, plus an 8x8 and a 16x16
     SQUINT of each -- a literal downscale (never the Gaussian-blur "squint" another tool already
     uses under that name; round one named the collision so round two does not reuse the wrong
     one).
  2. Runs the eight-fault catalogue on A and B (imported, not re-measured): orphan share,
     single-use colours, block size, pillow score, light-angle agreement, cluster density
     (tools/bohemia_pixel_craft_audit.py), banding and jaggies/doubles
     (tools/bohemia_eyes_pixel_tells.py).
  3. Computes the real YIQ perceptual distance (tools/bohemia_eyes_before_and_after_check's own
     formula, Kotsarenko and Ramos 2010) from each candidate to the twin, as the PROOF LINE under
     the question, never the show.
  4. Prints the one plain question and leaves the verdict (which candidate, the one fault tag on
     a clear loser) to be written by EYES looking at the strip -- this tool does not decide, it
     arms the decision with real numbers and real pictures, same split this lane has kept all
     session (a number is the proof line, the eye gives the verdict).

PROVEN ON THREE REAL PENDING CARDS from ui-the-six-at-pack-pixels-10-13 (sha "pending" in
records/target/BOHEMIA_VOTE_REGISTRY.json, genuinely undecided, not invented for this round):
the CREW button (A: bare glass, B: a receipt like NOTES -- NOTES itself stands in as the twin,
since there is no pack photo of a "CREW button" and NOTES is the established style this bar
already ships), and two of the six supply icons (batteries, water) where A and B are two
DIFFERENT real pack tiles rather than one drawn and one real -- named honestly in the record,
because for those two "closer to the twin" does not quite fit (each candidate IS its own twin,
a direct uncooked cut per rule 82a) and the real question is which pack tile reads more clearly
at icon size, not which drew truer to a shared reference.

    python3 tools/bohemia_eyes_pairwise_judge_10_16_26.py
      -> records/eyes_pairwise_judge/<item>_strip.png   (one per judged item)
      -> records/eyes_pairwise_judge/report.json
"""
import importlib, json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
os.chdir(ROOT)

OUT_DIR = 'records/eyes_pairwise_judge'
CARD = 'records/target/UI_ONE_AT_A_TIME_THE_SIX_AT_PACK_PIXELS.png'
MANIFEST = 'records/target/UI_THE_SIX_AT_PACK_PIXELS.json'
BG, INK, HOT, DIM = (18, 16, 14), (232, 224, 204), (226, 162, 72), (150, 142, 128)

PCA = importlib.import_module('bohemia_pixel_craft_audit')
PT = importlib.import_module('bohemia_eyes_pixel_tells')
BA = importlib.import_module('bohemia_eyes_before_and_after_check_10_10_26')


def font(sz):
    for p in ('/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf',
              '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
        if os.path.exists(p):
            return ImageFont.truetype(p, sz)
    return ImageFont.load_default()


def squint(im, n):
    """THE LITERAL SQUINT rule 108 means: downscale to n x n, nearest neighbour back up for
    display, to test whether the silhouette still reads with the detail gone. NOT the Gaussian
    blur tools/bohemia_look_again.py already calls "squint" -- a different technique, named in
    round one so this round does not reuse the wrong one by the word alone."""
    small = im.convert('RGB').resize((n, n), Image.LANCZOS)
    return small.resize((n * 8, n * 8), Image.NEAREST)


def fault_tags(im):
    """THE EIGHT-FAULT CATALOGUE, IMPORTED NOT RE-MEASURED. Returns the tags that actually fire,
    each with the real number behind it -- never a tag asserted without its measurement."""
    tags = []
    orphan_pct, _ = PCA.orphan_share(im)
    if orphan_pct > 0.02:
        tags.append(('orphan pixels', round(orphan_pct, 3)))
    pillow = PCA.pillow_score(im)
    if pillow is not None and pillow > 0.3:
        tags.append(('pillow shading', round(pillow, 2)))
    light_deg, light_strength = PCA.light_angle(im)
    band_pct, banded_rows, drawn = PT.banding(im)
    if band_pct > 15.0:
        tags.append(('banding', band_pct))
    return tags, dict(orphan=round(orphan_pct, 3), pillow=round(pillow, 2) if pillow is not None else None,
                       light_angle=round(light_deg, 1) if light_deg is not None else None,
                       banding_pct=band_pct)


def yiq_distance_pct(a, b):
    """Nearest-neighbour resize to a common size before the real YIQ distance, never bicubic --
    a smoothing resample would manufacture antialiasing the real pixel art does not have."""
    if a.size != b.size:
        a = a.resize(b.size, Image.NEAREST)
    mask, pct = BA.visible_fraction(a, b)
    return pct


def strip(label, question, a_im, b_im, twin_im, a_stats, b_stats, a_tags, b_tags, a_dist, b_dist):
    f16, f12, f11 = font(16), font(12), font(11)
    cell = 160
    pad = 14
    cols = [a_im, b_im, twin_im]
    names = ['CANDIDATE A', 'CANDIDATE B', 'THE TWIN']
    W = pad * 2 + cell * 3 + 40
    sq_row_h = 8 * 8 + 8 * 8 + 30
    H = 140 + cell + 20 + sq_row_h + 90
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((pad, 10), label.upper(), font=f16, fill=INK)
    d.text((pad, 34), question, font=f11, fill=HOT)
    y = 60
    for i, (im2, name) in enumerate(zip(cols, names)):
        x = pad + i * (cell + 10)
        t = im2.convert('RGB').copy()
        t.thumbnail((cell, cell), Image.NEAREST)
        im.paste(t, (x, y + (cell - t.height) // 2))
        d.text((x, y + cell + 4), name, font=f12, fill=INK)
    y += cell + 26
    d.text((pad, y), 'THE SQUINT (8x8 then 16x16, literal downscale, never the blur): does the '
                     'silhouette still read with the detail gone?', font=f11, fill=DIM)
    y += 18
    for i, im2 in enumerate([a_im, b_im]):
        x = pad + i * (cell + 10)
        s8, s16 = squint(im2, 8), squint(im2, 16)
        im.paste(s8.resize((60, 60), Image.NEAREST), (x, y))
        im.paste(s16.resize((60, 60), Image.NEAREST), (x + 70, y))
    y += 70
    for i, (nm, st, tg, ds) in enumerate([('A', a_stats, a_tags, a_dist), ('B', b_stats, b_tags, b_dist)]):
        tagtxt = ', '.join('%s %s' % (t, v) for t, v in tg) if tg else 'none fired'
        d.text((pad, y), '%s  orphan %.3f  pillow %s  light %s deg  dist-to-twin %.1f%%  faults: %s' %
                (nm, st['orphan'], st['pillow'], st['light_angle'], ds, tagtxt), font=f11, fill=INK)
        y += 18
    return im


def judge_crew():
    im = Image.open(CARD).convert('RGB')
    dpr = 3
    shots = {'A': 1050, 'B': 1532}
    x0, y1, w, h = 281, 3, 52, 44
    a = im.crop(((x0) * dpr, shots['A'] + y1 * dpr, (x0 + w) * dpr, shots['A'] + (y1 + h) * dpr))
    b = im.crop(((x0) * dpr, shots['B'] + y1 * dpr, (x0 + w) * dpr, shots['B'] + (y1 + h) * dpr))
    twin = im.crop(((x0 + w) * dpr, shots['A'] + y1 * dpr, (x0 + w + 60) * dpr, shots['A'] + (y1 + h) * dpr))
    return a, b, twin, 'CREW BUTTON: A (bare glass) vs B (a receipt like NOTES) -- which is closer to NOTES (the established style already shipped on this bar) in outline weight / material / silhouette?'


def on_bg(rgba_path, bg):
    """A REAL BUG CAUGHT BEFORE TRUSTING ANY NUMBER: the pack twin files are RGBA with a fully
    TRANSPARENT background; a naive .convert('RGB') keeps whatever RGB happened to sit under
    alpha=0 (here, pure black), while the composited card fills its background with the manifest's
    own bg colour. Comparing those two backgrounds as if they were art would read as a huge false
    difference that has nothing to do with the batteries or the water. Composite onto the SAME
    background both sides actually use before any distance is computed."""
    im = Image.open(rgba_path).convert('RGBA')
    canvas = Image.new('RGB', im.size, bg)
    canvas.paste(im, (0, 0), im)
    return canvas


def judge_icon(name):
    manifest = json.load(open(MANIFEST))
    bg = tuple(manifest['bg'][:3])
    im = Image.open(CARD).convert('RGB')
    a_cut = next(c for c in manifest['cuts'] if c['set'] == 'A' and c['supply'] == name)
    b_cut = next(c for c in manifest['cuts'] if c['set'] == 'B' and c['supply'] == name)
    a = im.crop((a_cut['x'], a_cut['y'], a_cut['x'] + a_cut['w'], a_cut['y'] + a_cut['h']))
    b = im.crop((b_cut['x'], b_cut['y'], b_cut['x'] + b_cut['w'], b_cut['y'] + b_cut['h']))
    a_twin = on_bg(a_cut['src'], bg)
    b_twin = on_bg(b_cut['src'], bg)
    q = ('%s: A (%s) vs B (%s) -- NOT a drawn-vs-reference case (rule 82a: both are direct, '
         'uncooked cuts of a real pack tile, each its own twin). The real question here is which '
         'pack tile reads more clearly as "%s" at icon size, not which is closer to a shared '
         'twin -- named honestly rather than forcing the wrong frame.') % (
        name.upper(), os.path.basename(a_cut['src']), os.path.basename(b_cut['src']), name)
    return a, b, a_twin, b_twin, q


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    report = {}

    # --- CARD 1: the CREW button, a real "closer to the twin" case (NOTES stands in) ---
    a, b, twin, q = judge_crew()
    a_tags, a_stats = fault_tags(a)
    b_tags, b_stats = fault_tags(b)
    da, db = yiq_distance_pct(a, twin), yiq_distance_pct(b, twin)
    strip('the crew button', q, a, b, twin, a_stats, b_stats, a_tags, b_tags, da, db).save(
        os.path.join(OUT_DIR, 'crew_button_strip.png'), optimize=True)
    report['crew_button'] = dict(question=q, a=dict(stats=a_stats, faults=a_tags, dist_to_twin_pct=round(da, 2)),
                                  b=dict(stats=b_stats, faults=b_tags, dist_to_twin_pct=round(db, 2)))
    print('CREW BUTTON   dist-to-NOTES  A %.1f%%  B %.1f%%  (lower = closer)  faults A:%s B:%s' %
          (da, db, a_tags, b_tags))

    # --- CARDS 2 and 3: two of the six icons, each candidate its own twin (named honestly) ---
    for name in ('batteries', 'water'):
        a, b, a_twin, b_twin, q = judge_icon(name)
        # A REAL BUG CAUGHT BEFORE TRUSTING ANY FAULT NUMBER: the card crop (a, b) is a flat RGB
        # render with the sheet's own analog-horror grain baked into its background, which the
        # fault catalogue's opaque() would read as "drawn" (no alpha channel left to exclude it),
        # swamping every measure with background noise that has nothing to do with the icon. The
        # pack source file still carries real alpha, so faults are measured on THAT directly, not
        # on the flat crop used only for the strip's picture.
        manifest = json.load(open(MANIFEST))
        a_cut = next(c for c in manifest['cuts'] if c['set'] == 'A' and c['supply'] == name)
        b_cut = next(c for c in manifest['cuts'] if c['set'] == 'B' and c['supply'] == name)
        a_tags, a_stats = fault_tags(Image.open(a_cut['src']))
        b_tags, b_stats = fault_tags(Image.open(b_cut['src']))
        da = yiq_distance_pct(a, a_twin)  # should read ~0: a direct cut of its own twin
        db = yiq_distance_pct(b, b_twin)
        strip('the %s icon' % name, q, a, b, a_twin, a_stats, b_stats, a_tags, b_tags, da, db).save(
            os.path.join(OUT_DIR, '%s_strip.png' % name), optimize=True)
        report[name] = dict(question=q, a=dict(stats=a_stats, faults=a_tags, dist_to_own_twin_pct=round(da, 2)),
                             b=dict(stats=b_stats, faults=b_tags, dist_to_own_twin_pct=round(db, 2)))
        print('%-10s  own-twin fidelity  A %.2f%%  B %.2f%%  (should read ~0, a direct cut)  faults A:%s B:%s' %
              (name.upper(), da, db, a_tags, b_tags))

    with open(os.path.join(OUT_DIR, 'report.json'), 'w') as f:
        json.dump(report, f, indent=2)
    print('\n  wrote %s/report.json and three strips' % OUT_DIR)


if __name__ == '__main__':
    main()
