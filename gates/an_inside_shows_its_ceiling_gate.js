#!/usr/bin/env node
/* AN INSIDE SHOWS ITS CEILING (COMBAT THREE 11/14/26; VAMILY rule 451(a), ask row 623; PAOLO's vote on the parking garage: 'let's just
   start off with a 10% opacity for real, like I still need to see the parking garage ceiling, an exterior that I am in the interior
   of... the opacity is gonna be really low').
   THE LAW: a board that is the inside of a building carries that building's ceiling (its data file's 'ceiling'), and the page draws
   it over the whole board at about 10%, never past the fight's own most; the garage, the casino floor and the tunnels' roof. The
   picture is COOK FIVE's: the name in the data file is the contract, 'have' true the day it is in the folder; until then the fight
   draws the kind itself. How it reads on the glass is measured on the real page (tools/bohemia_combat_three_on_the_page.js,
   C3_CEILING=1: the same frame with and without it), not here.
   THE LEGS (the live fight's own deal, headless):
     C1  THE DATA: each of the three insides' data files names its ceiling: an alpha from 0.05 to 0.12, a kind the fight draws (deck,
         coffer, vault), a picture under its own folder, how many tiles one picture covers
     C2  THE BOARD CARRIES IT: a fight dealt inside each (asked by name) carries that ceiling, its kind and its alpha
     C3  ONLY AN INSIDE: a fight outdoors (every place's first district, the insides refused) carries none
     C4  NEVER STRONG: a data file that asked for 90% is dealt the fight's most (0.14) and no more
     C5  THE PICTURE'S CONTRACT: with 'have' false the board asks for no picture (the stand-in); with 'have' true it asks for the
         file the data names
     planted: a data file with no ceiling: the board carries none (C2 would read red)
   Run: node gates/an_inside_shows_its_ceiling_gate.js      (about ten seconds) */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..'), HL = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const J = f => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')); } catch (e) { return null; } };
const ctx = HL.engine({ extra: { window: null } }); ctx.window = ctx;
for (const f of ['slices/bohemia_street_board.js', 'engine/bohemia_fight_kinds.js', 'slices/bohemia_casino_floor.js', 'slices/bohemia_flood_tunnels.js', 'slices/bohemia_parking_garage.js']) { try { vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx); } catch (e) {} }
const SK = 'slices/fight_ground/street_board/';
ctx.DB.streetKit = J(SK + 'street_board.json'); ctx.DB.streetDress = J(SK + 'dressing.json'); ctx.DB.streetStoreys = J(SK + 'storeys.json');
const kitOf = (data, sizes, pre) => { const kit = {}; Object.keys(data.kit).forEach(k => { const z = sizes[k.replace(pre, '')]; kit[k] = Object.assign({}, data.kit[k], z ? { src: z.src } : {}); }); return kit; };
const FILES = { garage: 'slices/fight_ground/garage/garage.json', casino: 'slices/fight_ground/casino/casino_floor.json', tunnels: 'slices/fight_ground/tunnels/tunnels.json' };
const DATA = { garage: J(FILES.garage), casino: J(FILES.casino), tunnels: J(FILES.tunnels) };
const load = (D) => { const gd = D.garage, ga = J('slices/fight_ground/garage/garage_art.json'), kit = {};
  Object.keys(ga.kit).forEach(k => { kit[k] = Object.assign({}, ga.kit[k], (gd.rules || {})[k] || {}); }); Object.keys(gd.kit).forEach(k => { const q = (gd.sizes || {})[gd.kit[k].like || k.replace(/^garage_/, '')]; kit[k] = Object.assign({}, q ? { src: q.src } : {}, gd.kit[k]); });
  ctx.DB.garage = { data: gd, art: ga, sizes: gd.sizes || {}, kit };
  const cz = J('slices/fight_ground/casino/sizes.json') || {}; ctx.DB.casino = { data: D.casino, sizes: cz, kit: kitOf(D.casino, cz, /^casino_/) };
  const tz = J('slices/fight_ground/tunnels/sizes.json') || {}; ctx.DB.tunnels = { data: D.tunnels, sizes: tz, kit: kitOf(D.tunnels, tz, /^tunnel_/) }; };
const F = ctx.FIGHT, PL = ctx.DB.ours.place_boards.value.places;
const inside = (name, i) => { ctx.setSeed(3300 + (i || 0)); F.setup({ district: DATA[name].districts[0], cell: { gx: 20 + (i || 0), gy: 31 }, night: false, auto: true, formation: null, deploy: false, inside: name }); return F.S; };
const KINDS = ['deck', 'coffer', 'vault'], with_ = (name, c) => { const D = Object.assign({}, DATA); D[name] = Object.assign({}, DATA[name], { ceiling: c }); return D; };
(async () => {
  const t0 = Date.now(); load(DATA);
  { const bad = []; Object.keys(DATA).forEach(n => { const c = DATA[n].ceiling; if (!c || !(c.alpha >= 0.05 && c.alpha <= 0.12) || KINDS.indexOf(c.kind) < 0 || !c.src || c.src.split('/')[0] !== path.basename(path.dirname(FILES[n])) || !Array.isArray(c.tile) || (c.have && !fs.existsSync(path.join(ROOT, 'slices/fight_ground', c.src)))) bad.push(n + ' ' + JSON.stringify(c || null).slice(0, 80)); });
    check(!bad.length, 'C1', 'THE DATA: ' + Object.keys(DATA).map(n => n + ' ' + (DATA[n].ceiling ? DATA[n].ceiling.kind + ' at ' + DATA[n].ceiling.alpha + ' (' + DATA[n].ceiling.src + (DATA[n].ceiling.have ? ', in' : ', owed by COOK FIVE') + ')' : 'NONE')).join('; ') + (bad.length ? '; BAD: ' + bad.join('; ') : '')); }
  { const got = Object.keys(DATA).map(n => { const S = inside(n, 1), c = S.boardDef.ceiling, want = DATA[n].ceiling; return { n, in: S.boardDef.interior, ok: S.boardDef.interior === n && !!c && c.kind === want.kind && Math.abs(c.alpha - want.alpha) < 1e-9 }; });
    check(got.every(g => g.ok), 'C2', 'THE BOARD CARRIES IT: ' + got.map(g => g.n + (g.ok ? ' yes' : ' NO (dealt ' + g.in + ')')).join(', ') + ': a fight dealt inside carries its ceiling, the data\'s kind and alpha'); }
  { let n = 0, none = 0; Object.keys(PL).filter(p => PL[p].built).forEach((p, i) => { ctx.setSeed(3400 + i); F.setup({ district: PL[p].districts[0], cell: { gx: 5 + i, gy: 9 }, night: false, auto: true, formation: null, deploy: false, inside: false }); n++; if (!F.S.boardDef.ceiling && !F.S.boardDef.interior) none++; });
    check(none === n && n >= 15, 'C3', 'ONLY AN INSIDE: ' + none + ' of ' + n + ' fights outdoors carry no ceiling'); }
  { load(with_('garage', Object.assign({}, DATA.garage.ceiling, { alpha: 0.9 }))); const c = inside('garage', 2).boardDef.ceiling; load(DATA);
    check(!!c && c.alpha <= 0.14 + 1e-9 && c.alpha >= 0.1, 'C4', 'NEVER STRONG: a data file that asked for 0.9 is dealt ' + (c ? c.alpha : 'none') + ' (the fight\'s most 0.14)'); }
  { const a = inside('garage', 3).boardDef.ceiling; load(with_('garage', Object.assign({}, DATA.garage.ceiling, { have: true }))); const b = inside('garage', 3).boardDef.ceiling; load(DATA);
    check(!!a && !!b && (DATA.garage.ceiling.have ? a.src === DATA.garage.ceiling.src : a.src === null) && b.src === DATA.garage.ceiling.src && a.name === DATA.garage.ceiling.src, 'C5', 'THE PICTURE\'S CONTRACT: with have ' + !!DATA.garage.ceiling.have + ' the board asks for ' + (a && a.src ? a.src : 'no picture (the stand-in)') + '; with have true it asks for ' + (b && b.src)); }
  { const D = with_('garage', null); delete D.garage.ceiling; load(D); const c = inside('garage', 1).boardDef.ceiling; load(DATA);
    check(!c, 'Cp', 'planted: a data file with no ceiling, the board carries ' + (c ? 'one all the same' : 'none')); }
  console.log('\nAN INSIDE SHOWS ITS CEILING: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(2); });
