/* ANIMATION [the aura of the one you control], 10/19: FILMS THE THREE CANDIDATES ON THE REAL FIGHT FROM THE GAME'S CAMERA.
   The fight (slices/BOHEMIA_FIGHT.html) opens on his phone profile through the one driver, the line is set and FIGHT is
   pressed the way he presses it, and when the turn is a man of his the aura is laid on him by the hook (the fight's file is
   not touched: slices/vote/ANIMATION_THE_AURA_HOOK.js wraps its blitMan from outside). The camera is the game's own, at the
   zoom the game chose; nothing is moved or zoomed for the film. The beat clock is driven slot by slot (six a beat at 120),
   so every held pose is caught exactly once: a clip is two bars, 48 pictures, each shown a twelfth of a second.
     node tools/bohemia_animation_the_aura_film.js <out dir> [stills|clips|map] [seed]
   stills: six slots of each candidate, full screen and cropped, to look at. clips: the 48 crops of each candidate as PNGs
   (tools/bohemia_animation_the_aura_bake.py turns them into the VOTE page's clips) plus one full screen a candidate.
   sprites: the man wearing the echo and the current on his first beat, the rig's poncho crewman in all eight facings on a
   clear ground (records/target/master_rig/aura_current/aura_<kind>_<F>.png), the pictures the registry row names for the
   NOT VIBE CODED read (rule 114b); the tear moves the world's own pixels and has no picture of its own off the board.
   map: THE SAME ON THE BIG MAP, the map's size (rule 120(c)): the demo opens through its front door as a stranger's does,
   the map's own frame round his party, his body sprite and its box are taken, and 48 crops per candidate are drawn by the
   same module on that frame (see map() for why: the map redraws him only when he moves), map_<kind>_NN.png. REFERENCE CHECK (the 9/4 standing duty): the twin is the same screen with no aura; no reference game. */
const fs = require('fs'), path = require('path'); const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const [out, mode = 'stills', seed = '5'] = process.argv.slice(2);
const KINDS = ['echo', 'tear', 'current'];
const CROP = { w: 118, h: 172 };   /* css px: three side by side on a 390 phone, one art pixel to one phone pixel */

async function map() {
  /* THE MAP DRAWS HIM ONLY WHEN THE PARTY MOVES (measured: MAP_DREW.youCount stays 1 at rest while render() runs 78
     blits, the rest of the map reusing its last picture; right for a phone). So the film takes what the map drew: its
     frame as he stands (the game's camera, his phone's pixels), his own body sprite (the map's spriteAt of PLAYER_CV at
     his facing, the picture it blits) and the exact box it blits it in (mapSnap(gx - w/2), mapSnap(gy - h*0.93), w, h).
     Then in the VOTE page, the same module draws the aura on that frame with the same calls RUN will make where the
     body is drawn: 'behind', his body, 'front', at size 'map', 48 slots. */
  const d = await open({ door: 120000, profile: 'phone_portrait' });
  const p = d.page, fr = d.fr; await p.waitForTimeout(8000);
  const M = await fr.evaluate(() => {
    const you = MAP_DREW.you, set = PLAYER_CV[you.face] || PLAYER_CV.S, body = spriteAt(set.idle, 32);
    const w = body.width / 2, h = body.height / 2;
    /* the map's canvas sits under the top bar: its numbers are the canvas's, the screenshot's are the page's */
    const r = g.canvas.getBoundingClientRect(), ox = r.left, oy = r.top;
    return { you: Object.assign({}, you, { x: you.x + ox, y: you.y + oy }), canvasAt: [ox, oy], w, h, dx: mapSnap(you.x - w / 2) + ox, dy: mapSnap(you.y - h * 0.93) + oy,
             body: body.toDataURL('image/png'), bw: body.width, bh: body.height, dpr: devicePixelRatio };
  });
  const W = 118, H = 150, clip = { x: Math.round(M.you.x - W / 2), y: Math.round(M.you.y - M.h * 0.5 - H / 2), width: W, height: H };
  await p.screenshot({ path: path.join(out, 'map_none_full.png') });
  await p.screenshot({ path: path.join(out, 'map_bg.png'), clip });
  fs.writeFileSync(path.join(out, 'map_body.png'), Buffer.from(M.body.split(',')[1], 'base64'));
  await d.close();
  const bg = 'data:image/png;base64,' + fs.readFileSync(path.join(out, 'map_bg.png')).toString('base64');
  const v = await open({ file: 'vote/ANIMATION_THE_AURA.html', bare: true, profile: 'phone_portrait' });
  const q = v.page; await q.waitForTimeout(800);
  await q.evaluate(async ({ bg, body, M, clip, W, H }) => {
    const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
    const B = await load(bg), Y = await load(body), dpr = devicePixelRatio;
    const cv = document.createElement('canvas'); cv.id = 'mapfilm'; cv.width = W * dpr; cv.height = H * dpr;
    cv.style.cssText = 'position:fixed;left:0;top:0;width:' + W + 'px;height:' + H + 'px;z-index:99;image-rendering:pixelated';
    document.body.appendChild(cv);
    const g = cv.getContext('2d');
    window.__mapFrame = (kind, t) => {
      g.setTransform(1, 0, 0, 1, 0, 0); g.imageSmoothingEnabled = false; g.drawImage(B, 0, 0);
      if (!kind) return;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const dx = M.dx - clip.x, dy = M.dy - clip.y;
      const frame = { img: Y, sx: 0, sy: 0, sw: Y.width, sh: Y.height, dx, dy, dw: M.w, dh: M.h };
      const o = { k: M.w / 112, X: dx + M.w / 2, feet: dy + M.h * 0.93, frame, face: M.you.face || 'S', t, beat: 500, size: 'map' };
      BOHEMIA_AURA.draw(kind, 'behind', g, o);
      g.imageSmoothingEnabled = false; g.drawImage(Y, dx, dy, M.w, M.h);   /* his body, where the map put it */
      BOHEMIA_AURA.draw(kind, 'front', g, o);
    };
    await new Promise(r => setTimeout(r, 400));   /* the current's sheet loads on its first draw */
    window.__mapFrame('current', 5); await new Promise(r => setTimeout(r, 400));
  }, { bg, body: M.body, M, clip, W, H });
  const per = 500 / 6, sc = { x: 0, y: 0, width: W, height: H };
  for (const kind of KINDS) for (let s = 0; s < 48; s++) {
    await q.evaluate(([k, t]) => window.__mapFrame(k, t), [kind, s * per + per / 2]);
    await q.screenshot({ path: path.join(out, 'map_' + kind + '_' + String(s).padStart(2, '0') + '.png'), clip: sc });
  }
  await q.evaluate(() => window.__mapFrame('', 0));
  await q.screenshot({ path: path.join(out, 'map_none_00.png'), clip: sc });
  const res = { map: true, you: M.you, canvasAt: M.canvasAt, box: [M.dx, M.dy, M.w, M.h], clip, errs: d.errs.concat(v.errs) };
  fs.writeFileSync(path.join(out, 'film_map.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res));
  await v.close();
}

async function sprites() {
  const v = await open({ file: 'vote/ANIMATION_THE_AURA.html', bare: true, profile: 'phone_portrait' });
  const q = v.page; await q.waitForTimeout(1500);
  const got = await q.evaluate(async () => {
    const E = window.AURA_EIGHT, A = window.BOHEMIA_AURA, man = new Image(); man.src = E.src; await man.decode();
    const out = {}, cw = E.cell[0], ch = E.cell[1], W = 100, H = 150, X = 50, FEET = 130;
    for (const k of ['echo', 'current']) for (const f of E.facings) {
      const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
      const i = E.facings.indexOf(f), org = E.origin[f];
      const frame = { img: man, sx: i * cw, sy: 0, sw: cw, sh: ch, dx: X - org[0], dy: FEET - org[1], dw: cw, dh: ch };
      const o = { k: 1, X, feet: FEET, frame, face: f, t: 40, beat: 500, size: 'fight' };
      A.draw(k, 'behind', g, o); g.drawImage(man, i * cw, 0, cw, ch, frame.dx, frame.dy, cw, ch); A.draw(k, 'front', g, o);
      out[k + '_' + f] = c.toDataURL('image/png');
    }
    return out;
  });
  const dir = path.join(ROOT, 'records/target/master_rig/aura_current');
  for (const [n, u] of Object.entries(got)) fs.writeFileSync(path.join(dir, 'aura_' + n + '.png'), Buffer.from(u.split(',')[1], 'base64'));
  console.log(JSON.stringify(Object.keys(got).map(n => 'records/target/master_rig/aura_current/aura_' + n + '.png')));
  await v.close();
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  if (mode === 'map') return map();
  if (mode === 'sprites') return sprites();
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, profile: 'phone_portrait', arm: 'window.FIGHT_OPTS={seed:' + Number(seed) + ',speed:1,kind:"suburb"}' });
  const p = d.page; const t0 = Date.now();
  while (Date.now() - t0 < 60000) { if (await p.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && document.getElementById('load').style.display === 'none' || (typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && getComputedStyle(document.getElementById('load')).display === 'none'))) break; await p.waitForTimeout(250); }
  await p.waitForTimeout(1500);
  for (const s of ['vote/ANIMATION_THE_AURA.js', 'vote/ANIMATION_THE_AURA_CURRENT_TABLE.js', 'vote/ANIMATION_THE_AURA_HOOK.js'])
    if (fs.existsSync(path.join(ROOT, 'slices', s))) await p.addScriptTag({ url: s });
  const hooked = await p.evaluate(() => {
    if (window.AURA_CURRENT) window.AURA_CURRENT.src = 'vote/ANIMATION_THE_AURA_CURRENT.webp';
    window.__AURA_KIND = ''; window.__AURA_T = null;
    return BOHEMIA_AURA_HOOK(window, () => window.__AURA_KIND, () => window.__AURA_T !== null ? window.__AURA_T : performance.now() - FIGHT_UI.t0);
  });
  if (!hooked) throw new Error('the hook did not take: blitMan is not on the fight window');
  /* FIGHT, pressed: the line he was dealt; then wait for a turn of his with nothing moving and the camera still */
  await p.evaluate(() => fightNow());
  const t1 = Date.now(); let ready = null;
  while (Date.now() - t1 < 60000) {
    ready = await p.evaluate(() => { const u = FIGHT.current(); return !FIGHT.S.deploy && u && crewControlled(u) && !FIGHT_UI.anim.length && !FIGHT_UI.glide ? { id: u.id, look: u.look } : null; });
    if (ready) break; await p.waitForTimeout(200);
  }
  if (!ready) throw new Error('no turn of his came up in a minute');
  await p.waitForTimeout(1200);
  const raf = () => p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const res = { seed: Number(seed), man: ready, kinds: {} };
  for (const kind of KINDS) {
    await p.evaluate(k => { window.__AURA_KIND = k; }, kind);
    await p.evaluate(() => { window.__AURA_T = 10; }); await raf();
    const L = await p.evaluate(() => window.__auraLast);
    if (!L || L.kind !== kind) throw new Error('the aura did not draw for ' + kind);
    /* the crop: his body in the middle (in a packed line the man in front hides his feet, so the middle of his height, not
       his feet, is what centres him) */
    const clip = { x: Math.round(L.X - CROP.w / 2), y: Math.round(L.feet - L.h * 0.55 - CROP.h / 2), width: CROP.w, height: CROP.h };
    const slots = mode === 'clips' ? [...Array(48).keys()] : [0, 2, 4, 6, 12, 18];
    const per = 500 / 6;
    for (const s of slots) {
      await p.evaluate(t => { window.__AURA_T = t; }, s * per + per / 2);
      await raf();
      await p.screenshot({ path: path.join(out, kind + '_' + String(s).padStart(2, '0') + '.png'), clip });
      if (s === 0) await p.screenshot({ path: path.join(out, kind + '_full.png') });
    }
    res.kinds[kind] = { clip, face: L.face, k: L.k, h: L.h };
  }
  await p.evaluate(() => { window.__AURA_KIND = ''; }); await raf();
  await p.screenshot({ path: path.join(out, 'none_full.png') });
  const L0 = res.kinds.echo.clip; await p.screenshot({ path: path.join(out, 'none_00.png'), clip: L0 });
  res.errs = d.errs;
  fs.writeFileSync(path.join(out, 'film.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res));
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
