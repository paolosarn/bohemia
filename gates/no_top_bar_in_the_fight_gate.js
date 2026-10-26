/* NO TOP BAR IN THE FIGHT  (UI [no top bar in the fight], 10/26/26; VAMILY rule 280(d))

   PAOLO 10/26: 'when it's combat mode I don't need to see my batteries and the time of day... in combat it can completely go
   away.'  Rule 280 amends 190's one HUD for the fight and 200(a)'s 'and in the fight'; the map and the town keep the bar.

   MEASURED BEFORE (the demo, BUILD 10/26zzi, 390 x 844): the fight wore the map's whole bar across its top, 108 points (DAY 1,
   the crew 3/20, 290 batteries, food and water 21, tape 40, meds 30, rounds 80, the dial of the hour), and the fight measured
   its board under it (TOPH 108); on its side and on a computer one row of 60.

   On the DEMO, through the one driver, phone upright, phone on its side and a computer, in TWO ROLLED ROAD FIGHTS each, through
   the map's own door:
     N1 the map wears the bar (the batteries on it, nothing over it)
     N2 the door: the map's bar lifts off the top of the glass as the clouds come in (MOTION's layer, a leaving piece), never
        held over the clouds waiting for a fight's bar (it used to hang there to a 12 s timeout once the fight had none)
     N3 IN THE FIGHT, after the clouds part: no top bar on any page of the glass (the fight's, the map's under it, the shell's),
        nothing at the bar's place on the map is the bar; no battery count and no clock anywhere on the fight's screen (the
        bar's batteries' number, DAY n, an hour's digits: not in the fight's words, not in the shell's, not on the phone)
     N4 the board gets the room: the fight measures its top as 0 (TOPH), and its board keeps more of the glass than under the bar
     N5 what the fight needs stays on the phone: its CREW opens the one company screen over the fight, its SETTINGS the game's
        settings, its NOTES the notes (each presses the bar's own button, built off the glass: one handler, rule 238(a))
     N6 THE FIGHT ENDS (won): the loot screen wears the bar again, in the map's rectangle (within a pixel and a half), the same
        day and crew as the map's, the batteries a number; the screen's own head (YOU WON) under it, never under it covered
     N7 LEAVE: the map wears its bar again, whole (opacity 1), on top at its place
   PLANTED (phone upright): the fight's bar forced back on the glass, the clock written on the fight's hint, the loot screen's
   bar hidden, the map's bar left see-through after the fight: each turns its leg red.
   node gates/no_top_bar_in_the_fight_gate.js */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined ? '  [' + x + ']' : '')); };
const TOL = 1.5;
const fmt = r => r ? r.map(v => Math.round(v * 10) / 10).join(',') : 'none';

/* the bar in this page, if it is on the glass, and its facts */
const BAR = () => {
  const vis = e => { if (!e) return false; const r = e.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false;
    for (let p = e; p && p.nodeType === 1; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) return false; } return true; };
  const b = document.getElementById('bmtb'), t = s => { const e = document.querySelector(s); return e && vis(e) ? e.textContent.replace(/\s+/g, ' ').trim() : null; };
  if (!vis(b)) return { on: false };
  const r = b.getBoundingClientRect(), h = document.elementFromPoint(r.x + r.width / 2, r.y + Math.min(r.height / 2, 20));
  let op = 1; for (let p = b; p && p.nodeType === 1; p = p.parentElement) op *= +getComputedStyle(p).opacity;
  return { on: true, rect: [r.x, r.y, r.width, r.height], top: !!h && b.contains(h), op: Math.round(op * 100) / 100,
    day: t('#bmtb [data-f=day] b'), crew: t('#bmtb [data-f=crew] b'), batteries: t('#bmtb [data-f=batteries] b') };
};
/* every word on the glass of this page (what a person reads), skipping what is not drawn */
const WORDS = (skipSel) => {
  const out = [], walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Map(), drawn = el => { if (seen.has(el)) return seen.get(el); let v = true; const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1 || r.bottom < 0 || r.right < 0 || r.top > innerHeight || r.left > innerWidth) v = false;
    else for (let p = el; p && p.nodeType === 1; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) { v = false; break; } }
    seen.set(el, v); return v; };
  let n; while ((n = walk.nextNode())) { const s = n.textContent.replace(/\s+/g, ' ').trim(); if (!s) continue; const el = n.parentElement; if (!el || (skipSel && el.closest(skipSel))) continue;
    if (/^(SCRIPT|STYLE|NOSCRIPT|TITLE)$/.test(el.tagName)) continue; if (drawn(el)) out.push(s); }
  return out;
};

async function side(profile) {
  console.log('\n' + profile);
  let d;
  try { d = await open({ profile, door: 120000, engage: true }); } catch (e) { ok('the demo opened', false, String(e.message).slice(0, 120)); return; }
  const p = d.page, fr = d.fr, PLANT = profile === 'phone_portrait', TOUCH = profile !== 'computer';
  const tapAt = async (x, y) => { if (TOUCH) await p.touchscreen.tap(x, y); else await p.mouse.click(x, y); };
  try {
    for (let i = 0; i < 40 && !(await fr.evaluate(() => !!document.getElementById('bmtb'))); i++) await p.waitForTimeout(250);
    await fr.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
    /* ---- N1 THE MAP ---- */
    const M = await fr.evaluate('(' + BAR + ')()');
    ok('N1 the map wears the bar, the batteries on it, nothing over it', M.on && M.top && /^\d+$/.test(String(M.batteries)), fmt(M.rect) + ' batteries ' + M.batteries + ' ' + M.day);
    for (const seq of [1, 2]) {
      const tag = 'fight ' + seq + ': ';
      await fr.evaluate(async () => { for (let i = 0; i < 40 && typeof FZOOMING !== 'undefined' && FZOOMING; i++) await new Promise(r => setTimeout(r, 250)); try { stepOnce(0); stepOnce(4); } catch (_e) {} });
      await p.waitForTimeout(1200);
      const MB = await fr.evaluate('(' + BAR + ')()');
      const t0 = await p.evaluate(() => performance.timeOrigin + performance.now());
      await fr.evaluate((s) => roadContactFight({ id: s === 1 ? 'toll_crew' : 'patrols_collide', name: s === 1 ? 'the toll crew' : 'two patrols', seq: 40 + s }), seq);
      let f = null;
      for (let i = 0; i < 150; i++) { const h = await p.$('#fightFrame'); if (h) { f = await h.contentFrame();
        if (f && await f.evaluate(() => typeof FIGHT_UI !== 'undefined' && !!FIGHT_UI.board && typeof FIGHT !== 'undefined' && !!FIGHT.S && !FIGHT.S.over).catch(() => false)) break; } f = null; await p.waitForTimeout(200); }
      if (!f) { ok(tag + 'a road fight opened through the map\'s own door', false); continue; }
      await f.evaluate(() => document.fonts.ready);
      for (let i = 0; i < 40 && await p.evaluate(() => !!(window.NFC && NFC.state !== 'off')); i++) await p.waitForTimeout(250);
      await p.waitForTimeout(1500);
      /* ---- N2 THE DOOR ---- */
      const rows = await p.evaluate((t0) => BohemiaMotion.log.filter(r => r.id === 'bar' && r.t0 >= t0 - 50).map(r => ({ how: r.how, why: r.why || null, gaps: r.gaps, ms: r.ms })), t0);
      const lift = rows.find(r => r.how === 'fly'), hung = rows.find(r => r.how === 'hold' && r.why === 'timed out');
      ok(tag + 'N2 at the door the map\'s bar lifts off the top as the clouds come in, never held over them waiting', !!lift && !hung && lift.gaps === 0, JSON.stringify(rows));
      /* ---- N3 NO BAR, NO BATTERIES, NO CLOCK ---- */
      const F = await f.evaluate('(' + BAR + ')()'), C = await fr.evaluate('(' + BAR + ')()'), S = await p.evaluate(() => !!document.querySelector('#bmtb'));
      const atBar = await p.evaluate((r) => { const out = []; for (let x = r[0] + 6; x < r[0] + r[2]; x += 24) for (let y = r[1] + 4; y < r[1] + r[3]; y += 12) { let e = document.elementFromPoint(x, y), X = x, Y = y;
        while (e && e.tagName === 'IFRAME') { const q = e.getBoundingClientRect(); X -= q.left; Y -= q.top; let e2 = null; try { e2 = e.contentDocument.elementFromPoint(X, Y); } catch (_e) {} if (!e2) break; e = e2; }
        if (e && e.closest && e.closest('#bmtb')) out.push(Math.round(x) + ',' + Math.round(y)); } return out; }, MB.rect || [0, 0, 390, 108]);
      ok(tag + 'N3 no top bar on the fight\'s glass (the fight\'s, the map\'s under it, the shell\'s), nothing at its place is the bar', !F.on && (!C.on || !atBar.length) && !S && !atBar.length,
        'fight ' + F.on + ', map under it ' + C.on + ', shell ' + S + ', bar hit at ' + (atBar.slice(0, 3).join(' ') || 'nothing'));
      const bats = String(MB.batteries || '');
      const RE = { day: /\bDAY\s*\d+\b/, hour: /\b\d{1,2}:\d{2}\b/ };
      const said = async () => { const w = (await f.evaluate('(' + WORDS + ')()')).concat(await p.evaluate('(' + WORDS + ')(' + JSON.stringify('#bohphone') + ')'));
        /* the phone's words, as drawn: its fight face is an opaque page over its home (the home's clock is under it, unseen) */
        const phone = await p.evaluate(() => { const e = document.getElementById('bohphone'); if (!e || !e.classList.contains('on')) return [];
          const face = e.querySelector('.fight.on'), fr = face && face.getBoundingClientRect();
          const covered = x => { if (!face || face.contains(x)) return false; const r = x.getBoundingClientRect(), cx = r.x + r.width / 2, cy = r.y + r.height / 2; return cx >= fr.left && cx <= fr.right && cy >= fr.top && cy <= fr.bottom; };
          const drawn = x => { const r = x.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; for (let q = x; q && q !== e.parentElement; q = q.parentElement) { const cs = getComputedStyle(q); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) return false; } return true; };
          return [...e.querySelectorAll('*')].filter(x => x.childElementCount === 0 && drawn(x) && !covered(x)).map(x => x.textContent.trim()).filter(Boolean); });
        const all = w.concat(phone);
        return { day: all.filter(s => RE.day.test(s)), hour: all.filter(s => RE.hour.test(s)), bats: bats && /^\d{3,}$/.test(bats) ? all.filter(s => s === bats || new RegExp('\\b' + bats + '\\b').test(s) && /BATTER/i.test(s)) : [] }; };
      const W = await said();
      ok(tag + 'N3 no battery count and no clock on the fight\'s screen (no DAY n, no hour, not the bar\'s ' + bats + ')', !W.day.length && !W.hour.length && !W.bats.length,
        'day ' + (W.day.slice(0, 2).join(' | ') || 'none') + '; hour ' + (W.hour.slice(0, 2).join(' | ') || 'none') + '; batteries ' + (W.bats.slice(0, 2).join(' | ') || 'none'));
      if (PLANT && seq === 1) {
        await f.evaluate(() => { const s = document.createElement('style'); s.id = 'plant'; s.textContent = 'html.bm-nobar body #top.bmhost#top{display:block!important}'; document.head.appendChild(s); });
        await p.waitForTimeout(300); const pf = await f.evaluate('(' + BAR + ')()'); await f.evaluate(() => document.getElementById('plant').remove());
        ok('PLANTED: the fight\'s bar forced back on the glass is caught', pf.on, fmt(pf.rect));
        await f.evaluate(() => { const e = document.createElement('div'); e.id = 'plantclock'; e.textContent = '14:05'; e.style.cssText = 'position:fixed;left:40px;top:40px;z-index:99;color:#fff'; document.body.appendChild(e); });
        const pw = await said(); await f.evaluate(() => document.getElementById('plantclock').remove());
        ok('PLANTED: a clock written on the fight\'s glass is caught', pw.hour.length > 0, pw.hour.join(' '));
        await p.evaluate(() => { const fc = document.querySelector('#bohphone .fight.on .fh b'); if (fc) { fc.dataset.was = fc.textContent; fc.textContent = '14:05'; } });
        const pp = await said(); await p.evaluate(() => { const fc = document.querySelector('#bohphone .fight.on .fh b'); if (fc) fc.textContent = fc.dataset.was; });
        ok('PLANTED: a clock on the phone\'s fight face is caught (the covered home clock is not counted, a drawn one is)', pp.hour.length > 0, pp.hour.join(' '));
      }
      /* ---- N4 THE BOARD GETS THE ROOM ---- */
      const room = await f.evaluate(() => ({ toph: TOPH, both: BOTH, share: Math.round(100 * (innerHeight - TOPH - BOTH) / innerHeight), was: Math.round(100 * (innerHeight - 108 - BOTH) / innerHeight) }));
      ok(tag + 'N4 the board gets the room: the fight measures its top as 0', room.toph === 0, 'TOPH ' + room.toph + ', the board ' + room.share + '% of the glass');
      /* ---- N5 THE PHONE'S CREW, SETTINGS, NOTES ---- */
      if (seq === 1) {
        const app = (a) => p.evaluate((a) => { const e = document.querySelector('#bohphone.on .fight.on .frow .app[data-app=' + a + ']'); if (!e) return null; const r = e.getBoundingClientRect(), h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
          return r.width > 0 && h && e.contains(h) ? [r.x + r.width / 2, r.y + r.height / 2] : null; }, a);
        const V = p.viewportSize(); let at;
        at = await app('crew'); if (at) await tapAt(at[0], at[1]); await p.waitForTimeout(1800);
        const c = await f.evaluate(() => { const w = document.getElementById('crewdoor'); if (!w) return null; const r = w.getBoundingClientRect(), fe = w.querySelector('iframe'); return { rect: [r.x, r.y, r.width, r.height], src: fe ? fe.getAttribute('src') : '' }; });
        ok(tag + 'N5 the phone\'s CREW opens the one company screen over the fight, the whole glass', !!at && !!c && /ROSTER_SCREEN/.test(c.src) && c.rect[2] >= V.width && c.rect[3] >= V.height, at ? (c ? c.src + ' ' + fmt(c.rect) : 'nothing opened') : 'no CREW on the phone');
        await f.evaluate(() => { try { BohemiaCrewDoor.close(); } catch (_e) {} }); await p.waitForTimeout(700);
        at = await app('settings'); if (at) await tapAt(at[0], at[1]); await p.waitForTimeout(800);
        const set = await p.evaluate(() => { const w = document.getElementById('setwrap'); if (!w) return null; const c = document.getElementById('setcard') || w, r = c.getBoundingClientRect(), h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { on: w.classList.contains('on'), top: !!h && w.contains(h) }; });
        ok(tag + 'N5 the phone\'s SETTINGS opens the game\'s settings over the fight', !!at && !!set && set.on && set.top, at ? JSON.stringify(set) : 'no SETTINGS on the phone');
        await p.evaluate(() => { const w = document.getElementById('setwrap'); if (w) w.classList.remove('on'); }); await p.waitForTimeout(300);
        at = await app('notes'); if (at) await tapAt(at[0], at[1]); await p.waitForTimeout(600);
        const nb = await f.evaluate(() => { const w = document.getElementById('notewrap'); if (!w) return null; const c = document.getElementById('notecard'), r = c.getBoundingClientRect(), h = document.elementFromPoint(r.x + r.width / 2, r.y + 20); return { on: w.classList.contains('on'), top: !!h && w.contains(h) }; });
        ok(tag + 'N5 the phone\'s NOTES opens the notes over the fight', !!at && !!nb && nb.on && nb.top, at ? JSON.stringify(nb) : 'no NOTES on the phone');
        await f.evaluate(() => { const b = document.getElementById('noteback'); if (b) b.click(); }); await p.waitForTimeout(300);
      }
      /* ---- N6 THE FIGHT ENDS: THE LOOT SCREEN ---- */
      await f.evaluate(() => { const S = FIGHT.S; S.units.filter(u => u.side === 'them').forEach(u => { u.dead = true; u.armB = 0; u.armH = 0; }); S.over = true; S.result = 'won'; showOver('won'); });
      const SF = () => p.frames().find(x => /SPOILS_SCREEN/.test(x.url()));
      for (let i = 0; i < 100 && !(SF() && await SF().evaluate(() => window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state.opened && !!document.getElementById('bmtb')).catch(() => false)); i++) await p.waitForTimeout(200);
      if (!SF()) { ok(tag + 'N6 the loot screen opened', false); continue; }
      await p.waitForTimeout(1500);
      const L = await SF().evaluate('(' + BAR + ')()');
      const head = await SF().evaluate(() => { const h = document.getElementById('bar'), r = h.getBoundingClientRect(), w = document.getElementById('word'), q = w.getBoundingClientRect(), x = document.elementFromPoint(q.x + q.width / 2, q.y + q.height / 2); return { rect: [r.x, r.y, r.width, r.height], word: !!x && w.contains(x) }; });
      const same = !!L.rect && !!MB.rect && L.rect.every((v, i) => Math.abs(v - MB.rect[i]) <= TOL);
      ok(tag + 'N6 the loot screen wears the bar again, in the map\'s rectangle, the map\'s day and crew, the batteries a number',
        L.on && L.top && L.op === 1 && same && L.day === MB.day && L.crew === MB.crew && /^\d+$/.test(String(L.batteries)), fmt(L.rect) + ' vs the map ' + fmt(MB.rect) + '; ' + L.day + ' / ' + L.crew + ' / ' + L.batteries);
      ok(tag + 'N6 the loot screen\'s own head (YOU WON) stands under the bar, read whole', head.word && head.rect[1] >= (L.rect ? L.rect[1] + L.rect[3] - TOL : 0), 'head at ' + fmt(head.rect));
      if (PLANT && seq === 1) {
        await SF().evaluate(() => { const s = document.createElement('style'); s.id = 'plant'; s.textContent = '#bmloot#bmloot{display:none!important}'; document.head.appendChild(s); });
        await p.waitForTimeout(300); const pl = await SF().evaluate('(' + BAR + ')()'); await SF().evaluate(() => document.getElementById('plant').remove());
        ok('PLANTED: the loot screen\'s bar hidden is caught', !pl.on);
      }
      /* ---- N7 LEAVE: THE MAP ---- */
      await SF().evaluate(() => document.getElementById('leave').click());
      for (let i = 0; i < 60 && await p.evaluate(() => !!document.getElementById('fightFrame') || !!(window.NFC && NFC.state !== 'off')); i++) await p.waitForTimeout(250);
      await p.waitForTimeout(800);
      const H = await fr.evaluate('(' + BAR + ')()');
      ok(tag + 'N7 LEAVE: the map wears its bar again, whole and on top, at its place', H.on && H.top && H.op === 1 && !!H.rect && H.rect.every((v, i) => Math.abs(v - MB.rect[i]) <= TOL), fmt(H.rect) + ' opacity ' + H.op);
      if (PLANT && seq === 1) {
        await fr.evaluate(() => { document.getElementById('bmtb').style.setProperty('opacity', '0'); });
        const pm = await fr.evaluate('(' + BAR + ')()'); await fr.evaluate(() => { document.getElementById('bmtb').style.removeProperty('opacity'); });
        ok('PLANTED: the map\'s bar left see-through after the fight is caught', !pm.on || pm.op < 1);
      }
    }
    ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  } finally { await d.close(); }
}

(async () => {
  await side('phone_portrait');
  await side('phone_landscape');
  await side('computer');
  console.log('\nNO TOP BAR IN THE FIGHT: ' + pass + ' ok, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
