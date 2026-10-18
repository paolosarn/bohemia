// BOHEMIA — THE DEMO'S FACTIONS (FACTIONS lane, VAMILY rows [the parties on the map] and
// [a house you give a fuck about], rule 80c). One data file, records/target/bb/factions.json;
// this module only reads it. Pure, no DOM, no random. RUN's parties and the map card read it:
//   byGround(kind)    the faction that holds a ground kind (or null)
//   card(id, count)   what a party's map card shows: banner, name, count word, want, face slot
//   countWord(n)      Battle Brothers' count words from party_math.json
//   mixFor(id, phase) the draft make-up (COMBAT's enemy_tiers owns the real one)
//   memoryLine(id, band) which of the faction's voice states fits a relation band
//   scene(id, band)           a face meeting you again: {speaks, say, ...}; it SPEAKS only once a portrait id is in the slot (text comes
//                             from a mouth with a portrait); before that it answers PORTRAIT_OWED and keeps the line unspoken
//   guardFor(kind, total, phase) who guards a place on that ground and with what: the holder's own make-up scaled to `total` men,
//                             or NO_FACTION_HOLDS_THIS_GROUND (an honest gap, never a guess)
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
  function toneOf(band) { var t = DATA.tones.value; for (var k in t) if (t[k].indexOf(band) >= 0) return k; return null; }
  function memoryLine(id, band) {
    var f = get(id); if (!f || !f.lines || !f.lines.value) return null;
    var t = toneOf(band); return t ? (f.lines.value[t] || null) : null;
  }
  function scene(id, band) {
    var f = get(id); if (!f) return { known: false, why: 'NOT_A_FACTION', id: id };
    var tone = toneOf(band); if (!tone) return { known: false, why: 'NOT_A_BAND', band: band };
    var line = memoryLine(id, band), has = !!(f.face.portrait);
    var out = { known: true, faction: f.id, who: f.face.id, role: f.face.role, tone: tone, band: band, want: f.want.text,
                portrait: f.face.portrait || null, speaks: false, say: null, unspoken: null,
                sound: (f.lines && f.lines.sound) || null };
    if (!line) { out.why = f.lines && f.lines.sound ? 'NO_WORDS_A_SOUND' : 'NO_LINE'; return out; }
    if (!has) { out.why = 'PORTRAIT_OWED'; out.unspoken = line; return out; }
    out.speaks = true; out.say = line; return out;
  }
  function scale(mix, total, leaders) {
    var out = {}, rest = {}, used = 0, k;
    for (k in mix) { if (leaders.indexOf(k) >= 0) { if (used < total) { out[k] = 1; used++; } } else rest[k] = mix[k]; }
    var need = Math.max(0, total - used), keys = Object.keys(rest), sum = size(rest), r = [], got = 0, i;
    if (!keys.length) return out;
    for (i = 0; i < keys.length; i++) { var ex = rest[keys[i]] * need / sum, fl = Math.floor(ex); out[keys[i]] = fl; got += fl; r.push([ex - fl, i]); }
    r.sort(function (x, y) { return y[0] - x[0] || x[1] - y[1]; });
    for (i = 0; got < need; i++, got++) out[keys[r[i % r.length][1]]]++;
    for (k in out) if (!out[k]) delete out[k];
    return out;
  }
  function guardFor(kind, total, phase) {
    if (!(total >= 1) || Math.floor(total) !== total) return { known: false, why: 'NO_GUARD', total: total };
    var f = byGround(kind);
    if (!f) return { known: false, why: 'NO_FACTION_HOLDS_THIS_GROUND', kind: kind };
    var m = mixFor(f.id, phase || 'late');
    return { known: true, faction: f.id, name: f.name, banner: f.banner, kind: kind, total: total, party: scale(m, total, f.leaders ? f.leaders.value : []) };
  }
  var api = { load: load, set: set, all: all, get: get, byGround: byGround, countWord: countWord,
              mixFor: mixFor, size: size, card: card, memoryLine: memoryLine, toneOf: toneOf, scene: scene, guardFor: guardFor };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; load(require('fs'), require('path')); }
  else root.BohemiaFactions = api;
})(typeof window !== 'undefined' ? window : this);
