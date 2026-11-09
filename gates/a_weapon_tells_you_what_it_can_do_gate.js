/* ==========================================================================
   A WEAPON TELLS YOU WHAT IT CAN DO  (UI 8, 11/6/26, rule 397, ask line 437)

   PAOLO 11/4: 'when I click a weapon, it should tell me what sort of extra combat ability it gives me by default'.
   MEASURED BEFORE: no screen outside the fight said what a weapon's blows were. The fight's own hold-card named only
   its first blow; the crew screen's line and the shop's strip gave damage and reach; a spear's Spearwall, an axe's
   Split Shield, a whip's Disarm were nowhere he could read before he swung.
   NOW (slices/bohemia_ui_weapon_card.js): a tap on any weapon piece (a kit icon with the row's id, or the shop's
   data-item) shows its card: every blow in the fight's words (the skill's name in capitals, the main blow marked STRIKE,
   a gun's RELOAD), AP, BREATH, REACH, one plain line; NO SPECIAL ABILITY when it has only its blow.

   LEGS
     W1 *** EVERY WEAPON ROW *** (all of records/target/bb/weapons.json): its card lists every blow the fight gives it,
        worked out here from the files alone (the row's skills; a pistol, the row the fight rides for it plus the light
        crossbow's reload, ours.pistol_shot), each with the row's own AP and fatigue; NO SPECIAL ABILITY on exactly the
        rows with one blow and nothing else
     W2 every plain line is words, never the wiki's bare 'Direct Damage' or 'Fatigue', and no line is empty
     W3 *** THE CREW SCREEN *** (the stranger's state, the phone upright and the laptop): one tap on a weapon in the stash
        shows its card with its blows, and the comparison still comes (one tap still compares); one tap on his main hand's
        weapon shows that weapon's card; a tap on the man puts it away
     W4 *** THE SHOP *** (the demo, the smith, the phone upright): one tap on a weapon on the shelf shows its card, the
        strip still names the piece and nothing else changed
     M  planted: a card that drops each weapon's last blow turns W1 red
     Z  nothing threw
   node gates/a_weapon_tells_you_what_it_can_do_gate.js [--no-demo]
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname);
const T = require(path.join(ROOT, 'tools/bohemia_ui_company_screen_count.js'));
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const NS = require(path.join(ROOT, 'tools/bohemia_no_scroll.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('A WEAPON TELLS YOU WHAT IT CAN DO: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* the blows the fight gives a row, from the files alone */
const W = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/weapons.json'), 'utf8')).rows;
const OURS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8'));
const BY = {}; W.forEach(r => { BY[r.id] = r; });
const PS = OURS.pistol_shot.value;
function fightBlows(r) {
  if (r.class === PS.class && PS.by_row[r.id] && BY[PS.by_row[r.id]]) {
    const rl = (BY[PS.reload.rides].skills || []).filter(k => k.name === PS.reload.skill)[0];
    /* RE-AIMED 11/9 BY FIXES (ask row 529, EYES 11/8: the pistol's card said 'THROW JAVELIN'): a gun that rides another row's blow
       SHOOTS; the ridden row's skill name is the fight's bookkeeping, never his word (its AP and breath are still the ride's) */
    return BY[PS.by_row[r.id]].skills.map((k, i) => i === 0 ? Object.assign({}, k, { shoots: true }) : k).concat(rl ? [rl] : []);
  }
  return r.skills || [];
}
const wordOf = s => /^Reload/.test(s.name) ? 'RELOAD' : s.shoots ? 'SHOOT' : s.name.toUpperCase();

async function wholeTable(page, plant) {
  return page.evaluate(([rows, plant]) => {
    if (plant) { const h0 = BohemiaWeaponCard.html; BohemiaWeaponCard.html = function (id, n) { const d = document.createElement('div'); d.innerHTML = h0(id, n); const r = d.querySelectorAll('.bwc-r'); if (r.length) r[r.length - 1].remove(); return d.innerHTML; }; }
    const out = rows.map(([id, want]) => { const d = document.createElement('div'); d.innerHTML = BohemiaWeaponCard.html(id);
      const got = [...d.querySelectorAll('.bwc-r')].map(r => ({ word: r.querySelector('b').firstChild.textContent.trim(), n: r.querySelector('.bwc-n').textContent, s: r.querySelector('.bwc-s').textContent }));
      const miss = want.filter(w => !got.some(g => g.word === w.word && (w.ap == null || new RegExp('\\b' + w.ap + ' AP').test(g.n)) && (!w.fat || new RegExp('\\b' + w.fat + ' BREATH').test(g.n))));
      return { id, n: got.length, miss: miss.map(m => m.word), none: !!d.querySelector('.bwc-none'), says: got.map(g => g.s) }; });
    return out;
  }, [W.map(r => [r.id, fightBlows(r).map(s => ({ word: wordOf(s), ap: s.ap, fat: s.fatigue || 0 }))]), plant]);
}

(async () => {
  const srv = await T.serve(8943); const b = await chromium.launch();
  try {
    /* W1, W2 and the plant: the module alone, on the crew screen's page (it loads it) */
    for (const plant of [false, true]) {
      const ctx = await b.newContext(T.PROFILES.phone), page = await ctx.newPage();
      await page.goto('http://127.0.0.1:8943/slices/BOHEMIA_ROSTER_SCREEN.html', { waitUntil: 'load' });
      await page.waitForFunction(() => window.BohemiaWeaponCard && BohemiaWeaponCard.rows().length > 100, null, { timeout: 30000 });
      const res = await wholeTable(page, plant);
      const bad = res.filter(r => r.miss.length || r.n !== fightBlows(BY[r.id]).length);
      const noneWrong = res.filter(r => { const f = fightBlows(BY[r.id]); const special = f.filter(s => !/^Reload/.test(s.name)).length > 1; return r.none === special; });
      if (!plant) {
        ok('W1 *** EVERY WEAPON ROW *** (' + res.length + ' rows): every blow the fight gives it on its card with its own AP and breath (' + res.reduce((a, r) => a + r.n, 0) + ' blows); NO SPECIAL ABILITY on the ' + res.filter(r => r.none).length + ' rows with only their blow'
          + (bad.length ? '; wrong: ' + bad.slice(0, 3).map(r => r.id + ' missing ' + r.miss.join('/')).join(', ') : '') + (noneWrong.length ? '; NO SPECIAL ABILITY wrong on ' + noneWrong.slice(0, 3).map(r => r.id).join(', ') : ''),
          res.length === W.length && !bad.length && !noneWrong.length);
        const says = res.flatMap(r => r.says), jargon = says.filter(s => !s || s.length < 4 || /Direct Damage|Fatigue/.test(s));
        ok('W2 every blow\'s plain line is words (' + says.length + ' lines, e.g. "' + (res.find(r => r.id === 'warfork') || res[0]).says.join(' / ') + '"); none empty or in the wiki\'s jargon', !jargon.length, jargon.slice(0, 2).join(' | ') || undefined);
      } else ok('M  planted: a card that drops each weapon\'s last blow turns W1 red (' + bad.length + ' rows caught)', bad.length >= W.length - 2);
      await ctx.close();
    }
    /* W3 the crew screen */
    for (const pk of ['phone', 'computer']) {
      const ctx = await b.newContext(T.PROFILES[pk]), page = await ctx.newPage();
      const fr = await T.openCrew(page, 8943, {});
      await fr.waitForFunction(() => window.BohemiaWeaponCard && BohemiaWeaponCard.rows().length > 100, null, { timeout: 30000 });
      const fb = await (await fr.frameElement()).boundingBox();
      const tapIn = async (sel) => { const h = await fr.$(sel); if (!h) return false; const r = await h.boundingBox(); if (!r) return false;
        if (pk === 'computer') await page.mouse.click(r.x + r.width / 2, r.y + r.height / 2); else await page.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); await page.waitForTimeout(500); return true; };
      const bagW = await fr.evaluate(() => { const S = BohemiaRosterScreen.state, i = S.bag.findIndex(x => x && x.kind === 'weapon'); return i >= 0 ? { i, id: S.bag[i].id } : null; });
      const t1 = bagW && await tapIn('#bag [data-bag="' + bagW.i + '"]');
      const c1 = await fr.evaluate(() => { const c = document.getElementById('bwcard'); return c && c.style.display !== 'none' ? { id: c.dataset.weapon, blows: [...c.querySelectorAll('.bwc-r b')].map(b => b.firstChild.textContent.trim()) } : null; });
      const cmp = await fr.evaluate(() => BohemiaRosterScreen.state.cmp);
      const t2 = await tapIn('#card [data-slot="main"]');
      const c2 = await fr.evaluate(() => { const c = document.getElementById('bwcard'); return c && c.style.display !== 'none' ? c.dataset.weapon : null; });
      const mainId = await fr.evaluate(() => { const S = BohemiaRosterScreen.state, m = S.crew[S.sel || 0]; return m && m.gear && m.gear.main ? m.gear.main.id : null; });
      await tapIn('#title'); const c3 = await fr.evaluate(() => { const c = document.getElementById('bwcard'); return c ? c.style.display : 'none'; });
      const want = bagW ? fightBlows(BY[bagW.id]).map(wordOf) : [];
      ok('W3 ' + pk + ' *** THE CREW SCREEN *** one tap on ' + (bagW && bagW.id) + ' in the stash: its card (' + (c1 && c1.blows.join(', ')) + '), the comparison still up (' + cmp + '); his main hand (' + mainId + '): its card (' + c2 + '); a tap elsewhere puts it away (' + c3 + ')',
        !!t1 && !!c1 && c1.id === bagW.id && want.every(w => c1.blows.indexOf(w) >= 0) && cmp === bagW.i && !!t2 && !!mainId && c2 === mainId && c3 === 'none');
      await ctx.close();
    }
  } catch (e) { ok('the crew screen and the table', false, String(e.stack).slice(0, 300)); }
  await b.close(); srv.close();
  /* W4 the shop on the demo */
  if (process.argv.indexOf('--no-demo') < 0) {
    let d;
    try {
      d = await drive.open({ profile: 'phone_portrait', keepCards: true, beforeTap: async (p) => { await throughTheTitle(p); } });
      const P = d.page; await P.waitForTimeout(3000); await d.clearCards().catch(() => {});
      /* a town ON THE GLASS (its frame waits invisible over the map between visits) */
      const seen = async () => { for (const x of P.frames().filter(f => /SETTLEMENT_SCREEN/.test(f.url()))) if (await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!BohemiaSettlement.state.place && !document.getElementById('arrive'); } catch (e) { return false; } }).catch(() => false) && await NS.frameShown(x)) return x; return null; };
      let sf = null; for (let i = 0; i < 10 && !sf; i++) { sf = await seen(); if (!sf) await P.waitForTimeout(400); }
      if (!sf) { await d.fr.evaluate(() => { const bs = ctBases(), n = Object.keys(bs).find(k => /church/i.test(k)) || Object.keys(bs)[0], t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }).catch(() => {});
        for (let i = 0; i < 60 && !sf; i++) { await P.waitForTimeout(400); sf = await seen();
          if (!sf && i === 15) await d.fr.evaluate(() => { try { btwFrameRest(); } catch (e) {} }).catch(() => {}); } }   /* main's fade bug, named in the scroll gate */
      if (!sf) throw new Error('no town on the glass after the map\'s own door');
      for (let i = 0; i < 30 && sf; i++) { if (await sf.evaluate(() => !!window.BohemiaWeaponCard && BohemiaWeaponCard.rows().length > 100).catch(() => false)) break; await P.waitForTimeout(400); }
      let opened = null;
      for (let i = 0; i < 3 && opened !== 'smith'; i++) { const w = await sf.evaluate(() => BohemiaSettlement.where('smith')), fb = await (await sf.frameElement()).boundingBox(); if (w) await P.touchscreen.tap(fb.x + w.x, fb.y + w.y); await P.waitForTimeout(1600); opened = await sf.evaluate(() => BohemiaSettlement.state.open); }
      await sf.waitForFunction(() => document.querySelectorAll('#shelfgrid [data-item^="weapon:"]').length > 0, null, { timeout: 10000 }).catch(() => {});
      const h = await sf.$('#shelfgrid [data-item^="weapon:"]'), id = h ? (await h.getAttribute('data-item')).slice(7) : null;
      const r = h ? await h.boundingBox() : null;
      if (r) { await P.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); await P.waitForTimeout(700); }
      const s4 = await sf.evaluate(() => { const c = document.getElementById('bwcard'); return { card: c && c.style.display !== 'none' ? c.dataset.weapon : null, blows: c ? [...c.querySelectorAll('.bwc-r b')].map(b => b.firstChild.textContent.trim()) : [],
        strip: (document.querySelector('#shopstrip .ss-title b') || {}).textContent || '', sel: document.querySelectorAll('#sheet .slot.sel').length }; });
      const want = id ? fightBlows(BY[id]).map(wordOf) : [];
      const onGlass = await NS.frameShown(sf);
      ok('W4 *** THE SHOP *** the smith (' + opened + ', the town on the glass ' + onGlass + '), one tap on ' + id + ': its card (' + s4.blows.join(', ') + '), the strip still names it ("' + s4.strip + '"), one piece lit (' + s4.sel + ')',
        onGlass && opened === 'smith' && !!id && s4.card === id && want.every(w => s4.blows.indexOf(w) >= 0) && s4.strip.length > 2 && s4.sel === 1);
      ok('Z nothing threw on the demo', !d.errs.length, d.errs.slice(0, 2).join(' | ') || 'none');
    } catch (e) { ok('W4 the shop on the demo', false, String(e.stack).slice(0, 300)); }
    if (d) await d.close();
  }
  done();
})();
