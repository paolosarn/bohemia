#!/usr/bin/env python3
"""
BOHEMIA CITY GROUND PATCH -- YOU CAN OPEN THE MAP OF THE VALLEY AND IT DOES NOT
SHOW YOU WHOSE GROUND IS WHOSE.  (8/27/26, FACTIONS lane)

Patches slices/BOHEMIA_CITY_WORLD.html. Idempotent; marker __CITY_GROUND__.

--------------------------------------------------------------------------
THE HOLE, AND IT IS THE MISSING HALF OF YESTERDAY'S FIX
--------------------------------------------------------------------------
Yesterday the OUTFIT board learned to say COLORFUL, NORTHWEST, A LONG WAY OFF,
and what they want and what they pay. That is a bearing, and a bearing is the
right shape for a thing a person carries in their head.

BUT A BEARING YOU HAVE TO MEMORISE IS NOT NAVIGATION ACROSS TWENTY NINE CELLS.
The open-world literature's working middle -- "see something in the distance,
travel toward it, spot the next thing from there" -- ASSUMES YOU CAN SEE IT. In
a top-down valley 3,712 tiles wide you cannot. Close the board and you have
nothing but a remembered compass word.

And the game already has the surface that solves it: the ⤢ WHOLE MAP view.
MEASURED: renderCity() does not call ctBases() ONCE. Every ctBases() call in
this file sits in the faction code between lines 43160 and 44166. You can open
the map of the entire valley and there is no indication that anybody holds any
of it.

WHICH CONTRADICTS THIS GAME'S OWN CANON. LIGHT=TERRITORY. CLUSTERED POWER --
12% lit, OWNED, the network eerily perfect. NOBODY PATROLS THE DARK. Territory
in Bohemia is a thing you can SEE, by construction. The map was the one place
that never said so.

--------------------------------------------------------------------------
WHAT THIS IS NOT
--------------------------------------------------------------------------
MAP LAW: Claude never designs map layouts. NOTHING IS PLACED HERE. Every
position drawn is one bohemia_loop.boot() already decided and the city already
baked; this reads ctBases() and marks what is there. If Paolo moves a base
tomorrow the map follows without a line changing.

AND IT IS NOT A HUD PIN. It does not follow the player, it does not point at a
quest, and there is no arrow on the walking screen. It is a map you choose to
open, showing a fact about the world that is true whether or not you are
looking. That is the distinction the research draws between signposting and
waypoint-marker design, and it is the same one the board already respects.

--------------------------------------------------------------------------
IT COMPOSES WITH THE GUARD FIXED THIS MORNING
--------------------------------------------------------------------------
ctBases() now returns null when the world has been rerolled out from under the
bake. So the map stops claiming territory in a valley the bases no longer
describe, for free, because it asks the same question everything else asks.
One organ, one answer.

--------------------------------------------------------------------------
ZOOM DECIDES HOW MUCH IT SAYS
--------------------------------------------------------------------------
Fourteen labels on a 96x96 map at full zoom-out is a wall of text. So the
ground is always marked and the NAME only appears once the tiles are big
enough to hold it. Zoomed out you see how the valley is carved up; zoomed in
you see who by. Nothing is hidden that was not unreadable anyway.
"""
import os
import sys

CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARKER = '__CITY_GROUND__'

ANCHOR = """  // THE MARKER (you)
  { const p=iso(city.x,city.y,ox,oy);"""

GROUND = """  /* ==== """ + MARKER + """ -- WHOSE GROUND IS WHOSE ======================
     MEASURED FIRST: renderCity() did not call ctBases() once. Every call in
     this file sat in the faction code, so you could open the map of the whole
     valley and nothing on it said that anybody held any of it -- while the
     canon says LIGHT=TERRITORY, CLUSTERED POWER, OWNED, and nobody patrols the
     dark. Territory here is a thing you can SEE by construction, and the map
     was the one place that never admitted it.

     MAP LAW: NOTHING IS PLACED HERE. Every position is one the run's own boot
     decided and the city baked. This marks what is already there.

     NOT A HUD PIN: it does not follow him, it is not on the walking screen,
     and it points at no quest. A map he chooses to open, showing a fact that
     is true whether or not he is looking.

     AND IT ASKS ctBases(), so after a reroll it correctly shows no territory
     rather than confidently drawing the last valley's borders over this one.
     One organ, one answer. */
  try {
    var __gb = (typeof ctBases === 'function') ? ctBases() : null;
    if(__gb){
      var __mine = null;
      try { if(typeof BohemiaBetween !== 'undefined') __mine = BohemiaBetween.mine(); }
      catch(_e){}
      var __norm = function(v){ return String(v||'').toUpperCase().replace(/[\\s_]/g,''); };
      /* BIG ENOUGH TO READ. Fourteen names on a fully zoomed-out 96x96 is a
         wall of text, so the ground is ALWAYS marked and the name arrives with
         the zoom. Nothing is hidden that was not unreadable anyway. */
      /* *** THE MARKER IS SCREEN-SIZED, NOT TILE-SIZED, AND THE FIRST VERSION
         WAS NOT. *** It drew a diamond TW wide. At the ⤢ WHOLE MAP zoom the
         whole 96x96 valley fits a phone, so TW is 3.74 PIXELS -- measured, on
         the real canvas -- and every marker was a four-pixel smudge on the one
         screen a person opens to plan a walk. It read fine in the source and
         was invisible in the render. VERIFY ON THE REAL SURFACE.
         So the size is clamped in SCREEN pixels: legible zoomed all the way
         out, and it grows with the tiles when you zoom in. */
      var __r = Math.max(4, Math.min(TW * 0.5, 15));
      /* AND WHICH ONES GET A NAME. Fourteen labels on a 350px diamond is a
         wall of text, so names arrive with the zoom -- EXCEPT the two a person
         is actually looking for on a valley map: their own ground, and the
         nearest ground that belongs to anybody. Those are the whole reason the
         map is open. */
      var __near = null, __nd = 1e9;
      for(var __k in __gb){
        var __kb = __gb[__k];
        if(!__kb || __kb.x == null) continue;
        if(__mine && __norm(__k) === __norm(__mine)) continue;
        var __kd = Math.abs(__kb.x - city.x) + Math.abs(__kb.y - city.y);
        if(__kd < __nd){ __nd = __kd; __near = __k; }
      }
      var __named = TW >= 26;
      /* LABELS THAT WOULD SIT ON TOP OF EACH OTHER GET NUDGED UP. Seen on the
         real canvas, not reasoned about: at whole-map zoom CUSTOM and COLORFUL
         are nine cells apart, which is about twenty pixels, and CUSTOM's plate
         painted straight over the front of COLORFUL's name. Two labels drawn
         correctly and one of them unreadable. */
      /* AND THE BOXES IT DREW ARE PUBLISHED, the same way this renderer already
         publishes window.__LAMPQ. Not a side door: it is the render saying what
         it actually did, which is the only way to check that two labels did not
         land on top of each other. Counting coloured pixels near a marker
         cannot -- a neighbour's label is the same colour and gets counted as
         yours, which is exactly how the first version of that claim passed
         while the collision was still in. */
      var __boxes = [];
      var __free = function(x, y, w, h){
        for(var i=0;i<__boxes.length;i++){
          var b=__boxes[i];
          if(x < b.x+b.w && x+w > b.x && y < b.y+b.h && y+h > b.y) return false;
        }
        return true;
      };
      g.save();
      for(var __n in __gb){
        var __b = __gb[__n];
        if(!__b || __b.x == null || __b.y == null) continue;
        var __p = iso(__b.x|0, __b.y|0, ox, oy);
        if(__p.sx < -40 || __p.sx > cv.width+40) continue;
        if(__p.sy < -40 || __p.sy > cv.height+40) continue;
        var __is = !!(__mine && __norm(__n) === __norm(__mine));
        /* YOURS reads differently from theirs, because "that one is mine" is
           the first thing anybody looks for on a map of who holds what. */
        var __col = __is ? '#e8dcc0' : '#c8a558';
        var __cy = __p.sy + TH/2;
        g.globalAlpha = 0.95;
        g.strokeStyle = __col; g.lineWidth = __is ? 2.5 : 1.5;
        g.beginPath();
        g.moveTo(__p.sx, __cy - __r);
        g.lineTo(__p.sx + __r, __cy);
        g.lineTo(__p.sx, __cy + __r);
        g.lineTo(__p.sx - __r, __cy);
        g.closePath(); g.stroke();
        g.globalAlpha = __is ? 0.42 : 0.28;
        g.fillStyle = __col; g.fill();
        if(__named || __is || __norm(__n) === __norm(__near)){
          g.globalAlpha = 1;
          var __t = String(__n).toUpperCase();
          g.font = '700 9px ui-monospace,Menlo,monospace';
          g.textAlign = 'center';
          var __w = g.measureText(__t).width;
          var __lx = __p.sx - __w/2 - 3, __ly = __cy - __r - 13;
          /* up to five nudges of one line each, then give up and draw it --
             a label that never lands is worse than one slightly close. */
          for(var __try=0; __try<5 && !__free(__lx, __ly, __w+6, 11); __try++)
            __ly -= 12;
          __boxes.push({ x:__lx, y:__ly, w:__w+6, h:11 });
          /* A PLATE UNDER THE WORD. The valley floor is a light tan by day and
             the label was unreadable on it -- checked on the real canvas, not
             assumed from the hex. */
          g.fillStyle = 'rgba(12,10,8,0.82)';
          g.fillRect(__lx, __ly, __w + 6, 11);
          g.fillStyle = __col;
          g.fillText(__t, __p.sx, __ly + 8.5);
          /* AND A LEADER BACK TO THE GROUND IT NAMES, once it has been nudged.
             A floating word beside a diamond is ambiguous the moment it moves. */
          if(__ly < __cy - __r - 14){
            g.globalAlpha = 0.5; g.strokeStyle = __col; g.lineWidth = 1;
            g.beginPath(); g.moveTo(__p.sx, __ly + 11); g.lineTo(__p.sx, __cy - __r);
            g.stroke(); g.globalAlpha = 1;
          }
          g.textAlign = 'start';
        }
      }
      g.restore();
      g.globalAlpha = 1;
      window.__GROUNDLABELS = __boxes;
    }
  } catch(_e){}
""" + ANCHOR


def main():
    if not os.path.exists(CITY):
        sys.exit('FAIL: no ' + CITY)
    s = open(CITY, encoding='utf-8').read()
    if MARKER in s:
        print('NOOP: ' + MARKER + ' already present')
        return
    if '__CITY_WHYWALK__' not in s:
        sys.exit('FAIL: run tools/bohemia_city_whywalk_patch.py first -- this '
                 'composes with the ctBases guard it installs')
    if ANCHOR not in s:
        sys.exit('FAIL: could not find the player marker in renderCity')
    if s.count(ANCHOR) != 1:
        sys.exit('FAIL: the player marker anchor is not unique')
    s = s.replace(ANCHOR, GROUND, 1)
    open(CITY, 'w', encoding='utf-8').write(s)
    print('CITY GROUND: the whole-map view shows whose ground is whose')
    print('  TAB: RUN, then ⤢ WHOLE MAP.')


if __name__ == '__main__':
    main()
