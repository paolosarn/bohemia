#!/usr/bin/env node
/* MODS [one weapon file] (10/10/26): what of a weapon row does the new fight actually PLAY, and which parts of
   a weapon are prose a modder cannot edit. Reads records/target/bb/weapons.json and the fight's own text.
   Run: node tools/bohemia_mods_weapon_skills_audit.js [--json] */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const rows = JSON.parse(fs.readFileSync(path.join(ROOT, 'records', 'target', 'bb', 'weapons.json'), 'utf8')).rows;
const fight = fs.readFileSync(path.join(ROOT, 'slices', 'BOHEMIA_FIGHT.html'), 'utf8');
const strike = r => r.skills.filter(s => !/^Reload/.test(s.name));
const SHAPE = /(tiles? behind|in a line|around you|adjacent|\barc\b|\bcone\b|up to \d|all (?:adjacent|enemies)|splash)/i;
const out = { weapons: rows.length, strikeSlots: 0, multiSkill: 0, firstNames: new Set(), otherNames: new Set(), firstShapeProse: [], reloaders: [], skillReads: [] };
for (const r of rows) {
  const s = strike(r); out.strikeSlots += s.length;
  if (s.length > 1) out.multiSkill++;
  if (s[0]) { out.firstNames.add(s[0].name); if (SHAPE.test(s[0].effect || '')) out.firstShapeProse.push(r.id); }
  s.slice(1).forEach(x => out.otherNames.add(x.name));
  if (r.skills.some(x => /^Reload/.test(x.name))) out.reloaders.push(r.id);
}
const never = [...out.otherNames].filter(n => !out.firstNames.has(n)).sort();
/* every line in the fight that reads a weapon's skills, so the claim "only the first strike skill is played" can be checked by eye */
fight.split('\n').forEach((l, i) => { if (/\.skills\b/.test(l)) out.skillReads.push((i + 1) + ': ' + l.trim().slice(0, 150)); });
const res = { weapons: out.weapons, strikeSkillSlots: out.strikeSlots, weaponsWithTwoOrMoreStrikeSkills: out.multiSkill, distinctFirstSkills: out.firstNames.size, skillsNeverFirst: never.length, neverFirst: never, weaponsWhoseFirstSkillHasAShapeInProse: out.firstShapeProse.length, shapeProseWeapons: out.firstShapeProse, reloadWeapons: out.reloaders, whereTheFightReadsSkills: out.skillReads };
if (process.argv.includes('--json')) console.log(JSON.stringify(res, null, 1));
else {
  console.log(res.weapons + ' weapons, ' + res.strikeSkillSlots + ' strike-skill slots; ' + res.weaponsWithTwoOrMoreStrikeSkills + ' weapons have 2 or more.');
  console.log('The fight plays one: ' + res.distinctFirstSkills + ' distinct skills are ever a weapon\'s first; ' + res.skillsNeverFirst + ' others are never first: ' + never.slice(0, 12).join(', ') + '...');
  console.log(res.weaponsWhoseFirstSkillHasAShapeInProse + ' weapons\' first skill describes its shape only in a sentence.');
  console.log('reload weapons: ' + res.reloadWeapons.join(', '));
  console.log('the fight reads .skills at:'); res.whereTheFightReadsSkills.forEach(x => console.log('  ' + x));
}
