/* ============================================================================
   __THE_SONG_AFTER_THE_BATTLE__ (SOUNDS 10/25/26, row [the PC playtest: the sound's part], rule 164 item 23; rule 122)

   PAOLO ON HIS PC, 10/24: the song after a battle is 'so bad, so terrible'. The coordinator's line: it becomes one of
   his songs (rule 122: the only songs the game plays are REPO MAN THE MACHINE PARTY and his MUSIC tab's OVERWORLD NIGHT).

   MEASURED BEFORE, in the demo (tools/bohemia_sounds_pc_playtest_measure.js --fight, a road fight on AUTO, seeded):
   the fight played SATELLITE PRAYER (his), and the instant it ended the shell played STING 'win', a synth figure on
   the rack's 'glasshope' voice, root, fifth, octave, twelfth, 'rising, and it keeps rising' (8/19). That figure, and
   'loss' (the 'subboom', falling), are the only music after a battle that is not one of his songs; and on the way
   home the job's own figures pile on top of it (PAYSTING 'paid' on the coldpiano when the spoils pay out, QUESTSTING
   'done' on the bell when the job closes). Four synth phrases nobody wrote, over his song.

   NOW: the battle's end is one of HIS songs.
     - 'win' and 'loss' never play their synth figure (kept in STING.FIG, never deleted). Instead, at the top of the
       next bar, the transport takes ANOTHER of his songs (CITYMUS.pick: his set through the fence, never the one that
       played the fight, his verdict weights) from its own first bar, on the same beat grid (THE ONE BEAT); the city
       frame is told what plays, as CITYMUS.play does.
     - While he is still in the battle's aftermath (the fight's frame or the spoils screen up, and HOLD_MS after both
       are gone), the job's synth figures (paid, done, missed, taken) are held silent: his song is the moment.
     - Everywhere else nothing changes: the street keeps his song (SONGFENCE.keep), the fight's song is still picked
       by the fence, a fight starting still strikes its drum.
   ========================================================================== */
(function () {
  if (!window.STING || !window.SONGFENCE || typeof CITYMUS === 'undefined') return;
  var F = window.SONGFENCE, S = window.STING, sp = S.play;
  var A = window.AFTERSONG = { at: 0, n: 0, swaps: [], held: [], HOLD_MS: 12000, lastUp: 0, watch: null, from: null, to: null };
  function nameOf(fi) { try { var f = (fi < MFACTIONS.length) ? MFACTIONS[fi] : MLOOPS[fi - MFACTIONS.length]; return f ? f.n : null; } catch (e) { return null; } }
  /* the battle's aftermath: the fight's frame or the spoils screen still up, or HOLD_MS since both went */
  A.up = function () { return !!document.getElementById('fightFrame') || !!document.querySelector('iframe[src*="SPOILS"]'); };
  A.inAfter = function () {
    if (!A.at) return false;
    if (A.up()) { A.lastUp = Date.now(); return true; }
    return Date.now() - Math.max(A.at, A.lastUp) < A.HOLD_MS;
  };
  /* one of his songs, on the top of the next bar */
  A.play = function (which) {
    A.at = Date.now(); A.lastUp = A.at; A.n++;
    var c = null; try { c = CITYMUS.pick(); } catch (e) { c = null; }
    if (!c || !F.allowed(c.fi, c.slot)) return false;
    A.from = nameOf(MUS.cur); A.to = nameOf(c.fi);
    if (A.watch) clearInterval(A.watch);
    var since = Date.now();
    function swap(atBar) {
      clearInterval(A.watch); A.watch = null;
      MUS.cur = c.fi; MUS.curSlot = c.slot;
      if (MUS.playing && atBar) { MUS.step = 0; MUS.uiBar = 0; }   /* the bar's own first step, on the grid it already keeps */
      else if (MUS.playing) { MUS.step = 0; MUS.uiBar = 0; MUS.nextT = (window.__beatNext ? window.__beatNext(MUS.AC.currentTime + 0.06) : MUS.AC.currentTime + 0.06); }
      else { try { MUS.start(); } catch (e) {} }
      A.swaps.push({ t: Date.now(), which: which, from: A.from, to: A.to, onBar: !!atBar });
      var fr = document.getElementById('cityFrame');
      if (fr && fr.contentWindow) try { fr.contentWindow.postMessage({ bohemiaCityMusicState: { on: true, now: A.to } }, '*'); } catch (e) {}
    }
    if (!MUS.playing) { swap(false); return true; }
    A.watch = setInterval(function () {
      try {
        if (window.FIGHTMUS && FIGHTMUS.on) { clearInterval(A.watch); A.watch = null; return; }   /* another fight took it */
        if ((MUS.step % 16) === 0) return swap(true);
        if (Date.now() - since > 4500) swap(false);                                              /* never more than two bars late */
      } catch (e) { clearInterval(A.watch); A.watch = null; }
    }, 15);
    return true;
  };
  S.play = function (which) {
    if (which === 'win' || which === 'loss') { try { A.play(which); } catch (e) {} return false; }
    if (/^(paid|done|missed|taken)$/.test(String(which)) && A.inAfter()) { A.held.push({ t: Date.now(), which: which }); return false; }
    return sp.apply(S, arguments);
  };
})();
