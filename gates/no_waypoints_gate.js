/* ==========================================================================
   NO WAYPOINTS  (JOBS TWO, 11/22/26, VAMILY rules 473, 441)

   PAOLO 11/22: 'I don't want direction arrows if my map is zoomed in... my whole map gets cluttered with waypoint arrows towards these
   little side quests... just have the part highlighted when you're close... I have like 14 white points on my map.'
   (a) no side quest or job puts a name, a point or an arrow at the glass's edge when its place is off the screen; (b) on the glass it
   is ringed where it stands; (c) the phone's job line says which way and its tap walks there (rule 448); (d) MEASURED before and after.

     W1  the files: markPlace draws nothing off the glass (no edge box, no wedge layer, no touch there); the post-mortem in the graveyard;
         PLANTED: the old edge drawing put back is caught
     W2  on his phone (tools/bohemia_jobs_no_waypoints_on_the_phone.js), the demo and the alpha, upright and sideways, a new crew with 14
         side places on his road and two jobs held: 0 names at the glass's edge; the places on the glass ringed; the camera over a place
         that was off the glass: it is marked where it stands; the job's line on the phone tapped with a finger sets him off there
     W3  nothing threw
   node gates/no_waypoints_gate.js        NW_FILES=1 the files only
   ========================================================================== */
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const ROOT = path.join(__dirname, '..');
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };
const done = () => { console.log('\nNO WAYPOINTS: ' + pass + ' passed, ' + fail + ' failed'); process.exit(fail ? 1 : 0); };
const T = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

/* the edge's drawing, read off a source: a box pushed for a name off the glass, a wedge layer, an edge count */
function edgeDrawn(src) {
  const i = src.indexOf('function markPlace('), j = src.indexOf('\n  function hit(', i), body = i >= 0 ? src.slice(i, j > i ? j : i + 8000) : '';
  return { found: i >= 0, box: /on: false[^}]*box: \[/.test(body), wedges: /WEDGES\.push|function wedgesDraw/.test(src), edges: /MAP_DREW\.jobEdges/.test(src), boxes: /EDGE_BOXES/.test(src) };
}
{
  const JK = T('slices/bohemia_job_kinds.js'), e = edgeDrawn(JK);
  const w1 = [e.found && !e.box && !e.wedges && !e.edges && !e.boxes,
    /__NO_WAYPOINTS__/.test(JK) && /return \{ id: id, name: n\.name, act: n\.act, label: label, on: false, x: n\.x, y: n\.y \};/.test(JK),
    fs.existsSync(path.join(ROOT, 'graveyard/POSTMORTEM_JOBS_THE_EDGE_NAMES_11_22_26.txt'))];
  ok('W1 the files: a place off the glass is drawn nowhere (no name at the edge, no point, no touch); its post-mortem in the graveyard', w1.every(Boolean), w1.map(b => b ? 1 : 0).join('') + ' ' + JSON.stringify(e));
  const old = "  function markPlace(n) {\n    WEDGES.push([ex, ey, ux, uy]); EDGE_BOXES.push([bx, by, tw]);\n    return { id: id, name: n.name, act: n.act, label: label, on: false, x: n.x, y: n.y, ex: 1, ey: 2, box: [1, 2, 3, 11] };\n  }\n  function hit(";
  const p = edgeDrawn(old);
  ok('W1p planted: the old edge drawing is caught', p.box && p.wedges && p.boxes, JSON.stringify(p));
}
if (process.env.NW_FILES) done();

function walk(args, tag) {
  const out = path.join(os.tmpdir(), 'nw_' + tag + '_' + process.pid);
  fs.mkdirSync(out, { recursive: true });
  cp.execFileSync('node', [path.join(ROOT, 'tools/bohemia_jobs_no_waypoints_on_the_phone.js'), '--out', path.relative(ROOT, out), '--tag', tag].concat(args), { stdio: ['ignore', 'inherit', 'inherit'], timeout: 3000000 });
  return JSON.parse(fs.readFileSync(path.join(out, 'no_waypoints_' + tag + '.json'), 'utf8'));
}
try {
  const runs = [walk([], 'gate_demo'), walk(['--alpha'], 'gate_alpha')];
  const rows = [].concat(...runs.map(R => R.walks.map(w => Object.assign({ alpha: R.alpha }, w.row)))), errs = [].concat(...runs.map(R => [].concat(...R.walks.map(w => w.errs || []))));
  const good = r => !r.err && r.planted && r.planted.held === 14 && r.jobs.every(j => j.held) && r.near.marks >= 16 && r.near.atEdge === 0 && r.near.onGlass > 0 && r.near.offGlass > 0 &&
    !!r.over && r.over.on && r.overAll && r.overAll.atEdge === 0 && !!r.phoneLine && !!r.phoneGo && r.phoneGo.ok;
  ok('W2 on his phone, the demo and the alpha, upright and sideways: 14 side places and two jobs, 0 names at the glass\'s edge; the places on the glass ringed; over a place that was off the glass it is marked where it stands; the job\'s line on the phone walks there',
    rows.length === 4 && rows.every(good),
    rows.map(r => (r.alpha ? 'alpha ' : 'demo ') + (r.shape === 'phone_portrait' ? 'up' : 'side') + ': ' + (r.err ? 'ERR ' + r.err : 'marks ' + r.near.marks + ', on the glass ' + r.near.onGlass + ', off ' + r.near.offGlass + ', AT THE EDGE ' + r.near.atEdge +
      '; over ' + (r.target ? r.target.name : '-') + (r.over && r.over.on ? ' ringed' : ' NOT MARKED') + '; the phone\'s line ' + (r.phoneGo && r.phoneGo.ok ? 'walks to ' + JSON.stringify(r.phoneGo.to) : 'DID NOT GO'))).join(' | '));
  ok('W3 nothing threw', !errs.length, errs.slice(0, 3).join(' | '));
} catch (e) { ok('the phone legs ran', false, String(e && e.message || e).slice(0, 300)); }
done();
