#!/usr/bin/env node
/* COMBAT MAPS [every district its own] 11/2 -- THE PROBE (a measuring instrument). Paolo 11/2 (rule 325, ask line 323): 'we need
   way more combat maps, way more... the only thing you have is like this desert yellow brown suburbia thing'.
   It starts fights headless in the LIVE fight (slices/BOHEMIA_FIGHT.html's own deal and data, through the tuning bench's engine)
   with the options THE GAME hands it: the alpha's own nfOpts as it stands (read out of slices/BOHEMIA_ALPHA_0_9.html, never
   copied), for
     the city   every district WORLD lists (records/target/BOHEMIA_BOARD_KINDS.json, 78), by day and by night;
     the region the 34 real places past the valley (engine/BOHEMIA_REGION_LAND.json places), each handed the district that
                stands on its ground (hills: the mountain; trailer_park: the trailer park...), by day and by night;
     the bosses the act-one bosses' own boards (records/target/bb/boss_act_one.json), by day and by night;
   and logs the block kinds every board was dealt. SUBURB = the tract blocks (subs, suburb_stem, corner, cornerw, culdesac,
   lots): the yellow-brown suburbia he named.
     node tools/bohemia_combat_maps_every_district_probe_11_2_26.js [--json out.json] [--as before|after]
   --as before forces the alpha's handover without the district (what shipped before this round), --as after with it. */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const G = require('./bohemia_tuning_the_whole_grid.js');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const OUT = arg('--json', null), AS = arg('--as', null);
const SUBURB = ['subs', 'suburb_stem', 'corner', 'cornerw', 'culdesac', 'lots'];
/* the region's grounds, to the district of the valley that stands on the same ground (BOARD_KINDS' own ground names) */
const GROUND_DISTRICT = { hills: 'mountain', open_desert: 'desert', trailer_park: 'trailer', golf_and_park: 'golf', lot_and_bigbox: 'commercial',
  wash_and_shore: 'water', solar_and_pumps: 'solar', freeway: 'freeway', industrial: 'industrial', landfill: 'landfill', airport: 'airport',
  suburb_block: 'suburb', the_strip: 'strip' };

/* the alpha's handover, read out of the alpha itself: nfKind and the lines of nfOpts that name the ground */
function alphaHandover() {
  const a = fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
  const k = a.match(/function nfKind\(district\)\{[\s\S]*?\n\}/); if (!k) throw new Error('THE ALPHA MOVED: no nfKind');
  const nfKind = new Function(k[0] + '; return nfKind;')();
  const o = a.match(/function nfOpts\(d\)\{[\s\S]*?\n  return o;\n\}/); if (!o) throw new Error('THE ALPHA MOVED: no nfOpts');
  const handsDistrict = /o\.district\s*=/.test(o[0]), handsCell = /o\.cell\s*=/.test(o[0]);
  return { nfKind, handsDistrict, handsCell };
}

(async () => {
  const H = alphaHandover();
  const withDistrict = AS ? AS === 'after' : H.handsDistrict;
  const ctx = await G.engine(true), F = ctx.FIGHT, DB = ctx.DB;
  const districts = DB.boardKinds.districts.map(r => r.district);
  const land = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine/BOHEMIA_REGION_LAND.json'), 'utf8'));
  const bosses = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/boss_act_one.json'), 'utf8')).bosses;
  const cases = [];
  districts.forEach((d, i) => [false, true].forEach(night => cases.push({ where: 'city', name: d, district: d, night, cell: { x: 20 + (i * 7) % 61, y: 15 + (i * 11) % 53 } })));
  land.places.forEach((p, i) => [false, true].forEach(night => cases.push({ where: 'region', name: p.name, district: GROUND_DISTRICT[p.kind] || 'desert', ground: p.kind, night, cell: { x: p.x, y: p.y } })));
  bosses.forEach((b, i) => [false, true].forEach(night => cases.push({ where: 'boss', name: b.n, board: b.board, district: null, night, cell: { x: 40 + i, y: 40 + i } })));
  const rows = [], kindsSeen = {}, byDistrict = {};
  let blocks = 0, suburbBlocks = 0, threw = 0;
  cases.forEach((c, k) => {
    const o = { kind: c.board || H.nfKind(c.district), night: c.night, auto: true, formation: null };
    if (withDistrict && c.district) { o.district = c.district; o.cell = c.cell; }
    ctx.setSeed(9100 + k);
    try { F.setup(o); } catch (e) { threw++; rows.push({ c, err: String(e).slice(0, 120) }); return; }
    const B = F.S.boardDef, grid = (B.blocks || []).map(r => r.map(n => String(n).split('|')[0]));
    const kinds = {}; grid.forEach(r => r.forEach(n => { const kd = n.split('.')[0]; kinds[kd] = (kinds[kd] || 0) + 1; kindsSeen[kd] = (kindsSeen[kd] || 0) + 1; blocks++; if (SUBURB.indexOf(kd) >= 0) suburbBlocks++; }));
    const sub = Object.keys(kinds).filter(kd => SUBURB.indexOf(kd) >= 0).reduce((t, kd) => t + kinds[kd], 0);
    const total = Object.values(kinds).reduce((t, n) => t + n, 0);
    rows.push({ where: c.where, name: c.name, district: c.district, night: c.night, asked: o.kind, name_on_bar: B.name, kinds, suburbShare: total ? sub / total : 0 });
    const key = c.where + ':' + c.name; (byDistrict[key] = byDistrict[key] || []).push(sub / (total || 1));
  });
  const fights = rows.filter(r => !r.err);
  const mostlySuburb = fights.filter(r => r.suburbShare >= 0.5).length;
  const sum = {
    at: new Date().toISOString(), handover: withDistrict ? 'kind + district + cell (after)' : 'kind only (the alpha before this round)',
    fights: fights.length, threw, distinctBlockKinds: Object.keys(kindsSeen).length,
    suburbShareOfBlocks: +(suburbBlocks / blocks).toFixed(3), boardsMostlySuburb: mostlySuburb,
    boardsMostlySuburbPct: +(100 * mostlySuburb / fights.length).toFixed(1),
    kindsSeen: Object.fromEntries(Object.entries(kindsSeen).sort((a, b) => b[1] - a[1])),
    byWhere: ['city', 'region', 'boss'].reduce((m, w) => { const f = fights.filter(r => r.where === w); m[w] = { fights: f.length, suburbShare: +(f.reduce((t, r) => t + r.suburbShare, 0) / (f.length || 1)).toFixed(3) }; return m; }, {})
  };
  console.log(JSON.stringify(sum, null, 1));
  const worst = Object.entries(byDistrict).map(([k, v]) => [k, v.reduce((t, x) => t + x, 0) / v.length]).sort((a, b) => b[1] - a[1]).slice(0, 12);
  console.log('most suburb (place: share of its blocks):', worst.map(w => w[0] + ' ' + w[1].toFixed(2)).join(', '));
  if (OUT) fs.writeFileSync(OUT, JSON.stringify({ summary: sum, rows }, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
