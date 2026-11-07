/* THE CARCASS AND THE VULTURES, AND THE PACK THAT LETS YOU GO (WORLD 11, 11/6/26; VAMILY rules 392, 386, 413(c)(f); ask lines 427,
   418, 465). Paolo 11/4: 'I just killed some lions... can we put it in a shopping cart and haul it back... letting them know the
   location of the corpses for immediate retrieval and then you get extra batteries'; 'my sister said vultures, don't forget it';
   11/6: 'if I retreat and run away, I should be fully able to get away from a battle'.
   ON THE DEMO HE PLAYS (phone held up), on the map off any town's ground:
     C0 a beast fight through the one door (the shell's own end, its spoils, home): the beasts that died lie on the map beside where
        the fight was, one heap, the meat their own kilos x the share x how cleanly each died
     C1 a clean kill keeps more meat than a torn one
     C2 it is drawn: the animal on its side, its plate (what, kilos, FRESH and the hours), the birds over it
     C3 the clock he can see: FRESH, then TURNING, then GONE on the valley's clock; more birds as it turns, and they land
     C4 HAUL IT: a real tap on its plate, a real tap on HAUL IT: the dressing hours pass on the clock, the cart holds what it holds,
        the rest is left; the company walks slower with it
     C5 EAT IT from the cart: the company's food for two nights, the rest still in the cart
     C6 a town reached with the cart: the butcher (or the Mob's stew) pays for it in batteries, by how fresh it is
     C7 TELL a town, from far off (real taps): their carts walk out, bring it in, and he is paid when it comes in
     C8 LEAVE IT: two game days later something hungry lives there, and the next hunt from a town in reach starts at its den
     V1 the vultures circle a fight's dead men too, and a boss's yard when one is found
     V2 he comes to the dead: the birds lift, and one stays on it and does not fly
     V3 they follow a company that leaves bodies behind (more kills, more birds over him), and leave him when he stops
     V4 they never attack the living: no card, no fight from any of this
     V5 their picture is a stand-in and is marked as one (rule 408(c)); the redraw that turns them is cheap
     P1 a pack of beasts he fell back from (the meet card's FALL BACK) has lost him for good
     P2 camped two blocks from that pack for two game days: no card from it, it never comes within two blocks
     P3 walking past it for hours, not at it: no card from it
     P4 THE BEFORE (PACK_LETS_GO off): the same camp, and the pack's card came back on its own
     P5 his own chase on it asks first (the meet card), never a fight on its own
     R  nothing threw on any page.
   node gates/the_carcass_and_the_vultures_gate.js */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms, every) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(every || 250); } return null; }
let pass = 0, fail = 0, d = null;
const errs = [];
function ok(name, good, why) { if (good) pass++; else fail++; console.log('  ' + (good ? 'ok  ' : 'FAIL') + ' ' + name + (why ? '  [' + why + ']' : '')); }
const OFF_TOWN = () => { const N = om.n; let best = null, bd = 1e9;
  for (let y = 6; y < N - 6; y++) for (let x = 6; x < N - 6; x++) { if (!cityWalkable(x, y)) continue; let near = false;
    for (let a = -5; a <= 5 && !near; a++) for (let b = -5; b <= 5 && !near; b++) if (townGround(x + a, y + b) || townSafeAt(x + a, y + b)) near = true;
    if (near) continue; let open = 0; for (const q of DIRS) if (cityWalkable(x + q[0], y + q[1])) open++; if (open < 6) continue;
    const dd = Math.max(Math.abs(x - city.x), Math.abs(y - city.y)); if (dd < bd) { bd = dd; best = [x, y]; } }
  if (best) { try { travelStop(); } catch (e) {} city.x = best[0]; city.y = best[1]; try { camHold(); render(); } catch (e) {} } return best; };
const CLEAN = () => { try { if (LOOP.open) loopClose(); } catch (e) {} try { if (window.CAMP && CAMP.on) campBreak('left'); } catch (e) {} try { if (window.MEET && MEET.up) MEET_DONE(false); } catch (e) {} try { contactClear(); } catch (e) {} try { travelStop(); } catch (e) {} };
const NOW = () => T.day * 1440 + T.min;
const AWAY = (n) => { const c = BohemiaCarcass.state().list[0]; if (!c) return null; for (const q of [[n, 0], [0, n], [-n, 0], [0, -n], [n, n], [-n, -n]]) { const x = c.at[0] + q[0], y = c.at[1] + q[1]; if (cityWalkable(x, y) && !townGround(x, y)) { city.x = x; city.y = y; try { camHold(); render(); } catch (e) {} return [x, y]; } } return null; };

/* a real finger on something the carcass drew, by its own box; if the finger does not take, the file's own tap (and the gate says so) */
async function tapWhat(match, label) {
  const fr = d.fr, p = d.page;
  await fr.evaluate(() => { try { render(); } catch (e) {} }); await sleep(250);
  const box = await fr.evaluate((m) => { const H = BohemiaCarcass.hits(); for (let i = H.length - 1; i >= 0; i--) { const w = H[i].what || {}; let good = true; for (const k in m) if (w[k] !== m[k]) good = false; if (good) return { x: H[i].x + H[i].w / 2, y: H[i].y + H[i].h / 2 }; } return null; }, match);
  if (!box) return { how: 'NOT DRAWN' };
  const fb = await (await fr.frameElement()).boundingBox(), cr = await fr.evaluate(() => { const c = document.querySelector('canvas'); const r = c.getBoundingClientRect(); return { x: r.x, y: r.y }; });
  const before = await fr.evaluate(() => JSON.stringify([window.__CARCASS_ACT || null, window.__CARCASS_PICK || null, BohemiaCarcass.dressing(), (BohemiaCarcass.state().cart || {}).kg]));
  await p.touchscreen.tap(fb.x + cr.x + box.x, fb.y + cr.y + box.y); await sleep(500);
  const after = await fr.evaluate(() => JSON.stringify([window.__CARCASS_ACT || null, window.__CARCASS_PICK || null, BohemiaCarcass.dressing(), (BohemiaCarcass.state().cart || {}).kg]));
  if (after !== before) return { how: 'a tap' };
  await fr.evaluate((b) => BohemiaCarcass.tap(b.x, b.y), box); await sleep(300);
  return { how: 'the plate\'s own tap (' + label + ': the finger landed on something over it)' };
}

(async () => {
  console.log('\nTHE CARCASS AND THE VULTURES (rules 392, 386, 413(c)): the demo, phone_portrait');
  d = await D.open({ profile: 'phone_portrait' });
  d.page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const fr = d.fr, p = d.page;
  await waitFor(() => fr.evaluate(() => MODE === 'city' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED && window.BohemiaCarcass && BohemiaCarcass.ready()), 60000);
  await fr.evaluate(CLEAN); await fr.evaluate(() => { BohemiaCarcass.reset(); window.GNOW = () => T.day * 1440 + T.min; });
  const at = await fr.evaluate('(' + OFF_TOWN + ')()');
  if (!at) { ok('a block off any town\'s ground', false, 'none'); return finish(); }

  /* ---------------- C0: a beast fight through the one door ---------------- */
  console.log('\nTHE CARCASS');
  const fights0 = await fr.evaluate(() => (window.__JOB_FIGHTS | 0));
  await fr.evaluate(() => { cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: 'giant lions', faction: null, draft: true, roster: [{ arch: 'beast' }, { arch: 'beast' }],
    party: { count: 2, faction: 'prides', days: 1, difficulty: 1 }, street: true, why: 'gate:carcass', at: { gx: city.x, gy: city.y }, __met: true }); });
  const f = await waitFor(async () => { const e = await p.$('#fightFrame'), c = e && await e.contentFrame(); return c && await c.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.units && FIGHT.S.units.length) ? true : null) ? c : null; }, 60000);
  let killed = null;
  if (f) {
    await waitFor(() => p.evaluate(() => !window.NFC || NFC.state === 'off'), 20000);
    killed = await f.evaluate(() => { const out = []; FIGHT.S.units.forEach((u, i) => { if (u.side !== 'them') return; u.hp = 0; u.dead = true; u.injuries = out.length === 0 ? [] : [{ kind: 'temporary' }, { kind: 'temporary' }, { kind: 'temporary' }]; out.push({ kind: u.kind, beast: !!u.beast, hurt: u.injuries.length }); }); return out; });
    await p.evaluate(() => { const fw = document.getElementById('fightFrame').contentWindow; nfOverIn({ type: 'BOHEMIA_FIGHT_OVER', result: 'won', rounds: 2 }, fw); });
    const gone = () => p.evaluate(() => !document.getElementById('spoilsdoor') && !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on'));
    await waitFor(async () => { if (await gone()) return true; const e = await p.$('#spoilsdoor iframe'), sf = e && await e.contentFrame(), lb = sf && await sf.$('#leave');
      if (lb) { await lb.evaluate(x => x.scrollIntoView({ block: 'center' })).catch(() => {}); const b = await lb.boundingBox(); if (b && b.width >= 2) await p.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); await sleep(1200); }
      return (await gone()) || null; }, 90000, 600);
    await waitFor(() => fr.evaluate(() => MODE === 'city' && window.__FIGHT_CAME_HOME), 15000); await sleep(1800);
  }
  const c0 = await fr.evaluate((k) => { const s = BohemiaCarcass.state(), c = s.list[s.list.length - 1] || null, L = BohemiaCarcass.last().born.slice(-1)[0] || null;
    const want = (k || []).filter(b => b.beast).reduce((a, b) => a + BohemiaCarcass.meatOf(BohemiaCarcass.data().kinds[b.kind] ? b.kind : 'default', b.hurt), 0);
    return { c: c ? { n: c.n, kg: c.kg, label: c.label, at: c.at, clean: c.clean } : null, from: L ? L.bodies : null, want, here: [city.x, city.y], home: window.__FIGHT_CAME_HOME || null }; }, killed);
  ok('C0 a beast fight through the one door: what died lies beside where the fight was, its meat from its own kilos', !!f && !!c0.c && c0.from === true && c0.c.n === (killed || []).filter(b => b.beast).length && c0.c.kg === c0.want && Math.max(Math.abs(c0.c.at[0] - at[0]), Math.abs(c0.c.at[1] - at[1])) <= 1,
    !f ? 'NO FIGHT OPENED' : (c0.c ? c0.c.n + ' ' + c0.c.label + ', ' + c0.c.kg + ' kg (want ' + c0.want + ', ' + c0.c.clean + '% of a clean kill), at ' + c0.c.at + ' (the fight at ' + at + '); the bodies came home in the outcome: ' + c0.from + '; killed ' + JSON.stringify(killed) : 'NO CARCASS; came home ' + JSON.stringify(c0.home)));
  /* from here the gate lays its carcasses through the same door the fight's end uses (fightHome), at a known place */
  const lay = (kind, n, hurt) => fr.evaluate((a) => { const b = []; for (let i = 0; i < a.n; i++) b.push({ kind: a.kind, beast: true, hurt: a.hurt | 0 }); return BohemiaCarcass.fightHome({ outcome: { dead: a.n, bodies: b, result: 'win' }, at: { gx: city.x, gy: city.y } }); }, { kind, n, hurt });

  const c1 = await fr.evaluate(() => ({ clean: BohemiaCarcass.meatOf('american_lion', 0), torn: BohemiaCarcass.meatOf('american_lion', 3), lion: BohemiaCarcass.meatOf('mountain_lion', 0), coyote: BohemiaCarcass.meatOf('coyote', 0) }));
  ok('C1 a clean kill keeps more meat than a torn one', c1.clean > c1.torn && c1.torn >= c1.clean * 0.5, 'an American lion clean ' + c1.clean + ' kg, three wounds ' + c1.torn + ' kg; a mountain lion ' + c1.lion + ', a coyote ' + c1.coyote);

  await fr.evaluate(() => { BohemiaCarcass.reset(); try { camHold(); render(); } catch (e) {} });
  await lay('american_lion', 1, 0); await fr.evaluate('(' + AWAY + ')(4)'); await sleep(600);
  const c2 = await fr.evaluate(() => { render(); const D = window.__CARCASS_DREW || {}, P = D.labels || []; return { D, P }; });
  ok('C2 it is drawn: the animal on its side, its plate, the birds over it', c2.D.carcass >= 1 && c2.P.some(t => /AMERICAN LION · 135 KG · FRESH \dH/.test(t)) && c2.D.circling >= 1, JSON.stringify(c2.P) + '; ' + c2.D.circling + ' circling');

  /* C3: the clock */
  const seen = await fr.evaluate(() => { const s = BohemiaCarcass.state(), c = s.list[0], out = []; let last = null;
    for (let h = 0; h < 60 && BohemiaCarcass.stateOf(c) !== 'bones'; h++) { advance(60); render(); const D = window.__CARCASS_DREW || {}, st = BohemiaCarcass.stateOf(c);
      if (st !== last) { out.push({ h: h + 1, age: Math.round(c.age / 60), st, circling: D.circling, perched: D.perched, plate: ((window.__CARCASS_DREW || {}).labels || [])[0] || null }); last = st; } }
    return out; });
  const sOf = (w) => seen.filter(x => x.st === w)[0];
  ok('C3 the clock he can see: FRESH, TURNING, GONE on the valley\'s clock; more birds as it turns, and they land', !!sOf('turning') && !!sOf('gone') && /TURNING/.test(sOf('turning').plate || '') && sOf('turning').circling > c2.D.circling && (sOf('gone').perched | 0) >= 1,
    seen.map(x => x.st + ' after ' + x.h + ' game h (its own clock ' + x.age + ' h; nights run slow) ' + x.circling + ' circling ' + x.perched + ' landed ' + JSON.stringify(x.plate)).join('; '));

  /* C4: HAUL IT */
  await fr.evaluate(() => { BohemiaCarcass.reset(); try { camHold(); render(); } catch (e) {} });
  await lay('american_lion', 1, 0); await sleep(400);
  const t4 = await fr.evaluate(NOW), b4 = await fr.evaluate(() => loopBats());
  const tp1 = await tapWhat({ open: true }, 'its plate');
  const ways = await fr.evaluate(() => { render(); return (window.__CARCASS_DREW || {}).ways || null; });
  const tp2 = await tapWhat({ act: 'haul' }, 'HAUL IT');
  await waitFor(() => fr.evaluate(() => !BohemiaCarcass.dressing() && BohemiaCarcass.last().hauled), 30000, 300);
  const c4 = await fr.evaluate((t0) => { const s = BohemiaCarcass.state(), c = s.list[0], H = BohemiaCarcass.last().hauled; const x = city.x, y = city.y, with_ = cityStepMins(x, y), keep = s.cart; s.cart = null; const without = cityStepMins(x, y); s.cart = keep;
    return { mins: GNOW() - t0, need: H && H.need, cart: s.cart ? s.cart.kg : 0, left: c ? c.kg : null, pace: BohemiaCarcass.pace(), slow: Math.round(with_ / without * 100) / 100 }; }, t4);
  ok('C4 HAUL IT (' + tp1.how + ', then ' + tp2.how + '): the dressing hours pass on the clock, the cart holds what it holds, the rest is left; the company walks slower',
    !!ways && ways[0] === 'haul' && c4.need === 3 && c4.mins >= 180 && c4.cart === 120 && c4.left === 15 && c4.pace === 1.5 && c4.slow === 1.5,
    'the ways ' + JSON.stringify(ways) + '; ' + c4.mins + ' game minutes for ' + c4.need + ' h of knives; ' + c4.cart + ' kg in the cart, ' + c4.left + ' kg left; a block takes x' + c4.slow);

  /* C5: EAT IT */
  const w5 = await fr.evaluate(() => ({ food: (wagonGet() || { food: 0 }).food | 0, crew: crewCount(), cart: BohemiaCarcass.state().cart.kg }));
  const tp3 = await tapWhat({ cart: true, open: true }, 'the cart');
  const tp4 = await tapWhat({ cart: true, act: 'eat' }, 'EAT IT');
  const c5 = await fr.evaluate(() => ({ food: (wagonGet() || { food: 0 }).food | 0, cart: (BohemiaCarcass.state().cart || {}).kg | 0 }));
  ok('C5 EAT IT from the cart (' + tp3.how + ', ' + tp4.how + '): two nights of food for the company, the rest still in the cart', c5.food - w5.food === w5.crew * 2 && c5.cart === w5.cart - w5.crew,
    'food ' + w5.food + ' -> ' + c5.food + ' for ' + w5.crew + ' men; the cart ' + w5.cart + ' -> ' + c5.cart + ' kg');

  /* C6: a town reached with the cart */
  const c6 = await fr.evaluate(() => { const bs = ctBases(); let tn = null, bd = 1e9; for (const n in bs) { const b = bs[n]; const dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd < bd) { bd = dd; tn = { name: n, x: b.x | 0, y: b.y | 0 }; } }
    const kg = BohemiaCarcass.state().cart.kg, st = BohemiaCarcass.stateOf(BohemiaCarcass.state().cart), D = BohemiaCarcass.data(), stew = D.pay.stew_towns.some(s => tn.name.toLowerCase().indexOf(s.toLowerCase()) >= 0);
    const want = Math.round(kg * D.pay[stew ? 'stew_per_kg' : 'butcher_per_kg'][st]), b0 = loopBats(); const x0 = city.x, y0 = city.y;
    city.x = tn.x; city.y = tn.y; loopArrived([city.x, city.y]); const sold = BohemiaCarcass.last().sold.slice(-1)[0] || null, b1 = loopBats();
    return { town: tn.name, kg, st, want, stew, got: b1 - b0, sold, cart: BohemiaCarcass.state().cart, back: [x0, y0] }; });
  await sleep(800); await fr.evaluate((b) => { try { if (LOOP.open) loopClose(); } catch (e) {} city.x = b[0]; city.y = b[1]; try { camHold(); render(); } catch (e) {} }, c6.back); await sleep(500);
  ok('C6 a town reached with the cart: ' + (c6.stew ? 'the Mob\'s stew' : 'the butcher') + ' pays in batteries by how fresh it is', !!c6.sold && c6.got === c6.want && c6.want > 0 && !c6.cart,
    c6.town + ': ' + c6.kg + ' kg ' + c6.st + ', paid ' + c6.got + ' (want ' + c6.want + ')');

  /* C7: TELL */
  await fr.evaluate(() => { BohemiaCarcass.reset(); try { camHold(); render(); } catch (e) {} });
  await lay('sabre_tooth', 1, 0);
  await fr.evaluate(() => { const c = BohemiaCarcass.state().list[0]; let best = null; for (const q of [[8, 0], [0, 8], [-8, 0], [0, -8], [6, 6], [-6, -6]]) { const x = c.at[0] + q[0], y = c.at[1] + q[1]; if (cityWalkable(x, y) && !townGround(x, y)) { best = [x, y]; break; } } if (best) { city.x = best[0]; city.y = best[1]; } try { camHold(); render(); } catch (e) {} });
  await sleep(400);
  const tp5 = await tapWhat({ open: true }, 'its plate, from far off');
  const ways7 = await fr.evaluate(() => { render(); return (window.__CARCASS_DREW || {}).ways || null; });
  const b7 = await fr.evaluate(() => loopBats());
  const tp6 = await tapWhat({ act: 'tell' }, 'TELL');
  const c7 = await fr.evaluate(() => { const s = BohemiaCarcass.state(), k = s.told[0]; if (!k) return null; const kg = s.list[0].kg; let carts = 0;
    advance(Math.max(10, Math.round((k.there - GNOW()) / 2))); render(); carts = (window.__CARCASS_DREW || {}).carts | 0;
    for (let i = 0; i < 40 && !k.done; i++) advance(30);
    const L = BohemiaCarcass.last().told.slice(-1)[0] || null; return { town: k.town, kg, carts, state: k.state, paid: L ? L.paid : null, want: L ? Math.round(kg * BohemiaCarcass.data().pay.tell_per_kg[L.state]) : null, leg: Math.round((k.there - k.left) / 60 * 10) / 10 }; });
  const g7 = await fr.evaluate(() => loopBats()), led7 = await fr.evaluate(() => { const e = (purseGet().entries || []).filter(x => /^told /.test(String(x.reason))); return e.length ? e[e.length - 1].amount : null; });
  ok('C7 TELL from far off (' + tp5.how + ', ' + tp6.how + '): their carts walk out and bring it in, and he is paid when it comes in', !!ways7 && ways7.indexOf('tell') >= 0 && ways7[0] === 'go' && !!c7 && c7.carts >= 1 && c7.paid === c7.want && c7.paid > 0 && led7 === c7.paid,
    c7 ? 'the ways ' + JSON.stringify(ways7) + '; ' + c7.town + "'s carts, " + c7.leg + ' h out; got there ' + c7.state + '; ' + c7.kg + ' kg; paid ' + c7.paid + ' (want ' + c7.want + '); the purse ' + b7 + ' -> ' + g7 : 'NEVER TOLD');

  /* C8: LEAVE IT, and the den */
  await fr.evaluate(() => { BohemiaCarcass.reset(); try { camHold(); render(); } catch (e) {} });
  await lay('american_lion', 1, 0); await sleep(300);
  const tp7 = await tapWhat({ open: true }, 'its plate');
  const tp8 = await tapWhat({ act: 'leave' }, 'LEAVE IT');
  const c8 = await fr.evaluate(() => { const c = BohemiaCarcass.state().list[0], spot = c.at.slice(), left = !!c.left; for (let i = 0; i < 120 && !BohemiaCarcass.state().dens.length; i++) advance(60);
    const den = BohemiaCarcass.state().dens[0] || null; if (!den) return { left, spot, den: null };
    const bs = ctBases(); let tn = null, bd = 1e9; for (const n in bs) { const b = bs[n]; const dd = Math.max(Math.abs(b.x - spot[0]), Math.abs(b.y - spot[1])); if (dd < bd) { bd = dd; tn = { name: n, x: b.x | 0, y: b.y | 0 }; } }
    const job = { id: 'gate-den-' + Date.now(), title: 'Hunt them', pay: 40, skulls: 1 }; let made = false; try { made = BohemiaJobKinds.make(job, { id: 'qd-aa15', title: 'Hunt them' }, tn, null, true); } catch (e) { made = String(e); }
    return { left, spot, den, town: tn.name, dist: bd, made, pack: job.packs && job.packs[0] ? [job.packs[0].x, job.packs[0].y, job.packs[0].faction] : null, posts: (window.BOHEMIA_FEED && BOHEMIA_FEED.read ? '' : '') }; });
  const inReach = c8.dist >= 6 && c8.dist <= 19;
  ok('C8 LEAVE IT (' + tp7.how + ', ' + tp8.how + '): days later something hungry lives there' + (inReach ? ', and the next hunt from ' + c8.town + ' starts at its den' : ''),
    c8.left && !!c8.den && c8.den.at[0] === c8.spot[0] && c8.den.at[1] === c8.spot[1] && c8.den.kind === 'hyenas' && (!inReach || (!!c8.pack && c8.pack[0] === c8.spot[0] && c8.pack[1] === c8.spot[1])),
    'the den ' + JSON.stringify(c8.den) + '; the nearest town ' + c8.town + ' ' + c8.dist + ' blocks off' + (inReach ? '; its hunt\'s first pack ' + JSON.stringify(c8.pack) : ' (out of a hunt\'s reach: the den leg only)'));

  /* ---------------- THE VULTURES ---------------- */
  console.log('\nTHE VULTURES');
  const fightsV0 = await fr.evaluate(() => ({ f: window.__JOB_FIGHTS | 0, meet: window.__MEET_UP ? JSON.stringify(window.__MEET_UP) : null }));
  await fr.evaluate(() => { BohemiaCarcass.reset(); try { camHold(); render(); } catch (e) {} });
  await fr.evaluate(() => BohemiaCarcass.fightHome({ outcome: { dead: 3, bodies: [{ kind: 'brigand', beast: false }, { kind: 'brigand', beast: false }, { kind: 'brigand', beast: false }], result: 'win' }, at: { gx: city.x + 2, gy: city.y } }));
  const v1 = await fr.evaluate(() => { render(); const D = window.__CARCASS_DREW || {}; let boss = null; try { const hm = BohemiaHisMap.state(); boss = hm && hm.boss ? { sign: !!hm.boss.sign, found: Object.keys(hm.boss.found || {}).length } : null; } catch (e) {} return { dead: D.dead, circling: D.circling, boss: D.boss, hm: boss }; });
  ok('V1 they circle a fight\'s dead men too' + (v1.hm && (v1.hm.sign || v1.hm.found) ? ', and the boss\'s yard' : ''), v1.dead >= 1 && v1.circling >= 1 && (!(v1.hm && (v1.hm.sign || v1.hm.found)) || v1.boss >= 1), JSON.stringify(v1));
  await fr.evaluate(() => { BohemiaCarcass.reset(); }); await lay('mountain_lion', 2, 0);
  const v2 = await fr.evaluate(() => { const c = BohemiaCarcass.state().list[0]; for (let i = 0; i < 4; i++) advance(60); const x0 = city.x, y0 = city.y; let far = null;
    for (const q of [[5, 0], [0, 5], [-5, 0], [0, -5]]) { if (cityWalkable(c.at[0] + q[0], c.at[1] + q[1])) { city.x = c.at[0] + q[0]; city.y = c.at[1] + q[1]; break; } }
    camHold(); render(); const A = Object.assign({}, window.__CARCASS_DREW); city.x = c.at[0] === x0 && c.at[1] === y0 ? x0 + 1 : x0; city.y = y0; if (Math.max(Math.abs(city.x - c.at[0]), Math.abs(city.y - c.at[1])) > 1) { city.x = c.at[0] + 1; city.y = c.at[1]; }
    camHold(); render(); const B = Object.assign({}, window.__CARCASS_DREW); return { away: { circling: A.circling, perched: A.perched, still: A.still }, by: { circling: B.circling, perched: B.perched, still: B.still } }; });
  ok('V2 he comes to the dead: the birds lift, and one stays on it and does not fly', v2.away.still === 0 && v2.by.still === 1 && v2.by.perched >= 1, 'from five blocks ' + JSON.stringify(v2.away) + '; beside it ' + JSON.stringify(v2.by));
  /* the picture for the VOTE tab: the kill a few hours old, from three blocks off, the birds over it, one already down on it */
  try {
    await fr.evaluate(() => { const c = BohemiaCarcass.state().list[0]; for (let i = 0; i < 7; i++) advance(60); for (const q of [[3, 0], [0, 3], [-3, 0], [0, -3], [3, 3]]) { if (cityWalkable(c.at[0] + q[0], c.at[1] + q[1])) { city.x = c.at[0] + q[0]; city.y = c.at[1] + q[1]; break; } } camHold(); render(); });
    await sleep(1500);
    const pb2 = await fr.evaluate(() => { const H = BohemiaCarcass.hits().filter(h => h.what && h.what.open && h.what.carcass)[0]; const r = document.getElementById('cv').getBoundingClientRect(); return H ? { x: r.x + H.x + H.w / 2, y: r.y + H.y } : null; });
    const fb = await (await fr.frameElement()).boundingBox();
    if (pb2) { const W = Math.min(fb.width, 380), Hh = 300, cx = Math.max(fb.x, Math.min(fb.x + fb.width - W, fb.x + pb2.x - W / 2)), cy = Math.max(fb.y, fb.y + pb2.y - 200);
      await p.screenshot({ path: path.join(ROOT, 'records/target/WORLD_11_THE_CARCASS_AND_THE_VULTURES.jpg'), type: 'jpeg', quality: 84, clip: { x: cx, y: cy, width: W, height: Hh } }); }
  } catch (e) { console.log('  (no picture: ' + String(e).slice(0, 80) + ')'); }
  const v3 = await fr.evaluate(() => { const s = BohemiaCarcass.state(); s.list = []; s.dead = []; s.kills = [{ t: GNOW(), n: 4 }, { t: GNOW(), n: 5 }]; render(); const a = (window.__CARCASS_DREW || {}).following | 0;
    s.kills = [{ t: GNOW(), n: 30 }]; render(); const b = (window.__CARCASS_DREW || {}).following | 0; for (let i = 0; i < 50; i++) advance(60); render(); const c = (window.__CARCASS_DREW || {}).following | 0; return { nine: a, thirty: b, later: c }; });
  ok('V3 they follow a company that leaves bodies behind, and leave him when he stops', v3.nine === 2 && v3.thirty === 5 && v3.later === 0, 'nine down in two days: ' + v3.nine + ' over him; thirty: ' + v3.thirty + ' (the most); two quiet days later: ' + v3.later);
  const fightsV1 = await fr.evaluate(() => ({ f: window.__JOB_FIGHTS | 0, up: !!(window.MEET && MEET.up), fighting: !!LOOP.fighting, frame: !!window.parent.document.getElementById('fightFrame') }));
  ok('V4 they never attack the living: no card, no fight from any of this', fightsV1.f === fightsV0.f && !fightsV1.up && !fightsV1.fighting && !fightsV1.frame, JSON.stringify(fightsV1));
  await fr.evaluate(() => { BohemiaCarcass.reset(); try { render(); } catch (e) {} }); await sleep(800);
  await fr.evaluate(() => { window.__GATE_RENDERS = 0; if (!window.__GATE_RWRAP) { const r0 = window.render; window.render = function () { window.__GATE_RENDERS++; return r0.apply(this, arguments); }; window.__GATE_RWRAP = r0; } });
  await sleep(3000);
  const base5 = await fr.evaluate(() => { const n = window.__GATE_RENDERS; if (window.__GATE_RWRAP) { window.render = window.__GATE_RWRAP; window.__GATE_RWRAP = null; } return n; });
  await lay('american_lion', 1, 0); await fr.evaluate('(' + AWAY + ')(4)'); await sleep(800);
  await fr.evaluate(() => { window.__GATE_RENDERS = 0; window.__GATE_SKY0 = BohemiaCarcass.sky().frames; if (!window.__GATE_RWRAP) { const r0 = window.render; window.render = function () { window.__GATE_RENDERS++; return r0.apply(this, arguments); }; window.__GATE_RWRAP = r0; } });
  await sleep(3000);
  const v5b = await fr.evaluate(() => { const k = BohemiaCarcass.sky(); const out = { stand: BohemiaCarcass.data().vultures.stand_in === true, drew: (window.__CARCASS_DREW || {}).standIn === true, renders: window.__GATE_RENDERS, frames: k.frames - window.__GATE_SKY0, ms: k.ms, birds: k.birds, layer: !!document.getElementById('vulturesky'), px: k.px, mb: k.px ? Math.round(k.px[0] * k.px[1] * 4 / 1e4) / 100 : null, glass: [document.getElementById('cv').width, document.getElementById('cv').height] };
    if (window.__GATE_RWRAP) { window.render = window.__GATE_RWRAP; window.__GATE_RWRAP = null; } return out; });
  ok('V5 their picture is a stand-in, marked as one; they turn on their own small layer, never by redrawing the map', v5b.stand && v5b.drew && v5b.layer && v5b.birds >= 1 && v5b.frames >= 30 && v5b.renders <= base5 + 2 && v5b.ms < 4 && v5b.mb != null && v5b.mb <= 2.5,
    'stand_in ' + v5b.stand + ', drawn as one ' + v5b.drew + '; in 3 s: ' + v5b.frames + ' frames of the sky (' + v5b.birds + ' birds, the last ' + v5b.ms + ' ms), ' + v5b.renders + ' redraws of the map (' + base5 + ' in the same 3 s with no birds: the map\'s own); the layer ' + JSON.stringify(v5b.px) + ' = ' + v5b.mb + ' MB against the glass\'s ' + JSON.stringify(v5b.glass));

  /* ---------------- THE PACK THAT LETS HIM GO ---------------- */
  console.log('\nA PACK OF BEASTS HE RAN FROM');
  async function packRun(before) {
    await fr.evaluate(CLEAN); await fr.evaluate(() => { BohemiaCarcass.reset(); LOOP.held = LOOP.held.filter(j => !/^gate-pack/.test(j.id)); MEET_BACK.list = []; });
    await fr.evaluate('(' + OFF_TOWN + ')()');
    const setup = await fr.evaluate((bf) => { BohemiaJobKinds.letGo.on = !bf;
      const bs = ctBases(); let tn = null, bd = 1e9; for (const n in bs) { const b = bs[n]; const dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd < bd) { bd = dd; tn = { name: n, x: b.x | 0, y: b.y | 0 }; } }
      const job = { id: 'gate-pack-' + Date.now(), title: 'Hunt the wolves', pay: 40, skulls: 1 }; let made = false; try { made = BohemiaJobKinds.make(job, { id: 'qd-aa15', title: 'Hunt the wolves' }, tn, null, false); } catch (e) { made = String(e); }
      if (!job.packs || !job.packs.length) return { made, why: 'no pack made' };
      job.packs = job.packs.slice(0, 1); const pk = job.packs[0]; pk.x = city.x + 1; pk.y = city.y; pk.home = [pk.x, pk.y]; pk.n = 3; LOOP.held.push(job);
      if (!cityWalkable(pk.x, pk.y)) { pk.x = city.x; pk.y = city.y + 1; pk.home = [pk.x, pk.y]; }
      window.__MEET_UP = null; const before = JSON.stringify(window.__MEET_LAST || null);
      meetWalk(() => mapStepWorld());   /* his step: the pack beside him is the fight, the card first */
      const up = !!(window.MEET && MEET.up); if (up) MEET_DONE(false);   /* FALL BACK */
      return { made, id: job.id, up, shy: pk.shy, pack: [pk.x, pk.y], at: [city.x, city.y], fell: window.__MEET_FELL_BACK | 0 }; }, !!before);
    return setup;
  }
  async function campNear(id, hours, tag) {
    await fr.evaluate((id) => { const j = LOOP.held.filter(x => x.id === id)[0], pk = j.packs[0]; let best = null;
      for (let y = pk.y - 3; y <= pk.y + 3 && !best; y++) for (let x = pk.x - 3; x <= pk.x + 3 && !best; x++) if (Math.max(Math.abs(x - pk.x), Math.abs(y - pk.y)) === 2 && cityWalkable(x, y) && !townGround(x, y)) best = [x, y];
      if (best) { city.x = best[0]; city.y = best[1]; } try { camHold(); render(); } catch (e) {} }, id);
    const made = await fr.evaluate(() => { try { return !!BohemiaMapCamp.make(); } catch (e) { return false; } });
    const t0 = await fr.evaluate(NOW); let cards = 0, fights = 0, minD = 99, broke = 0;
    for (let i = 0; i < hours * 2 + 40; i++) { await sleep(500);
      const s = await fr.evaluate((id) => { const j = LOOP.held.filter(x => x.id === id)[0], pk = j && j.packs[0]; return { t: GNOW(), meet: !!(window.MEET && MEET.up), why: window.MEET && MEET.up ? String(MEET.up.msg.why) : null, fight: !!LOOP.fighting || !!window.parent.document.getElementById('fightFrame'), camp: !!(window.CAMP && CAMP.on), d: pk ? Math.max(Math.abs(pk.x - city.x), Math.abs(pk.y - city.y)) : 99 }; }, id);
      if (s.d < minD) minD = s.d;
      if (s.meet && /^contract:gate-pack/.test(s.why)) { cards++; await fr.evaluate(() => { try { MEET_DONE(false); } catch (e) {} }); }
      else if (s.meet) await fr.evaluate(() => { try { MEET_DONE(false); } catch (e) {} });
      if (s.fight) fights++;
      if (!s.camp) { broke++; await fr.evaluate(() => { try { BohemiaMapCamp.make(); } catch (e) {} }); }
      if (s.t - t0 >= hours * 60) break; }
    const t1 = await fr.evaluate(NOW); await fr.evaluate(() => { try { if (window.CAMP && CAMP.on) campBreak('left'); } catch (e) {} });
    return { made, hours: Math.round((t1 - t0) / 60), cards, fights, minD, broke };
  }
  const stillNear = (id) => fr.evaluate((id) => { const j = LOOP.held.filter(x => x.id === id)[0], pk = j.packs[0]; pk.home = [pk.x, pk.y]; let best = null;
    for (let y = pk.y - 3; y <= pk.y + 3 && !best; y++) for (let x = pk.x - 3; x <= pk.x + 3 && !best; x++) if (Math.max(Math.abs(x - pk.x), Math.abs(y - pk.y)) === 2 && cityWalkable(x, y) && !townGround(x, y)) best = [x, y];
    if (best) { city.x = best[0]; city.y = best[1]; } try { travelStop(); } catch (e) {}
    let cards = 0, minD = 99, steps = 0; for (let i = 0; i < 1500; i++) { meetWalk(() => mapStepWorld()); steps++; minD = Math.min(minD, Math.max(Math.abs(pk.x - city.x), Math.abs(pk.y - city.y)));
      if (window.MEET && MEET.up) { if (/^contract:gate-pack/.test(String(MEET.up.msg.why))) cards++; MEET_DONE(false); if (best) { city.x = best[0]; city.y = best[1]; } } if (LOOP.fighting) break; }
    return { steps, cards, minD, on: BohemiaJobKinds.letGo.on }; }, id);
  const pk = await packRun(false);
  ok('P1 a pack of beasts he fell back from has lost him for good', pk.up && pk.shy >= 1e8, JSON.stringify(pk));
  /* him beside the pack, standing still, then the world's own steps (a camp's, a rest's): the exact way it used to come back */
  const besideIt = (id, steps, wander) => fr.evaluate((a) => { const j = LOOP.held.filter(x => x.id === a.id)[0], pk = j.packs[0]; pk.home = [pk.x, pk.y]; let best = null;
    for (const q of [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) if (cityWalkable(pk.x + q[0], pk.y + q[1]) && !townGround(pk.x + q[0], pk.y + q[1])) { best = [pk.x + q[0], pk.y + q[1]]; break; }
    if (best) { city.x = best[0]; city.y = best[1]; } try { travelStop(); } catch (e) {}
    let cards = 0, fights = 0, dist = []; for (let i = 0; i < a.steps; i++) { if (a.wander) { pk.x = city.x + 1; pk.y = city.y; if (!cityWalkable(pk.x, pk.y)) { pk.x = city.x; pk.y = city.y + 1; } }   /* its wander ends beside him */
      meetWalk(() => mapStepWorld()); dist.push(Math.max(Math.abs(pk.x - city.x), Math.abs(pk.y - city.y)));
      if (window.MEET && MEET.up) { if (/^contract:gate-pack/.test(String(MEET.up.msg.why))) cards++; MEET_DONE(false); if (best) { city.x = best[0]; city.y = best[1]; } }
      if (window.parent.document.getElementById('fightFrame')) fights++; }
    return { steps: a.steps, cards, fights, dist: dist.slice(0, 8).join(' '), last: dist[dist.length - 1] }; }, { id, steps, wander: !!wander });
  if (pk.id) {
    /* P3: walking past it, not at it: journeys that go by the pack on to somewhere else, at his speed */
    const p3 = await fr.evaluate(async (id) => { const j = LOOP.held.filter(x => x.id === id)[0], pk = j.packs[0]; let cards = 0, walks = 0, minD = 99, steps = 0, tried = [];
      try { travelStop(); } catch (e) {}
      const ring = []; for (let y = pk.y - 6; y <= pk.y + 6; y++) for (let x = pk.x - 6; x <= pk.x + 6; x++) if (Math.max(Math.abs(x - pk.x), Math.abs(y - pk.y)) === 6 && cityWalkable(x, y) && !townGround(x, y)) ring.push([x, y]);
      const pairs = []; ring.forEach((a, i) => { let best = null, bd = -1; ring.forEach(b => { const dd = Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])); if (dd > bd) { bd = dd; best = b; } }); if (best && bd >= 10 && i % Math.max(1, Math.floor(ring.length / 6)) === 0) pairs.push([a, best]); });
      for (const pr of pairs.slice(0, 4)) { const a = pr[0], b = pr[1];
        city.x = a[0]; city.y = a[1]; const go = travelTo(0, 0, b); tried.push(!!go); if (!go) continue; walks++; travelSpeedSet(4);
        for (let k = 0; k < 600 && TRAVEL; k++) { await new Promise(r => setTimeout(r, 25)); minD = Math.min(minD, Math.max(Math.abs(pk.x - city.x), Math.abs(pk.y - city.y))); steps++;
          if (window.MEET && MEET.up) { if (/^contract:gate-pack/.test(String(MEET.up.msg.why))) cards++; MEET_DONE(false); } }
        try { travelStop(); } catch (x) {} }
      return { walks, cards, minD, polls: steps, tried, shy: pk.shy >= 1e8 }; }, pk.id);
    ok('P3 walking past it at his speed, not at it: no card from it', p3.walks >= 2 && p3.cards === 0 && p3.shy, JSON.stringify(p3));
    /* P5: his own chase on it asks (the meet card), never a fight on its own: a tap on the pack (the job's own chase) and the walk after it */
    const p5 = await fr.evaluate(async (id) => { const j = LOOP.held.filter(x => x.id === id)[0], pk = j.packs[0]; try { travelStop(); } catch (e) {}
      let st0 = null; for (const q of [[4, 0], [0, 4], [-4, 0], [0, -4]]) if (cityWalkable(pk.x + q[0], pk.y + q[1])) { st0 = [pk.x + q[0], pk.y + q[1]]; break; } if (st0) { city.x = st0[0]; city.y = st0[1]; }
      j.chase = pk.id; travelTo(0, 0, [pk.x, pk.y]); travelSpeedSet(4); let up = false, why = null, page = false;
      for (let k = 0; k < 400 && !up; k++) { await new Promise(r => setTimeout(r, 25)); if (window.MEET && MEET.up) { up = true; why = String(MEET.up.msg.why); } if (window.parent.document.getElementById('fightFrame')) page = true; if (!TRAVEL && !up && k > 40) break; }
      if (up) MEET_DONE(false); try { travelStop(); } catch (e) {}
      j.chase = null; return { up, why, fightPage: page, d: Math.max(Math.abs(pk.x - city.x), Math.abs(pk.y - city.y)) }; }, pk.id);
    ok('P5 his own chase on it asks first (the meet card), never a fight on its own', p5.up && /^contract:gate-pack/.test(p5.why || '') && !p5.fightPage, JSON.stringify(p5));
    const p2 = await campNear(pk.id, 48, 'after');
    ok('P2 camped two blocks from that pack for two game days: no card from it, never within two blocks', p2.made && p2.hours >= 48 && p2.cards === 0 && p2.fights === 0 && p2.minD >= 2, JSON.stringify(p2));
    const p2b = await stillNear(pk.id);
    ok('P2b standing two blocks off for 1500 of the world\'s steps (about ten game days): no card from it, never within two blocks', p2b.cards === 0 && p2b.minD >= 2, JSON.stringify(p2b));
    const p2c = await besideIt(pk.id, 12);
    ok('P2c he walks right up beside it and stands: it gives ground, no card from its own step', p2c.cards === 0 && p2c.fights === 0 && p2c.last >= 2, JSON.stringify(p2c));
    const p2d = await besideIt(pk.id, 12, true);
    ok('P2d its own wander ends beside him, twelve times over: no card from it, no fight', p2d.cards === 0 && p2d.fights === 0, JSON.stringify(p2d));
  }
  /* P4: THE BEFORE: the same pack, the hold off, him standing beside it, one of the world's steps */
  const pb = await packRun(true);
  if (pb.id) { const p4 = await besideIt(pb.id, 12, true);
    ok('P4 THE BEFORE (the pack\'s hold off): its wander ends beside him, and its card came back from its own step', p4.cards >= 1, JSON.stringify(p4));
  } else ok('P4 THE BEFORE', false, JSON.stringify(pb));
  await fr.evaluate(() => { BohemiaJobKinds.letGo.on = true; LOOP.held = LOOP.held.filter(j => !/^gate-pack/.test(j.id)); BohemiaCarcass.reset(); });
  ok('R nothing threw on any page', errs.length === 0, errs.slice(0, 3).join(' | '));
  return finish();
})().catch(async (e) => { console.error(e); try { await d.close(); } catch (x) {} process.exit(1); });
async function finish() {
  console.log('\nTHE CARCASS AND THE VULTURES: ' + pass + ' passed, ' + fail + ' failed');
  try { await d.close(); } catch (e) {}
  process.exit(fail ? 1 : 0);
}
