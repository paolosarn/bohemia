// BOHEMIA — THE BAG SORTS (RUN TWO, row [the bag sorts], 10/18).
// Battle Brothers' stash has a sort button; ours filled 36 slots in the order things were bought, so the rifle got lost
// between the food and the tape. ONE function both bags call (the settlement's shops and the crew screen): by kind
// (weapons, armour, heads, then goods), then the dearest first, then by name; a stable sort, so two equal pieces keep
// their order. Pure: it returns a new array and never touches the purse or the bag's size.
'use strict';
(function (root) {
  var ORDER = { weapon: 0, body: 1, shield: 2, head: 3 };
  function rank(it) { return it && Object.prototype.hasOwnProperty.call(ORDER, it.kind) ? ORDER[it.kind] : 4; }
  function worth(it) { return (it && (it.base || it.price)) || 0; }
  function sort(bag) {
    return (bag || []).map(function (it, i) { return { it: it, i: i }; }).sort(function (a, b) {
      return rank(a.it) - rank(b.it) || worth(b.it) - worth(a.it) || String((a.it && a.it.name) || '').localeCompare(String((b.it && b.it.name) || '')) || a.i - b.i;
    }).map(function (x) { return x.it; });
  }
  var api = { sort: sort, rank: rank };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.BohemiaBagSort = api;
})(typeof window !== 'undefined' ? window : this);
