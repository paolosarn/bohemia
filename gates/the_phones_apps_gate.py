"""THE PHONE'S APPS  (UI lane 11, [the phone's apps], 10/18/26)

PAOLO 10/17: his YES on the flip in the menu, with 'there's a whole app on the phone too that you could integrate'. Rule 114 D10
(no browser defaults: no gradient, blur, glow, corners over 1, no system font on a game screen); rule 108 (cut, never drawn);
rule 105 (icons at the packs' pixels); rule 67a (every press 44 points); rule 50b (upright and sideways); the eleventh votes (the
flip lives only in the menu and only after the first crisis); rule 100 (a candidate in VOTE, nothing in the game).

WHAT THIS HOLDS, read from the manifest the sheet tool writes off the driver's shots
  - THE APPS ARE THE GAME'S SCREENS: feed, jobs, stash, crew, settings after the crisis plus timeline; before it, no timeline
  - CUT, NEVER DRAWN: every icon is a file in the art bank's prop folder, shown at its own pixels (1:1 at 3x)
  - A AND B ARE DIFFERENT: no app wears the same prop in both looks
  - EVERY PRESS IS A THUMB: every app at least 44 points both ways
  - NO BROWSER DEFAULTS ON THE HOME SCREEN: zero gradients, blur, glow, corners over 1, every word in the game's own face, loaded
  - THE BEFORE IS MEASURED: the sheet's NOW counts what it replaces (it must have found something to replace)
  - NOTHING IN THE GAME: no slice or engine file names the candidate
  - THE VOTE CARD: A / B / NO, the sheet, a twin with three differences, 1:1, two sentences, the second naming where you see it
python3 gates/the_phones_apps_gate.py"""
import json, os, re, sys, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
MAN = os.environ.get('APPS_MANIFEST', 'records/target/ui_phone_apps/UI_THE_PHONES_APPS.json'); REG = os.environ.get('APPS_REGISTRY', 'records/target/BOHEMIA_VOTE_REGISTRY.json')
P = [0, 0]
def ok(m, g, extra=''):
    P[0 if g else 1] += 1; print(('  ok   ' if g else '  FAIL ') + m + ('  [' + str(extra) + ']' if extra != '' else ''))
print("\nTHE PHONE'S APPS  (UI [the phone's apps])\n")
man = json.load(open(MAN)); L = man['laid']
SIX = ['feed', 'jobs', 'stash', 'crew', 'settings', 'timeline']
bad = []
for k, v in L.items():
    got = [a['k'] for a in v['apps']]; want = SIX if v['crisis'] else SIX[:5]
    if got != want: bad.append(k + ' ' + ','.join(got))
ok('THE APPS ARE THE GAME\'S SCREENS: six after the crisis, no TIMELINE before it, upright and sideways', not bad and len(L) == 6, '; '.join(bad) or '6 layouts')
cut = []
for k, v in L.items():
    for a in v['apps']:
        f = 'reference/art_bank/prop/' + v['pick'][a['k']] + '.png'
        if not os.path.exists(f) or max(a['nat']) > 96 or abs(a['img'][2] * 3 - a['nat'][0]) > 1.5 or abs(a['img'][3] * 3 - a['nat'][1]) > 1.5: cut.append(k + ' ' + a['k'])
ok('CUT, NEVER DRAWN: every icon a pack prop file at its own pixels, one pack pixel to one phone pixel', not cut, ', '.join(cut) or 'all 1:1')
pa, pb = L['portrait_A']['pick'], L['portrait_B']['pick']
same = [k for k in SIX if pa[k] == pb[k]]
ok('A AND B ARE DIFFERENT: no app wears the same prop in both', not same, ', '.join(same) or 'twelve props')
small = [k + ' ' + a['k'] for k, v in L.items() for a in v['apps'] if a['box'][2] < 44 or a['box'][3] < 44]
ok('EVERY PRESS IS A THUMB: every app at least 44 points both ways', not small, ', '.join(small) or 'all 44+')
d10 = []
for k, v in L.items():
    for c in v['css']:
        if 'gradient' in c['bgi']: d10.append(k + ' gradient ' + str(c['tag']))
        if (float(re.sub('px', '', c['radius'].split()[0]) or 0) if c['radius'] else 0) > 1: d10.append(k + ' radius ' + str(c['tag']))
        if 'blur' in c['filter']: d10.append(k + ' blur ' + str(c['tag']))
        if re.search(r'\d+px \d+px [1-9]\d*px', c['shadow']): d10.append(k + ' glow ' + str(c['tag']))
        if not c['font'].strip().startswith('"BohemiaCasing"') and not c['font'].strip().startswith('BohemiaCasing'): d10.append(k + ' font ' + c['font'][:20])
        if not c['fontReady']: d10.append(k + ' font not loaded')
ok('NO BROWSER DEFAULTS ON THE HOME SCREEN: no gradient, blur, glow, corner over 1, the game\'s own face, loaded', not d10, ', '.join(sorted(set(d10))[:4]) or 'clean')
now = man['d10_now']['portrait']
ok('THE BEFORE IS MEASURED: the opened phone today, counted', sum(now.values()) > 0, now)
leaks = [f for f in glob.glob('slices/**/*', recursive=True) + glob.glob('engine/**/*', recursive=True)
         if os.path.isfile(f) and f.endswith(('.html', '.js', '.css')) and ('__bmPhoneHome' in open(f, errors='ignore').read() or 'ui_phone_apps' in open(f, errors='ignore').read())]
ok('NOTHING IN THE GAME: no slice or engine file names the candidate', not leaks, ', '.join(leaks[:3]))
reg = json.load(open(REG)); it = [i for i in reg['items'] if i.get('id') == 'ui-the-phones-apps-10-18']; i = it[0] if it else {}
sents = [s for s in re.split(r'(?<=[.!?])\s+', i.get('why', '').strip()) if s]
ok('THE VOTE CARD: A / B / NO, the sheet, a twin with three differences, 1:1', bool(i) and i.get('options') == ['A', 'B', 'NO'] and 'UI_ONE_AT_A_TIME_THE_PHONES_APPS.png' in i['show']['src']
   and os.path.exists(man['sheet']) and len(i.get('twin', {}).get('diffs', [])) >= 3 and i.get('before_after', {}).get('scale') == '1:1', i.get('id', 'missing'))
ok('  two sentences, the second naming where you see it', len(sents) <= 2 and bool(re.search(r'map|tab|screen|phone', sents[-1] if sents else '', re.I)), len(sents))
print("\nTHE PHONE'S APPS: %d ok, %d failed" % tuple(P)); sys.exit(1 if P[1] else 0)
