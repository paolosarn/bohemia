#!/usr/bin/env python3
"""
BOHEMIA WARDROBE EXTRACT (7/19/26, LIFE session) — read the canon wardrobe OUT
of the clothing factory so agents can wear it.

The clothing factory (its own session's system — never edited here) keeps the
one true GARMENTS array inside the alpha: {n:'NAME', st:'canon'|'cook'|'dead',
layer:'base'|..., gen: ...ramp:RAMPNAME...}. This tool READS the alpha and
banks a machine-readable list of the CANON items only:

    NAME|layer|#rrggbb     (hex = the garment ramp's mid tone, for tiny-scale
                            agent rendering where the full rig doesn't fit)

Re-run whenever the wardrobe grows; dress_gate.js compares the bank's canon
count against the alpha's live count, so a stale bank goes RED (freshness-gated
like the questbook archive).
"""
import os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
OUT = 'banks/BOHEMIA_WARDROBE_CANON_7_19_26.txt'

src = open(ALPHA, encoding='utf8').read()

# 1) ramp definitions: NAME={dk:[..],mid:[..],lt:[..]}
ramps = {}
for m in re.finditer(r"([A-Z][A-Z0-9_]*)\s*=\s*\{dk:\[([\d,\s]+)\]\s*,\s*mid:\[([\d,\s]+)\]\s*,\s*lt:\[([\d,\s]+)\]", src):
    mid = [int(v) for v in m.group(3).replace(' ', '').split(',') if v]
    if len(mid) == 3:
        ramps[m.group(1)] = mid

# 2) garment entries (single- or double-quoted names), canon only
items = []
pat = re.compile(r"\{n:(['\"])(.+?)\1\s*,\s*st:'canon'\s*,\s*layer:'(\w+)'\s*,\s*gen:(.*?)\}\s*[,\]]")
for m in pat.finditer(src):
    name, layer, gen = m.group(2), m.group(3), m.group(4)
    rm = re.search(r"ramp:([A-Z][A-Z0-9_]*)", gen)
    mid = ramps.get(rm.group(1)) if rm else None
    if not mid:
        mid = [110, 104, 92]   # neutral dust cloth fallback (no ramp readable)
    hexc = '#%02x%02x%02x' % tuple(mid)
    items.append((name, layer, hexc))

if not items:
    print('EXTRACT FAILED: no canon garments found in the alpha'); sys.exit(1)

lines = ['=== BOHEMIA WARDROBE CANON (machine bank, generated %s) ===' % '7/19/26',
         '# source: %s GARMENTS[st=canon]. regenerate: python3 tools/bohemia_wardrobe_extract.py' % ALPHA,
         '# NAME|layer|midhex  (hex = ramp mid tone, for tiny-agent rendering)',
         '# count: %d' % len(items)]
for n, l, h in items:
    lines.append('%s|%s|%s' % (n, l, h))
open(OUT, 'w', encoding='utf8').write('\n'.join(lines) + '\n')

by_layer = {}
for n, l, h in items:
    by_layer[l] = by_layer.get(l, 0) + 1
print('wardrobe bank -> %s: %d canon items %s' % (OUT, len(items), by_layer))
