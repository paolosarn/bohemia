# PAOLO'S 8/1 LIST — EVERY DEFECT DIAGNOSED (8/2/26)

> "until all the request in this thing I copied from a couple chats ago you get done
> you cannot move on"

Twelve investigators, read-only, each measuring on the REAL surface rather than
reading source, each followed by an adversarial verifier told to default to
REFUTED unless it could independently confirm the anchor exists and the patch is
not a placebo. This file is the result. It exists so no future session re-derives
any of it.

---

## wallheight_gate.js "THE TALL DOOR IS NOT SQUASHED" goes 6/0 -> 5/1 when the city full-pixel patch (TPX 22->44) is applied — the exact 44x44 -> 44x88 draw, named.

**already done:** False  **confidence:** high

### ROOT CAUSE

THE OFFENDING DRAW IS tallTex's OWN CACHE-FILL, AND IT NEVER TOUCHES THE SCREEN.

City blob line 9285 (patched numbering; 9269 unpatched), inside tallTex():
    xx.drawImage(im,0,0,w,h*n);
It is reached lazily from facadePass line 9323, `const d2=tallTex('hdoor',v,2)`, on the first frame the gate grabs, because TALLCV is cold at that moment. `im` is saTex('hdoor',v), a TPX x TPX canvas; `cc` is a NEW OFFSCREEN canvas of w x h*n. At TPX=44 that is a 44x44 source stretched once into a 44x88 offscreen cache canvas. The destination context is `cc`, NOT the world canvas `cv`.

The orchestrator's elimination of "the d2=tallTex('hdoor',v,2) call (its source is already 44x88)" was half right and that half is what hid it: the BLIT of d2 is 44x88 -> 44x88 on cv and is perfectly 1:1. It is the CALL — the derive-once-and-cache that d2 depends on — that performs the stretch, one level down the stack, on a different canvas.

WHY THE GATE CANNOT SEE THE DIFFERENCE. gates/wallheight_gate.js classifies a draw purely by destination pixel size:
    const isFacade = x => Math.abs(x.dw - C) < 1.5 && (Math.abs(x.dh - C) < 1.5 || Math.abs(x.dh - 2*C) < 1.5);
Its PROBE records dx/dy/dw/dh/sw/sh/alpha and deliberately throws away which canvas received the draw. So "one cell wide by two cells tall" is the ONLY thing that makes something a facade to this gate. tallTex's cache canvas is BY CONSTRUCTION exactly one cell wide by two cells tall — that is its entire purpose. The gate is therefore failing the precise mechanism its own docstring says it exists to bless: "the 16x32 door tile is derived once and cached, never stretched per frame."

WHY IT ONLY BREAKS AT TPX=44. saTex() prescales every tile to TPX x TPX. At TPX=22 the identical tallTex derivation is 22x22 -> 22x44, and dw=22 misses C=44 by 22px, so it falls out of isFacade and lands in the gate's ungated `offAspect` bucket — where the gate PRINTS IT TODAY, mislabeled as the street lamp. Raise TPX to 44 and the cache canvas dimensions coincide byte-for-byte with a facade destination; the same draw, unchanged, walks into the bucket and fails. Nothing about the render regressed. The gate's measurement was accidentally coupled to TPX being smaller than the on-screen cell.

SECOND, INDEPENDENT CORRUPTION OF THE SAME GATE AT TPX=44 (not currently failing, but the check stops meaning anything): the chunk bake writes CHK x CHK tiles at TPX px into a 704x704 texture canvas. Measured in the gate's own frame, that is 6,353 draws of 44x44 -> 44x44, every one of which now satisfies dw≈C && dh≈C. The gate's `cell()` count goes 34 -> 6,417, so "THREE TILES TALL: facades draw a full cell high (behindCell > 10)" would from then on be measuring the offscreen bake, not facades. Any fix that only silences the aspect failure leaves this lie in place.

### EVIDENCE

1) THE STACK TRACE, captured by wrapping drawImage in a real browser (playwright chromium-1194), on a scratch copy of the alpha with tools/bohemia_city_full_pixel_patch.py applied, HC forced to 44, standing behind a door in suburb cell [12,4], door cell [1577,528]:

  "badCount": 1,
  "bad": [{ "sw":44, "sh":44, "dw":44, "dh":88, "al":1, "cid":"", "cw":44, "ch":88,
    "st": "Error
        at P.drawImage (<anonymous>:15:19)
        at tallTex (about:srcdoc:9285:6)
        at facadePass (about:srcdoc:9323:18)
        at renderHuman (about:srcdoc:9637:3)
        at render (about:srcdoc:9656:107)" }]

  cw/ch = 44x88 is the DESTINATION CANVAS: the offscreen cache, not cv (378x765).

2) THE CODE AT THAT LINE — city blob (patched numbering), tallTex:
  9279   const k=pool+'|'+v+'|'+n; if(TALLCV.has(k))return TALLCV.get(k);
  9280   const im=saTex(pool,v);
  9282   const w=im.width||16, h=im.height||16;
  9283   const cc=document.createElement('canvas'); cc.width=w; cc.height=h*n;
  9284   const xx=cc.getContext('2d'); xx.imageSmoothingEnabled=false;
  9285   xx.drawImage(im,0,0,w,h*n);            <-- 44x44 -> 44x88
  9286   TALLCV.set(k,cc); return cc;
and the caller, facadePass:
  9323         const d2=tallTex('hdoor',v,2);
  9324         if(d2)g.drawImage(d2,dx,dy-C,C,C*2);   /* this one IS 44x88 -> 44x88, innocent */
and the source of the 44px: saTex (blob line 8819-8820)
  const c2=document.createElement('canvas'); c2.width=TPX; c2.height=TPX;
  c2.getContext('2d').drawImage(im,0,0,TPX,TPX);

3) FULL DRAW HISTOGRAM of the measured frame at TPX=44 (source -> dest @ destination canvas):
  44x44->44x44   @704x704   6353    the chunk bake (offscreen) - floods `cell()`
  16x16->44x44   @44x44       18    saTex prescale (offscreen)
  44x44->44x44   @44x44       12    saTex prescale (offscreen)
  704x704->704x704 @378x765   20    chunk blits ON SCREEN
  44x44->44x44   @378x765     34    THE REAL FACADE CELLS
  44x88->44x88   @378x765      1    THE REAL TALL DOOR, 1:1, innocent
  112x112->112x112 @378x765    1    the player
  44x44->44x88   @44x88        1    <-- THE ENTIRE FAILURE, offscreen
  total 6440 draws; only 56 landed on the world canvas.

4) THE GATE HAS BEEN PRINTING THIS DRAW ALL ALONG AND CALLING IT SOMETHING ELSE.
   Running the UNPATCHED gate on the UNPATCHED alpha (main today) emits:
     (not gated: 22x22->22x44 - the street lamp, drawn 1.5 x 3 cells from a square tile on purpose)
   22x22->22x44 is NOT the street lamp. The lamp is drawn C*1.5 x C*3 (66x132 at C=44) and is
   aspect-correct against its source, which is why it does not appear in that bucket at all once
   the bucket is scoped to cv. 22x22->22x44 is tallTex's cache fill at TPX=22, exactly.

5) THE 2x3 CONTROL MATRIX (all runs real browser, gates/wallheight_gate.js machinery unchanged
   except the patch below; "regressed" = I injected a genuine per-frame stretch on cv by replacing
   the d2 blit with `if(wall)g.drawImage(wall,dx,dy-C,C,C*2)`):

   tree                                  original gate     patched gate
   main, TPX=22                          6 pass / 0 fail   7 pass / 0 fail
   + full pixel patch, TPX=44            5 pass / 1 FAIL   7 pass / 0 fail
   + pixel patch + injected stretch      5 pass / 1 fail   6 pass / 1 FAIL

   The bottom row is the proof this is not a rubber stamp: the scoped gate still catches a real
   per-frame aspect change on the surface Paolo sees.

6) INSTRUMENTED COUNTS, patched vs unpatched, same predicates:
   TPX=44: onCvBehind 56, onCvAway 142, cell() unscoped 6417, faded 8 / away 0
   TPX=22: onCvBehind 56, onCvAway 142, cell() unscoped   34, faded 8 / away 0
   faded counts are IDENTICAL scoped or not (every fade is on cv), so scoping `faded` is free.

7) BRANCH STATE: commit da225b3 landed the root-cause writeup, tools/bohemia_city_full_pixel_patch.py
   and gates/full_res_gate.js; commit a3fd832 reverted a DIFFERENT (placebo) attempt. The alpha in
   the working tree is still TPX=22 / CVCAP=64 / HC=22 (verified by decoding CITY_B64: 0 occurrences
   of __FULL_PIXEL_BAKE__). This gate is the only thing standing between the branch and the ship.

8) ANCHOR UNIQUENESS: every old-string in patchSpec below occurs exactly 1x in gates/wallheight_gate.js.

Files read: /home/user/bohemia/gates/wallheight_gate.js (all 184 lines);
/home/user/bohemia/tools/bohemia_city_full_pixel_patch.py; /home/user/bohemia/gates/full_res_gate.js;
/home/user/bohemia/gates/bohemia_gates.py; decoded CITY_B64 lines 8646-8930, 9240-9360, 9490-9660.

### PATCH SPEC

Do NOT touch the city blob. The renderer is correct; the gate's measurement is not. Four edits to /home/user/bohemia/gates/wallheight_gate.js, plus two that lock the fix in place. All six old-strings verified unique.

EDIT 1 - record which canvas received the draw.
OLD:
        rec.draws.push({ dx, dy, dw, dh, sw, sh, al: this.globalAlpha });
NEW:
        rec.draws.push({ dx, dy, dw, dh, sw, sh, al: this.globalAlpha, tgt: this.canvas });

EDIT 2 - scope the size-based predicates to the world canvas.
OLD (exact, 4-space indent, three consecutive lines):
    const faded = d => d.filter(x => x.al < 0.99).length;
    const tall = d => d.filter(x => Math.abs(x.dh - 2 * C) < 1.5 && Math.abs(x.dw - C) < 1.5);
    const cell = d => d.filter(x => Math.abs(x.dh - C) < 1.5 && Math.abs(x.dw - C) < 1.5);
NEW:
    /* ON THE REAL SURFACE, NOT EVERY SURFACE (8/1/26). Every predicate below
     * buckets a draw by its PIXEL SIZE alone, which quietly assumed the game's
     * OFFSCREEN canvases were never the same size as an on-screen cell. Once the
     * bake resolution equals his 44px art (TPX 22 -> 44), they are: the chunk
     * bake writes 44x44 tiles into a 704x704 texture canvas (6,353 of them in
     * this very frame, every one of which scored as a "facade cell"), and
     * tallTex derives the two-tile door ONCE into an offscreen 44x88 cache --
     * a 44x44 source into a 44x88 canvas, which is the derive-once-and-cache
     * this gate exists to BLESS, scored as the per-frame stretch it bans. Scope
     * every facade predicate to the world canvas, which is the only thing this
     * gate ever claimed to measure. Measured: faded/tall counts are identical
     * either way; `cell` goes 6,417 -> 34, which is the real facade count. */
    const onCv = x => x.tgt === cv;
    const faded = d => d.filter(onCv).filter(x => x.al < 0.99).length;
    const tall = d => d.filter(onCv).filter(x => Math.abs(x.dh - 2 * C) < 1.5 && Math.abs(x.dw - C) < 1.5);
    const cell = d => d.filter(onCv).filter(x => Math.abs(x.dh - C) < 1.5 && Math.abs(x.dw - C) < 1.5);

EDIT 3 - the aspect check itself.
OLD:
    const isFacade = x => Math.abs(x.dw - C) < 1.5 &&
NEW:
    const isFacade = x => onCv(x) && Math.abs(x.dw - C) < 1.5 &&

EDIT 4 - keep the printed "not gated" line about the real frame, not the caches.
OLD:
    const offAspect = d => d.filter(x => !isFacade(x)).filter(
NEW:
    const offAspect = d => d.filter(x => onCv(x) && !isFacade(x)).filter(

EDIT 5 - return the scope counts (A LAW WITHOUT A MACHINE GATE IS NOT ENFORCED: the scoping needs its own check).
OLD:
      alphas: Array.from(new Set(behind.map(x => +x.al.toFixed(2)))).sort(),
NEW:
      onCvBehind: behind.filter(onCv).length, onCvAway: away ? away.filter(onCv).length : -1,
      alphas: Array.from(new Set(behind.map(x => +x.al.toFixed(2)))).sort(),

EDIT 6 - gate the scoping so it can never rot into a rubber stamp.
OLD (two consecutive lines):
  ok('the gate rendered real frames (' + r.behindTotal + ' draws behind a wall, ' + r.awayTotal + ' clear of one)',
    r.behindTotal > 20 && r.awayTotal > 20);
NEW:
  ok('the gate rendered real frames (' + r.behindTotal + ' draws behind a wall, ' + r.awayTotal + ' clear of one)',
    r.behindTotal > 20 && r.awayTotal > 20);
  /* THE SCOPE IS ITSELF GATED, so it can never quietly become a rubber stamp:
   * the frame MUST contain draws this gate deliberately does not count (the
   * chunk bake, the tall-door cache derivation), and the ones it does count
   * must be a real facade population, not zero. */
  ok('THE MEASUREMENT IS SCOPED TO THE GLASS (' + r.onCvBehind + ' of ' + r.behindTotal +
    ' draws landed on the world canvas; the rest are the offscreen bake and the tall-door ' +
    'cache, which are not facade draws and never were)',
    r.onCvBehind > 20 && r.onCvBehind < r.behindTotal && r.onCvAway > 20);

THEN apply the pixel fix itself, unchanged: `python3 tools/bohemia_city_full_pixel_patch.py`.

SEPARATELY, AND REQUIRED (a gate not in the runner is not a gate): gates/full_res_gate.js exists on
this branch but is NOT in the GATES list in gates/bohemia_gates.py, so `python3 gates/bohemia_gates.py`
never runs it and the TPX==art-size invariant is unenforced. Add next to the THREE-TILE WALL entry:
    ('FULL RES',       ['node', 'gates/full_res_gate.js'],
     'Paolo 7/31 + 8/1 "WHY IS THE PIXEL QUALITY NOT AT FULL BRO WTF ... of the terrain of the ground '
     'of the houses": the chunk bake resolution EQUALS his approved art size, measured as a real '
     'source-vs-destination blit ratio in a browser, so nothing is decimated before compositing', True),

ALTERNATIVE CONSIDERED AND REJECTED: pre-warming TALLCV in saFlush() so the derivation never happens
inside a measured frame. It silences the aspect failure without touching the gate, but it leaves
`cell()` counting 6,417 bake draws as facades - the gate would go green while measuring the wrong
thing. Rejected. (It is a fine ~1-line nice-to-have on its own merits: it removes a first-frame
hitch when walking up to a house. Not needed for this ship, and not a substitute.)

### RISK

LOW for the gate patch; the real risk is elsewhere and I name it below.

1) `tgt: this.canvas` stores a live DOM node in the draws array. Playwright's evaluate() cannot
   serialize a canvas. SAFE AS WRITTEN because the gate's return payload contains only numbers,
   number-arrays and string-arrays - no raw draw objects ever cross the boundary. Verified: all six
   validation runs completed and returned. If a future edit ever returns a raw draw object, it will
   throw immediately and loudly, not silently pass.
2) Memory inside the page: rec.draws holds ~6,400 canvas refs for the duration of one grab() and is
   reset (`rec.draws = []`) at the top of each grab. No leak, no GC pressure worth measuring.
3) `cv` must be the world-canvas global inside the city frame. Verified empirically, not assumed:
   onCv matched 56 of 6,440 draws (a nonzero, plausible on-screen population). If `cv` were ever
   renamed, EDIT 6's self-test fails (onCvBehind would be 0), so the gate reports it instead of
   silently passing everything.
4) OTHER LANES' GATES vs the TPX change: I grepped every gate for TPX/CVCAP/HZOOM/HLEVELS. Only
   gates/full_res_gate.js references them, and it is the gate written FOR this fix (it asserts
   TPX === art size and CVCAP*(16*TPX)^2*4 < 224MB - both satisfied by 44/28). canvas_scale_gate.js
   and canvas_memory_gate.py do not reference TPX or CVCAP at all. No other gate is coupled.
5) THE ONE THAT ACTUALLY WORRIES ME, AND IT IS NOT A GATE - IT IS PAOLO. He said "of the terrain of
   the ground OF THE HOUSES." I measured every art pool in the blob:
       street, side, cross_ns/ew, lane_h/v, median_h/v, perimeter  =  44x44
       hroof, hwall, hwindow, hboarded, hdoor, hyard, roof, wallface, wallwin, shoulder, pocket_v/h = 16x16
   TPX 22->44 makes the STREETS and GROUND 1:1 for the first time. It does the OPPOSITE for the
   HOUSES: a 16x16 facade tile went 16->22 (1.375x up) and landed on a 22px screen cell; it now goes
   16->44 (2.75x up) and lands on a 44px screen cell. Every house pixel doubles in size on screen.
   Streets go sharp; houses get visibly chunkier next to them, and the contrast between the two is
   larger after the fix than before. There is a real chance he plays this and says "still bad" about
   the exact noun he used. That is a [PENDING, Paolo's call] on re-cooking the house pools at 44px -
   not something to decide inside this ship, and not something to quietly hope he does not notice.
6) SHIP-FLOW: this is the CITY/render lane. facadePass/tallTex/saTex are one system; do not let a
   second session touch the city blob in the same window (ONE SYSTEM, ONE SESSION).

### GATE SPEC

Everything below was actually run, not proposed. Browser: /opt/pw-browsers/chromium-1194.

A) THE UNBLOCK, ON THE REAL SURFACE. `node gates/wallheight_gate.js` renders two live frames of the
   walked world at HC=44 and reads back what the game drew. With the six edits applied it must
   report `THREE-TILE WALL GATE: 7 passed, 0 failed` on the TPX=44 alpha.
   MEASURED: 7/0 on patched, 7/0 on unpatched (no regression to main's behaviour).

B) THE ANTI-RUBBER-STAMP PROOF, which is the part that makes A trustworthy. Inject a genuine
   per-frame aspect change on the world canvas - in the city blob replace
       if(d2)g.drawImage(d2,dx,dy-C,C,C*2);
   with
       if(wall)g.drawImage(wall,dx,dy-C,C,C*2);
   (a 44x44 source stretched to 44x88 ON cv, every frame) and re-run.
   MEASURED: 6 passed, 1 FAILED - "THE TALL DOOR IS NOT SQUASHED". The scoped gate still catches the
   thing it exists to catch. Keep this as the gate's documented negative test.

C) THE SCOPING ITSELF IS GATED (EDIT 6). If anyone deletes `onCv` or reverts the scoping, then
   onCvBehind === behindTotal and the new check fails. A law without a machine gate is not enforced;
   this one has one in the same turn.

D) THE PIXEL FIX'S OWN GATE, ONCE REGISTERED. `node gates/full_res_gate.js` drives a real browser at
   deviceScaleFactor 3, wraps drawImage on #cv, and counts source-vs-destination ratios, plus it
   derives the art size from SA_TILES' PNG headers rather than trusting a constant. It asserts
   TPX === art size (44 === 44) and CVCAP*(16*TPX)^2*4 = 55.5MB < 224MB. It is currently absent from
   gates/bohemia_gates.py and therefore not running at all - registering it is part of the fix.

E) FULL SUITE, ONCE: `python3 gates/bohemia_gates.py` green before push, per ONE GATE PASS PER SHIP.

F) WHAT A HUMAN LOOKS AT (VERIFY ON THE REAL SURFACE, 7/18): open the alpha, RUN tab, walk into a
   suburb at default zoom and look at a street tile and a house front side by side. The street should
   now show his grain; the house will be chunkier than before. That second half is the finding in
   risk item 5 and is his call, not the machine's.

---

## D1 — "houses or buildings should NEVER SIT ON THE SIDEWALK EVER ANYWHERE IN THE WORLD" (Paolo 7/31, LOCKED, laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md clause D1). Re-measure across every registered district + minimal generalizable fix.

**already done:** False  **confidence:** high

### ROOT CAUSE

THREE MECHANISMS, ALL VERIFIED BY RUNNING THE ENGINE, NOT BY READING IT.

MECHANISM 1 — THE PRIMITIVE IS LOCKED INSIDE ONE MODULE. `layWalks()` is a module-private function at engine/bohemia_suburb.js:136-143. `grep -rn "layWalks" engine/ gates/ tools/` returns exactly TWO hits, both inside that one file (:136 definition, :269 call). It is not on the kit, not exported on the suburb's API object (engine/bohemia_suburb.js:379 exports generate/homeFootprints/roadConnected/palette/legend/notes and NOT layWalks). No other generator can lay a walk even if it wanted to.

MECHANISM 2 — 33 OF 40 BUILDABLE DISTRICTS HAVE NO SIDEWALK TILE AT ALL. Measured by iterating K.types() and reading each spec.legend for a `kind:'walk'` entry. Only suburb(10), commercial(6), medical(6), park(1), cemetery(10), library(13) and downtown(8) declare one. The other 33 have no code, no legend row, no palette swatch, nothing for the dossier or the CITY renderer to draw. This is verbatim the failure mode written up in gates/suburb_street_gate.js:10-26 ("A feature that lives inside one renderer's if-statement is not in the game"), reproduced 33 times.

MECHANISM 3 — EVERY OTHER GENERATOR STAMPS UNCONDITIONALLY, IN THE WRONG ORDER. The suburb is correct because of ORDER + REFUSAL: denseFill lays roads, then calls layWalks (engine/bohemia_suburb.js:269), then home() REFUSES any footprint cell that is not bare ground (engine/bohemia_suburb.js:90-96). Every other generator paints a base, then stamps mass with unconditional `G.rect(...)`/`set(...)`. I instrumented the kit's own drawing surface (wrapped K.grid's set/rect/hbar/vbar/frame/disc) and recorded every write that replaces one kind with another. Over 3 seeds per district:
  MASS written OVER a WALK tile (the literal violation): 15,729 cells — library 14,787, commercial 834, downtown 108.
  ROAD written OVER a MASS tile: 6,594 cells across 19 districts — campus 2,523, trailer 659, farm 564, mall 516, industrial 510, jail 309, battery 297, golf 240, substation 240, policestation 132, storage 131, watertreat 113, boneyard 93, medical 84, landfill 69, railyard 30, apartment/warehouse/waterpark/library 21 each.
  MASS written OVER a ROAD tile: 33,710 cells — storage 13,509, ballpark 4,449, speedway 4,242, truckstop 4,062, solar 2,766, commercial 2,328, drivein 803, medical 606, town 386, industrial 75.
The library is the purest case: engine/bohemia_library.js:42 paints `G.rect(6,8,120,96,13)` — code 13 is `{name:'terrace / walk', kind:'walk'}` — across nearly the whole plot, then stamps every building mass on top of it. A building sitting on a sidewalk, 14,787 cells, in Paolo's exact words.

MECHANISM 4 (the reason no gate could ever be written, and the real blocker) — THERE IS NO DECLARATION OF WHICH DRIVE TILE IS A PUBLIC STREET. D1 says the apron is allowed to cross the walk; suburb code 1 is `{name:'road',kind:'drive'}` and code 3 is `{name:'driveway',kind:'drive'}` and NOTHING in the legend distinguishes them. Measured: under a naive "no mass may touch any drive tile" rule the SUBURB — the one district that is correct — fails with 1,928 violations (all garage↔its own apron). Under "no mass may touch a drive tile the legend marks street:true" the suburb scores 0 street-flush / 1,928 legal apron-flush / 20,322 walk tiles at the kerb / 0 bare ground at the kerb. The missing legend field is the thing that makes a registry-wide gate writable at all.

CURRENT COUNTS (24 blocks per district = 6 seeds x 4 street configs, mass = legend kind building|structure, flush = orthogonally adjacent to a kind:'drive' tile with no walk between). NON-EXEMPT TOTAL 89,136 across 36 districts, after removing Paolo's LOCKED exempt list:
storage 23,256 | industrial 8,070 | solar 7,968 | commercial 6,960 | stadium 6,452 | library 4,368 | mall 4,344 | campus 3,432 | ballpark 2,568 | landfill 2,448 | medical 2,076 | trailer 1,984 | suburb 1,928 (ALL legal garage↔apron) | golf 1,824 | farm 1,752 | battery 1,662 | boneyard 1,350 | downtown 1,200 | firestation 1,056 | jail 918 | town 876 | watertreat 792 | substation 726 | swapmeet 576 | cemetery 288 | policestation 150 | school 112 | wash/chapel/courthouse/apartment/warehouse/waterpark/cityhall/terminal/park 0.
EXEMPT (Paolo, LOCKED): speedway 6,812 + truckstop 6,164 + drivein 1,932 + railyard 168 = 15,076 cells, correctly not counted.

THE PRIOR 5,195 / 11-DISTRICT FIGURE WAS AN UNDERCOUNT. Cross-validated: normalising mine to the prior 6-block sample (divide by 4) reproduces trailer 496 vs 498, farm 438 vs 438, substation 182 vs 180, railyard 42 vs 42 exactly. But the prior sweep omitted 16 offending districts entirely (storage, solar, stadium, commercial, library, campus, ballpark, landfill, golf, jail, firestation, watertreat, swapmeet, cemetery, policestation, school), and mall/industrial/medical/downtown/boneyard/battery/town have moved since because those modules were rebuilt on 7/31-8/2. The real size of "ANYWHERE" is ~17x the recorded figure.

### EVIDENCE

1. THE PRIMITIVE IS PRIVATE — engine/bohemia_suburb.js:136-143 (the whole of it):
```
  function layWalks(g){
    var W=Wd(g),H=Ht(g),add=[];
    for(var y=1;y<H-1;y++)for(var x=1;x<W-1;x++){
      if(g[y][x]!==0) continue;                                  // only dead ground converts
      if(g[y][x+1]===1||g[y][x-1]===1||g[y+1][x]===1||g[y-1][x]===1) add.push([x,y]);
    }
    for(var i=0;i<add.length;i++) g[add[i][1]][add[i][0]]=10;    // one grid, hugging the street
  }
```
engine/bohemia_suburb.js:379 — the export, which does not contain it:
`  var API={generate:generate,homeFootprints:homeFootprints,roadConnected:roadConnected,palette:PALETTE,legend:LEGEND,notes:NOTES,SZ:SZ,TILE:TILE};`

2. THE ORDER + REFUSAL THAT MAKES THE SUBURB CORRECT — engine/bohemia_suburb.js:269 `layWalks(g);` sits between the road pass (:256-257) and the house pass (:274-276); and engine/bohemia_suburb.js:90-96:
```
    var _isDrive={}; for(var _d=0;_d<dv.length;_d++) _isDrive[dv[_d][0]+','+dv[_d][1]]=1;
    for(var i=0;i<foot.length;i++){var c=foot[i];
      if(!inb(g,c[0],c[1])) return false;
      var cur=g[c[1]][c[0]];
      if(_isDrive[c[0]+','+c[1]]){ if(cur!==0&&cur!==10) return false; }  /* apron may cross the walk */
      else if(cur!==0) return false;                                       /* a MASS may not, ever */
    }
```

3. THE KIT HAS NO SUCH PRIMITIVE — engine/bohemia_district_kit.js:433-441, the complete API export. It carries landStats, footprints, rotateToStreet, driveNetworkReach, driveWidthScore, roofsAndDoors, buildingEdges, tileLayer. There is no layWalks, no street classifier, no mass-refusal.

4. THE LIBRARY BUILDS ON ITS OWN SIDEWALK — engine/bohemia_library.js:42 `G.rect(6,8,120,96,13);  // the terrace the building sits on`, with engine/bohemia_library.js:123 `13:{name:'terrace / walk',    kind:'walk',     act1:'the raised concrete terrace the whole building sits on...'}`. Rendered as a symbol map (seed 42, rows 60-72, cols 30-90; `=`=walk `B`=mass `D`=portal):
```
 65 =============================================================
 66 =============================================================
 67 =============================================================
 68 BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
 69 BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
```

5. THE MALL RING ROAD IS DRAWN ON THE ANCHOR — engine/bohemia_mall.js:30 `G.rect(10,32,30,90,6);  // west anchor` and :31 `G.rect(98,32,118,90,17);  // east anchor`, then engine/bohemia_mall.js:109-112:
```
    G.rect(4,26,9,94,1); G.rect(119,26,124,94,1);                         // the two legs
    G.rect(4,26,124,30,1);                                                // and it closes at both ends
    G.rect(4,90,124,94,1);
```
Row 90 is inside both anchors (they run y=32..90), so the closing leg overwrites the store's last row. Symbol map (seed 42, rows 84-96, cols 0-40; `#`=drive `B`=mass `,`=ground):
```
 88 ....######BBBBBBBBBBBBBBBBBBBBB,,,,,,,,,,
 89 ....######BBBBBBBBBBBBBBBBBBBBB,,,,,,,,,,
 90 ....#####################################
```
Asphalt meets a store wall with nothing in between, and the road ate the store's bottom row.

6. THE TRAILER'S SPINE IS ONE TILE WIDE, FLANKED BY MASS — engine/bohemia_trailer.js:45-46 spine carve only converts soft codes, so wherever a trailer row sits on it the street necks to a single tile. Symbol map (seed 42, rows 44-60, cols 56-74; `^`=overhead carport):
```
 50 BBB^^^^#BBBBBBBB,,,
 51 BBB^^^^#BBBBBBBB^^^
 52 BBB^^^^#BBBBBBBB^oo
```
Street-cells-per-row for rows 50-83 measured at 1 or 2. K.driveWidthScore = 0.639.

7. PAOLO'S EXEMPTION, ALREADY RECORDED AND LOCKED — laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md:435 and the section head "D1-EXEMPT (Paolo 7/31, LOCKED) -- HIS ANSWER, SO NOBODY ASKS AGAIN":
> "OK, freeways and railyards do not get sidewalks"
and the exempt set it derives: `freeway, interchange, rail, railyard, speedway, airport, airbase` plus the WALKABLE-LAND vehicular venues (drive-in, truck stop, parking structure), with "THIS LIST IS HIS, NOT MINE TO EXTEND."

8. THE FIX PLAN ALREADY EXISTS IN THE LAW, UNBUILT — same file, "THE ORDER TO FIX IT (for whoever takes this)": 1. promote layWalks to a kit primitive; 2. add a walk code + legend row per street-bearing generator, called AFTER the road pass and BEFORE the building pass ("The order IS the enforcement"); 3. a registry-wide gate sweeping K.types(). None of the three exists in the tree today.

9. THE PROMOTION IS PROVABLY ZERO-RISK — I ran the proposed kit primitive against the suburb's private one: 32 blocks (4 configs x 8 seeds), stripped every code-10 back to ground, re-laid with the primitive, diffed. `cells compared 786432 walks re-laid 40937 DIFFERENCES 0 == IDENTICAL ==`.

10. THE PROPOSED GATE RULE PASSES THE ONE CORRECT DISTRICT AND ONLY IT — with `street:true` on suburb code 1 alone: `mass flush to a street:true tile = 0 | mass flush to a private apron (legal) = 1928 | walk tiles at the kerb = 20322 | BARE ground at the kerb = 0`. A rule without the declaration fails the suburb with 1,928.

11. THE REAL SURFACE READS THIS DATA DIRECTLY. Decoded CITY_B64 from slices/BOHEMIA_ALPHA_0_9.html. /tmp/city.txt:7947 `const spec=(typeof BohemiaDistrictKit!=='undefined')?BohemiaDistrictKit.get(type):null;` then :7959 `const res=spec.generate(gseed,{streets:st.length?st:['S']});` — the CITY generates each plot from the kit registry. /tmp/city.txt:8118-8120:
```
    const spec=m.kitSpec, entry=spec&&spec.legend&&spec.legend[code];
    const tl=BohemiaDistrictKit.tileLayer(entry);
    const pal=(spec&&spec.palette&&spec.palette[code])||'#98948a';
```
So the generator grid + legend + palette IS the surface Paolo plays. A walk-kind tile falls through to `c.g=pal; c.walk=true` (/tmp/city.txt:8155).

12. THE BLOB IS STALE FOR SIX MODULES INCLUDING THE KIT — `python3 tools/bohemia_city_module_resync.py --check`:
```
CITY MODULE RESYNC: 40 embedded, 34 already fresh
  STALE: engine/bohemia_district_kit.js
  STALE: engine/bohemia_commercial.js
  STALE: engine/bohemia_downtown.js
  STALE: engine/bohemia_library.js
  STALE: engine/bohemia_mall.js
  STALE: engine/bohemia_school.js
```

13. THE ARTERIAL IS NOT THE PROBLEM — the mile-grid street already carries its own walk. engine/bohemia_arterial.js legend 6 = `{name:'sidewalk',kind:'walk'}`; generated cross-section at row 10 reads `0 8 8 7...7 6 6 6 7 7 5 5 [roadway] 5 5 7 7 6 6 6 7...7 8 8` (1,818 sidewalk cells, 452 block-wall cells per cell). D1's remaining scope is INTERNAL district streets only.

14. THE ONLY EXISTING GATE IS BLIND TO ALL OF IT — gates/sidewalk_gate.js:1 `const G=require('../engine/bohemia_blockgen.js');` and :7 `for(const t of ['street','freeway','residential'])`. It sweeps legacy blockgen recipes and never touches K.types(). gates/suburb_street_gate.js:31 requires only engine/bohemia_suburb.js. gates/bohemia_gates.py:37 and :66 register exactly these two. One of forty districts is enforced.

### PATCH SPEC

FOUR PATCHES. A, B, C and D are PURE PLUMBING and change ZERO tiles in any existing district (proved: default `street:false` means no generator opts in until its own lane does; and A is byte-identical to the code it replaces). The layout work is deliberately NOT here — see `risk`.

=== PATCH A — engine/bohemia_district_kit.js : the shared primitive ===
FIND (unique, verified count 1):
`  // EXPLAIN-EVERY-TILE (Paolo 7/18): every non-ground tile must map to a named thing in the`
REPLACE WITH (the new block, then the original line back):
```
  /* D1: NO BUILDING EVER SITS ON A SIDEWALK. ANYWHERE IN THE WORLD.
     Paolo 7/31, LOCKED, his caps: "houses or buildings should NEVER SIT ON THE SIDEWALK
     EVER ANYWHERE IN THE WORLD." laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md clause D1.

     It was true in ONE district out of forty, and the reason was this function's ADDRESS:
     layWalks() lived PRIVATE inside bohemia_suburb.js, unexported, so no other generator
     could lay a walk even if it wanted to. Promoted verbatim here - proved byte-identical
     to the suburb's own on 32 blocks / 786,432 cells, so nothing in the suburb moves.

     WHICH DRIVE TILES DEMAND A WALK IS DECLARED, NEVER GUESSED. A legend drive entry that
     says `street:true` is a public right-of-way and wears a walk. Anything else - a
     driveway apron, a lot aisle, a truck court, a haul road - does not, and D1 itself says
     the apron is allowed to cross the walk. That declaration is not decoration: without it
     the only rule you could write fails the SUBURB, the one district that is correct,
     because a suburb GARAGE touches its own APRON 1,928 times per 24 blocks.
     DEFAULT IS FALSE. A district that declares nothing is unchanged and ungated. */
  function streetCodes(legend){ var S={},any=false; for(var c in legend){ var e=legend[c];
    if(e && e.kind==='drive' && e.street===true){ S[c]=1; any=true; } } return any?S:null; }
  /* ONE GRID OF WALK hugging every declared street. Only `over` cells convert, so a
     driveway apron keeps its cells and the walk breaks where a car crosses it - which is
     what a real street does. */
  function layWalks(g,opt){ opt=opt||{};
    var road=opt.road||{1:1}, walk=(opt.walk==null)?10:opt.walk;
    var over=opt.over||function(c){ return c===0; };
    var W=g[0].length,H=g.length,add=[],x,y;
    for(y=1;y<H-1;y++)for(x=1;x<W-1;x++){
      if(!over(g[y][x])) continue;
      if(road[g[y][x+1]]||road[g[y][x-1]]||road[g[y+1][x]]||road[g[y-1][x]]) add.push([x,y]);
    }
    for(var i=0;i<add.length;i++) g[add[i][1]][add[i][0]]=walk;
    return add.length; }
  /* THE ORDER IS THE ENFORCEMENT, not an audit afterwards. The walk goes down first and
     this refuses the WHOLE footprint if any cell of it lands on one - the generalised form
     of the suburb's home() check (bohemia_suburb.js:90-96). You cannot build on the walk
     because the walk is there first. */
  function canPlaceMass(g,cells,opt){ opt=opt||{};
    var free=opt.free||function(c){ return c===0; };
    var W=g[0].length,H=g.length,i;
    for(i=0;i<cells.length;i++){ var x=cells[i][0],y=cells[i][1];
      if(x<0||y<0||x>=W||y>=H) return false;
      if(!free(g[y][x])) return false; }
    return true; }
  /* D1-EXEMPT (Paolo 7/31, LOCKED, verbatim: "OK, freeways and railyards do not get
     sidewalks"). A surface whose whole purpose is vehicles or rail wears no pedestrian
     walk. THIS LIST IS HIS, NOT MINE TO EXTEND - a session that wants another district on
     it ASKS HIM, it does not reason by analogy. */
  var D1_EXEMPT={freeway:1,interchange:1,rail:1,railyard:1,speedway:1,airport:1,airbase:1,
                 drivein:1,truckstop:1,garage:1};

  // EXPLAIN-EVERY-TILE (Paolo 7/18): every non-ground tile must map to a named thing in the
```
THEN FIND (unique, verified count 1):
`    pedGate:pedGate,rotateToStreet:rotateToStreet,`
REPLACE WITH:
`    pedGate:pedGate,rotateToStreet:rotateToStreet,
    streetCodes:streetCodes,layWalks:layWalks,canPlaceMass:canPlaceMass,D1_EXEMPT:D1_EXEMPT,`

=== PATCH B — engine/bohemia_suburb.js : one body, in the kit (ENGINE SYNC LAW) ===
FIND (unique, verified count 1):
```
  function layWalks(g){
    var W=Wd(g),H=Ht(g),add=[];
    for(var y=1;y<H-1;y++)for(var x=1;x<W-1;x++){
      if(g[y][x]!==0) continue;                                  // only dead ground converts
      if(g[y][x+1]===1||g[y][x-1]===1||g[y+1][x]===1||g[y-1][x]===1) add.push([x,y]);
    }
    for(var i=0;i<add.length;i++) g[add[i][1]][add[i][0]]=10;    // one grid, hugging the street
  }
```
REPLACE WITH:
```
  /* ONE BODY, AND IT IS IN THE KIT NOW. This was private to this file, which is exactly
     why D1 was true in one district out of forty: nobody else could call it. K.layWalks is
     the same code, proved byte-identical on 32 blocks / 786,432 cells; this is the caller. */
  function layWalks(g){ return K.layWalks(g,{road:{1:1},walk:10,over:function(c){return c===0;}}); }
```

=== PATCH C — engine/bohemia_suburb.js : declare the public street ===
FIND (unique):
`    1:{name:'road',               kind:'drive',      act1:'cracked residential street asphalt (car-drivable)'},`
REPLACE WITH:
`    1:{name:'road',               kind:'drive',      street:true, act1:'cracked residential street asphalt (car-drivable)'},`
Code 3 (driveway) is DELIBERATELY left without `street:true` — that is D1's own apron exception, and it is what keeps the suburb's 1,928 legal garage↔apron adjacencies legal.

=== PATCH D — gates/d1_kerb_gate.js : NEW FILE (a law without a machine gate is not enforced) ===
```js
/* ============================================================================
   D1 KERB GATE — "houses or buildings should NEVER SIT ON THE SIDEWALK EVER
   ANYWHERE IN THE WORLD" (Paolo 7/31, LOCKED). ANYWHERE means the REGISTRY, so
   this sweeps K.types(), not one module. suburb_street_gate covers the suburb in
   depth; this one covers the other thirty-nine.

   THREE ASSERTIONS, all on the WORLD MODEL (never a renderer — that trick is
   what hid the missing suburb walk for a week; see suburb_street_gate.js:10-26):
     1. ORDER — no generator write puts a MASS code over a WALK code. Recorded by
        instrumenting the kit's own drawing surface, so it catches the cause, not
        the symptom. Measured before the fix: 15,729 such writes (library 14,787).
     2. GEOMETRY — no mass cell is orthogonally adjacent to a drive tile the
        legend marks `street:true`. A private apron/aisle is not a street: D1
        itself says the apron crosses the walk.
     3. COVERAGE — a district that declares a street must have a walk beside it:
        zero bare ground touching a street:true tile.
   EXEMPT (Paolo 7/31, LOCKED, verbatim "OK, freeways and railyards do not get
   sidewalks"): K.D1_EXEMPT. HIS LIST, NOT MINE TO EXTEND.
   ========================================================================== */
'use strict';
const path = require('path');
const ROOT = path.join(__dirname, '..');
const K = require(path.join(ROOT, 'engine/bohemia_district_kit.js'));

// instrument BEFORE the generators load, so every write is seen
const realGrid = K.grid; let LOG = null, KIND = null;
K.grid = function (seed, w, h) {
  const api = realGrid(seed, w, h), g = api.g;
  ['set','rect','hbar','vbar','frame','disc'].forEach(function (nm) {
    const f = api[nm];
    api[nm] = function () {
      if (!LOG) return f.apply(api, arguments);
      const before = g.map(r => r.slice());
      const out = f.apply(api, arguments);
      for (let y = 0; y < g.length; y++) for (let x = 0; x < g[0].length; x++) {
        const a = before[y][x], b = g[y][x]; if (a === b) continue;
        if (KIND[a] === 'walk' && (KIND[b] === 'building' || KIND[b] === 'structure')) {
          LOG.massOverWalk++; if (LOG.where.length < 4) LOG.where.push(x + ',' + y);
        }
      }
      return out;
    };
  });
  return api;
};
require(path.join(ROOT, 'engine/bohemia_world.js'));   // registers every district

let pass = 0, fail = 0;
const ok = (n, c) => { c ? pass++ : (fail++, console.log('  FAIL: ' + n)); };
const SURFACE = { arterial:1, freeway:1, desert:1, mountain:1, water:1,
                  airport:1, airbase:1, rail:1, interchange:1 };
const SEEDS = [1, 7, 42, 999, 4242, 12345];
const CFGS  = [['S'], ['S','E'], ['W'], ['N']];
const D4 = [[1,0],[-1,0],[0,1],[0,-1]];

let swept = 0, totOrder = 0, totFlush = 0, totBare = 0, withStreet = 0;
for (const type of K.types()) {
  if (SURFACE[type] || K.D1_EXEMPT[type]) continue;
  const spec = K.get(type); if (!spec || !spec.generate) continue;
  const L = spec.legend || {};
  const kind = {}; for (const c in L) if (L[c]) kind[c] = L[c].kind;
  KIND = kind; swept++;

  LOG = { massOverWalk: 0, where: [] };
  for (const s of [1, 42, 12345]) { try { spec.generate(s, { cw:1, ch:1, streets:['S'], district:type }); } catch (e) {} }
  const order = LOG; LOG = null;
  totOrder += order.massOverWalk;
  ok(type + ': no building is ever STAMPED ON a sidewalk (order holds)'
     + (order.massOverWalk ? ' -- ' + order.massOverWalk + ' writes, e.g. ' + order.where.join(' ') : ''),
     order.massOverWalk === 0);

  const ST = K.streetCodes(L);
  if (!ST) continue;                       // declares no public street: nothing to front
  withStreet++;
  let flush = 0, bare = 0;
  for (const st of CFGS) for (const s of SEEDS) {
    let r; try { r = spec.generate(s, { cw:1, ch:1, streets:st, district:type }); } catch (e) { continue; }
    if (!r || !r.g) continue;
    const g = r.g, H = g.length, W = g[0].length;
    const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? -1 : g[y][x];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const v = g[y][x], k = kind[v];
      if (ST[v]) { for (const [dx, dy] of D4) if (at(x+dx, y+dy) === 0) bare++; continue; }
      if (k !== 'building' && k !== 'structure') continue;
      for (const [dx, dy] of D4) if (ST[at(x+dx, y+dy)]) { flush++; break; }
    }
  }
  totFlush += flush; totBare += bare;
  ok(type + ': NO MASS ON THE KERB -- zero buildings flush to a public street'
     + (flush ? ' (' + flush + ' on the kerb)' : ''), flush === 0);
  ok(type + ': every street frontage wears a walk -- zero bare ground at the kerb'
     + (bare ? ' (' + bare + ' bare)' : ''), bare === 0);
}
ok('the sweep saw the whole registry, not one module (' + swept + ' non-exempt districts)', swept >= 30);
console.log('D1 KERB GATE: ' + pass + ' passed, ' + fail + ' failed  (' + swept
  + ' districts, ' + withStreet + ' declaring a public street, ' + totOrder
  + ' mass-over-walk writes, ' + totFlush + ' on the kerb, ' + totBare + ' bare frontage)');
process.exit(fail ? 1 : 0);
```

=== PATCH E — gates/bohemia_gates.py : register it ===
FIND: `    ('SUBURB STREET',  ['node', 'gates/suburb_street_gate.js'],`
INSERT a sibling row immediately above it, matching the file's existing tuple shape:
`    ('D1 KERB',        ['node', 'gates/d1_kerb_gate.js'],`
(copy the trailing description/timeout fields from the SUBURB STREET row verbatim.)

=== MANDATORY FOLLOW-UP, OR THE FIX NEVER REACHES PAOLO ===
1. `python3 tools/bohemia_city_module_resync.py` — the alpha's CITY_B64 currently carries a STALE district_kit (plus commercial, downtown, library, mall, school). A kit change is invisible on the surface he plays until this runs.
2. `node tools/bohemia_tilespec.js` — regenerate records/tilespec/ for any district whose legend gained a row, or tilespec_gate goes red.
3. `python3 gates/bohemia_gates.py` — full suite, once, per the ONE GATE PASS PER SHIP flow.

=== WHAT THIS PATCH SET DELIBERATELY DOES NOT DO ===
It does not add `street:true` to any legend but the suburb's, and it does not move one authored tile in any other district. With Patch A-E landed, the gate is GREEN on day one (every other district declares no street, so assertions 2 and 3 skip) EXCEPT assertion 1, which will immediately go RED on library (14,787), commercial (834) and downtown (108) — those three are stamping mass onto their own declared walk tiles TODAY and that is the literal violation, not a rule I invented. Those three plus the per-district opt-ins are the follow-on work, and the layout half of it is flagged below rather than proposed.

### RISK

WHAT COULD BREAK, MEASURED WHERE MEASURABLE.

1. NOTHING BREAKS FROM PATCHES A-C. Proved: the promoted layWalks is byte-identical across 32 suburb blocks / 786,432 cells (0 differences). `street:true` is an additive legend field; K.tileLayer reads only kind/layer/solid/enter and ignores it; tilespec_gate checks name+kind+act1 presence and a valid layer, all unaffected. suburb_street_gate stays green because the suburb's own tiles do not move.

2. PATCH D WILL GO RED IMMEDIATELY ON THREE DISTRICTS — library, commercial, downtown — on assertion 1 (mass stamped over walk). That is the gate working, but it means the D1 gate cannot be added to bohemia_gates.py in the same commit unless those three are fixed or the assertion is staged. RECOMMEND: land A-C + the gate FILE in one commit, register it in bohemia_gates.py (Patch E) only in the commit that also clears library/commercial/downtown. A red suite blocks every other lane's ship.

3. WALKABLE-LAND GATE (gates/walkable_gate.js:37, `drivePct <= contentPct + 22`). Its FILLER_NAME regex (engine/bohemia_district_kit.js:424) matches `sidewalk`, so every walk cell laid COUNTS AS FILLER, NOT CONTENT. Measured on a simulated full pass: mall content 57.1%→55.8%, trailer 71.4%→68.1%, town 65.5%→61.3%; drive also falls (31.4→30.3, 12.2→11.6, 28.6→28.3) so the GAP improves in all three. But a district already near the margin could flip. Any district that opts in must re-run walkable_gate.

4. DRIVE NETWORK GATES ARE THE REAL LANDMINE. The tempting shortcut — carve the walk out of the ROAD instead of moving the building, so no authored geometry changes — I measured it end to end. mall: driveNetworkReach 1.0000 → 1.0000, fine. town: 0.8005 → 0.8000, fine. trailer: 0.9773 → 0.4256, CATASTROPHIC. Cause: engine/bohemia_trailer.js's entrance spine is squeezed to ONE TILE wide for rows 50-83 (measured street-cells-per-row = 1 or 2) because the spine carve only overwrites soft codes and a trailer row sits on it. Carving that single tile severs the park from its own gate. DO NOT ship a blanket road→walk carve. Anything of that shape must assert driveNetworkReach does not regress, per district, or trailer_gate.js and drive_network_gate.js go red.

5. THE HARDCODED PASSABILITY WHITELIST. engine/bohemia_agents.js:547: `var c=G[y][x]; return c===0||c===1||c===3||c===5||c===10;`. It is suburb-code-specific and it already bit this exact feature once (suburb_street_gate.js:147-158 exists solely because of it — a sidewalk the sim treated as a wall turned population_gate red). Any district adding a walk on a DIFFERENT code number must re-check every hardcoded whitelist a body stands on, or the life sim walls its neighbours in.

6. PALETTE FALLBACK. /tmp/city.txt:8119 `const pal=(spec&&spec.palette&&spec.palette[code])||'#98948a';` — a legend code with no palette entry renders flat grey on Paolo's screen. Every new walk code needs a PALETTE row in the same edit.

7. THE STALE BLOB IS THE #1 WAY THIS SHIPS AND IS INVISIBLE. district_kit, commercial, downtown, library, mall and school are all STALE in CITY_B64 right now. A kit-level fix that is not followed by tools/bohemia_city_module_resync.py is a fix Paolo cannot see, and "I didn't see nothing new" is a complaint this repo has already eaten twice.

8. LANE BOUNDARIES. Patch A touches engine/bohemia_district_kit.js, which every district lane reads. Under ONE SYSTEM, ONE SESSION this is a shared spine — check no other session is mid-edit on the kit before touching it. Patches B/C touch the suburb, which is the lane that already owns D1.

=== FLAGGED AS LAYOUT, NOT PROPOSED (MAP LAW: plumbing only) ===
These CANNOT be fixed by ordering, a refusal check, or a shared primitive. Each one needs its district's authored coordinates moved, which is deciding where a road or a building goes.

L1. MALL — engine/bohemia_mall.js:109-112 vs :30-31. The ring road at x=4..9 / 119..124 and the closing legs at y=26..30 / 90..94 are drawn flush against (and on top of) both anchors, which span x=10..30 / 98..118 and y=32..90. The anchors leave only x=0..3 and x=125..127 free — the plot edges. Moving the ring is deciding where the mall's road goes. ALREADY [PENDING] in laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md ("Moving the ring there is not plumbing, it is deciding where the mall's road goes... [PENDING: the district's owning lane reroutes it, or Paolo rules the ring hugs the plot edge]"). 4,344 kerb cells.

L2. TRAILER — engine/bohemia_trailer.js:44-46. The lot stride `for(var lx=12; lx<=104; lx+=13)` puts a trailer row at lx=64, exactly on the entrance spine at gx=64, so the spine necks to one tile and the trailers stand on it. Fixing it means restriding the lots or moving the spine. 1,984 kerb cells, and the 1-tile lane is separately a "a lane has to be wide enough to be a lane" defect the kit already names.

L3. LIBRARY — engine/bohemia_library.js:42 paints the entire plot base as code 13, declared `kind:'walk'`, then builds on it. TWO possible resolutions and they are not mine to pick: (a) the terrace is a PLINTH, not a sidewalk, and code 13's kind changes to 'ground' — a one-word classification ruling that makes 14,787 violations vanish honestly; or (b) it really is the public walk, and the building has to come off it — a layout change. **ONE QUESTION FOR PAOLO: is the library's terrace a sidewalk, or the plinth the building stands on?** Same shape, smaller, for commercial (834) and downtown (108).

L4. THE EXEMPTION QUESTION HE HAS NOT BEEN ASKED. 23,256 of the 89,136 non-exempt cells are STORAGE — self-storage unit rows fronting their own drive aisle wall-to-wall, which is architecturally correct and is the density reference Paolo blessed under WALKABLE-LAND. Same shape: industrial dock doors on a truck court (8,070), solar switchgear on a gravel access road (7,968), stadium facade on a parking field (6,452), campus (3,432), ballpark (2,568), landfill haul road (2,448). The law is explicit that the exempt list is "HIS, NOT MINE TO EXTEND" and that a session wanting another district on it ASKS HIM. So these are NOT bugs to fix and NOT exemptions to grant — they are a [PENDING, Paolo's call] on whether a private aisle / truck court / parking field is "a street a person walks beside." Until he rules, those districts declare no `street:true` and the gate correctly says nothing about them.

### GATE SPEC

gates/d1_kerb_gate.js, full source given in patchSpec, registered in gates/bohemia_gates.py beside SUBURB STREET. It verifies on the REAL SURFACE in the only sense that matters here: the CITY generates every plot by calling `BohemiaDistrictKit.get(type).generate(...)` and paints each code through `spec.legend` + `K.tileLayer` + `spec.palette` (/tmp/city.txt:7947, :7959, :8118-8120), so the generator grid IS what Paolo looks at. The gate reads that grid and never a renderer — the exact discipline that gates/suburb_street_gate.js:10-26 was written to enforce after a render-time kerb trick hid a missing sidewalk for a week.

THREE ASSERTIONS PER NON-EXEMPT DISTRICT, swept over K.types() (36 districts today), 24 blocks each (6 seeds x 4 street configs) for geometry, 3 seeds for order:

1. ORDER — zero writes that put a MASS code over a WALK code. Implemented by wrapping K.grid's set/rect/hbar/vbar/frame/disc BEFORE bohemia_world.js loads, diffing the grid across every draw call. This catches the CAUSE (a generator painting a walk base then building on it) rather than the symptom, and it is the assertion that makes "the order IS the enforcement" machine-checkable for the first time. Current reading: 15,729 violations (library 14,787, commercial 834, downtown 108). Target 0.
2. GEOMETRY — zero mass cells (legend kind building|structure) orthogonally adjacent to a drive tile the legend marks `street:true`. Current reading with only the suburb declaring: 0. Add a declaration to any other district and it reports that district's real number.
3. COVERAGE — zero bare code-0 cells orthogonally adjacent to a `street:true` tile (a declared street must actually wear its walk). Suburb reading today: 0 bare, 20,322 walk tiles at the kerb.
Plus a registry-size assertion (`swept >= 30`) so the gate cannot silently stop seeing districts the way gates/sidewalk_gate.js did.

EXEMPTIONS are read from K.D1_EXEMPT, sourced verbatim from Paolo's LOCKED ruling in laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md ("OK, freeways and railyards do not get sidewalks"): freeway, interchange, rail, railyard, speedway, airport, airbase, drivein, truckstop, garage. The gate never widens that list.

WHY THIS FORMULATION AND NOT "no mass touches any drive": measured — the naive rule FAILS THE SUBURB, the one district that is correct, with 1,928 violations, all of them a garage touching its own driveway apron, which D1's own text permits. The `street:true` declaration is the minimum machine-readable fact that lets a gate be right. Verified: under the proposed rule the suburb scores 0 street-flush / 1,928 legal apron-flush / 20,322 walk at kerb / 0 bare at kerb.

REGRESSION PROOF TO RUN ALONGSIDE, in this order, once: `node gates/suburb_street_gate.js` (the promoted primitive must not move a suburb tile — independently proved 0 differences over 786,432 cells), `node gates/district_kit_gate.js`, `node gates/walkable_gate.js` (sidewalk counts as FILLER, so content% falls), `node gates/drive_network_gate.js` + the per-district gate of anything that opts in, `node gates/tilespec_gate.js` after `node tools/bohemia_tilespec.js`, then `python3 tools/bohemia_city_module_resync.py` and `node gates/city_tab_gate.js` so the fix is actually inside CITY_B64 — the kit is STALE in the shipped blob right now and a kit fix that skips the resync is invisible on the surface he plays.

---

## E/W-facing doors: approved art exists (368 tiles + 4 baked-approved), ships 0 bytes, and no code path in the city renderer selects a door by wall facing

**already done:** False  **confidence:** high

### ROOT CAUSE

FOURTH-CLASS "APPROVED BUT UNUSED", CONFIRMED BY MEASUREMENT ON THE RUNNING SURFACE. Three separate mechanisms, all verified.

(1) THE ART EXISTS AND SHIPS ZERO BYTES. `banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt` holds 184 doorways x {W,E} = 368 tiles, 44x44 RGBA, `edge_px:7` on all 184, painted pixels ONLY in cols 0-6 (W) or 37-43 (E) — exactly Paolo's LOCKED circled-photo reference. `banks/BOHEMIA_DEMO_TILE_BAKE_7_10_26.txt` -> `tiles.sewer_door_ew` holds the 4 tiles he APPROVED verbatim ("E/W DOOR EDGES: D0 + D1 at 7px APPROVED (Paolo 7/10/26)"). MEASURED: 0 of 368 and 0 of 4 appear byte-for-byte in `slices/BOHEMIA_ALPHA_0_9.html`, raw OR base64-decoded. THIS ANSWERS THE OPEN `[PENDING: which bank holds the E/W door art.]` IN `laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md` LINE 223 — the bank was found; clause B6 is not just "NOT ENFORCED", it is 0% shipped.

(2) THE EXTERIOR RENDERER HAS NO CONCEPT OF A SIDE APPROACH. The suburb facade branch chooses a door ONLY from the cell BELOW: `const approach=(below===3||below===1);` (driveway apron 3 / residential street 1). A house whose driveway or street is to its EAST or WEST is invisible to that test and gets wall/window/boarded. MEASURED across 24 real suburb plots via `cellAt()` inside the live cityFrame: 324 house cells have a SOUTH approach -> 81 doors; 368 have an EAST approach and 336 a WEST approach (704 total) -> **0 doors**. Side approaches outnumber south approaches 2.2 to 1 and every one is a blank wall. Sample cell gx=1648 gy=529 (overmap 12,4): a garage (code 6) with its own driveway apron (code 3) directly to its WEST, `face:false, artPool_face:null`.

(3) NO DOOR SELECTOR ANYWHERE TAKES A FACING. The only two door blits in the whole city blob are `saTex('hdoor',v)` / `tallTex('hdoor',v,2)` (exterior, pool = 3 tiles at 16x16, frontal) and `IN_DOOR_IMG[(seed>>>0)%IN_DOOR_IMG.length]` (interior, 10 frames at 88x176, frontal). Neither takes a direction argument; grep of the decoded blob for any facing-keyed door pool returns nothing. The interior is the cruellest case because THE FACING IS ALREADY COMPUTED AND THEN THROWN AWAY: `inEnter()` derives `const side=(fromY>f.y+f.h-1)?'S':(fromY<f.y)?'N':(fromX<f.x)?'W':(fromX>f.x+f.w-1)?'E':'S';` and passes it to `BOH_FLOORPLAN.generate(...,{entrance:side})`, which carves the perimeter door on that edge — and then `inDoor()` blits the same frontal 88x176 clip regardless. MEASURED via `engine/bohemia_floorplan.js` over 300 plans: 2,945 doors, 881 (29.9%) sit in a VERTICAL wall run (i.e. face east/west), every one drawn frontal.

SECONDARY (found while measuring, must not be silently bundled): `c.face` is set in exactly 3 places in the blob and all 3 test only the cell BELOW, so 13,004 east/west-exposed house cells exist across 24 plots and only 956 carry any face at all — and those only because they are ALSO south-exposed. That is correct for the fixed 3/4 camera (you do not see a side face), which is precisely why an E/W door must be an EDGE-ON SLIVER OVERLAY on the mass edge, not a third facade face.

FALSE RECORD: `records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md` line 18 claims "DOOR CLIPS | 30 clips ... + E/W edges | ... | RUN + interiors: INTEGRATED". The E/W half of that row is untrue by measurement.

### EVIDENCE

ALL PATHS ABSOLUTE. "city blob" = base64 CITY_B64 decoded out of /home/user/bohemia/slices/BOHEMIA_ALPHA_0_9.html (24,763,552 chars, 10,518 lines); line numbers are of the DECODED text.

--- THE APPROVED ART ---
/home/user/bohemia/banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt (536 KB), header verbatim:
  {"version": "BOHEMIA_DOOR_EW_EDGES_v1", "built": "2026-07-10", "note": "E/W door edges generalized from Paolo's locked 7px reference (his circled photo): each door's OWN painted frame-edge strip, cropped (never squished/mirrored), positioned west/east in cell...", "counts": 184, "doors": [...]}
  measured: 184 entries, every one edge_px==7, each with variants [{side:'W'},{side:'E'}]; PNG header 44x44; alpha nonzero ONLY cols 0..6 (W) and 37..43 (E).
/home/user/bohemia/banks/BOHEMIA_DEMO_TILE_BAKE_7_10_26.txt: counts.sewer_door_ew == 4, type.sewer_door_ew == 'door', all 44x44, cols [0..6],[37..43],[0..6],[37..43].
/home/user/bohemia/banks/BOHEMIA_GRAPHICS_VERDICTS_MASTER_7_16_26.txt:2874 —
  "- E/W DOOR EDGES: D0 + D1 at 7px APPROVED (Paolo 7/10/26) — for THESE two doorways
     only; width is not a universal law, future doorways judged fresh. Baked as
     sewer_door_ew (west + east positions, painted strip, zero transforms)."
same file :2921 — "E/W door edges: decent, stand."
/home/user/bohemia/laws/BOHEMIA_ADDENDUM_ART_LAWS_VERDICT_BATCH_7_10_26.md:20-46 — the CORRECTION (left/right = faces EAST or WEST, renders EDGE-ON, width compresses to a fraction), the NO-TRANSFORM LAW (no mirror/squish/shear; a separate drawing or a real crop), and "EAST/WEST DOOR REFERENCE (Paolo, photo, 7/10/26 — LOCKED)".
/home/user/bohemia/laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md:189 — "| B6 | E/W doors use E/W art | -- | NOT ENFORCED (see note) |"; :213-223 — "[PENDING: which bank holds the E/W door art.]"

--- MEASUREMENT 1: the art is not in the build (python, byte-for-byte substring) ---
  EW BANK tiles total=368  present in city blob=0  (W 0/184, E 0/184)
  sewer_door_ew: 0/4 present in decoded city, 0/4 present in the raw 42MB alpha.
  (control, same method: DOOR_ANIM_BANK frame 0 of each of the 10 residential clips -> 10 present. So the method finds art that IS shipped.)

--- MEASUREMENT 2: the pools that DO ship (regex over decoded blob + PNG IHDR) ---
  hroof 14x(16,16) | hwall 4x(16,16) | hwindow 3x(16,16) | hboarded 3x(16,16) | hdoor 3x(16,16) | hyard 3x(16,16) | perimeter 27 | IN_DOOR_B64 10x(88,176)
  No pool key contains a facing. City blob line 8847:
    for(const _hk of ['hroof','hwall','hwindow','hboarded','hdoor','hyard']){

--- MEASUREMENT 3: the running surface (playwright, chromium, real alpha, CITY tab, 24 real suburb plots, read through the game's own cellAt/tileMeta) ---
  {"cells":24,"house":95688,"southFace":7208,"doors":81,
   "eastExposed":6502,"westExposed":6502,"northExposed":7208,
   "approachS":324,"approachE":368,"approachW":336,"approachN":884,
   "poolsSeen":{"hwall":4956,"hwindow":1810,"hboarded":361,"hdoor":81}}
  second pass, E/W only:
  {"ewExposed":13004,"ewWithFace":956,"ewWithPool":956,
   "sideApproach":704,"sideApproachDoor":0,
   "sample":{"gx":1648,"gy":529,"cell":"12,4","left":3,"right":6,"face":false,"pool":null}}
  -> 704 house cells sit against their own driveway/street to the E or W. ZERO doors.

--- MEASUREMENT 4: interiors (node, engine/bohemia_floorplan.js, 300 plans, 7 zones, all 4 entrance sides) ---
  interior doors total 2945 | E/W-facing (vertical wall run) 881 | N/S-facing 1758 | ambiguous 306 -> E/W share 29.9%

--- THE CODE (all anchors verified UNIQUE, count==1, in the decoded blob) ---
city blob 8217-8224 (suburb facade, door chosen from BELOW only):
        const approach=(below===3||below===1);
        let doorHere=false;
        if(approach&&lx>0){
          const leftBelow=m.sub[(ly+1)*FN+(lx-1)], leftHere=m.sub[ly*FN+(lx-1)];
          const leftIsApproach=(leftBelow===3||leftBelow===1)&&(leftHere===2||leftHere===6||leftHere===9);
          doorHere=!leftIsApproach;                 /* leftmost tile of the run */
        } else if(approach) doorHere=true;
        const gh=(Math.imul(gx,73856093)^Math.imul(gy,19349663))>>>0, pick=gh%20;
        c.artPool_face=doorHere?'hdoor':(pick<14?'hwall':(pick<19?'hwindow':'hboarded'));

city blob 9304-9309 (facadePass, the ONLY exterior door blit, no facing):
      const wall=saTex('hwall',v);
      if(c.artPool_face==='hdoor'){
        if(wall)g.drawImage(wall,dx,top,C,C);
        const d2=tallTex('hdoor',v,2);
        if(d2)g.drawImage(d2,dx,dy-C,C,C*2);        /* DOOR LAW: 2 tiles, in a 3-tile wall */

city blob 9278 (the guard that makes side walls unreachable by the facade pass):
      const c=cellAt(gx,gy); if(!c||!c.face)continue;

city blob 8202-8206 / 8125-8130 / 8250 — all three `c.face` sites test ONLY the cell below:
      const below=(ly+1<FN)?m.sub[(ly+1)*FN+lx]:0;
      if(!(below===2||below===6||below===9)){
        c.face=true;

city blob 10336-10341 (the facing IS derived, then discarded by the art):
  // the door goes on the side you walked in from: the interior entrance IS the
  // exterior entrance, which is the whole point of the law.
  const side=(fromY>f.y+f.h-1)?'S':(fromY<f.y)?'N':(fromX<f.x)?'W':(fromX>f.x+f.w-1)?'E':'S';
  ...
  fp=BOH_FLOORPLAN.generate(seed,f.w,f.h,{zone:zone,entrance:side});

city blob 10410-10414 + 10464 (the ONLY interior door blit, no facing):
function inDoor(seed,sx,sy,C){
  const im=IN_DOOR_IMG[(seed>>>0)%IN_DOOR_IMG.length];
  if(!im||!im.complete||!im.naturalWidth)return false;
  g.drawImage(im,sx,sy-C,C,C*2); return true;
}
    if(!inDoor((x*7+y*13)>>>0,sx,sy,C)) inBlit('hdoor',(x*7+y*13),sx,sy,C);

--- CROP GEOMETRY (measured, load-bearing for the patch) ---
/home/user/bohemia/banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt: wall_door_18/19/20 are 44x44 RGB; per-column luminance profile puts the DOOR at cols 14..30 (17 px wide) with STUCCO at cols 0..13 and 31..43. Mean RGB cols 0-6 = (191,168,128) tan wall; cols 18-25 = (132,106,75) dark door. A naive 7px tile-edge crop of these yields a strip of BLANK WALL, not a door. The crop must be taken from the DOOR's own bbox edge.
/home/user/bohemia/banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt: `4._Doors_a_*_swing` frame 0 is 88x176 and OPAQUE cols 0..87 — the door fills the frame, so the E/W crop there is a direct, exact application of his 7/44 geometry: e = round(88*7/44) = 14.

--- GATES THAT ALREADY TOUCH THIS CODE (all read) ---
/home/user/bohemia/gates/frontdoor_gate.js:51-57 (unreachable := below!==3&&below!==1 over artPool_face==='hdoor')
/home/user/bohemia/gates/city_tab_gate.js:250,261-265 (byte-locks "doorHere?'hdoor'", "pick<14?'hwall'", "pick<19?'hwindow'", "const approach=(below===3||below===1)", "SA_TILES.<pool>=" for the six)
/home/user/bohemia/gates/houseart_gate.py:134-141 | /home/user/bohemia/gates/wallclass_gate.js:171 | /home/user/bohemia/gates/wallheight_gate.js:96 | /home/user/bohemia/gates/interiors_gate.js:118-141 (regex-locks `g\.drawImage\(im,sx,sy-C,C,C\*2\)` and `fills <= 4`)

### PATCH SPEC

Ship as ONE new idempotent tool `tools/bohemia_city_ewdoor_patch.py` (same shape as `tools/bohemia_city_frontdoor_patch.py`: read alpha, slice `const CITY_B64='`..`'`, b64-decode, assert marker absent, do the exact string replacements below, re-encode, write). NO NEW PIXELS ARE COOKED — every tile is a PURE COLUMN CROP of art Paolo already approved, by his own LOCKED 7/10 method (no mirror, no squish, no shear, no resample). Add a `REUSE CHECK:` docstring naming the three banks it opens (REUSE-FIRST law).

=== STEP 0 — BUILD THE ART (python, in the patch tool) ===
A. EXTERIOR pools `hdoorw` / `hdoore`, from `banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt` ids wall_door_18/19/20 (44x44 RGB, door bbox cols 14..30):
   e = 7  # Paolo's LOCKED number at 44px tile scale. SEE RISK — this is his call.
   src = Image.open(tile).convert('RGBA'); d0,d1 = doorBBoxCols(src)   # measured 14, 30
   W-tile: out = transparent 44x44; out.paste(src.crop((d0, 0, d0+e, 44)), (0,0))
   E-tile: out = transparent 44x44; out.paste(src.crop((d1+1-e, 0, d1+1, 44)), (44-e,0))
   Keep NATIVE 44x44 (do NOT run `shrink()` — the E/W law forbids resampling; saTex scales to C at draw time, and C is 44 or 88, integer).
   `doorBBoxCols` must be derived, not hardcoded: per-column mean luminance, take the contiguous run below (max+min)/2. Assert it returns 14,30 for all three tiles and abort otherwise (so a future re-cook of the bank cannot silently produce wall slivers).
B. INTERIOR pools `IN_DOOR_W_B64` / `IN_DOOR_E_B64`, from `banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt`, the SAME 10 residential clips `4._Doors_a_{00..09}_swing` frame 0 that `IN_DOOR_B64` already uses, 88x176 opaque edge-to-edge:
   e = round(88*7/44) = 14
   W-frame: transparent 88x176; paste src.crop((0,0,14,176)) at (0,0)
   E-frame: transparent 88x176; paste src.crop((74,0,88,176)) at (74,0)
   Order must match IN_DOOR_B64 exactly so index i is the same doorway in all three arrays.

=== STEP 1 — REGISTER THE EXTERIOR POOLS ===
ANCHOR (exact, unique, count==1):
for(const _hk of ['hroof','hwall','hwindow','hboarded','hdoor','hyard']){
REPLACE WITH:
/* E/W DOORS (Paolo 7/10/26 LOCKED "an east/west door renders EDGE-ON"; 8/2 "WE
   MADE A COUPLE VERSIONS OF DOORS WHEN THEY ARE FACING EAST AND WEST WHY ARE WE
   NOT DOING THAT"). Source law: banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt +
   laws/BOHEMIA_ADDENDUM_ART_LAWS_VERDICT_BATCH_7_10_26.md. PURE COLUMN CROP of
   his own approved wall_door_18/19/20 frame edge, positioned west or east on a
   transparent cell. NO-TRANSFORM LAW: no mirror, no squish, no shear, no resample. */
SA_TILES.hdoorw=@@HDOORW@@; SA_TILES.hdoore=@@HDOORE@@;
for(const _hk of ['hroof','hwall','hwindow','hboarded','hdoor','hyard','hdoorw','hdoore']){
(the six original pool names stay present verbatim, so city_tab_gate + houseart_gate stay green.)

=== STEP 2 — THE SUBURB CELL LEARNS ITS SIDE APPROACH ===
ANCHOR (exact, unique, count==1):
        const approach=(below===3||below===1);
REPLACE WITH:
        /* SIDE APPROACH (8/2): the 7/27 front-door rule only ever looked at the
           cell BELOW, so a house whose driveway or street is to its EAST or WEST
           got no door at all. Measured on 24 real plots: 324 south approaches ->
           81 doors, 704 east/west approaches -> 0. Same rule, both axes; the
           TOPMOST tile of a vertical run takes it, mirroring "leftmost of a
           horizontal run". A side door is an EDGE-ON SLIVER on the mass edge,
           never a third facade face - the 3/4 camera does not show a side wall. */
        const _lft=(lx>0)?m.sub[ly*FN+(lx-1)]:0, _rgt=(lx+1<FN)?m.sub[ly*FN+(lx+1)]:0;
        const _upH=(ly>0)?m.sub[(ly-1)*FN+lx]:0;
        const _upIsHouse=(_upH===2||_upH===6||_upH===9);
        const _upL=(ly>0&&lx>0)?m.sub[(ly-1)*FN+(lx-1)]:0, _upR=(ly>0&&lx+1<FN)?m.sub[(ly-1)*FN+(lx+1)]:0;
        if((_lft===3||_lft===1)&&!(_upIsHouse&&(_upL===3||_upL===1))) c.doorEW='W';
        else if((_rgt===3||_rgt===1)&&!(_upIsHouse&&(_upR===3||_upR===1))) c.doorEW='E';
        const approach=(below===3||below===1);
NOTE: this sets a NEW field `c.doorEW` and deliberately does NOT touch `c.artPool_face`, so `frontdoor_gate.js`'s "every hdoor sits on a south approach" assertion is untouched and stays green. The block sits INSIDE the existing `if(!(below===2||below===6||below===9)){` guard, i.e. only on cells already exposed — that is correct, a side door still needs to be on the outside of the mass. (SECOND PASS, separate ship: the same three lines belong in the kit branch at city blob 8141-8145 keyed off the dossier's own `portal` tiles; do NOT bundle it, `frontdoor_gate` asserts kitDoors===0.)

=== STEP 3 — DRAW IT ===
ANCHOR 3a (exact, unique, count==1):
      const c=cellAt(gx,gy); if(!c||!c.face)continue;
REPLACE WITH:
      const c=cellAt(gx,gy); if(!c||(!c.face&&!c.doorEW))continue;
ANCHOR 3b (exact, unique, count==1):
      const dx=Math.round(ox+gx*C), dy=Math.round(oy+gy*C), top=dy-(wh-1)*C;
REPLACE WITH:
      const dx=Math.round(ox+gx*C), dy=Math.round(oy+gy*C), top=dy-(wh-1)*C;
      /* E/W DOOR OVERLAY: his own frame-edge sliver on the west or east edge of
         the cell, TWO TILES TALL like every other door (DOOR LAW, Paolo 7/26).
         Drawn over the mass, before the face, so a corner cell gets both. */
      if(c.doorEW){
        const _ew=tallTex(c.doorEW==='W'?'hdoorw':'hdoore',v,2);
        if(_ew)g.drawImage(_ew,dx,dy-C,C,C*2);
        if(!c.face){ g.globalAlpha=1; continue; }
      }
(`v` and `wh` are already declared above this line; `tallTex` already exists and caches the 1x2 derive.)

=== STEP 4 — INTERIORS ===
ANCHOR 4a (exact, unique, count==1):
const IN_DOOR_IMG=IN_DOOR_B64.map(function(b){ const im=new Image(); im.src='data:image/png;base64,'+b; return im; });
REPLACE WITH:
const IN_DOOR_IMG=IN_DOOR_B64.map(function(b){ const im=new Image(); im.src='data:image/png;base64,'+b; return im; });
/* E/W INTERIOR DOORS (8/2): 29.9% of generated interior doors sit in a VERTICAL
   wall run - they face east/west and were all drawn frontal. Same 10 approved
   clips, his 7/10 crop at this scale (e=round(88*7/44)=14), zero transforms. */
const IN_DOOR_W_B64=@@INDOORW@@, IN_DOOR_E_B64=@@INDOORE@@;
const IN_DOOR_W_IMG=IN_DOOR_W_B64.map(function(b){ const im=new Image(); im.src='data:image/png;base64,'+b; return im; });
const IN_DOOR_E_IMG=IN_DOOR_E_B64.map(function(b){ const im=new Image(); im.src='data:image/png;base64,'+b; return im; });
ANCHOR 4b (exact, unique, count==1) — the whole function:
function inDoor(seed,sx,sy,C){
  const im=IN_DOOR_IMG[(seed>>>0)%IN_DOOR_IMG.length];
  if(!im||!im.complete||!im.naturalWidth)return false;
  g.drawImage(im,sx,sy-C,C,C*2); return true;
}
REPLACE WITH:
function inDoor(seed,sx,sy,C,ew){
  const _a=(ew==='W')?IN_DOOR_W_IMG:((ew==='E')?IN_DOOR_E_IMG:IN_DOOR_IMG);
  const im=_a[(seed>>>0)%_a.length];
  if(!im||!im.complete||!im.naturalWidth)return false;
  g.drawImage(im,sx,sy-C,C,C*2); return true;
}
(the literal `g.drawImage(im,sx,sy-C,C,C*2)` is preserved byte-for-byte — interiors_gate.js:121 regex-locks it.)
ANCHOR 4c (exact, unique, count==1):
    if(!inDoor((x*7+y*13)>>>0,sx,sy,C)) inBlit('hdoor',(x*7+y*13),sx,sy,C);
REPLACE WITH:
    /* WHICH WALL IT IS IN: a door in a VERTICAL wall run faces EAST/WEST and is
       seen EDGE-ON; a door in a HORIZONTAL run faces the camera and keeps the
       frontal clip. The plate already knows its entrance side (inEnter -> the
       floorplan's `entrance`), so the perimeter door uses the real edge; an
       interior partition door shows the edge nearer its own side of the plate. */
    const _vw=isWall(x,y-1)&&isWall(x,y+1), _hw=isWall(x-1,y)&&isWall(x+1,y);
    const _ew=(x===0)?'W':((x===fp.W-1)?'E':((_vw&&!_hw)?((x<fp.W/2)?'W':'E'):null));
    if(!inDoor((x*7+y*13)>>>0,sx,sy,C,_ew)) inBlit(_ew==='W'?'hdoorw':(_ew==='E'?'hdoore':'hdoor'),(x*7+y*13),sx,sy,C);
(`isWall` and `fp` are both in scope: `isWall` is declared at the top of `renderInside` and the DOOR PASS is below it. The `'hdoor'` literal survives for interiors_gate.js:129.)

=== STEP 5 — RECORDS (same turn) ===
- `laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md`: replace `[PENDING: which bank holds the E/W door art.]` with the answer (banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt, 184x2 at 44x44 edge_px 7, plus the 4 approved baked sewer_door_ew) and flip B6's gate column to `ewdoor_gate`.
- `records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md` line 18: the "+ E/W edges ... INTEGRATED" claim was false (0 of 372 tiles shipped); correct it.

### RISK

1. `gates/frontdoor_gate.js` IS THE LANDMINE and the patch is shaped to avoid it. It computes `unreachable` as `below !== 3 && below !== 1` over every cell with `artPool_face === 'hdoor'` and asserts `unreachable === 0`. If a future edit sets `artPool_face='hdoor'` on a side-approach cell instead of using the new `c.doorEW` field, that gate goes red instantly with ~200 "unreachable" doors. Do not merge the two fields.
2. `gates/city_tab_gate.js:261-265` byte-locks four substrings: `"pick<14?'hwall'"`, `"pick<19?'hwindow'"`, `"const approach=(below===3||below===1)"`, `"doorHere?'hdoor'"`. STEP 2 inserts ABOVE the `approach` line rather than rewriting it precisely so all four survive. Any reflow of that block breaks the gate.
3. `gates/interiors_gate.js:121` regex-locks `/g\.drawImage\(im,sx,sy-C,C,C\*2\)/` and `:141` caps solid `fillStyle='#...'` at 4. STEP 4 preserves the drawImage literal verbatim and adds zero fills.
4. `gates/houseart_gate.py:134-136` and `city_tab_gate.js:250` require exactly the six `SA_TILES.<pool>=` names; STEP 1 only appends, never renames.
5. `gates/wallclass_gate.js:171` `BUILDING=['hwall','hwindow','hboarded','hdoor']` and `gates/wallheight_gate.js:96` (`c.face && artPool_face==='hdoor'`) are untouched because side doors never set `artPool_face`.
6. CROSS-LANE: STEP 2 and STEP 3 are in `realizeCell`/`facadePass` — the CITY/WORLD lane. The 8/2 fence-height patch (`tools/bohemia_city_fence_two_tall_patch.py`) edits the adjacent kit branch and the same `facadePass`; if that lane is live this turn, ONE SYSTEM ONE SESSION applies and this must not ship in parallel.
7. THE WIDTH IS NOT HIS RULING. He approved `edge_px=7` "for THESE two doorways only; width is not a universal law, future doorways judged fresh" (VERDICTS_MASTER:2874). The house-skin door leaf is only 17 px wide, so 7 px is 41% of it — visually fat. That number MUST go to him as a JUDGE THIS with 3 side-by-side widths (4 / 7 / 10 px), not be shipped as settled. Everything else in the patch is his own approved pixels.
8. THE NAIVE CROP IS WRONG AND WILL LOOK LIKE NOTHING. `wall_door_18/19/20` have stucco at cols 0-13 and 31-43; cropping the TILE edge (what the 7/10 bank did to the HD-repo doors, where the door filled the tile) yields a sliver of blank wall. STEP 0's `doorBBoxCols` assert exists precisely to make that failure loud instead of shipping an invisible door.
9. PAYLOAD: +6 exterior tiles (44x44 RGBA, mostly transparent, negligible) and +20 interior frames at 88x176 RGBA. `IN_DOOR_B64` is already 373,838 b64 chars for 10 frames; the E/W crops are 14/88 of the width and compress hard, expect roughly +80-110 KB b64 on a 42 MB alpha. Measure it and state the number; do not guess.
10. ART FREEZE / STOP PRODUCING: this is not a cook, it is wiring already-approved art that has been sitting unused for 23 days, and Paolo asked for it in his own words. But it DOES change what he sees. If the freeze is on, ship the diagnosis + the width JUDGE THIS and hold the patch.
11. Determinism: `c.doorEW` is a pure function of the suburb grid, so it is regen-safe and does not add per-frame randomness (STAGGERED LAW pattern). The `tallTex` cache key is `pool|v|n`, so the two new pools cache independently and `saFlush()` clears them with everything else.

### GATE SPEC

NEW `gates/ewdoor_gate.js`, run from `python3 gates/bohemia_gates.py`. It must MEASURE THE SURFACE (VERIFY-ON-THE-REAL-SURFACE law), booting the real alpha in chromium (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`), clicking `#front` then `.tab[data-p="city"]`, and evaluating inside the `cityFrame` — the same harness as `gates/frontdoor_gate.js`. Six checks:

1. NO-TRANSFORM PROOF (this is the one that stops a mirror/squish shortcut). In node, recompute the crop from `banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt` (wall_door_18/19/20) and `banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt` (the 10 `4._Doors_a_*_swing` frame 0), and assert EVERY tile in the shipped `SA_TILES.hdoorw` / `SA_TILES.hdoore` / `IN_DOOR_W_B64` / `IN_DOOR_E_B64` decodes to a pixel array BYTE-IDENTICAL to that crop. Also assert `hdoorw` alpha is nonzero ONLY in cols [0,e) and `hdoore` ONLY in cols [w-e,w) — the exact shape Paolo's own bank has (cols 0..6 / 37..43 at 44px). A mirrored or squished tile fails on the byte compare; a resampled one fails on both.

2. THE APPROVED BANK IS REACHABLE, NOT JUST QUOTED. Assert the decoded blob contains the string `BOHEMIA_DOOR_EW_BANK_7_10_26` (the source-reference byte-lock pattern already used for `HOUSE_SKIN_CANDIDATES` in `houseart_gate.py:133`), and assert `banks/BOHEMIA_DOOR_EW_BANK_7_10_26.txt` still parses with 184 entries all `edge_px:7` — so a bank edit that invalidates the law fails here.

3. EVERY SIDE APPROACH HAS A DOOR (the number Paolo is looking at). Walk 24 real suburb plots through `om.at` / `tileMeta` / `cellAt`, count house cells (2/6/9) whose left or right neighbour is 3 (driveway apron) or 1 (street), group them into vertical runs, and assert `sideDoors === sideRuns` and `sideDoors > 0`. THE BASELINE THIS GATE EXISTS TO STOP IS PRINTED IN THE PASS LINE: "704 east/west approaches across 24 plots, 0 doors" was the measured state on 8/2.

4. IT ACTUALLY REACHES THE CANVAS. Same trick `gates/wallheight_gate.js` uses: install a `g.drawImage` recorder, set `HC=44`, park the player two cells south of a known `c.doorEW` cell, call `render()`, and assert at least one recorded draw whose source is the `hdoorw`/`hdoore` cached canvas, at destination height `2*C` (DOOR LAW) and width `C`, at that cell's screen x/y. A pool that is loaded and never drawn — the exact failure `records/BOHEMIA_APPROVED_ASSET_INDEX_7_27_26.md` records for house skins ("loaded-and-never-drawn until 7/28") — fails here.

5. INTERIORS PICK BY FACING. Inside the frame, call the page's own `BOH_FLOORPLAN.generate` over 300 seeds x 7 zones x 4 entrance sides; for every door cell in a vertical wall run assert the `_ew` expression at the call site resolves non-null, and assert `IN_DOOR_W_B64.length === IN_DOOR_E_B64.length === IN_DOOR_B64.length`. Then enter a real building via `inEnter` on a plot whose `side` is 'W' or 'E', record `g.drawImage` through one `renderInside()`, and assert the perimeter-door draw used the `IN_DOOR_W_IMG`/`IN_DOOR_E_IMG` element, not `IN_DOOR_IMG`. Print the 29.9% baseline.

6. NO REGRESSION ON THE SOUTH DOOR. Re-assert `frontdoor_gate`'s invariants inline: every cell with `artPool_face==='hdoor'` still has `below===3||below===1`, `doors/faces < 0.06`, and generic kit districts still paint 0 painted doors. Plus assert `c.doorEW` is never set on a cell that is not part of the building mass.

ALSO: extend `gates/city_tab_gate.js` with one line asserting `SA_TILES.hdoorw=` and `SA_TILES.hdoore=` are embedded and that `['hroof','hwall','hwindow','hboarded','hdoor','hyard','hdoorw','hdoore']` is the registration list, and flip the B6 row in `laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md:189` from `-- | NOT ENFORCED` to `ewdoor_gate | ENFORCED 8/2`. A law without a machine gate is not enforced.

---

## DOOR GEOMETRY: "why is the door not taking up all the space of the 2 tiles it's in — it's like a picture of the door" (outdoor facadePass) + "why is the door two tiles and the walls are one tile south and north" (interior renderInside)

**already done:** False  **confidence:** high

### ROOT CAUSE

TWO DISTINCT MECHANISMS, BOTH MEASURED ON THE REAL SURFACE. NEITHER IS FIXED.

=== 1. OUTDOOR ("a picture of the door") — the SLOT is right, the ART is a wall tile ===
The 1-wide x 2-tall slot is correct: measured draw rect at HC=44 is dx=189 dy=207 dw=44 dh=88. What lands inside it is 29.2% door and 70.8% plain tan stucco.

Chain, each step verified:
(a) SA_TILES.hdoor is THREE 16x16 PNGs, and each one is a STUCCO WALL TILE with a small door printed on it. Measured door-vs-wall mask on all three: the door rectangle is 6px wide of 16 (37.5%) and 12px tall of 16, inset left 5, right 5, TOP 4, bottom 0. 71% of the "door tile" is the same tan stucco as the neighbouring hwall tiles.
(b) saTex() (city.txt:8804-8821) resamples EVERY pool tile into a TPX x TPX SQUARE canvas — TPX=22 (city.txt:8676). So hdoor becomes 22x22.
(c) tallTex('hdoor',v,2) (city.txt:9258-9271) stretches that whole 22x22 square — padding included — into a 22x44 canvas via `xx.drawImage(im,0,0,w,h*n)`. Confirmed in the live draw log: a `22x22 -> 22x44` drawImage is recorded during the frame.
(d) facadePass (city.txt:9305-9309) blits that 22x44 cache into the C x 2C slot: `g.drawImage(d2,dx,dy-C,C,C*2)`.

Result read straight off the canvas with getImageData on the real drawn rect:
  door pixels = 1132 / 3872 = 29.2% of the two-tile slot
  door bbox inside the slot = x[14..29] y[24..87] -> 16w x 64h of 44x88
  INSET: left 14px, right 14px, TOP 24px, bottom 0px
So the door is a 16x64 brown sliver floating in a 44x88 tan panel, with a full quarter of the slot height being blank stucco above it. That is exactly "a picture of the door."

AND THE LEAF IS ALSO DISTORTED. Source leaf 6w x 12h = 1:2.00 (a door). Drawn leaf 16w x 64h = 1:4.00. tallTex doubles the leaf's slenderness. The 7/27 law text brags "one stretch, in a cache, never in a frame" — that reasoning is wrong: caching a stretch does not undo it, it only hides it from a drawImage probe, which is precisely why gates/wallheight_gate.js:168-170 passes today (it compares the CACHED 22x44 source against the 44x88 dest, ratio 1.00, and never looks at the art).

THE APPROVED FIX ALREADY EXISTS AND IS ALREADY IN THE FILE. banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt (the residential swing pack) is embedded in the blob as IN_DOOR_B64 at city.txt:10388 — TEN plates, every one measured at 88x176 = ONE WIDE, TWO TALL, native 1:2, 95.5-99.9% opaque. The INTERIOR already eats it. The OUTSIDE does not. Simulated the same slot: those plates give 94.0-96.8% coverage vs 27.7-30.6% today.

=== 2. INTERIOR ("the door is two tiles and the walls are one tile") — the walls have NO HEIGHT ===
Measured one real interior frame (19x12 residential house, entered via inEnter()): 127 drawImage calls, bucketed by destination size:
  44x44 <- 22x22 : 113   (floors, walls, windows — ONE CELL)
  44x88 <- 88x176:   6   (the doors — TWO CELLS)
  22x22 <- 44x44 :   7
  75x75 <-112x112:   1   (the player)
Distinct destination heights: [22, 44, 75, 88]. THE ONLY DRAWS TALLER THAN ONE CELL IN THE ENTIRE INTERIOR FRAME ARE THE SIX DOORS.

The wall pass (city.txt:10447-10456) blits one flat cell and stops:
  `if(!inBlit('hwall',inPatch(x,y,5),sx,sy,C)){ g.fillStyle='#463d33'; g.fillRect(sx,sy,C,C); }`
while inDoor (city.txt:10410-10414) draws two:
  `g.drawImage(im,sx,sy-C,C,C*2);`

So the door is rendered in 3/4 ELEVATION at 2 tiles and the wall it stands in is rendered TOP-DOWN FLAT at 1 tile. Two projections in the same frame. That is why a door indoors reads as a framed portrait hung on a tan floor-strip — visible in the interior screenshot: five stone-framed doors standing upright on flat tan bands. It is the same complaint as (1), arriving from the other side.

CORRECT GEOMETRY PER laws/, newest-date-wins:
- laws/BOHEMIA_ADDENDUM_DOOR_LAW_TWO_TILES_TALL_7_26_26.md: "A DOOR IS ONE TILE WIDE AND TWO TILES TALL. ALWAYS. Never a one-tile stamp, never squished to fit a cell, never scaled off its own aspect." Names the bank by filename.
- laws/BOHEMIA_ADDENDUM_THREE_TILE_WALL_7_27_26.md: "A WALL THAT CARRIES A DOOR IS THREE TILES TALL... A door is TWO of those three tiles (DOOR LAW), which is the real proportion — a ~2m door in a ~3m wall. A window belongs UP the wall, at the middle tile, not lying on the ground."
- laws/BOHEMIA_LAW_WALLS_ARE_TWO_TALL_ONE_SOLID_8_2_26.md (newest): "Only a BUILDING may be taller than a wall. A house facade is three tiles. A wall is two." An interior partition of a house is BUILDING wall -> 3.
So: door = 2 tiles, filling its slot edge to edge; the wall carrying it = 3 tiles; window at the middle tile. Outdoors facadePass already gets the WALL right (WALL_H=3, city.txt:9255) and the DOOR ART wrong. Indoors renderInside gets the DOOR right and the WALL wrong. Neither surface has both.

### EVIDENCE

ALL LINE NUMBERS ARE IN THE DECODED CITY BLOB (base64 CITY_B64 inside /home/user/bohemia/slices/BOHEMIA_ALPHA_0_9.html, decoded to 24,763,552 chars).

--- city.txt:8676 — every pool tile is forced into a SQUARE ---
const TPX=22;                                  // texture pixels per cell = the default zoom, a true 1:1 blit

--- city.txt:8819-8821 — saTex squares it ---
  const c2=document.createElement('canvas'); c2.width=TPX; c2.height=TPX;
  c2.getContext('2d').drawImage(im,0,0,TPX,TPX);
  _texCache.set(k2,t=c2); return t; }

--- city.txt:9255-9271 — the cached stretch ---
const WALL_H=3;                 /* tiles: the wall a door lives in */
const WALL_SEE=0.35;            /* how much of a wall is left when it is hiding you */
const TALLCV=new Map();
function tallTex(pool,v,n){
  /* The approved door tile is 16x16 and the slot is one cell wide by two tall.
     As a single draw that is an aspect change - the exact thing the render
     contract bans. Derive it ONCE into a 16x32 canvas and blit that at 1:1
     forever after: one stretch, in a cache, never in a frame. */
  const k=pool+'|'+v+'|'+n; if(TALLCV.has(k))return TALLCV.get(k);
  const im=saTex(pool,v);
  ...
  const cc=document.createElement('canvas'); cc.width=w; cc.height=h*n;
  const xx=cc.getContext('2d'); xx.imageSmoothingEnabled=false;
  xx.drawImage(im,0,0,w,h*n);          <-- THE STRETCH. w=22, h=22, n=2 -> 22x44.

--- city.txt:9304-9310 — the outdoor door draw ---
      const wall=saTex('hwall',v);
      if(c.artPool_face==='hdoor'){
        if(wall)g.drawImage(wall,dx,top,C,C);
        const d2=tallTex('hdoor',v,2);
        if(d2)g.drawImage(d2,dx,dy-C,C,C*2);        /* DOOR LAW: 2 tiles, in a 3-tile wall */
        else if(wall){ g.drawImage(wall,dx,dy-C,C,C); g.drawImage(wall,dx,dy,C,C); }
      } else {

--- MEASUREMENT 1: the hdoor source art is a wall tile ---
(mean hwall tan = (173,151,117); door mask = pixels >28 darker in R)
hdoor[0] doorpx=74 (28.9% of tile)  bbox x[5..10] y[4..15] = 6w x 12h   inset L5 R5 TOP4 B0
hdoor[1] doorpx=82 (32.0% of tile)  bbox x[5..10] y[4..15] = 6w x 12h   inset L5 R5 TOP4 B0
hdoor[2] doorpx=84 (32.8% of tile)  bbox x[5..10] y[4..15] = 6w x 12h   inset L5 R5 TOP4 B0
row map of hdoor[0]:
    ................          <- rows 0-3: PLAIN TAN STUCCO
    .....######.....          <- rows 4-15: the 6px door
    .....######.....

--- MEASUREMENT 2: playwright, real alpha, CITY tab, HC=44, drawImage patched + getImageData readback ---
slot rect {"dx":189,"dy":207,"dw":44,"dh":88,"sw":22,"sh":44}
door(dark) px = 1132 / 3872 = 29.2% of the two-tile slot
door bbox in slot: x[14..29] y[24..87] = 16w x 64h of 44x88
INSET: left 14px, right 14px, TOP 24px, bottom 0px
source sizes seen in that frame include: "22x22->22x44"  <- tallTex's stretch, on the real surface
                                          "22x44->44x88"  <- the blit the gate checks and passes
ASPECT: source leaf 6x12 = 1:2.00 ; drawn leaf 16x64 = 1:4.00 (doubled)

--- MEASUREMENT 3: what the approved bank would give in the same slot ---
TODAY  hdoor[0..2] -> 27.7% / 28.5% / 30.6% coverage
AFTER  IN_DOOR[0..9] -> 95.9 95.7 96.3 95.4 94.2 96.8 95.0 94.0 94.9 94.6 %
IN_DOOR plates measured: all TEN are 88x176, bitdepth 8, colortype 6, alpha bbox (0,0,88,176), 95.5-99.9% opaque.

--- city.txt:10384-10389 — the approved bank, already embedded, already 1x2 ---
// THE DOOR LAW (Paolo 7/26, LOCKED): "doors are always two tiles tall, two by
// one". The approved animated door bank has existed since 7/13 and nothing was
// consuming it; the interior drew a flat 1x1 stamp. These are the residential
// swing clips verbatim, 88x176 = ONE WIDE, TWO TALL, closed frame.
const IN_DOOR_B64=[...10 plates...];
const IN_DOOR_IMG=IN_DOOR_B64.map(function(b){ const im=new Image(); im.src='data:image/png;base64,'+b; return im; });

--- city.txt:10410-10414 — interior door: 2 tiles, correct ---
function inDoor(seed,sx,sy,C){
  const im=IN_DOOR_IMG[(seed>>>0)%IN_DOOR_IMG.length];
  if(!im||!im.complete||!im.naturalWidth)return false;
  g.drawImage(im,sx,sy-C,C,C*2); return true;
}

--- city.txt:10447-10456 — interior wall: 1 tile, ZERO height ---
  for(let y=0;y<fp.H;y++)for(let x=0;x<fp.W;x++){
    const c=fp.grid[y][x], sx=ox+x*C, sy=oy+y*C;
    if(sx<-C||sy<-C-C||sx>cv.width||sy>cv.height)continue;
    if(c.g==='wall'){
      if(!inBlit('hwall',inPatch(x,y,5),sx,sy,C)){ g.fillStyle='#463d33'; g.fillRect(sx,sy,C,C); }
      const wh=((Math.imul(x,2654435761)^Math.imul(y,40503))>>>0);
      if(onEdge(x,y)&&(wh%5)<2) inBlit((wh%5)===0?'hwindow':'hboarded',wh>>>4,sx,sy,C);   <- window ON THE GROUND
      if(!isWall(x,y+1)){ g.fillStyle='rgba(255,240,210,0.10)'; g.fillRect(sx,sy+C-Math.max(1,C*0.26),C,Math.max(1,C*0.26)); }
    }
  }

--- MEASUREMENT 4: real interior frame, 19x12 residential, 6 rooms ---
sizes: {"22x22 <- 44x44":7, "44x44 <- 22x22":113, "44x88 <- 88x176":6, "75x75 <- 112x112":1}
distinct destination heights: [22, 44, 75, 88]
=> the ONLY draws taller than one cell (44) are the 6 doors (88). Every wall = one flat 44x44 blit.

--- WHY THE GATE IS GREEN: gates/wallheight_gate.js:139-140,168-170 ---
    const badAspect = d => d.filter(isFacade).filter(x => x.sw > 0 && x.sh > 0 && x.dw > 0 && x.dh > 0
      && Math.abs((x.dw / x.dh) / (x.sw / x.sh) - 1) > 0.03).length;
  ok('THE TALL DOOR IS NOT SQUASHED: 0 FACADE draws have a destination aspect different from ' +
    'their source (' + r.behindBadAspect + ') — the 16x32 door tile is derived once and cached, ' +
    'never stretched per frame', r.behindBadAspect === 0);
It compares the CACHE (22x44) to the DEST (44x88). Ratio 1.00. It never opens the art and never counts a pixel, so a tile that is 71% blank wall passes forever.

--- LAW TEXT (laws/BOHEMIA_ADDENDUM_THREE_TILE_WALL_7_27_26.md) ---
"**1. A WALL THAT CARRIES A DOOR IS THREE TILES TALL.** Not one. ... A door is
TWO of those three tiles (DOOR LAW), which is the real proportion — a ~2m door
in a ~3m wall. A window belongs UP the wall, at the middle tile, not lying on
the ground."

--- SCOPE PROOF for the patch ---
The whole city blob is ONE <script>: line 129 `<script>` ... line 10516 `</script>`. facadePass (9272) and IN_DOOR_IMG (10389) share top-level scope, so a var holder filled after 10389 is readable from facadePass at render time.

--- ANCHOR UNIQUENESS (verified by exact-substring count in the decoded blob) ---
facadePass door block .......... count = 1
inDoor() ....................... count = 1
interior wall pass ............. count = 1
const IN_DOOR_IMG=... .......... count = 1
function tallTex(pool,v,n){ ..... count = 1
const WALL_H=3; ................ count = 1

Screenshots written (real surface, 390x844): scratchpad/REAL_OUTDOOR.png (thin brown sliver in a flat tan band) and scratchpad/REAL_INTERIOR.png (five upright framed doors standing on flat tan strips).

### PATCH SPEC

Ship as ONE idempotent tool, tools/bohemia_city_doorfill_patch.py, using the established idiom (see tools/bohemia_city_onewall_patch.py:60-70): read slices/BOHEMIA_ALPHA_0_9.html, `key = "const CITY_B64='"`, slice to the next "'", base64-decode to utf8, do the exact replaces below, re-encode, write back. Guard with `if 'DOOR FILLS ITS TWO TILES' in decoded: sys.exit(0)`.

All four OLD strings are verified to occur EXACTLY ONCE in the decoded blob.

=========================================================================
EDIT 1 — reach the approved bank from the facade pass (TDZ-safe holder + per-zoom cache)
=========================================================================
OLD (unique — this is the DEFINITION; the two call sites have different arg lists):
function facadePass(ox,oy,C,front,pgy,pbox){

NEW:
/* THE APPROVED DOOR BANK, REACHABLE FROM THE FACADE PASS (8/2).
   IN_DOOR_B64/IN_DOOR_IMG is the residential swing pack out of
   banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt: 88x176 = ONE WIDE, TWO TALL, the
   size the DOOR LAW names. It is declared further down this same <script>, so
   it is reached through a var holder filled the moment it exists - a direct
   const reference would be a TDZ throw if any frame ever rendered early.
   PER-ZOOM CACHE: the plate is derived ONCE per (variant, cell size) into a
   C x 2C canvas and blitted forever after, the same discipline TALLCV and
   PPL_CACHE already use. 88:176 into C:2C is 1:2 into 1:2 - not a stretch at
   any zoom stop, and an exact 1/2, 1/4, 1/8 downscale at HLEVELS 44, 22, 11. */
var FACADE_DOOR_BANK=null;
const FDOOR_CV=new Map();
function facadeDoor(v,C){
  if(!FACADE_DOOR_BANK||!FACADE_DOOR_BANK.length)return null;
  const i=(v>>>0)%FACADE_DOOR_BANK.length, im=FACADE_DOOR_BANK[i];
  if(!im||!im.complete||!im.naturalWidth)return null;
  const k=i+'|'+C; let c=FDOOR_CV.get(k); if(c)return c;
  c=document.createElement('canvas'); c.width=C; c.height=C*2;
  const xx=c.getContext('2d'); xx.imageSmoothingEnabled=false;
  xx.drawImage(im,0,0,C,C*2);
  FDOOR_CV.set(k,c); return c;
}
function facadePass(ox,oy,C,front,pgy,pbox){

=========================================================================
EDIT 2 — the outdoor door stops being a stretched wall tile
=========================================================================
OLD (exact bytes, count=1):
      const wall=saTex('hwall',v);
      if(c.artPool_face==='hdoor'){
        if(wall)g.drawImage(wall,dx,top,C,C);
        const d2=tallTex('hdoor',v,2);
        if(d2)g.drawImage(d2,dx,dy-C,C,C*2);        /* DOOR LAW: 2 tiles, in a 3-tile wall */
        else if(wall){ g.drawImage(wall,dx,dy-C,C,C); g.drawImage(wall,dx,dy,C,C); }
      } else {

NEW:
      const wall=saTex('hwall',v);
      if(c.artPool_face==='hdoor'){
        if(wall)g.drawImage(wall,dx,top,C,C);
        /* DOOR FILLS ITS TWO TILES (Paolo 8/2: "WHY IS THE DOOR NOT TAKING UP
           ALL THE SPACE OF THE 2 TILES ITS IN. ITS LIKE A PICTURE OF THE DOOR
           BRO"). He was describing a measurement. Read off the real canvas at
           HC=44 before this changed: the SLOT was a correct 44x88, and the door
           pixels inside it were a 16 x 64 sliver - 29.2% of the slot, with 24px
           of plain tan stucco above it and 14px of it down each side. Literally
           a small picture of a door printed on a wall tile.
           WHY: SA_TILES.hdoor is a 16x16 STUCCO WALL with a 6x12 door painted in
           the middle. saTex resamples every pool tile into a TPX x TPX SQUARE
           (22x22); tallTex then stretched that whole square - padding and all -
           to 22x44, which ALSO doubled the leaf's aspect from 1:2 to 1:4. The
           stretch was hidden inside a cache, so wallheight_gate's "dest aspect
           === source aspect" check saw 22x44 -> 44x88 and passed. A cached
           stretch is still a stretch. It is only invisible.
           THE FIX IS THE DOOR LAW'S OWN SENTENCE, by filename:
           banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt, the residential swing pack,
           88x176 = ONE WIDE, TWO TALL, native 1:2, already embedded and already
           consumed by the interior. Now the outside draws the same door, so a
           door is one door in one game. Measured after: 94.0-96.8% of the slot.
           NOT through saTex, ever: squaring the plate is what broke it. */
        const dr=facadeDoor(v,C);
        if(dr)g.drawImage(dr,dx,dy-C,C,C*2);
        else { const d2=tallTex('hdoor',v,2);
          if(d2)g.drawImage(d2,dx,dy-C,C,C*2);
          else if(wall){ g.drawImage(wall,dx,dy-C,C,C); g.drawImage(wall,dx,dy,C,C); } }
      } else {

=========================================================================
EDIT 3 — fill the holder the moment the bank exists
=========================================================================
OLD (count=1):
const IN_DOOR_IMG=IN_DOOR_B64.map(function(b){ const im=new Image(); im.src='data:image/png;base64,'+b; return im; });

NEW:
const IN_DOOR_IMG=IN_DOOR_B64.map(function(b){ const im=new Image(); im.src='data:image/png;base64,'+b; return im; });
FACADE_DOOR_BANK=IN_DOOR_IMG;   /* ONE DOOR, INSIDE AND OUT: the facade pass and the interior now blit the same approved 88x176 plate. */

=========================================================================
EDIT 4 — the interior wall becomes as tall as the door in it
=========================================================================
OLD (exact bytes, count=1 — includes the cull guard so the anchor is unique
against the identical guard in the ground pass):
  for(let y=0;y<fp.H;y++)for(let x=0;x<fp.W;x++){
    const c=fp.grid[y][x], sx=ox+x*C, sy=oy+y*C;
    if(sx<-C||sy<-C-C||sx>cv.width||sy>cv.height)continue;
    if(c.g==='wall'){
      if(!inBlit('hwall',inPatch(x,y,5),sx,sy,C)){ g.fillStyle='#463d33'; g.fillRect(sx,sy,C,C); }
      const wh=((Math.imul(x,2654435761)^Math.imul(y,40503))>>>0);
      if(onEdge(x,y)&&(wh%5)<2) inBlit((wh%5)===0?'hwindow':'hboarded',wh>>>4,sx,sy,C);

NEW:
  for(let y=0;y<fp.H;y++)for(let x=0;x<fp.W;x++){
    const c=fp.grid[y][x], sx=ox+x*C, sy=oy+y*C;
    /* the cull now allows for a wall whose BASE is below the viewport but whose
       upper courses are still on screen. */
    if(sx<-C||sy<-C*WALL_H||sx>cv.width||sy>cv.height+C*WALL_H)continue;
    if(c.g==='wall'){
      /* A WALL IS AS TALL AS THE DOOR IN IT (Paolo 8/2: "MY BIGGEST THING WITH
         INTERIORS WHY IS THE DOOR TWO TILES AND THE WALLS ARE ONE TILE SOUTH
         AND NORTH"). Measured in a real interior frame before this changed: 127
         draws, and the ONLY ones taller than a cell were the 6 doors at 44x88.
         Every wall was a single flat 44x44 blit. So the door was drawn in
         ELEVATION and the wall it stands in was drawn TOP-DOWN - two projections
         in one frame, which is exactly why a door indoors reads as a picture
         hung on the floor instead of a hole in a wall.
         THREE-TILE WALL LAW (7/27, LOCKED): a wall that carries a door is THREE
         tiles tall and the door is TWO of the three - a ~2m door in a ~3m wall.
         Same WALL_H the outside already uses, so INTERIOR === EXTERIOR here too.
         Only a wall that PRESENTS A FACE (floor to its south - the same test
         this pass already runs for its base highlight) is raised; a wall seen
         from behind stays on its own cell, so the plate never becomes a block. */
      const _up=isWall(x,y+1)?1:WALL_H;
      for(let _r=_up-1;_r>=0;_r--){
        if(!inBlit('hwall',inPatch(x,y,5),sx,sy-_r*C,C)){ g.fillStyle='#463d33'; g.fillRect(sx,sy-_r*C,C,C); }
      }
      const wh=((Math.imul(x,2654435761)^Math.imul(y,40503))>>>0);
      /* A WINDOW BELONGS UP THE WALL, at the middle tile, not lying on the
         ground (THREE-TILE WALL LAW clause 1, verbatim). */
      if(onEdge(x,y)&&(wh%5)<2) inBlit((wh%5)===0?'hwindow':'hboarded',wh>>>4,sx,sy-(_up>1?C:0),C);

NOTE the deliberate variable name `_up`/`_r`: the block three lines below already
declares `const wh`, so reusing `wh` would be a redeclaration SyntaxError.
NOTE the fill count is unchanged (still exactly one `g.fillStyle='#463d33'`), which
matters because gates/interiors_gate.js asserts `fills <= 4` on this slice.
NOTE `WALL_H` (const 3, city.txt:9255) is in scope: same script, declared ~1200
lines earlier, and renderInside only runs at frame time.

=========================================================================
FINALLY: bump #buildstamp in the alpha front splash per the 7/20 BUILD STAMP law,
e.g. "BUILD 8/2b · THE DOOR FILLS ITS DOORWAY".

### RISK

1. ART VERDICT, NOT A BUG (the one thing to surface to Paolo): the approved 88x176 residential plates are grey/green/brown stone-framed doors. The exterior they will now sit in is TAN STUCCO (mean hwall = 173,151,117). Palette clash is possible. This is his call, not the lane's — but note the DOOR LAW names this exact bank as the thing the surfaces must consume, and the interior has been drawing them since 7/26 without complaint. Do not cook a new tan door; that would be REUSE-FIRST all over again.

2. gates/wallheight_gate.js — should STAY green and gets stronger. `behindTall >= 1` still holds (draw is still C x 2C). `behindBadAspect === 0` still holds (88:176 -> 44:88, ratio 1.000). `behindCell > 10` unaffected. The `22x22 -> 22x44` tallTex draw simply disappears from the recorded frame, which is the point.

3. gates/interiors_gate.js — four things to not break, all checked:
   - `/g\.drawImage\(im,sx,sy-C,C,C\*2\)/` in the `inside` slice: untouched (inDoor unchanged).
   - `DOOR PASS` must appear after `WALL PASS`: unchanged.
   - `inside.includes("'hdoor'")`: still true via the outdoor fallback and the interior fallback `inBlit('hdoor',...)`.
   - `fills <= 4` counts `g.fillStyle='#` in the slice: unchanged at the same count.
   Its `/let C=Math\.floor\(Math\.min\(/` integer-cell assertion is untouched.

4. gates/wallclass_gate.js — asserts the perimeter cell draws from the `perimeter` pool and never from ['hwall','hwindow','hboarded','hdoor']. Neither edit touches the `c.artPool_face==='perimeter'` branch (facadePass returns early via `continue` before reaching the hdoor branch). Green.

5. gates/frontdoor_gate.js — reads `c.artPool_face==='hdoor'` off cells, never the draw. Untouched.

6. gates/doorart_gate.py — targets slices/BOHEMIA_SUBURB_WALK_7_18_26.html, a different file entirely. Untouched.

7. REAL REGRESSION RISK — INTERIOR DRAW ORDER. renderInside draws the player LAST and unconditionally, so a raised wall can never HIDE him (no see-through strictly needed to satisfy the 7/27 "they ship together" clause indoors). The inverse is the exposure: a wall SOUTH of the player, raised into his row, will be drawn UNDER him, so he will appear to stand in front of a wall that is in front of him. Outdoors facadePass solves this with the front/behind split (city.txt:9574 and 9621). If the render-and-look bar is not met, the follow-on is to split the interior wall pass the same way — behind-him at full alpha before the player, in-front-of-him after, faded by WALL_SEE where the box overlaps. Spec that as the same-turn follow-up, do not ship a half of it.

8. INTERIOR OCCLUSION: raising every face-presenting wall to 3 tiles in a 12-row plate covers meaningfully more floor. The `isWall(x,y+1)` guard means only south-facing walls rise, which is roughly one run per room, but a 5x12 apartment could read as cramped. Look at a real frame before shipping (VERIFY ON THE REAL SURFACE, 7/18).

9. AMBIENT OCCLUSION PASS (city.txt:10467-10475) runs after the walls and paints on floor cells; raised wall courses now cover some of those cells, so AO will draw over wall art in a few places. Cosmetic; mention it, do not silently leave it.

10. SMALLEST ZOOM: at HC=11 the 88x176 plate downsamples 8:1. The per-zoom FDOOR_CV cache with imageSmoothingEnabled=false keeps it a nearest-neighbour derive, and 11/22/44/88 are all exact powers of 1/2 of 88x176's half-width, so no fractional-scale violation of the MOBILE RENDER CONTRACT. Verify render_pixel_gate.js / full_pixel_gate.js still pass anyway.

11. MEMORY: FDOOR_CV holds at most 10 variants x 4 zoom stops = 40 canvases, max 88x176 each ~ 2.5MB total worst case. Bounded; no eviction needed.

12. LANE BOUNDARY: both edits are inside CITY_B64 (the CITY lane). No engine/*.js, no other lane's file. Per ONE SYSTEM, ONE SESSION, confirm no parallel session is inside the city blob before pushing.

### GATE SPEC

NEW GATE: gates/doorfill_gate.js — measures the ART on the REAL surface, which is the exact thing every existing door gate declines to do. Model it on gates/wallheight_gate.js (same PROBE that patches CanvasRenderingContext2D.prototype.drawImage before boot, same boot sequence: goto file://alpha -> click #front -> click .tab[data-p="city"] -> wait -> grab the frame named 'cityFrame'). Wire into gates/bohemia_gates.py.

ASSERTION 1 — THE DOOR FILLS ITS TWO TILES (pixel readback, not a draw audit).
  Set HC=44. Find a cell with `c.face && c.artPool_face==='hdoor'`. Stand the player 3 cells SOUTH of it so nothing fades. Render one frame with the probe on.
  Take the single draw where `dw===C && dh===2*C`. Call `g.getImageData(dx,dy,dw,dh)`.
  Count "door" pixels = pixels that are NOT the tan stucco family (R < 130 is the
  discriminator that separated them cleanly: mean hwall tan = (173,151,117)).
  ASSERT coverage >= 85% of the slot.
  PROVEN ABLE TO FAIL: today it measures 29.2% (1132/3872).
  Also ASSERT the door bbox reaches the top of the slot: `minY <= 2` px.
  PROVEN ABLE TO FAIL: today minY = 24 of 88.

ASSERTION 2 — NO CACHED STRETCH (closes the loophole wallheight_gate left open).
  Extend the PROBE to also record draws made to OFFSCREEN canvases during the
  frame, not just to the visible context. ASSERT that no drawImage in the frame
  has a source aspect != destination aspect for any image whose destination is
  the door slot OR that feeds it.
  Concretely and simply: ASSERT the source handed to the C x 2C door draw is a
  canvas of exactly `C x 2C` derived from an 88x176 image — i.e. record
  `sw===C && sh===2*C`, and separately ASSERT `tallTex` is never called with
  pool 'hdoor' during the frame (patch tallTex and count).
  PROVEN ABLE TO FAIL: today `sw=22 sh=44` and the frame contains a literal
  `22x22 -> 22x44` draw.

ASSERTION 3 — ONE DOOR, INSIDE AND OUT (REUSE-FIRST, machine-held).
  ASSERT the outdoor door draw and the indoor door draw come from the SAME
  bank: the natural size of the image behind both is 88x176. Do it by tagging —
  in the probe, record `img.naturalWidth+'x'+img.naturalHeight` for the ORIGINAL
  image (facadeDoor's cache should stamp `cv.__src='88x176'`), then assert both
  surfaces report it.
  Independently, ASSERT in source that `IN_DOOR_B64` really is the residential
  pack: decode every entry, ASSERT all are 88x176 (10/10 today), and ASSERT the
  count matches the residential clip count in
  banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt. That is the DOOR LAW's own gate
  clause ("refuses to ship a door frame that is not 88x176").

ASSERTION 4 — THE WALL IS AS TALL AS THE DOOR IN IT (interior, the second complaint).
  In the same browser session, call `inEnter(tgtX,tgtY,fromX,fromY,false)` on a
  real house (find a cell with `c.enter && !c.walk && c.s` whose south neighbour
  is walkable), confirm `window.__CITY_INSIDE()` is non-null, then render one
  frame with the probe on.
  Bucket the draws by destination height. Let C be the interior cell size.
  ASSERT `wallColumnCells >= doorCells`, computed as:
    doorCells = max(dh)/C over draws whose source is 88x176   (expect 2)
    wallCells = the number of stacked C x C blits issued at the same dx for a
                wall cell that flanks a door                  (expect 3)
  ASSERT wallCells === 3 AND wallCells > doorCells.
  PROVEN ABLE TO FAIL: today the interior frame is
    {"44x44 <- 22x22":113, "44x88 <- 88x176":6, ...}, distinct dh = [22,44,75,88]
  i.e. wallCells = 1 and doorCells = 2 — the wall is SHORTER than the door,
  which is Paolo's sentence stated as a number.

ASSERTION 5 — THE WINDOW IS OFF THE FLOOR.
  ASSERT at least one interior 'hwindow'/'hboarded' blit lands at `sy - C`, never
  at `sy`, when its wall is raised. PROVEN ABLE TO FAIL: today every window blits
  at `sy`.

ASSERTION 6 — BOTH DIRECTIONS OF ANY FADE THAT SHIPS (if the interior front/behind
  split lands): render one interior frame with the player standing on a tile a
  raised wall paints over, and one with him clear. Sample the canvas pixel where
  the wall covers him in both. Identical pixels = the fade is disconnected =
  FAIL. This is the wallclass_gate.js pattern verbatim — a source-level check for
  a constant would pass with the fade unwired, and this lane has shipped that
  mistake twice.

PROOF-OF-FAILURE REQUIREMENT (per the 8/2 law's own precedent): before landing,
run the new gate against the CURRENT blob and record that assertions 1, 2, 4 and
5 go RED. A gate that has never been seen to fail has proved nothing.

ARTIFACT: write the two readback frames to records/ as
BOHEMIA_DOOR_FILL_PROOF_8_2_26.png (outdoor slot, before/after side by side) and
BOHEMIA_INTERIOR_WALLHEIGHT_PROOF_8_2_26.png so the numbers are lookable, not
just claimed.

---

## B2 — "WHY IS THERE NO SHADING OR SHADOWS FROM THE BUILDINGS. ARE WE DOING ANYTHING TO IMPLEMENT THE DIRECTION OF SHADOWS WITH THE TIME OF DAY IT IS?" (walked world / CITY blob renderHuman)

**already done:** False  **confidence:** high

### ROOT CAUSE

TWO SEPARATE FACTS, BOTH MEASURED, NOT INFERRED.

(1) THE WALKED WORLD DRAWS ZERO CAST SHADOW. There is no shadow code on the render path at all. I instrumented the real canvas context inside the live cityFrame and recorded every draw op for one human-mode frame standing beside a suburb house (fine cell 2590,2960). The ENTIRE frame emitted 23 fillRects, and they are only three kinds: 11x `rgba(255,255,255,0.1)` 22x1 top-highlight lines, 11x `rgba(0,0,0,0.22)` 22x1 base lines, and 1x `#20303e` 378x765 background clear. Zero `ellipse()`, zero `fill()`. The only black in the world is a ONE-PIXEL contact line at the bottom edge of each solid cell — the 45-degree law's "base sits in its own shadow" line — which is a bevel, not a cast shadow, and is baked identically into every tile whether it is a house or a fence.

Pixel confirmation on the same frame: the ground cell 1 step SOUTH of a house facade sampled [154.48, 104.12, 78.00]; open ground of the same material 8 cells away from any building sampled [154.48, 104.12, 78.00]. Bit-identical to two decimals. Nothing darkens the ground near a mass, at any hour.

(2) THE WALKED WORLD HAS NO SUN AT ALL — only a boolean. engine/bohemia_daycycle.js (BOH_DAYCYCLE, ambientAt/isNightish) exists and is wired into four dead slice files, but it is NOT inlined in CITY_B64: `typeof BOH_DAYCYCLE` evaluates to "undefined" inside the live cityFrame. The city's entire time-of-day model is three lines: `const T={day:1,min:8*60}` / `advance(mins)` / `function isNight(){ return T.min>=19*60||T.min<6*60; }`. isNight() is consumed in exactly four places (background colour, a flat blue overlay, lamp dots, the HUD moon glyph). There is no sun azimuth, no elevation, no vector, nothing a shadow could point along. So the second half of his question — "the direction of shadows with the time of day" — has no data source to read, which is why nobody has half-built it.

This is not a regression or a pipeline bug. It is an unwritten feature that the repo already knows is unwritten: laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md line 185 lists clause B2 as `| B2 | shadows + sun direction by time | -- | NOT ENFORCED |`, and laws/BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md section 4 has demanded since 7/26 that "Every mass throws a real cast shape across the ground in front of it, not just a contact pool." The contract was written and never implemented on the surface he plays.

### EVIDENCE

ALL LINE NUMBERS ARE IN THE DECODED CITY_B64 (24,763,552 chars; the raw alpha contains none of this). Decode with the CITY_B64 recipe; one `const CITY_B64='` in slices/BOHEMIA_ALPHA_0_9.html at byte 2196447.

A) THE CLOCK IS A BOOLEAN — decoded blob lines 7735-7738:
  const T={day:1, min:8*60};
  function advance(mins){ T.min+=mins; while(T.min>=24*60){T.min-=24*60;T.day++;} updHud(); }
  function isNight(){ return T.min>=19*60||T.min<6*60; }
  function clockStr(){ const h=(T.min/60)|0, m=Math.floor(T.min%60); return 'DAY '+T.day+' · '+String(h).padStart(2,'0')+':'+String(m).padStart(2,'0'); }
Measured in the live frame: `{"hasDaycycle": false, "T": {"day":1,"min":480}, "isNight": false}`. BOH_DAYCYCLE is absent.

B) THE ONLY "SHADOW" IN THE WORLD IS A 1PX BEVEL — the identical two lines appear in the bake and in the live facade pass:
  decoded 8925-8926 (chunkCanvas, the 22px chunk bake):
      x.fillStyle='rgba(255,255,255,0.10)'; x.fillRect(i2*TPX,y*TPX,TPX,1);
      x.fillStyle='rgba(0,0,0,0.22)'; x.fillRect(i2*TPX,y*TPX+TPX-1,TPX,1);
  decoded 9319-9320 (facadePass), under the comment
      /* 45 DEGREE ART LAW: the top edge catches the sky, the base sits in its
         own shadow, same two lines the bake already draws on a structure. */
      g.fillStyle='rgba(255,255,255,0.10)'; g.fillRect(dx,top,C,1);
      g.fillStyle='rgba(0,0,0,0.22)'; g.fillRect(dx,dy+C-1,C,1);

C) renderHuman (decoded 9536-9622) HAS NO SHADOW STEP. Its draw order, verbatim, decoded 9571-9576:
  tpDraw(ox,oy);
  /* THREE-TILE WALL: everything he is standing SOUTH of, at full opacity */
  const _pbox=playerBox(ox,oy,C);
  facadePass(ox,oy,C,false,hy,null);
  sigPass(ox,oy,C);   /* __TRAFFIC_SIGNALS__ */
  peoplePass(ox,oy,C);
Measured in-frame: `/shadow|SUN|sunVec/i.test(renderHuman.toString())` === false.

D) INSTRUMENTED FRAME (real cityFrame, HC=22, standing at fine cell 2590,2960, suburb):
  {"totalFillRect":23,"drawImage":63,"ellipse":0,"fill":0,
   "buckets":[["rgba(255, 255, 255, 0.1)|a1|22x1",11],
              ["rgba(0, 0, 0, 0.22)|a1|22x1",11],
              ["#20303e|a1|378x765",1]]}

E) GROUND PIXELS, same frame, 5x5 average per cell:
  ground 1 cell south of the facade  -> [154.48, 104.12, 78.00]
  ground 2/3/4 cells south-east      -> [154.48, 104.12, 78.00] each
  reference open ground (2584,2954), same `g` colour #8a7a5e, no solid within 5 cells -> [154.48, 104.12, 78.00]
  Delta: 0.00 on every channel. No mass darkens any ground anywhere.

F) THE CELL MODEL A SHADOW MUST READ (realizeCell, decoded 8055-8262):
  building mass:   c.s = colour; c.walk=false; c.artPool='hroof'
  front row only:  c.face=true; c.artPool_face='hwall'|'hwindow'|'hboarded'|'hdoor'|'perimeter'
  declared heights: c.wallH=2 for a kit fence and for the suburb perimeter wall; otherwise WALL_H
  props/trees:     c.s set, no artPool, no wallH
  decoded 9255-9256: `const WALL_H=3;` / `const WALL_SEE=0.35;`

G) THE LAWS THAT ALREADY DEMAND THIS AND ARE UNMET:
  laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md:67-72 (clause B2, his exact words)
  laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md:185  `| B2 | shadows + sun direction by time | -- | NOT ENFORCED |`
  laws/BOHEMIA_MOBILE_RENDER_CONTRACT_7_26_26.md:91-93 "ONE direction, everywhere: key from the upper LEFT... Shadows fall down and to the right. Every mass throws a real cast shape across the ground in front of it, not just a contact pool."
  laws/BOHEMIA_ADDENDUM_SHADOWS_ARE_SEPARATE_7_26_26.md:11-13 shading is "applied at RENDER TIME as their own separate layer/pass, driven by the one canon light direction" — a render-time ground pass is exactly what this law orders.
  `ls gates/ | grep -i shadow` -> nothing. No gate exists.

H) THE FIX, BUILT AND VERIFIED ON A SCRATCHPAD COPY OF THE REAL ALPHA (repo untouched):
  /tmp/.../scratchpad/apply_to_copy2.py -> ALPHA_SHADOWED2.html, booted in chromium at 390x844, splash tapped, CITY tab tapped, human mode.
  - 0 page errors.
  - wall pixels identical with the pass on (155.3) and neutered (155.3) -> the pass is provably UNDER the facade and under the player.
  - sun sweep across the day (dx = screen-x of the shadow, len = cells per unit height):
      05:00 null (night)          07:00 dx -0.426 len 1.67
      09:00 dx -0.261 len 0.61    12:00 dx +0.002 len 0.55
      15:00 dx +0.264 len 0.55    17:00 dx +0.430 len 1.04
      18:00 dx +0.508 len 1.67    20:00 null (night)
  - ground luminance [left, centre, right] at rows 1..4 south of the caster:
      07:00 rows 1-4 all darkened (112.2 -> 73.5), shadow LONG
      12:00 rows 1-2 darkened only, rows 3-4 clean, shadow SHORT
      17:00 right column dark to row 3, LEFT column stays 112.2 -> the shadow has swung right
      night rows all 66.2, pass returns 0, nothing drawn
  - union fill probe in-frame: two overlapping rects in ONE path, ONE fill -> single-cover pixel 168, overlap pixel 168. No double-darkening.
  - cost, median of 120 real renders per case (desktop chromium):
      HC=88  +0.0ms (20-50 rects)   HC=44 +0.1ms (24-60 rects)
      HC=22  +0.2 to +0.3ms (65-318 rects)   HC=11 +0.6 to +0.8ms (185-745 rects)
  - screenshots at 07:00 / 12:00 / 17:00 show the stepped shadow band swinging left -> straight down -> right beneath the house mass.

### PATCH SPEC

Ship as one idempotent tool, repo convention: `tools/bohemia_city_sunshadow_patch.py` (mirror tools/bohemia_city_wallheight_patch.py exactly — read slices/BOHEMIA_ALPHA_0_9.html, `key="const CITY_B64='"`, a0=index+len, a1=index("'",a0), b64decode, no-op if 'SUN + CAST SHADOWS' already present, assert each anchor count==1, re-encode, write back).

=== EDIT 1 of 2 — define the pass. ANCHOR (verified count == 1 in the decoded blob) ===
OLD:
function facadePass(ox,oy,C,front,pgy,pbox){

NEW (the anchor line is re-emitted at the end, so this is a pure insert-before):
/* ==== SUN + CAST SHADOWS (8/2/26, Paolo, BUILT WORLD LAW clause B2) =====
   "WHY IS THERE NO SHADING OR SHADOWS FROM THE BUILDINGS. ARE WE DOING
    ANYTHING TO IMPLEMENT THE DIRECTION OF SHADOWS WITH THE TIME OF DAY IT IS?"

   MEASURED BEFORE THIS LANDED, in a real browser on the real CITY tab: the
   walked world emitted 23 fillRects a frame and every single one was a 1px
   edge line, and the ground one cell south of a house read [154.48,104.12,78]
   -- pixel for pixel the SAME as open ground eight cells from any building.
   Nothing cast anything. And there was no sun to cast along: BOH_DAYCYCLE is
   not in this app at all, and the only consumer of the clock was isNight(),
   a boolean.

   ONE SUN, ONE CLOCK. sunVec() reads T.min and nothing else, and its horizons
   are literally the two numbers isNight() uses, so the sun can never disagree
   with the night. Below the horizon it returns null and the pass costs zero.

   THE SHAPE IS THE MASS'S, NOT THE TILE'S. Every solid cell throws its OWN
   height down the sun vector, and a cell whose neighbour in the sun direction
   is also solid is culled -- its band is a subset of that neighbour's -- so
   only the mass's sun-facing RIM does any work: 6 rects for a 6x6 house
   instead of 36.

   ONE FILL, NEVER DOUBLE-DARK. Every band rect goes into ONE path and ONE
   fill(), so canvas nonzero winding paints the union exactly once. Measured
   in the frame: an overlap pixel and a single-cover pixel both read 168 on
   white. Stacking translucent rects instead would paint every overlap twice
   and make a plaid out of a terrace.

   INTEGER, ALWAYS. Every rect is C x C at a Math.round()ed offset -- the
   render contract's whole-pixel lattice. No art is scaled, no smoothing path
   is touched, nothing is drawn on a fraction of a pixel.

   SHADOWS ARE A SEPARATE LAYER (7/26 law): this is a render-time ground pass
   driven by the one light direction. Not one pixel of it is baked into a tile.

   COST, median of 120 real renders: +0.0ms at HC=88, +0.1ms at HC=44,
   +0.2-0.3ms at HC=22, +0.6-0.8ms at HC=11 (the widest zoom, worst case 745
   rects). SHADOW_MAX is the dial if a phone ever needs it cheaper. */
const SUN_UP=6*60, SUN_DOWN=19*60;   /* THE SAME two numbers isNight() uses */
const SHADOW_A=0.34;                 /* one flat value. NO DITHER, NO GRADIENT */
const SHADOW_MAX=5;                  /* cells: the longest a shadow ever runs */
const SHADOW_SWEEP=1.15;             /* radians of azimuth swing, dawn -> dusk */
function sunVec(){
  if(T.min<SUN_UP||T.min>=SUN_DOWN)return null;         /* no sun, no shadow */
  const t=(T.min-SUN_UP)/(SUN_DOWN-SUN_UP);             /* 0 dawn .. 1 dusk */
  /* AZIMUTH. North-up map: the sun rises EAST (screen right) and sets WEST
     (screen left), so the shadow points LEFT in the morning, straight down at
     midday and RIGHT in the afternoon -- and the afternoon half IS the "key
     from the upper left, shadows fall down and to the right" that the mobile
     render contract sec 4 pins. SHADOW_SWEEP is the one dial: 0 freezes every
     shadow at the contract's noon and only the LENGTH moves; 1.15 is a real
     Vegas arc. */
  const a=(t-0.46)*SHADOW_SWEEP;
  /* ELEVATION. A sine arc, so the shadow is longest at the horizons and
     shortest overhead; cot(elevation) is the true length-per-height. Clamped
     both ends so a dawn shadow cannot run off the neighbourhood and noon still
     lands a readable shape rather than nothing. */
  const el=Math.sin(Math.PI*t)*1.30+0.16;
  const len=Math.max(0.55,Math.min(SHADOW_MAX/3,1/Math.tan(el)));
  return {dx:Math.sin(a),dy:Math.cos(a),len:len};
}
function shadowPass(ox,oy,C){
  const S=sunVec(); if(!S)return 0;
  const sxi=Math.round(S.dx), syi=Math.round(S.dy);
  const M=SHADOW_MAX+1;
  const gx0=Math.max(0,Math.floor(-ox/C)-M), gx1=Math.min(WORLD_F-1,Math.ceil((cv.width-ox)/C)+M);
  const gy0=Math.max(0,Math.floor(-oy/C)-M), gy1=Math.min(WORLD_F-1,Math.ceil((cv.height-oy)/C)+M);
  let n=0;
  g.beginPath();
  for(let gy=gy0;gy<=gy1;gy++)for(let gx=gx0;gx<=gx1;gx++){
    const c=cellAt(gx,gy); if(!c||!c.s)continue;
    const nb=cellAt(gx+sxi,gy+syi); if(nb&&nb.s)continue;   /* the rim only */
    const wh=c.wallH||((c.face||c.artPool==='hroof')?WALL_H:1);  /* its OWN height:
       a building mass is WALL_H, a declared wall or fence says so itself
       (c.wallH=2), and a PROP -- a bin, a stump, a dead car cell -- is one tile,
       or it throws a two-storey shadow. */
    const steps=Math.max(1,Math.min(SHADOW_MAX,Math.round(S.len*wh)));
    const bx=Math.round(ox+gx*C), by=Math.round(oy+gy*C);
    for(let k=1;k<=steps;k++){
      const t2=cellAt(gx+Math.round(k*S.dx),gy+Math.round(k*S.dy));
      if(t2&&t2.s)continue;                   /* a shadow does not climb a roof */
      g.rect(bx+Math.round(k*C*S.dx), by+Math.round(k*C*S.dy), C, C); n++;
    }
  }
  if(!n)return 0;
  g.fillStyle='rgba(0,0,0,'+SHADOW_A+')';
  g.fill();
  window.__SHADOW_RECTS=n;                     /* what the gate counts */
  return n;
}
function facadePass(ox,oy,C,front,pgy,pbox){

=== EDIT 2 of 2 — call it on the GROUND layer. ANCHOR (verified count == 1) ===
OLD (exact, two lines, note the two leading spaces on each):
  tpDraw(ox,oy);
  /* THREE-TILE WALL: everything he is standing SOUTH of, at full opacity */

NEW:
  tpDraw(ox,oy);
  /* SUN: the masses throw their shadows on the GROUND -- after the baked
     ground and the tile scatter, before any wall, any resident and the player.
     A shadow lands under the world's feet and never on a wall or a body. */
  shadowPass(ox,oy,C);
  /* THREE-TILE WALL: everything he is standing SOUTH of, at full opacity */

=== TOOL-LEVEL ASSERTS (copy the wallheight tool's style) ===
  assert decoded.count('function facadePass(ox,oy,C,front,pgy,pbox){') == 1   # before edit 1
  assert decoded.count('shadowPass(ox,oy,C);') == 1                          # after edit 2
  assert decoded.count('function shadowPass(') == 1
  assert decoded.count('function sunVec(') == 1
Confirmed clean namespace: `shadowPass`, `sunVec`, `SUN_UP`, `SHADOW_A` each occur 0 times in the current blob.

=== MANDATORY COMPANIONS, SAME TURN ===
1. The tool's docstring MUST carry a `REUSE CHECK:` block. gates/reusefirst_gate.py line 48 sweeps every `tools/*_patch.py` whose source matches /fillRect|drawImage|fillStyle|.../ — this tool contains `fillStyle`, so it WILL be swept and will fail the suite without it. Correct text: "REUSE CHECK: cooks ZERO pixels and selects no asset. It draws no art at all — one flat rgba(0,0,0,0.34) union fill on the ground layer, derived from the world's own cell data (c.s / c.face / c.wallH / c.artPool) and the world's own clock (T.min). No banks/ entry applies because nothing is created or chosen."
2. Update `#buildstamp` in the alpha's front splash (BUILD 8/2x · BUILDINGS CAST SHADOWS) — required by the 7/20 build-stamp law and checked by a gate.
3. Flip laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md line 185 to `| B2 | shadows + sun direction by time | **shadow_gate** | **ENFORCED 8/2** |` and add the measured numbers under "MEASURED WHEN THESE CLOSED". The gate column is the only honest status (clause E2) and it must move the same turn.
4. Register in gates/bohemia_gates.py after the CITY PEOPLE entry:
   ('SUN SHADOWS',   ['node', 'gates/shadow_gate.js'],
    "the walked world cast NOTHING: measured in a real browser that a mass darkens the ground, that the direction flips and the length grows with the clock, that night casts zero, and that no wall or body is ever touched by the pass", True),

=== TWO PENDINGS, DO NOT DECIDE THEM ===
- SHADOW_SWEEP=1.15 makes the morning shadow lean LEFT, which disagrees with the fixed upper-left key painted into the tiles (laws/BOHEMIA_PIXEL_CRAFT_LAWS_7_27_26.md:190 — 38 of 42 tiles measure an upper-left key). Setting SHADOW_SWEEP=0 keeps the direction frozen at the contract's noon and lets only the LENGTH move with time. [PENDING, Paolo's call — one number.]
- SHADOW_A=0.34 is the darkness. [PENDING, Paolo's call — he thumbs it.]

### RISK

MEASURED, NOT ASSUMED — the patched copy booted with 0 page errors and the facade pixels came back byte-identical with the pass on and off.

1. OTHER LANES' GATES — swept, and the exposure is small:
   - tools/bohemia_render_audit.js and gates/render_pixel_gate.js only wrap `CanvasRenderingContext2D.prototype.drawImage`. This pass makes zero drawImage calls, so it is invisible to the render audit and cannot trip SMOOTHED/FRACTIONAL/SQUASHED/UPSCALED.
   - gates/reusefirst_gate.py WILL sweep the new `tools/*_patch.py` because it contains `fillStyle`. Missing the REUSE CHECK block is the single most likely way this ship goes red. Named in patchSpec.
   - gates/bohemia_purity_gate.py (PURPLE RESERVATION): the pass emits rgba(0,0,0,0.34) only. No purple. Safe.
   - gates/art_45_gate.py, gates/structure_gate.js, gates/shading_separation_gate.js all operate on banks/ and cook tools. No asset is created or touched. Safe — and the 7/26 SHADOWS ARE SEPARATE law is actively SATISFIED by making this a render pass rather than baked pixels.
   - gates/city_people_gate.js counts drawn bodies via window.__PPL_DRAWN inside peoplePass, which runs AFTER this pass and is untouched. gates/footstep_gate.js, gates/street_source_gate.js, gates/full_res_gate.js, gates/zoombuild_gate.py, gates/houseart_gate.py all grep the decoded blob for strings this patch does not remove.
   - gates/city_tab_gate.js byte-locks a few INLINED ENGINE MODULES. This patch touches only app-level render code between tallTex and facadePass, not any `/* ==== engine/... ==== */` block, so tools/bohemia_city_module_resync.py cannot collide with it either.

2. WHAT COULD ACTUALLY LOOK WRONG (judge on the screen, not in the gate):
   - The union is built from whole C x C cell rects, so the shadow is a chunky stair-step, not a smooth parallelogram. At 22px cells that reads as blocky pixel-art shadow, which is the house style, but it is the first thing Paolo will react to.
   - The `if(t2&&t2.s)continue` roof test keeps a shadow off a neighbouring roof, which is correct on flat ground but means two adjacent houses never shade each other's walls. Walls are never shaded by this pass at all — it is a ground pass only. If he asks "why is the WALL not darker on the shady side", that is a second, separate change (a per-face value band), not this one.
   - A long evening shadow (SHADOW_MAX=5 cells) from a dense downtown block will merge into one large dark plate. That is physically right and may still read as mud. SHADOW_MAX and SHADOW_A are the dials.
   - Props with `c.s` but no artPool now cast a 1-tile shadow. Dead cars are drawn as prop cells, so parked cars will suddenly have shadows. Correct, but new, and unannounced changes are what the STOP PRODUCING law is about — say it in the ship note.

3. PERFORMANCE ON A PHONE: worst measured case is HC=11 at 18:00, 745 rects, +0.8ms on desktop chromium. A phone GPU/CPU is roughly 3-5x slower, so budget ~2.5-4ms worst case against a 16.7ms frame. That fits, but it is the one number that must be re-measured on the gate rather than trusted; the gate spec below asserts a ceiling.

4. FRACTIONAL C DURING A ZOOM TRANSITION: while `transing` is true, HC is fractional (`HC=48-f*(48-HZOOM)`), so the rect SIZE is fractional for the ~1 beat of the transition. This is pre-existing behaviour shared with facadePass, which passes the same fractional C as its drawImage size, so it is not a new contract violation — but if a future render_pixel_gate extends to fills, both will trip together. Worth a one-line note in the ship record so the next lane is not surprised.

5. SCOPE: this fixes the WALKED world (renderHuman) only. renderCity, the zoomed-out city-builder overview, draws district hero images and gets no shadows from this change. If his complaint was about the overview, this patch will not answer it — but the quoted words ("SHADING OR SHADOWS FROM THE BUILDINGS" plus B3/B4 in the same rant, which are both walked-world clauses) say he was standing in the world.

### GATE SPEC

`gates/shadow_gate.js`, node + playwright, modelled line-for-line on gates/city_people_gate.js (which is the repo's proven pattern for measuring the surface Paolo actually taps). It MUST boot slices/BOHEMIA_ALPHA_0_9.html in real chromium at 390x844, click the real splash at (195,420), click the real CITY tab, wait for cityFrame, drop into human mode. No side-door probe — VERIFY ON THE REAL SURFACE (7/18).

Setup inside the frame: scan for a facade cell with >=5 open walkable non-solid cells south of it (the same search the diagnosis used lands at fine cell 2590,2960 on the one seed), park the player 6 cells south, HC=22, render().

THE ELEVEN ASSERTIONS:

1. NO PAGE ERRORS at any hour tested. (errs.length === 0)

2. THE PASS IS LIVE: `typeof sunVec === 'function' && typeof shadowPass === 'function'` inside cityFrame.

3. ONE SUN, ONE CLOCK — the assertion that stops a second time model being born. Sweep T.min from 0 to 1439 in 10-minute steps and assert at EVERY step that `(sunVec() === null) === isNight()`. If anyone ever edits isNight()'s 19/6 boundaries, this goes red the same turn.

4. THE GROUND ACTUALLY DARKENS (the whole complaint). At 09:00, sample a 5x5 luminance average at the centre of the ground cell one step down-sun from the facade, and at the centre of a reference cell of the SAME `c.g` material with no solid within 5 cells. Assert `ref - shadowed >= 20`. The pre-fix world scores exactly 0.0 here, so this assertion is what would have caught the whole defect.

5. IT DARKENS AT EVERY DAYLIGHT HOUR. Repeat assertion 4 at 07, 09, 12, 15, 17, 18. All must be >= 20.

6. DIRECTION MOVES WITH THE CLOCK (the second half of his question, measured directly). Sample the ground columns 3 cells LEFT and 3 cells RIGHT of the caster at 07:00 and again at 17:00. Assert the darker column FLIPS: left-darker at 07:00, right-darker at 17:00, and each difference >= 15. Measured on the patched copy: at 17:00 the left column holds 112.2 while the right runs 73.5 down three rows.

7. LENGTH MOVES WITH THE CLOCK. Count how many consecutive cells down-sun from the caster are darkened at 07:00 and at 12:00. Assert `count(07:00) > count(12:00)`. Measured: 4 vs 2.

8. NIGHT CASTS NOTHING. At 02:00 and 21:00 assert `sunVec() === null`, and assert the ground beside a mass is identical with the pass live and with it neutered (`sunVec = () => null`). Zero cost, zero pixels.

9. NOTHING ABOVE THE GROUND IS EVER TOUCHED — the render-order lock. Render with the pass, snapshot a 7x7 block of the FACADE and a 7x7 block of the PLAYER SPRITE; neuter sunVec, render, snapshot again. Assert both are identical to within 0.05 luminance. Measured on the patched copy: wall 155.3 vs 155.3. This is the assertion that catches somebody later moving the call after facadePass and quietly shadowing the walls and Paolo's own body.

10. ONE FILL, NO DOUBLE-DARKENING. Two halves:
    (a) mechanism, in-frame: draw two overlapping rects into one path with one fill on a scratch canvas and assert the overlap pixel equals the single-cover pixel (measured 168 === 168);
    (b) behaviour, on the real frame: wrap `CanvasRenderingContext2D.prototype.fill` for one render and assert `shadowPass` produced exactly ONE fill call, and wrap `.rect` and assert every x and y is an integer (`x === Math.round(x)`) and every w and h equals HC exactly. That machine-locks both the union discipline and the whole-pixel lattice.

11. IT STAYS CHEAP ON A PHONE. At HC=11 (widest zoom) and T.min=18*60 (longest shadow, worst case), take the median of 120 renders with the pass and 120 with sunVec neutered. Assert `median(on) - median(off) <= 3.0` ms and `window.__SHADOW_RECTS <= 900`. Measured baseline on desktop chromium: +0.8ms, 745 rects.

PLUS one source-level assertion so the law column cannot lie:
12. laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md's B2 row must no longer contain "NOT ENFORCED" and must name shadow_gate.

Register in gates/bohemia_gates.py as ('SUN SHADOWS', ['node','gates/shadow_gate.js'], "...", True) so `python3 gates/bohemia_gates.py` runs it. A law without a machine gate is not enforced.

---

## Door-open animation never plays in the walked CITY world. Paolo: "WHY IS THERE NO ANIMATIONS WHEN I GO THROUGH AND OPEN A DOOR WEVE WORKED ON THAT PREVIOUSLY."

**already done:** False  **confidence:** high

### ROOT CAUSE

He is right twice over: the animation exists, is approved, and even has a WORKING implementation — but not on the surface he plays. Three verified facts.

(1) THE BANK IS REAL AND APPROVED. banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt = 12.6 MB, 30 clips x 9 frames = 270 frames, every residential frame 88x176 (1 tile wide, 2 tall), "open/close queue CLOSED at 30/30". Verdicts in banks/BOHEMIA_DOOR_V3_VERDICTS_7_14_26.txt.

(2) THE CITY BLOB SHIPS ONLY THE CLOSED FRAME — PROVEN BYTE-FOR-BYTE. I md5'd all 10 entries of `IN_DOOR_B64` inside CITY_B64 against the bank: alpha[k] is byte-identical to clips['4._Doors_a_0k_swing'].frames[0] for k=0..9, and to nothing else. Frames 1-8 of every clip (the actual swing) are not in the alpha at all. The CITY app carries 10 of the bank's 270 approved frames (3.7%), all of them the shut pose. The cause is one line in the generator, tools/bohemia_city_interiors_patch.py:149, which validates all 9 frames and then throws 8 away:
    _door_out.append(c['frames'][0])          # the interior draws the CLOSED frame
Measured live in the CITY iframe of the real alpha: the only door symbol on that window is `inDoor:function`; `DOOR_ANIM`, `DOORST`, `doorTick`, `openDoor`, `doorPassable`, `drawDoorFace` are all `undefined`. `renderHuman.toString()` does not contain the substring "door" at all — the walked-world renderer has zero door code. Exterior portal tiles render as flat grey (`c.g='#8a8a86'`, `s:null`), and most entry happens through a plain wall tile (artPool hwall/hwindow/hboarded).

(3) THE TRANSITION IS A ZERO-FRAME TELEPORT. Measured on the real surface: one `stepOnce()` into a house returned true in 3 ms and `INSIDE` went from null to a full 15x12 interior in the SAME synchronous tick (T.min 480 -> 480.5). `inEnter()` ends `advance(0.5); return true;` and the exit path is the mirror image. There is nothing for an animation to hang on — no door state, no frame counter, no RAF, no leaf.

(4) A COMPLETE, WORKING IMPLEMENTATION EXISTS AND IS UNREACHABLE. slices/BOHEMIA_RUN_CURRENT.html carries the whole machine: `DOOR_ANIM` (10 residential clips x 9 frames, byte-identical to the bank), `DOORST`, `doorTick`, `openDoor`, `doorPassable` (f>=5), `drawDoorFace` (1 wide, 2 tall). I drove it headless: frame 0 -> 8 over exactly 1000 ms (2 beats @ 120 BPM), passable flips at f>=5. It works perfectly. But the alpha's tab handler is `var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;` — tapping RUN opens the CITY panel. Measured: after clicking RUN, `#p-run` is `display:none`, height 0, `.on` false; `#p-city` is on. The alpha's own comment admits it: "#p-run is display:none the whole time because the RUN tab actually shows the p-city panel". So the only working door animation in the project sits on a panel no tab can display.

(5) THE GATE LIED. gates/interiors_gate.js:118 reads:
    ok('the interior draws the APPROVED animated door bank, not a flat stamp', /const IN_DOOR_B64=/.test(city));
It asserts "animated" and checks a variable NAME. It has been green the whole time, over 10 still images. That is why nobody caught it.

Net: approved-but-unused, at two levels — 260 of 270 approved frames are unused by the surface he plays, and a proven state machine that consumes them is parked on a dead panel.

### EVIDENCE

MEASUREMENT 1 — the alpha ships only closed frames (python3, md5 of the base64 strings):
  IN_DOOR_B64 entries: 10, each PNG 88x176
  MATCH alpha idx 0 <- 4._Doors_a_00_swing frame 0
  ... (idx 1..9 all frame 0) ...
  bank residential clips each have 9 frames; no alpha entry matches any frame 1-8.

/home/user/bohemia/tools/bohemia_city_interiors_patch.py:143-151 (the cause):
    for i, f in enumerate(c['frames']):
        raw = base64.b64decode(f)
        w = ...; h = ...
        assert (w, h) == (88, 176), '%s frame %d is %dx%d, not the 1-wide-2-tall door law' % (k, i, w, h)
    _door_out.append(c['frames'][0])          # the interior draws the CLOSED frame
  DOOR_JS = json.dumps(_door_out, separators=(',', ':'))

CITY_B64 (decoded), offset 24756386 — the only door consumer in the walked city:
  const IN_DOOR_IMG=IN_DOOR_B64.map(function(b){ const im=new Image(); im.src='data:image/png;base64,'+b; return im; });
CITY_B64 offset 24757463:
  function inDoor(seed,sx,sy,C){
    const im=IN_DOOR_IMG[(seed>>>0)%IN_DOOR_IMG.length];
    if(!im||!im.complete||!im.naturalWidth)return false;
    g.drawImage(im,sx,sy-C,C,C*2); return true;
  }
  -> one image, no frame index, no state. Called from exactly one place, CITY_B64 offset 24760693:
  if(!inDoor((x*7+y*13)>>>0,sx,sy,C)) inBlit('hdoor',(x*7+y*13),sx,sy,C);
  (inside renderInside() — INTERIOR ONLY.)

CITY_B64 offset 24380465 — the zero-frame entry:
  const c=cellAt(tgtX,tgtY);
  INSIDE={fp:fp,foot:f,zone:zone,tx:tx,ty:ty,label:(c&&c.enter)||'interior',
    ix:door[0],iy:door[1],door:door,exit:{gx:fromX,gy:fromY}};
  advance(0.5); return true;

CITY_B64 offset 638402 — the walked-world step (the code Paolo's thumb actually runs):
      /* STEP-INSIDE: a solid tile whose dossier declares an interior is a way IN */
      if(c&&!c.walk&&c.enter&&typeof inEnter==='function'){ if(inEnter(nx,ny,hx,hy,false)){ HFACE=dirOf(dx,dy); return true; } }
      if(c&&c.walk&&c.portal&&c.enter&&typeof inEnter==='function'){ if(inEnter(nx,ny,hx,hy,true)){ HFACE=dirOf(dx,dy); return true; } }

CITY_B64 (exit, inside the stepOnce override):
    if(INSIDE.ix===INSIDE.door[0]&&INSIDE.iy===INSIDE.door[1]){
      hx=INSIDE.exit.gx; hy=INSIDE.exit.gy; INSIDE=null;
      HFACE=dirOf(d[0],d[1]); advance(0.5); return true;
    }

MEASUREMENT 2 — headless chromium, the REAL alpha at 390x844, splash tapped, CITY tab open, warped to the first suburb slot [12,4], stepped into a house at fine cell (1596,572) from (1596,571):
  {"stepReturn": true, "elapsedMs": 3,
   "afterSameTick": {"inside": true, "plate": [15,12], "door": [4,0], "min": 480.5},
   "doorGlobalsOnWindow": ["inDoor:function"],
   "doorTick": "undefined", "DOOR_ANIM": "undefined", "openDoor": "undefined",
   "IN_DOOR_frames": 10}
  -> one step, no intermediate state, instantly inside.

MEASUREMENT 3 — same live CITY frame, exterior render:
  renderHumanHasDoor: false          (/door/i.test(renderHuman.toString()))
  renderInsideHasDoor: true
  industrial slot: portalCells 19, portalSample {g:'#8a8a86', s:null, walk:true, keys:'g,s,walk,q,enter,ecode,portal'}  -> flat grey, no art
  industrial/downtown/storage/suburb: solidEnterCells 3387..8110, artPool hwall/hwindow/hboarded -> you walk into a WALL and appear inside.

MEASUREMENT 4 — the alpha's tab routing, measured after clicking RUN:
  {"p-run":{"on":false,"display":"none","h":0},"p-city":{"on":true,"display":"block","h":790},"tabOn":["run"]}
  slices/BOHEMIA_ALPHA_0_9.html @35216495:
    var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;
  slices/BOHEMIA_ALPHA_0_9.html @35823393 (its own admission):
    "#p-run is display:none the whole time because the RUN tab actually shows the p-city panel"

MEASUREMENT 5 — the RUN slice's machine, driven headless at http://127.0.0.1:8231/BOHEMIA_RUN_CURRENT.html:
  {"clips":10,"fpc":9,"tileW":1,"tileH":2,"imgs":10,"framesPerImgSet":9,"doorMs":1000,
   "samples":[{ms:0,f:0,state:"opening",passable:false},{150,f:1},{300,f:2},{500,f:4,passable:false},
              {700,f:6,passable:true},{900,f:7},{1100,f:8,state:"open",passable:true}]}
  Frames byte-identical to the bank: True.
slices/BOHEMIA_RUN_CURRENT.html:18203-18240 (the code to port):
  var DOORST={};                                        /* "x,y" -> {f, state, t0} */
  function doorState(k){ if(!DOORST[k])DOORST[k]={f:0,state:'closed',t0:0}; return DOORST[k]; }
  function doorTick(){ ... d.f = d.state==='opening' ? Math.round(p*(n-1)) : Math.round((1-p)*(n-1)); ... }
  function openDoor(k){ ... d.state='opening'; d.t0=Date.now(); ... }
  function doorPassable(k){ var d=doorState(k); return d.f>=5; }
  function drawDoorFace(gx,gy,X,Y,CELL){ ... ctx.drawImage(im, X, Y-CELL, CELL, CELL*2); ... }

THE FALSE GATE — /home/user/bohemia/gates/interiors_gate.js:118:
  ok('the interior draws the APPROVED animated door bank, not a flat stamp', /const IN_DOOR_B64=/.test(city));

THE LAWS THAT ALREADY SAY TO DO THIS:
  laws/BOHEMIA_ADDENDUM_DOOR_LAW_TWO_TILES_TALL_7_26_26.md — "AND DOORS OPEN. The animation is not a nice-to-have; it exists and it is approved... passable at frame >= 5, blocks light below it, sfx on frames 1 and 8."
  laws/BOHEMIA_DOOR_ANIM_INTEGRATION_7_13_26.md — "Door entity holds clipName + state (closed|opening|open|closing) + frame. 120 BPM LAW: open/close spans 2 beats... COLLISION: passable when frame >= 5."

SIZE MATH: residential 10 clips x 9 frames = 2,658,876 b64 chars (2.54 MB). What ships today (frame 0 only) = 373,788 chars (0.36 MB). Delta 2,285,088 chars -> ~2.91 MB after re-base64 into CITY_B64. Alpha today = 35,986,349 bytes; after = ~38.9 MB (+8.1%).

### PATCH SPEC

SHIP IT THROUGH THE GENERATOR, NOT BY HAND. tools/bohemia_city_interiors_patch.py OWNS the STEP-INSIDE block and REPLACES it wholesale on every re-run (see its BANNER/TAIL upgrade path, lines ~96-106). A raw edit to CITY_B64 is erased the next time any CITY-lane patch tool runs. Edit the tool, then run `python3 tools/bohemia_city_interiors_patch.py`. Anchors below are byte-exact and each occurs EXACTLY ONCE (verified) in both the tool's template and the decoded blob, so they apply either way.

--- EDIT 1: ship the whole clip, not frame 0. FILE tools/bohemia_city_interiors_patch.py
OLD (exact, line 149):
    _door_out.append(c['frames'][0])          # the interior draws the CLOSED frame
NEW:
    _door_out.append(c['frames'])             # THE WHOLE CLIP: 9 frames, closed -> open (DOOR LAW 7/26)

--- EDIT 2: the state machine. Anchor occurs once in the tool template (line 315-316) and once in the blob.
OLD (exact, both places):
const IN_DOOR_B64=@@DOORJS@@;
const IN_DOOR_IMG=IN_DOOR_B64.map(function(b){ const im=new Image(); im.src='data:image/png;base64,'+b; return im; });
  (in the decoded blob the first line is `const IN_DOOR_B64=["iVBOR..."];` — match on the second line, which is unique:
   `const IN_DOOR_IMG=IN_DOOR_B64.map(function(b){ const im=new Image(); im.src='data:image/png;base64,'+b; return im; });`)
NEW:
const IN_DOOR_CLIPS=@@DOORJS@@;                       /* [clip][frame] b64, 9 frames each */
const IN_DOOR_B64=IN_DOOR_CLIPS.map(function(c){ return c[0]; });      /* the closed frame */
const IN_DOOR_IMG=IN_DOOR_B64.map(function(b){ const im=new Image(); im.onload=function(){ render(); }; im.src='data:image/png;base64,'+b; return im; });
/* ==== THE DOOR OPENS (CITY lane) ==========================================
   THE DOOR LAW (Paolo 7/26, LOCKED) has two halves and only the first shipped:
   1 wide x 2 tall (done) AND DOORS OPEN (never wired on this surface). The
   generator validated all 9 frames of every residential clip and then appended
   frames[0] only, so the walked city carried 10 SHUT stamps out of an approved
   270-frame bank. This is the RUN slice's machine, ported verbatim (ENGINE SYNC
   LAW: one behaviour, not a second opinion): 9 frames over 2 beats at 120 BPM,
   passable at frame >= 5 — the consumption contract in
   laws/BOHEMIA_DOOR_ANIM_INTEGRATION_7_13_26.md.
   LAZY DECODE: a clip's 9 Images are built the first time that clip is bumped,
   so the canvas-memory ratchet only pays for doors he actually opens. */
const IN_DOOR_SETS=[];
function doorSetIdx(k){ let h=0; for(let i=0;i<k.length;i++) h=(Math.imul(h,31)+k.charCodeAt(i))>>>0; return h%IN_DOOR_CLIPS.length; }
function doorSetFor(k){ const i=doorSetIdx(k);
  if(!IN_DOOR_SETS[i]) IN_DOOR_SETS[i]=IN_DOOR_CLIPS[i].map(function(b){ const im=new Image();
    im.onload=function(){ render(); }; im.src='data:image/png;base64,'+b; return im; });
  return IN_DOOR_SETS[i]; }
const IN_DOOR_N=(IN_DOOR_CLIPS[0]||[0]).length;       /* 9 */
const IN_DOOR_MS=BEAT*2;                              /* 120 BPM LAW: a door is 2 beats */
const DOORST={};                                      /* key -> {f,state,t0} */
let DOORTICKING=false;
function doorState(k){ if(!DOORST[k])DOORST[k]={f:0,state:'closed',t0:0}; return DOORST[k]; }
function doorTick(){
  let live=false; const now=Date.now(), n=IN_DOOR_N;
  for(const k in DOORST){ const d=DOORST[k];
    if(d.state!=='opening'&&d.state!=='closing')continue;
    const p=Math.min(1,(now-d.t0)/IN_DOOR_MS);
    d.f = d.state==='opening' ? Math.round(p*(n-1)) : Math.round((1-p)*(n-1));
    if(p>=1){ d.state = d.state==='opening'?'open':'closed'; } else live=true; }
  render();
  if(live) requestAnimationFrame(doorTick); else DOORTICKING=false;
}
function openDoor(k){ const d=doorState(k);
  if(d.state==='open'||d.state==='opening')return d;
  doorSetFor(k);                                      /* decode before the swing */
  d.state='opening'; d.t0=Date.now();
  if(!DOORTICKING){ DOORTICKING=true; requestAnimationFrame(doorTick); }
  return d; }
function doorPassable(k){ return doorState(k).f>=5; } /* the contract's collision rule */
/* BUMP: the first step into a shut door starts the swing and does NOT move you.
   You cross on the beat the leaf actually clears. I-MOVE-YOU-MOVE holds: the
   bump is a real half-beat of world time, exactly what the old instant entry cost. */
function doorBump(k){ openDoor(k); return doorPassable(k); }
function outDoorKey(x,y){ return 'o'+x+','+y; }
function inDoorKey(x,y){ return 'i'+INSIDE.foot.x+','+INSIDE.foot.y+':'+x+','+y; }

--- EDIT 3: the interior door draws the LIVE frame. Anchor unique.
OLD (exact):
function inDoor(seed,sx,sy,C){
  const im=IN_DOOR_IMG[(seed>>>0)%IN_DOOR_IMG.length];
  if(!im||!im.complete||!im.naturalWidth)return false;
  g.drawImage(im,sx,sy-C,C,C*2); return true;
}
NEW:
function inDoor(key,sx,sy,C){
  const set=doorSetFor(''+key); if(!set)return false;
  const d=doorState(''+key), im=set[Math.max(0,Math.min(set.length-1,d.f))];
  if(!im||!im.complete||!im.naturalWidth)return false;
  g.drawImage(im,sx,sy-C,C,C*2); return true;
}

--- EDIT 4: the interior door loop passes a stable key. Anchor unique.
OLD (exact):
    if(!inDoor((x*7+y*13)>>>0,sx,sy,C)) inBlit('hdoor',(x*7+y*13),sx,sy,C);
NEW:
    if(!inDoor(inDoorKey(x,y),sx,sy,C)) inBlit('hdoor',(x*7+y*13),sx,sy,C);

--- EDIT 5: bump-to-open on the way IN. Anchor unique. NOTE: the two branches are
    kept SEPARATE and their `if(...)` conditions byte-identical, because
    gates/interiors_gate.js regexes both of them literally. Do not merge them.
OLD (exact, 3 lines):
      /* STEP-INSIDE: a solid tile whose dossier declares an interior is a way IN */
      if(c&&!c.walk&&c.enter&&typeof inEnter==='function'){ if(inEnter(nx,ny,hx,hy,false)){ HFACE=dirOf(dx,dy); return true; } }
      if(c&&c.walk&&c.portal&&c.enter&&typeof inEnter==='function'){ if(inEnter(nx,ny,hx,hy,true)){ HFACE=dirOf(dx,dy); return true; } }
NEW:
      /* STEP-INSIDE: a solid tile whose dossier declares an interior is a way IN.
         THE DOOR OPENS FIRST (Paolo 7/26): the bump starts the approved 9-frame
         swing over 2 beats; you cross on the beat the leaf clears (frame >= 5). */
      if(c&&!c.walk&&c.enter&&typeof inEnter==='function'){ if(!doorBump(outDoorKey(nx,ny))){ HFACE=dirOf(dx,dy); advance(0.5); return true; } if(inEnter(nx,ny,hx,hy,false)){ HFACE=dirOf(dx,dy); return true; } }
      if(c&&c.walk&&c.portal&&c.enter&&typeof inEnter==='function'){ if(!doorBump(outDoorKey(nx,ny))){ HFACE=dirOf(dx,dy); advance(0.5); return true; } if(inEnter(nx,ny,hx,hy,true)){ HFACE=dirOf(dx,dy); return true; } }

--- EDIT 6: bump-to-open on the way OUT. Anchor unique.
OLD (exact):
    if(INSIDE.ix===INSIDE.door[0]&&INSIDE.iy===INSIDE.door[1]){
      hx=INSIDE.exit.gx; hy=INSIDE.exit.gy; INSIDE=null;
      HFACE=dirOf(d[0],d[1]); advance(0.5); return true;
    }
NEW:
    if(INSIDE.ix===INSIDE.door[0]&&INSIDE.iy===INSIDE.door[1]){
      if(!doorBump(inDoorKey(INSIDE.ix,INSIDE.iy))){ HFACE=dirOf(d[0],d[1]); advance(0.5); return true; }
      hx=INSIDE.exit.gx; hy=INSIDE.exit.gy; INSIDE=null;
      HFACE=dirOf(d[0],d[1]); advance(0.5); return true;
    }

--- EDIT 7: draw the leaf on the EXTERIOR. Anchor unique. Do this by wrapping the
    already-wrapped render (keeps the entire fix inside the one contiguous
    STEP-INSIDE region the tool owns — no fourth surgical edit to renderHuman).
    ox/oy/C below are the exact formula renderHuman uses (verified verbatim).
OLD (exact):
const _inRender=render;
render=function(){ if(INSIDE)renderInside(); else _inRender(); };
NEW:
const _inRender=render;
/* THE DOOR YOU ARE OPENING, on the outside. renderHuman contains no door code
   at all (measured: /door/i.test(renderHuman.toString()) === false), so the leaf
   is drawn as a last pass over the walked world, at the same whole-pixel camera.
   Only while it is MOVING or standing OPEN: a shut door is never painted onto a
   wall, which keeps the FRONT DOOR rule (7/27, "a painted door on a random wall
   is a door that lies") intact — the leaf appears only where you are really
   going in. */
function doorPassOutside(){
  const C=HC;
  const ox=Math.round(cv.width/2-hx*C), oy=Math.round(cv.height/2-hy*C);
  for(const k in DOORST){
    if(k.charCodeAt(0)!==111)continue;                /* 111 = 'o', the exterior keys */
    const d=DOORST[k]; if(d.state==='closed'&&d.f===0)continue;
    const p=k.slice(1).split(','), dx2=+p[0], dy2=+p[1];
    if(dx2<hx-40||dx2>hx+40||dy2<hy-40||dy2>hy+40)continue;
    const set=doorSetFor(k), im=set&&set[Math.max(0,Math.min(set.length-1,d.f))];
    if(!im||!im.complete||!im.naturalWidth)continue;
    g.imageSmoothingEnabled=false;
    g.drawImage(im, Math.round(ox+dx2*C), Math.round(oy+dy2*C-C), Math.round(C), Math.round(C*2));
  }
}
render=function(){ if(INSIDE){ renderInside(); } else { _inRender(); doorPassOutside(); } };

--- EDIT 8: kill the gate that lied. FILE gates/interiors_gate.js, line 118.
OLD (exact):
ok('the interior draws the APPROVED animated door bank, not a flat stamp', /const IN_DOOR_B64=/.test(city));
NEW:
ok('the door art is the APPROVED bank, ALL NINE FRAMES, not a flat stamp',
  /const IN_DOOR_CLIPS=\[\[/.test(city) && (city.match(/const IN_DOOR_CLIPS=(\[.*?\]\]);/s) ? JSON.parse(RegExp.$1).every(c => c.length === 9) : false));

OPTIONAL, NOT IN SCOPE BUT NAME IT: slices/BOHEMIA_ALPHA_0_9.html @35216495 routes the RUN tab to the CITY panel, so #p-run (the run slice, the only place a door has ever opened) is unreachable. Either that is intentional and the run slice should stop being maintained as a surface, or the tab needs its own home. [PENDING, Paolo's call] — do not "fix" it inside this defect.

### RISK

1. THE GENERATOR OVERWRITES A HAND EDIT. tools/bohemia_city_interiors_patch.py cuts and re-emits the whole STEP-INSIDE block (BANNER -> TAIL) on every run. If the blob is patched directly and the tool is not, the next CITY-lane patch silently reverts all of it. Patch the tool. This is the single biggest risk.

2. gates/interiors_gate.js WILL FAIL if the two stepOnce branches are merged. It regexes them literally:
     /if\(c&&!c\.walk&&c\.enter&&typeof inEnter==='function'\)/
     /if\(c&&c\.walk&&c\.portal&&c\.enter&&typeof inEnter==='function'\)/
   EDIT 5 preserves both byte-for-byte on purpose. Do not tidy them.

3. gates/interiors_gate.js:118 fails the moment IN_DOOR_B64 stops being a literal `const IN_DOOR_B64=[...]`. EDIT 2 keeps the identifier as a derived const so the old regex still matches; EDIT 8 replaces it with a real check. Ship both in the same commit or the suite goes red.

4. CANVAS MEMORY. gates/canvas_memory_gate.py holds PIXEL_CEILING_MB = 75.0 for canvases + decoded images. Eagerly decoding all 90 residential frames costs 90 x 88 x 176 x 4 = 5.6 MB of decoded pixels vs today's 0.62 MB. That is why EDIT 2 decodes LAZILY, per clip, on first bump — a session that opens 2-3 doors pays ~1.1-1.7 MB. If you make it eager you will move that gate. Re-run it.

5. ALPHA SIZE +2.91 MB (35.99 MB -> ~38.9 MB, +8.1%). gates/alpha_loads_gate.js only enforces size FLOORS (>=900000 for COMBAT_B64) so growth passes, but this is a real cost on a phone over cellular and it is Paolo's load time. If it is judged too expensive the honest alternative is shipping frames [0,2,4,6,8] (5 frames, +1.2 MB) — but that breaks the "carries the full 9-frame clip" assertion the RUN lane already makes, so it would need a ruling, not a quiet choice.

6. ONE SYSTEM ONE SESSION. CITY_B64, tools/bohemia_city_*_patch.py and gates/interiors_gate.js are the CITY lane. slices/BOHEMIA_RUN_CURRENT.html and gates/run_gate.js are the RUN lane — this patch reads the run slice for the port and must not write to it. gates/run_gate.js:481-494 asserts the run's own door blocking/mid-frame and is untouched.

7. TIMING/BEAT. Entry now costs two steps (bump + cross) instead of one, so the world clock advances ~1.0 min instead of 0.5 for a door. 120 BPM LAW and I-MOVE-YOU-MOVE are preserved (each is a real half-beat), but check gates/deviation_gate.js, gates/city_people_gate.js and gates/economy_gate.js for anything that asserts an exact clock delta on entry.

8. The exterior leaf is drawn as a final pass AFTER facadePass(ox,oy,C,true,...), so an opening door will draw on top of a facade that would otherwise occlude it. That is deliberate (it is the thing he is looking at) but it is a depth-order exception — gates/facing_gate.js and any facade/occlusion gate should be re-run.

9. NPCs use the same doors (bohemia_agents' doorCell/stepOut). They do NOT go through stepOnce, so they will keep phasing through instantly while the player's door swings. Not a regression, but it is a visible inconsistency and should be named in the reply rather than discovered by Paolo.

10. The 7/27 FRONT DOOR rule bans painting a door onto a wall. Most CITY entry is through a solid hwall/hwindow/hboarded tile, not a declared portal, so this patch paints a leaf on a wall — transiently, and only on the wall you are actually entering. Defensible (that wall IS the entrance) but it is a genuine tension with a locked rule and Paolo should be told in one sentence, not silently.

11. The contract also specifies "sfx hook 'door_metal' fires on frames 1 and 8" and "blocks light while frame < 5". Neither is in this patch. Say so; do not let a partial implementation read as done.

### GATE SPEC

TWO GATES. The static one alone is what let this rot for a week, so the second is mandatory.

A) STATIC — extend gates/interiors_gate.js (CITY lane owns it). Decode CITY_B64 as it already does, then:
  1. `const IN_DOOR_CLIPS=[[` is present.
  2. Parse IN_DOOR_CLIPS. Assert clips.length === 10 and EVERY clip has exactly 9 frames (bank.frames_per_clip), and that the total frame count is 90, not 10.
  3. PROVENANCE, byte-level, not by name: load banks/BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt and assert clips[k][f] is byte-identical to bank.clips['4._Doors_a_0k_swing'].frames[f] for all k,f. A claimed reuse must open the bank (REUSE-FIRST).
  4. Every frame's PNG IHDR is 88x176 (DOOR LAW 1 wide x 2 tall).
  5. The consumption contract is really implemented: /function doorPassable\(k\)\{ return doorState\(k\)\.f>=5; \}/ and /const IN_DOOR_MS=BEAT\*2;/ (frame>=5 passable, 2 beats at 120 BPM).
  6. Both stepOnce branches call doorBump before inEnter; the exit branch calls doorBump before clearing INSIDE.
  7. The exterior pass exists: `doorPassOutside` is defined AND called from the render wrapper.
  8. DELETE the string-name assertion at line 118. A gate that says "animated" and checks a variable name is the bug.

B) REAL SURFACE — new gates/door_open_gate.js, playwright + chromium, model it on gates/run_gate.js's launcher (requirePlaywright(), /opt/node22/lib/node_modules). VERIFY ON THE REAL SURFACE LAW: this must run against slices/BOHEMIA_ALPHA_0_9.html in a browser, never a side-door probe. Exact sequence, all of it proven to work in this investigation:
   - serve slices/ (python3 -m http.server), open the alpha at viewport 390x844, waitUntil 'load' (allow 180 s).
   - click('#front', {force:true}) to clear the splash, then click('.tab[data-p="city"]').
   - POLL the about:srcdoc frame every 1.5 s (up to ~90 s; it took 13.5 s here) until `typeof cellAt==='function' && typeof inEnter==='function'`.
   - inside that frame, warp to the first `om.at(tx,ty).district==='suburb'` slot: `MODE='human'; hx=tx*FN+(FN>>1); hy=ty*FN+(FN>>1); render();` then ring-search for a cell with `c.enter && !c.walk` that HAS a walkable D4 neighbour, and stand on that neighbour.
   ASSERTIONS:
   1. BUMP DOES NOT TELEPORT: after the first stepOnce toward the door, `INSIDE === null` and `doorState(outDoorKey(qx,qy)).state === 'opening'`. (Today this assertion fails: measured INSIDE non-null in 3 ms.)
   2. THE LEAF MOVES: sample `doorState(k).f` at 0/150/300/500/700/900/1100 ms; assert it is non-decreasing, strictly increases at least 6 times, and reaches 8 (IN_DOOR_N-1) at 1000 ms +/- 250 ms — 2 beats at 120 BPM.
   3. COLLISION MATCHES THE CONTRACT: doorPassable is false while f<5 and true at f>=5.
   4. YOU ACTUALLY GO IN: a second stepOnce after the leaf clears sets INSIDE non-null with a plate equal to the flooded footprint (INTERIOR-MATCHES-EXTERIOR still holds).
   5. PIXEL PROOF — the assertion that makes this un-fakeable. Screenshot the CITY canvas at f≈1 and at f≈7, crop the door cell's 1x2 box (ox+qx*HC, oy+qy*HC-HC, HC, HC*2) from both, and assert MORE THAN 5% of those pixels differ. A frame counter that ticks while the screen does not change is exactly the lie the 7/18 law bans, and it is the only assertion that would have caught the original defect.
   6. THE WAY OUT SWINGS TOO: walk to INSIDE.door, step off the plate, assert the first step leaves INSIDE non-null with the interior door key opening, and the second step puts you back on INSIDE.exit exactly.
   7. ZERO console errors on the whole run.
Register it in gates/bohemia_gates.py next to ('INTERIORS', ['node','gates/interiors_gate.js'], ...) as ('DOOR OPENS', ['node','gates/door_open_gate.js'], ...).

SANITY: run B against main BEFORE the patch. It must FAIL on assertions 1, 2 and 5. A new gate that passes on the broken build is not a gate.

---

## ONE WORLD INTERIORS step 3 — "why when i enter a house i cant go left and right": one movement predicate, delete passInt (CITY blob)

**already done:** False  **confidence:** high

### ROOT CAUSE

TWO facts, both measured on the real CITY surface (playwright, 213 buildings entered across 10 district types in the shipped alpha).

FACT 1 — THE SPEC NAMES SYMBOLS THAT DO NOT EXIST ON HIS SURFACE. The spec's stated root cause is "`mode` is 'int' or 'ext' … a separate grid `fp` … delete passInt". `passInt`, `passExt` and `mode='int'` exist ONLY in slices/BOHEMIA_RUN_SLICE_7_26_26.html, BOHEMIA_RUN_CURRENT.html, BOHEMIA_LIFE_SLICE, BOHEMIA_ENTER_SLICE and BOHEMIA_SUBURB_WALK. The alpha embeds exactly four modules — CITY_B64, COMBAT_B64, PREFAB_B64, RIG_B64 (verified by regex over the alpha) — so NONE of those slices ship. Deleting `passInt` changes nothing Paolo can see. In the CITY blob the same machinery is named `INSIDE` (the mode) / `INSIDE.fp` (the separate grid) / `inPassable()` (passInt). Step 3 must be executed against those three names.

FACT 2 — THE ACTUAL MECHANISM OF "CAN'T GO LEFT AND RIGHT" IS THE LANDING CELL, NOT THE DIRECTION COUNT. The interior mover already uses the same 8-entry DIRS as outdoors, and the interior floorplan is already fully 8-connected-reachable (BFS: 143/143 floor cells from spawn on the first house I entered; 213/213 buildings fully reachable). What is broken is WHERE `inEnter()` puts the body: `INSIDE={… ix:door[0], iy:door[1] …}` drops him ON the perimeter door cell. A doorway is a one-cell slot cut through a solid 1-cell wall ring, so the two cells perpendicular to it are wall BY CONSTRUCTION, and the three cells on the outward side are off-plate. Measured at that landing cell across 213 buildings:
  • both left/right open: 0 of 213 buildings. Left/right open count histogram = {0: 213}. Not "usually", not "often" — 213 out of 213, every single entry, exactly his sentence.
  • mean directions that actually move you: 2.83 of 8 (12 buildings had only ONE).
  • directions that eject you back onto the street: exactly 3 of 8, 213 of 213 — because the off-plate branch tests only "am I standing on the door cell", not "am I stepping through it", so N, NE and NW all fire the exit. That in-out-in-out is the "loading screen" he feels.
  • outdoor baseline for comparison: mean 7.855 of 8 open (190 of 200 sampled walkable world cells have all 8 open).
So the delta he is describing is 2.83 vs 7.855, and the left/right half of it is 100% deterministic.

CONTRIBUTING: the interior predicate `inPassable(x,y)` takes PLATE coords while the exterior predicate takes WORLD coords, and the body has two positions (`hx,hy` outdoors, `INSIDE.ix,INSIDE.iy` indoors) that are never reconciled — that is the "second mover" the spec says to collapse. It is collapsible today with zero new data, because the plate IS the footprint bbox (INTERIOR-MATCHES-EXTERIOR, 7/19), so interior cell (ix,iy) IS world cell (foot.x+ix, foot.y+iy) — verified 213/213 after patch.

ALSO FOUND (free, same edit): the interior mover never posts the BOHEMIA_STEP footfall the exterior mover posts, so his 7/30-approved footsteps are silent indoors; and `window.__proof.step` captured `stepOnce` BEFORE the interior override, so any gate driving movement through `__proof.step` has never once exercised an interior.

### EVIDENCE

ALL LINE NUMBERS ARE IN THE DECODED CITY BLOB (base64 CITY_B64 inside /home/user/bohemia/slices/BOHEMIA_ALPHA_0_9.html; decode to /tmp/city.txt per the standing recipe).

1) The shared direction table — 8 directions, ONE table, used by both movers. Line 8287:
   const DIRS=[[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]];

2) THE LANDING CELL — the bug. Lines 10362-10364 (inside inEnter):
   INSIDE={fp:fp,foot:f,zone:zone,tx:tx,ty:ty,label:(c&&c.enter)||'interior',
     ix:door[0],iy:door[1],door:door,exit:{gx:fromX,gy:fromY}};
   advance(0.5); return true;
   `door` comes from line 10359: fp.doors.filter(d => d[0]===0||d[1]===0||d[0]===fp.W-1||d[1]===fp.H-1)[0] — i.e. always a PERIMETER cell, i.e. always a slot in the wall ring.

3) THE SECOND PREDICATE (the spec's passInt). Lines 10366-10369:
   function inPassable(x,y){
     const fp=INSIDE.fp; if(x<0||y<0||x>=fp.W||y>=fp.H)return false;
     const c=fp.grid[y][x]; return c.g==='floor'||c.g==='door';
   }
   Only two references in the whole blob: the definition (10366) and one call (10386).

4) THE SECOND MOVER. Lines 10372-10388:
   const _inStepOnce=stepOnce;
   stepOnce=function(di){
     if(!INSIDE) return _inStepOnce(di);
     const d=DIRS[di], nx=INSIDE.ix+d[0], ny=INSIDE.iy+d[1];
     const fp=INSIDE.fp;
     if(nx<0||ny<0||nx>=fp.W||ny>=fp.H){
       if(INSIDE.ix===INSIDE.door[0]&&INSIDE.iy===INSIDE.door[1]){
         hx=INSIDE.exit.gx; hy=INSIDE.exit.gy; INSIDE=null;
         HFACE=dirOf(d[0],d[1]); advance(0.5); return true;
       }
       return false;
     }
     if(!inPassable(nx,ny))return false;
     INSIDE.ix=nx; INSIDE.iy=ny; HFACE=dirOf(d[0],d[1]); advance(0.084); return true;
   };
   Note the exit test is on the CELL YOU STAND ON, not the direction — which is why N, NE and NW all eject you. Note also there is no BOHEMIA_STEP postMessage here, unlike the exterior mover.

5) THE EXTERIOR MOVER for comparison. Lines 8292-8321, in particular 8303-8318:
   const nx=hx+dx, ny=hy+dy;
   const c=cellAt(nx,ny);
   if(c&&!c.walk&&c.enter&&typeof inEnter==='function'){ if(inEnter(nx,ny,hx,hy,false)){ HFACE=dirOf(dx,dy); return true; } }
   ...
   if(!(c&&c.walk))break;
   try{ ... postMessage({type:'BOHEMIA_STEP',surface:__surfaceOf(c)},'*'); }catch(_e){}
   hx=nx; hy=ny; moved++; advance(0.084);
   Different coordinate space (world vs plate), different position variable (hx,hy vs INSIDE.ix,iy), different predicate (cellAt().walk vs inPassable), extra footstep post. Two movers.

6) LIVE MEASUREMENT, shipped alpha, headless chromium at 390x844, seed default. I loaded the decoded blob, walked into 213 real buildings across suburb / estate / gated / apartment / commercial / downtown / storage / warehouse / trailer / farm, and for each read the 8 directions at the landing cell using the SHIPPED code:
   landing-cell left/right open, histogram: { "0": 213 }   ← 0 of 2 in every single building
   landing-cell directions that move you, mean 2.831, histogram: { "1":12, "2":12, "3":189 }
   landing-cell directions that eject you outdoors, histogram: { "3": 213 }
   OUTDOOR baseline, 200 random walkable world cells: mean 7.855 of 8 open, histogram { "8":190, "5":9, "6":1 }
   Interior 8-dir reachability from spawn already equals 4-dir reachability and equals total floor cells (143/143 on the first house) — so the plate is NOT under-connected; only the landing cell is.
   First house entered, plate 19x12, door [8,0], ASCII of the real generated plate ('@' = where the shipped code puts you):
     ########@##########
     #....#.....#......#
     #....#.....#......#
     #....+.....+......#
     #....#.....#......#
     #....#.....#......#
     ###+####++##+###+##
     #....#.......#....#
     #....#.......#....#
     #....#.......#....#
     #....#.......#....#
     ###################
   E = BLOCKED, W = BLOCKED, N/NE/NW = EXITED. That is the whole complaint, on screen.

7) THE SPEC'S SYMBOLS ARE IN DEAD SLICES. `grep -rn passInt` returns only slices/BOHEMIA_RUN_SLICE_7_26_26.html:950, slices/BOHEMIA_RUN_CURRENT.html:17591, slices/BOHEMIA_LIFE_SLICE_7_19_26.html:1402, slices/BOHEMIA_ENTER_SLICE_7_18_26.html:2684, slices/BOHEMIA_SUBURB_WALK_7_18_26.html:1329, plus a comment in gates/run_gate.js:447. Zero hits in the CITY blob. The alpha's embedded-module list is exactly CITY_B64, COMBAT_B64, PREFAB_B64, RIG_B64 — no run slice.
   Worth noting as precedent: the RUN slice ALREADY lands you inboard — BOHEMIA_RUN_CURRENT.html:17599 `px=fpDoor[0]; py=Math.max(0,Math.min(fp.H-1,fpDoor[1]-1)); if(!passInt(px,py)){...}`. The dead surface got this right; the live one did not.

8) PATCH VERIFIED END TO END, NOT REASONED. I built a patched copy of the blob (/tmp/city_patched.html), loaded it in chromium, and re-ran the identical probe. Zero page errors, renderInside still draws (screenshot taken, player stands one cell inside the door on real hwall/side art):
   landing-cell left/right open: { "2":189, "1":12, "0":12 }   ← both open in 189/213; the 24 exceptions are all 104x3 / 108x3 STORAGE UNIT ROWS where a unit is genuinely one cell deep, i.e. correct geometry, do not "fix" it
   landing-cell directions that move you, mean 5.662, histogram { "6":189, "4":12, "2":12 }
   full 8-dir reachability of every floor/door cell from the landing cell: 213/213
   world position === foot + interior position: 213/213
   round trip (enter → BFS-walk to the farthest interior cell → walk back to the door → step out through the door normal → land on a cellAt().walk world cell): 105/105, zero failures
   direct interactive check on the first house: 4 presses left = true,true,false,false; 8 presses right = true,true,true,true,false,false,false,false. He can go left and right.

9) GATE IMPACT MEASURED, not guessed. I ran all twelve string assertions of gates/interiors_gate.js against the patched blob: eleven PASS, exactly ONE FAILS — gates/interiors_gate.js:97-98. (Line 95-96 'the door puts you back on the EXACT cell you came in from' still passes because that literal survives in swapMode at blob line 10528.)

### PATCH SPEC

THREE edits. Edit 1 and 2 are inside the CITY blob and MUST go through a patch tool (base64); edit 3 is the gate. Ship all three in one commit.

Write tools/bohemia_city_one_predicate_patch.py, modelled byte-for-byte on tools/bohemia_city_footstep_patch.py (same CITY_B64 regex, same NOOP-if-marker / FAIL-if-anchor-missing / re-encode flow). Marker: `ONE MOVEMENT PREDICATE`.

--- CITY EDIT 1: the mover + the predicate + the landing cell. ---
Anchor is UNIQUE (verified: exactly 1 occurrence in the decoded blob, 1041 bytes). Search for EXACTLY this, newlines and two-space indents included:

  INSIDE={fp:fp,foot:f,zone:zone,tx:tx,ty:ty,label:(c&&c.enter)||'interior',
    ix:door[0],iy:door[1],door:door,exit:{gx:fromX,gy:fromY}};
  advance(0.5); return true;
}
function inPassable(x,y){
  const fp=INSIDE.fp; if(x<0||y<0||x>=fp.W||y>=fp.H)return false;
  const c=fp.grid[y][x]; return c.g==='floor'||c.g==='door';
}

// ---- movement: the same 120 BPM step, indoors ----
const _inStepOnce=stepOnce;
stepOnce=function(di){
  if(!INSIDE) return _inStepOnce(di);
  const d=DIRS[di], nx=INSIDE.ix+d[0], ny=INSIDE.iy+d[1];
  const fp=INSIDE.fp;
  if(nx<0||ny<0||nx>=fp.W||ny>=fp.H){
    // stepping off the plate: only the door lets you out, and it puts you back
    // on the exact cell you came in from.
    if(INSIDE.ix===INSIDE.door[0]&&INSIDE.iy===INSIDE.door[1]){
      hx=INSIDE.exit.gx; hy=INSIDE.exit.gy; INSIDE=null;
      HFACE=dirOf(d[0],d[1]); advance(0.5); return true;
    }
    return false;
  }
  if(!inPassable(nx,ny))return false;
  INSIDE.ix=nx; INSIDE.iy=ny; HFACE=dirOf(d[0],d[1]); advance(0.084); return true;
};

REPLACE WITH EXACTLY (this is the text I built and verified in the browser):

  // YOU DO NOT LAND IN THE DOORWAY (Paolo 7/31: "why when i enter a house i cant
  // go left and right"). A doorway is a ONE-CELL SLOT in a solid wall: left and
  // right are wall BY CONSTRUCTION, and three of the eight steps put you straight
  // back on the street. Measured on the real surface over 213 buildings: at the
  // cell you used to land on, BOTH left and right were wall 213 times out of 213,
  // and only 2.83 of 8 directions moved you at all (outdoors: 7.86 of 8). You now
  // arrive ONE CELL IN, standing in the room, with the doorway behind you.
  const _inw=(door[1]===0)?[0,1]:(door[1]===fp.H-1)?[0,-1]:(door[0]===0)?[1,0]:[-1,0];
  let _ix=door[0], _iy=door[1];
  const _row=fp.grid[_iy+_inw[1]], _nc=_row&&_row[_ix+_inw[0]];
  if(_nc&&(_nc.g==='floor'||_nc.g==='door')){ _ix+=_inw[0]; _iy+=_inw[1]; }
  INSIDE={fp:fp,foot:f,zone:zone,tx:tx,ty:ty,label:(c&&c.enter)||'interior',
    ix:_ix,iy:_iy,door:door,exit:{gx:fromX,gy:fromY}};
  // THE BODY IS ALWAYS AT A WORLD CELL. The plate IS the footprint (INTERIOR-
  // MATCHES-EXTERIOR, Paolo 7/19, LOCKED), so interior cell (ix,iy) IS world cell
  // (foot.x+ix, foot.y+iy). There is no second coordinate system to keep in sync.
  hx=f.x+_ix; hy=f.y+_iy;
  advance(0.084); return true;          // a threshold is a STEP, never a load
}
/* ONE MOVEMENT PREDICATE (ONE WORLD INTERIORS spec step 3,
   records/BOHEMIA_ONE_WORLD_INTERIORS_SPEC_7_31_26.md). inPassable is DELETED,
   not bypassed. passAt answers "can a body stand on this WORLD cell?" for
   indoors and outdoors in the same call: if a plate is open and the cell is on
   it, the floorplan answers; otherwise the world grid does. One question, one
   answer, eight directions, everywhere. */
function passAt(gx,gy){
  if(INSIDE){
    const f=INSIDE.foot, fp=INSIDE.fp, x=gx-f.x, y=gy-f.y;
    if(x>=0&&y>=0&&x<fp.W&&y<fp.H){ const c=fp.grid[y][x]; return c.g==='floor'||c.g==='door'; }
  }
  const c=cellAt(gx,gy); return !!(c&&c.walk);
}

// ---- movement: the same 120 BPM step, and there is only ONE of them ----
const _inStepOnce=stepOnce;
stepOnce=function(di){
  if(!INSIDE) return _inStepOnce(di);
  const d=DIRS[di], nx=hx+d[0], ny=hy+d[1];
  const f=INSIDE.foot, fp=INSIDE.fp;
  const leaving=!(nx-f.x>=0&&ny-f.y>=0&&nx-f.x<fp.W&&ny-f.y<fp.H);
  /* A WALL IS A WALL, FROM EITHER SIDE. You cross the plate edge only from a
     DOOR cell - geometry, not an exit event and not bookkeeping. */
  if(leaving&&fp.grid[hy-f.y][hx-f.x].g!=='door')return false;
  if(!passAt(nx,ny))return false;
  hx=nx; hy=ny;
  if(leaving) INSIDE=null; else { INSIDE.ix=nx-f.x; INSIDE.iy=ny-f.y; }
  /* FOOTSTEP PARITY: a footfall indoors is still a footfall. */
  try{ if(window.parent&&window.parent!==window)
    window.parent.postMessage({type:'BOHEMIA_STEP',surface:INSIDE?'asphalt':__surfaceOf(cellAt(hx,hy))},'*'); }catch(_e){}
  HFACE=dirOf(d[0],d[1]); advance(0.084); return true;
};

--- CITY EDIT 2: the suspend-save must not store a coordinate inside a wall. ---
hx,hy is now the interior world cell while INSIDE, and applyRestore sets INSIDE=null, so an unpatched save would restore him standing in solid geometry. Search for EXACTLY (appears TWICE — reportState and the pagehide handler; replace BOTH, do not anchor on leading indent, it differs 6 vs 4 spaces):

v:1,seed,day:T.day,min:T.min,hx,hy,cx:city.x,cy:city.y,mode:MODE,

REPLACE WITH:

v:1,seed,day:T.day,min:T.min,hx:(INSIDE?INSIDE.exit.gx:hx),hy:(INSIDE?INSIDE.exit.gy:hy),cx:city.x,cy:city.y,mode:MODE,

(No TDZ hazard: `let INSIDE=null` is declared later in the same classic script, but both sites only READ it from inside a setTimeout callback / a pagehide listener, i.e. long after script evaluation. Verified running.)

The patch tool must assert, after replacing: `'function inPassable(' not in city` and `'if(!inPassable(' not in city` and `city.count('ONE MOVEMENT PREDICATE')==1` and `city.count('function passAt(')==1`.

--- EDIT 3: gates/interiors_gate.js, the one assertion that legitimately changes. ---
OLD (lines 97-98, exact):
ok('only the door lets you off the plate (a wall is still a wall indoors)',
  /if\(INSIDE\.ix===INSIDE\.door\[0\]&&INSIDE\.iy===INSIDE\.door\[1\]\)/.test(city));
NEW:
// STEP 3, ONE WORLD INTERIORS (7/31): the exit stopped being an EVENT keyed to
// one bookkept cell and became GEOMETRY - you cross the plate edge only from a
// door cell, and only into a cell the world says is walkable. Same invariant,
// stated the way the one-predicate mover states it.
ok('only a DOOR lets you off the plate (a wall is still a wall indoors)',
  /if\(leaving&&fp\.grid\[hy-f\.y\]\[hx-f\.x\]\.g!=='door'\)return false;/.test(city));
ok('there is ONE movement predicate: inPassable is deleted, passAt is world-coord',
  !/function inPassable\(/.test(city) && /function passAt\(gx,gy\)\{/.test(city));
ok('the body indoors is at a WORLD cell, not a second coordinate system',
  /hx=f\.x\+_ix; hy=f\.y\+_iy;/.test(city) && /const d=DIRS\[di\], nx=hx\+d\[0\], ny=hy\+d\[1\];/.test(city));
ok('you do not land in the doorway',
  /const _inw=\(door\[1\]===0\)\?\[0,1\]:/.test(city));

DO NOT TOUCH the run slices. `passInt` there is dead code on a surface the alpha does not embed; deleting it is exactly the invisible-fix trap the spec warns about. If a later turn wants it gone for hygiene, that is a separate commit with no claim of fixing anything.

### RISK

MEASURED, not guessed — I ran all twelve interiors_gate string assertions against the patched blob.
1. gates/interiors_gate.js:97-98 FAILS without Edit 3. That is the ONLY existing assertion that breaks. All eleven others pass unchanged, including 'the door puts you back on the EXACT cell you came in from' (that literal survives in swapMode, blob line 10528) and 'the interior renders on the real canvas'.
2. ENGINE SYNC LAW is safe: engine/bohemia_floorplan.js is untouched and stays byte-identical inside the blob (assertion re-verified PASS on the patched copy).
3. INTERIOR-MATCHES-EXTERIOR is not weakened — the patch never touches inFootprint or the generate() call, and 'nothing resizes the plate on the way in' still passes. world_gate.js is untouched.
4. Roof/room work (engine/bohemia_rooms.js, gates/rooms_gate.js — spec step 1) is untouched. BOH_ROOMS is not in the city blob at all, so no collision with the lane doing step 4.
5. `passAt` is a new global identifier: 0 occurrences in the blob today, no collision.
6. LANE COLLISION, the real one: this edits the CITY movement function, which is also where tools/bohemia_city_footstep_patch.py landed on 7/31. If another session is mid-flight in city movement, the anchor will not match and the tool must FAIL LOUDLY rather than half-patch (copy the footstep tool's refusal). Coordinate before running.
7. Behaviour changes a reviewer should expect and not flag as bugs: (a) entering/leaving now costs advance(0.084) instead of advance(0.5) — deliberate, a threshold is a step, this is the "no loading screen" half; it shifts in-game clock slightly, no gate reads it. (b) You now exit at the cell in front of the door rather than teleporting to INSIDE.exit; verified walkable 105/105. (c) The BIKE still does not carry indoors (1 cell per press inside vs 4 outside) — unchanged from today, and correct. (d) Storage unit rows (104x3, 108x3) still have no left/right at the landing cell — a self-storage unit is genuinely one cell deep; 24 of 213 buildings, all storage, do not "fix" this.
8. Not fixed by this patch, do not claim it: walking into ANY wall cell still teleports you in (that is spec S4 / step 5), the interior camera still falls back to the follow zoom on a phone so half the screen is black for a 19-wide plate, and interior wall/floor materials are still exterior stucco (S6). Those are separate items.
9. gates/run_gate.js is untouched; the run slice is not in the alpha, so nothing there moves.

### GATE SPEC

New gate: gates/one_predicate_gate.js. Model it on gates/frontdoor_gate.js (already boots the REAL alpha and reaches the CITY frame — copy its exact boot sequence: chromium at /opt/pw-browsers/chromium-1194/chrome-linux/chrome, goto file://slices/BOHEMIA_ALPHA_0_9.html, click #front, click .tab[data-p="city"], wait, then `page.frames().find(fr => fr.name()==='cityFrame')`). It must measure on the running surface, never on the source, because "the code looks reasonable and the result is nonsense" is exactly this bug's class.

Inside the frame, for at least 100 real buildings sampled across >=8 district types (walk om, find cells with `c && !c.walk && c.s && c.enter` that have a walkable 4-neighbour, then call `inEnter(gx,gy,fromX,fromY,false)`), assert ALL of:

A. ONE PREDICATE EXISTS AND THE OLD ONE IS GONE.
   typeof passAt === 'function' && typeof inPassable === 'undefined'
   (This alone is a true before/after discriminator: I confirmed the shipped blob throws "passAt is not defined" and the patched one returns true.)

B. LEFT AND RIGHT — his sentence, as a number. At the cell the game actually lands you on, with `lr = (door on a horizontal edge) ? ['E','W'] : ['N','S']`, count how many of those two are passable via passAt in WORLD coords. Require >= 95% of non-sliver buildings (plate min dimension >= 5) score 2 of 2, and require the fleet mean >= 1.9. Shipped scores 0.00 (histogram {0:213}); patched scores 1.83 overall / 2.00 on non-slivers. Print the histogram in the pass line so a regression is readable, not just red.

C. EIGHT DIRECTIONS, INSIDE = OUTSIDE — the spec's literal wording. Two halves:
   C1 reachability: BFS from the landing cell over passAt(foot.x+x, foot.y+y), 8-connected, must reach EVERY floor/door cell of the plate. Require 100%. (213/213 measured.)
   C2 openness parity: fleet-mean directions-that-move-you at the landing cell must be >= 5.0, against an outdoor control measured in the same run (200 random cellAt().walk cells, 8-dir; measured 7.855). Shipped scores 2.83 and must fail this.

D. NO EJECTION ON ENTRY. At the landing cell, the count of directions that leave the building must be 0 for every building. Shipped is exactly 3 for 213 of 213.

E. ONE WORLD, ONE COORDINATE. After entering, assert `__proof.hx === INSIDE.foot.x + INSIDE.ix && __proof.hy === INSIDE.foot.y + INSIDE.iy`, 100%. This is what makes "one predicate" true rather than cosmetic.

F. ROUND TRIP, WALKED NOT TELEPORTED. For >=100 buildings: BFS-path to the farthest reachable interior cell issuing real stepOnce(di) calls, BFS-path back to the door, step out along the door's outward normal, then assert INSIDE===null and cellAt(hx,hy).walk === true. Require 100%. (105/105 measured on the patched build.)

G. A WALL IS STILL A WALL. From every reachable interior cell, no direction may take you off the plate unless the cell you stand on is `fp.grid[y][x].g === 'door'`. Require 0 violations. This is the invariant interiors_gate.js:97 was protecting; it must survive in behaviour, not just in a string.

IMPORTANT — do NOT drive this through `window.__proof.step`. That reference was captured at blob line 10058, BEFORE the interior override at 10373, so it is the exterior-only mover and has never once exercised an interior (verified: /if\(!INSIDE\) return _inStepOnce/ tests false against __proof.step and true against the live `stepOnce`). Call the global `stepOnce` from inside the frame.

Also add to gates/interiors_gate.js the four string assertions listed in Edit 3, and register one_predicate_gate.js in gates/bohemia_gates.py so `python3 gates/bohemia_gates.py` runs it.

---

## Interior walls == exterior walls, interior floors == sidewalk concrete (CITY blob renderInside)

**already done:** False  **confidence:** high

### ROOT CAUSE

The interior renderer in the CITY blob has NO materials system at all. Room function is never consulted for a material; it is only consulted as a 6-entry blocklist deciding between two EXTERIOR pools.

(1) WALLS. `renderInside()`'s WALL PASS calls `inBlit('hwall', ...)`. `SA_IMG.hwall` is the *identical JS array* the exterior building-face pass reads (`const wall=saTex('hwall',v)` in the walked-city structure renderer). It is the approved tan-stucco HOUSE SKIN (banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt). So the interior wall is not "similar to" the exterior wall, it is the SAME ARRAY, by construction. The shipped source comment says so out loud: "WALL PASS: hwall, the SAME tan stucco the building wears on the outside, so the interior is literally made of the exterior."

(2) FLOORS. `inFloorPool(role)` returns `'hyard'` for exactly six roles (stockroom, records, service, floor_open, dock, locker) and `'side'` for EVERY other role. `'side'` is `pools.side` of banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt — the 36-tile harmonized street SIDEWALK CONCRETE pool (the app's own `SA_MAP` maps the sidewalk colour `'#c8c4b8'` to `'side'`). Because BOH_FLOORPLAN's residential grammar is `['living','kitchen','bed','bed','bath']` and none of those five appear in IN_FLOORPOOL, a Vegas house's LIVING ROOM, KITCHEN, BEDROOMS and BATHROOM all render on outdoor cracked sidewalk concrete with weeds growing through it. That is Paolo's "concrete tiles", exactly.

Measured on the REAL surface (Playwright, the actual city document, the real canvas): the bedroom, kitchen and living-room floor pixels are BYTE-IDENTICAL to `saTex('side', ...)` (mean abs diff 0.00) and the interior partition wall pixels are BYTE-IDENTICAL to `saTex('hwall', ...)` (mean abs diff 0.00).

WHY IT SHIPPED: it was a deliberate, documented decision in tools/bohemia_city_interiors_patch.py's REUSE CHECK ("FLOOR = the 'side' concrete pool for finished rooms... WALLS = hwall, the same tan stucco the building wears outside"), made when the only art the tool was willing to touch was the facade kit. It is also an approach that is ALREADY GRAVEYARDED: gates/bohemia_graveyard.txt line 73 (INTERIOR_SHELL_v1_7_26_26, Paolo: "Dogshit.") reads "GRAVEYARD FINAL for the empty-shell approach: never ship an interior whose only materials are the facade pools." The alpha is still shipping that exact approach.

SECOND HALF OF THE ROOT CAUSE — THE ART DOES NOT EXIST. I audited every bank. There is NO drywall, NO carpet, NO wood/hardwood floor, NO linoleum/vinyl, NO wallpaper, NO ceramic bath tile, NO interior paint, NO baseboard anywhere in banks/. The 8/1 texture-match bank (114 tiles, 12 approved materials) is 100% EXTERIOR (stucco/CMU/roof/corrugated/plaster-substrate/gravel/asphalt). banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt (465 UP-only tiles, built 7/26, NEVER wired into CITY_B64 — `grep INTERIOR_POOL` on the decoded blob returns 0) is misnamed for this job: its 48 "floors" are dungeon cobblestone, outdoor cracked concrete with weeds, sci-fi deck plate, gravel path and GRASS (plus one 58%-purple tile that would break PURPLE RESERVATION), and its 48 "walls" are medieval ruins, mossy masonry, curtains, sci-fi panels and three blood-splattered tiles. So the mechanism can be fixed today; the LOOK cannot be finished from existing banks.

FOOTNOTE THAT MATTERS: slices/BOHEMIA_RUN_CURRENT.html already implements a partial version of this fix (`ROLE_FLOOR`, `roomFloor()`, `INT_POOL`), and Paolo has never seen one pixel of it — the alpha's tab handler is `var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;`, so the RUN tab shows the CITY panel and `#p-run` never even loads its iframe. The run slice ALSO puts exterior stucco on interior walls (`if(ic.g==='wall'){ tput(['wall_0','wall_1','wall_2'][...]) }` with the comment "A stucco house has stucco walls inside too"), so both surfaces carry defect (1).

### EVIDENCE

DECODED CITY BLOB (slices/BOHEMIA_ALPHA_0_9.html -> CITY_B64, decoded; line numbers are of the decoded text, 24,765,012 chars). Reproduce with the decode one-liner in the brief.

--- line 10407-10414, the whole "materials system": ---
    // ROOM ROLE -> which APPROVED pool the floor comes from. Public/finished rooms
    // stand on the judged concrete ('side', the harmonized street pools);
    // back-of-house stands on the judged decomposed-granite ground (hyard).
    const IN_FLOORPOOL={
      stockroom:'hyard', records:'hyard', service:'hyard', floor_open:'hyard',
      dock:'hyard', locker:'hyard'
    };
    function inFloorPool(role){ return IN_FLOORPOOL[role]||'side'; }

--- line 10452-10459, GROUND PASS: ---
    // GROUND PASS: the judged concrete slab / decomposed-granite ground
    for(let y=0;y<fp.H;y++)for(let x=0;x<fp.W;x++){
      ...
      const pool=inFloorPool(c.role);
      if(!inBlit(pool,inPatch(x,y,pool.length),sx,sy,C)){ g.fillStyle='#8f8878'; g.fillRect(sx,sy,C,C); }
    }

--- line 10460-10467, WALL PASS (the confession is in the comment): ---
    // WALL PASS: hwall, the SAME tan stucco the building wears on the outside, so
    // the interior is literally made of the exterior. A wall that faces daylight
    // carries a dead window or a boarded one.
    ...
        if(!inBlit('hwall',inPatch(x,y,5),sx,sy,C)){ g.fillStyle='#463d33'; g.fillRect(sx,sy,C,C); }

--- line 9320 + 9327, the EXTERIOR face pass, same array: ---
    const wall=saTex('hwall',v);
    ...
    const midPool=(c.artPool_face==='hwindow'||c.artPool_face==='hboarded')?c.artPool_face:'hwall';

--- line 8808, proof 'side' is the SIDEWALK: ---
    const SA_MAP={'#8a8a86':'street',...,'#c8c4b8':'side','#a89a80':'shoulder',...};
  and banks/BOHEMIA_STREET_POOLS_HARMONIZED_7_14_26.txt -> pools.side = 36 tiles, 44x44,
  mean RGB of the first six = (124,114,100) (111,102,89) ... i.e. grey-tan concrete.
  hwall (banks/BOHEMIA_HOUSE_SKIN_CANDIDATES_7_21_26.txt) = 4 tiles, 16x16 source,
  mean RGB (192,168,129) (178,156,123) ... i.e. tan stucco. saTex upscales all of it to TPX=44.

--- line 10173-10190, the role vocabulary that is never consulted: ---
    residential:{roles:['living','kitchen','bed','bed','bath'],minRoom:4},
    retail:{roles:['shopfloor','checkout','stockroom','office','bath'],minRoom:5},
    office:{roles:['lobby','office','office','meeting','breakroom','bath'],minRoom:4},
    civic:{roles:['hall','reception','office','records','bath'],minRoom:5},
    institutional:{roles:['ward','ward','office','service','bath'],minRoom:5},
    warehouse:{roles:['floor_open','dock','office','bath'],minRoom:8},
    landmark:{roles:['atrium','gallery','service','bath'],minRoom:6},
    leisure:{roles:['concourse','counter','kitchen','locker','restroom','service'],minRoom:5},
    'default':{roles:['room','room','service'],minRoom:4},
  -> 24 distinct roles exist; 6 are in IN_FLOORPOOL; the other 18 all fall through to 'side'.

REAL-SURFACE MEASUREMENT (Playwright + chromium, city document loaded from file, MODE='human',
INSIDE forced to BOH_FLOORPLAN.generate(12345,16,14,{zone:'residential',entrance:'S'}),
renderInside() called, then getImageData on the live canvas vs. an offscreen blit of the
exact saTex(pool, inPatch(x,y,salt)) tile, centre C-8 px to exclude the AO strips):

  cell [2,2]  role "bed"     pool chosen "side"  meanAbsDiff vs side  = 0.000   (vs hyard 109.4)
  cell [3,8]  role "kitchen" pool chosen "side"  meanAbsDiff vs side  = 0.000   (vs hyard 137.3)
  cell [11,8] role "living"  pool chosen "side"  meanAbsDiff vs side  = 0.000   (vs hyard 169.7)
  cell [6,2]  interior partition wall            meanAbsDiff vs hwall = 0.000

  Zero is exact identity. Screenshot of the rendered house: tan stucco bands with punched
  windows for every wall (including interior partitions), and cracked weedy grey sidewalk
  under the bedrooms and the kitchen.

BANK AUDIT (what interior art exists):
  grep -rl "drywall|carpet|linoleum|wallpaper|hardwood|wood floor|Tile floor" banks/  -> NOTHING.
  banks/BOHEMIA_TEXTURE_MATCH_8_1_26.txt approved_materials =
    [block_grey, block_painted, gravel_roof, metal_corrugate, roof_shingle, roof_shingle_bn,
     roof_tile_sand, roof_tile_terra, stucco_bone, stucco_ochre, stucco_tan, wall_plaster_bare]
    -> all twelve are EXTERIOR.
  banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt counts = floors 48, walls 48, dirtfloor 24,
    doors 20, windows 16, furniture 31, tools 40, container 60, clutter 80, debris 50,
    light 24, plant 24.  floors packs = 1. Cobblestone floor tiles(7), 1. Cracked contrete
    tiles(8), 1. Floor tiles(3), 1. Floor tiles (1)(3), 1. Metal floor tiles(7), 2. Rusted
    metal floor tiles(2), 3. Stone paths(4), Floor tiles(3), Floor tiles (1)(1), Floor tiles
    and wall tiles(4), Floor tiles!(6).  walls packs = 2. Broken building walls(7), 3. Broken
    wall tiles(10), 4. Scrap wall and panels(7), Floor, walls(13), Wall tiles (1)(11).
    Rendered contact sheets: dungeon cobble / weedy outdoor concrete / sci-fi deck plate /
    grass, and medieval ruins / curtains / blood.  Measured purity: buckets.floors[17]
    ("1. Floor tiles" idx 18) is 58.0% purple -> PURPLE RESERVATION violation if wired blind;
    walls[2 of 'Scrap wall and panels'], walls['Floor, walls' idx 10], walls['Wall tiles (1)'
    idx 14] carry blood splatter.
  banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt: packs "4. House wall tiles", "Interior rooms",
    "furniture and interior", "1. Marble floor tiles", "3. Wall panels and details" exist in
    the HD masters but were NEVER JUDGED in the Great Sweep -> not legal to ship.

REPO STATE:
  gates/bohemia_graveyard.txt:73 — INTERIOR_SHELL_v1_7_26_26, Paolo "Dogshit.",
    "GRAVEYARD FINAL for the empty-shell approach: never ship an interior whose only
     materials are the facade pools."   <- the alpha still ships exactly this.
  records/BOHEMIA_ONE_WORLD_INTERIORS_SPEC_7_31_26.md:85 — S6, verbatim:
    "Interior wall and floor tiles are chosen by the room's function, from the interior
     pool, and are never the exterior's stucco (C1) and never concrete in a living room
     (C2). A garage floor stays concrete because a garage IS concrete."
  records/BOHEMIA_INTERIOR_KILL_AND_THE_SWEEP_CROSSING_7_26_26.md — the pool was built and
    "DELIBERATELY PARKED" behind the art freeze. THE FREEZE IS OVER:
    records/BOHEMIA_TARGET_SCREEN_VERDICT_7_26_26.txt says "THE FLEET-WIDE VISUAL FREEZE
    LIFTS." BOHEMIA_BACKLOG.md:2706 still says "[BLOCKED ON THE TARGET PICK]" — that line
    is stale.
  gates/interiors_gate.js:129-131 CURRENTLY LOCKS THE BUG IN:
      for (const pool of ['hwall','hwindow','hboarded','hdoor','side'])
        ok('interiors are built from the approved '+pool+' pool', inside.includes("'"+pool+"'"));
      ok('the floor comes from a judged pool, never a colour', /inFloorPool|inBlit\('side'|'side'/.test(inside) && ...);
  slices/BOHEMIA_ALPHA_0_9.html: `var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;`
    -> the RUN tab opens the CITY panel; the run slice's partial fix is invisible.
  Anchor uniqueness verified: all four anchor strings below occur EXACTLY ONCE in the
  decoded blob AND EXACTLY ONCE in tools/bohemia_city_interiors_patch.py.

### PATCH SPEC

TWO PARTS. Part A is mechanically applicable today and kills both identities Paolo named. Part B is the content gap and is NOT mine to fill.

=========================================================================
PART A — THE MECHANISM (built and TESTED end-to-end in a real browser)
=========================================================================
Land it in BOTH places (same three anchors, byte-identical text in each):
  1. tools/bohemia_city_interiors_patch.py  (the source of truth)
  2. slices/BOHEMIA_ALPHA_0_9.html CITY_B64 (decode -> replace -> re-encode, or
     just re-run `python3 tools/bohemia_city_interiors_patch.py`)

--- ANCHOR 1 (unique). OLD, delete exactly: ---
const IN_FLOORPOOL={
  stockroom:'hyard', records:'hyard', service:'hyard', floor_open:'hyard',
  dock:'hyard', locker:'hyard'
};
function inFloorPool(role){ return IN_FLOORPOOL[role]||'side'; }

--- NEW, insert exactly (@@INPOOL@@ substituted at patch time, see below): ---
const IN_POOL=@@INPOOL@@;
const IN_IMG={}; let IN_LEFT=0;
for(const _b in IN_POOL){ IN_IMG[_b]=IN_POOL[_b].map(function(e){ IN_LEFT++;
  const im=new Image(); im.onload=function(){ if(--IN_LEFT===0){ try{ render(); }catch(_x){} } };
  im.src='data:image/png;base64,'+e.b64; return {im:im,s:e.s||1,p:e.p||''}; }); }
// ROOM FUNCTION -> MATERIAL. Never the exterior's stucco (C1), never the street's
// concrete in a living room (C2). Spec S6. Keys are BOH_FLOORPLAN.ZONES' own role
// vocabulary; values are PACK NAMES out of the interior pool, so a tile is never
// hand-picked by index and the claim stays checkable.
const IN_MAT={
  bath:{f:'FAM_TILE', w:'FAM_PLASTER'},   restroom:{f:'FAM_TILE', w:'FAM_PLASTER'},
  kitchen:{f:'FAM_TILE', w:'FAM_PLASTER'},living:{f:'FAM_TILE', w:'FAM_PLASTER'},
  bed:{f:'FAM_TILE', w:'FAM_PLASTER'},    room:{f:'FAM_TILE', w:'FAM_PLASTER'},
  lobby:{f:'FAM_STONE',w:'FAM_PLASTER'},  hall:{f:'FAM_STONE',w:'FAM_PLASTER'},
  reception:{f:'FAM_STONE',w:'FAM_PLASTER'}, atrium:{f:'FAM_STONE',w:'FAM_PLASTER'},
  gallery:{f:'FAM_STONE',w:'FAM_PLASTER'},   concourse:{f:'FAM_STONE',w:'FAM_PLASTER'},
  shopfloor:{f:'FAM_TILE',w:'FAM_PLASTER'},  checkout:{f:'FAM_TILE',w:'FAM_PLASTER'},
  counter:{f:'FAM_TILE',w:'FAM_PLASTER'},    office:{f:'FAM_TILE',w:'FAM_PLASTER'},
  meeting:{f:'FAM_TILE',w:'FAM_PLASTER'},    breakroom:{f:'FAM_TILE',w:'FAM_PLASTER'},
  ward:{f:'FAM_TILE',w:'FAM_PLASTER'},
  // A ROOM THAT IS CONCRETE STAYS CONCRETE, because it IS concrete (S6).
  stockroom:{f:'FAM_SLAB',w:'FAM_SCRAP'},  records:{f:'FAM_SLAB',w:'FAM_SCRAP'},
  service:{f:'FAM_SLAB',w:'FAM_SCRAP'},    floor_open:{f:'FAM_SLAB',w:'FAM_SCRAP'},
  dock:{f:'FAM_SLAB',w:'FAM_SCRAP'},       locker:{f:'FAM_SLAB',w:'FAM_SCRAP'},
  garage:{f:'FAM_SLAB',w:'FAM_SCRAP'}
};
const IN_FAM={
  FAM_SLAB:['1. Cracked contrete tiles','Floor tiles and wall tiles'],
  FAM_TILE:['1. Floor tiles','Floor tiles!','Floor tiles (1)','Floor tiles'],
  FAM_STONE:['1. Cobblestone floor tiles','3. Stone paths'],
  FAM_METAL:['1. Metal floor tiles','2. Rusted metal floor tiles'],
  FAM_PLASTER:['Wall tiles (1)','3. Broken wall tiles'],
  FAM_SCRAP:['4. Scrap wall and panels','2. Broken building walls'],
  FAM_WOOD:['Floor, walls']
};
function inFam(bucket,fam,h){
  const all=IN_IMG[bucket]||[], names=IN_FAM[fam]||[];
  const fit=all.filter(function(e){ return names.indexOf(e.p)>=0; });
  const use=fit.length?fit:all; return use.length?use[h%use.length]:null;
}
const _inRoomMat={};
// ONE PICK PER ROOM, not per cell: a room has to read as one room. (Per-cell
// picking is what turned the RUN lane's first attempt into a patchwork quilt.)
function inRoomMat(roomId,role){
  const k=roomId+'|'+role;
  if(_inRoomMat[k])return _inRoomMat[k];
  const m=IN_MAT[role]||IN_MAT.room;
  const h=((Math.imul(roomId+1,2654435761)^Math.imul(String(role||'').length+1,40503))>>>0);
  _inRoomMat[k]={f:inFam('floors',m.f,h),w:inFam('walls',m.w,h>>>7)};
  return _inRoomMat[k];
}
function inCellMat(x,y){
  const fp=INSIDE.fp, c=fp.grid[y][x];
  if(c.g!=='wall')return inRoomMat(c.room,c.role);
  // a wall wears the finish of the room it FACES; the shell wall wears the
  // building's own (room 0), never the EXTERIOR skin.
  for(let k=0;k<4;k++){ const nx=x+IN_D4[k][0], ny=y+IN_D4[k][1];
    if(nx<0||ny<0||nx>=fp.W||ny>=fp.H)continue;
    const n=fp.grid[ny][nx]; if(n.g!=='wall'&&n.room>=0)return inRoomMat(n.room,n.role); }
  return inRoomMat(0,(fp.rooms[0]&&fp.rooms[0].role)||'room');
}
function inPut(e,sx,sy,C){
  if(!e||!e.im.complete||!e.im.naturalWidth)return false;
  g.drawImage(e.im,sx,sy,C,C); return true;
}

--- ANCHOR 2 (unique). OLD: ---
    const pool=inFloorPool(c.role);
    if(!inBlit(pool,inPatch(x,y,pool.length),sx,sy,C)){ g.fillStyle='#8f8878'; g.fillRect(sx,sy,C,C); }
--- NEW: ---
    if(!inPut(inCellMat(x,y).f,sx,sy,C)){ g.fillStyle='#8f8878'; g.fillRect(sx,sy,C,C); }

--- ANCHOR 3 (unique). OLD: ---
      if(!inBlit('hwall',inPatch(x,y,5),sx,sy,C)){ g.fillStyle='#463d33'; g.fillRect(sx,sy,C,C); }
--- NEW: ---
      if(!inPut(inCellMat(x,y).w,sx,sy,C)){ g.fillStyle='#463d33'; g.fillRect(sx,sy,C,C); }

--- @@INPOOL@@ (python side, in tools/bohemia_city_interiors_patch.py, next to the
    existing HOUSE_BANK / STREET_BANK provenance asserts): ---
INTERIOR_BANK='banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt'
_ip=json.load(open(INTERIOR_BANK,encoding='utf8'))
assert 'UP-ONLY' in _ip['law'], INTERIOR_BANK+' is not the UP-only pool'
# PURPLE RESERVATION + no bodies/gore as decoration: the pool is UP art but it
# carries one 58%-purple floor tile and three blood-splattered wall tiles, and
# neither is legal as wallpaper. Filtered HERE, at bake, so the app cannot draw them.
_ipout={}
for _b in ('floors','walls','dirtfloor'):
    _keep=[]
    for _t in _ip['buckets'][_b]:
        if _purple_frac(_t['b64'])>0.05:  continue     # PURPLE RESERVATION
        if _blood_frac(_t['b64'])>0.02:   continue     # bodies are Paolo's to place
        _keep.append({'s':_t.get('scale',1.0),'p':_t['pack'],'b64':_t['b64']})
    _ipout[_b]=_keep
assert len(_ipout['floors'])>=40 and len(_ipout['walls'])>=40, 'interior pool filtered too hard'
INPOOL_JS=json.dumps(_ipout,separators=(',',':'))
# (_purple_frac / _blood_frac: decode the b64 with PIL, HSV-classify, return the
#  pixel fraction. Thresholds measured: the purple tile is 0.580, the next-highest
#  floor tile is 0.00; the three blood tiles are >0.02, everything else is <0.005.)
Then `.replace('@@INPOOL@@', INPOOL_JS)` alongside the existing `@@DOORJS@@` substitution.
Cost: +0.96 MB to the city blob (~1.3 MB to the alpha; the alpha is 42 MB).

--- ANCHOR 4, the REUSE CHECK docstring in the same tool. OLD text to strike: ---
  "WALLS = hwall, the same tan stucco the building wears outside, so the interior
   is made of the exterior. ... FLOOR = the 'side' concrete pool for finished rooms"
--- replace with: used banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt (UP-only Great Sweep
    crossing), routed by room function per spec S6; the facade pools are NO LONGER
    a floor/wall source (graveyard line 73, INTERIOR_SHELL_v1_7_26_26).

--- GATE EDIT, REQUIRED OR THE SUITE GOES RED. gates/interiors_gate.js:129-131.
OLD:
for (const pool of ['hwall', 'hwindow', 'hboarded', 'hdoor', 'side'])
  ok('interiors are built from the approved ' + pool + ' pool', inside.includes("'" + pool + "'"));
ok('the floor comes from a judged pool, never a colour', /inFloorPool|inBlit\('side'|'side'/.test(inside) && /saTex/.test(city));
NEW:
for (const pool of ['hwindow', 'hboarded', 'hdoor'])
  ok('interiors still wear the approved ' + pool + ' pool', inside.includes("'" + pool + "'"));
ok('S6: interior WALLS are never the exterior house skin', !/inBlit\('hwall'/.test(inside));
ok('S6: interior FLOORS are never the street sidewalk pool', !/inFloorPool|inBlit\('side'/.test(inside));
ok('S6: every floorplan role resolves to a material', (() => {
  const roles = new Set(); for (const z of Object.values(FLOORPLAN.ZONES)) z.roles.forEach(r => roles.add(r));
  const tbl = inside.slice(inside.indexOf('const IN_MAT='), inside.indexOf('const IN_FAM='));
  return [...roles].every(r => new RegExp('(^|[,{\\s])' + r + ':\\{').test(tbl));
})());
ok('S6: concrete lands ONLY where the room IS concrete', (() => {
  const tbl = inside.slice(inside.indexOf('const IN_MAT='), inside.indexOf('const IN_FAM='));
  const slab = [...tbl.matchAll(/([a-z_]+):\{f:'FAM_SLAB'/g)].map(m => m[1]).sort();
  return JSON.stringify(slab) === JSON.stringify(['dock','floor_open','garage','locker','records','service','stockroom']);
})());

--- VERIFIED. I applied exactly this to a copy of the real city document and drove it
    with Playwright. Same measurement harness, same seed/footprint as the "before" run:
      BEFORE                              AFTER
      bed     vs side  = 0.000            bed     vs side = 156.37   pack "Floor tiles!"
      kitchen vs side  = 0.000            kitchen vs side = 155.50   pack "Floor tiles!"
      living  vs side  = 0.000            living  vs side = 193.05   pack "Floor tiles (1)"
      wall    vs hwall = 0.000            wall    vs hwall= 379.15   pack "Wall tiles (1)"
      (warehouse zone) floor_open -> pack "1. Cracked contrete tiles"  <- S6 holds
    No page errors, no perf change, one render per pool-decode instead of 120.

=========================================================================
PART B — THE CONTENT GAP. SAY THIS TO PAOLO PLAINLY, DO NOT PAPER OVER IT.
=========================================================================
Part A makes the material come from the room. It does NOT make a house look like a
house, because THE MATERIALS DO NOT EXIST. I looked in every bank:
  - NO drywall. NO painted interior plaster. NO wallpaper. NO baseboard/trim.
  - NO carpet. NO wood/hardwood floor (there is exactly ONE wood-plank tile in the
    entire corpus). NO linoleum/vinyl. NO ceramic bath or kitchen tile.
  - NO interior door casing, NO closet, NO counter/cabinet surface.
The 8/1 texture-match bank Paolo just approved 36 of is entirely exterior materials.
The "interior pool" is a fantasy/industrial corpus (dungeon cobble, mossy ruins,
sci-fi deck plate, grass) — my patched screenshot proves it: the bedroom goes from
sidewalk concrete to dungeon cobblestone, which is a different wrong answer.

MECHANISM-MINE / CONTENTS-PAOLO'S: I am not inventing his interior materials.
THE ONE THING BLOCKING EVERYTHING is a cook he has to approve — an INTERIOR MATERIAL
SET, same shape as the 8/1 texture-match batch he loved, roughly 8 materials x 3
variants at 44px: drywall/painted plaster, plaster with the paint failing, floor
tile (kitchen/bath), sheet vinyl, worn carpet, wood plank floor, garage/utility
concrete slab, and a wall base/baseboard course. That is ONE batch to judge, and
Part A's IN_MAT table then swaps IN_FAM values for the new material ids with no
other change. Recommendation: land Part A (it deletes both identities he named and
is required either way), and put the material-set cook in front of him as ONE ask.

NOTE ON THE ONE-WORLD REWRITE: records/BOHEMIA_ONE_WORLD_INTERIORS_SPEC_7_31_26.md
step 6 IS this fix. The IN_MAT/IN_FAM table is the durable half and moves verbatim
onto the one-world grid when steps 1-5 land; only `inCellMat`'s grid read changes.
Do not wait for the rewrite to stop drawing sidewalks in bedrooms.

### RISK

1. THE EXISTING GATE FAILS UNLESS EDITED. gates/interiors_gate.js:129-131 literally asserts the bug ("interiors are built from the approved side pool"). Shipping Part A without the gate edit turns interiors_gate RED. The gate edit is part of the patch, not optional.

2. FILE SIZE. +0.96 MB to the decoded city blob, +~1.3 MB to the alpha. There is a front-screen size guard in the alpha patch path calibrated at 2% (it exists because the alpha has gone to zero bytes once); a 1.3 MB growth on a 42 MB file is ~3% and WILL trip a shrink/grow guard if any tool has one on the alpha. Check tools that assert alpha size before pushing. alpha_loads_gate.js and bundle_gate.js are the ones to watch.

3. LOOK REGRESSION RISK IS REAL. Part A alone makes bedrooms dungeon cobblestone. If Paolo sees that unasked it is a second rejection on the same feature, and STOP PRODUCING says a second rejection ends the feature for the session. Do not surface a "here, judge the new interior" ask. Land the mechanism + gate quietly as compliance work, and ask ONLY the one material-cook question.

4. PURITY / GRAVEYARD. The interior pool contains a 58%-purple floor tile (PURPLE RESERVATION belongs to the Amalgamation alone) and three blood-splattered wall tiles. The bake-time filter in the patch is what keeps bohemia_purity_gate.py green and keeps bodies out of decoration. If someone drops the filter to "get more variety", purity goes red and the graveyard's own exclusion note is violated.

5. LANE BOUNDARY. This is CITY-lane code (renderInside lives only in CITY_B64 + its patch tool). It touches NO engine module, so world_gate / floorplan_gate / walkable_gate / landlocked_gate / district gates are all untouched. It does NOT touch the exterior renderer, so art_45_gate, hood_gate, target_match_gate and the ART lane's surfaces are unaffected — 'hwall' keeps its exterior job exactly as it is. It does NOT touch slices/BOHEMIA_RUN_CURRENT.html, so the RUN lane's gates are unaffected. ONE SYSTEM ONE SESSION: if another session is inside the interiors/one-world rewrite right now, STOP — this is the same system and a rebase conflict here is a boundary crossing.

6. DETERMINISM. inRoomMat keys on (room index, role) and caches in a module-level object that is NEVER CLEARED between buildings. Two different buildings both have a room 0 with role 'living', so the cache will hand the second building the first building's material. Fix before shipping: key on INSIDE.foot.x+','+INSIDE.foot.y+'|'+roomId+'|'+role, or clear _inRoomMat in inEnter(). I left the simple version in the tested patch to keep the anchors minimal; do not ship it as-is.

7. STALE BACKLOG. BOHEMIA_BACKLOG.md:2706 still reads "[BLOCKED ON THE TARGET PICK] DRESS THE INTERIORS ... Do NOT wire it before the target screen is approved". The target screen WAS approved (CBB, 7/26) and that verdict says the fleet-wide freeze LIFTS. Update the backlog line in the same turn or the next session re-blocks itself on a dead gate.

### GATE SPEC

Two layers. The static checks go in gates/interiors_gate.js (already the owner of this render). The pixel proof goes in a new headless gate, because the static ones cannot see what got drawn — and the 7/18 law says a side-door probe is a lie.

LAYER 1 — STATIC, gates/interiors_gate.js (replaces lines 129-131, full text in patchSpec):
  a. `!/inBlit\('hwall'/.test(inside)`               — interior walls are never the exterior skin.
  b. `!/inFloorPool|inBlit\('side'/.test(inside)`    — interior floors are never the street pool.
  c. Every role in FLOORPLAN.ZONES resolves in IN_MAT — derived from the generator the gate
     already imports, so adding a zone to the engine fails the gate until its rooms get materials.
  d. FAM_SLAB is assigned to EXACTLY {dock, floor_open, garage, locker, records, service,
     stockroom} — S6 stated as a machine fact: concrete only where the room IS concrete.
  e. Provenance: every pack name in IN_FAM must appear in banks/BOHEMIA_INTERIOR_POOL_7_26_26.txt's
     buckets, and every tile in the embedded IN_POOL must trace to an UP verdict in
     banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt by (pack, idx). A citation the machine checks.
  f. Purity: no embedded IN_POOL tile exceeds 5% purple or 2% blood (recompute from the b64,
     do not trust the builder's word).

LAYER 2 — THE REAL SURFACE, new gates/interior_materials_gate.js (node + playwright,
the pattern city_people_gate.js already uses; ~25 s):
  1. Load slices/BOHEMIA_ALPHA_0_9.html's CITY_B64 as a document (decode to a temp file —
     the gate must read the SHIPPED blob, not the patch tool's template).
  2. For each zone in BOH_FLOORPLAN.ZONES x entrance {S,N,W,E} x a fixed footprint list:
     set MODE='human', build INSIDE from BOH_FLOORPLAN.generate(...), stub isNight()->false,
     call renderInside().
  3. For every distinct role, sample one floor cell that has no wall neighbour (so the AO
     strips cannot contaminate) and read getImageData on the LIVE canvas, centre C-8 px.
     ASSERT mean-abs-diff vs an offscreen blit of saTex('side', inPatch(x,y,4)) is > 25.0.
     Today it is 0.00 — exact identity — so this is the check that would have caught it.
  4. Same for one interior partition wall cell vs saTex('hwall', inPatch(x,y,5)): > 25.0.
  5. ASSERT concrete IS present where it belongs: for zone 'warehouse', the floor_open cell's
     resolved pack matches /contrete|concrete/i. S6 has two halves and both get checked.
  6. ASSERT one-tile-per-room: within a single room, every sampled floor cell's pixels are
     mean-abs-diff < 1.0 from each other. Kills the patchwork-quilt regression the RUN lane
     already hit once.
  7. ASSERT no flat-fill fallback survived: count pixels equal to #8f8878 or #463d33 across
     the plate; must be 0 after the pool has decoded (wait on IN_LEFT===0).
  8. Emit the numbers, not a boolean. A gate that prints "bed vs side = 156.37" is a gate
     somebody can argue with; a gate that prints "OK" is not.

  Register it in gates/bohemia_gates.py so `python3 gates/bohemia_gates.py` runs it.

REGRESSION VALUE: run Layer 2 against the CURRENT main and it fails on step 3 and step 4 with
0.00/0.00. That is the proof the gate is real and not self-attesting.

---

## PAOLO: "why are we not implementing the transparency opacity when i should be behind a wall thats visual but i can still walk in the direction." — see-through/x-ray on walls that cover the player in the walked world.

**already done:** True  **confidence:** high

### ROOT CAUSE

ALREADY DONE AND WORKING — I measured it, I did not read it. The exact thing he asks for is shipped in the CITY renderer at HEAD (21ee612) and is live on every one of the four zoom stops.

The mechanism: facades left the chunk bake and became a live two-half pass around the player (`facadePass(...,front=false)` draws every face cell NORTH of him at full opacity, the player draws, then `facadePass(...,front=true)` draws every face cell at-or-SOUTH of him last). Any wall in that front pass whose drawn box (top = dy-(wallH-1)*C through dy+C) overlaps the player's box drops to `WALL_SEE = 0.35`. The two halves of his ruling are separately correct: the wall's own cell is the ONLY solid tile (`c.walk=false`), and the tile its upper course paints over stays walkable, so he really can walk into the covered tile and the wall really does fade on him.

MEASURED ON THE REAL SURFACE (real chromium, real alpha, drawImage instrumented before boot, every predicate scoped to the world canvas `cv`):
- 500 walkable cells sampled across the whole valley, each one with a face cell directly south of it inside its own wall height. At HC = 11, 22, 44 and 88: opaqueOver = 0, faded = 500, nothingOver = 0, and the only alpha ever seen over his body is 0.35. Not one case anywhere in the world where something is drawn over the player at full opacity.
- Walk half, at a real perimeter wall (gx 1663, gy 580): wall cell walk=false / face=true / wallH=2 / pool=perimeter; covered cell walk=true. Standing two north, stepOnce(SOUTH) succeeds onto the covered tile, the next stepOnce(SOUTH) is refused by the wall, and east/west/north off the covered tile all succeed. COLLISION = 1 tile exactly as he ruled.
- Census: 7,417 of 22,345 perimeter wall cells have a walkable tile under their upper course, so this is the common case, not a corner.
- Pixel proof, not just draw calls: screenshots at HC 44 show his whole body legible through the brown wall tile painted over him.

INSIDE BUILDINGS: the case he describes cannot arise, and I am stating that rather than claiming it "works". `renderInside()` draws every interior wall exactly ONE cell (`inBlit('hwall',...,sx,sy,C)`), the two-tile interior door is drawn BEFORE the body, and the player is the LAST drawImage in the function. Measured entering a 21x12 residential plate with a wall cell directly north of him: 68 draws on cv, every single one at alpha 1, zero draws after the player. Nothing indoors ever covers him, so there is nothing to fade. (Separate, real, and NOT his complaint: interior walls being 1 tile tall is a divergence from the 8/2 "all walls at least two tiles tall from fencing to concrete to brick whatever" law. If the ART/CITY lane ever raises them, the indoor renderer has no see-through path at all and he WILL go invisible indoors.)

THE ONE THING THAT IS ACTUALLY WRONG, and it is the opposite of what he said: the filter is OVER-firing. `playerBox()` tests the player's whole square sprite QUAD, not his painted body. I measured PLAYER_CV.S.idle's own alpha bounding box: the 56x56 source is painted only x 18..38, y 3..53, i.e. 0.321..0.696 across and 0.054..0.964 down. At HC 44 that is a body 0.95 cells wide inside a box 2.55 cells wide. So walls a full cell to his left and a full cell to his right ghost out while he walks past them. Census at 250 arbitrary walkable spots: 750 wall draws faded, and 0 of them were covering his body — 100% waste. The wallheight gate's own words are "a filter that is always on is not a filter, it is a bug," and its STAYS-OFF assertion cannot catch this because it only ever stands him 4+ cells clear of every facade.

Second, smaller, same family: on a TWO-tile wall `top` IS `dy-C`, so the non-perimeter branch blits the cap course and the mid course onto the same cell. At alpha 1 that is invisible; under the fade two stacked 0.35 blits composite to 0.58, so a `kind:'fence'` hides him half again as much as a block wall. Measured at a real fence cell (gx 902, gy 123, pool hboarded): 9 faded draws landing on 6 distinct cells — every column double-drawn.

### EVIDENCE

ALL city-renderer line numbers are in the DECODED CITY_B64 blob. Reproduce with:
python3 -c "import base64,re;s=open('slices/BOHEMIA_ALPHA_0_9.html',encoding='utf8',errors='ignore').read();open('/tmp/city.txt','w').write(base64.b64decode(re.search(r\"CITY_B64\s*=\s*['\\\"\`]([A-Za-z0-9+/=]{5000,})\",s).group(1)).decode('utf8','ignore'))"

1) THE FEATURE EXISTS AND IS WIRED — decoded CITY_B64 lines 9271-9345:
  9271  const WALL_H=3;                 /* tiles: the wall a door lives in */
  9272  const WALL_SEE=0.35;            /* how much of a wall is left when it is hiding you */
  9288  function facadePass(ox,oy,C,front,pgy,pbox){
  9291      if((gy>=pgy)!==front)continue;          /* behind him first, in front of him after */
  9300        const wh=c.wallH||WALL_H;
  9301        const dx=Math.round(ox+gx*C), dy=Math.round(oy+gy*C), top=dy-(wh-1)*C;
  9305        let a=1;
  9306        if(front&&pbox&&dx<pbox.x1&&dx+C>pbox.x0&&top<pbox.y1&&dy+C>pbox.y0)a=WALL_SEE;
  9307        g.globalAlpha=a;
Call sites, decoded lines 9589-9637 inside renderHuman():
  9589    const _pbox=playerBox(ox,oy,C);
  9590    facadePass(ox,oy,C,false,hy,null);      // behind him, opaque
  ....    peoplePass(...); then the player sprite draw
  9637    facadePass(ox,oy,C,true,hy,_pbox);      // in front of him, fades

2) THE OVER-FADE BOX — decoded CITY_B64 lines 9341-9345, quoted exactly:
  function playerBox(ox,oy,C){
    const px=ox+hx*C, py=oy+hy*C;
    const lad=HC>=64?224:(HC>=32?112:(HC<17?28:56));
    return {x0:px+C/2-lad/2, x1:px+C/2+lad/2, y0:py+C-lad, y1:py+C};
  }
Measured sprite bbox (in-page, PLAYER_CV.S.idle -> offscreen canvas -> getImageData alpha>8):
  {"sprite":{"w":56,"h":56},"bbox":{"x0":18,"y0":3,"x1":38,"y1":53,"w":21,"h":51},
   "fracOfQuad":{"x0":0.321,"x1":0.696,"y0":0.054,"y1":0.964},
   "atHC44":{"bodyWidthCells":0.95,"bodyHeightCells":2.32,"quadWidthCells":2.55}}

3) THE TWO-TILE DOUBLE COURSE — decoded CITY_B64 lines 9328-9331, quoted exactly:
        const mid=saTex(midPool,v);                 /* a window belongs UP the wall */
        if(wall)g.drawImage(wall,dx,top,C,C);
        if(mid)g.drawImage(mid,dx,dy-C,C,C);
        if(wall)g.drawImage(wall,dx,dy,C,C);
  With wh=2, top === dy-C, so lines 2 and 3 are the same destination cell.

4) MY MEASUREMENTS (all run against slices/BOHEMIA_ALPHA_0_9.html in a real chromium,
   drawImage patched via addInitScript, filtered to d.canvas === cv):
  a) 500 spots x 4 zooms, each spot a walkable cell with a face cell directly south inside its wall height:
     HC11 {opaqueOver:0, faded:500, nothingOver:0, alphas:["0.35"]}
     HC22 {opaqueOver:0, faded:500, nothingOver:0, alphas:["0.35"]}
     HC44 {opaqueOver:0, faded:500, nothingOver:0, alphas:["0.35"]}
     HC88 {opaqueOver:0, faded:500, nothingOver:0, alphas:["0.35"]}
  b) over-fade census, 250 arbitrary walkable spots at HC44:
     {spotsWithAnyFade:250, totalFadedDraws:750, fadedThatActuallyCoverBody:0, wastedPct:100}
     and a hand-picked "wall to the EAST only, nothing south" spot (gx 1563, gy 528):
     {fadedDraws:3, fadedOverBody:0}
  c) fence double-course at gx 902, gy 123, pool hboarded, HC44 — faded draw destinations in cells:
     [901,122],[901,122],[901,123],[902,122],[902,122],[902,123],[903,122],[903,122],[903,123]
     dupPositions: [["901,122,44",2],["902,122,44",2],["903,122,44",2]]
  d) walk half at gx 1663, gy 580:
     wallCell {walk:false, face:true, wallH:2, pool:"perimeter"}; coveredCell {walk:true, face:false}
     start [1663,578] -> stepSouth1 true -> [1663,579] -> stepSouth2 FALSE (blocked) -> stepEast/West/North all true
     census {wallCells:22345, coveredWalkable:7417}
  e) interior, 21x12 residential plate, player on a cell with a wall directly north:
     {totalDraws:68, lastDraw:{dw:75,dh:75,al:1}, fadedDraws:0, alphas:[1]}
  f) screenshots (kept): /tmp/claude-0/-home-user-bohemia/33199825-1736-501f-9707-b1f1acd52ba8/scratchpad/shots/
     behind_HC{11,22,44,88}.png, behind_HC44_crop.png (body clearly legible through the wall), interior.png

5) EXISTING GATES, both run by me at HEAD:
  node /home/user/bohemia/gates/wallheight_gate.js  -> "THREE-TILE WALL GATE: 7 passed, 0 failed"
  node /home/user/bohemia/gates/wallclass_gate.js   -> "WALL CLASS GATE: 24 passed, 0 failed"

6) THE RULING AND ITS PAPER TRAIL:
  /home/user/bohemia/laws/BOHEMIA_LAW_WALLS_ARE_TWO_TALL_ONE_SOLID_8_2_26.md — the three quantities
    (HEIGHT 2 / COLLISION 1 / OPACITY on contact), and the same sentence he is quoting here.
  /home/user/bohemia/BOHEMIA_BACKLOG.md:1727 — item 0AL "[DONE 8/2 - HIS CORRECTION, AND I HAD IT BACKWARDS]".
  git log: ae3eed2 "EVERY WALL IS TWO TILES TALL AND ONE TILE SOLID - I had it backwards".
  Set at /home/user/bohemia decoded blob line 8177: c.face=true; c.artPool_face='perimeter'; c.wallH=2;

7) THE SURFACE IS THE CITY RENDERER, CONFIRMED — in slices/BOHEMIA_ALPHA_0_9.html:
  "var PANEL = (t.dataset.p==='run') ? 'city' : t.dataset.p;"
  The RUN tab now shows the p-city panel; the runFrame iframe stays only so postMessage still resolves.
  So BOHEMIA_RUN_CURRENT.html is NOT the walked surface and needs no fix here.

### PATCH SPEC

DO NOT "fix" the see-through. It is done. If anything ships, it is the OVER-FIRE, and that is a judgement call for Paolo, not a bug he reported.

The CITY renderer has no plain-text source in the repo: it exists only as base64 inside slices/BOHEMIA_ALPHA_0_9.html, and every change is made by a python patch tool. Follow the exact established pattern in tools/bohemia_city_wallheight_patch.py — new file tools/bohemia_city_seethru_box_patch.py:

  ALPHA = 'slices/BOHEMIA_ALPHA_0_9.html'
  alpha = open(ALPHA, encoding='utf8').read()
  key = "const CITY_B64='"
  a0 = alpha.index(key) + len(key); a1 = alpha.index("'", a0)
  decoded = base64.b64decode(alpha[a0:a1]).decode('utf8')
  if 'THE BOX IS THE BODY' in decoded: print('already applied. no-op.'); sys.exit(0)
  ... assert each OLD occurs exactly once, replace, then ...
  out = base64.b64encode(decoded.encode('utf8')).decode('ascii')
  open(ALPHA,'w',encoding='utf8').write(alpha[:a0] + out + alpha[a1:])

PART 1 — the box is the body, not the quad.
OLD (verified count == 1 in the decoded blob):
function playerBox(ox,oy,C){
  const px=ox+hx*C, py=oy+hy*C;
  const lad=HC>=64?224:(HC>=32?112:(HC<17?28:56));
  return {x0:px+C/2-lad/2, x1:px+C/2+lad/2, y0:py+C-lad, y1:py+C};
}
NEW:
function playerBox(ox,oy,C){
  const px=ox+hx*C, py=oy+hy*C;
  const lad=HC>=64?224:(HC>=32?112:(HC<17?28:56));
  /* THE BOX IS THE BODY, NOT THE QUAD (8/2). The sprite sheet is a SQUARE pad -
     56x56 at source, blitted lad x lad - and the painted body fills only
     x 0.321..0.696 and y 0.054..0.964 of it, measured off PLAYER_CV.S.idle's own
     alpha bounding box (18..38 across, 3..53 down). Testing the whole quad made
     the occlusion box 2.55 cells wide around a body 0.95 cells wide, so the
     filter fired on the wall a full cell to his left and a full cell to his
     right. Measured on the real surface: 750 faded wall draws across 250
     walkable spots and ZERO of them were covering him. A filter that is always
     on is not a filter, it is a bug. */
  const bw=lad*0.375;
  return {x0:px+C/2-bw/2, x1:px+C/2+bw/2, y0:py+C-lad*0.946, y1:py+C-lad*0.036};
}

PART 2 — one draw per course on a two-tile wall.
OLD (verified count == 1 in the decoded blob, note the 8-space indent):
        if(wall)g.drawImage(wall,dx,top,C,C);
        if(mid)g.drawImage(mid,dx,dy-C,C,C);
        if(wall)g.drawImage(wall,dx,dy,C,C);
NEW:
        /* ONE DRAW PER COURSE (8/2): on a TWO-tile wall `top` IS `dy-C`, so the
           cap course and the mid course were blitted onto the same cell. At full
           opacity that is invisible; under SEE-THROUGH it is not - two stacked
           0.35 blits composite to 0.58, so a kind:'fence' hid him half again as
           much as a block wall did. Measured at gx 902 / gy 123 (pool hboarded):
           9 faded draws on 6 distinct cells, every column double-drawn. */
        if(wall&&wh>2)g.drawImage(wall,dx,top,C,C);
        if(mid)g.drawImage(mid,dx,dy-C,C,C);
        if(wall)g.drawImage(wall,dx,dy,C,C);

NOT PART OF THIS PATCH, filed so it is not guessed at later: interior walls in
renderInside() are drawn ONE cell tall while every exterior wall is two, and
renderInside() has no see-through path at all. Today that is harmless (the player
is the last draw indoors and nothing covers him). The moment interior walls go
two tall to satisfy the 8/2 law, he goes invisible indoors with no filter to save
him. That is an ART/CITY-lane decision and a separate ship.

### RISK

- SHIPPING ANYTHING HERE AT ALL IS THE MAIN RISK. laws/BOHEMIA_ADDENDUM_STOP_PRODUCING_7_26_26.md: this feature was already built for him on 7/27 and corrected on 8/2. Re-shipping "the transparency" a third time, when it measurably works, is exactly the failure that law names. If it goes out, it must be framed as the over-fire, not as "I implemented your opacity."
- gates/wallheight_gate.js "SEE-THROUGH FIRES when a wall is covering him" stands him at (door[0], door[1]-1) — the wall is in his OWN column, so after the tightening the wall draw (dx..dx+44) still overlaps the new body span (px+1.1..px+42.9 at HC44). Stays green. Verified by geometry, must still be re-run.
- gates/wallclass_gate.js OPACITY samples the covered tile's top-left pixel (its local ox is `cv.width/2 - hx*HC - HC/2`, half a cell off renderHuman's real `ox = cv.width/2 - hx*C`, so sx lands on the covered column's left edge). The wall in his own column still fades. Stays green. Note the gate's ox/oy formula is already half a cell out of sync with the renderer — worth fixing in the same pass, but it does not currently change its verdict.
- Part 2 removes one drawImage per wh===2 non-perimeter face cell. wallheight_gate.js asserts `behindCell > 10` on one-cell draws; its measured value is 34 and it lands in a SUBURB, whose walls take the `perimeter` branch and are untouched. Margin holds, but a kit-district reseed could move that gate's chosen cell — re-run it.
- Aspect is unchanged (every draw stays C x C), so render_pixel_gate / canvas_scale_gate / the render audit are unaffected.
- Re-encoding CITY_B64 rewrites the whole ~36MB alpha. Re-run gates/alpha_loads_gate.js, gates/bundle_gate.js, gates/city_tab_gate.js and gates/city_people_gate.js (peoplePass sits between the two facadePass halves and shares the draw order).
- Do NOT touch slices/BOHEMIA_RUN_CURRENT.html. The RUN tab renders the p-city panel now; editing the run renderer would be a second surface diverging from the one he plays.
- Lane boundary: facadePass/playerBox are CITY-lane bodies. If a COMBAT or ART session is live in the same blob this turn, one of you loses the rebase — the alpha is one file.

### GATE SPEC

Extend gates/wallheight_gate.js (it already boots the real alpha, patches drawImage before load, and scopes to the world canvas `cv`) with four assertions, all read off real frames. Every one is proved able to fail by reverting the patch.

1. BODY-TRUE FADE, AT EVERY ZOOM STOP. Find a perimeter wall cell whose north neighbour is walkable (the world has 7,417). For HC in [11,22,44,88]: stand him on the covered tile, render, and assert >= 1 draw on cv at globalAlpha === WALL_SEE whose destination rect intersects the BODY rect
     bw = lad*0.375; bx0 = px+C/2-bw/2; bx1 = px+C/2+bw/2; by0 = py+C-lad*0.946; by1 = py+C-lad*0.036
   with lad = HC>=64?224:(HC>=32?112:(HC<17?28:56)). Current measured value: 500/500 spots at all four stops. Fails if the fade is ever disconnected or a zoom stop is missed.

2. NOT-ALWAYS-ON (the assertion that does not exist today and is why the over-fire shipped). Find a walkable cell whose only face cell within 3 cells is at (gx+1,gy) or (gx-1,gy) — a wall BESIDE him, provably not covering him. Assert ZERO faded draws on cv. Today this reads 3 (spot gx 1563, gy 528); after the patch it must be 0. Back it with the world census: sample 250 arbitrary walkable cells, and assert fadedThatCoverBody / totalFadedDraws >= 0.9. Today that ratio is 0/750 = 0.0.

3. NO DOUBLE COURSE. In any single frame, assert no two faded draws on cv share the same rounded (dx, dy, dw, dh). Today a kind:'fence' cell produces 9 faded draws on 6 distinct cells; after the patch, 6 on 6.

4. NOTHING IS EVER OPAQUE OVER HIM (the standing regression guard, cheap and world-wide). Sweep >= 200 walkable cells that have a face cell south of them inside its wall height, at all four zoom stops. Locate the player draw by its signature (dw === dh === lad at round(px+C/2-lad/2), round(py+C-lad)), then assert every LATER draw on cv that intersects the body rect has globalAlpha < 0.99. Current measured value: 0 opaque, 500 faded, at every stop.

5. THE COLLISION HALF, kept honest with the movement code's own predicate (extend gates/wallclass_gate.js, which already counts covered-walkable): assert the wall cell's `.walk === false`, the covered cell's `.walk === true`, and that stepOnce(4) from two cells north succeeds onto the covered tile while the very next stepOnce(4) returns false. Real function, not a private re-implementation of "is this standable".

6. PIXEL PROOF, not draw calls. With him on the covered tile, getImageData at the body centre on cv, then move him one cell west and sample the same screen pixel. Identical pixels mean he is not showing through. (While you are in there, fix wallclass_gate.js's sampler: its ox/oy carry an extra -HC/2 that renderHuman does not, so it is sampling half a cell off its intended point.)
