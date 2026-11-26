#!/usr/bin/env python3
"""THE CONE HAT IS DEAD (CHARACTER 11/22, rule 470(f), Paolo on a homework card: 'why are people wearing chinese rice farmer
hats btw wtf???'). GRAVEYARD IS FINAL and A DEAD SHAPE DOES NOT COME BACK UNDER A NEW NAME: the conical straw hat (HATS 1's
'CHINESE RICE FARMER HAT', shape 'cone') is in records/BOHEMIA_CLOTHING_GRAVEYARD.txt with its post-mortem.

11/26 CHARACTER 2 TOOK IT OFF EVERY WEARER (records/BOHEMIA_CHARACTER_TWO_THE_CONE_COMES_OFF_11_26_26.md): the Caravans'
one-piece look and its speakers' faces (MANNY, MARISOL, the Caravans' clients) and Old Tavo / NUMBER 212 (cast_widebrim) wear the
DUST RANCHER HAT (tools/bohemia_character_dust_rancher_hat.py) on every sheet; the 8 Caravans hall men never drew it (a person's
build drops his gang's hat) and their labels now say what they wear; the 2D wardrobe's wide brim is the DUST RANCHER HAT.
So the line is NONE AT ALL, and the gate now reads engine/ too (the people index carried 8 labels it never saw).

  C1 NONE AT ALL: no file the game serves or that makes a person (slices/ data and pages, engine/, the hat, outfit, look and
     portrait tables) carries the cone under any name (rice farmer, conical, coolie, cone hat)
  C2 NO BUILDER MAKES IT: the gang looks have no hat kind 'cone', the portrait tool no 'cone hat' gear, HATS 1 no 'cone' shape
  C3 NOBODY ROLLS IT: the barber's random mix never offers it (the barber's book's NOT_RANDOM_HATS keeps the 'cone' shape out)
  C4 THE LABEL IS THE HAT HE WEARS: in the people index every person's head is the hat he rolled or none (a person's build
     drops his gang's default hat, so a gang default in his label is a hat he does not wear: 48 such labels until 11/26)

    python3 gates/the_cone_hat_is_dead_gate.py
"""
import glob, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAT = re.compile(r'rice farmer|conical|coolie|cone hat', re.I)
LEFT = {}   # 11/22: 35 mentions in 9 files; 11/26: none (CHARACTER 2)
TABLES = ['tools/bohemia_character_hats_one.py', 'tools/bohemia_faction_outfits.py', 'tools/bohemia_character_the_thirteen_through_the_rig.py',
          'tools/bohemia_portrait_the_head_from_the_model.py', 'tools/bohemia_character_the_nine_enemies.py',
          'tools/bohemia_character_garments_gear.py', 'tools/bohemia_character_garments_outer.py']
ok_n = bad_n = 0


def leg(cond, name, detail=''):
    global ok_n, bad_n
    if cond: ok_n += 1; print('  ok   ' + name)
    else: bad_n += 1; print('  FAIL ' + name + ('  [' + detail + ']' if detail else ''))


files = sorted(set(glob.glob(os.path.join(ROOT, 'slices', '*.html')) + glob.glob(os.path.join(ROOT, 'slices', '*.json')) +
                   glob.glob(os.path.join(ROOT, 'slices', '*', '*.json')) + glob.glob(os.path.join(ROOT, 'slices', '*.js')) + glob.glob(os.path.join(ROOT, 'engine', '*.js')) + glob.glob(os.path.join(ROOT, 'engine', '*.json')) +
                   glob.glob(os.path.join(ROOT, 'records/target/bb', '*.json')) + glob.glob(os.path.join(ROOT, 'records/run2', '*.json')) +
                   glob.glob(os.path.join(ROOT, 'records/character', '*.json')) + [os.path.join(ROOT, t) for t in TABLES]))
OLD_PAGES = ('slices/BOHEMIA_FACTION_DOSSIER_JUDGE_8_2_26.html', 'slices/BOHEMIA_LIFE_SLICE_7_19_26.html')   # judge pages of 8/2 and 7/19, history, no screen links them
found = {}
for f in files:
    rel = os.path.relpath(f, ROOT)
    if rel in OLD_PAGES: continue
    try: n = len(PAT.findall(open(f, errors='ignore').read()))
    except OSError: continue
    if n: found[rel] = n
leg(not found, 'C1 NONE AT ALL: the cone is in no file the game serves or that makes a person',
    '; '.join('%s (%d)' % kv for kv in sorted(found.items())))
T = lambda f: open(os.path.join(ROOT, f)).read()
th, pt, h1 = T('tools/bohemia_character_the_thirteen_through_the_rig.py'), T('tools/bohemia_portrait_the_head_from_the_model.py'), T('tools/bohemia_character_hats_one.py')
bad = [n for n, ok in (('the gang looks\' hat kind cone', not re.search(r"kind\s*=\s*'cone'|k\s*==\s*'cone'", th)),
                       ('the portrait gear cone hat', "'cone hat'" not in pt),
                       ('HATS 1 shape cone', not re.search(r"'cone'\)|shape\s*==\s*'cone'", h1))) if not ok]
leg(not bad, 'C2 NO BUILDER MAKES IT: no gang look, portrait gear or HATS 1 shape builds the cone', ', '.join(bad))
src = open(os.path.join(ROOT, 'tools/bohemia_character_the_barbers_book.py')).read()
leg(re.search(r"NOT_RANDOM_HATS\s*=.*'cone'", src) is not None, 'C3 NOBODY ROLLS IT: the barber\'s random mix keeps the cone shape out')
import json
mix = open(os.path.join(ROOT, 'engine/bohemia_people_mix.js')).read()
roll = {('person_' + p['id'].lower()): p for p in json.load(open(os.path.join(ROOT, 'records/run2/BOHEMIA_RUN2_THE_PEOPLE_ROLL.json')))}
wrong = []
for m in re.finditer(r'^\s*(\{"look":"person_.*\})\s*,?\s*$', mix, re.M):
    q = json.loads(m.group(1)); p = roll.get(q['look'])
    if p is None or not isinstance(q.get('wears'), dict): continue
    want = (p['hat'][4:] if p['hat'].startswith('HAT ') else p['hat']) if p.get('hat') else None
    if q['wears'].get('head') != want: wrong.append('%s says %s, wears %s' % (q['look'], q['wears'].get('head'), want))
leg(not wrong, 'C4 THE LABEL IS THE HAT HE WEARS: every person in the people index is labelled with his own hat or none', '; '.join(wrong[:6]) + (' and %d more' % (len(wrong) - 6) if len(wrong) > 6 else ''))
print('\nLEFT: %d mentions in %d files' % (sum(found.values()), len(found)))
print('\n=== THE CONE HAT IS DEAD: %d passed, %d failed ===' % (ok_n, bad_n))
sys.exit(1 if bad_n else 0)
