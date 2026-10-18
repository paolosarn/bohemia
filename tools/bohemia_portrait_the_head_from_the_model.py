#!/usr/bin/env python3
"""BOHEMIA -- PORTRAIT [the face from the same model]: THE HD FACE IS THE RIG'S HEAD, RENDERED CLOSE (rule 115c; ONE
ID, ONE WHOLE PERSON: the face and the body come from one model, never two).

THE GAP THIS CLOSES (COOK THREE's finding on the thug, records/BOHEMIA_COOK3_THE_THUG_THROUGH_THE_RIG_10_18_26.md):
'the head is the test body's head mesh, a box; scaling it makes a bigger box. A person model with a skull, a jaw and
hair geometry is what fixes it.' The packs hold no faces (records/BOHEMIA_PORTRAIT_QUARTERMASTERS_COUNT_10_13_26.md,
f3090598), so the head is MODELLED HERE, as geometry, the way DIRECTION modelled the oil drum and COOK THREE the
gambeson. Nothing here paints a pixel (rule 108a): every feature is a shape the rig's one sun falls across.

THE HEAD (metres, the body's own frame before the rig scales it to 1.72 m; front is -y, up is +z):
  * THE SKULL: an ellipsoid 0.32 wide, 0.33 deep, 0.356 tall (a clay head, big for the body the way the rig page asks:
    the live man is 5.4 heads), the jaw tapering 30 percent to the chin, the nape pulled in to the neck.
  * THE FEATURES, each a measured bump or dent pushed forward on the face only: the brow ridge 14 mm over two eye
    sockets 22 mm deep, the nose growing from the bridge to a 32 mm tip with two nostril wings, the cheekbones 10 mm,
    the hollow under them, the upper and lower lip 10 and 11 mm, the philtrum, the chin 14 mm.
  * THE MOUTH IS A LINE THAT OPENS: the faces that straddle the mouth line are the inside of the mouth (a dark
    material); closed they are a one-pixel line between the lips, and when the jaw turns they stretch into the open
    mouth and fold back 15 mm into the head. That is the speak-along mouth on the rig's face.
  * THE EYES: two eyeballs 33 mm across sitting in the sockets, the white an off-bone (his 9/24: 'I like the eyes not
    being all white, less of a frog'), a big dark iris and a pupil; an upper and a lower lid as shells over them.
  * THE EARS, THE NECK: two flattened ears at the sides; a neck down into the collar (its own mesh, so the rig measures
    the head from chin to crown, not to the collar).
  * THE KIT, per person, every piece geometry on the head bone: the thug wears a knit cap (ribbed, a folded brim,
    the oxblood accent above the waist), a buzz at the sides and back, stubble on the jaw.
  * THE SHAPE KEYS (the rig's --expression renders the same head once per key, front-on): A, E, O, M (the four mouth
    shapes the speak-along needs: open, wide, round, closed) and Angry, Sad, Surprised (the brows, the lids, the mouth
    corners, the jaw), and Blink on the lids.

THE BODY: COOK THREE's thug (records/cook3/rig/thug.glb, built from the rig's man). The box head and its cap are
taken off above the collar and this head goes on the SAME head bone (Skeleton_neck_joint_2), so the body stills and
the portrait are one model. COOK THREE's file is read, never written; the output is this lane's own glb.

Run with Blender's Python (bpy 4.2; see tools/bohemia_direction_master_rig.py):
    v/bin/python tools/bohemia_portrait_the_head_from_the_model.py THUG records/portrait/rig/thug_head.glb
then the rig (unedited), then the sheet (plain python3):
    v/bin/python tools/bohemia_direction_master_rig.py records/portrait/rig/thug_head.glb records/target/portrait/rig/thug \
        --real-height 1.72 --family none --wear 0.6 --still pass --portrait 128 --class portrait \
        --expression A --expression E --expression O --expression M --expression Angry --expression Sad --expression Surprised
    python3 tools/bohemia_portrait_the_head_from_the_model.py --sheet THUG records/target/portrait/rig/thug records/target/portrait/PORTRAIT_THE_FACE_FROM_THE_SAME_MODEL.png

REUSE CHECK: the body, its bones, its gambeson, belt and pipe are COOK THREE's thug (from the rig's man), reused whole;
the render is DIRECTION's master rig, unedited, with its --portrait and --expression legs; the skin and the oxblood are
COOK THREE's thug colours; nothing new is drawn by hand.

REFERENCE CHECK (the 9/4 standing duty): the compare law; the twin is the game's own shipping face of the same person
(records/target/taste/portrait_heads/brigand-thug.png, faceFor()/renderFace() at 64 px) and the thug's own body
through the rig (COOK THREE, records/target/cook3/rig/thug/); the rig's card of numbers; analog horror AH-01.
No reference game.
"""
import os, sys, json, math

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HEAD_BONE = 'Skeleton_neck_joint_2'
NECK_BONE = 'Skeleton_neck_joint_1'


def lin(c):
    """an sRGB 0..255 colour to the renderer's linear 0..1"""
    f = lambda v: (v / 255.0) / 12.92 if v / 255.0 <= 0.04045 else ((v / 255.0 + 0.055) / 1.055) ** 2.4
    return (f(c[0]), f(c[1]), f(c[2]), 1.0)


# COOK THREE's thug colours (tools/bohemia_cook3_the_tiers_through_the_rig.py), and the face's own few
SKIN = (150, 112, 88)
STUBBLE = (128, 100, 86)     # the jaw a step cooler and lower than the skin (a hue walk, not a darkening)
BUZZ = (46, 38, 32)
LIPS = (138, 92, 78)
MOUTH = (44, 22, 20)        # the inside of the mouth
SCLERA = (188, 174, 152)    # an off-bone, never white (his 9/24)
IRIS = (66, 46, 34)
PUPIL = (18, 14, 12)
OXBLOOD = (74, 28, 24)

PEOPLE = {
    'THUG': dict(body='records/cook3/rig/thug.glb', drop=('thug_cap', 'thug_cap_brim'), cut_z=1.165,
                 centre=(0.0, 0.004, 1.352), radii=(0.160, 0.165, 0.178),
                 gear='knit cap', hair='buzz', stubble=True, twin='records/target/taste/portrait_heads/brigand-thug.png',
                 cook3='records/target/cook3/rig/thug', sheet_out='records/target/portrait/PORTRAIT_THE_FACE_FROM_THE_SAME_MODEL.png',
                 palette="COOK THREE's thug colours, the cap his own blood 1 step",
                 kit='the knit cap ribbed with a folded brim',
                 # round 2: the cap is COOK THREE's own step (blood 1) on the same body, not round 1's off-palette oxblood,
                 # which read the head's top 10.9 values under its bottom (the guide's light row, D3) at SE
                 colours=dict(gear=('blood', 1))),
    # round 2: COOK THREE's poacher. His colours are steps of the style palette (field 5), read from COOK THREE's own
    # tier table; the face's few are steps too. The game's own poacher face has black curls out from under his head
    # gear and no beard, so the head keeps that: curls at the sides and the back, the field hat over them.
    'POACHER': dict(body='records/cook3/rig/poacher.glb', drop=('poacher_hat',), cut_z=1.165,
                    centre=(0.0, 0.004, 1.352), radii=(0.160, 0.165, 0.178),
                    gear='field hat', hair='curls', stubble=False, twin='records/target/taste/portrait_heads/brigand-poacher.png',
                    cook3='records/target/cook3/rig/poacher', sheet_out='records/target/portrait/PORTRAIT_THE_POACHERS_FACE_FROM_THE_SAME_MODEL.png',
                    palette='steps of the style palette (skin_deep 3, cloth_black 1, tape_masking 2: COOK THREE\'s poacher)',
                    kit='the field hat worn pushed back, a dark band, black curls out from under it at the sides and the back',
                    colours=dict(skin=('skin_deep', 3), lips=('skin_deep', 2), hair=('cloth_black', 1), gear=('tape_masking', 2),
                                 iris=('skin_deep', 1))),
}


# [every face from the same model] (rule 115h, HIS FIRST STAR on the poacher's face): the starred recipe on the thirteen
# faces RUN TWO's crew and scavenge screens show (YOU and the twelve cast looks the roster hands out, engine/bohemia_roster.js
# manOf). None of them had a model, so each BODY is built by CHARACTER's own tool from the look's worn list
# (tools/bohemia_character_the_thirteen_through_the_rig.py, imported, never edited: a LOOKS entry is added in memory and its
# build() runs), and the head goes on that body's head bone exactly as the poacher's did. Skin is the person's own skin
# from the game's 64 px face (sampled, then a step of the style palette, two steps lighter than the sample on the deep
# skins because the rig's one sun and the dust pass take about two steps off a face); hair cut and head gear are the
# look's worn list (fight_people.json); colours of the cloth are the worn names read as palette colours.
# body keys are CHARACTER's spec (shirt, coat, mantle, cape, trousers, shoes); hair/gear are this tool's head pieces.
CREW = {
    'YOU': dict(look='you', name='YOU', skin=('skin_light', 3), lips=('skin_light', 2), hair='long', hair_c=('clay_bone', 4), gear=None,
                iris=('clay_teal', 2), worn='the player as he stands: platinum hair, black leather jacket over a black longsleeve',
                body=dict(shirt=dict(colour=(30, 28, 28), sleeve='long'), coat=dict(colour=(26, 24, 24), hem='HIP', flare=0.01, thick=0.014, v=0.05, front_open=0.35))),
    # (cycle 2, the NOT VIBE CODED light row, D3: a near-black top over a paler shirt read as lit from below on 5 of 39
    # renders; the four tops lifted one step, as the thug's cap was in round 2)
    'CAST_LONGCOAT': dict(look='cast_longcoat', skin=('skin_deep', 2), hair='taper', hair_c=('cloth_black', 2), gear=None,
                          body=dict(shirt=dict(colour=(36, 34, 34), sleeve='long'), coat=dict(colour=(92, 78, 60), hem='ANKLE', flare=0.05, thick=0.016, v=0.06, front_open=0.5, back_slit=0.45))),
    'CAST_BAREARMS': dict(look='cast_barearms', skin=('skin_deep', 2), hair='coil', hair_c=('cloth_black', 1), gear=None,
                          body=dict(shirt=dict(colour=(48, 46, 44), sleeve='none'))),
    'CAST_PACK': dict(look='cast_pack', skin=('skin_deep', 2), hair='taper', hair_c=('tape_masking', 0), gear='knit cap', gear_c=('tape_grey', 1),
                      body=dict(shirt=dict(colour=(84, 88, 60), sleeve='long'), mantle=dict(colour=(73, 78, 54), low=0.88))),
    'CAST_SKIRT': dict(look='cast_skirt', skin=('skin_mid', 2), hair='long', hair_c=('tape_masking', 1), gear=None,
                       body=dict(shirt=dict(colour=(184, 176, 156), sleeve='short'))),
    'CAST_WIDEBRIM': dict(look='cast_widebrim', skin=('skin_deep', 2), hair='taper', hair_c=('tape_grey', 2), gear='cone hat', gear_c=('tape_masking', 2),
                          body=dict(shirt=dict(colour=(118, 100, 74), sleeve='long'))),
    'CAST_CAPE': dict(look='cast_cape', skin=('skin_deep', 3), hair='shag', hair_c=('tape_grey', 2), gear=None,
                      body=dict(shirt=dict(colour=(184, 168, 134), sleeve='long'), cape=dict(colour=(66, 62, 58), hem='KNEE', top=1.12))),
    'CAST_APRON': dict(look='cast_apron', skin=('skin_deep', 3), hair='taper', hair_c=('tape_grey', 1), gear=None,
                       body=dict(shirt=dict(colour=(150, 80, 48), sleeve='long'))),
    'CAST_PONCHO': dict(look='cast_poncho', skin=('skin_mid', 2), hair='long', hair_c=('tape_grey', 2), gear=None,
                        body=dict(shirt=dict(colour=(48, 46, 44), sleeve='none'), mantle=dict(colour=(104, 40, 36), low=0.78, thick=0.03))),
    'CAST_BEDROLL': dict(look='cast_bedroll', skin=('skin_mid', 1), hair='taper', hair_c=('tape_masking', 0), gear='work cap', gear_c=('tape_masking', 1),
                         body=dict(shirt=dict(colour=(118, 100, 74), sleeve='long'))),
    'CAST_SHORTS': dict(look='cast_shorts', skin=('skin_deep', 3), hair='coil', hair_c=('tape_masking', 2), gear=None,
                        body=dict(shirt=dict(colour=(184, 176, 156), sleeve='short'))),
    'CAST_SATCHEL': dict(look='cast_satchel', skin=('skin_deep', 2), hair='taper', hair_c=('clay_rust', 1), gear='watch cap', gear_c=('cloth_black', 3),
                         body=dict(shirt=dict(colour=(84, 88, 60), sleeve='long'))),
    # (cycle 1: skin_mid 1 under a clay_rust 1 beanie and orange hair read as one red-brown lump; a step lighter skin and the
    # beanie a deep oxblood, clay_rust 1 (blood 0 failed the light row at SE, cycle 2), part the three)
    'CAST_SHORTCOAT': dict(look='cast_shortcoat', skin=('skin_mid', 2), hair='long', hair_c=('clay_rust', 2), gear='slouch beanie', gear_c=('clay_rust', 1),
                           body=dict(shirt=dict(colour=(30, 28, 28), sleeve='long'), coat=dict(colour=(70, 48, 38), hem='HIP', flare=0.01, thick=0.016, v=0.05, front_open=0.4))),
}
CREW_BODIES = 'records/portrait/rig/crew/bodies'
for _k, _c in CREW.items():
    _tag = 'crew_' + _c['look']
    PEOPLE[_k] = dict(body='%s/%s.glb' % (CREW_BODIES, _tag), drop=tuple('%s_%s' % (_tag, x) for x in ('hair', 'hair_fall', 'hat', 'hat_brim', 'visor')),
                      cut_z=1.165, centre=(0.0, 0.004, 1.352), radii=(0.160, 0.165, 0.178),
                      gear=_c['gear'], hair=_c['hair'], stubble=False, look=_c['look'], crew=True,
                      twin='slices/fight_people/%s.webp' % _c['look'], twin_face=True,
                      palette='steps of the style palette (skin %s %d, hair %s %d%s)' % (_c['skin'] + _c['hair_c'] + ((', gear %s %d' % _c['gear_c']) if _c.get('gear') else '',)),
                      kit='%s; %s' % (_c['gear'] or 'bare head', {'long': 'a long cut to the jaw', 'taper': 'a short taper', 'coil': 'a coil crown', 'shag': 'a choppy shag'}[_c['hair']]),
                      colours=dict(skin=_c['skin'], lips=_c.get('lips', (_c['skin'][0], max(0, _c['skin'][1] - 1))), hair=_c['hair_c'],
                                   gear=_c.get('gear_c', _c['hair_c']), iris=_c.get('iris', ('skin_deep', 1)),
                                   stubble=(_c['skin'][0], max(0, _c['skin'][1] - 1))))


# [every face from the same model] ROUND 2, THE SPEAKERS' FACES (RUN TWO [every speaker has a face]; his notes 'can these people
# start getting portraits when you click and talk to them', 'why can't all our characters that are speaking to us have a
# portrait'): the settlement's street draws its people from all 25 looks (slices/settlement_people/settlement_people.json),
# and the thirteen FACTION looks had no fresh portrait, so anybody in a gang's colours spoke through the old painted 64.
# Each head goes on THAT GANG'S OWN BODY, the one he voted up (character-the-thirteen-through-the-rig-10-18), built by
# CHARACTER's tool from its own LOOKS entry (imported, never edited), so the face and the gang on the map are one model.
# Cut, head gear and colours read off each look's worn list (the colours as style palette steps); skin from the game's
# own face of that gang (by eye, then the crew's rule: two steps lighter on a deep skin, the rig's sun takes about two);
# and since these are the first heads with DIALS, no two share a skull: each gets a face shape that says who it is.
FACTION = {
    'Caravans':   dict(skin=('skin_deep', 2), hair='coil', hair_c=('tape_grey', 1), gear='cone hat', gear_c=('tape_masking', 1), beard='full',
                       face={'face.cheekW': 34, 'face.jawW': 30, 'face.foreheadW': 26, 'face.len': 34, 'face.chinW': 14, 'nose.w': 4},
                       worn='COIL CROWN under the CHINESE RICE FARMER HAT; a grey full beard: the trader who has walked every road'),
    'Colorful':   dict(skin=('skin_mid', 2), hair='shag', hair_c=('tape_masking', 0), gear='knit cap', gear_c=('blood', 1),
                       face={'face.len': 30, 'face.cheekW': 28, 'face.jawW': 23, 'face.chinW': 10, 'eyes.gap': 7, 'mouth.w': 8, 'face.craniumH': 11},
                       worn='SHAG under the ROSE KNIT CAP'),
    'Anarchists': dict(skin=('skin_deep', 2), hair='fall', hair_c=('cloth_black', 2), gear='watch cap', gear_c=('cloth_black', 3), scar='brow',
                       face={'face.len': 38, 'face.cheekW': 27, 'face.jawW': 22, 'face.foreheadW': 22, 'face.chinW': 9, 'nose.w': 2, 'eyes.gap': 5, 'face.craniumH': 12},
                       worn='LAYERED FALL under the CHARCOAL WATCH CAP; a scar splits the left brow'),
    'Blues':      dict(skin=('skin_deep', 2), hair='taper', hair_c=('cloth_black', 1), gear=None, beard='moustache',
                       face={'face.cheekW': 34, 'face.jawW': 31, 'face.chinW': 16, 'face.foreheadW': 27, 'brows.len': 9, 'mouth.w': 11},
                       worn='DRY TAPER, bare head; a moustache'),
    'Homeless':   dict(skin=('skin_mid', 2), hair='fall', hair_c=('tape_masking', 1), gear=None, beard='full',
                       face={'face.len': 35, 'face.cheekW': 29, 'face.jawW': 24, 'face.chinW': 11, 'face.eyeY': 1, 'nose.w': 4, 'face.craniumH': 9},
                       worn='LAYERED FALL, bare head; a beard grown out the same sand as the hair'),
    'Church':     dict(skin=('skin_light', 3), lips=('skin_light', 2), hair='coil', hair_c=('cloth_black', 1), gear='skull cap', gear_c=('clay_bone', 2),
                       face={'face.len': 37, 'face.foreheadW': 27, 'face.cheekW': 30, 'face.jawW': 24, 'face.chinW': 10, 'face.craniumH': 13, 'eyes.gap': 5},
                       worn='COIL CROWN under the BONE KNIT CAP, worn as a skull cap'),
    'Reds':       dict(skin=('skin_mid', 2), hair='taper', hair_c=('cloth_black', 1), gear=None, beard='goatee',
                       face={'face.len': 34, 'face.cheekW': 31, 'face.jawW': 28, 'face.chinW': 15, 'face.browY': -1, 'mouth.w': 10},
                       worn='DRY TAPER, bare head; a goatee'),
    'Cartel':     dict(skin=('skin_mid', 1), hair='taper', hair_c=('cloth_black', 1), gear='watch cap', gear_c=('cloth_black', 3), beard='moustache',
                       face={'face.len': 31, 'face.cheekW': 32, 'face.jawW': 29, 'face.chinW': 13, 'eyes.gap': 7, 'brows.len': 9, 'face.mouthY': 1},
                       worn='DRY TAPER under the CHARCOAL WATCH CAP; a moustache'),
    'Trades':     dict(skin=('skin_deep', 3), hair='taper', hair_c=('cloth_black', 1), gear='work cap', gear_c=('tape_masking', 1), beard='stubble',
                       face={'face.cheekW': 35, 'face.jawW': 32, 'face.chinW': 17, 'face.foreheadW': 28, 'face.len': 32, 'nose.w': 5, 'mouth.w': 11},
                       worn='TEMPLE TAPER under the DUST WORK CAP; stubble'),
    'Mob':        dict(skin=('skin_light', 2), lips=('skin_light', 1), hair='slick', hair_c=('cloth_black', 1), gear=None, scar='cheek',
                       face={'face.len': 36, 'face.cheekW': 30, 'face.jawW': 27, 'face.chinW': 14, 'face.foreheadW': 25, 'eyes.gap': 5, 'nose.w': 2, 'face.browY': 1},
                       worn='slicked back (CHARACTER\'s cut for the Mob), bare head; a scar across the right cheek'),
    'Network':    dict(skin=('skin_deep', 2), hair='taper', hair_c=('cloth_black', 1), gear=None,
                       face={'face.len': 35, 'face.cheekW': 29, 'face.jawW': 25, 'face.chinW': 11, 'face.foreheadW': 25, 'eyes.gap': 7, 'mouth.w': 8, 'face.craniumH': 11},
                       worn='TEMPLE TAPER, bare head'),
    'Volunteers': dict(skin=('skin_deep', 3), hair='fringe', hair_c=('cloth_black', 1), gear=None,
                       face={'face.len': 30, 'face.cheekW': 28, 'face.jawW': 22, 'face.chinW': 9, 'face.craniumH': 11, 'mouth.w': 7},
                       worn='HEAVY FRINGE, bare head'),
    'Remnants':   dict(skin=('skin_mid', 2), hair='taper', hair_c=('cloth_black', 1), gear='knit cap', gear_c=('tape_grey', 1), beard='stubble',
                       face={'face.cheekW': 36, 'face.jawW': 33, 'face.chinW': 18, 'face.len': 34, 'face.foreheadW': 28, 'brows.len': 10, 'face.noseY': 1},
                       worn='TEMPLE TAPER under the STORM KNIT CAP; stubble'),
}
FACTION_BODIES = 'records/portrait/rig/crew/bodies'
CUT_NAME = {'long': 'a long cut to the jaw', 'taper': 'a short taper', 'coil': 'a coil crown', 'shag': 'a choppy shag',
            'fall': 'a layered fall past the jaw', 'slick': 'slicked straight back', 'fringe': 'a heavy fringe to the brow'}
for _k, _c in FACTION.items():
    _tag = _k.lower()
    PEOPLE['FACTION_' + _k.upper()] = dict(
        body='%s/%s.glb' % (FACTION_BODIES, _tag), drop=tuple('%s_%s' % (_tag, x) for x in ('hair', 'hair_fall', 'hat', 'hat_brim', 'visor')),
        cut_z=1.165, centre=(0.0, 0.004, 1.352), radii=(0.160, 0.165, 0.178),
        gear=_c['gear'], hair=_c['hair'], stubble=False, beard=_c.get('beard'), scar=_c.get('scar'), face=_c['face'],
        look='faction_' + _tag, crew=True, faction=_k, twin='slices/fight_people/faction_%s.webp' % _tag, twin_face=True,
        palette='steps of the style palette (skin %s %d, hair %s %d%s)' % (_c['skin'] + _c['hair_c'] + ((', gear %s %d' % _c['gear_c']) if _c.get('gear') else '',)),
        kit='%s; %s' % (_c['gear'] or 'bare head', CUT_NAME[_c['hair']]),
        colours=dict(skin=_c['skin'], lips=_c.get('lips', (_c['skin'][0], max(0, _c['skin'][1] - 1))), hair=_c['hair_c'],
                     gear=_c.get('gear_c', _c['hair_c']), iris=('skin_deep', 1), stubble=(_c['skin'][0], max(0, _c['skin'][1] - 1))))


# [the starred face, customisable]: SIX FACES BUILT WITH THE CONTROLS, all on the player's own body (YOU), the same head:
# the fourteen dials, a skin from the palette, a cut from the library and one of the face maker's 21 hair colours (his own
# swatches, HAIR_COLORS in the alpha, by name), head gear, a scar and facial hair as parts. Nothing here is new art: each
# is a setting of the same model, which is the whole of rule 115(a) (everything from one source looks the same).
HAIR_COLORS = dict(jet=(26, 28, 40), black=(32, 30, 27), ash=(70, 66, 62), brown=(82, 58, 38), auburn=(104, 44, 30), ginger=(158, 80, 28),
                   rust=(124, 58, 34), sand=(150, 120, 80), platinum=(196, 178, 132), bleach=(210, 202, 178), steel=(112, 112, 116),
                   grey=(104, 104, 112), white=(186, 186, 194), acid=(110, 164, 52), moss=(98, 104, 54), magenta=(142, 32, 92),
                   teal=(26, 110, 108), violet=(84, 52, 134), pink=(196, 150, 150), red=(200, 60, 40))
MAKER = [
    dict(name='LONG FACE, PLATINUM', skin=('skin_light', 3), hair='taper', hair_colour='platinum', gear=None, scar='brow',
         face={'face.len': 39, 'face.cheekW': 27, 'face.jawW': 23, 'face.chinW': 9, 'face.foreheadW': 23, 'nose.w': 2, 'face.craniumH': 12}),
    dict(name='BROAD, FULL BEARD', skin=('skin_deep', 3), hair='coil', hair_colour='black', gear=None, beard='full',
         face={'face.len': 30, 'face.cheekW': 36, 'face.jawW': 32, 'face.chinW': 16, 'face.foreheadW': 28, 'brows.len': 10, 'mouth.w': 11}),
    dict(name='HEAVY FRINGE, MAGENTA', skin=('skin_mid', 3), hair='fringe', hair_colour='magenta', gear=None,
         face={'face.len': 32, 'face.cheekW': 29, 'face.jawW': 24, 'eyes.gap': 8, 'mouth.w': 7, 'nose.w': 2, 'face.chinW': 10}),
    dict(name='SLICKED, GINGER MOUSTACHE', skin=('skin_light', 2), hair='slick', hair_colour='ginger', gear=None, beard='moustache',
         face={'face.len': 35, 'face.cheekW': 31, 'face.jawW': 28, 'face.chinW': 14, 'face.browY': -2, 'eyes.gap': 5}),
    dict(name='WATCH CAP, GREY FALL, GOATEE', skin=('skin_mid', 2), hair='fall', hair_colour='grey', gear='watch cap', gear_c=('clay_teal', 1), beard='goatee',
         face={'face.len': 34, 'face.cheekW': 30, 'face.jawW': 26, 'face.mouthY': 1, 'face.noseY': 1, 'brows.len': 5}),
    dict(name='FIELD HAT, AUBURN SHAG, SCARRED', skin=('skin_deep', 2), hair='shag', hair_colour='auburn', gear='field hat', gear_c=('tape_masking', 2), scar='cheek',
         face={'face.len': 36, 'face.jawW': 30, 'face.cheekW': 33, 'face.eyeY': -1, 'nose.w': 4, 'face.chinW': 15}),
]
for _i, _c in enumerate(MAKER):
    PEOPLE['MAKER_%d' % (_i + 1)] = dict(
        body='%s/crew_you.glb' % CREW_BODIES, drop=tuple('crew_you_%s' % x for x in ('hair', 'hair_fall', 'hat', 'hat_brim', 'visor')),
        cut_z=1.165, centre=(0.0, 0.004, 1.352), radii=(0.160, 0.165, 0.178),
        gear=_c['gear'], hair=_c['hair'], stubble=False, beard=_c.get('beard'), scar=_c.get('scar'), face=_c['face'], crew=True, maker=_c['name'],
        twin='slices/fight_people/you.webp', twin_face=True,
        palette='skin %s %d, hair the face maker\'s %s%s' % (_c['skin'] + (_c['hair_colour'], (', gear %s %d' % _c['gear_c']) if _c.get('gear') else '')),
        kit='%s; %s' % (_c['gear'] or 'bare head', CUT_NAME[_c['hair']]),
        colours=dict(skin=_c['skin'], lips=(_c['skin'][0], max(0, _c['skin'][1] - 1)), hair=HAIR_COLORS[_c['hair_colour']],
                     gear=_c.get('gear_c', HAIR_COLORS[_c['hair_colour']]), iris=('skin_deep', 1), stubble=(_c['skin'][0], max(0, _c['skin'][1] - 1))))


def faction_body(name, outdir):
    """CHARACTER's tool builds the gang's own body from its own LOOKS entry, as he voted it up (nothing added, never written)"""
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_character_the_thirteen_through_the_rig as CH
    CH.build(name, os.path.join(ROOT, outdir))


def crew_body(who, outdir):
    """CHARACTER's tool builds the look's body (its LOOKS gains this entry in memory; its file is never written)"""
    sys.path.insert(0, os.path.join(ROOT, 'tools'))
    import bohemia_character_the_thirteen_through_the_rig as CH
    c = CREW[who]; spec = {}
    for k, v in c['body'].items():
        v = dict(v)
        if isinstance(v.get('hem'), str): v['hem'] = getattr(CH, v['hem'])
        spec[k] = v
    spec.setdefault('trousers', dict(colour=(40, 38, 38), wide=0.012)); spec.setdefault('shoes', dict(colour=(40, 36, 34), kind='boot', top=0.2))
    name = 'crew_' + c['look']
    CH.LOOKS[name] = dict(order=99, shape='crew: ' + c['look'], dials=dict(height=0.0, belly=0.0, shoulders=0.0, hips=0.0),
                          worn=c.get('worn', c['look']), hair=dict(style='taper', colour=CH.HAIR_DARK), **spec)
    CH.build(name, os.path.join(ROOT, outdir))


def palette_step(role, i):
    """a step of a role's ramp in the style palette (records/target/BOHEMIA_STYLE_PALETTE.json, field 5)"""
    h = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')))['roles'][role]['ramp'][i].lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))


def colours(P):
    """the person's face colours: the thug's round-one constants, or a person's palette steps"""
    c = dict(skin=SKIN, stubble=STUBBLE, hair=BUZZ, lips=LIPS, gear=OXBLOOD, iris=IRIS)
    for k, v in P.get('colours', {}).items():
        # a palette step (role, i), or an RGB the player chose (the face maker's 21 hair colours are his, not the palette's)
        c[k] = tuple(v) if len(v) == 3 and all(isinstance(x, int) for x in v) else palette_step(*v)
    c.setdefault('beard', c['hair'])
    sk = P.get('colours', {}).get('skin')
    # a seam heals paler: two steps (round 16: one step on a light skin vanished at 128 px)
    c['scar'] = palette_step(sk[0], min(4, sk[1] + 2)) if sk and len(sk) == 2 else tuple(min(255, x + 40) for x in c['skin'])
    return c

MOUTH_Z = -0.089     # the mouth line, metres from the head's centre
MOUTH_HALF = 0.033   # half the mouth's width (a build sets it from the face's mouth.w dial; 0.033 at the default)
EYE_X, EYE_Z, EYE_R = 0.047, 0.004, 0.0165


# [the starred face, customisable] (Paolo 10/18: 'You got my starred portrait shit I was impressed with? We can customise
# that shit?'; HE CAN BUILD HIS OWN FACE carried onto the modelled head). THE FACE MAKER'S FOURTEEN SHAPE CONTROLS drive the
# skull: the same keys, labels and ranges as the alpha's FACE_SLIDERS (slices/BOHEMIA_ALPHA_0_9.html), in the 64 px face's
# pixels, so CHARACTER wires the panel it already has to this head with no new vocabulary. The last number is the value
# that leaves the starred head EXACTLY as it was (the poacher, the thug and the crew's thirteen are all the default face).
# The four heights are offsets from where the anatomy puts the feature (the 2D panel's 0,0 means 'derived'), + is lower,
# as on the 64 px face, where a row counts down.
FACE_DIALS = [
    ('face.len',       'FACE LENGTH',  28, 40, 33),
    ('face.craniumH',  'CRANIUM',       7, 15, 10),
    ('face.foreheadW', 'FOREHEAD',     19, 31, 24),
    ('face.cheekW',    'CHEEKS',       24, 38, 30),
    ('face.jawW',      'JAW',          20, 34, 26),
    ('face.chinW',     'CHIN',          7, 20, 12),
    ('face.browY',     'BROW HEIGHT',  -3,  3, 0),
    ('face.eyeY',      'EYE HEIGHT',   -3,  3, 0),
    ('face.noseY',     'NOSE HEIGHT',  -3,  3, 0),
    ('face.mouthY',    'MOUTH HEIGHT', -3,  3, 0),
    ('eyes.gap',       'EYE SPACING',   3, 11, 6),
    ('brows.len',      'BROW LENGTH',   4, 11, 7),
    ('mouth.w',        'MOUTH WIDTH',   5, 15, 9),
    ('nose.w',         'NOSE WIDTH',    2,  5, 3),
]
def _hash(*n):
    """a repeatable 0..1 from integers (the noise's lattice), so the same person always grows the same hair"""
    h = 2166136261
    for x in n: h = ((h ^ (x & 0xffffffff)) * 16777619) & 0xffffffff
    h ^= h >> 15; h = (h * 2246822519) & 0xffffffff; h ^= h >> 13
    return (h & 0xffffff) / float(0xffffff)


def vnoise(x, y, z=0.0, seed=0):
    """smooth value noise: hashed lattice values eased between, 0..1"""
    i, j, k = math.floor(x), math.floor(y), math.floor(z); fx, fy, fz = x - i, y - j, z - k
    u, w, q = fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy), fz * fz * (3 - 2 * fz)
    def L(a, b, t): return a + (b - a) * t
    c = [[[_hash(i + a, j + b, k + e, seed) for e in (0, 1)] for b in (0, 1)] for a in (0, 1)]
    return L(L(L(c[0][0][0], c[1][0][0], u), L(c[0][1][0], c[1][1][0], u), w), L(L(c[0][0][1], c[1][0][1], u), L(c[0][1][1], c[1][1][1], u), w), q)


def locks(u, v, width, seed):
    """the height (0..1) of hair at u across the way it falls and v along it: locks about `width` wide whose edges wander
    as they run, each its own height, a parting between two"""
    q = u / width + 0.45 * vnoise(u / (width * 2.3), v / 0.06, seed=seed) + 0.30 * vnoise(v / 0.045, 0.5, seed=seed + 1)
    cell = math.floor(q); f = q - cell
    return (0.55 + 0.45 * _hash(cell, seed)) * math.sin(math.pi * f) ** 0.7


FACE_PX = 0.0083   # one pixel of the 64 px face, in metres of this head (0.356 m crown to chin over craniumH + len = 43 px)
FD = None          # the resolved dials of the head being built (None: the starred default, nothing moves)


def face_dials(spec=None, radii=(0.160, 0.165, 0.178)):
    """a face spec (any of FACE_DIALS' keys) to what the head does: ratios, metres. THE ANATOMY IS MINE, THE FACE IS HIS:
    the 2D panel's own clamps first (the cheeks the widest part, the jaw under them, the chin under the jaw, the mouth inside
    the jaw), then every move damped so a dial at its end still makes a head, and every band's shift held under 0.6 of its
    width so the skin never folds over itself"""
    v = {k: d for k, _, lo, hi, d in FACE_DIALS}
    rng = {k: (lo, hi) for k, _, lo, hi, d in FACE_DIALS}
    for k, x in (spec or {}).items():
        if k in rng: v[k] = max(rng[k][0], min(rng[k][1], x))
    v['face.cheekW'] = max(v['face.cheekW'], v['face.foreheadW'] + 2)
    v['face.jawW'] = min(v['face.jawW'], v['face.cheekW'] - 1)
    v['face.chinW'] = min(v['face.chinW'], v['face.jawW'] - 6)
    v['mouth.w'] = max(5, min(v['face.jawW'] - 8, v['mouth.w']))
    RX, RY, RZ = radii
    cl = lambda x, m: max(-m, min(m, x))
    ratio = lambda k, d, damp: 1.0 + damp * (v[k] - d) / float(d)
    F = dict(v=v, RX=RX, RY=RY, RZ=RZ,
             forehead=ratio('face.foreheadW', 24, 0.7), cheek=ratio('face.cheekW', 30, 0.7), jaw=ratio('face.jawW', 26, 0.7),
             chin=ratio('face.chinW', 12, 0.45),
             up=1.0 + 0.7 * (v['face.craniumH'] - 10) * FACE_PX / RZ, down=1.0 + 0.7 * (v['face.len'] - 33) * FACE_PX / RZ,
             # a + dial is lower on the face; z is up here
             brow_dz=cl(-v['face.browY'] * FACE_PX * 0.7, 0.6 * 0.025), eye_dz=cl(-v['face.eyeY'] * FACE_PX * 0.7, 0.6 * 0.022),
             nose_dz=cl(-v['face.noseY'] * FACE_PX * 0.7, 0.6 * 0.030), mouth_dz=cl(-v['face.mouthY'] * FACE_PX * 0.7, 0.6 * 0.024),
             eye_dx=cl((v['eyes.gap'] - 6) * 0.0035, 0.6 * 0.030),
             brow_len=ratio('brows.len', 7, 0.6), mouth=ratio('mouth.w', 9, 0.6), nose=ratio('nose.w', 3, 0.5))
    F['identity'] = all(v[k] == d for k, _, lo, hi, d in FACE_DIALS)
    return F


def width_at(z):
    """the face's width ratio at height z: the forehead's above the brow, the cheeks' at the cheekbone, the jaw's at its
    corner, the chin's under it, eased between"""
    F = FD
    pts = [(0.100, F['forehead']), (-0.024, F['cheek']), (-0.105, F['jaw']), (-0.150, F['chin'])]
    if z >= pts[0][0]: return pts[0][1]
    for (z0, a), (z1, b) in zip(pts, pts[1:]):
        if z >= z1: return a + (b - a) * sstep(z0, z1, z)
    return pts[-1][1]


def warp(x, y, z):
    """THE DIALS ON THE MODEL: a point of the starred head (head-local metres) to the same point on this face. Bands on the
    front of the face move the brow, the eyes, the nose and the mouth up and down and the eyes apart; then the face's widths
    by height; then the cranium and the face's length (the neck below the chin stays in its collar)"""
    F = FD
    front = sstep(0.0, 0.6, -y / F['RY'])
    ax = abs(x)
    dz = front * (F['brow_dz'] * g2(ax, z, 0.045, 0.034, 0.050, 0.025)
                  + F['eye_dz'] * g2(ax, z, EYE_X, EYE_Z, 0.035, 0.022)
                  + F['nose_dz'] * g2(x, z, 0.0, -0.025, 0.025, 0.030)
                  + F['mouth_dz'] * g2(x, z, 0.0, MOUTH_Z, 0.050, 0.024))
    dx = math.copysign(F['eye_dx'] * front * g2(ax, z, EYE_X, EYE_Z, 0.030, 0.024), x) if x else 0.0
    nx = (x + dx) * width_at(z)
    z1 = z + dz; RZ = F['RZ']
    if z1 > 0: nz = z1 * F['up']
    elif z1 > -RZ: nz = z1 * F['down']
    else: nz = z1 + (F['down'] - 1.0) * (-RZ) * sstep(-RZ - 0.08, -RZ, z1)
    return nx, y, nz


def g2(x, z, x0, z0, sx, sz):
    return math.exp(-((x - x0) / sx) ** 2 - ((z - z0) / sz) ** 2)


def sstep(a, b, t):
    t = max(0.0, min(1.0, (t - a) / (b - a)))
    return t * t * (3 - 2 * t)


def face_push(x, z):
    """how far forward (metres) the face stands at (x, z) relative to the head's centre: the features as shapes"""
    ax = abs(x)
    # the dials that change a feature's own width (1.0 each on the starred default)
    bl, nw, mw, cw = (FD['brow_len'], FD['nose'], FD['mouth'], FD['chin']) if FD else (1.0, 1.0, 1.0, 1.0)
    d = 0.0
    d += 0.014 * g2(ax, z, 0.045, 0.034, 0.042 * bl, 0.014)               # the brow ridge
    d -= 0.022 * g2(ax, z, EYE_X, EYE_Z, 0.024, 0.017)                    # the eye sockets
    t = max(0.0, min(1.0, (0.022 - z) / 0.072))                            # the nose: bridge to tip
    nose = 0.032 * t ** 1.25 * math.exp(-(x / ((0.010 + 0.011 * t) * nw)) ** 2)
    if z < -0.050: nose *= math.exp(-((z + 0.050) / 0.007) ** 2)
    d += nose
    d += 0.010 * g2(ax, z, 0.018 * nw, -0.047, 0.010, 0.008)              # the nostril wings
    d += 0.010 * g2(ax, z, 0.074, -0.024, 0.030, 0.026)                   # the cheekbones
    d -= 0.006 * g2(ax, z, 0.066, -0.078, 0.024, 0.024)                   # the hollow under them
    d -= 0.003 * g2(x, z, 0.0, -0.068, 0.006, 0.009)                      # the philtrum
    d += 0.010 * g2(x, z, 0.0, -0.080, 0.032 * mw, 0.009)                 # the upper lip
    d += 0.011 * g2(x, z, 0.0, -0.099, 0.028 * mw, 0.009)                 # the lower lip
    d -= 0.005 * g2(x, z, 0.0, MOUTH_Z, 0.031 * mw, 0.004)                # the line between them
    d += 0.014 * g2(x, z, 0.0, -0.146, 0.030 * cw, 0.020)                 # the chin
    for s in SCARS.get(FD.get('scar') if FD else None, ()):               # a scar: a raised seam 6 mm wide (a part, like a hat)
        d += 0.0030 * math.exp(-(seg_dist(x, z, *s) / 0.0045) ** 2)
    return d


# THE SCARS, parts of the face like a hat (the row's END STATE: 'hats, scars and facial hair as parts'): a raised seam along
# a line on the face, its own lighter skin step; +x is the right of the picture (the camera looks north from the south)
SCARS = {
    'brow': [(-0.050, 0.064, -0.040, 0.012)],                     # down through the left brow, the brow split by it
    'cheek': [(0.044, -0.004, 0.084, -0.064)],                    # across the right cheek, cheekbone to jaw
    'lip': [(-0.012, -0.060, -0.004, -0.112)],                    # through the lip, a fighter's
}


def seg_dist(x, z, x0, z0, x1, z1):
    vx, vz = x1 - x0, z1 - z0; L = vx * vx + vz * vz
    t = max(0.0, min(1.0, ((x - x0) * vx + (z - z0) * vz) / L)) if L else 0.0
    return math.hypot(x - x0 - t * vx, z - z0 - t * vz)


def build(who, out):
    import bpy, bmesh, mathutils
    from mathutils import Vector, Matrix
    P = PEOPLE[who]
    # the face's dials and parts (the starred default when the person has none: every number below is the old one)
    global FD, MOUTH_HALF
    FD = face_dials(P.get('face'), P['radii']); FD['scar'] = P.get('scar')
    MOUTH_HALF = 0.033 * FD['mouth']
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT, P['body']))
    for o in list(sc.objects):
        if o.type == 'MESH' and o.name.startswith('Icosphere') and o.parent is None: bpy.data.objects.remove(o, do_unlink=True)
        elif o.name in P['drop']: bpy.data.objects.remove(o, do_unlink=True)
    arm = next(o for o in sc.objects if o.type == 'ARMATURE')
    body = next(o for o in sc.objects if o.type == 'MESH' and o.name.startswith('Cesium_Man'))
    M = body.matrix_world.copy()

    # 1. THE BOX HEAD OFF, above the collar (the neck stays; the new neck tucks into it)
    bm = bmesh.new(); bm.from_mesh(body.data)
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if (M @ f.calc_center_median()).z > P['cut_z']], context='FACES')
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
    bm.to_mesh(body.data); bm.free()

    def mat(name, rgb, rough=0.9):
        m = bpy.data.materials.new(name); m.use_nodes = True
        b = next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED')
        b.inputs['Base Color'].default_value = lin(rgb); b.inputs['Roughness'].default_value = rough
        return m

    C = Vector(P['centre']); RX, RY, RZ = P['radii']
    K = colours(P)

    # 2. THE SKULL: an ellipsoid with a jaw and a nape, the face pushed forward by its features
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=128, v_segments=100, radius=1.0)
    for v in bm.verts:
        d = v.co.normalized()
        lower = max(0.0, -d.z)
        x = d.x * RX * (1.0 - 0.30 * lower ** 1.5)
        y = d.y * RY
        z = d.z * RZ
        if d.y < 0: y *= 1.0 + 0.05 * lower                    # the chin a little forward
        else: y *= 1.0 - 0.35 * lower ** 1.3                   # the nape in toward the neck
        w = sstep(0.15, 0.55, -d.y)                             # the face is the front only
        y -= w * face_push(x, z)
        v.co = Vector((x, y, z))
    head_verts = len(bm.verts)
    # THE EARS: two flattened ovals at the sides, a little behind the middle, joined into the skull's mesh
    for s in (1, -1):
        mtx = Matrix.Translation((s * (RX * 0.97), 0.014, -0.012)) @ Matrix.Rotation(s * 0.25, 4, 'Z') @ Matrix.Diagonal((0.013, 0.030, 0.052, 1.0))
        bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=14, radius=1.0, matrix=mtx)
    bm.normal_update()
    head = bpy.data.meshes.new('portrait_head'); bm.to_mesh(head); bm.free()
    ho = bpy.data.objects.new('portrait_head', head); sc.collection.objects.link(ho)
    ho.location = C
    for nm, rgb in (('skin', K['skin']), ('lips', K['lips']), ('mouth', MOUTH), ('stubble', K['stubble']), ('buzz', K['hair'])):
        head.materials.append(mat('portrait_%s_%s' % (who.lower(), nm), rgb, rough=0.85 if nm == 'lips' else 0.92))
    if P['hair'] == 'slick': head.materials[4].node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value = 0.5   # pomade
    if FD['scar']: head.materials.append(mat('portrait_%s_scar' % who.lower(), K['scar'], rough=0.7))   # index 5, the seam
    V = head.vertices

    def scalp(x, y, z):
        """where the hair grows on the skull: the poacher's and the thug's back and sides (rounds 1 and 2), and for the
        crew's cuts the crown above a hairline 70 mm over the head's centre at the brow, the long cuts down to the jaw"""
        st = P['hair']
        back = (z > -0.030 and y > 0.000) or (z > -0.020 and y > -0.026 and abs(x) > RX * 0.8)
        if st in ('buzz', 'curls'): return back
        # the front hairline is ragged, never a ruler line (cycle 1: a smooth edge read as a helmet's rim): strands every
        # 13 mm hang 6 to 22 mm lower on a long cut (a fringe), 4 mm on a short one
        # (cycle 2: a 26 mm pitch stepped on the skull's rows into a saw; 40 mm clumps read as a fringe)
        # (round 16: under a cap the ragged ends hung below the brim as drips; a capped cut has a plain line, the brim covers it)
        capped = P['gear'] in ('knit cap', 'watch cap', 'slouch beanie', 'work cap', 'skull cap')
        jag = 0.0 if capped else (0.018 if st in ('long', 'shag', 'fall') else 0.004) * max(0.0, math.cos(math.pi * x / 0.040)) ** 2 * (0.7 + 0.3 * math.cos(2 * math.pi * x / 0.071))
        if st == 'slick': crown = z > 0.072 - 0.040 * sstep(-0.10, 0.00, y)        # a clean high line, combed straight back
        elif st == 'fringe':   # a heavy blunt fringe down the forehead to just over the brow ridge, its ends a little ragged
            crown = z > 0.046 + 0.003 * math.cos(2 * math.pi * x / 0.017) + 0.030 * sstep(0.045, 0.080, abs(x)) - 0.040 * sstep(-0.10, 0.00, y)
        else: crown = z > 0.064 - jag - 0.040 * sstep(-0.10, 0.00, y)
        if st in ('long', 'shag', 'fringe'):
            return back or crown or (abs(x) > RX * 0.74 and y > -0.040 and z > -0.118) or (y > 0.010 and z > -0.165)
        if st == 'fall':   # the layered fall: past the jaw at the sides, down the nape
            return back or crown or (abs(x) > RX * 0.72 and y > -0.045 and z > -0.150) or (y > 0.000 and z > -0.200)
        return back or crown
    lower_side = [V[i].co.z < MOUTH_Z for i in range(len(V))]
    for f in head.polygons:
        if f.vertices[0] >= head_verts: continue                  # the ears are skin
        c = f.center; x, y, z = c.x, c.y, c.z; front = y < -RY * 0.55
        sides = set(lower_side[i] for i in f.vertices)
        if front and len(sides) == 2 and abs(x) < MOUTH_HALF: f.material_index = 2          # the mouth line
        elif front and abs(x) < MOUTH_HALF + 0.004 and -0.108 < z < -0.072: f.material_index = 1   # the lips
        elif FD['scar'] and y < -RY * 0.3 and min(seg_dist(x, z, *g) for g in SCARS[FD['scar']]) < 0.0055: f.material_index = 5   # the scar
        elif (P['stubble'] or P.get('beard') == 'stubble') and z < -0.058 + 0.04 * max(0.0, min(1.0, (y + 0.05) / 0.07)) and y < 0.03 and not (abs(x) < 0.03 and z > -0.072): f.material_index = 3   # the beard line rises from the cheek to the jaw's angle
        elif scalp(x, y, z): f.material_index = 4   # the back, the sides behind the ear, a sideburn (and the crown on the crew's cuts)

    # 3. THE SHAPE KEYS: the jaw turns about the hinge in front of the ear; the mouth, the brows and the corners move
    ho.shape_key_add(name='Basis')
    base = [v.co.copy() for v in V]
    hinge = Vector((0.0, 0.030, -0.030))

    def jaw_w(p):
        if p.y > 0.05: return 0.0
        return sstep(0.0, 1.0, (MOUTH_Z + 0.004 - p.z) / 0.016) * sstep(0.0, 1.0, (0.05 - p.y) / 0.05)

    def mouth_w(p):   # the lips and the skin round them
        return g2(p.x, p.z, 0.0, MOUTH_Z, 0.050, 0.030) * (1.0 if p.y < -RY * 0.5 else 0.0)

    def brow_w(p, inner=False):
        if p.y > -RY * 0.5: return 0.0
        return g2(abs(p.x), p.z, 0.022 if inner else 0.050, 0.036, 0.022 if inner else 0.035, 0.020)

    def corner_w(p):
        return g2(abs(p.x), p.z, MOUTH_HALF, MOUTH_Z, 0.014, 0.014) * (1.0 if p.y < -RY * 0.5 else 0.0)

    def shape(name, jaw_deg=0.0, squeeze=1.0, forward=0.0, brow=0.0, inner=0.0, pinch=0.0, corners=0.0, press=0.0):
        k = ho.shape_key_add(name=name, from_mix=False)
        for i, p in enumerate(base):
            if i >= head_verts: k.data[i].co = p; continue
            q = p.copy()
            mw = mouth_w(p)
            if squeeze != 1.0 and mw: q.x = p.x * (1.0 + (squeeze - 1.0) * mw)
            if forward and mw: q.y -= forward * mw
            if press and mw:   # the lips pressed together and in
                q.z += press * mw * (1.0 if p.z < MOUTH_Z else -1.0); q.y += press * 1.5 * mw
            if corners: q.z += corners * corner_w(p)
            if brow: q.z += brow * brow_w(p)
            if inner: q.z += inner * brow_w(p, True)
            if pinch: q.x -= pinch * brow_w(p) * (1 if p.x > 0 else -1)
            w = jaw_w(p)
            if jaw_deg and w:
                a = -math.radians(jaw_deg) * w   # negative: the chin swings down and back
                r = q - hinge
                yz = (r.y * math.cos(a) + r.z * math.sin(a), -r.y * math.sin(a) + r.z * math.cos(a))
                q = Vector((q.x, hinge.y + yz[0], hinge.z + yz[1]))
            if jaw_deg and abs(p.x) < MOUTH_HALF and abs(p.z - MOUTH_Z) < 0.007 and p.y < -RY * 0.5:
                q.y += 0.018 * min(1.0, jaw_deg / 12.0)     # the inside of the open mouth folds back into the head
            k.data[i].co = q
        return k

    shape('A', jaw_deg=20.0)
    shape('E', jaw_deg=4.0, squeeze=1.16, corners=0.003)
    shape('O', jaw_deg=14.0, squeeze=0.70, forward=0.007)
    shape('M', press=0.0025)
    shape('Angry', jaw_deg=2.0, brow=-0.008, inner=-0.006, pinch=0.004, corners=-0.004, squeeze=0.94)
    shape('Sad', jaw_deg=2.0, brow=-0.003, inner=0.009, corners=-0.008)
    shape('Surprised', jaw_deg=16.0, brow=0.012, inner=0.004, squeeze=0.86)

    # 4. THE EYES AND THE LIDS (the lids carry the same expression keys, so the rig turns them together)
    def surf_y(x, z):
        dz = z / RZ; dx = x / RX; r = max(0.0, 1.0 - dx * dx - dz * dz)
        return -RY * math.sqrt(r) - face_push(x, z)
    eye_cy = surf_y(EYE_X, EYE_Z) + 0.006 + EYE_R * 0.35
    bm = bmesh.new()
    for s in (1, -1):
        bmesh.ops.create_uvsphere(bm, u_segments=28, v_segments=20, radius=EYE_R, matrix=Matrix.Translation((s * EYE_X, eye_cy, EYE_Z)))
    eyes = bpy.data.meshes.new('portrait_head_eyes'); bm.to_mesh(eyes); bm.free()
    eo = bpy.data.objects.new('portrait_head_eyes', eyes); sc.collection.objects.link(eo); eo.location = C
    for nm, rgb in (('sclera', SCLERA), ('iris', K['iris']), ('pupil', PUPIL)):
        eyes.materials.append(mat('portrait_%s_%s' % (who.lower(), nm), rgb, rough=0.6))
    for f in eyes.polygons:
        cx = EYE_X if f.center.x > 0 else -EYE_X
        d = (f.center - Vector((cx, eye_cy, EYE_Z))).normalized()
        ang = math.degrees(math.acos(max(-1.0, min(1.0, -d.y))))
        f.material_index = 2 if ang < 13 else (1 if ang < 31 else 0)

    LR = EYE_R * 1.12
    bm = bmesh.new()
    for s in (1, -1):
        c0 = Vector((s * EYE_X, eye_cy, EYE_Z))
        bmesh.ops.create_uvsphere(bm, u_segments=28, v_segments=20, radius=LR, matrix=Matrix.Translation(c0))
    bm.verts.ensure_lookup_table()
    keep = []
    for f in bm.faces:
        cx = EYE_X if f.calc_center_median().x > 0 else -EYE_X
        d = (f.calc_center_median() - Vector((cx, eye_cy, EYE_Z))).normalized()
        if d.y < 0.35 and (d.z > 0.30 or d.z < -0.62): keep.append(f)
    bmesh.ops.delete(bm, geom=[f for f in bm.faces if f not in keep], context='FACES')
    bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
    lids = bpy.data.meshes.new('portrait_head_lids'); bm.to_mesh(lids); bm.free()
    lo = bpy.data.objects.new('portrait_head_lids', lids); sc.collection.objects.link(lo); lo.location = C
    lids.materials.append(head.materials[0])   # the lids are the face's own skin (one material, field 5's cap)
    so = lo.modifiers.new('rim', 'SOLIDIFY'); so.thickness = 0.002; so.offset = 1
    bpy.context.view_layer.objects.active = lo
    for o in sc.objects: o.select_set(o is lo)
    bpy.ops.object.modifier_apply(modifier='rim')
    lo.shape_key_add(name='Basis')
    lbase = [v.co.copy() for v in lids.vertices]

    def lid_key(name, upper_deg, lower_deg=0.0):
        k = lo.shape_key_add(name=name, from_mix=False)
        for i, p in enumerate(lbase):
            cx = EYE_X if p.x > 0 else -EYE_X; c0 = Vector((cx, eye_cy, EYE_Z)); r = p - c0
            a = math.radians(upper_deg if r.z > 0 else lower_deg)
            k.data[i].co = c0 + Vector((r.x, r.y * math.cos(a) + r.z * math.sin(a), -r.y * math.sin(a) + r.z * math.cos(a)))
    for nm in ('A', 'E', 'O', 'M'): lid_key(nm, 0.0)
    lid_key('Angry', 16.0, -6.0)
    lid_key('Sad', 12.0)
    lid_key('Surprised', -14.0, 4.0)
    lid_key('Blink', 52.0, -10.0)

    # 5. THE NECK: its own mesh (so the head is measured chin to crown), into the collar
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=False, segments=24, radius1=0.060, radius2=0.064, depth=0.16,
                          matrix=Matrix.Translation((0.0, 0.020, -0.180)))
    neck = bpy.data.meshes.new('portrait_neck'); bm.to_mesh(neck); bm.free()
    no = bpy.data.objects.new('portrait_neck', neck); sc.collection.objects.link(no); no.location = C
    neck.materials.append(head.materials[0])

    # 6. THE KIT: the knit cap, the skull's own skin lifted, ribbed, with a folded brim (the oxblood above the waist)
    objs = [ho, eo, lo, no]
    if P['gear'] == 'knit cap':
        def line(y): return 0.080 - 0.085 * sstep(-0.12, 0.14, y)
        bm = bmesh.new(); bm.from_mesh(head)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.verts[0].index >= head_verts or f.calc_center_median().z < line(f.calc_center_median().y) - 0.004], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.normal_update()
        for v in bm.verts:
            p = v.co; ln = line(p.y); brim = p.z < ln + 0.034
            ang = math.atan2(p.y, p.x)
            rib = 0.0018 * max(0.0, math.cos(ang * 0.165 / 0.011)) ** 4 if not brim else 0.0   # a rib every 11 mm round the crown
            t = (0.024 if brim else 0.012) - rib
            if brim and abs(p.z - (ln + 0.034)) < 0.004: t -= 0.004                         # the fold's crease
            v.co = p + v.normal * t
        for f in bm.faces: f.material_index = 0
        cap = bpy.data.meshes.new('portrait_cap'); bm.to_mesh(cap); bm.free()
        cap.materials.clear(); cap.materials.append(mat('portrait_%s_cap' % who.lower(), K['gear']))
        co_ = bpy.data.objects.new('portrait_cap', cap); sc.collection.objects.link(co_); co_.location = C
        bpy.context.view_layer.objects.active = co_
        for o in sc.objects: o.select_set(o is co_)
        sd = co_.modifiers.new('rim', 'SOLIDIFY'); sd.thickness = 0.008; sd.offset = -1
        bpy.ops.object.modifier_apply(modifier='rim')
        objs.append(co_)
    if P['gear'] == 'field hat':
        # COOK THREE's field hat (the tier's silhouette feature), rebuilt on this skull: a crown pinched at the top and
        # dented front to back, a brim that droops front and back. Sized to the modelled head, so the brim clears the
        # eyes from the portrait's 80-degree camera.
        bm = bmesh.new()
        base_z, crown_h, cr = 0.098, 0.140, RX * 1.02
        bmesh.ops.create_cone(bm, cap_ends=True, segments=48, radius1=cr, radius2=cr, depth=crown_h,
                              matrix=Matrix.Translation((0.0, 0.006, base_z + crown_h / 2)))
        bmesh.ops.subdivide_edges(bm, edges=[e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > 0.01], cuts=6, use_grid_fill=True)
        for v in bm.verts:
            t = (v.co.z - base_z) / crown_h
            if t > 0.55:
                k = (t - 0.55) / 0.45
                v.co.x *= 1.0 - 0.20 * k; v.co.y = 0.006 + (v.co.y - 0.006) * (1.0 - 0.13 * k)
            if t > 0.98: v.co.z -= 0.024 * max(0.0, 1 - abs(v.co.x) / (RX * 0.45))       # the dent, front to back
            if 0.08 < t < 0.24: v.co.x *= 1.012; v.co.y = 0.006 + (v.co.y - 0.006) * 1.012  # the band
        bmesh.ops.create_cone(bm, cap_ends=True, segments=64, radius1=RX * 1.42, radius2=RX * 1.42, depth=0.010,
                              matrix=Matrix.Translation((0.0, 0.006, base_z + 0.010)))
        bm.verts.ensure_lookup_table()
        for v in bm.verts:
            r = math.hypot(v.co.x, v.co.y - 0.006)
            if r > cr * 1.02:   # the brim: down at the front and the back, a little up at the sides
                d = (r - cr) / (RX * 1.42 - cr); ang = math.atan2(v.co.y - 0.006, v.co.x)
                v.co.z -= 0.030 * d * d * abs(math.sin(ang)) - 0.008 * d * abs(math.cos(ang))
        for v in bm.verts: v.co.z -= 0.16 * (v.co.y - 0.006)   # worn pushed back (cycle 2: level, the front brim hid both eyes)
        bm.normal_update()
        hat = bpy.data.meshes.new('portrait_hat'); bm.to_mesh(hat); bm.free()
        for f in hat.polygons: f.use_smooth = True
        hat.materials.append(mat('portrait_%s_hat' % who.lower(), K['gear']))
        bmat = mat('portrait_%s_band' % who.lower(), K['hair'])
        hat.materials.append(bmat)
        for f in hat.polygons:
            if math.hypot(f.center.x, f.center.y - 0.006) < cr * 1.03 and base_z + 0.012 < f.center.z < base_z + 0.040: f.material_index = 1
        ha = bpy.data.objects.new('portrait_hat', hat); sc.collection.objects.link(ha); ha.location = C
        objs.append(ha)
    CAP = {'knit cap': 0.0, 'watch cap': 0.020, 'slouch beanie': 0.0, 'work cap': 0.012, 'skull cap': 0.050}
    def cap_line(y): return 0.080 - 0.085 * sstep(-0.12, 0.14, y) + CAP.get(P['gear'], 0.0)
    if P['gear'] in ('watch cap', 'slouch beanie', 'work cap', 'skull cap'):
        # the crew's caps: the knit cap's method (the skull's own skin lifted above a line), a watch cap rolled higher on the
        # brow, a slouch beanie with its crown hanging off the back, a work cap with a flat crown and a visor
        k = P['gear']
        bm = bmesh.new(); bm.from_mesh(head)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.verts[0].index >= head_verts or f.calc_center_median().z < cap_line(f.calc_center_median().y) - 0.004], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.normal_update()
        for v in bm.verts:
            p = v.co; ln = cap_line(p.y); brim = k not in ('work cap', 'skull cap') and p.z < ln + 0.030   # a skull cap has no fold
            ang = math.atan2(p.y, p.x)
            rib = 0.0016 * max(0.0, math.cos(ang * 0.165 / 0.011)) ** 4 if (k != 'work cap' and not brim) else 0.0
            t = (0.022 if brim else (0.009 if k == 'work cap' else 0.012)) - rib
            if brim and abs(p.z - (ln + 0.030)) < 0.004: t -= 0.004
            if k == 'slouch beanie': t += 0.034 * sstep(-0.02, 0.15, p.y) * sstep(ln + 0.03, 0.17, p.z)   # the slouch off the back
            v.co = p + v.normal * t
        cap = bpy.data.meshes.new('portrait_cap'); bm.to_mesh(cap); bm.free()
        cap.materials.clear(); cap.materials.append(mat('portrait_%s_cap' % who.lower(), K['gear']))
        for f in cap.polygons: f.material_index = 0; f.use_smooth = True
        co_ = bpy.data.objects.new('portrait_cap', cap); sc.collection.objects.link(co_); co_.location = C
        bpy.context.view_layer.objects.active = co_
        for o in sc.objects: o.select_set(o is co_)
        sd = co_.modifiers.new('rim', 'SOLIDIFY'); sd.thickness = 0.008; sd.offset = -1
        bpy.ops.object.modifier_apply(modifier='rim')
        objs.append(co_)
        if k == 'work cap':   # the visor: a flat oval out over the brow, tipped down 10 degrees, the back half inside the crown
            bm = bmesh.new()
            vz = cap_line(-0.16) + 0.006
            bmesh.ops.create_cone(bm, cap_ends=True, segments=40, radius1=1.0, radius2=1.0, depth=1.0,
                                  matrix=Matrix.Translation((0.0, -RY * 0.92, vz)) @ Matrix.Rotation(math.radians(-10), 4, 'X') @ Matrix.Diagonal((RX * 0.78, 0.085, 0.007, 1.0)))
            vm = bpy.data.meshes.new('portrait_visor'); bm.to_mesh(vm); bm.free()
            vm.materials.append(cap.materials[0])
            vo = bpy.data.objects.new('portrait_visor', vm); sc.collection.objects.link(vo); vo.location = C
            objs.append(vo)
    if P['gear'] == 'cone hat':
        # the rice farmer's hat (CHARACTER's cone, sized to this head): a shallow straw cone wider than the shoulders' half,
        # its point over the crown, the weave pressed in as rings every 35 mm, its rim well above the eyes (cycle 1: 1.9 x the
        # head's width ran off the portrait's frame on both sides; 1.5 keeps the cone and the face in one square)
        bm = bmesh.new()
        top = RZ - 0.030 + 0.065
        bmesh.ops.create_cone(bm, cap_ends=True, segments=48, radius1=RX * 1.5, radius2=0.012, depth=0.11,
                              matrix=Matrix.Translation((0.0, 0.006, top)))
        bmesh.ops.subdivide_edges(bm, edges=[e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > 0.01], cuts=8)
        for v in bm.verts:
            r = math.hypot(v.co.x, v.co.y - 0.006)
            if v.co.z > top - 0.06: v.co.z -= 0.004 * max(0.0, math.cos(2 * math.pi * r / 0.035)) ** 6
        bm.normal_update()
        hat = bpy.data.meshes.new('portrait_hat'); bm.to_mesh(hat); bm.free()
        hat.materials.append(mat('portrait_%s_hat' % who.lower(), K['gear']))
        ha = bpy.data.objects.new('portrait_hat', hat); sc.collection.objects.link(ha); ha.location = C
        bpy.context.view_layer.objects.active = ha
        for o in sc.objects: o.select_set(o is ha)
        sd = ha.modifiers.new('rim', 'SOLIDIFY'); sd.thickness = 0.010; sd.offset = -1
        bpy.ops.object.modifier_apply(modifier='rim')
        objs.append(ha)
    if P['hair'] in ('taper', 'long', 'shag', 'coil', 'fall', 'slick', 'fringe'):
        # THE CREW'S CUTS, the curls' method: the skull's own scalp faces lifted. A taper is a 3 to 8 mm shell combed
        # front to back; a long cut a 10 mm shell that fills to 20 mm toward the jaw; a shag the long cut in choppy lumps;
        # a coil crown the poacher's curls over the whole scalp. Under a cap only what shows below its line is kept.
        st = P['hair']; capped = P['gear'] in CAP or P['gear'] == 'knit cap'
        bm = bmesh.new(); bm.from_mesh(head)
        def keep(c):
            if not scalp(c.x, c.y, c.z): return False
            if capped and abs(c.x) < 0.060 and c.y < -0.090: return False   # no band of hair across the forehead under a brim
            return not (capped and c.z > cap_line(c.y) + 0.010)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.verts[0].index >= head_verts or not keep(f.calc_center_median())], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.normal_update()
        # HAIR IS LOCKS, NEVER A MESH (his 10/18 YES on the crew: 'some hair looks like medieval chain-mail armor'; the
        # coordinator: 'hair as clumps and strands, never a mesh'). Round 1 rippled every cut with cosines on a fixed pitch
        # in both directions, a regular grid, which is exactly what mail is. Now the shell is split once (4 mm between
        # points, so a lock is more than two points wide) and lifted as LOCKS: each runs along the way the hair falls
        # (combed back over the crown, down the sides and the back, down the forehead on a fringe), its width wanders, each
        # lock its own height, a parting between two; a coil crown is blobs of hashed noise at two sizes. Nothing repeats.
        bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=1, use_grid_fill=True)
        bm.normal_update()
        seed = sum(ord(ch) for ch in who)
        W = {'taper': 0.016, 'slick': 0.011, 'long': 0.026, 'fall': 0.028, 'fringe': 0.022, 'shag': 0.024, 'coil': 0.0}[st]
        for v in bm.verts:
            p = v.co; ang = math.atan2(p.y, p.x); rr = math.hypot(p.x, p.y)
            top = sstep(0.040, 0.100, p.z)                                     # how much this point is on the crown
            fringe = st == 'fringe' and p.y < -0.05 and p.z < 0.11
            lk = 0.0
            if W:
                down = locks(ang * max(rr, 0.05), p.z, W, seed)                  # the sides and the back fall down
                if fringe: back = locks(p.x, p.z, W, seed + 7)                  # the fringe falls down the forehead
                elif st in ('long', 'fall', 'shag', 'fringe'):
                    # a long cut falls from a centre part, out and down to each side (round 16: combed straight back, its
                    # locks read from the front as a knit cap's ribs), a parting at the middle
                    back = locks(p.y, abs(p.x), W, seed + 7) * (0.55 + 0.45 * sstep(0.0, 0.014, abs(p.x)))
                else: back = locks(p.x, p.y, W, seed + 7)                       # a short cut combs straight back
                lk = down + (back - down) * (1.0 if fringe else top)
            if st == 'taper': t = 0.003 + 0.006 * sstep(0.02, 0.13, p.z) + 0.0025 * lk
            elif st == 'slick': t = 0.004 + 0.004 * sstep(0.02, 0.13, p.z) + 0.0006 * lk   # pomade: the locks lie flat (round 16: 1.8 mm read as a beanie's ribs)
            elif st == 'fall':   # layered: lock ends at uneven heights, not rings
                t = 0.007 + 0.015 * sstep(0.0, -0.15, p.z) + 0.007 * lk + 0.004 * vnoise(ang * 6.0, p.z / 0.032, seed=seed + 3)
            elif st == 'fringe': t = 0.008 + 0.012 * sstep(0.0, -0.13, p.z) + 0.006 * lk + 0.006 * sstep(-0.04, -0.09, p.y) * sstep(0.11, 0.06, p.z)
            elif st == 'coil':   # coils clump into blobs of every size: hashed noise at 15 and 7 mm, never a lattice
                b = 0.62 * vnoise(p.x / 0.015, p.y / 0.015, p.z / 0.015, seed) + 0.38 * vnoise(p.x / 0.007, p.y / 0.007, p.z / 0.007, seed + 1)
                t = 0.010 + 0.014 * b ** 1.3
            else:
                t = 0.007 + 0.012 * sstep(0.0, -0.13, p.z) + 0.007 * lk
                if st == 'shag': t += 0.008 * vnoise(ang * 9.0, p.z / 0.020, seed=seed + 5) ** 1.5   # choppy, cut at random
            v.co = p + v.normal * t
        for f in bm.faces: f.material_index = 0; f.smooth = True
        hm = bpy.data.meshes.new('portrait_hair'); bm.to_mesh(hm); bm.free()
        hm.materials.clear(); hm.materials.append(head.materials[4])
        hh = bpy.data.objects.new('portrait_hair', hm); sc.collection.objects.link(hh); hh.location = C
        bpy.context.view_layer.objects.active = hh
        for o in sc.objects: o.select_set(o is hh)
        sd = hh.modifiers.new('rim', 'SOLIDIFY'); sd.thickness = 0.004; sd.offset = -1
        bpy.ops.object.modifier_apply(modifier='rim')
        objs.append(hh)
    if P['hair'] == 'curls':
        # BLACK CURLS out from under the hat at the sides and the back (the game's own poacher face): the skull's own
        # faces lifted 16 mm, every curl a lump 9 mm high on a 22 mm grid, nothing over the face or the ears' front
        bm = bmesh.new(); bm.from_mesh(head)
        def hair_at(c):
            return c.z > -0.050 + 0.06 * max(0.0, min(1.0, (-c.y) / 0.08)) and (c.y > -0.05 or abs(c.x) > RX * 0.82)
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.verts[0].index >= head_verts or not hair_at(f.calc_center_median())], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.normal_update()
        for v in bm.verts:
            p = v.co; ang = math.atan2(p.y, p.x)
            lump = (0.5 + 0.5 * math.cos(2 * math.pi * ang * RX / 0.022)) * (0.5 + 0.5 * math.cos(2 * math.pi * p.z / 0.022))
            v.co = p + v.normal * (0.012 + 0.009 * lump ** 0.7)
        for f in bm.faces: f.material_index = 0; f.smooth = True
        hm = bpy.data.meshes.new('portrait_curls'); bm.to_mesh(hm); bm.free()
        hm.materials.clear(); hm.materials.append(head.materials[4])
        hc = bpy.data.objects.new('portrait_curls', hm); sc.collection.objects.link(hc); hc.location = C
        objs.append(hc)

    if P.get('beard') in ('full', 'moustache', 'goatee'):
        # FACIAL HAIR AS A PART (the row: 'hats, scars and facial hair as parts'), the hair's method: the skull's own faces where
        # it grows, lifted 6 to 12 mm in lumps, the lips left bare. Each beard vertex remembers the skull vertex it came from,
        # so it carries every shape key of the face: the beard drops with the jaw on A and O, the moustache rides the lip on E.
        bd = P['beard']
        def beard_at(c):
            x, y, z = c.x, c.y, c.z
            if y > 0.03: return False
            front = y < -RY * 0.45
            # (cycle 1: a ring 4 mm round the lips and a 12 mm shell hid the mouth, the lower face read as a mask; the ring is
            # 8 mm and the shell thins to a third at the lips, below)
            lips = abs(x) < MOUTH_HALF + 0.008 and -0.110 < z < -0.072
            must = front and abs(x) < MOUTH_HALF + 0.012 and -0.078 < z < -0.059
            if bd == 'moustache': return must and not lips
            if bd == 'goatee': return (must or (front and abs(x) < 0.030 and z < -0.104)) and not lips
            jaw = z < -0.058 + 0.04 * max(0.0, min(1.0, (y + 0.05) / 0.07)) and not (abs(x) < 0.03 and z > -0.072)
            return (jaw or must) and not lips
        bm = bmesh.new(); bm.from_mesh(head)
        src = bm.verts.layers.int.new('src')
        for v in bm.verts: v[src] = v.index
        bmesh.ops.delete(bm, geom=[f for f in bm.faces if f.verts[0].index >= head_verts or not beard_at(f.calc_center_median())], context='FACES')
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if not v.link_faces], context='VERTS')
        bm.normal_update()
        lift = []
        for v in bm.verts:
            p = v.co; ang = math.atan2(p.y, p.x)
            # tufts of hashed noise at 12 and 6 mm, never a lattice (the chain-mail note, 10/18), longer down the jaw
            lump = 0.65 * vnoise(p.x / 0.012, p.y / 0.012, p.z / 0.016, 11) + 0.35 * vnoise(p.x / 0.006, p.y / 0.006, p.z / 0.008, 12)
            t = {'full': 0.008, 'moustache': 0.006, 'goatee': 0.007}[bd] + 0.005 * lump ** 1.2
            if bd == 'full': t += 0.003 * sstep(-0.10, -0.15, p.z)   # fuller under the chin
            if bd != 'moustache': t *= 1.0 - 0.65 * g2(p.x, p.z, 0.0, MOUTH_Z, 0.050, 0.026)   # thin at the mouth, so it shows
            lift.append((v[src], v.normal * t)); v.co = p + v.normal * t
        for f in bm.faces: f.material_index = 0; f.smooth = True
        bmm = bpy.data.meshes.new('portrait_beard'); bm.to_mesh(bmm); bm.free()
        bmm.materials.clear(); bmm.materials.append(mat('portrait_%s_beard' % who.lower(), K['beard']))
        bo = bpy.data.objects.new('portrait_beard', bmm); sc.collection.objects.link(bo); bo.location = C
        bo.shape_key_add(name='Basis')
        for kb in ho.data.shape_keys.key_blocks[1:]:
            k2 = bo.shape_key_add(name=kb.name, from_mix=False)
            for i, (si, off) in enumerate(lift): k2.data[i].co = kb.data[si].co + off
        objs.append(bo)

    # 6b. STRAND NORMALS ON A DARK HEAD (CHARACTER's 8b, reused for the crew): the rig's source pass dusts every up-facing
    # surface toward a pale warm dust, so black hair and a charcoal cap rendered grey (cycle 1, measured on the longcoat and
    # the barearms). A strand's normal lies across the head, never straight up: the dark pieces' normals are tilted out
    # from the skull's axis, z held under 0.5, as CHARACTER measured. The real fix is the rig's per-material wear (routed).
    if P.get('crew'):
        for o in objs:
            if o.name not in ('portrait_hair', 'portrait_cap', 'portrait_beard') or not o.data.materials: continue
            bc = next(n for n in o.data.materials[0].node_tree.nodes if n.type == 'BSDF_PRINCIPLED').inputs['Base Color'].default_value
            if 0.2126 * bc[0] + 0.7152 * bc[1] + 0.0722 * bc[2] > 0.12: continue
            ns = []
            for v in o.data.vertices:
                n = v.normal.copy(); r = Vector((v.co.x, v.co.y, 0.0))
                r = r.normalized() if r.length > 1e-4 else Vector((0, 1, 0))
                t = max(0.0, n.z - 0.5) / 0.5
                m = n.lerp(r, t); m.z = min(m.z, 0.5); m.normalize(); ns.append(tuple(m))
            o.data.normals_split_custom_set_from_vertices(ns)

    # 7. SKIN IT: every piece on the head bone; the neck blends down onto the neck bone
    # (round 2: the head's offset is baked into every mesh first; left as an object location, the exporter dropped it
    # on the pieces added after the skull, and the neck, the hat and the curls landed at the body's feet)
    bpy.context.view_layer.update()
    if not FD['identity']:
        # 6c. THE DIALS ON THE MODEL: every piece built on the starred head is moved to this face, every shape key with it.
        # The skull, the hair, the caps, the beard and the neck bend with the face (warp); the eyeballs and their lids are
        # rigid, each eye carried whole to where its socket went, so an eye stays round
        def rigid(o, eyes):
            for side in (1, -1):
                c0 = Vector((side * EYE_X, eye_cy, EYE_Z)); w = warp(*c0); off = Vector(w) - c0
                blocks = o.data.shape_keys.key_blocks if o.data.shape_keys else None
                for i, v in enumerate(o.data.vertices):
                    if (v.co.x > 0) != (side > 0): continue
                    v.co = v.co + off
                    if blocks:
                        for kb in blocks: kb.data[i].co = kb.data[i].co + off
        for o in objs:
            if o is eo or o is lo: rigid(o, True); continue
            if o.data.shape_keys:
                for kb in o.data.shape_keys.key_blocks:
                    for d_ in kb.data: d_.co = Vector(warp(*d_.co))
                for v, d_ in zip(o.data.vertices, o.data.shape_keys.key_blocks[0].data): v.co = d_.co
            else:
                for v in o.data.vertices: v.co = Vector(warp(*v.co))
            o.data.update()
        bpy.context.view_layer.update()
    for o in objs:
        o.data.transform(Matrix.Translation(C), shape_keys=True); o.location = (0.0, 0.0, 0.0)
    bpy.context.view_layer.update()
    for o in objs:
        mw = o.matrix_world.copy(); o.parent = arm; o.matrix_world = mw
        vh = o.vertex_groups.new(name=HEAD_BONE)
        if o is no:
            vn = o.vertex_groups.new(name=NECK_BONE)
            for v in o.data.vertices:
                w = sstep(C.z - 0.24, C.z - 0.14, v.co.z); vh.add([v.index], w, 'REPLACE'); vn.add([v.index], 1.0 - w, 'REPLACE')
        else:
            vh.add(list(range(len(o.data.vertices))), 1.0, 'REPLACE')
        am = o.modifiers.new('Armature', 'ARMATURE'); am.object = arm
        o.data.update()

    os.makedirs(os.path.dirname(out), exist_ok=True)
    for o in sc.objects: o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=out, export_format='GLB', export_skins=True, export_animations=True, export_morph=True, export_morph_normal=False, export_apply=False, use_selection=False)
    stats = dict(person=who, model=os.path.relpath(out, ROOT), from_body=P['body'], dropped=list(P['drop']), cut_above_z=P['cut_z'],
                 head=dict(centre=P['centre'], radii=P['radii'], mouth_z=MOUTH_Z, mouth_half=MOUTH_HALF, eye=[EYE_X, EYE_Z, EYE_R], bone=HEAD_BONE),
                 shape_keys=[k.name for k in ho.data.shape_keys.key_blocks][1:], lid_keys=[k.name for k in lo.data.shape_keys.key_blocks][1:],
                 gear=P['gear'], hair=P['hair'], stubble=P['stubble'], look=P.get('look'), beard=P.get('beard'), scar=P.get('scar'),
                 face=dict(dials=FD['v'], identity=FD['identity'], mouth_half=round(MOUTH_HALF, 4)),
                 meshes={o.name: len(o.data.vertices) for o in sc.objects if o.type == 'MESH'},
                 materials={m.name: [round(x, 4) for x in next(n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED').inputs['Base Color'].default_value[:3]] for m in bpy.data.materials if m.use_nodes})
    json.dump(stats, open(out.replace('.glb', '.json'), 'w'), indent=1)
    print(json.dumps(stats, indent=1))


def sheet(who, frames, out):
    """the portrait three ways and the face performing, at 1:1 and 2x, beside the game's own face of the same person;
    the body's S still with the new head beside COOK THREE's box-head thug; the caption names the pixel size, the
    palette and the light (rule 114c)"""
    from PIL import Image, ImageDraw
    P = PEOPLE[who]
    BG = (22, 21, 20); PANEL = (58, 52, 46); INK = (220, 214, 200); DIM = (160, 154, 140); HEAD = (200, 190, 120)
    pj = json.load(open(os.path.join(frames, 'portrait.json'))); rig = json.load(open(os.path.join(frames, 'rig.json')))
    op = lambda r: Image.open(os.path.join(ROOT, r)).convert('RGBA')
    por = [op(f) for f in pj['files']]
    ex = [(k, op(v)) for k, v in pj['expression_files'].items()]
    twin = Image.open(os.path.join(ROOT, P['twin'])).convert('RGBA')
    s_new = op(rig['files'][rig['facings'].index('S')])
    s_old = Image.open(os.path.join(ROOT, P['cook3'], 'rig_S.png')).convert('RGBA')
    pw, ph = por[0].size
    Wd = max(24 + 8 * (pw + 8), 24 + 3 * (2 * pw + 12) + 2 * twin.width + 40, 24 + 5 * (2 * pw + 12), 1100)
    H = 90 + (2 * ph + 34) + (ph + 34) + (2 * ph + 34) + max(s_new.height, s_old.height) * 2 + 140
    S = Image.new('RGB', (Wd, H), BG); d = ImageDraw.Draw(S)
    d.text((12, 8), 'PORTRAIT: THE FACE FROM THE SAME MODEL (rule 115c). The %s\'s head MODELLED and rendered close through DIRECTION\'s rig; the body below is the same model. A PLACEHOLDER: nothing is final before the moodboard.' % who, fill=INK)
    d.text((12, 24), 'head %d px chin to crown (%.3f m, %s), camera tilt 80, one pixel size, block 1 | palette: %s + the face\'s own (bone eye whites, never white) | ONE light: the rig\'s sun, upper left, above' % (pj['head_px'], pj['head_m'], pj['head_how'].split(':')[0], P['palette']), fill=DIM)
    d.text((12, 38), 'every feature is geometry: the brow ridge 14 mm over sockets 22 mm deep, a 32 mm nose, lips, chin, ears, eyeballs and lids; %s; the mouth opens on the jaw\'s hinge' % P['kit'], fill=DIM)

    def put(im, x, y, k=1):
        b = im.resize((im.width * k, im.height * k), Image.NEAREST) if k > 1 else im
        S.paste(PANEL, (x, y, x + b.width, y + b.height)); S.paste(b, (x, y), b); return b.width
    y = 60; d.text((12, y), 'THE HEAD, THREE WAYS (S, SE, SW) at 2x, then HIS FACE TODAY: the game\'s own %s face (renderFace() at 64 px) at 2x' % who, fill=HEAD); y += 14
    x = 12
    for im, lb in zip(por, pj['facings']): x += put(im, x, y, 2) + 12
    x += 16; tx = x; x += put(twin, x, y, 2) + 12; d.text((tx, y + 2 * twin.height + 2), 'today (64 px)', fill=DIM)
    y += 2 * ph + 20
    d.text((12, y), 'THE FACE PERFORMS, the same head front-on at 1:1: rest, the speak-along mouth (A open, E wide, O round, M closed), then Angry, Sad, Surprised', fill=HEAD); y += 14
    x = 12
    for k, im in [('rest', por[0])] + ex: put(im, x, y); d.text((x, y + ph + 2), k, fill=DIM); x += pw + 8
    y += ph + 20
    d.text((12, y), 'THE SAME AT 2x: rest, A, O, Angry, Surprised', fill=HEAD); y += 14
    x = 12
    pick = dict(ex)
    for k in ('rest', 'A', 'O', 'Angry', 'Surprised'):
        im = por[0] if k == 'rest' else pick.get(k)
        if im is None: continue
        x += put(im, x, y, 2) + 12
    y += 2 * ph + 20
    d.text((12, y), 'ONE MODEL: the body\'s S still with this head (left) beside COOK THREE\'s %s with the test body\'s box head (right), at 2x' % who.lower(), fill=HEAD); y += 14
    x = 12; x += put(s_new, x, y, 2) + 24; put(s_old, x, y, 2)
    y += 2 * max(s_new.height, s_old.height) + 10
    c = rig.get('card', {})
    d.text((12, y), 'the rig\'s card on the body\'s S still (%s): %s; portrait colours across the set %s; model %s' % (c.get('family'), c.get('verdict'), pj.get('colours'), pj.get('model')), fill=DIM)
    for i, r in enumerate(c.get('rows', [])): d.text((12 + (i % 4) * 260, y + 16 + 14 * (i // 4)), r, fill=(150, 144, 132))
    os.makedirs(os.path.dirname(out), exist_ok=True); S.save(out); print('sheet', out, S.size)


CREW_OUT = 'records/target/portrait/crew'
CREW_FRAMES = 'records/target/portrait/rig/crew'


def group_rows(group):
    """(who, entry) for a hand-off group: 'crew' (YOU and the twelve cast looks, round 1) or 'faction' (the thirteen gangs,
    round 2); an entry carries the look the screens key on, its cut and its head gear"""
    if group == 'crew': return list(CREW.items())
    return [('FACTION_' + k.upper(), dict(look='faction_' + k.lower(), name=k.upper(), hair=c['hair'], gear=c['gear'], beard=c.get('beard'),
                                          scar=c.get('scar'), worn=c['worn'])) for k, c in FACTION.items()]


def crew_faces(group='crew'):
    """THE HAND-OFF TO RUN TWO: every crew face as square files the screens draw as they are (the roster and the settlement
    draw a face into a 64 canvas; a 72 px box on a 3x phone shows 216 device pixels, so a 128 is handed too). The square is
    the rig's portrait frame padded to square on its own background; the 64 and the 128 are BOX-resampled from the 1:1
    render (the area average a render at that size would take; never nearest, which drops the eyes). Rest, the four
    speak-along mouths and the three moods, so the talking face is the same model. Manifest: BOHEMIA_CREW_FACES.json."""
    from PIL import Image
    man = dict(version='crew-faces-10-18', lane='portrait', rule='115h', method='the face from the same model (HIS FIRST STAR)',
               draft=True, placeholder='nothing is final before the moodboard (rule 108); the old 64 face stays until RUN TWO swaps',
               how_to_draw='drawImage(face, 0, 0, box, box): already square, already sized; the 128 for boxes over 64 css px',
               keys=['rest', 'A', 'E', 'O', 'M', 'Angry', 'Sad', 'Surprised'], faces={})
    mp = os.path.join(ROOT, CREW_OUT, 'BOHEMIA_CREW_FACES.json')
    if os.path.exists(mp):   # one manifest for every screen's faces: a group's round adds its looks, the others stand
        old = json.load(open(mp)); man['faces'] = old.get('faces', {})
        man['groups'] = old.get('groups', {'crew': 'YOU and the twelve cast looks (round 1, eb12c4a2)'})
    if group == 'faction':
        man['version'] = 'crew-faces-10-18d'
        man.setdefault('groups', {})['faction'] = ("the thirteen gangs' looks the settlement's street draws (round 2): each head on its gang's own "
                                                   "body (CHARACTER's rig look he voted up) with its own face dials")
    for who, c in group_rows(group):
        l = who.lower(); fr = os.path.join(ROOT, CREW_FRAMES, l)
        pj = json.load(open(os.path.join(fr, 'portrait.json')))
        src = dict(rest=pj['files'][0], **pj['expression_files'])
        od = os.path.join(ROOT, CREW_OUT, c['look']); os.makedirs(od, exist_ok=True)
        ent = dict(name=c.get('name'), look=c['look'], model='records/portrait/rig/crew/%s_head.glb (rebuilt by this tool; not committed, 7 MB)' % l,
                   hair=c['hair'], gear=c['gear'], files={})
        if group == 'faction':
            hj = json.load(open(os.path.join(ROOT, 'records/portrait/rig/crew/%s_head.json' % l)))
            ent.update(group='faction', beard=c.get('beard'), scar=c.get('scar'), worn=c.get('worn'), dials=hj['face']['dials'])
        for k in man['keys']:
            if k not in src: continue
            im = Image.open(os.path.join(ROOT, src[k])).convert('RGBA')
            # the square is the head and a little collar, not the shoulders (cycle 1: the whole rig frame boxed to 64 left the
            # head 38 px in a 64 box, smaller than the drawn face it replaces): a window 1.25 x the head's height from the top,
            # centred on the head
            side = min(im.width, int(round(pj['head_px'] * 1.25)))
            bb = im.split()[3].crop((0, 0, im.width, side)).getbbox() or (0, 0, im.width, side)
            cx = (bb[0] + bb[2]) // 2; x0 = max(0, min(im.width - side, cx - side // 2))
            sq = im.crop((x0, 0, x0 + side, side))
            for n in (64, 128):
                p = os.path.join(od, '%s_%d.png' % (k, n)); sq.resize((n, n), Image.BOX).save(p)
            ent['files'][k] = os.path.relpath(os.path.join(od, '%s_{64|128}.png' % k), ROOT)
        man['faces'][c['look']] = ent
    json.dump(man, open(os.path.join(ROOT, CREW_OUT, 'BOHEMIA_CREW_FACES.json'), 'w'), indent=1)
    print('faces', len(man['faces']))


def crew_sheet(out):
    """the thirteen: the game's own 64 face today (at 2x) beside the new head three ways and talking, at 1:1; then the
    company line as the crew screen draws it, today against the new faces at 64"""
    from PIL import Image, ImageDraw
    BG = (22, 21, 20); PANEL = (58, 52, 46); INK = (220, 214, 200); DIM = (160, 154, 140); HEAD = (200, 190, 120)
    fp = json.load(open(os.path.join(ROOT, 'slices/fight_people/fight_people.json')))
    rows = []
    for who, c in CREW.items():
        l = who.lower(); fr = os.path.join(ROOT, CREW_FRAMES, l)
        pj = json.load(open(os.path.join(fr, 'portrait.json')))
        sh = Image.open(os.path.join(ROOT, 'slices/fight_people', fp['looks'][c['look']]['file'])).convert('RGBA')
        today = sh.crop((sh.width - 64, 0, sh.width, 64))
        ims = [Image.open(os.path.join(ROOT, f)).convert('RGBA') for f in pj['files']] + \
              [Image.open(os.path.join(ROOT, pj['expression_files'][k])).convert('RGBA') for k in ('A', 'O', 'M', 'Angry')]
        rows.append((who, c, today, ims))
    pw, ph = rows[0][3][0].size
    Wd = 24 + 150 + 7 * (pw + 6); H = 70 + len(rows) * (ph + 22) + 60 + 2 * (64 + 30)
    S = Image.new('RGB', (Wd, H), BG); d = ImageDraw.Draw(S)
    d.text((12, 8), 'PORTRAIT: EVERY FACE FROM THE SAME MODEL (rule 115h, his first star). The thirteen faces RUN TWO\'s crew and scavenge screens show, each a MODELLED head on its own body (CHARACTER\'s tool, the look\'s worn list). A PLACEHOLDER.', fill=INK)
    d.text((12, 22), 'head 128 px chin to crown, camera tilt 80, one pixel size, block 1 | palette: style palette steps (skin from the game\'s own face, hair and gear from the worn list) | ONE light: the rig\'s sun, upper left, above | wear 0.45', fill=DIM)
    d.text((12, 36), 'columns: TODAY (the game\'s 64 px face, 2x) | S | SE | SW | talking A | O | M | Angry, all 1:1 straight from DIRECTION\'s rig, unedited', fill=HEAD)
    y = 56
    for who, c, today, ims in rows:
        d.text((12, y), '%s  (%s)  %s, %s' % (c.get('name') or c['look'].replace('cast_', '').upper(), c['look'], c['hair'], c['gear'] or 'bare head'), fill=HEAD); y += 14
        t2 = today.resize((128, 128), Image.NEAREST); S.paste(PANEL, (12, y, 140, y + 128)); S.paste(t2, (12, y), t2)
        x = 162
        for im in ims:
            S.paste(PANEL, (x, y, x + im.width, y + im.height)); S.paste(im, (x, y), im); x += pw + 6
        y += ph + 8
    y += 10
    d.text((12, y), 'THE COMPANY LINE AT THE SIZE THE CREW SCREEN DRAWS IT (64 px): today, then the new faces (BOX-resampled from the render, the hand-off files)', fill=HEAD); y += 16
    for i, (who, c, today, ims) in enumerate(rows):
        x = 12 + i * 70
        S.paste(PANEL, (x, y, x + 64, y + 64)); S.paste(today, (x, y), today)
        f = Image.open(os.path.join(ROOT, CREW_OUT, c['look'], 'rest_64.png')).convert('RGBA')
        S.paste(PANEL, (x, y + 94, x + 64, y + 158)); S.paste(f, (x, y + 94), f)
    d.text((12, y + 68), 'today', fill=DIM); d.text((12, y + 162), 'from the same model', fill=DIM)
    os.makedirs(os.path.dirname(os.path.join(ROOT, out)), exist_ok=True); S.save(os.path.join(ROOT, out)); print('sheet', out, S.size)


def dial_text(d):
    """the dials a face moved off the starred default, in the face maker's own labels"""
    lab = {k: l for k, l, lo, hi, df in FACE_DIALS}; dfl = {k: df for k, l, lo, hi, df in FACE_DIALS}
    return ', '.join('%s %+d' % (lab[k].lower(), d[k] - dfl[k]) for k in lab if d.get(k, dfl[k]) != dfl[k]) or 'the starred default'


def rows_sheet(out, title, lines, rows, today_label, foot=None):
    """a VOTE sheet of heads: per row the old 64 face at 2x (or nothing), the head S SE SW and talking A O Angry at 1:1, its
    words under it; the caption names the pixel size, the palette and the light (rule 114c)"""
    from PIL import Image, ImageDraw
    BG = (22, 21, 20); PANEL = (58, 52, 46); INK = (220, 214, 200); DIM = (160, 154, 140); HEAD = (200, 190, 120)
    loaded = []
    for label, sub, today, fr in rows:
        pj = json.load(open(os.path.join(ROOT, fr, 'portrait.json')))
        ims = [Image.open(os.path.join(ROOT, f)).convert('RGBA') for f in pj['files']] + \
              [Image.open(os.path.join(ROOT, pj['expression_files'][k])).convert('RGBA') for k in ('A', 'O', 'Angry')]
        loaded.append((label, sub, today, ims))
    pw, ph = loaded[0][3][0].size
    Wd = 24 + 150 + 6 * (pw + 6); H = 30 + 14 * len(lines) + len(loaded) * (ph + 36) + (foot[1] if foot else 0) + 20
    S = Image.new('RGB', (Wd, H), BG); d = ImageDraw.Draw(S)
    d.text((12, 8), title, fill=INK); y = 24
    for ln in lines: d.text((12, y), ln, fill=DIM if not ln.startswith('columns') else HEAD); y += 14
    y += 4
    for label, sub, today, ims in loaded:
        d.text((12, y), label, fill=HEAD); d.text((12, y + 13), sub, fill=DIM); y += 28
        if today is not None:
            t2 = today.resize((128, 128), Image.NEAREST); S.paste(PANEL, (12, y, 140, y + 128)); S.paste(t2, (12, y), t2)
            d.text((12, y + 130), today_label, fill=DIM)
        x = 162
        for im in ims:
            S.paste(PANEL, (x, y, x + im.width, y + im.height)); S.paste(im, (x, y), im); x += pw + 6
        y += ph + 8
    if foot: foot[0](S, d, y)
    os.makedirs(os.path.dirname(os.path.join(ROOT, out)), exist_ok=True); S.save(os.path.join(ROOT, out)); print('sheet', out, S.size)


HAIR_STRIP = ('you', 'cast_barearms', 'cast_cape', 'cast_skirt', 'cast_poncho', 'cast_shortcoat', 'cast_longcoat')


def faction_sheet(out, before=None):
    """the thirteen gangs: the game's 64 face today (2x) beside the new head on the gang's own body, and the street's line
    at the size the settlement draws a speaker, today against the fresh faces"""
    from PIL import Image
    fp = json.load(open(os.path.join(ROOT, 'slices/fight_people/fight_people.json')))
    rows, todays = [], []
    for who, c in group_rows('faction'):
        l = who.lower(); sh = Image.open(os.path.join(ROOT, 'slices/fight_people', fp['looks'][c['look']]['file'])).convert('RGBA')
        today = sh.crop((sh.width - 64, 0, sh.width, 64)); todays.append((c['look'], today))
        hj = json.load(open(os.path.join(ROOT, 'records/portrait/rig/crew/%s_head.json' % l)))
        rows.append(('%s  (%s)' % (c['name'], c['look']), '%s | face: %s' % (c['worn'], dial_text(hj['face']['dials'])), today, os.path.join(CREW_FRAMES, l)))

    def foot(S, d, y):
        d.text((12, y + 4), 'THE STREET AT THE SIZE THE SETTLEMENT DRAWS A SPEAKER (64 px): today, then the fresh faces (the hand-off files)', fill=(200, 190, 120))
        y += 20
        for i, (look, today) in enumerate(todays):
            x = 12 + i * 70; f = Image.open(os.path.join(ROOT, CREW_OUT, look, 'rest_64.png')).convert('RGBA')
            S.paste((58, 52, 46), (x, y, x + 64, y + 64)); S.paste(today, (x, y), today)
            S.paste((58, 52, 46), (x, y + 84, x + 64, y + 148)); S.paste(f, (x, y + 84), f)
        d.text((12, y + 66), 'today', fill=(160, 154, 140)); d.text((12, y + 150), 'from the same model', fill=(160, 154, 140))
        if not before: return
        # HIS CHAIN-MAIL NOTE, ANSWERED ON THE CARD: the crew's hair as he voted it (round 1, a grid of ripples) over the
        # same faces re-rendered with locks, at 128 (the size the crew screen's big box shows)
        y += 172
        d.text((12, y), 'YOUR NOTE ON THE CREW: "some hair looks like medieval chain-mail armor". Top: the crew as you voted it (a grid of ripples). Bottom: the same faces, hair as locks. 128 px.', fill=(200, 190, 120))
        y += 16
        for i, look in enumerate(HAIR_STRIP):
            x = 12 + i * 134
            for j, src in enumerate((os.path.join(before, look, 'rest_128.png'), os.path.join(ROOT, CREW_OUT, look, 'rest_128.png'))):
                f = Image.open(src).convert('RGBA'); S.paste((58, 52, 46), (x, y + j * 134, x + 128, y + j * 134 + 128)); S.paste(f, (x, y + j * 134), f)
    rows_sheet(out, 'PORTRAIT: THE SPEAKERS\' FACES (rule 115h, a fresh portrait never a zoom). The thirteen gangs the settlement\'s street draws, each head MODELLED on its gang\'s own body (the rig looks he voted up). A PLACEHOLDER.',
               ['head 128 px chin to crown, camera tilt 80, one pixel size, block 1 | palette: style palette steps (skin from the game\'s own face, hair and gear from the worn list) | ONE light: the rig\'s sun, upper left, above | wear 0.45',
                'the first heads with the face maker\'s dials: no two share a skull (each row says what moved); beards and scars are parts of the model',
                'columns: TODAY (the game\'s 64 px face, 2x) | S | SE | SW | talking A | O | Angry, all 1:1 straight from DIRECTION\'s rig, unedited'],
               rows, 'today (64 px)', (foot, 190 + (300 if before else 0)))


def maker_sheet(out):
    """[the starred face, customisable]: six faces built with the controls on the player's own body, beside the starred
    default they were all dialled from"""
    rows = [('THE STARRED DEFAULT (YOU, round 1)', 'every dial at its middle: the head all six are dialled from', None, os.path.join(CREW_FRAMES, 'you'))]
    for i, c in enumerate(MAKER):
        hj = json.load(open(os.path.join(ROOT, 'records/portrait/rig/maker/maker_%d_head.json' % (i + 1))))
        rows.append(('%d. %s' % (i + 1, c['name']), 'cut: %s, %s | gear: %s | %s%s | face: %s' % (
            CUT_NAME[c['hair']], c['hair_colour'], c['gear'] or 'none', 'beard: %s' % c['beard'] if c.get('beard') else 'clean shaven',
            ', scar: %s' % c['scar'] if c.get('scar') else '', dial_text(hj['face']['dials'])), None, os.path.join('records/target/portrait/rig/maker', 'maker_%d' % (i + 1))))
    rows_sheet(out, 'PORTRAIT: THE STARRED FACE, CUSTOMISABLE (Paolo 10/18: \'We can customise that shit?\' Yes). Six faces built with the face maker\'s controls on ONE head, the player\'s own body. A PLACEHOLDER.',
               ['head 128 px chin to crown, camera tilt 80, one pixel size, block 1 | skin: style palette steps; hair: the face maker\'s own 21 colours (his swatches) | ONE light: the rig\'s sun, upper left, above | wear 0.45',
                'the fourteen controls are the face maker\'s own (length, cranium, forehead, cheeks, jaw, chin, brow / eye / nose / mouth height, eye spacing, brow length, mouth width, nose width)',
                'the cut, the head gear, the beard and the scar are parts of the same model; the mouth still talks on every face (A, O) and the moods still play (Angry)',
                'columns: S | SE | SW | talking A | O | Angry, all 1:1 straight from DIRECTION\'s rig, unedited'],
               rows, '')


def dials_spec(out):
    """THE HAND-OFF TO CHARACTER (it owns the face maker's dials and wires them): the controls, their ranges and defaults,
    what each moves on the model in metres, and every part the head can wear"""
    F0 = face_dials(None)
    spec = dict(version='head-dials-10-18d', lane='portrait', row='[the starred face, customisable]', law='HE CAN BUILD HIS OWN FACE (8/28), on the modelled head (rule 115h)',
                draft=True, tool='tools/bohemia_portrait_the_head_from_the_model.py (face_dials, warp, face_push)',
                how='a person\'s face spec is a dict of these keys (any subset; missing keys are the default); the tool clamps it with the 2D panel\'s own anatomy rules, builds the head on the body, and DIRECTION\'s rig renders it. Every default together is the starred head, unchanged.',
                dials=[dict(key=k, label=l, lo=lo, hi=hi, default=d, units='the 64 px face\'s pixels (the alpha\'s FACE_SLIDERS)',
                            moves={'face.len': 'the face below the head\'s centre stretches, the chin 5.8 mm a pixel (the neck stays in its collar)', 'face.craniumH': 'the skull above the centre stretches, the crown 5.8 mm a pixel',
                                   'face.foreheadW': 'the width above the brow, 2.9 percent a pixel', 'face.cheekW': 'the width at the cheekbones, 2.3 percent a pixel',
                                   'face.jawW': 'the width at the jaw\'s corner, 2.7 percent a pixel', 'face.chinW': 'the chin\'s width, 3.75 percent a pixel',
                                   'face.browY': 'the brow ridge up or down, 5.8 mm a pixel (held under 15 mm)', 'face.eyeY': 'the eyes and their sockets up or down, 5.8 mm a pixel (13 mm max)',
                                   'face.noseY': 'the nose up or down, 5.8 mm a pixel (18 mm max)', 'face.mouthY': 'the mouth and lips up or down, 5.8 mm a pixel (14 mm max)',
                                   'eyes.gap': 'each eye out from the middle, 3.5 mm a pixel (18 mm max)', 'brows.len': 'the brow ridge\'s length, 8.6 percent a pixel',
                                   'mouth.w': 'the mouth\'s width (and the speak-along shapes with it), 6.7 percent a pixel', 'nose.w': 'the nose and its wings, 16.7 percent a pixel'}[k])
                       for k, l, lo, hi, d in FACE_DIALS],
                clamps=['cheeks >= forehead + 2', 'jaw <= cheeks - 1', 'chin <= jaw - 6', '5 <= mouth <= jaw - 8'],
                parts=dict(cuts=sorted(CUT_NAME), extra_cuts=['buzz (the thug)', 'curls (the poacher)'],
                           gear=['knit cap', 'watch cap', 'slouch beanie', 'work cap', 'skull cap', 'field hat', 'cone hat', None],
                           beard=[None, 'stubble', 'moustache', 'goatee', 'full'], scar=[None] + sorted(SCARS),
                           hair_colours=dict(HAIR_COLORS), skin='a step of skin_light, skin_mid or skin_deep (records/target/BOHEMIA_STYLE_PALETTE.json)'),
                example=dict((c['name'], dict(face=c['face'], skin=c['skin'], hair=c['hair'], hair_colour=c['hair_colour'], gear=c['gear'], beard=c.get('beard'), scar=c.get('scar'))) for c in MAKER),
                identity_check='every dial at its default: F[\'identity\'] is %s and the warp is skipped, so the poacher, the thug and the crew\'s thirteen rebuild unchanged (measured 10/18d: the same vertex counts and materials, positions within 1.5e-8 m, the export\'s own run-to-run noise)' % F0['identity'])
    json.dump(spec, open(os.path.join(ROOT, out), 'w'), indent=1); print('spec', out)


if __name__ == '__main__':
    if sys.argv[1] == '--faction-faces':
        crew_faces('faction'); crew_faces('crew')
        faction_sheet('records/target/portrait/PORTRAIT_THE_SPEAKERS_FACES.png', sys.argv[2] if len(sys.argv) > 2 else None); sys.exit(0)
    if sys.argv[1] == '--maker-sheet':
        dials_spec('records/portrait/BOHEMIA_HEAD_DIALS.json'); maker_sheet(sys.argv[2] if len(sys.argv) > 2 else 'records/target/portrait/PORTRAIT_THE_STARRED_FACE_CUSTOMISABLE.png'); sys.exit(0)
    if sys.argv[1] == '--crew-faces':
        crew_faces(); crew_sheet(sys.argv[2] if len(sys.argv) > 2 else 'records/target/portrait/PORTRAIT_EVERY_FACE_FROM_THE_SAME_MODEL.png'); sys.exit(0)
    if sys.argv[1] == '--crew-body':
        crew_body(sys.argv[2].upper(), sys.argv[3] if len(sys.argv) > 3 else CREW_BODIES)
    elif sys.argv[1] == '--faction-body':
        faction_body(sys.argv[2].capitalize(), sys.argv[3] if len(sys.argv) > 3 else FACTION_BODIES)
    elif sys.argv[1] == '--sheet':
        sheet(sys.argv[2].upper(), sys.argv[3], sys.argv[4])
    else:
        build(sys.argv[1].upper(), os.path.abspath(sys.argv[2]))
