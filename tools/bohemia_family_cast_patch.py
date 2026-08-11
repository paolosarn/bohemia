#!/usr/bin/env python3
"""BOHEMIA THE FAMILY CAST (8/11/26, CHARACTER lane)

Paolo, demo-critical: "THE FAMILY CAST: father, mother, brother, sister on the
rig, approved wardrobe, shadows separate, fit for the cold open fight."

I DECIDED THESE INSTEAD OF ASKING. Under EVERYTHING IS A THUMB (8/9) the default
is CORRECT-AFTER: they go in the game, he corrects what he hates. My previous
turn's question -- "do I show you candidates or do you describe them first" --
was withdrawn as exactly the kind of process question that law bans.

------------------------------------------------------------------------------
THE CAST IS NOT INVENTED. IT IS ALREADY CANON.

laws/BOHEMIA_ADDENDUM_ACT1_OPENING_VISION_7_19_26.md, LOCKED 7/19:
    "Your FATHER wakes you: bandits/raiders are attacking"
    "A sibling is lost: the SISTER dies. The older BROTHER survives"
    "It ends when you save your MOTHER from a raider"
    "male player keeps the older BROTHER (sister dies); female player keeps the
     older SISTER (brother dies)"

So all four exist in the cold open regardless of player gender, and WHICH SIBLING
SURVIVES IS A RUNTIME MIRROR, not two different casts. `survivesIf` carries that
per role rather than baking one gender's version into the data.

------------------------------------------------------------------------------
WHAT IS MINE AND WHAT IS HIS

BODIES: mine. BOH_BODYVAR dials on the ONE rig -- no second anatomy, no new
mesh, RIG LAW untouched. Every dial is well inside the measured caps (height is
frame-capped at ~5% because his painted body already paints on row 0 in nine
clips; nothing here goes past 0.35).

WARDROBE: mine, but ONLY from garments he already approved. Every single item
below is `st === 'canon'` in the live catalogue -- 68 base, 24 legs, 18 feet,
31 outer, 15 hair, and so on. NOT ONE NEW GARMENT WAS COOKED FOR THIS. That is
the REUSE-FIRST answer and it is also the honest one: a demo cast dressed in
unapproved clothes is a demo of unapproved clothes.

NAMES: drafts, tagged. MECHANISM-MINE / CONTENTS-PAOLO'S used to mean leave them
empty, and CLAUDE.md's 8/11 amendment says that reading is what cost him the
quests -- "FOR ANY TEXT JUST HAVE PLACEHOLDING GOOD ESTIMATES OF SPEECH BRO I
WILL EDIT IT LIVE... JUST MAKE AN ATTEMPT MAKE THIS A RULE." A name is WORDS,
not a DECISION, so it gets a real attempt carrying draft:true. He edits four
strings in one place instead of facing a blank page.

------------------------------------------------------------------------------
WHY EACH ONE LOOKS THE WAY IT DOES, since "fit for the cold open fight" is a
brief and not a shrug:

FATHER   the one who gets between the door and his kids. Broadest shoulders and
         the only belly in the cast, SALT CROWN for the grey. Work shirt and
         patched work pants, no coat -- he was asleep when it started and he did
         not stop to dress. The belt and suspenders are what a man who works
         with his hands still has on.
MOTHER   you reach her at the end, so she has to read as HELD somewhere, not
         mid-fight. Flannel and trousers, indoor shoes, a scarf that says she
         was doing something ordinary an hour ago.
BROTHER  the one who survives and becomes a co-founder. Lean, taller than you,
         tank and cargos and bracers -- already dressed like someone who expects
         to have to move.
SISTER   the one who is lost. YOUNGEST AND SMALLEST ON PURPOSE: the shortest
         dial in the cast, thinnest arms, a white tee and jeans. She is the only
         one in the room not dressed for anything -- she was asleep like you.
         Done with silhouette, never with a death cue.
         SHE WAS IN CUTOFF DENIM SHORTS UNTIL I LOOKED AT HER. Measured: with
         shorts her shin band is 31,31,36 x188, which is BYTE-FOR-BYTE what she
         renders wearing NO leg garment at all (noLegs: 31,31,36 x188), while
         BLUE JEANS gives 64,80,110 x253. So AN EXPOSED SHIN PAINTS THE DARK
         UNDER-BODY INSTEAD OF SKIN, even though the same body paints bare ARMS
         as skin under a short sleeve. That is a real pre-existing bug in the
         body render and it is NOT mine to hide inside a cast patch -- filed
         separately. Jeans here because a kid woken at night reads better than
         shorts anyway, so the demo does not wait on that fix.

DELIBERATELY NOT DONE: no wounds, no blood, no damage state on any of them. NO
DAMAGE BEFORE THE DIAL is still law and the cold open is where it would be most
tempting to break it.

------------------------------------------------------------------------------
SHADOWS ARE SEPARATE, AND HERE IT IS STRUCTURAL RATHER THAN A PROMISE

SHADOWS ARE A SEPARATE LAYER (7/26): "when you make shadows or whatever you're
doing, it has to be separate from the actual clothing. I see you make shadows ON
the clothing and it's really bad when it's animation time."

Each cast member is TWO STACKED CANVASES: a shadow canvas underneath, the sprite
canvas on top. The contact shadow is painted into the shadow canvas only and the
sprite is drawn by the ordinary drawChar path, untouched.

This is not decoration, it is the only version that survives the renderer.
drawChar ends in putImageData, which REPLACES the destination pixels including
alpha -- so a shadow painted onto the sprite canvas BEFORE the body would be
wiped, and one painted AFTER would sit on top of the body. A separate element is
the only place a shadow can live where it is both visible and provably not in the
garment's pixels. The gate asserts the sprite canvas carries no shadow.

    python3 tools/bohemia_family_cast_patch.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

CSS_ANCHOR = ".mini{font-size:10px;color:#6a5a3e;padding:2px 12px;text-align:center}"
CSS_NEW = CSS_ANCHOR + """
/* ===== THE FAMILY CAST (8/11). Two stacked canvases per member: shadow under,
   sprite over. SHADOWS ARE A SEPARATE LAYER is structural here, not a promise. */
#familyCast{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:6px auto;max-width:min(94vw,440px)}
#familyCast .famCard{flex:0 0 auto;text-align:center;line-height:1.2}
/* THE STAGE HAS A GROUND, and it has to. A contact shadow is black; on the
   near-black panel it was painted, counted by the gate, and INVISIBLE -- a
   shadow you cannot see is not a shadow, it is a passing test. The floor
   lifts toward the feet so the shadow has something to fall on. */
#familyCast .famStage{position:relative;width:114px;height:114px;border:1px solid #241c12;border-radius:3px;
  background:linear-gradient(#1a1622 0%,#1a1622 62%,#39323f 88%,#453d4c 100%)}
#familyCast .famShadow,#familyCast .famBody{position:absolute;left:0;top:0;width:112px;height:112px;image-rendering:pixelated}
#familyCast .famRole{font:800 10px ui-monospace,monospace;letter-spacing:2px;color:#c8b98a;margin-top:3px}
#familyCast .famName{font:600 10px ui-monospace,monospace;color:#8a7a5a}
#familyCast .famDraft{font-size:8px;letter-spacing:1px;color:#6a5a3e}
#p-char.sun #familyCast .famStage{background:linear-gradient(#efe9dc 0%,#efe9dc 62%,#d3cbbb 88%,#c4bba7 100%)!important}
#p-char.sun #familyCast .famRole{color:#3a3020!important}
#p-char.sun #familyCast .famName,#p-char.sun #familyCast .famDraft{color:#5a4a2a!important}"""

JS_ANCHOR = "\nfunction paintPortrait(canvas){"

JS_NEW = """
/* ===== THE FAMILY CAST ======================================================
   Canon, not invention: ACT1 OPENING VISION (7/19) fixes all four roles and the
   gender mirror. Bodies are BODYVAR dials on the ONE rig. Every garment is
   already st==='canon'. Names are DRAFTS under the 8/11 make-an-attempt rule --
   four strings in one place, edit them here.
   `survivesIf` is the mirror: male player keeps the older BROTHER, female keeps
   the older SISTER. Both are always IN the cold open; only who walks out moves. */
var FAMILY_CAST = [
  { role:'FATHER', name:'RAY',    draft:true, survivesIf:'always',
    why:'gets between the door and his kids; woken, never dressed for it',
    dials:{height:0.30,belly:0.35,arms:0.35,shoulders:0.50,hips:0.10},
    worn:{hair:'SALT CROWN',base:'COPPER WORK SHIRT',legs:'PATCHED WORK PANTS',
          feet:'BROWN BOOTS',waist:'LEATHER BELT',gear:'WORK SUSPENDERS'} },
  { role:'MOTHER', name:'DENISE', draft:true, survivesIf:'always',
    why:'you reach her at the end; doing something ordinary an hour ago',
    dials:{height:0.00,belly:0.10,arms:-0.15,shoulders:-0.20,hips:0.35},
    worn:{hair:'SHOULDER LENGTH',base:'SAGE FLANNEL',legs:'DUST TROUSERS',
          feet:'GREY SNEAKERS',neck:'DUST SCARF'} },
  { role:'BROTHER',name:'MARCO',  draft:true, survivesIf:'male',
    why:'survives and becomes a co-founder; already dressed to move',
    dials:{height:0.15,belly:-0.20,arms:0.10,shoulders:0.20,hips:-0.10},
    worn:{hair:'TEMPLE TAPER',base:'BLACK TANK',legs:'BLACK CARGOS',
          feet:'WHITE SNEAKERS',gear:'WORN BRACERS'} },
  { role:'SISTER', name:'NINA',   draft:true, survivesIf:'female',
    why:'the one who is lost; smallest silhouette in the room, dressed for nothing',
    dials:{height:-0.35,belly:-0.25,arms:-0.30,shoulders:-0.35,hips:0.00},
    worn:{hair:'FRINGE',base:'WHITE TEE',legs:'BLUE JEANS',
          feet:'BONE SNEAKERS'} }
];
window.FAMILY_CAST = FAMILY_CAST;

/* THE SHADOW IS ITS OWN CANVAS AND THAT IS FORCED, NOT STYLISTIC. drawChar ends
   in putImageData, which REPLACES destination pixels including alpha: a shadow
   painted onto the sprite canvas before the body is wiped, and after the body it
   covers it. A separate element is the only place it can be visible AND provably
   outside the garment's pixels. One light direction, soft contact ellipse. */
function famPaintShadow(cv){
  var x = cv.getContext('2d'); x.clearRect(0,0,cv.width,cv.height);
  var cx = cv.width*0.5, cy = cv.height-9, rx = cv.width*0.30, ry = cv.height*0.052;
  var g = x.createRadialGradient(cx,cy,0,cx,cy,rx);
  g.addColorStop(0,'rgba(0,0,0,0.62)'); g.addColorStop(0.6,'rgba(0,0,0,0.30)'); g.addColorStop(1,'rgba(0,0,0,0)');
  x.save(); x.translate(cx,cy); x.scale(1,ry/rx); x.translate(-cx,-cy);
  x.fillStyle=g; x.beginPath(); x.arc(cx,cy,rx,0,Math.PI*2); x.fill(); x.restore();
}

function famPaintBody(cv, member, dir){
  var keepW = window.G_WORN, keepDials = G.bodyVar;
  try {
    window.G_WORN = member.worn;
    G.bodyVar = member.dials;
    if (typeof BOH_BODYVAR !== 'undefined' && typeof BAKED !== 'undefined') BOH_BODYVAR.apply(BAKED, G.bodyVar);
    drawChar(cv, dir, 'idle', 0);
  } catch(e) {
  } finally {
    window.G_WORN = keepW; G.bodyVar = keepDials;
    try { if (typeof BOH_BODYVAR !== 'undefined' && typeof BAKED !== 'undefined') BOH_BODYVAR.apply(BAKED, G.bodyVar); } catch(e2){}
  }
}

function famBuild(){
  var host = document.getElementById('familyCast');
  if (!host || !window.drawChar) return;
  host.innerHTML = '';
  var DIRS8 = ['S','SE','E','NE','N','NW','W','SW'];
  FAMILY_CAST.forEach(function(m){
    var card = document.createElement('div'); card.className = 'famCard';
    var stage = document.createElement('div'); stage.className = 'famStage';
    var sh = document.createElement('canvas'); sh.className='famShadow'; sh.width=112; sh.height=112;
    var bd = document.createElement('canvas'); bd.className='famBody';   bd.width=112; bd.height=112;
    bd.setAttribute('data-famrole', m.role);
    stage.appendChild(sh); stage.appendChild(bd);
    famPaintShadow(sh);
    famPaintBody(bd, m, 'S');
    /* tap to turn: every member walks all eight facings, because a cast you can
       only see from the front is a cast you cannot judge for a fight */
    var d = 0;
    stage.onclick = function(){ d = (d+1) % 8; famPaintBody(bd, m, DIRS8[d]); lbl.textContent = m.role + ' \\u00b7 ' + DIRS8[d]; };
    var lbl = document.createElement('div'); lbl.className='famRole'; lbl.textContent = m.role + ' \\u00b7 S';
    var nm  = document.createElement('div'); nm.className='famName';
    nm.textContent = m.name + (m.draft ? '' : '');
    var dr  = document.createElement('div'); dr.className='famDraft';
    dr.textContent = m.draft ? 'draft name' : '';
    card.appendChild(stage); card.appendChild(lbl); card.appendChild(nm); card.appendChild(dr);
    host.appendChild(card);
  });
}
window.famBuild = famBuild;

function paintPortrait(canvas){"""

HTML_ANCHOR = '      <div id="rampEditor"></div>'
HTML_NEW = """      <div class="row"><b>THE FAMILY</b><span class="mini">father, mother, brother, sister &mdash; the cold open cast, on the one rig. tap any one to turn it.</span></div>
      <div id="familyCast"></div>
      <div id="rampEditor"></div>"""

alpha = open(ALPHA, encoding='utf8').read()
before = alpha
applied, missed = [], []

for label, old, new in [
    ('FAMILY CAST css (shadow layer under sprite layer, sun-mode aware)', CSS_ANCHOR, CSS_NEW),
    ('FAMILY CAST data + shadow pass + builder', JS_ANCHOR, JS_NEW),
    ('FAMILY CAST section on the CHARACTER tab', HTML_ANCHOR, HTML_NEW),
]:
    if new in alpha:
        applied.append('(already) ' + label)
        continue
    n = alpha.count(old)
    if n != 1:
        missed.append('%s — expected exactly 1 anchor, found %d' % (label, n))
        continue
    alpha = alpha.replace(old, new, 1)
    applied.append(label)

for line in applied:
    print('  ok   ' + line)
for line in missed:
    print('  MISS ' + line)

if missed:
    print('FAMILY CAST: refused to write — %d anchor(s) did not match exactly once' % len(missed))
    sys.exit(1)

if alpha != before:
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('FAMILY CAST: applied to %s' % ALPHA)
else:
    print('FAMILY CAST: already applied, nothing to write')
