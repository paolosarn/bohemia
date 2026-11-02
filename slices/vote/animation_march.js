/* THEY MEND ON THE MARCH, the vote page's player (ANIMATION, ask line 314). His three (YOU, DESI, RAUL: the company the demo
   starts with, in the gear the crew list gives them) walking on a scrap of the valley's ground, each on his OWN MAP WALK (the map's
   sheets), the act drawn the way the map draws it (engine/bohemia_march_acts.js picks the cell, his worn plate and helmet laid on
   by CHARACTER's wear player found on his walk frame, his arms again on top). Nothing here is drawn by hand but the ground. */
(function () {
  'use strict';
  var ACT = window.MARCH_ACT || 'auto';
  var MEN = [
    { who: 'you', look: 'you', name: 'YOU', gear: { head: 'open_leather_cap', body: 'padded_surcoat' }, sheet: '../BOHEMIA_RIG_YOU' },
    { who: 'crew:person_town_0', look: 'person_town_0', name: 'DESI', gear: { head: 'hood', body: 'gambeson' }, sheet: '../rig_mix/town' },
    { who: 'crew:person_town_1', look: 'person_town_1', name: 'RAUL', gear: { head: 'leather_headband', body: 'padded_vest' }, sheet: '../rig_mix/town' }
  ];
  /* who does what in each act's showing: the bandage and the tape together (the brief's picture), then the pills and the helmet
     (the helmet on YOU: his open leather hard hat is the one real helmet of the three) */
  var PLAN = { bind: [['crew:person_town_0', 'bind']], pills: [['crew:person_town_1', 'pills']], tape: [['crew:person_town_1', 'tape']],
               helmet: [['you', 'helmet']], auto: null };
  var AUTO = [[['crew:person_town_0', 'bind'], ['crew:person_town_1', 'tape']], [['you', 'helmet'], ['crew:person_town_1', 'pills']],
              [['crew:person_town_0', 'pills'], ['you', 'tape']]];
  var cv = document.getElementById('cv'), g = cv.getContext('2d'), st = document.getElementById('state');
  var FACE = 'SE', ZOOM = 3, SHEETS = {}, t0 = performance.now(), round = 0, lastStart = -1e9;
  var DIR = { S: [0, 1], SE: [0.7, 0.7], E: [1, 0], SW: [-0.7, 0.7], W: [-1, 0] };
  function loadSheet(name) {
    if (SHEETS[name]) return SHEETS[name];
    var S = SHEETS[name] = { m: null, img: null };
    fetch(name + '.json').then(function (r) { return r.json(); }).then(function (m) { var im = new Image(); im.onload = function () { S.m = m; S.img = im; }; im.src = name + '.png'; });
    return S;
  }
  MEN.forEach(function (m) { loadSheet(m.sheet); });
  window.BohemiaWear && BohemiaWear.know(MEN.map(function (m) { return { look: m.look, gear: m.gear }; }));
  window.BohemiaWear && BohemiaWear.load();
  BohemiaMarch.load();
  function walkCell(man, face, k) {
    var S = SHEETS[man.sheet]; if (!S || !S.m) return null;
    var m = S.m, gi = m.gangs.indexOf(man.look), di = m.dirs.indexOf(face); if (gi < 0 || di < 0) return null;
    var H = 130; while (Math.round(H * 0.93) < m.foot) H++;
    return { img: S.img, x: (k + 1) * m.w, y: (gi * m.dirs.length + di) * m.h, w: m.w, h: m.h, dx: 56 - m.w / 2, dy: Math.round(H * 0.93) - m.foot, W: 112, H: H };
  }
  function ground(dx, dy) {
    var W = cv.width, H = cv.height, T = 24 * ZOOM;
    g.fillStyle = '#2a2520'; g.fillRect(0, 0, W, H);
    for (var y = -T; y < H + T; y += T) for (var x = -T; x < W + T; x += T) {
      var xx = Math.floor(x - (dx % T)), yy = Math.floor(y - (dy % T)), h = ((Math.floor((x + dx) / T) * 73856093) ^ (Math.floor((y + dy) / T) * 19349663)) >>> 0;
      g.fillStyle = ['#2d2822', '#29241e', '#302a23', '#26221c'][h & 3]; g.fillRect(xx, yy, T, T);
      if ((h >> 3) % 9 === 0) { g.fillStyle = '#1d1a16'; g.fillRect(xx + (h % T), yy + ((h >> 5) % T), ZOOM * 3, ZOOM); }
    }
    /* the tape's own noise, a line of it rolling (the analog horror bible's held key, not a filter) */
    var ln = Math.floor((performance.now() / 23) % H); g.fillStyle = 'rgba(232,224,204,0.035)'; g.fillRect(0, ln, W, ZOOM * 2);
  }
  function startPlan() {
    var list = ACT === 'auto' ? AUTO[round++ % AUTO.length] : PLAN[ACT];
    list.forEach(function (p) { BohemiaMarch.force(p[0], p[1]); });
  }
  function frame() {
    requestAnimationFrame(frame);
    var W = cv.clientWidth; if (cv.width !== W * 1) { cv.width = W; cv.height = Math.round(W * 0.86); }
    var now = performance.now(), sec = (now - t0) / 1000, speed = 26 * ZOOM / 1.0;   /* a stride a second, his glide's pace */
    var d = DIR[FACE] || DIR.SE, gx = d[0] * sec * speed, gy = d[1] * sec * speed;
    ground(gx, gy);
    var ready = BohemiaMarch.ready() && MEN.every(function (m) { var S = SHEETS[m.sheet]; return S && S.m; });
    st.textContent = ready ? (Object.keys(BohemiaMarch.acting()).length ? 'AT WORK' : 'WALKING') : 'LOADING';
    if (!ready) return;
    var act = BohemiaMarch.acting();
    if (!Object.keys(act).length && now - lastStart > 4000) { startPlan(); lastStart = now; }
    var cx = cv.width / 2, cy = cv.height - 30, sp = Math.min(34 * ZOOM, cv.width * 0.3);
    var spots = [[0, 0], [-sp, -10], [sp, -6]];   /* side by side across the glass, so each man's hands read; the map keeps its own formation */
    var order = [0, 1, 2].sort(function (a, b) { return spots[a][1] - spots[b][1]; });
    order.forEach(function (i) {
      var man = MEN[i], ph = (sec * 1.0 + i * 0.37) % 1, k = Math.floor(ph * 6) % 6;
      var c = walkCell(man, FACE, k); if (!c) return;
      var s = ZOOM / 2, bx = Math.round(cx + spots[i][0] - 56 * s), by = Math.round(cy + spots[i][1] - Math.round(c.H * 0.93) * s);
      g.imageSmoothingEnabled = false;
      g.fillStyle = 'rgba(10,8,6,0.45)'; g.beginPath(); g.ellipse(cx + spots[i][0], cy + spots[i][1], 112 * s * 0.22, 112 * s * 0.07, 0, 0, 7); g.fill();
      var q = BohemiaMarch.frame(man.who, man.look, null, FACE, ph, true, now);
      if (q) { var e = q.cell; g.drawImage(q.img, e[0], e[1], e[2], e[3], bx + (c.dx + e[4]) * s, by + (c.dy + e[5]) * s, e[2] * s, e[3] * s); }
      else g.drawImage(c.img, c.x, c.y, c.w, c.h, bx + c.dx * s, by + c.dy * s, c.w * s, c.h * s);
      if (window.BohemiaWear && BohemiaWear.ready()) BohemiaWear.on(g, c, bx, by, s, ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'].indexOf(FACE), BohemiaWear.wearOf(man.look),
        { who: 'vote:' + man.look, where: 'vote', headAt: q && q.helm ? [c.dx + q.helm[0], c.dy + q.helm[1]] : null });
      if (q) { var e2 = q.cell; g.drawImage(q.front, e2[0], e2[1], e2[2], e2[3], bx + (c.dx + e2[4]) * s, by + (c.dy + e2[5]) * s, e2[2] * s, e2[3] * s); }
      g.fillStyle = '#a49a86'; g.font = '11px ui-monospace,monospace'; g.textAlign = 'center';
      g.fillText(man.name + (act[man.who] ? ' · ' + act[man.who].toUpperCase() : ''), cx + spots[i][0], cv.height - 8);
    });
  }
  document.querySelectorAll('[data-face]').forEach(function (b) { b.onclick = function () {
    FACE = b.getAttribute('data-face'); document.querySelectorAll('[data-face]').forEach(function (x) { x.classList.toggle('on', x === b); }); }; });
  document.getElementById('zoom').onclick = function () { ZOOM = ZOOM === 3 ? 2 : ZOOM === 2 ? 4 : 3; this.textContent = ZOOM === 2 ? 'MAP SIZE' : ZOOM === 3 ? 'CLOSER' : 'CLOSEST'; };
  requestAnimationFrame(frame);
})();
