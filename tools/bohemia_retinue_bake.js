#!/usr/bin/env node
/* BOHEMIA RETINUE BAKE (RETINUE, rule 425(c), 11/7): writes records/target/bb/retinue.json's eighteen rows into
   engine/bohemia_camp.js between its __RETINUE_ROWS__ marks, so the copy the game starts with is the file a modder edits.
   The game reads the file again at load, so an edit works after a reload even without this; this keeps the shipped copy equal
   (gates/the_retinue_gate.js goes red the moment the two differ).
     node tools/bohemia_retinue_bake.js          write it
     node tools/bohemia_retinue_bake.js --check  exit 1 if the copy differs from the file */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const FILE = path.join(ROOT, 'records/target/bb/retinue.json'), ENGINE = path.join(ROOT, 'engine/bohemia_camp.js');
const rows = JSON.parse(fs.readFileSync(FILE, 'utf8')).followers.value;
const body = '[\n' + rows.map(r => '    ' + JSON.stringify(r)).join(',\n') + '\n  ]';
const src = fs.readFileSync(ENGINE, 'utf8');
const re = /(\/\* __RETINUE_ROWS__ \*\/ )[\s\S]*?( \/\* \/__RETINUE_ROWS__ \*\/)/;
if (!re.test(src)) { console.error('no __RETINUE_ROWS__ marks in engine/bohemia_camp.js'); process.exit(2); }
const out = src.replace(re, (m, a, b) => a + body + b);
if (process.argv.includes('--check')) { const same = out === src; console.log(same ? 'the engine copy equals the file' : 'the engine copy differs from records/target/bb/retinue.json: run node tools/bohemia_retinue_bake.js'); process.exit(same ? 0 : 1); }
fs.writeFileSync(ENGINE, out);
console.log('baked ' + rows.length + ' followers into engine/bohemia_camp.js');
