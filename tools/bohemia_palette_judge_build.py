#!/usr/bin/env python3
"""
BOHEMIA — BUILD THE PALETTE JUDGE (7/29/26)

Paolo: "WHERE DO I SEE?" He could not, because I had sent a picture in chat instead
of putting the choice under his thumb. This bakes the judge page that goes in the
LIFE tab.

WHY IT IS GENERATED INSTEAD OF HAND-WRITTEN. The first version fetch()ed the two
tile banks at runtime and rendered nothing, because Chromium blocks fetch on
file:// — so the page "existed", passed nothing, and would have shipped as a card
that opens to two blank rectangles. That is precisely the failure VERIFY-ON-THE-REAL-
SURFACE exists to catch. Baking the tiles in also kills a relative-path dependency
that would have been fragile from inside the LIFE tab's iframe.

ONLY THE TILES THE FRAME USES are inlined, so the page stays small enough to open
instantly on a phone.

REUSE CHECK: draws no pixel. It reads the two existing banks
(BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt and ..._MASTER_7_29_26.txt) and
copies their tile bytes verbatim into the page. Neither bank is modified.

  python3 tools/bohemia_palette_judge_build.py
    -> slices/BOHEMIA_PALETTE_JUDGE_7_29_26.html
"""
import json
import os

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__))) or '.'
os.chdir(REPO)

A = 'banks/BOHEMIA_STARTER_TILESET_ACT1_RECOOK_7_28_26.txt'
B = 'banks/BOHEMIA_STARTER_TILESET_ACT1_MASTER_7_29_26.txt'
OUT = 'slices/BOHEMIA_PALETTE_JUDGE_7_29_26.html'

# a house against the street: roof over wall over ground, which is the exact
# adjacency the greyscale test is about.
LAYOUT = [
    ['roof_hipTL', 'roof_ridge', 'roof_ridge', 'roof_ridge', 'roof_hipTR', 'yard_0'],
    ['roof_hipBL', 'roof_slope', 'roof_slope', 'roof_slope', 'roof_hipBR', 'yard_1'],
    ['wall_end_l', 'wall_under_eave', 'wall_under_eave', 'wall_under_eave', 'wall_end_r', 'yard_0'],
    ['wall_end_l', 'wall_window', 'wall_0', 'door_top', 'wall_end_r', 'yard_2'],
    ['wall_end_l', 'wall_1', 'wall_0', 'door_bottom', 'wall_end_r', 'yard_0'],
    ['walk_0', 'walk_1', 'walk_0', 'walk_kerb', 'walk_1', 'walk_0'],
    ['road_0', 'road_centre', 'road_1', 'road_0', 'road_2', 'road_1'],
]

PAGE = '''<meta charset="utf-8">
<title>BOHEMIA PALETTE JUDGE</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{margin:0;background:#0d0f0a;font-family:-apple-system,sans-serif;color:#ddd}
  .wrap{padding:14px 12px 40px;max-width:520px;margin:0 auto}
  h1{font:800 18px/1.25 -apple-system,sans-serif;color:#cdbd8a;margin:0 0 6px}
  .sub{font:12px/1.5 -apple-system,sans-serif;color:#8f8770;margin:0 0 16px}
  .card{background:#141610;border:1px solid #333;border-radius:12px;padding:12px;margin-bottom:14px}
  .lbl{font:700 14px -apple-system,sans-serif;color:#cdbd8a;margin-bottom:2px}
  .meta{font:11px/1.4 -apple-system,sans-serif;color:#8f8770;margin-bottom:8px}
  canvas{width:100%%;height:auto;image-rendering:pixelated;border-radius:6px;display:block}
  .two{display:flex;gap:8px}
  .two>div{flex:1;min-width:0}
  .cap{font:10px -apple-system,sans-serif;color:#7d7768;text-align:center;margin-top:4px}
  .vote{display:flex;gap:8px;margin-top:10px}
  .vote button{flex:1;font:700 13px -apple-system,sans-serif;padding:12px 6px;border-radius:9px;
    border:1px solid #4a4636;background:#1c1e16;color:#cdbd8a}
  .vote button.on{background:#c79a3f;color:#201700;border-color:#c79a3f}
  #sun{position:fixed;right:10px;top:10px;font:700 11px sans-serif;background:#1c1e16;
    color:#cdbd8a;border:1px solid #4a4636;border-radius:8px;padding:8px 10px;z-index:9}
  body.sun{background:#e8e4d8;color:#1a1a16}
  body.sun .card{background:#f6f3ea;border-color:#bbb4a2}
  body.sun .lbl,body.sun h1{color:#3b3320}
  body.sun .sub,body.sun .meta,body.sun .cap{color:#5d5847}
  body.sun .vote button{background:#efe9da;color:#3b3320;border-color:#bbb4a2}
  body.sun .vote button.on{background:#c79a3f;color:#201700}
  textarea{width:100%%;box-sizing:border-box;min-height:90px;background:#141610;color:#ddd;
    border:1px solid #4a4636;border-radius:9px;padding:10px;font:13px -apple-system,sans-serif}
  body.sun textarea{background:#f6f3ea;color:#1a1a16;border-color:#bbb4a2}
  #out{width:100%%;font:700 14px -apple-system,sans-serif;padding:14px;border-radius:10px;
    border:0;background:#3f8c3f;color:#fff;margin-top:10px}
</style>
<body>
<button id="sun">SUN MODE</button>
<div class="wrap">
  <h1>WHICH ONE IS THE GAME?</h1>
  <div class="sub">
    The same house on the same street, same map, same renderer. The only thing that
    changes is the tiles. <b>The right-hand picture in each card is that same street with
    the colour drained</b> &#8212; that is the test that matters. When the roof and the wall
    go the same grey, the house flattens out and stops reading as a building. Pick one.
  </div>

  <div class="card">
    <div class="lbl">A &#183; ORANGE ROOFS &#183; what we have now</div>
    <div class="meta">150 colours &#183; six separate colour schemes that do not know about
      each other &#183; roof sits 6.5 apart from the ground</div>
    <div class="two">
      <div><canvas id="a1"></canvas><div class="cap">NORMAL</div></div>
      <div><canvas id="a2"></canvas><div class="cap">COLOUR OFF</div></div>
    </div>
    <div class="vote"><button data-v="A">THIS ONE</button></div>
  </div>

  <div class="card">
    <div class="lbl">B &#183; ONE PALETTE &#183; the new one</div>
    <div class="meta">39 colours for the entire game &#183; every material a slice of one set
      &#183; roof sits 13.3 apart from the ground</div>
    <div class="two">
      <div><canvas id="b1"></canvas><div class="cap">NORMAL</div></div>
      <div><canvas id="b2"></canvas><div class="cap">COLOUR OFF</div></div>
    </div>
    <div class="vote"><button data-v="B">THIS ONE</button></div>
  </div>

  <div class="card">
    <div class="lbl">NEITHER</div>
    <div class="meta">If both are wrong, say so. That kills the palette and nothing gets
      built on it.</div>
    <div class="vote"><button data-v="KILL">BOTH ARE WRONG</button></div>
  </div>

  <div class="card">
    <div class="lbl">ANYTHING YOU WANT TO SAY</div>
    <div class="meta">Colours, roofs, the ground, what rebuilt Vegas should look like.</div>
    <textarea id="note" placeholder="type here"></textarea>
    <button id="out">EXPORT MY VERDICT</button>
  </div>
</div>
<script>
var LAYOUT = %(layout)s;
var BANKS = %(banks)s;   /* tiles baked in: fetch() is blocked on file:// and this
                            page has to render from a tapped link, not a server */
var PICK = '';
document.getElementById('sun').onclick = function () {
  document.body.classList.toggle('sun');
};
/* the vote buttons live in three separate cards, so clearing has to sweep all of them */
Array.prototype.forEach.call(document.querySelectorAll('.vote button'), function (b) {
  b.onclick = function () {
    Array.prototype.forEach.call(document.querySelectorAll('.vote button'), function (o) {
      o.classList.remove('on');
    });
    b.classList.add('on');
    PICK = b.getAttribute('data-v');
  };
});

function frame(cv, tiles, grey) {
  var g = cv.getContext('2d'), C = 44, W = LAYOUT[0].length, H = LAYOUT.length;
  cv.width = C * W; cv.height = C * H;
  g.imageSmoothingEnabled = false;
  for (var y = 0; y < H; y++) {
    for (var x = 0; x < W; x++) {
      var im = tiles[LAYOUT[y][x]];
      if (im) g.drawImage(im, x * C, y * C, C, C);
    }
  }
  if (!grey) return;
  var d = g.getImageData(0, 0, cv.width, cv.height), p = d.data;
  for (var i = 0; i < p.length; i += 4) {
    var v = Math.round(0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]);
    p[i] = p[i + 1] = p[i + 2] = v;
  }
  g.putImageData(d, 0, 0);
}

function paint(key, c1, c2) {
  var src = BANKS[key], ids = Object.keys(src), left = ids.length, ims = {};
  ids.forEach(function (id) {
    var im = new Image();
    im.onload = im.onerror = function () {
      if (--left === 0) {
        frame(document.getElementById(c1), ims, false);
        frame(document.getElementById(c2), ims, true);
      }
    };
    im.src = 'data:image/png;base64,' + src[id];
    ims[id] = im;
  });
}
paint('A', 'a1', 'a2');
paint('B', 'b1', 'b2');

document.getElementById('out').onclick = function () {
  var txt = 'BOHEMIA PALETTE VERDICT 7/29/26\\n'
    + 'PICK: ' + (PICK || '(nothing tapped)') + '\\n'
    + 'A = orange roofs, 150 colours, six separate schemes\\n'
    + 'B = one palette, 39 colours, roof clears ground by 13.3\\n\\n'
    + 'NOTES:\\n' + (document.getElementById('note').value || '(none)') + '\\n';
  var a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' }));
  a.download = 'BOHEMIA_PALETTE_VERDICT_7_29_26.txt';
  a.click();
};
</script>
'''


def main():
    need = {i for row in LAYOUT for i in row}
    banks = {}
    for key, path in (('A', A), ('B', B)):
        d = json.load(open(path))
        got = {t['id']: t['b64'] for t in d['tiles'] if t['id'] in need}
        missing = need - set(got)
        if missing:
            raise SystemExit('%s is missing %s' % (path, ', '.join(sorted(missing))))
        banks[key] = got
    open(OUT, 'w').write(PAGE % {'layout': json.dumps(LAYOUT),
                                 'banks': json.dumps(banks)})
    print('%d tiles per side baked -> %s  (%.0f KB)'
          % (len(need), OUT, os.path.getsize(OUT) / 1024.0))


if __name__ == '__main__':
    main()
