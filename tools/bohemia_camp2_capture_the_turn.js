/* CAMP TWO: THE TURN, CAPTURED FOR THE VOTE TAB (rule 289: 'all camps ... have to look good when you flip them from portrait to
   landscape'). Boots the demo upright, opens his camp on the phone's HEAL like a player, then turns the glass on its side and back,
   screenshotting the real screen all the way. The glide is slowed (window.__CAMP2_GLIDE_MS) only so a headless browser's few
   frames a second can see it move; the card says so. Frames land in <out>/turn_NN.png with turn.json (each frame's size and time).
   node tools/bohemia_camp2_capture_the_turn.js <out_dir> [glide_ms] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const { leaveTown } = require(path.join(ROOT, 'tools/bohemia_leave_the_town.js'));
const OUT = process.argv[2], SLOW = +(process.argv[3] || 2500);
if (!OUT) { console.error('usage: node tools/bohemia_camp2_capture_the_turn.js <out_dir> [glide_ms]'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const d = await drive.open({ keepCards: true, profile: 'phone_portrait', beforeTap: async (p) => { await throughTheTitle(p); } });
  const p = d.page, log = [];
  const t0 = Date.now();
  let n = 0;
  const shot = async (label) => { const f = 'turn_' + String(n++).padStart(2, '0') + '.png'; await p.screenshot({ path: path.join(OUT, f) }); const v = p.viewportSize(); log.push({ f, w: v.width, h: v.height, ms: Date.now() - t0, label }); };
  try {
    await p.waitForTimeout(3000);
    const HEAL = '#bohphone .app[data-app=heal]';
    await p.waitForFunction((s) => { const b = document.querySelector(s); return !!b && b.getBoundingClientRect().width > 0 && document.getElementById('bohphone').classList.contains('on'); }, HEAL, { timeout: 20000 }).catch(() => {});
    /* a hurt man and a broken one, so the camp shows its acts (the condition's own door, as the gate does); the hunters kept off */
    await d.fr.evaluate(() => { const L = BohemiaCondition.members(LOOP.start && LOOP.start.company);
      BohemiaCondition.afterFight(L.map((e, i) => ({ name: e.main ? 'YOU' : e.man.name, main: e.main, hp: i === 1 ? 6 : 60, hpMax: i === 1 ? 300 : 60, armH: i === 2 ? 40 : 100, armHMax: i === 2 ? 400 : 100, armB: i === 2 ? 50 : 120, armBMax: i === 2 ? 500 : 120 })), { day: 1 }); });
    await d.fr.evaluate(() => { window.__GATE_KEEP_OFF = setInterval(function () { try { if (HUNT && !HUNT.__gate) HUNT = null; } catch (e) {} }, 100); });
    /* a stranger's new game opens in the closest town (rule 236); HEAL makes camp only on the map, so LEAVE first, as he would
       (the one LEAVE on screen, the phone's when it is up: tools/bohemia_leave_the_town.js) */
    const inTown = await d.fr.evaluate(() => { try { return !!(LOOP.frame && LOOP.frame.style.display !== 'none' && LOOP.open && !LOOP.open.camp); } catch (e) { return false; } }).catch(() => false);
    if (inTown) { const sf0 = p.frames().find(x => /SETTLEMENT_SCREEN/.test(x.url())); await leaveTown(p, sf0, { ms: 5000 }); await p.waitForTimeout(2500); }
    const h = await p.$(HEAL), r = await h.boundingBox();
    await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2);
    let sf = null;
    for (let k = 0; k < 80 && !sf; k++) { await p.waitForTimeout(250);
      for (const x of p.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return !!window.BohemiaCampLook && BohemiaCampLook.state().open; } catch (e) { return false; } }).catch(() => false)) sf = x; }
    if (!sf) throw new Error('no camp screen');
    const sb = await (await sf.frameElement()).boundingBox();
    const peekNow = async (w) => console.log(w, JSON.stringify(await p.evaluate(() => { try { const C = document.getElementById('cityFrame'); return { peek: C.contentWindow.BohemiaCampMap.peeking(), phone: document.getElementById('bohphone').className }; } catch (e) { return String(e); } })));
    await peekNow('opened');
    await p.touchscreen.tap(sb.x + sb.width / 2, sb.y + sb.height * 0.30);   /* skip the pitch (a tap on the sand above the camp) */
    await p.waitForTimeout(1500);
    await peekNow('skipped');
    await sf.evaluate((ms) => { window.__CAMP2_GLIDE_MS = ms; }, SLOW);
    await shot('upright');
    const vp = p.viewportSize();
    for (const to of [{ width: vp.height, height: vp.width }, vp]) {
      await p.setViewportSize(to);
      const until = Date.now() + SLOW + 1200;
      while (Date.now() < until) await shot(to.width > to.height ? 'turning on its side' : 'turning upright');
      await shot(to.width > to.height ? 'on its side' : 'upright');
    }
    await sf.evaluate(() => { window.__CAMP2_GLIDE_MS = 0; });
  } catch (e) { console.error(String(e.stack || e)); }
  fs.writeFileSync(path.join(OUT, 'turn.json'), JSON.stringify({ slow: SLOW, frames: log }, null, 1));
  console.log('frames ' + log.length + ' in ' + OUT);
  try { await d.close(); } catch (e) {}
})();
