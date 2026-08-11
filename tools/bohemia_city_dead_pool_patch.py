#!/usr/bin/env python3
"""
THE DEAD GET THEIR OWN JUDGED POOL (8/9/26, CITY lane) — fixing my own regression.

INTERIORS LAW, another lane's, and it is right: "the interior NEVER samples the raw
un-swept cut corpus (TP_TILES/TP_IMG)". It exists because an early interior reached
into TP_TILES and put purple and neon in a dead house. An interior is built ONLY
from pools Paolo has judged.

MY INDOOR HUSK PASS BROKE IT. It read TP_IMG straight from inside the interior
render, so gates/interiors_gate.js went red the moment the dead shipped. My draws
were already restricted to his UP-verdict index ranges, so the SPIRIT was met -- but
the letter of somebody else's law is not mine to reinterpret because my feature is
the exception, and weakening their gate to fit my code is the "fix the target, not
the ruler" move this repo bans.

THE FIX IS THE ONE THE LAW ASKS FOR: a NAMED, PRE-FILTERED POOL.

    DEAD_IMG   built once, outside the interior slice, from TP_IMG's gore bank with
               EVERY tile Paolo thumbed DOWN set to null.

Both passes (outdoor and indoor) now draw from DEAD_IMG. That is strictly safer than
what it replaces: before, the UP filter lived only in the module's index maths, so a
future bug in tileIndex() could surface a killed tile. Now the pool PHYSICALLY CANNOT
HOLD ONE -- a DOWN index is a null and nothing draws. The verdict is enforced by the
data, not by arithmetic.

REUSE CHECK: COOKS ZERO PIXELS. It re-points two draw sites at a filtered view of a
bank the page already decodes.
  opened slices/BOHEMIA_CITY_TILES.js -> TP_TILES.gore, via the page's own TP_IMG.
  opened banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt -> the DOWN list comes from
    BohemiaDead.TILES.down, which is derived from his Great Sweep.

Idempotent: re-running when the pool is already there reports NOOP.

  python3 tools/bohemia_city_dead_pool_patch.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = 'const DEAD_IMG='

if not os.path.exists(WORLD):
    sys.exit('DEAD POOL: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()
if MARK in src:
    print('the dead already draw from their own judged pool. no-op.')
    sys.exit(0)
if 'deadDraw(ox,oy)' not in src:
    sys.exit('DEAD POOL: the dead are not wired into this page yet. Run the dead patch first.')

POOL = r'''
/* THE DEAD'S OWN JUDGED POOL (8/9). INTERIORS LAW: "the interior NEVER samples the
   raw un-swept cut corpus (TP_TILES/TP_IMG)" -- it exists because an early interior
   pulled unjudged art into a house. My indoor husk pass read TP_IMG directly and
   broke it. This is the pool that law asks for: built ONCE, out here, with every
   tile Paolo thumbed DOWN replaced by null.
   STRICTLY SAFER THAN WHAT IT REPLACES. The UP filter used to live only in the
   module's index arithmetic, so a future bug in tileIndex() could have surfaced a
   killed tile. The pool cannot hold one. The verdict is enforced by the data. */
const DEAD_IMG=(function(){
  if(typeof BohemiaDead==='undefined') return [];
  const bank=(typeof TP_IMG!=='undefined')&&TP_IMG[BohemiaDead.TILES.bank];
  if(!bank||!bank.length) return [];
  const down={}; (BohemiaDead.TILES.down||[]).forEach(i=>{down[i]=1;});
  return bank.map((im,i)=>down[i]?null:im);
})();
function deadImg(i){ const a=DEAD_IMG; if(!a||!a.length)return null;
  /* walk forward off a killed slot rather than modulo onto one */
  for(let k=0;k<a.length;k++){ const im=a[(i+k)%a.length]; if(im) return im; }
  return null; }
'''

# put the pool immediately before the outdoor pass, which is already outside the
# interior slice the gate inspects.
ANCHOR = "/* ==== THE DEAD, OUTDOORS (8/8, WORLD lane)"
i = src.find(ANCHOR)
if i < 0:
    sys.exit('DEAD POOL: could not find the outdoor pass to define the pool before.')
src = src[:i] + POOL + '\n' + src[i:]

# --- re-point the OUTDOOR pass ---
old_out = "  const bank=TP_IMG&&TP_IMG[BohemiaDead.TILES.bank]; if(!bank||!bank.length)return;"
new_out = "  if(!DEAD_IMG.length)return;"
if old_out not in src:
    sys.exit('DEAD POOL: the outdoor pass does not look the way this patch expects.')
src = src.replace(old_out, new_out, 1)
src = src.replace("      deadTile(bank[d.tile%bank.length], ox+fx*C, oy+fy*C, C, d.scale);",
                  "      deadTile(deadImg(d.tile), ox+fx*C, oy+fy*C, C, d.scale);", 1)
src = src.replace("        deadTile(bank[(d.tile+k*7)%bank.length],",
                  "        deadTile(deadImg(d.tile+k*7),", 1)

# --- re-point the INDOOR pass: no TP_IMG may remain inside the interior slice ---
src = src.replace("      const bank=TP_IMG&&TP_IMG[BohemiaDead.TILES.bank];\n      if(bank&&bank.length){",
                  "      if(DEAD_IMG.length){", 1)
src = src.replace("          const im=bank[d.tile%bank.length];",
                  "          const im=deadImg(d.tile);", 1)

open(WORLD, 'w', encoding='utf-8').write(src)

# prove it: the interior slice the gate reads must be clean
inside = src[src.index('const IN_FLOORPOOL='):src.index('const _inRender=render')]
bad = inside.count('TP_IMG') + inside.count('TP_TILES')
print('THE DEAD NOW DRAW FROM A JUDGED POOL.')
print('  DEAD_IMG built once: his gore bank with every DOWN tile nulled out')
print('  raw-corpus references left inside the interior slice: %d  (must be 0)' % bad)
if bad:
    sys.exit('DEAD POOL: the interior slice still reaches for the raw corpus. Refusing to call this done.')
