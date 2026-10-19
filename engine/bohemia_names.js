// BOHEMIA THE NAMES -- ONE ROLL, THE COUNTY'S MIX (10/18/26, PEOPLE lane, VAMILY [the names wired in])
//
// PAOLO 9/21, voting the names at his door UP with one correction: "a little
// more percentage of white people names and we're good. Try to keep it
// natural. Hella Hispanic shit going on. This game isn't a Hispanic game,
// chill out."
//
// WHAT WAS LIVE BEFORE THIS FILE, MEASURED (records/BOHEMIA_PEOPLE_THE_NAMES_
// WIRED_IN_10_18_26.md): three surfaces named people three ways, and none of
// them was the county.
//   - the hire post (slices/BOHEMIA_SETTLEMENT_SCREEN.html HIRE_NAMES): sixteen
//     one-word names, 12 of 16 read Hispanic, Pancho and Nacho on it;
//   - the keepers: the same nine names in all 26 places (LUPE at every hall),
//     whatever face the place drew for the keeper;
//   - a stranger who tells you his name (engine/bohemia_people.js
//     generatedName): the first name and the surname drawn apart, so 56.0% of
//     names read Hispanic against a county that is 33.4% Hispanic.
//
// THIS FILE IS THE ONE ROLL ALL THREE USE. Who first, then the name: a
// background from the census, then a first name and a surname from that
// background, with the real crossover (a Hispanic man named Travis, a
// surname that married in). Battle Brothers does the same thing in its own
// scripts: each background picks from its own name list, so where a man is
// from and what he is called travel together. From 10/19 a fourth: the person
// in a place's crowd, once you ask who they are (PEOPLE [ask the crowd]); and
// every roll carries the person's skin band, so the face and the body can be
// painted from the same person the name came from (rule 120(d)).
//
// THE DESIGN IS banks/BOHEMIA_THE_NAMES_MIX_10_18_26.json (PEOPLE [the names
// mix], 6bb2be0c) plus the ten Hispanic men's names
// banks/BOHEMIA_WHO_THE_FACE_IS_10_18_26.json added (that pool had three men
// in 28), with the man/woman reading of every first name from the same bank.
// gates/the_names_wired_in_gate.js holds this file to those two banks, name
// for name, so the design and the game cannot drift apart.
//
// A NAME IS TWO WORDS. ONE ID, ONE WHOLE PERSON: roll(key) is pure, the same
// key is the same person for ever, and a caller that already knows the face
// passes its reading so the name and the face are one person.
//
// MODS: the MIX block below is the whole content. A modder swaps a pool, a
// share or a reading here and nothing else changes; draft:true, the
// crossover shares are TUNING's to set.
'use strict';
(function (root) {
  var HASREQ = typeof module !== 'undefined' && module.exports;

  var MIX = {
    draft: true,
    tuned: false,
    census: 'U.S. Census Bureau, QuickFacts, Clark County, Nevada (read 10/18/26): Hispanic or Latino 33.4%, ' +
      'White alone not Hispanic 35.6%, Black alone 14.4%, Asian alone 12.5%. https://www.census.gov/quickfacts/clarkcountynevada',
    /* who first: five shares that add to 100, the last is everybody of two or more backgrounds */
    heritage: { hispanic: 33, white: 36, black: 13, asian: 12, mixed: 6 },
    given: {
      hispanic: ['Marisol', 'Rosa', 'Imelda', 'Lupe', 'Nayeli', 'Consuelo', 'Araceli', 'Guadalupe', 'Ignacio',
        'Paloma', 'Xiomara', 'Yolanda', 'Amaury', 'Perla', 'Estella', 'Socorro', 'Anahi', 'Renata', 'Marisela',
        'Citlali', 'Ruben', 'Ofelia', 'Belen', 'Idalia', 'Reyna', 'Lourdes', 'Esperanza', 'Clemencia',
        /* the ten men's names who-the-face-is added (the pool had three men in 28) */
        'Hector', 'Javier', 'Armando', 'Octavio', 'Efrain', 'Rogelio', 'Sergio', 'Jorge', 'Raul', 'Esteban'],
      black: ['Terrence', 'Kwame', 'Odell', 'Booker', 'Delroy', 'Rashad', 'Adaeze', 'Jamal', 'Tyrell', 'Deshawn',
        'Latrice', 'Keisha', 'Andre', 'Marcus', 'Tasha', 'Monique', 'Ebony'],
      asian: ['Thuy', 'Linh', 'Hoang', 'Trinh', 'Minh', 'Anh', 'Jin', 'Mei', 'Priya', 'Arnel', 'Jun', 'Rowena',
        'Marites', 'Danilo', 'Liza'],
      common: ['Dante', 'Silas', 'Ambrose', 'Bishop', 'Ezekiel', 'Casimir', 'Otis', 'Juniper', 'Malachi', 'Everett',
        'Tobias', 'Cyrus', 'Jonah', 'Wendell', 'Amos', 'Nadia', 'Kai', 'Horace', 'Sunny', 'Emmett', 'Abel', 'Milo',
        'Roman', 'Jarvis', 'Wyatt', 'Nolan', 'Wade', 'Clyde', 'Garrett', 'Harlan', 'Travis', 'Colton', 'Opal',
        'Pearl', 'Hazel', 'Fern', 'Loretta', 'Bonnie', 'Della', 'Rachel', 'Heather', 'Amber', 'Megan', 'Shannon',
        'Dana', 'Brooke', 'Carly', 'Jodie', 'Tammy', 'Lacey', 'Corinne', 'Cody', 'Dustin', 'Shane', 'Kyle']
    },
    /* surnames split Hispanic / Asian / the rest: Black and white American surnames are mostly one pool */
    surname: {
      hispanic: ['Rivera', 'Vasquez', 'Delgado', 'Salcedo', 'Carrasco', 'Ibarra', 'Prieto', 'Salazar', 'Munoz',
        'Escobar', 'Trejo', 'Zamora', 'Barajas', 'Cordova', 'Reyes', 'Ocampo', 'Sandoval', 'Aguirre', 'Mercado',
        'Chavarria', 'Portillo', 'Serrano', 'Quintero', 'Galvan', 'Villalobos', 'Sepulveda', 'Arroyo', 'Cisneros',
        'Peralta', 'Bonilla', 'Aguilar', 'Castellanos', 'Lozano', 'Betancourt', 'Mireles'],
      asian: ['Nguyen', 'Pham', 'Kimura', 'Duong', 'Vue', 'Tran', 'Nakamura', 'Truong', 'Park', 'Yamada', 'Chu',
        'Thao', 'Bautista', 'Pascual', 'Tolentino', 'Dizon', 'Manalo', 'Macaraeg'],
      rest: ['Okonkwo', 'Whitfield', 'Boone', 'Ellison', 'Mayfield', 'Dorsey', 'Hollis', 'Amadi', 'Kirkland',
        'Whitaker', 'Fontenot', 'Beaumont', 'Adeyemi', 'Rutledge', 'Osei', 'Marchetti', 'Bramble', 'Wexler', 'Odom',
        'Grady', 'Achebe', 'Kessler', 'Lindquist', 'Brennan', 'Doyle', 'Sutton', 'Pike', 'Marsh', 'Vance', 'Coyle',
        'Webb', 'Hargrove', 'Blackwood', 'Renner', 'Crowder', 'Stanton', 'Ferris', 'Larkin', 'Quinn', 'Ashby',
        'Tillman', 'Hatcher', 'Lund', 'Vogel', 'Emery', 'Kaminski', 'Novak', 'Gaines', 'Rucker', 'Stovall', 'Abernathy']
    },
    /* the first name and the surname by background, out of 100 (the crossover is a guess, TUNING's) */
    givenRule: {
      hispanic: { hispanic: 65, common: 35 },
      white: { common: 100 },
      black: { black: 45, common: 55 },
      asian: { asian: 50, common: 50 },
      mixed: 'any'
    },
    surnameRule: {
      hispanic: { hispanic: 85, rest: 15 },
      white: { rest: 95, hispanic: 5 },
      black: { rest: 95, hispanic: 5 },
      asian: { asian: 85, rest: 15 },
      mixed: 'any'
    },
    /* the West African surnames go to a Black or mixed person only (the origin rule: no white man named Amadi) */
    blackOnlySurnames: ['Okonkwo', 'Amadi', 'Adeyemi', 'Osei', 'Achebe'],
    /* what a first name reads as to an American ear: m, f, or x for one that goes both ways */
    sex: {
      Marisol: 'f', Rosa: 'f', Imelda: 'f', Lupe: 'f', Nayeli: 'f', Consuelo: 'f', Araceli: 'f', Guadalupe: 'f',
      Ignacio: 'm', Paloma: 'f', Xiomara: 'f', Yolanda: 'f', Amaury: 'm', Perla: 'f', Estella: 'f', Socorro: 'f',
      Anahi: 'f', Renata: 'f', Marisela: 'f', Citlali: 'f', Ruben: 'm', Ofelia: 'f', Belen: 'f', Idalia: 'f',
      Reyna: 'f', Lourdes: 'f', Esperanza: 'f', Clemencia: 'f', Hector: 'm', Javier: 'm', Armando: 'm',
      Octavio: 'm', Efrain: 'm', Rogelio: 'm', Sergio: 'm', Jorge: 'm', Raul: 'm', Esteban: 'm',
      Terrence: 'm', Kwame: 'm', Odell: 'm', Booker: 'm', Delroy: 'm', Rashad: 'm', Adaeze: 'f', Jamal: 'm',
      Tyrell: 'm', Deshawn: 'm', Latrice: 'f', Keisha: 'f', Andre: 'm', Marcus: 'm', Tasha: 'f', Monique: 'f',
      Ebony: 'f',
      Thuy: 'f', Linh: 'f', Hoang: 'm', Trinh: 'f', Minh: 'm', Anh: 'x', Jin: 'm', Mei: 'f', Priya: 'f',
      Arnel: 'm', Jun: 'm', Rowena: 'f', Marites: 'f', Danilo: 'm', Liza: 'f',
      Dante: 'm', Silas: 'm', Ambrose: 'm', Bishop: 'm', Ezekiel: 'm', Casimir: 'm', Otis: 'm', Juniper: 'f',
      Malachi: 'm', Everett: 'm', Tobias: 'm', Cyrus: 'm', Jonah: 'm', Wendell: 'm', Amos: 'm', Nadia: 'f',
      Kai: 'x', Horace: 'm', Sunny: 'x', Emmett: 'm', Abel: 'm', Milo: 'm', Roman: 'm', Jarvis: 'm', Wyatt: 'm',
      Nolan: 'm', Wade: 'm', Clyde: 'm', Garrett: 'm', Harlan: 'm', Travis: 'm', Colton: 'm', Opal: 'f',
      Pearl: 'f', Hazel: 'f', Fern: 'f', Loretta: 'f', Bonnie: 'f', Della: 'f', Rachel: 'f', Heather: 'f',
      Amber: 'f', Megan: 'f', Shannon: 'f', Dana: 'x', Brooke: 'f', Carly: 'f', Jodie: 'f', Tammy: 'f',
      Lacey: 'f', Corinne: 'f', Cody: 'm', Dustin: 'm', Shane: 'm', Kyle: 'm'
    },
    /* what each face reads as (PEOPLE's reading of PORTRAIT's thirteen, who-the-face-is): the name follows the face */
    faces: {
      you: 'm', cast_longcoat: 'm', cast_barearms: 'm', cast_pack: 'm', cast_skirt: 'f', cast_widebrim: 'm',
      cast_cape: 'm', cast_apron: 'm', cast_poncho: 'f', cast_bedroll: 'm', cast_shorts: 'm', cast_satchel: 'm',
      cast_shortcoat: 'f',
      /* the street's faction looks (PEOPLE [ask the crowd], 10/19): a crowd person wears any of them, so each is read
         off the face the speaker shows (the sheet's 64 until PORTRAIT's fresh one lands). faction_anarchists stays
         unread: its face is a hood and its body has long hair, so nothing honest can be read until they agree */
      faction_caravans: 'm', faction_colorful: 'f', faction_blues: 'm', faction_homeless: 'm', faction_church: 'f',
      faction_reds: 'f', faction_cartel: 'm', faction_trades: 'm', faction_mob: 'm', faction_network: 'f',
      faction_volunteers: 'f', faction_remnants: 'm'
    },
    /* THE SKIN TRAVELS WITH THE NAME (PEOPLE [ask the crowd], 10/19; rule 120(d), Paolo 10/18: 'the portraits don't
       even look alike, Black people looking like white people'). Who a person is sets the range their skin falls in,
       the way Battle Brothers' southern backgrounds draw a man's name, body and head from one southern set (recall,
       Blazing Deserts). The band is dealt from the person's own key, so it is theirs for ever; PORTRAIT paints the face
       and CHARACTER the body from it, and a name, a face and a body are one person. The bands are the ITA scale
       dermatology reads skin by (Chardon 1991; Del Bino and Bernerd 2013), lightest first; the weights are a draft,
       PORTRAIT's and TUNING's to move. */
    skinBands: ['very light', 'light', 'intermediate', 'tan', 'brown', 'dark'],
    skin: {
      white: { 'very light': 35, light: 45, intermediate: 18, tan: 2 },
      hispanic: { 'very light': 5, light: 20, intermediate: 35, tan: 30, brown: 10 },
      black: { intermediate: 5, tan: 15, brown: 45, dark: 35 },
      asian: { 'very light': 5, light: 25, intermediate: 40, tan: 25, brown: 5 },
      mixed: { light: 10, intermediate: 25, tan: 25, brown: 25, dark: 15 }
    }
  };

  /* the people engine's own string hash and finaliser, so a key means the same thing in both files */
  function hashOf(key) {
    var h = 0;
    key = String(key);
    for (var i = 0; i < key.length; i++) h = (Math.imul(h, 31) + key.charCodeAt(i)) >>> 0;
    return h;
  }
  function mix32(v) {
    v = v >>> 0;
    v ^= v >>> 16; v = Math.imul(v, 0x7feb352d);
    v ^= v >>> 15; v = Math.imul(v, 0x846ca68b);
    v ^= v >>> 16;
    return v >>> 0;
  }
  /* six streams, salted away from generatedName's 0x9e3779b9 and the quirk's 0x71717 */
  var SALT = { heritage: 0x27d4eb2f, sex: 0x165667b1, gpool: 0x85ebca6b, given: 0xc2b2ae35,
    spool: 0xd3a2646c, surname: 0xfd7046c5, skin: 0x5bd1e995 };   /* skin last and its own stream: no name moved */
  function unit(h, salt) { return (mix32(h ^ salt) % 100000) / 100000; }

  function weighted(table, u) {
    var keys = Object.keys(table), tot = 0, acc = 0, i;
    for (i = 0; i < keys.length; i++) tot += table[keys[i]];
    for (i = 0; i < keys.length; i++) { acc += table[keys[i]] / tot; if (u < acc) return keys[i]; }
    return keys[keys.length - 1];
  }
  function even(pools) { var t = {}; Object.keys(pools).forEach(function (k) { t[k] = 1; }); return t; }

  /* m or f, from whatever the caller knows: 'm' 'f' 'he' 'she' 'male' 'female'; anything else is unknown */
  function sexWord(s) {
    s = String(s || '').toLowerCase();
    if (s === 'm' || s === 'he' || s === 'male' || s === 'man') return 'm';
    if (s === 'f' || s === 'she' || s === 'female' || s === 'woman') return 'f';
    return null;
  }
  function sexOf(given) { return MIX.sex[String(given || '').trim().split(/\s+/)[0]] || null; }
  function fits(n, want) { var s = MIX.sex[n]; return s === want || s === 'x'; }

  /* ROLL A PERSON. key: anything stable (a place and a slot, a city key). opts.sex: the face's reading, when the
     caller has a face; without one the person is a man or a woman half the time each. opts.skin: the person's skin
     band when the caller knows it (CHARACTER's [one skin, one person], rule 120(d): the body is the truth); the
     background is then the census weighted by how often that band falls in each background's range (the county's
     share times the range's weight, Bayes), so the name always fits the skin and, over a valley whose skins are
     dealt the county's way, the backgrounds still come out the county's. Pure. */
  function roll(key, opts) {
    opts = opts || {};
    var h = hashOf(key);
    var band = MIX.skinBands.indexOf(opts.skin) >= 0 ? opts.skin : null, table = MIX.heritage;
    if (band) {
      table = {};
      Object.keys(MIX.heritage).forEach(function (k) { var w = MIX.skin[k][band] || 0; if (w) table[k] = MIX.heritage[k] * w; });
      if (!Object.keys(table).length) table = MIX.heritage;
    }
    var heritage = weighted(table, unit(h, SALT.heritage));
    var sex = sexWord(opts.sex) || (unit(h, SALT.sex) < 0.5 ? 'm' : 'f');
    var gr = MIX.givenRule[heritage], sr = MIX.surnameRule[heritage];
    var gpool = weighted(gr === 'any' ? even(MIX.given) : gr, unit(h, SALT.gpool));
    var spool = weighted(sr === 'any' ? even(MIX.surname) : sr, unit(h, SALT.spool));
    var gl = MIX.given[gpool].filter(function (n) { return fits(n, sex); });
    if (!gl.length) { gpool = 'common'; gl = MIX.given.common.filter(function (n) { return fits(n, sex); }); }
    if (!gl.length) gl = MIX.given[gpool];
    var sl = MIX.surname[spool];
    if (heritage !== 'black' && heritage !== 'mixed') {
      sl = sl.filter(function (n) { return MIX.blackOnlySurnames.indexOf(n) < 0; });
    }
    var given = gl[mix32(h ^ SALT.given) % gl.length], surname = sl[mix32(h ^ SALT.surname) % sl.length];
    return { given: given, surname: surname, full: given + ' ' + surname, heritage: heritage,
      sex: MIX.sex[given] === 'x' ? sex : (MIX.sex[given] || sex), givenPool: gpool, surnamePool: spool,
      skin: band || weighted(MIX.skin[heritage], unit(h, SALT.skin)), draft: true };
  }

  /* the face's reading, or null for a face nobody has read */
  function faceReads(look) { return MIX.faces[look] || null; }

  /* could a person of this heritage have a face of this band (the band is in their range): the one test of rule
     120(d) for a name against a face. A band nobody measured agrees with everybody */
  function skinAgrees(heritage, band) {
    var r = MIX.skin[heritage];
    return !band || !r || r[band] > 0;
  }

  /* does this full name read Hispanic: either word from a Hispanic pool (the 10/18 finding: a name is two words) */
  function readsHispanic(full) {
    var p = String(full || '').trim().split(/\s+/);
    return MIX.given.hispanic.indexOf(p[0]) >= 0 || MIX.surname.hispanic.indexOf(p[p.length - 1]) >= 0;
  }

  var API = { MIX: MIX, roll: roll, sexOf: sexOf, faceReads: faceReads, readsHispanic: readsHispanic,
    skinAgrees: skinAgrees, hashOf: hashOf, mix32: mix32 };
  if (HASREQ) module.exports = API;
  root.BohemiaNames = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
