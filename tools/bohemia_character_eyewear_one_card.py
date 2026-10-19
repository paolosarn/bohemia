#!/usr/bin/env python3
"""CHARACTER EYEWEAR 1: the VOTE card (rule 118b: the card id is in the registry in the same push as the words that name it).

Appends one object to records/target/BOHEMIA_VOTE_REGISTRY.json without re-dumping anybody else's rows (the text is
inserted before the items array closes), and never twice.
Run: python3 tools/bohemia_character_hair_one_card.py <sha>
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_eyewear_one as HT  # noqa: E402

REG = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
ID = 'character-eyewear-one-the-14-face-pieces-10-19'
HELD = {}   # filled from the first-five test before the card is written (rule 114b)


def main():
    sha = sys.argv[1]
    raw = open(REG).read(); reg = json.loads(raw)
    if any(i.get('id') == ID for i in reg['items']):
        print('already registered: ' + ID); return
    first = json.load(open(os.path.join(ROOT, 'records/target/character/CHARACTER_EYEWEAR_ONE_FIRST.json')))
    item = {
        'id': ID, 'kind': 'outfit', 'lane': 'character', 'made': '10/19', 'sha': sha, 'draft': True,
        'title': "THE GAME'S 14 FACE PIECES ON THE 3D HEAD: DUST MASKS, WRAPAROUND SHADES, A GAS MASK, BANDANAS, VISORS, FACE WRAPS",
        'why': ("You said the sunglasses still need your OK, so every face piece the game has is modelled on the starred head, "
                "six kinds made once each and every piece in its own colour, laid over the face without hiding who he is. "
                "In the VOTE tab you see it: every piece beside the game's flat one at real size, turning all eight ways, and at portrait size."),
        'show': {'how': 'image', 'src': '../records/target/character/CHARACTER_EYEWEAR_ONE.png',
                 'first': '../records/target/character/CHARACTER_EYEWEAR_ONE_FIRST.png', 'firstAt': first['firstAt']},
        'twin': {'src': 'records/target/character/barber_flat/face_rubber_gas_mask_SE_k01.png', 'diffs': [
            "THE MASKS: the game's dust masks are a block of colour across the lower face; ours stand off the nose like cloth does, with three pleats and two straps round the head.",
            "THE SHADES: the game's wraparounds are a dark strip over the eyes; ours are one curved lens band from temple to temple, standing off the brow, with arms back to the ears.",
            "THE GAS MASK AND THE REST: the game's gas mask is a dark face with two lighter dots; ours is a rubber face with two round lenses in rings and a filter at the mouth, the bandana hangs to a point with a knot behind, the face wrap is three turns of cloth."]},
        'before_after': {'before': "the game's flat body wearing each hat today (GAME, left of every row)",
                         'after': 'the same hat modelled on the 3D head: eight facings at 1:1 and the portrait at 128', 'scale': '1:1'},
        'sprites': ['records/target/character/barber/%s/rig_%s.png' % ('face_' + n.lower().replace(' ', '_'), f) for n, _, _ in HT.PIECES if n not in HELD
                    for f in ('S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW')],
        'class': 'person',
        'look': {'px': 1, 'palette': 'records/target/BOHEMIA_STYLE_PALETTE.json', 'light': 'guide'},
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
    print('registered %s at %s' % (ID, sha))


if __name__ == '__main__':
    main()
