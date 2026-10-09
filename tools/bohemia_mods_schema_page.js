#!/usr/bin/env node
/* ============================================================================
   BOHEMIA -- MODS: THE ONE PAGE A MODDER READS (MODS lane, 10/9/26)
   Row [the data schema page], rule 22. Paolo 9/30: "the point of the mods chat
   is to make it easy for people to make mods." So this page is GENERATED from
   the live files in records/target/bb/, never typed, and cannot drift from
   them: shape, row count, every field with its type and an example value, how
   many rows leave it blank, and WHO READS the file (every tracked file in
   slices/, engine/, gates/ and tools/ that names it).
   Usage: node tools/bohemia_mods_schema_page.js [--write]
     --write  writes records/BOHEMIA_MODS_THE_DATA_SCHEMA_10_9_26.md
              and slices/BOHEMIA_MODS_THE_DATA_SCHEMA_10_9_26.html
   ============================================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
const BB = path.join(ROOT, 'records', 'target', 'bb');

const CAND = new Set();
try { const reg = JSON.parse(fs.readFileSync(path.join(ROOT, 'records', 'target', 'BOHEMIA_VOTE_REGISTRY.json'), 'utf8')); for (const i of reg.items || []) if (i.lane === 'mods' && i.show && i.show.src && /\.html$/.test(i.show.src)) CAND.add('slices/' + i.show.src); } catch (e) {}
CAND.add('slices/BOHEMIA_MODS_THE_DATA_SCHEMA_10_9_26.html');
const tracked = execSync('git ls-files slices engine gates tools', { cwd: ROOT, maxBuffer: 1 << 28 }).toString().split('\n').filter(f => /\.(js|py|html)$/.test(f) && !CAND.has(f));
function readers(name) {
  const out = { fight: [], other: [], gates: [], tools: [] };
  for (const f of tracked) {
    let t; try { t = fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { continue; }
    if (!t.includes(name)) continue;
    (f.startsWith('gates/') ? out.gates : f.startsWith('tools/') ? out.tools : out.other).push(f);
  }
  return out;
}
const short = v => { const s = JSON.stringify(v); return s.length > 48 ? s.slice(0, 45) + '...' : s; };
const typeOf = v => v === null ? 'null' : Array.isArray(v) ? 'list' : typeof v === 'object' ? 'object' : typeof v;

function fieldsOf(rows) {
  const f = {};
  for (const r of rows) for (const [k, v] of Object.entries(r)) {
    const e = f[k] || (f[k] = { types: {}, nulls: 0, ex: undefined, min: Infinity, max: -Infinity });
    const ty = typeOf(v); e.types[ty] = (e.types[ty] || 0) + 1;
    if (v === null) e.nulls++;
    else { if (e.ex === undefined) e.ex = v; if (typeof v === 'number') { e.min = Math.min(e.min, v); e.max = Math.max(e.max, v); } }
  }
  return Object.entries(f).map(([k, e]) => ({ name: k, type: Object.keys(e.types).filter(t => t !== 'null').join('/') || 'null', blank: e.nulls, ex: e.ex === undefined ? '' : short(e.ex), range: isFinite(e.min) ? e.min + ' to ' + e.max : '' }));
}
const isRowObj = x => x && typeof x === 'object' && !Array.isArray(x);
function describe(file) {
  const j = JSON.parse(fs.readFileSync(path.join(BB, file), 'utf8'));
  const about = typeof j._about === 'string' ? j._about : (j._about || j._meta) ? JSON.stringify(j._about || j._meta) : '';
  const d = { file, bytes: fs.statSync(path.join(BB, file)).size, about: about.replace(/\s+/g, ' ').slice(0, 260), tables: [], values: [] };
  for (const [k, v] of Object.entries(j)) {
    if (k.startsWith('_')) continue;
    if (Array.isArray(v) && v.length && v.every(isRowObj)) d.tables.push({ name: k, count: v.length, fields: fieldsOf(v) });
    else if (isRowObj(v) && Object.keys(v).length > 8 && Object.values(v).every(isRowObj) && Object.values(v).every(r => 'id' in r || 'name' in r || 'bb_name' in r || 'line' in r)) {
      d.tables.push({ name: k + ' (keyed by id)', count: Object.keys(v).length, fields: fieldsOf(Object.values(v)) });
    } else d.values.push({ name: k, type: typeOf(v), ex: short(v && typeof v === 'object' && 'value' in v ? v.value : v) });
  }
  d.rowCount = d.tables.reduce((a, t) => a + t.count, 0);
  d.readers = readers(file);
  return d;
}
const files = fs.readdirSync(BB).filter(f => f.endsWith('.json')).sort();
const all = files.map(describe);

/* THE WORKED EXAMPLE, from the live row: change the knife's damage. */
const w = JSON.parse(fs.readFileSync(path.join(BB, 'weapons.json'), 'utf8')).rows.find(r => r.id === 'knife');
const dmgReaders = (() => { const out = []; for (const f of tracked) { let t; try { t = fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch (e) { continue; } if (t.includes('damage_min')) out.push(f); } return out; })();
const example = { before: { id: w.id, name: w.name, damage_min: w.damage_min, damage_max: w.damage_max }, after: { id: w.id, name: w.name, damage_min: w.damage_min + 5, damage_max: w.damage_max + 5 }, readers: dmgReaders };

const SHAPES = { rows: 'a list of rows, each with an id', values: 'named values, each a number or a small object with value, source and quote' };
function md() {
  const L = [];
  L.push('# THE DATA FILES, ON ONE PAGE (generated 10/9/26 by tools/bohemia_mods_schema_page.js)', '');
  L.push('Paolo 9/30: "the point of the mods chat is to make it easy for people to make mods." This page is written from the live files in `records/target/bb/`, so it cannot disagree with them. Re-run the tool and it rewrites itself.', '');
  L.push('## THE FIVE THINGS TO KNOW', '',
    '1. **Two shapes, and some files have both.** A *table* is a list of rows, each with an `id`. A *value* is a named number, or a small object with `value`, `source` and `quote`.',
    '2. **Every row says where it came from.** The `source` field names the wiki page (or the ruling) a number was copied from. `missing` lists what the source left blank. Do not delete them; they are how a change is traced.',
    '3. **Units.** Damage is hit points. Anything ending `_pct` is percent. `ap` is action points. `range` is tiles. **Money in the wiki files is crowns; the game shows batteries at 10 crowns to 1 (price_table.json, and the engine converts when it reads).** Edit crowns. The one exception is origins.json, which carries a crowns block AND a batteries block: keep them in step.',
    '4. **`_about` is the documentation.** Each file opens with a plain account of what it holds, its source and who owns changing it.',
    '5. **Names are drafts.** A row with `draft: true` has a name and line that are an attempt; the numbers around them are the wiki\'s.', '');
  L.push('## THE FILES', '', '| file | rows or keys | read live by | gates that read it |', '|---|---|---|---|');
  for (const d of all) L.push('| ' + d.file + ' | ' + (d.tables.length ? d.rowCount + ' rows' + (d.values.length ? ' and ' + d.values.length + ' values' : '') : d.values.length + ' values') + ' | ' + (d.readers.other.map(x => x.replace(/^(slices|engine)\//, '')).join(', ') || 'a build input, not read live') + ' | ' + (d.readers.gates.length) + ' |');
  L.push('');
  for (const d of all) {
    L.push('### ' + d.file, '', '*' + d.bytes + ' bytes.* ' + d.about, '');
    for (const t of d.tables) {
      L.push('**' + t.name + ': ' + t.count + ' rows.** Fields:', '', '| field | type | example | blank | range |', '|---|---|---|---|---|');
      for (const f of t.fields.slice(0, 30)) L.push('| ' + f.name + ' | ' + f.type + ' | ' + f.ex.replace(/\|/g, '/') + ' | ' + f.blank + ' of ' + t.count + ' | ' + f.range + ' |');
      if (t.fields.length > 30) L.push('| ... | | ' + (t.fields.length - 30) + ' more fields | | |');
      L.push('');
    }
    if (d.values.length) { L.push('**Values:** ' + d.values.slice(0, 24).map(v => '`' + v.name + '` ' + v.ex).join('; ') + (d.values.length > 24 ? '; and ' + (d.values.length - 24) + ' more' : ''), ''); }
  }
  L.push('## A WORKED EXAMPLE: MAKE THE KNIFE HIT HARDER', '',
    'In `records/target/bb/weapons.json`, find the row with `"id": "knife"`.', '',
    '    before:  ' + JSON.stringify(example.before),
    '    after:   ' + JSON.stringify(example.after), '',
    'That is the whole change. These files name `damage_min` and read it live or check it, so they are where it shows up:', '');
  for (const f of example.readers) L.push('- `' + f + '`');
  L.push('', 'Nothing else needs editing: the fight rolls its damage from the row, the settlement screen and the roster print it from the row, and the fight\'s gate reads the number from the row instead of pinning a digit. (Checked by reading the code. The gate takes about five minutes and was not re-run with a changed row, so run it yourself before you trust a change.)');
  return L.join('\n') + '\n';
}
function html() {
  const data = all.map(d => ({ f: d.file.replace('BOHEMIA_', ''), about: d.about, rows: d.rowCount, nvals: d.values.length, by: d.readers.other.map(x => x.replace(/^(slices|engine)\//, '').replace(/^BOHEMIA_/, '').replace(/\.html$/, '')), gates: d.readers.gates.length,
    tables: d.tables.map(t => ({ n: t.name, c: t.count, fs: t.fields.slice(0, 14).map(f => [f.name, f.type, f.ex]) })), vals: d.values.slice(0, 10).map(v => [v.name, v.ex]) }));
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The Data Files</title>
<style>:root{--bg:#0b0d0c;--ink:#cfd6cc;--dim:#6f7a70;--red:#d8352a;--amber:#d9a441;--ok:#7fb069;--line:#1d2320}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.4 ui-monospace,Menlo,Consolas,monospace;overflow-x:hidden}
body:after{content:"";position:fixed;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px)}
.wrap{max-width:560px;margin:0 auto;padding:14px 16px 40px}h1{font-size:20px;letter-spacing:.08em;margin:6px 0 2px;text-transform:uppercase}
.sub{color:var(--dim);font-size:12px;margin-bottom:12px}.five{border-left:3px solid var(--amber);padding:6px 10px;margin:8px 0;font-size:12px}
.card{border:1px solid var(--line);margin:6px 0;background:#0e1110}.hd{display:flex;justify-content:space-between;gap:8px;padding:10px;cursor:pointer}
.hd b{overflow:hidden;text-overflow:ellipsis}.hd span{color:var(--dim);font-size:11px;flex:none}.bd{padding:0 10px 10px;font-size:12px}
.k{color:var(--dim);font-size:10px;letter-spacing:.1em;margin-top:8px}.t{width:100%;border-collapse:collapse}.t td{padding:3px 4px;border-bottom:1px solid var(--line);vertical-align:top;word-break:break-word}
.hid{display:none}.ex{border:1px solid var(--ok);padding:10px;margin:14px 0;font-size:12px}.ex pre{margin:6px 0;white-space:pre-wrap;word-break:break-word}.ok{color:var(--ok)}</style></head><body><div class="wrap">
<h1>The data files, on one page</h1><div class="sub">MODS. Made from the real files, so it cannot be wrong about them. Tap a file.</div>
<div class="five" id="five"></div><div id="list"></div>
<div class="ex"><b class="ok">WORKED EXAMPLE: MAKE THE KNIFE HIT HARDER</b>
<pre id="ex"></pre><div id="exr"></div></div></div>
<script>var D=${JSON.stringify(data)};var EX=${JSON.stringify(example)};
function e(t,c,x){var d=document.createElement(t);if(c)d.className=c;if(x!==undefined)d.textContent=x;return d;}
document.getElementById('five').textContent='Rows have an id and a source. Damage is hit points, _pct is percent, ap is action points. Money is crowns, ten to the battery (origins carries both). Every file opens with _about, which says what it holds.';
var L=document.getElementById('list');
D.forEach(function(d){var c=e('div','card');var h=e('div','hd');h.appendChild(e('b','',d.f.replace('.json','')));h.appendChild(e('span','',(d.rows?d.rows+' rows':'')+(d.rows&&d.nvals?' + ':'')+(d.nvals?d.nvals+' values':'')));c.appendChild(h);
var b=e('div','bd hid');b.appendChild(e('div','',d.about));b.appendChild(e('div','k','READ LIVE BY'));b.appendChild(e('div','',d.by.length?d.by.join(', '):'a build input, not read live'));
d.tables.forEach(function(t){b.appendChild(e('div','k',t.n.toUpperCase()+', '+t.c+' ROWS'));var tb=e('table','t');t.fs.forEach(function(f){var r=e('tr');r.appendChild(e('td','',f[0]));r.appendChild(e('td','',f[1]));r.appendChild(e('td','',f[2]));tb.appendChild(r);});b.appendChild(tb);});
if(d.vals.length){b.appendChild(e('div','k','VALUES'));b.appendChild(e('div','',d.vals.map(function(v){return v[0]+' '+v[1];}).join('; ')));}
c.appendChild(b);h.onclick=function(){b.className=b.className==='bd hid'?'bd':'bd hid';};L.appendChild(c);});
document.getElementById('ex').textContent='in weapons.json, the row "knife"\\nbefore: '+JSON.stringify(EX.before)+'\\nafter:  '+JSON.stringify(EX.after);
document.getElementById('exr').textContent='These files name damage_min, so this is where the change shows up: '+EX.readers.map(function(x){return x.replace(/^(slices|engine|gates)\\//,'');}).join(', ')+'.';
</script></body></html>
`;
}
if (process.argv.includes('--json')) { console.log(JSON.stringify({ all, example }, null, 1)); process.exit(0); }
const text = md();
if (process.argv.includes('--write')) {
  fs.writeFileSync(path.join(ROOT, 'records', 'BOHEMIA_MODS_THE_DATA_SCHEMA_10_9_26.md'), text);
  fs.writeFileSync(path.join(ROOT, 'slices', 'BOHEMIA_MODS_THE_DATA_SCHEMA_10_9_26.html'), html());
  console.log('wrote records/BOHEMIA_MODS_THE_DATA_SCHEMA_10_9_26.md and the slice page, ' + text.length + ' chars, ' + all.length + ' files');
} else console.log(text.slice(0, 3000));
module.exports = { all, example };
