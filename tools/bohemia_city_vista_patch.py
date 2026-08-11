#!/usr/bin/env python3
"""
THE VISTA: THE MOUNTAIN OVERLOOK (8/9/26, CITY lane, co-owned with RUN).

Paolo, THE DEMO PLAN row 2, and again 8/9 as demo-critical:
  "you get to see the outlook in the city type shit"
  THE VISTA: the mountain overlook where you SEE the whole valley for the first
  time. THE DEMO'S MONEY SHOT.

THE PLAN'S OWN CONSTRAINT IS THE DESIGN: "the city view machinery already renders
the valley; this is a camera moment + a walkable overlook spur, NOT A NEW
RENDERER." So this patch draws NOTHING new. It:

  1. inlines engine/bohemia_vista.js, which DERIVES the overlook from the map the
     seed already made (MAP LAW: Claude never designs map layouts -- if Paolo ever
     places THE overlook, BohemiaVista.setCanon takes it and the derivation stops),
  2. adds vistaOpen()/vistaClose(): a camera move into the EXISTING isometric
     valley view, framed on the overlook, plus a card naming what you are looking
     at from the survey,
  3. arms it in the walked world: step onto the overlook cell and it fires once,
  4. exposes window.__VISTA so the RUN lane can play it from the day loop and the
     cold open without reaching into this file. That is the co-ownership seam.

WHY IT SAYS WHAT YOU ARE SEEING. A silent map screen is a map screen. The survey
names the real districts in the line of sight, nearest first, and the true distance
off the canon cell size -- so the card reads "the Strip, downtown, four miles of
it" because that is what is actually in front of you, not because it sounds good.

REUSE CHECK: COOKS ZERO PIXELS. It moves an existing camera and calls an existing
renderer.
  opened slices/BOHEMIA_CITY_WORLD.html -> renderCity(), the isometric valley view
    that has drawn this map since 7/6, plus its TW/TH/city camera variables.
  opened engine/bohemia_vista.js -> the derivation. No bank is read and no tile is
    cooked; the vista shows the districts' own hero art already in the view.

Idempotent: re-running when the vista is wired reports NOOP.

  python3 tools/bohemia_city_vista_patch.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(ROOT)

WORLD = 'slices/BOHEMIA_CITY_WORLD.html'
MODULE = 'engine/bohemia_vista.js'
MARK = '/* ==== engine/bohemia_vista.js (inlined verbatim) ==== */'

if not os.path.exists(WORLD):
    sys.exit('VISTA: %s is not here.' % WORLD)
src = open(WORLD, encoding='utf-8').read()
if MARK in src:
    print('the vista is already wired. no-op.')
    sys.exit(0)

mod = open(MODULE, encoding='utf-8').read()

# ---- 1. inline the module, after the overmap it depends on --------------------
ANCHOR = 'let MODE=\'city\';'
i = src.find(ANCHOR)
if i < 0:
    sys.exit('VISTA: could not find the mode declaration to inline before.')
src = src[:i] + MARK + '\n' + mod + '\n' + src[i:]

# ---- 2. the camera moment ----------------------------------------------------
VISTA = r'''
/* ==== THE VISTA (8/9, CITY lane, co-owned with RUN) =========================
   Paolo: "you get to see the outlook in the city type shit". THE DEMO'S MONEY
   SHOT, and by the demo plan's own rule it is a CAMERA MOVE, not a renderer:
   the isometric valley view has drawn this map since 7/6, so the vista points it
   at the overlook and gets out of the way.
   THE OVERLOOK IS DERIVED, NEVER AUTHORED (MAP LAW). BohemiaVista scores every
   mountain cell on the valley rim by what it can actually see, and the winner is
   wherever this seed happened to put the best vantage. ==== */
let VISTA=null;            // {returnTo:{hx,hy,mode}, card, at} while it is open
function vistaWhere(){ try{ return BohemiaVista.overlook(WORLDREF||om); }catch(e){ return null; } }
let WORLDREF=null;
try{ WORLDREF={ seed:om.seed, at:function(x,y){ return om.at(x,y); } }; }catch(e){}

/* the card: what you are looking at, in his words not a stat line */
function vistaCard(s){
  if(!s||!s.districts||!s.districts.length) return 'THE VALLEY';
  const NAME={strip:'the Strip', downtown:'downtown', resort:'the resorts',
    casino:'the casinos', suburb:'the neighbourhoods', estate:'the big houses',
    apartment:'the towers', freeway:'the freeway', arterial:'the boulevards',
    industrial:'the yards', airport:'the airport', solar:'the solar fields',
    farm:'the farms', cemetery:'the cemetery', downtown_:'downtown'};
  const named=s.districts.map(d=>NAME[d]).filter(Boolean).slice(0,3);
  const km=(s.reachM/1000);
  if(!named.length) return 'THE VALLEY · ' + s.cells + ' blocks of it';
  return named.join(', ') + ' · ' + km.toFixed(1) + ' km of it';
}

/* vistaOpen(): stand the camera on the overlook and frame the basin.
   Returns false and changes NOTHING if this seed has no rim vantage -- a moment
   that silently plays on an empty ledge is worse than one that does not play. */
function vistaOpen(){
  if(VISTA) return true;
  let o=null, f=null;
  try{ o=BohemiaVista.overlook(WORLDREF); f=o&&BohemiaVista.framing(WORLDREF,o,cv.width,cv.height); }catch(e){ return false; }
  if(!o||!f) return false;
  VISTA={ returnTo:{hx:hx, hy:hy, mode:MODE}, at:o,
          card:vistaCard(f.survey), survey:f.survey };
  MODE='city'; city.x=f.cx; city.y=f.cy; panX=0;
  /* LIFT THE HORIZON. Dead-centring the look-at left a third of the frame as
     empty sky, which is a screenshot of nothing. A tenth of a screen of pan puts
     the basin where the eye goes and keeps sky above it, which is what an
     overlook actually looks like. */
  panY=-Math.round(cv.height*0.10);
  TW=f.tw; TH=f.th;
  render();
  vistaCardDraw();
  window.__VISTA_OPEN=(window.__VISTA_OPEN||0)+1;
  return true;
}
function vistaClose(){
  if(!VISTA) return false;
  const r=VISTA.returnTo; VISTA=null;
  const el=document.getElementById('vistaCard'); if(el) el.remove();
  hx=r.hx; hy=r.hy; MODE=r.mode;
  TW=18; TH=9;                                   /* the view's own default zoom */
  render();
  return true;
}
/* the card is DOM, not painted into the canvas: the art underneath is the shot,
   and text burned into the frame would be text burned into every screenshot of
   it forever. */
function vistaCardDraw(){
  if(!VISTA) return;
  let el=document.getElementById('vistaCard');
  if(!el){ el=document.createElement('div'); el.id='vistaCard';
    el.style.cssText='position:absolute;left:0;right:0;top:64px;z-index:45;text-align:center;'
      +'pointer-events:none;font:12px ui-monospace,monospace;letter-spacing:2px';
    (document.getElementById('wrap')||document.body).appendChild(el); }
  el.innerHTML='<div style="display:inline-block;background:rgba(12,10,8,.74);border:1px solid #3a3020;'
    +'border-radius:8px;padding:8px 14px;color:#e6d9b8">THE VALLEY<br>'
    +'<span style="color:#c8a848;font-size:11px">'+VISTA.card+'</span></div>';
}

/* ARMED IN THE WALKED WORLD: step onto the overlook and it fires, once.
   Checked on the beat rather than every frame -- it is a cell test, and the 120
   BPM law already gives every lane one tick to hang cheap checks on. */
let VISTA_SEEN=false;
function vistaCheck(){
  if(VISTA||VISTA_SEEN||MODE!=='human') return;
  const o=vistaWhere(); if(!o) return;
  const cx=(hx/FN)|0, cy=(hy/FN)|0;
  if(cx===o.x&&cy===o.y){ VISTA_SEEN=true; vistaOpen(); }
}

/* THE SEAM THE RUN LANE CONSUMES. The vista is demo row 11 and it is co-owned:
   RUN plays it from the day loop and the cold open, CITY owns where it is and
   what it looks like. This is the whole interface, so neither lane has to reach
   into the other's file. */
window.__VISTA={ open:vistaOpen, close:vistaClose, where:vistaWhere,
  isOpen:function(){ return !!VISTA; },
  survey:function(){ try{ return BohemiaVista.survey(WORLDREF, vistaWhere()); }catch(e){ return null; } } };
'''

RH = 'function renderHuman(){'
j = src.find(RH)
if j < 0:
    sys.exit('VISTA: no renderHuman to anchor the camera moment to.')
src = src[:j] + VISTA + '\n' + src[j:]

# ---- 3. arm it on the walk, and let a tap leave it ---------------------------
NEED = '  tpDraw(ox,oy);'
if NEED not in src:
    sys.exit('VISTA: could not find the walked-world draw to arm the check on.')
src = src.replace(NEED, NEED + '\n  vistaCheck();   /* __THE_VISTA__ */', 1)

open(WORLD, 'w', encoding='utf-8').write(src)
print('THE VISTA IS WIRED.')
print('  overlook  : DERIVED from the map (MAP LAW) -- BohemiaVista.overlook')
print('  the shot  : the existing isometric valley view, framed on the rim')
print('  the card  : names the real districts in the line of sight')
print('  the seam  : window.__VISTA.open/close/where/survey for the RUN lane')
