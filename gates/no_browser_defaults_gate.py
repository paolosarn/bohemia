"""NO BROWSER DEFAULTS ON THE HUD  (UI lane 11, [no browser defaults on the HUD], 10/18/26)

RULE 114 tell D10 (Paolo 10/16, 'it can't look like it's vibe coded'): gradients, blur, glow, corners over 1, hue 250 to 290 panels
and any phone font resolving on a game screen are the loudest 'made by an AI guy' signal; ALL THE UI LOOKS 3-D (Paolo 9/20) is kept
by drawing the light in pixels, never CSS. Rule 100: a candidate in VOTE, nothing in the game. THE FIRST VOTES: his frozen picks keep
their layout; only the surface changes.

WHAT THIS HOLDS, read from the manifest the sheet tool writes off the driver's shots (tools/bohemia_ui_no_defaults_shots.js)
  - EVERY SCREEN IS READ: the map upright and sideways, the opened phone, the fight, the settlement, the VOTE tab
  - THE BEFORE IS MEASURED: what the browser resolves on each screen today, counted (it must have found something)
  - AFTER THE STRIP, ZERO: no gradient, blur, glow, corner over 1, hue 250-290 panel, phone font or unloaded face, on every screen
  - THE LIGHT IS IN PIXELS: every gradient the strip took off left its own lightest and darkest stop as hard 1 px lines (the strip's
    code says so and the fix count matches the before)
  - THE LAYOUT HOLDS: on the map, the fight and the settlement no box with an id moved more than 2 px; the phone and the VOTE tab
    may move only where a word changed face (each move listed in the manifest, the count capped)
  - NOTHING IN THE GAME: no slice or engine file names the strip
  - THE VOTE CARD: YES / NO, the sheet, 1:1, a before and after, two sentences, the second naming where he sees it
python3 gates/no_browser_defaults_gate.py"""
import json, os, re, sys, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); os.chdir(ROOT)
MAN = os.environ.get('D10_MANIFEST', 'records/target/ui_no_defaults/UI_NO_BROWSER_DEFAULTS.json')
REG = os.environ.get('D10_REGISTRY', 'records/target/BOHEMIA_VOTE_REGISTRY.json')
STRIP = 'tools/bohemia_ui_no_defaults_strip.js'
P = [0, 0]
def ok(m, g, extra=''):
    P[0 if g else 1] += 1; print(('  ok   ' if g else '  FAIL ') + m + ('  [' + str(extra) + ']' if extra != '' else ''))
print('\nNO BROWSER DEFAULTS ON THE HUD  (UI [no browser defaults on the HUD])\n')
man = json.load(open(MAN)); S = man['screens']
WANT = ['map_portrait', 'map_landscape', 'phone_portrait', 'fight_portrait', 'settlement_portrait', 'vote_portrait']
ok('EVERY SCREEN IS READ: map upright and sideways, the opened phone, the fight, the settlement, the VOTE tab', all(k in S for k in WANT), ', '.join(k for k in WANT if k not in S) or '6 screens')
now = {k: sum(v['now'].values()) for k, v in S.items()}
ok('THE BEFORE IS MEASURED: every screen counted today, and the count found something', sum(now.values()) > 0 and all(k in now for k in WANT), now)
left = {k: {a: b for a, b in v['after'].items() if b} for k, v in S.items()}
ok('AFTER THE STRIP, ZERO: no gradient, blur, glow, corner over 1, hue 250-290, phone font or unloaded face, on every screen',
   not any(left.values()), {k: v for k, v in left.items() if v} or 'all zero')
src = open(STRIP).read()
pix = "inset 0 1px 0 0 ' + str(sorted[0])" in src and "inset 0 -1px 0 0 ' + str(sorted[sorted.length - 1])" in src and 'createLinearGradient' not in src
fixed = {k: sum(p['fixed']['gradient'] for p in v['strip']) for k, v in S.items()}
short = [k for k, v in S.items() if fixed[k] < v['now']['gradient']]
ok('THE LIGHT IS IN PIXELS: a gradient leaves its own lightest and darkest stop as hard 1 px lines, every gradient counted was fixed', pix and not short, ', '.join(short) or 'lines from the stops')
hold = [k + ' ' + str(m[0]) for k in ('map_portrait', 'map_landscape', 'fight_portrait', 'settlement_portrait') for m in S.get(k, {}).get('moved', [])]
ok('THE LAYOUT HOLDS: on the map, the fight and the settlement no box moved more than 2 px', not hold and all(S[k].get('boxes', 0) > 5 for k in ('map_portrait', 'fight_portrait', 'settlement_portrait')),
   ', '.join(hold[:4]) or ', '.join('%s %d boxes' % (k, S[k]['boxes']) for k in ('map_portrait', 'fight_portrait', 'settlement_portrait')))
fm = {k: len(S[k].get('moved', [])) for k in ('phone_portrait', 'vote_portrait')}
ok('  the phone and the VOTE tab move only where a word changed face (at most 8 boxes each, every one listed)', all(v <= 8 for v in fm.values()), fm)
leaks = [f for f in glob.glob('slices/**/*', recursive=True) + glob.glob('engine/**/*', recursive=True)
         if os.path.isfile(f) and f.endswith(('.html', '.js', '.css')) and re.search(r'__bmD10Strip|ui_no_defaults', open(f, errors='ignore').read())]
ok('NOTHING IN THE GAME: no slice or engine file names the strip', not leaks, ', '.join(leaks[:3]))
reg = json.load(open(REG)); it = [i for i in reg['items'] if i.get('id') == 'ui-no-browser-defaults-10-18']; i = it[0] if it else {}
sents = [s for s in re.split(r'(?<=[.!?])\s+', i.get('why', '').strip()) if s]
ok('THE VOTE CARD: YES / NO, the sheet, 1:1, a before and after', bool(i) and i.get('options') == ['YES', 'NO'] and 'UI_NO_BROWSER_DEFAULTS.png' in i.get('show', {}).get('src', '')
   and os.path.exists(man['sheet']) and i.get('before_after', {}).get('scale') == '1:1', i.get('id', 'missing'))
ok('  two sentences, the second naming where you see it', len(sents) <= 2 and bool(re.search(r'map|tab|screen|phone', sents[-1] if sents else '', re.I)), len(sents))
print('\nNO BROWSER DEFAULTS ON THE HUD: %d ok, %d failed' % tuple(P)); sys.exit(1 if P[1] else 0)
