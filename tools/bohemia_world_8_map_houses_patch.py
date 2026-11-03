#!/usr/bin/env python3
"""THE HOUSES STAND UP CLOSE (WORLD 8, 11/3, ask lines 117 and 185): the map's hooks, marked __THE_HOUSES_STAND_UP_CLOSE__.

Past its old closest stop the same pinch goes on, on the same map and the same corner-on camera (rule 300: never a second
mode): every house lot the painter rolls gets the studio's real model shot from the map's camera (tools/bohemia_world_8_map_houses.py,
slices/map_houses/), the painter lays that lot as its yard so the model stands on it, and the crew walks behind the models.
The module is slices/bohemia_map_houses.js. Run it on a page that has none of these hooks; it refuses a half-hooked page.

  python3 tools/bohemia_world_8_map_houses_patch.py
"""
import os, sys

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(R, 'slices/BOHEMIA_CITY_WORLD.html')
M = '__THE_HOUSES_STAND_UP_CLOSE__'

HOOKS = [
    # H1 the painter: a standing house's lot reported (the first texel of the house) and, when asked, laid as its yard
    ("""          if (lx >= ox && lx < ox + wq && ly >= oy && ly < oy + dq2) {
            var hx = (lgx * LQ + ox) * Q, hy = (lgy * LQ + oy) * Q, fx2 = (tx - hx + 0.5) / (wq * Q), fy2 = (ty - hy + 0.5) / (dq2 * Q);
            var dr = Math.abs((longX ? fy2 : fx2) - 0.5) * 2, wall = (big ? 3 : hl > 0.86 ? 4 : 2) * T;
""",
     """          if (lx >= ox && lx < ox + wq && ly >= oy && ly < oy + dq2) {
            var hx = (lgx * LQ + ox) * Q, hy = (lgy * LQ + oy) * Q, fx2 = (tx - hx + 0.5) / (wq * Q), fy2 = (ty - hy + 0.5) / (dq2 * Q);
            var __mh = !(burned && hh < 0.7) && !(WST && WST[cy * N + cx] === 1) && !(TWN && TWN[cy * N + cx] >= 0);   /* %s (WORLD 8): a standing house, the model's lot (a town paints its own over its blocks) */
            if (__mh && LOTS && tx === hx && ty === hy) LOTS.push(0, gx, gy, hx / S, hy / S, wq * Q / S, dq2 * Q / S, longX ? 1 : 0, hh, lgy * 3 + lgx + (LQ === 4 ? 16 : 0));
            if (__mh && FLATH) { /* the model stands on this yard */ } else {
            var dr = Math.abs((longX ? fy2 : fx2) - 0.5) * 2, wall = (big ? 3 : hl > 0.86 ? 4 : 2) * T;
""" % M),
    ("""            if (part !== PART.hole && part !== PART.burn && dr < 0.34 && Math.abs((longX ? fx2 : fy2) - 0.5) < 0.18) part = PART.window;   /* the chimney by day, the lit window at night */
          }
""",
     """            if (part !== PART.hole && part !== PART.burn && dr < 0.34 && Math.abs((longX ? fx2 : fy2) - 0.5) < 0.18) part = PART.window;   /* the chimney by day, the lit window at night */
            }   /* %s */
          }
""" % M),
    # H2 the painter: a trailer's box reported and laid flat the same way
    ("""          if (ra % 3 === 1 && rb >= 1 && rb < 11 && (rb % 5) < 4) { lift = burned && r < 0.5 ? 0.5 * T : 1.6 * T;""",
     """          if (ra %% 3 === 1 && rb >= 1 && rb < 11 && (rb %% 5) < 4 && LOTS && !burned && !(WST && WST[cy * N + cx] === 1) && !(TWN && TWN[cy * N + cx] >= 0) && (rb === 1 || rb === 5) && tx %% Q === 0 && ty %% Q === 0 && (boxAlongX ? tx : ty) === rb * Q)   /* %s */
            LOTS.push(1, gx, gy, (boxAlongX ? rb : ra) * Q / S, (boxAlongX ? ra : rb) * Q / S, (boxAlongX ? (rb === 1 ? 3 : 4) : 1) * Q / S, (boxAlongX ? 1 : (rb === 1 ? 3 : 4)) * Q / S, boxAlongX ? 1 : 0, vbHash(gx * 7 + ra, gy * 7 + rb, sd + 43), 0);
          if (ra %% 3 === 1 && rb >= 1 && rb < 11 && (rb %% 5) < 4 && FLATH && !burned && !(WST && WST[cy * N + cx] === 1) && !(TWN && TWN[cy * N + cx] >= 0)) { /* the model stands here (%s) */ }
          else if (ra %% 3 === 1 && rb >= 1 && rb < 11 && (rb %% 5) < 4) { lift = burned && r < 0.5 ? 0.5 * T : 1.6 * T;""" % (M, M)),
    # H3 the painter's two flags, read once
    ("""  var Q = Math.max(1, Math.round(S / 12));
""",
     """  var Q = Math.max(1, Math.round(S / 12));
  var LOTS = inp.lots ? [] : null, FLATH = !!inp.flat;   /* %s: the house lots it paints, and whether the models stand on them */
""" % M),
    # H4 the painter's answer carries them, and the worker passes them on
    ("""coli: inp.coli ? COLI : undefined, hs: inp.coli ? HS : undefined };""",
     """coli: inp.coli ? COLI : undefined, hs: inp.coli ? HS : undefined, lots: LOTS, flat: FLATH };   /* %s */""" % M),
    ("""S:t.S,P:t.P,ms:t.ms,day:t.day,lights:t.lights,dep:t.dep}""",
     """S:t.S,P:t.P,ms:t.ms,day:t.day,lights:t.lights,dep:t.dep,lots:t.lots,flat:t.flat}"""),
    ("""S: c.S, P: c.P, ms: c.ms, day: c.day, lights: c.lights, dep: c.dep }); }, 0); }""",
     """S: c.S, P: c.P, ms: c.ms, day: c.day, lights: c.lights, dep: c.dep, lots: c.lots, flat: c.flat }); }, 0); }   /* %s */""" % M),
    # H5 a tile asks for its lots, and for its yards when the models are up; its key says which
    ("""function vbTileKey(tx, ty, S){ return om.seed + ':' + (VBC.key || '') + ':' + S + ':' + tx + ',' + ty; }""",
     """function vbTileKey(tx, ty, S){ return om.seed + ':' + (VBC.key || '') + ':' + S + (vbTileFlat() ? 'f' : '') + ':' + tx + ',' + ty; }   /* %s: a yard tile is its own picture */
function vbTileFlat(){ try { return !!(window.BohemiaMapHouses && BohemiaMapHouses.flat()); } catch (_e) { return false; } }""" % M),
    ("""           jm: jm, xg: xg, rp: rp,
""",
     """           jm: jm, xg: xg, rp: rp, lots: true, flat: vbTileFlat(),   /* %s */
""" % M),
    # H6 the tile keeps them
    ("""dep: r.dep || null, P: r.P, org: r.org, tx: r.tx, ty: r.ty, S: r.S, at: performance.now(), bytes: by, seen: VBT.frame });""",
     """dep: r.dep || null, P: r.P, org: r.org, tx: r.tx, ty: r.ty, S: r.S, at: performance.now(), bytes: by, seen: VBT.frame, lots: r.lots || null, flat: !!r.flat });   /* %s */""" % M),
    # H7 until a tile lands, the same blocks at another detail, with or without the yards (a pinch never blurs back)
    ("""      [128, 96, 60, 36].some(function (s2) { if (s2 === S) return false; var T2 = VBT.tiles.get(pre + s2 + ':' + tx + ',' + ty);""",
     """      [S + (vbTileFlat() ? '' : 'f'), 128, 96, 60, 36, '128f', '96f', '60f'].some(function (s2) { if (s2 === S) return false; var T2 = VBT.tiles.get(pre + s2 + ':' + tx + ',' + ty);   /* %s */""" % M),
    # H8 the models, on the painting, under the walkers, the fog and the names
    ("""  try { vbTilesDraw(ox, oy, false); } catch (_e) { VBT.err = String(_e && _e.message || _e); }   /* __ONE_MAP_AT_EVERY_ZOOM__ */""",
     """  try { vbTilesDraw(ox, oy, false); } catch (_e) { VBT.err = String(_e && _e.message || _e); }   /* __ONE_MAP_AT_EVERY_ZOOM__ */
  try { if (window.BohemiaMapHouses) BohemiaMapHouses.draw(ox, oy); } catch (_e) {}   /* %s: the models on their lots */""" % M),
    # H9 a walker behind a model is covered by it (the same test as the painting's, the same ghost)
    ("""function mapDepthCovers(X, Y, R){
""",
     """function mapDepthCovers(X, Y, R){ return mapDepthCoversPaint(X, Y, R) || !!(window.BohemiaMapHouses && BohemiaMapHouses.covers(X, Y, R)); }   /* %s */
function mapDepthCoversPaint(X, Y, R){
""" % M),
    # H10 the pinch goes on past the old closest stop, to the street (the old stop keeps its number: zoomBounds() is unchanged,
    #     so every check that names the closest stop still means the same place; only the pinch's own clamp reaches further)
    ("""  const [zmin,zmax]=zoomBounds();
  /* __ZOOM_SEAM__""",
     """  let [zmin,zmax]=zoomBounds();
  try { if (window.BohemiaMapHouses && BohemiaMapHouses.on()) zmax = Math.max(zmax, BohemiaMapHouses.streetTW()/TW0); } catch (_e) {}   /* %s: down to the street */
  /* __ZOOM_SEAM__""" % M),
    # H11 the walk reads up close: the crew walks the glass at a walk, the clock pays the same minutes a block
    ("""function mapGoingBeats(x,y){
  if(TERRAIN_GOING.on===false) return 1;""",
     """function mapGoingBeats(x,y){ var __w=1; try{ if(window.BohemiaMapHouses) __w=BohemiaMapHouses.watchBeats(); }catch(_e){} return __w*mapGoingBeatsLand(x,y); }   /* %s */
function mapGoingBeatsLand(x,y){
  if(TERRAIN_GOING.on===false) return 1;""" % M),
    # H13 WHAT HE SEES NOW (ask line 39): the blocks in his sight at their own light, the ground he remembers a little dimmer;
    #     under the fog's tape, after the start's sky
    ("""  try { fogDraw(ox, oy); } catch (_e) {}   /* __A_FRESH_START_AND_A_FOG_OF_WAR__""",
     """  try { if (window.BohemiaMapSight) BohemiaMapSight.draw(ox, oy); } catch (_e) {}   /* __WHAT_HE_SEES_NOW__ (WORLD 8, ask line 39): what he sees from here, the rest remembered */
  try { fogDraw(ox, oy); } catch (_e) {}   /* __A_FRESH_START_AND_A_FOG_OF_WAR__"""),
    # H11b his glide across a watched block takes the whole of its beats
    ("""    const E=(journey ? BEAT/TRAVEL_SPEED : Math.max(50, Math.min(BEAT, G.gap||BEAT))) * (journey ? mapGoingBeats(city.x, city.y) : 1);""",
     """    const E=(journey ? BEAT/TRAVEL_SPEED : Math.max(50, Math.min(BEAT, G.gap||BEAT))) * (journey ? mapGoingBeats(city.x, city.y) : 1) * (journey && window.BohemiaMapHouses ? BohemiaMapHouses.glideK() : 1);   /* %s: up close he walks the whole wait */""" % M),
    # H14 THE MAP CAN TURN (rule 344): the campaign code flips the valley before it is built (engine/bohemia_overmap.js reads it)
    ("""<!-- __A_NEW_VALLEY_EVERY_GAME__ END -->
""",
     """<!-- __A_NEW_VALLEY_EVERY_GAME__ END -->
<script>
/* ==== __THE_MAP_CAN_TURN__ (WORLD 8, 11/3/26, rule 344, ask line 353; Paolo 11/2: 'Dont forget u can flip the map 90 degrees fuck it!
   While changing the locations and shit'). A NEW game's code flips the valley north to south, east to west, both (a half turn) or
   neither, two bits of the code's own hash, before the valley is built (engine/bohemia_overmap.js VALLEY_TURN, on top of the land's
   own rolls, so everything built from the valley agrees: the roads, the painting, the travel, the towns on their real blocks). It
   is kept with the code (bohemia.world.turn.v1), so the same game opens the same way; a game begun before this keeps its valley,
   and the checkers' bench keeps it too unless it asks (bohemia.world.bench.turn). The places keep their names and their looks. ==== */
(function(){
  var KEY = 'bohemia.world.turn.v1', T = null, ls = function(k){ try { return localStorage.getItem(k); } catch (e) { return null; } };
  var code = (typeof WORLD_SEED === 'string') ? WORLD_SEED : '', from = (typeof WORLD_SEED_FROM === 'string') ? WORLD_SEED_FROM : '';
  var bits = function(c){ var h = 2166136261; c = String(c) + ':turn'; for (var i = 0; i < c.length; i++) { h ^= c.charCodeAt(i); h = Math.imul(h, 16777619); }
    h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15; return (h >>> 0) & 3; };
  var of = function(c){ var b = bits(c); return { ns: !!(b & 1), ew: !!(b & 2), code: c }; };
  if (code && (from === 'typed' || from === 'rolled')) { T = of(code); try { localStorage.setItem(KEY, JSON.stringify(T)); } catch (e) {} }
  else if (code && from === 'saved') { try { var s = JSON.parse(ls(KEY) || 'null'); if (s && s.code === code) T = { ns: !!s.ns, ew: !!s.ew, code: code }; } catch (e) {} }
  else if (code && from === 'bench' && ls('bohemia.world.bench.turn') === '1') T = of(code);
  try { globalThis.VALLEY_TURN = (T && (T.ns || T.ew)) ? T : null; window.__VALLEY_TURN = T || { ns: false, ew: false, code: code }; } catch (e) {}
})();
</script>
"""),
    # H15 THE MAP CAN TURN: the compass reads the valley's own north (a valley flipped north to south has its north at the far edge),
    #     so the real land round it, its passes and its roads, follow the flip
    ("""    L: { fwyX: L.fwyX, stripX: L.stripX, mead: L.mead, bendNorthY: L.bendNorthY, i15Exit: L.i15Exit } };""",
     """    L: { fwyX: L.fwyX, stripX: L.stripX, mead: L.mead, bendNorthY: L.bendNorthY, i15Exit: L.i15Exit, axisFlip: !!L.axisFlip } };   /* __THE_MAP_CAN_TURN__ */"""),
    ("""  var dirE = (L.fwyX < L.stripX) ? 1 : -1, C = { n: 'y0', s: 'y1', e: dirE > 0 ? 'x1' : 'x0', w: dirE > 0 ? 'x0' : 'x1' }, side = {};""",
     """  var dirE = (L.fwyX < L.stripX) ? 1 : -1, C = { n: L.axisFlip ? 'y1' : 'y0', s: L.axisFlip ? 'y0' : 'y1', e: dirE > 0 ? 'x1' : 'x0', w: dirE > 0 ? 'x0' : 'x1' }, side = {};   /* __THE_MAP_CAN_TURN__: the valley's own north */"""),
    # H16 TAP A QUEST, YOUR PEOPLE GO (rule 376): the map's one call, window.BOH_TRAVEL_TO_QUEST(questId) (UI 7 wires the phone to it)
    ("""<!-- __A_DIFFERENT_VALLEY_EVERY_GAME__ END -->
""",
     """<!-- __A_DIFFERENT_VALLEY_EVERY_GAME__ END -->
<script src="bohemia_quest_travel.js"></script>  <!-- __TAP_A_QUEST_YOUR_PEOPLE_GO__ WORLD 8 (rule 376, ask line 404): window.BOH_TRAVEL_TO_QUEST(questId) -->
"""),
    # H17 TAP A QUEST, YOUR PEOPLE GO: while the camera holds his crew the painter paints out from them, not from the glass's
    #     middle (the phone frames the crew in the open map above it), so the ground round him comes first and the quest's zoom
    #     (slices/bohemia_quest_travel.js, which waits for that ground) arrives sharp
    ("  var want = [], cxs = CVW / 2, cys = CVH / 2, sm = g.imageSmoothingEnabled, dpr = (typeof CV_DPR === 'number' && CV_DPR) || 1;\n",
     "  var want = [], cxs = CVW / 2, cys = CVH / 2, sm = g.imageSmoothingEnabled, dpr = (typeof CV_DPR === 'number' && CV_DPR) || 1;\n  if (typeof CAMF !== 'undefined' && CAMF.on && typeof city !== 'undefined' && city) { var cq = iso(city.x + 0.5, city.y + 0.5, ox, oy); cxs = cq.sx; cys = cq.sy; }   /* __TAP_A_QUEST_YOUR_PEOPLE_GO__: while the camera holds his crew, the painter works out from them (the phone frames them off the glass's middle) */\n"),
    # H18-H20 NO CAP ON A ROAD FIGHT (rule 378, ask line 407: 'make sure there's no coded cap of how many enemies can be on the
    #     screen'): the road event's roster and the street crew's two rosters were Math.min(8, ...); the party's real size goes in
    ('  var n=Math.max(1,Math.min(8,roadPartySize(P,ev))), r=[], i;\n',
     "  var n=Math.max(1,roadPartySize(P,ev)), r=[], i;   /* __NO_CAP_ON_A_ROAD_FIGHT__ (WORLD 8, rule 378): the party's real size goes in, never eight at most (the first day's company-plus-one stays, in partyMath and the shell's door) */\n"),
    ('      var cn=Math.max(1,Math.min(8,crew.count|0)), croster=[];\n',
     "      var cn=Math.max(1,crew.count|0), croster=[];   /* __NO_CAP_ON_A_ROAD_FIGHT__ (WORLD 8, rule 378): the party's real size goes in, never eight at most (the first day's company-plus-one stays, in partyMath and the shell's door) */\n"),
    ('  var cn=Math.max(1,Math.min(8,crew.count|0)), roster=[];\n',
     "  var cn=Math.max(1,crew.count|0), roster=[];   /* __NO_CAP_ON_A_ROAD_FIGHT__ (WORLD 8, rule 378): the party's real size goes in, never eight at most (the first day's company-plus-one stays, in partyMath and the shell's door) */\n"),
    # H21-H26 A TOWN IS ALWAYS A DOOR (rule 381, ask line 411; rule 273): the code (TOWN_DOOR, townGround, townDoorHolds); (a) a walk
    #     that ends in a town is never aimed; (b) on a town's ground a fight that came to him waits off it (the door, the hunter's
    #     contact); (c) the hunters stop at its edge and give up after a while
    ('/* ==== /__FALL_BACK_HOLDS__ ==== */\n',
     "/* ==== /__FALL_BACK_HOLDS__ ==== */\n/* ==== __A_TOWN_IS_ALWAYS_A_DOOR__ (WORLD 8, 11/3, rule 381, ask line 411; rule 273). PAOLO 11/3: 'I'm trying to enter a city but an\n   enemy I fell back from is trying to crawl up my ass. I should still be able to do that.' The second time (EYES 10/25z; RUN's\n   __FALL_BACK_HOLDS__ 10/26 did not close it). MEASURED (gates/a_town_is_always_a_door_gate.js, this switch off): with the crew he\n   fell back from one block behind him, his walk to the town's door read as AIMED at them in its last blocks (the walk's end within\n   one block of them), so the card came back and the walk stopped at the gate; and a town was safe only on the one block his LEAVE\n   puts him on. NOW, Battle Brothers' town: (a) a walk that ends in a town is never aimed at anybody; (b) a fight that comes TO him\n   (the hunters, a pack that smelt him, raiders, a crew on the patrol road, thieves, a road's ambush, a street crew) does not reach\n   him on a town's ground, in it or right outside (a town's base within TOWN_DOOR.ground blocks), so he walks in and the town's\n   screen opens (the walk's own door, rule 376's too); (c) the hunters stop at its edge and give up after TOWN_DOOR.wait of his\n   blocks or rest ticks there. A fight he walks into (a job's camp, lair, guards, a town's own waves, a pack he tapped, ENGAGE on a\n   card) is his choice and still comes. TOWN_DOOR.on false is the mutation the gate reads (the before). ==== */\nvar TOWN_DOOR = { on: true, ground: 2, wait: 8, held: 0, gave: 0 };\nfunction townGround(x, y){   /* the town (or the region's place) whose painted ground (x, y) is on, or within TOWN_DOOR.ground blocks of: in it or right outside */\n  if(!TOWN_DOOR.on) return null; var R = TOWN_DOOR.ground, best = null, bd = 1e9; x = x | 0; y = y | 0;\n  try{ var bs = ctBases() || {}; for(var nm in bs){ var b = bs[nm]; if(!b) continue; var t = { name: nm, x: b.x | 0, y: b.y | 0, tier: mapTierOf(nm) };\n    if(townFootDist(townFoot(t), x, y) > R) continue; var d = Math.max(Math.abs(t.x - x), Math.abs(t.y - y)); if(d < bd){ bd = d; best = t; } } }catch(_e){}\n  try{ var RG = window.BOH_REGION; if(RG && RG.ready && RG.places) RG.places.forEach(function(p){ var t2 = { name: p.name, x: p.x | 0, y: p.y | 0, tier: p.tier };\n    if(townFootDist(townFoot(t2), x, y) > R) return; var d2 = Math.max(Math.abs(t2.x - x), Math.abs(t2.y - y)); if(d2 < bd){ bd = d2; best = t2; } }); }catch(_e){}\n  return best;\n}\nfunction townComesToHim(msg){\n  var why = String((msg && msg.why) || ''), mc = /^contract:([^:]+):(pack|raid|band|thief)$/.exec(why);\n  if(mc){ var chased = false; try{ LOOP.held.forEach(function(j){ if(String(j.id) === mc[1] && j.chase != null) chased = true; }); }catch(_e){} return !chased; }   /* a pack he tapped is his chase */\n  return !!(msg && msg.__hunt) || /^road:/.test(why) || why === 'crew';\n}\nfunction townDoorHolds(msg){\n  if(!TOWN_DOOR.on || !msg || msg.__met || !townComesToHim(msg)) return null;\n  var T = townGround(city.x, city.y); if(T){ TOWN_DOOR.held++; window.__TOWN_DOOR_HELD = { n: TOWN_DOOR.held, town: T.name, why: String(msg.why || ''), at: [city.x, city.y] }; }\n  return T;\n}\ntry{ window.TOWN_DOOR = TOWN_DOOR; }catch(_e){}\n/* ==== /__A_TOWN_IS_ALWAYS_A_DOOR__ ==== */\n"),
    ('    try { if (TRAVEL && TRAVEL.to && Math.max(Math.abs(TRAVEL.to[0] - th[0]), Math.abs(TRAVEL.to[1] - th[1])) <= 1) aimed = true; } catch (_e) {}\n',
     '    try { if (TRAVEL && TRAVEL.to && !(TRAVEL.town && TOWN_DOOR.on) && Math.max(Math.abs(TRAVEL.to[0] - th[0]), Math.abs(TRAVEL.to[1] - th[1])) <= 1) aimed = true; } catch (_e) {}   /* __A_TOWN_IS_ALWAYS_A_DOOR__ (a): a walk that ends in a town is never aimed at anybody */\n'),
    ('  /* __MEET_BEFORE_YOU_FIGHT__: on the map, the card first; ENGAGE comes back through here with __met */\n',
     "  try { if (msg && msg.type === 'BOHEMIA_CITY_ENCOUNTER' && typeof MODE !== 'undefined' && MODE === 'city' && townDoorHolds(msg)) { if (msg.__hunt) { try { HUNT = msg.__hunt; } catch (_e) {} } return false; } } catch (_e) {}   /* __A_TOWN_IS_ALWAYS_A_DOOR__ (b): on a town's ground what came for him waits off it */\n  /* __MEET_BEFORE_YOU_FIGHT__: on the map, the card first; ENGAGE comes back through here with __met */\n"),
    ('  var __safe = (HUNT && huntDist() <= 1) ? townSafeNow() : null;',
     '  var __safe = (HUNT && huntDist() <= 1) ? (townSafeNow() || townGround(city.x, city.y)) : null;   /* __A_TOWN_IS_ALWAYS_A_DOOR__ (b) */'),
    ('        if((tries[i][0] || tries[i][1]) && cityWalkable(nx, ny)){ HUNT.at = [nx, ny]; break; } }\n',
     '        if((tries[i][0] || tries[i][1]) && cityWalkable(nx, ny) && !townGround(nx, ny)){ HUNT.at = [nx, ny]; break; } }   /* __A_TOWN_IS_ALWAYS_A_DOOR__ (c): they stop at its edge */\n'),
    ('    if(huntDist() > HUNT_GIVE_UP || HUNT.steps > HUNT_MAX_STEPS){\n',
     "    if(townGround(city.x, city.y)) HUNT.edge = (HUNT.edge | 0) + 1;   /* __A_TOWN_IS_ALWAYS_A_DOOR__ (c): his blocks (or rest ticks) on a town's ground */\n    if(huntDist() > HUNT_GIVE_UP || HUNT.steps > HUNT_MAX_STEPS || (HUNT.edge | 0) > TOWN_DOOR.wait){\n      if((HUNT.edge | 0) > TOWN_DOOR.wait) TOWN_DOOR.gave++;\n"),
    # H27 A TOWN IS ALWAYS A DOOR (a): the ten-block get-away does not count down on a walk into a town
    ('function meetBackStep(){ MEET_BACK.list = MEET_BACK.list.filter(function (b) { return --b.left > 0; }); }',
     'function meetBackStep(){ var keep = false; try { keep = !!(TOWN_DOOR.on && TRAVEL && TRAVEL.town); } catch (_e) {} MEET_BACK.list = MEET_BACK.list.filter(function (b) { if (keep) { b.left = Math.max(1, b.left - 1); return true; } return --b.left > 0; }); }   /* __A_TOWN_IS_ALWAYS_A_DOOR__ (a): the get-away does not run out on a walk into a town: he gets in */'),
    # H12 the module
    ('<script src="bohemia_his_map.js"></script>',
     '<script src="bohemia_map_houses.js"></script>  <script src="bohemia_map_sight.js"></script>  <!-- %s WORLD 8 (ask lines 117, 185, 39): the real house models past the old closest stop; what he sees now -->  <script src="bohemia_his_map.js"></script>' % M),
]


def main():
    page = open(PAGE, encoding='utf-8').read()
    there = sum(1 for _o, nw in HOOKS if nw in page)
    if 0 < there < len(HOOKS):
        sys.exit('%d of %d hooks are on the page: check the page out of git and run this again' % (there, len(HOOKS)))
    added = 0
    for old, new in HOOKS:
        if new in page:
            continue
        n = page.count(old)
        if n != 1:
            sys.exit('hook anchor found %d times, wanted once: %r' % (n, old[:100]))
        page = page.replace(old, new, 1); added += 1
    open(PAGE, 'w', encoding='utf-8').write(page)
    print('the houses stand up close: %d hooks added, %d already there' % (added, len(HOOKS) - added))


if __name__ == '__main__':
    main()
