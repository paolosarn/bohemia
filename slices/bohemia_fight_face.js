/* ==== __THE_FACE_SHOWS_UNDER_THE_HELMET__ (FIGHT SCREEN TWO 11/17/26, REBUILT 11/18/26; ask rows 630 and 648, VAMILY rules 450(a),
   441; the law EVERYBODY HAS A FACE) ====
   ROW 630, EYES: 'the crew's portrait is all helmet: YOU and DESI show a nose and a mouth and no eyes; RAUL the helmet only.'
   ROW 648, EYES, on this lane's first answer: 'THE FACE HAS A SEAM: the helmet is cut straight across above the eyes and its brim
   floats across the nose and mouth; at the sheet's size RAUL is still a dome with a slit.' The first answer opened a band in the
   gear over his eyes. That was a cut, and a cut is a seam. IT IS GONE: nothing of the gear is cleared any more.
   THE CAUSE, MEASURED (every head piece in the wear table on each of the crew, the gear drawn alone and read): CHARACTER's portrait
   pieces are whole and right (a dome and its brim, a coif with its face hole, a mask), but they were drawn for a head taller than
   it is wide (the model's), and PORTRAIT's cell is a head about as tall as it is wide, cut close. Stood on the middle of his head
   and sized to his head across (engine/bohemia_wear.js face(), rule 272), a brim made to sit on a tall head's brow lands a fifth
   of a head lower on this one: on his eyes. Three kinds of piece, told apart by what the piece's own picture covers:
     a HAT     covers the middle of his face at his eye line and ends above his mouth (a hard hat, a cap, a kettle hat, a wrap): a
               brim on his eyes. FITTED: the whole piece is moved, and pressed no flatter than SQUASH, so its brim's lower edge
               sits on his brow and its crown stands ROOM over his own. Pressing a brim seen from above is turning it to the
               angle his face is seen from.
     a MASK    that begins at his eyes and hangs below (a mouthpiece): moved down whole so it begins under his eyes.
     a FACE    of its own (a closed helm, a gas mask, a welding mask: it covers him down past his mouth) and an OPEN piece (a coif,
               a hood, a visor he is seen through, a headband): left whole where the wear file puts it.
   His eye line is read off his own picture (the dark row with skin over and under it, where his eyes are either side of his
   nose); a picture that will not give one (a face with a visor of its own) takes the middle of PORTRAIT's cells.
   THE PICTURE STILL STANDS BACK AS FAR AS THIS GEAR NEEDS, so the whole piece is inside the frame; a fitted hat needs far less
   room than a hat left low, so his face is bigger than it was (the crew's hard hat: 82 parts in 100, from 69).
   Nothing of the wear file, the gear's pictures or PORTRAIT's cells is edited; a face with no head gear is drawn as before.
     BohemiaFightFace.draw(g, img, crop, S, wear, look, redo, x, y)   the face with its gear into g at x, y, S by S; false when he
                                                                       wears nothing on his head (the caller draws him as before)
     BohemiaFightFace.layer(img, crop, S, wear, look, plain)          the gear alone as it is drawn (plain: as the wear file
                                                                       draws it, unfitted), for the gates
     BohemiaFightFace.said                                             the last frame it made, for the gates and EYES ==== */
(function (root) {
  'use strict';
  var RIM = 0.10;      /* the rim the fight draws round a face, as a part of the frame: the gear's crown is kept under it, not behind it */
  var MINZ = 0.64;     /* the face never stands back past this part of the frame (a hat taller than that is cut by the frame, never the face lost) */
  var BROW = 0.11;     /* where a brim sits: this far over his eye line, as a part of his head across */
  var UNDER = 0.08;    /* where a mask begins: this far under his eye line */
  var ROOM = 0.14;     /* a fitted hat's crown stands this far over his own */
  var SQUASH = 0.6;    /* a fitted hat is never pressed flatter than this part of its own height */
  var FULL = 0.53;     /* gear that covers the middle of his face further under his eye line than this is a face of its own (measured: every hat ends by 0.47, every closed helm and mask runs past 0.59) */
  var MASK = 0.3;      /* a piece that begins at his eyes is a mask only if it hangs this far under them (a headband that slipped is a hat) */
  var EYES = [0.44, 0.57], MID = 0.49;   /* his eye line as a part of his head's height in PORTRAIT's cells: where a read is believed, and the middle taken when it is not */
  var H = typeof WeakMap === 'function' ? new WeakMap() : null, X = typeof WeakMap === 'function' ? new WeakMap() : null;
  var api = { RIM: RIM, MINZ: MINZ, BROW: BROW, UNDER: UNDER, ROOM: ROOM, SQUASH: SQUASH, FULL: FULL, MASK: MASK, said: null, n: 0 };
  /* his head off his own picture: its middle and across the wear file's own way (the widest row in the top two thirds), its crown,
     and his eye line */
  function head(img, crop) {
    if (!H) return null;
    var per = H.get(img); if (!per) { per = {}; H.set(img, per); }
    var key = crop ? crop.join(',') : 'all'; if (per[key] !== undefined) return per[key];
    var a = null;
    try {
      var sx = crop ? crop[0] : 0, sy = crop ? crop[1] : 0, w = crop ? crop[2] : img.naturalWidth || img.width, h = crop ? crop[3] : img.naturalHeight || img.height;
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      var g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(img, sx, sy, w, h, 0, 0, w, h);
      var d = g.getImageData(0, 0, w, h).data, best = null, top = -1, bottom = -1, x, y;
      for (y = 0; y < h; y++) { var x0 = -1, x1 = -1;
        for (x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] >= 128) { if (x0 < 0) x0 = x; x1 = x; }
        if (x0 < 0) continue; if (top < 0) top = y; bottom = y; if (y < Math.floor(h * 0.68) && (!best || x1 - x0 > best[2] - best[1])) best = [y, x0, x1]; }
      if (best) { var bw = best[2] - best[1] + 1, cxm = (best[1] + best[2]) / 2, hh = bottom - top + 1, lum = [];
        /* how light his face is, row by row, either side of his nose */
        for (y = 0; y < h; y++) { var s = 0, k = 0;
          [[-0.30, -0.08], [0.08, 0.30]].forEach(function (r) { for (var xx = Math.round(cxm + r[0] * bw); xx <= Math.round(cxm + r[1] * bw); xx++) { var o = (y * w + xx) * 4; if (xx >= 0 && xx < w && d[o + 3] >= 128) { s += 0.2126 * d[o] + 0.7152 * d[o + 1] + 0.0722 * d[o + 2]; k++; } } });
          lum.push(k ? s / k : null); }
        var sm = function (yy) { var t = 0, n = 0; for (var j = -2; j <= 2; j++) if (lum[yy + j] != null) { t += lum[yy + j]; n++; } return n ? t / n : null; };
        var kk = Math.round(0.10 * hh), ey = null, low = 1e9;
        for (y = Math.round(top + 0.34 * hh); y <= Math.round(top + 0.64 * hh); y++) { var at = sm(y), up = sm(y - kk), dn = sm(y + kk); if (at == null || up == null || dn == null) continue; var v = at - 0.5 * (up + dn); if (v < low) { low = v; ey = y; } }
        var read = ey != null && (ey - top) / hh >= EYES[0] && (ey - top) / hh <= EYES[1];
        a = { cy: top <= 1 ? best[0] : Math.min(best[0], top + bw / 2), cx: cxm, w: bw, iw: w, ih: h, top: top, bottom: bottom, ey: read ? ey : Math.round(top + MID * hh), read: read }; }
    } catch (e) { a = null; }
    per[key] = a; return a;
  }
  /* what this piece on this head is, off the wear file's own drawing of it (the gear alone, read once): how far it reaches, what
     it covers of the middle of his face, and so how it is fitted. All in the cell's own points. */
  function shape(W, img, crop, wear, look, redo, a) {
    if (!X) return null;
    var per = X.get(img); if (!per) { per = {}; X.set(img, per); }
    var key = (crop ? crop.join(',') : 'all') + '|' + (wear ? String(wear.head) : '') + '|' + (look || ''); if (per[key]) return per[key];
    var R = a.iw, c = document.createElement('canvas'); c.width = R * 3; c.height = R * 3;
    var t = c.getContext('2d', { willReadFrequently: true }); t.translate(R, R);
    var ok = false; try { ok = !!W.face(t, img, R, look || null, wear || null, redo, crop); } catch (e) { ok = false; }
    if (!ok) return null;
    var d = t.getImageData(0, 0, c.width, c.height).data, top = 1e9, left = 1e9, right = -1, x, y, cov = [];
    var half = Math.round(a.w * 0.17), c0 = Math.round(R + a.cx - half), c1 = Math.round(R + a.cx + half);
    for (y = 0; y < c.height; y++) { var n = 0;
      for (x = 0; x < c.width; x++) { var al = d[(y * c.width + x) * 4 + 3]; if (al >= 64) { if (y < top) top = y; if (x < left) left = x; if (x > right) right = x; } if (al >= 200 && x >= c0 && x <= c1) n++; }
      cov.push(n / (c1 - c0 + 1) >= 0.5); }
    if (right < 0) return null;
    var ey = R + a.ey, e0 = Math.round(ey - 0.05 * a.w), e1 = Math.round(ey + 0.05 * a.w), on = 0;
    for (y = e0; y <= e1; y++) if (cov[y]) on++;
    var s = { kind: 'open', top: top - R, left: left - R, right: right + 1 - R, lift: 0, sy: 1 };
    if (on / (e1 - e0 + 1) >= 0.5) {
      var r0 = Math.round(ey), r1 = Math.round(ey); while (!cov[r0] && r0 < e1) r0++; r1 = r0;
      while (r0 > 0 && cov[r0 - 1]) r0--; while (r1 < c.height - 1 && cov[r1 + 1]) r1++;
      var gt = r0 - R, cb = r1 + 1 - R, brow = a.ey - BROW * a.w;
      if (gt > a.ey - 0.2 * a.w && (cb - a.ey) / a.w > MASK) { s.kind = 'mask'; s.lift = Math.max(0, a.ey + UNDER * a.w - gt); }                       /* it begins at his eyes: moved down whole to begin under them */
      else if ((cb - a.ey) / a.w > FULL) s.kind = 'face';                                                                    /* it covers him past his mouth: a face of its own */
      else { s.kind = 'hat'; s.sy = Math.max(SQUASH, Math.min(1, (brow - (a.top - ROOM * a.w)) / Math.max(1, cb - gt))); s.lift = brow - s.sy * cb; }   /* its brim's lower edge on his brow */
    }
    s.topFit = s.lift + s.sy * s.top;   /* where the piece's own top is once fitted */
    per[key] = s; return s;
  }
  /* how far the picture stands back so the fitted gear is whole inside the frame's rim */
  function stand(a, s) {
    var top = s.topFit / a.iw, lf = s.left / a.iw, rt = s.right / a.iw;
    var over = top < RIM ? (RIM - top) / (1 - RIM) : 0, side = Math.max(RIM - lf, rt - 1 + RIM), wide = side > 0 ? side / (1 - 2 * RIM) : 0;
    return Math.max(MINZ, Math.min(1, 1 / (1 + over), 1 / (1 + 2 * wide)));
  }
  function gear(g, W, img, crop, S, wear, look, redo, a, s, z, fx, fy, plain) {
    var m = S / a.iw, ok = false, sm = g.imageSmoothingEnabled;
    g.save(); g.translate(fx, fy); g.scale(z, z);
    if (!plain) { g.translate(0, s.lift * m); g.scale(1, s.sy); }
    try { ok = !!W.face(g, img, S, look || null, wear || null, redo, crop); } catch (e) { ok = false; }
    g.restore(); g.imageSmoothingEnabled = sm;
    return ok;
  }
  function draw(g, img, crop, S, wear, look, redo, x, y) {
    var W = root.BohemiaWear; if (!W || W.off || !W.face || !img) return false;
    var a = head(img, crop); if (!a) return false;
    var s = shape(W, img, crop, wear, look, redo, a); if (!s) return false;
    var z = stand(a, s), fw = S * z, fx = (x || 0) + (S - fw) / 2, fy = (y || 0) + (S - fw);
    var sm = g.imageSmoothingEnabled;
    g.save(); g.beginPath(); g.rect(x || 0, y || 0, S, S); g.clip();
    g.imageSmoothingEnabled = true;
    /* the face on the frame's foot, the gear over it whole, one scale */
    if (crop) g.drawImage(img, crop[0], crop[1], crop[2], crop[3], fx, fy, fw, fw); else g.drawImage(img, fx, fy, fw, fw);
    var ok = gear(g, W, img, crop, S, wear, look, redo, a, s, z, fx, fy, false);
    g.restore(); g.imageSmoothingEnabled = sm;
    if (!ok) return false;
    api.n++; api.said = { look: look || null, wear: wear || null, size: S, z: Math.round(z * 1000) / 1000, kind: s.kind, sy: Math.round(s.sy * 100) / 100, lift: Math.round(s.lift / a.w * 100) / 100,
      eye: Math.round((fy - (y || 0) + a.ey * (S / a.iw) * z) * 10) / 10, mid: Math.round((fx - (x || 0) + a.cx * (S / a.iw) * z) * 10) / 10, across: Math.round(a.w * (S / a.iw) * z * 10) / 10, read: !!a.read, face: [Math.round(fx - (x || 0)), Math.round(fy - (y || 0)), Math.round(fw), Math.round(fw)] };
    return true;
  }
  /* the gear alone, as draw() lays it (or plain: as the wear file lays it), on a glass of its own S by S: what the gates read */
  function layer(img, crop, S, wear, look, plain) {
    var W = root.BohemiaWear; if (!W || W.off || !W.face || !img) return null;
    var a = head(img, crop); if (!a) return null;
    var s = shape(W, img, crop, wear, look, null, a); if (!s) return null;
    var z = stand(a, s), fw = S * z, c = document.createElement('canvas'); c.width = c.height = S;
    var g = c.getContext('2d', { willReadFrequently: true });
    if (!gear(g, W, img, crop, S, wear, look, null, a, s, z, (S - fw) / 2, S - fw, !!plain)) return null;
    var m = S / a.iw * z, fy = S - fw;
    return { canvas: c, kind: s.kind, sy: s.sy, z: z, read: !!a.read, eye: fy + a.ey * m, brow: fy + (a.ey - BROW * a.w) * m, under: fy + (a.ey + UNDER * a.w) * m, mid: (S - fw) / 2 + a.cx * m, across: a.w * m, crown: fy + a.top * m };
  }
  api.draw = draw; api.layer = layer; api.head = head; api.anchor = head;
  root.BohemiaFightFace = api;
})(typeof window !== 'undefined' ? window : this);
