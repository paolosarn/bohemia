/* THE VISTA GATE (8/9/26, CITY lane — demo row 11, co-owned with RUN)
 *
 * Paolo, THE DEMO PLAN row 2, restated 8/9 as demo-critical:
 *   "you get to see the outlook in the city type shit"
 *   THE VISTA: the mountain overlook where you SEE the whole valley for the first
 *   time. THE DEMO'S MONEY SHOT.
 *
 * The plan's own constraint is the thing most worth guarding: "the city view
 * machinery already renders the valley; this is a camera moment + a walkable
 * overlook spur, NOT A NEW RENDERER." A future session's most tempting move is to
 * write a bespoke vista renderer, and that is what turns a one-day camera move
 * into a second world view nobody maintains. So this gate pins the SHAPE as much
 * as the behaviour.
 */
const path = require('path');
const fs = require('fs');
global.window = global;
require(path.join(__dirname, '../engine/bohemia_engine.js'));
require('../engine/bohemia_district_kit.js');
const W = require('../engine/bohemia_world.js');
const V = require('../engine/bohemia_vista.js');
const OM = require('../engine/bohemia_overmap.js');

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const R = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');

ok('the vista module exposes its three questions',
  typeof V.overlook === 'function' && typeof V.survey === 'function' && typeof V.framing === 'function');

const world = W.world(2691674296);
const o = V.overlook(world);
ok('this valley HAS an overlook to stand on', !!o);

if (o) {
  /* MAP LAW: CLAUDE NEVER DESIGNS MAP LAYOUTS. The overlook must be DERIVED from
     the seed's own mountains, never a hand-placed coordinate. */
  ok('the overlook is DERIVED from the map, not authored by a lane', o.derived === true);
  ok('it says WHY it is the overlook, so the choice is auditable',
    typeof o.why === 'string' && o.why.length > 10);
  const t = world.at(o.x, o.y);
  ok('you are standing on HIGH GROUND (' + (t && t.district) + ')', !!t && V.isHigh(t));
  ok('and it is ON THE RIM, not buried inside the range', V.onRim(world, o.x, o.y));

  const s = V.survey(world, o);
  /* A VISTA IS A VIEW. A ledge over empty desert is a hillside. */
  ok('you can actually see a city from it (' + s.cells + ' built cells in sight)', s.cells >= 200);
  ok('the view is measured in real metres off the canon cell size (' +
    (s.reachM / 1000).toFixed(1) + ' km)', s.reachM > 3000 && s.reachM < 12000);
  ok('the survey names real districts so the card can say what he is looking at (' +
    s.districts.slice(0, 3).join(', ') + ')', s.districts.length >= 3);

  /* YOU LOOK ACROSS A VALLEY, YOU DO NOT HOVER OVER A LEDGE. The first cut
     centred the camera on the overlook cell and half the frame came back sky. */
  const f = V.framing(world, o, 390, 844);
  ok('the camera LOOKS ACROSS the basin rather than centring on the rim',
    f && (Math.abs(f.cx - o.x) + Math.abs(f.cy - o.y)) >= 4);
  ok('the frame still remembers where you are standing', f && f.standingAt &&
    f.standingAt.x === o.x && f.standingAt.y === o.y);
  /* THE MOBILE RENDER CONTRACT BANS NON-INTEGER SCALE. */
  ok('the iso tile size is a whole even number of pixels (' + f.tw + 'x' + f.th + ')',
    Number.isInteger(f.tw) && f.tw % 2 === 0 && Number.isInteger(f.th) && f.tw >= 6);

  /* DETERMINISM: one seed, one overlook, forever. */
  const again = V.overlook(W.world(2691674296));
  ok('the same seed always gives the same overlook', again.x === o.x && again.y === o.y);
}

/* PAOLO'S OVERRIDE HAS TO EXIST OR THE MECHANISM OUTRANKS HIM. */
ok('he can place THE overlook himself and the derivation stands aside',
  typeof V.setCanon === 'function' && /CANON/.test(R('engine/bohemia_vista.js')));
ok('and nothing has quietly filled his canon slot in for him',
  /var CANON=null;/.test(R('engine/bohemia_vista.js')));

/* ---------------------------------------------------- it is on the real screen */
const page = R('slices/BOHEMIA_CITY_WORLD.html');
ok('the vista module is inlined in the walked world', page.includes('root.BohemiaVista=API'));
ok('the camera moment exists', /function vistaOpen\(/.test(page) && /function vistaClose\(/.test(page));
ok('walking onto the overlook fires it', /vistaCheck\(\);\s*\/\* __THE_VISTA__ \*\//.test(page));

/* NOT A NEW RENDERER. This is the plan's constraint and the one a future session
   is most likely to break, so it is asserted as a property: the vista must drive
   the EXISTING valley view and must not carry a draw loop of its own. */
const vi = page.indexOf('==== THE VISTA (8/9');
const vend = page.indexOf('function renderHuman(){', vi);
const block = vi > 0 ? page.slice(vi, vend) : '';
ok('the vista block exists to inspect', block.length > 400);
ok('IT CALLS THE VALLEY VIEW THAT ALREADY EXISTED, rather than drawing its own',
  /render\(\);/.test(block) && !/for\s*\(\s*let\s+y\s*=\s*0[\s\S]{0,200}drawImage/.test(block));
ok('it paints no tiles of its own (a camera moment, not a renderer)',
  !/g\.drawImage\(/.test(block));
ok('the card is DOM, so no text is burned into the art', /createElement\('div'\)/.test(block) &&
  !/g\.fillText/.test(block));

/* THE CO-OWNERSHIP SEAM. Demo row 11 is CITY + RUN. If RUN has to reach into this
   file to play the moment, the boundary is already broken. */
ok('RUN can play it through a named seam without touching this file',
  /window\.__VISTA=\{/.test(page) && /open:vistaOpen/.test(page) && /close:vistaClose/.test(page));
ok('and can ask where it is and what is visible', /where:vistaWhere/.test(page) && /survey:function/.test(page));

/* IT IS SHOWN, NOT DESCRIBED (the 8/8 pictures law). */
const MAN = 'records/BOHEMIA_LOOK_MANIFEST.json';
let shots = [];
try { shots = JSON.parse(R(MAN)).shots || []; } catch (e) {}
const shot = shots.find(s => s.id === 'vista');
ok('the vista has a PICTURE in the LOOK tab (he never has to go find it)', !!shot);
if (shot) {
  ok('and the picture is on disk', fs.existsSync(path.join(__dirname, '..', 'slices', shot.file)));
  ok('and its caption names the tab it lives in', /RUN tab/.test(shot.caption || ''));
}

console.log('THE VISTA GATE: ' + pass + ' passed, ' + fail + ' failed' +
  (o ? '  (overlook ' + o.x + ',' + o.y + ', ' + o.cells + ' cells in sight)' : ''));
process.exit(fail ? 1 : 0);
