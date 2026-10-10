#!/usr/bin/env python3
"""BOHEMIA — BUILT ON THE BOARD (10/9/26, LIFE + CITY, row [built on the board]).

Rule 40b's third place: what you built shows "on the fight board cut from that block". Rule 37g: high
ground is a roof. Three small marked hooks, idempotent (a marked block is rewritten in place, an anchor
must resolve exactly once):

  1. THE MAP (slices/BOHEMIA_CITY_WORLD.html): at the one door every fight goes through (cityHandOver),
     a BOHEMIA_CITY_ENCOUNTER fought within two blocks of a place whose lots stand carries `built`: each
     standing thing's id and what it is on a board (engine/bohemia_lotbuild.js fightTile: wall, high,
     building, open).
  2. THE SHELL (slices/BOHEMIA_ALPHA_0_9.html, nfOpts): hands `built` to the fight's options.
  3. THE FIGHT (slices/BOHEMIA_FIGHT.html, COMBAT's; one call after the board is cut to the party, before
     anybody deploys): each thing goes on YOUR side of the board, on open ground that is nobody's yet:
       wall      the board's own BLOCK WALL cover piece, on your front column, the middle row first
       high      the tile turns to 'height' (+1 level: the terrain key's own rule), in your zone
       building  a cover piece that blocks movement, drawn with the thing's own picture (the same cut
                 the settlement and the map stand on its lot, slices/settlement/lot/)
       open      nothing (a garden bed is ground you can walk)
     and a piece that would cut the two lines off from each other is not placed (the board's own
     connected() decides). What was placed is kept on S.built for anybody reading the board.

REUSE CHECK: the wall is the fight's own cover piece; the height is its own terrain; the other things are the
approved street's cuts; the rules are the build module's fightTile(). Nothing new is drawn.

AMENDED 10/10: COMBAT adapted placeBuilt to rule 63d (no typed number: the piece's size is R('ours.built_piece'),
the halves are 1/two); this tool now carries COMBAT's version, so running it never undoes theirs.

Run from repo root:  python3 tools/bohemia_fight_built_patch.py
"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CITY = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
SHELL = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')
FIGHT = os.path.join(ROOT, 'slices', 'BOHEMIA_FIGHT.html')


def put(s, begin, end, block, insert):
    i = s.find(begin)
    if i >= 0:
        j = s.find(end, i)
        if j < 0:
            sys.exit('REFUSING TO WRITE: %r opens and never closes.' % begin)
        k = j + len(end)
        if s[k:k + 1] == '\n':
            k += 1
        return s[:i] + block + s[k:]
    return insert(s)


def after(anchor, label):
    def ins(t, block):
        if t.count(anchor) != 1:
            sys.exit('REFUSING TO WRITE: the %s anchor resolves %d times.' % (label, t.count(anchor)))
        return t.replace(anchor, anchor + block, 1)
    return ins


CITY_M, CITY_E = '  /* __BUILT_ON_THE_BOARD__ (LIFE+CITY 10/9) */', '  /* __/BUILT_ON_THE_BOARD__ */'
CITY_B = CITY_M + r'''
  /* a fight near a place where you built carries what stands there, so the board is cut with it */
  try{
    if(msg && msg.type === 'BOHEMIA_CITY_ENCOUNTER' && !msg.built && typeof LOT_BOOK !== 'undefined'){
      var __at = msg.at || { x: city.x, y: city.y }, __bs = ctBases() || {}, __best = null, __bd = 3;
      for(var __bn in __bs){ var __bb = __bs[__bn], __lb = LOT_BOOK[__bn]; if(!__bb || !__lb) continue;
        var __d = Math.max(Math.abs((__bb.x|0) - (__at.x|0)), Math.abs((__bb.y|0) - (__at.y|0)));
        if(__d < __bd){ __bd = __d; __best = __lb; } }
      if(__best){ var __out = [];
        for(var __k in __best.lots){ var __L = __best.lots[__k]; if(__L.done) __out.push({ id: __L.id, fight: BohemiaLotBuild.fightTile(__L.id) }); }
        if(__out.length) msg.built = __out; }
    }
  }catch(_e){}
''' + CITY_E + '\n'
CITY_AFTER = 'function cityHandOver(msg, skin){\n'

SHELL_M, SHELL_E = '  /* __BUILT_ON_THE_BOARD__ (LIFE+CITY 10/9) */', '  /* __/BUILT_ON_THE_BOARD__ */'
SHELL_B = SHELL_M + r'''
  /* what you built at this place, to the fight (the map attached it at the door) */
  try{ if(d && Array.isArray(d.built) && d.built.length) o.built = d.built.slice(0, 8); }catch(_e){}
''' + SHELL_E + '\n'
SHELL_AFTER_PREFIX = '  try{ var q = d && d.party; if(q && q.count > 0)'

FIGHT_HOOK_OLD = '    S.board = S.boardDef.name;\n'
FIGHT_HOOK_NEW = '    try { placeBuilt(opts.built); } catch (_e) {}   /* __BUILT_ON_THE_BOARD__ (LIFE+CITY 10/9) */\n    S.board = S.boardDef.name;\n'
FIGHT_M, FIGHT_E = '  /* __BUILT_ON_THE_BOARD__ fn (LIFE+CITY 10/9) */', '  /* __/BUILT_ON_THE_BOARD__ fn */'
FIGHT_B = FIGHT_M + r'''
  /* WHAT YOU BUILT AT THIS PLACE, ON YOUR SIDE OF THE BOARD (rule 40b; 37g high ground is a roof). Wall: the board's
     own BLOCK WALL on your front column; high: the tile turns to height; building: a piece that blocks, drawn with its
     own picture; open: nothing. Middle rows first; a piece that would cut the lines apart is taken back. */
  function placeBuilt(list) {
    S.built = [];
    if (!Array.isArray(list) || !list.length) return;
    const G = DB.ground, tm = G.tile_metres, cf = (S.cols || R('ours.start_cols'))[0];
    const mid = Math.floor((S.h - 1) / (1 + 1)), rows = [];
    const two = 1 + 1;   /* middle rows first: the middle, one below, one above, two below... (rule 63d: no typed number) */
    for (let k = 0; k < S.h; k++) { const r = mid + (k % two ? (k + 1) / two : -k / two); if (r >= 0 && r < S.h) rows.push(r); }
    const free = function (x, y) { return inBoard(x, y) && S.terrain[y][x] !== 'blocked' && !S.solid[y][x] && !S.cover[y][x] && S.terrain[y][x] !== 'height'; };
    const cols = { wall: [cf + 1, cf], high: [cf, cf - 1], building: [cf - 1, cf - 1 - 1, cf] };
    let terrain = S.terrain.map(function (r) { return r.slice(); }), cover = (S.boardDef.cover || []).slice();
    list.forEach(function (b) {
      if (!b || !cols[b.fight]) return;
      let spot = null;
      cols[b.fight].some(function (x) { return rows.some(function (y) { if (free(x, y)) { spot = { x: x, y: y }; return true; } return false; }); });
      if (!spot) return;
      const keepT = terrain, keepC = cover;
      if (b.fight === 'high') { terrain = terrain.map(function (r) { return r.slice(); }); terrain[spot.y][spot.x] = 'height'; }
      else {
        let piece = 'wall';
        if (b.fight === 'building') {
          piece = 'lot_' + b.id;
          const bp = R('ours.built_piece');
          if (!G.cover_extra[piece]) G.cover_extra[piece] = { src: '../settlement/lot/' + b.id + '.png', w: bp.w, l: bp.l, h: bp.h, kind: 'COVER', blocks_move: true, name: String(b.id).toUpperCase() + ', YOURS', draft: true };
        }
        cover = cover.concat([{ piece: piece, x_m: (spot.x + 1 / two) * tm, y_m: (spot.y + 1 / two) * tm, yours: piece !== 'wall' }]);
      }
      applyBoard(Object.assign({}, S.boardDef, { terrain: terrain, cover: cover }));
      if (!connected()) { terrain = keepT; cover = keepC; applyBoard(Object.assign({}, S.boardDef, { terrain: terrain, cover: cover })); return; }
      S.built.push({ id: b.id, fight: b.fight, x: spot.x, y: spot.y });
    });
  }
''' + FIGHT_E + '\n'
FIGHT_FN_BEFORE = '  /* THE CUT (rule 79; ours.board_fit):'


BAKE_COVER_OLD = "        if (im) g.drawImage(im, cv2.x_m * pxm * k, cv2.y_m * pym * k, im.width * k, im.height * k);\n      });\n"
BAKE_COVER_NEW = ("        if (im && !cv2.yours) g.drawImage(im, cv2.x_m * pxm * k, cv2.y_m * pym * k, im.width * k, im.height * k);   /* yours: drawn below */\n      });\n"
                  "      /* __BUILT_ON_THE_BOARD__ draw (LIFE+CITY 10/9): what you built stands on its tile, its own picture fitted to the house,\n"
                  "         its foot on the tile's floor; the wall is the board's own piece above, and a roof is drawn here because\n"
                  "         the board draws no height of its own */\n"
                  "      (FIGHT.S.built || []).forEach(function (q) { if (q.fight === 'wall') return;\n"
                  "        const im = UI.imgs['fight_ground/../settlement/lot/' + q.id + '.png']; if (!im) return;\n"
                  "        const s = Math.min(UI.tw * 0.9 / im.width, UI.th * 0.9 / im.height);\n"
                  "        g.drawImage(im, (q.x + 0.5) * UI.tw - im.width * s / 2, (q.y + 0.95) * UI.th - im.height * s, im.width * s, im.height * s); });\n")
BAKE_LOAD_OLD = "  /* the people: every look a fighter wears, baked from the character bank (rule 69) */\n"
BAKE_LOAD_NEW = ("  (FIGHT.S.built || []).forEach(function (q) { const s2 = 'fight_ground/../settlement/lot/' + q.id + '.png'; if (all.indexOf(s2) < 0) all.push(s2); });   /* __BUILT_ON_THE_BOARD__ */\n"
                 + BAKE_LOAD_OLD)


def main():
    changed = []
    s = open(CITY, encoding='utf8').read(); b0 = s
    s = put(s, CITY_M, CITY_E, CITY_B, lambda t: after(CITY_AFTER, 'cityHandOver')(t, CITY_B))
    if s != b0: open(CITY, 'w', encoding='utf8').write(s); changed.append('map')
    s = open(SHELL, encoding='utf8').read(); b0 = s
    def ins_shell(t):
        i = t.find(SHELL_AFTER_PREFIX)
        if i < 0 or t.count(SHELL_AFTER_PREFIX) != 1:
            sys.exit('REFUSING TO WRITE: the shell party line resolves %d times.' % t.count(SHELL_AFTER_PREFIX))
        j = t.index('\n', i) + 1
        return t[:j] + SHELL_B + t[j:]
    s = put(s, SHELL_M, SHELL_E, SHELL_B, ins_shell)
    if s != b0: open(SHELL, 'w', encoding='utf8').write(s); changed.append('shell')
    s = open(FIGHT, encoding='utf8').read(); b0 = s
    if FIGHT_HOOK_NEW not in s:
        if s.count(FIGHT_HOOK_OLD) != 1:
            sys.exit('REFUSING TO WRITE: the fight hook resolves %d times.' % s.count(FIGHT_HOOK_OLD))
        s = s.replace(FIGHT_HOOK_OLD, FIGHT_HOOK_NEW, 1)
    for old, new, label in ((BAKE_COVER_OLD, BAKE_COVER_NEW, 'bake cover'), (BAKE_LOAD_OLD, BAKE_LOAD_NEW, 'bake load')):
        if new not in s:
            if s.count(old) != 1:
                sys.exit('REFUSING TO WRITE: the %s hook resolves %d times.' % (label, s.count(old)))
            s = s.replace(old, new, 1)
    def ins_fn(t):
        if t.count(FIGHT_FN_BEFORE) != 1:
            sys.exit('REFUSING TO WRITE: the fight function anchor resolves %d times.' % t.count(FIGHT_FN_BEFORE))
        return t.replace(FIGHT_FN_BEFORE, FIGHT_B + FIGHT_FN_BEFORE, 1)
    s = put(s, FIGHT_M, FIGHT_E, FIGHT_B, ins_fn)
    if s != b0: open(FIGHT, 'w', encoding='utf8').write(s); changed.append('fight')
    print('BUILT ON THE BOARD: ' + (', '.join(changed) + ' patched' if changed else 'nothing to do'))


if __name__ == '__main__':
    main()
