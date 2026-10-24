#!/usr/bin/env node
/* THE LOSS IS UNDERSTOOD (COMBAT [the loss is understood], rule 143(b)(d)(e), Paolo 10/24: 'when everyone dies in a match it's
   kind of hard to understand... an enemy just kept dodging all of my bullets... people died but they were still speaking... if
   everyone dies you're still where you were before the battle, it feels clunky').

   Legs, on his phone's profile (390 x 844), the real fight page, slices/BOHEMIA_FIGHT.html:
   1. THE DOWN DO NOT TALK: his veteran says a line; the moment he is down the line is gone, and no line starts from a man
      off the field;
   2. THE BETTER ENEMY READS: a marauder against a new crew reads LV n over theirs and OUTCLASSES YOU, on the plate (#cls) the
      moment the bar shows him, and first on the aim receipt; a thug against the same crew does not;
   3. HIS LEVEL IS BATTLE BROTHERS' WORTH: LV = 1 + (xp - 100) / 30 off his own row, the brother formula run backwards;
   4. A DODGE SHOWS AS A DODGE: a missed blow throws the man aside on the board and the tag says DODGED;
   5. THE WIPE IS AN EVENT: a fight lost with YOU down plays the wipe's beat (YOUR WHOLE CREW IS DOWN, what happened, what comes
      next), then the recap says WIPED OUT with the same words; the home message carries wipe:true and the end message is
      BOHEMIA_COMBAT_END {newFight, wipe:true, wipeInfo} with who keeps the field and who of his is down and dead;
   6. A RETREAT IS NEVER A WIPE (rule 144(c)): a loss where YOU ran is not a wipe;
   and in the files:
   7. THE SHELL HOLDS IT: the alpha and the cut demo carry COMBAT's __THE_WIPE_RIDES_HOME__ guard at the top of combatMsgIn's
      BOHEMIA_COMBAT_END branch (the rebuilt fight's end never takes him home itself; the wipe rides NF.over into
      cityFightHome's outcome).
   Run: node gates/the_loss_is_understood_gate.js */
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '..');
let pass = 0, fail = 0;
const leg = (ok, what, why) => { if (ok) pass++; else fail++; console.log((ok ? '  ok   ' : '  FAIL ') + what + (why !== undefined ? '  [' + why + ']' : '')); };
const done = () => { console.log('=== THE LOSS IS UNDERSTOOD GATE: ' + pass + ' passed, ' + fail + ' failed ==='); process.exit(fail ? 1 : 0); };

/* 7 first: the files */
const OPEN = '__THE_WIPE_RIDES_HOME__';
['slices/BOHEMIA_ALPHA_0_9.html', 'slices/BOHEMIA_DEMO.html'].forEach(f => {
  const s = fs.readFileSync(path.join(ROOT, f), 'utf8'), i = s.indexOf("if(d.type==='BOHEMIA_COMBAT_END'){"), g = s.indexOf(OPEN, i);
  const guard = g > i && g - i < 400 && /if\(d\.newFight\)\{[\s\S]{0,300}NF\.over\.wipe=!!d\.wipe;[\s\S]{0,200}return true; \}/.test(s.slice(g, g + 1200));
  leg(guard, (f.indexOf('DEMO') >= 0 ? '' : '*** THE SHELL HOLDS IT ***: ') + f + ' carries the guard first in the COMBAT_END branch', guard ? 'at +' + (g - i) : 'missing');
});

(async () => {
  const { open } = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const run = async (opts, fn) => {
    const d = await open({ file: 'BOHEMIA_FIGHT.html', bare: true, arm: 'window.FIGHT_OPTS=' + JSON.stringify(opts) });
    const p = d.page, errs = []; p.on('pageerror', e => errs.push(String(e)));
    try { await p.waitForFunction(() => typeof FIGHT_UI !== 'undefined' && FIGHT_UI.board && FIGHT.S.round && performance.now() > FIGHT_UI.openUntil, null, { timeout: 40000 });
      const r = await fn(p, d); r.errs = errs; return r; } finally { await d.close(); }
  };
  const NEW = JSON.parse(fs.readFileSync(path.join(ROOT, 'records/target/bb/origins.json'), 'utf8')).origins.filter(o => o.id === 'newcrew')[0];
  const crew = NEW.men.map((m, i) => ({ background: m.background, level: m.level, main: i === 0, name: i === 0 ? 'YOU' : undefined }));

  /* 1, 2, 3, 4 on one board: a new crew against a thug and a marauder */
  const a = await run({ kind: 'suburb', deploy: false, teach: true, company: crew, band: ['brigand_thug', 'brigand_marauder'] }, async (p) => {
    const out = {};
    /* 1: a line up, its speaker falls */
    out.talk = await p.evaluate(async () => {
      try { localStorage.removeItem('bohemia.fight.taught'); } catch (_e) {} FIGHT_UI.taughtMem = null; FIGHT_UI.vet = null;
      FIGHT_UI.t0 = performance.now() - 5000; FIGHT_UI.openUntil = 0;
      const ok = teach('cover'), v = FIGHT.byId(FIGHT_UI.vet && FIGHT_UI.vet.who);
      const up = document.getElementById('vet').style.display;
      if (v) { v.down = true; }
      await new Promise(r => setTimeout(r, 400));
      const after = document.getElementById('vet').style.display, gone = !FIGHT_UI.vet;
      /* nobody off the field starts one: every man of his down but YOU */
      FIGHT.S.units.forEach(u => { if (u.side === 'you' && !u.main) u.down = true; });
      FIGHT_UI.taughtMem = {}; const again = teach('aim');
      FIGHT.S.units.forEach(u => { if (u.side === 'you') u.down = false; });
      return { ok, who: v && v.name, up, after, gone, again };
    });
    /* 2, 3 */
    out.cls = await p.evaluate(() => {
      const them = FIGHT.S.units.filter(v => v.side === 'them'), mar = them.filter(v => v.kind === 'brigand_marauder')[0], thug = them.filter(v => v.kind === 'brigand_thug')[0];
      const X = R('parsed.brother_xp');
      const lvRight = them.every(v => lvOf(v) === Math.max(1, Math.round(1 + (v.xp - X.base) / X.per_level)));
      FIGHT_UI.pend = { target: mar }; hud();
      const plate = document.getElementById('cls').textContent, shown = document.getElementById('cls').style.display;
      const u = FIGHT.S.units.filter(v => v.side === 'you' && v.main)[0], aim = aimLines(u, mar)[0];
      FIGHT_UI.pend = { target: thug }; hud();
      const plateThug = document.getElementById('cls').textContent;
      FIGHT_UI.pend = null; hud();
      return { mar: classOf(mar), thug: classOf(thug), lvRight, plate, shown, aim, plateThug, marLv: lvOf(mar), marXp: mar.xp };
    });
    /* 4: a missed blow on the thug, through the board's own animation */
    out.dodge = await p.evaluate(async () => {
      const u = FIGHT.S.units.filter(v => v.side === 'you' && v.main)[0], t = FIGHT.S.units.filter(v => v.side === 'them')[0];
      const h = manH(), x0 = dodgeLean(t, h, performance.now());
      startAnim({ k: 'attack', dur: beatMs(), e: { t: 'attack', id: u.id, to: t.id, hit: false, chance: 40, hp: 0, armour: 0, shot: false } });
      await new Promise(r => setTimeout(r, beatMs() * 0.45 + beatMs() * 0.25 + 30));
      const mid = dodgeLean(t, h, performance.now());
      await new Promise(r => setTimeout(r, beatMs() * 0.4));
      return { x0, mid, tag: document.getElementById('num').textContent, h };
    });
    return out;
  });
  leg(a.talk.ok && a.talk.up === 'flex' && a.talk.after === 'none' && a.talk.gone && !a.talk.again,
    '*** THE DOWN DO NOT TALK ***: his veteran\'s line goes the moment he is down, and nobody off the field starts one', JSON.stringify(a.talk));
  leg(a.cls.mar.outclass && !a.cls.thug.outclass, '*** THE BETTER ENEMY READS ***: a marauder outclasses a new crew, a thug does not',
    'marauder LV ' + a.cls.mar.lv + ' gap ' + a.cls.mar.gap + ' blows ' + a.cls.mar.blows + ', thug LV ' + a.cls.thug.lv + ' gap ' + a.cls.thug.gap);
  leg(a.cls.shown === 'block' && /^OUTCLASSES YOU · LV \d+/.test(a.cls.plate) && /^LV \d+/.test(a.cls.plateThug),
    '  the plate says it the moment the bar shows him', a.cls.plate + ' | thug: ' + a.cls.plateThug);
  leg(/outclasses you/.test(a.cls.aim), '  and the aim receipt says it first', a.cls.aim.replace(/<[^>]+>/g, ''));
  leg(a.cls.lvRight, '  HIS LEVEL IS BATTLE BROTHERS\' WORTH: LV = 1 + (xp - 100) / 30 off his own row', 'marauder xp ' + a.cls.marXp + ' -> LV ' + a.cls.marLv);
  leg(a.dodge.x0 === 0 && Math.abs(a.dodge.mid) > a.dodge.h * .1 && a.dodge.tag === 'DODGED',
    '*** A DODGE SHOWS AS A DODGE ***: the missed man is thrown aside on the board and the tag says DODGED', JSON.stringify(a.dodge));
  leg(!a.errs.length, '  the page threw nothing', a.errs.join(' | '));

  /* 5: two green men against three marauders and a leader, on AUTO, to the end */
  const b = await run({ kind: 'suburb', deploy: false, company: [{ background: 'refugee', level: 1, main: true, name: 'YOU' }, { background: 'refugee', level: 1, name: 'DESI' }],
    band: ['brigand_marauder', 'brigand_marauder', 'brigand_leader'] }, async (p) => {
    await p.evaluate(() => { FIGHT_UI.auto = true; hud(); });
    let wipe = null, over = null;
    for (let i = 0; i < 400 && !over; i++) {
      const st = await p.evaluate(() => ({ w: document.getElementById('wipe').style.display, o: document.getElementById('over').style.display, wh: document.getElementById('wh').textContent,
        on: Array.from(document.querySelectorAll('#wb p.on')).length, lines: Array.from(document.querySelectorAll('#wb p')).map(q => q.textContent), grey: document.body.classList.contains('wiped') }));
      if (st.w === 'flex' && (!wipe || st.on > wipe.on)) wipe = st;
      if (st.o === 'flex') over = await p.evaluate(() => ({ oh: document.getElementById('oh').textContent, ob: document.getElementById('ob').textContent, home: homeMessage(FIGHT.S.result), end: FIGHT_UI.wipe ? endMessage() : null }));
      await p.waitForTimeout(250);
    }
    return { wipe, over };
  });
  const W = b.wipe, O = b.over;
  leg(!!W && W.wh === 'YOUR WHOLE CREW IS DOWN' && W.grey && W.lines.length >= 3 && W.on >= W.lines.length - 1 && /keep the field/.test(W.lines[0]) && /nearest town/.test(W.lines[W.lines.length - 1]),
    '*** THE WIPE IS AN EVENT ***: the board drains, YOUR WHOLE CREW IS DOWN, what happened a line a beat, what comes next last', W ? W.lines.join(' / ') : 'no wipe beat');
  leg(!!O && O.oh === 'WIPED OUT' && /nearest town/.test(O.ob), '  the recap says WIPED OUT with the same words', O ? O.oh : 'no recap');
  leg(!!O && O.home.type === 'BOHEMIA_FIGHT_OVER' && O.home.wipe === true && O.home.result === 'lost', '  home: BOHEMIA_FIGHT_OVER carries wipe:true', O && JSON.stringify({ wipe: O.home.wipe, result: O.home.result }));
  const E = O && O.end;
  leg(!!E && E.type === 'BOHEMIA_COMBAT_END' && E.newFight && E.wipe === true && E.victory === false && E.wipeInfo && E.wipeInfo.byName && E.wipeInfo.down.indexOf('YOU') >= 0 && Array.isArray(E.fates),
    '  and BOHEMIA_COMBAT_END {newFight, wipe:true, wipeInfo} for RUN\'s nearest town', E && JSON.stringify({ by: E.wipeInfo.by, down: E.wipeInfo.down, dead: E.wipeInfo.dead, standout: E.wipeInfo.standout && E.wipeInfo.standout.name }));
  leg(!b.errs.length, '  the page threw nothing', b.errs.join(' | '));

  /* 6: a retreat is never a wipe */
  const c = await run({ kind: 'suburb', deploy: false, company: crew, band: ['brigand_thug'] }, async (p) => p.evaluate(() => {
    FIGHT.S.units.forEach(v => { if (v.side === 'you') { if (v.main) v.fled = true; else v.down = true; } });
    const ran = isWipe('lost');
    FIGHT.S.units.forEach(v => { if (v.main) v.fled = false; });
    return { ran, stood: isWipe('lost'), won: isWipe('won') };
  }));
  leg(!c.ran && c.stood && !c.won, '  A RETREAT IS NEVER A WIPE: YOU ran -> no wipe; YOU down -> wipe; a win -> no wipe', JSON.stringify(c));
  done();
})().catch(e => { console.error(e); fail++; done(); });
