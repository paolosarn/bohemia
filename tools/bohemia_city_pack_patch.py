#!/usr/bin/env python3
"""BOHEMIA THE PACK DOES NOT WANT TO FIGHT YOU (8/30/26, PEOPLE lane) -- ALIVE-2,
tier 2, and the first thing in this valley that can decide something about you.

REUSE CHECK: this file makes canvases, so it owes one. It opened
banks/BOHEMIA_WILDLIFE_SPRITES.js first and found the tier 1 roster already in
it -- raven, grackle, pigeon, rat and A COYOTE, cooked 8/28 with rest/look/go
frames at 16x16. SO THE COYOTE IS NOT REDRAWN: this tier uses that exact sprite,
and only the three dogs are new. Those three were added as SPEC ROWS TO THE
EXISTING tools/bohemia_wildlife_factory.py rather than to a second factory,
because draw_beast already cooks a four-legged canid from a spec row and a
second generator for the same animal shape is precisely the two-mechanisms
mistake ONE ID ONE WHOLE PERSON was written about. This file draws NO pixels of
its own; every pixel it puts on the glass comes out of that one bank. It also
reuses the tier 1 pass wholesale in shape -- same probe contract, same size
ladder, same cull, same on-the-glass record -- so the two passes cannot drift.

THE ONE SENTENCE: THE PACK DOES NOT WANT TO FIGHT YOU. IT WANTS THE THING.

WHAT THIS PUTS IN THE CITY:

1. THE PROBE, which is tier 1's probe called by name. ONE probe, not two: the
   openness scale that decides where a raven perches is the same scale that
   decides what a corridor is, and if there were two of them they would drift.

2. THE PASS, right after the animals. A pack is drawn as a GROUP standing
   around its spot, and every member's coat is picked with weights, because a
   list is not a distribution and this repo has paid for that three times.

3. THE STATE, on the glass: settled at a distance, heads up when it has seen
   you, and posturing when you are close. Nothing here attacks, because there
   is no damage dial yet, and NO DAMAGE BEFORE THE DIAL.

4. AND THE ALLEY. A pack will not follow you into a narrow place. That is
   Brogue's rule, it is honest about a scavenger, and it is what makes a back
   street a real decision instead of scenery.

  python3 tools/bohemia_city_pack_patch.py

Gate: gates/pack_gate.js
Research: records/BOHEMIA_WHAT_A_PACK_ACTUALLY_DOES_8_30_26.md
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_PACKS__'

MOD_ANCHOR = '/* ==== engine/bohemia_demoquests.js ==== */'
MOD_SRC = 'engine/bohemia_packs.js'
MOD_BANNER = '/* ==== engine/bohemia_packs.js ==== */'

# THE BANK IS INLINED INTO THE CITY AND THIS TIER MADE IT BIGGER, so it has to
# be refreshed or the three dogs exist in banks/ and never reach the glass.
# THAT IS THE INVISIBLE-HATS SHAPE, and it is worth naming: the cook succeeded,
# the file on disk was correct, and the player would have seen nothing. Every
# run of this tool re-inlines the current bank, so the copy in the city can
# never be older than the cook.
BANK_SRC = 'banks/BOHEMIA_WILDLIFE_SPRITES.js'
BANK_BANNER = '/* ==== banks/BOHEMIA_WILDLIFE_SPRITES.js ==== */'


def refresh_block(html, banner, src):
    """Replace one banner-delimited inlined block with what is on disk NOW.

    *** THIS EXISTS BECAUSE THE PATCH BIT ME WITH ITS OWN NO-OP, TWICE IN ONE
    HOUR. *** A one-shot patch that returns "already applied" the moment it sees
    its marker will happily leave a SIX-WEEK-OLD copy of a module inlined in the
    city while the engine file on disk is correct and edited. Both times the
    edit was right, the file was right, and the player would have seen nothing:
    once for the sprite bank after three dogs were cooked into it, and once for
    the module itself after its distances were re-measured against the screen.
    That is the invisible-hats shape and it is the reason a source of truth has
    to be COPIED FORWARD every run, not once."""
    a = html.find(banner)
    if a < 0:
        return html, False
    b = html.find(banner, a + len(banner))
    if b < 0:
        return html, False
    cur = html[a + len(banner):b]
    fresh = '\n' + open(src, encoding='utf-8').read()
    if not fresh.endswith('\n'):
        fresh += '\n'
    if cur == fresh:
        return html, False
    return html[:a + len(banner)] + fresh + html[b:], True


def refresh_all(html):
    """The module AND the bank, every run."""
    notes = []
    html, a = refresh_block(html, MOD_BANNER, MOD_SRC)
    if a:
        notes.append('the inlined pack module, which was older than the file')
    html, b = refresh_block(html, BANK_BANNER, BANK_SRC)
    if b:
        notes.append('the inlined sprite bank, which was older than the cook')
    return html, notes

# ---- the pass, parked next to the tier 1 pass it shares a probe with ---------
ANCHOR = """function wildPass(ox, oy, C) {"""

NEW = r"""/* ==== __CITY_PACKS__ : TIER 2, AND IT DECIDES SOMETHING ABOUT YOU ===========
   Tier 1 is what is alive around you. This is the first thing in the valley
   that has an opinion. It is standing on something, it saw you coming, and
   about ninety-six times in a hundred it will leave if you push it. The other
   four times it will not, and at a den it never will.
   ========================================================================== */
var PACK_DREW = [], PACK_LEFT = {};

/* HOW MANY OF THEM THE VALLEY IS ALLOWED. His to move. */
var PACK_DENSITY = 1.0;

function packPass(ox, oy, C) {
  PACK_DREW = [];
  if (typeof BohemiaPacks === 'undefined') return 0;
  if (typeof wildSprites !== 'function' || !wildSprites()) return 0;
  var seeR = Math.ceil(Math.max(cv.width, cv.height) / C / 2) + 6;
  var day = 0; try { day = (T.day | 0); } catch (_e) {}
  var list;
  try {
    /* THE SAME PROBE TIER 1 USES, called by name. Two probes reporting
       "openness" on two scales is how the corridor rule and the perch rule
       would quietly stop meaning the same thing. */
    list = BohemiaPacks.near({ seed: (typeof seed !== 'undefined' ? seed : 0),
      at: [hx, hy], radius: seeR, probe: wildProbe, density: PACK_DENSITY,
      day: day });
  } catch (_e) { return 0; }
  var drawn = 0;
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    /* IF YOU PUSHED IT AND IT LEFT, IT IS GONE. Same discipline as tier 1: a
       group that reappeared the moment you stepped away would make the street
       a fruit machine instead of a place. */
    var lk = p.at[0] + ',' + p.at[1] + ',' + p.kind;
    if (PACK_LEFT[lk]) continue;
    var st = BohemiaPacks.stateOf(p, [hx, hy]);
    p.state = st;
    var frame = st === 'settled' ? 'rest' : 'look';
    var sx = ox + p.at[0] * C, sy = oy + p.at[1] * C;
    if (sx < -C * 4 || sy < -C * 5 || sx > cv.width + C * 4 || sy > cv.height + C * 4) continue;
    var lad = C >= 64 ? 64 : (C >= 32 ? 32 : (C < 17 ? 8 : 16));
    var onGlass = false;
    for (var k = 0; k < p.count; k++) {
      var coat = BohemiaPacks.coatFor(p, k);
      var spr = wildCanvas(coat, frame); if (!spr) continue;
      /* THEY STAND AROUND THE THING, not on top of each other, and the spread
         is deterministic so the same four dogs are in the same four places
         every time you come round that corner. */
      var jx = (BohemiaPacks.hash(p.at[0], p.at[1], k, 1) * 2 - 1) * C * 1.4;
      var jy = (BohemiaPacks.hash(p.at[1], p.at[0], k, 2) * 2 - 1) * C * 0.9;
      var dx0 = Math.round(sx + C / 2 - lad / 2 + jx), dy0 = Math.round(sy + C - lad + jy);
      g.drawImage(spr, dx0, dy0, lad, lad);
      drawn++;
      /* RECORD ONLY WHAT LANDED ON THE GLASS, never what was drawn into the
         cull margin. Tier 1 got this wrong first and a probe reported a flock
         it could not see: A CLAIM THAT COUNTS THE THING INSTEAD OF READING IT. */
      if (dx0 + lad > 0 && dy0 + lad > 0 && dx0 < cv.width && dy0 < cv.height) onGlass = true;
    }
    if (onGlass) PACK_DREW.push(p);
  }
  return drawn;
}

/* YOU PUSH THE NEAREST ONE. The Edmonton finding, on the glass: shout, and 22
   in 23 leave. The one that does not is not angrier, it is a different animal,
   and at a den it is every one of them because it cannot leave its pups.
   Returns what happened so the caller can say it out loud. */
function packAssert() {
  if (typeof BohemiaPacks === 'undefined') return null;
  var best = null, bd = 1e9;
  for (var i = 0; i < PACK_DREW.length; i++) {
    var p = PACK_DREW[i];
    var d = Math.max(Math.abs(p.at[0] - hx), Math.abs(p.at[1] - hy));
    if (d < bd) { bd = d; best = p; }
  }
  if (!best || bd > best.noticeAt) return null;
  var r = BohemiaPacks.assert(best);
  if (r === 'backs-off') PACK_LEFT[best.at[0] + ',' + best.at[1] + ',' + best.kind] = 1;
  return { pack: best, result: r, line: BohemiaPacks.lineFor(best, best.state) };
}

function wildPass(ox, oy, C) {"""

# the call site: after the animals, so a dog stands over the same ground a
# pigeon does and inside the same visible window
CALL_ANCHOR = """  try { wildPass(ox, oy, C); } catch(_e){}"""
CALL_NEW = """  try { wildPass(ox, oy, C); } catch(_e){}
  /* __CITY_PACKS__ -- and then the thing that has an opinion about you. AFTER
     the tier 1 animals: a dog is bigger than a pigeon and stands in front of
     it, and if this ever throws the valley keeps both its residents and its
     birds. */
  try { packPass(ox, oy, C); } catch(_e){}"""


def module_body():
    body = open(MOD_SRC, encoding='utf-8').read()
    if not body.endswith('\n'):
        body += '\n'
    return MOD_BANNER + '\n' + body + MOD_BANNER + '\n'


def repair(html):
    """PUT THE MODULE BACK IF SOMETHING TOOK IT OUT, checked on its own banner
    rather than on the patch marker, because a one-shot patch that no-ops on its
    own marker cannot heal. On 8/27 another lane's tool cut 103 lines of an
    inlined module out of this file and left every call site in place."""
    healed = []
    if MOD_BANNER not in html:
        if html.count(MOD_ANCHOR) != 1:
            sys.exit('FAILED: cannot repair -- the day-loop banner resolves %d times.'
                     % html.count(MOD_ANCHOR))
        html = html.replace(MOD_ANCHOR, module_body() + MOD_ANCHOR, 1)
        healed.append('the inlined pack module')
    return html, healed


# ============================================================================
# SECTION TWO: THE BUTTON, ADDED AFTER A GATE CALLED THE FEATURE DEAD.
#
# *** ORGAN REACH WENT RED AND IT WAS RIGHT. *** "An organ no line in this repo
# calls is dead." Two of them, and they were the HEADLINE: packAssert() was
# defined and never called, so the player could not push a pack and the 22-in-23
# finding this whole tier is built on had no way to happen; and BohemiaPacks.ring
# was never called, so the alley rule -- the thing that makes a narrow street a
# real out -- ran nowhere. THE MECHANISM EXISTED AND NOTHING COULD REACH IT.
# That is the invisible-hats shape, in the same turn as a record about the
# invisible-hats shape, and only a machine check found it.
#
# THE BUTTON ONLY EXISTS WHEN IT MEANS SOMETHING. Paolo 8/16: "the run has a lot
# of bullshit buttons still around from the early days." So it is not another
# permanent control: it appears when a pack is actually warning you and goes away
# when it is not, which is also the only time pressing it would do anything.
# ============================================================================
MARK2 = '__CITY_PACKS_BUTTON__'

# THE POSITIONS ARE MEASURED, NOT GUESSED. The first cut put the button at
# CSS bottom 108 by counting the other rules in this file, and on the real
# page it landed ON TOP of the caption and the STANDING button, with the
# d-pad over its right edge. The container is inset 49px from the viewport
# bottom, which no rule in this file says. Measured on the page: the caption
# occupies y 657-683, STANDING 689-720, BIKE 763-795, SLEEP 801-832 and the
# d-pad is a 180x180 square at x198,y658. So the only free left-hand space is
# ABOVE y=657, and these two numbers put the line at 590-614 and the button at
# 620-651, six pixels clear of the caption.
# AND THE FIRST CORRECTION WAS STILL 49 PIXELS OUT, because it assumed the
# container's inset instead of reading it. Measured again on the page and
# corrected against the rendered boxes, not against the rules: the check is a
# NINE-POINT one, because a control is reachable when EVERY part of it is, not
# when its middle happens to be. Its middle row passed while the top row was
# under the caption and the bottom row under STANDING.
CSS_ANCHOR = """#rungbtn{position:absolute;left:6px;bottom:74px"""
CSS_NEW = """#packbtn{position:absolute;left:6px;bottom:193px;z-index:7;padding:7px 11px;border-radius:9px;
  display:none;background:#241a12;border:1px solid #6b4a22;color:#e6b877;font-weight:700;
  font:600 12px ui-monospace,monospace;letter-spacing:1px;cursor:pointer}
#packbtn:active{background:#3a2a18}
#packline{position:absolute;left:6px;bottom:229px;z-index:7;max-width:62%;
  display:none;padding:5px 9px;border-radius:6px;background:rgba(12,10,8,0.88);
  border:1px solid var(--line);color:#cbb68e;font:11px ui-monospace,monospace;letter-spacing:0.5px}
#rungbtn{position:absolute;left:6px;bottom:74px"""

DOM_ANCHOR = """  <div id="rungbtn">◆ STANDING</div><!-- __WHERE_YOU_STAND__ -->"""
DOM_NEW = """  <div id="rungbtn">◆ STANDING</div><!-- __WHERE_YOU_STAND__ -->
  <!-- __CITY_PACKS_BUTTON__ : the only way to do the thing this tier is about -->
  <div id="packline"></div>
  <div id="packbtn">✋ BACK OFF</div>"""

JS_ANCHOR = """/* YOU PUSH THE NEAREST ONE."""
JS_NEW = r"""/* SHOW THE BUTTON ONLY WHILE SOMETHING IS WARNING YOU, and say what it is.
   Called at the end of every pack pass, so it can never disagree with what is
   drawn: it reads PACK_DREW, which records only what landed on the glass. */
function packButton() {
  var b = document.getElementById('packbtn');
  var l = document.getElementById('packline');
  if (!b) return;
  var near = null, nd = 1e9;
  for (var i = 0; i < PACK_DREW.length; i++) {
    var p = PACK_DREW[i];
    if (p.state !== 'warn') continue;
    var d = Math.max(Math.abs(p.at[0] - hx), Math.abs(p.at[1] - hy));
    if (d < nd) { nd = d; near = p; }
  }
  PACK_NEAR = near;
  b.style.display = near ? 'block' : 'none';
  if (l) {
    if (near && !PACK_SAID) {
      var line = BohemiaPacks.lineFor(near, 'warn');
      if (line) { l.textContent = line; l.style.display = 'block'; }
    } else if (!near) { l.style.display = 'none'; PACK_SAID = 0; }
  }
}

/* YOU PUSH THE NEAREST ONE."""

WIRE_ANCHOR = """    if (onGlass) PACK_DREW.push(p);
  }
  return drawn;
}"""
WIRE_NEW = """    if (onGlass) PACK_DREW.push(p);
  }
  /* __CITY_PACKS_BUTTON__ -- the control appears here or the feature is a
     mechanism nothing can reach, which is what ORGAN REACH caught. */
  try { packButton(); } catch (_e) {}
  return drawn;
}"""

# THE RING, which was the other dead organ. A pack that is WARNING you closes on
# the open cells around you, one per animal, and takes NONE of them if you are in
# a narrow place -- which is the whole reason an alley is worth anything.
RING_ANCHOR = """      var jx = (BohemiaPacks.hash(p.at[0], p.at[1], k, 1) * 2 - 1) * C * 1.4;
      var jy = (BohemiaPacks.hash(p.at[1], p.at[0], k, 2) * 2 - 1) * C * 0.9;
      var dx0 = Math.round(sx + C / 2 - lad / 2 + jx), dy0 = Math.round(sy + C - lad + jy);"""
RING_NEW = """      var jx = (BohemiaPacks.hash(p.at[0], p.at[1], k, 1) * 2 - 1) * C * 1.4;
      var jy = (BohemiaPacks.hash(p.at[1], p.at[0], k, 2) * 2 - 1) * C * 0.9;
      var dx0 = Math.round(sx + C / 2 - lad / 2 + jx), dy0 = Math.round(sy + C - lad + jy);
      /* AND WHEN IT IS WARNING YOU, IT CLOSES. The ring is the open cells around
         you, one per animal, and it is EMPTY when you are in a narrow place, so
         backing into an alley visibly stops them coming. Without this the whole
         tactical layer existed only in the module. */
      if (st === 'warn' && ringCells && ringCells[k]) {
        dx0 = Math.round(ox + ringCells[k][0] * C + C / 2 - lad / 2);
        dy0 = Math.round(oy + ringCells[k][1] * C + C - lad);
      }"""

RINGCALC_ANCHOR = """    var lad = C >= 64 ? 64 : (C >= 32 ? 32 : (C < 17 ? 8 : 16));
    var onGlass = false;
    for (var k = 0; k < p.count; k++) {
      var coat = BohemiaPacks.coatFor(p, k);"""
RINGCALC_NEW = """    var lad = C >= 64 ? 64 : (C >= 32 ? 32 : (C < 17 ? 8 : 16));
    var ringCells = null;
    if (st === 'warn') { try { ringCells = BohemiaPacks.ring(p, [hx, hy], wildProbe); } catch (_e) {} }
    var onGlass = false;
    for (var k = 0; k < p.count; k++) {
      var coat = BohemiaPacks.coatFor(p, k);"""

STATE_ANCHOR = """var PACK_DREW = [], PACK_LEFT = {};"""
STATE_NEW = """var PACK_DREW = [], PACK_LEFT = {}, PACK_NEAR = null, PACK_SAID = 0;"""

CLICK_ANCHOR = """  return { pack: best, result: r, line: BohemiaPacks.lineFor(best, best.state) };
}"""
CLICK_NEW = """  return { pack: best, result: r, line: BohemiaPacks.lineFor(best, best.state) };
}

/* THE PRESS. draft:true on every word, per the 8/11 rule: a real attempt,
   written as if it ships, edited later in the WORDS tab. Nobody in Bohemia is
   wise, so none of these is a lesson about dogs. */
(function () {
  function wire() {
    var b = document.getElementById('packbtn');
    if (!b || b.__wired) return;
    b.__wired = 1;
    b.addEventListener('click', function () {
      var out = null;
      try { out = packAssert(); } catch (_e) {}
      var l = document.getElementById('packline');
      if (l) {
        l.textContent = !out ? 'nothing there now.'                      /* draft:true */
          : out.result === 'backs-off'
            ? 'they back off. not fast.'                                 /* draft:true */
            : (out.pack && out.pack.den
                ? 'that one is not going anywhere.'                      /* draft:true */
                : 'that one does not move.');                            /* draft:true */
        l.style.display = 'block';
      }
      PACK_SAID = 1;
      try { render(); } catch (_e) {}
    });
  }
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();"""



def section_two(html):
    """Apply the button section on its own marker, so it can land on a tree that
    already carries section one. EACH SECTION CHECKS ITS OWN MARKER: a patch tool
    that gates everything on the FIRST marker can never add anything later, which
    is how the button came to be missing in the first place."""
    if MARK2 in html:
        return html, []
    steps = [('the button style', CSS_ANCHOR, CSS_NEW),
             ('the button markup', DOM_ANCHOR, DOM_NEW),
             ('the pack state vars', STATE_ANCHOR, STATE_NEW),
             ('the ring lookup', RINGCALC_ANCHOR, RINGCALC_NEW),
             ('the ring draw', RING_ANCHOR, RING_NEW),
             ('the button updater', JS_ANCHOR, JS_NEW),
             ('the button call site', WIRE_ANCHOR, WIRE_NEW),
             ('the press handler', CLICK_ANCHOR, CLICK_NEW)]
    for name, anchor, _rep in steps:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times, expected 1.'
                     % (name, html.count(anchor)))
    for _name, anchor, rep in steps:
        html = html.replace(anchor, rep, 1)
    return html, ['the BACK OFF button and the ring, which nothing could reach before']


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        html, healed = repair(html)
        html, notes = refresh_all(html)
        healed += notes
        html, n2 = section_two(html)
        healed += n2
        if healed:
            open(CITY, 'w', encoding='utf-8').write(html)
            print('  REPAIRED  ' + CITY + '  -- put back: ' + '; '.join(healed))
        else:
            print('  already applied  ' + CITY)
        return
    steps = [('the wildlife pass', ANCHOR, NEW),
             ('the pass call site', CALL_ANCHOR, CALL_NEW)]
    for name, anchor, _rep in steps:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1. '
                     'Run tools/bohemia_city_wildlife_patch.py first.'
                     % (name, html.count(anchor), CITY))
    if html.count(MOD_ANCHOR) != 1:
        sys.exit('FAILED: the day-loop banner resolves %d times, expected 1.'
                 % html.count(MOD_ANCHOR))
    html = html.replace(MOD_ANCHOR, module_body() + MOD_ANCHOR, 1)
    for _name, anchor, rep in steps:
        html = html.replace(anchor, rep, 1)
    html, notes = refresh_all(html)
    html, n2 = section_two(html)
    notes += n2
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  (the pack does not want to fight you)'
          + ('  [+ ' + '; '.join(notes) + ']' if notes else ''))


if __name__ == '__main__':
    main()
