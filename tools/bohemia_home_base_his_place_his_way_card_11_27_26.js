#!/usr/bin/env node
/* HOME BASE 5, 11/27/26: HIS PLACE, HIS WAY: its VOTE card (VAMILY rule 347(c): 'literally every thing in our custom settlement can be
   customized... super easy'; rule 441: a phone upright and sideways). One game per way of holding the phone: his place planted, his four
   buildings, five builds, a family and a man he let go living there. Every change made by a real tap on the demo, each shot before and
   after: MOVE (the water tank to another lot), PAINT (LIME on it, then TAR on the roof through the clinic it opens), SIGN (his words on the tank), ITS NAME (a tap
   on the camera's name line, ANOTHER, OK), WHO WORKS WHAT (a tap on one who lives there, WORKS AT the garden bed). Then the game is
   saved, the page shut and opened again (CONTINUE): the last shot is what came back.
   Writes records/target/home_base/his_place_his_way_<profile>_<shot>.webp, the card records/target/home_base/vote_his_place_his_way.webp
   and its first picture records/target/vote_first/home-base-his-place-his-way-11-27.webp, and the facts beside them.
   Run: node tools/bohemia_home_base_his_place_his_way_card_11_27_26.js [--only phone_portrait] [--no-card]; with --only, once each way:
   the card is made when both ways are in. --card makes it from the shots already taken. */
'use strict';
const path = require('path'), fs = require('fs'), { spawnSync } = require('child_process');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/target/home_base'), TMP = path.join(require('os').tmpdir(), 'hb5way-shots');
fs.mkdirSync(TMP, { recursive: true });   /* one profile a run fits a short clock: the shots of both are kept here and the card made when both are in */
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle, continueThroughTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !arg('--only') || p === arg('--only'));
const rd = f => { try { return JSON.parse(fs.readFileSync(path.join(TMP, f), 'utf8')); } catch (e) { return {}; } };
const shots = rd('shots.json'), facts = rd('facts.json');

/* his place, set up the way the last card set it up, plus people who live there */
async function setUp(F) {
  return F.evaluate(() => { try { loopClose(); } catch (e) {} DAY.day = 2;
    const x0 = city.x, y0 = city.y; let at = null;
    for (let r = 2; r < 30 && !at; r++) for (let dy = -r; dy <= r && !at; dy++) for (let dx = -r; dx <= r; dx++) { const x = x0 + dx, y = y0 + dy; if (!cityWalkable(x, y)) continue; const ch = BohemiaHomeMap.choose(x, y); if (ch && ch.g && ch.g.ok) { at = [ch.x, ch.y]; break; } }
    BohemiaHomeMap.plantAt(at[0], at[1]); const w = wagonGet() || {}; w.tape = 60; w.food = 12; wagonPut(w);
    ['grinder', 'forge', 'yard', 'lookout'].forEach(b => BohemiaHomeMap.placeBuild(b)); DAY.day = 3;
    const bk = lotBookFor(BohemiaBetween.mine()), P0 = purseGet(); BohemiaPurse.credit(P0, 'electricity', 20, 'card', 'card', DAY.day);
    ['tank', 'garden', 'solar', 'roof', 'wall'].forEach((k, i) => { try { BohemiaLotBuild.start(bk, P0, { x: i, y: 0 }, k, DAY.day, lotHoldFor(BohemiaBetween.mine())); } catch (e) {} });
    for (let q = 0; q < 2; q++) { for (const k in bk.lots) bk.lots[k].done = true; DAY.day = DAY.day + 1; try { lotWake(); } catch (e) {} }
    const r = BohemiaHomeMap.rec(); BohemiaHome.addResident(r, { name: 'TOMAS ARVIZU', why: 'let go', day: DAY.day, act: 1 });
    try { BohemiaHomeMap.state(); } catch (e) {}
    return { at, places: BohemiaHomeMap.state().places.map(p => p.id + '@' + p.lot), lots: Object.keys(bk.lots).map(k => k + ':' + bk.lots[k].id), res: BohemiaHomeMap.state().residents.map(r => r.name), workers: BohemiaHomeMap.workers() }; });
}
async function openHis(P, F) {
  await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
  let fr = null; for (let i = 0; i < 80 && !fr; i++) { await P.waitForTimeout(400); for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!(window.__HOME_FEED && window.__HOME_FEED.on) && !!(window.__HOME_LOOK && window.__HOME_LOOK().on); } catch (e) { return false; } }).catch(() => false)) { fr = x; break; } }
  if (!fr) return null;
  for (let i = 0; i < 40; i++) { if (await fr.evaluate(() => !document.getElementById('arrive')).catch(() => false)) break; await P.waitForTimeout(250); }
  await P.waitForTimeout(5000);
  return fr;
}
function tapper(P, fr) {
  const fbox = async () => (await fr.frameElement()).boundingBox();
  const at = async (fn, a) => { const fb = await fbox(); const w = await fr.evaluate(fn, a); if (!w) return false; await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); return true; };
  const sel = async (q) => at(q => { const e = document.querySelector(q); if (!e) return null; const r = e.getBoundingClientRect(); if (r.width < 2) return null; return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, q);
  const until = async (done, ms, a) => { for (let i = 0; i < (ms || 3000) / 200; i++) { await P.waitForTimeout(200); if (await fr.evaluate(done, a).catch(() => false)) return true; } return false; };
  return { at, sel, until };
}
async function shoot(P, prof, name) { const f = path.join(TMP, prof + '_' + name + '.png'); await P.screenshot({ path: f }); (shots[prof] = shots[prof] || {})[name] = f; }

(async () => {
  for (const prof of (process.argv.includes('--card') ? [] : PROFS)) {
    const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => {
      for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
      await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800); } });
    const P = d.page, F = d.fr, FX = facts[prof] = { steps: [] };
    for (let i = 0; i < 40; i++) { if (await F.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data() && window.BohemiaGrinder)).catch(() => false)) break; await P.waitForTimeout(250); }
    FX.set = await setUp(F);
    const fr = await openHis(P, F); if (!fr) { console.log(prof, 'NO FEED'); await d.close(); continue; }
    const T = tapper(P, fr), L = () => fr.evaluate(() => window.__HOME_LOOK());
    const close = async () => { await fr.evaluate(() => { const c = document.getElementById('close'); if (c && BohemiaSettlement.state.open) c.click(); }); await P.waitForTimeout(900); };
    await fr.evaluate(() => window.__HOME_FEED_TOUR_AT(0)); await P.waitForTimeout(400);
    await shoot(P, prof, '0_before');
    const l0 = await L(); FX.steps.push({ before: l0 });
    /* the tank's key: the lot book's lot where the tank stands */
    const tank = await fr.evaluate(() => { const H = window.__HOME_DESK.home, bk = window.parent.lotBookFor(window.parent.BohemiaBetween.mine()); for (const k in bk.lots) if (bk.lots[k].id === 'tank') return 'h' + parseInt(k, 10); return null; });
    const roof = await fr.evaluate(() => { const bk = window.parent.lotBookFor(window.parent.BohemiaBetween.mine()); for (const k in bk.lots) if (bk.lots[k].id === 'roof') return 'h' + parseInt(k, 10); return null; });
    /* 1 MOVE: a tap on the tank on the footage, MOVE, a tap on a lit lot */
    const openK = async (k) => { for (let t = 0; t < 3; t++) { await T.at(k => { const w = BohemiaSettlement.where(k); return w ? { x: w.x, y: w.y } : null; }, k); if (await T.until(k => BohemiaSettlement.state.open === k && !!document.querySelector('#sbody .hlook'), 3000, k).catch(() => false)) return true; } return false; };
    FX.tankOpen = await openK(tank); await P.waitForTimeout(900);
    await shoot(P, prof, '1_tank_station');
    await T.sel('#sbody .hlb[data-look="move"]'); await T.until(() => !!window.__HOME_MOVE, 2000); await P.waitForTimeout(1100);
    const mv = await fr.evaluate(() => window.__HOME_MOVE); FX.move = mv;
    await shoot(P, prof, '2_move_lit');
    const to = mv && mv.can.filter(n => true).sort((a, b) => a - b)[0];
    if (to != null) { await T.at(n => window.__HOME_FEED_AT(n) || null, to); await T.until(() => !window.__HOME_MOVE && !!window.__HOME_MOVED, 2500); }
    await P.waitForTimeout(1100); FX.moved = await fr.evaluate(() => window.__HOME_MOVED || null);
    await shoot(P, prof, '3_moved');
    /* 2 PAINT: LIME on the tank */
    FX.lum = { tankBare: await fr.evaluate(k => window.__HOME_LOOK_LUM(k), tank) };
    await T.sel('#sbody .hlb[data-look="paint"]'); await T.until(() => !!document.querySelector('#sbody .hpaint'), 2000);
    await T.sel('#sbody .hsw[data-paint="lime"]'); await T.until(() => !!window.__HOME_PAINTED, 2000); await P.waitForTimeout(900);
    FX.lum.tankLime = await fr.evaluate(k => window.__HOME_LOOK_LUM(k), tank);
    await shoot(P, prof, '4_painted');
    /* 3 SIGN: his words on the tank */
    await T.sel('#sbody .hlb[data-look="sign"]'); await T.until(() => !!document.querySelector('#sbody .hsign input'), 2000);
    await T.sel('#sbody .hsign input'); await P.keyboard.type('NO WATER'); await T.sel('#sbody .hsign .act[data-look="sign-ok"]'); await T.until(() => !!window.__HOME_SIGNED, 2000); await P.waitForTimeout(900);
    await shoot(P, prof, '5_signed');
    await close();
    /* PAINT TAR on the roof (it is the clinic's door at his place: the clinic's sheet carries MOVE, PAINT, SIGN too) */
    if (roof) { for (let i = 0; i < 3; i++) { await T.at(k => { const w = BohemiaSettlement.where(k); return w ? { x: w.x, y: w.y } : null; }, roof); if (await T.until(() => !!document.querySelector('#sbody .hlook'), 3000)) break; }
      await P.waitForTimeout(900); await shoot(P, prof, '5b_clinic'); FX.lum.roofBare = await fr.evaluate(k => window.__HOME_LOOK_LUM(k), roof);
      await T.sel('#sbody .hlb[data-look="paint"]'); await T.until(() => !!document.querySelector('#sbody .hpaint'), 2000); await P.waitForTimeout(1100);
      await T.sel('#sbody .hsw[data-paint="tar"]'); await P.waitForTimeout(900); FX.lum.roofTar = await fr.evaluate(k => window.__HOME_LOOK_LUM(k), roof); await close(); }
    /* 4 ITS NAME: the camera's name line, ANOTHER, OK */
    await fr.evaluate(() => window.__HOME_FEED_TOUR_AT(0)); await P.waitForTimeout(500);
    await T.at(() => window.__HOME_LOOK_AT('osd')); await T.until(() => !!document.querySelector('#sbody [data-look="another"]'), 2500); await P.waitForTimeout(500);
    await shoot(P, prof, '6_name_sheet');
    await T.sel('#sbody [data-look="another"]'); await P.waitForTimeout(300); await T.sel('#sbody [data-look="name-ok"]'); await T.until(() => !!window.__HOME_NAMED, 2000);
    await P.waitForTimeout(1500); FX.named = await fr.evaluate(() => window.__HOME_NAMED);
    await fr.evaluate(() => window.__HOME_FEED_TOUR_AT(0)); await P.waitForTimeout(600);
    await shoot(P, prof, '7_named_whole');
    /* 5 WHO WORKS WHAT: a tap on one who lives there, WORKS AT the garden bed */
    const ppl = await fr.evaluate(() => window.__HOME_FEED_PEOPLE().filter(p => p.resident));
    FX.people = ppl.map(p => p.name);
    const who = ppl.filter(p => p.name === 'TOMAS ARVIZU')[0] || ppl[0];
    if (who) { await T.at(n => { const p = window.__HOME_FEED_PEOPLE().filter(q => q.name === n)[0]; return p ? { x: p.x, y: p.y } : null; }, who.name); await T.until(() => !!document.querySelector('#sbody .hjobs'), 3000); await P.waitForTimeout(900);
      FX.jobsBefore = await fr.evaluate(() => window.__HOME_JOBS); await shoot(P, prof, '8_person');
      const gk = await fr.evaluate(() => { const b = [...document.querySelectorAll('#sbody .hjobs .act[data-job]')].filter(e => !e.classList.contains('on') && e.dataset.job !== 'rest'); const free = b.filter(e => /^\+/.test((e.querySelector('em') || {}).textContent || '')); return (free[0] || b[0] || {}).dataset ? (free[0] || b[0]).dataset.job : null; });
      FX.jobTo = gk; await T.sel('#sbody .hjobs .act[data-job="' + gk + '"]'); await T.until(g => (window.__HOME_JOBS || {}).mine === g, 3000, gk).catch(() => false); await P.waitForTimeout(1500);
      FX.jobsAfter = await fr.evaluate(() => window.__HOME_JOBS); await shoot(P, prof, '9_works_there'); await close(); }
    FX.after = await L();
    console.log(prof, JSON.stringify(FX).slice(0, 1500));
    /* kept: saved, the page shut, opened again with CONTINUE */
    await F.evaluate(() => { try { saveNow('card'); } catch (e) {} }); await P.waitForTimeout(1500); await P.close().catch(() => {});
    const e = await drive.open({ again: d, keepCards: true, beforeTap: async (pg) => {
      for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
      await pg.waitForTimeout(1500); await continueThroughTitle(pg); await pg.waitForTimeout(1800); } });
    for (let i = 0; i < 40; i++) { if (await e.fr.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data())).catch(() => false)) break; await e.page.waitForTimeout(250); }
    const fr2 = await openHis(e.page, e.fr);
    if (fr2) { await fr2.evaluate(() => window.__HOME_FEED_TOUR_AT(0)); await e.page.waitForTimeout(800); FX.reloaded = await fr2.evaluate(() => window.__HOME_LOOK()); const f = path.join(TMP, prof + '_10_reloaded.png'); await e.page.screenshot({ path: f }); shots[prof]['10_reloaded'] = f; }
    console.log(prof, 'RELOADED', JSON.stringify(FX.reloaded || null).slice(0, 800));
    await e.close();
    fs.writeFileSync(path.join(TMP, 'shots.json'), JSON.stringify(shots)); fs.writeFileSync(path.join(TMP, 'facts.json'), JSON.stringify(facts));
  }
  fs.writeFileSync(path.join(OUT, 'his_place_his_way_facts.json'), JSON.stringify(facts, null, 1));
  console.log('SHOTS', TMP);
  if (process.argv.includes('--no-card') || !shots.phone_portrait || !shots.phone_landscape) process.exit(0);
  const py = fs.readFileSync(path.join(ROOT, 'tools/bohemia_home_base_his_place_his_way_card_11_27_26.py'), 'utf8');
  const r = spawnSync('python3', ['-c', py, JSON.stringify({ shots, out: path.join(OUT, 'vote_his_place_his_way.webp'), first: path.join(ROOT, 'records/target/vote_first/home-base-his-place-his-way-11-27.webp'), dir: OUT })], { encoding: 'utf8' });
  console.log(r.stdout.trim(), r.stderr.trim().slice(-800));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
