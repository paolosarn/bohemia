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
     K1 *** A PRESS ON HEAL (the phone's) OPENS HIS CAMP *** the picture is his own ground (camp_two/plate), nothing of a town on it (no keeper,
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
        AUTO read under the turn: a loss); a lone man the other way lights his edge in his own read's colour (a weak green to a
        clean win), a better read and dimmer (269(b)(d))
     K8 *** MAP: THE CITY GOES ON *** a real tap on MAP: the camp screen steps aside, the camp stands at his spot on the map (a tent
        for each two men), the clock still runs, the valley's parties walk; CAMP (where HEAL stands) brings the camp back, still up
        (257(a)(d), 260(b))
     K9 THE HOURS LEAVE GHOSTS: while the hours run, the places his men stood leave their two-percent trace (273(c))
     K10 nothing threw
     K11 *** THE CAMP FITS THE PHONE *** phone right and left: nothing of the camp, no man and no MAP under the phone; the camp's
        own BREAK CAMP gone while the phone's HEAL stands (rule 286(a)(b))
     K12 ALL EIGHTEEN: Battle Brothers' eighteen followers in the retinue, each with his number and his piece, each drawn in the camp
        when he is with you, his number moving with him; the twelve whose screens are not wired yet stand priced with their hire
        shut (rule 270(c))
     K13 THE TURN GLIDES: a glass turned mid-camp gets the other shape (the tall camp on the tall ground, the wide on the wide), every
        piece and man there before and after, gliding one beat, never a black frame (rule 289(b)(c))
   node gates/the_camp_is_his_own_gate.js [--profile phone_portrait|phone_landscape|computer]   (no flag: all three) */
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
    /* the camp's door is the phone's HEAL app (UI TWO, rules 212(b), 226(c)), on the phone the shell draws over every screen */
    const HEAL = '#bohphone .app[data-app=heal]';
    await p.waitForFunction((s) => { const b = document.querySelector(s); return !!b && b.getBoundingClientRect().width > 0 && document.getElementById('bohphone').classList.contains('on'); }, HEAL, { timeout: 20000 }).catch(() => {});
    /* the fixtures: the wounds through the condition's own door; the hunters kept off (CAMP's bug, 267(a)) */
    const men = await fr.evaluate(() => {
      const L = BohemiaCondition.members(LOOP.start && LOOP.start.company);
      /* the hurt man's hitpoints and the broken man's pieces are set big, so the camp's quick hours (TUNING's x5) do not mend them
         before the gate reads them (a slow machine runs more camp hours before the read): 294 hitpoints missing is near thirty camped hours, 810 points of armour more than the tape can pay */
      const rows = L.map((e, i) => ({ name: e.main ? 'YOU' : e.man.name, main: e.main, hp: i === 1 ? 6 : 60, hpMax: i === 1 ? 300 : 60, armH: i === 2 ? 40 : 100, armHMax: i === 2 ? 400 : 100, armB: i === 2 ? 50 : 120, armBMax: i === 2 ? 500 : 120 }));
      BohemiaCondition.afterFight(rows, { day: 1 });
      window.__GATE_KEEP_OFF = setInterval(function () { try { if (HUNT && !HUNT.__gate) HUNT = null; } catch (e) {} }, 100);
      return L.map(e => e.main ? 'YOU' : e.man.name);
    });
    /* ---- K1, K2 ---- */
    const fb = await (await fr.frameElement()).boundingBox();
    await tapIn(p.mainFrame(), HEAL);
    const sf = await campFrame();
    if (!sf) { ok(P + 'K1 a press on HEAL opens his camp', false, 'no camp screen'); return; }
    for (let k = 0; k < 12; k++) { const st = await look(sf); if (st.reads > 0) break; await p.waitForTimeout(250); }   /* the map's first read of each man */
    const k4a = await look(sf);
    const k2a = k4a.pitch;
    const sb = await (await sf.frameElement()).boundingBox();
    const k1 = await sf.evaluate(() => { const S = BohemiaSettlement, st = BohemiaCampLook.state();
      const c2 = S.camp2(); return { src: c2.src, camp2: c2.camp2, tall: st.tall, order: S.order(), kinds: st.pieces.map(q => q.kind), carrier: st.carrier, keepers: S.folk().filter(q => !q.campMan).length, busy: S.busy().length, men: st.men }; });
    ok(P + 'K1 *** A PRESS ON HEAL OPENS HIS CAMP *** his own ground, nothing of a town, the fire, his tents, the shopping cart, the supplies, the seats, each a door',
      /camp_two\/plate(_tall)?\.webp$/.test(k1.src || '') && k1.camp2 && (/_tall/.test(k1.src) === (profile === 'phone_portrait')) && k1.keepers === 0 && k1.busy === 0 && ['fire', 'tent', 'carrier', 'supplies', 'seats'].every(k => k1.kinds.indexOf(k) >= 0)
        && k1.carrier === 'shopping_cart' && ['fire', 'tent', 'cart', 'retinue'].every(k => k1.order.indexOf(k) >= 0),
      JSON.stringify(k1));
    /* a real tap anywhere on the camp skips the pitch */
    await press(sb.x + sb.width / 2, sb.y + sb.height * 0.45);
    await p.waitForTimeout(300);
    const k2b = (await look(sf)).pitch;
    ok(P + 'K2 *** THE PITCH *** making camp plays it (a few seconds, the shopping cart first) and a real tap skips it',
      !!k2a && k2a.on && k2a.ms >= 1500 && k2a.ms <= 8000 && k2a.carrier === 'shopping_cart' && !!k2b && !k2b.on && k2b.skipped, JSON.stringify({ at_open: k2a, after_tap: k2b }));
    if (process.env.BOHEMIA_SHOT_DIR) await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'camp2_' + profile + '_camp.png') });
    /* ---- K11 THE CAMP FITS THE PHONE (rule 286(a)(b)): phone right, then left; nothing of the camp under it, one door each ---- */
    const doorsOver = async () => sf.evaluate(() => {
      const pr = window.BOH_PHONE_RECT ? BOH_PHONE_RECT() : null, sc = document.getElementById('scene').getBoundingClientRect(), S = BohemiaSettlement;
      if (!pr || !pr.on) return { phone: false };
      const order = S.order(), v = S.camp2().view, out = [], H = 134;
      const toGlass = (b) => [sc.left + v.ox + b[0] * v.s, sc.top + v.oy + b[1] * v.s, sc.left + v.ox + b[2] * v.s, sc.top + v.oy + b[3] * v.s];
      const inter = (a) => Math.max(0, Math.min(a[2], pr.right) - Math.max(a[0], pr.left)) * Math.max(0, Math.min(a[3], pr.bottom) - Math.max(a[1], pr.top));
      const BX = S.camp2().boxes || {};
      order.forEach(k => { const b = BX[k]; if (b) { const g = toGlass(b), a = inter(g); if (a > 0) out.push(k + ':' + Math.round(a)); } });
      S.folk().forEach(m => { const g = toGlass([m.x - H * 0.17, m.y - H, m.x + H * 0.17, m.y]), a = inter(g); if (a > 0) out.push((m.name || m.look) + ':' + Math.round(a)); });
      const mp = document.getElementById('camppeek'), mr = mp && mp.getBoundingClientRect(), mapOver = mr && mp.style.display !== 'none' ? inter([mr.left, mr.top, mr.right, mr.bottom]) : 0;
      const leave = document.getElementById('leave'), leaveShown = !!leave && getComputedStyle(leave).display !== 'none' && leave.getBoundingClientRect().width > 0;
      return { phone: true, side: pr.side, over: out, mapOver: Math.round(mapOver), leaveShown, fireX: Math.round(sc.left + v.ox + BohemiaCampLife.FIRE.x * v.s) };
    });
    const r1 = await doorsOver();
    await p.evaluate(() => { try { BohemiaPhone.setSide('left'); } catch (e) {} });
    await p.waitForTimeout(700);
    const r2 = await doorsOver();
    await p.evaluate(() => { try { BohemiaPhone.setSide('right'); } catch (e) {} });
    await p.waitForTimeout(500);
    const campAfterFlip = await fr.evaluate(() => BohemiaMapCamp.state());
    /* the fire's sheet holds no BREAK CAMP of its own while the phone is on */
    const fireAt = await sf.evaluate(() => BohemiaSettlement.where('fire'));
    const diag = fireAt ? { at: fireAt, inFrame: await sf.evaluate((w) => { const e = document.elementFromPoint(w.x, w.y); return e ? (e.id || e.tagName) : null; }, fireAt),
      onTop: await p.evaluate((q) => { const e = document.elementFromPoint(q.x, q.y); return e ? (e.id || e.tagName) + '.' + String(e.className).slice(0, 30) : null; }, { x: sb.x + fireAt.x, y: sb.y + fireAt.y }),
      look: await sf.evaluate(() => { const st = BohemiaCampLook.state(); return { lift: st.lift, gliding: st.gliding, tall: st.tall, peek: st.peek }; }) } : null;
    if (fireAt) { await press(sb.x + fireAt.x, sb.y + fireAt.y); await p.waitForTimeout(600); }
    const fireBtns = await sf.evaluate(() => ({ open: BohemiaSettlement.state.open, buttons: [].map.call(document.querySelectorAll('#sbody .acts button.act'), b => b.textContent.trim()) }));
    await sf.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); });
    ok(P + 'K11 *** THE CAMP FITS THE PHONE *** phone right and phone left: no door of the camp, no man and no MAP under the phone, the camp\'s own BREAK CAMP gone (the phone\'s HEAL is the one door)',
      r1.phone && r2.phone && r1.side !== r2.side && r1.over.length === 0 && r2.over.length === 0 && r1.mapOver === 0 && r2.mapOver === 0 && !r1.leaveShown && !r2.leaveShown
        && fireBtns.open === 'fire' && fireBtns.buttons.length > 0 && !fireBtns.buttons.some(t => /break camp/i.test(t)),
      JSON.stringify({ right: r1, left: r2, fire: fireBtns, camp: { on: campAfterFlip.on, why: campAfterFlip.why }, diag }));
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
    for (let k = 0; k < 70; k++) { await p.waitForTimeout(500); k4b = await look(sf); if (byName(k4b, men[1]).act !== 'lie') break; }
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
    /* the lone man's colour is AUTO's read of him, whatever the fight's balance makes it (green at 0.8 and over, red under: a lone
       man read 0.92 one round and 0.76 the next when the fight's numbers moved); what the leg holds is the compass: his edge in his
       read's colour, a better read than the six's, dimmer than theirs */
    const hue = (c) => !!c && (c.clean >= 0.8 ? (!c.loss && c.rgb[1] > c.rgb[0]) : (c.loss && c.rgb[0] > c.rgb[1]));
    ok(P + 'K7 *** THE COMPASS *** six men still four blocks north-east light the north-east edge red (their AUTO read a loss); a lone man the other way lights his edge in his own read\'s colour (green to a clean win), dimmer',
      !!ne && ne.lit > 0.25 && ne.loss && ne.rgb[0] > ne.rgb[1] && ne.clean < 0.8 && !!se && hue(se) && se.clean > ne.clean && se.lit < ne.lit,
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
    const k6camp = await fr.evaluate(() => BohemiaMapCamp.state());
    const k6 = await sf.evaluate(() => ({ pieces: BohemiaCampLook.state().pieces.filter(q => q.kind === 'follower').map(q => q.follower), order: BohemiaSettlement.order() }));
    const pot = await sf.evaluate(() => { const c = BohemiaSettlement.camp2('f_cook'); if (!c.box) return null; const b = c.box, v = c.view, r = document.getElementById('scene').getBoundingClientRect();
      return { x: r.left + v.ox + (b[0] + (b[2] - b[0]) * 0.5) * v.s, y: r.top + v.oy + (b[1] + (b[3] - b[1]) * 0.3) * v.s }; });
    if (pot) { await press(sb.x + pot.x, sb.y + pot.y); await p.waitForTimeout(600); }
    const k6b = await sf.evaluate(() => ({ open: BohemiaSettlement.state.open, rows: document.querySelectorAll('#sbody .campf').length, cook: !!document.querySelector('#sbody .campf[data-id="cook"]') }));
    ok(P + 'K6 A FOLLOWER ADDS HIS PIECE: the cook hired, his pot stands in the camp, a door to the retinue', k6.pieces.indexOf('cook') >= 0 && k6.order.indexOf('f_cook') >= 0 && k6b.open === 'f_cook' && k6b.rows >= 3 && k6b.cook,
      JSON.stringify(k6) + ' opens ' + JSON.stringify(k6b) + ' camp ' + JSON.stringify({ on: k6camp.on, why: k6camp.why }));
    await sf.evaluate(() => { BohemiaCamp.letGo('cook'); const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); });
    /* ---- K12 ALL EIGHTEEN (rule 270(c)) ---- */
    const k12 = await sf.evaluate(async () => {
      const C = BohemiaCamp, kit = await (await fetch('camp_two/kit.json')).json(), ids = C.offer().map(o => o.id), out = { n: ids.length, noPiece: [], noNumber: [], notDrawn: [], moved: [], soon: C.offer().filter(o => o.soon).map(o => o.id) };
      ids.forEach(id => { if (!kit.pieces['f_' + id]) out.noPiece.push(id); const L = C.LIVE[id] || C.NUMS[id]; if (!L || !Object.keys(L).some(k => typeof L[k] === 'number')) out.noNumber.push(id); });
      const was = C.retinue().slice();
      for (let i = 0; i < ids.length; i += 5) {
        was.concat(C.retinue()).forEach(id => C.letGo(id));
        const batch = ids.slice(i, i + 5); batch.forEach(id => C.hire(id));
        BohemiaCampLook.open(BohemiaSettlement.camp().info);
        const drawn = BohemiaCampLook.state().pieces.filter(q => q.kind === 'follower').map(q => q.follower);
        batch.forEach(id => { if (drawn.indexOf(id) < 0) out.notDrawn.push(id);
          const L = C.LIVE[id] || C.NUMS[id], k = Object.keys(L).filter(k => typeof L[k] === 'number')[0];
          const others = batch.filter(x => x !== id); others.forEach(x => C.letGo(x)); const withHim = (L[k] < 1 && L[k] > 0) || /mult/.test(k) ? C.mult(k) : C.plus(k); C.letGo(id); const without = (L[k] < 1 && L[k] > 0) ? C.mult(k) : C.plus(k);
          if (withHim !== without) out.moved.push(id); batch.forEach(x => C.hire(x)); });
      }
      C.retinue().forEach(id => C.letGo(id)); was.forEach(id => C.hire(id)); BohemiaCampLook.open(BohemiaSettlement.camp().info);
      return out; });
    ok(P + 'K12 ALL EIGHTEEN: every one of Battle Brothers\' followers is in the retinue with his number and his piece, drawn at his spot when he is with you, his number moving with him (the twelve whose screens are not wired yet stand priced and shut)',
      k12.n === 18 && !k12.noPiece.length && !k12.noNumber.length && !k12.notDrawn.length && k12.moved.length === 18 && k12.soon.length === 12, JSON.stringify(k12));
    /* ---- K13 THE TURN GLIDES (rule 289(b)(c)): the glass turned mid-camp: the other shape, every piece and man there before and after,
       a glide of one beat, never a black frame ---- */
    const vp0 = p.viewportSize(), turned = { width: vp0.height, height: vp0.width };
    const before13 = await look(sf);
    await sf.evaluate(() => { window.__CAMP2_DARK = []; const cv = document.querySelector('#scene canvas') || document.querySelector('canvas'); const t0 = performance.now();
      (function f() { try { const g = cv.getContext('2d'), w = cv.width, h = cv.height, d = g.getImageData(Math.floor(w * 0.3), Math.floor(h * 0.3), Math.floor(w * 0.4), Math.floor(h * 0.4)).data; let m = 0, n = 0;
        for (let i = 0; i < d.length; i += 64) { m += d[i] + d[i + 1] + d[i + 2]; n++; } window.__CAMP2_DARK.push(Math.round(m / Math.max(1, n) / 3)); } catch (e) {} if (performance.now() - t0 < 1800) requestAnimationFrame(f); })(); });
    await p.setViewportSize(turned);
    await p.waitForTimeout(2000);
    const after13 = await look(sf), dark = await sf.evaluate(() => window.__CAMP2_DARK || []);
    /* the glide the camp drew: a beat (about 500 ms) over more than one frame, the pieces in between */
    const gl = after13.lastFlip, glided = !!gl && gl.n === after13.flips && gl.frames >= 2 && gl.ms >= 400 && gl.ms <= 2000;
    await p.setViewportSize(vp0); await p.waitForTimeout(1200);
    const back13 = await look(sf);
    const keys = (st) => st.pieces.map(q => q.key).sort().join(',');
    ok(P + 'K13 THE TURN GLIDES: the glass turned mid-camp, the other shape (tall for tall, wide for wide), every piece and man there before and after, gliding, never a black frame; and back',
      before13.tall !== after13.tall && after13.flips > before13.flips && keys(before13) === keys(after13) && before13.acts.length === after13.acts.length && glided && dark.length >= 3 && Math.min.apply(null, dark) > 8 && back13.tall === before13.tall && back13.flips === after13.flips + 1,
      JSON.stringify({ before: before13.tall, after: after13.tall, back: back13.tall, flips: [after13.flips, back13.flips], glide: gl, darkest: Math.min.apply(null, dark.length ? dark : [0]), frames: dark.length, pieces: keys(after13) }));
    /* leave it as found: break the camp by its own button */
    await tapIn(p.mainFrame(), HEAL); await p.waitForTimeout(500);
    await fr.evaluate(() => { clearInterval(window.__GATE_KEEP_OFF); });
  } catch (e) { ok(P + 'the gate ran [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  ok(P + 'K10 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  try { await d.close(); } catch (e) {}
}

(async () => {
  const i = process.argv.indexOf('--profile');
  const profiles = i >= 0 ? [process.argv[i + 1]] : ['phone_portrait', 'phone_landscape', 'computer'];   /* tall, wide on a phone, and a computer (rule 286) */
  for (const pr of profiles) await run(pr);
  console.log('=== THE CAMP IS HIS OWN: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})();
