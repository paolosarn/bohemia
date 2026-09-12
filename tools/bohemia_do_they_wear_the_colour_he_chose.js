/* DO THEY WEAR THE COLOUR HE CHOSE? (9/12/26, CHARACTER lane, VAMILY
 * [one colour table] THERE-ARE-TWO-LIVE-FACTION-COLOUR-TABLES-AND-THEY-DISAGREE)
 *
 * *** THE ROW IS MINE AND ITS PREMISE IS MINE AND I NOW THINK THE PREMISE IS WRONG. ***
 * I reported last round that two live faction colour tables disagree on 10 of 12 factions
 * and asked the coordinator which one wins. The coordinator turned that into this row and
 * put it at the top of this lane, with a prescription: the derived file is the one source,
 * the dress module reads it and keeps no table of its own.
 * DOING THAT WOULD DELETE HIS OWN COLOUR CHOICES, and this tool exists to show that with
 * the machine rather than argue it.
 *
 * WHAT THE TWO "TABLES" ACTUALLY ARE, read rather than assumed:
 *   engine/bohemia_dress.js FACTION_LOOK  -- an INPUT. The colour the procedural picker
 *     AIMS a garment at. Six entries are Paolo's separate 7/21 clothing rulings; the other
 *     seven are copied BYTE FOR BYTE out of the alpha's MFACTIONS table, which is his own
 *     chosen accent colour per faction ("BRO WE ALREADY CHOSE COLORS FIND IT IN THE
 *     PROJECT", 8/2, having to say it twice). gates/faction_dossier_gate.py re-reads
 *     MFACTIONS out of the alpha every run and fails if one drifts.
 *   engine/BOHEMIA_faction_colours.json   -- an OUTPUT. The colour MEASURED off the
 *     rendered wardrobe by tools/bohemia_faction_colour.js. Its own header says so.
 * ONE IS THE AIM AND ONE IS WHERE THE SHOT LANDED. Comparing them and calling the gap a
 * contradiction is the same mistake this lane made twice last round: I COMPARED TWO THINGS
 * THAT WERE NEVER THE SAME KIND OF THING. Pointing the aim at the landing spot is not
 * "one source", it is a feedback loop -- dress people from a measurement of dressed people
 * -- and every re-bake would drift further from what he picked.
 *
 * SO THE USEFUL QUESTION IS NOT WHICH FILE WINS. IT IS: DOES WHAT WE BUILT WEAR WHAT HE
 * CHOSE? His table is the aim. The derived file is the landing spot. The gap between them
 * is a COLOUR IS TERRITORY defect, per faction, in degrees, and nobody has ever measured it.
 *
 * FAIR-COMPARISON NOTE, because the obvious objection is right: the style card allows ONE
 * saturated piece per body and lists dust, ash, bone and lead as legal cloth, so the
 * dominant colour of a CORRECTLY dressed body is dun. The derived file already handles
 * this -- it votes only among cloth that HAS a hue and reports `neutral` separately -- so
 * the comparison is "among the coloured cloth, is it HIS colour", which is the only version
 * of the question that means anything.
 *
 * RIG CHECK (RIG IS LAW): reads only. No pixel, joint or bone is touched.
 * REUSE CHECK: cooks nothing. His table is read live out of the alpha; the measurement is
 * the one already published; the drab exemption is the law's own.
 *
 *   node tools/bohemia_do_they_wear_the_colour_he_chose.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const REPO = path.dirname(__dirname);
const ALPHA = path.join(REPO, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(REPO, 'records/BOHEMIA_DO_THEY_WEAR_THE_COLOUR_HE_CHOSE_9_12_26.txt');

/* HIS TABLE, READ LIVE OUT OF THE ALPHA AND NEVER RETYPED -- the same rule
   faction_dossier_gate follows, for the same reason. */
const src = fs.readFileSync(ALPHA, 'utf8');
const mfBlock = src.slice(src.indexOf('const MFACTIONS=['));
const HIS = {};
/* *** THE FIRST CUT OF THIS READER USED [^\n]*? AND SILENTLY LOST THE CARTEL. ***
   Its MFACTIONS entry carries a graveyard comment that wraps, so its `acc:` sits on the
   NEXT physical line, and a reader that cannot cross a newline reported "not in his table"
   -- which is not a gap in his table, it is a gap in my reader, and it would have gone
   into the record as a fact about the game. Third time in two rounds that a regex has been
   asked to see a line structure it cannot see. It reads ENTRY BY ENTRY now, split on the
   real delimiter, so wrapping cannot hide a faction. */
for (const chunk of mfBlock.slice(0, mfBlock.indexOf('\n];')).split(/\n\s*\{n:'/).slice(1)) {
  const n = chunk.match(/^([A-Z ]+)'/);
  const a = chunk.match(/acc:'(#[0-9a-fA-F]{6})'/);
  if (n && a) HIS[n[1]] = a[1];
}
if (Object.keys(HIS).length < 13)
  throw new Error('read only ' + Object.keys(HIS).length + ' of his factions out of MFACTIONS -- the reader is wrong, not the table');

const DERIVED = JSON.parse(fs.readFileSync(path.join(REPO, 'engine/BOHEMIA_faction_colours.json'), 'utf8')).factions;

const hueOf = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const R = (n >> 16) & 255, G = (n >> 8) & 255, B = n & 255;
  const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
  if (mx === mn) return null;
  let h;
  if (mx === R) h = 60 * (((G - B) / (mx - mn)) % 6);
  else if (mx === G) h = 60 * (((B - R) / (mx - mn)) + 2);
  else h = 60 * (((R - G) / (mx - mn)) + 4);
  return (h + 360) % 360;
};
const sat = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const R = (n >> 16) & 255, G = (n >> 8) & 255, B = n & 255;
  const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
  return mx ? (mx - mn) / mx : 0;
};
const dHue = (a, b) => { const d = Math.abs(((a - b) % 360 + 360) % 360); return d > 180 ? 360 - d : d; };

/* 30 degrees is one twelfth of the wheel and the span inside which a colour still reads as
   the same colour to a person -- rust and brown, not rust and green. Same threshold this
   lane used for the round-trip measurement, so the two numbers are comparable. */
const NEAR = 30;
/* THE LAW'S OWN EXEMPTION, quoted rather than invented: "drab is legal, but only when
   drabness IS the statement (the Volunteers, the Homeless)". The Cartel is on the gate's
   exemption list and NOT in the law, which faction_colour_gate already prints as
   [PENDING Paolo] every run. Named here the same way and not counted either direction. */
const DRAB_IN_LAW = ['Volunteers', 'Homeless'];
const DRAB_CLAIMED_NOT_IN_LAW = ['Cartel'];

const L = [];
L.push('DO THEY WEAR THE COLOUR HE CHOSE? -- CHARACTER lane, 9/12/26');
L.push('VAMILY row [one colour table], round 1 (measurement, nothing built)');
L.push('');
L.push('=== THE ROW\'S PREMISE IS MINE AND I NOW THINK IT IS WRONG ===');
L.push('I reported "two live faction colour tables disagree on 10 of 12" and asked which');
L.push('wins. That framing treats an AIM and a LANDING SPOT as two copies of one fact.');
L.push('  engine/bohemia_dress.js FACTION_LOOK   = the colour the picker AIMS at. Six are');
L.push('    his 7/21 clothing rulings; seven are copied BYTE FOR BYTE from the alpha\'s');
L.push('    MFACTIONS table, his own chosen accent per faction, and faction_dossier_gate');
L.push('    re-reads MFACTIONS every run and fails if one drifts.');
L.push('  engine/BOHEMIA_faction_colours.json    = the colour MEASURED off the rendered');
L.push('    wardrobe. Its own header says so.');
L.push('POINTING THE AIM AT THE LANDING SPOT IS NOT ONE SOURCE, IT IS A FEEDBACK LOOP:');
L.push('dress people from a measurement of dressed people, and every re-bake drifts further');
L.push('from what he picked. It would also delete his six 7/21 rulings outright.');
L.push('Same mistake this lane made twice last round, in a new place: COMPARING TWO THINGS');
L.push('THAT WERE NEVER THE SAME KIND OF THING.');
L.push('');
L.push('=== SO HERE IS THE QUESTION WORTH ASKING INSTEAD ===');
L.push('His table is the aim. The derived file is where the shot landed. DOES WHAT WE BUILT');
L.push('WEAR WHAT HE CHOSE? Nobody has ever measured that.');
L.push('');
L.push('Hue in degrees (0 red, 60 yellow, 120 green, 210 blue, 300 magenta).');
L.push('Under ' + NEAR + ' degrees apart is still the same colour to a person.');
L.push('SHARE is how much of the coloured cloth is that hue; NEUTRAL is the dun fraction,');
L.push('which does not vote, because the style card allows one saturated piece per body.');
L.push('');
L.push('FACTION       HE CHOSE     HUE   BUILT   HUE    GAP  WEARS IT?  SHARE  NEUTRAL');
const miss = [], hit = [], drab = [];
const names = Object.keys(DERIVED);
for (const f of names) {
  const key = f.toUpperCase();
  const his = HIS[key];
  const d = DERIVED[f];
  if (!his) { L.push(f.padEnd(12) + '  (not in his MFACTIONS table)'); continue; }
  const hh = hueOf(his);
  const isDrab = !!d.drab;
  const gap = (hh == null || d.hue == null) ? null : dHue(hh, d.hue);
  let verdict;
  if (isDrab) {
    verdict = DRAB_IN_LAW.indexOf(f) >= 0 ? 'drab(law)'
            : DRAB_CLAIMED_NOT_IN_LAW.indexOf(f) >= 0 ? 'drab(?)' : 'drab';
    drab.push(f + ' ' + verdict);
  } else if (gap != null && gap <= NEAR) { verdict = 'YES'; hit.push(f); }
  else { verdict = 'NO'; miss.push({ f: f, gap: gap, his: his, built: d.hex }); }
  L.push(f.padEnd(12) + his.padEnd(10) + String(hh == null ? '-' : hh.toFixed(0)).padStart(6)
    + '   ' + String(d.hex).padEnd(8) + String(d.hue == null ? '-' : d.hue).padStart(5)
    + String(gap == null ? '-' : gap.toFixed(0)).padStart(7)
    + verdict.padStart(11)
    + ((100 * d.share).toFixed(0) + '%').padStart(7)
    + ((100 * d.neutral).toFixed(0) + '%').padStart(9));
}
L.push('');
L.push('WEARS THE COLOUR HE CHOSE: ' + hit.length + ' of ' + (hit.length + miss.length)
  + ' factions that are supposed to have a colour at all');
L.push('(' + drab.length + ' are drab: ' + drab.join(', ') + ').');
L.push('');
if (miss.length) {
  L.push('*** THESE FACTIONS ARE NOT WEARING WHAT HE PICKED ***');
  miss.sort((a, b) => b.gap - a.gap);
  for (const m of miss)
    L.push('  ' + m.f.padEnd(12) + 'he chose ' + m.his + ', they wear ' + m.built
      + ' -- ' + m.gap.toFixed(0) + ' degrees off');
  L.push('');
  L.push('COLOUR IS TERRITORY (8/26, his words): "people get shot in Los Angeles for wearing');
  L.push('the wrong color ... how we wanna communicate, like, who would defend us." A faction');
  L.push('wearing a colour he did not pick is not a smaller version of that law working. It');
  L.push('is the law not working, on that faction, completely.');
}
L.push('');
L.push('=== AND A SECOND FINDING, BIGGER THAN THE FIRST, FOUND BY TRYING THE ROW ===');
L.push('Before arguing that the row\'s prescription is wrong, I did it: repointed NETWORK in');
L.push('FACTION_LOOK from his teal #1fbf9c to the derived slate #465362, exactly as the row');
L.push('says, and ran the gate that the module\'s own comment says protects it.');
L.push('ALL 761 CHECKS STAYED GREEN.');
L.push('The comment in engine/bohemia_dress.js reads, word for word: "these seven hexes are');
L.push('copied from that table, byte for byte, and gates/faction_dossier_gate.py re-reads');
L.push('MFACTIONS out of the alpha every run and fails if a single one drifts - so nobody has');
L.push('to trust that I typed them right."');
L.push('NOBODY HAD TO TRUST IT AND NOBODY SHOULD HAVE. The gate did re-read his table, but it');
L.push('compared it against the DOSSIER FILES, never against the live FACTION_LOOK the game');
L.push('dresses from, and then threw those seven away one line later. They were checked for');
L.push('PRESENCE and never once for VALUE. A colour he had to choose twice could be changed');
L.push('by anybody, at any time, with nothing going red, under a comment saying it could not.');
L.push('A PROMISE IN A COMMENT IS NOT A GATE.');
L.push('FIXED THIS ROUND: the seven are now checked BY VALUE against his MFACTIONS table.');
L.push('faction_dossier_gate 761 -> 768 green, and proven to bite -- the same NETWORK edit');
L.push('now fails by name, naming his colour.');
L.push('');
L.push('=== WHAT THIS ROUND DELIBERATELY DID NOT DO ===');
L.push('Nothing was built and no colour was changed. WHICH faction owns which hue is HIS');
L.push('(MECHANISM-MINE / CONTENTS-PAOLO\'S) and he answered it twice. The fix is to put a');
L.push('garment in his colour on the factions that are missing one, which is a COOK request');
L.push('and a wiring job, not a table edit, and it starts from this list.');
fs.writeFileSync(OUT, L.join('\n') + '\n');
console.log(L.join('\n'));
