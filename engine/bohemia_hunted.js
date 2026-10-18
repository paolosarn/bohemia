// BOHEMIA — A SETTLEMENT COMES FOR YOU (FACTIONS lane, row [beef] A-SETTLEMENT-COMES-FOR-YOU)
// Reads records/target/bb/hunted.json and relations.json (bohemia_relations.js owns the bars). Pure, deterministic.
//   huntersFor(rel, parties)           -> ids of the patrols that hunt you: a faction whose bar is in the Hostile band
//   attackable(rel, party, hasContract)-> may you raid this caravan? only a caravan, only with no contract, only at Threatening or lower
//   contractAgainst(rel, faction)      -> a contract that attacks a settlement costs the wiki's Attacking Them
// A party carries { id, agenda, from: { faction } } (the parties module's own shape), or { faction } at the top.
'use strict';
(function (root) {
  var D = null, R = null, RD = null;
  function load(fs, path) {
    D = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/hunted.json'), 'utf8'));
    R = require('./bohemia_relations.js');
    RD = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/relations.json'), 'utf8'));
  }
  function set(d, r, rd) { D = d; R = r; RD = rd; }
  function hi(bandId) { var b = RD.bands.value; for (var i = 0; i < b.length; i++) if (b[i].id === bandId) return b[i].hi; return -1; }
  function home(p) { return p && (p.from && p.from.faction || p.faction) || null; }
  function bandOk(rel, faction, bandId) { return R.score(rel, faction) <= hi(bandId) + 0.999; }
  function huntersFor(rel, parties) {
    var out = [], b = D.patrol_hunts.band;
    for (var i = 0; i < (parties || []).length; i++) {
      var p = parties[i]; if (!p || p.agenda !== 'patrol') continue;
      var f = home(p); if (f && bandOk(rel, f, b)) out.push(p.id);
    }
    return out;
  }
  function attackable(rel, party, hasContract) {
    if (!party || party.agenda !== 'caravan') return false;
    if (hasContract && D.caravan_attackable.needs_no_contract) return false;
    var f = home(party); return !!f && bandOk(rel, f, D.caravan_attackable.band);
  }
  function contractAgainst(rel, faction) { return R.apply(rel, faction, D.contract_against_them.act); }
  var api = { load: load, set: set, huntersFor: huntersFor, attackable: attackable, contractAgainst: contractAgainst };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; load(require('fs'), require('path')); }
  else root.BohemiaHunted = api;
})(typeof window !== 'undefined' ? window : this);
