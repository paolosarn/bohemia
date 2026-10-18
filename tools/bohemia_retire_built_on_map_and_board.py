#!/usr/bin/env python3
"""BOHEMIA — RETIRE [built on the map] AND [built on the board] (10/10/26, LIFE + CITY; rule 86, the seventh votes).

Paolo 10/9 in the tab, both DOWN: 'the settlements are all looking like dogshit and not organic with the map' and
'the map is mainly for looks, you can't be putting a bunch of micro features the player doesn't understand, Battle
Brothers doesn't make it complicated and neither should you'. Rule 86: what you build lives in the settlement screen of
your base and nowhere else; both rows RETIRED to the graveyard, their code out of the fight's and the map's paths.

TAKES OUT (each by its own marker; refuses if a marker is half there):
  THE FIGHT (slices/BOHEMIA_FIGHT.html): placeBuilt() and its call, its image loading, its drawing, and the one
      condition it added to the cover loop (restored to the line it replaced).
  THE SHELL (slices/BOHEMIA_ALPHA_0_9.html): the hand-over of `built` to the fight's options.
  THE MAP (slices/BOHEMIA_CITY_WORLD.html): the attaching of `built` at the fight door, and the drawing of what you
      built beside your base.
KEEPS (not map features, not a micro feature on the map): the build lots kept on the map so the settlement screen's
building persists and the morning finishes it into the century ledger the derive reads; the raid on your base
([a raid on your base], still SHIPPED) and its fight at the gate.
Writes the removed text to graveyard/ beside a post-mortem. Idempotent: a second run finds nothing.
REUSE CHECK: nothing is drawn; this only removes.
Run from repo root:  python3 tools/bohemia_retire_built_on_map_and_board.py
"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
GY = os.path.join(ROOT, 'graveyard', 'built_on_the_map_and_board_10_10_26')
removed = []

def span(s, begin, end, label, path):
    i = s.find(begin)
    if i < 0: return s
    j = s.find(end, i)
    if j < 0: sys.exit('REFUSING: %s opens and never closes in %s.' % (label, path))
    k = j + len(end)
    if s[k:k + 1] == '\n': k += 1
    removed.append((path, label, s[i:k])); return s[:i] + s[k:]

def line(s, text, label, path, repl=''):
    if text not in s: return s
    removed.append((path, label, text)); return s.replace(text, repl, 1)

def main():
    p = os.path.join(ROOT, 'slices', 'BOHEMIA_FIGHT.html'); s = open(p, encoding='utf8').read(); b = s
    s = line(s, "    try { placeBuilt(opts.built); } catch (_e) {}   /* __BUILT_ON_THE_BOARD__ (LIFE+CITY 10/9) */\n", 'the call', p)
    s = span(s, '  /* __BUILT_ON_THE_BOARD__ fn (LIFE+CITY 10/9) */', '  /* __/BUILT_ON_THE_BOARD__ fn */', 'placeBuilt()', p)
    s = line(s, "  (FIGHT.S.built || []).forEach(function (q) { const s2 = 'fight_ground/../settlement/lot/' + q.id + '.png'; if (all.indexOf(s2) < 0) all.push(s2); });   /* __BUILT_ON_THE_BOARD__ */\n", 'the image loading', p)
    s = line(s, "        if (im && !cv2.yours) g.drawImage(im, cv2.x_m * pxm * k, cv2.y_m * pym * k, im.width * k, im.height * k);   /* yours: drawn below */\n",
             'the cover loop condition', p, "        if (im) g.drawImage(im, cv2.x_m * pxm * k, cv2.y_m * pym * k, im.width * k, im.height * k);\n")
    a = s.find('      /* __BUILT_ON_THE_BOARD__ draw (LIFE+CITY 10/9)')
    if a >= 0:
        z = s.index("im.width * s, im.height * s); });\n", a) + len("im.width * s, im.height * s); });\n")
        removed.append((p, 'the drawing', s[a:z])); s = s[:a] + s[z:]
    if s != b: open(p, 'w', encoding='utf8').write(s)
    p = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html'); s = open(p, encoding='utf8').read(); b = s
    s = span(s, '  /* __BUILT_ON_THE_BOARD__ (LIFE+CITY 10/9) */', '  /* __/BUILT_ON_THE_BOARD__ */', 'the shell hand-over', p)
    if s != b: open(p, 'w', encoding='utf8').write(s)
    p = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html'); s = open(p, encoding='utf8').read(); b = s
    s = span(s, '  /* __BUILT_ON_THE_BOARD__ (LIFE+CITY 10/9) */', '  /* __/BUILT_ON_THE_BOARD__ */', 'the map door attach', p)
    s = span(s, '        /* __BUILT_ON_THE_MAP__ at the base (LIFE+CITY 10/9) */', '        /* __/BUILT_ON_THE_MAP__ at the base */', 'the drawing at the base', p)
    if s != b: open(p, 'w', encoding='utf8').write(s)
    if not removed:
        print('RETIRE: nothing to do'); return
    os.makedirs(GY, exist_ok=True)
    with open(os.path.join(GY, 'removed_code.txt'), 'a', encoding='utf8') as f:
        for path, label, text in removed:
            f.write('==== %s :: %s ====\n%s\n' % (os.path.relpath(path, ROOT), label, text))
    print('RETIRE: %d pieces out of the fight, the shell and the map' % len(removed))

if __name__ == '__main__':
    main()
