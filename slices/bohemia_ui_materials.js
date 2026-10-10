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
    + 'html body #sheet .act span{flex:1 1 auto;text-align:left}'
    + 'html body #sheet .act em{color:#3e1608;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:.8px;border-left:1px dashed rgba(42,34,26,.4);padding-left:8px}'
    + 'html body #sheet .act[disabled]{opacity:1;color:#6b5f4f}html body #sheet .act[disabled] em{color:#7a6a58}'
    /* the bag's and the shelf's slots: cracked glass cells, the item's icon, its short name in ROM, the price stamped */
    + 'html body #sheet .slot{border:1px solid #0d0a07;border-radius:2px;background:#16130f var(--bm-glass) center/cover;box-shadow:inset 0 1px 0 rgba(255,236,200,.12)}'
    + 'html body #sheet .slot.full{background:linear-gradient(rgba(12,8,4,.25),rgba(12,8,4,.25)),#3a2c1e var(--bm-cardboard) 0 0/256px 100%}'
    + 'html body #sheet .slot span{font-family:"BohemiaROM",ui-monospace,monospace;font-size:9px;color:#f0e2c4;text-shadow:0 1px 0 #000}'
    + 'html body #sheet .slot em{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:9px;color:#f0c46a;text-shadow:0 1px 0 #000}'
    + 'html body #sheet .gridh{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;letter-spacing:1.4px;color:#e8d8b8}';
  function dressSettlement() {
    if (!document.getElementById('sbody')) return false;
    rootVars(); style('bm-settle', SETTLE_CSS);
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
      case 'tape': rect(2, 2, 6, 6, 'tape'); put(2, 2, null); put(7, 2, null); put(2, 7, null); put(7, 7, null); rect(4, 4, 2, 2, null); put(8, 6, 'tape'); put(9, 7, 'tape'); break;
      case 'water': rect(3, 3, 4, 6, 'blue'); rect(4, 1, 2, 2, 'cap'); rect(3, 5, 4, 1, 'paper'); break;
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
    /* THE BOARD (UI [phone contracts], bohemia_phone_board.js): the valley's open asks above the feed, each a world post
       a thumb can press (44 pt), the skulls drawn, the one marked for the map lit amber like the speed you are at */
    + 'html body #bmboard{flex:0 0 auto;position:relative;z-index:1;padding:4px 5px 3px;border-bottom:1px solid #2e261a}'
    + 'html body #bmboard .fp.job{margin:0 0 3px;padding:5px 6px 6px;min-height:44px;box-sizing:border-box;cursor:pointer;pointer-events:auto;-webkit-tap-highlight-color:transparent;'
    +   'border-radius:2px;background:rgba(240,196,126,.07);box-shadow:inset 2px 0 0 #f0c47e}'
    + 'html body #bmboard .fp.job .txt{margin-top:2px;line-height:1.3}'
    + 'html body #bmboard .fp.job .meta{display:flex;align-items:center;gap:2px;margin-top:3px;font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:8px;letter-spacing:.4px;color:#eadcb4}'
    + 'html body #bmboard .fp.job .meta span{margin-left:4px}'
    + 'html body #bmboard .fp.job .sk{display:block;width:10px;height:10px;background:var(--bm-mark-skull) center/10px 10px no-repeat;image-rendering:pixelated}'
    + 'html body #bmboard .fp.job.picked{background:linear-gradient(#f4cf7c,#d9a650);box-shadow:inset 0 1px 0 rgba(255,240,200,.6),inset 0 -2px 0 rgba(70,40,10,.55)}'
    + 'html body #bmboard .fp.job.picked .who,html body #bmboard .fp.job.picked .txt,html body #bmboard .fp.job.picked .meta{color:#120c06}'
    + 'html body #bmboard .fp.job.picked .sk{background-image:var(--bm-mark-skull-ink)}'
    /* WHEN THE PHONE TURNS (UI [landscape], rule 50b, his Pocket City 2 shot 06): the same buttons re-laid to the corners.
       The bar stays across the top, the speed pad keeps the bottom right (the big action's corner), and the phone, which
       carries the family's faces, goes to the LEFT, where Pocket City keeps its face: from under the bar (its box starts at the bar's foot) to the foot of the
       glass. 390 points of height hold a phone 150 wide at 19.5 by 9 (325 tall); the face row tightens so three faces
       stay 44 points. One class of screen (a phone on its side: landscape, under 500 tall); portrait is untouched. */
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
    + 'html[data-bm-roster] .stats .stars,html[data-bm-roster] .stats .bmstars{display:inline-flex;gap:1px;margin-left:4px;vertical-align:-1px}'
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
    + '.bmstar{display:inline-block;width:10px;height:10px;background:var(--bm-mark-star) center/10px 10px no-repeat;image-rendering:pixelated;vertical-align:-1px}'
    + 'html[data-bm-roster] .stats .bmstar,#sheet .hstats .bmstar{background-image:var(--bm-mark-star-ink)}';
  /* the hire cards at the settlement's hall (RUN TWO's .hire): the same card as a man's page */
  var HIRE_CSS = ''
    + 'html body #sheet .hire{position:relative;border:0;border-radius:2px;padding:12px 8px 8px;margin-top:12px;background:' + CARD_BG + ';box-shadow:inset 0 1px 0 rgba(255,220,170,.22),inset 0 -2px 0 rgba(0,0,0,.45),0 2px 0 #000}'
    + 'html body #sheet .hire::before{content:"";position:absolute;top:-6px;left:50%;width:56px;height:14px;margin-left:-28px;background:var(--bm-tape) center/100% 100%;transform:rotate(2deg);pointer-events:none}'
    + 'html body #sheet .hire .face{border:1px solid #0d0a07;border-radius:0;box-shadow:0 0 0 2px #16130f,0 2px 0 2px #000}'
    + 'html body #sheet .hire .nm{font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-weight:400;letter-spacing:.8px;font-size:12px;color:#f4cf7c}'
    + 'html body #sheet .hire .hstats{margin-top:6px;padding:6px 8px 10px;color:#1f1710;background:#e2dac6 var(--bm-receipt) center/100% 100%;filter:drop-shadow(0 1px 0 rgba(0,0,0,.85));'
    +   'font-family:"BohemiaCasing",ui-sans-serif,sans-serif;font-size:10px;letter-spacing:.4px}'   /* the stamped face: the dot face thins to grey at 10 points */
    + 'html body #sheet .hire .hstats span{color:#1f1710;display:inline-flex;align-items:center;gap:1px;white-space:nowrap}'
    + '.bmstar{display:inline-block;width:10px;height:10px;background:var(--bm-mark-star) center/10px 10px no-repeat;image-rendering:pixelated;vertical-align:-1px}'
    + 'html body #sheet .hire .hstats .bmstar{background-image:var(--bm-mark-star-ink)}';
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
    if (!R.getPropertyValue('--bm-mark-star')) { R.setProperty('--bm-mark-star', 'url(' + mark('star', '#f4cf7c').toDataURL('image/png') + ')');
      R.setProperty('--bm-mark-star-ink', 'url(' + mark('star', '#3e1608').toDataURL('image/png') + ')'); }
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
  function dressPhone() {
    if (!document.getElementById('cityfeed')) return false;
    rootVars();
    var R = document.documentElement.style;
    if (!R.getPropertyValue('--bm-mark-skull')) { R.setProperty('--bm-mark-skull', 'url(' + mark('skull', '#eadcb4').toDataURL('image/png') + ')');
      R.setProperty('--bm-mark-skull-ink', 'url(' + mark('skull', '#120c06').toDataURL('image/png') + ')'); }
    style('bm-phone', PHONE_CSS);
    /* the city sizes its map from its column when it boots, which can be before this sheet lands: a phone on its side
       then drew the old 628 and left a black band where the column grew (UI [the sideways sides]); ask it to measure again */
    try { setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 0); setTimeout(function () { window.dispatchEvent(new Event('resize')); }, 1500); } catch (e) {}
    return true;
  }
  function dressAll() { dressFrontDoor(); dressSettlement(); if (document.getElementById('sbody')) { iconTheMarket(); dressPosts(); } dressMapBar(); dressPhone(); dressRoster();
    /* the bar and the pad are built after load by the city's own modules: try again until they exist */
    if (!document.getElementById('bm-mapbar')) { var tries = 0, iv = setInterval(function () { if (dressMapBar() || ++tries > 40) clearInterval(iv); }, 500); } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', dressAll); else dressAll();

  window.BohemiaMaterials = { apply: apply, cardboard: cardboard, tape: tape, receipt: receipt, glass: glass, cardedge: cardedge, mark: mark, SKIN: SKIN,
    startScreen: startScreen, dressFrontDoor: dressFrontDoor, settleTag: settleTag, dressSettlement: dressSettlement,
    itemIcon: itemIcon, itemFromRow: itemFromRow, OBJECTS: OBJECTS, supplyIcon: supplyIcon, dressMapBar: dressMapBar, dressPhone: dressPhone, dressRoster: dressRoster, dressPosts: dressPosts, drawStars: drawStars };
})();
