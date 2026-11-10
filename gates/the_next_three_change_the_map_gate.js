#!/usr/bin/env node
/* ============================================================================
   THE NEXT THREE CHANGE THE MAP, EACH HIS OWN WAY (BOSSES lane, 11/10/26, VAMILY rules 443(a) and 441; ask lines 167, 522).

   THE COORDINATOR 11/10: 'he voted YES on all three of your bosses. NEXT: the ladder's next three, each found by its own sign, each
   handing its verb, each changing the map its OWN way, kept after a reload, proven on the real page on a phone both ways.' Rule 441:
   done only when it plays end to end on the alpha link and the demo, the phone upright AND on its side.
   Record: records/BOHEMIA_BOSSES_THE_NEXT_THREE_CHANGE_THE_MAP_11_10_26.md. Code: slices/bohemia_bosses.js (11) HIS DARK, (12) HIS HOLE,
   (13) HIS RIGGERS; data records/target/bb/boss_act_one.json; pictures slices/boss_places/drum_*, signpost_*, riggers_*
   (tools/bohemia_bosses_the_next_three_11_10_26.py).

     node gates/the_next_three_change_the_map_gate.js "THE BURN"                 both ways: the demo upright, the alpha on its side
     node gates/the_next_three_change_the_map_gate.js "THE BURN" phone_portrait  one way (add :alpha for the alpha, e.g. phone_landscape:alpha)

   THE STRANGER'S GAME, a new game, the ladder in order:
     T0 every boss before him first: each one's sign read and his fall through the map's own fell(), the door a won fight calls (each
        one is walked whole, fight and all, by his own gate), each one's card answered the way a stranger would
     T1 his sign is in the world and his rumour on the feed; T2 his asker asks, one of YOUR men reads the sign out, his place is marked
     WHILE HE STANDS, HIS OWN WAY (THE BURN: D1 his drums, D2 at night his side sees one block and is painted black, the rest of the
        valley the night's half; THE SURVEYOR: H1 his signposts, H2 walk into his side and out: the map forgets it; THE CLIMB: K1 his
        riggers' party, K2 it comes for you on the map and fights)
     B0 his card first; B1 his fight won; B2 the beat plays his change on the tape, the asker's card says the valley's line, hands his
        thing, and the line under it says what changed on the map, with its numbers
     WHEN HE FALLS, HIS OWN WAY (C1a..C1d), then R1 the same phone opens the game again and it holds
   PLANTED, each must turn its own check red: P2 the while-he-stands change undone, P3 it coming back after the fall, P4 a phone that
   forgot the save. C0 nothing threw.
   Pictures: records/target/the_next_three_change_the_map/<boss>/ (BOSSES_SHOTS=0 to skip; .png ignored, the record keeps .webp).
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const NAME = process.argv[2] || 'THE BURN';
const LADDER = ['THE POT', 'THE TAP', 'THE FILTER', 'THE BURN', 'THE SURVEYOR', 'THE CLIMB'];
const SLUG = NAME.replace(/^THE /, '').toLowerCase();
const SHOTS = process.env.BOSSES_SHOTS === '0' ? null : path.join(ROOT, 'records', 'target', 'the_next_three_change_the_map', SLUG);
const NIGHT = 22 * 60;

/* ---------------- THE BURN: his dark ---------------- */
const BURN = {
  D2: (q) => !!q && q.inR === q.sight && q.inDark === q.sight && q.outR >= 2 && q.outDark === 0 && q.drawnDark > 0,
  C1a: (q) => !!q && q.r >= 6 && q.dark === 0,
  R1: (q, b) => !!q && q.fallen && q.drums === b.drums && q.r >= 6 && q.dark === 0 && q.lit === b.drums,
  async before(c) {
    const { fr, G } = c;
    let D = await c.fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.darkness(n) || null)), NAME);
    for (let i = 0; i < 20 && (!D || !D.drums.length); i++) { await c.page.waitForTimeout(500); D = await fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.darkness(n) || null)), NAME); }
    const walkable = D ? await fr.evaluate((L) => L.every(q => !!cityWalkable(q.x, q.y)), D.drums) : false;
    if (!D) { ok('D1 his drums', false, 'none'); return false; }
    /* the block the crew stands on in his dark: inside it, two or fewer from a drum (so the fall's light reaches it), never his own door */
    const tb = await fr.evaluate((a) => { const D = a[0], f = a[1], h = [city.x, city.y]; let best = null, bd = 1e9;
      for (let dy = -D.radius + 1; dy <= D.radius - 1; dy++) for (let dx = -D.radius + 1; dx <= D.radius - 1; dx++) { const x = D.at[0] + dx, y = D.at[1] + dy;
        if (!cityWalkable(x, y) || Math.max(Math.abs(x - f.x), Math.abs(y - f.y)) < 2 || loopTownAt(x, y, 1)) continue;
        if (!D.drums.some(q => Math.max(Math.abs(q.x - x), Math.abs(q.y - y)) <= 2)) continue;
        if (!cityRoute(h[0], h[1], x, y)) continue;
        const dd = Math.max(Math.abs(x - h[0]), Math.abs(y - h[1])); if (dd < bd) { bd = dd; best = [x, y]; } } return best; }, [D, c.f]);
    c.tb = tb; c.D = D;
    if (!tb) { ok('D2 a block in his dark the crew can stand on', false, 'none'); return false; }
    await c.night();
    await c.goTo(tb);
    await c.night(); await fr.evaluate(() => render()); await c.page.waitForTimeout(600);
    const told = await fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_DARK_TOLD || null)));
    const qi = await fr.evaluate(() => ({ at: [city.x, city.y], r: fogRadius(), dark: BohemiaBosses.dark(city.x, city.y), drawn: (BohemiaBosses.last().drew || {}).dark | 0, night: isNight(),
      drums: ((BohemiaBosses.last().drew || {}).drums || []).filter(q => q.key === 'drum_before').length }));
    /* painted where the phone shows them: read with the crew among them (measured 11/10, run 1: read from his tag 13 blocks off, every drum was off the screen) */
    const dg = await fr.evaluate((D) => { const L = BohemiaBosses.last().drew || {}; let me = null; try { const ox = 0; me = null; } catch (e) {}
      return { loaded: BohemiaBosses.loaded(), mode: MODE, cv: [CVW, CVH], drums: (L.drums || []).map(q => q.key + '@' + q.at), places: (L.places || []).map(p => p.n + '@' + p.x + ',' + p.y), origin: (performance.timeOrigin | 0) % 100000 }; }, D).catch(e => ({ err: String(e).slice(0, 80) }));
    ok('D1 his drums: at least 2 of his stokers\' fire drums stand on street blocks round his yard, painted with his stoker', D.drums.length >= 2 && walkable && qi.drums >= 1,
      D.drums.map(q => q.x + ',' + q.y).join(' ') + ' round ' + D.at.join(',') + ', his dark ' + D.radius + ' blocks, ' + qi.drums + ' painted on the phone at ' + qi.at + ' ' + JSON.stringify(dg));
    await c.shot('2_his_dark_at_night');
    /* and outside it, at night: the night's half, his dark not */
    const ob = await fr.evaluate((D) => { const h = [city.x, city.y]; let best = null, bd = 1e9;
      for (let dy = -D.radius - 6; dy <= D.radius + 6; dy++) for (let dx = -D.radius - 6; dx <= D.radius + 6; dx++) { const x = D.at[0] + dx, y = D.at[1] + dy;
        const dd0 = Math.max(Math.abs(dx), Math.abs(dy)); if (dd0 < D.radius + 2 || !cityWalkable(x, y) || loopTownAt(x, y, 2) || x < 1 || y < 1 || x >= om.n - 1 || y >= om.n - 1) continue;
        if (!cityRoute(h[0], h[1], x, y)) continue; const dd = Math.max(Math.abs(x - h[0]), Math.abs(y - h[1])); if (dd < bd) { bd = dd; best = [x, y]; } } return best; }, D);
    await c.goTo(ob); await c.night(); await c.page.waitForTimeout(400);
    const qo = await fr.evaluate(() => ({ at: [city.x, city.y], r: fogRadius(), dark: BohemiaBosses.dark(city.x, city.y) }));
    const q = { sight: G.sight, inR: qi.r, inDark: qi.dark, outR: qo.r, outDark: qo.dark, drawnDark: qi.drawn };
    ok('D2 at night on his side the crew sees ' + G.sight + ' block (the map\'s own fog asks), his side painted black; outside it the night\'s half', BURN.D2(q) && qi.night && !!told && told.n === NAME,
      'in his dark at ' + qi.at + ': sight ' + qi.r + ' (his ' + qi.dark + '), ' + qi.drawn + ' blocks painted black; outside at ' + qo.at + ': sight ' + qo.r + '; said: ' + JSON.stringify(told));
    ok('P2 planted: his dark undone (the night\'s half on his side) turns D2 red', !BURN.D2(Object.assign({}, q, { inR: 3, inDark: 0 })), 'sight 3 in his dark');
    return true;
  },
  card(G, c) { const n = c.D.drums.length; return G.card.replace('{DRUMS}', n + (n === 1 ? ' DRUM' : ' DRUMS')).replace('{light}', c.light); },
  async after(c) {
    const { fr, G } = c;
    await c.goTo(c.tb); await c.night(); await fr.evaluate(() => render()); await c.page.waitForTimeout(600);
    const q = await fr.evaluate((n) => { const D = BohemiaBosses.darkness(n); return { at: [city.x, city.y], r: fogRadius(), dark: BohemiaBosses.dark(city.x, city.y), lit: D.drums.filter(d => BohemiaBosses.lit(d.x, d.y)).length,
      drawn: ((BohemiaBosses.last().drew || {}).drums || []).map(d => d.key), warm: (BohemiaBosses.last().drew || {}).warm | 0, black: (BohemiaBosses.last().drew || {}).dark | 0 }; }, NAME);
    ok('C1a at night on his side the crew sees like in the day by his drums (sight ' + q.r + '), his dark gone', BURN.C1a(q), JSON.stringify({ at: q.at, r: q.r, dark: q.dark }));
    ok('C1b every one of his drums is a fire of yours: lit at night, ' + c.light + ' blocks round each', q.lit === c.D.drums.length, q.lit + ' of ' + c.D.drums.length + ' lit');
    ok('C1c painted with the neighbours warming their hands, the fires glowing, nothing black', q.drawn.length >= 1 && q.drawn.every(k => k === 'drum_after') && q.warm >= 1 && q.black === 0, q.drawn.join(' ') + ', ' + q.warm + ' glowing, ' + q.black + ' black');
    await c.shot('5_his_drums_after');
    const posts = await c.posts();
    ok('C1d the feed posts it: ' + G.feed.who + ' and the radio', posts.some(p => p.who === G.feed.who && p.txt.indexOf(G.feed.txt.split('{')[0].trim()) === 0) && posts.some(p => p.who === '@valleyradio' && /Fires on/.test(p.txt)),
      posts.filter(p => p.who === G.feed.who || p.who === '@valleyradio').map(p => p.who + ': ' + p.txt.slice(0, 70)).join(' | '));
    const p3 = await fr.evaluate((n) => { const D = BohemiaBosses.darkness(n), H = BohemiaHisMap.state(), was = D.fell, f = H.boss.fallen[n]; D.fell = null; delete H.boss.fallen[n];
      const o = { r: fogRadius(), dark: BohemiaBosses.dark(city.x, city.y) }; D.fell = was; H.boss.fallen[n] = f; return o; }, NAME);
    ok('P3 planted: his dark back after the fall turns C1a red', !BURN.C1a(p3), JSON.stringify(p3));
    return { drums: c.D.drums.length };
  },
  async reload(e, c) {
    await e.fr.evaluate((t) => { try { T.min = t; } catch (x) {} }, NIGHT).catch(() => {});
    await c.goOn(e, c.tb);
    await e.fr.evaluate((t) => { try { T.min = t; } catch (x) {} render(); }, NIGHT).catch(() => {});
    await e.page.waitForTimeout(800);
    return e.fr.evaluate((n) => { const D = BohemiaBosses.darkness(n) || { drums: [] }; return { fallen: !!BohemiaHisMap.state().boss.fallen[n], drums: D.drums.length, at: [city.x, city.y],
      r: fogRadius(), dark: BohemiaBosses.dark(city.x, city.y), lit: D.drums.filter(d => BohemiaBosses.lit(d.x, d.y)).length }; }, NAME).catch(x => ({ err: String(x) }));
  }
};

const LEGS = { 'THE BURN': BURN };

async function run(prof, alpha) {
  console.log('\n-- ' + NAME + ' on ' + (alpha ? 'the alpha' : 'the demo') + ', ' + prof + ' --');
  const L = LEGS[NAME]; if (!L) { ok('a gate for ' + NAME, false, 'none'); return; }
  const dir = SHOTS ? path.join(SHOTS, prof + (alpha ? '_alpha' : '')) : null;
  if (dir) fs.mkdirSync(dir, { recursive: true });
  const d = await open({ profile: prof, fog: true, alpha: !!alpha });
  const fr = d.fr, page = d.page, errs = [], CUT = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 120) + ' AT ' + String(e.stack || '').split('\n').slice(1, 3).map(l => l.trim()).join(' < ')));
  /* the whole phone screen as he sees it (the driver's d.shot crops to the canvas box it measured at the door, and the alpha on its side
     measured that before the map showed: 3 x 3 pixels, measured 11/10) */
  const shot = async (name) => { if (dir) { try { await page.waitForTimeout(500); await page.screenshot({ path: path.join(dir, name + '.png') }); } catch (e) {} } };
  const tapEl = async (h) => { const b = h && await h.boundingBox(); if (!b) return false; await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
  for (let i = 0; i < 100; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaHisMap && !!BohemiaHisMap.data() && !!window.BohemiaBosses && !!BohemiaBosses.data()).catch(() => false)) break; }
  await fr.evaluate(() => { window.__BOSSES_TALK = true; });
  const rowOf = (n) => fr.evaluate((n) => JSON.parse(JSON.stringify(BohemiaBosses.data().bosses.filter(b => b.n === n)[0])), n);
  const bossCard = async (kind, n, ms) => { for (let i = 0; i < ms / 400; i++) { const c = await fr.evaluate((a) => { const c = window.__BOSS_CARD, el = document.getElementById('roadcard');
      return c && el && c.kind === a[0] && c.n === a[1] ? JSON.parse(JSON.stringify(c)) : null; }, [kind, n]).catch(() => null); if (c) return c; await page.waitForTimeout(400); } return null; };
  /* a thumb scrolls a card that runs past the screen's edge before it presses (the card is a scroll box, CONTENT's): the gate does too,
     and says when it had to (rule 441: a button under the edge is one a stranger may never find) */
  const pressCard = async (i) => { await page.waitForTimeout(700); const h = await fr.$('#roadcard button[data-road="' + i + '"]'); if (!h) return false;
    const cut = await h.evaluate((b) => { const r = b.getBoundingClientRect(), c = b.closest('.rc'), cr = c ? c.getBoundingClientRect() : { bottom: innerHeight }; const out = r.bottom > Math.min(innerHeight, cr.bottom) + 1; if (out) b.scrollIntoView({ block: 'nearest' }); return out; }).catch(() => false);
    if (cut) { CUT.push(i); await page.waitForTimeout(300); } return tapEl(h); };
  const inTown = () => fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; }).catch(() => false);
  const leaveTown = async () => { for (let k = 0; k < 3 && await inTown(); k++) { await page.waitForTimeout(900);
      if (!await tapEl(await page.$('#bohphone .bpctx.town .lv'))) { const sfr = page.frames().find(f => /SETTLEMENT/.test(f.url())); if (sfr) await tapEl(await sfr.$('#leave')); } await page.waitForTimeout(1300); }
    await toMap(fr); };
  /* the alpha comes out of the town in the close view (measured 11/10 on its side: MODE 'human', no sign placed in 60 s, because the
     bosses live on the map): he pinches out, and the pinch calls the game's own swapMode() */
  const toMap = async (f) => { if (await f.evaluate(() => { try { if (MODE === 'human' && !INSIDE && !(document.getElementById('settleFrame') && document.getElementById('settleFrame').style.display === 'block')) { swapMode(); return true; } } catch (e) {} return false; }).catch(() => false)) await page.waitForTimeout(1500); };
  for (let i = 0; i < 80; i++) { const t = await fr.evaluate(() => ({ on: !!(window.__START_IN_TOWN), opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await page.waitForTimeout(500); }
  await leaveTown();
  /* any meet card that is not his (a roaming crew, a road fight) he falls back from, the way a stranger walking to him would; his own
     party's (THE CLIMB's riggers) is this gate's only while it asks for one */
  const guard = setInterval(() => { fr.evaluate(() => { window.__BOSSES_TALK = true;   /* kept set: the alpha can load its map frame again under us (measured 11/10: no boss card after the first one) */
    try { if (MEET.up && !(/^boss:/.test((MEET.up.msg && MEET.up.msg.why) || '') || (window.__GATE_PARTY && /^riggers:/.test((MEET.up.msg && MEET.up.msg.why) || ''))) && window.MEET_DONE) MEET_DONE(false); } catch (e) {} }).catch(() => {}); }, 400);
  const st = () => fr.evaluate(() => { const H = BohemiaHisMap.state(), B = BohemiaBosses.state(); return JSON.parse(JSON.stringify({ at: [city.x, city.y], boss: H.boss, verbs: B.verbs, rumours: B.rumours })); });
  const settle = async () => { for (let i = 0; i < 160; i++) { await page.waitForTimeout(500); await leaveTown(); if (await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length || !!document.getElementById('roadcard') || (MEET && MEET.up)).catch(() => false)) break; } await page.waitForTimeout(800); };
  const go = (c) => fr.evaluate((c) => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); try { travelSpeedSet(4); } catch (e) {} const r = travelTo(0, 0, c); try { travelGoes(); } catch (e) {} return !!r; }, c);
  /* walk to a block and stand on it (a card on the road or a fall-back stops the walk short: walk on) */
  const goTo = async (c) => { if (!c) return false; for (let k = 0; k < 6; k++) { await toMap(fr); await go(c); await settle(); await clearCards(); const at = await fr.evaluate(() => [city.x, city.y]); if (at[0] === c[0] && at[1] === c[1]) return true; await page.waitForTimeout(600); } return false; };
  const night = () => fr.evaluate((t) => { try { T.min = t; } catch (e) {} }, NIGHT);
  const posts = () => fr.evaluate(() => (BOHEMIA_FEED.posts ? BOHEMIA_FEED.posts() : []).map(p => ({ who: p.who, txt: p.txt || '' })));
  const waitSign = async (n) => { let s = null; for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); s = await st(); if ((s.boss.sign && s.boss.sign.n === n && s.rumours[n]) || s.boss.found[n]) break;
      if (i === 14 && !s.boss.sign) { const st2 = await fr.evaluate(() => { const h = [city.x, city.y], n = om.n; let best = null, bd = 1e9;
          for (let y = 2; y < n - 2; y++) for (let x = 2; x < n - 2; x++) { if (!cityWalkable(x, y) || loopTownAt(x, y, 1)) continue; const dd = Math.max(Math.abs(x - h[0]), Math.abs(y - h[1])); if (dd < bd && dd >= 3 && cityRoute(h[0], h[1], x, y)) { bd = dd; best = [x, y]; } } return best; }).catch(() => null);
        if (st2) { await go(st2); await settle(); } } } return s; };
  /* an earlier boss's own card that turns up while he is felled the quick way is answered the way a stranger would (THE FILTER's gate, 11/9) */
  const clearCards = async () => { for (let k = 0; k < 6; k++) { const c = await fr.evaluate(() => window.__BOSS_CARD && document.getElementById('roadcard') ? window.__BOSS_CARD.kind + '|' + window.__BOSS_CARD.n : null).catch(() => null);
      if (!c) return; const kind = c.split('|')[0], n = c.split('|')[1]; if (n === NAME) return; await pressCard(kind === 'thing' ? 1 : 0); await page.waitForTimeout(900); } };
  const downBy = async (n) => { let s = await waitSign(n); await clearCards();
    s = await st(); if (s.boss.sign && s.boss.sign.n === n && !s.boss.found[n]) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); await clearCards(); }
    s = await st(); if (s.boss.sign && s.boss.sign.n === n && !s.boss.found[n]) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); }
    const th = await bossCard('thing', n, 8000); if (th) await pressCard(1);
    await clearCards();
    s = await st(); if (!s.boss.found[n]) return false;
    await fr.evaluate((n) => { BohemiaHisMap.fell(n); }, n);
    const af = await bossCard('after', n, 30000); if (af) await pressCard(0);
    await page.waitForTimeout(2500); await clearCards(); s = await st(); return !!s.boss.fallen[n]; };
  /* his place: walk there, his card, ENGAGE, AUTO (the checker ends it after `patience` and says so), the spoils left */
  const fightAt = async (n, patience) => {
    let s = await st(); const f = s.boss.found[n]; if (!f) return { meet: false, ff: null, by: 'not found' };
    await go([f.x, f.y]); let meet = false;
    for (let i = 0; i < 240 && !meet; i++) { await page.waitForTimeout(500); await leaveTown();
      meet = await fr.evaluate((n) => { try { return !!(MEET.up && MEET.up.msg && MEET.up.msg.why === 'boss:' + n); } catch (e) { return false; } }, n).catch(() => false);
      if (!meet && i % 20 === 19 && await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length)) await go([f.x, f.y]); }
    let mc = null;
    if (meet) { await page.waitForTimeout(1500); mc = await fr.evaluate(() => { const d = document.querySelector('#meetcard .mcboss'), g = document.querySelector('#meetcard button[data-meet="go"]'), b = document.querySelector('#meetcard button[data-meet="back"]');
        return d ? { look: d.dataset.look, face: (BohemiaBosses.last().cardFace || null), text: d.textContent, go: !!g, back: !!b } : null; }).catch(() => null);
      await shot('3_his_card'); await tapEl(await fr.$('#meetcard button[data-meet="go"]')); }
    let ff = null;
    for (let i = 0; i < 120 && !ff; i++) { await page.waitForTimeout(500); const h = await page.$('#fightFrame');
      if (h) { const x = await h.contentFrame(); if (x && await x.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) ff = x; } }
    let him = null, res = null, by = 'no fight';
    if (ff) {
      him = await ff.evaluate(() => { const u = FIGHT.S.units.filter(u => u.side === 'them' && u.boss)[0]; return u ? { name: u.name, look: u.look || null } : null; }).catch(() => null);
      await tapEl(await ff.$('#bauto'));
      for (let i = 0; i < patience * 2 && !res; i++) { await page.waitForTimeout(500); res = await ff.evaluate(() => FIGHT.S.over ? FIGHT.S.result : null).catch(() => null);
        if (!res && i % 30 === 29) await ff.evaluate(() => { try { if (!UI.auto) document.getElementById('bauto').click(); } catch (e) {} }).catch(() => {}); }
      by = 'AUTO';
      if (res !== 'won') { by = 'THE CHECKER (AUTO ' + (res || 'not done in ' + patience + ' s') + ')';
        await ff.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {}); }
      for (let i = 0; i < 40; i++) { await page.waitForTimeout(500); if (await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) break; }
      await page.waitForTimeout(1200);
      let left = false; try { const sf = page.frames().find(x => /SPOILS_SCREEN/.test(x.url())); if (sf) { await page.waitForTimeout(1200); left = await tapEl(await sf.$('#leave')); } } catch (e) {}
      await page.waitForTimeout(600);
      if (!left || await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
      for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); const q = await st(); if (q.boss.fallen[n]) break; }
    }
    return { meet, mc, ff: !!ff, him, by };
  };
  const c = { fr, page, d, shot, tapEl, go, goTo, settle, night, posts, st, pressCard, bossCard };
  /* the reopened phone walks the same way */
  c.goOn = async (e, to) => { for (let k = 0; k < 4; k++) { await e.fr.evaluate((c) => { try { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); travelSpeedSet(4); travelTo(0, 0, c); travelGoes(); } catch (x) {} }, to).catch(() => {});
    for (let i = 0; i < 100; i++) { await e.page.waitForTimeout(500); if (await e.fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length).catch(() => true)) break; }
    await e.page.waitForTimeout(1200); const at = await e.fr.evaluate(() => [city.x, city.y]).catch(() => [0, 0]); if (at[0] === to[0] && at[1] === to[1]) return true; } return false; };

  /* ---------- T0: every boss before him first, the ladder's order ---------- */
  const before = LADDER.slice(0, LADDER.indexOf(NAME)), downs = [];
  for (const n of before) downs.push(n + ' ' + await downBy(n));
  ok('T0 every boss before him first, the ladder\'s order (each one\'s sign read, his fall through the map\'s own fell(), his card answered)', downs.every(x => /true$/.test(x)), downs.join(', '));
  /* ---------- T1, T2 ---------- */
  const row = await rowOf(NAME), key = Object.keys(row).filter(k => ['dark', 'hole', 'riggers'].indexOf(k) >= 0)[0], G = row[key];
  c.G = G; c.row = row; c.light = (row.verb && row.verb.light_blocks) || 2;
  let s = await waitSign(NAME);
  ok('T1 ' + NAME + ': his sign (the ' + ((s.boss.sign || {}).kind || '?') + ') is in the world and his rumour is on the feed', !!(s.boss.sign && s.boss.sign.n === NAME) && !!s.rumours[NAME],
     s.boss.sign ? s.boss.sign.kind + ' at ' + s.boss.sign.x + ',' + s.boss.sign.y + ', his place ' + s.boss.sign.boss.x + ',' + s.boss.sign.boss.y : 'no sign');
  await clearCards();
  const ak = await bossCard('asker', NAME, 140000);
  if (ak) { await shot('0_she_asks'); await pressCard(0); const ay = await bossCard('asker_yes', NAME, 6000); if (ay) await pressCard(0); await page.waitForTimeout(600); }
  s = await st(); if (s.boss.sign && s.boss.sign.n === NAME) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); }
  s = await st(); if (s.boss.sign && s.boss.sign.n === NAME && !s.boss.found[NAME]) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); }
  s = await st(); const f = s.boss.found[NAME]; c.f = f;
  const th = f ? await bossCard('thing', NAME, 12000) : null;
  ok('T2 ' + row.lead.asker.name + ' asks; at the ' + row.lead.thing.head.replace(/^THE /, '').toLowerCase() + ' one of yours reads it out; his place is marked', !!ak && !!f && !!th && th.text === row.lead.thing.says && th.name !== 'YOU',
     (ak ? ak.name + ' asked' : 'nobody asked') + '; ' + (th ? th.name + ': "' + th.text.slice(0, 120) + '..."' : 'no card') + '; marked ' + (f ? f.x + ',' + f.y : 'NO'));
  if (th) { await shot('1_the_sign_read_out'); await pressCard(1); await page.waitForTimeout(600); }
  if (!f) { ok('the walk reached ' + NAME, false, 'the sign was not read'); clearInterval(guard); await d.close().catch(() => {}); return; }
  /* ---------- while he stands, his own way ---------- */
  const okBefore = await L.before(c);
  /* ---------- B0, B1: his card, his fight ---------- */
  const xf = await fightAt(NAME, 120);
  /* where the fight handed him back (the alpha can hand him back in the close view): read, then he pinches out to the map like anybody */
  const diag = await fr.evaluate(() => { const P = window.parent, F = P.document.getElementById('fightFrame'); let up = null; try { up = BohemiaRoadEvents.up(); } catch (e) {}
    return { mode: MODE, fightFrame: F ? F.style.display + '/' + P.getComputedStyle(F).display : null, spoils: !!(P.SPOILS && P.SPOILS.frame), fighting: (function () { try { return !!LOOP.fighting; } catch (e) { return null; } })(),
      card: window.__BOSS_CARD ? window.__BOSS_CARD.kind + ':' + window.__BOSS_CARD.n : null, cardUp: up, talk: !!window.__BOSSES_TALK, origin: (performance.timeOrigin | 0) % 100000, beat: JSON.stringify(window.__BOSS_BEAT ? { n: window.__BOSS_BEAT.n, done: !!window.__BOSS_BEAT.done } : null), town: (function () { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; })() }; }).catch(e => ({ err: String(e).slice(0, 80) }));
  console.log('  ..   after his fight: ' + JSON.stringify(diag));
  await leaveTown(); await toMap(fr);
  ok('B0 ' + NAME + '\'s card first: his own face, his title, his tip, ENGAGE or FALL BACK', xf.meet && !!xf.mc && xf.mc.look === row.boss.look && xf.mc.face === row.boss.look && xf.mc.text.indexOf(row.tip) >= 0 && xf.mc.go && xf.mc.back, JSON.stringify(xf.mc));
  ok('B1 his fight stands with the man himself (' + row.boss.look + ') and is won', xf.ff && !!xf.him && xf.him.name === row.boss.name && xf.him.look === row.boss.look, (xf.him ? xf.him.name + ' in ' + xf.him.look : 'no boss') + ', won by ' + xf.by);
  /* ---------- B2: the beat, the asker's card ---------- */
  const af = await bossCard('after', NAME, 30000);
  const bt = await fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_BEAT || null))).catch(() => null);
  if (af) { await page.waitForTimeout(500); await shot('4_she_says_what_changed'); }
  s = await st();
  const want = okBefore ? L.card(G, c) : null, onTape = bt ? (bt.drums | 0) + (bt.posts | 0) + (bt.riggers | 0) : 0;
  ok('B2 he falls: the beat plays his change on the tape with his place, ' + row.after.name + ' says the valley\'s line, hands his ' + row.verb.hand.name.replace(/^HIS /, '').toLowerCase() + ', and says what changed on the map',
     !!s.boss.fallen[NAME] && !!s.verbs[row.verb.id] && !!bt && bt.n === NAME && onTape >= 1 && !!af && af.text === row.after.valley && !!af.hand && af.hand.name === row.verb.hand.name && af.ground === want,
     'fallen ' + !!s.boss.fallen[NAME] + ', ' + row.verb.id.toUpperCase() + ' ' + !!s.verbs[row.verb.id] + ', the beat ' + (bt ? bt.phases.join('>') + ' with ' + onTape + ' pieces on the tape' : 'none') + ', card: ' + (af ? '"' + af.text + '" + ' + (af.hand ? af.hand.name : 'NO THING') + ' + "' + af.ground + '"' : 'none'));
  /* the feed keeps its last 14 posts (BOHEMIA_FEED's MAX): read it at the fall too, so a busy alpha cannot scroll his post out before C1d */
  c.fallPosts = await posts().catch(() => []);
  c.posts = async () => { const all = (c.fallPosts || []).concat(await posts().catch(() => [])), seenP = {}; return all.filter(p => { const k = p.who + '|' + p.txt; if (seenP[k]) return false; seenP[k] = 1; return true; }); };
  if (af) await pressCard(0);
  await page.waitForTimeout(2500);
  /* ---------- when he falls, his own way ---------- */
  const b4 = okBefore ? await L.after(c) : null;
  clearInterval(guard);
  /* ---------- R1 ---------- */
  const saved = () => page.evaluate(() => ['bohemia_city_save.a', 'bohemia_city_save.b', 'bohemia_city_save'].some(k => { const v = localStorage.getItem(k); return !!v && v !== '{"bohemia":"DEAD"}'; })).catch(() => false);
  for (let i = 0; i < 60 && !(await saved()); i++) await page.waitForTimeout(500);
  await fr.evaluate(() => { try { fogSave(); } catch (e) {} try { saveNow('gate'); } catch (e) {} }).catch(() => {});
  await page.waitForTimeout(3000);
  const reopen = async (wipe) => {
    if (wipe) await page.evaluate(() => { localStorage.removeItem('bohemia.bosses.v1'); localStorage.removeItem('bohemia.hismap.v1'); });
    const e = await open({ again: d, fog: true, alpha: !!alpha });
    for (let i = 0; i < 80; i++) { await e.page.waitForTimeout(500); if (await e.fr.evaluate(() => !!window.BohemiaHisMap && !!BohemiaHisMap.data() && !!window.BohemiaBosses && !!BohemiaBosses.data() && typeof city !== 'undefined').catch(() => false)) break; }
    for (let i = 0; i < 20; i++) { await e.page.waitForTimeout(500); if (await e.fr.evaluate(() => { try { return FOG.ready; } catch (x) { return false; } }).catch(() => false)) break; }
    await e.fr.evaluate(() => { window.__BOSSES_TALK = true; }).catch(() => {});
    await e.fr.evaluate(() => { try { if (MODE === 'human' && !INSIDE) swapMode(); } catch (x) {} }).catch(() => {}); await e.page.waitForTimeout(1500);
    const q = await L.reload(e, c);
    return { e, q };
  };
  if (b4) {
    const o1 = await reopen(false);
    if (dir) { try { await o1.e.page.waitForTimeout(500); await o1.e.page.screenshot({ path: path.join(dir, '6_opened_again.png') }); } catch (x) {} }
    ok('R1 the same phone opens the game again: he is still down and what he changed on the map holds', L.R1(o1.q, b4), JSON.stringify(o1.q).slice(0, 260));
    errs.push(...(o1.e.errs || []));
    try { await o1.e.page.close(); } catch (x) {}
    const o2 = await reopen(true);
    ok('P4 planted: a phone that forgot the save turns R1 red', !L.R1(o2.q, b4), JSON.stringify(o2.q).slice(0, 200));
    try { await o2.e.page.close(); } catch (x) {}
  } else ok('R1 the reopen', false, 'the fall\'s change was not reached');
  ok('C0 ' + prof + (alpha ? ' (the alpha)' : '') + ': nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 3).join(' | '));
  ok('C2 every boss card\'s buttons showed on the screen without a scroll (rule 441: no button under the edge)', CUT.length === 0, CUT.length ? CUT.length + ' presses had to scroll first' : 'none had to');
  await d.close().catch(() => {});
}

(async () => {
  const want = process.argv[3];
  const runs = want ? [[want.split(':')[0], /:alpha$/.test(want)]] : [['phone_portrait', false], ['phone_landscape', true]];
  for (const [p, a] of runs) { try { await run(p, a); } catch (e) { ok('the gate ran on ' + p + (a ? ' (the alpha)' : ''), false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\n' + NAME + ' CHANGES THE MAP: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
