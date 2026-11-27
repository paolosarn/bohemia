/* BESTIARY 4 PROOF: A CHAMPION IS ROLLED (Paolo 11/27, VAMILY rule 493(c): 'champions in the hard jobs and the roaming forces, each with a
   name, a look, kit a tier up and a prize on him'). Five killers (five men of level 11, their stats grown the crew screen's way, the city
   shelf's kit: tools/bohemia_bestiary_four_five_killers.js) meet a three-star job's band on day 90, rolled by the fight's own setup on the
   headless engine until one carries a rolled champion, then handed WHOLE to the shipped fight page at phone size (390 by 844) through the
   one driver, AUTO on both sides: the band is the band, and his roll is off the band itself, so the page meets the same man. Frames: the
   champion at the start (his skull, his name said), mid-fight, and the end; his numbers read off the page; his prize off the spoils engine.
   node tools/bohemia_bestiary_four_champion_proof.js [faction]   (writes records/bestiary_proof/champion_proof.json and its frames) */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.dirname(__dirname), OUT = path.join(ROOT, 'records/bestiary_proof');   /* not published: the site sits at its cap (ask row 775) */
const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const G = require(path.join(ROOT, 'tools/bohemia_tuning_the_whole_grid.js'));
const K = require(path.join(ROOT, 'tools/bohemia_bestiary_four_five_killers.js'));
fs.mkdirSync(OUT, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function until(p, fn, arg, ms) { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await p.evaluate(fn, arg)) return true; } catch (e) {} await sleep(150); } return false; }
const FAC = process.argv[2] || 'house', NAMES = ['YOU', 'DESI', 'RAMON', 'CHUY', 'LALO'];
(async () => {
  const men = K.grown(G.companyOf(5, 'late').map(m => Object.assign({}, m, { level: 11 }))).map((m, i) => Object.assign({}, m, { name: NAMES[i], main: i === 0 }));
  const cs = K.strengthOf(men), P = K.jobParty(cs, 3, 90);
  /* the band, rolled where the fight rolls it, until one carries a champion the roll made */
  const ctx = await G.engine(true, null), F = ctx.FIGHT;
  let pick = null;
  for (let s = 1; s <= 400 && !pick; s++) { ctx.setSeed(s);
    F.setup({ auto: true, formation: null, company: men, cap: 12, party: { faction: FAC, count: P.count, days: P.days, difficulty: P.difficulty, over: P.over, skulls: 3 }, days: P.days });
    const them = F.S.units.filter(u => u.side === 'them'), c = (F.S.champions || []).filter(x => x.rolled)[0];
    if (c) { const u = them.filter(v => v.id === c.id)[0]; pick = { seed: s, band: them.map(v => v.kind), champion: { name: c.name, title: c.title, kind: c.kind, hp: u.hp, armour: [u.armH, u.armB], mskill: u.mskill, rskill: u.rskill, mdef: u.mdef, prize: c.prize } }; } }
  if (!pick) throw new Error('no champion in 400 rolls of a three-star ' + FAC + ' band');
  /* the same kind, no champion, for the before beside him */
  ctx.setSeed(pick.seed); F.setup({ auto: true, formation: null, company: men, cap: 12, party: [{ kind: pick.champion.kind, count: 1 }], days: P.days });
  const plain = F.S.units.filter(u => u.side === 'them')[0];
  const proof = { at: new Date().toISOString(), faction: FAC, party: P, strength: cs, rolled_at_seed: pick.seed, band: pick.band, champion: pick.champion,
    same_kind_plain: { hp: plain.hp, armour: [plain.armH, plain.armB], mskill: plain.mskill, rskill: plain.rskill, mdef: plain.mdef }, shots: [] };
  /* his prize, off the spoils engine (engine/bohemia_spoils.js found, the loot file's dice all missing: nothing but the prize drops) */
  const S = require(path.join(ROOT, 'engine/bohemia_spoils.js'));
  const LOOT = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/loot.json'), 'utf8'));
  const arm = 'window.FIGHT_OPTS = ' + JSON.stringify({ seed: pick.seed, speed: 1, auto: true, deploy: false, teach: false, company: men, cap: 12,
    party: { faction: FAC, count: pick.band.length, band: pick.band, days: P.days, difficulty: P.difficulty, skulls: 3, rolled: true }, days: P.days }) + ';';
  const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm }), p = d.page;
  try {
    await until(p, () => typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.units && FIGHT.S.units.length > 1 && !FIGHT.S.deploy, null, 90000);
    proof.page = await p.evaluate(() => ({ champions: FIGHT.S.champions, band: FIGHT.S.units.filter(v => v.side === 'them').map(v => v.kind) }));
    proof.same_man_on_the_page = !!(proof.page.champions || []).some(c => c.name === pick.champion.name && c.kind === pick.champion.kind);
    const aim = async (zoom) => p.evaluate((z) => { const c = (FIGHT.S.champions || [])[0]; const u = c && FIGHT.byId(c.id); if (!u) return false; UI.zoom = Math.max(UI.zoom, UI.far * z); const q = aimAt(u.x, u.y); UI.cx = q[0]; UI.cy = q[1]; return true; }, zoom);
    /* the ground loads first ('LOADING THE GROUND'): wait for his skull to be drawn on the board, the camera on him */
    const t0 = Date.now(); while (Date.now() - t0 < 150000) { await aim(1.8); if (await p.evaluate(() => { const c = (FIGHT.S.champions || [])[0]; const u = c && FIGHT.byId(c.id); return !!(u && u._champ && performance.now() - u._champ.at < 500); })) break; await sleep(400); }
    for (const [k, wait, z] of [['start', 900, 1.8], ['close', 700, 2.6]]) { await aim(z); await sleep(wait);
      const f = path.join(OUT, 'champion_' + k + '.jpg'); await p.screenshot({ path: f, type: 'jpeg', quality: 78 });
      proof.shots.push({ file: path.relative(ROOT, f), mark: await p.evaluate(() => { const c = (FIGHT.S.champions || [])[0]; const u = c && FIGHT.byId(c.id); return u && u._champ ? { x: Math.round(u._champ.x), y: Math.round(u._champ.y) } : null; }) }); }
    await until(p, () => FIGHT.S.over, null, 300000);
    proof.over = await p.evaluate(() => { const c = (FIGHT.S.champions || [])[0], u = c && FIGHT.byId(c.id); return { result: FIGHT.S.result, rounds: FIGHT.S.round, champion_dead: !!(u && u.dead), champion_fled: !!(u && u.fled) }; });
    const sp = await p.evaluate(() => { try { return spoilsOf(); } catch (e) { return null; } });
    if (sp) { const D = LOOT;   /* the spoils screen hands the loot file itself (slices/BOHEMIA_SPOILS_SCREEN.html S.L) */ try { proof.prize = S.found(sp, D, () => 0.999); } catch (e) { proof.prize_err = String(e.message || e); }
      proof.champion_body = (sp.bodies || []).filter(b => b.champion).map(b => ({ name: b.name, weapon: b.weapon && b.weapon.id, body: b.body && b.body.id, head: b.head && b.head.id, prize: b.prize, dead: b.dead })); }
    await sleep(400); await p.screenshot({ path: path.join(OUT, 'champion_end.jpg'), type: 'jpeg', quality: 78 }); proof.shots.push({ file: 'records/bestiary_proof/champion_end.jpg' });
    proof.errors = d.errs.slice(0, 10);
  } finally { await d.close(); }
  fs.writeFileSync(path.join(OUT, 'champion_proof.json'), JSON.stringify(proof, null, 1));
  console.log(JSON.stringify({ champion: proof.champion, plain: proof.same_kind_plain, same: proof.same_man_on_the_page, over: proof.over, body: proof.champion_body, prize: proof.prize && { items: proof.prize.items, batteries: proof.prize.counts && proof.prize.counts.batteries, champions: proof.prize.champions }, err: proof.prize_err, errors: proof.errors, shots: proof.shots }, null, 0).slice(0, 3000));
})().catch(e => { console.error(e); process.exit(1); });
