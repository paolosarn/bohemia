/* BOHEMIA LOOK SHOTS (8/8/26) — TAKE THE PICTURE, SO HE NEVER HAS TO GO FIND IT.
 *
 * Paolo 8/8, LOCKED (laws/BOHEMIA_ADDENDUM_SHOW_ME_PICTURES_IN_A_TAB_8_8_26.md):
 *   "don't say play the run so I can see the art assets and what's wrong ...
 *    show me pictures put it in one of the tabs ... I can't be exploring and
 *    hunting your new additions ... just give me pictures and put it in a tab"
 *
 * The valley is 84.9 km2. Asking the director to walk it until he bumps into a
 * change is asking him to do a search the machine can do in seconds. So this does
 * the search: for every SUBJECT it opens the REAL page in a real browser at iPhone
 * portrait, hunts the live world for an actual instance, frames the camera ON it,
 * and photographs what he would see.
 *
 * VERIFY ON THE REAL SURFACE (7/18) is the whole design. Nothing here mocks a
 * scene or draws its own preview -- it drives slices/BOHEMIA_CITY_WORLD.html, the
 * same file the alpha opens, and screenshots the canvas the game drew into. A
 * picture from a side-door probe is the same lie as a verdict from one.
 *
 * A SUBJECT MUST FIND ITS OWN INSTANCE OR FAIL LOUDLY. `find` returns a world
 * position or null; a null is reported as a MISS and no file is written, because
 * a picture of the wrong place is worse than no picture -- it would tell him the
 * feature looks like empty asphalt.
 *
 *   node tools/bohemia_look_shots.js [--only <id>]
 *     -> slices/look/<id>.png   +   records/BOHEMIA_LOOK_MANIFEST.json
 */
const path = require('path');
const fs = require('fs');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ROOT = path.join(__dirname, '..');
const OUTDIR = path.join(ROOT, 'slices', 'look');
const MANIFEST = path.join(ROOT, 'records', 'BOHEMIA_LOOK_MANIFEST.json');
const ONLY = (process.argv.includes('--only') && process.argv[process.argv.indexOf('--only') + 1]) || null;
const STAMP = process.env.BOHEMIA_LOOK_STAMP || '8/8/26';

/* ---------------------------------------------------------------------------
 * THE SUBJECTS. One row per thing Paolo should be able to LOOK at.
 * `find` runs inside the page and returns {hx, hy, zoom} or null.
 * `caption` is plain English and MUST name the tab (NAME THE TAB, 7/28).
 * ------------------------------------------------------------------------- */
const SUBJECTS = [
  {
    id: 'the-terms-fold',
    title: 'THE CARD FITS AGAIN',
    caption: 'Five different systems write onto a person now and the card had quietly grown to 96 percent of your screen -- one more thing and it would have run off the bottom. So the stuff that is true of the WHOLE outfit and never changes (what they want, what they hold, what they pay in) collapses to one line the moment you have done anything for them, because you have already read it. Tap that line and it all comes back. Down to 84 percent. CITY tab, tap somebody you have helped.',
    keep: '#ctcard',
    open: `(() => {
      const bases = ctBases() || {}; let who = null, fid = null;
      for (const b of Object.values(bases)) {
        hx = b.x*FN + 2; hy = b.y*FN + 2;
        for (const p of ctEveryone()) { const f = ctFactionOf(p); if (f) { who = p; fid = f; break; } }
        if (who) break;
      }
      if (!who) return null;
      const at = ctAt(who); hx = at[0] + 1; hy = at[1];
      const sv = ctBelongSave();
      sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {}; sv.meta.commit = {};
      /* MEET THEM FOR REAL FIRST. Setting gave=6 on somebody the card also calls
         FIRST TIME is a picture that contradicts itself, and only looking at the
         rendered pixels catches that. ctOpen() is what counts a meeting. */
      ctSawCell(); ctOpen();
      for (let i = 0; i < 3; i++) { ctClose(); ctOpen(); }
      sv.meta.gave[fid] = 6; sv.meta.owed[fid] = 3; sv.meta.commit[fid] = 'sided';
      ctClose(); ctOpen();
      return { card: true, fid: fid };
    })()`,
  },
  {
    id: 'the-collection',
    title: 'THEY ARE NOT WAITING',
    caption: 'This is what the free thing was for. You took what the Cartel was offering three times, and now that they count you they are asking -- and they are not waiting for the polite gap between asks, because that gap is for people who do not owe them. Saying no here does not cost you one rung, it costs you one for every favour you took. CITY tab, tap a person.',
    keep: '#ctcard',
    open: `(() => {
      const bases = ctBases() || {}; let who = null, fid = null;
      for (const b of Object.values(bases)) {
        hx = b.x*FN + 2; hy = b.y*FN + 2;
        for (const p of ctEveryone()) { const f = ctFactionOf(p); if (f) { who = p; fid = f; break; } }
        if (who) break;
      }
      if (!who) return null;
      const at = ctAt(who); hx = at[0] + 1; hy = at[1];
      const sv = ctBelongSave();
      sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {}; sv.meta.commit = {};
      ctSawCell(); ctOpen();
      for (let i = 0; i < 3; i++) {
        const f = document.getElementById('ctfavour'); if (f) f.click();
        ctClose(); ctOpen();
      }
      sv.meta.gave[fid] = 6;              /* COUNTED, so they start asking */
      ctClose(); ctOpen();
      return { card: true, fid: fid };
    })()`,
  },
  {
    id: 'the-favour',
    title: 'THE FIRST THING IS FREE',
    caption: 'The other direction, finally. Some outfits give you something the first time you meet them, it costs you nothing, and that is exactly the part to worry about -- the card starts keeping a tally of what you have taken. Others hand you nothing until they count you, and then it spends the standing you built. One outfit gives nothing to anybody ever. CITY tab, tap a person.',
    keep: '#ctcard',
    open: `(() => {
      const bases = ctBases() || {}; let who = null, fid = null;
      for (const b of Object.values(bases)) {
        hx = b.x*FN + 2; hy = b.y*FN + 2;
        for (const p of ctEveryone()) { const f = ctFactionOf(p); if (f) { who = p; fid = f; break; } }
        if (who) break;
      }
      if (!who) return null;
      const at = ctAt(who); hx = at[0] + 1; hy = at[1];
      const sv = ctBelongSave();
      sv.meta.gave = {}; sv.meta.owed = {}; sv.meta.claims = {}; sv.meta.commit = {};
      ctSawCell(); ctOpen();
      const f = document.getElementById('ctfavour'); if (f) f.click();
      ctClose(); ctOpen();
      return { card: true, fid: fid };
    })()`,
  },
  {
    id: 'the-claim',
    title: 'THEY ASK YOU BACK',
    caption: 'Once an outfit COUNTS you it starts asking, and what it asks for is the thing it already wanted. Saying yes buys you nothing -- it is the rent on being counted. Saying no drops you straight back below counted, and they remember which way you went. CITY tab, tap a person you have done favours for.',
    keep: '#ctcard',
    open: `(() => {
      const bases = ctBases() || {}; let who = null, fid = null;
      for (const b of Object.values(bases)) {
        hx = b.x*FN + 2; hy = b.y*FN + 2;
        for (const p of ctEveryone()) { const f = ctFactionOf(p); if (f) { who = p; fid = f; break; } }
        if (who) break;
      }
      if (!who) return null;
      const at = ctAt(who); hx = at[0] + 1; hy = at[1];
      const sv = ctBelongSave();
      sv.meta.gave = {}; sv.meta.gave[fid] = 6;
      sv.meta.commit = {}; sv.meta.commit[fid] = 'sided';
      sv.meta.claims = {};
      ctSawCell(); ctOpen();
      return { card: true, fid: fid };
    })()`,
  },
  {
    id: 'the-wall',
    title: 'THE WALL: turning up runs out of road',
    caption: 'Walk up to anybody who runs with an outfit and this is their card. You have done what they want five times, and it says so: turning up gets you no further than USEFUL, and COUNTED is not for sale at any number of favours. The only button that passes it is saying out loud that you are with them. CITY tab, tap a person.',
    keep: '#ctcard',
    /* A MOMENT, NOT A PLACE, and it needs a REAL affiliated person -- the whole
       point of the turn that added it is that stubbing the faction is how four
       green turns hid an outage. If the valley has nobody, this MISSES and says
       so rather than photographing a stub. */
    open: `(() => {
      const bases = ctBases() || {}; let who = null, fid = null;
      for (const b of Object.values(bases)) {
        hx = b.x*FN + 2; hy = b.y*FN + 2;
        for (const p of ctEveryone()) { const f = ctFactionOf(p); if (f) { who = p; fid = f; break; } }
        if (who) break;
      }
      if (!who) return null;
      const at = ctAt(who); hx = at[0] + 1; hy = at[1];
      const sv = ctBelongSave();
      sv.meta.gave = {}; sv.meta.gave[fid] = 5; sv.meta.commit = {};
      ctSawCell(); ctOpen();
      return { card: true, fid: fid };
    })()`,
  },
  {
    id: 'vista',
    title: 'THE VISTA: the mountain overlook',
    caption: 'THE DEMO MONEY SHOT. Stand on the west rim and the whole valley is laid out below you, drawn by the valley view that already existed. RUN tab, on reaching the overlook.',
    open: `(() => { if (!window.__VISTA) return null; return window.__VISTA.open() ? {vista:true} : null; })()`,
  },
  {
    id: 'dead-suburb',
    title: 'THE DEAD: a suburban street',
    caption: 'Bones lying in the open on a suburb street, bleached and scattered by ten years of scavengers. RUN tab.',
    find: `(() => {
      for (let ty = 26; ty < 74; ty++) for (let tx = 26; tx < 74; tx++) {
        const t = om.at(tx, ty); if (!t || t.district !== 'suburb') continue;
        tileMeta(tx, ty); const e = deadForCell(tx, ty); const o = e.list.filter(z => !z.interior);
        if (o.length >= 3) return { hx: tx*FN + o[0].x, hy: ty*FN + o[0].y, zoom: 44 };
      } return null; })()`,
  },
  {
    id: 'dead-road',
    title: 'THE DEAD: the road out',
    caption: 'The exodus road. Remains on the asphalt where people stopped walking. RUN tab.',
    find: `(() => {
      for (let ty = 24; ty < 76; ty++) for (let tx = 24; tx < 76; tx++) {
        const t = om.at(tx, ty); if (!t || (t.district !== 'freeway' && t.district !== 'arterial')) continue;
        tileMeta(tx, ty); const e = deadForCell(tx, ty); const o = e.list.filter(z => !z.interior);
        if (o.length >= 3) return { hx: tx*FN + o[0].x, hy: ty*FN + o[0].y, zoom: 44 };
      } return null; })()`,
  },
  {
    id: 'dead-desert',
    title: 'THE DEAD: the walk-out',
    caption: 'Open desert. The ones who walked out and did not make it, thin and scattered, no mummified bodies because nothing out here is sealed. RUN tab.',
    find: `(() => {
      for (let ty = 20; ty < 80; ty++) for (let tx = 20; tx < 80; tx++) {
        const t = om.at(tx, ty); if (!t || t.district !== 'desert') continue;
        tileMeta(tx, ty); const e = deadForCell(tx, ty); const o = e.list.filter(z => !z.interior);
        if (o.length >= 2) return { hx: tx*FN + o[0].x, hy: ty*FN + o[0].y, zoom: 44 };
      } return null; })()`,
  },
  {
    id: 'the-signals-are-back',
    title: 'HIS SIGNALS, BACK ON THE INTERSECTIONS',
    caption: 'The 348-sprite traffic signal set you approved on 7/17 stopped appearing anywhere the day the roads started drawing themselves from their own modules. One flag meant BOTH "this cell is a road" AND "draw it the old way", so turning the second off turned the first off with it, and 274 real intersections lost their signals in silence. Measured at zero draws; here they are. RUN tab.',
    find: `(() => {
      for (let ty = 4; ty < om.n - 4; ty++) for (let tx = 4; tx < om.n - 4; tx++) {
        let m; try { m = tileMeta(tx, ty); } catch (e) { continue; }
        if (!m || !m.isRoad) continue;
        if (!((m.N || m.S) && (m.E || m.W))) continue;
        return { hx: tx*FN + (FN >> 1), hy: ty*FN + (FN >> 1), zoom: 26 };
      } return null; })()`,
  },
  {
    id: 'the-proper-sidewalk',
    title: 'THE KERB AND THE LANE LINE',
    caption: 'You said do not forget the proper sidewalks. The sidewalk surface was already your good concrete, but the KERB beside it was wearing the house-yard dirt pool and the LANE LINE was wearing blank asphalt, so the road had no line on it. Both now wear the tiles you approved on 7/14: pale concrete with the panel joints for the kerb, and the thirty-year washed white line for the lane. RUN tab, stand on any big road.',
    find: `(() => {
      /* STAND ON A KERB, not just anywhere on a road: the whole point is the join between
         the walk, the kerb and the lane, so the camera has to be where all three meet. */
      for (let ty = 6; ty < om.n - 6; ty++) for (let tx = 6; tx < om.n - 6; tx++) {
        const t = om.at(tx, ty); if (!t || t.district !== 'arterial') continue;
        let m; try { m = tileMeta(tx, ty); } catch (e) { continue; }
        if (!m || !m.kit) continue;
        const sp = BohemiaDistrictKit.get('arterial');
        let kerb = -1;
        for (const c in sp.legend) if (/curb|gutter/i.test(sp.legend[c].name)) kerb = +c;
        if (kerb < 0) return null;
        /* CENTRE ON THE PAINT. The first cut stood ON the kerb at zoom 16 and the road
           filled half the frame with no line in it -- a picture of half the fix. The second
           tried to find a kerb and a lane line on the SAME ROW and missed everywhere,
           because the markings run along the road rather than across it. At this zoom the
           whole cross-section is in frame from the lane line, so stand on the paint. */
        let lane = -1;
        for (const c in sp.legend) if (/lane line/i.test(sp.legend[c].name)) lane = +c;
        for (let ly = 6; ly < FN - 6; ly++) for (let lx = 6; lx < FN - 6; lx++)
          if (m.kit[ly * FN + lx] === lane)
            return { hx: tx * FN + lx, hy: ty * FN + ly, zoom: 26 };
      } return null; })()`,
  },
  {
    /* ADDED 8/24. This picture has been in the tab since 8/20 with NO SHOOTER, so every time
       the city changed it went stale and nobody could retake it -- CHARACTER handed it over
       twice as an unfixable red. It is not unfixable and it never was: it photographs the same
       surface as every other shot in this file, it just was not a subject. Title and caption
       are the 8/20 originals, word for word -- the picture is being given a way to be retaken,
       not rewritten. */
    id: 'the-spawn-sidewalk',
    title: 'THE NEIGHBOURHOOD YOU WAKE UP IN',
    caption: 'Two passes on the street you spawn on. The sidewalks were being laid all along and the renderer had no case for them, so they drew as dead dirt -- they wear your concrete now. And every house sat in one flat empty rectangle: nine tile codes in the whole suburb and not one of them a prop. Front yards are DECORATIVE GRAVEL now, which is what a Las Vegas yard actually is and the one thing that survives a dead world, with wind-drifted debris against the kerb in about a third of them. RUN tab.',
    find: `(() => {
      /* STAND WHERE THE WALK MEETS THE YARD. The whole subject is the join: sub code 10 is
         the sidewalk that used to draw as dead dirt, code 11 the decorative gravel that
         replaced the empty rectangle. A frame with only one of them in it is a picture of
         half the fix, which is the mistake the-proper-sidewalk already made once. */
      for (let ty = 6; ty < om.n - 6; ty++) for (let tx = 6; tx < om.n - 6; tx++) {
        const t = om.at(tx, ty); if (!t || t.district !== 'suburb') continue;
        let m; try { m = tileMeta(tx, ty); } catch (e) { continue; }
        if (!m || !m.sub) continue;
        for (let ly = 8; ly < FN - 8; ly++) for (let lx = 8; lx < FN - 8; lx++) {
          if (m.sub[ly * FN + lx] !== 10) continue;
          let gravel = false;
          for (let dy = -6; dy <= 6 && !gravel; dy++) for (let dx = -6; dx <= 6; dx++)
            if (m.sub[(ly + dy) * FN + (lx + dx)] === 11) { gravel = true; break; }
          if (gravel) return { hx: tx * FN + lx, hy: ty * FN + ly, zoom: 26 };
        }
      } return null; })()`,
  },
  {
    /* ADDED 8/25 (b). Steel was the second material out of the house-roof art. A tank shell
       shows it better than a crane does: the crane is a thin structure and reads as ten tiles
       on screen, the tank is a mass you can actually judge a material on. */
    id: 'everything-metal',
    title: 'THE RUST RUNS DOWN IT NOW',
    caption: 'Every metal thing in the city was wearing house roof tiles: the gantry crane at the rail yard, the conveyors at the quarry, the pipe galleries at the water plant, the guardrails on the freeway, this water tank. Twenty-five of them. They are steel now -- ribbed like real sheet metal, catching the light on one edge of every rib the way metal does and concrete does not, with the rust bleeding DOWNWARD from every fastener, because that is the direction water carries it. Ten years of it. RUN tab, walk into any industrial yard.',
    find: `(() => {
      for (let ty = 2; ty < om.n - 2; ty++) for (let tx = 2; tx < om.n - 2; tx++) {
        const t = om.at(tx, ty); if (!t || t.district !== 'reservoir') continue;
        let m; try { m = tileMeta(tx, ty); } catch (e) { continue; }
        if (!m || !m.kit) continue;
        for (let ly = 14; ly < FN - 14; ly++) for (let lx = 14; lx < FN - 14; lx++)
          if (m.kit[ly * FN + lx] === 6)
            return { hx: tx * FN + lx, hy: ty * FN + ly, zoom: 16 };
      } return null; })()`,
  },
  {
    /* ADDED 8/25. The road across the crest of the dam was TWO TILES WIDE -- 1.5 m at
       TILE=0.75 -- and its whole network read as unreachable because a gate counted as a wall.
       This is the picture of a road that is finally a road. */
    id: 'the-way-in',
    title: 'A ROAD ACROSS THE DAM',
    caption: 'Four places in the valley were built so that a car could not get into them at all, and this was the worst of them. The road over the top of the dam was two tiles wide, which is about five feet -- a footpath, not the highway that ran over Hoover Dam for seventy years. And the whole thing read as sealed off from the street anyway, because the machine that checks it counted the gate you drive through as a wall. Both fixed: the crest carries two real lanes with a parapet either side, and every district in the valley can now be driven into. And the dam is made of concrete now. It was wearing the HOUSE ROOF art -- the same shingle tiles as the little houses in the suburb, tinted grey -- because the game hands that art to anything standing up that is not a mountain. It is poured concrete now, with the horizontal lines where each five-foot lift of the pour stopped, which is what a real dam face looks like. RUN tab, walk out onto the dam.',
    find: `(() => {
      for (let ty = 2; ty < om.n - 2; ty++) for (let tx = 2; tx < om.n - 2; tx++) {
        const t = om.at(tx, ty); if (!t || t.district !== 'dam') continue;
        let m; try { m = tileMeta(tx, ty); } catch (e) { continue; }
        if (!m || !m.kit) continue;
        /* STAND ON THE CREST ROAD ITSELF, not on the wall beside it -- the subject is the
           width of the roadway, so the camera has to be in the middle of it. */
        for (let ly = 20; ly < FN - 20; ly++) for (let lx = 20; lx < FN - 20; lx++) {
          if (m.kit[ly * FN + lx] !== 1) continue;
          let run = 0;
          for (let k = -3; k <= 3; k++) if (m.kit[(ly + k) * FN + lx] === 1) run++;
          if (run >= 6) return { hx: tx * FN + lx, hy: ty * FN + ly, zoom: 22 };
        }
      } return null; })()`,
  },
  {
    /* ADDED 8/24. Two yards had their pole lights placed and then paved over by their own
       drive network, every seed, since the day they were written -- so this is a picture of
       something that has never once been on screen. Frames a code-9 pole light in the
       wrecking yard, which is where the approved lamp body now stands. */
    id: 'the-yards-lit',
    title: 'TWO YARDS THAT HAVE NEVER HAD A LIGHT',
    caption: 'The wrecking yard and the reservoir both put four pole lights down when they were built, and then paved straight over all four with their own dirt lanes -- so both places have been pitch dark since the day they were written, every seed, and nothing ever said a word, because a light that got overwritten looks exactly like a light that was never there. A machine that reads the world that actually got built found them. They stand now, and at night the power grid decides which ones burn. RUN tab, walk into a wrecking yard.',
    find: `(() => {
      for (let ty = 4; ty < om.n - 4; ty++) for (let tx = 4; tx < om.n - 4; tx++) {
        const t = om.at(tx, ty); if (!t || t.district !== 'boneyard') continue;
        let m; try { m = tileMeta(tx, ty); } catch (e) { continue; }
        if (!m || !m.kit) continue;
        for (let ly = 4; ly < FN - 4; ly++) for (let lx = 4; lx < FN - 4; lx++)
          if (m.kit[ly * FN + lx] === 9)
            return { hx: tx * FN + lx, hy: ty * FN + ly, zoom: 26 };
      } return null; })()`,
  },
  {
    id: 'the-bad-footing',
    title: 'GROUND YOU CANNOT SET YOUR FEET ON',
    caption: 'Loose ground: ballast, talus, rubble drift. Standing here you cannot brace, so everything physical hits you harder -- and the tip cuts both ways, because you can lead somebody else onto it. Until 8/20 this drew as flat colour and the only thing that told you it was dangerous was a line of text in the corner. Now the floor says it: broken chips, four values, no two pieces alike. RUN tab.',
    find: `(() => {
      const K = BohemiaDistrictKit;
      const want = {};
      for (const d of K.types()) {
        const sp = K.get(d); if (!sp || !sp.legend) continue;
        for (const c in sp.legend)
          if (BohemiaHazard.classOf(sp.legend[c], K) === 'AMPLIFIES') (want[d] = want[d] || []).push(+c);
      }
      /* CENTRE ON A HAZARD CELL, AND ON THE DENSEST ONE. Two wrong framings before this,
         both found by taking the picture and looking at it rather than by reading:
         the first took the first match anywhere and landed on the top row of the map, so
         four fifths of the frame was off-map blue; the second took the CENTROID of the
         patch, and the centroid of a scattered set is not in the set -- it put the camera
         on a loading pad in a rail yard with the ballast off screen. So: score every
         hazard cell by how many hazard cells sit in the 5x5 around it, and stand on the
         winner. That is the one place the frame is actually full of the thing. */
      let pick = null, best = -1;
      for (let ty = 6; ty < om.n - 6; ty++) for (let tx = 6; tx < om.n - 6; tx++) {
        const t = om.at(tx, ty); if (!t || !want[t.district]) continue;
        let m; try { m = tileMeta(tx, ty); } catch (e) { continue; }
        if (!m || !m.kit) continue;
        const hit = new Uint8Array(FN * FN);
        let any = 0;
        for (let i = 0; i < FN * FN; i++)
          if (want[t.district].indexOf(m.kit[i]) >= 0) { hit[i] = 1; any++; }
        if (any < 40) continue;
        for (let ly = 2; ly < FN - 2; ly++) for (let lx = 2; lx < FN - 2; lx++) {
          if (!hit[ly * FN + lx]) continue;
          let n = 0;
          for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++)
            if (hit[(ly + dy) * FN + lx + dx]) n++;
          if (n > best) { best = n; pick = { hx: tx*FN + lx, hy: ty*FN + ly, zoom: 22 }; }
        }
        if (best >= 25) return pick;      /* a solid 5x5 of it -- cannot do better */
      }
      return pick; })()`,
  },
  {
    id: 'the-hole',
    title: 'THE HOLE: ground you can be thrown into',
    caption: 'The crest of a quarry bench. Until 8/20 this was a WALL -- the deepest hole in the valley was something you bounced off. It is a void now: you cannot walk into it, it does not stop a body thrown at it, and being knocked in is fatal. Drawn darker than the rock it is cut from, because a drop reads as a floor at a different value. RUN tab.',
    /* FIND A REAL VOID, NOT A QUARRY. The subject is the tile, so the search is for the
       tile: walk the valley for a district whose legend declares a void, then find a cell
       of that district that actually EMITS it. A shot framed on a quarry that happens to
       have no bench crest in view would photograph the feature by not showing it.
       om.n, never a typed 96 (MAP BOUND ratchet). */
    find: `(() => {
      const K = BohemiaDistrictKit;
      const voidCodes = {};
      for (const d of K.types()) {
        const sp = K.get(d); if (!sp || !sp.legend) continue;
        for (const c in sp.legend) if (K.tileLayer(sp.legend[c])['void']) {
          (voidCodes[d] = voidCodes[d] || []).push(+c);
        }
      }
      for (let ty = 0; ty < om.n; ty++) for (let tx = 0; tx < om.n; tx++) {
        const t = om.at(tx, ty); if (!t || !voidCodes[t.district]) continue;
        let m; try { m = tileMeta(tx, ty); } catch (e) { continue; }
        if (!m || !m.kit) continue;
        const want = voidCodes[t.district];
        for (let ly = 0; ly < FN; ly++) for (let lx = 0; lx < FN; lx++) {
          if (want.indexOf(m.kit[ly*FN + lx]) < 0) continue;
          return { hx: tx*FN + lx, hy: ty*FN + ly, zoom: 30 };
        }
      } return null; })()`,
  },
  {
    id: 'dead-pit',
    title: 'THE PIT: the cemetery',
    caption: 'They stopped digging graves and dug one hole. The cemetery is a dumping pit now, about 34 bodies in a single heap. RUN tab.',
    /* SCAN THE WHOLE MAP, NOT A COMFORTABLE MIDDLE. Measured 8/11: this seed puts
       exactly three cemetery cells on the board -- (40,17), (57,67), (58,67) -- and
       the old 20..80 window could not see the first one. A rare district needs the
       whole valley, or the tool reports "no instance in the live world" about a
       world that has one.
       om.n, NEVER A TYPED 96 (MAP BOUND ratchet): the map size is the overmap's to
       state, and a literal here is a file that goes quietly wrong the day the
       valley changes size. */
    find: `(() => {
      for (let ty = 0; ty < om.n; ty++) for (let tx = 0; tx < om.n; tx++) {
        const t = om.at(tx, ty); if (!t || t.district !== 'cemetery') continue;
        tileMeta(tx, ty); const e = deadForCell(tx, ty); const o = e.list.filter(z => !z.interior);
        if (o.length >= 10) return { hx: tx*FN + o[0].x, hy: ty*FN + o[0].y, zoom: 30 };
      } return null; })()`,
  },
  {
    id: 'the-pit-dug',
    title: 'A PIT DUG IN THE DIRT',
    caption: 'Somebody dug here. The ground is sunk where the fill settled, the pale heap beside it is the earth that never went back in, and the dark green is growing on what is under it. Bare dirt and sand generate these now. RUN tab.',
    /* THE WHOLE VALLEY, and the BIGGEST dig on it. A pit only exists on bare
       ground, so hunting a comfortable middle band would photograph a lawn. */
    find: `(() => {
      let best=null, bn=0;
      for (let ty = 0; ty < om.n; ty++) for (let tx = 0; tx < om.n; tx++) {
        const t = om.at(tx, ty); if (!t) continue;
        if (!/desert|cemetery|landfill|farm|quarry|wash|basin|golf|park/.test(t.district||'')) continue;
        tileMeta(tx, ty); const e = pitsForCell(tx, ty);
        const fill = e.list.filter(p => p.part === 'fill' || p.part === 'green');
        if (fill.length > bn) { bn = fill.length; best = { tx, ty, p: fill[(fill.length/2)|0] }; }
        if (bn > 90) break;
      }
      if (!best) return null;
      return { hx: best.tx*FN + best.p.x, hy: best.ty*FN + best.p.y, zoom: 26 };
    })()`,
  },
  {
    id: 'dead-cluster',
    title: 'A CLUSTER: they died together',
    caption: 'The dead come in groups now, not sprinkled one by one. This is what you find in an abandoned block. RUN tab.',
    find: `(() => {
      let best=null, bn=0;
      for (let ty = 26; ty < 74; ty++) for (let tx = 26; tx < 74; tx++) {
        tileMeta(tx, ty); const e = deadForCell(tx, ty); const o = e.list.filter(z => !z.interior);
        if (o.length > bn && o.length < 25) { bn = o.length; best = { tx, ty, d: o[0] }; }
      }
      if (!best) return null;
      return { hx: best.tx*FN + best.d.x, hy: best.ty*FN + best.d.y, zoom: 30 };
    })()`,
  },
  {
    id: 'dead-density',
    title: 'THE DEAD: how thick they lie',
    caption: 'A wider view of the same ground, so the density reads. Too many, too few, or about right is the only call needed. RUN tab.',
    find: `(() => {
      let best = null, bestN = 0;
      for (let ty = 26; ty < 74; ty++) for (let tx = 26; tx < 74; tx++) {
        tileMeta(tx, ty); const e = deadForCell(tx, ty); const o = e.list.filter(z => !z.interior);
        if (o.length > bestN) { bestN = o.length; best = { tx, ty, d: o[0] }; }
      }
      if (!best) return null;
      return { hx: best.tx*FN + best.d.x, hy: best.ty*FN + best.d.y, zoom: 22 };
    })()`,
  },
];

/* ------------------------------------------------------------------ helpers */
function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }

/* THE ALPHA HAS CHROME OF ITS OWN. The world frame hides its own d-pad; the
   shell's tab bar and splash sit on top of the frame and would band every
   picture. Same rule as inside: ask what OVERLAYS the frame, never a blocklist
   of today's element ids. */
async function hideShellChrome(shell) {
  await shell.evaluate(() => {
    window.__LOOK_SHELL_HIDDEN = [];
    const fr = document.getElementById('cityFrame'); if (!fr) return;
    for (const el of document.body.querySelectorAll('*')) {
      if (el === fr || el.contains(fr)) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
      window.__LOOK_SHELL_HIDDEN.push([el, el.style.visibility]);
      el.style.visibility = 'hidden';
    }
    fr.style.visibility = 'visible';
  });
}
async function restoreShellChrome(shell) {
  await shell.evaluate(() => {
    for (const [el, v] of (window.__LOOK_SHELL_HIDDEN || [])) { try { el.style.visibility = v; } catch (e) {} }
    window.__LOOK_SHELL_HIDDEN = [];
  });
}

(async () => {
  ensureDir(OUTDIR);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  /* deviceScaleFactor 2, not 3. The shot has to live in the repository forever and
     a 3x phone frame is ~1.4 MB of PNG per picture. 2x is still sharp on his
     screen and roughly halves what every future commit carries. */
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  /* ---- DRIVE THE ALPHA, NOT THE WORLD PAGE (8/11) -------------------------
     Paolo 8/11: "anything thats human decay please make the art with a person
     next to it so u get the real scale and size."
     He could not have got scale off these pictures before today, and that was my
     bug and not his eye. The player's body reaches the world page by postMessage
     from the ALPHA's character bake (citySendPlayer). Open
     BOHEMIA_CITY_WORLD.html on its own -- exactly what this tool used to do --
     and PLAYER_CV stays null forever, so the man renders as a BLANK WHITE
     RECTANGLE. Every LOOK picture shipped before today stood a featureless box
     next to the bodies and called it a person.
     So the tool now opens the alpha and taps RUN the way he does. `shell` is the
     alpha; `ctx` is the city frame inside it. World globals (hx, HC, om,
     deadForCell) live in ctx; the chrome and the screenshot live in shell.
     VERIFY ON THE REAL SURFACE, taken literally: the surface is the thing he
     taps, not the file it happens to load. */
  const shell = page;
  await shell.goto('file://' + path.resolve(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html'),
    { waitUntil: 'load', timeout: 240000 });
  await shell.waitForTimeout(6000);
  /* TAP TO ENTER FIRST, THE WAY HE DOES. Measured 8/11: clicking the RUN tab
     while the front splash is still up loads the city frame BEHIND it, and the
     frame lays out at 0x0 -- so the screenshot came back solid black at 7 KB.
     The splash is a real door, not decoration; the tool has to open it. */
  await shell.evaluate(() => {
    const f = document.getElementById('front');
    if (f) { f.click(); const t = document.getElementById('fronttap'); if (t) t.click(); }
  });
  await shell.waitForTimeout(3000);
  const _runTab = await shell.evaluate(() => {
    /* NEVER SWALLOW A MISSING TAB (ONE WORLD TAB). A TOOL has no ok() to fail, and
       a tool that quietly shoots the wrong surface because the tab moved is worse
       than one that stops. It stops. */
    const t = [...document.querySelectorAll('.tab')].find(e => /RUN/i.test(e.textContent || ''));
    if (!t) return false;
    t.click(); return true;
  });
  if (!_runTab) throw new Error('the RUN tab is not in the alpha -- refusing to shoot the wrong surface');
  await shell.waitForTimeout(14000);
  const ctx = shell.frames().find(f => /CITY_WORLD/.test(f.url()));
  if (!ctx) { console.log('LOOK: the alpha never opened the world frame. No pictures taken.'); process.exit(1); }
  /* ASK MORE THAN ONCE, AND FAIL LOUD IF HE NEVER SHOWS UP. citySendPlayer can
     fire before the frame's listener exists. A picture with no human in it is
     the bug this change exists to end, so it is never shipped quietly. */
  let hasBody = false;
  for (let k = 0; k < 8 && !hasBody; k++) {
    await shell.evaluate(() => { try { citySendPlayer(); } catch (e) {} });
    await shell.waitForTimeout(2500);
    hasBody = await ctx.evaluate(() => !!PLAYER_CV);
  }
  if (!hasBody) { console.log('LOOK: the player body never arrived -- refusing to shoot a blank box.'); process.exit(1); }
  /* AND THE FRAME MUST ACTUALLY HAVE SIZE. A 0x0 iframe still loads, still
     answers evaluate(), still reports a player -- and photographs as solid
     black. Every check above passed while the picture was empty, so this asks
     the one question that catches it. */
  const frameBox = await shell.evaluate(() => {
    const fr = document.getElementById('cityFrame'); if (!fr) return [0, 0];
    const r = fr.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)];
  });
  if (frameBox[0] < 100 || frameBox[1] < 100) {
    console.log('LOOK: the city frame laid out at ' + frameBox.join('x') + ' -- the app never entered. No pictures.');
    process.exit(1);
  }
  await ctx.evaluate(() => { try { if (typeof MODE !== 'undefined' && MODE === 'city') swapMode(); } catch (e) {} });
  await shell.waitForTimeout(2500);

  const shots = [];
  for (const s of SUBJECTS) {
    if (ONLY && s.id !== ONLY) continue;
    /* A SUBJECT MAY OPEN ITSELF. The vista is a camera MOMENT, not a thing lying
       on the ground, so it has no world position to hunt for -- it has a trigger.
       Same contract either way: it either produces a real frame or it writes no
       picture and says why. */
    if (s.open) {
      let got = null, err = '';
      try { got = await ctx.evaluate(s.open); } catch (e) { err = ' — ' + String(e.message || e).split('\n')[0].slice(0, 120); }
      if (!got) { console.log('  MISS  ' + s.id.padEnd(16) + 'the moment did not open' + err); continue; }
      await shell.waitForTimeout(1400);
      await ctx.evaluate((keep) => {
        window.__LOOK_HIDDEN = [];
        const cv = document.getElementById('cv');
        for (const el of document.body.querySelectorAll('*')) {
          if (el === cv || el.contains(cv)) continue;
          /* THE PANEL THAT IS PART OF THE MOMENT STAYS UP. It used to be
             hardcoded to #vistaCard; a subject now names its own, because the
             second UI moment to want a picture (the person card) was not the
             vista and would have been hidden by the sweep that exists to
             remove chrome. */
          if (keep && (el.matches(keep) || el.closest(keep))) continue;
          const cs = getComputedStyle(el);
          if (cs.position !== 'absolute' && cs.position !== 'fixed') continue;
          if (cs.display === 'none' || cs.visibility === 'hidden') continue;
          const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
          window.__LOOK_HIDDEN.push([el, el.style.visibility]); el.style.visibility = 'hidden';
        }
      }, s.keep || '#vistaCard');
      const file2 = path.join(OUTDIR, s.id + '.png');
      await hideShellChrome(shell);
      await shell.screenshot({ path: file2 });
      await restoreShellChrome(shell);
      await ctx.evaluate(() => {
        for (const [el, v] of (window.__LOOK_HIDDEN || [])) { try { el.style.visibility = v; } catch (e) {} }
        window.__LOOK_HIDDEN = [];
        try { window.__VISTA && window.__VISTA.close(); } catch (e) {}
      });
      const kb2 = fs.statSync(file2).size / 1024;
      shots.push({ id: s.id, title: s.title, caption: s.caption, file: 'look/' + s.id + '.png',
                   at: null, kb: +kb2.toFixed(1), stamp: STAMP,
                   surface: 'slices/BOHEMIA_CITY_WORLD.html',
                   shooter: 'node tools/bohemia_look_shots.js --only ' + s.id });
      console.log('  SHOT  ' + s.id.padEnd(16) + kb2.toFixed(0).padStart(5) + ' KB   (a moment, not a place)');
      continue;
    }
    let spot = null, why = '';
    /* DO NOT SWALLOW THE REASON. The first run of this tool reported four clean
       MISSes and told me nothing, because the catch threw the error away -- the
       same swallow-the-failure bug this repo has now been bitten by four times.
       A miss must say WHY it missed. */
    try { spot = await ctx.evaluate(s.find); }
    catch (e) { why = ' — ' + String(e.message || e).split('\n')[0].slice(0, 120); }
    if (!spot) {
      /* A MISS IS REPORTED, NEVER PAPERED OVER. Writing a shot of wherever the
         camera happened to be would show him empty ground and read as "the
         feature does not work". */
      console.log('  MISS  ' + s.id.padEnd(16) + 'no instance found in the live world' + why);
      continue;
    }
    /* THE CAMERA CENTRES ON THE PLAYER, SO CENTRING ON THE SUBJECT PUTS THE
       PLAYER ON TOP OF IT. The clean-chrome shot still had the body underneath
       the character. Standing him a few tiles north lands the subject just below
       centre, in clear air, with nothing invented -- this is still the real
       surface, just photographed from a step away instead of from on top. */
    const STAND_OFF = 5;
    await ctx.evaluate(({ hxv, hyv, z }) => {
      hx = hxv; hy = hyv;
      if (typeof HC !== 'undefined' && z) HC = z;
      /* PHOTOGRAPH THE HOUR HE ACTUALLY OPENS THE GAME. I tried moving the
         clock to midday so the pit's cast shadow would read stronger, looked at
         the result, and it was WORSE: noon is the shortest shadow of the day and
         the bright ambient washed the ground flat. It was also the wrong
         instinct -- choosing a flattering hour to make my own feature look good
         is dressing the shot. The world opens at 06:00 and that is what he sees,
         so that is what gets photographed; if a cue does not read at his hour,
         the cue is what gets fixed. */
      /* GET THE CHROME OFF THE ART. His words: "so I can see the art assets and
         what's wrong". The D-pad, the button row and the toast are DOM sitting ON
         TOP of the canvas, so screenshotting the canvas element still composites
         them over the picture -- the first shot of the dead had a thumb-stick
         covering a quarter of the frame. They are hidden for the photograph and
         restored straight after; the GAME is untouched, only the picture is
         clean. */
      /* NAMING THE OVERLAYS BY ID DOES NOT HOLD. The first pass hid #pad/#hud/
         #topbar and the shot still had the CITY button, the BIKE button and a
         toast sitting on the art -- a blocklist of today's element names goes
         stale the moment a lane adds a button, which is the same "ask for the
         property, never the spelling" lesson the wall gate cost. So: hide
         EVERYTHING that is not the canvas, by asking what overlays it. */
      window.__LOOK_HIDDEN = [];
      const cv = document.getElementById('cv');
      for (const el of document.body.querySelectorAll('*')) {
        if (el === cv || el.contains(cv)) continue;
        const cs = getComputedStyle(el);
        if (cs.position !== 'absolute' && cs.position !== 'fixed') continue;
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) continue;
        window.__LOOK_HIDDEN.push([el, el.style.visibility]);
        el.style.visibility = 'hidden';
      }
      if (typeof render === 'function') render();
    }, { hxv: spot.hx, hyv: spot.hy - STAND_OFF, z: spot.zoom });
    await hideShellChrome(shell);
    await shell.waitForTimeout(1100);

    /* Photograph the CANVAS, not the chrome. He is judging the art. */
    /* THE WHOLE PHONE FRAME. The canvas lives inside the alpha's city iframe
       now, so reaching for '#cv' would reach into the frame and throw away the
       fact that this is the real app he taps. The alpha's own chrome is hidden
       above and restored below. */
    const file = path.join(OUTDIR, s.id + '.png');
    await shell.screenshot({ path: file });
    await restoreShellChrome(shell);
    await ctx.evaluate(() => {
      for (const [el, v] of (window.__LOOK_HIDDEN || [])) { try { el.style.visibility = v; } catch (e) {} }
      window.__LOOK_HIDDEN = [];
    });
    const kb = fs.statSync(file).size / 1024;
    /* RECORD HOW IT WAS TAKEN (8/24). Seventeen of these pictures have been in the tab since
       8/8 with no `shooter` line, and look_gate prints "NO SHOOTER RECORDED -- add one" for
       every one of them the moment the city changes -- which is every time this lane ships.
       Another lane read that as "no tool in the repo can retake it" and handed it over as an
       unfixable red. IT WAS NEVER UNFIXABLE: this file is the tool, it has always taken them,
       and it already supports --only. The only thing missing was the tool SAYING SO in the
       manifest it writes itself. A capability nobody can find is the same as one that does not
       exist -- and it cost a lane a red it could not close. */
    shots.push({ id: s.id, title: s.title, caption: s.caption, file: 'look/' + s.id + '.png',
                 at: { x: spot.hx, y: spot.hy, zoom: spot.zoom || null }, kb: +kb.toFixed(1), stamp: STAMP,
                 surface: 'slices/BOHEMIA_CITY_WORLD.html',
                 shooter: 'node tools/bohemia_look_shots.js --only ' + s.id });
    console.log('  SHOT  ' + s.id.padEnd(16) + kb.toFixed(0).padStart(5) + ' KB   at ' + spot.hx + ',' + spot.hy);
  }

  await browser.close();
  if (errs.length) errs.slice(0, 3).forEach(e => console.log('  page error: ' + e));

  /* MERGE, never clobber: a run with --only must not delete the other subjects'
     entries, or the tab silently loses everything the last lane put in it. */
  let prev = [];
  if (fs.existsSync(MANIFEST)) { try { prev = JSON.parse(fs.readFileSync(MANIFEST, 'utf8')).shots || []; } catch (e) {} }
  const byId = {};
  for (const p of prev) byId[p.id] = p;
  for (const s of shots) byId[s.id] = s;
  const all = Object.values(byId);
  fs.writeFileSync(MANIFEST, JSON.stringify({ built: STAMP, shots: all }, null, 1));
  console.log('LOOK: ' + shots.length + ' picture(s) taken, ' + all.length + ' in the tab -> ' + MANIFEST);
  process.exit(shots.length ? 0 : 1);
})();
