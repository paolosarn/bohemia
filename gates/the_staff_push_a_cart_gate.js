#!/usr/bin/env node
/* THE STAFF PUSH A CART (STAFF 2, 11/22, VAMILY rule 471; Paolo 11/22: 'the servants of your crew, not regular fighters but cooks or medics or
   blacksmith or whatever, they're forced to forever carry instead of a shield... it's like it's a shopping cart... it can be a one-handed
   slot. Maybe it could never be removed, maybe it could be upgraded... these characters can only use one-handed weapons, so either a pistol
   or like a one-handed melee... that shopping cart does reflect in the combat, like you'll see it'). The build:
   records/BOHEMIA_STAFF_THE_STAFF_PUSH_A_CART_11_22_26.md. On the live fight's own rules (tools/bohemia_fight_headless.js, the page's
   scripts unchanged), the camp's own book (engine/bohemia_camp.js) and the files a modder edits:
     C1  THE DATA: retinue.json staff.cart has three kinds, each better against a blade than a bullet, each step at least as strong as the one
         before, each slowing him a tile; the first is free; the engine's copy is the file's
     C2  ONLY THE CAMP PUSHES ONE: over seeded boards every staff member has his camp book's cart, no fighter of either side has one, and no
         staff member holds a shield, a bag or a swap
     C3  ONE HAND: every staff member's weapon is one-handed (a pistol or a one-handed blow); a two-hander, a shield, a bow or a long gun in
         his camp book is refused (the box cutter); the trades' own: the blacksmith's hammer, the cab driver's snub revolver
     C4  FROM THE FRONT: a blow from each of the three tiles the cart faces meets its melee defence and a shot its ranged defence; from the
         other five nothing; on the live chance, the front costs the attacker exactly the cart's points
     C5  IT SLOWS HIM: every tile he pushes it costs its ap_per_tile more, and his walk reaches fewer tiles than the same man's without it
     C6  IT FACES: at the bell, and every time he stops in a played AUTO fight, the cart faces the nearest man of theirs on the field
     C7  ITS WEIGHT: his fatigue pool is the cart's fatigue under the same man's without it
     C8  THE STOCK AND THE SPILL: each trade's cart holds its kind of the company's count up to what it holds, the first of a kind first;
         when he falls what it held leaves the count; the cart stays with his job when the field was held, and is gone when it was lost
     C9  THE UPGRADE: the shopping cart, the steel utility cart and the wagon, each at its price; a step past the wagon does nothing; the
         upgraded cart is the one the fight hands him, with its defences
     C10 THE PICTURES: slices/fight_rig/staff_carts.json names a sheet for every kind, every load in it, every facing, a back and a tip (a
         front where any of the cart stands before him), every cell inside its sheet, and the sheets are on disk
     C11 THE HOOKS: the fight draws the back under his body and the front over it, the fallen's tip under him; the camp and the map draw it
     C12 THE FIGHT STILL PLAYS: AUTO fights with carts against the same fights with none: printed, the camp's deaths and his wins
   PLANTED FAILS: --plant patches the fight in memory: the cart guards from every side, a staff member keeps a two-hander, and a fighter is
   handed a cart: C2, C3 and C4 must go red, exit 1.
     node gates/the_staff_push_a_cart_gate.js           the gate
     node gates/the_staff_push_a_cart_gate.js --plant   the planted fight: C2, C3, C4 red
     node gates/the_staff_push_a_cart_gate.js --quick   C12 on fewer fights */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process');
const ROOT = path.join(__dirname, '..');
const PLANT = process.argv.includes('--plant'), QUICK = process.argv.includes('--quick');
let pass = 0, fail = 0;
const red = [];
const ok = (name, cond, why) => { if (cond) pass++; else { fail++; red.push(name.split(' ')[0]); } console.log((cond ? '  ok   ' : '  FAIL ') + name + (why ? '  [' + why + ']' : '')); };

const store = {};
global.window = { localStorage: { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } } };
require(path.join(ROOT, 'engine/bohemia_people_mix.js'));
require(path.join(ROOT, 'engine/bohemia_names.js'));
const CAMP = require(path.join(ROOT, 'engine/bohemia_camp.js'));
const { engine } = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
const patch = PLANT ? rules => rules
  .replace("return Math.min(k, 8 - k) <= t.cart.front_arc;", "return true;")
  .replace("function staffArms(w) { return !!w && w.hands === 1", "function staffArms(w) { return !!w || w.hands === 1")
  .replace("    const ps = pistolShot(u.weapon); if (ps) u.weapon = ps;", "    const ps = pistolShot(u.weapon); if (ps) u.weapon = ps; if (!u.staff && u.side === 'you' && !u.main && !u.cart) u.cart = { id: 'shopping_cart', melee_defense: 8, ranged_defense: 3, fatigue: -6, ap_per_tile: 1, front_arc: 1, load: 'gear' };") : null;
const ctx = engine(patch ? { patch } : {}), F = ctx.FIGHT;
const ctx0 = engine({ patch: r => r.replace("cart: staffCart(p.cart), cartFace: 2 });", "cart: null, cartFace: 2 });") }), F0 = ctx0.FIGHT;   /* the control: the same rules with no cart */
const RET = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/retinue.json'), 'utf8'));
const CART = RET.staff.value.cart, KINDS = CART.kinds;

function freshCamp(ids, sup) { Object.keys(store).forEach(k => delete store[k]); ids.forEach(id => CAMP.hire(id)); if (sup) store['bohemia.supplies.v1'] = JSON.stringify(sup); return CAMP.staff(); }
function men(n, lv) { const o = []; for (let i = 0; i < n; i++) o.push({ background: 'daytaler', level: lv || 2 }); return o; }
function play(Fx, limit) { let g = 0; while (!Fx.S.over && g < (limit || 20000)) { const u = Fx.current(); if (!u) break; Fx.aiStep(u); g++; } return Fx.S; }
const d8 = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
const dirOf = (dx, dy) => (Math.round(Math.atan2(dx, dy) / (Math.PI / 4)) % 8 + 8) % 8;
const nearest = (S, u) => S.units.filter(f => f.side !== u.side && F.onField(f) && !f.decoy).sort((p, q) => Math.abs(p.x - u.x) + Math.abs(p.y - u.y) - Math.abs(q.x - u.x) - Math.abs(q.y - u.y))[0];

/* C1 THE DATA */
{
  const ids = KINDS.map(k => k.id).join(',');
  const blade = KINDS.every(k => k.melee_defense > k.ranged_defense), up = KINDS.every((k, i) => !i || (k.melee_defense >= KINDS[i - 1].melee_defense && k.ranged_defense >= KINDS[i - 1].ranged_defense && k.holds >= KINDS[i - 1].holds));
  const slow = KINDS.every(k => k.ap_per_tile >= 1), free = KINDS[0].price === 0 && KINDS[0].tape === 0, costs = KINDS.slice(1).every((k, i) => k.price > KINDS[i].price);
  let baked = false; try { cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_retinue_bake.js'), '--check'], { stdio: 'pipe' }); baked = true; } catch (e) {}
  ok('C1 THE DATA: three carts, each better against a blade than a bullet, each step stronger, each slowing him, the first free; the engine copy is the file',
    KINDS.length === 3 && blade && up && slow && free && costs && baked && !!CAMP.staffRules().cart,
    ids + '; ' + KINDS.map(k => k.melee_defense + '/' + k.ranged_defense + ' ' + k.price + 'b+' + k.tape + 't').join(', ') + (baked ? '' : '; the engine copy differs'));
}

/* C2, C3 over seeded boards: the camp with five trades, one of them handed a two-hander and one a longbow in his book */
{
  let staffN = 0, cartOk = 0, fighterCarts = 0, shields = 0, oneHand = 0, refused = 0, why = '';
  const trades = ['cook', 'scout', 'surgeon', 'blacksmith', 'paymaster'];
  for (let i = 0; i < 40; i++) {
    const st = freshCamp(trades, { food: 50, meds: 9, tape: 30, rounds: 0 });
    if (i % 2) { st[0] = Object.assign({}, st[0], { weapon: 'greatsword' }); st[4] = Object.assign({}, st[4], { weapon: 'hunting_bow' }); }
    ctx.setSeed(300 + i);
    const fac = ['brigands', 'beasts', 'water', 'house', 'wolves'][i % 5];
    F.setup({ auto: true, formation: null, company: men(7 + (i % 4)), cap: 12, staff: st, party: { count: 8, faction: fac, days: 3 + i % 9 } });
    F.S.units.forEach(u => {
      if (u.staff) { staffN++;
        const book = st.find(p => p.id === u.staffId);
        if (u.cart && book && u.cart.id === book.cart.id && u.cart.load === book.cart.load && u.cart.melee_defense === book.cart.melee_defense) cartOk++; else if (!why) why = u.name + ' cart ' + JSON.stringify(u.cart && u.cart.id);
        if (u.shield || u.shieldBack || (u.bag && u.bag.length)) shields++;
        const w = u.weapon.of || u.weapon;
        if (w.hands === 1 && !F._t.bothHands(u.weapon) && (!F.isRanged(u.weapon) || F.isGun(u.weapon))) oneHand++;
        if (i % 2 && (u.staffId === 'cook' || u.staffId === 'paymaster') && w.id === 'box_cutter') refused++;
      } else if (u.cart) fighterCarts++;
    });
  }
  ok('C2 ONLY THE CAMP PUSHES ONE: every staff member his book\'s cart, no fighter of either side a cart, no staff member a shield, a bag or a swap',
    staffN > 0 && cartOk === staffN && fighterCarts === 0 && shields === 0, staffN + ' staff, ' + cartOk + ' with their cart, ' + fighterCarts + ' fighters with a cart, ' + shields + ' staff with a shield or bag' + (why ? '; ' + why : ''));
  const bs = freshCamp(['blacksmith', 'scout', 'bounty_hunter', 'cook']).map(p => p.weapon).join(',');
  ok('C3 ONE HAND: every staff member one-handed; a greatsword and a hunting bow in his book refused for the box cutter; the blacksmith\'s hammer, the cab driver\'s and the skip tracer\'s snub revolver',
    oneHand === staffN && refused === 40 && bs === 'pickaxe,snub_revolver,snub_revolver,box_cutter', oneHand + ' of ' + staffN + ' one-handed, ' + refused + ' of 40 refused; trades ' + bs);
}

/* C4 FROM THE FRONT, C5 IT SLOWS HIM, C7 ITS WEIGHT: one staff member on an open board, a man of theirs set round him tile by tile */
{
  const st = freshCamp(['cook'], { food: 10 });
  ctx.setSeed(41); F.setup({ auto: true, formation: null, company: men(6), cap: 12, staff: st, party: { count: 4, faction: 'brigands', days: 4 } });
  const u = F.S.units.find(v => v.staff), them = F.S.units.filter(v => v.side === 'them');
  const c = u.cart;
  let right = 0, rows = [];
  const face = u.cartFace;
  for (let d = 0; d < 8; d++) {
    const vec = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]][d];   /* the fight's eight, S first */
    const a = { x: u.x + vec[0], y: u.y + vec[1] }, k = Math.min(Math.abs(d - face) % 8, 8 - Math.abs(d - face) % 8), inArc = k <= c.front_arc;
    const m = F.cartDef(u, 'melee_defense', a), r = F.cartDef(u, 'ranged_defense', a);
    if (inArc ? (m === c.melee_defense && r === c.ranged_defense) : (m === 0 && r === 0)) right++;
    rows.push(d + (inArc ? 'F' : '.') + m);
  }
  /* the live chance: a man of theirs in front against the same man behind (moved, nothing else changed) */
  const a = them.find(v => !F.isRanged(v.weapon)) || them[0], keep = { x: a.x, y: a.y }, ku = { x: u.x, y: u.y }, fv = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]][face], bv = [-fv[0], -fv[1]];
  /* the others stood off the board for the measure, so nobody else stands round him (Battle Brothers' surround would move the number) */
  const off = F.S.units.filter(v => v !== a && v !== u).map(v => [v, v.x, v.y]); off.forEach(o => { o[0].x = -50; o[0].y = -50; });
  const open = (x, y) => F._t.passable(x, y) && x >= 0 && y >= 0 && x < F.S.w && y < F.S.h && !(F.level && F.level(x, y) > 0);
  let gap = null, same = false;
  for (let y = 1; y < F.S.h - 1 && gap === null; y++) for (let x = 1; x < F.S.w - 1 && gap === null; x++) {
    if (!open(x, y) || !open(x + fv[0], y + fv[1]) || !open(x + bv[0], y + bv[1])) continue;
    u.x = x; u.y = y;
    a.x = x + fv[0]; a.y = y + fv[1]; const cf = F.hitChance(a, u).chance;
    a.x = x + bv[0]; a.y = y + bv[1]; const cb = F.hitChance(a, u).chance;
    u.mdef += c.melee_defense; const cb2 = F.hitChance(a, u).chance; u.mdef -= c.melee_defense;   /* the same man from behind with the cart's points on his own defence */
    if (cb < 95 && cf > 5) { gap = cb - cf; same = cf === cb2; }   /* off the caps */
  }
  off.forEach(o => { o[0].x = o[1]; o[0].y = o[2]; }); a.x = keep.x; a.y = keep.y; u.x = ku.x; u.y = ku.y;
  ok('C4 FROM THE FRONT: the cart\'s ' + c.melee_defense + '/' + c.ranged_defense + ' from the three tiles it faces, nothing from the other five; the live chance from the front ' + (gap === null ? '?' : gap) + ' under the back, exactly his own defence ' + c.melee_defense + ' higher (through the fight\'s nerve and cap)',
    right === 8 && gap > 0 && same, rows.join(' ') + '; facing ' + face);
  /* C5: the same man with and without the cart */
  const r1 = Object.keys(F._t.reach(u).best).length, keepC = u.cart; u.cart = null; const r0 = Object.keys(F._t.reach(u).best).length; u.cart = keepC;
  ok('C5 IT SLOWS HIM: his walk with the cart reaches fewer tiles than without it (one more AP a tile)', r1 < r0 && keepC.ap_per_tile >= 1, r1 + ' tiles with the cart, ' + r0 + ' without');
  const f1 = F.fatMax(u); u.cart = null; const f0 = F.fatMax(u); u.cart = keepC;
  ok('C7 ITS WEIGHT: his fatigue pool is the cart\'s ' + keepC.fatigue + ' under the same man\'s without it', f1 - f0 === keepC.fatigue, f1 + ' with, ' + f0 + ' without');
}

/* C6 IT FACES: at the bell, and every stop in played AUTO fights */
{
  const st = freshCamp(['cook', 'surgeon', 'scout']);
  let bell = 0, bellN = 0, stops = 0, right = 0;
  for (let i = 0; i < 20; i++) {
    ctx.setSeed(700 + i);
    F.setup({ auto: true, formation: null, company: men(7), cap: 12, staff: st, party: { count: 8, faction: ['brigands', 'beasts', 'water', 'house'][i % 4], days: 5 } });
    F.S.units.filter(u => u.staff).forEach(u => { bellN++; const n = nearest(F.S, u); if (n && u.cartFace === dirOf(n.x - u.x, n.y - u.y)) bell++; });
    const S = F.S; let g = 0;
    while (!S.over && g < 20000) { const u = F.current(); if (!u) break; const was = u.staff ? { x: u.x, y: u.y } : null; F.aiStep(u); g++;
      if (was && (u.x !== was.x || u.y !== was.y) && F.onField(u)) { stops++; const n = nearest(S, u); if (!n || u.cartFace === dirOf(n.x - u.x, n.y - u.y)) right++; } }
  }
  ok('C6 IT FACES: at the bell and at every stop in 20 AUTO fights the cart faces the nearest man of theirs', bellN > 0 && bell === bellN && stops > 0 && right === stops, bell + ' of ' + bellN + ' at the bell, ' + right + ' of ' + stops + ' stops');
}

/* C8 THE STOCK AND THE SPILL */
{
  freshCamp(['cook', 'blacksmith', 'scavenger', 'scout'], { food: 13, tape: 30, meds: 2, rounds: 7 });
  const ck = CAMP.cartOf('cook'), bl = CAMP.cartOf('blacksmith'), sv = CAMP.cartOf('scavenger'), sc = CAMP.cartOf('scout');
  const fills = ck.stock === 'food' && ck.n === 13 && ck.load === 'food' && bl.n === 20 && sv.n === 10 && sc.stock === null && sc.load === 'gear';
  const d1 = CAMP.lose('blacksmith', 'dead', { held: true }), sup1 = JSON.parse(store['bohemia.supplies.v1']);
  const keptLv = (JSON.parse(store['bohemia.camp.v1']).carts || {}).blacksmith;
  CAMP.hire('blacksmith'); CAMP.upgradeCart('blacksmith');
  const before = CAMP.cartLevel('blacksmith'); const d2 = CAMP.lose('blacksmith', 'taken', { held: false }), after = CAMP.cartLevel('blacksmith');
  freshCamp(['cook'], { food: 0 }); const empty = CAMP.cartOf('cook');
  ok('C8 THE STOCK AND THE SPILL: the cook holds 13 food, the blacksmith 20 tape and the scavenger the other 10, the scout his gear; the blacksmith falls on a held field: 20 tape gone, his cart kept; taken with a lost field: the cart gone; no food, an empty cart',
    fills && d1.spilt.n === 20 && sup1.tape === 10 && keptLv === undefined && before === 1 && after === 0 && d2.spilt.kept === false && empty.load === 'empty',
    [ck.n, bl.n, sv.n, sc.load].join('/') + '; spilt ' + JSON.stringify(d1.spilt) + ' tape left ' + sup1.tape + '; level ' + before + ' -> ' + after + '; empty ' + empty.load);
}

/* C9 THE UPGRADE */
{
  freshCamp(['surgeon']);
  const n1 = CAMP.cartNext('surgeon'); const u1 = CAMP.upgradeCart('surgeon'); const n2 = CAMP.cartNext('surgeon'); const u2 = CAMP.upgradeCart('surgeon'); const n3 = CAMP.cartNext('surgeon'), u3 = CAMP.upgradeCart('surgeon');
  const st = CAMP.staff(); ctx.setSeed(99); F.setup({ auto: true, formation: null, company: men(6), cap: 12, staff: st, party: { count: 4, faction: 'brigands', days: 4 } });
  const u = F.S.units.find(v => v.staff);
  ok('C9 THE UPGRADE: a shopping cart, then a steel utility cart (' + KINDS[1].price + ' and ' + KINDS[1].tape + ' tape), then a wagon (' + KINDS[2].price + ' and ' + KINDS[2].tape + '), nothing past it; the fight hands him the wagon',
    n1 && n1.id === 'utility_cart' && u1.id === 'utility_cart' && n2.id === 'wagon' && u2.id === 'wagon' && n3 === null && u3 === null && u.cart.id === 'wagon' && u.cart.melee_defense === KINDS[2].melee_defense,
    [n1 && n1.id, u1 && u1.id, n2 && n2.id, u2 && u2.id, n3, u3, u && u.cart && u.cart.id].join(' '));
}

/* C10 THE PICTURES */
{
  let J = null; try { J = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_rig/staff_carts.json'), 'utf8')); } catch (e) {}
  const DIR8 = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'], LOADS = ['food', 'meds', 'tape', 'rounds', 'gear', 'empty'];
  let cells = 0, bad = [], fronts = 0;
  if (J) KINDS.forEach(k => { const K = J.kinds[k.id]; if (!K) { bad.push(k.id + ' no sheet'); return; }
    let W = 0, H = 0; const f = path.join(ROOT, 'slices/fight_rig', K.file);
    if (!fs.existsSync(f)) { bad.push(K.file + ' missing'); return; }
    const b = fs.readFileSync(f); if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 12, 16) === 'VP8L') { const v = b.readUInt32LE(21); W = (v & 0x3fff) + 1; H = ((v >> 14) & 0x3fff) + 1; }
    LOADS.forEach(l => DIR8.forEach(d => { const q = K.cells[l] && K.cells[l][d]; if (!q || !q.back || !q.tip) { bad.push(k.id + '/' + l + '/' + d); return; }
      ['back', 'front', 'tip'].forEach(w => { const c = q[w]; if (!c) return; cells++; if (w === 'front') fronts++; if (W && (c[0] + c[2] > W || c[1] + c[3] > H)) bad.push(k.id + '/' + l + '/' + d + '/' + w + ' outside'); }); }));
    if (['S', 'SE', 'SW'].some(d => !(K.cells.food[d] && K.cells.food[d].front))) bad.push(k.id + ' no front where the cart stands before him'); });
  ok('C10 THE PICTURES: three sheets, six loads, eight facings, a back and a tip each, a front where the cart stands before him, every cell inside its sheet',
    !!J && !bad.length && cells > 0, J ? cells + ' cells (' + fronts + ' fronts)' + (bad.length ? '; ' + bad.slice(0, 4).join(', ') : '') : 'no staff_carts.json');
}

/* C11 THE HOOKS (the drawing lives on pages; its proof on the glass is tools/bohemia_staff_cart_on_the_phone.js) */
{
  const fh = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8'), cl = fs.readFileSync(path.join(ROOT, 'slices/bohemia_camp_look.js'), 'utf8'), cw = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html'), 'utf8'), ss = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');
  const b = fh.indexOf("cartLayer(v, 'back', ox, oy, s, now);"), h = fh.indexOf('const held = crawlDraw(v, p, L, gs, ox, oy, s, now)'), o = fh.indexOf("laidDraw(v, 'over', p, L, gs, ox, oy, s, now);"), fr = fh.indexOf("cartLayer(v, 'front', ox, oy, s, now);");
  const ok1 = b > 0 && h > b && o > 0 && fr > o && /down \? 'tip' : which/.test(fh);
  const ok2 = /campCart\(cx, ctx, m, x, y, s, H, 'back', now\)/.test(cl) && /campCart\(cx, ctx, m, x, y, s, H, 'front', now\)/.test(cl);
  const ok3 = /mapCampDraw\(__gx,__gy,__lift,__moving,__G\)/.test(cw) && /function mapCampDraw/.test(cw);
  const ok4 = /homeCartRows\(acts, k, t, guard\)/.test(ss) && /C\.upgradeCart\(id\)/.test(ss) && /supplyAdd\('tape', -n2\.tape\)/.test(ss);
  ok('C11 THE HOOKS: the fight lays the back under his body and the front over it (the tip when he fell), the camp and the map draw it, the forge welds it up',
    ok1 && ok2 && ok3 && ok4, ['fight ' + ok1, 'camp ' + ok2, 'map ' + ok3, 'forge ' + ok4].join(', '));
}

/* C12 THE FIGHT STILL PLAYS (printed): the same AUTO fights with the carts and with none */
{
  const N = QUICK ? 40 : 120, st = freshCamp(['cook', 'scout', 'surgeon'], { food: 30, meds: 10 });
  const run = (Fx, cx) => { let won = 0, dead = 0, rounds = 0;
    for (let i = 0; i < N; i++) { cx.setSeed(900 + i); Fx.setup({ auto: true, formation: null, company: men(8), cap: 12, staff: st, party: { count: 8, faction: ['brigands', 'beasts', 'water', 'house', 'wolves'][i % 5], days: 3 + i % 9 } });
      play(Fx); if (Fx.S.result === 'won') won++; rounds += Fx.S.round; dead += Fx.S.units.filter(u => u.staff && u.dead).length; }
    return { won: won / N, dead: dead / (3 * N), rounds: rounds / N }; };
  const a = run(F, ctx), b = run(F0, ctx0);
  ok('C12 THE FIGHT STILL PLAYS: ' + N + ' AUTO fights, 8 of his and 3 staff: with the carts ' + (100 * a.won).toFixed(1) + '% won, ' + (100 * a.dead).toFixed(1) + '% of the camp dead, ' + a.rounds.toFixed(1) + ' rounds; with none ' + (100 * b.won).toFixed(1) + '%, ' + (100 * b.dead).toFixed(1) + '%, ' + b.rounds.toFixed(1),
    Math.abs(a.won - b.won) <= 0.1 && a.dead <= b.dead + 0.08 && a.rounds <= b.rounds * 1.3);
}

console.log('THE STAFF PUSH A CART: ' + pass + ' passed, ' + fail + ' failed' + (red.length ? ' (' + red.join(', ') + ')' : ''));
if (PLANT) { const want = ['C2', 'C3', 'C4'], hit = want.every(w => red.includes(w)); console.log(hit ? 'PLANTED: C2, C3 and C4 went red, as they must' : 'PLANTED: NOT ALL OF C2, C3, C4 WENT RED: ' + red.join(', ')); process.exit(1); }
process.exit(fail ? 1 : 0);
