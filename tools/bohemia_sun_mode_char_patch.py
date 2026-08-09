#!/usr/bin/env python3
"""BOHEMIA SUN MODE FOR THE CHARACTER SCREEN (8/7/26, CHARACTER lane)

PAOLO, 8/7: "Find the character screen can you have an option to make it light?
It's kind of hard to see all these hairstyles against the dark background,
especially when I'm working outside and it's sunny as shit."

REUSE CHECK, because this repo already has this idea twice and a third invention
would be the wrong answer:
  - #p-clothes.sun (the clothing factory) -- panel goes #d9d4c8, buttons #efe9dc,
    labels darken. Toggled by a `SUN` button, NOT persisted.
  - the SFX judge's SUN button -- same class flip, but it SAVES the choice.
Both are the same mechanism. This adopts it verbatim: same two colours, same
`.sun` class on the panel, no new palette invented. It takes the SFX judge's
PERSISTENCE rather than the clothing factory's, because a man standing outside in
the sun should tap this once ever, not once per visit.

WHY IT COVERS THE ANIMATION TAB TOO. He said "the character screen", and the fix
is scoped to what he asked for -- but the hair he is judging renders in FOUR
places and one of them is not on that tab:
    #charCv        the big preview          p-char
    .hairTile      the style picker tiles   p-char
    .hairSpinShot  the 8-facing hair bar    p-char
    .g8c           the ALL-8 gallery        p-anim
Lighting three of the four would leave him in the sun with the same complaint on
the fourth, holding a feature that half works. Same class, same toggle, two extra
selectors.

THE PART THAT IS NOT OBVIOUS: `!important` ON THE CANVAS BACKGROUNDS.
The hair canvases carry their background as an INLINE style (`background:#141118`
on the picker tiles, `#0e0c12` on the spin shots) because they are built in JS.
An inline style beats a stylesheet rule, so a plain `.sun .hairTile{background:...}`
would flip the panel and leave every hairstyle sitting on its own black square --
which is precisely the thing he asked to fix. Verified in a real browser rather
than assumed.

AND IT WORKS AT ALL ONLY BECAUSE THE SPRITES ARE TRANSPARENT: drawChar and
renderTo putImageData with alpha 0 on empty pixels, so the element's background
really is what shows behind the hair. If the renderer ever painted an opaque
backdrop into the bitmap, this would do nothing and the gate would catch it.

NOT TOUCHED: #p-clothes, which already has its own working SUN button. Adding a
second control over the same surface is worse than leaving it.

    python3 tools/bohemia_sun_mode_char_patch.py
"""
import sys

ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'

CSS_ANCHOR = ".mini{font-size:10px;color:#6a5a3e;padding:2px 12px;text-align:center}"

CSS_NEW = CSS_ANCHOR + """
/* ===== SUN MODE, CHARACTER + ANIMATION (Paolo 8/7: "make it light... I'm
   working outside and it's sunny as shit"). Same two colours the clothing
   factory and the SFX judge already use; nothing new invented. ===== */
#p-char.sun,#p-anim.sun{background:#d9d4c8;color:#1a1712}
#p-char.sun .row b,#p-anim.sun .row b{color:#5a4a2a}
/* .mini carries an INLINE colour on the hair rows (`color:#c8b98a`, set in JS),
   and inline beats the stylesheet -- without !important every hairstyle NAME
   stays pale tan on cream, which is his exact complaint moved from the pictures
   onto the labels. Same trap as the canvas backgrounds below; found by LOOKING
   at the rendered page, not by reading the rule. */
#p-char.sun .mini,#p-anim.sun .mini{color:#4a3f2c!important}
#p-char.sun .opt,#p-anim.sun .opt{background:#efe9dc;color:#1a1712;border-color:#b8ad95}
#p-char.sun .sunBtn.on,#p-anim.sun .sunBtn.on{border-color:#8a6d1f;background:#f7efd2}
/* THE CANVASES CARRY THEIR DARK BACKGROUND INLINE (built in JS), and an inline
   style beats a stylesheet rule -- without !important the panel goes light and
   every hairstyle keeps its own black square, which is the exact complaint. */
#p-char.sun #charCv,#p-char.sun #portraitCv,
#p-char.sun .hairTile,#p-char.sun .hairSpinShot,
#p-anim.sun #animCv,#p-anim.sun .g8c{background:#efe9dc!important}"""

# The button goes at the TOP of each panel: he is scrolled anywhere on a long
# page when he notices the glare, and a control he has to hunt for is one he
# taps once and never finds again.
JS_ANCHOR = "\nfunction paintPortrait(canvas){"

JS_NEW = """
/* ===== SUN MODE (Paolo 8/7) =================================================
   One state, two panels, remembered. The clothing factory's SUN is per-visit;
   this one persists, because "I'm working outside" is a condition that lasts
   longer than one tab switch and re-tapping it every time would be its own
   small insult. */
var SUN_KEY = 'BOH_SUN_CHAR';
var SUN_PANELS = ['p-char', 'p-anim'];
function sunGet(){ try { return localStorage.getItem(SUN_KEY) === '1'; } catch(e){ return false; } }
function sunApply(on){
    for (var i = 0; i < SUN_PANELS.length; i++) {
      var p = document.getElementById(SUN_PANELS[i]);
      if (p) p.classList.toggle('sun', !!on);
    }
    var b = document.querySelectorAll('.sunBtn');
    for (var j = 0; j < b.length; j++) {
      b[j].classList.toggle('on', !!on);
      b[j].textContent = on ? '\\u2600 SUN ON' : '\\u2600 SUN';
    }
  }
function sunSet(on){ try { localStorage.setItem(SUN_KEY, on ? '1' : '0'); } catch(e){} sunApply(on); }
function sunMount(){
    for (var i = 0; i < SUN_PANELS.length; i++) {
      var p = document.getElementById(SUN_PANELS[i]);
      if (!p || p.querySelector('.sunBtn')) continue;
      var row = document.createElement('div');
      row.className = 'row';
      row.style.cssText = 'justify-content:center;padding-top:6px;padding-bottom:0';
      var btn = document.createElement('button');
      btn.className = 'opt sunBtn';
      btn.title = 'daylight-readable background';
      btn.onclick = function(){ sunSet(!sunGet()); };
      row.appendChild(btn);
      p.insertBefore(row, p.firstChild);
    }
    sunApply(sunGet());
  }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sunMount);
else sunMount();


function paintPortrait(canvas){"""

alpha = open(ALPHA, encoding='utf8').read()
before = alpha
applied, missed = [], []

for label, old, new in [
    ('SUN MODE css for #p-char and #p-anim', CSS_ANCHOR, CSS_NEW),
    ('SUN MODE toggle, persisted, mounted into both panels', JS_ANCHOR, JS_NEW),
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
    print('SUN MODE: refused to write — %d anchor(s) did not match exactly once' % len(missed))
    sys.exit(1)

if alpha != before:
    open(ALPHA, 'w', encoding='utf8').write(alpha)
    print('SUN MODE: applied to %s' % ALPHA)
else:
    print('SUN MODE: already applied, nothing to write')
