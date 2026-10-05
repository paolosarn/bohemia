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
           '000000000001', '000000000010', '111100000010', '111000000100', '011000001000', '000111110000']
  };
  function mark(k) {
    const rows = MARKS[k], c = canvas(36, 36), g = c.getContext('2d');
    g.fillStyle = '#2a221a';
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
    + 'html body #newco .row button.on{color:#1c140c;background:linear-gradient(#e9bd62,#b07c30);box-shadow:inset 0 1px 0 rgba(255,240,200,.6)}'
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
    var root = document.createElement('div'); root.className = 'bm-start'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'start');
    var W = Math.max(320, Math.min(1400, Math.round(innerWidth))), H = Math.max(320, Math.min(1400, Math.round(innerHeight)));
    var gr = ground(Math.round(W / 2), Math.round(H / 2)); gr.className = 'gr'; root.appendChild(gr);
    var t = document.createElement('div'); t.className = 't';
    /* his approved wordmark when the page has it (#logobig), else the name in the casing face */
    var src = document.getElementById('logobig'), mark = null;
    if (src) { mark = document.createElement('canvas'); mark.width = src.width; mark.height = src.height; t.appendChild(mark); }
    else { var wd = document.createElement('div'); wd.className = 'word'; wd.textContent = 'BOHEMIA'; t.appendChild(wd); }
    var sub = document.createElement('div'); sub.className = 'sub'; sub.textContent = opts.sub || 'POST-ECONOMIC APOCALYPSE - LAS VEGAS'; t.appendChild(sub);
    root.appendChild(t);
    var m = document.createElement('div'); m.className = 'm';
    m.innerHTML = '<button class="b card" data-k="new"><span class="tp2"></span><span class="tx"><b>NEW GAME</b><i>PICK YOUR CREW</i></span></button>'
      + '<button class="b rec" data-k="continue"><span class="tx"><b>CONTINUE</b><i>NO RUN SAVED</i></span></button>'
      + '<button class="b pane" data-k="settings"><span class="tx"><b>SETTINGS</b><i>SOUND &middot; TEXT &middot; BRIGHTNESS</i></span></button>';
    root.appendChild(m);
    var stamp = document.createElement('div'); stamp.className = 'stamp'; var bs = document.getElementById('buildstamp'); stamp.textContent = bs ? bs.textContent.trim() : ''; root.appendChild(stamp);
    var q = function (k) { return m.querySelector('[data-k="' + k + '"]'); };
    var MK = { 'new': ['new', '#f0c46a'], 'continue': ['cont', '#5a3a14'], 'settings': ['set', '#f0c46a'] };
    ['new', 'continue', 'settings'].forEach(function (k) { q(k).style.setProperty('--bm-mark', 'url(' + markURL(MK[k][0], MK[k][1]) + ')'); });
    var call = function (fn) { return function (e) { e.stopPropagation(); if (typeof fn === 'function') fn(e); }; };
    q('new').addEventListener('click', call(opts.onNew)); q('continue').addEventListener('click', call(opts.onContinue)); q('settings').addEventListener('click', call(opts.onSettings));
    ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'mousedown', 'mouseup', 'click'].forEach(function (ev) { root.addEventListener(ev, function (e) { e.stopPropagation(); }); });
    host.appendChild(root);
    var copyT = 0, copy = function () { if (!mark || !src) return; try { mark.getContext('2d').drawImage(src, 0, 0); } catch (e) {} if (++copyT < 20) setTimeout(copy, 500); };
    copy();
    var api = {
      root: root,
      paint: function (saved) {
        var c = q('continue'); c.disabled = !saved;
        c.querySelector('i').textContent = saved ? ((saved.day ? 'DAY ' + saved.day : 'YOUR RUN') + (saved.min == null ? '' : ' \u00b7 ' + clockOf(saved.min))) : 'NO RUN SAVED';
      },
      arm: function (line) { var n = q('new'); n.classList.add('armed'); n.querySelector('b').textContent = 'TAP AGAIN'; n.querySelector('i').textContent = line || 'YOUR RUN IS KEPT ASIDE'; },
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
    + 'html body #sheet .act span{text-align:left}'
    + 'html body #sheet .act em{color:#3e1608;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:.8px;border-left:1px dashed rgba(42,34,26,.4);padding-left:8px}'
    + 'html body #sheet .act[disabled]{opacity:1;color:#6b5f4f}html body #sheet .act[disabled] em{color:#7a6a58}';
  function dressSettlement() {
    if (!document.getElementById('sbody')) return false;
    rootVars(); style('bm-settle', SETTLE_CSS);
    try { document.fonts.load('13px "BohemiaCasing"'); document.fonts.load('11px "BohemiaROM"'); } catch (e) {}
    return true;
  }
  function dressAll() { dressFrontDoor(); dressSettlement(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dressAll); else dressAll();

  window.BohemiaMaterials = { apply: apply, cardboard: cardboard, tape: tape, receipt: receipt, glass: glass, cardedge: cardedge, mark: mark, SKIN: SKIN,
    startScreen: startScreen, dressFrontDoor: dressFrontDoor, settleTag: settleTag, dressSettlement: dressSettlement };
})();
