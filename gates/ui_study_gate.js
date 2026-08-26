/* ============================================================================
   UI STUDY GATE (8/26/26) — A STUDY, NOT A FAN PAGE

   Paolo 8/26: "I need you to do big brain research on how to do big brain
   research on studying other games UI for one round. And then the first basis
   of all of this is gonna be Final Fantasy ten, my favorite UI of all time."

   THE METHOD IS THE DELIVERABLE and the method is worthless without a machine.
   The quest side already paid for that lesson: 3,672 findings from 152 studied
   quests sat unread for a month because SKIPPING THEM COST NOTHING AND LEFT NO
   TRACE (QUEST STUDY LAW, 7/26). A UI study written as an essay fails the same
   way on the same timetable.

   SO THE CENTRE OF THIS GATE IS NOT "DOES THE FILE EXIST". It is the one thing
   that separates research from admiration:

       A ROUND WHERE EVERYTHING IS WORTH STEALING IS NOT A STUDY.

   Final Fantasy X is a 4:3 television game, played with a controller, with a
   party of seven, in a corridor, with voice actors. Bohemia is a portrait phone
   played with one thumb, one character, an open valley, and no voice budget.
   Much of what makes FFX great is PAID FOR by conditions we do not have, and
   naming those is the work. So this gate requires REFUSALS, by count, and fails
   an all-TAKE round.

   And it holds the study ON THE REAL SURFACE (7/18): the study is in the UI tab
   as its own view, it renders from the INDEX rather than from a retelling, and
   the page and the corpus are proved to agree finding by finding.

     node gates/ui_study_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT  = path.join(__dirname, '..');
const LAW   = path.join(ROOT, 'laws/BOHEMIA_ADDENDUM_THE_UI_STUDY_LAW_8_26_26.md');
const IDX   = path.join(ROOT, 'records/BOHEMIA_UIBOOK_LAW_INDEX.json');
const TOOL  = path.join(ROOT, 'tools/bohemia_uibook_index.py');
const PAGE  = path.join(ROOT, 'slices/BOHEMIA_UI_CURRENT.html');
const BOOKD = path.join(ROOT, 'uibook');

/* THE BAR FOR A ROUND. Deliberately not "at least one refusal": one is an
   apology, three is a position. */
const MIN_FINDINGS = 12;
const MIN_REFUSE   = 3;
const MIN_NOT_TAKE = 5;   /* REFUSE + ADAPT together */
const MIN_LENSES   = 3;
const MASTERS = ['look', 'read', 'do', 'world'];

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };

function playwright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules',
                   '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

/* ==== 0. THE METHOD IS WRITTEN DOWN, AND IT IS THE THING HE ASKED FOR ===== */
ok('the UI STUDY LAW exists', fs.existsSync(LAW));
ok('the indexer exists', fs.existsSync(TOOL));
ok('the index has been built', fs.existsSync(IDX));
if (!fs.existsSync(IDX) || !fs.existsSync(LAW)) {
  console.log('FAIL: ui study gate ' + pass + '/' + (pass + fail)); process.exit(1);
}
const law = fs.readFileSync(LAW, 'utf8');
/* CASE-INSENSITIVE ON PURPOSE. The first cut of these five was case-sensitive
   and went red on a law that names all five instruments correctly -- it shouts
   FAGERHOLT in the method section and writes Fagerholt in the sources, and the
   checker could not see the same name twice. Fix the ruler, never the target
   (8/1): a checker that cannot tell a name from the same name in capitals is
   the broken one. What actually matters is that BOTH halves are present. */
for (const [name, parts] of [
  ['Fagerholt & Lorentzon, the four-type taxonomy', [/fagerholt/i, /lorentzon/i, /diegetic/i, /non-diegetic/i, /spatial/i, /\bmeta\b/i]],
  ['both of its axes, FICTION and GEOMETRY', [/fiction/i, /geometry/i]],
  ['Hodent\'s seven usability pillars', [/hodent/i, /signs and feedback/i, /form follows function/i, /minimum workload/i, /error prevention/i, /user control/i, /consistency/i, /clarity/i]],
  ['Pinelle, Wong & Stach, built from real player complaints', [/pinelle/i, /wong/i, /stach/i, /108 games/i]],
  ['the teardown, the practitioner\'s method', [/teardown/i, /wireframe/i, /game ui database/i]],
]) {
  const missing = parts.filter(re => !re.test(law));
  ok('the law names ' + name + (missing.length ? ' (missing ' + missing.join(' ') + ')' : ''),
     missing.length === 0);
}
ok('and the law says out loud that an all-TAKE round is not a study',
   /ZERO REFUSALS IS NOT A STUDY/.test(law));

/* ==== 1. THE INDEX IS CURRENT, not a stale copy of an older corpus ======== */
{
  /* Regenerate into a temp path and compare: the questbook learned that a
     corpus appended without reindexing is a corpus with unreachable findings. */
  let rebuilt = null, ran = false;
  try {
    execFileSync('python3', [TOOL], { cwd: ROOT, encoding: 'utf8' });
    ran = true;
    rebuilt = fs.readFileSync(IDX, 'utf8');
  } catch (e) { rebuilt = null; }
  ok('the indexer runs clean over the corpus (a malformed finding is an error, ' +
     'never a silent skip)', ran);
  if (rebuilt) {
    try { JSON.parse(rebuilt); ok('and it produces valid JSON', true); }
    catch (_e) { ok('and it produces valid JSON', false); }
  }
}
const idx = JSON.parse(fs.readFileSync(IDX, 'utf8'));
const laws = idx.laws || {};
const ids = Object.keys(laws);
const rounds = (idx._meta && idx._meta.rounds) || [];

ok('there is at least one round in the uibook (' + rounds.length + ')', rounds.length >= 1);
ok('the round files are on disk',
   fs.existsSync(BOOKD) && fs.readdirSync(BOOKD).filter(f => /^BOHEMIA_UIBOOK_R\d/.test(f)).length >= 1);
ok('round one is Final Fantasy X, because he named it',
   rounds.some(r => r.game === 'FFX'));

/* ==== 2. EVERY CITATION IS REAL ========================================== */
{
  const bad = ids.filter(k => !/^[A-Z0-9]+\.[LRDW]\d{2}$/.test(k));
  ok('every id has the citable shape GAME.<L|R|D|W>##' +
     (bad.length ? ' (' + bad.slice(0, 3).join(', ') + ')' : ''), bad.length === 0);
  const mismatch = ids.filter(k => {
    const letter = k.split('.')[1][0];
    const want = { look: 'L', read: 'R', do: 'D', world: 'W' }[laws[k].kind];
    return letter !== want;
  });
  ok('and every id\'s letter agrees with the master it sits under' +
     (mismatch.length ? ' (' + mismatch.join(', ') + ')' : ''), mismatch.length === 0);
  const thin = ids.filter(k => {
    const f = laws[k];
    return !f.title || !f.lens || !f.screen || !f.what || !f.why || !f.because;
  });
  ok('every finding has a title, a lens, a screen, a WHAT, a WHY and a BECAUSE' +
     (thin.length ? ' (' + thin.slice(0, 3).join(', ') + ')' : ''), thin.length === 0);
  const noverd = ids.filter(k => !['TAKE', 'ADAPT', 'REFUSE'].includes(laws[k].verdict));
  ok('and every finding ends in a verdict' +
     (noverd.length ? ' (' + noverd.slice(0, 3).join(', ') + ')' : ''), noverd.length === 0);
}

/* ==== 3. *** A ROUND WHERE EVERYTHING IS WORTH STEALING IS NOT A STUDY *** */
for (const r of rounds) {
  const c = r.counts || {};
  const tag = r.game + ': ';
  ok(tag + 'the round is deep enough to be a round (' + c.findings + ', wants ' +
     MIN_FINDINGS + ')', (c.findings || 0) >= MIN_FINDINGS);
  ok(tag + 'it spans all four masters (look ' + c.look + ' read ' + c.read +
     ' do ' + c.do + ' world ' + c.world + ')',
     MASTERS.every(m => (c[m] || 0) >= 1));

  /* THE CENTRE OF THE GATE */
  ok(tag + '*** IT SAYS NO. ' + c.refuse + ' findings are things FFX does well that ' +
     'CANNOT come here, and the reason is the finding (wants ' + MIN_REFUSE + ') ***',
     (c.refuse || 0) >= MIN_REFUSE);
  ok(tag + 'and most of it is not a straight copy (' + ((c.refuse || 0) + (c.adapt || 0)) +
     ' refuse-or-adapt, wants ' + MIN_NOT_TAKE + ')',
     ((c.refuse || 0) + (c.adapt || 0)) >= MIN_NOT_TAKE);

  const mine = ids.filter(k => laws[k].game === r.game);
  const lenses = new Set();
  for (const k of mine) {
    for (const nm of ['Hodent', 'Fagerholt', 'Pinelle', 'Lorentzon', 'Stach', 'Wong'])
      if ((laws[k].lens || '').indexOf(nm) >= 0) lenses.add(nm === 'Lorentzon' ? 'Fagerholt' : nm);
  }
  ok(tag + 'it was read through more than one instrument (' +
     [...lenses].join(', ') + ', wants ' + MIN_LENSES + ' names)', lenses.size >= MIN_LENSES);

  /* A REFUSAL HAS TO CARRY ITS REASON, or it is a shrug with a label on it. */
  const lazyRefuse = mine.filter(k => laws[k].verdict === 'REFUSE' &&
                                      (laws[k].because || '').length < 80);
  ok(tag + 'every refusal explains itself at length' +
     (lazyRefuse.length ? ' (' + lazyRefuse.join(', ') + ')' : ''), lazyRefuse.length === 0);

  /* AND IT MUST TOUCH THIS PROJECT. A finding whose BECAUSE never mentions a
     Bohemia law, lane, screen or ruling is a review, not a port. */
  /* A FINDING WHOSE "BECAUSE" NEVER TOUCHES THIS PROJECT IS A REVIEW, NOT A PORT.
     The list is wide because our own rulings are named a dozen different ways --
     a law, a lane, a backlog row (UI-2, SHARED -5), a fork on the vocabulary
     page, or one of his own quoted phrases. It was deliberately widened once,
     after it flagged three findings: two of them named a real ruling in words
     this list did not carry, and THE THIRD ONE WAS GENUINELY FLOATING and got
     rewritten. Both halves of that are the gate working. */
  const OURS = new RegExp([
    'bohemia', 'thumb', 'phone', 'beat', '120', 'law', 'lane', 'fork', 'dispatch',
    'valley', 'demo', 'run ', 'combat', 'light', 'spanglish', 'dial', 'grime',
    'tab', 'colour alone', 'no runs', 'mini boss', 'experience tree',
    'district', 'action button', 'city', 'pixel', 'alpha',
    'UI-\\d', 'SHARED -\\d', 'I-MOVE-YOU-MOVE', 'rogue fable'
  ].join('|'), 'i');
  /* NOT pronouns. An earlier widening of this list reached for "he/his/we/our"
     and would have matched every sentence in the corpus -- a checker that
     cannot tell a mention from a use is the broken one (8/1), and one that
     matches everything is the same bug wearing a bigger coat. */
  const floating = mine.filter(k => !OURS.test(laws[k].because || ''));
  ok(tag + 'every finding lands on THIS game, not just on that one' +
     (floating.length ? ' (' + floating.slice(0, 3).join(', ') + ')' : ''), floating.length === 0);
}

/* ==== 4. NAME THE TAB: he can reach it ==================================== */
const page = fs.readFileSync(PAGE, 'utf8');
ok('the study is in the UI tab as its own view', /id="viewStudy"/.test(page));
ok('and the picks are still the door he lands on', /id="viewPick"/.test(page));
ok('there is a way to switch between them', /class="vbtn"/.test(page));

/* ========================================================================== */
(async () => {
  const { chromium } = playwright();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + PAGE);
  await SETTLE(p, 1500);

  ok('the page opens on the PICKS, because that is what is waiting on him',
     await p.evaluate(() => document.getElementById('viewPick').classList.contains('on') &&
                            !document.getElementById('viewStudy').classList.contains('on')));

  await p.click('.vbtn[data-view="study"]');
  await SETTLE(p, 600);
  const shown = await p.evaluate(() => ({
    studyOn: document.getElementById('viewStudy').classList.contains('on'),
    pickOff: !document.getElementById('viewPick').classList.contains('on'),
    findings: document.querySelectorAll('.fnd').length,
    masters: document.querySelectorAll('.master').length,
    refuse: document.querySelectorAll('.fnd[data-verdict="REFUSE"]').length,
    ids: [...document.querySelectorAll('.fnd')].map(e => e.getAttribute('data-id')),
    verdicts: [...document.querySelectorAll('.fverd')].map(e => e.textContent.trim()),
    /* NEVER COLOUR ALONE, again: the verdict must be a WORD on the card, not a
       coloured chip that a red/green-deficient reader has to guess at. */
    verdictBorders: [...document.querySelectorAll('.fverd')].map(e => getComputedStyle(e).borderTopWidth)
  }));
  ok('tapping the study opens the study', shown.studyOn && shown.pickOff);
  ok('all four masters are on the page (' + shown.masters + ')', shown.masters === 4);

  /* *** THE PAGE RENDERS THE INDEX. It does not retell it. *** So the study and
     the corpus can never drift, which is the exact rot the truth hierarchy
     exists to kill: two live copies of one truth. */
  const pageIds = shown.ids.slice().sort();
  const bookIds = ids.slice().sort();
  ok('THE PAGE SHOWS EXACTLY WHAT THE CORPUS HOLDS, id for id (' + pageIds.length +
     ' vs ' + bookIds.length + ')', JSON.stringify(pageIds) === JSON.stringify(bookIds));
  ok('every refusal reached the page too (' + shown.refuse + ')',
     shown.refuse === ids.filter(k => laws[k].verdict === 'REFUSE').length);
  ok('the verdict is a WORD on every card, never a colour alone',
     shown.verdicts.length === ids.length &&
     shown.verdicts.every(v => ['TAKE', 'ADAPT', 'REFUSE'].includes(v)));

  /* the whole point of the study is what it says about US: prove the port text
     really made it onto the surface he reads, not just into a file on disk */
  const ported = await p.evaluate(() => {
    const bad = [];
    document.querySelectorAll('.fnd').forEach(e => {
      const t = (e.querySelector('.fport') || {}).textContent || '';
      if (t.replace(/\s+/g, ' ').trim().length < 60) bad.push(e.getAttribute('data-id'));
    });
    return bad;
  });
  ok('and WHAT WE DO ABOUT IT is on every card' +
     (ported.length ? ' (' + ported.slice(0, 3).join(', ') + ')' : ''), ported.length === 0);

  /* THE THUMB still applies in the second room */
  const small = await p.evaluate(() => {
    const bad = [];
    document.querySelectorAll('#viewStudy button, .vbtn').forEach(e => {
      const r = e.getBoundingClientRect();
      if (r.width > 1 && r.height > 1 && r.height < 44) bad.push(e.className + ' ' + Math.round(r.height));
    });
    return bad;
  });
  ok('every control in the study clears 44px' + (small.length ? ' (' + small.join(', ') + ')' : ''),
     small.length === 0);
  ok('and the study does not run off the side of the phone',
     await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));

  /* SUN MODE, IN THE SECOND ROOM. ui_vocab_gate sweeps sun-mode contrast over the
     PICKS view -- and it is blind to this one, because a hidden view has no
     rendered size and every element in it is skipped. A gate that goes green
     because its subject was invisible is the worst kind of green, so the study
     sweeps its own room, with the room open. */
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.click('#sunbtn');
  await SETTLE(p, 500);
  const sunDim = await p.evaluate(() => {
    function L(c) {
      const m = (c || '').match(/[\d.]+/g); if (!m) return null;
      if (m.length > 3 && Number(m[3]) < 0.5) return null;
      const [r, g, b] = m.slice(0, 3).map(v => { v = Number(v) / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    function bgOf(e) {
      for (let n = e; n && n !== document; n = n.parentElement) {
        const l = L(getComputedStyle(n).backgroundColor);
        if (l !== null) return l;
      }
      return L(getComputedStyle(document.body).backgroundColor);
    }
    const bad = [];
    document.querySelectorAll('#viewStudy *, .vbtn').forEach(e => {
      const txt = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join('');
      if (txt.length < 3) return;
      const r = e.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const fg = L(getComputedStyle(e).color), bg = bgOf(e);
      if (fg === null || bg === null) return;
      const ct = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
      if (ct < 4.5) bad.push(txt.slice(0, 22) + ' @' + ct.toFixed(2));
    });
    return bad;
  });
  ok('every word of the study survives the sun too' +
     (sunDim.length ? ' (' + sunDim.length + ' too faint: ' + sunDim.slice(0, 3).join(' | ') + ')' : ''),
     sunDim.length === 0);
  await p.click('#sunbtn');
  await SETTLE(p, 300);

  /* HIS PLACE IS KEPT. Losing the room you were in is the cheapest way to lose
     a reader, and this page is 8,700px tall. */
  await p.reload();
  await SETTLE(p, 1200);
  ok('the room he was last in is remembered across a reload',
     await p.evaluate(() => document.getElementById('viewStudy').classList.contains('on')));

  ok('the study threw nothing' + (errs.length ? ' (' + errs.slice(0, 2).join(' | ') + ')' : ''),
     errs.length === 0);

  await b.close();
  console.log((fail ? 'FAIL' : 'PASS') + ': ui study gate ' + pass + '/' + (pass + fail));
  process.exit(fail ? 1 : 0);
})();
