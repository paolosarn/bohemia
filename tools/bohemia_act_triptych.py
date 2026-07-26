#!/usr/bin/env python3
"""
BOHEMIA — THE ACT TRIPTYCH, PROVEN (7/26/26)

THE LAW. Two clauses, and they pull against each other on purpose:

  law 3 of the art-first reset: "THE ACT TRIPTYCH: every tile family is born
  with act1-dead / act2-recovering / act3-rebuilt variants in its spec."

  amendment A, correcting it: "assets are born era-READY (3D-bake source
  structured with overlay/material layers so act variants derive cheaply), NOT
  era-complete. Act-1 look locks first. Era derivation proven on 2-3
  representative families only. Landmarks get bespoke era looks; filler SHARES
  era treatments (the AoE model). Never hold an approval hostage to three
  finished eras."

So this tool does NOT paint 126 tiles. It proves that act 2 and act 3 DERIVE
from the locked act-1 tile by a shared treatment, on THREE representative
families - one per render layer - and stops there. If the derivation holds on a
ground, a wall and a roof, it holds on the filler.

THE PROBLEM WORTH NAMING: the approved corpus has its decay PAINTED IN. The
cracks, the dust and the weeds are already pixels; there is no clean source
underneath to reveal. So "derive act 2" cannot mean "turn a knob down". It means
UNDOING paint, and the only honest way to undo paint you did not author is to
find it first.

THE TREATMENT, in three shared steps, no per-tile hand work:
  1. ESTIMATE THE CLEAN SURFACE. Heavily blur the tile. Cracks and grime are
     small and dark; the blur is what the wall looked like before them.
  2. EXTRACT THE DECAY MASK. Wherever a pixel is darker than that estimate, the
     difference IS the decay. That mask is the overlay layer amendment A asks
     for - it just had to be recovered instead of authored.
  3. HEAL BY A FACTOR. act2 lerps each pixel toward the clean estimate by the
     decay weight x 0.55; act3 by 0.90, plus a fresh-surface tint. Weeds are
     handled separately because they are LIGHTER and GREENER than their
     surroundings, so the darkness mask cannot see them.

WHAT IS DELIBERATELY NOT DONE: act 3 does not add new content (no planters, no
signage, no people). Rebuilt-Vegas content is Paolo's canon, not a filter's.
This proves the MATERIAL derivation only. MECHANISM-MINE / CONTENTS-PAOLO'S.

REUSE CHECK: cooks no new graphic pixels and opens no bank of its own. It reads
the FROZEN act-1 starter set, banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt
(itself built only from approved art), READ ONLY - that set is byte-locked by
the visual constitution and this tool must never write to it.

TASTE CHECK: act2/act3 tiles are candidates, so they inherit the taste rules the
act-1 set is held to. Two of those rules are DELIBERATELY relaxed for later acts
and the reason is recorded rather than hidden: the act-1 value bands do not
apply (a repaired wall is brighter than a dead one - that is the whole point),
and DEAD DARK GLASS is an ACT 1 rule (the dead-world reconciliation is explicitly
about act 1), so act 3 may show clean glass. Radiation and volcanic iconography
stay banned in every act, because those are lore, not weathering.

  python3 tools/bohemia_act_triptych.py
    -> banks/BOHEMIA_ACT_TRIPTYCH_PROOF_7_26_26.txt
    -> records/target/ACT_TRIPTYCH.png
"""
import base64
import io
import json
import os

from PIL import Image, ImageFilter

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ACT1 = 'banks/BOHEMIA_STARTER_TILESET_ACT1_7_26_26.txt'
OUT_BANK = 'banks/BOHEMIA_ACT_TRIPTYCH_PROOF_7_26_26.txt'
OUT_SHEET = 'records/target/ACT_TRIPTYCH.png'

# ONE representative family per render layer. Amendment A says 2-3; this is 3,
# chosen so every layer the world draws is covered exactly once.
FAMILIES = [
    ('yard_0', 'ground', 'the dead gravel yard - the surface most of a lot is made of'),
    ('wall_0', 'wall', 'plain stucco wall - the material every building face is made of'),
    ('roof_slope', 'top', 'terracotta roof tile - the material every pitched roof is made of'),
]

HEAL = {'act2': 0.55, 'act3': 0.90}
# a repaired surface is not just less dirty, it is repainted. Act 3 lifts value
# and pulls the yellowed dust cast back out.
FRESH = {'act2': (1.03, 1.02, 1.00), 'act3': (1.10, 1.09, 1.06)}


def clean_estimate(im):
    """What the surface looked like before thirty years happened to it."""
    return im.convert('RGB').filter(ImageFilter.GaussianBlur(5))


def derive(im, act):
    """The shared era treatment. No per-tile hand work anywhere in here."""
    src = im.convert('RGB')
    base = clean_estimate(src)
    w, h = src.size
    sp, bp = src.load(), base.load()
    out = Image.new('RGB', (w, h))
    op = out.load()
    k = HEAL[act]
    fr = FRESH[act]
    for y in range(h):
        for x in range(w):
            r, g, b = sp[x, y]
            br, bg, bb = bp[x, y]
            lum = 0.299 * r + 0.587 * g + 0.114 * b
            blum = 0.299 * br + 0.587 * bg + 0.114 * bb
            # 1+2. how much darker than the clean estimate is this pixel? that
            #      difference IS the decay, and it is the overlay layer.
            decay = max(0.0, blum - lum) / 42.0
            # WEEDS: lighter and greener than the surface, so the darkness mask
            # is blind to them. They get their own term or act 3 stays overgrown.
            weed = 1.0 if (g > r + 12 and g > b + 18 and lum > 40) else 0.0
            t = min(1.0, max(decay, weed)) * k
            nr = r + (br - r) * t
            ng = g + (bg - g) * t
            nb = b + (bb - b) * t
            op[x, y] = (min(255, int(nr * fr[0])), min(255, int(ng * fr[1])),
                        min(255, int(nb * fr[2])))
    res = out.convert('RGBA')
    res.putalpha(im.convert('RGBA').getchannel('A'))
    return res


def b64(img):
    b = io.BytesIO()
    img.save(b, 'PNG', optimize=True)
    return base64.b64encode(b.getvalue()).decode()


def main():
    ts = json.load(open(ACT1))
    by_id = {t['id']: t for t in ts['tiles']}
    rows, out = [], []
    for tid, layer, what in FAMILIES:
        if tid not in by_id:
            raise SystemExit('the act-1 set has no %s to derive from' % tid)
        a1 = Image.open(io.BytesIO(base64.b64decode(by_id[tid]['b64']))).convert('RGBA')
        a2, a3 = derive(a1, 'act2'), derive(a1, 'act3')
        rows.append((tid, a1, a2, a3))
        for act, img, note in (
                ('act1', a1, 'the locked act-1 tile, untouched - this is the source'),
                ('act2', a2, 'RECOVERING: decay healed 55%%, surface lifted slightly. '
                             'Somebody is maintaining this again.'),
                ('act3', a3, 'REBUILT: decay healed 90%%, weeds gone, repainted. No new '
                             'content added - rebuilt-Vegas content is Paolo\'s canon, '
                             'not a filter\'s.')):
            out.append({'id': '%s__%s' % (tid, act), 'family': tid, 'act': act,
                        'layer': layer, 'what': '%s | %s' % (what, note), 'b64': b64(img)})

    bank = {
        'version': 'BOHEMIA_ACT_TRIPTYCH_PROOF_v1',
        'built': '2026-07-26',
        'status': 'PROOF - era derivation demonstrated on 3 families, one per layer',
        'law': ('art-first reset law 3 (the act triptych) as CORRECTED by amendment A: '
                'assets are born era-READY, not era-complete; derivation is proven on 2-3 '
                'representative families only and filler SHARES the treatment.'),
        'source': ACT1,
        'source_is_frozen': True,
        'treatment': {
            'step_1': 'blur the tile heavily - that is the clean surface underneath',
            'step_2': 'wherever a pixel is darker than that, the difference IS the decay',
            'step_3': 'lerp toward clean by decay x heal factor, then lift the surface',
            'weeds': 'handled separately: they are LIGHTER and GREENER, so a darkness '
                     'mask cannot see them',
            'heal': HEAL, 'fresh': FRESH,
            'why_not_a_knob': ('the approved corpus has its decay PAINTED IN, so there is '
                               'no clean source to turn down. The overlay layer amendment A '
                               'asks for had to be RECOVERED from the art rather than '
                               'authored beside it.'),
        },
        'relaxed_for_later_acts': {
            'value_bands': 'act-1 bands do not apply - a repaired wall IS brighter',
            'dead_dark_glass': 'an ACT 1 rule (the dead-world reconciliation says so); '
                               'act 3 may show clean glass',
        },
        'still_banned_in_every_act': 'radiation and volcanic iconography - lore, not weather',
        'tiles': out,
    }
    with open(OUT_BANK, 'w') as f:
        json.dump(bank, f)

    S = ts['cell_px'] * 3
    sheet = Image.new('RGB', (S * 3 + 40, len(rows) * (S + 26) + 26), (16, 16, 13))
    from PIL import ImageDraw
    d = ImageDraw.Draw(sheet)
    for i, lab in enumerate(('ACT 1 - DEAD (locked)', 'ACT 2 - RECOVERING', 'ACT 3 - REBUILT')):
        d.text((10 + i * (S + 10), 8), lab, fill=(232, 212, 162))
    for r, (tid, *imgs) in enumerate(rows):
        y = 26 + r * (S + 26)
        for c, im in enumerate(imgs):
            sheet.paste(im.convert('RGB').resize((S, S), Image.NEAREST), (10 + c * (S + 10), y))
        d.text((10, y + S + 6), tid, fill=(190, 178, 148))
    sheet.save(OUT_SHEET)
    print('OK  %d families x 3 acts = %d tiles -> %s' % (len(rows), len(out), OUT_BANK))
    print('    contact sheet: %s' % OUT_SHEET)


if __name__ == '__main__':
    main()
