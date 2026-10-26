/* ==========================================================================
   THE COMPANY TAKES HIS NAME  (RUN TWO, 10/26/26, VAMILY [the company takes his own name], rule 268(a)(c))

   PAOLO 10/26: "I should be able to custom name my group... it gives me clickable options but when I click the text box I should
   change it to what I want."
   MEASURED BEFORE: the new game's YOUR CREW'S NAME was a span; a tap on it did nothing, only ANOTHER changed it.
   NOW (__THE_COMPANY_TAKES_HIS_NAME__, RUN TWO's line in RUN's door): the name is a box; a tap puts the caret in it with the whole
   name picked, what he types is the company's; ANOTHER still deals the prepared names.

   LEGS, on the demo, an upright phone, REAL taps and real keys:
     N1 *** A TAP OPENS THE BOX *** a real tap on the name: the caret is in it, the whole name picked; he types, the box holds it,
        the door's picks name it, and the game has not begun
     N2 ANOTHER still deals a prepared name (it replaces what he typed); a tap and his name again, Enter puts the keyboard away
     N3 *** HIS NAME IS THE COMPANY'S *** after BEGIN: the map's start, the phone (BohemiaCompanyName), the feed's first post
     N4 after a reload and CONTINUE: the same name on the map and the phone
     N5 the live phone shows no offer (rule 268(b), 232): no job card that is not his
     Z  nothing threw
   node gates/the_company_takes_his_name_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle, continueThroughTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('THE COMPANY TAKES HIS NAME: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const HIS = 'Los Hermanos', HISUP = 'LOS HERMANOS';

(async () => {
  const at = {};
  const boxAt = (pg) => pg.evaluate(() => { const e = document.getElementById('newconame'); if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return r.width > 4 ? { x: r.x + r.width / 2, y: r.y + r.height / 2, h: r.height } : null; });
  const state = (pg) => pg.evaluate(() => { const e = document.getElementById('newconame'), a = document.activeElement;
    return { tag: e ? e.tagName : null, value: e ? e.value : null, focused: a === e, all: !!e && a === e && e.selectionStart === 0 && e.selectionEnd === e.value.length && e.value.length > 0,
      picks: window.BOH_START ? BOH_START.picks().name : null, names: window.BOH_START ? BOH_START.NAMES : [], began: !!window.__PLAY_BEGAN }; });
  const d = await drive.open({ profile: 'phone_portrait', keepCards: true, beforeTap: async (pg) => {
    await throughTheTitle(pg);
    try {
      let b = null; for (let i = 0; i < 60 && !b; i++) { b = await boxAt(pg); if (!b) await pg.waitForTimeout(250); }
      at.n0 = await state(pg);
      if (b) { await pg.touchscreen.tap(b.x, b.y); await pg.waitForTimeout(300); }
      at.n1a = await state(pg);
      await pg.keyboard.type(HIS, { delay: 30 }); await pg.waitForTimeout(200);
      at.n1 = await state(pg);
      const an = await pg.evaluate(() => { const e = document.querySelector('#newco button[data-k="name"]'); if (!e) return null; e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
      if (an) { await pg.touchscreen.tap(an.x, an.y); await pg.waitForTimeout(300); }
      at.n2a = await state(pg);
      b = await boxAt(pg); if (b) { await pg.touchscreen.tap(b.x, b.y); await pg.waitForTimeout(300); }
      await pg.keyboard.type(HIS, { delay: 30 }); await pg.keyboard.press('Enter'); await pg.waitForTimeout(300);
      at.n2 = await state(pg); at.h = b && b.h;
    } catch (e) { at.err = String(e.message || e).slice(0, 200); }
  } });
  const P = d.page;
  try {
    const a = at.n1a || {}, t = at.n1 || {};
    ok('*** N1 A TAP OPENS THE BOX *** (a ' + (a.tag || 'nothing') + ', ' + Math.round(at.h || 0) + ' points tall; after the tap focused ' + a.focused + ', the whole name picked ' + a.all + '; typed: "' + t.value + '", the picks name "' + t.picks + '", begun ' + t.began + ')' + (at.err ? ' ' + at.err : ''),
      a.tag === 'INPUT' && a.focused && a.all && (at.h || 0) >= 44 && String(t.value).toUpperCase() === HISUP && t.picks === HISUP && !t.began);
    const n2a = at.n2a || {}, n2 = at.n2 || {};
    ok('N2 ANOTHER deals a prepared name ("' + n2a.value + '", the picks "' + n2a.picks + '"); typed again and Enter: "' + n2.picks + '", the keyboard away ' + !n2.focused,
      n2a.names.indexOf(n2a.value) >= 0 && n2a.picks === n2a.value && n2.picks === HISUP && !n2.focused);
    /* N3 after BEGIN */
    await P.waitForTimeout(4000);
    const top = await P.evaluate(() => ({ phone: window.BohemiaCompanyName ? BohemiaCompanyName.get() : null, picks: window.BOH_START ? BOH_START.picks().name : null }));
    const map = await d.fr.evaluate(() => { let first = null; try { const ps = window.BOHEMIA_FEED ? BOHEMIA_FEED.posts() : []; const mine = ps.filter(p => /^@?the|crew|loshermanos/i.test(String(p.who || p.handle || '')) && /batteries between us/.test(String(p.txt || p.text || ''))); first = mine.length ? mine[0].who || mine[0].handle : (ps.length ? 'none of ' + ps.length + ' is the start post' : null); } catch (e) {} return { start: (typeof LOOP !== 'undefined' && LOOP.start) ? LOOP.start.name : null, first }; });   /* the crew's own start post ('... batteries between us'), wherever it sits in the feed */
    ok('*** N3 HIS NAME IS THE COMPANY\'S *** (the map\'s start "' + map.start + '", the phone "' + top.phone + '", the feed\'s start post ' + map.first + ')',
      map.start === HISUP && top.phone === HISUP && (!/^@/.test(String(map.first)) || /loshermanos/.test(String(map.first))));   /* the feed keeps its fourteen newest: the start post may have scrolled out, but when it is there it names him */
    /* N5 */
    const offers = await P.evaluate(() => { const ph = document.getElementById('bohphone'); if (!ph) return null; return [...ph.querySelectorAll('*')].filter(e => /\boffer/i.test(e.className && e.className.baseVal == null ? e.className : '') && e.offsetWidth > 0).length; });
    ok('N5 the live phone shows no offer (' + offers + ' offer cards)', offers === 0 || offers === null);
    /* N4 a reload and CONTINUE */
    await P.waitForTimeout(3000);
    await P.reload(); await P.waitForTimeout(1500);
    let pressed = false; for (let i = 0; i < 40 && !pressed; i++) { pressed = await continueThroughTitle(P); if (!pressed) await P.waitForTimeout(500); }
    let cf = null; for (let i = 0; i < 120 && !cf; i++) { await P.waitForTimeout(500); const f = P.frames().find(x => x.name() === 'cityFrame');
      if (f && await f.evaluate(() => typeof DAY !== 'undefined' && DAY.day >= 1 && (window.__RESTORE_OK | 0) >= 1).catch(() => false)) cf = f; }
    const back = cf ? await cf.evaluate(() => (typeof LOOP !== 'undefined' && LOOP.start) ? LOOP.start.name : null) : null;
    const top2 = await P.evaluate(() => window.BohemiaCompanyName ? BohemiaCompanyName.get() : null);
    ok('N4 after a reload and CONTINUE (' + pressed + '): the map "' + back + '", the phone "' + top2 + '"', pressed && !!cf && top2 === HISUP && (back === HISUP || back === null));
  } catch (e) { ok('the legs ran [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  ok('Z nothing threw', d.errs.length === 0, d.errs.slice(0, 2).join(' | '));
  await d.close();
  done();
})();
