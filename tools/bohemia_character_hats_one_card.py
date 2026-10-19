#!/usr/bin/env python3
"""CHARACTER HATS 1: the VOTE card (rule 118b: the card id is in the registry in the same push as the words that name it).

Appends one object to records/target/BOHEMIA_VOTE_REGISTRY.json without re-dumping anybody else's rows (the text is
inserted before the items array closes), and never twice.
Run: python3 tools/bohemia_character_hair_one_card.py <sha>
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_hats_one as HT  # noqa: E402

REG = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
ID = 'character-hats-one-the-21-hats-10-19'
HELD = {}   # filled from the first-five test before the card is written (rule 114b)


def main():
    sha = sys.argv[1]
    raw = open(REG).read(); reg = json.loads(raw)
    if any(i.get('id') == ID for i in reg['items']):
        print('already registered: ' + ID); return
    first = json.load(open(os.path.join(ROOT, 'records/target/character/CHARACTER_HATS_ONE_FIRST.json')))
    item = {
        'id': ID, 'kind': 'outfit', 'lane': 'character', 'made': '10/19', 'sha': sha, 'draft': True,
        'title': "THE GAME'S 21 HATS ON THE 3D HEAD: KNIT CAPS, WORK CAPS, A CONE HAT, WRAPS, A SHEMAGH AND A HELM",
        'why': ("You said the hats still need your OK, so every hat the game has is now modelled on the starred head, seven shapes "
                "made once each and every hat in its own colour, with short hair under it. "
                "In the VOTE tab you see it: every hat beside the game's flat hat at real size, turning all eight ways, and at portrait size."),
        'show': {'how': 'image', 'src': '../records/target/character/CHARACTER_HATS_ONE.png',
                 'first': '../records/target/character/CHARACTER_HATS_ONE_FIRST.png', 'firstAt': first['firstAt']},
        'twin': {'src': 'records/target/character/barber_flat/hat_slate_work_cap_SE_k01.png', 'diffs': [
            "THE CAPS: the game's flat work cap is a block of colour with a lighter strip for a brim; ours has six panels meeting at a button and a curved brim that throws a shadow on the face.",
            "THE KNITS: the game's knit caps are one rounded shape; ours have a folded cuff with a lip and knit ribs running down the cap, and the slouch beanies hang their extra length at the back.",
            "THE ODD ONES: the game's cone hat, wraps, shemagh and helm are the same few pixels in other colours; ours are a straw cone on a headband, cloth wound round the head with a knot, a hood wound round the neck, and a dome of riveted scrap plates."]},
        'before_after': {'before': "the game's flat body wearing each hat today (GAME, left of every row)",
                         'after': 'the same hat modelled on the 3D head: eight facings at 1:1 and the portrait at 128', 'scale': '1:1'},
        'sprites': ['records/target/character/barber/%s/rig_%s.png' % ('hat_' + n.lower().replace(' ', '_'), f) for n, _, _ in HT.HATS if n not in HELD
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
