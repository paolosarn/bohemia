#!/usr/bin/env python3
"""EACH MAN HIS OWN SKIN (RUN TWO [each man his own skin], 10/19/26; rule 120(d); rule 121(e)).

His words, 10/18: 'Black people looking like white people'. EYES measured 115 of 118 faces BACK beside the flat bodies,
every body painted the player's skin. From [the 3D models on your screens] RUN TWO's screens draw 3D bodies: PORTRAIT's
crew rig on the crew card, CHARACTER's thirteen gangs standing in a settlement. This gate re-reads every face beside the
body it stands beside on those screens WITH EYES' OWN READ (tools/bohemia_run2_each_man_his_own_skin.py imports
tools/bohemia_eyes_every_face_beside_its_body_10_19_26.py: its 3D portrait read and its verdict, ITA band equal or next,
12 L* or less).
  E1  every pair is read: a body and a face for all twenty-six people the two screens draw, and for each gang the
      proof that CHARACTER's render and PORTRAIT's render of that body are one setup
  E2  every pair PASSES but the frozen list, the faces that were BACK the round this landed (PORTRAIT's, paused under
      rule 121: the bodies read their ONE SKIN tone, the faces are rendered darker); a pair not on it that is BACK is RED
  E3  the frozen list only shrinks: a face that passes again comes off it, or this is RED
  E4  CONTROL: a dark man's face read beside a light man's body is BACK (a ruler that never says BACK proves nothing)
    python3 gates/each_man_his_own_skin_gate.py
"""
import importlib.util, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FROZEN = {'cast_widebrim', 'cast_shorts'}   # 10/19: face 2 bands darker than its body; PORTRAIT [the face is the body's face]
ok_n = fail_n = 0


def ok(name, cond, why=''):
    global ok_n, fail_n
    if cond:
        ok_n += 1; print('  ok   ' + name)
    else:
        fail_n += 1; print('  FAIL ' + name + ('  [' + why + ']' if why else ''))


spec = importlib.util.spec_from_file_location('run2_skin', os.path.join(ROOT, 'tools/bohemia_run2_each_man_his_own_skin.py'))
T = importlib.util.module_from_spec(spec); spec.loader.exec_module(T)
E = T.eyes()
rows = T.read_all(E)
read = [r for r in rows if r['verdict'] in ('PASS', 'BACK')]
ok('E1 every person the crew card and the settlement draw is read, body and face (%d of %d)' % (len(read), len(rows)),
   len(rows) == 26 and len(read) == 26, ', '.join('%s %s' % (r['who'], r['verdict']) for r in rows if r not in read))
ok('E1 each gang\'s body: CHARACTER\'s render and PORTRAIT\'s are one camera, one light, one skin',
   all(r.get('one_setup') and not r['one_setup']['settings_apart'] and r['one_setup']['skin_material_in_both'] and r['one_setup']['skin_wear_same']
       for r in rows if r['who'].startswith('faction_')))
back = {r['who'] for r in rows if r['verdict'] == 'BACK'}
new = back - FROZEN
ok('E2 every face beside its body is the same person, but the frozen list (%d PASS)' % sum(r['verdict'] == 'PASS' for r in rows),
   not new, '; '.join(next(l['said'] for l in r['legs'] if l['leg'] == 'skin') + ' (' + r['who'] + ')' for r in rows if r['who'] in new))
ok('E3 the frozen list only shrinks (%s still owed to PORTRAIT)' % ', '.join(sorted(FROZEN & back)), not (FROZEN - back),
   'passes now, take it off FROZEN: ' + ', '.join(sorted(FROZEN - back)))
ctl = T.read_all(E, ['you'], face_of=lambda l: 'faction_blues')[0]
ok('E4 CONTROL: a dark man\'s face beside a light man\'s body is BACK', ctl['verdict'] == 'BACK',
   next((l['said'] for l in ctl.get('legs', []) if l['leg'] == 'skin'), ctl['verdict']))
print('\n=== EACH MAN HIS OWN SKIN: %d passed, %d failed ===' % (ok_n, fail_n))
sys.exit(1 if fail_n else 0)
