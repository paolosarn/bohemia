#!/usr/bin/env python3
"""THE DEAD ARE MADE (COOK DEAD 11/3, rule 360 THE DEAD ARE EVERYWHERE and its amendment the same round; rule 337).

Paolo 11/3: 'we don't see enough corpses even throughout the world or in the combat map... make things as realistic as
possible... billions of people have died.' Amended the same round: 'keep the bodies lore friendly... if it's a busy
civilized settlement or part of the town, obviously they don't have [corpses], but the gameplay should be very
simplified.'

This gate holds COOK DEAD's half: the dead exist as real models with their pictures and a contract COMBAT MAPS 3 and
WORLD can place from (records/target/dead/manifest.json, written by tools/bohemia_cook_dead_card_11_3_26.py). It reads
files only (no browser, no Blender):
  1. THE SET: at least twelve pieces; every one has its .glb (a real binary glTF with meshes) and its picture, the
     picture's size is the manifest's, its ground pixel is inside it, and the picture is at the board's ruler (its width
     covers the model's own width at 42.92 px a metre).
  2. THE FIGHT'S OWN WORDS, AND SIMPLE (rule 360 amended (b)): role cover / blocking / none, kind COVER / LOW_COVER /
     NONE, tile '#' or '.': a thing on a tile, cover or a blocker at most, no new rule.
  3. WHO TOUCHED THEM LAST (the brief: 'the living moved them, robbed them or buried them, so each piece tells which'):
     moved / robbed / buried / nobody, with the sentence that tells it; every one of the four is used.
  4. NEVER GORE (the analog horror law, at the source): no material in any model uses the palette's blood role.
  5. THE COUNT (rule 360's 'a gate per place'): COMBAT MAPS 3's fifteen places all carry a count and a floor (2 or more,
     never over the count); and LORE-FRIENDLY (rule 360 amended (a)): the places where people live and bury (golf,
     suburbs, subs) carry graves only, no body; the lived-in rule is written in the contract.
  6. THE PITS: a piece with a hole names it in metres inside its own footprint, and its depth.
  7. THE VOTE CARD: one card in the registry showing records/target/dead/CARD_THE_DEAD.webp, its sha a real commit, its
     first picture cut from the card.
OWED, PRINTED NOT RED: the boards carrying them (COMBAT MAPS 3 places them after its roads; a board's own floor leg
belongs with its placing) and the map (WORLD).
"""
import os, sys, json, struct, subprocess

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAN = os.path.join(R, 'records/target/dead/manifest.json')
REG = os.path.join(R, 'records/target/BOHEMIA_VOTE_REGISTRY.json')
FIFTEEN = ['lab', 'airport', 'golf', 'trailer', 'desert', 'redrock', 'pass', 'shore', 'wash', 'suburbs', 'landfill', 'strip', 'downtown', 'works', 'marina']
LIVED = ['golf', 'suburbs', 'subs']
passed = failed = 0


def ok(name, cond, why=''):
    global passed, failed
    if cond: passed += 1; print('  ok   ' + name)
    else: failed += 1; print('  RED  ' + name + ('  -- ' + why if why else ''))


def glb_json(fn):
    b = open(fn, 'rb').read()
    if b[:4] != b'glTF': return None
    n = struct.unpack('<I', b[12:16])[0]
    return json.loads(b[20:20 + n])


def main():
    from PIL import Image
    if not os.path.exists(MAN):
        ok('the contract exists (records/target/dead/manifest.json)', False); return 1
    M = json.load(open(MAN)); ppm = float(M['px_per_metre'])
    mods = M['models']
    print('THE DEAD ARE MADE: %d pieces, %d places' % (len(mods), len(M['places'])))
    ok('THE SET: at least twelve pieces (the brief: about twelve to fifteen)', len(mods) >= 12, str(len(mods)))
    bad_file, bad_pic, bad_anchor, bad_scale, bad_words, bad_who, gore, bad_hole = [], [], [], [], [], [], [], []
    for m in mods:
        g = os.path.join(R, m['model']); p = os.path.join(R, m['picture'])
        J = glb_json(g) if os.path.exists(g) else None
        if not J or not J.get('meshes'): bad_file.append(m['id']); continue
        if any('blood' in (mt.get('name') or '').lower() for mt in J.get('materials', [])): gore.append(m['id'])
        if not os.path.exists(p): bad_pic.append(m['id']); continue
        im = Image.open(p)
        if list(im.size) != list(m['picture_px']): bad_pic.append('%s %s != %s' % (m['id'], im.size, m['picture_px']))
        ax, ay = m['anchor_px']
        if not (0 <= ax <= im.size[0] and 0 <= ay <= im.size[1]): bad_anchor.append(m['id'])
        if im.size[0] < 0.85 * m['size_m'][0] * ppm: bad_scale.append('%s %d px for %.1f m' % (m['id'], im.size[0], m['size_m'][0]))
        f = m['fight']
        if m['role'] not in ('cover', 'blocking', 'none') or f['kind'] not in ('COVER', 'LOW_COVER', 'NONE') or f['tile'] not in ('#', '.'):
            bad_words.append('%s %s/%s/%s' % (m['id'], m['role'], f['kind'], f['tile']))
        if m.get('who') not in ('moved', 'robbed', 'buried', 'nobody') or len(m.get('tells') or '') < 20 or len(m.get('what') or '') < 40:
            bad_who.append(m['id'])
        for h in m.get('holes_m', []):
            cx, cy, hx, hy = h
            if not (hx > 0 and hy > 0 and abs(cx) + hx <= m['size_m'][0] and abs(cy) + hy <= m['size_m'][1] and m.get('depth_m', 0) > 0.5):
                bad_hole.append(m['id'])
    ok('  every piece is a real model (a binary glTF with meshes)', not bad_file, ', '.join(bad_file))
    ok('  every picture exists at the manifest\'s size', not bad_pic, '; '.join(bad_pic))
    ok('  every ground pixel is inside its picture', not bad_anchor, ', '.join(bad_anchor))
    ok('  every picture is at the board\'s ruler (%.2f px a metre)' % ppm, not bad_scale, '; '.join(bad_scale))
    ok('SIMPLE (rule 360 amended b): the fight\'s own words only, cover or a blocker at most', not bad_words, '; '.join(bad_words))
    ok('WHO TOUCHED THEM LAST: every piece says moved, robbed, buried or nobody, and tells it', not bad_who, ', '.join(bad_who))
    ok('  all four are used', {m.get('who') for m in mods} >= {'moved', 'robbed', 'buried', 'nobody'})
    ok('NEVER GORE: no model uses the palette\'s blood', not gore, ', '.join(gore))
    ok('THE PITS: every hole sits inside its piece and has a depth', not bad_hole, ', '.join(bad_hole))
    P = {p['id']: p for p in M['places']}
    miss = [p for p in FIFTEEN if p not in P]
    ok('THE COUNT: every one of COMBAT MAPS 3\'s fifteen places has a count', not miss, ', '.join(miss))
    badf = [p['id'] for p in M['places'] if not (2 <= p['floor'] <= p['pieces'])]
    ok('  every place\'s floor is 2 or more and never over its count', not badf, ', '.join(badf))
    ids = {m['id'].split('.')[1] for m in mods}
    unknown = [(p['id'], k) for p in M['places'] for k in p['count'] if k not in ids]
    ok('  every count names a piece that exists', not unknown, str(unknown))
    bodies = {b.split('.')[1] for b in M.get('bodies', [])}
    lived = [(p, k) for p in LIVED for k in P.get(p, {}).get('count', {}) if k in bodies]
    ok('LORE-FRIENDLY (rule 360 amended a): where people live and bury, graves only, no body', bool(bodies) and not lived and all(p in P for p in LIVED), str(lived))
    ok('  the lived-in rule is written in the contract', 'NO BODIES' in (M.get('lived_in') or ''))
    reg = json.load(open(REG))
    cards = [i for i in reg['items'] if (i.get('show') or {}).get('src', '').endswith('records/target/dead/CARD_THE_DEAD.webp')]
    ok('THE VOTE CARD: one card shows the set on a real board', len(cards) >= 1, str(len(cards)))
    if cards:
        c = cards[0]
        real = subprocess.run(['git', 'cat-file', '-e', c.get('sha', 'x') + '^{commit}'], cwd=R, capture_output=True).returncode == 0
        ok('  its sha is a real commit (%s)' % c.get('sha'), real)
        ok('  its first picture is cut from the card', bool(c['show'].get('first')) and os.path.exists(os.path.join(R, 'slices', c['show']['first'])))
        ok('  the card exists', os.path.exists(os.path.join(R, 'records/target/dead/CARD_THE_DEAD.webp')))
    print('  OWED (not this gate\'s red): the boards carrying them past each floor (COMBAT MAPS 3, after its roads) and the map (WORLD)')
    print('THE DEAD ARE MADE: %d passed, %d failed' % (passed, failed))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
