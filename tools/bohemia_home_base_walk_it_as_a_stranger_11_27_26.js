#!/usr/bin/env node
/* HOME BASE 5, 11/27/26: WALK IT AS A STRANGER (VAMILY rule 492(c): 'the owner plays the whole flow at 390x844, upright and sideways, as
   a first-time player, and writes in a record every moment where the next step is not clear'). A new game on the demo, real taps only
   where a player would tap: day 2 on the map (PLANT appears), the phone's YOUR PLACE page, GO THERE if the ground is no good, PLANT HERE,
   'Are you sure?', planted; his place opened from the map (a tap on it); the first build (a tap on an empty lot, BUILD's desk, a build);
   away and back (the page's GO HOME). A picture at every step and what was on the glass, into records/target/home_base/stranger/.
   Run: node tools/bohemia_home_base_walk_it_as_a_stranger_11_27_26.js --only phone_portrait (then phone_landscape) */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/target/home_base/stranger');
fs.mkdirSync(OUT, { recursive: true });
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const { throughTheTitle } = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
const arg = n => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : null; };
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !arg('--only') || p === arg('--only'));
async function box(P, sel) { return P.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); if (r.width < 2) return null; return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: Math.round(r.width), h: Math.round(r.height), dis: !!e.disabled, txt: (e.innerText || '').slice(0, 40) }; }, sel).catch(() => null); }
(async () => {
  for (const prof of PROFS) {
    const steps = [];
    const d = await drive.open({ profile: prof, keepCards: true, beforeTap: async (pg) => {
      for (let i = 0; i < 120; i++) { if (await pg.evaluate(() => !!window.__LOAD_READY && !!document.getElementById('title')).catch(() => false)) break; await pg.waitForTimeout(250); }
      await pg.waitForTimeout(1500); await throughTheTitle(pg); await pg.waitForTimeout(1800); } });
    const P = d.page, F = d.fr;
    for (let i = 0; i < 40; i++) { if (await F.evaluate(() => !!(window.BohemiaHome && BohemiaHome.data())).catch(() => false)) break; await P.waitForTimeout(250); }
    const phone = async () => P.evaluate(() => { const e = document.querySelector('#bohphone .hb'); return e ? e.innerText.replace(/\n+/g, ' | ') : null; }).catch(() => null);
    const shot = async (n, note) => { const f = path.join(OUT, prof + '_' + n + '.png'); await P.screenshot({ path: f }); const s = { n, note, phone: await phone(), btns: await P.evaluate(() => [...document.querySelectorAll('#bohphone .hb button, #bohphone .bpctx button')].filter(b => b.offsetParent).map(b => { const r = b.getBoundingClientRect(); return (b.innerText || b.getAttribute('aria-label') || '').trim().slice(0, 24) + '@' + Math.round(r.x) + ',' + Math.round(r.y) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height) + (b.disabled ? ' OFF' : ''); })).catch(() => []) }; steps.push(s); console.log(prof, n, JSON.stringify(s).slice(0, 400)); };
    await F.evaluate(() => { try { loopClose(); } catch (e) {} }); await P.waitForTimeout(1500);
    await shot('01_day1_map', 'a new game, day 1 on the map: is there any sign that a place of his own exists?');
    await F.evaluate(() => { DAY.day = 2; try { render(); } catch (e) {} }); await P.waitForTimeout(1500);
    await shot('02_day2_band', 'day 2: PLANT in the phone band');
    const pl = await box(P, '#bohphone .bpctx .pl'); if (pl) await P.touchscreen.tap(pl.x, pl.y); await P.waitForTimeout(1300);
    await shot('03_your_place_page', 'the YOUR PLACE page where he stands');
    const better = await box(P, '#bohphone .hb button[data-h="better"]');
    if (better) { await P.touchscreen.tap(better.x, better.y); await P.waitForTimeout(800); await shot('04_going_there', 'GO THERE: the party travels');
      for (let i = 0; i < 60; i++) { await P.waitForTimeout(500); if (await F.evaluate(() => { try { return !(window.TRAVEL && TRAVEL.on) && !(city && city.path && city.path.length); } catch (e) { return true; } })) break; }
      await P.waitForTimeout(1500); await shot('05_arrived', 'arrived: does the phone say what to do now?');
      const pl2 = await box(P, '#bohphone .bpctx .pl'); if (pl2) { await P.touchscreen.tap(pl2.x, pl2.y); await P.waitForTimeout(1300); }
      await shot('06_page_again', 'PLANT again: the page where he stands now'); }
    const ph = await box(P, '#bohphone .hb button[data-h="plant"]');
    if (ph && !ph.dis) { await P.touchscreen.tap(ph.x, ph.y); await P.waitForTimeout(900); await shot('07_are_you_sure', 'Are you sure? This is permanent.');
      const yes = await box(P, '#bohphone .hb button[data-h="yes"]'); if (yes) { await P.touchscreen.tap(yes.x, yes.y); await P.waitForTimeout(2500); }
      await shot('08_planted', 'planted: what now?'); }
    else steps.push({ n: '07_are_you_sure', note: 'PLANT HERE was off or missing: ' + JSON.stringify(ph) });
    /* close the phone page and look at the map: is his place on it, does it say tap me? */
    await P.evaluate(() => { const c = document.querySelector('#bohphone .pg .x, #bohphone .pgx, #bohphone [data-close]'); if (c) c.click(); }).catch(() => {}); await P.waitForTimeout(1200);
    await shot('09_map_after', 'the map after planting: where is it, how does he go in?');
    /* go in the way a player would: a tap on his place on the map (the map's own hit test for the town under the finger) */
    const at = await F.evaluate(() => { try { const bs = ctBases(), n = BohemiaBetween.mine(); const t = bs[n]; const p = (typeof cellToScreen === 'function') ? cellToScreen(t.x, t.y) : null; return { n, x: t.x, y: t.y, p }; } catch (e) { return { err: String(e) }; } });
    steps.push({ n: '09b_where', note: 'his place on the map', at });
    await F.evaluate(() => { const bs = ctBases(), n = BohemiaBetween.mine(), t = { name: n, x: bs[n].x, y: bs[n].y, tier: mapTierOf(n) }; city.x = t.x; city.y = t.y; loopOpenTown(t); });
    let fr = null; for (let i = 0; i < 80 && !fr; i++) { await P.waitForTimeout(400); for (const x of P.frames()) if (/SETTLEMENT/.test(x.url()) && await x.evaluate(() => { try { return BohemiaSettlement.ready() && !!(window.__HOME_FEED && window.__HOME_FEED.on); } catch (e) { return false; } }).catch(() => false)) { fr = x; break; } }
    await P.waitForTimeout(3500); await shot('10_his_place', 'his place opened: does it say what to do first?');
    if (fr) { const fb = await (await fr.frameElement()).boundingBox(); await P.waitForTimeout(2500);
      const lot = await fr.evaluate(() => { const w = BohemiaSettlement.where('build'); return w ? [w.x, w.y, w.lot] : null; });
      if (lot) { await P.touchscreen.tap(fb.x + lot[0], fb.y + lot[1]); await P.waitForTimeout(1500); }
      await shot('11_desk', 'a tap on an empty lot: BUILD\'s desk');
      const first = await fr.evaluate(() => { const b = [...document.querySelectorAll('#sbody .act[data-build]')].filter(e => !e.disabled)[0] || [...document.querySelectorAll('#sbody .act[data-place]')].filter(e => !e.disabled)[0]; if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, t: b.innerText.replace(/\n/g, ' ') }; });
      steps.push({ n: '11b_first', note: 'the first build he can afford', first });
      if (first) { await P.touchscreen.tap(fb.x + first.x, fb.y + first.y); await P.waitForTimeout(1600); }
      await shot('12_first_build', 'the first build: what did it say, does he know it stands tomorrow?'); }
    /* away and back */
    await F.evaluate(() => { try { loopClose(); } catch (e) {} }); await P.waitForTimeout(1500);
    await F.evaluate(() => { city.x = Math.max(1, city.x - 6); try { render(); } catch (e) {} }); await P.waitForTimeout(1200);
    await shot('13_away', 'away from his place on the map: how does he get back?');
    fs.writeFileSync(path.join(OUT, prof + '_steps.json'), JSON.stringify(steps, null, 1));
    require('child_process').spawnSync('python3', ['-c', "import glob,os,sys\nfrom PIL import Image\nfor p in glob.glob(sys.argv[1]+'/*.png'):\n  im=Image.open(p).convert('RGB'); im.resize((im.width//3,im.height//3)).save(p[:-4]+'.webp','WEBP',quality=75); os.remove(p)", OUT]);   /* kept small: a third, WebP */
    await d.close();
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
