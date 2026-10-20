#!/usr/bin/env python3
"""CHARACTER GARMENTS OUTER: the three VOTE cards (BASE 1's card tool) (rule 118b: the card id is in the registry in the same push as the words
that name it). Appends one object to records/target/BOHEMIA_VOTE_REGISTRY.json without re-dumping anybody else's rows
(the text is inserted before the items array closes), and never twice.
Run: python3 tools/bohemia_character_garments_outer_card.py <part 1|2|3> <sha> [held names, comma separated]
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_garments_outer as GB  # noqa: E402

REG = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
BASE = 'records/target/character/barber'
FAC = ('S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW')

WORDS = {
    1: dict(title="THE GAME'S {n} LONG COATS ON THE 3D BODY: TRENCHES, DUSTERS, LONGCOATS AND SPLIT TAILS",
            why=("You said every 2D piece has to go 3D, so every long coat the game has is now modelled on the barber's 3D man, "
                 "each shape made once and every coat in its own colour, the starred head on top. "
                 "In the VOTE tab you see it: every coat beside the game's flat coat at real size, turning all eight ways, and at portrait size."),
            diffs=["THE SKIRT: the game draws a long coat as a flat panel below the belt; ours is a skirt cut to a pattern that hangs from the hip, flares a little to the hem and parts over each leg when he walks.",
                   "THE FRONT: the game paints a dark slit down the front only when he faces you; ours is a real opening with a lapel down each edge, a tall closed collar, and on a duster the whole front hanging open under a capelet.",
                   "THE NAMES: the game's trench, duster and longcoat are the same coat in other colours; ours are three garments: the trench belted with a double row of buttons, the duster open with a capelet, the longcoat closed with pockets."]),
    2: dict(title="THE GAME'S {n} SHORT COATS ON THE 3D BODY: CAR COATS, CHORE COATS, JACKETS AND VESTS",
            why=("The short coats are next in the clothes line, so every car coat, chore coat, jacket and vest the game has is modelled on the 3D man, "
                 "with pockets, cuffs and collars, each in its own colour. "
                 "In the VOTE tab you see it: every coat beside the game's flat coat at real size, turning all eight ways, and at portrait size."),
            diffs=["THE LENGTHS: the game's car and chore coats are its long coat cut shorter; ours are their own cuts, a chore coat to the upper thigh with patch pockets and flaps, a car coat to the knee.",
                   "THE JACKETS: the game's jacket stops at the waist on a band of dark pixels; ours sits on a ribbed waistband with ribbed cuffs, and a leather one has a zip down both edges.",
                   "THE VESTS: the game's vest is the torso in a colour; ours hangs fully open with cut armholes, and a tactical vest carries four pouches, a quilted one is stitched in channels."]),
    3: dict(title="THE GAME'S {n} RUNWAY COATS AND WORK CLOTHES ON THE 3D BODY: COCOON, COMMA, WRAP AND SLANTED COATS, PONCHOS AND APRONS",
            why=("The runway coats and the work clothes finish the outer layer, so every cocoon, comma, wrap and slanted coat, poncho and apron the game has is modelled on the 3D man, each in its own colour. "
                 "In the VOTE tab you see it: every piece beside the game's flat one at real size, turning all eight ways, and at portrait size."),
            diffs=["THE RUNWAY CUTS: the game draws its cocoon, comma, wrap and slanted coats as outlines; ours are the shapes: the cocoon blown out round the shoulders and narrowing to the hem, the comma longer behind, the wrap crossing the body on a belt, the slanted hem long on one side.",
                   "THE PONCHOS: the game's poncho is a block over the torso; ours is one blanket hung from the shoulders over the arms, a neck hole, two woven bands above a fringed hem, and the hooded one has the hood up over the head.",
                   "THE APRONS: the game's apron is a panel of colour; ours hangs on a strap round the neck and ties at the waist, and the smith's is heavy leather with rivets at the corners."]),
}


def main():
    part = int(sys.argv[1]); sha = sys.argv[2]
    held = set(n.strip().upper() for n in (sys.argv[3] if len(sys.argv) > 3 else '').split(',') if n.strip())
    title, cid, shapes = GB.PARTS[part - 1]; W = WORDS[part]
    raw = open(REG).read(); reg = json.loads(raw)
    if any(i.get('id') == cid for i in reg['items']):
        print('already registered: ' + cid); return
    sheet = 'records/target/character/CHARACTER_OUTER_ONE_%d.png' % part
    first = json.load(open(os.path.join(ROOT, sheet.replace('.png', '_FIRST.json'))))
    tops = [G for G in GB.BANK if G['shape'] in shapes and G['name'] not in held and os.path.exists(os.path.join(ROOT, BASE, G['tag'], 'rig_S.png'))]
    twin_tag = GB.BY[first['first']]['tag']
    item = {
        'id': cid, 'kind': 'outfit', 'lane': 'character', 'made': '10/20', 'sha': sha, 'draft': True,
        'title': W['title'].format(n=len(tops)), 'why': W['why'],
        'show': {'how': 'image', 'src': '../' + sheet, 'first': '../' + sheet.replace('.png', '_FIRST.png'), 'firstAt': first['firstAt']},
        'twin': {'src': 'records/target/character/barber_flat/%s_SE_k01.png' % twin_tag, 'diffs': W['diffs']},
        'before_after': {'before': "the game's flat body wearing each coat today (GAME, left of every row)",
                         'after': 'the same coat modelled on the 3D body: eight facings at 1:1 and the portrait at 128', 'scale': '1:1'},
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
    print('registered %s at %s, %d coats' % (cid, sha, len(tops)))


if __name__ == '__main__':
    main()
