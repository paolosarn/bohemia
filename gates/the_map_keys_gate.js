#!/usr/bin/env node
/* THE MAP'S KEYS (UI [the PC playtest: the UI's part] (1), rule 164 item 1, Paolo 10/24 on his PC: 'find out all the keyboard
   button clicks that were on Battle Brothers and do pretty much the exact same for Bohemia'). The keys are Battle Brothers'
   own (the wiki's Keyboard Shortcuts page through Grok ask 105, PASSED FILTER), answered by slices/bohemia_ui_materials.js
   __BATTLE_BROTHERS_KEYS__ in every frame. Legs, on the demo, the computer profile (1440 x 900), real key presses
   (Playwright's keyboard, the focus where a player's would be):
   K1  THE TITLE: Enter on a fresh phone presses NEW GAME (the title goes);
   K2  the map, focus in the map: D held moves the camera (the pan moves, the camera lets go of the crew, the glass changes);
   K3  Shift takes the camera back to the crew; Page Down zooms out, Page Up zooms back in;
   K4  C opens the company over the map; Tab picks the next man; Escape closes it (the crew door gone);
   K5  I opens it again, and I closes it;
   K6  F shows the parties' tracks, F again hides them (151(f) keeps them off until asked);
   K7  F5 saves now (the save's own beat says key:F5) and the bar's day tag says SAVED;
   K8  Escape with nothing open opens the settings, and Escape closes them again (pressed in the map, the card is the shell's);
   K9  THE SAME KEYS FROM THE SHELL: with the focus on the shell's own page, A held still moves the map (handed down);
   K10 A TOWN: opened, Escape leaves it (LEAVE, the town's frame gone), and C inside a town opens the company;
   K11 the page threw nothing.
   Run: node gates/the_map_keys_gate.js */
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = (d) => { console.log('=== THE MAP\'S KEYS GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  let title = null;
  const d = await open({ profile: 'computer', beforeTap: async (page) => {
    /* K1: the title, a fresh phone: Enter is NEW GAME */
    const t0 = Date.now();
    while (Date.now() - t0 < 90000) {
      const up = await page.evaluate(() => { const m = document.querySelector('.bm-start [data-k=new]'); if (!(window.BOH_TITLE && BOH_TITLE.up && BOH_TITLE.up()) || !m) return false;
        return getComputedStyle(m.parentElement).visibility !== 'hidden'; }).catch(() => false);
      if (up) break; await page.waitForTimeout(300); }
    const before = await page.evaluate(() => !!(window.BOH_TITLE && BOH_TITLE.up && BOH_TITLE.up())).catch(() => false);
    await page.keyboard.press('Enter'); await page.waitForTimeout(800);
    const after = await page.evaluate(() => !!(window.BOH_TITLE && BOH_TITLE.up && BOH_TITLE.up())).catch(() => true);
    title = { before, after, log: await page.evaluate(() => (window.__KEYS && __KEYS.log || []).map(l => l.what)).catch(() => []) };
  } });
  const p = d.page, fr = d.fr;
  leg(title && title.before && !title.after && title.log.indexOf('title: new') >= 0, 'K1  THE TITLE: ENTER ON A FRESH PHONE PRESSES NEW GAME', JSON.stringify(title));
  await p.waitForTimeout(1500);
  try { await d.clearCards(); } catch (_e) {}
  const S = () => fr.evaluate(() => ({ panX, panY, z: CZOOM, on: CAMF.on, prints: !!window.MAP_PRINTS_SHOWN, crew: !!document.getElementById('crewdoor'),
    town: !!(LOOP.frame && LOOP.frame.style.display === 'block'), save: window.__SAVE_LAST ? __SAVE_LAST.why : null,
    set: (function () { const w = parent.document.getElementById('setwrap'); return !!(w && w.classList.contains('on')); })(),
    day: (function () { const e = document.querySelector('#bmtb [data-tb=day] b'); return e ? e.textContent : null; })() }));
  const pix = () => fr.evaluate(() => { const c = document.getElementById('cv'), g = c.getContext('2d'); const a = g.getImageData(0, 0, c.width, c.height).data; let h = 0; for (let i = 0; i < a.length; i += 997) h = (h * 31 + a[i]) | 0; return h; });
  const focusMap = () => fr.focus('#bmtb .t.gear').catch(() => fr.evaluate(() => window.focus()));
  /* K2 */
  await focusMap();
  const s0 = await S(), h0 = await pix();
  await p.keyboard.down('d'); await p.waitForTimeout(500); await p.keyboard.up('d'); await p.waitForTimeout(300);
  const s1 = await S(), h1 = await pix();
  leg(s0.on && !s1.on && s1.panX < s0.panX - 50 && h1 !== h0, 'K2  D HELD MOVES THE CAMERA (THE PAN, THE CREW LET GO, THE GLASS)', 'panX ' + Math.round(s0.panX) + ' -> ' + Math.round(s1.panX) + ', follow ' + s0.on + ' -> ' + s1.on + ', glass ' + (h1 !== h0 ? 'changed' : 'SAME'));
  /* K3 */
  await p.keyboard.press('Shift'); await p.waitForTimeout(700);
  const s2 = await S();
  await p.keyboard.press('PageDown'); await p.waitForTimeout(250); await p.keyboard.press('PageDown'); await p.waitForTimeout(400);
  const s3 = await S();
  await p.keyboard.press('PageUp'); await p.waitForTimeout(400);
  const s4 = await S();
  leg(s2.on && s3.z < s2.z * 0.9 && s4.z > s3.z * 1.05, 'K3  SHIFT TAKES THE CAMERA BACK TO THE CREW; PAGE DOWN ZOOMS OUT, PAGE UP IN', 'follow ' + s2.on + ', zoom ' + s2.z.toFixed(3) + ' -> ' + s3.z.toFixed(3) + ' -> ' + s4.z.toFixed(3));
  /* K4 */
  await p.keyboard.press('c'); await p.waitForTimeout(2500);
  const s5 = await S();
  const rf = s5.crew ? await (await fr.waitForSelector('#crewdoor iframe')).contentFrame() : null;
  if (rf) await rf.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.crew.length > 0, null, { timeout: 20000 }).catch(() => {});
  const sel0 = rf ? await rf.evaluate(() => ({ sel: BohemiaRosterScreen.state.sel, men: document.querySelectorAll('.cell[data-man]').length })) : null;
  await p.keyboard.press('Tab'); await p.waitForTimeout(400);
  const sel1 = rf ? await rf.evaluate(() => BohemiaRosterScreen.state.sel) : null;
  await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  const s6 = await S();
  leg(s5.crew && sel0 && (sel0.men < 2 || sel1 !== sel0.sel) && !s6.crew, 'K4  C OPENS THE COMPANY, TAB THE NEXT MAN, ESCAPE CLOSES IT', 'open ' + s5.crew + ', man ' + (sel0 && sel0.sel) + ' -> ' + sel1 + ' of ' + (sel0 && sel0.men) + ', closed ' + !s6.crew);
  /* K5 */
  await focusMap(); await p.keyboard.press('i'); await p.waitForTimeout(2000);
  const s7 = await S(); await p.keyboard.press('i'); await p.waitForTimeout(800); const s8 = await S();
  leg(s7.crew && !s8.crew, 'K5  I OPENS THE COMPANY AND I CLOSES IT', s7.crew + ' -> ' + s8.crew);
  /* K6 */
  await focusMap(); await p.keyboard.press('f'); await p.waitForTimeout(200); const s9 = await S(); await p.keyboard.press('f'); await p.waitForTimeout(200); const s10 = await S();
  leg(!s0.prints && s9.prints && !s10.prints, 'K6  F SHOWS THE TRACKS AND F HIDES THEM (OFF UNTIL ASKED)', s0.prints + ' -> ' + s9.prints + ' -> ' + s10.prints);
  /* K7 */
  await p.keyboard.press('F5'); await p.waitForTimeout(600); const s11 = await S();
  leg(s11.save === 'key:F5' && s11.day === 'SAVED', 'K7  F5 SAVES NOW AND THE BAR SAYS SAVED', 'save ' + s11.save + ', the tag "' + s11.day + '"');
  /* K8 */
  await p.waitForTimeout(1600); await focusMap(); await p.keyboard.press('Escape'); await p.waitForTimeout(800); const s12 = await S();
  await p.keyboard.press('Escape'); await p.waitForTimeout(800); const s13 = await S();
  leg(!s11.set && s12.set && !s13.set, 'K8  ESCAPE WITH NOTHING OPEN OPENS THE SETTINGS, ESCAPE CLOSES THEM', s11.set + ' -> ' + s12.set + ' -> ' + s13.set);
  /* K9 */
  await fr.evaluate(() => { camHold(); render(); }); await p.waitForTimeout(700);
  await p.evaluate(() => { try { document.activeElement && document.activeElement.blur(); } catch (_e) {} });
  const shellFocus = await p.evaluate(() => document.hasFocus() && (!document.activeElement || document.activeElement.tagName !== 'IFRAME'));
  const s14 = await S(); await p.keyboard.down('a'); await p.waitForTimeout(500); await p.keyboard.up('a'); await p.waitForTimeout(300); const s15 = await S();
  leg(shellFocus && s15.panX > s14.panX + 50, 'K9  WITH THE FOCUS ON THE SHELL, A HELD STILL MOVES THE MAP (HANDED DOWN)', 'shell focus ' + shellFocus + ', panX ' + Math.round(s14.panX) + ' -> ' + Math.round(s15.panX));
  /* K10 */
  const town = await fr.evaluate(() => { const bs = ctBases(); let best = null; for (const n in bs) { if (bs[n]) { best = { name: n, x: bs[n].x | 0, y: bs[n].y | 0, tier: mapTierOf(n) }; break; } } if (best) loopOpenTown(best); return best && best.name; });
  await p.waitForTimeout(3500);
  const sf = await (await fr.waitForSelector('#settleFrame')).contentFrame();
  await sf.waitForFunction(() => document.getElementById('leave') && document.getElementById('crew'), null, { timeout: 30000 }).catch(() => {});
  await p.waitForTimeout(2500);
  const s16 = await S();
  await sf.focus('#leave').catch(() => {});
  await sf.evaluate(() => document.activeElement && document.activeElement.blur && document.activeElement.blur()).catch(() => {});
  await p.keyboard.press('c'); await p.waitForTimeout(2500);
  const crewInTown = await sf.evaluate(() => !!document.getElementById('crewdoor')).catch(() => false);
  await p.keyboard.press('Escape'); await p.waitForTimeout(900);
  const crewGone = await sf.evaluate(() => !document.getElementById('crewdoor')).catch(() => false);
  await p.keyboard.press('Escape'); await p.waitForTimeout(900);
  const s17 = await S();
  leg(s16.town && crewInTown && crewGone && !s17.town, 'K10 A TOWN: C OPENS THE COMPANY INSIDE IT, ESCAPE CLOSES THAT, ESCAPE AGAIN LEAVES THE TOWN', 'town ' + town + ' open ' + s16.town + ', crew ' + crewInTown + ', crew shut ' + crewGone + ', left ' + !s17.town);
  const errs = d.errs.filter(e => !/ResizeObserver/.test(e));
  leg(errs.length === 0, 'K11 THE PAGE THREW NOTHING', errs.slice(0, 3).join(' | ') || 'none');
  console.log('  keys pressed by the game: ' + JSON.stringify(await p.evaluate(() => (window.__KEYS && __KEYS.n) || 0)) + ' on the shell, ' + JSON.stringify(await fr.evaluate(() => (window.__KEYS && __KEYS.log || []).map(l => l.what))));
  await d.close();
  done();
})().catch(e => { console.log('  FAIL the gate threw: ' + (e && e.stack || e)); process.exit(1); });
