#!/usr/bin/env node
/* VOTE TAB GATE (8/7/26, WORLD lane).
 *
 *   "Are u gonna have me hunt for the changes or ur gonna put them in a voting tab"
 *                                                              -- Paolo, 8/7/26
 *
 * FIVE TURNS IN A ROW I ended by telling him to open the CITY tab and thumb thirty-one new
 * icons. The CITY tab is the city BUILDER: the icons are scattered over a map he has to
 * navigate, at play size, with no thumbs on them and no way to say anything about one. That
 * is not a judging surface, it is a scavenger hunt with my work hidden in it -- and "he
 * never digs in files, present everything, never tell him to go find something" is the
 * first line of how he works.
 *
 * There were already sixteen judge pages here and every one is reached LIFE tab -> hub ->
 * page. Three taps and a hub is still hunting. So VOTE is a TOP-LEVEL tab, it is FIRST in
 * the row because it is the thing waiting on him, and it opens on what has no verdict yet.
 *
 * WHAT THIS PROVES, and every check is a way the tab could quietly stop working:
 *   1. THE CHIP AND THE PANEL BOTH EXIST, and the chip is FIRST -- a voting tab buried at
 *      the end of eleven others is the same hunt in a smaller room.
 *   2. IT POINTS AT A REAL PAGE that exists on disk and is published by Pages.
 *   3. THE PAGE HAS THE WHOLE VERDICT WORKFLOW: thumbs per item, a comment per item, a
 *      GLOBAL comment box, SUN MODE, and export as .txt and never .json.
 *   4. IT IS NOT EMPTY AND NOT STALE: every hero in the bank appears exactly once, so a
 *      new district cannot ship without landing in front of him.
 *   5. THE QUEUE IS DERIVED FROM DECLARED VERDICTS. A verdict is `@VERDICT <district> ...`
 *      and nothing else. Parsing his prose failed twice in one day -- it missed
 *      "Chapel - 85 both" (no percent sign) and invented rulings for `mountain` and
 *      `suburb` out of "70.1% of every mountain plot", a sentence about a bug that reads
 *      exactly like a score.
 *   6. THE LOOP CLOSES: the page's own export emits `@VERDICT` lines, so his .txt drops
 *      straight back into records/ and the queue shrinks by itself.
 *
 *   node gates/vote_tab_gate.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.dirname(__dirname);
process.chdir(ROOT);

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

const ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html';
const PAGE = 'slices/BOHEMIA_VOTE_CURRENT.html';
const BANK = 'banks/BOHEMIA_DISTRICT_HERO_CANDIDATES_7_23_26.txt';

ok('the alpha exists', fs.existsSync(ALPHA));
ok('the VOTE page exists (' + PAGE + ')', fs.existsSync(PAGE));
if (!fs.existsSync(ALPHA) || !fs.existsSync(PAGE)) {
  console.log('VOTE TAB GATE: ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1);
}
const alpha = fs.readFileSync(ALPHA, 'utf8');
const page = fs.readFileSync(PAGE, 'utf8');

// ---- 1: the chip and the panel, and the chip is FIRST -------------------------------
const chips = [...alpha.matchAll(/<div class="tab[^"]*" data-p="([a-z]+)"/g)].map(m => m[1]);
ok('there is a VOTE tab chip', chips.includes('vote'));
ok('VOTE is the FIRST tab, not buried behind eleven others (order: ' +
   chips.slice(0, 4).join(' ') + ' ...)', chips[0] === 'vote');
ok('there is a VOTE panel wired to it', /id="p-vote"/.test(alpha));

// ---- 2: it points at the real page, and Pages publishes it --------------------------
const m = /id="p-vote"[^>]*>\s*<iframe[^>]*data-src="([^"]+)"/.exec(alpha);
ok('the VOTE panel loads a page', !!m);
if (m) {
  ok('it loads the VOTE page by name (' + m[1] + ')', m[1] === 'BOHEMIA_VOTE_CURRENT.html');
  ok('that file is in slices/, which is what Pages publishes',
     fs.existsSync(path.join('slices', m[1])));
}

// ---- 3: the whole verdict workflow, per the law ------------------------------------
ok('thumbs on every item (yes / could be better / no)',
   /data-v="up"/.test(page) && /data-v="cbb"/.test(page) && /data-v="down"/.test(page));
ok('a comment box per item', /class="note"/.test(page));
ok('a GLOBAL comment box at the bottom', /id="global"/.test(page) && /<footer/.test(page));
ok('SUN MODE for daylight', /id="sun"/.test(page) && /body\.sun/.test(page));
ok('it exports .txt and never .json',
   /\.txt'/.test(page) && /text\/plain/.test(page) && !/application\/json/.test(page));

// ---- 4: not empty, not stale -- every hero appears exactly once ----------------------
const bank = JSON.parse(fs.readFileSync(BANK, 'utf8'));
const districts = [...new Set(bank.heroes.filter(h => h.b64).map(h => h.district))];
// [a-z]+ COULD NOT SEE AN UNDERSCORE. arterial_x was on the page all along and this
// counted 59 of 60 -- and worse, the same class of pattern in the tool and in
// bohemia_demo_blockers.py would have read "@VERDICT arterial_x YES" as a verdict on
// `arterial`, silently attaching his ruling to the wrong district. Names are [a-z0-9_].
const onPage = [...page.matchAll(/class="card" data-d="([a-z0-9_]+)"/g)].map(x => x[1]);
const missing = districts.filter(d => !onPage.includes(d));
const dupes = onPage.filter((d, i) => onPage.indexOf(d) !== i);
ok('every district in the hero bank is on the page (' + onPage.length + '/' + districts.length + ')' +
   (missing.length ? ' — missing ' + missing.slice(0, 5).join(', ') : ''), missing.length === 0);
ok('and none of them twice' + (dupes.length ? ' — ' + [...new Set(dupes)].join(', ') : ''),
   dupes.length === 0);
// AN EMPTY QUEUE IS THE GOAL, NOT A FAILURE. This read "there is actually something
// waiting on him" and went RED on 8/11 the moment he judged all 59 -- a gate that
// demands he permanently owe us a verdict, which is backwards and is exactly what
// EVERYTHING IS A THUMB (8/9) forbids. What must hold is that the page tells the TRUTH
// about which state it is in: work waiting, or caught up and saying so.
ok('the page is honest about the queue: either work is waiting, or it says he is caught up',
   /class="tag new"/.test(page) || /You are all caught up/.test(page));

// ---- 5 + 6: declared verdicts in, declared verdicts out ------------------------------
const tool = fs.readFileSync('tools/bohemia_vote_tab.py', 'utf8');
ok('the queue is derived from DECLARED @VERDICT lines, not parsed out of prose',
   /@VERDICT/.test(tool) && /DECLARED/.test(tool));
ok('the page exports the SAME @VERDICT shape, so his .txt drops straight back in',
   /@VERDICT/.test(page));

// his four 8/4 approvals must be recognised, or the tab asks him to re-judge settled work
const civics = 'records/BOHEMIA_VERDICTS_CIVICS_8_4_26.txt';
ok('his 8/4 approvals are declared where the tab can read them', fs.existsSync(civics) &&
   ['cityhall', 'courthouse', 'terminal', 'chapel']
     .every(d => new RegExp('@VERDICT\\s+' + d + '\\b').test(fs.readFileSync(civics, 'utf8'))));
const judgedOnPage = [...page.matchAll(/data-d="([a-z0-9_]+)"[\s\S]{0,220}?tag judged/g)].map(x => x[1]);
ok('and they show as already judged rather than back in the queue (' +
   judgedOnPage.sort().join(' ') + ')',
   ['chapel', 'cityhall', 'courthouse', 'terminal'].every(d => judgedOnPage.includes(d)));

const waiting = (page.match(/class="tag new"/g) || []).length;
console.log('VOTE TAB GATE: ' + pass + ' passed, ' + fail + ' failed  (VOTE is tab #1 · ' +
            waiting + ' waiting on him · ' + judgedOnPage.length + ' already judged)');
process.exit(fail ? 1 : 0);
