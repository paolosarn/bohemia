/* BOHEMIA HALF A HUD PROBE (9/23/26, LIFE + CITY, row [eyes: half a hud]).

   EYES round 11, on the DEPLOYED CUT BUILD 9/21i, pressed seven controls on the
   first screen twice each and none of them did anything:
     SCAVENGE 8H, BUILD HERE, DIAMOND STANDING, RAY, DENISE, MARCO, Marry.
   Three are core verbs a stranger meets first; four are the family panel.
   Paolo 9/13, rule 14(d): "A card that promises something and does nothing is the
   worst bug in the game: deliver it or remove it."

   *** RULE 14(g): NEVER REPORT A BREAK YOU HAVE NOT REPRODUCED ON THE GLASS, AND
   THE CUT HAS MOVED A LONG WAY SINCE 9/21i. *** Between then and now UI deleted the
   PHONE chip and made the drawn phone the button, RUN shipped the loading screen
   twice, QUESTS put a speaker at the door. A finding two cuts old is a claim, not a
   measurement, so every one of the seven is pressed again here before a line of it
   is believed.

   *** RULE 14(h), AND IT IS THE WHOLE INSTRUMENT: IN THIS GAME A DEAD BUTTON IS
   INDISTINGUISHABLE FROM A CLOSE BUTTON. *** A card closes on any tap it does not
   recognise, so a screen diff reads the vanished card as life; and the demo repaints
   constantly, so two identical pictures do not mean the button did nothing. The only
   honest test QUESTS found is: THE PANEL MUST STILL BE OPEN AND ITS WORDS MUST HAVE
   MOVED. Words do not repaint on their own. So each press records, before and after:
       what is on screen that was not before   (new element ids and new text)
       whether anything that WAS open is still open
       whether any visible text changed
   and a press only counts as alive if some TEXT moved, never if pixels did.

   *** AND TWO THINGS THIS PROBE GOT WRONG ON ITS FIRST RUN, BOTH CAUGHT BY ITS OWN
   OUTPUT, BOTH FIXED HERE. ***

   (1) IT MEASURED THE WRONG FILE. The first run opened BOHEMIA_DEMO.html, the BAKED
   demo, because that is the driver's default -- and the baked demo is stale on
   purpose (only RUN re-cuts it, and RUN [cut now] is open saying "the demo he opens
   is still the old demo"). What a stranger is served at the link is cut from the
   ALPHA on every deploy, so the alpha is the tip and the baked file is history. The
   driver PRINTS which file it opened, which is the only reason this was visible at
   all. It now runs BOTH and prints them side by side, because "is this button dead"
   can have two different true answers on two different files and that difference is
   itself the finding.

   (2) "ALIVE" CAN BE SOMETHING ELSE OPENING. The first run called SCAVENGE alive
   because two words appeared -- and the words were a TEACHING RING (teachwrap,
   teachring, teachsay), which may well open on ANY tap. That is rule 14(h)'s false
   life wearing a new coat: not a card closing this time, but an overlay opening.
   So every run now presses an INERT POINT first -- a spot on the chrome that is not
   a control -- and whatever that press produces is SUBTRACTED from every verdict.
   PLUMBER's control walk is the same idea: press nothing, see what the surface does
   by itself, and only believe the difference.

   Run from repo root:  node tools/bohemia_half_a_hud_probe.js
*/
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);

/* the seven, by the words EYES read off the glass, not by id: an id is my guess at
   what he tapped, the words are what he saw. Each carries the id we expect so the
   probe can say when the two have come apart. */
const SEVEN = [
  { says: 'SCAVENGE',   expect: '#jobbtn',   who: 'a core verb: the job' },
  { says: 'BUILD HERE', expect: '#buildbtn', who: 'a core verb: building' },
  { says: 'STANDING',   expect: '#rungbtn',  who: 'a core verb: your own rung' },
  { says: 'RAY',        expect: null,        who: 'the family panel' },
  { says: 'DENISE',     expect: null,        who: 'the family panel' },
  { says: 'MARCO',      expect: null,        who: 'the family panel' },
  { says: 'Marry',      expect: null,        who: 'the family panel, the one action' },
];

async function sweep(opts) {
  const D = require(path.join(ROOT, 'tools/bohemia_drive_the_demo.js'));
  const d = await D.open(opts);
  console.log('');
  console.log('=== ' + d.says() + ' ===');

  /* *** GO THROUGH THE DOOR FIRST. ***
     The alpha's loading screen HOLDS UNTIL BEGIN, by design (rule 18a), and the
     driver's own note says a caller has to read the top page and walk through it.
     This probe did not, so every click it made landed on #loadgl -- the loading
     screen's own canvas, inside #front at z-index 200 covering the whole 390x844 --
     and never reached the game at all. That is the FOURTH wrong instrument in this
     round and it is the same family as all the others: pressing a surface that
     something is covering. The controls underneath were alive the whole time. */
  const door = await d.pageEval(async () => {
    const seen = [];
    for (let i = 0; i < 90; i++) {
      const f = document.getElementById('front');
      if (!f || getComputedStyle(f).display === 'none') return { through: true, how: 'front was already gone', waited: i };
      const hit = Array.from(f.querySelectorAll('*')).filter(el => {
        const t = (el.textContent || '').trim().toUpperCase();
        return t === 'BEGIN' && el.getBoundingClientRect().width > 10;
      });
      if (hit.length) {
        seen.push('BEGIN at ' + i);
        hit[hit.length - 1].click();
        await new Promise(r => setTimeout(r, 1200));
        const g = document.getElementById('front');
        if (!g || getComputedStyle(g).display === 'none')
          return { through: true, how: 'pressed BEGIN', waited: i };
      }
      await new Promise(r => setTimeout(r, 1000));
    }
    const f = document.getElementById('front');
    return { through: false,
             how: 'BEGIN never came, or pressing it did not clear #front',
             still: f ? getComputedStyle(f).display : 'gone', waited: 90 };
  });
  console.log('  THE DOOR: ' + (door.through ? 'through -- ' : '*** STILL SHUT *** -- ')
    + door.how + ' (waited ' + door.waited + 's)');
  const covered = await d.pageEval(() => {
    const e = document.elementFromPoint(38, 617);
    return e ? (e.id ? '#' + e.id : e.tagName.toLowerCase()) : 'nothing';
  });
  console.log('  and at 38,617 the TOP page now hands the finger to: ' + covered);

  /* FIND THEM BY THEIR WORDS. EYES read labels off the glass; binding to an id here
     would quietly test a different control and report it healthy. */
  const found = await d.fr.evaluate(list => {
    const out = [];
    const all = Array.from(document.querySelectorAll('div,button,span,a'));
    for (const want of list) {
      let hit = null;
      for (const el of all) {
        const own = Array.from(el.childNodes)
          .filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
        const txt = (own || el.textContent || '').trim();
        if (!txt || txt.length > 40) continue;
        if (txt.toUpperCase().indexOf(want.says.toUpperCase()) < 0) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        if (!hit || (r.width * r.height) < (hit.w * hit.h)) {
          hit = { id: el.id || null, tag: el.tagName.toLowerCase(), text: txt,
                  x: r.x + r.width / 2, y: r.y + r.height / 2,
                  w: Math.round(r.width), h: Math.round(r.height),
                  cursor: cs.cursor, role: el.getAttribute('role'),
                  tabindex: el.getAttribute('tabindex') };
        }
      }
      out.push({ says: want.says, expect: want.expect, who: want.who, el: hit });
    }
    return out;
  }, SEVEN);

  /* THE SNAPSHOT: every visible id, and every visible line of text. Text is the
     thing that cannot repaint on its own, so it is what a verdict rests on. */
  const snap = () => d.fr.evaluate(() => {
    const ids = [], words = [];
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
      if (el.id) ids.push(el.id);
      const own = Array.from(el.childNodes)
        .filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim();
      if (own && own.length < 200) words.push(own);
    }
    return { ids: ids, words: words };
  });

  /* *** THE CONTROL PRESS, FIRST. *** An inert point on the chrome: not a control,
     not the canvas, not a panel. Whatever appears when nothing was pressed is what
     this surface does BY ITSELF, and it is subtracted from every verdict below. */
  const inert = await d.fr.evaluate(() => {
    const bar = document.querySelector('#topbar') || document.body;
    const r = bar.getBoundingClientRect();
    return { x: Math.round(r.x + r.width - 3), y: Math.round(r.y + r.height - 2) };
  });
  const cb = await snap();
  await d.page.mouse.click(inert.x, inert.y);
  await d.page.waitForTimeout(900);
  const ca = await snap();
  const FREE_IDS = ca.ids.filter(i => cb.ids.indexOf(i) < 0);
  const FREE_WORDS = ca.words.filter(w => cb.words.indexOf(w) < 0);
  console.log('  CONTROL PRESS on an inert point (' + inert.x + ',' + inert.y + '): '
    + FREE_WORDS.length + ' words and ' + FREE_IDS.length + ' elements appear with '
    + 'NOTHING pressed'
    + (FREE_IDS.length ? '  -> ' + FREE_IDS.slice(0, 6).join(' ') : ''));
  if (FREE_WORDS.length)
    console.log('    so these do not count as life anywhere below: "'
      + FREE_WORDS.slice(0, 4).join('", "') + '"');

  /* *** AND IS ANYTHING COVERING THEM. *** "Dead handler" and "covered by something
     else" look identical from outside and have completely different fixes. RUN found
     exactly this once already: #daycard was inset:0 and sat over all eight direction
     buttons, so 544 presses moved him zero cells and every walk number the fleet had
     quoted came from a harness that cleared a card he could not clear. So ask the
     document what is actually on top at the point a finger lands. */
  const cover = await d.fr.evaluate(list => {
    return list.map(f => {
      if (!f.el) return null;
      const vw = document.documentElement.clientWidth;
      const vh = document.documentElement.clientHeight;
      const off = (f.el.x < 0 || f.el.y < 0 || f.el.x > vw || f.el.y > vh);
      const top = document.elementFromPoint(f.el.x, f.el.y);
      if (!top) return { top: off ? 'OFF THE VIEWPORT' : 'NOTHING AT THAT POINT',
                         offscreen: off, at: [Math.round(f.el.x), Math.round(f.el.y)],
                         viewport: [vw, vh] };
      const want = f.el.id ? document.getElementById(f.el.id) : null;
      const itIs = want && (top === want || want.contains(top) || top.contains(want));
      const r = top.getBoundingClientRect();
      const cs = getComputedStyle(top);
      return { top: (top.id ? '#' + top.id : '<' + top.tagName.toLowerCase() + '>'),
               reaches: !!itIs, z: cs.zIndex, pos: cs.position,
               at: [Math.round(f.el.x), Math.round(f.el.y)], viewport: [vw, vh],
               w: Math.round(r.width), h: Math.round(r.height) };
    });
  }, found);
  found.forEach((f, i) => { f.cover = cover[i]; });

  const results = [];
  for (const f of found) {
    if (!f.el) { results.push({ ...f, verdict: 'NOT ON SCREEN' }); continue; }
    const rounds = [];
    for (let press = 1; press <= 2; press++) {
      const before = await snap();
      await d.page.mouse.click(f.el.x, f.el.y);
      await d.page.waitForTimeout(900);
      const after = await snap();
      /* SUBTRACT WHAT THE SURFACE DOES BY ITSELF */
      const newIds = after.ids.filter(i => before.ids.indexOf(i) < 0 && FREE_IDS.indexOf(i) < 0);
      const goneIds = before.ids.filter(i => after.ids.indexOf(i) < 0);
      const newWords = after.words.filter(w => before.words.indexOf(w) < 0 && FREE_WORDS.indexOf(w) < 0);
      const goneWords = before.words.filter(w => after.words.indexOf(w) < 0);
      rounds.push({ press, newIds, goneIds,
                    newWords: newWords.slice(0, 6), nNew: newWords.length,
                    goneWords: goneWords.slice(0, 4), nGone: goneWords.length });
      /* put the screen back so the next control is pressed from the same place */
      await d.fr.evaluate(() => {
        for (const sel of ['#buildpanel', '#standcard', '#rungcard', '#cbclose']) {
          const el = document.querySelector(sel);
          if (el && el.id === 'cbclose') { el.click(); continue; }
          if (el) el.style.display = 'none';
        }
      });
      await d.page.waitForTimeout(250);
    }
    /* ALIVE means WORDS MOVED, on at least one of the two presses. Not pixels, not
       a vanished card: a card vanishing is the close-button reading QUESTS killed. */
    const alive = rounds.some(r => r.nNew > 0);
    results.push({ ...f, rounds, verdict: alive ? 'ALIVE' : 'NOTHING MOVED' });
  }

  const errs = d.errs.slice();
  await d.close();

  console.log('');
  console.log('SEVEN CONTROLS ON THE FIRST SCREEN, PRESSED TWICE EACH');
  console.log('  (alive = some TEXT appeared that was not there before; a card that');
  console.log('   merely vanished is the close-button reading, and does not count)');
  console.log('');
  let dead = 0, live = 0, absent = 0;
  for (const r of results) {
    if (r.verdict === 'NOT ON SCREEN') { absent++;
      console.log('  ' + r.says.padEnd(11) + ' NOT ON SCREEN        (' + r.who + ')');
      continue; }
    if (r.verdict === 'ALIVE') live++; else dead++;
    const e = r.el;
    console.log('  ' + r.says.padEnd(11) + ' ' + r.verdict.padEnd(14)
      + (e.id ? '#' + e.id : '<' + e.tag + '>').padEnd(12)
      + e.w + 'x' + e.h + '  cursor:' + e.cursor
      + (r.expect && e.id && ('#' + e.id) !== r.expect ? '   [NOT ' + r.expect + ']' : ''));
    if (r.cover)
      console.log('        at ' + (r.cover.at ? r.cover.at.join(',') : '?')
        + ' of a ' + (r.cover.viewport ? r.cover.viewport.join('x') : '?')
        + ' screen, the finger lands on ' + r.cover.top
        + (r.cover.reaches ? '  (that IS the control)'
           : r.cover.offscreen ? '   *** THE CONTROL IS DRAWN OFF THE SCREEN ***'
           : '   *** SOMETHING ELSE IS ON TOP: ' + r.cover.w + 'x' + r.cover.h
             + ', position ' + r.cover.pos + ', z ' + r.cover.z + ' ***'));
    for (const rd of r.rounds)
      console.log('        press ' + rd.press + ': ' + rd.nNew + ' new words, '
        + rd.nGone + ' gone'
        + (rd.newIds.length ? ', new on screen: ' + rd.newIds.slice(0, 5).join(' ') : '')
        + (rd.nNew ? '  e.g. "' + rd.newWords[0] + '"' : ''));
  }
  console.log('');
  console.log('  ALIVE ' + live + '   NOTHING MOVED ' + dead + '   NOT ON SCREEN ' + absent);
  console.log('  errors during the walk: ' + errs.length
    + (errs.length ? '  first: ' + errs[0] : ''));
  return { file: opts && opts.alpha ? 'alpha' : 'baked demo',
           live, dead, absent, results };
}

(async () => {
  /* BOTH FILES. The tip is what he is served; the baked one is what the committed
     demo still holds. Two true answers to one question is the finding. */
  const only = process.argv[2];
  const tip = await sweep({ alpha: true });
  if (only === '--alpha') process.exit(0);
  const baked = await sweep({});
  console.log('');
  console.log('='.repeat(68));
  console.log('  THE SAME SEVEN, ON BOTH FILES');
  console.log('='.repeat(68));
  const by = r => { const m = {}; for (const x of r.results) m[x.says] = x.verdict; return m; };
  const A = by(tip), B = by(baked);
  for (const s of SEVEN) {
    const a = A[s.says] || '?', b = B[s.says] || '?';
    console.log('  ' + s.says.padEnd(11) + ' alpha: ' + a.padEnd(14)
      + ' baked demo: ' + b.padEnd(14) + (a !== b ? '  <-- THEY DISAGREE' : ''));
  }
  console.log('');
  console.log('  alpha      ALIVE ' + tip.live + '  NOTHING MOVED ' + tip.dead
    + '  NOT ON SCREEN ' + tip.absent);
  console.log('  baked demo ALIVE ' + baked.live + '  NOTHING MOVED ' + baked.dead
    + '  NOT ON SCREEN ' + baked.absent);
  process.exit(0);
})().catch(e => { console.log('PROBE THREW: ' + e.message); process.exit(1); });
