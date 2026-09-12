/* ============================================================================
   THE FACTION TOWNS GATE (9/5/26, WORLD lane)
   FACTION-TOWNS. Paolo 9/4, LOCKED:
     "each part of Vegas is owned by a faction and that's where you can do all your
      trading... the more bigger or more prominent factions kind of feel like strong
      fortress parts... and then for the smaller ones like the colorful maybe they
      just have... not a lot of goods not a lot of buildings not a lot of good
      quests and it's just smaller."

   Ship test (the row's own words): every selectable faction has a seat, a derived
   tier and a market reachable on the walked surface; the demo's first day reaches
   one.

   *** THE THING THIS GATE EXISTS TO STOP CAME BACK WITHIN ONE ROUND. ***
   Measured 9/5 before any of it was written: bohemia_loop.js seated factions by
   striding over cells passing bohemia_world.js's isAutoDistrict (3,919 of them),
   while the walked surface -- which cannot load that module at all -- counted
   4,009 by bohemia_cityedit.js's cat()=='sand'. Same seed, same valley, NINETY
   CELLS APART, so two different answers to where the Mob lives. Nothing had
   noticed, because nothing had ever asked the walked surface the question: its own
   FACTION_ASSIGN table is {} and its comment says so.
   Check 3 is the whole point of this file: it asks BOTH surfaces, through the
   SHIPPED module rather than through a rule retyped in the gate, and they must
   name the same fourteen seats. A comparison that reimplements one side proves
   nothing about the other -- the first draft of my own comparison did exactly
   that and reported a disagreement that was its own.

   node gates/faction_towns_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const T = require(path.join(ROOT, 'engine/bohemia_towns.js'));
const G = require(path.join(ROOT, 'engine/BOHEMIA_faction_graph.json'));
const CE = require(path.join(ROOT, 'engine/bohemia_cityedit.js'));
const W = require(path.join(ROOT, 'engine/bohemia_world.js'));
const PD = require(path.join(ROOT, 'engine/bohemia_payday.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('FACTION TOWNS GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (14 seats, tiers off his own power column, one seat rule for both'
            + ' surfaces, a market at every seat)');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. the tier, derived off his own numbers --------------------------- */
{
  const sel = T.selectable(G);
  ok('the fourteen selectable factions are the roster', sel.length === 14);
  const t1 = T.tiers(G, 1), t3 = T.tiers(G, 3);
  ok('every one of them gets a tier', Object.keys(t1).length === 14);
  ok('and every tier is one of his three',
     Object.keys(t1).every(k => T.TIERS.indexOf(t1[k].tier) >= 0));
  ok('every tier ships draft:true, so moving one is a single edit',
     Object.keys(t1).every(k => t1[k].draft === true));

  /* HIS OWN WORDS ARE THE TEST. He named "the colorful" as the small one, and
     Colorful is act1_power 1 of 14 in a graph he wrote months earlier. Nothing was
     tuned to make that land, which is why the derivation is trusted at all. */
  ok('COLORFUL IS A CAMP -- the faction he named as the small one, off his own'
     + ' power column and nothing else', t1.Colorful.tier === 'camp');
  ok('and the strongest faction in act 1 is a FORTRESS',
     t1.Remnants.tier === 'fortress' && t1.Remnants.power === 14);

  const n = k => Object.keys(t1).filter(x => t1[x].tier === k).length;
  ok('thirds, with the top rounding up (5 fortress / 4 town / 5 camp)',
     n('fortress') === 5 && n('town') === 4 && n('camp') === 5);

  /* THE CENTURY RULE WITH NO NEW FIELD. act3_power is already in his graph, so a
     fortress in act 1 really can be a camp by act 3 without a second table. */
  const moved = Object.keys(t1).filter(k => t1[k].tier !== t3[k].tier);
  ok('A FORTRESS IN ACT 1 CAN BE SOMETHING ELSE BY ACT 3, off act3_power alone'
     + ' (' + moved.length + ' factions move)', moved.length >= 3);
  ok('and Reds climb while Caravans fall, which is what his own graph says',
     t1.Reds.tier === 'town' && t3.Reds.tier === 'fortress'
     && t1.Caravans.tier === 'fortress' && t3.Caravans.tier === 'town');

  /* CONTENTS-PAOLO'S: both override doors ship shut. */
  ok('the seat override table ships EMPTY -- which faction sits where is his',
     Object.keys(T.SEATS).length === 0);
  ok('and so does the tier override', Object.keys(T.TIER).length === 0);
}

/* ---- 2. depth, which is the only axis his words give -------------------- */
{
  const goods = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
  const f = T.goodsFor('fortress', goods).length;
  const t = T.goodsFor('town', goods).length;
  const c = T.goodsFor('camp', goods).length;
  ok('A FORTRESS CARRIES EVERYTHING', f === goods.length);
  ok('A CAMP CARRIES LESS THAN A TOWN CARRIES LESS THAN A FORTRESS -- "not a lot'
     + ' of goods", as a count (' + c + '/' + t + '/' + f + ')', c < t && t < f);
  ok('and a camp still carries something -- a market with nothing in it is not a'
     + ' market', c >= 1);
  /* DEPTH, NOT PRICE. Everything is one battery wherever you buy it (8/15 + 9/4);
     a camp charging more would be a number nobody ruled.
     THE FIRST DRAFT OF THIS CHECK GREPPED THE SOURCE FOR /price/i AND WENT RED ON ITS
     OWN COMMENTS -- the module says "prices are Paolo's" and "a camp is not dearer",
     and a checker that cannot tell a mention from a use is the broken one (8/1 law,
     and this repo has now paid for it three times). It asks the DATA instead. */
  ok('DEPTH is a fraction of a shelf, never a price: every tier is 0..1',
     Object.keys(T.DEPTH).every(k => typeof T.DEPTH[k] === 'number'
       && T.DEPTH[k] > 0 && T.DEPTH[k] <= 1));
  ok('and goodsFor hands back the shelf rows UNTOUCHED -- it thins the list and'
     + ' never writes a number onto a good',
     T.goodsFor('camp', goods).every(g => typeof g === 'string')
     && T.goodsFor('camp', [{ good: 'water', price: 1 }])[0].price === 1);
}

/* ---- 3. ONE SEAT RULE, ASKED OF BOTH SURFACES --------------------------- */
(async () => {
  /* the loop's answer, through its own boot */
  const L = require(path.join(ROOT, 'engine/bohemia_loop.js'));
  const api = L.Loop || L;
  const ctx = (api.boot || api.bootAll || api.start)({ seed: 'bohemia' });
  const loop = {};
  Object.keys(ctx.factionBases || {}).forEach(k => { loop[k] = [ctx.factionBases[k].x, ctx.factionBases[k].y]; });
  ok('the loop seats all fourteen', Object.keys(loop).length === 14);

  let chromium;
  try { chromium = require('/opt/node22/lib/node_modules/playwright').chromium; }
  catch (e) { ok('playwright is available', false); done(); }
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
  for (let i = 0; i < 200; i++) { if (await pg.$('#daycardIn .dcgo')) break; await SETTLE(pg, 200); }
  await pg.$eval('#daycardIn .dcgo', el => el.click());
  await SETTLE(pg, 300);

  const city = await pg.evaluate(() => {
    const R = { seats: {}, tiers: {} };
    R.hasModule = typeof BohemiaTowns !== 'undefined';
    R.hasGraph = typeof BOHEMIA_FACTION_GRAPH !== 'undefined';
    const hs = BohemiaPayday.hubs(om);
    hs.filter(h => h.kind === 'seat').forEach(h => { R.seats[h.faction] = [h.x, h.y]; R.tiers[h.faction] = h.tier; });
    R.hubCount = hs.length;
    R.accreted = hs.filter(h => h.kind !== 'seat').length;
    const open = [(hx / FN) | 0, (hy / FN) | 0];
    R.opening = open;
    const nh = BohemiaPayday.nearestHub(om, open[0], open[1]);
    R.nearestCells = nh ? Math.max(Math.abs(nh.x - open[0]), Math.abs(nh.y - open[1])) : null;
    R.nearestKind = nh ? nh.kind : null;
    /* STAND IN A FORTRESS AND IN A CAMP AND OPEN EACH MARKET, the way the game does */
    const fort = hs.find(h => h.tier === 'fortress'), camp = hs.find(h => h.tier === 'camp');
    const visit = (h) => {
      MODE = 'human'; hx = h.x * FN + (FN >> 1); hy = h.y * FN + (FN >> 1); MKT_HUB_KEY = null;
      const at = mktAt();
      showMarket();
      return { at: at, rows: mktShelf().length,
               card: (document.getElementById('daycardIn') || {}).textContent || '' };
    };
    BohemiaPurse.credit(purseGet(), 'electricity', 3, 'gate:seed', null, 1);
    R.fortress = visit(fort); R.fortressFaction = fort.faction;
    R.camp = visit(camp); R.campFaction = camp.faction;
    /* AND HE CAN ACTUALLY BUY THERE */
    MODE = 'human'; hx = fort.x * FN + (FN >> 1); hy = fort.y * FN + (FN >> 1); MKT_HUB_KEY = null;
    const first = mktShelf()[0];
    const before = purseBalances().electricity;
    const r = mktBuy(first.good);
    R.bought = { good: first.good, ok: !!(r && r.applied), paid: r && r.paid,
                 cur: r && r.currency, before: before, after: purseBalances().electricity };
    return R;
  });
  await b.close();

  ok('the walked surface carries the towns module', city.hasModule === true);
  ok('and HIS OWN faction graph, spliced verbatim rather than retyped', city.hasGraph === true);
  ok('EVERY SELECTABLE FACTION HAS A SEAT ON THE SURFACE HE WALKS',
     Object.keys(city.seats).length === 14);
  ok('and a derived tier with it',
     Object.keys(city.tiers).length === 14
     && Object.keys(city.tiers).every(k => T.TIERS.indexOf(city.tiers[k]) >= 0));

  /* THE CHECK THIS WHOLE FILE IS FOR. */
  const differ = Object.keys(loop).filter(f => !city.seats[f]
    || city.seats[f][0] !== loop[f][0] || city.seats[f][1] !== loop[f][1]);
  ok('*** THE LOOP AND THE WALKED SURFACE NAME THE SAME FOURTEEN SEATS *** -- one'
     + ' rule, asked of both, not a rule retyped in this gate'
     + (differ.length ? ' -- differ: ' + differ.join(', ') : ''), differ.length === 0);

  /* A SEAT IS A MARKET. His ruling: the seat is "where you can do all your trading". */
  ok('the accreted markets are still there too -- a swap meet belongs to nobody and'
     + ' that is not a bug', city.accreted === 2);
  ok('A MARKET OPENS WHERE A FACTION SITS, on the walked surface',
     city.fortress.at === true && city.camp.at === true);
  ok('and the card says WHOSE town it is and WHAT SIZE',
     city.fortress.card.indexOf(city.fortressFaction.toUpperCase()) >= 0
     && /FORTRESS/.test(city.fortress.card)
     && city.camp.card.indexOf(city.campFaction.toUpperCase()) >= 0
     && /CAMP/.test(city.camp.card));
  ok('A CAMP IS THINNER THAN A FORTRESS ON THE REAL SHELF ('
     + city.camp.rows + ' vs ' + city.fortress.rows + ')', city.camp.rows < city.fortress.rows);
  ok('AND HE CAN BUY THERE, in batteries, with the money really leaving',
     city.bought.ok === true && city.bought.cur === 'electricity'
     && city.bought.after === city.bought.before - city.bought.paid);

  /* THE DEMO CLAUSE. Day 19 measured the first required person at a seven-hour
     round trip, and the whole valley carried exactly TWO markets, the nearer one
     38 cells from where the game opens. */
  ok('THE FIRST MARKET IS INSIDE THE FIRST DAY -- ' + city.nearestCells + ' cells'
     + ' from where the game opens (it was 38 with only the accreted two)',
     city.nearestCells != null && city.nearestCells <= 15);
  ok('and the nearest one is a faction seat', city.nearestKind === 'seat');

  ok('no page error across two towns and a purchase' + (errs.length ? ' -- ' + errs[0] : ''),
     errs.length === 0);

  /* ---- 4. the measured list stays measured ------------------------------ */
  /* NOT_A_TOWN was derived by asking the district kit how many buildings each kind
     carries, not by taste. If a kind's answer changes, this goes red rather than
     letting a list somebody once measured rot into a list somebody believes. */
  /* NOT_A_TOWN IS A MEASUREMENT, SO IT GETS RE-MEASURED. The question is not "is this
     kind always empty" -- that was the first cut and it left two markets on ground with
     nothing on it. A seat lands on ONE cell, so what matters is whether a kind can EVER
     be empty. Every kind that can is excluded; a kind that stops being able to should
     come OFF the list, and a kind that starts should go ON it, and both show up here. */
  const w = W.world(12345);
  const seen = {};
  for (let y = 0; y < w.n; y++) for (let x = 0; x < w.n; x++) {
    const c = w.at(x, y);
    if (!c || !c.district || CE.cat(c.district) !== 'sand') continue;
    const k = c.district;
    seen[k] = seen[k] || { cells: [], checked: 0, empty: 0 };
    seen[k].cells.push([x, y]);
  }
  Object.keys(seen).forEach(k => {
    const cells = seen[k].cells, step = Math.max(1, Math.floor(cells.length / 40));
    for (let i = 0; i < cells.length; i += step) {
      let p = null; try { p = w.plot(cells[i][0], cells[i][1]); } catch (e) { continue; }
      if (!p) continue;
      seen[k].checked++;
      if (!(p.buildings && p.buildings.length)) seen[k].empty++;
    }
  });
  const canBeEmpty = Object.keys(seen).filter(k => seen[k].checked && seen[k].empty > 0).sort();
  const listed = Object.keys(T.NOT_A_TOWN).sort();
  const missing = canBeEmpty.filter(k => !T.NOT_A_TOWN[k]);
  const stale = listed.filter(k => seen[k] && seen[k].checked && seen[k].empty === 0);
  ok('EVERY KIND THAT CAN BE EMPTY IS EXCLUDED -- a kind that is usually built and'
     + ' sometimes not will eventually put a market on nothing'
     + (missing.length ? ' -- missing: ' + missing.join(', ') : ''), missing.length === 0);
  ok('and nothing is excluded that no longer needs to be'
     + (stale.length ? ' -- stale: ' + stale.join(', ') : ''), stale.length === 0);
  ok('the list is not empty, so the exclusion is doing something ('
     + listed.length + ' kinds)', listed.length >= 1);

  /* ========================================================================
     5. AND HE CAN MOVE ONE. (9/6/26, VAMILY row [town sizes] TOWN-TIERS-ARE-HIS.)
     The row is one line with two halves: "the draft tiers off act1_power ship;
     HE MOVES ANY FACTION HE LIKES." The first half shipped 9/5 with this gate
     already holding it. The second did not exist -- moving one meant editing
     BohemiaTowns.TIER in a source file, and HE MUST BE ABLE TO DIRECT IT (8/12)
     says in as many words that "he tells me and I edit a file" is not shipped.
     ====================================================================== */
  {
    const ALPHA_SRC = require('fs').readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
    const CITY_SRC = require('fs').readFileSync(CITY, 'utf8');
    ok('THE TIER TABLE STILL SHIPS EMPTY -- who is a fortress is his, and the '
       + 'derived answer is only a draft until he says otherwise',
       Object.keys(T.TIER).length === 0);
    ok('*** AND THERE IS A DOOR HE CAN REACH WITHOUT A TEXT EDITOR. *** Tab: '
       + 'DIRECT, a fourth mode beside CUTSCENES, QUESTS and STANDING',
       /DIR_MODE==='towns'/.test(ALPHA_SRC) && /function dirTowns/.test(ALPHA_SRC)
       && /TOWN SIZES/.test(ALPHA_SRC));
    ok('it survives closing the phone', /DIR_T_KEY/.test(ALPHA_SRC)
       && /localStorage\.setItem\(DIR_T_KEY/.test(ALPHA_SRC));
    ok('AND THE WALKED CITY HONOURS IT, which is the half a dial usually misses: '
       + 'the city carries its OWN inlined copy of this module, so setting the '
       + 'table in the alpha reaches nothing down there without a message',
       /BOHEMIA_TOWN_TIERS/.test(ALPHA_SRC) && /BOHEMIA_TOWN_TIERS/.test(CITY_SRC)
       && /function ctTierApply/.test(CITY_SRC));
    ok('and the city remembers it too, so a cold demo does not quietly disagree '
       + 'with what he set', /CT_TIER_KEY/.test(CITY_SRC));

    /* *** AND HE CAN ACTUALLY PRESS IT. VERIFY ON THE REAL SURFACE. ***
       Every claim above is a grep, and a grep proves the code exists. The first
       cut of this panel passed all of them WHILE RENDERING NOTHING: window.
       BohemiaTowns is not in the alpha at all, and dirRender's shared branch
       RETURNS after calling dirDial(), which hides the host when the mode is not
       'standing'. Two separate faults, both invisible to source checks, both
       found on the first click. */
    const drive = await (async () => {
      const b2 = await chromium.launch();
      try {
        const p2 = await b2.newPage({ viewport: { width: 390, height: 844 } });
        const thrown = [];
        p2.on('pageerror', e => thrown.push(String(e.message).slice(0, 120)));
        await p2.route(/^https?:/, r => r.abort());
        await p2.goto('file://' + path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'),
                      { waitUntil: 'load', timeout: 180000 });
        await p2.waitForFunction(() => typeof dirRender === 'function', { timeout: 90000 });
        /* THE SPLASH IS TAPPED FIRST, and that is not politeness. Measured: with
           it up, #app is display:none and every button in the panel reports
           0x0 -- the identical false reading the FOLD button gave on 8/30, when
           a 44x174 control looked like a law violation. */
        await p2.evaluate(() => { const f = document.getElementById('front'); if (f) f.click(); });
        await p2.waitForTimeout(16000);
        await p2.evaluate(() => { const t = document.querySelector('.tab[data-p="direct"]'); if (t) t.click(); });
        await p2.evaluate(() => {
          const c = [...document.querySelectorAll('#dirMode *')].find(e => /TOWN SIZES/i.test(e.textContent || ''));
          if (c) c.click();
        });
        await p2.waitForTimeout(4500);
        return await p2.evaluate(async () => {
          const sleep = ms => new Promise(r => setTimeout(r, ms));
          const out = { thrown: [] };
          const host = document.getElementById('dirDial');
          out.shown = !!host && getComputedStyle(host).display !== 'none';
          const boxes = () => [...document.getElementById('dirDial').children];
          const colorful = () => boxes().find(e => /COLORFUL/.test(e.textContent || ''));
          out.rows = boxes().length;
          const b0 = colorful();
          out.found = !!b0;
          if (!b0) return out;
          out.before = (b0.textContent.match(/worked out from strength: (\w+) · sells (\d+)/) || []).slice(1);
          const btns = [...host.querySelectorAll('button')];
          out.buttons = btns.length;
          out.under44 = btns.filter(e => e.getBoundingClientRect().height < 44).length;
          const f = [...b0.querySelectorAll('button')].find(e => /^FORTRESS$/i.test((e.textContent || '').trim()));
          if (f) f.click();
          await sleep(2500);
          const b1 = colorful();
          out.after = (b1.textContent.match(/YOURS: (\w+) · sells (\d+)/) || []).slice(1);
          out.saved = localStorage.getItem('bohemia.dir.tiers.v1');
          /* AND THE WALKED CITY, ASKED WITH ITS OWN MODULE. */
          out.city = await new Promise(res => {
            const fr = document.getElementById('cityFrame');
            const h = e => { if (e.data && e.data.type === 'BOHEMIA_TOWN_ROWS') {
              window.removeEventListener('message', h);
              const c = e.data.rows.find(x => x.faction === 'Colorful');
              res(c ? c.tier + '/' + c.goods : '?'); } };
            window.addEventListener('message', h);
            fr.contentWindow.postMessage({ type: 'BOHEMIA_TOWN_ASK' }, '*');
            setTimeout(() => res('no reply'), 5000);
          });
          const w = [...colorful().querySelectorAll('button')].find(e => /^WORK IT OUT$/i.test((e.textContent || '').trim()));
          if (w) w.click();
          await sleep(2500);
          const b2 = colorful();
          out.back = (b2.textContent.match(/worked out from strength: (\w+) · sells (\d+)/) || []).slice(1);
          out.savedBack = localStorage.getItem('bohemia.dir.tiers.v1');
          return out;
        });
      } finally { await b2.close(); }
    })();

    ok('*** THE PANEL DRAWS FOURTEEN FACTIONS WHEN HE TAPS THE CHIP. *** The first '
       + 'cut rendered NOTHING and every source check above still passed: the towns '
       + 'module is not in the alpha, and dirRender returns after dirDial() hides '
       + 'the host',
       drive.shown && drive.found && drive.rows >= 14, JSON.stringify(drive).slice(0, 200));

    ok('*** AND PRESSING IT MOVES THE GAME, ON A REAL CANVAS. *** Colorful is his '
       + 'weakest faction, a camp by derivation selling ' + (drive.before || [])[1]
       + ' things; pressed to FORTRESS it sells ' + (drive.after || [])[1],
       String((drive.before || [])[0]).toUpperCase() === 'CAMP'
       && String((drive.after || [])[0]).toUpperCase() === 'FORTRESS'
       && Number((drive.after || [])[1]) > Number((drive.before || [])[1]));

    ok('…AND THE WALKED CITY AGREES THE SAME SECOND, asked with its own copy of the '
       + 'module rather than the alpha\'s idea of it (' + drive.city + ')',
       /^fortress\//.test(String(drive.city)));

    ok('it is written down so closing the phone does not undo it',
       String(drive.saved || '').indexOf('fortress') >= 0);

    ok('AND "WORK IT OUT" REALLY PUTS IT BACK, pressed rather than assumed',
       String((drive.back || [])[0]).toUpperCase() === 'CAMP'
       && String(drive.savedBack || '') === '{}');

    /* THE THUMB (44px), and the reading is only true with the splash tapped. */
    ok('EVERY CHIP IS A THUMB. ' + drive.buttons + ' buttons, ' + drive.under44
       + ' under 44px. The same measurement reads 0x0 with the splash still up, '
       + 'which is how a 44px control was reported as a law violation on 8/30',
       drive.buttons >= 40 && drive.under44 === 0);

    /* *** THE ONLY CLAIM THAT MATTERS: THE MOVE CHANGES THE GAME. *** A dial
       that repaints a label is worse than no dial. Colorful is act1_power 1, the
       bottom of his own graph and a CAMP by derivation; made a fortress it has
       to actually sell more. */
    const goods = Object.keys(require(path.join(ROOT, 'engine/bohemia_economy.js')).GOODS);
    const before = T.tiers(G, 1).Colorful.tier;
    const soldBefore = T.goodsFor(before, goods).length;
    const reachBefore = T.REACH[before];
    T.TIER.Colorful = 'fortress';
    const after = T.tiers(G, 1).Colorful;
    const soldAfter = T.goodsFor(after.tier, goods).length;
    const reachAfter = T.REACH[after.tier];
    delete T.TIER.Colorful;
    const back = T.tiers(G, 1).Colorful;
    ok('*** MOVING A FACTION CHANGES WHAT ITS MARKET SELLS AND HOW FAR ITS TOWN '
       + 'REACHES, not just a word. *** Colorful is his weakest faction and a camp '
       + 'by derivation: ' + soldBefore + ' goods over ' + (reachBefore * 2 + 1)
       + ' blocks. Made a fortress: ' + soldAfter + ' goods over '
       + (reachAfter * 2 + 1) + ' blocks',
       soldAfter > soldBefore && reachAfter > reachBefore);
    ok('…and it is marked HIS rather than derived the moment he sets it, so '
       + 'nothing downstream can mistake his ruling for my draft',
       after.ruled === true && after.draft === false);
    ok('AND "WORK IT OUT" PUTS IT BACK RATHER THAN FREEZING TODAY\'S ANSWER. The '
       + 'day he re-ranks a faction in the graph, an unruled tier follows it '
       + 'instead of quietly disagreeing',
       back.tier === before && back.ruled === false && back.draft === true);
    ok('and the table is empty again afterwards, so this gate left nothing behind',
       Object.keys(T.TIER).length === 0);
  }

  /* ==========================================================================
     A FACTION MINES ITS LAND  (9/11, VAMILY row [power territory])
     "every faction's territory carries its own battery-making buildings, so what
     a faction is worth is what its land makes; a fortress makes more than a camp;
     losing a block loses its output."
     ======================================================================== */
  {
    const _fs = require('fs');
    /* this gate had no overmap of its own; the towns checks above work off the
       loop and the browser. The mines reading is a MAP reading, so it needs one. */
    const OM = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
    const CITY_TXT = _fs.readFileSync(CITY, 'utf8');
    const ALPHA_TXT = _fs.readFileSync(path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'), 'utf8');
    const m2 = OM.buildOvermap(7);
    const ds2 = T.districtsOf(m2, CE.cat);
    const seats2 = T.derive(G, ds2, 1);
    const mi = T.minesOf(m2, CE.cat, seats2);

    ok('W1 THE GROUND THAT MAKES POWER IS A NAMED LIST, not every industrial-looking '
       + 'district (' + T.MAKES.join(', ') + ')',
       T.MAKES.length === 3 && T.MAKES.indexOf('solar') >= 0
       && T.MAKES.indexOf('dam') >= 0 && T.MAKES.indexOf('battery') >= 0);
    ok('W2 *** AND A SUBSTATION IS DELIBERATELY NOT ON IT. *** It steps voltage '
       + 'down and passes it along; it generates nothing, and counting it would be '
       + 'counting the wire as the well',
       T.MAKES.indexOf('substation') < 0);

    /* A SITE IS A BUILDING, NOT A CELL, and the dam is the check. */
    const cellsOf = {};
    for (let y = 0; y < m2.n; y++) for (let x = 0; x < m2.n; x++) {
      let c = null; try { c = m2.at(x, y); } catch (_e) {}
      if (c && c.district && T.MAKES.indexOf(c.district) >= 0)
        cellsOf[c.district] = (cellsOf[c.district] || 0) + 1;
    }
    const dams = mi.sites.filter(s => s.kind === 'dam');
    const solars = mi.sites.filter(s => s.kind === 'solar');
    ok('W3 *** A SITE IS A BUILDING, NOT A CELL. *** ' + cellsOf.solar + ' solar cells '
       + 'are ' + solars.length + ' farms, not ' + cellsOf.solar + ' generators',
       solars.length > 0 && solars.length < cellsOf.solar / 10);
    ok('W4 and the dam proves the unit is right: ' + cellsOf.dam + ' cells come back '
       + 'as ' + dams.length + ' site, which is Hoover',
       dams.length === 1 && dams[0].cells === cellsOf.dam);

    /* THE HOLDER IS DERIVED FROM TURF, AND A SPLIT SITE HAS AN ANSWER. */
    const tf2 = T.turf(m2, CE.cat, seats2);
    ok('W5 every site names a holder, and it is the one TURF names for its ground',
       mi.sites.length > 0 && mi.sites.every(s => {
         if (!s.faction) return false;
         const t = tf2.at(s.x, s.y);
         return !!t && !!t.faction;
       }));
    const split = mi.sites.filter(s => s.split);
    ok('W6 a site that straddles a border goes to whoever holds MOST of it, and '
       + 'this rule is exercised rather than theoretical (' + split.length + ' split: '
       + split.map(s => s.kind + ' ' + JSON.stringify(s.holders)).join(' ') + ')',
       split.every(s => {
         let best = -1, who = null;
         for (const f in s.holders)
           if (s.holders[f] > best || (s.holders[f] === best && who && f < who)) {
             best = s.holders[f]; who = f;
           }
         return s.faction === who;
       }));

    /* THE NUMBER IS HIS. */
    ok('W7 the yield carries HIS ruling rather than a number picked here ('
       + mi.ruling + ')',
       /EVERYTHING COSTS ONE/.test(mi.ruling) && T.PER_SITE_PER_DAY === 1);
    const totalSites = mi.sites.filter(s => s.faction).length;
    const totalPerDay = Object.values(mi.perDay).reduce((a, c) => a + c, 0);
    ok('W8 and a faction makes exactly one a day per site it holds, never a curve '
       + '(' + totalSites + ' held sites -> ' + totalPerDay + ' a day)',
       totalPerDay === totalSites);

    /* *** LOSING A BLOCK LOSES ITS OUTPUT. *** Derived, so this is provable by
       moving the ground and asking again rather than by reading the code. */
    {
      const site = mi.sites.find(s => s.faction);
      const holderWas = site.faction;
      const wasPerDay = T.minesFor(holderWas, m2, CE.cat, seats2).perDay;
      /* take the ground off them the only way the map allows: move the seats.
         Everybody else keeps theirs, so anything that moves is this one site. */
      const without = seats2.filter(s => s.faction !== holderWas);
      const after = T.minesFor(holderWas, m2, CE.cat, without);
      const mi2 = T.minesOf(m2, CE.cat, without);
      ok('W9 *** LOSING THE GROUND LOSES THE OUTPUT. *** ' + holderWas + ' made '
         + wasPerDay + ' a day; with their seats gone they make ' + after.perDay
         + ', and the site is now ' + mi2.sites.filter(s => s.kind === site.kind
             && s.x === site.x).map(s => s.faction).join(''),
         wasPerDay > 0 && after.perDay === 0 && after.makesNothing === true);
      ok('W10 and the valley did not lose the site, somebody else picked it up -- '
         + 'output MOVES rather than evaporating',
         mi2.sites.filter(s => s.faction).length === totalSites);
      ok('W11 DERIVED, NEVER STORED: asking the original seats again gives the '
         + 'original answer, so there is no state to put back',
         T.minesFor(holderWas, m2, CE.cat, seats2).perDay === wasPerDay);
    }

    /* AN HONEST ZERO. */
    const sel = T.selectable(G);
    const nothing = sel.filter(f => !mi.perDay[f]);
    ok('W12 *** MOST OF THE VALLEY MAKES NOTHING, AND THAT IS THE MAP RATHER THAN '
       + 'A GAP. *** ' + nothing.length + ' of ' + sel.length + ' hold no ground '
       + 'that makes power (' + nothing.slice(0, 4).join(', ') + '...)',
       nothing.length > sel.length / 2);
    ok('W13 and a faction with none says so as a real answer instead of throwing',
       T.minesFor(nothing[0], m2, CE.cat, seats2).makesNothing === true
       && T.minesFor(nothing[0], m2, CE.cat, seats2).perDay === 0);

    /* *** AND NO TIER MULTIPLIER WAS INVENTED TO FORCE HIS SENTENCE TRUE. ***
       The row says "a fortress makes more than a camp". On this map that is
       FALSE and the counterexample is the strongest faction he wrote. Making it
       true would have meant typing a number nobody ruled, over a map that is his
       (MAP LAW). It is reported instead. */
    {
      const tt = T.tiers(G, 1);
      const forts = sel.filter(f => tt[f] && tt[f].tier === 'fortress');
      const dead = forts.filter(f => !mi.perDay[f]);
      ok('W14 *** A FORTRESS DOES NOT AUTOMATICALLY MAKE MORE THAN A CAMP, AND THE '
         + 'COUNTEREXAMPLE IS NAMED RATHER THAN PAPERED OVER. *** ' + dead.length
         + ' of ' + forts.length + ' fortresses make NOTHING (' + dead.join(', ')
         + '), because the map decides where the solar is',
         dead.length > 0);
      ok('W15 so the reading applies no tier scaling at all -- output is sites '
         + 'held, and DEPTH/REACH are left to the things they already scale',
         totalPerDay === totalSites);
    }

    /* THE SURFACES REALLY ASK. */
    ok('W16 the walked city reads it and can say it in words',
       /function minesGrid\(\)/.test(CITY_TXT) && /function minesLine\(/.test(CITY_TXT)
       && /minesPerDay\(/.test(CITY_TXT));
    ok('W17 and the panel he reads faction worth on carries it, off the real '
       + 'module rather than a number retyped up there',
       /perDay: minesPerDay\(f\), makes: minesLine\(f\)/.test(CITY_TXT)
       && /its land makes/.test(ALPHA_TXT));
  }

  /* ==========================================================================
     THE BLOCK PAYS ITS OWNER  (9/12, VAMILY row [block rent])
     "living or working on a faction's block costs a monthly cut in batteries paid
     to that faction; a fortress charges more than a camp; a faction can cut a
     block off when a block does not pay; the cut lands in the purse ledger."
     ======================================================================== */
  {
    const _fs2 = require('fs');
    const OM2 = require(path.join(ROOT, 'engine/bohemia_overmap.js'));
    const PU = require(path.join(ROOT, 'engine/bohemia_purse.js'));
    const CITY_TXT2 = _fs2.readFileSync(CITY, 'utf8');
    const m3 = OM2.buildOvermap(7);
    const seats3 = T.derive(G, T.districtsOf(m3, CE.cat), 1);
    const tierOf = {}; seats3.forEach(s => { tierOf[s.faction] = s.tier; });
    const fort = seats3.find(s => s.tier === 'fortress').faction;
    const camp = seats3.find(s => s.tier === 'camp').faction;
    const town = seats3.find(s => s.tier === 'town').faction;

    ok('N1 the rent is a READING over ground he used, and it carries HIS ruling '
       + 'rather than a price (' + T.rentOn({ [fort]: 1 }, seats3).ruling + ')',
       /EVERYTHING COSTS ONE/.test(T.rentOn({ [fort]: 1 }, seats3).ruling));

    /* *** A FORTRESS CHARGES MORE THAN A CAMP, AND IT DOES IT WITHOUT A PRICE. *** */
    {
      const nine = T.rentOn({ [fort]: 9, [town]: 9, [camp]: 9 }, seats3);
      const by = {}; nine.rows.forEach(r => { by[r.faction] = r.billed; });
      ok('N2 *** A FORTRESS CHARGES MORE THAN A CAMP *** -- nine blocks of each: '
         + fort + '(fortress) ' + by[fort] + ', ' + town + '(town) ' + by[town]
         + ', ' + camp + '(camp) ' + by[camp],
         by[fort] > by[town] && by[town] > by[camp]);
      ok('N3 and it charges more by billing MORE OF WHAT YOU USED, never a bigger '
         + 'price -- the shares are his thirds, straight off DEPTH, the same table '
         + 'and the same Math.ceil that goodsFor already uses',
         by[fort] === Math.ceil(9 * T.DEPTH.fortress)
         && by[town] === Math.ceil(9 * T.DEPTH.town)
         && by[camp] === Math.ceil(9 * T.DEPTH.camp));
      ok('N4 no faction is ever billed for ground it does not hold, and never for '
         + 'more blocks than you actually used',
         nine.rows.every(r => r.billed <= r.used && r.billed >= 1));
      /* THE HONEST LIMIT, ASSERTED SO NOBODY LATER READS IT AS A BUG. */
      const one = T.rentOn({ [fort]: 1, [camp]: 1 }, seats3);
      const b1 = {}; one.rows.forEach(r => { b1[r.faction] = r.billed; });
      ok('N5 AND AT ONE BLOCK THEY ARE EQUAL, which is the rounding and not a '
         + 'fault: a third of one block is still one block, so the tiers only '
         + 'separate once he has walked more of somebody\'s ground',
         b1[fort] === 1 && b1[camp] === 1);
    }

    /* *** IT IS A TRANSFER, NOT A FIFTH VERB. *** */
    {
      const purse = PU.create();
      PU.credit(purse, 'electricity', 3, 'test float', null, 1);
      const r1 = PU.transferOut(purse, 'electricity', 1, 'rent on ' + fort + ' ground', fort, 1);
      ok('N6 *** RENT MOVES MONEY, IT DOES NOT DRAIN IT. *** The four verbs are '
         + 'FROZEN and each currency is spent by exactly one verb (day 23), and '
         + 'electricity is already spent by night:power. A drain CONSUMES; rent '
         + 'goes to somebody with a name, which is what transfer is for',
         r1.applied === true && r1.entry.kind === 'transfer');
      ok('N7 and the ledger names WHO received it, so a battery is never anonymous',
         r1.entry.ref === fort && /rent on /.test(r1.entry.reason));
      ok('N8 no fifth verb was added -- the frozen four are untouched and a fifth '
         + 'is still refused by name',
         Object.keys(PU.VERBS).length === 4
         && PU.upkeep(purse, 'block:rent', null, 1).reason === 'NO_SUCH_VERB');
      /* AND YOU CANNOT PAY WHAT YOU DO NOT HAVE. */
      PU.transferOut(purse, 'electricity', 1, 'rent', fort, 1);
      PU.transferOut(purse, 'electricity', 1, 'rent', fort, 1);
      const broke = PU.transferOut(purse, 'electricity', 1, 'rent', fort, 1);
      ok('N9 an empty purse REFUSES the rent rather than going negative, and the '
         + 'refusal is the record the cut-off reads (' + broke.reason + ')',
         broke.applied === false && broke.reason === 'INSUFFICIENT');
    }

    /* THE CITY REALLY DOES IT, AND IT ASKS THE RIGHT DOOR. */
    ok('N10 the walked city bills at nightfall, after the night\'s own power bill',
       /try\{ nightPower\(\); \}catch\(_e\)\{\}\s*[\s\S]{0,400}?try\{ blockRent\(\); \}catch\(_e\)\{\}/
         .test(CITY_TXT2));
    ok('N11 and it counts BLOCKS of each faction\'s ground he used, which a list '
       + 'of names could never have given',
       /TURF_USED\[t\.faction\]=\(TURF_USED\[t\.faction\]\|\|0\)\+1/.test(CITY_TXT2));
    /* READ THE FUNCTIONS, NOT THE FILE. The first cut of this claim tested a
       regex against the whole 4 MB page for "payTo ... rent", which is string
       arithmetic that can match anything and went red while the behaviour was
       right. The claim is about what the RENT PATH calls, so it reads exactly
       those two function bodies. */
    const rentBody = (CITY_TXT2.match(/function blockRent\(\)[\s\S]*?\n\}/) || [''])[0]
                   + (CITY_TXT2.match(/function rentCutOff\([\s\S]*?\n\}/) || [''])[0];
    ok('N12 *** WHO YOU PAY IS TURF, NOT THE GRID. *** payTo answers who owns the '
       + 'WIRE and is null wherever there is no circuit, which is most of the '
       + 'valley and includes the block he wakes on. The rent path asks turf and '
       + 'never asks payTo (' + rentBody.length + ' chars read)',
       /* WIDENED 9/12 BY [own power], AND THE CLAIM IS UNCHANGED. This pinned the
          literal `rentOn(TURF_USED`, and [own power] now hands rentOn a DISCOUNTED
          COPY of TURF_USED -- the same map with the blocks he powers himself taken
          out -- so the variable at the call site has a different name while the
          source of truth is still turf. The claim this check exists for is WHO YOU
          PAY IS TURF AND NOT THE GRID, and both halves of it are asserted exactly
          as before: the body must still build its bill from TURF_USED and must
          still never mention payTo. Only the name at the call site is allowed to
          vary. This is fixing a ruler that got too literal, not loosening a check
          to make somebody's work pass -- the payTo half, which is the half that
          caught a real bug, is untouched and still absolute. */
       rentBody.length > 400 && /\bTURF_USED\b/.test(rentBody)
       && /rentOn\(/.test(rentBody)
       && /turfAt\(/.test(rentBody) && rentBody.indexOf('payTo') < 0);
    ok('N13 the cut-off is the LIGHTS, through the douse the grid already ships '
       + 'and the save already carries, and only on THAT faction\'s own ground',
       /function rentCutOff/.test(CITY_TXT2)
       && /t\.faction!==faction/.test(CITY_TXT2)
       && /POWER\.douse\(s\.id\)/.test(CITY_TXT2));
    ok('N14 and nothing here invents a standing change: what an unpaid debt does '
       + 'to how they FEEL about you is a weight, and weights are his',
       !/ctDialApply|DEED_WEIGHT|rungFor/.test(
         (CITY_TXT2.match(/function blockRent\(\)[\s\S]*?\n\}/) || [''])[0]));
    ok('N15 the reckoning says who collected and what it cost, in words',
       /took '\+_r\.paid/.test(CITY_TXT2) && /cut '\+_r\.short/.test(CITY_TXT2));
    ok('N16 and the day\'s tally resets at the wake, where the day starts',
       /TURF_USED=\{\}; TURF_SEENCELL=\{\}/.test(CITY_TXT2));
  }

  /* ==========================================================================
     THE LENDER VISITS THE HEIR  (9/12, VAMILY row [collector heir])
     "on the first day after the fold, the faction your parent owed comes to you;
     the first line the heir hears in their own life is the parent's debt."
     ======================================================================== */
  {
    const _fs3 = require('fs');
    const CITY3 = _fs3.readFileSync(CITY, 'utf8');
    const FOLD = _fs3.readFileSync(path.join(ROOT, 'engine/bohemia_fold.js'), 'utf8');

    ok('C1 nobody is owed out of an empty book, and that is a real answer rather '
       + 'than a throw', T.owedTo({}).length === 0 && T.collectorAt({}, 2) === null);

    const book = { Mob:   { nights: 1, lastDay: 4 },
                   Cartel:{ nights: 3, lastDay: 9 },
                   Blues: { nights: 3, lastDay: 2 } };
    const ranked = T.owedTo(book);
    ok('C2 WORST FIRST, and a tie breaks on the MORE RECENT night before it breaks '
       + 'on the name -- never on object key order, which is not a rule anybody can '
       + 'argue with (' + ranked.map(r => r.faction + ':' + r.nights).join(' ') + ')',
       ranked[0].faction === 'Cartel' && ranked[1].faction === 'Blues'
       && ranked[2].faction === 'Mob');
    ok('C3 a faction with zero nights is not owed anything',
       T.owedTo({ Mob: { nights: 0, lastDay: 9 } }).length === 0);

    const c = T.collectorAt(book, 2);
    ok('C4 the collector is the one owed worst, and knows how many others there are',
       c.faction === 'Cartel' && c.nights === 3 && c.others === 2);
    ok('C5 and the words are attempts, draft:true, like every line in this repo',
       c.draft === true && !!c.came && !!c.what && !!c.still);
    ok('C6 one night reads differently from many, because "he owed you" is vaguer '
       + 'than a count',
       T.collectorAt({ A: { nights: 1, lastDay: 1 } }, 2).what !== c.what);

    /* *** THE BILL DIES, THE CREDITOR DOES NOT -- AND THE SHIPPED FOLD IS WHY. *** */
    ok('C7 *** NOT ONE NUMBER IS COLLECTED. *** engine/bohemia_fold.js rules the '
       + 'debt field DIES, ruled:true, in his study\'s own words: a child is not '
       + 'personally liable for a parent\'s unsecured debts. So a collector who '
       + 'named a sum would be collecting a bill the game has already said the '
       + 'heir does not owe',
       /field: 'debt'[\s\S]{0,80}carries: 'dies'/.test(FOLD)
       && /not personally liable/.test(FOLD)
       && !/\d/.test(c.came + c.what + c.still));
    ok('C8 and what crosses is the fold\'s own other half -- "YOU INHERIT THE '
       + 'PEOPLE HE OWED, still standing there" -- which is a NAME and a COUNT OF '
       + 'NIGHTS, never a balance',
       /INHERIT THE PEOPLE HE OWED/.test(FOLD)
       && Object.keys(book).every(f => typeof book[f].nights === 'number'));

    /* THE CITY REALLY DOES IT. */
    ok('C9 the one way to owe anybody in this game is rent you could not pay, and '
       + 'that is where the book is written',
       /if\(short>0\)\{ rentCutOff\(r\.faction, short\); owedNote\(r\.faction\); \}/
         .test(CITY3));
    ok('C10 it rides its own save key, beside the doused set, so a valley reset '
       + 'cannot quietly forgive everybody',
       /var OWED_LS='boh\.city\.owed'/.test(CITY3) && /function owedPersist/.test(CITY3));
    ok('C11 the fold records WHICH generation they are owed by, so the heir is '
       + 'never told that they owe it',
       /function owedFold/.test(CITY3) && /try \{ owedFold\(\); \} catch/.test(CITY3));
    ok('C12 *** AND IT IS THE FIRST THING ON THE HEIR\'S MORNING CARD. *** The row '
       + 'says the first line the heir hears; it is built into the wake card above '
       + 'the phone offer, not stacked on top of it as a second card',
       /COLLECTOR_AT\.came/.test(CITY3)
       && CITY3.indexOf('COLLECTOR_AT.came') < CITY3.indexOf('Something came in on your phone'));
    ok('C13 once per generation, so the second morning is quiet -- the difference '
       + 'between a collector and a nag',
       /function owedVisitMark/.test(CITY3) && /COLLECTOR_SEEN>=at/.test(CITY3));
    ok('C14 and nothing here touches standing: what an unpaid debt does to how they '
       + 'FEEL about you is a weight, and weights are his',
       !/DEED_WEIGHT|ctDialApply|rungFor/.test(
         (CITY3.match(/function owedNote[\s\S]*?function owedVisitMark[\s\S]*?\n\}/) || [''])[0]));
  }

  done();
})();
