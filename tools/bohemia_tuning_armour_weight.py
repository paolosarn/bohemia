#!/usr/bin/env python3
# TUNING 2 [heavy armour costs a tile] 11/3 -- VAMILY rule 377 (ask line 406; Paolo 11/3: 'if you're wearing the heaviest, maybe it's
# gonna be like -2, you can only walk one time less... there's weights, categories of armor... maybe an endgame light armor is better than
# most of the heavy armor'). TUNING's half of the rule, in the one numbers table (records/target/bb/ours.json armour_weight):
#   (a) THE CLASS OF EVERY ROW: Battle Brothers labels its own named armour Light, Medium and Heavy (the wiki's Named Armors and Named
#       Helmets tables, bb_all/1337 and 1359, the label on every row); its weights are the rows' Max. Fatigue (armor.json fatigue). The
#       man's class is the body piece and the helmet added (COMBAT 7's weightClass); a single piece's class is the same line cut by the
#       slot's share (the body two thirds, the helmet one third), so two pieces of one class always make a man of that class.
#   (b) THE WALKING COST per class (walk_ap): light and medium 0, heavy 1, the heaviest 2 (his words).
#   (c) THE ENDGAME LIGHT PIECES: Battle Brothers' named MEDIUM protection at its named LIGHT weight (rare, costly, a champion's drop).
# Nothing in the fight's code changes; COMBAT 7's fight, shop and crew card read ours.armour_weight.classes (unchanged keys) and may read
# row_below and endgame_light. Every row's class is computed from the table, never stored on the row, so a modder who changes a weight
# changes the class with it.
#   python3 tools/bohemia_tuning_armour_weight.py            # prints the classes, the Battle Brothers check, the endgame pieces
#   python3 tools/bohemia_tuning_armour_weight.py --write    # writes ours.json armour_weight
import json, os, re, sys, tarfile
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
BB = os.path.join(ROOT, 'records/target/bb')
TAR = 'reference/library/grok/wiki/PAGES_ALL.tar.gz'
PAGES = {'body': 'bb_all/1337_Named Armors.txt', 'head': 'bb_all/1359_Named Helmets.txt'}
# the named roll (the pages' own header): the body's weight comes down 3 to 9 (never under 8), the helmet's 1 to 4 (never under 4)
ROLL = {'body': {'lightest': 8, 'least_off': 3}, 'head': {'lightest': 4, 'least_off': 1}}
SHARE = {'body': 2 / 3.0, 'head': 1 / 3.0}
ENDGAME = [  # Bohemia's names (draft:true, WORDS may rename), each over the named MEDIUM row whose protection it carries
    {'id': 'aramid_vest', 'name': 'Aramid Vest', 'slot': 'body', 'over': 'Skull and Chain Armor'},
    {'id': 'ceramic_plate_carrier', 'name': 'Ceramic Plate Carrier', 'slot': 'body', 'over': 'Black and Gold Armor'},
    {'id': 'ballistic_helmet', 'name': 'Ballistic Helmet', 'slot': 'head', 'over': 'Named Steppe Helmet'},
    {'id': 'visored_ballistic_helmet', 'name': 'Visored Ballistic Helmet', 'slot': 'head', 'over': 'Skull Helmet'},
]


def load(p): return json.load(open(os.path.join(ROOT, p)))


def named_rows():
    """Battle Brothers' named armour and helmets, every row with its own label, from the library's wiki pages."""
    out = []
    with tarfile.open(os.path.join(ROOT, TAR)) as t:
        for slot, page in PAGES.items():
            txt = t.extractfile(page).read().decode('utf8')
            for blk in txt.split('|-style="background-color: #141414"')[1:]:
                m = re.search(r'data-sort-value="(Light|Medium|Heavy), ([^"]+)"', blk)
                cells = [c.strip() for c in blk.split('\n') if c.strip().startswith('|')]
                dur = re.search(r'\|(?:data-sort-value="\d+"\|)?(\d+) - (\d+)', blk)
                fat = re.search(r'\|(?:data-sort-value="\d+"\|)?−(\d+) to −(\d+)', blk)
                if not (m and dur and fat): continue
                name = re.sub(r'^\|', '', cells[1]).strip()
                value = int(re.sub(r'\D', '', cells[-1].split('|')[-1]) or 0)
                heavy_roll = int(fat.group(1))   # the roll that took least off
                out.append({'slot': slot, 'label': m.group(1), 'name': name, 'durability': [int(dur.group(1)), int(dur.group(2))],
                            'weight_rolled': [heavy_roll, int(fat.group(2))], 'weight': heavy_roll + ROLL[slot]['least_off'], 'value': value,
                            'page': TAR + ':' + page})
    return out


def cls_of(w, below):
    for c in below:
        if 'below' not in c or w < c['below']: return c['id']
    return below[-1]['id']


def main(write):
    O = load('records/target/bb/ours.json'); A = load('records/target/bb/armor.json')
    AW = O['armour_weight']; V = AW['value']
    classes = V['classes']
    ids = [c['id'] for c in classes]
    assert ids == ['light', 'medium', 'heavy', 'heaviest'], ids
    # (a) the man's line: 15 is Battle Brothers' own line for light armour (Nimble: 'lowered exponentially by the total penalty to
    # Maximum Fatigue from body and head armor above 15', perks.json nimble.numbers.fatigue_penalty_free_threshold); 30 and 45 are its
    # double and triple, and the named labels below land one step up in our four (checked, not assumed)
    PK = load('records/target/bb/perks.json'); rows = PK.get('perks') or PK.get('rows') or PK.get('value') or []
    nimble = [p for p in rows if p.get('id') == 'nimble'][0]['numbers']['fatigue_penalty_free_threshold']
    man = [nimble, nimble * 2, nimble * 3]
    walk = {'light': 0, 'medium': 0, 'heavy': 1, 'heaviest': 2}
    for i, c in enumerate(classes):
        if i < 3: c['below'] = man[i]
        c['walk_ap'] = walk[c['id']]
    row_below = {s: [dict({'id': ids[i]}, **({'below': round(man[i] * SHARE[s])} if i < 3 else {})) for i in range(4)] for s in SHARE}
    # every row's class (computed, never stored)
    per = {}
    for s in ('body', 'head'):
        for r in A[s]:
            w = -(r['fatigue'] or 0)
            per.setdefault(s, {}).setdefault(cls_of(w, row_below[s]), []).append(r)
    # the Battle Brothers check: where its own labels land in our four
    N = named_rows()
    step = {'Light': 'medium', 'Medium': 'heavy', 'Heavy': 'heaviest'}
    landed = [dict(n, ours=cls_of(n['weight'], row_below[n['slot']])) for n in N]
    one_up = [n for n in landed if n['ours'] == step[n['label']]]
    # (c) the endgame light pieces
    heavy_rows = {s: [r for r in per[s].get('heavy', [])] for s in ('body', 'head')}
    pieces = []
    for e in ENDGAME:
        src = [n for n in N if n['name'] == e['over'] and n['slot'] == e['slot']][0]
        assert src['label'] == 'Medium', src
        w = ROLL[e['slot']]['lightest']; dur = src['durability'][0]
        hv = heavy_rows[e['slot']]; beats = [r for r in hv if r['durability'] < dur]
        hv_all = [r for s2 in ('heavy', 'heaviest') for r in per[e['slot']].get(s2, [])]
        pieces.append({'id': e['id'], 'name': e['name'], 'draft': True, 'slot': e['slot'], 'durability': dur, 'fatigue': -w,
                       'vision': (-2 if 'Visored' in e['name'] else -1) if e['slot'] == 'head' else None, 'value': src['value'],
                       'class': cls_of(w, row_below[e['slot']]), 'drop': 'champion', 'shelf': False,
                       'beats_heavy': [len(beats), len(hv)], 'beats_heavy_and_heaviest': [len([r for r in hv_all if r['durability'] < dur]), len(hv_all)],
                       'from': {'protection': src['name'] + ' (Battle Brothers named ' + src['label'] + ', ' + '%d to %d' % tuple(src['durability']) + ', its lowest roll)',
                                'weight': 'the lightest a named ' + e['slot'] + ' piece rolls (' + str(w) + ', ' + src['page'].split(':')[-1] + ')'},
                       'source': src['page']})
    for p in pieces: del_none = [k for k in p if p[k] is None]; [p.pop(k) for k in del_none]
    kit = [(b, h) for b in pieces if b['slot'] == 'body' for h in pieces if h['slot'] == 'head']
    # print
    print('THE MAN (body + helmet):', ', '.join('%s %s walk_ap %d' % (c['name'], ('<' + str(c['below'])) if 'below' in c else '45+', c['walk_ap']) for c in classes))
    for s in ('body', 'head'):
        print('ONE %s PIECE:' % s.upper(), ', '.join('%s %s' % (c['id'], ('<' + str(c['below'])) if 'below' in c else '+') for c in row_below[s]),
              '|', ', '.join('%s %d' % (k, len(per[s].get(k, []))) for k in ids))
    print('BATTLE BROTHERS\' OWN LABELS one step up in ours: %d of %d' % (len(one_up), len(landed)))
    for n in landed: print('  %-4s %-6s %-28s weight %2d -> %-8s %s' % (n['slot'], n['label'], n['name'], n['weight'], n['ours'], '' if n in one_up else '(not one up)'))
    for p in pieces: print('ENDGAME LIGHT %-26s %s holds %d weighs %d (%s): beats %d of %d heavy %s rows, %d of %d heavy and heaviest; %d' % (
        p['name'], p['slot'], p['durability'], -p['fatigue'], p['class'], p['beats_heavy'][0], p['beats_heavy'][1], p['slot'], p['beats_heavy_and_heaviest'][0], p['beats_heavy_and_heaviest'][1], p['value']))
    for b, h in kit: print('  kit %s + %s: weighs %d (%s), holds %d' % (b['name'], h['name'], -b['fatigue'] - h['fatigue'], cls_of(-b['fatigue'] - h['fatigue'], [dict(c) for c in classes]), b['durability'] + h['durability']))
    if not write: return
    V['classes'] = classes
    V['row_below'] = row_below
    V['row_below_why'] = ('ONE PIECE\'S CLASS (rule 377(a), the shop\'s card for a single piece): the man\'s line cut by the slot\'s share, the body two thirds and the '
                          'helmet one third (Battle Brothers\' heaviest body weighs 42 and its heaviest helmet 23, about two to one), so two pieces of one class '
                          'always make a man of that class; a man is always classed by the two added (classes). A row\'s weight is armor.json fatigue; '
                          'the wiki\'s blank on cloth reads 0, light. Computed from this table, never stored on the row: a modder who changes a weight '
                          'changes its class.')
    V['bb_named'] = [{k: n[k] for k in ('slot', 'label', 'name', 'durability', 'weight', 'weight_rolled', 'value', 'page')} for n in N]
    V['bb_named_why'] = ('THE CHECK FROM BATTLE BROTHERS (rule 377(a), \'from the real Battle Brothers weights\'): it labels its own named armour Light, Medium and '
                         'Heavy on the wiki\'s Named Armors and Named Helmets tables. weight = the row\'s base Max. Fatigue (its heaviest roll plus the least a '
                         'named roll takes off: 3 on the body, 1 on the helmet). In our four its labels land one step up (%d of %d): its Light is our MEDIUM, '
                         'its Medium our HEAVY, its Heavy our HEAVIEST; our LIGHT is the cloth, leather and padding under anything it names. So the walk is '
                         'free through Battle Brothers\' light armour, a little slower in its medium and a flat tile slower in its heavy.' % (len(one_up), len(landed)))
    V['endgame_light'] = {'pieces': pieces,
                          'rule': 'Battle Brothers\' named MEDIUM protection (its lowest roll) at the lightest a named piece of the slot rolls (8 on the body, 4 on the helmet).',
                          'why': ('WEIGHT IS NOT QUALITY (rule 377(d), his words: \'maybe an endgame light armor is better than most of the heavy armor\'). Battle '
                                  'Brothers\' own named light pieces do not do it (its best, the Named Noble Mail, holds 176 to 200 at 8 to 12; its Wolf Helmet '
                                  '154 to 175 at 4 to 7): THE FUTURE DOES (rule 32: the game starts in the ruin and gets reclaimed, techy, modern). Realism first: '
                                  'an ultra-high-molecular-weight polyethylene rifle plate weighs about a third of a steel plate that stops the same round '
                                  '(about 1.3 kg against 3.8 kg for a 10 by 12 inch plate) and a modern helmet about 1.4 kg against 2 to 4 kg of a steel great '
                                  'helm. Each piece is a champion\'s drop (Battle Brothers\' champions \'always have a named item\', bb_all/0363) and costs what '
                                  'its named medium costs; never on the shelf (shelf false). A body and a helmet together weigh 12: a LIGHT man who walks free '
                                  'and holds more than most heavy men. NOT IN THE FIGHT YET: no champion drops a named item in our code (COMBAT 7\'s); the '
                                  'rows are shaped like armor.json rows so the drop can hand one straight to bodyRow and headRow.')}
    V['breath_floor'] = {'strikes': 1,
                         'why': ('NEVER A SWING, THE BREATH HALF (rule 377(c), his words: \'please make sure this does not make it impossible to do any sort of '
                                 'attack or abilities\'). Battle Brothers takes armour weight off a man\'s breath too (Max. Fatigue; the fight\'s gearFat), and '
                                 'with the walk now costing the heaviest a tile that second cost can still stop a swing: MEASURED (the fight headless, 11/3), a '
                                 'sellsword (93 breath) in a coat of plates and a full helm (62) holding a two-handed hammer has 13 breath for a 15-breath '
                                 'strike, so he can never swing it; with the other two-handers 17, one swing a turn; Rally and Indomitable (25 each, bb_all/1633, 1076) never. THE NUMBER: '
                                 'whatever he wears, his breath pool holds at least his dearest strike or active ability this many times from fresh (1). The '
                                 'heaviest still tires him fast (Battle Brothers\' cost, kept): it never makes a swing impossible. FOR COMBAT 7: fatMax(u) '
                                 'reads ours.armour_weight.breath_floor.strikes x the dearest skillFat of his weapon\'s skills and his active perks, as its '
                                 'floor; not read by the fight yet.')}
    AW['tuned'] = True
    AW['owner'] = 'TUNING (TUNING 2, rule 377: the classes, the walking cost per class, one piece\'s class and the endgame light pieces); COMBAT 7 reads them in the fight, the shop and the crew card'
    AW['source'] = ('VAMILY.md rule 377 (Paolo 11/3, ask line 406); records/BOHEMIA_PAOLO_TAP_A_QUEST_TO_GO_THE_KILL_CAMS_AND_HEAVY_ARMOUR_11_3_26.md; '
                    'Battle Brothers\' armour weight (armor.json fatigue, bb_all/0264_Body Armor.txt, 0958_Headgear.txt); its Nimble line of 15 '
                    '(bb_all/1424_Nimble.txt, perks.json nimble); its named labels (bb_all/1337_Named Armors.txt, 1359_Named Helmets.txt); '
                    'tools/bohemia_tuning_armour_weight.py; records/BOHEMIA_TUNING_HEAVY_ARMOUR_COSTS_A_TILE_11_3_26.md')
    AW['why'] = ('TUNING 2 11/3 (was COMBAT 7\'s default, the same numbers, tuned:false). A man\'s armour weight is Battle Brothers\' own (the body piece\'s and the '
                 'helmet\'s Max. Fatigue, added; Brawny takes its share off, the fight\'s gearFat); an enemy\'s is the pieces of his wiki gear nearest his rolled '
                 'armour. His class is the first whose \'below\' his weight is under. THE LINES: 15 is Battle Brothers\' own line for light armour (Nimble works '
                 'in full under it and fades above it); 30 and 45 are its double and triple, and its own named labels land one step up in our four (bb_named_why). '
                 'THE WALK: walk_ap comes off what he may spend WALKING this turn (9 a turn, 2 a flat tile, 3 a rough one), NEVER off attacks, shots and '
                 'abilities. HEAVIEST 2 (his number): 7 to walk, three flat tiles not four. HEAVY 1 (\'a little under a tile\', a flat tile is 2): 8 to walk, '
                 'the same four flat tiles and one rough tile less (two, not three); a step that costs Battle Brothers\' medium armour something without '
                 'costing it a tile on open ground. LIGHT and MEDIUM 0. A man who has not moved has all 9 for anything he owns, and walk then strike still '
                 'fits (a strike costs 4 or more, over any walk_ap). Weight is not quality: the class is weight only; the armour\'s durability is its '
                 'protection, and endgame_light holds the light pieces that out-protect most heavy ones.')
    P = os.path.join(ROOT, 'records/target/bb/ours.json'); nl = open(P).read().endswith('\n')
    open(P, 'w').write(json.dumps(O, indent=1, ensure_ascii=False) + ('\n' if nl else ''))
    print('wrote records/target/bb/ours.json armour_weight')


if __name__ == '__main__':
    main('--write' in sys.argv)
