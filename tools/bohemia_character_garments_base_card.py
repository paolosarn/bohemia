#!/usr/bin/env python3
"""CHARACTER GARMENTS BASE: the three VOTE cards (rule 118b: the card id is in the registry in the same push as the words
that name it). Appends one object to records/target/BOHEMIA_VOTE_REGISTRY.json without re-dumping anybody else's rows
(the text is inserted before the items array closes), and never twice.
Run: python3 tools/bohemia_character_garments_base_card.py <part 1|2|3> <sha> [held names, comma separated]
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_garments_base as GB  # noqa: E402

REG = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
BASE = 'records/target/character/barber'
FAC = ('S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW')

WORDS = {
    1: dict(title="THE GAME'S {n} PLAIN TOPS ON THE 3D BODY: TANKS, TEES, LONG SLEEVES AND HENLEYS",
            why=("You said the clothes still need your OK, so every plain top the game has is now modelled on the barber's 3D man, "
                 "each kind made once and every top in its own colour, with the starred head on top. "
                 "In the VOTE tab you see it: every top beside the game's flat top at real size, turning all eight ways, and at portrait size."),
            diffs=["THE NECK: the game's tees and long sleeves are one block of colour up to the chin; ours stop at a ribbed neck band, and a henley has a short placket with three buttons.",
                   "THE SLEEVES: the game cuts a sleeve as a colour change on the arm; ours is cloth that stands off the arm with a hem band (a tee) or a cuff at the wrist (a long sleeve).",
                   "THE TANKS: the game's tank is the torso in one colour; ours has two straps, a scooped front and cut armholes, so the shoulders are bare."]),
    2: dict(title="THE GAME'S {n} COLLARED TOPS ON THE 3D BODY: BUTTON SHIRTS, WORK SHIRTS, FLANNELS AND ROLLED SLEEVES",
            why=("The collared tops are next in the clothes line, so every button shirt, flannel and work shirt the game has is modelled on the 3D man, "
                 "with a real collar, a button placket and a shirt tail, each in its own colour and print. "
                 "In the VOTE tab you see it: every top beside the game's flat top at real size, turning all eight ways, and at portrait size."),
            diffs=["THE COLLAR: the game draws a shirt's collar as a few darker pixels at the neck, or not at all on the oldest shirts; ours has a collar stand, two points falling onto the chest and six buttons down the front.",
                   "THE TAIL: the game's shirts stop flat at the belt like a tee; ours hang a curved shirt tail over the trousers, longer at the front and the back.",
                   "THE PRINT: the game's plaid is a pattern painted over the sprite; ours is the cloth itself, a 16 cm blanket plaid that wraps round the body and every piece of the shirt, collar and tail too."]),
    3: dict(title="THE GAME'S {n} HEAVY AND RUNWAY TOPS ON THE 3D BODY: HOODIES, TURTLENECKS, OVERALLS, RAGS AND THE RUNWAY CUTS",
            why=("The heavy tops and the runway shapes finish the base clothes, so every hoodie, turtleneck, overall, rag and runway cut the game has is modelled on the 3D man, each in its own colour. "
                 "In the VOTE tab you see it: every top beside the game's flat top at real size, turning all eight ways, and at portrait size."),
            diffs=["THE HOODIES: the game's hoodie is a long sleeve with a lump at the neck; ours has the hood lying in a heap on the back (or up over the head, framing the face), drawstrings, a front pocket and a ribbed waistband.",
                   "THE OVERALLS: the game's bib overalls are a bib of colour on the chest; ours are a bib on two straps that cross at the back, with the arms and the chest bare, and the shortalls stop at the knee.",
                   "THE RUNWAY CUTS: the game widens a shoulder by a few pixels; ours builds the square pad, the cocoon dome from neck to elbow, the longline hem to mid-thigh and the second hem of the layered cut as cloth."]),
}


def main():
    part = int(sys.argv[1]); sha = sys.argv[2]
    held = set(n.strip().upper() for n in (sys.argv[3] if len(sys.argv) > 3 else '').split(',') if n.strip())
    title, cid, shapes = GB.PARTS[part - 1]; W = WORDS[part]
    raw = open(REG).read(); reg = json.loads(raw)
    if any(i.get('id') == cid for i in reg['items']):
        print('already registered: ' + cid); return
    sheet = 'records/target/character/CHARACTER_BASE_ONE_%d.png' % part
    first = json.load(open(os.path.join(ROOT, sheet.replace('.png', '_FIRST.json'))))
    tops = [G for G in GB.BANK if G['shape'] in shapes and G['name'] not in held and os.path.exists(os.path.join(ROOT, BASE, G['tag'], 'rig_S.png'))]
    twin_tag = GB.BY[first['first']]['tag']
    item = {
        'id': cid, 'kind': 'outfit', 'lane': 'character', 'made': '10/19', 'sha': sha, 'draft': True,
        'title': W['title'].format(n=len(tops)), 'why': W['why'],
        'show': {'how': 'image', 'src': '../' + sheet, 'first': '../' + sheet.replace('.png', '_FIRST.png'), 'firstAt': first['firstAt']},
        'twin': {'src': 'records/target/character/barber_flat/%s_SE_k01.png' % twin_tag, 'diffs': W['diffs']},
        'before_after': {'before': "the game's flat body wearing each top today (GAME, left of every row)",
                         'after': 'the same top modelled on the 3D body: eight facings at 1:1 and the portrait at 128', 'scale': '1:1'},
        'sprites': ['%s/%s/rig_%s.png' % (BASE, G['tag'], f) for G in tops for f in FAC],
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
    print('registered %s at %s, %d tops' % (cid, sha, len(tops)))


if __name__ == '__main__':
    main()
