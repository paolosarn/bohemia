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
         (the fire lit, the main running, the drum filled) and the number rises off his men (verb.first.rise), and it is on the feed.
   BOSSES 4 11/3 (rules 330, 337, 338): THE BURN, THE SURVEYOR, THE CLIMB, the same package, their assets first (his own model,
   his place painted before and after, the thing he hands you). Three verbs, each its own kind of place so the phone's one
   button never hides another (verbs_order: the place-bound first, the anywhere ones last):
     BURN   (LIGHT A FIRE) at night, on a dark block off a town, once a night: a fire that stays; at night, 2 blocks round any
            fire you lit, you see like in the day (lit(), asked by the city's sight and fog, marked __THE_BOSS_FIRES_LIGHT_THE_NIGHT__);
     SURVEY (FILL IN THE MAP) on a road, once a day: the fog lifts 10 blocks round you for good (the city's own fogReveal);
     CLIMB  (GO UP) beside a tower, once a tower: the floors nobody reached pay 12 batteries. */
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
        /* __FIRST_PLAY_IS_LIGHT__ (PLUMBER 6, rule 418(a)): the 39 pictures (0.5 MB) come after first play; until one is in, pic() is null and the place draws as before */
        var go = function () { Object.keys(PICS).forEach(function (k) { PICS[k].frames.forEach(function (f) { var im = new Image(); im.src = 'boss_places/' + f; IMG[f] = im; }); }); };
        var af = (function(){ try{ var t = window.top; return t && t !== window && typeof t.bohemiaAfterFirstPlay === 'function' ? t.bohemiaAfterFirstPlay : null; }catch(e){ return null; } })(); if (af) { loadData.held = true; af(function () { loadData.held = false; go(); }); } else go(); }).catch(function () { loadData.pics = false; }); } catch (e) { loadData.pics = false; } }
  }
  function row(n) { if (!DATA) return null; for (var i = 0; i < DATA.bosses.length; i++) if (DATA.bosses[i].n === n) return DATA.bosses[i]; return null; }
  function verbRow(id) { if (!DATA) return null; for (var i = 0; i < DATA.bosses.length; i++) if (DATA.bosses[i].verb && DATA.bosses[i].verb.id === id) return DATA.bosses[i]; return null; }
  function fresh(seed) { return { v: 1, seed: seed, verbs: {}, marks: [], rumours: {}, lead: {}, ground: {}, pipe: {}, machines: {}, dark: {}, hole: {} }; }
  function save() { try { root.localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function sync() {
    var h = hs(); if (!h) return false;
    if (!S) { try { S = JSON.parse(root.localStorage.getItem(KEY) || 'null'); } catch (e) { S = null; } SHUT_DIRTY = true; }
    if (!S || S.v !== 1 || S.seed !== h.seed) { S = fresh(h.seed); save(); SHUT_DIRTY = true; }
    if (!S.lead) S.lead = {};
    if (!S.ground) S.ground = {};
    if (!S.pipe) S.pipe = {};
    if (!S.machines) S.machines = {};
    if (!S.dark) S.dark = {};
    if (!S.hole) S.hole = {};
    if (DATA) DATA.bosses.forEach(function (r) { if (r.verb && h.boss.fallen[r.n] && !S.verbs[r.verb.id]) grant(r, h.boss.fallen[r.n]); });   /* a save from before this file */
    groundCatchUp();   /* (8) his ground follows WORLD TWO's fallen flag */
    pipeCatchUp();     /* (9) his pipe too */
    machinesCatchUp(); /* (10) and his machines */
    darkCatchUp();     /* (11) and his dark */
    holeCatchUp();     /* (12) and his hole */
    if (SHUT_DIRTY) shutGrid();
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
  /* BOSSES 11/10 (rule 441, measured on the alpha on its side: the frame 348 px tall, the card 308, RAUL's flyer card put LATER under its
     bottom edge, a button the tap could not reach, and the card stood over every card after it): on a short screen his cards fit,
     the face smaller, the words and the buttons tighter, so every button shows without a scroll (the card is CONTENT's; this dresses
     only the cards this file asks for, the way handOnCard adds to them) */
  function fitCard() {
    try {
      var el = document.getElementById('roadcard'), rc = el && el.querySelector('.rc'); if (!rc || (root.innerHeight || 800) >= 520) return false;
      var fc = rc.querySelector('.rcface'); if (fc) { fc.style.width = '44px'; fc.style.height = '44px'; }
      rc.style.padding = '10px 12px 9px';
      var tx = rc.querySelector('.rctext'); if (tx) { tx.style.marginTop = '6px'; tx.style.padding = '6px 8px 7px'; tx.style.fontSize = '11px'; tx.style.lineHeight = '1.3'; }
      var bx = rc.querySelector('.rcb'); if (bx) { bx.style.marginTop = '8px'; bx.style.gap = '6px'; }
      Array.prototype.forEach.call(rc.querySelectorAll('.rcb button'), function (b) { b.style.minHeight = '40px'; b.style.padding = '4px 10px'; });
      var hi = rc.querySelector('.rchand img'); if (hi) { hi.style.width = '36px'; hi.style.height = '36px'; }
      var hd = rc.querySelector('.rchand'); if (hd) { hd.style.marginTop = '6px'; hd.style.padding = '4px 8px'; }
      var gd = rc.querySelector('.rcground'); if (gd) { gd.style.marginTop = '5px'; gd.style.padding = '4px 8px'; }
      LAST.fit = { h: rc.offsetHeight, max: root.innerHeight, scroll: rc.scrollHeight > rc.clientHeight + 1, at: Date.now() }; root.__BOSS_CARD_FIT = LAST.fit;
      return true;
    } catch (e) { return false; }
  }
  function talk(kind, n, o) {
    var RE = card(); if (!RE) return false;
    RE.card(o); fitCard();
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
    if (ok) groundOnCard(r);
    if (ok) fitCard();
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
  /* (8) under it, what his ground did, in one plain line with its numbers (the streets open, his till) */
  function groundOnCard(r) {
    try {
      var g = S && S.ground && S.ground[r.n]; if (!g || !g.said) g = S && S.pipe && S.pipe[r.n]; if (!g || !g.said) g = S && S.machines && S.machines[r.n]; if (!g || !g.said) g = S && S.dark && S.dark[r.n]; if (!g || !g.said) g = S && S.hole && S.hole[r.n]; if (!g || !g.said) return;   /* (8) his ground, (9) his pipe, (10) his machines or (11) his dark */
      var el = document.getElementById('roadcard'), at = el && (el.querySelector('.rchand') || el.querySelector('.rctext')); if (!at) return;
      var d = document.createElement('div'); d.className = 'rcground'; d.setAttribute('data-draft', 'true');
      d.style.cssText = 'margin-top:6px;padding:5px 8px;background:rgba(10,8,6,.45);box-shadow:inset 0 0 0 1px #3a2e20;font:400 11px BohemiaCasing,ui-monospace,monospace;letter-spacing:.8px;line-height:1.35;color:#e2b45a';
      d.textContent = String(g.said);
      at.parentNode.insertBefore(d, at.nextSibling);
      if (root.__BOSS_CARD) root.__BOSS_CARD.ground = String(g.said);
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
      if (L.afterDue && h.boss.fallen[r.n]) { if (BEAT) return;
        /* BOSSES 11/10 (measured on the alpha on its side: a fight can hand him back in the close view, where the map is not drawn and the
           kill's camera cannot run, and her card came with no change shown): the change waits for the map, then her line */
        if (!L.beatDone && PICS && PICS[paintKey(r, true)]) { try { if (MODE !== 'city') return; } catch (e) {} }
        if (!L.beatDone && beatStart(r)) return; after(r); return; }   /* (5) the change first, then her line */
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
  function isMain(x, y) { var V = verbRow('open'), pp = onPipe(x, y); if (V && pp && pp.open && walk(x, y)) return true;   /* (9) his pipe, once he is down, is a line of mains */
    return !!V && walk(x, y) && !nearTown(x, y, 1) && (hisPlace('open', x, y) || !!nearKind(x, y, V.verb.main_districts || [])); }
  function mains() {   /* every main in the valley, counted once (the map does not move) */
    if (MAINS) return MAINS; var n = N(), V = verbRow('open'); if (!n || !V) return [];
    MAINS = []; for (var y = 1; y < n - 1; y++) for (var x = 1; x < n - 1; x++) if (isMain(x, y)) MAINS.push([x, y]);
    return MAINS;
  }
  function night() { try { return !!isNight(); } catch (e) { return false; } }
  function nightOf() { var d = day(); try { if (T.min < 6 * 60) d -= 1; } catch (e) {} return d; }   /* the night belongs to the day it fell on */
  function powered(x, y) { try { return !!((POWER.at(x, y) || {}).live); } catch (e) { return false; } }
  function roadAt(x, y, kinds) { var d = dist(x, y); return !!d && kinds.indexOf(d) >= 0; }
  /* a tower is climbed once: the block beside it is marked, and so is every block beside the same tower block */
  function towerOf(x, y) { var V = verbRow('climb'); if (!V) return null; var K = V.verb.tower_districts || [];
    for (var a = -1; a <= 1; a++) for (var b = -1; b <= 1; b++) { var d = dist(x + a, y + b); if (d && K.indexOf(d) >= 0) return [x + a, y + b]; } return null; }
  function climbed(x, y) { if (!S) return false; var t = towerOf(x, y); return S.marks.some(function (m) { return m.k === 'climb' && ((m.x === x && m.y === y) || (t && m.tx === t[0] && m.ty === t[1])); }); }
  /* (BURN) every fire he lit lights the blocks round it at night: the city's sight down a street and its fog ask (marked
     __THE_BOSS_FIRES_LIGHT_THE_NIGHT__ in slices/BOHEMIA_CITY_WORLD.html) */
  function lit(x, y) {
    if (warmAt(x, y)) return true;   /* (11) his drums, once he is down, burn for you */
    if (!S || !S.verbs || !S.verbs.burn) return false;
    var V = verbRow('burn'), r = (V && V.verb.light_blocks) || 2;
    for (var i = 0; i < S.marks.length; i++) { var m = S.marks[i]; if (m.k === 'burn' && cheb(m.x, m.y, x, y) <= r) return true; }
    return false;
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
    /* BOSSES 4: THE BURN's fire (at night, a dark block off a town, once a night), THE SURVEYOR's map (on a road, once a day),
       THE CLIMB's hook (beside a tower, once a tower); his own place always works for his verb */
    if (id === 'burn') {
      if (nearTown(x, y, 1) || marked('burn', x, y)) return null;
      if (V.night_only && !night() && !hisPlace('burn', x, y)) return null;
      if (powered(x, y) && !hisPlace('burn', x, y)) return null;
      var lb = S.verbs.burn.last; if (lb != null && nightOf() === lb) return { id: id, off: true, why: 'lit tonight' };
      return { id: id };
    }
    if (id === 'survey') {
      if (!hisPlace('survey', x, y) && !roadAt(x, y, V.road_districts || [])) return null;
      var ls = S.verbs.survey.last; if (ls != null && day() - ls < (V.cooldown_days || 1)) return { id: id, off: true, why: 'mapped today' };
      return { id: id };
    }
    if (id === 'climb') return (!climbed(x, y) && (hisPlace('climb', x, y) || !!nearKind(x, y, V.tower_districts || []))) ? { id: id } : null;
    return null;
  }
  /* the phone's band: the verb that works where he stands (the order the file says), a cooling one only when nothing else does;
     its button is one plain line and its tip what a held finger says */
  function verbHere() {
    if (!sync() || !DATA) return null;
    var h = here(); if (!h) return null;
    try { if (TRAVEL && TRAVEL.path && TRAVEL.i < TRAVEL.path.length) return null; } catch (e) {}
    var order = (DATA.verbs_order || ['open', 'purify', 'cook']).slice(), off = null;
    /* BOSSES 4 (measured 11/3, the six-boss gate's A5f): at a fallen boss's own place HIS verb comes first, so the thing he just
       handed you lands on its own button (THE FILTER's place was a main too, and OPEN took the button from CLEAN THE WATER) */
    for (var j = 0; j < order.length; j++) if (hisPlace(order[j], h[0], h[1])) { order.unshift(order.splice(j, 1)[0]); break; }
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
  /* (SURVEY) the city's own fog, lifted round him: how many blocks came out of it (the bench's open valley counts none) */
  function mapAround(x, y, r) {
    var n = 0, ri = Math.ceil(r);
    try {
      var was = []; for (var dy = -ri; dy <= ri; dy++) for (var dx = -ri; dx <= ri; dx++) { if (dx * dx + dy * dy > (r - 0.5) * (r - 0.5)) continue; was.push([x + dx, y + dy, seen(x + dx, y + dy)]); }
      if (typeof fogReveal === 'function') fogReveal(x, y, r);
      was.forEach(function (w) { if (!w[2] && seen(w[0], w[1])) n++; });
      try { if (typeof fogSave === 'function') fogSave(); } catch (e) {}
    } catch (e) { LAST.err = String(e && e.message || e); }
    return { blocks: n };
  }
  function use(id) {
    if (!sync()) return false;
    var h = here(); if (!h) return false;
    var a = applies(id, h[0], h[1]); if (!a || a.off) return false;
    var r = verbRow(id), V = r.verb, w = whereWord(h[0], h[1]), got = null, first = !(S.verbs[id].uses | 0);
    if (id === 'cook') { got = condHeal(V.heal_hours || 8); S.verbs.cook.last = day(); }
    if (id === 'open') { got = { paid: V.pay_batteries | 0 }; try { if (got.paid > 0) BohemiaPurse.credit(purseGet(), 'electricity', got.paid, 'the main on ' + w, 'boss-verb:open:' + h[0] + ',' + h[1], day()); } catch (e) { got.paid = 0; } }
    if (id === 'purify') got = condWounds(V.wound_days || 2);
    if (id === 'burn') { got = { lit: true, blocks: (V.light_blocks || 2) }; S.verbs.burn.last = nightOf(); }
    if (id === 'survey') { got = mapAround(h[0], h[1], V.radius || 10); S.verbs.survey.last = day(); }
    if (id === 'climb') { got = { paid: V.pay_batteries | 0 }; try { if (got.paid > 0) BohemiaPurse.credit(purseGet(), 'electricity', got.paid, 'the top floors on ' + w, 'boss-verb:climb:' + h[0] + ',' + h[1], day()); } catch (e) { got.paid = 0; } }
    var nums = { where: w, healed: (got && got.healed) | 0, men: (got && got.men) | 0, paid: (got && got.paid) | 0, blocks: (got && got.blocks) | 0 };
    nums.wounds = nums.men + (nums.men === 1 ? ' wound' : ' wounds'); nums.WOUNDS = nums.wounds.toUpperCase();   /* '1 wound', never '1 wounds' */
    var none = (id === 'cook' && !nums.healed) || (id === 'purify' && !nums.men) || (id === 'survey' && !nums.blocks) || (id === 'climb' && !nums.paid), F = V.first || {};   /* nothing to heal: say so plainly, never '0 blood back' */
    var mk = { k: id, x: h[0], y: h[1], day: day(), first: first ? fill((none && F.plate_none) || F.plate, nums) : null, t: Date.now() };
    if (id === 'climb') { var tw = towerOf(h[0], h[1]); if (tw) { mk.tx = tw[0]; mk.ty = tw[1]; } }
    S.marks.push(mk);
    S.verbs[id].uses = (S.verbs[id].uses | 0) + 1;
    save();
    var said = first && (F.feed || F.feed_none) ? fill((none && F.feed_none) || F.feed, nums)
      : V.says + (id === 'cook' && got ? (got.men ? ' ' + got.healed + ' blood back across ' + got.men + (got.men === 1 ? ' man.' : ' men.') : ' Nobody was hurt; they eat anyway.')
      : id === 'open' && got ? (got.paid ? ' +' + got.paid + ' batteries.' : '') : id === 'purify' && got ? (got.men ? ' ' + got.men + (got.men === 1 ? ' wound' : ' wounds') + ' closing sooner.' : ' Nobody is wounded right now.')
      : id === 'survey' && got ? ' ' + got.blocks + (got.blocks === 1 ? ' block' : ' blocks') + ' out of the fog.' : id === 'climb' && got ? (got.paid ? ' +' + got.paid + ' batteries.' : '') : '');
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

  /* ---------- (8) HIS GROUND (BOSSES 11/8, rule 437(a), ask lines 167, 346, 522; records/BOHEMIA_BOSSES_THE_FIRST_BOSS_CHANGES_THE_MAP_11_8_26.md)
     PAOLO 10/26: 'bosses... where you're able to alter the map and what's going on in the world around you'. MEASURED 11/8: THE POT's
     fall changed one picture; his crew held no street and closed no road, so the map worked the same after him as before.
     NOW: a boss whose row has 'ground' holds the streets round his place with his crew's CHECKPOINTS (carts, a burned car, his flag,
     two of his men): every street block on the ring 'radius' blocks out from his door is shut but the one the sign points down (his
     front), so the map's own route goes round his ground (Battle Brothers: a location's men hold the land round it until it falls).
     Worked out once, the moment WORLD TWO stands him somewhere, off the game's seed and his place, and kept with the game.
     The walk refuses a shut block through the map's own walk (cityWalkable wrapped here, the way WORLD 7's shut roads wrap it;
     the bench gets none). WHEN HE FALLS: his crew is gone, every checkpoint is shoved to the kerb on the map (the after picture),
     the walk goes through, his till pays (Battle Brothers pays a big fight with what the place held), the strip posts it on the feed.
     All of it is in this file's state, so a reload keeps it; WORLD TWO's fallen flag is the truth if the two ever disagree. */
  var SHUT = null, SHUT_N = 0, SHUT_OFF = false, SHUT_DIRTY = true, RAW_WALK = null;
  function groundRow(n) { var r = row(n); return r && r.ground ? r : null; }
  function shutGrid() {
    SHUT_DIRTY = false; var n = N(); SHUT = null; SHUT_N = n;
    if (!S || !S.ground || !n || bench()) return;
    var h = hs(), a = null;
    for (var k in S.ground) { var g = S.ground[k]; if (!g || g.open != null || (h && h.boss.fallen[k])) continue;
      (g.shut || []).forEach(function (b) { if (b.x >= 0 && b.y >= 0 && b.x < n && b.y < n) { a = a || new Uint8Array(n * n); a[b.y * n + b.x] = 1; } }); }
    SHUT = a; root.__BOSS_SHUT = a ? { n: n, count: a.reduce(function (s, v) { return s + v; }, 0) } : null;
  }
  function shutAt(x, y) { return !SHUT_OFF && !!SHUT && x >= 0 && y >= 0 && x < SHUT_N && y < SHUT_N && SHUT[y * SHUT_N + x] === 1; }
  /* the ring 'radius' out from his door: which way a block's street runs (the barricade lies across it) */
  function along(x, y, at) {
    var dx = x - at[0], dy = y - at[1], R = Math.max(Math.abs(dx), Math.abs(dy));
    var ex = Math.abs(dx) === R, ey = Math.abs(dy) === R;
    if (ex && !ey) return 'x'; if (ey && !ex) return 'y';
    return (walk(x - Math.sign(dx), y) && walk(x + Math.sign(dx), y)) ? 'x' : 'y';   /* a corner: the way the street goes through it */
  }
  function makeGround(r, at, from) {
    var G = r.ground, n = N(), R = Math.max(2, G.radius | 0 || 3); if (!n) return null;
    var rng = (function (s) { s = s >>> 0 || 1; return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; })((S.seed ^ (at[0] * 73856093) ^ (at[1] * 19349663)) >>> 0);
    var route = function (a, b) { try { return cityRoute(a[0], a[1], b[0], b[1]); } catch (e) { return null; } };
    var ring = [];
    SHUT_OFF = true;
    try {
      for (var dy = -R; dy <= R; dy++) for (var dx = -R; dx <= R; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== R) continue;
        var x = at[0] + dx, y = at[1] + dy; if (x < 1 || y < 1 || x >= n - 1 || y >= n - 1 || !walk(x, y)) continue;
        /* a way IN: a ring block with a street on the inside of it. A street that only runs past his ground stays open (measured 11/8:
           without this the whole street along the east side, seven blocks, was shut and lined with carts that blocked nothing) */
        var inn = false; for (var a2 = -1; a2 <= 1 && !inn; a2++) for (var c2 = -1; c2 <= 1 && !inn; c2++) {
          var ix = x + a2, iy = y + c2; if (Math.max(Math.abs(ix - at[0]), Math.abs(iy - at[1])) === R - 1 && walk(ix, iy)) inn = true; }
        if (!inn) continue;
        ring.push({ x: x, y: y, along: along(x, y, at), town: !!nearTown(x, y, 2) });
      }
      /* his front: the ring blocks on the map's own way in from where the sign is (and the blocks beside them on the ring: a wide street is one way in) */
      var p = from ? route(from, at) : null, front = {};
      (p || []).forEach(function (q) { if (Math.max(Math.abs(q[0] - at[0]), Math.abs(q[1] - at[1])) === R) front[q[0] + ',' + q[1]] = 1; });
      if (!Object.keys(front).length && ring.length) { var nb = ring.slice().sort(function (a, b) { return cheb(a.x, a.y, from ? from[0] : at[0], from ? from[1] : at[1]) - cheb(b.x, b.y, from ? from[0] : at[0], from ? from[1] : at[1]); })[0]; front[nb.x + ',' + nb.y] = 1; }
      var grew = true; while (grew) { grew = false; ring.forEach(function (b) { var k = b.x + ',' + b.y; if (front[k]) return;
        for (var a = -1; a <= 1; a++) for (var c = -1; c <= 1; c++) if ((a || c) && front[(b.x + a) + ',' + (b.y + c)] && ((a === 0) !== (c === 0))) { front[k] = 1; grew = true; return; } }); }
      var shut = ring.filter(function (b) { return !front[b.x + ',' + b.y] && !b.town; });
      /* never a shut that cuts him off: from where he stands, his door and every town he could reach must still be reachable */
      var me = here() || from || at, bs = bases(), towns = [];
      for (var tn in bs) { var tb = bs[tn]; if (!tb) continue; var d = null; try { d = townDoor(tb.x | 0, tb.y | 0); } catch (e) {} if (d && route(me, d)) towns.push(d); }
      var ok = function () { SHUT_OFF = false; SHUT = new Uint8Array(n * n); SHUT_N = n; shut.forEach(function (b) { SHUT[b.y * n + b.x] = 1; });
        var good = !!route(me, at) && (!from || !!route(from, at)) && towns.every(function (t) { return !!route(me, t); }); SHUT_OFF = true; return good; };
      var tries = 0; while (shut.length && !ok() && tries++ < 40) shut.splice(Math.floor(rng() * shut.length) % shut.length, 1);
      if (!shut.length || !ok()) shut = [];
      var g = { at: at.slice(), from: from ? from.slice() : null, front: Object.keys(front), shut: shut.map(function (b) { return { x: b.x, y: b.y, along: b.along }; }),
        ring: ring.length, open: null, paid: null, made: day(), draft: true };
      return g;
    } finally { SHUT_OFF = false; SHUT_DIRTY = true; }
  }
  function groundTick() {
    if (!DATA || !S || bench() || !N()) return;
    var h = hs(); if (!h) return;
    if (!S.ground) S.ground = {};
    DATA.bosses.forEach(function (r) {
      if (!r.ground || S.ground[r.n]) return;
      var sg = (h.boss.sign && h.boss.sign.n === r.n) ? h.boss.sign : null, f = h.boss.found[r.n], at = f || (sg && sg.boss);
      if (!at || h.boss.fallen[r.n]) return;
      try { if (!FOG.ready) return; } catch (e) { return; }
      var g = makeGround(r, [at.x, at.y], sg ? [sg.x, sg.y] : here());
      if (g) { S.ground[r.n] = g; save(); LAST.ground = { n: r.n, shut: g.shut.length, ring: g.ring, at: Date.now() }; }
    });
    if (SHUT_DIRTY) shutGrid();
  }
  /* he fell: his crew is gone, the checkpoints come down, the till pays, the strip posts it */
  function groundFell(r, h) {
    var G = r.ground; if (!G || !S) return null;
    if (!S.ground) S.ground = {};
    var g = S.ground[r.n]; if (!g) { g = S.ground[r.n] = { at: null, from: null, front: [], shut: [], ring: 0, open: null, paid: null, made: day(), draft: true }; }
    if (g.open != null) return g;
    g.open = day();
    var f = h && h.boss.found[r.n], w = f ? whereWord(f.x, f.y) : 'that block', nOpen = g.shut.length;
    var till = G.till | 0;
    if (till > 0 && g.paid == null) { g.paid = till; save();
      try { BohemiaPurse.credit(purseGet(), 'electricity', till, (G.till_word || 'his till') + ' on ' + w, 'boss-till:' + r.n, day()); } catch (e) { g.paid = 0; } }
    save(); SHUT_DIRTY = true; shutGrid();
    var o = { where: w, n: nOpen, streets: nOpen + (nOpen === 1 ? ' street' : ' streets'), till: g.paid | 0, crew: G.crew || 'his crew' };
    o.STREETS = o.streets.toUpperCase(); o.streets = o.streets.charAt(0).toUpperCase() + o.streets.slice(1);   /* '7 STREETS' on her card, '7 streets' on the feed */
    if (G.feed) feed(G.feed.who, fill(nOpen ? G.feed.txt : (G.feed.txt_none || G.feed.txt), o), 'world');
    if (G.mine && g.paid) feed('@yourcompany', fill(G.mine, o), 'mine');
    g.said = fill(nOpen ? G.card : (G.card_none || G.card), o);
    save();
    LAST.groundFell = { n: r.n, open: nOpen, paid: g.paid | 0, said: g.said, at: Date.now() };
    try { root.dispatchEvent(new CustomEvent('bohemia:boss-ground', { detail: { n: r.n, open: nOpen, paid: g.paid | 0 } })); } catch (e) {}
    return g;
  }
  /* a save from before this round, or a fall this file missed: WORLD TWO's fallen flag is the truth */
  function groundCatchUp() {
    if (!DATA || !S || !S.ground) return; var h = hs(); if (!h) return;
    for (var k in S.ground) { var g = S.ground[k]; if (g && g.open == null && h.boss.fallen[k]) { var r = groundRow(k); if (r) groundFell(r, h); else { g.open = day(); save(); SHUT_DIRTY = true; } } }
  }
  /* the checkpoints on the map: closed (his men, the fire on the beat), or shoved to the kerb once he is down; one street block each */
  function groundDraw(gx, ox, oy, beat) {
    if (!S || !S.ground) return;
    var h = hs(); LAST.drew.checkpoints = [];
    for (var k in S.ground) {
      var g = S.ground[k], r = groundRow(k); if (!g || !r) continue;
      var open = g.open != null || !!(h && h.boss.fallen[k]), known = !!(h && h.boss.found[k]), inBeat = !!(BEAT && BEAT.n === k);
      (g.shut || []).forEach(function (b) {
        var vis = seen(b.x, b.y); if (!vis && !known) return;
        if (inBeat && open) { LAST.drew.checkpoints.push({ n: k, at: [b.x, b.y], key: 'beat', open: open }); return; }   /* the beat's glass plays it */
        var key = ((r.ground.pic || 'checkpoint') + '_' + (b.along === 'x' ? 'x' : 'y')) + (open ? '_after' : '_before');
        var q = paint(gx, key, b.x, b.y, ox, oy, beat, 1.0, 0, !vis);
        if (q) { LAST.drew.checkpoints.push({ n: k, at: [b.x, b.y], key: key, open: open, w: q.w, dark: !vis }); LAST.drew.painted++; }
      });
    }
  }
  function groundBeat(x, ox, oy, beat, u, alpha) {   /* the moment he falls: his checkpoints roll open on the same tape as his place */
    var g = S && S.ground && BEAT && S.ground[BEAT.n], r = BEAT && groundRow(BEAT.n); if (!g || !r) return 0;
    var c = 0;
    (g.shut || []).forEach(function (b) {
      var base = (r.ground.pic || 'checkpoint') + '_' + (b.along === 'x' ? 'x' : 'y'), bb = rectOf(base + '_after', b.x, b.y, ox, oy, 1.0, 0); if (!bb) return;
      wipe(x, base + '_before', base + '_after', bb, beat, u, alpha); c++;
    });
    return c;
  }
  /* ---------- (9) HIS PIPE (BOSSES 11/9, rule 440(b): the next two of the ladder, each changing the map ITS OWN WAY; ask lines 167, 522;
     records/BOHEMIA_BOSSES_THE_TAP_AND_THE_FILTER_CHANGE_THE_MAP_11_9_26.md). THE POT closed streets; THE TAP's way is his PIPE.
     His rumour: 'His boys sit up on the pipes with crossbows, bro. Don't run at them in the open.' A boss whose row has 'pipe' runs a
     water main from his door toward the nearest town ('length' street blocks of the map's own route), worked out once off his place
     and kept with the game. WHILE HE STANDS his watchers sit on it: every pipe block his crew steps onto, a bolt takes 'bolt' blood
     off one of his men (never the last of it; a man no fight has seen yet is missed), the number rising off the crew. The walk is NOT
     refused (that was THE POT's); it costs. WHEN HE FALLS his watchers come down and the pipe is a line of taps: every pipe block is a
     water main for his own verb (TURN THE WATER ON, his wrench: once each, the batteries the verb pays), painted with a standpipe and
     a trough, and the street posts it. Kept after a reload; WORLD TWO's fallen flag is the truth. */
  var PIPE_LAST = null, RISES = [];
  function pipeRow(n) { var r = row(n); return r && r.pipe ? r : null; }
  function onPipe(x, y) {
    if (!S || !S.pipe) return null; var h = hs();
    for (var k in S.pipe) { var P = S.pipe[k]; if (!P || !P.blocks) continue;
      for (var i = 0; i < P.blocks.length; i++) { var b = P.blocks[i]; if (b.x === x && b.y === y) return { n: k, b: b, open: P.open != null || !!(h && h.boss.fallen[k]) }; } }
    return null;
  }
  function makePipe(r, at) {
    var G = r.pipe, len = Math.max(3, G.length | 0 || 7), bs = bases(), best = null;
    var route = function (a, b) { try { return cityRoute(a[0], a[1], b[0], b[1]); } catch (e) { return null; } };
    for (var tn in bs) { var tb = bs[tn]; if (!tb) continue; var d = null; try { d = townDoor(tb.x | 0, tb.y | 0); } catch (e) {} if (!d) continue;
      if (cheb(d[0], d[1], at[0], at[1]) > 40) continue;
      var p = route(at, d); if (p && (!best || p.length < best.p.length)) best = { tn: tn, p: p }; }
    if (!best) return { at: at.slice(), town: null, blocks: [], open: null, hits: 0, made: day(), draft: true };
    var blocks = [];
    for (var i = 1; i < best.p.length && blocks.length < len; i++) {
      var q = best.p[i]; if (nearTown(q[0], q[1], 1)) break;
      var a = best.p[i - 1], c = best.p[Math.min(best.p.length - 1, i + 1)], dx = Math.abs(c[0] - a[0]), dy = Math.abs(c[1] - a[1]);
      blocks.push({ x: q[0], y: q[1], along: dx >= dy ? 'x' : 'y' });
    }
    return { at: at.slice(), town: best.tn, blocks: blocks, open: null, hits: 0, made: day(), draft: true };
  }
  function pipeTick() {
    if (!DATA || !S || bench() || !N()) return;
    var h = hs(); if (!h) return;
    if (!S.pipe) S.pipe = {};
    DATA.bosses.forEach(function (r) {
      if (!r.pipe || S.pipe[r.n]) return;
      var sg = (h.boss.sign && h.boss.sign.n === r.n) ? h.boss.sign : null, f = h.boss.found[r.n], at = f || (sg && sg.boss);
      if (!at || h.boss.fallen[r.n]) return;
      try { if (!FOG.ready) return; } catch (e) { return; }
      S.pipe[r.n] = makePipe(r, [at.x, at.y]); save();
      LAST.pipe = { n: r.n, blocks: S.pipe[r.n].blocks.length, town: S.pipe[r.n].town, at: Date.now() };
    });
    /* a bolt: the crew stepped onto a pipe block while he stands (each new block once; never at a reload, never in a town or a fight) */
    var me = here(); if (!me) return;
    var k = me[0] + ',' + me[1]; if (PIPE_LAST === null) { PIPE_LAST = k; return; } if (k === PIPE_LAST) return; PIPE_LAST = k;
    var hit = onPipe(me[0], me[1]); if (!hit || hit.open || inTown() || fightUp()) return;
    bolt(pipeRow(hit.n), hit, me);
  }
  function bolt(r, hit, at) {
    if (!r) return null;
    var G = r.pipe, P = S.pipe[hit.n], C = root.BohemiaCondition, hp = G.bolt | 0 || 6, who = null, took = 0;
    try {
      var c = C.get(), keys = Object.keys(c.men || {}).filter(function (k) { var m = c.men[k]; return m && m.hpMax > 0 && (m.hpMax - (m.lostHp || 0)) > hp + 1 && !(c.dead || []).some(function (d) { return d && d.name === k; }); });
      if (keys.length) { var key = keys[(P.hits | 0) % keys.length], m = c.men[key]; took = Math.min(hp, m.hpMax - (m.lostHp || 0) - 1); m.lostHp = (m.lostHp || 0) + took; who = m.shown || key;
        try { root.localStorage.setItem(C.KEY, JSON.stringify(c)); } catch (e) {}
        try { root.dispatchEvent(new CustomEvent('bohemia:condition', { detail: { bolt: took } })); } catch (e) {} }
    } catch (e) { LAST.err = String(e && e.message || e); }
    var first = !(P.hits | 0); P.hits = (P.hits | 0) + 1; save();
    var txt = took ? fill(G.rise || '-{hp} BLOOD', { hp: took }) : (G.rise_miss || 'A BOLT MISSES');
    RISES.push({ x: at[0], y: at[1], t0: performance.now(), txt: txt, col: took ? '#e0705a' : '#e6dcc4' }); tick();
    if (first && G.feed_hit) feed(G.feed_hit.who, fill(G.feed_hit.txt, { where: whereWord(at[0], at[1]) }), 'world');
    if (first && G.say_hit) say(fill(G.say_hit, { hp: took, who: who || 'nobody' }));
    LAST.bolts = (LAST.bolts || []).concat([{ n: hit.n, at: at.slice(), took: took, who: who, t: Date.now() }]).slice(-12);
    root.__BOSS_BOLTS = LAST.bolts;
    return took;
  }
  function say(t) { try { if (typeof travelSay === 'function') travelSay(t); } catch (e) {} }
  function pipeFell(r, h) {
    var G = r.pipe; if (!G || !S) return null;
    if (!S.pipe) S.pipe = {};
    var P = S.pipe[r.n]; if (!P) P = S.pipe[r.n] = { at: null, town: null, blocks: [], open: null, hits: 0, made: day(), draft: true };
    if (P.open != null) return P;
    P.open = day(); MAINS = null;
    var n = P.blocks.length, V = verbRow('open'), pay = (V && V.verb.pay_batteries) | 0, o = { n: n, N: n, town: P.town || 'the town', TOWN: String(P.town || 'the town').toUpperCase(), pay: pay,
      taps: n + (n === 1 ? ' tap' : ' taps'), where: P.at ? whereWord(P.at[0], P.at[1]) : 'that block' };
    o.TAPS = o.taps.toUpperCase();
    if (G.feed && n) feed(G.feed.who, fill(G.feed.txt, o), 'world');
    P.said = n ? fill(G.card, o) : (G.card_none || null);
    save();
    LAST.pipeFell = { n: r.n, taps: n, said: P.said, at: Date.now() };
    try { root.dispatchEvent(new CustomEvent('bohemia:boss-pipe', { detail: { n: r.n, taps: n } })); } catch (e) {}
    return P;
  }
  function pipeCatchUp() {
    if (!DATA || !S || !S.pipe) return; var h = hs(); if (!h) return;
    for (var k in S.pipe) { var P = S.pipe[k]; if (P && P.open == null && h.boss.fallen[k]) { var r = pipeRow(k); if (r) pipeFell(r, h); else { P.open = day(); save(); } } }
  }
  function pipeKey(r, b, open) { return ((r.pipe.pic || 'pipe') + '_' + (b.along === 'x' ? 'x' : 'y')) + (open ? '_after' : '_before'); }
  function pipeDraw(gx, ox, oy, beat) {
    if (!S || !S.pipe) return;
    var h = hs(); LAST.drew.pipe = [];
    for (var k in S.pipe) {
      var P = S.pipe[k], r = pipeRow(k); if (!P || !r) continue;
      var open = P.open != null || !!(h && h.boss.fallen[k]), known = !!(h && h.boss.found[k]), inBeat = !!(BEAT && BEAT.n === k);
      (P.blocks || []).forEach(function (b) {
        var vis = seen(b.x, b.y); if (!vis && !known) return;
        if (inBeat && open) { LAST.drew.pipe.push({ n: k, at: [b.x, b.y], key: 'beat', open: open }); return; }
        var key = pipeKey(r, b, open), q = paint(gx, key, b.x, b.y, ox, oy, beat, 1.0, 0, !vis);
        if (q) { LAST.drew.pipe.push({ n: k, at: [b.x, b.y], key: key, open: open, w: q.w, dark: !vis }); LAST.drew.painted++; }
      });
    }
  }
  function pipeBeat(x, ox, oy, beat, u, alpha) {
    var P = S && S.pipe && BEAT && S.pipe[BEAT.n], r = BEAT && pipeRow(BEAT.n); if (!P || !r) return 0;
    var c = 0;
    (P.blocks || []).forEach(function (b) { var bb = rectOf(pipeKey(r, b, true), b.x, b.y, ox, oy, 1.0, 0); if (!bb) return; wipe(x, pipeKey(r, b, false), pipeKey(r, b, true), bb, beat, u, alpha); c++; });
    return c;
  }
  function risesPaint(x, ox, oy) {   /* a bolt's number rises off his men where they stood under the pipe */
    var now = performance.now(), k = ppc(), f = 'monospace'; try { if (typeof FACE === 'function') f = FACE('casing'); } catch (e) {}
    RISES = RISES.filter(function (q) { return now - q.t0 < 1800; });
    RISES.forEach(function (q) { var t = now - q.t0, p = iso(q.x, q.y, ox, oy), a = t < 1200 ? 1 : Math.max(0, (1800 - t) / 600), ty = Math.round(p.sy - TH * 0.6 - 18 * k - Math.min(1, t / 1400) * 30 * k);
      x.save(); x.globalAlpha = a; x.font = '400 ' + Math.round(12 * k) + 'px ' + f; x.textAlign = 'center'; x.lineJoin = 'round'; x.lineWidth = Math.round(4 * k); x.strokeStyle = 'rgba(10,8,6,0.9)';
      x.strokeText(q.txt, Math.round(p.sx), ty); x.fillStyle = q.col; x.fillText(q.txt, Math.round(p.sx), ty); x.restore(); q.drawn = [Math.round(p.sx), ty]; });
    if (RISES.length) LAST.rise = RISES.map(function (q) { return { txt: q.txt, drawn: q.drawn || null }; });
  }

  /* ---------- (10) HIS MACHINES (BOSSES 11/9, rule 440(b): the next two of the ladder, each changing the map ITS OWN WAY; ask lines 167,
     522; records/BOHEMIA_BOSSES_THE_TAP_AND_THE_FILTER_CHANGE_THE_MAP_11_9_26.md). THE POT closed streets, THE TAP's pipe costs blood;
     THE FILTER's way is his MACHINES. His row's lesson: 'He keeps the plant's robots walking. Kill the keeper and every machine of his
     drops where it stands.' A boss whose row has 'machines' stands 'count' of the plant's old robots on street blocks 'near' to 'far'
     blocks round his door (never beside a town, never on the sign's block, at least 3 apart), worked out once off his place and kept.
     WHILE HE STANDS a machine is a fight: the crew stepping beside one is met by it through RUN's one door, its card first (ENGAGE or
     FALL BACK), the 'band' of his robots on the board; win and that one drops where it stood. WHEN HE FALLS every machine still
     standing drops where it stands at once (his lesson, made true on the map). A dropped machine stays on the map as a wreck; the crew
     stepping onto it strips it once for 'tape' (the company's supplies: tape is what mends armour). Kept after a reload. */
  var MFIGHT = null, MLAST = null;
  function machineRow(n) { var r = row(n); return r && r.machines ? r : null; }
  function machineDownFor(k, q) { var h = hs(); return q.down != null || !!(h && h.boss.fallen[k]); }
  function machineAt(x, y) {
    if (!S || !S.machines) return null;
    for (var k in S.machines) { var M = S.machines[k]; if (!M || !M.list) continue; for (var i = 0; i < M.list.length; i++) { var q = M.list[i]; if (q.x === x && q.y === y) return { n: k, i: i, q: q, down: machineDownFor(k, q) }; } }
    return null;
  }
  function machineNear(x, y) {
    if (!S || !S.machines) return null;
    for (var k in S.machines) { var M = S.machines[k]; if (!M || !M.list) continue; for (var i = 0; i < M.list.length; i++) { var q = M.list[i]; if (!machineDownFor(k, q) && cheb(q.x, q.y, x, y) <= 1) return { n: k, i: i, q: q }; } }
    return null;
  }
  function makeMachines(r, at, from) {
    var G = r.machines, cnt = Math.max(1, G.count | 0 || 3), r0 = Math.max(2, G.near | 0 || 3), r1 = Math.max(r0, G.far | 0 || 6), c = [];
    var rng = (function (s) { s = s >>> 0 || 1; return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; })((S.seed ^ (at[0] * 2654435761) ^ (at[1] * 40503) ^ 0x5f3759df) >>> 0);
    for (var dy = -r1; dy <= r1; dy++) for (var dx = -r1; dx <= r1; dx++) {
      var d = Math.max(Math.abs(dx), Math.abs(dy)); if (d < r0 || d > r1) continue;
      var x = at[0] + dx, y = at[1] + dy; if (!walk(x, y) || nearTown(x, y, 2) || shutAt(x, y) || onPipe(x, y)) continue;
      if (from && cheb(x, y, from[0], from[1]) <= 1) continue;
      c.push({ x: x, y: y, k: rng() });
    }
    c.sort(function (a, b) { return a.k - b.k; });
    var list = [];
    for (var i = 0; i < c.length && list.length < cnt; i++) { var p = c[i]; if (list.some(function (q) { return cheb(q.x, q.y, p.x, p.y) < 3; })) continue; list.push({ x: p.x, y: p.y, down: null, how: null, stripped: null }); }
    return { at: at.slice(), list: list, made: day(), draft: true };
  }
  function machinesTick() {
    if (!DATA || !S || bench() || !N()) return;
    var h = hs(); if (!h) return;
    if (!S.machines) S.machines = {};
    DATA.bosses.forEach(function (r) {
      if (!r.machines || S.machines[r.n]) return;
      var sg = (h.boss.sign && h.boss.sign.n === r.n) ? h.boss.sign : null, f = h.boss.found[r.n], at = f || (sg && sg.boss);
      if (!at || h.boss.fallen[r.n]) return;
      try { if (!FOG.ready) return; } catch (e) { return; }
      S.machines[r.n] = makeMachines(r, [at.x, at.y], sg ? [sg.x, sg.y] : here()); save();
      LAST.machines = { n: r.n, count: S.machines[r.n].list.length, at: Date.now() };
    });
    if (MFIGHT && (root.__MEET_FELL_BACK | 0) > MFIGHT.fb) MFIGHT = null;   /* FALL BACK: no fight, the machine still stands */
    var me = here(); if (!me) return;
    /* a machine stands its post again once the crew is well away from it */
    for (var k in S.machines) { var M = S.machines[k]; if (M && M.list) M.list.forEach(function (q) { if (q.armed === false && cheb(q.x, q.y, me[0], me[1]) >= 3) q.armed = true; }); }
    if (inTown() || fightUp() || MFIGHT) return;
    try { if (MEET && MEET.up) return; } catch (e) {}
    try { if (root.navigator && root.navigator.webdriver && !root.__BOSSES_TALK) return; } catch (e) {}   /* other lanes' walks never meet his machines */
    /* the crew on a dropped machine strips it, once */
    var w = machineAt(me[0], me[1]); if (w && w.down && !w.q.stripped) strip(w, me);
    var near = machineNear(me[0], me[1]); if (near && near.q.armed !== false) { near.q.armed = false; machineFight(near); }
  }
  function machineFight(near) {
    var r = machineRow(near.n), G = r.machines, band = (G.band || ['wiederganger', 'wiederganger']).slice(), at = here() || [near.q.x, near.q.y];
    var party = { band: band, count: band.length, rolled: true, faction: 'brigands', what: G.crew_word || G.name || 'HIS MACHINES', days: 1, difficulty: 1 };
    try { party.word = partyWord(band.length); } catch (e) {}
    var pkg = 1; try { if (LOOP.start && LOOP.start.pkg != null) pkg = LOOP.start.pkg; } catch (e) {}
    var msg = { type: 'BOHEMIA_CITY_ENCOUNTER', label: G.name || 'HIS MACHINE', faction: null, draft: true, packageId: pkg, roster: band.map(function () { return { arch: 'human' }; }),
      party: party, street: true, why: 'machine:' + near.n + ':' + near.i, at: { gx: at[0] | 0, gy: at[1] | 0 } };
    MFIGHT = { n: near.n, i: near.i, fb: root.__MEET_FELL_BACK | 0, t: Date.now() };
    var ok = false; try { ok = (typeof meetWalk === 'function') ? meetWalk(function () { return cityHandOver(msg); }) : cityHandOver(msg); } catch (e) { ok = false; }
    if (!ok) MFIGHT = null;
    LAST.machineFight = { n: near.n, i: near.i, at: [near.q.x, near.q.y], handed: !!ok, t: Date.now() };
    root.__BOSS_MACHINE_FIGHT = LAST.machineFight;
    return ok;
  }
  function machineEnded(o) {
    var F = MFIGHT; if (!F) return; MFIGHT = null;
    var won = !!(o && (o.victory || o.result === 'win')) && !((o && o.alive) | 0);
    LAST.machineEnd = { n: F.n, i: F.i, won: won, t: Date.now() };
    if (!won) return;
    var M = S.machines && S.machines[F.n], q = M && M.list[F.i]; if (!q || q.down != null) return;
    q.down = day(); q.how = 'fight'; save();
    try { if (typeof render === 'function') render(); } catch (e) {}
  }
  function strip(w, at) {
    var r = machineRow(w.n), G = r.machines, n = G.tape | 0 || 4, got = 0;
    w.q.stripped = day(); save();
    try { var K = 'bohemia.supplies.v1', s = JSON.parse(root.localStorage.getItem(K) || 'null') || {}; s.tape = (s.tape | 0) + n; root.localStorage.setItem(K, JSON.stringify(s)); got = n; } catch (e) {}
    var M = S.machines[w.n], first = M.list.filter(function (q) { return q.stripped != null; }).length === 1;
    RISES.push({ x: at[0], y: at[1], t0: performance.now(), txt: fill(G.rise_strip || '+{tape} TAPE', { tape: got }), col: '#e6c46a' }); tick();
    if (first && G.feed_strip) feed(G.feed_strip.who, fill(G.feed_strip.txt, { tape: got, where: whereWord(at[0], at[1]) }), 'mine');
    LAST.strips = (LAST.strips || []).concat([{ n: w.n, i: w.i, at: at.slice(), tape: got, t: Date.now() }]).slice(-12);
    root.__BOSS_STRIPS = LAST.strips;
    return got;
  }
  function machinesFell(r, h) {
    var G = r.machines; if (!G || !S) return null;
    if (!S.machines) S.machines = {};
    var M = S.machines[r.n]; if (!M) M = S.machines[r.n] = { at: null, list: [], made: day(), draft: true };
    if (M.fell != null) return M;
    M.fell = day(); var dropped = 0;
    M.list.forEach(function (q) { if (q.down == null) { q.down = day(); q.how = 'keeper'; dropped++; } });
    var n = M.list.length, o = { n: n, dropped: dropped, wrecks: n + (n === 1 ? ' wreck' : ' wrecks'), tape: G.tape | 0 || 4, where: M.at ? whereWord(M.at[0], M.at[1]) : 'that block' };
    o.WRECKS = o.wrecks.toUpperCase();
    if (G.feed && n) feed(G.feed.who, fill(G.feed.txt, o), 'world');
    M.said = n ? fill(G.card, o) : (G.card_none || null);
    save();
    LAST.machinesFell = { n: r.n, dropped: dropped, wrecks: n, said: M.said, at: Date.now() };
    try { root.dispatchEvent(new CustomEvent('bohemia:boss-machines', { detail: { n: r.n, dropped: dropped } })); } catch (e) {}
    return M;
  }
  function machinesCatchUp() {
    if (!DATA || !S || !S.machines) return; var h = hs(); if (!h) return;
    for (var k in S.machines) { var M = S.machines[k]; if (M && M.fell == null && h.boss.fallen[k]) { var r = machineRow(k); if (r) machinesFell(r, h); } }
  }
  function machineKey(r, down) { return (r.machines.pic || 'machine') + (down ? '_after' : '_before'); }
  function machinesDraw(gx, ox, oy, beat) {
    if (!S || !S.machines) return;
    var h = hs(); LAST.drew.machines = [];
    for (var k in S.machines) {
      var M = S.machines[k], r = machineRow(k); if (!M || !r) continue;
      var known = !!(h && h.boss.found[k]), inBeat = !!(BEAT && BEAT.n === k);
      M.list.forEach(function (q, i) {
        var vis = seen(q.x, q.y); if (!vis && !known) return;
        var down = machineDownFor(k, q);
        if (inBeat && q.how === 'keeper') { LAST.drew.machines.push({ n: k, i: i, at: [q.x, q.y], key: 'beat', down: down }); return; }
        var key = machineKey(r, down);
        if (q.stripped != null) gx.globalAlpha = 0.72;
        var b = paint(gx, key, q.x, q.y, ox, oy, beat, 0.9, 0, !vis);
        gx.globalAlpha = 1;
        if (b) { LAST.drew.machines.push({ n: k, i: i, at: [q.x, q.y], key: key, down: down, stripped: q.stripped != null, w: b.w, dark: !vis }); LAST.drew.painted++; }
      });
    }
  }
  function machinesBeat(x, ox, oy, beat, u, alpha) {
    var M = S && S.machines && BEAT && S.machines[BEAT.n], r = BEAT && machineRow(BEAT.n); if (!M || !r) return 0;
    var c = 0;
    M.list.forEach(function (q) { if (q.how !== 'keeper') return; var bb = rectOf(machineKey(r, true), q.x, q.y, ox, oy, 0.9, 0); if (!bb) return; wipe(x, machineKey(r, false), machineKey(r, true), bb, beat, u, alpha); c++; });
    return c;
  }

  /* ---------- (11) HIS DARK (BOSSES 11/10, rules 443(a), 441: the ladder's next three, each changing the map ITS OWN WAY; ask lines 167,
     522; records/BOHEMIA_BOSSES_THE_NEXT_THREE_CHANGE_THE_MAP_11_10_26.md). THE POT shut streets, THE TAP's pipe costs blood, THE
     FILTER's machines fight; THE BURN's way is HIS DARK. His ladder row: he holds 'fuel, and who gets warm', and the lock is 'night ends
     your day'. A boss whose row has 'dark' stands 'drums' of his stokers' fire drums on street blocks 'near' to 'far' round his door
     (never beside a town, at least 3 apart), worked out once off his place and kept. WHILE HE STANDS his side of the valley ('radius'
     blocks round his door) has no fire but his: at night the crew sees 'sight' block there (the map's own fog asks dark(), marked
     __THE_BURNS_DARK__ in slices/BOHEMIA_CITY_WORLD.html, the way it asks lit()), the night halving everywhere else, and the map paints
     his side black at night with only his drums burning. Not a wall, not a toll, not a fight: the night itself is his. WHEN HE FALLS
     his stokers walk off and the drums burn for anybody: each is a fire of yours (lit(): at night, the verb's 'light_blocks' round it,
     you see like in the day), painted with the neighbours warming their hands. Kept after a reload; WORLD TWO's fallen flag is the truth. */
  var DARK_LAST = null;
  function darkRow(n) { var r = row(n); return r && r.dark ? r : null; }
  function darkDown(k, D) { var h = hs(); return D.fell != null || !!(h && h.boss.fallen[k]); }
  function spots(at, r0, r1, cnt, from, salt) {   /* street blocks r0..r1 round his door, never by a town or on another boss's piece, 3 apart */
    var rng = (function (s) { s = s >>> 0 || 1; return function () { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; }; })((S.seed ^ (at[0] * 2654435761) ^ (at[1] * 40503) ^ salt) >>> 0);
    var c = [];
    for (var dy = -r1; dy <= r1; dy++) for (var dx = -r1; dx <= r1; dx++) {
      var d = Math.max(Math.abs(dx), Math.abs(dy)); if (d < r0 || d > r1) continue;
      var x = at[0] + dx, y = at[1] + dy; if (!walk(x, y) || nearTown(x, y, 2) || shutAt(x, y) || onPipe(x, y) || machineAt(x, y)) continue;
      if (from && cheb(x, y, from[0], from[1]) <= 1) continue;
      c.push({ x: x, y: y, k: rng() });
    }
    c.sort(function (a, b) { return a.k - b.k; });
    var list = [];
    for (var i = 0; i < c.length && list.length < cnt; i++) { var p = c[i]; if (list.some(function (q) { return cheb(q.x, q.y, p.x, p.y) < 3; })) continue; list.push({ x: p.x, y: p.y }); }
    return list;
  }
  function makeDark(r, at, from) {
    var G = r.dark, R = Math.max(2, G.radius | 0 || 5);
    return { at: at.slice(), radius: R, drums: spots(at, Math.max(1, G.near | 0 || 2), Math.max(2, G.far | 0 || 4), Math.max(1, G.drums | 0 || 4), from, 0x2545f491), fell: null, told: null, made: day(), draft: true };
  }
  /* his dark at (x, y): the sight the crew has there at night while he stands (0 where it is not his) */
  function darkAt(x, y) {
    if (!S || !S.dark || bench()) return 0;
    for (var k in S.dark) { var D = S.dark[k], r = darkRow(k); if (!D || !D.at || darkDown(k, D)) continue;
      if (cheb(D.at[0], D.at[1], x, y) <= D.radius && !nearTown(x, y, 1)) return Math.max(1, (r && r.dark.sight) | 0 || 1); }
    return 0;
  }
  /* once he is down, his drums are fires of yours: the blocks round each are lit at night */
  function warmAt(x, y) {
    if (!S || !S.dark) return false; var V = verbRow('burn'), lb = (V && V.verb.light_blocks) || 2;
    for (var k in S.dark) { var D = S.dark[k]; if (!D || !D.drums || !darkDown(k, D)) continue;
      for (var i = 0; i < D.drums.length; i++) if (cheb(D.drums[i].x, D.drums[i].y, x, y) <= lb) return true; }
    return false;
  }
  function darkTick() {
    if (!DATA || !S || bench() || !N()) return;
    var h = hs(); if (!h) return;
    if (!S.dark) S.dark = {};
    DATA.bosses.forEach(function (r) {
      if (!r.dark || S.dark[r.n]) return;
      var sg = (h.boss.sign && h.boss.sign.n === r.n) ? h.boss.sign : null, f = h.boss.found[r.n], at = f || (sg && sg.boss);
      if (!at || h.boss.fallen[r.n]) return;
      try { if (!FOG.ready) return; } catch (e) { return; }
      S.dark[r.n] = makeDark(r, [at.x, at.y], sg ? [sg.x, sg.y] : here()); save();
      LAST.dark = { n: r.n, drums: S.dark[r.n].drums.length, at: Date.now() };
    });
    /* the first night the crew walks into his dark, one of yours says it and the old woman posts it (once) */
    var me = here(); if (!me) return;
    var k = me[0] + ',' + me[1] + (night() ? 'n' : 'd'); if (DARK_LAST === null) { DARK_LAST = k; return; } if (k === DARK_LAST) return; DARK_LAST = k;
    if (!night() || inTown() || fightUp() || !darkAt(me[0], me[1])) return;
    for (var n in S.dark) { var D = S.dark[n], r = darkRow(n); if (!D || !r || D.told != null || darkDown(n, D) || cheb(D.at[0], D.at[1], me[0], me[1]) > D.radius) continue;
      D.told = day(); save();
      if (r.dark.say) say(r.dark.say);
      if (r.dark.feed_dark) feed(r.dark.feed_dark.who, fill(r.dark.feed_dark.txt, { where: whereWord(me[0], me[1]) }), 'world');
      RISES.push({ x: me[0], y: me[1], t0: performance.now(), txt: r.dark.rise || 'HIS DARK', col: '#e6dcc4' }); tick();
      LAST.darkTold = { n: n, at: me.slice(), sight: darkAt(me[0], me[1]), t: Date.now() }; root.__BOSS_DARK_TOLD = LAST.darkTold;
    }
  }
  function darkFell(r, h) {
    var G = r.dark; if (!G || !S) return null;
    if (!S.dark) S.dark = {};
    var D = S.dark[r.n]; if (!D) D = S.dark[r.n] = { at: null, radius: G.radius | 0 || 5, drums: [], fell: null, told: null, made: day(), draft: true };
    if (D.fell != null) return D;
    D.fell = day();
    var n = D.drums.length, V = verbRow('burn'), o = { n: n, drums: n + (n === 1 ? ' drum' : ' drums'), light: (V && V.verb.light_blocks) || 2, where: D.at ? whereWord(D.at[0], D.at[1]) : 'that block' };
    o.DRUMS = o.drums.toUpperCase();
    if (G.feed && n) feed(G.feed.who, fill(G.feed.txt, o), 'world');
    D.said = n ? fill(G.card, o) : (G.card_none || null);
    save();
    LAST.darkFell = { n: r.n, drums: n, said: D.said, at: Date.now() };
    try { root.dispatchEvent(new CustomEvent('bohemia:boss-dark', { detail: { n: r.n, drums: n } })); } catch (e) {}
    return D;
  }
  function darkCatchUp() {
    if (!DATA || !S || !S.dark) return; var h = hs(); if (!h) return;
    for (var k in S.dark) { var D = S.dark[k]; if (D && D.fell == null && h.boss.fallen[k]) { var r = darkRow(k); if (r) darkFell(r, h); } }
  }
  function drumKey(r, down) { return (r.dark.pic || 'drum') + (down ? '_after' : '_before'); }
  function diamond(gx, x, y, ox, oy) { var p = iso(x, y, ox, oy); gx.beginPath(); gx.moveTo(p.sx, p.sy); gx.lineTo(p.sx + TW / 2, p.sy + TH / 2); gx.lineTo(p.sx, p.sy + TH); gx.lineTo(p.sx - TW / 2, p.sy + TH / 2); gx.closePath(); }
  function darkDraw(gx, ox, oy, beat) {
    if (!S || !S.dark) return;
    var h = hs(), nt = night(); LAST.drew.drums = []; LAST.drew.dark = 0; LAST.drew.warm = 0;
    for (var k in S.dark) {
      var D = S.dark[k], r = darkRow(k); if (!D || !r || !D.at) continue;
      var down = darkDown(k, D), known = !!(h && h.boss.found[k]), inBeat = !!(BEAT && BEAT.n === k);
      /* at night his side is black, only his drums burning (the blocks round a drum keep the drum's own light) */
      /* the moment he falls the dark lifts on the kill's tape, not before it (the VOTE card's BEFORE showed no dark, measured 11/10) */
      var lift = 0, owed = down && beatOwed(k); if (inBeat && down && BEAT) { var M = BEAT_MS, t = performance.now() - BEAT.t0; lift = Math.max(0, Math.min(1, (t - M.glide - M.hold) / M.wipe)); }
      if (nt && (!down || owed || (inBeat && lift < 1))) { gx.save(); gx.fillStyle = 'rgba(3,2,2,' + (0.62 * (1 - lift)).toFixed(3) + ')';
        for (var dy = -D.radius; dy <= D.radius; dy++) for (var dx = -D.radius; dx <= D.radius; dx++) { var x = D.at[0] + dx, y = D.at[1] + dy;
          if (nearTown(x, y, 1) || D.drums.some(function (q) { return q.x === x && q.y === y; })) continue; diamond(gx, x, y, ox, oy); gx.fill(); LAST.drew.dark++; }
        gx.restore(); }
      D.drums.forEach(function (q, i) {
        var vis = seen(q.x, q.y); if (!vis && !known && !nt) return;   /* at night a fire shows through the dark (the only light on his side) */
        if (nt) { var p = iso(q.x, q.y, ox, oy), rr = TW * (down ? 1.6 : 0.8); gx.save(); var gr = gx.createRadialGradient(p.sx, p.sy + TH / 2, 0, p.sx, p.sy + TH / 2, rr);
          gr.addColorStop(0, down ? 'rgba(255,170,80,0.42)' : 'rgba(255,140,50,0.34)'); gr.addColorStop(1, 'rgba(255,140,50,0)'); gx.fillStyle = gr; gx.fillRect(p.sx - rr, p.sy + TH / 2 - rr, rr * 2, rr * 2); gx.restore();
          if (down) LAST.drew.warm++; }
        if (inBeat && down) { LAST.drew.drums.push({ n: k, i: i, at: [q.x, q.y], key: 'beat', down: down }); return; }
        var key = drumKey(r, down), b = paint(gx, key, q.x, q.y, ox, oy, beat, 0.95, 0, !vis && !nt);
        if (b) { LAST.drew.drums.push({ n: k, i: i, at: [q.x, q.y], key: key, down: down, w: b.w, dark: !vis }); LAST.drew.painted++; }
      });
    }
  }
  function darkBeat(x, ox, oy, beat, u, alpha) {
    var D = S && S.dark && BEAT && S.dark[BEAT.n], r = BEAT && darkRow(BEAT.n); if (!D || !r) return 0;
    var c = 0;
    D.drums.forEach(function (q) { var bb = rectOf(drumKey(r, true), q.x, q.y, ox, oy, 0.95, 0); if (!bb) return; wipe(x, drumKey(r, false), drumKey(r, true), bb, beat, u, alpha); c++; });
    return c;
  }

  /* ---------- (12) HIS HOLE (BOSSES 11/10, rules 443(a), 441; ask lines 167, 522; records/BOHEMIA_BOSSES_THE_NEXT_THREE_CHANGE_THE_MAP_11_10_26.md).
     THE SURVEYOR's way is HIS HOLE IN THE MAP. His ladder row: he holds 'the last complete map', the lock 'you only know what you have
     walked'; he sells it a piece at a time, so his chainmen take every street sign down on his side (Britain did it in 1940 so an
     enemy could not find his way). A boss whose row has 'hole' stands 'posts' of his cut sign poles on street blocks 'near' to 'far'
     round his door, worked out once off his place and kept. WHILE HE STANDS the map forgets his side ('radius' blocks round his door,
     never a town's ground): every block of it the crew cannot see from where it stands goes back under the static, the map's own fog
     (RUN's FOG: its bits and its mask written here the way its fogReveal writes them, never its generation). Walk in and you see it;
     walk out and it is gone. Not a wall, not a toll, not a fight, not the night: the map itself. WHEN HE FALLS his map is copied: his
     side comes out of the fog for good, the signs go back up (painted), and his chain lines run out from his door to every town in
     the valley (the map's own route to each, out of the fog, a town at a time so no frame waits). Kept after a reload. */
  var HOLE_LAST = null, LINES_T = 0;
  function holeRow(n) { var r = row(n); return r && r.hole ? r : null; }
  function holeDown(k, H) { var h = hs(); return H.fell != null || !!(h && h.boss.fallen[k]); }
  function makeHole(r, at, from) {
    var G = r.hole, R = Math.max(2, G.radius | 0 || 5);
    return { at: at.slice(), radius: R, posts: spots(at, Math.max(1, G.near | 0 || 2), Math.max(2, G.far | 0 || R), Math.max(1, G.posts | 0 || 4), from, 0x68e31da4), forgot: 0, fell: null, told: null, lines: null, made: day(), draft: true };
  }
  function inHole(H, x, y) { return !!H.at && cheb(H.at[0], H.at[1], x, y) <= H.radius && !nearTown(x, y, 2); }
  function fogR() { try { return fogRadius(); } catch (e) { return 6; } }
  /* one block back under the static: its bit and its square of the fog's mask (the mask is what the map's fog draws) */
  function fogForget(x, y) {
    var F; try { F = FOG; } catch (e) { return false; }
    if (!F || !F.on || !F.ready || F.all || !F.seen || !F.cv) return false;
    var k = -1; try { k = fogIdx(x, y); } catch (e) { return false; } if (k < 0 || !F.seen[k]) return false;
    F.seen[k] = 0;
    try { var c = F.cv.getContext('2d'), Sx = F.S; c.save(); c.globalCompositeOperation = 'source-over'; c.fillStyle = 'rgba(12,10,9,0.965)'; c.fillRect((x + F.K) * Sx, (y + F.K) * Sx, Sx, Sx); c.restore(); } catch (e) {}
    F.dirty = true; return true;
  }
  function holeForget(me) {
    var n = 0, r = fogR() + 1;
    for (var k in S.hole) { var H = S.hole[k]; if (!H || !H.at || holeDown(k, H)) continue;
      for (var dy = -H.radius; dy <= H.radius; dy++) for (var dx = -H.radius; dx <= H.radius; dx++) { var x = H.at[0] + dx, y = H.at[1] + dy;
        if (!inHole(H, x, y)) continue; var ex = x - me[0], ey = y - me[1]; if (ex * ex + ey * ey <= r * r) continue;   /* what the crew sees from here stays */
        if (fogForget(x, y)) { n++; H.forgot = (H.forgot | 0) + 1; } } }
    if (n) { save(); try { fogSaveSoon(); } catch (e) {} }
    return n;
  }
  function holeTick() {
    if (!DATA || !S || bench() || !N()) return;
    var h = hs(); if (!h) return;
    if (!S.hole) S.hole = {};
    DATA.bosses.forEach(function (r) {
      if (!r.hole || S.hole[r.n]) return;
      var sg = (h.boss.sign && h.boss.sign.n === r.n) ? h.boss.sign : null, f = h.boss.found[r.n], at = f || (sg && sg.boss);
      if (!at || h.boss.fallen[r.n]) return;
      try { if (!FOG.ready) return; } catch (e) { return; }
      S.hole[r.n] = makeHole(r, [at.x, at.y], sg ? [sg.x, sg.y] : here()); save(); HOLE_LAST = null;
      LAST.hole = { n: r.n, posts: S.hole[r.n].posts.length, at: Date.now() };
    });
    holeLift();
    var me = here(); if (!me) return;
    var key = me[0] + ',' + me[1] + ':' + fogR(); if (key === HOLE_LAST) return; HOLE_LAST = key;
    if (fightUp()) return;
    var n = holeForget(me);
    if (!n) return;
    LAST.forgot = { n: n, at: me.slice(), t: Date.now() }; root.__BOSS_FORGOT = LAST.forgot;
    var hh = hs();
    for (var k in S.hole) { var H = S.hole[k], r = holeRow(k); if (!H || !r || H.told != null || holeDown(k, H) || !(hh && hh.boss.found[k]) || cheb(H.at[0], H.at[1], me[0], me[1]) > H.radius + fogR() + 3) continue;   /* said once he is known (the man at the bar first) */
      H.told = day(); save();
      if (r.hole.say) say(r.hole.say);
      if (r.hole.feed_hole) feed(r.hole.feed_hole.who, fill(r.hole.feed_hole.txt, { where: whereWord(H.at[0], H.at[1]) }), 'world');
      RISES.push({ x: me[0], y: me[1], t0: performance.now(), txt: r.hole.rise || 'THE MAP FORGOT HIS SIDE', col: '#e6dcc4' }); tick();
      LAST.holeTold = { n: k, at: me.slice(), forgot: n, t: Date.now() }; root.__BOSS_HOLE_TOLD = LAST.holeTold;
    }
  }
  /* his side comes out of the fog when the kill's tape tracks in (the wipe), or at once with no beat (a reload, a fall off the map) */
  function holeLift() {
    if (!S || !S.hole) return;
    for (var k in S.hole) { var H = S.hole[k]; if (!H || !H.lift || !H.at) continue;
      if (beatOwed(k)) continue;   /* the fall's camera has not played yet: his side lifts on its tape */
      try { if (!FOG.ready) continue; } catch (e) { continue; }
      H.lift = false;
      for (var dy = -H.radius; dy <= H.radius; dy++) for (var dx = -H.radius; dx <= H.radius; dx++) { var x = H.at[0] + dx, y = H.at[1] + dy; if (inHole(H, x, y)) { try { fogReveal(x, y, 1.0); } catch (e) {} } }
      save(); try { fogSave(); } catch (e) {}
      if (!LINES_T && H.lines && H.lines.towns.length) { var kk = k; LINES_T = setTimeout(function () { try { holeLines(kk); } catch (e) { LINES_T = 0; } }, 400); }
      LAST.holeLift = { n: k, at: Date.now() };
    }
  }
  /* his chain lines: the map's own route from his door to every town, out of the fog, one town a step (no frame waits on twenty routes) */
  function holeLines(k) {
    var H = S.hole && S.hole[k]; if (!H || !H.lines || H.lines.done >= H.lines.towns.length) { LINES_T = 0; return; }
    var t = H.lines.towns[H.lines.done], d = null; try { d = townDoor(t[1], t[2]); } catch (e) {}
    var p = null; if (d) { try { p = cityRoute(H.at[0], H.at[1], d[0], d[1]); } catch (e) { p = null; } }
    var got = 0, path = H.lines.path || (H.lines.path = []);
    (p || []).forEach(function (q) { var was = seen(q[0], q[1]); try { fogReveal(q[0], q[1], 1.2); } catch (e) {} if (!was && seen(q[0], q[1])) got++; path.push(q[0], q[1]); });
    if (d) { try { fogReveal(d[0], d[1], 1.6); } catch (e) {} H.lines.doors = (H.lines.doors || []).concat([d[0], d[1]]); }   /* the line ends at the town itself (measured 11/10: the route stops beside a door) */
    H.lines.done++; H.lines.blocks = (H.lines.blocks | 0) + got; if (p) H.lines.drawn = (H.lines.drawn | 0) + 1;
    save();
    if (H.lines.done >= H.lines.towns.length) { try { fogSave(); } catch (e) {} LINES_T = 0; LAST.lines = JSON.parse(JSON.stringify(H.lines)); root.__BOSS_LINES = LAST.lines; try { render(); } catch (e) {} return; }
    LINES_T = setTimeout(function () { try { holeLines(k); } catch (e) { LAST.err = String(e && e.message || e); LINES_T = 0; } }, 90);
  }
  function holeFell(r, h) {
    var G = r.hole; if (!G || !S) return null;
    if (!S.hole) S.hole = {};
    var H = S.hole[r.n]; if (!H) H = S.hole[r.n] = { at: null, radius: G.radius | 0 || 5, posts: [], forgot: 0, fell: null, told: null, lines: null, made: day(), draft: true };
    if (H.fell != null) return H;
    H.fell = day();
    var got = 0;   /* how much of his side comes back (counted now, lifted on the kill's tape: holeLift) */
    if (H.at) for (var dy = -H.radius; dy <= H.radius; dy++) for (var dx = -H.radius; dx <= H.radius; dx++) { var x = H.at[0] + dx, y = H.at[1] + dy; if (inHole(H, x, y) && !seen(x, y)) got++; }
    H.lift = true;
    var bs = bases(), towns = [];
    for (var tn in bs) { var b = bs[tn]; if (b) towns.push([tn, b.x | 0, b.y | 0]); }
    if (H.at) towns.sort(function (a, b) { return cheb(a[1], a[2], H.at[0], H.at[1]) - cheb(b[1], b[2], H.at[0], H.at[1]) || (a[0] < b[0] ? -1 : 1); });
    H.lines = { towns: H.at ? towns : [], done: 0, blocks: 0, drawn: 0 }; H.back = got;
    var n = H.lines.towns.length, o = { n: n, towns: n + (n === 1 ? ' town' : ' towns'), blocks: got, where: H.at ? whereWord(H.at[0], H.at[1]) : 'that block' };
    o.TOWNS = o.towns.toUpperCase();
    if (G.feed && H.at) feed(G.feed.who, fill(G.feed.txt, o), 'world');
    H.said = H.at ? fill(G.card, o) : (G.card_none || null);
    save();
    LAST.holeFell = { n: r.n, back: got, towns: n, said: H.said, at: Date.now() };
    try { root.dispatchEvent(new CustomEvent('bohemia:boss-hole', { detail: { n: r.n, back: got, towns: n } })); } catch (e) {}
    return H;
  }
  function holeCatchUp() {
    if (!DATA || !S || !S.hole) return; var h = hs(); if (!h) return;
    for (var k in S.hole) { var H = S.hole[k]; if (!H) continue;
      if (H.fell == null && h.boss.fallen[k]) { var r = holeRow(k); if (r) { try { if (FOG.ready) holeFell(r, h); } catch (e) {} } }
      else if (H.fell != null && !H.lift && H.lines && H.lines.done < H.lines.towns.length && !LINES_T) { try { if (FOG.ready) LINES_T = setTimeout(function () { try { holeLines(k); } catch (e) { LINES_T = 0; } }, 400); } catch (e) {} } }   /* a reload in the middle of his lines goes on drawing them */
  }
  function postKey(r, down) { return (r.hole.pic || 'signpost') + (down ? '_after' : '_before'); }
  /* the hole itself, so it reads at a glance (measured 11/10 on the VOTE card: under the map's own faint fog his forgotten side looked
     like any unseen block): a dead signal over every block of his side the map forgot, while he stands; it lifts with his side */
  var SNOW = null;
  function snow(gx) {
    if (SNOW) return SNOW;
    var c = document.createElement('canvas'); c.width = c.height = 48; var x = c.getContext('2d'), im = x.createImageData(48, 48), d = im.data, q = 99173;
    for (var j = 0; j < 48; j++) for (var i = 0; i < 48; i++) { q = (q * 1103515245 + 12345) >>> 0; var v = 70 + ((q >>> 24) & 127) - ((j % 3) ? 0 : 40), k2 = (j * 48 + i) * 4; d[k2] = v; d[k2 + 1] = v; d[k2 + 2] = v - 6; d[k2 + 3] = 255; }
    x.putImageData(im, 0, 0); SNOW = gx.createPattern(c, 'repeat'); return SNOW;
  }
  function holeDraw(gx, ox, oy, beat) {
    if (!S || !S.hole) return;
    var h = hs(); LAST.drew.posts = []; LAST.drew.holeSnow = 0;
    for (var k0 in S.hole) {
      var H0 = S.hole[k0]; if (!H0 || !H0.at) continue;
      if (holeDown(k0, H0) && !H0.lift) continue;   /* lifted: gone (it lifts on his camera's tape) */
      if (!(h && h.boss.found[k0])) continue;   /* only once he is known (the static would give his place away before the man at the bar) */
      gx.save(); gx.globalAlpha = 0.5 + ((beat | 0) % 2) * 0.06; gx.fillStyle = snow(gx);
      for (var dy0 = -H0.radius; dy0 <= H0.radius; dy0++) for (var dx0 = -H0.radius; dx0 <= H0.radius; dx0++) { var x0 = H0.at[0] + dx0, y0 = H0.at[1] + dy0;
        if (!inHole(H0, x0, y0) || seen(x0, y0)) continue; diamond(gx, x0, y0, ox, oy); gx.fill(); LAST.drew.holeSnow++; }
      gx.restore();
    }
    for (var k in S.hole) {
      var H = S.hole[k], r = holeRow(k); if (!H || !r || !H.at) continue;
      var down = holeDown(k, H), known = !!(h && h.boss.found[k]), inBeat = !!(BEAT && BEAT.n === k);
      H.posts.forEach(function (q, i) {
        var vis = seen(q.x, q.y); if (!vis && !known) return;
        if (inBeat && down) { LAST.drew.posts.push({ n: k, i: i, at: [q.x, q.y], key: 'beat', down: down }); return; }
        var key = postKey(r, down), b = paint(gx, key, q.x, q.y, ox, oy, beat, 0.9, 0, !vis);
        if (b) { LAST.drew.posts.push({ n: k, i: i, at: [q.x, q.y], key: key, down: down, w: b.w, dark: !vis }); LAST.drew.painted++; }
      });
    }
  }
  function holeBeat(x, ox, oy, beat, u, alpha) {
    var H = S && S.hole && BEAT && S.hole[BEAT.n], r = BEAT && holeRow(BEAT.n); if (!H || !r) return 0;
    var c = 0;
    H.posts.forEach(function (q) { var bb = rectOf(postKey(r, true), q.x, q.y, ox, oy, 0.9, 0); if (!bb) return; wipe(x, postKey(r, false), postKey(r, true), bb, beat, u, alpha); c++; });
    return c;
  }


  /* the walk refuses a shut street (the map's own walk, wrapped the way WORLD 7's shut roads wrap it; nothing shut on the bench) */
  if (typeof root.cityWalkable === 'function') {
    RAW_WALK = root.cityWalkable;
    root.cityWalkable = function (x, y) { if (shutAt(x, y)) return false; return RAW_WALK(x, y); };
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
    /* BOSSES 4 (measured 11/3, the six-boss gate, A5i): a boss WORLD TWO stood past the valley's edge (THE FILTER at 51,-6) has no
       building beside him, and his place was painted under his own men; it stands on the block behind him (up the screen) instead */
    return [at.x - 1, at.y - 1];
  }
  var PROP = { cook: 'fire', open: 'main_after', purify: 'clean', burn: 'barrel', survey: 'stake', climb: 'rope' }, MARK_OFF = [0.34, 0.16];

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
  /* a fallen boss's change waits for his camera: owed until the tape tracks in (the wipe), or until her card came without one (11/10:
     the map drew once between the fall and the beat, and his change was gone before the camera got there) */
  function beatOwed(n) { var L = S && S.lead && S.lead[n]; if (!L || !L.afterDue || L.beatDone) return false; return !(BEAT && BEAT.n === n && (BEAT.phase === 'wipe' || BEAT.phase === 'show')); }
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
      if (RISES.length && RISES.every(function (q) { return now - q.t0 >= 1800; })) RISES = [];
      if (BEAT || UB || RISES.length) RAF = requestAnimationFrame(step); else { ovOff(); try { render(); } catch (e) {} }
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
    if (!BEAT && !UB && !RISES.length) return;
    var o = ov(); if (!o) return; var x = o.getContext('2d'); x.clearRect(0, 0, o.width, o.height);
    var now = performance.now();
    try { if (RISES.length) risesPaint(x, ox, oy); } catch (e) { LAST.err = String(e && e.message || e); }   /* (9) a bolt's number */
    if (BEAT) {
      var t = now - BEAT.t0, M = BEAT_MS, r = BEAT.r, b = rectOf(paintKey(r, true), BEAT.x, BEAT.y, ox, oy, 1.3, 64);
      if (b) {
        var u = Math.max(0, Math.min(1, (t - M.glide - M.hold) / M.wipe)), fade = Math.max(0, Math.min(1, (beatT() - t) / 500));
        try { LAST.beat.checkpoints = groundBeat(x, ox, oy, beat, u, fade); } catch (e) { LAST.err = String(e && e.message || e); }
        try { LAST.beat.pipe = pipeBeat(x, ox, oy, beat, u, fade); } catch (e) { LAST.err = String(e && e.message || e); }   /* (9) his pipe rolls over to taps */
        try { LAST.beat.machines = machinesBeat(x, ox, oy, beat, u, fade); } catch (e) { LAST.err = String(e && e.message || e); }   /* (10) his machines drop */
        try { LAST.beat.drums = darkBeat(x, ox, oy, beat, u, fade); } catch (e) { LAST.err = String(e && e.message || e); }   /* (11) his drums go to the neighbours */
        try { LAST.beat.posts = holeBeat(x, ox, oy, beat, u, fade); } catch (e) { LAST.err = String(e && e.message || e); }   /* (12) the signs go back up */   /* (8) his checkpoints roll open on the same tape */
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
      x.fillStyle = UB.id === 'cook' ? '#9fd08a' : (UB.id === 'open' || UB.id === 'climb') ? '#f2c56a' : UB.id === 'burn' ? '#f2a46a' : UB.id === 'survey' ? '#e6dcc4' : '#bfeae2'; x.fillText(UB.rise, Math.round(p.sx), ty); x.restore();
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
        mains().filter(function (m) { return !marked('open', m[0], m[1]) && seen(m[0], m[1]) && cheb(m[0], m[1], me[0], me[1]) <= 8 && !onPipe(m[0], m[1]); })
          .sort(function (a, b) { return cheb(a[0], a[1], me[0], me[1]) - cheb(b[0], b[1], me[0], me[1]); }).slice(0, 3)
          .forEach(function (m) { if (paint(gx, 'main_before', m[0], m[1], ox, oy, 0, 0.32, 18, false, MARK_OFF[0], MARK_OFF[1])) LAST.drew.mains++; }); gx.globalAlpha = 1; }
      /* the blocks a verb was used on: the thing it left, off his men's feet (the old 9-second plate is gone: the number rises off them instead) */
      S.marks.forEach(function (m) {
        if (UB && UB.x === m.x && UB.y === m.y && UB.to === (PROP[m.k] || 'clean')) return;   /* still playing on his glass */
        var b = paint(gx, PROP[m.k] || 'clean', m.x, m.y, ox, oy, beat, 0.36, 22, false, MARK_OFF[0], MARK_OFF[1]); if (!b) return; LAST.drew.marks++; LAST.drew.painted++;
      });
      try { groundTick(); groundDraw(gx, ox, oy, beat); } catch (e) { LAST.err = String(e && e.message || e); }   /* (8) his checkpoints, under his place */
      try { pipeTick(); pipeDraw(gx, ox, oy, beat); } catch (e) { LAST.err = String(e && e.message || e); }   /* (9) his pipe */
      try { machinesTick(); machinesDraw(gx, ox, oy, beat); } catch (e) { LAST.err = String(e && e.message || e); }   /* (10) his machines */
      try { darkTick(); darkDraw(gx, ox, oy, beat); } catch (e) { LAST.err = String(e && e.message || e); }   /* (11) his dark and his drums */
      try { holeTick(); holeDraw(gx, ox, oy, beat); } catch (e) { LAST.err = String(e && e.message || e); }   /* (12) his hole and his sign poles */
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
    if (r.ground) groundFell(r, h);   /* (8) his ground: the checkpoints down, the till, the feed (sync() may already have done it) */
    if (r.pipe) pipeFell(r, h);       /* (9) his pipe: the watchers down, the taps */
    if (r.machines) machinesFell(r, h);   /* (10) his machines drop where they stand */
    if (r.dark) darkFell(r, h);   /* (11) his dark lifts, his drums are yours */
    if (r.hole) holeFell(r, h);   /* (12) his side back on the map, his lines to every town */
    var L = lead(r.n); L.afterDue = true; save();
    try { if (typeof render === 'function') render(); } catch (e) {}
  });
  root.addEventListener('message', function (ev) {   /* (10) a machine's fight came home (the one door's end, the way WORLD TWO's boss fight hears it) */
    var d = ev && ev.data; if (!d || d.type !== 'BOHEMIA_CITY_COMBAT_END' || !MFIGHT) return;
    var o = d.outcome || {}; setTimeout(function () { try { machineEnded(o); } catch (e) { LAST.err = String(e && e.message || e); } }, 400);
  });
  setInterval(function () { try { talkTick(); } catch (e) {} }, 900);
  loadData();
  root.BohemiaBosses = {
    /* RUN's and WORLD TWO's hooks (__THE_BOSSES__) */
    draw: draw, dress: dress, onCard: onCard, paints: paints,
    /* the phone (UI's band, marked __THE_BOSS_VERB_ON_THE_PHONE__) */
    verbHere: verbHere, use: use, icon: icon,
    /* reading, for the gate */
    data: function () { return DATA; }, pictures: function () { return PICS; }, loaded: function () { var k = Object.keys(IMG); return { asked: k.length, in: k.filter(function (f) { return IMG[f].complete && IMG[f].naturalWidth; }).length, held: !!loadData.held }; }, state: function () { sync(); return S; }, last: function () { return LAST; },
    mains: function () { return mains().slice(); }, applies: function (id, x, y) { sync(); return applies(id, x, y); }, isMain: isMain, talkTick: talkTick,
    /* BOSSES 4: the city's night sight asks if a fire he lit lights this block (__THE_BOSS_FIRES_LIGHT_THE_NIGHT__) */
    lit: function (x, y) { try { if (!S) sync(); return lit(x, y); } catch (e) { return false; } },
    /* BOSSES 11/8 (rule 437(a)): his ground, for the gate (what is shut, what opened, what was paid) */
    ground: function (n) { sync(); return S && S.ground ? (n ? (S.ground[n] || null) : S.ground) : null; },
    shutAt: function (x, y) { sync(); return shutAt(x, y); },
    regrid: function () { SHUT_DIRTY = true; shutGrid(); return root.__BOSS_SHUT || null; },
    /* BOSSES 11/9 (rule 440(b)): his pipe, for the gate */
    pipe: function (n) { sync(); return S && S.pipe ? (n ? (S.pipe[n] || null) : S.pipe) : null; },
    onPipe: function (x, y) { sync(); return onPipe(x, y); },
    /* and his machines */
    machines: function (n) { sync(); return S && S.machines ? (n ? (S.machines[n] || null) : S.machines) : null; },
    machineAt: function (x, y) { sync(); return machineAt(x, y); },
    /* BOSSES 11/10 (rule 443(a)): the city's fog asks how far the crew sees in his dark at night (__THE_BURNS_DARK__); 0 where it is not his */
    dark: function (x, y) { try { if (!S) sync(); return night() ? darkAt(x, y) : 0; } catch (e) { return 0; } },
    darkness: function (n) { sync(); return S && S.dark ? (n ? (S.dark[n] || null) : S.dark) : null; },
    /* and his hole in the map, for the gate: his side, whether a block is in it, and the forgetting run once from where the crew stands */
    hole: function (n) { sync(); return S && S.hole ? (n ? (S.hole[n] || null) : S.hole) : null; },
    inHole: function (n, x, y) { sync(); var H = S && S.hole && S.hole[n]; return !!H && inHole(H, x, y); },
    forget: function () { sync(); var me = here(); return me ? holeForget(me) : 0; }
  };
})(typeof window !== 'undefined' ? window : this);
