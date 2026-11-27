#!/usr/bin/env node
/* ============================================================================
   THE MAP'S PEOPLE ARE PACKED (CHARACTER 3, 11/27/26; ask row 769, VAMILY rule 484(a) amended, rules 480(c) and 482(c)).
   Paolo 11/27: 'combat keeps crashing, like when I get into combat and then when I finish it, it's insane'; his A: the page goes white,
   Safari on an iPhone killing the tab for memory. PLUMBER 8 measured the iPhone's way: the map holds its people sheets as bitmaps the
   whole session, under the fight too (ask row 769). MEASURED BY THIS LANE: 166 MB of people sheets in 11 bitmaps after the town; a man
   fills 23 percent of his cell (town_2 to town_4: 5 to 7 percent).
   NOW (__THE_MAPS_PEOPLE_ARE_PACKED__ in slices/BOHEMIA_CITY_WORLD.html, tools/bohemia_character_three_the_map_sheets_packed.py): each
   sheet comes as its atlas, every cell cut to the box its pixels fill, the frame moved by the trim; used only when the sheet's bytes on
   the server equal the table's.
     K1 every map people sheet has a fresh atlas (the packer's --check), and every cell of every atlas is its sheet's cell, pixel for
        pixel (--prove)
     K2 on the demo's map (a phone upright), every people sheet it took came as its atlas (none whole but BOHEMIA_RIG_YOU), in at most
        half the memory the whole sheets take
     K3 THE SAME PIXELS: every frame the map cut from an atlas (every set it built), made a canvas, is its whole sheet's cell in the
        same box, pixel for pixel
     K4 THE SAME GLASS: the map's own draw of a man (mapPersonDraw: standing, and two steps of his walk; his armour on for his own men)
        at three zooms, from the atlas and from the whole sheet: the same pixels on the glass
     K5 the depth reads the whole cell's box: rigBlit's box for a packed frame is the whole frame's box
     K6 no page error on the map with its people packed
     P1 PLANT the way before (window.__MAP_SHEETS_WHOLE): K2 bites (every sheet whole)
     P2 PLANT a stale table (rig_mix/town's bytes off by one in the index): that sheet comes whole, never old art
     K7 ON THE SITE: a sheet whose atlas is fresh is not published (tools/bohemia_publish_list.js); its size asked answers 404 and the
        map draws from the atlas
   The demo upright at full speed. About 5 minutes.
   ============================================================================ */
'use strict';
const path = require('path'), { spawnSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const TOOL = path.join(ROOT, 'tools', 'bohemia_character_three_the_map_sheets_packed.py');

async function boot(arm) {
  const d = await D.open({ profile: 'phone_portrait', door: 180000, engage: true, pages: true, arm: arm || '' });
  await sleep(2500);
  await d.fr.evaluate(() => { try { if (LOOP && LOOP.open) loopClose(); } catch (e) {} });
  /* the map's people in: his men, the crowd's pool and the near gangs (the warm asks them), then a few seconds of drawing */
  for (let i = 0; i < 120; i++) { if (await d.fr.evaluate(() => { try { return !rigWaiting() && Object.keys(RIG_MIX.sheets).length >= 5 && Object.values(RIG_MIX.sheets).every(S => S.state >= 2); } catch (e) { return false; } })) break; await sleep(500); }
  await sleep(4000);
  return d;
}

(async () => {
  /* K1 */
  const ck = spawnSync('python3', [TOOL, '--check'], { cwd: ROOT, encoding: 'utf8' });
  const pv = spawnSync('python3', [TOOL, '--prove'], { cwd: ROOT, encoding: 'utf8', timeout: 600000 });
  ok('K1 every map people sheet has a fresh atlas, and every cell of every atlas is its sheet\'s cell, pixel for pixel', ck.status === 0 && pv.status === 0,
     (ck.stdout || ck.stderr || '').trim().split('\n').pop() + '; ' + (pv.stdout || pv.stderr || '').trim().split('\n').pop());

  /* K2 to K5 */
  let d = await boot();
  try {
    const st = await d.fr.evaluate(() => { const ix = MAP_PACKED.index || {}, sheets = { BOHEMIA_RIG_CAST: RIG_CAST, BOHEMIA_RIG_PEOPLE: RIG_PEOPLE };
      for (const n in RIG_MIX.sheets) sheets['rig_mix/' + n] = RIG_MIX.sheets[n];
      let packed = 0, whole = 0, pMB = 0, wMB = 0; const wh = [];
      for (const n in sheets) { const S = sheets[n]; if (S.state !== 2) continue; const e = ix[n];
        if (S.pk) { packed++; pMB += S.pk.aw * S.pk.ah * 4 / 1048576; wMB += S.pk.w * S.pk.h * 4 / 1048576; } else { whole++; wh.push(n); wMB += S.img.width * S.img.height * 4 / 1048576; pMB += S.img.width * S.img.height * 4 / 1048576; } }
      return { packed, whole, wh, pMB: Math.round(pMB), wMB: Math.round(wMB), used: MAP_PACKED.used, stale: MAP_PACKED.stale }; });
    ok('K2 on the demo\'s map every people sheet it took came as its atlas, in at most half the whole sheets\' memory', st.packed >= 6 && st.whole === 0 && st.pMB <= st.wMB / 2,
       st.packed + ' packed, ' + st.whole + ' whole' + (st.wh.length ? ' (' + st.wh.slice(0, 4).join(' ') + ')' : '') + '; ' + st.pMB + ' MB held where the whole sheets are ' + st.wMB + ' MB');

    /* the whole sheets beside them, for the comparisons: each sheet's own file, unpacked here */
    const K3 = await d.fr.evaluate(async () => {
      const sheets = { BOHEMIA_RIG_CAST: RIG_CAST, BOHEMIA_RIG_PEOPLE: RIG_PEOPLE }; for (const n in RIG_MIX.sheets) sheets['rig_mix/' + n] = RIG_MIX.sheets[n];
      window.__WHOLE = {}; let frames = 0, off = 0, sets = 0, box = 0, boxOff = 0; const bad = [];
      const px = (c) => { const a = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; for (let i = 0; i < a.length; i += 4) if (!a[i + 3]) a[i] = a[i + 1] = a[i + 2] = 0; return a; };
      for (const n in sheets) { const S = sheets[n]; if (S.state !== 2 || !S.pk) continue;
        const bm = await createImageBitmap(await (await fetch(n + '.png')).blob());
        const W = window.__WHOLE[n] = { state: 2, meta: S.meta, img: bm, sets: {}, drew: 0 };
        const keys = Object.keys(S.sets).filter(k => S.sets[k]); if (!keys.length) keys.push(S.meta.gangs[0]);   /* a sheet nobody was drawn from yet: its first man */
        for (const k of keys) { const A = rigSheetSet(S, k), B = rigSheetSet(W, k); if (!A || !B) continue; sets++;
          for (const dir of S.meta.dirs) { if (!A[dir] || !B[dir]) continue; const fa = [A[dir].idle].concat(A[dir].walk || []), fb = [B[dir].idle].concat(B[dir].walk || []);
            for (let i = 0; i < fa.length; i++) { frames++; RIG_LRU.clear(); const a = px(rigCanvas(fa[i])), b = px(rigCanvas(fb[i]));
              let same = a.length === b.length; for (let j = 0; same && j < a.length; j++) if (a[j] !== b[j]) same = false;
              if (!same) { off++; if (bad.length < 4) bad.push(n + ':' + k + ':' + dir + ':' + i); }
              /* K5: the depth's box */
              const q = [], r = []; const g0 = g, sc = document.createElement('canvas'); sc.width = 120; sc.height = 160; g = sc.getContext('2d');
              try { window.MAP_DEPTH_CORE = q; rigBlit(fa[i], 3.3, 2.7, 56 * 0.61, fa[i].height * 0.5 * 0.61); window.MAP_DEPTH_CORE = r; rigBlit(fb[i], 3.3, 2.7, 56 * 0.61, fb[i].height * 0.5 * 0.61); }
              finally { window.MAP_DEPTH_CORE = null; g = g0; }
              box++; if (JSON.stringify(q) !== JSON.stringify(r) || rigCellX(fa[i]) !== rigCellX(fb[i]) || rigCellY(fa[i]) !== rigCellY(fb[i])) boxOff++; } } } }
      RIG_LRU.clear();
      return { frames, off, sets, bad, box, boxOff };
    });
    ok('K3 THE SAME PIXELS: every frame cut from an atlas, made a canvas, is its whole sheet\'s cell in the same box', K3.frames >= 500 && K3.off === 0,
       K3.frames + ' frames of ' + K3.sets + ' men, ' + K3.off + ' differ' + (K3.bad.length ? ' (' + K3.bad.join(' ') + ')' : ''));

    const K4 = await d.fr.evaluate(async () => {
      const sheets = { BOHEMIA_RIG_CAST: RIG_CAST, BOHEMIA_RIG_PEOPLE: RIG_PEOPLE }; for (const n in RIG_MIX.sheets) sheets['rig_mix/' + n] = RIG_MIX.sheets[n];
      const crew = (() => { try { return mapCrewLooks() || []; } catch (e) { return []; } })();
      const g0 = g, k0 = MAP_PEOPLE_K, B0 = window.BohemiaIdles, ref0 = MAP_DEPTH.ref, M0 = MAP_MARCH.on;
      const c = document.createElement('canvas'); c.width = 200; c.height = 220; const x = c.getContext('2d');
      const shot = () => { const a = x.getImageData(0, 0, c.width, c.height).data; let h = 0, n = 0; for (let i = 0; i < a.length; i += 4) if (a[i + 3]) { n++; h = (Math.imul(h, 31) + a[i] * 7 + a[i + 1] * 13 + a[i + 2] * 17 + a[i + 3] + i) >>> 0; } return n + ':' + h; };
      let cases = 0, off = 0, painted = 0, worn = 0; const bad = [];
      try {
        window.BohemiaIdles = null; MAP_DEPTH.ref = null; MAP_MARCH.on = false;   /* his still and his walk from this sheet, the glass straight */
        const jobs = [];
        for (const n in sheets) { const S = sheets[n], W = window.__WHOLE[n]; if (!S.pk || !W) continue;
          const ks = Object.keys(S.sets).filter(k => S.sets[k]).slice(0, 2); if (!ks.length) ks.push(S.meta.gangs[0]);
          crew.forEach(l => { if (S.meta.gangs.indexOf(l) >= 0 && ks.indexOf(l) < 0) ks.push(l); });
          ks.forEach(k => jobs.push({ n, k, S, W, look: crew.indexOf(k) >= 0 ? k : null })); }
        for (const pass of [0, 1, 2, 3, 4, 5]) {   /* the armour's head is read a moment after a cell is first met: draw until both are read */
          for (const j of jobs) for (const kz of [1, 0.75, 0.55]) for (const face of ['S', 'E', 'NW']) for (const ph of [null, 0, 0.5]) {
            const A = rigSheetSet(j.S, j.k), B = rigSheetSet(j.W, j.k); if (!A || !B) continue;
            MAP_PEOPLE_K = kz; g = x;
            x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height); x.setTransform(1.5, 0, 0, 1.5, 0.37, 0.61);
            mapPersonDraw(A, face, 0, 66.3, 120.4, ph, j.look); const a = shot();
            x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height); x.setTransform(1.5, 0, 0, 1.5, 0.37, 0.61);
            mapPersonDraw(B, face, 0, 66.3, 120.4, ph, j.look); const b = shot();
            g = g0;
            if (pass === 5) { cases++; if (a.split(':')[0] !== '0') painted++; if (j.look) worn++; if (a !== b) { off++; if (bad.length < 4) bad.push(j.n + ':' + j.k + ':' + face + ':' + kz + ':' + ph); } }
          }
          await new Promise(r => setTimeout(r, 300));
        }
      } finally { g = g0; MAP_PEOPLE_K = k0; window.BohemiaIdles = B0; MAP_DEPTH.ref = ref0; MAP_MARCH.on = M0; x.setTransform(1, 0, 0, 1, 0, 0); }
      return { cases, off, painted, worn, bad };
    });
    ok('K4 THE SAME GLASS: the map\'s own draw of a man (standing and walking, his armour on for his own men) at three zooms, from the atlas and from the whole sheet', K4.cases >= 100 && K4.off === 0 && K4.painted === K4.cases,
       K4.cases + ' draws (' + K4.worn + ' with his armour), ' + K4.painted + ' painted, ' + K4.off + ' differ' + (K4.bad.length ? ' (' + K4.bad.join(' ') + ')' : ''));
    ok('K5 the depth reads the whole cell\'s box: rigBlit\'s box for a packed frame is the whole frame\'s, and so is the march\'s place', K3.box >= 500 && K3.boxOff === 0, K3.box + ' frames, ' + K3.boxOff + ' differ');
    const errs = (d.errs || []).filter(x => !/favicon|net::ERR_ABORTED/i.test(String(x)));
    ok('K6 no page error on the map with its people packed', errs.length === 0, errs.length ? errs.slice(0, 2).join(' | ') : 'none');
  } finally { try { await d.close(); } catch (e) {} }

  /* P1 */
  d = await boot('window.__MAP_SHEETS_WHOLE = true;');
  try {
    const q = await d.fr.evaluate(() => ({ used: MAP_PACKED.used, whole: MAP_PACKED.whole }));
    ok('P1 PLANT the way before (__MAP_SHEETS_WHOLE): every sheet whole, K2 bites', q.used === 0 && q.whole >= 6, q.used + ' packed, ' + q.whole + ' whole');
  } finally { try { await d.close(); } catch (e) {} }
  /* P2 */
  d = await boot("(function(){ var f0 = window.fetch; window.fetch = function(u, o){ var s = String(u && u.url || u); if (/rig_mix_packed\\/index\\.json$/.test(s)) return f0.apply(this, arguments).then(function(r){ return r.json().then(function(j){ try { j.sheets['rig_mix/town'].bytes += 1; } catch (e) {} return new Response(JSON.stringify(j), { status: 200, headers: { 'content-type': 'application/json' } }); }); }); return f0.apply(this, arguments); }; })();");
  try {
    const q = await d.fr.evaluate(() => ({ town: MAP_PACKED.by['rig_mix/town'] || 'not taken', stale: MAP_PACKED.stale, used: MAP_PACKED.used }));
    ok('P2 PLANT a stale table (rig_mix/town\'s bytes off by one): that sheet comes whole, never old art, the rest packed', /^whole/.test(q.town) && q.stale >= 1 && q.used >= 5, 'rig_mix/town ' + q.town + ', ' + q.stale + ' stale, ' + q.used + ' packed');
  } finally { try { await d.close(); } catch (e) {} }

  /* K7 */
  d = await boot("(function(){ var f0 = window.fetch; window.fetch = function(u, o){ var s = String(u && u.url || u); if (o && o.method === 'HEAD' && /rig_mix\\/[a-z_0-9]+\\.png$/.test(s)) return Promise.resolve(new Response(null, { status: 404 })); return f0.apply(this, arguments); }; })();");
  try {
    const q = await d.fr.evaluate(() => ({ used: MAP_PACKED.used, whole: MAP_PACKED.whole, un: MAP_PACKED.unpublished | 0, drawn: (MAP_DREW && MAP_DREW.art && MAP_DREW.art.rigPeople) | 0 }));
    ok('K7 ON THE SITE: the whole sheets not published (their size asked, a 404), the map draws its people from the atlases', q.used >= 6 && q.whole === 0 && q.un >= 5 && q.drawn > 0, q.used + ' packed, ' + q.whole + ' whole, ' + q.un + ' sheets not on the server, ' + q.drawn + ' people drawn');
  } finally { try { await d.close(); } catch (e) {} }

  console.log('\nTHE MAP\'S PEOPLE ARE PACKED: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); console.log('\nTHE MAP\'S PEOPLE ARE PACKED: ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1); });
