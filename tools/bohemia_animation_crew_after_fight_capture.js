#!/usr/bin/env node
/* BOHEMIA -- ANIMATION [crew screen after a fight] (rule 369 amended 11/4, ask line 433): THE COMPANY SCREEN OVER THE FIGHT, FILMED ON
   ITS REAL SURFACE. The demo on the phone's profile (390 x 844 at three to one, touch) through the shared driver: out of the town, a
   road fight won (theirs dead where they stood, one of his down), one of his given a level, the end screen's CHOOSE HIS LEVEL-UP
   tapped with a finger; then the company screen filmed by the browser's own screen recording (every frame it paints, timestamped):
   six seconds of his men going through the dead, a finger on YOU in the line, the glide and four seconds after.
     node tools/bohemia_animation_crew_after_fight_capture.js
       records/target/animation/crew_after_fight/film/NNNN.jpg (the phone's points) and now.json (when each was painted), then
       python3 tools/bohemia_animation_crew_after_fight_capture.py -> now.webp (one moving picture at the game's speed)
   REUSE CHECK: PLUMBER's driver, RUN's title pass, the gate's own way into the fight (gates/the_crew_screen_sees_the_fight_gate.js);
   nothing drawn here. */
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const OUT = path.join(ROOT, 'records/target/animation/crew_after_fight');
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const d = await drive.open({ profile: 'phone_portrait', keepCards: true, engage: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  const p = d.page, fr = d.fr, errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.waitForTimeout(2500);
  const sf0 = p.frames().find(x => /SETTLEMENT_SCREEN/.test(x.url())); if (sf0) { await sf0.evaluate(() => { const b = document.getElementById('leave'); if (b) b.click(); }).catch(() => {}); await p.waitForTimeout(4000); }
  await fr.evaluate(() => { const clear = (x, y) => { try { return !townSafeAt(x, y) && !townGround(x, y); } catch (_e) { return true; } };
    if (!clear(city.x, city.y)) { outer: for (let r = 4; r < 80; r += 2) for (let a = 0; a < 8; a++) { const x = Math.round(city.x + r * Math.cos(a * Math.PI / 4)), y = Math.round(city.y + r * Math.sin(a * Math.PI / 4)); if (clear(x, y)) { city.x = x + 0.5; city.y = y + 0.5; break outer; } } }
    try { stepOnce(0); stepOnce(4); } catch (_e) {} roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 51 }); });
  let f = null;
  for (let i = 0; i < 200 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
  if (!f) throw new Error('no fight');
  await p.waitForTimeout(1200);
  await f.evaluate(() => { const S = FIGHT.S, now = performance.now();
    S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; u._fallAt = now - 4000; });
    const you = S.units.filter(u => u.side === 'you'); if (you.length > 2) { const v = you[you.length - 1]; v.down = true; v._fallAt = now - 4000; }
    you[1].xpGained = 400; S.over = true; S.result = 'won'; showOver('won'); });
  const SF = () => p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
  for (let i = 0; i < 100 && !(SF() && await SF().evaluate(() => window.BohemiaAftermath && BohemiaAftermath.state().on).catch(() => false)); i++) await p.waitForTimeout(200);
  await p.waitForTimeout(1500);
  const sf = SF();
  await p.screenshot({ path: path.join(OUT, 'end_screen.png') });
  const at = await sf.evaluate(() => { const b = document.querySelector('button.perk'); b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
  const fb = await (await sf.frameElement()).boundingBox(); await p.touchscreen.tap(fb.x + at[0], fb.y + at[1]);
  let rf = null; for (let i = 0; i < 80 && !rf; i++) { rf = p.frames().find(x => /ROSTER_SCREEN/.test(x.url())); if (!(rf && await rf.evaluate(() => { const R = window.BohemiaRosterScreen; return !!R && !!R.camp.t.drawn; }).catch(() => false))) { rf = null; await p.waitForTimeout(250); } }
  await p.waitForTimeout(600);
  /* the browser's own screen recording (every frame it paints, at the phone's points, timestamped), so the card plays at the game's speed */
  const FR = path.join(OUT, 'film'); fs.mkdirSync(FR, { recursive: true }); for (const x of fs.readdirSync(FR)) fs.unlinkSync(path.join(FR, x));
  const cdp = await p.context().newCDPSession(p), times = []; let n = 0, tap = null;
  cdp.on('Page.screencastFrame', async (e) => { try { fs.writeFileSync(path.join(FR, String(n).padStart(4, '0') + '.jpg'), Buffer.from(e.data, 'base64')); times.push(Math.round(e.metadata.timestamp * 1000)); n++;
    await cdp.send('Page.screencastFrameAck', { sessionId: e.sessionId }); } catch (_e) {} });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 390, maxHeight: 844, everyNthFrame: 1 });
  await p.waitForTimeout(6000);
  const fo = await (await rf.frameElement()).boundingBox();
  const cell = await rf.evaluate(() => { const R = window.BohemiaRosterScreen, i = R.state.crew.findIndex(m => m.main); const c = document.querySelector('.cell[data-man="' + i + '"]'); const r = c.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
  tap = Date.now(); await p.touchscreen.tap(fo.x + cell[0], fo.y + cell[1]); const tapAt = n;
  await p.waitForTimeout(4500);
  await cdp.send('Page.stopScreencast');
  const st = await rf.evaluate(() => { const a = BohemiaAftermath.state(); return { glide: a.glide, men: a.men.map(m => m.name + ':' + m.drawn) }; });
  fs.writeFileSync(path.join(OUT, 'now.json'), JSON.stringify({ times, tapAt, glide: st.glide }) + '\n');   /* when each picture was taken (ms): the card plays them at the game's own speed */
  console.log('CREWFIGHT ' + JSON.stringify({ frames: n, tapAt, glide: st.glide, men: st.men, errs }));
  await d.close(); process.exit(0);
})().catch(e => { console.log('CREWFIGHT ' + JSON.stringify({ err: String(e && e.stack || e) })); process.exit(1); });
