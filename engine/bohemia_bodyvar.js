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
    arms:   0.45    /* +-45% of arm half-width (arms are thin; thin needs more) */
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
  const PART_SPEC = {
    /* TORSO. 0 through the chest (the bust/pec line and the nipple row must not
       move), swelling to full at the navel, easing back at the hip so the belly
       never overhangs the thighs. */
    4: {
      dial: 'belly', biasAmp: 0.5, minW: 5,
      profile: function (t) {
        if (t < 0.35) return 0;
        if (t < 0.75) return ss((t - 0.35) / 0.40);
        return 1 - 0.45 * ss((t - 0.75) / 0.25);
      }
    },
    /* ARMS. 0 at the shoulder cap and 0 at the wrist, so the arm joins the torso
       and the hand exactly as painted at every dial value; only the meat of the
       limb thickens. */
    5: { dial: 'arms', biasAmp: 0, minW: 2, profile: armProfile },
    6: { dial: 'arms', biasAmp: 0, minW: 2, profile: armProfile }
  };
  function armProfile(t) {
    if (t < 0.14) return ss(t / 0.14);
    if (t > 0.86) return ss((1 - t) / 0.14);
    return 1;
  }

  const DIAL_NAMES = ['height', 'belly', 'arms'];

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
  function warpPart(list, spec, dv, front, edgeOut, anchor) {
    if (!dv) return list.slice();
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
      const pr = spec.profile((y - y0) / span);
      const k = 1 + dv * (AMP[spec.dial]) * pr;
      if (pr <= 0 || Math.abs(k - 1) < 1e-9 || w < 2) {   /* untouched row: copy verbatim */
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
      if (anchor) { const a = anchor(y, mn, mx); if (a === 1) shareR = 0; else if (a === -1) shareR = 1; }
      let nMin = Math.round(mn - grow * (1 - shareR));
      let nMax = Math.round(mx + grow * shareR);
      /* NEVER let a row collapse (lesson 6: thin art must never be culled) and
         never let it leave the canvas. */
      const minW = Math.min(w, spec.minW);
      if (nMax - nMin + 1 < minW) { const c = Math.round((nMin + nMax) / 2);
        nMin = c - ((minW - 1) >> 1); nMax = nMin + minW - 1; }
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
        if (outward) {   /* bridge the vacated band back to the armpit */
          const gone = (side < 0) ? (x0 > inner + dx) : (x0 < inner + dx);
          if (gone) { const b = y * CW + x0; if (!seen[b]) { seen[b] = 1; out.push(b); } }
        }
      }
    }
    return out;
  }
  function warpLayers(layers, v) {
    if (!v.belly && !v.arms) return layers;
    const out = {};
    for (const d in layers) {
      const src = layers[d], dst = {}, front = FRONT[d] || 0;
      /* pass 1: the parts that own their own width */
      const edge = {};                                  /* torso row -> [dLeft, dRight] */
      const tRow = rowExtents(src[4]), tCx = meanX(src[4] || []);
      for (const p in src) {
        const spec = PART_SPEC[+p], dv = spec ? v[spec.dial] : 0;
        const anch = (dv && (+p === 5 || +p === 6)) ? armAnchor(tRow, tCx, dv) : null;
        dst[p] = dv ? warpPart(src[p], spec, dv, front, (+p === 4) ? edge : null, anch) : src[p].slice();
      }
      /* pass 2: the arm units ride the flank the belly just moved */
      if (v.belly && src[4]) {
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
            const rowShift = {}; for (let r = 0; r < rows.length; r++) rowShift[rows[r]] = edge[rows[r]][pick];
            const tail = (side < 0) ? lastL : lastR;     /* below the torso: hold the hip flank's own shift */
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
  function apply(baked, dials) {
    if (neutral(dials)) return baked;
    const v = sanitize(dials);
    return {
      W: baked.W, H: baked.H,
      skeleton: baked.skeleton,          /* REST: where the art was painted. Never warped. */
      layers: warpLayers(baked.layers, v),
      pose: warpPose(baked.pose, v.height),
      layerOverride: baked.layerOverride,
      swingAmt: baked.swingAmt,
      bodyVar: v
    };
  }

  return { apply: apply, neutral: neutral, sanitize: sanitize, clampDial: clampDial,
           warpPose: warpPose, warpLayers: warpLayers, warpPart: warpPart,
           AMP: AMP, FRONT: FRONT, PART_SPEC: PART_SPEC, DIAL_NAMES: DIAL_NAMES };
})();
if (typeof module !== 'undefined' && module.exports) module.exports = BOH_BODYVAR;
