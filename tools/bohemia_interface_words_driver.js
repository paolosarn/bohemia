/* BOHEMIA INTERFACE WORDS -- the driver half.
 *
 * Opens the BUILT DEMO, walks it the way demo_build_gate does (the game's own
 * path: tap the splash, which clicks the real RUN tab, which builds the city
 * frame), and reads the RENDERED text nodes at each screen.
 *
 * THE RULE THIS FILE ENFORCES: a string is player-facing if the game PAINTED
 * it. Not if it appears in the source. The city world's source holds 368 quoted
 * strings and most are dev labels, name banks and debug text; a stranger sees
 * none of those. Everything here was on a 390x844 phone screen.
 *
 * Prints JSON on stdout. Run via tools/bohemia_interface_words.py.
 */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);

function requirePlaywright() {
  const globals = ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules'];
  for (const g of globals) { try { return require(path.join(g, 'playwright')); } catch (_e) {} }
  return require('playwright');
}

/* every visible text node in a document, with the tag that carries it */
const READ = `(() => {
  const out = [];
  const seen = new Set();
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walk.nextNode())) {
    const t = (n.nodeValue || '').trim();
    if (!t || t.length < 2 || t.length > 220) continue;
    const el = n.parentElement;
    if (!el) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    if (r.bottom < 0 || r.top > innerHeight * 3) continue;
    if (seen.has(t)) continue;
    seen.add(t);
    out.push({ text: t, tag: el.tagName.toLowerCase() });
  }
  return out;
})()`;

(async () => {
  const pw = requirePlaywright();
  const b = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const strings = [], screens = [];

  async function grab(name, frame) {
    const host = frame || p;
    let rows = [];
    try { rows = await host.evaluate(READ); } catch (e) { rows = []; }
    rows.forEach(r => strings.push({ text: r.text, where: name, screen: name }));
    screens.push({ name: name, n: rows.length });
    return rows.length;
  }

  await p.goto('file://' + path.join(ROOT, 'slices', 'BOHEMIA_DEMO.html'));
  await p.waitForTimeout(2200);
  await grab('front-splash', null);

  /* the game's own way in */
  await p.click('#front', { force: true }).catch(() => {});
  await p.waitForTimeout(9000);
  await grab('shell', null);

  const cf = p.frames().find(x => x.url().includes('CITY_WORLD'));
  if (cf) {
    await cf.waitForLoadState('load').catch(() => {});
    await p.waitForTimeout(2500);
    await grab('first-morning', cf);

    /* the wake card's own buttons, then the day behind it */
    for (const label of ['GET UP', 'NOT NOW', 'SKIP']) {
      const hit = await cf.evaluate((L) => {
        const els = [...document.querySelectorAll('*')].filter(e =>
          e.children.length === 0 && (e.textContent || '').trim().toUpperCase() === L);
        if (els.length) { els[0].click(); return true; }
        return false;
      }, label).catch(() => false);
      if (hit) { await p.waitForTimeout(3500); await grab('after-' + label.toLowerCase().replace(/ /g, '-'), cf); }
    }

    /* the phone: the one button the day's work is behind */
    const ph = await cf.evaluate(() => {
      const b2 = document.getElementById('phonebtn');
      if (b2) { b2.click(); return true; }
      return false;
    }).catch(() => false);
    if (ph) { await p.waitForTimeout(2500); await grab('phone', cf); }

    /* whatever else the topbar offers a stranger */
    const chips = await cf.evaluate(() => {
      const ids = ['journalbtn', 'objbtn', 'mapbtn', 'savebtn', 'musicbtn'];
      return ids.filter(i => document.getElementById(i));
    }).catch(() => []);
    for (const id of chips) {
      await cf.evaluate((i) => { const e = document.getElementById(i); if (e) e.click(); }, id).catch(() => {});
      await p.waitForTimeout(1800);
      await grab(id.replace('btn', ''), cf);
    }
  }

  await b.close();
  process.stdout.write(JSON.stringify({ strings, screens }, null, 1));
})().catch(e => { console.error(String(e)); process.exit(1); });
