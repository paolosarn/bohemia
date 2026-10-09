/* THE PHONE'S LOOK  (UI lane 11, [the phone's look], 10/9/26)

   RULE 67a (one UI across map, settlement and fight) and his votes on the phone (9/23 a cracked iPhone in the
   city view only; 9/27 one crack, his A). The row: the phone on the map (the feed, its clock, the family faces,
   its buttons) in the same materials and type as the bar, 44 pt where it is pressed, the sun test on every post,
   the crack kept. Drawn by slices/bohemia_ui_materials.js (dressPhone); the city file is not edited.

   WHAT THIS HOLDS, on the demo's map at his phone's profile through the one driver:
     - the phone wears the materials and the game's faces are loaded in its frame
     - THE OBJECT IS KEPT: the drawn fracture, the chips, the island, no tape, 19.5 by 9
     - a hard contact edge under it, never a soft blurred shadow (rule 71)
     - the hour and the handles are stamped in CASING, the posts printed in ROM
     - EVERY POST on the glass (its handle and its words), the hour and the signal pass 4.5 to 1 against the
       glass, plain and with a quarter white added (the sun, rule 73)
     - the family face is a card from the bar's cardboard (or the bar's amber when it is you), its name passes
       4.5 to 1 plain and in the sun
     - 44 points where it is pressed: the phone, and every face, with one face and with all three unlocked, the
       three inside the glass
     - a real finger on the third face makes it the one you are
     - no page error

   node gates/the_phones_look_gate.js */
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nTHE PHONE\'S LOOK: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };

/* read boxes of the real screenshot and give the ink's contrast on what is under it, plain and in the sun.
   `dark`: the ground is dark glass, so its worst case is its LIGHTER quarter (a crack, the shine) */
async function contrasts(page, jobs) {
  const png = (await page.screenshot()).toString('base64');
  return page.evaluate(async ({ png, jobs }) => {
    const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
    const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
    const sc = im.width / innerWidth;
    const LUM = (r, gg, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(gg) + 0.0722 * f(b); };
    const CR = (x, y) => (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05), SUN = q => q.map(v => v + (255 - v) * 0.25);
    return jobs.map(j => {
      const b = j.box, d = g.getImageData(Math.round(b[0] * sc), Math.round(b[1] * sc), Math.max(1, Math.round(b[2] * sc)), Math.max(1, Math.round(b[3] * sc))).data;
      const S = []; for (let i = 0; i < d.length; i += 4) S.push([d[i], d[i + 1], d[i + 2]]);
      S.sort((p, q) => LUM(...p) - LUM(...q));
      const bg = S[Math.floor(S.length * (j.dark ? 0.75 : 0.25))], t = j.ink.match(/\d+/g).slice(0, 3).map(Number);
      return { k: j.k, plain: +CR(LUM(...t), LUM(...bg)).toFixed(2), sun: +CR(LUM(...SUN(t)), LUM(...SUN(bg))).toFixed(2) };
    });
  }, { png, jobs });
}

(async () => {
  console.log('\nTHE PHONE\'S LOOK  (UI [the phone\'s look], rule 67a)\n');
  const d = await open({ door: 120000 });
  if (!d.doorIsBehindUs()) { ok('the driver got past the door', false); await d.close(); done(); }
  const p = d.page, fr = d.fr;
  const t0 = Date.now(); while (Date.now() - t0 < 20000) { if (await fr.evaluate(() => { const f = document.getElementById('cityfeed'); return f && f.classList.contains('on') && document.querySelectorAll('#cityfeedlist .fp.in').length >= 2; })) break; await p.waitForTimeout(300); }
  await p.waitForTimeout(1200);
  const fb = await (await fr.frameElement()).boundingBox();

  const base = await fr.evaluate(() => {
    const f = document.getElementById('cityfeed'), cs = getComputedStyle(f), r = f.getBoundingClientRect(), gl = document.getElementById('cityfeedglass');
    /* the edge in BOTH states: ringing (a call waiting) and quiet, because the demo opens ringing and a soft
       shadow on the quiet phone hid behind the ring's (caught by a mutation, 10/9) */
    const was = f.classList.contains('ring'), shadows = [];
    for (const ring of [true, false]) { f.classList.toggle('ring', ring); shadows.push(getComputedStyle(f).boxShadow); }
    f.classList.toggle('ring', was);
    const outer = shadows.join(', ').split(/,(?![^(]*\))/).map(s => s.trim()).filter(s => !/inset/.test(s));
    return {
      on: f.classList.contains('on'), dressed: !!document.getElementById('bm-phone') && !!(window.BohemiaMaterials && BohemiaMaterials.dressPhone),
      faces: ['BohemiaCasing', 'BohemiaROM'].map(n => Array.from(document.fonts).some(x => x.family.replace(/["']/g, '') === n && x.status === 'loaded')),
      cracks: gl ? gl.querySelectorAll('svg path').length : 0, tape: !!document.querySelector('#cityfeed .tape,#cityfeedtape'),
      chips: ['::before', '::after'].filter(w => { const c = getComputedStyle(f, w); return c.content !== 'none' && parseFloat(c.width) > 1; }).length,
      island: getComputedStyle(document.getElementById('cityfeedbar'), '::before').content !== 'none',
      w: r.width, h: r.height, outer, blurs: outer.map(s => { const n = s.replace(/rgba?\([^)]*\)|#[0-9a-f]+/gi, '').match(/-?[\d.]+px/g) || []; return parseFloat(n[2] || '0'); }),
      clockFam: getComputedStyle(document.getElementById('cityfeedclock')).fontFamily.split(',')[0].replace(/["']/g, ''),
      whoFam: [...document.querySelectorAll('#cityfeedlist .fp .who')].map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '')),
      txtFam: [...document.querySelectorAll('#cityfeedlist .fp .txt')].map(e => getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, ''))
    };
  });
  ok('the phone is on the map and wears the materials', base.on && base.dressed, JSON.stringify({ on: base.on, dressed: base.dressed }));
  ok('  the game\'s faces are loaded in its frame (CASING, ROM)', base.faces.every(Boolean), JSON.stringify(base.faces));
  ok('THE OBJECT IS KEPT: the drawn crack, two chips, the island, no tape', base.cracks >= 6 && base.chips >= 2 && base.island && !base.tape,
     base.cracks + ' crack paths, ' + base.chips + ' chips, island ' + base.island + ', tape ' + base.tape);
  ok('  and it is still the shape of a phone, 19.5 by 9', Math.abs(base.h / base.w - 2.167) < 0.12, Math.round(base.w) + 'x' + Math.round(base.h));
  ok('A HARD EDGE UNDER IT, NOT A SOFT SHADOW', base.outer.length > 0 && base.blurs.every(b => b === 0), base.outer.join(' | '));
  ok('THE HOUR AND THE HANDLES ARE STAMPED (CASING), THE POSTS PRINTED (ROM)',
     base.clockFam === 'BohemiaCasing' && base.whoFam.length > 0 && base.whoFam.every(f => f === 'BohemiaCasing') && base.txtFam.every(f => f === 'BohemiaROM'),
     base.clockFam + ' / ' + [...new Set(base.whoFam)].join() + ' / ' + [...new Set(base.txtFam)].join());

  /* THE SUN TEST ON EVERY POST. The glass is read in the gap under each post (no words there), the ink is
     the post's own computed colour; the hour and the signal against the status row's glass between them. */
  const jobs = await fr.evaluate(({ ox, oy }) => {
    const scr = document.getElementById('cityfeedscreen').getBoundingClientRect(), list = document.getElementById('cityfeedlist').getBoundingClientRect();
    const out = [];
    /* the feed's posts AND the board's (UI [phone contracts], 10/9: the valley's asks are world posts above the feed, and
       with them on the glass the feed fits fewer whole posts, so both are read) */
    document.querySelectorAll('#bmboard .fp.job, #cityfeedlist .fp.in').forEach((fp, i) => {
      const r = fp.getBoundingClientRect(), inList = !!fp.closest('#cityfeedlist');
      if (inList ? (r.bottom > list.bottom - 24 || r.top < list.top) : (r.top < scr.top || r.bottom > scr.bottom)) return;   /* only what is fully on the glass, clear of the fade */
      const box = [ox + r.left + 4, oy + r.bottom + 1, r.width - 8, 4];
      out.push({ k: 'post ' + i + ' handle', box, ink: getComputedStyle(fp.querySelector('.who')).color, dark: true });
      out.push({ k: 'post ' + i + ' words', box, ink: getComputedStyle(fp.querySelector('.txt')).color, dark: true });
    });
    const bar = document.getElementById('cityfeedbar').getBoundingClientRect(), ck = document.getElementById('cityfeedclock').getBoundingClientRect();
    const gap = [ox + ck.right + 4, oy + bar.top + 3, 6, bar.height - 6];
    out.push({ k: 'the hour', box: gap, ink: getComputedStyle(document.getElementById('cityfeedclock')).color, dark: true });
    out.push({ k: 'the signal', box: gap, ink: getComputedStyle(document.getElementById('cityfeedsig')).color, dark: true });
    return out;
  }, { ox: fb.x, oy: fb.y });
  const cr = await contrasts(p, jobs);
  const posts = cr.filter(c => /^post/.test(c.k));
  ok('EVERY POST ON THE GLASS PASSES 4.5 TO 1, PLAIN AND IN THE SUN (handle and words)', posts.length >= 4 && posts.every(c => c.plain >= 4.5 && c.sun >= 4.5),
     posts.length / 2 + ' posts; worst ' + posts.reduce((m, c) => Math.min(m, c.sun), 99) + ' in the sun; ' + posts.filter(c => c.sun < 4.5).map(c => c.k + ' ' + c.plain + '/' + c.sun).join(', '));
  const bar = cr.filter(c => !/^post/.test(c.k));
  ok('  and so do the hour and the signal', bar.every(c => c.plain >= 4.5 && c.sun >= 4.5), bar.map(c => c.k + ' ' + c.plain + '/' + c.sun).join(', '));

  /* THE FAMILY, as cards. Measured with the faces there are, then with all three unlocked by the game's own hook. */
  async function tiles() {
    return fr.evaluate(({ ox, oy }) => {
      const scr = document.getElementById('cityfeedscreen').getBoundingClientRect();
      return [...document.querySelectorAll('#actflip .af')].map(t => { const r = t.getBoundingClientRect(), cs = getComputedStyle(t), n = t.querySelector('.afn'), nr = n.getBoundingClientRect();
        return { now: t.classList.contains('now'), w: r.width, h: r.height, inGlass: r.left >= scr.left - 0.5 && r.right <= scr.right + 0.5 && r.bottom <= scr.bottom + 0.5,
          bg: cs.backgroundImage.slice(0, 140), fam: getComputedStyle(n).fontFamily.split(',')[0].replace(/["']/g, ''), ink: getComputedStyle(n).color, name: n.textContent,
          /* the card read under the name: a strip just below the face, inside the card's own border */
          box: [ox + r.left + 3, oy + r.bottom - 6, r.width - 6, 3], x: ox + r.left + r.width / 2, y: oy + r.top + r.height / 2 }; });
    }, { ox: fb.x, oy: fb.y });
  }
  const one = await tiles();
  const cardOk = t => t.now ? /linear-gradient\(rgb\(244, 207, 124\)/.test(t.bg) : /url\(/.test(t.bg);
  ok('THE FAMILY FACE IS A CARD (the bar\'s cardboard, or its amber when it is you), its name stamped', one.length >= 1 && one.every(t => cardOk(t) && t.fam === 'BohemiaCasing'),
     one.map(t => t.name + (t.now ? ' (you)' : '') + ' ' + t.bg.slice(0, 26) + ' ' + t.fam).join(', '));
  const c1 = await contrasts(p, one.map(t => ({ k: t.name, box: t.box, ink: t.ink, dark: !t.now })));
  ok('  and its name passes 4.5 to 1 plain and in the sun', c1.every(c => c.plain >= 4.5 && c.sun >= 4.5), c1.map(c => c.k + ' ' + c.plain + '/' + c.sun).join(', '));
  ok('44 POINTS WHERE IT IS PRESSED: the phone and the face', base.w >= 44 && one.every(t => t.w >= 44 && t.h >= 44 && t.inGlass),
     'phone ' + Math.round(base.w) + 'x' + Math.round(base.h) + '; ' + one.map(t => Math.round(t.w) + 'x' + Math.round(t.h)).join(', '));

  await fr.evaluate(() => { try { BohemiaActs.resetAll(); ctActUnlock(2); ctActUnlock(3); } catch (e) {} });
  await p.waitForTimeout(900);
  const three = await tiles();
  ok('  and with all three of the family unlocked, every face is 44 points and inside the glass', three.length === 3 && three.every(t => t.w >= 44 && t.h >= 44 && t.inGlass && cardOk(t)),
     three.map(t => t.name + ' ' + Math.round(t.w) + 'x' + Math.round(t.h) + (t.inGlass ? '' : ' OFF THE GLASS')).join(', '));
  const c3 = await contrasts(p, three.map(t => ({ k: t.name, box: t.box, ink: t.ink, dark: !t.now })));
  ok('  and all three names pass 4.5 to 1 plain and in the sun', c3.length === 3 && c3.every(c => c.plain >= 4.5 && c.sun >= 4.5), c3.map(c => c.k + ' ' + c.plain + '/' + c.sun).join(', '));
  if (three.length === 3) {
    const before = await fr.evaluate(() => BohemiaActs.current());
    await p.touchscreen.tap(three[2].x, three[2].y); await p.waitForTimeout(1500);
    const after = await fr.evaluate(() => ({ cur: BohemiaActs.current(), lit: [...document.querySelectorAll('#actflip .af')].map(t => t.classList.contains('now')) }));
    ok('A REAL FINGER ON THE THIRD FACE MAKES IT THE ONE YOU ARE', after.cur !== before && after.lit[2] === true, before + ' -> ' + after.cur);
  } else ok('A REAL FINGER ON THE THIRD FACE MAKES IT THE ONE YOU ARE', false, 'no three faces');
  await fr.evaluate(() => { try { BohemiaActs.resetAll(); } catch (e) {} });
  ok('no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
  await d.close();
  done();
})().catch(e => { console.error(e); process.exit(1); });
