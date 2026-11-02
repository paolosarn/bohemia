#!/usr/bin/env python3
"""A NEW VALLEY EVERY GAME (WORLD 6, 11/2/26, rule 318, ask line 315).

Inlines the campaign seed into the map page: records/target/bb/world_seed.json as BOHEMIA_WORLD_SEED_DATA, the
placer engine/bohemia_world_seed.js as-is, and the boot's one decision (which code this game is). Re-run it after
editing either source; it replaces its own block and nothing else, so it is the same bytes every run.
gates/a_new_valley_every_game_gate.js refuses a page whose inline copy drifted from the two files.

    python3 tools/bohemia_world_seed_patch.py
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
DATA = os.path.join(ROOT, 'records', 'target', 'bb', 'world_seed.json')
MOD = os.path.join(ROOT, 'engine', 'bohemia_world_seed.js')
BEGIN = '<!-- __A_NEW_VALLEY_EVERY_GAME__ BEGIN (tools/bohemia_world_seed_patch.py writes this block; edit the two sources, not here) -->'
END = '<!-- __A_NEW_VALLEY_EVERY_GAME__ END -->'
ANCHOR = '<script>\n/* ==== engine/bohemia_overmap.js ==== */'

BOOT = r"""
/* THE BOOT'S ONE DECISION: which campaign this page is. Decided once, before anything asks where a base is, and never
   changed while the page lives (a new code is a new page: the new-game screen reloads to it, as NEW GAME always has).
   localStorage 'bohemia.world.v1' {code} is saved with the game; 'bohemia.world.next.v1' is a code he typed on the
   new-game screen, waiting for this boot; 'bohemia.world.bench.v1' lets a checker's bench (the dark lifted) walk a
   seeded valley, else the bench keeps the old one. A game saved before the seed keeps the old valley. */
var WORLD_SEED = '', WORLD_SEED_FROM = 'bench';
(function(){
  var KEY = 'bohemia.world.v1', NEXT = 'bohemia.world.next.v1', BENCH = 'bohemia.world.bench.v1', DEAD = '{"bohemia":"DEAD"}';
  var ls = function(k){ try { return localStorage.getItem(k); } catch (_e) { return null; } };
  var bench = ls('bohemia.fog.off') === '1';
  /* a live save: the save engine's own slots, read the way it reads them (a DEAD mark is a killed save, not a save) */
  var live = false;
  ['bohemia_city_save.a', 'bohemia_city_save.b', 'bohemia_city_save'].forEach(function(k){
    if (live) return; var raw = ls(k); if (!raw || raw === DEAD) return;
    try { var e = JSON.parse(raw), d = null;
      if (e && e.v === 1 && e.data) d = e.data; else if (e && typeof e.p === 'string') { var inner = JSON.parse(e.p); d = inner && inner.data; }
      if (d && (d.day | 0) >= 1) live = true; } catch (_e) {}
  });
  var stored = null; try { stored = JSON.parse(ls(KEY) || 'null'); } catch (_e) { stored = null; }
  var r = { code: '', from: 'bench' };
  try {
    if (bench) r = { code: BohemiaWorldSeed.norm(ls(BENCH) || '') || '', from: 'bench' };
    else r = BohemiaWorldSeed.resolve({ liveSave: live, stored: stored, staged: ls(NEXT), entropy: Date.now() + ':' + Math.random() });
  } catch (_e) { r = { code: '', from: 'broken' }; }
  WORLD_SEED = r.code || ''; WORLD_SEED_FROM = r.from;
  if (r.from === 'typed' || r.from === 'rolled') {
    try { localStorage.setItem(KEY, JSON.stringify({ v: 1, code: WORLD_SEED, from: r.from, at: Date.now() })); } catch (_e) {}
  }
  try { localStorage.removeItem(NEXT); } catch (_e) {}
  try { window.WORLD_SEED = WORLD_SEED; window.__WORLD_SEED = { code: WORLD_SEED, shown: BohemiaWorldSeed.show(WORLD_SEED), from: WORLD_SEED_FROM, live: live }; } catch (_e) {}
})();
/* THE SEEDED BASES, worked out once from the real map's town blocks (the same list the old placer read) and kept */
var WORLD_BASES = null;
function worldBases(){
  if (!WORLD_SEED) return null;
  if (WORLD_BASES && WORLD_BASES.code === WORLD_SEED) return WORLD_BASES.bases;
  try {
    var ds = BohemiaTowns.districtsOf(om, BohemiaCityEdit.cat);
    if (!ds || !ds.length) return null;
    var P = BohemiaWorldSeed.place(ds, WORLD_SEED, { classic: (typeof CT_BASES_BAKED !== 'undefined') ? CT_BASES_BAKED : null, n: om.n | 0 });
    if (!P || !P.bases) return null;
    WORLD_BASES = P; window.__WORLD_BASES = P;
    return P.bases;
  } catch (_e) { return null; }
}
"""


def main():
    page = open(PAGE, encoding='utf-8').read()
    data = json.load(open(DATA, encoding='utf-8'))
    mod = open(MOD, encoding='utf-8').read()
    block = (BEGIN + '\n<script>\n/* ==== __A_NEW_VALLEY_EVERY_GAME__ (WORLD 6, 11/2/26, rule 318, ask line 315): one campaign seed decides who '
             'stands on the real valley. Sources: records/target/bb/world_seed.json and engine/bohemia_world_seed.js. ==== */\n'
             'var BOHEMIA_WORLD_SEED_DATA = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n'
             + mod.rstrip() + '\n' + BOOT.strip('\n') + '\n</script>\n' + END + '\n')
    if BEGIN in page:
        page = re.sub(re.escape(BEGIN) + r'.*?' + re.escape(END) + r'\n', lambda m: block, page, count=1, flags=re.S)
    else:
        if page.count(ANCHOR) != 1:
            sys.exit('the anchor (the overmap script, the first that builds the valley) is not in the page exactly once; nothing written')
        page = page.replace(ANCHOR, block + ANCHOR, 1)
    open(PAGE, 'w', encoding='utf-8').write(page)
    print('A NEW VALLEY EVERY GAME: the seed block is in the map (%d bytes)' % len(block))


if __name__ == '__main__':
    main()
