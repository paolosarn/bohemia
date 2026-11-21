/* THE PERKS FIT  (UI FIVE, 11/21/26; ask row 655, FOUND BY EYES 11/20, records/BOHEMIA_EYES_THE_WHOLE_ENCHILADA_11_20_26.md e08;
   rules 444, 441, 402 amended 11/7: SMALLER, NEVER PAGES; 252(c): never a perk without its picture; 454(a): no line rewritten)

   EYES 11/20: 'on the crew screen after a fight, PERK: the said line (12,324 to 158,368) lies over the first perk card (12,328), and
   the nine perk cards run to y 888 on an 844 glass, so the page scrolls (900 of 844)'.
   MEASURED BEFORE (the demo, 390 x 844, a road fight won, CHOOSE HIS LEVEL-UP, three picks and RAISE THEM): the phone holds the
   stash's buttons, so the said line, which at the crew screen's third step stands in the stash's heading, lay on the first card
   (said 12,368 to 158,412, the first card at 372); the nine cards stood two to a 226-px row beside the phone and ran to y 932, the
   page 944 of 844.
   THE FIX (slices/bohemia_ui_no_scroll.js saidClear and the step ns-pk; slices/BOHEMIA_ROSTER_SCREEN.html __THE_PERKS_FIT__): the
   cards start under the said line; when the nine still run past the glass each card is its picture and its name, the first tap
   lights it and says its words in the said line, the second takes it.

   On the DEMO, through the one driver, with a finger, upright (390 x 844) and on its side (844 x 390): a road fight won, one of his
   men given a level, the end screen's CHOOSE HIS LEVEL-UP tapped, his picks tapped and RAISE THEM, the perk page:
     P1 NOTHING SCROLLS: the page is no taller than the glass; every perk card inside the glass, none under the phone; the said line
        lies on no card and not under the phone; every card's name 11 px or more; every card its picture
     P2 A PERK IS TAKEN ON PURPOSE: where the cards carry their words, one tap takes it; where they are pictures and names, the first
        tap lights the card and says its own words whole in the said line (the perk's name and its line from the data, letter for
        letter), nothing taken and no card moved, and the second tap takes it
     P3 nothing threw
   PLANTED (upright, on the same page before P2): the step taken away where it stands (the class off, the cards' margin off, no fit
   run after): the leg sees the cards run past the glass and the said line on a card; then the fit is woken and stands as it was.
   node gates/the_perks_fit_gate.js [phone_portrait|phone_landscape] */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && x !== '' ? '  [' + String(x).slice(0, 400) + ']' : '')); };
const ov = (a, b) => !!a && !!b && a[0] < b[2] - 0.5 && a[2] > b[0] + 0.5 && a[1] < b[3] - 0.5 && a[3] > b[1] + 0.5;
const SHAPES = process.argv.slice(2).filter(a => /^phone_/.test(a));
const PROFS = SHAPES.length ? SHAPES : ['phone_portrait', 'phone_landscape'];

/* the perk page as it stands: the page, the cards, the said line, the phone (in the roster frame's own points: it covers the glass) */
const READ = () => {
  const R = e => { if (!e) return null; const r = e.getBoundingClientRect(); return r.width < 1 || r.height < 1 ? null : [r.left, r.top, r.right, r.bottom].map(v => Math.round(v)); };
  const de = document.scrollingElement || document.documentElement, sd = document.getElementById('said');
  const cs = getComputedStyle(document.documentElement), v = k => parseFloat(cs.getPropertyValue(k)) || 0;
  const phone = document.documentElement.classList.contains('boh-phone-on') && v('--boh-phone-w') > 0 ? [v('--boh-phone-left'), v('--boh-phone-top'), v('--boh-phone-left') + v('--boh-phone-w'), v('--boh-phone-top') + v('--boh-phone-h')].map(Math.round) : null;
  const cards = [].map.call(document.querySelectorAll('#plist button'), b => { const t = b.querySelector('.pkt'); const f = t ? [].slice.call(t.childNodes).filter(n => n.nodeType === 3).length ? parseFloat(getComputedStyle(t).fontSize) : 0 : 0;
    return { id: b.dataset.perk, r: R(b), px: f, pic: !!b.querySelector('img.pki') && b.querySelector('img.pki').complete && b.querySelector('img.pki').naturalWidth > 0, words: !!b.querySelector('.pkt i') && getComputedStyle(b.querySelector('.pkt i')).display !== 'none' }; });
  return { vw: innerWidth, vh: innerHeight, sh: de.scrollHeight, said: R(sd), saidTxt: sd ? sd.textContent : '', cards, phone, tight: document.body.classList.contains('ns-pk') };
};

async function side(profile) {
  const UP = profile === 'phone_portrait', name = UP ? 'UPRIGHT' : 'ON ITS SIDE';
  console.log('\n' + profile);
  let d;
  try { d = await drive.open({ profile, keepCards: true, engage: true, beforeTap: async (pg) => { await throughTheTitle(pg); } }); }
  catch (e) { ok(name + ' the demo boots', false, String(e.message).slice(0, 160)); return; }
  const p = d.page, fr = d.fr, errs = []; p.on('pageerror', e => errs.push(String(e.message).slice(0, 200)));
  try {
    await p.waitForTimeout(2500);
    /* out of the town the demo opens in, off its safe ground, and a road fight through the map's own door (THE CREW SCREEN SEES THE FIGHT's walk) */
    const sf0 = p.frames().find(x => /SETTLEMENT_SCREEN/.test(x.url())); if (sf0) { await sf0.evaluate(() => { const b = document.getElementById('leave'); if (b) b.click(); }).catch(() => {}); await p.waitForTimeout(4000); }
    const road = await fr.evaluate(() => { const clear = (x, y) => { try { return !townSafeAt(x, y) && !townGround(x, y); } catch (_e) { return true; } };
      if (!clear(city.x, city.y)) { outer: for (let r = 4; r < 80; r += 2) for (let a = 0; a < 8; a++) { const x = Math.round(city.x + r * Math.cos(a * Math.PI / 4)), y = Math.round(city.y + r * Math.sin(a * Math.PI / 4)); if (clear(x, y)) { city.x = x + 0.5; city.y = y + 0.5; break outer; } } }
      try { stepOnce(0); stepOnce(4); } catch (_e) {}
      return { went: roadContactFight({ id: 'toll_crew', name: 'the toll crew', seq: 51 }) }; });
    let f = null;
    for (let i = 0; i < 200 && !f; i++) { const h = await p.$('#fightFrame'); if (h) { const c = await h.contentFrame(); if (c && await c.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) f = c; } if (!f) await p.waitForTimeout(150); }
    if (!f) { ok(name + ' a road fight through the map\'s door', false, JSON.stringify(road)); return; }
    await p.waitForTimeout(1200);
    /* won, the second of his given a level, so the end screen offers CHOOSE HIS LEVEL-UP */
    await f.evaluate(() => { const S = FIGHT.S, now = performance.now(); S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; u._fallAt = now - 4000; });
      const you = S.units.filter(u => u.side === 'you'); you[1].xpGained = 400; S.over = true; S.result = 'won'; showOver('won'); });
    const SF = () => p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
    for (let i = 0; i < 100 && !(SF() && await SF().evaluate(() => window.BohemiaAftermath && BohemiaAftermath.state().on).catch(() => false)); i++) await p.waitForTimeout(200);
    await p.waitForTimeout(1200);
    const sf = SF(); if (!sf) { ok(name + ' the end screen came up', false); return; }
    const at = await sf.evaluate(() => { const b = document.querySelector('button.perk'); if (!b) return null; b.scrollIntoView({ block: 'center' }); const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, b.textContent]; });
    if (!at) { ok(name + ' the end screen offers CHOOSE HIS LEVEL-UP', false); return; }
    const fb = await (await sf.frameElement()).boundingBox(); await p.touchscreen.tap(fb.x + at[0], fb.y + at[1]);
    let rf = null; for (let i = 0; i < 80; i++) { rf = p.frames().find(x => /ROSTER_SCREEN/.test(x.url())); if (rf && await rf.evaluate(() => { const R = window.BohemiaRosterScreen; return !!R && !!R.camp.c && +R.camp.c.style.opacity === 1; }).catch(() => false)) break; rf = null; await p.waitForTimeout(250); }
    if (!rf) { ok(name + ' the company screen opened', false); return; }
    await p.waitForTimeout(1500);
    const rb = await (await rf.frameElement()).boundingBox();
    const tap = async sel => { const el = await rf.$(sel); if (!el) return false; const bb = await el.boundingBox(); if (!bb) return false; await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await p.waitForTimeout(400); return true; };
    const ks = await rf.evaluate(() => [].map.call(document.querySelectorAll('#levelup [data-raise]'), b => b.dataset.raise));
    const picks = await rf.evaluate(() => { const m = BohemiaRosterScreen.state.crew[BohemiaRosterScreen.state.sel]; return (m.rolls && m.rolls[0] && m.rolls[0].pick) || 3; });
    for (const k of ks.slice(0, picks)) await tap('#levelup [data-raise="' + k + '"]');
    await tap('#raise'); await p.waitForTimeout(600);
    if (!(await rf.$('#plist button'))) { const ph = await p.evaluate(() => { const b = document.querySelector('#bohphone .crewp [data-tab="perk"], #bohphone .crewp .perk'); if (!b) return null; const r = b.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
      if (ph) await p.touchscreen.tap(ph[0], ph[1]); else await tap('#pick'); await p.waitForTimeout(700); }
    await p.waitForTimeout(700);
    const A = await rf.evaluate(READ);
    if (!A.cards.length) { ok(name + ' the perk page opened after RAISE THEM', false, JSON.stringify(A).slice(0, 300)); return; }
    const past = A.cards.filter(c => !c.r || c.r[0] < -0.5 || c.r[1] < -0.5 || c.r[2] > A.vw + 0.5 || c.r[3] > A.vh + 0.5).map(c => c.id + '@' + (c.r && c.r[3]));
    const under = A.phone ? A.cards.filter(c => ov(c.r, A.phone)).map(c => c.id) : [];
    const onCard = A.cards.filter(c => ov(A.said, c.r)).map(c => c.id);
    const small = A.cards.filter(c => c.px < 11).map(c => c.id + ' ' + c.px + 'px'), nopic = A.cards.filter(c => !c.pic).map(c => c.id);
    ok('P1 ' + name + ': THE PERK PAGE FITS (' + A.cards.length + ' perks, ' + (A.tight ? 'each its picture and its name' : 'each with its words') + '): the page ' + A.sh + ' of ' + A.vh + ', the last card at ' + Math.max(...A.cards.map(c => c.r ? c.r[3] : 9999))
      + '; past the glass ' + past.length + ', under the phone ' + under.length + ', the said line on a card ' + onCard.length + (A.phone && A.said ? ', under the phone ' + (ov(A.said, A.phone) ? 1 : 0) : '') + '; names under 11 px ' + small.length + '; without a picture ' + nopic.length,
      A.sh <= A.vh + 1 && !past.length && !under.length && !onCard.length && !(A.phone && ov(A.said, A.phone)) && !small.length && !nopic.length, past.concat(under, onCard, small, nopic).join(', '));
    if (UP) {
      /* PLANTED: the step taken away where it stands (a class and a margin do not wake the fit), read, then the fit put back */
      await rf.evaluate(() => { document.body.classList.remove('ns-pk'); const b = document.getElementById('bag'); if (b) b.style.removeProperty('margin-top'); const s = document.getElementById('said'); if (s) s.style.removeProperty('width'); });
      await p.waitForTimeout(300);
      const B = await rf.evaluate(READ);
      const past2 = B.cards.filter(c => !c.r || c.r[3] > B.vh + 0.5).length, on2 = B.cards.filter(c => ov(B.said, c.r)).length;
      ok('P1 ' + name + ' PLANTED (the step taken away): the leg sees the cards run past the glass (' + past2 + ' past, the page ' + B.sh + ' of ' + B.vh + ') and the said line on a card (' + on2 + ')', (past2 > 0 || B.sh > B.vh + 1) && on2 > 0);
      await rf.evaluate(() => window.dispatchEvent(new Event('resize'))); await p.waitForTimeout(600);
      const C = await rf.evaluate(READ);
      if (JSON.stringify(C.cards.map(c => c.r)) !== JSON.stringify(A.cards.map(c => c.r))) ok('P1 ' + name + ' the fit comes back after the plant', false, JSON.stringify(C.cards.map(c => c.r)).slice(0, 200));
    }
    /* P2: a perk taken on purpose */
    const pick = A.cards[Math.min(3, A.cards.length - 1)].id;
    const rowOf = await rf.evaluate(id => { const r = BohemiaRoster.data.perkRows.find(x => x.id === id); return r ? { name: r.name, skin: r.skin } : null; }, pick);
    const before = await rf.evaluate(() => { const m = BohemiaRosterScreen.state.crew[BohemiaRosterScreen.state.sel]; return { perks: m.perks.slice(), pts: m.points }; });
    await tap('#plist button[data-perk="' + pick + '"]');
    const t1 = await rf.evaluate(id => { const m = BohemiaRosterScreen.state.crew[BohemiaRosterScreen.state.sel], b = document.querySelector('#plist button[data-perk="' + id + '"]');
      return { took: m.perks.indexOf(id) >= 0, pts: m.points, lit: !!b && b.classList.contains('pklit'), said: document.getElementById('said').textContent, perkTab: !!document.getElementById('plist') }; }, pick);
    if (!A.tight) {
      ok('P2 ' + name + ': the cards carry their words, so one tap takes the perk (' + pick + ')', t1.took && t1.pts === before.pts - 1, JSON.stringify(t1));
    } else {
      const A1 = await rf.evaluate(READ), moved = A1.cards.some((c, i) => JSON.stringify(c.r) !== JSON.stringify(A.cards[i].r)), on1 = A1.cards.filter(c => ov(A1.said, c.r)).length;
      const whole = !!rowOf && t1.said.indexOf(String(rowOf.name).toUpperCase()) === 0 && t1.said.indexOf(rowOf.skin) > 0;
      await tap('#plist button[data-perk="' + pick + '"]');
      const t2 = await rf.evaluate(id => { const m = BohemiaRosterScreen.state.crew[BohemiaRosterScreen.state.sel]; return { took: m.perks.indexOf(id) >= 0, pts: m.points, said: document.getElementById('said').textContent }; }, pick);
      ok('P2 ' + name + ': the first tap on ' + pick + ' lights it and says its own words whole ("' + t1.said.slice(0, 90) + '..."), nothing taken, no card moved, the line on no card; the second tap takes it ("' + t2.said + '")',
        !t1.took && t1.pts === before.pts && t1.lit && whole && !moved && !on1 && t2.took && t2.pts === before.pts - 1, JSON.stringify({ t1, moved, on1, t2 }));
    }
    ok('P3 ' + name + ': nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  } catch (e) { ok(name + ': the walk ran', false, String(e && e.stack || e).slice(0, 400)); }
  finally { try { await d.close(); } catch (_e) {} }
}

(async () => {
  console.log('THE PERKS FIT (UI FIVE, ask row 655; rules 444, 441, 402, 252(c))');
  for (const pr of PROFS) await side(pr);
  console.log('\nTHE PERKS FIT: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
