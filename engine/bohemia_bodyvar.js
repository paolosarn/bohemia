/* ===========================================================================
   BOHEMIA — BODY VARIATION DIALS (BOH_BODYVAR)
   ---------------------------------------------------------------------------
   ONE RIG, VARIATION SLIDERS. laws/BOHEMIA_ADDENDUM_ONE_RIG_VARIATIONS_7_25_26.md
   (Paolo 7/25/26, LOCKED): the separate female rig is DEAD. There is ONE rig --
   Paolo's painted male body -- and every human in the world is that rig plus a
   set of slider values.

   REUSE CHECK (REUSE-FIRST LAW, Paolo 7/22): this module cooks ZERO new graphic
   pixels. It opens exactly one bank -- the painted rig package `BAKED` inside
   slices/BOHEMIA_ALPHA_0_9.html (Paolo's own hand-painted art + hand-posed
   skeleton) -- and RE-MAPS those existing pixels. No new art is authored, drawn,
   generated, or invented anywhere in this file. That is the whole point of the
   ruling: a second authored body multiplies every downstream contract; one rig
   with parameters multiplies nothing.

   THE TWO DIAL FAMILIES ARE DIFFERENT MACHINERY (paid for in blood by the dead
   woman-rig arc; lesson 2 of the addendum):

     HEIGHT rides the SKELETON. seg()'s WIDTH LAW (Paolo 7/2/26) scales the
     along-bone axis with bone length and NEVER the perpendicular axis, so
     lengthening bones in the POSE makes a taller body at unchanged width --
     exactly right, and free. The rest skeleton (where the art was painted) is
     never touched.

     BELLY + ARMS ride the REST PIXELS. A width dial cannot ride the skeleton at
     all (the perpendicular axis is law-bound to never scale), so it reshapes
     rest-space art BEFORE the skinner ever sees it, and the skinner then binds,
     poses and animates the reshaped body with zero special-casing downstream.

   THE HEAD BARELY SCALES WHILE THE BODY DOES (addendum lesson 1, sourced
   anthropometry: real height varies ~0.92x between adults while head size
   varies only ~0.96x). Uniform scaling of the whole sprite reads as A CHILD,
   not as a shorter adult. So the head bone keeps its authored vector and its
   exact rest length; only its ANCHOR (the neck) rides the height dial. The
   renderer's HEAD RIGID STAMP LAW then copies the painted head block verbatim.

   INVARIANTS THIS FILE OWES (gates/bodyvar_gate.js proves every one):
     - neutral dials (all zero) return the SAME OBJECT -- byte-identical canon
     - painted REGIONS are never reshaped in place; RIG LAW holds. Rows are
       re-mapped by an inverse sample, per part, so a row can never empty and a
       hole can never open (LEAF-PIXEL / thin-art lesson 6).
     - membership is tracked PER PART (lesson 4: on the hip row the torso and
       both legs claim the same pixels; a shared remap loses a torso row and
       silently corrupts every garment that keys off part 4).
     - dials are CONTINUOUS: no value in range produces a broken frame.
   =========================================================================== */
const BOH_BODYVAR = (function () {
  const CW = 56, CH = 56;

  /* Dial ranges. Paolo's call on the final numbers (the addendum lists "the
     range of each dial" under DO NOT DECIDE WITHOUT PAOLO) -- these are the
     CANDIDATE ranges he judges, kept in one place so a verdict is a one-line
     edit. Each dial takes a value in [-1, 1]; 0 is canon. */
  const AMP = {
    /* HEIGHT IS FRAME-CAPPED, AND THAT CAP WAS MEASURED, NOT GUESSED.
       Swept on the real surface across the whole clip set (61 clips x 8 facings
       x 4 phases): Paolo's painted body already paints ON the top row of the
       56px frame in nine clips (jump, cheer, hands-up, stretch, heave,
       jumping-jacks, hail, flee-sprint, sleep) -- his guy is a TALL guy and the
       frame is full. At 8% the head gets SHAVED on idle/walk/run facing NW (6
       pixels onto row 0). At 6% two stray pixels appear on crawl-dying. 5% is
       the last value with zero strays and no frame gaining more than a 2px
       graze anywhere. So the honest ceiling on "taller" is the sprite frame
       itself, not taste; going bigger needs a ruling (a taller frame, or
       re-centring canon so the painted body is not sitting at the ceiling). */
    height: 0.05,   /* +-5% of standing height: ~+-2.3px on a 46px body */
    belly:  0.32,   /* +-32% of torso half-width at the widest belly row */
    arms:   0.45,   /* +-45% of arm half-width (arms are thin; thin needs more) */
    /* SHOULDERS (Paolo 7/29/26): "widening shortening the shoulder parts of the
       rig... i dont want to create a female rig. but these sliders will help us
       make that." GROUNDED, not guessed: the biacromial-to-biiliac ratio (shoulder
       breadth over hip breadth) is the strongest silhouette dimorphism there is --
       about 1.4 in men and 1.2 in women. That is a ~14% narrowing of the shoulder
       against an unchanged hip, so +-20% of the shoulder's half-width covers the
       whole real male-to-female span with headroom either side. */
    shoulders: 0.20,
    /* ARM LENGTH (same ruling). GROUNDED: arm span tracks height almost exactly --
       the healthy adult ratio sits between 1.00 and 1.05, men averaging ~5cm of
       span over height and women ~1cm. Arms are NOT a free dimension on a human
       body, so this is deliberately a narrow dial: +-12% of the arm's own length,
       which is a couple of pixels at this scale and still reads. */
    armLength: 0.12,
    /* HIPS (Paolo 7/29/26: "we can add hip width"). The complement to SHOULDERS --
       biiliac breadth is the OTHER half of the shoulder:hip ratio, and until now
       only the top of that ratio could move. Slightly under the shoulder's range
       because a pelvis is bone and varies less than a shoulder girdle does. */
    hips: 0.18
  };

  /* FRONT AXIS per facing = cos(FACEANG). A gut protrudes FORWARD, not sideways:
     in profile the belly's added width is pushed toward the camera-front side so
     it reads as a stomach, not a barrel. Head-on (N/S) there is no lateral front
     axis, so the expansion stays symmetric -- which is also anatomically right. */
  const FRONT = { E: 1, W: -1, SE: 0.7071, NE: 0.7071, SW: -0.7071, NW: -0.7071, N: 0, S: 0 };

  /* smoothstep */
  function ss(t) { t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); }

  /* PER-PART WIDTH SPECS. profile(t) is the expansion weight down the part's own
     row range (t=0 top row, t=1 bottom row), so the same spec is correct in all
     8 directions and survives a re-paint that moves the art. Weight 0 at a JOIN
     row is what keeps the silhouette continuous at every join at every dial
     value (addendum lesson 3: a part that juts past the part above it draws a
     hard border line that reads as the limb detaching). */
  /* LEG girth profile: nothing at the hip join, full through the thigh's meat,
     easing off toward the knee/ankle. Capped at 0.55 of the arm amplitude -- see
     the note on parts 9/10. */
  function legProfile(t) {
    if (t < 0.10) return 0;
    if (t < 0.45) return 0.55 * ss((t - 0.10) / 0.35);
    if (t < 0.80) return 0.55;
    return 0.55 * (1 - ss((t - 0.80) / 0.20));
  }

  const PART_SPEC = {
    /* TORSO. 0 through the chest (the bust/pec line and the nipple row must not
       move), swelling to full at the navel, easing back at the hip so the belly
       never overhangs the thighs. */
    4: {
      dial: 'belly', biasAmp: 0.5, minW: 5,
      /* THE TORSO ANSWERS TO TWO DIALS. Belly swells at the navel; SHOULDERS
         works the opposite end -- full at the shoulder band, gone by the navel --
         so the two never fight over the same rows and a wide-shouldered thin man
         and a narrow-shouldered heavy one are both reachable. This is the pair
         that makes a female silhouette without a second rig. */
      /* A LIST, not one entry: the torso is the one part three dials can reach --
         belly at the navel, shoulders at the cap, hips at the pelvis. Each owns a
         different band, so they compose instead of fighting. */
      also: [
        { dial: 'shoulders', profile: function (t) {
          if (t < 0.18) return 1;                       /* the shoulder band itself */
          if (t < 0.55) return 1 - ss((t - 0.18) / 0.37); /* ease out through the chest */
          return 0;                                     /* hips own the bottom, not this dial */
        } },
        { dial: 'hips', profile: function (t) {
          if (t < 0.55) return 0;                       /* shoulders own the top */
          return ss((t - 0.55) / 0.45);                 /* swell into the pelvis, full at the base */
        } }
      ],
      /* THE SHOULDER TAKES A SHARE (Paolo 7/28/26): "why can't you just compact and
         widen the shoulder to accommodate... it's very upsetting to see the arms
         getting fucked up... their arms squiggly fucked up."

         The chest used to return 0 -- pinned -- while the gut moved a full 3px.
         Measured on S, belly -1/0/+1: the shoulder row stayed 18, 18, 18 while the
         navel went 15, 19, 23. A fixed shoulder over a moving waist is a STEP in the
         silhouette, and a step is exactly what reads as squiggly: the outer edge went
         out at the shoulder, back in at the waist, out again at the hip. Direction
         flips down the edge went from 1 at neutral to 3 at belly -1.

         So THE SQUIGGLE AND THE SHOULDER ARE ONE BUG, not two. A thin man is narrow
         at the shoulder too; a heavy one is broader. The chest now takes SH of the
         dial and eases up to the full amount at the navel, so the whole torso tapers
         as one shape and the edge runs monotonic again.

         The very top still barely moves (SH * 0.35 at t=0) because that row joins the
         neck, and a shoulder that jumps away from the neck is the detached-limb bug
         the zero was originally protecting against. It is a share, not a free pass. */
      profile: function (t) {
        var SH = 0.5;                                   /* the chest/shoulder share */
        if (t < 0.35) return SH * (0.35 + 0.65 * ss(t / 0.35));
        if (t < 0.75) return SH + (1 - SH) * ss((t - 0.35) / 0.40);
        return 1 - 0.45 * ss((t - 0.75) / 0.25);
      }
    },
    /* ARMS. 0 at the shoulder cap and 0 at the wrist, so the arm joins the torso
       and the hand exactly as painted at every dial value; only the meat of the
       limb thickens. */
    /* minW 4 IS A LOOK RULE, not a safety net (Paolo 7/26: "it seems like it's
       already breaking how the animation looks, where shit looks chopped").
       The renderer outlines a limb's outer AND inner column, so a 5px arm shows
       exactly 3 pixels of skin. Shrink it to 3 and only ONE pixel of skin is
       left between two dark lines -- the arm stops reading as an arm and reads
       as a stripe glued to the body. Four columns keeps two pixels of skin at
       the thinnest setting, which still reads as a limb. */
    5: { dial: 'arms', biasAmp: 0, minW: 4, profile: armProfile },
    6: { dial: 'arms', biasAmp: 0, minW: 4, profile: armProfile },
    /* LIMB THICKNESS IS ONE DIAL (Paolo 7/29/26: "arm width can be tied to leg
       width too"). Thin arms on tree-trunk legs is not a body anyone has; limb
       girth correlates across a person, so the ARMS dial drives the thighs too.
       It is deliberately GENTLER on a leg: the arm amplitude is +-45% because an
       arm is a 3-4px strip that needs a big fraction to read at all, and putting
       that same 45% on a 6px thigh would be a cartoon. The profile caps at 0.55,
       so a leg moves +-25% -- a proportionally similar change on a thicker limb.
       Zero at the hip and zero at the ankle, so the leg still joins the pelvis
       and the foot exactly as painted at every setting. */
    /* minW 4, NOT 5, and it was measured: the thigh's own painted row IS 5px, so a
       floor of 5 made the whole NARROW half of the dial dead -- thigh 5/5/5/5/7
       across the range. Four matches the arm's floor and leaves two pixels of skin
       between the two outline columns, which still reads as a limb. */
    9:  { dial: 'arms', biasAmp: 0, minW: 4, profile: legProfile },
    10: { dial: 'arms', biasAmp: 0, minW: 4, profile: legProfile }
  };
  /* The shoulder end ramps SLOWLY (Paolo 7/26, on the render). A short ramp put
     the arm at full thickness on the row directly under the 3px shoulder cap:
     the silhouette jumped 3 -> 7 in one row and the whole top of the body read
     as a sloped CAPE instead of a shoulder. Widening over the top third turns
     that step into a deltoid running down into the bicep. The wrist end still
     ramps short, because a forearm genuinely does neck down fast into the hand. */
  function armProfile(t) {
    if (t < 0.34) return ss(t / 0.34);
    if (t > 0.84) return ss((1 - t) / 0.16);
    return 1;
  }

  const DIAL_NAMES = ['height', 'belly', 'arms', 'shoulders', 'armLength', 'hips'];

  function neutral(v) {
    if (!v) return true;
    for (let i = 0; i < DIAL_NAMES.length; i++) if (v[DIAL_NAMES[i]]) return false;
    return true;
  }
  function clampDial(x) { x = +x || 0; return x < -1 ? -1 : x > 1 ? 1 : x; }
  function sanitize(v) {
    const o = {};
    for (let i = 0; i < DIAL_NAMES.length; i++) o[DIAL_NAMES[i]] = clampDial(v && v[DIAL_NAMES[i]]);
    return o;
  }

  /* --------------------------------------------------------------------------
     HEIGHT: skeleton warp on the POSE side only.
     Anchored on the GROUND LINE (the lower foot), so the feet stay planted and
     the OCCUPANCY LAW contract is untouched -- one body, one cell, feet on the
     same floor row at every height. The rest skeleton is NOT warped: the art was
     painted there and stays bound there; the skinner's along-bone scale is what
     turns a longer bone into a taller body.
     -------------------------------------------------------------------------- */
  function warpPose(pose, h) {
    if (!h) return pose;
    const s = 1 + h * AMP.height, out = {};
    for (const d in pose) {
      const P = pose[d], n = {};
      let ground = -1e9;
      if (P.footA) ground = Math.max(ground, P.footA[1]);
      if (P.footB) ground = Math.max(ground, P.footB[1]);
      if (ground < -1e8) ground = CH - 1;
      for (const j in P) n[j] = [P[j][0], ground + (P[j][1] - ground) * s];
      /* HEAD KEEPS ITS AUTHORED BONE, EXACTLY. A taller adult is not a bigger
         head; scaling the head bone would scale nothing visually (the head is a
         rigid stamp) but WOULD drag the stamp's midpoint anchor off the neck. */
      if (P.neck && P.headTop) n.headTop = [n.neck[0] + (P.headTop[0] - P.neck[0]),
                                            n.neck[1] + (P.headTop[1] - P.neck[1])];
      out[d] = n;
    }
    return out;
  }

  /* --------------------------------------------------------------------------
     WIDTH: rest-pixel remap, per direction, per part, row by row.
     INVERSE SAMPLE (target -> source), never forward scatter: a forward map
     leaves holes the moment the scale exceeds 1, and holes on a body read as
     shot-through art. The inverse sample cannot leave a hole and cannot empty a
     row, and it preserves any intentional interior gap because the source pixel
     has to actually be painted for the target to light up.
     -------------------------------------------------------------------------- */
  function warpPart(list, spec, dv, front, edgeOut, anchor, v) {
    const alsos = (spec.also && v) ? (Array.isArray(spec.also) ? spec.also : [spec.also]) : [];
    let anyAlso = false;
    for (let q = 0; q < alsos.length; q++) if (v[alsos[q].dial]) anyAlso = true;
    if (!dv && !anyAlso) return list.slice();
    /* group this PART's own pixels by row -- per part, never a shared grid
       (lesson 4: torso and legs claim the same hip pixels; a shared remap
       silently eats a torso row and corrupts every garment keyed to part 4) */
    const rows = {}, ys = [];
    for (let i = 0; i < list.length; i++) {
      const idx = list[i], x = idx % CW, y = (idx / CW) | 0;
      if (!rows[y]) { rows[y] = {}; ys.push(y); }
      rows[y][x] = 1;
    }
    if (!ys.length) return list.slice();
    ys.sort(function (a, b) { return a - b; });
    const y0 = ys[0], y1 = ys[ys.length - 1], span = Math.max(1, y1 - y0);
    const out = [];
    for (let r = 0; r < ys.length; r++) {
      const y = ys[r], set = rows[y];
      let mn = CW, mx = -1;
      for (const xs in set) { const x = +xs; if (x < mn) mn = x; if (x > mx) mx = x; }
      const w = mx - mn + 1;
      const t = (y - y0) / span;
      const pr = spec.profile(t);
      /* TWO DIALS CAN REACH ONE ROW (belly at the navel, shoulders at the cap).
         They are summed as fractional width, never multiplied, so neither can
         cancel the other and each keeps its own amplitude. */
      let amt = dv * (AMP[spec.dial]) * pr;
      for (let q = 0; q < alsos.length; q++) {
        const a = alsos[q], av = v[a.dial] || 0;
        if (av) amt += av * (AMP[a.dial]) * a.profile(t);
      }
      const k = 1 + amt;
      if (Math.abs(k - 1) < 1e-9 || w < 2) {   /* untouched row: copy verbatim */
        if (edgeOut) edgeOut[y] = [0, 0];
        for (const xs in set) out.push(y * CW + (+xs));
        continue;
      }
      const grow = (k - 1) * w;
      /* front bias: which side of the row the added width lands on */
      let shareR = 0.5 + 0.5 * (spec.biasAmp * (front || 0));
      /* PER-ROW ANCHOR (arms). anchor(y) returns -1/+1 for the side that must
         stay PUT on this row; the whole change then lands on the other side.
         See ARM_ANCHOR below for why this exists -- it is the difference
         between a thinner arm and no arm at all in profile. */
      let held = 0;
      if (anchor) { held = anchor(y, mn, mx); if (held === 1) shareR = 0; else if (held === -1) shareR = 1; }
      let nMin = Math.round(mn - grow * (1 - shareR));
      let nMax = Math.round(mx + grow * shareR);
      /* NEVER let a row collapse (lesson 6: thin art must never be culled) and
         never let it leave the canvas. */
      /* THE FLOOR MUST RESPECT THE ANCHOR. Re-centring the row when it hits the
         minimum width silently SLID the whole limb sideways -- facing N the arm
         walked 2px across the body and the "thinner" arm ended up wider than
         canon (found by dumping per-row extents, 7/26). When a side is held,
         grow back out from THAT side only; only an unanchored row may recentre. */
      const minW = Math.min(w, spec.minW);
      if (nMax - nMin + 1 < minW) {
        if (held === 1) nMin = nMax - minW + 1;
        else if (held === -1) nMax = nMin + minW - 1;
        else { const c = Math.round((nMin + nMax) / 2); nMin = c - ((minW - 1) >> 1); nMax = nMin + minW - 1; }
      }
      if (nMin < 0) { nMax += -nMin; nMin = 0; }
      if (nMax > CW - 1) { nMin -= (nMax - (CW - 1)); nMax = CW - 1; }
      if (nMin < 0) nMin = 0;
      if (edgeOut) edgeOut[y] = [nMin - mn, nMax - mx];   /* how far each flank moved */
      const nW = nMax - nMin;
      let wrote = 0;
      for (let xt = nMin; xt <= nMax; xt++) {
        const f = nW > 0 ? (xt - nMin) / nW : 0;
        const xs = Math.round(mn + f * (mx - mn));
        if (set[xs]) { out.push(y * CW + xt); wrote++; }
      }
      if (!wrote) { for (const xs in set) out.push(y * CW + (+xs)); }   /* belt and braces */
    }
    return out;
  }

  /* THE FLANK CONTRACT (found by rendering, not by reasoning -- the exact class
     of bug the dead woman-rig arc kept manufacturing). On the head-on facings
     the hanging arms COVER the torso's flank, so a belly that only widens part 4
     is invisible behind the arm, and a belly that narrows tears a 1px HOLE of
     empty space between the torso and an arm that stayed put. Both are the same
     missing rule: the arms hang ON the flank, so when the flank moves, the whole
     arm unit (arm + its hand) moves with it, rigidly, by exactly the distance
     that flank moved on that row. Anatomy, and it costs nothing: the arm art is
     TRANSLATED, never reshaped (RIG LAW), so a shifted arm is byte-for-byte
     Paolo's painted arm.

     ARM UNITS: 5 (arm-L) + 7 (hand-L), 6 (arm-R) + 8 (hand-R). Side is measured
     from the art itself, per direction, against the torso's own centre -- never
     hardcoded, because L/R swap screen sides across the 8 facings. Inside a
     1.5px deadband (the profile facings, where both arms sit over the torso's
     centre and the gut protrudes past them instead of pushing them) the arms
     stay exactly where Paolo painted them. */
  const ARM_UNITS = [[5, 7], [6, 8]];
  function meanX(list) { if (!list || !list.length) return 0; let s = 0; for (let i = 0; i < list.length; i++) s += list[i] % CW; return s / list.length; }
  function rowExtents(list) {
    const r = {}; if (!list) return r;
    for (let i = 0; i < list.length; i++) { const idx = list[i], y = (idx / CW) | 0, x = idx % CW;
      const e = r[y]; if (!e) r[y] = [x, x]; else { if (x < e[0]) e[0] = x; if (x > e[1]) e[1] = x; } }
    return r;
  }
  /* THE ARM ANCHOR RULE (found by rendering profile E, not by reasoning).
     In rest space the arms hang BESIDE the torso on the head-on facings but sit
     entirely INSIDE the torso's own footprint in profile -- facing E, arm-L
     spans x 25-29 while the torso spans 24-31. Those two situations want
     opposite anchors, and picking one for both breaks the other:
       - BESIDE the torso: the INNER edge (the armpit) must stay put, or a
         thinning arm tears away from the body and leaves a gap.
       - INSIDE the torso (profile): the OUTER edge is the ONLY part of the arm
         that is on screen at all -- everything else is buried under the torso.
         Move it inward and the arm does not get thinner, it VANISHES. At every
         amplitude down to 0.15 the profile arm disappeared completely; that is
         not a thin arm, that is a missing limb.
     So: growing always pushes the outer edge outward, and shrinking pulls the
     INNER edge when the arm is beside the torso and the OUTER edge when it is
     buried in it. Returns the side that must stay put: -1 = left, +1 = right. */
  function armAnchor(torsoRows, torsoCx, dv) {
    return function (y, mn, mx) {
      const t = torsoRows[y];
      const outerIsLeft = ((mn + mx) / 2) < torsoCx;
      const buried = !!t && mn >= t[0] && mx <= t[1];
      const holdOuter = (dv < 0) && buried;
      /* hold the outer edge -> anchor that side; otherwise hold the inner edge */
      if (holdOuter) return outerIsLeft ? -1 : 1;
      return outerIsLeft ? 1 : -1;
    };
  }
  /* THE ARMPIT BRIDGE. An arm and the torso ride DIFFERENT bones, so once the
     pose deforms them their screen positions no longer move together: sliding
     the arm one pixel off the flank in rest space can open a one-pixel seam in
     the render even though the two parts are exactly adjacent in the data.
     (Found by rendering NE, not by reasoning about it.) So an arm that moves
     OUTWARD keeps its original inner columns as an anchor -- its outer edge
     travels with the belly, its armpit edge never leaves the torso. Moving
     INWARD needs no bridge: it can only overlap more, and parts are allowed to
     overlap (draw order resolves it, exactly like the hip row does today). */
  function shiftPart(list, rowShift, fallback, side) {
    const seen = {}, out = [];
    const rows = {};
    for (let i = 0; i < list.length; i++) {
      const idx = list[i], y = (idx / CW) | 0;
      (rows[y] = rows[y] || []).push(idx % CW);
    }
    for (const ys in rows) {
      const y = +ys, xs = rows[ys];
      let dx = rowShift[y]; if (dx === undefined) dx = fallback;
      dx = Math.round(dx || 0);
      const outward = (side < 0) ? (dx < 0) : (dx > 0);
      let inner = outward ? (side < 0 ? -1e9 : 1e9) : 0;
      if (outward) for (let k = 0; k < xs.length; k++) inner = (side < 0) ? Math.max(inner, xs[k]) : Math.min(inner, xs[k]);
      for (let k = 0; k < xs.length; k++) {
        const x0 = xs[k];
        let x = x0 + dx;
        if (x < 0) x = 0; else if (x > CW - 1) x = CW - 1;
        const a = y * CW + x; if (!seen[a]) { seen[a] = 1; out.push(a); }
        /* NO BRIDGE. Two earlier versions of this line both broke the arm:
           keeping the whole vacated band FATTENED it (a gut also gave the man
           bigger arms), and keeping only the innermost column left a GAP behind
           whenever the flank moved 2px. The arm is TRANSLATED, whole, full stop
           -- exactly what "the arm hangs on the flank" means. The armpit seam
           that motivated the bridge is handled where it belongs, by the ARMPIT
           OVERLAP below, which lets the TORSO reach under the arm instead of
           OVERLAP the source already has. Proven, not assumed: with the whole
           bridge mechanism removed, a full-clip-set sweep on the real surface
           (61 clips x 8 facings x 7 phases, every dial extreme) finds ZERO
           enclosed holes anywhere -- the seam the bridge was written for does
           not exist once the arm follows the flank properly. Dead machinery is
           worse than no machinery, so it is gone. */
      }
    }
    return out;
  }
  function warpLayers(layers, v) {
    /* EVERY WIDTH DIAL MUST BE NAMED HERE. Adding `hips` to PART_SPEC did nothing
       at all until it was added to this line too -- the rest-layer torso measured
       11px at every hip setting because warpLayers returned before it ever looked.
       A dial that is not in this list is silently dead, which is exactly how it
       failed, so the gate now checks this list against DIAL_NAMES. */
    if (!v.belly && !v.arms && !v.shoulders && !v.hips) return layers;
    const out = {};
    for (const d in layers) {
      const src = layers[d], dst = {}, front = FRONT[d] || 0;
      /* pass 1: the parts that own their own width */
      const edge = {};                                  /* torso row -> [dLeft, dRight] */
      const tRow = rowExtents(src[4]), tCx = meanX(src[4] || []);
      for (const p in src) {
        const spec = PART_SPEC[+p], dv = spec ? v[spec.dial] : 0;
        const anch = (dv && (+p === 5 || +p === 6)) ? armAnchor(tRow, tCx, dv) : null;
        dst[p] = spec ? warpPart(src[p], spec, dv, front, (+p === 4) ? edge : null, anch, v) : src[p].slice();
      }
      /* pass 2: the arm units ride the flank the belly just moved */
      /* THE ARMS RIDE THE SHOULDER TOO (Paolo 7/29/26). This used to fire for the
         BELLY only, so narrowing the shoulder moved the torso and left the arms
         hanging where they were -- measured on S, the silhouette at the shoulder
         row read 18px at every setting from -1 to 0, because the ARM is what the
         outline is made of up there, not the torso. An arm hangs FROM the
         shoulder: move the shoulder, the whole arm unit goes with it. This is the
         half that makes the biacromial dial actually narrow a body. */
      if ((v.belly || v.shoulders || v.hips) && src[4]) {
        const rows = Object.keys(edge).map(Number).sort(function (a, b) { return a - b; });
        if (rows.length) {
          const torsoCx = meanX(src[4]);
          const lastL = edge[rows[rows.length - 1]][0], lastR = edge[rows[rows.length - 1]][1];
          for (let u = 0; u < ARM_UNITS.length; u++) {
            const armP = ARM_UNITS[u][0], handP = ARM_UNITS[u][1];
            if (!src[armP]) continue;
            const side = meanX(src[armP]) - torsoCx;
            if (Math.abs(side) < 1.5) continue;          /* profile: the gut passes the arm, it does not push it */
            const pick = (side < 0) ? 0 : 1;
            /* THE ARM IS RIGID (Paolo 7/28/26: "their arms squiggly fucked up").
               This used to hand shiftPart a PER-ROW shift, so every row of the arm
               moved by that row's own flank delta -- which BENDS the arm into the
               waist contour. Measured on S at belly -1, the outer edge ran
               35 35 35 36 36 36 35 35 35 36 36: in, out, in, out. Three direction
               flips against one at neutral. That wave IS the squiggle he sees.
               An arm hangs FROM THE SHOULDER. It swings as one piece, so it takes
               ONE shift -- the flank delta at the row it attaches to -- and every
               row of it moves by that same amount. The code comment two blocks up
               has always said "the arm is TRANSLATED, whole, full stop"; it just
               was not doing it. RIG LAW is happier too: one integer translation
               cannot reshape his painted arm, a per-row one can. */
            let armTop = 1e9;
            for (let q = 0; q < src[armP].length; q++) {
              const ry = (src[armP][q] / CW) | 0; if (ry < armTop) armTop = ry;
            }
            let dxOne = edge[armTop] ? edge[armTop][pick] : undefined;
            if (dxOne === undefined) {                   /* shoulder above the belly rows: take the nearest row that moved */
              let best = null;
              for (let r = 0; r < rows.length; r++) if (best === null || Math.abs(rows[r] - armTop) < Math.abs(best - armTop)) best = rows[r];
              dxOne = (best === null) ? 0 : edge[best][pick];
            }
            const rowShift = {};                          /* same dx on every row = a rigid translation */
            for (let r = 0; r < rows.length; r++) rowShift[rows[r]] = dxOne;
            const tail = dxOne;                           /* below the torso too: the arm does not bend at the hip either */
            dst[armP] = shiftPart(dst[armP], rowShift, tail, side);
            if (src[handP]) dst[handP] = shiftPart(dst[handP], rowShift, tail, side);
          }
        }
      }
      out[d] = dst;
    }
    return out;
  }

  /* --------------------------------------------------------------------------
     apply(baked, dials) -> a baked-shaped package for the ONE rig.
     NEUTRAL RETURNS THE SAME OBJECT. Not a copy, not a rebuild: the identical
     reference, so the canon character cannot shift by a single pixel when this
     feature lands (the addendum's byte-identical requirement, made structural
     instead of merely tested).
     -------------------------------------------------------------------------- */
  /* ARM LENGTH: a BONE dial, like height -- the art is not stretched, the joints
     move and the skinner redraws his painted arm along the longer bone. Scaled
     from the SHOULDER, because that is where an arm hangs from: the elbow and the
     hand travel, the shoulder cap does not, so the arm never tears off the torso.
     The hand rides with it as one unit, which is what keeps a lengthened arm from
     leaving its hand behind. */
  function warpArmLength(pose, a) {
    if (!a) return pose;
    const s = 1 + a * AMP.armLength, out = {};
    for (const d in pose) {
      const P = pose[d], n = {};
      for (const j in P) n[j] = [P[j][0], P[j][1]];
      const units = [['shL', 'elL', 'handL'], ['shR', 'elR', 'handR']];
      for (let u = 0; u < units.length; u++) {
        const sh = P[units[u][0]];
        if (!sh) continue;
        for (let q = 1; q < 3; q++) {
          const j = units[u][q];
          if (!P[j]) continue;
          n[j] = [sh[0] + (P[j][0] - sh[0]) * s, sh[1] + (P[j][1] - sh[1]) * s];
        }
      }
      out[d] = n;
    }
    return out;
  }

  function apply(baked, dials) {
    if (neutral(dials)) return baked;
    const v = sanitize(dials);
    return {
      W: baked.W, H: baked.H,
      skeleton: baked.skeleton,          /* REST: where the art was painted. Never warped. */
      layers: warpLayers(baked.layers, v),
      pose: warpArmLength(warpPose(baked.pose, v.height), v.armLength),
      layerOverride: baked.layerOverride,
      swingAmt: baked.swingAmt,
      bodyVar: v
    };
  }

  return { apply: apply, neutral: neutral, sanitize: sanitize, clampDial: clampDial,
           warpPose: warpPose, warpLayers: warpLayers, warpPart: warpPart,
           warpArmLength: warpArmLength,
           AMP: AMP, FRONT: FRONT, PART_SPEC: PART_SPEC, DIAL_NAMES: DIAL_NAMES };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = BOH_BODYVAR;
