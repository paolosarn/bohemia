#!/usr/bin/env python3
"""BOHEMIA -- DIRECTION [the style guide] field 4: THE SOURCE PALETTE (rule 114a; rule 115d).

The colours a MODEL is painted with before the rig renders it, one ramp per material role, five steps from shadow to
highlight, the hue shift built into the hex (round one tell 5: straight darkening is the signature of a shade()
function). This is the SOURCE palette, never an output cap: his packs carry 2,330 to 6,600 colours a tile and the rig's
renders carry thousands (TUNING and MODS 10/18 both measured it), so the render is never snapped to these 5-step ramps;
the model's base colours are. A render's output is judged by the card of numbers' bands instead.

Each ramp is anchored on a colour the fleet already approved: clay_mustard is the robot's own 'Main' (sRGB of linear
0.59, 0.291, 0.038), tape_grey the robot's 'Grey', rubber the robot's 'Black' lifted off black, clay_rust and
clay_teal his abandoned car's rust and teal (reference/art_bank/prop/pack_10_abandoned_cars_003.png, the truck's twin),
the skins from the runway portraits' three tones. The ramp: 0.38 and 0.62 of the anchor's value into the shadow, the
anchor, then 42 and 78 percent of the way to white into the light (less for a material darker than half value), the hue walking toward 245 degrees (cool) into the shadow and toward 50 degrees (warm)
into the light, saturation up a little in the shadow and down in the highlight. Every step is checked: end-to-end hue
shift at least 8 degrees, the darkest step's value at least 20 of 255 (never black), adjacent steps at least 8 percent
apart in luminance.

    python3 tools/bohemia_direction_style_palette.py          # writes records/target/BOHEMIA_STYLE_PALETTE.json
    python3 tools/bohemia_direction_style_palette.py --check  # recomputes and diffs, exit 1 on drift
"""
import colorsys, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')

# role: (anchor hex, what it is, where the anchor came from, hue walk in degrees each way)
ANCHORS = {
    'clay_mustard': ('#c99437', 'the hero clay, the robot\'s body', 'RobotExpressive.glb material Main, linear (0.59, 0.291, 0.038)', 14),
    'clay_bone': ('#b8a886', 'pale clay, bleached things, bone', 'the bible\'s bleached desert; the card\'s warm share 0.93', 12),
    'clay_rust': ('#9a4f2c', 'rust, faded red paint', 'his abandoned car, the rust patches', 12),
    'clay_teal': ('#4f6f6a', 'old teal paint, the truck\'s chassis', 'his abandoned car, the teal body', 14),
    'tape_grey': ('#a4a39b', 'duct tape, grey metal trim', 'RobotExpressive.glb material Grey, linear (0.374, 0.371, 0.335)', 30),
    'tape_masking': ('#c2a878', 'masking tape, cardboard', 'the UI materials\' tape (slices/bohemia_ui_materials.js)', 10),
    'metal_painted': ('#6d6f5e', 'painted metal, olive drab', 'the military surplus on the runway (Rick Owens\' drab)', 10),
    'rubber': ('#3a3836', 'tyres, boots, the robot\'s black, never black', 'RobotExpressive.glb material Black, lifted off 0.046', 14),
    'cloth_black': ('#2e2b2c', 'the runway black (Rick Owens, Balenciaga), never black', 'rule 114a: shadows never black', 8),
    'skin_light': ('#c99a7c', 'light skin', 'the portrait lane\'s light tone', 12),
    'skin_mid': ('#a8704c', 'mid skin', 'the portrait lane\'s mid tone', 12),
    'skin_deep': ('#6a4230', 'deep skin', 'the portrait lane\'s deep tone', 12),
    'glass_eye': ('#20262a', 'glass eyes and lenses: two steps and a glint', 'the analog-horror stare (bible R6)', 16),
    'chrome': ('#8c9094', 'chrome and bare steel: two steps and a glint', 'rule 115: matte everywhere but four glossy exceptions', 8),
    'blood': ('#6e1a1a', 'wet blood: two steps and a glint', 'the four glossy exceptions', 8),
    'sodium': ('#cc8f38', 'a lit lamp, a fire, the only self-lit colour', 'COMBAT\'s night pools (sodium under a lamp)', 10),
}
VALUES = [0.38, 0.62, 1.0, 1.22, 1.42]           # step value as a share of the anchor's value (shadows)
LIFT = [0.42, 0.78]                              # the two lights: that share of the way from the anchor's value to white
SAT = [1.12, 1.06, 1.0, 0.80, 0.58]              # saturation into the shadow up, into the light down
WALK = [-1.0, -0.55, 0.0, 0.55, 1.0]             # the hue walk, shadow (cool) to light (warm)
COOL, WARM = 245.0, 50.0
SHORT = {'glass_eye': [1, 3], 'chrome': [1, 3], 'blood': [1, 3]}   # two-step materials keep steps 2 and 4, the glint is step 5


def hx(rgb): return '#%02x%02x%02x' % tuple(int(round(max(0, min(1, c)) * 255)) for c in rgb)
def rgb(h): return tuple(int(h[i:i + 2], 16) / 255 for i in (1, 3, 5))
def lum(c): return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def toward(h, target, deg):
    """move hue h (degrees) toward target by at most deg along the short way"""
    d = (target - h + 540) % 360 - 180
    return (h + max(-deg, min(deg, d))) % 360


def ramp(anchor, walk):
    h, s, v = colorsys.rgb_to_hsv(*rgb(anchor)); h *= 360
    out = []
    for vk, sk, wk in zip(VALUES, SAT, WALK):
        hh = toward(h, COOL, walk * -wk) if wk < 0 else toward(h, WARM, walk * wk)
        vv = v * vk if vk <= 1 else v + (1 - v) * LIFT[VALUES.index(vk) - 3] * min(1.0, v / 0.5)   # the lights climb toward white (a dark material less), never clamp flat
        vv = min(1.0, max(20 / 255, vv)); ss = min(1.0, s * sk)
        out.append(hx(colorsys.hsv_to_rgb(hh / 360, ss, vv)))
    return out


def hue(hexs): return colorsys.rgb_to_hsv(*rgb(hexs))[0] * 360


def build():
    roles = {}
    for name, (anchor, what, src, walk) in ANCHORS.items():
        r = ramp(anchor, walk)
        if name in SHORT:   # a glossy material: two steps and ONE hot glint pixel, near white, warm (the light's own colour)
            h0, s0, _ = colorsys.rgb_to_hsv(*rgb(anchor))
            r = [r[i] for i in SHORT[name]] + [hx(colorsys.hsv_to_rgb(toward(h0 * 360, WARM, 40) / 360, s0 * 0.3, 0.94))]
        dh = abs((hue(r[-1]) - hue(r[0]) + 540) % 360 - 180)
        gaps = [abs(lum(rgb(r[i + 1])) - lum(rgb(r[i]))) / max(lum(rgb(r[i + 1])), lum(rgb(r[i])), 1e-6) for i in range(len(r) - 1)]
        roles[name] = dict(ramp=r, mid=r[len(r) // 2] if name not in SHORT else r[0], anchor=anchor, what=what, anchor_from=src,
                           hue_shift_deg=round(dh, 1), darkest_value=int(round(max(rgb(r[0])) * 255)), min_lum_gap=round(min(gaps), 3),
                           glint=r[-1] if name in SHORT else None)
    return dict(palette='BOHEMIA_STYLE_PALETTE', schema=1, lane='direction', date='10/18/26', status='LIVE: the source palette (style guide field 4)',
                rule='rule 114a field 4 and rule 115d: the colours a model is painted with before the rig; never an output cap (the output is judged by the card of numbers)',
                how='each ramp: values %s of the anchor, saturation x%s, hue walking toward %g (cool) into the shadow and %g (warm) into the light' % (VALUES, SAT, COOL, WARM),
                limits=dict(hue_shift_deg_min=8, darkest_value_min=20, adjacent_lum_gap_min=0.08, steps=5, steps_glossy=3),
                roles=roles, colours=sum(len(r['ramp']) for r in roles.values()),
                built_by='tools/bohemia_direction_style_palette.py')


def problems(p):
    bad = []
    L = p['limits']
    for n, r in p['roles'].items():
        if r['hue_shift_deg'] < L['hue_shift_deg_min']: bad.append('%s hue shift %.1f < %d' % (n, r['hue_shift_deg'], L['hue_shift_deg_min']))
        if r['darkest_value'] < L['darkest_value_min']: bad.append('%s darkest %d < %d (black)' % (n, r['darkest_value'], L['darkest_value_min']))
        if r['min_lum_gap'] < L['adjacent_lum_gap_min']: bad.append('%s adjacent gap %.3f < %.2f' % (n, r['min_lum_gap'], L['adjacent_lum_gap_min']))
    return bad


if __name__ == '__main__':
    p = build()
    bad = problems(p)
    if '--check' in sys.argv:
        cur = json.load(open(OUT))
        drift = [n for n in p['roles'] if cur['roles'].get(n, {}).get('ramp') != p['roles'][n]['ramp']]
        print('palette drift: %s; ramp problems: %s' % (drift or 'none', bad or 'none'))
        sys.exit(1 if drift or bad else 0)
    json.dump(p, open(OUT, 'w'), indent=1)
    for n, r in p['roles'].items(): print('%-14s %s  shift %5.1f  dark %3d  gap %.3f' % (n, ' '.join(r['ramp']), r['hue_shift_deg'], r['darkest_value'], r['min_lum_gap']))
    print('problems:', bad or 'none')
