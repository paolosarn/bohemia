/* ==========================================================================
   __THE_TRACKS_HE_CAN_READ__ (WORLD 14, 11/17; the coordinator's round under rule 453: 'parties that roam and leave tracks he can
   read'; the overworld law: parties roam and leave tracks; rule 454(a): no line a human speaks, the fewest words, built not talked)

   MEASURED FIRST (main b94bd4920): the parties roam and leave prints (LIFE+CITY's living map, PRINT_HOURS 24, a print a step off a
   town, fading by the hour). But since rule 151(f) (Paolo 10/24: 'I don't know why I'm seeing their lines on the ground of where
   they're gonna walk, that was never a thing in Battle Brothers') the prints are drawn only behind Battle Brothers' F key
   (MAP_PRINTS_SHOWN, UI's), and a phone has no F: ON A PHONE NO TRACK IS EVER SEEN. And the one reading of a track ('whose footprints
   are these', 9/12) belonged to the street walk, which is dead (9/28).
   Battle Brothers: footprints show round the company on the world map, fading with time; hovering one tells who left it. His ruling
   was about lines of where people WILL walk; a print is where somebody WALKED.

   NOW: THE PRINTS ROUND HIM, as footprints, never lines: the living map's own prints inside his sight (the ground he has seen, about twice his sight), two
   marks a step in the faction's own colour, fainter by the hour, pointing the way they went; at the far stops none (a print is a close
   thing). With F on, UI's full trails are drawn as before and these stand down. THE READ needs nothing new: the map's own line
   (__WHOSE_FOOTPRINTS_ARE_THESE__, tracksHere) already says, at the foot of the glass, who came through and how close they are when
   he stands on their ground (seen on the phone, 11/17: 'VOLUNTEERS CAME THROUGH HERE JUST NOW. A PATROL, AND THEY ARE CLOSE.'), so
   this file adds no words at all (rule 454(a)).
   Loaded by BOHEMIA_CITY_WORLD.html after the job layer; it wraps loopJobsDraw (the map's draw hands it ox, oy).
     BohemiaTracks.status()   what it drew last
     BohemiaTracks.near(r)    the prints inside r blocks of him, freshest first
   ========================================================================== */
(function (root) {
  'use strict';
  if (typeof root.loopJobsDraw !== 'function') return;
  var T = root.BohemiaTracks = { drawn: 0, err: null, on: true };
  var DIRS = ['EAST', 'SOUTHEAST', 'SOUTH', 'SOUTHWEST', 'WEST', 'NORTHWEST', 'NORTH', 'NORTHEAST'];
  function hourNow() { try { return root.livingMapHour(); } catch (e) { return 0; } }
  function prints() { try { return (root.LIVING_MAP && root.LIVING_MAP.st && root.LIVING_MAP.st.prints) || []; } catch (e) { return []; } }
  function fade(pr, h) { try { return root.BohemiaLivingMap.fadeOf(pr, h); } catch (e) { return 0; } }
  /* how far round him: the ground he has seen (the fog decides what shows), out to about twice his sight; at the map's usual stop a
     block is some 18 px and his own men stand over the nearest six (measured 11/17: every print within six blocks was under them) */
  function sight() { var f = 6; try { f = root.fogRadius() | 0; } catch (e) {} return Math.max(8, Math.min(14, f * 2)); }
  function hidden(x, y) { try { return typeof root.fogHides === 'function' && root.fogHides(x, y); } catch (e) { return false; } }
  /* the print is pressed dust, paler than the dark ground, tinted to the faction's own colour (their colours are measured off garments
     and most are dark: a dark print on the dark map was lost, seen on the phone 11/17) */
  function inkOf(f, a) {
    var C = root.BOHEMIA_FACTION_COLOURS, e = C && C.factions && C.factions[f], rgb = e && e.rgb ? e.rgb : [200, 165, 88];
    var D = [226, 212, 184], t = 0.5, c = [0, 1, 2].map(function (i) { return Math.round(rgb[i] * (1 - t) + D[i] * t); });
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a.toFixed(3) + ')';
  }
  /* the way they went AS HE SEES IT on the slanted map (up the glass is north): the grid's step put through the map's own iso */
  function dirOf(dx, dy) { if (!dx && !dy) return ''; var sx = dx - dy, sy = (dx + dy) / 2, a = Math.atan2(sy, sx), i = Math.round(a / (Math.PI / 4)); return DIRS[(i + 8) % 8]; }
  function near(r) {
    var w = [city.x | 0, city.y | 0], h = hourNow(), out = [];
    prints().forEach(function (p) { var d = Math.max(Math.abs(p.x - w[0]), Math.abs(p.y - w[1])); if (d > r) return; var f = fade(p, h); if (f <= 0) return; out.push({ p: p, d: d, f: f }); });
    out.sort(function (a, b) { return b.p.h - a.p.h; });
    return out;
  }
  T.near = function (r) { return near(r == null ? sight() : r).map(function (q) { return { x: q.p.x, y: q.p.y, f: q.p.f, a: q.p.a, hours: Math.round(hourNow() - q.p.h), dir: dirOf(q.p.dx, q.p.dy), d: q.d }; }); };
  /* THE READ OF A PRINT: the map's own line (trackSay, tracksHere) reads the parties' CURRENT legs, so a print a party left before it
     turned round said nothing (measured on the demo sideways, 11/17). Where the legs say nothing, the print under him answers in the
     line's own shape (faction, agenda, age in steps: a party walks about 3.7 blocks an hour), so the line's own words say it */
  if (typeof root.tracksHere === 'function') {
    var _th = root.tracksHere;
    root.tracksHere = function () {
      var t = null; try { t = _th.apply(this, arguments); } catch (e) { t = null; }
      if (t) return t;
      try { if (typeof MODE !== 'undefined' && MODE !== 'city') return null; var q = near(0)[0]; if (!q) return null;
        return { faction: q.p.f, agenda: q.p.a, age: Math.round(Math.max(0, hourNow() - q.p.h) * 3.7), print: true }; } catch (e) { return null; }
    };
  }
  var _draw = root.loopJobsDraw;
  root.loopJobsDraw = function (ox, oy) {
    var r0 = _draw.apply(this, arguments);
    if (!T.on) return r0;
    try {
      var g = root.g; if (!g || typeof city === 'undefined' || typeof TW === 'undefined') return r0;
      if (typeof MODE !== 'undefined' && MODE !== 'city') return r0;
      /* (1) the footprints round him; UI's F draws the whole trails instead */
      var marks = []; T.marks = marks;
      var full = !!((typeof MAP_PRINTS_SHOWN !== 'undefined' && MAP_PRINTS_SHOWN) || (typeof MAP_PATHS_DRAWN !== 'undefined' && MAP_PATHS_DRAWN)), n = 0;
      if (!full && TW >= 10) {
        /* a foot is about a ninth of a block (measured on the phone at the usual stop: 2 px was lost in the asphalt's grain) */
        var list = near(sight()), mk = Math.max(2.4, Math.min(5.5, TW * 0.13));
        g.save();
        for (var i = 0; i < list.length && n < 90; i++) {   /* the 90 freshest steps: a phone draws 540 small ovals a frame at most */
          var p = list[i].p; if (hidden(p.x, p.y)) continue;
          var a = iso(p.x, p.y, ox, oy), b = iso(p.x + p.dx, p.y + p.dy, ox, oy);
          var vx = b.sx - a.sx, vy = b.sy - a.sy, L = Math.sqrt(vx * vx + vy * vy) || 1; vx /= L; vy /= L;
          var px = -vy, py = vx, cx = a.sx + vx * TW * 0.12, cy = a.sy + TH / 2 + vy * TW * 0.12, ang = Math.atan2(vy, vx);
          var f = list[i].f, feet = [[cx - vx * mk * 1.6 + px * mk * 1.2, cy - vy * mk * 1.6 + py * mk * 1.2], [cx + vx * mk * 1.6 - px * mk * 1.2, cy + vy * mk * 1.6 - py * mk * 1.2]];
          /* a step: the left foot behind, the right ahead, along the way they went; pressed into the dirt (a dark edge) and in the
             faction's own colour, fainter by the hour */
          for (var k = 0; k < 2; k++) {
            var fx = feet[k][0], fy = feet[k][1];
            /* a shoe: the sole ahead, the heel behind, with the dirt's dark lip under it */
            g.fillStyle = 'rgba(6,5,4,' + (0.2 + 0.35 * f).toFixed(3) + ')';
            g.beginPath(); g.ellipse(fx + vx * mk * 0.25, fy + vy * mk * 0.25 + 0.8, mk * 0.95, mk * 0.55, ang, 0, Math.PI * 2); g.fill();
            g.fillStyle = inkOf(p.f, 0.5 + 0.45 * f);
            g.beginPath(); g.ellipse(fx + vx * mk * 0.35, fy + vy * mk * 0.35, mk * 0.7, mk * 0.42, ang, 0, Math.PI * 2); g.fill();
            g.beginPath(); g.ellipse(fx - vx * mk * 0.6, fy - vy * mk * 0.6, mk * 0.36, mk * 0.34, ang, 0, Math.PI * 2); g.fill();
          }
          marks.push([Math.round(feet[1][0] + vx * mk * 0.35), Math.round(feet[1][1] + vy * mk * 0.35)]); n++;
        }
        g.restore();
      }
      T.drawn = n;
    } catch (e) { T.err = String(e && e.message || e); }
    return r0;
  };
  T.status = function () { return { drawn: T.drawn, near: near(sight()).length, sight: sight(), full: !!((typeof MAP_PRINTS_SHOWN !== 'undefined' && MAP_PRINTS_SHOWN) || (typeof MAP_PATHS_DRAWN !== 'undefined' && MAP_PATHS_DRAWN)), err: T.err }; };
})(window);
