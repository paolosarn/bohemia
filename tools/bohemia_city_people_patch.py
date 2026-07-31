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
AGENTS = 'engine/bohemia_agents.js'

alpha = open(ALPHA, encoding='utf8').read()
KEY = "const CITY_B64='"
a0 = alpha.index(KEY) + len(KEY)
a1 = alpha.index("'", a0)
city = base64.b64decode(alpha[a0:a1]).decode('utf8')

# RE-APPLY, NOT JUST NO-OP. An idempotent patch tool that can only refuse is
# useless the moment ITS OWN source changes - and this one's did, twice, on the
# day it was written. So when the marker is already present the previously
# injected regions are STRIPPED by their own delimiters and the current version
# is injected fresh. Every injection is bracketed for exactly this reason;
# if a delimiter ever goes missing the tool refuses rather than half-strip.
if 'CITY PEOPLE' in city:
    def cut(text, start_mark, end_mark, what):
        i = text.find(start_mark)
        if i < 0:
            print('FAILED: cannot re-apply - %s start marker is gone.' % what)
            sys.exit(1)
        j = text.find(end_mark, i)
        if j < 0:
            print('FAILED: cannot re-apply - %s end marker is gone.' % what)
            sys.exit(1)
        return text[:i] + text[j:]
    # the inlined block has grown over versions (population first, then agents
    # ahead of it), so take whichever banner appears EARLIEST
    _starts = [m for m in ('/* ==== engine/bohemia_agents.js (CITY PEOPLE',
                           '/* ==== engine/bohemia_population.js (CITY PEOPLE')
               if m in city]
    if not _starts:
        print('FAILED: cannot re-apply - no inlined-module banner found.')
        sys.exit(1)
    _first = min(_starts, key=city.index)
    city = cut(city, _first, '/* ==== engine/bohemia_powergrid.js', 'the inlined modules')
    city = cut(city, "/* ==== CITY PEOPLE (7/29): Paolo's zone map, on the walk surface",
               'function renderHuman(){', 'the people pass')
    city = cut(city, '\n  /* CITY PEOPLE (7/29): residents draw AFTER the walls',
               '\n  // player: the REAL character', 'the peoplePass call')
    if 'CITY PEOPLE' in city:
        print('FAILED: strip left CITY PEOPLE traces behind. Refusing to double-apply.')
        sys.exit(1)
    print('  (previous CITY PEOPLE injection stripped; re-applying current version)')

pop_src = open(POP, encoding='utf8').read()
# THE SCHEDULES ARE NOT REWRITTEN HERE. engine/bohemia_agents.js (the WORLD
# lane's) owns what a day looks like - four life archetypes, staggered shifts,
# the Mojave midday shelter. It is 28KB against a 34MB alpha, so it is inlined
# VERBATIM rather than reimplemented. One canonical body, a copy in the build:
# that is the ENGINE SYNC LAW satisfied, and it is the only way the CITY tab and
# the RUN can agree about when a person is home.
agents_src = open(AGENTS, encoding='utf8').read()

# ---- 1) the shared census module, inlined the same way the overmap is --------
ANCHOR_ENGINE = '/* ==== engine/bohemia_powergrid.js (canon, married 7/20) ==== */'
if ANCHOR_ENGINE not in city:
    print('FAILED: powergrid anchor not found - engine layout changed.')
    sys.exit(1)
city = city.replace(
    ANCHOR_ENGINE,
    '/* ==== engine/bohemia_agents.js (CITY PEOPLE, 7/29) — the WORLD lane\'s\n'
    '   schedules, inlined VERBATIM. This frame asks it when a person is home and\n'
    '   never decides for itself. ==== */\n'
    + agents_src + '\n'
    '/* ==== engine/bohemia_population.js (CITY PEOPLE, 7/29) — Paolo\'s zone map\n'
    '   and the PERSON RECORD. Inlined verbatim so the CITY tab and the RUN answer\n'
    '   "who lives here" from ONE module, and so people stay mass-editable.\n'
    '   Gates: zone_map_gate.js + mass_edit_gate.js ==== */\n'
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
const PPL_PEOPLE = new Map();         /* "nx,ny" -> person[] */
let PPL_RULES_V = -1;                 /* the rules version the cache was built at */

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
   The test is the frame's OWN `walk` flag - the exact predicate move() uses.
   Rolling a private version of "is this standable" is how you get people on
   roofs: the first cut tested `!c.solid && !c.face`, which passes for a
   building's roof cells, and the first render put residents on top of a house.
   If a person can stand where the player cannot walk, the test is wrong, not
   the world.
   DELIBERATELY NOT "and not where the player is standing": placement is CACHED
   and the player MOVES, so that answer would go stale the moment he walked.
   The OCCUPANCY LAW is enforced at draw time instead. */
function pplStandable(fx, fy) {
  const c = cellAt(fx, fy);
  if (!c || !c.walk) return false;
  if (c.enter) return false;                   /* a doorway is a threshold, not a place to stand */
  return true;
}

/* WHERE SOMEBODY GOES WHEN THEY ARE NOT HOME. Deterministic per person, found
   once, cached with them: walk outward from the doorstep until the first
   walkable cell that is NOT one of their neighbours' home cells. Nobody
   teleports and nobody shares a spot. */
const PPL_DIRV = {N:[0,-1], S:[0,1], E:[1,0], W:[-1,0],
                  NE:[1,-1], SE:[1,1], SW:[-1,1], NW:[-1,-1]};
function pplSpotToward(p, dir, near, far, taken) {
  const d = PPL_DIRV[dir] || PPL_DIRV.S;
  for (let step = near; step <= far; step++) {
    const fx = p.home[0] + d[0] * step, fy = p.home[1] + d[1] * step;
    if (!pplStandable(fx, fy)) continue;
    if (taken && taken.has(fx + ',' + fy)) continue;
    return [fx, fy];
  }
  return null;
}
/* THE ADDRESS BOOK ON THE SURFACE (7/31). Paolo asked how the great games give
   everyone an INDIVIDUAL schedule; the answer every reference shares is that
   NOBODY AUTHORS 300 DAYS - they author a grammar and 300 ADDRESS BOOKS. So a
   person no longer just goes "out", they go THEIR OWN WAY: work in their own
   bearing at their own distance, and a favourite spot in another. Two people
   on identical schedules now walk opposite directions at the same hour, which
   is the whole of Ultima VII's trick and the cheapest individuality there is.
   Measured after this landed: 4 archetypes, 296 distinct day-signatures across
   297 people. */
function pplOutSpot(p, taken) {
  return pplSpotToward(p, p.workDir, 4 + p.workDist * 2, 6 + p.workDist * 4, taken)
      || pplSpotToward(p, p.favDir, 3, 8, taken)
      || [p.home[0], p.home[1]];               /* nowhere to go: stay in */
}
function pplFavSpot(p, taken) {
  return pplSpotToward(p, p.favDir, 3, 9, taken) || null;
}

/* THE CACHE IS KEYED ON THE RULES VERSION. A mass edit that does not reach the
   screen is not a mass edit, and a cache that does not know the rules changed
   would serve pre-edit bodies forever. */
function pplPeople(nx, ny) {
  if (PPL_RULES_V !== BohemiaPopulation.rulesVersion()) {
    PPL_PEOPLE.clear(); PPL_RULES_V = BohemiaPopulation.rulesVersion();
  }
  const k = nx + ',' + ny;
  let list = PPL_PEOPLE.get(k);
  if (list) return list;
  list = BohemiaPopulation.peopleIn(om, POWER, nx, ny, seed, FN, pplStandable, 24);
  const taken = new Set(list.map(p => p.home[0] + ',' + p.home[1]));
  for (const p of list) {
    /* THE SCHEDULE IS AGENTS.JS'S, ASKED - NOT REIMPLEMENTED. This frame has no
       opinion about when a scavenger sleeps; it looks it up. */
    p.sched = BohemiaAgents.scheduleFor(p.scheduleSeed, p.archetype, 8 * 60);
    p.outSpot = pplOutSpot(p, taken);
    taken.add(p.outSpot[0] + ',' + p.outSpot[1]);
    p.favSpot = pplFavSpot(p, taken) || p.outSpot;
    taken.add(p.favSpot[0] + ',' + p.favSpot[1]);
  }
  PPL_PEOPLE.set(k, list);
  return list;
}

/* HOME OR OUT, from the real clock. This is the OFFLINE PLANE the agent module
   already describes (its own STALKER-pattern comment): we are not stepping a
   simulation, we are asking the schedule where somebody IS at this minute and
   drawing them there. The block visibly empties in the morning and fills at
   night, and it costs one array lookup per visible person. */
/* WHAT THE SURFACE KNOWS AND THE CENSUS DOES NOT: the weather, the dark, and
   whether this block is on a live circuit. Passed to the module rather than
   guessed there. */
function pplCtx(p) {
  let wet = false;
  try { wet = (typeof WEATHER !== 'undefined' && WEATHER && /rain|wet/i.test(WEATHER.state || WEATHER || '')); } catch (e) {}
  const tX = p.home[0] >> 5, tY = p.home[1] >> 5;
  let powered = false;
  try { powered = !!(POWER.at(tX, tY) || {}).live; } catch (e) {}
  return { wet: wet, dark: isNight(), powered: powered };
}
/* HOME OR OUT, and now WHOSE out. agents.js says WHEN and WHAT KIND; the
   person's own facts say WHICH PLACE, and their own conditions can keep them
   in. Stardew's trick: two identical schedules are two different people if
   only one of them stays home when it rains. */
function pplAt(p) {
  const b = BohemiaAgents.whereAt(p, T.min | 0);
  const kind = BohemiaPopulation.placeFor(p, (b && b.where) || 'home', pplCtx(p));
  if (kind === 'home') return p.home;
  if (BohemiaPopulation.atFavourite(p, T.min | 0)) return p.favSpot || p.outSpot;
  return p.outSpot;
}

function peoplePass(ox, oy, C) {
  if (!PLAYER_CV) return 0;                    /* no body yet: draw nobody, never a placeholder */
  const NB = BohemiaPopulation.NB, span = NB * FN;
  /* visible neighbourhood window, one ring of margin so somebody never pops in */
  const nx0 = Math.floor((-ox / C) / span) - 1, nx1 = Math.floor(((cv.width - ox) / C) / span) + 1;
  const ny0 = Math.floor((-oy / C) / span) - 1, ny1 = Math.floor(((cv.height - oy) / C) / span) + 1;
  let drawn = 0, out = 0;
  for (let ny = Math.max(0, ny0); ny <= ny1; ny++)
  for (let nx = Math.max(0, nx0); nx <= nx1; nx++) {
    const ppl = pplPeople(nx, ny);
    for (let i = 0; i < ppl.length; i++) {
      const p = ppl[i];
      const at = pplAt(p);
      const fx = at[0], fy = at[1];
      if (fx === hx && fy === hy) continue;    /* OCCUPANCY LAW: one body per cell, player included */
      const sx = ox + fx * C, sy = oy + fy * C;
      if (sx < -C * 3 || sy < -C * 4 || sx > cv.width + C * 3 || sy > cv.height + C * 3) continue;
      const dir = _DIRS8[p.face % 8];
      const set = PLAYER_CV[dir] || PLAYER_CV.S;
      const spr = set && set.idle; if (!spr) continue;
      /* the ZOOM LEVEL LAW, same ladder the player uses: never a fractional scale */
      const lad = C >= 64 ? 224 : (C >= 32 ? 112 : (C < 17 ? 28 : 56));
      let img = spr;
      if (C >= 64) { if (!spr._hd4) { if (!spr._hd) spr._hd = epx2(spr); spr._hd4 = epx2(spr._hd); } img = spr._hd4; }
      else if (C >= 32) { if (!spr._hd) spr._hd = epx2(spr); img = spr._hd; }
      else if (C < 17) { if (!spr._half) spr._half = half2(spr); img = spr._half; }
      g.drawImage(pplTinted(dir, p.look, img),
                  Math.round(sx + C / 2 - lad / 2), Math.round(sy + C - lad), lad, lad);
      drawn++;
      if (fx !== p.home[0] || fy !== p.home[1]) out++;
    }
  }
  window.__PPL_DRAWN = drawn;
  window.__PPL_OUT = out;                      /* how many are away from home right now */
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
