/* BOHEMIA RIG FACES -- the face off the same clay model, for every screen RUN TWO draws a man on
   (RUN TWO [the starred faces on your screens], 10/18/26, rule 115(h) THE FIRST STAR).
   His fourteenth votes: 'the portrait sucks' (the crew screen), 'the portrait is ass, I can't even stare at it'
   (scavenge). The old flat 64 face at a fight_people sheet's right edge is out wherever a look has a rig face.
   The bank is slices/rig_faces/ (128 x 128, one per look, baked by tools/bohemia_run2_rig_faces.py from the rig's
   own renders: PORTRAIT's heads from the same model where they exist, a rig body's head until then).
     BohemiaRigFaces.src(look, base)  -> 'rig_faces/<look>.webp' under base, or null if the look has none
     BohemiaRigFaces.draw(ctx, look, base, size, onMiss) draws it into ctx at size x size; onMiss() if none */
(function (root) {
  'use strict';
  var LOOKS = ['you', 'cast_bedroll', 'cast_pack', 'cast_apron', 'cast_longcoat', 'cast_barearms', 'cast_skirt',
    'cast_widebrim', 'cast_cape', 'cast_poncho', 'cast_shorts', 'cast_satchel', 'cast_shortcoat'];
  function has(look) { return LOOKS.indexOf(look) >= 0; }
  function src(look, base) { return has(look) ? (base || '') + 'rig_faces/' + look + '.webp' : null; }
  function draw(x, look, base, size, onMiss) {
    var s = src(look, base); size = size || 64;
    if (!s) { if (onMiss) onMiss(); return false; }
    var im = new Image();
    im.onload = function () { x.imageSmoothingEnabled = true; x.imageSmoothingQuality = 'high'; x.clearRect(0, 0, size, size); x.drawImage(im, 0, 0, size, size); };
    im.onerror = function () { if (onMiss) onMiss(); };
    im.src = s; return true;
  }
  root.BohemiaRigFaces = { LOOKS: LOOKS, has: has, src: src, draw: draw, SIZE: 128 };
})(typeof window !== 'undefined' ? window : this);
