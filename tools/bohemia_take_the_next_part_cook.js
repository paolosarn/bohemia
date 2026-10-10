/* BOHEMIA — TAKE THE NEXT PART, THE VOTE PICTURE (10/10/26, LIFE + CITY, [take the next part]).
 * THE ALPHA on a phone, real touches in the settlement frame: a place you do not hold, BUILD says it is not your
 * ground and offers Take it (shot 1); the fight at their gate once the clouds part (shot 2); a win, the shell takes
 * him home the way the game does, and the same place's BUILD now shows the build list (shot 3). Nothing is drawn here.
 * REFERENCE CHECK:
 *   AH-01    the game's own frames, nothing composed.
 *   BLDG-03  the screen's and the board's own light.
 *   BLDG-05  the place, the fight and the list where the game puts them.
 * REUSE CHECK: every pixel is the alpha as the phone shows it.
 * Run:  node tools/bohemia_take_the_next_part_cook.js
 */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'records', 'lifecity_pictures', 'take_the_next_part');
const D = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
async function openPlace(d, pick) {
  const name = await d.fr.evaluate((pick) => { const bs = ctBases();
    const n = pick || Object.keys(bs).find(k => !lotIsMine(k) && turfSeats().some(s => s.faction === k));
    const t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); return n; }, pick || null);
  let f = null, w = null, box = null;
  for (let k = 0; k < 40 && !(w && box); k++) { await d.page.waitForTimeout(500);
    for (const fr of d.page.frames().filter(fr => /SETTLEMENT/.test(fr.url()))) {
      const ww = await fr.evaluate(() => { try { return BohemiaSettlement.where('build'); } catch (e) { return null; } }).catch(() => null);
      const bb = ww && await (await fr.frameElement()).boundingBox();
      if (ww && bb && bb.width > 0) { f = fr; w = ww; box = bb; break; } } }
  if (!w) throw new Error('no BUILD at ' + name);
  await d.page.touchscreen.tap(box.x + w.x, box.y + w.y); await d.page.waitForTimeout(1200);
  return { name, f };
}
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const d = await D.open({ alpha: true });
  try {
    await d.toMap();
    const p = await openPlace(d);
    await d.page.screenshot({ path: path.join(OUT, '1_take_it.png') });
    const b = (await p.f.$$('#sbody .act'))[0], bb = await b.boundingBox();
    await d.page.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2);
    for (let k = 0; k < 60; k++) { await d.page.waitForTimeout(500);
      const st = await d.pageEval(() => { try { return { nfc: NFC.state, ready: !!(NF.frame && nfReady(NF.frame)) }; } catch (e) { return {}; } });
      if (st.ready && st.nfc !== 'in') break; }
    await d.page.waitForTimeout(2500);
    await d.page.screenshot({ path: path.join(OUT, '2_their_gate.png') });
    await d.pageEval(() => cityFightHome({ victory: true, result: 'win', alive: 0 }));
    await d.page.waitForTimeout(2500);
    await d.fr.evaluate(() => { try { loopClose(); } catch (_e) {} }); await d.page.waitForTimeout(1500);
    await openPlace(d, p.name);
    await d.page.screenshot({ path: path.join(OUT, '3_yours.png') });
    console.log('took', p.name, 'mine', await d.fr.evaluate((n) => lotIsMine(n), p.name));
  } finally { await d.close(); }
})().catch(e => { console.error(e); process.exit(1); });
