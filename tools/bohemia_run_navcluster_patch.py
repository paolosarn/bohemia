#!/usr/bin/env python3
"""
BOHEMIA RUN NAV CLUSTER (7/27/26) - the run gets the same movement UI as combat:
your portrait dead centre, eight cardinal buttons ringed around it.

> "okay so first off on the run should be using the same movement ui s the combat
>  shit. look in the combat module and its direction shit and dont present me
>  nothing until i see the portrait and the 8 cardinal directions button that
>  shit on the run screen where its the arrows taking up half the screen is dog
>  shit man"

WHAT WAS THERE. A `#ctl` bar welded to the bottom of the run: a full-width 52px
ACT button, and under it four arrows at 74x52 each in a strip. On a 390x844
phone that bar plus its padding is ~125px of chrome, and it is not floating over
the world - it is a flex sibling of the stage, so it SHRINKS the canvas. The
game was being played in the space the buttons left over.

WHERE THE ANSWER ALREADY LIVED, in the repo, twice, exactly as he said:
  COMBAT   buildMoveRing() - eight round buttons on angles [-90,-45,0,45,90,
           135,180,-135] at radius 66, ringing the fire button, fixed in the
           thumb corner.
  CITY     the same ring grown up: a 180x180 #nav at right:6 bottom:6, eight
           42px round .pb buttons around an 80px round #mode button with the
           PLAYER'S PORTRAIT drawn in it. Its own comment says "mirrors combat's
           corner portrait".
This is that cluster, on the run. Not a new design - the one the game already
uses in two places, which is the whole point of him saying "the same movement ui".

WHAT CHANGED
  layout   #ctl is gone. #nav floats INSIDE #stage, so the canvas gets the whole
           screen back instead of ending above a control bar.
  centre   the one contextual ACT button is now the round portrait, with the verb
           printed across its base. It was already the only action button in the
           game; it is now also where your face is, same as combat, same as city.
  eight    four arrows became eight. The run's movement already spoke 8 - dirOf()
           returns SE/NE/SW/NW and DIRS8 has been there the whole time; only the
           BUTTONS were four. A diagonal is refused if both orthogonal neighbours
           are solid, so you cannot squeeze between two building corners into a
           sealed yard - the price of turning diagonals on is owning that rule.
  ids      bu/bd/bl/br keep their names, so gates/run_gate.js keeps tapping the
           same buttons and its whole end-to-end walk still proves the run.

THE PORTRAIT is CAST.portraits.you, the real baked player face the parent alpha
already sends over the cast bridge and the dialogue sheet already draws for
speakers. Nothing new is generated; the run just stopped ignoring its own copy.

REUSE CHECK: cooks ZERO pixels and creates no asset. The portrait is the parent
alpha's existing baked player frame (CAST.portraits.you), already decoded in this
page for the dialogue speaker slot. The layout is lifted from the two clusters
already shipped (COMBAT buildMoveRing, CITY #nav). No banks/ lookup applies
because nothing is drawn, selected or altered.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing to
judge. It is his instruction, executed, on the surface he named.

Idempotent (marker NAV CLUSTER). Rebuild the run after this:
  node tools/build_run_slice.js

  python3 tools/bohemia_run_navcluster_patch.py
"""
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
SRC = 'slices/BOHEMIA_RUN_SLICE_7_26_26.html'

s = open(SRC, encoding='utf8').read()
if 'NAV CLUSTER' in s:
    print('nav cluster already applied. no-op.')
    sys.exit(0)

# ---- 1) CSS: the bar becomes a corner cluster -------------------------------
OLD_CSS = """  /* ---- ONE-THUMB CONTROLS ---- */
  #ctl{ flex:none; padding:8px 10px calc(10px + env(safe-area-inset-bottom));
    border-top:1px solid var(--line); background:#0a0906; }
  #act{ width:100%; height:52px; font-family:var(--mono); font-size:14px; font-weight:700;
    letter-spacing:1.4px; text-transform:uppercase; border:0; border-radius:5px;
    background:var(--gold); color:#0c0a07; margin-bottom:9px; }
  #act:disabled{ background:#241d12; color:var(--faint); }
  #act:active:enabled{ transform:translateY(1px); }
  .pad{ display:flex; justify-content:center; align-items:center; gap:9px; user-select:none; }
  .pad button{ width:74px; height:52px; font-size:20px; border:0; border-radius:5px;
    background:#241d12; color:var(--ink); box-shadow:inset 0 0 0 1px var(--line); }
  .pad button:active{ background:#31280f; }
  .pcol{ display:flex; flex-direction:column; gap:9px; }"""
NEW_CSS = """  /* ---- ONE-THUMB CONTROLS: THE NAV CLUSTER (7/27, Paolo) ----
     "on the run should be using the same movement ui s the combat shit ... the
      arrows taking up half the screen is dog shit man".
     What was here: a #ctl BAR, a flex sibling of the stage, holding a full-width
     ACT button and four 74x52 arrows. ~125px of chrome that did not float over
     the world - it SHRANK the canvas, so the game was played in what the buttons
     left over. This is the cluster the game already uses twice: COMBAT's
     buildMoveRing (8 buttons on a 66px radius around the fire button) grown into
     CITY's #nav (8 round buttons around an 80px portrait). Same UI, third
     surface, floating in the thumb corner over a full-screen world. */
  #nav{ position:absolute; right:6px; z-index:9;
    bottom:calc(6px + env(safe-area-inset-bottom)); width:180px; height:180px; }
  #pad{ position:absolute; inset:0; }
  .pb{ position:absolute; width:42px; height:42px; border-radius:50%; padding:0;
    background:radial-gradient(circle at 50% 38%,#241d12,#0f0c07 75%);
    border:1px solid var(--line); color:var(--gold); font-size:15px; font-weight:700;
    display:flex; align-items:center; justify-content:center; }
  .pb:active{ border-color:#c8b892; color:#fff; }
  /* the one contextual action button is now also where your face is */
  #act{ position:absolute; left:50px; top:50px; width:80px; height:80px; padding:0;
    border:0; border-radius:999px; overflow:hidden; z-index:10;
    background:radial-gradient(circle at 50% 38%,#3a342a,#15120d 72%);
    box-shadow:0 0 0 1px #4a4030,0 6px 22px rgba(0,0,0,.6); }
  #act:active:enabled{ box-shadow:0 0 0 1px var(--gold),0 6px 22px rgba(0,0,0,.6); }
  #actface{ position:absolute; inset:0; width:100%; height:100%;
    image-rendering:pixelated; border-radius:999px; }
  #actlbl{ position:absolute; left:0; right:0; bottom:6px; font-family:var(--mono);
    font-size:9px; letter-spacing:1px; font-weight:700; color:var(--ink);
    text-shadow:0 1px 4px #000,0 0 8px #000; pointer-events:none; }
  #act:disabled #actlbl{ color:var(--faint); }"""
if s.count(OLD_CSS) != 1:
    print('NAV CLUSTER: the control CSS did not match. NOT applied.')
    sys.exit(1)
s = s.replace(OLD_CSS, NEW_CSS, 1)

# ---- 2) markup: the bar becomes a cluster inside the stage ------------------
OLD_HTML = """    <div id="toast"></div>
  </div>
  <div id="ctl">
    <button id="act" disabled>&mdash;</button>
    <div class="pad">
      <button id="bl" aria-label="left">&#9664;</button>
      <div class="pcol">
        <button id="bu" aria-label="up">&#9650;</button>
        <button id="bd" aria-label="down">&#9660;</button>
      </div>
      <button id="br" aria-label="right">&#9654;</button>
    </div>
  </div>"""
# the source uses the literal glyphs, not entities
OLD_HTML = OLD_HTML.replace('&mdash;', '—').replace('&#9664;', '◀') \
    .replace('&#9650;', '▲').replace('&#9660;', '▼').replace('&#9654;', '▶')
NEW_HTML = """    <div id="toast"></div>
    <!-- NAV CLUSTER (7/27): 8 cardinals ringing the portrait, the same shape
         combat and the city tab already use. Angles -90/-45/0/45/90/135/180/-135
         at radius 62 in a 180 box, so each button sits where its direction
         points. bu/bd/bl/br keep their ids: run_gate.js taps them by name. -->
    <div id="nav">
      <div id="pad">
        <button class="pb" id="bu"  style="left:69px;top:7px"    aria-label="north">↑</button>
        <button class="pb" id="bne" style="left:113px;top:25px"  aria-label="north-east">↗</button>
        <button class="pb" id="br"  style="left:131px;top:69px"  aria-label="east">→</button>
        <button class="pb" id="bse" style="left:113px;top:113px" aria-label="south-east">↘</button>
        <button class="pb" id="bd"  style="left:69px;top:131px"  aria-label="south">↓</button>
        <button class="pb" id="bsw" style="left:25px;top:113px"  aria-label="south-west">↙</button>
        <button class="pb" id="bl"  style="left:7px;top:69px"    aria-label="west">←</button>
        <button class="pb" id="bnw" style="left:25px;top:25px"   aria-label="north-west">↖</button>
      </div>
      <button id="act" disabled aria-label="action"><canvas id="actface" width="64" height="64"></canvas><span id="actlbl">—</span></button>
    </div>
  </div>"""
if s.count(OLD_HTML) != 1:
    print('NAV CLUSTER: the control markup did not match. NOT applied.')
    sys.exit(1)
s = s.replace(OLD_HTML, NEW_HTML, 1)

# ---- 3) the label lives in its own span now ---------------------------------
OLD_LBL = """  VERB = contextVerb();
  if(VERB){ ACT.disabled=false; ACT.textContent=VERB.label; }
  else { ACT.disabled=true; ACT.textContent='—'; }"""
NEW_LBL = """  VERB = contextVerb();
  /* NAV CLUSTER: the button holds a portrait canvas now, so the verb goes in
     its own label instead of being the button's whole text content. */
  if(VERB){ ACT.disabled=false; ACTLBL.textContent=VERB.label; }
  else { ACT.disabled=true; ACTLBL.textContent='—'; }
  drawYourFace();"""
if s.count(OLD_LBL) != 1:
    print('NAV CLUSTER: the ACT label anchor did not match. NOT applied.')
    sys.exit(1)
s = s.replace(OLD_LBL, NEW_LBL, 1)

OLD_DECL = "    ACT=document.getElementById('act'), TOAST=document.getElementById('toast');"
NEW_DECL = ("    ACT=document.getElementById('act'), TOAST=document.getElementById('toast'),\n"
            "    ACTLBL=document.getElementById('actlbl'), ACTFACE=document.getElementById('actface');\n"
            "/* NAV CLUSTER: your own face in the middle of the ring, the same baked\n"
            "   portrait the parent alpha already sends over the cast bridge and the\n"
            "   dialogue sheet already draws for speakers. Nothing is generated here; the\n"
            "   run just stopped ignoring the copy it was handed. */\n"
            "function drawYourFace(){\n"
            "  if(!ACTFACE)return;\n"
            "  var pf = CAST && CAST.portraits && CAST.portraits.you;\n"
            "  var c2 = ACTFACE.getContext('2d'); c2.imageSmoothingEnabled=false;\n"
            "  c2.clearRect(0,0,ACTFACE.width,ACTFACE.height);\n"
            "  if(pf) c2.drawImage(pf,0,0,ACTFACE.width,ACTFACE.height);\n"
            "}")
if s.count(OLD_DECL) != 1:
    print('NAV CLUSTER: the element declaration anchor did not match. NOT applied.')
    sys.exit(1)
s = s.replace(OLD_DECL, NEW_DECL, 1)

# ---- 4) four buttons become eight -------------------------------------------
OLD_BIND = """['u','d','l','r'].forEach(function(id){ var b=document.getElementById('b'+id); if(!b) return;
  var dx = id==='l'?-1:id==='r'?1:0, dy = id==='u'?-1:id==='d'?1:0;
  var go=function(){ if(FREEPOS && !freeSnapped()) freeNudge(dx,dy); else move(dx,dy); };"""
NEW_BIND = """/* NAV CLUSTER (7/27): four buttons became eight. The run's movement already
   spoke 8 - dirOf() has always returned SE/NE/SW/NW and DIRS8 has been sitting
   there - only the BUTTONS were four. */
var NAV8=[['u',0,-1],['ne',1,-1],['r',1,0],['se',1,1],['d',0,1],['sw',-1,1],['l',-1,0],['nw',-1,-1]];
NAV8.forEach(function(e){ var id=e[0], dx=e[1], dy=e[2];
  var b=document.getElementById('b'+id); if(!b) return;
  /* NO CORNER SQUEEZE: a diagonal through two solid orthogonal neighbours would
     let you slip between two building corners into a sealed yard. Turning
     diagonals on means owning that rule, so the step is refused unless at least
     one of the two sides is open. */
  var go=function(){
    if(dx&&dy&&mode==='ext'&&typeof SOLIDG!=='undefined'&&SOLIDG){
      var a=SOLIDG[py]&&SOLIDG[py][px+dx], c=SOLIDG[py+dy]&&SOLIDG[py+dy][px];
      if(a&&c){ PFACE=dirOf(dx,dy); draw(); return; }
    }
    if(FREEPOS && !freeSnapped()) freeNudge(dx,dy); else move(dx,dy); };"""
if s.count(OLD_BIND) != 1:
    print('NAV CLUSTER: the hold-to-walk binding did not match. NOT applied.')
    sys.exit(1)
s = s.replace(OLD_BIND, NEW_BIND, 1)

open(SRC, 'w', encoding='utf8').write(s)
print('NAV CLUSTER applied to ' + SRC + ':')
print('  - the #ctl bar is gone; #nav floats in the thumb corner and the canvas is full-screen')
print('  - 8 cardinals ring an 80px portrait that is also the one action button')
print('  - diagonals refuse the corner squeeze; bu/bd/bl/br keep their ids for run_gate')
print('  NEXT: node tools/build_run_slice.js')
