/* THE CAMP IS HIS OWN GATE (CAMP TWO, 10/26/26: [the camp is your own settlement], [you see your men at camp], [the camp grows],
   [camp on the live map], [the compass of danger], [they pitch the camp]; VAMILY rules 257(d), 259(d), 260(e), 269(d), 273(c)).
   PAOLO 10/26: 'the camp screen is gonna be the camp, a settlement vibe, it's very important to me'; 'if it's one person, one
   tent, maybe two people fit in a tent, and maybe there's a shopping cart'; 'I should see my main character and the rest of his
   team in the camp as time passes'; 'even when I'm healing at the camp I still want to be able to see what's going on with the
   rest of the city'; 'all eight compass directions, part of the edge of the screen... red as they get closer if they're very
   dangerous'; 'I wanna see me set the camp up... really quickly before it gets into the action'.
   WHY THIS WALKS THE DEMO (rule 179: done means he can see it): the cut he plays, phone and computer, every press a real finger
   (a mouse on the computer). The gate's own fixtures, said out loud: the company's wounds are set before the camp (one man badly
   hurt, one with his armour broken, the rest whole) through the condition's own door (afterFight); a party is stood still on the
   map for the compass (a still enemy, 269(a)), and the roaming hunters are kept off so the camp under test is not broken by them
   (that bug is CAMP's [camp holds until he ends it], rule 267(a)).
     K1 *** A PRESS ON HEAL OPENS HIS CAMP *** the picture is his own ground (camp_two/plate), nothing of a town on it (no keeper,
        crowd or walker), and his camp stands on it: the fire, his tents, the shopping cart (his first carrier, 260(c)), the supplies,
        the seats by the fire; every piece a door
     K2 *** THE PITCH *** making camp plays the pitch (a few seconds, the carrier first), and a real tap skips it
     K3 *** A TENT FOR EACH TWO MEN *** 1, 2, 5 and 12 men: the tents drawn are the men over two rounded up (260(e)); and his own
        company's
     K4 *** EACH MAN DOES WHAT HIS CONDITION SAYS *** the badly hurt man lies bandaged with a friend by him, the man with broken
        armour mends it, the rest have a camp job; the main character is there; and the hurt man gets up when the hours have healed
        him (259(a)(d))
     K5 THE CART IS THE STASH: a real tap on the cart opens it, 'Open the stash' opens the crew screen's stash
     K6 A FOLLOWER ADDS HIS PIECE: with the cook hired his pot stands in the camp, a door to the retinue
     K7 *** THE COMPASS *** a strong party standing still four blocks north-east on the glass lights the north-east edge red (its
        AUTO read under the turn: a loss); a lone man the other way lights his edge a weak green (a clean win), dimmer (269(b)(d))
     K8 *** MAP: THE CITY GOES ON *** a real tap on MAP: the camp screen steps aside, the camp stands at his spot on the map (a tent
        for each two men), the clock still runs, the valley's parties walk; CAMP (where HEAL stands) brings the camp back, still up
        (257(a)(d), 260(b))
     K9 THE HOURS LEAVE GHOSTS: while the hours run, the places his men stood leave their two-percent trace (273(c))
     K10 nothing threw
   node gates/the_camp_is_his_own_gate.js [--profile phone_portrait|computer]   (no flag: both) */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };

async function run(profile) {
  const P = '[' + profile + '] ';
  let d;
  try { d = await drive.open({ keepCards: true, profile, beforeTap: async (p) => { await throughTheTitle(p); } }); }
  catch (e) { ok(P + 'the demo boots [' + String(e.message).slice(0, 160) + ']', false); return; }
  const p = d.page, fr = d.fr, errs = [];
  p.on('pageerror', e => errs.push(e.message));
  const press = async (x, y) => { if (profile === 'computer') await p.mouse.click(x, y); else await p.touchscreen.tap(x, y); };
  const tapIn = async (frame, sel) => { const h = await frame.$(sel); if (!h) return false; const r = await h.boundingBox(); if (!r || r.width < 2) return false; await press(r.x + r.width / 2, r.y + r.height / 2); return true; };
  const campFrame = async () => { for (let k = 0; k < 40; k++) { await p.waitForTimeout(250);
    for (const x of p.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.camp().camp && !!window.BohemiaCampLook && BohemiaCampLook.state().open; } catch (e) { return false; } }).catch(() => false)) return x; }
    return null; };
  const look = (sf) => sf.evaluate(() => BohemiaCampLook.state());
  try {
    await p.waitForTimeout(3000);
    await fr.waitForFunction(() => { const b = document.getElementById('campbtn'); return b && getComputedStyle(b).display !== 'none'; }, null, { timeout: 20000 }).catch(() => {});
    /* the fixtures: the wounds through the condition's own door; the hunters kept off (CAMP's bug, 267(a)) */
    const men = await fr.evaluate(() => {
      const L = BohemiaCondition.members(LOOP.start && LOOP.start.company);
      /* the hurt man's hitpoints and the broken man's pieces are set big, so the camp's quick hours (TUNING's x5) do not mend them
         before the gate reads them: 154 hitpoints missing is fifteen camped hours, 810 points of armour more than the tape can pay */
      const rows = L.map((e, i) => ({ name: e.main ? 'YOU' : e.man.name, main: e.main, hp: i === 1 ? 6 : 60, hpMax: i === 1 ? 160 : 60, armH: i === 2 ? 40 : 100, armHMax: i === 2 ? 400 : 100, armB: i === 2 ? 50 : 120, armBMax: i === 2 ? 500 : 120 }));
      BohemiaCondition.afterFight(rows, { day: 1 });
      window.__GATE_KEEP_OFF = setInterval(function () { try { if (HUNT && !HUNT.__gate) HUNT = null; } catch (e) {} }, 100);
      return L.map(e => e.main ? 'YOU' : e.man.name);
    });
    /* ---- K1, K2 ---- */
    const plate = await fr.evaluate(() => { const r = document.getElementById('campbtn').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    const fb = await (await fr.frameElement()).boundingBox();
    await press(fb.x + plate[0], fb.y + plate[1]);
    const sf = await campFrame();
    if (!sf) { ok(P + 'K1 a press on HEAL opens his camp', false, 'no camp screen'); return; }
    for (let k = 0; k < 12; k++) { const st = await look(sf); if (st.reads > 0) break; await p.waitForTimeout(250); }   /* the map's first read of each man */
    const k4a = await look(sf);
    const k2a = k4a.pitch;
    const sb = await (await sf.frameElement()).boundingBox();
    const k1 = await sf.evaluate(() => { const S = BohemiaSettlement, st = BohemiaCampLook.state();
      const c2 = S.camp2(); return { src: c2.src, camp2: c2.camp2, order: S.order(), kinds: st.pieces.map(q => q.kind), carrier: st.carrier, keepers: S.folk().filter(q => !q.campMan).length, busy: S.busy().length, men: st.men }; });
    ok(P + 'K1 *** A PRESS ON HEAL OPENS HIS CAMP *** his own ground, nothing of a town, the fire, his tents, the shopping cart, the supplies, the seats, each a door',
      /camp_two\/plate\.webp$/.test(k1.src || '') && k1.camp2 && k1.keepers === 0 && k1.busy === 0 && ['fire', 'tent', 'carrier', 'supplies', 'seats'].every(k => k1.kinds.indexOf(k) >= 0)
        && k1.carrier === 'shopping_cart' && ['fire', 'tent', 'cart', 'retinue'].every(k => k1.order.indexOf(k) >= 0),
      JSON.stringify(k1));
    /* a real tap anywhere on the camp skips the pitch */
    await press(sb.x + sb.width / 2, sb.y + sb.height * 0.45);
    await p.waitForTimeout(300);
    const k2b = (await look(sf)).pitch;
    ok(P + 'K2 *** THE PITCH *** making camp plays it (a few seconds, the shopping cart first) and a real tap skips it',
      !!k2a && k2a.on && k2a.ms >= 1500 && k2a.ms <= 8000 && k2a.carrier === 'shopping_cart' && !!k2b && !k2b.on && k2b.skipped, JSON.stringify({ at_open: k2a, after_tap: k2b }));
    if (process.env.BOHEMIA_SHOT_DIR) await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'camp2_' + profile + '_camp.png') });
    /* ---- K4 (read at the open: the hours heal fast) ---- */
    const lead = await sf.evaluate(() => BohemiaSettlement.lead());
    const byName = (st, n) => st.acts.filter(a => a.name === n)[0] || {};
    const hurt = byName(k4a, men[1]), broke = byName(k4a, men[2]);
    const tender = k4a.acts.filter(a => a.act === 'tend')[0];
    const others = k4a.acts.filter(a => a.name !== men[1] && a.name !== men[2]);
    ok(P + 'K4a *** EACH MAN DOES WHAT HIS CONDITION SAYS *** the badly hurt lies bandaged with a friend by him, the broken armour is mended, the rest have a camp job, the main character is there',
      hurt.act === 'lie' && hurt.blood < 0.35 && broke.act === 'mend' && broke.armour < 0.87 && (!!tender ? tender.by === 1 : k4a.acts.length < 3)
        && others.every(a => ['tend', 'cook', 'clean', 'watch', 'rest', 'sleep'].indexOf(a.act) >= 0) && (k4a.hideLead || (!!lead.drawn && lead.look === 'you')),
      JSON.stringify(k4a.acts) + ' lead ' + JSON.stringify({ look: lead.look, drawn: lead.drawn, hidden: k4a.hideLead }));
    let k4b = null;
    for (let k = 0; k < 24; k++) { await p.waitForTimeout(500); k4b = await look(sf); if (byName(k4b, men[1]).act !== 'lie') break; }
    const up = byName(k4b, men[1]);
    ok(P + 'K4b the hurt man gets up when the camp\'s hours have healed him', up.act !== 'lie' && up.blood >= 0.35, men[1] + ' ' + JSON.stringify(up));
    /* ---- K3 ---- */
    const k3 = await sf.evaluate(() => {
      const info = BohemiaSettlement.camp().info, out = {};
      [1, 2, 5, 12].forEach(n => { const co = []; for (let i = 1; i < n; i++) co.push({ look: 'person_town_' + ((i - 1) % 12), name: 'MAN ' + i });
        BohemiaCampLook.open(Object.assign({}, info, { company: co })); const st = BohemiaCampLook.state();
        out[n] = { tents: st.tents, drawn: st.pieces.filter(q => q.kind === 'tent').length, doors: BohemiaCampLook.boxes({}, 134).filter(k => /^tent/.test(k)).length }; });
      BohemiaCampLook.open(info); const st = BohemiaCampLook.state(); out.his = { men: st.men, tents: st.pieces.filter(q => q.kind === 'tent').length };
      return out; });
    ok(P + 'K3 *** A TENT FOR EACH TWO MEN *** 1, 2, 5 and 12 men: 1, 1, 3 and 6 tents drawn, each a door; his own company the same rule',
      [[1, 1], [2, 1], [5, 3], [12, 6]].every(([n, t]) => k3[n].tents === t && k3[n].drawn === t && k3[n].doors === t) && k3.his.tents === Math.ceil(k3.his.men / 2), JSON.stringify(k3));
    /* ---- K7 the compass: a still party (269(a)), its 'at' held where it stands ---- */
    const still = (dx, dy, count, id) => fr.evaluate(([dx, dy, count, id]) => { const at = [city.x + dx, city.y + dy];
      const H = { id: id, ev: { id: id }, name: id === 'gate:strong' ? 'THE REDS' : 'A LONE MAN', arch: 'human', count: count, made: performance.now(), __gate: true };
      Object.defineProperty(H, 'at', { get: () => at, set: () => {} }); Object.defineProperty(H, 'steps', { get: () => 0, set: () => {} });
      HUNT = H; return at; }, [dx, dy, count, id]);
    const readEdge = async (i, want) => { let c = null; for (let k = 0; k < 60; k++) { await p.waitForTimeout(500); const st = await look(sf); c = st.compass && st.compass[i]; if (c && c.clean != null && (!want || want(c))) break; } return c; };
    await still(0, -4, 6, 'gate:strong');
    const ne = await readEdge(1);
    if (process.env.BOHEMIA_SHOT_DIR) await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'camp2_' + profile + '_compass.png') });
    await still(4, 0, 1, 'gate:weak');
    const se = await readEdge(3);
    await fr.evaluate(() => { HUNT = null; });
    ok(P + 'K7 *** THE COMPASS *** six men still four blocks north-east light the north-east edge red (their AUTO read a loss); a lone man the other way lights his edge a weak green, dimmer',
      !!ne && ne.lit > 0.25 && ne.loss && ne.rgb[0] > ne.rgb[1] && ne.clean < 0.8 && !!se && !se.loss && se.rgb[1] > se.rgb[0] && se.clean >= 0.8 && se.lit < ne.lit,
      'NE ' + JSON.stringify(ne) + ' SE ' + JSON.stringify(se));
    /* ---- K8 MAP ---- */
    const mapBtn = await sf.evaluate(() => { const b = document.getElementById('camppeek'); if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    const t0 = await fr.evaluate(() => ({ t: BohemiaMapCamp.state().hours, parties: (partiesAll() || []).map(q => q.at.x + ',' + q.at.y).join(' '), drawn: (window.__CAMP_ON_MAP || {}).drawn | 0 }));
    if (mapBtn) await press(sb.x + mapBtn[0], sb.y + mapBtn[1]);
    await p.waitForTimeout(2500);
    const k8 = await fr.evaluate((t0) => { const f = LOOP.frame, b = document.getElementById('campback'), r = b && b.getBoundingClientRect(), m = window.__CAMP_ON_MAP || {};
      return { on: BohemiaMapCamp.on(), peek: BohemiaCampMap.peeking(), opacity: f.style.opacity, events: f.style.pointerEvents, hours: BohemiaMapCamp.state().hours - t0.t,
        moved: (partiesAll() || []).map(q => q.at.x + ',' + q.at.y).join(' ') !== t0.parties, drawn: (m.drawn | 0) - t0.drawn, tents: m.tents, men: m.men,
        back: !!r && getComputedStyle(b).display !== 'none' && document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) === b || (!!r && b.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2))), backAt: r ? [r.x + r.width / 2, r.y + r.height / 2] : null }; }, t0);
    if (process.env.BOHEMIA_SHOT_DIR) await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'camp2_' + profile + '_map.png') });
    if (k8.backAt) await press(fb.x + k8.backAt[0], fb.y + k8.backAt[1]);
    await p.waitForTimeout(700);
    const k8b = await fr.evaluate(() => ({ on: BohemiaMapCamp.on(), peek: BohemiaCampMap.peeking(), opacity: LOOP.frame.style.opacity, shown: LOOP.frame.style.display }));
    ok(P + 'K8 *** MAP: THE CITY GOES ON *** the camp screen steps aside, his camp stands at his spot (a tent for each two men), the clock runs, the parties walk; CAMP brings it back, still up',
      mapBtn && k8.on && k8.peek && k8.opacity === '0' && k8.events === 'none' && k8.hours >= 2 && k8.drawn > 0 && k8.tents === Math.ceil(k8.men / 2) && k8.moved && k8.back
        && k8b.on && !k8b.peek && k8b.opacity === '' && k8b.shown === 'block', JSON.stringify({ k8, k8b }));
    /* ---- K9 ---- */
    const k9 = await look(sf);
    ok(P + 'K9 THE HOURS LEAVE GHOSTS: the places his men stood leave their trace while the hours run', k9.ghost >= k9.acts.length * 2, k9.ghost + ' traces for ' + k9.acts.length + ' men');
    /* ---- K5 ---- */
    const cartAt = await sf.evaluate(() => BohemiaSettlement.where('cart'));
    await press(sb.x + cartAt.x, sb.y + cartAt.y); await p.waitForTimeout(700);
    const k5a = await sf.evaluate(() => ({ open: BohemiaSettlement.state.open, buttons: [].map.call(document.querySelectorAll('#sbody .acts button.act'), b => b.textContent.trim()) }));
    const stashBtn = await sf.evaluateHandle(() => [].filter.call(document.querySelectorAll('#sbody .acts button.act'), b => /Open the stash/.test(b.textContent))[0] || null);
    let stash = null;
    const sbb = stashBtn && stashBtn.asElement ? stashBtn.asElement() : null;
    if (sbb) { const r = await sbb.boundingBox(); if (r) { await press(r.x + r.width / 2, r.y + r.height / 2);
      let rf = null; for (let k = 0; k < 20 && !rf; k++) { await p.waitForTimeout(250); rf = p.frames().find(x => /ROSTER_SCREEN/.test(x.url())); }
      if (rf) await rf.waitForFunction(() => /(?:YOUR BAG|STASH)\s+\d+\s*\/\s*\d+/.test(document.body.innerText), null, { timeout: 6000 }).catch(() => {});
      if (rf) { stash = await rf.evaluate(() => (document.body.innerText.match(/(?:YOUR BAG|STASH)\s+\d+\s*\/\s*(\d+)/) || [])[1] || null).catch(() => null);
        await rf.evaluate(() => { const b = document.getElementById('done'); if (b) b.click(); }).catch(() => {}); await p.waitForTimeout(500); } } }
    ok(P + 'K5 THE CART IS THE STASH: a real tap on the cart opens it, and Open the stash shows the stash', k5a.open === 'cart' && k5a.buttons.some(t => /Open the stash/.test(t)) && !!stash,
      JSON.stringify(k5a) + ' stash /' + stash);
    await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); });
    /* ---- K6 ---- */
    await sf.evaluate(() => { BohemiaCamp.hire('cook'); });
    await p.waitForTimeout(1200);
    const k6 = await sf.evaluate(() => ({ pieces: BohemiaCampLook.state().pieces.filter(q => q.kind === 'follower').map(q => q.follower), order: BohemiaSettlement.order() }));
    const pot = await sf.evaluate(() => { const c = BohemiaSettlement.camp2('f_cook'); if (!c.box) return null; const b = c.box, v = c.view, r = document.getElementById('scene').getBoundingClientRect();
      return { x: r.left + v.ox + (b[0] + (b[2] - b[0]) * 0.5) * v.s, y: r.top + v.oy + (b[1] + (b[3] - b[1]) * 0.3) * v.s }; });
    if (pot) { await press(sb.x + pot.x, sb.y + pot.y); await p.waitForTimeout(600); }
    const k6b = await sf.evaluate(() => ({ open: BohemiaSettlement.state.open, rows: document.querySelectorAll('#sbody .campf').length, cook: !!document.querySelector('#sbody .campf[data-id="cook"]') }));
    ok(P + 'K6 A FOLLOWER ADDS HIS PIECE: the cook hired, his pot stands in the camp, a door to the retinue', k6.pieces.indexOf('cook') >= 0 && k6.order.indexOf('f_cook') >= 0 && k6b.open === 'f_cook' && k6b.rows >= 3 && k6b.cook,
      JSON.stringify(k6) + ' opens ' + JSON.stringify(k6b));
    await sf.evaluate(() => { BohemiaCamp.letGo('cook'); const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); });
    /* leave it as found: break the camp by its own button */
    await tapIn(sf, '#leave'); await p.waitForTimeout(500);
    await fr.evaluate(() => { clearInterval(window.__GATE_KEEP_OFF); });
  } catch (e) { ok(P + 'the gate ran [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  ok(P + 'K10 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  try { await d.close(); } catch (e) {}
}

(async () => {
  const i = process.argv.indexOf('--profile');
  const profiles = i >= 0 ? [process.argv[i + 1]] : ['phone_portrait', 'computer'];
  for (const pr of profiles) await run(pr);
  console.log('=== THE CAMP IS HIS OWN: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
