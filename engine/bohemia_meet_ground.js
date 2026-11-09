/* ============================================================================
   __THE_CARD_SAYS_THE_BOARD__ (FIXES 11/9, ask row 531, FOUND BY EYES 11/8, e12 and e13; rule 151(e) the meet card, rule 59
   'never a second list').

   MEASURED BY EYES on the demo: the meet card said 'THE GROUND: OPEN ROAD - ARTERIAL. Wrecks and the median for cover, nothing
   high.' and the fight dealt suburb_stem, rows of two-storey houses. THE ROOT: the card guessed the ground from the district's
   NAME with a list of its own (BOHEMIA_CITY_WORLD.html MEET_GROUND: arterial, rail and the speedway lumped with the freeway as
   open road), a second list beside the one the fight deals from. The fight's own deal (slices/BOHEMIA_FIGHT.html dealBoard,
   COMBAT TWO's): a graveyard place deals the graveyard, a casino with an inside its floor, a freeway cell the freeway, a place
   with its own built board that board (ours.json place_boards), else the district's own kinds (ours.json board_grounds, the
   district's list or its ground's, the first kind leads), else the kind in records/target/BOHEMIA_BOARD_KINDS.json.

   NOW the card asks this file, which reads THE SAME FILES IN THE SAME ORDER and answers what the fight will deal there and what
   that board gives a man (cover, roofs, open ground); a place's own board speaks its own words (its name and its twist, the
   words COMBAT MAPS 3 wrote for it). Bound to the fight by gates/the_fourteen_eyes_found_gate.js F531: every district of the
   valley dealt by the fight itself against this file's answer; COMBAT TWO changing the deal makes it red until this file
   follows. Pure: BohemiaMeetGround.of(district, data) runs in node; the page's own copy loads the files once.
   Words are attempts, draft:true.
   ============================================================================ */
(function (root) {
  'use strict';
  /* what a board of each lead kind gives a man (draft:true) */
  var KIND = {
    suburb_stem: ['A ROAD THROUGH HOUSES', 'the road open down the middle, houses, shops and lots both sides; a roof is high ground'],
    subs: ['HOUSES', 'yards, fences and walls to hide behind; a roof is high ground'],
    suburb: ['HOUSES', 'yards, fences and walls to hide behind; a roof is high ground'],
    culdesac: ['HOUSES', 'yards, fences and walls to hide behind; a roof is high ground'],
    strip: ['TALL BUILDINGS', 'cover on every corner, the roofs see far'],
    main: ['A MAIN STREET', 'shop fronts and dead cars for cover; the roofs are high ground'],
    lots: ['PARKING LOTS', 'open asphalt and dead cars; the big stores\' roofs are the height'],
    works: ['YARDS AND MACHINES', 'stacks and containers to put between you'],
    landfill: ['YARDS AND MACHINES', 'stacks and containers to put between you'],
    ruin: ['RUINS', 'broken walls and rubble to hide behind; what still has a roof is high ground'],
    scrub: ['OPEN GROUND', 'scrub and rock, little to hide behind'],
    golf: ['THE GREENS', 'open grass and sand traps that slow you, little to hide behind'],
    canyon: ['ROCK AND LEDGES', 'boulders for cover, the ledges are high ground'],
    shore: ['THE WATER\'S EDGE', 'mud and shallows that slow you, little to hide behind'],
    wash: ['THE WASH', 'a dry channel between its banks; the banks are the height'],
    freeway: ['OPEN ROAD', 'wrecks and the barrier for cover, nothing high']
  };
  var SPECIAL = {
    graveyard: ['THE GRAVEYARD', 'rows of headstones and the crypts for cover'],
    casino: ['INSIDE THE CASINO', 'slot banks, the bar and the cage for cover; dark unless somebody pays the power'],
    freeway: ['THE FREEWAY', 'dead cars and the barrier for cover; past the wall is the drop'],
    interchange: ['THE STACK', 'ramps over ramps, the barriers for cover; past the wall is the drop']
  };
  function val(x) { return x && x.value !== undefined ? x.value : x; }
  function isFreeway(d, D) {
    var FB = D.freewayBoards || root.BohemiaFreewayBoards;   /* the fight's own test (slices/bohemia_freeway_boards.js isFreeway) */
    return !!(FB && FB.isFreeway && FB.isFreeway(d));
  }
  /* what board the fight deals for a district, in the fight's own order (dealBoard, then dealOnce) */
  function board(d, D) {
    d = String(d || '').toLowerCase(); if (!d || !D) return null;
    var ours = D.ours || {}, gy = val(ours.graveyard), pb = val(ours.place_boards), bg = val(ours.board_grounds);
    var rows = (D.kinds && D.kinds.districts) || [], row = null;
    for (var i = 0; i < rows.length; i++) if (rows[i].district === d) { row = rows[i]; break; }
    var kind = row && row.boardKind ? row.boardKind : null;
    if (gy && ((gy.places || []).indexOf(d) >= 0 || (kind && (gy.places || []).indexOf(kind) >= 0))) return { board: 'graveyard' };
    if (D.casino && (D.casino.districts || []).indexOf(d) >= 0) return { board: 'casino' };
    if (isFreeway(d, D)) return { board: 'freeway' };
    if (pb && pb.places) for (var id in pb.places) { var p = pb.places[id];
      if (p && p.built && (p.districts || []).indexOf(d) >= 0) return { board: 'place', place: id, name: p.name, twist: p.twist }; }
    var list = bg ? ((bg.districts || {})[d] || (row && (bg.grounds || {})[row.ground]) || null) : null;
    if (list && list.length) return { board: 'kind', lead: list[0] };
    if (kind) return { board: 'kind', lead: kind };
    return null;
  }
  /* the card's words for that board */
  function of(d, D) {
    var b = board(d, D), dd = String(d || '').toLowerCase();
    if (!b) return null;
    var w = null;
    if (b.board === 'graveyard') w = SPECIAL.graveyard;
    else if (b.board === 'casino') w = SPECIAL.casino;
    else if (b.board === 'freeway') w = dd === 'interchange' ? SPECIAL.interchange : SPECIAL.freeway;
    else if (b.board === 'place') {
      /* the place's own words: its name, and the twist's first clause after its title (the parenthesis dropped) */
      var t = String(b.twist || ''), c = t.indexOf(':'), body = (c >= 0 ? t.slice(c + 1) : t).split(';')[0].replace(/\s*\([^)]*\)/g, '').trim();
      w = [String(b.name || dd).toUpperCase(), body || 'its own ground'];
    }
    else w = KIND[b.lead] || [String(b.lead).toUpperCase(), 'the block as it stands'];
    return { kind: w[0], what: w[1], district: dd, board: b.board, lead: b.lead || null, place: b.place || null, draft: true };
  }

  var api = { of: of, board: board, KIND: KIND, SPECIAL: SPECIAL, data: null, ready: false };
  /* in a page: the files the fight deals from, loaded once (the map already fetches ours.json; the browser's cache answers) */
  if (typeof fetch === 'function' && typeof document !== 'undefined') {
    var here = (document.currentScript && document.currentScript.src) || '';
    var base = here ? here.replace(/engine\/[^\/]*$/, '') : '../';
    var get = function (u) { return fetch(base + u).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); };
    Promise.all([get('records/target/bb/ours.json'), get('records/target/BOHEMIA_BOARD_KINDS.json'), get('slices/fight_ground/casino/casino_floor.json')])
      .then(function (a) { api.data = { ours: a[0] || {}, kinds: a[1] || {}, casino: a[2] || null }; api.ready = !!(a[0] && a[1]); });
    api.here = function (d) { return api.ready ? of(d, api.data) : null; };
  }
  root.BohemiaMeetGround = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
