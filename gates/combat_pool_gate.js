// BOHEMIA COMBAT POOL GATE (7/19/26). FACTORY LAW: new machinery ships with its
// own regression gate, same turn.
//
// MUSIC CATEGORY LAW, pool clause (Paolo 7/19: "it's in the same pool for
// whatever the two songs were in the pool for so it just enters the pool"):
// every vibe Paolo category-tags to a faction ENTERS that faction's encounter
// rotation in combat. Combat's synth is a fork of the alpha's; if a tagged
// song uses a voice combat does not carry, it would play WRONG or silent.
// This gate makes that impossible to ship:
//   1. every faction-tagged song in CAT_DEFAULTS resolves to a real MLOOPS entry
//   2. every voice that song uses (bass, lead, am, kick, hat) has a body in the
//      DECODED combat slice (synthV kind or drumV kind/hat-table entry)
//   3. the pool plumbing exists on both sides of the bus (alpha ships out.pools
//      + boot push; combat stores G._pools and rotates with pickSongForEncounter;
//      the old two-slot pickSlotForEncounter is gone)
// Tag a new song to a faction without porting its voices -> this gate goes red.
const fs = require('fs'), path = require('path');
const ALPHA = path.join(__dirname, '../slices/BOHEMIA_ALPHA_0_9.html');
let p = 0, f = 0; const ok = (n, c) => { c ? p++ : (f++, console.log('  > FAIL ' + n)); };

ok('the ONE alpha exists', fs.existsSync(ALPHA));
if (!fs.existsSync(ALPHA)) { console.log(`\n=== COMBAT POOL GATE: ${p} passed, ${f} failed ===`); process.exit(1); }
const src = fs.readFileSync(ALPHA, 'utf8');

// decode the embedded combat slice -- the REAL surface combat plays from
const bm = src.match(/COMBAT_B64='([^']+)'/);
ok('COMBAT_B64 present', !!bm);
let combat = '';
try { combat = Buffer.from(bm[1], 'base64').toString('utf8'); } catch (e) {}
ok('combat slice decodes', combat.length > 100000);

// parse CAT_DEFAULTS
const cm = src.match(/const CAT_DEFAULTS=\{([\s\S]*?)\n\};/);
ok('CAT_DEFAULTS found', !!cm);
const factionNames = [];
{ const fm = src.match(/const MFACTIONS=\[([\s\S]*?)\n\s*\];/);
  const body = fm ? fm[1] : '';
  const rx = /\{n:'([^']+)'/g; let m2;
  while ((m2 = rx.exec(body))) factionNames.push(m2[1]); }
ok('MFACTIONS parsed (14 factions)', factionNames.length === 14);

const tags = {};   // song name -> [faction categories]
if (cm) { const rx = /'([^']+)#1':\[([^\]]*)\]/g; let m2;
  while ((m2 = rx.exec(cm[1]))) {
    const cats = m2[2].split(',').map(s => s.replace(/['\s]/g, '')).filter(Boolean);
    const fac = cats.filter(c => factionNames.indexOf(c) >= 0);
    if (fac.length) tags[m2[1]] = fac; } }
ok('at least the six 7/19 faction tags present', Object.keys(tags).length >= 6);

// the real MLOOPS array
const mi = src.indexOf('const MLOOPS=[');
const mj = src.indexOf('\n];', mi);
const mloops = src.slice(mi, mj);

const hasSynth = (k) => combat.indexOf("kind==='" + k + "'") >= 0;
const hasDrum = (k) => combat.indexOf("kind==='" + k + "'") >= 0 || new RegExp('[{,]' + k + ':\\[').test(combat);
for (const name in tags) {
  const em = mloops.match(new RegExp("\\{n:'" + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "'[^\\n]*"));
  ok('tagged song lives in MLOOPS: ' + name, !!em);
  if (!em) continue;
  const e = em[0];
  const inst = e.match(/inst:\{b:'([a-z0-9]+)',l:'([a-z0-9]+)'\}/);
  const am = e.match(/am:'([a-z0-9]+)'/);
  const kit = e.match(/kit:\{k:'([a-z0-9]+)',h:'([a-z0-9]+)'\}/);
  ok(name + ': bass voice in combat (' + (inst ? inst[1] : '?') + ')', inst && hasSynth(inst[1]));
  ok(name + ': lead voice in combat (' + (inst ? inst[2] : '?') + ')', inst && hasSynth(inst[2]));
  if (am) ok(name + ': am voice in combat (' + am[1] + ')', hasSynth(am[1]));
  ok(name + ': kick in combat (' + (kit ? kit[1] : '?') + ')', kit && hasDrum(kit[1]));
  ok(name + ': hat in combat (' + (kit ? kit[2] : '?') + ')', kit && hasDrum(kit[2]));
}

// plumbing, both sides of the bus
ok('alpha ships out.pools', src.indexOf('out.pools={}') >= 0);
ok('alpha pushes pools at combat boot', src.indexOf('setTimeout(musicPushToCombat,1200)') >= 0);
ok('combat stores G._pools from the bus', combat.indexOf('if(m.pools)G._pools=m.pools') >= 0);
ok('combat rotates the WHOLE pool', combat.indexOf('function pickSongForEncounter') >= 0 && combat.indexOf('.concat(poolOf(f.n))') >= 0);
ok('old two-slot rotation is gone', combat.indexOf('pickSlotForEncounter') < 0);
ok('vibe overlay restores canon first', combat.indexOf('_poolbak') >= 0);
// THE AUDIT FREEZE (caught live 7/19): combat's own boot faction-pick echoed
// back as userPicked, the push then set _auditSlot, and rotation froze on
// SLOT 1 forever. Only the MUSIC tab's play button may pin a slot (m.audit).
ok('audition pins only on m.audit', combat.indexOf('(m.slot&&m.audit)') >= 0 && combat.indexOf('(m.slot&&m.userPicked)') < 0 && combat.indexOf('if(m.slot)G._auditSlot=m.slot') < 0);
ok('alpha ships the audit flag from the play button only', src.indexOf('audit:!!MUS._audit') >= 0 && src.indexOf('MUS._audit=true') >= 0 && src.indexOf('MUS._audit=false') >= 0);

console.log(`\n=== COMBAT POOL GATE: ${p} passed, ${f} failed ===`);
process.exit(f ? 1 : 0);
