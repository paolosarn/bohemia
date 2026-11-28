/* BOHEMIA -- THE CHAMPION'S READ (FIGHT SCREEN 4, 11/27/26; VAMILY rules 493(c), 482, 495(b); the coordinator's order of 11/27:
   'a champion reads on the fight screen (his name, his face, why he is dangerous, the prize on him) without a pop-up').

   MEASURED BEFORE THIS FILE (tools/bohemia_fight_screen_the_champion.js, the demo upright, EL TUERTO leading a road crew): the bell
   said 'EL TUERTO: We have followed your cart since morning' and nothing said he was a champion; the phone's card read 'EL TUERTO,
   LV 16' like any man of theirs; his sheet carried 'the road crew's champion' in small type and nothing on why he is dangerous; no
   prize existed (his hatchet dropped on the same roll as any thug's).

   ONE PLACE says what the fight says about a champion. The fight reads each champion once, when the band is dealt, and keeps it on
   him (u.champRead); the phone's card, his sheet, the fight's opening line and the spoils all read that, never a second copy:
     name, title    his own (the band's deal: records/target/bb/bohemia_enemies.json champions.kinds, BESTIARY's)
     why            WHY HE IS DANGEROUS, measured, never written by hand: his numbers against the middle of his own men on this board
                    (blood, armour, the skill his weapon uses, nerve, who moves first); the edges that clear their bar, biggest first,
                    in the words of champions.read (a data file a modder edits; drafts for WORDS)
     prize          THE PRIZE ON HIM: what the spoils give when he falls (engine/bohemia_spoils.js found(), BESTIARY 4's champion rule,
                    Battle Brothers: a champion's named item always drops): his weapon whole, and the batteries in his pockets (the fight's
                    u.prize). A fled champion takes it with him.
   Pure: no screen, no page globals; what it needs from the fight (is a weapon ranged, our name for a piece) is handed in.

     BohemiaChampion.read(u, band, C, opt)   -> { id, name, title, mark, why, edges:[{k, x}], prize, prizeLine, draft:true } or null
                                               u: the champion; band: every unit of his side as dealt; C: champions (kinds, read);
                                               opt: { weapons: rows, ranged(w), nameOf(row) }
     BohemiaChampion.edges(u, band, R, opt)  -> [{ k, x }] the edges that clear their bar, biggest first
     BohemiaChampion.prizeOf(u, c, opt)      -> { part:'weapon', id, name, cls, durability, batteries? } | { batteries } | null
     BohemiaChampion.why(edges, R, sex)      -> the line, or the plain word when no edge clears ({his} {he} {him} filled for the person)
     BohemiaChampion.sexOf(u, R)             -> 'm' | 'f': u.sex, else the name's first word (R.she_first), else 'm'
   node: require('./bohemia_champion.js')   Gate: gates/a_champion_reads_gate.js */
(function (root) {
  'use strict';
  function n(v) { return typeof v === 'number' && isFinite(v) ? v : null; }
  function middle(a) { var s = a.filter(function (x) { return x !== null && x > 0; }).sort(function (p, q) { return p - q; }); if (!s.length) return null;
    var m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
  function wpn(u) { var w = u && u.weapon; return w && !w.fists ? w : null; }
  /* what each edge measures on a man (the fight's own unit fields) */
  var MEASURE = {
    blood: function (u) { return n(u.hpMax); },
    armour: function (u) { var h = n(u.armHMax) || 0, b = n(u.armBMax) || 0; return h + b > 0 ? h + b : null; },
    hits: function (u, opt) { var w = wpn(u), r = !!(w && opt && typeof opt.ranged === 'function' && opt.ranged(w)); return n(r ? u.rskill : u.mskill); },
    nerve: function (u) { return n(u.resolve); },
    first: function (u) { return n(u.initiative); }
  };
  function edges(u, band, R, opt) {
    var E = (R && R.edges) || {}, men = (band || []).filter(function (m) { return m && m !== u && m.side === u.side && !m.beast && !m.machine && !m.ghost && !m.champion && !m.boss; }), out = [];
    Object.keys(E).forEach(function (k) {
      var f = MEASURE[k]; if (!f) return;
      var mine = f(u, opt), theirs = middle(men.map(function (m) { var w = k === 'hits' ? f(m, opt) : f(m); return w; }));
      if (mine === null || theirs === null) return;
      var x = mine / theirs; if (x >= (E[k].at || 1.2)) out.push({ k: k, x: Math.round(x * 100) / 100 });
    });
    return out.sort(function (a, b) { return b.x - a.x; }).slice(0, R && R.shown ? R.shown : 2);
  }
  function times(x, R) { var t = (R && R.times) || [], w = null; t.forEach(function (s) { if (x >= s[0]) w = s[1]; }); return w; }
  /* HIS OR HER: the fight's own sex for the person (u.sex) when it has one, else the first word of the name (R.she_first: MAMA LOCA, LA NAVAJA),
     else he; the words follow the person, never the other way (ONE ID, ONE WHOLE PERSON) */
  function sexOf(u, R) { var s = String((u && u.sex) || '').toLowerCase(); if (s === 'f' || s === 'm') return s;
    var w = String((u && u.name) || '').trim().split(/\s+/)[0].toUpperCase(); return ((R && R.she_first) || []).indexOf(w) >= 0 ? 'f' : 'm'; }
  function fill(t, sx, R) { var P = (R && R.words && R.words[sx]) || { his: 'HIS', he: 'HE', him: 'HIM' }; return String(t || '').replace(/\{(his|he|him)\}/g, function (m, k) { return P[k] || m; }); }
  function why(E, R, sx) {
    if (!E || !E.length) return (R && R.plain) || '';
    return E.map(function (e) { var w = R.edges[e.k] || {}, tw = times(e.x, R); return fill(tw && w.times ? w.times.replace('{times}', tw) : (w.more || ''), sx || 'm', R); }).filter(Boolean).join('. ') + '.';
  }
  /* THE PRIZE ON HIM is what the spoils give when he falls (engine/bohemia_spoils.js found(), BESTIARY 4's champion rule: his weapon and armour
     found whole, his pockets' batteries, the fight's u.prize): the read names his weapon and the batteries, never a promise the spoils do not keep */
  function prizeOf(u, c, opt) {
    var w = wpn(u), bat = u && u.prize && n(u.prize.batteries) > 0 ? u.prize.batteries | 0 : 0, P = {};
    if (w) {
      var own = w.of || w, row = ((opt && opt.weapons) || []).filter(function (r) { return r.id === own.id; })[0] || null;
      var nm = ''; try { nm = opt && typeof opt.nameOf === 'function' ? String(opt.nameOf(own) || '') : ''; } catch (e) { nm = ''; }
      P = { part: 'weapon', id: own.id, name: (nm || own.name || own.id || '').toUpperCase(), cls: row ? row.class : (own.class || null), durability: row ? row.durability : (own.durability != null ? own.durability : null) };
    }
    if (bat) P.batteries = bat;
    return P.part || P.batteries ? P : null;
  }
  function prizeLine(P, R, sx) {
    var W = (R && R.prize) || {}; if (!P) return '';
    var bits = [];
    if (P.part) bits.push(String(W.piece || '{his} {name}').replace('{name}', P.name || ''));
    if (P.batteries) bits.push(String(W.batteries || '{n} BATTERIES').replace('{n}', P.batteries));
    return fill((W.on || '') + bits.join(W.and || ' AND ') + (W['if'] ? W['if'] : ''), sx || 'm', R);
  }
  function read(u, band, C, opt) {
    if (!u || !u.champion) return null;
    var R = (C && C.read) || {}, c = C && C.kinds ? C.kinds[u.kind] : null, E = edges(u, band, R, opt), P = prizeOf(u, c, opt), sx = sexOf(u, R);
    return { id: u.id, name: u.name, sex: sx, title: u.champTitle || (c && c.title) || '', mark: R.mark || 'CHAMPION', why: why(E, R, sx), edges: E, prize: P, prizeLine: prizeLine(P, R, sx), draft: true };
  }
  var api = { read: read, edges: edges, prizeOf: prizeOf, prizeLine: prizeLine, why: why, sexOf: sexOf, middle: middle };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.BohemiaChampion = api;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
