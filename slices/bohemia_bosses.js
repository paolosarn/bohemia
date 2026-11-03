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
   Every word is draft:true (the file's own flag); every number is a shape TUNING owns. Gate: gates/bosses_act_one_gate.js.
   BOSSES FIX 11/3 (rule 338, ask line 346; PAOLO 11/3: 'we still don't know what killing them does, like wtf, and the map effects
   where their shit is... I don't like the map icons after I kill a boss too, like wtf'). MEASURED (a stranger's run, a picture a
   second, records/BOHEMIA_BOSSES_WHAT_A_KILL_DOES_11_3_26.md): the map came back dark and her six-line card covered his place within
   a second, so the change was never seen; after the card his place wore a cracked skull, a door, two plates and a 9-second plate,
   and his own men stood on top of the changed picture; the phone showed a grey THE POT IS COOLING at THE FILTER's water.
     (5) THE MOMENT HE FALLS (beat*): the camera goes to his place, the BEFORE stands a beat, then the AFTER rolls down over it like
         a tape tracking in, over the men (this lane's own glass over the map, the men are drawn after this file's call); then the
         one who asked says ONE line for the valley (after.valley) and holds out the thing he hands you (verb.hand: his pot, his
         wrench, his filter, through DIRECTION's rig) with one plain line, numbers in it; TAKE IT flies the thing into the phone's
         verb button.
     (6) THE MAP AFTER: the changed place is the mark. WORLD TWO's skull, door and plate stand down for a painted place (his_map,
         marked), the place is painted beside the street he fought on (never under his men), its name quiet under it when close.
     (7) USING IT: the button lights only where it works (no grey cooling button); every use plays the change where he stands
         (the fire lit, the main running, the drum filled) and the number rises off his men (verb.first.rise), and it is on the feed. */
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
    var V = r.verb || {}, Hd = V.hand || null, src = null;
    var ok = talk('after', r.n, { look: A.look, name: A.name, from: A.from, head: r.n + ' IS DOWN', text: A.valley || A.says, opts: [{ t: (Hd && A.take) || A.ok || 'GOT IT', tag: V.button || '',
      fn: function () { src = handBox(); HUSH = Date.now() + HUSH_MS; closeCard(); if (Hd) fly(r, src); else camBack(); } }] });   /* the hush before the close (the close redraws, and a redraw asks) */
    if (ok && Hd) handOnCard(r, Hd);
    return ok;
  }
  /* (5) the thing he hands you, on her card: his pot, his wrench, his filter, and its one plain line (what, where, how often, the number) */
  function handOnCard(r, Hd) {
    try {
      var el = document.getElementById('roadcard'), tx = el && el.querySelector('.rctext'); if (!tx) return;
      var d = document.createElement('div'); d.className = 'rchand'; d.setAttribute('data-draft', 'true');
      d.style.cssText = 'display:flex;gap:10px;align-items:center;margin-top:8px;padding:6px 8px;background:rgba(10,8,6,.55);box-shadow:inset 0 0 0 1px #4a3a26';
      d.innerHTML = '<img alt="" src="boss_places/' + String(Hd.pic).replace(/[^\w.]/g, '') + '" style="width:56px;height:56px;flex:none">'
        + '<div style="min-width:0"><div style="font:400 11px BohemiaCasing,ui-monospace,monospace;letter-spacing:1px;color:#e2b45a">' + String(Hd.name).replace(/[<>&]/g, '') + ' IS YOURS</div>'
        + '<div style="margin-top:3px;font:400 11px BohemiaROM,ui-monospace,monospace;line-height:1.35;color:#ecdfc2">' + String(Hd.line).replace(/[<>&]/g, '') + '</div></div>';
      tx.parentNode.insertBefore(d, tx.nextSibling);
      if (root.__BOSS_CARD) root.__BOSS_CARD.hand = { name: Hd.name, line: Hd.line, pic: Hd.pic };
    } catch (e) { LAST.err = String(e && e.message || e); }
  }
  function handBox() { try { var im = document.querySelector('#roadcard .rchand img'); if (!im) return null; var b = im.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; } catch (e) { return null; } }
  /* TAKE IT: the thing flies off her card into the phone's verb button (the phone lives in the page round the map) */
  function fly(r, src) {
    var P = root.parent && root.parent !== root ? root.parent : root, pd = P.document, Hd = r.verb.hand, off = { x: 0, y: 0 };
    try { if (P !== root && root.frameElement) { var fb = root.frameElement.getBoundingClientRect(); off = { x: fb.left, y: fb.top }; } } catch (e) {}
    var W = P.innerWidth || 390, Hh = P.innerHeight || 844;
    var s = src ? { x: src.x + off.x, y: src.y + off.y, w: src.w } : { x: W / 2 - 28, y: Hh / 2 - 28, w: 56 };
    var vb = pd.querySelector('#bohphone .bpctx .vb'), band = pd.querySelector('#bohphone .bpctx'), tgt = null, kind = 'corner';
    try { var vr = vb && vb.getBoundingClientRect(); if (vr && vr.width > 4) { tgt = vr; kind = 'verb'; } else if (band) { var br = band.getBoundingClientRect(); if (br.width > 4) { tgt = br; kind = 'band'; } } } catch (e) {}
    var e = tgt ? { x: tgt.left + 4, y: tgt.top + (tgt.height - 22) / 2, w: 22 } : { x: W - 60, y: Hh - 80, w: 22 };
    LAST.flew = { n: r.n, kind: kind, from: [Math.round(s.x), Math.round(s.y)], to: [Math.round(e.x), Math.round(e.y)], at: Date.now(), landed: null };
    try {
      if (!pd.getElementById('bossflystyle')) { var st = pd.createElement('style'); st.id = 'bossflystyle';
        st.textContent = '@keyframes bohVerbLand{0%{box-shadow:inset 0 0 0 1px #f2c56a,0 0 0 0 rgba(242,197,106,.95)}100%{box-shadow:inset 0 0 0 1px #f2c56a,0 0 0 12px rgba(242,197,106,0)}}'
          + '#bohphone .bpctx .vb.landed{animation:bohVerbLand 500ms ease-out 3}'; (pd.head || pd.documentElement).appendChild(st); }
      var im = pd.createElement('img'); im.src = 'boss_places/' + String(Hd.pic).replace(/[^\w.]/g, ''); im.alt = ''; im.id = 'bossfly';
      im.style.cssText = 'position:fixed;left:0;top:0;width:' + s.w + 'px;height:' + s.w + 'px;z-index:9000;pointer-events:none;will-change:transform';
      pd.body.appendChild(im);
      var k = e.w / s.w, mx = (s.x + e.x) / 2, my = Math.min(s.y, e.y) - 90;
      var a = im.animate([{ transform: 'translate(' + s.x + 'px,' + s.y + 'px) scale(1)' }, { transform: 'translate(' + mx + 'px,' + my + 'px) scale(' + ((1 + k) / 2 + 0.15) + ') rotate(-12deg)', offset: 0.45 },
        { transform: 'translate(' + e.x + 'px,' + e.y + 'px) scale(' + k + ')' }], { duration: 760, easing: 'cubic-bezier(.4,0,.6,1)', fill: 'forwards' });
      a.onfinish = function () { try { im.remove(); } catch (x) {} var v = pd.querySelector('#bohphone .bpctx .vb');
        if (v) { v.classList.remove('landed'); void v.offsetWidth; v.classList.add('landed'); setTimeout(function () { v.classList.remove('landed'); }, 1600); }
        LAST.flew.landed = Date.now(); LAST.flew.button = v && v.offsetWidth ? v.textContent : null; root.__BOSS_FLEW = JSON.parse(JSON.stringify(LAST.flew)); camBack(); };
    } catch (x) { LAST.err = String(x && x.message || x); camBack(); }
  }
  function talkTick() {
    if (!DATA || !sync() || !canTalk()) return;
    var h = hs(); if (!h) return;
    for (var i = 0; i < DATA.bosses.length; i++) {
      var r = DATA.bosses[i], L = lead(r.n);
      if (L.afterDue && h.boss.fallen[r.n]) { if (BEAT) return; if (!L.beatDone && beatStart(r)) return; after(r); return; }   /* (5) the change first, then her line */
      if (L.thingDue && h.boss.found[r.n] && !h.boss.fallen[r.n]) { thing(r); return; }
      var s = h.boss.sign;
      if (s && s.n === r.n && !L.asked && !h.boss.found[r.n] && Date.now() - T0 > 60000 && Date.now() > HUSH) { asker(r, s); return; }   /* (5) never on top of the moment */
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
    return null;   /* (7) the button lights only where it works: a cooling pot is not a grey button on every block (the feed said it cools) */
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
    var rise = fill((none && F.rise_none) || F.rise || '', nums);   /* (7) the change plays where he stands, the number rises off his men */
    if (rise) useBeat(id, h, rise);
    LAST.used.push({ id: id, x: h[0], y: h[1], got: got, first: first, said: said, rise: rise, t: Date.now() });
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
  /* where a picture stands on a block: its ground centre on the block's (offx/offy in blocks, a verb's mark sits off his men's feet) */
  function rectOf(key, x, y, ox, oy, wide, minCss, offx, offy) {
    var P = PICS && PICS[key]; if (!P) return null;
    var p = iso(x, y, ox, oy), w = Math.max(TW * wide, minCss * ppc()), sc = w / P.plate;
    return { x: Math.round(p.sx + (offx || 0) * TW - P.bx * sc), y: Math.round(p.sy + TH / 2 + (offy || 0) * TH - P.by * sc), w: Math.round(P.w * sc), h: Math.round(P.h * sc) };
  }
  function paint(gx, key, x, y, ox, oy, beat, wide, minCss, dk, offx, offy) {
    var q = pic(key, beat), b = rectOf(key, x, y, ox, oy, wide, minCss, offx, offy); if (!q || !b) return null;
    var W = 390, H = 736; try { W = CVW; H = CVH; } catch (e) {}
    if (b.x > W || b.y > H || b.x + b.w < 0 || b.y + b.h < 0) return null;
    gx.imageSmoothingEnabled = b.w < q.P.w; gx.drawImage(dk ? dark(q.im) : q.im, b.x, b.y, b.w, b.h); gx.imageSmoothingEnabled = false;
    return { x: b.x, y: b.y, w: b.w, h: b.h };
  }
  function plate(gx, t, sx, sy, col) {
    var f = 'monospace'; try { if (typeof FACE === 'function') f = FACE('casing'); } catch (e) {}
    var k = ppc(), px = Math.round(10 * k); gx.font = '700 ' + px + 'px ' + f; var w = Math.ceil(gx.measureText(t).width) + Math.round(8 * k), hh = Math.round(14 * k);
    gx.fillStyle = 'rgba(10,8,6,0.82)'; gx.fillRect(Math.round(sx - w / 2), Math.round(sy), w, hh);
    gx.fillStyle = col; gx.textBaseline = 'top'; gx.fillText(t, Math.round(sx - w / 2 + 4 * k), Math.round(sy + 2 * k));
  }
  /* (6) his place's name once he is down: no box, no colour, small and quiet under the place itself, and only when it is close */
  function quiet(gx, t, sx, sy) {
    var f = 'monospace'; try { if (typeof FACE === 'function') f = FACE('casing'); } catch (e) {}
    var k = ppc(); gx.font = '400 ' + Math.round(9 * k) + 'px ' + f; gx.textAlign = 'center'; gx.textBaseline = 'top';
    gx.lineJoin = 'round'; gx.lineWidth = Math.max(2, Math.round(3 * k)); gx.strokeStyle = 'rgba(10,8,6,0.8)'; gx.strokeText(t, Math.round(sx), Math.round(sy));
    gx.fillStyle = 'rgba(232,220,196,0.72)'; gx.fillText(t, Math.round(sx), Math.round(sy)); gx.textAlign = 'start';
  }
  /* (6) where his place is painted: the building block beside the door he fought at; a boss WORLD TWO stood on a plain street gets
     the nearest building block behind that street (up the screen first), so his own men never stand on the change */
  var NEXT = [[-1, -1], [0, -1], [-1, 0], [1, -1], [-1, 1], [1, 0], [0, 1], [1, 1]];
  function placeAt(at) {
    if (at.bx != null && (at.bx !== at.x || at.by !== at.y)) return [at.bx, at.by];
    for (var i = 0; i < NEXT.length; i++) { var x = at.x + NEXT[i][0], y = at.y + NEXT[i][1]; if (!walk(x, y) && dist(x, y)) return [x, y]; }
    return [at.x, at.y];
  }
  var PROP = { cook: 'fire', open: 'main_after', purify: 'clean' }, MARK_OFF = [0.34, 0.16];

  /* ---------- (5) THE MOMENT HE FALLS: the camera, the change over his men, then her line ---------- */
  var BEAT = null, UB = null, OV = null, RAF = 0;
  var HUSH = 0, HUSH_MS = 60000;   /* after the thing lands, a minute with nobody stopping you: he sees the map changed and tries the power (the next asker waits) */
  var BEAT_MS = { glide: 900, hold: 700, wipe: 1000, show: 1300 };
  function beatT() { var M = BEAT_MS; return M.glide + M.hold + M.wipe + M.show; }
  function camGo(x, y, ms) {   /* the map's camera to block (x, y), never farther out than he is (the map fit's own maths, __THE_MAP_FITS_YOUR_JOBS__) */
    try {
      if (MODE !== 'city') return null;
      if (typeof STREET !== 'undefined' && STREET.mult > 1) { STREET.mult = 1; try { streetLeft(); } catch (e) {} }
      try { MAP_FIT.n++; if (MAP_FIT.raf) { cancelAnimationFrame(MAP_FIT.raf); MAP_FIT.raf = 0; } } catch (e) {}
      var m = (om.n - 1) / 2, z0 = CZOOM, zb = zoomBounds();
      var zNeed = 78 * ppc() / TW0;   /* a block about 78 points: his place a quarter of the phone's width */
      var z1 = Math.max(zb[0], Math.min(zb[1] * 0.999, Math.max(z0, zNeed)));
      var c1 = camWorld(); c1 = { x: c1.x / z0, y: c1.y / z0 };
      var F0 = mapFocusRead(true).fo, W0 = { x: c1.x - (panX - F0.x) / z0, y: c1.y - (panY - F0.y) / z0 };
      var W1 = { x: (x - y) * TW0 / 2, y: (x + y - 2 * m) * TH0 / 2 - TH0 * 0.6 };   /* the place's middle, a little above its ground */
      try { camLetGo(); } catch (e) {}
      var t0 = performance.now(), C = { z0: z0, z1: z1, at: [x, y] };
      C.step = function (now) {
        var u = Math.min(1, (now - t0) / ms), e = u * u * (3 - 2 * u), z = Math.exp(Math.log(z0) + (Math.log(z1) - Math.log(z0)) * e), F = mapFocusRead(false).fo;
        CZOOM = z; TW = TW0 * z; TH = TH0 * z;
        panX = (c1.x - (W0.x + (W1.x - W0.x) * e)) * z + F.x; panY = (c1.y - (W0.y + (W1.y - W0.y) * e)) * z + F.y; clampPan();
        return u >= 1;
      };
      return C;
    } catch (e) { LAST.camErr = String(e && e.message || e); return null; }
  }
  function camBack() { try { camHold(); } catch (e) {} try { render(); } catch (e) {} }   /* the camera keeps the crew again */
  function paintKey(r, down) { return ((r.place && r.place.paint) || 'kitchen') + (down ? '_after' : '_before'); }
  function beatStart(r) {
    var h = hs(), f = h && h.boss.found[r.n]; if (!f || !PICS || !PICS[paintKey(r, true)] || !canTalk()) return false;
    try { if (MODE !== 'city') return false; } catch (e) { return false; }
    var at = placeAt(f);
    BEAT = { n: r.n, r: r, x: at[0], y: at[1], t0: performance.now(), cam: camGo(at[0], at[1], BEAT_MS.glide), phase: 'glide' };
    LAST.beat = { n: r.n, at: at, started: Date.now(), cam: BEAT.cam ? { z0: BEAT.cam.z0, z1: BEAT.cam.z1 } : null, phases: ['glide'], done: null, draft: true };
    root.__BOSS_BEAT = LAST.beat;
    tick(); return true;
  }
  function beatPhase(t) { var M = BEAT_MS; return t < M.glide ? 'glide' : t < M.glide + M.hold ? 'hold' : t < M.glide + M.hold + M.wipe ? 'wipe' : 'show'; }
  function beatEnd() {
    var B = BEAT; BEAT = null; if (!B) return;
    var L = lead(B.n); L.beatDone = day() + 1; save();
    LAST.beat.done = Date.now(); root.__BOSS_BEAT = LAST.beat;
    try { talkTick(); } catch (e) { LAST.err = String(e && e.message || e); }
  }
  /* one frame loop while a beat or a verb's change plays: the map re-drawn each frame, this lane's glass painted from draw() */
  function tick() {
    if (RAF) return;
    RAF = requestAnimationFrame(function step(now) {
      RAF = 0;
      if (BEAT) { if (BEAT.cam && !BEAT.camDone) BEAT.camDone = BEAT.cam.step(now); var ph = beatPhase(now - BEAT.t0); if (ph !== BEAT.phase) { BEAT.phase = ph; LAST.beat.phases.push(ph); } }
      try { render(); } catch (e) {}
      if (BEAT && now - BEAT.t0 >= beatT()) beatEnd();
      if (UB && now - UB.t0 >= UB_MS) { UB = null; LAST.useBeat.done = Date.now(); }
      if (BEAT || UB) RAF = requestAnimationFrame(step); else { ovOff(); try { render(); } catch (e) {} }
    });
  }
  function ov() {
    var c = null; try { c = cv; } catch (e) { return null; } if (!c) return null;
    if (!OV) { OV = document.createElement('canvas'); OV.id = 'bossbeat'; OV.setAttribute('aria-hidden', 'true'); OV.style.cssText = 'position:fixed;pointer-events:none;z-index:60'; document.body.appendChild(OV); }
    var r = c.getBoundingClientRect();
    if (OV.width !== CVW || OV.height !== CVH) { OV.width = CVW; OV.height = CVH; }
    OV.style.left = r.left + 'px'; OV.style.top = r.top + 'px'; OV.style.width = r.width + 'px'; OV.style.height = r.height + 'px'; OV.style.display = 'block';
    return OV;
  }
  function ovOff() { if (OV) { try { OV.getContext('2d').clearRect(0, 0, OV.width, OV.height); } catch (e) {} OV.style.display = 'none'; } }
  /* the change, on the tape: everything above the tracking line is AFTER, everything under it still BEFORE; the line itself is a
     few rows of the after picture slipped sideways and one pale scanline (it tracks in, the analog horror way, on the beat) */
  function wipe(x, fromKey, toKey, b, beat, u, alpha) {
    var A = pic(toKey, beat), Bf = fromKey ? pic(fromKey, beat) : null; if (!A) return;
    x.save(); x.globalAlpha = alpha; x.imageSmoothingEnabled = true;
    if (Bf && u < 1) x.drawImage(Bf.im, b.x, b.y, b.w, b.h);
    var cut = Math.round(b.h * u);
    if (cut > 0) { var sy = Math.round(A.P.h * u); x.drawImage(A.im, 0, 0, A.P.w, Math.max(1, sy), b.x, b.y, b.w, Math.max(1, cut)); }
    if (u > 0 && u < 1) {
      var k = ppc(), band = Math.max(3, Math.round(5 * k)), rows = Math.max(1, Math.round(band / Math.max(1, Math.round(k))));
      for (var i = 0; i < rows; i++) {
        var yy = b.y + cut + i * Math.round(k), syy = Math.min(A.P.h - 1, Math.round((cut + i * Math.round(k)) / b.h * A.P.h)), j = ((i * 7 + beat * 3) % 5 - 2) * Math.round(2 * k);
        x.drawImage(A.im, 0, syy, A.P.w, 1, b.x + j, yy, b.w, Math.max(1, Math.round(k)));
      }
      x.globalAlpha = alpha * 0.55; x.fillStyle = '#d8d0bc'; x.fillRect(b.x - Math.round(3 * k), b.y + cut, b.w + Math.round(6 * k), Math.max(1, Math.round(k)));
    }
    x.restore();
  }
  function ovPaint(ox, oy, beat) {
    if (!BEAT && !UB) return;
    var o = ov(); if (!o) return; var x = o.getContext('2d'); x.clearRect(0, 0, o.width, o.height);
    var now = performance.now();
    if (BEAT) {
      var t = now - BEAT.t0, M = BEAT_MS, r = BEAT.r, b = rectOf(paintKey(r, true), BEAT.x, BEAT.y, ox, oy, 1.3, 64);
      if (b) {
        var u = Math.max(0, Math.min(1, (t - M.glide - M.hold) / M.wipe)), fade = Math.max(0, Math.min(1, (beatT() - t) / 500));
        wipe(x, paintKey(r, false), paintKey(r, true), b, beat, u, fade);
        LAST.beat.rect = { x: b.x, y: b.y, w: b.w, h: b.h, cssW: Math.round(b.w / ppc()) }; LAST.beat.u = Math.round(u * 100) / 100;
        try { var F = mapFocus(); LAST.beat.focus = [Math.round(F.x), Math.round(F.y)]; LAST.beat.mid = [Math.round(b.x + b.w / 2), Math.round(b.y + b.h / 2)]; } catch (e) {}
      }
    }
    if (UB) {
      var tu = now - UB.t0, bm = rectOf(UB.to, UB.x, UB.y, ox, oy, 0.36, 22, MARK_OFF[0], MARK_OFF[1]);
      if (bm) wipe(x, UB.from, UB.to, bm, beat, Math.min(1, tu / 700), Math.max(0, Math.min(1, (UB_MS - tu) / 300)));
      /* the number rises off his men, where they stand */
      var p = iso(UB.x, UB.y, ox, oy), k = ppc(), e = Math.min(1, tu / 1600), a = tu < 1400 ? 1 : Math.max(0, (UB_MS - tu) / (UB_MS - 1400));
      var f = 'monospace'; try { if (typeof FACE === 'function') f = FACE('casing'); } catch (er) {}
      x.save(); x.globalAlpha = a; x.font = '400 ' + Math.round(12 * k) + 'px ' + f; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.lineJoin = 'round';
      var ty = Math.round(p.sy - TH * 0.6 - 18 * k - e * 34 * k);
      x.lineWidth = Math.round(4 * k); x.strokeStyle = 'rgba(10,8,6,0.9)'; x.strokeText(UB.rise, Math.round(p.sx), ty);
      x.fillStyle = UB.id === 'cook' ? '#9fd08a' : UB.id === 'open' ? '#f2c56a' : '#bfeae2'; x.fillText(UB.rise, Math.round(p.sx), ty); x.restore();
      LAST.useBeat.drawn = { rise: UB.rise, at: [Math.round(p.sx), ty], mark: bm ? [bm.x, bm.y, bm.w, bm.h] : null };
    }
  }
  /* (7) a verb used: the change plays where he stands and the number rises off his men */
  var UB_MS = 2200;
  function useBeat(id, at, rise) {
    UB = { id: id, x: at[0], y: at[1], t0: performance.now(), rise: rise, from: id === 'open' ? 'main_before' : null, to: PROP[id] || 'clean' };
    LAST.useBeat = { id: id, at: at.slice(), rise: rise, started: Date.now(), done: null, draft: true };
    root.__BOSS_USE_BEAT = LAST.useBeat;
    tick();
  }

  /* ---------- (1) drawing: his place painted, what changed, the blocks you used a verb on ---------- */
  function draw(ox, oy) {
    if (!sync() || !DATA) { loadData(); return; }
    if (!PICS) loadData();
    var gx = null; try { gx = g; } catch (e) { return; }
    var h = hs(); LAST.drew = { places: [], marks: 0, mains: 0, painted: 0, pixelRows: 0, plates: 0 };
    if (bench()) return;
    try { rumours(); } catch (e) {}
    var beat = 0; try { beat = mapArtBeat(); } catch (e) {}
    gx.save();
    try {
      /* once THE TAP is down: the shut mains he has seen, near him only (the three nearest within eight blocks, a little faded: 11/3, six
         within twelve were more marks round him than the changed place itself), never the whole valley */
      if (S.verbs.open) { var me = here() || [0, 0]; gx.globalAlpha = 0.8;
        mains().filter(function (m) { return !marked('open', m[0], m[1]) && seen(m[0], m[1]) && cheb(m[0], m[1], me[0], me[1]) <= 8; })
          .sort(function (a, b) { return cheb(a[0], a[1], me[0], me[1]) - cheb(b[0], b[1], me[0], me[1]); }).slice(0, 3)
          .forEach(function (m) { if (paint(gx, 'main_before', m[0], m[1], ox, oy, 0, 0.32, 18, false, MARK_OFF[0], MARK_OFF[1])) LAST.drew.mains++; }); gx.globalAlpha = 1; }
      /* the blocks a verb was used on: the thing it left, off his men's feet (the old 9-second plate is gone: the number rises off them instead) */
      S.marks.forEach(function (m) {
        if (UB && UB.x === m.x && UB.y === m.y && UB.to === (PROP[m.k] || 'clean')) return;   /* still playing on his glass */
        var b = paint(gx, PROP[m.k] || 'clean', m.x, m.y, ox, oy, beat, 0.36, 22, false, MARK_OFF[0], MARK_OFF[1]); if (!b) return; LAST.drew.marks++; LAST.drew.painted++;
      });
      DATA.bosses.forEach(function (r) {
        var f = h.boss.found[r.n], sg = (h.boss.sign && h.boss.sign.n === r.n) ? h.boss.sign.boss : null, at = f || sg; if (!at) return;
        var pa = placeAt(at), bx = pa[0], by = pa[1];
        var down = !!h.boss.fallen[r.n], known = !!f, inBeat = !!(BEAT && BEAT.n === r.n), key = paintKey(r, down && !inBeat);
        var b = paint(gx, key, bx, by, ox, oy, beat, 1.3, 64, !known && !seen(bx, by)); if (!b) return;
        LAST.drew.painted++;
        if (known && !down) { plate(gx, (r.place && r.place.name) || r.n, b.x + b.w / 2, b.y + 2, '#ffb27a'); LAST.drew.plates++; }   /* before: his place, named */
        var named = false;
        if (down && !inBeat && b.w >= 72 * ppc()) { quiet(gx, (r.place && r.place.name) || r.n, b.x + b.w / 2, b.y - Math.round(11 * ppc())); named = true; }   /* after: the place is the mark, its name faint over it (his men stand in front) */
        LAST.drew.places.push({ n: r.n, key: key, painted: true, x: b.x, y: b.y, w: b.w, h: b.h, at: [bx, by], known: known, down: down, named: named, beat: inBeat });
      });
    } catch (e) { LAST.err = String(e && e.message || e); }
    gx.restore();
    try { ovPaint(ox, oy, beat); } catch (e) { LAST.err = String(e && e.message || e); }
    try { if (!BEAT) talkTick(); } catch (e) { LAST.err = String(e && e.message || e); }
  }
  /* WORLD TWO's lights-back-on, skull, door and place plate stand down where a painted place shows the change (his_map asks) */
  function paints(n) { var r = row(n); return !!(r && r.place && r.place.paint && PICS && PICS[r.place.paint + '_after']); }
  /* the phone's icon for a verb: the thing he handed you (his pot, his wrench, his filter); the small thing it leaves until it loads */
  function icon(id) { var r = verbRow(id), Hd = r && r.verb && r.verb.hand; if (Hd && Hd.pic) return 'boss_places/' + String(Hd.pic).replace(/[^\w.]/g, '');
    var q = pic(PROP[id] || 'clean', 0); if (!q) return ''; try { var c = document.createElement('canvas'), P = q.P; c.width = 28; c.height = 28; var x = c.getContext('2d'), s = Math.min(28 / P.w, 28 / P.h);
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
