#!/usr/bin/env python3
"""THE PLACES WEAR THEIR OWN PIECE (COOK FIVE, 11/17/26; VAMILY rules 453, 441, 408, 409(c); the coordinator's 'COOK FIVE full
sweep': 'finished art wherever a VOTE card still says STAND-IN and he meets it first... the bus yard and the greenhouses,
WORLD 14's two newest places').

A real place (records/target/bb/real_places.json) wore on the map the kit art of the kind it is like. Its own piece is a
picture in slices/place_pieces/ (tools/bohemia_cook5_the_places_wear_their_own_piece_11_17_26.py, through the map's rig) that
slices/bohemia_place_pieces.js draws on the place's own block, under the fog. What can go wrong without anybody seeing it in
the tool: a piece for a place that is not on the list (never drawn), a picture the page cannot load, a piece too small to be
met on a phone, and a draw that never runs on the map he plays.

  S1 THE LIST: every picture's id is a real place's id; both frames of each are files of the size its entry says, the anchor
     on its canvas; 'wide' and 'min_css' are numbers a landmark can have (wide 1 to 2, min_css 40 to 72)
  S2 THE MAP CALLS IT: BOHEMIA_CITY_WORLD.html loads slices/bohemia_place_pieces.js and calls its draw once, before the fog is
     drawn (a place he has not seen is dark like the land round it)
  S3 IT IS A THING: every piece covers a fifth of its box or more, 70 steps of tone or more between its dark and its pale;
     the two beat frames differ (something in it burns or blinks)
  S4 LIGHT and no purple: no place heavier than 30,000 bytes for its two frames, lossless WebP, not one purple pixel (the grow lights are rose)
  P1 PLANTED (in memory): a picture for an id no place has turns S1 red; a frame copied over its twin turns S3 red
  ON THE PAGE (tools/bohemia_the_place_pieces_on_the_page_11_17_26.js: a new game on the demo on a phone upright, the crew
  sent by the map's own travelTo to six blocks from each place; about four minutes; --static skips it):
  G1 the module and its pictures are loaded on the map he plays, and every place with a piece is seated on this valley
  G2 with the switch off no piece is drawn; with it on each place's piece is drawn on the glass, 44 points across or more
  G3 it is SEEN: inside the piece's rectangle the shot with it on differs from the shot with it off (a third of it or more)
  THE REGION'S PLACES (COOK SIX 11/20; where 'region' in the list): the region draws them itself, through the module's seam (a wrap
  of the map's mapBaseDraw by name); tools/bohemia_cook6_the_region_pieces_on_the_page_11_20_26.js walks the crew out to each:
  R1 the seam is loaded, every region place with a piece is seated on the region and walked to (never put), no page error
  R2 with the switch off the region paints its own patch; on, each piece is on the glass, 44 points across or more
  R3 it is SEEN, a third of its rectangle or more
python3 gates/the_places_wear_their_own_piece_gate.py [--static]
"""
import json, os, subprocess, sys, tempfile
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'slices', 'place_pieces')
BYTES, COVER, SPREAD, MIN_POINTS, SEEN = 30000, 0.20, 70.0, 44, 0.33      # BYTES: a place, its two frames (11/17, the fifth build: a flat 160,000 for the folder was four places' worth; the first four measure 24,800 a place)
passed = failed = 0


def ok(name, cond, detail=''):
    global passed, failed
    if cond: passed += 1
    else: failed += 1
    print(('  ok   ' if cond else '  FAIL ') + name + ('  [' + str(detail) + ']' if detail != '' else ''), flush=True)


def s1(man, ids, exists=os.path.exists):
    bad = []; P = man.get('pictures') or {}
    if not P: bad.append('no pictures')
    if not (isinstance(man.get('wide'), (int, float)) and 1 <= man['wide'] <= 2): bad.append('wide %s' % man.get('wide'))
    if not (isinstance(man.get('min_css'), (int, float)) and 40 <= man['min_css'] <= 72): bad.append('min_css %s' % man.get('min_css'))
    for k, e in P.items():
        if k not in ids: bad.append(k + ' is no real place'); continue
        for f in e.get('frames') or []:
            p = os.path.join(D, f)
            if not exists(p): bad.append(f + ' is not a file'); continue
            im = Image.open(p)
            if im.size != (e['w'], e['h']): bad.append('%s is %dx%d, its entry says %dx%d' % (f, im.size[0], im.size[1], e['w'], e['h']))
            if im.format != 'WEBP': bad.append(f + ' is not WebP')
        if len(e.get('frames') or []) != 2: bad.append(k + ' has not two frames')
        if not (0 <= e['bx'] <= e['w'] and 0 <= e['by'] <= e['h']): bad.append(k + ' anchor off its canvas')
    return bad


def s3(F):
    bad = []; out = {}
    for k, (a, b) in F.items():
        m = a[..., 3] > 128; lum = (a[..., :3].astype(float) @ np.array([0.299, 0.587, 0.114]))[m]
        cov, spread = float(m.mean()), float(np.percentile(lum, 95) - np.percentile(lum, 5)) if lum.size > 20 else 0.0
        moved = int((np.abs(a.astype(int) - b.astype(int)).max(2) > 12).sum()); out[k] = (cov, spread, moved)
        if cov < COVER: bad.append('%s covers %.0f%%' % (k, cov * 100))
        if spread < SPREAD: bad.append('%s %.0f steps of tone' % (k, spread))
        if moved < 6: bad.append('%s does not move (%d pixels)' % (k, moved))
    return bad, out


def purple(a):
    r, g, b, al = (a[..., i].astype(int) for i in range(4))
    return int(((r > g + 25) & (b > g + 25) & (r > 80) & (al > 40)).sum())


def page(tool='tools/bohemia_the_place_pieces_on_the_page_11_17_26.js', timeout=900):
    out = tempfile.mkdtemp(prefix='place_pieces_')
    try: subprocess.run(['node', os.path.join(ROOT, tool), out, 'phone_portrait'], cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=timeout)
    except Exception as e: return None, out, str(e)
    p = os.path.join(out, 'page_phone_portrait.json')
    return (json.load(open(p)) if os.path.exists(p) else None), out, ''


def main():
    print('\nTHE PLACES WEAR THEIR OWN PIECE\n')
    man = json.load(open(os.path.join(D, 'place_pieces.json'))); P = man['pictures']
    ids = {p['id'] for p in json.load(open(os.path.join(ROOT, 'records/target/bb/real_places.json')))['places']}
    b1 = s1(man, ids); ok('S1 THE LIST: every piece is a real place\'s, both frames files of its size, a landmark\'s numbers', not b1, '; '.join(b1[:4]) or '%d places: %s; wide %s, never under %s points' % (len(P), ', '.join(sorted(P)), man['wide'], man['min_css']))
    html = open(os.path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html')).read()
    tag = html.count('<script src="bohemia_place_pieces.js">'); call = html.count('BohemiaPlacePieces.draw(ox, oy)'); i, j = html.find('BohemiaPlacePieces.draw(ox, oy)'), html.find('try { fogDraw(ox, oy); }')
    ok('S2 THE MAP CALLS IT: the module loaded once, its draw called once, before the fog', tag == 1 and call == 1 and 0 < i < j and j - i < 4000, 'tag %d, call %d, %s the fog' % (tag, call, 'before' if 0 < i < j else 'NOT before'))
    if b1: print('\nTHE PLACES WEAR THEIR OWN PIECE: %d passed, %d failed' % (passed, failed)); return 1
    F = {k: [np.asarray(Image.open(os.path.join(D, f)).convert('RGBA')) for f in e['frames']] for k, e in P.items()}
    b3, r3 = s3(F); ok('S3 IT IS A THING: a fifth of its box or more, 70 steps of tone, and its two frames differ', not b3, '; '.join(b3) or ', '.join('%s %.0f%% %.0f, %d pixels move' % (k, v[0] * 100, v[1], v[2]) for k, v in r3.items()))
    tot = sum(os.path.getsize(os.path.join(D, f)) for f in os.listdir(D)); pur = sum(purple(a) for fr in F.values() for a in fr)
    stray = sorted(f for f in os.listdir(D) if f != 'place_pieces.json' and f not in {x for e in P.values() for x in e['frames']})
    heavy = sorted(k for k, e in P.items() if sum(os.path.getsize(os.path.join(D, f)) for f in e['frames']) > BYTES)
    ok('S4 LIGHT and no purple: no place heavier than %s bytes for its two frames, only what the list names in the folder, not one purple pixel' % format(BYTES, ','), not heavy and not pur and not stray, '%s bytes for %d places%s, %d purple%s' % (format(tot, ','), len(P), (', heavy: ' + ', '.join(heavy)) if heavy else '', pur, (', stray: ' + ', '.join(stray[:3])) if stray else ''))
    m2 = json.loads(json.dumps(man)); m2['pictures']['no_such_place'] = dict(next(iter(P.values()))); p1 = bool(s1(m2, ids))
    k0 = next(iter(F)); F2 = dict(F); F2[k0] = [F[k0][0], F[k0][0]]; p3 = bool(s3(F2)[0])
    ok('P1 PLANTED: a piece for a place nobody has turns S1 red, a frame copied over its twin S3', p1 and p3, 'S1 %s, S3 %s' % (p1, p3))
    if '--static' not in sys.argv:
        res, out, err = page()
        if not res: ok('G1 the page ran', False, err or 'no result'); print('\nTHE PLACES WEAR THEIR OWN PIECE: %d passed, %d failed' % (passed, failed)); return 1
        L = res.get('loaded') or {}; got = res.get('places') or {}; PV = [k for k, e in P.items() if e.get('where') != 'region']
        ok('G1 ON THE PAGE: the module and its pictures are loaded on the demo, every valley place with a piece is seated on this valley', bool(L.get('module')) and sorted(L.get('pictures') or []) == sorted(P) and sorted(got) == sorted(PV), 'pictures %s, seated %s' % (len(L.get('pictures') or []), ', '.join(sorted(got))))
        bad = [k for k, v in got.items() if v.get('off_drew') != 0 or not v.get('rect') or v.get('err') or not v.get('on_shot') or v['on_shot']['w'] < MIN_POINTS]
        ok('G2 ON THE PAGE: off, none is drawn; on, each place\'s piece is on the glass, %d points across or more' % MIN_POINTS, not bad and bool(got), ', '.join('%s %s points at %s (a block is %s)' % (k, (v.get('on_shot') or {}).get('w'), v.get('at'), v.get('block_css')) for k, v in got.items()))
        seen = {}
        for k, v in got.items():
            q = v.get('on_shot')
            if not q: seen[k] = 0.0; continue
            a = np.asarray(Image.open(os.path.join(out, k + '_off.png')).convert('RGB')).astype(int); b = np.asarray(Image.open(os.path.join(out, k + '_on.png')).convert('RGB')).astype(int)
            kk = a.shape[1] / float(v['shot_points'][0]); x0, y0, x1, y1 = (int(max(0, t * kk)) for t in (q['x'] + q['w'] * 0.2, q['y'] + q['h'] * 0.45, q['x'] + q['w'] * 0.8, q['y'] + q['h'] * 0.9))
            d = np.abs(a[y0:y1, x0:x1] - b[y0:y1, x0:x1]).max(2); seen[k] = float((d > 24).mean()) if d.size else 0.0
        ok('G3 ON THE PAGE: IT IS SEEN: inside its rectangle the glass with it on is another picture (a third of it or more)', bool(seen) and all(v >= SEEN for v in seen.values()), ', '.join('%s %.0f%%' % (k, v * 100) for k, v in seen.items()))
        PR = sorted(k for k, e in P.items() if e.get('where') == 'region')
        if PR:   # (COOK SIX 11/20) THE REGION'S PLACES: drawn by the region's own draw through the module's seam
            rr, rout, rerr = page('tools/bohemia_cook6_the_region_pieces_on_the_page_11_20_26.js', 1500)
            if not rr: ok('R1 the region\'s page ran', False, rerr or 'no result')
            else:
                RL = rr.get('loaded') or {}; rg = rr.get('places') or {}
                ok('R1 ON THE PAGE: the module\'s region seam is loaded, every region place with a piece is seated on the region, and the crew walked to it (no page error)', bool(RL.get('seam')) and sorted(rr.get('seated') or []) == PR and sorted(rg) == PR and all(v.get('walked') and not v.get('put') for v in rg.values()) and not rr.get('errors'),
                   'seated %s; walked %s; errors %d' % (', '.join(rr.get('seated') or []), ', '.join(k for k, v in rg.items() if v.get('walked')), len(rr.get('errors') or [])))
                bad = [k for k, v in rg.items() if v.get('off_drew') != 0 or not v.get('rect') or v.get('err') or not v.get('on_shot') or v['on_shot']['w'] < MIN_POINTS]
                ok('R2 ON THE PAGE: off, the region paints its own patch; on, each region place\'s piece is on the glass, %d points across or more' % MIN_POINTS, not bad and bool(rg), ', '.join('%s %s points at %s' % (k, (v.get('on_shot') or {}).get('w'), v.get('at')) for k, v in rg.items()))
                rs = {}
                for k, v in rg.items():
                    q = v.get('on_shot')
                    if not q: rs[k] = 0.0; continue
                    a = np.asarray(Image.open(os.path.join(rout, k + '_off.png')).convert('RGB')).astype(int); b = np.asarray(Image.open(os.path.join(rout, k + '_on.png')).convert('RGB')).astype(int)
                    kk = a.shape[1] / float(v['shot_points'][0]); x0, y0, x1, y1 = (int(max(0, t * kk)) for t in (q['x'] + q['w'] * 0.2, q['y'] + q['h'] * 0.45, q['x'] + q['w'] * 0.8, q['y'] + q['h'] * 0.9))
                    d = np.abs(a[y0:y1, x0:x1] - b[y0:y1, x0:x1]).max(2); rs[k] = float((d > 24).mean()) if d.size else 0.0
                ok('R3 ON THE PAGE: IT IS SEEN: inside its rectangle the glass with it on is another picture (a third of it or more)', bool(rs) and all(v >= SEEN for v in rs.values()), ', '.join('%s %.0f%%' % (k, v * 100) for k, v in rs.items()))
    print('\nTHE PLACES WEAR THEIR OWN PIECE: %d passed, %d failed' % (passed, failed))
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main())
