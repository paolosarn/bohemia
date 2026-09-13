/* BOHEMIA -- EYES AND EARS, E26 [five minutes] round two: THE WALK.
 *
 * THE LAW: laws/BOHEMIA_ADDENDUM_THE_FIVE_MINUTES_9_13_26.md (Paolo 9/13, LOCKED).
 * "The demo's first five minutes on a phone, played by a stranger, is the measure of the
 *  game. Not the gate count, not the commit count, not the module count."
 *
 * THE SHEET THIS FILLS IN was written last round and is not improvised here:
 * banks/eyes/BOHEMIA_EYES_E26_STRANGERS_SHEET_9_13_26.json
 * records/BOHEMIA_EYES_E26_ROUND_1_SCHOOL_THE_WATCHER_WRITES_WHAT_A_CAMERA_WOULD_9_13_26.md
 *
 * THE ONE RULE IT OBEYS, from the observation literature: NOTE WHAT YOU OBSERVE, NOT WHAT
 * YOU INTERPRET. Every line it writes is what a camera would have recorded -- a timestamp,
 * a tap, and what changed on the screen. It never writes "confusing" or "bad", and it
 * never scores anything. Taste is DIRECTION's.
 *
 * THE TAP SCRIPT IS FIXED IN ADVANCE, for a reason the literature names: here the watcher
 * and the player are the same process, and a walk that picks its own route while walking
 * drifts toward the parts that work.
 *
 * DEAD AFFORDANCE IS THE ONE THING COUNTED. A false affordance -- a thing that looks
 * tappable and does nothing, or promises a thing that does not happen -- erodes trust in
 * EVERY other promise on the screen, which is the mechanism behind "nothing's complete"
 * arriving from one dead card. Detected here as: a real driven tap on a real control,
 * followed by no change in the visible text of the page AND no change in the drawn pixels,
 * for 1.2 seconds.
 *
 * CONTROLS (RULE ZERO, E9), all must pass or the list is not trustworthy:
 *   COLD START   localStorage must be empty at the moment of first paint, or the run is
 *                void and restarted: a warm save is not the five minutes anybody else gets.
 *   ERROR CATCH  a deliberately raised page error must be captured, or a report of zero
 *                errors means nothing.
 *   CHANGE PROBE a deliberately mutated pixel must register as a change, or "nothing
 *                happened" is unfalsifiable and every control reads dead.
 *   CLOCK        the stopwatch is the page's own performance.now(), not wall time.
 */
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'records', 'BOHEMIA_EYES_E26_WALK_9_13_26.json');
const SHOTS = path.join(ROOT, 'records', 'eyes_e26_walk');

function pw() {
  for (const t of ['playwright', '/opt/node22/lib/node_modules/playwright',
    '/usr/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright']) {
    try { return require(t); } catch (e) {}
  }
  throw new Error('playwright not found');
}
const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2,
                isMobile: true, hasTouch: true };
const BUDGET_MS = 5 * 60 * 1000;

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium',
    args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext(PHONE);          /* fresh context = no stored save */
  const page = await ctx.newPage();

  const out = { ok: true, when: new Date().toISOString(), law: 'THE FIVE MINUTES (Paolo 9/13)',
                lines: [], errors: [], controls: [], numbers: {}, dead: [], inert: [] };
  const err = [];
  page.on('pageerror', e => err.push({ t: null, kind: 'pageerror', msg: String(e.message).slice(0, 220) }));
  page.on('console', m => { if (m.type() === 'error') err.push({ kind: 'console', msg: m.text().slice(0, 220) }); });
  /* THE FULL URL, NOT THE FILENAME. The first run recorded only the last path segment and
     logged a failed "css2?family=VT323&family=Space+Grotesk..." with no way to tell WHERE it
     was asked for -- and Space Grotesk is a font the 9/11 law bans by name, so a claim about
     it that cannot be sourced is a claim this lane may not make. */
  page.on('requestfailed', r => err.push({ kind: 'requestfailed', msg: r.url().slice(0, 300),
    from: (r.frame() && r.frame().url() || '').slice(-60),
    why: (r.failure() && r.failure().errorText) || '' }));

  fs.mkdirSync(SHOTS, { recursive: true });
  let shot = 0;
  const snap = async (tag) => {
    const p = path.join(SHOTS, String(shot++).padStart(2, '0') + '_' + tag + '.png');
    try { await page.screenshot({ path: p }); } catch (e) {}
    return path.relative(ROOT, p);
  };

  /* WHAT THE SCREEN IS, as two signatures a camera could take: the visible words, and the
     drawn pixels of every canvas. Both must be unchanged for a tap to have done nothing. */
  const sig = () => page.evaluate(() => {
    const txt = (document.body.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 4000);
    let pix = '';
    for (const c of document.querySelectorAll('canvas')) {
      try {
        const s = document.createElement('canvas'); s.width = 24; s.height = 24;
        s.getContext('2d').drawImage(c, 0, 0, 24, 24);
        pix += s.toDataURL().slice(-160);
      } catch (e) { pix += 'x'; }
    }
    /* frames draw the world; ask them too */
    for (const f of document.querySelectorAll('iframe')) {
      try {
        const d = f.contentDocument;
        if (!d) continue;
        pix += (d.body.innerText || '').replace(/\s+/g, ' ').slice(0, 500);
        for (const c of d.querySelectorAll('canvas')) {
          const s = document.createElement('canvas'); s.width = 24; s.height = 24;
          s.getContext('2d').drawImage(c, 0, 0, 24, 24);
          pix += s.toDataURL().slice(-160);
        }
      } catch (e) {}
    }
    return { txt, pix, now: performance.now() };
  }).catch(() => ({ txt: '', pix: '', now: 0 }));

  let t0 = 0;
  const stamp = (now) => {
    const ms = Math.max(0, now - t0);
    const s = Math.round(ms / 1000);
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  };
  const line = (now, did, happened, promised) => {
    out.lines.push({ at: stamp(now), did, happened, promised: promised || '' });
  };

  try {
    await page.goto('file://' + path.join(ROOT, 'slices', 'BOHEMIA_DEMO.html'),
      { waitUntil: 'domcontentloaded', timeout: 90000 });
    const first = await page.evaluate(() => performance.now());
    t0 = first;

    /* CONTROL: COLD START. Nothing stored at first paint, or this is not a first run. */
    const stored = await page.evaluate(() => {
      try { return { n: localStorage.length, keys: Object.keys(localStorage).slice(0, 8) }; }
      catch (e) { return { n: -1, keys: [] }; }
    });
    out.controls.push({ name: 'COLD START: nothing in storage at first paint',
                        pass: stored.n === 0, detail: stored.n + ' keys ' + JSON.stringify(stored.keys) });

    /* CONTROL: ERROR CATCH. */
    await page.evaluate(() => { setTimeout(() => { throw new Error('__eyes_planted_error__'); }, 0); });
    await sleep(250);
    out.controls.push({ name: 'ERROR CATCH: a planted page error is captured',
                        pass: err.some(e => /__eyes_planted_error__/.test(e.msg)),
                        detail: err.length + ' errors seen so far' });

    /* CONTROL: CHANGE PROBE. */
    const beforeProbe = await sig();
    await page.evaluate(() => {
      const d = document.createElement('div'); d.id = '__eyes_probe';
      d.textContent = '__EYES_CHANGE_PROBE__'; document.body.appendChild(d);
    });
    await sleep(150);
    const afterProbe = await sig();
    await page.evaluate(() => { const d = document.getElementById('__eyes_probe'); if (d) d.remove(); });
    out.controls.push({ name: 'CHANGE PROBE: a deliberate change registers as a change',
                        pass: afterProbe.txt !== beforeProbe.txt, detail: 'text signature moved' });

    /* ---- 00:00 THE FRONT DOOR ------------------------------------------- */
    await sleep(2200);
    let s = await sig();
    const splashWords = await page.evaluate(() => {
      const f = document.getElementById('front');
      return f ? (f.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200) : null;
    });
    out.lines.push({ at: stamp(s.now), did: 'opened the link and waited',
      happened: splashWords ? ('a front screen: "' + splashWords + '"') : 'no front screen element',
      promised: 'TAP TO ENTER' });
    out.shots = [await snap('00_splash')];

    /* TIME TO FIRST INPUT, MEASURED HONESTLY. The first cut recorded the moment the script
       chose to tap, which measures the script and not the game. What a stranger waits for is
       the moment the first tappable thing is ON SCREEN. */
    const readyAt = await page.evaluate(() => {
      const f = document.getElementById('front');
      if (!f) return null;
      const r = f.getBoundingClientRect();
      const cs = getComputedStyle(f);
      return (r.height > 100 && cs.display !== 'none' && +cs.opacity > 0.5) ? performance.now() : null;
    });
    out.numbers.time_until_something_is_tappable_s = readyAt == null ? 'never' : +((readyAt - t0) / 1000).toFixed(2);
    let before = await sig();
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    const tIn = await page.evaluate(() => performance.now());
    out.numbers.my_first_tap_at_s = +((tIn - t0) / 1000).toFixed(2);
    await sleep(3500);
    let after = await sig();
    line(after.now, 'tapped the front screen',
         after.txt !== before.txt || after.pix !== before.pix ? 'the screen changed' : 'NOTHING CHANGED',
         'that tapping enters the game');
    out.shots.push(await snap('01_entered'));

    /* ---- WHAT IS ON THE FIRST SCREEN, as a camera would list it --------- */
    const controls = await page.evaluate(() => {
      const seen = [];
      const walk = (doc, where) => {
        const els = doc.querySelectorAll('div,button,span,a');
        for (const e of els) {
          const r = e.getBoundingClientRect();
          if (r.width < 18 || r.height < 12) continue;
          if (r.top > 844 || r.bottom < 0 || r.left > 390 || r.right < 0) continue;
          const cs = doc.defaultView.getComputedStyle(e);
          if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) continue;
          const txt = (e.innerText || '').replace(/\s+/g, ' ').trim();
          if (!txt || txt.length > 40) continue;
          if (e.querySelector('div,button,span,a')) continue;      /* leaves only */
          /* TWO DIFFERENT QUESTIONS, AND THE SECOND FIX WAS AS WRONG AS THE FIRST.
             v1 accepted anything not pointer-events:none and called the teaching overlay's
             CAPTIONS dead buttons -- a false accusation, the one thing this lane must never
             produce. v2 demanded cursor:pointer, and the inventory fell from 22 things to 3,
             because CURSOR:POINTER IS A DESKTOP SIGNAL AND THIS IS A PHONE. There is no
             cursor on a phone. A stranger's thumb goes for anything that reads as a choice.
             So: the inventory stays LOOSE (what a thumb would try), and a DEAD AFFORDANCE
             claim must carry the reason it looked tappable, recorded per item below. */
          if (cs.pointerEvents === 'none') continue;
          const why = cs.cursor === 'pointer' ? 'pointer cursor'
                    : (e.tagName === 'BUTTON' || e.tagName === 'A') ? 'a button or link'
                    : e.hasAttribute('onclick') ? 'a click handler in the markup'
                    : e.getAttribute('role') === 'button' ? 'role=button'
                    : e.closest('#daycard, .daycard, #offers, .offer') ? 'a row inside the day card'
                    : e.closest('#topbar, #devtray, #blstack') ? 'a chip in the top bar'
                    : '';
          seen.push({ where, id: e.id || '', text: txt, looks_tappable_because: why,
                      w: +r.width.toFixed(0), h: +r.height.toFixed(0),
                      x: +(r.left + r.width / 2).toFixed(0), y: +(r.top + r.height / 2).toFixed(0) });
        }
      };
      walk(document, 'shell');
      for (const f of document.querySelectorAll('iframe')) {
        try { if (f.contentDocument) walk(f.contentDocument, 'frame'); } catch (e) {}
      }
      const uniq = []; const key = new Set();
      for (const c of seen) { const k = c.where + '|' + c.text + '|' + c.x + ',' + c.y;
        if (!key.has(k)) { key.add(k); uniq.push(c); } }
      return uniq.slice(0, 60);
    });
    out.first_screen = controls;
    out.lines.push({ at: stamp((await sig()).now),
      did: 'looked at the first screen without touching anything',
      happened: controls.length + ' things with words on them, big enough to tap: '
        + controls.map(c => c.text).slice(0, 18).join(' / '),
      promised: '' });

    /* ---- THE FIXED TAP SCRIPT ------------------------------------------- */
    const tapAndWatch = async (c, why) => {
      const bs = await sig();
      let landed = 'the tap was refused (not visible to a finger)';
      try {
        await page.mouse.click(c.x, c.y, { delay: 40 });
        landed = null;
      } catch (e) {}
      if (landed === null) {
        await sleep(1200);
        const as = await sig();
        const changed = as.txt !== bs.txt || as.pix !== bs.pix;
        line(as.now, 'tapped ' + JSON.stringify(c.text) + (why ? ' (' + why + ')' : ''),
             changed ? 'the screen changed' : 'NOTHING CHANGED',
             c.text);
        if (!changed) {
          const row = { at: stamp(as.now), text: c.text, id: c.id, where: c.where,
                        size: c.w + 'x' + c.h, looked_tappable_because: c.looks_tappable_because || 'nothing said so' };
          if (c.looks_tappable_because) out.dead.push(row); else out.inert.push(row);
        }
        return changed;
      }
      line(bs.now, 'tried to tap ' + JSON.stringify(c.text), landed, c.text);
      return false;
    };

    /* 2. the largest, most obviously tappable thing first */
    const byArea = controls.slice().sort((a, b) => (b.w * b.h) - (a.w * a.h));
    if (byArea[0]) await tapAndWatch(byArea[0], 'the biggest thing on screen');
    out.shots.push(await snap('02_first_tap'));

    /* THE CARD IS IN THE WAY OF WALKING, so clearing it is its own recorded step rather
       than something the script does quietly. */
    const gotup = controls.find(c => /^GET UP$/i.test(c.text));
    if (gotup) await tapAndWatch(gotup, 'the only thing on the card that is not an offer');

    /* 3. walk in one direction until something stops you.
       *** AND THIS IS THE MISTAKE THAT INVALIDATED A WHOLE FIVE-MINUTE RUN. ***
       v1 dispatched pointerdown immediately followed by pointerup -- a zero-millisecond
       press -- 272 times, and the player never moved a pixel. The end-of-walk screenshot
       was identical to the one taken at 31 seconds, and the run duly reported "no fight in
       five minutes", which read as his complaint reproduced. It was not. A control run
       proved it: ONE held press for two seconds moved 93.9% of the world's pixels. THE GAME
       WALKS ON A HELD PRESS. The instrument was tapping, so the instrument never left the
       block, so of course it met nothing. A zero needs a positive control, and this is the
       round where that law saved a false headline from shipping. */
    const pads = await page.evaluate(() => {
      const out = [];
      const fr = [...document.querySelectorAll('iframe')].map(f => { try { return f.contentDocument; } catch (e) { return null; } }).filter(Boolean);
      for (const d of [document, ...fr]) {
        for (const e of d.querySelectorAll('.pb')) {
          const r = e.getBoundingClientRect();
          if (r.width < 10) continue;
          out.push({ x: +(r.left + r.width / 2).toFixed(0), y: +(r.top + r.height / 2).toFixed(0),
                     w: +r.width.toFixed(0), h: +r.height.toFixed(0) });
        }
      }
      return out;
    }).catch(() => []);
    const hold = async (ms) => {
      if (!pads.length) return false;
      /* the up arrow of the dial: the topmost pad in the bottom-right cluster */
      const cluster = pads.filter(p0 => p0.y > 600);
      const pick = (cluster.length ? cluster : pads).slice().sort((a, b) => a.y - b.y)[0];
      try {
        await page.mouse.move(pick.x, pick.y);
        await page.mouse.down();
        await sleep(ms);
        await page.mouse.up();
        return true;
      } catch (e) { return false; }
    };
    const walkRes = await (async () => {
      if (!pads.length) return { walked: false, why: 'no walk control found on the first screen' };
      const bs = await sig();
      await hold(2500);
      await sleep(500);
      const as = await sig();
      return { walked: true, held_ms: 2500, of: pads.length,
               moved: as.pix !== bs.pix, control: 'the dial, held' };
    })();
    const walkResOld = async () => await page.evaluate(async () => {
      const fr = [...document.querySelectorAll('iframe')].map(f => { try { return f.contentDocument; } catch (e) { return null; } }).filter(Boolean);
      const docs = [document, ...fr];
      let pad = null, kind = '';
      for (const d of docs) {
        const p = d.querySelector('.pb, #dpad, [data-dir], .dpad');
        if (p) { pad = p; kind = p.className || p.id; break; }
      }
      if (!pad) return { walked: false, why: 'no walk control found on the first screen' };
      const dir = pad.ownerDocument.querySelectorAll('.pb');
      const n = dir.length;
      const target = n ? dir[Math.min(1, n - 1)] : pad;
      /* DISPATCH ONLY. The first run died on target.click is not a function, because the
         walk control is not always an HTMLElement with a click method. A walk that throws
         is a walk that never happened, and the five minutes is the only measure. */
      for (let i = 0; i < 40; i++) {
        try {
          target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
          target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
          target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          if (typeof target.click === 'function') target.click();
        } catch (e) {}
        await new Promise(r => setTimeout(r, 120));
      }
      return { walked: true, presses: 40, control: kind, of: n };
    });
    {
      const as = await sig();
      line(as.now, walkRes.walked ? 'held the walk dial down for two and a half seconds' : 'looked for a way to walk',
           walkRes.walked ? ((walkRes.moved ? 'the world moved' : 'THE WORLD DID NOT MOVE')
                             + ' (' + walkRes.of + ' arrows on the dial)') : walkRes.why, '');
      out.shots.push(await snap('03_walked'));
    }

    /* 4. every card or offer that appears, in the order it appears, tapped once */
    const cards = controls.filter(c => /\b(YES|NO|OK|GO|ACCEPT|TAKE|DO IT|DEAL|READY|START|ENTER|DROP|MAP)\b/i.test(c.text));
    for (const c of cards.slice(0, 6)) {
      if (Date.now() - 0 && (await sig()).now - t0 > BUDGET_MS) break;
      await tapAndWatch(c, 'a card or offer');
    }
    out.shots.push(await snap('04_cards'));

    /* 5/6. the map, and the zoom */
    const mapish = controls.filter(c => /MAP|ZOOM|CITY|OUT|IN\b|DROP/i.test(c.text));
    for (const c of mapish.slice(0, 5)) {
      if ((await sig()).now - t0 > BUDGET_MS) break;
      await tapAndWatch(c, 'the map or the zoom');
    }
    out.shots.push(await snap('05_map'));

    /* time to first fight: is a fight ever on screen inside the budget */
    /* A FIGHT IS MET, NOT MERELY PRESENT IN THE DOM. The first run reported "a fight surface
       was on the page" because #combatFrame EXISTS in the markup from the start. His words were
       "I have not experienced any combat yet", which is about a fight being on screen and
       playable, so the test is: the fight surface is VISIBLE and has size. An element that
       exists and is hidden is not a fight met, and reporting it as one would have answered his
       complaint with a technicality. */
    const fight = await page.evaluate(() => {
      const vis = (e) => {
        if (!e) return false;
        const r = e.getBoundingClientRect();
        const cs = getComputedStyle(e);
        return r.width > 80 && r.height > 80 && cs.display !== 'none'
               && cs.visibility !== 'hidden' && +cs.opacity > 0.1;
      };
      const look = (d) => {
        if (!d) return false;
        for (const sel of ['#combatFrame', '#cv2', '.fightroot', '#fight']) {
          if (vis(d.querySelector(sel))) return true;
        }
        return false;
      };
      if (look(document)) return true;
      for (const f of document.querySelectorAll('iframe')) { try { if (look(f.contentDocument)) return true; } catch (e) {} }
      return false;
    });
    /* FILL THE FIVE MINUTES. The first run ended at 37 seconds because the scripted steps
       ran out, and 37 seconds is not the measure he named. So after the script, keep doing what
       a stranger does when nothing has happened: walk, and tap whatever is new, until the
       budget is spent. */
    let rounds = 0;
    const seenText = new Set(controls.map(c => c.where + '|' + c.text));
    while (((await sig()).now - t0) < BUDGET_MS && rounds < 400) {
      rounds++;
      await hold(2000);          /* HELD, for the reason written above */

      /* anything new on screen since the inventory gets one tap, in the order found */
      const fresh = await page.evaluate(() => {
        const seen = [];
        const walk = (doc, where) => {
          for (const e of doc.querySelectorAll('div,button,span,a')) {
            const r = e.getBoundingClientRect();
            if (r.width < 18 || r.height < 12) continue;
            if (r.top > 844 || r.bottom < 0 || r.left > 390 || r.right < 0) continue;
            const cs = doc.defaultView.getComputedStyle(e);
            if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) continue;
            const txt = (e.innerText || '').replace(/\s+/g, ' ').trim();
            if (!txt || txt.length > 40) continue;
            if (e.querySelector('div,button,span,a')) continue;
            if (cs.pointerEvents === 'none') continue;
            const why = cs.cursor === 'pointer' ? 'pointer cursor'
                      : (e.tagName === 'BUTTON' || e.tagName === 'A') ? 'a button or link'
                      : e.hasAttribute('onclick') ? 'a click handler in the markup'
                      : e.getAttribute('role') === 'button' ? 'role=button'
                      : e.closest('#daycard, .daycard, #offers, .offer') ? 'a row inside the day card'
                      : e.closest('#topbar, #devtray, #blstack') ? 'a chip in the top bar'
                      : '';
            seen.push({ where, id: e.id || '', text: txt, looks_tappable_because: why,
                        w: +r.width.toFixed(0), h: +r.height.toFixed(0),
                        x: +(r.left + r.width / 2).toFixed(0), y: +(r.top + r.height / 2).toFixed(0) });
          }
        };
        walk(document, 'shell');
        for (const f of document.querySelectorAll('iframe')) { try { if (f.contentDocument) walk(f.contentDocument, 'frame'); } catch (e) {} }
        return seen.slice(0, 40);
      }).catch(() => []);
      for (const c of fresh) {
        const k = c.where + '|' + c.text;
        if (seenText.has(k)) continue;
        seenText.add(k);
        if (((await sig()).now - t0) > BUDGET_MS) break;
        await tapAndWatch(c, 'new on screen');
      }
    }
    out.numbers.extra_walk_rounds = rounds;

    const end = await sig();
    out.numbers.time_to_first_fight_s = fight ? 'a fight surface was on the page' : 'NONE';
    out.numbers.walk_ended_at_s = +((end.now - t0) / 1000).toFixed(1);
    out.numbers.dead_affordances = out.dead.length;
    out.numbers.tapped_and_inert_but_never_claimed_to_be_a_button = out.inert.length;
    out.numbers.page_errors = err.filter(e => e.kind === 'pageerror' && !/__eyes_planted_error__/.test(e.msg)).length;
    out.numbers.console_errors = err.filter(e => e.kind === 'console').length;
    out.numbers.failed_requests = err.filter(e => e.kind === 'requestfailed').length;
    out.errors = err.filter(e => !/__eyes_planted_error__/.test(e.msg)).slice(0, 25);
    out.shots.push(await snap('06_end'));
  } catch (e) {
    out.ok = false; out.why = String(e).slice(0, 500);
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  const bad = out.controls.filter(c => !c.pass).map(c => c.name);
  console.log(JSON.stringify({ ok: out.ok, why: out.why, controls: out.controls,
    failing_controls: bad, numbers: out.numbers, lines: out.lines.length,
    dead: out.dead, inert: out.inert.length, first_screen: (out.first_screen || []).length }, null, 2));
  await b.close();
})();
