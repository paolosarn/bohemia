/* ============================================================================
   THE WALK BACK ASKS (FIXES 2 11/17, ask row 592; rule 413, Paolo 11/6: 'I should be fully able to get away'; RUN SIX's law
   under it: 'only his own walk aimed at them brings them back, and that asks (the meet card)').

   FOUND under the red THE ROSTER SCALES THE ENEMY (S4, 'card: null / null'): the checker read the record of the LAST meet, and
   under that was the game: a job taken, its crew met, FALL BACK, a walk off and a walk back to the job's own place, and NO CARD
   CAME. The walk's last step cleared TRAVEL before its arrival was handed over, so the hold never saw the walk as aimed at them
   (MEET_BACK.held 0 -> 1): a job he fell back from once could never be fought.

   On the game itself through the one driver, a finger on the glass:
     W1 a job taken off a town's board; the walk to its place: its crew's card stands, for that job
     W2 FALL BACK by a hand: no fight, the card down, he stands off them
     W3 six blocks off, then a tap on the job's own place: the walk back ends beside them and THE CARD ASKS AGAIN, the same job
     W4 FALL BACK again, back beside them, a touch on the job where he stands: it asks again (the touch is aimed at it)
     W5 ENGAGE by a hand: the fight opens
     Z  nothing threw
   (A walk into a TOWN past a crew he fell back from is still aimed at nobody: RUN SEVEN's own gates hold that, rule 413(j).)
   --plant: the walk's aim is not kept at the arrival (the game before this): W3 must go red (no card).

   node gates/the_walk_back_asks_gate.js                       the demo upright, the alpha on its side, and the plant
   node gates/the_walk_back_asks_gate.js phone_landscape:alpha  one way (profile[:alpha]); add --plant for the plant alone
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + String(w).slice(0, 500) + ']' : '')); return c; };

async function run(profile, alpha, plant) {
  const name = (alpha ? 'the alpha' : 'the demo') + ', ' + profile + (plant ? ', PLANTED' : '');
  console.log('\n-- ' + name + ' --');
  let d;
  try { d = await drive.open({ keepCards: true, profile, alpha: !!alpha, fog: true }); }   /* fog on: a new game as he gets it (a checker's default is the fog off, which leaves the alpha's map without its start) */ catch (e) { ok(name + ': the game boots', false, String(e.message).slice(0, 160)); return; }
  const page = d.page, errs = [];
  /* the map's frame, asked for at every call (the alpha can load its map frame again under a checker: BOSSES' gates, measured 11/10) */
  const cur = () => (d.fr && !d.fr.isDetached()) ? d.fr : (page.frames().find(f => f.parentFrame() === page.mainFrame() && /BOHEMIA_CITY_WORLD/.test(f.url())) || d.fr);   /* the driver's own map frame; if the page loaded it again, the shell's own child (the alpha holds other copies of the map's page inside its tabs) */
  const fr = { evaluate: (...a) => cur().evaluate(...a), $: (...a) => cur().$(...a), waitForFunction: (...a) => cur().waitForFunction(...a) };
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const TOUCH = profile !== 'computer';
  const tapAt = async (x, y) => { if (TOUCH) return d.tapAt(x, y); const h = await page.$('#cityFrame'), fb = h ? await h.boundingBox() : null; if (!fb) return null; return page.mouse.click(fb.x + x, fb.y + y); };
  const waitFor = async (fn, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await fn().catch(() => false)) return true; await page.waitForTimeout(300); } return false; };
  const meetWhy = () => fr.evaluate(() => { try { return (MEET && MEET.up && MEET.up.msg && String(MEET.up.msg.why || '')) || ''; } catch (e) { return ''; } }).catch(() => '');
  const cardUp = () => fr.evaluate(() => { const c = document.getElementById('meetcard'); return !!(c && c.querySelector('[data-meet="go"]') && c.getBoundingClientRect().height > 20); }).catch(() => false);
  const settleOpen = () => fr.evaluate(() => !!(LOOP.frame && LOOP.frame.style.display === 'block' && LOOP.ready)).catch(() => false);
  const settleFrame = async () => { const fh = await fr.$('#settleFrame'); return fh ? fh.contentFrame() : null; };
  const leave = async () => { await fr.evaluate(() => { try { loopClose(); } catch (e) {} }); await page.waitForTimeout(700);
    /* the alpha comes out of a town in the close view: the pinch out is the game's own swapMode() (BOSSES' gates do the same) */
    if (await fr.evaluate(() => { try { if (MODE === 'human' && !INSIDE) { swapMode(); return true; } } catch (e) {} return false; }).catch(() => false)) await page.waitForTimeout(1500); };
  const meetPress = async (which) => {
    const b = await fr.evaluate((w) => { const e = document.querySelector('#meetcard [data-meet="' + w + '"]'); if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; }, which);
    if (b) await tapAt(b[0], b[1]); else await fr.evaluate((w) => { try { MEET_DONE(w === 'go'); } catch (e) {} }, which);
    await page.waitForTimeout(600);
    return !!b;
  };
  /* a tap on a block of the map (the finger's own way); off the glass, the map's own travelTo to the same block */
  const goCell = async (x, y) => {
    const p = await fr.evaluate(([x, y]) => { const r = document.getElementById('cv').getBoundingClientRect(); const q = __CITY.isoAt(x, y); return { x: r.left + q.sx, y: r.top + q.sy + TH / 2, on: mapOnGlass(x, y) }; }, [x, y]);
    if (p.on) { await tapAt(p.x, p.y); await page.waitForTimeout(200);
      const set = await fr.evaluate(([x, y]) => (TRAVEL && TRAVEL.to && Math.max(Math.abs(TRAVEL.to[0] - x), Math.abs(TRAVEL.to[1] - y)) <= 1) || !!LOOP.fighting || (window.MEET && !!MEET.up), [x, y]);
      if (set) return 'a tap'; }
    await fr.evaluate(([x, y]) => { travelStop(); travelTo(0, 0, [x, y]); }, [x, y]); return 'the map\'s own walk';
  };
  const here = () => fr.evaluate(() => [city.x | 0, city.y | 0]);
  const arrive = (ms) => waitFor(async () => await fr.evaluate(() => !TRAVEL || !!(MEET && MEET.up)), ms || 90000);
  /* any card that is not this job's (a roaming crew, a road card) is fallen back from, the way a stranger walking to a job would */
  let OUT = false;   /* the guard starts once he is out of the town with the job (nothing is touched while the town's sheet stands) */
  const guard = setInterval(() => { if (!OUT) return; fr.evaluate((al) => { try { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); } catch (e) {}
    try { const w = MEET.up && MEET.up.msg && String(MEET.up.msg.why || ''); if (w && !/^contract:/.test(w) && window.MEET_DONE) MEET_DONE(false); } catch (e) {}
    try { const rc = document.querySelector('#roadcard button[data-road]'); if (rc && !window.__GATE_RC) { window.__GATE_RC = 1; setTimeout(() => { try { rc.dispatchEvent(new PointerEvent('pointerup', { bubbles: true })); rc.click(); } catch (e) {} window.__GATE_RC = 0; }, 700); } } catch (e) {} }, alpha).catch(() => {}); }, 500);
  try {
    await page.waitForTimeout(2500);
    await fr.waitForFunction(() => window.BohemiaJobKinds && BohemiaJobKinds.ready(), null, { timeout: 30000 }).catch(() => {});
    if (plant) await fr.evaluate(() => { Object.defineProperty(window, '__WALK_ARRIVING', { get() { return null; }, set() {}, configurable: true }); });
    /* the start town's board (the game opens in a town); else the nearest town */
    for (let i = 0; i < 60 && !(await settleOpen()); i++) await page.waitForTimeout(500);
    if (!(await settleOpen())) {
      const t = await fr.evaluate(() => { const bs = ctBases() || {}; let best = null; for (const n in bs) { const b = bs[n], dd = Math.max(Math.abs(b.x - city.x), Math.abs(b.y - city.y)); if (!best || dd < best.d) best = { n, x: b.x, y: b.y, d: dd }; } return best ? Object.assign(best, { g: townDoor(best.x, best.y) }) : null; });
      if (t) { await goCell(t.g[0], t.g[1]); await waitFor(() => settleOpen(), 120000); }
    }
    const sf = await settleFrame();
    if (!sf || !(await settleOpen())) { ok(name + ' W1 a town\'s board is open', false, 'no town: ' + JSON.stringify({ sf: !!sf, open: await settleOpen(), st: await fr.evaluate(() => ({ mode: MODE, sf: (document.getElementById('settleFrame') || { style: {} }).style.display, ready: LOOP.ready, at: [city.x | 0, city.y | 0] })).catch(e => String(e.message).slice(0, 80)) })); return; }
    await sf.waitForFunction(() => window.BohemiaBoardShelf && BohemiaBoardShelf.ready(), null, { timeout: 20000 }).catch(() => {});
    /* the board's own 'Take it' message from the town's own window, the way the jobs' checkers take a job: a plain fight job */
    const job = await sf.evaluate(() => { const offers = BohemiaBoardShelf.shelf().offers, o = offers.filter(x => x.id === 'qd-s10')[0] || offers.filter(x => !/qd-a[r]/.test(x.id))[0]; if (!o) return null;
      const c = Object.assign({}, o, { says: String(o.says).replace(/\{pay\}/g, o.pay) }), S = BohemiaSettlement.state; S.held.push(o.id);
      window.parent.postMessage({ type: 'BOHEMIA_SETTLEMENT', act: 'contract', place: S.place.name, batteries: null, contract: c }, '*'); return { id: o.id, title: o.title }; });
    await page.waitForTimeout(900); await leave(); OUT = true;
    const tg = job ? await fr.evaluate((id) => { const h = LOOP.held.filter(x => x.id === id)[0]; return h && h.target ? [h.target.x, h.target.y] : null; }, job.id) : null;
    if (!tg) { ok(name + ' W1 a job taken off the board has its place', false, job ? job.title + ': no place' : 'no job'); return; }
    const mine = new RegExp('^contract:' + job.id + '(:|$)');
    const toThem = async () => { let how = ''; for (let k = 0; k < 4; k++) { how = await goCell(tg[0], tg[1]); await arrive(120000); await page.waitForTimeout(1200); if (mine.test(await meetWhy())) break; if (await fr.evaluate(([x, y]) => Math.max(Math.abs(city.x - x), Math.abs(city.y - y)) <= 1 && !TRAVEL, tg)) break; } return how; };

    /* W1 */
    await toThem();
    const w1 = { why: await meetWhy(), card: await cardUp(), at: await here() };
    if (!ok(name + ' W1 "' + job.title + '" taken off the board; the walk to its place: its crew\'s card stands', mine.test(w1.why) && w1.card, JSON.stringify(w1) + ' the place ' + tg.join(','))) return;
    /* W2 */
    await meetPress('back'); await page.waitForTimeout(1200);
    const w2 = { card: await cardUp(), fighting: await fr.evaluate(() => LOOP.fighting), at: await here(), back: await fr.evaluate(() => MEET_BACK.list.map(b => b.key + (b.away ? ' away' : '')).join(',')), fight: await page.evaluate(() => { try { return !!CITYFIGHT; } catch (e) { return false; } }) };
    ok(name + ' W2 FALL BACK by a hand: no fight, the card down, he stands off them (' + Math.max(Math.abs(w2.at[0] - tg[0]), Math.abs(w2.at[1] - tg[1])) + ' blocks)', !w2.card && !w2.fighting && !w2.fight && mine.test(w2.back.split(' ')[0] || ''), JSON.stringify(w2));
    /* W3 */
    const off = await fr.evaluate(([tx, ty]) => { for (let r = 6; r < 14; r++) for (const dd of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) { const x = tx + dd[0] * r, y = ty + dd[1] * r; try { if (cityWalkable(x, y) && !townSafeAt(x, y) && !loopTownAt(x, y, 2) && cityRoute(city.x | 0, city.y | 0, x, y)) return [x, y]; } catch (e) {} } return null; }, tg);
    if (off) { await goCell(off[0], off[1]); await arrive(120000); await page.waitForTimeout(900); }
    const far = await here(), held0 = await fr.evaluate(() => MEET_BACK.held | 0);
    const how = await toThem();
    const w3 = { why: await meetWhy(), card: await cardUp(), at: await here(), held: (await fr.evaluate(() => MEET_BACK.held | 0)) - held0, from: far };
    if (plant) { ok(name + ' W3 PLANTED (the walk\'s aim not kept at its arrival): the leg sees him arrive beside them and NO CARD (' + w3.held + ' refused by the hold)', !w3.card && !mine.test(w3.why) && Math.max(Math.abs(w3.at[0] - tg[0]), Math.abs(w3.at[1] - tg[1])) <= 1, JSON.stringify(w3)); return; }
    if (!ok(name + ' W3 ' + Math.max(Math.abs(far[0] - tg[0]), Math.abs(far[1] - tg[1])) + ' blocks off, then ' + how + ' on the job\'s own place: the walk back ends beside them and THE CARD ASKS AGAIN, the same job', mine.test(w3.why) && w3.card, JSON.stringify(w3))) return;
    /* W4 */
    await meetPress('back'); await page.waitForTimeout(1200);
    await fr.evaluate(([x, y]) => { travelStop(); travelTo(0, 0, [x, y]); }, tg); await arrive(60000); await page.waitForTimeout(900);
    if (mine.test(await meetWhy())) { await meetPress('back'); await page.waitForTimeout(1200); }   /* that walk asked too; fall back once more to stand beside them with no card */
    /* beside them (the fall back leaves him two blocks off): one block nearer on foot, then a touch on the job where he stands */
    const near = await fr.evaluate(([tx, ty]) => { const c = [city.x | 0, city.y | 0]; let best = null; for (const dd of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) { const x = tx + dd[0], y = ty + dd[1]; try { if (cityWalkable(x, y) && cityRoute(c[0], c[1], x, y)) { const k = Math.abs(x - c[0]) + Math.abs(y - c[1]); if (!best || k < best.k) best = { x, y, k }; } } catch (e) {} } return best; }, tg);
    let w4 = null;
    if (near) { const p0 = await here();
      /* stand on the job's own place without a card (the hold refuses a walk that is not aimed: MEET_BACK is asked by key), then touch it */
      await fr.evaluate(([x, y]) => { travelStop(); city.x = x; city.y = y; try { render(); } catch (e) {} }, tg); await page.waitForTimeout(600);
      const how4 = await goCell(tg[0], tg[1]); await page.waitForTimeout(1500);
      w4 = { why: await meetWhy(), card: await cardUp(), at: await here(), how: how4, from: p0 }; }
    if (!ok(name + ' W4 FALL BACK again; standing on the job\'s place, a touch on it: it asks again (the touch is aimed at it)', !!w4 && mine.test(w4.why) && w4.card, JSON.stringify(w4))) return;
    /* W5 */
    await meetPress('go');
    let ff = null; for (let i = 0; i < 160 && !ff; i++) { await page.waitForTimeout(250); const h = await page.$('#fightFrame'); if (h) { const x = await h.contentFrame(); if (x && await x.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) ff = x; } }
    const them = ff ? await ff.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them').length) : 0;
    ok(name + ' W5 ENGAGE by a hand: the fight opens (' + them + ' of theirs on the board)', !!ff && them > 0);
    ok(name + ' Z nothing threw', !errs.length, errs.slice(0, 2).join(' | ') || 'none');
  } catch (e) { ok(name + ' ran to the end', false, String(e && e.stack || e).slice(0, 300)); }
  finally { clearInterval(guard); await d.close().catch(() => {}); }
}

(async () => {
  const a = process.argv.slice(2).filter(x => !/^--/.test(x)), PLANT = process.argv.includes('--plant');
  if (a.length) { const [prof, al] = a[0].split(':'); await run(prof, al === 'alpha', PLANT); }
  else { await run('phone_portrait', false, false); await run('phone_landscape', true, false); await run('phone_portrait', false, true); }
  console.log('\nTHE WALK BACK ASKS: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
