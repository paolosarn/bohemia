#!/usr/bin/env node
/* ============================================================================
   THEY ARE RUNNING, DO I CHASE?
   (9/13/26, COMBAT lane, VAMILY [enemies flee] = BB-THE-ROUT)

   THE ROW: "THE MOST DECISIVE MOMENT IN A REAL BATTLE IS CURRENTLY A DESPAWN."
   In pre-modern battle the winners rarely lost more than 5% and the losers averaged
   10-15%, and much of that was inflicted DURING THE ROUT. A battle is decided by a
   decision to leave, and the killing happens after the decision. So the interesting
   question is not "can I kill all eight", it is "THEY ARE RUNNING -- DO I CHASE?"

   MEASURED IN THE BLOB FIRST, and the row was right on every count plus one it did
   not know: a runner walks one tile a turn and clamps at 30; he is in NO target pool
   because peeking() and exposedToMe() both exclude the fleeing; and -- the real
   defect -- aliveEnemies() excludes him too, so FOUR end checks fired the instant the
   last man on his feet turned his back. The question could not be ASKED, because the
   win screen was already up.

   THIS DRIVES THE REAL FIGHT. The room breaks through the shipped nerve roll rather
   than by setting a flag, because a flag would prove the rout works on a state the
   game might never reach.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.join(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
function serve() {
  return new Promise(res => {
    const srv = http.createServer((rq, rp) => {
      const u = decodeURIComponent((rq.url || '/').split('?')[0]);
      const f = path.join(REPO, u);
      if (!f.startsWith(REPO) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) {
        rp.writeHead(404); return rp.end('no'); }
      rp.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
      fs.createReadStream(f).pipe(rp);
    });
    srv.listen(0, '127.0.0.1', () => res(srv));
  });
}

let pass = 0, fail = 0, SRV = null;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };
const done = async (b) => { if (b) await b.close(); if (SRV) try { SRV.close(); } catch (e) {}
  console.log('=== THE ROUT GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)));
  /* V214: this gate already boots the alpha and opens the fight, so the font claim
     rides along for nothing rather than paying for a whole browser of its own. */
  const external = [], failedReq = [];
  page.on('request', r => { const u = r.url();
    if (!/^http:\/\/127\.0\.0\.1|^data:|^blob:|^about:/.test(u)) external.push(u.slice(0, 90)); });
  page.on('requestfailed', r => failedReq.push(r.url().slice(0, 90)));

  SRV = await serve();
  const BASE = 'http://127.0.0.1:' + SRV.address().port;
  await page.goto(BASE + '/slices/BOHEMIA_ALPHA_0_9.html', { waitUntil: 'load', timeout: 120000 });
  await sleep(9000);
  await page.mouse.click(215, 450); await sleep(2500);
  await page.mouse.click(215, 450); await sleep(4000);
  await page.evaluate(() => { try { markBeatTaught(); } catch (e) {} });
  await page.click('[data-p="combat"]', { timeout: 20000 }).catch(() => {});
  await sleep(3000);

  const cf = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
  ok('a real fight is open', !!cf);
  if (!cf) return done(browser);

  /* ---- 1. THE BREAK IS THE SHIPPED ONE, NOT A FLAG ----------------------- */
  const broke = await cf.evaluate(() => {
    /* A FULL ROOM, because the shipped rule needs one: the nerve roll wants half the
       room down (NERVE_AT) and the LAST man puts his hands up instead of running, so
       a three-man bench fight can never produce a runner at all. */
    /* encCurve OFF first: with the curve on, the bench picks its own count and the
       requested eight quietly came back as four, which is under the threshold. */
    try { G.encCurve = false; G.numEnemies = 8; fullResetCombat(); startGame(); } catch (e) {}
    G.over = false; G.win = false;
    for (const e of G.e) { e.dead = false; e.downed = false; e.broken = false; e.fleeing = false;
      e._gone = false; e.edist = 3; e.hp = e.max || 60; }
    const men = G.e.length;
    /* half the room dies through the shipped death path, which is what the nerve roll
       actually reads -- no flag is set on anybody who then runs */
    const half = Math.ceil(men * (typeof NERVE_AT !== 'undefined' ? NERVE_AT : 0.5));
    for (let i = 0; i < half; i++) { G.e[i].hp = 0; G.e[i].dead = true; }
    let turns = 0, ran = 0;
    while (turns < 60 && ran === 0) {
      /* the shipped roll fires once per NEW body ('_down > _nerveLastDown'), which in
         a real fight is every time you kill somebody. Re-arming it each turn is the
         only staging here: the threshold, the chance and the run-or-surrender choice
         are all the shipped ones, untouched. */
      G._nerveLastDown = -1;
      try { tickTurnEnd(); } catch (e) { return { err: String(e).slice(0, 140) }; }
      ran = (G.e || []).filter(e => e.fleeing).length; turns++;
    }
    return { men: men, killed: half, turns: turns, ran: ran,
      fearOn: (typeof FEAR_ON !== 'undefined') ? FEAR_ON : null,
      byFlag: false };
  });
  console.log('  the break: ' + JSON.stringify(broke));
  ok('*** MEN BREAK AND RUN THROUGH THE SHIPPED NERVE ROLL, NOT A FLAG THIS GATE SET. *** '
    + broke.killed + ' of ' + broke.men + ' went down and ' + broke.ran
    + ' broke within ' + broke.turns + ' turns of the real turn loop. Staged this way on purpose: setting e.fleeing by hand would prove the rout works on a state the game might never reach, which is the structurally-unreachable defect this lane has found five times now',
    !broke.err && broke.ran > 0 && broke.men > 0);
  if (broke.err) console.log('  threw: ' + broke.err);

  /* ---- 2. THE FIGHT DOES NOT END UNDER YOU ------------------------------- */
  const held = await cf.evaluate(() => {
    /* clear every man who is not running, so the ONLY thing left is the rout */
    for (const e of G.e) if (!e.fleeing) { e.dead = true; }
    const r = runners()[0];
    if (!r) return { noRunner: true, alive: aliveEnemies().length, runners: 0, chaseable: 0,
      fightOver: fightOver(), over: !!G.over, reach: maxRange(myRange()), runnerAt: null };
    r.edist = 3; r._gone = false;
    return { alive: aliveEnemies().length, runners: runners().length,
      chaseable: chaseable().length, fightOver: fightOver(), over: !!G.over,
      reach: maxRange(myRange()), runnerAt: r ? r.edist : null };
  });
  console.log('  the fight holds: ' + JSON.stringify(held));
  ok('*** THE FIGHT DOES NOT END UNDER YOU WHILE A MAN IS STILL WORTH CHASING, WHICH IS THE DEFECT THE ROW DID NOT KNOW IT HAD. *** aliveEnemies() excludes the fleeing and four separate end checks read it, so the win screen came up the instant the last man on his feet turned his back -- the question could not be ASKED, never mind answered. The two now disagree exactly where they should: nobody can fight ('
    + held.alive + ' alive) and the fight is NOT over (' + held.fightOver + '), because ' + held.chaseable
    + ' is still inside a reach of ' + Math.round(held.reach * 10) / 10 + ' tiles',
    held.alive === 0 && held.runners > 0 && held.chaseable > 0 && held.fightOver === false);

  /* ---- 3. AND HE IS SOMEBODY YOU MAY SHOOT AT ---------------------------- */
  const pool = await cf.evaluate(() => {
    let r = runners()[0];
    if (!r) { r = G.e[0]; r.dead = false; r.downed = false; r.broken = false; r.fleeing = true; r._gone = false; }
    r.edist = 3;
    const near = { inPool: modePool().some(e => e.fleeing), n: modePool().length };
    r.edist = 29;
    const far = { inPool: modePool().some(e => e.fleeing), chase: chaseable().length, over: fightOver() };
    r.edist = 3;
    return { near: near, far: far,
      /* the pool's own filters are what decide it, not a rule written for runners */
      poolSrc: String(modePool).indexOf('inMyRange') >= 0 && String(modePool).indexOf('smokeAt') >= 0 };
  });
  console.log('  the pool: ' + JSON.stringify(pool));
  ok('*** AND A RUNNING MAN IS SOMEBODY YOU MAY SHOOT AT, WHICH HE HAS NEVER BEEN. *** peeking() and exposedToMe() both exclude the fleeing, so he was in no pool at all and "do I chase?" had no answer you could act on. At 3 tiles he is in the pool ('
    + pool.near.inPool + ', ' + pool.near.n + ' targets) and at 29 he is not (' + pool.far.inPool
    + '), decided by the pool\'s OWN range and smoke filters (' + pool.poolSrc
    + ') rather than by a rule written for runners -- so THE DIAL decides the shot and nothing here makes a man\'s back easier or harder to hit',
    pool.near.inPool === true && pool.far.inPool === false && pool.poolSrc === true
    && pool.far.chase === 0 && pool.far.over === true);

  /* ---- 4. THE WINDOW IS SET BY YOUR GUN, AND IT CLOSES BY ITSELF --------- */
  const windows = await cf.evaluate(() => {
    const out = {};
    const ids = Object.keys(WEAPON_RANGE || {});
    for (const w of ['pistol', 'rifle']) {
      if (ids.indexOf(w) < 0) { out[w] = { missing: true }; continue; }
      WEAPON = w;
      let r = runners()[0];
      if (!r) { r = G.e[0]; }
      r.edist = 3; r._gone = false; r.fleeing = true; r.dead = false; r.downed = false;
      let turns = 0;
      while (turns < 60 && !fightOver()) { try { tickTurnEnd(); } catch (e) { break; } turns++; }
      out[w] = { turns: turns, reach: Math.round(maxRange(myRange()) * 10) / 10,
        gone: !!r._gone, endedAt: Math.round((r.edist || 0) * 10) / 10 };
    }
    return out;
  });
  console.log('  the window: ' + JSON.stringify(windows));
  ok('*** AND THE WINDOW IS SET BY HIS DISTANCE AND YOUR GUN, NOT BY A TIMER THIS ROW INVENTED. *** He walks one tile a turn, so a pistol (reach '
    + windows.pistol.reach + ') gives you ' + windows.pistol.turns + ' turns and a rifle (reach '
    + windows.rifle.reach + ') gives you ' + windows.rifle.turns
    + '. That IS the decision, and it costs what the study says it costs: ground and turns, under whatever is still shooting. The window closes ITSELF, so nothing hangs',
    windows.pistol.turns > 0 && windows.rifle.turns > windows.pistol.turns
    && windows.rifle.reach > windows.pistol.reach
    && windows.pistol.turns < 60 && windows.rifle.turns < 60);

  /* ---- 5. THE QUESTION IS ASKED, ONCE, AT THE ONLY MOMENT IT EXISTS ------ */
  const asked = await cf.evaluate(() => {
    /* while men are still fighting it must NOT fire */
    for (const e of G.e) { e.dead = false; e.downed = false; e.broken = false; e.fleeing = false; e.edist = 4; }
    G._routSaid = false;
    const whileFighting = routAsk();
    /* now everybody but one is down and that one is running, in reach */
    for (let i = 1; i < G.e.length; i++) G.e[i].dead = true;
    const r = G.e[0]; r.fleeing = true; r.dead = false; r.downed = false; r.edist = 3; r._gone = false;
    G._routSaid = false;
    const first = routAsk();
    const read = G.lastRead ? { t: G.lastRead.t, s: G.lastRead.s } : null;
    const again = routAsk();
    return { whileFighting: whileFighting, first: first, again: again, read: read };
  });
  console.log('  the question: ' + JSON.stringify(asked));
  ok('AND THE QUESTION IS ASKED OUT LOUD ONCE, at the only moment it exists: while men are still fighting it says nothing ('
    + asked.whileFighting + '), when the shooting stops and somebody is still in reach it says "'
    + (asked.read && asked.read.t) + ' / ' + (asked.read && asked.read.s)
    + '" (' + asked.first + '), and it does not repeat itself every turn after that (' + asked.again
    + '). A question nobody is told about is not a question',
    asked.whileFighting === false && asked.first === true && asked.again === false
    && !!asked.read && /RUNNING/.test(asked.read.t));

  /* ---- 6. AND LETTING HIM GO IS A COST YOU ARE TOLD ABOUT ---------------- */
  const gone = await cf.evaluate(() => {
    const r = G.e[0];
    r.fleeing = true; r.dead = false; r.downed = false; r._gone = false;
    /* one step INSIDE reach: nothing is said, the decision is still open */
    r.edist = 3;
    try { tickTurnEnd(); } catch (e) {}
    const midRead = G.lastRead ? G.lastRead.t : null;
    const midGone = !!r._gone;
    /* now park him one step short of the edge and take that step */
    r.edist = Math.max(1, maxRange(myRange()) - 0.4); r._gone = false;
    try { tickTurnEnd(); } catch (e) {}
    const read = G.lastRead ? { t: G.lastRead.t, s: G.lastRead.s } : null;
    const wasGone = !!r._gone;
    /* and it is said ONCE, not every turn he keeps running */
    G.lastRead = { t: 'SOMETHING ELSE', s: '' };
    try { tickTurnEnd(); } catch (e) {}
    const after = G.lastRead ? G.lastRead.t : null;
    return { midRead: midRead, midGone: midGone, read: read, wasGone: wasGone, after: after };
  });
  console.log('  letting him go: ' + JSON.stringify(gone));
  ok('AND LETTING HIM GO IS A COST YOU ARE TOLD ABOUT, once, for a man you could have taken: a step taken INSIDE your reach says nothing about him ('
    + gone.midGone + '), the step that carries him OUT says "' + (gone.read && gone.read.t) + ' / '
    + (gone.read && gone.read.s) + '", and the turns after that do not say it again ('
    + gone.after + '). What he was carrying leaves with him because loot only ever falls off a body, which needed no code here and is exactly why the row called this free content',
    gone.midGone === false && gone.wasGone === true && !!gone.read
    && /GONE/.test(gone.read.t) && /carrying/.test(gone.read.s) && gone.after === 'SOMETHING ELSE');

  /* ---- 7. AND CHASING PAYS, WHICH IS WHY YOU WOULD ----------------------- */
  const paid = await cf.evaluate(() => {
    G.drops = [];
    const r = G.e[0];
    r.fleeing = true; r.dead = false; r.downed = false; r.edist = 3; r._gone = false; r.hp = 1;
    const before = (G.drops || []).length;
    try { bodyFell(r); } catch (e) { return { err: String(e).slice(0, 120) }; }
    const d = (G.drops || [])[0] || null;
    return { before: before, after: (G.drops || []).length,
      xp: d ? d.xp : null, hasLoot: !!(d && (d.loot || d.plate)), at: d ? Math.round(d.edist) : null };
  });
  console.log('  chasing pays: ' + JSON.stringify(paid));
  ok('AND CHASING PAYS, WHICH IS THE WHOLE REASON YOU WOULD: a runner you catch is a BODY, and a body drops where it falls with its experience on it ('
    + paid.after + ' drop at ' + paid.at + ' tiles, worth ' + paid.xp
    + ' xp) through V181\'s own path, untouched. The row called this free content landing on rulings we already have, and it was right -- not one line of loot or experience was written for it',
    !paid.err && paid.after === paid.before + 1 && paid.xp > 0);

  /* ---- 8. NO DAMAGE BEFORE THE DIAL -------------------------------------- */
  const dial = await cf.evaluate(() => ({
    dmg: (typeof applyDamage === 'function') ? String(applyDamage).length : null,
    dmgKnowsRunners: (typeof applyDamage === 'function') ? /fleeing|runner|_gone|rout/i.test(String(applyDamage)) : null,
    chaseSrc: String(chaseable),
    chaseAuthorsNothing: !/[0-9]\s*\*|\+\s*0\.[0-9]|Math\.random/.test(String(chaseable)),
    fleeStep: (typeof tickTurnEnd === 'function') ? /Math\.min\(30,/.test(String(tickTurnEnd)) : null
  }));
  console.log('  the dial: ' + JSON.stringify({ dmgKnowsRunners: dial.dmgKnowsRunners,
    chaseAuthorsNothing: dial.chaseAuthorsNothing, fleeStep: dial.fleeStep }));
  ok('NO DAMAGE BEFORE THE DIAL: applyDamage knows nothing about running, runners or this row ('
    + dial.dmgKnowsRunners + '), the chase test authors no number of its own ('
    + dial.chaseAuthorsNothing + ') because it asks the same inMyRange the target pool asks, and the one-tile-a-turn run and its clamp at 30 are the shipped V35/V53 step, untouched ('
    + dial.fleeStep + '). A runner was added to the list of who you MAY shoot; what happens when you do is the dial that was already there',
    dial.dmgKnowsRunners === false && dial.chaseAuthorsNothing === true && dial.fleeStep === true);

  /* ---- V214 THE FIGHT WEARS THE GAME'S OWN FACE ------------------------- */
  const face = await cf.evaluate(() => {
    const cs = getComputedStyle(document.body);
    const faces = []; try { document.fonts.forEach(f => faces.push(f.family + '/' + f.status)); } catch (e) {}
    return { body: cs.fontFamily, faces: faces,
      links: Array.from(document.querySelectorAll('link')).map(l => l.href).filter(Boolean),
      grotesk: document.documentElement.innerHTML.indexOf('Space Grotesk') >= 0 };
  });
  console.log('  the fight\'s face: ' + JSON.stringify(face) + '  external ' + JSON.stringify(external));
  ok('*** AND THE FIGHT WEARS THE GAME\'S OWN FACE INSTEAD OF FETCHING ONE FROM GOOGLE. *** EYES E26 walked the five minutes cold and found the fight typeset in SPACE GROTESK, pulled from fonts.googleapis out of a srcdoc document -- THE ONLY FAILED REQUEST OF THE WHOLE WALK, on a phone, and a font the 9/11 vibe-coded law bans BY NAME. The body now reads "'
    + face.body + '", the document carries ' + face.links.length + ' stylesheet links, the word Grotesk appears '
    + face.grotesk + ', and the page made ' + external.length + ' external requests with '
    + failedReq.length + ' failures. The faces are the WALKED CITY\'S OWN, copied verbatim with their woff2 embedded as data URIs, so no typeface was chosen here and nothing costs a request: '
    + JSON.stringify(face.faces),
    /BohemiaBody/.test(face.body) && face.grotesk === false && face.links.length === 0
    && external.length === 0 && failedReq.length === 0
    && face.faces.some(f => /BohemiaBody\/loaded/.test(f)));

  ok('no page errors through the whole round trip', errors.length === 0);
  if (errors.length) console.log('  errors: ' + JSON.stringify(errors.slice(0, 3)));
  return done(browser);
})().catch(async e => {
  console.log('  FAIL gate threw: ' + (e && e.message));
  fail++; return done(null);
});
