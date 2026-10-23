#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [way more hair and faces] -> RUN TWO [no two people alike]: THE BARBER'S BOOK AND THE ROLL
(rule 121(i): 'THERE'S SO MANY OF THE SAME HATS AND SHIT ON THE CHARACTERS... ALL THE CLAY PEOPLE HAVE LIKE 2 OPTIONS
FOR CUSTOMIZATIONS, IT'S INSANE'; his 10/19 on the faces card: 'what's up with the Chinese hats and the Weird hats on
these people like give them hairstyles... the whole enchilada'; the coordinator's note on RUN TWO's row: hair first,
hats rare, the cone hat and the odd wraps out of the random mix, every top, cut and face piece in play).

THE BOOK (records/target/character/BOHEMIA_THE_BARBERS_BOOK.json) is every piece CHARACTER has made on the 3D man, by
kind, each with the name the barber's build takes, its renders, its card and his verdict on it: the cuts (the barber's
three, HAIR 1's eight, HAIR 2's twelve), the face shapes (FACES 1, the face maker's dials), the facial hair, the marks,
the hats (HATS 1), the face pieces (EYEWEAR 1), the tops (GARMENTS BASE), the hair colours and the skins (the census mix
of ONE SKIN). Nothing in it is new art; it is the index RUN TWO's row asked for.

THE ROLL: a person is one draw from the book, seeded by his id, inside his gang: his skin from Clark County's census mix
(ONE SKIN's own table), his cut (the cuts his gang wears weigh three times), a hair colour (black and brown most, grey
with the balding cuts, bleach rare), a face shape (or the starred default), facial hair on about half, a mark on one in
five, a hat on about one in eight and only over a short cut (never the cone hat, never a wrap or the shemagh, his
10/19), a face piece on one in ten. A roll file is what the barber builds:
    python3 tools/bohemia_character_the_barbers_book.py                       # the book
    python3 tools/bohemia_character_the_barbers_book.py roll Mob 20 <out.json>   # twenty Mob, no two alike
    <venv>/bin/python tools/bohemia_character_the_barber_on_the_skull.py build PEOPLE:<out.json>
then each person through DIRECTION's rig (--clip Stand:1 --clip Anim_0:6 for the walk the map draws) and RUN's bake.

REUSE CHECK: every name is a CUTS entry of this lane's tools; the skins are ONE SKIN's table; nothing is drawn here.
"""
import json
import os
import random
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
import bohemia_character_hair_one as H1  # noqa: E402
import bohemia_character_hair_two as H2  # noqa: E402
import bohemia_character_faces_one as F1  # noqa: E402
import bohemia_character_hats_one as HATS  # noqa: E402
import bohemia_character_eyewear_one as EYE  # noqa: E402
import bohemia_character_garments_base as TOPS  # noqa: E402
import bohemia_character_garments_outer as COATS  # noqa: E402
import bohemia_character_garments_legs as LEGS  # noqa: E402   (the 45 trousers and 40 shoes, 10/23)
import bohemia_character_garments_gear as GEAR  # noqa: E402   (the 68 bags, capes, pads, scarves, belts and gloves, 10/23)

BOOK = os.path.join(ROOT, 'records/target/character/BOHEMIA_THE_BARBERS_BOOK.json')
REG = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
ONE_SKIN = os.path.join(ROOT, 'records/target/character/BOHEMIA_ONE_SKIN.json')
RENDERS = 'records/target/character/barber/%s'
GANGS = ['Anarchists', 'Blues', 'Caravans', 'Cartel', 'Church', 'Colorful', 'Homeless', 'Mob', 'Network', 'Reds', 'Remnants',
         'Trades', 'Volunteers']
FIRST3 = {'TEMPLE TAPER': ('temple_taper', 'Body, Trades, Network, Remnants'), 'COIL CROWN': ('coil_crown', 'Caravans, Church'),
          'LAYERED FALL': ('layered_fall', 'Anarchists, Homeless')}
CARD_OF = {}
for n in FIRST3: CARD_OF[n] = 'character-the-barber-on-the-skull-10-18'
for n in H1.ORDER: CARD_OF[n] = 'character-hair-one-clumps-not-links-10-19'
for n in H2.ORDER: CARD_OF[n] = 'character-hair-two-the-whole-enchilada-10-19'
for n in F1.SHAPE_ORDER: CARD_OF[n] = 'character-faces-one-twelve-face-shapes-10-19'
for n in F1.PIECE_ORDER: CARD_OF[n] = 'character-faces-one-beards-and-marks-10-19'
for n in HATS.ORDER: CARD_OF[n] = 'character-hats-one-the-21-hats-10-19'
for n in EYE.ORDER: CARD_OF[n] = 'character-eyewear-one-the-14-face-pieces-10-19'
SHORT = {'TEMPLE TAPER', 'DRY TAPER', 'DEEP TAPER', 'RAZOR SKULL', 'HOME CLIPPERS', 'HORSESHOE', 'GREASE BACK', 'SCORCH', 'SHORT ROPES'}
BALDING = {'HORSESHOE', 'COMB OVER'}
# the random mix leaves out what he called weird (10/19): the cone hat, the wraps, the shemagh; a player can still pick them
NOT_RANDOM_HATS = {n for n in HATS.ORDER if HATS.CUTS[n]['shape'] in ('cone', 'wrap', 'shemagh')}
# hair colours: palette steps at the barber's dark step (the rig lifts them), with how often a crowd wears them
HAIR_COLOURS = [(('cloth_black', 0), 34, 'black'), (('clay_mustard', 0), 26, 'brown'), (('clay_mustard', 1), 9, 'light brown'),
                (('tape_grey', 1), 10, 'grey'), (('tape_masking', 1), 8, 'sand'), (('clay_rust', 1), 6, 'auburn'),
                (('clay_bone', 2), 4, 'bleach'), (('cloth_black', 1), 3, 'dyed black')]
HERITAGE_TONES = {'white': ['chalk', 'porcelain', 'pale', 'fair', 'olive'], 'hispanic': ['olive', 'tan', 'bronze', 'brown'],
                  'black': ['brown', 'deep', 'ebony', 'onyx'], 'asian': ['pale', 'fair', 'olive', 'tan'],
                  'mixed': ['tan', 'bronze', 'brown', 'olive']}


def verdicts():
    try:
        reg = json.load(open(REG))
    except Exception:
        return {}
    out = {}
    for v in reg.get('verdicts', []):
        if v and v.get('id'): out[v['id']] = v.get('v') or v.get('verdict') or v.get('vote')
    return out


def garment_card(MOD, G):
    """a top's or a coat's card, his vote on it, and whether the card left it out (held by the guide's first five)"""
    cid = next((c for _, c, shapes in MOD.PARTS if G['shape'] in shapes), None)
    try:
        reg = json.load(open(REG))
    except Exception:
        reg = {}
    it = next((i for i in reg.get('items', []) if i.get('id') == cid), None)
    held = bool(it) and ('/%s/' % G['tag']) not in ' '.join(it.get('sprites', []))
    return dict(card=cid, his_vote=verdicts().get(cid), held=held)


def cuts():
    rows = []
    for n, (tag, worn) in FIRST3.items():
        rows.append(dict(name=n, tag=tag, worn_by=worn, made_by='CHARACTER 10/18', held=False))
    for n in H1.ORDER:
        rows.append(dict(name=n, tag=H1.CUTS[n]['tag'], worn_by=H1.CUTS[n]['worn_by'], made_by='CHARACTER 10/19 (HAIR 1)',
                         held=n in H1.HELD, held_why=H1.HELD.get(n)))
    for n in H2.ORDER:
        rows.append(dict(name=n, tag=H2.CUTS[n]['tag'], worn_by=H2.CUTS[n]['worn_by'], made_by='CHARACTER 10/19 (HAIR 2)',
                         held=n in H2.HELD, held_why=H2.HELD.get(n), colour=list(H2.CUTS[n]['hair'])))
    for r in rows:
        r['short'] = r['name'] in SHORT; r['balding'] = r['name'] in BALDING
    return rows


def book():
    V = verdicts()
    def card(n):
        c = CARD_OF.get(n); return dict(card=c, his_vote=V.get(c))
    def rend(tag): return RENDERS % tag
    sk = json.load(open(ONE_SKIN))
    B = dict(
        what="CHARACTER's barber's book: every piece made on the 3D man, by kind, the names the barber's build takes, for RUN TWO [no two people alike]",
        rule='121(i) and (k); Paolo 10/19: way more facial customization, hair options; the whole enchilada; hair first, hats rare',
        lane='character', date='10/19', draft=True,
        how_to_build=("a roll file (python3 tools/bohemia_character_the_barbers_book.py roll <Gang> <n> <out.json>), then "
                      "<venv>/bin/python tools/bohemia_character_the_barber_on_the_skull.py build PEOPLE:<out.json>, then per person "
                      "<venv>/bin/python tools/bohemia_direction_master_rig.py records/character/rig/barber_person_<id>.glb "
                      "records/target/character/barber/person_<id> --real-height <real_height_for_rig> --family none --clip Stand:1 "
                      "--clip Anim_0:6 --portrait 128, then RUN's bake (tools/bohemia_bake_the_rig_cast.py) over those folders"),
        recolour=("every render's rig.json carries id_table (the material-ID pass): the hair is the material named barber_<tag>_hair; "
                  "a crowd that needs more colours than it renders can re-tint those pixels by the id pass instead of re-rendering"),
        cuts=[dict(r, renders=rend(r['tag']), **card(r['name'])) for r in cuts()],
        face_shapes=[dict(name='THE STARRED FACE', dials={}, note="the default: every head today")] +
                    [dict(name=F1.CUTS[n]['label'], build=n, dials=F1.CUTS[n]['face'], renders=rend(F1.CUTS[n]['tag']), **card(n))
                     for n in F1.SHAPE_ORDER],
        face_dials=[dict(key=k, label=l, lo=lo, hi=hi, default=d) for k, l, lo, hi, d in __import__('bohemia_portrait_the_head_from_the_model').FACE_DIALS],
        facial_hair=[dict(name=F1.CUTS[n]['label'], build=n, portrait_part=F1.CUTS[n].get('beard'), new_kind=F1.CUTS[n].get('new_beard'),
                          stubble=F1.CUTS[n].get('stubble'), made_by=F1.CUTS[n]['made_by'], renders=rend(F1.CUTS[n]['tag']), **card(n))
                     for n in F1.PIECE_ORDER if F1.CUTS[n]['group'] == 'beard'],
        marks=[dict(name=F1.CUTS[n]['label'], build=n, portrait_scar=F1.CUTS[n].get('scar'), new_kind=F1.CUTS[n].get('mark'),
                    made_by=F1.CUTS[n]['made_by'], renders=rend(F1.CUTS[n]['tag']), **card(n))
               for n in F1.PIECE_ORDER if F1.CUTS[n]['group'] == 'mark'],
        hats=[dict(name=n, shape=HATS.CUTS[n]['shape'], in_random_mix=n not in NOT_RANDOM_HATS, renders=rend(HATS.CUTS[n]['tag']), **card(n))
              for n in HATS.ORDER],
        face_pieces=[dict(name=n, renders=rend(EYE.CUTS[n]['tag']), **card(n)) for n in EYE.ORDER],
        # the clothes (BASE 1's 80 tops, OUTER 1's 74 coats, 10/20): each on its own body (the barber's mannequin in it), its
        # card, and held when its card left it out (the guide's light row); a person's clothes are his gang's look today
        tops=[dict(name=G['name'], build='BASE ' + G['name'], shape=G['shape'], renders=rend(G['tag']), **garment_card(TOPS, G)) for G in TOPS.BANK],
        coats=[dict(name=G['name'], build='OUTER ' + G['name'], shape=G['shape'], renders=rend(G['tag']), **garment_card(COATS, G)) for G in COATS.BANK],
        # LEGS AND FEET (10/23, rule 123: no card, straight into the people): every person rolls his own pair (roll_one, below)
        trousers=[dict(name=G['name'], build='LEGS ' + G['name'], shape=G['shape'], held=G['name'] in LEGS.HELD) for G in LEGS.LEGS],
        shoes=[dict(name=G['name'], build='FEET ' + G['name'], shape=G['shape'], held=G['name'] in LEGS.HELD) for G in LEGS.FEET],
        kit=[dict(name=G['name'], build='KIT ' + G['name'], slot=G['slot'], kind=G['kind'], held=G['name'] in GEAR.HELD) for G in GEAR.BANK],
        hair_colours=[dict(step=list(s), weight=w, name=nm) for s, w, nm in HAIR_COLOURS],
        skins=dict(census=sk['mix']['target_census'], tones=HERITAGE_TONES, rig_table=sk['rig_table'], source=sk['mix']['source']),
        roll=dict(facial_hair=0.45, mark=0.20, hat=0.12, hat_only_over='a short cut', face_piece=0.10, gang_cut_weight=3,
                  not_in_random_mix=sorted(NOT_RANDOM_HATS), grey_with=sorted(BALDING)),
    )
    n_cuts = sum(1 for c in B['cuts'] if not c['held'])
    B['count'] = dict(cuts=n_cuts, face_shapes=len(B['face_shapes']), facial_hair=len(B['facial_hair']) + 1, marks=len(B['marks']) + 1,
                      hair_colours=len(HAIR_COLOURS), skins=len(sk['rig_table']), hats=len(B['hats']), face_pieces=len(B['face_pieces']),
                      tops=sum(1 for t in B['tops'] if not t['held']), coats=sum(1 for t in B['coats'] if not t['held']),
                      trousers=sum(1 for t in B['trousers'] if not t['held']), shoes=sum(1 for t in B['shoes'] if not t['held']),
                      kit=sum(1 for t in B['kit'] if not t['held']))
    c = B['count']
    B['count']['heads'] = c['cuts'] * c['face_shapes'] * c['facial_hair'] * c['marks'] * c['hair_colours'] * c['skins']
    json.dump(B, open(BOOK, 'w'), indent=1)
    print('wrote %s: %s' % (os.path.relpath(BOOK, ROOT), json.dumps(B['count'])))
    return B


def pick(rng, items):
    tot = sum(w for _, w in items); x = rng.random() * tot
    for it, w in items:
        x -= w
        if x <= 0: return it
    return items[-1][0]


def roll_one(B, gang, pid):
    rng = random.Random('%s:%s' % (gang, pid))
    census = B['skins']['census']
    her = pick(rng, list(census.items()))
    tone = rng.choice(B['skins']['tones'][her]); skin = B['skins']['rig_table'][tone]
    cut_rows = [c for c in B['cuts'] if not c['held']]
    cut = pick(rng, [(c, 3 if gang in c['worn_by'] else 1) for c in cut_rows])
    if cut['balding']: hair = list(pick(rng, [(('tape_grey', 1), 6), (('cloth_black', 1), 3), (('clay_mustard', 0), 1)]))
    elif cut.get('colour') and rng.random() < 0.35: hair = cut['colour']
    else: hair = list(pick(rng, [(s, w) for s, w, _ in HAIR_COLOURS]))
    face = rng.choice(B['face_shapes'])
    P = dict(id='%s_%s' % (gang.lower(), pid), gang=gang, heritage=her, tone=tone, skin=skin, hair_cut=cut['name'], hair=hair,
             face=face['dials'] or None, face_name=face['name'])
    if rng.random() < B['roll']['facial_hair']:
        fh = rng.choice(B['facial_hair'])
        P['facial_hair'] = fh['name']
        if fh['portrait_part']: P['beard'] = fh['portrait_part']
        if fh['new_kind']: P['new_beard'] = fh['new_kind']
        if fh['stubble']: P['stubble'] = True
    if rng.random() < B['roll']['mark']:
        mk = rng.choice(B['marks']); P['mark_name'] = mk['name']
        if mk['portrait_scar']: P['scar'] = mk['portrait_scar']
        if mk['new_kind']: P['mark'] = mk['new_kind']
    if cut['short'] and rng.random() < B['roll']['hat']:
        P['hat'] = rng.choice([h['name'] for h in B['hats'] if h['in_random_mix']])
    if rng.random() < B['roll']['face_piece']:
        P['eyewear'] = rng.choice([f['name'] for f in B['face_pieces']])
    P.update(LEGS.roll_wear(gang, pid))   # his trousers and shoes, on their own random stream (every draw above unchanged)
    P['kit'] = GEAR.roll_kit(gang, pid)   # his bag, scarf, belt, pads or gloves, none to a few, on their own stream
    return P


def key(P):
    return tuple(json.dumps(P.get(k), sort_keys=True) for k in ('skin', 'hair_cut', 'hair', 'face', 'beard', 'new_beard', 'stubble', 'scar', 'mark', 'hat', 'eyewear', 'legs', 'feet', 'kit'))


def roll(gang, n, out):
    B = json.load(open(BOOK)) if os.path.exists(BOOK) else book()
    people, seen, i = [], set(), 0
    while len(people) < n:
        P = roll_one(B, gang, i); i += 1
        if key(P) in seen: continue   # no two alike: a repeat is re-drawn, never kept
        seen.add(key(P)); people.append(P)
    json.dump(people, open(out, 'w'), indent=1)
    print('rolled %d %s, no two alike (%d draws) -> %s' % (n, gang, i, out))


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'roll':
        roll(sys.argv[2], int(sys.argv[3]), sys.argv[4])
    else:
        book()
