/* SCRAP IS TAPE GATE (RUN FOUR [scrap is tape], VAMILY rule 276(a)(d), 10/26/26; RE-AIMED for [one roll a fight], rule 284(h), the
   same day: the two rows stacked to thirteen rolls a road fight on the live demo (40 -> 53) and he said 'you're about to crash my
   economy... make it so I get one duct tape or something like that as a baseline').
   PAOLO 10/26: 'at the end of the fight it says I won scrap, but what the fuck is scrap, and why am I not getting more duct tape for my
   armour'; then 'I'm winning way too much duct tape after each fight'.
   MEASURED BEFORE 276: the end screen counted SCRAP into a purse count nothing reads. BEFORE 284: 2 rolls a wrecked piece and 2 or 3 a
   kill, 13 a road fight.
     T1 THE DATA: the loot's one count is TAPE, no scrap; ECONOMY's per_won_fight is the one (records/target/bb/tape_income.json),
        per_kill and tape_per_scrap 0, loot.json's fallback 0: a won fight with a dead man and two wrecked pieces leaves exactly the one
     T5 400 ROLLED FIGHTS on real enemy rows, some run, some beasts: every won fight +1 whatever the kills and the wrecks (rule 284(h))
     T2 THE SCREEN, phone and computer: '+1 TAPE' with the tape roll; LOOT ALL (a real tap) raises the company's tape (bohemia.supplies
        .v1, the bar's own) by one, LEAVE never twice; a lost fight and a pulled-out fight leave no tape; no 'scrap' on the screen
     T3 THE DEMO, phone and computer: a road fight won through the map's own door, their armour wrecked: the end screen says +1 TAPE,
        LOOT ALL raises the company's tape by one, the purse's resources by the rounds alone; nothing on the end screen says scrap
     T4 AN OLD SAVE'S SCRAP CONVERTS NOTHING MORE (rule 284(f)): a ledger line 'loot: 3 rounds, 5 scrap' adds no tape; tape already
        in the save stays
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
  const TI = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/tape_income.json'), 'utf8'));
  const ONE = TI.loot_tape.per_won_fight && TI.loot_tape.per_won_fight.value;   /* the fight's one roll (rule 284(a)), TUNING's to move */
  const body = { name: 'THUG', dead: true, weapon: { id: 'knife', cls: 'dagger', durability: 32 }, body: { id: 'padded_surcoat', now: 0, max: 50 }, head: { id: 'full_leather_cap', now: 2, max: 45 } };
  const f1 = SP.found({ bodies: [body, Object.assign({}, body, { name: 'RAIDER' })] }, Object.assign({}, L, { tape_income: TI }), () => 0.5);
  ok('T1 THE DATA: the one TAPE count, no scrap; ONE roll a won fight (' + ONE + '), none a kill or a wrecked piece; two dead men with four wrecked pieces leave exactly ' + ONE,
    !!L.counts.tape && L.counts.tape.to === 'supplies.tape' && !L.counts.scrap && ONE === 1 && TI.loot_tape.per_kill.value.every(v => v === 0) && TI.salvage.tape_per_scrap.value === 0
      && L.counts.tape.per_wrecked_piece === 0 && f1.counts.tape === ONE && !('scrap' in f1.counts),
    JSON.stringify(f1.counts) + ', per_kill ' + JSON.stringify(TI.loot_tape.per_kill.value) + ', per wrecked piece ' + TI.salvage.tape_per_scrap.value);
  /* T5 (rule 284(h)): 400 rolled fights, real enemy rows, some run, some beasts */
  {
    const EN = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/enemies.json'), 'utf8')), rows = (EN.rows || EN).filter(e => e && e.id);
    let fights = 0, kills = 0, wrecks = 0, bad = 0;
    for (let c = 0; c < 400; c++) {
      let x = (9001 + c * 7919) >>> 0; const r = () => { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; };
      const n = 1 + Math.floor(r() * 8), bodies = [];
      for (let i = 0; i < n; i++) { const z = r(); bodies.push({ name: 'M' + i, kind: rows[Math.floor(r() * rows.length)].id, dead: z < 0.8, fled: z >= 0.8, beast: r() < 0.1,
        weapon: { id: 'knife', cls: 'dagger', durability: 32 }, body: { id: 'padded_surcoat', now: Math.floor(r() * 50), max: 50 } }); }
      const o = SP.found({ bodies }, Object.assign({}, L, { tape_income: TI }), r);
      fights++; kills += bodies.filter(b => b.dead && !b.beast).length; wrecks += bodies.filter(b => b.dead && !b.beast && b.body.now <= 30).length;
      if (o.counts.tape !== ONE) bad++;
    }
    ok('T5 400 ROLLED FIGHTS on real enemy rows: every won fight +' + ONE + ' whatever the kills (' + kills + ') and the wrecked pieces (' + wrecks + ')', bad === 0 && kills > 0 && wrecks > 0, bad + ' fights off the one');
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
    /* a lost fight and a pulled-out fight: no tape (rule 284(a)) */
    const t6 = await p.evaluate(() => { const S = BohemiaSpoilsScreen.state, out = {};
      ['lost', 'ran'].forEach(k => { const smp = JSON.parse(JSON.stringify(BohemiaSpoilsScreen.SAMPLE)); smp.result = 'lost'; smp.retreat = k === 'ran'; BohemiaSpoilsScreen.open({ fight: smp, seed: 7 }); out[k] = (S.counts || {}).tape | 0; });
      return out; });
    ok('T2 ' + name + ': \'+1 TAPE\' with the tape roll; LOOT ALL (a real tap) raises the company\'s tape by one (7 -> ' + t1 + '), LEAVE never twice; a lost and a pulled-out fight leave none; no "scrap" on the screen',
      t0 === ONE && !!c0 && /\+1 TAPE/.test(c0.t) && /supply_icons\/tape\.png/.test(c0.icon) && t1 === 7 + ONE && t2 === t1 && t6.lost === 0 && t6.ran === 0 && !/scrap/i.test(words),
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
        const k3 = await f.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them' && u.dead && !u.beast && !u.ghost).length);
        ok('T3 ' + name + ': a road fight won (' + k3 + ' dead, their armour wrecked): the end screen says +1 TAPE, LOOT ALL (a real tap) raises the company\'s tape by one, the purse\'s resources by the rounds alone; no "scrap" on it',
          s0.counts.tape === ONE && /\+1 TAPE/.test(s0.t) && k3 > 1 && tape1 === tape0 + ONE && res1 - res0 === (s0.counts.rounds | 0) && !/scrap/i.test(words),
          JSON.stringify(s0.counts) + '; tape ' + tape0 + ' -> ' + tape1 + ', resources ' + res0 + ' -> ' + res1);
        /* T4: an old save's ledger line, as the shell used to write it */
        const t4 = await p.evaluate(() => { const w = document.getElementById('cityFrame').contentWindow, pu = w.purseGet();
          w.BohemiaPurse.credit(pu, 'resources', 8, 'loot: 3 rounds, 5 scrap', 'loot:old-save-gate:goods', 1);
          const a = JSON.parse(localStorage.getItem('bohemia.supplies.v1')).tape, n1 = spoilsScrapToTape(), b1 = JSON.parse(localStorage.getItem('bohemia.supplies.v1')).tape, n2 = spoilsScrapToTape(), c1 = JSON.parse(localStorage.getItem('bohemia.supplies.v1')).tape;
          return { a, n1, b1, n2, c1 }; });
        ok('T4 ' + name + ': AN OLD SAVE\'S SCRAP CONVERTS NOTHING MORE (rule 284(f)): a ledger line "loot: 3 rounds, 5 scrap" adds no tape; the tape in the save stays', (t4.n1 === 0 || t4.n1 === null) && t4.b1 === t4.a && t4.c1 === t4.a && t4.a > 0, JSON.stringify(t4));
      }
      ok('    ' + name + ': nothing threw on the demo', errs.length === 0, errs.slice(0, 3).join(' | '));
    } catch (e) { ok('T3 ' + name + ' ran to the end [' + String(e && e.message).slice(0, 200) + ']', false); }
    try { await d.close(); } catch (_e) {}
  }
  done();
})();
