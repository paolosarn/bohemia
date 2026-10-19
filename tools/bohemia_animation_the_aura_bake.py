#!/usr/bin/env python3
"""BOHEMIA -- ANIMATION [the aura of the one you control], 10/19 (rule 120(c)): BAKES WHAT THE VOTE PAGE PLAYS.

  1. THE CLIPS: the film tool's 48 crops a candidate (tools/bohemia_animation_the_aura_film.js <dir> clips), taken off
     the real fight from the game's camera at his phone's pixels, become one looping clip each,
     slices/vote/ANIMATION_THE_AURA_CLIP_<ECHO|TEAR|CURRENT>.webp: two bars, every picture held a twelfth of a second
     (83/83/84 ms so the bar is exactly 2,000 ms at 120), lossless, so what he sees is the pixels the game drew. The
     same crop with no aura is kept as a PNG (the twin).
  2. THE EIGHT: the poncho crewman as DIRECTION's master rig rendered him for PORTRAIT (records/target/portrait/rig/crew/
     cast_poncho/rig_<F>.png, the man whose turn it is in the filmed fight), the eight facings in one strip,
     slices/vote/ANIMATION_THE_AURA_EIGHT.png, with where his feet stand in each (the lowest opaque rows, the contact
     shadow left out by the rig's own alpha threshold) and where the world's origin lands for the current's arcs
     (window.AURA_EIGHT in slices/vote/ANIMATION_THE_AURA_EIGHT_TABLE.js), and a piece of the fight's own ground
     (COMBAT TWO's scrub block at its own pixels) for the page to stand him on.
     python3 tools/bohemia_animation_the_aura_bake.py <film dir> [<map film dir>]
  3. THE MAP: the film tool's map mode, the same three round his party on the real map at the map's size, the same way.

REFERENCE CHECK (the 9/4 standing duty): the compare law; the twin is the same fight with no aura (the tape corners,
COMBAT's mark for the man acting); the style palette's chrome and glass ramps; no reference game.
"""
import os, sys, json
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOTE = os.path.join(ROOT, 'slices/vote')
FACINGS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
CREW = os.path.join(ROOT, 'records/target/portrait/rig/crew/cast_poncho')
KINDS = ['echo', 'tear', 'current']
DUR = [83, 83, 84]   # a twelfth of a second, held; three of them are 250 ms, so 48 are the two bars exactly


def clips(film, pre=''):
    """pre '' is the fight (ANIMATION_THE_AURA_CLIP_<KIND>.webp), 'map_' the big map at the map's size
    (ANIMATION_THE_AURA_MAP_CLIP_<KIND>.webp): the same 48 held pictures, two bars"""
    out = {}
    tag = 'MAP_' if pre else ''
    for k in KINDS:
        fr = [os.path.join(film, '%s%s_%02d.png' % (pre, k, i)) for i in range(48)]
        if not all(os.path.exists(f) for f in fr):
            print('no clip for', pre + k); continue
        ims = [Image.open(f).convert('RGB') for f in fr]
        dst = os.path.join(VOTE, 'ANIMATION_THE_AURA_%sCLIP_%s.webp' % (tag, k.upper()))
        ims[0].save(dst, save_all=True, append_images=ims[1:], duration=[DUR[i % 3] for i in range(48)], loop=0, lossless=True, method=6)
        out[pre + k] = {'file': os.path.relpath(dst, ROOT), 'bytes': os.path.getsize(dst), 'size': ims[0].size}
    none = os.path.join(film, pre + 'none_00.png')
    if os.path.exists(none):
        Image.open(none).convert('RGB').save(os.path.join(VOTE, 'ANIMATION_THE_AURA_%sNONE.png' % tag))
        out[pre + 'none'] = 'slices/vote/ANIMATION_THE_AURA_%sNONE.png' % tag
    return out


def eight():
    ims = [Image.open(os.path.join(CREW, 'rig_%s.png' % f)).convert('RGBA') for f in FACINGS]
    w, h = ims[0].size
    strip = Image.new('RGBA', (w * 8, h), (0, 0, 0, 0))
    feet = {}
    for i, (f, im) in enumerate(zip(FACINGS, ims)):
        strip.paste(im, (i * w, 0))
        a = im.getchannel('A').load()
        rows = [y for y in range(h) if any(a[x, y] > 127 for x in range(w))]
        low = rows[-1]
        xs = [x for y in range(low - 5, low + 1) for x in range(w) if a[x, y] > 127]
        feet[f] = [round(sum(xs) / len(xs), 1), low + 1]
    strip.save(os.path.join(VOTE, 'ANIMATION_THE_AURA_EIGHT.png'))
    rig = json.load(open(os.path.join(CREW, 'rig.json')))
    # the scrub block's middle, at its own pixels: a plain piece of the fight's ground for him to stand on
    g = Image.open(os.path.join(ROOT, 'slices/fight_ground/block_scrub_0.webp')).convert('RGB')
    gw, gh = 300, 420
    g.crop(((g.width - gw) // 2, (g.height - gh) // 2, (g.width + gw) // 2, (g.height + gh) // 2)).save(os.path.join(VOTE, 'ANIMATION_THE_AURA_GROUND.png'))
    T = {'cell': [w, h], 'facings': FACINGS, 'feet': feet, 'src': 'ANIMATION_THE_AURA_EIGHT.png', 'ground': 'ANIMATION_THE_AURA_GROUND.png',
         'from': os.path.relpath(CREW, ROOT), 'crop_box_px': rig.get('crop_box_px'), 'ppm': rig.get('ppm')}
    org = origins(rig, w, h)
    if org:
        T['origin'] = org
    open(os.path.join(VOTE, 'ANIMATION_THE_AURA_EIGHT_TABLE.js'), 'w').write(
        '/* ANIMATION [the aura of the one you control]: the poncho crewman from the rig, eight facings (tools/bohemia_animation_the_aura_bake.py) */\n'
        'window.AURA_EIGHT = ' + json.dumps(T) + ';\n')
    return T


def origins(rig, w, h):
    """where the world's origin (his feet's centre on the ground) lands in his cells: the rig turns the model about the
    origin under one fixed camera, so it is one point for all eight. The camera looks at the body's middle, so the
    render's centre is the look point and the ground centre sits look_z x sin(tilt) below it (the master rig's own
    formula, round seven: ground_screen); the crop box moves both into the cell"""
    import math
    res = rig.get('res'); box = rig.get('crop_box_px'); dims = rig.get('real_dims_m'); zs = rig.get('z_stretch') or 1.4142
    tilt = (rig.get('camera') or {}).get('tilt_deg', 45) if isinstance(rig.get('camera'), dict) else 45
    if not res or not box or not dims:
        return None
    gx = res / 2.0 - box[0]
    gy = res / 2.0 + dims[2] * zs / 2.0 * math.sin(math.radians(tilt)) * rig.get('ppm', 57) - box[1]
    return {f: [round(gx, 1), round(gy, 1)] for f in FACINGS}


if __name__ == '__main__':
    film = sys.argv[1] if len(sys.argv) > 1 else None
    rep = {'eight': eight()}
    if film:
        rep['clips'] = clips(film)
        rep['map'] = clips(sys.argv[2] if len(sys.argv) > 2 else film, 'map_')
    print(json.dumps(rep, indent=1)[:3000])
