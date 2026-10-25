/* BOHEMIA CAMP -- the company's camp: its cart and its retinue (RUN TWO [the camp and the retinue], rule 151(d), 10/25/26).
   PAOLO 10/24: 'if you want time to speed along, there should be a camp button: wherever you're posted up you make a camp and
   upgrade your camp... with the cabin and all your members; and you can hire people to join you, Battle Brothers calls it a
   retinue'. Battle Brothers' own retinue screen IS a campfire with tents (the wiki's Retinue page, File:Campfire_tents_01):
   the followers you hire there and the cart you upgrade there for more room in the stash. This file keeps both; the camp
   screen (slices/BOHEMIA_SETTLEMENT_SCREEN.html, camp mode) shows them, the map reads what they do.
     THE CART: four upgrades, Battle Brothers' Donkey, Cart, Wagon and Big Wagon (+27 slots each on its 99, the wiki; GROK
       ask 68), here +12 each on the stash's 36 (the same third), in our own words and prices (draft, TUNING).
     THE RETINUE: PEOPLE's followers (engine/bohemia_followers.js: the wiki's roles, bought once, no wage, rule 56), one to a
       slot, the slots opened by the company's CLOUT (engine/bohemia_renown.js, the wiki's table: 250, 750, 1,400, 2,250, 3,350).
       Only the ones whose help the game can really give are offered (LIVE below); a slot is freed by letting one go.
     BohemiaCamp.state()               { cart, retinue: [ids] }
     BohemiaCamp.stashSlots()          the stash's size with the cart (36 + 12 a step)
     BohemiaCamp.cart()                { level, next: { id, word, slots, price } | null, levels }
     BohemiaCamp.buyCart()             the next cart step (the price is the screen's to take), its new state
     BohemiaCamp.retinue()             the hired ids, in the order they came
     BohemiaCamp.has(id)               a follower is with you
     BohemiaCamp.hired()               { id: true } for the followers module's own calls (hirePrice, travelMultiplier)
     BohemiaCamp.offer()               every follower the camp can offer, with his price now and what he does, in plain words
     BohemiaCamp.hire(id) / letGo(id)  in or out (a slot and the price are the screen's to check)
     BohemiaCamp.LIVE                  what each live follower changes, the numbers the map reads
   Kept in localStorage bohemia.camp.v1 (a new game clears it). */
(function (root) {
  'use strict';
  var KEY = 'bohemia.camp.v1', BASE_SLOTS = 36;
  var CART = [
    { id: 'handcart', word: 'A HAND CART', slots: 12, price: 100 },
    { id: 'pickup', word: 'A PICKUP BED', slots: 12, price: 200 },
    { id: 'boxtruck', word: 'A BOX TRUCK', slots: 12, price: 350 },
    { id: 'trailer', word: 'A TRAILER', slots: 12, price: 500 }
  ];
  /* what a follower does that the game can really do now (the wiki's effect, our number; draft, TUNING): */
  var LIVE = {
    scout: { says: 'The roads go by quicker: a block on the map costs 15% less time.', travel: 0.85 },
    lookout: { says: 'Sees one block further down a street, a quarter further over open ground, and a camp is warned two blocks sooner.', street: 1, open: 1.25, warn: 2 },
    cook: { says: 'The crew eats for less: the night\'s food and water cost 15% less.', food: 0.85 },
    paymaster: { says: 'The hired men take 15% less pay a night, and every other follower costs 15% less.', wage: 0.85 }
  };
  var WORD = { scout: 'THE SCOUT', lookout: 'THE LOOKOUT', cook: 'THE COOK', paymaster: 'THE PAYMASTER', blacksmith: 'THE BLACKSMITH', surgeon: 'THE SURGEON' };
  function state() {
    var s = null; try { s = JSON.parse(root.localStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (!s || typeof s !== 'object') s = {};
    if (typeof s.cart !== 'number') s.cart = 0; if (!Array.isArray(s.retinue)) s.retinue = [];
    return s;
  }
  function save(s) { try { root.localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} return s; }
  function stashSlots() { var c = state().cart, n = BASE_SLOTS; for (var i = 0; i < c && i < CART.length; i++) n += CART[i].slots; return n; }
  function cart() { var c = state().cart; return { level: c, now: c ? CART[Math.min(c, CART.length) - 1] : null, next: CART[c] || null, levels: CART.slice() }; }
  function buyCart() { var s = state(); if (s.cart < CART.length) s.cart++; return save(s); }
  function retinue() { return state().retinue.slice(); }
  function has(id) { return state().retinue.indexOf(id) >= 0; }
  function hired() { var o = {}; state().retinue.forEach(function (id) { o[id] = true; }); return o; }
  function offer() {
    var F = root.BohemiaFollowers; if (!F) return [];
    var h = hired();
    return F.FOLLOWERS.filter(function (f) { return LIVE[f.id]; }).map(function (f) {
      return { id: f.id, word: WORD[f.id] || f.id.toUpperCase(), price: F.hirePrice(f.id, h), says: LIVE[f.id].says, ask: f.ask, hireSays: f.hireSays, hired: !!h[f.id] }; });
  }
  function hire(id) { var s = state(); if (s.retinue.indexOf(id) < 0) s.retinue.push(id); return save(s); }
  function letGo(id) { var s = state(); s.retinue = s.retinue.filter(function (x) { return x !== id; }); return save(s); }
  /* the numbers the map reads, multiplied over the retinue (1 with nobody) */
  function mult(k) { var m = 1; retinue().forEach(function (id) { var L = LIVE[id]; if (L && typeof L[k] === 'number') m *= L[k]; }); return m; }
  function plus(k) { var n = 0; retinue().forEach(function (id) { var L = LIVE[id]; if (L && typeof L[k] === 'number') n += L[k]; }); return n; }
  root.BohemiaCamp = { KEY: KEY, BASE_SLOTS: BASE_SLOTS, CART: CART, LIVE: LIVE, WORD: WORD, state: state, stashSlots: stashSlots, cart: cart, buyCart: buyCart,
    retinue: retinue, has: has, hired: hired, offer: offer, hire: hire, letGo: letGo, mult: mult, plus: plus };
})(typeof window !== 'undefined' ? window : this);
