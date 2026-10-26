#!/usr/bin/env node
/* A PLAIN WAY TO DROP A JOB (UI [the PC playtest: the UI's part] (5), rule 164 item 8, Paolo 10/24 on his PC: 'it's not clear
   how to cut a quest off... let's say I don't wanna do it anymore'). The rule is WORLD's (slices/bohemia_job_kinds.js drop and
   dropCost, 07826e02); the button is this lane's (slices/bohemia_phone_board.js YOUR JOBS). Battle Brothers' way: the contract
   you hold is in sight with an X that cancels it, and it asks once. Legs, on the demo, his phone, REAL TOUCHES on the glass:
   D1  a job taken: the phone shows it above the two on offer, its what, YOURS, its pay and its place, and a DROP 44 points;
   D2  DROP asks once, the cost printed from WORLD's own rule (nobody pays; the place's bar before and after, the same numbers);
   D3  KEEP IT takes the question back and the job is still held;
   D4  in its own fight it cannot be dropped, and the card says so; the job is still held;
   D5  DROP, then DROP IT: the job is gone from the map's held jobs, its card gone, WORLD's drop recorded, the place's bar 10 lower;
   D6  nothing thrown.
   RE-AIMED 10/26 BY UI TWO (rules 212(d), 227): the phone that showed the offers and YOUR JOBS is gone; the job he is on is a
   card in the new phone's job column (slices/bohemia_phone.js) with an X that asks once (the X 32 points wide by the card's
   24, as Battle Brothers' scroll; the asking card a thumb's DROP, 44 by 44) and the same WORLD drop and cost. The legs keep
   what they protect: shown, asked once with WORLD's own cost, kept by a tap elsewhere, refused in its own fight, dropped with
   the place's bar 10 lower; real touches on the glass of the shell, where the phone lives.
   Run: node gates/a_plain_way_to_drop_a_job_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await open({ profile: 'phone_portrait' });
  const p = d.page, fr = d.fr;
  await p.waitForTimeout(2500); try { await d.clearCards(); } catch (_e) {}
  await fr.waitForFunction(() => window.BohemiaPhoneBoard && BohemiaPhoneBoard.asks().length > 0, null, { timeout: 60000 }).catch(() => {});
  const took = await fr.evaluate(() => { const o = BohemiaPhoneBoard.asks()[0]; if (!o) return null; LOOP.open = { name: o.place, x: o.x, y: o.y, tier: o.tier };
    const ok = loopTakeContract({ id: o.id, title: o.title, pay: o.pay, skulls: o.skulls }); LOOP.open = null; return ok ? { id: o.id, place: o.place } : null; });
  await p.waitForTimeout(1500);
  const fb = await p.evaluate(() => { const r = document.getElementById('cityFrame').getBoundingClientRect(); return { x: r.x, y: r.y }; });
  const tap = async (sel) => { const r = await p.evaluate((s) => { const e = document.querySelector(s); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height }; }, sel);
    if (!r) return null; await p.touchscreen.tap(r.x, r.y); await p.waitForTimeout(600); return r; };
  /* the asking card's own words, tapped beside its DROP: the way he keeps it */
  const keep = async () => { const r = await p.evaluate(() => { const e = document.querySelector('#bohphone .jc.arm .tx'); if (!e) return null; const b = e.getBoundingClientRect(); return [b.x + 6, b.y + b.height / 2]; });
    if (r) { await p.touchscreen.tap(r[0], r[1]); await p.waitForTimeout(600); } };
  const card = () => p.evaluate(() => { const c = document.querySelector('#bohphone .jc'); if (!c) return null; const x = c.querySelector('.x'), r = x ? x.getBoundingClientRect() : null, dr = c.querySelector('.dr');
    const st = c.querySelector('.st');
    return { id: c.dataset.job, txt: (c.querySelector('.wh') || {}).textContent || '', stars: st ? st.textContent.length : 0, drop: r ? [Math.round(r.width), Math.round(r.height)] : null,
      cost: c.classList.contains('arm') ? c.innerText.replace(/\s+/g, ' ') : null, yes: !!dr, yesSize: dr ? [Math.round(dr.getBoundingClientRect().width), Math.round(dr.getBoundingClientRect().height)] : null,
      shown: c.getBoundingClientRect().height >= 20 && getComputedStyle(c).display !== 'none' }; });
  const held = () => fr.evaluate(() => LOOP.held.map(j => j.id));
  const c1 = await card();
  leg(!!took && c1 && c1.id === took.id && c1.shown && c1.stars >= 1 && c1.drop && c1.drop[0] >= 30 && c1.drop[1] >= 22 && c1.txt.length > 0,
    'D1  A JOB TAKEN: THE PHONE SHOWS IT, ITS WHAT, PLACE AND STARS, AND AN X A THUMB WIDE', JSON.stringify(c1));
  await tap('#bohphone .jc .x');
  const c2 = await card(), want = await fr.evaluate((id) => BohemiaJobKinds.dropCost(id), took && took.id);
  leg(c2 && c2.cost && want && want.place && c2.cost.toLowerCase().indexOf(String(want.place).toLowerCase()) >= 0 && /like you less/i.test(c2.cost) && want.after < want.before && c2.yes && c2.yesSize[0] >= 44 && c2.yesSize[1] >= 44,
    'D2  THE X ASKS ONCE, THE COST FROM WORLD\'S RULE (THE PLACE LIKES YOU LESS), AND A 44-POINT DROP', (c2 && c2.cost) + ' | rule ' + (want && want.place + ' ' + Math.round(want.before) + ' to ' + Math.round(want.after)));
  await keep();
  const c3 = await card(), h3 = await held();
  leg(c3 && !c3.cost && h3.indexOf(took && took.id) >= 0, 'D3  KEEP IT TAKES THE QUESTION BACK; THE JOB IS STILL HELD', JSON.stringify({ cost: c3 && c3.cost, held: h3 }));
  await fr.evaluate((id) => { LOOP.fighting = id; }, took && took.id);
  await tap('#bohphone .jc .x'); await tap('#bohphone .jc.arm .dr');
  const c4 = await card(), h4 = await held();
  leg(c4 && /NOT IN ITS OWN FIGHT/i.test(c4.cost || '') && !c4.yes && h4.indexOf(took && took.id) >= 0, 'D4  IN ITS OWN FIGHT IT CANNOT BE DROPPED, AND THE CARD SAYS SO', JSON.stringify({ cost: c4 && c4.cost, held: h4 }));
  await keep();
  await fr.evaluate(() => { LOOP.fighting = null; });
  const before = await fr.evaluate((pl) => BohemiaJobKinds.standing(pl), took && took.place);
  await tap('#bohphone .jc .x'); await tap('#bohphone .jc.arm .dr');
  const c5 = await card(), h5 = await held(), after = await fr.evaluate((pl) => BohemiaJobKinds.standing(pl), took && took.place), rec = await fr.evaluate(() => window.__JOB_DROPPED || []);
  leg(!c5 && h5.indexOf(took && took.id) < 0 && rec.some(r => r.id === (took && took.id)) && Math.round(before - after) === 10,
    'D5  DROP, DROP IT: THE JOB GONE, ITS CARD GONE, WORLD\'S DROP RECORDED, THE PLACE THINKS 10 LESS', JSON.stringify({ card: !!c5, held: h5, bar: [before, after] }));
  const e = d.errs.filter(x => !/ResizeObserver/.test(x));
  leg(e.length === 0, 'D6  NOTHING THROWN', e.slice(0, 3).join(' | ') || 'none');
  await d.close();
  console.log('=== A PLAIN WAY TO DROP A JOB GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate threw: ' + (e && e.stack || e)); process.exit(1); });
