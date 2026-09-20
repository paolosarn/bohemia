/* ============================================================================
   WHO SAYS THIS, WITH WHAT FACE, STANDING WHERE   (FACTIONS lane, 9/20/26)

   RULE 19(c), Paolo 9/20: "It has to be people, characters, items to pick up,
   locations to go, text coming from people's voice, and when they speak it shows
   the character portrait." -- no player-facing sentence outside the phone without
   a named speaker and their portrait on screen, and EVERY LANE ANSWERS THE THREE
   COLUMNS BEFORE IT SHIPS A SENTENCE.

   This lane has shipped seventeen rows and most of them talk. So before anything
   else goes in, the three columns get answered for the sentences ALREADY THERE,
   measured on the glass rather than read off the source. Rule 14(g): never report
   a break you have not reproduced on the glass.

   WHAT IT ASKS, in one boot of the one driver:

     A  THE DOOR       what is on the screen before he touches anything, and
                       whether it is over the canvas (a pop-up) or beside it
     B  THE MOUTH      for every visible sentence: is a speaker named next to it,
                       is any face painted anywhere on the screen
     C  THE SENTENCES  this lane's own writers, called, and what they say
     D  THE FACE PIPE  what portrait machinery the city frame can actually reach

   IT REPORTS AND DOES NOT JUDGE. A sentence with no mouth is not automatically a
   defect -- rule 19(c) gives it three legal homes (a mouth, the phone, or not
   shipping) -- and which one it takes is a decision, not a measurement. This tool
   only makes the decision possible by saying what is true right now.

   node tools/bohemia_who_says_this.js [--file BOHEMIA_ALPHA_0_9.html]
   ========================================================================== */
'use strict';
const D = require('./bohemia_drive_the_demo.js');

const ARG = process.argv.slice(2);
const FILE = (ARG.indexOf('--file') >= 0) ? ARG[ARG.indexOf('--file') + 1] : 'BOHEMIA_DEMO.html';

/* THIS LANE'S SENTENCE WRITERS, each with the argument the game itself hands it.
   A writer that needs the world to be in a particular state says so in `needs`
   rather than being called cold and reported as silent -- a function that returns
   '' because nobody is standing there has not been measured, it has been skipped,
   and this lane has shipped that mistake once already (a cache that answered null
   twice scored "same" and looked exactly like a pass). */
const WRITERS = [
  ['trackSay',        'the ground says who came past', 'street line (#packline)'],
  ['ctAgainstSay',    'somebody steps into your way',  'street line (#packline)'],
  ['minesLine',       'what a faction s ground makes', 'the day card'],
  ['ctRentLine',      'what this block takes tonight', 'the standing card'],
  ['ctJoinersLine',   'who would come with you',       'the standing card'],
  ['ctBasesWhyNone',  'why nobody runs with anybody',  'the outfit panel'],
  ['partiesLine',     'who is out on the valley',      'the travel map'],
  ['ctBlocked',       '(not a sentence: who holds a cell)', '-']
];

function head(t) { console.log('\n' + t + '\n' + '='.repeat(t.length)); }

(async () => {
  let d = null;
  try {
    d = await D.open({ file: FILE, keepCards: true });

    /* ---- A. THE DOOR ---------------------------------------------------- */
    head('A. THE DOOR -- what is on his screen before he touches anything');
    /* WAIT FOR THE CARD BEFORE PHOTOGRAPHING THE DOOR. The first run of this tool
       snapshotted the screen the beat before #daycard mounted and reported "the
       glass is reachable, nothing pops up" -- a clean bill of health for a card
       that was about to cover the whole screen. That is trap 2 in the one driver's
       own header wearing the opposite coat, and it is the reason this waits. */
    await d.fr.evaluate(() => new Promise((res) => {
      const t0 = Date.now();
      const tick = () => {
        const el = document.getElementById('daycard');
        if (el && getComputedStyle(el).display !== 'none') return res(true);
        if (Date.now() - t0 > 12000) return res(false);
        setTimeout(tick, 400);
      };
      tick();
    }));
    const door = await d.fr.evaluate(() => {
      const c = document.querySelector('canvas');
      const cb = c ? c.getBoundingClientRect() : null;
      /* WHAT IS OVER THE GLASS is the only honest test of "pops up": a card that
         covers the middle of the canvas is a card he has to get past, whatever it
         is called in the source. elementFromPoint is the finger's own answer. */
      const mid = cb ? document.elementFromPoint(cb.x + cb.width / 2, cb.y + cb.height / 2) : null;
      const blocks = [];
      const seen = {};
      for (const el of Array.from(document.querySelectorAll('div,p,span,button'))) {
        const st = getComputedStyle(el);
        if (st.display === 'none' || st.visibility === 'hidden' || +st.opacity === 0) continue;
        const r = el.getBoundingClientRect();
        if (r.width < 20 || r.height < 10) continue;
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (!t || t.length < 3) continue;
        /* only the element that OWNS the words, not every ancestor that contains them */
        if (el.children.length > 3) continue;
        if (seen[t]) continue; seen[t] = 1;
        const over = !!(cb && r.x < cb.x + cb.width && r.x + r.width > cb.x
                     && r.y < cb.y + cb.height && r.y + r.height > cb.y);
        blocks.push({ id: el.id || '', cls: el.className || '', over,
                      area: Math.round(r.width * r.height), t: t.slice(0, 110) });
      }
      blocks.sort((a, b) => b.area - a.area);
      return { eats: mid ? (mid.tagName + (mid.id ? '#' + mid.id : '')) : 'nothing',
               n: blocks.length, blocks: blocks.slice(0, 22) };
    });
    console.log('the finger lands on: ' + door.eats
      + (door.eats.indexOf('CANVAS') === 0 ? '   (the glass is reachable)'
                                           : '   <- A CARD IS EATING THE TAP'));
    console.log(door.n + ' blocks of words on screen at the door. the biggest:');
    for (const b of door.blocks)
      console.log('  ' + (b.over ? 'OVER GLASS' : 'beside    ') + '  '
        + String(b.area).padStart(7) + 'px  ' + (b.id ? '#' + b.id + ' ' : '') + '"' + b.t + '"');

    /* ---- B. THE MOUTH --------------------------------------------------- */
    head('B. THE MOUTH -- is any face painted anywhere on his screen');
    const face = await d.fr.evaluate(() => {
      const out = [];
      for (const cv of Array.from(document.querySelectorAll('canvas'))) {
        const r = cv.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        const st = getComputedStyle(cv);
        const vis = st.display !== 'none' && st.visibility !== 'hidden' && +st.opacity > 0;
        let painted = null;
        /* A CANVAS THAT EXISTS IS NOT A FACE THAT IS THERE. A blank face is the
           defect the portrait law is named after, so the pixels get counted. */
        try {
          const g = cv.getContext('2d');
          const w = Math.min(cv.width, 64), h = Math.min(cv.height, 64);
          if (w > 0 && h > 0) {
            const px = g.getImageData(0, 0, w, h).data;
            let on = 0;
            for (let i = 3; i < px.length; i += 4) if (px[i] > 8) on++;
            painted = Math.round(100 * on / (px.length / 4));
          }
        } catch (_e) { painted = -1; }
        out.push({ id: cv.id || '(no id)', w: cv.width, h: cv.height, vis,
                   inkPct: painted, box: Math.round(r.width) + 'x' + Math.round(r.height) });
      }
      return out;
    });
    for (const f of face)
      console.log('  ' + (f.vis ? 'shown ' : 'hidden') + '  ' + f.id.padEnd(14)
        + ' ' + String(f.w + 'x' + f.h).padEnd(10) + ' on screen ' + f.box.padEnd(10)
        + ' ink ' + (f.inkPct < 0 ? 'unreadable' : f.inkPct + '%'));

    /* ---- C. THIS LANE'S SENTENCES --------------------------------------- */
    head('C. THIS LANE\'S OWN SENTENCES -- called, on the real world, and what they say');
    const said = await d.fr.evaluate((WRITERS) => {
      const out = [];
      for (const [fn, what, home] of WRITERS) {
        const row = { fn, what, home };
        if (typeof window[fn] !== 'function' && typeof eval('typeof ' + fn) !== 'function') {
          row.reach = 'NOT REACHABLE from the frame';
          out.push(row); continue;
        }
        row.reach = 'reachable';
        try {
          let v = null;
          if (fn === 'minesLine') {
            /* ASK EVERY SEAT, NOT THE FIRST ONE. A writer that returns '' because
               the faction it was handed happens to mine nothing has not been
               measured, it has been skipped -- and an empty string reads exactly
               like a pass. This lane shipped that mistake once already. */
            const s = turfSeats() || [];
            const got = [];
            for (const seat of s) { const t = minesLine(seat.faction); if (t) got.push(seat.faction + ': ' + t); }
            v = got.length ? (got.length + ' of ' + s.length + ' seats answer. e.g. ' + got[0])
                           : '(asked all ' + s.length + ' seats and every one was silent)';
          } else if (fn === 'partiesLine') {
            const t = partiesLine();
            v = t ? t : '(silent with ' + ((partiesAll() || []).length) + ' parties on the map)';
          } else if (fn === 'ctRentLine') {
            v = ctRentLine(typeof ctRentHere === 'function' ? ctRentHere() : null);
          } else if (fn === 'ctJoinersLine') {
            v = ctJoinersLine(typeof ctJoinersHere === 'function' ? ctJoinersHere() : null);
          } else if (fn === 'ctBlocked') {
            v = '(predicate, returns a person id)';
          } else if (fn === 'trackSay' || fn === 'ctAgainstSay') {
            /* THESE WRITE THE LINE RATHER THAN RETURNING IT, so the measurement is
               the line itself, read after the call. */
            const l = document.getElementById('packline');
            const before = l ? l.textContent : '(no line element)';
            if (fn === 'ctAgainstSay') ctAgainstSay(); else { window._lastTrack = ''; trackSay(); }
            const after = l ? l.textContent : '(no line element)';
            v = after || '(said nothing here: ' + (before ? 'line held "' + before + '"' : 'line empty') + ')';
            if (fn === 'ctAgainstSay' && typeof ctAgainstClear === 'function') ctAgainstClear();
          } else {
            v = eval(fn + '()');
          }
          row.says = (v === null || v === undefined) ? '(nothing right here)' : String(v);
        } catch (e) { row.says = 'THREW: ' + String(e.message).slice(0, 70); }
        out.push(row);
      }
      /* AND THE ONE THAT IS NOT A FUNCTION: the collector who comes to the door. */
      try {
        const v = (typeof owedVisitDue === 'function') ? owedVisitDue() : null;
        out.push({ fn: 'owedVisitDue', what: 'the lender who visits the heir',
                   home: 'the wake card', reach: 'reachable',
                   says: v ? JSON.stringify(v).slice(0, 200) : '(nobody due right now)' });
      } catch (e) {
        out.push({ fn: 'owedVisitDue', what: 'the lender who visits the heir',
                   home: 'the wake card', reach: 'THREW: ' + String(e.message).slice(0, 60), says: '-' });
      }
      return out;
    }, WRITERS);
    for (const r of said) {
      console.log('  ' + r.fn.padEnd(16) + ' ' + r.reach);
      console.log('      lands on : ' + r.home);
      console.log('      says     : ' + (r.says || '-'));
    }

    /* ---- D. THE FACE PIPE ------------------------------------------------ */
    head('D. THE FACE PIPE -- what portrait can the city frame actually reach');
    const pipe = await d.fr.evaluate(() => {
      const src = document.documentElement.outerHTML;
      const has = (s) => src.indexOf(s) >= 0;
      return {
        decoder: typeof decodePlayerFrame === 'function',
        listener: has('BOHEMIA_CITY_PLAYER'),
        target: !!document.getElementById('modeFace'),
        localRender: typeof renderFace === 'function' || typeof speakingPortrait === 'function',
        /* how many faces the pipe can carry: the message shape is the answer */
        msgCarries: (src.match(/m\.portrait/g) || []).length
      };
    });
    console.log('  a decoder in the city frame      : ' + pipe.decoder);
    console.log('  a listener for a face from above : ' + pipe.listener);
    console.log('  somewhere to draw it (#modeFace) : ' + pipe.target);
    console.log('  a face RENDERER in this frame    : ' + pipe.localRender
      + (pipe.localRender ? '' : '   <- the city cannot DRAW a face, only receive one'));
    console.log('  places the message names a face  : ' + pipe.msgCarries
      + (pipe.msgCarries === 1 ? '   <- ONE slot: the player\'s own, and nobody else\'s' : ''));

    /* ---- E. THE CARDS ---------------------------------------------------- */
    head('E. THE CARDS -- which of this lane\'s surfaces come up by themselves');
    /* WATCHED, NOT ASKED ONCE. A card that opens one beat after the sweep is a
       card the sweep says does not exist -- the exact trap the one driver was
       written for ("it used to stop at the first pass that found nothing"). */
    const watch = await d.fr.evaluate(() => new Promise((res) => {
      const seen = { daycard: null, ctcard: null };
      const t0 = Date.now();
      const tick = () => {
        for (const id of ['daycard', 'ctcard']) {
          const el = document.getElementById(id);
          if (!el) continue;
          const st = getComputedStyle(el);
          const up = st.display !== 'none' && st.visibility !== 'hidden';
          if (up && !seen[id]) seen[id] = { at: Date.now() - t0, cls: el.className,
            says: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 140) };
        }
        if (Date.now() - t0 > 24000) return res(seen);
        setTimeout(tick, 500);
      };
      tick();
    }));
    for (const id of ['daycard', 'ctcard'])
      console.log('  #' + id.padEnd(9) + (watch[id]
        ? 'CAME UP BY ITSELF at ' + (watch[id].at / 1000).toFixed(1) + 's   "' + watch[id].says + '"'
        : 'never came up on its own in 24 s of standing still'));

    /* AND THE ONE HE OPENS. IT IS THE SAME ELEMENT: cardShow() targets #daycard,
       so the wake card, the night card and the STANDING panel are one surface and
       the only difference between a pop-up and a panel is WHO CALLED IT. That
       matters for rule 19(a), which kills the unbidden call and not the element. */
    const opened = await (async () => {
      /* CLEAR THE CARD FIRST OR THIS MEASURES THE CARD. The first run tapped
         STANDING through a #daycard at inset:0 and came back "IT DID NOT OPEN" --
         a dead button reported on a button nobody had reached. Rule 14(g). */
      await d.clearCards();
      const before = await d.fr.evaluate(() => {
        const c = document.getElementById('daycard');
        return c ? getComputedStyle(c).display : '(no element)'; });
      await d.tapEl('#rungbtn');
      await d.page.waitForTimeout(1600);
      return d.fr.evaluate((was) => {
        const c = document.getElementById('daycard');
        if (!c) return { was, now: '(no element)', says: '' };
        return { was, now: getComputedStyle(c).display,
                 says: (c.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 300),
                 /* rule 14(h): a dead button and a close button look the same, so
                    the test is that the panel is OPEN and its words are there. */
                 open: getComputedStyle(c).display !== 'none' };
      }, before);
    })();
    console.log('  tapping ' + '◆' + ' STANDING: #daycard ' + opened.was + ' -> ' + opened.now
      + (opened.open ? '   (the same surface, opened on purpose)' : '   <- IT DID NOT OPEN'));
    if (opened.says) console.log('  it says: "' + opened.says + '"');

    /* ---- F. THE MOUTH THAT ALREADY EXISTS --------------------------------- */
    head('F. THE MOUTH THAT ALREADY EXISTS -- and whether anybody can reach it');
    const mouth = await d.fr.evaluate(() => {
      const src = document.documentElement.outerHTML;
      const card = document.getElementById('ctcard');
      let near = null, adj = null, n = 0;
      try { adj = (typeof ctAdjacent === 'function') ? ctAdjacent() : null; } catch (_e) {}
      /* HOW FAR IS THE NEAREST PERSON, in the unit he walks in. "He did not see a
         single human being" (9/15) is a distance, and a distance is measurable.
         ASKED THROUGH THE GAME'S OWN PAIR -- ctEveryone() and ctAt(), which is
         exactly what ctAdjacent() uses to decide whether TALK appears. Reaching
         for pplGrid() here would have measured a heads-per-block grid with no
         people in it and reported "could not measure", which looks like an
         answer. Sixth wrong shape this lane has caught before running. */
      try {
        const all = ctEveryone() || [];
        let best = 1e9;
        for (const p of all) {
          const at = ctAt(p); if (!at) continue; n++;
          const dd = Math.abs(at[0] - hx) + Math.abs(at[1] - hy);   /* ctAdjacent's own metric */
          if (dd < best) best = dd;
        }
        near = best < 1e9 ? best : null;
      } catch (_e) {}
      return {
        exists: !!card,
        hasWho: src.indexOf('#ctcard .who') >= 0,
        hasSay: src.indexOf('#ctcard .say') >= 0,
        /* A FACE ON THE TALKING CARD: a canvas inside it is the only way one gets
           drawn, since the city frame has no face renderer of its own. */
        faceInCard: card ? card.querySelectorAll('canvas').length : -1,
        adjacent: !!adj, nearestCells: near, peopleCounted: n,
        talkBtn: (() => { const b = document.getElementById('cttalk');
          return b ? getComputedStyle(b).display : '(no button)'; })()
      };
    });
    console.log('  a talking card exists            : ' + mouth.exists);
    console.log('  it names the speaker (.who)      : ' + mouth.hasWho);
    console.log('  it carries their line (.say)     : ' + mouth.hasSay);
    console.log('  a face drawn inside it           : '
      + (mouth.faceInCard === 0 ? 'NONE -- the speaker has a name and no face' : mouth.faceInCard));
    console.log('  the TALK button right now        : ' + mouth.talkBtn
      + (mouth.talkBtn === 'none' ? '   (it only exists when somebody is beside you)' : ''));
    console.log('  anybody standing beside him      : ' + mouth.adjacent);
    console.log('  nearest person the city knows    : '
      + (mouth.nearestCells === null ? 'could not measure'
         : mouth.nearestCells + ' cells away, of ' + mouth.peopleCounted + ' people placed'));

    console.log('\npage errors while being asked: ' + d.errs.length
      + (d.errs.length ? '  ' + d.errs.slice(0, 3).join(' | ') : ''));
  } catch (e) {
    console.log('COULD NOT DRIVE IT: ' + String(e.message).slice(0, 200));
    process.exitCode = 1;
  } finally { if (d) { try { await d.close(); } catch (_e) {} } }
  /* flush before exiting: process.exit() drops buffered stdout when a caller
     redirects this to a file, which cost this lane four confusing runs. */
  process.stdout.write('', () => process.exit(process.exitCode || 0));
})();
