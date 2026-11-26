#!/usr/bin/env node
/* __BOHEMIA_SOLO__ -- THIS GATE MEASURES TIME, SO IT RUNS WITH THE BOX TO ITSELF (gates/bohemia_gates.py reads the marker).
   ============================================================================
   NEVER CHOPPY: THE FRAME WALK (PLUMBER 8, 11/26/26; VAMILY rule 480(c)(d), Paolo 11/26: 'make sure fps is never choppy for nothing').
   One walk through every screen and every move between them on a slowed phone (tools/bohemia_frame_walk.js: the freeze census's walk
   of the demo with rule 480's own steps, and the alpha's VOTE tab; 390 x 844, touch, the CPU slowed 4x, the canvas on a GPU process).
   A HITCH is a frame past 50 ms; A CHOPPY SCREEN averages under 55 frames a second. Every hitch says whether the page's own code ran in
   it (its tasks over 50 ms, and the frame each ran in) or only the drawing did.
     W1 the walk reached every screen: the demo's steps and the VOTE tab's, none left unpressed
     R1 RULE 480, EVERY STEP: inside the bar (55 frames a second on the mean, no frame past 50 ms), or KNOWN, its owner and ask row
        named below, and inside its ratchet: its frames past 50 ms WITH THE PAGE'S OWN CODE IN THEM at most the ceiling (these travel
        to his phone as they are); the worst of them and its frames a second printed against their lines, not judged (this
        box's software GPU stalls for seconds with no page code running: 6 to 22 s single frames measured on steps that read 1 to 8 s
        on the walk before). A step with no line is judged by rule 480 whole. The ratchet is this box's measured truth with headroom for the box; it may only tighten: a lane
        whose change drops a frame does not ship it (480(d)), and an owner who fixes a step moves its line or deletes it
     R2 the walk's frames past 50 ms with the page's own code in them, all steps together, at most the ratchet's total
     R3 A PICTURE MADE ONCE NEVER WAITS ON THE GPU: no PNG of the pictures each page makes once (the counts' marks and the arrow, the
        crash box's tin, gold, rivet and tape, the grain, the supply icons) is read off a canvas the GPU draws (each such read waited
        for everything the GPU had queued: 4.6 s and 2.7 s in his place and at the board, measured; __THE_PICTURES_MADE_ONCE_ON_THE_CPU__)
     P1 PLANT 52 ms tasks one after another in the top page during the save: the save goes over its line (R1's own test turns red)
     P2 PLANT the old way (window.__PICTURES_ON_THE_GPU): R3's own test turns red
   This box draws through SwiftShader; a phone's GPU draws faster, so the DRAWING hitches here are the worst case and the PAGE hitches
   are the ones that travel to his phone as they are. records/BOHEMIA_PLUMBER_THE_FRAME_WALK_11_26_26.md. About 40 min (two walks).
   ============================================================================ */
'use strict';
const path = require('path');
const ROOT = path.dirname(__dirname);
const W = require(path.join(ROOT, 'tools', 'bohemia_frame_walk.js'));
let pass = 0, fail = 0;
const ok = (n, c, w) => { if (c) pass++; else fail++; console.log((c ? '  ok   ' : '  FAIL ') + n + (w != null ? '  [' + w + ']' : '')); };

/* THE RATCHET (KNOWN, ROUTED): each step that misses rule 480 today, its owner, its ask row, and the line it may not cross. Matched by
   the step's name from its start (the longest key wins). A step with no line here is held to rule 480 itself. */
/* measured 11/26 on four walks of this box (the build before and after __THE_PICTURES_MADE_ONCE_ON_THE_CPU__, and this gate's first two
   runs): page = 3x the largest count + 10, pageWorst = 3x the largest worst + 3,000 ms, fps = a quarter of the smallest. Loose on purpose:
   this box's software GPU and its 4x CPU swing a step 2x to 10x between walks (the pan's worst page frame 1.1 s on one walk, 10.7 s on the
   next; a town's opening 0.3 s, then 7.2 s); it catches a step gone many times worse; R2, the walk's total, is the tight one */
const KNOWN = {
  "boot (the page opening to the first mark)": { fps: 1.4, page: 265, pageWorst: 15600, owner: "PLUMBER 8 (the loads)", row: "561, 724" },
  /* the reload, from the two walks that reached it (the profiled walk: 6.5 fps, 41 page hitches, the worst 3.9 s; this gate's fifth run: 8.9,
     38, 3.5 s): the walks the other lines came from timed out opening the page again (300 s) */
  "the reload (the page opening again, a saved game)": { fps: 1.6, page: 133, pageWorst: 14799, owner: "PLUMBER 8 (the loads)", row: "561, 724" },
  "back in the game after the reload": { fps: 5.4, page: 55, pageWorst: 4338, owner: "PLUMBER 8 (the loads)", row: "561" },
  "the town he wakes in": { fps: 1.3, page: 25, pageWorst: 3750, owner: "RUN (the town screen)", row: "566, 731" },
  "town > map (his LEAVE)": { fps: 0.1, page: 16, pageWorst: 30348, owner: "RUN (the town screen)", row: "566, 731" },
  "the map, standing": { fps: 3.8, page: 46, pageWorst: 8049, owner: "WORLD 13 (the map's draw loop)", row: "731, 741" },
  "the map travelling, slowest speed (1)": { fps: 0.3, page: 52, pageWorst: 6150, owner: "WORLD 13 (the map's draw loop)", row: "731, 741" },
  "the map travelling, fastest speed (4)": { fps: 0.3, page: 37, pageWorst: 7701, owner: "WORLD 13 (the map's draw loop)", row: "731, 741" },
  "the map panned (a finger drag)": { fps: 1.4, page: 73, pageWorst: 34500, owner: "WORLD 13 (the map's draw loop)", row: "731, 741" },
  "the pinch in, to the street": { fps: 2.8, page: 118, pageWorst: 62148, owner: "WORLD 13 (the map's draw loop)", row: "731, 741" },
  "the pinch out, to the far stop": { fps: 2.3, page: 166, pageWorst: 65748, owner: "WORLD 13 (the map's draw loop)", row: "731, 741" },
  "map > town": { fps: 1.2, page: 43, pageWorst: 24798, owner: "RUN (the town screen)", row: "566, 731" },
  "town > shop": { fps: 0.1, page: 13, pageWorst: 4701, owner: "RUN (the town screen)", row: "566, 731" },
  "shop > an item": { fps: 1.1, page: 19, pageWorst: 17151, owner: "RUN (the town screen)", row: "566, 731" },
  "the sheet shut": { fps: 0.3, page: 19, pageWorst: 19800, owner: "RUN (the town screen)", row: "566, 731" },
  "town > the jobs (the board)": { fps: 1, page: 19, pageWorst: 26298, owner: "JOBS 2", row: "730, 740" },
  "the jobs: a job read": { fps: 0.6, page: 22, pageWorst: 30750, owner: "JOBS 2", row: "730, 740" },
  "the jobs shut": { fps: 1.3, page: 13, pageWorst: 4350, owner: "JOBS 2", row: "730, 740" },
  "town > the lot": { fps: 0.1, page: 16, pageWorst: 5151, owner: "RUN (the town screen)", row: "566, 731" },
  "SEARCH THE LOT (the minigame opens)": { fps: 3.9, page: 43, pageWorst: 17700, owner: "SCAVENGE", row: "632" },
  "the minigame played (a spot tapped, its dial)": { fps: 3.7, page: 22, pageWorst: 12399, owner: "SCAVENGE", row: "632" },
  "the minigame left": { fps: 1.9, page: 31, pageWorst: 14451, owner: "SCAVENGE", row: "632" },
  "map > camp": { fps: 0.8, page: 22, pageWorst: 5301, owner: "CAMP FOUR", row: "728" },
  "camp > map": { fps: 11.2, page: 19, pageWorst: 5100, owner: "CAMP FOUR", row: "728" },
  "a fight starts (the way in)": { fps: 1.4, page: 61, pageWorst: 14250, owner: "COMBAT FOUR", row: "613, 699, 732" },
  "the fight on AUTO at 1x": { fps: 2.7, page: 16, pageWorst: 4200, owner: "COMBAT FOUR", row: "613, 699, 732" },
  "the fight on AUTO at 4x": { fps: 0.4, page: 13, pageWorst: 4500, owner: "COMBAT FOUR", row: "613, 699, 732" },
  "the fight ends (won, the spoils)": { fps: 0.1, page: 19, pageWorst: 5400, owner: "COMBAT FOUR", row: "613, 699, 732" },
  "the spoils > map": { fps: 0.7, page: 31, pageWorst: 11049, owner: "PLUMBER 8 with FIGHT SCREEN 3 and WORLD 13 (the map's ink read back)", row: "725, 741" },
  "a boss fight starts": { fps: 0.7, page: 82, pageWorst: 23850, owner: "COMBAT FOUR", row: "613, 699, 732" },
  "the boss fight on AUTO": { fps: 1.2, page: 28, pageWorst: 5499, owner: "COMBAT FOUR", row: "613, 699, 732" },
  "the boss fight ends (won)": { fps: 0.1, page: 19, pageWorst: 5349, owner: "COMBAT FOUR", row: "613, 699, 732" },
  "the boss spoils > map": { fps: 1.1, page: 43, pageWorst: 6699, owner: "PLUMBER 8 with FIGHT SCREEN 3 and WORLD 13 (the map's ink read back)", row: "725, 741" },
  "a home base planted": { fps: 0.6, page: 37, pageWorst: 4401, owner: "HOME BASE 3", row: "729" },
  "map > the home base": { fps: 1.6, page: 46, pageWorst: 4350, owner: "HOME BASE 3", row: "729" },
  "his place: the pinch in (its camera)": { fps: 1.4, page: 55, pageWorst: 24999, owner: "HOME BASE 3", row: "729" },
  "his place: the pinch out": { fps: 1.2, page: 46, pageWorst: 20649, owner: "HOME BASE 3", row: "729" },
  "the home base > map": { fps: 1.9, page: 22, pageWorst: 11301, owner: "HOME BASE 3", row: "729" },
  "a save": { fps: 0.9, page: 13, pageWorst: 4200, owner: "PLUMBER 8 (the loads)", row: "561, 724" },
  "the alpha: boot (the page opening)": { fps: 1.5, page: 31, pageWorst: 7299, owner: "PLUMBER 8 (the loads)", row: "561, 724" },
  "the alpha: its loading screen to BEGIN": { fps: 0.6, page: 73, pageWorst: 23598, owner: "PLUMBER 8 (the loads)", row: "561, 724" },
  "the VOTE tab, standing": { fps: 4.4, page: 283, pageWorst: 18999, owner: "PLUMBER 8 (the alpha's cast and the jobs behind the tab) with WORDS THREE (the tab)", row: "724" },
  "the VOTE tab dragged (a finger, down and back)": { fps: 14.9, page: 10, pageWorst: 3000, owner: "PLUMBER 8 (the alpha's cast and the jobs behind the tab) with WORDS THREE (the tab)", row: "724" },
};
const TOTAL_OVER50 = 538;   /* 430, 387, 403 and 390 measured: 1.25x the largest */
const PICTURES = /\b(ucMask|arrowURL|vars|tin|rivet|tapeTile|grainURL|supplyIcon)\b/;

const line = (step) => { const k = Object.keys(KNOWN).filter(k => step.indexOf(k) === 0).sort((a, b) => b.length - a.length)[0]; return k ? KNOWN[k] : null; };
/* a KNOWN step is held on the page's own hitches; its frames a second are printed against its floor, never judged: on this box they are the
   software GPU's (a step with no page hitch read 0.4 fps against 1.1 on the gate's fifth run, a 5.8 s frame of drawing alone) */
/* and judged on HOW MANY page hitches it has; the worst of them is printed against its line (on this box one task can run 2x to 10x
   longer on one walk than the next: 7.9 s on the way home from the boss's spoils on the fifth run, 1.2 to 3.5 s on the walks before) */
const inside = (j, L) => L && j.over50page <= L.page;
const holds = (j) => j.ok || inside(j, line(j.step));
const gpuPictures = (o) => { const all = (o.walk || []).concat(o.reload || []), out = [];
  all.forEach(s => Object.entries(s.gpuBy || {}).forEach(([k, n]) => { if (/ png /.test(k) && PICTURES.test(k)) out.push(s.step.slice(0, 24) + ': ' + n + 'x ' + k.slice(0, 90)); })); return out; };

(async () => {
  const o = await W.frameWalk({});
  console.log(W.report(o));
  const J = o.judged || [];
  ok('W1 the walk reached every screen (' + J.length + ' steps, the VOTE tab\'s among them)', J.length >= 40 && !(o.notWalked || []).length && !o.voteErr && J.some(j => /VOTE tab/.test(j.step)),
    ((o.notWalked || []).join('; ') || o.voteErr || 'all pressed') + (o.reloadErr ? '; THE RELOAD NOT WALKED: ' + String(o.reloadErr).slice(0, 80) : ''));
  const bad = J.filter(j => !holds(j));
  const known = J.filter(j => !j.ok && line(j.step)).map(j => { const L = line(j.step); return j.step.slice(0, 30) + ' ' + j.fps + '/' + L.fps + ' fps, page ' + j.over50page + '/' + L.page + ' worst ' + j.worstPage + '/' + L.pageWorst + ' ms (' + L.owner + ')'; });
  ok('R1 RULE 480, EVERY STEP: inside the bar (55 fps, no frame past 50 ms) or KNOWN (owner, row) and inside its ratchet; ' + J.filter(j => j.ok).length + ' of ' + J.length + ' inside the bar',
    J.length > 0 && bad.length === 0,
    bad.length ? 'OVER: ' + bad.map(j => { const L = line(j.step); return j.step + ' ' + j.fps + ' fps, ' + j.over50page + ' page hitches, the worst ' + j.worstPage + ' ms' + (L ? ' against ' + L.fps + ' fps, ' + L.page + ', ' + L.pageWorst + ' ms (' + L.owner + ')' : ' (no line: rule 480 itself)') + ' ' + j.top.slice(0, 1).join(''); }).join(' | ')
      : 'KNOWN, ROUTED: ' + known.join('; '));
  const tot = J.reduce((q, j) => q + j.over50page, 0);
  ok('R2 the walk\'s frames past 50 ms with the page\'s own code in them, in all, at most ' + TOTAL_OVER50, tot <= TOTAL_OVER50, tot + ' (' + J.reduce((q, j) => q + j.over50, 0) + ' past 50 ms in all, the drawing\'s among them)');
  const gp = gpuPictures(o);
  ok('R3 A PICTURE MADE ONCE NEVER WAITS ON THE GPU: no PNG of the once-made pictures read off a GPU canvas over the walk', gp.length === 0, gp.join(' | ') || 'none');

  /* the plants: one walk, both armed, stopped after the save (the boot already makes the crash box's pictures) */
  /* 52 ms tasks one after another during the save (the census's own mark; the step with the tightest line, 13): timers, since work done
     inside a frame's own callback is not reported as a long task (a planted 55 ms of it every frame read 0 page hitches) */
  const STALL = "if (window.top === window) setInterval(function () { try { var M = window.__FZ && __FZ.marks, m = M && M[M.length - 1]; if (!m || !/^a save/.test(m[1])) return; } catch (e) { return; } var t = performance.now(); while (performance.now() - t < 52) {} }, 16);";
  const q = await W.frameWalk({ arm: STALL + 'window.__PICTURES_ON_THE_GPU = true;', noAlpha: true, noReload: true, stopAfter: 'a save' });
  const qm = (q.judged || []).filter(j => /^a save/.test(j.step))[0];
  ok('P1 PLANT 52 ms tasks one after another during the save: the save goes over its line (R1 turns red)', !!qm && !holds(qm), qm ? qm.fps + ' fps, ' + qm.over50page + ' page hitches, the worst ' + qm.worstPage + ' ms' : 'the save never came');
  const qg = gpuPictures(q);
  ok('P2 PLANT the old way (__PICTURES_ON_THE_GPU): R3 turns red', qg.length > 0, qg.slice(0, 3).join(' | ') || 'no picture read off the GPU: the plant did not bite');
  console.log('\nNEVER CHOPPY (THE FRAME WALK): ' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); console.log('\nNEVER CHOPPY (THE FRAME WALK): ' + pass + ' passed, ' + (fail + 1) + ' failed'); process.exit(1); });
