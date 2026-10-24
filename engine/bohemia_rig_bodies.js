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
     BohemiaRigBodies.has(look)                   PORTRAIT rendered this look's body, or he is a rolled person
     BohemiaRigBodies.src(look, turn)             its file, or null
     BohemiaRigBodies.image(look, turn, cb)       cb(img) once loaded, cb(null) if it fails
     BohemiaRigBodies.gangOf(look)                'reds' for faction_reds or a rolled Red, 'town' for a person of the place, null
                                                  for a look with no standing body
     BohemiaRigBodies.standing(look, turn)        {im, foot, mid} once his standing still is in (foot: his soles' row,
                                                  read off the render's own pixels; mid: the render's middle column), else
                                                  null and it starts loading
     BohemiaRigBodies.FIG_H                       a bare-headed gang body, foot to crown, in sheet pixels (measured: 108 to 116,
                                                  a hat or a crest adds the rest; 108 is the bare head)
   NO TWO PEOPLE ALIKE (RUN TWO, 10/23, rule 121(i), Paolo 10/19: 'THERE'S SO MANY OF THE SAME HATS AND SHIT ON THE
   CHARACTERS... ALL THE CLAY PEOPLE HAVE LIKE 2 OPTIONS FOR CUSTOMIZATIONS, IT'S INSANE'): a gang was thirteen copies of one
   man. Now the valley's people are the rolled ones (engine/bohemia_people_mix.js, tools/bohemia_run2_no_two_people_alike.py):
   each his own cut, hair colour, face, skin, beard, mark, hat, face piece, top and coat inside his gang's colours, standing
   in his own render (records/target/character/barber/person_<id>/rig_<turn>.png), so standing() takes 'person_<id>' too.
     BohemiaRigBodies.people(gang)                every rolled look of that gang ('town' for the place's own people), [] if none
     BohemiaRigBodies.person(look)                who he is (gang, cut, hat, face piece, beard, mark, top, coat, skin), or null
     BohemiaRigBodies.cast(n, seed, gangs)        n looks, NO TWO ALIKE, dealt from the people of those gangs (all of them when
                                                  none named), the same n for the same seed; a gang look only when the mix is
                                                  not loaded; never one of your company (isCompany)
     BohemiaRigBodies.isCompany(look)             one of your eleven (THE FACE IS HIS OWN FACE, 10/24): dealt to nobody else
     BohemiaRigBodies.canWalk(look) / walk(look)  a rolled walker and his walk sheet {im, meta: w h foot mid cols dirs walk still}
                                                  once in (slices/rig_walk), else null and it starts loading */
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
  function has(look) { return LOOKS.indexOf(look) >= 0 || !!person(look); }
  function src(look, turn) {
    if (!has(look)) return null;
    var t = TURNS.indexOf(turn) >= 0 ? turn : 'S';
    if (LOOKS.indexOf(look) < 0) return (root.BOHEMIA_PEOPLE_BASE || PBASE) + look + '/rig_' + t + '.png';   /* a rolled person: his own still */
    return (root.BOHEMIA_RIG_BODIES_BASE || BASE) + look + '/rig_' + t + '.png';
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
  function gangLook(look) { var g = String(look || '').replace(/^faction_/, ''); return /^faction_/.test(look) && GANGS.indexOf(g) >= 0 ? g : null; }
  /* a rolled person names his own gang ('town' for the place's people) */
  function gangOf(look) { var p = person(look); return p ? p.gang : gangLook(look); }
  var PBASE = '../records/target/character/barber/';
  var MIX = null, WHO = {};
  function mix() {
    if (MIX) return MIX;
    var M = root.BOHEMIA_PEOPLE_MIX; if (!M || !M.people) return null;
    M.people.forEach(function (p) { WHO[p.look] = p; });
    return (MIX = M);
  }
  function person(look) { mix(); return WHO[look] || null; }
  function people(gang) { var M = mix(); return M && M.by_gang[gang] ? M.by_gang[gang].slice() : []; }
  /* the same seed deals the same hand; a look is dealt once, so nobody stands beside himself. THE FACE IS HIS OWN FACE
     (RUN TWO, 10/24): your eleven are rolled people (ours.json people_looks.crew, marked company in the mix), so no town,
     crowd or post is ever dealt one of them: he is in your company, not on somebody's street */
  function isCompany(look) { var p = person(look); return !!(p && p.company); }
  function cast(n, seed, gangs) {
    var M = mix(), pool = [];
    if (M) (gangs && gangs.length ? gangs : Object.keys(M.by_gang)).forEach(function (g) { pool = pool.concat((M.by_gang[g] || []).filter(function (l) { return !isCompany(l); })); });
    if (!pool.length) pool = GANGS.map(function (g) { return 'faction_' + g; });
    var h = 2166136261, s = String(seed), out = [];
    for (var i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619) >>> 0;
    var r = function () { h = (Math.imul(h ^ (h >>> 15), 2246822507) + 0x6d2b79f5) >>> 0; return (h >>> 8) / 16777216; };
    for (var k = pool.length - 1; k > 0; k--) { var j = Math.floor(r() * (k + 1)), t = pool[k]; pool[k] = pool[j]; pool[j] = t; }
    for (var q = 0; q < n; q++) out.push(pool[q % pool.length]);
    return out;
  }
  var STAND = {};
  function standing(look, turn) {
    var P = person(look), g = !P && gangLook(look); if (!g && !P) return null;
    var t = TURNS.indexOf(turn) >= 0 ? turn : 'S';
    var u = P ? (root.BOHEMIA_PEOPLE_BASE || PBASE) + look + '/rig_' + t + '.png' : (root.BOHEMIA_RIG_GANGS_BASE || GBASE) + g + '/rig_' + t + '.png', e = STAND[u];
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
  /* THE SETTLEMENT IS BUSY (RUN TWO, 10/23, rule 131): a walker's own sheet (slices/rig_walk/<look>.png, his still and the six
     keys of his walk in eight turns, his own 256 colours); walk(look) is {im, meta} once in, else null and it starts loading */
  var WBASE = 'rig_walk/', WALK = {};
  function canWalk(look) { var p = person(look); return !!(p && !p.stands); }
  function walk(look) {
    if (!canWalk(look)) return null;
    var e = WALK[look];
    if (e) return e.im ? e : null;
    WALK[look] = e = {};
    var b = root.BOHEMIA_RIG_WALK_BASE || WBASE;
    if (typeof fetch === 'undefined') return null;
    fetch(b + look + '.json').then(function (r) { return r.json(); }).then(function (m) {
      load(b + look + '.png', function (im) { if (im) { e.meta = m; e.im = im; } });
    }).catch(function () {});
    return null;
  }
  root.BohemiaRigBodies = { TURNS: TURNS, GANGS: GANGS, LOOKS: LOOKS, FIG_H: FIG_H, has: has, src: src, image: image,
    gangOf: gangOf, standing: standing, people: people, person: person, cast: cast, isCompany: isCompany, canWalk: canWalk, walk: walk,
    /* __THE_TOWN_LETS_GO__ (RUN 10/24, rule 141(e)): the settlement screen, put away, lets go of the bodies and walks it drew */
    release: function () { cache = {}; STAND = {}; WALK = {}; } };
})(typeof window !== 'undefined' ? window : this);
