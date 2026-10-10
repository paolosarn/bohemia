// BOHEMIA — THE HOUSES ARE HOSTILE TO EACH OTHER (FACTIONS lane, row [houses at war])
// WHO is at war is read from bohemia_between.js (canon graph edges, war flag, sign); this file never stores a pair.
// WHAT a war does is Battle Brothers' War of the Noble Houses (records/target/bb/war.json), with our mapping marked ours.
//   meetings(parties, day, rec, between)  -> events for every pair of different-faction parties within one cell, once a day each:
//        {kind:'war', winner, loser, by, ...} | {kind:'standoff', ...} | {kind:'tax', taxer, taxed, ...}
//   sideWith(rel, faction, between, factions) -> the bars of everybody at war with `faction` drop to the Hostile top (9), never up
//   onSettled(events, arrivals, day)      -> the world TOOK a base (homebases.settle 'taken'): the place is Conquered, not burned
// Pure and deterministic. A party is {id, agenda, from:{faction, power}, at:{x,y}}.
'use strict';
(function (root) {
  var D = null, R = null, AT = null;
  function load(fs, path) {
    D = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/war.json'), 'utf8'));
    R = require('./bohemia_relations.js'); AT = require('./bohemia_arrivaltraits.js');
  }
  function set(d, r, at) { D = d; R = r; AT = at; }
  function make() { return { met: {} }; }
  function dist(a, b) { return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)); }
  function powerOf(p) { return (p && p.from && typeof p.from.power === 'number') ? p.from.power : null; }
  function meetings(parties, day, rec, between) {
    var out = [], ps = parties || [], radius = D.meeting.radius_cells;
    if (!rec || typeof day !== 'number' || typeof between !== 'function') return out;
    if (!rec.met) rec.met = {};
    for (var i = 0; i < ps.length; i++) for (var j = i + 1; j < ps.length; j++) {
      var a = ps[i], b = ps[j];
      if (!a || !b || !a.at || !b.at || !a.from || !b.from) continue;
      if (dist(a.at, b.at) > radius) continue;
      var rel = between(a.from.faction, b.from.faction);
      if (!rel || rel.sign !== 'hostile') continue;
      var key = [a.id, b.id].sort().join('|') + '|' + Math.floor(day);
      if (rec.met[key]) continue;
      rec.met[key] = 1;
      var pa = powerOf(a), pb = powerOf(b), war = rel.war === true, ev;
      if (pa === null || pb === null || pa === pb) ev = { kind: 'standoff', a: a.id, b: b.id };
      else {
        var w = pa > pb ? a : b, l = w === a ? b : a;
        ev = war ? { kind: 'war', winner: w.id, loser: l.id, winnerFaction: w.from.faction, loserFaction: l.from.faction }
                 : { kind: 'tax', taxer: w.from.faction, taxed: l.from.faction, a: a.id, b: b.id };
      }
      ev.day = Math.floor(day); ev.label = rel.label; ev.between = [a.from.faction, b.from.faction];
      out.push(ev);
    }
    return out;
  }
  function sideWith(rel, faction, between, factions) {
    var out = [], top = D.side_makes_enemy_hostile.to_bar;
    for (var i = 0; i < (factions || []).length; i++) {
      var f = factions[i];
      var r = between(f, faction);
      if (!r || r.war !== true) continue;
      if (R.score(rel, f) > top) { rel.bars[f] = top; out.push(f); }
    }
    return out;
  }
  function onSettled(events, arrivals, day) {
    var out = [];
    for (var i = 0; i < (events || []).length; i++) {
      var e = events[i]; if (!e || e.outcome !== 'taken') continue;
      var m = AT.markTaken(arrivals, e.base, e.by, day); if (m) out.push(m);
    }
    return out;
  }
  var api = { load: load, set: set, make: make, meetings: meetings, sideWith: sideWith, onSettled: onSettled };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; load(require('fs'), require('path')); }
  else root.BohemiaWar = api;
})(typeof window !== 'undefined' ? window : this);
