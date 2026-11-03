/* BOHEMIA UNIQUE NAME -- NO TWO MEN IN THE COMPANY SHARE A NAME (FIXES item 10, VAMILY rule 351(b), ask line 362; Paolo 11/3: 'I think
   three of them are named the same thing in my company').
   BATTLE BROTHERS' WAY: a brother is known by his name and his title, and two brothers never answer to the same one. Here:
     * A NEW MAN (at the post, and again when he is hired) is checked against everyone alive in the company: YOU (bohemia.main.v1),
       the crew screen's company (bohemia.company.v1) and the men hired since it was saved (bohemia.hired.v1), and the other men at
       the same post. Taken, he keeps his first name and another surname is rolled for him off the one names engine (his heritage,
       his sex, a seed of his own); if that runs dry, a nickname goes in front of it (LEFTY, SLIM...). A number is no new
       name: TOMAS REYES II is TOMAS REYES to the man reading the roster (EYES and Paolo 11/3), so names are compared without it. The
       dead give their names back.
     * A SAVE THAT ALREADY HAS TWINS is fixed on load: the first man keeps the name, every later twin is renamed the same way, his
       face, his body and everything else his own; his record (bohemia.climb.v1: level, gear, wounds, kills) was shared under the
       one name, so the renamed man takes a copy of it.
     BohemiaUniqueName.unique(name, taken{KEY:1}, opts{seed, sex, look}) -> a name not in taken (same case as given)
     BohemiaUniqueName.taken(extra?) -> the company's names alive now, as {KEY:1}
     BohemiaUniqueName.fixSaved() -> [{from, to}] the twins renamed (and written back)
     BohemiaUniqueName.key(name) -> the name as it is compared (upper case, one space)
   Words are attempts, draft:true. */
(function (root) {
  'use strict';
  /* the pool ran dry: a nickname in front, the Battle Brothers way (draft:true) */
  var NICK = ['LEFTY', 'SLIM', 'RED', 'DOC', 'SHORTY', 'BIG', 'LITTLE', 'OLD', 'YOUNG', 'TWO-TONE', 'HOLLYWOOD', 'PREACHER', 'SPARKS', 'DUSTY', 'TEX', 'HOOK'];
  function key(n) { return String(n == null ? '' : n).trim().replace(/\s+/g, ' ').toUpperCase(); }
  /* a name and the same name with a number on it are one name to the man reading them (TOMAS REYES, TOMAS REYES II) */
  function stem(n) { return key(n).replace(/\s+(II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII|XIV|XV|XVI|XVII|XVIII|XIX|XX|\d+)$/, ''); }
  function stems(taken) { var o = {}; for (var k in (taken || {})) if (taken[k]) o[stem(k)] = 1; return o; }
  function ls(k, d) { try { var v = JSON.parse(root.localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function names() { return root.BohemiaNames || (typeof require === 'function' ? (function () { try { return require('./bohemia_names.js'); } catch (e) { return null; } })() : null); }
  function sameCase(model, s) { return model === key(model) ? key(s) : s; }
  function unique(name, taken, opts) {
    taken = taken || {}; opts = opts || {};
    var n = String(name == null ? '' : name).trim(); if (!n) n = 'A STRANGER';
    var T = stems(taken), free = function (c) { return !T[stem(c)]; };
    if (free(n) && !/^(A STRANGER|YOU)$/i.test(n)) return n;
    var w = n.split(/\s+/), first = w[0], N = names(), seed = String(opts.seed == null ? n : opts.seed);
    /* a man's name on a man's body (rule 203): his sex as given, else read off his face, else a man's (the post's own default) */
    var sex = opts.sex || (opts.look && N && N.faceReads ? (function () { try { return N.faceReads(opts.look); } catch (e) { return null; } })() : null) || 'm';
    /* another surname off the names engine, his first name kept (a one-word name takes one) */
    if (N && N.roll) {
      for (var t = 0; t < 24; t++) {
        var r = null; try { r = N.roll('unique:' + seed + ':' + t, { sex: sex }); } catch (e) { r = null; }
        if (!r || !r.surname) continue;
        /* 'A STRANGER' (the post before the names engine loads) and a hire who answers to YOU are no first names: a whole new name */
        var c = /^(A|AN|YOU)$/i.test(first) ? sameCase(n, r.full || (r.given + ' ' + r.surname))
          : sameCase(n, (/^(EL|LA|BIG|LIL|OLD|THE)$/i.test(first) && w.length > 1 ? w[0] + ' ' + w[1] : first) + ' ' + r.surname);
        if (free(c)) return c;
      }
    }
    /* the pool ran dry: a nickname in front of his name, then two */
    var base = stem(n) === key(n) ? n : n.replace(/\s+\S+$/, '');
    for (var i = 0; i < NICK.length; i++) { var c2 = sameCase(n, NICK[i] + ' ' + base); if (free(c2)) return c2; }
    for (var a = 0; a < NICK.length; a++) for (var b = 0; b < NICK.length; b++) { var c3 = sameCase(n, NICK[a] + ' ' + NICK[b] + ' ' + base); if (a !== b && free(c3)) return c3; }
    return sameCase(n, base + ' ' + Date.now().toString(36).toUpperCase());
  }
  function alive(m) { return !!(m && m.name && !m.dead && !m.walked && !m.dismissed); }
  function taken(extra) {
    var t = {};
    var me = ls('bohemia.main.v1', null); if (me && me.name) t[key(me.name)] = 1;
    (ls('bohemia.company.v1', []) || []).forEach(function (m) { if (alive(m)) t[key(m.name)] = 1; });
    (ls('bohemia.hired.v1', []) || []).forEach(function (m) { if (alive(m)) t[key(m.name)] = 1; });
    (extra || []).forEach(function (n) { if (n) t[key(n)] = 1; });
    return t;
  }
  /* one man is one man: the same face (no two people alike, rule 121(i)), else the same hire id; a hire is in both lists until the
     crew screen folds him in, and its copy of him carries his face but not always his hire id */
  function who(m, i, list) { return m.look ? 'l:' + m.look : m.hid ? 'h:' + m.hid : list + ':' + i; }
  function fixSaved() {
    var co = ls('bohemia.company.v1', null), hd = ls('bohemia.hired.v1', null), me = ls('bohemia.main.v1', null);
    if (!Array.isArray(co) && !Array.isArray(hd)) return [];
    var owner = {}, all = {}, out = [], to = {};
    if (me && me.name) owner[stem(me.name)] = 'main';
    [['co', co], ['hd', hd]].forEach(function (L) { (L[1] || []).forEach(function (m) { if (m && m.name) all[key(m.name)] = 1; }); });
    [['co', co], ['hd', hd]].forEach(function (L) {
      (L[1] || []).forEach(function (m, i) {
        if (!alive(m)) return;
        if (m.main) { owner[stem(m.name)] = 'main'; return; }
        var id = who(m, i, L[0]);
        if (to[id]) { m.name = to[id]; return; }   /* the same man in the other list: the same new name */
        var k = stem(m.name);
        if (!owner[k] || owner[k] === id) { owner[k] = id; return; }
        var nn = unique(m.name, all, { seed: id, sex: m.sex || (m.woman ? 'f' : null), look: m.look || null });
        out.push({ from: m.name, to: nn, look: m.look || null }); to[id] = nn; all[key(nn)] = 1; owner[stem(nn)] = id; if (!m.was) m.was = m.name; m.name = nn;
      });
    });
    if (!out.length) return out;
    try {
      if (Array.isArray(co)) root.localStorage.setItem('bohemia.company.v1', JSON.stringify(co));
      if (Array.isArray(hd)) root.localStorage.setItem('bohemia.hired.v1', JSON.stringify(hd));
      var cl = ls('bohemia.climb.v1', null);
      if (cl && typeof cl === 'object') { out.forEach(function (r) { if (cl[r.from] && !cl[r.to]) cl[r.to] = JSON.parse(JSON.stringify(cl[r.from])); }); root.localStorage.setItem('bohemia.climb.v1', JSON.stringify(cl)); }
    } catch (e) {}
    root.__NAMES_UNTWINNED = out;
    return out;
  }
  var API = { unique: unique, taken: taken, fixSaved: fixSaved, key: key, stem: stem, NICK: NICK, draft: true };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaUniqueName = API;
})(typeof window !== 'undefined' ? window : this);
