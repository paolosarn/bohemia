#!/usr/bin/env python3
"""STYLE GUIDE GATE -- DIRECTION [the style guide] and [the look bible] (rules 114a and 115d, 10/18/26).

Rule 114a: 'the style guide is law... every field is a gate' and A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED. This
gate holds the file and the rig to each other, and is research round two's D1 (the source settings diffed before
anything is judged by eye):

  1. THE FILE: records/target/BOHEMIA_STYLE_GUIDE.json carries all twenty fields (n 1 to 20, each with a value), a
     do and a dont for fields 2 to 15, the rig block (the look bible as numbers) with every key the rig reads, and
     a tests list whose every 'reads' key resolves in the file.
  2. THE PALETTE (field 4): records/target/BOHEMIA_STYLE_PALETTE.json is what its builder makes (no hand drift) and
     every ramp walks at least 8 degrees of hue, never touches black, and steps at least 8 percent in luminance.
  3. THE RIG READS THE FILE: tools/bohemia_direction_master_rig.py loads the guide and holds none of the recipe's
     numbers as literals (samples, sun energy, sun angle, filter, fill, alpha threshold, shadow alpha).
  4. EVERY RENDER OF ROUND FOUR OR LATER under records/target/: rig_settings equal the guide's rig block (no breaks)
     unless the render sits in a dont_ folder, where it MUST carry a break (a DON'T that breaks nothing is a candidate
     in disguise); the calibration cube measured the guide's ppm and the measured screen light sits within the
     guide's tolerance; the card under the guide (card_guide) is not BACK.
  5. THE HAND-FINISH (research round two, Section E): the robot's finish.json covers all eight facings and gives every
     front facing (S, SE, SW) its two eye glints; the finished file exists beside the raw one.
  6. THE SHEETS the guide names exist (do and dont, everything the same, the hand-finish).
  7. A MODEL WE BUILD paints from the palette: every tools/bohemia_direction_model_*.py reads BOHEMIA_STYLE_PALETTE.json.
Planted wrong ones first; each must be refused.
"""
import glob, json, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GUIDE = os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_GUIDE.json')
PALETTE = os.path.join(ROOT, 'records/target/BOHEMIA_STYLE_PALETTE.json')
RIG_TOOL = os.path.join(ROOT, 'tools/bohemia_direction_master_rig.py')
RIG_KEYS = ['engine', 'device', 'samples', 'denoise', 'filter_px', 'view_transform', 'film_transparent', 'motion_blur', 'ppm', 'tilt_deg', 'sun_rot_deg', 'sun_angle_deg',
            'sun_energy', 'fill_rgb', 'fill_strength', 'wear', 'ring', 'contact_shadow', 'shadow_alpha_max', 'alpha_threshold', 'keys_per_beat', 'bpm', 'calibration']
ok = fail = 0


def chk(c, msg):
    global ok, fail
    if c: ok += 1; print('  ok  ', msg)
    else: fail += 1; print('  FAIL', msg)


def resolve(g, key):
    cur = g
    for part in key.split('.'):
        if part.startswith('<'): return True
        if isinstance(cur, list):
            hit = next((x for x in cur if isinstance(x, dict) and x.get('key') == part), None)
            if hit is None: return False
            cur = hit
        elif isinstance(cur, dict) and part in cur: cur = cur[part]
        else: return False
    return True


def wrong_guide(g):
    w = []
    ns = sorted(f.get('n') for f in g.get('fields', []))
    if ns != list(range(1, 21)): w.append('fields %s, not 1 to 20' % ns)
    for f in g.get('fields', []):
        if f.get('value') in (None, '', [], {}): w.append('field %s has no value' % f.get('n'))
        if 2 <= int(f.get('n', 0)) <= 15 and not (f.get('do') and f.get('dont')): w.append('field %s has no do and dont pair' % f.get('n'))
    for k in RIG_KEYS:
        if k not in g.get('rig', {}): w.append('rig block has no %s' % k)
    for t in g.get('tests', []):
        for k in t.get('reads', []):
            if not resolve(g, k): w.append('test %s reads %s, which the file does not have' % (t.get('id'), k))
    return w


def wrong_palette(p):
    w = []
    L = p['limits']
    for n, r in p['roles'].items():
        if r['hue_shift_deg'] < L['hue_shift_deg_min']: w.append('%s walks %.1f degrees of hue (straight darkening)' % (n, r['hue_shift_deg']))
        if r['darkest_value'] < L['darkest_value_min']: w.append('%s touches black' % n)
        if r['min_lum_gap'] < L['adjacent_lum_gap_min']: w.append('%s has two steps under 8 percent apart' % n)
    return w


def wrong_rig_source(src):
    w = []
    if 'BOHEMIA_STYLE_GUIDE.json' not in src or "GUIDE['rig']" not in src: w.append('the rig does not load the style guide')
    for pat, what in ((r'cycles\.samples\s*=\s*\d', 'samples'), (r'energy\s*=\s*\d', 'sun energy'), (r'angle\s*=\s*math\.radians\(\d', 'sun angle'),
                      (r'filter_size\s*=\s*\d', 'filter'), (r'\(0\.55,\s*0\.55,\s*0\.6', 'fill colour'), (r"op = a\[\.\.\., 3\] > 1\d\d", 'alpha threshold'), (r'\*\s*0\.42\b', 'shadow alpha')):
        for line in src.splitlines():
            if re.search(pat, line) and 'G[' not in line and 'calib' not in line and 'id_pass' not in line and 'sc.cycles.samples = 1;' not in line:
                w.append('a literal %s in the rig: %s' % (what, line.strip()[:80])); break
    return w


def wrong_render(m, base, g):
    w = []
    dont = os.path.basename(base).startswith('dont_')
    rs = m.get('rig_settings')
    if rs is None: return ['round %s render with no rig_settings' % m.get('rig_round')]
    br = m.get('breaks', [])
    if dont and not br: w.append('a dont_ render that breaks nothing (a candidate in disguise)')
    if not dont and br: w.append('breaks the guide on %s outside a dont_ folder' % br)
    c = m.get('calibration')
    if c:
        if not c.get('cube_ok'): w.append('calibration cube %s px, the guide says %s' % (c.get('cube_px'), c.get('cube_px_expected')))
        if not dont and c.get('light_ok') is False: w.append('the light measured %s degrees, %s off the guide' % (c.get('screen_light_deg'), c.get('light_off_deg')))
    elif not dont: w.append('no calibration (the cube and the sphere render every run)')
    cg = m.get('card_guide')
    if not dont:
        if not cg: w.append('no card under the guide')
        elif cg.get('out', 9) >= 3: w.append('BACK under the guide: %s' % cg.get('verdict'))
    return w


print('STYLE GUIDE GATE (rules 114a and 115d)')
g = json.load(open(GUIDE))
# planted wrong ones first
bad = json.loads(json.dumps(g)); bad['fields'] = [f for f in bad['fields'] if f['n'] != 7]
chk(any('not 1 to 20' in x for x in wrong_guide(bad)), 'a planted guide with field 7 missing is refused')
bad = json.loads(json.dumps(g)); del bad['rig']['samples']
chk(any('samples' in x for x in wrong_guide(bad)), 'a planted guide whose rig block lost a key is refused')
bad = json.loads(json.dumps(g)); bad['tests'].append({'id': 'X', 'reads': ['fields.nothing.value']})
chk(any('does not have' in x for x in wrong_guide(bad)), 'a planted test reading a key the file does not have is refused')
p = json.load(open(PALETTE))
bp = json.loads(json.dumps(p)); bp['roles']['clay_mustard']['hue_shift_deg'] = 1.0
chk(any('straight darkening' in x for x in wrong_palette(bp)), 'a planted ramp with no hue shift is refused')
chk(any('samples' in x for x in wrong_rig_source(open(RIG_TOOL).read() + "\n    sc.cycles.samples = 64\n")), 'a planted literal sample count in the rig is refused')
chk(any('outside a dont_' in x for x in wrong_render({'rig_settings': {}, 'breaks': ['wear'], 'calibration': {'cube_ok': True}, 'card_guide': {'out': 1}}, '/x/robot', g)), 'a planted render that breaks the guide outside a dont_ folder is refused')
chk(any('in disguise' in x for x in wrong_render({'rig_settings': {}, 'breaks': [], 'card_guide': {'out': 1}}, '/x/dont_robot', g)), 'a planted dont_ render that breaks nothing is refused')
chk(any('BACK' in x for x in wrong_render({'rig_settings': {}, 'breaks': [], 'calibration': {'cube_ok': True, 'light_ok': True}, 'card_guide': {'out': 3, 'verdict': '3 of 8'}}, '/x/robot', g)), 'a planted render BACK under the guide is refused')
# the real thing
w = wrong_guide(g); chk(not w, 'the style guide: 20 fields with values, a do and dont for 2 to 15, the rig block, every test key resolves%s' % (': ' + '; '.join(w) if w else ''))
r = subprocess.run([sys.executable, os.path.join(ROOT, 'tools/bohemia_direction_style_palette.py'), '--check'], capture_output=True, text=True)
chk(r.returncode == 0, 'the palette is what its builder makes (%s)' % r.stdout.strip())
w = wrong_palette(p); chk(not w, 'every ramp walks 8+ degrees, never black, steps 8%% apart (%d roles, %d colours)%s' % (len(p['roles']), p['colours'], (': ' + '; '.join(w)) if w else ''))
w = wrong_rig_source(open(RIG_TOOL).read()); chk(not w, 'the rig reads the guide and holds none of its numbers as literals%s' % (': ' + '; '.join(w) if w else ''))
rigs = [r for r in glob.glob(os.path.join(ROOT, 'records/target/**/rig.json'), recursive=True) if int(json.load(open(r)).get('rig_round', 1)) >= 4]
chk(len(rigs) >= 5, '%d renders of round four or later' % len(rigs))
for r in sorted(rigs):
    m = json.load(open(r)); w = wrong_render(m, os.path.dirname(r), g)
    chk(not w, '%s %s%s' % (os.path.relpath(r, ROOT), m.get('card_guide', {}).get('verdict', ''), (': ' + '; '.join(w)) if w else ''))
fin = os.path.join(ROOT, 'records/target/direction_style_guide/robot/finish.json')
if os.path.exists(fin):
    f = json.load(open(fin)); fs = {x['facing']: x for x in f['facings']}
    chk(len(fs) == 8 and all(os.path.exists(os.path.join(ROOT, x['file'])) for x in f['facings']), 'the hand-finish covers the eight facings, each finished file on disk (%s px moved, %s%% of the body)' % (f['total']['pixels_changed'], f['total']['changed_share_pct']))
    chk(all(fs.get(k, {}).get('B9_eye_glints', 0) == 2 for k in ('S', 'SE', 'SW')), 'the front facings (S, SE, SW) carry two eye glints each')
else: chk(False, 'the robot hand-finish (finish.json) is missing')
for k, path in g.get('sheets', {}).items():
    chk(os.path.exists(os.path.join(ROOT, path)), 'sheet %s: %s' % (k, path))
for t in glob.glob(os.path.join(ROOT, 'tools/bohemia_direction_model_*.py')):
    chk('BOHEMIA_STYLE_PALETTE.json' in open(t).read(), '%s paints from the source palette' % os.path.relpath(t, ROOT))
print('STYLE GUIDE GATE: %d passed, %d failed' % (ok, fail)); sys.exit(1 if fail else 0)
