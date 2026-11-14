#!/usr/bin/env python3
"""THE BESTIARY FLOOR (BESTIARY gate, 11/9/26; VAMILY rule 440(f), ask line 539; the gate the beast law has owed since 9/29:
laws/BOHEMIA_LAW_THE_BEASTS_ARE_LAB_MADE_AND_THE_BESTIARY_FLOOR_9_29_26.md s4, 'nothing ships under the floor (gate OWED: the roster
data file counts factions, types and beasts against the floor)'). A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED.

MEASURED BEFORE THIS GATE (main 79516ffc): records/target/bb/roster.json said 'beasts: 17' because it counted Battle Brothers' seventeen
archetype NAMES (the Alp, the Hexe, the Kraken...), 13 of them with no animal and nothing in the fight. The fight fielded 15 animals,
and only 10 were lab-made (law s1: 'Every beast in Bohemia is an animal humans brought back with genetics'); the other 5 are living
animals loose in the valley (the coyote, the mountain lion, the feral hog, the feral bull, the feral dog). So the number on file was
right by accident and the lab-made floor was not met. This gate counts what the fight can really field.

THE LEGS (every number read from the data the game reads, never typed here):
  F0 THE FLOOR IS HIS: roster.json's floor is 12 factions, 75 types, 17 beasts, 3 bosses, champions, and the law says the same.
  F1 FACTIONS: records/target/bb/factions.json holds 12 or more combat factions (Battle Brothers' count: a group you meet on the map
     with its own roster). Reported beside it: how many of them the fight fields a party for.
  F2 TYPES: roster.json holds 75 or more enemy types, each with its family and lesson; THE FIGHT'S OWN COUNT (types it can field)
     never drops below the count measured when this gate was written (a ratchet: the debt can only shrink) and is printed against 75.
  F3 THE BEASTS: 17 or more animals fielded (the floor), and the LAB-MADE count never below LAB_MADE_NOW (a ratchet up to 17). Every
     animal in records/target/bb/lab_beasts.json (the lab's book) names its species,
     its fossil (site, state, paper), its DNA ('read' or 'readable', law s2), its surrogate mother and why it lives in the Mojave; is
     FIELDED (its party deals one of its rows in bohemia_enemies.json's mix, the row is drawn from its own sheet beast_<animal> in
     slices/fight_rig/fight_rig.json and the file is on disk, the party can be met: on the road in some act, on a ground's beast table
     or a rare giant); no animal is counted twice. The living animals on its not-lab-made list count toward 17 only when fielded on
     their own sheets (law s3: the escapees walk the same roads). Every beast party is in the book or on its
     not-lab-made list (no beast of unknown origin: a radiation beast has nowhere to hide). Every lab beast BESTIARY added names a
     NEVADA fossil, and its row's 'real' names its genus.
  F4 IT READS AS ITS ANIMAL AT EVERY SIZE (rule 431(d), the reference check): each beast BESTIARY added has an outline of its own
     (E and SE, the standing picture, shape at one height: gates/every_beast_its_own_outline_gate.py's own measure) at least FLOOR
     from every other animal the fight draws, at the fight's pixels AND at the map's fifth; and its lab plate shows MARK_PX pixels in
     MARK_FACINGS of 8 facings.
  F5 NO SPECIAL SYSTEMS (rule 431(f), 'just another animal we can fight'): each beast BESTIARY added uses a brain the file already
     has, carries no row key and no beast key the earlier beasts lack, and its attack is a page in beast_attacks.json.
  F6 BOSSES: 3 or more bosses the fight stages (records/target/bb/boss_act_one.json: each with its board and its crew).
  F7 CHAMPIONS ARE RARE NAMED MEN (rule 443(d)): the fight's parties deal champion kinds (a '_champion' row in a party's mix), and
     every one has a title and three or more names in bohemia_enemies.json's champions (drafts); on the live rules
     (gates/the_bestiary_floor_men.js) a band dealt one names him from his list with his title, two never share a name, no band
     carries one before the late phase, and no band carries more than one.
  F10 THE NEW MEN (rule 443(d): 'each type its own look... and its own way to fight; every Battle Brothers archetype keeps its
     lesson'): every enemy type BESTIARY added (bohemia_enemies.json rows, added_by BESTIARY) rides a wiki row, names its Battle
     Brothers lesson and its own, has looks no other enemy pool holds, is dealt by its party, and on the live rules is armed from its
     own gear and strikes (a volley brain from range more than up close), and a crew of 6 beats its party 6 in 10 or better, or he makes his band no harder than it was without him (within one in ten).
  F8 THE ROSTER FILE IS FRESH (tools/bohemia_combat_the_roster.py --check).
  F9 ON THE PAGE (rule 441(a), the browser half gates/the_bestiary_floor_fight.js; --no-browser skips it): on the demo, a phone upright
     and sideways, each BESTIARY beast's party through the one door: fielded on its own sheet with its own words, the win home, its kill
     on the map in its own picture, one tap: food and a roll of hides; the page throws nothing.
PLANTED (--plant, and always run first): ONE BEAST REMOVED (the book's last animal's party taken out of the mix: 16, red); a beast of
unknown origin (a party in no book: red); a beast with no fossil (red); a new brain with a key nobody has (red); a sheet that copies
its kin (the stilt-legged horse drawn on the Ice Age horse's sheet: red); a new man in another's clothes (the bowman handed the
neighbor's looks: red); a new man no party deals (the bowman's place in the watch's mix taken out: red); a champion with no name
(red). Each must turn its own leg red, or the gate fails.

    python3 gates/the_bestiary_floor_gate.py [--plant] [--pairs] [--no-browser]
"""
import json, os, re, subprocess, sys, importlib.util
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
J = lambda p: json.load(open(os.path.join(ROOT, p)))
spec = importlib.util.spec_from_file_location('outline', os.path.join(ROOT, 'gates/every_beast_its_own_outline_gate.py'))
OL = importlib.util.module_from_spec(spec); spec.loader.exec_module(OL)
FLOOR, MARK_PX, MARK_FACINGS = OL.FLOOR, OL.MARK_PX, OL.MARK_FACINGS
MAP_SCALE = 5                 # the map draws a beast party at about a fifth of the fight's pixels (WORLD 12's 'the map's fifth')
TYPES_IN_THE_FIGHT_FLOOR = 59  # MEASURED 11/14 (42 before BESTIARY's seven, 49 before its five men, 54 before its three, 57 before its two): only ever raised
FACTIONS_FIELDED_NOW = 8       # MEASURED 11/10 (the flock waits for its clothes): the factions the fight fields a party for; only ever raised
LAB_MADE_NOW = 17              # MEASURED 11/10 (10 before BESTIARY's seven): the law's floor, met; only ever raised
BY = 'BESTIARY'
passed = failed = 0


def leg(ok, what, why=''):
    global passed, failed
    passed += bool(ok); failed += (not ok)
    print(('  ok   ' if ok else '  FAIL ') + what + (('  [' + why + ']') if why else ''))


def load():
    return dict(roster=J('records/target/bb/roster.json'), factions=J('records/target/bb/factions.json'),
                ne=J('records/target/bb/bohemia_enemies.json'), ours=J('records/target/bb/ours.json'),
                book=J('records/target/bb/lab_beasts.json'), index=J('slices/fight_rig/fight_rig.json'),
                jk=J('records/target/BOHEMIA_JOB_KINDS.json'), atk=J('records/target/bb/beast_attacks.json'),
                bosses=J('records/target/bb/boss_act_one.json'))


def sheet_of_row(D):
    m = dict(D['ours'].get('beast_rig_looks', {}).get('value', {}))
    for r in D['ne']['rows']:
        if r.get('beast', {}).get('rig'): m[r['id']] = r['beast']['rig']
    return m


def met(D, f):
    """can the party be met: on the road in some act, on a ground's beast table, or as a rare giant"""
    road = any((w.get(f) or 0) > 0 for w in D['ne']['road']['by_act'])
    ground = any((t.get(f) or 0) > 0 for g, t in D['jk'].get('beasts_by_ground', {}).items() if not g.startswith('_'))
    giant = f in D['jk'].get('giants', {}).get('kinds', [])
    return road or ground or giant


def f3(D):
    """-> (the lab-made animals the fight fields, the problems)"""
    bad = []; fielded = []
    book = D['book']; ne = D['ne']; idx = D['index']['looks']; rig = sheet_of_row(D)
    seen = set()
    for b in book['beasts']:
        a = b.get('animal'); f = b.get('faction')
        fo = b.get('fossil') or {}; dn = b.get('dna') or {}
        if not (b.get('species') and fo.get('site') and fo.get('state') and fo.get('ref')): bad.append(a + ': no fossil named'); continue
        if dn.get('status') not in ('read', 'readable') or not dn.get('ref'): bad.append(a + ': its DNA is neither read nor readable'); continue
        if not (b.get('surrogate') and b.get('mojave')): bad.append(a + ': no surrogate mother or no Mojave reason'); continue
        if a in book.get('not_lab_made', {}): bad.append(a + ': both lab-made and loose'); continue
        if a in seen: bad.append(a + ': counted twice'); continue
        mix = ne['mix'].get(f) or {}
        dealt = {k for ph in mix.values() for k in ph}
        rows = [k for k in b.get('rows', []) if k in dealt and rig.get(k) == 'beast_' + a]
        if not ne['factions'].get(f, {}).get('beast'): bad.append(a + ': its party ' + str(f) + ' is no beast party'); continue
        if not rows: bad.append(a + ': its party deals none of its rows on its own sheet'); continue
        L = idx.get('beast_' + a)
        if not L or not os.path.exists(os.path.join(ROOT, 'slices/fight_rig', L['file'])): bad.append(a + ': no sheet in the fight'); continue
        if not met(D, f): bad.append(a + ': its party is never met (no road, no ground, no giant)'); continue
        if b.get('added_by', '').startswith(BY):
            if fo.get('state') != 'Nevada': bad.append(a + ': BESTIARY added it without a Nevada fossil'); continue
            row = next((r for r in ne['rows'] if r['id'] in rows), None)
            genus = b['species'].split()[0]
            if not row or genus not in (row.get('real') or ''): bad.append(a + ': its row does not name ' + genus); continue
        seen.add(a); fielded.append(a)
    # the living animals loose in the valley (law s3): fielded on their own sheets, not lab-made
    loose_fielded = []
    allk = {k for f, v in ne['factions'].items() if v.get('beast') for ph in (ne['mix'].get(f) or {}).values() for k in ph}
    allk |= {k for ph in D['ours']['enemy_tiers']['value']['mix'].get('beasts', {}).values() for k in ph}
    for a in sorted(set(book.get('not_lab_made', {})) - {'_why'}):
        if any(rig.get(k) == 'beast_' + a for k in allk) and 'beast_' + a in idx: loose_fielded.append(a)
    # every beast party is in the book or loose: no beast of unknown origin
    inbook = {b.get('faction') for b in book['beasts']}
    loose = set(book.get('not_lab_made', {})) - {'_why'}
    for f, v in ne['factions'].items():
        if not v.get('beast'): continue
        if f in inbook: continue
        kinds = {k for ph in (ne['mix'].get(f) or {}).values() for k in ph}
        looks = {rig.get(k, '')[6:] for k in kinds}
        if not looks or not looks <= loose: bad.append(f + ': a beast party of unknown origin (in no book, not loose)')
    return fielded, bad, loose_fielded


def shapes(im, L, rows, k=1):
    out = []
    for r in rows:
        m, foot = OL.mask(im, L, r)
        if k > 1:
            h, w = m.shape
            sm = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).resize((max(1, w // k), max(1, h // k)), Image.BILINEAR)) > 100
            m = sm
        out.append((m, foot))
    return out


def f4(D, swap=None):
    """-> {beast: (closest at the fight's size, its pair), (closest at the map's fifth, its pair), marks}"""
    idx = D['index']; dirs = idx['dirs']; rows = [dirs.index('E'), dirs.index('SE')]
    looks = sorted(set(sheet_of_row(D).values()) | {'beast_' + b['animal'] for b in D['book']['beasts']} | {'beast_teratorn'})
    looks = [l for l in looks if l in idx['looks']]
    swap = swap or {}
    img = {}
    for l in looks:
        L = idx['looks'][swap.get(l, l)]
        img[l] = (Image.open(os.path.join(ROOT, 'slices/fight_rig', L['file'])), L)
    S1 = {l: shapes(*img[l], rows) for l in looks}
    S5 = {l: shapes(*img[l], rows, MAP_SCALE) for l in looks}
    mine = ['beast_' + b['animal'] for b in D['book']['beasts'] if b.get('added_by', '').startswith(BY) and 'beast_' + b['animal'] in img]
    out = {}
    for l in mine:
        best1 = min(((sum(OL.dist(S1[l][i], S1[o][i]) for i in range(2)) / 2, o) for o in looks if o != l))
        best5 = min(((sum(OL.dist(S5[l][i], S5[o][i]) for i in range(2)) / 2, o) for o in looks if o != l))
        im, L = img[l]
        mk = OL.marks(im, L, len(dirs))
        out[l] = (best1, best5, mk)
    return out


def f5(D, ne=None):
    ne = ne or D['ne']; bad = []
    old = [r for r in ne['rows'] if r.get('beast') and not any(b['animal'] in (r.get('beast', {}).get('rig') or '') and b.get('added_by', '').startswith(BY)
                                                               for b in D['book']['beasts'])]
    keys = set().union(*[set(r) for r in old]); bkeys = set().union(*[set(r['beast']) for r in old]) | {'flat'}
    pages = {r['id'] for r in D['atk']['rows']}
    for b in D['book']['beasts']:
        if not b.get('added_by', '').startswith(BY): continue
        for r in ne['rows']:
            if r.get('beast', {}).get('rig') != 'beast_' + b['animal']: continue
            if r['brain'] not in ne['brains']: bad.append(r['id'] + ': a brain the file does not have (' + r['brain'] + ')')
            extra = set(r) - keys; bx = set(r['beast']) - bkeys
            if extra or bx: bad.append(r['id'] + ': keys the other beasts lack ' + ','.join(sorted(extra | bx)))
            if r['beast'].get('attack') and r['beast']['attack'] not in pages: bad.append(r['id'] + ': its attack is no page')
            v = (ne['brains'].get(r['brain']) or {}).get('value', {})
            if r['brain'] not in D['ne']['brains'] or not set(v) <= set().union(*[set((x.get('value') or {})) for x in D['ne']['brains'].values()]):
                bad.append(r['id'] + ': its brain is not one the file had')
    return bad


def men_data(D):
    """F10's data half: the faults the files alone can show"""
    ne = D['ne']; bad = []
    wiki = {r['id'] for r in J('records/target/bb/enemies.json')['rows']} if isinstance(J('records/target/bb/enemies.json'), dict) else set()
    pools = {k: set(v) for k, v in D['ours']['people_looks']['value']['band'].items() if isinstance(v, list)}
    for r in ne['rows']:
        if r.get('looks') and not r.get('beast'): pools['row:' + r['id']] = set(r['looks'])
    T = D['ours']['enemy_tiers']['value']
    dealt = set(ne['heads'].values()) | set((T.get('heads') or {}).values()) | {k for m in list(ne['mix'].values()) + list(T['mix'].values()) for ph in m.values() for k, w in ph.items() if w}
    mine = [r for r in ne['rows'] if str(r.get('added_by', '')).startswith(BY) and not r.get('beast')]
    for r in mine:
        if wiki and r.get('from') not in wiki: bad.append(r['id'] + ': rides no wiki row')
        if not r.get('lesson_bb') or not r.get('lesson') or not r.get('draft'): bad.append(r['id'] + ': no lesson (Battle Brothers and ours, draft)')
        if r.get('brain') not in ne['brains']: bad.append(r['id'] + ': a brain the file does not have')
        me = set(r.get('looks') or [])
        if not me: bad.append(r['id'] + ': no looks')
        for k, v in pools.items():
            if k != 'row:' + r['id'] and me & v: bad.append(r['id'] + ': wears what %s wears (%s)' % (k.replace('row:', ''), ', '.join(sorted(me & v))[:60]))
        if r['id'] not in dealt: bad.append(r['id'] + ': no party deals it')
    return mine, bad


def champs_data(D, ne=None):
    ne = ne or D['ne']; CH = (ne.get('champions') or {}).get('kinds') or {}
    mixes = list(D['ours']['enemy_tiers']['value']['mix'].values()) + list(ne['mix'].values())
    dealt = sorted({k for m in mixes for ph in m.values() for k in ph if k.endswith('_champion')})
    bad = [k + ': no title or under three names' for k in dealt if not (CH.get(k) or {}).get('title') or len((CH.get(k) or {}).get('names') or []) < 3 or not (CH.get(k) or {}).get('draft')]
    return dealt, bad


def main():
    D = load()
    law = open(os.path.join(ROOT, 'laws/BOHEMIA_LAW_THE_BEASTS_ARE_LAB_MADE_AND_THE_BESTIARY_FLOOR_9_29_26.md')).read()
    FL = D['roster']['floor']

    # ---------------- THE PLANTS FIRST: each fault must turn its own leg red ----------------
    plants = []
    P = json.loads(json.dumps(D)); last = P['book']['beasts'][-1]; P['ne']['mix'].pop(last['faction'], None)
    n, _, _ = f3(P); plants.append(('one beast removed (%s)' % last['animal'], len(n) < LAB_MADE_NOW))
    P = json.loads(json.dumps(D)); P['ne']['factions']['glowing_rats'] = {'name': 'Glowing Rats', 'beast': True}
    P['ne']['mix']['glowing_rats'] = {'first': {'coyote': 1}}; P['book']['not_lab_made'].pop('coyote', None)
    _, bad, _ = f3(P); plants.append(('a beast of unknown origin', any('unknown origin' in x for x in bad)))
    P = json.loads(json.dumps(D)); P['book']['beasts'][-2]['fossil']['site'] = ''
    _, bad, _ = f3(P); plants.append(('a beast with no fossil', any('no fossil' in x for x in bad)))
    P = json.loads(json.dumps(D))
    for r in P['ne']['rows']:
        if r['id'] == 'american_cheetah': r['brain'] = 'flier'; r['flies'] = True
    P['ne']['brains']['flier'] = {'value': {'advance': True, 'flies': True}}
    plants.append(('a new brain and a flies key', bool(f5(D, P['ne']))))
    P = json.loads(json.dumps(D))
    for r in P['ne']['rows']:
        if r['id'] == 'watch_bowman': r['looks'] = [x for x in D['ne']['rows'] if x['id'] == 'watch_neighbor'][0]['looks'][:1]
    _, bad = men_data(P); plants.append(('a new man in another\'s clothes', any('watch_bowman: wears' in x for x in bad)))
    P = json.loads(json.dumps(D))
    for m in P['ne']['mix'].get('watch', {}).values(): m.pop('watch_bowman', None)
    _, bad = men_data(P); plants.append(('a new man no party deals', any('watch_bowman: no party' in x for x in bad)))
    P = json.loads(json.dumps(D)); k0 = sorted(P['ne']['champions']['kinds'])[0]; P['ne']['champions']['kinds'][k0]['names'] = []
    _, bad = champs_data(D, P['ne']); plants.append(('a champion with no name', any(k0 in x for x in bad)))
    sw = f4(D, swap={'beast_stilt_legged_horse': 'beast_ice_age_horse'})
    plants.append(('the stilt-legged horse drawn on the Ice Age horse\'s sheet', sw.get('beast_stilt_legged_horse', ((1, ''),))[0][0] < FLOOR))
    leg(all(p[1] for p in plants), 'PLANTED: every leg refuses its fault (' + '; '.join(p[0] for p in plants) + ')',
        ', '.join(p[0] + ' WAS NOT CAUGHT' for p in plants if not p[1]))

    # ---------------- F0 ----------------
    ok = FL.get('factions') == 12 and FL.get('types') == 75 and FL.get('beasts') == 17 and FL.get('bosses') == 3 and FL.get('champions') is True
    ok = ok and '12 combat factions, about 75 enemy types, 17 beasts, 3 bosses' in law
    leg(ok, 'F0 THE FLOOR IS HIS: 12 factions, 75 types, 17 beasts, 3 bosses, champions (roster.json and the law agree)')
    # ---------------- F1 ----------------
    fs = D['factions']['factions']; mirror = D['ne']['road']['holds_mirror']
    fight_f = set(D['ours']['enemy_tiers']['value']['mix']) | set(D['ne']['mix'])
    fought = [f['id'] for f in fs if f['id'] == 'beasts' or any(v == f['id'] and k in fight_f for k, v in mirror.items())]
    leg(len(fs) >= FL['factions'] and len(fought) >= FACTIONS_FIELDED_NOW,
        'F1 FACTIONS: %d combat factions in the roster data (floor %d); THE FIGHT FIELDS A PARTY FOR %d of them (never below %d): %s; none yet: %s'
        % (len(fs), FL['factions'], len(fought), FACTIONS_FIELDED_NOW, ', '.join(fought), ', '.join(f['id'] for f in fs if f['id'] not in fought) or 'none'))
    # ---------------- F2 ----------------
    c = D['roster']['count']
    leg(c['types'] >= FL['types'] and c['types_in_the_fight'] >= TYPES_IN_THE_FIGHT_FLOOR,
        'F2 TYPES: %d enemy types in the roster data (floor %d), each with its family and lesson; THE FIGHT FIELDS %d of his %d (never below %d)'
        % (c['types'], FL['types'], c['types_in_the_fight'], FL['types'], TYPES_IN_THE_FIGHT_FLOOR))
    # ---------------- F3 ----------------
    fielded, bad, loose = f3(D)
    nev = [b['animal'] for b in D['book']['beasts'] if b['animal'] in fielded and b['fossil']['state'] == 'Nevada']
    wait = [b['animal'] for b in (D['book'].get('waiting') or {}).get('beasts', [])]
    leg(not bad and len(fielded) + len(loose) >= FL['beasts'] and len(fielded) >= LAB_MADE_NOW,
        'F3 THE BEASTS: %d animals the fight fields (floor %d): %d LAB-MADE (never below %d; the goal %d), %d of them from Nevada\'s own fossils, and %d living animals loose in the valley (law s3)%s'
        % (len(fielded) + len(loose), FL['beasts'], len(fielded), LAB_MADE_NOW, FL['beasts'], len(nev), len(loose),
           ('; waiting for room: ' + ', '.join(wait)) if wait else ''), '; '.join(bad[:6]))
    # ---------------- F4 ----------------
    R = f4(D)
    under = [(l[6:], b1, b5) for l, (b1, b5, mk) in R.items() if b1[0] < FLOOR or b5[0] < FLOOR]
    nomark = [(l[6:], mk) for l, (b1, b5, mk) in R.items() if sum(1 for x in mk if x >= MARK_PX) < MARK_FACINGS]
    worst1 = min((v[0] for v in R.values()), default=(1, '')); worst5 = min((v[1] for v in R.values()), default=(1, ''))
    leg(R and not under and not nomark,
        'F4 IT READS AS ITS ANIMAL: each of the %d BESTIARY beasts keeps its own outline at the fight\'s size (closest %.2f, to %s) and at the map\'s fifth (closest %.2f, to %s), floor %.2f; its lab plate shows in %d+ facings'
        % (len(R), worst1[0], worst1[1][6:], worst5[0], worst5[1][6:], FLOOR, MARK_FACINGS),
        '; '.join('%s %.2f/%.2f' % (n, a[0], b[0]) for n, a, b in under) + '; '.join('%s plate %s' % x for x in nomark))
    if '--pairs' in sys.argv:
        for l, (b1, b5, mk) in sorted(R.items()): print('     %-22s fight %.3f (%s)  map %.3f (%s)  plate %s' % (l[6:], b1[0], b1[1][6:], b5[0], b5[1][6:], mk))
    # ---------------- F5 ----------------
    bad = f5(D)
    leg(not bad, 'F5 NO SPECIAL SYSTEMS: every BESTIARY beast rides a brain the file has, no key the other beasts lack, its attack a page', '; '.join(bad[:4]))
    # ---------------- F6 ----------------
    bs = [b['boss']['name'] for b in D['bosses']['bosses'] if b.get('boss') and b.get('board') and b.get('crew')]
    leg(len(bs) >= FL['bosses'], 'F6 BOSSES: %d bosses the fight stages, each on its board with its crew (floor %d): %s' % (len(bs), FL['bosses'], ', '.join(bs)))
    # ---------------- F7 ----------------
    champ, bad = champs_data(D)
    try:
        r = subprocess.run(['node', os.path.join(ROOT, 'gates/the_bestiary_floor_men.js')], cwd=ROOT, capture_output=True, text=True, timeout=900)
        HL = json.loads([l for l in r.stdout.splitlines() if l.startswith('RESULT ')][-1][7:])
    except Exception as e:
        HL = {}; bad.append('the live rules did not answer: ' + str(e)[:120])
    for k in champ:
        c = (HL.get('champions') or {}).get(k) or {}
        if not (c.get('named') and c.get('unique')): bad.append(k + ': a dealt champion is not named from his list, or two share a name ' + json.dumps(c)[:100])
    for f, rt in (HL.get('rate') or {}).items():
        if rt.get('before_late'): bad.append('%s: %d in 100 bands carry a champion before the late phase' % (f, rt['before_late']))
        if rt.get('most_in_a_band', 0) > 1: bad.append('%s: a band carries %d champions' % (f, rt['most_in_a_band']))
    if not HL.get('rate'): bad.append('no band rate measured')
    leg(bool(champ) and not bad, 'F7 CHAMPIONS ARE RARE NAMED MEN: %d champion kinds dealt, each with its title and its names (%s); none before the late phase, never two in a band; late bands of 12 that carry one: %s'
        % (len(champ), '; '.join('%s: %s' % (k, ', '.join((D['ne']['champions']['kinds'].get(k) or {}).get('names', [])[:3])) for k in champ),
           ', '.join('%s %d/100' % (f, rt['late']) for f, rt in sorted((HL.get('rate') or {}).items()))), '; '.join(bad[:4]))
    # ---------------- F10 ----------------
    mine, bad = men_data(D)
    for r in mine:
        o = (HL.get('men') or {}).get(r['id']) or {}
        a = o.get('acts') or {}
        if not o.get('dealt'): bad.append(r['id'] + ': its party never deals it on the live rules')
        if not o.get('fromGear') or not o.get('weapon'): bad.append(r['id'] + ': not armed from its own gear')
        if (a.get('melee', 0) + a.get('ranged', 0)) == 0: bad.append(r['id'] + ': never strikes in 10 fights')
        if r.get('brain') == 'volley' and not (o.get('ranged') and a.get('ranged', 0) > a.get('melee', 0)): bad.append(r['id'] + ': a volley brain that does not shoot')
        bv = (D['ne']['brains'].get(r.get('brain')) or {}).get('value') or {}
        if bv.get('kicks') and not a.get('kick'): bad.append(r['id'] + ': a great swing that never swings round')
        if bv.get('charges') and not a.get('charge'): bad.append(r['id'] + ': a charge that never runs in')
        if bv.get('flings') and not a.get('flings'): bad.append(r['id'] + ': a thrower who never throws')
        if bv.get('screams') and not a.get('horrific_scream'): bad.append(r['id'] + ': a horn that never sounds')
        w6, w0 = (o.get('won_by_crew_of_6') or 0), o.get('won_without_him')
        if w6 < 6 and not (w0 is not None and w6 >= w0 - 1): bad.append('%s: a crew of 6 beats its party %s in 10 (%s without him)' % (r['id'], w6, w0))
    wait = [r['id'] for r in (D['ne'].get('waiting') or {}).get('rows', [])]
    for r in (D['ne'].get('waiting') or {}).get('rows', []):
        if r.get('looks'): bad.append(r['id'] + ': a waiting row carries looks (it waits for its own clothes)')
    leg(mine and not bad, 'F10 THE NEW MEN: %d enemy types BESTIARY added, each on a wiki row with its lesson, in its own clothes, dealt by its party, armed from its own gear and striking its own way on the live rules (%s)%s'
        % (len(mine), '; '.join('%s %s, %s, %d/%d struck near/far%s' % (r['id'], (HL.get('men') or {}).get(r['id'], {}).get('weapon'), r['brain'],
                                (HL.get('men') or {}).get(r['id'], {}).get('acts', {}).get('melee', 0), (HL.get('men') or {}).get(r['id'], {}).get('acts', {}).get('ranged', 0),
                                ''.join(', %d %s' % (v, {'kick': 'great swings', 'charge': 'charges', 'flings': 'throws', 'horrific_scream': 'horn blasts'}[k]) for k, v in ((HL.get('men') or {}).get(r['id'], {}).get('acts', {}) or {}).items() if k in ('kick', 'charge', 'flings', 'horrific_scream') and v)) for r in mine),
           ('; WAITING FOR ITS OWN CLOTHES (CHARACTER): ' + ', '.join(wait)) if wait else ''),
        '; '.join(bad[:4]))
    # ---------------- F9: the five end to end on the page, a phone upright and sideways (rule 441(a)) ----------------
    if '--no-browser' not in sys.argv:
        mine = [(b['faction'], b['animal'], b['rows']) for b in D['book']['beasts'] if b.get('added_by', '').startswith(BY)]
        bad = []; res = {}
        try:
            r = subprocess.run(['node', os.path.join(ROOT, 'gates/the_bestiary_floor_fight.js')], cwd=ROOT, capture_output=True, text=True, timeout=4200)
            line = [l for l in r.stdout.splitlines() if l.startswith('RESULT ')]
            res = json.loads(line[-1][7:]) if line else {}
        except Exception as e:
            bad.append('the browser did not answer: ' + str(e)[:120])
        for prof in ('portrait', 'landscape', 'alpha_portrait', 'alpha_landscape'):
            runs = res.get(prof) or {}
            if not runs: bad.append(prof + ': no run'); continue
            if runs.get('errs'): bad.append(prof + ': the page threw ' + ' | '.join(e[:200] for e in runs['errs'][:3]))
            for f, a, rows in ([] if prof.startswith('alpha_') else mine):
                o = runs.get(f) or {}
                ok = (o.get('fight') and o.get('sheets') and all(x == 'beast_' + a for x in o['sheets']) and o.get('says') and o.get('drawn')
                      and o.get('home') and (o.get('kill') or {}).get('kind') in rows and (o.get('take') or {}).get('ok')
                      and (o['take'].get('food') or 0) > 0 and (o['take'].get('hides') or 0) >= 1)
                if not ok: bad.append('%s %s: %s' % (prof, f, json.dumps(o)[:160]))
            men, _ = men_data(D)
            for r in men:
                o = (runs.get('men') or {}).get(r['id']) or {}
                fl = o.get('fielded') or []
                ok = (o.get('fight') and fl and all(x.get('own') and x.get('drawn') and x.get('look') in r['looks'] and x.get('name') == r['board_name'] and x.get('weapon') for x in fl)
                      and o.get('says') and o.get('home'))
                if not ok: bad.append('%s %s: %s' % (prof, r['id'], json.dumps(o)[:160]))
            ch = runs.get('champion') or {}
            if not (ch.get('named') and ch.get('inList') and all(x.get('onBoard') for x in ch['named']) and ch.get('home')
                    and any(str(x.get('title') or '').upper() in str(ch.get('hold') or '') for x in ch['named'])):
                bad.append('%s champion: %s' % (prof, json.dumps(ch)[:200]))
        leg(not bad, 'F9 ON THE PAGE, UPRIGHT AND SIDEWAYS (rule 441(a)), THE DEMO AND THE ALPHA: each of the %d BESTIARY beasts through the one door on the demo: fielded on its own sheet with its own words, the win home, its kill on the map in its picture, one tap: food and a roll of hides; each new man fielded in his own clothes, named and armed, the win home, and a late road crew\'s champion named from his list with his title on his card, on the demo and the alpha; nothing thrown' % len(mine),
            '; '.join(bad[:4]))
    # ---------------- F8 ----------------
    r = subprocess.run([sys.executable, 'tools/bohemia_combat_the_roster.py', '--check'], cwd=ROOT, capture_output=True, text=True)
    leg(r.returncode == 0, 'F8 THE ROSTER FILE IS FRESH (tools/bohemia_combat_the_roster.py --check)', r.stdout.strip())
    print('THE BESTIARY FLOOR: %d passed, %d failed' % (passed, failed))
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
