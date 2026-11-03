#!/usr/bin/env node
/* ============================================================================
   THE FIRST THREE BOSSES GATE (BOSSES lane, 11/2/26, rule 302; ask line 287).

   PAOLO 11/2: 'Battle Brothers has unique locations and bosses with themes, I want that too... each time you kill a boss you get
   something that helps you interact with the city.' Record: records/BOHEMIA_BOSSES_ACT_ONE_THE_FIRST_THREE_11_2_26.md.
   Code: slices/bohemia_bosses.js, data records/target/bb/boss_act_one.json.

   THE STRANGER'S GAME on the live demo at phone size, through the one driver, a new game, THE POT, THE TAP and THE FILTER in the
   ladder's order. For each:
     A1 his sign is in the world and a person has posted his rumour on the phone's feed
     A2 walking to the sign marks his place; at his place his landmark is drawn on his block with his place's name
     A3 his fight stands through the one door: the man himself (his name on him, more blood, the weapon from the file), his own
        crew, his own board
     A4 the fight is won (AUTO plays it, the player's own button; if AUTO loses or stalls the checker ends it and SAYS SO)
     A5 he has fallen, his verb is his, the map shows his place changed
     A6 standing where the verb works, the phone's band shows it, a real tap on it uses it once, and it did what it says
        (COOK: blood back or nobody hurt; OPEN: batteries in the purse; PURIFY: wounds closer or nobody wounded), the block is marked
   ROUND 2 (BOSSES 11/2, rule 330, ask lines 328 and 329: 'each one has to have their own aesthetic, and maybe a quest or two that leads
   up to them... I'm so confused by what that means'; records/BOHEMIA_BOSSES_EACH_HIS_OWN_LOOK_A_LEAD_UP_A_VERB_THAT_MAKES_SENSE_11_2_26.md):
     L1 the one who lost something to him stops you on the road (a talking face, his file's words, a yes and a no); yes walks you to his sign
     L2 at his sign one of YOUR men (never YOU) reads the thing out: where he is and what he does to the valley; his place is marked
     A2 (amended) his place is PAINTED (the map's own look, slices/boss_places/), never pixel rows; on his meet card his own face and title
     A3 (amended) the man on the board wears HIS OWN look (boss.look, the people's rig), not his kind's pool
     A5b the moment he falls the one who asked comes back and says in plain words and numbers what the verb does
     A6 (amended) the phone's button is the file's one plain line, a held finger on it shows the file's tip, and the first use puts
        what it did over the block on the map and on the feed in plain words
     P1 no pixel-row landmark is left (every place and mark drawn is a painted picture) and WORLD TWO's dots stand down where a
        painted place shows the change
   ROUND 3 (BOSSES FIX 11/3, rule 338, ask line 346: 'we still don't know what killing them does... I don't like the map icons after I
   kill a boss'; records/BOHEMIA_BOSSES_WHAT_A_KILL_DOES_11_3_26.md):
     A5m the moment he falls the camera goes to his place and the change plays there (before, the tape tracking in, after), then she talks
     A5b (amended) she says ONE line for the valley and holds out the thing he hands you (his pot, wrench, filter) with one plain line, numbers
     A5f TAKE IT (a real tap) flies the thing into the phone, onto the verb button that names it
     A5i on the map after, the changed place is the mark: no skull, no door, no plate, his men not standing on it
     A6c using the verb plays the change where he stands and the number rises off his men
     BOSSES_EVERY_SECOND=<dir>: a picture a second from the win until the thing has landed (the stranger's seconds)
   C1 nothing threw
   Pictures: records/target/bosses_act_one/ (BOSSES_SHOTS=0 to skip).
   ============================================================================ */
'use strict';
const path = require('path');
const fs = require('fs');
const ROOT = path.dirname(__dirname);
const { open } = require(path.join(ROOT, 'tools', 'bohemia_drive_the_demo.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const SHOTS = process.env.BOSSES_SHOTS === '0' ? null : path.join(ROOT, 'records', 'target', 'bosses_act_one');
const NAMES = ['THE POT', 'THE TAP', 'THE FILTER'];

async function run(prof) {
  console.log('\n-- ' + prof + ' --');
  if (SHOTS) fs.mkdirSync(SHOTS, { recursive: true });
  const d = await open({ profile: prof, fog: true });
  const fr = d.fr, page = d.page, errs = [], wonBy = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  const shot = async (name) => { if (SHOTS) { try { await d.shot(path.join(SHOTS, name + '.png')); } catch (e) {} } };
  /* BOSSES_EVERY_SECOND=<dir>: the stranger's seconds after the fight, one small picture a second (the measure, rule 338) */
  const EVERY = process.env.BOSSES_EVERY_SECOND || null; let secT = null, secI = 0;
  const secStart = (tag) => { if (!EVERY) return; fs.mkdirSync(EVERY, { recursive: true }); secI = 0; if (secT) clearInterval(secT);
    secT = setInterval(() => { const k = String(secI++).padStart(2, '0'); page.screenshot({ path: path.join(EVERY, tag + '_' + k + '.jpg'), type: 'jpeg', quality: 55, scale: 'css' }).catch(() => {}); }, 1000); };
  const secStop = () => { if (secT) clearInterval(secT); secT = null; };
  const tapEl = async (h) => { const b = h && await h.boundingBox(); if (!b) return false; await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); return true; };
  for (let i = 0; i < 80; i++) { await page.waitForTimeout(500); if (await fr.evaluate(() => !!(window.__FRESH_START && window.__FRESH_START.at) && !!window.BohemiaHisMap && !!BohemiaHisMap.data() && !!window.BohemiaBosses && !!BohemiaBosses.data()).catch(() => false)) break; }
  await fr.evaluate(() => { window.__BOSSES_TALK = true; });   /* this gate answers the bosses' mouth cards (other lanes' walks never meet them) */
  /* a boss's mouth card (CONTENT's card, slices/bohemia_road_events.js): wait for the one asked for, then press a choice for real */
  const bossCard = async (kind, n, ms) => { for (let i = 0; i < ms / 400; i++) { const c = await fr.evaluate((a) => { const c = window.__BOSS_CARD, el = document.getElementById('roadcard');
      return c && el && c.kind === a[0] && c.n === a[1] ? JSON.parse(JSON.stringify(c)) : null; }, [kind, n]).catch(() => null); if (c) return c; await page.waitForTimeout(400); } return null; };
  const pressCard = async (i) => { await page.waitForTimeout(700); return tapEl(await fr.$('#roadcard button[data-road="' + i + '"]')); };
  /* the start: the closest town's screen; he leaves it with a real tap on LEAVE */
  for (let i = 0; i < 80; i++) { const t = await fr.evaluate(() => ({ on: !!(window.__START_IN_TOWN), opened: !!(window.__START_IN_TOWN && window.__START_IN_TOWN.opened) })).catch(() => ({})); if (t.opened || (i > 12 && !t.on)) break; await page.waitForTimeout(500); }
  /* a town's screen is up when the map's settleFrame shows (the phone's own test); he leaves with a real tap on the phone's LEAVE */
  const inTown = () => fr.evaluate(() => { const sf = document.getElementById('settleFrame'); return !!sf && sf.style.display === 'block'; }).catch(() => false);
  const leaveTown = async () => {
    for (let k = 0; k < 3 && await inTown(); k++) {
      await page.waitForTimeout(900);
      if (!await tapEl(await page.$('#bohphone .bpctx.town .lv'))) { const sfr = page.frames().find(f => /SETTLEMENT/.test(f.url())); if (sfr) await tapEl(await sfr.$('#leave')); }
      await page.waitForTimeout(1300);
    }
  };
  await leaveTown();
  /* any other party's card on the way is fallen back from (a road party is not this gate's fight); his own card is his */
  const guard = setInterval(() => { fr.evaluate(() => { try { if (MEET.up && !/^boss:/.test((MEET.up.msg && MEET.up.msg.why) || '') && window.MEET_DONE) MEET_DONE(false); } catch (e) {} }).catch(() => {}); }, 400);
  const st = () => fr.evaluate(() => { const H = BohemiaHisMap.state(), B = BohemiaBosses.state(); return JSON.parse(JSON.stringify({ at: [city.x, city.y], boss: H.boss, verbs: B.verbs, marks: B.marks, rumours: B.rumours, drew: BohemiaBosses.last().drew })); });
  const settle = async () => { for (let i = 0; i < 160; i++) { await page.waitForTimeout(500); await leaveTown(); if (await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length || !!document.getElementById('roadcard')).catch(() => false)) break; } await page.waitForTimeout(800); };
  const go = (c) => fr.evaluate((c) => { if (TRAVEL_SPEED === 0) travelSpeedSet(TRAVEL_SPEED_LAST || 1); try { travelSpeedSet(4); } catch (e) {} const r = travelTo(0, 0, c); try { travelGoes(); } catch (e) {} return !!r; }, c);

  for (let bi = 0; bi < NAMES.length; bi++) {
    const n = NAMES[bi], tag = (bi + 1) + '_' + n.replace(/^THE /, '').toLowerCase();
    console.log('  .. ' + n);
    /* A1: the sign and the rumour */
    let s = null;
    for (let i = 0; i < 40; i++) { await page.waitForTimeout(500); s = await st(); if (s.boss.sign && s.boss.sign.n === n && s.rumours[n]) break; if (s.boss.found[n]) break; }
    const row = await fr.evaluate((n) => { const r = BohemiaBosses.data().bosses.filter(b => b.n === n)[0]; return JSON.parse(JSON.stringify(r)); }, n);
    ok('A1 ' + n + ': his sign is in the world and his rumour is on the phone\'s feed', !!(s.boss.sign && s.boss.sign.n === n || s.boss.found[n]) && !!s.rumours[n],
       (s.boss.sign ? s.boss.sign.kind + ' at ' + s.boss.sign.x + ',' + s.boss.sign.y : 'no sign') + ', rumour by ' + row.rumour.who);
    /* L1: the one who lost something to him asks for help (never in the first minute); yes walks him to the sign */
    if (!s.boss.found[n]) {
      const ak = await bossCard('asker', n, 110000), A = row.lead.asker;
      ok('L1 ' + n + ': ' + A.name + ' stops you and asks for help, a talking face, a yes and a no', !!ak && ak.name === A.name && ak.text === A.says && ak.look === A.look && ak.opts.length === 2,
         ak ? ak.name + ' (' + ak.look + '): "' + ak.text.slice(0, 90) + '..." [' + ak.opts.join(' | ') + ']' : 'no card in 110 s');
      if (ak) { await shot(tag + '_0_who_asks'); await pressCard(0); const ay = await bossCard('asker_yes', n, 6000); if (ay) await pressCard(0); await page.waitForTimeout(600); }
    }
    s = await st();
    /* A2: walk to the sign; his place is marked; walk to his place */
    if (s.boss.sign && s.boss.sign.n === n) { await go([s.boss.sign.x, s.boss.sign.y]); await settle(); }
    s = await st(); const f = s.boss.found[n];
    if (!f) { ok('A2 ' + n + ': his place is marked', false, 'the sign was not read; he is at ' + s.at.join(',')); break; }
    /* L2: one of his own men reads the thing out */
    const th = await bossCard('thing', n, 12000);
    ok('L2 ' + n + ': at ' + row.lead.thing.head + ' one of yours reads it out: where he is and what he does', !!th && th.text === row.lead.thing.says && th.name !== 'YOU' && th.head === row.lead.thing.head,
       th ? th.name + ' (' + th.look + '), ' + th.head + ': "' + th.text.slice(0, 100) + '..."' : 'no card');
    if (th) { await shot(tag + '_0b_the_clue'); await pressCard(0); await page.waitForTimeout(600); }
    await go([f.x, f.y]);
    let meet = false;
    for (let i = 0; i < 240 && !meet; i++) { await page.waitForTimeout(500); await leaveTown(); meet = await fr.evaluate((n) => { try { return !!(MEET.up && MEET.up.msg && MEET.up.msg.why === 'boss:' + n); } catch (e) { return false; } }, n).catch(() => false);
      if (!meet && i % 20 === 19 && await fr.evaluate(() => !TRAVEL || TRAVEL.i >= TRAVEL.path.length)) await go([f.x, f.y]); }
    await fr.evaluate(() => render()); await page.waitForTimeout(300);
    s = await st(); const pl = (s.drew.places || []).filter(p => p.n === n)[0];
    const town2 = await inTown();
    ok('A2 ' + n + ': at his place his place stands PAINTED on his block, named ' + row.place.name + ', the map on the glass', meet && !!pl && pl.known && !pl.down && pl.painted && pl.key === row.place.paint + '_before' && !town2, meet ? JSON.stringify(pl) + (town2 ? ' A TOWN SCREEN IS OVER THE MAP' : '') : 'no card at his place; he is at ' + s.at.join(','));
    await page.waitForTimeout(1500);
    const mc = await fr.evaluate(() => { const d = document.querySelector('#meetcard .mcboss'); return d ? { look: d.dataset.look, face: (BohemiaBosses.last().cardFace || null), text: d.textContent } : null; }).catch(() => null);
    /* ENGAGE stands clear of the phone (11/2: a taller card once pushed it under the phone, and the tap hit the phone) */
    const clear = await page.evaluate(() => { const ph = document.getElementById('bohphone'); const fe = document.querySelector('iframe'); return ph ? JSON.parse(JSON.stringify(ph.getBoundingClientRect())) : null; }).catch(() => null);
    const eb = await (await fr.$('#meetcard button[data-meet="go"]'))?.boundingBox();
    const under = !!(clear && eb && eb.x + eb.width > clear.left && eb.y + eb.height > clear.top && eb.x < clear.right && eb.y < clear.bottom);
    ok('A2b ' + n + ': his meet card shows his own face, talking, his title and his tip; ENGAGE is clear of the phone', !!mc && mc.look === row.boss.look && mc.face === row.boss.look && mc.text.indexOf(row.tip) >= 0 && !under,
       JSON.stringify(mc) + ', ENGAGE ' + (eb ? Math.round(eb.y) + '-' + Math.round(eb.y + eb.height) : 'none') + ', phone top ' + (clear ? Math.round(clear.top) : 'none') + (under ? ' UNDER THE PHONE' : ''));
    await shot(tag + '_a_his_place_and_his_card');
    /* A3: ENGAGE (a real tap), the fight stands with the man himself */
    if (meet) await tapEl(await fr.$('#meetcard button[data-meet="go"]') || await fr.$('button[data-meet="go"]'));
    let ff = null;
    for (let i = 0; i < 120 && !ff; i++) { await page.waitForTimeout(500); const h = await page.$('#fightFrame');
      if (h) { const x = await h.contentFrame(); if (x && await x.evaluate(() => typeof FIGHT !== 'undefined' && !!FIGHT.S && !!FIGHT.S.board && FIGHT.S.units.length > 0).catch(() => false)) ff = x; } }
    const fs3 = ff ? await ff.evaluate(() => ({ boss: FIGHT.S.boss || null, err: FIGHT.S.bossErr || null, kind: (window.FIGHT_OPTS || {}).kind, kinds: (FIGHT.S.boardDef && FIGHT.S.boardDef.kinds) || [],
      them: FIGHT.S.units.filter(u => u.side === 'them').map(u => ({ kind: u.kind, name: u.name, hp: u.hpMax, boss: !!u.boss, look: u.look || null, w: u.weapon && u.weapon.name })) })) : null;
    const crewOk = fs3 && row.crew.every(k => fs3.them.filter(u => u.kind === k && !u.boss).length >= row.crew.filter(c => c === k).length);
    /* his board: the fight is asked for his board's kind; since COMBAT MAPS (11/2, rule 325, a2bea2cf) the place's own district deals
       the blocks, so THE TAP's works deal 'lots/works', not a block named 'landfill': the kind asked, or a block of it, is his board */
    ok('A3 ' + n + ': his fight stands: the man himself, his crew, his board', !!fs3 && !!fs3.boss && fs3.boss.name === row.boss.name && crewOk && (fs3.kind === row.board || fs3.kinds.indexOf(row.board) >= 0),
       fs3 ? 'boss ' + JSON.stringify(fs3.boss && { name: fs3.boss.name, hp: fs3.boss.hp, weapon: fs3.boss.weapon, shield: fs3.boss.shield }) + ', crew ' + fs3.them.filter(u => !u.boss).map(u => u.kind).join(' ') + ', board ' + fs3.kind + ' (' + fs3.kinds.join('/') + ')' + (fs3.err ? ' ERR ' + fs3.err : '') : 'no fight');
    const him = fs3 && fs3.them.filter(u => u.boss)[0];
    ok('A3b ' + n + ': the man on the board wears HIS OWN look (' + row.boss.look + '), not his kind\'s', !!him && him.look === row.boss.look, him ? him.name + ' wears ' + him.look : 'no boss on the board');
    if (ff) { await page.waitForTimeout(1500); await shot(tag + '_b_his_fight'); }
    /* A4: AUTO plays it (a real tap on the fight's own AUTO); if it loses or stalls, the checker ends it and says so */
    let res = null;
    if (ff) {
      await tapEl(await ff.$('#bauto'));
      for (let i = 0; i < 360 && !res; i++) { await page.waitForTimeout(500); res = await ff.evaluate(() => FIGHT.S.over ? FIGHT.S.result : null).catch(() => null);
        if (!res && i % 30 === 29) await ff.evaluate(() => { try { if (!UI.auto) document.getElementById('bauto').click(); } catch (e) {} }).catch(() => {}); }
      let by = 'AUTO';
      if (res !== 'won') { by = 'THE CHECKER (AUTO ' + (res || 'did not finish in 3 min') + ')';
        await ff.evaluate(() => { FIGHT.S.units.forEach(u => { if (u.side === 'them') u.dead = true; }); FIGHT.S.over = true; FIGHT.S.result = 'won'; showOver('won'); }).catch(() => {}); }
      wonBy.push(n + ': ' + by);
      secStart(tag);   /* BOSSES_EVERY_SECOND: a picture every second from here until he is back on the map and told */
      await page.waitForTimeout(1200); await shot(tag + '_c_won');
      for (let i = 0; i < 40; i++) { await page.waitForTimeout(500); if (await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) break; }
      await page.waitForTimeout(800);
      /* LEAVE on the spoils screen, a real tap (the stranger's way), else the checker's door */
      let left = false; try { const sf = page.frames().find(f => /SPOILS_SCREEN/.test(f.url())); if (sf) { await page.waitForTimeout(1200); left = await tapEl(await sf.$('#leave')); } } catch (e) {}
      await page.waitForTimeout(600);
      if (!left || await page.evaluate(() => !!(window.SPOILS && SPOILS.frame))) await page.evaluate(() => { try { spoilsLeave(); } catch (e) {} });
      for (let i = 0; i < 60; i++) { await page.waitForTimeout(500); const q = await st(); if (q.boss.fallen[n]) break; }
      await page.waitForTimeout(1500);
    }
    ok('A4 ' + n + ': the fight is won', !!ff, wonBy[wonBy.length - 1] || 'no fight');
    /* A5: he has fallen, the verb is his, his place changed */
    await fr.evaluate(() => render()); await page.waitForTimeout(300);
    s = await st(); const pl2 = (s.drew.places || []).filter(p => p.n === n)[0], vid = row.verb.id;
    ok('A5 ' + n + ': he has fallen, ' + row.verb.word + ' is yours, and his place is changed on the map', !!s.boss.fallen[n] && !!s.verbs[vid] && !!pl2 && pl2.down,
       'fallen ' + !!s.boss.fallen[n] + ' (' + ((s.boss.fallen[n] || {}).did || []).join(', ') + '), verb ' + JSON.stringify(s.verbs[vid]) + ', drawn ' + JSON.stringify(pl2));
    /* A5m (BOSSES FIX 11/3, rule 338: 'we still don't know what killing them does'): the moment he falls the camera goes to his place
       and the change plays there (BEFORE, the tape tracking in, AFTER), over his men, BEFORE anybody talks */
    const af = await bossCard('after', n, 30000);
    const bt = await fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_BEAT || null))).catch(() => null);
    const off = bt && bt.mid && bt.focus ? Math.max(Math.abs(bt.mid[0] - bt.focus[0]), Math.abs(bt.mid[1] - bt.focus[1])) : null;
    const cw = await fr.evaluate(() => CVW).catch(() => 390);
    ok('A5m ' + n + ': the moment he falls the camera goes to his place and the change plays there (before, the tape, after), then she talks', !!bt && bt.n === n && ['glide', 'hold', 'wipe', 'show'].every(p => bt.phases.indexOf(p) >= 0) && !!bt.done && !!af && af.at >= bt.done - 50 && off != null && off < cw * 0.2 && bt.rect.cssW >= 80,
       bt ? 'phases ' + bt.phases.join('>') + ', ' + (bt.done - bt.started) + ' ms, his place ' + bt.rect.cssW + ' points wide, ' + off + ' px from the open middle (' + cw + ' wide), zoom ' + (bt.cam ? bt.cam.z0.toFixed(2) + '>' + bt.cam.z1.toFixed(2) : 'none') + ', card ' + (af ? (af.at - bt.done) + ' ms after' : 'none') : 'no beat');
    /* A5b: the one who asked says ONE line for the valley, and holds out the thing he hands you with its one plain line, numbers in it */
    ok('A5b ' + n + ': ' + row.after.name + ' says one line for the valley and hands you ' + row.verb.hand.name + ' with one plain line', !!af && af.name === row.after.name && af.text === row.after.valley && !!af.hand && af.hand.name === row.verb.hand.name && af.hand.line === row.verb.hand.line && /\d/.test(af.hand.line),
       af ? af.name + ': "' + af.text + '" + ' + (af.hand ? af.hand.name + ': "' + af.hand.line + '"' : 'NO THING') : 'no card');
    if (af) { await page.waitForTimeout(600); await shot(tag + '_d2_what_it_does'); await pressCard(0); }
    /* A5f: TAKE IT flies the thing into the phone, onto the button that names it */
    let fl = null; for (let i = 0; i < 20 && !(fl && fl.landed); i++) { await page.waitForTimeout(250); fl = await fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_FLEW || null))).catch(() => null); if (fl && fl.n !== n) fl = null; }
    ok('A5f ' + n + ': TAKE IT flies ' + row.verb.hand.name + ' into the phone, onto the button that says ' + row.verb.button, !!fl && fl.kind === 'verb' && !!fl.landed && fl.button === row.verb.button,
       fl ? fl.kind + ' ' + JSON.stringify(fl.from) + ' > ' + JSON.stringify(fl.to) + ', landed ' + !!fl.landed + ', the button "' + fl.button + '"' : 'no flight');
    await page.waitForTimeout(1200);
    if (EVERY) await page.waitForTimeout(1300); secStop();
    /* A5i: the map after: the changed place is the mark (no skull, no door, no plate on it), beside his men, never under them */
    await fr.evaluate(() => render()); await page.waitForTimeout(300);
    const mi = await fr.evaluate((n) => { const hm = ((BohemiaHisMap.last().drew || {}).boss || []).filter(b => b.n === n)[0] || null, P = (BohemiaHisMap.state().places || []).filter(p => p.n === n);
      const me = BohemiaBosses.last().drew; return JSON.parse(JSON.stringify({ hm, hmPlaces: (BohemiaHisMap.last().drew || {}).places || 0, placeRows: P.length, ours: (me.places || []).filter(p => p.n === n)[0] || null, plates: me.plates, party: [city.x, city.y] })); }, n);
    ok('A5i ' + n + ': on the map after, his changed place is the mark: no skull, no door, no plate, and his men do not stand on it', !!mi.ours && mi.ours.down && /_after$/.test(mi.ours.key) && (!mi.hm || mi.hm.quiet) && mi.plates === 0 && !(mi.ours.at[0] === mi.party[0] && mi.ours.at[1] === mi.party[1]),
       'place ' + (mi.ours ? mi.ours.key + ' at ' + mi.ours.at.join(',') + ' (' + mi.ours.w + ' px, named ' + mi.ours.named + ')' : 'not drawn') + ', his men at ' + mi.party.join(',') + ', the old skull ' + (mi.hm ? (mi.hm.quiet ? 'stood down' : 'DRAWN') : 'off the glass') + ', plates ' + mi.plates + ', door+plate drawn ' + mi.hmPlaces);
    await shot(tag + '_d_his_place_after');
    await fr.evaluate(() => { window.__BOSSES_TALK = false; });   /* the next boss's asker waits until this verb is walked and used */
    /* A6: where the verb works, the phone shows it; a real tap uses it */
    const spot = await fr.evaluate((vid) => { const h = [city.x, city.y]; if (BohemiaBosses.applies(vid, h[0], h[1])) return h;
      let best = null, bd = 1e9; const n = om.n; for (let y = 1; y < n - 1; y++) for (let x = 1; x < n - 1; x++) { const a = BohemiaBosses.applies(vid, x, y); if (!a || a.off) continue;
        const dd = Math.max(Math.abs(x - h[0]), Math.abs(y - h[1])); if (dd < bd && !loopTownAt(x, y, 1) && cityRoute(h[0], h[1], x, y)) { bd = dd; best = [x, y]; } } return best; }, vid);
    if (spot && (spot[0] !== s.at[0] || spot[1] !== s.at[1])) { await go(spot); await settle(); }
    const before = await fr.evaluate(() => { const C = BohemiaCondition.get(); let hp = 0, w = 0; for (const k in C.men) { hp += C.men[k].lostHp || 0; if (C.men[k].wound && C.men[k].wound.left > 0) w += C.men[k].wound.left; }
      let bat = null; try { bat = BohemiaPurse.balance(purseGet(), 'electricity'); } catch (e) {} return { hp, w, bat, marks: BohemiaBosses.state().marks.length }; });
    let band = null;
    for (let i = 0; i < 20; i++) { await page.waitForTimeout(300); band = await page.evaluate(() => { const b = document.querySelector('#bohphone .bpctx.verb .vb'); if (!b) return null; const r = b.getBoundingClientRect();
      return { text: b.textContent, verb: b.dataset.verb, off: b.classList.contains('off'), w: Math.round(r.width), h: Math.round(r.height) }; }); if (band && band.verb === vid) break; }
    /* a block where two of his verbs work shows the first (a main beside the water: OPEN, then PURIFY the main he opened) */
    let first = null;
    if (band && band.verb && band.verb !== vid && !band.off) { first = band.verb; await tapEl(await page.$('#bohphone .bpctx.verb .vb')); await page.waitForTimeout(1200);
      before.marks += 1;
      for (let i = 0; i < 20; i++) { await page.waitForTimeout(300); band = await page.evaluate(() => { const b = document.querySelector('#bohphone .bpctx.verb .vb'); if (!b) return null;
        const r = b.getBoundingClientRect(); return { text: b.textContent, verb: b.dataset.verb, off: b.classList.contains('off'), w: Math.round(r.width), h: Math.round(r.height) }; }); if (band && band.verb === vid) break; } }
    await shot(tag + '_e_the_verb_on_the_phone');
    /* a held finger on it: the plain line */
    let tip = null; const vbh = await page.$('#bohphone .bpctx.verb .vb'), vbb = vbh && await vbh.boundingBox();
    if (vbb) { await page.mouse.move(vbb.x + vbb.width / 2, vbb.y + vbb.height / 2); await page.mouse.down(); await page.waitForTimeout(800);
      tip = await page.evaluate(() => { const d = document.getElementById('bohverbtip'); return d ? { text: d.textContent, tip: (window.__VERB_TIP || {}).tip } : null; }); await shot(tag + '_e2_held_finger'); await page.mouse.up(); await page.waitForTimeout(300); }
    ok('A6a ' + n + ': the button says ' + row.verb.button + ' and a held finger says what it does', !!band && band.text === row.verb.button && !!tip && tip.tip === row.verb.tip,
       'button "' + (band && band.text) + '", held: ' + JSON.stringify(tip));
    if (band && band.verb === vid && !band.off) await tapEl(await page.$('#bohphone .bpctx.verb .vb'));
    await page.waitForTimeout(1200);
    const after = await fr.evaluate(() => { const C = BohemiaCondition.get(); let hp = 0, w = 0; for (const k in C.men) { hp += C.men[k].lostHp || 0; if (C.men[k].wound && C.men[k].wound.left > 0) w += C.men[k].wound.left; }
      let bat = null; try { bat = BohemiaPurse.balance(purseGet(), 'electricity'); } catch (e) {} const u = (window.__BOSS_VERB_USED || []).slice(-1)[0]; return { hp, w, bat, marks: BohemiaBosses.state().marks.length, used: u ? JSON.parse(JSON.stringify(u)) : null }; });
    const did = vid === 'cook' ? (before.hp > 0 ? after.hp < before.hp : true) : vid === 'open' ? (after.bat != null && before.bat != null && after.bat - before.bat === row.verb.pay_batteries) : (before.w > 0 ? after.w < before.w : true);
    ok('A6 ' + n + ': the phone shows ' + row.verb.button + ' where it works, a real tap uses it once, and it did what it says', !!band && band.verb === vid && after.marks === before.marks + 1 && !!after.used && after.used.id === vid && did,
       (first ? first.toUpperCase() + ' first, then ' : '') + 'band ' + JSON.stringify(band) + ' at ' + JSON.stringify(spot) + '; blood lost ' + Math.round(before.hp) + ' -> ' + Math.round(after.hp) + ', wound days ' + before.w.toFixed(1) + ' -> ' + after.w.toFixed(1) + ', batteries ' + before.bat + ' -> ' + after.bat + ', got ' + JSON.stringify(after.used && after.used.got));
    await fr.evaluate(() => render()); await page.waitForTimeout(400);
    const fu = await fr.evaluate(() => { const m = BohemiaBosses.state().marks.slice(-1)[0], P = (BOHEMIA_FEED.posts ? BOHEMIA_FEED.posts() : []).filter(p => p.who === '@yourcompany').slice(-1)[0];
      return { plate: m && m.first, feed: P ? (P.txt || P.text || '') : null, drew: BohemiaBosses.last().drew }; });
    ok('A6b ' + n + ': the first use says what it did over the block on the map and on the feed, in plain words', !!fu.plate && !!fu.feed && [row.verb.first.feed, row.verb.first.feed_none].filter(Boolean).some(t => fu.feed.indexOf(t.split('{')[0].trim()) === 0),
       'map: "' + fu.plate + '", feed: "' + fu.feed + '"');
    /* A6c (rule 338): the use plays where he stands (the fire lit, the main running, the drum filled) and the number rises off his men */
    const ub = await fr.evaluate(() => JSON.parse(JSON.stringify(window.__BOSS_USE_BEAT || null))).catch(() => null);
    const riseOk = !!ub && ub.id === vid && (/\d/.test(ub.rise) || ub.rise === row.verb.first.rise_none);
    ok('A6c ' + n + ': using it plays the change where he stands and the number rises off his men', riseOk && !!ub.drawn && !!ub.drawn.mark && !!after.used && ub.at[0] === after.used.x && ub.at[1] === after.used.y,
       ub ? ub.id + ' at ' + ub.at.join(',') + ': "' + ub.rise + '", drawn ' + JSON.stringify(ub.drawn) : 'no use beat');
    /* P1: nothing on the map from this lane is pixel rows; WORLD TWO's lights stand down where his place is painted */
    const p1 = await fr.evaluate((n) => ({ src: !/var ART = \{/.test(String(BohemiaBosses.draw)) , places: BohemiaBosses.last().drew.places.map(p => p.painted), paints: BohemiaBosses.paints(n) }), n);
    ok('P1 ' + n + ': no pixel-row landmark: every place and mark is a painted picture, and the lights\' dots stand down here', p1.src && p1.places.length > 0 && p1.places.every(Boolean) && p1.paints, JSON.stringify(p1));
    await shot(tag + '_f_the_verb_used');
    await fr.evaluate(() => { window.__BOSSES_TALK = true; });
  }
  clearInterval(guard);
  console.log('  won by: ' + wonBy.join(' | '));
  ok('C1 ' + prof + ': nothing threw', errs.length === 0 && d.errs.length === 0, errs.concat(d.errs).slice(0, 3).join(' | '));
  await d.close().catch(() => {});
}

(async () => {
  const want = process.argv[2];
  const profiles = want ? [want] : ['phone_portrait'];
  for (const p of profiles) { try { await run(p); } catch (e) { ok('the gate ran on ' + p, false, String(e.stack || e.message).slice(0, 300)); } }
  console.log('\nTHE FIRST THREE BOSSES: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
