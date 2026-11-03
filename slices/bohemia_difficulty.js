/* BOHEMIA -- THE DIFFICULTY SWITCH, IN THE GAME'S OWN SETTINGS  (DIFFICULTY 11/3/26, rule 351(c), ask line 363)

   PAOLO 11/3: 'I want to be able to change the difficulty right now and I should be able to do that... three difficulties'.
   Rule 348: the start screen has no settings ('You gotta start playing the game to get into the settings'). Battle Brothers sets
   its difficulty once, at the start; changing it any time is our twist, his word.

   WHAT THIS IS: one row, FIGHTS, on the game's ONE settings card behind the gear (#setcard, dressed by bohemia_settings.js), with
   the three levels side by side. A tap picks one; it holds from THE NEXT FIGHT (the fight already on the board keeps its own).
   ONE TRUTH: the level lives where the new company's door already keeps its fights pick (bohemia.start, .combat: 'new', 'seen',
   'out'), so every reader that already reads the pick reads the switch: the map's party math (slices/BOHEMIA_CITY_WORLD.html
   partyDifficulty), the shell's hand-over to the fight (nfOpts, which stamps the level on the party at the bell), and the door.
   The names and the plain words are draft:true (his to change), read from records/target/bb/party_math.json difficulty_levels;
   what each level DOES is the numbers in that file and in ours.json (TUNING's one table): the switch moves no number itself.
   Not on the start screen: the row hides while the card is opened from it (body.setatstart). */
(function () {
  'use strict';
  var KEY = 'bohemia.start';
  var LEVELS = [   /* the file's rows until it loads; draft:true */
    { id: 'new', name: 'NEW HERE', say: 'Fewer of them. Your shots land more, theirs less. They still grow with you, slowly.' },
    { id: 'seen', name: 'SEEN IT', say: 'Crews as they come. Your aim still helped. A strong company meets harder men sooner.' },
    { id: 'out', name: 'OUTLIVED IT', say: 'Battle Brothers\' own aim. Bigger crews. A strong company meets champions.' }
  ];
  function el(id) { return document.getElementById(id); }
  function read() { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || {}; } catch (e) { return {}; } }
  function find(id) { for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i].id === id) return LEVELS[i]; return null; }
  function get() {
    var c = null; try { c = window.BOH_START && BOH_START.state && BOH_START.state.combat; } catch (e) {}   /* the door's live pick first, the same value */
    if (!find(c)) c = read().combat;
    var l = find(c) || find('new'); return { id: l.id, name: l.name, say: l.say, dif: LEVELS.indexOf(l) }; }
  function set(id) {
    if (!find(id)) return false;
    var s = read(); s.combat = id;
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    try { if (window.BOH_START && BOH_START.state) BOH_START.state.combat = id; } catch (e) {}   /* the door's own pick, the same value */
    var msg = { type: 'BOHEMIA_DIFFICULTY', id: id, dif: get().dif };
    Array.prototype.forEach.call(document.querySelectorAll('iframe'), function (f) { try { if (f.contentWindow) f.contentWindow.postMessage(msg, '*'); } catch (e) {} });
    paint(); return true;
  }
  /* the level as the fight's scale (party_math.json difficulty_by_pick: new 0, seen 1, out 2) */
  function dif() { return get().dif; }

  /* ---- THE ROW ---- */
  function paint() {
    var host = el('setdiff'); if (!host) return;
    var g = get();
    Array.prototype.forEach.call(host.children, function (b) { b.classList.toggle('on', b.getAttribute('data-d') === g.id); });
    var s = el('setdiffsay'); if (s) s.textContent = g.say + ' FROM THE NEXT FIGHT.';
  }
  function row() {
    var card = el('setcard'); if (!card || el('setdiff')) return !!card;
    var r = document.createElement('div'); r.className = 'setrow setdiffrow';
    var l = document.createElement('span'); l.className = 'setlab'; l.textContent = 'FIGHTS'; r.appendChild(l);
    var host = document.createElement('div'); host.id = 'setdiff';
    LEVELS.forEach(function (L) {
      var b = document.createElement('div'); b.className = 'setbtn'; b.setAttribute('role', 'button'); b.setAttribute('tabindex', '0');
      b.setAttribute('data-d', L.id); b.textContent = L.name;
      b.addEventListener('click', function (e) { e.stopPropagation(); set(L.id); });
      host.appendChild(b);
    });
    r.appendChild(host);
    var say = document.createElement('div'); say.id = 'setdiffsay';
    var game = el('setsave') ? el('setsave').parentNode : null;
    if (game && game.parentNode === card) { card.insertBefore(r, game); card.insertBefore(say, game); } else { card.appendChild(r); card.appendChild(say); }
    paint(); return true;
  }
  function look() {
    if (el('setdiff-look')) return;
    var CSS = ''
      + '#setdiff{flex:1;display:flex;gap:4px;min-width:0}'
      + '#setdiff .setbtn{flex:1;min-width:0;padding:0 6px!important;justify-content:flex-start!important;text-align:left!important;font-size:10px!important;letter-spacing:.4px!important;opacity:.62}'
      + '#setdiff .setbtn.on{opacity:1;box-shadow:inset 0 -3px 0 #a8752c!important}'
      + '#setdiffsay{margin:-2px 0 10px 90px;font-family:"BohemiaROM",ui-monospace,monospace;font-size:10px;letter-spacing:.4px;line-height:1.4;color:#e6d8bd;text-shadow:0 1px 0 #000}'
      + 'body.setatstart .setdiffrow,body.setatstart #setdiffsay{display:none!important}';
    var st = document.createElement('style'); st.id = 'setdiff-look'; st.textContent = CSS; document.head.appendChild(st);
  }
  function load() {
    try { fetch('../records/target/bb/party_math.json').then(function (r) { return r.json(); }).then(function (j) {
      var v = j && j.difficulty_levels && j.difficulty_levels.value;
      if (Array.isArray(v) && v.length === 3) { LEVELS = v.map(function (x) { return { id: x.id, name: x.name, say: x.say }; });
        var host = el('setdiff'); if (host) Array.prototype.forEach.call(host.children, function (b, i) { b.textContent = LEVELS[i].name; b.setAttribute('data-d', LEVELS[i].id); });
        paint(); }
    }).catch(function () {}); } catch (e) {}
  }
  function boot() {
    look(); row(); load();
    var g = el('gearbtn'); if (g && !g.__setDiff) { g.__setDiff = 1; g.addEventListener('click', function () { setTimeout(function () { row(); paint(); }, 0); }); }
  }
  window.BohemiaDifficulty = { get: get, set: set, dif: dif, levels: function () { return LEVELS.slice(); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
