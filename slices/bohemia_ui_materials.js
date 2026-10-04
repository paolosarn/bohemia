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
  /* thermal receipt paper: warm white, faded print rows, a curl shadow at the foot */
  function receipt() {
    const w = 200, h = 120, c = canvas(w, h), g = c.getContext('2d');
    const lg = g.createLinearGradient(0, 0, 0, h); lg.addColorStop(0, '#e7e0cd'); lg.addColorStop(.85, '#d8cfb8'); lg.addColorStop(1, '#b9ae95');
    g.fillStyle = lg; g.fillRect(0, 0, w, h);
    for (let y = 8; y < h - 10; y += 9) { g.fillStyle = 'rgba(60,50,40,' + (.04 + rnd() * .05).toFixed(3) + ')'; g.fillRect(6, y, w - 12 - rnd() * 60, 2); }
    grain(g, w, h, 900, .08, false);
    return c;
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
    root.dataset.materials = '1';
  }
  window.BohemiaMaterials = { apply: apply, cardboard: cardboard, tape: tape, receipt: receipt, glass: glass };
})();
