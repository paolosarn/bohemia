#!/usr/bin/env python3
"""BOHEMIA — THE LIVING MAP, PUT ON THE MAP (10/9/26, LIFE + CITY, row [the living map]).

Puts engine/bohemia_livingmap.js into the city page (slices/BOHEMIA_CITY_WORLD.html, the alpha's map)
and makes four small, marked changes. Idempotent: every change is found by its marker and rewritten,
never stacked; every anchor must resolve exactly once or nothing is written.

  1. THE MODULE is inlined right after WORLD's parties module, between its own markers.
  2. THE STEP: partiesAdvance() still carries the fraction (RUN's 9/29 fix, untouched) but hands each
     whole step to the living map, which calls WORLD's advance and then settles who stands where
     (NOBODY STANDS ON ANYBODY), and leaves one print per step with the hour it was made.
     If the module is missing, WORLD's advance runs exactly as before.
  3. THE PRINTS: the [tracks read] drawing draws the living map's prints instead of the derived leg,
     each fading by the hour (gone a day later); in the faction's own ink, exactly as before.
  4. THE GATE: every home base on the map draws the crowd at its gate, its size from the living
     map's crowdAt() -- the settlement screen's own market-day roll on the map's own day.
  6. (10/9, [build on the screen]) the open message also says whether the place is YOURS (your outfit's
     own base: BohemiaBetween.mine()) and the map's day, so the settlement's build lot knows both.
  5. THE PLACE IT OPENS: when he taps a town, the settlement screen is handed the traits the map is
     showing (the screen's own `traits` seam, RUN TWO's design), so the crowd he saw at the gate and
     the market he walks into are the same market. Nothing in RUN TWO's page changes.

Run from repo root:  python3 tools/bohemia_city_livingmap_patch.py
"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CITY = os.path.join(ROOT, 'slices', 'BOHEMIA_CITY_WORLD.html')
MOD = os.path.join(ROOT, 'engine', 'bohemia_livingmap.js')
BEGIN, END = '/* ==== engine/bohemia_livingmap.js ==== */', '/* ==== /engine/bohemia_livingmap.js ==== */'
AFTER = '/* ==== /engine/bohemia_parties.js ==== */\n'

GLUE_MARK = '/* __THE_LIVING_MAP__ glue (LIFE+CITY 10/9) */'
GLUE_END = '/* __/THE_LIVING_MAP__ glue */'
GLUE = GLUE_MARK + r'''
/* THE LIVING MAP'S STATE ON THIS PAGE. Transient, never saved: prints after a reload start fresh (the
   module's header says why). The traits file is the settlement screen's own (records/target). */
var LIVING_MAP = { st: null, traits: null };
try{ fetch('../records/target/settlement_traits.json').then(function(r){ return r.json(); }).then(function(j){ LIVING_MAP.traits = j; }).catch(function(){}); }catch(_e){}
function livingMapOn(){ return typeof BohemiaLivingMap !== 'undefined' && !!BohemiaLivingMap; }
function livingMapHour(){ try{ return (DAY.day|0) * 24 + (DAY.min|0) / 60; }catch(_e){ return 0; } }
function livingMapState(){ if(!LIVING_MAP.st && livingMapOn()) LIVING_MAP.st = BohemiaLivingMap.make(); return LIVING_MAP.st; }
/* n whole steps of the valley's business, settled so nobody stands on anybody, printed at this hour */
function livingMapSteps(ps, n){
  var st = livingMapState(); if(!st) throw new Error('no living map');
  var seats = null; try{ seats = turfSeats(); }catch(_e){ seats = null; }
  var h = livingMapHour();
  var arr = [];
  for(var i = 0; i < n; i++){ var r = BohemiaLivingMap.step(ps, seats || [], st, h); if(r && r.arrived) arr = arr.concat(r.arrived); }
  BohemiaLivingMap.prune(st, h);
  /* who got where: a crew at a base you hold opens a raid ([a raid on your base], LIFE+CITY 10/9) */
  if(arr.length && typeof raidArrivals === 'function'){ try{ raidArrivals(arr); }catch(_e){} }
}
/* the crowd at a place's gate today, and the traits it is showing (null until the file is in) */
function livingMapCrowd(name, tier){
  if(!livingMapOn() || !LIVING_MAP.traits) return null;
  try{ return BohemiaLivingMap.crowdAt(LIVING_MAP.traits, { name: name, tier: tier }, (typeof loopDay === 'function') ? loopDay() : 0); }catch(_e){ return null; }
}
''' + GLUE_END + '\n'
GLUE_BEFORE = 'var PARTIES_TODAY=[], PARTIES_LEG={}, PARTIES_CARRY=0;\n'

STEP_OLD = '    try{ BohemiaParties.advance(ps, 1, __whole); }catch(_e){}'
STEP_NEW = ('    /* __THE_LIVING_MAP__: settled so nobody stands on anybody, and printed; WORLD\'s step if it is missing */\n'
            '    try{ livingMapSteps(ps, __whole); }catch(_e){ try{ BohemiaParties.advance(ps, 1, __whole); }catch(_e2){} }')

TRK_OLD = '        var __pl = partiesAll() || [];'
TRK_NEW = ('        /* __THE_LIVING_MAP__: the prints below replace the derived leg; this one stands down */\n'
           '        var __pl = (livingMapOn() && LIVING_MAP.st) ? [] : (partiesAll() || []);')
PRINTS_MARK = '      /* __THE_LIVING_MAP__ prints (LIFE+CITY 10/9) */'
PRINTS_END = '      /* __/THE_LIVING_MAP__ prints */'
PRINTS = PRINTS_MARK + r'''
      /* "LEAVE TRACKS THAT FADE BY THE HOUR". Each print is one step a party took off a town, with the
         hour it was made; it reads full the hour it was made and is gone a day later. The ink is the
         faction's own (colour is territory), brighter for your own people, as the leg drawing was. */
      try {
        if (livingMapOn() && LIVING_MAP.st && LIVING_MAP.st.prints.length) {
          var __lh = livingMapHour(), __lk = {}, __ln = 0;
          g.save(); g.lineCap = 'round';
          for (var __li = 0; __li < LIVING_MAP.st.prints.length; __li++) {
            var __pr = LIVING_MAP.st.prints[__li], __fd = BohemiaLivingMap.fadeOf(__pr, __lh);
            if (__fd <= 0) continue;
            var __la = iso(__pr.x, __pr.y, ox, oy);
            if (__la.sx < -60 || __la.sx > CVW + 60 || __la.sy < -60 || __la.sy > CVH + 60) continue;
            var __lb = iso(__pr.x + __pr.dx * 0.8, __pr.y + __pr.dy * 0.8, ox, oy);
            var __lm = !!(__tm && __tn(__pr.f) === __tn(__tm));
            g.strokeStyle = __holderInk(__pr.f, __lm);
            g.globalAlpha = __fd * (__lm ? 0.85 : 0.6);
            g.lineWidth = Math.max(1, Math.min(TW * 0.06, 2)) * (0.6 + __fd * 0.7);
            g.beginPath(); g.moveTo(__la.sx, __la.sy + TH / 2); g.lineTo(__lb.sx, __lb.sy + TH / 2); g.stroke();
            __lk[__pr.f] = g.strokeStyle; __ln++;
          }
          g.restore(); g.globalAlpha = 1;
          try { window.__TRACK_INK = __lk; window.__PRINTS_DRAWN = __ln; } catch(_e4){}
        }
      } catch(_e4){}
''' + PRINTS_END + '\n'
PRINTS_BEFORE = '      /* ==== __THE_MAP_HAS_NEVER_DRAWN_THE_LIGHTS__ (9/13, [rent visible]) ====='

BASE_OLD = '        var __ps = mapBaseDraw(__tier, __n, __p.sx, __cy + 6, __is, mapArtBeat());'
CROWD_MARK = '        /* __THE_LIVING_MAP__ gate crowd (LIFE+CITY 10/9) */'
CROWD_END = '        /* __/THE_LIVING_MAP__ gate crowd */'
CROWD = CROWD_MARK + r'''
        /* THE CROWD AT THE GATE: the tier's ordinary business, swelled on market day and thinned by a
           raid or a sickness, by the same multiplier that fills the stalls; standing in front of the
           place, each on its own beat, so a market day reads from across the map. */
        try {
          var __gc = livingMapCrowd(__n, __tier);
          if (__gc && __gc.count > 0 && mapCastOf(0)) {
            var __gh = mapHash(String(__n).length * 17, (__b.x | 0) * 31 + (__b.y | 0));
            var __gsp = 6 * MAP_PEOPLE_K, __faces = ['S', 'SE', 'SW'];
            for (var __gi = 0; __gi < __gc.count; __gi++) {
              var __gx = __p.sx + (__gi - (__gc.count - 1) / 2) * __gsp;
              var __gy = __cy + 6 + (5 + (__gi % 2) * 3) * MAP_PEOPLE_K;
              mapPersonDraw(mapCastOf(__gh + __gi * 7), __faces[(__gh + __gi) % 3], mapArtBeat() + __gi, __gx, __gy);
            }
            try { MAP_DREW.gateCrowd = MAP_DREW.gateCrowd || {}; MAP_DREW.gateCrowd[__n] = { count: __gc.count, market: __gc.market, traits: __gc.traits }; } catch (_e5) {}
          }
        } catch (_e5) {}
''' + CROWD_END + '\n'

OPEN_OLD = "    batteries: loopBats(), contracts: LOOP.held.map(function(c){ return c.id; }), hired: {} }, '*'); }catch(_e){}"
OPEN_PREV = ("    batteries: loopBats(), contracts: LOOP.held.map(function(c){ return c.id; }), hired: {},\n"
            "    /* __THE_LIVING_MAP__: the traits the map is showing at this gate, so the market he saw is the market he walks into */\n"
            "    traits: (function(){ var c = livingMapCrowd(t.name, t.tier); return c ? c.traits : undefined; })() }, '*'); }catch(_e){}")
OPEN_NEW = ("    batteries: loopBats(), contracts: LOOP.held.map(function(c){ return c.id; }), hired: {},\n"
            "    /* __THE_LIVING_MAP__: the traits the map is showing at this gate, so the market he saw is the market he walks into */\n"
            "    traits: (function(){ var c = livingMapCrowd(t.name, t.tier); return c ? c.traits : undefined; })(),\n"
            "    /* __BUILD_ON_THE_SCREEN__ (LIFE+CITY 10/9): whether this place is yours (your outfit's own base, rule 43), and the map's day */\n"
            "    held: (function(){ try{ if(typeof lotIsMine === 'function') return lotIsMine(t.name); var m = BohemiaBetween.mine(), n = function(v){ return String(v||'').toUpperCase().replace(/[\\s_]/g,''); };\n"
            "             return !!m && n(m) === n(t.name); }catch(_e2){ return false; } })(),\n"
            "    day: loopDay() }, '*'); }catch(_e){}")


def cut(s, begin, end):
    i = s.find(begin)
    if i < 0:
        return s
    j = s.find(end, i)
    if j < 0:
        sys.exit('REFUSING TO WRITE: %r opens and never closes.' % begin)
    k = j + len(end)
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


def once(s, anchor, label):
    n = s.count(anchor)
    if n != 1:
        sys.exit('REFUSING TO WRITE: the %s anchor resolves %d times, not 1.' % (label, n))


def main():
    s = open(CITY, encoding='utf8').read()
    before = s
    body = open(MOD, encoding='utf8').read().rstrip('\n')
    if '</' in body:
        sys.exit('REFUSING TO WRITE: the module would close the script tag.')
    def ins_mod(t):
        once(t, AFTER, 'parties module end'); return t.replace(AFTER, AFTER + BEGIN + '\n' + body + '\n' + END + '\n', 1)
    s = put(s, BEGIN, END, BEGIN + '\n' + body + '\n' + END + '\n', ins_mod)
    def ins_glue(t):
        once(t, GLUE_BEFORE, 'parties state'); return t.replace(GLUE_BEFORE, GLUE + GLUE_BEFORE, 1)
    s = put(s, GLUE_MARK, GLUE_END, GLUE, ins_glue)
    if STEP_NEW not in s:
        once(s, STEP_OLD, 'party step')
        s = s.replace(STEP_OLD, STEP_NEW, 1)
    if TRK_NEW not in s:
        once(s, TRK_OLD, 'track list')
        s = s.replace(TRK_OLD, TRK_NEW, 1)
    def ins_prints(t):
        once(t, PRINTS_BEFORE, 'after the tracks'); return t.replace(PRINTS_BEFORE, PRINTS + PRINTS_BEFORE, 1)
    s = put(s, PRINTS_MARK, PRINTS_END, PRINTS, ins_prints)
    def ins_crowd(t):
        once(t, BASE_OLD, 'home base draw'); i = t.index(BASE_OLD)
        j = t.index('        __r = Math.max(__r, __ps.height - 4);', i); return t[:j] + CROWD + t[j:]
    s = put(s, CROWD_MARK, CROWD_END, CROWD, ins_crowd)
    if OPEN_NEW not in s:
        # the open message's tail is ours from its batteries line to its close: rewrite that span, whatever version is there
        a = s.find("    batteries: loopBats(), contracts: LOOP.held.map(function(c){ return c.id; }), hired: {}")
        if a < 0 or s.count("    batteries: loopBats(), contracts: LOOP.held.map(function(c){ return c.id; }), hired: {}") != 1:
            sys.exit('REFUSING TO WRITE: the settlement open anchor resolves %d times, not 1.' % s.count("    batteries: loopBats(), contracts: LOOP.held.map"))
        b = s.index("}, '*'); }catch(_e){}", a) + len("}, '*'); }catch(_e){}")
        s = s[:a] + OPEN_NEW + s[b:]
    if s == before:
        print('THE LIVING MAP: nothing to do')
        return
    open(CITY, 'w', encoding='utf8').write(s)
    print('THE LIVING MAP: module inlined, step settled, prints fade by the hour, gate crowds drawn, traits handed to the settlement')


if __name__ == '__main__':
    main()
