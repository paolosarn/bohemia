#!/usr/bin/env node
/* BOHEMIA -- [the settlement picture judged] ROUND TWO: THE CHECK
 * EYES AND EARS, lane 17, rule 71a. 10/9/26.
 *
 * THE ROW: RUN TWO's real settlement screen, counted as diegetic (buildings touched directly)
 * against non-diegetic (anything still reading as a floating button/label/icon row) hits; the
 * label count at rest (floor zero); the picture's share of the glass; whether any touch
 * affordance exists short of a permanent label (round one's genre caution).
 *
 * REUSE-FIRST: the reach (open BOHEMIA_SETTLEMENT_SCREEN.html, wait for BohemiaSettlement.where,
 * read BohemiaSettlement.order() for the building list) is UI's own, from
 * gates/the_settlement_labels_gate.js, reused rather than reinvented. That gate already proves
 * labels pass contrast and vanish on lift; it does not count diegetic-vs-non-diegetic hits, the
 * picture's glass share, or check for a pre-touch affordance -- this tool measures those three.
 */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const OUTDIR = path.join(ROOT, 'records', 'eyes_settlement_picture');

(async () => {
  try { fs.mkdirSync(OUTDIR, { recursive: true }); } catch (e) {}
  const d = await D.open({ file: 'BOHEMIA_SETTLEMENT_SCREEN.html', bare: true });
  const p = d.page;
  const t0 = Date.now();
  while (Date.now() - t0 < 20000) { if (await p.evaluate(() => window.BohemiaSettlement && BohemiaSettlement.where('stall'))) break; await p.waitForTimeout(200); }
  await p.waitForTimeout(1500);

  const rest = await p.evaluate(() => {
    const vis = el => { if (!el) return false; const r = el.getBoundingClientRect(); const s = getComputedStyle(el);
      return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0.05; };
    // every element with real text content, visible, at rest (no finger down)
    const texts = [];
    document.querySelectorAll('body *').forEach(el => {
      if (el.children.length) return; // leaf nodes only
      const t = (el.textContent || '').trim();
      if (t && vis(el)) { const r = el.getBoundingClientRect(); texts.push({ tag: el.tagName, id: el.id, cls: el.className, text: t.slice(0, 30), x: r.x, y: r.y, w: r.width, h: r.height }); }
    });
    // chrome rows: anything that looks like a persistent button/icon bar outside the picture canvas
    const canvas = document.querySelector('canvas');
    const cr = canvas ? canvas.getBoundingClientRect() : null;
    const chrome = [];
    document.querySelectorAll('body > *').forEach(el => {
      if (el === canvas || !vis(el)) return;
      const r = el.getBoundingClientRect();
      chrome.push({ tag: el.tagName, id: el.id, cls: el.className, x: r.x, y: r.y, w: r.width, h: r.height });
    });
    return { texts, chrome, canvas: cr, W: innerWidth, H: innerHeight, keys: BohemiaSettlement.order() };
  });

  const shotRest = path.join(OUTDIR, 'rest.png');
  await p.screenshot({ path: shotRest });

  // check for a pre-touch affordance: hover each building (mouse move, no press) and see if ANYTHING changes
  const affordance = [];
  for (const k of rest.keys) {
    const xy = await p.evaluate(k => BohemiaSettlement.where(k), k);
    if (!xy) continue;
    const before = await p.screenshot({ clip: { x: Math.max(0, xy.x - 40), y: Math.max(0, xy.y - 60), width: 80, height: 90 } });
    await p.mouse.move(xy.x, xy.y);
    await p.waitForTimeout(150);
    const afterHover = await p.screenshot({ clip: { x: Math.max(0, xy.x - 40), y: Math.max(0, xy.y - 60), width: 80, height: 90 } });
    affordance.push({ key: k, changedOnHover: Buffer.compare(before, afterHover) !== 0 });
    await p.mouse.move(5, 5);
    await p.waitForTimeout(100);
  }

  // now actually press one building to confirm the label system still fires (sanity, reusing UI's own proof)
  const held = [];
  for (const k of rest.keys.slice(0, 2)) {
    await p.evaluate(k => BohemiaSettlement.where(k), k);
    const xy = await p.evaluate(k => BohemiaSettlement.where(k), k);
    await p.mouse.move(xy.x, xy.y); await p.mouse.down();
    await p.waitForTimeout(250);
    const duringTexts = await p.evaluate(() => Array.from(document.querySelectorAll('body *')).filter(el => !el.children.length && (el.textContent || '').trim()).length);
    held.push({ key: k, textNodesWhileHeld: duringTexts });
    await p.mouse.up();
    await p.waitForTimeout(150);
  }
  const shotHeld = path.join(OUTDIR, 'held_' + rest.keys[0] + '.png');
  await p.evaluate(k => BohemiaSettlement.where(k), rest.keys[0]);
  const xy0 = await p.evaluate(k => BohemiaSettlement.where(k), rest.keys[0]);
  await p.mouse.move(xy0.x, xy0.y); await p.mouse.down(); await p.waitForTimeout(250);
  await p.screenshot({ path: shotHeld });
  await p.mouse.up();

  await d.close();

  const out = { rest, affordance, held, restTextCount: rest.texts.length, buildingCount: rest.keys.length };
  fs.writeFileSync(path.join(OUTDIR, 'result.json'), JSON.stringify(out, null, 2));
  console.log('  buildings: ' + rest.keys.length + ' (' + rest.keys.join(', ') + ')');
  console.log('  text nodes visible at rest: ' + rest.texts.length);
  rest.texts.forEach(t => console.log('    "' + t.text + '" ' + t.tag + (t.id ? '#' + t.id : '') + ' at ' + Math.round(t.x) + ',' + Math.round(t.y)));
  console.log('  canvas (the picture): ' + JSON.stringify(rest.canvas));
  console.log('  chrome elements outside the picture: ' + rest.chrome.length);
  rest.chrome.forEach(c => console.log('    ' + c.tag + (c.id ? '#' + c.id : '') + ' ' + Math.round(c.w) + 'x' + Math.round(c.h) + ' at ' + Math.round(c.x) + ',' + Math.round(c.y)));
  console.log('  hover affordance (pixels change before any press):');
  affordance.forEach(a => console.log('    ' + a.key + ': ' + (a.changedOnHover ? 'CHANGES on hover' : 'no change on hover')));
  console.log('  done. records/eyes_settlement_picture/ has the frames.');
})().catch(e => { console.log('  FAIL: ' + e.stack); process.exit(1); });
