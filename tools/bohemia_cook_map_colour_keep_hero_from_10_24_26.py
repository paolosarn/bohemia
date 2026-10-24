#!/usr/bin/env python3
"""COOK [the map remade, in colour] (10/24/26): after the wire and the chunker, keep only what this lane changed.
The chunker also moves UI's two script tags in the world page and rewrites RUN's comment in the alpha's warm-up list
(the 10/23 record, FOR PLUMBER); this lane's change is the pictures (the chunk) and the HERO_FROM line, nothing else.
So: the alpha back to HEAD, and the world page back to HEAD with only its HERO_FROM line taken from the wire's run.
  python3 tools/bohemia_cook_map_colour_keep_hero_from_10_24_26.py
REFERENCE CHECK / REUSE CHECK / TASTE CHECK: none needed, no pixel is made; git's own HEAD is the reference.
"""
import subprocess, re, os
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(R)
W = 'slices/BOHEMIA_CITY_WORLD.html'
now = open(W, encoding='utf8').read()
line = re.search(r'^var HERO_FROM=.*;$', now, re.M).group(0)
head = subprocess.run(['git', 'show', 'HEAD:' + W], capture_output=True, check=True).stdout.decode('utf8')
out, n = re.subn(r'^var HERO_FROM=.*;$', lambda m: line, head, count=1, flags=re.M)
assert n == 1
open(W, 'w', encoding='utf8').write(out)
subprocess.run(['git', 'checkout', 'HEAD', '--', 'slices/BOHEMIA_ALPHA_0_9.html'], check=True)
print('kept HERO_FROM only; the alpha and the rest of the world page are HEAD\'s')
