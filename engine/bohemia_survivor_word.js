/* BOHEMIA SURVIVOR'S WORD -- THE END SCREEN'S ONE LINE, IN PLACE OF 'YOU WON' (WORDS, rule 315, ask line 310, Paolo 11/2: 'on the
   victory screen, one of your surviving characters provides commentary on how the battle went... a little world building into the
   UI, to replace the you won... for the enemy type that you just vanquished, or enemy camp, whatever group... I want it to be funny,
   I want my characters to say funny things, like morbid funny, like real killers').
   One man of his says one line with his face and his name (A QUEST IS PEOPLE, PLACES AND THINGS: text comes from a mouth with a
   portrait, never a card). WHO: a man still on his feet (never YOU, never a beast, never the dead); none standing, one alive on the
   ground (a struck-down man wakes up for it); nobody, nothing is said and the screen keeps its word. HIS VOICE: his personality type
   out of WORDS' bank (records/target/bb/crew_voices.json), picked exactly the way the fight picks it (off his look, FNV-1a, the
   types sorted), so the man who called the shots in the fight is the same voice here. WHAT: how it went (the bank's after.how, the
   first that holds: a man lost for good, a boss, a man struck down, outnumbered, close, flawless, else the plain win), the kind they
   beat (raiders, robots, kids, heavies, a beast, wolves, the dead, a boss, a camp: enemy.<kind>.win) and the result (a loss, pulled
   out, a wipe each their own). Spanglish on WORDS' one dial (engine/bohemia_spanglish.js regFor, 'after:' + how), never the player.
     BohemiaSurvivorWord.pick(bank, ctx, rnd?) -> {who, look, type, line, sp, how, kind, result} | null
     BohemiaSurvivorWord.how(bank, ctx) / kind(bank, ctx) / typeOf(bank, man) / callName(man)
   ctx: {result:'won'|'lost'|'ran'|'wipe', men:[{name, main, dead, down, beast, look, personality, hp, hpMax, escaped}],
         theirs, bodies:[{kind, dead, fled, beast, ghost, machine, boss, name}], faction, boss (name), camp (bool), by, id}
   Words are WORDS' (draft:true in the bank). */
(function (root) {
  'use strict';
  function seedOf(text) { var h = 2166136261; for (var i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function titleName(n) { return String(n || '').toLowerCase().replace(/(^|[\s-])([a-zà-þ])/g, function (m, a, b) { return a + b.toUpperCase(); }); }
  /* a mate by his first name, the way the fight's lines call him (callName in the fight); YOU is 'the boss' */
  function callName(m) {
    if (!m) return '';
    if (m.main) return 'the boss';
    var w = String(m.name || '').split(/\s+/);
    if (w.length < 2) return titleName(m.name);
    return titleName(w.slice(0, /^(el|la|los|las|de|del|the|big|lil|old)$/i.test(w[0]) ? 2 : 1).join(' '));
  }
  function typeOf(B, m) {
    if (!B || !B.types || !m) return null;
    if (m.personality && B.types[m.personality]) return m.personality;
    var ks = Object.keys(B.types).sort(); return ks.length ? ks[seedOf('type:' + (m.look || m.name)) % ks.length] : null;
  }
  function V(B) { return (B && B.after && B.after.value) || { flawless_hp: 0.9, close_hp: 0.35, enemy_share: 0.35 }; }
  function ratio(B) { return (B && B.pace && B.pace.value && B.pace.value.outnumbered_ratio) || 1.5; }
  function crew(ctx) { return (ctx.men || []).filter(function (m) { return m && !m.beast; }); }
  /* how it went: the first that holds, in the bank's own order */
  function how(B, ctx) {
    var men = crew(ctx), v = V(B), up = men.filter(function (m) { return !m.dead && !m.down; });
    var order = (B && B.after && B.after.how) || ['lost_one', 'boss', 'man_down', 'outnumbered', 'close', 'flawless'];
    var bodies = ctx.bodies || [], theirs = ctx.theirs || bodies.length;
    var test = {
      lost_one: function () { return men.some(function (m) { return m.dead && !m.main; }); },
      boss: function () { return !!ctx.boss || bodies.some(function (b) { return b && b.boss && b.dead; }); },
      man_down: function () { return men.some(function (m) { return m.down && !m.dead && !m.main; }); },
      outnumbered: function () { return men.length > 0 && theirs >= men.length * ratio(B); },
      close: function () { var hp = 0, mx = 0; up.forEach(function (m) { if (m.hpMax > 0) { hp += Math.max(0, m.hp || 0); mx += m.hpMax; } }); return mx > 0 && hp / mx < v.close_hp; },
      flawless: function () { return men.length > 0 && men.every(function (m) { return !m.dead && !m.down && (!(m.hpMax > 0) || (m.hp || 0) / m.hpMax >= v.flawless_hp); }); }
    };
    for (var i = 0; i < order.length; i++) if (test[order[i]] && test[order[i]]()) return order[i];
    return 'win';
  }
  /* the kind they beat: a boss, a camp, the dead, wolves, any beast, the robots and their mechanic, else their faction */
  function kind(B, ctx) {
    var b = ctx.bodies || [], K = (B && B.after && B.after.kinds) || {};
    if (ctx.boss || b.some(function (x) { return x && x.boss && x.dead; })) return 'boss';
    if (ctx.camp) return 'camp';
    if (b.length && b.every(function (x) { return x.ghost; })) return 'ghost';
    if (b.length && b.every(function (x) { return x.beast; })) return b.every(function (x) { return /wolf/i.test(String(x.kind || x.name || '')); }) ? 'wolves' : 'beast';
    if (b.length && b.filter(function (x) { return x.machine; }).length * 2 > b.length) return 'machine';
    return K[ctx.faction] || (ctx.faction && B && B.enemy && B.enemy[ctx.faction] ? ctx.faction : 'raiders');
  }
  function speakerOf(ctx, rnd, B) {
    var men = crew(ctx).filter(function (m) { return !m.main && !m.dead; });
    var up = men.filter(function (m) { return !m.down; }), pool = up.length ? up : men;
    if (!pool.length) return null;
    /* every man with a voice in the bank, the same man for the same fight (a reload of the screen is the same line) */
    pool = pool.filter(function (m) { return !!typeOf(B, m); });
    return pool.length ? pool[Math.floor(rnd() * pool.length)] : null;
  }
  /* a name mid-line is 'the Pot's Foreman', a name that starts a line or a sentence is 'The' (the fight's own fix for 'the boss') */
  function fill(t, o) { var x = String(t).replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? String(o[k]) : m; }).replace(/(^|[.!?]\s+)the /g, function (m, a) { return a + 'The '; });
    return x.charAt(0).toUpperCase() + x.slice(1); }
  /* every one of theirs a beast, a machine or a ghost: no line about what a man wears or carries */
  function notPeople(ctx) { var b = (ctx.bodies || []).filter(function (x) { return x && (x.dead || x.fled); }); return b.length > 0 && b.every(function (x) { return x.beast || x.machine || x.ghost; }); }
  function forKind(B, ctx, xs) { if (!xs || !notPeople(ctx) || !B || !B.after || !B.after.people_only) return xs; var re = new RegExp(B.after.people_only, 'i'), ok = xs.filter(function (x) { return !re.test(x); }); return ok.length ? ok : null; }
  function spOn(man, key, type, B, rnd) {
    if (!man || man.main) return false;   /* the player never speaks Spanglish (the first votes) */
    var SPG = root.BohemiaSpanglish || (typeof require === 'function' ? (function () { try { return require('./bohemia_spanglish.js'); } catch (e) { return null; } })() : null);
    if (SPG && SPG.regFor) return SPG.regFor(man.id || man.name, key) !== 'en';
    var S = B && B.spanglish ? B.spanglish.value : null, t = B && type ? B.types[type] : null;
    return !!S && rnd() < S.share * (t && t.lean ? t.lean : 1);
  }
  function pick(B, ctx, rnd) {
    if (!B || !B.types || !ctx) return null;
    var seed = seedOf(String(ctx.id || '') + ':' + (ctx.men || []).map(function (m) { return m.name + (m.dead ? 'x' : m.down ? 'v' : ''); }).join(','));
    if (!rnd) { var s = seed || 1; rnd = function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; }
    var man = speakerOf(ctx, rnd, B); if (!man) return null;
    var tk = typeOf(B, man), T = B.types[tk], L = T && T.lines; if (!L) return null;
    var result = ctx.result || 'won', h = result === 'won' ? how(B, ctx) : result, k = kind(B, ctx), list = null, sp = false, key = 'after:' + h;
    var men = crew(ctx), up = men.filter(function (m) { return !m.dead && !m.down; });
    var about = h === 'lost_one' ? men.filter(function (m) { return m.dead && !m.main && m !== man; })[0] : h === 'man_down' ? men.filter(function (m) { return m.down && !m.dead && !m.main && m !== man; })[0] : null;
    if ((h === 'lost_one' || h === 'man_down') && !about) h = 'win';   /* the one it is about is the speaker himself: the plain win */
    var bossName = ctx.boss || ((ctx.bodies || []).filter(function (b) { return b && b.boss && b.dead; })[0] || {}).name || '';
    /* a count reads as a word ('Seven of them'), the way a man says it */
    var NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
    var said = function (n) { n = n | 0; return NUM[n] || String(n); };
    var o = { name: about ? callName(about) : '', boss: bossName ? titleName(bossName).replace(/^The /, 'the ') : '', them: said(ctx.theirs || (ctx.bodies || []).length || 0), us: said(men.length), by: ctx.by || 'They' };
    var EK = B.enemy && B.enemy[k] && B.enemy[k].win, np = notPeople(ctx), share = np ? (V(B).enemy_share_not_people || V(B).enemy_share) : V(B).enemy_share;
    key += ':' + (ctx.id || seed);   /* the dial rolls each fight's line afresh, the same line on a reload of the same screen */
    /* the English list, else its Spanglish twin when the dial says so and the twin fits the kind they beat */
    function two(P) { var en = forKind(B, ctx, P && P.en), tw = forKind(B, ctx, P && P.sp); if (!en || !en.length) return null; sp = !!(tw && tw.length) && spOn(man, key, tk, B, rnd); return sp ? tw : en; }
    if (result === 'won') {
      var HL = h !== 'win' && L.win && L.win[h];
      /* a kind's own line part of the time where nobody of his is down or dead (a friend on the ground gets the floor) */
      if (EK && EK.length && h !== 'lost_one' && h !== 'man_down' && (h !== 'boss' || !HL) && rnd() < share) list = EK;
      else list = (HL && two(HL)) || two(L.win) || (EK && EK.length ? EK : null);
    } else {
      var R = L[result === 'wipe' ? 'wipe' : result === 'ran' ? 'ran' : 'lost']; if (!R || !R.en || !R.en.length) return null;
      list = two(R);
    }
    if (!list || !list.length) return null;
    return { who: man.name, look: man.look || null, main: false, type: tk, line: fill(list[Math.floor(rnd() * list.length)], o), sp: sp, how: h, kind: k, result: result,
      about: about ? about.name : null };
  }
  var API = { pick: pick, how: how, kind: kind, typeOf: typeOf, callName: callName, seedOf: seedOf };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaSurvivorWord = API;
})(typeof window !== 'undefined' ? window : this);
