#!/usr/bin/env python3
"""BOHEMIA CITY TOWNS -- put the faction towns where the player walks.

FACTION-TOWNS needs two things on the walked surface that were not there:

  1. engine/bohemia_towns.js   the seat + tier rule
  2. the FACTION GRAPH          his own act1_power / act3_power numbers

The graph is HIS DATA (GDD v2 s9, engine/BOHEMIA_faction_graph.json) and there
must be exactly ONE copy of it. So this SPLICES the canonical JSON in verbatim
rather than transcribing any part of it, and it is re-runnable: run it after
editing the graph and the page catches up. A hand-typed second copy of a faction's
power number is how a fortress becomes a camp on one surface and not the other.

*** THE DRIFT THIS EXISTS TO END, MEASURED 9/5 BEFORE ANY OF IT WAS WRITTEN ***
The loop seats factions by striding over cells that pass bohemia_world.js's
isAutoDistrict: 3,919 of them. The walked surface cannot load that module at all
and its own idea of a real district is bohemia_cityedit.js's cat()=='sand': 4,009.
Same valley, same seed, NINETY CELLS APART, and therefore two different answers to
where the Mob lives. Nothing had noticed because nothing had ever asked the walked
surface the question -- its FACTION_ASSIGN table is {} and its own comment says so.

  python3 tools/bohemia_city_towns_patch.py
Gate: gates/faction_towns_gate.js
"""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
MODULE = os.path.join(ROOT, 'engine', 'bohemia_towns.js')
GRAPH = os.path.join(ROOT, 'engine', 'BOHEMIA_faction_graph.json')

MOD_BEGIN = '/* ==== engine/bohemia_towns.js (FACTION TOWNS, 9/5) ==== */'
MOD_END = '/* ==== /engine/bohemia_towns.js (FACTION TOWNS) ==== */'
# *** THE GRAPH GETS A MARKER THAT IS NOT THE MODULE BANNER FORM, ON PURPOSE. ***
# bohemia_city_module_resync.py collects every `/* ==== engine/<name> ==== */` line
# whose file exists and tries to resync that file's body. engine/BOHEMIA_faction_graph.json
# EXISTS, so a banner in that shape put a .json into the module list and the resync
# reported it UNRECOGNISED. A data splice is not a module; it says so in its own marker.
GR_BEGIN = '/* ===== BOHEMIA FACTION GRAPH (generated, verbatim) ===== */'
GR_END = '/* ===== END BOHEMIA FACTION GRAPH ===== */'

# *** AND THE ANCHOR IS THE NEXT MODULE'S BANNER, NOT A LINE INSIDE CITYEDIT. ***
# The first cut of this tool anchored on `root.BohemiaCityEdit=API;`, which is INSIDE
# bohemia_cityedit.js's canonical body. bohemia_city_module_resync.py resyncs a module
# by finding its whole canon body as a substring and replacing it -- so the next resync
# swallowed the spliced block whole and left the page with an unbalanced brace and a
# dead script. Measured: every global in the city came back `undefined`.
# Anchoring on the banner of the module that FOLLOWS cityedit puts the block outside
# every module body, and bounds the towns module so the resync can keep it fresh.
ANCHOR = '/* ==== engine/bohemia_production.js (inlined verbatim) ==== */'


def cut(text, begin, end, label):
    i = text.find(begin)
    if i < 0:
        return text, False
    j = text.find(end, i)
    if j < 0:
        sys.exit('REFUSING TO WRITE: %s has an opening marker and no closing one.' % label)
    k = j + len(end)
    if text[k:k + 1] == '\n':
        k += 1
    return text[:i] + text[k:], True


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: %s not found' % CITY)
    for p in (MODULE, GRAPH):
        if not os.path.exists(p):
            sys.exit('FAIL: %s not found' % p)

    s = open(CITY, encoding='utf8').read()
    before = s

    s, _ = cut(s, MOD_BEGIN, MOD_END, 'the towns module')
    s, _ = cut(s, GR_BEGIN, GR_END, 'the faction graph')

    if s.count(ANCHOR) != 1:
        sys.exit('REFUSING TO WRITE: the anchor resolves %d times, not 1.' % s.count(ANCHOR))
    # AND IT MUST REALLY BE OUTSIDE CITYEDIT'S BODY, or the next resync eats the block.
    canon_cityedit = open(os.path.join(ROOT, 'engine', 'bohemia_cityedit.js'), encoding='utf8').read()
    if canon_cityedit in s and s.index(ANCHOR) < s.index(canon_cityedit) + len(canon_cityedit):
        sys.exit('REFUSING TO WRITE: the anchor sits inside bohemia_cityedit.js\'s body; '
                 'the module resync would swallow the block.')

    # HIS DATA, PARSED AND RE-EMITTED AS JSON so it lands as one expression that
    # cannot terminate the script tag. Never edited, never summarised: json.dumps of
    # what json.load read is the same document.
    graph = json.load(open(GRAPH, encoding='utf8'))
    graph_js = json.dumps(graph, ensure_ascii=True)
    if '</' in graph_js:
        sys.exit('REFUSING TO WRITE: the graph contains a sequence that would close the script tag.')

    mod = open(MODULE, encoding='utf8').read().rstrip('\n')

    block = (
        GR_BEGIN + '\n'
        '/* Paolo\'s own faction graph, spliced verbatim by\n'
        '   tools/bohemia_city_towns_patch.py. ONE COPY OF HIS NUMBERS: edit\n'
        '   engine/BOHEMIA_faction_graph.json and re-run that tool. Nothing here is\n'
        '   typed by hand and nothing here may be edited in place. */\n'
        'window.BOHEMIA_FACTION_GRAPH=' + graph_js + ';\n'
        + GR_END + '\n'
        + MOD_BEGIN + '\n'
        + mod + '\n'
        + MOD_END + '\n\n'
    )

    s = s.replace(ANCHOR, block + ANCHOR, 1)

    if s == before:
        print('  -> nothing to do')
        return
    open(CITY, 'w', encoding='utf8').write(s)
    print('CITY TOWNS: faction graph + towns module inlined after cityedit')
    print('  city : %.1f MB' % (len(s) / 1e6))


if __name__ == '__main__':
    main()
