/* ============================================================================
   THE RUNG PAYS GATE (9/6/26, WORLD lane) — BB-THE-RUNG-PAYS.

   Paolo, 6/30, LOCKED (laws/BOHEMIA_ADDENDUM_PERSISTENT_CONSEQUENCE_MAYOR_6_30_26.md):
     "The more the city backs you, the easier building becomes, even in areas whose
      local faction doesn't love you, because the whole city has your back."

   THE LADDER EXISTED AND CROSSING A RUNG PAID YOU NOTHING YOU COULD USE.
   engine/bohemia_mandate.js has carried canBuild() since 8/11, and MEASURED 9/6 it
   had ZERO CALLERS IN THE GAME -- only its own gate. Tenth time this lane has found
   a finished thing with a published seam and nobody calling it.

   THE PENDING WAS ONLY BLOCKING BECAUSE EVERYBODY ASSUMED THE GRANT HAD TO BE A
   DIAL. His addendum offers three shapes -- "cost multipliers? unlock tiers?
   restriction removal?" -- and two of them are numbers he has not ruled. The third
   is a DOOR, and the door is already written in the module's own header in his own
   words. So MANDATE ships its grant and MAYOR stays [PENDING Paolo].

   *** AND TWO THINGS WOULD HAVE SHIPPED WRONG, BOTH CAUGHT BY MEASURING. ***
   1. THE PLAYER BOOTS AT SHARE 0 WITH NOT ONE FRIENDLY FACTION, which is correct on
      day one because standing comes from quests and no quest has run. A permit that
      just asks "does the local faction love you" refuses EVERYWHERE on day one and
      takes the builder, the lights bill and every row needing a placed building down
      with it. The answer was already a law: LIGHT=TERRITORY, and NOBODY PATROLS THE
      DARK. A faction can only stop you where somebody is standing.
   2. THE FIRST CUT ASKED WHETHER THE PLOT'S OWN CELL WAS LIT and refused ZERO real
      builds -- the grid only lays circuits along STREET cells, so a buildable cell is
      never lit itself. It refused only ground you could not build on anyway. A BRANCH
      THAT HAS NEVER EXECUTED IS NOT CODE, IT IS AN INTENTION. It asks about the
      street the plot FRONTS now, the same question [lights bill] answers.

   node gates/rung_pays_gate.js
   ========================================================================== */
'use strict';
const { settle: SETTLE } = require(__dirname + '/bohemia_settle.js');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
const M = require(path.join(ROOT, 'engine/bohemia_mandate.js'));

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  > FAIL ' + n)); };
const done = () => {
  console.log('RUNG PAYS GATE: ' + pass + ' passed, ' + fail + ' failed'
            + '  (rung two grants a door, not a dial - rung three is still his'
            + ' - day one is not walled in)');
  process.exit(fail ? 1 : 0);
};

/* ---- 1. the grant is a door, and only rung two got one ------------------ */
{
  const g = M.grantsAt(M.MANDATE);
  ok('MANDATE HAS A GRANT NOW -- crossing the rung pays you something',
     !!g && !g.reason && g.grant === 'build:anywhere');
  ok('and it is a DOOR, not a dial -- nothing in it scales anything',
     g.dial === false && typeof g.grant === 'string');
  ok('it cites his own addendum as its source rather than inventing one',
     /MAYOR_6_30_26/.test(g.source || ''));
  /* THE ROW SAID RUNG THREE STAYS HIS AND MUST NOT BLOCK RUNG TWO. */
  ok('MAYOR STILL ANSWERS NO_RULING BY NAME -- what "governing" grants on an already'
     + ' open map is a real question with no default',
     M.grantsAt(M.MAYOR).reason === 'NO_RULING');
  ok('and TERRITORY has no grant either, because the baseline is not a reward',
     M.grantsAt(M.TERRITORY).reason === 'NO_RULING');
  ok('MAYOR_SHARE is still unruled, so the top rung cannot even be reached',
     M.MAYOR_SHARE === null);
  ok('and his 49% is used as given', M.MANDATE_SHARE === 0.49);

  /* THE RUNG IS DERIVED, so losing favour drops you with no demotion rule. */
  const facs = n => Array.from({ length: 16 }, (_, i) => ({ name: 'f' + i, fwu: i < n }));
  ok('under his share the rung is TERRITORY', M.rungOf(facs(7)) === M.TERRITORY);
  ok('at his share it is MANDATE', M.rungOf(facs(8)) === M.MANDATE);
  ok('AND LOSING A FACTION DROPS YOU BACK, by construction rather than by a rule',
     M.rungOf(facs(7)) === M.TERRITORY);
  ok('canBuild refuses unloved ground at TERRITORY',
     M.canBuild(facs(4), false).allowed === false);
  ok('and opens it at MANDATE', M.canBuild(facs(8), false).allowed === true);
}

/* ---- 2. on the surface he walks, through the real button ---------------- */
(async () => {
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

  const r = await pg.evaluate(async () => {
    const R = {};
    R.rungAtBoot = rungRead().rung;
    R.friendlyAtBoot = rungRead().fwu.length;

    /* HOW MUCH OF THE VALLEY IS OPEN ON DAY ONE. This is the check that would have
       caught a permit that walls a new player in. */
    let open = 0, shut = 0;
    for (let y = 0; y < om.n; y++) for (let x = 0; x < om.n; x++)
      cbPermit(x, y).allowed ? open++ : shut++;
    R.openShare = +(open / (open + shut)).toFixed(4);

    /* AND HOW MANY BUILDABLE PLOTS ARE ACTUALLY GATED -- the number that proves the
       door opens onto something. The first cut of this refused ZERO. */
    let buildable = 0, gated = 0, cell = null;
    for (let y = 1; y < om.n - 1; y++) for (let x = 1; x < om.n - 1; x++) {
      if ((om.at(x, y) || {}).district !== 'desert') continue;
      buildable++;
      if (!cbPermit(x, y).allowed) { gated++; if (!cell) cell = [x, y]; }
    }
    R.buildable = buildable; R.gated = gated; R.cell = cell;
    if (!cell) return R;

    /* PRESS THE REAL BUILD BUTTON, at rung one. */
    const [x, y] = cell;
    R.holder = (turfAt(x, y) || {}).faction;
    BohemiaPurse.credit(purseGet(), 'electricity', 5, 'gate:seed', null, 1);
    const before = CE.count(EDITS);
    MODE = 'city'; CB.sel = [x, y]; CBpanel();
    await new Promise(res => setTimeout(res, 120));
    let bd = document.getElementById('cbbuild');
    R.panelOpened = !!bd;
    if (bd) bd.click();
    R.refused = { plots: CE.count(EDITS), grew: CE.count(EDITS) > before,
                  says: (document.getElementById('cbprice') || {}).textContent || '' };

    /* NOW CROSS THE RUNG AND PRESS THE SAME BUTTON ON THE SAME PLOT. */
    const roster = rungRoster();
    DQ.shared = DQ.shared || {}; DQ.shared.faction = DQ.shared.faction || {};
    const need = Math.ceil(BohemiaMandate.MANDATE_SHARE * roster.length);
    for (let i = 0; i < need; i++) DQ.shared.faction[roster[i]] = 1;
    R.rungNow = rungRead().rung;
    CB.sel = null; CBpanel(); CB.sel = [x, y]; CBpanel();
    await new Promise(res => setTimeout(res, 120));
    bd = document.getElementById('cbbuild');
    if (bd) bd.click();
    R.allowed = { plots: CE.count(EDITS), grew: CE.count(EDITS) > before,
                  district: (om.at(x, y) || {}).district };
    return R;
  });
  await b.close();

  ok('the player really does boot with nobody on his side, which is correct on day one',
     r.rungAtBoot === 'TERRITORY' && r.friendlyAtBoot === 0);
  /* THE CHECK THAT KEEPS DAY ONE ALIVE. */
  /* THE POPULATION THAT MATTERS IS BUILDABLE PLOTS, not every cell in the valley.
     The whole-valley figure counts streets, mountains and water -- ground he could
     never build on at any rung -- so it answers a question nobody asked. The one that
     would catch a walled-in player is: of the plots he COULD build on, how many can he? */
  const buildShare = +(1 - r.gated / r.buildable).toFixed(4);
  ok('*** AND HE IS STILL NOT WALLED IN *** -- ' + Math.round(buildShare * 100)
     + '% of the BUILDABLE plots are open at rung one (' + Math.round(r.openShare * 100)
     + '% of all ground), because nobody patrols the dark', buildShare > 0.8);
  /* THE CHECK THAT KEEPS THE DOOR FROM OPENING ONTO NOTHING. */
  ok('AND THE DOOR OPENS ONTO SOMETHING -- ' + r.gated + ' of ' + r.buildable
     + ' buildable plots are gated, all of them fronting a lit street',
     r.gated > 0 && r.gated < r.buildable);

  ok('the plot panel opens on a gated plot', r.panelOpened === true);
  ok('AT RUNG ONE THE BUILD IS REFUSED and nothing goes down',
     r.refused.grew === false && r.refused.plots === 0);
  ok('and it says WHY, naming who holds the block, on the line he is already reading',
     r.refused.says.indexOf(r.holder) === 0
     && /you are not/.test(r.refused.says));
  ok('crossing his 49% really reaches MANDATE', r.rungNow === 'MANDATE');
  ok('*** AND THE SAME BUTTON ON THE SAME PLOT NOW BUILDS *** -- the rung paid a door',
     r.allowed.grew === true && r.allowed.district !== 'desert');
  ok('no page error across a refused build and an allowed one'
     + (errs.length ? ' -- ' + errs[0] : ''), errs.length === 0);
  done();
})();
