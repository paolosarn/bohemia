#!/usr/bin/env node
/* NO AMMO, NO SHOT (COMBAT FOUR 11/22, VAMILY rule 478; Paolo 11/22: 'sometimes in auto combat one of my guys has a pistol in his
   pocket inventory and he's still shooting even though there's no ammo... did you not make sure that when the ammo says zero you
   can't even shoot anymore?'). The live fight's own rules, headless (tools/bohemia_fight_headless.js), with a localStorage of its
   own so the rounds his men's names kept and the company's rounds are real:
     N1  EVERY SHOT SPENDS ONE AND AT NONE NOTHING FIRES: whole fights on AUTO with his gunmen walking in low (a pistol 3, a rifle 2,
         a shotgun 1; a blast that strikes three men is one shot, its others logged as its sweep); not one shot leaves a gun of his that had no round left, and no gun of his fires more shots than it walked in
         with; his last round slings the gun and his fists come up (some 'dry' event, some blow with his fists or a swap after it)
     N2  ONLY THE WEAPON IN HIS HANDS FIRES: a man the crew screen left with an EMPTY HAND and a pistol in his bag starts with his
         fists (never his place's gun), and the pistol fires only after a swap brought it out (4 AP, Battle Brothers')
     N3  A RELOAD NEVER LOADS WHAT HE DOES NOT CARRY: a pistol with 7 rounds and a magazine of 5 reloads to 2, never to 5
     N4  WHEN THE FIGHT ENDS: what each gun has left is kept by his name; the company's rounds fill them back one a shot as far as the
         stock goes (a stock of 4 fills 4 and is 0 after); an empty stock leaves them as they were; the dead keep nothing
     N5  THEIR SIDE IS AS IT WAS: their guns carry no count (Battle Brothers' endless quivers)
     N6  AN EMPTY POCKET GUN STAYS IN THE POCKET (11/26): no swap, by AUTO or by hand, ever brings out a gun of his bag with no round
         left (it would only be slung again: 4 AP for nothing)
     N7  THE CARD SHOWS WHAT HE CARRIES (11/26, the coordinator's 'the card shows the rounds'; Battle Brothers' bar shows the quiver): a
         rifle walked in with 2 rounds reads 2 of 10 carried (FIGHT.carried), where the gun's own load reads 1 of 1; the card's
         writer puts FIGHT.carried on the card ('carry', FIGHT SCREEN 3's 11/26 half)
     N8  THE FIGHT'S TURN COUNT STILL GOES HOME (11/26, found on ask row 722): the home message's 'rounds' is the fight's turn count
         (the map's outcome.turns, the spoils' seed); the ammo report rides as 'ammo', never a second 'rounds' that overwrites it
     planted: the round not spent (N1 caught); the empty hand handed his place's gun (N2 caught); an empty pocket gun brought out (N6 caught); the ammo report back under 'rounds' (N8 caught)
   Run: node gates/no_ammo_no_shot_gate.js */
'use strict';
const path = require('path'), ROOT = path.join(__dirname, '..');
const HL = require(path.join(ROOT, 'tools/bohemia_fight_headless.js'));
let pass = 0, fail = 0;
const check = (ok, name, detail) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + detail); };
const store = () => { const m = {}; return { getItem: k => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, removeItem: k => { delete m[k]; }, _m: m }; };
const make = (patch) => { const ls = store(); const ctx = HL.engine({ patch: patch, extra: { localStorage: ls } }); return { ctx, F: ctx.FIGHT, ls }; };
const COMPANY = [
  { name: 'YOU', background: 'hunter', level: 3, gear: { main: 'snub_revolver', bag: ['bludgeon'] } },
  { name: 'LUPE', background: 'hunter', level: 3, gear: { main: 'lever_rifle', bag: [] } },
  { name: 'TAVO', background: 'butcher', level: 3, gear: { main: 'pump_shotgun', bag: [] } },
  { name: 'CHUY', background: 'apprentice', level: 3, gear: { main: null, bag: ['snub_revolver'] } },
  { name: 'MEMO', background: 'butcher', level: 3, gear: { main: 'bludgeon' } }];
const KEPT = { YOU: { snub_revolver: [3] }, LUPE: { lever_rifle: [2] }, TAVO: { pump_shotgun: [1] }, CHUY: { snub_revolver: [4] } };
function fight(E, seed, opt) {
  opt = opt || {};
  E.ls.setItem('bohemia.rounds.v1', JSON.stringify({ v: 1, men: JSON.parse(JSON.stringify(opt.kept || KEPT)) }));
  E.ls.setItem('bohemia.supplies.v1', JSON.stringify({ food: 10, tape: 0, meds: 0, rounds: opt.stock == null ? 0 : opt.stock }));
  E.ctx.setSeed(seed);
  E.F.setup({ kind: 'suburb', cell: { gx: (seed * 37 + 11) % 90, gy: (seed * 53 + 7) % 90 }, night: false, auto: true, formation: null, deploy: false,
    company: opt.company || COMPANY, band: opt.band || ['brigand_thug', 'brigand_thug', 'brigand_marksman', 'brigand_thug', 'brigand_marksman', 'brigand_thug'] });
  const S = E.F.S; S.deploy = false;
  const mine = S.units.filter(u => u.side === 'you'), start = {}, gunId = {}, first = {}, R = { atZero: [], over: [], pocket: [], dryOut: [], dry: 0, fists: 0, swaps: 0, shots: 0, startFists: {}, startWeapon: {} };
  mine.forEach(u => { start[u.id] = u.rounds; gunId[u.id] = u.weapon && u.weapon.id; R.startFists[u.name] = !!(u.weapon && u.weapon.fists); R.startWeapon[u.name] = u.weapon && u.weapon.id; });
  const fired = {};
  let g = 0;
  while (!S.over && S.round <= 30 && g < 60000) {
    const u = E.F.current(); if (!u) break;
    const n0 = S.log.length, before = u.side === 'you' ? { rounds: u.rounds, w: u.weapon && u.weapon.id, fists: !!(u.weapon && u.weapon.fists), mag: u.ammo,
      bag: (u.bag || []).map((b, i) => b && E.F.roundsFull(b) != null && u.bagState && u.bagState[i] && u.bagState[i].rounds != null ? u.bagState[i].rounds : null) } : null;
    E.F.aiStep(u); g++;
    for (let j = n0; j < S.log.length; j++) { const e = S.log[j], v = E.F.byId(e.id); if (!v || v.side !== 'you') continue;
      if (e.t === 'dry') R.dry++;
      if (e.t === 'swap') { R.swaps++; if (v === u && before && before.bag[e.slot] != null && before.bag[e.slot] <= 0) R.dryOut.push(v.name + ' slot ' + e.slot + ' r' + S.round); }
      if (e.t === 'attack' && e.arm === 'fists') R.fists++;
      if (e.t === 'attack' && e.shot && !e.astray && !e.sweep) {   /* a blast's other men are its sweep: one shot */
        R.shots++; fired[v.id + ':' + e.arm] = (fired[v.id + ':' + e.arm] || 0) + 1;
        if (v === u && before && before.rounds != null && before.rounds <= 0) R.atZero.push(v.name + ' ' + e.arm + ' r' + S.round);
        if (v === u && before && before.w !== e.arm && !(e.arm === (u.weapon && u.weapon.id))) R.pocket.push(v.name + ' ' + e.arm + ' (held ' + before.w + ')');
      } }
  }
  mine.forEach(u => { Object.keys(fired).filter(k => k.indexOf(u.id + ':') === 0).forEach(k => { const arm = k.split(':')[1], kept = (KEPT[u.name] || {})[arm];
    const had = kept ? kept.reduce((a, b) => a + b, 0) : E.F.roundsFull({ id: arm, class: (E.ctx.DB.weapons.rows.filter(r => r.id === arm)[0] || {}).class });
    if (had != null && fired[k] > had) R.over.push(u.name + ' ' + arm + ' fired ' + fired[k] + ' of ' + had); }); });
  R.S = S; R.mine = mine; R.theirs = S.units.filter(u => u.side === 'them');
  return R;
}
(function main() {
  const t0 = Date.now();
  /* N1, N2, N5 over many fights */
  let dryOutAll = [], fightsN6 = 0;
  { const E = make(); let atZero = [], over = [], pocket = [], dry = 0, fistsBlows = 0, swaps = 0, shots = 0, fights = 0, startFists = 0, startOk = 0, theirCount = 0, chuyPre = 0;
    for (let f = 0; f < 16; f++) { const R = fight(E, 300 + f); if (!R.S) continue; fights++;
      dryOutAll = dryOutAll.concat(R.dryOut); fightsN6++;
      atZero = atZero.concat(R.atZero); over = over.concat(R.over); pocket = pocket.concat(R.pocket); dry += R.dry; fistsBlows += R.fists; swaps += R.swaps; shots += R.shots;
      if (R.startFists.CHUY) startFists++; if (R.startWeapon.YOU === 'snub_revolver' && !R.startFists.YOU) startOk++;
      theirCount += R.theirs.filter(t => t.rounds != null).length; }
    check(fights >= 12 && !atZero.length && !over.length && dry > 0 && (fistsBlows + swaps) > 0 && shots > 0, 'N1',
      'EVERY SHOT SPENDS ONE AND AT NONE NOTHING FIRES: ' + fights + ' fights on AUTO, ' + shots + ' shots of his; fired with no round left ' + atZero.length + (atZero.length ? ' (' + atZero.slice(0, 3).join('; ') + ')' : '') +
      '; a gun past what it walked in with ' + over.length + (over.length ? ' (' + over.slice(0, 3).join('; ') + ')' : '') + '; guns run dry ' + dry + ', then ' + fistsBlows + ' blows with his fists and ' + swaps + ' swaps');
    check(fights >= 12 && startFists === fights && startOk === fights && !pocket.length, 'N2',
      'ONLY THE WEAPON IN HIS HANDS FIRES: the empty-handed man (a pistol in his bag) starts with his fists in ' + startFists + ' of ' + fights + ' fights, the pistol man with his pistol in ' + startOk + '; a shot from a gun not in his hands ' + pocket.length + (pocket.length ? ' (' + pocket.slice(0, 3).join('; ') + ')' : ''));
    check(fights >= 12 && theirCount === 0, 'N5', 'THEIR SIDE IS AS IT WAS: their men carrying a count of rounds ' + theirCount + ' (their quivers are endless)'); }
  /* N6: an empty pocket gun stays in the pocket; and by hand: a bag gun with no round is refused */
  { const E = make(); E.ls.setItem('bohemia.rounds.v1', JSON.stringify({ v: 1, men: { YOU: { lever_rifle: [0] } } })); E.ctx.setSeed(78);
    E.F.setup({ kind: 'suburb', cell: { gx: 12, gy: 8 }, night: false, auto: true, formation: null, deploy: false,
      company: [{ name: 'YOU', background: 'hunter', level: 3, gear: { main: 'snub_revolver', bag: ['lever_rifle'] } }], band: ['brigand_thug'] });
    const S = E.F.S; S.deploy = false; const u = S.units.filter(v => v.side === 'you')[0]; u.ap = 9; S.order = [u.id].concat(S.order.filter(i => i !== u.id)); S.idx = 0;
    const slot = (u.bag || []).findIndex(b => b && b.id === 'lever_rifle'), st = u.bagState && u.bagState[slot], byHand = slot >= 0 && E.F.canSwap(u, slot);
    check(fightsN6 >= 12 && !dryOutAll.length && slot >= 0 && st && st.rounds === 0 && !byHand, 'N6',
      'AN EMPTY POCKET GUN STAYS IN THE POCKET: over ' + fightsN6 + ' fights on AUTO a swap that brought out a gun with no round ' + dryOutAll.length + (dryOutAll.length ? ' (' + dryOutAll.slice(0, 3).join('; ') + ')' : '') +
      '; by hand, a rifle in his bag with ' + (st ? st.rounds : '?') + ' rounds ' + (byHand ? 'CAN BE BROUGHT OUT (wrong)' : 'is refused')); }
  /* N7: the card shows what he carries */
  { const E = make(); E.ls.setItem('bohemia.rounds.v1', JSON.stringify({ v: 1, men: { YOU: { lever_rifle: [2] } } })); E.ctx.setSeed(79);   /* a lone first slot is YOU */
    E.F.setup({ kind: 'suburb', cell: { gx: 13, gy: 9 }, night: false, auto: true, formation: null, deploy: false, company: [COMPANY[1]], band: ['brigand_thug'] });
    const S = E.F.S; S.deploy = false; const u = S.units.filter(v => v.side === 'you')[0], c = E.F.carried(u), g = E.F.rounds(u);
    const src = require('fs').readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8'), at = src.indexOf('__THE_ROUNDS_ON_THE_CARD__ (FIGHT SCREEN THREE 11/22;'), blk = at >= 0 ? src.slice(at, at + 2400) : '';
    const reads = /FIGHT\.carried\(show\)/.test(blk) && /put\(ap, 'carry'/.test(blk);   /* FIGHT SCREEN 3's card (11/26): the gun's load, and what he carries for it as 'carry' */
    check(!!c && c.left === 2 && c.of === 10 && reads, 'N7', 'THE CARD SHOWS WHAT HE CARRIES: a rifle walked in with 2 reads ' + (c ? c.left + ' of ' + c.of : 'NOTHING') + ' (the gun\'s own load ' + (g ? g.left + ' of ' + g.of : '-') + '); the card\'s writer ' + (reads ? 'puts FIGHT.carried on the card' : 'DOES NOT PUT FIGHT.carried ON THE CARD')); }
  /* N8: the turn count goes home */
  const homeKeys = (src) => { const a = src.indexOf('function homeMessage(result)'), b = src.indexOf('\n}\n', a), body = a >= 0 ? src.slice(a, b) : '';
    let depth = 0, keys = []; const re = /[{}()\[\]]|(?:^|[,{\s])rounds:/g; let m;
    while ((m = re.exec(body))) { const t = m[0]; if ('{(['.indexOf(t) >= 0) depth++; else if ('})]'.indexOf(t) >= 0) depth--; else if (depth === 2) keys.push(m.index); }
    return { body, keys, ammo: /\bammo: \(function \(\) \{ try \{ return FIGHT\.settleRounds\(\); \}/.test(body), turn: /\brounds: S\.round,/.test(body) }; };
  { const src = require('fs').readFileSync(path.join(ROOT, 'slices/BOHEMIA_FIGHT.html'), 'utf8'), { body, keys, ammo, turn } = homeKeys(src);
    const P = homeKeys(src.replace('    ammo: (function () { try { return FIGHT.settleRounds();', '    rounds: (function () { try { return FIGHT.settleRounds();'));
    check(P.keys.length === 2, 'N8p', 'planted: the ammo report back under \'rounds\' (11/22zza) is caught (' + P.keys.length + ' \'rounds\' keys)');
    check(!!body && keys.length === 1 && ammo && turn, 'N8', 'THE FIGHT\'S TURN COUNT STILL GOES HOME: the home message carries ' + keys.length + ' \'rounds\' key' + (keys.length === 1 ? '' : 's') + (turn ? ' (the turn count, S.round)' : ' (NOT the turn count)') + '; the ammo report rides as ' + (ammo ? '\'ammo\'' : 'SOMETHING ELSE')); }
  /* N3: a reload loads what he carries */
  { const E = make(); E.ls.setItem('bohemia.rounds.v1', JSON.stringify({ v: 1, men: { YOU: { snub_revolver: [7] } } })); E.ctx.setSeed(77);
    E.F.setup({ kind: 'suburb', cell: { gx: 11, gy: 7 }, night: false, auto: true, formation: null, deploy: false, company: [COMPANY[0]], band: ['brigand_thug'] });
    const S = E.F.S; S.deploy = false; const u = S.units.filter(v => v.side === 'you')[0], mag = u.weapon.mag;
    u.rounds = 2; u.ammo = 0; u.ap = 9; u.fat = 0; S.order = [u.id].concat(S.order.filter(i => i !== u.id)); S.idx = 0;
    const ok = E.F.canReload(u), r = ok && E.F.reload(u);
    const got = u.ammo; u.rounds = 0; u.ammo = 0; u.ap = 9; const none = E.F.canReload(u);
    check(mag === 5 && r && got === 2 && !none, 'N3', 'A RELOAD NEVER LOADS WHAT HE DOES NOT CARRY: a magazine of ' + mag + ' with 2 rounds left reloads to ' + got + '; with none left it reloads ' + (none ? 'ANYWAY (wrong)' : 'never')); }
  /* N4: when the fight ends */
  { const E = make(); const R = fight(E, 400, { stock: 4 }); const out = E.F.settleRounds(), st = JSON.parse(E.ls.getItem('bohemia.rounds.v1')), sup = JSON.parse(E.ls.getItem('bohemia.supplies.v1'));
    const need = out ? out.men.reduce((a, m) => a + m.guns.reduce((b, g) => b + (g.full - (g.left - g.filled)), 0), 0) : -1;
    const E2 = make(); fight(E2, 400, { stock: 0 }); const out2 = E2.F.settleRounds(), st2 = JSON.parse(E2.ls.getItem('bohemia.rounds.v1'));
    const same = out2 && out2.refilled === 0 && out2.men.every(m => m.guns.every(g => g.filled === 0 && (st2.men[m.name][g.id] || []).indexOf(g.left) >= 0));
    const dead = R.mine.filter(u => u.dead).map(u => u.name), keptDead = dead.filter(n => st.men[n]);
    check(!!out && out.refilled === Math.min(4, need) && sup.rounds === 4 - out.refilled && out.stockAfter === sup.rounds && same && !keptDead.length && out.spent > 0, 'N4',
      'WHEN THE FIGHT ENDS: ' + (out ? out.spent + ' rounds spent; a stock of 4 filled ' + out.refilled + ' of the ' + need + ' his guns lacked, the stock ' + sup.rounds + ' after' : 'NOTHING SETTLED') +
      '; an empty stock filled ' + (out2 ? out2.refilled : '?') + ' and kept every gun as it was (' + (same ? 'yes' : 'NO') + '); the dead keep nothing (' + dead.length + ' dead, ' + keptDead.length + ' kept)'); }
  /* plants */
  { const E = make(rules => rules.replace('    spendRound(a);   /* rule 478: one of what he carries */\n', '')); let over = 0, atZero = 0;
    for (let f = 0; f < 8; f++) { const R = fight(E, 300 + f); over += R.over.length; atZero += R.atZero.length; }
    check(over + atZero > 0, 'N1p', 'planted: the round not spent is caught (' + over + ' guns past their rounds, ' + atZero + ' shots at none)'); }
  { const E = make(rules => rules.replace("if (c && c.gear && !c.gear.main) toFists(u, null, false);", 'if (false) toFists(u, null, false);'));
    const R = fight(E, 301); check(!R.startFists.CHUY, 'N2p', 'planted: the empty hand handed his place\'s gun is caught (he starts with ' + R.startWeapon.CHUY + ')'); }
  { const E = make(rules => rules.replace(' && !bagDry(u, i); }', '; }')); let dryOut = 0;
    for (let f = 0; f < 8; f++) { const R = fight(E, 300 + f, { kept: { YOU: { snub_revolver: [1], bludgeon: [] }, LUPE: { lever_rifle: [1] }, TAVO: { pump_shotgun: [1] }, CHUY: { snub_revolver: [0] } } }); dryOut += R.dryOut.length; }
    const E2 = make(rules => rules.replace(' && !bagDry(u, i); }', '; }')); E2.ls.setItem('bohemia.rounds.v1', JSON.stringify({ v: 1, men: { YOU: { lever_rifle: [0] } } })); E2.ctx.setSeed(78);
    E2.F.setup({ kind: 'suburb', cell: { gx: 12, gy: 8 }, night: false, auto: true, formation: null, deploy: false, company: [{ name: 'YOU', background: 'hunter', level: 3, gear: { main: 'snub_revolver', bag: ['lever_rifle'] } }], band: ['brigand_thug'] });
    const S2 = E2.F.S; S2.deploy = false; const u2 = S2.units.filter(v => v.side === 'you')[0]; u2.ap = 9; S2.order = [u2.id].concat(S2.order.filter(i => i !== u2.id)); S2.idx = 0;
    const byHand = E2.F.canSwap(u2, (u2.bag || []).findIndex(b => b && b.id === 'lever_rifle'));
    check(dryOut + (byHand ? 1 : 0) > 0, 'N6p', 'planted: the empty pocket gun brought out is caught (' + dryOut + ' on AUTO with CHUY\'s pocket pistol empty; by hand ' + (byHand ? 'allowed' : 'refused') + ')'); }
  console.log('NO AMMO, NO SHOT: ' + pass + ' passed, ' + fail + ' failed (' + Math.round((Date.now() - t0) / 1000) + ' s)');
  process.exit(fail ? 1 : 0);
})();
