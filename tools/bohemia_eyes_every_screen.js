/* BOHEMIA -- A DRIVEN CRAWL, NOT A NAMED LIST
 * EYES AND EARS, lane 17, E23 [every screen] round two. 9/27/26.
 * School round one: records/BOHEMIA_EYES_E23_ROUND_1_SCHOOL_THREE_OF_SIX_CARDS_ARE_GONE_9_27_26.md
 *
 * THE ROW: "drive every reachable card (conversation, offer, nightfall, haggle, fight, feed) and
 * measure every tap target on each, one number a screen." Round one found three of those six
 * names ALREADY RETIRED from the surface they named: OFFER and HAGGLE return before they ever
 * reach cardShow (a deliberate rule-20 parking, not a bug), and NIGHTFALL was moved to the phone
 * by rule 19a and no longer opens a card at all. A checker built to that list would silently
 * measure two screens and claim six.
 *
 * SO THIS DOES NOT TAKE A LIST. It discovers states by PRESSING, the way MobiGUITAR and ACE do:
 * start at the street, press every real control, fingerprint whatever comes up, and only
 * recurse into a fingerprint it has never seen. Android's own Monkey tool is the warning shot
 * for the other failure: it presses blind to what state it is in and gets 10.3% activity
 * coverage. A named list is that same blindness pointed the other way -- pressing a name
 * without knowing whether the game's state still has it.
 *
 * REUSE-FIRST: the boot, the door, taps and card-closing are PLUMBER's one driver
 * (tools/bohemia_drive_the_demo.js). The only new machinery here is the crawl and the 44px
 * measurement, and the measurement reuses gates/thumb_gate.js's technique -- wrap
 * addEventListener BEFORE the page runs, because this game wires taps without onclick and
 * neither [onclick] nor CDP's getEventListeners sees them (thumb_gate proved that once already;
 * this does not re-prove it, it reuses the fix).
 *
 * RULE ZERO, four controls, because a crawler that cannot tell "no door" from "didn't look" is
 * worse than no crawler:
 *   C0  THE DOOR IS BEHIND US, the driver says so itself
 *   C1  A PLANTED TWO-LEVELS-DEEP CARD IS FOUND AND MEASURED (proves recursion actually recurses)
 *   C2  A PLANTED DEAD PATH (return before it ever shows) is reported UNREACHABLE, not measured
 *       and not silently dropped (proves the crawler can tell "nothing happened" from "found it")
 *   C3  A PLANTED SMALL BUTTON ON A DISCOVERED CARD IS CAUGHT (proves the 44px measurement
 *       actually reaches into a state the crawl found, not just the street)
 *
 * Usage:  node tools/bohemia_eyes_every_screen.js [--surface <path>] [--alpha] [--max-states N]
 */
const fs = require('fs');
const path = require('path');
const D = require('./bohemia_drive_the_demo.js');
const ROOT = path.resolve(__dirname, '..');
const arg = (n, d) => { const i = process.argv.indexOf(n); return i >= 0 ? process.argv[i + 1] : d; };
const CUT = arg('--surface', null);
const MAX_STATES = Number(arg('--max-states', 40));
const OUT = path.join(ROOT, 'records', 'BOHEMIA_EYES_EVERY_SCREEN_9_27_26.json');

/* ARMED BEFORE THE PAGE RUNS, in every document the driver opens (the shell and the city frame),
   because opts.arm runs there. Reused technique, not a copy of thumb_gate's file. */
const ARM = "window.__eyesTapNodes = new Set(); (function(){ const T=new Set(['click','pointerdown','pointerup','touchstart','touchend','mousedown']); const o=EventTarget.prototype.addEventListener; EventTarget.prototype.addEventListener=function(type,fn,opt){ try{ if(T.has(type)&&this instanceof Element) window.__eyesTapNodes.add(this);}catch(e){} return o.call(this,type,fn,opt); }; })();";

/* ONE PROBE, TWO JOBS: name what we can, for a human reading the record, AND catch what we
   cannot name, because the second re-run this round proved the first cut's mistake one layer
   down. FP_FN used to check four known container ids (setwrap, daycard, notecard, phonewrap)
   and NOTHING ELSE -- so a planted card with none of those ids never changed the fingerprint,
   and the crawl reported it "led nowhere" exactly like a real dead path, which is the one
   distinction this whole tool exists to draw. A checker that only recognises named containers
   is the same blindness as a checker that only recognises named cards -- the row's own school
   finding, one layer down in the tool meant to fix it. FIXED: the fingerprint now ALSO carries
   a signature of every currently-pressable thing (id, text, position, size), built from the
   exact same walk CANDIDATES uses, so ANY new control appearing -- named container or not --
   changes the fingerprint. Two states are the same only if BOTH the named part and the
   candidate-signature part agree. */
const STATE_FN = () => {
  const vis = (el) => { if (!el) return false; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.05; };
  const text = (el) => (el && el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
  const named = [];
  const setw = document.getElementById('setwrap');
  if (vis(setw)) named.push('SETTINGS:' + text(document.getElementById('setcard')).slice(0, 40));
  const docs = [document];
  for (const f of document.querySelectorAll('iframe')) { try { if (f.contentDocument) docs.push(f.contentDocument); } catch (e) {} }
  for (const doc of docs) {
    const dc = doc.getElementById && (doc.getElementById('daycardIn') || doc.getElementById('daycard'));
    if (vis(dc)) named.push('CARD:' + text(dc.querySelector('h2')) + '|' + text(dc));
    const note = doc.getElementById && doc.getElementById('notecard');
    if (vis(note)) named.push('NOTE:' + text(note));
    const pw = doc.getElementById && doc.getElementById('phonewrap');
    if (vis(pw)) named.push('PHONE:' + text(pw.querySelector('h2,h3')) + '|' + text(pw).slice(0, 30));
  }

  /* EVERY REAL CANDIDATE ON THE CURRENT STATE -- the proven "innermost pressable thing" walk
     from [song length] and this row's own round one, reused verbatim in shape: a wrapper whose
     visible label cannot itself be pressed is the candidate, not its unpressable child. Walked
     over both the shell and the city frame, PLUS the tap-node set thumb_gate's technique built,
     so a handler with no visible text and no onclick attribute still counts. */
  const cands = [];
  const walk = (doc, offX, offY) => {
    const cvis = (el) => { const r = el.getBoundingClientRect(); const cs = doc.defaultView.getComputedStyle(el);
      return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.05; };
    for (const e of doc.querySelectorAll('div,button,span,a,[role=button]')) {
      const r = e.getBoundingClientRect();
      if (r.width < 18 || r.height < 12) continue;
      if (!cvis(e)) continue;
      const cs = doc.defaultView.getComputedStyle(e);
      if (cs.pointerEvents === 'none') continue;
      const txt = (e.innerText || e.textContent || '').replace(/\s+/g, ' ').trim();
      const looksLikeText = !!txt && txt.length <= 30;
      const isTapNode = doc.defaultView.__eyesTapNodes && doc.defaultView.__eyesTapNodes.has(e);
      if (!looksLikeText && !isTapNode) continue;
      const inner = [...e.querySelectorAll('div,button,span,a,[role=button]')].some((k) => {
        const kr = k.getBoundingClientRect(); if (kr.width < 18 || kr.height < 12) return false;
        if (!cvis(k)) return false;
        const kc = doc.defaultView.getComputedStyle(k); if (kc.pointerEvents === 'none') return false;
        const kt = (k.innerText || k.textContent || '').trim();
        return (!!kt && kt.length <= 30) || (doc.defaultView.__eyesTapNodes && doc.defaultView.__eyesTapNodes.has(k));
      });
      if (inner) continue;
      cands.push({ x: Math.round(offX + r.x + r.width / 2), y: Math.round(offY + r.y + r.height / 2),
                  w: Math.round(r.width), h: Math.round(r.height), text: txt.slice(0, 30), id: e.id || '' });
    }
  };
  walk(document, 0, 0);
  for (const f of document.querySelectorAll('iframe')) {
    try { if (f.contentDocument) { const fr = f.getBoundingClientRect(); walk(f.contentDocument, fr.x, fr.y); } }
    catch (e) {}
  }
  const seen = new Set(), uniq = [];
  for (const c of cands) { const k = c.x + ',' + c.y + ',' + c.w + 'x' + c.h + '|' + c.text;
    if (!seen.has(k)) { seen.add(k); uniq.push(c); } }

  const sig = uniq.map(c => (c.id || '') + ':' + c.text + '@' + c.x + ',' + c.y + ':' + c.w + 'x' + c.h)
                  .sort().join(';');
  const fp = (named.length ? named.join('~') : 'STREET') + '||' + sig;
  return { fp, cands: uniq };
};

/* IS THIS CANDIDATE A PLANTED CHECK, not a real game control -- by its own id or its own text,
   never by asking the fingerprint (the planted buttons sit fixed in the shell for the whole
   crawl, so they show up in EVERY state's candidate signature; a real state pressed while they
   happen to be on screen is not itself a plant, and must not be scored as one). */
const isPlant = (c) => /^__eyes_/.test((c && c.id) || '') || /^EYES/.test(((c && c.text) || '').trim());

async function crawl(d, out, budgetMs) {
  const t0 = Date.now();
  const visited = new Map();  /* fingerprint -> {controls, small, path, tainted} */
  const plantDiag = new Map(); /* fingerprint -> RAW cands at the moment a plant press created it */
  const probe = () => d.pageEval(STATE_FN);
  const start = await probe();
  const startFp = start.fp;
  visited.set(startFp, null);
  const queue = [{ fp: startFp, depth: 0, path: ['STREET'], tainted: false }];
  const transitions = [];
  const unreachableAttempts = [];

  while (queue.length && (Date.now() - t0) < budgetMs && visited.size <= MAX_STATES) {
    const node = queue.shift();
    const here = await probe();
    if (node.fp !== startFp && node.depth > 0 && !visited.get(node.fp)) {
      /* we are AT this state already (got here by pressing); measure it once. The counted
         controls/small ALWAYS exclude the planted checks -- they sit fixed in the shell for the
         whole crawl, so without this a real state measured after C1's plant opens would count
         the plant's own card and small button as if they belonged to the real screen. */
      const clean = here.cands.filter((c) => !isPlant(c));
      const small = clean.filter((c) => c.w < 44 || c.h < 44);
      visited.set(node.fp, { controls: clean.length, small: small.map((s) => s.text + ' ' + s.w + 'x' + s.h),
                             path: node.path.join(' -> '), tainted: node.tainted });
    }
    for (const c of here.cands) {
      if ((Date.now() - t0) > budgetMs || visited.size > MAX_STATES) break;
      const before = (await probe()).fp;
      let threw = null;
      try { await d.tapAt(c.x, c.y); await new Promise((r) => setTimeout(r, 900)); }
      catch (e) { threw = String(e).slice(0, 100); }
      const afterProbe = await probe();
      const after = afterProbe.fp;
      if (after === before) {
        /* NOTHING CHANGED. This is where offer/haggle would land if pressed from the street:
           a real press, a real wait, and the state did not move. Recorded as an ATTEMPT, never
           silently dropped and never counted as a screen found. */
        unreachableAttempts.push({ from: node.path.join(' -> '), pressed: c.text || c.id, threw });
        continue;
      }
      if (!visited.has(after)) {
        visited.set(after, null);
        const causedByPlant = node.tainted || isPlant(c);
        if (causedByPlant) plantDiag.set(after, afterProbe.cands);  /* RAW, for C1/C3 only */
        transitions.push({ from: node.fp, via: c.text || c.id, to: after, plant: causedByPlant });
        queue.push({ fp: after, depth: node.depth + 1, path: node.path.concat([c.text || c.id || after]),
                    tainted: causedByPlant });
      }
      /* BACK OUT, so the next control at THIS state is tried from the same place, not from
         wherever the last press left us -- the DFS discipline the school round named. */
      if (after !== before) { try { await d.clearCards(); } catch (e) {} await new Promise((r) => setTimeout(r, 400));
        const back = (await probe()).fp;
        if (back !== before) { /* clearCards did not return us; note it and move on rather than loop */ }
      }
    }
  }
  return { visited, transitions, unreachableAttempts, plantDiag };
}

(async () => {
  const out = { what: 'a driven crawl of every reachable card, not a named list',
                row: 'E23 [every screen] round two', when: new Date().toISOString(),
                surface: CUT || 'the repo demo', controls: [] };
  const opts = { arm: ARM, ...(process.argv.includes('--alpha') ? { alpha: true }
                            : CUT ? { serve: { '/slices/BOHEMIA_DEMO.html': CUT } } : {}) };
  const d = await D.open(opts);
  try {
    out.controls.push({ name: 'C0 THE DOOR IS BEHIND US, and the driver says so itself',
                        pass: !!d.doorIsBehindUs(), detail: 'door held ' + d.doorMs() + ' ms' });

    /* PLANT THE THREE CASES BEFORE CRAWLING, in the SAME frame the game draws in, so the crawl
       meets them exactly as it would meet a real dead-parked screen or a real second-level card. */
    const planted = await d.pageEval(() => {
      const mk = (id, x, y, text) => {
        const b = document.createElement('div'); b.id = id; b.textContent = text;
        b.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:60px;height:44px;'
          + 'z-index:2147483647;background:#111;color:#fff;font-size:10px;display:flex;'
          + 'align-items:center;justify-content:center;cursor:pointer';
        document.body.appendChild(b); return b;
      };
      /* C1: pressing this opens a SECOND planted card, and pressing something on THAT card is
         the two-levels-deep case. */
      const lvl1 = mk('__eyes_lvl1', 4, 100, 'EYESLVL1');
      let open2 = false;
      lvl1.addEventListener('click', () => {
        if (open2) return; open2 = true;
        mk('__eyes_lvl2_card', 4, 150, 'EYESLVL2CARD');
        const small = mk('__eyes_lvl2_small', 70, 150, 'X'); small.style.width = '18px'; small.style.height = '14px';
        /* C3's planted small button lives ON this second-level card, at 18x14. */
      });
      /* C2: a dead-parked path, exactly offer's own shape -- returns before it ever draws
         anything, on purpose, so a press here must read "nothing happened", never a screen. */
      const dead = mk('__eyes_dead_parked', 4, 200, 'EYESDEADPARK');
      dead.addEventListener('click', () => { return; });
      return { ok: true };
    }).catch((e) => ({ ok: false, why: String(e).slice(0, 200) }));
    out.planting = planted;

    const { visited, transitions, unreachableAttempts, plantDiag } = await crawl(d, out, 90000);
    out.states_found = visited.size;
    out.transitions = transitions;
    out.unreachable_attempts = unreachableAttempts;
    out.states = [...visited.entries()].map(([fp, v]) => ({ fingerprint: fp.slice(0, 80), ...v }));

    /* C1/C3 read the RAW diagnostic snapshot taken the moment a plant press created a new
       state, never the state's own (now plant-filtered) counted controls -- those two numbers
       serve different jobs on purpose. C2 reads the TRANSITIONS list, never "does any visited
       fingerprint contain the word EYESDEADPARK": the planted buttons sit fixed in the shell for
       the whole crawl, so that substring is present in EVERY state's signature once they exist,
       including the real ones, and would have failed C2 by matching things it was never asking
       about. */
    const lvl2Fp = [...plantDiag.keys()].find((k) => k.includes('EYESLVL2CARD'));
    const lvl2Raw = lvl2Fp ? plantDiag.get(lvl2Fp) : null;
    out.controls.push({ name: 'C1 A PLANTED TWO-LEVELS-DEEP CARD IS FOUND AND MEASURED',
                        pass: !!lvl2Raw, detail: lvl2Raw ? (lvl2Raw.length + ' controls on it') : 'never reached' });
    const deadAttempt = unreachableAttempts.find((a) => /EYESDEADPARK/.test(a.pressed));
    const deadTransition = transitions.some((t) => /EYESDEADPARK/.test(t.via));
    out.controls.push({ name: 'C2 A PLANTED DEAD PATH IS REPORTED UNREACHABLE, never measured as a screen',
                        pass: !!deadAttempt && !deadTransition,
                        detail: deadAttempt ? 'recorded as an attempt with no new state' : 'was not even pressed' });
    const lvl2SmallHit = lvl2Raw && lvl2Raw.some((c) => c.id === '__eyes_lvl2_small' || /^X$/.test((c.text || '').trim()));
    out.controls.push({ name: 'C3 A PLANTED SMALL BUTTON ON A DISCOVERED CARD IS CAUGHT',
                        pass: !!lvl2SmallHit,
                        detail: lvl2Raw ? JSON.stringify(lvl2Raw.filter((c) => c.w < 44 || c.h < 44)) : 'card never reached' });

    await d.pageEval(() => { for (const e of document.querySelectorAll('[id^="__eyes_"]')) e.remove(); }).catch(() => null);

    /* THE REAL NUMBERS: every visited state whose own path was never caused by a plant press.
       Each real state's controls/small were already counted plant-free at measurement time
       (above), so a real screen measured after C1's plant opened its card is not inflated by
       the plant's own permanent floating buttons. */
    const realEntries = [...visited.entries()].filter(([, v]) => !v || !v.tainted);
    const realStates = realEntries.map(([fp, v]) => ({ fingerprint: fp.slice(0, 80), ...v }));
    const measuredReal = realStates.filter((s) => s.controls != null);
    const realSmall = measuredReal.flatMap((s) => (s.small || []).map((x) => s.fingerprint.split('||')[0] + ': ' + x));
    out.numbers = {
      states_discovered: realStates.length,
      states_measured: measuredReal.length,
      total_controls_measured: measuredReal.reduce((a, s) => a + (s.controls || 0), 0),
      controls_under_44px: realSmall.length,
      real_attempts_that_led_nowhere: unreachableAttempts.filter((a) => !isPlant({ id: '', text: a.pressed })).length,
    };
    out.small_controls_by_screen = realSmall.slice(0, 30);
    out.attempts_that_led_nowhere = unreachableAttempts.filter((a) => !isPlant({ id: '', text: a.pressed })).slice(0, 20);
  } catch (e) { out.ok = false; out.why = String(e).slice(0, 400); }
  try { await d.close(); } catch (e) {}
  const bad = out.controls.filter(c => !c.pass).map(c => c.name);
  out.failing_controls = bad;
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log('  controls: ' + (bad.length ? 'FAILED -> ' + bad.join(' | ') : 'all green'));
  if (bad.length) console.log('  THE NUMBERS BELOW MEAN NOTHING UNTIL THE CONTROLS PASS.');
  if (out.why) console.log('  why: ' + out.why);
  for (const [k, v] of Object.entries(out.numbers || {})) console.log('    ' + k.padEnd(32) + ' ' + JSON.stringify(v));
  for (const s of (out.small_controls_by_screen || [])) console.log('    SMALL: ' + s);
  for (const a of (out.attempts_that_led_nowhere || [])) console.log('    LED NOWHERE: from ' + a.from + ' pressed "' + a.pressed + '"');
  process.exit(0);
})();
