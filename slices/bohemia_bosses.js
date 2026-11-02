/* THE BOSSES (BOSSES lane, 11/2/26, rule 302; ask line 287).
   PAOLO 11/2: 'Battle Brothers has unique locations and bosses with themes, I want that too... each time you kill a boss you get
   something that helps you interact with the city... that's why we made the city how we made it, in grids.'
   MEASURED FIRST (records/BOHEMIA_BOSSES_ACT_ONE_THE_FIRST_THREE_11_2_26.md): WORLD TWO's map (slices/bohemia_his_map.js) already
   places the next boss's sign, marks his place, hands his fight through the one door and changes the map where he falls; but the
   fight was nine brigands with his name on the card, his place was a skull on a street, and beating him handed you nothing to do.
   THIS FILE IS THE REST, read from records/target/bb/boss_act_one.json (a modder's file, a row per boss, matched by name):
     (1) HIS PLACE: a landmark on his own block, drawn at one size at every zoom, a dark shape through the static before you know
         whose it is (a black smoke stack, a water tower, two glowing tanks: Battle Brothers' legendary location you see from
         the road), named once his sign is read, changed the moment he falls (the kitchen lit, the tower running, the tanks clean).
     (2) HIS RUMOUR: the moment his sign is in the world, a person posts about him on the phone's feed (who he is and his lesson).
     (3) HIS FIGHT: the man himself (his kind, his name, his gear, more blood), his own crew, his own board, one lesson; the map's
         hand-over carries it (WORLD TWO's startFight asks dress()), the fight dresses the man (__THE_BOSS_IS_A_MAN__).
     (4) HIS VERB: when he falls the verb is yours, and the phone's band shows it as a button wherever it works on the grid:
         COOK (anywhere off a town, once a day: the crew heals like a night's sleep, your cookfire stays on that block),
         OPEN THE MAIN (a street block beside the water works: the main runs for good, the block pays you), PURIFY THE WATER (beside
         open water or a main you opened: a clean-water block for good, every fresh wound in the crew closes two days sooner).
         Every block you used it on stays drawn on the map. The phone asks verbHere() and presses use() (bohemia_phone.js, marked).
   Every word is draft:true (the file's own flag); every number is a shape TUNING owns. Gate: gates/bosses_act_one_gate.js. */
(function (root) {
  'use strict';
  var KEY = 'bohemia.bosses.v1', DATA_URL = '../records/target/bb/boss_act_one.json';
  var DATA = null, S = null, GLY = {}, MAINS = null, LAST = { drew: {}, used: [] };

  /* ---------- small things ---------- */
  function HM() { try { return root.BohemiaHisMap || null; } catch (e) { return null; } }
  function hs() { var h = HM(); try { return h && h.state ? h.state() : null; } catch (e) { return null; } }
  function cheb(ax, ay, bx, by) { return Math.max(Math.abs(ax - bx), Math.abs(ay - by)); }
  function here() { try { return [city.x | 0, city.y | 0]; } catch (e) { return null; } }
  function N() { try { return (om && om.n) | 0; } catch (e) { return 0; } }
  function walk(x, y) { try { return cityWalkable(x, y); } catch (e) { return false; } }
  function dist(x, y) { try { var t = om.at(x, y); return t ? t.district : null; } catch (e) { return null; } }
  function day() { try { return loopDay() | 0; } catch (e) { return 0; } }
  function bases() { try { return ctBases() || {}; } catch (e) { return {}; } }
  function nearTown(x, y, r) { var bs = bases(); for (var n in bs) { var b = bs[n]; if (b && cheb(b.x | 0, b.y | 0, x, y) <= r) return n; } return null; }
  function seen(x, y) { try { return typeof fogSeen !== 'function' || fogSeen(x, y); } catch (e) { return true; } }
  function bench() { try { return !FOG.on; } catch (e) { return true; } }
  function feed(who, txt, kind) { try { if (root.BOHEMIA_FEED) root.BOHEMIA_FEED.push({ who: who, txt: txt, kind: kind || 'world', draft: true }); return true; } catch (e) { return false; } }
  function whereWord(x, y) {   /* in his words: the side of the nearest town ('the Cartel side'), else the block */
    var bs = bases(), tn = null, td = 1e9; for (var n in bs) { var b = bs[n]; if (!b) continue; var d = cheb(b.x | 0, b.y | 0, x, y); if (d < td) { td = d; tn = n; } }
    return (tn && td <= 14) ? 'the ' + tn + ' side' : 'that block';
  }

  /* ---------- the data and the state (kept with WORLD TWO's game: a new company is a new state) ---------- */
  function loadData() {
    if (DATA || loadData.busy) return; loadData.busy = true;
    try { fetch(DATA_URL, { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) { DATA = (j && j.bosses) ? j : null; }).catch(function () { loadData.busy = false; }); } catch (e) { loadData.busy = false; }
  }
  function row(n) { if (!DATA) return null; for (var i = 0; i < DATA.bosses.length; i++) if (DATA.bosses[i].n === n) return DATA.bosses[i]; return null; }
  function verbRow(id) { if (!DATA) return null; for (var i = 0; i < DATA.bosses.length; i++) if (DATA.bosses[i].verb && DATA.bosses[i].verb.id === id) return DATA.bosses[i]; return null; }
  function fresh(seed) { return { v: 1, seed: seed, verbs: {}, marks: [], rumours: {} }; }
  function save() { try { root.localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function sync() {
    var h = hs(); if (!h) return false;
    if (!S) { try { S = JSON.parse(root.localStorage.getItem(KEY) || 'null'); } catch (e) { S = null; } }
    if (!S || S.v !== 1 || S.seed !== h.seed) { S = fresh(h.seed); save(); }
    if (DATA) DATA.bosses.forEach(function (r) { if (r.verb && h.boss.fallen[r.n] && !S.verbs[r.verb.id]) grant(r, h.boss.fallen[r.n]); });   /* a save from before this file */
    return true;
  }

  /* ---------- (2) the rumour, the moment his sign is in the world ---------- */
  function rumours() {
    var h = hs(); if (!h || !DATA || bench()) return;
    var s = h.boss.sign, names = [];
    if (s && s.n) names.push(s.n);
    for (var n in h.boss.found) names.push(n);
    names.forEach(function (n) { var r = row(n); if (!r || !r.rumour || S.rumours[n] || h.boss.fallen[n]) return;
      if (feed(r.rumour.who, r.rumour.txt, 'world')) { S.rumours[n] = day() + 1; save(); LAST.rumour = n; } });
  }

  /* ---------- (3) his fight: WORLD TWO's startFight asks this before the one door ---------- */
  function dress(msg, r) {
    var b = row(r && r.n); if (!b || !b.boss || !msg) return false;
    var band = [b.boss.kind].concat(b.crew || []);
    msg.party = msg.party || {};
    msg.party.band = band.slice(); msg.party.count = band.length; msg.party.rolled = true; msg.party.boss = true;
    msg.party.faction = msg.party.faction || 'brigands';
    msg.party.what = b.crew_word || b.n;   /* the meet card says who stands there */
    try { msg.party.word = partyWord(band.length); } catch (e) {}
    msg.roster = band.map(function (id) { return { arch: 'human' }; });
    msg.boss = { n: b.n, kind: b.boss.kind, name: b.boss.name || b.n, title: b.boss.title || null, hp_x: +b.boss.hp_x || 1, weapon: b.boss.weapon || null,
      shield: b.boss.shield || null, lesson: b.lesson || null, board: b.board || null, place: b.place && b.place.name, draft: true };
    root.__BOSS_DRESSED = { n: b.n, band: band.slice(), board: b.board, at: Date.now() };
    return true;
  }

  /* ---------- (4) his verb ---------- */
  function grant(r, at) {
    if (!r || !r.verb || !S || S.verbs[r.verb.id]) return;
    MAINS = null;
    S.verbs[r.verb.id] = { from: r.n, day: day(), x: at && at.x, y: at && at.y, last: null, uses: 0 };
    save();
    try { root.dispatchEvent(new CustomEvent('bohemia:verb', { detail: { id: r.verb.id, from: r.n } })); } catch (e) {}
  }
  function marked(k, x, y) { return !!S && S.marks.some(function (m) { return m.k === k && m.x === x && m.y === y; }); }
  function nearKind(x, y, kinds) {
    for (var a = -1; a <= 1; a++) for (var b = -1; b <= 1; b++) { var d = dist(x + a, y + b); if (d && kinds.indexOf(d) >= 0) return d; }
    return null;
  }
  /* his own place always works for his verb, right where he fell (WORLD TWO may stand him on a street when none of his kinds is in reach) */
  function hisPlace(id, x, y) { var r = verbRow(id), h = hs(); if (!r || !h) return false; var f = h.boss.found[r.n]; return !!(f && h.boss.fallen[r.n] && f.x === x && f.y === y); }
  function isMain(x, y) { var V = verbRow('open'); return !!V && walk(x, y) && !nearTown(x, y, 1) && (hisPlace('open', x, y) || !!nearKind(x, y, V.verb.main_districts || [])); }
  function mains() {   /* every main in the valley, counted once (the map does not move) */
    if (MAINS) return MAINS; var n = N(), V = verbRow('open'); if (!n || !V) return [];
    MAINS = []; for (var y = 1; y < n - 1; y++) for (var x = 1; x < n - 1; x++) if (isMain(x, y)) MAINS.push([x, y]);
    return MAINS;
  }
  function applies(id, x, y) {
    if (!S || !S.verbs[id]) return null;
    var r = verbRow(id); if (!r) return null; var V = r.verb;
    if (!walk(x, y)) return null;
    if (id === 'cook') {
      if (nearTown(x, y, 1)) return null;
      var last = S.verbs.cook.last; if (last != null && day() - last < (V.cooldown_days || 1)) return { id: id, off: true, why: 'cooling' };
      return { id: id };
    }
    if (id === 'open') return (!marked('open', x, y) && isMain(x, y)) ? { id: id } : null;
    if (id === 'purify') return (!marked('purify', x, y) && (marked('open', x, y) || hisPlace('purify', x, y) || !!nearKind(x, y, V.water_districts || []))) ? { id: id } : null;
    return null;
  }
  /* the phone's band: the verb that works where he stands (the order the file says), a cooling one only when nothing else does */
  function verbHere() {
    if (!sync() || !DATA) return null;
    var h = here(); if (!h) return null;
    try { if (TRAVEL && TRAVEL.path && TRAVEL.i < TRAVEL.path.length) return null; } catch (e) {}
    var order = DATA.verbs_order || ['open', 'purify', 'cook'], off = null;
    for (var i = 0; i < order.length; i++) {
      var a = applies(order[i], h[0], h[1]); if (!a) continue;
      var V = verbRow(order[i]).verb;
      var out = { id: a.id, word: V.word, button: a.off ? 'THE POT IS COOLING' : V.button, off: !!a.off, from: verbRow(order[i]).n, draft: true };
      if (!a.off) return out; if (!off) off = out;
    }
    return off;
  }
  function condHeal(hours) {   /* COOK: blood only (the hours' healing at the map's own rate), never the armour, never the clock */
    var C = root.BohemiaCondition; if (!C || !C.get || !C.KEY) return null;
    var s = C.get(), R = C.rates ? C.rates() : { hp: 1 }, healed = 0, men = 0;
    for (var k in s.men) { var m = s.men[k]; if (!(m.lostHp > 0)) continue; var g = Math.min(m.lostHp, (R.hp || 1) * hours); m.lostHp -= g; if (m.lostHp < 1e-6) m.lostHp = 0; healed += g; men++; }
    try { root.localStorage.setItem(C.KEY, JSON.stringify(s)); } catch (e) {}
    try { root.dispatchEvent(new CustomEvent('bohemia:condition', { detail: { cooked: healed } })); } catch (e) {}
    return { healed: Math.round(healed), men: men };
  }
  function condWounds(days) {   /* PURIFY: every fresh wound closes this many days sooner */
    var C = root.BohemiaCondition; if (!C || !C.get || !C.KEY) return null;
    var s = C.get(), men = 0, closed = 0;
    for (var k in s.men) { var m = s.men[k]; if (!m.wound || !(m.wound.left > 0)) continue; m.wound.left = Math.max(0, m.wound.left - days); men++; if (m.wound.left < 1e-6) { m.wound = null; closed++; } }
    try { root.localStorage.setItem(C.KEY, JSON.stringify(s)); } catch (e) {}
    try { root.dispatchEvent(new CustomEvent('bohemia:condition', { detail: { purified: men } })); } catch (e) {}
    return { men: men, closed: closed };
  }
  function use(id) {
    if (!sync()) return false;
    var h = here(); if (!h) return false;
    var a = applies(id, h[0], h[1]); if (!a || a.off) return false;
    var r = verbRow(id), V = r.verb, w = whereWord(h[0], h[1]), got = null;
    if (id === 'cook') { got = condHeal(V.heal_hours || 8); S.verbs.cook.last = day(); }
    if (id === 'open') { got = { paid: V.pay_batteries | 0 }; try { if (got.paid > 0) BohemiaPurse.credit(purseGet(), 'electricity', got.paid, 'the main on ' + w, 'boss-verb:open:' + h[0] + ',' + h[1], day()); } catch (e) { got.paid = 0; } }
    if (id === 'purify') got = condWounds(V.wound_days || 2);
    S.marks.push({ k: id, x: h[0], y: h[1], day: day() });
    S.verbs[id].uses = (S.verbs[id].uses | 0) + 1;
    save();
    var said = V.says + (id === 'cook' && got ? (got.men ? ' ' + got.healed + ' blood back across ' + got.men + (got.men === 1 ? ' man.' : ' men.') : ' Nobody was hurt; they eat anyway.')
      : id === 'open' && got ? (got.paid ? ' +' + got.paid + ' batteries.' : '') : id === 'purify' && got ? (got.men ? ' ' + got.men + (got.men === 1 ? ' wound' : ' wounds') + ' closing sooner.' : ' Nobody is wounded right now.') : '');
    feed('@yourcompany', said, 'mine');   /* draft:true: the company's own post, on the phone */
    if (V.feed) feed(V.feed.who, String(V.feed.txt).replace(/\{where\}/g, w), 'world');
    LAST.used.push({ id: id, x: h[0], y: h[1], got: got, t: Date.now() });
    root.__BOSS_VERB_USED = LAST.used.slice(-6);
    try { root.dispatchEvent(new CustomEvent('bohemia:verb-used', { detail: { id: id, at: h, got: got } })); } catch (e) {}
    try { if (typeof saveNow === 'function') saveNow('verb:' + id); } catch (e) {}
    try { if (typeof render === 'function') render(); } catch (e) {}
    return got || true;
  }

  /* ---------- (1) drawing: his place, what changed, the blocks you used a verb on ---------- */
  var PAL = { o: '#0e0b08', k: '#2b251d', K: '#3d352a', g: '#77706a', w: '#e5d9bd', y: '#f2c56a', Y: '#a8762e', r: '#c8382a', R: '#7a1d14',
    c: '#b8733c', C: '#6e3f1e', b: '#5f8fb0', B: '#2e4c63', p: '#bfeae2', m: '#6f7a3c', M: '#3e4524', s: '#4a4540', f: '#ff9a3c' };
  var ART = {
    kitchen: ['......ooo....', '......oko....', '......oko....', '..ooooooooo..', '..oCcccccCo..', '.oCccccccccCo', '.oCccYcccccCo', '..oCcccccCo..', '...ooooooo...',
      'ooooooooooooo', 'okkkkkkkkkkko', 'okKyyKkKyyKko', 'okkkkkkkkkkko', 'okkkkoookkkko', 'okkkkoYokkkko', 'ooooooooooooo'],
    tower: ['...ooooooo...', '..oBBBBBBBo..', '.oBBbBBBBBBo.', '.oBBBBBBBBBo.', '.oBBBBBBBBBo.', '..oBBBBBBBo..', '...ooooooo...', '...o.o.o.o...', '...o..o..o...',
      '..o..o.o..o..', '..o.o...o.o..', '.o..o...o..o.', 'ooooooooooooo', 'okkkkkkkkkkko', 'okrrrkkkkkkko', 'okrkrkkkKkkko', 'okrrrkkkkkkko', 'ooooooooooooo'],
    tanks: ['............ooo', '............oko', '............oko', '.ooooo......oko', 'oMmmmMo.ooooooo', 'oMmmmmMoMmmmMko', 'oMmmmmMoMmmmMko', 'oMmmmmMoMmmmMko', '.oMmMo..oMmMoko',
      '.ooooo..ooooooo'],
    fire: ['...f...', '..fyf..', '.fyyyf.', '.fyYyf.', 'oCoCoCo', '.ooooo.'],
    valve: ['..ooo..', '.oBbBo.', 'oBbbbBo', '.oBbBo.', '..oko..', 'okkkkko', 'ooooooo'],
    main: ['..ooo..', '.ogggo.', 'oggkggo', '.ogggo.', '..oko..', 'okkkkko', 'ooooooo'],
    clean: ['..ooo..', '.oppbo.', 'oppppbo', 'opppppo', 'oppppbo', '.oppbo.', '..ooo..'] };
  /* what falls with him: the same drawing, the colours of a place that works again */
  var SWAP = { kitchen_lit: { K: 'y', Y: 'f' }, tower_running: { B: 'b', r: 'R' }, tanks_clean: { M: 'B', m: 'p' } };
  function glyph(name, s, swap, dark) {
    var k = name + ':' + s + ':' + (swap || '') + ':' + (dark ? 1 : 0); if (GLY[k]) return GLY[k];
    var rows = ART[name] || ART.main, h = rows.length, w = 0, sw = (swap && SWAP[swap]) || {}; rows.forEach(function (r) { w = Math.max(w, r.length); });
    var c = document.createElement('canvas'); c.width = w * s; c.height = h * s; var x = c.getContext('2d');
    for (var j = 0; j < h; j++) for (var i = 0; i < rows[j].length; i++) { var ch = rows[j][i]; if (ch === '.') continue; ch = sw[ch] || ch;
      x.fillStyle = dark ? (ch === 'o' ? '#060504' : '#16120e') : (PAL[ch] || PAL.w); x.fillRect(i * s, j * s, s, s); }
    GLY[k] = c; return c;
  }
  function scale() { var W = 390; try { W = CVW; } catch (e) {} return W >= 900 ? 3 : 2; }
  function onGlass(p, m) { var W = 390, H = 736; try { W = CVW; H = CVH; } catch (e) {} m = m == null ? 40 : m; return p.sx > -m && p.sx < W + m && p.sy > -m && p.sy < H + m; }
  function ground(x, y, ox, oy) { var p = iso(x, y, ox, oy); return { sx: p.sx, sy: p.sy + TH * 0.5 }; }
  function smoke(gx, sx, sy, s, beat, col, n) {   /* a column of puffs that steps up on the beat (stop motion, never a smooth drift) */
    for (var i = 0; i < n; i++) { var t = (beat + i) % n, yy = sy - t * 5 * s, rr = (2 + t * 0.9) * s;
      gx.globalAlpha = Math.max(0, 0.75 - t / n * 0.7); gx.fillStyle = col; gx.fillRect(Math.round(sx - rr + (t % 2 ? s : -s)), Math.round(yy - rr), Math.round(rr * 2), Math.round(rr * 2)); }
    gx.globalAlpha = 1;
  }
  function plate(gx, t, sx, sy, col) {
    var f = 'monospace'; try { if (typeof FACE === 'function') f = FACE('casing'); } catch (e) {}
    gx.font = '700 ' + (scale() >= 3 ? 12 : 9) + 'px ' + f; var w = Math.ceil(gx.measureText(t).width) + 8, hh = scale() >= 3 ? 15 : 12;
    gx.fillStyle = 'rgba(10,8,6,0.82)'; gx.fillRect(Math.round(sx - w / 2), Math.round(sy), w, hh);
    gx.fillStyle = col; gx.textBaseline = 'top'; gx.fillText(t, Math.round(sx - w / 2 + 4), Math.round(sy + 2));
  }
  function draw(ox, oy) {
    if (!sync() || !DATA) { loadData(); return; }
    var gx = null; try { gx = g; } catch (e) { return; }
    var h = hs(); LAST.drew = { places: [], marks: 0, mains: 0 };
    if (bench()) return;
    try { rumours(); } catch (e) {}
    var beat = 0; try { beat = mapArtBeat(); } catch (e) {}
    var s = scale(), sL = s + 1;   /* his place one step bigger than a mark: it is read from afar */
    gx.save(); gx.imageSmoothingEnabled = false;
    try {
      /* the blocks his verbs were used on, and (once THE TAP is down) the mains still shut, where he has seen them */
      if (S.verbs.open) mains().forEach(function (m) { if (marked('open', m[0], m[1]) || !seen(m[0], m[1])) return; var p = ground(m[0], m[1], ox, oy); if (!onGlass(p)) return;
        var c = glyph('main', s); gx.globalAlpha = 0.85; gx.drawImage(c, Math.round(p.sx - c.width / 2), Math.round(p.sy - c.height)); gx.globalAlpha = 1; LAST.drew.mains++; });
      S.marks.forEach(function (m) { var p = ground(m.x, m.y, ox, oy); if (!onGlass(p)) return;
        var nm = m.k === 'cook' ? 'fire' : m.k === 'open' ? 'valve' : 'clean', c = glyph(nm, s), dx = m.k === 'purify' ? 5 * s : m.k === 'open' ? -5 * s : 0;
        gx.drawImage(c, Math.round(p.sx + dx - c.width / 2), Math.round(p.sy - c.height));
        if (m.k === 'cook') smoke(gx, p.sx + dx, p.sy - c.height, s / 2, beat, '#cfc6b4', 4);
        if (m.k === 'open' && beat % 2) { gx.fillStyle = PAL.p; gx.fillRect(Math.round(p.sx + dx - s), Math.round(p.sy - c.height - 2 * s), s, s); gx.fillRect(Math.round(p.sx + dx + s), Math.round(p.sy - c.height - 3 * s), s, s); }
        LAST.drew.marks++; });
      /* his place: a dark shape through the static before you know whose it is; named once his sign is read; changed when he falls */
      DATA.bosses.forEach(function (r) {
        var f = h.boss.found[r.n], sg = (h.boss.sign && h.boss.sign.n === r.n) ? h.boss.sign.boss : null, at = f || sg; if (!at) return;
        var bx = at.bx != null ? at.bx : at.x, by = at.by != null ? at.by : at.y, p = ground(bx, by, ox, oy); if (!onGlass(p, 80)) return;
        var down = !!h.boss.fallen[r.n], known = !!f, art = (r.place && r.place.art) || 'kitchen', c = glyph(art, sL, down ? r.fallen_art : null, !known && !seen(bx, by));
        var top = p.sy - c.height, cx = p.sx;
        if (art === 'kitchen') smoke(gx, cx + 1 * sL, top, sL, beat, down ? '#d9d0bd' : '#141110', 5);
        if (art === 'tanks') { gx.globalAlpha = (beat % 2) ? 0.35 : 0.2; gx.fillStyle = down ? PAL.p : '#9fbf3a'; gx.fillRect(Math.round(cx - c.width / 2 - 2 * sL), Math.round(top + 3 * sL), Math.round(c.width * 0.6), Math.round(c.height * 0.7)); gx.globalAlpha = 1; }
        gx.drawImage(c, Math.round(cx - c.width / 2), Math.round(top));
        if (art === 'tower' && down && beat % 2) { gx.fillStyle = PAL.p; for (var i = 0; i < 3; i++) gx.fillRect(Math.round(cx + (i - 1) * 3 * sL), Math.round(top + (7 + i * 2) * sL), sL, sL * 2); }
        if (art === 'tower' && !down) { gx.fillStyle = (beat % 2) ? PAL.r : PAL.R; gx.fillRect(Math.round(cx - 5 * sL), Math.round(top + 7 * sL), sL, sL); }   /* his lamp on the stilts */
        var placed = down && (h.places || []).some(function (P) { return P.n === r.n; });   /* WORLD TWO's place plate names it once he is down */
        if (known && !placed) plate(gx, (r.place && r.place.name) || r.n, cx, top - (scale() >= 3 ? 18 : 15), down ? '#bfeae2' : '#ffb27a');   /* over his place, clear of the boss's own plate at the door */
        LAST.drew.places.push({ n: r.n, art: art, x: Math.round(cx), y: Math.round(p.sy), w: c.width, h: c.height, known: known, down: down });
      });
    } catch (e) { LAST.err = String(e && e.message || e); }
    gx.restore();
  }

  if (typeof document === 'undefined' || !root.addEventListener) { root.BohemiaBosses = { node: true }; return; }
  root.addEventListener('bohemia:boss-fell', function (ev) {
    var d = ev && ev.detail; if (!d || !sync()) return; var r = row(d.n), h = hs(); if (!r) return;
    grant(r, h && h.boss.found[d.n]);
    try { if (typeof render === 'function') render(); } catch (e) {}
  });
  loadData();
  root.BohemiaBosses = {
    /* RUN's and WORLD TWO's hooks (__THE_BOSSES__) */
    draw: draw, dress: dress,
    /* the phone (UI's band, marked __THE_BOSS_VERB_ON_THE_PHONE__) */
    verbHere: verbHere, use: use, icon: function (id) { var nm = id === 'cook' ? 'fire' : id === 'open' ? 'valve' : 'clean'; try { return glyph(nm, 2).toDataURL(); } catch (e) { return ''; } },
    /* reading, for the gate */
    data: function () { return DATA; }, state: function () { sync(); return S; }, last: function () { return LAST; },
    mains: function () { return mains().slice(); }, applies: function (id, x, y) { sync(); return applies(id, x, y); }, isMain: isMain
  };
})(typeof window !== 'undefined' ? window : this);
