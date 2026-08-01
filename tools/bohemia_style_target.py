#!/usr/bin/env python3
"""
BOHEMIA — THE LOOK, MEASURED OFF WHAT HE BOUGHT (8/1/26)

Paolo 8/1: "I really need you trying to make as much pixel art that I approve of for
everything we need in the game as possible INSPIRED BY THE GRAPHIC ASSETS THAT I BOUGHT
TRYING TO REPLICATE THE EXACT LOOK I don't know what's so difficult"

REUSE CHECK: cooks NOTHING. It opens the PURCHASED libraries (BOHEMIA_GROUND_SEAMLESS
_SET, WALL, ROOF) and derives numbers. No pixel is drawn or written. This is the ruler
every cook in this lane now has to measure up against.

WHY THIS EXISTS, AND IT IS THE ANSWER TO THREE REJECTED BATCHES
--------------------------------------------------------------
"Replicate the exact look" was being read as a palette problem for weeks. It is not.
Measured side by side, on the exact tiles shipping in the game:

    surface                colours/tile   edge |dL|   grain    saturation
    HIS BOUGHT concrete           1361       20.8      65.1%      0.253
    my recooked tileset            417        8.7      24.4%      0.323
    my house skins (he UP'd)        81        9.4      26.2%      0.383
    my CMU wall                      4        7.1      14.4%      0.082
    my perimeter wall             1222        7.0      23.2%      0.466

HIS ART IS ROUGH AND GREY. MINE IS SMOOTH AND TOO COLOURFUL. He has ~2.5x the local
contrast and ~2.7x the grain density at ~60% of the saturation. That is the whole gap,
and no amount of choosing better colours closes it, because the difference is not WHICH
colours but HOW MANY and HOW FAST THEY CHANGE. A flat-shaded tile with a 13-colour ramp
cannot sit next to a photographic 1,300-colour texture and read as the same game -- and
that is exactly what the street screenshot showed: his rich cracked asphalt directly
above a flat painted field.

    DEFINITIONS, so the gate and the cook mean the same thing by them:
      colours    distinct RGB triples in the tile
      edge       mean |luminance difference| between horizontally adjacent pixels
      grain      % of adjacent pairs differing by more than 8 luminance
      sat        mean HSV saturation over all pixels
      lum        mean and standard deviation of luminance

  python3 tools/bohemia_style_target.py  -> records/BOHEMIA_STYLE_TARGET_8_1_26.json
                                         -> prints the table above
"""
import base64
import colorsys
import io
import json
import os
import statistics as st

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

from PIL import Image  # noqa: E402

OUT = 'records/BOHEMIA_STYLE_TARGET_8_1_26.json'
GROUND = 'banks/BOHEMIA_GROUND_SEAMLESS_SET_7_10_26.txt'


def measure(im):
    im = im.convert('RGB')
    w, h = im.size
    b = im.tobytes()
    px = [(b[i], b[i + 1], b[i + 2]) for i in range(0, len(b), 3)]
    L = [0.299 * r + 0.587 * g + 0.114 * bb for r, g, bb in px]
    e = [abs(L[y * w + x] - L[y * w + x + 1]) for y in range(h) for x in range(w - 1)]
    return dict(
        colours=len(set(px)),
        edge=st.mean(e) if e else 0.0,
        grain=100.0 * sum(1 for v in e if v > 8) / len(e) if e else 0.0,
        sat=st.mean([colorsys.rgb_to_hsv(r / 255, g / 255, bb / 255)[1] for r, g, bb in px]),
        lum_mean=st.mean(L),
        lum_sd=st.pstdev(L),
        lum_min=min(L),
        lum_max=max(L),
    )


def tolerance(rows):
    """THE BAND IS HIS ACTUAL SPREAD, not numbers I picked that felt about right.

    Paolo 8/1, approving all 90: "Dont be scared to have a little more variety in color!"
    He was correcting a real error. The first tolerance was hand-written as sat 0.15-0.34
    on the strength of his MEAN being 0.189 -- reading an average as a ceiling. Measured
    per tile, his shipping ground art actually runs 0.058 to 0.501, a 9x spread, and the
    cook was huddling at the bottom of a band that was itself far tighter than his
    library. So the band is now DERIVED: the observed range of his own tiles, with a
    small margin, on every metric. If his library is varied, the art built against it is
    allowed to be varied.

    colours_min stays a hard floor rather than a percentile: it is the anti-regression
    that stops a 13-colour flat ramp ever going beside his art again, which is the whole
    reason any of this exists.
    """
    def band(key, pad, lo_pct=0.0):
        v = sorted(r[key] for r in rows)
        lo = v[int(lo_pct * (len(v) - 1))]
        hi = v[-1]
        span = max(hi - lo, 1e-6)
        return [round(lo - span * pad, 4), round(hi + span * pad, 4)]

    # TWO KINDS OF METRIC, AND THEY DO NOT GET THE SAME TREATMENT.
    #
    # COLOUR is a spread to REPRODUCE. He said so: "Dont be scared to have a little more
    # variety in color". Saturation takes his FULL observed range, floor to ceiling.
    #
    # DETAIL DENSITY is a FLOOR to HOLD. Smooth art is the failure this whole system
    # exists to prevent, and taking the absolute minimum of his library put the edge
    # floor at 7.05 -- which is exactly where the rejected house skins (9.4) and CMU
    # wall (7.1) measured. Deriving a band that readmits the art it was built to keep
    # out is worse than not deriving it. So edge and grain take a 25th-PERCENTILE floor:
    # still his real art, but not his softest outlier used as a licence.
    return {
        'colours_min': 600,
        'edge': band('edge', 0.10, 0.25),
        'grain': band('grain', 0.10, 0.25),
        'sat': band('sat', 0.05),
        'lum_mean': band('lum_mean', 0.10),
        'lum_sd': band('lum_sd', 0.15),
        'derived_from': '%d of his shipping tiles. colour = his full observed range; '
                        'detail density = 25th percentile floor, so a derived band can '
                        'never readmit the smooth art it exists to keep out' % len(rows),
    }


def summarise(rows):
    keys = ['colours', 'edge', 'grain', 'sat', 'lum_mean', 'lum_sd', 'lum_min', 'lum_max']
    return {k: round(st.mean([r[k] for r in rows]), 4) for k in keys}


def main():
    bank = json.load(open(GROUND))
    groups = {
        'concrete': lambda p: 'contrete' in p or 'concrete' in p,
        'street': lambda p: 'cracked street' in p,
    }
    out = {}
    per_tile = []
    for name, match in groups.items():
        rows = []
        for t in bank['tiles']:
            if not t.get('b64') or not match(str(t.get('pack', '')).lower()):
                continue
            m = measure(Image.open(io.BytesIO(base64.b64decode(t['b64']))))
            rows.append(m)
            per_tile.append(m)
        if rows:
            out[name] = summarise(rows)
            out[name]['n'] = len(rows)

    allrows = []
    for name in out:
        allrows.append(out[name])
    tgt = {k: round(st.mean([r[k] for r in allrows]), 4)
           for k in ('colours', 'edge', 'grain', 'sat', 'lum_mean', 'lum_sd')}

    doc = {
        'version': 'BOHEMIA_STYLE_TARGET_v1',
        'date': '2026-08-01',
        'ruling': 'Paolo 8/1: "make as much pixel art that I approve of ... INSPIRED BY '
                  'THE GRAPHIC ASSETS THAT I BOUGHT TRYING TO REPLICATE THE EXACT LOOK"',
        'source': GROUND + ' (the tiles already shipping in the game)',
        'note': 'HIS ART IS ROUGH AND GREY; painted art in this repo has been SMOOTH and '
                'TOO COLOURFUL. The gap is detail DENSITY, not palette choice. Any tile '
                'cooked to sit beside his must land inside TOLERANCE of TARGET.',
        'definitions': {
            'colours': 'distinct RGB triples in the tile',
            'edge': 'mean |luminance delta| between horizontally adjacent pixels',
            'grain': 'percent of adjacent pairs differing by more than 8 luminance',
            'sat': 'mean HSV saturation',
        },
        'per_pack': out,
        'TARGET': tgt,
        'TOLERANCE': tolerance(per_tile),
    }
    json.dump(doc, open(OUT, 'w'), indent=2)

    print('THE LOOK, measured off the tiles he BOUGHT (and already ships):')
    for name, v in out.items():
        print('  %-10s n=%-3d colours %6.0f  edge %5.2f  grain %5.1f%%  sat %.3f  '
              'lum %5.1f sd %4.1f' % (name, v['n'], v['colours'], v['edge'], v['grain'],
                                      v['sat'], v['lum_mean'], v['lum_sd']))
    print('  TARGET     colours %6.0f  edge %5.2f  grain %5.1f%%  sat %.3f  lum %5.1f sd %4.1f'
          % (tgt['colours'], tgt['edge'], tgt['grain'], tgt['sat'], tgt['lum_mean'],
             tgt['lum_sd']))
    print('  -> %s' % OUT)


if __name__ == '__main__':
    main()
