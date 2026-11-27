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
     P8  THE LAST HIT ON THE CARD (FIGHT SCREEN THREE 11/20; the library's Rogue Fable IV page, rule 3): a quarter of his health and a third
         of his armour taken since his mark (the bell, or his last turn's end): his card's health and armour bars carry what is left and,
         right of it in the board's punch colour (bone), what was taken, within a point and a half of the share; fatigue carries none;
         put back, the piece is what the fight itself says was taken (a real blow before the test counts)
     P9  THE ROUNDS ON THE CARD (FIGHT SCREEN THREE 11/22; VAMILY rule 478(a): 'every gun carries its own rounds, shown on the man's card'): a
         gunman of his on the card: at the end of his AP row a cartridge for every round his gun holds (six at most), brass for each one in
         it, inside the card, the fight's own count (FIGHT.rounds), and under them a brass line, what he carries (FIGHT.carried, COMBAT FOUR's
         rule 478 count); no AP pip clipped (11/26); one spent, one fewer lit and the line shorter; the magazine at none with rounds carried,
         a RELOAD (hollow amber, never red); none left anywhere (the gun slung, his fists up), OUT: every case red and pulsing on the fight's
         beat; a man with no gun in his hands shows none; a gunman of theirs shows his after his plate
     P10 NEVER CHOPPY (FIGHT SCREEN THREE 11/26; VAMILY rule 480(c)): no work done twice. A bar moves: only the bar is painted again (the face is
         not drawn again; the AP pips and the rounds are the same nodes); his AP moves: the pips again, the face not; the man changes: his face is
         drawn; the fight's card refreshed twice with nothing changed writes nothing at all (its AP pips the same nodes, the say line's place
         untouched, no attribute, style or node written: a MutationObserver over the bar reads 0)
     P11 NOTHING TO PRESS ON THEIR TURN (FIGHT SCREEN THREE 11/26, rule 482): on a real turn of theirs the phone shows no big STRIKE or RELOAD
         (it showed their man's weapon as his STRIKE) and no 'No skills on this man yet' note (about their man): four empty wells, and the big
         row keeps its room as two empty dark wells (11/27: hiding it lifted everything under it each time the turn changed hands)
     P12 HIS TURN SPENT ON THE CARD (FIGHT SCREEN THREE 11/26): his AP spent to none, the card's AP row is spent and its empty pips go red on the
         fight's beat (dark red and hot red both read across a beat); the fight's own OUT OF ACTION POINTS badge, under the phone below the
         glass, is hidden (display none)
     P13 THE HIT LANDS ON THE CARD (FIGHT SCREEN THREE 11/27, rule 482): his man on the card loses five of his blood: the card's photo takes the
         blow once (the card's hit, its canvas playing fhHit) and is still again after; his armour alone taken: no slip
     P14 THE DRONE ON THE BIG ROW (FIGHT SCREEN THREE 11/27; ARMORY THREE's drone, rule 490): a drone of theirs in the air over his gunman on his
         turn: the phone's big row's first square is DRONE with its chance (it was a 24 point square among the skills), marked cross while its
         cross is on him, never also among the small squares; the drone gone, the square goes
     planted: the two-line fit taken out (P2 red: the long name is cut)
     planted: the last hit's drawing taken out (P8 red)
     planted: the rounds' drawing taken out (P9 red)
     planted: the card painted whole on every change (NOCHOP_PLANT, the old way: P10 red)
     planted: their turn's row drawn as his (THEIRS_PLANT: P11 red)
     planted: the slip taken out (HIT_PLANT: P13 red)
     planted: the drone left among the small squares (DRONE_PLANT: P14 red)
   Run: node gates/the_mans_card_on_the_phone_gate.js      (about nine minutes: eight boots of the demo) */
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
  const lhOk = (T) => { const L = T.lastHit; return !!L && L.want.mark && L.hp && L.arm && Math.abs(L.hp.lost - L.want.hp) <= 1.5 && Math.abs(L.hp.at - L.hp.left) <= 1.5 && (L.want.arm < 1 || Math.abs(L.arm.lost - L.want.arm) <= 1.5)
    && /rgb\(242, 234, 216\)/.test(L.hp.colour || '') && (!L.fat || !L.fat.lost) && Math.abs(L.after - (L.wantAfter < 0.4 ? 0 : L.wantAfter)) <= 1.5; };
  check(lhOk(U) && lhOk(S), 'P8', 'the last hit on the card: ' + W.map(w => { const L = w[1].lastHit; return w[0] + (L ? ' health ' + L.hp.lost + ' of ' + L.want.hp + ' at ' + L.hp.at + ' (what is left ' + L.hp.left + '), armour ' + L.arm.lost + ' of ' + L.want.arm + ', ' + L.hp.colour + ', put back: ' + L.after + ' of ' + L.wantAfter : ' none'); }).join('; '));
  const BRASS = /linear-gradient\(rgb\(255, 240, 192\)/, DRY = 'rgb(74, 20, 14)', HOT = 'rgb(224, 64, 46)';
  const rdOk = (T) => { const R = T.rounds; if (!R || !R.gun) return false; const g = R.gun, n = Math.min(g.of, 6), lit = g.of > 6 ? Math.ceil(g.left / g.of * 6) : g.left;
    const cOk = (c, want) => !want ? !c.c : c.c === want.left + '/' + want.of && c.line != null && Math.abs(c.line - 100 * want.left / want.of) <= 4;
    const full = R.full && R.full.shown && R.full.cases === n && R.full.lit === lit && R.full.n === g.left + '/' + g.of && R.full.inCard && R.full.colours.some(c => BRASS.test(c)) && R.full.apClipped === 0 && cOk(R.full, g.carry);
    const spent = R.spent && R.spent.shown && R.spent.n === R.spentWant.left + '/' + R.spentWant.of && (g.of > 6 || R.spent.lit === R.spentWant.left) && R.spent.inCard && R.spent.apClipped === 0 && cOk(R.spent, R.spentWant.carry);
    const reload = R.reload && R.reload.shown && R.reload.reload && !R.reload.dry && R.reload.lit === 0 && /reload/.test(R.reload.says || '') && R.reload.inCard;
    const dry = R.dry && R.dry.shown && R.dry.dry && !R.dry.reload && R.dry.lit === 0 && /out of rounds/.test(R.dry.says || '') && R.dry.inCard && (R.dryBeat || []).indexOf(HOT) >= 0 && (R.dryBeat || []).indexOf(DRY) >= 0;
    const none = !R.noGun || (R.noGun.card && !R.noGun.card.shown), theirs = !R.theirs || (R.theirs.card && R.theirs.card.shown && R.theirs.card.n === R.theirs.left + '/' + R.theirs.of && R.theirs.card.inCard);
    return !!(full && spent && reload && dry && none && theirs); };
  const rdSay = (T) => { const R = T.rounds || {}; if (!R.gun) return 'no gunman of his'; return R.gun.name + ' (' + R.gun.weapon + ') ' + (R.full ? R.full.lit + ' of ' + R.full.cases + ' lit, ' + R.full.says + ', the carried line ' + R.full.line + '%, AP pips clipped ' + R.full.apClipped : 'none drawn') + '; spent: ' + (R.spent ? R.spent.says : '-') + '; reload: ' + (R.reload ? R.reload.says : '-') + '; out: ' + (R.dry ? R.dry.says + ', the beat ' + [...new Set(R.dryBeat || [])].join(' / ') : '-') + '; no gun (' + (R.noGun ? R.noGun.weapon : '-') + '): ' + (R.noGun && R.noGun.card ? (R.noGun.card.shown ? 'SHOWN' : 'none') : '-') + '; theirs ' + (R.theirs ? R.theirs.name + ' ' + (R.theirs.card ? R.theirs.card.says : 'not drawn') : '-'); };
  check(rdOk(U) && rdOk(S), 'P9', 'the rounds on the card: ' + W.map(w => w[0] + ' ' + rdSay(w[1])).join(' | '));
  const ncOk = (T) => { const N = T.noChop; if (!N || !N.start || !N.bar || !N.ap || !N.fight) return false;
    return N.bar.draws === N.start.draws && N.bar.ppMarked === true && N.bar.rdMarked !== false && N.ap.draws === N.start.draws && N.ap.ppMarked === false
      && (!N.man2 || N.man2.draws > N.ap.draws) && N.fight.kept && N.fight.sayStyle && N.fight.writes === 0; };
  const ncSay = (T) => { const N = T.noChop || {}; return N.start ? 'face drawn ' + N.start.draws + ' -> a bar moved ' + (N.bar || {}).draws + ' (pips kept ' + (N.bar || {}).ppMarked + ', rounds kept ' + (N.bar || {}).rdMarked + ') -> his AP moved ' + (N.ap || {}).draws + ' (pips kept ' + (N.ap || {}).ppMarked + ') -> another man ' + (N.man2 || {}).draws + '; the fight\'s card refreshed twice unchanged: ' + (N.fight || {}).writes + ' writes ' + JSON.stringify((N.fight || {}).writesWhat || []) : 'not read'; };
  const thOk = (T) => { const W0 = T.turns && T.turns.theirs; return !!W0 && W0.theirs && W0.big === 0 && W0.bigEmpty === 2 && W0.bigShown && !W0.note && W0.live === 0; };   /* 11/27: the big row keeps its room, empty */
  const spOk = (T) => { const P0 = T.turns && T.turns.spent; return !!P0 && P0.spent && (P0.beat || []).indexOf('rgb(224, 64, 46)') >= 0 && (P0.beat || []).indexOf('rgb(74, 20, 14)') >= 0 && P0.badge === 'none'; };
  const hitOk = (T) => { const H0 = T.hit; return !!H0 && !!H0.on && H0.on.hit && H0.on.anim === 'fhHit' && H0.on.n === H0.n0 + 1 && !H0.off.hit && H0.arm.n === H0.on.n && !H0.arm.hit; };
  const drOk = (T) => { const D0 = T.drone; return !!D0 && D0.can && D0.on && D0.on.first === 'drone' && D0.on.word === 'DRONE' && /^\d+%$/.test(D0.on.chance || '') && D0.on.cross && !D0.on.small && D0.gone && !D0.gone.drone; };
  check(drOk(U) && drOk(S), 'P14', 'the drone on the big row: ' + W.map(w => w[0] + ' ' + JSON.stringify(w[1].drone || null)).join(' | '));
  check(hitOk(U) && hitOk(S), 'P13', 'the hit lands on the card: ' + W.map(w => w[0] + ' ' + JSON.stringify(w[1].hit || null)).join(' | '));
  check(thOk(U) && thOk(S), 'P11', 'nothing to press on their turn: ' + W.map(w => w[0] + ' ' + JSON.stringify((w[1].turns || {}).theirs || null)).join(' | '));
  check(spOk(U) && spOk(S), 'P12', 'his turn spent on the card: ' + W.map(w => w[0] + ' ' + JSON.stringify((w[1].turns || {}).spent || null)).join(' | '));
  check(ncOk(U) && ncOk(S), 'P10', 'never choppy, no work done twice: ' + W.map(w => w[0] + ' ' + ncSay(w[1])).join(' | '));
  check(!(U.errs || []).length && !(S.errs || []).length, 'errors', (U.errs || []).length + (S.errs || []).length + ' page errors');
  const P = await run('upright', { PLANT: '1' });
  check(!!P && !!P.cards && !!P.cards.long && (P.cards.long.nameCut || P.cards.long.cutText.length > 0), 'planted', 'the two-line fit taken out: the long name is ' + (P && P.cards && P.cards.long ? (P.cards.long.nameCut || P.cards.long.cutText.length ? 'cut (P2 is red on it)' : 'NOT cut') : 'not read'));
  const PL = await run('upright', { LASTHIT_PLANT: '1' });
  check(!!PL && !!PL.lastHit && !lhOk(PL), 'planted', 'the last hit\'s drawing taken out: P8 reads ' + (PL && PL.lastHit ? 'health ' + PL.lastHit.hp.lost + ' of ' + PL.lastHit.want.hp : 'nothing') + ' (red)');
  const PR = await run('upright', { ROUNDS_PLANT: '1' });
  check(!!PR && !!PR.rounds && !rdOk(PR), 'planted', 'the rounds\' drawing taken out: P9 reads ' + (PR && PR.rounds && PR.rounds.full ? (PR.rounds.full.shown ? PR.rounds.full.lit + ' lit' : 'no cartridges') : 'nothing') + ' (red)');
  const PD = await run('upright', { DRONE_PLANT: '1' });
  check(!!PD && !drOk(PD), 'planted', 'the drone left among the small squares: P14 reads ' + JSON.stringify(PD ? PD.drone : null) + ' (red)');
  const PH = await run('upright', { HIT_PLANT: '1' });
  check(!!PH && !hitOk(PH), 'planted', 'the slip taken out: P13 reads ' + JSON.stringify(PH ? PH.hit : null) + ' (red)');
  const PT = await run('upright', { THEIRS_PLANT: '1' });
  check(!!PT && !!PT.turns && !thOk(PT), 'planted', 'their turn\'s row drawn as his: P11 reads ' + JSON.stringify(PT && PT.turns ? PT.turns.theirs : null) + ' (red)');
  const PN = await run('upright', { NOCHOP_PLANT: '1' });
  check(!!PN && !!PN.noChop && !ncOk(PN), 'planted', 'the card painted whole on every change: P10 reads ' + (PN ? ncSay(PN) : 'nothing') + ' (red)');
  console.log('\nTHE MAN\'S CARD ON THE PHONE: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0);
})();
