#!/usr/bin/env python3
"""CHARACTER [way more hair and faces]: the VOTE cards (rule 118b: the card id is in the registry in the same push as the
words that name it). Three cards: HAIR 2 (the twelve new cuts), FACES 1 SHAPES (twelve face shapes), FACES 1 BEARDS AND
MARKS (eleven kinds of facial hair, eight marks).

Appends each object to records/target/BOHEMIA_VOTE_REGISTRY.json without re-dumping anybody else's rows (inserted before
the items array closes, HAIR 1's card tool), and never twice. A piece HELD by the guide's first five stays off its card.
Run: python3 tools/bohemia_character_hair_two_card.py <sha> hair2|shapes|pieces
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_hair_two as H2  # noqa: E402
import bohemia_character_faces_one as F1  # noqa: E402

REG = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
FAC = ('S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW')
HELD = json.load(open(os.path.join(ROOT, 'records/target/character/BOHEMIA_HAIR_TWO_HELD.json'))) \
    if os.path.exists(os.path.join(ROOT, 'records/target/character/BOHEMIA_HAIR_TWO_HELD.json')) else {}

CARDS = {
    'hair2': dict(
        id='character-hair-two-the-whole-enchilada-10-19', kind='haircut', out='CHARACTER_HAIR_TWO',
        names=lambda: [n for n in H2.ORDER if n not in HELD], tag=lambda n: H2.CUTS[n]['tag'],
        title='TWELVE NEW HAIRCUTS ON THE 3D HEAD: SHAVED, HOME CLIPPERS, BALDING, COMB OVER, SLICKED BACK, LONG, CURLS, BED HEAD, HALF SHAVE, BRAIDS, FINGER WAVES, A BURN',
        why=("You said the clay people need way more hair options, so here are twelve new haircuts on the 3D head, built the "
             "clumps-and-locks way you said yes to, grimy, a few the way people cut their own hair after the money died. "
             "In the VOTE tab you see it: every cut turning all eight ways at real size and at portrait size, next to the closest cut the game has today."),
        twin=('records/target/character/barber_flat/coil_crown_SE_k01.png', [
            "THE NEW SHAPES: the game draws eleven cuts and none of these twelve; each row puts the nearest of the eleven beside the new one, so the jump is a whole new silhouette, not a recolour.",
            "THE GRIME: the game's flat cuts are clean blocks of colour; these carry what a broke city does to a head: a home clipper gouge and missed tufts, shaving nicks, a dyed comb over on a bald crown, a burn scar where nothing grows back.",
            "THE LONG ONES: the game's long cuts are one painted shape; LONG DROP is one curtain of clay that rests on the shoulders and falls over the back, BOX BRAIDS are fifty-odd plaits you can count, SPRING CURLS are spirals of clay."]),
        before='the nearest of the game\'s eleven flat cuts, as the body wears it today (GAME, left of every row)',
        after='the new cut sculpted on the 3D head: eight facings at 1:1 and the portrait at 128'),
    'shapes': dict(
        id='character-faces-one-twelve-face-shapes-10-19', kind='face', out='CHARACTER_FACES_ONE_SHAPES',
        names=lambda: [n for n in F1.SHAPE_ORDER if n not in HELD], tag=lambda n: F1.CUTS[n]['tag'],
        title='TWELVE FACE SHAPES ON THE 3D HEAD: LONG, SQUARE, ROUND, HEART, GAUNT, HEAVY BROW, HIGH DOME, WIDE SET, HAWK, SMALL, LANTERN JAW, FLAT',
        why=("You said you need way more facial customization, so the face maker's fourteen dials now make twelve different "
             "face shapes on the 3D head, each a row of numbers the game can roll so no two people match. "
             "In the VOTE tab you see it: every face at portrait size and walking all eight ways, next to the one face every head wears today."),
        twin=('records/target/character/barber/temple_taper/rig_portrait_S.png', [
            "ONE FACE TODAY: every 3D head in the game wears the same starred face at the default dials; these are twelve different skulls from the same model.",
            "THE BONES MOVE: a face shape here changes the skull itself (the jaw, the cheekbones, the chin, the cranium, where the eyes and the nose sit), so the cut and the light follow it.",
            "A ROW OF NUMBERS: each face is the face maker's fourteen dials, so the barber's sliders and the crowd's roll use the same table, never a painted face."]),
        before="the starred face at the default dials, the one face every 3D head wears today (left of every row)",
        after='twelve face shapes from the face maker\'s dials on the same 3D head: eight facings at 1:1 and the portrait at 128'),
    'pieces': dict(
        id='character-faces-one-beards-and-marks-10-19', kind='face', out='CHARACTER_FACES_ONE_BEARDS_AND_MARKS',
        names=lambda: [n for n in F1.PIECE_ORDER if n not in HELD], tag=lambda n: F1.CUTS[n]['tag'],
        title='ELEVEN KINDS OF FACIAL HAIR AND EIGHT MARKS ON THE 3D HEAD: CHIN STRAP, CHOPS, HORSESHOE, PENCIL, LONG BEARD, A BROKEN NOSE, A CAULIFLOWER EAR, STITCHES, A BURN, A CLOUDED EYE',
        why=("You said way more facial customization, so the 3D head now wears eleven kinds of facial hair (seven new) and "
             "eight marks (five new: a broken nose, a cauliflower ear, stitches, a burn, a clouded eye), each one moving with the jaw when he talks. "
             "In the VOTE tab you see it: every piece on the same man at portrait size and walking all eight ways, next to the bare face today."),
        twin=('records/target/character/barber/temple_taper/rig_portrait_S.png', [
            "THE BARE FACE TODAY: the 3D crowd wears no beard and no mark; these are pieces on the same head, rolled per person.",
            "IT TALKS WITH THE FACE: every new beard and burn is cut from the head's own skin and carries its mouth shapes, so it drops with the jaw when he speaks.",
            "THE CITY ON THE FACE: the five new marks are what a city with no doctors leaves: a nose set crooked, an ear that was hit too many times, a gash stitched with the thread still in, a burn healed waxy, an eye gone milky."]),
        before='the bare starred face today (left of every row)',
        after='each beard and mark on the same 3D head: eight facings at 1:1 and the portrait at 128'),
}


def main():
    sha, which = sys.argv[1], sys.argv[2]
    C = CARDS[which]
    raw = open(REG).read(); reg = json.loads(raw)
    if any(i.get('id') == C['id'] for i in reg['items']):
        print('already registered: ' + C['id']); return
    first = json.load(open(os.path.join(ROOT, 'records/target/character/%s_FIRST.json' % C['out'])))
    item = {
        'id': C['id'], 'kind': C['kind'], 'lane': 'character', 'made': '10/19', 'sha': sha, 'draft': True,
        'title': C['title'], 'why': C['why'],
        'show': {'how': 'image', 'src': '../records/target/character/%s.png' % C['out'],
                 'first': '../records/target/character/%s_FIRST.png' % C['out'], 'firstAt': first['firstAt']},
        'twin': {'src': C['twin'][0], 'diffs': C['twin'][1]},
        'before_after': {'before': C['before'], 'after': C['after'], 'scale': '1:1'},
        'sprites': ['records/target/character/barber/%s/rig_%s.png' % (C['tag'](n), f) for n in C['names']() for f in FAC],
        'class': 'person',
        'look': {'px': 1, 'palette': 'records/target/BOHEMIA_STYLE_PALETTE.json', 'light': 'guide'},
        'handed_to': "RUN TWO [no two people alike]: records/target/character/BOHEMIA_THE_BARBERS_BOOK.json",
    }
    key = '"items": ['
    i = raw.find(key); depth = 0; k = i + len(key) - 1
    while True:
        c = raw[k]
        if c == '[': depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0: break
        elif c == '"':
            k += 1
            while raw[k] != '"':
                if raw[k] == '\\': k += 1
                k += 1
        k += 1
    new = raw[:k].rstrip() + ',\n' + '\n'.join(' ' + l for l in json.dumps(item, indent=1).split('\n')) + '\n ' + raw[k:]
    json.loads(new)
    open(REG, 'w').write(new)
    print('registered %s at %s (%d pieces)' % (C['id'], sha, len(C['names']())))


if __name__ == '__main__':
    main()
