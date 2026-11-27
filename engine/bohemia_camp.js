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
     BohemiaCamp.row(id) / rows()      RETINUE 11/7 (rule 425(c)): the follower's row of records/target/bb/retinue.json (a modder's
                                       file): name, was, look (his face and body), price, does, nums, ask, joins, reads, shut, work
     BohemiaCamp.workOf(id)            STAFF 3 (rule 495(b)): his trade, ANIMATION's camp act by name (the row's work), or null
     BohemiaCamp.price(id)            his price now (the paymaster's 15 percent off everybody else)
     BohemiaCamp.inTown(place, week)   the few of the eighteen in that place's hall this week (never one with you, never a shut one)
     BohemiaCamp.meet(id, place)       he was met there (the camp says where); looks() the faces with you, dealt to nobody else
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
  /* ==== __THE_RETINUE_DATA__ (RETINUE, rule 425(c), ask line 206, 11/7: 'each follower a real person of a dead Las Vegas... data in a
     file a modder can edit'). THE EIGHTEEN LIVE IN records/target/bb/retinue.json: who he is, who he was, his face and body (a person
     of the valley's id), his price, his one effect and its numbers, what he says, where the game does his work, or why his hire is
     shut. ROWS below is that file's copy, the same rows (gates/the_retinue_gate.js holds them equal; `node tools/bohemia_retinue_bake.js`
     writes it from the file); the file is read again at load, so a modder's edit to it is the game's after a reload. LIVE, MORE,
     NUMS, WORD and READY are built from the rows, the shapes every other screen already reads. ==== */
  var ROWS = /* __RETINUE_ROWS__ */ [
    {"id":"cook","bb":"The Cook","name":"Graciela Ochoa","look":"person_woman_0","sex":"f","price":200,"was":"Ran the night line at a Fremont Street buffet for twenty-two years. She can feed forty off one burn barrel.","does":"The crew eats for less, and a hurt man gets a hitpoint more back every hour.","nums":{"food":0.85,"heal":1},"ask":"I fed the whole Strip once. I can feed your crew on half of what you are wasting.","joins":"Graciela puts her pot on your fire.","reads":"engine/bohemia_condition.js (the hour's healing) and the nightly bill (the food)","shut":null,"work":"cook"},
    {"id":"scout","bb":"The Scout","name":"Danny Nguyen","look":"person_town_42","sex":"m","price":250,"was":"Drove a cab nineteen years. He still knows every back way across the valley, and which ones flood.","does":"The roads go by quicker: a block on the map costs 15% less time.","nums":{"travel":0.85},"ask":"Nineteen years in a cab. I know the way around everything that is blocking you.","joins":"Danny rides up front now. The roads go by quicker.","reads":"the map's travel time a block (BohemiaCamp.mult('travel'))","shut":null,"work":"loot"},
    {"id":"lookout","bb":"The Lookout","name":"Earl Pruitt","look":"person_town_29","sex":"m","price":250,"was":"Sat in a casino's eye in the sky, forty screens at once. Some nights the dark ones still show him something.","does":"Sees one block further down a street, a quarter further over open ground, and a camp is warned two blocks sooner.","nums":{"street":1,"open":1.25,"warn":2},"ask":"I watched forty screens a shift. I will see them coming before you hear them.","joins":"Earl takes the high spot. Nothing gets close without him saying so.","reads":"the map's sight and the camp's warning (BohemiaCamp.plus('street'), mult('open'), plus('warn'))","shut":null,"work":"smoke"},
    {"id":"paymaster","bb":"The Paymaster","name":"Hector Salas","look":"person_town_36","sex":"m","price":350,"was":"Counted the cage at a downtown casino. He can weigh a brick of bills in his hand and tell you if it is short.","does":"The hired men take 15% less pay a night, and every other follower costs 15% less.","nums":{"wage":0.85},"ask":"Every battery you spend, I count twice. You will pay less for everybody.","joins":"Hector opens his ledger. Everybody costs a little less now.","reads":"engine/bohemia_wages.js (the night's pay) and this file's prices","shut":null,"work":"stall"},
    {"id":"blacksmith","bb":"The Blacksmith","name":"Walt Hensley","look":"person_town_23","sex":"m","price":290,"was":"Ran a body shop on Boulder Highway. Now he welds car doors into armour.","does":"Armour gets mended a fifth quicker, and it eats a fifth less tape.","nums":{"repair":1.2,"tape":0.8},"ask":"Bring me a car door and an hour. I will make it stop a bullet.","joins":"Walt sets up by the cart. The armour gets mended quicker.","reads":"engine/bohemia_condition.js (the hour's mending)","shut":null,"work":"repair"},
    {"id":"surgeon","bb":"The Surgeon","name":"Alan Cho","look":"person_town_44","sex":"m","price":350,"was":"An ER doctor at the county hospital until the power went. He still washes his hands before he cuts.","does":"A man struck down heals his fresh wound a day sooner.","nums":{"injuryDays":1},"ask":"I worked the ER the night the lights went out. Nothing your men bring me will scare me.","joins":"Doc Cho lays out what is left of his kit.","reads":"engine/bohemia_condition.js (laid up a day less)","shut":null,"work":"tend"},
    {"id":"agent","bb":"The Agent","name":"Ines Baptiste","look":"person_woman_3","sex":"f","price":390,"was":"Ran a temp agency's phone bank. She still knows every board in the valley.","does":"Every town's jobs and what is going on there, from anywhere on the map.","nums":{"boards":1},"ask":"I placed half this valley in jobs once. I still know who is hiring, everywhere.","joins":"Ines is with you. She knows every board in the valley.","reads":null,"shut":"RUN TWO and UI TWO: the town card and the phone read BohemiaCamp.has('agent')","work":"talk"},
    {"id":"alchemist","bb":"The Alchemist","name":"Felix Amari","look":"person_town_19","sex":"m","price":250,"was":"A pharmacist at an all-night drugstore on the Strip. Now he cooks down what the lab beasts leave behind.","does":"A quarter of the time, what he makes costs none of its parts.","nums":{"craftFree":0.25},"ask":"Bring me what is left of those things from the lab. I can make something out of it.","joins":"Felix is with you. He wants the next beast's body.","reads":null,"shut":"nobody yet: the game has no crafting","work":"tend"},
    {"id":"bounty_hunter","bb":"The Bounty Hunter","name":"Marcus Bell","look":"person_town_26","sex":"m","price":390,"was":"A skip tracer for a downtown bail bondsman. He still carries the bills, and the faces on them.","does":"More of the hard ones turn up, and he pays 30 to 75 batteries a head for them.","nums":{"champions":0.03,"champPayLo":30,"champPayHi":75},"ask":"Some of the people out there still have a price on them. I know which ones.","joins":"Marcus is with you. He keeps the bills in his coat.","reads":null,"shut":"WORLD and COMBAT: ours.outclass reads plus('champions'), the spoils pay the head","work":"clean"},
    {"id":"brigand","bb":"The Brigand","name":"Rusty Kogan","look":"person_town_43","sex":"m","price":250,"was":"Sold what he heard on a police scanner. The scanner still talks, and some nights nobody is left to be talking.","does":"Some caravans stay on your map wherever they go.","nums":{"caravans":1},"ask":"I hear where the trucks go. I will tell you before anybody else does.","joins":"Rusty is with you. His scanner hisses all night.","reads":null,"shut":"RUN: the map draws has('brigand') caravans out of sight","work":null},
    {"id":"cartographer","bb":"The Cartographer","name":"Ken Takeda","look":"person_town_28","sex":"m","price":250,"was":"A transit planner. He carries the dead city's bus maps in a tube and marks what is still there.","does":"He pays you 10 to 40 batteries for every place you find on your own.","nums":{"placePayLo":10,"placePayHi":40},"ask":"Every place you find that is not on my maps, I will pay you for it.","joins":"Ken is with you. He unrolls a bus map on the fire's crate.","reads":null,"shut":"RUN: the map that fills in (rule 243) pays has('cartographer')","work":"sit"},
    {"id":"drill_sergeant","bb":"The Drill Sergeant","name":"Darnell Price","look":"person_town_14","sex":"m","price":350,"was":"A high-school football coach. He never stopped blowing the whistle.","does":"New men learn a fifth faster, two in a hundred less each level after.","nums":{"xpFirst":1.2,"xpLessEach":0.02},"ask":"Give me your new guys. Two weeks and they will learn faster than you ever did.","joins":"Coach Price is with you. The whistle goes at dawn.","reads":"the shell's fight end (nfOverIn, BohemiaCamp.xpDrill)","shut":null,"work":"talk"},
    {"id":"minstrel","bb":"The Minstrel","name":"Chuy Morales","look":"person_town_17","sex":"m","price":200,"was":"A wedding DJ with one speaker left. He plays your fights back to every town you walk into.","does":"Everything you do gets talked about: your name grows 15 percent faster.","nums":{"renown":1.15},"ask":"One speaker, one battery, and the whole valley knows your name.","joins":"Chuy is with you. The speaker crackles on.","reads":"engine/bohemia_renown.js add","shut":null,"work":"flirt"},
    {"id":"negotiator","bb":"The Negotiator","name":"Gary Lund","look":"person_town_39","sex":"m","price":290,"was":"Sold cars on Boulder Highway for twenty years. He can make a grudge sound like a deal.","does":"A town's good word for you fades slower, and a grudge mends faster.","nums":{"relFade":0.85,"relMend":1.15},"ask":"Nobody stays mad at you if I am the one talking. Twenty years selling cars.","joins":"Gary is with you. He shakes every hand in town.","reads":"the town's relations at dawn (slices/BOHEMIA_SETTLEMENT_SCREEN.html relDawn, engine/bohemia_relations.js dawn)","shut":null,"work":"talk"},
    {"id":"quartermaster","bb":"The Quartermaster","name":"Tony Arce","look":"person_town_9","sex":"m","price":290,"was":"A warehouse night manager. Everything has a shelf, and he knows what is on every one.","does":"Room for 50 more tape, 50 more meds and 100 more rounds.","nums":{"tapeRoom":50,"medsRoom":50,"roundsRoom":100},"ask":"Your stuff is everywhere. Give me a cart and a marker and you will carry more.","joins":"Tony is with you. Everything gets a shelf.","reads":null,"shut":"ECONOMY: the counts get their caps and read plus('tapeRoom')","work":"unpack"},
    {"id":"recruiter","bb":"The Recruiter","name":"Yolanda Reyes","look":"person_woman_1","sex":"f","price":290,"was":"A casino floor manager on the Strip. She hired thousands and fired more.","does":"Men cost a tenth less to hire, and two to four more stand at every post.","nums":{"hire":0.9,"tryout":0.5,"postLo":2,"postHi":4},"ask":"I hired thousands. I will find you better men and get them cheaper.","joins":"Yolanda is with you. Every post has more men now.","reads":"the hall: hallPrice and recruitsHere","shut":null,"work":"flirt"},
    {"id":"scavenger","bb":"The Scavenger","name":"Dot Kowalski","look":"person_woman_2","sex":"f","price":290,"was":"Walks the field after a fight, a shopping bag in each hand, and does not look at the faces.","does":"After a fight she brings back tape off the broken armour and some of the rounds you fired.","nums":{"scavTapeLo":0.005,"scavTapeHi":0.01,"scavTapeCap":60,"scavRoundsLo":0.1,"scavRoundsHi":0.2},"ask":"After you are done, I go through what is left. You would be surprised what comes back.","joins":"Dot is with you. She brings her bags.","reads":"the end screen (slices/BOHEMIA_SPOILS_SCREEN.html open): the tape; the rounds wait on the fight counting rounds fired","shut":null,"work":"loot"},
    {"id":"trader","bb":"The Trader","name":"Memo Gallardo","look":"person_town_18","sex":"m","price":350,"was":"The swap meet's king. He knows who makes what, and who will pay for it.","does":"One more trade good for sale wherever it is made.","nums":{"tradeGoods":1},"ask":"I know every stall in the valley. I will find you goods worth carrying.","joins":"Memo is with you. He already has a buyer in mind.","reads":null,"shut":"ECONOMY: the trade goods read plus('tradeGoods')","work":"stall"}
  ] /* /__RETINUE_ROWS__ */;
  /* the six Battle Brothers ships every company (GROK_121's six, RUN TWO 10/25): LIVE; the other twelve: MORE (CAMP TWO, rule 270) */
  var SIX = { cook: 1, scout: 1, lookout: 1, paymaster: 1, blacksmith: 1, surgeon: 1 };
  var LIVE = {}, WORD = {}, MORE = [], NUMS = {}, READY = {}, BY = {};
  function index(rows) {
    var k; for (k in LIVE) delete LIVE[k]; for (k in WORD) delete WORD[k]; for (k in NUMS) delete NUMS[k]; for (k in READY) delete READY[k]; for (k in BY) delete BY[k];
    MORE.length = 0;
    (rows || []).forEach(function (r) {
      if (!r || !r.id) return;
      var nums = {}; for (var n in (r.nums || {})) if (typeof r.nums[n] === 'number') nums[n] = r.nums[n];
      BY[r.id] = r; WORD[r.id] = 'THE ' + String(r.id).toUpperCase().replace(/_/g, ' ');
      if (SIX[r.id]) { var L = { says: r.does }; for (var q in nums) L[q] = nums[q]; LIVE[r.id] = L; return; }
      MORE.push({ id: r.id, price: r.price, who: r.was, says: r.does, nums: nums, waits: r.shut || null }); NUMS[r.id] = nums;
      if (!r.shut) READY[r.id] = r.reads || 'its screen';
    });
  }
  index(ROWS);
  function row0(id) { return BY[id] || null; }
  /* __THE_STAFF_FIGHT_TOO__: the row as the person who does the job now (after a death, a new person: his name and face, none of the
     dead one's words) */
  function row(id) { var r = row0(id); if (!r) return null; if (!lostOf(state(), id)) return r; var p = person(id);
    return Object.assign({}, r, { name: p.name, look: p.look, sex: p.sex || null, was: '', ask: '', joins: '', person: p.n, draft: true }); }
  function rows() { return ROWS.slice(); }
  /* his trade (STAFF 3 11/27, VAMILY rule 495(b), one thing one place): the job's work, ANIMATION's camp act by name (the file's 'work',
     records/target/bb/retinue.json), the same for the camp by the fire and his place's footage; null, he stands and watches. The job's,
     not the person's: a new person in the job does the same work */
  function workOf(id) { var r = row0(id); return r && typeof r.work === 'string' && r.work ? r.work : null; }
  /* the file, again at load (a modder's rows over the copy; a row with no id is skipped, a bad file changes nothing) */
  var LOADED = { asked: false, read: false }, PER_PLACE = 3;
  /* __THE_STAFF_FIGHT_TOO__ (STAFF, VAMILY rule 468): the camp's people in a fight, the file's staff block (records/target/bb/retinue.json
     staff; the copy below is that block, `node tools/bohemia_retinue_bake.js` writes it, gates/the_staff_fight_too_gate.js holds them equal) */
  var STAFF = /* __STAFF_RULES__ */ {"stats":{"hp":[40,50],"resolve":[25,40],"melee_skill":[47,57],"ranged_skill":[32,42],"melee_defense":[0,5],"ranged_defense":[0,5],"initiative":[95,105],"fatigue":[90,100]},"level":1,"xp":false,"traits":["clumsy","craven","fainthearted","fragile","hesitant"],"weapon":"box_cutter","arms":{"one_handed_only":true,"by_trade":{"blacksmith":"pickaxe","scout":"snub_revolver","bounty_hunter":"snub_revolver"},"else":"box_cutter","refuse_class":["bow","crossbow","firearm","throwing","throwable_item"],"given":"STAFF 3 11/27 (rule 471(b), the crew screen): a one-handed weapon from the stash handed to a camp person rides in his hand instead of his trade's (BohemiaCamp.giveArms); kept with the job as the cart is (a rehire in the job holds it), back to the stash when he hands it back, gone with him when he falls and his side lost the field. refuse_class: the fight's ranged classes (slices/BOHEMIA_FIGHT.html RANGED, held equal by gates/the_staff_push_a_cart_gate.js C18) and a thrown item: he pushes a cart, so never a bow, a long gun or a throw; a pistol rides a dagger's row, so it is held"},"cart":{"kinds":[{"id":"shopping_cart","word":"A SHOPPING CART","melee_defense":8,"ranged_defense":3,"fatigue":-6,"ap_per_tile":1,"holds":20,"price":0,"tape":0},{"id":"utility_cart","word":"A STEEL UTILITY CART","melee_defense":11,"ranged_defense":5,"fatigue":-8,"ap_per_tile":1,"holds":35,"price":150,"tape":20},{"id":"wagon","word":"A WAGON","melee_defense":14,"ranged_defense":7,"fatigue":-10,"ap_per_tile":1,"holds":60,"price":300,"tape":40}],"front_arc":1,"built_at":"forge","stock":{"cook":"food","surgeon":"meds","alchemist":"meds","blacksmith":"tape","scavenger":"tape","quartermaster":"rounds","bounty_hunter":"rounds"},"kept_when_he_falls":"won"},"armour":false,"starts":"Wavering","top":"Steady","struck_down":"dead","shakes_fighters":true,"shakes_staff":true,"in_the_pit":false,"rehire_price":"the same","words":{"take":"Stands in your fights. One of your {cap}.","full":"No room: your company is {n} of {cap}.","camp":"CAMP","cart":"Pushes {cart}. One hand only.","hand":"In {his} hand: {weapon}.","only":"ONE HAND ONLY","pick":"Tap a piece in the stash to put it in {his} hand.","given":"{name} takes the {weapon}. The {tool} goes in the cart.","swap":"{name} takes the {weapon}. The {old} goes back in the stash.","back":"{name} hands the {weapon} back. It is in the stash.","none":"Nothing in the stash {he} can hold in one hand.","stash_full":"Your stash is full.","give_back":"HAND IT BACK"}} /* /__STAFF_RULES__ */;
  function readFile(j) {
    var v = j && j.followers && (j.followers.value || j.followers); if (!Array.isArray(v) || !v.length) return false;
    if (j.met_per_place && typeof j.met_per_place.value === 'number') PER_PLACE = Math.max(0, j.met_per_place.value | 0);
    if (j.staff && j.staff.value && typeof j.staff.value === 'object' && j.staff.value.stats) STAFF = j.staff.value;   /* __THE_STAFF_FIGHT_TOO__: a modder's staff line */
    ROWS = v; index(ROWS); LOADED.read = true; return true; }
  try {
    if (typeof module !== 'undefined' && module.exports && typeof require === 'function') {
      var fs0 = require('fs'), path0 = require('path'); readFile(JSON.parse(fs0.readFileSync(path0.join(__dirname, '../records/target/bb/retinue.json'), 'utf8')));
    } else if (typeof fetch !== 'undefined') {
      LOADED.asked = true;
      fetch((root.BOHEMIA_RETINUE_BASE || '../records/target/bb/') + 'retinue.json').then(function (r) { return r.ok ? r.json() : null; }).then(readFile).catch(function () {});
    }
  } catch (e) {}
  /* ==== /__THE_RETINUE_DATA__ ==== */
  function xpDrill(level) { if (!has('drill_sergeant')) return 1; var n = NUMS.drill_sergeant; return Math.max(1, n.xpFirst - n.xpLessEach * Math.max(0, (level | 0 || 1) - 1)); }
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
  /* __THE_RETINUE_DATA__: his price now (the file's, a hired paymaster's 15 percent off everybody else, rounded) */
  function price(id, h) {
    var r = row(id); if (!r) return 0; h = h || hired();
    var pay = (h.paymaster && id !== 'paymaster' && LIVE.paymaster && typeof LIVE.paymaster.wage === 'number') ? LIVE.paymaster.wage : 1;
    return Math.round((+r.price || 0) * pay);
  }
  /* every follower the camp can offer, the ones whose work the game does first, then the ones still shut (soon: the lane that
     does it), each with who he is, his face and his words (the file's rows; RUN TWO's shape kept: word, price, says, hireSays, soon) */
  function offer() {
    var h = hired(), met = state().met || {};
    var all = ROWS.filter(function (r) { return r && r.id; }).map(function (r0) { var r = row(r0.id) || r0;   /* __THE_STAFF_FIGHT_TOO__: the person now */
      return { id: r.id, word: WORD[r.id], name: r.name || WORD[r.id], was: r.was || '', look: r.look || null, price: price(r.id, h), says: r.does || '',
        ask: r.ask || '', line: r.ask || '', hireSays: r.joins || (WORD[r.id] + ' is with you.'), hired: !!h[r.id], soon: r.shut ? (r.shut || undefined) : undefined,
        who: r.was || '', met: met[r.id] || null }; });
    return all.filter(function (o) { return !o.soon; }).concat(all.filter(function (o) { return o.soon; }));
  }
  /* WHO IS IN THIS TOWN (RETINUE 11/7, rule 425(c): 'hired in a settlement'; Battle Brothers hires its retinue in a town): the hall
     of a place holds a few of the eighteen each week, dealt by the place's name and the week (the file's met_per_place), never one
     already with you and never one whose work no screen does; the same hand all week at that place */
  function seedOf(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0; return h; }
  function inTown(place, week, n) {
    var h = hired(), pool = ROWS.filter(function (r) { return r && r.id && !r.shut; }).map(function (r) { return r.id; });   /* dealt from all, then the ones with you stepped out: the rest of the hand stays */
    var x = seedOf('retinue:' + place + ':' + (week | 0)), rnd = function () { x = (Math.imul(x ^ (x >>> 15), 2246822507) + 0x6d2b79f5) >>> 0; return (x >>> 8) / 16777216; };
    for (var k = pool.length - 1; k > 0; k--) { var j = Math.floor(rnd() * (k + 1)), t = pool[k]; pool[k] = pool[j]; pool[j] = t; }
    return pool.slice(0, n == null ? PER_PLACE : n).filter(function (id) { return !h[id]; });
  }
  /* he was met in a town (the camp's row says where), and the looks of the ones with you (dealt to nobody else: ONE ID, ONE WHOLE PERSON) */
  function meet(id, place) { var s = state(); s.met = s.met || {}; if (row(id) && !s.met[id]) { s.met[id] = String(place || ''); save(s); } return s; }
  function looks() { var o = {}; retinue().forEach(function (id) { var r = row(id); if (r && r.look) o[r.look] = id; }); return o; }
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
  /* ==== __THE_STAFF_FIGHT_TOO__ (STAFF, VAMILY rule 468, Paolo 11/21: 'maybe they are forced to being in combat, they're roaming around
     with you, and the game becomes more about protecting your staff... if your staff permanently dies you gotta get new people at different
     settlements... they're not gonna have the best traits... they try to run away way quicker'; the design:
     records/BOHEMIA_RESEARCH_THE_STAFF_FIGHT_TOO_11_21_26.md section C). Every follower with you stands in every fight, as the person he is:
       BohemiaCamp.staffRules()      the file's staff block (the Indebted's stat line, the five bad traits, the knife, Wavering at the bell)
       BohemiaCamp.person(id)        who does this job now: the file's own person, or, after one died, a NEW person of the valley (a face
                                     nobody of yours wears and nobody dead wore, a name rolled for him, the same job, numbers and price)
       BohemiaCamp.staff()           the followers with you as the fight's people: id, name, look, his rolled numbers and his one bad trait,
                                     rolled once when he joined (from his id and which person he is) and kept, the same person every fight
       BohemiaCamp.lose(id, why, at) he died (or was taken): out of the retinue, his help gone with him (has/mult/plus read the retinue), his
                                     face on the dead list for good; the kind goes back in the town deal as a new person
       BohemiaCamp.dead()            the dead and the taken, newest last
       BohemiaCamp.deadLooks()       { look: id } every face that died, dealt to nobody again
     A new game clears it with the camp (one key). Words are drafts (rule 454(a)). */
  function staffRules() { return STAFF; }
  function lostOf(s, id) { return ((s.lost || {})[id]) | 0; }
  function deadLooks() { var o = {}; (state().dead || []).forEach(function (d) { if (d && d.look) o[d.look] = d.id; }); return o; }
  /* the faces in use: his company (the crew screen's hand-over and the men hired since), the man he made, every follower's own face (so
     a new cook never wears the scout's, hired or not), the camp's people now, and the dead */
  function facesTaken(s) {
    var o = {}; ROWS.forEach(function (r) { if (r && r.look) o[r.look] = 1; });
    try { ['bohemia.company.v1', 'bohemia.hired.v1'].forEach(function (k) { (JSON.parse(root.localStorage.getItem(k) || '[]') || []).forEach(function (m) { if (m && m.look) o[m.look] = 1; }); }); } catch (e) {}
    try { var mm = JSON.parse(root.localStorage.getItem('bohemia.main.v1') || 'null'); if (mm && mm.look) o[mm.look] = 1; } catch (e) {}
    var P = (s.persons || {}); for (var k in P) if (P[k] && P[k].look) o[P[k].look] = 1;
    (s.dead || []).forEach(function (d) { if (d && d.look) o[d.look] = 1; });
    return o;
  }
  /* a new person for a kind whose person died: a valley person whose body is on the fight's board and whose face is drawn (the people
     mix's fight people, the same pool the hall's post hires from, the place's own first), the first by this kind's own deal nobody wears */
  function newPerson(s, id, n) {
    var M = root.BOHEMIA_PEOPLE_MIX || (root.parent && root.parent !== root && root.parent.BOHEMIA_PEOPLE_MIX), taken = facesTaken(s), r = row0(id) || {};
    var ppl = M && M.people ? M.people.filter(function (p) { return p && p.fight && !p.company && !taken[p.look]; }) : [];
    var key = function (p) { return seedOf('staff:' + id + ':' + n + ':' + p.look); };
    ppl.sort(function (a, b) { return ((a.gang === 'town' ? 0 : 1) - (b.gang === 'town' ? 0 : 1)) || (key(a) - key(b)); });
    var p = ppl[0] || null, look = p ? p.look : (r.look || null), sex = p && p.sex === 'f' ? 'f' : 'm';
    var N = root.BohemiaNames || (root.parent && root.parent !== root && root.parent.BohemiaNames), name = null;
    try { if (N && N.roll) { var q = N.roll('staff:' + id + ':' + n, { sex: sex, look: look }); name = q && q.full; } } catch (e) {}
    if (!name) { var F = ['RAY', 'LINDA', 'TERRY', 'DONNA', 'LUIS', 'PAM', 'CARL', 'ROSA', 'DALE', 'JUNE'], L = ['MOORE', 'ORTIZ', 'HAYES', 'KIM', 'BAKER', 'SOTO', 'REED', 'LANE'];
      var h = seedOf('staffname:' + id + ':' + n); name = F[h % F.length] + ' ' + L[(h >>> 8) % L.length]; }
    return { n: n, name: name, look: look, sex: sex, draft: true };
  }
  /* who does this job now (the row's own person until one died) */
  function person(id) {
    var r = row0(id); if (!r) return null; var s = state(), n = lostOf(s, id);
    if (!n) return { id: id, n: 0, name: r.name, look: r.look, was: r.was, ask: r.ask, joins: r.joins, own: true };
    s.persons = s.persons || {};
    var P = s.persons[id];
    if (!P || P.n !== n) { P = s.persons[id] = newPerson(s, id, n); save(s); }
    return { id: id, n: n, name: P.name, look: P.look, sex: P.sex, was: '', ask: '', joins: '', own: false, draft: true };
  }
  /* his numbers, rolled once (his id and which person he is) and kept: the Indebted's ranges, one of the five bad traits on top */
  function staffRoll(s, id) {
    var R0 = STAFF || {}, ST = R0.stats || {}, n = lostOf(s, id); s.staffRoll = s.staffRoll || {};
    var k = s.staffRoll[id]; if (k && k.n === n && k.stats) return k;
    var x = seedOf('staffroll:' + id + ':' + n), rnd = function () { x = (Math.imul(x ^ (x >>> 15), 2246822507) + 0x6d2b79f5) >>> 0; return (x >>> 8) / 16777216; };
    var stats = {}; Object.keys(ST).forEach(function (q) { var a = ST[q]; stats[q] = a[0] + Math.floor(rnd() * (a[a.length - 1] - a[0] + 1)); });
    var TR = R0.traits || [], t = TR.length ? TR[Math.floor(rnd() * TR.length)] : null, eff = (R0.trait_effects || TRAIT_EFFECT)[t] || null;
    if (eff) for (var q2 in eff) if (typeof stats[q2] === 'number') stats[q2] += eff[q2];
    k = s.staffRoll[id] = { n: n, stats: stats, trait: t }; save(s); return k;
  }
  /* the five bad traits' flat numbers (records/target/bb/traits.json effects, each at_the_post), keyed by the fight's stat names */
  var TRAIT_EFFECT = { clumsy: { melee_skill: -5 }, craven: { resolve: -10 }, fainthearted: { resolve: -5 }, fragile: { hp: -10 }, hesitant: { initiative: -10 } };
  function staff() {
    var s = state(), R0 = STAFF || {};
    return s.retinue.filter(function (id) { return !!row0(id); }).map(function (id) {
      var p = person(id), k = staffRoll(state(), id);
      return { id: id, staff: true, name: p.name, look: p.look, sex: p.sex || null, role: WORD[id] || String(id).toUpperCase(), person: p.n,
        stats: Object.assign({}, k.stats), trait: k.trait, traits: k.trait ? [k.trait] : [], weapon: armsOf(id), starts: R0.starts || 'Wavering',
        top: R0.top || 'Steady', level: R0.level || 1, shakes: !!R0.shakes_fighters, cart: cartOf(id) };   /* __THE_STAFF_PUSH_A_CART__: his trade's one-hander, his cart */
    });
  }
  function lose(id, why, at) {
    var s = state(); if (s.retinue.indexOf(id) < 0) return null;
    var p = person(id), spilt = spill(id, why, at); s = state();   /* __THE_STAFF_PUSH_A_CART__: his cart goes over first (what it held is gone) */
    s.retinue = s.retinue.filter(function (x) { return x !== id; });
    s.dead = s.dead || []; s.lost = s.lost || {};
    var r0 = row0(id), d = { id: id, name: p ? p.name : id, look: p ? p.look : null, why: String(why || 'dead'), at: at || null, n: p ? p.n : 0, spilt: spilt,
      word: r0 && (r0.word || r0.bb) ? String(r0.word || r0.bb).toUpperCase() : null, sex: p && p.sex ? p.sex : (r0 && r0.sex) || null };   /* STAFF 2 (rule 482): his trade and his sex for the screens that mourn him */
    if (!d.sex && d.look) { var MX = root.BOHEMIA_PEOPLE_MIX || (root.parent && root.parent !== root && root.parent.BOHEMIA_PEOPLE_MIX), ml = MX && MX.people ? MX.people.filter(function (x) { return x && x.look === d.look; })[0] : null;
      if (ml && (ml.sex === 'f' || ml.sex === 'm')) d.sex = ml.sex;
      var NM = root.BohemiaNames || (root.parent && root.parent !== root && root.parent.BohemiaNames), fr = null;
      try { if (!d.sex && NM && NM.faceReads) { fr = NM.faceReads(d.look); if (fr === 'f' || fr === 'm') d.sex = fr; } } catch (e) {}
      try { if (!d.sex && NM && NM.sexOf) { fr = NM.sexOf(d.name); if (fr === 'f' || fr === 'm') d.sex = fr; } } catch (e) {} }   /* the row's own person: his body's sex, off the people's mix, else the face's read, else his given name's */
    s.dead.push(d); s.lost[id] = (s.lost[id] | 0) + 1;
    if (s.staffRoll) delete s.staffRoll[id];
    if (s.met) delete s.met[id];
    save(s); return d;
  }
  function dead() { return (state().dead || []).slice(); }
  /* ==== /__THE_STAFF_FIGHT_TOO__ ==== */
  /* ==== __THE_STAFF_PUSH_A_CART__ (STAFF 2, VAMILY rule 471, Paolo 11/22: 'they're forced to forever carry instead of a shield... it's like
     it's a shopping cart... maybe it could never be removed, maybe it could be upgraded... these characters can only use one-handed weapons,
     so either a pistol or like a one-handed melee... that shopping cart does reflect in the combat, like you'll see it'). The file's staff
     block (records/target/bb/retinue.json staff.cart and staff.arms, a modder's; numbers draft, TUNING's):
       BohemiaCamp.cartOf(id)       the cart his job pushes: its kind's row (word, the two defences from the front, fatigue, AP a tile, what it
                                    holds), its level, and what is in it now (stock kind and count, and the load the picture shows)
       BohemiaCamp.cartNext(id)     the next better cart and its price (batteries and tape), or null at the wagon
       BohemiaCamp.upgradeCart(id)  his job's cart one step up (the screen takes the price), its new cart
       BohemiaCamp.armsOf(id)       his one weapon by his trade: one-handed (a pistol or a one-handed blow), never two hands, never a shield
       BohemiaCamp.canHold(item)    STAFF 3: a stash item he may be handed (a weapon, one hand, no class of staff.arms.refuse_class)
       BohemiaCamp.giveArms(id, it) STAFF 3: he holds it instead of his trade's ({ ok, back }); takeArms(id) hands it back (the item)
       BohemiaCamp.armsItem(id)     STAFF 3: the stash item in his hand, or null (his trade's: tradeArms(id))
       BohemiaCamp.cartLoad(id)     what his cart holds of the company's count: { kind, n } (the camp's order: the first of a kind fills first)
     The cart is his job's, kept by the camp's book under his job's id (a new person in the job pushes the same cart); when he falls (lose) it
     goes over: what it held leaves the company's count (bohemia.supplies.v1), and the cart is kept only when his side held the field. ==== */
  function cartRules() { return (STAFF && STAFF.cart && Array.isArray(STAFF.cart.kinds) && STAFF.cart.kinds.length) ? STAFF.cart : null; }
  function cartLevel(id) { var C = cartRules(); if (!C) return 0; var v = ((state().carts || {})[id]) | 0; return Math.max(0, Math.min(C.kinds.length - 1, v)); }
  function supplies() { try { var w = JSON.parse(root.localStorage.getItem('bohemia.supplies.v1') || 'null'); return w && typeof w === 'object' ? w : {}; } catch (e) { return {}; } }
  function stockKind(id) { var C = cartRules(); return C && C.stock && C.stock[id] ? String(C.stock[id]) : null; }
  function cartLoad(id, sup) {
    var C = cartRules(), k = stockKind(id); if (!C || !k) return { kind: null, n: 0 };
    var w = sup || supplies(), left = Math.max(0, (k === 'food' && typeof w.water === 'number' ? Math.ceil(((w.food | 0) + (w.water | 0)) / 2) : (w[k] | 0)));
    var ret = state().retinue, n = 0;
    for (var i = 0; i < ret.length; i++) { if (stockKind(ret[i]) !== k) continue;
      var take = Math.min(left, (C.kinds[cartLevel(ret[i])] || {}).holds | 0); if (ret[i] === id) { n = take; break; } left -= take; }
    return { kind: k, n: n };
  }
  function cartOf(id) {
    var C = cartRules(); if (!C) return null;
    var lv = cartLevel(id), K = C.kinds[lv], ld = cartLoad(id);
    return { id: K.id, word: K.word, level: lv, top: C.kinds.length - 1, melee_defense: +K.melee_defense || 0, ranged_defense: +K.ranged_defense || 0,
      fatigue: +K.fatigue || 0, ap_per_tile: +K.ap_per_tile || 0, holds: +K.holds || 0, front_arc: C.front_arc == null ? 1 : +C.front_arc,
      stock: ld.kind, n: ld.n, load: ld.kind ? (ld.n > 0 ? ld.kind : 'empty') : 'gear', draft: true };
  }
  function cartNext(id) { var C = cartRules(); if (!C) return null; var K = C.kinds[cartLevel(id) + 1]; return K ? { id: K.id, word: K.word, price: +K.price || 0, tape: +K.tape || 0, level: cartLevel(id) + 1 } : null; }
  function upgradeCart(id) { var s = state(); if (s.retinue.indexOf(id) < 0 || !cartNext(id)) return null; s.carts = s.carts || {}; s.carts[id] = cartLevel(id) + 1; save(s); return cartOf(id); }
  function tradeArms(id) {
    var A = (STAFF && STAFF.arms) || null, w = A && A.by_trade && A.by_trade[id] ? A.by_trade[id] : (A && A.else) || STAFF.weapon || 'box_cutter';
    return String(w);
  }
  /* STAFF 3 11/27 (rule 471(b), the crew screen): a one-handed weapon handed to him from the stash rides in his hand instead of his
     trade's (records/target/bb/retinue.json staff.arms.given). The rule is the file's: a weapon, one hand, never a class in
     staff.arms.refuse_class (the fight's ranged classes and a thrown item; a pistol rides a dagger's row, so it is held). The fight
     still checks it on the board (staffArms). Kept with the job, as his cart is */
  function canHold(it) {
    var A = (STAFF && STAFF.arms) || {}, no = Array.isArray(A.refuse_class) ? A.refuse_class : [];
    return !!it && typeof it === 'object' && it.kind === 'weapon' && !!it.id && (it.hands | 0) === 1 && no.indexOf(String(it.cls || '')) < 0;
  }
  function armsItem(id) { var it = (state().arms || {})[id]; return canHold(it) ? it : null; }
  function armsOf(id) { var it = armsItem(id); return it ? String(it.id) : tradeArms(id); }
  /* hand him one: { ok, back } (back: what he held before, for the stash), or { ok: false, why: 'hands' | 'nobody' } */
  function giveArms(id, it) {
    var s = state(); if (s.retinue.indexOf(id) < 0) return { ok: false, why: 'nobody' }; if (!canHold(it)) return { ok: false, why: 'hands' };
    s.arms = s.arms || {}; var back = canHold(s.arms[id]) ? s.arms[id] : null; s.arms[id] = it; save(s); return { ok: true, back: back };
  }
  /* he hands it back: the item, for the stash (null when he held only his trade's) */
  function takeArms(id) { var s = state(), it = (s.arms || {})[id] || null; if (!it) return null; delete s.arms[id]; save(s); return canHold(it) ? it : null; }
  /* his cart goes over (he died, or was taken with the field): what it held leaves the company's count; the cart stays with his job only if
     his side held the field (at.held, the fight's won), else it is gone with the field and the next one in his job starts on the first cart */
  function spill(id, why, at) {
    var C = cartRules(); if (!C) return null;
    var w = supplies(), ld = cartLoad(id, w), kept = !!(at && at.held) && String(why || 'dead') !== 'taken', lv = cartLevel(id), out = { kind: ld.kind, n: 0, cart: (C.kinds[lv] || {}).id || null, kept: kept };
    if (ld.kind && ld.n > 0) {
      if (ld.kind === 'food' && typeof w.water === 'number') { w.food = Math.ceil(((w.food | 0) + (w.water | 0)) / 2); delete w.water; }
      w[ld.kind] = Math.max(0, (w[ld.kind] | 0) - ld.n); out.n = ld.n;
      try { root.localStorage.setItem('bohemia.supplies.v1', JSON.stringify(w)); } catch (e) {}
    }
    if (!kept && lv > 0) { var s = state(); s.carts = s.carts || {}; delete s.carts[id]; save(s); }
    if (!kept) { var s2 = state(); if (s2.arms && s2.arms[id]) { out.arms = s2.arms[id].name || s2.arms[id].id; delete s2.arms[id]; save(s2); } }   /* STAFF 3: the weapon he was handed goes with the field */
    return out;
  }
  /* ==== /__THE_STAFF_PUSH_A_CART__ ==== */
  root.BohemiaCamp = { READY: READY, xpDrill: xpDrill,
    /* __THE_STAFF_PUSH_A_CART__ */ cartOf: cartOf, cartNext: cartNext, upgradeCart: upgradeCart, armsOf: armsOf, cartLoad: cartLoad, cartLevel: cartLevel,
    /* STAFF 3 (rule 471(b)): the crew screen hands him a one-hander */ canHold: canHold, armsItem: armsItem, tradeArms: tradeArms, giveArms: giveArms, takeArms: takeArms,
    /* __THE_STAFF_FIGHT_TOO__ */ staffRules: staffRules, person: person, staff: staff, lose: lose, dead: dead, deadLooks: deadLooks, KEY: KEY, BASE_SLOTS: BASE_SLOTS, CART: CART, LIVE: LIVE, WORD: WORD, state: state, stashSlots: stashSlots, cart: cart, buyCart: buyCart,
    retinue: retinue, has: has, hired: hired, offer: offer, hire: hire, letGo: letGo, mult: mult, plus: plus, look: look, MORE: MORE, NUMS: NUMS, moreOf: moreOf, scavenge: scavenge,
    /* __THE_RETINUE_DATA__ (RETINUE 11/7) */ row: row, rows: rows, workOf: workOf, price: price, inTown: inTown, meet: meet, looks: looks, LOADED: LOADED,
    get PER_PLACE() { return PER_PLACE; } };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.BohemiaCamp;
})(typeof window !== 'undefined' ? window : this);
