/* ONE MAP GATE (Paolo 7/27/26, LOCKED) — "THE ONE MAP, my order at the top of your
   queue: the phone's map app becomes the real city-builder valley map with quest
   locations pinned on top."

   Law: laws/BOHEMIA_ADDENDUM_ONE_MAP_7_27_26.md

   THE FAILURE THIS GATE EXISTS FOR HAS ALREADY HAPPENED ONCE. The MAP tab sat on the
   literal seed 1337 while the game booted the text seed 'bohemia', so the valley Paolo
   explored and the valley his quests were cast into were two different worlds, and a
   quest pinned at X29 Y77 pointed at a tile that only existed in the other one. There
   were FOUR independent valley renderers in this repo and no shared layer under any of
   them. Copies drift; the fix for drift is one copy, and this is the thing that keeps
   it one.

   Proves:
     1. ONE SOURCE. Both surfaces embed engine/bohemia_valleymap.js, and neither carries
        its own duplicate of the tone tables or the per-cell painter any more.
     2. ONE VALLEY. The phone and the MAP tab resolve the SAME seed, and every cell in
        the real valley answers with the same tone through the shared model.
     3. THE PHONE HAS THE WHOLE WORLD MODEL. Every generator the world needs is inlined
        in the phone build — this caught nine missing surface generators, which is why
        a railway, a freeway, an interchange, an airfield and all three terrains drew as
        nothing on the phone while the MAP tab drew them properly.
     4. PINS ARE READERS. Every pin sits on a cell a quest really resolves to; a quest
        with no placement produces no pin and is COUNTED as unplaced rather than given a
        location. The map never decides where anything goes (MAP LAW).
     5. THE DEAD SCHEMATIC IS GONE. No wm.hubs / wm.routes reads (buildRealWorldMap has
        never set either), no ||256 valley-size fallback on a 96-cell valley, and the
        player stands on a cell that exists.

   Run: node gates/one_map_gate.js   Registered as ONE MAP. */
'use strict';
const fs = require('fs');
const E = require('../engine/bohemia_engine.js');
const World = require('../engine/bohemia_world.js');
const VM = require('../engine/bohemia_valleymap.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const PHONE_SRC = 'slices/BOHEMIA_SOCIAL_PHONE_DEMO_7_20_26.html';
const PHONE_OUT = 'slices/BOHEMIA_CURRENT_SLICE.html';
const MAP_OUT = 'slices/BOHEMIA_MAP_CURRENT.html';
const MAP_GEN = 'tools/bohemia_map_tab.py';
const BUILDER = 'tools/build_current_slice.js';

[PHONE_SRC, PHONE_OUT, MAP_OUT, MAP_GEN, BUILDER].forEach(f =>
  ok('exists: ' + f, fs.existsSync(f)));
const phoneSrc = fs.readFileSync(PHONE_SRC, 'utf8');
const phoneOut = fs.readFileSync(PHONE_OUT, 'utf8');
const mapOut = fs.readFileSync(MAP_OUT, 'utf8');
const mapGen = fs.readFileSync(MAP_GEN, 'utf8');
const builder = fs.readFileSync(BUILDER, 'utf8');
const shared = fs.readFileSync('engine/bohemia_valleymap.js', 'utf8');

// ---- 1. ONE SOURCE ----------------------------------------------------------
{
  ok('the phone embeds the shared valley map, byte for byte', phoneOut.indexOf(shared) >= 0);
  ok('the MAP tab embeds the shared valley map, byte for byte', mapOut.indexOf(shared) >= 0);

  /* Neither surface may keep a private copy of the tones. The tell is the literal
     values: if a hex from the shared table appears in a generator OUTSIDE the inlined
     module body, somebody re-declared it. */
  const genOnly = mapGen;
  ok('the MAP tab generator no longer declares its own tone table',
     !/var FILL = \{/.test(genOnly) && !/var ROADCOL = \{/.test(genOnly));
  ok('and no longer carries its own per-cell painter',
     genOnly.indexOf('cx.fillStyle = code === 0') < 0);
  ok('the MAP tab reads the tones off the shared module', /var FILL = VM\.FILL/.test(genOnly));
  ok('the phone map app reads the shared module too', /BohemiaValleyMap/.test(phoneSrc));
  ok('and paints the valley with it, rather than drawing a schematic',
     /VM\.paintValley\(/.test(phoneSrc));
}

// ---- 2. ONE VALLEY ----------------------------------------------------------
{
  const canon = E.WorldGen.hashSeed('bohemia');
  const inMap = /var SEED\s*=\s*(\d+);/.exec(mapOut);
  ok('the MAP tab renders the canon seed (' + canon + ')', !!inMap && Number(inMap[1]) === canon);
  ok('the phone boots the canon seed by name', /Loop\.boot\(\{\s*seed:'bohemia'\s*\}\)/.test(phoneSrc));

  /* And the deeper claim: the shared model gives ONE answer per cell. Both surfaces
     call the same function on the same world, so this checks the function is total and
     stable over the whole real valley — no cell falls through to undefined. */
  const w = World.world(canon);
  let bad = 0, tones = {};
  for (let y = 0; y < w.n; y++) for (let x = 0; x < w.n; x++) {
    const t = VM.toneOf(w, x, y);
    if (typeof t !== 'string' || !/^#[0-9a-f]{6}$/i.test(t)) bad++;
    tones[t] = (tones[t] || 0) + 1;
  }
  ok('every cell in the real valley has a tone (' + (w.n * w.n) + ' cells, ' + bad + ' bad)', bad === 0);
  ok('and the valley is not one flat colour (' + Object.keys(tones).length + ' distinct tones)',
     Object.keys(tones).length >= 8);
  ok('toneOf is deterministic', VM.toneOf(w, 54, 18) === VM.toneOf(w, 54, 18));
  ok('off-map reads do not throw and are not silently ground',
     VM.toneOf(w, -1, -1) === VM.VOID && VM.describe(w, -1, -1) === null);
}

// ---- 3. THE PHONE HAS THE WHOLE WORLD MODEL --------------------------------
/* The world model requires every generator as a global. If the phone build is missing
   one, that district silently stops rendering there and ONLY there — the exact
   asymmetry "one map" is supposed to make impossible. */
{
  const mods = /var MODS = \[([\s\S]*?)\];/.exec(builder);
  ok('the phone builder declares its module list', !!mods);
  const listed = mods ? (mods[1].match(/'([a-z_0-9]+)'/g) || []).map(s => s.replace(/'/g, '')) : [];
  const NEEDED = ['bohemia_arterial', 'bohemia_freeway', 'bohemia_terrain_noise', 'bohemia_airfield',
                  'bohemia_desert', 'bohemia_mountain', 'bohemia_water', 'bohemia_rail',
                  'bohemia_interchange', 'bohemia_valleymap'];
  const missing = NEEDED.filter(m => listed.indexOf(m) < 0);
  ok('the phone inlines every surface generator the world model needs (' +
     missing.join(' ') + ')', missing.length === 0);

  // and they really made it into the built artifact
  let inlined = 0;
  NEEDED.forEach(m => { if (phoneOut.indexOf(fs.readFileSync('engine/' + m + '.js', 'utf8')) >= 0) inlined++; });
  ok('and all of them are actually in the built slice (' + inlined + '/' + NEEDED.length + ')',
     inlined === NEEDED.length);

  // world.js must come after every generator it reads as a global, and valleymap after world
  const iWorld = listed.indexOf('bohemia_world'), iVM = listed.indexOf('bohemia_valleymap');
  const lastGen = Math.max.apply(null, NEEDED.filter(m => m !== 'bohemia_valleymap').map(m => listed.indexOf(m)));
  ok('the embed order is legal: generators, then world, then the map', lastGen < iWorld && iWorld < iVM);
}

// ---- 4. PINS ARE READERS, NEVER DECIDERS -----------------------------------
{
  /* pinsFrom groups by cell and counts what it could not place. It must never invent
     a coordinate for a quest that has none. */
  const g1 = VM.pinsFrom([{ questId: 'a', x: 3, y: 4, channel: 'feed' },
                          { questId: 'b', x: 3, y: 4, channel: 'inperson' },
                          { questId: 'c', x: 9, y: 1, channel: 'feed' },
                          { questId: 'd', x: null, y: null }]);
  ok('two quests on one cell make ONE pin carrying a count of 2',
     g1.cells === 2 && g1.pins.filter(p => p.x === 3 && p.y === 4)[0].count === 2);
  ok('a quest with no location makes NO pin and is counted as unplaced',
     g1.unplaced === 1 && g1.total === 3);
  ok('a cell holding an in-person quest reads as in-person',
     g1.pins.filter(p => p.x === 3)[0].channel === 'inperson');
  /* Stable AND row-major (top of the map first), which is how a person reads a map
     and therefore the order the pin list under it should come out in. */
  ok('pins come back in a stable row-major order',
     JSON.stringify(VM.pinsFrom([{ questId: 'z', x: 9, y: 1 }, { questId: 'a', x: 3, y: 4 },
                                 { questId: 'b', x: 1, y: 1 }]).pins.map(p => [p.x, p.y])) ===
     JSON.stringify([[1, 1], [9, 1], [3, 4]]));

  const g2 = VM.pinsFrom([{ questId: 'a', x: 1, y: 1 }, { questId: 'b', x: 2, y: 2 }], q => q === 'a');
  ok('a closed quest is filtered out, not drawn', g2.cells === 1 && g2.pins[0].x === 1);
  ok('no pins at all is a legal, honest answer', VM.pinsFrom([]).cells === 0);

  // the phone draws pins from the shared grouper, and only for open quests
  ok('the phone groups its pins through the shared model', /VM\.pinsFrom\(/.test(phoneSrc));
  ok('and only pins quests that are still open', /rt && !rt\.state\.done/.test(phoneSrc));
  ok('the shared model has no idea what a quest is (MAP LAW: it decides nothing)',
     !/castTarget|placements\(|\.bq\b/.test(shared));
}

// ---- 5. THE DEAD SCHEMATIC IS GONE -----------------------------------------
{
  const code = phoneSrc.replace(/\/\*[\s\S]*?\*\//g, '');
  ok('no read of wm.hubs (buildRealWorldMap has never set it)', !/wm\.hubs/.test(code));
  ok('no read of wm.routes (same)', !/wm\.routes/.test(code));
  ok('no 256-cell fallback on a 96-cell valley', !/size\s*\|\|\s*256/.test(code));
  ok('the player is not parked on a tile outside the valley', !/tile:\{x:128,y:128\}/.test(code));
  ok('the map header asks the world for its real size', /function MAPN\(\)/.test(phoneSrc));
  ok('a tap reads the cell off the world model, not off a label',
     /VM\.describe\(/.test(phoneSrc));
}

console.log('ONE MAP GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
