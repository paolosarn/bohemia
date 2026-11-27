/* HIS FINGER ON THE DOOR  (UI FIVE, 11/27/26; VAMILY rules 480(c), 482, 441; the routine 'UI FIVE: keep cooking': 'the next screen
   he meets, better and never choppy')

   MEASURED (the demo, a fresh phone, the CPU slowed 4x, NEW GAME, a tap on a crew pick): the door's frames held 333 to 400 ms (long tasks
   425, 243, 219 ms upright; 337 and 210 on its side), 30 to 45 frames a second. The profile put 876 ms of it in the jobs' planner
   (slices/bohemia_job_danger.js planSlice): a pick turns the crew key, so every job in the valley is planned again, one job of about
   300 ms a slice, starting 100 ms after his tap, on top of the door redrawing under his finger.
   THE FIX (slices/bohemia_job_danger.js __NO_PLANS_UNDER_HIS_FINGER_ON_THE_DOOR__): while the door (the top page's #front before BEGIN)
   or the barber's chair (#mainmaker) is up, the plans wait for 2.5 s after his last touch there, and run while he reads, as before, so
   they are done by GO (holding them for the whole door only moved them onto GO and the squad's tape: measured 38 -> 24 frames a second).
   After: a pick 59 frames a second, its worst frame 17 to 50 ms, upright and on its side.

   On the DEMO, through the one driver (in its beforeTap: the title, NEW GAME, the picks, the CPU slowed 4x there and only there), a phone
   upright (390 x 844) and on its side (844 x 390):
     D1 HIS FINGER: three picks, each with a real touch: inside the 2.5 s after each (the page's own clock), the planner makes no plan and
        says it waited (doorWaited grows); the frames are printed
     D2 WHILE HE READS: 5 s with no touch on the door, the planner works again (plans made, or none left to make)
     D3 ON THE MAP: once the driver is through BEGIN and the chair, 4 s on the map: the planner never waits for the door
     D4 nothing threw
   PLANTED (upright, the service worker off): window.__PLANS_UNDER_THE_DOOR (the way it was): D1 red, plans made under his finger.
   node gates/his_finger_on_the_door_gate.js [phone_portrait|phone_landscape] [--no-plant] */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const drive = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const TT = require(path.join(ROOT, 'tools/bohemia_through_the_title.js'));
let pass = 0, fail = 0;
const ok = (m, g, x) => { g ? pass++ : fail++; console.log((g ? '  ok   ' : '  FAIL ') + m + (x !== undefined && x !== '' ? '  [' + String(x).slice(0, 500) + ']' : '')); return g; };
const ARGS = process.argv.slice(2);
const PROFS = ['phone_portrait', 'phone_landscape'].filter(p => !ARGS.some(a => /^phone_/.test(a)) || ARGS.includes(p));
const QUIET = 1800;

/* the planner's counts, from the frame that carries it (the map's, found once and kept: a search of every frame at 4x took most of a
   second and let a read land past the quiet), with the page's own clock and his last touch on the door */
let MF = null;
async function plans(page) {
  const read = f => f.evaluate(() => { if (!(window.BohemiaJobDanger && BohemiaJobDanger.state)) return null; const r = BohemiaJobDanger.state().plans; let t = 0; try { t = window.top.__BOH_DOOR_TOUCH || 0; } catch (e) {}
    return { waiting: r.waiting | 0, planned: r.planned | 0, slices: r.slices | 0, door: r.doorWaited | 0, now: Date.now(), touch: t }; }).catch(() => null);
  if (MF && !MF.isDetached()) { const r = await read(MF); if (r) return r; }
  for (const f of page.frames()) { const r = await read(f); if (r) { MF = f; return r; } }
  return null;
}
const FRAMES = () => { window.__hfd = []; const f = t => { if (window.__hfd) { window.__hfd.push(t); requestAnimationFrame(f); } }; requestAnimationFrame(f); };
const READ_FRAMES = () => { const a = window.__hfd || []; window.__hfd = null; const d = []; for (let i = 1; i < a.length; i++) d.push(a[i] - a[i - 1]); const span = (a[a.length - 1] - a[0]) || 1;
  return { fps: +((a.length - 1) * 1000 / span).toFixed(1), worst: Math.round(Math.max(0, ...d)) }; };

async function walk(profile, plant) {
  const tag = 'the demo ' + (profile === 'phone_portrait' ? 'upright' : 'on its side');
  console.log('\n' + tag + (plant ? ' PLANTED (__PLANS_UNDER_THE_DOOR, the way it was)' : ''));
  const errs = []; const picks = []; let readW = null, through = false, cdp = null;
  let d;
  try {
    d = await drive.open({ profile, noWorker: !!plant,
      beforeGoto: async (c, pg) => { pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160))); if (plant) await pg.addInitScript(() => { window.__PLANS_UNDER_THE_DOOR = true; }); },
      beforeTap: async (pg) => {
        through = await TT.throughTheTitle(pg, 120000);
        /* the valley finishes loading behind the door first (its own long frames, not a pick's: measured 13 fps under the first pick
           both ways while it loaded, 59 once it had); a pick is measured on a loaded door */
        await pg.waitForFunction(() => window.__LOAD_READY === true, null, { timeout: 240000 }).catch(() => {});
        await pg.waitForTimeout(1500);
        cdp = await pg.context().newCDPSession(pg); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        try {
          for (let i = 0; i < 3; i++) {
            const at = await pg.evaluate(i => { const e = [...document.querySelectorAll('#front [data-k=origin]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight; })[i];
              if (!e) return null; const r = e.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2, (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 24)]; }, i);
            if (!at) { picks.push({ none: true }); continue; }
            await pg.evaluate(FRAMES);
            await pg.touchscreen.tap(at[0], at[1]);
            /* read after the touch has landed: a plan already running when the finger came down has finished by now and is not
               counted against the pick (the page is one thread; a plan that starts after the touch sees it and waits) */
            const p0 = await plans(pg);
            await pg.waitForTimeout(QUIET);
            const fr = await pg.evaluate(READ_FRAMES), p1 = await plans(pg);
            /* judged only inside the quiet: the read after must come within 2.5 s of his touch by the page's own clock */
            picks.push({ name: at[2], made: p1 && p0 ? p1.slices - p0.slices : null, waited: p1 && p0 ? p1.door - p0.door : null, queued: p1 ? p1.waiting : null, fr,
              span: p1 && p0 ? [p0.now - p1.touch, p1.now - p1.touch] : null, inQuiet: !!(p1 && p0 && p1.touch && p0.now >= p1.touch && p1.now - p1.touch <= 2500) });
            await pg.waitForTimeout(300);
          }
          const r0 = await plans(pg); await pg.waitForTimeout(5000); const r1 = await plans(pg);
          readW = { before: r0, after: r1 };
        } finally { await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }).catch(() => {}); }
      } });
  } catch (e) { ok(tag + ': the page boots', false, String(e.message).slice(0, 160)); return; }
  const P = d.page;
  try {
    const shown = picks.map(k => k.none ? 'no pick' : '"' + k.name + '": ' + k.made + ' plan slice(s) between ' + (k.span ? k.span.join(' and ') : '?') + ' ms after the touch, waited ' + k.waited + ', ' + k.queued + ' queued, ' + k.fr.fps + ' fps, worst ' + k.fr.worst + ' ms').join('; ');
    const d1 = through && picks.length === 3 && picks.every(k => !k.none && k.inQuiet && k.made === 0 && k.waited > 0);
    if (plant) { ok(tag + ' PLANTED: D1 goes red, plans made under his finger (' + shown + ')', !d1 && picks.some(k => k.inQuiet && k.made > 0)); return; }
    ok('D1 ' + tag + ' HIS FINGER: three picks at 4x, no plan made inside the 2.5 s after each touch (' + shown + ')', d1);
    const rb = readW && readW.before, ra = readW && readW.after;
    ok('D2 ' + tag + ' WHILE HE READS: 5 s untouched, the planner works again (' + (rb && ra ? 'planned ' + rb.planned + ' -> ' + ra.planned + ', waiting ' + rb.waiting + ' -> ' + ra.waiting : 'no planner') + ')',
      !!rb && !!ra && (ra.planned > rb.planned || ra.waiting === 0));
    await P.waitForTimeout(2000);
    const m0 = await plans(P); await P.waitForTimeout(4000); const m1 = await plans(P);
    const up = await P.evaluate(() => ({ front: (() => { const f = document.getElementById('front'); return !!(f && f.offsetWidth > 0 && getComputedStyle(f).display !== 'none'); })(), began: !!window.__PLAY_BEGAN }));
    ok('D3 ' + tag + ' ON THE MAP the planner never waits for the door (' + JSON.stringify({ door: up.front, began: up.began, waited: m0 && m1 ? m1.door - m0.door : null, planned: m1 && m1.planned, waiting: m1 && m1.waiting }) + ')',
      !!m0 && !!m1 && up.began && !up.front && m1.door === m0.door);
    ok('D4 ' + tag + ' nothing threw', !errs.length, errs.slice(0, 2).join(' | '));
  } catch (e) { ok(tag + ' ran', false, String(e.stack).slice(0, 300)); }
  finally { await d.close().catch(() => {}); }
}

(async () => {
  for (const prof of PROFS) await walk(prof, false);
  if (!ARGS.includes('--no-plant')) await walk('phone_portrait', true);
  console.log('\nHIS FINGER ON THE DOOR: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
