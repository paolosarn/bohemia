"""THE PHONE'S FRONT SCREEN  (UI lane 11, [the phone's front screen], 10/18/26)

PAOLO 10/18 (fourteenth votes): YES on the phone's apps, 'the front screen looks like dog shit, the first one, so let's update that
too'. Rule 117 (EASIER THAN BATTLE BROTHERS: minimalist, one clear next thing, no to-do list on a busy screen); rule 114 D10 (no
browser defaults); rule 19 (text comes from a mouth with a portrait); rule 67a (every press 44 points); rule 50b (upright and
sideways); rule 100 (a candidate in VOTE, nothing in the game).

WHAT THIS HOLDS, read from the manifest the sheet tool writes off the driver's shots
  - ONE CLEAR NEXT THING: exactly one message and exactly one press on the front screen, in every layout
  - A MOUTH WITH A FACE: the message wears the game's own 64 px face at a whole scale (one face pixel = 3 phone pixels), and its
    line is the phone's real last message, never a stand-in
  - EVERY PRESS IS A THUMB: READ at least 44 points both ways
  - NO BROWSER DEFAULTS: zero gradients, blur, glow, corners over 1, every word in the game's own face, loaded
  - SHARP TYPE: every size puts a whole number of phone pixels on each of the face's ten dots per em
  - THE BEFORE IS MEASURED: NOW counts what it replaces, and it held more than one card
  - NOTHING IN THE GAME: no slice or engine file names the candidate
  - THE VOTE CARD: A / B / NO, the sheet, a twin with three differences, 1:1, two sentences, the second naming where you see it
python3 gates/the_phones_front_screen_gate.py"""
import json, os, re, sys, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
MAN = os.environ.get('LOCK_MANIFEST', 'records/target/ui_phone_lock/UI_THE_PHONES_FRONT_SCREEN.json'); REG = os.environ.get('LOCK_REGISTRY', 'records/target/BOHEMIA_VOTE_REGISTRY.json')
P = [0, 0]
def ok(m, g, extra=''):
    P[0 if g else 1] += 1; print(('  ok   ' if g else '  FAIL ') + m + ('  [' + str(extra) + ']' if extra != '' else ''))
print("\nTHE PHONE'S FRONT SCREEN  (UI [the phone's front screen])\n")
man = json.load(open(MAN)); L = man['laid']
one = [k for k, v in L.items() if v['msgs'] != 1 or v['presses'] != 1]
ok('ONE CLEAR NEXT THING: one message and one press, upright and sideways, A and B', not one and len(L) == 4, ', '.join(one) or '4 layouts')
face = [k for k, v in L.items() if v['face']['nat'] != [64, 64] or v['face']['box'][2] * 3 % 64 or abs(v['face']['box'][2] - v['face']['box'][3]) > .5]
ok('A MOUTH WITH A FACE: the game\'s 64 px face at a whole scale', not face, ', '.join(face) or 'all 64 at 3 phone px a face pixel')
real = [k for k, v in L.items() if v['line'] != man['msg']['line'] or not v['line'].strip()]
ok('  the line is the phone\'s real last message', not real, man['msg']['line'][:40])
small = [k for k, v in L.items() if v['go'][2] < 44 or v['go'][3] < 44]
ok('EVERY PRESS IS A THUMB: READ at least 44 points both ways', not small, ', '.join(small) or 'all 44+')
d10 = []
for k, v in L.items():
    for c in v['css']:
        if 'gradient' in c['bgi']: d10.append(k + ' gradient ' + str(c['tag']))
        if float(re.sub('px', '', (c['radius'] or '0').split()[0]) or 0) > 1: d10.append(k + ' radius ' + str(c['tag']))
        if 'blur' in c['filter']: d10.append(k + ' blur ' + str(c['tag']))
        if re.search(r'\d+px \d+px [1-9]\d*px', c['shadow']): d10.append(k + ' glow ' + str(c['tag']))
        if not c['font'].strip().lstrip('"').startswith('BohemiaCasing'): d10.append(k + ' font ' + c['font'][:20])
        if not c['fontReady']: d10.append(k + ' font not loaded')
ok('NO BROWSER DEFAULTS: no gradient, blur, glow, corner over 1, the game\'s own face, loaded', not d10, ', '.join(sorted(set(d10))[:4]) or 'clean')
blur = sorted({s for v in L.values() for s in v['sizes'] if abs(s * .3 - round(s * .3)) > .02})
ok('SHARP TYPE: every size a whole number of phone pixels per dot (ten dots per em, 3 phone px per point)', not blur, blur or sorted({s for v in L.values() for s in v['sizes']}))
now = man['d10_now']['portrait']
ok('THE BEFORE IS MEASURED: the lock screen today, counted, more than one card', sum(v for k, v in now.items() if k != 'cards') > 0 and now['cards'] > 1, now)
leaks = [f for f in glob.glob('slices/**/*', recursive=True) + glob.glob('engine/**/*', recursive=True)
         if os.path.isfile(f) and f.endswith(('.html', '.js', '.css')) and ('__bmPhoneLock' in open(f, errors='ignore').read() or 'ui_phone_lock' in open(f, errors='ignore').read())]
ok('NOTHING IN THE GAME: no slice or engine file names the candidate', not leaks, ', '.join(leaks[:3]))
reg = json.load(open(REG)); it = [i for i in reg['items'] if i.get('id') == 'ui-the-phones-front-screen-10-18']; i = it[0] if it else {}
sents = [s for s in re.split(r'(?<=[.!?])\s+', i.get('why', '').strip()) if s]
ok('THE VOTE CARD: A / B / NO, the sheet, a twin with three differences, 1:1', bool(i) and i.get('options') == ['A', 'B', 'NO'] and 'UI_ONE_AT_A_TIME_THE_PHONES_FRONT_SCREEN.png' in i['show']['src']
   and os.path.exists(man['sheet']) and len(i.get('twin', {}).get('diffs', [])) >= 3 and i.get('before_after', {}).get('scale') == '1:1', i.get('id', 'missing'))
ok('  two sentences, the second naming where you see it', len(sents) <= 2 and bool(re.search(r'map|tab|screen|phone', sents[-1] if sents else '', re.I)), len(sents))
print("\nTHE PHONE'S FRONT SCREEN: %d ok, %d failed" % tuple(P)); sys.exit(1 if P[1] else 0)
