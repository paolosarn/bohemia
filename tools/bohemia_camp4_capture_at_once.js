/* THE CAMP COMES UP AT ONCE -- the VOTE card's strip (CAMP FOUR, 11/26/26, VAMILY rule 480 on rule 472(e)). The demo on a phone upright,
   the CPU slowed four times (a phone's speed): a fight won, MAKE CAMP tapped, the glass recorded by the browser's own screen recording
   (each frame with its time); the frames one second apart from the real tap (the loot screen's MAKE CAMP message reaching the shell) are
   kept, each with its second. Run it on main's files and on this build's (R = the repo root) and lay the two rows with
   tools/bohemia_camp4_lay_the_strip.py.
     R=/path/to/repo node tools/bohemia_camp4_capture_at_once.js OUTDIR [--secs 9] */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = process.env.R || path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const K = require(path.join(ROOT, 'tools/bohemia_camp_is_the_board.js'));
const OUT = process.argv[2]; if (!OUT) { console.error('usage: OUTDIR'); process.exit(2); }
const SECS = (() => { const i = process.argv.indexOf('--secs'); return i > 0 ? +process.argv[i + 1] : 9; })();
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const d = await D.open({ profile: 'phone_portrait', door: 400000, engage: true, throttle: 4, gpu: true });
  const p = d.page, fr = d.fr; await p.waitForTimeout(5000);
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} try { contactClear(); } catch (e) {} try { HUNT = null; } catch (e) {} try { travelStop(); } catch (e) {} });
  await p.evaluate(() => { window.addEventListener('message', (e) => { const m = e.data; if (m && m.type === 'BOHEMIA_SPOILS' && m.act === 'leave' && window.__TAPT == null) window.__TAPT = e.timeStamp + performance.timeOrigin; }, true); });
  /* the screen recording: every frame the glass shows, its time (seconds since 1970) */
  const cdp = await p.context().newCDPSession(p), frames = [];
  cdp.on('Page.screencastFrame', (f) => { frames.push({ at: f.metadata.timestamp * 1000, data: f.data }); cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {}); if (frames.length > 900) frames.shift(); });
  await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 });
  const r = await K.oneFight(d, { fam: '^suburb$', end: 'won', watch: false, lootMs: 2500, autoMs: 30000 });
  await p.waitForTimeout(SECS * 1000);
  await cdp.send('Page.stopScreencast').catch(() => {});
  const tap = await p.evaluate(() => window.__TAPT), index = [];
  for (let k = 0; k <= SECS && tap != null; k++) {
    const want = tap + k * 1000, before = frames.filter(f => f.at <= want + 50);   /* what the glass showed at that moment: the last frame drawn by then */
    const q = before.length ? before[before.length - 1] : null; if (!q) continue;
    const f = path.join(OUT, 'at_' + String(k).padStart(2, '0') + '.png'); fs.writeFileSync(f, Buffer.from(q.data, 'base64')); index.push({ k, file: f, lag: Math.round(want - q.at) });
  }
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ root: ROOT, err: r.err || null, frames: frames.length, index }, null, 1));
  console.log('kept ' + index.length + ' of ' + (SECS + 1) + ' seconds from ' + frames.length + ' recorded frames' + (r.err ? ', ' + r.err : ''));
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
