#!/usr/bin/env node
/* ============================================================================
   THE COMPANY SCREEN, COUNTED (UI [the company screen, Battle Brothers simple], 10/25/26; rule 172(c) and (d),
   Paolo 10/25: 'you're over complicating it, it's really hard to navigate your equipment, the levelling up').

   ONE COUNTER FOR BEFORE AND AFTER, so 'fewer things on the screen' is a number and not a feeling. It opens the crew
   screen the way the game does (engine/bohemia_crew_door.js over a host page, the company the origin built handed in
   by BOH_START.picks()), on the STRANGER'S STATE: six men (YOU, DESI, RAUL, TINA, BOOKIE, OSO, the first six of the
   fight's own crew), BOOKIE with a level waiting (his rolls and a perk point), a stash of ten things the market sells
   (three body armours: holds 30, 65 and 110; two heads, three weapons, two shields).

   A THING ON THE SCREEN is what a person reads or presses as one piece, counted the same way on any version:
     words  every shown element with words of its own (a label, a number, a name, a sentence)
     pics   every shown picture (a canvas, an img, a CSS icon laid in front of a label, a drawn star, an item icon)
     boxes  every shown slot, cell or button that holds neither words nor a picture (an empty slot is still a box)
   Shown means rendered with a size, not hidden, not see-through; a thing below the fold still counts (it is on
   the screen, a scroll away). The page's scroll beyond the glass is reported apart, in screens.

   Run:  node tools/bohemia_ui_company_screen_count.js [slices/BOHEMIA_ROSTER_SCREEN.html] [--old]
         --old drives TODAY'S path (the 10/25 screen: the picker inside his page) to count its taps.
   The gate (gates/the_company_screen_battle_brothers_simple_gate.js) requires this file and holds the numbers.
   ============================================================================ */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.dirname(__dirname);
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg' };

/* the two profiles every UI gate uses: his phone upright, and a computer */
const PROFILES = {
  phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  computer: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false }
};

/* the stranger's state: what the market would have left in the stash, the shape C.itemOf gives every item */
const STASH = [
  { id: 'leather_tunic', kind: 'body', name: 'a work jacket', was: 'Leather Tunic', price: 7, nums: 'holds 30' },
  { id: 'gambeson', kind: 'body', name: 'a padded vest', was: 'Gambeson', price: 15, nums: 'holds 65  weight 6' },
  { id: 'southern_mail_shirt', kind: 'body', name: 'a plate carrier', was: 'Southern Mail Shirt', price: 40, nums: 'holds 110  weight 11' },
  { id: 'rusty_mail_coif', kind: 'head', name: 'a hard hat', was: 'Rusty Mail Coif', price: 15, nums: 'holds 70  weight 4' },
  { id: 'kettle_hat', kind: 'head', name: 'a riot helmet', was: 'Kettle Hat', price: 45, nums: 'holds 115  weight 6' },
  { id: 'light_crossbow', kind: 'weapon', name: 'rifle', was: 'Light Crossbow', price: 30, nums: 'dmg 30-50  reach 6', hands: 2, cls: 'crossbow' },
  { id: 'knife', kind: 'weapon', name: 'pistol', was: 'Knife', price: 3, nums: 'dmg 15-25', hands: 1, cls: 'dagger' },
  { id: 'warfork', kind: 'weapon', name: 'rebar spear', was: 'Warfork', price: 40, nums: 'dmg 40-60  reach 2', hands: 2, cls: 'spear' },
  { id: 'wooden_shield', kind: 'shield', name: 'a car door', was: 'Wooden Shield', price: 10, nums: 'holds 24  weight 10' },
  { id: 'heater_shield', kind: 'shield', name: 'a car door', was: 'Heater Shield', price: 25, nums: 'holds 32  weight 14' }
];
const BEST_ARMOUR = 'southern_mail_shirt';
const MEN = ['YOU', 'DESI', 'RAUL', 'TINA', 'BOOKIE', 'OSO'];
const THIRD = 'BOOKIE', FIFTH = 'DESI';   /* the line's own order, front then back: YOU RAUL BOOKIE OSO | DESI TINA */
const COMPANY = [{ background: 'sellsword', level: 1 }, { background: 'militia', level: 1 }, { background: 'brawler', level: 1 },
  { background: 'retired_soldier', level: 1 }, { background: 'thief', level: 1 }, { background: 'miner', level: 1 }];
/* BOOKIE came back from a fight with 260 XP: level 2 waits on him, Battle Brothers' way (three of eight rolled, one perk point) */
const CLIMB = { BOOKIE: { xp: 260, level: 2, points: 1, perks: [], rolls: [{ level: 2, pick: 3,
  gains: { hp: 3, fatigue: 4, resolve: 2, initiative: 5, melee_skill: 3, ranged_skill: 1, melee_defense: 2, ranged_defense: 1 } }] } };

function seedLocal(w) {
  try {
    ['bohemia.company.v1', 'bohemia.company.line.v1', 'bohemia.hired.v1', 'bohemia.formation.v1', 'bohemia.walked.v1', 'bohemia.fight.after.v1', 'bohemia.taken.v1', 'bohemia.dismissed.v1'].forEach(k => localStorage.removeItem(k));
    localStorage.setItem('bohemia.bag.v1', JSON.stringify(w.stash));
    localStorage.setItem('bohemia.climb.v1', JSON.stringify(w.climb));
  } catch (e) {}
}

const HOST = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
  + '<style>html,body{margin:0;height:100%;background:#120e0a}</style></head><body>'
  + '<script>window.BOH_START={picks:function(){return window.__PICKS;}};window.__PICKS=null;</script>'
  + '<script src="engine/bohemia_crew_door.js"></script></body></html>';

function serve(port, opts) {
  opts = opts || {};
  const srv = http.createServer((rq, rs) => {
    const u = decodeURIComponent(rq.url.split('?')[0]);
    if (u === '/__host.html') { rs.setHeader('content-type', 'text/html'); return rs.end(HOST); }
    if (opts.screen && u === '/slices/BOHEMIA_ROSTER_SCREEN.html') { rs.setHeader('content-type', 'text/html'); return rs.end(opts.screen); }
    const f = path.join(ROOT, u.replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
    rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
  });
  return new Promise(r => srv.listen(port, '127.0.0.1', () => r(srv)));
}

/* in the page: the count (passed to frame.evaluate as a string so before and after run the very same code) */
const COUNT_SRC = `(() => {
  const own = el => { for (const n of el.childNodes) if (n.nodeType === 3 && n.nodeValue.trim()) return true; return false; };
  const shown = el => { const r = el.getBoundingClientRect(); if (!(r.width > 0 && r.height > 0)) return false;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden' || +s.opacity === 0) return false; }
    return true; };
  const url = v => v && v !== 'none' && /url\\(/.test(v);
  let words = 0, pics = 0, boxes = 0, presses = 0; const BOX = 'button,[role=button],[data-drop],[data-drag],.slot,.cell,.gslot,.tile';
  const all = document.body.querySelectorAll('*');
  for (const el of all) {
    if (/^(SCRIPT|STYLE|TEMPLATE)$/.test(el.tagName) || !shown(el)) continue;
    const w = own(el); if (w) words++;
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    let pic = el.tagName === 'CANVAS' || el.tagName === 'IMG';
    if (!pic && !w && url(cs.backgroundImage) && r.width <= 40 && r.height <= 40) pic = true;   /* a drawn star, an icon */
    if (pic) pics++;
    const b = getComputedStyle(el, '::before'); if (b.content && b.content !== 'none' && url(b.backgroundImage) && parseFloat(b.width) > 0 && parseFloat(b.width) <= 40) pics++;   /* an icon laid before a label */
    if (el.matches(BOX)) { presses++;
      if (!w && !el.querySelector('canvas,img') && ![...el.querySelectorAll('*')].some(c => own(c) && shown(c))) boxes++; }
  }
  const de = document.scrollingElement || document.documentElement;
  return { words, pics, boxes, total: words + pics + boxes, presses, screens: +(de.scrollHeight / innerHeight).toFixed(2) };
})()`;

async function openCrew(page, port, o) {
  o = o || {};
  await page.addInitScript(seedLocal, { stash: o.stash || STASH, climb: o.climb || CLIMB });
  await page.goto('http://127.0.0.1:' + port + '/__host.html', { waitUntil: 'load' });
  await page.evaluate(c => { window.__PICKS = { company: c, roster: 20, cap: 12, origin: 'stranger' }; }, o.company || COMPANY);
  await page.evaluate(() => BohemiaCrewDoor.open({ base: 'slices/' }));   /* tap 1: the crew button */
  const fr = await (async () => { for (let i = 0; i < 100; i++) { const f = page.frames().find(f => /BOHEMIA_ROSTER_SCREEN/.test(f.url())); if (f) return f; await page.waitForTimeout(100); } return null; })();
  await fr.waitForFunction(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready && BohemiaRosterScreen.state.crew.length >= 6, null, { timeout: 30000 });
  await page.waitForTimeout(o.settle || 1500);
  return fr;
}
const count = fr => fr.evaluate(COUNT_SRC);

/* is the thing on the glass right now, or a scroll away (a stranger has to find it) */
async function onGlass(fr, sel) {
  return fr.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth; }, sel);
}

/* TODAY'S PATH, the 10/25 screen (the picker inside his page), counted tap by tap; a scroll is counted when the next
   thing to press is off the glass */
async function oldPath(page, fr, prof) {
  const T = { taps: 1, scrolls: 0, steps: [], dismiss: false };   /* the crew button */
  const tap = async (sel, why) => { if (!(await onGlass(fr, sel))) T.scrolls++; await fr.click(sel); T.taps++; T.steps.push(why); await page.waitForTimeout(350); };
  const man = n => fr.evaluate(n => { const S = BohemiaRosterScreen.state, i = S.crew.findIndex(m => m.name === n); return '.cell[data-man="' + i + '"]'; }, n);
  await tap(await man(THIRD), 'the third man');
  await tap('#card .gslot[data-slot="body"]', 'his body slot opens the picker');
  const best = await fr.evaluate(id => { const S = BohemiaRosterScreen.state, i = S.bag.findIndex(x => x.id === id); return '#picker .slot[data-pick="' + i + '"]'; }, BEST_ARMOUR);
  await tap(best, 'the best armour in the picker');
  const keys = ['hp', 'melee_skill', 'melee_defense'];
  for (const k of keys) await tap('#levelup [data-raise="' + k + '"]', 'raise ' + k);
  await tap('#raise', 'RAISE THEM');
  await tap('#pick', 'PICK A PERK');
  await tap('.plist button', 'a perk');
  await tap(await man(FIFTH), 'the fifth man');
  T.dismiss = await fr.evaluate(() => !!document.querySelector('[data-act="dismiss"],#dismiss,button.dismiss') || /DISMISS/.test(document.body.innerText));
  T.wore = await fr.evaluate(n => { const m = BohemiaRosterScreen.state.crew.find(m => m.name === n); return m && m.gear.body && m.gear.body.id; }, THIRD);
  return T;
}

module.exports = { PROFILES, STASH, BEST_ARMOUR, MEN, THIRD, FIFTH, COMPANY, CLIMB, serve, openCrew, count, onGlass, oldPath, COUNT_SRC };

if (require.main === module) {
  (async () => {
    const file = process.argv.slice(2).find(a => !a.startsWith('--')) || 'slices/BOHEMIA_ROSTER_SCREEN.html';
    const old = process.argv.includes('--old');
    const srv = await serve(8931, { screen: fs.readFileSync(path.join(ROOT, file), 'utf8') });
    const { chromium } = require('playwright'); const b = await chromium.launch();
    const out = {};
    for (const [name, prof] of Object.entries(PROFILES)) {
      const ctx = await b.newContext(prof), page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
      const fr = await openCrew(page, 8931);
      const open = await count(fr);
      const sel = await fr.evaluate(n => { const S = BohemiaRosterScreen.state, i = S.crew.findIndex(m => m.name === n); return '.cell[data-man="' + i + '"]'; }, THIRD);
      await fr.click(sel); await page.waitForTimeout(500);
      const third = await count(fr);
      out[name] = { open, third };
      if (old) { await ctx.close(); const c2 = await b.newContext(prof), p2 = await c2.newPage(); const f2 = await openCrew(p2, 8931); out[name].path = await oldPath(p2, f2, prof); await c2.close(); }
      else await ctx.close();
      out[name].errors = errs.slice(0, 3);
    }
    console.log(JSON.stringify(out, null, 1));
    await b.close(); srv.close();
  })().catch(e => { console.error(e); process.exit(1); });
}
