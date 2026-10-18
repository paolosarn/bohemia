/* ==========================================================================
   THE ORIGIN SETS THE COMPANY  (RUN, 10/5/26, VAMILY [the origin sets the company], rule 75a)

   PAOLO 10/5: "depending on your origin, that's how many people will be in your group... Lone Wolf, some
   super soldier by himself... peasant militia, up to 16 instead of 12... the demo has none of it."
   MEASURED BEFORE: the door's picks made no men at all; an origin's 'crew' changed the size of the ENEMY's
   crew on a job; every fight fielded the same twelve, whatever was picked.
   NOW (__THE_ORIGIN_SETS_THE_COMPANY__): records/target/bb/origins.json, Battle Brothers' fifteen from the
   wiki dump, is the truth the door reads: who you start with (background, level), the start money (the
   origin's High/Medium/Low funds = the shelves, at 10 crowns to 1 battery), the roster and field caps; the
   fight takes the company and stops at the cap.

   LEGS, on the demo:
     O1 the file is Battle Brothers' fifteen, each with men, funds and caps, every background a real one
     O2 the door reads it: every origin at every shelf builds exactly the file's company, cap and start
     O3 the card says what the game applies (the men, the cap, the start money)
     O4 *** BEGIN PAYS THE ORIGIN'S OWN START *** (THE LONE WOLF on bare shelves, picked with real taps)
     O5 *** THE FIGHT FIELDS THE COMPANY ***: THE LONE WOLF is one level-4 hedge knight alone
     O6 THE BLOCK WATCH fields its twelve peasants (cap 16), A NEW CREW its three companions
     O7 nothing threw
   node gates/the_origin_sets_the_company_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (n, c) => { if (c) { pass++; console.log('  ok   ' + n); } else { fail++; console.log('  FAIL ' + n); } };
const done = () => { console.log('THE ORIGIN SETS THE COMPANY: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

const FILE = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/origins.json'), 'utf8'));
const BGS = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/backgrounds.json'), 'utf8')).rows.map(r => r.id));
const byId = {}; FILE.origins.forEach(o => { byId[o.id] = o; });

(async () => {
  /* O1, the file itself */
  const os = FILE.origins;
  const bad = os.filter(o => !o.men.length || o.men.some(m => !BGS.has(m.background)) || !(o.field_cap >= 1) || !(o.roster_cap >= o.field_cap || o.roster_cap === 12)
    || ['full', 'thin', 'bare'].some(k => !(o.batteries[k] === Math.round(o.crowns[{ full: 'high', thin: 'medium', bare: 'low' }[k]] / 10))) || !/wiki|CORE_WIKITEXT|bb_all/.test(o.source));
  ok('O1 the file is Battle Brothers\' fifteen, each with men, funds and caps from the wiki (' + os.length + ' origins; '
    + 'THE LONE WOLF ' + byId.wolf.men.length + ' man, THE BLOCK WATCH ' + byId.watch.men.length + ' men cap ' + byId.watch.field_cap + ', THE DEBT COLLECTORS cap ' + byId.debt.field_cap + (bad.length ? '; wrong: ' + bad.map(o => o.id).join(' ') : '') + ')',
    os.length === 15 && bad.length === 0 && byId.wolf.men.length === 1 && byId.wolf.men[0].background === 'hedge_knight' && byId.wolf.men[0].level === 4
    && byId.watch.men.length === 12 && byId.watch.field_cap === 16 && byId.debt.field_cap === 16 && byId.newcrew.men.length === 3);

  let d, pre = {};
  try {
    d = await drive.open({ keepCards: true, beforeTap: async (page) => {
      await throughTheTitle(page);
      for (let i = 0; i < 60; i++) { if (await page.evaluate(() => !!(window.BOH_START && BOH_START.data && BOH_START.data()))) break; await page.waitForTimeout(250); }
      /* O2 and O3: every origin at every shelf, read off the door the way BEGIN reads it */
      pre.all = await page.evaluate(() => { const out = []; const keep = Object.assign({}, BOH_START.state);
        BOH_START.ORIGINS.forEach(o => ['full', 'thin', 'bare'].forEach(e => { BOH_START.state.origin = o.id; BOH_START.state.econ = e; const p = BOH_START.picks();
          out.push({ id: o.id, econ: e, men: p.company ? p.company.length : null, bg: p.company ? p.company.map(m => m.background + ':' + (m.level || '')).join(',') : '', cap: p.cap, start: p.start }); }));
        Object.assign(BOH_START.state, keep);
        const cards = [...document.querySelectorAll('#newco .org')].map(b => ({ id: b.dataset.v, text: b.textContent }));
        return { out, cards }; });
      /* O4: THE LONE WOLF and BARE SHELVES, with taps on the door's own buttons */
      const tap = async (sel) => { const r = await page.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; e.scrollIntoView({ block: 'center', inline: 'center' }); const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; }, sel);
        if (r) await page.touchscreen.tap(r.x, r.y); await page.waitForTimeout(300); return !!r; };
      pre.tapped = (await tap('#newco [data-k=origin][data-v=wolf]')) && (await tap('#newco [data-k=econ][data-v=bare]'));
      pre.picked = await page.evaluate(() => BOH_START.picks());
    } });
  } catch (e) { ok('the demo boots [' + String(e.message).slice(0, 160) + ']', false); return done(); }
  try {
    const want = [];
    os.forEach(o => ['full', 'thin', 'bare'].forEach(e => want.push({ id: o.id, econ: e, men: o.men.length, bg: o.men.map(m => m.background + ':' + (m.level || '')).join(','), cap: o.field_cap, start: o.batteries[e] })));
    const off = want.filter(w => { const g = pre.all.out.find(x => x.id === w.id && x.econ === w.econ); return !g || g.men !== w.men || g.bg !== w.bg || g.cap !== w.cap || g.start !== w.start; });
    ok('O2 the door reads it: every origin at every shelf builds the file\'s company, cap and start (' + (want.length - off.length) + ' of ' + want.length + (off.length ? '; off: ' + off.slice(0, 3).map(w => w.id + '/' + w.econ).join(' ') : '') + ')', off.length === 0);
    const cardOff = os.filter(o => { const c = pre.all.cards.find(x => x.id === o.id); if (!c) return true; const t = c.text;
      return t.indexOf(o.name) < 0 || t.indexOf('START ' + o.batteries.bare) < 0 && t.indexOf('START ' + o.batteries.thin) < 0 && t.indexOf('START ' + o.batteries.full) < 0
        || (o.men.length === 1 ? t.indexOf('JUST YOU') < 0 : t.indexOf(o.men.length + ' MEN') < 0) || t.indexOf(o.field_cap + ' IN A FIGHT') < 0; });
    ok('O3 the card says what the game applies (' + (os.length - cardOff.length) + ' of ' + os.length + ' cards name the men, the cap and the start' + (cardOff.length ? '; off: ' + cardOff.map(o => o.id).join(' ') : '') + ')', cardOff.length === 0);

    await d.page.waitForTimeout(3000);
    const bats = await d.fr.evaluate(() => loopBats());
    ok('*** O4 BEGIN PAYS THE ORIGIN\'S OWN START *** (picked by taps ' + pre.tapped + ': ' + pre.picked.originName + ', ' + pre.picked.econName + '; ' + bats + ' batteries, the file says ' + byId.wolf.batteries.bare + ')',
      pre.tapped && pre.picked.origin === 'wolf' && pre.picked.econ === 'bare' && bats === byId.wolf.batteries.bare);

    /* O5, O6: a fight for each, through the one door, counted on the fight's own board */
    const fight = async (origin) => {
      await d.page.evaluate((o) => { BOH_START.state.origin = o; }, origin);
      await d.fr.evaluate(() => { try { stepOnce(0); stepOnce(4); } catch (_e) {} roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: Date.now() % 1000 }); });
      let f = null; for (let i = 0; i < 150 && !f; i++) { const h = await d.page.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f = c; } if (!f) await d.page.waitForTimeout(200); }
      const got = f ? await f.evaluate(() => FIGHT.S.units.filter(u => u.side === 'you').map(u => ({ name: u.name, kind: u.kind, level: u.level, main: !!u.main }))) : null;
      if (f) { await f.evaluate(() => { FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }); }
      for (let i = 0; i < 60; i++) { if (await d.page.evaluate(() => !CITYFIGHT)) break; await d.page.waitForTimeout(250); }
      try { await d.page.evaluate(() => { try { nfHome(); } catch (_e) {} }); } catch (_e) {}
      await d.page.waitForTimeout(1500);
      return got;
    };
    const wolf = await fight('wolf');
    ok('*** O5 THE FIGHT FIELDS THE COMPANY *** (THE LONE WOLF: ' + (wolf ? wolf.length + ' on his side, ' + wolf.map(u => u.name + ' ' + u.kind + ' level ' + u.level).join(', ') : 'no fight') + ')',
      !!wolf && wolf.length === 1 && wolf[0].kind === 'hedge_knight' && wolf[0].level === 4 && wolf[0].main);
    const watch = await fight('watch'), fresh = await fight('newcrew');
    ok('O6 THE BLOCK WATCH fields its twelve peasants, A NEW CREW its three companions (' + (watch ? watch.length : '?') + ': ' + (watch ? [...new Set(watch.map(u => u.kind))].join(' ') : '') + '; ' + (fresh ? fresh.length : '?') + ': ' + (fresh ? fresh.map(u => u.kind).join(' ') : '') + ')',
      !!watch && watch.length === 12 && watch.every(u => /^(farmhand|poacher|daytaler|miller|fisherman|militia|minstrel|vagabond|butcher)$/.test(u.kind))
      && !!fresh && fresh.length === 3 && fresh.every(u => /^companion_/.test(u.kind)));
    ok('O7 nothing threw (' + d.errs.length + (d.errs.length ? ': ' + String(d.errs[0]).slice(0, 120) : '') + ')', d.errs.length === 0);
  } catch (e) {
    ok('the gate ran without throwing [' + String(e.message).slice(0, 200) + ']', false);
  }
  await d.close();
  done();
})();
