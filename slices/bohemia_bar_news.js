/* BOHEMIA BAR NEWS -- what the keeper hears from down the road (RUN TWO [the bar names the news], 10/18/26).
   ECONOMY day 75: the next town has news 94 percent of the time and the bar had never told one, because it read a fixed
   list of eleven lines and no other town. Battle Brothers' tavern gives ONE rumour free every visit and, since 1.4,
   tells the situations of nearby towns 'so that you get a better idea of trading, recruiting and work opportunities
   nearby' (wiki 1931 Tavern Rumors, Dev Blog 138). A rumour never makes the thing it tells: it reads what is already on
   the map. So does this:
     - WHERE: the towns the map's loop arrives at, records/target/BOHEMIA_BAR_NEWS_PLACES.json (the faction seats,
       baked from the city page by tools/bohemia_run2_bar_news_places.py), nearest first from here
     - WHAT: a raid, a taking or a convoy from FACTIONS' raid ledger on the map's day (what really happened, told first),
       else the town's rolled situation from the map's OWN dice (engine/bohemia_livingmap.js traitsFor: the same roll the
       map shows at that town's gate and hands the screen on arrival), so what the keeper says is what you find there
     - HOW IT IS SAID: records/target/settlement_rumours.json 'news' (draft:true words), one line per kind picked by the
       town and the week, the source and the doubt in the mouth
     BohemiaBarNews.load(base, cb)   read the two files (base: the records/target folder, default '../records/target/')
     BohemiaBarNews.set(places, news) the same from objects (the gate)
     BohemiaBarNews.ready()
     BohemiaBarNews.list(o)          o = {here:{name|id, block?:[x,y]}, day, traits: settlement_traits.json, ledger:{marks}}
                                     -> [{id, kind:'news', place, trait, caused, by, dist, dir, says, draft}], one per town,
                                     what happened first, then the nearest; never here, never a town the bar may not name
     BohemiaBarNews.quiet(o)         the keeper's line when no town in reach has news (about one visit in twenty) */
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var PLACES = null, NEWS = null, READY = false;
  var CAUSED = ['raided', 'conquered', 'well_supplied'];   /* FACTIONS' ledger cards that have a line, in the order they are told */
  function LM() { return root.BohemiaLivingMap || (HASREQ ? (function () { try { return require('../engine/bohemia_livingmap.js'); } catch (e) { return null; } })() : null); }
  function seedOf(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function norm(v) { return String(v || '').toUpperCase().replace(/[\s_]/g, ''); }
  function set(places, news) { PLACES = places || null; NEWS = news || null; READY = !!(PLACES && NEWS); return READY; }
  function ready() { return READY; }
  function load(base, cb) {
    base = base || '../records/target/';
    if (typeof fetch === 'undefined') { if (cb) cb(false); return; }
    Promise.all([fetch(base + 'BOHEMIA_BAR_NEWS_PLACES.json').then(function (r) { return r.json(); }),
                 fetch(base + 'settlement_rumours.json').then(function (r) { return r.json(); })])
      .then(function (a) { set(a[0], a[1] && a[1].news); if (cb) cb(READY); })
      .catch(function () { if (cb) cb(false); });
  }
  function placeOf(here) {
    var ps = (PLACES && PLACES.places) || [], k = norm(here && (here.id || here.name));
    for (var i = 0; i < ps.length; i++) if (norm(ps[i].id) === k || norm(ps[i].name) === k) return ps[i];
    return null;
  }
  /* where it lies, in a keeper's words: 'just up the road' inside six cells (2.3 km), else the compass (y runs south) */
  function dirOf(hx, hy, x, y) {
    var D = (NEWS && NEWS.dir) || {}, dx = x - hx, dy = y - hy, dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= (D.near_cells || 6)) return { dist: dist, key: 'near', words: D.near || 'just up the road' };
    var a = Math.atan2(-dy, dx) * 180 / Math.PI, keys = ['E', 'NE', 'N', 'NW', 'W', 'SW', 'S', 'SE'];
    var key = keys[((Math.round(a / 45) % 8) + 8) % 8];
    return { dist: dist, key: key, words: D[key] || 'down the road' };
  }
  function agoOf(n) {
    var A = (NEWS && NEWS.ago) || {};
    if (n <= 0) return A['0'] || 'today';
    if (n === 1) return A['1'] || 'last night';
    var w = A.words || [];   /* said, never a digit: 'three nights back' */
    return w[n - 2] ? String(A.n || '{n} nights back').replace('{n}', w[n - 2]) : (A.week || 'a week back');
  }
  /* the n-th town with the same kind of news in one telling takes the next way of saying it, so two market days in a
     row never come out of the keeper's mouth word for word */
  function lineFor(trait, p, day, fill, nth) {
    var L = (NEWS && NEWS.lines && NEWS.lines[trait]) || [];
    if (!L.length) return null;
    var t = L[(seedOf(trait + ':' + Math.floor((day || 0) / 7)) + (nth || 0)) % L.length];
    var of = p.of || ('the ' + p.name + "'s place");
    return t.replace(/\{at\}/g, p.at || ('over by the ' + p.name)).replace(/\{of_cap\}/g, of.charAt(0).toUpperCase() + of.slice(1)).replace(/\{of\}/g, of)
      .replace(/\{dir\}/g, fill.dir).replace(/\{by\}/g, fill.by || 'crew').replace(/\{ago\}/g, fill.ago || '');
  }
  function list(o) {
    o = o || {};
    if (!READY) return [];
    var day = o.day || 0, me = placeOf(o.here), hb = o.here && o.here.block, out = [];
    var hx = hb ? hb[0] : (me ? me.x : null), hy = hb ? hb[1] : (me ? me.y : null);
    var reach = PLACES.reach_cells || 106, marks = (o.ledger && o.ledger.marks) || [], lm = LM();
    (PLACES.places || []).forEach(function (p) {
      if (p.told === false || p === me || (o.here && norm(p.name) === norm(o.here.name))) return;
      var d = hx == null ? { dist: Infinity, key: 'unknown', words: (NEWS.dir && NEWS.dir.unknown) || 'down the road' } : dirOf(hx, hy, p.x, p.y);
      if (d.dist !== Infinity && d.dist > reach) return;
      /* what happened there first: the ledger's mark live on the map's day (the same test BohemiaArrivalTraits.active makes) */
      var hit = null;
      CAUSED.forEach(function (id) { if (hit) return; marks.forEach(function (m) { if (!hit && m.place === p.id && m.trait === id && day >= m.from && day < m.until) hit = m; }); });
      var trait = hit ? hit.trait : null;
      if (!trait && o.traits && lm && lm.traitsFor) {
        var rolled = lm.traitsFor(o.traits, p.name, day).filter(function (t) { return NEWS.lines[t.id]; });
        if (rolled.length) trait = rolled[0].id;
      }
      if (!trait) return;
      out.push({ id: 'news:' + p.id + ':' + trait, kind: 'news', place: p.name, trait: trait, caused: !!hit, by: hit ? hit.by || null : null,
                 dist: d.dist, dir: d.key, says: null, draft: true, _p: p, _fill: { dir: d.words, by: hit && hit.by, ago: hit ? agoOf(day - hit.from) : '' } });
    });
    out.sort(function (a, b) { return (b.caused - a.caused) || (a.dist - b.dist) || (seedOf(a.id + day) - seedOf(b.id + day)); });
    var nth = {};
    out.forEach(function (it) { it.says = lineFor(it.trait, it._p, day, it._fill, nth[it.trait] = (nth[it.trait] || 0) + 1); delete it._p; delete it._fill; });
    return out.filter(function (it) { return !!it.says; });
  }
  function quiet(o) {
    var Q = (NEWS && NEWS.lines && NEWS.lines.quiet) || [];
    if (!Q.length) return null;
    var k = norm(o && o.here && o.here.name) + ':quiet:' + Math.floor(((o && o.day) || 0) / 7);
    return { id: 'news:quiet', kind: 'news', place: null, trait: null, says: Q[seedOf(k) % Q.length], draft: true };
  }
  var API = { load: load, set: set, ready: ready, list: list, quiet: quiet, dirOf: dirOf, CAUSED: CAUSED };
  if (HASREQ) module.exports = API;
  root.BohemiaBarNews = API;
})(typeof window !== 'undefined' ? window : this);
