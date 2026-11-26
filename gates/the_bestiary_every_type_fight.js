/* EVERY TYPE THROUGH A FIGHT ON THE PHONE (BESTIARY 2, 11/26, VAMILY rule 480(b): 'improve on what we already have'; the round
   BESTIARY wrote: 'put each of the enemy types already built through a fight on the phone: its look reads, its moves work, its
   drops land, no bug'). The page half of the sweep (the rules half is tools/bohemia_bestiary_every_type.js). It widens
   gates/the_bestiary_floor_fight.js (BESTIARY's own rows) to EVERY KIND THE BANDS DEAL: the wiki's rows COMBAT and FACTIONS fielded
   (the brigands, the beasts, the ghost, the machines, the kids, the heavies, the dogs) as well as BESTIARY's.
   For each kind, on the demo or the alpha, a phone upright or sideways:
     THE DOOR    the page's own dealer is asked which of 120 encounters of its faction, met on a day its phase is live, carries it
                 (slices/bohemia_job_danger.js rollInto), and that one comes through the one door every encounter uses (cityHandOver)
     ITS LOOK    fielded; a man on his own sheet (the look the fight draws is his look, and the picture loads); a beast on its own
                 picture (the fight's rigBeast is the beast_rig_looks entry for its kind, never the dire wolf it falls back to);
                 named; and what a held finger shows (the fight's own weaponCard): the card names him and his weapon
     ITS MOVE    a kind whose brain gives it a thing of its own (bohemia_enemies.json brains): FIGHT and AUTO tapped on the phone's
                 own buttons at his fastest speed, played until he does it (MOVES=0 skips)
     THE WIN     every man of theirs down and the fight's own showOver('won'): the real word home, its spoils with it
     ITS DROPS   a man: the end screen's WHAT THEY LEFT (its own S.found) holds a piece off his body, LOOT ALL takes it; a beast:
                 the kill lies on the map in its picture and one tap puts meat in the food and hides in the bag
     HOME        LEAVE tapped like a finger; he is on the map, the fight won
     NOTHING THROWN on the page or its frames.
   Writes one JSON line per kind to OUT (a file, appended as it goes) and prints RESULT {...} at the end.
   KINDS=<ids> some kinds; PROFILES=phone_portrait,phone_landscape; ALPHA=1 the alpha; MOVES=0 no moves; SHOTS=<dir> pictures. */
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.dirname(__dirname);
const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
async function waitFor(fn, ms) { const t = Date.now(); while (Date.now() - t < ms) { try { const v = await fn(); if (v) return v; } catch (e) {} await sleep(250); } return null; }
const NE = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/bohemia_enemies.json'), 'utf8'));
const OURS = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/ours.json'), 'utf8'));
const TT = OURS.enemy_tiers.value, PH = TT.phases, MIX = Object.assign({}, NE.mix, TT.mix), HEADS = Object.assign({}, NE.heads, TT.heads || {});
const BRAIN_SKILLS = { ripostes: ['on_guard', 'riposte'], turns: ['turn', 'turned'], calls: ['call', 'call_lands'], smokes: ['smoke_pot'], firebombs: ['fire_pot'], darts: ['dart'], binds: ['bond', 'bond_hurt'], doors: ['back_door'], sirens: ['siren'], acid: ['acid'], tramples: ['trample'] };
const KINDS = {};
Object.keys(MIX).forEach(f => PH.forEach(ph => Object.keys(MIX[f][ph.name] || {}).forEach(k => { if (MIX[f][ph.name][k] > 0 && !KINDS[k]) KINDS[k] = { id: k, faction: f, days: ph.from_day + 1 }; })));
Object.keys(HEADS).forEach(f => { const k = HEADS[f]; if (!KINDS[k]) KINDS[k] = { id: k, faction: f, days: PH[0].from_day + 1, head: true }; });
Object.values(KINDS).forEach(K => { const r = NE.rows.filter(x => x.id === K.id)[0]; const bv = r && NE.brains[r.brain] ? NE.brains[r.brain].value || {} : {};
  K.moves = Object.keys(BRAIN_SKILLS).filter(k => bv[k]).reduce((a, k) => a.concat(BRAIN_SKILLS[k]), []); K.by = r ? r.added_by || 'bohemia_enemies' : 'the wiki'; });
const ONLY = process.env.KINDS ? process.env.KINDS.split(',') : null;
const LIST = Object.values(KINDS).filter(K => !ONLY || ONLY.indexOf(K.id) >= 0);
const OUT = process.env.OUT || null;
(async () => {
  const profiles = (process.env.PROFILES || 'phone_portrait').split(','), alpha = process.env.ALPHA === '1', MOVES = process.env.MOVES !== '0';
  const res = {};
  for (const profile of profiles) {
    const surf = (alpha ? 'alpha_' : 'demo_') + profile.replace('phone_', '');
    const d = await D.open({ profile, alpha }); const fr = d.fr, p = d.page, errs = [];
    p.on('pageerror', e => errs.push(String(e).slice(0, 240)));
    p.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|net::ERR|favicon|404/.test(m.text())) errs.push('console: ' + m.text().slice(0, 240)); });
    const runs = {}; res[surf] = runs;
    /* the renderer's weight after each kind (a page that grows fight after fight dies on a phone): the JS heap, the documents, the nodes */
    const cdpM = await p.context().newCDPSession(p); await cdpM.send('Performance.enable').catch(() => {});
    const weight = async () => { try { await cdpM.send('HeapProfiler.collectGarbage').catch(() => {}); const m = (await cdpM.send('Performance.getMetrics')).metrics, g = (n) => (m.filter(x => x.name === n)[0] || {}).value; return { heapMB: Math.round(g('JSHeapUsedSize') / 1048576), documents: g('Documents'), frames: g('Frames'), nodes: g('Nodes') }; } catch (e) { return null; } };
    /* NO HANDLE IS KEPT: a Playwright element handle pins its node, and a pinned iframe keeps its whole page alive after the game has
       let it go (measured 11/26: the renderer at 7.9 GB after 18 fights while the checker held a handle every 250 ms); frames are found
       by their address and every handle is let go at once */
    const tapAt = async (frame, sel) => { const h = await frame.$(sel); if (!h) return false; try { await h.evaluate(x => x.scrollIntoView({ block: 'center' })).catch(() => {}); const bb = await h.boundingBox(); if (!bb || bb.width < 2) return false; await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); return true; } finally { await h.dispose().catch(() => {}); } };
    const frameOf = (re) => p.frames().find(f => !f.isDetached() && re.test(f.url())) || null;
    const fightFrameOf = async () => { for (const f of p.frames()) { if (f.isDetached() || !/BOHEMIA_FIGHT\.html/.test(f.url())) continue; if (await f.evaluate(() => !!(window.frameElement && window.frameElement.id === 'fightFrame')).catch(() => false)) return f; } return null; };   /* the fight on the glass, never the one warming behind the card */
    try {
      if (alpha) {   /* the alpha opens him in his town: LEAVE as a player taps it, then the map (the bosses' gate's way in) */
        const inTown = () => fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; }).catch(() => false);
        await waitFor(() => fr.evaluate(() => typeof MODE !== 'undefined' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED), 120000);
        for (let i = 0; i < 40; i++) { const t = await fr.evaluate(() => ({ on: !!window.__START_IN_TOWN, opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await sleep(500); }
        for (let k = 0; k < 3 && await inTown(); k++) { await sleep(900);
          if (!await tapAt(p, '#bohphone .bpctx.town .lv')) { const sfr = p.frames().find(f => /SETTLEMENT/.test(f.url())); if (sfr) await tapAt(sfr, '#leave'); } await sleep(1300); }
        for (let k = 0; k < 5; k++) { const sw = await fr.evaluate(() => { try { if (MODE === 'human' && !INSIDE && !(document.getElementById('settleFrame') && document.getElementById('settleFrame').style.display === 'block')) { swapMode(); return true; } } catch (e) {} return MODE === 'city'; }).catch(() => false);
          if (sw) { await sleep(1500); if (await fr.evaluate(() => MODE === 'city').catch(() => false)) break; } else await sleep(1000); }
      }
      await waitFor(() => fr.evaluate(() => MODE === 'city' && typeof RESTORE_ANSWERED !== 'undefined' && RESTORE_ANSWERED && window.BohemiaCarcass && BohemiaCarcass.ready()), 90000);
      const preRoll = (o) => fr.evaluate((o) => {
        try { if (typeof DAY !== 'undefined') { if (window.__GATE_DAY0 === undefined) window.__GATE_DAY0 = DAY.day; DAY.day = o.days; } } catch (e) {}
        let first = null, carry = 0; const all = [];
        for (let i = 0; i < 120; i++) { const m = { type: 'BOHEMIA_CITY_ENCOUNTER', party: { count: o.n, faction: o.f, days: o.days, difficulty: 0 }, why: 'gate:every type:' + o.id + ':' + i, at: { gx: city.x, gy: city.y } };
          try { BohemiaJobDanger.rollInto(m); } catch (e) {}
          if (m.party.band && m.party.band.indexOf(o.id) >= 0) { carry++; if (first === null) first = i; if (all.length < 4) all.push(i); } }
        return { first, carry, of: 120, all }; }, o);
      const handOver = (o, i) => fr.evaluate((o) => { try { if (LOOP.open) loopClose(); } catch (e) {} try { travelStop(); } catch (e) {} window.__FIGHT_CAME_HOME = null;
        try { BohemiaCarcass.reset(); } catch (e) {} localStorage.setItem('bohemia.bag.v1', '[]');
        try { if (typeof DAY !== 'undefined') { if (window.__GATE_DAY0 === undefined) window.__GATE_DAY0 = DAY.day; DAY.day = o.days; } } catch (e) {}
        cityHandOver({ type: 'BOHEMIA_CITY_ENCOUNTER', label: o.f, faction: null, draft: true, roster: [{ arch: 'bandit' }, { arch: 'bandit' }],
          party: { count: o.n, faction: o.f, days: o.days, difficulty: 0 }, street: true, why: 'gate:every type:' + o.id + ':' + o.i, at: { gx: city.x, gy: city.y }, __met: true }); }, Object.assign({ i }, o));
      const openFight = () => waitFor(async () => { const c = await fightFrameOf(); return c && await c.evaluate(() => (typeof FIGHT !== 'undefined' && FIGHT.S && FIGHT.S.board && FIGHT.S.units && FIGHT.S.units.length) ? true : null) ? c : null; }, 60000);
      for (const K of LIST) {
        const o = { kind: K.id, faction: K.faction, by: K.by, fight: false, bugs: [] }; const t0 = Date.now(); const e0 = errs.length;
        try {
          const ask = { f: K.faction, n: K.moves.length && MOVES ? 5 : 8, days: K.days, id: K.id };   /* a smaller band for a man watched for his move: the demo's crew of three lasts long enough to see it */
          o.dealt = await preRoll(ask);
          if (!o.dealt || o.dealt.first === null) { o.bugs.push('no encounter of ' + K.faction + ' in 120 deals him on day ' + K.days); throw null; }
          const tries = K.moves.length && MOVES ? Math.min(4, o.dealt.all.length) : 1;
          /* the end of one encounter: a fight still on is won by the fight's own showOver('won') (every man of theirs down), its end
             screen read and LOOT ALL taken; a fight the demo's crew already lost is left as a loss; LEAVE tapped like a finger */
          const finish = async (f, names) => {
            const r0 = await f.evaluate(() => FIGHT.S.over ? FIGHT.S.result : null).catch(() => null), lost = !!r0 && r0 !== 'won';
            if (!lost) await f.evaluate(() => { const S = FIGHT.S; S.units.forEach(u => { if (u.side === 'them' && !u.fled) { u.hp = 0; u.dead = true; } }); if (!S.over) { S.over = true; S.result = 'won'; showOver('won'); } });
            const r = { lost, result: lost ? r0 : 'won' };
            const sf = await waitFor(async () => { const c = frameOf(/BOHEMIA_SPOILS_SCREEN/); return c && await c.evaluate(() => (function () { var S = window.BohemiaSpoilsScreen && BohemiaSpoilsScreen.state; return S && S.ready && S.found ? true : null; })()) ? c : null; }, 30000);
            r.endScreen = !!sf;
            if (sf && !lost) {
              r.left = await sf.evaluate((nm) => { const S = BohemiaSpoilsScreen.state, it = S.found.items || [];
                return { items: it.length, his: it.filter(x => nm.indexOf(x.from) >= 0).map(x => x.kind + ':' + x.id), from: S.found.from, counts: S.found.counts }; }, names || []);
              r.bodies = await f.evaluate((k) => { try { return spoilsOf().bodies.filter(b => b.kind === k).map(b => ({ weapon: b.weapon && b.weapon.id, shield: b.shield && b.shield.id, body: b.body && b.body.id, head: b.head && b.head.id })).slice(0, 2); } catch (e) { return 'THREW ' + String(e).slice(0, 100); } }, K.id);
              if (r.left.items > 0) {   /* LOOT ALL, a finger, once the screen has laid the ground out */
                await waitFor(() => sf.evaluate(() => { const b = document.getElementById('lootall'); return b && !b.disabled && b.getBoundingClientRect().width > 2 && BohemiaSpoilsScreen.state.ground.length > 0; }), 10000);
                for (let k = 0; k < 3 && !(r.took > 0); k++) { await tapAt(sf, '#lootall'); await sleep(1200); r.took = await sf.evaluate(() => BohemiaSpoilsScreen.state.stash.length); }
                r.bag = await p.evaluate(() => { try { return JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]').length; } catch (e) { return null; } });
              }
            }
            const gone = () => p.evaluate(() => !document.getElementById('spoilsdoor') && !document.getElementById('fightFrame') && !document.body.classList.contains('nf-on'));
            await waitFor(async () => { if (await gone()) return true; const c = frameOf(/BOHEMIA_SPOILS_SCREEN/); if (c) { await tapAt(c, '#leave'); await sleep(1200); } return (await gone()) || null; }, 60000);
            r.home = !!(await waitFor(() => fr.evaluate((w) => MODE === 'city' && !!window.__FIGHT_CAME_HOME && (window.__FIGHT_CAME_HOME.won === true) === w, !lost), 15000));
            await sleep(900); return r;
          };
          let won = null; o.lost = 0;
          for (let t = 0; t < tries + 1 && !(won && (!(K.moves.length && MOVES) || (o.move && o.move.seen) || t >= tries)); t++) {
            o.tries = t + 1;
            await handOver(ask, o.dealt.all[t % Math.max(1, o.dealt.all.length)] !== undefined ? o.dealt.all[t % Math.max(1, o.dealt.all.length)] : o.dealt.first);
            const f = await openFight(); if (!f) { o.bugs.push('the fight never opened'); break; } o.fight = true;
            await waitFor(() => p.evaluate(() => !window.NFC || NFC.state === 'off'), 20000); await sleep(800);
            /* ITS LOOK, ITS NAME, WHAT A FINGER SHOWS */
            if (!o.look) {
              o.look = await f.evaluate(async (k) => {
                const us = FIGHT.S.units.filter(u => u.side === 'them' && u.kind === k); if (!us.length) return null;
                const out = [];
                for (const u of us.slice(0, 3)) {
                  let L, own, key = null;
                  if (u.beast) { key = DB.ours.beast_rig_looks && DB.ours.beast_rig_looks.value[k]; L = rigBeast(u); own = !!key && !!DB.rig.looks[key] && L === DB.rig.looks[key]; }
                  else { L = DB.rig.looks[u.look]; own = !!L && lookOf(u) === L; key = u.look; }
                  let drawn = false; if (L) { const im = new Image(); im.src = 'fight_rig/' + L.file; await new Promise(r => { im.onload = r; im.onerror = r; }); drawn = im.naturalWidth > 0; }
                  out.push({ key, own, drawn, name: u.name, weapon: u.weapon && u.weapon.name, beast: !!u.beast, ghost: !!u.ghost, machine: !!u.machine });
                }
                let card = null; try { weaponCard(us[0]); const dr = document.getElementById('drawer'); card = dr ? dr.innerText.replace(/\s+/g, ' ').slice(0, 220) : null; dr.style.display = 'none'; UI.wcard = null; } catch (e) { card = 'THREW ' + String(e).slice(0, 120); }
                let says = null; try { says = THEY_ARE[theirFaction()] || null; } catch (e) {}
                return { men: out, names: us.map(u => u.name), card, says, n: us.length, of: FIGHT.S.units.filter(u => u.side === 'them').length };
              }, K.id);
              if (!o.look) o.bugs.push('not on the board (the deal said so, the fight did not field him)');
              else {
                if (o.look.men.some(m => !m.own)) o.bugs.push('not in his own picture: ' + o.look.men.map(m => m.key).join(','));
                if (o.look.men.some(m => !m.drawn)) o.bugs.push('his picture does not load');
                if (o.look.men.some(m => !m.name)) o.bugs.push('no name');
                if (!o.look.card || /^THREW/.test(o.look.card)) o.bugs.push('the held finger card: ' + o.look.card);
              }
              if (process.env.SHOTS) { await sleep(1200); await p.screenshot({ path: path.join(process.env.SHOTS, K.id + '_' + surf + '.jpg'), quality: 72 }); }
            }
            const names = await f.evaluate((k) => FIGHT.S.units.filter(u => u.side === 'them' && u.kind === k).map(u => u.name), K.id).catch(() => []);
            /* ITS MOVE (the tries that carry him; the extra encounter after them only wins) */
            if (K.moves.length && MOVES && o.look && t < tries && !(o.move && o.move.seen) && names.length) {
              if (await f.evaluate(() => !!FIGHT.S.deploy)) { await tapAt(p, '#bohphone .fight [data-c="go"]'); await waitFor(() => f.evaluate(() => !FIGHT.S.deploy), 15000); }
              /* the demo's crew is three men: while he is watched for his move they are made five times as hard to drop (nothing else
                 of the fight changes; the win after is the fight's own), so a band of seven cannot end it before he does his thing */
              await f.evaluate(() => FIGHT.S.units.forEach(u => { if (u.side === 'you') { u.hpMax = (u.hpMax || u.hp) * 5; u.hp = u.hpMax; } }));
              await tapAt(p, '#bohphone .fight [data-c="auto"]'); await sleep(400);
              for (let i = 0; i < 4 && await f.evaluate(() => (UI.hand || 1) < Math.max.apply(null, SPEEDS)); i++) { await tapAt(p, '#bohphone .fight [data-c="speed"]'); await sleep(400); }
              const seen = (sk) => f.evaluate((q) => { const S = FIGHT.S, e = S.log.filter(x => x.t === 'skill' && x.skill === q.sk && !(x.skill === 'turn' && x.held) && !(x.skill === 'dart' && !x.hit) && ((FIGHT.byId(x.skill === 'turned' ? x.by : x.id) || {}).kind === q.id))[0];
                return e ? { skill: e.skill, round: e.round } : (S.over ? { over: true, result: S.result } : null); }, { sk, id: K.id });
              const first = await waitFor(() => seen(K.moves[0]), Number(process.env.MOVE_MS || 200000));
              if (process.env.SHOTS && first && !first.over) { await sleep(600); await p.screenshot({ path: path.join(process.env.SHOTS, K.id + '_move_' + surf + '.jpg'), quality: 72 }); }
              o.move = { first, seen: !!(first && !first.over), tries: t + 1 };
            }
            const r = await finish(f, names);
            if (r.lost) { o.lost++; if (!r.home) o.bugs.push('after a lost fight he is not home on the map'); }
            else { won = r; o.left = r.left; o.bodies = r.bodies; o.took = r.took; o.bag = r.bag; o.home = r.home; if (!r.endScreen) o.bugs.push('the end screen never came'); }
          }
          if (!o.home) o.bugs.push('not home on the map after LEAVE');
          if (K.moves.length && MOVES && !(o.move && o.move.seen)) o.bugs.push('his own move (' + K.moves[0] + ') not seen in ' + o.tries + ' fights');
          /* a beast's drop: the kill on the map, and the take */
          if (o.look && o.look.men[0] && o.look.men[0].beast) {
            /* the kill's picture is the beast's own sheet, loaded the first time the map draws it: read until it is there (10 s) */
            const kAt = Date.now(), readKill = () => fr.evaluate(() => { const s = BohemiaCarcass.state(), c = s.list[s.list.length - 1]; if (!c) return null; let pic = null; try { const bp = BohemiaJobKinds.beastPic(c.faction); pic = bp && bp.look || (bp && bp.im ? 'yes' : null); } catch (e) {} return { id: c.id, kind: c.kind, faction: c.faction, n: c.n, pic }; });
            o.kill = await readKill(); if (o.kill && !o.kill.pic) { o.kill = (await waitFor(async () => { const k = await readKill(); return k && k.pic ? k : null; }, 10000)) || o.kill; o.kill.picMs = Date.now() - kAt; }
            if (!o.kill) o.bugs.push('no kill on the map');
            else {
              o.take = await fr.evaluate((id) => { const f0 = (wagonGet() || {}).food | 0; const ok = BohemiaCarcass.take(id); const bag = JSON.parse(localStorage.getItem('bohemia.bag.v1') || '[]');
                return { ok, food: ((wagonGet() || {}).food | 0) - f0, hides: bag.filter(x => x.trade === 'hides' && x.from === 'a kill').length }; }, o.kill.id);
              if (!o.kill.pic) o.bugs.push('the kill has no picture on the map');
              if (!(o.take && o.take.ok && o.take.food > 0)) o.bugs.push('the take put no food in (' + JSON.stringify(o.take) + ')');
            }
          } else if (o.look && o.left && !o.left.items && !(o.look.men[0] && (o.look.men[0].ghost))) o.bugs.push('the end screen left nothing of his band (' + JSON.stringify(o.bodies) + ')');
        } catch (e) { if (e) o.bugs.push('THREW ' + String(e && e.message || e).slice(0, 200)); }
        o.errs = errs.slice(e0); if (o.errs.length) o.bugs.push(o.errs.length + ' page errors: ' + o.errs[0]);
        o.ms = Date.now() - t0; o.weight = await weight(); runs[K.id] = o;
        if (OUT) fs.appendFileSync(OUT, JSON.stringify(Object.assign({ surf }, o)) + '\n');
        console.error(surf + ' ' + K.id + ' ' + (o.bugs.length ? 'BUG ' + o.bugs.join(' | ') : 'ok') + ' ' + Math.round(o.ms / 1000) + 's' + (o.weight ? ' heap ' + o.weight.heapMB + ' MB docs ' + o.weight.documents : ''));
      }
      await fr.evaluate(() => { try { if (window.__GATE_DAY0 !== undefined) { DAY.day = window.__GATE_DAY0; delete window.__GATE_DAY0; } } catch (e) {} });
    } catch (e) { runs.err = String(e).slice(0, 300); }
    try { await d.close(); } catch (e) {}
  }
  console.log('RESULT ' + JSON.stringify(res));
})();
