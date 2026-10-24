#!/usr/bin/env node
/* ============================================================================
   THE SAVE SURVIVES THE CRASH (RUN 10/24/26, row [the crash and the save], rule 141(c))

   Paolo 10/24: 'when it crashes and I reload, it doesn't remember what I just got done.'

   Plays the demo on his phone's profile through the one driver, the way a person does: walks to the nearest town
   with a touch, hires a man at the post, takes a job off the board, leaves, walks to the job and wins its fight.
   After each of the two legs it waits a few seconds, then KILLS THE TAB (chrome://crash: the renderer dies with no
   pagehide, no unload, no last word, the way a phone kills it), opens the link again on the same phone, presses
   CONTINUE, and compares what the game remembers with what he had just done: the day and the hour, where the party
   stands, the batteries, the jobs held and done, the men hired, the crew. Every field must come back.
   Writes records/run/THE_SAVE_SURVIVES.json. Exit 1 if anything was forgotten.

     node tools/bohemia_run_the_save_survives.js [--file BOHEMIA_DEMO.html] [--wait 3000]
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const D = require('./bohemia_drive_the_demo.js');
const ROOT = path.dirname(__dirname);
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const FILE = arg('file', 'BOHEMIA_DEMO.html');
const WAIT = +arg('wait', 3000);
const OUT = path.join(ROOT, 'records/run/THE_SAVE_SURVIVES.json');

const STATE = () => {
  const hired = (() => { try { return JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]').map((h) => h.id || h.name || h.look); } catch (e) { return null; } })();
  return { day: (typeof DAY !== 'undefined' && DAY.day) || null, hour: (typeof DAY !== 'undefined' && typeof DAY.min === 'number') ? Math.floor(DAY.min / 60) : null,
    at: [city.x, city.y], bats: loopBats(), held: LOOP.held.map((j) => j.id), done: LOOP.done, hired: hired, crew: crewCount() };
};

async function play(d, leg, L) {
  const fr = d.fr, page = d.page;
  const waitFor = async (fn, ms) => { const s = Date.now(); while (Date.now() - s < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(250); } return false; };
  const cvBox = async () => { const h = await page.$('#cityFrame'); return h ? h.boundingBox() : null; };
  const touchCv = async (sx, sy) => { const fb = await cvBox(); const r = await fr.evaluate(() => { const b = document.getElementById('cv').getBoundingClientRect(); return { x: b.left, y: b.top }; }); await page.touchscreen.tap(fb.x + r.x + sx, fb.y + r.y + sy); };
  const touchCell = async (x, y) => { const q = await fr.evaluate(([x, y]) => { const p = __CITY.isoAt(x, y); return { sx: p.sx, sy: p.sy + TH / 2 }; }, [x, y]); await touchCv(q.sx, q.sy); };
  const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block'));
  const shellFight = () => page.evaluate(() => !!CITYFIGHT);
  const winFight = async () => {
    let f = null;
    for (let i = 0; i < 120 && !f; i++) { const h = await page.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board).catch(() => false)) f = c; } if (!f) await page.waitForTimeout(250); }
    if (f) await f.evaluate(() => { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {});
    await waitFor(async () => !(await shellFight()), 20000); await page.waitForTimeout(1800);
  };
  if (leg === 'town') {
    const town = await fr.evaluate(() => { const bs = ctBases() || {}; let n = null, best = 1e9; for (const k in bs) { const b = bs[k], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (dd < best && dd > 1) { best = dd; n = k; } } const b = bs[n]; return { name: n, x: b.x, y: b.y }; });
    L.town = town.name;
    for (let i = 0; i < 6 && !(await settleOpen()); i++) {
      if (await fr.evaluate(() => TRAVEL_SPEED === 0).catch(() => false)) await fr.evaluate(() => { try { setTravelSpeed(1); } catch (e) {} });
      await touchCell(town.x, town.y);
      await waitFor(async () => (await settleOpen()) || (await shellFight()), 30000);
      if (await shellFight()) await winFight();
    }
    if (!(await settleOpen())) throw new Error('never reached the town');
    const fh = await fr.$('#settleFrame'), sf = await fh.contentFrame();
    await sf.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready(), null, { timeout: 20000 });
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {});
    const off = async () => { const a = await cvBox(), b = await fh.boundingBox(); return { x: a.x + b.x, y: a.y + b.y }; };
    const tapIn = async (fn, argv) => { const p = await sf.evaluate(fn, argv); if (!p) return false; const o = await off(); await page.touchscreen.tap(o.x + p.x, o.y + p.y); await page.waitForTimeout(900); return true; };
    const tapText = (re) => tapIn((src) => { const re = new RegExp(src, 'i'); const els = [...document.querySelectorAll('button,.act,.client,div')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 20 && r.height > 16 && getComputedStyle(e).display !== 'none' && re.test((e.textContent || '').trim()); });
      els.sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height); const e = els[0]; if (!e) return null; const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, re.source);
    /* HIRE: the post, the first man he can pay for */
    await tapIn(() => BohemiaSettlement.where('hall'));
    L.hiredOne = await tapText(/^Hire/);
    console.log('  [save] in ' + L.town + ', hired: ' + L.hiredOne);
    /* A JOB: the sheet shut, the board, an offer, Take it */
    await tapIn(() => { const c = document.getElementById('close'); if (!document.getElementById('sheet').classList.contains('on') || !c) return null; const r = c.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
    await tapIn(() => BohemiaSettlement.where('board'));
    const offer = await sf.evaluate(() => { const b = [...document.querySelectorAll('#sheet .client')].filter((e) => e.getBoundingClientRect().height > 20)[0]; return b ? ((b.querySelector('.cl > span') || b.querySelector('span') || b).textContent.trim()) : null; });
    if (offer) { await tapText(new RegExp('^' + offer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))); await tapText(/^Take it/); }
    L.took = offer; console.log('  [save] took: ' + offer);
    console.log('  [save] leaving'); await tapText(/^LEAVE$/); await page.waitForTimeout(1200); console.log('  [save] left');
  }
  if (leg === 'fight') {
    const job = await fr.evaluate(() => LOOP.held[0] ? { id: LOOP.held[0].id, x: LOOP.held[0].target.x, y: LOOP.held[0].target.y } : null);
    L.job = job;
    if (!job) throw new Error('no job held to fight');
    await touchCell(job.x, job.y);
    if (!(await waitFor(shellFight, 40000))) { await touchCell(job.x, job.y); await waitFor(shellFight, 40000); }
    if (!(await shellFight())) throw new Error('the job never became a fight');
    await winFight();
  }
}

async function main() {
  const R = { file: FILE, when: new Date().toISOString(), box: 'Playwright Chromium, phone 390x844 touch, full CPU', waitMs: WAIT, legs: [] };
  let d = await D.open({ file: FILE });
  d.page.on('framedetached', (f) => console.log('  [save] a frame went away: ' + f.url().slice(-50)));
  try {
    await d.page.waitForTimeout(2500);
    R.start = await d.fr.evaluate(STATE);
    for (const leg of ['town', 'fight']) {
      const L = { leg };
      await play(d, leg, L);
      L.before = await d.fr.evaluate(STATE);
      await d.page.waitForTimeout(WAIT);
      /* THE CRASH: the tab dies with no last word */
      await d.page.goto('chrome://crash').catch(() => {});
      await new Promise((r) => setTimeout(r, 600));
      const old = d;
      d = await D.open({ file: FILE, again: old });
      L.reopenedVia = d.title.via;
      await d.page.waitForTimeout(2500);
      L.after = await d.fr.evaluate(STATE);
      const b = L.before, a = L.after, lost = [];
      if (a.day !== b.day) lost.push('day ' + b.day + ' -> ' + a.day);
      if (Math.abs((a.hour || 0) - (b.hour || 0)) > 1) lost.push('hour ' + b.hour + ' -> ' + a.hour);
      if (Math.max(Math.abs(a.at[0] - b.at[0]), Math.abs(a.at[1] - b.at[1])) > 1) lost.push('where ' + b.at + ' -> ' + a.at);
      if (a.bats !== b.bats) lost.push('batteries ' + b.bats + ' -> ' + a.bats);
      if (JSON.stringify(a.held) !== JSON.stringify(b.held)) lost.push('jobs held ' + JSON.stringify(b.held) + ' -> ' + JSON.stringify(a.held));
      if (a.done !== b.done) lost.push('jobs done ' + b.done + ' -> ' + a.done);
      if (JSON.stringify(a.hired) !== JSON.stringify(b.hired)) lost.push('hired ' + JSON.stringify(b.hired) + ' -> ' + JSON.stringify(a.hired));
      if (a.crew !== b.crew) lost.push('crew ' + b.crew + ' -> ' + a.crew);
      L.forgot = lost;
      console.log('  ' + leg.toUpperCase() + ': before ' + JSON.stringify(b) + '\n         after  ' + JSON.stringify(a) + '\n         ' + (lost.length ? 'FORGOT: ' + lost.join('; ') : 'REMEMBERED EVERYTHING') + ' (reopened via ' + L.reopenedVia + ')');
      R.legs.push(L);
    }
    R.errors = d.errs.slice(0, 10);
  } finally {
    R.ok = R.legs.length === 2 && R.legs.every((l) => l.forgot && l.forgot.length === 0);
    fs.mkdirSync(path.dirname(OUT), { recursive: true }); fs.writeFileSync(OUT, JSON.stringify(R, null, 1));
    console.log('THE SAVE SURVIVES THE CRASH: ' + (R.ok ? 'YES' : 'NO') + '  (' + path.relative(ROOT, OUT) + ')');
    await d.close().catch(() => {});
  }
  process.exit(R.ok ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });
