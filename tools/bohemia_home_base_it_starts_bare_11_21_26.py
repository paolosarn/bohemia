#!/usr/bin/env python3
"""BOHEMIA -- HOME BASE, IT STARTS BARE (VAMILY rule 445(b), Paolo 11/10: 'everything will be in our own custom settlement that we
build from the ground up'; rule 458(c): his place is shown through its cameras; rule 441: whole, on the page he plays).

MEASURED (the demo, a new game planted on day 2, upright and sideways, 11/21): his planted place opened on COOK's picture of his
outfit's camp (slices/settlement_ground_towns/custom*.webp): a trailer, a clinic tent, a stall, a gun stand, a bar sign, a barber's
chair, the hiring posts, the job board and a junk lot, all baked into one painted picture, with a crowd of strangers at them. None of
it was his: he had built nothing.

WHAT THIS DRAWS: the same place's own ground and nothing on it. Line for line RUN FIVE's whole-town render
(tools/bohemia_run5_the_town_drawn_whole_11_6_26.py render_wide, render_tall: the same seed, the same plan of Custom's ground, its
old slabs of houses pulled down, the track and the yard's concrete, the ground continued past the plan, the same camera, light, film
and night), with the town's layout and fill left out: no thing is placed, so no thing is drawn. Every pixel of the frame is where it
is in COOK's picture, so the BUILD ground (the lots) is the same ground at the same pixels.

  <bvenv>/bin/python tools/bohemia_home_base_it_starts_bare_11_21_26.py --wide|--tall [--side left|right] [--quick] [--day-only]
  (venv: python3.11 -m venv bv && bv/bin/pip install bpy==4.2.0 numpy pillow scipy)
  -> records/target/home_base/bare/*.png (local), slices/home_base/bare_wide.webp, bare_wide_night.webp, bare_tall.webp,
     bare_tall_night.webp (one upright picture for both phone sides: the side only chose which corner to clear of things, and
     nothing stands here, so the left and right renders are the same pixels, measured)
  --ship-only ships the renders already made

COOK's and CAMP TWO's files are not edited: the camp's picture stays for every place that is not his. REUSE CHECK: the plan, the
ground builder, the rig, the light and the night are COOK's and RUN FIVE's, imported; new here only that nothing is laid.
"""
import os, sys, math, hashlib, random
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(R, 'tools'))
import numpy as np

TOWN = 'Custom'                                          # his outfit's place: the name the map posts for the block he planted
OUT = os.path.join(R, 'records/target/home_base/bare')
SHIP = os.path.join(R, 'slices/home_base')
MODE = 'wide' if '--wide' in sys.argv else 'tall' if '--tall' in sys.argv else None


def bare(R5, V):
    """the layout and the fill lay nothing: the place's ground only"""
    V.layout = lambda town, pl, K: None
    V.fill = lambda town, pl, K, n_want=14: 0


def render(R5, town, quick, day_only):
    """RUN FIVE's own render, its frame, ground, light and night; the outputs moved to this lane's folder"""
    R5.OUT = OUT
    if MODE == 'wide': return R5.render_wide(town, quick=quick, day_only=day_only)
    import bohemia_four_layouts_tall_render_10_27_26 as T4
    return R5.render_tall(town, T4, quick=quick, day_only=day_only)


# THE CAMERA'S OWN LAMP AT NIGHT (measured 11/21, the camera's infrared grading of the screen, grayscale then contrast 1.22 then
# brightness 1.6, worked on the pixels): the bare ground's moonlit night read 7 of 255 on average through it, a black screen; COOK's
# camp night read a median of 12 (the camp's lamps carried it). This picture is only ever seen through his cameras, and a security
# camera at night lights its own ground with its infrared lamp: the moonlit render is lifted, most where the camera is near (the
# bottom of the frame, the cameras look down it) and least far, to a median of about 100 through the grading near and 40 far.
NEAR_GAIN, FAR_GAIN = 2.9, 1.55


def ir_lamp(img):
    import numpy as np
    from PIL import Image
    a = np.asarray(img.convert('RGB')).astype(np.float32)
    H = a.shape[0]; y = (np.arange(H, dtype=np.float32) / max(1, H - 1))[:, None, None]
    g = FAR_GAIN + (NEAR_GAIN - FAR_GAIN) * (y ** 1.3)
    return Image.fromarray(np.clip(a * g, 0, 255).astype(np.uint8))


def through_the_camera(img):
    """the screen's night sensor on the pixels: grayscale(1) contrast(1.22) brightness(1.6) (HLENS_SENSOR_NIGHT)"""
    import numpy as np
    L = np.asarray(img.convert('L')).astype(np.float32)
    return np.clip(np.clip((L - 128) * 1.22 + 128, 0, 255) * 1.6, 0, 255)


def ship(paths, name):
    from PIL import Image
    import numpy as np
    os.makedirs(SHIP, exist_ok=True)
    for p, sfx in zip(paths, ('', '_night')):
        if not p or not os.path.exists(p): continue
        a = Image.open(p).convert('RGB')
        if sfx:
            before = through_the_camera(a); a = ir_lamp(a); after = through_the_camera(a); H = after.shape[0]
            print('  the night through his camera: median %.0f before, %.0f after (near %.0f, far %.0f)' % (np.median(before), np.median(after), np.median(after[int(H * .8):]), np.median(after[:int(H * .2)])), flush=True)
        out = os.path.join(SHIP, name + sfx + '.webp')
        a.save(out, quality=82, method=6); print('  shipped', out, a.size, flush=True)


if __name__ == '__main__':
    a = sys.argv[1:]
    if MODE is None: raise SystemExit('--wide or --tall')
    if '--ship-only' in a:                                  # ship the renders already made (the night's lamp re-applied)
        for name, key in (('bare_wide', 'wide/custom'), ('bare_tall', 'tall/custom_left')):
            if (MODE == 'wide') == (name == 'bare_wide'): ship((os.path.join(OUT, key + '.png'), os.path.join(OUT, key + '_night.png')), name)
        sys.stdout.flush(); os._exit(0)
    sys.argv = [x for x in sys.argv if x != '--full'] + ['--full']   # the tall render is whole, never pasted under COOK's picture
    import bohemia_run5_the_town_drawn_whole_11_6_26 as R5
    import bohemia_cook_every_town_its_own_screen_10_25_26 as V
    town = [t for t in V.towns() if t['name'] == TOWN][0]
    quick, day_only = '--quick' in a, '--day-only' in a
    if MODE == 'wide':
        import bohemia_cook_every_town_wide_relaid_10_26_26 as WR
        WR.patch_wide(); bare(R5, V); WR._LASTW['town'] = None   # after the wide's own patch (it lays its own layout); no town named, so no shop is looked for
        d, n = render(R5, town, quick, day_only)
        import json; json.dump = WR._orig_dump
        if not quick: ship((d, n), 'bare_wide')
    else:
        import bohemia_cook_every_town_tall_and_wide_10_26_26 as T
        import bohemia_four_layouts_tall_render_10_27_26 as T4
        T.patch_tall(); V.Town = T._Hook; bare(R5, V)            # after the tall's own patch, which lays its own layout
        sides = ['left', 'right'] if '--side' not in a else [a[a.index('--side') + 1]]
        for sd in sides:
            T4.SIDE = sd; T._LAST['town'] = None   # no town named: no shop is looked for in a picture with none
            d, n = render(R5, town, quick, day_only)
            if not quick and sd == sides[0]: ship((d, n), 'bare_tall')   # one picture for both sides: with nothing on it there is no corner to clear (measured: left and right the same pixels)
    sys.stdout.flush(); os._exit(0)
