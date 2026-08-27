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

    /* EVERY OTHER SCREEN A STRANGER CAN OPEN. The first cut of this driver
       guessed at five ids and four of them did not exist, so it reported six
       screens and called the job done -- a harvester that silently reaches
       nothing looks exactly like a game with no words in it. The ids are read
       OUT OF THE SURFACE now instead of guessed, and each panel is closed again
       before the next is opened so a stack of open panels cannot hide the one
       underneath. */
    const chips = await cf.evaluate(() => {
      const want = ['savebtn', 'outfitbtn', 'sleepbtn', 'mktbtn', 'musbtn',
                    'bikebtn', 'fitbtn', 'keybtn', 'popbtn', 'underbtn', 'rungbtn'];
      /* A STRANGER CAN REACH IT ONLY IF IT IS ACTUALLY ON THE SCREEN.
         The first cut asked getComputedStyle(el).display, which reads the
         ELEMENT and not its ancestors -- so a button sitting inside the hidden
         builder's drawer answered "block" and got clicked. That harvested THREE
         DEV PANELS (157 strings, more than the whole real corpus) as if a player
         read them. offsetParent goes null the moment any ancestor is display
         none, and a real box on a real screen is the rest of the test. */
      return want.filter(i => {
        const e = document.getElementById(i);
        if (!e || !e.offsetParent) return false;
        const r = e.getBoundingClientRect();
        return r.width > 4 && r.height > 4
          && r.top < innerHeight && r.bottom > 0 && r.left < innerWidth && r.right > 0;
      });
    }).catch(() => []);
    for (const id of chips) {
      await cf.evaluate((i) => {
        /* close anything already open, so each screen is read alone */
        ['savepanel', 'outfitpanel', 'keypanel', 'buildpanel', 'phonewrap', 'tjPanel']
          .forEach(k => { const e = document.getElementById(k); if (e) e.style.display = 'none'; });
        const b3 = document.getElementById(i); if (b3) b3.click();
      }, id).catch(() => {});
      await p.waitForTimeout(2000);
      await grab(id.replace('btn', ''), cf);
    }

    /* THE CARDS. A day card, a vista card and the sleep card are the game
       talking to you at the loudest moments it has, and none of them is behind
       a button with an id -- they appear. Read whatever is up. */
    for (const card of ['daycard', 'ctcard', 'vistaCard']) {
      const up = await cf.evaluate((c) => {
        const e = document.getElementById(c);
        if (!e) return false;
        const cs = getComputedStyle(e);
        return cs.display !== 'none' && (e.textContent || '').trim().length > 2;
      }, card).catch(() => false);
      if (up) await grab('card-' + card.toLowerCase(), cf);
    }
  }

  await b.close();
  process.stdout.write(JSON.stringify({ strings, screens }, null, 1));
})().catch(e => { console.error(String(e)); process.exit(1); });
