#!/usr/bin/env python3
"""CHARACTER HAIR 1: the VOTE card (rule 118b: the card id is in the registry in the same push as the words that name it).

Appends one object to records/target/BOHEMIA_VOTE_REGISTRY.json without re-dumping anybody else's rows (the text is
inserted before the items array closes), and never twice.
Run: python3 tools/bohemia_character_hair_one_card.py <sha>
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_hair_one as H1  # noqa: E402

REG = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
ID = 'character-hair-one-clumps-not-links-10-19'


def main():
    sha = sys.argv[1]
    raw = open(REG).read(); reg = json.loads(raw)
    if any(i.get('id') == ID for i in reg['items']):
        print('already registered: ' + ID); return
    first = json.load(open(os.path.join(ROOT, 'records/target/character/CHARACTER_HAIR_ONE_FIRST.json')))
    item = {
        'id': ID, 'kind': 'haircut', 'lane': 'character', 'made': '10/19', 'sha': sha, 'draft': True,
        'title': "SIX MORE BARBER HAIRCUTS ON THE 3D HEAD, MADE OF CLUMPS, LOCKS AND BRAIDS, NOT CHAIN MAIL",
        'why': ("You said some hair looked like medieval chain mail and that the hair still needs your OK, so six more of the "
                "barber's cuts are sculpted on the starred head as clumps, short ropes and braids, next to the three you liked. "
                "In the VOTE tab you see it: every cut beside the game's flat cut at real size, turning all eight ways, and at portrait size."),
        'show': {'how': 'image', 'src': '../records/target/character/CHARACTER_HAIR_ONE.png',
                 'first': '../records/target/character/CHARACTER_HAIR_ONE_FIRST.png', 'firstAt': first['firstAt']},
        'twin': {'src': 'records/target/character/barber_flat/dust_weave_SE_k01.png', 'diffs': [
            "THE SHORT ROPES: the game's flat SHORT ROPES is a brown shape with a few lighter pixels; ours is a head of separate short ropes, each with two strands twisted round it, from sections of the scalp.",
            "THE SHORT CUTS: the game's tapers fade by pixel rows and its crowns are one flat colour; ours keep the stubble fade and break the crown into clumps combed one way, big, middle and small, never one size of bump.",
            "THE BRAIDS: the game's DUST WEAVE is a cap with a pattern painted on; ours is eleven cornrows that run from the brow to the nape and hang as short braids, each a plait you can count at portrait size."]},
        'before_after': {'before': "the game's flat body wearing each cut today (GAME, left of every row)",
                         'after': 'the same cut sculpted on the 3D head: eight facings at 1:1 and the portrait at 128', 'scale': '1:1'},
        'sprites': ['records/target/character/barber/%s/rig_%s.png' % (H1.CUTS[n]['tag'], f) for n in H1.CARD_ORDER
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
