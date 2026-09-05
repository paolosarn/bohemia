#!/usr/bin/env python3
"""
THERE ARE ENEMIES ON THE STREET (9/5/26, RUN lane)

PAOLO PLAYED IT: "Awesome I just played the run. Where the enemies at bro."
Ruling: records/BOHEMIA_RULING_WHERE_THE_ENEMIES_AT_9_5_26.md
VAMILY row: RUN [enemies exist] THERE-ARE-NO-ENEMIES-ON-THE-STREET.

WHAT THIS PATCH DOES, and every piece of it is wiring rather than invention:

1. INLINES engine/bohemia_hostiles.js VERBATIM into the walked city. ENGINE SYNC
   LAW: the body in the slice is the body in engine/, byte for byte, and the
   gate compares them. Same as the encounters module on 8/27.

2. GROUND OWNERSHIP, read off the bases the run already placed. A fine cell
   belongs to whichever baked base is nearest in overmap cells and within
   REACH_CELLS (12), which is the SAME constant bohemia_agents uses for a base's
   pull. No second placement rule: the Cartel living in two places depending on
   which surface you stand on is a bug this repo has fixed four times.

3. hostileProbe(), which is wildProbe plus the faction of the ground. One probe
   body, so the corridor rule cannot come to mean two different things.

4. hostilePass(), drawn with THE BODIES THAT ALREADY EXIST -- ctBody() and the
   player sprite ladder, exactly as peoplePass draws a resident. No new art, no
   cook, no new sprite bank. A crew is people, and the people are already drawn.

5. THEY CLOSE. At 'close' they are drawn on the ring cells around you rather
   than on their corner, which is the packs module's own rule reused so that
   backing into an alley means the same thing whoever is coming.

6. NO DAMAGE. Nothing here touches health, and the module cannot return
   'attacks'. COMBAT owns contact ([street fight], routed the same round).

IDEMPOTENT. Anchors are asserted to match exactly once, and the mark is checked
first so a second run is a no-op.
"""
import re, sys, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CITY = os.path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html')
ENGINE = os.path.join(ROOT, 'engine/bohemia_hostiles.js')
MARK = '__THERE_ARE_ENEMIES__'


def main():
    src = open(CITY, encoding='utf8').read()
    if MARK in src:
        print('  already applied (%s present) -- nothing to do' % MARK)
        return 0

    body = open(ENGINE, encoding='utf8').read()

    # ---- 1. inline the module, verbatim, beside the packs module ------------
    anchor_mod = '/* ==== __CITY_WILDLIFE__ : TIER 1, THE THINGS THAT LIVE HERE =================='
    assert src.count(anchor_mod) == 1, 'module anchor %d' % src.count(anchor_mod)
    inlined = (
        '/* ==== engine/bohemia_hostiles.js ==== */\n'
        + body.rstrip('\n') + '\n'
        + '/* ==== engine/bohemia_hostiles.js ==== */\n\n'
        + anchor_mod)
    src = src.replace(anchor_mod, inlined, 1)

    # ---- 2..5. the surface half -------------------------------------------
    anchor_pass = 'function peoplePass(ox, oy, C) {'
    assert src.count(anchor_pass) == 1, 'pass anchor %d' % src.count(anchor_pass)
    surface = r'''/* ==== ''' + MARK + r''' : PEOPLE ON THE STREET WHO MEAN IT (9/5) ==========
   Paolo played the run and asked where the enemies are. They were nowhere: every
   "hostile" string in this file is prose, and hostility existed only as a sign on
   a relationship in the ledger. This is the body.
   NO DAMAGE BEFORE THE DIAL. Nothing below touches health and the module it calls
   has no state that means "attacks". COMBAT owns what happens on contact.
   ========================================================================== */
var HOST_DREW = [], HOST_DENSITY = 1.0, HOST_DANGER = null, HOST_OWNER = {};

/* WHOSE CORNER IS THIS. The bases the RUN already placed, and nothing new.
   Cached per overmap cell because it is asked once per candidate spot.

   *** AND THE FIRST VERSION OF THIS PUT EVERY ENEMY IN THE GAME THOUSANDS OF
   CELLS FROM WHERE HE STARTS, WHICH IS THE BUG HE REPORTED. *** It used the
   agents module's REACH_CELLS (12) as a hard cutoff, so ground more than twelve
   overmap cells from a base belonged to nobody and could hold no crew. Measured:
   the player spawns in cell (48,48); the nearest base of any kind is Colorful at
   (34,33), FIFTEEN cells away, so the whole starting neighbourhood is nobody's;
   and the nearest base of an outfit that is actually at odds is Remnants at
   (74,70), TWENTY-SIX cells, which is about 3,300 walked cells. He would have
   finished the demo three times before meeting one.
   REACH_CELLS answers a different question -- how far a base's PULL carries when
   deciding who a resident runs with -- and borrowing it for "can a crew stand
   here" was reasoning by proximity of name. A crew is not a resident. People at
   odds with somebody move through the whole valley.
   SO: the corner belongs to the nearest outfit THAT IS AT ODDS, with no cutoff.
   Every corner has a nearest one, so a crew can be anywhere; which outfit you
   meet still depends on where you are standing, so territory still colours it;
   and if nobody is at odds with anybody there are no crews at all. */
function hostOwnerAt(fx, fy, danger){
  var cx = Math.floor(fx / FN), cy = Math.floor(fy / FN);
  var k = cx + ',' + cy;
  if (HOST_OWNER[k] !== undefined) return HOST_OWNER[k];
  var bases = null;
  try { bases = ctBases(); } catch(_e) {}
  if (!bases) return null;              /* NOT cached: the bases may not be up yet */
  danger = danger || hostDanger();
  if (!danger || !danger.length) return null;   /* also not cached, same reason */
  var ok = {};
  for (var i = 0; i < danger.length; i++) ok[danger[i].id] = 1;
  var best = null, bd = 1e9;
  for (var id in bases) {
    var b = bases[id];
    if (!b || !ok[id]) continue;
    var d = Math.max(Math.abs(b.x - cx), Math.abs(b.y - cy));
    if (d < bd) { bd = d; best = id; }
  }
  return (HOST_OWNER[k] = best);
}

/* THE PROBE IS wildProbe PLUS WHOSE GROUND IT IS. Built on the same body rather
   than beside it, so "open" cannot come to mean two things. */
function hostileProbe(x, y){
  var g = wildProbe(x, y);
  if (!g) return null;
  g.faction = hostOwnerAt(x, y, hostDanger());
  return g;
}

/* WHO PUTS CREWS OUT. Computed once per session: it reads the canon graph and
   your own outfit, and neither moves inside a walk. */
function hostDanger(){
  if (HOST_DANGER && HOST_DANGER.length) return HOST_DANGER;
  /* *** NEVER CACHE AN EMPTY ANSWER. *** The first cut cached whatever the first
     call produced, and the first call happens while the page is still parsing:
     BohemiaBetween is defined near the END of this file, so an early frame
     computed "nobody is dangerous", cached it, and the street stayed empty for
     the whole session with nothing anywhere going red. A cache that can hold
     the answer "the dependency was not loaded yet" is a cache that turns a
     timing question into a permanent fact. */
  if (typeof BohemiaHostiles === 'undefined' || typeof BohemiaBetween === 'undefined')
    return [];
  var ids = [], mine = null;
  try { ids = BohemiaBetween.keys() || []; } catch(_e) {}
  try { mine = BohemiaBetween.mine(); } catch(_e) {}
  try {
    HOST_DANGER = BohemiaHostiles.dangerous({ ids: ids, mine: mine,
      between: function(a, b){ try { return BohemiaBetween.between(a, b); } catch(_e){ return null; } } });
  } catch(_e) { HOST_DANGER = []; }
  return HOST_DANGER;
}

function hostilePass(ox, oy, C){
  HOST_DREW = [];
  if (typeof BohemiaHostiles === 'undefined') return 0;
  if (!PLAYER_CV) return 0;               /* no body yet: draw nobody, never a placeholder */
  var danger = hostDanger();
  if (!danger.length) return 0;
  var seeR = Math.ceil(Math.max(cv.width, cv.height) / C / 2) + 6;
  var day = 0; try { day = (T.day | 0); } catch(_e) {}
  var list;
  try {
    list = BohemiaHostiles.near({ seed: (typeof seed !== 'undefined' ? seed : 0),
      at: [hx, hy], radius: seeR, probe: hostileProbe,
      danger: danger, density: HOST_DENSITY, day: day });
  } catch(_e) { return 0; }
  var drawn = 0;
  for (var i = 0; i < list.length; i++) {
    var cw = list[i];
    var st = BohemiaHostiles.stateOf(cw, [hx, hy]);
    cw.state = st;
    var ringCells = null;
    if (st === 'close') { try { ringCells = BohemiaHostiles.ring(cw, [hx, hy], hostileProbe); } catch(_e) {} }
    var onGlass = false;
    for (var k = 0; k < cw.count; k++) {
      /* WHERE THIS ONE IS STANDING. On their corner, spread deterministically so
         the same three are in the same three places every time you come round it;
         or on the ring, when they are coming. */
      var fx = cw.at[0], fy = cw.at[1], jx = 0, jy = 0;
      if (ringCells && ringCells[k]) { fx = ringCells[k][0]; fy = ringCells[k][1]; }
      else {
        jx = (BohemiaHostiles.hash(cw.at[0], cw.at[1], k, 1) * 2 - 1) * C * 1.2;
        jy = (BohemiaHostiles.hash(cw.at[1], cw.at[0], k, 2) * 2 - 1) * C * 0.8;
      }
      if (fx === hx && fy === hy) continue;   /* OCCUPANCY LAW: one body per cell */
      var sx = ox + fx * C, sy = oy + fy * C;
      if (sx < -C * 3 || sy < -C * 4 || sx > cv.width + C * 3 || sy > cv.height + C * 3) continue;
      /* THEY LOOK AT YOU. The facing is toward the player, which is the whole
         read at a glance: a body that means you harm is pointed at you. */
      var dir = 'S';
      try { dir = dirOf(Math.sign(hx - fx), Math.sign(hy - fy)) || 'S'; } catch(_e) {}
      /* THE BODIES THAT ALREADY EXIST. Same ladder, same sprite path the
         residents use -- no new art, and nothing here was cooked for this. */
      var set = PLAYER_CV[dir] || PLAYER_CV.S;
      var spr = set && set.idle; if (!spr) continue;
      var lad = C >= 64 ? 224 : (C >= 32 ? 112 : (C < 17 ? 28 : 56));
      var img = spriteAt(spr, C);
      var dx0 = Math.round(sx + C / 2 - lad / 2 + jx), dy0 = Math.round(sy + C - lad + jy);
      try { g.drawImage(pplTinted(dir, (k * 37 + 11) % 97, img), dx0, dy0, lad, lad); }
      catch(_e) { g.drawImage(img, dx0, dy0, lad, lad); }
      drawn++;
      /* RECORD ONLY WHAT LANDED ON THE GLASS. The cull allows a three-tile
         margin so nobody pops in at the edge, which is right for DRAWING and
         wrong for a record -- tier 1 got this wrong and a probe reported a
         flock it could not see. */
      if (dx0 + lad > 0 && dy0 + lad > 0 && dx0 < cv.width && dy0 < cv.height) onGlass = true;
    }
    if (onGlass) HOST_DREW.push(cw);
  }
  window.__HOST_DRAWN = drawn;
  return drawn;
}

''' + anchor_pass
    src = src.replace(anchor_pass, surface, 1)

    # ---- 6. call it, right where the animals are called --------------------
    anchor_call = "  try { animalPass(ox, oy, C); } catch (_e) { }"
    assert src.count(anchor_call) == 1, 'call anchor %d' % src.count(anchor_call)
    src = src.replace(anchor_call, anchor_call + '\n'
        + '  /* ' + MARK + ': drawn with the people, because they ARE people --\n'
        + '     in front of the road, behind the wall, the same layering rule. */\n'
        + '  try { hostilePass(ox, oy, C); } catch (_e) { }', 1)

    open(CITY, 'w', encoding='utf8').write(src)
    print('  inlined  : engine/bohemia_hostiles.js (%d bytes) verbatim' % len(body))
    print('  added    : hostOwnerAt, hostileProbe, hostDanger, hostilePass')
    print('  hooked   : peoplePass -> hostilePass, beside animalPass')
    print('  wrote    : slices/BOHEMIA_CITY_WORLD.html')
    return 0


if __name__ == '__main__':
    sys.exit(main())
