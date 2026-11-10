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
  F7 CHAMPIONS: the fight's parties deal a champion kind (a '_champion' row in a party's mix: ours.json or bohemia_enemies.json).
  F8 THE ROSTER FILE IS FRESH (tools/bohemia_combat_the_roster.py --check).
  F9 ON THE PAGE (rule 441(a), the browser half gates/the_bestiary_floor_fight.js; --no-browser skips it): on the demo, a phone upright
     and sideways, each BESTIARY beast's party through the one door: fielded on its own sheet with its own words, the win home, its kill
     on the map in its own picture, one tap: food and a roll of hides; the page throws nothing.
PLANTED (--plant, and always run first): ONE BEAST REMOVED (the book's last animal's party taken out of the mix: 16, red); a beast of
unknown origin (a party in no book: red); a beast with no fossil (red); a new brain with a key nobody has (red); a sheet that copies
its kin (the stilt-legged horse drawn on the Ice Age horse's sheet: red). Each must turn its own leg red, or the gate fails.

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
TYPES_IN_THE_FIGHT_FLOOR = 49  # MEASURED 11/10 (42 before BESTIARY's seven): only ever raised
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
    leg(len(fs) >= FL['factions'], 'F1 FACTIONS: %d combat factions in the roster data (floor %d); the fight fields a party for %d of them (%s)'
        % (len(fs), FL['factions'], len(fought), ', '.join(fought)))
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
    mixes = list(D['ours']['enemy_tiers']['value']['mix'].values()) + list(D['ne']['mix'].values())
    champ = sorted({k for m in mixes for ph in m.values() for k in ph if k.endswith('_champion')})
    leg(bool(champ), 'F7 CHAMPIONS: the fight\'s parties deal %d champion kinds (%s)' % (len(champ), ', '.join(champ[:6])))
    # ---------------- F9: the five end to end on the page, a phone upright and sideways (rule 441(a)) ----------------
    if '--no-browser' not in sys.argv:
        mine = [(b['faction'], b['animal'], b['rows']) for b in D['book']['beasts'] if b.get('added_by', '').startswith(BY)]
        bad = []; res = {}
        try:
            r = subprocess.run(['node', os.path.join(ROOT, 'gates/the_bestiary_floor_fight.js')], cwd=ROOT, capture_output=True, text=True, timeout=1800)
            line = [l for l in r.stdout.splitlines() if l.startswith('RESULT ')]
            res = json.loads(line[-1][7:]) if line else {}
        except Exception as e:
            bad.append('the browser did not answer: ' + str(e)[:120])
        for prof in ('portrait', 'landscape'):
            runs = res.get(prof) or {}
            if not runs: bad.append(prof + ': no run'); continue
            if runs.get('errs'): bad.append(prof + ': the page threw ' + ' | '.join(e[:200] for e in runs['errs'][:3]))
            for f, a, rows in mine:
                o = runs.get(f) or {}
                ok = (o.get('fight') and o.get('sheets') and all(x == 'beast_' + a for x in o['sheets']) and o.get('says') and o.get('drawn')
                      and o.get('home') and (o.get('kill') or {}).get('kind') in rows and (o.get('take') or {}).get('ok')
                      and (o['take'].get('food') or 0) > 0 and (o['take'].get('hides') or 0) >= 1)
                if not ok: bad.append('%s %s: %s' % (prof, f, json.dumps(o)[:160]))
        leg(not bad, 'F9 ON THE PAGE, UPRIGHT AND SIDEWAYS (rule 441(a)): each of the %d BESTIARY beasts through the one door on the demo: fielded on its own sheet with its own words, the win home, its kill on the map in its picture, one tap: food and a roll of hides; nothing thrown' % len(mine),
            '; '.join(bad[:4]))
    # ---------------- F8 ----------------
    r = subprocess.run([sys.executable, 'tools/bohemia_combat_the_roster.py', '--check'], cwd=ROOT, capture_output=True, text=True)
    leg(r.returncode == 0, 'F8 THE ROSTER FILE IS FRESH (tools/bohemia_combat_the_roster.py --check)', r.stdout.strip())
    print('THE BESTIARY FLOOR: %d passed, %d failed' % (passed, failed))
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
