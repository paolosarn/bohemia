#!/usr/bin/env node
/* BOHEMIA -- MODS [sharing a mod] (research, 10/10/26): a mod as ONE small file you can send to a friend.
   pack:   node tools/bohemia_mods_pack.js pack <mod folder> [out.json]   -> <id>.bohemiamod.json
   unpack: node tools/bohemia_mods_pack.js unpack <file.bohemiamod.json> <folder that will hold the mod>
   A pack is plain JSON: {"format":1,"manifest":{...},"files":{"weapons.json":{...}}}. Anyone can open it in a text editor.
   Help only: nothing here refuses a mod. Not loaded by any play surface. */
'use strict';
const fs = require('fs'), path = require('path');
function pack(dir) {
  const man = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8')), files = {}, left = [];
  for (const f of fs.readdirSync(dir).sort()) if (f.endsWith('.json') && f !== 'manifest.json') {
    try { files[f] = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { left.push(f); }   /* not JSON: left out, said out loud */
  }
  const out = { format: 1, manifest: man, files };
  if (left.length) Object.defineProperty(out, 'leftOut', { value: left, enumerable: false });
  return out;
}
function unpack(obj, outParent) {
  if (!obj || obj.format !== 1 || !obj.manifest || typeof obj.manifest.id !== 'string' || !obj.files) throw new Error('this is not a Bohemia mod file (format 1 with a manifest and files)');
  const id = obj.manifest.id.replace(/[^\w.-]/g, '_'), d = path.join(outParent, id);
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, 'manifest.json'), JSON.stringify(obj.manifest, null, 1));
  for (const [f, body] of Object.entries(obj.files)) fs.writeFileSync(path.join(d, path.basename(f)), JSON.stringify(body, null, 1));
  return d;
}
module.exports = { pack, unpack };
if (require.main === module) {
  const [cmd, a, b] = process.argv.slice(2);
  if (cmd === 'pack' && a) { const p = pack(a), out = b || p.manifest.id + '.bohemiamod.json'; fs.writeFileSync(out, JSON.stringify(p)); console.log('wrote ' + out + ' (' + fs.statSync(out).size + ' bytes)'); if (p.leftOut) console.log('left out, not valid JSON: ' + p.leftOut.join(', ')); }
  else if (cmd === 'unpack' && a && b) { console.log('wrote ' + unpack(JSON.parse(fs.readFileSync(a, 'utf8')), b)); }
  else console.log('Usage:\n  node tools/bohemia_mods_pack.js pack <mod folder> [out.json]\n  node tools/bohemia_mods_pack.js unpack <file.bohemiamod.json> <folder>');
}
