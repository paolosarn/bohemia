/* ============================================================================
   THE FIGHT STEPS GATE  (SOUNDS, row [the step in the fight], 10/18/26)

   The fight's step was one 70 Hz triangle beep for every man on every tile (SND.step in
   slices/BOHEMIA_FIGHT.html). These are the map's real shoes (CC0 Freesound walks via ESC-50), one
   cut per tile a man crosses, laid by the fight's own move, the floor named by the tile's own
   picture (slices/vote/travel_steps/fight_floors.json). This proves:
     - the floor table is the pictures (the tool re-derives it and it matches), it covers every
       block of the fight ground five by five, a kit-plan road tile is asphalt and a casino tile carpet,
       and every floor it names has a sprite, a manifest entry, a cut count and CC0 sources
     - the engine plays the fight at the map's own level, and unjudged is silent: the fight keeps its
       beep and the alpha loads no fight step until his YES
     - in a real browser, on the VOTE page over the real fight: the carpet's cuts decode in their slots;
       the street fight plays itself and every tile a man crosses is one step, on the floor the table
       gives that tile (re-read here from the deal, not from the engine), both floors heard, never the
       same cut twice in a row on one ground, a man's new step cuts his last one short; the casino is
       all carpet; WHAT PLAYS NOW plays the beep and no shoe; STOP stops; nothing throws
   Run: node gates/fight_steps_gate.js
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawnSync } = require('child_process');
const ROOT = path.dirname(__dirname);
const PORT = 8884;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.mp3': 'audio/mpeg', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.txt': 'text/plain' };
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x ? '  [' + x + ']' : '')); };

const DIR = path.join(ROOT, 'slices/vote/travel_steps');
const PAGE = 'slices/BOHEMIA_THE_STEP_IN_THE_FIGHT_10_18_26.html';
const ID = 'sounds-the-step-in-the-fight-10-18';

const srv = http.createServer((rq, rs) => {
  const rel = decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, '');
  const f = path.join(ROOT, rel);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end('no'); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream');
  fs.createReadStream(f).pipe(rs);
});

(async () => {
  /* ---- the floor table is the pictures ---- */
  const chk = spawnSync('python3', [path.join(ROOT, 'tools/bohemia_sounds_fight_floors.py'), '--check'], { encoding: 'utf8' });
  ok('the floor table is the pictures: the tool re-derives it and it matches', chk.status === 0, (chk.stdout || chk.stderr || '').trim().split('\n').pop());
  const T = JSON.parse(fs.readFileSync(path.join(DIR, 'fight_floors.json'), 'utf8'));
  const G = JSON.parse(fs.readFileSync(path.join(ROOT, 'slices/fight_ground/fight_ground.json'), 'utf8'));
  const bt = G.block_tiles;
  const names = Object.keys(G.blocks);
  ok('every block of the fight ground has a floor, five tiles by five', T.block_tiles === bt && names.every(n => T.blocks[n] && T.blocks[n].floor.length === bt && T.blocks[n].floor.every(r => r.length === bt)), names.length + ' blocks');
  let roads = 0, roadsOk = 0, casino = 0, casinoOk = 0;
  for (const n of names) {
    const plan = G.blocks[n].kit_plan || {};
    for (const k of Object.keys(plan)) { const [r, c] = k.split(',').map(Number); roads++; if (T.blocks[n].floor[r][c] === 'asphalt') roadsOk++; }
    if (/^casino\./.test(n)) T.blocks[n].floor.forEach(r => r.forEach(f => { casino++; if (f === 'carpet') casinoOk++; }));
  }
  ok('  every road piece COMBAT TWO laid is asphalt', roads > 0 && roadsOk === roads, roadsOk + '/' + roads);
  ok('  the casino is carpet wall to wall', casino > 0 && casinoOk === casino, casinoOk + '/' + casino);
  const man = JSON.parse(fs.readFileSync(path.join(DIR, 'manifest.json'), 'utf8'));
  const lic = fs.readFileSync(path.join(ROOT, 'reference/library/sound_bank/esc50_cc0/LICENCES.md'), 'utf8');
  global.window = undefined;
  require(path.join(ROOT, 'engine/bohemia_travel_steps.js'));
  const NUM = globalThis.BOH_TRAVEL_STEPS.NUM;
  for (const f of T.surfaces) {
    const d = man.surfaces[f] || {};
    const file = path.join(DIR, 'steps_' + f + '.mp3');
    ok(f + ': a sprite, a manifest entry and a cut count the engine knows', fs.existsSync(file) && fs.statSync(file).size < 150000 && (d.slots || []).length === NUM.N[f] && !!NUM.CUT[f], (d.slots || []).length + ' cuts, engine ' + NUM.N[f]);
    ok('  every cut in its own slot, no longer than the engine plays', (d.slots || []).every((s, k) => Math.abs(s.offset - (k * NUM.SLOT + NUM.LEAD)) < 0.002 && s.seconds <= NUM.CUT[f] + 0.001));
    ok('  every source CC0, in the bank\'s licence file, and no sand in it', (d.sources || []).length >= 1 && d.sources.every(s => s.licence === 'CC0' && lic.includes('| ' + s.stem + ' |') && fs.existsSync(path.join(ROOT, 'reference/library/sound_bank/esc50_cc0', s.stem + '.flac')) && !/sand|beach/i.test(s.source)));
  }
  ok('the carpet is a real carpet walk', /carpet/i.test(((man.surfaces.carpet || {}).sources || []).map(s => s.source).join(' ')));
  ok('the fight plays at the map\'s own level, a choke under a tenth of a cut', NUM.FIGHT && NUM.FIGHT.REL === NUM.REL && NUM.FIGHT.CHOKE > 0 && NUM.FIGHT.CHOKE < 0.022);

  /* ---- unjudged is silent ---- */
  const fight = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8');
  const alpha = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/BOHEMIA_VOTE_REGISTRY.json'), 'utf8'));
  const item = (reg.items || []).find(i => i.id === ID);
  const yes = (reg.verdicts || []).some(v => v.id === ID && /^(up|yes|star)$/i.test(String(v.vote)));
  const wired = /bohemia_travel_steps\.js|fight_step_/.test(fight) || /fight_step_/.test(alpha);
  ok('unjudged is silent: the fight keeps its own step until his YES', !wired || yes, wired ? (yes ? 'wired after his YES' : 'WIRED WITHOUT A YES') : 'not wired, the fight beeps');
  ok('  the beep this page plays as WHAT PLAYS NOW is the fight\'s own call', /step: function \(\) \{ tone\(70, 0\.05, 0\.05, 'triangle'\); \}/.test(fight) || yes);
  ok('the VOTE item is registered and shows this page', !!item && item.show && item.show.src === path.basename(PAGE) && item.draft === true && item.lane === 'sounds');

  /* ---- the real page in a real browser ---- */
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  let chromium;
  try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [], bad = [];
  p.on('pageerror', e => errs.push(String(e.message)));
  p.on('response', r => { if (r.status() >= 400 && /travel_steps|fight_ground|engine\/|BOHEMIA_FIGHT/.test(r.url())) bad.push(r.url()); });
  await p.goto('http://127.0.0.1:' + PORT + '/' + PAGE, { waitUntil: 'load' });

  /* the carpet's cuts decode and sit in their slots */
  const cuts = await p.evaluate(async () => {
    const AC = new (window.AudioContext || window.webkitAudioContext)(), N = BOH_TRAVEL_STEPS.NUM;
    const buf = await AC.decodeAudioData(await (await fetch('vote/travel_steps/steps_carpet.mp3')).arrayBuffer());
    const d = buf.getChannelData(0), sr = buf.sampleRate, out = [];
    const db = (a, z) => { let m = 0; for (let i = Math.max(0, Math.round(a * sr)); i < Math.min(d.length, Math.round(z * sr)); i++) m = Math.max(m, Math.abs(d[i])); return 20 * Math.log10(m + 1e-9); };
    for (let k = 0; k < N.N.carpet; k++) { const at = k * N.SLOT + N.LEAD; out.push({ pre: +db(k * N.SLOT + 0.002, at - 0.008).toFixed(1), hit: +db(at - 0.004, at + 0.06).toFixed(1), after: +db(at + N.CUT.carpet + 0.02, (k + 1) * N.SLOT - 0.002).toFixed(1) }); }
    return { seconds: buf.duration, slots: out };
  });
  ok('CARPET: the sprite decodes, five slots', cuts.seconds >= 2.45 && cuts.seconds < 2.7, cuts.seconds.toFixed(3) + ' s');
  ok('  every cut starts at its slot: silence before, a hit in its first 60 ms, silence after', cuts.slots.every(x => x.pre < -45 && x.hit > -20 && x.after < -45), JSON.stringify(cuts.slots));

  /* the fight is on the glass before a tap, hooked, silent */
  await p.waitForFunction(() => window.__fightSteps && window.__fightSteps().hooked, null, { timeout: 30000 }).catch(() => {});
  const idle = await p.evaluate(() => window.__fightSteps());
  ok('the real fight loads in the page and its own step is heard by the page', idle.hooked && idle.floors, JSON.stringify({ hooked: idle.hooked, floors: idle.floors }));
  ok('  before a tap nothing plays', idle.mode === null && idle.log.length === 0);

  /* STREET: the same fight, three times as fast, for twelve seconds */
  const run = async (id, ms) => {
    await p.evaluate(i => window.__go(i, { speed: 3 }), id);
    await p.waitForFunction(() => window.__fightSteps().hooked, null, { timeout: 30000 }).catch(() => {});
    await p.waitForTimeout(ms);
    return p.evaluate(() => { const r = window.__fightSteps(); const cw = document.getElementById('fight').contentWindow;
      const S = cw.eval('FIGHT.S'); return Object.assign(r, { blocks: S.boardDef.blocks, crop: S.crop || null, board: S.board }); });
  };
  const st = await run('street', 12000);
  const recorded = st.log.filter(x => !x.dropped);
  ok('STREET: every tile a man crosses is one step', st.seen >= 10 && recorded.length === st.seen && st.where.length === st.seen, st.seen + ' tiles crossed, ' + recorded.length + ' steps, ' + st.log.filter(x => x.dropped).length + ' dropped');
  const floorOf = (x, y) => { const c = st.crop || { ox: 0, oy: 0 }, gx = x + (c.ox || 0), gy = y + (c.oy || 0); const n = st.blocks[Math.floor(gy / bt)][Math.floor(gx / bt)]; return T.blocks[n].floor[gy % bt][gx % bt]; };
  const wrong = st.where.filter(w => floorOf(w.x, w.y) !== w.floor);
  ok('  every step is on the floor its tile is drawn with', st.where.length && wrong.length === 0, wrong.length ? JSON.stringify(wrong.slice(0, 3)) : st.board);
  ok('  the road and the gravel are both heard', st.heard.asphalt > 0 && st.heard.dirt > 0 && st.heard.carpet === 0, JSON.stringify(st.heard));
  const rep = (log, f) => { const k = log.filter(x => x.surface === f).map(x => x.cut); return k.some((c, i) => i && k[i - 1] === c); };
  ok('  never the same cut twice in a row on one ground', !rep(recorded, 'asphalt') && !rep(recorded, 'dirt'));
  const byWho = {}; recorded.forEach(x => (byWho[x.who] = byWho[x.who] || []).push(x));
  const overlaps = Object.values(byWho).reduce((t, l) => t + l.filter((x, i) => i && x.at < l[i - 1].at + NUM.CUT[l[i - 1].surface] && !x.choked).length, 0);
  const choked = recorded.filter(x => x.choked).length;
  ok('  a man\'s new step cuts his last one short, never two of his at once', overlaps === 0 && choked > 0, choked + ' choked, ' + overlaps + ' overlaps');

  /* CASINO: the named casino board, all carpet */
  const cs = await run('casino', 9000);
  const crec = cs.log.filter(x => !x.dropped);
  ok('CASINO: the carpet board plays carpet steps and nothing else', cs.seen >= 5 && crec.length === cs.seen && cs.heard.carpet === cs.seen && cs.heard.asphalt + cs.heard.dirt === 0, JSON.stringify(cs.heard) + ' of ' + cs.seen);
  ok('  never the same carpet cut twice in a row', !rep(crec, 'carpet'));

  /* WHAT PLAYS NOW: the beep, no shoe */
  const nw = await run('now', 7000);
  ok('WHAT PLAYS NOW: the fight\'s beep, one a tile, and no real shoe', nw.seen >= 3 && nw.heard.beep === nw.seen && nw.log.length === 0, nw.heard.beep + ' beeps of ' + nw.seen);

  await p.tap('#stop');
  await p.waitForTimeout(400);
  const stp = await p.evaluate(() => ({ text: document.getElementById('num').textContent, src: document.getElementById('fight').getAttribute('src'), mode: window.__fightSteps().mode }));
  ok('STOP: the fight goes and it is silent', stp.text === 'Stopped.' && stp.src === 'about:blank' && stp.mode === null);

  /* the bar fits a 390 px phone: four buttons in two rows, none off the glass */
  const fit = await p.evaluate(() => [...document.querySelectorAll('#bar button')].map(x => { const r = x.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right), Math.round(r.top)]; }));
  ok('the four buttons fit the phone in two rows', fit.length === 4 && fit.every(r => r[0] >= 0 && r[1] <= 390) && new Set(fit.map(r => r[2])).size === 2, JSON.stringify(fit));
  ok('every file the page asked for was there', bad.length === 0, bad.slice(0, 3).join(' '));
  ok('nothing threw', errs.length === 0, errs.slice(0, 3).join(' | '));

  await b.close(); srv.close();
  console.log('\nFIGHT STEPS GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.log('  FAIL the gate itself threw: ' + e.message); try { srv.close(); } catch (_e) {} process.exit(1); });
