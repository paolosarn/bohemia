/* ==========================================================================
   NOTHING TAPPABLE UNDER THE PHONE  (RUN TWO, 11/3/26, THE TOWN JOB: ask lines 226 'the most important', 219, 241, 106,
   142, 253, 244, with 173, 174, 195 and 248 'TOP PRIORITY'; rule 292(b))

   PAOLO 10/27: "nothing I need to click cannot be behind the phone... only the ground tile with no equipment no building
   no people nothing behind it". 11/2 (line 248): "every town opens on nothing but brown... the town works under it, blind
   taps hit people and shops sell".
   MEASURED BEFORE (11/3, the demo, all fourteen towns, the phone upright and on its side, on its left and its right, 56
   views): every town drew its own picture except Reds on its side (the old shared town_1, its smith's door on the
   picture's bottom edge); no building's tap was under the phone, but a man you can talk to stood under it in 9 of the 28
   upright views (your own men in Caravans 90%, Church 87%, Network 100%; the post and the crowd in all five fortresses with
   the phone on the left, 33 to 66%); upright the arrival card's WHAT THEY THINK OF YOU ran under the phone; a town picture
   that failed to load once stayed brown for the visit while its shops answered blind taps.

   LEGS, on the demo through the map's own door (loopOpenTown), for the phone upright (390 x 844, touch) and on its side
   (844 x 390), the phone on the right and on the left, every town the map has:
     N1 <view> *** EVERY TOWN DRAWS ITS OWN PICTURE *** (COOK's tall or wide composition for that town, never a tier's)
     N2 <view> *** NO BUILDING'S TAP UNDER THE PHONE *** every building's tap box clear of the phone's rectangle, and a
        finger (44 points) of it on the glass
     N3 <view> *** NOBODY YOU CAN TAP UNDER THE PHONE *** every keeper, man at the post, man of the crowd and man of your
        crew who stands still: his body clear of the phone's rectangle and on the glass (the walkers answer no tap and may
        pass behind it)
     N4 <orientation> the arrival card's words clear of the phone
     N5 a tap answers nothing while no picture is drawn, and a failed picture is asked for again (read in the screen's
        source: a load cannot be made to fail on the demo without a network shim)
     Z  nothing threw
   node gates/nothing_tappable_under_the_phone_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const done = () => { console.log('NOTHING TAPPABLE UNDER THE PHONE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* everything tappable, in the town frame's own pixels; the phone's rectangle in the same pixels (BOH_PHONE_RECT) */
const measure = (sf) => sf.evaluate(() => {
  const B = BohemiaSettlement, F = B.fit(), sc = document.getElementById('scene').getBoundingClientRect();
  const ph = F.phone ? [F.phone.left, F.phone.top, F.phone.left + F.phone.width, F.phone.top + F.phone.height] : null;
  const S = (x, y) => [sc.left + F.ox + x * F.s, sc.top + F.oy + y * F.s];
  const over = (r) => !!ph && Math.min(r[2], ph[2]) - Math.max(r[0], ph[0]) > 0.5 && Math.min(r[3], ph[3]) - Math.max(r[1], ph[1]) > 0.5;
  const glassPart = (r) => [Math.max(r[0], sc.left), Math.max(r[1], sc.top), Math.min(r[2], sc.right), Math.min(r[3], sc.bottom)];
  const doors = B.order().map(k => { const b = B._box(k); if (!b) return null; const a = S(b[0], b[1]), c = S(b[2], b[3]), r = [a[0], a[1], c[0], c[1]], g = glassPart(r);
    return { k, under: over(r), finger: g[2] - g[0] >= 43.5 && g[3] - g[1] >= 43.5 }; }).filter(Boolean);
  const h = B.scale().person, s = F.s;
  const folk = B.folk().filter(p => !p.busy).map(p => { const w = Math.max(h * .17, 22 / s), up = Math.max(h, 44 / s), a = S(p.x - w, p.y - up), c = S(p.x + w, p.y + 4), r = [a[0], a[1], c[0], c[1]];
    return { who: p.keeper ? 'keeper ' + p.k : p.crewMan ? 'crew ' + (p.name || '') : p.post ? 'post' : 'crowd', under: over(r), on: r[0] >= sc.left - 1 && r[2] <= sc.right + 1 && r[1] >= sc.top - 1 && r[3] <= sc.bottom + 1 }; });
  return { name: B.state.place.name, drawn: B.drawnSrc(), phone: ph, doors, folk };
});

async function openTown(P, fr, w) {
  await fr.evaluate((w) => { const bs = ctBases(), t = { name: w, x: bs[w].x, y: bs[w].y, tier: mapTierOf(w) }; city.x = t.x; city.y = t.y; loopOpenTown(t); }, w);
  for (let k = 0; k < 60; k++) { await P.waitForTimeout(250);
    for (const x of P.frames().filter(x => /SETTLEMENT_SCREEN/.test(x.url())))
      if (await x.evaluate((w) => { try { return BohemiaSettlement.ready() && BohemiaSettlement.state.place && BohemiaSettlement.state.place.name === w && BohemiaSettlement.picIn(); } catch (e) { return false; } }, w).catch(() => false)) return x; }
  return null;
}
const leaveTown = async (P) => { await P.evaluate(() => { try { const l = document.querySelector('#bohphone.on .bpctx.town .lv'); if (l) l.click(); } catch (e) {} }); await P.waitForTimeout(900); };

async function run(profile) {
  const d = await drive.open({ profile, keepCards: true, beforeTap: async (pg) => { await throughTheTitle(pg); } });
  const P = d.page, fr = d.fr, tag = profile === 'phone_portrait' ? 'UPRIGHT' : 'ON ITS SIDE';
  try {
    await P.waitForTimeout(3000);
    const names = await fr.evaluate(() => Object.keys(ctBases()));
    let arriveDone = false;
    for (const side of ['right', 'left']) {
      await P.evaluate((s) => { try { BohemiaPhone.setSide(s); } catch (e) {} }, side); await P.waitForTimeout(400);
      const view = tag + ', PHONE ' + side.toUpperCase(), own = [], badDoor = [], noFinger = [], badFolk = [], missing = [];
      for (const w of names) {
        const sf = await openTown(P, fr, w); if (!sf) { missing.push(w); continue; }
        if (!arriveDone) {   /* N4: the arrival card, once an orientation */
          const a = await sf.evaluate(() => { const o = document.getElementById('arrive'); if (!o) return null; const F = BohemiaSettlement.fit(), ph = F.phone; if (!ph) return null;
            const parts = [...o.children].map(e => e.getBoundingClientRect()).filter(q => q.width > 0);
            return parts.filter(q => Math.min(q.right, ph.left + ph.width) - Math.max(q.left, ph.left) > 0.5 && Math.min(q.bottom, ph.top + ph.height) - Math.max(q.top, ph.top) > 0.5).length + ' of ' + parts.length; });
          ok('N4 ' + tag + ': the arrival card\'s words clear of the phone (' + w + ': ' + (a || 'no card') + ' under it)', !!a && /^0 of [1-9]/.test(a), a || 'no card');
          arriveDone = true;
        }
        await P.waitForTimeout(700);
        const m = await measure(sf);
        if (!new RegExp('^' + w.toLowerCase() + '(_tall(_left|_right)?)?\\.webp$').test(m.drawn || '')) own.push(w + ' draws ' + m.drawn);
        m.doors.forEach(x => { if (x.under) badDoor.push(w + ' ' + x.k); if (!x.finger) noFinger.push(w + ' ' + x.k); });
        m.folk.forEach(x => { if (x.under || !x.on) badFolk.push(w + ' ' + x.who + (x.under ? ' under' : ' off the glass')); });
        await leaveTown(P);
      }
      ok('N1 ' + view + ': *** EVERY TOWN DRAWS ITS OWN PICTURE *** (' + (names.length - own.length - missing.length) + ' of ' + names.length + ')', names.length >= 14 && !own.length && !missing.length, own.concat(missing.map(x => x + ' never opened')).slice(0, 4).join('; ') || 'all');
      ok('N2 ' + view + ': *** NO BUILDING\'S TAP UNDER THE PHONE *** and a finger of every one on the glass', !badDoor.length && !noFinger.length && !missing.length, badDoor.map(x => x + ' under').concat(noFinger.map(x => x + ' no finger on the glass')).slice(0, 6).join(', ') || 'every building in every town');
      ok('N3 ' + view + ': *** NOBODY YOU CAN TAP UNDER THE PHONE *** (keepers, the post, the crowd, your crew)', !badFolk.length && !missing.length, badFolk.slice(0, 6).join(', ') || 'everybody in every town');
    }
  } catch (e) { ok(tag + ' legs ran [' + String(e.stack || e.message).slice(0, 300) + ']', false); }
  return d;
}

(async () => {
  /* N5: read in the source (a fetch cannot be made to fail on the demo without a shim) */
  const src = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_SETTLEMENT_SCREEN.html'), 'utf8');
  ok('N5 a tap answers nothing while no picture is drawn, and a failed picture is asked for again, then the tier\'s drawn',
    /if\(!S\.camp && !picIn\(\)\) return;/.test(src) && /im\.onerror = function\(\)\{ im\._tries\+\+; if\(im\._tries <= 2\)/.test(src) && /function townImDead\(url\)/.test(src));
  for (const profile of ['phone_portrait', 'phone_landscape']) {
    const d = await run(profile);
    ok('Z ' + profile + ': nothing threw', d.errs.length === 0, d.errs.slice(0, 2).join(' | '));
    await d.close();
  }
  done();
})();
