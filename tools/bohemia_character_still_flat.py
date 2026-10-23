#!/usr/bin/env python3
"""BOHEMIA -- CHARACTER [every old asset into the new look]: WHAT IS STILL FLAT (10/23/26; rule 123(b): 'COOK EVERY ROUND
is met by the converted family in the game, counted on the lane's inventory (records/)'; the coordinator's dispatch 10/23:
'Count what is left in a record in records/ after every family; that count going down is your proof').

Every piece a person can wear (the roll call's rows: the alpha's GARMENTS table and the player's paper doll), each in one
of three states, read off this lane's own modules, never off a card:
  flat              no 3D model exists: the game can only draw it with the old flat generator
  3d, not rolled    modelled on the 3D man, but no person in the crowd can roll it yet (a held piece; a hat or a wrap the
                    random mix leaves out by his 10/19 word; a piece only one gang's look wears)
  3d, rolled        modelled on the 3D man and in the roll every person is built from (the barber's book; RUN TWO's
                    [no two people alike] rolls from it, unedited)
A dead shape is listed apart and never counted (GRAVEYARD IS FINAL).

Out: records/target/character/BOHEMIA_CHARACTER_STILL_FLAT.json (the count, by family, with every flat name)
     and the history line printed for records/BOHEMIA_CHARACTER_WHAT_IS_STILL_FLAT_10_23_26.md
Run: python3 tools/bohemia_character_roll_call.py first (the rows), then python3 tools/bohemia_character_still_flat.py
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'tools'))
ROLL = os.path.join(ROOT, 'records/target/character/BOHEMIA_THE_ROLL_CALL.json')
OUT = os.path.join(ROOT, 'records/target/character/BOHEMIA_CHARACTER_STILL_FLAT.json')
FAMILY = {'hair': 'hair', 'head': 'hats', 'hat': 'hats', 'face': 'face pieces', 'glasses': 'face pieces', 'base': 'tops',
          'shirt': 'tops', 'outer': 'coats', 'jacket': 'coats', 'legs': 'trousers', 'pants': 'trousers', 'feet': 'shoes',
          'shoes': 'shoes', 'back': 'bags, capes and mantles', 'gear': 'gear', 'neck': 'scarves and cowls', 'waist': 'belts',
          'hands': 'gloves'}
# RUN TWO's own exclusions (tools/bohemia_run2_no_two_people_alike.py, read here, never edited): their pieces ride the head
RUN2_NO_TOP = ('TURTLENECK', 'HOOD UP'); RUN2_NO_COAT = ('HOODED PONCHO',)


def modelled():
    """name -> (rolled?, why) for every piece a module of this lane builds on the 3D man"""
    import bohemia_character_the_barber_on_the_skull as BS
    import bohemia_character_the_barbers_book as BB
    import bohemia_character_the_thirteen_through_the_rig as CH
    B = json.load(open(BB.BOOK)) if os.path.exists(BB.BOOK) else BB.book()
    out = {}
    for c in B['cuts']: out[c['name']] = (not c['held'], 'the barber' + (' (held)' if c['held'] else ''))
    # the book names a hat 'HAT <name>' and a face piece 'FACE <name>' (the barber's build names); the roll call's name is <name>
    for h in B['hats']: out[h['name'][4:]] = (h['in_random_mix'], 'HATS 1' + ('' if h['in_random_mix'] else ' (out of the random mix, his 10/19)'))
    for f in B['face_pieces']: out[f['name'][5:]] = (True, 'EYEWEAR 1')
    for t in B['tops']: out[t['name']] = (not t['held'] and t['shape'] not in RUN2_NO_TOP, 'BASE 1' + (' (held)' if t['held'] else ''))
    for t in B['coats']: out[t['name']] = (not t['held'] and t['shape'] not in RUN2_NO_COAT, 'OUTER 1' + (' (held)' if t['held'] else ''))
    for k in ('trousers', 'shoes'):
        for t in B.get(k, []): out[t['name']] = (not t['held'], 'LEGS AND FEET 1' + (' (held)' if t['held'] else ''))
    # the further families, once the barber builds them (each module carries BY, HELD and LABEL; a module the barber does
    # not import is not in the game, whatever is on disk)
    for attr in ('GEAR_ONE', 'FIRST'):
        m = getattr(BS, attr, None)
        if m is None: continue
        for n in m.BY: out[n] = (n not in m.HELD, m.LABEL + (' (held)' if n in m.HELD else ''))
    # what the thirteen gang looks wear is modelled on their bodies (a person of the gang keeps it)
    for g, L in CH.LOOKS.items():
        for slot, n in (L.get('worn') or {}).items():
            out.setdefault(n, (True, 'the %s look, on its own body' % g))
    return out


def main(label=''):
    rows = json.load(open(ROLL))['assets']
    M = modelled()
    fam, flat_names, dead = {}, {}, 0
    for r in rows:
        if r['new_look']['state'].startswith('dead'):
            dead += 1; continue
        f = FAMILY.get(r['slot'], r['slot'])
        if r['old'] == 'paper doll': f = "the player's first look"
        n = r['name'] if r['name'] in M else r.get('plain') if r.get('plain') in M else None   # the paper doll by its plain name
        st = 'flat' if n is None else '3d, rolled' if M[n][0] else '3d, not rolled'
        d = fam.setdefault(f, {'flat': 0, '3d, not rolled': 0, '3d, rolled': 0})
        d[st] += 1
        if st == 'flat': flat_names.setdefault(f, []).append(r['name'])
    tot = {k: sum(d[k] for d in fam.values()) for k in ('flat', '3d, not rolled', '3d, rolled')}
    out = dict(what="CHARACTER: every piece a person can wear, flat or 3D, read off this lane's modules (rule 123: no card)",
               lane='character', rule='123(b)', draft=True, total=tot, dead_not_counted=dead, by_family=fam, flat=flat_names)
    json.dump(out, open(OUT, 'w'), indent=1)
    print('still flat %d | 3D, not rolled %d | 3D, rolled %d | dead %d (not counted)' % (tot['flat'], tot['3d, not rolled'], tot['3d, rolled'], dead))
    for f, d in sorted(fam.items(), key=lambda kv: -kv[1]['flat']):
        print('  %-26s flat %3d   3d not rolled %3d   3d rolled %3d' % (f, d['flat'], d['3d, not rolled'], d['3d, rolled']))
    return out


if __name__ == '__main__':
    main()
