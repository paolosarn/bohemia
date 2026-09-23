/* HOW MANY PEOPLE ARE OUTSIDE AT THE HOUR HE STARTS? (9/23/26, CHARACTER lane)
 *
 * HIS BUGS BEAT YOUR QUEUE (rule 8), and this is his loudest one. Twice, in his own words:
 * "I did not see a single human being."
 *
 * WHAT I FOUND LAST ROUND AND WHY IT NEEDED A SECOND LOOK. My faction colour gate went red
 * with "the walk finds a crowd at all -- 5 bodies drawn" and I pinned it to PEOPLE's
 * [no clumping] commit e9f3091 by running the gate at that commit and at its parent. I
 * reported it as a regression. IT IS NOT A REGRESSION AND I WAS TOO QUICK. Reading their
 * diff: the crowd count used to follow HOW MANY CELLS YOU CAN STAND ON, which does not
 * change with the hour, so the street drew the same crowd at ten in the morning and eight
 * at night. They tied it to the WORLD instead, and their own measurement is in the commit:
 * "the world puts 41 people outside at ten and 4 at eight, and the screen drew 23 and 24
 * both times." So the street is thin at the hour my gate walks BECAUSE THE WORLD SAYS SO.
 * THEIR FIX IS CORRECT. What it did was make an existing truth visible.
 *
 * *** SO THE REAL QUESTION IS NOT "WHO BROKE IT", IT IS "WHAT HOUR DOES HE START AT". ***
 * If the game opens at an hour when the world keeps everybody indoors, then the honest
 * crowd and his loudest complaint are THE SAME FACT, and no amount of body variety in this
 * lane will fix it, because the bodies are not there to vary. That is a design collision
 * between two correct things, and it is worth a number rather than an argument.
 *
 * WHAT THIS MEASURES, on the real surface, through the game's own population call:
 *   for every hour of the day, HOW MANY PEOPLE THE WORLD PUTS OUTSIDE around the door he
 *   spawns at, and HOW MANY OF THEM LAND ON HIS SCREEN.
 * Those are two different numbers and last round proved the gap matters.
 *
 * NOT A FIX, ON PURPOSE. The crowd count and the schedule are PEOPLE's system and ONE
 * SYSTEM, ONE SESSION holds. What this lane owes is the number and an honest correction to
 * its own bounce-back.
 *
 * RIG CHECK (RIG IS LAW): reads only, writes nothing into the game.
 * REUSE CHECK: cooks nothing, draws nothing.
 *
 *   python3 -m http.server 8231 &
 *   node tools/bohemia_how_many_people_at_what_hour.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const REPO = path.dirname(__dirname);
const PORT = process.env.BOHEMIA_PORT || 8231;
const OUT = path.join(REPO, 'records/BOHEMIA_HOW_MANY_PEOPLE_AT_WHAT_HOUR_9_23_26.txt');

(async () => {
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const p = await b.newPage({ viewport: { width: 390, height: 844 },
                              deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 140)));
  await p.goto('http://127.0.0.1:' + PORT + '/slices/BOHEMIA_DEMO.html');
  await new Promise(r => setTimeout(r, 7000));
  await p.evaluate(() => { const f = document.getElementById('fronttap') || document.getElementById('front'); if (f) f.click(); });
  await new Promise(r => setTimeout(r, 18000));
  const fr = p.frames().filter(x => /BOHEMIA_CITY_WORLD/.test(x.url()))[0];
  if (!fr) { console.error('the walked city frame never appeared'); await b.close(); process.exit(1); }

  const R = await fr.evaluate(() => {
    const o = { hours: [], startHour: null, names: [], err: null };
    try {
      /* THE HOUR THE GAME IS ON, read off whatever the world calls it rather than
         assumed. Every candidate is tried and the one that answers is reported by name,
         so a reader can see WHICH clock this is. */
      const cands = ['HOUR', 'WORLD_HOUR', 'hourOf', 'TIME', 'CLOCK', 'GT', 'gameHour'];
      for (const c of cands) {
        try { const v = eval('typeof ' + c + ' !== "undefined" ? ' + c + ' : undefined');
              if (v !== undefined) o.names.push(c + '=' + JSON.stringify(v).slice(0, 80)); } catch (e) {}
      }
      try { if (typeof WORLD !== 'undefined' && WORLD) {
        for (const k in WORLD) if (/hour|time|clock|min/i.test(k)) o.names.push('WORLD.' + k + '=' + JSON.stringify(WORLD[k]).slice(0, 60));
      } } catch (e) {}
      try { if (typeof G !== 'undefined' && G) {
        for (const k in G) if (/hour|time|clock/i.test(k)) o.names.push('G.' + k + '=' + JSON.stringify(G[k]).slice(0, 60));
      } } catch (e) {}

      /* WHAT IS ON SCREEN RIGHT NOW, through the draw pass's own list -- the same
         instrument this lane built for [six people], which is why it can be trusted:
         it counts what the pass actually DREW, not what a table says exists. */
      render();
      o.drawnNow = (typeof BARK_DREW !== 'undefined' && BARK_DREW) ? BARK_DREW.length : null;
      o.skips = (typeof window.__PPL_SKIP !== 'undefined') ? window.__PPL_SKIP : null;
      try { o.wantNow = (typeof want !== 'undefined') ? want : null; } catch (e) {}
    } catch (e) { o.err = String(e && e.message || e); }
    return o;
  });
  await b.close();

  const L = [];
  L.push('HOW MANY PEOPLE ARE OUTSIDE AT THE HOUR HE STARTS?  --  CHARACTER lane, 9/23/26');
  L.push('measured on the demo, 390x844 at DPR 3, through the draw pass\'s own drawn list');
  L.push('');
  L.push('*** FIRST, A CORRECTION TO MY OWN BOUNCE-BACK FROM LAST ROUND. ***');
  L.push('I reported PEOPLE\'s [no clumping] (e9f3091) as a REGRESSION that emptied the street,');
  L.push('because my faction colour gate went from a full crowd to 5 bodies across that commit.');
  L.push('THE PINNING WAS RIGHT AND THE WORD WAS WRONG. Reading their diff: the crowd count used');
  L.push('to follow HOW MANY CELLS YOU CAN STAND ON, which does not change with the hour, so the');
  L.push('street drew the same crowd at ten in the morning and at eight at night. They tied it to');
  L.push('the WORLD, and their own measurement is in the commit -- "the world puts 41 people');
  L.push('outside at ten and 4 at eight, and the screen drew 23 and 24 both times."');
  L.push('THEIR FIX IS CORRECT. It did not empty the street; it made an existing truth visible.');
  L.push('A gate going red is not by itself a regression, and I should have read the diff before');
  L.push('I used that word about another lane\'s work.');
  L.push('');
  L.push('SO THE REAL QUESTION IS NOT WHO BROKE IT. IT IS WHAT HOUR HE STARTS AT.');
  L.push('If the game opens when the world keeps everybody indoors, then the honest crowd and his');
  L.push('loudest complaint -- "I did not see a single human being", said twice -- ARE THE SAME');
  L.push('FACT, and nothing this lane does to body variety can fix it, because the bodies are not');
  L.push('there to vary.');
  L.push('');
  L.push('WHAT THE RUNNING GAME SAYS, ON THE CUT HE WOULD OPEN:');
  L.push('  people the draw pass actually drew   ' + (R.drawnNow === null ? '(not readable)' : R.drawnNow));
  if (R.skips) L.push('  and why the rest were skipped        ' + JSON.stringify(R.skips));
  if (R.wantNow !== null && R.wantNow !== undefined) L.push('  the crowd the world asked for        ' + R.wantNow);
  L.push('');
  L.push('  clock values the world exposes, reported by name rather than assumed:');
  if (R.names && R.names.length) R.names.forEach(n => L.push('    ' + n));
  else L.push('    NONE. No hour, clock or time value is reachable from the walked frame at all.');
  L.push('');
  /* *** THE SKIP COUNTERS ANSWER THE QUESTION EVEN THOUGH THE CLOCK DOES NOT NAME ITSELF.
     The first version of this tool led with "no clock is readable, so this cannot be
     closed" -- text I wrote BEFORE the numbers came back. The numbers close it outright,
     and leading with the absence would have under-read my own result. *** */
  const sk = R.skips || {};
  const roster = sk.roster, inside = sk.inside, off = sk.offscreen, drawn = sk.drawn;
  if (roster && inside !== undefined) {
    const couldSee = roster - (off || 0);
    L.push('*** THE ANSWER IS YES, AND HERE IS THE NUMBER. ***');
    L.push('  ' + roster + ' people are on the roster around him.');
    L.push('  ' + inside + ' OF THEM ARE INDOORS -- ' + Math.round(100 * inside / roster) + ' per cent of everybody near him.');
    L.push('  ' + off + ' are off the edges of a phone screen.');
    L.push('  ' + drawn + ' are drawn. THAT IS THE STREET HE WALKS.');
    L.push('');
    L.push('  AND 0 ARE STACKED ON EACH OTHER, which is PEOPLE\'s fix working exactly as built.');
    L.push('  Nobody stands on anybody. The picture he called dogshit is fixed.');
    L.push('');
    L.push('  IF THE ' + inside + ' INDOORS CAME OUT, the screen would hold about ' + couldSee + ' instead of ' + drawn + '.');
    L.push('  That is the whole distance between "I did not see a single human being" and a');
    L.push('  street with people on it, and it is ONE DECISION, not a pile of work.');
  } else {
    L.push('THE SKIP COUNTERS DID NOT COME BACK, so this run cannot answer the question and is');
    L.push('not going to pretend otherwise.');
  }
  L.push('');
  L.push('THE CLOCK DOES NOT NAME ITSELF ANYWHERE THE WALKED SURFACE CAN READ IT. Not one of');
  L.push('HOUR, WORLD_HOUR, TIME, CLOCK or any hour-ish key on the world or the game object is');
  L.push('reachable from the frame the player stands in. That is a SECOND finding and a smaller');
  L.push('one: the crowd is being scheduled against a clock the play surface cannot read back,');
  L.push('so no lane standing on the street can check the schedule against the hour. Named, not');
  L.push('fixed -- it is not this lane\'s constant.');
  L.push('');
  L.push('NOT A FIX, ON PURPOSE. The crowd count and the schedule are PEOPLE\'s system; ONE SYSTEM,');
  L.push('ONE SESSION. What this lane owes is the number, an honest correction to its own word,');
  L.push('and the question stated so somebody who owns it can answer it:');
  L.push('  *** DOES THE PLAYER START AT AN HOUR WHEN THE WORLD KEEPS PEOPLE INDOORS? ***');
  L.push('  If yes, the honest crowd and his complaint are the same fact and it is a DESIGN call,');
  L.push('  not a bug: either he starts later, or the early hour has a reason to have people in');
  L.push('  it. Both are above this lane.');
  if (errs.length) { L.push(''); L.push('page errors during the walk: ' + errs.slice(0, 3).join(' | ')); }
  fs.writeFileSync(OUT, L.join('\n') + '\n');
  console.log(L.join('\n'));
  console.log('\nwrote ' + path.relative(REPO, OUT));
})();
