/* BOHEMIA SCREEN CLASS (rule 62, Paolo 10/1: 'the UI of an iPhone versus an iPad versus a computer... why aren't these
   things automatic depending on the screen'; rule 72, Paolo 10/4: 'fit on an iPhone screen, fit differently flipped, on
   widescreen monitors'). ONE RULE, FOUR CLASSES, read from the real viewport at boot and on every rotate or resize:
     phone_portrait   the phone held upright (the default every screen was built on)
     phone_landscape  the phone on its side: short and wide, the thumbs at the two ends
     tablet           a short side of 600 css px or more on a touch screen (Android's 'smallest width 600dp' is where a
                      tablet starts; every iPad's short side is 744 or more, every iPhone's 440 or less)
     computer         a mouse or trackpad (hover and a fine pointer) on a window at least 640 wide; a narrow window
                      falls back to the phone class its shape is
   It writes the class on <html data-screen="..."> so each screen's CSS re-lays itself by rule, never by hand for one
   device. COMBAT built it for the fight (10/4); RUN [screen fit] owns it for the map and the settlement: include this
   file and call BohemiaScreen.watch(). */
(function () {
  'use strict';
  const TABLET_SHORT_SIDE = 600, COMPUTER_MIN_WIDTH = 640;
  function classify(w, h, fine) {
    if (fine && w >= COMPUTER_MIN_WIDTH) return 'computer';
    if (Math.min(w, h) >= TABLET_SHORT_SIDE) return 'tablet';
    return w > h ? 'phone_landscape' : 'phone_portrait';
  }
  function fine() { try { return window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (_e) { return false; } }
  function apply(root) {
    root = root || document.documentElement;
    const c = classify(window.innerWidth, window.innerHeight, fine());
    if (root.dataset.screen !== c) root.dataset.screen = c;
    return c;
  }
  function watch(cb, root) {
    let last = apply(root);
    const go = function () { const c = apply(root); if (c !== last) { last = c; if (cb) cb(c); } };
    window.addEventListener('resize', go); window.addEventListener('orientationchange', go);
    return last;
  }
  function wide(c) { c = c || document.documentElement.dataset.screen; return c === 'phone_landscape' || c === 'tablet' || c === 'computer'; }
  window.BohemiaScreen = { classify: classify, apply: apply, watch: watch, wide: wide };
})();
