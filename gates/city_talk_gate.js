/* BOHEMIA — YOU CAN TALK TO SOMEBODY ON THE SURFACE HE ACTUALLY PLAYS (8/3/26).

   Paolo asked for "one extra NPC chilling outside the spawn in the suburb that I
   can just talk to and test out your mechanics", got one on the run slice, and
   came back with "I couldn't find them."

   HE WAS RIGHT, AND THE REASON IS WHY THIS GATE EXISTS AT ALL. The alpha routes
   the RUN tab to the CITY panel, so #p-run (BOHEMIA_RUN_CURRENT.html) is
   display:none the whole time - and that file is where every one of this lane's
   152 passing claims was measured. All of them green about a page the game never
   shows. They were not lying about the code; they were answering a question
   about the wrong door.

   SO THIS ONE OPENS THE ALPHA AND TAPS THE TAB, exactly the way he does, and
   every future gate in this lane must. VERIFY ON THE REAL SURFACE (7/18) means
   the surface he sees, and a side-door probe is a lie.

   Run: node gates/city_talk_gate.js
   Registered in gates/bohemia_gates.py as CITY TALK. */
'use strict';
const path = require('path');

const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
let pass = 0; const fail = [];
const ok = (n, c) => { c ? pass++ : (fail.push(n), console.log('  FAIL: ' + n)); };

function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

/* open the alpha, dismiss the splash, tap RUN, wait out the boot messages */
async function openRunTab(page) {
  await page.goto('file://' + ALPHA);
  await page.waitForSelector('#front', { timeout: 40000 });
  await page.click('#front');
  await page.waitForTimeout(1200);
  await page.click('.tab[data-p="run"]');
  await page.waitForTimeout(20000);
  const fr = await page.$('#cityFrame');
  return fr ? await fr.contentFrame() : null;
}

(async () => {
  console.log('CITY TALK GATE — somebody to speak to, on the tab he taps');
  const { chromium } = requirePlaywright();
  const browser = await chromium.launch();
  const errs = [];
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    page.on('pageerror', e => errs.push(e.message.slice(0, 140)));
    const cf = await openRunTab(page);
    ok('A1 the RUN tab shows the city frame', !!cf);
    if (!cf) return;

    const has = await cf.evaluate(() => !!window.__CT);
    ok('A2 the talk surface is really on that frame', has);
    if (!has) return;
    await cf.evaluate(() => window.__CT.wipe());

    /* A3/A4: SOMEBODY IS THERE. Before this, standing where the RUN tab drops
       him, __PPL_DRAWN was 0 and the nearest person in the valley was 192 tiles
       away. Not "nobody to talk to" - nobody at all. */
    const near = await cf.evaluate(() => {
      const all = window.__CT.everyone().sort((a, b) => a.d - b.d);
      return { n: all.length, d: all[0] ? all[0].d : -1,
               heading: all[0] ? all[0].heading : null,
               drawn: window.__PPL_DRAWN };
    });
    ok('A3 SOMEBODY IS STANDING BY THE SPAWN (' + near.d + ' tiles, a ' +
      near.heading + '), not across the valley', near.d >= 0 && near.d <= 6);
    ok('A4 and a body is really painted on screen (' + near.drawn + ')',
      near.drawn >= 1);

    /* A5: and they are one step away, walked with the frame's OWN mover. */
    const walked = await cf.evaluate(() => {
      const P = window.__proof;
      for (let i = 0; i < 40; i++) {
        const all = window.__CT.everyone().sort((a, b) => a.d - b.d);
        if (!all.length) return { none: true };
        if (all[0].d <= 1) return { d: all[0].d, steps: i };
        const pos = P.getPos();
        const dx = Math.sign(all[0].x - pos.hx), dy = Math.sign(all[0].y - pos.hy);
        P.step(dx, dy) || P.step(dx, 0) || P.step(0, dy);
      }
      return { gaveUp: true };
    });
    ok('A5 you can walk up to them (' + walked.steps + ' steps)', walked.d === 1);
    await cf.evaluate(() => render());

    const v1 = await cf.evaluate(() => ({
      verb: window.__CT.verb(),
      shown: (document.getElementById('cttalk') || {}).style.display }));
    ok('A6 THE ONE BUTTON NAMES THEIR TRADE (' + v1.verb + ')',
      /^TALK TO THE [A-Z]+$/.test(String(v1.verb)));
    ok('A7 and it is actually on screen', v1.shown === 'block');

    const card = await cf.evaluate(() => { window.__CT.open();
      const c = document.getElementById('ctcard');
      return { shown: c.style.display, text: c.textContent }; });
    ok('A8 the card opens', card.shown === 'block');
    ok('A9 a stranger\'s card says YOU HAVE NOT ASKED',
      /YOU HAVE NOT ASKED/.test(card.text));
    /* A ROUTINE IS INVISIBLE INFORMATION (Paolo 7/31): present-tense eyesight is
       legal, a printed timetable is not. */
    ok('A10 NO TIMETABLE IS ON THE CARD', !/\d{1,2}:\d{2}/.test(card.text));

    const asked = await cf.evaluate(() => {
      const a = document.getElementById('ctask'); if (!a) return { noAsk: true };
      a.click();
      const c = document.getElementById('ctcard');
      return { names: window.__CT.nameCount(), text: c.textContent }; });
    ok('A11 a stranger is offered the ask', !asked.noAsk);
    ok('A12 ASKING NAMES THEM (' + asked.names + ' known)', asked.names === 1);
    ok('A13 and the card stops saying YOU HAVE NOT ASKED',
      !/YOU HAVE NOT ASKED/.test(String(asked.text)));
    /* headingOf() returns the NAME once asked, which is right for a heading and
       wrong for this row - it made the card read "TRADE: MARISELA". */
    ok('A14 the TRADE row still says their trade, not their name',
      /TRADE(WORKER|SCAVENGER|KEEPER|WATCH)/.test(String(asked.text).replace(/\s+/g, '')));

    const after = await cf.evaluate(() => { const g = document.getElementById('ctgo');
      if (g) g.click(); render();
      return { verb: window.__CT.verb(), over: window.__CT.names() }; });
    /* the address phrase uppercases the name, so this is "TALK TO MARISELA".
       The first version of this claim expected "TALK TO Marisela" and went red on
       a correct build - the assertion was the broken half, not the code. */
    ok('A15 THE BUTTON CALLS THEM BY NAME NOW (' + after.verb + ')',
      /^TALK TO [A-Z]{2,}$/.test(String(after.verb)));
    ok('A16 AND THEIR NAME IS OVER THEIR HEAD (' + JSON.stringify(after.over) + ')',
      Array.isArray(after.over) && after.over.length === 1);

    /* A17: "once you ask their name, IF YOU SEE THEM AGAIN, then they would be
       named" (Paolo 7/31). That is a claim about memory, so it has to survive
       the page going away. */
    const cf2 = await openRunTab(page);
    const back = await cf2.evaluate(() => ({ names: window.__CT.nameCount() }));
    ok('A18 THE NAME SURVIVES A RELOAD — see them again and they are named (' +
      back.names + ')', back.names === 1);

    ok('A19 nothing threw' + (errs.length ? ': ' + errs[0] : ''), errs.length === 0);
  } finally { await browser.close(); }

  console.log((fail.length ? 'FAILED' : 'OK') + ': ' + pass + ' passed, ' +
    fail.length + ' failed');
  process.exit(fail.length ? 1 : 0);
})();
