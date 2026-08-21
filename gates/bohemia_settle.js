/* ============================================================================
   SETTLE — WAIT FOR THE PAGE, NOT FOR THE CLOCK (8/20/26, RUN lane, P0-SUITE)

   Law: laws/BOHEMIA_COORDINATOR_SWEEP_8_19_26.md, FIX 1.
     "120 files call waitForTimeout / time.sleep with a constant. Every one of
      them is a guess about how long something takes, and the guess is always
      tuned upward until it stops flaking, so it is always far longer than the
      real wait. REPLACE WITH CONDITIONS."

   MEASURED BEFORE WRITING THIS, across gates/*.js: 399 fixed sleeps worth 19.7
   minutes, and the shape of them is remarkably consistent --
       162 sit after a click or a tap        (597s)
        86 sit after a goto                  (270s)
        38 sit after an evaluate             ( 56s)
         6 sit after a reload                ( 18s)
       107 other                             (242s)
   and in nearly every case the NEXT line is an evaluate that reads whatever the
   sleep was waiting for. So the sleep is always the same sentence: "give the
   page long enough to finish reacting to what I just did."

   THAT SENTENCE HAS A CONDITION, and it does not need to know what the gate is
   checking: THE PAGE HAS STOPPED CHANGING. This polls for that and returns the
   moment it is true.

   THE CONTRACT, and every part of it is deliberately conservative:

     - THE UPPER BOUND IS THE ORIGINAL NUMBER. settle(p, 3000) can never wait
       longer than the waitForTimeout(3000) it replaced, so the worst case is
       exactly today's behaviour and no gate can get slower. Only the typical
       case improves.
     - IT NEVER RETURNS INSTANTLY. A floor (120ms, or the whole budget if that
       is smaller) covers the gap between "I clicked" and "the handler has begun
       to do anything", which is the one moment a naive quiescence check would
       mistake for finished.
     - STILLNESS IS MEASURED OVER A BEAT. The window is 600ms, which is not a
       taste choice: BEAT = 0.5s under the 120 BPM law, so a 600ms quiet window
       spans a full beat of this game's own cadence. Anything driven by the beat
       -- steps, animation, the mover -- cannot hide inside it.
     - IT COUNTS DOM MUTATIONS, NOT PAINT, AND THAT IS A TRAP -- READ THIS ONE.
       A MutationObserver is installed once per document and left running; it is
       a counter, so re-entry is free. But DRAWING TO A CANVAS MUTATES NO DOM AT
       ALL, so a page busy painting looks perfectly still to this. If the thing
       you are waiting for is PIXELS, the default rule will return early and your
       gate will measure an unpainted canvas.
       IT ALREADY DID, the same day this was written. navcluster_gate's literal
       22-second sleep became a default settle, the page went quiet long before
       the portrait was drawn, and "THE PORTRAIT IS REALLY DRAWN" reported 0 of
       4096 opaque pixels on a portrait that was in fact fully painted. Proved
       both ways: restore the literal sleep and the same claim passes 4096/4096.
       THE FIX IS `cond`, BELOW, NOT A LONGER CEILING. When the gate knows what
       it is waiting for -- and a gate that is about to assert something always
       does -- pass that as the condition and quiescence is never consulted.
     - AND IT IS SAFE WHEN IT CANNOT SEE. Cross-origin frames, a detached page, a
       navigation mid-poll: every failure path falls back to sleeping out the
       remaining budget, which is what the code did before. A helper that turns
       an error into an early return would be a gate that lies.

   WHAT IT DOES NOT DO: it does not touch a single assertion, and it does not
   know or care what any gate checks. Fixes 1 and 2 change WHEN and WHERE a gate
   runs, never WHAT it claims (sweep law, section 7).
   ========================================================================== */
'use strict';

const POLL = 60;          /* how often we look */
const QUIET = 600;        /* stillness required: > one 500ms beat */
const FLOOR = 120;        /* never return before the handler can have started */

const INSTALL = `(() => {
  if (window.__BOH_SETTLE) return window.__BOH_SETTLE.n;
  const s = { n: 0 };
  try {
    const mo = new MutationObserver(recs => { s.n += recs.length; });
    mo.observe(document, { subtree: true, childList: true,
                           attributes: true, characterData: true });
    s.mo = mo;
  } catch (e) {}
  window.__BOH_SETTLE = s;
  return s.n;
})()`;

/* the page a target belongs to: Page has .waitForTimeout, Frame has .page() */
function pageOf(t) {
  if (!t) return null;
  if (typeof t.waitForTimeout === 'function') return t;
  if (typeof t.page === 'function') { try { return t.page(); } catch (e) { } }
  return null;
}

async function tick(t) {
  /* returns [mutationCount, readyComplete] or null if the document cannot be read */
  try {
    return await t.evaluate(`[${INSTALL}, document.readyState === 'complete']`);
  } catch (e) { return null; }
}

/**
 * settle(target, maxMs, cond)
 *   target : a Playwright Page or Frame
 *   maxMs  : the constant this replaced -- a CEILING, never a target
 *   cond   : optional async () => truthy. When given, THAT is the real
 *            condition and quiescence is not consulted at all: this is the
 *            honest form and should be preferred wherever the gate knows what
 *            it is waiting for.
 */
async function settle(target, maxMs, cond) {
  const t0 = Date.now();
  const budget = Math.max(0, maxMs | 0);
  const pg = pageOf(target);
  const nap = async ms => {
    if (ms <= 0) return;
    if (pg) { try { await pg.waitForTimeout(ms); return; } catch (e) { } }
    await new Promise(r => setTimeout(r, ms));
  };
  const left = () => budget - (Date.now() - t0);

  /* the floor: the handler has to be allowed to start */
  await nap(Math.min(FLOOR, budget));

  if (typeof cond === 'function') {
    while (left() > 0) {
      let hit = false;
      try { hit = !!(await cond()); } catch (e) { hit = false; }
      if (hit) return Date.now() - t0;
      await nap(Math.min(POLL, left()));
    }
    return Date.now() - t0;
  }

  let last = null, lastChange = Date.now();
  while (left() > 0) {
    const r = await tick(target);
    if (r === null) { await nap(left()); return Date.now() - t0; }  /* cannot see: pay in full */
    const [n, ready] = r;
    if (last === null || n !== last) { last = n; lastChange = Date.now(); }
    else if (ready && Date.now() - lastChange >= Math.min(QUIET, budget / 2)) {
      return Date.now() - t0;
    }
    await nap(Math.min(POLL, left()));
  }
  return Date.now() - t0;
}

module.exports = { settle, POLL, QUIET, FLOOR };
