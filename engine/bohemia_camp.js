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
     BohemiaCamp.MORE / NUMS           CAMP TWO (rule 270): Battle Brothers' other twelve, each a person of the valley, his price, what he
                                       will do, his numbers (read by mult / plus like the live six) and the lane whose screen does his work
     BohemiaCamp.scavenge(armour, rounds, roll)  the Scavenger's share of a fight (rule 271(a)), for RUN FOUR's loot
     BohemiaCamp.look()                THE CAMP'S LOOK in one call (rule 239, for UI's camp behind the crew screen): the fire (and
                                       whether the company is camped now), the cart he has grown to, each follower by his word, a
                                       tent a head, the stash's room
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
    cook: { says: 'The crew eats for less, and a hurt man gets a hitpoint more back every hour.', food: 0.85, heal: 1 },
    paymaster: { says: 'The hired men take 15% less pay a night, and every other follower costs 15% less.', wage: 0.85 },
    /* CAMP [the heal button, damage that stays] (rule 226(e): the camp grows: faster healing, faster repair): Battle Brothers' own
       follower pages (bb_all/1947, 1974), the numbers in records/target/bb/condition.json, read by engine/bohemia_condition.js */
    blacksmith: { says: 'Armour gets mended a fifth quicker, and it eats a fifth less tape.', repair: 1.2, tape: 0.8 },
    surgeon: { says: 'A man struck down heals his fresh wound a day sooner.', injuryDays: 1 }   /* CAMP rule 234: nobody is laid up any more */
  };
  var WORD = { scout: 'THE SCOUT', lookout: 'THE LOOKOUT', cook: 'THE COOK', paymaster: 'THE PAYMASTER', blacksmith: 'THE BLACKSMITH', surgeon: 'THE SURGEON' };
  /* ==== __ALL_EIGHTEEN__ (CAMP TWO [all eighteen followers], rule 270, Paolo 10/26: 'do research on all the people in Battle Brothers who
     can join your camp and what they do to help you, the basic camp support, the retinue support'). Battle Brothers' other twelve
     (records/BOHEMIA_PAOLO_ALL_EIGHTEEN_FOLLOWERS_TAPE_THAT_KEEPS_A_RUN_ALIVE_AND_THE_ARMOUR_SHOWS_10_26_26.md, the wiki's bb_all/1940
     to 1975), each a person of the valley (draft:true, WORDS may better them), his price and his number TUNING's (the one table,
     section V: the wiki's crowns / 10; at rule 264's pace only the cook's hour and the surgeon's day move). His work is done on
     another lane's screen; until that screen reads his number (BohemiaCamp.mult / plus / has, named in waits) he stands in the
     retinue, priced, with what he will do, and his hire is shut: nobody pays for help that never comes. His piece stands in the
     camp (slices/camp_two/kit.png f_<id>). */
  var MORE = [
    { id: 'agent', price: 400, who: 'Ines ran a temp agency\'s phone bank. She still knows every board in the valley.', says: 'Every town\'s jobs and what is going on there, from anywhere on the map.', nums: { boards: 1 }, waits: 'RUN TWO and UI TWO: the town card and the phone read BohemiaCamp.has(\'agent\')' },
    { id: 'alchemist', price: 250, who: 'A pharmacist who cooks down what the lab beasts leave behind.', says: 'A quarter of the time, what he makes costs none of its parts.', nums: { craftFree: 0.25 }, waits: 'nobody yet: the game has no crafting' },
    { id: 'bounty_hunter', price: 400, who: 'A skip tracer from before the crash. He still carries the bills.', says: 'More of the hard ones turn up, and he pays 30 to 75 batteries a head for them.', nums: { champions: 0.03, champPayLo: 30, champPayHi: 75 }, waits: 'WORLD and COMBAT: ours.outclass reads plus(\'champions\'), the spoils pay the head' },
    { id: 'brigand', price: 250, who: 'He still listens to the old police band on a scanner.', says: 'Some caravans stay on your map wherever they go.', nums: { caravans: 1 }, waits: 'RUN: the map draws has(\'brigand\') caravans out of sight' },
    { id: 'cartographer', price: 250, who: 'A transit planner with a dead city\'s bus maps in a tube.', says: 'He pays you 10 to 40 batteries for every place you find on your own.', nums: { placePayLo: 10, placePayHi: 40 }, waits: 'RUN: the map that fills in (rule 243) pays has(\'cartographer\')' },
    { id: 'drill_sergeant', price: 350, who: 'A high-school football coach. He never stopped blowing the whistle.', says: 'New men learn a fifth faster, two in a hundred less each level after.', nums: { xpFirst: 1.2, xpLessEach: 0.02 }, waits: 'COMBAT and RUN: the level-up reads mult(\'xpFirst\')' },
    { id: 'minstrel', price: 200, who: 'A wedding DJ with one speaker left.', says: 'Everything you do gets talked about: your name grows 15 percent faster.', nums: { renown: 1.15 }, waits: 'RUN TWO: BohemiaRenown.add reads mult(\'renown\')' },
    { id: 'negotiator', price: 300, who: 'He sold cars on Boulder Highway for twenty years.', says: 'More rounds of haggling before a client walks; a town forgets a grudge faster.', nums: { relFade: 0.85, relMend: 1.15 }, waits: 'FACTIONS: the relations read mult(\'relFade\') and mult(\'relMend\')' },
    { id: 'quartermaster', price: 300, who: 'A warehouse night manager. Everything has a shelf.', says: 'Room for 50 more tape, 50 more meds and 100 more rounds.', nums: { tapeRoom: 50, medsRoom: 50, roundsRoom: 100 }, waits: 'ECONOMY: the counts get their caps and read plus(\'tapeRoom\')' },
    { id: 'recruiter', price: 300, who: 'A casino floor manager. She hired thousands.', says: 'Men cost a tenth less to hire, and two to four more stand at every post.', nums: { hire: 0.9, tryout: 0.5, postLo: 2, postHi: 4 }, waits: 'RUN THREE: the post reads mult(\'hire\') and plus(\'postLo\')' },
    { id: 'scavenger', price: 300, who: 'She walks the field after, a shopping bag in each hand.', says: 'After a fight she brings back tape off the broken armour and some of the rounds you fired.', nums: { scavTapeLo: 0.005, scavTapeHi: 0.01, scavTapeCap: 60, scavRoundsLo: 0.1, scavRoundsHi: 0.2 }, waits: 'RUN FOUR: the loot calls BohemiaCamp.scavenge(destroyed armour, rounds fired)' },
    { id: 'trader', price: 350, who: 'The swap meet\'s king. He knows who makes what.', says: 'One more trade good for sale wherever it is made.', nums: { tradeGoods: 1 }, waits: 'ECONOMY: the trade goods read plus(\'tradeGoods\')' }
  ];
  MORE.forEach(function (m) { WORD[m.id] = 'THE ' + m.id.toUpperCase().replace(/_/g, ' '); });
  /* the followers whose work no screen does yet: their numbers ride beside the live ones, read by mult / plus once a screen asks */
  var NUMS = {}; MORE.forEach(function (m) { NUMS[m.id] = m.nums; });
  function moreOf(id) { for (var i = 0; i < MORE.length; i++) if (MORE[i].id === id) return MORE[i]; return null; }
  /* THE SCAVENGER'S SHARE (rule 271(a), Battle Brothers' own numbers: 'the number of tools recovered is equal to 0.5-1% of maximum
     durability of destroyed enemy armor... capped at 60'; 'Recovers 10-20% of spent ammo'), for RUN FOUR's loot to call: what she
     brings back from a fight where the enemy armour destroyed had this much whole durability and this many rounds were fired.
     roll is 0..1 (the fight's own die), so the loot stays the fight's. Nothing without her. */
  function scavenge(armourMax, rounds, roll) {
    if (!has('scavenger')) return { tape: 0, rounds: 0 };
    var n = NUMS.scavenger, r = Math.max(0, Math.min(1, roll == null ? 0.5 : +roll));
    var tape = Math.min(n.scavTapeCap, Math.floor((+armourMax || 0) * (n.scavTapeLo + (n.scavTapeHi - n.scavTapeLo) * r)));
    var back = Math.floor((+rounds || 0) * (n.scavRoundsLo + (n.scavRoundsHi - n.scavRoundsLo) * r));
    return { tape: Math.max(0, tape), rounds: Math.max(0, back) };
  }
  /* ==== /__ALL_EIGHTEEN__ ==== */
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
    var live = F.FOLLOWERS.filter(function (f) { return LIVE[f.id]; }).map(function (f) {
      return { id: f.id, word: WORD[f.id] || f.id.toUpperCase(), price: F.hirePrice(f.id, h), says: LIVE[f.id].says, ask: f.ask, hireSays: f.hireSays, hired: !!h[f.id] }; });
    /* __ALL_EIGHTEEN__: the other twelve, priced the same way (the paymaster's 15 percent off), their hire shut until a screen does
       their work (soon: the lane that does it) */
    var pay = h.paymaster ? (LIVE.paymaster.wage || 0.85) : 1;
    return live.concat(MORE.map(function (m) {
      return { id: m.id, word: WORD[m.id], price: Math.round(m.price * pay), says: m.says, ask: m.who, hireSays: WORD[m.id] + ' is with you.', hired: !!h[m.id], soon: m.waits, who: m.who }; }));
  }
  function hire(id) { var s = state(); if (s.retinue.indexOf(id) < 0) s.retinue.push(id); return save(s); }
  function letGo(id) { var s = state(); s.retinue = s.retinue.filter(function (x) { return x !== id; }); return save(s); }
  /* the numbers the map reads, multiplied over the retinue (1 with nobody) */
  function mult(k) { var m = 1; retinue().forEach(function (id) { var L = LIVE[id] || NUMS[id]; if (L && typeof L[k] === 'number') m *= L[k]; }); return m; }
  function plus(k) { var n = 0; retinue().forEach(function (id) { var L = LIVE[id] || NUMS[id]; if (L && typeof L[k] === 'number') n += L[k]; }); return n; }
  /* THE CAMP'S LOOK (CAMP, rule 239, NOTE on CAMP's board: 'UI draws his camp behind the crew screen; give it the camp's look and
     what it has grown (the fire, the followers, the wagon) as one call'): read off what the camp already keeps, nothing new */
  function look() {
    var c = cart(), r = retinue(), on = false;
    try { var M = root.BohemiaMapCamp || (root.parent && root.parent !== root && root.parent.BohemiaMapCamp); on = !!(M && M.on()); } catch (e) {}
    return { fire: true, camped: on, cart: c.now ? c.now.id : null, cartWord: c.now ? c.now.word : null, cartLevel: c.level, cartMax: CART.length,
      followers: r.map(function (id) { return { id: id, word: WORD[id] || id.toUpperCase() }; }), tents: 1 + r.length, stash: stashSlots() };
  }
  root.BohemiaCamp = { KEY: KEY, BASE_SLOTS: BASE_SLOTS, CART: CART, LIVE: LIVE, WORD: WORD, state: state, stashSlots: stashSlots, cart: cart, buyCart: buyCart,
    retinue: retinue, has: has, hired: hired, offer: offer, hire: hire, letGo: letGo, mult: mult, plus: plus, look: look, MORE: MORE, NUMS: NUMS, moreOf: moreOf, scavenge: scavenge };
})(typeof window !== 'undefined' ? window : this);
