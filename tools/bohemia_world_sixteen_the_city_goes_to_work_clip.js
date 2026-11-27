#!/usr/bin/env node
/* THE CITY GOES TO WORK, FILMED (WORLD 16, 11/27/26; VAMILY rule 485(b), Paolo 11/26: 'cyberpunk vibes but their world has a running
   economy vibes'; record records/BOHEMIA_WORLD_SIXTEEN_THE_CITY_GOES_TO_WORK_11_27_26.md).
   The demo on a phone upright, the dark lifted (the fog off, so the street reads), his crew standing on a crowd's street, and the map's
   clock run the way travel runs it (its minutes, the parties stepped by partiesAdvance as a journey steps them), filmed off the
   compositor (CDP screencast) with each frame's own time, so the clip plays at the speed the glass showed it:
     MORNING   06:05 to 08:40 by their door: two of the crowd step out and walk the street toward the nearest town; one stays home
     EVENING   17:40 to 21:10 at their door: they come home in the dusk; after the stalls shut the gang's collector walks to the door,
               stands a while, goes
     CARAVAN   a caravan out on the road, pulling its wagon full; one coming home with it empty (40 minutes each, slower)
   Each part is cut to a window round where it happens (300 x 440 of the phone's own pixels) and drawn twice the size: the screencast is
   the phone at its CSS size, where a man on the map is about 30 px tall.
   node tools/bohemia_world_sixteen_the_city_goes_to_work_clip.js <outdir> [--rate 20]   (rate: the clock's minutes a real second)
   Writes <outdir>/frames/*.jpg, <outdir>/frames.json, <outdir>/the_city_goes_to_work.mp4 and <outdir>/sheet.jpg (a frame of each part). */
'use strict';
const path = require('path'), fs = require('fs');
const { execFileSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const args = process.argv.slice(2);
const OUT = args[0] && !/^--/.test(args[0]) ? path.resolve(args[0]) : path.join(require('os').tmpdir(), 'goes_to_work_' + process.pid);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : args[i + 1]; };
const RATE = +opt('rate', 20), Z = +opt('zoom', 3);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  fs.mkdirSync(path.join(OUT, 'frames'), { recursive: true });
  for (const f of fs.readdirSync(path.join(OUT, 'frames'))) fs.unlinkSync(path.join(OUT, 'frames', f));
  const d = await D.open({ keepCards: true, profile: 'phone_portrait', fog: false });
  const fr = d.fr, errs = [];
  d.page.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  for (let i = 0; i < 160; i++) { if (await fr.evaluate(() => !!(window.om && om.n && window.VBC && typeof travelTo === 'function')).catch(() => false)) break; await sleep(400); }
  for (let i = 0; i < 20; i++) { const t = await fr.evaluate(() => !!(window.LOOP && LOOP.frame && LOOP.frame.style.display === 'block')).catch(() => false); if (!t && i > 6) break; if (t) await fr.evaluate(() => loopClose()).catch(() => {}); await sleep(500); }
  await fr.evaluate(() => render());
  for (let i = 0; i < 60; i++) { if (await fr.evaluate(() => !!MAP_WORK.plan)) break; await sleep(250); }
  /* the crowd: one that walks to work and whose ground has a collector, the longest such walk on the glass */
  const H = await fr.evaluate(() => { const P = MAP_WORK.plan; const L = P.homes.filter(h => h.work && h.round && h.work.length >= 6).sort((a, b) => b.work.length - a.work.length);
    const h = L[0] || P.homes.find(x => x.work); return h ? { px: h.px, py: h.py, cx: h.cx, cy: h.cy, work: h.work.map(c => [c[0], c[1]]), round: h.round ? h.round.map(c => [c[0], c[1]]) : null, holder: h.holder } : null; });
  if (!H) { console.log('no crowd walks to work on this valley'); await d.close(); return; }
  console.log('the crowd at block ' + H.cx + ',' + H.cy + ', a walk of ' + (H.work.length - 1) + ' blocks; its ground ' + H.holder + (H.round ? ', a collector walk of ' + (H.round.length - 2) : ''));

  const frames = []; let part = 'setup', seq = 0, t0 = null, film = false;
  d.cdp.on('Page.screencastFrame', async (f) => {
    try { await d.cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {}
    if (!film) return;
    const ts = f.metadata && f.metadata.timestamp; if (t0 == null) t0 = ts;
    const name = 'f' + String(seq++).padStart(5, '0') + '.jpg';
    fs.writeFileSync(path.join(OUT, 'frames', name), Buffer.from(f.data, 'base64'));
    frames.push({ name, t: Math.round((ts - t0) * 1000), part });
  });
  await d.cdp.send('Page.startScreencast', { format: 'jpeg', quality: 78, everyNthFrame: 1 });

  /* stand his crew at (x, y), the camera on him at zoom z, the clock at `from`, and run it to `to` at `rate` minutes a real second; the
     window the card shows is cut around block `focus` (CW x CH of the phone's own pixels, drawn twice the size: the screencast is the
     phone at its CSS size, where a man is about 30 px tall) */
  const CW = 300, CH = 440, crops = {};
  const run = async (name, x, y, z, from, to, focus, rate) => {
    await fr.evaluate(([x, y, z, from]) => {
      try { travelStop(); } catch (e) {}
      city.x = x; city.y = y; CITY_GLIDE.tx = null; for (const k in PARTY_GLIDE) delete PARTY_GLIDE[k];
      DAY.min = from; T.min = from;
      setZoomAt(z); try { camHold(); } catch (e) {} render();
    }, [x, y, z, from]);
    await sleep(2500);
    /* where the block is on the glass once the camera has settled */
    const o = await fr.evaluate(([fx, fy]) => { render(); const O = window.__MAP_OXY, q = iso(fx, fy, O.ox, O.oy); return { sx: q.sx, sy: q.sy + TH / 2, W: innerWidth, H: innerHeight }; }, focus);
    crops[name] = { x: Math.max(0, Math.min(o.W - CW, Math.round(o.sx - CW / 2))) & ~1, y: Math.max(64, Math.min(o.H - CH, Math.round(o.sy - CH * 0.6))) & ~1, at: [Math.round(o.sx), Math.round(o.sy)] };
    part = name; film = true;
    await fr.evaluate(([from, to, rate]) => new Promise((res) => {
      let last = performance.now(), m = from;
      const step = (t) => { const dm = Math.min(4, (t - last) / 1000 * rate); last = t; m = Math.min(to, m + dm);
        DAY.min = m; T.min = m; try { partiesAdvance(dm); } catch (e) {} try { render(); } catch (e) {}
        if (m < to) requestAnimationFrame(step); else setTimeout(res, 700); };
      requestAnimationFrame(step);
    }), [from, to, rate || RATE]);
    film = false;
  };
  const w = (i) => H.work[Math.min(H.work.length - 1, i)];
  const door = H.round ? H.round[1] : w(1);
  /* his crew stands five blocks up the glass from their door, out of the way of the street they walk */
  await run('MORNING', H.cx - 5, H.cy - 5, Z, 6 * 60 + 5, 8 * 60 + 40, w(1));
  await run('EVENING', door[0] - 5, door[1] - 5, Z, 17 * 60 + 40, 21 * 60 + 10, door);
  /* caravans on the road: one out (its wagon full), one coming home (empty), each well away from both its towns */
  const cv = await fr.evaluate(() => { const pick = {}; for (let k = 0; k < 24 && !(pick.out && pick.back); k++) { try { partiesAdvance(60); } catch (e) {}
      (partiesAll() || []).forEach(q => { const leg = BohemiaParties.legOf(q); if (q.agenda === 'caravan' && !pick[leg] && Math.max(Math.abs(q.at.x - q.from.x), Math.abs(q.at.y - q.from.y)) >= 4 && Math.max(Math.abs(q.at.x - q.to.x), Math.abs(q.at.y - q.to.y)) >= 4) {
        const t = leg === 'back' ? q.from : q.to; pick[leg] = [q.id, q.at.x, q.at.y, leg, q.at.x + Math.sign(t.x - q.at.x) * 2, q.at.y + Math.sign(t.y - q.at.y) * 2]; } }); }
    return [pick.out, pick.back].filter(Boolean); });
  console.log('caravans on the road: ' + JSON.stringify(cv));
  for (const c of cv) await run('CARAVAN ' + (c[3] === 'out' ? 'FULL' : 'EMPTY'), c[1] - 4, c[2] - 4, Z, 11 * 60, 11 * 60 + 40, [Math.round((c[1] + c[4]) / 2), Math.round((c[2] + c[5]) / 2)], 10);   /* he stands up the glass from it */
  await d.cdp.send('Page.stopScreencast').catch(() => {});

  fs.writeFileSync(path.join(OUT, 'frames.json'), JSON.stringify({ H: { cx: H.cx, cy: H.cy, holder: H.holder, walk: H.work.length - 1 }, caravans: cv, rate: RATE, crops, errs, frames }, null, 1));
  /* each part at the real speed (each frame held until the next one came), cut to its window and drawn twice the size, then joined */
  const parts = [...new Set(frames.map(f => f.part))], made = [];
  parts.forEach((p, pi) => {
    const L = frames.filter(f => f.part === p), list = [];
    for (let i = 0; i < L.length; i++) { const dur = i + 1 < L.length ? (L[i + 1].t - L[i].t) / 1000 : 0.6; list.push("file 'frames/" + L[i].name + "'"); list.push('duration ' + Math.max(0.001, Math.min(1, dur)).toFixed(3)); }
    list.push("file 'frames/" + L[L.length - 1].name + "'");
    const cl = path.join(OUT, 'part' + pi + '.txt'), mp = path.join(OUT, 'part' + pi + '.mp4'); fs.writeFileSync(cl, list.join('\n') + '\n');
    const c = crops[p];
    try {
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', cl, '-vsync', 'cfr', '-r', '30',
        '-vf', 'crop=' + CW + ':' + CH + ':' + c.x + ':' + c.y + ',scale=' + (CW * 2) + ':' + (CH * 2) + ':flags=neighbor', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '30', mp], { cwd: OUT });
      made.push(mp);
    } catch (e) { console.log('ffmpeg failed on ' + p + ': ' + String(e).slice(0, 200)); }
  });
  try {
    fs.writeFileSync(path.join(OUT, 'parts.txt'), made.map(m => "file '" + m + "'").join('\n') + '\n');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(OUT, 'parts.txt'), '-c', 'copy', '-movflags', '+faststart', path.join(OUT, 'the_city_goes_to_work.mp4')], { cwd: OUT });
    console.log('clip: ' + path.join(OUT, 'the_city_goes_to_work.mp4') + ' (' + frames.length + ' frames; ' + parts.join(', ') + ')');
  } catch (e) { console.log('ffmpeg join failed: ' + String(e).slice(0, 200)); }
  /* the sheet: each part's window at a moment in its middle, drawn twice the size */
  try {
    const pick = parts.map(p => { const L = frames.filter(f => f.part === p); return L[Math.floor(L.length * 0.5)]; });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error'].concat(...pick.map(f => ['-i', path.join(OUT, 'frames', f.name)]),
      ['-filter_complex', pick.map((f, i) => '[' + i + ':v]crop=' + CW + ':' + CH + ':' + crops[f.part].x + ':' + crops[f.part].y + ',scale=' + (CW * 2) + ':' + (CH * 2) + ':flags=neighbor[v' + i + ']').join(';') + ';' + pick.map((_, i) => '[v' + i + ']').join('') + 'hstack=inputs=' + pick.length, path.join(OUT, 'sheet.jpg')]));
    console.log('sheet: ' + path.join(OUT, 'sheet.jpg'));
  } catch (e) { console.log('sheet failed: ' + String(e).slice(0, 200)); }
  console.log('page errors: ' + errs.length + (errs.length ? ' ' + errs[0] : ''));
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
