#!/usr/bin/env node
/* THE CARAVAN DRIVES, FILMED (WORLD 16, 11/27/26; VAMILY rule 494(d), Paolo 11/27: 'I haven't seen one caravan quest... go from one
   city to another'; record records/BOHEMIA_WORLD_SIXTEEN_THE_CARAVAN_DRIVES_11_27_26.md).
   The demo on a phone upright, the dark lifted (the fog off, so the road reads), the board's own escort offer taken in the town he starts
   in (the offer the settlement posts on 'Take it', handed to the map's own loopTakeContract), the travel order to where the cargo goes at
   the 1x pace, the camera on him at the map's near zoom, filmed off the compositor (CDP screencast) with each frame's own time until the
   raiders' card has stood two seconds: the truck rolling behind his party, the raiders coming out onto the road, the card.
   node tools/bohemia_world_sixteen_the_caravan_drives_clip.js <outdir> [--zoom 3.2] [--side]
   Writes <outdir>/frames/*.jpg, <outdir>/frames.json, <outdir>/the_caravan_drives.mp4 (the middle of the glass drawn twice the size)
   and <outdir>/sheet.jpg (four moments). */
'use strict';
const path = require('path'), fs = require('fs');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const args = process.argv.slice(2);
const OUT = args[0] && !/^--/.test(args[0]) ? path.resolve(args[0]) : path.join(require('os').tmpdir(), 'caravan_drives_' + process.pid);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : args[i + 1]; };
const Z = +opt('zoom', 3.2), SIDE = args.includes('--side');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(path.join(OUT, 'frames'), { recursive: true });
  for (const f of fs.readdirSync(path.join(OUT, 'frames'))) fs.unlinkSync(path.join(OUT, 'frames', f));
  const d = await D.open({ keepCards: true, profile: SIDE ? 'phone_landscape' : 'phone_portrait', fog: false });
  const fr = d.fr, errs = [];
  d.page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && window.MAP_CARAVAN && window.BohemiaJobKinds && BohemiaJobKinds.ready && BohemiaJobKinds.ready() && window.BohemiaBoardShelf)).catch(() => false)) break; await sleep(400); }
  for (let i = 0; i < 20; i++) { const t = await fr.evaluate(() => !!(window.LOOP && LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false); if (!t && i > 6) break; if (t) await fr.evaluate(() => loopClose()).catch(() => {}); await sleep(500); }
  await fr.evaluate(() => { mapCaravanSheet(); render(); });
  await sleep(2500);
  const job = await fr.evaluate(() => { const o = BohemiaBoardShelf.shelf().offers.filter(x => BohemiaJobKinds.kindOf(x) === 'haul-caravan')[0]; if (!o) return null;
    loopTakeContract(Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) }));
    const j = LOOP.held.filter(h => h.id === o.id)[0]; return j ? { id: j.id, title: j.title, dest: j.dest.name, target: j.target, cargo: j.cargo, from: j.from } : null; });
  if (!job) { console.log('no escort offer on this board'); await d.close(); return; }
  console.log('took "' + job.title + '" in ' + job.from + ': ' + job.cargo.n + ' ' + job.cargo.unit + 's to ' + job.dest);
  await fr.evaluate(() => { try { loopClose(); } catch (e) {} }).catch(() => {});
  await fr.evaluate((z) => { setZoomAt(z); try { camHold(); } catch (e) {} render(); }, Z);
  await sleep(2000);

  const frames = []; let seq = 0, t0 = null, film = true;
  d.cdp.on('Page.screencastFrame', async (f) => {
    try { await d.cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {}
    if (!film) return;
    const ts = f.metadata && f.metadata.timestamp; if (t0 == null) t0 = ts;
    const name = 'f' + String(seq++).padStart(5, '0') + '.jpg';
    fs.writeFileSync(path.join(OUT, 'frames', name), Buffer.from(f.data, 'base64'));
    frames.push({ name, t: Math.round((ts - t0) * 1000) });
  });
  await d.cdp.send('Page.startScreencast', { format: 'jpeg', quality: 80, everyNthFrame: 1 });
  await sleep(800);
  await fr.evaluate((t) => { try { travelSpeedSet(1); } catch (e) {} travelTo(0, 0, [t.x, t.y]); }, job.target);
  /* the journey's order fits the route on the glass (the game's own camera); the film comes back down to the near zoom on him */
  await sleep(700); await fr.evaluate((z) => { setZoomAt(z); try { camHold(); } catch (e) {} }, Z);
  const marks = [];
  let cardAt = 0;
  for (let i = 0; i < 400; i++) {
    const s = await fr.evaluate((id) => { const j = LOOP.held.filter(h => h.id === id)[0]; return { truck: MAP_DREW.truck || null, raid: !!(j && j.raid), card: !!(window.MEET && MEET.up), travel: !!TRAVEL, fight: LOOP.fighting }; }, job.id);
    marks.push(Object.assign({ wall: Date.now() }, s));
    if (s.card && !cardAt) cardAt = Date.now();
    if (cardAt && Date.now() - cardAt > 2000) break;
    if (!s.travel && !s.card && !s.raid && i > 20) break;
    await sleep(250);
  }
  film = false;
  await d.cdp.send('Page.stopScreencast').catch(() => {});
  const vp = SIDE ? { w: 844, h: 390 } : { w: 390, h: 844 }, CH = SIDE ? 390 : 460, CW = SIDE ? 600 : 390, cx = Math.max(0, Math.round((vp.w - CW) / 2)), cy = SIDE ? 0 : 80;
  const list = [];
  for (let i = 0; i < frames.length; i++) { const dur = i + 1 < frames.length ? (frames[i + 1].t - frames[i].t) / 1000 : 0.8; list.push("file 'frames/" + frames[i].name + "'"); list.push('duration ' + Math.max(0.001, Math.min(1, dur)).toFixed(3)); }
  if (frames.length) list.push("file 'frames/" + frames[frames.length - 1].name + "'");
  fs.writeFileSync(path.join(OUT, 'concat.txt'), list.join('\n') + '\n');
  fs.writeFileSync(path.join(OUT, 'frames.json'), JSON.stringify({ job, zoom: Z, side: SIDE, crop: [cx, cy, CW, CH], raided: marks.some(m => m.raid), card: !!cardAt, faces: [...new Set(marks.map(m => m.truck && m.truck.face).filter(Boolean))], errs, frames }, null, 1));
  try {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(OUT, 'concat.txt'), '-vsync', 'cfr', '-r', '30',
      '-vf', 'crop=' + CW + ':' + CH + ':' + cx + ':' + cy + ',scale=' + (CW * 2) + ':' + (CH * 2) + ':flags=neighbor', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '33', '-movflags', '+faststart', path.join(OUT, 'the_caravan_drives.mp4')], { cwd: OUT });
    console.log('clip: ' + path.join(OUT, 'the_caravan_drives.mp4') + ' (' + frames.length + ' frames, ' + ((frames.length ? frames[frames.length - 1].t : 0) / 1000).toFixed(1) + ' s)');
  } catch (e) { console.log('ffmpeg failed: ' + String(e).slice(0, 200)); }
  try {
    const pick = [0.2, 0.45, 0.7, 0.95].map(k => frames[Math.min(frames.length - 1, Math.floor(frames.length * k))]);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error'].concat(...pick.map(f => ['-i', path.join(OUT, 'frames', f.name)]),
      ['-filter_complex', pick.map((f, i) => '[' + i + ':v]crop=' + CW + ':' + CH + ':' + cx + ':' + cy + '[v' + i + ']').join(';') + ';' + pick.map((_, i) => '[v' + i + ']').join('') + 'hstack=inputs=' + pick.length, path.join(OUT, 'sheet.jpg')]));
    console.log('sheet: ' + path.join(OUT, 'sheet.jpg'));
  } catch (e) { console.log('sheet failed: ' + String(e).slice(0, 200)); }
  console.log('raided ' + marks.some(m => m.raid) + ', the card ' + !!cardAt + ', the truck faced ' + JSON.stringify([...new Set(marks.map(m => m.truck && m.truck.face).filter(Boolean))]) + '; page errors ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
