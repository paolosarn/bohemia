#!/usr/bin/env node
/* ============================================================================
   BOHEMIA VOICE AUDIBLE GATE (8/24/26, SOUND lane)
   A NEWBORN VOICE HAS TO MAKE A SOUND, AND ONLY RENDERING PROVES IT.

   THE MUSIC GATE CHECKS THAT A BODY EXISTS. That is a text search: it asks
   whether `kind==='yourvoice'` appears in synthV. It cannot tell the difference
   between a voice that sings and a voice that builds a node graph and never
   connects it, mis-schedules its envelope, or lands ten times too quiet.

   THIS REPO HAS SHIPPED THAT EXACT BUG. `ironlung` and `throatsong` were
   GRAVEYARDED voices whose names still resolved: synthV took the name, found
   nothing, and rendered a silent gain while every gate stayed green. The same
   shape bit the SFX side twice more (drumV kinds passed to synthV; `crystal`
   renders EXACTLY ZERO through synthV to this day). Reading cannot catch it.

   AND IT ALMOST SHIPPED AGAIN IN THE BATCH THAT CREATED THIS FILE. `fissionhymn`
   passed the music gate, had a real body, real oscillators, real envelopes --
   and measured PEAK 0.031 against a shipped lead's 0.165, because its partials
   arrive late and the master decay compounded with the per-partial decays. A
   lead nobody can hear under a mix. The gate was green. The number was not.

   WHAT IT ASSERTS, for every song currently badged NEW:
     1. its LEAD voice renders through the REAL synthV in an OfflineAudioContext
     2. loud enough to carry a melody, measured against a floor
     3. and it is not a flat DC block or a click: it has to still be sounding
        after the attack

   node gates/voice_audible_gate.js
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const ALPHA = 'file://' + path.join(ROOT, 'slices', 'BOHEMIA_ALPHA_0_9.html');

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) { }
  }
  return require('playwright');
}

/* A LEAD CARRIES THE TUNE, so the floor is set from the quietest lead already
   SHIPPING rather than from taste: emberharp peaks 0.165, glassrequiem 0.512.
   0.06 is comfortably under the real ones and far above the failure mode this
   gate exists for (0.031, and 0.000 for a name that resolves to nothing). */
const PEAK_FLOOR = 0.06;
const RMS_FLOOR = 0.0015;

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };

(async () => {
  const { chromium } = playwright();
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));
  let d = {};
  try {
    await page.goto(ALPHA, { waitUntil: 'load', timeout: 180000 });
    await page.waitForTimeout(1500);
    await page.click('#front').catch(() => { });
    await page.waitForTimeout(3000);
    d = await page.evaluate(async () => {
      const SV = window.synthV || (typeof synthV !== 'undefined' ? synthV : null);
      if (!SV) return { fatal: 'no synthV in the shipped alpha' };
      if (typeof MLOOPS === 'undefined' || typeof NEW_VIBES === 'undefined')
        return { fatal: 'MLOOPS / NEW_VIBES not reachable' };
      const out = {};
      for (const name of NEW_VIBES) {
        const song = MLOOPS.find(s => s && s.n === name);
        if (!song) { out[name] = { err: 'not in MLOOPS' }; continue; }
        const lead = song.inst && song.inst.l;
        if (!lead) { out[name] = { err: 'no lead declared' }; continue; }
        /* RENDER IT THE WAY THE SONG WOULD: the song's own root, the rack's own
           note maths, a normal note length. Anything else measures a sound the
           game never plays. */
        const AC = new OfflineAudioContext(1, 44100 * 8, 44100);
        const bus = AC.createGain(); bus.gain.value = 1; bus.connect(AC.destination);
        const hz = x => 440 * Math.pow(2, x / 12);
        try { SV(lead, AC, bus, hz, 0.5, (song.root || 45) - 55, 0.05, 0.5); }
        catch (e) { out[name] = { lead, err: String(e && e.message || e) }; continue; }
        let buf; try { buf = await AC.startRendering(); }
        catch (e) { out[name] = { lead, err: 'render: ' + String(e && e.message || e) }; continue; }
        const a = buf.getChannelData(0);
        let sq = 0, pk = 0;
        for (let i = 0; i < a.length; i++) { const v = a[i]; sq += v * v; const m = v < 0 ? -v : v; if (m > pk) pk = m; }
        /* IS IT STILL SOUNDING AFTER THE ATTACK? A click and a DC block can both
           clear a peak floor. Measure the back half of the first second. */
        let tail = 0;
        for (let i = 22050; i < 44100 && i < a.length; i++) tail = Math.max(tail, Math.abs(a[i]));
        out[name] = { lead, rms: +Math.sqrt(sq / a.length).toFixed(5),
                      peak: +pk.toFixed(4), tail: +tail.toFixed(4) };
      }
      return { out, parsed: Array.isArray(NEW_VIBES) };
    });
  } catch (e) { d = { fatal: String(e && e.message || e) }; }
  await browser.close();

  if (d.fatal) {
    console.log('  > FAIL ' + d.fatal);
    console.log('\n=== VOICE AUDIBLE: 0 passed, 1 failed ===');
    process.exit(1);
  }
  const rows = d.out || {};
  /* AN EMPTY NEW_VIBES IS A STATE, NOT A HOLE (8/27). This demanded at least one
     fresh song, which was right for the reason A20 is right -- a checker that
     silently sees nothing reads exactly like a checker that passed. But after
     Paolo swept a whole batch ("I didn't like any of the new shit that you
     made") the honest value of "what is badged NEW" is NOTHING, and a gate that
     fails on the truth teaches people to bury the truth.
     The defence is kept and moved: the thing that must never silently be zero is
     that NEW_VIBES was FOUND AND PARSED. If it was, an empty list is reported
     out loud and passes; if it was not, that still fails. */
  ok('NEW_VIBES was found and parsed, so an empty list below means "no fresh '
     + 'cook" and not "this gate lost the list"', d.parsed === true);
  if (!Object.keys(rows).length) {
    console.log('  --  NO FRESH COOK IS BADGED RIGHT NOW. Nothing to check, and '
      + 'that is the truth rather than a hole: the last batch was swept.');
  }
  for (const name of Object.keys(rows)) {
    const r = rows[name];
    if (r.err) { ok(name + ': its lead renders (' + (r.lead || '?') + ': ' + r.err + ')', false); continue; }
    ok('LEAD SINGS  ' + r.lead.padEnd(14) + ' peak ' + r.peak.toFixed(4)
       + '  (' + name + ')', r.peak >= PEAK_FLOOR && r.rms >= RMS_FLOOR);
    ok('  and it is still sounding after the attack, not a click or a DC block '
       + '(tail ' + r.tail.toFixed(4) + ')', r.tail > 0.002);
  }
  ok('the page threw nothing (' + (errs.slice(0, 2).join(' | ') || 'clean') + ')',
     errs.length === 0);

  console.log('\n=== VOICE AUDIBLE: ' + pass + ' passed, ' + fail + ' failed ===');
  if (!fail) console.log('  Every fresh lead makes a sound. Measured, not read.');
  process.exit(fail ? 1 : 0);
})();
