#!/usr/bin/env python3
"""BOHEMIA THE VALLEY HAS ANIMALS IN IT (8/28/26, PEOPLE lane) -- ALIVE-1's other
half, and the half a number could never fix.

REUSE CHECK: this file makes canvases, so it owes one. It opened
slices/BOHEMIA_CITY_PROPS.js and read every prop id in it -- bag, barrel,
barricade, bench, bin, bollard, car, cone, dumpster, firebarrel, lamp,
lighttower, mailbox, pallet, pole, rubble, tyre -- and swept banks/ for raven,
coyote, pigeon and rat. THERE IS NOT ONE ANIMAL IN THE REPO. So it draws NO
pixels of its own: every pixel it puts on the glass comes out of
banks/BOHEMIA_WILDLIFE_SPRITES.js, which tools/bohemia_wildlife_factory.py cooks
and which carries its own REUSE CHECK for the same sweep.

MEASURED 8/28: at the TOP of the population slider, ~96,885 people, twenty-three
walks in thirty-two still meet nobody, because the valley is ~151 square
kilometres and a step is a metre. AMBIENCE DOES NOT NEED A CENSUS. A resident has
to live somewhere in all of that and be found; a raven is placed NEXT TO THE
PLAYER, so the scale that beats the slider does not apply here at all.

His 8/25 bestiary research said it before any of this was built: "the reason the
city feels dead is not that we lack enemies. It is that we lack ANIMALS ... Tier
1 is mostly not an enemy system at all. It is set dressing that moves, and it is
the cheapest fix on this list for the loudest complaint on his list."

WHAT THIS PUTS IN THE CITY:

1. THE PROBE. The module is pure and never touches a canvas: it asks the surface
   what one cell is like (walkable, how open, is there something solid beside
   it) and decides from that. So a species lands wherever the valley happens to
   look right, and no district name is hard-coded anywhere.

2. THE PASS, right after the people. Same visible window, same culling, same
   BARK_DREW discipline so a gate can read what was actually blitted.

3. THE REACTION, which is the whole point. Two distances, because that is the
   ethology: the animal NOTICES you at one range (its head comes up, it turns to
   face you) and LEAVES at a shorter one. A bird that sits there is scenery.

4. AND THEY STAY GONE. Once something has flushed it does not pop back the
   moment you step away, or the street becomes a fruit machine. It is gone for
   that hour, remembered per cell, and it costs one set.

  python3 tools/bohemia_city_wildlife_patch.py

Gate: gates/wildlife_gate.js
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
CITY = 'slices/BOHEMIA_CITY_WORLD.html'
MARK = '__CITY_WILDLIFE__'

MOD_ANCHOR = '/* ==== engine/bohemia_demoquests.js ==== */'
MOD_SRC = 'engine/bohemia_wildlife.js'
MOD_BANNER = '/* ==== engine/bohemia_wildlife.js ==== */'
BANK_SRC = 'banks/BOHEMIA_WILDLIFE_SPRITES.js'
BANK_BANNER = '/* ==== banks/BOHEMIA_WILDLIFE_SPRITES.js ==== */'

# ---- the pass, parked next to the people pass it runs beside -----------------
ANCHOR = """function peoplePass(ox, oy, C) {"""

NEW = r"""/* ==== __CITY_WILDLIFE__ : TIER 1, THE THINGS THAT LIVE HERE ==================
   ALIVE-1's other half. The population slider cannot make a street feel
   inhabited -- measured, twenty-three walks in thirty-two meet nobody even at
   the top of it -- because the valley is 151 square kilometres. THIS DOES NOT
   HAVE THAT PROBLEM: a raven is placed next to the player, not somewhere in the
   valley to be found.
   ========================================================================== */
var WILD_SPR = null, WILD_CV = {}, WILD_GONE = {}, WILD_DREW = [];

/* WHAT ONE CELL IS LIKE, answered by the surface because only the surface
   knows. The module is pure and asks; it never reads a canvas itself. */
function wildProbe(x, y) {
  var c = cellAt(x, y);
  if (!c || !c.walk || c.enter) return null;
  var open = 0, edge = false;
  for (var dy = -2; dy <= 2; dy++) for (var dx = -2; dx <= 2; dx++) {
    if (!dx && !dy) continue;
    var n = cellAt(x + dx, y + dy);
    if (n && n.walk && !n.enter) open++;
    else if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) edge = true;
  }
  /* FOOD IS NOT WIRED YET AND THE GATE SAYS SO. The measured crow finding (a
     feeding bird alerts later and flushes closer) is built into the module and
     dormant here, because nothing in this world is marked as food. When a
     carcass exists -- tier 2 -- this is the one line that turns it on. */
  return { walk: true, open: open, edge: edge, food: false };
}

function wildSprites() {
  if (WILD_SPR) return WILD_SPR;
  if (typeof BOHEMIA_WILDLIFE_SPRITES === 'undefined') return null;
  WILD_SPR = BOHEMIA_WILDLIFE_SPRITES;
  return WILD_SPR;
}

/* ONE CANVAS PER ANIMAL PER FRAME, built once. The bank is palette-indexed
   run-length, which is small in the file and has to be unpacked exactly once. */
function wildCanvas(id, frame) {
  var k = id + ':' + frame, got = WILD_CV[k];
  if (got !== undefined) return got;
  var B = wildSprites(); if (!B) return (WILD_CV[k] = null);
  var an = null;
  for (var i = 0; i < B.animals.length; i++) if (B.animals[i].id === id) an = B.animals[i];
  if (!an || !an.frames[frame]) return (WILD_CV[k] = null);
  var rle = an.frames[frame], flat = [], j;
  for (j = 0; j < rle.length; j += 2) for (var n = 0; n < rle[j + 1]; n++) flat.push(rle[j]);
  var cv2 = document.createElement('canvas');
  cv2.width = B.w; cv2.height = B.h;
  var g2 = cv2.getContext('2d');
  var img = g2.createImageData(B.w, B.h), d = img.data;
  for (j = 0; j < flat.length; j++) {
    var v = flat[j]; if (!v) continue;
    var hex = B.palette[v]; if (!hex) continue;
    d[j * 4] = parseInt(hex.substr(1, 2), 16);
    d[j * 4 + 1] = parseInt(hex.substr(3, 2), 16);
    d[j * 4 + 2] = parseInt(hex.substr(5, 2), 16);
    d[j * 4 + 3] = 255;
  }
  g2.putImageData(img, 0, 0);
  return (WILD_CV[k] = cv2);
}

/* HOW MANY OF THEM THE VALLEY IS ALLOWED. His to move, printed by the gate, and
   deliberately the only number in this feature that is not read off ethology. */
var WILD_DENSITY = 1.0;

function wildPass(ox, oy, C) {
  WILD_DREW = [];
  var B = wildSprites(); if (!B) return 0;
  if (typeof BohemiaWildlife === 'undefined') return 0;
  var min = 0; try { min = T.min | 0; } catch (_e) {}
  var hour = Math.floor(min / 60);
  var seeR = Math.ceil(Math.max(cv.width, cv.height) / C / 2) + 4;
  var list;
  try {
    list = BohemiaWildlife.near({ seed: (typeof seed !== 'undefined' ? seed : 0),
      at: [hx, hy], minute: min, radius: seeR, probe: wildProbe,
      density: WILD_DENSITY });
  } catch (_e) { return 0; }
  var drawn = 0;
  for (var i = 0; i < list.length; i++) {
    var s = list[i];
    /* AND THEY STAY GONE. A flushed animal that reappeared the moment you
       stepped back would make the street a fruit machine instead of a place. */
    var gk = s.at[0] + ',' + s.at[1] + ',' + hour;
    if (s.state === 'gone') { WILD_GONE[gk] = 1; continue; }
    if (WILD_GONE[gk]) continue;
    var frame = s.state === 'alert' ? 'look' : 'rest';
    var spr = wildCanvas(s.species, frame); if (!spr) continue;
    var sx = ox + s.at[0] * C, sy = oy + s.at[1] * C;
    if (sx < -C * 3 || sy < -C * 4 || sx > cv.width + C * 3 || sy > cv.height + C * 3) continue;
    /* THE SIZE LADDER, the same one the player and the residents use: never a
       fractional scale, so nothing in this world is ever resampled. */
    var lad = C >= 64 ? 64 : (C >= 32 ? 32 : (C < 17 ? 8 : 16));
    var onGlass = false;
    for (var k = 0; k < s.count; k++) {
      /* a flock is spread deterministically, so the same three ravens sit in
         the same three places every time you come round that corner */
      var jx = (BohemiaWildlife.hash(seed, s.at[0], s.at[1], k) * 2 - 1) * C * 0.8;
      var jy = (BohemiaWildlife.hash(seed, s.at[1], s.at[0], k + 9) * 2 - 1) * C * 0.5;
      var dx0 = Math.round(sx + C / 2 - lad / 2 + jx), dy0 = Math.round(sy + C - lad + jy);
      g.drawImage(spr, dx0, dy0, lad, lad);
      drawn++;
      /* *** RECORD ONLY WHAT LANDED ON THE GLASS. *** The cull above allows a
         three-tile margin so nothing pops into existence at the edge, which is
         right for DRAWING and wrong for a record: the first cut pushed every
         sighting into WILD_DREW, so a probe walking the street reported a flock
         it could not see, seven cells past the right edge. A CLAIM THAT COUNTS
         THE THING INSTEAD OF READING IT, in the newest code in the file. */
      if (dx0 + lad > 0 && dy0 + lad > 0 && dx0 < cv.width && dy0 < cv.height) onGlass = true;
    }
    if (onGlass) WILD_DREW.push(s);
  }
  return drawn;
}

function peoplePass(ox, oy, C) {"""

# the call site: right after the people are drawn, so animals sit over the same
# ground and inside the same visible window
CALL_ANCHOR = """  peoplePass(ox,oy,C);
  try{ ctWitnessPass(); }catch(_e){}   /* __CITY_MEMORY__ */"""
CALL_NEW = """  peoplePass(ox,oy,C);
  try{ ctWitnessPass(); }catch(_e){}   /* __CITY_MEMORY__ */
  /* __CITY_WILDLIFE__ -- and then whatever else lives here. AFTER THE WITNESS
     PASS, not before it: ctWitnessPass reads what peoplePass just drew, and
     city_memory_gate holds those two ADJACENT on purpose. The first cut of this
     patch sat between them and turned that claim red -- a witness organ is about
     PEOPLE seeing things, and a pigeon has no business standing in the middle of
     it. After the people for the drawing too: a bird on a wall is behind nobody,
     and if this ever throws the valley keeps its residents. */
  try { wildPass(ox, oy, C); } catch(_e){}"""


def module_body():
    body = open(MOD_SRC, encoding='utf-8').read()
    if not body.endswith('\n'):
        body += '\n'
    bank = open(BANK_SRC, encoding='utf-8').read()
    if not bank.endswith('\n'):
        bank += '\n'
    return (MOD_BANNER + '\n' + body + MOD_BANNER + '\n'
            + BANK_BANNER + '\n' + bank + BANK_BANNER + '\n')


def repair(html):
    """PUT THE MODULE BACK IF SOMETHING TOOK IT OUT, checked on its own banner
    rather than on the patch marker, because a one-shot patch that no-ops on its
    own marker cannot heal. On 8/27 another lane's tool cut 103 lines of an
    inlined module out of this file and left every call site in place."""
    healed = []
    if MOD_BANNER not in html or BANK_BANNER not in html:
        if html.count(MOD_ANCHOR) != 1:
            sys.exit('FAILED: cannot repair -- the day-loop banner resolves %d times.'
                     % html.count(MOD_ANCHOR))
        html = html.replace(MOD_ANCHOR, module_body() + MOD_ANCHOR, 1)
        healed.append('the inlined wildlife module and its sprite bank')
    return html, healed


def main():
    html = open(CITY, encoding='utf-8').read()
    if MARK in html:
        html, healed = repair(html)
        if healed:
            open(CITY, 'w', encoding='utf-8').write(html)
            print('  REPAIRED  ' + CITY + '  -- put back: ' + '; '.join(healed))
        else:
            print('  already applied  ' + CITY)
        return
    steps = [('the people pass', ANCHOR, NEW),
             ('the pass call site', CALL_ANCHOR, CALL_NEW)]
    for name, anchor, _rep in steps:
        if html.count(anchor) != 1:
            sys.exit('FAILED: %s resolves %d times in %s, expected 1.'
                     % (name, html.count(anchor), CITY))
    if html.count(MOD_ANCHOR) != 1:
        sys.exit('FAILED: the day-loop banner resolves %d times, expected 1.'
                 % html.count(MOD_ANCHOR))
    html = html.replace(MOD_ANCHOR, module_body() + MOD_ANCHOR, 1)
    for _name, anchor, rep in steps:
        html = html.replace(anchor, rep, 1)
    open(CITY, 'w', encoding='utf-8').write(html)
    print('  patched  ' + CITY + '  (the valley has animals in it)')


if __name__ == '__main__':
    main()
