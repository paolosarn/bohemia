/* ==========================================================================
   THE LOADING SCREEN  --  UI lane 11, 9/22, row [cook panels] item 1.

   *** PAOLO 9/21, verbatim: "there's no loading screen yet, bro I wanna cool
   loading screen. It's looking like shit there's no loading screen just a bunch
   of glitchy shit loading in loading out loading in between before I'm able to
   even touch anything so that should be covered with a loading screen, bro,
   maybe even a loading bar if you're smart enough for." ***
   records/BOHEMIA_PAOLO_I_WANT_A_COOL_LOADING_SCREEN_9_21_26.md

   THIS FILE IS THE SKIN AND NOTHING ELSE. RUN owns the door (#front in the
   alpha) and RUN [loading screen] wires the real numbers into it. ONE SYSTEM,
   ONE SESSION: this lane does not reach into RUN's splash. It hands over a
   drop-in object with four calls and no opinions about when the game is ready.

     BohemiaLoading.mount(el)                  build it inside el
     BohemiaLoading.expect(['world','art'])    name the sources, up front
     BohemiaLoading.report('world', 8, 14)     REAL progress from a real source
     BohemiaLoading.ready()                    everything is in; BEGIN lights
     BohemiaLoading.onBegin(fn)                one tap, and the first sound

   *** THE BAR CANNOT LIE, AND THAT IS THE WHOLE POINT OF RULING 3. ***
   "A bar that reads REAL progress, never a fake timer; it reaches the end
   exactly when the pad works. A bar that lies is rule 14(d) in a new coat."
   So: there is NO TIMER IN THIS FILE THAT MOVES THE BAR. The fraction is
   sum(done) over sum(total) across the sources somebody really reported, and
   nothing else can move it. With no sources reported the bar sits at zero and
   the screen says it is waiting, which is the truth. ready() REFUSES while a
   source it was told to expect has not finished, and says which one, because a
   screen that lets go early is the "loading in between" he is complaining about.
   The only thing time drives is the cursor blink and the tape band, which are
   ornament and touch neither the fill nor the number.

   THE LOOK (rule 20, the bible 14e03eb6, and rule 22's 3-D direction):
   - It is a dead institution's terminal, not a spinner. Rule 5, the dead
     institution's type: the case is stencilled and the glass is a character
     cell screen, both procedural and too calm, no decorative type anywhere.
   - THE ONE WRONG THING (rule 1), and it is nameable in one sentence: in a boot
     log full of feeders, meters and chunks, one line counts PEOPLE, and the
     number beside it is zero. Nothing points at it. It scrolls past in the same
     register as everything else. That is the whole horror and there is only one.
   - Rule 8, diegetic or dead: the tape drop-out band lives INSIDE the glass,
     which is an in-world screen, and nothing draws over the frame.
   - Rule 4, the light was in the room: the only lit thing is the glass, and the
     case around it is lit by that glass and by nothing else.
   - 3-D is the four parts of an object from slices/bohemia_ui_3d.css, read
     through the same custom properties so act two swaps them ([skin swap]).
   ========================================================================== */
(function (root) {
  'use strict';

  var SRC = {};          /* name -> {done, total} : the only thing that moves the bar */
  var EXPECT = [];       /* names somebody promised to report */
  var mounted = null, begun = false, beginFns = [], readyNow = false;

  /* ---------- the fraction, and it is arithmetic on reported numbers only ---- */
  function fraction() {
    var done = 0, total = 0, k;
    for (k in SRC) if (SRC.hasOwnProperty(k)) { done += SRC[k].done; total += SRC[k].total; }
    if (total <= 0) return 0;
    return Math.max(0, Math.min(1, done / total));
  }
  function missing() {
    var out = [], i, s;
    for (i = 0; i < EXPECT.length; i++) {
      s = SRC[EXPECT[i]];
      if (!s || s.done < s.total) out.push(EXPECT[i]);
    }
    return out;
  }

  /* ---------- the case and the glass ---------------------------------------- */
  function css() {
    if (document.getElementById('blscss')) return;
    /* the 3-D vocabulary, if the page has not already got it. It is the same one
       file every panel in this lane reads, so act two changes values and this
       screen changes with everything else. */
    if (!document.querySelector('link[href$="bohemia_ui_3d.css"]')) {
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = 'bohemia_ui_3d.css';
      document.head.appendChild(l);
    }
    var s = document.createElement('style'); s.id = 'blscss';
    s.textContent =
      '#bls{position:absolute;inset:0;display:flex;flex-direction:column;'
        + 'align-items:center;justify-content:center;gap:0;padding:18px;'
        /* rule 4: no mood gradient. the room is one value and the glass lights it. */
        + 'background:#0a0907;overflow:hidden;-webkit-tap-highlight-color:transparent}'
      + '#blsunit{width:100%;max-width:348px;position:relative;padding:13px 13px 15px;'
        + 'background:linear-gradient(180deg,#2c261d 0 6%,#221d16 6% 74%,#191510 74% 100%);'
        + 'border-radius:2px;'
        + 'box-shadow:inset 0 1px 0 #5c4f38,inset 1px 0 0 #463c2a,'
        + 'inset 0 -2px 0 #0b0906,inset -1px 0 0 #0b0906,'
        + '0 2px 0 rgba(0,0,0,.62),0 6px 14px rgba(0,0,0,.6)}'
      /* the stencilled plate the name is cut into: dark letters, lit lower lip */
      + '#blstag{text-align:center;padding:2px 0 10px}'
      + '#blstag b{display:block;font-family:var(--face-casing,ui-sans-serif);'
        + 'font-size:17px;letter-spacing:6px;color:#0d0b08;'
        + 'text-shadow:0 1px 0 rgba(226,210,160,.28),0 -1px 0 rgba(0,0,0,.7)}'
      + '#blstag i{display:block;margin-top:5px;font-style:normal;'
        + 'font-family:var(--face-casing,ui-sans-serif);font-size:6px;letter-spacing:2px;color:#6b5d42}'
      /* the glass: sunk into the case, lit from behind, corners dark like a tube */
      + '#blsglass{position:relative;overflow:hidden;height:250px;padding:10px 11px;'+ 'display:flex;flex-direction:column;justify-content:flex-end;'
        + 'border-radius:3px;color:#c9dcc4;'
        + 'font-family:var(--face-screen,ui-monospace,monospace);font-size:9px;line-height:1.75;'
        + 'letter-spacing:.6px;'
        + 'background:radial-gradient(160% 130% at 50% 44%,#14120d 0 54%,#12100b 54% 74%,'
        + '#0f0d09 74% 88%,#0c0b07 88% 100%);'
        + 'box-shadow:inset 0 2px 0 #060503,inset 1px 0 0 #060503,inset -1px 0 0 #100e0a,'
        + 'inset 0 -1px 0 #201a12,inset 0 0 12px rgba(150,200,150,.10)}'
      + '#blsglass::before{content:"";position:absolute;inset:0;pointer-events:none;'
        + 'background:radial-gradient(150% 140% at 50% 50%,rgba(0,0,0,0) 0 64%,'
        + 'rgba(0,0,0,.20) 64% 78%,rgba(0,0,0,.42) 78% 90%,rgba(0,0,0,.70) 90% 100%)}'
      /* rule 8: the drop-out is INSIDE the in-world screen, never over the frame */
      + '#blsband{position:absolute;left:0;right:0;height:13px;pointer-events:none;'
        + 'background:linear-gradient(180deg,rgba(200,220,200,0) 0 40%,'
        + 'rgba(200,220,200,.05) 40% 60%,rgba(200,220,200,0) 60% 100%);'
        + 'animation:blsroll 7.5s linear infinite}'
      + '@keyframes blsroll{from{top:-26px}to{top:250px}}'
      + '#blslog{margin:0;white-space:pre-wrap}'
      + '#blslog .w{color:#8fa889}'
      + '#blscur{display:inline-block;width:5px;background:#c9dcc4;'
        + 'animation:blsblink 1.06s steps(1,end) infinite}'
      + '@keyframes blsblink{0%,49%{opacity:1}50%,100%{opacity:0}}'
      /* the bar: a well cut into the case with a lit strip lying in it */
      + '#blsbarrow{display:flex;align-items:center;gap:8px;margin-top:11px}'
      + '#blswell{flex:1 1 auto;height:13px;border-radius:2px;padding:2px;'
        + 'background:#0b0a07;box-shadow:inset 0 2px 0 #050403,inset 0 -1px 0 #2e2719}'
      + '#blsfill{height:9px;width:0%;border-radius:1px;'
        /* stepped, not blended: the object is built 3-D and delivered as pixels */
        + 'background:linear-gradient(180deg,#b6d6a8 0 30%,#77a468 30% 72%,#4c6f42 72% 100%);'
        + 'box-shadow:0 0 6px rgba(150,200,150,.35);transition:width .18s linear}'
      + '#blspct{font-family:var(--face-screen,ui-monospace,monospace);font-size:9px;'
        + 'letter-spacing:1.4px;color:#c9dcc4;min-width:34px;text-align:right}'
      + '#blsvent{height:13px;margin-top:10px;border-radius:1px;'
        + 'background:repeating-linear-gradient(180deg,#070603 0 3px,#4a4133 3px 4px,#1d1912 4px 5px);'
        + 'box-shadow:inset 0 1px 0 #0b0906,inset 0 -1px 0 #463c2a}'
      /* BEGIN: a key with travel, dead until the game really is in */
      + '#blsgo{display:flex;justify-content:center;margin-top:13px}'
      + '#blsgo button{min-height:48px;min-width:132px;padding:0 18px;border:0;cursor:pointer;'
        + 'border-radius:2px;font-family:var(--face-casing,ui-sans-serif);'
        + 'font-size:9px;letter-spacing:5px;'
        + 'color:#4b4336;background:linear-gradient(180deg,#1d1912 0 30%,#171309 30% 100%);'
        + 'box-shadow:inset 0 1px 0 #2e2719,inset 0 -2px 0 #0b0906,0 1px 0 #060503}'
      + '#blsgo button.on{color:#15120d;'
        + 'background:linear-gradient(180deg,#d6c396 0 26%,#c8b681 26% 62%,#a89769 62% 84%,#87764d 84% 100%);'
        + 'box-shadow:inset 0 1px 0 #efe1bb,inset 0 -2px 0 #6f6142,0 3px 0 #2a2417,0 5px 5px rgba(0,0,0,.5)}'
      + '#blsgo button.on:active{transform:translateY(3px);'
        + 'box-shadow:inset 0 2px 0 #6f6142,0 0 0 #2a2417,0 1px 2px rgba(0,0,0,.6)}'
      + '#blsfoot{margin-top:9px;text-align:center;font-family:var(--face-casing,ui-sans-serif);'
        + 'font-size:6px;letter-spacing:2px;color:#4e452f}';
    document.head.appendChild(s);
  }

  /* ---------- what the machine says it is doing ------------------------------
     *** THE WORDS ARE NOT MINE. *** WORDS Q28 wrote the seventeen lines for this
     screen and routed them here (records/BOHEMIA_WORDS_Q28_WHAT_THE_LOADING_SCREEN
     _SAYS_9_23_26.md). My first cut invented its own log, which is this lane
     writing player-facing prose it does not own. Theirs is better and it came with
     two conditions that are promises, not style notes:

       1. EACH STATE LINE IS WIRED TO THE STAGE IT NAMES. "A line that says it is
          counting while nothing is counting is the worst bug in the game by his own
          ruling. If a stage does not exist, its line does not ship." So a line here
          carries the NAME OF A SOURCE, and it appears only once that source has
          really reported. Nothing shows a line because time passed.
       2. THE COUNT IN THE SLOW LINE IS THE REAL COUNT. "THE 41 AND THE 68 ARE THE
          REAL FILE COUNT OR THEY DO NOT SHIP." It is printed from the same
          done/total this bar is made of, so the words and the bar cannot disagree.

     AND THE ONE WRONG THING (bible rule 1) IS NOW THEIRS TOO: NO OPERATOR ON DUTY.
     Ordinary institutional signage, simply true, set as a status line and not a
     warning -- which is exactly the register, and it is the only line on this screen
     that is about people rather than plant. My invented residents line is gone: it
     said the same thing a second time, and the same wrong thing twice is the frame
     nudging, which rule 2 forbids as hard as rule 1 forbids two of them.

     NOT BUILT AND SAID SO, back to WORDS and RUN: the second tone line (THIS SCREEN
     UPDATES ITSELF) would be a second tonal line on a screen that is allowed one, so
     it is not here; and the five Spanish lines are real under THEY SPEAK SPANGLISH
     but doubling every line makes the log twice as long, so where they sit is a
     surface decision I did not take alone. */
  var LINES = [
    ['boot',  'READING THE VALLEY', 0],
    ['world', 'COUNTING WHAT STILL STANDS', 0],
    ['light', 'CHECKING STREETS FOR LIGHT', 0],
    ['meter', "READING LAST NIGHT'S METERS", 0],
    ['block', 'FINDING YOUR BLOCK', 0],
    ['*',     'NO OPERATOR ON DUTY', 1]
  ];

  /* the totals behind the slow line, and they are the bar's own numbers */
  function counted() {
    var done = 0, total = 0, k;
    for (k in SRC) if (SRC.hasOwnProperty(k)) { done += SRC[k].done; total += SRC[k].total; }
    return { done: done, total: total };
  }

  function draw() {
    if (!mounted) return;
    var f = fraction(), pct = Math.round(f * 100);
    var fill = document.getElementById('blsfill');
    var num = document.getElementById('blspct');
    if (fill) fill.style.width = pct + '%';
    if (num) num.textContent = (pct < 100 ? (' ' + pct) : '100') + '%';

    /* A LINE APPEARS BECAUSE ITS STAGE REALLY REPORTED, never because time passed
       or because the bar reached some share. '*' is the standing line, which is true
       from the moment the machine is on. */
    var log = document.getElementById('blslog');
    if (log) {
      log.textContent = '';
      for (var i = 0; i < LINES.length; i++) {
        var key = LINES[i][0];
        if (key !== '*' && !SRC.hasOwnProperty(key)) continue;
        var d = document.createElement('div');
        if (LINES[i][2]) d.className = 'w';
        d.textContent = LINES[i][1];
        log.appendChild(d);
      }
      var c = counted();
      if (!readyNow && c.total > 0) {
        var slow = document.createElement('div');
        slow.textContent = 'STILL WORKING. ' + c.done + ' OF ' + c.total + '.';
        log.appendChild(slow);
      }
      if (readyNow) {
        var r = document.createElement('div');
        r.textContent = 'READY. TAP TO BEGIN.';
        log.appendChild(r);
      } else {
        var cur = document.createElement('span'); cur.id = 'blscur'; cur.textContent = '\u00a0';
        log.appendChild(cur);
      }
    }
    var go = document.getElementById('blsgo');
    if (go) {
      var b = go.firstChild;
      b.classList.toggle('on', readyNow);
      b.textContent = readyNow ? 'BEGIN' : 'WAIT';
      b.setAttribute('aria-disabled', readyNow ? 'false' : 'true');
    }
  }

  function mount(el) {
    css();
    el = el || document.body;
    var w = document.createElement('div'); w.id = 'bls';
    w.innerHTML =
      '<div id="blsunit">'
      + '<div id="blstag"><b>BOHEMIA</b><i>CLARK COUNTY POWER AUTHORITY</i></div>'
      + '<div id="blsglass"><div id="blsband"></div><div id="blslog"></div></div>'
      + '<div id="blsbarrow"><div id="blswell"><div id="blsfill"></div></div>'
      + '<span id="blspct">  0%</span></div>'
      + '<div id="blsvent"></div>'
      + '<div id="blsgo"><button type="button" aria-live="polite">WAIT</button></div>'
      + '<div id="blsfoot">UNIT 0.9 &middot; FEEDER 24</div>'
      + '</div>';
    el.appendChild(w);
    mounted = w;
    w.querySelector('#blsgo button').addEventListener('click', function () {
      if (!readyNow || begun) return;      /* a key that is not lit does nothing, and says so by being dark */
      begun = true;
      for (var i = 0; i < beginFns.length; i++) { try { beginFns[i](); } catch (e) {} }
    });
    draw();
    return w;
  }

  function expect(names) { EXPECT = (names || []).slice(); draw(); }

  function report(name, done, total) {
    if (!name) return;
    total = Math.max(0, +total || 0);
    done = Math.max(0, Math.min(total, +done || 0));
    SRC[name] = { done: done, total: total };
    draw();
  }

  /* ready() REFUSES while something it was told to expect has not finished, and
     names it. Letting go early is the "loading in between" he complained about,
     and a screen that lies about being done is the same defect as a bar that does. */
  function ready() {
    var left = missing();
    if (left.length) { draw(); return { ok: false, waitingOn: left }; }
    readyNow = true; draw();
    return { ok: true, waitingOn: [] };
  }

  root.BohemiaLoading = {
    mount: mount, expect: expect, report: report, ready: ready,
    onBegin: function (fn) { if (typeof fn === 'function') beginFns.push(fn); },
    fraction: fraction,
    isReady: function () { return readyNow; },
    waitingOn: missing,
    /* for a gate and for RUN: the sources actually reported, nothing inferred */
    sources: function () { var o = {}, k; for (k in SRC) if (SRC.hasOwnProperty(k)) o[k] = { done: SRC[k].done, total: SRC[k].total }; return o; }
  };
})(typeof window !== 'undefined' ? window : this);
