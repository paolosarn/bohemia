#!/usr/bin/env python3
"""THE ART FENCE (PLUMBER 10/19/26, VAMILY row [the art fence]; rule 100, Paolo 10/10: 'they do one little dogshit
that I didn't say is final and start implementing it nationwide'; rule 101(c): 'stop editing a placeholder').

  A1  THE WINDOW: gates/art_fence.json parses, and the commits after its birth are read (a shallow clone that does
      not reach the birth reads every commit it holds dated after it, and says so).
  A2  THE FENCE: no commit whose first word names an art lane (COOK, COOK TWO, COOK THREE, COOK FOUR, DIRECTION,
      CHARACTER, PORTRAIT, COMBAT TWO, UI) touches slices/ or engine/, outside the VOTE tab's own folder and the
      files a ruling gave that lane (UI's materials, rule 88), unless his FINAL covers every file it touches: a
      finals entry whose card he voted up, titled FINAL?, with no 'not final' in his words, after his moodboard
      landed (rule 108 round thirteen; today it has not, so no FINAL counts). The red names the commit, the lane
      and the files; the way in is the cook folder, the VOTE tab, then RUN carries what he passed (rules 93, 115g).
  A3  A PLACEHOLDER IS NOT EDITED: no art-lane commit modifies a file records/BOHEMIA_PLACEHOLDERS.md names (its
      paths, and the pictures of the cards it lists); a new file for a new need is fine.
  A4  HIS WORD, READ: every finals entry names a card that is FINAL in the registry; the cards that are FINAL by
      rule 100(b)'s letter are printed with whether the moodboard lets them count.
  A5  THE RECORD SINCE RULE 100 (printed, not failed): art-lane commits that touched the game from 10/10 to the birth.
  S1-S9  SELF-TEST FIRST on a planted repository. A red commit leaves the red only through answered in the config
      (reverted, or ruled on, with the sha or record that says so).

    python3 gates/art_fence_gate.py
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, 'tools'))
from bohemia_pixel_floor import glob_match  # noqa: E402

CFG = 'gates/art_fence.json'
REGISTRY = 'records/target/BOHEMIA_VOTE_REGISTRY.json'
PLACEHOLDERS = 'records/BOHEMIA_PLACEHOLDERS.md'
NOT_FINAL = re.compile(r'\b(not|no|nothing)\b[^.]{0,20}\bfinal\b', re.I)

passed = 0
fails = []


def ok(name, cond, why=''):
    global passed
    if cond:
        passed += 1
        print('  ok    ' + name)
    else:
        fails.append(name)
        print('  FAIL  ' + name + ('\n        ' + why if why else ''))


def git(root, *args):
    return subprocess.run(['git'] + list(args), cwd=root, capture_output=True, text=True).stdout


def lane_of(subject, lanes):
    for L in sorted(lanes, key=len, reverse=True):
        if re.match(re.escape(L) + r'(?=[\s:\[(]|$)', subject):
            return L
    return None


def window(root, cfg):
    """(shas oldest first, how): the commits after the birth, merges left out."""
    born = cfg['born_after']
    if subprocess.run(['git', 'cat-file', '-e', born + '^{commit}'], cwd=root, capture_output=True).returncode == 0:
        out = git(root, 'rev-list', '--reverse', '--no-merges', born + '..HEAD').split()
        return out, 'after %s' % born
    shallow = set(open(os.path.join(root, '.git', 'shallow')).read().split()) if os.path.exists(os.path.join(root, '.git', 'shallow')) else set()
    out = [s for s in git(root, 'rev-list', '--reverse', '--no-merges', '--since=' + cfg['born_date'], 'HEAD').split() if s not in shallow]
    return out, 'shallow clone: %d commits dated after %s (the birth %s is not in this clone)' % (len(out), cfg['born_date'], born)


def changes(root, sha):
    rows = []
    for line in git(root, 'diff-tree', '--no-commit-id', '-r', '--name-status', sha).split('\n'):
        if not line.strip():
            continue
        parts = line.split('\t')
        rows.append((parts[0][0], parts[-1]))
    return rows


def in_game(path, cfg):
    return any(glob_match(path, g) for g in cfg['game']) and not any(glob_match(path, c['glob']) for c in cfg['cook_folders_inside_the_game'])


def allowed(lane, path, cfg):
    return any(a['lane'] == lane and glob_match(path, a['glob']) for a in cfg['allowed'])


def final_cards(registry):
    """card id -> (his words) for every card FINAL by rule 100(b)'s letter: voted up, titled FINAL?, his words
    without 'not final'."""
    items = {i['id']: i for i in registry.get('items', [])}
    out = {}
    for v in registry.get('verdicts', []):
        it = items.get(v['id'])
        if v.get('vote') == 'up' and it and it.get('title', '').upper().startswith('FINAL?') and not NOT_FINAL.search(v.get('said') or ''):
            out[v['id']] = v.get('said') or ''
    return out


def covered(path, cfg, finals):
    if not cfg.get('moodboard_landed'):
        return False
    return any(e['card'] in finals and any(glob_match(path, g) for g in e['globs']) for e in cfg['finals'])


def placeholder_files(root, registry):
    text = open(os.path.join(root, PLACEHOLDERS)).read() if os.path.exists(os.path.join(root, PLACEHOLDERS)) else ''
    tracked = set(git(root, 'ls-files').split('\n'))
    files = {p for p in re.findall(r'[A-Za-z0-9_\-./]+\.(?:png|webp|jpe?g|gif|json|js|html|glb|mp3|wav)', text) if p in tracked}
    items = {i['id']: i for i in registry.get('items', [])}
    for cid in re.findall(r'^- ([a-z0-9][a-z0-9-]+-\d+-\d+)\b', text, re.M):
        show = (items.get(cid) or {}).get('show') or {}
        for k in ('src', 'first'):
            s = show.get(k)
            if isinstance(s, str) and not s.startswith(('http', 'data:')):
                p = os.path.normpath(os.path.join('slices', s))
                if p in tracked:
                    files.add(p)
    return files


def judge(root, cfg, registry, shas):
    """(fence reds, placeholder reds): one line each."""
    finals = final_cards(registry)
    ph = placeholder_files(root, registry)
    reds, edits = [], []
    answered = tuple(a['sha'][:8] for a in cfg.get('answered', []))
    for sha in shas:
        if answered and sha[:8] in answered:
            continue
        subj = git(root, 'log', '-1', '--format=%s', sha).strip()
        lane = lane_of(subj, cfg['art_lanes'])
        if not lane:
            continue
        ch = changes(root, sha)
        bad = [p for st, p in ch if in_game(p, cfg) and not allowed(lane, p, cfg) and not covered(p, cfg, finals)]
        if bad:
            reds.append('%s %s: %d file(s) in the game with no FINAL of his: %s' % (sha[:8], lane, len(bad), ', '.join(bad[:4])))
        ed = [p for st, p in ch if st == 'M' and p in ph]
        if ed:
            edits.append('%s %s edited a placeholder: %s' % (sha[:8], lane, ', '.join(ed[:4])))
    return reds, edits


# ------------------------------------------------------------------------------------------------ self-test
def selftest(cfg):
    tmp = tempfile.mkdtemp(prefix='art_fence_selftest_')
    try:
        g = lambda *a: subprocess.run(['git'] + list(a), cwd=tmp, capture_output=True, text=True, check=True).stdout
        g('init', '-q')
        g('config', 'user.email', 'selftest@example.com')
        g('config', 'user.name', 'selftest')

        def put(rel, text='x'):
            p = os.path.join(tmp, rel)
            os.makedirs(os.path.dirname(p), exist_ok=True)
            open(p, 'w').write(text)

        def commit(msg, *files, text='y'):
            for f in files:
                put(f, text + msg)
            g('add', '-A')
            g('commit', '-q', '-m', msg)
            return g('rev-parse', 'HEAD').strip()
        put('records/BOHEMIA_PLACEHOLDERS.md', '# list\n- slices/fight_ground/cone.webp -- a thing\n')
        reg = {'items': [{'id': 'cook2-the-cone-10-30', 'title': 'FINAL? THE CONE', 'show': {}}],
               'verdicts': [{'id': 'cook2-the-cone-10-30', 'vote': 'up', 'said': ''}]}
        born = commit('base', 'slices/fight_ground/cone.webp', 'slices/bohemia_ui_materials.js', 'slices/BOHEMIA_DEMO.html')
        c = dict(cfg, born_after=born)
        t = {}
        t['cook2_game'] = commit('COOK TWO [the cone]: into the board', 'slices/fight_ground/new_cone.webp')
        t['cook2_cook'] = commit('COOK TWO [the cone]: the sheet', 'reference/art_pipe/cone.png')
        t['ui_materials'] = commit('UI [the look]: the materials', 'slices/bohemia_ui_materials.js')
        t['ui_demo'] = commit('UI [the look]: regenerated the demo', 'slices/BOHEMIA_DEMO.html')
        t['run_cut'] = commit('RUN [the cut, now]: the demo', 'slices/BOHEMIA_DEMO.html')
        t['vote'] = commit('COOK [x]: the card', 'slices/vote/COOK_X.webp')
        t['coord'] = commit('COORDINATOR: sweep', 'slices/BOHEMIA_DEMO.html')
        t['edit_ph'] = commit('COOK TWO [the cone]: touched up', 'slices/fight_ground/cone.webp')
        shas, _ = window(tmp, c)
        reds, edits = judge(tmp, c, reg, shas)
        red_shas = {r.split()[0] for r in reds}
        short = lambda k: t[k][:8]
        ok('S1 an art lane\'s file in the game with no FINAL is red', short('cook2_game') in red_shas)
        ok('S2 the same lane in its cook folder, and in the VOTE folder, is green', short('cook2_cook') not in red_shas and short('vote') not in red_shas)
        ok('S3 UI in its materials is green (rule 88); UI regenerating the demo is red', short('ui_materials') not in red_shas and short('ui_demo') in red_shas)
        ok('S4 RUN and the coordinator are not art lanes', short('run_cut') not in red_shas and short('coord') not in red_shas)
        ok('S5 an art lane editing a listed placeholder is red (rule 101c), a new file is not',
           any(e.startswith(short('edit_ph')) for e in edits) and not any(e.startswith(short('cook2_game')) for e in edits))
        c2 = dict(c, finals=[{'card': 'cook2-the-cone-10-30', 'globs': ['slices/fight_ground/new_cone.webp'], 'why': 'test'}])
        r2, _ = judge(tmp, c2, reg, shas)
        ok('S6 his FINAL does not count before the moodboard', short('cook2_game') in {r.split()[0] for r in r2})
        c3 = dict(c2, moodboard_landed={'date': '10/30', 'record': 'test'})
        r3, _ = judge(tmp, c3, reg, shas)
        ok('S7 after the moodboard, his FINAL on the family lets it in', short('cook2_game') not in {r.split()[0] for r in r3})
        reg_no = dict(reg, verdicts=[{'id': 'cook2-the-cone-10-30', 'vote': 'up', 'said': 'good direction not final'}])
        r4, _ = judge(tmp, c3, reg_no, shas)
        ok('S8 a YES whose words say \'not final\' is not FINAL', short('cook2_game') in {r.split()[0] for r in r4})
        r5, _ = judge(tmp, dict(c, answered=[{'sha': t['cook2_game'], 'why': 'reverted in test'}]), reg, shas)
        ok('S9 an answered commit (reverted, or ruled on) leaves the red', short('cook2_game') not in {r.split()[0] for r in r5}
           and short('ui_demo') in {r.split()[0] for r in r5})
        ok('S8 the lane is read from the first word, longest name first',
           lane_of('COOK TWO [x]', cfg['art_lanes']) == 'COOK TWO' and lane_of('COOKING notes', cfg['art_lanes']) is None
           and lane_of('COMBAT [x]', cfg['art_lanes']) is None and lane_of('COMBAT TWO: x', cfg['art_lanes']) == 'COMBAT TWO')
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    cfg = json.load(open(CFG))
    registry = json.load(open(REGISTRY))
    print('THE ART FENCE -- nothing an art lane makes enters the game before his FINAL (rule 100)\n')
    selftest(cfg)

    shas, how = window(ROOT, cfg)
    ok('A1 the window: %d commit(s), %s' % (len(shas), how), True)
    reds, edits = judge(ROOT, cfg, registry, shas)
    ok('A2 no art-lane commit put a file in the game without his FINAL', not reds,
       '\n        '.join(reds[:20]) + '\n        the way in: the cook folder, the VOTE tab, his FINAL, then RUN carries it (rules 93, 100, 115g)')
    ok('A3 no art-lane commit edited a placeholder (rule 101c)', not edits, '\n        '.join(edits[:20]) +
       '\n        a placeholder is made once and left; the road to FINAL is a new sheet, one at a time (rule 101d)')
    finals = final_cards(registry)
    bad = [e['card'] for e in cfg['finals'] if e['card'] not in finals]
    ok('A4 every finals entry names a card FINAL in his own votes', not bad, ', '.join(bad))
    print('\n  FINAL BY RULE 100(b)\'S LETTER (a YES on a FINAL? card, no \'not final\' in his words): %d; the moodboard %s'
          % (len(finals), 'landed ' + json.dumps(cfg['moodboard_landed']) if cfg.get('moodboard_landed') else
             'has NOT landed, so none counts (rule 108 round thirteen)'))
    for k, v in sorted(finals.items()):
        print('    %s  his words: %s' % (k, json.dumps(v) if v else '(none)'))

    hist = git(ROOT, 'rev-list', '--no-merges', '--since=2026-10-10', '--until=' + cfg['born_date'], 'HEAD').split()
    hr, he = judge(ROOT, dict(cfg, born_after='x'), registry, hist)
    print('\n  THE RECORD SINCE RULE 100 (10/10 to the birth, %d commits in this clone; printed, not failed): %d art-lane '
          'commits put files in the game, %d edited a placeholder' % (len(hist), len(hr), len(he)))
    for r in hr[:12] + he:
        print('    ' + r)

    print('\nTHE ART FENCE: %d passed, %d failed' % (passed, len(fails)))
    return 1 if fails else 0


if __name__ == '__main__':
    sys.exit(main())
