#!/usr/bin/env node
/* ============================================================================
   TAP A QUEST ON THE PHONE GATE (UI 7, 11/3/26; rule 376, ask line 404). The phone's half: slices/bohemia_phone.js
   __TAP_A_QUEST_YOUR_PEOPLE_GO__. The map's half (the road, the nearest marker, the close camera, the settlement on arrival) is
   WORLD 8's window.BOH_TRAVEL_TO_QUEST and its own gate, gates/tap_a_quest_your_people_go_gate.js.

   PAOLO 11/3: 'I should be able to click the quest on my phone and my people auto move towards it.'

   On the DEMO, a new game, through the one driver, his phone upright (390 x 844) and on its side (844 x 390), WITH A FINGER:
     T  IN A TOWN (the game starts in one): a job taken at its board; a finger on the job's card on the phone
        T1 the town's screen closes to the map (its own LEAVE) and the map's one call is what sent him (WORLD 8's, not a fallback)
        T2 THE PARTY MARKER STARTS MOVING: his block on the map changes inside 5 s of the tap
        T3 THE MARK: while he is on that road the tapped card, and only it, wears the going-mark (its arrow amber)
        T4 the mark comes off when that road ends
     M  ON THE MAP: a finger on the card again: the party sets off (WORLD 8's call) and the card wears the mark
     S  THE FEED'S STRIP: when the strip shows the post of the job he took (the feed's own 'took the job off the board'), the strip is
        that job's button (its go-mark); a finger on it sets the party off
     F  THE FEED'S PAGE: the post of a job he holds is a button there too; a finger on it closes the page to the map and sets him off
     B  BEFORE THE MAP'S CALL: with WORLD 8's call off the page, the tap still sends him (the map's own way to a job, P.jobGo)
     N  NO NOTES on the phone (rule 357(a): it stays gone)
     C1 nothing threw
   PLANTED (upright): the map answers no road to every call (T2 must fail: the marker does not move); the mark drawn plain (T3 must fail).
   node gates/tap_a_quest_on_the_phone_gate.js [profile]
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const AMBER = 'rgb(232, 168, 58)';

async function boot(prof) {
  const d = await open({ profile: prof, fog: true, beforeTap: async (p) => {
    for (let i = 0; i < 120; i++) { if (await p.evaluate(() => !!(window.BOH_TITLE && BOH_TITLE.up && BOH_TITLE.up())).catch(() => false)) break; await p.waitForTimeout(500); }
    await require(path.join(ROOT, 'tools', 'bohemia_through_the_title.js')).throughTheTitle(p, 60000); } });
  const fr = d.fr, page = d.page;
  d.errs = [];
  page.on('pageerror', e => d.errs.push(String(e).slice(0, 160)));
  for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BOH_TRAVEL_TO_QUEST && !!window.BohemiaBoardShelf).catch(() => false)) break; }
  for (let i = 0; i < 80; i++) { const t = await fr.evaluate(() => ({ on: !!(window.__START_IN_TOWN), opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await page.waitForTimeout(500); }
  await page.waitForTimeout(1500);
  return d;
}
/* a job taken at the board of the town his screen shows (the board's own take; a hunt first: many markers) */
const takeJob = (fr) => fr.evaluate(() => {
  if (!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.open)) return { none: 'not in a town' };
  const shelf = (BohemiaBoardShelf.shelf && BohemiaBoardShelf.shelf().offers) || [];
  const order = shelf.filter(o => BohemiaJobKinds.kindOf(o) === 'hunt-kind').concat(shelf.filter(o => BohemiaJobKinds.kindOf(o) !== 'hunt-kind'));
  for (const o of order) { let k = false; try { k = loopTakeContract(o); } catch (e) {}
    const j = LOOP.held.filter(h => h.id === o.id)[0]; if (k && j) return { id: String(j.id), plays: j.plays, from: j.from, town: LOOP.open.name }; }
  return { none: 'nothing taken of ' + shelf.length };
});
/* the road's card answered the way he can (FALL BACK), a fight or a town's screen left, the journey stopped: the map, standing */
const clear = (fr) => fr.evaluate(() => { try { travelStop(); } catch (e) {} try { if (LOOP.frame && LOOP.frame.style.display === 'block') loopClose(); } catch (e) {}
  try { if (typeof MEET !== 'undefined' && MEET && MEET.up) { const u = MEET.up; MEET.up = null; try { u.el && u.el.remove(); } catch (e) {} meetFallBack(u.msg); } } catch (e) {} try { render(); } catch (e) {} });
const where = (fr) => fr.evaluate(() => ({ at: [city.x, city.y], trav: !!(TRAVEL && TRAVEL.path), i: TRAVEL ? TRAVEL.i | 0 : 0, town: !!(LOOP.frame && LOOP.frame.style.display === 'block'), fight: !!LOOP.fighting, meet: !!(typeof MEET !== 'undefined' && MEET && MEET.up), calls: window.BohemiaQuestTravel ? BohemiaQuestTravel.state().calls : 0 }));
const phone = (page) => page.evaluate(() => ({ rec: window.__PHONE_QUEST_GO || null, going: window.BohemiaPhone && BohemiaPhone.going ? BohemiaPhone.going() : null,
  cards: [].map.call(document.querySelectorAll('#bohphone .jc'), c => { const p = c.querySelector('.dir path'), here = c.querySelector('.dir.here');
    return { id: c.dataset.job, going: c.classList.contains('going'), fill: p ? getComputedStyle(p).fill : null, dot: here ? getComputedStyle(here, '::after').backgroundColor : null, here: !!here }; }),
  screen: (document.getElementById('bohphone') || {}).dataset ? document.getElementById('bohphone').dataset.screen : null }));
/* the card's middle, clear of its X (the X keeps its own tap) */
const cardAt = (page, id) => page.evaluate((id) => { const c = document.querySelector('#bohphone .jc[data-job="' + id + '"]'); if (!c) return null; const b = c.getBoundingClientRect(), x = c.querySelector('.x');
  const xr = x ? x.getBoundingClientRect() : { x: b.right }; if (b.width < 4) return null; return [b.x + (xr.x - b.x) / 2, b.y + b.height / 2]; }, id);
async function finger(d, prof, at) { if (prof === 'computer') await d.page.mouse.click(at[0], at[1]); else await d.page.touchscreen.tap(at[0], at[1]); }
/* after a tap: did his block change inside 5 s, and what did the phone say while he went */
async function watchGo(d, id, n0) {
  const s0 = await where(d.fr); let moved = null, markSeen = null, rec = null, t0 = Date.now();
  for (let i = 0; i < 25 && Date.now() - t0 < 6000; i++) {
    await d.page.waitForTimeout(200);
    const s = await where(d.fr), ph = await phone(d.page); rec = ph.rec;
    if (ph.going && ph.going.id === id && !ph.going.wait && s.trav && !markSeen) markSeen = ph;
    if (!moved && (s.at[0] !== s0.at[0] || s.at[1] !== s0.at[1])) { moved = { ms: Date.now() - t0, from: s0.at, to: s.at }; }
    if (moved && (markSeen || !s.trav)) break;
  }
  return { moved, markSeen, rec: rec && rec.n > n0 ? rec : null, s0 };
}
const markOk = (m, id) => !!m && m.cards.filter(c => c.going).length === 1 && m.cards.filter(c => c.going)[0].id === id && (m.cards.filter(c => c.going)[0].here ? m.cards.filter(c => c.going)[0].dot === AMBER : m.cards.filter(c => c.going)[0].fill === AMBER);
const markWords = (m) => m ? m.cards.map(c => c.id + (c.going ? ' GOING ' + (c.here ? c.dot : c.fill) : '')).join(', ') : 'never on the road with the mark';
const recN = async (page) => { const r = (await phone(page)).rec; return r ? r.n : 0; };

async function run(prof, plant) {
  console.log('\n-- ' + prof + (plant ? ' PLANTED: ' + plant : '') + ' --');
  const d = await boot(prof), fr = d.fr, page = d.page;
  if (plant === 'no road') await fr.evaluate(() => { window.BOH_TRAVEL_TO_QUEST = function (id) { return { ok: false, why: 'planted', id: id }; }; BohemiaPhone.P.jobGo = function () { return false; }; });
  if (plant === 'plain mark') await page.addStyleTag({ content: '#bohphone .jc.going .dir path{fill:#2a1d10!important}#bohphone .jc.going .dir.here::after{background:#2a1d10!important}' });
  const job = await takeJob(fr);
  if (job.none) { ok('T0 ' + prof + ': a job taken at the start town\'s board', false, job.none); await d.close(); return; }
  await page.waitForTimeout(1200);
  /* T: IN A TOWN */
  const inTown = (await where(fr)).town, at = await cardAt(page, job.id);
  let n0 = await recN(page);
  if (at) await finger(d, prof, at);
  const t = at ? await watchGo(d, job.id, n0) : { moved: null, markSeen: null, rec: null };
  const tw = await where(fr);
  if (!plant || plant === 'no road') {
    ok('T1 ' + prof + ': a finger on the job\'s card in ' + job.town + ' closes the town to the map, and WORLD 8\'s call sent him', inTown && !!at && !tw.town && !!t.rec && t.rec.by === 'world' && t.rec.from === 'card',
      (inTown ? 'in the town' : 'NOT in a town') + (at ? '' : ', no card') + '; ' + (t.rec ? 'the call ' + t.rec.by + ', ' + (t.rec.ok ? 'went to ' + t.rec.name + ' (' + t.rec.mins + ' min), waited ' + t.rec.waited + ' ms for the town to close and the map to show his jobs' : t.rec.why) : 'no call'));
    ok('T2 ' + prof + ': the party marker starts moving', !!t.moved, t.moved ? 'block ' + t.moved.from + ' -> ' + t.moved.to + ' ' + t.moved.ms + ' ms after the tap' : 'his block never changed');
  }
  if (!plant || plant === 'plain mark') ok('T3 ' + prof + ': the card he tapped, and only it, wears the going-mark (amber) while he is on that road', markOk(t.markSeen, job.id), markWords(t.markSeen));
  if (plant) { await d.close(); return; }
  /* T4: the road ends (here: it is stopped where he stands, as a road's card stops it) and the mark comes off */
  await clear(fr); await page.waitForTimeout(600);
  const p4 = await phone(page);
  ok('T4 ' + prof + ': the mark comes off when that road ends', !p4.going && !p4.cards.some(c => c.going), p4.cards.map(c => c.id + (c.going ? ' still GOING' : '')).join(', '));
  /* M: ON THE MAP */
  n0 = await recN(page);
  const at2 = await cardAt(page, job.id); if (at2) await finger(d, prof, at2);
  const m = at2 ? await watchGo(d, job.id, n0) : {};
  ok('M ' + prof + ': on the map a finger on the card sets the party off (WORLD 8\'s call) and the card wears the mark', !!m.moved && !!m.rec && m.rec.by === 'world' && m.rec.ok && markOk(m.markSeen, job.id),
     (m.rec ? m.rec.by + ' ' + (m.rec.ok ? 'to ' + m.rec.name + ' of ' + m.rec.of : m.rec.why) : 'no call') + '; ' + (m.moved ? 'moved ' + m.moved.from + ' -> ' + m.moved.to : 'did not move') + '; ' + markWords(m.markSeen));
  /* S: THE STRIP: the feed's post of the job he took steps in once the clock moves; the strip is that job's button */
  await clear(fr);
  let strip = null, post = null;
  await fr.evaluate(() => { try { travelSpeedSet(4); } catch (e) {} });
  for (let i = 0; i < 120 && !strip; i++) {
    await page.waitForTimeout(400);
    const s = await page.evaluate(() => { const f = document.querySelector('#bohphone .home .bpfd'); return f ? { q: f.dataset.quest || null, cls: f.className, txt: (f.textContent || '').slice(0, 90) } : null; });
    if (!post) post = await fr.evaluate((from) => { const r = (window.BohemiaFeed && BohemiaFeed.read({ limit: 30 })) || []; const p = r.filter(x => x.type === 'job_taken' && String(x.text || '').toLowerCase().indexOf(String(from).toLowerCase()) >= 0)[0]; return p ? { text: p.text } : null; }, job.from);
    if (s && s.q) strip = s;
    const w = await where(fr); if (w.meet || w.town) await clear(fr);
    if (w.fight) break;
    if (!w.trav && i % 10 === 5) await fr.evaluate(() => { try { travelSpeedSet(4); } catch (e) {} });
  }
  if (strip) {
    await clear(fr); n0 = await recN(page);
    const sa = await page.evaluate(() => { const f = document.querySelector('#bohphone .home .bpfd'); if (!f || !f.dataset.quest) return null; const b = f.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; });
    if (sa) await finger(d, prof, sa);
    const s2 = sa ? await watchGo(d, job.id, n0) : {};
    ok('S ' + prof + ': the strip showing the post of his job is that job\'s button: a finger on it sets the party off', strip.q === job.id && !!s2.rec && s2.rec.from === 'strip' && s2.rec.ok && !!s2.moved,
       '"' + strip.txt.replace(/\s+/g, ' ').slice(0, 60) + '"; ' + (s2.rec ? s2.rec.from + ' ' + s2.rec.by + ' ' + (s2.rec.ok ? 'to ' + s2.rec.name : s2.rec.why) : 'no call') + '; ' + (s2.moved ? 'moved' : 'did not move'));
  } else ok('S ' + prof + ': the strip showed the post of his job', false, post ? 'the post is in the feed but never reached the strip in 48 s' : 'no post of the job in the feed in 48 s');
  /* F: THE FEED'S PAGE */
  await clear(fr);
  const nowQ = await page.evaluate(() => { const f = document.querySelector('#bohphone .home .bpfd'); return f && f.dataset.quest ? 1 : 0; });
  if (!nowQ) { const fa = await page.evaluate(() => { const f = document.querySelector('#bohphone .home .bpfd'); const b = f.getBoundingClientRect(); return [b.x + b.width / 2, b.y + b.height / 2]; }); await finger(d, prof, fa); }
  else await page.evaluate(() => BohemiaPhone.open('feed'));   /* the strip is his job's button this moment: the feed's page by the phone's own door */
  await page.waitForTimeout(900);
  const qa = await page.evaluate((id) => { const pg = document.querySelector('#bohphone .page'); const q = pg && pg.querySelector('.po.qp[data-quest="' + id + '"]'); if (!q) return { n: pg ? pg.querySelectorAll('.po').length : 0, page: pg && pg.dataset.page };
    q.scrollIntoView({ block: 'center' }); const b = q.getBoundingClientRect(); return { at: [b.x + b.width / 2, b.y + b.height / 2], page: pg.dataset.page, n: pg.querySelectorAll('.po').length, qp: pg.querySelectorAll('.po.qp').length }; }, job.id);
  let f2 = {};
  if (qa.at) { await page.waitForTimeout(200); n0 = await recN(page); await finger(d, prof, qa.at); f2 = await watchGo(d, job.id, n0); }
  const pageAfter = await page.evaluate(() => { const pg = document.querySelector('#bohphone .page'); return pg ? (pg.dataset.page || null) : null; });
  ok('F ' + prof + ': on the feed\'s page the post of his job is a button: a finger closes the page to the map and sets him off', !!qa.at && !pageAfter && !!f2.rec && f2.rec.from === 'feed' && f2.rec.ok && !!f2.moved,
     'page ' + qa.page + ', ' + qa.n + ' posts, ' + (qa.qp || 0) + ' of them his job\'s; ' + (f2.rec ? f2.rec.by + ' ' + (f2.rec.ok ? 'to ' + f2.rec.name : f2.rec.why) : 'no call') + '; page after: ' + (pageAfter || 'closed') + '; ' + (f2.moved ? 'moved' : 'did not move'));
  /* B: BEFORE THE MAP'S CALL WAS ON THE PAGE */
  await clear(fr); await page.waitForTimeout(400);
  await fr.evaluate(() => { window.__GATE_TQ = window.BOH_TRAVEL_TO_QUEST; window.BOH_TRAVEL_TO_QUEST = undefined; });
  n0 = await recN(page);
  const at3 = await cardAt(page, job.id); if (at3) await finger(d, prof, at3);
  const b = at3 ? await watchGo(d, job.id, n0) : {};
  await fr.evaluate(() => { window.BOH_TRAVEL_TO_QUEST = window.__GATE_TQ; });
  ok('B ' + prof + ': without WORLD 8\'s call the tap still sends him (the map\'s own way to a job)', !!b.rec && b.rec.by === 'map' && b.rec.ok && !!b.moved,
     (b.rec ? b.rec.by + ' ' + (b.rec.ok ? 'went' : b.rec.why) : 'no call') + '; ' + (b.moved ? 'moved ' + b.moved.from + ' -> ' + b.moved.to : 'did not move'));
  /* N: no NOTES */
  const notes = await page.evaluate(() => [].filter.call(document.querySelectorAll('#bohphone .app'), a => (a.dataset.app === 'notes' || /NOTES/.test(a.textContent || '')) && a.getBoundingClientRect().width > 2).length);
  ok('N ' + prof + ': no NOTES on the phone (rule 357(a))', notes === 0, notes + ' notes buttons');
  ok('C1 ' + prof + ': nothing threw', d.errs.length === 0, d.errs.slice(0, 2).join(' | ') || 'no page errors');
  await d.close();
}

(async () => {
  const only = process.argv[2];
  for (const prof of (only ? [only] : ['phone_portrait', 'phone_landscape'])) await run(prof);
  if (!only) {
    const p0 = pass, f0 = fail;
    await run('phone_portrait', 'no road');
    await run('phone_portrait', 'plain mark');
    const caught = fail - f0; pass = p0; fail = f0;
    ok('PLANTED: a map that answers no road (T2) and a plain mark (T3) are both caught', caught === 2, caught + ' of 2 caught');
  }
  console.log('\nTAP A QUEST ON THE PHONE: ' + pass + ' pass, ' + fail + ' fail');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
