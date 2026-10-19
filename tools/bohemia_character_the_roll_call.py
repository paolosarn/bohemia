#!/usr/bin/env python3
"""CHARACTER [every old asset into the new look]: THE ROLL CALL (10/19/26).

His words, 10/18, voting YES on PORTRAIT's crew faces (records/BOHEMIA_THE_SIXTEENTH_VOTES_10_18_26.txt): 'I'm so in love
with the way this shit looks but... you made some hair look like it was like a medieval link mesh armor... All of this
has to be customizable and we still have to get the hair approved and the hats approved and the sunglasses approved and
all the assets we have we have to coordinate them, rename them, reapply them in the new art stuff, so please don't
forget.'

THIS IS THE LIST HE ASKED NOBODY TO FORGET. One row per asset the game owns that a person can wear: every entry of the
alpha's GARMENTS table (canon, dead and cook), the paper doll the player first wore (PD_DATA), the barber's sculpted cuts
and PORTRAIT's head pieces, each with:
  name      the ONE name (the GARMENTS name the body wears, the barber sells and the save stores)
  plain     a plainer name where the old one is not plain or is a brand; the old name stays an alias
  kind      hair | hat | eyewear | garment (and slot: the GARMENTS layer)
  old       canon | dead | cook | paper doll
  worn_by   which looks wear it today (CITY_CAST_LOOKS, FACTION_LOOKS)
  new_look  where it stands in the rig's look (rule 115): approved / shown, not approved / built, not shown / not yet,
            with the card id and his words where a card carried it
  aliases   the names other tools call it by (PORTRAIT's head pieces 'taper', 'coil'...; the rig's styles)
  batch     which VOTE batch rebuilds it, in his order: hair first, then hats, then eyewear, then the garments
A dead shape is listed and never rebuilt (GRAVEYARD IS FINAL; A DEAD SHAPE DOES NOT COME BACK UNDER A NEW NAME).

Out: records/target/character/BOHEMIA_THE_ROLL_CALL.json (draft:true; nothing live reads it)
Run: python3 tools/bohemia_character_the_roll_call.py
"""
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html')
REG = os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
PORTRAIT_TOOL = os.path.join(ROOT, 'tools/bohemia_portrait_the_head_from_the_model.py')
OUT = os.environ.get('ROLL_CALL_OUT') or os.path.join(ROOT, 'records/target/character/BOHEMIA_THE_ROLL_CALL.json')
sys.path.insert(0, os.path.join(ROOT, 'tools'))

KIND = {'hair': 'hair', 'head': 'hat', 'face': 'eyewear'}
# his 10/18: 'we still have to get the hair approved... the hats approved... the sunglasses approved': whatever card a
# hair, a hat or a face piece rode on, these three kinds are NOT approved until a card of their own passes
UNAPPROVED_KINDS = ('hair', 'hat', 'eyewear')
SAID = "his 10/18: 'we still have to get the hair approved and the hats approved and the sunglasses approved'"
# the thirteen gang looks' garments rode three cards he voted UP (rule 115c: the clothes modelled on the rig)
GANG_CARDS = ['character-the-thirteen-through-the-rig-10-18', 'character-the-print-and-the-hands-10-18',
              'character-the-walk-of-every-look-10-18']
BARBER_CARD = 'character-the-barber-on-the-skull-10-18'
HAIR_ONE_CARD = 'character-hair-one-clumps-not-links-10-19'   # the barber's other eight, as clumps, locks, ropes and braids
HATS_ONE_CARD = 'character-hats-one-the-21-hats-10-19'   # the 21 hats, seven shapes on the starred head
EYE_ONE_CARD = 'character-eyewear-one-the-14-face-pieces-10-19'   # the 14 face pieces, six kinds on the starred head
# GARMENTS BASE: the 80 tops on three cards (THE SHIRTS, THE COLLARS, THE HEAVY ONES AND THE RUNWAY), from the module's PARTS
PORTRAIT_CARD = 'portrait-every-face-from-the-same-model-10-18'
# names that are not plain: a brand, a place, a pattern word. The old name stays an alias forever (saves keep it).
PLAIN = {
    'CHINESE RICE FARMER HAT': 'CONE HAT',
    'shoes/balenciaga': 'RUNWAY SNEAKERS',
    'jacket/japanese-fuzz_hoodDown': 'FUZZ JACKET',
    'pants/leather-legwarmer': 'LEATHER LEGWARMER PANTS',
    'shirt/cowl-hoodie': 'COWL HOODIE',
    'hat/durag': 'DURAG',
    'glasses/shades': 'SHADES',
    'hair/curtain-bob': 'CURTAIN BOB',
}
# PORTRAIT's and the rig's short names for a cut or a piece of head gear, mapped onto the ONE name (read off each
# tool's tables beside the look's worn list: the head on look X wears X's worn hair)
STYLE_TO = {'taper': ['TEMPLE TAPER', 'DRY TAPER', 'DEEP TAPER'], 'coil': ['COIL CROWN'], 'crop': ['COIL CROWN'],
            'shag': ['SHAG'], 'fall': ['LAYERED FALL'], 'long': ['CURTAIN CUT'], 'fringe': ['HEAVY FRINGE']}
BATCH = {'hair': 'hair 1 (his first: strands and clumps, never a mesh)', 'hat': 'hats 1', 'eyewear': 'eyewear 1'}


def garments(s):
    i = s.find('var GARMENTS=window.GARMENTS=[')
    k = s.find('[', i); d = 0; j = k
    while True:                                   # the matching bracket, past strings and comments
        c = s[j]
        if c == '/' and s[j + 1] == '*':
            j = s.find('*/', j + 2) + 2; continue
        if c == '/' and s[j + 1] == '/':
            j = s.find('\n', j); continue
        if c in '\'"`':
            q = c; j += 1
            while s[j] != q:
                if s[j] == '\\':
                    j += 1
                j += 1
            j += 1; continue
        if c == '[':
            d += 1
        elif c == ']':
            d -= 1
            if d == 0:
                break
        j += 1
    body = s[k:j]
    out = []
    # a name is in single quotes, or in double quotes when it carries an apostrophe (DRIFTER'S COAT, SMITH'S APRON)
    for m in re.finditer(r"\{\s*n:(?:'((?:[^'\\]|\\.)*)'|\"([^\"]*)\")", body):
        seg = body[m.start():m.start() + 700]
        st = re.search(r"\bst:'([a-z]+)'", seg); ly = re.search(r"\blayer:'([a-z]+)'", seg)
        nm = (m.group(1) if m.group(1) is not None else m.group(2)).replace("\\'", "'")
        out.append((nm, st.group(1) if st else None, ly.group(1) if ly else None))
    return out


def looks(s):
    worn = {}
    for m in re.finditer(r"\{ id:'([a-z]+)', why:.*?worn:\{(.*?)\}", s, re.S):
        worn['cast_' + m.group(1)] = dict((a, b or c) for a, b, c in
                                          re.findall(r"(\w+):(?:'((?:[^'\\]|\\.)*)'|\"([^\"]*)\")", m.group(2)))
    for m in re.finditer(r"\{ faction:'([A-Za-z]+)', (?:skin:'[a-z]+', )?draft:true,.*?worn:\{(.*?)\}", s, re.S):
        worn['faction_' + m.group(1).lower()] = dict((a, (b or c).replace("\\'", "'")) for a, b, c in
                                                     re.findall(r"(\w+):(?:'((?:[^'\\]|\\.)*)'|\"([^\"]*)\")", m.group(2)))
    for k in list(worn):
        worn[k] = dict((a, b.replace("\\'", "'")) for a, b in worn[k].items())
    return worn


def portrait_pieces():
    """PORTRAIT's head pieces per look, read off its tables (hair='taper', gear='knit cap'), never imported (bpy)"""
    t = open(PORTRAIT_TOOL).read()
    out = {}
    for m in re.finditer(r"'(CAST_[A-Z]+|YOU)': dict\(look='([a-z_]+)'.*?hair='([a-z]+)'.*?gear=(None|'[a-z ]+')", t):
        out[m.group(2)] = (m.group(3), None if m.group(4) == 'None' else m.group(4).strip("'"))
    for m in re.finditer(r"    '([A-Z][a-z]+)':\s+dict\(skin=.*?hair='([a-z]+)'.*?gear=(None|'[a-z ]+')", t):
        out['faction_' + m.group(1).lower()] = (m.group(2), None if m.group(3) == 'None' else m.group(3).strip("'"))
    return out


def main():
    s = open(ALPHA, encoding='utf-8').read()
    reg = json.load(open(REG))
    V = dict((v['id'], v) for v in reg.get('verdicts', []) if v.get('id'))
    W = looks(s)
    G = garments(s)
    import bohemia_character_the_thirteen_through_the_rig as RIG
    import bohemia_character_the_barber_on_the_skull as BARBER
    rig_worn = dict(('faction_' + n.lower(), L['worn']) for n, L in RIG.LOOKS.items() if n != 'Body')
    rig_style = dict(('faction_' + n.lower(), (L.get('hair') or {}).get('style')) for n, L in RIG.LOOKS.items() if n != 'Body')
    barber = dict((k, BARBER.CUTS[k]) for k in BARBER.ORDER)   # the three the barber's card showed; HAIR 1's eight are not shown until their card
    BASE_CARD = dict((G['name'], cid) for _, cid, shapes in BARBER.BASE_ONE.PARTS for G in BARBER.BASE_ONE.BANK if G['shape'] in shapes)
    # a base top is shown only when its card carries its pictures; one whose card left it out was held
    _bs = dict((i.get('id'), ' '.join(i.get('sprites', []))) for i in reg.get('items', []) if i.get('id') in set(BASE_CARD.values()))
    BASE_HELD = set(G['name'] for G in BARBER.BASE_ONE.BANK if BASE_CARD.get(G['name']) in _bs and '/%s/' % G['tag'] not in _bs[BASE_CARD[G['name']]])
    PP = portrait_pieces()

    rows, seen = [], set()

    def card(cid):
        v = V.get(cid) or {}
        return {'card': cid, 'verdict': v.get('vote'), 'said': v.get('said')}

    for name, st, layer in G:
        if name in seen:
            continue
        seen.add(name)
        kind = KIND.get(layer, 'garment')
        worn_by = sorted(k for k, w in W.items() if name in w.values())
        row = {'name': name, 'kind': kind, 'slot': layer, 'old': st, 'worn_by': worn_by, 'aliases': []}
        if name in PLAIN:
            row['plain'] = PLAIN[name]
        on_gangs = sorted(k for k, w in rig_worn.items() if name in w.values())
        if st == 'dead':
            row['new_look'] = {'state': 'dead, never rebuilt', 'why': 'GRAVEYARD IS FINAL; A DEAD SHAPE DOES NOT COME BACK UNDER A NEW NAME'}
            row['batch'] = None
        else:
            if kind == 'hair' and name in barber:
                nl = {'state': 'shown, not approved', 'by': 'CHARACTER, sculpted on the starred skull', 'rig_looks': on_gangs}
                nl.update(card(BARBER_CARD)); nl['note'] = SAID
            elif kind == 'eyewear' and any(n_ == name for n_, _, _ in BARBER.EYE_ONE.PIECES) and any(i.get('id') == EYE_ONE_CARD for i in reg.get('items', [])):
                nl = {'state': 'shown, not approved', 'by': 'CHARACTER, modelled on the starred head (eyewear 1)', 'rig_looks': on_gangs}
                nl.update(card(EYE_ONE_CARD)); nl['note'] = SAID
            elif kind == 'hat' and any(n_ == name for n_, _, _ in BARBER.HATS_ONE.HATS) and any(i.get('id') == HATS_ONE_CARD for i in reg.get('items', [])):
                nl = {'state': 'shown, not approved', 'by': 'CHARACTER, modelled on the starred head (hats 1)', 'rig_looks': on_gangs}
                nl.update(card(HATS_ONE_CARD)); nl['note'] = SAID
            elif kind == 'hair' and name in BARBER.HAIR_ONE.CARD_ORDER and any(i.get('id') == HAIR_ONE_CARD for i in reg.get('items', [])):
                nl = {'state': 'shown, not approved', 'by': 'CHARACTER, sculpted on the starred skull as clumps, locks, ropes or braids (hair 1)',
                      'rig_looks': on_gangs}
                nl.update(card(HAIR_ONE_CARD)); nl['note'] = SAID
            elif kind == 'garment' and layer == 'base' and name in BASE_HELD and any(i.get('id') == BASE_CARD.get(name) for i in reg.get('items', [])):
                # built, rendered and held off its card by the first five (rule 114b); the record says why
                nl = {'state': 'built, not shown', 'by': "CHARACTER, modelled on the barber's 3D man (base 1)", 'rig_looks': on_gangs,
                      'held': "off %s by the guide's light row (rule 114b): records/BOHEMIA_BASE_ONE_THE_80_TOPS_10_19_26.md" % BASE_CARD[name]}
            elif kind == 'garment' and layer == 'base' and any(i.get('id') == BASE_CARD.get(name) for i in reg.get('items', [])):
                # GARMENTS BASE (10/19): the top modelled on the barber's man; a top a gang already wore keeps his UP on the gangs
                # 'cards' holds only what the state stands on (R3: approved means every cited card has his UP); the new
                # card a gang-worn top waits on is 'shown_on' beside them
                if on_gangs:
                    nl = {'state': 'approved, not final', 'by': "CHARACTER, modelled on the barber's 3D man (base 1)", 'rig_looks': on_gangs,
                          'cards': [card(c) for c in GANG_CARDS], 'shown_on': card(BASE_CARD[name])}
                else:
                    nl = {'state': 'shown, not approved', 'by': "CHARACTER, modelled on the barber's 3D man (base 1)", 'rig_looks': on_gangs}
                    nl.update(card(BASE_CARD[name]))
                nl['note'] = "his 10/18 on the thirteen: 'Nice direction very good not final'" if on_gangs else "the roll call's base batch, shown for his vote"
            elif on_gangs:
                nl = {'state': 'shown, not approved' if kind in UNAPPROVED_KINDS else 'approved, not final',
                      'by': 'CHARACTER, modelled on the thirteen gang bodies', 'rig_looks': on_gangs,
                      'cards': [card(c) for c in GANG_CARDS]}
                if kind in UNAPPROVED_KINDS:
                    nl['note'] = SAID
                else:
                    nl['note'] = "his 10/18 on the thirteen: 'Nice direction very good not final'"
            elif worn_by:
                nl = {'state': 'built, not shown', 'by': "PORTRAIT's crew bodies, built with CHARACTER's rig tool under each head (never shown as a body)"}
            else:
                nl = {'state': 'not yet', 'by': None}
            row['new_look'] = nl
            row['batch'] = BATCH.get(kind, 'garments: %s' % layer)
        rows.append(row)
    # the paper doll: the player's first look, his own (the curtain bob is 'his painted curtain-bob, which stays his')
    i = s.find('const PD_DATA = {')
    pd = json.loads(s[i + len('const PD_DATA = '):s.find('\n', i)].rstrip().rstrip(';'))
    for key in sorted(pd['layers']):
        slot = key.split('/')[0]
        if slot in ('body', 'facial'):
            continue
        kind = {'hair': 'hair', 'hat': 'hat', 'glasses': 'eyewear'}.get(slot, 'garment')
        rows.append({'name': key, 'plain': PLAIN.get(key), 'kind': kind, 'slot': slot, 'old': 'paper doll', 'worn_by': ['you'],
                     'aliases': [], 'new_look': {'state': 'not yet', 'by': None, 'note': "the player's first look (YOU's portrait wears his platinum long cut, not this)"},
                     'batch': BATCH.get(kind, 'garments: %s' % slot)})
    # aliases: PORTRAIT's head pieces and the rig's sculpt styles, mapped by the look's own worn list
    by = dict((r['name'], r) for r in rows)
    portrait_unmapped = []
    for look, (hair, gear) in sorted(PP.items()):
        w = W.get(look) or rig_worn.get(look) or {}
        h = w.get('hair')
        if h in by:
            a = 'PORTRAIT head piece %r (on %s)' % (hair, look)
            if a not in by[h]['aliases']:
                by[h]['aliases'].append(a)
            nl = by[h]['new_look']; nl.setdefault('portrait', card(PORTRAIT_CARD)); nl['portrait']['note'] = "his chain-mail note: 'some hair look like it was like a medieval link mesh armor'"
        elif look != 'you':
            portrait_unmapped.append('%s hair %r (worn %r)' % (look, hair, h))
        if gear:
            hd = w.get('head')
            if hd in by:
                a = 'PORTRAIT head piece %r (on %s)' % (gear, look)
                if a not in by[hd]['aliases']:
                    by[hd]['aliases'].append(a)
            else:
                portrait_unmapped.append('%s gear %r (worn head %r)' % (look, gear, hd))
    for look, style in sorted(rig_style.items()):
        h = rig_worn[look].get('hair')
        if h in by and style:
            a = 'rig sculpt %r (on %s)' % (style, look)
            if a not in by[h]['aliases']:
                by[h]['aliases'].append(a)
    count = {}
    for r in rows:
        k = (r['kind'], r['new_look']['state'])
        count['%s: %s' % k] = count.get('%s: %s' % k, 0) + 1
    out = {
        'what': "CHARACTER [every old asset into the new look]: THE ROLL CALL. Every hair, hat, eyewear and garment a person can wear, one row each, with the one name, where it stands in the rig's look, and the batch that rebuilds it.",
        'his_words': "10/18: 'we still have to get the hair approved and the hats approved and the sunglasses approved and all the assets we have we have to coordinate them, rename them, reapply them in the new art stuff, so please don't forget.'",
        'lane': 'character', 'date': '10/19/26', 'rule': '115(c)', 'draft': True,
        'order': ["hair 1 (his first: strands and clumps, never a mesh)", 'hats 1', 'eyewear 1',
                  'garments: base', 'garments: outer', 'garments: legs', 'garments: feet', 'garments: back', 'garments: gear',
                  'garments: neck', 'garments: waist', 'garments: hands'],
        'count': dict(sorted(count.items())),
        'portrait_unmapped': portrait_unmapped,
        'assets': rows,
    }
    json.dump(out, open(OUT, 'w'), indent=1)
    print('roll call: %d assets -> %s' % (len(rows), os.path.relpath(OUT, ROOT)))
    for k, v in sorted(count.items()):
        print('  %-40s %d' % (k, v))
    if portrait_unmapped:
        print('  unmapped PORTRAIT pieces: ' + '; '.join(portrait_unmapped))


if __name__ == '__main__':
    main()
