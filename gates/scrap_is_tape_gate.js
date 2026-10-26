/* SCRAP IS TAPE GATE (RUN FOUR [scrap is tape], VAMILY rule 276(a)(d), 10/26/26).
   PAOLO 10/26: 'at the end of the fight it says I won scrap, but what the fuck is scrap, and why am I not getting more duct tape for my
   armour... I made it to day four and I couldn't find anywhere to get repair items like duct tape... this run's over.'
   MEASURED BEFORE: the end screen counted SCRAP ('what was left of it', a crate icon); it was posted to the shell as part of a
   'resources' count credited to the purse, which nothing he uses reads. It never became tape and never mended anything.
     T1 THE DATA: the loot file has a TAPE count (a roll a wrecked piece, to the company's tape) and no scrap; the drop rules give tape
        for a wrecked piece and no scrap key at all
     T2 THE SCREEN, phone and computer: the count reads TAPE with the tape roll beside it; LOOT ALL (a real tap) raises the company's
        tape (bohemia.supplies.v1, the bar's own) by it, and LEAVE never adds it twice; the word 'scrap' is nowhere on the screen
     T3 THE DEMO, phone and computer: a road fight won through the map's own door, their armour wrecked: the end screen says TAPE, LOOT
        ALL raises the company's tape by it, the purse's resources by the rounds alone; nothing on the end screen says scrap
     T5 THE DEAD CARRY TAPE (RUN FOUR [tape in the loot], rule 271(a)(c)): 400 rolled fights: every man of theirs killed carried
        ECONOMY's two or three rolls in his kit (records/target/bb/tape_income.json loot_tape.per_kill), so every fight with a kill
        leaves tape; nothing off the men who ran or a beast; and on the live demo the kits' tape is on the end screen
     T4 AN OLD SAVE'S SCRAP CONVERTS: a purse entry 'loot: 3 rounds, 5 scrap' from before becomes 5 times ECONOMY's rolls a piece
        (records/target/bb/tape_income.json salvage.tape_per_scrap, two), once
   node gates/scrap_is_tape_gate.js */
'use strict';
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.join(__dirname, '..');
const SP = require(path.join(ROOT, 'engine/bohemia_spoils.js'));
let pass = 0, fail = 0;
const ok = (n, c, x) => { c ? pass++ : fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('=== SCRAP IS TAPE GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };
const TYPE = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2' };

(async () => {
  /* ---- T1 ---- */
  const L = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/loot.json'), 'utf8'));
  const TI = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/tape_income.json'), 'utf8')), PER = TI.salvage.tape_per_scrap.value;   /* ECONOMY's rolls a wrecked piece */
  const body = { name: 'THUG', dead: true, weapon: { id: 'knife', cls: 'dagger', durability: 32 }, body: { id: 'padded_surcoat', now: 0, max: 50 }, head: { id: 'full_leather_cap', now: 2, max: 45 } };
  const KIT = TI.loot_tape.per_kill.value;   /* ECONOMY's rolls in a dead man's kit, [least, most] */
  const f1 = SP.found({ bodies: [body] }, Object.assign({}, L, { tape_income: TI }), () => 0.5);
  const kit1 = KIT[0] + Math.floor(0.5 * (KIT[1] - KIT[0] + 1));
  ok('T1 THE DATA: a TAPE count (to the company\'s tape), no scrap; one dead man with two wrecked pieces leaves 2 x ' + PER + ' rolls off the pieces and ' + kit1 + ' out of his kit, no scrap key',
    !!L.counts.tape && L.counts.tape.to === 'supplies.tape' && !L.counts.scrap && PER > 0 && f1.wreckTape === 2 * PER && f1.kitTape === kit1 && f1.counts.tape === 2 * PER + kit1 && !('scrap' in f1.counts),
    JSON.stringify(f1.counts) + ', off the pieces ' + f1.wreckTape + ', out of the kit ' + f1.kitTape);
  /* T5 THE DEAD CARRY TAPE (rule 271(a)(c)): 400 rolled fights, real enemy rows, some run, some beasts */
  {
    const EN = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/enemies.json'), 'utf8')), rows = (EN.rows || EN).filter(e => e && e.id);
    let fights = 0, withTape = 0, kills = 0, kitSum = 0, bad = 0, noneOffTheLiving = true;
    for (let c = 0; c < 400; c++) {
      let x = (9001 + c * 7919) >>> 0; const r = () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; };
      const n = 1 + Math.floor(r() * 8), bodies = [];
      for (let i = 0; i < n; i++) { const z = r(); bodies.push({ name: 'M' + i, kind: rows[Math.floor(r() * rows.length)].id, dead: z < 0.8, fled: z >= 0.8, beast: r() < 0.1,
        weapon: { id: 'knife', cls: 'dagger', durability: 32 }, body: { id: 'padded_surcoat', now: Math.floor(r() * 50), max: 50 } }); }
      const o = SP.found({ bodies }, Object.assign({}, L, { tape_income: TI }), r), k = bodies.filter(b => b.dead && !b.beast).length;
      fights++; kills += k; kitSum += o.kitTape | 0;
      if (k > 0 && o.counts.tape > 0) withTape++;
      if (k === 0 && (o.kitTape | 0) > 0) noneOffTheLiving = false;
      if ((o.kitTape | 0) < KIT[0] * k || (o.kitTape | 0) > KIT[1] * k || o.counts.tape !== (o.kitTape | 0) + (o.wreckTape | 0)) bad++;
    }
    ok('T5 THE DEAD CARRY TAPE: 400 rolled fights: every fight with a man of theirs killed leaves tape, ' + KIT[0] + ' to ' + KIT[1] + ' rolls a kill out of their kits (ECONOMY\'s), a mean of ' + (kitSum / Math.max(1, kills)).toFixed(2) + '; nothing off the men who ran or the beasts',
      bad === 0 && noneOffTheLiving && kitSum / kills > KIT[0] && kitSum / kills < KIT[1] && withTape > 0,
      withTape + ' fights with tape, ' + kills + ' kills, ' + kitSum + ' rolls from kits, ' + bad + ' out of the line');
  }

  /* ---- T2 the screen ---- */
  const srv = http.createServer((rq, rs) => {
    const f = path.join(ROOT, decodeURIComponent(rq.url.split('?')[0]).replace(/^\/+/, ''));
    if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { rs.statusCode = 404; return rs.end(); }
    rs.setHeader('content-type', TYPE[path.extname(f)] || 'application/octet-stream'); fs.createReadStream(f).pipe(rs);
  });
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const { chromium } = require('/opt/node22/lib/node_modules/playwright');
  const b = await chromium.launch(), serrs = [];
  for (const [w, h, mob, name] of [[390, 844, true, 'PHONE'], [1280, 800, false, 'COMPUTER']]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h }, isMobile: mob, hasTouch: mob })).newPage();
    p.on('pageerror', e => serrs.push(name + ': ' + e.message));
    await p.goto('http://127.0.0.1:' + srv.address().port + '/slices/BOHEMIA_SPOILS_SCREEN.html');
    await p.waitForFunction(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened, null, { timeout: 30000 });
    const t0 = await p.evaluate(() => { localStorage.setItem('bohemia.supplies.v1', JSON.stringify({ origin: 'newcrew', food: 21, tape: 7, meds: 3, rounds: 40 })); localStorage.setItem('bohemia.bag.v1', '[]');
      const smp = JSON.parse(JSON.stringify(BohemiaSpoilsScreen.SAMPLE)); smp.spoils.bodies.forEach(x => { if (x.body) x.body.now = 0; if (x.head) x.head.now = 0; });
      BohemiaSpoilsScreen.open({ fight: smp, seed: 7 }); return (BohemiaSpoilsScreen.state.counts || {}).tape | 0; });
    await p.waitForTimeout(400);
    const c0 = await p.evaluate(() => { const c = document.querySelector('#counts .count[data-count=tape]');
      return c ? { t: c.textContent, icon: getComputedStyle(c, '::before').backgroundImage } : null; });
    await p.locator('#lootall').scrollIntoViewIfNeeded(); if (mob) await p.tap('#lootall'); else await p.click('#lootall');
    await p.waitForTimeout(300);
    const t1 = await p.evaluate(() => JSON.parse(localStorage.getItem('bohemia.supplies.v1')).tape);
    await p.evaluate(() => BohemiaSpoilsScreen.leave()); await p.waitForTimeout(150);
    const t2 = await p.evaluate(() => JSON.parse(localStorage.getItem('bohemia.supplies.v1')).tape);
    const words = await p.evaluate(() => document.body.innerText + ' ' + [].map.call(document.querySelectorAll('[aria-label],[title]'), e => (e.getAttribute('aria-label') || '') + ' ' + (e.getAttribute('title') || '')).join(' '));
    ok('T2 ' + name + ': the count reads TAPE with the tape roll beside it; LOOT ALL (a real tap) raises the company\'s tape by it (7 -> ' + t1 + '), LEAVE does not add it twice; no "scrap" on the screen',
      t0 > 0 && !!c0 && /\+\d+ TAPE/.test(c0.t) && /supply_icons\/tape\.png/.test(c0.icon) && t1 === 7 + t0 && t2 === t1 && !/scrap/i.test(words),
      c0 ? c0.t.replace(/\s+/g, ' ') + ', ' + c0.icon.replace(/^.*\//, '').replace(/"?\)$/, '') : 'no tape count');
  }
  await b.close(); srv.close();
  ok('    nothing threw on the screen', serrs.length === 0, serrs.slice(0, 2).join(' | '));

  /* ---- T3 T4 the demo ---- */
  const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
  for (const prof of ['phone_portrait', 'computer']) {
    const name = prof === 'computer' ? 'COMPUTER' : 'PHONE';
    let d;
    try { d = await drive.open({ profile: prof, keepCards: true, engage: true, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
    catch (e) { ok('T3 ' + name + ' the demo boots [' + String(e.message).slice(0, 160) + ']', false); continue; }
    const p = d.page, fr = d.fr, errs = []; p.on('pageerror', e => errs.push(e.message));
    try {
      await p.waitForTimeout(2500);
      const sup = () => p.evaluate(() => (JSON.parse(localStorage.getItem('bohemia.supplies.v1') || '{}') || {}).tape);
      const tape0 = await sup(), res0 = await fr.evaluate(() => BohemiaPurse.balance(purseGet(), 'resources'));
      await fr.evaluate(() => { try { stepOnce(0); stepOnce(4); } catch (_e) {} roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 81 }); });
      let f = null;
      for (let i = 0; i < 200 && !f; i++) { const hh = await p.$('#fightFrame'); if (hh) { const c = await hh.contentFrame();
        if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
      if (!f) { ok('T3 ' + name + ': a road fight through the map\'s own door', false); }
      else {
        await f.evaluate(() => { const S = FIGHT.S; S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; u.armB = 0; u.armH = 0; }); S.over = true; S.result = 'won'; showOver('won'); });
        const SF = () => p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
        for (let i = 0; i < 100 && !(SF() && await SF().evaluate(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened).catch(() => false)); i++) await p.waitForTimeout(200);
        const sf = SF();
        const s0 = await sf.evaluate(() => ({ counts: BohemiaSpoilsScreen.state.counts, t: (document.querySelector('#counts .count[data-count=tape]') || {}).textContent || '' }));
        const L2 = p.frameLocator('#spoilsdoor iframe').locator('#lootall');
        if (prof === 'computer') await L2.click(); else await L2.tap();
        await p.waitForTimeout(600);
        const tape1 = await sup(), res1 = await fr.evaluate(() => BohemiaPurse.balance(purseGet(), 'resources'));
        const words = await sf.evaluate(() => document.body.innerText);
        const k3 = await f.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them' && u.dead && !u.beast && !u.ghost).length), kit3 = await sf.evaluate(() => BohemiaSpoilsScreen.state.found.kitTape | 0);
        ok('T3 ' + name + ': a road fight won, their armour wrecked: the end screen says TAPE (off the pieces and ' + kit3 + ' out of ' + k3 + ' dead men\'s kits), LOOT ALL (a real tap) raises the company\'s tape by it, the purse\'s resources by the rounds alone; no "scrap" on it',
          (s0.counts.tape | 0) > 0 && /TAPE/.test(s0.t) && k3 > 0 && kit3 >= 2 * k3 && kit3 <= 3 * k3 && tape1 === tape0 + (s0.counts.tape | 0) && res1 - res0 === (s0.counts.rounds | 0) && !/scrap/i.test(words),
          JSON.stringify(s0.counts) + '; tape ' + tape0 + ' -> ' + tape1 + ', resources ' + res0 + ' -> ' + res1);
        /* T4: an old save's ledger line, as the shell used to write it */
        const t4 = await p.evaluate(() => { const w = document.getElementById('cityFrame').contentWindow, pu = w.purseGet();
          w.BohemiaPurse.credit(pu, 'resources', 8, 'loot: 3 rounds, 5 scrap', 'loot:old-save-gate:goods', 1);
          const a = JSON.parse(localStorage.getItem('bohemia.supplies.v1')).tape, n1 = spoilsScrapToTape(), b1 = JSON.parse(localStorage.getItem('bohemia.supplies.v1')).tape, n2 = spoilsScrapToTape(), c1 = JSON.parse(localStorage.getItem('bohemia.supplies.v1')).tape;
          return { a, n1, b1, n2, c1 }; });
        ok('T4 ' + name + ': AN OLD SAVE\'S SCRAP CONVERTS: a ledger line "loot: 3 rounds, 5 scrap" becomes 5 x ' + PER + ' rolls of tape (ECONOMY: \'converts at the same two\'), once', t4.n1 === 5 * PER && t4.b1 === t4.a + 5 * PER && t4.n2 === 0 && t4.c1 === t4.b1, JSON.stringify(t4));
      }
      ok('    ' + name + ': nothing threw on the demo', errs.length === 0, errs.slice(0, 3).join(' | '));
    } catch (e) { ok('T3 ' + name + ' ran to the end [' + String(e && e.message).slice(0, 200) + ']', false); }
    try { await d.close(); } catch (_e) {}
  }
  done();
})();
