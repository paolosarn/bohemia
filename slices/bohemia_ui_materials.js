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
  window.BohemiaMaterials = { apply: apply, cardboard: cardboard, tape: tape, receipt: receipt, glass: glass, cardedge: cardedge, mark: mark, SKIN: SKIN };
})();
