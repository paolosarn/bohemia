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
    /* WIDENED AGAIN 9/13 BY [rent visible], AND THE CLAIM IS STILL UNCHANGED.
       Showing him the bill before the day is spent means asking the same question
       in the afternoon, so WHAT THEY CAN BILL YOU FOR moved out of blockRent into
       rentBillable() -- one body, two callers, which is the whole point of it.
       The rent PATH is therefore three functions now and this reads all three.
       Both halves of the claim are asserted exactly as before: the path must
       build its bill from TURF_USED and must never mention payTo. Following the
       code is not loosening the check; reading only one of three functions and
       calling it the path would be. */
    const rentBody = (CITY_TXT2.match(/function rentBillable\([\s\S]*?\n\}/) || [''])[0]
                   + (CITY_TXT2.match(/function blockRent\(\)[\s\S]*?\n\}/) || [''])[0]
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
       /* the douse call keeps its claim and loses its variable name: [rent
          visible] sorts the candidates by distance first, so the id comes off a
          row rather than off the cell it was just read from. What matters is
          that it goes through the grid's own douse and nothing else. */
       && /POWER\.douse\([A-Za-z_$][\w$.\[\]]*\)/.test(rentBody));
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

  /* ==========================================================================
     WHOSE FOOTPRINTS ARE THESE  (9/12, VAMILY row [tracks read])
     "every faction leaves its own tracks on the map, so a player can look at the
     ground and know who went through and whether to follow or avoid them."
     ======================================================================== */
  {
    const _fs4 = require('fs');
    const CITY4 = _fs4.readFileSync(CITY, 'utf8');
    const out = { from: { faction: 'Mob', x: 10, y: 10 }, to: { x: 16, y: 13 },
                  at: { x: 14, y: 12 }, arrived: false, agenda: 'patrol' };
    const back = { from: { faction: 'Mob', x: 10, y: 10 }, to: { x: 16, y: 13 },
                   at: { x: 13, y: 12 }, arrived: true, agenda: 'patrol' };

    const t1 = T.trackOf(out);
    ok('K1 a track is the cells they have ALREADY covered, and it ends where they '
       + 'are standing (' + JSON.stringify(t1) + ')',
       t1.length > 1 && t1[t1.length - 1][0] === out.at.x
       && t1[t1.length - 1][1] === out.at.y);
    ok('K2 and it STARTS where this leg started, which is the seat on the way out',
       t1[0][0] === out.from.x && t1[0][1] === out.from.y);
    const t2 = T.trackOf(back);
    ok('K3 *** A PARTY THAT HAS TURNED ROUND LEAVES A DIFFERENT TRAIL. *** Its leg '
       + 'begins at the border it reached, not back at its seat, so the trail '
       + 'points the way it is walking NOW (' + JSON.stringify(t2) + ')',
       t2[0][0] === back.to.x && t2[0][1] === back.to.y
       && t2[t2.length - 1][0] === back.at.x);
    ok('K4 a party that has not moved yet has one cell and not an empty answer',
       T.trackOf({ from: { faction: 'X', x: 5, y: 5 }, to: { x: 9, y: 9 },
                   at: { x: 5, y: 5 }, arrived: false }).length === 1);
    ok('K5 nothing is stored: the same party asked twice gives the same trail, and '
       + 'no field on it is written',
       JSON.stringify(T.trackOf(out)) === JSON.stringify(t1)
       && out.at.x === 14 && out.at.y === 12 && !('track' in out));
    ok('K6 the cap keeps the NEWEST cells, because the fresh end is the one you '
       + 'read', (function () { const c = T.trackOf(out, 3);
         return c.length === 3 && c[2][0] === out.at.x && c[2][1] === out.at.y; })());
    ok('K7 a bad party is a null answer rather than a throw',
       T.trackOf(null).length === 0 && T.trackOf({}).length === 0);

    /* WHO WENT THROUGH A CELL */
    ok('K8 it names who went through a cell, how long ago in steps, and which leg',
       (function () { const w = T.tracksAt([out], 12, 12);
         return w && w.faction === 'Mob' && w.agenda === 'patrol'
             && w.leg === 'out' && typeof w.age === 'number'; })());
    ok('K9 and nothing at all where nobody walked, which is most of the valley',
       T.tracksAt([out], 99, 99) === null);
    ok('K10 *** THE FRESHEST SET OF PRINTS WINS. *** Two parties crossing one cell '
       + 'is one trail on top of another, and the one on top is the one you read',
       (function () {
         const old = { from: { faction: 'Reds', x: 0, y: 0 }, to: { x: 30, y: 30 },
                       at: { x: 30, y: 30 }, arrived: false, agenda: 'caravan' };
         const fresh = { from: { faction: 'Blues', x: 11, y: 11 }, to: { x: 13, y: 13 },
                         at: { x: 12, y: 12 }, arrived: false, agenda: 'crew' };
         return T.tracksAt([old, fresh], 12, 12).faction === 'Blues';
       })());

    /* THE SURFACES */
    ok('K11 the map paints tracks in the SAME ink as the borders, so a faction\'s '
       + 'track and its ground read as the same people -- no second colour decision',
       /__WHOSE_FOOTPRINTS_ARE_THESE__/.test(CITY4)
       && /g\.strokeStyle = __holderInk\(__who, __mineP\)/.test(CITY4));
    ok('K12 it is a TRAIL AND NOT A DOT, and it fades toward where they set out, '
       + 'so the bright end is the direction of travel -- which is the half that '
       + 'answers follow or avoid',
       /var __f = __ci \/ \(__tr\.length - 1\)/.test(CITY4)
       && /__f \* \(__mineP \? 0\.55 : 0\.42\)/.test(CITY4));
    ok('K13 and the render publishes what it really painted, the way the borders '
       + 'already do -- a grep proves code exists, this proves a canvas was marked',
       /window\.__TRACK_INK = __tk/.test(CITY4));
    ok('K14 the street reads the ground under him and speaks only when the answer '
       + 'CHANGES, so the shared line is never buried',
       /function trackSay/.test(CITY4) && /if\(k===_lastTrack\) return;/.test(CITY4));
    ok('K15 *** AND STEPPING OFF THE PRINTS CLEARS THEM, BUT ONLY ITS OWN WORDS. *** '
       + 'The street line is shared with the pack and the road, so it is cleared '
       + 'only while it still says exactly what this put there',
       /l\.textContent===_trackWrote/.test(CITY4) && /_trackWrote=l\.textContent/.test(CITY4));
    ok('K16 NO MEMORY LENGTH IS INVENTED: the trail is the leg they are walking, '
       + 'and the only cap is named a rendering bound in its own comment',
       /a RENDERING bound/.test(CITY4) || /a screen bound/.test(CITY4));
  }

  /* *** THE WALKED SURFACE, DRIVEN, FOR [recruit anywhere]. ***
     A grep proves the code exists. This opens the game, stands on real ground,
     makes a real enemy through the between ledger's own door, climbs a real
     outfit's ladder with the belonging module's own writer, and reads the card
     he taps. Nothing below is computed by this gate: every number comes back
     from the page. */
  let RECRUIT = null;
  try {
    const b3 = await chromium.launch();
    try {
      const p3 = await b3.newPage({ viewport: { width: 390, height: 844 } });
      const e3 = []; p3.on('pageerror', e => e3.push(e.message));
      await p3.route(/^https?:/, r => r.abort());
      await p3.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
      for (let i = 0; i < 200; i++) { if (await p3.$('#daycardIn .dcgo')) break; await SETTLE(p3, 200); }
      await p3.$eval('#daycardIn .dcgo', el => el.click());
      await SETTLE(p3, 400);
      RECRUIT = await p3.evaluate(() => {
        const at = (x, y) => { MODE = 'human'; hx = x * FN + (FN >> 1); hy = y * FN + (FN >> 1); };
        const R = {};
        const w = ctJoinersHere();
        R.waking = { holder: w.holder, tier: w.tier, here: w.here, total: w.total };

        /* every seat, so the tier difference is measured and not anecdotal */
        const hs = BohemiaPayday.hubs(om).filter(h => h.kind === 'seat');
        const best = { fortress: 0, town: 0, camp: 0 };
        hs.forEach(h => { at(h.x, h.y); const j = ctJoinersHere();
          if (j && best[j.tier] != null && j.spare.length > best[j.tier]) best[j.tier] = j.spare.length; });
        R.spareByTier = best;

        /* A FACTION THAT HATES YOU: earned, not asserted. */
        /* THE BUSIEST CARTEL BLOCK, not the first one found. The first cut took
           the first match and landed on a cell with ONE person on it, so "their
           ground now offers nobody" was a claim about a single body -- true, and
           far too thin to be proof. */
        let cc = null, ccN = -1;
        for (let x = 0; x < 96; x += 3) for (let y = 0; y < 96; y += 3) {
          const t = turfAt(x, y);
          if (!t || String(t.faction).toUpperCase() !== 'CARTEL') continue;
          at(x, y); const n = (ctEveryone() || []).length;
          if (n > ccN) { ccN = n; cc = [x, y]; }
        }
        at(cc[0], cc[1]);
        const b4 = ctJoinersHere();
        const made = BohemiaBetween.earn(ctBelongSave(), 'Remnants', 'inside', 1);
        ctAgainstBump();
        const a4 = ctJoinersHere();
        R.cartel = { earned: made.some(e => String(e.to).toUpperCase() === 'CARTEL' && e.war),
                     before: b4.total, after: a4.total, why: a4.refused };
        /* and somebody uninvolved */
        let oc = null, ocN = -1;
        for (let x = 0; x < 96; x += 6) for (let y = 0; y < 96; y += 6) {
          const t = turfAt(x, y);
          if (!t || !t.faction || String(t.faction).toUpperCase() === 'CARTEL') continue;
          at(x, y); const n = (ctEveryone() || []).length;
          if (n > ocN) { ocN = n; oc = [x, y]; }
        }
        at(oc[0], oc[1]);
        const oo = ctJoinersHere();
        R.other = { total: oo.total, refused: oo.refused };

        /* YOUR STANDING THERE, moved with the belonging module's own writer */
        at(48, 48);
        const c1 = ctJoinersHere();
        const rb = ctRungWith('Church');
        for (let d = 1; d <= 3; d++) BohemiaBelonging.record(ctBelongSave(), 'Church', d);
        const c2 = ctJoinersHere();
        R.church = { before: c1.total, after: c2.total, rungBefore: rb,
                     rungAfter: ctRungWith('Church'),
                     strangerAfter: c2.passed.filter(p => p.why === 'stranger').length };

        /* THE CARD HE TAPS */
        showStanding();
        R.card = (document.getElementById('daycardIn') || {}).textContent || '';
        R.cardBits = (R.card.match(/WOULD COME WITH YOU\d+ of \d+ here/) || [''])[0];
        try { cardHide(); } catch (e) {}
        /* AND THE TOWN'S MARKET CARD */
        const seat = hs[0];
        at(seat.x, seat.y); MKT_HUB_KEY = null;
        showMarket();
        R.marketCard = (document.getElementById('daycardIn') || {}).textContent || '';
        return R;
      });
      RECRUIT.errs = e3.length;
    } finally { await b3.close(); }
  } catch (e) { RECRUIT = null; }

  /* ==========================================================================
     WHO WILL JOIN YOU DEPENDS ON WHERE YOU STAND  (9/13, row [recruit anywhere])
     Paolo 9/11: "recruiting from different factions and cities." Who is
     available depends on the ground you are on, who holds it, and your standing
     there; a fortress offers different people than a camp; a faction that hates
     you offers nobody; the people are the ones already in the valley with jobs
     and standing, never spawned for the menu.
     ======================================================================== */
  {
    const _fs5 = require('fs');
    const CITY5 = _fs5.readFileSync(CITY, 'utf8');
    const ORDER = ['worker', 'scav', 'keeper', 'watch'];
    const crowd = (spec) => {
      const out = [];
      Object.keys(spec).forEach(k => { for (let i = 0; i < spec[k]; i++)
        out.push({ who: k + i, kind: k, faction: null, against: null, mine: false }); });
      return out;
    };
    const MIX = crowd({ scav: 5, worker: 3, keeper: 2, watch: 1 });

    /* --- A FORTRESS OFFERS DIFFERENT PEOPLE THAN A CAMP --- */
    const f = T.joinersOn({ faction: 'Mob', tier: 'fortress' }, MIX, { order: ORDER });
    const t = T.joinersOn({ faction: 'Mob', tier: 'town' }, MIX, { order: ORDER });
    const c = T.joinersOn({ faction: 'Mob', tier: 'camp' }, MIX, { order: ORDER });
    ok('L1 *** A FORTRESS OFFERS DIFFERENT PEOPLE THAN A CAMP, and it is his own '
       + 'DEPTH table doing it -- goodsFor, the SAME call that cuts a camp\'s '
       + 'shelf, pointed at the trades standing on the ground *** ('
       + f.spare.length + '/' + t.spare.length + '/' + c.spare.length + ' trades)',
       f.spare.length === 4 && t.spare.length === 3 && c.spare.length === 2);
    ok('L2 and nobody typed those: four trades through DEPTH is ceil(4), ceil(4*2/3), '
       + 'ceil(4/3), which is exactly what goodsFor answers',
       T.goodsFor('town', ORDER).length === t.spare.length
       && T.goodsFor('camp', ORDER).length === c.spare.length);
    ok('L3 COMMONEST FIRST, because what a piece of ground has to spare is what it '
       + 'has most of -- so the trades a camp offers are a fact about that ground '
       + 'and not a list order',
       c.spare[0] === 'scav' && c.kinds[0] === 'scav');
    ok('L4 a camp really does turn people away for it, and a fortress does not',
       c.passed.filter(p => p.why === 'spare').length === 3
       && f.passed.filter(p => p.why === 'spare').length === 0);

    /* --- A FACTION THAT HATES YOU OFFERS NOBODY --- */
    const sign = (o) => ({ signs: Object.assign(
      { watch: false, follow: false, refuse: false, block: false }, o) });
    const hated = T.joinersOn({ faction: 'Mob', tier: 'fortress' }, MIX,
      { order: ORDER, holderAgainst: sign({ watch: true, follow: true, refuse: true }) });
    ok('L5 *** A FACTION THAT HATES YOU OFFERS NOBODY *** ' + hated.say,
       hated.total === 0 && hated.offers.length === 0 && hated.refused === 'ground');
    ok('L6 and it says so about every single person on the block, so nothing is '
       + 'silently dropped',
       hated.passed.length === MIX.length && hated.passed.every(p => p.why === 'ground'));
    ok('L7 *** THE LINE IS THEIR OWN SIGN AND NOT A RANK I PICKED. *** `refuse` has '
       + 'meant will-not-deal-with-you since the against organ was written: hostile '
       + 'and war carry it, cold does not, and a stranger on their block does not',
       T.joinersOn({ faction: 'Mob', tier: 'fortress' }, MIX,
         { order: ORDER, holderAgainst: sign({ watch: true }) }).total === MIX.length
       && require(path.join(ROOT, 'engine/bohemia_against.js'))
            .LEVELS.hostile.signs.refuse === true
       && !require(path.join(ROOT, 'engine/bohemia_against.js'))
            .LEVELS.cold.signs.refuse);
    ok('L8 and a person whose OWN outfit refuses you is out even on calm ground',
       (function () {
         const m = MIX.slice(); m[0] = Object.assign({}, m[0],
           { faction: 'Cartel', against: sign({ refuse: true }) });
         const r = T.joinersOn({ faction: 'Mob', tier: 'fortress' }, m, { order: ORDER });
         return r.passed.filter(p => p.why === 'refuses').length === 1;
       })());

    /* --- YOUR STANDING THERE --- */
    const withChurch = MIX.map((p, i) => i < 3 ? Object.assign({}, p, { faction: 'Church' }) : p);
    ok('L9 *** YOU ARE NOBODY TO AN OUTFIT YOU HAVE NEVER DONE ANYTHING FOR, so a '
       + 'stranger cannot walk onto a block and take one of their people ***',
       T.joinersOn({ faction: 'Mob', tier: 'fortress' }, withChurch,
         { order: ORDER, rungWith: () => 'stranger' })
         .passed.filter(p => p.why === 'stranger').length === 3);
    ok('L10 and doing the thing they want ONCE opens it -- his own ladder\'s second '
       + 'rung, whose note says "this is the whole entry, and it is meant to be '
       + 'small". The rung is named, never a number, so re-cutting his ladder '
       + 'never touches this file',
       T.JOIN_RUNG === 'stranger'
       && T.joinersOn({ faction: 'Mob', tier: 'fortress' }, withChurch,
            { order: ORDER, rungWith: () => 'peripheral' }).total === withChurch.length
       && require(path.join(ROOT, 'engine/bohemia_belonging.js'))
            .RUNGS[1].key === 'peripheral'
       && require(path.join(ROOT, 'engine/bohemia_belonging.js')).RUNGS[1].at === 1);
    ok('L11 AN OUTFIT ANSWERS TO ITS OWN LADDER AND NEVER THE HOLDER\'S: how far in '
       + 'you are with the Mob is nothing to a Church body standing on Mob ground',
       (function () {
         const r = T.joinersOn({ faction: 'Mob', tier: 'fortress' }, withChurch,
           { order: ORDER, rungWith: (f) => f === 'Church' ? 'useful' : 'stranger' });
         return r.total === withChurch.length;
       })());
    ok('L12 and NULL IS NOT STRANGER: BohemiaBelonging answers null for an outfit '
       + 'that wants nothing, because calling you a stranger to something that is '
       + 'not a club would be a lie -- so its people are judged like anybody else',
       T.joinersOn({ faction: 'Mob', tier: 'fortress' }, withChurch,
         { order: ORDER, rungWith: () => null }).total === withChurch.length
       && require(path.join(ROOT, 'engine/bohemia_belonging.js'))
            .rungOf({ wants: 'nothing' }, 99) === null);

    /* --- NEVER SPAWNED, NEVER STORED --- */
    ok('L13 *** NOTHING IS STORED. *** The same ground asked twice gives the same '
       + 'answer and not one field is written on anybody, so there is no roster to '
       + 'maintain and no rule for when to forget -- the shape bohemia_company.js '
       + 'paid for in its own round',
       JSON.stringify(T.joinersOn({ faction: 'Mob', tier: 'camp' }, MIX, { order: ORDER }))
         === JSON.stringify(c)
       && MIX.every(p => Object.keys(p).join(',') === 'who,kind,faction,against,mine'));
    ok('L14 NOBODY IS SPAWNED FOR THE MENU: every person in the answer came in on '
       + 'the list the caller handed over, and the count of everybody here is '
       + 'carried so the two can be compared',
       f.here === MIX.length && (f.offers.length + f.passed.length) === MIX.length);
    ok('L15 somebody already yours is not offered to you a second time',
       (function () {
         const m = MIX.map((p, i) => i === 0 ? Object.assign({}, p, { mine: true }) : p);
         const r = T.joinersOn({ faction: 'Mob', tier: 'fortress' }, m, { order: ORDER });
         return r.passed.filter(p => p.why === 'mine').length === 1
             && r.total === MIX.length - 1;
       })());
    ok('L16 NO NUMBER IS INVENTED IN THE MODULE: the only cap is the caller\'s and '
       + 'it is named a rendering bound, with the true total carried beside it',
       (function () {
         const r = T.joinersOn({ faction: 'Mob', tier: 'fortress' }, MIX,
           { order: ORDER, cap: 2 });
         return r.offers.length === 2 && r.total === MIX.length;
       })());
    ok('L17 a bad call is a null answer rather than a throw',
       T.joinersOn(null, null, null) && T.joinersOn(null, null, null).total === 0);
    ok('L18 every word it says is an attempt, draft:true',
       f.draft === true && Object.keys(T.JOIN_NO).length === 5
       && Object.keys(T.JOIN_SAY).length === 3);

    /* --- IT IS IN THE WALKED SURFACE --- */
    ok('L19 the city asks the ONE organ about an outfit rather than assembling the '
       + 'same five facts a second time -- two readings of one world is how they '
       + 'start disagreeing',
       /function ctAgainstFaction/.test(CITY5)
       && /rung: null, coalition: coal/.test(CITY5));
    ok('L20 and it hands the rung over as a FUNCTION, so a rung that moves is '
       + 'obeyed at once instead of a frame late',
       /rungWith: ctRungWith/.test(CITY5) && /function ctRungWith/.test(CITY5));
    ok('L21 the people are the city\'s own residents, through the one list it '
       + 'already keeps, with the jobs and outfits they already had',
       /ppl = ctEveryone\(\) \|\| \[\]/.test(
         (CITY5.match(/function ctJoinersHere[\s\S]*?\n\}/) || [''])[0]));
    /* READ INSIDE THE CARD'S OWN FUNCTION, NEVER ACROSS THE WHOLE FILE. The
       first cut compared two indexOf's over 4 MB and passed for the wrong
       reason: 'WOULD COME WITH YOU FROM THIS BLOCK' is a string in the INLINED
       towns module forty thousand lines above the card, so it was measuring the
       module's position against the card's, which is not the claim. */
    const STANDCARD = (CITY5.match(/function showStanding\(\)\{[\s\S]*?\n\}/) || [''])[0];
    ok('L22 it is on the card he already opens, called WHERE YOU STAND, directly '
       + 'under the row that names whose ground this is -- he never digs',
       STANDCARD.length > 2000
       && STANDCARD.indexOf('WOULD COME WITH YOU') > STANDCARD.indexOf('>THIS GROUND<')
       && STANDCARD.indexOf('>THIS GROUND<') > 0
       && /__WHO_WILL_JOIN_YOU__/.test(STANDCARD));
    ok('L23 and it is on the town\'s own market card too, under the shelf that is '
       + 'cut by the SAME rule, so the fortress-and-camp difference reads in one '
       + 'glance',
       /if\(h&&h\.kind==='seat'\)\{[\s\S]{0,240}ctJoinersLine\(ctJoinersHere\(\)\)/.test(CITY5));
    ok('L24 it says WHY when the answer is nobody, because two different nobodies '
       + 'teach two different things',
       /esc\(_j\.say\)/.test(CITY5) && /NOBODY<\/span>/.test(CITY5));
    ok('L25 the trade word is asked of the module that owns it, never retyped',
       /BohemiaPeople\.ROLE_WORDS\[k\]/.test(CITY5));

    /* --- AND IT REALLY RUNS THERE. A grep proves code exists. --- */
    if (RECRUIT) {
      ok('L26 *** ON THE WALKED SURFACE, ON THE BLOCK HE WAKES ON: ' + RECRUIT.waking.total
         + ' of ' + RECRUIT.waking.here + ' people would come with you, off ' + RECRUIT.waking.holder
         + ' ' + RECRUIT.waking.tier + ' ground ***',
         RECRUIT.waking.total > 0 && RECRUIT.waking.here > 0
         && RECRUIT.waking.holder && RECRUIT.waking.tier);
      ok('L27 *** AND A FORTRESS REALLY DOES SPARE MORE TRADES THAN A CAMP OUT THERE: '
         + RECRUIT.spareByTier.fortress + ' / ' + RECRUIT.spareByTier.town + ' / '
         + RECRUIT.spareByTier.camp + ' ***',
         RECRUIT.spareByTier.fortress > RECRUIT.spareByTier.town
         && RECRUIT.spareByTier.town > RECRUIT.spareByTier.camp);
      ok('L28 *** SIDING WITH THE REMNANTS PUTS THE CARTEL AT WAR WITH YOU THROUGH '
         + 'THE GAME\'S OWN DOOR, AND THEIR GROUND THEN OFFERS NOBODY *** (was '
         + RECRUIT.cartel.before + ', now ' + RECRUIT.cartel.after + ', ' + RECRUIT.cartel.why + ')',
         RECRUIT.cartel.earned === true && RECRUIT.cartel.before > 5
         && RECRUIT.cartel.after === 0 && RECRUIT.cartel.why === 'ground');
      ok('L29 and an uninvolved faction\'s ground is untouched by it',
         RECRUIT.other.total > 0 && !RECRUIT.other.refused);
      ok('L30 *** DOING WHAT AN OUTFIT WANTS OPENS ITS PEOPLE, LIVE: ' + RECRUIT.church.before
         + ' -> ' + RECRUIT.church.after + ' as the rung goes ' + RECRUIT.church.rungBefore
         + ' -> ' + RECRUIT.church.rungAfter + ' ***',
         RECRUIT.church.after > RECRUIT.church.before
         && RECRUIT.church.rungBefore === 'stranger'
         && RECRUIT.church.strangerAfter === 0);
      ok('L31 THE CARD HE OPENS REALLY SAYS IT, on a real surface and not in a '
         + 'string I built: ' + JSON.stringify(RECRUIT.cardBits),
         /WOULD COME WITH YOU/.test(RECRUIT.card)
         && /spares/.test(RECRUIT.card) && RECRUIT.card.length > 40);
      ok('L32 and the town\'s market card carries it at a seat',
         /WOULD COME WITH YOU FROM THIS BLOCK/.test(RECRUIT.marketCard));
      ok('L33 no page errors while any of that ran', RECRUIT.errs === 0);
    } else {
      ok('L26-33 the walked surface answered', false);
    }
  }

  /* *** THE WALKED SURFACE, DRIVEN, FOR [rent visible]. ***
     Opens the game, reads the ground before the day is spent, walks a real
     route, compares the preview against the bill the night really takes, cuts
     the lights through the real nightfall, and redraws the map. Nothing below is
     computed here: every number comes back from the page. */
  let RENTVIS = null;
  try {
    const b4 = await chromium.launch();
    try {
      const p4 = await b4.newPage({ viewport: { width: 390, height: 844 } });
      const e4 = []; p4.on('pageerror', e => e4.push(e.message));
      await p4.route(/^https?:/, r => r.abort());
      await p4.goto('file://' + CITY, { waitUntil: 'load', timeout: 180000 });
      for (let i = 0; i < 200; i++) { if (await p4.$('#daycardIn .dcgo')) break; await SETTLE(p4, 300); }
      await p4.$eval('#daycardIn .dcgo', el => el.click());
      await SETTLE(p4, 500);
      RENTVIS = await p4.evaluate(async () => {
        const R = {}; MODE = 'human';
        const d1 = ctRentHere();
        R.dayOne = d1.faction + ' ' + d1.tier + ', ' + d1.now + ' so far, next block '
                 + (d1.free ? 'free' : 'costs one') + ', due ' + DAY.hhmm(d1.dueMin);
        R.dayOneOk = !!(d1 && d1.faction && d1.shape && d1.dueMin != null);
        /* a real route, in bounds */
        TURF_USED = {}; TURF_SEENCELL = {};
        const sx = (hx / FN) | 0, sy = (hy / FN) | 0, route = [];
        for (let k = 0; k < 60; k++) {
          const cx = sx + (k % 20) - 10, cy = sy + ((k / 20) | 0) * 3 - 3;
          hx = cx * FN + (FN >> 1); hy = cy * FN + (FN >> 1);
          turfNote(cx, cy); route.push([cx, cy]);
        }
        const seats = turfSeats();
        R.preview = ctRentHere().tonight;
        R.bill = BohemiaTowns.rentOn(rentBillable(seats), seats).total;
        const nearLit = () => { let n = 0; const seen = {};
          route.forEach(c => { for (let dx = -6; dx <= 6; dx++) for (let dy = -6; dy <= 6; dy++) {
            const x = c[0] + dx, y = c[1] + dy, k = x + ',' + y; if (seen[k]) continue; seen[k] = 1;
            try { const p = POWER.at(x, y); if (p && p.live) n++; } catch (e) {} } }); return n; };
        R.litNearBefore = nearLit();
        /* THE MAP, BEFORE AND AFTER, THROUGH THE REAL CAMERA */
        try { document.getElementById('phoneclose').click(); } catch (e) {}
        try { document.getElementById('modechip').click(); } catch (e) {}
        await new Promise(r => setTimeout(r, 1500));
        render(); await new Promise(r => setTimeout(r, 350));
        const hashOf = () => { const c = document.querySelector('canvas'), g = c.getContext('2d');
          const d = g.getImageData(0, 0, c.width, c.height).data; let h = 2166136261 >>> 0, s = 0;
          for (let i = 0; i < d.length; i += 41) { h ^= d[i]; h = Math.imul(h, 16777619) >>> 0; }
          for (let i = 0; i < d.length; i += 4) s += d[i] + d[i + 1] + d[i + 2];
          return [h >>> 0, s]; };
        const h0 = hashOf();
        R.drawnLit = (window.__GRID_DRAWN || {}).lit || 0;
        R.inks = Object.keys((window.__GRID_DRAWN || {}).ink || {}).length;
        /* the real nightfall, on the real route */
        MODE = 'human'; blockRent();
        const dd = RENT_DOUSED.map(x => x.cells);
        R.doused = RENT_DOUSED.length;
        R.within6 = dd.filter(x => x <= 6).length;
        R.litNearAfter = nearLit();
        const one = RENT_DOUSED[0];
        if (one) { hx = one.at[0] * FN + (FN >> 1); hy = one.at[1] * FN + (FN >> 1);
          showStanding(); R.cardOnCut = (document.getElementById('daycardIn') || {}).textContent || '';
          try { cardHide(); } catch (e) {} }
        /* and every circuit out, to prove the frame really depends on them */
        MODE = 'city'; if (one) { city.x = one.at[0]; city.y = one.at[1]; }
        const seen2 = {};
        POWER.cells().forEach(c => { if (c.live && !seen2[c.id]) { seen2[c.id] = 1; POWER.douse(c.id); } });
        render(); await new Promise(r => setTimeout(r, 350));
        const h1 = hashOf();
        R.hashMoved = h0[0] !== h1[0];
        R.brightDrop = h0[1] - h1[1];
        R.drawnLitAfter = (window.__GRID_DRAWN || {}).lit;
        R.cityMode = MODE;
        showStanding(); R.cityCard = (document.getElementById('daycardIn') || {}).textContent || '';
        try { cardHide(); } catch (e) {}
        return R;
      });
      RENTVIS.errs = e4.length;
    } finally { await b4.close(); }
  } catch (e) { RENTVIS = null; }

  /* ==========================================================================
     YOU CAN SEE WHAT THE BLOCK TAKES  (9/13, row [rent visible])
     "[block rent] shipped: the block pays its owner. Now the player sees it: on
     the walked street and in CITY, what this block takes from you and when, in
     batteries, before you decide to live or work on it; and the moment it is cut
     off, the block goes dark in a way you notice."
     ======================================================================== */
  {
    const _fs6 = require('fs');
    const CITY6 = _fs6.readFileSync(CITY, 'utf8');
    const GRID = _fs6.readFileSync(path.join(ROOT, 'engine/bohemia_powergrid.js'), 'utf8');
    const seats = [{ faction: 'Fort', tier: 'fortress' },
                   { faction: 'Town', tier: 'town' },
                   { faction: 'Camp', tier: 'camp' }];

    /* --- WHAT THE NEXT BLOCK COSTS IS THE BILL ASKED TWICE --- */
    ok('M1 *** THERE IS NO SECOND FORMULA. *** What one more block costs is rentOn '
       + 'with the count you have and rentOn with the count you would have, so a '
       + 'preview cannot disagree with the bill it is previewing',
       (function () {
         for (const f of ['Fort', 'Town', 'Camp'])
           for (let n = 0; n < 10; n++) {
             const u = {}; u[f] = n;
             const a = T.rentAhead(u, seats, f);
             const u2 = {}; u2[f] = n + 1;
             if (a.next !== T.rentOn(u2, seats).total) return false;
             if (a.now !== T.rentOn(u, seats).total) return false;
             if (a.adds !== a.next - a.now) return false;
           }
         return true;
       })());
    ok('M2 and `free` is exactly "this one adds nothing", never a separate rule',
       (function () {
         for (let n = 0; n < 12; n++) {
           const u = { Camp: n }, a = T.rentAhead(u, seats, 'Camp');
           if (a.free !== (a.adds === 0)) return false;
         }
         return true;
       })());

    /* --- THE SHAPE IS FOUND, NOT WRITTEN OUT PER TIER --- */
    const shF = T.rentShape('fortress'), shT = T.rentShape('town'), shC = T.rentShape('camp');
    ok('M3 *** A FORTRESS CHARGES FOR EVERY BLOCK, A TOWN FOR TWO IN THREE, A CAMP '
       + 'FOR ONE IN THREE *** -- and nobody typed any of that: it is FOUND by '
       + 'running the bill up a ladder and looking for the window that repeats ('
       + shF.charged + '/' + shF.per + ', ' + shT.charged + '/' + shT.per + ', '
       + shC.charged + '/' + shC.per + ')',
       shF.per === 1 && shF.charged === 1
       && shT.per === 3 && shT.charged === 2
       && shC.per === 3 && shC.charged === 1);
    ok('M4 and the shape it found really is what the bill does, checked against '
       + 'rentOn block by block rather than against itself',
       ['fortress', 'town', 'camp'].every(t => {
         const s = T.rentShape(t), f = 'X', st = [{ faction: f, tier: t }];
         const at = (n) => { const u = {}; u[f] = n; return T.rentOn(u, st).total; };
         for (let k = 1; k <= 4; k++) if (at(s.per * k) !== s.charged * k) return false;
         return true;
       }));
    ok('M5 it is his own DEPTH thirds said back, so re-cutting that table moves the '
       + 'words with it and there is nothing to edit here',
       Math.abs(shT.charged / shT.per - T.DEPTH.town) < 0.0001
       && Math.abs(shC.charged / shC.per - T.DEPTH.camp) < 0.0001
       && shF.charged / shF.per === T.DEPTH.fortress);
    ok('M6 the words are attempts, draft:true, and a bad call is null not a throw',
       shF.draft === true && T.rentAhead({}, seats, 'Fort').draft === true
       && T.rentAhead(null, null, null) === null);

    /* --- ONE BODY, TWO CALLERS --- */
    ok('M7 *** THE PREVIEW AND THE BILL TAKE THEIR NUMBERS FROM ONE PLACE. *** What '
       + 'they can bill you for -- your own generators already off the line -- was '
       + 'four lines inside the nightfall function. It is one body with two callers '
       + 'now, so an early answer cannot quote a rent you do not owe',
       /function rentBillable\(seats\)/.test(CITY6)
       && (CITY6.split('rentBillable(').length - 1) >= 3
       && /var billable=rentBillable\(seats\);/.test(CITY6));
    /* THE FIRST CUT OF THIS CHECK WAS A BROKEN RULER AND IT WENT RED ON CORRECT
       CODE: it banned the substring `douse`, and the reading has to LOOK AT
       RENT_DOUSED to say "they cut this street off". Reading a record is not
       spending. It names the WRITERS instead. */
    ok('M8 and nothing in the reading spends, bills or moves anything: it asks the '
       + 'towns module and the day clock and calls no writer',
       !/BohemiaPurse\.|purseGet\(|transferOut\(|credit\(|debit\(|POWER\.douse\(/
         .test((CITY6.match(/function ctRentHere[\s\S]*?\n\}/) || [''])[0]));

    /* --- THE CUT LANDS WHERE YOU ARE --- */
    ok('M9 *** THE STREET THEY CUT IS THE ONE NEAREST THE BLOCKS THEY BILLED YOU '
       + 'FOR. *** It used to scan from (0,0) and put out the first circuit it '
       + 'found on their ground, which on a 96-cell valley is somewhere you have '
       + 'never been',
       /cand\.sort\(function\(a,b\)\{ return a\.d!==b\.d \? a\.d-b\.d/.test(CITY6)
       && /function rentBilledBlock/.test(CITY6));
    ok('M10 and it is a DISTANCE and not a match, which is a measurement and not a '
       + 'preference: circuits only run along streets, so the ground you walk '
       + 'usually has no line on it to cut and a your-block-only rule would cut '
       + 'nothing while every check stayed green',
       /ZERO\s+of\s+them\s+carried\s+a\s+lit\s+circuit/.test(CITY6));

    /* --- THE MAP HAD NEVER DRAWN THE LIGHTS --- */
    ok('M11 the grid can be enumerated without probing the whole valley: the '
       + 'accessor walks the cells a feeder runs down, which is hundreds, not 9,216',
       /cells:function\(\)\{/.test(GRID) && /for\(const k in status\)/.test(GRID));
    ok('M12 and the surface caches that shape instead of rebuilding it every frame, '
       + 'because which cells carry a wire is a pure function of the seed and only '
       + 'the on-or-off changes',
       /window\.__PCELLS/.test(CITY6) && /POWER\.isDark\(__c\.id\)/.test(CITY6));
    ok('M13 lights are drawn in their HOLDER\'S ink -- the same __holderInk the '
       + 'borders and the tracks use -- so a lit street and the ground under it '
       + 'read as the same people. COLOUR IS TERRITORY',
       /__THE_MAP_HAS_NEVER_DRAWN_THE_LIGHTS__/.test(CITY6)
       && /__holderInk\(__c\.faction, __mineL\)/.test(CITY6));
    ok('M14 *** AND A WIRE THAT WAS NEVER LIVE IS NOT DRAWN. *** The first cut drew '
       + 'every wire and buried 360 lights under 1,500 dark dots, so the frame '
       + 'before a cut and the frame after were the same to a human eye -- the '
       + 'exact failure the layer exists to end',
       /a wire that was never on/.test(CITY6)
       && /if \(!__rc\.live && !__rc\.doused\) continue;/.test(CITY6));
    ok('M15 the render publishes what it really painted, the way the borders and '
       + 'the tracks already do',
       /window\.__GRID_DRAWN = \{ lit: __lit, off: __off, cut: __new, ink: __ink \}/.test(CITY6));

    /* --- THE CARD --- */
    const CARD6 = (CITY6.match(/function showStanding\(\)\{[\s\S]*?\n\}/) || [''])[0];
    ok('M16 it is on the card he already opens, under the row that names the owner',
       CARD6.length > 2000
       && CARD6.indexOf('WHAT IT TAKES') > CARD6.indexOf('>THIS GROUND<')
       && /__YOU_CAN_SEE_WHAT_THE_BLOCK_TAKES__/.test(CARD6));
    ok('M17 and it says all four things the row asks for: what it takes, what it '
       + 'stands at, whether walking on is free, and WHEN it is due',
       /WHAT IT TAKES/.test(CARD6) && /TONIGHT SO FAR/.test(CARD6)
       && /COSTS ONE/.test(CARD6) && /FREE/.test(CARD6)
       && /Due at ' \+ esc\(DAY\.hhmm\(_r\.dueMin\)\)/.test(CARD6));
    ok('M18 standing still is never read as another charge, because the landlord '
       + 'bills a block and he is already on it',
       /ANOTHER BLOCK OF THEIRS/.test(CARD6) && /_r\.counted/.test(CARD6));

    /* --- AND IT REALLY RUNS OUT THERE --- */
    if (RENTVIS) {
      ok('M19 *** ON THE WALKED SURFACE, BEFORE THE DAY IS SPENT: ' + RENTVIS.dayOne
         + ' ***', RENTVIS.dayOneOk === true);
      ok('M20 *** THE PREVIEW IS THE BILL, TO THE BATTERY: preview ' + RENTVIS.preview
         + ', bill ' + RENTVIS.bill + ' ***', RENTVIS.preview === RENTVIS.bill);
      ok('M21 *** THE MAP DRAWS THE GRID NOW, WHICH IT NEVER HAS: ' + RENTVIS.drawnLit
         + ' lights painted on a real canvas in ' + RENTVIS.inks + ' factions\' inks ***',
         RENTVIS.drawnLit > 0 && RENTVIS.inks > 0);
      /* THE CLAIM IS THAT THE PICTURE DEPENDS ON THE LIGHTS, AND THAT IS A FRAME
         THAT CHANGES AND A COUNT THAT FALLS. It is NOT that the frame gets
         darker: a cut wire is drawn as a ring wider than the light it replaces,
         so total RGB can go either way and measuring the direction would be
         measuring my own mark rather than the mechanic. The number that made the
         old test a lie was ZERO, on both. */
      ok('M22 *** AND PUTTING THEM OUT REALLY CHANGES THE PICTURE. *** Every circuit '
         + 'in the valley doused, the frame redrawn: hash moved ' + RENTVIS.hashMoved
         + ', lights on the canvas ' + RENTVIS.drawnLit + ' -> ' + RENTVIS.drawnLitAfter
         + ', brightness moved by ' + Math.abs(RENTVIS.brightDrop) + '. Before this row '
         + 'the same test moved ZERO pixels and ZERO brightness',
         RENTVIS.hashMoved === true && Math.abs(RENTVIS.brightDrop) > 0
         && RENTVIS.drawnLitAfter < RENTVIS.drawnLit && RENTVIS.drawnLitAfter === 0);
      ok('M23 *** THE DARKNESS LANDS WHERE YOU WALKED: ' + RENTVIS.within6 + ' of '
         + RENTVIS.doused + ' cut circuits within six cells of the route, and the '
         + 'lights near it went ' + RENTVIS.litNearBefore + ' to ' + RENTVIS.litNearAfter + ' ***',
         RENTVIS.within6 > 0 && RENTVIS.litNearAfter < RENTVIS.litNearBefore);
      ok('M24 stand on a street they cut and the card says who cut it and why',
         /cut this street off/.test(RENTVIS.cardOnCut));
      ok('M25 and the same reading answers in CITY, not only on foot',
         RENTVIS.cityMode === 'city' && /WHAT IT TAKES/.test(RENTVIS.cityCard));
      ok('M26 no page errors while any of that ran', RENTVIS.errs === 0);
    } else {
      ok('M19-26 the walked surface answered', false);
    }
  }

  done();
})();
