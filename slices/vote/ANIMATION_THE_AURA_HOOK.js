/* ANIMATION [the aura of the one you control], 10/19: LAYS THE AURA ON THE REAL FIGHT FROM OUTSIDE IT. The fight
   (slices/BOHEMIA_FIGHT.html, COMBAT's) is not edited: its top-level blitMan is a property of its window, so this wraps it
   in the page that holds the fight (the VOTE page's live board, the filming tool). For the man whose turn it is AND whom
   you control (the fight's own crewControlled: yours, not on auto, not fleeing), the wrapper takes the exact blit the game
   was about to make, draws the aura 'behind', makes the blit, then draws the aura 'front'. Every other man, a beast, a
   body on the ground, the deploy and the end are drawn exactly as before.
   BOHEMIA_AURA_HOOK(win, kindOf, timeOf): kindOf() names the candidate ('echo' | 'tear' | 'current' | '' for none);
   timeOf (optional) gives the beat clock in ms, else the fight's own (performance.now() - FIGHT_UI.t0). */
window.BOHEMIA_AURA_HOOK = function (win, kindOf, timeOf) {
  'use strict';
  if (!win || !win.blitMan || win.blitMan.__aura) return false;
  /* the fight's cx, DB and FIGHT are top-level consts: on its global scope, not on its window, so they are read by eval */
  const orig = win.blitMan, cx = win.eval('cx'), DB = win.eval('DB'), F = win.eval('FIGHT'), AURA = window.BOHEMIA_AURA;
  const draw = win.CanvasRenderingContext2D.prototype.drawImage;
  const wrapped = function (v, X, feet, h, face, now, fallen) {
    const kind = kindOf(), u = F.current();
    if (!kind || fallen || v !== u || F.S.deploy || F.S.over || !win.crewControlled(u) || win.beastOf(v)) return orig.apply(this, arguments);
    let cap = null;
    cx.drawImage = function () { cap = Array.prototype.slice.call(arguments); };
    try { orig.apply(this, arguments); } finally { delete cx.drawImage; }
    if (!cap) return;
    const P = DB.people, bb = P.figure_bbox, k = h / bb[3], beat = win.beatMs();
    const t = timeOf ? timeOf() : performance.now() - win.FIGHT_UI.t0;
    const frame = { img: cap[0], sx: cap[1], sy: cap[2], sw: cap[3], sh: cap[4], dx: cap[5], dy: cap[6], dw: cap[7], dh: cap[8] };
    /* the ahead copy wears the pose he is about to take: a stride of his own walk, a new one each beat (GDD v2 s15: the bar
       shows where a man is going) */
    const walk = P.cols.indexOf('walk@0'), stride = Math.floor(Math.max(0, t) / beat) % 4;
    const future = walk < 0 ? null : Object.assign({}, frame, { sx: (walk + stride) * P.frame });
    const o = { k: k, X: X, feet: feet, frame: frame, future: future, face: face > 0 ? 'SE' : 'SW', t: t, beat: beat, size: 'fight' };
    win.__auraLast = { X: X, feet: feet, h: h, k: k, face: o.face, kind: kind, id: v.id };
    AURA.draw(kind, 'behind', cx, o);
    draw.apply(cx, cap);
    AURA.draw(kind, 'front', cx, o);
  };
  wrapped.__aura = true;
  win.blitMan = wrapped;
  return true;
};

/* THE SAME AURA ON THE BIG MAP, THE MAP'S SIZE (rule 120(c): 'even on the big map'; RUN [the aura on the map] takes it from
   here). The map (slices/BOHEMIA_CITY_WORLD.html, RUN's) draws his body inline, one five-argument drawImage of his rig
   sprite at half (his 56 on the glass), and writes where it stood into MAP_DREW.you after. So this watches the map's own
   context: a five-argument blit at half its image's size, standing where he stood a frame ago (three pixels either way,
   his company walks eight back and fifteen aside), is his body; the aura is drawn round it at size 'map' on the map's
   own beat (mapArtBeat: performance.now() over the beat). Nothing in the map's file changes; when RUN builds it in, the
   two draw calls go where his body is drawn and this goes away.
   BOHEMIA_AURA_MAP_HOOK(win, kindOf, timeOf) */
window.BOHEMIA_AURA_MAP_HOOK = function (win, kindOf, timeOf) {
  'use strict';
  const g = win.eval('g'), AURA = window.BOHEMIA_AURA;
  if (!g || g.drawImage.__aura) return false;
  const draw = win.CanvasRenderingContext2D.prototype.drawImage;
  const beat = function () { return typeof win.BEAT === 'number' ? win.BEAT : 500; };
  const wrapped = function (img, a, b, c, d) {
    const kind = kindOf(), you = win.MAP_DREW && win.MAP_DREW.you;
    if (!kind || arguments.length !== 5 || !you || you.how !== 'rig' || !img || !img.width
      || Math.abs(c - img.width / 2) > 0.01 || Math.abs(a - (you.x - c / 2)) > 3 || Math.abs(b - (you.y - d * 0.93)) > 3) return draw.apply(g, arguments);
    const k = c / img.width * (img.width / 112);   /* the map's 112 box at half: an art pixel of the rig is half a css px */
    const frame = { img: img, sx: 0, sy: 0, sw: img.width, sh: img.height, dx: a, dy: b, dw: c, dh: d };
    const t = timeOf ? timeOf() : performance.now();
    const o = { k: k, X: a + c / 2, feet: b + d * 0.93, frame: frame, face: you.face || 'S', t: t, beat: beat(), size: 'map' };
    win.__auraLast = { X: o.X, feet: o.feet, h: d, k: k, face: o.face, kind: kind };
    AURA.draw(kind, 'behind', g, o);
    draw.call(g, img, a, b, c, d);
    AURA.draw(kind, 'front', g, o);
  };
  wrapped.__aura = true;
  g.drawImage = wrapped;
  return true;
};
