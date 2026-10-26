#!/usr/bin/env node
/* ============================================================================
   MEET BEFORE YOU FIGHT GATE (RUN 10/25, rule 151(e), row [the speed, and meet before you fight]).

   PAOLO 10/24: 'when I walk over to an enemy or a job it doesn't display who I'm about to fight or the terrain, how
   Battle Brothers does: you find an enemy and they give you the option to fall back.'

   Plays the demo on his phone through the one driver, WITHOUT the engage option, so it meets the card the way a stranger
   does: it sets out after the nearest roaming party with the map's own travel (travelTo, the metronome's steps) and waits
   for contact. Then it holds:
     M1 the walk into a party stops on a card, and no fight has gone to the shell
     M2 the card says WHO (their name, how many, their stars) and THE GROUND (the block's kind) and offers two choices; how
        many is their men drawn (rule 224: no lone number), the count in data-n
     M3 the card draws their own men (at least one)
     M4 the map is held while it stands (the speed is PAUSE, nothing travelling)
     M5 FALL BACK by a finger: the card goes, no fight goes to the shell, he stands at least one block farther from them
     M6 walking into them again and ENGAGE: the fight goes to the shell through the one door, labelled as their party
     M7 the space bar does nothing to the map while the card stands (its own keys answer)
     M8 nothing threw
   RUN 10/26, [eyes: the meet card's men] (EYES 10/25w and z: 'THE DOGS IN THE WRECKS · 4 MEN', 'IN THE DARK' at 13:08, and the
   hyenas' card back on every step after FALL BACK) and rule 198(g), a hunt job off the nearest town's board, its pack met by day:
     M9  a beast meet names them as beasts (never MEN), its count is what stands, and by day it never says the dark
     M10 FALL BACK from the pack, then a walk to a town on the far side: the card never comes back, and the town opens
     M11 MUTATION: the get-away off (the hold and the pack's lost scent), the same walk brings the card back
   RUN 10/26, [make camp nearby] (rule 269(a), Paolo: 'if an enemy or a quest is stationary... fall back, engage, and a third option,
   heal and set up camp nearby; if they're roaming you don't have this option'):
     M12 a roaming enemy's card (the pack) has two choices, never MAKE CAMP NEARBY
     M13 a still enemy's card (a job's guards on the thing to get back, or its camp) has three
     M14 MAKE CAMP NEARBY: he stands a block back, the camp is made, they have not moved, no fight went to the shell
     M15 breaking camp himself, he walks the block back and the card asks again, three choices
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nMEET BEFORE YOU FIGHT GATE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* EYES' own case (10/25z, the phone): the town he is heading for lies past the pack. A hunt job off the nearest town's board (its
   own message); a town 8 to 30 blocks off; the job's pack set on the walk there, four blocks on; by day (13:08); he walks for the
   town and meets them */
async function packMeet(fr, page, again) {
  if (!again) {
    await fr.evaluate(() => { const bs = ctBases() || {}; let best = null; for (const n in bs) { const b = bs[n]; if (!b) continue; const dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (!best || dd < best.d) best = { name: n, x: b.x | 0, y: b.y | 0, d: dd, tier: mapTierOf(n) }; } if (best) loopOpenTown(best); });
    let sf = null; for (let i = 0; i < 60 && !sf; i++) { const fh = await fr.$('#settleFrame'); sf = fh ? await fh.contentFrame() : null; if (!sf) await page.waitForTimeout(300); }
    if (!sf) return null;
    await sf.waitForFunction(() => window.BohemiaBoardShelf && BohemiaBoardShelf.ready && BohemiaBoardShelf.ready(), null, { timeout: 30000 }).catch(() => {});
    const ids = await sf.evaluate(() => BohemiaBoardShelf.shelf().offers.map(o => o.id));
    for (const id of ids) {
      await fr.evaluate(() => { LOOP.held = LOOP.held.filter(j => j.plays === 'hunt-kind'); });
      if (await fr.evaluate(() => LOOP.held.length > 0)) break;
      await sf.evaluate((id) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0]; const c = Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) }), S = BohemiaSettlement.state; S.held.push(o.id);
        window.parent.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'contract', place: S.place.name, batteries: null, contract: c }, '*'); }, id);
      await page.waitForTimeout(600);
    }
    await fr.evaluate(() => { LOOP.held = LOOP.held.filter(j => j.plays === 'hunt-kind'); try { loopClose(); } catch (e) {} });
    await page.waitForTimeout(800);
  }
  const set = await fr.evaluate(() => {
    T.min = 13 * 60 + 8;   /* EYES' 13:08 */
    const j = LOOP.held.filter(h => h.plays === 'hunt-kind')[0]; if (!j || !j.packs || !j.packs.length) return null;
    LOOP.held = [j]; LOOP.fighting = null; CITY_CONTACT_POSTED = false; j.fight = null;
    const p = j.packs[0]; p.shy = 0; p.smelt = false; j.packs = [p];
    const bs = ctBases() || {}; let pick = null;
    for (const n in bs) { const b = bs[n]; if (!b) continue; const t = { name: n, x: b.x | 0, y: b.y | 0, tier: mapTierOf(n) };
      const dd = Math.max(Math.abs(t.x - city.x), Math.abs(t.y - city.y)); if (dd < 10 || dd > 30) continue;
      const w = townDoorWalk(t); if (!w || w.path.length < 10) continue; pick = { t, w }; break; }
    if (!pick) return null;
    const P = pick.w.path; p.x = P[4][0]; p.y = P[4][1];
    travelStop(); townTap(pick.t);
    window.__GATE_TOWN = pick.t;
    return { town: pick.t.name, pack: [p.x, p.y], n: p.n, blocks: P.length - 1 };
  });
  if (!set) return null;
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(400); if (await fr.evaluate(() => !!document.getElementById('meetcard'))) break; }
  return fr.evaluate((set) => { const e = document.getElementById('meetcard'); if (!e) return null; const u = window.__MEET_UP || {}, m = MEET.up && MEET.up.msg;
    const stands = m && m.party ? ((m.party.band && m.party.band.length) || m.party.count) : 0, sp = e.querySelector('.mcs [data-n]'), words = sp ? sp.textContent : '';
    return { text: e.textContent, words, said: sp ? +sp.dataset.n : 0, up: u, stands, set, clock: Math.floor(T.min / 60) + ':' + String(Math.floor(T.min % 60)).padStart(2, '0') }; }, set);
}
/* a still enemy: a job off the nearest town's board whose next place is a fixed spot (guards on a thing, a camp, the crew's spot), walked into */
async function stillMeet(fr, page) {
  await fr.evaluate(() => { const bs = ctBases() || {}; let best = null; for (const n in bs) { const b = bs[n]; if (!b) continue; const dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (!best || dd < best.d) best = { name: n, x: b.x | 0, y: b.y | 0, d: dd, tier: mapTierOf(n) }; } if (best) loopOpenTown(best); });
  let sf = null; for (let i = 0; i < 60 && !sf; i++) { const fh = await fr.$('#settleFrame'); sf = fh ? await fh.contentFrame() : null; if (!sf) await page.waitForTimeout(300); }
  if (!sf) return null;
  await sf.waitForFunction(() => window.BohemiaBoardShelf && BohemiaBoardShelf.ready && BohemiaBoardShelf.ready(), null, { timeout: 30000 }).catch(() => {});
  const ids = await sf.evaluate(() => BohemiaBoardShelf.shelf().offers.map(o => o.id));
  const STILL = ['recover-return', 'clear-camp'];
  for (const id of ids) {
    await fr.evaluate((S) => { LOOP.held = LOOP.held.filter(j => S.indexOf(j.plays) >= 0 || !j.plays); }, STILL);
    if (await fr.evaluate((S) => LOOP.held.some(j => S.indexOf(j.plays) >= 0), STILL)) break;
    await fr.evaluate(() => { LOOP.held = []; });
    await sf.evaluate((id) => { const o = BohemiaBoardShelf.shelf().offers.filter(x => x.id === id)[0]; const c = Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) }), S = BohemiaSettlement.state; S.held.push(o.id);
      window.parent.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'contract', place: S.place.name, batteries: null, contract: c }, '*'); }, id);
    await page.waitForTimeout(600);
  }
  await fr.evaluate((S) => { LOOP.held = LOOP.held.filter(j => S.indexOf(j.plays) >= 0); try { loopClose(); } catch (e) {} }, STILL);
  await page.waitForTimeout(800);
  const go = await fr.evaluate(() => { const j = LOOP.held[0]; if (!j) return null; const nx = BohemiaJobKinds.nextOf(j); if (!nx) return null;
    T.min = 13 * 60; travelStop(); travelTo(0, 0, [nx.x | 0, nx.y | 0]); travelGoes(); return { kind: j.plays, them: [nx.x | 0, nx.y | 0] }; });
  if (!go) return null;
  for (let i = 0; i < 160; i++) { await page.waitForTimeout(400); if (await fr.evaluate(() => !!document.getElementById('meetcard'))) break; }
  return fr.evaluate((go) => { const e = document.getElementById('meetcard'); if (!e) return null;
    return { kind: go.kind, them: go.them, why: (window.__MEET_UP || {}).why, still: (window.__MEET_UP || {}).still, camp: !!e.querySelector('[data-meet="camp"]'), go: !!e.querySelector('[data-meet="go"]'), back: !!e.querySelector('[data-meet="back"]'),
      buttons: [...e.querySelectorAll('[data-meet]')].map(b => b.textContent).join(' / ') }; }, go);
}
/* FALL BACK by the card's own button path, then the same walk to the same town; count the cards on the way */
async function getAway(fr, page) {
  const t = await fr.evaluate(() => { MEET_DONE(false); const t = window.__GATE_TOWN; townTap(t); return t && t.name; });
  if (!t) return null;
  let cards = 0, opened = false;
  for (let i = 0; i < 240; i++) { await page.waitForTimeout(300);
    const s = await fr.evaluate(() => ({ card: !!document.getElementById('meetcard'), open: !!(LOOP.frame && LOOP.frame.style.display === 'block'), travel: !!TRAVEL }));
    if (s.card) { cards++; if (cards > 3) break; await fr.evaluate(() => { MEET_DONE(false); townTap(window.__GATE_TOWN); }); continue; }
    if (s.open) { opened = true; break; }
    if (!s.travel) await fr.evaluate(() => { townTap(window.__GATE_TOWN); }); }
  const held = await fr.evaluate(() => MEET_BACK.held);
  return { town: t, cards, opened, held };
}

(async () => {
  const d = await open({ profile: 'phone_portrait' });
  const fr = d.fr, page = d.page, errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  await page.waitForTimeout(3000);
  await page.evaluate(() => { window.__POSTS = []; window.addEventListener('message', e => { if (e.data && e.data.type === 'BOHEMIA_CITY_ENCOUNTER') window.__POSTS.push(e.data.why || ''); }); });
  const chase = () => fr.evaluate(() => {
    const ps = partiesAll(); let best = null, bd = 1e9;
    ps.forEach(p => { const dd = Math.max(Math.abs((p.at.x | 0) - city.x), Math.abs((p.at.y | 0) - city.y)); if (dd > 0 && dd < bd) { bd = dd; best = p; } });
    if (!best) return null;
    const tx = best.at.x | 0, ty = best.at.y | 0; let c = cityWalkable(tx, ty) ? [tx, ty] : null;
    if (!c) for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) if (cityWalkable(tx + a, ty + b)) { c = [tx + a, ty + b]; break; }
    if (!c) return null;
    PARTY_CHASE = best.id; PARTY_SEL = best.id; travelTo(0, 0, c); travelGoes();
    return { id: best.id, dist: bd };
  });
  const waitCard = async () => { for (let i = 0; i < 80; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!document.getElementById('meetcard'))) return true; } return false; };
  const c1 = await chase();
  const up = c1 ? await waitCard() : false;
  const posts1 = await page.evaluate(() => window.__POSTS.slice());
  ok('M1 walking into a party stops on a card, and no fight has gone to the shell', up && posts1.length === 0, (c1 ? c1.id + ' at ' + c1.dist : 'no party') + ', posts ' + posts1.length);
  const card = await fr.evaluate(() => { const e = document.getElementById('meetcard'); if (!e) return null;
    return { text: e.textContent, n: e.querySelector('.mcs [data-n]') ? +e.querySelector('.mcs [data-n]').dataset.n : null, stars: e.querySelectorAll('.bmstar').length || (e.querySelector('.mcstars') ? e.querySelector('.mcstars').textContent.length : 0),
      go: !!e.querySelector('[data-meet="go"]'), back: !!e.querySelector('[data-meet="back"]'), up: window.__MEET_UP, speed: TRAVEL_SPEED, travel: !!(TRAVEL && TRAVEL.path && TRAVEL.i < TRAVEL.path.length) }; });
  ok('M2 the card says who (name, how many, stars) and the ground, with ENGAGE and FALL BACK', !!card && card.n >= 1 && /(MEN|MAN|KIDS?|MACHINES?|BEASTS?|DEAD|DEAD ONE|DIRE WOL(F|VES)|HYENAS?)\b/.test(card.text) && /THE GROUND/.test(card.text) && card.stars >= 1 && card.stars <= 3 && card.go && card.back,
     card ? card.text.replace(/\s+/g, ' ').slice(0, 120) + ' / stars ' + card.stars : 'no card');
  ok('M3 the card draws their own men', !!card && card.up && card.up.men >= 1, card && card.up ? card.up.men + ' drawn of ' + card.up.n : '');
  ok('M4 the map is held while it stands', !!card && card.speed === 0 && !card.travel, card ? 'speed ' + card.speed + ', travelling ' + card.travel : '');
  const sp0 = await fr.evaluate(() => window.__SPACE_PAUSES | 0);
  await page.keyboard.press('Space').catch(() => {});
  await page.waitForTimeout(300);
  const sp1 = await fr.evaluate(() => ({ n: window.__SPACE_PAUSES | 0, speed: TRAVEL_SPEED, card: !!document.getElementById('meetcard') }));
  ok('M7 the space bar does nothing to the map while the card stands', sp1.n === sp0 && sp1.speed === 0 && sp1.card, JSON.stringify(sp1));
  /* FALL BACK, by a finger on the button */
  const before = await fr.evaluate((id) => { const p = partyById(id); return { me: [city.x, city.y], them: p ? [p.at.x | 0, p.at.y | 0] : null }; }, c1 ? c1.id : null);
  const b = await fr.evaluate(() => { const e = document.querySelector('#meetcard [data-meet="back"]'); if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  const box = await page.evaluate(() => { const f = document.getElementById('cityFrame'); const r = f.getBoundingClientRect(); return { x: r.x, y: r.y }; });
  if (b) await page.touchscreen.tap(box.x + b.x, box.y + b.y);
  await page.waitForTimeout(800);
  const after = await fr.evaluate(() => ({ me: [city.x, city.y], card: !!document.getElementById('meetcard'), last: window.__MEET_LAST || null }));
  const posts2 = await page.evaluate(() => window.__POSTS.slice());
  const dist = (a, t) => Math.max(Math.abs(a[0] - t[0]), Math.abs(a[1] - t[1]));
  ok('M5 FALL BACK: the card goes, no fight, and he stands farther from them', !after.card && after.last && after.last.go === false && posts2.length === 0 && before.them && dist(after.me, before.them) > dist(before.me, before.them),
     before.them ? 'from ' + dist(before.me, before.them) + ' to ' + dist(after.me, before.them) + ' blocks, posts ' + posts2.length : 'no party');
  /* again, and ENGAGE */
  const c2 = await chase();
  const up2 = c2 ? await waitCard() : false;
  await page.keyboard.press('Enter').catch(() => {});
  await page.waitForTimeout(400);
  if (await fr.evaluate(() => !!document.getElementById('meetcard'))) {
    const g = await fr.evaluate(() => { const e = document.querySelector('#meetcard [data-meet="go"]'); const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await page.touchscreen.tap(box.x + g.x, box.y + g.y);
  }
  for (let i = 0; i < 20; i++) { await page.waitForTimeout(500); if ((await page.evaluate(() => window.__POSTS.length)) > 0) break; }
  const posts3 = await page.evaluate(() => window.__POSTS.slice());
  ok('M6 again, and ENGAGE: the fight goes to the shell through the one door, as their party', up2 && posts3.length === 1 && /^party:/.test(posts3[0]), posts3.join(' '));
  /* M9 to M11: a pack of beasts, by day */
  await fr.evaluate(() => { try { if (window.MEET_DONE && MEET.up) MEET_DONE(false); } catch (e) {} LOOP.fighting = null; CITY_CONTACT_POSTED = false; travelStop(); });
  await page.waitForTimeout(1500);
  const beast = await packMeet(fr, page, false);
  const m12 = await fr.evaluate(() => { const e = document.getElementById('meetcard'); return e ? { camp: !!e.querySelector('[data-meet="camp"]'), still: window.__MEET_UP && __MEET_UP.still } : null; });
  ok('M12 a roaming enemy\'s card has two choices, never MAKE CAMP NEARBY', !!m12 && !m12.camp && m12.still === false, JSON.stringify(m12));
  ok('M9 a beast meet names them as beasts, the count is what stands, and by day no dark', !!beast && beast.up && beast.up.beasts && !/\bMEN?\b/.test(beast.words) && !/DARK/.test(beast.text) && beast.said === beast.stands && beast.stands > 0,
     beast ? '"' + beast.words.trim() + '" (' + beast.stands + ' stand) at ' + beast.clock + ', on the walk to ' + beast.set.town : 'no pack met');
  const away = beast ? await getAway(fr, page) : null;
  ok('M10 FALL BACK from the pack, then a walk to a town on the far side: no card again, the town opens', !!away && away.cards === 0 && away.opened,
     away ? 'to ' + away.town + ' past the pack, cards ' + away.cards + ', contacts held ' + away.held + ', opened ' + away.opened : 'no walk');
  /* M11: the same with the get-away off */
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} LOOP.fighting = null; CITY_CONTACT_POSTED = false; travelStop(); MEET_BACK.steps = 0; MEET_BACK.list = [];
    /* back where the first walk began */ const t = window.__GATE_TOWN; });
  const beast2 = await packMeet(fr, page, true);
  const away2 = beast2 ? await getAway(fr, page) : null;
  await fr.evaluate(() => { MEET_BACK.steps = 10; });
  ok('M11 MUTATION: the get-away off, the same walk brings the card back', !!away2 && away2.cards > 0, away2 ? 'cards ' + away2.cards + ', opened ' + away2.opened : 'no walk (' + (beast2 ? 'met' : 'no meet') + ')');
  /* M13 to M15: a still enemy */
  await fr.evaluate(() => { try { if (window.MEET_DONE && MEET.up) MEET_DONE(false); } catch (e) {} try { loopClose(); } catch (e) {} LOOP.fighting = null; CITY_CONTACT_POSTED = false; travelStop(); LOOP.held = []; });
  const still = await stillMeet(fr, page);
  ok('M13 a still enemy\'s card has three choices', !!still && still.camp && still.go && still.back && still.still === true, still ? still.why + ', ' + still.kind + ': ' + still.buttons : 'no still meet');
  let m14 = null;
  if (still) {
    const before = await fr.evaluate(() => ({ me: [city.x, city.y] })); before.posts = await page.evaluate(() => window.__POSTS.length);
    await fr.evaluate(() => { const b = document.querySelector('#meetcard [data-meet="camp"]'); b.click(); });
    await page.waitForTimeout(900);
    m14 = await fr.evaluate((st) => { const j = LOOP.held[0], nx = j ? BohemiaJobKinds.nextOf(j) : null;
      return { me: [city.x, city.y], camp: !!(window.BohemiaMapCamp && BohemiaMapCamp.on()), card: !!document.getElementById('meetcard'), them: nx ? [nx.x | 0, nx.y | 0] : null, was: st.them, last: window.MEET_CAMP && MEET_CAMP.last }; }, still);
    m14.posts = await page.evaluate(() => window.__POSTS.length);
    const dd = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
    ok('M14 MAKE CAMP NEARBY: a block back, camp made, they have not moved, no fight', m14.camp && !m14.card && m14.posts === before.posts && dd(m14.me, before.me) === 1 && !!m14.them && dd(m14.them, still.them) === 0 && dd(m14.me, m14.them) > dd(before.me, m14.them),
       'from ' + before.me + ' to ' + m14.me + ', them ' + still.them + ' -> ' + m14.them + ', camp ' + m14.camp + ', posts ' + before.posts + ' -> ' + m14.posts);
    /* M15: he breaks camp himself */
    await fr.evaluate(() => { try { BohemiaMapCamp.break(); } catch (e) {} });
    let again = null; for (let i = 0; i < 40 && !again; i++) { await page.waitForTimeout(300); again = await fr.evaluate(() => { const e = document.getElementById('meetcard'); return e ? { camp: !!e.querySelector('[data-meet="camp"]'), go: !!e.querySelector('[data-meet="go"]') } : null; }); }
    ok('M15 breaking camp, he walks the block back and the card asks again, three choices', !!again && again.camp && again.go, JSON.stringify(again));
    await fr.evaluate(() => { try { if (MEET.up) MEET_DONE(false); } catch (e) {} });
  } else { ok('M14 MAKE CAMP NEARBY', false, 'no still meet'); ok('M15 breaking camp', false, 'no still meet'); }
  ok('M8 nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
  await d.browser.close(); try { d.server && d.server.close(); } catch (_e) {}
  done();
})().catch(e => { ok('the gate ran', false, e.message); done(); });
