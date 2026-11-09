#!/usr/bin/env python3
"""BOHEMIA -- BESTIARY [the lab seven] (11/9/26; VAMILY rule 440(f), ask line 539; PAOLO 11/9: 'More everything pls').

THE JOB: the beast law's floor (laws/BOHEMIA_LAW_THE_BEASTS_ARE_LAB_MADE_AND_THE_BESTIARY_FLOOR_9_29_26.md s4: 17 beasts) counted
against the roster data (gates/the_bestiary_floor_gate.py), and new LAB-MADE beasts until it is met. MEASURED BEFORE (11/9, main
79516ffc): the fight fields 15 animals; 10 of them are lab-made de-extinct animals (the dire wolf, the cave hyena, the short-faced
bear, the Shasta ground sloth, the sabre-tooth, the American lion, Camelops, the ancient bison, the Ice Age horse, the teratorn) and
5 are living animals loose from the valley (the coyote, the mountain lion, the feral hog, the feral bull, the feral dog). The law's
section 1: 'Every beast in Bohemia is an animal humans brought back with genetics'. So the honest count is 10 of 17, and these
seven make it 17.

THE SEVEN, every one an Ice Age animal of Nevada's own ground (its fossil named in records/target/bb/lab_beasts.json and on its
row's 'real'), carried by a living mother of the right size, able to live in the Mojave (his 9/30 test), fought like every other
beast (an existing brain, no key the others lack; rule 431(f): 'just another animal we can fight'):

  american_cheetah     Miracinonyx trumani, its first skull from CRYPT CAVE, Nevada (Orr 1969); its genome read (2005 mtDNA, 2026
                       nuclear genomes: a puma's cousin built for speed); a puma surrogate. Long thin legs, a small round head, a deep
                       chest and a tucked waist, a long tail: the cat that runs.
  harringtons_goat     Oreamnos harringtoni, named from SMITH CREEK CAVE, Nevada (Stock 1936); its DNA read (Campos et al. 2010); a
                       mountain goat surrogate. Smaller than today's, a narrow face, the shoulder hump, the beard, short black horns
                       swept back; it climbs (the roof is the high ground).
  stilt_legged_horse   Haringtonhippus francisci, the most complete skull from GYPSUM CAVE, Nevada, and its DNA read from that skull
                       (Heintzman et al. 2017); a burro surrogate (the Mojave's own wild burros). Thin legs, the long ears, an
                       upright mane, a donkey's tufted tail, grey-dun with the cross on the shoulders.
  long_horned_bison    Bison latifrons, Tule Springs (the monument lists it 'cf.'); its mitogenome read (Froese et al. 2017); a plains
                       bison surrogate. Twice a bison, horns 2 m tip to tip: the widest thing in the valley.
  pleistocene_jaguar   Panthera onca augusta, Nevada among its Ice Age records (Kurten 1973); its mitogenome read; a jaguar surrogate.
                       A fifth bigger than a jaguar, stocky, a big square head, a short thick tail, rosettes.
  large_headed_llama   Hemiauchenia, TULE SPRINGS (one forelimb bone, the monument's record); Ice Age, so its DNA is readable, not yet
                       read; a llama surrogate. Long legs, the neck straight up, the banana ears, no hump, two-tone like a guanaco.
  shrub_ox             Euceratherium, the Lake Winnemucca caves (Nevada) and Tule Springs' 'large bovid about its size'; Ice Age,
                       readable, not yet read; a muskox surrogate (its kin). Low and heavy, short legs, the horns out and down then up.

THE ART, REUSE FIRST (rule 115c, rule 108(a)): the same source as every rig beast. tools/bohemia_beasts_every_beast_its_own_body.py
grows each animal a body from its own measurements in metres on the Khronos Fox's skeleton (its bones and its moves); this tool only
ADDS seven animals to that tool's table (BEASTS, STRIDE) and paints their coats (its paint() has a branch per animal; ours is the same
code for these seven), then runs the same steps: model, the poses tool, DIRECTION's master rig in eight facings, the fight's sheet
(18 columns: the still, the walk 6, the bite 6, the blow 2, the fall 3; 64 colours; the lab plate keeps its colour), the strip.
Analog horror at the source, never a filter, never radiation, never gore: the hi-vis lab plate on the nape (rule 345 amended (d)),
the lab's shaved and stitched sample patch, the numbered collar.

    <venv bpy 4.2>/bin/python tools/bohemia_bestiary_the_lab_seven.py model [a,b]   -> reference/models/bohemia/own_body/<x>.glb
    <venv>/bin/python tools/bohemia_bestiary_the_lab_seven.py pose [a,b]            -> records/combat/rig/beast_<x>.glb
    <venv>/bin/python tools/bohemia_bestiary_the_lab_seven.py render [a,b]          -> records/target/combat/rig/beast_<x>/
    python3 tools/bohemia_bestiary_the_lab_seven.py pack [a,b]                       -> slices/fight_rig/beast_<x>.webp + the index
    python3 tools/bohemia_bestiary_the_lab_seven.py strip [a,b]                      -> records/target/bestiary_lab_seven/
then python3 tools/bohemia_run_the_sheets_packed.py (the fight's atlas).

REFERENCE CHECK (the 9/4 standing duty, rule 431(d) 'a creature reads as that creature at the map's own size'): each strip sets the
animal beside its nearest living-look sibling in the roster and the 1.72 m man at the fight's pixels, and again at the map's fifth;
gates/the_bestiary_floor_gate.py measures that its outline stays its own (against every other animal, at both sizes). No reference game.
"""
import json, math, os, sys, importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STRIPS = 'records/target/bestiary_lab_seven'


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, os.path.join(ROOT, path))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m


OB = load('own_body', 'tools/bohemia_beasts_every_beast_its_own_body.py')

# ---------------------------------------------------------------------------------------------------------------------------
# THE SEVEN, in metres, in the own-body tool's own terms (its header and records/BOHEMIA_BEASTS_EVERY_BEAST_ITS_OWN_BODY_11_3_26.md):
# nose toward -Y, up +Z, the animal's left +X, the ground z 0. Sources in records/BOHEMIA_BESTIARY_THE_LAB_SEVEN_11_9_26.md.
# ---------------------------------------------------------------------------------------------------------------------------
SEVEN = {
    # AMERICAN CHEETAH (Miracinonyx trumani; about a cougar's weight, 70 kg, but built to run: the legs long and thin so it stands
    # about 0.85 m at the shoulder against a puma's 0.65, a deep chest and a tucked waist, a SMALL round head with a short face and a
    # high forehead (the big nose passages of a runner), small round ears, a long tail for the turn).
    'american_cheetah': dict(
        wh=0.84, hh=0.86, bl=1.02, cd=0.38, sw=0.115, bw=0.11, hw=0.105, belly=-0.11, carpus=0.15, hock=0.33, footh=0.06,
        legf=(0.066, 0.044, 0.030, 0.044), legh=(0.082, 0.044, 0.030, 0.044), foot='paw',
        neck=[(-0.44, 0.72, 0.105, 0.085), (-0.58, 0.82, 0.08, 0.072)],
        head=(0.19, 0.075, 0.078, 2, 0.20, 0.045), ears=(0.045, 0.042, 0.010, 42, 68), eyes=0.016,
        tail=(0.80, (0.038, 0.034, 0.032, 0.030), (62, 84, 72, 46)), tuft=(0.10, 0.034),
        collar=0.45, labmark=True, griz=0.02, res=0.0075, gait='walk', bob=1.0, attack='pounce',
        real_note='0.84 m at the shoulder, about 2.0 m nose to tail tip, about 70 kg'),
    # HARRINGTON'S MOUNTAIN GOAT (Oreamnos harringtoni; smaller than today's mountain goat (0.9 to 1.0 m) with a narrower, longer
    # face and slighter horns: about 0.8 m at the shoulder; the goat's shape: a deep chest under a shoulder hump, the rump lower,
    # short stout legs on black hooves, a long beard under the chin, short black horns curving back, a short tail; the surrogate's
    # shaggy cream coat, the lab's numbered collar).
    'harringtons_goat': dict(
        wh=0.80, hh=0.72, bl=0.88, cd=0.44, sw=0.15, bw=0.17, hw=0.125, belly=0.02, carpus=0.23, hock=0.29, footh=0.06,
        legf=(0.07, 0.05, 0.035, 0.042), legh=(0.072, 0.05, 0.035, 0.042), foot='hoof', shoulder_mass=1.2,
        neck=[(-0.40, 0.72, 0.15, 0.11), (-0.54, 0.88, 0.11, 0.09)],
        head=(0.30, 0.075, 0.07, 30, 0.46, 0.042), ears=(0.10, 0.035, 0.010, 30, 55), eyes=0.014,
        tail=(0.12, (0.045, 0.035, 0.022), (60, 80, 88)),
        horns=dict(out=0.04, fwd=-0.15, up=0.22, r=0.032, n=9),
        crest=((0, -0.30, 0.80), (0.10, 0.22, 0.08)), beard=(0.17, 0.05),
        labmark=True, griz=0.10, res=0.0075, gait='walk', bob=1.1, attack='gore',
        real_note='0.80 m at the shoulder, about 1.35 m nose to rump, 60 to 80 kg'),
    # STILT-LEGGED HORSE (Haringtonhippus francisci; the size of an Asian wild ass, about 1.25 m at the withers and 200 kg, the
    # cannon bones long and thin (the 'stilt'), a slim body, a big head, LONG ears, an upright short mane, a donkey's thin tail with
    # a tuft; the burro surrogate's grey-dun with the dark stripe down the back and the cross over the shoulders).
    'stilt_legged_horse': dict(
        wh=1.25, hh=1.26, bl=1.18, cd=0.50, sw=0.165, bw=0.205, hw=0.175, belly=-0.02, carpus=0.33, hock=0.40, footh=0.12,
        legf=(0.074, 0.052, 0.030, 0.042), legh=(0.085, 0.052, 0.030, 0.042), foot='hoof',
        neck=[(-0.52, 1.06, 0.22, 0.12), (-0.72, 1.26, 0.16, 0.10), (-0.82, 1.42, 0.12, 0.085)], mane=0.075,
        head=(0.50, 0.11, 0.09, 55, 0.48, 0.068), ears=(0.25, 0.06, 0.018, 12, 80), eyes=0.024,
        tail=(0.55, (0.030, 0.020, 0.017), (75, 86, 90)), tuft=(0.20, 0.045),
        labmark=True, griz=0.04, res=0.0125, gait='walk', bob=1.0, attack='kick',
        real_note='1.25 m at the withers, about 2.0 m nose to rump, about 200 kg'),
    # LONG-HORNED BISON (Bison latifrons; about twice a modern bison, 2.3 m at the hump, 1,800 to 2,000 kg; the horns straight out
    # to the sides and a little up and forward, about 2.1 m tip to tip, the core alone over a metre; the hump, the shaggy front,
    # the head low; a shorter coat than a plains bison's (a warm-ground animal)).
    'long_horned_bison': dict(
        wh=2.20, hh=1.75, bl=2.50, cd=1.15, sw=0.46, bw=0.50, hw=0.36, belly=0.0, carpus=0.24, hock=0.30, footh=0.13,
        legf=(0.18, 0.125, 0.085, 0.10), legh=(0.16, 0.115, 0.08, 0.10), foot='hoof', shoulder_mass=1.3, ruff=1.0,
        neck=[(-1.10, 1.62, 0.48, 0.38), (-1.42, 1.18, 0.38, 0.32)],
        head=(0.70, 0.25, 0.24, 70, 0.32, 0.145), ears=(0.13, 0.065, 0.02, 92, -10), eyes=0.032,
        tail=(0.60, (0.055, 0.04, 0.03), (80, 88, 90)), tuft=(0.17, 0.055),
        horns=dict(out=0.98, fwd=0.18, up=0.30, r=0.12, n=14),
        crest=((0, -0.64, 2.00), (0.36, 0.80, 0.22)), dewlap=((0, -1.58, 0.74), (0.11, 0.22, 0.22)),
        labmark=True, griz=0.06, res=0.022, gait='walk', bob=1.0, attack='gore',
        real_note='2.2 m at the hump, about 4.0 m nose to rump, horns about 2.1 m across'),
    # PLEISTOCENE JAGUAR (Panthera onca augusta; a fifth bigger than a jaguar: 120 to 150 kg, 0.80 m at the shoulder, 1.8 m of head
    # and body; STOCKY, the legs short and thick, a massive square head and jaw, small round ears, a SHORT thick tail; gold with
    # black rosettes, the throat and belly pale).
    'pleistocene_jaguar': dict(
        wh=0.78, hh=0.80, bl=1.18, cd=0.46, sw=0.19, bw=0.21, hw=0.165, belly=0.04, carpus=0.11, hock=0.27, footh=0.07,
        legf=(0.105, 0.085, 0.064, 0.082), legh=(0.11, 0.078, 0.058, 0.078), foot='paw', blades=True, shoulder_mass=1.1,
        neck=[(-0.50, 0.66, 0.17, 0.16), (-0.66, 0.70, 0.15, 0.15)],
        head=(0.34, 0.135, 0.15, 6, 0.27, 0.085), ears=(0.055, 0.055, 0.012, 42, 64), eyes=0.019,
        tail=(0.60, (0.052, 0.048, 0.044, 0.040), (58, 84, 76, 58)),
        collar=0.42, labmark=True, griz=0.02, res=0.011, gait='walk', bob=1.0, attack='pounce',
        real_note='0.78 m at the shoulder, about 2.4 m nose to tail tip, 120 to 150 kg'),
    # LARGE-HEADED LLAMA (Hemiauchenia; a long-legged runner, bigger than a llama: about 1.3 m at the shoulder and 2.0 m at the
    # head; the neck held near straight up (never the camel's U), the head carried level, the curved 'banana' ears, NO hump, a
    # short tail held out, soft padded feet, the knees high; the guanaco's two tones, the lab's patch).
    'large_headed_llama': dict(
        wh=1.30, hh=1.30, bl=1.10, cd=0.50, sw=0.155, bw=0.20, hw=0.155, belly=-0.03, carpus=0.40, hock=0.40, footh=0.10, no_ridge=True,
        legf=(0.072, 0.048, 0.034, 0.058), legh=(0.078, 0.048, 0.034, 0.058), foot='pad', stifle_high=True,
        neck=[(-0.48, 1.22, 0.16, 0.11), (-0.58, 1.50, 0.12, 0.09), (-0.64, 1.76, 0.10, 0.08), (-0.66, 1.96, 0.09, 0.075)],
        head=(0.40, 0.085, 0.075, 18, 0.50, 0.055), ears=(0.15, 0.042, 0.012, 8, 84), eyes=0.02,
        tail=(0.26, (0.045, 0.035, 0.02), (25, 50, 75)),
        labmark=True, griz=0.05, res=0.012, gait='pace', bob=1.0, attack='kick',
        real_note='1.30 m at the shoulder, the head at 2.0 m, about 1.9 m nose to rump'),
    # SHRUB-OX (Euceratherium collinum; a browser of the desert shrub, a muskox's cousin: about 1.4 m at the shoulder and 600 kg,
    # long in the body and LOW, the legs short and thick, a deep chest, a heavy head held low, the horns from the top of the skull
    # out and DOWN past the eyes then up at the tips (the takin's and the muskox's kind), a short tail; dark brown, the legs paler).
    'shrub_ox': dict(
        wh=1.36, hh=1.30, bl=1.85, cd=0.78, sw=0.33, bw=0.38, hw=0.29, belly=0.06, carpus=0.21, hock=0.27, footh=0.10,
        legf=(0.13, 0.095, 0.068, 0.085), legh=(0.125, 0.09, 0.064, 0.085), foot='hoof', shoulder_mass=1.15,
        neck=[(-0.86, 1.10, 0.34, 0.26), (-1.06, 0.98, 0.28, 0.22)],
        head=(0.56, 0.17, 0.16, 50, 0.38, 0.11), ears=(0.11, 0.05, 0.016, 92, -20), eyes=0.026,
        tail=(0.30, (0.05, 0.035, 0.025), (78, 86, 90)),
        horns=dict(out=0.34, fwd=0.16, up=-0.16, r=0.095, n=10),
        crest=((0, -0.52, 1.30), (0.20, 0.36, 0.07)),
        labmark=True, griz=0.07, res=0.016, gait='walk', bob=1.0, attack='gore',
        real_note='1.36 m at the shoulder, about 2.4 m nose to rump, about 600 kg'),
}
# the stride: (stance share, the leg's swing either way in degrees, the fore knee's fold, the hind's fold, the bob in units on a
# 65-unit body, the head's nod, the body's roll, the tail's sway), on the own-body tool's own scale
STRIDE = {'american_cheetah': (0.58, 22, 56, 44, 0.6, 1, 0.0, 6), 'harringtons_goat': (0.58, 16, 50, 36, 1.0, 3, 0.0, 6),
          'stilt_legged_horse': (0.6, 20, 60, 44, 1.1, 4, 0.0, 8), 'long_horned_bison': (0.58, 12, 42, 28, 1.7, 4, 1.5, 6),
          'pleistocene_jaguar': (0.62, 16, 48, 38, 0.6, 1, 0.0, 5), 'large_headed_llama': (0.5, 20, 60, 44, 1.1, 3, 3.5, 8),
          'shrub_ox': (0.58, 14, 46, 32, 1.4, 3, 1.5, 4)}
# the nearest animal already in the roster each must not copy (the strip sets them side by side)
SIBLING = {'american_cheetah': 'mountain_lion', 'harringtons_goat': 'feral_hog', 'stilt_legged_horse': 'ice_age_horse',
           'long_horned_bison': 'ancient_bison', 'pleistocene_jaguar': 'mountain_lion', 'large_headed_llama': 'camelops',
           'shrub_ox': 'feral_bull'}

OB.BEASTS.update(SEVEN)
OB.STRIDE.update(STRIDE)
_orig_build = OB.build_body
_orig_paint = OB.paint


def build_body(name):
    """the own-body tool's body, and the one part it has no knob for: the goat's beard (an ellipsoid under the chin on the head bone)"""
    import numpy as np
    b = _orig_build(name)
    a = OB.BEASTS[name]
    if a.get('beard'):
        L, bl_ = a['beard']
        nose, poll = b.marks['nose'], b.marks['poll']
        c = poll + (nose - poll) * 0.55 - np.array([0, 0, a['head'][1] * 1.1 + L * 0.45])
        b.ell(c, (bl_ * 0.7, bl_, L * 0.5), 'beard', {OB.B['head']: 1.0}, s=4.0)
    return b


def paint(name, b, P, N, PART, pix):
    if name not in SEVEN: return _orig_paint(name, b, P, N, PART, pix)
    import numpy as np
    a = OB.BEASTS[name]
    C = lambda *c: np.array(c, np.float32)
    covered = PART >= 0
    isp = lambda *names: np.isin(PART, [pix[n] for n in names if n in pix])
    z = P[..., 2]; y = P[..., 1]; x = P[..., 0]; up = N[..., 2]
    wh, hh, bl, cd = a['wh'], a['hh'], a['bl'], a['cd']
    brisket = wh - cd
    head = isp('head', 'muzzle', 'snout', 'ear', 'beard')
    legs = isp('leg', 'hoof', 'pad', 'paw')
    rng = np.random.default_rng(len(name) * 7)
    lat = rng.random((80, 80, 80)).astype(np.float32)
    q = np.clip((P / 0.035 + 40).astype(int), 0, 79)
    griz = 1.0 + (lat[q[..., 0], q[..., 1], q[..., 2]] - 0.5) * a.get('griz', 0.08)
    lat2 = rng.random((24, 24, 24)).astype(np.float32)
    q2 = np.clip((P / 0.18 + 12).astype(int), 0, 23)
    drift = 1.0 + (lat2[q2[..., 0], q2[..., 1], q2[..., 2]] - 0.5) * 0.08
    out = np.zeros(P.shape, np.float32)

    def put(mask, col, k=1.0):
        out[mask] = (np.array(col, np.float32) * k)
    eye_d = np.min([np.linalg.norm(P - e, axis=-1) for e in b.marks['eyes']], 0)
    nose_d = np.linalg.norm(P - b.marks['nose'], axis=-1)
    tail_pts = b.marks['tail']
    tail_t = np.zeros(z.shape, np.float32)
    if 'tail' in pix:
        _, tail_t = OB.seg_dist(P, tail_pts[0], tail_pts[-1])
    belly = np.clip((brisket + 0.18 * cd - z) / (0.25 * cd), 0, 1) * np.clip(-N[..., 2] * 1.5 + 0.3, 0, 1)
    belly = belly * (~legs) * (~head)
    back = np.clip((up - 0.35) / 0.5, 0, 1) * (~head) * (z > brisket + 0.4 * cd)

    def patch_at(sp, parts, sx=0.08, sz=0.07, side=1):
        """the lab's shaved, stitched sample patch (a square of bare skin and a dark stitched line across it)"""
        pt = isp(*parts) & (P[..., 0] * side > 0.04) & (np.abs(y - sp[1]) < sx) & (np.abs(z - sp[2]) < sz)
        put(pt, C(0.74, 0.62, 0.57)); put(pt & (np.abs((y - sp[1]) - (z - sp[2]) * 0.8) < 0.009), C(0.22, 0.12, 0.11))

    def spots(cell, r, col, where, ring=None):
        """one round mark per cell of a jittered 3D grid (the cave hyena's way); ring: a rosette (a dark ring with a darker gold inside)"""
        gi = np.floor(P / cell); h = (gi[..., 0] * 73856093 + gi[..., 1] * 19349663 + gi[..., 2] * 83492791) % 1000003
        jit = np.stack([(h % 97) / 97.0, (h % 89) / 89.0, (h % 83) / 83.0], -1)
        d = np.linalg.norm(P - (gi + 0.25 + 0.5 * jit) * cell, axis=-1)
        if ring is None:
            put(where & (d < r) & (h % 7 != 0), col)
        else:
            put(where & (d < r) & (d > r * 0.55) & (h % 9 != 0), col); put(where & (d <= r * 0.55) & (h % 9 != 0), ring)

    if name == 'american_cheetah':
        SAND, BACK, CREAM = C(0.72, 0.58, 0.40), C(0.60, 0.46, 0.30), C(0.88, 0.83, 0.72)
        put(covered, SAND)
        out[:] = out * (1 - back[..., None] * 0.55) + BACK * back[..., None] * 0.55
        put(belly > 0.3, CREAM); put(isp('muzzle') & (N[..., 2] < 0.2), CREAM); put(isp('neck', 'head') & (N[..., 2] < -0.5), CREAM)
        # faint dark flecks on the flanks and legs (a runner's coat; the real coat is not known from bone, kept faint)
        spots(0.06, 0.012, BACK * 0.75, covered & (up < 0.5) & (belly < 0.2) & ~head)
        md = np.linalg.norm(P - (b.marks['mstart'] - b.marks['upv'] * 0.01), axis=-1)
        put(isp('muzzle', 'head') & (md < 0.028) & (np.abs(x) > 0.016), C(0.16, 0.12, 0.10))   # the dark marks by the nose
        put(isp('ear') & (N[..., 1] > 0.0), C(0.18, 0.14, 0.11))
        put(isp('tail', 'tuft') & (tail_t > 0.85), C(0.12, 0.10, 0.09))
        put(isp('tuft'), C(0.12, 0.10, 0.09))
        put(isp('muzzle') & (nose_d < 0.022), C(0.30, 0.20, 0.17))
        put(eye_d < a['eyes'], C(0.10, 0.09, 0.07))
        put(isp('paw') & (z < 0.025), C(0.52, 0.40, 0.28))
        patch_at(np.array([0.11, -0.36, 0.64]), ('shoulder', 'chest'), 0.06, 0.055)
    elif name == 'harringtons_goat':
        CREAM, SHADE, HORN = C(0.84, 0.80, 0.70), C(0.70, 0.66, 0.57), C(0.10, 0.09, 0.08)
        put(covered, CREAM)
        out[:] = out * (1 - (1 - np.clip(up + 0.6, 0, 1))[..., None] * 0.25) + SHADE * (1 - np.clip(up + 0.6, 0, 1))[..., None] * 0.25
        out[:] = out * (1 + (lat[q[..., 0], q[..., 1], q[..., 2]][..., None] > 0.86) * -0.12)   # the shag's dark partings
        put(isp('horn', 'hoof'), HORN)
        put(isp('muzzle') & (nose_d < 0.03), C(0.12, 0.11, 0.10))
        put(eye_d < a['eyes'], C(0.06, 0.05, 0.05))
        put(isp('beard'), C(0.90, 0.87, 0.78))
        put(legs & (z < 0.10), C(0.62, 0.58, 0.50))
        patch_at(np.array([0.13, -0.24, 0.62]), ('shoulder', 'chest', 'barrel'), 0.07, 0.06)
    elif name == 'stilt_legged_horse':
        DUN, DARK, PALE = C(0.58, 0.53, 0.46), C(0.20, 0.17, 0.15), C(0.84, 0.81, 0.74)
        put(covered, DUN)
        put(belly > 0.4, PALE)
        put(isp('muzzle') & (nose_d < 0.13), PALE)
        put(eye_d < a['eyes'] * 1.9, C(0.78, 0.75, 0.68)); put(eye_d < a['eyes'], C(0.05, 0.04, 0.04))   # the pale ring round the eye
        put(isp('mane', 'tuft'), DARK)
        put(isp('ear') & (N[..., 1] > 0.2), DARK); put(isp('ear') & (b.marks[('ear', 1)][2] - z < 0.03), DARK)
        put(covered & (up > 0.8) & ~isp('head', 'muzzle', 'ear'), C(0.26, 0.22, 0.19))   # the dark stripe down the back
        # the cross over the withers (the donkey's): a dark band down each shoulder from the stripe
        sh = isp('shoulder', 'chest') & (np.abs(y - (-bl / 2 + 0.16 * bl)) < 0.035) & (z > wh - 0.34)
        put(sh, C(0.26, 0.22, 0.19))
        put(legs & (z < 0.30) & (z > 0.20), C(0.40, 0.36, 0.32))   # the faint leg bars
        put(isp('hoof'), C(0.12, 0.10, 0.09))
    elif name == 'long_horned_bison':
        BROWN, FRONT = C(0.36, 0.24, 0.14), C(0.22, 0.15, 0.09)
        put(covered, BROWN)
        put(isp('crest', 'neck', 'head', 'dewlap', 'shoulder', 'chest') | (legs & (y < 0) & (z > 0.55)), FRONT)
        put(isp('muzzle'), C(0.14, 0.11, 0.09)); put(isp('tuft'), FRONT)
        put(legs & (z < 0.50), C(0.24, 0.16, 0.11)); put(isp('hoof'), C(0.10, 0.09, 0.08))
        hrn = isp('horn')
        if hrn.any():
            ht = np.zeros(z.shape, np.float32)
            for side in (-1, 1):
                cv = b.marks[('horn', side)]; d0, t0 = OB.seg_dist(P, cv[0], cv[-1]); ht = np.where(d0 < 0.14, t0, ht)
            out[hrn] = (C(0.40, 0.36, 0.31) * (1 - ht[hrn, None]) + C(0.12, 0.10, 0.09) * ht[hrn, None])
        put(eye_d < a['eyes'], C(0.05, 0.04, 0.04))
        patch_at(np.array([0.40, bl / 2 - 0.40, hh - 0.40]), ('rump', 'thigh', 'barrel'), 0.12, 0.10)
    elif name == 'pleistocene_jaguar':
        GOLD, DEEP, CREAM, ROS = C(0.74, 0.54, 0.28), C(0.62, 0.42, 0.21), C(0.88, 0.83, 0.72), C(0.09, 0.07, 0.06)
        put(covered, GOLD)
        out[:] = out * (1 - back[..., None] * 0.35) + DEEP * back[..., None] * 0.35
        put(belly > 0.35, CREAM); put(isp('muzzle') & (N[..., 2] < 0.2), CREAM); put(isp('neck', 'head') & (N[..., 2] < -0.5), CREAM)
        body = covered & ~isp('muzzle', 'ear', 'tag', 'collarbox')
        spots(0.075, 0.03, ROS, body & (belly < 0.5) & ~isp('head', 'leg', 'paw', 'tail'), ring=DEEP * 0.9)    # the rosettes
        spots(0.045, 0.012, ROS, body & isp('head', 'leg', 'paw', 'tail') & (belly < 0.6))                   # solid spots
        put(isp('tail') & (tail_t > 0.88), ROS)
        put(isp('ear') & (N[..., 1] > 0.0), C(0.12, 0.10, 0.08))
        put(isp('muzzle') & (nose_d < 0.03), C(0.32, 0.20, 0.17))
        put(eye_d < a['eyes'], C(0.12, 0.10, 0.06))
        if 'collar' in b.marks:
            put(isp('neck') & (np.abs(y - b.marks['collar'][1]) < 0.035), C(0.16, 0.18, 0.16))
            put(isp('collarbox'), C(0.16, 0.18, 0.16)); put(isp('collarbox') & (N[..., 2] < -0.6), C(0.88, 0.40, 0.10))
    elif name == 'large_headed_llama':
        BROWN, WHITE, FACE = C(0.62, 0.42, 0.25), C(0.86, 0.82, 0.74), C(0.34, 0.30, 0.27)
        put(covered, BROWN)
        put(belly > 0.25, WHITE)
        put(isp('leg', 'pad') & (y > 0) & (N[..., 1] > 0.3), WHITE * 0.95)          # the pale backs of the hind legs
        put(isp('neck') & (N[..., 1] < -0.6) & (z < 1.6), WHITE * 0.96)              # the pale throat
        put(isp('head', 'muzzle'), FACE); put(isp('ear'), FACE)
        put(isp('muzzle') & (nose_d < 0.04), C(0.12, 0.10, 0.09))
        put(eye_d < a['eyes'], C(0.05, 0.04, 0.04))
        put(isp('pad'), C(0.28, 0.24, 0.20))
        nk = a['neck']; mid = np.array([0.0, (nk[0][0] + nk[1][0]) / 2, (nk[0][1] + nk[1][1]) / 2])
        patch_at(mid, ('neck',), 0.07, 0.09)
    elif name == 'shrub_ox':
        BROWN, DARK, PALE = C(0.30, 0.21, 0.14), C(0.17, 0.12, 0.08), C(0.60, 0.52, 0.42)
        put(covered, BROWN)
        out[:] = out * (1 - back[..., None] * 0.35) + DARK * back[..., None] * 0.35
        put(isp('crest'), DARK)
        put(legs & (z < 0.45), PALE); put(isp('hoof'), C(0.10, 0.09, 0.08))
        put(isp('muzzle') & (nose_d < 0.09), C(0.50, 0.44, 0.38))
        hrn = isp('horn')
        if hrn.any():
            ht = np.zeros(z.shape, np.float32)
            for side in (-1, 1):
                cv = b.marks[('horn', side)]; d0, t0 = OB.seg_dist(P, cv[0], cv[-1]); ht = np.where(d0 < 0.10, t0, ht)
            out[hrn] = (C(0.62, 0.56, 0.46) * (1 - ht[hrn, None]) + C(0.16, 0.14, 0.12) * ht[hrn, None])
        put(eye_d < a['eyes'], C(0.05, 0.04, 0.04))
        patch_at(np.array([0.30, bl / 2 - 0.30, hh - 0.28]), ('rump', 'thigh', 'barrel'), 0.09, 0.08)
    if a.get('labmark') and 'labplate' in pix:
        k = b.marks['labk']; cy = b.marks['collar'][1]
        put(isp('neck') & (np.abs(y - cy) < 0.035 * k), C(0.13, 0.14, 0.13))         # the collar's band
        pl = isp('labplate'); put(pl, C(0.80, 0.98, 0.16))                              # the hi-vis plate
        put(pl & (np.abs(x) < 0.008 * k), C(0.10, 0.10, 0.08))                          # its number, a dark bar down the middle
        griz = np.where(pl, 1.0, griz); drift = np.where(pl, 1.0, drift)
    out = out * (griz * drift)[..., None]
    out = np.where(covered[..., None], np.clip(out, 0, 1), 0)
    filled = covered.copy()
    for _ in range(8):
        acc = np.zeros_like(out); cnt = np.zeros(filled.shape, np.float32)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
            sh = np.roll(np.roll(out, dy, 0), dx, 1); sf = np.roll(np.roll(filled, dy, 0), dx, 1)
            acc += sh * sf[..., None]; cnt += sf
        new = (~filled) & (cnt > 0)
        out[new] = acc[new] / cnt[new, None]; filled |= new
    return out


OB.build_body = build_body
OB.paint = paint


def strip(names):
    """the reference check: per animal its eight facings' stills, then its walk, bite, blow and fall facing SE, at the fight's pixels,
    the 1.72 m man's height marked; then one card of the seven, each beside the roster animal it must not copy, at the fight's size and
    again at the map's fifth"""
    from PIL import Image, ImageDraw
    os.makedirs(os.path.join(ROOT, STRIPS), exist_ok=True)
    index = json.load(open(os.path.join(ROOT, 'slices/fight_rig/fight_rig.json')))
    dirs = index['dirs']; se = dirs.index('SE')

    def cell(L, s, row, col):
        return s.crop((col * L['w'], row * L['h'], (col + 1) * L['w'], (row + 1) * L['h']))
    pairs = []
    for name in names:
        L = index['looks'].get('beast_' + name)
        if not L: print('NOT PACKED', name); continue
        s = Image.open(os.path.join(ROOT, 'slices/fight_rig', L['file'])).convert('RGBA')
        frames = [cell(L, s, r, 0) for r in range(len(dirs))] + [cell(L, s, se, c) for c in range(1, 18)]
        img = Image.new('RGBA', (L['w'] * len(frames), L['h']), (24, 22, 20, 255))
        for i, f in enumerate(frames): img.alpha_composite(f, (i * L['w'], 0))
        dr = ImageDraw.Draw(img); fx, fy = L['foot']; dr.line([(1, fy), (1, fy - 98)], fill=(200, 60, 50, 255), width=2)
        img.save(os.path.join(ROOT, STRIPS, name + '_strip.png'))
        sib = index['looks'].get('beast_' + SIBLING[name])
        ss = Image.open(os.path.join(ROOT, 'slices/fight_rig', sib['file'])).convert('RGBA') if sib else None
        pairs.append((name, cell(L, s, se, 0), cell(L, s, se, 9), cell(sib, ss, se, 0) if sib else None))
    # the card: rows of [the man's ruler | the sibling | the new one standing | the new one striking | the same at the map's fifth]
    gap = 10
    rowh = max(max(p[1].height, p[3].height if p[3] else 0) for p in pairs) + 2 * gap
    colw = max(max(p[1].width, p[2].width, p[3].width if p[3] else 0) for p in pairs)
    W = 30 + colw * 3 + gap * 5 + colw // 5 * 2 + gap
    card = Image.new('RGBA', (W, rowh * len(pairs)), (24, 22, 20, 255)); dr = ImageDraw.Draw(card)
    for i, (name, stand, strike, sib) in enumerate(pairs):
        y0 = i * rowh; base = y0 + rowh - gap
        dr.line([(14, base), (14, base - 98)], fill=(200, 60, 50, 255), width=3)
        x = 30
        for im in (sib, stand, strike):
            if im is not None: card.alpha_composite(im, (x, base - im.height))
            x += colw + gap
        for im in (sib, stand):
            if im is None: x += colw // 5 + gap; continue
            sm = im.resize((max(1, im.width // 5), max(1, im.height // 5)), Image.BILINEAR)
            card.alpha_composite(sm, (x, base - sm.height)); x += colw // 5 + gap
    card = card.resize((card.width * 2, card.height * 2), Image.NEAREST)
    card.save(os.path.join(ROOT, STRIPS, 'the_lab_seven_beside_their_kin.png'))
    print('STRIPS', STRIPS, [p[0] for p in pairs])


if __name__ == '__main__':
    cmd = sys.argv[1]; arg = sys.argv[2] if len(sys.argv) > 2 else 'ALL'
    names = list(SEVEN) if arg == 'ALL' else arg.split(',')
    if cmd == 'model':
        for n in names: OB.model(n)
    elif cmd in ('pose', 'render'):
        M = OB.fmb()
        for n in names: getattr(M, cmd)(n)
    elif cmd == 'pack':
        M = OB.fmb(); M.BEASTS = {n: M.BEASTS[n] for n in names}; M.pack()
        idx = os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'); I = json.load(open(idx))
        for n in names:
            if 'beast_' + n in I['looks']:
                I['looks']['beast_' + n]['by'] = 'BESTIARY [the lab seven] 11/9 (rule 440(f)), tools/bohemia_bestiary_the_lab_seven.py'
        json.dump(I, open(idx, 'w'), indent=1)
    elif cmd == 'strip':
        strip(names)
    else:
        sys.exit('model | pose | render | pack | strip')
