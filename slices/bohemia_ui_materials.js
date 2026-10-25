/* BOHEMIA UI MATERIALS (COMBAT, rule 67a, Paolo 10/4: 'the combat UI is all fucked up and not seamless').
   Battle Brothers' UI is made of the setting's own materials, wood, metal, paper and ink (Dev Blog 75).
   Ours is the same idea in our world: CARDBOARD for the bar, TAPE holding it on, a THERMAL RECEIPT for
   labels and the button you press to end a turn, CRACKED PHONE GLASS for the skill squares. Each is drawn
   once with light and form (a lit top, a shadowed foot, grain, wear) into a picture, and handed to CSS as
   --mat-cardboard, --mat-tape, --mat-receipt, --mat-glass, so the map, the settlement screen and the fight
   can wear the same bar (the first votes: one UI every second). Include it and call BohemiaMaterials.apply().
   The pictures are seeded, so every screen gets the same cardboard. */
(function () {
  'use strict';
  let seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function grain(g, w, h, n, a, light) {
    for (let i = 0; i < n; i++) {
      const v = light ? 255 : 0;
      g.fillStyle = 'rgba(' + v + ',' + v + ',' + v + ',' + (a * rnd()).toFixed(3) + ')';
      g.fillRect(Math.floor(rnd() * w), Math.floor(rnd() * h), 1 + Math.floor(rnd() * 2), 1);
    }
  }
  /* corrugated cardboard: flutes under the liner, a lit top edge, a darker foot, scuffs, an old marker line */
  function cardboard() {
    const w = 256, h = 256, c = canvas(w, h), g = c.getContext('2d');
    const lg = g.createLinearGradient(0, 0, 0, h); lg.addColorStop(0, '#4a3826'); lg.addColorStop(1, '#2c2117');
    g.fillStyle = lg; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 6) { g.fillStyle = 'rgba(0,0,0,.10)'; g.fillRect(x, 0, 2, h); g.fillStyle = 'rgba(255,220,170,.035)'; g.fillRect(x + 3, 0, 1, h); }
    grain(g, w, h, 2600, .16, false); grain(g, w, h, 1400, .06, true);
    for (let i = 0; i < 5; i++) { g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1 + rnd() * 2; g.beginPath(); const x = rnd() * w, y = rnd() * h; g.moveTo(x, y); g.lineTo(x + 20 + rnd() * 50, y + rnd() * 8 - 4); g.stroke(); }
    return c;
  }
  /* yellowed packing tape, half see-through, a crease, a torn end */
  function tape() {
    const w = 96, h = 26, c = canvas(w, h), g = c.getContext('2d');
    g.fillStyle = 'rgba(214,190,128,.55)'; g.beginPath(); g.moveTo(3, 0);
    for (let x = 0; x <= w; x += 6) g.lineTo(x, rnd() * 2); g.lineTo(w, h); for (let x = w; x >= 0; x -= 6) g.lineTo(x, h - rnd() * 2); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,245,210,.28)'; g.fillRect(0, 3, w, 4);
    g.fillStyle = 'rgba(0,0,0,.10)'; g.fillRect(0, h - 6, w, 3);
    grain(g, w, h, 300, .12, true);
    return c;
  }
  /* thermal receipt paper: warm white, a thermal fade toward the foot, the curl lit from the top left,
     and a TORN bottom edge (transparent teeth). UI 10/4: the old faded print rows sat behind every word
     printed on it and read as strike-throughs on the numbers drawer, so the paper is blank now; the
     printing is the type itself. */
  function receipt() {
    const w = 200, h = 120, c = canvas(w, h), g = c.getContext('2d');
    const lg = g.createLinearGradient(0, 0, 0, h); lg.addColorStop(0, '#ece6d4'); lg.addColorStop(.7, '#ddd4bd'); lg.addColorStop(1, '#c2b79c');
    g.fillStyle = lg; g.beginPath(); g.moveTo(0, 0); g.lineTo(w, 0); g.lineTo(w, h - 4);
    for (let x = w; x >= 0; x -= 4) g.lineTo(x, h - (((x / 4) % 2) ? 0 : 4) - rnd() * 1.2);
    g.closePath(); g.fill();
    const cl = g.createLinearGradient(0, 0, w, h); cl.addColorStop(0, 'rgba(255,255,255,.20)'); cl.addColorStop(.5, 'rgba(255,255,255,0)'); cl.addColorStop(1, 'rgba(70,52,30,.16)');
    g.globalCompositeOperation = 'source-atop'; g.fillStyle = cl; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(0, 0, w, 1);
    grain(g, w, h, 700, .07, false);
    g.globalCompositeOperation = 'source-over';
    return c;
  }
  /* the cut edge of corrugated board along the top of the bar: the liner torn back, the flutes showing
     as lit arches over dark hollows, every 6 px like the flutes in cardboard() (UI 10/4). TEN PIXELS, inside
     the bar's own top padding: the fight fits its board to the bar's height, and a taller bar made the
     board overflow the glass (THE REBUILT FIGHT PLAYS, scrub, 408 wide in 390) */
  function cardedge() {
    const w = 252, h = 10, c = canvas(w, h), g = c.getContext('2d');
    g.fillStyle = '#5a4630'; g.fillRect(0, 0, w, 2);
    for (let x = 0; x < w; x += 6) { g.fillStyle = 'rgba(255,230,190,.22)'; g.fillRect(x + rnd() * 2, 0, 2, 1); }
    g.fillStyle = '#20180f'; g.fillRect(0, 2, w, 6);
    for (let x = 0; x < w; x += 6) {
      g.fillStyle = '#6b5539'; g.fillRect(x, 2, 1, 6); g.fillRect(x + 5, 2, 1, 6);
      g.fillRect(x + 1, 2, 1, 2); g.fillRect(x + 4, 2, 1, 2);
      g.fillStyle = '#8a7150'; g.fillRect(x + 2, 2, 2, 1);
    }
    g.fillStyle = '#3a2c1e'; g.fillRect(0, 8, w, 2);
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 9, w, 1);
    return c;
  }
  /* three printed marks for the receipt tags, 12x12 on a pixel grid, in the thermal ink:
     END TURN an hourglass, WAIT a clock face, AUTO a loop of two arrows (UI 10/4) */
  const MARKS = {
    end:  ['111111111111', '010000000010', '001000000100', '000111111000', '000011110000', '000001100000',
           '000001100000', '000010010000', '000100001000', '001011110100', '010111111010', '111111111111'],
    wait: ['000111111000', '001000000100', '010000100010', '100000100001', '100000100001', '100000100001',
           '100000111001', '100000000001', '100000000001', '010000000010', '001000000100', '000111111000'],
    auto: ['000011111000', '000100000110', '001000000111', '010000001111', '010000000000', '100000000000',
           '000000000001', '000000000010', '111100000010', '111000000100', '011000001000', '000111110000'],
    /* (the reshuffle's ring arrow, 10/9, is deleted: Paolo 10/10 'hell no'; the strip says AGAIN) */
    /* A TALENT STAR (UI [the roster and the posts look], 10/10): Battle Brothers' stars beside a stat, drawn, because
       the game's faces have no star and the glyph fell through to a system font */
    star: ['000001100000', '000001100000', '000011110000', '000011110000', '111111111111', '011111111110',
           '001111111100', '000111111000', '001111111100', '001110011100', '011100001110', '011000000110'],
    skull: ['000000000000', '000111111000', '001111111100', '011111111110', '011001100110', '011001100110',
            '011111111110', '001110011100', '000111111000', '000101101000', '000111111000', '000000000000']
  };
  /* ==== __THE_STARS_SIT_WITH_THE_WORDS__ (RUN TWO's block in UI's file, NOTE on UI's board; rule 146(e), Paolo 10/24: 'even
     on the hire screen the stars are a little too big and not nicely put with the UI's letters, so make the stars smaller';
     'jobs should just have stars as well'). MEASURED at his phone's size: the star was 10 points against capitals 7 to 8 tall
     (Casing at 10 and 11), centred or dropped a point below the line, touching the number. NOW ONE STAR, SEVEN CELLS ON
     SEVEN, drawn one cell to one point (so it is crisp at one, two and three device pixels a point), standing on the
     words' baseline at their capital height, a point apart. The same star a job's difficulty uses: BohemiaMaterials.stars(n)
     hands a row of n, ink or gold (rule 146(e): one mark, stars, everywhere). ==== */
  var STAR_CAP = ['0001000', '0001000', '1111111', '0111110', '0011100', '0110110', '1100011'];
  function starCap(ink) {
    const c = canvas(21, 21), g = c.getContext('2d'); g.fillStyle = ink;
    STAR_CAP.forEach(function (r, y) { for (let x = 0; x < 7; x++) if (r[x] === '1') g.fillRect(x * 3, y * 3, 3, 3); });
    return c;
  }
  function stars(n, o) {
    o = o || {}; starVars();
    const w = document.createElement('span'); w.className = 'bmstars'; w.dataset.stars = n | 0; w.setAttribute('aria-label', (n | 0) + ' star' + ((n | 0) === 1 ? '' : 's'));
    w.style.cssText = 'display:inline;white-space:nowrap;letter-spacing:0';
    for (let i = 0; i < (n | 0); i++) { const s = document.createElement('i'); s.className = 'bmstar'; s.setAttribute('aria-hidden', 'true');
      s.style.cssText = 'display:inline-block;width:7px;height:7px;margin-left:' + (i ? 1 : (o.gap == null ? 2 : o.gap)) + 'px;background:var(' + (o.ink ? '--bm-mark-star-ink' : '--bm-mark-star') + ') 0 0/7px 7px no-repeat;image-rendering:pixelated;vertical-align:baseline';
      w.appendChild(s); }
    return w;
  }
  /* ==== end __THE_STARS_SIT_WITH_THE_WORDS__ ==== */
  function mark(k, ink) {
    const rows = MARKS[k], c = canvas(36, 36), g = c.getContext('2d');
    g.fillStyle = ink || '#2a221a';
    rows.forEach(function (r, y) { for (let x = 0; x < 12; x++) if (r[x] === '1') g.fillRect(x * 3, y * 3, 3, 3); });
    return c;
  }
  /* THE STUDIO PASS ON THE BAR (UI [the demo's screens] round one, rule 54b; 71's tells: default fonts,
     centred labels, drop shadows, text where a picture belongs). Applied with the materials, so every
     screen that wears the bar gets it. The game's own faces: CASING (the stamped 5x8 cut) for labels on
     things, ROM (the character-cell cut) for what a thermal printer prints. Tags read from the left with a
     printed mark; paper casts a hard one-pixel contact edge, not a soft glow; a hint wraps, never cuts. */
  const FACES = "@font-face{font-family:'BohemiaCasing';src:url(fonts/BohemiaCasing-Regular.woff2) format('woff2');font-display:block}"
    + "@font-face{font-family:'BohemiaROM';src:url(fonts/BohemiaROM-Regular.woff2) format('woff2');font-display:block}"
    + "@font-face{font-family:'BohemiaBody';src:url(fonts/BohemiaBody-Regular.woff2) format('woff2');font-display:block}";
  const SKIN = FACES
    + ":root{--face-casing:'BohemiaCasing',ui-sans-serif,sans-serif;--face-rom:'BohemiaROM',ui-monospace,monospace}"
    + "html[data-materials] body{font-family:var(--face-rom)}"
    + "html[data-materials] #bot{background:var(--mat-cardedge) top left/252px 10px repeat-x,var(--mat-cardboard,#3a2c1e) 0 0/256px 256px}"
    + "html[data-materials] #round,html[data-materials] #bauto,html[data-materials] #bend,html[data-materials] #bwait{font-family:var(--face-casing);font-weight:400;letter-spacing:.5px;"
    +   "box-shadow:none;filter:drop-shadow(0 1px 0 rgba(0,0,0,.8))}"
    + "html[data-materials] #bauto,html[data-materials] #bend,html[data-materials] #bwait{display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;"
    +   "text-align:left;padding:6px 7px 7px;line-height:1;background-size:100% 100%}"
    + "html[data-materials] #bauto::before,html[data-materials] #bend::before,html[data-materials] #bwait::before{content:'';display:block;width:12px;height:12px;background:center/12px 12px no-repeat}"
    + "html[data-materials] #bend::before{background-image:var(--mark-end)} html[data-materials] #bwait::before{background-image:var(--mark-wait)}"
    + "html[data-materials] #bauto::before{background-image:var(--mark-auto)}"
    + "html[data-materials] #bend{font-size:12px;width:76px;white-space:normal;word-spacing:100vw} html[data-materials] #bwait{font-size:11px} html[data-materials] #bauto{font-size:10px}"
    + "html[data-materials] #round{font-size:11px;padding:4px 6px 5px;background-size:100% 100%}"
    + "html[data-materials] #cnm{font-family:var(--face-casing);font-weight:400;font-size:10px;letter-spacing:.4px;text-shadow:0 1px 0 #000;align-self:flex-start;margin-left:4px}"
    + "html[data-materials] #say{font-family:var(--face-rom);font-size:11px;line-height:1.35;white-space:normal;overflow:visible;text-overflow:clip;text-align:left;"
    +   "left:0;right:0;margin:0 auto;width:max-content;max-width:92vw;transform:rotate(-.6deg);"
    +   "padding:5px 10px 8px;background-size:100% 100%;box-shadow:none;filter:drop-shadow(0 1px 0 rgba(0,0,0,.8))}"
    + "html[data-materials] #drawer{font-family:var(--face-rom);font-size:11px;background-size:100% 100%;padding-bottom:18px}"
    + "html[data-materials] #drawer .r{border-bottom:1px dotted rgba(42,34,26,.35)}"
    /* the drawer's title was gold on white paper, hard to read on the phone shot; a thermal
       printer has one ink, so the title is the ink, set in the casing face as a stamped header */
    + "html[data-materials] #drawer>div:first-child{color:#5c2410!important;font-family:var(--face-casing);font-weight:400!important;letter-spacing:.6px}"
    + "html[data-materials] #over .box{font-family:var(--face-rom);background-size:100% 100%;padding-bottom:20px}"
    + "html[data-materials] #over h2{font-family:var(--face-casing);font-weight:400;text-align:left;letter-spacing:1px}";
  function skin() {
    if (document.getElementById('bm-skin')) return;
    const st = document.createElement('style'); st.id = 'bm-skin'; st.textContent = SKIN;
    (document.head || document.documentElement).appendChild(st);
  }
  /* a cracked phone's glass: near-black, a glare from the top left, one crack that forks */
  function glass() {
    const w = 132, h = 132, c = canvas(w, h), g = c.getContext('2d');
    const lg = g.createLinearGradient(0, 0, w, h); lg.addColorStop(0, '#2a2622'); lg.addColorStop(1, '#0e0c0a');
    g.fillStyle = lg; g.fillRect(0, 0, w, h);
    const gl = g.createLinearGradient(0, 0, w * .6, h * .6); gl.addColorStop(0, 'rgba(255,255,255,.10)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gl; g.beginPath(); g.moveTo(0, 0); g.lineTo(w * .7, 0); g.lineTo(0, h * .7); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(220,230,240,.22)'; g.lineWidth = 1;
    let x = w * .78, y = h * .08; g.beginPath(); g.moveTo(x, y);
    for (let i = 0; i < 7; i++) { x -= 6 + rnd() * 10; y += 10 + rnd() * 12; g.lineTo(x, y); if (i === 3) { g.moveTo(x, y); g.lineTo(x + 18, y + 14); g.moveTo(x, y); } }
    g.stroke();
    grain(g, w, h, 500, .06, true);
    return c;
  }
  function apply(root) {
    root = root || document.documentElement;
    if (root.dataset.materials) return;
    seed = 7;
    const set = function (k, c) { root.style.setProperty(k, 'url(' + c.toDataURL('image/png') + ')'); };
    set('--mat-cardboard', cardboard()); set('--mat-tape', tape()); set('--mat-receipt', receipt()); set('--mat-glass', glass());
    set('--mat-cardedge', cardedge()); set('--mark-end', mark('end')); set('--mark-wait', mark('wait')); set('--mark-auto', mark('auto'));
    skin();
    root.dataset.materials = '1';
  }

  /* ======================================================================================================
     THE START SCREEN'S LOOK and THE FRONT DOOR'S DRESS  (UI [the start screen's look], 10/5/26; rules 66, 67, 71)
     RUN builds the start screen's LOGIC (claimed e31bb315) and the front door's picks (BOH_START, #newco); this
     lane DRESSES them, here, so their files stay theirs (ONE SYSTEM ONE SESSION).
       startScreen(host, opts)  the whole look of NEW GAME / CONTINUE / SETTINGS, built into host, wired to RUN's
                                callbacks: opts = { onNew, onContinue, onSettings, saved:{day,min}|null, sub }.
                                Returns { root, paint(saved), arm(line), disarm(), destroy() }. It decides nothing:
                                what each tap does is RUN's.
                                THE THREE THINGS ARE THREE THINGS (the row): NEW GAME a card of cardboard taped to
                                the glass, CONTINUE a receipt (the run's day printed on it), SETTINGS a pane of
                                cracked phone glass. Each read from the left under its printed mark, 64 points.
                                Under it the valley at night under the dead grid, one block still powered.
       dressFrontDoor()         the picks while the valley loads, in RUN's terminal green (his pick, 'loads B',
                                kept): the fights and the shelves as taped cards, the origins as a sheet posted on
                                the terminal with the picked one ringed in marker, the crew's name as a form a
                                stranger fills. Applied by itself on any page that has #newco.
     ====================================================================================================== */
  var START_MARKS = {
    new: ['000111111000', '001000000100', '010000000010', '010001100010', '010001100010', '010111111010',
          '010111111010', '010001100010', '010001100010', '010000000010', '011111111110', '000000000000'],
    cont: ['000000000000', '011000000000', '011110000000', '011111100000', '011111111000', '011111111110',
           '011111111110', '011111111000', '011111100000', '011110000000', '011000000000', '000000000000'],
    set: ['000001100000', '001001100100', '000111111000', '010110011010', '001100001100', '111100001111',
          '111100001111', '001100001100', '010110011010', '000111111000', '001001100100', '000001100000']
  };
  function markURL(k, col) {
    var c = document.createElement('canvas'); c.width = c.height = 36; var g = c.getContext('2d'); g.fillStyle = col;
    START_MARKS[k].forEach(function (r, y) { for (var x = 0; x < 12; x++) if (r[x] === '1') g.fillRect(x * 3, y * 3, 3, 3); });
    return c.toDataURL('image/png');
  }

  function ground(w, h) {
    var c = document.createElement('canvas'); c.width = w; c.height = h; var g = c.getContext('2d');
    var seed = 11; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#0c1320'); sky.addColorStop(.52, '#1a2233'); sky.addColorStop(.62, '#2a2a33'); sky.addColorStop(1, '#0b0a09');
    g.fillStyle = sky; g.fillRect(0, 0, w, h);
    var hz = Math.round(h * .58);
    /* the ridge, two depths, the far one lit by what is left of the sky */
    g.fillStyle = '#1e2230'; g.beginPath(); g.moveTo(0, hz);
    for (var x = 0; x <= w; x += 6) g.lineTo(x, hz - 18 - Math.sin(x / 47) * 10 - Math.sin(x / 13) * 3 - rnd() * 2);
    g.lineTo(w, hz + 2); g.lineTo(0, hz + 2); g.fill();
    g.fillStyle = '#121218'; g.beginPath(); g.moveTo(0, hz + 4);
    for (x = 0; x <= w; x += 4) g.lineTo(x, hz - 4 - Math.sin(x / 31 + 2) * 6 - rnd() * 2);
    g.lineTo(w, h); g.lineTo(0, h); g.fill();
    /* the valley floor: the dead grid, streets as faint lines, every block dark but one */
    for (var y = hz + 8; y < h; y += 7 + Math.round((y - hz) / 18)) { g.fillStyle = 'rgba(120,130,150,' + (0.05 + (y - hz) / h * .05).toFixed(3) + ')'; g.fillRect(0, y, w, 1); }
    for (var i = 0; i < 70; i++) { var px = rnd() * w, py = hz + 10 + rnd() * (h - hz - 10); g.fillStyle = 'rgba(150,160,180,.10)'; g.fillRect(Math.round(px), Math.round(py), 2, 1); }
    /* the one block with power: sodium lamps and their pools */
    var bx = w * .66, by = hz + 6;   /* just under the ridge: above the menu, never behind it */
    for (i = 0; i < 9; i++) {
      var lx = bx + (i % 3) * 14 + rnd() * 4, ly = by + Math.floor(i / 3) * 10 + rnd() * 3;
      var pool = g.createRadialGradient(lx, ly, 0, lx, ly, 22); pool.addColorStop(0, 'rgba(255,170,70,.30)'); pool.addColorStop(1, 'rgba(255,170,70,0)');
      g.fillStyle = pool; g.fillRect(lx - 22, ly - 22, 44, 44);
      g.fillStyle = '#ffd08a'; g.fillRect(Math.round(lx), Math.round(ly), 2, 2);
    }
    /* the pylons and their lines, black against the sky: the grid that died */
    g.strokeStyle = '#06070a'; g.fillStyle = '#06070a'; g.lineWidth = 1.5;
    var pyl = [[w * .1, hz - 6, 64], [w * .46, hz - 12, 44], [w * .86, hz - 9, 30]];
    pyl.forEach(function (p) { var X = p[0], Y = p[1], H = p[2];
      g.beginPath(); g.moveTo(X - H * .16, Y); g.lineTo(X, Y - H); g.lineTo(X + H * .16, Y); g.stroke();
      g.fillRect(X - H * .28, Y - H * .82, H * .56, 2); g.fillRect(X - H * .2, Y - H * .62, H * .4, 2); });
    g.lineWidth = 1; g.beginPath();
    for (var j = 0; j < 2; j++) { var a = pyl[j], b = pyl[j + 1];
      [-.28, .28].forEach(function (o) { var ax = a[0] + a[2] * o, ay = a[1] - a[2] * .82, bxx = b[0] + b[2] * o, byy = b[1] - b[2] * .82;
        g.moveTo(ax, ay); g.quadraticCurveTo((ax + bxx) / 2, Math.max(ay, byy) + 14, bxx, byy); }); }
    g.stroke();
    /* baked grain (R10: grime is baked, never a filter) */
    for (i = 0; i < w * h / 30; i++) { g.fillStyle = 'rgba(255,255,255,' + (rnd() * .035).toFixed(3) + ')'; g.fillRect((rnd() * w) | 0, (rnd() * h) | 0, 1, 1); }
    return c;
  }


  var LOOK_CSS = ''
    + '.bm-start{position:fixed;inset:0;z-index:250;background:#0b0a09;color:#e7dcc6;overflow:hidden;font-family:"BohemiaROM",ui-monospace,monospace;'
    +   '-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}'
    + '.bm-start>canvas.gr{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated}'
    + '.bm-start .t{position:absolute;left:20px;right:20px;top:max(56px,calc(env(safe-area-inset-top,0px) + 40px));display:flex;flex-direction:column;align-items:flex-start;gap:10px}'
    + '.bm-start .t canvas{width:min(100%,360px);height:auto;image-rendering:pixelated}'
    + '.bm-start .t .word{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:54px;letter-spacing:6px;color:#e2bd6a;line-height:1;'
    +   'text-shadow:0 2px 0 #3a2410,0 0 0 #000}'
    + '.bm-start .sub{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:11px;letter-spacing:2px;color:#d8ccb4;background:#14110d;padding:5px 8px 6px;border-left:2px solid #c8a35a}'
    + '.bm-start .m{position:absolute;left:16px;right:16px;bottom:max(64px,calc(env(safe-area-inset-bottom,0px) + 52px));display:flex;flex-direction:column;gap:14px}'
    + '.bm-start .b{position:relative;display:flex;align-items:center;gap:14px;min-height:64px;padding:10px 16px 10px 14px;text-align:left;border:0;cursor:pointer;'
    +   'outline:0;-webkit-appearance:none;appearance:none;font:inherit;filter:drop-shadow(0 1px 0 rgba(0,0,0,.9))}'
    + '.bm-start .b::before{content:"";flex:0 0 18px;height:18px;background:var(--bm-mark) center/18px 18px no-repeat}'
    + '.bm-start .b .tx{display:flex;flex-direction:column;gap:5px;min-width:0}'
    + '.bm-start .b b{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;font-size:19px;letter-spacing:1.6px;line-height:1}'
    + '.bm-start .b i{font-style:normal;font-size:11px;letter-spacing:.6px;line-height:1.2}'
    /* NEW GAME: a card of cardboard, two strips of tape holding it to the glass */
    + '.bm-start .b.card{color:#f6ead2;background:linear-gradient(rgba(12,8,4,.30),rgba(12,8,4,.30)),#3a2c1e var(--bm-cardboard) 0 0/256px 100%;transform:rotate(-.6deg)}'
    + '.bm-start .b.card i{color:#eadcc0}'
    + '.bm-start .b.card::after{content:"";position:absolute;top:-7px;left:26px;width:64px;height:16px;background:var(--bm-tape) center/100% 100%;transform:rotate(-5deg)}'
    + '.bm-start .b.card .tp2{position:absolute;top:-6px;right:30px;width:54px;height:15px;background:var(--bm-tape) center/100% 100%;transform:rotate(4deg)}'
    /* CONTINUE: a receipt, the day printed on it, the torn foot */
    + '.bm-start .b.rec{color:#231b13;background:#e2dac6 var(--bm-receipt) center/100% 100%;transform:rotate(.5deg)}'
    + '.bm-start .b.rec i{color:#1f1710}'
    + '.bm-start .b.rec:disabled{cursor:default}.bm-start .b.rec:disabled b{color:#6b5f4f}.bm-start .b.rec:disabled::before{opacity:.45}'
    /* SETTINGS: a pane of cracked phone glass */
    + '.bm-start .b.pane{color:#f1e7d2;background:#16130f var(--bm-glass) center/cover;box-shadow:inset 0 1px 0 rgba(255,236,200,.22),inset 0 -2px 0 rgba(0,0,0,.65)}'
    + '.bm-start .b.pane i{color:#e2d8c2}'
    + '.bm-start .b.armed{color:#fff2e6;background:#5a1c10;transform:rotate(-.6deg)}.bm-start .b.armed i{color:#ffd9c8}'
    + '.bm-start .stamp{position:absolute;left:16px;right:16px;bottom:max(18px,calc(env(safe-area-inset-bottom,0px) + 10px));font-size:10px;letter-spacing:1.4px;color:#a89c86}'
    /* landscape, tablet, monitor (rule 62): the title left, the three things right, both centred on the height */
    + '@media (min-aspect-ratio: 4/3){.bm-start .t{right:52%;top:50%;transform:translateY(-50%)}'
    +   '.bm-start .m{left:auto;right:max(24px,6vw);width:min(380px,40vw);bottom:auto;top:50%;transform:translateY(-50%)}}';
  var FRONT_CSS = ''
    + 'html body #newco h4{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:11px;letter-spacing:2px;color:#9fc38f}'
    /* the fights and the shelves: taped cards; the picked one carries the tape and the amber edge */
    + 'html body #newco .row button{position:relative;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:12px;letter-spacing:1px;text-align:left;padding:8px 9px;'
    +   'color:#f2e6cc;border:0;border-radius:0;background:linear-gradient(rgba(12,8,4,.38),rgba(12,8,4,.38)),#3a2c1e var(--bm-cardboard) 0 0/256px 100%;filter:drop-shadow(0 1px 0 #000)}'
    + 'html body #newco .row button small{font-family:"BohemiaROM",ui-monospace,monospace;font-size:10px;opacity:1;color:#e6d6b6;margin-top:3px}'
    + 'html body #newco .row button.on{color:#120c06;background:linear-gradient(#f4cf7c,#d9a650);box-shadow:inset 0 1px 0 rgba(255,240,200,.6)}'
    + 'html body #newco .row button.on small{color:#2a1c0e}'
    + 'html body #newco .row button.on::after{content:"";position:absolute;top:-6px;left:50%;width:44px;height:13px;margin-left:-22px;background:var(--bm-tape) center/100% 100%;transform:rotate(-3deg)}'
    /* the origins: one sheet posted on the terminal, each origin a printed entry, the picked one ringed */
    + 'html body #newco .strip{gap:0;padding:10px 6px 8px;background:#e2dac6 var(--bm-receipt) center/100% 100%;filter:drop-shadow(0 1px 0 #000)}'
    + 'html body #newco .org{flex:0 0 172px;border:0;border-right:1px dashed rgba(42,34,26,.35);border-radius:0;background:transparent;padding:6px 10px;margin:0}'
    + 'html body #newco .org.on{background:transparent;border-color:rgba(42,34,26,.35);box-shadow:inset 0 0 0 2px #a8301c;border-radius:12px 5px 14px 6px}'
    + 'html body #newco .org b{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;font-size:13px;letter-spacing:.6px;color:#1f1710}'
    + 'html body #newco .org i{font-family:"BohemiaROM",ui-monospace,monospace;color:#1f1710;font-size:10px}'
    + 'html body #newco .org em{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:10px;letter-spacing:1px;color:#2c4a22;border:1.5px solid #2c4a22;background:transparent;transform:rotate(-2deg)}'
    + 'html body #newco .org em.d2{color:#6a4f10;border-color:#6a4f10}html body #newco .org em.d3{color:#8a3a12;border-color:#8a3a12}html body #newco .org em.d4{color:#9a1a12;border-color:#9a1a12}'
    /* the name: a form a stranger fills, the field a line on paper, ANOTHER a receipt tag */
    + 'html body #newco .name{gap:8px;padding:8px 8px 8px 10px;background:#e2dac6 var(--bm-receipt) center/100% 100%;filter:drop-shadow(0 1px 0 #000)}'
    + 'html body #newco .name span{border:0;border-bottom:2px solid #2a221a;background:transparent;color:#1f1710;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;letter-spacing:1.4px;font-size:14px;padding:0 4px}'
    + 'html body #newco .name button{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:12px;letter-spacing:1px;text-align:left;padding:0 10px;color:#f2e6cc;border:0;border-radius:0;'
    +   'background:#16130f var(--bm-glass) center/cover;box-shadow:inset 0 1px 0 rgba(255,236,200,.2)}';
  var ROOTSET = false;
  function rootVars() {
    if (ROOTSET) return; ROOTSET = true;
    var R = document.documentElement.style, u = function (c) { return 'url(' + c.toDataURL('image/png') + ')'; };
    seed = 7;
    R.setProperty('--bm-cardboard', u(cardboard())); R.setProperty('--bm-tape', u(tape()));
    R.setProperty('--bm-receipt', u(receipt())); R.setProperty('--bm-glass', u(glass()));
  }
  function style(id, css) { if (document.getElementById(id)) return; var st = document.createElement('style'); st.id = id; st.textContent = css; (document.head || document.documentElement).appendChild(st); }
  function dressFrontDoor() {
    if (!document.getElementById('newco')) return false;
    rootVars(); style('bm-frontdoor', FRONT_CSS); return true;
  }
  function clockOf(m) { m = Math.max(0, m | 0); var h = Math.floor(m / 60) % 24, r = m % 60; return (h < 10 ? '0' : '') + h + ':' + (r < 10 ? '0' : '') + r; }
  function startScreen(host, opts) {
    opts = opts || {}; host = host || document.body;
    rootVars(); style('bm-start-css', LOOK_CSS);
    /* THE FRONT SCREEN, JUST THE FONT (below): when the door asks for it, the title wears the bare look, his letters
       with the card taken out over the valley drawn at the letters' own pixel size */
    var bare = jtfOn(); if (bare) { jtfVars(); style('bm-jtf-css', JTF_CSS); }
    var root = document.createElement('div'); root.className = 'bm-start' + (bare ? ' jtf' : ''); root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'start');
    var W = Math.max(320, Math.min(1400, Math.round(innerWidth))), H = Math.max(320, Math.min(1400, Math.round(innerHeight)));
    var gr = bare ? groundBare(W, H) : ground(Math.round(W / 2), Math.round(H / 2)); gr.className = 'gr'; root.appendChild(gr);
    var t = document.createElement('div'); t.className = 't';
    /* his approved wordmark when the page has it (#logobig), else the name in the casing face */
    var src = bare ? null : document.getElementById('logobig'), mark = null;
    if (bare) t.appendChild(markCanvas(function () { return innerWidth > innerHeight ? innerWidth * 0.48 - 40 : innerWidth - 40; }));
    else if (src) { mark = document.createElement('canvas'); mark.width = src.width; mark.height = src.height; t.appendChild(mark); }
    else { var wd = document.createElement('div'); wd.className = 'word'; wd.textContent = 'BOHEMIA'; t.appendChild(wd); }
    var sub = document.createElement('div'); sub.className = 'sub'; sub.textContent = opts.sub || 'POST-ECONOMIC APOCALYPSE - LAS VEGAS'; t.appendChild(sub);
    root.appendChild(t);
    var m = document.createElement('div'); m.className = 'm';
    m.innerHTML = '<button class="b card" data-k="new"><span class="tp2"></span><span class="tx"><b>NEW GAME</b><i>PICK YOUR CREW</i></span></button>'
      + '<button class="b rec" data-k="continue"><span class="tx"><b>CONTINUE</b><i>NO GAME SAVED</i></span></button>'
      + '<button class="b pane" data-k="settings"><span class="tx"><b>SETTINGS</b><i>SOUND &middot; TEXT &middot; BRIGHTNESS</i></span></button>';
    root.appendChild(m);
    var stamp = document.createElement('div'); stamp.className = 'stamp'; var bs = document.getElementById('buildstamp'); stamp.textContent = bs ? bs.textContent.trim() : ''; root.appendChild(stamp);
    var q = function (k) { return m.querySelector('[data-k="' + k + '"]'); };
    var MK = { 'new': ['new', '#f0c46a'], 'continue': ['cont', '#5a3a14'], 'settings': ['set', '#f0c46a'] };
    ['new', 'continue', 'settings'].forEach(function (k) { q(k).style.setProperty('--bm-mark', 'url(' + markURL(MK[k][0], MK[k][1]) + ')');
      if (bare) { q(k).style.setProperty('--jtf-bone', 'url(' + markURL(MK[k][0], '#b3a993') + ')'); q(k).style.setProperty('--jtf-ink', 'url(' + markURL(MK[k][0], '#0e0a05') + ')'); } });
    var call = function (fn) { return function (e) { e.stopPropagation(); if (typeof fn === 'function') fn(e); }; };
    q('new').addEventListener('click', call(opts.onNew)); q('continue').addEventListener('click', call(opts.onContinue)); q('settings').addEventListener('click', call(opts.onSettings));
    ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'mousedown', 'mouseup', 'click'].forEach(function (ev) { root.addEventListener(ev, function (e) { e.stopPropagation(); }); });
    host.appendChild(root);
    var copyT = 0, copy = function () { if (!mark || !src) return; try { mark.getContext('2d').drawImage(src, 0, 0); } catch (e) {} if (++copyT < 20) setTimeout(copy, 500); };
    copy();
    var api = {
      root: root,
      paint: function (saved) {
        var c = q('continue'); c.disabled = !saved; root.classList.toggle('saved', !!saved);   /* the bare look lights the one next thing */
        c.querySelector('i').textContent = saved ? ((saved.day ? 'DAY ' + saved.day : 'YOUR GAME') + (saved.min == null ? '' : ' \u00b7 ' + clockOf(saved.min))) : 'NO GAME SAVED';   /* WORDS [eyes: no run saved], rule 150: there are no runs in this game */
      },
      arm: function (line) { var n = q('new'); n.classList.add('armed'); n.querySelector('b').textContent = 'TAP AGAIN'; n.querySelector('i').textContent = line || 'YOUR GAME IS KEPT ASIDE'; },
      disarm: function () { var n = q('new'); n.classList.remove('armed'); n.querySelector('b').textContent = 'NEW GAME'; n.querySelector('i').textContent = 'PICK YOUR CREW'; },
      destroy: function () { if (root.parentNode) root.parentNode.removeChild(root); }
    };
    api.paint(opts.saved || null);
    return api;
  }
  /* ======================================================================================================
     THE SETTLEMENT'S LABELS  (UI [the settlement's labels], 10/5/26; rule 71a, RUN TWO [one painted place])
     RUN TWO's settlement is one painted picture and a building names itself only under the finger. This is
     what that name looks like: a TORN TAG of receipt paper under the building, held by a strip of tape, its
     name stamped in CASING and its line printed in ROM, 44 points tall, read from the left, a hard one-pixel
     contact edge, clamped inside the glass. RUN TWO's picture calls settleTag() while the finger is down (its
     own plate stays as the fallback when this file is missing). dressSettlement() puts the pay and the price
     lines (the board's contracts, the stall's goods, every act in the keeper's sheet) in the receipt face;
     it applies by itself on any page that has the settlement's #sbody.
     ====================================================================================================== */
  var TAGPAPER = null, TAPEPIC = null;
  function settleTag(cx, box, title, line, W, H) {
    if (!TAGPAPER) { seed = 7; TAGPAPER = receipt(); TAPEPIC = tape(); }
    var F1 = '13px "BohemiaCasing", ui-sans-serif, sans-serif', F2 = '11px "BohemiaROM", ui-monospace, monospace';
    cx.save();
    cx.font = F1; var w1 = cx.measureText(title).width; cx.font = F2; var w2 = line ? cx.measureText(line).width : 0;
    var pw = Math.ceil(Math.max(w1, w2) + 30), ph = 44;
    var px = Math.round(Math.max(6, Math.min(W - pw - 6, box.x + box.w / 2 - pw / 2)));
    var py = Math.round(box.y + box.h + 8); if (py + ph > H - 6) py = Math.round(Math.max(6, box.y - ph - 8));
    /* the torn outline: straight top, ragged sides, a torn foot */
    var path = function () {
      cx.beginPath(); cx.moveTo(px, py); cx.lineTo(px + pw, py);
      for (var yy = py + 4; yy < py + ph; yy += 4) cx.lineTo(px + pw - ((yy / 4) % 2 ? 1.5 : 0), yy);
      for (var xx = px + pw; xx > px; xx -= 4) cx.lineTo(xx, py + ph - ((xx / 4) % 2 ? 0 : 3));
      for (yy = py + ph; yy > py; yy -= 4) cx.lineTo(px + ((yy / 4) % 2 ? 1.5 : 0), yy);
      cx.closePath();
    };
    cx.translate(0, 1); path(); cx.fillStyle = 'rgba(0,0,0,.85)'; cx.fill(); cx.translate(0, -1);   /* the contact edge */
    /* the paper, and a wash that keeps its darkest curl light enough for the ink in the sun (rule 73: the
       smallest tag's corner read 4.3:1 under +25% white without it, the armourer's 4.48 at a .38 wash) */
    path(); cx.save(); cx.clip(); cx.drawImage(TAGPAPER, px, py, pw, ph); cx.fillStyle = 'rgba(255,250,236,.52)'; cx.fillRect(px, py, pw, ph); cx.restore();
    cx.drawImage(TAPEPIC, Math.round(px + pw / 2 - 22), py - 6, 44, 12);
    cx.textAlign = 'left'; cx.textBaseline = 'alphabetic';
    cx.fillStyle = '#1f1710'; cx.font = F1; cx.fillText(title, px + 12, py + (line ? 19 : 27));
    if (line) { cx.fillStyle = '#1f1710'; cx.font = F2; cx.fillText(line, px + 12, py + 35); }
    cx.restore();
    var r = { x: px, y: py, w: pw, h: ph }; try { window.__SETTLE_TAG = r; } catch (e) {}
    return r;
  }
  var SETTLE_CSS = FACES
    + 'html body #sheet .act{border:0;border-radius:0;color:#1f1710;background:#e2dac6 var(--bm-receipt) center/100% 100%;'
    +   'font-family:"BohemiaROM",ui-monospace,monospace;font-size:13px;filter:drop-shadow(0 1px 0 rgba(0,0,0,.85));min-height:48px}'
    + 'html body #sheet .act span{flex:1 1 auto;text-align:left}'
    + 'html body #sheet .act em{color:#3e1608;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:.8px;border-left:1px dashed rgba(42,34,26,.4);padding-left:8px}'
    + 'html body #sheet .act[disabled]{opacity:1;color:#6b5f4f}html body #sheet .act[disabled] em{color:#7a6a58}'
    /* the bag's and the shelf's slots: cracked glass cells, the item's icon, its short name in ROM, the price stamped */
    + 'html body #sheet .slot{border:1px solid #0d0a07;border-radius:2px;background:#16130f var(--bm-glass) center/cover;box-shadow:inset 0 1px 0 rgba(255,236,200,.12)}'
    + 'html body #sheet .slot.full{background:linear-gradient(rgba(12,8,4,.25),rgba(12,8,4,.25)),#3a2c1e var(--bm-cardboard) 0 0/256px 100%}'
    + 'html body #sheet .slot span{font-family:"BohemiaROM",ui-monospace,monospace;font-size:9px;color:#f0e2c4;text-shadow:0 1px 0 #000}'
    + 'html body #sheet .slot em{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:9px;color:#f0c46a;text-shadow:0 1px 0 #000}'
    /* THE MONEY IS SPELLED ONE WAY (UI [eyes: four spellings], rule 150): a tile's price is the number and the bar's own battery
       mark, never '138b' (the settlement marks it em.money; --bm-batt is the kit's battery, set in dressSettlement) */
    + 'html body #sheet .slot em.money{display:inline-flex;align-items:center;gap:2px}'
    + 'html body #sheet .slot em.money::before{content:"";flex:0 0 auto;width:10px;height:10px;background:var(--bm-batt) center/contain no-repeat;image-rendering:pixelated}'
    + 'html body #sheet .gridh{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:1.4px;color:#e8d8b8}'
    /* THE SCREENS PAST THE PHONE (UI [the screens past the phone], 10/22): from 700 wide the building's sheet is a window, not
       the phone's drawer stretched to the glass (a stall's price rows ran 1,416 points on a computer): at most 1,040 wide and
       centred, the one you are talking to on the left, what he sells (the rows, the shelf, the bag) on the right, the slots a
       thumb's size and no bigger */
    + '@media (min-width:700px){'
    +   'html body #sheet{left:50%;right:auto;width:min(1040px,calc(100vw - 24px));margin-left:calc(min(1040px, 100vw - 24px) / -2)}'
    +   'html body #sbody:has(> .who){display:grid;grid-template-columns:minmax(220px,300px) minmax(0,1fr);grid-auto-flow:row dense;grid-auto-rows:min-content;column-gap:16px;align-items:start;padding-right:48px}'   /* the close X keeps its own gutter at the top right */
    +   'html body #sbody:has(> .who) > *{grid-column:2;min-width:0}'
    +   'html body #sbody:has(> .who) > .who{grid-column:1;grid-row:1 / span 12}'
    +   'html body #sbody:has(> .who) > .acts{margin-top:0}'
    +   'html body #sheet .grid{grid-template-columns:repeat(auto-fill,minmax(56px,72px))}}';
  function dressSettlement() {
    if (!document.getElementById('sbody')) return false;
    rootVars(); style('bm-settle', SETTLE_CSS);
    try { document.documentElement.style.setProperty('--bm-batt', 'url(' + supplyIcon('batteries') + ')'); } catch (e) {}
    try { document.fonts.load('13px "BohemiaCasing"'); document.fonts.load('11px "BohemiaROM"'); } catch (e) {}
    return true;
  }
  /* ======================================================================================================
     THE ITEM ICONS  (UI [item icons], 10/5/26; rule 76, Paolo 10/5: 'inventory space with icons')
     One icon per item: every row of weapons.json (126), armor.json body (78), head (87) and shields (19).
     Each is drawn, not typed: a 22x22 pixel grid cut by hand per OBJECT (what the item is in our world, the
     names RUN TWO's market gives them: a pipe, a fire axe, a hard hat, a car door...), lit from the top left
     with a hard dark outline (light and form, the perk icons' way), and made THIS item's by its own id: the
     handle's material, where the tape wraps, where the rust took, a chip off an edge, a scratch, a tint; its
     quality word (beat-up, solid, good) decides the wear. Loud and crude on purpose, inside the analog horror
     bible: nothing shines but a 'good' piece's one glint. 132 device pixels = 44 points on his phone.
       itemIcon(item, cssPx)      item = {id, kind:'weapon'|'body'|'head'|'shield', name} (RUN TWO's item)
       itemFromRow(kind, row, all) the same item made from a data row (mirrors RUN TWO's naming)
     ====================================================================================================== */
  var OBJ_CLASS = {dagger:'pistol', mace:'pipe', hammer:'sledge', crossbow:'rifle', firearm:'shotgun', throwing:'bottles', throwable_item:'bottles',
    sword:'machete', axe:'fire axe', spear:'rebar spear', cleaver:'cleaver', flail:'chain', polearm:'pole hook', bow:'compound bow'};
  /* MIRRORS RUN TWO's naming in BOHEMIA_SETTLEMENT_SCREEN.html (armourName, weaponItem's qualityWord) word for word,
     so the icon's object is the object the market's line names; the gate compares the two on every stocked item */
  function armourName(kind, dur) {
    if (kind === 'head') return dur < 40 ? 'a rag hood' : dur < 100 ? 'a hard hat' : dur < 180 ? 'a riot helmet' : 'a full riot helm';
    if (kind === 'shield' || kind === 'shields') return dur < 40 ? 'a car door' : 'a riot shield';
    return dur < 40 ? 'a work jacket' : dur < 100 ? 'a padded vest' : dur < 180 ? 'a plate carrier' : 'full riot armour';
  }
  function itemFromRow(kind, row, all) {
    if (kind === 'weapon') {
      var c = OBJ_CLASS[row['class']] || 'pipe', same = (all || [row]).filter(function (x) { return x['class'] === row['class']; }).sort(function (a, b) { return a.value - b.value; });
      var q = same.indexOf(row) / Math.max(1, same.length - 1);
      return { id: row.id, kind: 'weapon', name: (q < .34 ? 'beat-up ' : q < .67 ? 'solid ' : 'good ') + c };
    }
    var k = kind === 'shields' ? 'shield' : kind;
    return { id: row.id, kind: k, name: armourName(k, row.durability), dur: row.durability || 0 };
  }
  var OBJECTS = ['pistol', 'shotgun', 'rifle', 'pipe', 'sledge', 'bottles', 'machete', 'fire axe', 'rebar spear', 'cleaver', 'chain', 'pole hook', 'compound bow',
    'work jacket', 'padded vest', 'plate carrier', 'full riot armour', 'rag hood', 'hard hat', 'riot helmet', 'full riot helm', 'car door', 'riot shield'];
  function objOf(item) {
    var n = String(item.name || '').toLowerCase();
    for (var i = OBJECTS.length - 1; i >= 0; i--) if (n.indexOf(OBJECTS[i]) >= 0) {
      /* 'riot helmet' is inside 'full riot helm'... the longest match wins */
      var best = OBJECTS[i]; OBJECTS.forEach(function (o) { if (n.indexOf(o) >= 0 && o.length > best.length) best = o; }); return best; }
    return item.kind === 'head' ? 'hard hat' : item.kind === 'body' ? 'work jacket' : item.kind === 'shield' ? 'car door' : 'pipe';
  }
  function qualOf(item) { var n = String(item.name || '').toLowerCase(); return /beat-up|rag |work jacket|car door/.test(n) ? 0 : /good|full /.test(n) ? 2 : 1; }
  function hashStr(t) { var h = 2166136261; for (var i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  var MAT = { steel: [154, 163, 168], dsteel: [92, 98, 104], rust: [150, 78, 38], wood: [134, 92, 52], red: [176, 46, 32], yellow: [214, 168, 40],
    black: [44, 42, 40], olive: [96, 104, 60], khaki: [150, 130, 88], glass: [128, 170, 186], tape: [206, 188, 140], rag: [214, 206, 186],
    leather: [96, 60, 36], green: [70, 120, 70], flame: [240, 140, 40], white: [236, 232, 222], brass: [190, 150, 70] };
  var ICON_CACHE = {};
  function itemIcon(item, cssPx) {
    cssPx = cssPx || 44;
    var key = item.id + '|' + item.name + '|' + cssPx;
    if (ICON_CACHE[key]) { var cc = document.createElement('canvas'); cc.width = ICON_CACHE[key].width; cc.height = ICON_CACHE[key].height; cc.getContext('2d').drawImage(ICON_CACHE[key], 0, 0);
      cc.dataset.obj = ICON_CACHE[key].dataset.obj; cc.dataset.q = ICON_CACHE[key].dataset.q; styleIcon(cc, cssPx); return cc; }
    var N = 22, G = [], i, j;
    for (i = 0; i < N * N; i++) G.push(null);
    var sd = hashStr(String(item.id || item.name)) || 1;
    var R0 = function () { sd ^= sd << 13; sd ^= sd >>> 17; sd ^= sd << 5; return ((sd >>> 0) % 100000) / 100000; };
    var obj = objOf(item), q = qualOf(item);
    var put = function (x, y, m) { x = Math.round(x); y = Math.round(y); if (x >= 1 && y >= 1 && x < N - 1 && y < N - 1) G[y * N + x] = m; };
    var rect = function (x, y, w, h, m) { for (var yy = y; yy < y + h; yy++) for (var xx = x; xx < x + w; xx++) put(xx, yy, m); };
    var line = function (x0, y0, x1, y1, m, t) { t = t || 1; var n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
      for (var k = 0; k <= n; k++) { var x = x0 + (x1 - x0) * k / n, y = y0 + (y1 - y0) * k / n; rect(Math.round(x - (t - 1) / 2), Math.round(y - (t - 1) / 2), t, t, m); } };
    var ell = function (cx, cy, rx, ry, m, hollow) { for (var yy = Math.floor(cy - ry); yy <= Math.ceil(cy + ry); yy++) for (var xx = Math.floor(cx - rx); xx <= Math.ceil(cx + rx); xx++) {
      var d = ((xx - cx) * (xx - cx)) / (rx * rx) + ((yy - cy) * (yy - cy)) / (ry * ry); if (d <= 1 && (!hollow || d >= .45)) put(xx, yy, m); } };
    var get = function (x, y) { return (x < 0 || y < 0 || x >= N || y >= N) ? null : G[y * N + x]; };
    var handle = ['wood', 'black', 'leather', 'wood', 'red'][Math.floor(R0() * 5)];
    var L = Math.round(R0() * 2) - 1;   /* one pixel longer or shorter */
    switch (obj) {
      case 'pistol': rect(4, 7, 13 + L, 4, 'dsteel'); rect(4, 8, 2, 2, 'black'); line(7, 11, 5, 17, handle === 'red' ? 'black' : handle, 4); put(10, 12, 'dsteel'); put(11, 13, 'dsteel'); put(10, 13, 'dsteel'); rect(15 + L, 6, 1, 1, 'dsteel'); break;
      case 'shotgun': line(2, 18, 7, 14, handle, 3); rect(7, 12, 4, 3, 'dsteel'); line(10, 12, 20 + L, 6, 'steel', 2); line(13, 12, 17, 10, 'wood', 2); break;
      case 'rifle': line(1, 19, 6, 15, handle, 3); line(6, 15, 20 + L, 5, 'dsteel', 2); line(9, 11, 14, 8, 'black', 2); put(15, 8, 'glass'); put(8, 12, 'glass'); put(10, 16, 'dsteel'); break;
      case 'pipe': line(4, 19, 15, 7 + L, 'steel', 3); rect(14, 3, 5, 4, 'dsteel'); rect(17, 7, 2, 2, 'dsteel'); break;
      case 'sledge': line(5, 20, 13, 9, handle, 2); rect(10, 3, 9 + L, 6, 'dsteel'); rect(10, 3, 9 + L, 1, 'steel'); break;
      case 'bottles': rect(8, 10, 6, 10, 'green'); rect(9, 9, 4, 1, 'green'); rect(10, 5, 2, 4, 'green'); line(10, 5, 13, 2, 'rag', 2); put(14, 1 + 1, 'flame'); put(13, 1 + 1, 'flame'); rect(9, 13, 4, 3, 'rag'); break;
      case 'machete': line(3, 19, 7, 15, handle, 2); line(8, 14, 19 + L, 3, 'steel', 3); line(9, 15, 19 + L, 5, 'dsteel', 1); rect(6, 14, 3, 2, 'dsteel'); break;
      case 'fire axe': line(4, 20, 15, 5, handle === 'red' ? 'wood' : handle, 2); rect(12, 2, 6, 5, 'red'); rect(17, 1 + 1, 2, 6, 'steel'); put(11, 4, 'red'); break;
      case 'rebar spear': line(3, 20, 16, 7, 'rust', 1); for (i = 4; i < 16; i += 2) put(3 + i, 20 - i, 'dsteel'); line(16, 7, 20 + Math.min(0, L), 2, 'steel', 2); rect(14, 8, 3, 2, 'tape'); break;
      case 'cleaver': rect(9, 4, 10 + L, 8, 'steel'); rect(9, 11, 10 + L, 1, 'dsteel'); line(4, 18, 9, 11, handle, 2); put(17 + L, 5, 'dsteel'); break;
      case 'chain': for (i = 0; i < 4; i++) ell(4.5 + i * 3.6, 17.5 - i * 3.6, 2.8, 2.1, 'steel', true); rect(15, 3, 5, 5, 'brass'); line(16, 3, 16, 1 + 1, 'steel', 1); line(19, 3, 19, 2, 'steel', 1); put(17, 2, 'steel'); put(18, 2, 'steel'); put(17, 5, 'black'); break;
      case 'pole hook': line(3, 20, 14, 8, handle === 'red' ? 'steel' : handle, 2); line(14, 8, 14, 3, 'dsteel', 2); line(14, 2, 19, 2, 'dsteel', 2); line(19, 2, 19, 6, 'dsteel', 2); put(17, 7, 'dsteel'); break;
      case 'compound bow': for (j = 2; j <= 19; j++) { var bx = 6 + Math.round(7 * Math.sin(Math.PI * (j - 2) / 17)); put(bx, j, 'black'); put(bx + 1, j, 'black'); } line(7, 2, 7, 19, 'rag', 1); ell(7, 2, 1.4, 1.4, 'dsteel'); ell(7, 19, 1.4, 1.4, 'dsteel'); rect(12, 9, 3, 4, handle === 'red' ? 'leather' : handle); break;
      case 'work jacket': rect(6, 6, 10, 13, 'khaki'); line(6, 7, 3, 15, 'khaki', 3); line(15, 7, 18, 15, 'khaki', 3); rect(9, 5, 4, 2, 'leather'); line(11, 7, 11, 18, 'dsteel', 1); rect(7, 12, 3, 2, 'olive'); break;
      case 'padded vest': rect(6, 5, 10, 14, 'olive'); for (j = 7; j < 18; j += 2) rect(6, j, 10, 1, 'black'); rect(9, 4, 4, 2, 'olive'); put(6, 5, null); put(15, 5, null); line(11, 5, 11, 18, 'dsteel', 1); break;
      case 'plate carrier': rect(5, 5, 12, 14, 'black'); rect(7, 7, 8, 7, 'dsteel'); rect(6, 15, 3, 3, 'olive'); rect(10, 15, 3, 3, 'olive'); rect(14, 15, 2, 3, 'olive'); rect(5, 4, 3, 2, 'black'); rect(14, 4, 3, 2, 'black'); break;
      case 'full riot armour': rect(6, 7, 10, 12, 'black'); ell(5, 8, 3, 2.2, 'dsteel'); ell(17, 8, 3, 2.2, 'dsteel'); rect(8, 8, 6, 5, 'dsteel'); rect(8, 14, 6, 3, 'dsteel'); rect(9, 5, 4, 2, 'black'); break;
      case 'rag hood': ell(11, 11, 7, 8.5, 'rag'); ell(11, 13, 3.2, 4, 'black'); rect(6, 18, 10, 2, 'rag'); break;
      case 'hard hat': ell(11, 12, 7, 6, 'yellow'); for (i = 0; i < N; i++) for (j = 13; j < N; j++) if (G[j * N + i] === 'yellow') G[j * N + i] = null; rect(3, 13, 16, 2, 'yellow'); line(11, 6, 11, 12, 'brass', 1); break;
      case 'riot helmet': ell(11, 11, 7, 7, 'black'); rect(6, 11, 10, 4, 'glass'); rect(6, 15, 10, 2, 'black'); break;
      case 'full riot helm': ell(11, 11, 7.5, 7.5, 'black'); rect(5, 9, 12, 7, 'glass'); rect(6, 17, 10, 2, 'dsteel'); rect(5, 8, 12, 1, 'dsteel'); break;
      case 'car door': rect(3, 4, 16, 15, R0() < .5 ? 'red' : 'olive'); rect(5, 5, 12, 6, 'glass'); rect(14, 13, 3, 1, 'dsteel'); rect(3, 18, 16, 1, 'black'); break;
      case 'riot shield': rect(5, 2, 12, 18, 'glass'); rect(5, 8, 12, 2, 'white'); rect(5, 2, 12, 1, 'black'); rect(5, 19, 12, 1, 'black'); rect(10, 12, 2, 4, 'black'); break;
    }
    /* THIS ITEM: tape where it wraps, rust where it took, a chip, a scratch; the quality decides how much */
    var filled = []; for (i = 0; i < N * N; i++) if (G[i]) filled.push(i);
    var metal = filled.filter(function (k) { return /steel|red|yellow/.test(G[k]); });
    var grip = filled.filter(function (k) { return /wood|black|leather|khaki|olive|rag/.test(G[k]); });
    var nRust = q === 0 ? 4 + Math.floor(R0() * 4) : q === 1 ? 1 + Math.floor(R0() * 2) : 0;
    for (i = 0; i < nRust && metal.length; i++) G[metal[Math.floor(R0() * metal.length)]] = 'rust';
    if (q === 0 && grip.length) { var w0 = grip[Math.floor(R0() * grip.length)], wx = w0 % N, wy = (w0 / N) | 0; for (j = -1; j <= 1; j++) if (get(wx + j, wy - j)) G[(wy - j) * N + wx + j] = 'tape'; }
    var nScr = 1 + Math.floor(R0() * 3);
    for (i = 0; i < nScr && filled.length; i++) { var sk = filled[Math.floor(R0() * filled.length)]; if (G[sk] && G[sk] !== 'rust') G[sk] = G[sk] + '*'; }
    if (q < 2 && filled.length) { var edge = filled.filter(function (k) { var x = k % N, y = (k / N) | 0; return !get(x + 1, y) || !get(x, y + 1); }); if (edge.length) G[edge[Math.floor(R0() * edge.length)]] = null; }
    var tint = 1 + (R0() - .5) * .16;
    /* LIGHT AND FORM: lit where the top-left is open, shadowed where the bottom-right is, then the outline */
    var S6 = 6, cv = document.createElement('canvas'); cv.width = cv.height = N * S6; var g = cv.getContext('2d');
    for (j = 0; j < N; j++) for (i = 0; i < N; i++) {
      var m = G[j * N + i];
      if (!m) { var near = get(i - 1, j) || get(i + 1, j) || get(i, j - 1) || get(i, j + 1);
        if (near) { g.fillStyle = '#120d08'; g.fillRect(i * S6, j * S6, S6, S6); } continue; }
      var scr = m.charAt(m.length - 1) === '*'; if (scr) m = m.slice(0, -1);
      var c = MAT[m] || MAT.steel, f = tint;
      if (!get(i - 1, j) || !get(i, j - 1)) f *= 1.28; else if (!get(i + 1, j) || !get(i, j + 1)) f *= .66;
      if (scr) f *= 1.18;
      g.fillStyle = 'rgb(' + Math.min(255, c[0] * f | 0) + ',' + Math.min(255, c[1] * f | 0) + ',' + Math.min(255, c[2] * f | 0) + ')';
      g.fillRect(i * S6, j * S6, S6, S6);
    }
    if (q === 2) { var top = filled.filter(function (k) { return G[k] && /steel|glass|yellow|red|black/.test(G[k]) && !get((k % N) - 1, (k / N) | 0); })[0];
      if (top == null) top = filled.filter(function (k) { return G[k] && !get((k % N) - 1, (k / N) | 0); })[0];   /* cloth and wood glint too */
      if (top != null) { g.fillStyle = '#fffbe8'; g.fillRect((top % N) * S6, ((top / N) | 0) * S6, S6, S6); } }
    cv.dataset.obj = obj; cv.dataset.q = q; ICON_CACHE[key] = cv;
    var out = document.createElement('canvas'); out.width = cv.width; out.height = cv.height; out.getContext('2d').drawImage(cv, 0, 0);
    out.dataset.obj = obj; out.dataset.q = q; styleIcon(out, cssPx);
    return out;
  }
  function styleIcon(c, cssPx) { c.style.width = cssPx + 'px'; c.style.height = cssPx + 'px'; c.style.imageRendering = 'pixelated'; c.className = 'bm-icon'; }
  /* the market's lines: each item line wears its icon (RUN TWO's state.stock and state.stash through its own API,
     BohemiaSettlement.state, matched by the line's name) */
  function iconTheMarket() {
    var body = document.getElementById('sbody'); if (!body || body.__bmIcons) return; body.__bmIcons = true;
    var paint = function () {
      var st = (window.BohemiaSettlement && BohemiaSettlement.state) || null; if (!st || !st.stock) return;
      /* by SHELF ORDER, not by name: two items can share a name (two 'beat-up bottles'), and the lines are made
         in the shelf's order, the stash's sells after them */
      var queue = ((st.open && st.stock[st.open]) || []).slice().concat(st.stash || []);
      Array.prototype.forEach.call(body.querySelectorAll('.act'), function (a) {
        var t = (a.querySelector('span') || a).textContent.replace(/^Sell your /, '');
        var at = -1; for (var i = 0; i < queue.length; i++) if (queue[i].name === t) { at = i; break; }
        if (at < 0) return;
        var it = queue.splice(at, 1)[0];
        if (a.querySelector('.bm-icon')) return;
        var ic = itemIcon(it, 40); ic.style.flex = '0 0 40px'; ic.style.marginRight = '8px'; ic.dataset.id = it.id; a.insertBefore(ic, a.firstChild);
      });
      /* RUN TWO's shop grids (THEIR SHELF, YOUR BAG, 5ba404c): slot i is shelf item i and bag item i, in order;
         the drawn icon takes the place of the placeholder mark */
      var dress = function (grid, list) {
        if (!grid || !list) return;
        Array.prototype.forEach.call(grid.children, function (b, i) {
          var it = list[i]; if (!it) return;
          if (b.querySelector('img.pk')) return;   /* RUN TWO [the market in the pack's art] 10/11: his pack's own tile wins over the drawn icon */
          var old = b.querySelector('.bm-icon'); if (old && old.dataset.id === it.id) return; if (old) old.remove();
          var g = b.querySelector('i'); if (g) g.style.display = 'none';
          var ic = itemIcon(it, 30); ic.dataset.id = it.id; b.insertBefore(ic, b.firstChild);   /* 30 so the short name and the price still fit the slot */
        });
      };
      dress(document.getElementById('shelfgrid'), st.open && st.stock[st.open]);
      dress(document.getElementById('baggrid'), st.stash);
    };
    try { new MutationObserver(paint).observe(body, { childList: true, subtree: true }); } catch (e) {}
    paint();
  }
  /* ======================================================================================================
     THE SIX ON THE MAP'S BAR, AND THE BAR ITSELF  (UI [six icons] + [the map's bar], 10/5/26)
     His fifth votes on THE SIX IN THE BAR: A, 'the icons could use work'. Rule 67a: ONE UI across map,
     settlement and fight. supplyIcon(kind) draws the six as small OBJECTS on a 10x10 grid (3 device pixels
     each: 30 px, the same 10 points the bar already gives them, so the bar still fits a 320 phone): an AA
     cell with its copper cap, a tin with its label, a first-aid box, three cartridges, a roll of tape, a
     water bottle; lit top-left, a hard outline, the family of the item icons. dressMapBar() dresses the bar
     and the speed pad in the materials (the cut cardboard, receipt tags for what is printed, glass for what
     is pressed or counted), applied by itself on the page that has #menubar (the city, the demo's map).
     ====================================================================================================== */
  var SUPPLY_URL = {};
  function supplyIcon(kind) {
    if (SUPPLY_URL[kind]) return SUPPLY_URL[kind];
    var N = 10, G = []; for (var i = 0; i < N * N; i++) G.push(null);
    var put = function (x, y, m) { if (x >= 0 && y >= 0 && x < N && y < N) G[y * N + x] = m; };
    var rect = function (x, y, w, h, m) { for (var yy = y; yy < y + h; yy++) for (var xx = x; xx < x + w; xx++) put(xx, yy, m); };
    var C = { cell: [70, 74, 80], copper: [214, 140, 60], label: [200, 60, 40], tin: [176, 182, 186], paper: [232, 226, 210], red: [196, 40, 32],
      brass: [210, 168, 72], tip: [176, 104, 56], tape: [170, 176, 180], hole: null, blue: [92, 150, 196], cap: [230, 230, 236], green: [96, 160, 90] };
    switch (kind) {
      case 'batteries': rect(1, 3, 6, 4, 'cell'); rect(1, 3, 2, 4, 'green'); put(7, 4, 'copper'); put(7, 5, 'copper'); put(8, 4, 'copper'); put(8, 5, 'copper'); break;
      case 'food': rect(2, 1, 6, 8, 'tin'); rect(2, 3, 6, 3, 'label'); rect(2, 1, 6, 1, 'cap'); break;
      case 'meds': rect(1, 2, 8, 7, 'paper'); rect(4, 3, 2, 5, 'red'); rect(2, 4, 6, 2, 'red'); break;
      case 'rounds': for (var k = 0; k < 3; k++) { rect(1 + k * 3, 4, 2, 5, 'brass'); rect(1 + k * 3, 2, 2, 2, 'tip'); } break;
      /* THE TAPE RING IS DEAD (Paolo, his eleventh votes: 'it looks like someone is getting hung by a noose'; UI [icons at full
         pixels], 10/13): the slot keeps its place and its count and draws nothing until he votes FINAL on the pack's own tape roll
         (records/BOHEMIA_GRAVEYARD_UI_THE_TAPE_RING_10_13_26.md) */
      case 'tape': break;
      case 'water': rect(3, 3, 4, 6, 'blue'); rect(4, 1, 2, 2, 'cap'); rect(3, 5, 4, 1, 'paper'); break;
      /* the nights the batteries still feed the crew (UI [the ten changes], change 5): a moon, cut by the night it counts */
      case 'nights': rect(3, 1, 4, 1, 'paper'); rect(2, 2, 3, 1, 'paper'); rect(1, 3, 3, 4, 'paper'); rect(2, 7, 3, 1, 'paper'); rect(3, 8, 4, 1, 'paper');
        put(7, 7, 'paper'); put(6, 7, 'paper'); put(7, 2, 'paper'); break;
    }
    var get = function (x, y) { return (x < 0 || y < 0 || x >= N || y >= N) ? null : G[y * N + x]; };
    var S3 = 3, cv = document.createElement('canvas'); cv.width = cv.height = N * S3; var g = cv.getContext('2d');
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      var m = G[y * N + x];
      if (!m) { if (get(x - 1, y) || get(x + 1, y) || get(x, y - 1) || get(x, y + 1)) { g.fillStyle = '#0c0805'; g.fillRect(x * S3, y * S3, S3, S3); } continue; }
      var c = C[m], f = 1; if (!get(x - 1, y) || !get(x, y - 1)) f = 1.25; else if (!get(x + 1, y) || !get(x, y + 1)) f = .7;
      g.fillStyle = 'rgb(' + Math.min(255, c[0] * f | 0) + ',' + Math.min(255, c[1] * f | 0) + ',' + Math.min(255, c[2] * f | 0) + ')'; g.fillRect(x * S3, y * S3, S3, S3);
    }
    SUPPLY_URL[kind] = cv.toDataURL('image/png');
    return SUPPLY_URL[kind];
  }
  var MAPBAR_CSS = ''
    /* the bar: a strip of the cut cardboard, its flutes along the foot where it meets the map */
    + 'html body #menubar{background:var(--bm-cardedge-up) bottom left/252px 10px repeat-x,linear-gradient(rgba(12,8,4,.45),rgba(12,8,4,.45)),#3a2c1e var(--bm-cardboard) 0 0/256px 100%;'
    +   'box-shadow:0 1px 0 #000}'
    /* what is printed (the hour, the place) on receipt tags in ink; the six counted on a pane of glass */
    + 'html body #barread .rd{color:#1f1710;background:#e2dac6 var(--bm-receipt) center/100% 100%;box-shadow:none;filter:drop-shadow(0 1px 0 rgba(0,0,0,.85));border-radius:0}'
    + 'html body #barread .rd.six{color:#f2e4c6;background:#16130f var(--bm-glass) center/cover;box-shadow:inset 0 1px 0 rgba(255,236,200,.18)}'
    + 'html body #barread .rd.six b{color:#f0c46a}'
    + 'html body #barread .sx img{width:10px;height:10px;display:block;image-rendering:pixelated}'
    + 'html body #barread .sx.none img{opacity:.55}'
    + 'html body #menubar #noteplate{color:#1f1710!important;background:#e2dac6 var(--bm-receipt) center/100% 100%!important;box-shadow:none!important;filter:drop-shadow(0 1px 0 rgba(0,0,0,.85))}'
    /* the speed pad: panes of cracked glass on a taped card, the speed you are at lit amber */
    + 'html body #speedpad{border-radius:2px;padding:8px 6px 6px;background:linear-gradient(rgba(12,8,4,.4),rgba(12,8,4,.4)),#3a2c1e var(--bm-cardboard) 0 0/256px 100%;filter:drop-shadow(0 1px 0 #000)}'
    + 'html body #speedpad::before{content:"";position:absolute;top:-6px;left:50%;width:56px;height:14px;margin-left:-28px;background:var(--bm-tape) center/100% 100%;transform:rotate(-2deg)}'
    + 'html body #speedpad .sp{border:1px solid #0d0a07;border-radius:2px;color:#f2e4c6;background:#16130f var(--bm-glass) center/cover;box-shadow:inset 0 1px 0 rgba(255,236,200,.18);font-family:"BohemiaCasing",ui-sans-serif,sans-serif}'
    + 'html body #speedpad .sp.now{color:#120c06;background:linear-gradient(#f4cf7c,#d9a650);box-shadow:inset 0 1px 0 rgba(255,240,200,.6),inset 0 -2px 0 rgba(70,40,10,.55)}';
  function dressMapBar() {
    if (!document.getElementById('menubar') && !document.getElementById('speedpad')) return false;
    rootVars();
    if (!document.documentElement.style.getPropertyValue('--bm-cardedge-up')) {
      var e = cardedge(), f = document.createElement('canvas'); f.width = e.width; f.height = e.height; var fg = f.getContext('2d');
      fg.translate(0, e.height); fg.scale(1, -1); fg.drawImage(e, 0, 0);   /* the flutes face down, toward the map */
      document.documentElement.style.setProperty('--bm-cardedge-up', 'url(' + f.toDataURL('image/png') + ')');
    }
    style('bm-mapbar', MAPBAR_CSS); return true;
  }
  /* ======================================================================================================
     THE TOP BAR, THE DAYS ONCE  (UI [the top bar, the days once], 10/22/26; rules 121(g) and 123: built into the
     game, no card). His NO on the three bars (10/19): 'How many times ur gonna show how many days?'. Every one said
     DAY 1 on its tag and '0 DAYS' beside the food, and the hour twice (the tag and the phone's own clock). The pick
     is B (his 10/19 'you could put so much things in the top of the screen', and his vote A on the six in one row)
     with every fact printed ONCE on the glass:
     - THE DAY once, on the left tag, beside a drawn sun or moon riding its arc by the hour (Battle Brothers' day
       dial). The hour's digits are the phone's clock only, which the city's bar already keeps in step.
     - THE FOOD a count, never days: the day eats one (BohemiaPurse 'day:ate'), so the count IS the days and the
       word is not printed a second time; on a red-inked receipt chip under three.
     - THE CREW: the drawn man, how many of the cap, a tick of health a man. A readout (the crew button is RUN TWO's).
     - THE STORES: batteries, food, meds, rounds, water on one pane of glass (tape stays dead, his eleventh votes);
       a store the game does not count is a dash, never an invented zero. Then where you are.
     - THE GEAR and NOTES at the right end. NOTES is the city's own button MOVED, its handler kept; the gear is a tag
       that presses the shell's own gear, and the shell's floating copy steps aside while this one is on the glass.
     Upright two rows (the reads under the presses); on its side one row. IN THE FIGHT THE TOP GOES (his 10/19:
     'during combat it doesn't go away'): the round, the turn order and AUTO ride the bottom bar's top edge, moved,
     never cloned, and the board runs to the top of the glass (the fight's hudEdges() reads TOPH 0 by itself).
     No gradient, glow, blur or soft shadow (rule 114 D10): the light is in the pixels.
     ====================================================================================================== */
  var TB = { built: false, man: '', gear: '' };
  function tbDark(c, a) { var d = document.createElement('canvas'); d.width = c.width; d.height = c.height; var g = d.getContext('2d');
    g.drawImage(c, 0, 0); g.fillStyle = 'rgba(12,8,4,' + a + ')'; g.fillRect(0, 0, d.width, d.height); return d; }
  function tbDots(P, S, ink) { var cv = document.createElement('canvas'); cv.width = P[0].length * S; cv.height = P.length * S; var g = cv.getContext('2d');
    for (var y = 0; y < P.length; y++) for (var x = 0; x < P[y].length; x++) { var k = P[y][x]; if (ink[k]) { g.fillStyle = ink[k]; g.fillRect(x * S, y * S, S, S); } }
    return cv.toDataURL('image/png'); }
  /* the man (the crew) and the gear, 10 dots at 2 px, in the receipt's ink, lit top-left */
  var TB_MAN = ['...aa.....', '..aaaa....', '..aabb....', '...bb.....', '.aaabbb...', 'a.abbb.b..', 'a.abbb.b..', '..b..b....', '..b..b....', '.bb..bb...'];
  var TB_GEAR = ['....aa....', '..a.aa.b..', '.aaaabbbb.', '..aa..bb..', 'aaa....bbb', 'aab....bbb', '..ab..bb..', '.abbbbbbb.', '..b.bb.b..', '....bb....'];
  /* the sun or the moon of the hour on its arc over a horizon, 18 x 11 dots at 2 px: the sun climbs from 06:00 and
     sets at 19:00, the moon crosses the night; whole above the horizon at either end, a hard ink ring so it reads on paper */
  function tbDial(min) {
    var h = (((min || 0) / 60) % 24 + 24) % 24, sun = h >= 6 && h < 19, t = sun ? (h - 6) / 13 : ((h - 19 + 24) % 24) / 11,
      NX = 18, NY = 11, S = 2, cx = 8.5, cy = 7.2, rx = 6, ry = 4.6, a = Math.PI * (1 - t), bx = cx + rx * Math.cos(a), by = cy - ry * Math.sin(a);
    var cv = document.createElement('canvas'); cv.width = NX * S; cv.height = NY * S; var g = cv.getContext('2d');
    for (var y = 0; y < NY; y++) for (var x = 0; x < NX; x++) {
      var dx = x - bx, dy = y - by, d = Math.sqrt(dx * dx + dy * dy), ex = (x - cx) / rx, ey = (y - cy) / ry,
        arc = Math.abs(Math.sqrt(ex * ex + ey * ey) - 1) * ry, c = null;
      if (y === NY - 1) c = '#3a2e20';
      else if (d < 2.3) {
        var bite = !sun && Math.sqrt((dx - 1.3) * (dx - 1.3) + (dy + 0.9) * (dy + 0.9)) < 1.7;
        c = bite ? '#1f1710' : (sun ? (dx + dy < -0.8 ? '#ffe7a6' : '#e8a43e') : (dx + dy < -0.8 ? '#f6f0dc' : '#b9b2a0'));
      } else if (d < 3.2) c = '#1f1710';
      else if (y <= cy && arc < 0.5 && (x + y) % 2 === 0) c = '#8a7658';
      if (c) { g.fillStyle = c; g.fillRect(x * S, y * S, S, S); }
    }
    return cv.toDataURL('image/png');
  }
  /* UI [the ten changes] (10/24): the state of the moments the bar and the voice carry (filled in THE TEN CHANGES below) */
  var TEN = { count: null };
  /* every fact asked of the game, nothing kept here; null where the game knows nothing (the 10/19 lay's reads) */
  function tbFacts() {
    var f = { day: null, min: null, batteries: null, food: null, perDay: 1, crew: null, cap: null, place: null, six: {} };
    try { f.day = T.day | 0; f.min = T.min | 0; } catch (_e) {}
    try { var pb = purseBalances(); if (typeof pb.electricity === 'number') f.batteries = pb.electricity; if (typeof pb.resources === 'number') f.food = pb.resources; } catch (_e) {}
    try { var t = om.at(city.x, city.y); f.place = (t && t.district) ? String(t.district).toUpperCase() : null; } catch (_e) {}
    try { var R = window.__BAR_READ; if (R && R.six) f.six = R.six; } catch (_e) {}
    try { var p = window.parent.BOH_START && window.parent.BOH_START.picks(); if (p && p.company) {
      f.cap = p.roster || p.cap || null;   /* RUN TWO, EYES [eyes: one company number] (rule 150): the company's room, the crew screen's and the door's number; the fight's 12 is named on those two */
      f.crew = p.company.map(function (m) { return (typeof m.hp === 'number' && typeof m.hpMax === 'number' && m.hpMax > 0) ? m.hp / m.hpMax : 1; }); } } catch (_e) {}
    /* UI [the ten changes], change 5 (rule 133, TUNING's ONE BILL IN DAYS): the bill is the map's (RUN 10/23, window.__BILL):
       the crew it feeds is the crew (a man who walked is gone from the count), and the nights the batteries cover is the
       second number. A man the fight laid up (the crew screen's bohemia.climb.v1) is a red tick until he is back. */
    try { var B = window.__BILL; if (B && typeof B.crew === 'number') {
      f.days = typeof B.daysLeft === 'number' ? B.daysLeft : null; f.red = !!B.red;
      var n = Math.max(1, B.crew | 0), c = f.crew || [], out = [];
      for (var i = 0; i < n; i++) out.push(i < c.length ? c[i] : 1);
      f.crew = out; } } catch (_e) {}
    try { var cl = JSON.parse(localStorage.getItem('bohemia.climb.v1') || '{}') || {}, men = (window.CREW_DEFS && CREW_DEFS.men) || [];
      if (f.crew) f.crew = f.crew.map(function (hp, i) { var m = men[i] && cl[men[i].name]; return (m && m.hurt && m.hurt.days > 0) ? Math.min(hp, 0.2) : hp; }); } catch (_e) {}
    /* the figure never jumps (change 6): mid-count it is the count; a change not yet counted shows what was there */
    if (TEN.count) f.batteries = TEN.count.shown; else if (TEN.armed && TEN.last != null) f.batteries = TEN.last;
    try { if (f.days != null && window.__BILL.perNight > 0 && typeof f.batteries === 'number') f.days = Math.floor(f.batteries / __BILL.perNight); } catch (_e) {}   /* the nights walk with the figure */
    return f;
  }
  var TOPBAR_CSS = ''
    + 'html body #menubar.bmtb>:not(#bmtb){display:none!important}'
    + 'html body #menubar.bmtb{display:block!important;height:auto!important;min-height:0!important;padding:0!important;'
    +   'background:var(--bm-cardedge-up) bottom left/252px 10px repeat-x,#2a2016 var(--bm-cardboard-dk) 0 0/256px 100%!important;box-shadow:0 1px 0 #000!important}'
    + '#bmtb{display:flex;flex-direction:column;gap:5px;box-sizing:border-box;padding:max(6px,env(safe-area-inset-top)) 8px 13px;font-family:"BohemiaCasing",ui-sans-serif,sans-serif}'
    + '#bmtb .r{display:flex;align-items:center;gap:6px;min-width:0}'
    + '#bmtb .sp{flex:1 1 auto}'
    /* printed things are receipt tags in ink; pressed things are the same tag, 44 points */
    + '#bmtb .t,html body #menubar #bmtb #notebtn{display:inline-flex;align-items:center;gap:6px;box-sizing:border-box;min-height:44px;padding:0 9px;color:#1f1710;'
    +   'background:#e2dac6 var(--bm-receipt) center/100% 100%;border:0;border-radius:0;box-shadow:0 1px 0 #000;font-size:12px;letter-spacing:.8px;line-height:1;white-space:nowrap;margin:0;flex:0 0 auto}'
    + '#bmtb .t img{display:block;image-rendering:pixelated}'
    + '#bmtb .t.day b{font-weight:normal;font-size:15px;letter-spacing:1px}'
    + '#bmtb .t.crew b{font-weight:normal;font-size:14px} #bmtb .t.crew em{font-style:normal;font-size:10px}'
    + '#bmtb .t.crew{cursor:pointer;-webkit-tap-highlight-color:transparent;padding-left:6px} #bmtb .t.crew img.me{image-rendering:auto;box-shadow:0 0 0 1px #1f1710,1px 1px 0 1px rgba(10,6,3,.5);background:#2a2016}'
    + '#bmtb .t.gear{width:44px;padding:0;justify-content:center;cursor:pointer;-webkit-tap-highlight-color:transparent}'
    + 'html body #menubar #bmtb #notebtn{cursor:pointer;min-width:44px;justify-content:center;font-size:12px}'
    + 'html body #menubar #bmtb #noteplate{display:inline;padding:0!important;font-family:inherit;font-size:12px;letter-spacing:.8px;color:#1f1710!important;background:none!important;filter:none!important;box-shadow:none!important}'
    + 'html body #menubar #bmtb #notebtn.on{background:#e8bb62;box-shadow:inset 0 1px 0 #ffe2a0,inset 0 -2px 0 #8a5a1c,0 1px 0 #000}'
    + '#bmtb .ticks{display:inline-flex;gap:2px;align-items:flex-end;height:14px}'
    + '#bmtb .ticks i{display:block;position:relative;width:4px;height:14px;background:#b9ad92;box-shadow:inset 0 -1px 0 #6e6250}'
    + '#bmtb .ticks i b{position:absolute;left:0;bottom:0;display:block;width:4px;background:#2f6b2a}'
    + '#bmtb .ticks i.hurt b{background:#9a5a12} #bmtb .ticks i.bad b{background:#8a1a0c}'
    /* what you have and where, on one pane of glass darkened in its own pixels */
    + '#bmtb .g{display:flex;align-items:center;gap:10px;box-sizing:border-box;min-height:32px;padding:0 8px;background:#16130f var(--bm-glass-dk) center/cover;'
    +   'box-shadow:inset 0 1px 0 rgba(255,236,200,.18),0 1px 0 #000;border:1px solid #0d0a07;border-radius:0;flex:1 1 auto;min-width:0}'
    + '#bmtb .s{display:inline-flex;align-items:center;gap:4px;color:#ffd98a;font-size:14px;white-space:nowrap;flex:0 0 auto}'
    + '#bmtb .s img{display:block;width:20px;height:20px;image-rendering:pixelated}'
    + '#bmtb .s b{font-weight:normal} #bmtb .s.none b{color:#ddd2b8} #bmtb .s.none img{opacity:.6}'
    + '#bmtb .s b.low{color:#4a0a05;padding:3px 5px;background:#e2dac6 var(--bm-receipt) center/100% 100%;box-shadow:0 1px 0 #000}'
    + '#bmtb .where{flex:0 1 auto;min-width:0;margin-left:auto;overflow:hidden;white-space:nowrap;font-size:11px;letter-spacing:1px;color:#f2e4c6}'
    /* the two numbers (change 5): the batteries big, the nights beside them with the word, so a stranger reads 'nights left' */
    + '#bmtb .s.bats b{font-size:16px;min-width:3ch} #bmtb .s.days b{font-size:16px} #bmtb .s.days i{font-style:normal;font-size:10px;letter-spacing:.8px;color:#ddd2b8;margin-left:2px}'
    + '#bmtb .s.days.red i{color:#ff9a7e}'
    /* the days on hold (rule 151(a)): the nights are off the glass until the pane is held (hovered with a mouse) */
    + '#bmtb .s.days.hold{display:none} #bmtb .g.held .s.days.hold{display:inline-flex}'
    + '#bmtb .g{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:manipulation;-webkit-tap-highlight-color:transparent}'
    + '#bmtb .g.held{box-shadow:inset 0 1px 0 rgba(255,236,200,.18),inset 0 0 0 1px #f0c47e,0 1px 0 #000}'
    /* a win counting up where the number lives (change 6): the figure lit amber on the beat while it climbs */
    + '#bmtb .s.bats.counting b{color:#120c06;padding:2px 5px;background:#e8bb62;box-shadow:inset 0 1px 0 #ffe2a0,inset 0 -2px 0 #8a5a1c,0 1px 0 #000}'
    + '#bmtb .s.bats.counting.down b{background:#d98a6e;box-shadow:inset 0 1px 0 #f6c2a8,inset 0 -2px 0 #6e2a12,0 1px 0 #000}'
    + '@media (max-width:359px){#bmtb .s.days i{display:none}}'
    /* a phone under 360 points keeps every fact and drops only the cap's '/12' */
    + '@media (max-width:359px){#bmtb .t.crew em{display:none} #bmtb .g{gap:7px}}'
    /* on its side, and on any screen 700 wide (a tablet, a computer): one row, the reads between the day and the crew */
    + '@media (orientation:landscape) and (max-height:500px),(min-width:700px){#bmtb{flex-direction:row;align-items:center;gap:6px;padding:max(4px,env(safe-area-inset-top)) max(8px,env(safe-area-inset-right)) 12px max(8px,env(safe-area-inset-left))}'
    +   '#bmtb .r{display:contents} #bmtb .r1 .day{order:1} #bmtb .g{order:2;min-height:44px} #bmtb .r1 .crew{order:3} #bmtb .r1 .sp{display:none} #bmtb .r1 .x{order:4}'
    +   '#bmtb .r1 .gear{order:5} html body #menubar #bmtb #notebtn{order:6}}'
    /* the shell's own floating gear steps aside while the bar's gear is on the glass (set from the city frame) */
    + '';
  var TB_SHELL_CSS = 'html.bm-gear-in-bar #gearbtn{display:none!important}';
  var TB_STORES = ['batteries', 'food', 'meds', 'rounds', 'water'];
  function tbPaint() {
    var root = document.getElementById('bmtb'); if (!root) return;
    var f = tbFacts();
    var day = '<img alt="" width="36" height="22" style="width:36px;height:22px" src="' + tbDial(f.min) + '"><b>DAY ' + (f.day == null ? '–' : f.day) + '</b>';
    /* UI [portrait menu] (rule 44b, Paolo 9/29: 'the portrait button that used to be the action button could be the character
       menu'): the crew tag wears HIS face (PORTRAIT's 'you', the crew screen's own) and is the door to his company */
    var me = null; try { me = window.BohemiaCrewFaces && BohemiaCrewFaces.has('you') ? BohemiaCrewFaces.src('you', 'rest', 64) : null; } catch (_e) {}
    var crew = me ? '<img class="me" alt="YOUR COMPANY" width="30" height="30" style="width:30px;height:30px" src="' + me + '">'
      : '<img alt="CREW" width="20" height="20" style="width:20px;height:20px" src="' + TB.man + '">';
    if (f.crew) {
      crew += '<b>' + f.crew.length + (f.cap ? '<em>/' + f.cap + '</em>' : '') + '</b><span class="ticks">';
      f.crew.forEach(function (hp) { var px = Math.max(2, Math.round(14 * hp)); crew += '<i class="' + (hp >= 0.66 ? '' : (hp >= 0.33 ? 'hurt' : 'bad')) + '"><b style="height:' + px + 'px"></b></i>'; });
      crew += '</span>';
    } else crew += '<b>–</b>';
    /* UI [the ten changes], change 5 (rule 133; TUNING: 'the bar shows two numbers, not five'): the batteries, and the
       nights they still feed the crew, said as NIGHTS: the bill is paid at nightfall, and his NO on the 10/19 bars ('How many
       times ur gonna show how many days?') keeps DAY on the bar once. The stall's food, meds and rounds are bought where they are sold; the bill is one
       number in batteries, so the three dashes and the food chip are off the bar. Until the map's bill is read (a page
       without it) the bar keeps the five it had. */
    /* UI [the days on hold] (rule 151(a), Paolo 10/24: 'it shouldn't show me how many days are left on the front; if I hold,
       or if this was a mouse and I hover over the batteries, then it displays how many days I have left to fund my crew';
       amends change 5's two numbers): the glass carries the batteries ONLY. The nights they feed the crew are in the same
       pane, shown only while a finger holds it (a mouse hovers it) and gone when let go. At the bill's red line the
       batteries themselves wear the red tag, so the warning is never only behind a hold. */
    var g;
    if (f.days != null) {
      var cnt = TEN.count ? ' counting' : '';
      g = '<span class="s bats' + cnt + '" data-f="batteries"><img alt="BATTERIES" src="' + supplyIcon('batteries') + '"><b' + (f.red && !cnt ? ' class="low"' : '') + '>' + (typeof f.batteries === 'number' ? f.batteries : '–') + '</b></span>'
        + '<span class="s days hold' + (f.red ? ' red' : '') + '" data-f="nights"><img alt="NIGHTS" src="' + supplyIcon('nights') + '"><b' + (f.red ? ' class="low"' : '') + '>' + f.days + '</b><i>' + (f.days === 1 ? 'NIGHT LEFT' : 'NIGHTS LEFT') + '</i></span>';
    } else g = TB_STORES.map(function (k) {
      var n = k === 'batteries' ? f.batteries : (k === 'food' ? f.food : (f.six ? f.six[k] : null)), has = typeof n === 'number';
      var low = k === 'food' && has && Math.floor(n / f.perDay) < 3;
      return '<span class="s' + (has ? '' : ' none') + '" data-f="' + k + '"><img alt="' + k.toUpperCase() + '" src="' + supplyIcon(k) + '"><b' + (low ? ' class="low"' : '') + '>' + (has ? n : '–') + '</b></span>';
    }).join('');
    g += (f.place ? '<span class="where" data-f="place">' + f.place + '</span>' : '');
    var parts = { day: day, crew: crew, g: g };
    Object.keys(parts).forEach(function (k) { var e = root.querySelector('[data-tb=' + k + ']'); if (e && e.__was !== parts[k]) { e.innerHTML = parts[k]; e.__was = parts[k]; } });
    /* the shell's floating gear steps aside for good once the bar carries its own (UI [eyes: the gear on top], rule 150,
       EYES 10/24 item 14: it used to come back whenever a screen covered the bar, and floated over the crew screen's FRONT,
       its HITPOINTS and the town's picture). A screen over the map has its own way out (DONE, LEAVE, the fight's own bar);
       the settings are one tap away on the map's bar the moment he is back. */
    try {
      var gb = root.querySelector('.gear');
      var on = !!(gb && gb.isConnected), P = window.parent && window.parent !== window ? window.parent.document : null;
      if (P) { if (!P.getElementById('bm-tb-shell')) { var st = P.createElement('style'); st.id = 'bm-tb-shell'; st.textContent = TB_SHELL_CSS; P.head.appendChild(st); }
        P.documentElement.classList.toggle('bm-gear-in-bar', on); }
    } catch (_e) {}
  }
  /* the one door to the company (RUN TWO's engine/bohemia_crew_door.js, the settlement's CREW calls the same) */
  function crewDoor() {
    var go = function () { try { if (!BohemiaCrewDoor.isOpen()) BohemiaCrewDoor.open({ base: '', onDone: function () { try { tbPaint(); } catch (e) {} } }); window.__CREW_DOOR = (window.__CREW_DOOR | 0) + 1; } catch (e) {} };
    if (window.BohemiaCrewDoor) return go();
    try { var sc = document.createElement('script'); sc.src = '../engine/bohemia_crew_door.js'; sc.onload = go; document.head.appendChild(sc); } catch (e) {}
  }
  function topBar() {
    var bar = document.getElementById('menubar'); if (!bar || !document.getElementById('barread')) return false;
    if (document.getElementById('bmtb')) return true;
    dressMapBar();
    var R = document.documentElement.style;
    if (!R.getPropertyValue('--bm-cardboard-dk')) { R.setProperty('--bm-cardboard-dk', 'url(' + tbDark(cardboard(), 0.5).toDataURL('image/png') + ')');
      R.setProperty('--bm-glass-dk', 'url(' + tbDark(glass(), 0.45).toDataURL('image/png') + ')'); }
    TB.man = tbDots(TB_MAN, 2, { a: '#3a2e20', b: '#1f1710' }); TB.gear = tbDots(TB_GEAR, 2, { a: '#3a2e20', b: '#1f1710' });
    style('bm-topbar', TOPBAR_CSS);
    var root = document.createElement('div'); root.id = 'bmtb';
    var r1 = document.createElement('div'); r1.className = 'r r1';
    r1.innerHTML = '<span class="t day" data-tb="day" data-f="day"></span><span class="t crew" data-tb="crew" data-f="crew"></span><span class="sp"></span>'
      + '<span class="t gear" role="button" tabindex="0" aria-label="settings" data-f="gear"><img alt="" width="20" height="20" style="width:20px;height:20px" src="' + TB.gear + '"></span>';
    /* what the right end already carried and still shows (NOTES on the demo; the workshop's chips too), moved, never cloned */
    var right = document.getElementById('barright');
    if (right) [].slice.call(right.children).forEach(function (n) { if (n.offsetWidth > 0) { if (n.id !== 'notebtn') n.classList.add('x'); r1.appendChild(n); } });
    var r2 = document.createElement('div'); r2.className = 'r r2';
    r2.innerHTML = '<div class="g" data-tb="g"></div>';
    root.appendChild(r1); root.appendChild(r2);
    bar.classList.add('bmtb'); bar.appendChild(root);
    /* the days on hold (rule 151(a)): a finger held on the batteries' pane shows the nights, let go and they go; a mouse
       shows them while it hovers (no focus hook: a phone focuses after the finger lifts, and the nights would stick) */
    var gp = r2.querySelector('.g'), hold = function (on) { if (gp.classList.contains('held') !== on) { gp.classList.toggle('held', on); TB.held = on; } };
    gp.setAttribute('aria-label', 'your batteries; hold for the nights they feed the crew');
    gp.addEventListener('pointerdown', function (e) { e.stopPropagation(); hold(true); });
    ['pointerup', 'pointercancel'].forEach(function (k) { gp.addEventListener(k, function (e) { if (e.pointerType !== 'mouse') hold(false); }); });
    gp.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hold(true); });
    gp.addEventListener('pointerleave', function () { hold(false); });
    gp.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    var ct = r1.querySelector('.crew'); ct.setAttribute('role', 'button'); ct.setAttribute('tabindex', '0'); ct.setAttribute('aria-label', 'your company');
    ct.addEventListener('click', function (e) { e.stopPropagation(); crewDoor(); });
    r1.querySelector('.gear').addEventListener('click', function (e) { e.stopPropagation();
      try { var sg = window.parent.document.getElementById('gearbtn'); if (sg) sg.click(); } catch (_e) {} });
    tbPaint(); TB.built = true;
    try { window.dispatchEvent(new Event('resize')); } catch (_e) {}
    setInterval(function () { try { tbPaint(); } catch (_e) {} }, 500);
    return true;
  }
  /* the fight: the strip across the top goes, its three things ride the bottom bar's top edge */
  var FIGHT_NOTOP_CSS = ''
    + 'html body #top{display:none!important}'
    + '#bmturnrow{display:flex;align-items:center;gap:6px;height:44px;margin:-4px 0 8px;flex:0 0 auto}'
    + 'html body #bmturnrow #round{transform:none;box-shadow:0 1px 0 #000;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:normal;letter-spacing:.8px;font-size:12px;padding:0 9px;height:44px;line-height:44px;box-sizing:border-box;background:#e2dac6 var(--bm-receipt) center/100% 100%}'
    + 'html body #bmturnrow #order{flex:1 1 auto;height:44px;padding:0 4px;background:transparent}'
    + 'html body #bmturnrow #order canvas{width:36px!important;height:36px!important;border-radius:0;box-shadow:0 0 0 1px #0d0a07}'
    /* AUTO keeps the fight's own tag (paper with a hard one-pixel edge, its printed mark, read from the left); it only stands straight */
    + 'html body #bmturnrow #bauto{transform:none;margin:0;min-height:44px}'
    /* on its side, a tablet, a computer: the one-row bar keeps its whole width for the skills (the hit read widens STRIKE to
       96), so the turn row takes its own line along the bar's top edge, still nothing over the board */
    + 'html[data-screen=phone_landscape] #bot,html[data-screen=tablet] #bot,html[data-screen=computer] #bot{flex-wrap:wrap;row-gap:4px}'
    + 'html[data-screen=phone_landscape] #bmturnrow,html[data-screen=tablet] #bmturnrow,html[data-screen=computer] #bmturnrow{order:0;margin:0;flex:0 0 100%;min-width:0}'
    /* and the line's free middle is where the fight's hint goes on a wide glass (its placeSay() reads the room between the
       faces and AUTO): the faces keep their own width, AUTO the far end, the hint drawn over the bar's cardboard */
    + 'html[data-screen=phone_landscape] #bmturnrow #order,html[data-screen=tablet] #bmturnrow #order,html[data-screen=computer] #bmturnrow #order{flex:0 1 auto}'
    + 'html[data-screen=phone_landscape] #bmturnrow #bauto,html[data-screen=tablet] #bmturnrow #bauto,html[data-screen=computer] #bmturnrow #bauto{margin-left:auto}'
    + 'html body #say.instrip{z-index:5}';
  function fightNoTop() {
    var top = document.getElementById('top'), bot = document.getElementById('bot');
    if (!top || !bot || !document.getElementById('bauto') || !document.getElementById('order')) return false;
    if (document.getElementById('bmturnrow')) return true;
    rootVars(); style('bm-fight-notop', FIGHT_NOTOP_CSS);
    var row = document.createElement('div'); row.id = 'bmturnrow';
    ['round', 'order', 'bauto'].forEach(function (id) { var e = document.getElementById(id); if (e) row.appendChild(e); });
    bot.insertBefore(row, bot.firstChild);
    try { window.dispatchEvent(new Event('resize')); } catch (_e) {}
    return true;
  }
  /* THE PHONE'S LOOK (UI [the phone's look], rule 67a, 10/9): the cracked iPhone on the map in the bar's hand.
     The object is his (9/23 a cracked iPhone, 9/27 one crack, his A) and stays: the rail, the chips, the island,
     the one fracture, no tape. What changes is what it shares with the bar: the game's faces (CASING stamps the
     handles and the hour, ROM prints the posts), ink that passes the sun test on every post, a hard contact edge
     instead of the soft glow (71's drop shadow), and the family faces as cardboard cards from the same board as
     the bar, the one you are lit in the bar's amber, every one 44 points. 44 points for three faces needs 132 of
     glass, so the phone is 156 wide (still 19.5 by 9); a skin that sets its own width still wins. */
  var PHONE_CSS = ''
    + 'html body #cityfeed{--skin-phonew:156px;box-shadow:0 2px 0 #000,inset 0 1px 0 var(--skin-casetop,rgba(240,232,208,.34)),inset 0 -2px 3px rgba(0,0,0,.55)}'
    + 'html body #cityfeed.ring{box-shadow:0 0 0 2px rgba(216,180,90,.9),0 3px 0 #000,inset 0 1px 0 var(--skin-casetop,rgba(240,232,208,.34)),inset 0 -2px 3px rgba(0,0,0,.55)}'
    /* the status row: the hour stamped, the signal and the battery bright enough for the sun */
    + 'html body #cityfeedbar{color:#e2d3ab;border-bottom-color:#2e261a}'
    + 'html body #cityfeedclock{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:9px;letter-spacing:.5px;color:#eadcb4}'
    + 'html body #cityfeedsig{color:#c4b690}'
    + 'html body #cityfeedbatt{--skin-batt:#c4b690}'
    /* the posts: the handle stamped in CASING, the words printed in ROM, every ink 4.5 to 1 in the sun */
    + 'html body #cityfeed .fp .who{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:9px;letter-spacing:.5px;color:#ead08e}'
    + 'html body #cityfeed .fp.mine .who{color:#a8f0e2} html body #cityfeed .fp.world .who{color:#f0c47e}'
    + 'html body #cityfeed .fp .txt{font-family:"BohemiaROM",ui-monospace,monospace;color:#ddd2b6}'
    /* the family: cardboard cards, read from the left, the one you are lit amber, 44 points each */
    + 'html body #actflip{gap:3px;padding:4px 5px 5px}'
    + 'html body #actflip .af{min-width:44px;min-height:44px;box-sizing:border-box;border:0;border-radius:2px;padding:3px 2px 4px;'
    +   'background:linear-gradient(rgba(12,8,4,.25),rgba(12,8,4,.25)),#3a2c1e var(--bm-cardboard) 0 0/128px 128px;'
    +   'box-shadow:inset 0 1px 0 rgba(255,220,170,.22),inset 0 -2px 0 rgba(0,0,0,.45),0 1px 0 #000}'
    + 'html body #actflip .af .afn{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:8px;letter-spacing:.3px;line-height:1.1;color:#f2e4c6}'
    + 'html body #actflip .af .afy{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:7px;letter-spacing:.4px;color:#e0c890;opacity:1}'
    + 'html body #actflip .af.now{background:linear-gradient(#f4cf7c,#d9a650);border:0;box-shadow:inset 0 1px 0 rgba(255,240,200,.6),inset 0 -2px 0 rgba(70,40,10,.55),0 1px 0 #000}'
    + 'html body #actflip .af.now .afn{color:#120c06} html body #actflip .af.now .afy{color:#3a2208}'
    + 'html body #actflip .af canvas{border-radius:0;box-shadow:0 0 0 1px #0d0a07}'
    /* THE RESHUFFLE (UI [glass face]): the '?' that stood in for an arrow becomes the drawn ring on a pane of glass, a strip
       of its own under the face, 24 points tall and the card's width, so it never sits on the face and the flip keeps
       the whole card above it (44 points and more). The '?' stays in the page for a screen reader, painted at nothing */
    + 'html body #actflip .af:has(.afr){padding-bottom:31px}'
    + 'html body #actflip .af .afr{top:auto;left:3px;right:3px;bottom:3px;width:auto;height:24px;box-sizing:border-box;border:1px solid #0d0a07;border-radius:2px;'
    +   'font-size:0;color:transparent;background:#16130f var(--bm-glass) center/cover;box-shadow:inset 0 1px 0 rgba(255,236,200,.18)}'
    /* THE ARROW DIED (Paolo 10/10, the seventh votes: 'hell no'): the strip says the word, stamped, AGAIN */
    + 'html body #actflip .af .afr::before{content:"AGAIN";display:block;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:9px;letter-spacing:.8px;line-height:1;color:#f2e4c6}'
    + 'html body #actflip .af .afr:active{background:linear-gradient(#f4cf7c,#d9a650)}'
    /* one of you so far: the card reads from the left, the face then the name, never a label centred in a box (71) */
    + 'html body #actflip .af:only-child{display:grid;grid-template-columns:28px auto;grid-template-rows:auto auto;column-gap:8px;row-gap:2px;'
    +   'justify-content:start;justify-items:start;align-content:center;padding:4px 8px}'
    + 'html body #actflip .af:only-child canvas{grid-row:1/3;grid-column:1} html body #actflip .af:only-child .afn{font-size:10px;align-self:end}'
    + 'html body #actflip .af:only-child .afy{font-size:8px;align-self:start}'
    /* the customize row's buttons are pressed too: 44 points, cardboard, the picked one amber */
    + 'html body #actedit .aeb{height:44px;border:0;border-radius:2px;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;color:#f2e4c6;'
    +   'background:linear-gradient(rgba(12,8,4,.25),rgba(12,8,4,.25)),#3a2c1e var(--bm-cardboard) 0 0/128px 128px;box-shadow:inset 0 1px 0 rgba(255,220,170,.22),0 1px 0 #000}'
    + 'html body #actedit .aeb.on{color:#120c06;background:linear-gradient(#f4cf7c,#d9a650)}'
    /* THE PHONE SHOWS TWO JOBS (UI [the phone shows two jobs], rule 148, Paolo 10/24: 'the phone really should only be
       displaying the top two jobs, the two highest paying jobs in the whole Bohemia city, and it doesn't need to display so
       much information, it's overkill with the amount of text you put on the phone'). The face is the hour and two cards;
       the chat stream (#cityfeedlist, still fed underneath for whoever reads it) is off the glass. A card is a thumb's 44
       points: the short what printed (ROM, one line), under it the stars (146(e)'s 7-point star), the pay beside the bar's
       own battery mark and the place stamped (CASING) at the right. The one marked for the map is lit amber like the speed
       you are at, shows the job's full words and the one touch that goes, and beats with the road. */
    + 'html body #cityfeed #cityfeedlist,html body #cityfeed #cityfeedfade{display:none!important}'
    /* A SMALL LIST IS A SMALL PHONE (UI [eyes: the empty phone], rule 150, EYES 10/24 item 20: on 10/24m the two jobs sat
       at the top of a full 19.5 by 9 slab and the bottom two thirds was black glass over a third of the map). The closed
       phone is as tall as what it holds: the hour and the jobs, the rail and the crack drawn round them; a picked job's
       longer words grow it, and it never grows past the handset's 19.5 by 9. Under the jobs is the phone's home strip, a thumb's
       48 points with the home bar drawn on it: the one place on the face that opens the phone (a job card marks the road). */
    + 'html body #cityfeed{height:auto;max-height:calc(var(--skin-phonew,132px) * 19.5 / 9)}'
    + 'html body #cityfeedscreen::after{content:"";flex:0 0 48px;order:99;background:linear-gradient(#c4b690,#c4b690) center 36px/40px 3px no-repeat}'
    + 'html body #bmboard{flex:0 0 auto;position:relative;z-index:1;padding:6px 5px 3px}'
    + 'html body #bmboard .fp.job{display:flex;flex-direction:column;justify-content:center;gap:4px;margin:0 0 5px;padding:6px 6px 6px 7px;min-height:44px;box-sizing:border-box;cursor:pointer;pointer-events:auto;-webkit-tap-highlight-color:transparent;'
    +   'border-radius:2px;background:rgba(240,196,126,.08);box-shadow:inset 2px 0 0 #f0c47e}'
    + 'html body #bmboard .fp.job .txt{margin:0;line-height:1.15;white-space:nowrap;overflow:hidden}'
    + 'html body #bmboard .fp.job .meta{display:flex;align-items:center;gap:6px;margin:0;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:9px;letter-spacing:.5px;line-height:1;color:#eadcb4;white-space:nowrap}'
    + 'html body #bmboard .fp.job .meta .bmstars{line-height:1}'
    + 'html body #bmboard .fp.job .meta .bmstar{vertical-align:top}'
    + 'html body #bmboard .fp.job .meta .pay{display:inline-flex;align-items:center;gap:2px;color:#f4e2b4}'
    + 'html body #bmboard .fp.job .meta .batt{width:10px;height:10px;image-rendering:pixelated;display:block}'
    + 'html body #bmboard .fp.job .meta .at{margin-left:auto;color:#f0c47e;overflow:hidden}'
    + 'html body #bmboard .fp.job.picked{background:#e8bb62;box-shadow:inset 0 1px 0 #ffe2a0,inset 0 -2px 0 #8a5a1c;outline:2px solid transparent;outline-offset:1px;animation:bm-roadbeat 500ms steps(1,end) infinite}'
    + 'html body #bmboard .fp.job.picked .txt{white-space:normal;line-height:1.3}'
    /* UI [the ten changes], change 2: the picked card beats with the road's dots (its delay set on the map's clock) and says the next touch */
    + '@keyframes bm-roadbeat{0%{outline-color:#f0b44c}50%{outline-color:transparent}}'
    + 'html body #bmboard .fp.job .go{padding:3px 4px 4px;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:9px;letter-spacing:.5px;line-height:1.2;color:#f2e4c6;background:#1f1710;box-shadow:0 1px 0 #000}'
    + 'html body #bmboard .fp.job.picked .txt,html body #bmboard .fp.job.picked .meta,html body #bmboard .fp.job.picked .meta .pay,html body #bmboard .fp.job.picked .meta .at{color:#120c06}'
    /* WHEN THE PHONE TURNS (UI [landscape], rule 50b, his Pocket City 2 shot 06): the same buttons re-laid to the corners.
       The bar stays across the top, the speed pad keeps the bottom right (the big action's corner), and the phone, which
       carries the family's faces, goes to the LEFT, where Pocket City keeps its face: from under the bar (its box starts at the bar's foot) to the foot of the
       glass. 390 points of height hold a phone 150 wide at 19.5 by 9 (325 tall); the face row tightens so three faces
       stay 44 points. One class of screen (a phone on its side: landscape, under 500 tall); portrait is untouched. */
    /* THE FLIP OFF THE FACE (UI [the flip off the face], Paolo's eleventh votes: 'you click the phone and it's in the
       menu; it will never be on the UI display of the phone itself'): the family's strip never shows on the phone's face;
       after the first crisis (rule 85) the opened phone's bar carries one entry, SWITCH TIMELINE, and the same strip opens
       under it; before the crisis the entry does not exist. DYNASTY's strip and its flip are used as they are. */
    + 'html body #cityfeedscreen > #actflip{display:none!important}'
    + 'html body #bmtimes{min-height:44px;margin:0 8px 0 auto;padding:0 12px;border:0;border-radius:0;color:#1f1710;background:#e2dac6 var(--bm-receipt) center/100% 100%;'
    +   'filter:drop-shadow(0 1px 0 rgba(0,0,0,.85));font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:11px;letter-spacing:.8px;text-align:left;cursor:pointer}'
    + 'html body #bmtimes.on{color:#120c06;background:linear-gradient(#f4cf7c,#d9a650);filter:none;box-shadow:inset 0 1px 0 rgba(255,240,200,.6),inset 0 -2px 0 rgba(70,40,10,.55)}'
    + 'html body #bmtimespanel{flex:0 0 auto;display:none;padding:10px 10px 12px;background:linear-gradient(rgba(12,8,4,.32),rgba(12,8,4,.32)),#3a2c1e var(--bm-cardboard) 0 0/192px 192px;box-shadow:0 2px 0 #000}'
    + 'html body #bmtimespanel.on{display:block}'
    + 'html body #bmtimespanel .bmth{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:11px;letter-spacing:.8px;color:#eadcb4;margin:0 0 8px}'
    + 'html body #bmtimespanel #actflip{display:flex!important;justify-content:flex-start;align-items:flex-start;gap:6px;border:0;padding:0}'
    + 'html body #bmtimespanel #actflip .af{flex:0 0 96px;width:96px;max-width:96px}'   /* the cards keep a card's width, not the glass's */
    + 'html body #bmtimespanel #actflip .af:has(.afr){padding-bottom:51px}'   /* the opened phone makes every press 44 tall, AGAIN too: the card makes room under the name */
    + 'html body #phonebar{padding-left:60px}'   /* the shell's gear sits over the bar's left end (8..52) */
    /* NO BANDS AT ANY WIDTH (UI [the sideways sides]): the column's 640 cap and its 6 points of padding made a flat strip of
       the page's brown-grey down each side, 6 points upright, 102 on its side, more on a tablet. The map goes to the glass
       at every width, the way Battle Brothers' map fills the screen; the bar runs the whole width with it. */
    + 'html body .wrap:has(#stage){max-width:none;padding:0}'
    + 'html body .wrap:has(#stage) #menubar{margin:0}'   /* it pulled itself out over the 6 points of padding that is gone */
    + '@media (orientation:landscape) and (max-height:500px){'
    /* AND NO BANDS (UI [the sideways sides], Paolo 10/10 on the sideways map: 'what's up with the brown-grey sides, man'):
       the city's column was capped at 640 with 6 points of padding, so on a phone on its side two flat bands of the
       page's brown-grey framed the map. The map goes to the glass, edge to edge, the way Battle Brothers' map fills the
       screen at any width; the bar runs the whole width with it. The phone moves right of the shell's gear (8..52). */
    +   'html body #cityfeed{--skin-phonew:150px;left:58px!important;right:auto!important;top:4px!important}'
    +   'html body #actflip{gap:2px;padding:4px 2px 5px}'
    + '}';
  /* THE ROSTER AND THE POSTS (UI [the roster and the posts look], 10/10; Paolo 10/10: 'THIS UI IS ASS', 'the UI is so dog
     shit I can't even judge this'). RUN TWO's company screen (BOHEMIA_ROSTER_SCREEN.html) and the settlement's hire cards in
     the materials, their files untouched: the bar a strip of the cut cardboard, DONE a receipt tag; the line's cells cracked
     glass, a man stood on a cardboard backing with his name on a receipt tab; HIS PAGE a taped cardboard card (Battle
     Brothers' man page: the portrait, the story, the stats with stars, the gear, the perks), the stats printed on a receipt
     with the stars drawn; the gear and the bag as glass and cardboard pockets wearing the item icons; the level-up pick lit
     amber like the speed you are at, the perks as receipt tags; the hire cards the same card. The game's two faces, every
     word left-read, every pressed thing 44 points. */
  var CARD_BG = 'linear-gradient(rgba(12,8,4,.32),rgba(12,8,4,.32)),#3a2c1e var(--bm-cardboard) 0 0/192px 192px';
  var ROSTER_CSS = FACES
    + 'html[data-bm-roster] body{font-family:"BohemiaROM",ui-monospace,monospace;background:#120e0a}'
    + 'html[data-bm-roster] #bar{background:var(--bm-cardedge-up) bottom left/252px 10px repeat-x,' + CARD_BG + ';border-bottom:0;box-shadow:0 1px 0 #000;padding-bottom:14px}'
    + 'html[data-bm-roster] #bar .t{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;letter-spacing:.8px;font-size:15px;color:#f2e4c6}'
    + 'html[data-bm-roster] #done{border:0;border-radius:0;color:#1f1710;background:#e2dac6 var(--bm-receipt) center/100% 100%;filter:drop-shadow(0 1px 0 rgba(0,0,0,.85));'
    +   'font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;letter-spacing:.8px;text-align:left;padding:0 12px}'
    + 'html[data-bm-roster] .h,html[data-bm-roster] .ln{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:.6px;color:#e2d3ab}'
    + 'html[data-bm-roster] .cell{border:1px solid #0d0a07;border-radius:2px;background:#16130f var(--bm-glass) center/cover;box-shadow:inset 0 1px 0 rgba(255,236,200,.12)}'
    + 'html[data-bm-roster] .cell.full{background:' + CARD_BG + ';border-color:#0d0a07;box-shadow:inset 0 1px 0 rgba(255,220,170,.22),inset 0 -2px 0 rgba(0,0,0,.45),0 1px 0 #000}'
    + 'html[data-bm-roster] .cell.sel{border-color:#0d0a07;outline:2px solid #f4cf7c;outline-offset:-1px}'
    + 'html[data-bm-roster] .cell.over{outline:2px dashed #f4cf7c}'
    + 'html[data-bm-roster] .cell b{left:2px;right:2px;bottom:2px;padding:1px 2px;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;font-size:8px;letter-spacing:.3px;'
    +   'text-align:left;color:#1f1710;background:#e2dac6 var(--bm-receipt) center/100% 100%;text-shadow:none;white-space:nowrap;overflow:hidden}'
    /* his page */
    + 'html[data-bm-roster] #card{position:relative;border:0;border-radius:2px;padding:14px 12px 12px;background:' + CARD_BG + ';box-shadow:inset 0 1px 0 rgba(255,220,170,.22),inset 0 -2px 0 rgba(0,0,0,.45),0 2px 0 #000}'
    + 'html[data-bm-roster] #card::before{content:"";position:absolute;top:-6px;left:50%;width:64px;height:14px;margin-left:-32px;background:var(--bm-tape) center/100% 100%;transform:rotate(-2deg);pointer-events:none}'
    + 'html[data-bm-roster] .face{border:1px solid #0d0a07;border-radius:0;box-shadow:0 0 0 2px #16130f,0 2px 0 2px #000;background:#0b0907}'
    + 'html[data-bm-roster] .nm{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;letter-spacing:.8px;font-size:15px;color:#f4cf7c}'
    + 'html[data-bm-roster] .sub{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:.5px;color:#eadcb4}'
    + 'html[data-bm-roster] .pain{font-style:normal;color:#f0e4c8;font-family:"BohemiaROM",ui-monospace,monospace}'
    + 'html[data-bm-roster] .xpbar{height:8px;border:1px solid #0d0a07;border-radius:0;background:#16130f var(--bm-glass) center/cover}'
    + 'html[data-bm-roster] .xpbar i{background:linear-gradient(#f4cf7c,#d9a650)}'
    + 'html[data-bm-roster] .stats{padding:9px 10px 14px;color:#1f1710;background:#e2dac6 var(--bm-receipt) center/100% 100%;filter:drop-shadow(0 1px 0 rgba(0,0,0,.85));gap:3px 14px}'
    + 'html[data-bm-roster] .stats div{border-bottom:1px dotted rgba(42,34,26,.35);align-items:center}'
    + 'html[data-bm-roster] .stats div>span:first-child{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:.4px}'
    + 'html[data-bm-roster] .stats .stars,html[data-bm-roster] .stats .bmstars{display:inline;margin-left:3px;letter-spacing:0;vertical-align:baseline}'
    + 'html[data-bm-roster] .stats .stars .bmstar:first-child{margin-left:0}'
    + 'html[data-bm-roster] .gain{color:#1d5a12;font-family:"BohemiaCasing",ui-sans-serif,sans-serif}'
    + 'html[data-bm-roster] .gslot{border:1px solid #0d0a07;border-radius:2px;background:#16130f var(--bm-glass) center/cover;box-shadow:inset 0 1px 0 rgba(255,236,200,.12);color:#f2e4c6;text-align:left;padding:4px;min-height:64px}'
    + 'html[data-bm-roster] .gslot.full{background:linear-gradient(rgba(12,8,4,.45),rgba(12,8,4,.45)),#16130f var(--bm-glass) center/cover}'
    + 'html[data-bm-roster] .gslot i{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;color:#e2d3ab;letter-spacing:.4px}'
    + 'html[data-bm-roster] .gslot .bm-icon{display:block;margin:2px 0}'
    + 'html[data-bm-roster] .gslot.over,html[data-bm-roster] .slot.over{outline:2px dashed #f4cf7c}'
    + 'html[data-bm-roster] .perks{font-family:"BohemiaROM",ui-monospace,monospace;color:#eadcb4}'
    /* climbing: the pick lit amber, the perks receipt tags */
    + 'html[data-bm-roster] .pick{border:0;border-radius:2px;color:#120c06;background:linear-gradient(#f4cf7c,#d9a650);box-shadow:inset 0 1px 0 rgba(255,240,200,.6),inset 0 -2px 0 rgba(70,40,10,.55),0 1px 0 #000;'
    +   'font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;letter-spacing:.8px;text-align:left;padding:0 12px}'
    + 'html[data-bm-roster] .plist button{border:0;border-radius:0;color:#1f1710;background:#e2dac6 var(--bm-receipt) center/100% 100%;filter:drop-shadow(0 1px 0 rgba(0,0,0,.85));'
    +   'font-family:"BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:.4px;padding:6px 8px 8px}'
    + 'html[data-bm-roster] .plist button i{font-family:"BohemiaROM",ui-monospace,monospace;color:#3e1608;letter-spacing:0}'
    + 'html[data-bm-roster] #said{font-family:"BohemiaROM",ui-monospace,monospace;color:#eadcb4}'
    + 'html[data-bm-roster] #bag .slot{border:1px solid #0d0a07;border-radius:2px;background:#16130f var(--bm-glass) center/cover;box-shadow:inset 0 1px 0 rgba(255,236,200,.12);color:#f0e2c4;font-family:"BohemiaROM",ui-monospace,monospace}'
    + 'html[data-bm-roster] #bag .slot.full{background:' + CARD_BG + '}'
    + 'html[data-bm-roster] #ghost{border:0;border-radius:0;color:#1f1710;background:#e2dac6 var(--bm-receipt) center/100% 100%;font-family:"BohemiaCasing",ui-sans-serif,sans-serif}'
    + 'html[data-bm-roster] #done:active,html[data-bm-roster] .plist button:active{filter:none;transform:translateY(1px)}'
    /* the drawn stars, wherever a star was typed */
    + '.bmstar{display:inline-block;width:7px;height:7px;margin-left:1px;background:var(--bm-mark-star) 0 0/7px 7px no-repeat;image-rendering:pixelated;vertical-align:baseline}'
    + 'html[data-bm-roster] .stats .bmstar,#sheet .hstats .bmstar{background-image:var(--bm-mark-star-ink)}'
    /* THE SCREENS PAST THE PHONE (UI [the screens past the phone], rule 62's four classes, 10/22): from 700 wide (a phone on
       its side, a tablet) up to where the screen's own laptop rule takes over at 1100, the company screen stops being the
       phone's column stretched: Battle Brothers' way, the line and who wears what on the left, his page and the bag beside
       it on the right, held in view while the left scrolls */
    + '@media (min-width:700px) and (max-width:1099px){'
    +   'html[data-bm-roster] #cols{display:grid;grid-template-columns:minmax(0,1fr) 320px;column-gap:12px;align-items:start}'
    +   'html[data-bm-roster] #right{position:sticky;top:64px}'
    +   'html[data-bm-roster] #bag{grid-template-columns:repeat(5,minmax(44px,56px));justify-content:start}}';
  /* the hire cards at the settlement's hall (RUN TWO's .hire): the same card as a man's page */
  var HIRE_CSS = ''
    + 'html body #sheet .hire{position:relative;border:0;border-radius:2px;padding:12px 8px 8px;margin-top:12px;background:' + CARD_BG + ';box-shadow:inset 0 1px 0 rgba(255,220,170,.22),inset 0 -2px 0 rgba(0,0,0,.45),0 2px 0 #000}'
    + 'html body #sheet .hire::before{content:"";position:absolute;top:-6px;left:50%;width:56px;height:14px;margin-left:-28px;background:var(--bm-tape) center/100% 100%;transform:rotate(2deg);pointer-events:none}'
    + 'html body #sheet .hire .face{border:1px solid #0d0a07;border-radius:0;box-shadow:0 0 0 2px #16130f,0 2px 0 2px #000}'
    + 'html body #sheet .hire .nm{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;letter-spacing:.8px;font-size:12px;color:#f4cf7c}'
    + 'html body #sheet .hire .hstats{margin-top:6px;padding:6px 8px 10px;color:#1f1710;background:#e2dac6 var(--bm-receipt) center/100% 100%;filter:drop-shadow(0 1px 0 rgba(0,0,0,.85));'
    +   'font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:10px;letter-spacing:.4px}'   /* the stamped face: the dot face thins to grey at 10 points */
    + 'html body #sheet .hire .hstats span{color:#1f1710;display:inline-flex;align-items:baseline;gap:0;white-space:nowrap}'
    + '.bmstar{display:inline-block;width:7px;height:7px;margin-left:1px;background:var(--bm-mark-star) 0 0/7px 7px no-repeat;image-rendering:pixelated;vertical-align:baseline}'
    + 'html body #sheet .hire .hstats .bmstar{background-image:var(--bm-mark-star-ink)}'
    + 'html body #sheet .hire .hstats .bmstar:first-of-type{margin-left:3px}';   /* __THE_STARS_SIT_WITH_THE_WORDS__: a point of air after the number */
  /* every typed star becomes a drawn one: the text node is split, the star count kept for a screen reader */
  function drawStars(root) {
    if (!root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), hits = [], n;
    while ((n = w.nextNode())) if (n.nodeValue.indexOf('★') >= 0) hits.push(n);
    hits.forEach(function (t) {
      var par = t.parentNode, txt = t.nodeValue, k = (txt.match(/★/g) || []).length;
      if (par && par.setAttribute && !par.getAttribute('aria-label')) par.setAttribute('aria-label', (par.textContent || '').replace(/★/g, '').trim() + (k ? ', ' + k + ' star' + (k > 1 ? 's' : '') : ''));
      var frag = document.createDocumentFragment(), parts = txt.split('★');
      parts.forEach(function (p, i) { if (p) frag.appendChild(document.createTextNode(p)); if (i < parts.length - 1) { var s = document.createElement('i'); s.className = 'bmstar'; s.setAttribute('aria-hidden', 'true'); frag.appendChild(s); } });
      par.replaceChild(frag, t);
    });
  }
  function starVars() {
    var R = document.documentElement.style;
    if (!R.getPropertyValue('--bm-mark-star')) { R.setProperty('--bm-mark-star', 'url(' + starCap('#f4cf7c').toDataURL('image/png') + ')');   /* __THE_STARS_SIT_WITH_THE_WORDS__ */
      R.setProperty('--bm-mark-star-ink', 'url(' + starCap('#3e1608').toDataURL('image/png') + ')'); }
  }
  function dressRoster() {
    if (!document.getElementById('lines') || !document.getElementById('card') || !document.getElementById('bag')) return false;
    rootVars(); starVars();
    if (!document.documentElement.style.getPropertyValue('--bm-cardedge-up')) {
      var e = cardedge(), f = document.createElement('canvas'); f.width = e.width; f.height = e.height; var fg = f.getContext('2d');
      fg.translate(0, e.height); fg.scale(1, -1); fg.drawImage(e, 0, 0);
      document.documentElement.style.setProperty('--bm-cardedge-up', 'url(' + f.toDataURL('image/png') + ')');
    }
    document.documentElement.setAttribute('data-bm-roster', '');
    style('bm-roster', ROSTER_CSS);
    var busy = false, paint = function () {
      if (busy) return; busy = true;
      try {
        drawStars(document.getElementById('card'));
        var RS = window.BohemiaRosterScreen && BohemiaRosterScreen.state, m = RS && RS.crew && RS.crew[RS.sel];
        /* his gear wears its icons, the bag its icons, by the screen's own state (slot and position) */
        if (m) Array.prototype.forEach.call(document.querySelectorAll('#card .gslot'), function (g) {
          var it = m.gear && m.gear[g.dataset.slot], old = g.querySelector('.bm-icon');
          if (!it) { if (old) old.remove(); return; }
          if (old && old.dataset.id === it.id) return; if (old) old.remove();
          var ic = itemIcon(it, 30); ic.dataset.id = it.id; var lab = g.querySelector('i'); g.insertBefore(ic, lab ? lab.nextSibling : g.firstChild);
        });
        if (RS) Array.prototype.forEach.call(document.querySelectorAll('#bag .slot'), function (b, i) {
          var it = RS.bag && RS.bag[i], old = b.querySelector('.bm-icon');
          if (!it) { if (old) old.remove(); return; }
          if (old && old.dataset.id === it.id) return; if (old) old.remove();
          var gi = b.querySelector('i'); if (gi) gi.style.display = 'none';
          var ic = itemIcon(it, 30); ic.dataset.id = it.id; b.insertBefore(ic, b.firstChild);
        });
      } catch (e) {}
      busy = false;
    };
    try { new MutationObserver(paint).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    paint();
    try { document.fonts.load('15px "BohemiaCasing"'); document.fonts.load('11px "BohemiaROM"'); } catch (e) {}
    return true;
  }
  function dressPosts() {
    var body = document.getElementById('sbody'); if (!body) return false;
    rootVars(); starVars(); style('bm-hire', HIRE_CSS);
    var busy = false, paint = function () { if (busy) return; busy = true; try { drawStars(body); } catch (e) {} busy = false; };
    try { new MutationObserver(paint).observe(body, { childList: true, subtree: true }); } catch (e) {}
    paint(); return true;
  }
  /* the entry exists only after the first crisis; the strip moves into its panel the first time it is opened */
  function flipOffTheFace() {
    var bar = document.getElementById('phonebar'), wrap = document.getElementById('phonewrap'), box = document.getElementById('actflip');
    var face = document.getElementById('cityfeedscreen'), btn = document.getElementById('bmtimes'), panel = document.getElementById('bmtimespanel');
    if (!bar || !wrap) return;
    var open = false; try { open = !!(window.BohemiaActs && BohemiaActs.crisisStarted()); } catch (e) {}
    if (!open) {
      if (btn) btn.remove();
      if (panel) { if (box && box.parentNode === panel && face) face.insertBefore(box, document.getElementById('cityfeedfade')); panel.remove(); }
      return;
    }
    if (!panel) {
      panel = document.createElement('div'); panel.id = 'bmtimespanel'; panel.setAttribute('role', 'group'); panel.setAttribute('aria-label', 'switch timeline');
      var h = document.createElement('div'); h.className = 'bmth'; h.textContent = 'WHO YOU ARE, AND WHEN';   /* draft:true */
      panel.appendChild(h); bar.parentNode.insertBefore(panel, bar.nextSibling);
    }
    if (!btn) {
      btn = document.createElement('button'); btn.id = 'bmtimes'; btn.type = 'button'; btn.textContent = 'SWITCH TIMELINE';   /* draft:true */
      var close = document.getElementById('phoneclose'); bar.insertBefore(btn, close || null);
      btn.addEventListener('click', function (ev) {
        try { ev.stopPropagation(); } catch (e) {}
        var on = !panel.classList.contains('on'), bx = document.getElementById('actflip');
        if (on && bx && bx.parentNode !== panel) panel.appendChild(bx);
        panel.classList.toggle('on', on); btn.classList.toggle('on', on);
        try { if (on && typeof ctActFlipPaint === 'function') ctActFlipPaint(); } catch (e) {}
      });
    }
    if (!wrap.classList.contains('on') && panel.classList.contains('on')) { panel.classList.remove('on'); btn.classList.remove('on'); }   /* the phone closed */
  }
  function dressPhone() {
    if (!document.getElementById('cityfeed')) return false;
    rootVars();
    var R = document.documentElement.style;
    if (!R.getPropertyValue('--bm-mark-skull')) { R.setProperty('--bm-mark-skull', 'url(' + mark('skull', '#eadcb4').toDataURL('image/png') + ')');
      R.setProperty('--bm-mark-skull-ink', 'url(' + mark('skull', '#120c06').toDataURL('image/png') + ')'); }
    style('bm-phone', PHONE_CSS);
    if (!window.__bmFlipOff) { window.__bmFlipOff = setInterval(flipOffTheFace, 600); flipOffTheFace(); }
    /* the city sizes its map from its column when it boots, which can be before this sheet lands: a phone on its side
       then drew the old 628 and left a black band where the column grew (UI [the sideways sides]); ask it to measure again */
    try { setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 0); setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 1500); } catch (e) {}
    return true;
  }
  /* ======================================================================================================
     THE FRONT SCREEN, JUST THE FONT  (UI [the front screen, just the font], 10/18/26)
     PAOLO 10/18: 'the loading screen, the Bohemia title card, I don't want the card behind it, I just want the crazy
     font... the whole front screen looks like dog shit.' (records/BOHEMIA_PAOLO_THE_FRONT_SCREEN_JUST_THE_FONT_NO_PLATE_
     10_18_26.md; this round: records/BOHEMIA_THE_FRONT_SCREEN_JUST_THE_FONT_10_18_26.md)
     MEASURED FIRST: his wordmark is 400 x 130 and fully opaque. 46,248 of its pixels are the grey card (a value under a
     quarter or a saturation under a quarter) and 5,731 are the gold letters with their spray and drips; nothing sits
     between the two. So the card comes out by a rule, not by hand: a pixel stays when it is gold, every kept pixel is his,
     and the letters are cropped to their own ink (321 x 71), drawn at one css pixel a pixel (three on his phone), the
     same size as every pixel around them.
     THE SYSTEM: a cold dark ground everywhere; GOLD ONLY FOR WHAT MATTERS, the name, a pick that is yours and the one next
     thing (rule 117); the gold is the wordmark's own three steps lit from the top (#e6c475, #c8ab63, #a78949); the
     terminal keeps his pick's green (loads B, 9/21) with its lines from the bottom and its real bar; words in the casing
     (stamped) or the ROM (printed) at 10 or 20 css px, where their ten dots a letter land on whole phone pixels; no
     gradient, glow, blur or round corner anywhere (rule 114 D10); every word 4.5 to 1 and again in the sun (rule 73);
     nothing blinks (bible R3); sideways the picks and the terminal stand side by side instead of running off the glass.
     ON ONLY WHERE THE DOOR SAYS SO: #front[data-look="just-the-font"]. The alpha carries data-look="classic" until RUN
     flips it at the cut (rule 93); on a door that does not ask, nothing here runs and the sheet matches nothing.
     ====================================================================================================== */
  var JTF = 'just-the-font';
  function jtfOn() { var f = document.getElementById('front'); return !!(f && f.getAttribute('data-look') === JTF); }
  /* his letters with the card taken out */
  var MARK = null, MARK_WAIT = [], MARK_ASKED = false;
  function keyMark(img) {
    var w = img.naturalWidth, h = img.naturalHeight, c = canvas(w, h), g = c.getContext('2d');
    g.drawImage(img, 0, 0);
    var d = g.getImageData(0, 0, w, h), p = d.data, x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (var i = 0; i < p.length; i += 4) {
      var mx = Math.max(p[i], p[i + 1], p[i + 2]), mn = Math.min(p[i], p[i + 1], p[i + 2]);
      if (mx < 64 || (mx - mn) * 4 < mx) { p[i + 3] = 0; continue; }   /* value under a quarter, or saturation under a quarter: the card */
      p[i + 3] = 255;
      var q = i >> 2, x = q % w, y = (q - x) / w;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
    if (x1 < 0) return null;
    g.putImageData(d, 0, 0);
    var out = canvas(x1 - x0 + 1, y1 - y0 + 1);
    out.getContext('2d').drawImage(c, x0, y0, out.width, out.height, 0, 0, out.width, out.height);
    return out;
  }
  function wantMark(cb) {
    if (MARK) { cb(MARK); return; }
    MARK_WAIT.push(cb); if (MARK_ASKED) return; MARK_ASKED = true;
    var tries = 0;
    (function ask() {   /* his wordmark is a variable in the page, written a little after this file loads */
      if (typeof window.BOH_FRONT_LOGO_B64 !== 'string') { if (++tries < 400) setTimeout(ask, 25); return; }
      var im = new Image();
      im.onload = function () { MARK = keyMark(im); if (!MARK) return; var w = MARK_WAIT; MARK_WAIT = []; w.forEach(function (f) { try { f(MARK); } catch (e) {} }); };
      im.src = 'data:image/png;base64,' + window.BOH_FRONT_LOGO_B64;
    })();
  }
  /* the letters at the largest WHOLE scale that fits room() css pixels across: one on a phone, two on a tablet or a computer */
  var JTF_MARKS = [];
  function markCanvas(room) {
    var c = document.createElement('canvas'); c.className = 'jtf-mark'; c.width = 1; c.height = 1; c._room = room;
    JTF_MARKS.push(c); wantMark(function () { sizeMark(c); }); return c;
  }
  function sizeMark(c) {
    if (!MARK) return;
    if (c.width !== MARK.width || c.height !== MARK.height) {
      c.width = MARK.width; c.height = MARK.height; var g = c.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(MARK, 0, 0);
    }
    var k = Math.max(1, Math.min(4, Math.floor((c._room ? c._room() : innerWidth - 32) / MARK.width)));
    c.style.width = (MARK.width * k) + 'px'; c.style.height = (MARK.height * k) + 'px';
  }
  /* THE VALLEY AT NIGHT, AT THE LETTERS' PIXEL SIZE: one css pixel a pixel, not two (rule 114's first tell is two pixel
     sizes on one screen), and NO SMOOTH FADE ANYWHERE (bible R4: every lumen has a source). The sky is two flat values
     meeting in an ordered band; the ridges are flat silhouettes; the dead grid of the valley; ONE BLOCK STILL HAS POWER,
     its sodium lamps and their pools in two stepped rings (R1, the one wrong thing; R7, the lit street with nobody home);
     the pylons that carried the grid, plotted pixel by pixel so no line has a soft edge. Painted once (R10). */
  function groundBare(w, h) {
    var c = canvas(w, h), g = c.getContext('2d'), img = g.createImageData(w, h), D = img.data, s = 23;
    function r() { s = (s * 16807) % 2147483647; return s / 2147483647; }
    function put(x, y, k) { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= w || y >= h) return; var i = (y * w + x) * 4; D[i] = k[0]; D[i + 1] = k[1]; D[i + 2] = k[2]; D[i + 3] = 255; }
    function line(x0, y0, x1, y1, k) { var n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1); for (var i = 0; i <= n; i++) put(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, k); }
    var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    var SKY_HI = [8, 10, 14], SKY_LO = [12, 16, 22], FAR = [9, 11, 15], NEAR = [6, 7, 9], FLOOR = [5, 6, 8], GRID = [12, 14, 18],
        DUST = [17, 19, 24], POLE = [2, 2, 3], LAMP = [255, 208, 138], POOL1 = [58, 42, 20], POOL2 = [30, 23, 13];
    var wide = w > h, hz = Math.round(h * (wide ? 0.72 : 0.58)), x, y, i;
    for (i = 0; i < w * h; i++) { D[i * 4] = SKY_HI[0]; D[i * 4 + 1] = SKY_HI[1]; D[i * 4 + 2] = SKY_HI[2]; D[i * 4 + 3] = 255; }
    /* the sky's last light, low over the ridge: the lower sky meets the upper in a sixteen-step ordered band */
    var band = Math.round(h * 0.14), yb = Math.max(0, hz - 46 - band);
    for (y = yb; y < hz; y++) { var t = Math.min(16, (y - yb) / band * 16); for (x = 0; x < w; x++) if (BAYER[(y & 3) * 4 + (x & 3)] < t) put(x, y, SKY_LO); }
    /* the far ridge, then the near one, flat */
    var far = [], near = [];
    for (x = 0; x < w; x++) { far[x] = Math.round(hz - 36 - Math.sin(x / 94) * 20 - Math.sin(x / 26) * 6 - r() * 2); near[x] = Math.round(hz - 8 - Math.sin(x / 62 + 2) * 12 - r() * 2); }
    for (x = 0; x < w; x++) { for (y = far[x]; y < h; y++) put(x, y, FAR); for (y = near[x]; y < h; y++) put(x, y, NEAR); for (y = hz + 6; y < h; y++) put(x, y, FLOOR); }
    /* the valley floor: the dead grid, its streets as lines that open up toward the glass */
    for (y = hz + 16; y < h; y += 14 + Math.round((y - hz) / 9)) for (x = 0; x < w; x++) if ((x + y) % 3) put(x, y, GRID);
    for (i = 0; i < w * (h - hz) / 220; i++) { x = r() * w; y = hz + 20 + r() * (h - hz - 20); put(x, y, DUST); put(x + 1, y, DUST); }
    /* the one block with power, under the ridge and clear of the menu: sodium lamps, each pool two stepped rings */
    var bx = wide ? w * 0.18 : w * 0.64, by = hz + 14, lamps = [];
    /* a block's corners and one mid-street pole, not a grid of nine; two of the poles dead */
    [[0, 0], [30, 2], [58, -1], [4, 21], [61, 19], [27, 40], [57, 41]].forEach(function (o, n) { if (n !== 2 && n !== 5) lamps.push([Math.round(bx + o[0] + r() * 3), Math.round(by + o[1] + r() * 3)]); });
    var lit = {};
    lamps.forEach(function (L) {
      for (var yy = -14; yy <= 14; yy++) for (var xx = -16; xx <= 16; xx++) {
        var e = Math.sqrt(xx * xx + yy * yy * 1.6), px = Math.round(L[0] + xx), py = Math.round(L[1] + yy), key = px + ',' + py, b = BAYER[(py & 3) * 4 + (px & 3)];
        var lv = e <= 5 ? (b < 10 ? 2 : 1) : e <= 9 ? (b < 6 ? 2 : b < 11 ? 1 : 0) : e <= 15 ? (b < 3 ? 1 : 0) : 0;
        if (lv > (lit[key] || 0)) { lit[key] = lv; put(px, py, lv === 2 ? POOL1 : POOL2); }
      }
    });
    lamps.forEach(function (L) { put(L[0], L[1], LAMP); put(L[0] + 1, L[1], LAMP); put(L[0], L[1] + 1, LAMP); put(L[0] + 1, L[1] + 1, LAMP); });
    /* the pylons and their cables against the sky: the grid that died */
    var pyl = wide ? [[w * 0.05, hz - 10, hz * 0.20], [w * 0.36, hz - 20, hz * 0.14], [w * 0.47, hz - 16, hz * 0.09]]
                   : [[w * 0.10, hz - 12, hz * 0.26], [w * 0.46, hz - 24, hz * 0.18], [w * 0.86, hz - 18, hz * 0.12]];
    pyl.forEach(function (p) {
      var X = Math.round(p[0]), Y = Math.round(p[1]), H = p[2];
      line(X - H * 0.16, Y, X, Y - H, POLE); line(X + H * 0.16, Y, X, Y - H, POLE);
      line(X - H * 0.28, Y - H * 0.82, X + H * 0.28, Y - H * 0.82, POLE); line(X - H * 0.28, Y - H * 0.82 + 1, X + H * 0.28, Y - H * 0.82 + 1, POLE);
      line(X - H * 0.2, Y - H * 0.62, X + H * 0.2, Y - H * 0.62, POLE);
    });
    for (var j = 0; j + 1 < pyl.length; j++) [-0.28, 0.28].forEach(function (o) {
      var a = pyl[j], b2 = pyl[j + 1], ax = a[0] + a[2] * o, ay = a[1] - a[2] * 0.82, cx = b2[0] + b2[2] * o, cy = b2[1] - b2[2] * 0.82;
      var mx = (ax + cx) / 2, my = Math.max(ay, cy) + 26, n = Math.ceil(Math.abs(cx - ax) * 1.5) + 1;
      for (var k = 0; k <= n; k++) { var tt = k / n, u = 1 - tt; put(u * u * ax + 2 * u * tt * mx + tt * tt * cx, u * u * ay + 2 * u * tt * my + tt * tt * cy, POLE); }
    });
    g.putImageData(img, 0, 0);
    return c;
  }
  var JD = 'html body #front[data-look="just-the-font"]';
  var JTF_CSS = [
    /* THE DOOR: the cold ground, his letters alone where the plate was, at the height the title will put them */
    JD + '{background:#07090b;justify-content:flex-start;gap:12px;padding-top:19vh;padding-top:19dvh}',
    JD + ' #logoplate{width:auto;background:none;padding:0;-webkit-clip-path:none;clip-path:none;line-height:0}',
    JD + ' #logobig{display:none}',
    JD + ' .jtf-mark,html body .bm-start.jtf .jtf-mark{display:block;margin:0 auto;image-rendering:pixelated;image-rendering:crisp-edges}',
    JD + ' #frontsub{padding:0;font-family:"BohemiaCasing",monospace;font-size:10px;letter-spacing:2px;color:#b3a993}',
    /* THE ONE NEXT THING sits where the thumb is, in the same place on every front screen; quiet until the game is in */
    JD + ' #fronttap{position:absolute;left:0;right:0;bottom:calc(40px + env(safe-area-inset-bottom,0px));z-index:2;width:max-content;min-width:208px;max-width:calc(100% - 32px);min-height:48px;margin:0 auto;padding:0 16px;'
       + 'display:flex;align-items:center;justify-content:center;font-family:"BohemiaCasing",monospace;font-size:10px;letter-spacing:4px;color:#a9bfa2;background:#07090b;border:1px solid #3a4a37;animation:none;text-shadow:none;box-shadow:none}',
    JD + '.jtf-lit #fronttap,' + JD + '.load.ready #fronttap{color:#0e0a05;background:#c8ab63;border-color:#0e0a05;box-shadow:inset 0 2px 0 #e6c475,inset 0 -2px 0 #a78949}',
    JD + '.jtf-big.jtf-lit #fronttap,' + JD + '.jtf-big.load.ready #fronttap{font-size:20px;letter-spacing:6px}',
    JD + ' #buildstamp{bottom:12px!important;font-family:"BohemiaROM",monospace!important;font-size:10px!important;letter-spacing:1px!important;color:#b3a993!important}',
    /* THE TERMINAL (his loads B): the whole phone is the screen, its glass flat, its lines thin and baked */
    JD + '.load{padding-top:16px;background:var(--jtf-tube) 0 0/100% 100% no-repeat,var(--jtf-scan) 0 0/1px 3px repeat,#0a0d0b}',
    JD + '.load #loadwrap{padding-top:16px}',
    JD + '.load #fronttap{width:208px;min-width:0;padding:0;background:#0a0d0b}',
    JD + ' #loadtag{padding:0 0 12px}',
    JD + ' #loadtag b{display:none}',
    JD + ' #loadtag i{margin-top:8px;font-family:"BohemiaCasing",monospace;font-size:10px;letter-spacing:2px;color:#a9bfa2}',
    /* THE PICKS, typed on the same glass: a 1 px line round each, the one that is yours in the wordmark's gold */
    JD + ' #newco{margin:0 0 10px;padding:0;border:0;background:transparent;font-family:"BohemiaROM",monospace;font-size:10px;letter-spacing:0;color:#c9dcc4}',
    JD + ' #newco h4{margin:12px 0 6px;font-family:"BohemiaCasing",monospace;font-weight:400;font-size:10px;letter-spacing:2px;color:#a9bfa2}',
    JD + ' #newco h4:first-child{margin-top:0}',
    JD + ' #newco .row{gap:6px}',
    JD + ' #newco .row button{position:relative;min-height:44px;padding:8px 8px 7px;text-align:left;border:1px solid #55684f;border-radius:0;background:#0a0d0b;color:#e7dcc6;filter:none;box-shadow:none;'
       + 'font-family:"BohemiaCasing",monospace;font-size:10px;letter-spacing:1px;line-height:10px}',
    JD + ' #newco .row button small{display:block;margin-top:6px;font-family:"BohemiaROM",monospace;font-size:10px;line-height:10px;letter-spacing:0;color:#a9bfa2;opacity:1}',
    JD + ' #newco .row button.on{background:#c8ab63;color:#0e0a05;border-color:#0e0a05;box-shadow:inset 0 1px 0 #e6c475,inset 0 -1px 0 #a78949}',
    JD + ' #newco .row button.on small{color:#0e0a05}',
    JD + ' #newco .row button::after,' + JD + ' #newco .row button.on::after{content:none;display:none}',
    JD + ' #newco .strip{gap:6px;padding:0 0 6px;background:none;filter:none}',
    JD + ' #newco .org{flex:0 0 172px;min-height:96px;margin:0;padding:8px;border:1px solid #55684f;border-radius:0;background:#0a0d0b;box-shadow:none;color:#c9dcc4}',
    JD + ' #newco .org.on{border-color:#c8ab63;border-radius:0;background:#0a0d0b;box-shadow:inset 0 0 0 1px #c8ab63}',
    JD + ' #newco .org b{font-family:"BohemiaCasing",monospace;font-weight:400;font-size:10px;letter-spacing:1px;color:#e7dcc6}',
    JD + ' #newco .org.on b{color:#e6c475}',
    JD + ' #newco .org i{font-family:"BohemiaROM",monospace;font-size:10px;line-height:14px;color:#bccfb6}',
    JD + ' #newco .org em{padding:2px 4px;border:1px solid currentColor;background:transparent;transform:none;font-family:"BohemiaCasing",monospace;font-size:10px;letter-spacing:1px;color:#a9cf99}',
    JD + ' #newco .org em.d2{color:#e3cf86}' + JD + ' #newco .org em.d3{color:#f0a47e}' + JD + ' #newco .org em.d4{color:#ff9a90}',
    JD + ' #newco .name{gap:6px;padding:0;background:none;filter:none}',
    JD + ' #newco .name span{min-height:44px;padding:0 4px;border:0;border-bottom:1px solid #a9bfa2;background:transparent;color:#e7dcc6;font-family:"BohemiaCasing",monospace;font-weight:400;font-size:10px;letter-spacing:2px}',
    JD + ' #newco .name button{min-width:88px;min-height:44px;padding:0 10px;border:1px solid #55684f;border-radius:0;background:#0a0d0b;color:#e7dcc6;box-shadow:none;'
       + 'font-family:"BohemiaCasing",monospace;font-size:10px;letter-spacing:1px;text-align:center}',
    /* THE LOG fills from the bottom as it always did; the one wrong line a shade, never a colour (R5) */
    JD + ' #loadgl{padding:6px 2px;background:transparent;font-family:"BohemiaROM",monospace;font-size:10px;line-height:20px;letter-spacing:0;color:#c9dcc4}',
    JD + ' #loadgl::before,' + JD + ' #loadgl::after{content:none;display:none}',
    JD + ' #loadgl .w{color:#a9bfa2}',
    /* THE BAR in the units it can prove: one cell a stage, lit from the top like everything else */
    JD + ' #loadrow{margin-top:10px;gap:10px}',
    JD + ' #loadwell{position:relative;height:12px;padding:0;border:1px solid #55684f;border-radius:0;background:#0a0d0b;box-shadow:none}',
    JD + ' #loadfill{height:10px;border-radius:0;transition:none;background:#9fc48f;box-shadow:inset 0 1px 0 #d4ebc8,inset 0 -1px 0 #6c8f60}',
    JD + ' #loadwell .jtf-tick{position:absolute;top:0;bottom:0;width:2px;background:#0a0d0b}',
    JD + ' #loadpct{min-width:52px;font-family:"BohemiaROM",monospace;font-size:10px;letter-spacing:1px;color:#c9dcc4}',
    JD + ' #title .notes{min-height:40px;padding:0 12px;display:flex;align-items:center;border:1px solid #55684f;border-radius:0;background:#07090b;color:#e7dcc6;box-shadow:none;text-shadow:none;'
       + 'font-family:"BohemiaCasing",monospace;font-size:10px;letter-spacing:3px}',
    /* RUN's NOTES sheet over the title: the same glass, KEEP IT the one next thing; the box types at 20 so a phone
       never zooms into it (iOS zooms any field under 16) */
    JD + ' #title .sheet{background:#07090b}',
    JD + ' #title .sheet .card{padding:16px;border:1px solid #55684f;background:#07090b;box-shadow:none}',
    JD + ' #title .sheet h2{margin:0 0 12px;font-family:"BohemiaCasing",monospace;font-weight:400;font-size:10px;letter-spacing:3px;color:#e7dcc6}',
    JD + ' #title .sheet textarea{min-height:120px;padding:8px;border:1px solid #55684f;border-radius:0;outline:0;background:#0a0d0b;color:#e7dcc6;font:20px/24px "BohemiaROM",monospace}',
    JD + ' #title .sheet textarea:focus{border-color:#c8ab63}',
    JD + ' #title .sheet textarea::placeholder{color:#8f8571}',
    JD + ' #title .sheet .cnt{font-family:"BohemiaROM",monospace;font-size:10px;color:#a9bfa2}',
    JD + ' #title .sheet .row .it{min-height:48px;padding:0;display:flex;align-items:center;justify-content:center;border:1px solid #55684f;background:#07090b;box-shadow:none;color:#e7dcc6;transform:none}',
    JD + ' #title .sheet .row .it b{font-family:"BohemiaCasing",monospace;font-weight:400;font-size:10px;letter-spacing:3px;color:inherit;text-shadow:none}',
    JD + ' #title .sheet .row .it[data-k=nsave]{border-color:#0e0a05;background:#c8ab63;color:#0e0a05;box-shadow:inset 0 2px 0 #e6c475,inset 0 -2px 0 #a78949}',
    JD + ' #standalonenote{font-family:"BohemiaROM",monospace!important;font-size:10px!important;color:#b3a993!important}',
    /* SIDEWAYS (and a tablet or a computer on its side): the picks on the left, the name, the log, the bar and BEGIN on
       the right, so nothing runs off the glass (measured before: the picks ran 74 px past the bottom and BEGIN sat on the
       origins) */
    '@media (min-aspect-ratio: 4/3){'
      + JD + '.load #loadwrap{display:grid;grid-template-columns:minmax(0,1fr) 340px;grid-template-rows:auto minmax(0,1fr) auto 62px;column-gap:20px;'
      +   'padding-bottom:calc(26px + env(safe-area-inset-bottom,0px))}'
      + JD + ' #newco{grid-column:1;grid-row:1 / 5;margin:0;min-height:0;overflow-y:auto;overscroll-behavior:contain}'
      + JD + ' #newco h4{margin:5px 0 3px}'
      + JD + ' #newco .row button{padding:6px 6px 5px}'
      + JD + ' #newco .row button small{margin-top:4px}'
      + JD + ' #newco .strip{padding-bottom:2px}'
      + JD + ' #newco .org{flex-basis:230px;min-height:0;padding:6px;gap:3px}'
      + JD + ' #newco .org i{line-height:12px}'
      + JD + '.load #buildstamp{left:auto!important;right:14px!important;width:340px;text-align:center!important}'
      + JD + ' #loadtag{grid-column:2;grid-row:1}'
      + JD + ' #loadgl{grid-column:2;grid-row:2;min-height:0}'
      + JD + ' #loadrow{grid-column:2;grid-row:3}'
      + JD + '.load #fronttap{left:auto;right:calc(80px + env(safe-area-inset-right,0px));margin:0;bottom:calc(30px + env(safe-area-inset-bottom,0px))}'
      + JD + '{padding-top:12vh;padding-top:12dvh}'
    + '}',
    /* A SHORT PHONE UPRIGHT (667 tall): the same tightening, so the log keeps three lines instead of one */
    '@media (max-aspect-ratio: 4/3) and (max-height: 720px){'
      + JD + ' #newco h4{margin:7px 0 4px}'
      + JD + ' #newco .row button{padding:6px 6px 5px}'
      + JD + ' #newco .row button small{margin-top:4px}'
      + JD + ' #newco .strip{padding-bottom:2px}'
      + JD + ' #newco .org{min-height:0;padding:6px;gap:3px}'
      + JD + ' #newco .org i{line-height:12px}'
      + JD + ' #loadtag{padding-bottom:8px}'
    + '}',
    /* THE TITLE (startScreen): the letters over the valley, the one next thing in gold, the other two quiet printed lines */
    'html body .bm-start.jtf{background:#07090b;font-family:"BohemiaROM",monospace}',
    'html body .bm-start.jtf .t{left:20px;right:20px;top:19%;align-items:center;gap:12px;transform:none}',
    'html body .bm-start.jtf .sub{padding:0;border:0;background:none;font-size:10px;letter-spacing:2px;color:#b3a993}',
    'html body .bm-start.jtf .m{gap:4px}',
    'html body .bm-start.jtf .b{min-height:48px;padding:0 14px;gap:12px;border:0;outline:0;background:transparent;color:#e7dcc6;box-shadow:none;filter:none;transform:none}',
    'html body .bm-start.jtf .b::before{flex:0 0 12px;height:12px;background:var(--jtf-bone) center/12px 12px no-repeat}',
    'html body .bm-start.jtf .b::after,html body .bm-start.jtf .b .tp2{content:none;display:none}',
    'html body .bm-start.jtf .b .tx{flex-direction:row;align-items:baseline;gap:12px}',
    'html body .bm-start.jtf .b b{font-size:10px;letter-spacing:3px;color:#e7dcc6}',
    'html body .bm-start.jtf .b i{font-size:10px;letter-spacing:1px;color:#b3a993}',
    'html body .bm-start.jtf .b.rec:disabled b,html body .bm-start.jtf .b.rec:disabled i{color:#5f594e}',
    'html body .bm-start.jtf .b.rec:disabled::before{opacity:.4}',
    'html body .bm-start.jtf:not(.saved) .b.card,html body .bm-start.jtf.saved .b.rec{min-height:64px;background:#c8ab63;color:#0e0a05;outline:1px solid #0e0a05;box-shadow:inset 0 2px 0 #e6c475,inset 0 -2px 0 #a78949}',
    'html body .bm-start.jtf:not(.saved) .b.card::before,html body .bm-start.jtf.saved .b.rec::before{background-image:var(--jtf-ink)}',
    'html body .bm-start.jtf:not(.saved) .b.card .tx,html body .bm-start.jtf.saved .b.rec .tx{flex-direction:column;align-items:flex-start;gap:6px}',
    'html body .bm-start.jtf:not(.saved) .b.card b,html body .bm-start.jtf.saved .b.rec b{font-size:20px;letter-spacing:4px;color:#0e0a05}',
    'html body .bm-start.jtf:not(.saved) .b.card i,html body .bm-start.jtf.saved .b.rec i{color:#0e0a05}',
    'html body .bm-start.jtf .b.armed{min-height:64px;background:#7a2414;outline:1px solid #0e0a05;box-shadow:inset 0 2px 0 #a8432c,inset 0 -2px 0 #4a1208}',
    'html body .bm-start.jtf .b.armed b,html body .bm-start.jtf .b.armed i{color:#fff2e6}',
    'html body .bm-start.jtf .stamp{text-align:center;font-size:10px;letter-spacing:1px;color:#b3a993}',
    JD + ' #title .bm-start.jtf .stamp{color:#b3a993}',   /* RUN's fallback title colours every .stamp under #title, and an id outranks a class */
    '@media (min-aspect-ratio: 4/3){html body .bm-start.jtf .t{right:52%;top:12%;bottom:auto;justify-content:flex-start;transform:none}}'
  ].join('\n');
  var JTF_VARS = false;
  function jtfVars() {
    if (JTF_VARS) return; JTF_VARS = true;
    var c = canvas(1, 3), g = c.getContext('2d'); g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(0, 2, 1, 1);   /* the tube's lines, baked */
    var R = document.documentElement.style; R.setProperty('--jtf-scan', 'url(' + c.toDataURL('image/png') + ')'); R.setProperty('--jtf-tube', 'none');
  }
  /* THE TUBE IS CURVED, SO THE CORNERS FALL AWAY (his loads B, 9/21: 'the corners going dark because a tube is curved';
     bible R8, an in-world screen). It was a radial gradient; here it is painted at the screen's own pixels, each corner
     a quarter circle with two dithered steps before the black, so the light still has no smooth fade (rule 114 D10) */
  function paintTube() {
    var f = document.getElementById('front'); if (!f) return;
    var w = Math.max(1, Math.round(innerWidth)), h = Math.max(1, Math.round(innerHeight)), key = w + 'x' + h;
    if (f._jtfTube === key) return; f._jtfTube = key;
    var c = canvas(w, h), g = c.getContext('2d'), img = g.createImageData(w, h), D = img.data, R = Math.round(Math.min(w, h) * 0.12);
    var BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    [[0, 0, 1, 1], [w - R, 0, -1, 1], [0, h - R, 1, -1], [w - R, h - R, -1, -1]].forEach(function (q) {
      for (var y = 0; y < R; y++) for (var x = 0; x < R; x++) {
        var px = q[0] + x, py = q[1] + y, cx = q[2] > 0 ? R - x : x + 1, cy = q[3] > 0 ? R - y : y + 1, dd = Math.sqrt(cx * cx + cy * cy), b = BAYER[(py & 3) * 4 + (px & 3)];
        var a = dd > R ? 200 : dd > R - 5 ? (b < 8 ? 200 : 0) : dd > R - 12 ? (b < 3 ? 200 : 0) : 0;
        if (a) { var i = (py * w + px) * 4; D[i] = 0; D[i + 1] = 0; D[i + 2] = 0; D[i + 3] = a; }
      }
    });
    g.putImageData(img, 0, 0);
    f.style.setProperty('--jtf-tube', 'url(' + c.toDataURL('image/png') + ')'); f.dataset.jtfTube = '1';
  }
  function placeTicks() {
    var well = document.getElementById('loadwell'), pct = document.getElementById('loadpct'); if (!well) return;
    var n = +(((pct && pct.textContent) || '').match(/OF\s+(\d+)/) || [])[1] || 5, w = well.clientWidth;
    var ticks = well.querySelectorAll('.jtf-tick');
    if (ticks.length !== n - 1) { Array.prototype.forEach.call(ticks, function (t) { t.remove(); }); for (var i = 1; i < n; i++) { var t = document.createElement('i'); t.className = 'jtf-tick'; well.appendChild(t); } ticks = well.querySelectorAll('.jtf-tick'); }
    Array.prototype.forEach.call(ticks, function (t, i) { t.style.left = (Math.round(w * (i + 1) / n) - 1) + 'px'; });
  }
  var JTF_DONE = false;
  function frontJustTheFont() {
    if (!jtfOn()) return false;
    jtfVars(); style('bm-jtf-css', JTF_CSS);
    if (JTF_DONE) return true; JTF_DONE = true;
    var f = document.getElementById('front');
    var lp = document.getElementById('logoplate'); if (lp) lp.appendChild(markCanvas(function () { return Math.min(innerWidth - 32, 760); }));
    var lt = document.getElementById('loadtag');
    if (lt) lt.insertBefore(markCanvas(function () { return innerWidth > innerHeight * 4 / 3 ? 340 : Math.min(innerWidth - 28, 700); }), lt.firstChild);
    placeTicks(); paintTube();
    /* the one next thing lights when the game is really in (the door's own word for it is __LOAD_READY), and the word
       BEGIN is set big when it is short enough to be */
    setInterval(function () {
      var tap = document.getElementById('fronttap'), ready = !!window.__LOAD_READY;
      f.classList.toggle('jtf-lit', ready && !f.classList.contains('load'));
      f.classList.toggle('jtf-big', !!tap && (tap.textContent || '').length <= 8);
    }, 500);
    addEventListener('resize', function () { JTF_MARKS.forEach(sizeMark); placeTicks(); paintTube(); });
    return true;
  }
  /* ======================================================================================================
     THE HIT READ  (UI [the hit chance look], 10/19/26; rule 120(b); COMBAT [the fight says your weapon is weak] builds the
     numbers and places it, this block is only its look)
     PAOLO 10/18: 'the combat is still so fucking ass... the game doesn't explain to you at all that your weapon sucks.'
     (records/BOHEMIA_PAOLO_THE_COMBAT_IS_STILL_ASS_GUNS_FIRST_THE_AURA_AND_THE_FACE_IS_THE_BODYS_10_18_26.md; this round:
     records/BOHEMIA_THE_HIT_CHANCE_LOOK_10_19_26.md)
     MEASURED FIRST: the fight showed his chance as a 10 px number in the corner of the STRIKE square, and nothing at all
     about what the hit does to that man's armour. Battle Brothers shows the chance and its reasons when the cursor rests on
     a man and keeps the damage in the weapon's own tooltip; ours prints both on one slip of two-colour thermal paper:
     THE CHANCE big in the casing (30 px, three css pixels a dot), then TWO METERS of ten printed cells, his armour and his
     body, the cells this hit would take printed in the paper's red, the number beside them; ONE LINE in red only when the
     weapon is bad for him. After the swing the same slip says what it did (HIT or MISS, the cells gone). Everything else
     stays off it (rule 117: few numbers, big, one clear thing).
     THE PAPER is flat thermal stock lit from the top: three values hue-shifted (the lit top yellower, the foot redder),
     never darkened, a torn foot, the hard one-pixel contact edge drawn into it; no gradient, glow, blur or round corner
     (rule 114 D10). One css pixel a pixel for the paper, the cells, the marks and the 10 px print; ink #2a221a and the red
     #6e140c both pass 4.5 to 1 on it plain and under a flat 25% white (the sun, rule 73).
     COMBAT calls hitRead(read) with ITS numbers (the hit chance in, the dent out: its own resolveAttack at the mean roll)
     and puts the slip where the sheet's pick says: on the man ('tag'), out of the bar's top edge ('slip') or in the bar
     ('bar'); hitReadPlace() does the arithmetic. Nothing calls it until COMBAT does, so nothing in the game changes here.
     ====================================================================================================== */
  var HIT = { paper: [232, 224, 203], lit: [243, 241, 220], foot: [203, 181, 154], ink: '#2a221a', red: '#6e140c', redCell: [150, 34, 22],
    hollow: [184, 170, 140], cells: 10 };
  /* two pixel marks for the meters' labels, 12 x 12, one css pixel a dot: a plate (his armour) and a drop (his body) */
  var HIT_MARKS = {
    plate: ['011000000110', '111100001111', '111111111111', '111111111111', '011111111110', '011100001110',
            '011111111110', '011111111110', '001111111100', '001100001100', '000111111000', '000011110000'],
    drop:  ['000001100000', '000001100000', '000011110000', '000011110000', '000111111000', '001111111100',
            '001111111100', '011111111110', '011111111110', '011111111110', '001111111100', '000111111000']
  };
  var HIT_CSS = ".bm-hit{position:fixed;z-index:6;box-sizing:border-box;color:" + HIT.ink + ";pointer-events:none;border:0;border-radius:0;"
    + "box-shadow:none;filter:none;text-shadow:none;background-repeat:no-repeat;image-rendering:pixelated;font-family:'BohemiaROM',monospace;font-size:10px;line-height:10px;"
    + "padding:7px 8px 12px;display:grid;grid-template-columns:auto auto;column-gap:10px;align-items:center}"
    + ".bm-hit .bm-hit-ch{font-family:'BohemiaCasing',monospace;font-size:30px;line-height:30px;letter-spacing:0;white-space:nowrap}"
    + ".bm-hit .bm-hit-ch small{display:block;font-family:'BohemiaROM',monospace;font-size:10px;line-height:10px;margin-top:4px}"
    + ".bm-hit .bm-hit-m{display:grid;grid-template-columns:12px 79px auto;column-gap:4px;row-gap:6px;align-items:center}"
    + ".bm-hit .bm-hit-m canvas{display:block}"
    + ".bm-hit .bm-hit-n{font-family:'BohemiaCasing',monospace;font-size:20px;line-height:20px;color:" + HIT.red + ";white-space:nowrap;min-width:30px}"
    + ".bm-hit .bm-hit-n.none{color:" + HIT.ink + "}"
    + ".bm-hit .bm-hit-w{grid-column:1/3;color:" + HIT.red + ";margin-top:7px;white-space:normal;max-width:220px}"
    + ".bm-hit-tag{padding:6px 7px 11px;column-gap:8px}.bm-hit-tag .bm-hit-ch{font-size:20px;line-height:20px}"
    + ".bm-hit-tag .bm-hit-n{font-size:10px;line-height:10px;min-width:20px}.bm-hit-tag .bm-hit-m{row-gap:4px}.bm-hit-tag .bm-hit-w{max-width:170px}"
    + ".bm-hit-inbar{grid-template-columns:auto;padding:4px 7px 9px}.bm-hit-inbar .bm-hit-m{row-gap:4px}.bm-hit-inbar .bm-hit-w{grid-column:1;margin-top:5px;max-width:none}"
    /* the chance on the STRIKE square itself ('bar' puts the meters in the bar and the number on the button) */
    + ".bm-hit-sq{width:96px!important}.bm-hit-sq b{font-family:'BohemiaCasing',monospace!important;font-size:20px!important;line-height:20px!important;"
    +   "right:6px!important;bottom:13px!important;color:#f0d296!important;text-shadow:none!important;font-weight:400!important}";
  function hitDpr() { return Math.max(1, Math.min(3, Math.round(window.devicePixelRatio || 1))); }
  function rgb(c) { return 'rgb(' + c.join(',') + ')'; }
  /* the paper, w x h css pixels drawn at the device's pixels, every paper pixel one css pixel: the lit top row and the foot
     row hue-shifted off the stock, a torn foot (teeth every 4, 2 deep) and the contact edge under every tooth */
  function hitPaper(w, h) {
    var k = hitDpr(), c = canvas(w * k, h * k), g = c.getContext('2d'), P = function (x, y, ww, hh, col) { g.fillStyle = col; g.fillRect(x * k, y * k, ww * k, hh * k); };
    var s0 = seed; seed = 41;
    P(0, 0, w, h - 3, rgb(HIT.paper)); P(0, 0, w, 1, rgb(HIT.lit)); P(0, h - 5, w, 1, rgb(HIT.foot));
    for (var x = 0; x < w; x += 4) { var deep = (x / 4) % 2 ? 0 : 2; P(x, h - 4, 4, 2 - deep + 1, rgb(deep ? HIT.foot : HIT.paper)); P(x, h - 3 - deep + 2, 4, 1, '#0b0806'); }
    P(w - 1, 1, 1, h - 6, rgb(HIT.foot)); P(0, 1, 1, h - 6, rgb(HIT.lit));
    for (var i = 0; i < w * h / 40; i++) { var gx = Math.floor(rnd() * (w - 2)) + 1, gy = Math.floor(rnd() * (h - 8)) + 2; P(gx, gy, 1, 1, rgb(HIT.foot.map(function (v, j) { return Math.round((v + HIT.paper[j]) / 2); }))); }
    seed = s0;
    return c;
  }
  /* a meter: ten printed cells, 7 x 12 with a gap of 1; the cells he keeps in ink, the cells this hit takes in the red,
     what he has already lost hollow. take is rounded to whole cells, and anything at all shows one */
  function hitMeter(now, max, take, gone) {
    var n = HIT.cells, k = hitDpr(), cw = 7, W = n * (cw + 1) - 1, c = canvas(W * k, 12 * k), g = c.getContext('2d');
    c.style.width = W + 'px'; c.style.height = '12px';
    var have = max > 0 ? Math.round(n * Math.max(0, now) / max) : 0, t = max > 0 && take > 0 ? Math.max(1, Math.round(n * Math.min(now, take) / max)) : 0;
    if (now > 0 && have === 0) have = 1;
    t = Math.min(t, have);
    for (var i = 0; i < n; i++) {
      var x = i * (cw + 1), kept = i < have - t, hit = !kept && i < have;
      g.fillStyle = hit ? (gone ? rgb(HIT.hollow) : rgb(HIT.redCell)) : kept ? HIT.ink : rgb(HIT.hollow);
      if (kept || (hit && !gone)) { g.fillRect(x * k, 0, cw * k, 12 * k); g.fillStyle = kept ? '#4a3d30' : 'rgb(196,72,52)'; g.fillRect(x * k, 0, cw * k, 1 * k); }
      else { g.fillRect(x * k, 0, cw * k, k); g.fillRect(x * k, 11 * k, cw * k, k); g.fillRect(x * k, 0, k, 12 * k); g.fillRect((x + cw - 1) * k, 0, k, 12 * k); }
    }
    return c;
  }
  function hitMark(key, ink) {
    var k = hitDpr(), c = canvas(12 * k, 12 * k), g = c.getContext('2d'); c.style.width = c.style.height = '12px';
    g.fillStyle = ink || HIT.ink;
    HIT_MARKS[key].forEach(function (r, y) { for (var x = 0; x < 12; x++) if (r[x] === '1') g.fillRect(x * k, y * k, k, k); });
    return c;
  }
  /* read: { chance, armour: {now, max, take}, body: {now, max, take}, weak: bool, line: 'Your pipe barely dents his plate.',
             after: undefined | {hit: bool} }   opts: { mode: 'tag' | 'slip' | 'bar' }  -> the slip, not yet on the page */
  function hitRead(read, opts) {
    style('bm-hit-css', HIT_CSS);
    opts = opts || {};
    var el = document.createElement('div'); el.className = 'bm-hit bm-hit-' + (opts.mode === 'bar' ? 'inbar' : opts.mode || 'slip');   /* prefixed: the fight's own .bar is a 5 px meter */ el.setAttribute('data-hit-read', opts.mode || 'slip');
    var after = read.after, missed = after && !after.hit;
    if (opts.mode !== 'bar') {
      var ch = document.createElement('div'); ch.className = 'bm-hit-ch';
      ch.textContent = after ? (after.hit ? 'HIT' : 'MISS') : Math.round(read.chance) + '%';
      var sm = document.createElement('small'); sm.textContent = after ? (after.hit ? 'IT TOOK' : 'NOTHING') : 'TO HIT'; ch.appendChild(sm);
      el.appendChild(ch);
    }
    var m = document.createElement('div'); m.className = 'bm-hit-m';
    [['plate', read.armour], ['drop', read.body]].forEach(function (row) {
      var r = row[1] || { now: 0, max: 0, take: 0 }, take = missed ? 0 : Math.max(0, Math.round(r.take || 0));
      m.appendChild(hitMark(row[0]));
      m.appendChild(hitMeter(r.now, r.max, take, !!after));
      var n = document.createElement('span'); n.className = 'bm-hit-n' + (take ? '' : ' none'); n.textContent = take ? '-' + take : '0'; n.setAttribute('data-k', row[0]);
      m.appendChild(n);
    });
    el.appendChild(m);
    if (read.weak && read.line && !after) { var w = document.createElement('div'); w.className = 'bm-hit-w'; w.textContent = read.line; el.appendChild(w); }
    el._paint = function () {
      var r = el.getBoundingClientRect(), w = Math.round(r.width), h = Math.round(r.height);
      if (w < 8 || h < 8 || (el._pw === w && el._ph === h)) return;
      el._pw = w; el._ph = h; el.style.backgroundImage = 'url(' + hitPaper(w, h).toDataURL('image/png') + ')'; el.style.backgroundSize = w + 'px ' + h + 'px';
    };
    return el;
  }
  /* where the slip goes. ctx: { man: {x, head, feet} for 'tag' (css px on the glass), bar: the bar's rect for 'slip',
     stats: the bar's readout rect for 'bar', top: the lowest pixel of the top strip }. Whole css pixels, inside the glass. */
  function hitReadPlace(el, ctx) {
    var mode = el.getAttribute('data-hit-read'), W = innerWidth, H = innerHeight, top = Math.ceil(ctx.top || 0);
    if (!el.parentNode) document.body.appendChild(el);
    if (mode === 'bar' && ctx.stats) {
      /* the bar's readout: as wide as it, its foot on the readout's foot, taller only upward */
      var s = ctx.stats; el.style.width = Math.round(s.width) + 'px';
      var hh = el.getBoundingClientRect().height;
      el.style.left = Math.round(s.x) + 'px'; el.style.top = Math.round(Math.min(s.y, s.y + s.height - hh)) + 'px';
    } else {
      el.style.width = ''; el.style.width = Math.ceil(el.getBoundingClientRect().width) + 'px';   /* whole css pixels, so the paper is never resampled */
      var r = el.getBoundingClientRect(), x, y;
      if (mode === 'tag' && ctx.man) {
        x = ctx.man.x - r.width / 2; y = ctx.man.head - r.height - 6;
        if (y < top + 4) y = ctx.man.feet + 6;
      } else { var b = ctx.bar; x = (b ? b.x : 0) + 8; y = (b ? b.y : H) - r.height + 3; }
      var low = ctx.bar ? ctx.bar.y - r.height + 3 : H - r.height;
      x = Math.max(4, Math.min(W - r.width - 4, x)); y = Math.max(top + 4, Math.min(low, y));
      el.style.left = Math.round(x) + 'px'; el.style.top = Math.round(y) + 'px';
    }
    el._paint();
    return el.getBoundingClientRect();
  }
  /* 'bar': the chance (or HIT / MISS after the swing) on the STRIKE square at 20 px in the casing, the square 96 wide */
  function hitChanceOnButton(btn, read) {
    style('bm-hit-css', HIT_CSS);
    if (!btn) return; btn.classList.add('bm-hit-sq');
    var b = btn.querySelector('b'); if (!b) { b = document.createElement('b'); btn.appendChild(b); }
    b.textContent = read.after ? (read.after.hit ? 'HIT' : 'MISS') : Math.round(read.chance) + '%';
  }
  /* the moment the door is parsed (this file loads in the page's head, long before the end of a six-megabyte page), so
     the door's first frames are already bare; a page that finishes loading with no door stops asking */
  (function wait(n) {
    try { if (document.getElementById('loadwell')) { frontJustTheFont(); return; } } catch (e) { return; }
    if (document.readyState !== 'loading' || n > 900) return;
    setTimeout(function () { wait(n + 1); }, 16);
  })(0);
  function dressAll() { dressFrontDoor(); frontJustTheFont(); dressSettlement(); if (document.getElementById('sbody')) { iconTheMarket(); dressPosts(); } dressMapBar(); dressPhone(); dressRoster();
    /* the bar and the pad are built after load by the city's own modules: try again until they exist */
    if (!document.getElementById('bm-mapbar')) { var tries = 0, iv = setInterval(function () { if (dressMapBar() || ++tries > 40) clearInterval(iv); }, 500); }
    /* the top bar, the days once, on the map; the strip off the top in the fight (both pages build their bars after load) */
    if (!topBar() && !fightNoTop()) { var n = 0, it = setInterval(function () { if (topBar() || fightNoTop() || ++n > 120) clearInterval(it); }, 500); } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dressAll); else dressAll();

  /* ======================================================================================================
     THE KIT  (UI [the UI the Crashbox way], 10/23/26; rule 130(b), Paolo 10/23: 'the UI kind of still sucks, it
     doesn't look as elevated as the Crashbox style that we're going for'; 121(g): his biggest concern; the 9/20 rule:
     ALL THE UI LOOKS 3-D, built with light and form, delivered as pixels)
     The four materials above are drawn in canvas code (gradients and sprinkled dots): the one flat thing left on top
     of 3D people and 3D ground. tools/bohemia_ui_crashbox_kit.py now MODELS each material in Blender at its real
     thickness and renders it under the world's one sun the rig's way: bone-painted tin with rivets and a stamped
     panel (what you press), the same tin in olive (what is not picked) and amber (what is), corrugated board with the
     flutes showing (the bars and sheets), thermal paper (what the game prints), cracked glass on a bevel, a pocket
     pressed into a tin tray (a slot), packing tape. Each render is cut into nine pictures at slices/ui_kit/<piece>/
     (four corners, four edges, the middle); the middle and the edges are exactly one period of every mask, so they
     repeat at any size without a seam. kit(piece, scale) lays the nine as nine background layers (corners on top,
     then edges, the middle under), the box's own radius rounding the corners, so a button of any size is a slab of
     tin and a sheet of any size is a sheet of board. NOTHING HERE CHANGES A BOX'S SIZE: only its background, its
     corner, its shadow (one hard shadow down and to the right, from the same sun) and its press.
     KIT_CSS dresses every panel, button, bar and slot the player touches, on every screen this file is on; and the
     material variables are pointed at the rendered pictures, so anything not named still wears a rendered surface.
     ====================================================================================================== */
  var KIT = { /* slices/ui_kit/kit.json, the numbers the cut wrote (ins = top, right, bottom with the lip, left, in points) */
    tin: { ins: [12, 12, 14, 12], P: 64, r: 5 }, tin_dark: { ins: [12, 12, 14, 12], P: 64, r: 5 }, tin_amber: { ins: [12, 12, 14, 12], P: 64, r: 5 },
    board: { ins: [14, 6, 8, 6], P: 192, r: 1.5 }, board_plain: { ins: [6, 6, 8, 6], P: 192, r: 1.5 }, receipt: { ins: [6, 6, 7, 6], P: 96, r: 0.6 },
    glass: { ins: [8, 8, 10, 8], P: 128, r: 3 }, well: { ins: [11, 6, 9, 12], P: 48, r: 3 }, tray: { ins: [11, 6, 9, 12], P: 128, r: 3 },
    well_full: { ins: [11, 6, 9, 12], P: 48, r: 3 } };
  var KIT_BASE = (function () {   /* absolute, from this file's own address, so a page in any folder or frame finds the kit */
    try { var s = document.currentScript && document.currentScript.src; if (s) return s.replace(/[^\/]*$/, '') + 'ui_kit/'; } catch (e) {}
    try { return new URL('ui_kit/', document.baseURI).href; } catch (e) {}
    return 'ui_kit/';
  })();
  function kit(name, s, vary) {
    var k = KIT[name]; s = s || 1;
    var px = function (v) { return (Math.round(v * s * 100) / 100) + 'px'; };
    var t = px(k.ins[0]), r = px(k.ins[1]), b = px(k.ins[2]), l = px(k.ins[3]), P = px(k.P), u = KIT_BASE + name + '/';
    var L = [['tl', '0 0', l + ' ' + t, 'no-repeat'], ['tr', '100% 0', r + ' ' + t, 'no-repeat'], ['bl', '0 100%', l + ' ' + b, 'no-repeat'],
      ['br', '100% 100%', r + ' ' + b, 'no-repeat'], ['t', l + ' 0', P + ' ' + t, 'repeat-x'], ['b', l + ' 100%', P + ' ' + b, 'repeat-x'],
      ['l', '0 ' + t, l + ' ' + P, 'repeat-y'], ['r', '100% ' + t, r + ' ' + P, 'repeat-y'], ['c', l + ' ' + t, P + ' ' + P, 'repeat']];
    if (vary) {   /* only the middle moves: a pocket's floor meets its walls and the wall's shadow, which hide the join */
      L[8][1] = 'calc(' + l + ' - ' + px(k.P * vary[0]) + ') calc(' + t + ' - ' + px(k.P * vary[1]) + ')';
      return 'background-position:' + L.map(function (x) { return x[1]; }).join(',') + '!important;';
    }
    var col = function (i) { return L.map(function (x) { return x[i]; }).join(','); };
    return 'background-image:' + L.map(function (x) { return 'url(' + u + x[0] + '.png)'; }).join(',') + '!important;'
      + 'background-position:' + col(1) + '!important;background-size:' + col(2) + '!important;background-repeat:' + col(3) + '!important;'
      + 'background-color:transparent!important;background-origin:border-box!important;background-clip:border-box!important;'
      + 'background-attachment:scroll!important;background-blend-mode:normal!important;border-color:transparent!important;'
      + 'border-radius:' + px(k.r) + '!important;box-shadow:none!important;';
  }
  var KIT_SHADOW = 'filter:drop-shadow(2px 1px 0 rgba(10,6,3,.6))!important;';   /* the sun is up and to the left: a hard shadow down and right */
  var KIT_INK = 'color:#1f1710!important;text-shadow:none!important;', KIT_LIGHT = 'color:#f2e4c6!important;text-shadow:0 1px 0 #000!important;';
  var KIT_FACE = 'font-family:"BohemiaCasing",ui-sans-serif,sans-serif!important;font-weight:400!important;letter-spacing:.8px!important;';
  /* [piece, scale, selectors, what else]: every selector sits under html[data-kit] body, so it outranks the rule it dresses */
  var KIT_RULES = [
    /* THE FIGHT: the bar is board, what you press is tin, the skills sit in pockets, what it says is printed */
    ['board', 0.75, ['#bot'], 'background-color:#2a2016!important'],
    ['tin', 0.75, ['#bend', '#bwait', '#bauto', '#round', '#bmturnrow #round'], KIT_SHADOW + KIT_INK],
    ['tin_amber', 0.75, ['#bauto.on'], KIT_SHADOW + KIT_INK + 'outline:0!important'],
    ['well', 1, ['#bot .sq:not(.big)'], ''],
    ['tray', 1, ['#order'], ''],
    ['receipt', 1, ['#say', '#drawer', '#over .box'], ''],
    /* THE MAP: the bar is board, its tags tin, what you carry in a tray, the speed pad olive with the one you run at in amber */
    ['board_plain', 1, ['#menubar.bmtb', '#speedpad', '#bmtimespanel'], ''],
    ['tin', 0.75, ['#bmtb .t', '#menubar #bmtb #notebtn', '#bmtimes'], KIT_SHADOW],
    ['tin_amber', 0.75, ['#menubar #bmtb #notebtn.on'], KIT_SHADOW],
    ['tray', 0.85, ['#bmtb .g'], ''],
    ['receipt', 0.5, ['#bmtb .s b.low'], ''],
    ['tin_dark', 0.6, ['#speedpad .sp'], KIT_SHADOW + KIT_LIGHT],
    ['tin_amber', 0.6, ['#speedpad .sp.now'], KIT_SHADOW + 'color:#120c06!important;text-shadow:none!important;'],
    /* THE SETTLEMENT: its header and its sheet are board, CREW and LEAVE tin, what he sells printed, the slots pockets */
    ['board_plain', 1, ['html[data-bm-settle] #bar', '#sheet'], ''],
    ['tin', 0.75, ['html[data-bm-settle] #crew', 'html[data-bm-settle] #leave'], KIT_SHADOW + KIT_INK + KIT_FACE],
    ['board_plain', 0, ['html[data-bm-settle] #pname', 'html[data-bm-settle] #bat'], ''],
    ['tin', 0.55, ['#sheet #close'], KIT_SHADOW + KIT_INK],
    ['receipt', 1, ['#sheet .act'], ''],
    ['well', 1, ['#sheet .slot'], ''],
    ['well_full', 1, ['#sheet .slot.full'], ''],
    /* THE CREW SCREEN: board, a man's plate is tin, the line's empty places and the bag are pockets */
    ['board_plain', 1, ['html[data-bm-roster] #bar', 'html[data-bm-roster] #card'], ''],
    ['tin', 0.75, ['html[data-bm-roster] #done'], KIT_SHADOW + KIT_INK],
    ['receipt', 1, ['html[data-bm-roster] .plist button'], ''],   /* the perks are printed tags, a whole line of words each */
    ['tin_amber', 0.75, ['html[data-bm-roster] .pick'], KIT_SHADOW],
    ['tray', 1, ['html[data-bm-roster] .cell'], ''],
    ['well', 1, ['html[data-bm-roster] .gslot', 'html[data-bm-roster] #bag .slot'], ''],
    ['well_full', 1, ['html[data-bm-roster] .gslot.full', 'html[data-bm-roster] #bag .slot.full'], ''],
    ['tin', 0.6, ['html[data-bm-roster] .cell.full'], ''],
    ['receipt', 1, ['html[data-bm-roster] .stats', 'html[data-bm-roster] #ghost'], ''],
    ['receipt', 0.5, ['html[data-bm-roster] .cell b'], ''],
    /* THE START SCREEN AND THE FRONT DOOR, ONLY WHEN THEY ARE NOT HIS: the front screen he loved (rule 127(b), 130(b): 'the
       front screen's font he loved stays'; the door's just-the-font look, #front[data-look=just-the-font] and .bm-start.jtf)
       is left exactly as it is; any other start screen's three things stay three things (board, paper, glass), made real */
    ['board_plain', 1, ['.bm-start:not(.jtf) .b.card'], ''],
    ['receipt', 1, ['.bm-start:not(.jtf) .b.rec', '#front:not([data-look="just-the-font"]) #newco .strip', '#front:not([data-look="just-the-font"]) #newco .name'], ''],
    ['glass', 1, ['.bm-start:not(.jtf) .b.pane'], ''],
    ['glass', 0.75, ['#front:not([data-look="just-the-font"]) #newco .name button'], ''],
    ['tin_dark', 0.75, ['#front:not([data-look="just-the-font"]) #newco .row button'], KIT_LIGHT],
    ['tin_amber', 0.75, ['#front:not([data-look="just-the-font"]) #newco .row button.on'], 'color:#120c06!important;text-shadow:none!important;'],
    /* THE SETTINGS: a sheet of board, the title printed, the buttons tin, the bars olive lit amber */
    ['board_plain', 1, ['#setcard'], ''],
    ['receipt', 1, ['#setcard .seth'], ''],
    ['tin', 0.75, ['#setcard .setbtn'], KIT_SHADOW + KIT_INK],
    ['tin_dark', 0.6, ['#setcard .setbars .vb'], ''],
    ['tin_amber', 0.6, ['#setcard .setbars .vb.lit'], ''],
    /* a browser drops a whole rule over one pseudo-element it does not know, so each engine's handle is its own rule */
    ['tin', 0.5, ['#setcard .setslide input::-webkit-slider-thumb'], ''],
    ['tin', 0.5, ['#setcard .setslide input::-moz-range-thumb'], '']
  ];
  /* the press: the slab goes down into its shadow (the individual translate composes with any rotate the rule set) */
  var KIT_PRESS = ['#bend', '#bwait', '#bauto', '#bmtb .t.gear', '#bmtb .t.crew', '#menubar #bmtb #notebtn', '#bmtimes', '#speedpad .sp', 'html[data-bm-settle] #crew',
    'html[data-bm-settle] #leave', '#sheet #close', 'html[data-bm-roster] #done', '#front:not([data-look="just-the-font"]) #newco .row button', '#setcard .setbtn'];
  function kitCSS() {
    var pre = 'html[data-kit] body ', out = [];
    var tape = 'url(' + KIT_BASE + 'tape/tape.png)', rec = 'url(' + KIT_BASE + 'receipt/c.png)', card = 'url(' + KIT_BASE + 'board_plain/c.png)', gl = 'url(' + KIT_BASE + 'glass/c.png)';
    out.push('html[data-kit]{--mat-tape:' + tape + '!important;--bm-tape:' + tape + '!important;--set-tape:' + tape + '!important;'
      + '--mat-receipt:' + rec + '!important;--bm-receipt:' + rec + '!important;--set-rec:' + rec + '!important;'
      + '--mat-cardboard:' + card + '!important;--bm-cardboard:' + card + '!important;--bm-cardboard-dk:' + card + '!important;--set-card:' + card + '!important;'
      + '--mat-glass:' + gl + '!important;--bm-glass:' + gl + '!important;--bm-glass-dk:' + gl + '!important;--set-glass:' + gl + '!important}');
    KIT_RULES.forEach(function (rl) {
      var sel = rl[2].map(function (x) { return x.indexOf('html[') === 0 ? x.replace(/^html(\[[^\]]+\])/, 'html[data-kit]$1 body') : pre + x; }).join(',');
      if (!rl[1]) { out.push(sel + '{' + KIT_FACE + '}'); return; }
      out.push(sel + '{' + kit(rl[0], rl[1]) + (rl[3] || '') + '}');
      /* a grid of pockets: every slot's floor is cut from another part of the same glass */
      if (/^well/.test(rl[0])) [[3, 1, [0.37, 0.61]], [3, 2, [0.71, 0.23]], [5, 3, [0.13, 0.47]], [7, 4, [0.55, 0.83]]].forEach(function (v) {
        out.push(rl[2].map(function (x) { return (x.indexOf('html[') === 0 ? x.replace(/^html(\[[^\]]+\])/, 'html[data-kit]$1 body') : pre + x) + ':nth-child(' + v[0] + 'n+' + v[1] + ')'; }).join(',')
          + '{' + kit(rl[0], rl[1], v[2]) + '}');
      });
    });
    out.push(KIT_PRESS.map(function (x) { return (x.indexOf('html[') === 0 ? x.replace(/^html(\[[^\]]+\])/, 'html[data-kit]$1 body') : pre + x) + ':active'; }).join(',')
      + '{translate:1px 1px;filter:none!important}');
    return out.join('\n');
  }
  function dressKit() {
    var root = document.documentElement;
    if (document.getElementById('sbody') && !root.hasAttribute('data-bm-settle')) root.setAttribute('data-bm-settle', '');
    if (!document.getElementById('bm-kit')) {
      var st = document.createElement('style'); st.id = 'bm-kit'; st.textContent = kitCSS();
      (document.head || root).appendChild(st);
    }
    root.setAttribute('data-kit', '1');
    return true;
  }
  dressKit();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dressKit);

  /* ======================================================================================================
     THE TEN CHANGES, THE UI'S PART  (UI [the ten changes: the UI's part], 10/24/26; rule 133, Paolo 10/23: 'the whole
     point of this project was to be like Battle Brothers but quicker and funner for normies... also kind of hardcore
     vibes if you're fucking around too much'; TUNING's page, records/BOHEMIA_TUNING_QUICKER_AND_FUNNER_FOR_NORMIES_THE_TEN_CHANGES_10_23_26.md)
     RUN built the map's half of changes 1 to 5 on 10/23. Five are the screen's:
       2  THE PHONE'S LIT TOWN: a job touched on the phone says, on the phone, what to touch next, and the picked post is
          the amber tin beating with the road's dots (the line is printed by slices/bohemia_phone_board.js).
       3  THE PARTY PLATE: RUN's plate on a party's flag (how many, skulls against his crew, where it is going) is a tin tag
          from the kit: the count beside a drawn man, the skulls, the danger in one word; a crew coming for him is the
          same tag rusted red (mapPlatesDraw asks partyPlate below; the old dark strip stays the fallback).
       5  TWO NUMBERS ON THE BAR: the batteries and the days they feed the crew (topBar above).
       6  A WIN IS A MOMENT: the battery number never jumps: every change counts where it lives, one tick an eighth note,
          at most six beats, each tick posted as BOHEMIA_MOMENT (SOUNDS plays it; this file makes no sound); what a fight
          dropped flies into the crew tag; the man it laid up shows his face and his days; a paid job is paid by its
          client's face; nightfall is the day's tally said by his second (fights won, batteries in and out, days left),
          one tap.
       8  ONE VOICE: his second says one line the first time each of seven things happens (the first fight's three are
          COMBAT's), never in the first sixty seconds of play, never stopping the march, a tap lets it go, each once.
     NOTHING POPS UP (rule 117(c); the second votes): a spoken line is a face at the foot of the map that the march walks
     past, and no line without a face is ever shown (rule 19c). The words are WORDS' to overwrite, draft:true:
     records/target/words/the_second_speaks.json, read at load; if it cannot be read, nobody speaks.
     ====================================================================================================== */
  var TEN_PAGE = (function () { try { var p = location.pathname; return /BOHEMIA_CITY_WORLD/.test(p) ? 'map' : (/BOHEMIA_(DEMO|ALPHA_0_9)\.html$/.test(p) ? 'shell' : ''); } catch (e) { return ''; } })();
  function tenBeat() { try { return (typeof window.BEAT === 'number' && window.BEAT > 0) ? window.BEAT : 60000 / (window.BPM || 120); } catch (e) { return 500; } }
  function tenPost(m) {
    m.type = 'BOHEMIA_MOMENT'; m.at = Math.round(performance.now());
    try { TEN.moments = (TEN.moments || []).concat([m]).slice(-80); window.__MOMENTS = TEN.moments; } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('bohemia-moment', { detail: m })); } catch (e) {}
    try { if (window.parent && window.parent !== window) window.parent.postMessage(m, '*'); } catch (e) {}
  }
  /* ---- THE SHELL: the fight's own word home carries who it laid up; kept for the map, which hears only won or lost ---- */
  if (TEN_PAGE === 'shell') window.addEventListener('message', function (ev) {
    var d = ev && ev.data; if (!d || d.type !== 'BOHEMIA_FIGHT_OVER') return;
    try { window.__BM_FIGHT_OVER = { at: Date.now(), result: d.result, rounds: d.rounds | 0, drops: Array.isArray(d.drops) ? d.drops.slice(0, 8) : null,
      crew: (d.crew || []).map(function (c) { return { name: c.name, main: !!c.main, dead: !!c.dead, down: !!c.down, days: c.laidUpDays | 0, injury: c.injury ? c.injury.name : null }; }) }; } catch (e) {}
  });

  /* ---- THE COUNT: the bar's battery figure walks to what the purse holds, one tick an eighth note ---- */
  function tenReal() { try { return typeof window.loopBats === 'function' ? window.loopBats() : (purseBalances().electricity | 0); } catch (e) { return null; } }
  /* SOUNDS' count-up (engine/bohemia_bullet_lands.js, BUILD 10/24a; its NOTE on UI's board): posted BOHEMIA_COUNT_UP {from, to}
     at the moment the number starts to move, the shell answers BOHEMIA_COUNT_UP_PLAN {ticks, startMs, stepMs, landMs} in ITS
     clock (a real counter ticking once a 16th on the song's grid, then a battery dropped in a crate on the beat after the last
     tick, a bell when it climbs). The number takes one step a tick and the last number lands with the drop. No plan (no
     sound yet, the sprites still loading, a page with no shell): the number walks on the game's own eighth notes instead. */
  var COUNT_WAIT = 220;
  if (TEN_PAGE === 'map') window.addEventListener('message', function (ev) {
    var d = ev && ev.data; if (!d || d.type !== 'BOHEMIA_COUNT_UP_PLAN') return;
    var K = TEN.count; if (!K || K.plan) return;
    var P = d.plan; if (!P || !(P.ticks > 0) || !(P.stepMs > 0)) { K.plan = 'none'; return; }
    var off = 0; try { off = window.parent.performance.timeOrigin - performance.timeOrigin; } catch (e) {}
    K.plan = { ticks: P.ticks | 0, startMs: P.startMs + off, stepMs: P.stepMs, landMs: P.landMs + off, onGrid: !!P.onGrid };
    clearTimeout(TEN.countT); tenStep();
  });
  function tenValue(K, n) { return K.from + Math.round((K.to - K.from) * n / (K.ticks + 1)); }
  function tenStep() {
    var K = TEN.count; if (!K) return;
    var now = performance.now(), P = K.plan && K.plan.ticks ? K.plan : null, n, next;
    if (P) {   /* SOUNDS' ticks: the step that has sounded by now, the next one when it will */
      K.ticks = P.ticks;
      if (now >= P.landMs - 4) n = K.ticks + 1; else n = Math.max(0, Math.min(K.ticks, Math.floor((now - P.startMs) / P.stepMs + 0.001) + 1));
      next = n <= K.ticks ? (n < K.ticks ? P.startMs + n * P.stepMs : P.landMs) : null;
    } else {   /* the game's own eighth notes (the map's beat is performance.now() over BEAT) */
      var e = tenBeat() / 2;
      n = Math.max(0, Math.min(K.ticks + 1, Math.floor((now - K.t0) / e + 0.001) + 1));
      next = n <= K.ticks ? K.t0 + n * e : null;
    }
    if (n > K.n) {
      K.n = n; K.shown = n > K.ticks ? K.to : tenValue(K, n);
      tenPost({ kind: n > K.ticks ? 'count_land' : 'count_tick', n: Math.min(n, K.ticks), of: K.ticks, value: K.shown, why: K.why, down: K.down, by: P ? 'sounds' : 'beat' });
      try { tbPaint(); } catch (e2) {}
    }
    if (next != null) { TEN.countT = setTimeout(tenStep, Math.max(0, next - performance.now())); return; }
    TEN.countT = setTimeout(function () { TEN.last = K.to; TEN.count = null; tenPost({ kind: 'count_done', value: K.to, why: K.why, by: P ? 'sounds' : 'beat' }); try { tbPaint(); } catch (e3) {} }, tenBeat() / 2);
  }
  function tenCount(to) {
    var C = TEN.count, from = C ? C.shown : TEN.last;
    if (from == null || to == null || from === to) return;
    clearTimeout(TEN.countT);
    var ticks = Math.min(12, Math.abs(to - from)), eighth = tenBeat() / 2;
    C = TEN.count = { from: from, to: to, shown: from, n: 0, ticks: ticks, down: to < from, why: (C && C.why) || TEN.why || (to > from ? 'in' : 'out'), plan: null,
      t0: performance.now() + (eighth - (performance.now() % eighth)) };
    TEN.why = null;
    tenPost({ kind: 'count_up', from: from, to: to, ticks: ticks, why: C.why, down: C.down });
    try { if (window.parent && window.parent !== window) window.parent.postMessage({ type: 'BOHEMIA_COUNT_UP', from: from, to: to }, '*'); } catch (e) {}
    /* a short wait for SOUNDS' plan; without one, the eighth notes */
    TEN.countT = setTimeout(function () { var K = TEN.count; if (K && !K.plan) { K.plan = 'none'; K.t0 = performance.now() + (eighth - (performance.now() % eighth)); tenStep(); } }, COUNT_WAIT);
    try { tbPaint(); } catch (e) {}
  }
  function tenWatch() {
    var r = tenReal(); if (r == null) return;
    /* nothing counts until the game has begun and settled (the start's own grant is not a moment), nor while a place is
       open over the bar: what was bought there counts when the bar is back on the glass */
    if (playS() < 3) { TEN.last = r; TEN.armed = false; return; }
    try { if (LOOP.frame && LOOP.frame.style.display === 'block') return; } catch (e) {}
    TEN.armed = true;
    if (TEN.last == null) { TEN.last = r; return; }
    if (TEN.count ? r !== TEN.count.to : r !== TEN.last) tenCount(r);
    var root = document.getElementById('bmtb'); if (root) { var b = root.querySelector('.s.bats'); if (b) b.classList.toggle('down', !!(TEN.count && TEN.count.down)); }
  }

  /* ---- THE VOICE: one face, one line, at the foot of the map; the march walks past it ---- */
  var VOICE = { q: [], on: null, el: null, said: {}, lines: null, t0: 0, shown: [], nights: 0, won: {}, hires: null, wasTown: false };
  var VOICE_KEY = 'bohemia.voice.once.v1';
  try { VOICE.said = JSON.parse(localStorage.getItem(VOICE_KEY) || '{}') || {}; } catch (e) { VOICE.said = {}; }
  var VOICE_CSS = ''
    + 'html body #bmvoice{position:fixed;z-index:41;left:8px;right:8px;max-width:440px;margin:0 auto;display:none;align-items:center;gap:8px;box-sizing:border-box;'
    +   'padding:7px 10px 10px 8px;pointer-events:auto;cursor:pointer;-webkit-tap-highlight-color:transparent;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;' + kit('board_plain', 1) + KIT_SHADOW + '}'
    + 'html body #bmvoice.on{display:flex}'
    + 'html body #bmvoice .face{flex:0 0 auto;width:62px;height:62px;box-sizing:border-box;padding:5px 4px 6px 6px;display:flex;align-items:center;justify-content:center;' + kit('well', 1) + '}'
    + 'html body #bmvoice .face canvas{display:block;width:50px;height:50px;image-rendering:pixelated}'
    + 'html body #bmvoice .say{flex:1 1 auto;min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:4px}'
    + 'html body #bmvoice .hd{display:flex;align-items:center;gap:6px;max-width:100%}'
    + 'html body #bmvoice .who{font-size:11px;letter-spacing:1px;line-height:1;padding:4px 7px 5px;white-space:nowrap;' + kit('receipt', 0.75) + KIT_INK + '}'
    + 'html body #bmvoice .tag{font-size:11px;letter-spacing:1px;line-height:1;padding:4px 7px 5px;white-space:nowrap;color:#120c06;' + kit('tin_amber', 0.5) + '}'
    + 'html body #bmvoice .tag.red{' + kit('tin', 0.5) + 'color:#6e140c!important}'
    + 'html body #bmvoice .line{align-self:stretch;font-family:"BohemiaROM",ui-monospace,monospace;font-size:12px;line-height:1.35;padding:6px 8px 7px;min-height:18px;' + kit('receipt', 1) + KIT_INK + '}'
    + 'html body #bmvoice .line i{font-style:normal;visibility:hidden} html body #bmvoice .line i.on{visibility:visible}'
    + 'html body #bmvoice .more{font-size:9px;letter-spacing:1px;color:#f2e4c6;text-shadow:0 1px 0 #000;margin-left:auto}'
    /* RUN's walking man (#billtalk, the bill's own face) wears the same plate: one voice on the map, not two */
    + 'html body #billtalk{' + kit('board_plain', 1) + KIT_SHADOW + 'color:#1f1710!important;font-family:"BohemiaROM",ui-monospace,monospace!important;left:8px!important;right:8px!important;max-width:440px;margin:0 auto}'
    + 'html body #billtalk canvas{box-sizing:border-box;width:62px!important;height:62px!important;padding:5px 4px 6px 6px;' + kit('well', 1) + '}'
    + 'html body #billtalk>div{flex:1 1 auto;padding:6px 8px 7px;' + kit('receipt', 1) + KIT_INK + '}'
    + 'html body #billtalk>div b{color:#6e140c!important;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:normal;letter-spacing:1px}';
  function voiceLines() {
    if (VOICE.lines || VOICE.asked) return; VOICE.asked = true;
    try { fetch('../records/target/words/the_second_speaks.json').then(function (r) { return r.json(); }).then(function (j) { if (j && j.lines) VOICE.lines = j; }).catch(function () {}); } catch (e) {}
  }
  function voiceFaces(cb) {
    if (window.BohemiaCrewFaces) return cb && cb();
    if (!VOICE.facesAsked) { VOICE.facesAsked = true;
      if (![].slice.call(document.scripts).some(function (s) { return /bohemia_crew_faces\.js/.test(s.src || ''); })) {
        try { var sc = document.createElement('script'); sc.src = '../engine/bohemia_crew_faces.js'; document.head.appendChild(sc); } catch (e) {} } }
  }
  function L(id) { var j = VOICE.lines; return j && j.lines && j.lines[id] ? j.lines[id] : null; }
  function fill(t, o) { return String(t || '').replace(/\{(\w+)\}/g, function (m, k) { return o && o[k] != null ? o[k] : m; }); }
  /* his second: the first man of the company after him who is still with him (ours.json's names and looks, the fight's
     and the crew screen's own) */
  function tenSecond(not) {
    var D = window.CREW_DEFS, men = (D && D.men) || [], looks = (D && D.looks) || [];
    var n = 3; try { n = (LOOP.start && LOOP.start.company && LOOP.start.company.length) || 3; } catch (e) {}
    var gone = {}; try { (window.crewWalked() || []).forEach(function (w) { gone[String(w.name).toUpperCase()] = 1; }); } catch (e) {}
    if (not) gone[String(not).toUpperCase()] = 1;
    for (var i = 1; i < Math.max(2, n); i++) { var m = men[i]; if (m && looks[i] && !gone[String(m.name).toUpperCase()]) return { name: String(m.name), look: looks[i] }; }
    return null;
  }
  function lookOfMan(name) {
    var D = window.CREW_DEFS, men = (D && D.men) || [], looks = (D && D.looks) || [];
    for (var i = 0; i < men.length; i++) if (String(men[i].name).toUpperCase() === String(name).toUpperCase()) return looks[i] || null;
    return null;
  }
  /* the client who posted a job: the board's own person (RUN TWO's shelf), else the town's people */
  function clientOf(job) {
    try { var S = window.BohemiaBoardShelf && BohemiaBoardShelf.shelf(); if (S) for (var i = 0; i < S.offers.length; i++) if (S.offers[i].id === job.id && S.offers[i].client && S.offers[i].client.look) return { name: S.offers[i].client.name, look: S.offers[i].client.look }; } catch (e) {}
    var f = 'faction_' + String(job.from || '').toLowerCase().replace(/[^a-z]/g, '');
    try { if (window.BohemiaCrewFaces && BohemiaCrewFaces.has(f)) return { name: String(job.from).toUpperCase(), look: f }; } catch (e) {}
    return null;
  }
  function playS() { var t0 = window.HUNT_T0 || VOICE.t0; return t0 ? (performance.now() - t0) / 1000 : -1; }
  /* say: o = { id, line, who {name, look}, tag, red, prio (lower first), ttl (s), once, hold (beats), kind } */
  function say(o) {
    if (!o || !o.line || !o.who || !o.who.look) return false;
    if (o.once && VOICE.said[o.id]) return false;
    if (VOICE.q.some(function (x) { return x.id === o.id; }) || (VOICE.on && VOICE.on.id === o.id)) return false;
    o.asked = performance.now(); VOICE.q.push(o); voicePump(); return true;
  }
  function voiceBlocked() {
    if (playS() < 60) return 'the first sixty seconds';
    var bt = document.getElementById('billtalk'); if (bt && bt.style.display !== 'none' && bt.offsetWidth > 0) return 'the walking man';
    try { if (LOOP.frame && LOOP.frame.style.display === 'block') return 'a place is open'; } catch (e) {}
    try { if (window.parent !== window && window.parent.eval('typeof CITYFIGHT!=="undefined"&&!!CITYFIGHT')) return 'a fight'; } catch (e) {}
    if (!window.BohemiaCrewFaces) return 'no faces yet';
    return '';
  }
  function voiceSyl(w) { var m = String(w).toLowerCase().match(/[aeiouy]+/g); return Math.max(1, m ? m.length : 1); }
  function voiceShow(o) {
    var F = window.BohemiaCrewFaces; if (!F || !F.has(o.who.look)) return false;   /* no face, no line (rule 19c) */
    if (!document.getElementById('bm-voice')) style('bm-voice', VOICE_CSS);
    var el = VOICE.el;
    if (!el) {
      el = VOICE.el = document.createElement('div'); el.id = 'bmvoice'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
      el.addEventListener('click', function (e) { try { e.stopPropagation(); } catch (_e) {} voiceHide('tap'); });
      ['pointerdown', 'touchstart', 'mousedown'].forEach(function (k) { el.addEventListener(k, function (e) { try { e.stopPropagation(); } catch (_e) {} }, { passive: true }); });
      document.body.appendChild(el);
    }
    var c = document.createElement('canvas'); c.width = c.height = F.SIZE || 128;
    var words = String(o.line).split(/\s+/), at = 0, half = tenBeat() / 2, html = '';
    var times = words.map(function (w) { var t = at; at += voiceSyl(w) * half; return t; });
    words.forEach(function (w, i) { html += (i ? ' ' : '') + '<i>' + esc(w) + '</i>'; });
    el.innerHTML = '<div class="face"></div><div class="say"><div class="hd"><span class="who"></span>' + (o.tag ? '<span class="tag' + (o.red ? ' red' : '') + '"></span>' : '') + '</div><div class="line">' + html + '</div></div>';
    el.querySelector('.face').appendChild(c);
    el.querySelector('.who').textContent = String(o.who.name).toUpperCase();
    if (o.tag) el.querySelector('.tag').textContent = o.tag;
    voicePlace(el); el.classList.add('on');
    try { F.draw(c.getContext('2d'), o.who.look, F.SIZE || 128); } catch (e) {}   /* the face at rest from the first frame, then the mouth */
    try { F.talk(c, o.who.look, o.line); } catch (e) {}
    /* the receipt prints the words as the mouth says them */
    var is = el.querySelectorAll('.line i'); VOICE.wordT = times.map(function (t, i) { return setTimeout(function () { if (is[i]) is[i].classList.add('on'); }, t); });
    var beats = Math.max(6, Math.min(20, Math.ceil(at / tenBeat()) + (o.hold || 3)));   /* the words said, then three beats to read them */
    VOICE.on = o; o.shownAt = performance.now(); o.until = o.shownAt + beats * tenBeat();
    if (o.once) { VOICE.said[o.id] = Date.now(); try { localStorage.setItem(VOICE_KEY, JSON.stringify(VOICE.said)); } catch (e) {} }
    VOICE.shown.push({ id: o.id, kind: o.kind || 'line', who: o.who.name, look: o.who.look, line: o.line, tag: o.tag || null, s: Math.round(playS() * 10) / 10, beats: beats });
    window.__VOICE = { on: o.id, shown: VOICE.shown.slice(-40), q: VOICE.q.map(function (x) { return x.id; }) };
    tenPost({ kind: 'voice', id: o.id, who: o.who.name });
    return true;
  }
  function voiceHide(why) {
    var o = VOICE.on; if (!o) return;
    (VOICE.wordT || []).forEach(clearTimeout); VOICE.wordT = null;
    if (VOICE.el) VOICE.el.classList.remove('on');
    o.gone = why; VOICE.on = null; VOICE.gap = performance.now() + tenBeat();   /* a beat of nothing between two faces */
    if (window.__VOICE) { window.__VOICE.on = null; window.__VOICE.last = { id: o.id, why: why }; }
  }
  /* above the speed pad, inside the glass, and clear of the phone (on its side the phone is on the left) */
  function voicePlace(el) {
    var H = window.innerHeight, b = 118;
    try { var p = document.getElementById('speedpad'), r = p && p.getBoundingClientRect(); if (r && r.height > 0 && r.top < H) b = Math.round(H - r.top + 8); } catch (e) {}
    el.style.bottom = b + 'px'; el.style.left = ''; el.style.top = '';
    try { var ph = document.getElementById('cityfeed'), q = ph && ph.getBoundingClientRect(), v = el.getBoundingClientRect();
      if (q && q.width > 0 && ph.classList.contains('on') && q.bottom > H - b - 80 && q.right < window.innerWidth / 2) el.style.left = Math.round(q.right + 8) + 'px'; } catch (e) {}
  }
  function voicePump() {
    var now = performance.now();
    if (VOICE.on) { if (now >= VOICE.on.until) voiceHide('time'); else return; }
    VOICE.q = VOICE.q.filter(function (x) { return now - x.asked < (x.ttl || 45) * 1000; });
    if (!VOICE.q.length || (VOICE.gap && now < VOICE.gap)) return;
    var why = voiceBlocked(); VOICE.blocked = why; if (why) return;
    VOICE.q.sort(function (a, b) { return (a.prio || 5) - (b.prio || 5) || a.asked - b.asked; });
    while (VOICE.q.length) { var o = VOICE.q.shift(); if (voiceShow(o)) break; }
  }

  /* ---- WHAT HAPPENED: the fight home, the pay, the hurt, the night ---- */
  function tenDay() { try { return window.loopDay ? loopDay() : (T.day | 0); } catch (e) { return 0; } }
  function tenFightHome(d) {
    var o = d.outcome || {}, won = !!(o.victory || o.result === 'win'), job = null;
    try { var id = LOOP.fighting; (LOOP.held || []).forEach(function (h) { if (h.id === id) job = h; }); } catch (e) {}
    var paid = !!(job && won && !((o.alive | 0) > 0));
    var day = tenDay(); if (won && !((o.alive | 0) > 0)) VOICE.won[day] = (VOICE.won[day] | 0) + 1;
    TEN.why = paid ? 'pay' : (won ? 'win' : 'loss');
    var snap = null; try { snap = window.parent.__BM_FIGHT_OVER; if (!snap || Date.now() - snap.at > 60000) snap = null; } catch (e) {}
    TEN.lastFight = { won: won, paid: paid, job: job ? job.id : null, pay: job ? job.pay : 0, snap: snap, s: Math.round(playS() * 10) / 10 };
    var sec = tenSecond();
    if (paid) {
      var cl = clientOf(job), l = L('client_pay');
      if (cl && l) say({ id: 'pay:' + job.id, kind: 'pay', who: cl, line: fill(l.line, { pay: job.pay }), tag: '+' + job.pay, prio: 1, ttl: l.ttl || 45 });
      var f1 = L('first_pay'); if (f1 && sec) say({ id: 'first_pay', kind: 'teach', once: true, who: sec, line: f1.line, prio: 1, ttl: f1.ttl || 90 });
    }
    if (snap) snap.crew.forEach(function (c) {
      if (c.main) return;
      var lk = lookOfMan(c.name);
      var other = tenSecond(c.name);   /* the one who says it about him is never him */
      if (c.dead) { var ld = L('dead'); if (ld && other) say({ id: 'dead:' + c.name + ':' + day, kind: 'dead', who: other, line: fill(ld.line, { name: c.name }), tag: 'DEAD', red: true, prio: 1, ttl: 45 }); return; }
      if (c.down && c.days > 0 && lk) {
        var lh = L('hurt'); if (lh) say({ id: 'hurt:' + c.name + ':' + day, kind: 'hurt', who: { name: c.name, look: lk }, line: fill(lh.line, { days: c.days, name: c.name }), tag: 'OUT ' + c.days + ' DAYS', red: true, prio: 2, ttl: 45 });
        var fh = L('first_hurt'); if (fh && other) say({ id: 'first_hurt', kind: 'teach', once: true, who: other, line: fill(fh.line, { name: c.name }), prio: 2, ttl: 90 });
      }
    });
    if (snap && snap.drops && snap.drops.length) setTimeout(function () { tenDrops(snap.drops); }, tenBeat());
  }
  /* what a fight dropped flies into the crew tag (COMBAT names the drop in its word home: drops [{id, kind, name}]) */
  function tenDrops(list) {
    var tag = document.querySelector('#bmtb .t.crew'); if (!tag) return;
    var r = tag.getBoundingClientRect(), W = window.innerWidth, H = window.innerHeight;
    list.forEach(function (it, i) {
      var c = null; try { c = itemIcon(it, 36); } catch (e) {} if (!c) return;
      c.style.position = 'fixed'; c.style.zIndex = 42; c.style.left = Math.round(W / 2 - 18 + (i - (list.length - 1) / 2) * 40) + 'px'; c.style.top = Math.round(H * 0.45) + 'px';
      c.style.transition = 'transform ' + (2 * tenBeat()) + 'ms steps(8,end),opacity ' + tenBeat() + 'ms steps(2,end) ' + (2 * tenBeat()) + 'ms';
      document.body.appendChild(c);
      setTimeout(function () { var b = c.getBoundingClientRect(); c.style.transform = 'translate(' + Math.round(r.left + r.width / 2 - b.left - 18) + 'px,' + Math.round(r.top + r.height / 2 - b.top - 18) + 'px) scale(.5)'; c.style.opacity = '0'; }, 30 + i * tenBeat() / 2);
      setTimeout(function () { try { c.remove(); } catch (e) {} }, 4 * tenBeat() + i * tenBeat());
    });
    tenPost({ kind: 'drops', n: list.length });
  }
  /* nightfall: the day's tally, said by his second (fights won, batteries in and out, days left); one tap */
  var TEN_TALLY = false;   /* __NO_DAILY_RECAP__ */
  function tenNight() {
    var B = window.__BILL || {}, last = B.last || {}, day = last.day || (tenDay() - 1) || 1, inn = 0, out = 0;
    try { purseGet().entries.forEach(function (e) { if (e.currency !== 'electricity' || e.day !== day) return; if (/^start:/.test(String(e.ref || '')) || /^the crew starts/i.test(String(e.reason || ''))) return;   /* the start's own grant is not the day's */ if (e.amount > 0) inn += e.amount; else out -= e.amount; }); } catch (e) {}
    TEN.lastNight = { day: day, won: VOICE.won[day] | 0, in: inn, out: out, days: B.daysLeft, walked: last.walked || null };
    var sec = tenSecond(), l = L('tally');
    var won = VOICE.won[day] | 0;
    /* __NO_DAILY_RECAP__ (RUN 10/25, rule 164 item 6, Paolo on his PC: 'a whole daily recap I never asked for'): the tally stays
       counted in TEN.lastNight for whoever reads it; his second no longer says it at the foot of the map every night */
    if (TEN_TALLY && sec && l) say({ id: 'tally:' + day, kind: 'tally', who: sec, line: fill(l.line, { day: day, won: won, fights: won === 1 ? '1 fight' : won + ' fights', in: inn, out: out, days: B.daysLeft }), tag: 'DAY ' + day, red: !!B.red, prio: 2, ttl: 60, hold: 12 });
    var f = L('first_night'); if (f && sec) say({ id: 'first_night', kind: 'teach', once: true, who: sec, line: f.line, prio: 2, ttl: 90 });
  }
  /* the seven of the eight that are the map's (the first fight's three are COMBAT's): states read on the beat */
  function tenTeach() {
    if (!VOICE.lines) return;
    var sec = tenSecond(); if (!sec) return;
    var t = function (id, why) { var l = L(id); if (!l || VOICE.said[id]) return; if (why === 'done') { VOICE.said[id] = Date.now(); try { localStorage.setItem(VOICE_KEY, JSON.stringify(VOICE.said)); } catch (e) {} return; }
      if (why) say({ id: id, kind: 'teach', once: true, who: sec, line: fill(l.line, { per: (window.__BILL && __BILL.perMan) || 2 }), prio: 4, ttl: l.ttl || 30 }); };
    var held = 0, done = 0; try { held = LOOP.held.length; done = LOOP.done | 0; } catch (e) {}
    /* a job on the phone: said only while he has not taken one (a man who already works knows) */
    var post = document.querySelector('#bmboard .fp.job');
    if (held || done || window.BOH_PHONE_ROUTE) t('phone_job', 'done'); else if (post && post.offsetWidth > 0) t('phone_job', 'now');
    /* a crew in sight: while he has never looked at one */
    var near = false; try { if (window.HUNT) near = true; var pa = (MAP_DREW && MAP_DREW.partyAt) || {}; for (var k in pa) { var g2 = pa[k]; if (Math.max(Math.abs(g2[0] - city.x), Math.abs(g2[1] - city.y)) <= 8) { near = true; break; } } } catch (e) {}
    if ((window.__PARTY_LOOKS | 0) > 0) t('party_sight', 'done'); else if (near) t('party_sight', 'now');
    /* the first town: on the way to one, before he has ever been inside */
    try { if (LOOP.frame && LOOP.frame.style.display === 'block') VOICE.wasTown = true; } catch (e) {}
    var going = false; try { going = !!window.BOH_PHONE_ROUTE || !!(window.loopTownAt && loopTownAt(city.x, city.y, 3)); } catch (e) {}
    if (VOICE.wasTown) t('first_town', 'done'); else if (going) t('first_town', 'now');
    /* the first hire: the crew screen's hires grew */
    var hires = 0; try { hires = (JSON.parse(localStorage.getItem('bohemia.hired.v1') || '[]') || []).length; } catch (e) {}
    if (VOICE.hires == null) VOICE.hires = hires; else if (hires > VOICE.hires) { VOICE.hires = hires; t('first_hire', 'now'); }
  }
  function tenTick() {
    try { var n = window.__BILL_NIGHTS | 0; if (n > VOICE.nights) { VOICE.nights = n; TEN.why = 'night'; tenNight(); } } catch (e) {}
    try { tenWatch(); } catch (e) {}
    try { tenTeach(); } catch (e) {}
    try { voicePump(); } catch (e) {}
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---- THE PARTY PLATE (change 3): a tin tag on the flag, drawn into the map's own canvas ---- */
  var PLATE = { img: {}, cache: {} };
  var PLATE_WORD = ['', 'EASY', 'EVEN', 'BAD ODDS'], PLATE_INK = ['#1f1710', '#1f1710', '#7a4a08', '#7a140c'];
  function plateImg(piece, part) { var k = piece + '/' + part, im = PLATE.img[k];
    if (!im) { im = PLATE.img[k] = new Image(); im.onload = function () { try { if (typeof window.render === 'function') window.render(); } catch (e) {} }; im.src = KIT_BASE + k + '.png'; }
    return im.complete && im.naturalWidth ? im : null; }
  /* the nine pieces laid at s points a texel (corners kept, edges and middle repeated by their period), red when he is hunted */
  function plateSlab(piece, w, h, s, red, dpr) {
    var key = piece + w + 'x' + h + (red ? 'r' : '') + dpr, c = PLATE.cache[key]; if (c) return c;
    var K = KIT[piece], parts = ['tl', 't', 'tr', 'l', 'c', 'r', 'bl', 'b', 'br'], im = {};
    for (var i = 0; i < parts.length; i++) { im[parts[i]] = plateImg(piece, parts[i]); if (!im[parts[i]]) return null; }
    c = document.createElement('canvas'); c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    var x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.scale(dpr, dpr);
    var t = K.ins[0] * s, r = K.ins[1] * s, b = K.ins[2] * s, l = K.ins[3] * s, P = K.P * s;
    var tile = function (img, x0, y0, ww, hh, rx, ry) { for (var yy = y0; yy < y0 + hh; yy += (ry ? P : hh)) for (var xx = x0; xx < x0 + ww; xx += (rx ? P : ww)) {
      var cw = rx ? Math.min(P, x0 + ww - xx) : ww, ch = ry ? Math.min(P, y0 + hh - yy) : hh;
      x.drawImage(img, 0, 0, img.naturalWidth * (cw / (rx ? P : ww)), img.naturalHeight * (ch / (ry ? P : hh)), xx, yy, cw, ch); } };
    tile(im.c, l, t, w - l - r, h - t - b, true, true);
    tile(im.t, l, 0, w - l - r, t, true, false); tile(im.b, l, h - b, w - l - r, b, true, false);
    tile(im.l, 0, t, l, h - t - b, false, true); tile(im.r, w - r, t, r, h - t - b, false, true);
    x.drawImage(im.tl, 0, 0, l, t); x.drawImage(im.tr, w - r, 0, r, t); x.drawImage(im.bl, 0, h - b, l, b); x.drawImage(im.br, w - r, h - b, r, b);
    if (red) { x.globalCompositeOperation = 'source-atop'; x.fillStyle = 'rgba(150,40,22,.55)'; x.fillRect(0, 0, w, h); x.globalCompositeOperation = 'source-over'; }
    return (PLATE.cache[key] = c);
  }
  function plateShade(slab) {
    if (slab.__shade) return slab.__shade;
    var c = document.createElement('canvas'); c.width = slab.width; c.height = slab.height; var x = c.getContext('2d');
    x.drawImage(slab, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = 'rgba(10,6,3,.6)'; x.fillRect(0, 0, c.width, c.height);
    return (slab.__shade = c);
  }
  function plateMan(g, x, y, ink) { for (var yy = 0; yy < TB_MAN.length; yy++) for (var xx = 0; xx < TB_MAN[yy].length; xx++) if (TB_MAN[yy][xx] !== '.') { g.fillStyle = ink; g.fillRect(x + xx, y + yy, 1, 1); } }
  function plateSkull(g, x, y, ink) { var S = ['.####.', '######', '#.##.#', '######', '.####.', '.#..#.']; g.fillStyle = ink; for (var yy = 0; yy < S.length; yy++) for (var xx = 0; xx < 6; xx++) if (S[yy][xx] === '#') g.fillRect(x + xx, y + yy, 1, 1); }
  /* g: the map's canvas; P: RUN's plate (P.info = how many, skulls, where, hunted); true when drawn */
  function partyPlate(g, P) {
    var I = P && P.info; if (!I) return false;
    var dpr = 1; try { dpr = window.CV_DPR || window.devicePixelRatio || 1; } catch (e) {}
    var face = '"BohemiaCasing",ui-sans-serif,sans-serif', top = String(I.count), word = PLATE_WORD[Math.max(1, Math.min(3, I.skulls | 0))];
    var low = String(I.going || '') + (I.hunt && typeof I.blocks === 'number' ? ' · ' + I.blocks + (I.blocks === 1 ? ' BLOCK' : ' BLOCKS') : '');   /* WORDS [eyes: one blocks], rule 150 */
    g.save(); g.font = '12px ' + face; var wTop = g.measureText(top).width, wWord = g.measureText(word).width; g.font = '9px ' + face; var wLow = g.measureText(low).width;
    var row1 = 10 + 3 + wTop + 6 + (I.skulls | 0) * 8 + 4 + wWord, w = Math.ceil(Math.max(row1, wLow) + 16), h = 34;
    var slab = plateSlab('tin', w, h, 0.5, !!I.hunt, dpr); if (!slab) { g.restore(); return false; }
    var cw = (window.CVW || g.canvas.width / dpr), lx = Math.round(Math.max(2, Math.min(cw - w - 2, P.sx - w / 2))), ly = Math.round(P.cy - h - 4);
    g.globalAlpha = 1; g.drawImage(plateShade(slab), lx + 2, ly + 1, w, h);   /* the hard shadow, down and right from the one sun */
    g.drawImage(slab, lx, ly, w, h);
    var ink = I.hunt ? '#3a0a04' : '#1f1710', x0 = lx + 8, y0 = ly + 5;
    plateMan(g, x0, y0 + 1, ink); g.font = '12px ' + face; g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillStyle = ink; g.fillText(top, x0 + 13, y0 + 10);
    var kx = x0 + 13 + wTop + 6; for (var s = 0; s < (I.skulls | 0); s++) plateSkull(g, kx + s * 8, y0 + 3, PLATE_INK[Math.min(3, I.skulls | 0)]);
    g.fillStyle = PLATE_INK[Math.min(3, I.skulls | 0)]; g.fillText(word, kx + (I.skulls | 0) * 8 + 4, y0 + 10);
    g.font = '9px ' + face; g.fillStyle = ink; g.fillText(low, x0, y0 + 22);
    g.restore();
    try { MAP_DREW.partyPlateKit = (MAP_DREW.partyPlateKit | 0) + 1; window.__PLATE_KIT = { x: lx, y: ly, w: w, h: h, top: top, word: word, low: low, hunt: !!I.hunt }; } catch (e) {}
    return true;
  }

  if (TEN_PAGE === 'map') {
    window.addEventListener('message', function (ev) { var d = ev && ev.data; if (!d) return;
      if (d.type === 'BOHEMIA_START' && !VOICE.t0) VOICE.t0 = performance.now();
      if (d.type === 'BOHEMIA_CITY_COMBAT_END') { try { tenFightHome(d); } catch (e) {} } });
    voiceLines(); voiceFaces();
    /* the tag's nine pieces are fetched now, so the first plate he asks for is already tin (the map draws on demand) */
    ['tl', 't', 'tr', 'l', 'c', 'r', 'bl', 'b', 'br'].forEach(function (k) { plateImg('tin', k); });
    setInterval(tenTick, 125);
  }
  /* UI [portrait menu] in the settlement: RUN TWO's CREW is already the same door (engine/bohemia_crew_door.js). His face on it
     was tried this round and taken off: an image beside the word moved the button's box while it loaded and the word's own
     read (THE UI BELONGS TO THE WORLD went 34/2); the button is RUN TWO's to dress with it, measured. */
  TEN.say = say; TEN.voice = VOICE; TEN.partyPlate = partyPlate; TEN.count_ = tenCount; TEN.crewDoor = crewDoor;

  window.BohemiaMaterials = { apply: apply, kit: kit, KIT: KIT, dressKit: dressKit, partyPlate: partyPlate, ten: TEN, cardboard: cardboard, tape: tape, receipt: receipt, glass: glass, cardedge: cardedge, mark: mark, SKIN: SKIN,
    startScreen: startScreen, dressFrontDoor: dressFrontDoor, frontJustTheFont: frontJustTheFont, groundBare: groundBare, settleTag: settleTag, dressSettlement: dressSettlement,
    itemIcon: itemIcon, itemFromRow: itemFromRow, OBJECTS: OBJECTS, supplyIcon: supplyIcon, dressMapBar: dressMapBar, topBar: topBar, topBarFacts: tbFacts, fightNoTop: fightNoTop, dressPhone: dressPhone, dressRoster: dressRoster, dressPosts: dressPosts, drawStars: drawStars, stars: stars,
    hitRead: hitRead, hitReadPlace: hitReadPlace, hitChanceOnButton: hitChanceOnButton, HIT: HIT };
})();
