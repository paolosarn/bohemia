// DISTRICT REGISTRY GATE (Paolo 7/18/26)
// A district type added to the engine but never catalogued is exactly the gap
// Paolo caught ("do you have all the info of all the types"). This gate makes
// the registry impossible to fall behind: every DISTRICT enum member must have
// a row in laws/BOHEMIA_DISTRICT_REGISTRY_7_18_26.md. Regenerate the registry
// (python3 tools/bohemia_district_registry.py) the same turn any type is added.
const fs = require('fs');
let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const src = fs.readFileSync('engine/bohemia_overmap.js', 'utf8');
const enumBody = src.match(/const DISTRICT=\{([\s\S]*?)\};/)[1];
const types = [...enumBody.matchAll(/[A-Z_]+:[ ]*'([a-z_]+)'/g)].map(m => m[1]);
ok('DISTRICT enum parsed (>0 types)', types.length > 0);

const REG = 'laws/BOHEMIA_DISTRICT_REGISTRY_7_18_26.md';
ok('registry file exists', fs.existsSync(REG));
if (fs.existsSync(REG)) {
  const reg = fs.readFileSync(REG, 'utf8');
  // every type must appear as a `\`type\`` cell in a table row
  const listed = new Set([...reg.matchAll(/\|\s*`([a-z_]+)`\s*\|/g)].map(m => m[1]));
  const missing = types.filter(t => !listed.has(t));
  ok('every DISTRICT enum type has a registry row (' + types.length + ')', missing.length === 0);
  if (missing.length) console.log('  uncatalogued types: ' + missing.join(' '));

  // the headline count must match the real enum size (catches a stale doc)
  const m = reg.match(/\*\*(\d+)\*\* district types defined/);
  ok('registry count matches the enum size', m && Number(m[1]) === types.length);
  if (m && Number(m[1]) !== types.length)
    console.log('  registry says ' + m[1] + ', enum has ' + types.length);
}

console.log('DISTRICT REGISTRY GATE: ' + pass + ' passed, ' + fail + ' failed  (' +
  types.length + ' types)');
process.exit(fail ? 1 : 0);
