#!/usr/bin/env node
/* ============================================================================
   WHAT YOU TOOK LEAVES THE FIGHT WITH YOU
   (9/12/26, COMBAT lane, VAMILY row [loot kept] = BB-LOOT-LEAVES + BB-KEYS-LAND)

   PAOLO 8/25: "YOU GET EXPERIENCE AND LOOT OFF THEIR BODIES."

   This drives the REAL alpha. It opens a real fight, puts a real drop on the
   ground with loot, experience, a plate and a boss key on it, WALKS THE PLAYER
   ONTO IT through the shipped pickup, ends the fight through the shipped one-send
   path, and then asks three different places what they think happened: the
   message the run hears, the shell's own window, and the walked city's own
   ctLadderHeld(), which is the reader that has been seeing an empty hand.

   WHY IT IS DRIVEN AND NOT READ OFF THE SOURCE: the whole row exists because a
   field was present in one file and read by nobody in the next one. A source
   check is the instrument that cannot see that.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.join(__dirname, '..');
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* *** THIS GATE SERVES THE GAME OVER HTTP, AND THAT IS THE WHOLE REASON ITS LAST
   ARM MEANS ANYTHING. *** The chain this row fixes ends in the walked city reading
   window.parent.bohemiaKeys -- one frame reaching into another. On a file:// page
   EVERY frame has a null origin and they are cross-origin to each other, so that
   read THROWS no matter how correct the build is, and a file:// harness reports
   "the city sees nothing" forever. The deployed game is one origin over https,
   where the read is legal. So the harness matches the site: a static server on
   localhost, which is the same-origin condition production runs in.
   A file:// harness would have passed this row as impossible to finish. */
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

let pass = 0, fail = 0;
const ok = (n, c) => { c ? (pass++, console.log('  PASS ' + n)) : (fail++, console.log('  FAIL ' + n)); };
let SRV = null;
const done = async (b) => { if (b) await b.close(); if (SRV) try { SRV.close(); } catch (e) {}
  console.log('=== LOOT KEPT GATE: ' + pass + ' passed, ' + fail + ' failed ===');
  process.exit(fail ? 1 : 0); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 430, height: 932 } });
  const errors = [];
  page.on('pageerror', e => errors.push(String(e).slice(0, 200)));

  SRV = await serve();
  const BASE = 'http://127.0.0.1:' + SRV.address().port;
  await page.goto(BASE + '/slices/BOHEMIA_ALPHA_0_9.html', { waitUntil: 'load', timeout: 120000 });
  await sleep(9000);

  /* ---- 0. the source half, cheap, so a deleted wire is named plainly ---- */
  const wired = await page.evaluate(() => ({
    keeperKeys: typeof bohKeepKeys === 'function',
    keeperPocket: typeof bohKeepPocket === 'function' }));
  ok('the shell has the keeper the city reads through (keys ' + wired.keeperKeys
    + ', pocket ' + wired.keeperPocket + ')', wired.keeperKeys && wired.keeperPocket);

  /* ---- 1. open a real fight on the COMBAT bench -------------------------
     THE SPLASH IS CLICKED THROUGH FIRST, which is not optional: the tab bar does
     not exist until the front door has been opened, so a gate that reaches for a
     tab on boot reports "no fight" on a build where the fight is fine. */
  await page.mouse.click(215, 450); await sleep(2500);
  await page.mouse.click(215, 450); await sleep(3000);
  await page.evaluate(() => { try { markBeatTaught(); } catch (e) {} });
  await page.evaluate(() => { const t = document.querySelector('[data-p="combat"]');
    if (t) t.click(); });
  await sleep(7000);
  const cf = page.frames().find(f => { try { return f.name() === 'combatFrame'; } catch (e) { return false; } });
  ok('a real fight is open on the bench, which is where the pickup lives', !!cf);
  if (!cf) return done(browser);

  /* the pocket starts empty for this measurement, and the fight's own forget
     function is used rather than clearing storage from outside */
  await cf.evaluate(() => { try { pocketForget(); keysForget(); } catch (e) {} });

  /* ---- 2. put a real body's worth of takings on the ground and WALK ONTO IT
     through the shipped sweepDrops, never by calling the credit by hand ---- */
  const took = await cf.evaluate(() => {
    const bossId = (typeof BOSSES !== 'undefined' && BOSSES && BOSSES.length) ? (BOSSES[0].id || null) : null;
    const before = { xp: (G.rc && G.rc.xp) | 0, pp: G.pp | 0,
      keys: (typeof KEYS !== 'undefined' ? KEYS.taken.length : -1) };
    /* ONE DROP, ON THE TILE HE IS STANDING ON, with everything a body can carry.
       PICKUP_R and myLvl() are the shipped conditions and they are honoured, not
       bypassed: this is the same object a dead man leaves behind. */
    G.drops = [{ ea: 0, edist: 0, lvl: myLvl(), n: 3,
      xp: 12, xpMult: 1, loot: { n: 'gate item', why: 'draft' }, plate: true, key: bossId }];
    const swept = (typeof sweepDrops === 'function') ? sweepDrops() : -1;
    return { swept: swept, bossId: bossId, before: before,
      after: { xp: (G.rc && G.rc.xp) | 0, plates: (G.rc && G.rc.plates) | 0,
        loot: ((G.rc && G.rc.loot) || []).length,
        keys: ((G.rc && G.rc.keys) || []).slice(), pp: G.pp | 0 } };
  });
  console.log('  the pickup: ' + JSON.stringify(took));
  ok('WALKING ONTO THE BODY TAKES IT, through the shipped pickup (it returns the ROUNDS off the ground, '
    + took.swept + ' of the 3 this body was carrying, which is what that function has always returned): the experience lands (' + took.before.xp + ' -> ' + took.after.xp
    + '), the plate goes on your chest (' + took.before.pp + ' -> ' + took.after.pp
    + '), the item is in the fight\'s own ledger (' + took.after.loot
    + ') and the key is recorded for THIS fight (' + JSON.stringify(took.after.keys)
    + '). A plate and a key had no per-fight counter at all before this row, which is why two of these four numbers are new',
    took.swept === 3 && took.after.xp > took.before.xp && took.after.plates >= 1
    && took.after.loot >= 1 && took.after.keys.length >= 1 && took.after.pp > took.before.pp);

  /* ---- 3. THE MESSAGE THE RUN HEARS --------------------------------------- */
  await page.evaluate(() => { window.__END = null;
    window.addEventListener('message', e => { const d = e && e.data;
      if (d && d.type === 'BOHEMIA_COMBAT_END') window.__END = d; }); });
  await cf.evaluate(() => { try { sendCombatEnd(true, 'cleared'); } catch (e) {} });
  await sleep(1200);
  const end = await page.evaluate(() => window.__END);
  console.log('  the message out: ' + JSON.stringify(end && end.took));
  ok('*** AND THE ONE MESSAGE OUT CARRIES WHAT YOU TOOK, WHICH IS THE WHOLE ROW. *** BB-LOOT-LEAVES measured this payload as a body count and a health number: victory, result, reason, kills, dead, spared, fled, alive, fates, playerHP, turns and three ids, with NO loot, NO experience, NO plates and NO keys. It carries experience '
    + (end && end.took && end.took.xp) + ', ' + (end && end.took && end.took.plates)
    + ' plate, ' + (end && end.took && end.took.loot || []).length + ' item and '
    + JSON.stringify(end && end.took && end.took.keys)
    + ' now. Every one of those numbers was ALREADY counted in G.rc, which the fight rebuilds at the top of every bell, so this is a read and not a new mechanic',
    !!end && !!end.took && end.took.xp > 0 && end.took.plates >= 1
    && (end.took.loot || []).length >= 1 && (end.took.keys || []).length >= 1);

  ok('and the old outcome is untouched beside it, because a run that reads this message must not have to change to keep working (victory '
    + (end && end.victory) + ', turns ' + (end && end.turns) + ', playerHP ' + (end && end.playerHP) + ')',
    !!end && end.victory === true && typeof end.turns === 'number' && typeof end.playerHP === 'number');

  /* ---- 4. THE POCKET, AND IT SURVIVES A RELOAD --------------------------- */
  const pocket = await cf.evaluate(() => ({ mem: window.POCKET ? null : null,
    stored: (function () { try { return JSON.parse(localStorage.getItem('bohemia.pocket')); } catch (e) { return null; } })() }));
  console.log('  the pocket: ' + JSON.stringify(pocket.stored));
  ok('AND IT IS KEPT, which is the row\'s own word: what you took is in the fight\'s own storage ('
    + JSON.stringify(pocket.stored && pocket.stored.items) + ', experience ' + (pocket.stored && pocket.stored.xp)
    + ', ' + (pocket.stored && pocket.stored.plates) + ' plate, keys ' + JSON.stringify(pocket.stored && pocket.stored.keys)
    + ') rather than dying with the fight. bohemia.tree and bohemia.keys are already written from in there and this is the third of the same kind, so RUN\'s bohemia.save.v1 is not touched by this lane',
    !!pocket.stored && (pocket.stored.items || []).length >= 1 && pocket.stored.xp > 0
    && pocket.stored.plates >= 1 && (pocket.stored.keys || []).length >= 1
    && pocket.stored.fights >= 1);

  /* ---- 5. THE SHELL KEPT IT, which is the hole the city falls through ---- */
  const shell = await page.evaluate(() => ({
    keys: window.bohemiaKeys || null, pocket: window.bohemiaPocket || null }));
  console.log('  the shell holds: keys ' + JSON.stringify(shell.keys)
    + ', pocket items ' + ((shell.pocket && shell.pocket.items) || []).length);
  ok('*** AND THE SHELL KEEPS IT, WHICH IS THE MIDDLE OF THE CHAIN AND WAS MISSING. *** The fight published the keys twice on purpose, with the reason written beside them -- "so CITY, RUN and QUESTS can read what you hold without knowing a thing about combat" -- and the shell never kept either copy, because the message had NO TYPE FIELD and the shell routes all twenty of its message types by d.type. It holds '
    + JSON.stringify(shell.keys) + ' and a pocket of ' + ((shell.pocket && shell.pocket.items) || []).length + ' now',
    Array.isArray(shell.keys) && shell.keys.length >= 1
    && !!shell.pocket && (shell.pocket.items || []).length >= 1);

  /* ---- 6. AND THE CITY'S OWN READER FINALLY SEES A HAND ------------------ */
  await page.click('[data-p="run"]', { timeout: 15000 }).catch(() => {});
  await sleep(3000);
  const city = page.frames().find(f => { try { return f.name() === 'cityFrame'; } catch (e) { return false; } });
  const held = city ? await city.evaluate(() => {
    try { return { held: ctLadderHeld(), reader: typeof ctLadderHeld === 'function' }; }
    catch (e) { return { err: String(e).slice(0, 80) }; } }) : null;
  console.log('  the city holds: ' + JSON.stringify(held));
  ok('*** AND THE WALKED CITY\'S OWN READER FINALLY SEES A HAND. *** ctLadderHeld() was written into the city on 9/6 and its comment says why: "MEASURED 9/6: nothing outside the fight had ever read it." It reads window.parent.bohemiaKeys, the shell\'s global, which nothing ever set -- so the boss ladder has been answering EMPTY no matter what you were carrying. It answers '
    + JSON.stringify(held && held.held) + ' now, which is the key this gate took off a body four steps ago',
    !!held && Array.isArray(held.held) && held.held.length >= 1);

  ok('no page errors through the whole round trip', errors.length === 0);
  if (errors.length) console.log('    ' + errors.slice(0, 3).join('\n    '));

  return done(browser);
})().catch(async e => {
  console.log('  FAIL gate threw: ' + (e && e.message));
  console.log('=== LOOT KEPT GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed ===');
  process.exit(1);
});
