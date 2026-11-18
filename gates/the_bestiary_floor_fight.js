/* the browser half of gates/the_bestiary_floor_gate.py (BESTIARY, 11/10, rule 441(a): 'a ship is done only when it plays end to end
   ON THE PAGE he plays... on a phone upright and sideways'). On the demo, for each beast BESTIARY added (records/target/bb/lab_beasts.json,
   added_by BESTIARY), one phone held upright and then sideways: its party comes through the one door every encounter uses (cityHandOver,
   as the teratorn's check does), the fight opens and fields it on its own sheet with its own words, the win sends him home, the kill lies
   on the map in its own picture, and one tap puts its meat in the food and a roll of hides in the bag. AND (rule 443(d)) for each enemy
   type BESTIARY added (bohemia_enemies.json rows, added_by BESTIARY): its faction's party through the same door at the first phase
   that deals it (a party of 8; the page's own dealer is asked which of 120 encounters that day carries it, and that one is met): it is fielded in its own clothes (its own sheet loads), named, armed,
   the fight's words name the party, the win sends him home; and the late road crew the page's dealer says carries a champion: named from his list,
   his title on him. Prints one JSON line: RESULT {"portrait": {<faction>: {...}, "men": {...}, "champion": {...}}, "landscape": {...}}. */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(250); } return null; }
const BOOK = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/lab_beasts.json'), 'utf8'));
const MINE = BOOK.beasts.filter(b => String(b.added_by || '').startsWith('BESTIARY'));
const NE = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/bohemia_enemies.json'), 'utf8'));
const OURS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8')), PH = OURS.enemy_tiers.value.phases;
const ONLY = process.env.ONLY_TYPES ? process.env.ONLY_TYPES.split(',') : null;   /* a quick run of some types (the gate runs them all) */
/* BESTIARY 11/17: a man whose one thing is his own is played on the page on AUTO until he does it (the first skill seen, its picture;
   the last, the proof): the duelist's blow back, the preacher's man striking his friend, the spotter's ground called and hit */
const MOVES = { ripostes: ['on_guard', 'riposte'], turns: ['turn', 'turned'], calls: ['call', 'call_lands'], smokes: ['smoke_pot'], firebombs: ['fire_pot'], darts: ['dart'] };
const MEN = NE.rows.filter(r => String(r.added_by || '').startsWith('BESTIARY') && !r.beast && (!ONLY || ONLY.indexOf(r.id) >= 0)).map(r => {
  const m = NE.mix[r.faction] || OURS.enemy_tiers.value.mix[r.faction] || {}, ph = PH.filter(p => m[p.name] && m[p.name][r.id])[0];   /* the kids' and heavies' bands live in ours.json */
  const bv = (NE.brains[r.brain] || {}).value || {}, mv = Object.keys(MOVES).filter(k => bv[k]).reduce((a, k) => a.concat(MOVES[k]), []);
  return { id: r.id, faction: r.faction, looks: r.looks, days: ph ? ph.from_day + 1 : 1, moves: mv }; });
const CH = (NE.champions && NE.champions.kinds) || {};
(async () => {
  const want = process.argv[2] ? process.argv[2].split(',') : ['phone_portrait', 'phone_landscape'];
  /* rule 441 (the routine 'BESTIARY next round': 'alpha and demo, phone both ways'): the demo plays the beasts and the men; the alpha,
     where every lane ships, plays the men and a champion */
  const runsOn = []; want.forEach(pr => runsOn.push({ profile: pr, alpha: false })); if (process.env.NO_ALPHA !== '1') want.forEach(pr => runsOn.push({ profile: pr, alpha: true })); if (process.env.ONLY_ALPHA === '1') runsOn.splice(0, want.length);
  const res = {};
  for (const ro of runsOn) {
    const profile = ro.profile;
    const d = await D.open({ profile, alpha: ro.alpha }); const fr = d.fr, p = d.page, errs = [];
    p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
    const runs = {};
    try {
      /* THE ALPHA STARTS HIM IN THE TOWN, in the close view (the bosses' gate measured it 11/10: MODE 'human'): he taps LEAVE, as a
         player does, and pinches out to the map (the game's own swapMode()) */
      if (ro.alpha) {
        const tapEl = async (h) => { const bb = h && await h.boundingBox(); if (!bb) return false; await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); return true; };
        const inTown = () => fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; }).catch(() => false);
        await waitFor(() => fr.evaluate(() => typeof MODE !== 'undefined' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED), 120000);
        for (let i = 0; i < 40; i++) { const t = await fr.evaluate(() => ({ on: !!window.__START_IN_TOWN, opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await sleep(500); }
        for (let k = 0; k < 3 && await inTown(); k++) { await sleep(900);
          if (!await tapEl(await p.$('#bohphone .bpctx.town .lv'))) { const sfr = p.frames().find(f => /SETTLEMENT/.test(f.url())); if (sfr) await tapEl(await sfr.$('#leave')); } await sleep(1300); }
        for (let k = 0; k < 5; k++) { const sw = await fr.evaluate(() => { try { if (MODE === 'human' && !INSIDE && !(document.getElementById('settleFrame') && document.getElementById('settleFrame').style.display === 'block')) { swapMode(); return true; } } catch (e) {} return MODE === 'city'; }).catch(() => false);
          if (sw) { await sleep(1500); if (await fr.evaluate(() => MODE === 'city').catch(() => false)) break; } else await sleep(1000); }
        runs.toMap = await fr.evaluate(() => MODE).catch(() => null);
      }
      await waitFor(() => fr.evaluate(() => MODE === 'city' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED && window.BohemiaCarcass && BohemiaCarcass.ready()), 90000);
      const BEASTS_HERE = process.env.ONLY_MEN ? [] : MINE.filter(b => (!process.env.ONLY_BEASTS || process.env.ONLY_BEASTS.split(',').indexOf(b.animal) >= 0) && (!ro.alpha || /11\/1[7-9]|11\/[23]/.test(String(b.added_by))));   /* the alpha plays the beasts added from 11/17 on (rule 441, the mammoth) */
      for (const b of BEASTS_HERE) {   /* ONLY_MEN / ONLY_BEASTS: a quick run of one half (the gate runs both) */
        const fac = b.faction, out = { fight: false };
        try {
          await fr.evaluate(() => { try { if (LOOP.open) loopClose(); } catch (e) {} try { travelStop(); } catch (e) {} BohemiaCarcass.reset(); localStorage.setItem('bohemia.bag.v1', '[]'); window.__FIGHT_CAME_HOME = null; });
          await fr.evaluate((f) => { cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: f, faction: null, draft: true, roster: [{ arch: 'beast' }, { arch: 'beast' }],
            party: { count: 2, faction: f, days: 1, difficulty: 1 }, street: true, why: 'gate:bestiary', at: { gx: city.x, gy: city.y }, __met: true }); }, fac);
          const f = await waitFor(async () => { const e = await p.$('#fightFrame'), c = e && await e.contentFrame(); return c && await c.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.units && FIGHT.S.units.length) ? true : null) ? c : null; }, 60000);
          if (!f) { runs[fac] = out; continue; }
          out.fight = true;
          await waitFor(() => p.evaluate(() => !window.NFC || NFC.state === 'off'), 20000); await sleep(1200);
          out.them = await f.evaluate(() => FIGHT.S.units.filter(u => u.side === 'them').map(u => u.kind));
          out.sheets = await f.evaluate(() => { const L = DB.ours.beast_rig_looks && DB.ours.beast_rig_looks.value; return FIGHT.S.units.filter(u => u.side === 'them').map(u => L && L[u.kind]); });
          out.says = await f.evaluate(() => { try { return THEY_ARE[theirFaction()]; } catch (e) { return null; } });
          out.drawn = await f.evaluate(async (look) => { const r = await fetch('fight_rig/fight_rig.json', { cache: 'no-cache' }).then(x => x.json()).catch(() => null); const L = r && r.looks && r.looks[look];
            if (!L) return null; const im = new Image(); im.src = 'fight_rig/' + L.file; await new Promise(res => { im.onload = res; im.onerror = res; }); return im.naturalWidth > 0; }, 'beast_' + b.animal);
          if (process.env.SHOTS) { await sleep(1500); await p.screenshot({ path: path.join(process.env.SHOTS, 'beast_' + b.animal + '_' + (ro.alpha ? 'alpha_' : '') + profile + '.jpg'), quality: 80 }); }
          await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side !== 'them') return; u.hp = 0; u.dead = true; }); });
          await p.evaluate(() => { const fw = document.getElementById('fightFrame').contentWindow; nfOverIn({ type: 'BOHEMIA_FIGHT_OVER', result: 'won', rounds: 2 }, fw); });
          const gone = () => p.evaluate(() => !document.getElementById('spoilsdoor') && !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on'));
          await waitFor(async () => { if (await gone()) return true; const e = await p.$('#spoilsdoor iframe'), sf = e && await e.contentFrame(), lb = sf && await sf.$('#leave');
            if (lb) { await lb.evaluate(x => x.scrollIntoView({ block: 'center' })).catch(() => {}); const bb = await lb.boundingBox(); if (bb && bb.width >= 2) await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await sleep(1200); }
            return (await gone()) || null; }, 90000);
          out.home = !!(await waitFor(() => fr.evaluate(() => MODE === 'city' && window.__FIGHT_CAME_HOME && window.__FIGHT_CAME_HOME.won === true), 15000)); await sleep(1500);
          out.kill = await fr.evaluate(() => { const s = BohemiaCarcass.state(), c = s.list[s.list.length - 1]; if (!c) return null; let pic = null; try { const bp = BohemiaJobKinds.beastPic(c.faction); pic = bp && bp.look || (bp && bp.im ? 'yes' : null); } catch (e) {}
            return { kind: c.kind, faction: c.faction, n: c.n, pic }; });
          if (out.kill) {
            const st = await fr.evaluate(() => BohemiaCarcass.state().list.slice(-1)[0].id);
            out.take = await fr.evaluate((id) => { const f0 = (wagonGet() || {}).food | 0; const ok = BohemiaCarcass.take(id); const bag = JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]');
              return { ok, food: ((wagonGet() || {}).food | 0) - f0, hides: bag.filter(x => x.trade === 'hides' && x.from === 'a kill').length }; }, st);
          }
        } catch (e) { out.err = String(e).slice(0, 300); }
        runs[fac] = out;
      }
      /* THE NEW MEN and A CHAMPION (rule 443(d)): the same door, the faction's own party */
      /* the page deals a band once, from a seed on the encounter's name and size (slices/bohemia_job_danger.js roll), and caps a first day's band
         at his crew plus one: so each try is its own encounter, met on a day its phase is live (the game's clock set there, put back after) */
      const handOver = (f, n, days, tag) => fr.evaluate((o) => { try { if (LOOP.open) loopClose(); } catch (e) {} try { travelStop(); } catch (e) {} window.__FIGHT_CAME_HOME = null;
        try { if (typeof DAY !== 'undefined') { if (window.__GATE_DAY0 === undefined) window.__GATE_DAY0 = DAY.day; DAY.day = o.days; } } catch (e) {}
        cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: o.f, faction: null, draft: true, roster: [{ arch: 'bandit' }, { arch: 'bandit' }],
          party: { count: o.n, faction: o.f, days: o.days, difficulty: 0 }, street: true, why: 'gate:bestiary men:' + o.tag, at: { gx: city.x, gy: city.y }, __met: true }); }, { f, n, days, tag });
      const openFight = () => waitFor(async () => { const e = await p.$('#fightFrame'), c = e && await e.contentFrame(); return c && await c.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.units && FIGHT.S.units.length) ? true : null) ? c : null; }, 60000);
      const winHome = async (f) => {
        await f.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side !== 'them') return; u.hp = 0; u.dead = true; }); });
        await p.evaluate(() => { const fw = document.getElementById('fightFrame').contentWindow; nfOverIn({ type: 'BOHEMIA_FIGHT_OVER', result: 'won', rounds: 2 }, fw); });
        const gone = () => p.evaluate(() => !document.getElementById('spoilsdoor') && !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on'));
        await waitFor(async () => { if (await gone()) return true; const e = await p.$('#spoilsdoor iframe'), sf = e && await e.contentFrame(), lb = sf && await sf.$('#leave');
          if (lb) { await lb.evaluate(x => x.scrollIntoView({ block: 'center' })).catch(() => {}); const bb = await lb.boundingBox(); if (bb && bb.width >= 2) await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await sleep(1200); }
          return (await gone()) || null; }, 90000);
        return !!(await waitFor(() => fr.evaluate(() => MODE === 'city' && window.__FIGHT_CAME_HOME && window.__FIGHT_CAME_HOME.won === true), 15000));
      };
      /* THE PAGE'S OWN DEALER, ASKED FIRST (slices/bohemia_job_danger.js rollInto: the same roll the one door makes, the same seed on the
         same name): of N encounters met on that day, the first whose band carries one of these kinds, and how many of the N did */
      const preRoll = (f, n, days, kinds, pre) => fr.evaluate((o) => {
        try { if (typeof DAY !== 'undefined') { if (window.__GATE_DAY0 === undefined) window.__GATE_DAY0 = DAY.day; DAY.day = o.days; } } catch (e) {}
        let first = null, carry = 0; const all = [];
        for (let i = 0; i < 120; i++) { const m = { type: 'BOHEMIA_CITY_ENCOUNTER', party: { count: o.n, faction: o.f, days: o.days, difficulty: 0 }, why: 'gate:bestiary men:' + o.pre + ':' + i, at: { gx: city.x, gy: city.y } };
          try { BohemiaJobDanger.rollInto(m); } catch (e) {}
          if (m.party.band && m.party.band.some(k => o.kinds.indexOf(k) >= 0)) { carry++; if (first === null) first = i; if (all.length < 4) all.push(i); } }
        return { first, carry, of: 120, all }; }, { f, n, days, kinds, pre });
      const lookOk = (f, kind) => f.evaluate(async (k) => { const us = FIGHT.S.units.filter(u => u.side === 'them' && u.kind === k); if (!us.length) return null;
        const out = []; for (const u of us) { const L = DB.rig.looks[u.look], own = !!L && lookOf(u) === L; let drawn = false;
          if (L) { const im = new Image(); im.src = 'fight_rig/' + L.file; await new Promise(r => { im.onload = r; im.onerror = r; }); drawn = im.naturalWidth > 0; }
          out.push({ look: u.look, own, drawn, name: u.name, weapon: u.weapon && u.weapon.name }); } return out; }, kind);
      runs.men = {};
      for (const m of (process.env.NO_MEN ? [] : MEN)) {
        const o = { fight: false, tries: 0 };
        try {
          o.dealt = await preRoll(m.faction, 8, m.days, [m.id], m.id);
          /* a man whose one thing is his own: up to three of the encounters that carry him, until he does it (a fight can end first) */
          for (let t = 0; t < (m.moves.length ? 4 : 2) && !(o.fielded && (!m.moves.length || (o.move && o.move.seen))) && o.dealt && o.dealt.first !== null; t++) {
            o.fielded = null; o.tries = t + 1; await handOver(m.faction, 8, m.days, m.id + ':' + ((o.dealt.all || [])[t] !== undefined ? o.dealt.all[t] : o.dealt.first)); const f = await openFight(); if (!f) break; o.fight = true;
            await waitFor(() => p.evaluate(() => !window.NFC || NFC.state === 'off'), 20000); await sleep(800);
            o.fielded = await lookOk(f, m.id); o.says = await f.evaluate(() => { try { return THEY_ARE[theirFaction()]; } catch (e) { return null; } });
            if (process.env.SHOTS && o.fielded) { await sleep(1500); await p.screenshot({ path: path.join(process.env.SHOTS, 'men_' + m.id + '_' + (ro.alpha ? 'alpha_' : '') + profile + '.jpg'), quality: 80 }); }
            if (o.fielded && m.moves.length) {   /* his one thing, on the real page: AUTO tapped, the fight played until he does it */
              const tapIn = async (sel) => { const h = await p.$(sel), bb = h && await h.boundingBox(); if (bb && bb.width >= 2) { await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); await sleep(500); return true; } return false; };
              /* his own buttons on the phone (slices/bohemia_phone.js: the fight's FIGHT, AUTO and speed) */
              if (await f.evaluate(() => !!FIGHT.S.deploy)) { await tapIn('#bohphone .fight [data-c="go"]'); await waitFor(() => f.evaluate(() => !FIGHT.S.deploy), 15000); }   /* FIGHT: the line set */
              await tapIn('#bohphone .fight [data-c="auto"]'); o.auto = await f.evaluate(() => !!UI.auto);   /* AUTO */
              for (let i = 0; i < 4 && await f.evaluate(() => (UI.hand || 1) < Math.max.apply(null, SPEEDS)); i++) await tapIn('#bohphone .fight [data-c="speed"]');   /* his fastest speed */
              const seen = (sk) => f.evaluate((q) => { const S = FIGHT.S, e = S.log.filter(x => x.t === 'skill' && x.skill === q.sk && !(x.skill === 'turn' && x.held) && !(x.skill === 'dart' && !x.hit) && ((FIGHT.byId(x.skill === 'turned' ? x.by : x.id) || {}).kind === q.id))[0];
                return e ? { skill: e.skill, round: e.round } : (S.over ? { over: true, result: S.result } : null); }, { sk, id: m.id });
              const first = await waitFor(() => seen(m.moves[0]), Number(process.env.MOVE_MS || 240000));
              if (process.env.SHOTS && first && !first.over) { await sleep(700); await p.screenshot({ path: path.join(process.env.SHOTS, 'move_' + m.id + '_' + (ro.alpha ? 'alpha_' : '') + profile + '.jpg'), quality: 80 }); }
              const last = first && !first.over ? await waitFor(() => seen(m.moves[m.moves.length - 1]), 240000) : first;
              o.move = { first: first, last: last, seen: !!(first && !first.over && last && !last.over) };
              if (process.env.SHOTS && o.move.seen) { await sleep(700); await p.screenshot({ path: path.join(process.env.SHOTS, 'move2_' + m.id + '_' + (ro.alpha ? 'alpha_' : '') + profile + '.jpg'), quality: 80 }); }
            }
            o.home = await winHome(f); await sleep(800);
          }
        } catch (e) { o.err = String(e).slice(0, 300); }
        runs.men[m.id] = o;
      }
      const ch = { tries: 0 };
      if (!process.env.NO_MEN) try {
        ch.dealt = await preRoll('brigands', 8, 70, Object.keys(CH), 'champion');
        for (let t = 0; t < 2 && !ch.named && ch.dealt && ch.dealt.first !== null; t++) {
          ch.tries = t + 1; await handOver('brigands', 8, 70, 'champion:' + ch.dealt.first); const f = await openFight(); if (!f) break;
          await waitFor(() => p.evaluate(() => !window.NFC || NFC.state === 'off'), 20000); await sleep(800);
          const c = await f.evaluate(() => (FIGHT.S.champions || []).map(x => { const u = FIGHT.byId(x.id); return { kind: x.kind, name: x.name, title: x.title, onBoard: !!u && u.name === x.name && u.champion === true, look: u && u.look }; }));
          if (c.length) { ch.named = c; ch.inList = c.every(x => ((CH[x.kind] || {}).names || []).map(n => String(n).toUpperCase()).indexOf(x.name) >= 0 && x.title === (CH[x.kind] || {}).title);
            ch.hold = await f.evaluate((id) => { try { weaponCard(FIGHT.byId(id)); const d = document.getElementById('drawer'); const t = d && d.innerText; return t ? t.slice(0, 160) : null; } catch (e) { return 'ERR ' + String(e).slice(0, 100); } }, (await f.evaluate(() => FIGHT.S.champions[0].id)));
            if (process.env.SHOTS) { await f.evaluate(() => { try { document.getElementById('drawer').style.display = 'block'; } catch (e) {} }); await sleep(600); await p.screenshot({ path: path.join(process.env.SHOTS, 'champion_' + (ro.alpha ? 'alpha_' : '') + profile + '.jpg'), quality: 80 }); } }
          ch.home = await winHome(f); await sleep(800);
        }
      } catch (e) { ch.err = String(e).slice(0, 300); }
      runs.champion = ch;
      await fr.evaluate(() => { try { if (window.__GATE_DAY0 !== undefined) { DAY.day = window.__GATE_DAY0; delete window.__GATE_DAY0; } } catch (e) {} });
    } catch (e) { runs.err = String(e).slice(0, 300); }
    runs.errs = errs; res[(ro.alpha ? 'alpha_' : '') + profile.replace('phone_', '')] = runs;
    try { await d.close(); } catch (e) {}
  }
  console.log('RESULT ' + JSON.stringify(res));
})();
