#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION, THE AURA BAR (rule 120(c), 10/19/26: DIRECTION judges ANIMATION's [the aura of the one you
control] before VOTE). His words 10/18: 'when you're controlling a person there should be some aura, fifth dimension,
electric Amalgamation vibes, analog horror... around that character, even on the big map, not just a portrait'; his NO
on the blue and orange lines round people (10/17) stands: never a coloured outline. The rig's look (rule 115, CRASHBOX:
'nothing glows'). The numbers live in records/target/BOHEMIA_STYLE_GUIDE.json, classes.aura.aura_bar; this file measures.

It reads ANIMATION's own film (tools/bohemia_animation_the_aura_film.js <dir> stills|clips): each candidate's crops
<kind>_<slot>.png beside none_00.png, the same crop with no aura, all at the game's camera on the real fight.
  A1 NEVER AN OUTLINE   what the aura changes does not enclose him: the changed pixels with their holes filled are at most
                        enclosure_max times the changed pixels (a line drawn round a body encloses the whole body)
  A2 NOTHING GLOWS      the colours the aura adds that the bare frame does not hold number at most new_colours_max
                        (a glow, a blur or a see-through layer makes hundreds of in-between colours)
  A3 NO PURPLE          purple stays the Amalgamation's alone (PURPLE RESERVATION): aura pixels in the purple hues
  A4 IT READS, IT DOES NOT DROWN  the share of the crop it changes, averaged over the slots, inside a band
  A5 HIS FACE STAYS CLEAR  the share of his head box the aura changes on its worst slot (the one man you control is the
                        clearest face on the board, never the most broken one)
  A6 HIS NEIGHBOURS STAY CLEAR  the share of the crop outside his own column that the aura changes on its worst slot
                        (nobody stands on anybody, the first votes)

REFERENCE CHECK (the 9/4 standing duty): the bare frame of the same fight at the same camera is the twin; AH-01 (the
bible: R8 diegetic or dead, R10 grime baked), the style guide. No reference game.

usage: python3 tools/bohemia_direction_aura_bar.py <film dir> [<out.json>]
"""
import sys, os, json, glob
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GUIDE = os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')


def bar():
    return json.load(open(GUIDE))['classes']['aura']['aura_bar']


def rgb(p):
    return np.asarray(Image.open(p).convert('RGB')).astype(int)


def filled(mask):
    """the mask with its holes filled: flood the outside from a one-pixel border, everything not reached is inside"""
    h, w = mask.shape
    im = Image.new('L', (w + 2, h + 2), 0); im.paste(Image.fromarray((mask * 255).astype(np.uint8)), (1, 1))
    ImageDraw.floodfill(im, (0, 0), 128)
    return (np.asarray(im)[1:-1, 1:-1] != 128)


def purple(a):
    x = a / 255.0; mx = x.max(-1); mn = x.min(-1); d = mx - mn + 1e-9
    r, g, b = x[..., 0], x[..., 1], x[..., 2]
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    return (h > 260) & (h < 320) & (d / (mx + 1e-9) > 0.25) & (mx > 0.2)


def judge(film, B):
    none = rgb(os.path.join(film, 'none_00.png')); H, W, _ = none.shape
    meta = json.load(open(os.path.join(film, 'film.json')))
    full = os.path.join(film, 'none_full.png')   # the whole bare frame: a tear moves in pixels from outside the crop
    have = set(map(tuple, (rgb(full) if os.path.exists(full) else none).reshape(-1, 3)))
    hb = B['head_box']; head = (slice(int(hb[1] * H), int(hb[3] * H)), slice(int(hb[0] * W), int(hb[2] * W)))
    col = B['his_column']; out_col = np.ones((H, W), bool); out_col[:, int(col[0] * W):int(col[1] * W)] = False
    T = B['tests']; res = {}
    for kind in meta['kinds']:
        shots = sorted(p for p in glob.glob(os.path.join(film, kind + '_[0-9][0-9].png')))
        if not shots:
            continue
        enc, newc, purp, share, face, nb, drew = [], set(), 0, [], [], [], 0
        for p in shots:
            a = rgb(p)
            if a.shape != none.shape:
                continue
            m = np.abs(a - none).max(-1) > B['changed_level']
            if m.sum() == 0:
                share.append(0.0); face.append(0.0); nb.append(0.0); continue
            drew += 1
            enc.append(filled(m).sum() / m.sum())
            newc |= set(map(tuple, a[m])) - have
            purp += int((purple(a) & m).sum())
            share.append(float(m.mean())); face.append(float(m[head].mean())); nb.append(float(m[out_col].mean()))
        if not drew:
            res[kind] = {'drew': 0, 'pass': None, 'why': 'drew nothing on the fight (its sheet is not there yet)'}
            continue
        r = dict(drew=drew, of=len(shots), enclosure=round(max(enc), 2), new_colours=len(newc), purple_px=purp,
                 share=round(float(np.mean(share)), 4), face_worst=round(max(face), 3), neighbours_worst=round(max(nb), 3))
        r['tests'] = {t: bool(v) for t, v in dict(
            A1=r['enclosure'] <= T['A1_enclosure_max'], A2=r['new_colours'] <= T['A2_new_colours_max'],
            A3=r['purple_px'] <= T['A3_purple_px_max'], A4=T['A4_share'][0] <= r['share'] <= T['A4_share'][1],
            A5=r['face_worst'] <= T['A5_face_max'], A6=r['neighbours_worst'] <= T['A6_neighbours_max']).items()}
        r['enclosure'] = float(r['enclosure'])
        r['pass'] = all(r['tests'].values()); res[kind] = r
    return dict(film=film, man=meta.get('man'), seed=meta.get('seed'), kinds=res)


def plant_outline(film):
    """the control: a one-pixel ring traced round the changed area of the first echo slot must fail A1"""
    none = rgb(os.path.join(film, 'none_00.png')); H, W, _ = none.shape
    a = none.copy(); y0, y1, x0, x1 = int(H * .2), int(H * .85), int(W * .33), int(W * .67)
    a[y0, x0:x1] = a[y1, x0:x1] = [70, 140, 255]; a[y0:y1 + 1, x0] = a[y0:y1 + 1, x1] = [70, 140, 255]
    m = np.abs(a - none).max(-1) > 12
    return round(float(filled(m).sum() / m.sum()), 2)


def plant_glow(film):
    """the second control: a soft cyan glow round him (a blurred halo laid see-through, the AI-slop aura) must fail A2"""
    from PIL import ImageFilter
    bare = Image.open(os.path.join(film, 'none_00.png')).convert('RGB'); W, H = bare.size
    halo = Image.new('L', (W, H), 0); ImageDraw.Draw(halo).ellipse([W * .3, H * .15, W * .7, H * .9], fill=150)
    halo = halo.filter(ImageFilter.GaussianBlur(14))
    a = np.asarray(Image.composite(Image.new('RGB', (W, H), (90, 230, 255)), bare, halo)).astype(int)
    none = rgb(os.path.join(film, 'none_00.png')); full = os.path.join(film, 'none_full.png')
    have = set(map(tuple, (rgb(full) if os.path.exists(full) else none).reshape(-1, 3)))
    m = np.abs(a - none).max(-1) > 12
    return len(set(map(tuple, a[m])) - have)


if __name__ == '__main__':
    film = sys.argv[1]; B = bar(); r = judge(film, B)
    r['control_outline_enclosure'] = plant_outline(film)
    r['control_glow_new_colours'] = plant_glow(film)
    r['control_ok'] = bool(r['control_outline_enclosure'] > B['tests']['A1_enclosure_max']
                           and r['control_glow_new_colours'] > B['tests']['A2_new_colours_max'])
    for k, v in r['kinds'].items():
        print('%-8s %s  %s' % (k, {True: 'PASS', False: 'FAIL', None: 'NOT DRAWN'}[v['pass']], json.dumps(v)))
    print('CONTROLS a blue line round him: enclosure %s; a soft cyan glow round him: %d new colours -> %s'
          % (r['control_outline_enclosure'], r['control_glow_new_colours'], 'both caught' if r['control_ok'] else 'MISSED'))
    if len(sys.argv) > 2:
        json.dump(r, open(sys.argv[2], 'w'), indent=1)
    sys.exit(0 if r['control_ok'] else 1)
