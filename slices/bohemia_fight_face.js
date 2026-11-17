/* ==== __THE_FACE_SHOWS_UNDER_THE_HELMET__ (FIGHT SCREEN TWO 11/17/26; ask row 630, VAMILY rules 450(a), 441; the law EVERYBODY HAS A FACE) ====
   EYES walked the builds on a phone: 'the man's sheet, the why line's face and the phone's fight panel draw the crew's portrait so
   the helmet fills two thirds of the frame: YOU and DESI show a nose and a mouth and no eyes; RAUL shows the helmet and nothing
   else. Blank faces are the defect.'
   MEASURED (the fight's own page, the three of the crew, three pieces of head gear each): PORTRAIT's cell is cut close to the head
   (his crown at the cell's first row, his head 106 to 128 of its 128 points across), and the head gear is stood on the middle of
   his head and sized to his head across (engine/bohemia_wear.js face(), CHARACTER's, rule 272: right for the body it was made
   for). On a cell with no room over the crown the gear's dome is cut off by the frame and what is left of it lies over his eyes.
   THE FRAME NOW, wherever this lane draws a face with head gear (the fight's drawPortrait: the strip, the phone's card, his
   sheet, the speaking cards; the opening card's rows and its speaking face):
     1. THE PICTURE STANDS BACK, AS FAR AS THIS GEAR NEEDS: how far the gear reaches over the cell and past its sides is measured
        once off the wear file's own drawing; the face is drawn that much smaller, stood on the frame's foot, so the whole of
        the gear is inside the frame (a mask needs nothing and his face stays full size; a tall hat stands him back the most,
        never past 64 parts in 100).
     2. HIS EYES READ: the gear is drawn whole and then opened in one band across his eyes (from his brow to under his eyes,
        measured off his own picture the way the wear file measures it), the way a helmet is cut for the man inside it. What
        is over the band (the dome) and under it (a mask, a cheek plate, mail) stays.
   Nothing of the wear file, the gear's pictures or PORTRAIT's cells is edited; a face with no head gear is drawn as before.
     BohemiaFightFace.draw(g, img, crop, S, wear, look, redo, x, y)   the face with its gear into g at x, y, S by S; false when he
                                                                       wears nothing on his head (the caller draws him as before)
     BohemiaFightFace.said                                             the last frame it made, for the gates and EYES ==== */
(function (root) {
  'use strict';
  var RIM = 0.10;     /* the rim the fight draws round a face, as a part of the frame: the gear's crown is kept under it, not behind it */
  var MINZ = 0.64;    /* the face never stands back past this part of the frame (a hat taller than that is cut by the frame, never the face lost) */
  var BROW = 0.07, UNDER = 0.14;   /* the band his eyes read through: from this far over the middle of his head to this far under it, as parts of his head across */
  var A = typeof WeakMap === 'function' ? new WeakMap() : null, X = typeof WeakMap === 'function' ? new WeakMap() : null, SCR = null, api = { MINZ: MINZ, BROW: BROW, UNDER: UNDER, said: null, n: 0 };
  /* the middle of his head and his head across, the wear file's own reading (the widest row in the top two thirds of his picture) */
  function anchor(img, crop) {
    if (!A) return null;
    var per = A.get(img); if (!per) { per = {}; A.set(img, per); }
    var key = crop ? crop.join(',') : 'all'; if (per[key] !== undefined) return per[key];
    var a = null;
    try {
      var sx = crop ? crop[0] : 0, sy = crop ? crop[1] : 0, w = crop ? crop[2] : img.naturalWidth || img.width, h = crop ? crop[3] : img.naturalHeight || img.height;
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      var g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, sx, sy, w, h, 0, 0, w, h);
      var d = g.getImageData(0, 0, w, h).data, best = null, top = -1;
      for (var y = 0; y < Math.floor(h * 0.68); y++) { var x0 = -1, x1 = -1;
        for (var x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] >= 128) { if (x0 < 0) x0 = x; x1 = x; }
        if (x0 < 0) continue; if (top < 0) top = y; if (!best || x1 - x0 > best[2] - best[1]) best = [y, x0, x1]; }
      if (best) { var bw = best[2] - best[1] + 1; a = { cy: top <= 1 ? best[0] : Math.min(best[0], top + bw / 2), w: bw, iw: w, ih: h, top: top }; }
    } catch (e) { a = null; }
    per[key] = a; return a;
  }
  /* how far this gear on this head reaches past the cell (over it and past its sides), as parts of the cell: measured once off the
     wear file's own drawing, so the frame stands back only as far as this gear needs (a mask needs nothing, a straw hat a lot) */
  function reach(W, img, crop, wear, look, redo) {
    if (!X) return null;
    var per = X.get(img); if (!per) { per = {}; X.set(img, per); }
    var key = (crop ? crop.join(',') : 'all') + '|' + (wear ? String(wear.head) : '') + '|' + (look || ''); if (per[key]) return per[key];
    var R = 96, c = document.createElement('canvas'); c.width = R * 3; c.height = R * 2;
    var t = c.getContext('2d', { willReadFrequently: true }); t.translate(R, R);
    var ok = false; try { ok = !!W.face(t, img, R, look || null, wear || null, redo, crop); } catch (e) { ok = false; }
    if (!ok) return null;
    var d = t.getImageData(0, 0, c.width, c.height).data, top = 1e9, left = 1e9, right = -1;
    for (var y = 0; y < c.height; y++) for (var x = 0; x < c.width; x++) if (d[(y * c.width + x) * 4 + 3] >= 64) { if (y < top) top = y; if (x < left) left = x; if (x > right) right = x; }
    if (right < 0) return null;
    per[key] = { top: (top - R) / R, left: (left - R) / R, right: (right + 1 - R) / R };
    return per[key];
  }
  function draw(g, img, crop, S, wear, look, redo, x, y) {
    var W = root.BohemiaWear; if (!W || W.off || !W.face || !img) return false;
    var a = anchor(img, crop); if (!a) return false;
    var e = reach(W, img, crop, wear, look, redo); if (!e) return false;
    /* the frame the caller draws round the picture (the side's rim) lies over its edge: the gear stands clear of it */
    var rt = e.top < RIM ? (RIM - e.top) / (1 - RIM) : 0, side = Math.max(RIM - e.left, e.right - 1 + RIM), rs = side > 0 ? side / (1 - 2 * RIM) : 0;   /* so the gear's edge lands RIM of the frame inside it, whatever the scale */
    var z = Math.max(MINZ, Math.min(1, 1 / (1 + rt), 1 / (1 + 2 * rs)));
    var pw = Math.ceil(S * rs), ph = Math.ceil(S * rt), SW = S + 2 * pw, SH = S + ph;
    if (!SCR) SCR = document.createElement('canvas');
    if (SCR.width !== SW || SCR.height !== SH) { SCR.width = SW; SCR.height = SH; }
    var t = SCR.getContext('2d'); t.setTransform(1, 0, 0, 1, 0, 0); t.globalCompositeOperation = 'source-over'; t.globalAlpha = 1; t.clearRect(0, 0, SW, SH);
    t.save(); t.translate(pw, ph);
    var ok = false; try { ok = !!W.face(t, img, S, look || null, wear || null, redo, crop); } catch (err) { ok = false; }
    t.restore();
    if (!ok) return false;
    /* the band his eyes read through */
    var m = S / a.iw, y0 = (a.cy - BROW * a.w) * m, y1 = (a.cy + UNDER * a.w) * m;
    t.clearRect(0, Math.round(ph + y0), SW, Math.max(1, Math.round(y1 - y0)));
    /* the picture stands back as far as this gear needs: the face on the frame's foot, the gear over it, one scale */
    var fw = S * z, fx = (x || 0) + (S - fw) / 2, fy = (y || 0) + (S - fw);
    var sm = g.imageSmoothingEnabled; g.imageSmoothingEnabled = true;
    if (crop) g.drawImage(img, crop[0], crop[1], crop[2], crop[3], fx, fy, fw, fw); else g.drawImage(img, fx, fy, fw, fw);
    g.drawImage(SCR, 0, 0, SW, SH, fx - pw * z, fy - ph * z, SW * z, SH * z);
    g.imageSmoothingEnabled = sm;
    api.n++; api.said = { look: look || null, wear: wear || null, size: S, z: Math.round(z * 1000) / 1000, eyes: [Math.round((fy - (y || 0) + y0 * z) * 10) / 10, Math.round((fy - (y || 0) + y1 * z) * 10) / 10], face: [Math.round(fx - (x || 0)), Math.round(fy - (y || 0)), Math.round(fw), Math.round(fw)] };
    return true;
  }
  api.draw = draw; api.anchor = anchor;
  root.BohemiaFightFace = api;
})(typeof window !== 'undefined' ? window : this);
