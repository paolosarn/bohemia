/* ============================================================================
   QUIRK GATE (8/19/26, PEOPLE lane)

   Backlog 0t: "EVERY character, named or generic, carries ONE endearing or funny
   surface reachable through dialogue, and the ask-their-name beat is the built-in
   delivery slot." Tone research R1, finding 1: A CHARACTER NOBODY LAUGHED WITH IS
   A CHARACTER NOBODY MOURNS. The demo's cold open kills the sibling; that only
   lands in a valley the player has been charmed by.

   WHAT THIS HOLDS, and every one of these is a thing that actually went wrong:

   1. TEMPLATE SUBSTITUTION HAS NO GRAMMAR. The first build shipped "Mine's the
      same as his was. a slot handle snapped off at the base, both of us." -- a
      phrase written for the middle of a sentence, dropped at the start of one.
      A human cannot eyeball 44 lines x 40 nouns. So the grammar contract is
      MACHINE-CHECKED: no slot is sentence-initial, no object phrase carries an
      internal comma, every ritual is a bare person-neutral gerund.

   2. A LOOKUP THAT RETURNS THE SAME ANSWER FOR EVERY INPUT IS A DECORATION.
      This lane deleted a subjectsFor() on 8/17 that returned all seven subjects
      for all four archetypes. So the distribution is MEASURED across 12,800
      people, not asserted.

   3. NOBODY ON YOUR BLOCK HAS YOUR BIT. 304 combinations drawn 32 times is a
      birthday problem and it lands where the maths says: 1.63 duplicate pairs
      per block, seven on the worst block in three hundred. spreadOver() makes it
      exact, and this proves it AND proves the fix does not flatten the shape
      distribution to hide the collision.

   4. IT IS THE SAME PERSON IN BOTH REGISTERS. The lit/dark split is benign
      violation theory (R1 finding 3: funny and scary are one dial). The moment
      the dark line stops being the same trait it is a mode switch and the whole
      idea is gone, so both registers must use the SAME noun.

   5. IT REACHES THE CARD HE ACTUALLY OPENS. VERIFY ON THE REAL SURFACE: this
      drives the real alpha in a real browser, walks to a settlement, opens the
      talk card, asks the name and demands the row.

   6. AND THE ROW LANDS WHEN THE NAME DOES NOT. Six of the sixteen introductions
      refuse a name. Under the old card those factions were unmeetable; a quirk
      row gated on a successful name would have left them that way.
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const path = require('path');
const fs = require('fs');
const ROOT = path.join(__dirname, '..');
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');

let pass = 0, fail = 0;
const ok = (n, c, note) => {
  if (c) { pass++; } else { fail++; console.log('  > FAIL ' + n + (note ? '  [' + note + ']' : '')); }
};
function pw() {
  try { return require('/opt/node22/lib/node_modules/playwright'); }
  catch (e) { return require('playwright'); }
}

/* one block of people, as the city keys them. */
function blockKeys(seed) {
  const k = [];
  for (let h = 1; h <= 8; h++) for (let s = 1; s <= 4; s++) k.push('P:' + seed + ':H' + h + '-' + s);
  return k;
}

(async () => {
  /* ---- A. THE TABLE ------------------------------------------------------ */
  global.window = global;
  const Q = require(path.join(ROOT, 'engine/bohemia_quirk.js'));
  const laws = JSON.parse(fs.readFileSync(
    path.join(ROOT, 'records/BOHEMIA_QUESTBOOK_LAW_INDEX.json'), 'utf8')).laws;
  const REC = JSON.parse(fs.readFileSync(
    path.join(ROOT, 'records/BOHEMIA_QUIRKS.json'), 'utf8'));

  ok('A1 there is something to be charmed by (' + Q.SHAPES.length + ' shapes, '
    + Q.count() + ' quirks in two registers)', Q.SHAPES.length >= 15 && Q.count() >= 200);

  /* A2: THE GRAMMAR CONTRACT. Every rendered line, every shape x every noun. */
  const initial = [], commaObj = [], badGerund = [], person = [], capped = [];
  for (const kind of Object.keys(Q.SPECIFICS)) {
    for (const n of Q.SPECIFICS[kind]) {
      if (kind === 'object' && n.indexOf(',') >= 0) commaObj.push(n);
      if (kind === 'ritual' && !/^[a-z]+ing\b/.test(n)) badGerund.push(n);
      if (kind === 'ritual' && /\b(their|his|her|my|your)\b/.test(n)) person.push(n);
      if (/^[A-Z]/.test(n)) capped.push(n);
    }
  }
  let rendered = 0;
  for (const s of Q.SHAPES) {
    for (const n of Q.SPECIFICS[s.kind]) {
      for (const reg of ['lit', 'dark']) {
        const line = s[reg].replace(new RegExp('\\{(it|p|r)\\}', 'g'), n);
        rendered++;
        /* a noun at the head of a sentence: start of line, or after a terminator */
        const at = line.indexOf(n);
        if (at === 0 || /[.!?…]["'”]?\s+$/.test(line.slice(0, at))) initial.push(s.key + '/' + reg);
        if (line.indexOf('{') >= 0) initial.push(s.key + '/' + reg + ' (unfilled slot)');
      }
    }
  }
  ok('A2 no line opens a sentence with its noun (' + rendered + ' rendered, '
    + initial.length + ' bad)', initial.length === 0, initial.slice(0, 3).join(' | '));
  ok('A3 object phrases embed anywhere (no internal comma)', commaObj.length === 0,
    commaObj.slice(0, 2).join(' | '));
  ok('A4 rituals are bare person-neutral gerunds, they are spoken aloud',
    badGerund.length === 0 && person.length === 0 && capped.length === 0,
    badGerund.concat(person, capped).slice(0, 3).join(' | '));

  /* A5: SAME PERSON, TWO REGISTERS. Never a different quirk, never a different
     object -- that is what makes it uncanny instead of a mode switch. */
  const drifted = [], twinned = [];
  for (const s of Q.SHAPES) {
    if (s.lit.trim() === s.dark.trim()) twinned.push(s.key);
    const slot = { object: '{it}', place: '{p}', ritual: '{r}' }[s.kind];
    if (s.lit.indexOf(slot) < 0 || s.dark.indexOf(slot) < 0) drifted.push(s.key);
  }
  ok('A6 lit and dark are the SAME trait and the SAME object, never two quirks',
    drifted.length === 0 && twinned.length === 0, drifted.concat(twinned).join(' '));

  /* A7: A TELL IS THIRD PERSON AND CARRIES NO SLOT. The nouns are written for a
     first-person mouth; putting one in a "they" sentence is how "washing their
     hands" got into somebody's own dialogue in the first draft. */
  const badTell = Q.SHAPES.filter(s => !s.tell || s.tell.indexOf('{') >= 0 || /^[A-Z]/.test(s.tell));
  ok('A8 every shape has a third-person tell with no slot in it', badTell.length === 0,
    badTell.map(s => s.key).join(' '));

  /* A9: THE DISTRIBUTION IS MEASURED. Not "the hash looks fine". */
  const shapeN = {}, comboN = {};
  let N = 0;
  for (let b = 0; b < 400; b++) {
    for (const k of blockKeys((b * 2654435761) % 100000)) {
      const q = Q.quirkOf(k);
      shapeN[q.shape] = (shapeN[q.shape] || 0) + 1;
      comboN[q.shape + '|' + q.specific] = 1;
      N++;
    }
  }
  const used = Object.keys(shapeN).length, combos = Object.keys(comboN).length;
  const spread = Object.values(shapeN);
  const lo = Math.min(...spread), hi = Math.max(...spread), even = N / Q.SHAPES.length;
  ok('A10 every shape and every combination actually happens (' + used + '/'
    + Q.SHAPES.length + ' shapes, ' + combos + '/' + Q.count() + ' combos)',
    used === Q.SHAPES.length && combos === Q.count());
  ok('A11 and none of them is starved or hogging (' + lo + '..' + hi + ' vs even '
    + Math.round(even) + ')', lo > even * 0.7 && hi < even * 1.35);

  /* A12: DERIVED, NEVER STORED -- the same three numbers, the same human. */
  const k1 = 'P:4242:H3-2';
  ok('A13 the same person is the same person, every call, from a key or a record',
    Q.quirkOf(k1).lit === Q.quirkOf(k1).lit
    && Q.quirkOf({ key: k1 }).lit === Q.quirkOf(k1).lit);

  /* A14: NOBODY ON YOUR BLOCK HAS YOUR BIT, and the fix does not flatten. */
  let rawDup = 0, spDup = 0, worstRaw = 0, worstSp = 0, moved = 0, people = 0;
  const spShape = {};
  const BLOCKS = 300;
  for (let b = 0; b < BLOCKS; b++) {
    const ks = blockKeys((b * 7919) % 99991);
    const seenRaw = new Set(), seenSp = new Set();
    let dr = 0, ds = 0;
    for (const k of ks) {
      const q = Q.quirkOf(k), id = q.shape + '|' + q.specific;
      if (seenRaw.has(id)) dr++; seenRaw.add(id);
    }
    const sp = Q.spreadOver(ks);
    for (const k of ks) {
      const q = sp[k], id = q.shape + '|' + q.specific;
      if (seenSp.has(id)) ds++; seenSp.add(id);
      spShape[q.shape] = (spShape[q.shape] || 0) + 1;
      people++;
      const own = Q.quirkOf(k);
      if (own.shape !== q.shape || own.specific !== q.specific) moved++;
    }
    rawDup += dr; spDup += ds;
    if (dr > worstRaw) worstRaw = dr;
    if (ds > worstSp) worstSp = ds;
  }
  ok('A15 the collision this fixes is REAL (' + (rawDup / BLOCKS).toFixed(2)
    + ' duplicate pairs per block undrawn, worst ' + worstRaw + '), a gate for a '
    + 'problem that does not happen proves nothing', rawDup > 0);
  ok('A16 and after the spread NOBODY on a block shares a bit (' + spDup
    + ' duplicates across ' + BLOCKS + ' blocks)', spDup === 0 && worstSp === 0);
  ok('A17 which moves ' + (100 * moved / people).toFixed(1) + '% of people, most keep '
    + 'their own draw', moved / people < 0.15);
  const spv = Object.values(spShape);
  ok('A18 and it does not flatten the shapes to hide the collision ('
    + Object.keys(spShape).length + '/' + Q.SHAPES.length + ' shapes still used)',
    Object.keys(spShape).length === Q.SHAPES.length
    && Math.min(...spv) > (people / Q.SHAPES.length) * 0.6);

  /* A19: ORDER-INDEPENDENT. A block's answer cannot depend on which order the
     caller happened to walk its people. */
  const ks = blockKeys(4242);
  const a = Q.spreadOver(ks), rev = Q.spreadOver(ks.slice().reverse());
  ok('A20 the block spread is order-independent and repeatable',
    ks.every(k => a[k].lit === rev[k].lit)
    && ks.every(k => a[k].lit === Q.spreadOver(ks)[k].lit));

  /* A21: THE CATALOGUE. Ids resolve, titles VERBATIM, >=2 studies and >=2
     masters, every `applied` a real sentence. */
  const badCite = [];
  const studies = new Set(), masters = new Set();
  for (const c of (REC.quirks[0] || {}).study || []) {
    const e = laws[c.id];
    if (!e) { badCite.push(c.id + ' unresolved'); continue; }
    if (String(e.title).trim() !== String(c.title).trim()) badCite.push(c.id + ' not verbatim');
    if (String(c.applied || '').trim().length < 40) badCite.push(c.id + ' is a name-drop');
    studies.add(e.study); masters.add(e.kind);
  }
  ok('A22 every quirk cites the catalogue, verbatim, applied (' + studies.size
    + ' studies, ' + masters.size + ' masters)',
    badCite.length === 0 && studies.size >= 2 && masters.size >= 2,
    badCite.slice(0, 3).join(' | '));

  /* A23: DRAFTS. Every line is his to edit and is tagged so he can find it. */
  ok('A24 every line ships tagged draft:true (ALWAYS MAKE AN ATTEMPT, 8/11)',
    REC.quirks.length === Q.SHAPES.length && REC.quirks.every(q => q.draft === true));

  /* A25: NO EM DASHES ANYWHERE (Paolo, standing). */
  const dashes = Q.SHAPES.filter(s => /[—–]/.test(s.lit + s.dark + s.tell));
  ok('A26 not one line uses an em or en dash (' + dashes.length + ')', dashes.length === 0);

  /* A27: CONTENTS-PAOLO'S. No person is named and no establishment is named --
     both are his canon and a draft that invents one becomes canon by shipping. */
  const named = Q.SHAPES.filter(s => /\b(Marco|Holland|the Cartel|the Remnants|the Blues)\b/
    .test(s.lit + s.dark + s.tell));
  ok('A28 no faction and no person is named in a line that ships to everybody',
    named.length === 0, named.map(s => s.key).join(' '));

  /* ---- B. THE SURFACE HE ACTUALLY OPENS ---------------------------------- */
  const { chromium } = pw();
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e.message).slice(0, 140)));

  try {
    await page.goto('file://' + ALPHA);
    await page.evaluate(() => localStorage.setItem('bohemia.opening.seen.v1', '1'));
    await page.reload();
    await SETTLE(page, 3400);
    await page.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
    await SETTLE(page, 500);
    await page.evaluate(() => {
      const t = Array.from(document.querySelectorAll('.tab'))
        .find(e => (e.textContent || '').trim() === 'RUN');
      if (t) t.click();
    });
    await SETTLE(page, 16000);

    /* ASK THE FRAME WHAT IT CAN DO, never match its URL. */
    let city = null;
    for (const f of page.frames()) {
      try {
        if (await f.evaluate(() => typeof LANDED !== 'undefined' && typeof qkLine === 'function')) {
          city = f; break;
        }
      } catch (_e) {}
    }
    ok('B1 the quirk reached the frame the player looks at', !!city);
    if (!city) throw new Error('no city frame');

    await city.evaluate(() => { if (MODE !== 'human') { swapMode(); HC = HZOOM; } render(); });
    await SETTLE(page, 2200);

    const found = await city.evaluate(() => {
      BohemiaPopulation.setDial(20);
      const NB = BohemiaPopulation.NB;
      for (let ny = 0; ny < 24; ny++) for (let nx = 0; nx < 24; nx++) {
        if (BohemiaPopulation.zoneAt(om, POWER, nx * NB, ny * NB, seed) !== 'cluster') continue;
        const ppl = pplPeople(nx, ny);
        if (ppl.length < 5) continue;
        hx = ppl[0].home[0] + 1; hy = ppl[0].home[1] + 1;
        city.x = (nx * NB) | 0; city.y = (ny * NB) | 0;
        render();
        return true;
      }
      return false;
    });
    ok('B2 there is a settlement with somebody to meet', found);
    await SETTLE(page, 2000);

    /* B3: A STRANGER HAS NOT SPOKEN TO YOU. YOU HAVE TO ASK (7/31). */
    const cold = await city.evaluate(() => {
      ctOpen();
      const c = document.getElementById('ctcard');
      return { html: c.innerHTML, said: /THEY SAID/.test(c.innerHTML) };
    });
    ok('B3 before you ask, nobody has said anything to you', cold.said === false);

    /* B4: ASK, AND THE PERSON ARRIVES. */
    const warm = await city.evaluate(() => {
      const btn = document.getElementById('ctask');
      if (btn) btn.click();
      const c = document.getElementById('ctcard');
      const html = c.innerHTML;
      const m = /THEY SAID<\/div><div class="v">“([^”]+)”/.exec(html);
      /* what the module says it should be, so this compares the SURFACE against
         the TABLE rather than against itself */
      const who = ctPerson(CT_OPEN);
      return { line: m ? m[1] : null, want: qkLine(who.key),
               asked: !!(CT_MET && CT_MET.asked(who.key)) };
    });
    ok('B5 asking their name gets you a person, not just a surname',
      !!warm.line && warm.line.length > 20, String(warm.line).slice(0, 60));
    ok('B6 and it is THIS person\'s line, from the table, not a generic one',
      warm.line === warm.want, warm.line + ' != ' + warm.want);

    /* B7: AND THE LINE IS ONE THIS SESSION ACTUALLY AUTHORED. B6 compares the
       card against the runtime, and both live in the same file -- if the runtime
       drifted they would drift together and agree. This checks the pixels he
       reads against records/BOHEMIA_QUIRKS.json, which is outside the browser
       entirely, so a wrong-but-consistent surface still fails. */
    let authored = false;
    for (const q of REC.quirks) {
      for (const n of REC.specifics[q.kind]) {
        for (const reg of ['lit', 'dark']) {
          if (q[reg].replace(/\{(it|p|r)\}/g, n) === warm.line) authored = true;
        }
      }
    }
    ok('B7 and that line is one of the ' + (REC.quirks.length * 2) + ' this repo '
      + 'authored, checked outside the browser', authored, String(warm.line).slice(0, 70));

    /* B7: THE LIGHT PICKS THE REGISTER, and it is the SAME person both times.
       Driven by forcing dayDark() rather than walking two blocks, because what
       is being proved is the wiring, and the wiring reads dayDark(). */
    const both = await city.evaluate(() => {
      const who = ctPerson(CT_OPEN);
      const rd = window.dayDark, rn = window.isNight;
      window.isNight = () => true;
      window.dayDark = () => false; const lit = qkLine(who.key);
      window.dayDark = () => true;  const dark = qkLine(who.key);
      window.isNight = () => false;
      const noon = qkLine(who.key);          /* unpowered lot at midday is not dark */
      window.dayDark = rd; window.isNight = rn;
      return { lit, dark, noon, specific: qkOf(who.key).specific, shape: qkOf(who.key).shape };
    });
    ok('B9 the same person says a different thing in the dark',
      both.lit && both.dark && both.lit !== both.dark);
    ok('B10 and it is the SAME trait and the SAME object in both, never two people',
      both.lit.indexOf(both.specific) >= 0 && both.dark.indexOf(both.specific) >= 0,
      both.specific);
    /* B11: THE DIAL IS NOT SOLDERED TO THE DREAD END. Measured on the real
       surface: 2.6% of people live on a live circuit, so a register decided by
       the power grid alone makes 97.4% of every conversation in the game the
       dark one and the joke never plays. Dark is a TIME as well as a place, and
       the renderer has always said so. An unpowered lot at midday is a lot. */
    ok('B11 an unpowered block at midday is not dark, the register is the city\'s '
      + 'own isNight() AND !live, not the power grid alone',
      both.noon === both.lit && both.noon !== both.dark);

    /* B10: THE ROW LANDS EVEN WHEN THE INTRODUCTION REFUSES THE NAME. */
    const refused = await city.evaluate(() => {
      const out = { tried: 0, refusedRows: 0, quirkRows: 0 };
      const all = ctEveryone();
      for (let i = 0; i < all.length && out.tried < 12; i++) {
        CT_OPEN = all[i];
        const who = ctPerson(all[i]);
        CT_MET.ask(who.key, 1);
        ctDraw();
        const html = document.getElementById('ctcard').innerHTML;
        out.tried++;
        if (/YOU DID NOT GET IT|NOBODY HAS INTRODUCED YOU|YOU HAVE NOT ASKED/.test(html)) {
          out.refusedRows++;
          if (/THEY SAID/.test(html)) out.quirkRows++;
        }
      }
      return out;
    });
    ok('B13 somebody who will not give a name still gives you them ('
      + refused.quirkRows + '/' + refused.refusedRows + ' refusals still spoke)',
      refused.refusedRows === 0 || refused.quirkRows === refused.refusedRows);

    /* B12: THE BLOCK, NOT THE NEIGHBOURHOOD, AND THE SURFACE HAS TO BE READING
       THE SPREAD. The first cut of the runtime spread over ctEveryone(), which
       is a 3x3 neighbourhood -- 458 people against 304 combinations -- and this
       assertion came back with exactly 154 duplicates, 458 minus 304. Two people
       in a district of four hundred sharing a habit is a CITY. Two people on one
       street sharing one is a copy-paste, and that is what this holds.
       It also proves the surface reads the SPREAD and not the raw draw: with
       458 people in scope the raw draw duplicates inside blocks too. */
    const onBlock = await city.evaluate(() => {
      const all = ctEveryone(), seenB = {}, seenRaw = {};
      let dup = 0, rawDup = 0, blocks = 0;
      for (let i = 0; i < all.length; i++) {
        const w = ctPerson(all[i]);
        const q = qkOf(w.key);
        if (!q) continue;
        const cut = String(w.key).lastIndexOf(':');
        const blk = cut > 0 ? w.key.slice(0, cut) : w.key;
        if (!seenB[blk]) { seenB[blk] = {}; seenRaw[blk] = {}; blocks++; }
        const id = q.shape + '|' + q.specific;
        if (seenB[blk][id]) dup++; seenB[blk][id] = 1;
        const r = BohemiaQuirk.quirkOf(w.key);
        const rid = r.shape + '|' + r.specific;
        if (seenRaw[blk][rid]) rawDup++; seenRaw[blk][rid] = 1;
      }
      return { n: all.length, blocks, dup, rawDup };
    });
    ok('B15 the raw draw really does collide on these streets (' + onBlock.rawDup
      + ' pairs across ' + onBlock.blocks + ' blocks), otherwise B14 proves nothing',
      onBlock.rawDup > 0);
    ok('B16 and on the streets he is standing among, no two people share a bit ('
      + onBlock.n + ' people, ' + onBlock.blocks + ' blocks, ' + onBlock.dup
      + ' duplicates)', onBlock.dup === 0);

    /* B17: THE SPREAD CACHE SURVIVES A DIAL CHANGE. It keys on the cell, and
       moving the population dial changes WHO is standing here without changing
       WHERE here is -- so a cell-only key would keep answering for a crowd that
       no longer exists and every new arrival would fall through to their raw
       (un-de-collided) draw. This lane already shipped that exact bug once with
       PPL_PEOPLE, which is why bohemia_population bumps RULES_V and its own
       comment says every consumer keys its cache on it. */
    const cache = await city.evaluate(() => {
      BohemiaPopulation.setDial(20);
      const a = qkSpread(), na = Object.keys(a || {}).length;
      BohemiaPopulation.setDial(1);
      const b = qkSpread(), nb = Object.keys(b || {}).length;
      BohemiaPopulation.setDial(20);
      return { na, nb, sameObject: a === b };
    });
    ok('B17 moving the population dial recomputes the spread (' + cache.na + ' -> '
      + cache.nb + ' people), a cache keyed only on the cell hands back the old crowd',
      cache.sameObject === false && cache.na !== cache.nb);

    /* ---- THE TELL, ON THE WALKED SURFACE (8/20) -------------------------
       tellFor() shipped authored and gated on 8/19 and nothing a player could
       see ever called it. Standing next to anybody, the entire text on screen
       was the button, and the button says their TRADE: eighty-eight people on a
       block and every one of them the word SCAVENGER. */
    const tellNear = await city.evaluate(() => {
      /* CLOSE THE CARD FIRST. ctVerb hides the button AND the tell whenever a
         card is open, which is correct behaviour and which the assertions above
         leave switched on -- they open cards and never close them. A probe that
         inherits another probe's state measures that state, not the feature. */
      try { ctClose(); } catch (_e) { CT_OPEN = null; }
      /* AND MAKE THEM STRANGERS AGAIN. B13 asks a dozen people their names to
         prove the refusal path, so by here the block is full of acquaintances
         and the stranger case cannot be measured. Resetting the met-ledger is
         how this asserts the LAW (a stranger has a tell and no name) instead of
         asserting whatever the assertions above happened to leave behind. */
      try { CT_MET = BohemiaPeople.makeLedger(null); } catch (_e) {}
      const all = ctEveryone();
      for (let i = 0; i < all.length; i++) {
        const w = ctPerson(all[i]);
        /* stand next to them the way the probe that FOUND this bug did: off the
           person's own home, +1 on both axes. ctAt() is where they are THIS
           minute and the schedule may have them elsewhere. */
        if (!all[i] || !all[i].home) continue;
        hx = all[i].home[0] + 1; hy = all[i].home[1] + 1;
        render(); ctVerb();
        const t = document.getElementById('cttell');
        if (t && getComputedStyle(t).display !== 'none') {
          /* WHO THE VERB IS ACTUALLY DESCRIBING. Standing beside all[i]'s house
             does not guarantee all[i] is the nearest body -- a neighbour can be
             closer, and ctAdjacent() is the one that decides. Comparing against
             the person I walked TO instead of the person the surface PICKED is
             how this went red while the feature was correct. */
          const adj = ctAdjacent();
          const w2 = adj ? ctPerson(adj) : w;
          const q = qkOf(w2.key);
          return { text: t.textContent, want: q && q.tell,
                   asked: !!(CT_MET && CT_MET.asked(w2.key)),
                   named: !!BohemiaPeople.nameOf(w2),
                   box: (r => [Math.round(r.x), Math.round(r.y), Math.round(r.right), Math.round(r.bottom)])(t.getBoundingClientRect()),
                   pad: (() => { const n = document.getElementById('nav');
                     if (!n) return null; const r = n.getBoundingClientRect();
                     return [Math.round(r.x), Math.round(r.y), Math.round(r.right), Math.round(r.bottom)]; })(),
                   events: getComputedStyle(t).pointerEvents };
        }
      }
      return null;
    });
    ok('B19 the TELL reaches the walked surface — what you notice about somebody ' +
      'before either of you speaks', !!(tellNear && tellNear.text));
    ok('B20 and it is THIS person\'s tell, from the block-de-collided spread',
      !!tellNear && tellNear.text === tellNear.want, tellNear && tellNear.text);
    /* A TELL IS NOT A NAME. YOU HAVE TO ASK (7/31) governs the name and nothing
       else: you can watch somebody straighten what is already straight without
       being introduced. */
    ok('B21 a STRANGER has a tell and still has no name — the 7/31 law is untouched',
      !!tellNear && tellNear.asked === false && tellNear.named === false);
    /* *** THE GEOMETRY, BECAUSE THE FIRST CUT FAILED IT. *** bottom:112 put the
       line straight through the movement pad: unreadable, and sitting on taps
       meant for the pad. Caught by SCREENSHOTTING it, not by any assertion that
       existed. Now it is an assertion. */
    ok('B22 the tell does not overlap the movement pad (tell ' +
      (tellNear && tellNear.box ? tellNear.box.join(',') : '?') + ' vs pad ' +
      (tellNear && tellNear.pad ? tellNear.pad.join(',') : 'none') + ')',
      !!tellNear && (!tellNear.pad ||
        tellNear.box[3] <= tellNear.pad[1] || tellNear.box[1] >= tellNear.pad[3] ||
        tellNear.box[2] <= tellNear.pad[0] || tellNear.box[0] >= tellNear.pad[2]));
    ok('B23 and it can never swallow a press whatever the HUD does under it',
      !!tellNear && tellNear.events === 'none');
    /* IT GOES AWAY. A caption about a person who is not there is a lie. */
    const tellGone = await city.evaluate(() => {
      hx = 4; hy = 4;                          /* nobody adjacent out here */
      render(); ctVerb();
      const t = document.getElementById('cttell');
      const b = document.getElementById('cttalk');
      return { tell: t ? getComputedStyle(t).display : null,
               verb: b ? getComputedStyle(b).display : null };
    });
    ok('B24 with nobody beside you the tell disappears, like the button',
      !!tellGone && tellGone.tell === 'none' && tellGone.verb === 'none');

    ok('B25 nothing threw while he met them', errs.length === 0, errs.slice(0, 3).join(' | '));
  } finally {
    await b.close();
  }

  console.log('QUIRK GATE: ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})();
