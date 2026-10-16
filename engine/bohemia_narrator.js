/* ============================================================================
   BOHEMIA -- THE NARRATOR (SOUNDS, 10/16/26, row [the narrator]).

   RULE 45 (Paolo, the second votes: nothing in the first second; the narrator's
   creepy machine voice reads the end screen) AND RULE 80b, THE COORDINATOR'S
   WIDENING (10/9, his words: "cooler if it was narrated if I wanted it"): not
   only the end screen, every player-facing text, behind ONE toggle, off by
   default, a tap stops it, it never plays over itself.

   A MACHINE, NEVER A PERSON (the row's own words): people in this game keep a
   portrait mouth with no voice (laws/BOHEMIA_LAW_EVERYBODY_HAS_A_FACE_8_27_26.md).
   This is not a second voice acting system -- it is the phone's own built-in
   speech engine (window.speechSynthesis, already in every browser, zero new
   content, zero licence to carry) read flat and even on purpose: a slowed rate,
   a lowered pitch, never the engine's own expressive defaults, because an
   expressive TTS voice reads as a person performing the line and this voice is
   the opposite of that.

   REUSE-FIRST, NO NEW ENGINE: this is the browser's own API, not a sound this
   lane synthesises, so there is nothing here for gates/cooked_sounds_gate.js to
   measure as a waveform -- the gate below is a BEHAVIOUR gate (never two
   utterances at once, a tap really stops it, off by default), which is what
   there is to check about a thing with no buffer.

   WHAT THIS FILE DOES NOT DO: the SETTINGS toggle itself (rule 80b: "UI builds
   the toggle in the settings card") -- this exposes setEnabled()/enabled() for
   that toggle to call, and defaults to OFF until it exists. It also does not
   duck the song yet (rule 80b's own full ask): that needs a cross-frame bridge
   to the alpha's MUS bus from every surface that narrates, which is a second
   round's work, named here rather than built thin.
   ========================================================================== */
(function (root) {
  'use strict';
  var KEY = 'bohemia_narrate_v1';
  var synth = (typeof window !== 'undefined' && window.speechSynthesis) ? window.speechSynthesis : null;
  var current = null;

  function enabled() {
    try { return (typeof localStorage !== 'undefined') && localStorage.getItem(KEY) === '1'; }
    catch (_e) { return false; }
  }
  function setEnabled(v) {
    try { if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, v ? '1' : '0'); }
    catch (_e) {}
  }
  function stop() {
    try { if (synth) synth.cancel(); } catch (_e) {}
    current = null;
  }
  /* THE EVEN, DEAD VOICE: a flat rate and a lowered pitch, read off the engine's
     own 0-2 ranges (1 is each API's own "normal" default); 0.95/0.75 is slower
     and flatter than default without dropping into a different-sounding
     caricature, the same restraint the analog horror law asks of every pixel
     and sound (laws/BOHEMIA_LAW_ANALOG_HORROR_FOR_EVERY_PIXEL_AND_EVERY_SOUND_9_20_26.md). */
  function speak(text, opts) {
    opts = opts || {};
    if (!synth || !text) return false;
    if (!opts.force && !enabled()) return false;
    stop();   /* NEVER PLAYS OVER ITSELF: whatever was mid-sentence is cancelled first */
    var u;
    try { u = new SpeechSynthesisUtterance(String(text)); } catch (_e) { return false; }
    u.rate = opts.rate == null ? 0.95 : opts.rate;
    u.pitch = opts.pitch == null ? 0.75 : opts.pitch;
    u.volume = opts.volume == null ? 1 : opts.volume;
    current = u;
    try { synth.speak(u); } catch (_e) { return false; }
    return true;
  }
  /* A TAP STOPS IT: scoped to the gesture, not the whole document's every click,
     so this never eats a tap meant for the screen underneath it -- it only ever
     cancels speech that is already running, and never calls preventDefault. */
  function wireTapToStop(el) {
    var target = el || (typeof document !== 'undefined' ? document : null);
    if (!target || !target.addEventListener) return;
    target.addEventListener('pointerdown', function () {
      try { if (synth && synth.speaking) stop(); } catch (_e) {}
    }, { capture: true, passive: true });
  }

  var API = {
    speak: speak, stop: stop, enabled: enabled, setEnabled: setEnabled,
    wireTapToStop: wireTapToStop,
    available: function () { return !!synth; },
    speaking: function () { try { return !!(synth && synth.speaking); } catch (_e) { return false; } }
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaNarrator = API;
})(typeof window !== 'undefined' ? window : this);
