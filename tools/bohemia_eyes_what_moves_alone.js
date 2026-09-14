/* BOHEMIA -- WHAT THE SCREEN DOES WITH NOBODY TOUCHING IT
 * EYES AND EARS, E26 [five minutes], 9/14/26.
 *
 * WHY. The five-minute walk's rebuilt detector failed its own control this round: a planted
 * button with NO HANDLER AT ALL was called alive, because in its watch window FOUR WORDS
 * APPEARED that no finger asked for. A wider margin would only hide that. The honest move is
 * to find out WHICH words the world writes by itself, by name, and then the detector can
 * ignore those instead of guessing at a threshold.
 *
 * WHAT IT DOES. Boots the demo on the phone profile, enters, walks once so the world is
 * actually running, then holds completely still and samples the visible words every 1.2 s --
 * the exact window the walk watches a tap in -- for sixty seconds. It prints every word that
 * came and went with nobody touching anything, ranked by how often.
 *
 * RULE ZERO. Two controls, both directions:
 *   C1 a planted word must be seen arriving (else the sampler is blind and a quiet answer
 *      would be a lie)
 *   C2 the sampler must report ZERO churn across two samples taken back to back with no wait
 *      (else it invents movement and every word below is noise of my own making)
 */
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
function pw() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { return require(t); } catch (e) {}
  }
  throw new Error('playwright not found');
}
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const WINDOW_MS = 1200, SECONDS = 60;

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
    args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
  const page = await (await b.newContext(PHONE)).newPage();
  const out = { what: 'what the screen does with nobody touching it', when: new Date().toISOString(),
                window_ms: WINDOW_MS, seconds: SECONDS, controls: [], samples: 0,
                windows_that_moved: 0, churn: {} };
  const words = () => page.evaluate(() => {
    const all = [];
    const take = (d) => { for (const w of (d.body.innerText || '').replace(/\s+/g, ' ').trim().split(' ')) if (w) all.push(w); };
    take(document);
    for (const f of document.querySelectorAll('iframe')) { try { if (f.contentDocument) take(f.contentDocument); } catch (e) {} }
    return all;
  }).catch(() => []);

  try {
    await page.goto('file://' + path.join(ROOT, 'slices', 'BOHEMIA_DEMO.html'),
      { waitUntil: 'domcontentloaded', timeout: 90000 });
    await sleep(2500);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await sleep(3500);

    /* C2 FIRST: two samples back to back must show no churn at all. */
    const a = await words(), a2 = await words();
    const churnOf = (x, y) => {
      const X = new Set(x), Y = new Set(y), moved = [];
      for (const w of X) if (!Y.has(w)) moved.push(w);
      for (const w of Y) if (!X.has(w)) moved.push(w);
      return moved;
    };
    const instant = churnOf(a, a2);
    out.controls.push({ name: 'NO INVENTED MOVEMENT: two samples taken back to back show no churn',
                        pass: instant.length === 0,
                        detail: instant.length + ' words moved with no time passing: ' + instant.slice(0, 8).join(' ') });

    /* C1: a planted word must be seen arriving. */
    const before = await words();
    await page.evaluate(() => { const s = document.createElement('span');
      s.id = '__eyes_plant'; s.textContent = ' __EYES_PLANTED_WORD__ '; document.body.appendChild(s); });
    await sleep(150);
    const after = await words();
    out.controls.push({ name: 'NOT BLIND: a planted word is seen arriving',
                        pass: churnOf(before, after).includes('__EYES_PLANTED_WORD__'),
                        detail: 'churn was ' + JSON.stringify(churnOf(before, after).slice(0, 6)) });
    await page.evaluate(() => { const e = document.getElementById('__eyes_plant'); if (e) e.remove(); });

    /* walk once so the world is genuinely running, the same way the walk does */
    await page.evaluate(async () => {
      const pads = [...document.querySelectorAll('*')].filter(e => /^(dpad|pad|walk)/i.test(e.id || ''));
      const t = pads[0] || null;
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 }));
      await new Promise(r2 => setTimeout(r2, 2000));
      t.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
    });
    await sleep(800);

    /* NOW HOLD STILL AND WATCH. */
    let prev = await words();
    const n = Math.floor((SECONDS * 1000) / WINDOW_MS);
    for (let i = 0; i < n; i++) {
      await sleep(WINDOW_MS);
      const now = await words();
      const moved = churnOf(prev, now);
      out.samples++;
      if (moved.length) out.windows_that_moved++;
      for (const w of moved) out.churn[w] = (out.churn[w] || 0) + 1;
      prev = now;
    }
  } catch (e) { out.why = String(e).slice(0, 300); }
  await b.close();
  const ranked = Object.entries(out.churn).sort((x, y) => y[1] - x[1]);
  out.ranked = ranked.slice(0, 40);
  fs.writeFileSync(path.join(ROOT, 'records', 'BOHEMIA_EYES_E26_WHAT_MOVES_ALONE_9_14_26.json'),
    JSON.stringify(out, null, 2));
  const bad = out.controls.filter(c => !c.pass).map(c => c.name);
  console.log('  controls: ' + (bad.length ? 'FAILED -> ' + bad.join(' | ') : 'both green'));
  if (bad.length) { console.log('  the words below mean nothing until the controls pass.'); }
  console.log('  ' + out.windows_that_moved + ' of ' + out.samples + ' windows moved with NOBODY TOUCHING ANYTHING.');
  console.log('  the words the world writes by itself, most often first:');
  for (const [w, c] of ranked.slice(0, 25)) console.log('    ' + String(c).padStart(3) + '  ' + JSON.stringify(w));
  process.exit(0);
})();
