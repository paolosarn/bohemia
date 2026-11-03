/* ============================================================================
   WHAT HE SEES NOW (WORLD 8, 11/3/26; ask line 39; rules 151(g) and 155(b))

   PAOLO 10/24: 'research how far people can realistically see, because it's a city; you should only be able to see things
   straight down a street you're near.' The rule was built (RUN 10/25, __SIGHT_DOWN_THE_STREET__, mapSees: his own ring of
   blocks, straight down the street he stands on 4 blocks by day or lit and 1 in the dark, nothing past a corner, a circle on
   the open ground past the valley) and a roaming party outside it is not drawn. MEASURED BEFORE: on the glass nothing said
   what he sees. The ground he had seen once (the fog of 155(b), a radius that clears as he travels and stays cleared, his
   map that fills in where he has been) was all one light, so a party appearing two blocks off and vanishing at a corner had
   no reason on the glass, and EYES (10/25) never met a party shown straight down a street.

   NOW THE MAP'S TWO LEVELS OF FOG (the standard of the strategy map: the black of never seen, and the grey of seen before):
   the blocks he sees now are the painting at its own light; the ground he has seen before but cannot see from here is the
   same painting a little dimmer, his map remembering it; never seen stays the tape. It moves with him, block by block, and
   shrinks at night with the street sight. Drawn under the fog's tape, after the walkers (an out-of-sight party is not drawn
   at all, so nothing on it is dimmed but the ground and what stands on it).
   Hook: tools/bohemia_world_8_map_houses_patch.py (__WHAT_HE_SEES_NOW__). Gate: gates/what_he_sees_now_gate.js.
   ============================================================================ */
(function (root) {
  'use strict';
  var V = { on: true, dim: 0.38, col: '10,8,6', win: 8 };
  var CV = null, X = null, KEY = '', LAST = { builds: 0, inSight: 0, remembered: 0, drew: 0, key: '' };

  function on() {
    try { return !!(V.on && FOG.on && FOG.ready && !FOG.all && typeof mapSees === 'function' && SIGHT.on && MODE === 'city'); } catch (e) { return false; }
  }
  /* two pictures: the valley's remembered ground at a pixel a block, cut clear in the square round him, and that square at four
     pixels a block where the blocks he sees are clear, so the soft edge is a quarter of a block and never bleeds into his street */
  var SM = null, SX = null, KQ = 4;
  function build() {
    var D = FOG.D, K = FOG.K, night = false; try { night = isNight(); } catch (e) {}
    var key = city.x + ',' + city.y + ':' + (night ? 1 : 0);
    if (key === KEY && CV) return;
    KEY = key; LAST.key = key; LAST.builds++;
    var W = V.win, S = 2 * W + 1, fill = 'rgba(' + V.col + ',' + V.dim + ')';
    if (!CV) { CV = document.createElement('canvas'); CV.width = CV.height = D; X = CV.getContext('2d'); }
    if (!SM) { SM = document.createElement('canvas'); SM.width = SM.height = S * KQ; SX = SM.getContext('2d'); }
    X.setTransform(1, 0, 0, 1, 0, 0); X.clearRect(0, 0, D, D); X.fillStyle = fill; X.fillRect(0, 0, D, D);
    X.clearRect(city.x - W + K, city.y - W + K, S, S);
    SX.setTransform(1, 0, 0, 1, 0, 0); SX.clearRect(0, 0, S * KQ, S * KQ); SX.fillStyle = fill; SX.fillRect(0, 0, S * KQ, S * KQ);
    var n = 0, m = 0;
    for (var y = city.y - W; y <= city.y + W; y++) for (var x = city.x - W; x <= city.x + W; x++) {
      var s = false; try { s = !!mapSees(x, y); } catch (e) {}
      if (s) { SX.clearRect((x - city.x + W) * KQ, (y - city.y + W) * KQ, KQ, KQ); n++; } else if (fogSeen(x, y)) m++;
    }
    LAST.inSight = n; LAST.remembered = m; LAST.at = [city.x, city.y];
  }
  function draw(ox, oy) {
    if (!on()) { LAST.drew = 0; return; }
    build();
    var K = FOG.K, W = V.win, at = LAST.at;
    g.save();
    g.transform(TW / 2, TH / 2, -TW / 2, TH / 2, ox, oy - K * TH);
    g.imageSmoothingEnabled = false; g.drawImage(CV, 0, 0);   /* the remembered ground, sharp at the square's edge (both sides dim there) */
    g.imageSmoothingEnabled = true; g.drawImage(SM, at[0] - W + K, at[1] - W + K, 2 * W + 1, 2 * W + 1);   /* the square round him, soft a quarter block */
    g.restore(); LAST.drew++;
  }
  /* what he sees from here, for a checker: the blocks in sight, as [x, y] */
  function seenNow() { var out = [], W = V.win; for (var y = city.y - W; y <= city.y + W; y++) for (var x = city.x - W; x <= city.x + W; x++) { try { if (mapSees(x, y)) out.push([x, y]); } catch (e) {} } return out; }
  root.BohemiaMapSight = { draw: draw, on: on, seenNow: seenNow, last: LAST, V: V, rebuild: function () { KEY = ''; } };
})(typeof window !== 'undefined' ? window : this);
