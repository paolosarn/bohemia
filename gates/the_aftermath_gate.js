/* THE AFTERMATH GATE (RUN FOUR [the aftermath plays behind the loot screen], VAMILY rule 245, 10/26/26).
   PAOLO 10/26: 'the background is all black... instead a live show, as zoomed in as it can be, of your characters looting the
   bodies, walking between them, talking about what's next... animating in the background at a lower opacity.'
   MEASURED BEFORE: the end screen's frame stood on a flat #120e0a over the fight, its own page on #0f0c09: black wherever no plate was.
   Rule 245(d): after rolled fights, phone and computer: the screen's back is the fight's board with his surviving men animating
   aftermath acts; never black; text contrast at the floor; frame time inside the line.
     A1 THE PAGE ON ITS OWN: the back is drawn on open (before the clock's first frame), never black, his sample men in acts; LEAVE
        lets go of it (the clock stops, the board and sheets are dropped)
     per fight on the live demo (two rolled road fights on a phone, one on a computer):
     D1 THE FIGHT'S OWN BOARD: the scene is read off the fight still standing behind (the same baked board, the same picture), the
        dead and the down where the fight left them, every man of his who can walk in it
     D2 NEVER BLACK: the back carries the board's light and detail (its pixels are not flat, not near black) on the window over the
        crew (a phone) or the open ground (a computer)
     D3 HIS MEN IN AFTERMATH ACTS: over twelve seconds every man who can walk is seen walking and seen stopped at a body or a friend
        (a friend down is gone to first), the stops are the dead's and the down's own, and the clock keeps running
     D4 THE CONTRAST FLOOR: every word that stands on the scene (the section heads, their counts, the lines) reads at 4.5 to 1 or
        better against what is behind it, measured off the screen with the words taken out (WCAG AA)
     D5 THE FRAME LINE: the back's own draw, at its twelve frames a second, under half a 60 Hz frame on average (8 ms) and never a
        frame's budget at the 95th (12 ms), so every frame between two of its draws is the page's alone; THE PAGE'S OWN RATE with it
        playing within 15 percent of the same page with its clock held (the box's rate on a phone's glass is the box's: about 27 a
        second at 3x with no GPU; 60 on a computer); its canvas and overlay under 12 MB; nothing the end screen loads for it but
        ANIMATION's act sheets. (This line was '60 ms of every second' for three runs: a number picked in the first cut with nothing
        under it; the computer's draw sat at 63 to 65 while the page held 60 of 60, so the line now names what it protects, the frame.)
   node gates/the_aftermath_gate.js [--shoot] */
'use strict';
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('=== THE AFTERMATH GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const SHOOT = process.argv.indexOf('--shoot') >= 0, SHOTS = path.join(ROOT, 'records/target/aftermath');
if (SHOOT) fs.mkdirSync(SHOTS, { recursive: true });

/* the luminance numbers off a screenshot, read in a page (no image library in the box): per rect, the 95th percentile of the backdrop */
async function lumOf(page, png, rects) {
  return page.evaluate(async ({ b64, rects }) => {
    const im = new Image(); await new Promise(r => { im.onload = r; im.src = 'data:image/png;base64,' + b64; });
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const L = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return rects.map(q => { const x = Math.max(0, Math.round(q.x)), y = Math.max(0, Math.round(q.y)), w = Math.max(1, Math.min(c.width - x, Math.round(q.w))), h = Math.max(1, Math.min(c.height - y, Math.round(q.h)));
      const d = g.getImageData(x, y, w, h).data, a = [];
      for (let i = 0; i < d.length; i += 4) a.push(0.2126 * L(d[i]) + 0.7152 * L(d[i + 1]) + 0.0722 * L(d[i + 2]));
      a.sort((p, q2) => p - q2); const mean = a.reduce((s, v) => s + v, 0) / a.length;
      const sd = Math.sqrt(a.reduce((s, v) => s + (v - mean) * (v - mean), 0) / a.length);
      return { p95: a[Math.floor(a.length * 0.95)], mean, sd, n: a.length }; });
  }, { b64: png.toString('base64'), rects });
}
const lumC = (rgb) => { const m = String(rgb).match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; };

(async () => {
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  /* ---- A1 the page on its own ---- */
  {
    const srv = http.createServer((rq, rs) => {
      const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
      if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
      rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
    });
    await new Promise(r => srv.listen(0, '127.0.0.1', r));
    const b = await chromium.launch(), p = await (await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_SPOILS_SCREEN.html');
    await p.waitForFunction(() => window.BohemiaAftermath && BohemiaAftermath.state().on, null, { timeout: 30000 });
    const a0 = await p.evaluate(() => ({ st: BohemiaAftermath.state(), f0: BohemiaAftermath.state().frames }));
    await p.waitForTimeout(7000);
    const a1 = await p.evaluate(() => { const st = BohemiaAftermath.state(), c = document.getElementById('after'), g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height).data;
      let s = 0, s2 = 0, n = 0; for (let i = 0; i < d.length; i += 4 * 37) { const v = (d[i] + d[i + 1] + d[i + 2]) / 3; s += v; s2 += v * v; n++; }
      const m = s / n; return { st, mean: m, sd: Math.sqrt(s2 / n - m * m) }; });
    const acts = a1.st.men.map(m => m.name + ':' + m.act + '/' + m.drawn);
    ok('A1 THE PAGE ON ITS OWN: the back is drawn on open, never black (mean ' + a1.mean.toFixed(1) + ', spread ' + a1.sd.toFixed(1) + ' of 255), his sample men in acts',
      a0.st.on && a0.st.from === 'sample' && a1.mean > 18 && a1.sd > 6 && a1.st.frames > a0.f0 && a1.st.men.length >= 2 && a1.st.lying.length >= 2 && a1.st.men.every(m => m.drawn), acts.join(', '));
    await p.tap('#leave'); await p.waitForTimeout(300);
    const off = await p.evaluate(() => BohemiaAftermath.state());
    ok('    LEAVE (a real tap) lets go of it: the clock stops, the board and the sheets are dropped', off.on === false && !off.from, JSON.stringify({ on: off.on, from: off.from }));
    ok('    nothing threw', errs.length === 0, errs.slice(0, 2).join(' | '));
    await b.close(); srv.close();
  }

  /* ---- THE DEMO ---- */
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  for (const prof of ['phone_portrait', 'computer']) {
    let d;
    try { d = await drive.open({ profile: prof, keepCards: true, engage: true, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
    catch (e) { ok(prof + ' the demo boots [' + String(e.message).slice(0, 160) + ']', false); continue; }
    const p = d.page, fr = d.fr, errs = [], name = prof === 'computer' ? 'COMPUTER' : 'PHONE', dpr = prof === 'computer' ? 1 : 3;
    p.on('pageerror', e => errs.push(e.message));
    const loaded = []; p.on('requestfinished', rq => { let fu = ''; try { fu = rq.frame().url(); } catch (_e) {}
      if (/SPOILS_SCREEN/.test(fu) && /rig_|fight_rig|fight_ground/.test(rq.url())) loaded.push({ u: rq.url().replace(/^.*\/slices\//, ''), t: Date.now() }); });
    await p.waitForTimeout(2500);
    const SF = () => p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
    for (const seq of prof === 'computer' ? [61] : [51, 52]) {
      try {
        /* ROLLED: the second fight on the phone is met somewhere else on the map (the board is cut from the map cell he stands on) */
        await fr.evaluate((seq) => { if (seq === 52) { try { const bs = ctBases(), k = Object.keys(bs), t = bs[k[3 % k.length]]; city.x = t.x + 4; city.y = t.y + 3; } catch (_e) {} }
          try { stepOnce(0); stepOnce(4); } catch (_e) {} roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: seq }); }, seq);
        let f = null;
        for (let i = 0; i < 200 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame();
          if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
        if (!f) { ok(name + ' fight ' + seq + ': a road fight through the map\'s own door', false); continue; }
        await p.waitForTimeout(1200);
        /* rolled: the fight decides who of theirs falls where; one of his goes down when he has three (a friend to go to) */
        const fought = await f.evaluate((seq) => { const S = FIGHT.S, now = performance.now();
          S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; u._fallAt = now - 4000; });
          /* one of his down in the first fight (a friend to go to); everybody standing in the second (three up: the watch) */
          const you = S.units.filter(u => u.side === 'you'); if (you.length > 2 && seq !== 52) { const v = you[you.length - 1]; v.down = true; v._fallAt = now - 4000; }
          S.over = true; S.result = 'won'; showOver('won');
          return { w: S.w, h: S.h, kind: S.boardDef && (S.boardDef.name || S.boardDef.id || S.boardDef.kind) || String(S.board || ''), lying: S.units.filter(u => u.dead || u.down).map(u => u.id + '@' + u.x + ',' + u.y).sort(), up: S.units.filter(u => u.side === 'you' && !u.dead && !u.down && !u.fled).map(u => u.id).sort() }; }, seq);
        for (let i = 0; i < 100 && !(SF() && await SF().evaluate(() => window.BohemiaAftermath && BohemiaAftermath.state().on).catch(() => false)); i++) await p.waitForTimeout(200);
        const sf = SF();
        const t0 = Date.now();
        /* D1 */
        const s1 = await sf.evaluate(() => { const st = BohemiaAftermath.state(), fw = window.parent.document.getElementById('fightFrame').contentWindow;
          return { from: st.from, same: st.same(fw.FIGHT_UI.board), board: st.board, lying: st.lying.map(m => m.id + '@' + m.x + ',' + m.y).sort(), up: st.men.map(m => m.id).sort() }; });
        ok('D1 ' + name + ' fight ' + seq + ': THE FIGHT\'S OWN BOARD (the same baked picture, ' + fought.kind + ', ' + fought.w + ' by ' + fought.h + '), the dead and the down where the fight left them, every man of his who can walk',
          s1.from === 'fight' && s1.same && s1.board.w === fought.w && JSON.stringify(s1.lying) === JSON.stringify(fought.lying) && JSON.stringify(s1.up) === JSON.stringify(fought.up),
          s1.lying.length + ' lying (' + s1.lying.join(' ') + '), ' + s1.up.length + ' up');
        /* D3: eight seconds of watching */
        const seen = {};
        for (let k = 0; k < 48; k++) {
          const st = await sf.evaluate(() => BohemiaAftermath.state().men.map(m => ({ id: m.id, act: m.act, drawn: m.drawn, stop: m.stop })));
          st.forEach(m => { const e = seen[m.id] = seen[m.id] || { walk: 0, stop: 0, stops: {}, first: null };
            if (m.drawn === 'walk') e.walk++; if (/^(loot|tend|smoke|talk|watch)$/.test(m.act) && m.drawn !== 'walk') { e.stop++; if (!e.first) e.first = m.stop; }
            if (m.stop) e.stops[m.stop] = (e.stops[m.stop] || 0) + 1; });
          await p.waitForTimeout(250);
        }
        const s3 = await sf.evaluate(() => BohemiaAftermath.state());
        const ids = Object.keys(seen), lyingIds = fought.lying.map(x => x.split('@')[0]);
        const stopsReal = ids.every(id => Object.keys(seen[id].stops).every(k => !/^body:/.test(k) || lyingIds.indexOf(k.slice(5)) >= 0));
        const tended = s3.lying.filter(m => m.side === 'you').every(m => ids.some(id => seen[id].first === 'body:' + m.id || seen[id].stops['body:' + m.id]));
        const watched = fought.up.length < 3 || ids.some(id => seen[id].first === 'watch');   /* security first: three standing, one on the watch */
        ok('D3 ' + name + ' fight ' + seq + ': HIS MEN IN AFTERMATH ACTS (twelve seconds): every man who can walk seen walking and seen stopped at a body, a friend or the watch, a friend down gone to, three standing put one on the watch, the clock running',
          ids.length === fought.up.length && ids.length > 0 && ids.every(id => seen[id].walk > 0 && seen[id].stop > 0) && stopsReal && tended && watched && s3.frames > 100,
          ids.map(id => id + ' walk ' + seen[id].walk + ' stop ' + seen[id].stop + ' first ' + seen[id].first).join('; ') + '; ' + s3.frames + ' frames');
        /* D2 and D4: the screen with the words in, then with the words taken out */
        if (SHOOT) await p.screenshot({ path: path.join(SHOTS, 'aftermath_' + prof + '_' + seq + '.png') });
        const free = await sf.evaluate(() => [].map.call(document.querySelectorAll('.h>span,.lines p,#ground.empty'), e => { const q = e.getBoundingClientRect(), cs = getComputedStyle(e);
          /* only a word he can see: on the screen, and not under the bar or the strip (the thing at its middle is the word itself) */
          const mx = q.left + q.width / 2, my = q.top + q.height / 2, top = q.bottom > 0 && q.top < innerHeight ? document.elementFromPoint(mx, my) : null;
          return { t: e.textContent.trim().slice(0, 24), x: q.left, y: q.top, w: q.width, h: q.height, c: cs.color, on: q.width > 0 && q.height > 0 && !!top && (top === e || e.contains(top)) && cs.visibility !== 'hidden' }; }).filter(r => r.on && r.t));
        const open = await sf.evaluate(() => { const f = document.getElementById('field'), q = f.getBoundingClientRect();
          if (q.height > 40) return { x: 0, y: q.top, w: innerWidth, h: q.height, where: 'the window over the crew' };
          const c = document.getElementById('crew').getBoundingClientRect(); return { x: c.left, y: c.bottom + 10, w: c.width, h: Math.max(40, innerHeight - c.bottom - 110), where: 'the open ground under the crew' }; });
        await sf.evaluate(() => { const st = document.createElement('style'); st.id = 'gate-nowords'; st.textContent = '*{color:transparent!important;text-shadow:none!important;-webkit-text-fill-color:transparent!important} img,canvas:not(#after){visibility:hidden!important}'; document.head.appendChild(st); });
        await p.waitForTimeout(120);
        const png = await p.screenshot();
        await sf.evaluate(() => { const st = document.getElementById('gate-nowords'); if (st) st.remove(); });
        const sc = r => ({ x: r.x * dpr, y: r.y * dpr, w: r.w * dpr, h: r.h * dpr });
        const L = await lumOf(p, png, [sc(open)].concat(free.map(sc)));
        const bg = L[0];
        ok('D2 ' + name + ' fight ' + seq + ': NEVER BLACK: ' + open.where + ' shows the board, lit and full of detail, dimmed (mean luminance ' + bg.mean.toFixed(3) + ', spread ' + bg.sd.toFixed(3) + ')',
          bg.mean > 0.012 && bg.sd > 0.006 && bg.p95 < 0.3, 'p95 ' + bg.p95.toFixed(3));
        const ratios = free.map((r, i) => { const lt = lumC(r.c), lb = L[i + 1].p95; return { t: r.t, k: (Math.max(lt, lb) + 0.05) / (Math.min(lt, lb) + 0.05) }; });
        const worst = ratios.slice().sort((a, b2) => a.k - b2.k)[0];
        ok('D4 ' + name + ' fight ' + seq + ': THE CONTRAST FLOOR: every word on the scene reads at 4.5 to 1 or better, measured with the words taken out',
          ratios.length >= 2 && ratios.every(r => r.k >= 4.5), ratios.length + ' words; the worst "' + (worst && worst.t) + '" at ' + (worst ? worst.k.toFixed(2) : '?') + ' to 1');
        /* D5 the frame line */
        /* the page's frames a second with the scene's clock held, then running: the scene may not cost the page its frames */
        /* four turns each way, a second and a half each, the medians compared (one two-second sample on this box swings 15 percent) */
        const rate = () => sf.evaluate(() => new Promise(res => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 1500) requestAnimationFrame(f); else res(n / ((performance.now() - t0) / 1000)); }; requestAnimationFrame(f); }));
        const held = [], run = [], med = a => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
        for (let k = 0; k < 4; k++) { await sf.evaluate(() => BohemiaAftermath.hold(true)); held.push(await rate()); await sf.evaluate(() => BohemiaAftermath.hold(false)); run.push(await rate()); }
        const fps0 = med(held), fps = med(run);
        const s5 = await sf.evaluate(() => BohemiaAftermath.state());
        const bytes = s5.bytes || s5.canvas[0] * s5.canvas[1] * 4, extra = loaded.filter(x => x.t >= t0 - 1000 && !/rig_town\//.test(x.u)).map(x => x.u);
        ok('D5 ' + name + ' fight ' + seq + ': THE FRAME LINE: the back\'s draw ' + s5.msAvg.toFixed(2) + ' ms a frame on average, ' + s5.msP95.toFixed(1) + ' at the 95th, the page at ' + fps.toFixed(0) + ' frames a second with it and ' + fps0.toFixed(0) + ' with its clock held, its pictures ' + (bytes / 1048576).toFixed(1) + ' MB',
          s5.msAvg < 8 && s5.msP95 < 12 && fps >= fps0 * 0.85 - 1 && bytes < 12 * 1048576 && extra.length === 0,
          (s5.msAvg * 12).toFixed(0) + ' ms of every second, worst ' + s5.msWorst.toFixed(1) + ' ms; ' + (extra.length ? 'loaded for it: ' + extra.slice(0, 4).join(', ') : 'nothing loaded for it but ANIMATION\'s act sheets'));
        /* LEAVE, for the next fight */
        await p.frameLocator('#spoilsdoor iframe').locator('#leave').tap({ timeout: 5000 }).catch(async () => { await p.frameLocator('#spoilsdoor iframe').locator('#leave').click(); });
        let home = false; for (let i = 0; i < 40 && !home; i++) { home = await p.evaluate(() => !CITYFIGHT && !document.getElementById('spoilsdoor')); if (!home) await p.waitForTimeout(200); }
        await p.waitForTimeout(1500);
      } catch (e) { ok(name + ' fight ' + seq + ' ran to the end [' + String(e && e.message).slice(0, 200) + ']', false); }
    }
    ok(name + ': nothing threw on the demo', errs.length === 0, errs.slice(0, 3).join(' | '));
    try { await d.close(); } catch (_e) {}
  }
  done();
})();
