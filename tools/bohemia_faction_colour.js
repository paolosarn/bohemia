#!/usr/bin/env node
/* ============================================================================
   BOHEMIA FACTION COLOUR (9/6/26, FACTIONS lane, VAMILY row [colours fixed]).

   *** THE PROBLEM THIS ROW ACTUALLY HAD. ***
   Every faction in this game already HAS a colour. Paolo ruled it on 8/26 --
   "colour is not decoration, it is a statement of who would defend you" -- and he
   answered it garment by garment: COBALT SNEAKERS, RUST BOOTS, OLIVE SHOULDER
   MANTLE. His answer is real, it is shipped, and it is UNREACHABLE.

   It exists only as RENDERED PIXELS. faction_colour_gate gets at it by launching
   a browser, dressing a body thirteen times and counting cloth. The RGB ramps
   those garment names resolve to live inside slices/BOHEMIA_ALPHA_0_9.html and
   the city file carries ZERO of them -- measured, grep count nought. So nothing
   outside the wardrobe can paint a faction, and THREE ROWS ARE STOPPED ON IT:

     FACTIONS [who holds]  drew its territory borders in a two-colour language
                           (yours / theirs) because there was no hue to use
     UI [owner shown]      "CITY mode shows the owner of every district IN ITS
                           COLOUR" -- blocked, and says so on the board
     COOK [border marked]  "marked where a player can see it, in the holder's
                           colour, on the wall, the fence, the underpass"

   *** SO THIS TAKES NO COLOUR DECISION WHATSOEVER. *** It runs the gate's own
   measurement once, on his own shipped wardrobe, and writes the answer down
   where both surfaces can read it. Every number in the output file is a
   MEASUREMENT of a garment he chose. If he re-dresses a faction the number moves
   with it, and faction_colour_gate re-measures and goes red if the file and the
   wardrobe ever disagree -- the same contract NOT_A_TOWN and the seat bake
   already carry, and the reason this is a tool rather than a table.

   COLOUR IS TERRITORY is explicit that "which faction owns which hue is HIS."
   Nothing here picks one. It only stops his answer being locked in a browser.

     node tools/bohemia_faction_colour.js           # measure and write
     node tools/bohemia_faction_colour.js --check   # report only, exit 1 if stale
   ========================================================================== */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.dirname(__dirname);
const ALPHA = path.join(ROOT, 'slices/BOHEMIA_ALPHA_0_9.html');
const OUT = path.join(ROOT, 'engine/BOHEMIA_faction_colours.json');

function requirePlaywright() {
  for (const g of ['/opt/node22/lib/node_modules', '/usr/lib/node_modules', '/usr/local/lib/node_modules']) {
    try { return require(path.join(g, 'playwright')); } catch (_e) {}
  }
  return require('playwright');
}

/* THE SAME MEASUREMENT THE GATE MAKES, and deliberately the same numbers: skin
   and the face grid removed so a suntan cannot pass for a flag, the outline
   dropped by value, 30-degree buckets because two shades of one red are not two
   colours to anybody looking across a street. If this ever drifts from the gate
   the gate is the one that is right. */
const MEASURE = `(() => {
  const hsv = (r, g, bb) => { r/=255; g/=255; bb/=255;
    const mx=Math.max(r,g,bb), mn=Math.min(r,g,bb), d=mx-mn;
    let h=0;
    if(d){ if(mx===r) h=((g-bb)/d)%6; else if(mx===g) h=(bb-r)/d+2; else h=(r-g)/d+4;
      h*=60; if(h<0) h+=360; }
    return {h:h, s:mx? d/mx : 0, v:mx}; };
  const keepW=window.G_WORN, keepE=G.equipped, keepV=G.bodyVar;
  const PD_OFF=['hat','glasses','hair','shirt','jacket','pants','shoes'];
  const out=[];
  for(const f of window.FACTION_LOOKS){
    const eq={}; for(const k in keepE) eq[k]=keepE[k];
    for(const s of PD_OFF) eq[s]='';
    G.equipped=eq; G.bodyVar=f.dials; window.G_WORN=f.worn;
    try{ HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); }catch(e){}
    const fr=buildFrame('S','idle',0);
    const bins={}; let n=0, satSum=0;
    /* AND THE AVERAGE COLOUR OF THE BUCKET THAT WINS, which is the thing a
       painter actually needs. A hue bucket is 30 degrees wide and says nothing
       about how dark or how strong; a border drawn from the bucket number alone
       would be a guess. This averages the real pixels that voted for it. */
    const acc={};
    for(let i=0;i<fr.px.length;i++){ const c=fr.px[i]; if(!c) continue;
      const gv=fr.grid[i]; if(gv===1||gv===2) continue;
      const q=hsv(c[0],c[1],c[2]);
      if(q.v<0.12) continue;
      n++; satSum+=q.s;
      const key=q.s<0.18 ? 'neutral' : String((Math.round(q.h/30)*30)%360);
      bins[key]=(bins[key]||0)+1;
      const a=acc[key]||(acc[key]=[0,0,0,0]);
      a[0]+=c[0]; a[1]+=c[1]; a[2]+=c[2]; a[3]++; }
    const rank=Object.keys(bins).map(k=>[k,bins[k]]).sort((a,c)=>c[1]-a[1]);
    const dom=rank[0]?rank[0][0]:'-';
    const a=acc[dom]||[0,0,0,1];
    out.push({ faction:f.faction, px:n,
               sat:+(satSum/Math.max(1,n)).toFixed(4),
               dom:dom,
               domShare:+((rank[0]?rank[0][1]:0)/Math.max(1,n)).toFixed(4),
               second:rank[1]?rank[1][0]:'-',
               neutral:+((bins['neutral']||0)/Math.max(1,n)).toFixed(4),
               rgb:[Math.round(a[0]/Math.max(1,a[3])),
                    Math.round(a[1]/Math.max(1,a[3])),
                    Math.round(a[2]/Math.max(1,a[3]))] });
  }
  window.G_WORN=keepW; G.equipped=keepE; G.bodyVar=keepV;
  try{ HD_CACHE.map.clear(); FRAME_CACHE.map.clear(); }catch(e){}
  return out;
})()`;

function hex(rgb) {
  return '#' + rgb.map(v => Math.max(0, Math.min(255, v | 0)).toString(16).padStart(2, '0')).join('');
}

(async () => {
  const check = process.argv.indexOf('--check') >= 0;
  const { chromium } = requirePlaywright();
  const b = await chromium.launch();
  const pg = await b.newPage({ viewport: { width: 390, height: 844 } });
  const errs = [];
  pg.on('pageerror', e => errs.push(String(e.message).slice(0, 160)));
  await pg.route(/^https?:/, r => r.abort());
  await pg.goto('file://' + ALPHA, { waitUntil: 'load', timeout: 180000 });
  await pg.waitForFunction(() => typeof buildFrame === 'function' && window.FACTION_LOOKS,
                           { timeout: 60000 });
  const R = await pg.evaluate(MEASURE);
  await b.close();

  if (errs.length) { console.log('FAIL: the alpha threw -- ' + errs[0]); process.exit(1); }
  if (!R || !R.length) { console.log('FAIL: no faction looks measured'); process.exit(1); }

  const colours = {};
  for (const q of R) {
    colours[q.faction] = {
      hex: hex(q.rgb), rgb: q.rgb,
      hue: q.dom === 'neutral' ? null : (q.dom | 0),
      drab: q.dom === 'neutral',
      strength: q.sat, share: q.domShare, second: q.second, neutral: q.neutral,
      /* MEASURED, NEVER RULED. Every consumer can see that at a glance, and the
         day he thumbs a colour the flag is what changes, not the number. */
      draft: true
    };
  }
  const doc = {
    _: 'MEASURED off the shipped wardrobe by tools/bohemia_faction_colour.js. '
     + 'Nothing here is a colour decision: COLOUR IS TERRITORY (8/26) says which '
     + 'faction owns which hue is HIS, and he answered it in garments. This is '
     + 'only his answer, written where both surfaces can read it. '
     + 'faction_colour_gate re-measures and goes red if this drifts from the '
     + 'wardrobe, so it cannot rot into a list somebody believes.',
    measured: 'wardrobe',
    factions: colours
  };
  const text = JSON.stringify(doc, null, 1) + '\n';

  /* AND IT REACHES THE SURFACE THAT NEEDS IT, WHICH IS THE WHOLE POINT.
     A JSON in engine/ is still unreachable from the walked city -- the city
     cannot require() anything, which is exactly why the ramps were stranded in
     the alpha in the first place. So the answer is inlined beside the faction
     graph, the same way the graph itself gets there.
     RE-WRITTEN EVERY RUN, NEVER ONE-SHOT. The seat bake taught this one round
     ago: a patch tool that checks a marker and no-ops forever leaves the engine
     right and the surface a week behind with nothing to re-run. */
  const CITY = path.join(ROOT, 'slices/BOHEMIA_CITY_WORLD.html');
  let citySrc = fs.readFileSync(CITY, 'utf8');
  const line = 'window.BOHEMIA_FACTION_COLOURS=' + JSON.stringify(doc) + ';';
  const re = /window\.BOHEMIA_FACTION_COLOURS=.*?;\n/;
  let cityFresh;
  if (re.test(citySrc)) {
    cityFresh = re.exec(citySrc)[0] === line + '\n';
    if (!cityFresh && !check) citySrc = citySrc.replace(re, line + '\n');
  } else {
    cityFresh = false;
    const anchor = /window\.BOHEMIA_FACTION_GRAPH=.*?;\n/;
    if (!anchor.test(citySrc)) { console.log('FAIL: no faction graph in the city to sit beside'); process.exit(1); }
    if (!check) citySrc = citySrc.replace(anchor, m => m + line + '\n');
  }

  const had = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  const same = had === text && cityFresh;

  const rows = R.slice().sort((a, c) => c.sat - a.sat);
  console.log('  faction      hue    hex       strength  share');
  for (const q of rows) {
    const c = colours[q.faction];
    console.log('  ' + q.faction.padEnd(12)
      + String(c.hue == null ? 'drab' : c.hue).padStart(5) + '  '
      + c.hex + '  ' + c.strength.toFixed(2).padStart(8)
      + '  ' + (100 * c.share).toFixed(0).padStart(4) + '%');
  }

  if (same) { console.log('\nFACTION COLOURS ALREADY FRESH: ' + R.length + ' measured'); return; }
  if (check) {
    console.log('\nFACTION COLOURS STALE: the file and the wardrobe disagree');
    console.log('  fix: node tools/bohemia_faction_colour.js');
    process.exit(1);
  }
  fs.writeFileSync(OUT, text);
  fs.writeFileSync(CITY, citySrc);
  console.log('\nWROTE ' + path.relative(ROOT, OUT) + ': ' + R.length + ' factions measured off the wardrobe');
  console.log('  and inlined into slices/BOHEMIA_CITY_WORLD.html beside the faction graph');
})();
