#!/usr/bin/env node
/* GEAR NEVER VANISHES (COMBAT [gear never vanishes], rule 191(b), Paolo 10/25: 'in the first fight I had my spear and car-door
   shield, and in the third fight it disappeared, it was so creepy'; records/BOHEMIA_PAOLO_SHOOTERS_TAKE_THE_BEST_SHOT_AND_GEAR_
   NEVER_VANISHES_10_25_26.md; rule 194, records/BOHEMIA_PAOLO_THE_SHIELD_IS_ONE_HAND_AND_A_TWO_HANDER_WEARS_ITS_OWN_NAME_10_25_26.md).

   MEASURED 10/25 (main c2375c0c), his whole path ten fights in a row (the real crew screen with real drags, the game's own door
   cut from the demo, the real fight on AUTO, the shell's after-keeper, the crew screen again):
   - a one-handed spear (the militia spear) and a car door: in his hands in every fight he stood in, on the crew screen and in
     the hand-over after every one; he left the line once, struck down in fight seven, laid up 31 days, and the crew screen said so.
     The saved company, the hand-over, the fight's door, the layers and the end report lose nothing.
   - THE CAUSE IS THE NAME: the shop and the crew screen call the two-handed Warfork and Spetum a 'solid / good rebar spear', the
     one-handers' name. A door put on a Warfork man sends the 'rebar spear' to the stash ('RAUL takes the car door; the rebar
     spear goes in the stash'); a 'rebar spear' put in a door man's hand sends the door there. From his chair the same spear
     and the door went. RUN TWO renames the two-handers (rule 194(b)); this gate holds the fight's half: when a two-hander puts
     the door on his back, the fight says it, blaming the weapon (rule 194(c)).
   Legs:
   V1 ten fights in a row, a militia spear and a car door: both in his hands in every fight he stands in; after every fight the
      crew screen and the company hand-over carry both; a fight that takes him off the line (struck down, dead) is named by the
      crew screen's own line;
   V2 the bag, on his phone (390 x 844 at 3x) and his computer (1440 x 900): a two-hander swapped out of the bag puts the door on
      his back and the line says the weapon takes both hands and the door rides on his back; the one-hander back, the door is
      on his arm again, said; the weapon card says where the door is;
   V3 the open, both profiles: a man handed a two-hander and a car door hears it at the fight's first line;
   V4 nothing threw.
   Run: node gates/gear_never_vanishes_gate.js [--fights 10] */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '..'), PORT = 8896;
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp' };
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const argv = process.argv, NF = Number(argv[argv.indexOf('--fights') + 1]) || 10;
const DEMO = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_DEMO.html'), 'utf8');
const cut = (re, what) => { const m = DEMO.match(re); if (!m) { console.log('  FAIL the demo has no ' + what); process.exit(1); } return m[0]; };
const DOOR = [cut(/var BOH_START = \(function\(\)\{[\s\S]*?\nwindow\.BOH_START = BOH_START;/, 'BOH_START'),
  cut(/function nfKind\(district\)\{[\s\S]*?\n\}/, 'nfKind'), cut(/function nfOpts\(d\)\{[\s\S]*?\n\}/, 'nfOpts'), 'window.nfOpts = nfOpts;'].join('\n');
const AFTER = cut(/function nfAfterKeep\(d\)\{[\s\S]*?\n\}/, 'nfAfterKeep');
const WHO = 'RAUL', SPEAR = 'militia_spear', CAR_DOOR = 'wooden_shield', TWO = 'warfork';
const srv = http.createServer((rq, rs) => {
  const u = decodeURIComponent(rq.url.split('?')[0]);
  if (u === '/slices/__door.html') { rs.setHeader('content-type', 'text/html'); return rs.end('<!doctype html><meta charset="utf-8"><body><div id="newco"></div></body>'); }
  const f = path.join(ROOT, u.replace(/^\/+/, ''));
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
  rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
});
const B = 'http://127.0.0.1:' + PORT;
const done = () => { console.log('=== GEAR NEVER VANISHES GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

(async () => {
  await new Promise(r => srv.listen(PORT, '127.0.0.1', r));
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const errs = [];
  /* ---- V1: ten fights in a row, his whole path ---- */
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
    const w0 = await ctx.newPage(); await w0.goto(B + '/slices/__door.html');
    await w0.evaluate(() => { localStorage.clear(); localStorage.setItem('bohemia.start', JSON.stringify({ combat: 'new', econ: 'full', origin: 'newcrew', name: 0 })); }); await w0.close();
    const door = async (p) => { await p.evaluate(src => { (0, eval)(src); }, DOOR); await p.waitForFunction(() => window.BOH_START && BOH_START.data(), null, { timeout: 20000 }); };
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push('settlement: ' + e.message));
    await p.goto(B + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html', { waitUntil: 'load' });
    await door(p);
    await p.waitForFunction(() => window.BohemiaSettlement && BohemiaSettlement.ready() && BohemiaSettlement.traitsIn(), null, { timeout: 30000 });
    const F = () => p.frames().find(f => /ROSTER_SCREEN/.test(f.url()));
    const crewOpen = async () => {
      await p.evaluate(() => { try { if (window.BohemiaCrewDoor && BohemiaCrewDoor.isOpen()) BohemiaCrewDoor.close(); } catch (e) {} });
      await p.evaluate(() => BohemiaSettlement.open({ place: { tier: 'town', name: 'THE WASH, NORTH LAS VEGAS' }, traits: [], night: false, batteries: 9999 })); await p.waitForTimeout(500);
      await p.evaluate(() => { const c = document.getElementById('close'); if (c && c.offsetParent) c.click(); }); await p.waitForTimeout(200);
      await p.click('#crew'); await p.waitForTimeout(300);
      for (let i = 0; i < 80 && !(F() && await F().evaluate(() => window.BohemiaRosterScreen && BohemiaRosterScreen.state.ready).catch(() => false)); i++) await p.waitForTimeout(250);
      await p.waitForTimeout(400); return F(); };
    const read = (R) => R.evaluate(n => { const s = BohemiaRosterScreen.state, m = s.crew.find(x => x.name === n), co = JSON.parse(localStorage.getItem('bohemia.company.v1') || 'null') || [], c = co.find(x => x.name === n);
      return { screen: m ? { main: m.gear.main && m.gear.main.id, off: m.gear.off && m.gear.off.id, dead: !!m.dead, hurt: m.hurt && m.hurt.days } : null,
        company: c ? { main: c.gear.main, off: c.gear.off } : null, said: (document.getElementById('said') || {}).textContent || '' }; }, WHO);
    let R = await crewOpen();
    /* the spear and the door in the stash, as the market leaves them; then his own hands, the real drag */
    await R.evaluate(a => { const C = window.BohemiaRoster, S = BohemiaRosterScreen.state; S.bag.push(C.itemOf('weapon', a.main)); S.bag.push(C.itemOf('shield', a.off));
      localStorage.setItem('bohemia.bag.v1', JSON.stringify(S.bag)); BohemiaRosterScreen.choose(S.sel); }, { main: SPEAR, off: CAR_DOOR });
    await p.waitForTimeout(300);
    const fr = p.frameLocator('#crewdoor iframe');
    const centre = async (loc) => { await loc.scrollIntoViewIfNeeded(); const q = await loc.boundingBox(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 }; };
    const drag = async (a, z) => { await p.mouse.move(a.x, a.y); await p.mouse.down(); await p.mouse.move(a.x + 10, a.y - 10, { steps: 3 }); await p.mouse.move(z.x, z.y, { steps: 14 }); await p.mouse.up(); await p.waitForTimeout(400); };
    await fr.locator('#lines .cell.full[aria-label="' + WHO + '"]').first().click(); await p.waitForTimeout(400);
    const nameOf = id => R.evaluate(id => { const it = BohemiaRosterScreen.state.bag.find(i => i.id === id); return it && it.name; }, id);
    const n1 = await nameOf(SPEAR), n2 = await nameOf(CAR_DOOR);
    await drag(await centre(fr.locator('#bag .slot.full[aria-label="' + n1 + '"]').first()), await centre(fr.locator('#card .gslot[data-slot="main"]').first()));
    await drag(await centre(fr.locator('#bag .slot.full[aria-label="' + n2 + '"]').first()), await centre(fr.locator('#card .gslot[data-slot="off"]').first()));
    const eq = await read(R);
    const theDoor = async (day) => { const d = await ctx.newPage(); d.on('pageerror', e => errs.push('door: ' + e.message)); await d.goto(B + '/slices/__door.html'); await d.evaluate(() => { window.NF = {}; }); await door(d);
      const o = await d.evaluate(day => JSON.parse(JSON.stringify(nfOpts({ district: 'downtown', world: { night: false, day: day }, at: { gx: 4, gy: 4 }, party: { count: 2, days: 1, faction: 'brigands', difficulty: 0 } }))), day); await d.close(); return o; };
    const rows = [], bad = [];
    let stood = 0, off = 0, named = 0;
    for (let k = 1; k <= NF; k++) {
      const o = await theDoor(k + 1), handed = (o.company || []).find(m => m.name === WHO);
      const f = await ctx.newPage(); f.on('pageerror', e => errs.push('fight ' + k + ': ' + e.message));
      await f.addInitScript(o => { window.FIGHT_OPTS = Object.assign({ seed: 40 + o.__k, speed: 40, auto: true }, o); }, Object.assign({ __k: k }, o));
      await f.goto(B + '/slices/BOHEMIA_FIGHT.html');
      await f.waitForFunction(() => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length, null, { timeout: 60000 });
      const held = n => { const u = FIGHT.S.units.find(v => v.side === 'you' && v.name === n); return u ? { main: u.weapon && (u.weapon.of || u.weapon).id, off: u.shield && u.shield.id, back: u.shieldBack && u.shieldBack.id } : null; };
      const inF = await f.evaluate(held, WHO);
      await f.waitForFunction(() => FIGHT.S.over, null, { timeout: 240000 }).catch(() => {});
      const endF = await f.evaluate(held, WHO), msg = await f.evaluate(() => { try { return homeMessage(FIGHT.S.result); } catch (e) { return null; } });
      await f.close();
      const kp = await ctx.newPage(); await kp.goto(B + '/slices/__door.html');
      await kp.evaluate(a => { window.NF = { day: a.day }; (0, eval)(a.src + '\nwindow.__k = nfAfterKeep;'); return window.__k(a.msg); }, { src: AFTER, msg, day: k + 1 }); await kp.close();
      R = await crewOpen(); const r = await read(R);
      if (inF) { stood++; if (inF.main !== SPEAR || inF.off !== CAR_DOOR || !endF || endF.main !== SPEAR || endF.off !== CAR_DOOR) bad.push('fight ' + k + ' held ' + JSON.stringify(inF) + ' -> ' + JSON.stringify(endF)); }
      else if (!handed) { off++; }
      if (!r.screen || r.screen.main !== SPEAR || r.screen.off !== CAR_DOOR) bad.push('after ' + k + ' the crew screen ' + JSON.stringify(r.screen));
      const out = r.screen && (r.screen.dead || r.screen.hurt > 0);
      if (out) { if (/laid up|dead/i.test(r.said) || off > 0) named++; else bad.push('after ' + k + ' off the line unsaid'); }
      else if (!r.company || r.company.main !== SPEAR || r.company.off !== CAR_DOOR) bad.push('after ' + k + ' the hand-over ' + JSON.stringify(r.company));
      rows.push(k + (inF ? ':' + (inF.main === SPEAR && inF.off === CAR_DOOR ? 'both' : 'MISSING') : ':off') + (out ? '(' + (r.screen.dead ? 'dead' : 'laid up ' + r.screen.hurt) + ')' : ''));
    }
    leg(eq.screen && eq.screen.main === SPEAR && eq.screen.off === CAR_DOOR && stood >= Math.min(5, NF) && bad.length === 0,
      '*** V1 TEN FIGHTS IN A ROW, HIS SPEAR AND HIS CAR DOOR NEVER VANISH *** (rule 191(b)): in his hands in every fight he stands in, on the crew screen and in the hand-over after each; off the line only when the fight takes him, and the crew screen says so',
      rows.join(' ') + (bad.length ? ' | ' + bad.slice(0, 3).join('; ') : ''));
    await ctx.close();
  }
  /* ---- V2 and V3, both profiles ---- */
  for (const prof of [{ name: 'phone', o: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true } }, { name: 'computer', o: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } }]) {
    const ctx = await b.newContext(prof.o);
    const page = async (company) => { const f = await ctx.newPage(); f.on('pageerror', e => errs.push(prof.name + ': ' + e.message));
      await f.addInitScript(c => { window.FIGHT_OPTS = { seed: 7, speed: 1, kind: 'suburb', flat: true, deploy: false, formation: null, band: ['brigand_thug'], company: c }; }, company);
      await f.goto(B + '/slices/BOHEMIA_FIGHT.html');
      await f.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round, null, { timeout: 60000 }); await f.waitForTimeout(300); return f; };
    const man = (main, off, bag) => [{ background: 'companion_1hand', name: 'YOU', main: true, gear: { main: main, off: off, body: null, head: null, bag: bag } }];
    /* V3: the open */
    let f = await page(man(TWO, CAR_DOOR, []));
    const open = await f.evaluate(() => ({ say: document.getElementById('say').innerText, u: (() => { const u = FIGHT.alive('you')[0]; return { back: u.shieldBack && u.shieldBack.id, off: u.shield && u.shield.id }; })() }));
    const card3 = await f.evaluate(() => { const u = FIGHT.alive('you')[0]; try { weaponCard(u); } catch (e) { return 'threw ' + e.message; } return document.getElementById('drawer').textContent; });
    leg(open.u.back === CAR_DOOR && !open.u.off && /takes both hands/.test(open.say) && /car door rides on (his|your) back/.test(open.say) && /Car door\s*on (his|your) back/.test(card3),
      '*** V3 ' + prof.name.toUpperCase() + ': A TWO-HANDER AND A CAR DOOR, SAID AT THE OPEN *** (rule 191(b), 194(c)): the first line blames the weapon, the card says the door is on his back',
      open.say.replace(/\n/g, ' / ').slice(0, 140) + ' | card ' + ((card3.match(/Car door[^A-Z]*/) || ['none'])[0]));
    await f.close();
    /* V2: the bag, a real tap on his bag square on his turn */
    f = await page(man(SPEAR, CAR_DOOR, [TWO]));
    for (let i = 0; i < 80; i++) { const st = await f.evaluate(() => { const u = FIGHT.current(); return !u ? 'none' : u.side === 'you' && !FIGHT_UI.anim.length && performance.now() > FIGHT_UI.openUntil ? 'mine' : u.side === 'you' ? 'busy' : 'theirs'; });
      if (st === 'mine') break; await f.waitForTimeout(250); }
    const tapBag = async () => { await f.evaluate(() => { const u = FIGHT.current(); u.ap = u.apTurn; hud(); }); await f.waitForTimeout(150);
      const q = await f.evaluate(() => { const b = document.querySelector('#skills [data-bag="0"]'); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, off: b.disabled }; });
      if (!q || q.off) return null;
      if (prof.name === 'computer') await f.mouse.click(q.x, q.y); else await f.touchscreen.tap(q.x, q.y);
      await f.waitForTimeout(400);
      return f.evaluate(() => { const u = FIGHT.current(); return { say: document.getElementById('say').innerText, main: (u.weapon.of || u.weapon).id, off: u.shield && u.shield.id, back: u.shieldBack && u.shieldBack.id }; }); };
    const s1 = await tapBag();
    const card2 = await f.evaluate(() => { const u = FIGHT.current(); try { weaponCard(u); } catch (e) { return 'threw ' + e.message; } const t = document.getElementById('drawer').textContent; document.getElementById('drawer').style.display = 'none'; return t; });
    const s2 = await tapBag();
    leg(!!s1 && s1.main === TWO && s1.back === CAR_DOOR && !s1.off && /takes both hands/.test(s1.say) && /rides on (his|your) back/.test(s1.say) && /Car door\s*on (his|your) back/.test(card2)
      && !!s2 && s2.main === SPEAR && s2.off === CAR_DOOR && !s2.back && /back on .*arm/.test(s2.say),
      '*** V2 ' + prof.name.toUpperCase() + ': THE BAG SAYS WHERE THE DOOR WENT *** (rule 191(b)): the two-hander out, the door on his back and said, the card too; the spear back, the door on his arm and said',
      (s1 ? s1.say.replace(/\n/g, ' / ').slice(0, 110) : 'no bag square') + ' || ' + (s2 ? s2.say.replace(/\n/g, ' / ').slice(0, 90) : 'no second swap'));
    await f.close(); await ctx.close();
  }
  leg(errs.length === 0, 'V4 nothing threw', errs.slice(0, 3).join(' | '));
  await b.close(); srv.close(); done();
})().catch(e => { console.log('  FAIL the gate crashed: ' + e.message); fail++; done(); });
