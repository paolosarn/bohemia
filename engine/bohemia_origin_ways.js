/* ============================================================================
   BOHEMIA -- EACH ORIGIN ITS OWN (ORIGINS, 11/7/26, VAMILY rule 427(c), asks 103 and 233; RUN THREE's row [each origin its own],
   step 1: records/BOHEMIA_RUN3_EACH_ORIGIN_ITS_OWN_HOW_BATTLE_BROTHERS_DOES_IT_10_26_26.md)

   PAOLO (10/26, rule 236 and 287; 11/7 through the coordinator): 'what makes each origin unique, unique shit you can buy, how their
   shit looks... it all looks the same right now... it's gonna be more personalized'; 'every origin starts like itself and gets
   personal: its own look, things only it can buy, its own way of playing (Battle Brothers' origins, our swag); the Lone Wolf a gilded
   god with three stars in the stats that matter, really felt in the fight. Data in a file a modder can edit. Realism first.'

   THE DATA IS records/target/bb/origins.json, each origin's 'personal' block (a modder edits it, nothing here names an origin):
     look   {words, wears: {body, head}}     what its crew walks in wearing: its OWN pieces (records/target/bb/armory.json rows with
                                               'origin', each its own model on the body, slices/wear); the door kit puts them on
     shelf  {where: 'home', pieces: [...]}   the things only it can buy: its pieces, on the armourer's shelf of its HOME town (the
                                               town the new game opened in, rule 236) and NOWHERE else: no other shelf, no loot, no
                                               hire carries them (reserved())
     rule   {id, name, says, bb, source, does}  its own way, Battle Brothers' way: 'does' is what the game reads, one key a lever:
              buy_mult, sell_mult   the town's prices (the water truck's Trader, the hunters' prejudice)       settlement traitMult
              no_rare_hires         the post never deals a rare man (the Block Watch: lowborn only)           settlement rareChance
              first_round           his men act first in the first round (the deserters)                      the fight's round
              never_confident       his men's nerve never climbs to confident (the lab rats)                  the fight's morale
              never_flees           his men's nerve stops at breaking (the faithful)                          the fight's morale
              standard              {range_tiles, pct_of_bearer}: his main man's resolve lent to the men      the fight's morale
                                    near him (the promise keepers' old one, Battle Brothers' Battle Standard)
              whip                  {floor, range_tiles, men}: a debtor's nerve breaks no further than        the fight's morale
                                    'floor' while a collector stands near him (the debt collectors)
              loot_second_look      a piece the roll missed gets one more look (the raiders)                  engine/bohemia_spoils.js
              trophy_extra_pct      the chance in 100 a kill gives one more hide (the hunters)                slices/bohemia_carcass.js
              exact_count           every crew on the map reads as its number, never a word (the scavengers)  the map's partyWord
              start                 where the game starts ('south'; the map's START_KINDS already run it)      the map's startPick
              wage                  the founding men's pay a night (the fight pit; door.wage_per_man_per_night)  the map's bill
              gifts                 the Lone Wolf's door: perks on top of his levels, his resolve (door.men[0]) engine/bohemia_origin_start.js
   API (window.BohemiaOriginWays; a frame reads window.top's):
     load(base) / set(json)          the file (fetched once at the page's start; set() for a checker)
     current()                       the origin in play (the door's pick, else the kept roll's)
     personal(id) / rule(id) / does(id)   the block, its rule, the rule's 'does' (id defaults to current(); {} when none)
     fight(id)                       the rule's fight keys only, handed to the fight with the company (opts.originWay)
     reserved()                      every origin piece id (no shelf but its home's, no loot, no hire)
     home() / setHome(origin, town) / homeOr(town)   the home town of this game (kept in bohemia.origin.home.v1; NEW GAME forgets)
     shelfFor(town, id)              the piece ids this town sells for the origin (its home: its pieces; elsewhere none)
     wears(id) / forget()
   node: require('./bohemia_origin_ways.js') then set(json). Gate: gates/each_origin_its_own_gate.js
   ========================================================================== */
(function (root) {
  'use strict';
  var HOME = 'bohemia.origin.home.v1', ROLL = 'bohemia.origin.roll.v1';
  var D = { file: null, loading: null };
  var FIGHT_KEYS = ['first_round', 'never_confident', 'never_flees', 'standard', 'whip'];
  function ls() { try { return root.localStorage || null; } catch (e) { return null; } }
  function set(j) { D.file = j || null; return API; }
  function load(base) {
    if (D.file) return Promise.resolve(D.file);
    if (D.loading) return D.loading;
    if (!root.fetch) return Promise.resolve(null);
    base = base || '../records/target/bb/';
    D.loading = root.fetch(base + 'origins.json').then(function (r) { return r.json(); }).then(function (j) { D.file = j; return j; })
      .catch(function () { D.loading = null; return null; });
    return D.loading;
  }
  function row(id) { var os = (D.file && D.file.origins) || []; for (var i = 0; i < os.length; i++) if (os[i].id === id) return os[i]; return null; }
  function current() {
    try { var B = root.BOH_START; if (B && B.state && B.state.origin) return String(B.state.origin); } catch (e) {}
    try { var B2 = root.BOH_START; if (B2 && B2.picks) { var p = B2.picks(); if (p && p.origin) return String(p.origin); } } catch (e) {}
    var L = ls(); if (L) { try { var k = JSON.parse(L.getItem(ROLL) || 'null'); if (k && k.origin) return String(k.origin); } catch (e) {} }
    return null;
  }
  function personal(id) { var o = row(id == null ? current() : id); return (o && o.personal) || null; }
  function rule(id) { var p = personal(id); return (p && p.rule) || null; }
  function does(id) { var r = rule(id); return (r && r.does) || {}; }
  function fight(id) { var d = does(id), out = {}, any = false; FIGHT_KEYS.forEach(function (k) { if (d[k] != null && d[k] !== false) { out[k] = d[k]; any = true; } });
    if (any) { var r = rule(id); out.id = r.id; out.name = r.name; out.origin = id == null ? current() : id; } return any ? out : null; }
  function reserved() {
    var out = []; ((D.file && D.file.origins) || []).forEach(function (o) { var s = o.personal && o.personal.shelf; ((s && s.pieces) || []).forEach(function (pid) { if (out.indexOf(pid) < 0) out.push(pid); }); });
    return out;
  }
  function home() { var L = ls(); if (!L) return null; try { var h = JSON.parse(L.getItem(HOME) || 'null'); return h && h.town ? h : null; } catch (e) { return null; } }
  function setHome(origin, town) { var L = ls(); if (!L || !town) return null; var h = { origin: origin || current(), town: String(town), at: Date.now() };
    try { L.setItem(HOME, JSON.stringify(h)); } catch (e) {} return h; }
  /* the first town a game opens is its home when nothing wrote one (a CONTINUE from before this, a modder's start) */
  function homeOr(town) { var h = home(), o = current(); if (h && (!o || h.origin === o)) return h; return town ? setHome(o, town) : null; }
  function shelfFor(town, id) {
    var o = id == null ? current() : id, h = home(), p = personal(o), s = p && p.shelf;
    if (!s || !Array.isArray(s.pieces) || !town || !h || h.origin !== o) return [];
    return (s.where || 'home') === 'home' && h.town === String(town) ? s.pieces.slice() : [];
  }
  function wears(id) { var p = personal(id); return (p && p.look && p.look.wears) || null; }
  function forget() { var L = ls(); if (L) try { L.removeItem(HOME); } catch (e) {} }
  var API = { HOME: HOME, load: load, set: set, current: current, personal: personal, rule: rule, does: does, fight: fight, reserved: reserved,
    home: home, setHome: setHome, homeOr: homeOr, shelfFor: shelfFor, wears: wears, forget: forget, FIGHT_KEYS: FIGHT_KEYS, data: D };
  root.BohemiaOriginWays = API;
  try { if (root.fetch && root.document) setTimeout(function () { load(); }, 0); } catch (e) {}
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
})(typeof window !== 'undefined' ? window : this);
