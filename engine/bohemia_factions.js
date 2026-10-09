// BOHEMIA — THE DEMO'S FACTIONS (FACTIONS lane, VAMILY rows [the parties on the map] and
// [a house you give a fuck about], rule 80c). One data file, records/target/bb/factions.json;
// this module only reads it. Pure, no DOM, no random. RUN's parties and the map card read it:
//   byGround(kind)    the faction that holds a ground kind (or null)
//   card(id, count)   what a party's map card shows: banner, name, count word, want, face slot
//   countWord(n)      Battle Brothers' count words from party_math.json
//   mixFor(id, phase) the draft make-up (COMBAT's enemy_tiers owns the real one)
//   memoryLine(id, band) which of the faction's voice states fits a relation band
'use strict';
(function (root) {
  var DATA = null, MATH = null;
  function load(fs, path) {
    DATA = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/factions.json'), 'utf8'));
    MATH = JSON.parse(fs.readFileSync(path.join(__dirname, '../records/target/bb/party_math.json'), 'utf8'));
  }
  function set(d, m) { DATA = d; MATH = m; }
  function all() { return DATA.factions.slice(); }
  function get(id) { for (var i = 0; i < DATA.factions.length; i++) if (DATA.factions[i].id === id) return DATA.factions[i]; return null; }
  function byGround(k) { for (var i = 0; i < DATA.factions.length; i++) if (DATA.factions[i].ground.indexOf(k) >= 0) return DATA.factions[i]; return null; }
  function countWord(n) {
    var w = MATH.count_words.value;
    for (var i = 0; i < w.length; i++) if (n >= w[i].lo && n <= w[i].hi) return w[i].word;
    return n < 2 ? 'ONE' : null;
  }
  function mixFor(id, phase) { var f = get(id); return f ? (f.mix[phase] || f.mix.early) : null; }
  function size(m) { var t = 0; for (var k in m) t += m[k]; return t; }
  function card(id, count) {
    var f = get(id); if (!f) return null;
    return { id: f.id, name: f.name, banner: f.banner, count: count, word: countWord(count),
             want: f.want.text, face: f.face.id, base: f.base.kind, behaviour: f.behaviour };
  }
  function memoryLine(id, band) {
    var f = get(id); if (!f || f.memory.bands.indexOf(band) < 0) return null;
    return f.voice.text || null;
  }
  var api = { load: load, set: set, all: all, get: get, byGround: byGround, countWord: countWord,
              mixFor: mixFor, size: size, card: card, memoryLine: memoryLine };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; load(require('fs'), require('path')); }
  else root.BohemiaFactions = api;
})(typeof window !== 'undefined' ? window : this);
