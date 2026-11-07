#!/usr/bin/env node
/* EVERY CHANGE AT SIXTY (PLUMBER 7, 11/7/26; rule 400(d), ask line 441: 'if the UI when it moves and transitions can be 60 frames per
   second that would be awesome... if the UI could stop looking like a slideshow between all the transitions').
   Reads a BOHEMIA_FRAME_LOG file (tools/bohemia_drive_the_demo.js writes one when the variable is set: every frame the glass made and
   the motion layer's log of every change it played) and prints, for each change (the map to a town and back, the shop's buy, a job
   taken, the camp, the crew screen, the way into a fight and out), the frames inside it: frames a second, the median and the worst
   frame, the share over 16.7 and over 33 ms. node tools/bohemia_every_change_at_sixty.js <log> [--json] */
'use strict';
const fs = require('fs');
function cut(ts, a, b) { const t = ts.filter(x => x >= a && x <= b), d = []; for (let i = 1; i < t.length; i++) d.push(t[i] - t[i - 1]);
  const s = d.slice().sort((p, q) => p - q), q = (f) => s.length ? s[Math.min(s.length - 1, Math.floor(f * s.length))] : 0, span = t.length > 1 ? t[t.length - 1] - t[0] : 0;
  return { frames: d.length, ms: Math.round(b - a), fps: span ? +(1000 * d.length / span).toFixed(1) : 0, p50: +q(0.5).toFixed(1), max: +(s[s.length - 1] || 0).toFixed(1),
    over17: d.filter(x => x > 17.5).length, over33: d.filter(x => x > 34.1).length }; }
function changes(line) {
  const ts = (line.t || []).map(x => x + line.origin), out = [];
  (line.log || []).forEach(r => { if (r.t0 == null) return; const t0 = r.t0 < 1e12 ? r.t0 + line.origin : r.t0, t1 = r.t1 != null ? (r.t1 < 1e12 ? r.t1 + line.origin : r.t1) : t0 + (r.ms || r.planned || 0);
    if (!(t1 > t0)) return; out.push(Object.assign({ change: r.id + ' ' + r.how + (r.reduced ? ' (less motion)' : ''), planned: r.planned }, cut(ts, t0, t1))); });
  (line.dive || []).forEach(r => { if (r.t0 == null || !r.ms) return; const t0 = r.t0 + line.origin; out.push(Object.assign({ change: 'the way ' + (r.kind === 'down' ? 'into a fight' : 'out of a fight') + ' (MOTION 2)' + (r.reduced ? ' (less motion)' : ''), planned: r.ms }, cut(ts, t0, t0 + r.ms))); });
  return out; }
if (require.main === module) {
  const f = process.argv[2]; if (!f) { console.error('node tools/bohemia_every_change_at_sixty.js <BOHEMIA_FRAME_LOG file>'); process.exit(2); }
  const lines = fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
  const all = []; lines.forEach(l => changes(l).forEach(c => all.push(Object.assign({ script: l.script, profile: l.profile }, c))));
  if (process.argv.includes('--json')) { console.log(JSON.stringify(all, null, 1)); process.exit(0); }
  all.forEach(c => console.log((c.profile + ' ' + c.change).padEnd(46) + String(c.fps).padStart(6) + ' fps  median ' + String(c.p50).padStart(5) + '  worst ' + String(c.max).padStart(6) + ' ms  ' + c.over17 + '/' + c.frames + ' over 16.7, ' + c.over33 + ' over 33  (' + c.ms + ' ms)'));
}
module.exports = { changes, cut };
