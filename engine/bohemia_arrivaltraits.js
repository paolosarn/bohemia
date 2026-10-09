// BOHEMIA — A PARTY THAT ARRIVES LEAVES ITS MARK (FACTIONS lane, row [raids make traits])
// Reads records/target/bb/arrival_traits.json. Pure and deterministic, no DOM, no random.
// The arrivals are the events bohemia_homebases.advanceWatching hands back: {id, agenda, faction, to:{x,y}, step}.
//   traitsFrom(events, seats, rec, day, opts) -> the NEW marks written this call (a repeat arrival only refreshes the end day) [{place, trait, by, party, from, until}]
//   active(rec, place, day)                   -> trait ids standing on a place that day
//   effects(rec, place, day)                  -> the multiplied numbers {items_mult, recruits_mult, buy_price_mult, sell_price_mult}
//   opts: { stopped(partyId) -> true when you stopped it on the road, yours: ['seat faction ids you hold'] }
'use strict';
(function (root) {
  var D = null;
  function load(fs, path) { D = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/arrival_traits.json'), 'utf8')); }
  function set(d) { D = d; }
  function make() { return { marks: [] }; }
  function setterOf(agenda) { for (var k in D.traits) if (D.traits[k].set_by.value === agenda) return k; return null; }
  function traitsFrom(events, seats, rec, day, opts) {
    opts = opts || {};
    var out = [], days = D.duration_days.value;
    if (!rec || typeof day !== 'number') return out;
    if (!rec.marks) rec.marks = [];
    for (var i = 0; i < (events || []).length; i++) {
      var e = events[i]; if (!e || !e.to) continue;
      var trait = setterOf(e.agenda); if (!trait) continue;
      if (opts.stopped && opts.stopped(e.id)) continue;
      for (var j = 0; j < (seats || []).length; j++) {
        var s = seats[j];
        if (!s || s.x !== e.to.x || s.y !== e.to.y || s.faction === e.faction) continue;
        if (opts.yours && opts.yours.indexOf(s.faction) >= 0) continue;
        var m = null;
        for (var k = 0; k < rec.marks.length; k++) if (rec.marks[k].place === s.faction && rec.marks[k].trait === trait) m = rec.marks[k];
        if (m) m.until = Math.max(m.until, day + days);
        else { m = { place: s.faction, trait: trait, by: e.faction, party: e.id, from: day, until: day + days }; rec.marks.push(m); out.push(m); }
      }
    }
    return out;
  }
  function active(rec, place, day) {
    var ids = [], ms = (rec && rec.marks) || [];
    for (var i = 0; i < ms.length; i++) if (ms[i].place === place && day >= ms[i].from && day < ms[i].until && ids.indexOf(ms[i].trait) < 0) ids.push(ms[i].trait);
    return ids;
  }
  function effects(rec, place, day) {
    var out = { items_mult: 1, recruits_mult: 1, buy_price_mult: 1, sell_price_mult: 1 }, ids = active(rec, place, day);
    for (var i = 0; i < ids.length; i++) { var f = D.traits[ids[i]].effects; for (var k in f) out[k] = out[k] * f[k].value; }
    return out;
  }
  var api = { load: load, set: set, make: make, traitsFrom: traitsFrom, active: active, effects: effects };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; load(require('fs'), require('path')); }
  else root.BohemiaArrivalTraits = api;
})(typeof window !== 'undefined' ? window : this);
