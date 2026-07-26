#!/usr/bin/env python3
"""
BOHEMIA — CHARACTER PREVIEW: SHUFFLE ANIM (Paolo 7/26/26)

His words: "in the character menu I would like to see a shuffle Animation
button in the bottom right or something of the actual box that shows the
character in the character menu just so I can see it."

So the CHARACTER tab's preview box stops being a permanent idle loop. It gets a
SHUFFLE ANIM button pinned bottom-right INSIDE the box, and the current clip
name bottom-left (tap it to go back to idle). Every clip in the real CLIPS list
is in the pool except the terminal ones (headshot / headshot-2 hold a corpse --
a shuffle that leaves a dead body on the character screen is not a preview).

Why it matters beyond convenience: the body sliders live two inches under this
box. Judging a slider on a standing idle pose is exactly the mistake that
killed the woman rig (VERIFY THROUGH THE ANIMATIONS, not the idle pose). This
button puts the animations under Paolo's thumb on the same screen as the dials.

REUSE CHECK (REUSE-FIRST / APPROVED-ASSETS-FIRST): cooks ZERO new graphic
pixels. It re-plays clips that already exist in the alpha's own CLIPS table
through the alpha's own drawChar. No art is drawn, generated or derived.

Idempotent.

  python3 tools/bohemia_char_preview_patch.py
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ALPHA = os.path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html')

def die(msg):
    print('  ! ' + msg)
    sys.exit(1)

src = open(ALPHA, encoding='utf-8').read()
orig = src
did = []

# --------------------------------------------------------------------------
# 1. the box: wrap the preview canvas so the button can sit INSIDE it
# --------------------------------------------------------------------------
OLD_BOX = """      <canvas id="charCv" width="112" height="112"></canvas>
      <canvas id="portraitCv" width="64" height="64"></canvas>"""
NEW_BOX = """      <div id="charStage" style="position:relative;width:min(92vw,420px);margin:8px auto;line-height:0">
        <canvas id="charCv" width="112" height="112" style="margin:0;width:100%"></canvas>
        <div id="charClipLbl" style="position:absolute;left:7px;bottom:7px;font:11px ui-monospace,monospace;letter-spacing:1px;color:#c8b98a;background:rgba(20,18,26,.72);border:1px solid #3a3020;border-radius:3px;padding:3px 7px;line-height:1;cursor:pointer">idle</div>
        <button id="charShuf" class="opt" style="position:absolute;right:7px;bottom:7px;line-height:1;padding:5px 9px;background:rgba(20,18,26,.72)">&#8635; SHUFFLE ANIM</button>
      </div>
      <canvas id="portraitCv" width="64" height="64"></canvas>"""
if 'id="charStage"' not in src:
    if OLD_BOX not in src:
        die('character preview box anchor not found -- alpha layout changed')
    src = src.replace(OLD_BOX, NEW_BOX, 1)
    did.append('preview box wrapped, SHUFFLE ANIM + clip label added inside it')

# --------------------------------------------------------------------------
# 2. state: the preview owns its own clip and its own clock
# --------------------------------------------------------------------------
if 'charClip:' not in src:
    OLD_G = "const G={dir:'S',clip:'idle',"
    NEW_G = "const G={dir:'S',clip:'idle',charClip:'idle',charT0:0,"
    if OLD_G not in src:
        die('G state anchor not found')
    src = src.replace(OLD_G, NEW_G, 1)
    did.append('G.charClip / G.charT0 added')

# --------------------------------------------------------------------------
# 3. the loop draws the shuffled clip instead of a hardcoded idle
# --------------------------------------------------------------------------
OLD_LOOP = "  if(charOn){const ph=((now-G.t0)/(BEAT_MS*ANIMBEATS.idle))%1;drawChar(document.getElementById('charCv'),G.dir,'idle',ph);}"
NEW_LOOP = """  if(charOn){
    /* SHUFFLE ANIM (Paolo 7/26/26): the character box plays whatever clip the
       shuffle picked, on its own clock, so the body sliders right under it are
       judged THROUGH THE ANIMATIONS and never off a standing idle pose. */
    const _cc=G.charClip||'idle';const _cb=ANIMBEATS[_cc]||2;
    const ph=((now-(G.charT0||G.t0))/(BEAT_MS*_cb))%1;
    /* NO SKELETON ON THE CHARACTER BOX. The pink bones and green joints are a
       RIG tool; painted over the body they are the loudest thing on screen, and
       this box is now where Paolo judges body shape. The ANIMATION tab keeps
       its SHOW SKELETON toggle -- that is where the rig work happens. */
    const _sk=G.showSkel;G.showSkel=false;
    drawChar(document.getElementById('charCv'),G.dir,_cc,ph);
    G.showSkel=_sk;}"""
if OLD_LOOP in src:
    src = src.replace(OLD_LOOP, NEW_LOOP, 1)
    did.append('the character-tab loop plays G.charClip')

# --------------------------------------------------------------------------
# 4. the wiring
# --------------------------------------------------------------------------
if 'CHAR_SHUFFLE_WIRE' not in src:
    ANCHOR = "/* ===== build UI ===== */"
    if ANCHOR not in src:
        die('build UI anchor not found')
    WIRE = """/* CHAR_SHUFFLE_WIRE (Paolo 7/26/26): the preview box's own transport.
   Pool = the real CLIPS table minus the TERMINAL clips -- headshot and
   headshot-2 end holding a corpse, and a character screen that shuffles into a
   dead body is not a preview. Never repeats the clip it is already playing. */
function charShuffle(){
  const pool=CLIPS.filter(c=>!TERMINAL[c]&&c!==G.charClip);
  if(!pool.length)return;
  G.charClip=pool[Math.floor(Math.random()*pool.length)];
  G.charT0=performance.now();
  const l=document.getElementById('charClipLbl');if(l)l.textContent=G.charClip;
}
function charClipReset(){
  G.charClip='idle';G.charT0=performance.now();
  const l=document.getElementById('charClipLbl');if(l)l.textContent='idle';
}
{const b=document.getElementById('charShuf');if(b)b.onclick=charShuffle;
 const l=document.getElementById('charClipLbl');if(l)l.onclick=charClipReset;}
/* ===== build UI ===== */"""
    src = src.replace(ANCHOR, WIRE, 1)
    did.append('charShuffle() + tap-label-to-reset wired')

if src == orig:
    print('CHAR PREVIEW PATCH: already applied, nothing to do.')
    sys.exit(0)

open(ALPHA, 'w', encoding='utf-8').write(src)
print('CHAR PREVIEW PATCH applied to slices/BOHEMIA_ALPHA_0_9.html')
for d in did:
    print('  - ' + d)
