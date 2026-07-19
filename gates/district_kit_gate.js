// DISTRICT KIT GATE (Paolo 7/18/26) — the factory's foundation. The shared machine every
// district generator extends must work: drawing primitives, street-aware edges, footprint
// extraction, connectivity, dead-world ground, the registry, and the 3-act hook.
const K = require('../engine/bohemia_district_kit.js');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

// drawing primitives
const G = K.grid(7);
G.rect(2, 2, 5, 5, 2); G.frame(4); G.set(10, 10, 3); G.disc(20, 20, 3, 6);
ok('grid is SZ x SZ', G.W === K.SZ && G.H === K.SZ && G.g.length === K.SZ);
ok('rect fills', G.get(3, 3) === 2 && G.get(2, 2) === 2);
ok('frame draws the border', G.get(0, 50) === 4 && G.get(K.SZ - 1, 50) === 4);
ok('set + disc place', G.get(10, 10) === 3 && G.get(20, 20) === 6);
ok('get is bounds-safe', G.get(-1, 0) === -1 && G.get(9999, 0) === -1);

// street-aware edges
ok('road neighbor -> that edge', JSON.stringify(K.streetEdges({ N: 'desert', S: 'arterial', E: null, W: null })) === JSON.stringify(['S']));
ok('a corner exits two streets', K.streetEdges({ N: null, S: 'arterial', E: 'freeway', W: null }).length === 2);
ok('no road neighbor -> default S', JSON.stringify(K.streetEdges({ N: 'desert', S: 'suburb', E: 'suburb', W: 'suburb' })) === JSON.stringify(['S']));

// footprints
const F = K.grid(1); F.rect(4, 4, 10, 12, 2); F.rect(20, 20, 25, 24, 2);
const fps = K.footprints(F.g, v => v === 2);
ok('footprints finds two components', fps.length === 2);
ok('footprint bbox is right', fps.some(f => f.w === 7 && f.h === 9));

// connectivity
const C = K.grid(1); C.rect(5, 5, 40, 5, 1); C.set(5, 5, 5); C.rect(60, 60, 62, 62, 1); // a stranded island
const reach = K.connectedFrom(C.g, c => c === 5, c => c === 1 || c === 5);
ok('connectedFrom flags a stranded drive island (<1)', reach > 0 && reach < 1);

// dead-world ground (never the void background)
const gc = K.ground(3, 7, false);
ok('ground returns a dead-dirt color, not void', typeof gc === 'string' && gc !== '#12140f');

// registry
K.register('__test', { generate: () => ({}), body: c => c === 2, palette: {} });
ok('register + get + types', !!K.get('__test') && K.types().includes('__test'));

// 3-act hook: act 1 is exactly as built; a rule restyles later acts
const base = { tag: 'act1' };
ok('act 1 returns the base untouched', K.act(base, 1) === base);
ok('act rule applies for act 2', K.act(base, 2, (r, a) => ({ tag: 'act' + a })).tag === 'act2');
ok('act with no rule returns base', K.act(base, 3).tag === 'act1');

console.log('DISTRICT KIT GATE: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
