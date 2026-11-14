/* ==== __THE_WHY_LINE__, THE CHOOSER (FIGHT SCREEN 11/14/26; VAMILY rule 449(a), ask row 617) ====
   PAOLO 11/14: 'It doesn't explain why people are trying to attack you... I want there to be a sentence, just one sentence...
   why the fuck the enemies are attacking you or why the fuck the animals are attacking you.'

   Every fight opens with ONE sentence that says why this group is on him, true to what started it. This file only CHOOSES
   the sentence; the fight's page shows it (slices/BOHEMIA_FIGHT.html, __THE_WHY_LINE__) and the table it chooses from is one
   data file a modder edits (records/target/bb/fight_reasons.json). Nothing here touches the fight's rules or its dice.

     BohemiaFightWhy.how(why, opts, D)      how the fight began: the map's hand-over word ('contract:12:clear', 'road:7:caught',
                                            'raid:HOME', none) and the fight's own flags (a camp, the pit, a boss) -> a key of D.how
     BohemiaFightWhy.who(kinds, D, facs)    who they are: the kinds standing on the board -> { id, cls, name } (most of them win;
                                            a kind no group names still has a class: 'beasts', 'dead' or 'men')
     BohemiaFightWhy.factions(tables)       { kind: [factions] } off the fight's own tables, so a new kind in a known faction
                                            is somebody the day it is added
     BohemiaFightWhy.pick(q, D)             the sentence. q = { why, opts, factions, them: [{ kind, beast, ghost, machine, talks }],
                                            facts: { holds_ground, lives_here, has_food, known }, last: { rule: index },
                                            alone: true when he has no man but himself, rnd: a die of our own (Math.random) }
                                            -> { how, who, cls, rule, reason, side: 'them' | 'ours', line, i } or null
     BohemiaFightWhy.lines(D)               every sentence in the table with its rule, for the gate
   The same reason is never worded the same way twice in a row: q.last holds the wording each rule used last. */
(function (root) {
  'use strict';
  function arr(x) { return Array.isArray(x) ? x : (x === undefined || x === null ? [] : [x]); }

  /* HOW IT BEGAN: the pit and the camp are the fight's own flags; then the hand-over's word (its head, and 'caught' on its tail
     for a party that hunted him down); a boss with no word; a word nobody listed is the street; no word at all is 'met' */
  function how(why, opts, D) {
    var H = (D && D.how) || {}, ks = Object.keys(H), o = opts || {};
    if (o.arena) return H.pit ? 'pit' : (D.how_none || 'met');
    if (o.camp && !o.campBoard) return H.camp ? 'camp' : (D.how_none || 'met');
    var s = String(why === undefined || why === null ? '' : why).trim();
    if (s) {
      var parts = s.toLowerCase().split(':').map(function (p) { return p.trim(); }), head = parts[0], tail = parts.length > 1 ? parts[parts.length - 1] : null, i;
      for (i = 0; i < ks.length; i++) { var h = H[ks[i]]; if (h.ends && tail && h.ends.indexOf(tail) >= 0 && (h.from || []).indexOf(head) >= 0) return ks[i]; }
      for (i = 0; i < ks.length; i++) { var g = H[ks[i]]; if (!g.ends && (g.from || []).indexOf(head) >= 0) return ks[i]; }
    }
    if (o.boss && H.boss) return 'boss';
    return s ? (D.how_unknown || 'street') : (D.how_none || 'met');
  }

  /* WHICH FACTIONS A KIND BELONGS TO, read off the fight's own tables (the tiers' mixes and heads, the act-one enemies' rows, mixes
     and heads): { kind: [faction, ...] }, the catch-all 'beasts' last. A new kind a lane adds to a faction's mix is that faction's
     from the moment it is in the table; nobody has to list it here. */
  function factions(T) {
    var m = {}, add = function (k, f) { if (typeof k !== 'string' || !k || !f) return; (m[k] = m[k] || []); if (m[k].indexOf(f) < 0) m[k].push(f); };
    var mixes = function (M) { Object.keys(M || {}).forEach(function (f) { Object.keys(M[f] || {}).forEach(function (ph) { var q = M[f][ph]; if (q && typeof q === 'object') Object.keys(q).forEach(function (k) { add(k, f); }); }); }); };
    var tiers = (T && T.tiers) || {}, own = (T && T.own) || {};
    (own.rows || []).forEach(function (r) { if (r) add(r.id, r.faction); });
    mixes(own.mix); mixes(tiers.mix);
    Object.keys(own.heads || {}).forEach(function (f) { add(own.heads[f], f); }); Object.keys(tiers.heads || {}).forEach(function (f) { add(tiers.heads[f], f); });
    Object.keys(m).forEach(function (k) { m[k].sort(function (a, b) { return (a === 'beasts') - (b === 'beasts'); }); });
    return m;
  }
  /* WHO THEY ARE: a kind is in the group that names it outright, else the group whose longest 'prefix_*' fits it, else the group
     that names one of its factions, else (a man nobody names, in a fight of a kind a group is kept for: a boss's fight, the pit)
     that fight's group */
  function groupOf(kind, D, facs, ctx) {
    var W = (D && D.who) || {}, ks = Object.keys(W), best = null, len = -1, i, j;
    for (i = 0; i < ks.length; i++) if ((W[ks[i]].kinds || []).indexOf(kind) >= 0) return ks[i];
    for (i = 0; i < ks.length; i++) { var p = W[ks[i]].kinds || [];
      for (j = 0; j < p.length; j++) { var k = p[j]; if (k.charAt(k.length - 1) === '*' && String(kind).indexOf(k.slice(0, -1)) === 0 && k.length > len) { best = ks[i]; len = k.length; } } }
    if (best) return best;
    var fs = Array.isArray(facs) ? facs : (facs && facs[kind]) || [];
    for (j = 0; j < fs.length; j++) for (i = 0; i < ks.length; i++) if ((W[ks[i]].factions || []).indexOf(fs[j]) >= 0) return ks[i];
    if (ctx) for (i = 0; i < ks.length; i++) if (W[ks[i]].when && ctx[W[ks[i]].when]) return ks[i];
    return null;
  }
  function clsOf(u) { return u && u.ghost ? 'dead' : u && u.beast ? 'beasts' : 'men'; }
  function who(them, D, facs, ctx) {
    var W = (D && D.who) || {}, n = {}, c = {}, order = [], list = arr(them).map(function (u) { return typeof u === 'string' ? { kind: u } : u; }).filter(Boolean);
    list.forEach(function (u) { var g = groupOf(u.kind, D, u.factions || facs, !u.beast && !u.ghost ? ctx : null); if (g) { if (!n[g]) { n[g] = 0; order.push(g); } n[g]++; } var k = g ? W[g].class || clsOf(u) : clsOf(u); c[k] = (c[k] || 0) + 1; });
    var id = order.sort(function (a, b) { return n[b] - n[a]; })[0] || null;
    var cls = id ? (W[id].class || 'men') : (Object.keys(c).sort(function (a, b) { return c[b] - c[a]; })[0] || 'men');
    return { id: id, cls: cls, name: id ? W[id].name || id : null, counted: n };
  }

  function fits(rule, h, w, facts) {
    if (arr(rule.how).indexOf(h) < 0 && rule.how !== '*') return false;
    var ws = arr(rule.who);
    if (!(rule.who === '*' || (w.id && ws.indexOf(w.id) >= 0) || ws.indexOf(w.cls) >= 0)) return false;
    return arr(rule.needs).every(function (k) { var f = facts ? facts[k] : false; return Array.isArray(f) ? f.indexOf(w.id) >= 0 : !!f; });
  }
  /* a man of his says it to him (', boss'); with nobody beside him he says it himself, so 'we' is 'I' and there is no boss to tell */
  var ALONE = [[/\b[Ww]e are\b/g, 'I am'], [/\b[Ww]e were\b/g, 'I was'], [/\b[Ww]e\b/g, 'I'], [/\b[Uu]s\b/g, 'me'], [/\b[Oo]urs\b/g, 'mine'], [/\b[Oo]ur\b/g, 'my']];
  function say(text, alone) {
    var t = String(text).replace(/\{boss\}/g, alone ? '' : ', boss');
    if (alone) { ALONE.forEach(function (r) { t = t.replace(r[0], r[1]); }); t = t.charAt(0).toUpperCase() + t.slice(1); }
    return t;
  }

  /* THE SENTENCE: the rules in the table's own order, first on how the fight really began, then on the way that how falls back
     to (the street and a fight nobody explained read as the road); a rule their side cannot say (nobody of theirs talks) is said
     by one of his men when it has his words, else passed over */
  function pick(q, D) {
    if (!D || !Array.isArray(D.rules)) return null;
    q = q || {};
    var rnd = typeof q.rnd === 'function' ? q.rnd : Math.random, them = arr(q.them), h0 = how(q.why, q.opts, D), w = who(them, D, q.factions, { boss: h0 === 'boss' || !!(q.opts && q.opts.boss), pit: h0 === 'pit' });
    var talker = them.some(function (u) { return u && u.talks !== false && !u.beast && !u.ghost && !u.machine; });
    var chain = [h0], seen = {}; seen[h0] = 1;
    for (var hk = h0; D.how && D.how[hk] && D.how[hk].falls_to && !seen[D.how[hk].falls_to];) { hk = D.how[hk].falls_to; seen[hk] = 1; chain.push(hk); }
    for (var c = 0; c < chain.length; c++) {
      for (var r = 0; r < D.rules.length; r++) {
        var rule = D.rules[r]; if (!fits(rule, chain[c], w, q.facts)) continue;
        var side = rule.them && rule.them.length && talker && w.cls === 'men' ? 'them' : (rule.ours && rule.ours.length ? 'ours' : null);
        if (!side) continue;
        if (rule.share !== undefined && !(rnd() < rule.share)) continue;
        var L = rule[side], last = q.last && q.last[rule.id + '/' + side], pool = [];
        for (var i = 0; i < L.length; i++) if (L.length < 2 || i !== last) pool.push(i);
        var at = pool[Math.min(pool.length - 1, Math.floor(rnd() * pool.length))];
        return { how: h0, via: chain[c], who: w.id, cls: w.cls, name: w.name, rule: rule.id, reason: rule.reason || null, side: side, i: at, key: rule.id + '/' + side, line: say(L[at], side === 'ours' && !!q.alone) };
      }
    }
    return null;
  }

  function lines(D) {
    var out = [];
    ((D && D.rules) || []).forEach(function (rule) { ['them', 'ours'].forEach(function (s) { (rule[s] || []).forEach(function (t, i) { out.push({ rule: rule.id, side: s, i: i, text: t }); }); }); });
    return out;
  }

  var api = { how: how, who: who, groupOf: groupOf, factions: factions, pick: pick, lines: lines, say: say };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.BohemiaFightWhy = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
