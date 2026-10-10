/* THE SIDEWAYS SIDES  (UI lane 11, [the sideways sides], 10/10/26)

   PAOLO 10/10, his NO on ui-the-phone-turns-10-10: 'Looks like shit, what's up with the brown-grey sides, man.' On a phone
   on its side the map sat in a 640-wide column and two flat bands of the page's brown-grey filled the sides. The row:
   the sides are the world (the map stretches to the glass, the camera shows more city, never a band); measured on the
   flipped phone: zero pixels of flat band at either edge. [bb the Battle Brothers screen has no bands at any width.]
   The rule is slices/bohemia_ui_materials.js's (the landscape media rule); the city file is not edited.

   WHAT THIS HOLDS, on the demo's map through the one driver, on its side (844x390) and upright (390x844):
     - NO FLAT BAND AT EITHER EDGE: the outer 6 points of the screenshot, left and right, from under the bar to the foot,
       are the map (they vary like the map does), not a flat colour, and almost none of it is the page's brown-grey
     - the map is drawn to the edge (its canvas spans the glass and its drawing fills the canvas's last column)
     - the bar runs the whole width, whole on the glass
     - the phone does not sit under the gear, and nothing of the HUD covers anything else (the gear, the bar, the speed
       pad, the phone)
     - no page error

   node gates/the_sideways_sides_gate.js */
const path = require('path');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (m, g, extra) => { if (g) { pass++; console.log('  ok   ' + m + (extra ? '  [' + extra + ']' : '')); } else { fail++; console.log('  FAIL ' + m + (extra ? '  [' + extra + ']' : '')); } };
const done = () => { console.log('\nTHE SIDEWAYS SIDES: ' + pass + ' ok, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const hit = (a, b) => a && b && a.x < b.x + b.w - 1 && b.x < a.x + a.w - 1 && a.y < b.y + b.h - 1 && b.y < a.y + a.h - 1;

(async () => {
  console.log('\nTHE SIDEWAYS SIDES  (UI [the sideways sides])\n');
  for (const prof of ['phone_landscape', 'phone_portrait']) {
    const d = await open({ door: 120000, profile: prof });
    if (!d.doorIsBehindUs()) { ok('the driver got past the door', false); await d.close(); continue; }
    const p = d.page, fr = d.fr;
    await p.waitForTimeout(6000);
    const fb = await (await fr.frameElement()).boundingBox();
    const gear = await p.evaluate(() => { const g = document.getElementById('gearbtn') || [...document.querySelectorAll('*')].find(e => e.children.length === 0 && (e.textContent || '').trim() === '⚙' && e.getBoundingClientRect().width > 0);
      if (!g) return null; const r = g.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    const m = await fr.evaluate(({ ox, oy }) => {
      const R = id => { const e = document.getElementById(id); if (!e) return null; const s = getComputedStyle(e), r = e.getBoundingClientRect(); if (s.display === 'none' || !r.width) return null; return { x: ox + r.x, y: oy + r.y, w: r.width, h: r.height }; };
      return { vw: innerWidth, vh: innerHeight, bar: R('menubar'), pad: R('speedpad'), phone: R('cityfeed'), cv: R('cv'), body: getComputedStyle(document.body).backgroundColor };
    }, { ox: fb.x, oy: fb.y });
    const png = (await p.screenshot()).toString('base64');
    const top = Math.ceil((m.bar ? m.bar.y + m.bar.h : 50) + 2);
    const edges = await p.evaluate(async ({ png, top, body }) => {
      const im = new Image(); im.src = 'data:image/png;base64,' + png; await im.decode();
      const c = document.createElement('canvas'); c.width = im.width; c.height = im.height; const g = c.getContext('2d'); g.drawImage(im, 0, 0);
      const sc = im.width / innerWidth, B = body.match(/\d+/g).map(Number);
      const strip = (x0) => { const d = g.getImageData(Math.round(x0 * sc), Math.round(top * sc), Math.round(6 * sc), Math.round((innerHeight - top - 2) * sc)).data;
        let n = 0, s = 0, s2 = 0, page = 0; for (let i = 0; i < d.length; i += 4) { const l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; n++; s += l; s2 += l * l;
          if (Math.abs(d[i] - B[0]) <= 4 && Math.abs(d[i + 1] - B[1]) <= 4 && Math.abs(d[i + 2] - B[2]) <= 4) page++; }
        const mean = s / n; return { spread: +Math.sqrt(Math.max(0, s2 / n - mean * mean)).toFixed(1), page: +(page / n).toFixed(3) }; };
      return { left: strip(0), right: strip(innerWidth - 6) };
    }, { png, top, body: m.body });
    console.log('\n  -- ' + prof + ' ' + m.vw + 'x' + m.vh + '\n');
    ok('NO FLAT BAND AT EITHER EDGE: the outer 6 points vary like the map, and almost none is the page\'s brown-grey',
       edges.left.spread >= 12 && edges.right.spread >= 12 && edges.left.page < 0.05 && edges.right.page < 0.05,
       'left spread ' + edges.left.spread + ' page ' + edges.left.page + ' | right spread ' + edges.right.spread + ' page ' + edges.right.page);
    ok('  the map\'s canvas spans the glass', !!m.cv && m.cv.x <= 0.5 && m.cv.x + m.cv.w >= m.vw - 0.5, m.cv && Math.round(m.cv.x) + '..' + Math.round(m.cv.x + m.cv.w) + ' of ' + m.vw);
    ok('  the bar runs the whole width, whole on the glass', !!m.bar && m.bar.x >= -0.5 && m.bar.y >= -0.5 && Math.abs(m.bar.w - m.vw) <= 1, m.bar && Math.round(m.bar.x) + ',' + Math.round(m.bar.y) + ' ' + Math.round(m.bar.w));
    const big = { gear, bar: m.bar, speedpad: m.pad, phone: m.phone }, ks = Object.keys(big), clash = [];
    for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) if (hit(big[ks[i]], big[ks[j]])) clash.push(ks[i] + ' on ' + ks[j]);
    ok('  the phone is clear of the gear, and nothing of the HUD covers anything else', clash.length === 0 && !!gear && !!m.phone, clash.join(', ') || ('gear ' + (gear && Math.round(gear.x + gear.w)) + ', phone from ' + (m.phone && Math.round(m.phone.x))));
    ok('  no page error', !(d.errs && d.errs.length), (d.errs || []).slice(0, 2).join(' | '));
    await d.close();
  }
  done();
})().catch(e => { console.error(e); process.exit(1); });
