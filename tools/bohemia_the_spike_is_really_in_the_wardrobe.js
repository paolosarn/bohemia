/* COOK: THE SPIKE IS REALLY IN THE WARDROBE (9/29/26, CHARACTER, [attachments])
 *
 * Last round's cook proved the trade with the rig's own render calls (shoot() ->
 * buildFrame() directly, the same code the game uses, but called from outside the UI).
 * That answers "does the art work." It does not answer "can he actually put it on" --
 * and rule 18's hold has trained this lane to say NOT WIRED by default, so it is worth
 * checking rather than assuming either way.
 *
 * MEASURED THIS ROUND, ON THE REAL SURFACE (VERIFY ON THE REAL SURFACE): the CHARACTER
 * tab's own wardrobe panel (window.wardrobeRefresh, slices/BOHEMIA_ALPHA_0_9.html around
 * line 19295) builds its GEAR and BACK shelves by filtering window.GARMENTS for
 * st==='canon', with no whitelist beyond that. SPIKED PAULDRON, STEEL SPIKED PAULDRON
 * (layer:'gear') and the ROAD CAPE family (layer:'back') all carry st:'canon', so they
 * were ALREADY showing up in that panel the moment last round's commit landed -- this
 * lane did not have to wire anything for the player to reach them. NOT WIRED (rule 18)
 * was true only of FACTION_LOOKS (no NPC defaults to a spike); it was never true of the
 * player's own wardrobe, and last round's own comment said so ambiguously. This round
 * corrects that by proving it, not just asserting it.
 *
 * SO THIS COOK IS A CLICK, NOT A RENDER CALL: load the real page over http (file://
 * blocks the loading screen's fetches, the exact become_gate lesson from 9/23), wait for
 * #front to reach ready the way become_gate and [dial a slider] both do, tap it, open the
 * CHARACTER tab, open the real GEAR shelf, click the real SPIKED PAULDRON button the
 * same way a finger would, and screenshot the canvas before and after. window.G_WORN.gear
 * is read back afterward as the ground truth, not assumed from the picture alone.
 *
 * REUSE-FIRST: the wait-for-ready-then-tap sequence is copied from
 * tools/bohemia_cook_every_dial_a_slider.js (this lane's own 9/13 tool), which already
 * solved the file:// trap and the loading-screen-photographed-instead-of-the-panel bug;
 * nothing here reinvents either.
 *
 * REFERENCE CHECK: none needed -- no new pixel is drawn this round, only a real click
 * path is proven and photographed off the game's own camera (rule 32f).
 *
 *   node tools/bohemia_the_spike_is_really_in_the_wardrobe.js
 */
'use strict';
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '..');
const PORT = 8935;
const VOTE = path.join(ROOT, 'slices/vote');
const PAGE = path.join(VOTE, 'CHARACTER_THE_ATTACHMENTS_TRADE.html');
const OUT = path.join(ROOT, 'records/BOHEMIA_THE_ATTACHMENTS_TRADE_9_28_26.txt');

function serve() {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
    '.png': 'image/png', '.css': 'text/css', '.txt': 'text/plain' };
  return new Promise(res => {
    const s = http.createServer((rq, rs) => {
      const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]));
      fs.readFile(f, (e, d) => { if (e) { rs.writeHead(404); rs.end(); return; }
        rs.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); rs.end(d); });
    });
    s.listen(PORT, '127.0.0.1', () => res(s));
  });
}

(async () => {
  const srv = await serve();
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 420, height: 620 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  await p.goto(`http://127.0.0.1:${PORT}/slices/BOHEMIA_ALPHA_0_9.html`, { waitUntil: 'load' });
  await p.waitForFunction(() => typeof window.GARMENTS !== 'undefined' && typeof window.wardrobeRefresh === 'function', { timeout: 60000 });

  const ready = await p.waitForFunction(() => {
    const f = document.getElementById('front');
    return !f || f.classList.contains('ready') || !f.classList.contains('load');
  }, { timeout: 120000 }).then(() => true).catch(() => false);
  if (!ready) {
    console.error('THREW: the loading screen never lifted; nothing written.');
    await b.close(); srv.close(); process.exit(1);
  }
  await p.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
  await p.waitForTimeout(700);

  await p.click('.tab[data-p="char"]');
  await p.waitForTimeout(300);
  await p.evaluate(() => window.wardrobeRefresh());
  await p.waitForTimeout(150);

  const box = await p.evaluate(() => {
    const c = document.querySelector('#charStage canvas');
    if (!c) return null;
    const r = c.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  if (!box || !box.width) { console.error('THREW: no character canvas found, or it is zero-size: ' + JSON.stringify(box)); await b.close(); srv.close(); process.exit(2); }

  /* BEFORE: make sure gear is really empty */
  await p.evaluate(() => { window.G_WORN.gear = ''; if (typeof rebuildFromRig === 'function') rebuildFromRig(); });
  await p.waitForTimeout(250);
  fs.mkdirSync(VOTE, { recursive: true });
  await p.screenshot({ path: path.join(VOTE, 'CHARACTER_SPIKE_IN_WARDROBE_BEFORE.png'), clip: box });

  /* AFTER: the real click path, not a direct call */
  await p.evaluate(() => window.wardrobeRefresh());
  await p.waitForTimeout(150);
  const openStep = await p.evaluate(() => {
    const host = document.getElementById('wardrobe');
    if (!host) return 'no wardrobe host';
    const gearHead = [...host.querySelectorAll('.cloSection')].find(h => h.textContent.includes('GEAR'));
    if (!gearHead) return 'no GEAR shelf';
    gearHead.click(); return 'ok';
  });
  await p.waitForTimeout(150);
  const clickStep = await p.evaluate(() => {
    const host = document.getElementById('wardrobe');
    const btn = [...host.querySelectorAll('button')].find(b => b.textContent.trim() === 'SPIKED PAULDRON');
    if (!btn) return 'no SPIKED PAULDRON button in the real shelf';
    btn.click(); return 'ok';
  });
  await p.waitForTimeout(300);
  const wornAfter = await p.evaluate(() => window.G_WORN.gear);

  if (openStep !== 'ok' || clickStep !== 'ok' || wornAfter !== 'SPIKED PAULDRON') {
    console.error('THREW: click path failed -- open:' + openStep + ' click:' + clickStep + ' worn:' + wornAfter);
    await b.close(); srv.close(); process.exit(3);
  }
  await p.screenshot({ path: path.join(VOTE, 'CHARACTER_SPIKE_IN_WARDROBE_AFTER.png'), clip: box });

  await b.close(); srv.close();

  /* APPEND TO THE STANDING RECORD, do not overwrite last round's findings */
  const add = '\n\nADDED 9/29: THE SPIKE IS REALLY IN THE WARDROBE, PROVEN BY A CLICK NOT A\n'
    + 'RENDER CALL. Last round\'s pictures used the rig\'s own render function directly,\n'
    + 'which proves the art but not that a player can reach it. Checked this round on the\n'
    + 'real page: the CHARACTER tab\'s own GEAR shelf lists SPIKED PAULDRON because it\n'
    + 'reads every canon garment with no separate whitelist -- nothing needed wiring, it was\n'
    + 'already reachable the round the garment shipped. Proven by tapping the real button in\n'
    + 'a real browser (not by calling the paint function) and reading window.G_WORN.gear\n'
    + 'back afterward: it says SPIKED PAULDRON. Two screenshots, before and after the real\n'
    + 'tap, in the VOTE item below.\n';
  fs.appendFileSync(OUT, add);
  console.log('APPENDED record.');

  /* APPEND A SECTION TO THE EXISTING VOTE PAGE, do not touch the three earlier cases */
  let html = fs.readFileSync(PAGE, 'utf8');
  const marker = '<p class="beat">what is not here:';
  const section = `<section>
      <h2>THE SPIKE IS REALLY IN THE WARDROBE</h2>
      <p class="note">not a render call: a real tap on the real CHARACTER tab's GEAR shelf, screenshotted before and after.</p>
      <div class="street">
        <div class="walk"></div><div class="kerb"></div>
        <div class="road">
          <figure><img src="CHARACTER_SPIKE_IN_WARDROBE_BEFORE.png"><figcaption>before, still</figcaption></figure>
          <figure><img src="CHARACTER_SPIKE_IN_WARDROBE_AFTER.png"><figcaption>after one real tap</figcaption></figure>
        </div>
      </div>
    </section>
    `;
  if (!html.includes('THE SPIKE IS REALLY IN THE WARDROBE')) {
    html = html.replace(marker, section + marker);
    fs.writeFileSync(PAGE, html);
    console.log('APPENDED vote page section.');
  } else {
    console.log('vote page section already present, left as is.');
  }
  if (errs.length) console.log('page errors: ' + errs.slice(0, 3).join(' | '));
})();
