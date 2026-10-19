#!/usr/bin/env python3
"""THE TOP BAR (UI [the top bar], rule 121, 10/19/26).

Paolo 10/19: 'I still don't like the top bar at the top of the screen... you could put so much things in the top of the screen...
and then during combat it doesn't go away, it's all fucked up.' The row's END STATE: on the map the bar carries what a Battle
Brothers player reads at a glance (the day and hour, batteries, food and the days it lasts, the crew's count and health), in the
materials, readable in the sun; in the fight it goes away and the fight shows only its own strip; three candidates from the
game's camera in VOTE with its card id; then handed to RUN and COMBAT. This gate holds the candidate to that, from the shots
the tools took on his phone, upright and on its side (records/target/ui_the_top_bar/manifest.json).

LEGS
  T1  every bar (A, B, C, both sides) says the five things, each the GAME'S number: the day, the hour, batteries, food with
      the days it lasts, the crew's count (a fact the game does not have is a dash, never a number)
  T2  every word on every bar reads 4.5 to 1 against the ground really under it, plain AND under a flat 25% white (the sun)
  T3  every press on the bar is 44 points or more both ways (the gear and NOTES included)
  T4  no browser defaults in what the bar is made of (rule 114 D10): no gradient, blur or glow, no corner over 2, only the
      game's two faces resolve on a word
  T5  in the fight NOTHING crosses the top: the strip is gone, the fight measures its top edge as 0, the board runs to the glass
  T6  the fight's own strip keeps the three things it carried: the round, the turn order (the faces still drawn), AUTO (a tap
      still flips it)
  T7  the fight gets more board than today on both sides
  T8  the card is in VOTE: id ui-the-top-bar-10-19, A / B / C / NO, its sheet and first picture on disk, three twin differences
  T9  nothing in the game: no file in slices/ or engine/ carries the candidate (the wiring is RUN's and COMBAT's after his pick)
  T10 THE GATE BITES: six planted defects, each caught by its leg (a dropped fact, a word under 4.5 in the sun, a 40-point press,
      a gradient, the strip left on in the fight, AUTO lost)

  python3 gates/the_top_bar_gate.py
"""
import copy, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'records/target/ui_the_top_bar')
CARD = 'ui-the-top-bar-10-19'
LAY = os.path.join(ROOT, 'tools/bohemia_ui_the_top_bar_lay.js')
FACES = ('BohemiaCasing', 'BohemiaROM')

passed = failed = 0


def ok(name, cond, why=''):
    global passed, failed
    if cond:
        passed += 1
        print('  ok   ' + name + (('  (' + why + ')') if why else ''))
    else:
        failed += 1
        print('  FAIL ' + name + (('  (' + why + ')') if why else ''))


def says(b, f):
    """the five facts, each the game's own, each in its own slot on this bar (a fact read out of the wrong slot is not said)"""
    said = b.get('said') or {}
    miss = []
    clock = said.get('clock', '')
    if f.get('day') is None or ('DAY %d' % f['day']) not in clock:
        miss.append('day')
    if not f.get('hour') or f['hour'] not in clock:
        miss.append('hour')
    if f.get('batteries') is None or not re.search(r'(^|\D)%d(\D|$)' % f['batteries'], said.get('batteries', '')):
        miss.append('batteries')
    fd = said.get('food', '')
    # the day eats one: when the bill is one the count and the days are one number, printed once as days
    if f.get('food') is None or f.get('daysLeft') is None or not re.search(r'(^|\D)%d ?(DAY|DAYS)\b' % f['daysLeft'], fd) \
            or (f.get('perDay') != 1 and not re.search(r'(^|\D)%d(\D|$)' % f['food'], fd)) \
            or (f.get('perDay') == 1 and f['food'] != f['daysLeft']):
        miss.append('food and its days')
    if not f.get('crew') or not re.match(r'\s*(CREW\s*)?%d\b' % len(f['crew']), said.get('crew', '')) and not re.search(r'CREW\s*%d\b' % len(f['crew']), said.get('crew', '')):
        miss.append('crew')
    return miss


def check(m, lay_css, reg):
    """every leg against one manifest; returns {leg: (cond, why)} so the planted defects reuse the same reads"""
    out = {}
    sides = m.get('sides', {})
    have = sorted(sides.keys())
    miss = []
    for s, r in sides.items():
        for v, b in r['bars'].items():
            mm = says(b, r['facts'] or {})
            if mm:
                miss.append('%s %s: %s' % (s, v, ', '.join(mm)))
    out['T1'] = (have == ['landscape', 'portrait'] and all(len(r['bars']) == 3 for r in sides.values()) and not miss,
                 '; '.join(miss[:3]) or '3 bars x 2 sides say the day, the hour, batteries, food and its days, the crew')
    worst = (99, 99, '')
    for s, r in sides.items():
        for v, b in r['bars'].items():
            for w in b['words']:
                if min(w['plain'], w['sun']) < min(worst[0], worst[1]):
                    worst = (w['plain'], w['sun'], '%s %s "%s"' % (s, v, w['text'][:16]))
    nwords = sum(len(b['words']) for r in sides.values() for b in r['bars'].values())
    out['T2'] = (nwords > 0 and worst[0] >= 4.5 and worst[1] >= 4.5, '%d words; worst %s plain %.2f, sun %.2f' % (nwords, worst[2], worst[0], worst[1]))
    small = []
    for s, r in sides.items():
        for v, b in r['bars'].items():
            ps = list(b['presses'])
            if b.get('gear'):
                ps.append({'f': 'gear', 'w': b['gear'][2], 'h': b['gear'][3]})
            if not any(p['f'] == 'notes' for p in ps) or not any(p['f'] == 'gear' for p in ps):
                small.append('%s %s: NOTES or the gear missing' % (s, v))
            for p in ps:
                if p['w'] < 44 or p['h'] < 44:
                    small.append('%s %s %s %dx%d' % (s, v, p['f'], p['w'], p['h']))
    out['T3'] = (not small, '; '.join(small[:3]) or 'every press 44 points or more, the gear and NOTES on every bar')
    bad = []
    if re.search(r'gradient\(|blur\(|drop-shadow|text-shadow', lay_css):
        bad.append('a gradient, blur or soft shadow in the lay')
    for rad in re.findall(r'border-radius:\s*(\d+)px', lay_css):
        if int(rad) > 2:
            bad.append('a %spx corner' % rad)
    for s, r in sides.items():
        for v, b in r['bars'].items():
            for f in b['fonts']:
                if f not in FACES:
                    bad.append('%s %s resolves %s' % (s, v, f))
            for rad in b['radii']:
                if float(re.sub(r'[^\d.]', '', rad) or 0) > 2:
                    bad.append('%s %s a %s corner' % (s, v, rad))
    out['T4'] = (not bad, '; '.join(sorted(set(bad))[:3]) or 'no gradient, blur, glow or corner over 2; only CASING and ROM')
    fl = []
    for s, r in sides.items():
        f = r.get('fight') or {}
        e = f.get('edges') or {}
        if not f or f.get('afterTopShown') or e.get('TOPH') != 0:
            fl.append('%s: top shown %s, the fight measures its top at %s' % (s, f.get('afterTopShown'), e.get('TOPH')))
    out['T5'] = (len(sides) == 2 and not fl, '; '.join(fl) or 'both sides: the strip gone, the top edge 0, the board to the glass')
    kept = []
    for s, r in sides.items():
        e = (r.get('fight') or {}).get('edges') or {}
        a = (r.get('fight') or {}).get('autoTap') or {}
        if not (e.get('autoOnBar') and e.get('orderOnBar') and (e.get('faces') or 0) > 0 and a.get('was') != a.get('now')):
            kept.append('%s: AUTO %s, order %s, faces %s, tap %s' % (s, e.get('autoOnBar'), e.get('orderOnBar'), e.get('faces'), a))
    out['T6'] = (len(sides) == 2 and not kept, '; '.join(kept) or 'the round, the faces and AUTO ride the bottom bar; a tap on AUTO still flips it')
    grow = ['%s %.0f%% -> %.0f%%' % (s, 100 * r['fight']['boardNow'], 100 * r['fight']['boardAfter']) for s, r in sides.items() if r.get('fight')]
    out['T7'] = (len(grow) == 2 and all(r['fight']['boardAfter'] > r['fight']['boardNow'] for r in sides.values()), '; '.join(grow))
    it = next((i for i in reg.get('items', []) if i.get('id') == CARD), None)
    cw = ''
    if not it:
        cw = 'no card'
    else:
        sh = it.get('show') or {}
        src = os.path.normpath(os.path.join(ROOT, 'slices', sh.get('src', '')))
        first = os.path.normpath(os.path.join(ROOT, 'slices', sh.get('first', '')))
        if it.get('options') != ['A', 'B', 'C', 'NO']:
            cw = 'options %s' % it.get('options')
        elif not (os.path.isfile(src) and os.path.isfile(first) and sh.get('firstAt')):
            cw = 'sheet or first picture missing'
        elif len((it.get('twin') or {}).get('diffs') or []) != 3:
            cw = 'twin diffs'
    out['T8'] = (not cw, cw or CARD + ' A / B / C / NO, sheet and first picture on disk')
    leak = []
    for top in ('slices', 'engine'):
        for dp, _dn, fn in os.walk(os.path.join(ROOT, top)):
            for n in fn:
                if n.endswith(('.html', '.js')):
                    try:
                        t = open(os.path.join(dp, n), encoding='utf-8', errors='ignore').read()
                    except OSError:
                        continue
                    if '__bmTopBar' in t or '__bmFightNoTop' in t or 'bohemia_ui_the_top_bar' in t:
                        leak.append(os.path.relpath(os.path.join(dp, n), ROOT))
    out['T9'] = (not leak, ', '.join(leak[:3]) or 'no game file carries the candidate')
    return out


def main():
    print('THE TOP BAR  (UI [the top bar], rule 121)')
    mp = os.path.join(D, 'manifest.json')
    if not os.path.isfile(mp):
        ok('the shots and the manifest exist', False, mp)
        return finish()
    m = json.load(open(mp))
    lay_css = open(LAY, encoding='utf-8').read()
    reg = json.load(open(os.path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), encoding='utf-8'))
    legs = check(m, lay_css, reg)
    names = {'T1': 'T1 every bar says the five things, each the game\'s number', 'T2': 'T2 every word reads 4.5 to 1, plain and in the sun',
             'T3': 'T3 every press 44 points', 'T4': 'T4 no browser defaults (rule 114 D10)', 'T5': '*** T5 IN THE FIGHT NOTHING CROSSES THE TOP ***',
             'T6': 'T6 the fight\'s own strip keeps the round, the faces and AUTO', 'T7': 'T7 more board than today', 'T8': 'T8 the card is in VOTE',
             'T9': 'T9 nothing in the game'}
    for k in sorted(legs, key=lambda k: int(k[1:])):
        ok(names[k], legs[k][0], legs[k][1])
    # T10: plant six defects, each must turn its own leg red
    plants = []
    def plant(desc, leg, fn, css=None):
        mm = copy.deepcopy(m)
        fn(mm)
        got = check(mm, css if css is not None else lay_css, reg)[leg][0]
        plants.append((desc, not got))
    side = next(iter(m['sides']))
    plant('food without its days', 'T1', lambda mm: [b['said'].update(food=re.sub(r'\d+ ?(DAYS|DAY)\b', '', b['said'].get('food', ''))) for b in mm['sides'][side]['bars'].values()])
    plant('a word at 3 to 1 in the sun', 'T2', lambda mm: mm['sides'][side]['bars']['A']['words'][0].update(sun=3.0))
    plant('a 40-point NOTES', 'T3', lambda mm: [p.update(w=40) for p in mm['sides'][side]['bars']['B']['presses'] if p['f'] == 'notes'])
    plant('a gradient in the lay', 'T4', lambda mm: None, css=lay_css + ' background:linear-gradient(#000,#111);')
    plant('the strip left on in the fight', 'T5', lambda mm: mm['sides'][side]['fight'].update(afterTopShown=True))
    plant('AUTO lost from the bar', 'T6', lambda mm: mm['sides'][side]['fight']['edges'].update(autoOnBar=False))
    ok('T10 THE GATE BITES: %d of %d planted defects caught' % (sum(1 for _d, c in plants if c), len(plants)), all(c for _d, c in plants),
       ', '.join(d for d, c in plants if not c) or ', '.join(d for d, _c in plants))
    finish()


def finish():
    print('THE TOP BAR: %d passed, %d failed' % (passed, failed))
    sys.exit(1 if failed else 0)


if __name__ == '__main__':
    main()
