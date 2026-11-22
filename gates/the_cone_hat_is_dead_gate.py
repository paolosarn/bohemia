#!/usr/bin/env python3
"""THE CONE HAT IS DEAD (CHARACTER 11/22, rule 470(f), Paolo on a homework card: 'why are people wearing chinese rice farmer
hats btw wtf???'). GRAVEYARD IS FINAL and A DEAD SHAPE DOES NOT COME BACK UNDER A NEW NAME: the conical straw hat (HATS 1's
'CHINESE RICE FARMER HAT', shape 'cone') is in records/BOHEMIA_CLOTHING_GRAVEYARD.txt with its post-mortem.

The hat is still drawn where it was baked before his word (the 8 Caravans hall men through the Caravans' gang default, the old
faction_caravans look, the fight's cast_widebrim / Old Tavo, the Caravans' portrait face, the alpha's and the demo's wardrobe); the
plan to take it off every one is records/BOHEMIA_CHARACTER_THE_CONE_HAT_IS_DEAD_11_22_26.md. Until then this gate holds the line
the way THE RED DEBT does: what is left may only shrink.

  C1 NO NEW WEARER: no file the game serves or that makes a person (slices/ data and pages, the hat, outfit, look and portrait
     tables) carries the cone under any name (rice farmer, conical, coolie, cone hat) more often than it did on 11/22, and no new
     file carries it.
  C2 THE COUNT ONLY SHRINKS: when a file's count drops, lower its line in LEFT the same commit (a stale higher number lets one back).
  C3 NOBODY ROLLS IT: the barber's random mix never offers it (the barber's book's NOT_RANDOM_HATS keeps the 'cone' shape out).

    python3 gates/the_cone_hat_is_dead_gate.py
"""
import glob, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAT = re.compile(r'rice farmer|conical|coolie|cone hat', re.I)
# what is left on 11/22 (main f695f2b1a), file by file; every number only ever goes down
LEFT = {
    'slices/BOHEMIA_ALPHA_0_9.html': 5, 'slices/BOHEMIA_DEMO.html': 5, 'slices/BOHEMIA_LOOK_CURRENT.html': 1,
    'slices/fight_people/fight_people.json': 2, 'slices/rig_mix/caravans.json': 8,
    'tools/bohemia_character_hats_one.py': 3, 'tools/bohemia_faction_outfits.py': 1,
    'tools/bohemia_character_the_thirteen_through_the_rig.py': 3, 'tools/bohemia_portrait_the_head_from_the_model.py': 6,
}
TABLES = ['tools/bohemia_character_hats_one.py', 'tools/bohemia_faction_outfits.py', 'tools/bohemia_character_the_thirteen_through_the_rig.py',
          'tools/bohemia_portrait_the_head_from_the_model.py', 'tools/bohemia_character_the_nine_enemies.py',
          'tools/bohemia_character_garments_gear.py', 'tools/bohemia_character_garments_outer.py']
ok_n = bad_n = 0


def leg(cond, name, detail=''):
    global ok_n, bad_n
    if cond: ok_n += 1; print('  ok   ' + name)
    else: bad_n += 1; print('  FAIL ' + name + ('  [' + detail + ']' if detail else ''))


files = sorted(set(glob.glob(os.path.join(ROOT, 'slices', '*.html')) + glob.glob(os.path.join(ROOT, 'slices', '*.json')) +
                   glob.glob(os.path.join(ROOT, 'slices', '*', '*.json')) + glob.glob(os.path.join(ROOT, 'slices', '*.js')) +
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
new = sorted(set(found) - set(LEFT))
more = sorted(k for k in found if k in LEFT and found[k] > LEFT[k])
leg(not new and not more, 'C1 NO NEW WEARER: the cone is in no new file and in no file more often than on 11/22',
    '; '.join(['NEW %s (%d)' % (k, found[k]) for k in new] + ['MORE %s (%d > %d)' % (k, found[k], LEFT[k]) for k in more]))
stale = sorted(k for k in LEFT if found.get(k, 0) < LEFT[k])
leg(not stale, 'C2 THE COUNT ONLY SHRINKS: every LEFT line is the file\'s count today (lower it the commit it drops)',
    '; '.join('%s now %d, LEFT says %d' % (k, found.get(k, 0), LEFT[k]) for k in stale))
src = open(os.path.join(ROOT, 'tools/bohemia_character_the_barbers_book.py')).read()
leg(re.search(r"NOT_RANDOM_HATS\s*=.*'cone'", src) is not None, 'C3 NOBODY ROLLS IT: the barber\'s random mix keeps the cone shape out')
print('\nLEFT: %d mentions in %d files (%s)' % (sum(found.values()), len(found), ', '.join('%s %d' % kv for kv in sorted(found.items()))))
print('\n=== THE CONE HAT IS DEAD: %d passed, %d failed ===' % (ok_n, bad_n))
sys.exit(1 if bad_n else 0)
