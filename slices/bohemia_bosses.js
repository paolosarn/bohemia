/* THE BOSSES (BOSSES lane, 11/2/26, rule 302; ask line 287. ROUND 2 the same round, rule 330; ask lines 328 and 329).
   PAOLO 11/2: 'Battle Brothers has unique locations and bosses with themes, I want that too... each time you kill a boss you get
   something that helps you interact with the city... that's why we made the city how we made it, in grids.'
   AND THEN, having reached them in play: 'each one has to have their own aesthetic, and maybe a quest or two that leads up to
   them... it has to make sense... I'm just confused by what is happening with the map... I can put the fire down, I can purify
   the water, I'm so confused by what that means.' And: 'there's a bunch of bright pixels on the part of the map where I killed
   the boss... I'm so confused, what's going on.'
   WHAT WAS WRONG (records/BOHEMIA_BOSSES_EACH_HIS_OWN_LOOK_A_LEAD_UP_A_VERB_THAT_MAKES_SENSE_11_2_26.md): his place was pixel
   rows on the map's canvas and the lights his fall brought back were yellow dots over every building for three blocks (the
   bright pixels); the man wore his kind's pool look; the lead-up was one sign and one feed post; the verb landed on a phone
   button with nobody saying what it was.
   THIS FILE, read from records/target/bb/boss_act_one.json (a modder's file, a row per boss, matched by name to WORLD TWO's
   boss_map.json, which still owns the sign, where he stands and what falls with him):
     (1) HIS PLACE, PAINTED: the map's own look (the district factory's parts through the master rig, the way COOK paints the
         valley: tools/bohemia_bosses_paint_their_places_11_2_26.py -> slices/boss_places/), on his own block, scaled with the
         ground like a district picture and never under a size he reads from afar; a dark shape through the static before he
         is known; BEFORE and AFTER, two beat frames each (THE KITCHEN's black smoke and dark windows, then the fire out, the
         windows lit and steam off the pot; THE PUMP HOUSE dry with a red lamp blinking, then water pouring; THE SETTLING TANKS
         green sludge, then clean blue). WORLD TWO's lights-back-on dots stand down where a painted place shows the change.
     (2) THE LEAD-UP, people, places and things (the quest law; CONTENT's mouth card, slices/bohemia_road_events.js): someone who
         lost something to him stops you on the road and asks for help (never in the first minute); his sign is the thing, and
         one of your own men reads it out (where he is and what he does to the valley); then his place is marked (WORLD TWO).
         His rumour still goes on the phone's feed.
     (3) HIS FIGHT: the man himself in HIS OWN LOOK (the people's rig, tools/bohemia_bosses_the_three_men.py: boss.look), his name,
         his gear, more blood, his crew, his board, one lesson; his face and title on his meet card (onCard).
     (4) HIS VERB, MADE PLAIN: the moment he falls, the person who asked comes back and says in plain words and numbers what you
         can now do; the phone's button is one plain line (COOK: HEAL YOUR MEN, TURN THE WATER ON, CLEAN THE WATER) and a held
         finger on it says the same; the first use puts what it did on the map over the block and on the feed in plain words.
         COOK (anywhere off a town, once a day: the crew heals like a night's sleep), OPEN (a street beside the water works: the
         main runs for good, +6 batteries), PURIFY (beside water or a main you opened: every fresh wound closes two days sooner).
   Every word is draft:true (the file's own flag); every number is a shape TUNING owns. Gate: gates/bosses_act_one_gate.js. */
(function (root) {
  'use strict';
  var KEY = 'bohemia.bosses.v1', DATA_URL = '../records/target/bb/boss_act_one.json', PICS_URL = 'boss_places/boss_places.json';
  var DATA = null, S = null, MAINS = null, PICS = null, IMG = {}, DARK = {}, LAST = { drew: {}, used: [], cards: [] }, T0 = Date.now();

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
  function fill(t, o) { return String(t || '').replace(/\{(\w+)\}/g, function (m, k) { return o && o[k] != null ? o[k] : m; }); }

  /* ---------- the data, the pictures and the state (kept with WORLD TWO's game: a new company is a new state) ---------- */
  function loadData() {
    if (!DATA && !loadData.busy) { loadData.busy = true;
      try { fetch(DATA_URL, { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) { DATA = (j && j.bosses) ? j : null; }).catch(function () { loadData.busy = false; }); } catch (e) { loadData.busy = false; } }
    if (!PICS && !loadData.pics) { loadData.pics = true;
      try { fetch(PICS_URL).then(function (r) { return r.json(); }).then(function (j) { if (!j || !j.pictures) return; PICS = j.pictures;
        Object.keys(PICS).forEach(function (k) { PICS[k].frames.forEach(function (f) { var im = new Image(); im.src = 'boss_places/' + f; IMG[f] = im; }); }); }).catch(function () { loadData.pics = false; }); } catch (e) { loadData.pics = false; } }
  }
  function row(n) { if (!DATA) return null; for (var i = 0; i < DATA.bosses.length; i++) if (DATA.bosses[i].n === n) return DATA.bosses[i]; return null; }
  function verbRow(id) { if (!DATA) return null; for (var i = 0; i < DATA.bosses.length; i++) if (DATA.bosses[i].verb && DATA.bosses[i].verb.id === id) return DATA.bosses[i]; return null; }
  function fresh(seed) { return { v: 1, seed: seed, verbs: {}, marks: [], rumours: {}, lead: {} }; }
  function save() { try { root.localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function sync() {
    var h = hs(); if (!h) return false;
    if (!S) { try { S = JSON.parse(root.localStorage.getItem(KEY) || 'null'); } catch (e) { S = null; } }
    if (!S || S.v !== 1 || S.seed !== h.seed) { S = fresh(h.seed); save(); }
    if (!S.lead) S.lead = {};
    if (DATA) DATA.bosses.forEach(function (r) { if (r.verb && h.boss.fallen[r.n] && !S.verbs[r.verb.id]) grant(r, h.boss.fallen[r.n]); });   /* a save from before this file */
    return true;
  }
  function lead(n) { if (!S.lead[n]) S.lead[n] = {}; return S.lead[n]; }

  /* ---------- the mouths (CONTENT's card: a portrait that talks, two or three plain choices) ---------- */
  function card() { return root.BohemiaRoadEvents && root.BohemiaRoadEvents.card ? root.BohemiaRoadEvents : null; }
  function inTown() { try { var sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; } catch (e) { return false; } }
  function fightUp() {
    try { if (LOOP && LOOP.fighting) return true; } catch (e) {}
    try { var P = root.parent; if (P && P !== root) { if (P.SPOILS && P.SPOILS.frame) return true; var ff = P.document.getElementById('fightFrame'); if (ff && ff.style.display !== 'none') return true; } } catch (e) {}
    try { var hh = hs(); if (hh && hh.fighting) return true; } catch (e) {}
    return false;
  }
  function canTalk() {
    var RE = card(); if (!RE || bench()) return false;
    try { if (RE.up && RE.up()) return false; } catch (e) {}
    try { if (MEET && MEET.up) return false; } catch (e) {}
    if (inTown() || fightUp()) return false;
    /* a scripted browser meets these only when it asks (CONTENT's rule for the road): other lanes' map walks are not stopped by a
       card they cannot answer; this lane's gate asks (window.__BOSSES_TALK) */
    try { if (root.navigator && root.navigator.webdriver && !root.__BOSSES_TALK) return false; } catch (e) {}
    return true;
  }
  function mate() {   /* one of his own men reads the thing out (never YOU: the player does not speak for the valley) */
    var co = null; try { co = { men: (CREW_DEFS && CREW_DEFS.men) || [], looks: (CREW_DEFS && CREW_DEFS.looks) || [] }; } catch (e) {}
    try { var w = crewWhoWalks(); if (w && w.name) return { name: String(w.name).toUpperCase(), look: w.look || (co && co.looks[1]) || 'cast_longcoat' }; } catch (e) {}
    if (co && co.men[1]) return { name: String(co.men[1].name || 'ONE OF YOURS').toUpperCase(), look: co.looks[1] || 'cast_longcoat' };
    return { name: 'ONE OF YOURS', look: 'cast_longcoat' };
  }
  function talk(kind, n, o) {
    var RE = card(); if (!RE) return false;
    RE.card(o);
    var c = { kind: kind, n: n, name: o.name, look: o.look, head: o.head || null, text: o.text, opts: (o.opts || []).map(function (x) { return x.t; }), at: Date.now(), draft: true };
    root.__BOSS_CARD = c; LAST.cards.push(c); if (LAST.cards.length > 24) LAST.cards.shift();
    return true;
  }
  function closeCard(resume) { try { card().close(resume); } catch (e) {} }
  function walkTo(c) { try { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); } catch (e) {} try { if (travelTo(0, 0, c)) travelGoes(); } catch (e) {} }

  /* (2) the one who lost something to him asks for help, while his sign is in the world and unread (never in the first minute) */
  function asker(r, s) {
    var A = r.lead && r.lead.asker; if (!A) return false;
    var L = lead(r.n); L.asked = day() + 1; save();
    return talk('asker', r.n, { look: A.look, name: A.name, from: A.from, head: 'SOMEONE NEEDS HELP', text: A.says, opts: [
      { t: A.yes, tag: 'TO THE ' + String((r.lead.thing && r.lead.thing.head) || 'SIGN').replace(/^THE /, ''), fn: function () { L.yes = true; save();
        talk('asker_yes', r.n, { look: A.look, name: A.name, from: A.from, head: 'SOMEONE NEEDS HELP', text: A.yes_says, opts: [{ t: 'GO', fn: function () { closeCard(false); walkTo([s.x, s.y]); } }] }); } },
      { t: A.no, fn: function () { L.yes = false; save();
        talk('asker_no', r.n, { look: A.look, name: A.name, from: A.from, head: 'SOMEONE NEEDS HELP', text: A.no_says, opts: [{ t: 'GO ON', fn: function () { closeCard(); } }] }); } }] });
  }
  /* the thing at his sign, read out by one of yours: where he is and what he does to the valley; his place is on the map now */
  function thing(r) {
    var T = r.lead && r.lead.thing; if (!T) return false;
    var L = lead(r.n), m = mate(), h = hs(), f = h && h.boss.found[r.n];
    L.read = day() + 1; L.thingDue = false; save();
    return talk('thing', r.n, { look: m.look, name: m.name, from: 'one of yours, at ' + T.what, head: T.head, text: T.says, opts: [
      { t: 'GO TO HIS PLACE', tag: String((r.place && r.place.name) || r.n), fn: function () { closeCard(false); if (f) walkTo([f.x, f.y]); } },
      { t: 'LATER', fn: function () { closeCard(); } }] });
  }
  /* (4) he fell: the one who asked tells you what his verb does, plain, with the numbers */
  function after(r) {
    var A = r.after; if (!A) return false;
    var L = lead(r.n); L.told = day() + 1; L.afterDue = false; save();
    return talk('after', r.n, { look: A.look, name: A.name, from: A.from, head: r.n + ' IS DOWN', text: A.says, opts: [{ t: A.ok || 'GOT IT', tag: r.verb ? r.verb.button : '', fn: function () { closeCard(); } }] });
  }
  function talkTick() {
    if (!DATA || !sync() || !canTalk()) return;
    var h = hs(); if (!h) return;
    for (var i = 0; i < DATA.bosses.length; i++) {
      var r = DATA.bosses[i], L = lead(r.n);
      if (L.afterDue && h.boss.fallen[r.n]) { after(r); return; }
      if (L.thingDue && h.boss.found[r.n] && !h.boss.fallen[r.n]) { thing(r); return; }
      var s = h.boss.sign;
      if (s && s.n === r.n && !L.asked && !h.boss.found[r.n] && Date.now() - T0 > 60000) { asker(r, s); return; }
    }
  }

  /* ---------- the rumour, the moment his sign is in the world ---------- */
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
      shield: b.boss.shield || null, look: b.boss.look || null, lesson: b.lesson || null, board: b.board || null, place: b.place && b.place.name, draft: true };
    root.__BOSS_DRESSED = { n: b.n, band: band.slice(), board: b.board, look: b.boss.look || null, at: Date.now() };
    return true;
  }
  /* his card (RUN's meet card, __THE_BOSSES__ hook): his face, talking, his title and the one thing to know, over the card's men */
  function onCard(el, msg) {
    var B = msg && msg.boss; if (!B || !el) return false;
    var b = row(B.n); if (!b) return false;
    var at = el.querySelector('.mcs'); if (!at) return false;
    var d = document.createElement('div'); d.className = 'mcboss'; d.setAttribute('data-boss', B.n); d.setAttribute('data-look', B.look || ''); d.setAttribute('data-draft', 'true');
    /* compact (measured 11/2 on the phone: a 64 px face and the whole lesson made the card 72 px taller and pushed ENGAGE under the
       phone): a 40 px face, his title and the one short tip (the file's 'tip'), the whole lesson stays the fight's to teach */
    d.style.cssText = 'display:flex;gap:8px;align-items:center;margin-top:6px';
    d.innerHTML = '<canvas width="128" height="128" style="width:40px;height:40px;flex:none;image-rendering:pixelated;background:#14100b;border:1px solid #4a3a26"></canvas>'
      + '<div style="min-width:0;font:400 10px BohemiaCasing,ui-monospace,monospace;letter-spacing:.6px;line-height:1.25;color:#cdb98e;text-shadow:0 1px 0 #000">'
      + '<div style="color:#f2e4c6">' + String(B.title || '').toUpperCase().replace(/[<>&]/g, '') + '</div>'
      + '<div style="margin-top:2px;color:#e2b45a">' + String(b.tip || b.lesson || '').replace(/[<>&]/g, '') + '</div></div>';
    at.parentNode.insertBefore(d, at.nextSibling);
    /* the card stands centred: what this block adds would push ENGAGE down under the phone, so the card lifts by exactly that much
       and its buttons stay where every other meet card has them */
    try { var mc = el.querySelector('.mc'); if (mc) mc.style.marginBottom = (2 * (d.offsetHeight + 6)) + 'px'; } catch (e) {}
    var cv = d.querySelector('canvas'), line = String((b.boss && b.boss.says) || b.rumour && b.rumour.txt || B.name);
    var face = function () { try { var F = root.BohemiaCrewFaces; if (!F || !B.look || !F.has(B.look)) return; if (!F.talk(cv, B.look, line)) F.draw(cv.getContext('2d'), B.look, 128); LAST.cardFace = B.look; } catch (e) {} };
    if (root.BohemiaCrewFaces) root.BohemiaCrewFaces.ready(face);
    else { try { var sc = document.createElement('script'); sc.src = '../engine/bohemia_crew_faces.js'; sc.onload = function () { try { root.BohemiaCrewFaces.ready(face); } catch (e) { face(); } }; document.head.appendChild(sc); } catch (e) {} }
    LAST.card = { n: B.n, look: B.look, title: B.title, at: Date.now() };
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
  /* the phone's band: the verb that works where he stands (the order the file says), a cooling one only when nothing else does;
     its button is one plain line and its tip what a held finger says */
  function verbHere() {
    if (!sync() || !DATA) return null;
    var h = here(); if (!h) return null;
    try { if (TRAVEL && TRAVEL.path && TRAVEL.i < TRAVEL.path.length) return null; } catch (e) {}
    var order = DATA.verbs_order || ['open', 'purify', 'cook'], off = null;
    for (var i = 0; i < order.length; i++) {
      var a = applies(order[i], h[0], h[1]); if (!a) continue;
      var V = verbRow(order[i]).verb;
      var out = { id: a.id, word: V.word, button: a.off ? (V.cooling || 'THE POT IS COOLING') : V.button, tip: a.off ? (V.tip_cooling || V.tip) : V.tip, off: !!a.off, from: verbRow(order[i]).n, draft: true };
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
    var r = verbRow(id), V = r.verb, w = whereWord(h[0], h[1]), got = null, first = !(S.verbs[id].uses | 0);
    if (id === 'cook') { got = condHeal(V.heal_hours || 8); S.verbs.cook.last = day(); }
    if (id === 'open') { got = { paid: V.pay_batteries | 0 }; try { if (got.paid > 0) BohemiaPurse.credit(purseGet(), 'electricity', got.paid, 'the main on ' + w, 'boss-verb:open:' + h[0] + ',' + h[1], day()); } catch (e) { got.paid = 0; } }
    if (id === 'purify') got = condWounds(V.wound_days || 2);
    var nums = { where: w, healed: (got && got.healed) | 0, men: (got && got.men) | 0, paid: (got && got.paid) | 0 };
    nums.wounds = nums.men + (nums.men === 1 ? ' wound' : ' wounds'); nums.WOUNDS = nums.wounds.toUpperCase();   /* '1 wound', never '1 wounds' */
    var none = (id === 'cook' && !nums.healed) || (id === 'purify' && !nums.men), F = V.first || {};   /* nothing to heal: say so plainly, never '0 blood back' */
    S.marks.push({ k: id, x: h[0], y: h[1], day: day(), first: first ? fill((none && F.plate_none) || F.plate, nums) : null, t: Date.now() });
    S.verbs[id].uses = (S.verbs[id].uses | 0) + 1;
    save();
    var said = first && (F.feed || F.feed_none) ? fill((none && F.feed_none) || F.feed, nums)
      : V.says + (id === 'cook' && got ? (got.men ? ' ' + got.healed + ' blood back across ' + got.men + (got.men === 1 ? ' man.' : ' men.') : ' Nobody was hurt; they eat anyway.')
      : id === 'open' && got ? (got.paid ? ' +' + got.paid + ' batteries.' : '') : id === 'purify' && got ? (got.men ? ' ' + got.men + (got.men === 1 ? ' wound' : ' wounds') + ' closing sooner.' : ' Nobody is wounded right now.') : '');
    feed('@yourcompany', said, 'mine');   /* draft:true: the company's own post, on the phone */
    if (V.feed) feed(V.feed.who, fill(V.feed.txt, nums), 'world');
    LAST.used.push({ id: id, x: h[0], y: h[1], got: got, first: first, said: said, t: Date.now() });
    root.__BOSS_VERB_USED = LAST.used.slice(-6);
    try { root.dispatchEvent(new CustomEvent('bohemia:verb-used', { detail: { id: id, at: h, got: got, first: first } })); } catch (e) {}
    try { if (typeof saveNow === 'function') saveNow('verb:' + id); } catch (e) {}
    try { if (typeof render === 'function') render(); } catch (e) {}
    return got || true;
  }

  /* ---------- (1) drawing: his place painted, what changed, the blocks you used a verb on ---------- */
  function ppc() { try { var r = cv.getBoundingClientRect(); return r.width ? CVW / r.width : 1; } catch (e) { return 1; } }   /* canvas px a CSS px */
  function pic(key, beat) { var P = PICS && PICS[key]; if (!P) return null; var im = IMG[P.frames[beat % P.frames.length]]; return im && im.complete && im.naturalWidth ? { P: P, im: im } : null; }
  function dark(im) {   /* before he is known, a dark shape through the static: the same picture, near black (seen from the road) */
    var k = im.src; if (DARK[k]) return DARK[k];
    var c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; var x = c.getContext('2d');
    x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-atop'; x.fillStyle = 'rgba(12,10,8,0.86)'; x.fillRect(0, 0, c.width, c.height);
    DARK[k] = c; return c;
  }
  function paint(gx, key, x, y, ox, oy, beat, wide, minCss, dk) {
    var q = pic(key, beat); if (!q) return null;
    var p = iso(x, y, ox, oy), P = q.P, w = Math.max(TW * wide, minCss * ppc()), sc = w / P.plate;
    var dx = Math.round(p.sx - P.bx * sc), dy = Math.round(p.sy + TH / 2 - P.by * sc), ww = Math.round(P.w * sc), hh = Math.round(P.h * sc);
    var W = 390, H = 736; try { W = CVW; H = CVH; } catch (e) {}
    if (dx > W || dy > H || dx + ww < 0 || dy + hh < 0) return null;
    gx.imageSmoothingEnabled = sc < 1; gx.drawImage(dk ? dark(q.im) : q.im, dx, dy, ww, hh); gx.imageSmoothingEnabled = false;
    return { x: dx, y: dy, w: ww, h: hh, top: dy + Math.round((P.by - P.plate * 0.55) * sc) };
  }
  function plate(gx, t, sx, sy, col) {
    var f = 'monospace'; try { if (typeof FACE === 'function') f = FACE('casing'); } catch (e) {}
    var k = ppc(), px = Math.round(10 * k); gx.font = '700 ' + px + 'px ' + f; var w = Math.ceil(gx.measureText(t).width) + Math.round(8 * k), hh = Math.round(14 * k);
    gx.fillStyle = 'rgba(10,8,6,0.82)'; gx.fillRect(Math.round(sx - w / 2), Math.round(sy), w, hh);
    gx.fillStyle = col; gx.textBaseline = 'top'; gx.fillText(t, Math.round(sx - w / 2 + 4 * k), Math.round(sy + 2 * k));
  }
  var PROP = { cook: 'fire', open: 'main_after', purify: 'clean' };
  function draw(ox, oy) {
    if (!sync() || !DATA) { loadData(); return; }
    if (!PICS) loadData();
    var gx = null; try { gx = g; } catch (e) { return; }
    var h = hs(); LAST.drew = { places: [], marks: 0, mains: 0, painted: 0, pixelRows: 0 };
    if (bench()) return;
    try { rumours(); } catch (e) {}
    var beat = 0; try { beat = mapArtBeat(); } catch (e) {}
    gx.save();
    try {
      /* once THE TAP is down: the shut mains he has seen, near him only (the six nearest within twelve blocks), never the whole valley */
      if (S.verbs.open) { var me = here() || [0, 0];
        mains().filter(function (m) { return !marked('open', m[0], m[1]) && seen(m[0], m[1]) && cheb(m[0], m[1], me[0], me[1]) <= 12; })
          .sort(function (a, b) { return cheb(a[0], a[1], me[0], me[1]) - cheb(b[0], b[1], me[0], me[1]); }).slice(0, 6)
          .forEach(function (m) { if (paint(gx, 'main_before', m[0], m[1], ox, oy, 0, 0.32, 18)) LAST.drew.mains++; }); }
      S.marks.forEach(function (m) {
        var b = paint(gx, PROP[m.k] || 'clean', m.x, m.y, ox, oy, beat, 0.36, 22); if (!b) return; LAST.drew.marks++; LAST.drew.painted++;
        if (m.first && Date.now() - (m.t || 0) < 9000) plate(gx, m.first, b.x + b.w / 2, b.y - 16 * ppc(), '#f6cf74');   /* the first time: what it did, over the block */
      });
      DATA.bosses.forEach(function (r) {
        var f = h.boss.found[r.n], sg = (h.boss.sign && h.boss.sign.n === r.n) ? h.boss.sign.boss : null, at = f || sg; if (!at) return;
        var bx = at.bx != null ? at.bx : at.x, by = at.by != null ? at.by : at.y;
        var down = !!h.boss.fallen[r.n], known = !!f, key = ((r.place && r.place.paint) || 'kitchen') + (down ? '_after' : '_before');
        var b = paint(gx, key, bx, by, ox, oy, beat, 1.3, 64, !known && !seen(bx, by)); if (!b) return;
        LAST.drew.painted++;
        var placed = down && (h.places || []).some(function (P) { return P.n === r.n; });   /* WORLD TWO's place plate names it once he is down */
        if (known && !placed) plate(gx, (r.place && r.place.name) || r.n, b.x + b.w / 2, b.y + 2, down ? '#bfeae2' : '#ffb27a');
        LAST.drew.places.push({ n: r.n, key: key, painted: true, x: b.x, y: b.y, w: b.w, h: b.h, known: known, down: down });
      });
    } catch (e) { LAST.err = String(e && e.message || e); }
    gx.restore();
    try { talkTick(); } catch (e) { LAST.err = String(e && e.message || e); }
  }
  /* WORLD TWO's lights-back-on stand down where a painted place shows the change (his_map drawLit asks) */
  function paints(n) { var r = row(n); return !!(r && r.place && r.place.paint && PICS && PICS[r.place.paint + '_after']); }
  /* the phone's icon for a verb: the small thing it leaves, painted */
  function icon(id) { var q = pic(PROP[id] || 'clean', 0); if (!q) return ''; try { var c = document.createElement('canvas'), P = q.P; c.width = 28; c.height = 28; var x = c.getContext('2d'), s = Math.min(28 / P.w, 28 / P.h);
    x.drawImage(q.im, Math.round((28 - P.w * s) / 2), Math.round((28 - P.h * s) / 2), Math.round(P.w * s), Math.round(P.h * s)); return c.toDataURL(); } catch (e) { return ''; } }

  if (typeof document === 'undefined' || !root.addEventListener) { root.BohemiaBosses = { node: true }; return; }
  root.addEventListener('bohemia:boss-found', function (ev) {
    var d = ev && ev.detail; if (!d || !sync()) return; var r = row(d.n); if (!r) return;
    var L = lead(r.n); if (!L.asked) L.asked = 'read first'; L.thingDue = true; save();
    setTimeout(function () { try { talkTick(); } catch (e) {} }, 400);
  });
  root.addEventListener('bohemia:boss-fell', function (ev) {
    var d = ev && ev.detail; if (!d || !sync()) return; var r = row(d.n), h = hs(); if (!r) return;
    grant(r, h && h.boss.found[d.n]);
    var L = lead(r.n); L.afterDue = true; save();
    try { if (typeof render === 'function') render(); } catch (e) {}
  });
  setInterval(function () { try { talkTick(); } catch (e) {} }, 900);
  loadData();
  root.BohemiaBosses = {
    /* RUN's and WORLD TWO's hooks (__THE_BOSSES__) */
    draw: draw, dress: dress, onCard: onCard, paints: paints,
    /* the phone (UI's band, marked __THE_BOSS_VERB_ON_THE_PHONE__) */
    verbHere: verbHere, use: use, icon: icon,
    /* reading, for the gate */
    data: function () { return DATA; }, pictures: function () { return PICS; }, state: function () { sync(); return S; }, last: function () { return LAST; },
    mains: function () { return mains().slice(); }, applies: function (id, x, y) { sync(); return applies(id, x, y); }, isMain: isMain, talkTick: talkTick
  };
})(typeof window !== 'undefined' ? window : this);
