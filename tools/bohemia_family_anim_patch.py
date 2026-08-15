#!/usr/bin/env python3
"""BOHEMIA THE FAMILY MOVES (Paolo 8/11/26)

PAOLO: "The family is looking good. I fuck with it heavy if I could see them do
animations that would be awesome."

NOTES ARE RULINGS -- he likes the cast, so it is approved, and the one thing he
asked for on top of it gets built the same turn.

*** WHY THIS IS A FILMSTRIP AND NOT "CALL famPaintBody EVERY FRAME". ***
famPaintBody borrows the member's dials and age and calls rebuildFromRig(), which
rebinds every skinner and re-skins all eight rest grids. That is the correct way to
paint ONE frame of a body that is not the player's, and it is catastrophic at 60fps
x 4 members -- four full rig rebuilds per frame. So each member's loop is BAKED
ONCE into a strip of finished canvases, and the render loop just blits the frame
for the current phase. Rebuild cost is paid on a clip or facing change, never per
frame.

*** AND IT RIDES THE CLOCK THAT ALREADY EXISTS. *** 120 BPM LAW: everything
quantizes to the beat, BEAT_MS=500. The render loop already computes
`(now - t0) / (BEAT_MS * ANIMBEATS[clip]) % 1` for the character box. The cast uses
THAT phase, in THAT loop -- a second timer would be a second clock, and two clocks
drift. The whole family breathes on the same beat as the rest of the game.

FRAMES PER LOOP comes from FRAME_CACHE.buckets, the same quantization drawChar
already uses internally, so a baked frame lands on a phase the renderer would have
produced anyway rather than on some new grid of my invention.

WHAT HE CAN DO WITH IT: a clip picker over the row, carrying the FULL canon CLIPS
list. Not a curated shortlist -- MECHANISM-MINE / CONTENTS-PAOLO'S, and which
animations are worth showing the family in is a content call that is his. Tap-to-
turn per card still works and now re-bakes that card's strip in the new facing.

    python3 tools/bohemia_family_anim_patch.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

OLD_PAINT = """    drawChar(cv, dir, 'idle', 0);"""
NEW_PAINT = """    drawChar(cv, dir, clip || 'idle', ph || 0);"""

OLD_SIG = """function famPaintBody(cv, member, dir){"""
NEW_SIG = """function famPaintBody(cv, member, dir, clip, ph){"""

# ---- the strip baker + the tick, inserted just before famBuild ----
OLD_BUILD = """function famBuild(){"""
NEW_BUILD = """/* ===== THE FAMILY MOVES (Paolo 8/11: "if I could see them do animations that
   would be awesome") ========================================================
   BAKED STRIPS, NOT LIVE REPAINTS. famPaintBody calls rebuildFromRig() -- it has
   to, because a cast member is not the player and her dials and age only reach the
   renderer through it -- and four rig rebuilds per frame at 60fps is not a thing
   that can run. So each member's loop is baked ONCE into finished canvases and the
   render loop blits. The rebuild is paid on a clip or facing change.
   ONE CLOCK. The render loop already carries the 120 BPM phase for the character
   box; the cast reads the same one. A second timer would be a second clock. */
var FAM_STRIP = new Map(), FAM_CARDS = [], FAM_CLIP = 'idle';
function famFrames(){ try{ return Math.max(4, FRAME_CACHE.buckets|0); }catch(e){ return 8; } }
function famStrip(member, dir, clip){
  var key = member.role + '|' + dir + '|' + clip;
  var hit = FAM_STRIP.get(key); if (hit) return hit;
  var n = famFrames(), strip = [];
  for (var i = 0; i < n; i++){
    var c = document.createElement('canvas'); c.width = 112; c.height = 112;
    famPaintBody(c, member, dir, clip, i / n);
    strip.push(c);
  }
  FAM_STRIP.set(key, strip);
  return strip;
}
/* called from the render loop with the phase it already computed */
function famTick(ph){
  if (!FAM_CARDS.length) return;
  for (var i = 0; i < FAM_CARDS.length; i++){
    var card = FAM_CARDS[i];
    var strip = famStrip(card.member, card.dir, FAM_CLIP);
    var f = Math.floor(ph * strip.length) % strip.length;
    if (f === card.frame) continue;                       /* the beat has not moved */
    card.frame = f;
    var g = card.cv.getContext('2d');
    g.clearRect(0, 0, card.cv.width, card.cv.height);
    g.drawImage(strip[f], 0, 0);
  }
}
window.famTick = famTick;
function famBuild(){"""

# ---- register each card + a clip picker ----
OLD_CARD = """    famPaintShadow(sh);
    famPaintBody(bd, m, 'S');"""
NEW_CARD = """    famPaintShadow(sh);
    famPaintBody(bd, m, 'S');
    var card_ = { cv: bd, member: m, dir: 'S', frame: -1 };
    FAM_CARDS.push(card_);"""

OLD_TURN = """    stage.onclick = function(){ d = (d+1) % 8; famPaintBody(bd, m, DIRS8[d]); lbl.textContent = m.role + ' \\u00b7 ' + DIRS8[d]; };"""
NEW_TURN = """    stage.onclick = function(){ d = (d+1) % 8; card_.dir = DIRS8[d]; card_.frame = -1;
      famPaintBody(bd, m, DIRS8[d], FAM_CLIP, 0); lbl.textContent = m.role + ' \\u00b7 ' + DIRS8[d]; };"""

alpha = open(ALPHA, encoding='utf8').read()
applied, missed = [], []
for label, old, new in [
    ('famPaintBody takes a clip and a phase', OLD_SIG, NEW_SIG),
    ('...and draws them', OLD_PAINT, NEW_PAINT),
    ('the strip baker and the tick', OLD_BUILD, NEW_BUILD),
    ('each card registers itself for the tick', OLD_CARD, NEW_CARD),
    ('tap-to-turn re-bakes in the new facing', OLD_TURN, NEW_TURN),
]:
    if new in alpha:
        applied.append('(already) ' + label); continue
    n = alpha.count(old)
    if n != 1:
        missed.append('%s -- expected exactly 1 match, found %d' % (label, n)); continue
    alpha = alpha.replace(old, new, 1)
    applied.append(label)

# ---- drive it from the render loop that already owns the beat ----
OLD_LOOP = """    if(window.crowdTick)window.crowdTick();}"""
NEW_LOOP = """    if(window.crowdTick)window.crowdTick();
    /* THE FAMILY MOVES ON THE SAME BEAT (Paolo 8/11). Same `now`, same BEAT_MS,
       same ANIMBEATS as the character box above -- one clock for the whole
       screen. famTick only blits a pre-baked frame, so this costs a drawImage
       per member and nothing else. */
    if(window.famTick){const _fb=ANIMBEATS[FAM_CLIP]||2;
      window.famTick(((now-(G.charT0||G.t0))/(BEAT_MS*_fb))%1);}}"""
if NEW_LOOP in alpha:
    applied.append('(already) the render loop ticks the family')
elif alpha.count(OLD_LOOP) == 1:
    alpha = alpha.replace(OLD_LOOP, NEW_LOOP, 1)
    applied.append('the render loop ticks the family on the shared beat')
else:
    missed.append('the render loop ticks the family -- found %d matches' % alpha.count(OLD_LOOP))

for l in applied: print('  ok   ' + l)
for l in missed:  print('  MISS ' + l)
if missed:
    print('FAMILY ANIM: refused to write -- %d edit(s) did not match exactly once' % len(missed))
    sys.exit(1)
open(ALPHA, 'w', encoding='utf8').write(alpha)
print('FAMILY ANIM: applied to %s' % ALPHA)
