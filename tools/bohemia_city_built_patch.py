#!/usr/bin/env python3
"""BOHEMIA — BUILT ON THE MAP (10/9/26, LIFE + CITY, row [built on the map]).

Rule 40b: "what is built shows on the map, on the fight board, and in the derived future". [build on the
screen] put the build list on RUN TWO's settlement screen, but the screen kept its OWN ledger per place:
the map's century ledger (what the derive reads for acts 2 and 3) never heard a build, the map drew
nothing at your base, and what a thing makes landed in the screen's purse, not the map's.

THE MAP OWNS THE LOTS NOW. This patch (idempotent, every block marked, every anchor resolved once):
  1. inlines engine/bohemia_homebases.js and engine/bohemia_lotbuild.js beside the century module;
  2. keeps LOT_BOOK, one build site per place, on the map, and lotBookFor(name) hands the SAME object to
     the settlement screen (same origin, the screen asks window.parent), so there is one truth;
  3. on the day loop's own wake beat (DAY.on('wake'), never a second timer) ticks every site with the
     map's purse, the map's century ledger (centuryGet(), the one the derive reads) and the map's day;
     whose ground is the map's own answer (your outfit's base, BohemiaBetween.mine()), written as
     FACTIONS' ledger for the module to ask;
  4. saves and restores the lots with the century (the save's own literal and its own restore);
  5. draws what stands at the base on the map, from the same cut sprites the screen draws
     (slices/settlement/lot/), small, on the base's west side, scaled with the map's people.

REUSE CHECK: the module is this lane's gated engine/bohemia_lotbuild.js; the ledger is the map's own
century (centuryGet); the purse the map's own (purseGet); the beat the day loop's own; the art the
approved street's own pieces. Nothing new is drawn.

Run from repo root:  python3 tools/bohemia_city_built_patch.py
"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CITY = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
MODS = ['bohemia_homebases', 'bohemia_lotbuild']
AFTER = '/* ==== /engine/bohemia_livingmap.js ==== */\n'

GLUE_MARK, GLUE_END = '/* __BUILT_ON_THE_MAP__ (LIFE+CITY 10/9) */', '/* __/BUILT_ON_THE_MAP__ */'
GLUE = GLUE_MARK + r'''
/* THE MAP OWNS THE BUILD LOTS. One site per place; the settlement screen is handed the same object
   (lotBookFor), so what he builds there IS the map's. var-hoisted on purpose: the save's restore may run
   before this line, and must not have its lots wiped by it. */
var LOT_BOOK = LOT_BOOK || {};
function lotIsMine(name){
  try{ var m = BohemiaBetween.mine(), n = function(v){ return String(v||'').toUpperCase().replace(/[\s_]/g,''); };
       return !!m && n(m) === n(name); }catch(_e){ return false; }
}
function lotHoldFor(name){
  var H = BohemiaHomeBases, rec = H.make({ act: 1 });
  if(lotIsMine(name)) H.took(rec, { base: name, to: H.YOU });
  return { rec: rec, act: 1 };
}
function lotBookFor(name){
  if(!LOT_BOOK[name]) LOT_BOOK[name] = BohemiaLotBuild.site({ base: name });
  return LOT_BOOK[name];
}
/* THE MORNING: what was started stands, what stands pays, into the map's purse and the map's century */
function lotWake(){
  var done = 0;
  for(var n in LOT_BOOK){
    try{ var r = BohemiaLotBuild.tick(LOT_BOOK[n], purseGet(), centuryGet(), DAY.day, lotHoldFor(n));
         done += (r && r.finished) ? r.finished.length : 0; }catch(_e){}
  }
  window.__LOTS_FINISHED = (window.__LOTS_FINISHED || 0) + done;
  return done;
}
DAY.on('wake', function(){ try{ lotWake(); }catch(_e){} });
window.lotBookFor = lotBookFor; window.lotWake = lotWake; window.lotIsMine = lotIsMine;
/* the built things' pictures, the same cuts the settlement screen stands on its lots */
var LOT_SPR = {};
function lotSprite(id){
  if(!LOT_SPR[id]){ var im = new Image(); im.src = 'settlement/lot/' + id + '.png'; LOT_SPR[id] = im; }
  var s = LOT_SPR[id]; return (s.complete && s.naturalWidth) ? s : null;
}
''' + GLUE_END + '\n'
GLUE_BEFORE = '/* THE WAKE BEAT ITSELF. DAY.on(\'wake\') is the day loop\'s own hook, so this fires'

SAVE_OLD = "    century:(function(){ try{ return BohemiaCentury.save(centuryGet()); }catch(_e){ return null; } })(),\n"
SAVE_NEW = SAVE_OLD + ("    /* __BUILT_ON_THE_MAP__: the build lots ride with the century they write into */\n"
                       "    lots:(function(){ try{ var o = {}; for(var n in LOT_BOOK) o[n] = JSON.parse(BohemiaLotBuild.save(LOT_BOOK[n])); return o; }catch(_e){ return null; } })(),\n")
LOAD_OLD = "  if(st.century){ try{ CENTURY=BohemiaCentury.load(st.century); }catch(_e){} }\n"
LOAD_NEW = LOAD_OLD + ("  /* __BUILT_ON_THE_MAP__ */\n"
                       "  if(st.lots){ try{ for(var __ln in st.lots){ var __ls = BohemiaLotBuild.load(JSON.stringify(st.lots[__ln])); if(__ls) LOT_BOOK[__ln] = __ls; } }catch(_e){} }\n")

DRAW_MARK, DRAW_END = '        /* __BUILT_ON_THE_MAP__ at the base (LIFE+CITY 10/9) */', '        /* __/BUILT_ON_THE_MAP__ at the base */'
DRAW = DRAW_MARK + r'''
        /* WHAT YOU BUILT, AT YOUR BASE: what stands on its lots, on its west side, nearest first, at
           the map people's scale; going up is faint, as on the screen. */
        try { MAP_DREW.baseAt = MAP_DREW.baseAt || {}; MAP_DREW.baseAt[__n] = { sx: __p.sx, cy: __cy }; } catch (_e8) {}   /* where a base sits on the glass, for a probe to point at */
        try {
          var __lb = LOT_BOOK && LOT_BOOK[__n], __lk = 0;
          if (__lb) {
            /* on the base's west side, nearest first, so the party's own flag on the east is never covered */
            var __lx0 = __p.sx - 16 * MAP_PEOPLE_K, __lfy = __cy + 6 + 2 * MAP_PEOPLE_K;
            for (var __lkey in __lb.lots) {
              var __lot = __lb.lots[__lkey], __im = lotSprite(__lot.id); if (!__im) continue;
              var __lh = 16 * MAP_PEOPLE_K, __lw = __im.naturalWidth * (__lh / __im.naturalHeight);
              if (__lw > 24 * MAP_PEOPLE_K) { __lw = 24 * MAP_PEOPLE_K; __lh = __im.naturalHeight * (__lw / __im.naturalWidth); }
              __lx0 -= __lw;
              g.save(); g.imageSmoothingEnabled = false; g.globalAlpha = __lot.done ? 1 : 0.4;
              g.drawImage(__im, mapSnap(__lx0), mapSnap(__lfy - __lh), __lw, __lh); g.restore();
              __lx0 -= 3 * MAP_PEOPLE_K; __lk++;
            }
            try { MAP_DREW.built = MAP_DREW.built || {}; MAP_DREW.built[__n] = __lk; } catch (_e7) {}
          }
        } catch (_e7) {}
''' + DRAW_END + '\n'
DRAW_BEFORE = '        __r = Math.max(__r, __ps.height - 4);      /* the name plate sits above the building */'


def cut(s, b, e):
    i = s.find(b)
    if i < 0:
        return s
    j = s.find(e, i)
    if j < 0:
        sys.exit('REFUSING TO WRITE: %r opens and never closes.' % b)
    k = j + len(e)
    if s[k:k + 1] == '\n':
        k += 1
    return s[:i] + s[k:]


def put(s, begin, end, block, insert):
    """A marked block that already exists is rewritten IN PLACE (so two patches that both anchor near the
    same line never swap places run after run); a missing one is inserted by `insert`."""
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


def once(s, a, label):
    if s.count(a) != 1:
        sys.exit('REFUSING TO WRITE: the %s anchor resolves %d times.' % (label, s.count(a)))


def main():
    s = open(CITY, encoding='utf8').read()
    before = s
    for m in MODS:
        b, e = '/* ==== engine/%s.js ==== */' % m, '/* ==== /engine/%s.js ==== */' % m
        body = open(os.path.join(ROOT, 'engine', m + '.js'), encoding='utf8').read().rstrip('\n')
        if '</' in body:
            sys.exit('REFUSING TO WRITE: %s would close the script tag.' % m)
        blk = '%s\n%s\n%s\n' % (b, body, e)
        def ins_mod(t, blk=blk):
            once(t, AFTER, 'living map module end'); return t.replace(AFTER, AFTER + blk, 1)
        s = put(s, b, e, blk, ins_mod)
    def ins_glue(t):
        once(t, GLUE_BEFORE, 'the wake beat'); return t.replace(GLUE_BEFORE, GLUE + GLUE_BEFORE, 1)
    s = put(s, GLUE_MARK, GLUE_END, GLUE, ins_glue)
    if SAVE_NEW not in s:
        once(s, SAVE_OLD, 'the save')
        s = s.replace(SAVE_OLD, SAVE_NEW, 1)
    if LOAD_NEW not in s:
        once(s, LOAD_OLD, 'the restore')
        s = s.replace(LOAD_OLD, LOAD_NEW, 1)
    def ins_draw(t):
        once(t, DRAW_BEFORE, 'the base plate'); return t.replace(DRAW_BEFORE, DRAW + DRAW_BEFORE, 1)
    s = put(s, DRAW_MARK, DRAW_END, DRAW, ins_draw)
    if s == before:
        print('BUILT ON THE MAP: nothing to do')
        return
    open(CITY, 'w', encoding='utf8').write(s)
    print('BUILT ON THE MAP: the map owns the lots, ticks them on the wake beat, saves them and draws them at the base')


if __name__ == '__main__':
    main()
