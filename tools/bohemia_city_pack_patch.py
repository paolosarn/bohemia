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


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        html, healed = repair(html)
        html, notes = refresh_all(html)
        healed += notes
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
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  (the pack does not want to fight you)'
          + ('  [+ ' + '; '.join(notes) + ']' if notes else ''))


if __name__ == '__main__':
    main()
