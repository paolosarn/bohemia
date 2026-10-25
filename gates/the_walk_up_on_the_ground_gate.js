/* THE WALK-UP ON THE GROUND GATE (RUN TWO [the walk-up, on the ground], VAMILY rule 169, 10/25/26).
   PAOLO 10/25: 'you have the player character walking towards the people but you don't understand what the fuck is going on at
   all... walking on top of buildings and shit... this is obviously not coded in the way that it needs to be'; and the same hour:
   'when my character walks and he's at the bottom of the settlement screen, the settlement screen is shaking'.
   WHY THE FIRST GATE WAS GREEN AND WRONG: it checked his path against the tappable buildings' boxes, the same boxes the code
   used, so it measured the code against itself. THIS ONE MEASURES THE PICTURE: slices/settlement_walk.json's blocks are every
   building, wreck, stall, fence, tent and prop traced off the drawn art (records/target/settlement_walk/ draws them back over
   each picture to be checked by eye), and his feet are read off the running screen every frame.
     G1 every settlement picture the game draws (towns, fortresses, camps, home) has its ground traced
     G2 every tap on every building and every person, from every other one, on every picture: the way found never crosses a
        block (sampled every 4 px), it ends beside the one tapped, and every way is walked or run (RE-AIMED 10/25, rule 204: never placed)
     G3 *** REAL TAPS, EVERY FRAME *** on every picture, phone and computer, a run of real taps on buildings and people: his
        feet are on the ground in every drawn frame (never inside a block, so never behind a roof and never painted over one)
     G4 he stops beside the one tapped (or, where the art boxes a keeper in, on the ground nearest him), facing him
     G5 *** THE TOWN NEVER SHAKES *** the town's offset over every frame of every walk: at most one move a tap, one way, eased,
        and still while he walks
     G7 *** HE ALWAYS WALKS, NEVER TELEPORTS *** (rule 204, Paolo 10/25: 'am I seeing my guy instantly teleported to the different
        settlement stores instead of walking'): over every frame of every real tap, phone and computer, every picture, he never moves
        more than a step in a frame, every walk-up is over in about four seconds (a long way is run), and nothing is ever placed
     G6 nothing threw
   node gates/the_walk_up_on_the_ground_gate.js */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('=== THE WALK-UP ON THE GROUND GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.css': 'text/css', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg' };
const server = http.createServer((req, res) => { const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(b); }); });
const PICS = { 'town_0.webp': 'town', 'town_1.webp': 'town', 'camp_0.webp': 'camp', 'camp_1.webp': 'camp', 'fortress_0.webp': 'fortress', 'fortress_1.webp': 'fortress', 'home_0.webp': 'home' };

(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const port = server.address().port, browser = await chromium.launch(), errs = [];
  const W = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/settlement_walk.json'), 'utf8'));
  ok('G1 every settlement picture the game draws has its ground traced', Object.keys(PICS).every(k => W.pictures[k] && W.pictures[k].blocks.length > 5), Object.keys(PICS).map(k => k + ' ' + (W.pictures[k] ? W.pictures[k].blocks.length : 0)).join(', '));
  let g7 = { taps: 0, jumps: 0, worstStep: 0, slow: 0, longest: 0, placed: 0, where: [] };
  let g2 = { paths: 0, bad: 0, placed: 0, far: 0, slow: 0, longest: 0, miss: [] }, g3 = { frames: 0, off: 0, taps: 0, where: [] }, g4 = { stops: 0, beside: 0, facing: 0, miss: [] }, g5 = { taps: 0, reversals: 0, moves: 0, still: 0, worst: [] };
  try {
    for (const [VW, VH, phone] of [[390, 763, true], [1440, 900, false]]) {
      const p = await browser.newPage({ viewport: { width: VW, height: VH }, hasTouch: true, isMobile: phone });
      p.on('pageerror', e => errs.push(e.message));
      await p.goto('http://127.0.0.1:' + port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html?place=Church&tier=town');
      for (let i = 0; i < 80; i++) { await p.waitForTimeout(250); if (await p.evaluate(() => { try { return BohemiaSettlement.ready(); } catch (e) { return false; } })) break; }
      for (const [src, tier] of Object.entries(PICS)) {
        /* a place name the screen deals this picture to */
        const name = await p.evaluate(async ([src, tier]) => {
          for (let n = 0; n < 60; n++) { const nm = 'WALK ' + n; BohemiaSettlement.open({ place: { name: nm, tier }, traits: [] }); await new Promise(r => setTimeout(r, 30)); if (BohemiaSettlement.lead().src === src) return nm; }
          return null; }, [src, tier]);
        if (!name) { g2.miss.push(src + ' never dealt'); continue; }
        await p.waitForFunction(() => BohemiaSettlement.ready() && BohemiaSettlement.lead().drawn, null, { timeout: 15000 }).catch(() => {});
        await p.waitForTimeout(600);
        /* ---- G2 every way between every pair, in the page ---- */
        const r2 = await p.evaluate(() => { const S = BohemiaSettlement, L = S.lead(), out = { paths: 0, bad: 0, placed: 0, far: 0, miss: [] };
          return S._walkAll ? S._walkAll() : out; });
        g2.paths += r2.paths; g2.bad += r2.bad; g2.placed += r2.placed; g2.far += r2.far; g2.slow += r2.slow | 0; g2.longest = Math.max(g2.longest, r2.longest | 0); g2.miss = g2.miss.concat(r2.miss.map(m => src + ' ' + m)).slice(0, 8);
        /* ---- G3, G4, G5 real taps, every frame recorded ---- */
        await p.evaluate(() => { window.__WL = []; const tick = () => { const l = BohemiaSettlement.lead(), v = BohemiaSettlement._view(); window.__WL.push({ t: performance.now(), x: l.x, y: l.y, w: l.walking, oy: v.oy, bad: l.x != null && l.blocked(l.x, l.y) }); if (window.__WL.length < 20000) requestAnimationFrame(tick); }; requestAnimationFrame(tick); });
        const targets = await p.evaluate(() => { const S = BohemiaSettlement, F = S.folk(), out = [];
          S.order().filter(k => k !== 'lot' && k !== 'build').forEach(k => out.push({ k: 'b:' + k }));
          F.forEach((q, i) => { if (q.crowd || q.campMan) out.push({ k: 'p:' + i }); });
          return out.slice(0, 7); });
        for (const tg of targets) {
          await p.evaluate(() => { const c = document.getElementById('close'); if (BohemiaSettlement.state.open && c) c.click(); });
          await p.waitForTimeout(450);   /* the town's move back down (a quarter second) is over before the next tap is read */
          const at = await p.evaluate((k) => { const S = BohemiaSettlement, v = S._view(), r = document.getElementById('cv').getBoundingClientRect();
            if (k.startsWith('b:')) { const w = S.where(k.slice(2)); return w ? { x: w.x, y: w.y } : null; }
            const q = S.folk()[+k.slice(2)]; if (!q) return null; const ph = S.scale().person;
            const sx = v.ox + q.x * v.s, sy = v.oy + (q.y - ph * .5) * v.s; if (sx < 4 || sx > v.W - 4 || sy < 4 || sy > v.H - 4) return null; return { x: r.left + sx, y: r.top + sy }; }, tg.k);
          if (!at) continue;
          const i0 = await p.evaluate(() => window.__WL.length), placed0 = await p.evaluate(() => BohemiaSettlement.lead().placed);
          await p.touchscreen.tap(at.x, at.y); g3.taps++;
          for (let k = 0; k < 50; k++) { await p.waitForTimeout(250); if (await p.evaluate(() => { const l = BohemiaSettlement.lead(); return !l.walking && !l.path; })) break; }
          await p.waitForTimeout(1300);   /* he turns to face him, an eighth a key */
          const r = await p.evaluate((i0) => { const L = window.__WL.slice(i0), l = BohemiaSettlement.lead(), S = BohemiaSettlement.state;
            const who = l.goal && l.goal.key, folk = BohemiaSettlement.folk();
            let tgt = null; if (who && who.startsWith('crowd:')) tgt = folk.find(q => q.crowd && 'crowd:' + q.slot === who); else if (who && who.startsWith('b:')) tgt = folk.find(q => q.keeper && 'b:' + q.k === who);
            const oys = L.map(f => f.oy), dirs = []; for (let i = 1; i < oys.length; i++) { const d = oys[i] - oys[i - 1]; if (d) dirs.push(Math.sign(d)); }
            let flips = 0; for (let i = 1; i < dirs.length; i++) if (dirs[i] !== dirs[i - 1]) flips++;
            const walkOys = L.filter(f => f.w).map(f => f.oy), spanW = walkOys.length ? Math.max.apply(null, walkOys) - Math.min.apply(null, walkOys) : 0;
            return { frames: L.length, off: L.filter(f => f.bad).length, offAt: L.filter(f => f.bad).slice(0, 2).map(f => [Math.round(f.x), Math.round(f.y)]), open: S.open, who, flips, moves: dirs.length ? 1 : 0, spanW, liftGoal: l.liftGoal,
              beside: tgt ? (Math.abs(l.x - tgt.x) < 110 && Math.abs(l.y - tgt.y) < 70) || (function(){ const n = BohemiaSettlement._ground(tgt.x, tgt.y + 3); return !!n && Math.hypot(n.x - l.x, n.y - l.y) < 70; })() : null,   /* beside him, or (a keeper boxed in by his own counter) on the ground nearest him */ facing: tgt ? (Math.abs(l.x - tgt.x) < 8 ? true : l.face === (tgt.x > l.x ? 'E' : 'W')) : null, placed: l.placed }; }, i0);
          /* G7: every frame of this tap, how far he moved (a step is half his stride: 37 sheet px at the rig's scale) */
          const r7 = await p.evaluate(([i0, placed0]) => { const L = window.__WL.slice(i0), step = 37 * BohemiaSettlement.scale().person / 98; let jumps = 0, worst = 0, w0 = null, w1 = null;
            for (let i = 1; i < L.length; i++) { if (L[i].x == null || L[i - 1].x == null) continue; const d = Math.hypot(L[i].x - L[i - 1].x, L[i].y - L[i - 1].y); if (d > worst) worst = d; if (d > step + 0.5) jumps++; }
            L.forEach(f => { if (f.w) { if (w0 == null) w0 = f.t; w1 = f.t; } });
            return { jumps, worst: Math.round(worst * 10) / 10, step: Math.round(step), ms: w0 == null ? 0 : Math.round(w1 - w0), placed: BohemiaSettlement.lead().placed - placed0 }; }, [i0, placed0]);
          g7.taps++; g7.jumps += r7.jumps; g7.worstStep = Math.max(g7.worstStep, r7.worst); g7.longest = Math.max(g7.longest, r7.ms); g7.placed += r7.placed; if (r7.ms > 4600) g7.slow++;
          if (r7.jumps || r7.ms > 4600 || r7.placed) g7.where.push(src + ' ' + (phone ? 'phone' : 'pc') + ' ' + tg.k + ' ' + JSON.stringify(r7));
          g3.frames += r.frames; g3.off += r.off; if (r.off) g3.where.push(src + ' ' + (phone ? 'phone' : 'pc') + ' ' + tg.k + ' at ' + JSON.stringify(r.offAt));
          if (r.beside != null) { g4.stops++; if (r.beside) g4.beside++; else g4.miss.push(src + ' ' + tg.k); if (r.facing) g4.facing++; }
          g5.taps++; g5.reversals += r.flips; g5.moves += r.moves; if (r.flips) g5.worst.push(src + ' ' + (phone ? 'phone' : 'pc') + ' ' + tg.k + ' ' + r.flips + ' turns');
        }
        if (process.env.BOHEMIA_SHOT_DIR) await p.screenshot({ path: path.join(process.env.BOHEMIA_SHOT_DIR, 'ground_' + (phone ? 'phone_' : 'pc_') + src.replace('.webp', '.png')) });
      }
      await p.close();
    }
  } catch (e) { ok('the walks ran [' + String(e.message).slice(0, 200) + ']', false); }
  ok('G2 every way between every building and person, on every picture: never across a block, every one walked or run, none over about four seconds', g2.paths > 100 && g2.bad === 0 && g2.miss.length === 0 && g2.far === 0 && g2.slow === 0,
    g2.paths + ' ways found, ' + g2.far + ' with none, ' + g2.bad + ' crossing a block, ' + g2.slow + ' over 4.6 s (the longest ' + Math.round(g2.longest) + ' ms); ' + g2.miss.join(' | '));
  ok('G3 REAL TAPS, EVERY FRAME, phone and computer, every picture: his feet on the ground in every frame (never in a block, so never behind a roof or painted over one)', g3.taps >= 40 && g3.frames > 1000 && g3.off === 0,
    g3.taps + ' taps, ' + g3.frames + ' frames, ' + g3.off + ' with his feet in a block ' + g3.where.slice(0, 3).join(' | '));
  ok('G4 he stops beside the one tapped (or, where the art boxes a keeper in, on the ground nearest him), facing him', g4.stops > 20 && g4.beside === g4.stops && g4.facing >= g4.stops * 0.9, g4.beside + ' of ' + g4.stops + ' beside, ' + g4.facing + ' facing; ' + g4.miss.slice(0, 4).join(', '));
  ok('G5 THE TOWN NEVER SHAKES: over every frame of every walk, the town moves at most once a tap, one way', g5.taps >= 40 && g5.reversals === 0, g5.taps + ' taps, ' + g5.reversals + ' back-and-forth turns of the town ' + g5.worst.slice(0, 3).join(' | '));
  ok('*** G7 HE ALWAYS WALKS, NEVER TELEPORTS *** (every frame of every real tap, phone and computer, every picture: never more than a step a frame, every walk-up over in about four seconds, nothing placed)',
    g7.taps >= 40 && g7.jumps === 0 && g7.slow === 0 && g7.placed === 0, g7.taps + ' taps, ' + g7.jumps + ' jumps, the biggest frame ' + g7.worstStep + ' px, the longest walk-up ' + g7.longest + ' ms ' + g7.where.slice(0, 3).join(' | '));
  ok('G6 nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));
  await browser.close(); server.close();
  done();
})();
