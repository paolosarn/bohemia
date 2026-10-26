/* THE BLOOD IS CRASHBOX  (UI [the blood is CRASHBOX] + [the job tells the truth, in blood], 10/26/26; rule 208(c))

   PAOLO 10/25: 'the button itself looks bloody depending on how difficult the job is, especially if it's gonna be super
   overpowered like wolves... the button looking like some crashbox blood filter'; and the same night: 'not Crash
   Bandicoot, Crashbox' (the HBO Family stop-motion show, rule 115(d)): red clay smeared and dripped by hand on the tin,
   dried dark at the edges, a thumbprint in it, stop-motion holds; never a glossy gradient or a filter.

   MEASURED BEFORE (the demo at 85ff5bb7, 390 x 844): no button could bleed; a job's danger had nowhere to go but its stars.

   THE PICTURES (slices/ui_kit/blood/<stage>/<piece>.png, tools/bohemia_ui_blood.py):
     P1 eight stages, five pieces each, every one there
     P2 CLAY, NOT A FILTER: every blood pixel is fully opaque or the clay's one shadow value (no soft wash), and red
        (red over twice green and twice blue) on at least 95 in 100 clay pixels
     P3 ONE SCALE: every stage holds what the stage before held (95 in 100 of its clay still clay: the clay thickens
        each stage and its rendered edge moves by a texel under the tipped camera; the first cut measured 14 in 100 on
        the spatter, which re-rolled its specks every stage, and that is what this catches), the blood on a job's
        button rises every stage, and the last stage is darker than the first
     P4 MADE THE RIG'S WAY: the tool renders through the kit's sun, camera and post (imported, not copied) on Cycles with
        a shadow catcher, and kit.json says so
   THE SCALE
     S1 bloodStage is WORLD's one scale (records/target/bb/job_danger.json blood_from, blood_full): clean to 4 percent, soaked
        from 65, never down as the danger rises, every stage reachable
   ON THE DEMO, his phone (390 x 844) and a computer (1440 x 900), the town's board through the map's door:
     D1 every person's job on the board wears the blood at bloodStage of its danger, from the rendered pictures
     D2 the blood is under the words and the face and takes no tap (the row's middle hit-tests to the row)
     D3 STOP-MOTION HOLDS: the danger raised, the clay steps one stage at a time, every frame held (250 ms; at least 150 measured), to
        soaked; lowered, it steps back (each frame held 150 ms or more of its 250: a loaded box reads 198)
     D4 from the first stage the words carry the halo of what the clay sits on (invisible on clean paper)
     D5 on the glass: a soaked row is at least a third red clay, a one-star row under a twentieth
     D6 the offer's Take it wears the same blood as the person who offered it
     D7 nothing thrown
   PLANTED (the phone): a gradient in place of the clay, and the holds taken out: each turns its leg red.
   node gates/the_blood_is_crashbox_gate.js */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const DIR = path.join(ROOT, 'slices/ui_kit/blood');
const PIECES = ['thumb', 'hand', 'top', 'foot', 'field'];

/* the pictures are read in a browser page (no image library is assumed on the box) */
async function pictures(page) {
  const data = {};
  for (let s = 1; s <= 8; s++) for (const n of PIECES) {
    const f = path.join(DIR, String(s), n + '.png');
    data[s + '/' + n] = fs.existsSync(f) ? fs.readFileSync(f).toString('base64') : null;
  }
  return page.evaluate(async (data) => {
    const dec = async (b64) => { const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
      const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0); return g.getImageData(0, 0, im.width, im.height); };
    const out = { missing: [], soft: 0, total: 0, clay: 0, red: 0, held: {}, lum: {}, cover: {} };
    const masks = {};
    for (const k in data) {
      if (!data[k]) { out.missing.push(k); continue; }
      const d = await dec(data[k]), px = d.data, m = new Uint8Array(d.width * d.height); let lum = 0, n = 0;
      for (let i = 0; i < m.length; i++) {
        const a = px[i * 4 + 3]; if (!a) continue; out.total++;
        if (a !== 255 && a !== 150) out.soft++;
        if (a === 255) { m[i] = 1; out.clay++; const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2]; if (r > 2 * g && r > 2 * b) out.red++; lum += 0.299 * r + 0.587 * g + 0.114 * b; n++; }
      }
      masks[k] = { m, w: d.width, h: d.height }; out.lum[k] = n ? lum / n : null;
    }
    /* every stage holds the stage before */
    for (const p of ['thumb', 'hand', 'top', 'foot', 'field']) for (let s = 1; s < 8; s++) {
      const a = masks[s + '/' + p], b = masks[(s + 1) + '/' + p]; if (!a || !b) continue;
      let had = 0, kept = 0; for (let i = 0; i < a.m.length; i++) if (a.m[i]) { had++; if (b.m[i]) kept++; }
      out.held[p + ' ' + s + '>' + (s + 1)] = had ? kept / had : 1;
    }
    /* the blood on a job's button (366 x 48 points, laid the way the browser lays it: the thumb at 3, the hand top right,
       the top and the foot repeating, the field from the middle), at the pictures' two texels a point */
    const W = 366 * 2, H = 48 * 2;
    for (let s = 1; s <= 8; s++) {
      const box = new Uint8Array(W * H);
      const lay = (p, x0, y0, rx, ry) => { const q = masks[s + '/' + p]; if (!q) return;
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          let u = x - x0, v = y - y0;
          if (rx) u = ((u % q.w) + q.w) % q.w; if (ry) v = ((v % q.h) + q.h) % q.h;
          if (u < 0 || v < 0 || u >= q.w || v >= q.h) continue;
          if (q.m[v * q.w + u]) box[y * W + x] = 1; } };
      lay('field', 0, H / 2 - 128, true, true); lay('foot', 0, H - 32, true, false); lay('top', 0, 0, true, false);
      lay('hand', W - 112, 0, false, false); lay('thumb', 6, H / 2 - 40, false, false);
      let c = 0; for (let i = 0; i < box.length; i++) c += box[i]; out.cover[s] = c / box.length;
    }
    return out;
  }, data);
}

async function side(profile, d0) {
  console.log('\n' + profile);
  let d;
  try { d = await open({ profile, door: 120000, engage: true }); } catch (e) { ok('the demo opened', false, String(e.message).slice(0, 120)); return; }
  const p = d.page, fr = d.fr, PLANT = profile === 'phone_portrait', errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  try {
    if (d0) {
      /* ---- THE PICTURES ---- */
      const P = await pictures(p);
      ok('P1 eight stages, five pieces each, every one there', P.missing.length === 0, P.missing.slice(0, 5).join(' ') || '40 of 40');
      ok('P2 clay, not a filter: every pixel opaque or the clay\'s one shadow, and red', P.soft === 0 && P.red / P.clay >= 0.95,
        P.soft + ' soft of ' + P.total + '; ' + (100 * P.red / P.clay).toFixed(1) + '% of ' + P.clay + ' clay pixels red');
      const worst = Object.entries(P.held).sort((a, b) => a[1] - b[1])[0];
      const cov = [1, 2, 3, 4, 5, 6, 7, 8].map(s => P.cover[s]);
      const rises = cov.every((c, i) => i === 0 || c > cov[i - 1]);
      const l1 = PIECES.map(n => P.lum['1/' + n]).filter(v => v != null), l8 = PIECES.map(n => P.lum['8/' + n]).filter(v => v != null);
      const avg = a => a.reduce((x, y) => x + y, 0) / a.length;
      ok('P3 one scale: every stage holds the one before, the blood on a button rises every stage, the last darker than the first',
        worst[1] >= 0.95 && rises && avg(l8) < avg(l1),
        'worst hold ' + worst[0] + ' ' + (100 * worst[1]).toFixed(1) + '%; cover ' + cov.map(c => Math.round(100 * c)).join(' ') + '%; luminance ' + avg(l1).toFixed(0) + ' -> ' + avg(l8).toFixed(0));
      const src = fs.readFileSync(path.join(ROOT, 'tools/bohemia_ui_blood.py'), 'utf8');
      const kit = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/ui_kit/blood/kit.json'), 'utf8'));
      ok('P4 made the rig\'s way: the kit\'s sun, camera and post on Cycles with a shadow catcher',
        /import bohemia_ui_crashbox_kit as KIT/.test(src) && /KIT\.light_camera\(/.test(src) && /KIT\.post\(/.test(src) && /is_shadow_catcher = True/.test(src)
          && kit.engine === 'CYCLES' && kit.stages === 8 && kit.sun && kit.sun.screen_deg === 155.4 && kit.tilt_deg === 25,
        JSON.stringify({ engine: kit.engine, stages: kit.stages, sun: kit.sun, tilt: kit.tilt_deg }));
    }
    for (let i = 0; i < 40 && !(await fr.evaluate(() => !!document.getElementById('bmtb'))); i++) await p.waitForTimeout(250);
    if (d0) {
      const S = await fr.evaluate(() => { const M = window.BohemiaMaterials, xs = []; for (let i = 0; i <= 100; i++) xs.push(M.bloodStage(i / 100)); return xs; });
      const mono = S.every((v, i) => i === 0 || v >= S[i - 1]), all = [0, 1, 2, 3, 4, 5, 6, 7, 8].every(v => S.indexOf(v) >= 0);
      const JD = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/job_danger.json'), 'utf8')), lo = Math.round(100 * JD.blood_from.value), hi = Math.round(100 * JD.blood_full.value);
      ok('S1 bloodStage is WORLD\'s one scale: clean to blood_from, soaked from blood_full (job_danger.json), never down as the danger rises, every stage reachable',
        S[0] === 0 && S[lo] === 0 && S[lo + 1] >= 1 && S[hi] === 8 && S[hi - 1] < 8 && S[100] === 8 && mono && all,
        'clean to ' + lo + ', soaked from ' + hi + '; 5:' + S[5] + ' 10:' + S[10] + ' 25:' + S[25] + ' 40:' + S[40] + ' 55:' + S[55] + ' 65:' + S[65]);
    }
    /* ---- THE TOWN'S BOARD ---- */
    await fr.evaluate(() => { const t = loopTownAt(city.x, city.y, 6); if (t) loopOpenTown(t); return t && t.name; });
    let sf = null;
    for (let i = 0; i < 60 && !sf; i++) { await p.waitForTimeout(500);
      for (const x of p.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !BohemiaSettlement.camp().camp; } catch (e) { return false; } }).catch(() => false)) { sf = x; break; } }
    if (!sf) { ok('a town through the map\'s door', false); return; }
    await sf.waitForFunction(() => !document.getElementById('arrive'), null, { timeout: 8000 }).catch(() => {});
    const box = await (await sf.frameElement()).boundingBox();
    for (let i = 0; i < 6; i++) { if (await sf.evaluate(() => BohemiaSettlement.state.open === 'board' && !!document.querySelector('#sbody .act.client'))) break;
      const w = await sf.evaluate(() => BohemiaSettlement.where('board')); if (w) { if (PLANT) await p.touchscreen.tap(box.x + w.x, box.y + w.y); else await p.mouse.click(box.x + w.x, box.y + w.y); } await p.waitForTimeout(900); }
    /* WORLD's reader plays every job on AUTO and hands its number (data-danger) to the layer; wait for it on every row (where
       the reader is on the page), then for the clay to step to it: a job seen for the first time bleeds in from clean */
    await sf.waitForFunction(() => { const R = [...document.querySelectorAll('#sbody .act.client')]; const W = window.BohemiaJobDanger || (parent && parent.BohemiaJobDanger);
      return R.length > 0 && (!W || R.every(e => e.hasAttribute('data-danger'))); }, null, { timeout: 150000 }).catch(() => {});
    await p.waitForTimeout(2600);
    const rows = await sf.evaluate(() => [...document.querySelectorAll('#sbody .act.client')].map(e => {
      const st = e.querySelector('[data-job-stars]'), ca = getComputedStyle(e, '::after'), r = e.getBoundingClientRect();
      const d = e.hasAttribute('data-danger') ? +e.getAttribute('data-danger') : ({ 1: 0.06, 2: 0.25, 3: 0.52 })[st ? +st.getAttribute('data-job-stars') : 0];
      const two = e.querySelectorAll(':scope > i.jdblood').length;   /* ONE blood: WORLD's own layer never drawn beside the kit's */
      const h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return { id: e.dataset.id, two, blood: +e.getAttribute('data-bm-blood'), want: BohemiaMaterials.bloodStage(d), d, bg: ca.backgroundImage, z: ca.zIndex, pe: ca.pointerEvents,
        iso: getComputedStyle(e).isolation, hit: !!h && (h === e || e.contains(h)) };
    }));
    ok('D1 ' + profile + ': every job on the board wears the blood of its danger, from the rendered pictures',
      rows.length >= 1 && rows.every(r => r.blood === r.want && r.two === 0 && (r.want === 0 || (r.bg.match(/ui_kit\/blood\/\d\/\w+\.png/g) || []).length === 5)),
      rows.map(r => r.id + ' d ' + r.d + ' stage ' + r.blood + '/' + r.want).join(', '));
    ok('D2 ' + profile + ': under the words and the face, and it takes no tap', rows.length >= 1 && rows.every(r => r.z === '-1' && r.pe === 'none' && r.iso === 'isolate' && r.hit),
      rows.map(r => 'z ' + r.z + ' ' + r.pe + ' ' + r.iso + ' hit ' + r.hit).join(', '));
    /* D3: the stop-motion holds */
    const watch = (to) => sf.evaluate(async (to) => {
      const e = document.querySelector('#sbody .act.client'), seen = []; let last = null, at = performance.now();
      e.setAttribute('data-danger', to);
      const t0 = performance.now();
      while (performance.now() - t0 < 3200) { const v = +e.getAttribute('data-bm-blood'); if (v !== last) { if (last !== null) seen.push({ v: last, held: performance.now() - at }); last = v; at = performance.now(); } await new Promise(r => setTimeout(r, 20)); }
      seen.push({ v: last, held: performance.now() - at });
      return seen;
    }, to);
    const steps = (seq) => seq.every((x, i) => i === 0 || Math.abs(x.v - seq[i - 1].v) === 1);
    const holds = (seq) => seq.slice(0, -1).every((x, i) => i === 0 || x.held >= 150);   /* the first frame is where it stood; 250 ms a frame, read as 198 under a loaded box, so 150: a skipped hold reads under 50 */
    const up = await watch(0.9);
    ok('D3 ' + profile + ': raised, the clay steps one stage at a time, each held, to soaked', steps(up) && holds(up) && up[up.length - 1].v === 8,
      up.map(x => x.v + '(' + Math.round(x.held) + ')').join(' '));
    const shotRow = async () => { const r = await sf.evaluate(() => { const b = document.querySelector('#sbody .act.client'); b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return [q.x, q.y, q.width, q.height]; });
      await p.waitForTimeout(150); const buf = await p.screenshot({ clip: { x: box.x + r[0] + 2, y: box.y + r[1] + 2, width: r[2] - 4, height: r[3] - 4 } });
      return p.evaluate(async (b64) => { const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode(); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
        const g = c.getContext('2d'); g.drawImage(im, 0, 0); const px = g.getImageData(0, 0, c.width, c.height).data; let red = 0;
        for (let i = 0; i < px.length; i += 4) if (px[i] > 90 && px[i] > 2.2 * px[i + 1] && px[i] > 2.2 * px[i + 2]) red++; return red / (px.length / 4); }, buf.toString('base64')); };
    const soaked = await shotRow();
    const halo = await sf.evaluate(() => { const e = document.querySelector('#sbody .act.client'); return e.getAttribute('data-blood-halo') + ' ' + getComputedStyle(e.querySelector('span') || e).textShadow.slice(0, 40); });
    ok('D4 ' + profile + ': with blood on it the words carry a halo of what the clay sits on', /^bone /.test(halo) && /rgb\(233, 221, 194\)/.test(halo), halo);
    const down = await watch(0.05);
    ok('D3 ' + profile + ': lowered, it steps back the same way', steps(down) && holds(down) && down[down.length - 1].v === 1, down.map(x => x.v + '(' + Math.round(x.held) + ')').join(' '));
    const one = await shotRow();
    ok('D5 ' + profile + ': on the glass a soaked row is at least a third red clay, a one-star row under a twentieth', soaked >= 0.33 && one < 0.05,
      'soaked ' + (100 * soaked).toFixed(1) + '%, one star ' + (100 * one).toFixed(1) + '%');
    if (PLANT) {
      await sf.evaluate(() => { const s = document.createElement('style'); s.id = 'plant'; s.textContent = 'html[data-kit] body [data-blood]::after{background-image:linear-gradient(#a00,#300)!important}'; document.head.appendChild(s); });
      const g = await sf.evaluate(() => getComputedStyle(document.querySelector('#sbody .act.client'), '::after').backgroundImage);
      ok('PLANTED: a gradient in place of the clay is caught by D1', (g.match(/ui_kit\/blood\/\d\/\w+\.png/g) || []).length !== 5, g.slice(0, 50));
      await sf.evaluate(() => document.getElementById('plant').remove());
      await sf.evaluate(() => { BohemiaMaterials.BLOOD.hold = 0; });
      const j = await watch(0.9);
      ok('PLANTED: the holds taken out is caught by D3', !(steps(j) && holds(j)), j.map(x => x.v + '(' + Math.round(x.held) + ')').join(' '));
      await sf.evaluate(() => { BohemiaMaterials.BLOOD.hold = 250; });
      await watch(0.05);
    }
    /* D6: the offer */
    /* the row's own danger as the game read it (D3 above moved the row's number; WORLD's reader hands the offer the job's read,
       and where no reader is on the page the offer takes the row's) */
    const rowD = rows[0] ? rows[0].d : null, world = await sf.evaluate(() => !!(window.BohemiaJobDanger || (parent && parent.BohemiaJobDanger)));
    if (world) await sf.evaluate((d) => { const e = document.querySelector('#sbody .act.client'); e.setAttribute('data-danger', d); }, rowD);
    await p.waitForTimeout(2600);
    const want = await sf.evaluate(() => BohemiaMaterials.bloodStage(+document.querySelector('#sbody .act.client').getAttribute('data-danger')));
    await sf.evaluate(() => document.querySelector('#sbody .act.client').click()); await p.waitForTimeout(1200);
    await sf.waitForFunction(() => { const b = [...document.querySelectorAll('#sbody .acts .act')].find(x => /^\s*take/i.test(x.textContent)); return b && b.hasAttribute('data-bm-blood-to') && b.getAttribute('data-bm-blood') === b.getAttribute('data-bm-blood-to'); }, null, { timeout: 30000 }).catch(() => {});
    const take = await sf.evaluate(() => { const b = [...document.querySelectorAll('#sbody .acts .act')].find(x => /^\s*take/i.test(x.textContent)); return b ? { blood: +b.getAttribute('data-bm-blood'), d: b.getAttribute('data-danger'), two: b.querySelectorAll(':scope > i.jdblood').length, bg: getComputedStyle(b, '::after').backgroundImage.slice(0, 80) } : null; });
    ok('D6 ' + profile + ': the offer\'s Take it wears the same blood as the person who offered it', !!take && take.blood === want && take.two === 0 && (want === 0 || /ui_kit\/blood/.test(take.bg)), take ? 'take ' + take.blood + ' (danger ' + take.d + '), row ' + want + ' (danger ' + rowD + ')' : 'no Take it');
    ok('D7 ' + profile + ': nothing thrown', errs.length === 0, errs.slice(0, 2).join(' | '));
  } catch (e) { ok('the gate ran on ' + profile, false, String(e.message).slice(0, 200)); }
  finally { try { await d.browser.close(); } catch (_e) {} try { d.server && d.server.close(); } catch (_e) {} }
}

(async () => {
  await side('phone_portrait', true);
  await side('computer', false);
  console.log('\nTHE BLOOD IS CRASHBOX: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
