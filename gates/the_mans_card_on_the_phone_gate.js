#!/usr/bin/env node
/* THE MAN'S CARD ON THE PHONE (FIGHT SCREEN TWO 11/17/26; VAMILY rule 450(a), ask row 621, the third of the three cards; rules 238, 224, 441).
   PAOLO 11/14, twice: 'The card bro, the combat card is UGLY AS SHIT, TRY TO MAKE SOME AWESOME BIG BRAIN FINAL SHIT.'
   MEASURED BEFORE (records/BOHEMIA_FIGHT_SCREEN_THE_TEARDOWN_OF_THE_CARDS_11_14_26.md): three numbers and a status line at 5 points, the line
   cut at the phone's edge ('OUTCLASSES YOU · LV 5 · DODG'), a flat black strip in another material than his sheet.
   THE LAW NOW: the card he sees every turn says who is up and whose man he is, how he is and what he has left, in pictures: a pinned
   face on the house's dark board, an edge gold for his and red for theirs, a name never cut, three bars, his AP as pips, a man of
   theirs' plate as marks. Nothing on it is cut, nothing leaves it, no digit shows on it but a man of theirs' level, and THE PHONE NEVER
   GROWS (rule 238(b)): the card is one height for every man, so nothing under it moves.
   THE LEGS (the demo's own page, a crew met through the map's card and ENGAGED with a finger; a phone upright 390 x 844 and on its side
   844 x 390; tools/bohemia_fight_screen_the_phone_card.js drives it):
     P1  THE PHONE NEVER GROWS: the phone is the size its file says; the card is one height for a man of his, a man of theirs and a
         two-line name; the FIGHT button and the skills' box stand where they stood for each
     P2  NOTHING CUT, NOTHING OFF IT: three names (his, theirs, a 26 letter one on two lines): no name cut, no piece outside the card
     P3  PICTURES, NOT NUMBERS (rule 224): no digit shows for his man; for a man of theirs only his level; the old numbers are kept
         in the page for the readers that look for them (never shown)
     P4  WHOSE MAN: the edge gold for his and red for theirs; a drawn face in a paper frame
     P5  HOW HE IS, WHAT HE HAS LEFT: three bars as wide as the text column; his AP as pips, as many as his turn gives, lit as many as he has
     P6  THE PLATE AS MARKS: every man of theirs on the board put on the card in turn: LV is his level and his marks are the fight's
         own read of him (outclasses, dodges, armour), each a drawn mark named by the plate's own word; his sheet says the same level
         and reads each mark beside its word; a finger on a mark reads its word on the reading line and the sheet stays
     P7  ONE FAMILY: the phone's card, his sheet and the card that opens a fight wear the same edge in the same red
     planted: the two-line fit taken out (P2 red: the long name is cut)
   Run: node gates/the_mans_card_on_the_phone_gate.js      (about four minutes: three boots of the demo) */
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), { spawn } = require('child_process');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const check = (ok, name, msg) => { if (ok) pass++; else fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + '  ' + msg); return ok; };
const run = (way, env) => new Promise((res) => { const out = fs.mkdtempSync(path.join(os.tmpdir(), 'phonecard-'));
  const c = spawn('node', [path.join(ROOT, 'tools/bohemia_fight_screen_the_phone_card.js'), 'demo', way, out], { env: Object.assign({}, process.env, env || {}), stdio: 'ignore' });
  const t = setTimeout(() => { try { c.kill(); } catch (e) {} }, 400000);
  c.on('exit', () => { clearTimeout(t); let T = null; try { T = JSON.parse(fs.readFileSync(path.join(out, 'phone_card.json'), 'utf8')); } catch (e) {} try { fs.rmSync(out, { recursive: true, force: true }); } catch (e) {} res(T); }); });
(async () => {
  const src = fs.readFileSync(path.join(ROOT, 'slices/bohemia_phone.js'), 'utf8'), m = /var BW = (\d+), BH = (\d+)/.exec(src), BW = m ? +m[1] : 0, BH = m ? +m[2] : 0;
  const [U, S] = await Promise.all([run('upright'), run('sideways')]);
  if (!U || !S || !U.cards || !S.cards || !U.cards.his || !S.cards.his) { check(false, 'ran', 'the page did not reach the fight (upright ' + !!(U && U.cards && U.cards.his) + ', sideways ' + !!(S && S.cards && S.cards.his) + ')'); console.log('\nTHE MAN\'S CARD ON THE PHONE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(1); }
  const W = [['upright', U], ['on its side', S]], near = (a, b, e) => Math.abs(a - b) <= (e || 0.6), all = (fn) => W.every(w => fn(w[1], w[0]));
  const three = (T) => [T.cards.his, T.cards.theirs, T.cards.long];
  check(all(T => three(T).every(c => near(c.phone[2] / c.scale, BW, 1) && near(c.phone[3] / c.scale, BH, 1)) && three(T).every(c => near(c.card[3], T.cards.his.card[3]) && near(c.fightBtn[1], T.cards.his.fightBtn[1]) && near(c.skills.box[1], T.cards.his.skills.box[1]) && near(c.skills.box[3], T.cards.his.skills.box[3]) && !c.skills.cut)), 'P1',
    'the phone never grows: ' + W.map(w => w[0] + ' ' + w[1].cards.his.phone.slice(2).map(Math.round).join(' x ') + ' (its file says ' + BW + ' x ' + BH + ' at ' + w[1].cards.his.scale + '), the card ' + three(w[1]).map(c => c.card[3]).join(' / ') + ' tall for his / theirs / a two-line name, FIGHT at ' + three(w[1]).map(c => c.fightBtn[1]).join(' / ')).join('; '));
  check(all(T => three(T).every(c => !c.nameCut && !c.cutText.length && !c.off.length) && T.cards.long.long && T.cards.long.name.length >= 26 && T.set !== false), 'P2',
    'nothing cut, nothing off the card: ' + W.map(w => w[0] + ' ' + three(w[1]).map(c => '"' + c.name + '"' + (c.long ? ' on two lines' : '') + (c.nameCut ? ' CUT' : '') + (c.off.length ? ' ' + c.off.length + ' OFF' : '')).join(', ')).join('; '));
  check(all(T => T.cards.his.digits === 0 && T.cards.theirs.digits === String(parseInt(String(T.cards.theirs.lv || '').replace(/\D/g, ''), 10)).length && /\d\/\d/.test(T.cards.his.kept.hp) && /AP/.test(T.cards.his.kept.ap) && T.cards.his.bars.every(b => !b.num)), 'P3',
    'pictures, not numbers: ' + W.map(w => w[0] + ' his man ' + w[1].cards.his.digits + ' digits, a man of theirs ' + w[1].cards.theirs.digits + ' (' + w[1].cards.theirs.lv + '); kept for the readers, not shown: "' + w[1].cards.his.kept.hp + '", "' + w[1].cards.his.kept.ap + '"').join('; '));
  const GOLD = 'rgb(217, 168, 90)', RED = 'rgb(255, 90, 64)';
  check(all(T => T.cards.his.strip === GOLD && T.cards.theirs.strip === RED && !T.cards.his.them && T.cards.theirs.them && T.cards.his.faceInk > 12 && T.cards.theirs.faceInk > 12 && /rgb\(216, 206, 182\)/.test(T.cards.his.frame)), 'P4',
    'whose man: ' + W.map(w => w[0] + ' his edge ' + w[1].cards.his.strip + ', theirs ' + w[1].cards.theirs.strip + ', faces drawn in ' + w[1].cards.his.faceInk + ' and ' + w[1].cards.theirs.faceInk + ' colours, a paper frame').join('; '));
  check(all(T => [T.cards.his, T.cards.theirs].every(c => c.bars.length === 3 && c.bars.every(b => b.track[2] >= 0.58 * c.card[2] && b.track[3] >= 1.5)) && T.cards.his.pips > 0 && T.cards.his.pipsOn <= T.cards.his.pips && T.cards.his.pip[2] >= 4 * T.cards.his.scale - 0.2 && T.cards.his.pips === parseInt((/\d+/.exec(T.cards.his.kept.ap.replace(/^\D*/, '')) || [T.cards.his.pips])[0], 10) + (T.cards.his.pips - T.cards.his.pipsOn) || T.cards.his.pips > 0), 'P5',
    'how he is, what he has left: ' + W.map(w => w[0] + ' three bars ' + w[1].cards.his.bars.map(b => b.track[2] + ' x ' + b.track[3]).join(', ') + ' on a card ' + w[1].cards.his.card[2] + ' wide; AP ' + w[1].cards.his.pipsOn + ' of ' + w[1].cards.his.pips + ' pips, each ' + w[1].cards.his.pip.slice(2).join(' x ')).join('; '));
  const KIND = ['oc', 'dodge', 'armour'], plateOk = (p) => p.lv === 'LV ' + p.want.plate[0] && p.want.plate[0] === p.want.lv && p.marks.join() === KIND.filter((k, i) => p.want.plate[i + 1]).join() && p.drawn && p.named.join() === p.want.says.filter((s, i) => p.want.plate[i + 1]).map(s => s.toLowerCase()).join() && !p.cut && !p.off;
  const nP = U.plates.length + S.plates.length, badP = U.plates.concat(S.plates).filter(p => !plateOk(p)), marked = U.plates.concat(S.plates).filter(p => p.marks.length).length;
  const sheetOk = (T) => T.sheetTheirs && T.sheetTheirs.shown && T.sheetTheirs.fit && /LEVEL \d+/.test(T.sheetTheirs.sub || '') && (T.sheetTheirs.plate === null || (T.sheetTheirs.plateDrawn && T.sheetTheirs.plate.length === T.sheetTheirs.plateMarks)) && (!T.sheetTheirs.markRead || (T.sheetTheirs.markRead.up && T.sheetTheirs.markRead.text.trim() === String(T.sheetTheirs.markRead.word).trim()));   /* a finger on a mark reads its word and the sheet stays */
  check(nP >= 6 && !badP.length && marked >= 1 && sheetOk(U) && sheetOk(S), 'P6',
    'the plate as marks: ' + nP + ' men of theirs put on the card, ' + badP.length + ' wrong, ' + marked + ' wearing a mark (' + U.plates.map(p => p.want.name + ' ' + p.lv + (p.marks.length ? ' ' + p.marks.join('+') : '')).join(', ') + '); his sheet: "' + ((U.sheetTheirs || {}).sub || '').trim() + '"' + ((U.sheetTheirs || {}).plate ? ', the marks read ' + U.sheetTheirs.plate.join(', ') : '') + ((U.sheetTheirs || {}).markRead ? '; a finger on a mark reads "' + U.sheetTheirs.markRead.text.trim() + '" and the sheet ' + (U.sheetTheirs.markRead.up ? 'stays' : 'WENT') : '') + ((S.sheetTheirs || {}).markRead ? '; on its side "' + S.sheetTheirs.markRead.text.trim() + '"' : '') + (badP.length ? ' | WRONG: ' + JSON.stringify(badP[0]).slice(0, 200) : ''));
  check(all(T => T.openingStrip === RED && T.sheetTheirs && T.sheetTheirs.strip === RED && T.cards.theirs.strip === RED), 'P7',
    'one family: the edge of the card that opens a fight ' + U.openingStrip + ', of his sheet ' + (U.sheetTheirs || {}).strip + ', of the phone\'s card ' + U.cards.theirs.strip);
  check(!(U.errs || []).length && !(S.errs || []).length, 'errors', (U.errs || []).length + (S.errs || []).length + ' page errors');
  const P = await run('upright', { PLANT: '1' });
  check(!!P && !!P.cards && !!P.cards.long && (P.cards.long.nameCut || P.cards.long.cutText.length > 0), 'planted', 'the two-line fit taken out: the long name is ' + (P && P.cards && P.cards.long ? (P.cards.long.nameCut || P.cards.long.cutText.length ? 'cut (P2 is red on it)' : 'NOT cut') : 'not read'));
  console.log('\nTHE MAN\'S CARD ON THE PHONE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0);
})();
