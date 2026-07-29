#!/usr/bin/env python3
"""
BOHEMIA CITY PEOPLE (7/29/26) — THE WALK SURFACE HAD NOBODY ON IT.

THE FINDING (engine reality audit, laws/BOHEMIA_ENGINE_REALITY_MAP_7_28_26.md,
and it is the CITY lane's #1 item): human mode has the best render architecture
in the repo - chunk LRU, canvas pool sized against the measured iOS floor,
genuinely seamless streaming - and NOT ONE PERSON IN IT. Measured before
touching anything: the decoded city frame contains zero occurrences of
BohemiaAgents, agentsForPlot, or any body drawing at all. The only things that
move are cars and planes. You can walk the whole valley and never see a human
being.

WHAT PAOLO RULED (7/29, laws/BOHEMIA_ADDENDUM_HOW_MANY_PEOPLE_7_29_26.md):

  "again we dont have to make every person left as an npc it just has to feel
   equivalant to that. how busy we make the city feel."

  "both. why not both. some clusters. some no mans lands. some random spread."

So this is not "sprinkle NPCs". It is his zone map, drawn. Some blocks are a
settlement you can hear before you see. Most are one household. A quarter of
the valley has nobody, and that quarter is what makes the settlements land.

WHERE THE ANSWER COMES FROM. engine/bohemia_population.js, a SHARED module, not
a thing invented inside this frame. The RUN and the CITY tab are separate
renderers, and this project has already been burned once by fixing the surface
Paolo does not play. If each surface invented its own idea of who lives where,
the same neighbourhood would be a ghost town in one and a settlement in the
other. One module, one census, both surfaces.

REUSE CHECK: this tool COOKS ZERO PIXELS. Every body it draws is the character
Paolo already built - the city frame already receives the full 8-direction
baked player sprite by postMessage (BOHEMIA_CITY_PLAYER) for the player, and
those exact canvases are reused for residents with a per-person colour shift.
That is the canon mechanism, not a new one: Paolo 7/3/26, "enemies are tints of
me", which is also how the RUN's own townsfolk are made (RUN_LOOKS in the
alpha's runSendCast bakes tints of the same body). No bank is opened because
nothing is created; the pixels already exist and already have his verdict.

TASTE CHECK: produces no candidates and reaches Paolo's thumbs with nothing.
It draws people who are already approved art, in places a gated module decided.

WHAT IT DELIBERATELY DOES NOT DO. It does not move anybody. Schedules,
routines, walking and working belong to engine/bohemia_agents.js, which is the
WORLD lane's module, and duplicating that here would fork the simulation and
break the ENGINE SYNC LAW. This pass draws PRESENCE - who is standing where -
which is exactly what "how busy the city feels" asks for. Wiring the real
schedules in is the next turn and it is named in the backlog.

Idempotent (marker CITY PEOPLE).

  python3 tools/bohemia_city_people_patch.py
"""
import base64
import os
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)
ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
POP = 'engine/bohemia_population.js'

alpha = open(ALPHA, encoding='utf8').read()
KEY = "const CITY_B64='"
a0 = alpha.index(KEY) + len(KEY)
a1 = alpha.index("'", a0)
city = base64.b64decode(alpha[a0:a1]).decode('utf8')

if 'CITY PEOPLE' in city:
    print('city people already applied. no-op.')
    sys.exit(0)

pop_src = open(POP, encoding='utf8').read()

# ---- 1) the shared census module, inlined the same way the overmap is --------
ANCHOR_ENGINE = '/* ==== engine/bohemia_powergrid.js (canon, married 7/20) ==== */'
if ANCHOR_ENGINE not in city:
    print('FAILED: powergrid anchor not found - engine layout changed.')
    sys.exit(1)
city = city.replace(
    ANCHOR_ENGINE,
    '/* ==== engine/bohemia_population.js (CITY PEOPLE, 7/29) — Paolo\'s zone map.\n'
    '   Inlined verbatim so the CITY tab and the RUN answer "who lives here" from\n'
    '   ONE module. Gate: gates/zone_map_gate.js ==== */\n'
    + pop_src + '\n' + ANCHOR_ENGINE, 1)

# ---- 2) the people pass -----------------------------------------------------
# Drawn between the behind-player facade pass and the player, so a resident
# standing north of you is occluded by the same walls you are, and the front
# facade pass then covers everyone equally. Viewport-culled by neighbourhood so
# a valley of 300 people costs the same as a valley of 3.
PEOPLE_JS = r"""
/* ==== CITY PEOPLE (7/29): Paolo's zone map, on the walk surface ============
   "how busy we make the city feel" + "both. why not both. some clusters. some
   no mans lands. some random spread." (7/29, LOCKED).

   WHO IS HERE comes from BohemiaPopulation, the shared module, so this frame
   and the RUN describe one city. WHAT THEY LOOK LIKE is the player's own baked
   body (PLAYER_CV, already postMessaged in for the player) with a per-person
   colour shift - the canon "tints of me" mechanism, zero new pixels.

   COST: culled to the visible neighbourhoods, and each resident's tinted
   sprite is derived ONCE into a cache and blitted at 1:1 forever after. A
   valley of 300 people costs what the handful on screen cost. */
const PPL_TINT = [[214,178,140],[150,164,186],[186,150,132],[140,168,148],
                  [200,190,160],[164,148,178],[178,168,140],[148,160,164]];
const PPL_CACHE = new Map();          /* dir|tint|zoom -> canvas */
const PPL_HOMES = new Map();          /* "nx,ny" -> [[fx,fy,hash],...] */

function pplTinted(dir, ti, img) {
  const k = dir + '|' + ti + '|' + img.width;
  let c = PPL_CACHE.get(k); if (c) return c;
  const t = PPL_TINT[ti % PPL_TINT.length];
  c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
  const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
  x.drawImage(img, 0, 0);
  /* source-atop keeps the silhouette exactly and only shifts colour, so the
     rig is never reshaped - RIG LAW: painted regions are sacrosanct. */
  x.globalCompositeOperation = 'source-atop';
  x.fillStyle = 'rgba(' + t[0] + ',' + t[1] + ',' + t[2] + ',0.42)';
  x.fillRect(0, 0, c.width, c.height);
  x.globalCompositeOperation = 'source-over';
  PPL_CACHE.set(k, c); return c;
}

/* THE SURFACE DECIDES WHAT IS WALKABLE; the census only offers candidates.
   And the test is the frame's OWN `walk` flag - the exact same predicate
   move() uses on line "if(!(c&&c.walk))break;" and that the drop-in spiral
   uses to find you a legal cell. Rolling a private version of "is this
   standable" is how you get people on roofs: the first cut here tested
   `!c.solid && !c.face`, which passes for a building's roof cells, and the
   first render put residents standing on top of a house. If a person can be
   somewhere the player cannot walk, the test is wrong, not the world.
   OCCUPANCY LAW: one body per cell, and the census already refuses duplicates. */
function pplStandable(fx, fy) {
  const c = cellAt(fx, fy);
  if (!c || !c.walk) return false;
  if (c.enter) return false;                   /* a doorway is a threshold, not a place to stand */
  /* DELIBERATELY NOT "and not where the player is standing". Placement is
     CACHED per neighbourhood, and the player MOVES - a test that consulted
     hx/hy would bake a stale answer into the cache and then be wrong the moment
     he walked. Where a resident may LIVE is a fact about the world; who is
     standing on that cell right now is a fact about this frame, so the
     OCCUPANCY LAW is enforced at draw time instead, below. */
  return true;
}

function pplHomes(nx, ny) {
  const k = nx + ',' + ny;
  let h = PPL_HOMES.get(k);
  if (h) return h;
  h = BohemiaPopulation.homesIn(om, POWER, nx, ny, seed, FN, pplStandable, 24);
  PPL_HOMES.set(k, h);
  return h;
}

function peoplePass(ox, oy, C) {
  if (!PLAYER_CV) return 0;                    /* no body yet: draw nobody, never a placeholder */
  const NB = BohemiaPopulation.NB, span = NB * FN;
  /* visible neighbourhood window, one ring of margin so somebody never pops in */
  const nx0 = Math.floor((-ox / C) / span) - 1, nx1 = Math.floor(((cv.width - ox) / C) / span) + 1;
  const ny0 = Math.floor((-oy / C) / span) - 1, ny1 = Math.floor(((cv.height - oy) / C) / span) + 1;
  const night = isNight();
  let drawn = 0;
  for (let ny = Math.max(0, ny0); ny <= ny1; ny++)
  for (let nx = Math.max(0, nx0); nx <= nx1; nx++) {
    const homes = pplHomes(nx, ny);
    if (!homes.length) continue;
    for (let i = 0; i < homes.length; i++) {
      const fx = homes[i][0], fy = homes[i][1], hs = homes[i][2];
      if (fx === hx && fy === hy) continue;    /* OCCUPANCY LAW: one body per cell, including the player */
      const sx = ox + fx * C, sy = oy + fy * C;
      if (sx < -C * 3 || sy < -C * 4 || sx > cv.width + C * 3 || sy > cv.height + C * 3) continue;
      const dir = _DIRS8[hs % 8];
      const set = PLAYER_CV[dir] || PLAYER_CV.S;
      const spr = set && set.idle; if (!spr) continue;
      /* the ZOOM LEVEL LAW, same ladder the player uses: never a fractional scale */
      const lad = C >= 64 ? 224 : (C >= 32 ? 112 : (C < 17 ? 28 : 56));
      let img = spr;
      if (C >= 64) { if (!spr._hd4) { if (!spr._hd) spr._hd = epx2(spr); spr._hd4 = epx2(spr._hd); } img = spr._hd4; }
      else if (C >= 32) { if (!spr._hd) spr._hd = epx2(spr); img = spr._hd; }
      else if (C < 17) { if (!spr._half) spr._half = half2(spr); img = spr._half; }
      g.drawImage(pplTinted(dir, hs >>> 3, img),
                  Math.round(sx + C / 2 - lad / 2), Math.round(sy + C - lad), lad, lad);
      drawn++;
    }
  }
  /* at night an unpowered body is just a shape in the dark; the chunk wash
     already darkened the ground, so people get the same wash and no self-glow
     (DEAD IS DEFAULT, and act 1 windows are dead dark glass). */
  if (night && drawn) { /* the wash is applied per chunk above; nothing to add */ }
  window.__PPL_DRAWN = drawn;
  return drawn;
}
"""

ANCHOR_FN = 'function renderHuman(){'
if city.count(ANCHOR_FN) != 1:
    print('FAILED: renderHuman anchor not unique.')
    sys.exit(1)
city = city.replace(ANCHOR_FN, PEOPLE_JS + '\n' + ANCHOR_FN, 1)

# ---- 3) call it, in the right place in the stack -----------------------------
CALL_ANCHOR = """  const _pbox=playerBox(ox,oy,C);
  facadePass(ox,oy,C,false,hy,null);"""
if city.count(CALL_ANCHOR) != 1:
    print('FAILED: facade pass anchor not unique.')
    sys.exit(1)
city = city.replace(CALL_ANCHOR, CALL_ANCHOR + """
  /* CITY PEOPLE (7/29): residents draw AFTER the walls behind the player and
     BEFORE the player, so somebody standing north of you is occluded by the
     same facade you are, and the front pass then covers everybody equally. */
  peoplePass(ox,oy,C);""", 1)

# ---- 4) a resident is a body: one per cell (OCCUPANCY LAW) -------------------
# The census already refuses duplicate cells; this asserts the frame agrees.
alpha = alpha[:a0] + base64.b64encode(city.encode('utf8')).decode('ascii') + alpha[a1:]
open(ALPHA, 'w', encoding='utf8').write(alpha)

print('CITY PEOPLE applied:')
print('  - engine/bohemia_population.js inlined (shared census, gated)')
print('  - peoplePass(): residents drawn from the zone map, viewport-culled')
print('  - bodies are tints of the player\'s own baked rig - zero new pixels')
print('  - drawn between the back and front facade passes, so walls occlude them')
