#!/usr/bin/env python3
"""BOHEMIA -- BEASTS 2 [every beast its own body] (rule 345, Paolo 11/2 in the VOTE tab, on THE FERAL BULL: 'They look wayyy to
similar to the og coyote the wolf actually to this needs way more work'; on the camel, the lion, the hogs and the coyotes: 'Work in
progress keep going'). Ask line 354. Rule 337: the asset, through the rig.

WHY THEY ALL LOOKED THE SAME (measured 11/3): every beast was the Khronos Fox's own mesh, stretched (the hyena tool's reshape). A
stretched fox keeps the fox's ribcage, the fox's head, the fox's ears and the fox's legs: the bull was a fox with horns. So this
tool keeps ONLY the Fox's SKELETON AND ITS MOVES (the bones and the Walk, every bone moved, never turned, so every clip still
plays) and builds each animal a NEW BODY from its own real measurements in metres:

  * THE BODY is grown from its anatomy: an implicit surface (Blender metaballs) of ellipsoids for the chest, the barrel, the rump,
    the shoulders and the thighs, capsules for every leg bone at its own thickness, the neck as its own curve, the head as cranium
    plus muzzle, the ears, the tail, and each animal's own parts (the bull's neck crest, dewlap and horns; the camel's hump and its
    U-shaped neck; the hog's wedge head, snout disc, bristle crest and tusks; the lion's shoulder blades and long J tail; the
    coyote's big ears and low brush; the dire wolf's broad skull and ruff; the dog's one flopped ear and its tail up). Nothing is
    drawn in code (rule 108 (a)): it is a 3D model, lit and rendered by DIRECTION's master rig like every other look.
  * THE BONES are moved to that animal's own joints (shoulder, elbow, knee, hip, stifle, hock, the neck's base, the poll, the tail),
    never turned, and the skin is weighted by which part of the body it grew from (each element's own field at the vertex), so the
    joints bend where that animal's joints are.
  * HOW IT MOVES: the Fox's walk with each leg re-phased to the animal's own gait (the camel PACES, both legs on one side together;
    the coyote, the bull and the hog TROT, the diagonals together; the lion and the wolf walk), the bull's heavier bob, and each one's
    own attack in the bite's slot (the bull's lowered-head gore and hook, the lion's spring and pin, the hog's tusk slash, the camel's
    kick back and out, the canines' bite).
  * THE COAT is painted on the body from its 3D shape (each texel traced to its point through the UVs): the animal's own colour
    fields, and analog horror at the source, never a filter, never radiation, never gore: the bull's and the hog's farm ear tags,
    the camel's shaved neck patch with its stitches (the lab's blood draw) and its lab tag, the lion's research GPS collar, the
    coyote's mange, the dire wolf's lab tag on a white coat (the first lab dire wolves, Colossal 2025, were born white), the
    feral dog's old collar.

    <venv bpy 4.2>/bin/python tools/bohemia_beasts_every_beast_its_own_body.py model feral_bull   -> reference/models/bohemia/<x>.glb
    then tools/bohemia_factions_five_more_beasts.py's own pose / render / pack / strip steps (this tool calls them: pose, render,
    pack, strip, card), so the fight's sheets and the index are written exactly as before.

REFERENCE CHECK (the 9/4 standing duty): every beast is set beside the 1.72 m man (98 px) at the fight's pixels on the VOTE card,
and its measured shoulder height and length are printed beside the real animal's (audit). No reference game.
"""
import json, math, os, sys, importlib.util

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOX = os.path.join(ROOT, 'reference/models/khronos/Fox.glb')
MODELS = 'reference/models/bohemia/own_body'
T_MB = 0.6                    # the metaball threshold
FOX_BODY = 65.0               # the Fox's own body (point of shoulder to point of buttock) in its units: every animal is built at it


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, os.path.join(ROOT, path))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m


# ---------------------------------------------------------------------------------------------------------------------------
# THE ANIMALS, in metres (nose toward -Y, up +Z, the animal's left +X, the ground z 0). Sources in the record:
# records/BOHEMIA_BEASTS_EVERY_BEAST_ITS_OWN_BODY_11_3_26.md
#   wh withers height, hh the top of the rump, bl point of shoulder to point of buttock, cd chest depth (withers to brisket),
#   sw/bw/hw half widths at the shoulders, the barrel and the hips, belly the belly's drop below the brisket line (- tucked up),
#   carpus/hock the knee and hock heights as a share of wh/hh, footh the fetlock, legf/legh the leg radii top to bottom,
#   neck a list of (y, z, half-depth, half-width) from its base to the poll, head (length, half-height, half-width, degrees below
#   level, muzzle share, muzzle radius), ears, tail (length, radii, the angle of each piece below level), gait, the extras.
# ---------------------------------------------------------------------------------------------------------------------------
BEASTS = {
    # FERAL BULL (Bos taurus, range cattle loose on Gold Butte; a Hereford-line bull 800 to 1,000 kg, 1.45 to 1.55 m at the
    # withers, a body 1.8 m from the point of the shoulder to the pin bones, the chest 0.8 m deep, the back level, the head carried
    # low and the face near upright, a bull's crest of neck muscle, a dewlap, short thick legs on cloven hooves, a thin tail that
    # hangs to the hocks and ends in a switch). Red-brown, the Hereford's white face, crest, belly, lower legs and switch.
    'feral_bull': dict(
        wh=1.48, hh=1.46, bl=1.80, cd=0.80, sw=0.34, bw=0.40, hw=0.31, belly=0.06, carpus=0.31, hock=0.36, footh=0.11,
        legf=(0.12, 0.085, 0.055, 0.068), legh=(0.10, 0.085, 0.056, 0.068), foot='hoof',
        neck=[(-0.80, 1.22, 0.36, 0.25), (-1.00, 1.22, 0.30, 0.21), (-1.16, 1.24, 0.24, 0.18)],
        head=(0.54, 0.15, 0.13, 58, 0.42, 0.115), ears=(0.20, 0.07, 0.025, 92, -8), eyes=0.03,
        tail=(0.95, (0.05, 0.03, 0.022), (78, 88, 90)), tuft=(0.20, 0.055),
        horns=dict(out=0.30, fwd=0.14, up=0.22, r=0.07, n=10),
        crest=((0, -0.62, 1.42), (0.22, 0.34, 0.15)), dewlap=((0, -0.86, 0.80), (0.07, 0.30, 0.22)),
        res=0.017, gait='trot', griz=0.035, attack='gore', farmtag=0.06, real_note='1.48 m at the withers, 1.8 m body, about 2.9 m nose to switch'),
    # CAMELOPS (Camelops hesternus, 'yesterday's camel', Tule Springs bone; about a fifth bigger than a dromedary: 2.1 to 2.3 m at
    # the shoulder, long thin legs with the knees high, a short body, the neck carried forward and DOWN then UP in a U, a long
    # heavy face held near level, small round ears, one hump (the dromedary surrogate's), the thighs joined to the body high,
    # a short tufted tail, broad soft foot pads; the Ice Age camel's hump is not known from bone, the surrogate's is the honest one).
    'camelops': dict(
        wh=1.98, hh=1.94, bl=1.55, cd=0.78, sw=0.24, bw=0.32, hw=0.23, belly=0.04, carpus=0.42, hock=0.37, footh=0.12, no_ridge=True,
        legf=(0.10, 0.068, 0.045, 0.085), legh=(0.10, 0.065, 0.046, 0.085), foot='pad', stifle_high=True,
        neck=[(-0.70, 1.82, 0.22, 0.15), (-1.02, 1.62, 0.15, 0.11), (-1.32, 1.86, 0.12, 0.10), (-1.42, 2.42, 0.11, 0.09)],
        head=(0.60, 0.11, 0.095, 18, 0.55, 0.075), ears=(0.10, 0.055, 0.02, 30, 60), eyes=0.025,
        tail=(0.48, (0.035, 0.024, 0.02), (70, 82, 88)), tuft=(0.14, 0.04),
        hump=((0, 0.0, 2.02), (0.22, 0.42, 0.30)),
        griz=0.03, res=0.017, gait='pace', bob=1.0, attack='kick', labmark=True, real_note='2.1 m at the shoulder, the hump to 2.35 m, the head to 2.6 m'),
    # MOUNTAIN LION (Puma concolor; a male 55 to 70 kg, 0.65 to 0.75 m at the shoulder, the head and body 1.5 m, the tail 0.75 m
    # and thick to the end; the hind legs the longer so the hips stand over the shoulders; a long low body, a small round head
    # with short round ears, big round paws; built at the stalk: the shoulders low, the blades up, the head below the back).
    'mountain_lion': dict(
        wh=0.62, hh=0.72, bl=1.10, cd=0.36, sw=0.14, bw=0.18, hw=0.14, belly=0.02, carpus=0.12, hock=0.31, footh=0.07,
        legf=(0.088, 0.07, 0.05, 0.07), legh=(0.098, 0.062, 0.046, 0.064), foot='paw', blades=True,
        neck=[(-0.48, 0.52, 0.13, 0.12), (-0.62, 0.55, 0.11, 0.10)],
        head=(0.25, 0.105, 0.105, 4, 0.26, 0.06), ears=(0.065, 0.045, 0.012, 40, 70), eyes=0.018,
        tail=(0.80, (0.052, 0.048, 0.046, 0.042), (58, 84, 60, -20)),
        collar=0.45, griz=0.02, res=0.009, gait='walk', bob=1.0, attack='pounce', real_note='0.62 m at the shoulder stalking, 0.72 m at the hip, 2.2 m nose to tail tip'),
    # FERAL HOG (Sus scrofa, the farm pig gone wild; a boar 90 to 150 kg, 0.8 to 0.9 m at the shoulder, 1.5 to 1.7 m of head and
    # body: a wedge, the shoulders high and massive with no neck to see, the rump lower, the body narrow side to side, a bristle
    # crest down the spine, a long wedge head carried low (rooting) ending in the flat snout disc, small upright ears, tusks up out
    # of the lips, short thin legs on small hooves, a thin straight tail with a tassel).
    'feral_hog': dict(
        wh=0.84, hh=0.72, bl=1.10, cd=0.50, sw=0.19, bw=0.19, hw=0.15, belly=0.0, carpus=0.27, hock=0.34, footh=0.06,
        legf=(0.075, 0.048, 0.032, 0.036), legh=(0.07, 0.048, 0.032, 0.036), foot='hoof', shoulder_mass=1.25,
        neck=[(-0.50, 0.66, 0.24, 0.18), (-0.62, 0.56, 0.20, 0.15)],
        head=(0.44, 0.13, 0.10, 42, 0.52, 0.055), ears=(0.11, 0.05, 0.016, 25, 70), eyes=0.016,
        tail=(0.26, (0.025, 0.016, 0.012), (45, 70, 85)), tuft=(0.06, 0.02),
        crest=((0, -0.22, 0.82), (0.075, 0.36, 0.06)), snout=True, tusks=dict(len=0.09, r=0.016),
        res=0.009, gait='trot', bob=1.2, attack='slash', farmtag=0.07, tagboth=True, real_note='0.84 m at the shoulder, 0.72 m at the rump, 1.6 m snout to tail root'),
    # COYOTE (Canis latrans; the valley's own, 10 to 15 kg in the desert, 0.58 m at the shoulder, 1.0 to 1.3 m with the tail; lanky:
    # long thin legs, a narrow deep chest, a tucked waist, a NARROW pointed muzzle, BIG upright pointed ears, a bushy tail carried
    # LOW, hanging down behind the legs, never up like a dog's).
    'coyote': dict(
        wh=0.58, hh=0.57, bl=0.66, cd=0.27, sw=0.075, bw=0.085, hw=0.07, belly=-0.07, carpus=0.13, hock=0.27, footh=0.04,
        legf=(0.042, 0.026, 0.018, 0.024), legh=(0.05, 0.03, 0.019, 0.024), foot='paw',
        neck=[(-0.30, 0.50, 0.075, 0.06), (-0.42, 0.58, 0.06, 0.05)],
        head=(0.21, 0.052, 0.05, 12, 0.52, 0.022), ears=(0.10, 0.04, 0.009, 18, 78), eyes=0.012,
        tail=(0.36, (0.032, 0.046, 0.042, 0.02), (62, 76, 82, 86)),
        mange=True, res=0.0065, gait='trot', bob=1.0, attack='bite', real_note='0.58 m at the shoulder, about 1.15 m nose to tail tip'),
    # DIRE WOLF (Aenocyon dirus from Rancho La Brea bone, made on a grey wolf as the 2025 lab pups were: 0.8 m at the shoulder,
    # 60 to 68 kg, heavier than a grey wolf and the legs a little shorter for the body, thick-boned, a BROAD skull and a short
    # deep muzzle, a heavy neck ruff, big paws, a straight bushy tail; the lab pups were born white).
    'dire_wolf': dict(
        wh=0.80, hh=0.78, bl=1.02, cd=0.40, sw=0.14, bw=0.16, hw=0.125, belly=-0.05, carpus=0.13, hock=0.27, footh=0.05,
        legf=(0.07, 0.048, 0.034, 0.05), legh=(0.08, 0.05, 0.034, 0.05), foot='paw', ruff=1.0,
        neck=[(-0.44, 0.66, 0.14, 0.13), (-0.60, 0.74, 0.11, 0.105)],
        head=(0.30, 0.085, 0.095, 14, 0.42, 0.045), ears=(0.09, 0.05, 0.012, 22, 75), eyes=0.016,
        tail=(0.48, (0.05, 0.06, 0.05, 0.025), (66, 80, 86, 88)),
        res=0.009, gait='walk', bob=1.0, attack='bite', labmark=True, real_note='0.80 m at the shoulder, about 1.75 m nose to tail tip'),
    # FERAL DOG (the shepherd's slot, a mixed breed: a shepherd crossed with a pit, 28 to 34 kg, 0.58 m at the shoulder; a blocky
    # broad head on a short muzzle, a thick neck, a deep chest, ONE ear up and one flopped (a mutt's tell), the tail carried UP in a
    # sickle the way a dog's is, black and tan with a white blaze, and the collar it wore when it had a home).
    'feral_dog_shepherd': dict(
        wh=0.58, hh=0.56, bl=0.70, cd=0.30, sw=0.105, bw=0.125, hw=0.10, belly=-0.06, carpus=0.13, hock=0.27, footh=0.04,
        legf=(0.055, 0.034, 0.025, 0.035), legh=(0.06, 0.036, 0.025, 0.035), foot='paw',
        neck=[(-0.32, 0.50, 0.085, 0.075), (-0.43, 0.62, 0.07, 0.065)],
        head=(0.22, 0.065, 0.07, 8, 0.40, 0.038), ears=(0.09, 0.045, 0.01, 22, 75), flop='L', eyes=0.013,
        tail=(0.34, (0.03, 0.026, 0.018), (-25, -50, -80)),
        dogcollar=0.5, griz=0.03, res=0.0065, gait='walk', bob=1.0, attack='bite', real_note='0.58 m at the shoulder, about 1.25 m nose to tail tip'),
    # CAVE HYENA (Crocuta crocuta spelaea, the Ice Age's own: its genome read from bone (Westbury et al. 2020), made on the
    # spotted hyena; bigger than today's, about 0.9 m at the shoulder and 90 to 100 kg; THE SLOPE: long front legs and the back
    # falling to a low narrow rump, a massive neck and shoulders under a mane, a big broad head on a blunt bone-crusher's muzzle,
    # ROUND ears, a short tail with a black brush, a sand coat with round dark spots; rule 345 (c), Paolo 11/3: 'everything's
    # looking like a fucking coyote'). The coat keeps the hyena's own colours (records/BOHEMIA_THE_CAVE_HYENA_HELD_10_18_26.md).
    'cave_hyena': dict(
        wh=0.90, hh=0.70, bl=1.05, cd=0.46, sw=0.155, bw=0.16, hw=0.115, belly=-0.02, carpus=0.14, hock=0.30, footh=0.05,
        legf=(0.08, 0.056, 0.037, 0.05), legh=(0.07, 0.045, 0.032, 0.045), foot='paw', shoulder_mass=1.2, ruff=1.0,
        neck=[(-0.42, 0.80, 0.17, 0.14), (-0.60, 0.80, 0.14, 0.125)],
        head=(0.28, 0.11, 0.115, 15, 0.34, 0.066), ears=(0.075, 0.075, 0.012, 32, 62), eyes=0.016,
        tail=(0.30, (0.035, 0.03, 0.026), (55, 78, 88)), tuft=(0.12, 0.05),
        crest=((0, -0.30, 0.885), (0.065, 0.36, 0.04)), bigtag=True,
        griz=0.03, res=0.0085, gait='walk', attack='bite', labmark=True, real_note='0.90 m at the shoulder, 0.70 m at the rump, about 1.5 m nose to tail tip'),
    # SHORT-FACED BEAR (Arctodus simus, the Ice Age's giant bear; its mitochondrial genome read from bone (Mitchell et al. 2016);
    # 1.5 to 1.8 m at the shoulder on all fours, 600 to 900 kg, LONG legs for a bear, a SHORT broad face, small round ears, the
    # shoulder hump, big plantigrade paws, no tail to speak of; rule 345 amended (a): 'the lab beasts look like lab beasts').
    # The lab mark: a thick lab collar with its box and a numbered ear tag.
    'short_faced_bear': dict(
        wh=1.55, hh=1.30, bl=1.70, cd=0.66, sw=0.31, bw=0.34, hw=0.26, belly=-0.02, carpus=0.16, hock=0.20, footh=0.09,
        legf=(0.15, 0.115, 0.095, 0.125), legh=(0.145, 0.11, 0.09, 0.125), foot='paw', shoulder_mass=1.15,
        neck=[(-0.66, 1.24, 0.30, 0.27), (-0.92, 1.08, 0.25, 0.23)],
        head=(0.47, 0.19, 0.21, 12, 0.27, 0.115), ears=(0.10, 0.10, 0.025, 42, 66), eyes=0.025,
        tail=(0.14, (0.06, 0.05, 0.04), (70, 80, 86)),
        crest=((0, -0.48, 1.50), (0.24, 0.40, 0.10)), bigtag=True, collar=0.55,
        griz=0.05, res=0.017, gait='pace', attack='maul', labmark=True, real_note='1.55 m at the shoulder on all fours, about 2.4 m nose to rump, 3.3 m standing up'),
    # SHASTA GROUND SLOTH (Nothrotheriops shastensis: Gypsum Cave, a few miles from the Strip, kept its dung, and its DNA was read
    # from it (Poinar et al. 1998); about 2.7 m with the tail and 250 to 350 kg; THE OUTLINE NOTHING ELSE HAS: the hips higher than
    # the shoulders, a wide pelvis, a thick tail to the ground, a small head on a longer neck carried low, long forelegs walking on
    # the knuckles with the great claws turned in, shaggy coarse hair; it rears up on its hind legs and tail to reach). Its living
    # kin are 4 to 8 kg tree sloths, so no mother could carry it: the lab's own womb did (named in the record).
    'ground_sloth': dict(
        wh=0.92, hh=1.24, bl=1.40, cd=0.60, sw=0.23, bw=0.30, hw=0.30, belly=0.06, carpus=0.12, hock=0.13, footh=0.06,
        legf=(0.12, 0.10, 0.08, 0.10), legh=(0.17, 0.13, 0.10, 0.12), foot='paw', claws=dict(len=0.24, r=0.03),
        neck=[(-0.58, 0.78, 0.18, 0.16), (-0.90, 0.72, 0.14, 0.13)],
        head=(0.37, 0.105, 0.095, 26, 0.45, 0.055), ears=(0.045, 0.045, 0.012, 40, 40), eyes=0.014,
        tail=(0.78, (0.17, 0.14, 0.10, 0.06), (52, 68, 80, 86)), bigtag=True,
        griz=0.12, res=0.015, gait='walk', attack='maul', labmark=True, real_note='1.0 m at the shoulder, 1.16 m at the hip, about 2.7 m with the tail, 3 m reared'),
    # SABRE-TOOTH (Smilodon fatalis; its genome read from Ice Age bone (Paijmans et al. 2017); made on the largest living cats): about
    # 1.0 m at the shoulder and 160 to 280 kg, built like nothing alive: massive forelegs and neck, the back falling to the hips, a BOB
    # TAIL, a big short-faced head with the two SABRES hanging past the chin; tawny with faint spots. Rule 345 amended (a).
    'sabre_tooth': dict(
        wh=1.00, hh=0.86, bl=1.20, cd=0.52, sw=0.20, bw=0.22, hw=0.17, belly=0.0, carpus=0.12, hock=0.28, footh=0.07,
        legf=(0.115, 0.09, 0.065, 0.085), legh=(0.10, 0.07, 0.05, 0.072), foot='paw', shoulder_mass=1.25, blades=True,
        neck=[(-0.52, 0.86, 0.17, 0.16), (-0.70, 0.88, 0.15, 0.145)],
        head=(0.34, 0.12, 0.13, 8, 0.30, 0.078), ears=(0.06, 0.06, 0.012, 40, 64), eyes=0.018,
        tail=(0.24, (0.06, 0.05, 0.045), (40, 60, 78)), sabres=dict(len=0.21, r=0.024), bigtag=True,
        griz=0.03, res=0.011, gait='walk', attack='pounce', labmark=True, real_note='1.0 m at the shoulder, about 1.9 m nose to bob tail'),
    # AMERICAN LION (Panthera atrox; its DNA read from Ice Age bone (Barnett et al. 2009, 2016); a quarter bigger than an African lion:
    # about 1.2 m at the shoulder, 2.5 m of body and a 1 m tail, 250 to 400 kg; long-legged, maneless (the cave paintings of its
    # cousin show no mane), a long tail with a dark tuft; sand-tawny).
    'american_lion': dict(
        wh=1.18, hh=1.20, bl=1.70, cd=0.58, sw=0.22, bw=0.25, hw=0.21, belly=0.02, carpus=0.12, hock=0.30, footh=0.08,
        legf=(0.12, 0.092, 0.066, 0.09), legh=(0.13, 0.085, 0.06, 0.085), foot='paw',
        neck=[(-0.72, 0.98, 0.20, 0.18), (-0.96, 1.06, 0.17, 0.16)],
        head=(0.42, 0.14, 0.14, 6, 0.34, 0.082), ears=(0.07, 0.07, 0.014, 40, 66), eyes=0.022,
        tail=(1.05, (0.05, 0.045, 0.042, 0.04), (55, 76, 70, 40)), tuft=(0.17, 0.06), collar=0.40, bigtag=True,
        griz=0.02, res=0.013, gait='walk', attack='pounce', labmark=True, real_note='1.2 m at the shoulder, about 3.5 m nose to tail tip'),
    # ANCIENT BISON (Bison antiquus, the valley's Ice Age bison: Tule Springs bone; DNA from the bones of its line read many times;
    # made on the plains bison): about 2.0 m at the hump, 1,000 to 1,600 kg, the HUGE shoulder hump, the head carried LOW and nearly
    # upright, a shaggy front and beard, wide horns curving up, the hindquarters slim, a short tufted tail; dark brown, the front darker.
    'ancient_bison': dict(
        wh=1.85, hh=1.50, bl=2.20, cd=1.00, sw=0.40, bw=0.44, hw=0.31, belly=0.0, carpus=0.24, hock=0.30, footh=0.12,
        legf=(0.16, 0.11, 0.075, 0.09), legh=(0.14, 0.10, 0.07, 0.09), foot='hoof', shoulder_mass=1.3, ruff=1.0,
        neck=[(-0.96, 1.40, 0.42, 0.34), (-1.26, 1.02, 0.34, 0.28)],
        head=(0.62, 0.22, 0.21, 72, 0.34, 0.13), ears=(0.12, 0.06, 0.02, 92, -10), eyes=0.03,
        tail=(0.55, (0.05, 0.035, 0.025), (80, 88, 90)), tuft=(0.16, 0.05),
        horns=dict(out=0.34, fwd=0.04, up=0.24, r=0.075, n=10),
        crest=((0, -0.58, 1.80), (0.34, 0.68, 0.24)), dewlap=((0, -1.40, 0.66), (0.10, 0.20, 0.20)), bigtag=True,
        griz=0.06, res=0.02, gait='walk', attack='gore', labmark=True, real_note='2.0 m at the hump, about 3.6 m nose to rump'),
    # ICE AGE HORSE (Equus, the valley's own: Tule Springs and Gypsum Cave horse bone; Ice Age horse genomes read many times (the
    # 700,000-year-old Yukon horse, Orlando et al. 2013); made on a horse): about 1.45 m at the withers, stocky like a Przewalski's
    # horse: an UPRIGHT dark mane, a long head, a long dark tail, dun with dark legs and a dark stripe down the back. Its mark is the
    # one real wild horses carry: a white freeze mark on the left of the neck.
    'ice_age_horse': dict(
        wh=1.42, hh=1.42, bl=1.45, cd=0.62, sw=0.22, bw=0.27, hw=0.24, belly=0.0, carpus=0.30, hock=0.38, footh=0.13,
        legf=(0.10, 0.075, 0.045, 0.06), legh=(0.11, 0.075, 0.045, 0.06), foot='hoof',
        neck=[(-0.62, 1.20, 0.28, 0.16), (-0.86, 1.42, 0.20, 0.12), (-0.99, 1.62, 0.15, 0.10)], mane=0.10,
        head=(0.58, 0.12, 0.10, 55, 0.50, 0.075), ears=(0.12, 0.05, 0.015, 15, 75), eyes=0.025,
        tail=(0.75, (0.06, 0.07, 0.06, 0.04), (70, 82, 86, 88)),
        griz=0.03, res=0.014, gait='walk', attack='kick', labmark=True, real_note='1.45 m at the withers, about 2.4 m nose to rump'),
}


# ---------------------------------------------------------------------------------------------------------------------------
# THE BODY: elements (each a metaball with a part and the bones its skin follows) and the joints
# ---------------------------------------------------------------------------------------------------------------------------
def k_of(s):
    """the visible radius of a lone element as a share of its field radius (Blender's field s(1-d^2/R^2)^3 at the threshold)"""
    return math.sqrt(1 - (T_MB / s) ** (1 / 3.0))


class Body:
    def __init__(self):
        self.els = []      # dict(kind, co, R, size, rot(3x3), s, part, bones{name: w}, neg)
        self.joints = {}
        self.extra = []    # (verts, faces, part, bones)
        self.marks = {}

    def ell(self, c, semi, part, bones, s=5.0, rot=None, neg=False):
        import numpy as np
        semi = np.array(semi, float); R = semi.max() / k_of(s)
        self.els.append(dict(kind='ELLIPSOID', co=np.array(c, float), R=R, size=semi / semi.max(), rot=np.eye(3) if rot is None else rot,
                             s=s, part=part, bones=bones, neg=neg, half=0.0))

    def cap(self, a, b, r, part, bones, s=5.0):
        import numpy as np
        a = np.array(a, float); b = np.array(b, float); d = b - a; L = float(np.linalg.norm(d))
        self.els.append(dict(kind='CAPSULE', co=(a + b) / 2, R=r / k_of(s), size=np.array([L / 2, 1, 1]), rot=frame_x(d), s=s,
                             part=part, bones=bones, neg=False, half=L / 2))

    def tube(self, pts, radii, part, bones, s=5.0, sub=2):
        """capsules along a polyline, each piece split in `sub` with its radius stepped toward the next (a taper)"""
        import numpy as np
        pts = [np.array(p, float) for p in pts]
        for i in range(len(pts) - 1):
            for j in range(sub):
                t0, t1 = j / sub, (j + 1) / sub
                r = radii[i] + (radii[i + 1] - radii[i]) * (t0 + t1) / 2
                bb = {bones[i]: 1.0} if isinstance(bones, list) else bones
                self.cap(pts[i] + (pts[i + 1] - pts[i]) * t0, pts[i] + (pts[i + 1] - pts[i]) * t1, r, part, bb, s)


def frame_x(d, up=(0, 0, 1)):
    """a rotation whose local X is along d"""
    import numpy as np
    x = np.array(d, float); x /= np.linalg.norm(x)
    u = np.array(up, float)
    if abs(np.dot(u, x)) > 0.95: u = np.array([0, 1.0, 0])
    y = np.cross(u, x); y /= np.linalg.norm(y); z = np.cross(x, y)
    return np.stack([x, y, z], 1)


def rot_about(axis, deg):
    import numpy as np
    a = np.array(axis, float); a /= np.linalg.norm(a); t = math.radians(deg)
    K = np.array([[0, -a[2], a[1]], [a[2], 0, -a[0]], [-a[1], a[0], 0]])
    return np.eye(3) + math.sin(t) * K + (1 - math.cos(t)) * K @ K


B = dict(hip='b_Hip_01', loin='b_Spine01_02', chest='b_Spine02_03', neck='b_Neck_04', head='b_Head_05',
         t1='b_Tail01_012', t2='b_Tail02_013', t3='b_Tail03_014')
LEGS = {  # side +1 = the animal's left (+X), as the Fox
    ('F', -1): ('b_RightUpperArm_06', 'b_RightForeArm_07', 'b_RightHand_08'),
    ('F', 1): ('b_LeftUpperArm_09', 'b_LeftForeArm_010', 'b_LeftHand_011'),
    ('H', 1): ('b_LeftLeg01_015', 'b_LeftLeg02_016', 'b_LeftFoot01_017', 'b_LeftFoot02_018'),
    ('H', -1): ('b_RightLeg01_019', 'b_RightLeg02_020', 'b_RightFoot01_021', 'b_RightFoot02_022'),
}


def build_body(name):
    """the animal's elements and joints from its numbers"""
    import numpy as np
    a = BEASTS[name]; b = Body(); J = b.joints
    wh, hh, bl, cd = a['wh'], a['hh'], a['bl'], a['cd']
    yF, yB = -bl / 2, bl / 2
    brisket = wh - cd
    top_mid = (wh + hh) / 2 - 0.02 * cd
    belly_z = brisket - a['belly']
    # the trunk: chest, barrel, rump (the back's line runs withers -> loin -> rump)
    b.ell((0, yF + 0.27 * bl, wh - cd / 2), (a['sw'] * 1.02, 0.29 * bl, cd / 2), 'chest', {B['chest']: 1.0})
    bar_top = top_mid; bar_bot = belly_z
    b.ell((0, yF + 0.56 * bl, (bar_top + bar_bot) / 2), (a['bw'], 0.30 * bl, (bar_top - bar_bot) / 2), 'barrel', {B['loin']: 0.8, B['chest']: 0.2})
    b.ell((0, yB - 0.17 * bl, hh - 0.31 * cd), (a['hw'], 0.19 * bl, 0.31 * cd), 'rump', {B['hip']: 1.0})
    # the withers' ridge (the dorsal spines over the shoulders) keeps the top line
    if not a.get('no_ridge'):
        b.ell((0, yF + 0.20 * bl, wh - 0.10 * cd), (a['sw'] * 0.55, 0.16 * bl, 0.10 * cd), 'chest', {B['chest']: 1.0})
    sm = a.get('shoulder_mass', 1.0)
    for side in (-1, 1):
        f = LEGS[('F', side)]; h = LEGS[('H', side)]
        x_s = side * a['sw'] * 0.70; x_h = side * a['hw'] * 0.72
        S = np.array([x_s, yF + 0.07 * bl, wh - 0.60 * cd])
        E = np.array([x_s * 0.95, yF + 0.15 * bl, brisket + 0.04 * cd])
        C = np.array([x_s * 0.9, yF + 0.13 * bl, a['carpus'] * wh])
        Ft = np.array([x_s * 0.9, yF + 0.11 * bl, a['footh']])
        G = np.array([x_s * 0.9, yF + 0.09 * bl, 0.0])
        H = np.array([x_h, yB - 0.19 * bl, hh - 0.42 * cd])
        if a.get('stifle_high'):
            K = np.array([x_h * 1.05, yB - 0.30 * bl, belly_z + 0.10 * cd])
        else:   # the stifle at about 0.58 of the hip's height (cattle, dogs, cats alike), forward and below the hip joint
            K = np.array([x_h * 1.05, yB - 0.29 * bl, a.get('stifle', 0.58) * hh])
        T = np.array([x_h * 0.9, yB - 0.07 * bl, a['hock'] * hh])
        Fh = np.array([x_h * 0.9, yB - 0.10 * bl, a['footh']])
        Gh = np.array([x_h * 0.9, yB - 0.11 * bl, 0.0])
        J[f[0]], J[f[1]], J[f[2]] = S, E, C
        J[h[0]], J[h[1]], J[h[2]], J[h[3]] = H, K, T, Fh
        b.marks[('foot', 'F', side)] = G; b.marks[('foot', 'H', side)] = Gh
        r0, r1, r2, r3 = a['legf']
        # the shoulder: the blade and its muscle over the upper arm (it rides the chest and the arm), the elbow, the forearm
        blade_top = np.array([x_s * 0.8, yF + 0.22 * bl, wh - (0.0 if a.get('blades') else 0.20) * cd])
        b.ell((S + blade_top) / 2, (a['sw'] * 0.42 * sm, 0.11 * bl * sm, 0.40 * cd * sm), 'shoulder', {B['chest']: 0.5, f[0]: 0.5}, s=4.0,
              rot=frame_x(blade_top - S, up=(0, -1, 0)) @ np.array([[0, 0, 1], [1, 0, 0], [0, 1, 0]]))
        b.cap(S, E, r0, 'leg', {f[0]: 1.0}); b.cap(E, E + (C - E) * 0.45, r1 * 1.08, 'leg', {f[1]: 1.0})
        b.cap(E + (C - E) * 0.45, C, r1 * 0.82, 'leg', {f[1]: 1.0})
        b.cap(C, Ft, r2, 'leg', {f[2]: 1.0}); b.cap(Ft, G + np.array([0, 0, r3 * 0.6]), r2 * 0.95, 'leg', {f[2]: 1.0})
        foot(b, a, G, side, f[2])
        # the hind: the thigh (the ham, behind and below the hip), the gaskin, the cannon, the foot
        thigh_c = (H + K) / 2 + np.array([0, 0.05 * bl, 0])
        b.ell(thigh_c, (a['hw'] * 0.48, 0.15 * bl, 0.34 * cd), 'thigh', {h[0]: 0.75, B['hip']: 0.25}, s=4.0)
        b.cap(H, K, r0 * 0.85 if 'legh' not in a else a['legh'][0], 'leg', {h[0]: 1.0})
        b.cap(K, K + (T - K) * 0.5, a['legh'][1] * 1.08, 'leg', {h[1]: 1.0}); b.cap(K + (T - K) * 0.5, T, a['legh'][1] * 0.8, 'leg', {h[1]: 1.0})
        b.cap(T, Fh, a['legh'][2], 'leg', {h[2]: 1.0}); b.cap(Fh, Gh + np.array([0, 0, a['legh'][3] * 0.6]), a['legh'][2] * 0.95, 'leg', {h[3]: 1.0})
        foot(b, a, Gh, side, h[3])
    # the spine's joints
    J[B['hip']] = np.array([0, yB - 0.19 * bl, hh - 0.36 * cd])
    J[B['loin']] = np.array([0, yF + 0.58 * bl, top_mid - 0.34 * cd])
    J[B['chest']] = np.array([0, yF + 0.30 * bl, wh - 0.40 * cd])
    # the neck: its own curve from the base to the poll
    nk = [np.array([0, y, z]) for y, z, _, _ in a['neck']]
    J[B['neck']] = nk[0].copy()
    for i in range(len(nk) - 1):
        for j in range(3):
            t = (j + 0.5) / 3
            p = nk[i] + (nk[i + 1] - nk[i]) * t
            hd = a['neck'][i][2] + (a['neck'][i + 1][2] - a['neck'][i][2]) * t
            hw_ = a['neck'][i][3] + (a['neck'][i + 1][3] - a['neck'][i][3]) * t
            seg = nk[i + 1] - nk[i]
            w_head = (i + t) / (len(nk) - 1)
            bones = {B['neck']: 1.0} if w_head < 0.75 else {B['neck']: 0.6, B['head']: 0.4}
            b.ell(p, (hw_, np.linalg.norm(seg) / 3 * 0.9 + min(hd, hw_) * 0.6, hd), 'neck', bones,
                  rot=frame_x(seg, up=(0, 0, 1)) @ np.array([[0, 1, 0], [1, 0, 0], [0, 0, 1]]), s=4.5)
    if a.get('mane'):
        for i in range(len(nk) - 1):
            seg = nk[i + 1] - nk[i]; up_ = np.array([0, seg[2], -seg[1]]); up_ = up_ if up_[2] > 0 else -up_; up_ /= np.linalg.norm(up_)
            for j in range(2):
                t = (j + 0.5) / 2; p = nk[i] + seg * t; hd = a['neck'][i][2] + (a['neck'][i + 1][2] - a['neck'][i][2]) * t
                b.ell(p + up_ * (hd * 0.85 + a['mane'] * 0.4), (0.03, np.linalg.norm(seg) / 2 * 0.7, a['mane']), 'mane', {B['neck']: 1.0},
                      rot=frame_x(seg, up=(0, 0, 1)) @ np.array([[0, 1, 0], [1, 0, 0], [0, 0, 1]]), s=5.0)
    if a.get('ruff'):
        b.ell(nk[0] + (nk[-1] - nk[0]) * 0.45 - np.array([0, 0, 0.02]), (a['neck'][0][3] * 1.3, 0.12 * bl, a['neck'][0][2] * 1.15), 'neck', {B['neck']: 1.0}, s=3.5)
    poll = nk[-1]
    J[B['head']] = poll.copy()
    # the head: the cranium behind, the muzzle ahead and down at the head's angle
    L, hh_, hw_, ang, mshare, mr = a['head']
    dirv = np.array([0, -math.cos(math.radians(ang)), -math.sin(math.radians(ang))])
    upv = np.array([0, -math.sin(math.radians(ang)), math.cos(math.radians(ang))])
    cran = poll + dirv * (L * (1 - mshare) * 0.5) - upv * hh_ * 0.15
    b.ell(cran, (hw_, L * (1 - mshare) * 0.62, hh_), 'head', {B['head']: 1.0}, rot=frame_x(dirv, up=(0, 0, 1)) @ np.array([[0, 1, 0], [1, 0, 0], [0, 0, 1]]))
    nose = poll + dirv * L - upv * hh_ * 0.35
    mstart = poll + dirv * (L * (1 - mshare)) - upv * hh_ * 0.25
    b.tube([mstart, nose], [max(mr * 1.35, hh_ * 0.75), mr], 'muzzle', {B['head']: 1.0}, sub=3)
    # the jaw and cheeks: the lower half of the head's back
    b.ell(cran - upv * hh_ * 0.45 + dirv * L * 0.08, (hw_ * 0.85, L * 0.22, hh_ * 0.55), 'head', {B['head']: 1.0},
          rot=frame_x(dirv, up=(0, 0, 1)) @ np.array([[0, 1, 0], [1, 0, 0], [0, 0, 1]]))
    b.marks['nose'] = nose; b.marks['poll'] = poll; b.marks['dirv'] = dirv; b.marks['upv'] = upv
    eye_y = poll + dirv * (L * (1 - mshare) * 0.92) + upv * hh_ * 0.25
    b.marks['eyes'] = [eye_y + np.array([s * hw_ * 0.86, 0, 0]) for s in (-1, 1)]
    b.marks['mstart'] = mstart
    # the ears
    el, ew, et, yaw, pitch = a['ears']
    for side in (-1, 1):
        base = poll + upv * hh_ * 0.7 + np.array([side * hw_ * 0.62, 0, 0]) - dirv * L * 0.02
        if a.get('horns'): base = poll + np.array([side * hw_ * 1.05, 0, 0]) - upv * hh_ * 0.15 + dirv * L * 0.05
        p = pitch; yw = yaw
        if a.get('flop') and ((a['flop'] == 'L') == (side > 0)): p = -55; yw = 70
        d = np.array([side * math.sin(math.radians(yw)) * math.cos(math.radians(p)), math.cos(math.radians(yw)) * math.cos(math.radians(p)) * 0.3,
                      math.sin(math.radians(p))])
        d /= np.linalg.norm(d)
        c = base + d * el * 0.5
        fx = frame_x(d, up=(0, -1, 0))   # local x along the ear, local z its flat face's normal-ish
        b.ell(c, (el * 0.5, ew * 0.5, et), 'ear', {B['head']: 1.0}, rot=fx, s=4.0)
        b.marks[('ear', side)] = base + d * el * 0.75
    # the tail
    tl, trs, angs = a['tail']
    t0 = np.array([0, yB - 0.01 * bl, hh - 0.06 * cd])
    pts = [t0]; n = len(angs)
    for an in angs:
        an_r = math.radians(an)
        pts.append(pts[-1] + np.array([0, math.cos(an_r), -math.sin(an_r)]) * tl / n)
    J[B['t1']] = pts[0]; J[B['t2']] = pts[min(1, n)]; J[B['t3']] = pts[min(2, n)]
    rads = list(trs) + [trs[-1]] * (len(pts) - len(trs))
    tb = [B['t1']] + [B['t2']] * max(0, (n - 1) // 2) + [B['t3']] * n
    b.tube(pts, rads[:len(pts)], 'tail', tb[:len(pts) - 1], s=4.5)
    b.marks['tail'] = pts
    if a.get('tuft'):
        tlen, tr = a['tuft']; d = pts[-1] - pts[-2]; d /= np.linalg.norm(d)
        b.ell(pts[-1] + d * tlen * 0.35, (tr, tr, tlen * 0.5), 'tuft', {B['t3']: 1.0}, rot=frame_x(d) @ np.array([[0, 0, 1], [0, 1, 0], [1, 0, 0]]), s=4.0)
    # the animal's own parts
    if a.get('crest'):
        c, sz = a['crest']; b.ell(c, sz, 'crest', {B['chest']: 0.6, B['neck']: 0.4} if name == 'feral_bull' else {B['chest']: 0.5, B['loin']: 0.5}, s=4.0)
    if a.get('dewlap'):
        c, sz = a['dewlap']; b.ell(c, sz, 'dewlap', {B['neck']: 0.6, B['chest']: 0.4}, s=4.0)
    if a.get('hump'):
        c, sz = a['hump']; b.ell(c, sz, 'hump', {B['chest']: 0.5, B['loin']: 0.5}, s=4.0)
    if a.get('snout'):
        b.ell(nose + dirv * 0.012, (mr * 1.15, 0.018, mr * 1.05), 'snout', {B['head']: 1.0}, rot=frame_x(dirv, up=(0, 0, 1)) @ np.array([[0, 1, 0], [1, 0, 0], [0, 0, 1]]), s=6.0)
    if a.get('horns'):
        horns(b, a, poll, dirv, upv)
    if a.get('tusks'):
        tusks(b, a, nose, dirv, upv)
    if a.get('claws'):
        claws(b, a)
    if a.get('sabres'):
        sabres(b, a, mstart, nose, dirv, upv)
    if a.get('collar'):
        tags(b, 'collar', poll, nk, a)
    if a.get('labmark'):
        labplate(b, a, nk)
    for side in ((-1, 1) if a.get('tagboth') else (1,)):
        if name in ('feral_bull', 'feral_hog', 'camelops', 'dire_wolf', 'cave_hyena', 'short_faced_bear', 'ground_sloth', 'sabre_tooth', 'american_lion', 'ancient_bison'):
            et_ = b.marks[('ear', side)]
            tg = a.get('farmtag') or (0.04 if a.get('bigtag') else (0.022 if wh > 1 else 0.014))
            b.ell(et_ - upv * 0.01 + (np.array([0, 0, tg * 0.6]) if a.get('farmtag') else 0), (tg, tg, 0.014 if not a.get('farmtag') else tg * 0.45), 'tag', {B['head']: 1.0}, s=6.0)
    if a.get('dogcollar'):
        p = nk[0] + (nk[-1] - nk[0]) * a['dogcollar']
        b.ell(p - np.array([0, 0, a['neck'][0][2] * 0.95]), (0.012, 0.012, 0.02), 'tag', {B['neck']: 1.0}, s=6.0)
    return b


def foot(b, a, G, side, bone):
    import numpy as np
    r = a['legf'][3]
    if a['foot'] == 'hoof':
        b.ell(G + np.array([0, -r * 0.25, r * 0.55]), (r * 0.85, r * 1.05, r * 0.6), 'hoof', {bone: 1.0}, s=6.0)
    elif a['foot'] == 'pad':
        b.ell(G + np.array([0, -r * 0.35, r * 0.35]), (r * 1.0, r * 1.25, r * 0.38), 'pad', {bone: 1.0}, s=6.0)
    else:
        b.ell(G + np.array([0, -r * 0.45, r * 0.45]), (r * 0.85, r * 1.15, r * 0.5), 'paw', {bone: 1.0}, s=5.0)


def tags(b, kind, poll, nk, a):
    """the lion's research GPS collar: the box under the throat (the band is painted)"""
    import numpy as np
    p = nk[0] + (nk[-1] - nk[0]) * a['collar']
    b.ell(p - np.array([0, 0.0, a['neck'][0][2] * 0.95]), (0.035, 0.03, 0.03), 'collarbox', {B['neck']: 1.0}, s=6.0)
    b.marks['collar'] = p


def labplate(b, a, nk):
    """THE LAB MARK THAT READS FROM THE FIGHT'S CAMERA (rule 345 amended (d), Paolo 11/3; measured 11/3: the ear tags rendered 0 to 3
    dull pixels, a small thing on the side of an ear seen from 45 degrees above, and the sheet's 64 colours merged them into the coat):
    a lab collar whose numbered plate sits on the NAPE, the top of the neck the camera looks down on, in hi-vis yellow-green (the colour
    of a safety vest: no fur on any animal is it, so it reads on every coat), sized to the animal"""
    import numpy as np
    c = a.get('collar', 0.45); k = min(1.5, max(0.85, a['wh'] / 1.0))
    p = nk[0] + (nk[-1] - nk[0]) * c
    hd = a['neck'][0][2] + (a['neck'][-1][2] - a['neck'][0][2]) * c
    # the plate sits ON the surface: march up from the neck's line until the body's field falls under the threshold (measured 11/3: a
    # plate set at the neck's half-depth was buried under the bear's and the bison's humps and the sloth's shoulders, 0 pixels)
    top = p.copy()
    for _ in range(400):
        if fields(b, top[None]).sum() < T_MB: break
        top = top + np.array([0, 0, 0.005])
    top = top - np.array([0, 0, 0.012 * k])
    b.ell(top, (0.075 * k, 0.065 * k, 0.03 * k), 'labplate', {B['neck']: 1.0}, s=6.0)
    b.marks['labplate'] = top; b.marks.setdefault('collar', p); b.marks['labk'] = k


def tube_mesh(curve, radii, R=8):
    """a closed tube along a curve (horns, tusks): verts and faces"""
    import numpy as np
    verts, faces = [], []
    n = len(curve)
    for i in range(n):
        d = curve[min(i + 1, n - 1)] - curve[max(i - 1, 0)]; F = frame_x(d)
        for j in range(R):
            t = 2 * math.pi * j / R
            verts.append(curve[i] + F[:, 1] * radii[i] * math.cos(t) + F[:, 2] * radii[i] * math.sin(t))
    for i in range(n - 1):
        for j in range(R):
            a0, a1 = i * R + j, i * R + (j + 1) % R
            faces.append((a0, a1, a1 + R, a0 + R))
    faces.append(tuple(range(R - 1, -1, -1))); faces.append(tuple(range((n - 1) * R, n * R)))
    return np.array(verts), faces


def horns(b, a, poll, dirv, upv):
    """two horns from the poll's corners: out to the side, then forward and up, tapering to a point"""
    import numpy as np
    h = a['horns']; hw_ = a['head'][2]
    for side in (-1, 1):
        base = poll + np.array([side * hw_ * 0.72, 0, 0]) + upv * a['head'][1] * 0.35
        curve = []
        for i in range(h['n']):
            t = i / (h['n'] - 1)
            curve.append(base + np.array([side * h['out'] * math.sin(t * math.pi / 2), -h['fwd'] * t * t, h['up'] * t ** 1.6]))
        radii = [h['r'] * (1 - 0.88 * (i / (h['n'] - 1)) ** 1.2) for i in range(h['n'])]
        v, f = tube_mesh(curve, radii)
        b.extra.append((v, f, 'horn', {B['head']: 1.0}))
        b.marks[('horn', side)] = curve


def tusks(b, a, nose, dirv, upv):
    import numpy as np
    t = a['tusks']; mr = a['head'][5]
    for side in (-1, 1):
        base = nose - dirv * 0.07 + np.array([side * mr * 0.9, 0, 0]) - upv * mr * 0.3
        curve = [base + dirv * (-0.01 * i) + upv * (t['len'] * i / 5) + np.array([side * 0.008 * i, 0, 0]) for i in range(6)]
        curve = [c - dirv * (0.004 * i * i) for i, c in enumerate(curve)]
        v, f = tube_mesh(curve, [t['r'] * (1 - 0.8 * i / 5) for i in range(6)], R=6)
        b.extra.append((v, f, 'tusk', {B['head']: 1.0}))


def sabres(b, a, mstart, nose, dirv, upv):
    """the sabre-tooth's two canines: from the upper jaw behind the nose, down and a little back, past the chin"""
    import numpy as np
    c = a['sabres']; mr = a['head'][5]
    for side in (-1, 1):
        base = mstart + (nose - mstart) * 0.55 + np.array([side * mr * 0.55, 0, 0]) - upv * mr * 0.2
        curve = [base - upv * c['len'] * (i / 5) + dirv * (-0.02 * (i / 5) ** 2) for i in range(6)]
        v, f = tube_mesh(curve, [c['r'] * (1 - 0.75 * i / 5) for i in range(6)], R=6)
        b.extra.append((v, f, 'sabre', {B['head']: 1.0}))


def claws(b, a):
    """the ground sloth's great claws: three on each forefoot, curved in and back under the knuckles it walks on"""
    import numpy as np
    c = a['claws']
    for side in (-1, 1):
        G = b.marks[('foot', 'F', side)]; bone = LEGS[('F', side)][2]
        for k in (-1, 0, 1):
            base = G + np.array([side * 0.02 + k * 0.03, -0.06, 0.07])
            curve = [base + np.array([-side * 0.03 * (i / 5) ** 1.2, -c['len'] * 0.55 * (i / 5), -0.06 * (i / 5) ** 1.5]) for i in range(6)]
            v, f = tube_mesh(curve, [c['r'] * (1 - 0.8 * i / 5) for i in range(6)], R=6)
            b.extra.append((v, f, 'claw', {bone: 1.0}))


def fields(b, P):
    """each element's field at points P (n,3), Blender's own: s(1 - d^2/R^2)^3 inside R"""
    import numpy as np
    out = np.zeros((len(b.els), len(P)), np.float32)
    for i, e in enumerate(b.els):
        d = (P - e['co']) @ e['rot']
        if e['kind'] == 'CAPSULE':
            d[:, 0] = np.where(d[:, 0] > e['half'], d[:, 0] - e['half'], np.where(d[:, 0] < -e['half'], d[:, 0] + e['half'], 0))
        else:
            d = d / e['size']
        q = 1 - (d * d).sum(1) / (e['R'] ** 2)
        out[i] = np.where(q > 0, e['s'] * q ** 3, 0) * (-1 if e['neg'] else 1)
    return out


# ---------------------------------------------------------------------------------------------------------------------------
# THE MODEL: Blender
# ---------------------------------------------------------------------------------------------------------------------------
def model(name):
    import bpy, mathutils
    import numpy as np
    a = BEASTS[name]; b = build_body(name)
    s = FOX_BODY / a['bl']   # metres -> the Fox's units
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=FOX)
    sc = bpy.context.scene; sc.render.fps = 24
    arm = [o for o in sc.objects if o.type == 'ARMATURE'][0]
    for o in list(sc.objects):
        if o.type == 'MESH': bpy.data.objects.remove(o, do_unlink=True)
    for a_ in bpy.data.actions: a_.name = a_.name.split('_')[0]
    if arm.animation_data:
        for t in list(arm.animation_data.nla_tracks): arm.animation_data.nla_tracks.remove(t)
    else: arm.animation_data_create()
    # 1. the metaball body, in metres
    mb = bpy.data.metaballs.new('body'); mb.resolution = a['res']; mb.render_resolution = a['res']; mb.threshold = T_MB
    mb.update_method = 'UPDATE_ALWAYS'
    ob = bpy.data.objects.new('body_mb', mb); sc.collection.objects.link(ob)
    for e in b.els:
        el = mb.elements.new(type=e['kind'])
        el.co = mathutils.Vector(e['co']); el.radius = float(e['R']); el.stiffness = float(e['s'])
        el.rotation = mathutils.Matrix(e['rot'].tolist()).to_quaternion()
        if e['kind'] == 'CAPSULE': el.size_x = float(e['half'])
        else: el.size_x, el.size_y, el.size_z = [float(x) for x in e['size']]
        el.use_negative = e['neg']
    dg = bpy.context.evaluated_depsgraph_get()
    me0 = bpy.data.meshes.new_from_object(ob.evaluated_get(dg))
    bpy.data.objects.remove(ob, do_unlink=True)
    V = np.array([v.co[:] for v in me0.vertices], np.float64)
    Fc = [tuple(p.vertices) for p in me0.polygons]
    print('METABALL', name, len(V), 'verts', len(Fc), 'faces', 'bbox', V.min(0).round(3), V.max(0).round(3), flush=True)
    # 2. which part each vertex grew from, and its bones (each element's field share)
    Fd = np.maximum(fields(b, V), 0)
    tot = Fd.sum(0) + 1e-9
    part_names = sorted(set(e['part'] for e in b.els) | {x[2] for x in b.extra})
    part_ix = {p: i for i, p in enumerate(part_names)}
    vpart = np.array([part_ix[b.els[i]['part']] for i in Fd.argmax(0)])
    bone_names = sorted({bn for e in b.els for bn in e['bones']} | {bn for x in b.extra for bn in x[3]})
    W = np.zeros((len(V), len(bone_names)), np.float32)
    bix = {bn: i for i, bn in enumerate(bone_names)}
    for i, e in enumerate(b.els):
        share = Fd[i] / tot
        for bn, w in e['bones'].items(): W[:, bix[bn]] += share * w
    # 3. the extra meshes (horns, tusks) joined in, wholly on their bone
    faces = list(Fc); verts = [V]; parts = [vpart]; Ws = [W]
    off = len(V)
    for v, f, part, bones in b.extra:
        verts.append(v); parts.append(np.full(len(v), part_ix[part]))
        w = np.zeros((len(v), len(bone_names)), np.float32)
        for bn, x in bones.items(): w[:, bix[bn]] = x
        Ws.append(w); faces += [tuple(i + off for i in fc) for fc in f]; off += len(v)
    V = np.concatenate(verts); vpart = np.concatenate(parts); W = np.concatenate(Ws)
    # keep each vertex's four strongest bones
    order = np.argsort(-W, 1)
    keep = np.zeros_like(W, bool); np.put_along_axis(keep, order[:, :4], True, 1)
    W = np.where(keep & (W > 0.01), W, 0); W /= np.maximum(W.sum(1, keepdims=True), 1e-9)
    # 4. into the Fox's units, the mesh object
    Vs = V * s
    me = bpy.data.meshes.new(name); me.from_pydata([tuple(x) for x in Vs], [], faces); me.update()
    obj = bpy.data.objects.new(name, me); sc.collection.objects.link(obj)
    for p in me.polygons: p.use_smooth = True
    # 5. the bones to the animal's joints: moved, never turned
    bpy.context.view_layer.objects.active = arm; arm.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    for eb in arm.data.edit_bones: eb.use_connect = False
    for bn, p in b.joints.items():
        eb = arm.data.edit_bones[bn]; tgt = mathutils.Vector(p * s)
        d = tgt - eb.head; eb.head = tgt; eb.tail = eb.tail + d
    bpy.ops.object.mode_set(mode='OBJECT')
    # 6. the skin
    obj.parent = arm
    mod = obj.modifiers.new('Armature', 'ARMATURE'); mod.object = arm
    for bn in bone_names:
        vg = obj.vertex_groups.new(name=bn); col = W[:, bix[bn]]
        for wv in np.unique(np.round(col[col > 0], 3)):
            idx = np.where(np.abs(col - wv) < 0.0005)[0].tolist()
            if idx: vg.add(idx, float(wv), 'REPLACE')
    # 7. the coat: UVs, a texture, every texel painted from the point on the body it shows
    bpy.ops.object.select_all(action='DESELECT'); obj.select_set(True); bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.004)
    bpy.ops.object.mode_set(mode='OBJECT')
    TEX = 1024
    img = bpy.data.images.new('coat_' + name, TEX, TEX, alpha=True)
    mat = bpy.data.materials.new('coat_' + name); mat.use_nodes = True
    bsdf = mat.node_tree.nodes['Principled BSDF']; tex = mat.node_tree.nodes.new('ShaderNodeTexImage'); tex.image = img
    mat.node_tree.links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
    bsdf.inputs['Roughness'].default_value = 0.88
    if 'Specular IOR Level' in bsdf.inputs: bsdf.inputs['Specular IOR Level'].default_value = 0.25
    me.materials.append(mat)
    P, N, PART = trace(me, TEX, vpart)
    rgb = paint(name, b, P / s, N, PART, part_ix)
    px = np.zeros((TEX, TEX, 4), np.float32); px[..., :3] = rgb; px[..., 3] = 1.0
    img.pixels = px.ravel().tolist(); img.file_format = 'PNG'; img.pack()
    # 8. the moves: the gait, the bob, the attack
    gait(arm, a, name)
    attack(arm, a, name)
    ad = arm.animation_data; ad.action = None
    for t in list(ad.nla_tracks): ad.nla_tracks.remove(t)
    for act in bpy.data.actions:
        t = ad.nla_tracks.new(); t.name = act.name; t.strips.new(act.name, int(act.frame_range[0]), act)
    out = os.path.join(ROOT, MODELS, name + '.glb'); os.makedirs(os.path.dirname(out), exist_ok=True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_animations=True, export_animation_mode='NLA_TRACKS',
                              export_skins=True, export_apply=False, export_yup=True, export_image_format='AUTO', export_nla_strips=True)
    print('WROTE', os.path.relpath(out, ROOT), 'verts', len(V), 'parts', {p: int((vpart == i).sum()) for p, i in part_ix.items()},
          'clips', [x.name for x in bpy.data.actions], flush=True)
    audit(name, b, V)


def audit(name, b, V):
    """the animal's own measures, read off the built body (metres), beside the real ones"""
    import numpy as np
    a = BEASTS[name]
    yF, yB = -a['bl'] / 2, a['bl'] / 2
    near = lambda y0, y1: V[(V[:, 1] > y0) & (V[:, 1] < y1) & (np.abs(V[:, 0]) < a['sw'])]
    sh = near(yF + 0.15 * a['bl'], yF + 0.30 * a['bl'])[:, 2].max()
    hip = near(yB - 0.25 * a['bl'], yB - 0.10 * a['bl'])[:, 2].max()
    out = dict(beast=name, shoulder_m=round(float(sh), 3), hip_m=round(float(hip), 3), top_m=round(float(V[:, 2].max()), 3),
               long_m=round(float(V[:, 1].max() - V[:, 1].min()), 3), wide_m=round(float(V[:, 0].max() - V[:, 0].min()), 3),
               real=a['real_note'])
    os.makedirs(os.path.join(ROOT, 'records/target/beasts_own_body'), exist_ok=True)
    json.dump(out, open(os.path.join(ROOT, 'records/target/beasts_own_body', name + '_audit.json'), 'w'), indent=1)
    print('AUDIT', json.dumps(out), flush=True)


def trace(me, TEX, vpart):
    """every texel traced to its point on the body through the UVs: the 3D point, the normal, the part"""
    import numpy as np
    P = np.zeros((TEX, TEX, 3), np.float32); N = np.zeros((TEX, TEX, 3), np.float32); PART = np.full((TEX, TEX), -1, np.int16)
    me.calc_loop_triangles()
    uvl = me.uv_layers.active.data
    co = np.array([v.co[:] for v in me.vertices]); nor = np.array([v.normal[:] for v in me.vertices])
    for tri in me.loop_triangles:
        uv = np.array([uvl[l].uv[:] for l in tri.loops]) * TEX
        vi = list(tri.vertices)
        x0, y0 = np.floor(uv.min(0)).astype(int); x1, y1 = np.ceil(uv.max(0)).astype(int)
        x0, y0 = max(x0, 0), max(y0, 0); x1, y1 = min(x1, TEX - 1), min(y1, TEX - 1)
        if x1 < x0 or y1 < y0: continue
        xs, ys = np.meshgrid(np.arange(x0, x1 + 1) + 0.5, np.arange(y0, y1 + 1) + 0.5)
        (ax, ay), (bx, by), (cx, cy) = uv
        den = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy)
        if abs(den) < 1e-12: continue
        l0 = ((by - cy) * (xs - cx) + (cx - bx) * (ys - cy)) / den
        l1 = ((cy - ay) * (xs - cx) + (ax - cx) * (ys - cy)) / den
        l2 = 1 - l0 - l1
        m = (l0 >= -0.03) & (l1 >= -0.03) & (l2 >= -0.03)
        if not m.any(): continue
        L = np.stack([l0, l1, l2], -1)[m]
        iy, ix = (ys[m] - 0.5).astype(int), (xs[m] - 0.5).astype(int)
        P[iy, ix] = L @ co[vi]; nv = L @ nor[vi]; N[iy, ix] = nv / np.maximum(np.linalg.norm(nv, axis=1, keepdims=True), 1e-6)
        PART[iy, ix] = vpart[np.array(vi)[L.argmax(1)]]
    return P, N, PART


# ---------------------------------------------------------------------------------------------------------------------------
# THE COATS (sRGB, the byte texture's own space)
# ---------------------------------------------------------------------------------------------------------------------------
def seg_dist(P, a, b):
    import numpy as np
    ab = b - a; t = np.clip(((P - a) @ ab) / (ab @ ab), 0, 1)
    return np.linalg.norm(P - (a + t[..., None] * ab), axis=-1), t


def paint(name, b, P, N, PART, pix):
    import numpy as np
    a = BEASTS[name]
    C = lambda *c: np.array(c, np.float32)
    covered = PART >= 0
    isp = lambda *names: np.isin(PART, [pix[n] for n in names if n in pix])
    z = P[..., 2]; y = P[..., 1]; x = P[..., 0]; up = N[..., 2]
    wh, hh, bl, cd = a['wh'], a['hh'], a['bl'], a['cd']
    brisket = wh - cd
    head = isp('head', 'muzzle', 'snout', 'ear')
    legs = isp('leg', 'hoof', 'pad', 'paw')
    # the light the coat carries in itself: none (the rig lights it); a slow drift and a fine grizzle at body scale
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
        _, tail_t = seg_dist(P, tail_pts[0], tail_pts[-1])
    belly = np.clip((brisket + 0.18 * cd - z) / (0.25 * cd), 0, 1) * np.clip(-N[..., 2] * 1.5 + 0.3, 0, 1)
    belly = belly * (~legs) * (~head)
    back = np.clip((up - 0.35) / 0.5, 0, 1) * (~head) * (z > brisket + 0.4 * cd)
    if name == 'feral_bull':
        RED, DARK, WHITE = C(0.44, 0.21, 0.12), C(0.30, 0.14, 0.09), C(0.86, 0.83, 0.76)
        put(covered, RED)
        out[:] = out * (1 - back[..., None] * 0.35) + DARK * back[..., None] * 0.35
        face = head & ~isp('ear')
        put(face, WHITE)
        put(isp('ear'), RED * 1.05)
        put(isp('neck', 'crest') & (up > 0.3) & (y < -0.84), WHITE * 0.97)   # the Hereford's white crest: the neck's top, not the back
        put(isp('dewlap', 'neck') & (N[..., 2] < -0.35), WHITE * 0.95)
        put(belly > 0.45, WHITE * 0.93)
        put(legs & (z < a['carpus'] * wh + 0.02), WHITE * 0.92)
        put(isp('hoof') | (legs & (z < 0.05)), C(0.17, 0.14, 0.12))
        put(isp('tuft'), WHITE * 0.95)
        hrn = isp('horn')
        if hrn.any():
            ht = np.zeros(z.shape, np.float32)
            for side in (-1, 1):
                cv = b.marks[('horn', side)]; d0, t0 = seg_dist(P, cv[0], cv[-1]); ht = np.where(d0 < 0.08, t0, ht)
            out[hrn] = (C(0.84, 0.78, 0.64) * (1 - ht[hrn, None]) + C(0.22, 0.19, 0.16) * ht[hrn, None])
        put(isp('muzzle') & (nose_d < a['head'][5] * 1.25), C(0.60, 0.46, 0.42))
        put(eye_d < a['eyes'], C(0.09, 0.07, 0.06))
        put(isp('tag'), C(0.80, 0.98, 0.16))   # the farm tag, lime like a real one (rule 359 (2))
        # old fight scars, healed pale on the shoulder (a range bull's own)
        for k in range(3):
            d, _ = seg_dist(P, np.array([0.30, -0.55 + 0.07 * k, 1.10 - 0.05 * k]), np.array([0.36, -0.40 + 0.08 * k, 0.86 - 0.04 * k]))
            put(covered & (d < 0.012) & (x > 0), C(0.62, 0.45, 0.38))
    elif name == 'camelops':
        SAND, TOP, PALE = C(0.66, 0.54, 0.38), C(0.50, 0.38, 0.25), C(0.78, 0.70, 0.56)
        put(covered, SAND)
        out[:] = out * (1 - back[..., None] * 0.5) + TOP * back[..., None] * 0.5
        put(isp('hump') & (up > 0.3), TOP)
        put(isp('neck') & (up > 0.55), TOP * 1.05)
        put(belly > 0.4, PALE)
        put(legs & (z < a['carpus'] * wh + 0.10) & (z > a['carpus'] * wh - 0.06) & (y < 0), C(0.34, 0.29, 0.25))   # the knee calluses
        put(isp('pad'), C(0.30, 0.25, 0.21))
        put(isp('muzzle') & (nose_d < 0.09), C(0.48, 0.38, 0.29))
        put(isp('tuft'), C(0.30, 0.23, 0.17))
        put(eye_d < a['eyes'], C(0.08, 0.07, 0.06))
        # the lab: the shaved neck patch where the blood was drawn, its stitches, the lab's tag
        nk = a['neck']; p0 = np.array([0.0, nk[1][0], nk[1][1]]); p1 = np.array([0.0, nk[2][0], nk[2][1]])
        mid = p0 + (p1 - p0) * 0.2
        patch = isp('neck') & (x > 0.0) & (np.abs(y - mid[1]) < 0.11) & (np.abs(z - mid[2]) < 0.10)
        put(patch, C(0.72, 0.58, 0.54))
        put(patch & (np.abs((y - mid[1]) * 0.6 + (z - mid[2])) < 0.012), C(0.24, 0.15, 0.14))
        put(isp('tag'), C(0.86, 0.70, 0.13))
    elif name == 'mountain_lion':
        TAWNY, BACK, CREAM = C(0.70, 0.50, 0.31), C(0.60, 0.42, 0.26), C(0.86, 0.80, 0.70)
        put(covered, TAWNY)
        out[:] = out * (1 - back[..., None] * 0.6) + BACK * back[..., None] * 0.6
        put(belly > 0.35, CREAM)
        put(isp('muzzle') & (N[..., 2] < 0.2), CREAM)
        put(isp('neck', 'head') & (N[..., 2] < -0.5), CREAM)
        md = np.linalg.norm(P - (b.marks['mstart'] - b.marks['upv'] * 0.01), axis=-1)
        put(isp('muzzle', 'head') & (md < 0.03) & (np.abs(x) > 0.02), C(0.18, 0.14, 0.11))   # the dark whisker marks
        put(isp('ear') & (N[..., 1] > 0.0), C(0.20, 0.16, 0.13))                          # the ears' dark backs
        put(isp('tail') & (tail_t > 0.92), C(0.12, 0.10, 0.09))
        put(eye_d < a['eyes'], C(0.10, 0.09, 0.07))
        put(isp('paw') & (z < 0.025), C(0.50, 0.38, 0.27))
        # the research GPS collar: a band and its box (NDOW collars the Spring Mountains' lions)
        if 'collar' in b.marks:
            d, _ = seg_dist(P, b.marks['collar'] - np.array([0, 0.012, 0]), b.marks['collar'] + np.array([0, 0.012, 0]))
            band = isp('neck') & (np.abs(y - b.marks['collar'][1]) < 0.022)
            put(band | isp('collarbox'), C(0.22, 0.24, 0.19))
            put(isp('collarbox') & (N[..., 2] < -0.6), C(0.70, 0.62, 0.20))
    elif name == 'feral_hog':
        BLACK, GREY = C(0.21, 0.18, 0.16), C(0.36, 0.32, 0.29)
        put(covered, BLACK)
        out[:] = out * (1 + (lat[q[..., 0], q[..., 1], q[..., 2]][..., None] > 0.82) * 0.45)   # the bristles' pale tips
        put(isp('crest'), C(0.13, 0.11, 0.10))
        put(isp('muzzle') & (nose_d < 0.20), GREY)
        put(isp('snout'), C(0.44, 0.34, 0.33))
        put(isp('snout') & (np.abs(x) > 0.012) & (np.abs(x) < 0.03) & (N[..., 1] < -0.6), C(0.12, 0.09, 0.09))
        put(isp('tusk'), C(0.86, 0.81, 0.68))
        put(isp('hoof'), C(0.12, 0.10, 0.09))
        put(eye_d < a['eyes'], C(0.06, 0.05, 0.05))
        put(isp('tag'), C(0.80, 0.98, 0.16))   # the farm tag, lime like a real one (rule 359 (2))
    elif name == 'coyote':
        BUFF, SADDLE, RUST, PALE = C(0.58, 0.48, 0.36), C(0.31, 0.28, 0.25), C(0.62, 0.40, 0.23), C(0.82, 0.77, 0.68)
        put(covered, BUFF)
        sad = back * (lat[q[..., 0], q[..., 1], q[..., 2]] > 0.35)
        out[:] = out * (1 - sad[..., None] * 0.8) + SADDLE * sad[..., None] * 0.8
        put(legs & (z < brisket), RUST)
        put(isp('ear'), RUST * 1.02)
        put(isp('muzzle') & (N[..., 2] > -0.2) & (np.abs(x) > 0.012), RUST * 1.05)
        put(belly > 0.3, PALE)
        put(isp('neck', 'head', 'muzzle') & (N[..., 2] < -0.45), PALE)
        put(isp('tail') & (tail_t > 0.82), C(0.12, 0.11, 0.10))
        put(isp('muzzle') & (nose_d < 0.016), C(0.10, 0.09, 0.08))
        put(eye_d < a['eyes'], C(0.10, 0.09, 0.07))
        # mange: the bare grey skin on the hip and the tail's root (sarcoptic mange, the city's coyotes' own)
        mg = isp('rump', 'thigh', 'tail') & (np.linalg.norm(P - np.array([0.05, bl / 2 - 0.06, hh - 0.05]), axis=-1) < 0.075)
        put(mg & (lat2[q2[..., 0], q2[..., 1], q2[..., 2]] > 0.25), C(0.55, 0.49, 0.46))
    elif name == 'dire_wolf':
        WHITE, SAD, DARK = C(0.84, 0.81, 0.74), C(0.70, 0.67, 0.61), C(0.26, 0.24, 0.22)
        put(covered, WHITE)
        out[:] = out * (1 - back[..., None] * 0.55) + SAD * back[..., None] * 0.55
        put(isp('muzzle') & (nose_d < 0.025), C(0.14, 0.12, 0.11))
        put(eye_d < a['eyes'], C(0.12, 0.10, 0.09))
        put(isp('paw') & (z < 0.02), C(0.55, 0.52, 0.48))
        put(isp('tag'), C(0.90, 0.48, 0.12))
    elif name == 'cave_hyena':
        SAND, SPOT, MANE, TIP, LEGS, FACE = C(0.54, 0.46, 0.34), C(0.15, 0.11, 0.08), C(0.20, 0.16, 0.13), C(0.08, 0.07, 0.06), C(0.30, 0.24, 0.19), C(0.30, 0.25, 0.21)
        put(covered, SAND)
        # round spots, one per cell of a jittered 3D grid (about 6 cm across), on the flanks, the haunches and the legs, never the back's top
        cell = 0.085; gi = np.floor(P / cell); h = (gi[..., 0] * 73856093 + gi[..., 1] * 19349663 + gi[..., 2] * 83492791) % 1000003
        jit = np.stack([(h % 97) / 97.0, (h % 89) / 89.0, (h % 83) / 83.0], -1)
        d = np.linalg.norm(P - (gi + 0.25 + 0.5 * jit) * cell, axis=-1)
        spot = covered & (d < 0.028) & (up < 0.35) & ~isp('head', 'muzzle', 'ear', 'crest', 'tuft') & (h % 7 != 0)
        put(spot, SPOT)
        put(legs & (z < 0.30), LEGS)
        put(isp('crest') | (isp('neck', 'chest') & (up > 0.75)), MANE)
        put(isp('muzzle'), FACE)
        put(isp('head') & (y < b.marks['poll'][1] - 0.12), FACE)
        put(isp('ear') & (N[..., 1] > 0.0), MANE)
        put(isp('tuft'), TIP)
        put(isp('muzzle') & (nose_d < 0.03), C(0.06, 0.05, 0.05))
        put(eye_d < a['eyes'], C(0.07, 0.06, 0.05))
        # the lab: a big numbered tag in the ear (bright, two dark digits), and the shaved, stitched patch on the shoulder
        tg = isp('tag'); put(tg, C(0.92, 0.74, 0.10))
        et_ = b.marks[('ear', 1)]
        put(tg & (np.abs(P[..., 0] - et_[0]) < 0.006) & (N[..., 0] > 0.3), C(0.10, 0.08, 0.06))
        sp = np.array([0.15, -0.38, 0.66])
        patch = isp('shoulder', 'chest') & (P[..., 0] > 0.05) & (np.abs(y - sp[1]) < 0.075) & (np.abs(z - sp[2]) < 0.07)
        put(patch, C(0.72, 0.60, 0.55))
        put(patch & (np.abs((y - sp[1]) - (z - sp[2]) * 0.8) < 0.009), C(0.22, 0.12, 0.11))
    elif name == 'short_faced_bear':
        BROWN, DARK, MUZ = C(0.30, 0.18, 0.10), C(0.17, 0.11, 0.07), C(0.55, 0.40, 0.26)
        put(covered, BROWN)
        out[:] = out * (1 - back[..., None] * 0.45) + C(0.40, 0.26, 0.15) * back[..., None] * 0.45   # the grizzled shoulders and back
        put(legs & (z < 0.55), DARK)
        put(isp('muzzle'), MUZ)
        put(isp('muzzle') & (nose_d < 0.045), C(0.08, 0.07, 0.06))
        put(eye_d < a['eyes'], C(0.06, 0.05, 0.05))
        put(isp('paw') & (z < 0.03), C(0.12, 0.10, 0.09))
        # the lab: a thick collar with its box, a numbered tag in the ear
        if 'collar' in b.marks:
            put(isp('neck') & (np.abs(y - b.marks['collar'][1]) < 0.05), C(0.16, 0.18, 0.16))
            put(isp('collarbox'), C(0.16, 0.18, 0.16)); put(isp('collarbox') & (N[..., 2] < -0.6), C(0.88, 0.40, 0.10))
        tg = isp('tag'); put(tg, C(0.92, 0.74, 0.10))
        et_ = b.marks[('ear', 1)]; put(tg & (np.abs(P[..., 0] - et_[0]) < 0.008) & (N[..., 0] > 0.3), C(0.10, 0.08, 0.06))
    elif name == 'ground_sloth':
        SHAG, DARK, PALE = C(0.50, 0.34, 0.19), C(0.28, 0.19, 0.11), C(0.62, 0.47, 0.30)
        put(covered, SHAG)
        out[:] = out * (1 - back[..., None] * 0.4) + PALE * back[..., None] * 0.4
        put(legs & (z < 0.35), DARK)
        put(isp('head', 'muzzle') & (y < b.marks['poll'][1] - 0.10), C(0.26, 0.21, 0.16))
        put(isp('claw'), C(0.80, 0.74, 0.60))
        put(eye_d < a['eyes'], C(0.05, 0.04, 0.04))
        put(isp('muzzle') & (nose_d < 0.03), C(0.08, 0.07, 0.06))
        # the lab: a big numbered tag in the ear and a shaved, stitched patch on the hip where the lab took its samples
        tg = isp('tag'); put(tg, C(0.92, 0.74, 0.10))
        sp = np.array([0.30, bl / 2 - 0.30, hh - 0.25])
        patch = isp('rump', 'thigh', 'barrel') & (P[..., 0] > 0.10) & (np.abs(y - sp[1]) < 0.09) & (np.abs(z - sp[2]) < 0.08)
        put(patch, C(0.74, 0.62, 0.57)); put(patch & (np.abs((y - sp[1]) - (z - sp[2]) * 0.9) < 0.01), C(0.22, 0.12, 0.11))
    elif name in ('sabre_tooth', 'american_lion'):
        TAWNY, BACK, CREAM = (C(0.62, 0.45, 0.27), C(0.52, 0.37, 0.22), C(0.84, 0.77, 0.64)) if name == 'sabre_tooth' else (C(0.72, 0.56, 0.35), C(0.62, 0.47, 0.29), C(0.86, 0.80, 0.68))
        put(covered, TAWNY)
        out[:] = out * (1 - back[..., None] * 0.5) + BACK * back[..., None] * 0.5
        put(belly > 0.35, CREAM); put(isp('muzzle') & (N[..., 2] < 0.2), CREAM); put(isp('neck', 'head') & (N[..., 2] < -0.5), CREAM)
        if name == 'sabre_tooth':   # faint spots on the flanks (the reconstructions' leopard-like dapple, kept faint)
            cell = 0.11; gi = np.floor(P / cell); h = (gi[..., 0] * 73856093 + gi[..., 1] * 19349663 + gi[..., 2] * 83492791) % 1000003
            jit = np.stack([(h % 97) / 97.0, (h % 89) / 89.0, (h % 83) / 83.0], -1); d = np.linalg.norm(P - (gi + 0.25 + 0.5 * jit) * cell, axis=-1)
            put(covered & (d < 0.03) & (up < 0.4) & (belly < 0.2) & ~isp('head', 'muzzle', 'ear', 'sabre'), BACK * 0.82)
        put(isp('ear') & (N[..., 1] > 0.0), C(0.18, 0.14, 0.11))
        put(isp('tuft'), C(0.20, 0.15, 0.11))
        put(isp('sabre'), C(0.88, 0.84, 0.72))
        put(isp('muzzle') & (nose_d < 0.03), C(0.32, 0.20, 0.17))
        put(eye_d < a['eyes'], C(0.10, 0.09, 0.07))
        put(isp('paw') & (z < 0.03), C(0.45, 0.34, 0.24))
        tg = isp('tag'); put(tg, C(0.92, 0.74, 0.10))
        et_ = b.marks[('ear', 1)]; put(tg & (np.abs(P[..., 0] - et_[0]) < 0.007) & (N[..., 0] > 0.3), C(0.10, 0.08, 0.06))
        if 'collar' in b.marks:
            put(isp('neck') & (np.abs(y - b.marks['collar'][1]) < 0.035), C(0.16, 0.18, 0.16))
            put(isp('collarbox'), C(0.16, 0.18, 0.16)); put(isp('collarbox') & (N[..., 2] < -0.6), C(0.88, 0.40, 0.10))
        if name == 'sabre_tooth':   # the shaved, stitched patch on the shoulder
            sp = np.array([0.17, -0.38, 0.74]); patch = isp('shoulder', 'chest') & (P[..., 0] > 0.08) & (np.abs(y - sp[1]) < 0.08) & (np.abs(z - sp[2]) < 0.07)
            put(patch, C(0.74, 0.62, 0.57)); put(patch & (np.abs((y - sp[1]) - (z - sp[2]) * 0.8) < 0.009), C(0.22, 0.12, 0.11))
    elif name == 'ancient_bison':
        BROWN, FRONT = C(0.34, 0.22, 0.13), C(0.19, 0.13, 0.08)
        put(covered, BROWN)
        put(isp('crest', 'neck', 'head', 'dewlap', 'shoulder', 'chest') | (legs & (y < 0) & (z > 0.5)), FRONT)
        put(isp('muzzle'), C(0.14, 0.11, 0.09)); put(isp('tuft'), FRONT)
        put(legs & (z < 0.45), C(0.22, 0.15, 0.10)); put(isp('hoof'), C(0.10, 0.09, 0.08))
        hrn = isp('horn'); put(hrn, C(0.14, 0.12, 0.11))
        put(eye_d < a['eyes'], C(0.05, 0.04, 0.04))
        put(isp('tag'), C(0.92, 0.74, 0.10))
        # the lab's freeze brand on the left hip: white numerals burned into the hide (the real ranch and lab mark)
        bp = np.array([0.28, bl / 2 - 0.25, hh - 0.30]); fb = isp('rump', 'thigh', 'barrel') & (x > 0.15)
        for k in range(3):
            d0, _ = seg_dist(P, bp + np.array([0, -0.10 + 0.09 * k, 0.07]), bp + np.array([0, -0.10 + 0.09 * k, -0.07]))
            put(fb & (d0 < 0.016), C(0.86, 0.84, 0.80))
        d0, _ = seg_dist(P, bp + np.array([0, -0.10, 0.07]), bp + np.array([0, 0.08, 0.07])); put(fb & (d0 < 0.016), C(0.86, 0.84, 0.80))
    elif name == 'ice_age_horse':
        DUN, DARK = C(0.68, 0.53, 0.33), C(0.17, 0.13, 0.10)
        put(covered, DUN)
        put(belly > 0.4, C(0.80, 0.70, 0.52))
        put(legs & (z < a['carpus'] * wh + 0.05), DARK)
        put(isp('mane', 'tail'), DARK)
        put(covered & (up > 0.8) & ~isp('head', 'muzzle', 'ear', 'neck'), C(0.24, 0.18, 0.12))   # the dark stripe down the back
        put(isp('muzzle') & (nose_d < 0.12), C(0.82, 0.74, 0.60))
        put(isp('ear') & (N[..., 1] > 0.2), DARK)
        put(eye_d < a['eyes'], C(0.05, 0.04, 0.04)); put(isp('hoof'), C(0.10, 0.09, 0.08))
        # the freeze mark on the left of the neck: white angular marks, the way real wild horses are marked (BLM)
        nk = a['neck']; mp = np.array([0.0, (nk[0][0] + nk[1][0]) / 2, (nk[0][1] + nk[1][1]) / 2]); fm = isp('neck') & (x > 0.05)
        for k in range(4):
            d0, _ = seg_dist(P, mp + np.array([0, -0.10 + 0.06 * k, 0.06]), mp + np.array([0, -0.10 + 0.06 * k + 0.03, -0.06]))
            put(fm & (d0 < 0.013), C(0.92, 0.90, 0.86))
    elif name == 'feral_dog_shepherd':
        BLACK, TAN, WHITE = C(0.15, 0.13, 0.12), C(0.62, 0.42, 0.24), C(0.86, 0.83, 0.77)
        put(covered, BLACK)
        put(legs & (z < brisket + 0.02), TAN)
        put(isp('muzzle'), TAN)
        put(isp('head') & (N[..., 2] < -0.3), TAN)
        put(belly > 0.4, TAN * 0.95)
        put(isp('chest', 'neck') & (N[..., 1] < -0.55) & (np.abs(x) < 0.05) & (z < wh - 0.15), WHITE)   # the blaze
        put(isp('paw') & (z < 0.03), WHITE * 0.95)
        put(isp('muzzle') & (nose_d < 0.02), C(0.08, 0.07, 0.07))
        put(eye_d < a['eyes'], C(0.18, 0.12, 0.08))
        cp = np.array([0.0, a['neck'][0][0] + (a['neck'][1][0] - a['neck'][0][0]) * a['dogcollar'],
                       a['neck'][0][1] + (a['neck'][1][1] - a['neck'][0][1]) * a['dogcollar']])
        put(isp('neck') & (np.abs((P - cp) @ np.array([0, 0.8, -0.6])) < 0.016), C(0.52, 0.14, 0.11))
        put(isp('tag'), C(0.70, 0.70, 0.66))
    if a.get('labmark') and 'labplate' in pix:
        k = b.marks['labk']; cy = b.marks['collar'][1]
        put(isp('neck') & (np.abs(y - cy) < 0.035 * k), C(0.13, 0.14, 0.13))         # the collar's band
        pl = isp('labplate'); put(pl, C(0.80, 0.98, 0.16))                              # the hi-vis plate
        put(pl & (np.abs(x) < 0.008 * k), C(0.10, 0.10, 0.08))                          # its number, a dark bar down the middle
        griz = np.where(pl, 1.0, griz); drift = np.where(pl, 1.0, drift)
    out = out * (griz * drift)[..., None]
    out = np.where(covered[..., None], np.clip(out, 0, 1), 0)
    # the seams: every empty texel takes its painted neighbours (eight rounds), so no island edge pulls in black
    filled = covered.copy()
    for _ in range(8):
        acc = np.zeros_like(out); cnt = np.zeros(filled.shape, np.float32)
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)):
            sh = np.roll(np.roll(out, dy, 0), dx, 1); sf = np.roll(np.roll(filled, dy, 0), dx, 1)
            acc += sh * sf[..., None]; cnt += sf
        new = (~filled) & (cnt > 0)
        out[new] = acc[new] / cnt[new, None]; filled |= new
    return out


# ---------------------------------------------------------------------------------------------------------------------------
# THE MOVES
# ---------------------------------------------------------------------------------------------------------------------------
LEG_ORDER = [('F', 1), ('F', -1), ('H', 1), ('H', -1)]
# THE GAITS, as each leg's place in the cycle (0..1): the walk's lateral sequence (a hind foot a quarter ahead of its fore), the
# trot (the diagonals together), the pace (both legs of one side together: the camel's own gait)
GAITS = {'walk': {('H', 1): 0.0, ('F', 1): 0.25, ('H', -1): 0.5, ('F', -1): 0.75},
         'trot': {('F', 1): 0.0, ('H', -1): 0.0, ('F', -1): 0.5, ('H', 1): 0.5},
         'pace': {('F', 1): 0.0, ('H', 1): 0.0, ('F', -1): 0.5, ('H', -1): 0.5}}
# the stride by animal: (stance share, the leg's swing either way in degrees, the fore knee's fold, the hind's fold, the bob in
# units on a 65-unit body, the head's nod, the body's roll, the tail's sway)
STRIDE = {'feral_bull': (0.55, 15, 55, 38, 1.5, 4, 1.5, 6), 'camelops': (0.5, 20, 60, 44, 1.2, 3, 4.0, 8),
          'mountain_lion': (0.62, 18, 50, 40, 0.5, 1, 0.0, 6), 'feral_hog': (0.5, 18, 50, 36, 1.0, 3, 0.0, 14),
          'coyote': (0.5, 20, 58, 44, 0.9, 2, 0.0, 6), 'dire_wolf': (0.6, 18, 52, 40, 0.8, 2, 0.0, 5),
          'feral_dog_shepherd': (0.6, 18, 52, 40, 0.8, 2, 0.0, 10), 'cave_hyena': (0.6, 16, 50, 36, 0.9, 4, 0.0, 6),
          'short_faced_bear': (0.55, 16, 48, 34, 1.4, 3, 3.0, 2), 'ground_sloth': (0.68, 11, 36, 26, 0.8, 2, 2.5, 4),
          'sabre_tooth': (0.62, 16, 48, 38, 0.6, 1, 0.0, 3), 'american_lion': (0.62, 18, 50, 40, 0.7, 1, 0.0, 6),
          'ancient_bison': (0.58, 13, 44, 30, 1.6, 4, 1.5, 6), 'ice_age_horse': (0.6, 20, 60, 44, 1.2, 4, 0.0, 8)}


def gait(arm, a, name):
    """THE ANIMAL'S OWN WALK (the Fox's walk was built for a fox's legs: on a bull's it folded the hind legs flat): 24 frames
    (two beats at 120 BPM), every leg on the animal's own gait (GAITS), its stride (STRIDE): the leg swings forward and back
    about the stance it was built in, and in the swing the fore knee and the hock fold so the foot lifts clear; the body bobs
    twice a cycle, the head nods with the front feet, the camel rolls with its pace, the tail sways. 'Survey' becomes the
    animal standing in its own stance (the poses tool's Hit and Fall start from it)."""
    duty, A, Ff, Gh, bob, nod, roll, sway = STRIDE[name]
    off = GAITS[a['gait']]
    keys = []
    for fr in range(25):
        t = fr / 24.0
        bones = {}
        for k in LEG_ORDER:
            p = (t + off[k]) % 1.0
            if p < duty:
                th = -A + 2 * A * (p / duty); f = 0.0
            else:
                u = (p - duty) / (1 - duty); th = A * math.cos(math.pi * u); f = math.sin(math.pi * u)
            ch = LEGS[k]
            if k[0] == 'F':
                bones[ch[0]] = (th * 0.75, 0, 0); bones[ch[1]] = (th * 0.25 - Ff * 0.45 * f, 0, 0); bones[ch[2]] = (Ff * f, 0, 0)
            else:
                bones[ch[0]] = (th - Gh * 0.35 * f, 0, 0); bones[ch[1]] = (Gh * 0.9 * f, 0, 0)
                bones[ch[2]] = (-Gh * 0.8 * f, 0, 0); bones[ch[3]] = (Gh * 0.3 * f, 0, 0)
        c2 = math.cos(4 * math.pi * t); c1 = math.sin(2 * math.pi * t)
        bones[B['neck']] = (nod * c2, 0, 0); bones[B['head']] = (-nod * 0.5 * c2, 0, 0)
        if roll: bones[B['hip']] = (0, 0, roll * c1)
        bones[B['t1']] = (0, sway * c1, 0); bones[B['t2']] = (0, sway * 0.6 * c1, 0)
        keys.append((fr, bones, (0.0, -bob * c2)))
    write_action(arm, 'Walk', keys, 24, 'LINEAR')
    write_action(arm, 'Survey', [(0, {}, (0, 0)), (24, {}, (0, 0))], 24, 'LINEAR')
    run = bpy_actions().get('Run')
    if run: bpy_actions().remove(run)
    print('GAIT', name, a['gait'], 'stride', STRIDE[name], flush=True)


def bpy_actions():
    import bpy
    return bpy.data.actions


def write_action(arm, nm, keys, T, interp):
    """keys (frame, {bone: (nod about the world's X, shake about Z, roll about Y)}, (forward, down) of the hip in units), each turn
    about the world's axis as the bone sees it in the animal's own stance, written as the action nm over 0..T"""
    import bpy, mathutils
    B8 = load('b8', 'tools/bohemia_animation_the_beast_in_eight_prep.py')
    arm.animation_data.action = None
    for pb in arm.pose.bones:
        pb.rotation_mode = 'QUATERNION'; pb.rotation_quaternion = (1, 0, 0, 0); pb.location = (0, 0, 0); pb.scale = (1, 1, 1)
    bpy.context.view_layer.update()
    axes = {pb.name: (B8.world_axis_in_bone(pb, (1, 0, 0)), B8.world_axis_in_bone(pb, (0, 0, 1)), B8.world_axis_in_bone(pb, (0, 1, 0)))
            for pb in arm.pose.bones}
    hip = arm.pose.bones[B['hip']]
    fwd = B8.world_axis_in_bone(hip, (0, -1, 0)); upw = B8.world_axis_in_bone(hip, (0, 0, 1))
    old = bpy.data.actions.get(nm)
    if old: bpy.data.actions.remove(old)
    act = bpy.data.actions.new(nm); arm.animation_data.action = act
    for fr, bones, (fw, dn) in keys:
        for pb in arm.pose.bones:
            qn = mathutils.Quaternion((1, 0, 0, 0))
            if pb.name in bones:
                nd, shake, rl = bones[pb.name]
                ax, az, ay = axes[pb.name]
                qn = mathutils.Quaternion(ax, math.radians(nd)) @ mathutils.Quaternion(az, math.radians(shake)) @ mathutils.Quaternion(ay, math.radians(rl))
            pb.rotation_quaternion = qn; pb.keyframe_insert('rotation_quaternion', frame=fr, group=pb.name)
            pb.location = (fwd * fw - upw * dn) if pb.name == B['hip'] else mathutils.Vector((0, 0, 0))
            pb.keyframe_insert('location', frame=fr, group=pb.name)
    for fc in act.fcurves:
        for k in fc.keyframe_points: k.interpolation = interp
    act.frame_range = (0, T); act.use_frame_range = True
    arm.animation_data.action = None


# the attacks, as the wolf's bite: (frame, {bone: (nod about the world's X (+ the nose down / a leg back), shake about Z,
# roll about Y (+ a right leg out))}, (forward, down) of the root in units on a body 65 units long). Drawn at frames 2, 6, 10,
# 14, 18, 22 (the rig's six keys over 24 frames); 0 and 24 are the stand.
RF, LF, RH, LH = LEGS[('F', -1)], LEGS[('F', 1)], LEGS[('H', -1)], LEGS[('H', 1)]
ATTACKS = {
    # THE GORE: the head goes down so the horns face him, the lunge, the hook up and to the side, and back
    'gore': [(0, {}, (0, 0)),
             (2, {B['neck']: (16, 0, 0), B['head']: (22, 0, 0), RF[0]: (8, 0, 0), LF[0]: (8, 0, 0)}, (-3, 1)),
             (6, {B['neck']: (22, 0, 0), B['head']: (26, 0, 0), RF[0]: (-18, 0, 0), LF[0]: (-10, 0, 0), RH[0]: (14, 0, 0), LH[0]: (10, 0, 0)}, (10, 1)),
             (10, {B['neck']: (20, 0, 0), B['head']: (22, 0, 0), RF[0]: (-10, 0, 0), LF[0]: (-20, 0, 0), RH[0]: (10, 0, 0), LH[0]: (16, 0, 0)}, (16, 1)),
             (14, {B['neck']: (-8, 10, 0), B['head']: (-30, 22, 0), B['chest']: (-4, 0, 0)}, (14, -1)),
             (18, {B['neck']: (2, 4, 0), B['head']: (-8, 8, 0)}, (8, 0)),
             (22, {B['neck']: (4, 0, 0), B['head']: (4, 0, 0)}, (2, 0)),
             (24, {}, (0, 0))],
    # THE SPRING AND THE PIN: down on the haunches, up and forward with the forepaws out, onto him, the bite held
    'pounce': [(0, {}, (0, 0)),
               (2, {B['neck']: (10, 0, 0), B['head']: (6, 0, 0), B['loin']: (6, 0, 0), RH[0]: (-14, 0, 0), LH[0]: (-14, 0, 0), RH[1]: (18, 0, 0), LH[1]: (18, 0, 0)}, (-3, 5)),
               (6, {B['neck']: (-8, 0, 0), B['chest']: (-14, 0, 0), RF[0]: (-40, 0, 0), LF[0]: (-40, 0, 0), RF[2]: (-30, 0, 0), LF[2]: (-30, 0, 0), RH[0]: (24, 0, 0), LH[0]: (24, 0, 0)}, (12, -9)),
               (10, {B['neck']: (-4, 0, 0), B['head']: (6, 0, 0), B['chest']: (-10, 0, 0), RF[0]: (-50, 0, 0), LF[0]: (-50, 0, 0), RF[2]: (-40, 0, 0), LF[2]: (-40, 0, 0), RH[0]: (18, 0, 0), LH[0]: (18, 0, 0)}, (20, -6)),
               (14, {B['neck']: (16, 0, 0), B['head']: (22, 0, 0), B['chest']: (6, 0, 0), RF[0]: (-24, 0, 0), LF[0]: (-24, 0, 0)}, (22, 3)),
               (18, {B['neck']: (14, 6, 0), B['head']: (18, 10, 0), RF[0]: (-20, 0, 0), LF[0]: (-20, 0, 0)}, (20, 3)),
               (22, {B['neck']: (6, 0, 0), B['head']: (6, 0, 0)}, (8, 1)),
               (24, {}, (0, 0))],
    # THE TUSK: the head low, the rush, the slash up and to one side, back across, and off
    'slash': [(0, {}, (0, 0)),
              (2, {B['neck']: (10, 0, 0), B['head']: (14, 0, 0)}, (-2, 1)),
              (6, {B['neck']: (14, 0, 0), B['head']: (18, 0, 0), RF[0]: (-14, 0, 0), LH[0]: (12, 0, 0)}, (10, 1)),
              (10, {B['neck']: (-6, 12, 0), B['head']: (-26, 18, 0)}, (14, 0)),
              (14, {B['neck']: (-2, -12, 0), B['head']: (-14, -20, 0)}, (13, 0)),
              (18, {B['neck']: (4, 0, 0), B['head']: (2, 0, 0)}, (7, 0)),
              (22, {B['neck']: (6, 0, 0), B['head']: (6, 0, 0)}, (2, 0)),
              (24, {}, (0, 0))],
    # THE MAUL (the unhold's blow and its throw, on a bear or a sloth): back on the haunches, up on the hind legs, the forearm swung
    # down across, then the bite or the claws held, and down
    'maul': [(0, {}, (0, 0)),
             (2, {B['neck']: (8, 0, 0), B['loin']: (4, 0, 0)}, (-3, 2)),
             (6, {B['hip']: (-22, 0, 0), B['neck']: (-6, 0, 0), RF[0]: (-40, 0, 0), LF[0]: (-30, 0, 0), RF[1]: (30, 0, 0), RH[0]: (16, 0, 0), LH[0]: (16, 0, 0)}, (2, -2)),
             (10, {B['hip']: (-30, 0, 0), B['neck']: (-10, 0, 0), B['head']: (-8, 0, 0), RF[0]: (-70, 0, 12), LF[0]: (-25, 0, 0), RF[1]: (40, 0, 0), RH[0]: (24, 0, 0), LH[0]: (24, 0, 0)}, (4, -3)),
             (14, {B['hip']: (-8, 0, 0), B['neck']: (16, 0, 0), B['head']: (18, 6, 0), RF[0]: (10, 0, -8), LF[0]: (-20, 0, 0)}, (10, 1)),
             (18, {B['neck']: (12, 8, 0), B['head']: (14, 10, 0), RF[0]: (-6, 0, 0)}, (8, 1)),
             (22, {B['neck']: (4, 0, 0), B['head']: (4, 0, 0)}, (3, 0)),
             (24, {}, (0, 0))],
    # THE KICK: the weight forward onto the front, a hind leg cocked and driven back and out, then the other, a forefoot strike
    'kick': [(0, {}, (0, 0)),
             (2, {B['neck']: (-6, 0, 0), B['chest']: (4, 0, 0), RH[0]: (-22, 0, 0), RH[1]: (40, 0, 0), RH[2]: (-25, 0, 0)}, (3, 0)),
             (6, {B['neck']: (-10, 0, 0), RH[0]: (40, 0, 22), RH[1]: (-6, 0, 0), RH[2]: (-14, 0, 0), B['hip']: (-6, 0, 0)}, (5, 1)),
             (10, {B['neck']: (-8, 0, 0), LH[0]: (40, 0, -22), LH[1]: (-6, 0, 0), LH[2]: (-14, 0, 0), B['hip']: (-6, 0, 0)}, (5, 1)),
             (14, {B['neck']: (-12, 6, 0), RF[0]: (-30, 0, 0), RF[1]: (45, 0, 0), B['chest']: (-6, 0, 0)}, (2, -1)),
             (18, {B['neck']: (-6, 0, 0), RF[0]: (-12, 0, 0), RF[1]: (6, 0, 0)}, (1, 0)),
             (22, {B['neck']: (-2, 0, 0)}, (0, 0)),
             (24, {}, (0, 0))],
}


def attack(arm, a, name):
    """the animal's own attack, written over the bite's slot ('Bite', 24 frames); the canines keep the wolf's bite keys"""
    B8 = load('b8', 'tools/bohemia_animation_the_beast_in_eight_prep.py')
    if a['attack'] == 'bite':
        keys = [(f, {bn: (v[0], v[1], 0) for bn, v in d.items()}, r) for f, d, r in B8.BITE]
    else:
        keys = ATTACKS[a['attack']]
    write_action(arm, 'Bite', keys, 24, 'BEZIER')


# ---------------------------------------------------------------------------------------------------------------------------
# THE PIPE: the five-beasts tool's own pose, render, pack and strip, on these seven
# ---------------------------------------------------------------------------------------------------------------------------
def fmb():
    M = load('fmb', 'tools/bohemia_factions_five_more_beasts.py')
    real = {}
    for n in BEASTS:
        f = os.path.join(ROOT, 'records/target/beasts_own_body', n + '_audit.json')
        real[n] = dict(real=json.load(open(f))['long_m']) if os.path.exists(f) else dict(real=1.0)
    M.BEASTS = real
    M.LOOK = {k: 'beast_' + k for k in BEASTS}
    M.MODELS = MODELS
    return M


if __name__ == '__main__':
    cmd = sys.argv[1]; arg = sys.argv[2] if len(sys.argv) > 2 else 'ALL'
    names = list(BEASTS) if arg == 'ALL' else arg.split(',')
    if cmd == 'model':
        for n in names: model(n)
    elif cmd in ('pose', 'render'):
        M = fmb()
        for n in names: getattr(M, cmd)(n)
    elif cmd == 'pack':
        M = fmb(); M.BEASTS = {n: M.BEASTS[n] for n in names}; M.pack()
        idx = os.path.join(ROOT, 'slices/fight_rig/fight_rig.json'); I = json.load(open(idx))
        for n in names:
            I['looks']['beast_' + n]['by'] = 'BEASTS 2 [every beast its own body] 11/3 (rule 345), tools/bohemia_beasts_every_beast_its_own_body.py'
        json.dump(I, open(idx, 'w'), indent=1)
    else:
        sys.exit('model | pose | render | pack')
