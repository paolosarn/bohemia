// BOHEMIA — RELATIONS (FACTIONS lane, row [beef] RELATIONS-BANDS-FROM-THE-WIKI)
// One 0..100 bar per settlement from records/target/bb/relations.json (the wiki's Relations page).
// Pure and deterministic. A record is { bars: {settlementId: score} }, a settlement with no bar is at 50.
//   band(score) -> band id        apply(rec, id, act)    -> {applied, before, after, band}
//   dawn(rec, days)               drift toward 50 by 0.25 a dawn, never past it
//   guardsDraw(score)             true at or below the file's guard line (ours, draft)
//   crime(rec, id, kind, seen)    a theft costs its mapped offence, only if somebody saw it
'use strict';
(function (root) {
  var D = null;
  function load(fs, path) { D = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/relations.json'), 'utf8')); }
  function set(d) { D = d; }
  function clamp(v) { return Math.max(0, Math.min(100, Math.round(v * 100) / 100)); }
  function make() { return { bars: {} }; }
  function score(rec, id) { return id in rec.bars ? rec.bars[id] : D.start.value; }
  function band(s) {
    var b = D.bands.value;
    for (var i = 0; i < b.length; i++) if (s <= b[i].hi + 0.999 && s >= b[i].lo) return b[i].id;
    return s < 0 ? b[0].id : b[b.length - 1].id;
  }
  function apply(rec, id, act) {
    var row = D.acts[act];
    if (!id || !row) return { applied: false, reason: !id ? 'NO_SETTLEMENT' : 'UNKNOWN_ACT' };
    var before = score(rec, id), after = clamp(before + row.value);
    rec.bars[id] = after;
    return { applied: true, before: before, after: after, band: band(after), delta: row.value };
  }
  function dawn(rec, days) {
    var n = Math.max(0, days | 0), step = D.drift.value.per_dawn, t = D.drift.value.toward;
    for (var id in rec.bars) {
      var s = rec.bars[id];
      for (var i = 0; i < n && s !== t; i++) s = s < t ? Math.min(t, s + step) : Math.max(t, s - step);
      rec.bars[id] = clamp(s);
    }
    return rec;
  }
  function guardsDraw(s) { return s <= D.guards.draw_at_or_below.value; }
  function crime(rec, id, kind, seen) {
    var c = D.crime[kind];
    if (!c || !c.maps_to) return { applied: false, reason: 'UNKNOWN_CRIME' };
    if (!seen) return { applied: false, reason: 'UNSEEN' };
    return apply(rec, id, c.maps_to);
  }
  var api = { load: load, set: set, make: make, score: score, band: band, apply: apply, dawn: dawn, guardsDraw: guardsDraw, crime: crime };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; load(require('fs'), require('path')); }
  else root.BohemiaRelations = api;
})(typeof window !== 'undefined' ? window : this);
