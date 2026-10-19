/* ANIMATION [the aura of the one you control], 10/19: FILMS THE THREE CANDIDATES ON THE REAL FIGHT FROM THE GAME'S CAMERA.
   The fight (slices/BOHEMIA_FIGHT.html) opens on his phone profile through the one driver, the line is set and FIGHT is
   pressed the way he presses it, and when the turn is a man of his the aura is laid on him by the hook (the fight's file is
   not touched: slices/vote/ANIMATION_THE_AURA_HOOK.js wraps its blitMan from outside). The camera is the game's own, at the
   zoom the game chose; nothing is moved or zoomed for the film. The beat clock is driven slot by slot (six a beat at 120),
   so every held pose is caught exactly once: a clip is two bars, 48 pictures, each shown a twelfth of a second.
     node tools/bohemia_animation_the_aura_film.js <out dir> [stills|clips] [seed]
   stills: three slots of each candidate, full screen and cropped, to look at. clips: the 48 crops of each candidate as PNGs
   (tools/bohemia_animation_the_aura_bake.py turns them into the VOTE page's clips) plus one full screen a candidate. */
const fs = require('fs'), path = require('path'); const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const [out, mode = 'stills', seed = '5'] = process.argv.slice(2);
const KINDS = ['echo', 'tear', 'current'];
const CROP = { w: 118, h: 172 };   /* css px: three side by side on a 390 phone, one art pixel to one phone pixel */

(async () => {
  fs.mkdirSync(out, { recursive: true });
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
