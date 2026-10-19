/* BOHEMIA RIG BODIES -- the 3D model of every person, for every screen RUN TWO draws a man on
   (RUN TWO [the 3D models on your screens], 10/19/26, rule 121(e), his NO on the faces beside the old bodies: 'BRO
   EVERYTHING IS A 3D MODEL NOW FUCK THE UGLY 8 BIT SHIT... WTF TRYING TO COMBINE THE TWO'). Nothing here is drawn new;
   it reads two sets of renders that already exist:
     THE MAN AND HIS FACE FROM ONE MODEL: PORTRAIT's crew rigs, records/target/portrait/rig/crew/<look>/rig_<turn>.png,
       the whole body of the very model the face in engine/bohemia_crew_faces.js was rendered from (YOU, the twelve cast
       looks, the thirteen gangs), eight turns, his own skin (CHARACTER's one skin, rule 120(d)). The one pose made is
       frame 0 of the model's walk, a man mid-stride; the crew card shows him that way.
     THE VALLEY'S PEOPLE STANDING: CHARACTER's thirteen gangs (his YES, character-the-thirteen-through-the-rig-10-18),
       records/target/character/rig/<gang>/rig_<turn>.png, the standing still in eight turns, their own skins since
       5e83eb13: the same bodies the map's parties wear (RUN packs them into slices/BOHEMIA_RIG_CAST.png for the map),
       so a Red in a town is the Red on the road. Read from CHARACTER's own files, not RUN's sheet: the sheet is held to
       256 colours for the whole valley and a tan face comes out grey at a door's height (measured, cartel, 10/19).
     BohemiaRigBodies.TURNS                       S SE E NE N NW W SW, the order a tap turns a man through
     BohemiaRigBodies.has(look)                   PORTRAIT rendered this look's body
     BohemiaRigBodies.src(look, turn)             its file, or null
     BohemiaRigBodies.image(look, turn, cb)       cb(img) once loaded, cb(null) if it fails
     BohemiaRigBodies.gangOf(look)                'reds' for faction_reds, null for a look with no standing gang body
     BohemiaRigBodies.standing(look, turn)        {im, foot, mid} once his standing still is in (foot: his soles' row,
                                                  read off the render's own pixels; mid: the render's middle column), else
                                                  null and it starts loading
     BohemiaRigBodies.FIG_H                       a bare-headed gang body, foot to crown, in sheet pixels (measured: 108 to 116,
                                                  a hat or a crest adds the rest; 108 is the bare head) */
(function (root) {
  'use strict';
  var TURNS = ['S', 'SE', 'E', 'NE', 'N', 'NW', 'W', 'SW'];
  var GANGS = ['anarchists', 'blues', 'caravans', 'cartel', 'church', 'colorful', 'homeless',
    'mob', 'network', 'reds', 'remnants', 'trades', 'volunteers'];
  var LOOKS = ['you', 'cast_longcoat', 'cast_barearms', 'cast_pack', 'cast_skirt', 'cast_widebrim', 'cast_cape',
    'cast_apron', 'cast_poncho', 'cast_bedroll', 'cast_shorts', 'cast_satchel', 'cast_shortcoat']
    .concat(GANGS.map(function (g) { return 'faction_' + g; }));
  var BASE = '../records/target/portrait/rig/crew/';   /* the screens live in slices/; Pages publishes records/target */
  var GBASE = '../records/target/character/rig/';
  var FIG_H = 108;
  function has(look) { return LOOKS.indexOf(look) >= 0; }
  function src(look, turn) {
    if (!has(look)) return null;
    return (root.BOHEMIA_RIG_BODIES_BASE || BASE) + look + '/rig_' + (TURNS.indexOf(turn) >= 0 ? turn : 'S') + '.png';
  }
  var cache = {};
  function load(u, cb) {
    var im = cache[u];
    if (!im) { im = cache[u] = new Image(); im.src = u; }
    if (im.complete) { cb(im.naturalWidth ? im : null); return im; }
    im.addEventListener('load', function () { cb(im); });
    im.addEventListener('error', function () { cb(null); });
    return im;
  }
  function image(look, turn, cb) { var u = src(look, turn); if (!u) { cb(null); return null; } return load(u, cb); }
  function gangOf(look) { var g = String(look || '').replace(/^faction_/, ''); return /^faction_/.test(look) && GANGS.indexOf(g) >= 0 ? g : null; }
  var STAND = {};
  function standing(look, turn) {
    var g = gangOf(look); if (!g) return null;
    var u = (root.BOHEMIA_RIG_GANGS_BASE || GBASE) + g + '/rig_' + (TURNS.indexOf(turn) >= 0 ? turn : 'S') + '.png', e = STAND[u];
    if (e) return e.im ? e : null;
    STAND[u] = e = {};
    load(u, function (im) {
      if (!im) return;
      var foot = im.naturalHeight - 1;
      try {   /* the lowest row with paint on it is where his soles meet the ground */
        var c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
        var x = c.getContext('2d'); x.drawImage(im, 0, 0); var d = x.getImageData(0, 0, c.width, c.height).data;
        for (foot = c.height - 1; foot > 0; foot--) { var any = false; for (var i = 0; i < c.width; i++) if (d[(foot * c.width + i) * 4 + 3] > 24) { any = true; break; } if (any) break; }
      } catch (er) {}
      e.foot = foot + 1; e.mid = im.naturalWidth / 2; e.im = im;
    });
    return null;
  }
  root.BohemiaRigBodies = { TURNS: TURNS, GANGS: GANGS, LOOKS: LOOKS, FIG_H: FIG_H, has: has, src: src, image: image,
    gangOf: gangOf, standing: standing };
})(typeof window !== 'undefined' ? window : this);
