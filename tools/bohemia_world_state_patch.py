#!/usr/bin/env python3
"""A DIFFERENT VALLEY EVERY GAME (WORLD 7, 11/3/26, rule 339, ask line 347).

Inlines the campaign's state of the valley into the map page: records/target/bb/world_state.json as
BOHEMIA_WORLD_STATE_DATA, engine/bohemia_world_state.js as-is, and the boot's one question (does this game carry a
state: a new game does, a game saved before this file does not). Then the marked hooks, each added once:
  H1/H2/H3 the painter (vbCityCore, in the worker): a burned, looted or rebuilt block painted by the same painter
  H4/H5    the painting's input (vbCityInput, vbTileInput): the blocks' state and its key, so a new state is a new bake
  H6/H7    the map's draw (renderCity): the landmarks over the land, the fires and the sky after the night wash
  H8       the fight's door (cityHandOver): a burned block deals a burned board
  H9       slices/bohemia_world_state_map.js, after bohemia_his_map.js (the region and the boss map load first)
Re-run it after editing either source; it replaces its own block and leaves a hook that is already there alone, so it is
the same bytes every run. gates/a_different_valley_every_game_gate.js refuses a page whose inline copy drifted.

    python3 tools/bohemia_world_state_patch.py
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
DATA = os.path.join(ROOT, 'records', 'target', 'bb', 'world_state.json')
MOD = os.path.join(ROOT, 'engine', 'bohemia_world_state.js')
BEGIN = '<!-- __A_DIFFERENT_VALLEY_EVERY_GAME__ BEGIN (tools/bohemia_world_state_patch.py writes this block; edit the two sources, not here) -->'
END = '<!-- __A_DIFFERENT_VALLEY_EVERY_GAME__ END -->'
AFTER = '<!-- __A_NEW_VALLEY_EVERY_GAME__ END -->\n'
TAG = 'A_DIFFERENT_VALLEY_EVERY_GAME'

BOOT = r"""
/* DOES THIS GAME CARRY A STATE? A new game does (typed or rolled: it is stamped st:1 beside its code, so it keeps it when
   it opens again); a game saved with a code before this file keeps the valley it had (no st); the checkers' bench walks a
   state only when it walks a code. No code, no state: the old valley. */
var WORLD_STATE_ON = false;
(function(){
  if (!WORLD_SEED) return;
  var KEY = 'bohemia.world.v1', f = WORLD_SEED_FROM, st = null;
  try { st = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_e) { st = null; }
  if (f === 'typed' || f === 'rolled') {
    WORLD_STATE_ON = true;
    try { if (st && st.code === WORLD_SEED && !st.st) { st.st = 1; localStorage.setItem(KEY, JSON.stringify(st)); } } catch (_e) {}
  } else if (f === 'saved') WORLD_STATE_ON = !!(st && st.code === WORLD_SEED && (st.st | 0) >= 1);
  else if (f === 'bench') WORLD_STATE_ON = true;
  try { window.WORLD_STATE_ON = WORLD_STATE_ON; } catch (_e) {}
})();
"""

HOOKS = [
    # H1 the painter's state and its tint, inside vbCityCore (so String(vbCityCore) carries it to the worker)
    ('  var cls = inp.cls, live = inp.live;\n',
     '  var cls = inp.cls, live = inp.live;\n'
     '  /* __A_DIFFERENT_VALLEY_EVERY_GAME__ (WORLD 7, rule 339): the campaign\'s state of each block, painted by this same painter on the\n'
     '     texels it already paints: 1 BURNED (the roofs to char, ash, soot on the street; an ember at night), 2 LOOTED (stripped grey,\n'
     '     glass and junk strewn, holes kicked in), 3 REBUILT (panels on the roofs, the yards raked to dirt with salvaged panels laid in rows, never green; its own lights at night) */\n'
     '  var WST = inp.wst || null;\n'
     '  function wsMix(a, c, t){ return [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t, a[2] + (c[2] - a[2]) * t]; }\n'
     '  function wsTint(b0, st, top, c2, h, u, v){\n'
     '    var built = c2 === VB_CLASS.houses || c2 === VB_CLASS.roof || c2 === VB_CLASS.tower || c2 === VB_CLASS.casino || c2 === 16;\n'
     '    var road = c2 === VB_CLASS.road || c2 === VB_CLASS.freeway || c2 === VB_CLASS.blvd || c2 === VB_CLASS.rail;\n'
     '    if (st === 1) {\n'
     '      if (road) return h < 0.06 ? [70, 64, 58] : wsMix(b0, [38, 33, 30], 0.5);\n'
     '      if (top) return h < 0.11 ? [104, 98, 90] : h < 0.16 ? [58, 40, 30] : wsMix(b0, [30, 25, 22], built ? 0.84 : 0.66);\n'
     '      return wsMix(b0, [22, 18, 16], 0.74);\n'
     '    }\n'
     '    if (st === 2) {\n'
     '      var L = (b0[0] * 0.3 + b0[1] * 0.59 + b0[2] * 0.11), g0 = wsMix(b0, [L, L, L], 0.62), g1 = [g0[0] * 0.86, g0[1] * 0.86, g0[2] * 0.86];\n'
     '      if (road) return h < 0.16 ? [176, 166, 150] : g1;\n'
     '      if (top) return h < 0.22 ? [194, 184, 164] : h < 0.32 ? [40, 36, 34] : h < 0.36 ? [128, 74, 44] : [g0[0] * 1.08, g0[1] * 1.06, g0[2] * 1.02];\n'
     '      return h < 0.2 ? [36, 33, 32] : g1;\n'
     '    }\n'
     '    if (st === 3) {\n'
     '      if (!top || road) return b0;\n'
     '      if (built) { var pu = ((u >> 1) + (v >> 1)) % 3; return pu === 0 ? [132, 172, 200] : pu === 1 ? [64, 104, 146] : [46, 80, 122]; }\n'
     '      var rw = ((u + v) >> 1) % 4; return rw === 0 ? [70, 94, 122] : rw === 1 ? [112, 138, 160] : h < 0.3 ? [170, 154, 126] : wsMix(b0, [158, 144, 118], 0.6);   /* open ground taken back: raked dirt, salvaged panels laid in rows; NEVER GREEN (rule 341: no water here, a dead lawn is dust) */\n'
     '    }\n'
     '    return b0;\n'
     '  }\n'),
    # H2 the tint, where each texel's colour is written
    ('      var o8 = (vv * P + uu) * 4;\n',
     '      var wsv = 0; if (WST) { var wbx = Math.floor(qu / S) - PAD, wby = Math.floor(qv / S) - PAD; if (wbx >= 0 && wby >= 0 && wbx < N && wby < N) wsv = WST[wby * N + wbx];\n'
     '        if (wsv) b = wsTint(b, wsv, top, cl2, vbHash(qu + XS, qv + YS, sd + 29), qu + XS, qv + YS); }   /* __A_DIFFERENT_VALLEY_EVERY_GAME__ */\n'
     '      var o8 = (vv * P + uu) * 4;\n'),
    # H3 the night: a rebuilt block's own lights, a burned block's embers
    ('      if (cl2 === TW_K && part2 === PART.window && top) { var fire',
     '      if (wsv === 3 && top && (part2 === PART.window || ((cl2 === VB_CLASS.houses || cl2 === VB_CLASS.roof) && vbHash(qu + XS, qv + YS, sd + 31) < 0.06))) { for (var z5 = 0; z5 < 3; z5++) { night[o8 + z5] = C.lit[z5]; lights[o8 + z5] = C.lit[z5]; } lights[o8 + 3] = 255; }   /* __A_DIFFERENT_VALLEY_EVERY_GAME__: rebuilt, its own panels light it */\n'
     '      else if (wsv === 1 && top && vbHash(qu + XS, qv + YS, sd + 37) < 0.035) { var em5 = vbHash(qu + XS, qv + YS, sd + 41) < 0.5 ? [214, 84, 30] : [150, 50, 24]; for (var z6 = 0; z6 < 3; z6++) { night[o8 + z6] = em5[z6]; lights[o8 + z6] = em5[z6]; } lights[o8 + 3] = 255; }   /* an ember in the char */\n'
     '      if (cl2 === TW_K && part2 === PART.window && top) { var fire'),
    # H4 the whole painting's input: the state and its key
    ("cls: cls, live: live, sub: sub, key: om.seed + ':' + h + ':c' + VB_COOK.v + (tws ? ':t' + VB_TOWNS.key : ''),",
     "cls: cls, live: live, sub: sub, key: om.seed + ':' + h + ':c' + VB_COOK.v + (tws ? ':t' + VB_TOWNS.key : '') + (window.__WS_KEY ? ':ws' + window.__WS_KEY : ''), wst: window.__WS_CELL || null,   /* __A_DIFFERENT_VALLEY_EVERY_GAME__ */"),
    # H5 a tile's input: its window of the state (its key is the painting's, so it follows)
    ("    var lv = 0; try { lv = POWER && POWER.at(gx, gy).live ? 1 : 0; } catch (_e) {} live[k] = lv; }\n",
     "    var lv = 0; try { lv = POWER && POWER.at(gx, gy).live ? 1 : 0; } catch (_e) {} live[k] = lv; if (WSC) wst[k] = WSC[gy * N + gx]; }   /* __A_DIFFERENT_VALLEY_EVERY_GAME__ */\n"),
    ("  var cls = new Uint8Array(n * n), live = new Uint8Array(n * n), sub = new Uint8Array(n * n), thm = new Uint8Array(n * n);\n  for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) { var gx = x0 + x, gy = y0 + y, k = y * n + x;",
     "  var cls = new Uint8Array(n * n), live = new Uint8Array(n * n), sub = new Uint8Array(n * n), thm = new Uint8Array(n * n);\n  var WSC = window.__WS_CELL || null, wst = WSC ? new Uint8Array(n * n) : null;   /* __A_DIFFERENT_VALLEY_EVERY_GAME__ */\n  for (var y = 0; y < n; y++) for (var x = 0; x < n; x++) { var gx = x0 + x, gy = y0 + y, k = y * n + x;"),
    ("  return { kind: 'tile', N: n, NF: N, S: S, PAD: 0, hashPad: VB_CPAD, org: [x0, y0], seed: om.seed, cls: cls, live: live, sub: sub,",
     "  return { kind: 'tile', N: n, NF: N, S: S, PAD: 0, hashPad: VB_CPAD, org: [x0, y0], seed: om.seed, cls: cls, live: live, sub: sub, wst: wst,"),
    # H6 the landmarks: over the land, the towns and the fog (smoke stands up out of it), under him and the names
    ("  try { if (window.BohemiaHisMap && BohemiaHisMap.draw) BohemiaHisMap.draw(ox, oy); } catch (_e) {}",
     "  try { if (window.BohemiaWorldStateMap && BohemiaWorldStateMap.draw) BohemiaWorldStateMap.draw(ox, oy); } catch (_e) {}   /* __A_DIFFERENT_VALLEY_EVERY_GAME__ (WORLD 7, rule 339): the camps' smoke, the lairs' birds, the ruins, the legendary masts, the shut roads */\n"
     "  try { if (window.BohemiaHisMap && BohemiaHisMap.draw) BohemiaHisMap.draw(ox, oy); } catch (_e) {}"),
    # H7 after the night wash: the fires glow and the masts blink through the dark; the start's sky over all of it
    ("g.globalAlpha=ga2; window.__LAMPQ=null; }\n}\n",
     "g.globalAlpha=ga2; window.__LAMPQ=null; }\n  try { if (window.BohemiaWorldStateMap && BohemiaWorldStateMap.after) BohemiaWorldStateMap.after(ox, oy, night); } catch (_e) {}   /* __A_DIFFERENT_VALLEY_EVERY_GAME__ */\n}\n"),
    # H8 the fight's door
    ("msg.district=_ft?_ft.district:null; } }catch(_e){}",
     "msg.district=_ft?_ft.district:null; } }catch(_e){}\n  try{ if(msg && window.BohemiaWorldStateMap && BohemiaWorldStateMap.handOver) BohemiaWorldStateMap.handOver(msg); }catch(_e){}   /* __A_DIFFERENT_VALLEY_EVERY_GAME__ (WORLD 7): a burned block deals a burned board; the block's state and its power go with the fight */"),
    # H9 the map's half
    ('<script src="bohemia_his_map.js"></script>',
     '<script src="bohemia_his_map.js"></script>  <script src="bohemia_world_state_map.js"></script>  <!-- __A_DIFFERENT_VALLEY_EVERY_GAME__ WORLD 7 (rule 339): the campaign\'s state of the valley drawn and made true: dark, burned, looted, rebuilt; camps, lairs, ruins, legendary places; shut roads and passes; the start\'s sky -->'),
]


def main():
    page = open(PAGE, encoding='utf-8').read()
    data = json.load(open(DATA, encoding='utf-8'))
    mod = open(MOD, encoding='utf-8').read()
    block = (BEGIN + '\n<script>\n/* ==== __A_DIFFERENT_VALLEY_EVERY_GAME__ (WORLD 7, 11/3/26, rule 339, ask line 347): the campaign\'s state of the real '
             'valley. Sources: records/target/bb/world_state.json and engine/bohemia_world_state.js. ==== */\n'
             'var BOHEMIA_WORLD_STATE_DATA = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n'
             + mod.rstrip() + '\n' + BOOT.strip('\n') + '\n</script>\n' + END + '\n')
    if BEGIN in page:
        page = re.sub(re.escape(BEGIN) + r'.*?' + re.escape(END) + r'\n', lambda m: block, page, count=1, flags=re.S)
    else:
        if page.count(AFTER) != 1:
            sys.exit('the world seed block is not on the page once (run tools/bohemia_world_seed_patch.py first)')
        page = page.replace(AFTER, AFTER + block, 1)
    added = 0
    there = sum(1 for _o, nw in HOOKS if nw in page)
    if 0 < there < len(HOOKS):
        sys.exit('%d of %d hooks are on the page as they are now: an older run\'s hooks are there; check the page out of git '
                 '(git checkout slices/BOHEMIA_CITY_WORLD.html, then re-run the other patch tools that wrote since) and run this again' % (there, len(HOOKS)))
    for old, new in HOOKS:
        if new in page:
            continue
        n = page.count(old)
        if n != 1:
            sys.exit('hook anchor found %d times, wanted once: %r' % (n, old[:90]))
        page = page.replace(old, new, 1); added += 1
    open(PAGE, 'w', encoding='utf-8').write(page)
    print('world state: block %d bytes, %d hooks added, %d already there' % (len(block), added, len(HOOKS) - added))


if __name__ == '__main__':
    main()
