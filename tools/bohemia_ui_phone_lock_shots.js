/* THE PHONE'S FRONT SCREEN, the shots (UI [the phone's front screen], 10/18/26). Opens the demo on his phone, opens the cracked
   phone the way the map's own phone door does, and photographs it at 1:1: NOW (the lock screen as it is, with a D10 read of what it
   resolves), then the new front screen laid IN THE BROWSER ONLY from tools/bohemia_ui_phone_lock.js, look A and look B. The face
   is the game's own (keeperFaceSrc, PORTRAIT's renderer), the line is the neighbor's real last message from the phone's own
   threads, the clock is the HUD's. Nothing is written to the game.
   node tools/bohemia_ui_phone_lock_shots.js <out dir> <phone_portrait|phone_landscape> */
const fs = require('fs'), path = require('path'); const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const [out, profile] = process.argv.slice(2);
const LOCK = fs.readFileSync(path.join(ROOT, 'tools/bohemia_ui_phone_lock.js'), 'utf8');
/* the D10 read of the phone's inside (the lock screen lives in the phone's own frame) */
const D10 = `(() => { const rows = []; const f = document.querySelector('#phoneslot iframe'); const doc = f && f.contentDocument; if (!doc) return rows;
  for (const e of doc.querySelectorAll('#lock, #lock *')) { const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue;
    const cs = doc.defaultView.getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const t = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    rows.push({ sel: (e.id ? '#' + e.id : e.tagName.toLowerCase()) + (typeof e.className === 'string' && e.className ? '.' + e.className.trim().split(/\\s+/)[0] : ''),
      grad: /gradient/.test(cs.backgroundImage), radius: parseFloat(cs.borderTopLeftRadius) || 0, blur: /blur/.test(cs.filter + cs.backdropFilter),
      glow: /\\d+px \\d+px [1-9]\\d*px/.test(cs.boxShadow + ' ' + cs.textShadow), anim: cs.animationName !== 'none', size: t ? parseFloat(cs.fontSize) : 0,
      font: t ? cs.fontFamily.split(',')[0].replace(/"/g, '').trim() : '' }); }
  return { rows, cards: doc.querySelectorAll('#lock .lk-nf').length, text: doc.querySelector('#lock') ? doc.querySelector('#lock').innerText : '' }; })()`;
(async () => {
  const d = await open({ door: 120000, profile }); const p = d.page, fr = d.fr; await p.waitForTimeout(7000);
  await fr.evaluate(() => phoneOpen()); await p.waitForTimeout(6000);
  /* the phone must be ON its lock screen for NOW (opening it may already have unlocked it) */
  await fr.evaluate(() => { const f = document.querySelector('#phoneslot iframe'); try { f.contentWindow.lockPhone(); } catch (e) {} });
  await p.waitForTimeout(1500);
  const tag = profile.replace('phone_', ''); const res = { profile };
  await p.screenshot({ path: out + '/' + tag + '_now.png' });
  res.now = await fr.evaluate(D10);
  /* the face, the line and the clock, all from the game */
  const src = await (async () => { for (const f of [p.mainFrame(), fr, ...p.frames()]) { const s = await f.evaluate(() => typeof keeperFaceSrc === 'function' ? keeperFaceSrc('suburb', 'neighbor') : null).catch(() => null); if (s) return s; } return null; })();
  if (!src) throw new Error('no keeperFaceSrc in any frame');
  const msg = await fr.evaluate(() => { const f = document.querySelector('#phoneslot iframe'); try { const t = f.contentWindow.THREADS.filter(x => x.id === 'neighbor')[0]; return { who: t.who, line: t.msgs[t.msgs.length - 1].t }; } catch (e) { return null; } });
  if (!msg) throw new Error('no neighbor thread in the phone');
  const clock = await fr.evaluate(() => ((document.getElementById('hclock') || {}).textContent || '').trim());
  await fr.evaluate(() => document.fonts.load('50px "BohemiaCasing"'));
  await fr.evaluate(LOCK);
  res.msg = msg; res.clock = clock;
  for (const look of ['A', 'B']) {
    res[look] = { laid: await fr.evaluate(({ look, src, msg, clock }) => window.__bmPhoneLock(look, src, msg, clock), { look, src, msg, clock }) };
    await p.waitForTimeout(1200);
    await p.screenshot({ path: out + '/' + tag + '_' + look + '.png' });
    res[look].measure = await fr.evaluate(() => window.__bmPhoneLockMeasure());
  }
  fs.writeFileSync(out + '/' + tag + '.json', JSON.stringify(res, null, 1));
  console.log(tag, 'now cards', res.now.cards, 'A presses', res.A.measure.presses, 'face', res.A.measure.face.nat);
  await d.close();
})().catch(e => { console.error(e); process.exit(1); });
