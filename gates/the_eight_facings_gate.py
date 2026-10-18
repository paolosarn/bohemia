#!/usr/bin/env python3
"""THE EIGHT FACINGS (PLUMBER 10/18/26, row [the eight facings]; rule 107, Paolo 10/10: 'one of the chats made a dire
wolf; when you create something it has to be made in all eight directions, you understand that').

A person, a beast, a vehicle, anything that turns: N, NE, E, SE, S, SW, W, NW, each drawn; A MIRRORED HALF IS NOT A
DIRECTION. This counts the facings on every sheet that moves, by reading the pixels, never a comment:

  RIG    every render folder the master rig wrote (any records/target/**/rig.json, rule 115's one source): the eight
         stills (rig_<F>.png, else raw_<F>.png) are on disk, every clip (<kind>_<clip>_<F>_kNN.png) has all eight, and
         no west-side facing is its east twin flipped (W/E, NW/NE, SW/SE, stills and each clip's first key). Red names
         the folder and the facing it lacks or fakes.
  PLAYS  every sheet the game draws, found by its data, not by a list: a JSON under slices/ (not slices/vote/) whose
         'rows' or 'dirs' is a list of compass facings (a grid sheet: frame, rows, cols, and its pictures under
         looks/beasts; or the rig cast: w, h, cols, gangs, dirs), or whose looks/walks carry a 'dirs' table; plus the
         two the game makes in code: the alpha's MIRROR table (the 112 rig's painted layers) and the wildlife sprites
         drawn in one view and flipped. A facing row that is its twin flipped in nine of ten columns counts once.
         Fewer than eight distinct is red, unless the sheet is on DEBT below with the count it had when this landed.
  DEBT   the old flat sprites rule 115(c) keeps in the game until each one's rig replacement passes the VOTE tab; the
         list only shrinks: a debt sheet that loses a facing is red, one that reaches eight is printed so PLUMBER
         drops it, and every run prints what is owed.

The dire wolf is NOT on the debt (rule 107 named it: 'comes back with all eight before it is seen again'; its rig
replacement got his YES 10/17; nothing in the game draws slices/fight_beasts): it is red until ANIMATION re-bakes it
from the rig or takes it off the site.

VOTE sheets (slices/vote/) are not swept: their frames are cut from the rig folders above, and their before rows
show the old thing on purpose. Planted cases first (S1-S9), then copies of the real files (M1-M3), then the real
files.
  python3 gates/the_eight_facings_gate.py
"""
import glob
import json
import os
import re
import shutil
import sys
import tempfile

import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
F8 = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
TWINS = [('E', 'W'), ('NE', 'NW'), ('SE', 'SW')]          # the east side and the side it would be flipped into
MIRROR_AT = 0.90       # share of the silhouette where flip(east) and west agree; a real render scored 0.47 at most
                       # (83 rig folders, measured 10/18), a flipped one 1.00
STILL = re.compile(r'^(rig|raw)_(N|NE|E|SE|S|SW|W|NW)\.png$')
CLIP = re.compile(r'^(rig|raw)_(.+)_(N|NE|E|SE|S|SW|W|NW)_k(\d+)\.png$')

# the old flat sprites in the game when this landed (10/18), each with the distinct facings it carried; shrink only
DEBT = {
    'slices/fight_people/fight_people.json': (2, 'COMBAT', 'the fight\'s 26 people, SE and SW only, until the rig\'s people pass VOTE (rule 115c)'),
    'slices/settlement_people/settlement_people.json': (3, 'ANIMATION', 'the settlement\'s 25 townsfolk, S, SE and SW, until the rig\'s people pass VOTE (rule 115c)'),
    'alpha MIRROR': (5, 'CHARACTER', 'the 112 rig\'s painted clothes, hair and face: W, SW and NW are E, SE and NE flipped (rule 115c: the rig remakes the people)'),
    'demo MIRROR': (5, 'CHARACTER', 'the demo\'s copy of the same table'),
    'wildlife': (1, 'CHARACTER', 'the eight street animals, one drawn view, flipped for SW, W and NW (rule 115c: the beasts come from the rig)'),
}

fails = []
passed = 0


def ok(name, cond, why=''):
    global passed
    if cond:
        passed += 1
        print('  ok   ' + name)
    else:
        fails.append(name)
        print('  FAIL ' + name + ('\n         ' + why if why else ''))


def rgba(p):
    return np.asarray(Image.open(p).convert('RGBA')).astype(np.int16)


def crop(a):
    m = a[..., 3] > 16
    if not m.any():
        return None
    ys, xs = np.where(m)
    return a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]


def mirror_score(east, west):
    """1.0 when west is east flipped left to right: the share of the two silhouettes' union where they agree, alpha on
    or off, and the colour within 12 levels. Compared on each picture's own box, so a facing cropped differently is
    still caught."""
    a, b = crop(east), crop(west)
    if a is None or b is None:
        return 0.0
    a = a[:, ::-1]
    if abs(a.shape[0] - b.shape[0]) > 1 or abs(a.shape[1] - b.shape[1]) > 1:
        return 0.0
    h, w = min(a.shape[0], b.shape[0]), min(a.shape[1], b.shape[1])
    a, b = a[:h, :w], b[:h, :w]
    ma, mb = a[..., 3] > 16, b[..., 3] > 16
    union = ma | mb
    agree = (ma == mb) & (~ma | (np.abs(a[..., :3] - b[..., :3]).max(-1) <= 12))
    return float((agree & union).sum()) / max(1, int(union.sum()))


# ------------------------------------------------------------------ RIG
def rig_faults(folder):
    """what one render folder lacks or fakes, as sentences"""
    files = os.listdir(folder)
    stills, clips = {}, {}
    for f in files:
        m = STILL.match(f)
        if m:
            stills.setdefault(m.group(1), {})[m.group(2)] = f
        m = CLIP.match(f)
        if m:
            clips.setdefault((m.group(1), m.group(2)), {}).setdefault(m.group(3), []).append(f)
    out = []
    kind = 'rig' if 'rig' in stills else ('raw' if 'raw' in stills else None)
    st = stills.get(kind, {}) if kind else {}
    if not st and not clips:
        return ['no facing pictures at all (rig_<F>.png or <kind>_<clip>_<F>_kNN.png)']
    if st:
        lack = [f for f in F8 if f not in st]
        if lack:
            out.append('the stills lack ' + ', '.join(lack))
        for e, w in TWINS:
            if e in st and w in st and mirror_score(rgba(os.path.join(folder, st[e])), rgba(os.path.join(folder, st[w]))) >= MIRROR_AT:
                out.append('still ' + w + ' is ' + e + ' flipped (a mirrored half is not a direction)')
    for (k, clip), byf in sorted(clips.items()):
        lack = [f for f in F8 if f not in byf]
        if lack:
            out.append(k + ' clip ' + clip + ' lacks ' + ', '.join(lack))
        for e, w in TWINS:
            if e in byf and w in byf:
                fe, fw = sorted(byf[e])[0], sorted(byf[w])[0]
                if mirror_score(rgba(os.path.join(folder, fe)), rgba(os.path.join(folder, fw))) >= MIRROR_AT:
                    out.append(k + ' clip ' + clip + ' ' + w + ' is ' + e + ' flipped')
    return out


def rig_folders():
    return sorted(os.path.dirname(p) for p in glob.glob(os.path.join(ROOT, 'records', 'target', '**', 'rig.json'), recursive=True))


# ------------------------------------------------------------------ PLAYS
def is_compass(v):
    return isinstance(v, list) and len(v) > 0 and all(isinstance(x, str) and x in F8 for x in v)


def grid_distinct(rows, cols, frame, pictures):
    """rows: the facing of each row; pictures: paths. Returns (distinct, notes)."""
    mirrored = set()
    notes = []
    for e, w in TWINS:
        if e not in rows or w not in rows:
            continue
        re_, rw = rows.index(e), rows.index(w)
        hit = tot = 0
        for p in pictures:
            a = rgba(p)
            for c in range(cols):
                ce = a[re_ * frame:(re_ + 1) * frame, c * frame:(c + 1) * frame]
                cw = a[rw * frame:(rw + 1) * frame, c * frame:(c + 1) * frame]
                if ce.size == 0 or crop(ce) is None:
                    continue
                tot += 1
                hit += mirror_score(ce, cw) >= MIRROR_AT
        if tot and hit >= 0.9 * tot:
            mirrored.add(w)
            notes.append(w + ' is ' + e + ' flipped (' + str(hit) + ' of ' + str(tot) + ' cells)')
    return len(set(rows)) - len(mirrored), notes


def plays(root=ROOT):
    """every sheet the game draws: [(id, lane, distinct, facings drawn, notes)]"""
    out = []
    for p in sorted(glob.glob(os.path.join(root, 'slices', '**', '*.json'), recursive=True)):
        rel = os.path.relpath(p, root).replace(os.sep, '/')
        if rel.startswith('slices/vote/'):
            continue
        try:
            with open(p, encoding='utf8') as fh:
                d = json.load(fh)
        except Exception:
            continue
        if not isinstance(d, dict):
            continue
        lane = str(d.get('lane') or '').upper() or '?'
        base = os.path.dirname(p)
        if is_compass(d.get('rows')) and isinstance(d.get('frame'), int) and isinstance(d.get('cols'), list):
            pics = []
            for grp in ('looks', 'beasts', 'people'):
                for v in (d.get(grp) or {}).values():
                    if isinstance(v, dict) and v.get('file') and os.path.exists(os.path.join(base, v['file'])):
                        pics.append(os.path.join(base, v['file']))
            n, notes = grid_distinct(d['rows'], len(d['cols']), d['frame'], pics)
            out.append((rel, lane, n, list(d['rows']), notes))
        elif is_compass(d.get('dirs')) and d.get('w') and d.get('h') and d.get('cols'):
            png = p[:-5] + '.png'
            notes, mirrored = [], set()
            if os.path.exists(png):
                a = rgba(png)
                dirs, w, h, cols = d['dirs'], d['w'], d['h'], d['cols']
                groups = d.get('gangs') or ['one']
                for e, wst in TWINS:
                    if e not in dirs or wst not in dirs:
                        continue
                    hit = tot = 0
                    for g in range(len(groups)):
                        for c in range(cols):
                            re_, rw = g * len(dirs) + dirs.index(e), g * len(dirs) + dirs.index(wst)
                            ce = a[re_ * h:(re_ + 1) * h, c * w:(c + 1) * w]
                            cw = a[rw * h:(rw + 1) * h, c * w:(c + 1) * w]
                            if ce.size == 0 or crop(ce) is None:
                                continue
                            tot += 1
                            hit += mirror_score(ce, cw) >= MIRROR_AT
                    if tot and hit >= 0.9 * tot:
                        mirrored.add(wst)
                        notes.append(wst + ' is ' + e + ' flipped (' + str(hit) + ' of ' + str(tot) + ' cells)')
            out.append((rel, lane, len(set(d['dirs'])) - len(mirrored), list(d['dirs']), notes))
        else:
            tabs = [x for grp in ('looks', 'walks') for x in (d.get(grp) or []) if isinstance(x, dict) and isinstance(x.get('dirs'), dict)]
            if tabs:
                least = min(len([k for k in t['dirs'] if k in F8]) for t in tabs)
                out.append((rel, lane, least, F8 if least == 8 else ['?'] * least,
                            ['drawn by the alpha\'s rig, so its painted layers carry the alpha MIRROR debt']))
    for nm, rel in (('alpha MIRROR', 'slices/BOHEMIA_ALPHA_0_9.html'), ('demo MIRROR', 'slices/BOHEMIA_DEMO.html')):
        fp = os.path.join(root, rel)
        if not os.path.exists(fp):
            continue
        with open(fp, encoding='utf8', errors='replace') as fh:
            m = re.search(r'const\s+MIRROR\s*=\s*\{([^}]*)\}', fh.read())
        if m:
            pairs = re.findall(r"([A-Z]{1,2})\s*:\s*'([A-Z]{1,2})'", m.group(1))
            out.append((nm, 'CHARACTER', 8 - len(pairs), F8, [a + ' is ' + b + ' flipped (' + rel + ' MIRROR)' for a, b in pairs]))
    wl = os.path.join(root, 'banks', 'BOHEMIA_WILDLIFE_SPRITES.js')
    if os.path.exists(wl):
        with open(wl, encoding='utf8', errors='replace') as fh:
            t = fh.read()
        has = [f for f in F8 if re.search(r"['\"]" + f + r"['\"]\s*:", t)]
        out.append(('wildlife', 'CHARACTER', max(1, len(has)), has or ['one view'],
                    ['banks/BOHEMIA_WILDLIFE_SPRITES.js: rest/look/go in one view, flipped in the city for SW, W and NW'] if not has else []))
    return out


def fakes(notes):
    return {m.group(1) for n in notes for m in [re.match(r'^([A-Z]{1,2}) is [A-Z]{1,2} flipped', n)] if m}


def judge(found, debt):
    """[(id, why)] for every sheet that breaks rule 107 past its debt"""
    bad = []
    for sid, lane, n, drawn, notes in found:
        owed = debt.get(sid)
        if n >= 8:
            continue
        if owed is None:
            bad.append((sid, lane + ': ' + str(n) + ' distinct facing(s) of 8 (' + ', '.join(drawn) + ')' + ('; ' + '; '.join(notes) if notes else '')
                        + '; lacks ' + ', '.join(f for f in F8 if f not in drawn or f in fakes(notes))))
        elif n < owed[0]:
            bad.append((sid, lane + ': the debt grew, ' + str(owed[0]) + ' distinct when this landed, ' + str(n) + ' now'))
    return bad


# ------------------------------------------------------------------ RUN
def main():
    tmp = tempfile.mkdtemp(prefix='eight_facings_')
    try:
        # S1-S5: a planted rig folder
        man = os.path.join(ROOT, 'records', 'target', 'master_rig', 'man')
        good = os.path.join(tmp, 'good')
        os.makedirs(good)
        for f in F8:
            shutil.copy(os.path.join(man, 'rig_' + f + '.png'), os.path.join(good, 'rig_' + f + '.png'))
            for k in ('00', '01'):
                shutil.copy(os.path.join(man, 'rig_Anim_0_' + f + '_k' + k + '.png'), os.path.join(good, 'rig_Walk_' + f + '_k' + k + '.png'))
        ok('S1 the man\'s eight stills and a two-key clip in eight pass', rig_faults(good) == [], '; '.join(rig_faults(good)))
        flip = os.path.join(tmp, 'flip')
        shutil.copytree(good, flip)
        Image.open(os.path.join(flip, 'rig_E.png')).transpose(Image.FLIP_LEFT_RIGHT).save(os.path.join(flip, 'rig_W.png'))
        ok('S2 W saved as E flipped is caught: ' + '; '.join(rig_faults(flip)), any('still W is E flipped' in x for x in rig_faults(flip)))
        crop2 = os.path.join(tmp, 'crop2')
        shutil.copytree(good, crop2)
        im = Image.open(os.path.join(crop2, 'rig_SE.png')).transpose(Image.FLIP_LEFT_RIGHT)
        big = Image.new('RGBA', (im.width + 20, im.height + 9), (0, 0, 0, 0))
        big.paste(im, (13, 2))
        big.save(os.path.join(crop2, 'rig_SW.png'))
        ok('S3 SW as SE flipped on a bigger canvas, moved over, is still caught (each picture on its own box)',
           any('still SW is SE flipped' in x for x in rig_faults(crop2)))
        gone = os.path.join(tmp, 'gone')
        shutil.copytree(good, gone)
        os.remove(os.path.join(gone, 'rig_NW.png'))
        for k in ('00', '01'):
            os.remove(os.path.join(gone, 'rig_Walk_S_k' + k + '.png'))
        g = rig_faults(gone)
        ok('S4 a still with no NW and a clip with no S are caught by name: ' + '; '.join(g),
           any(x == 'the stills lack NW' for x in g) and any('clip Walk lacks S' in x for x in g))
        cf = os.path.join(tmp, 'clipflip')
        shutil.copytree(good, cf)
        Image.open(os.path.join(cf, 'rig_Walk_NE_k00.png')).transpose(Image.FLIP_LEFT_RIGHT).save(os.path.join(cf, 'rig_Walk_NW_k00.png'))
        ok('S5 a clip whose NW first key is NE flipped is caught', any('clip Walk NW is NE flipped' in x for x in rig_faults(cf)))

        # S6-S9: planted sheets the game plays
        site = os.path.join(tmp, 'site')
        os.makedirs(os.path.join(site, 'slices', 'beasts'))
        src = rgba(os.path.join(man, 'rig_SE.png')).astype(np.uint8)
        fr = 112
        cell = Image.fromarray(src).resize((fr, fr))
        def sheet(path, rows_imgs):
            s = Image.new('RGBA', (fr * 2, fr * len(rows_imgs)), (0, 0, 0, 0))
            for r, im in enumerate(rows_imgs):
                s.paste(im, (0, r * fr)); s.paste(im, (fr, r * fr))
            s.save(path)
        sheet(os.path.join(site, 'slices', 'beasts', 'b.png'), [cell, cell.transpose(Image.FLIP_LEFT_RIGHT)])
        with open(os.path.join(site, 'slices', 'beasts', 'beasts.json'), 'w') as fh:
            json.dump({'lane': 'animation', 'frame': fr, 'rows': ['SE', 'SW'], 'cols': ['idle@0', 'idle@0.5'], 'beasts': {'b': {'file': 'b.png'}}}, fh)
        f6 = plays(site)
        b = [x for x in f6 if x[0] == 'slices/beasts/beasts.json']
        ok('S6 a new beast sheet of SE and SW where SW is SE flipped counts ONE facing, and is red off the debt',
           b and b[0][2] == 1 and judge(b, {}) and 'lacks' in judge(b, {})[0][1], str(b))
        os.makedirs(os.path.join(site, 'slices', 'people'))
        other = Image.fromarray(rgba(os.path.join(man, 'rig_SW.png')).astype(np.uint8)).resize((fr, fr))
        sheet(os.path.join(site, 'slices', 'people', 'p.png'), [cell, other, cell])
        with open(os.path.join(site, 'slices', 'people', 'people.json'), 'w') as fh:
            json.dump({'lane': 'animation', 'frame': fr, 'rows': ['S', 'SE', 'SW'], 'cols': ['a', 'b'], 'looks': {'p': {'file': 'p.png'}}}, fh)
        pp = [x for x in plays(site) if x[0] == 'slices/people/people.json']
        ok('S7 three real rows count three; on the debt at three it holds, at four owed it is red (the debt grew)',
           pp and pp[0][2] == 3 and not judge(pp, {'slices/people/people.json': (3, 'X', '')})
           and judge(pp, {'slices/people/people.json': (4, 'X', '')}))
        os.makedirs(os.path.join(site, 'slices', 'vote'))
        shutil.copy(os.path.join(site, 'slices', 'beasts', 'beasts.json'), os.path.join(site, 'slices', 'vote', 'v.json'))
        ok('S8 the same sheet under slices/vote/ is not swept (a VOTE sheet\'s before row is the old thing on purpose)',
           not [x for x in plays(site) if x[0].startswith('slices/vote/')])
        with open(os.path.join(site, 'slices', 'BOHEMIA_ALPHA_0_9.html'), 'w') as fh:
            fh.write("<script>const MIRROR={W:'E',SW:'SE',NW:'NE'};</script>")
        am = [x for x in plays(site) if x[0] == 'alpha MIRROR']
        ok('S9 the alpha\'s MIRROR table of three counts five distinct, held by its debt, red off it',
           am and am[0][2] == 5 and not judge(am, DEBT) and judge(am, {}))

        # M1-M3: copies of the real files
        rw = os.path.join(tmp, 'realwolf')
        shutil.copytree(os.path.join(ROOT, 'records', 'target', 'master_rig', 'dire_wolf_redone'), rw)
        Image.open(os.path.join(rw, 'rig_Walk_SE_k00.png')).transpose(Image.FLIP_LEFT_RIGHT).save(os.path.join(rw, 'rig_Walk_SW_k00.png'))
        os.remove(os.path.join(rw, 'rig_N.png'))
        mf = rig_faults(rw)
        ok('M1 the real wolf redone with its walk\'s SW key flipped from SE and its N still gone: both named (' + '; '.join(mf) + ')',
           'the stills lack N' in mf and any('clip Walk SW is SE flipped' in x for x in mf))
        real = plays()
        fp = [x for x in real if x[0] == 'slices/fight_people/fight_people.json']
        ok('M2 the real fight people read 2 distinct (SW is its own render, not SE flipped); one row fewer would be red',
           fp and fp[0][2] == 2 and judge([(fp[0][0], fp[0][1], 1, ['SE'], [])], DEBT))
        dw = [x for x in real if x[0] == 'slices/fight_beasts/fight_beasts.json']
        ok('M3 the real old dire wolf reads ONE facing: its SW row is SE flipped (' + ('; '.join(dw[0][4]) if dw else 'not found') + ')',
           dw and dw[0][2] == 1)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    # R: the real rig folders
    folders = rig_folders()
    bad = [(os.path.relpath(f, ROOT), rig_faults(f)) for f in folders]
    bad = [(f, x) for f, x in bad if x]
    ok('R1 every rig render folder (' + str(len(folders)) + ') carries eight facings in every still and clip, none a mirror',
       len(folders) > 20 and not bad, '\n         '.join(f + ': ' + '; '.join(x) for f, x in bad))

    # P: the real sheets the game plays
    real = plays()
    found = judge(real, DEBT)
    ok('P1 every sheet the game draws carries eight distinct facings or is on the debt (' + str(len(real)) + ' read)',
       len(real) >= 5 and not found, '\n         '.join(s + ': ' + w for s, w in found)
       + ('\n         (rule 107: re-bake it from the rig, rule 115, or take it off the site; the debt is only for the old flat '
          'sprites still drawn in the game)' if found else ''))
    owed = 0
    for sid, lane, n, drawn, notes in real:
        if sid in DEBT and n < 8:
            owed += 8 - n
            print('  debt ' + sid + ': ' + str(n) + ' of 8, ' + DEBT[sid][1] + ', ' + DEBT[sid][2])
    for sid in DEBT:
        hit = [x for x in real if x[0] == sid]
        if not hit:
            print('  note ' + sid + ' is not on the site any more: PLUMBER drops it from DEBT')
        elif hit[0][2] >= 8:
            print('  note ' + sid + ' reaches eight: PLUMBER drops it from DEBT')
    print('  owed ' + str(owed) + ' facings across ' + str(len([x for x in real if x[0] in DEBT and x[2] < 8])) + ' old sheets')

    print('\nTHE EIGHT FACINGS: %d passed, %d failed' % (passed, len(fails)))
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main())
