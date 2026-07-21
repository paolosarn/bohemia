// BOHEMIA VALLEY AERIAL (7/21/26, REBUILT after Paolo "that looks like shit"). The "holy shit
// you built the city" shot: take a REAL region of the canon overmap and render it at NATIVE tile
// resolution (1 tile = 1px, no downsample) — every DISTGEN cell built by its OWN generator
// (street-aware, real grid + real palette), road/terrain cells given real texture (dashed
// centerlines, speckle) instead of a flat dead rectangle, streets meshing between cells. Not a
// mockup: this is the actual world model (engine/bohemia_world.js) composed cell-by-cell.
//
// POST-MORTEM (v1, 7/21): downsampled 128x128 grids to 34px by nearest-neighbor point-sampling —
// every fine pattern (crop furrows, individual trailers) turned to noise, and unbuilt terrain/road
// cells were flat color blocks with zero texture. Read as a spreadsheet of blurry stamps, not a
// city. FIX: full tile resolution + row run-length-encoding (keeps the SVG light) + real texture
// on the fill cells.
//
//   node tools/bohemia_aerial.js [x0 y0 size]         (default 44 20 10, cellpx fixed at 128=native)
const fs=require('fs'), path=require('path'), ROOT=path.dirname(__dirname);
const W=require(path.join(ROOT,'engine','bohemia_world.js'));

const AX=+(process.argv[2]||35), AY=+(process.argv[3]||8), SIZE=+(process.argv[4]||10);
const CP=128;                              // native: 1 tile = 1 svg unit, zero downsample loss
const world=W.world(1337);                 // canon overmap seed

function rng(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1103515245+12345)>>>0; return s/4294967296; }; }
function seedOf(ox,oy){ return ((ox*73856093)^(oy*19349663))>>>0; }

// ---- fill tone for non-DISTGEN cells (roads, terrain, not-yet-built district types) ----
const FILL={
  mountain:'#3b352b', desert:'#8a7a58', wash:'#6f6547', water:'#2f5a6e', dam:'#7a746a',
  strip:'#5a5350', resort:'#6a6050', mall:'#5a544a', casino:'#645a52', stadium:'#4a5a44',
  speedway:'#4a4640', convention:'#54504a', waterpark:'#3a6a72', minigp:'#4a4640', estate:'#6a6250',
  airport:'#565048', airbase:'#4e4a40', campus:'#5a6250', rail:'#463f36', town:'#5f584c',
  golf:'#4a5e3c', gated:'#6a6250', ballpark:'#4a5a44', fort:'#4e4a40', strat:'#645a58',
  reclaim:'#5a5040', datafort:'#454048', warehouse:'#524c44', railyard:'#463f36', watertreat:'#4c5a58',
  springs:'#2f5a6e', default:'#4a463c'
};
// road asphalt = the SAME canon street color the districts themselves paint their street/drive
// tiles (Paolo 7/21: "the streets should be the same color as the streets in the districts") —
// #33333c is what suburb/commercial/industrial/downtown/school all use for code-1 street/drive.
// A darker shade for interchange reads as the elevated/complex knot without breaking the family.
const ROADCOL={freeway:'#33333c', arterial:'#33333c', beltway:'#33333c', strip:'#33333c', interchange:'#2b2b31'};
const ROAD={freeway:1,arterial:1,strip:1,beltway:1,interchange:1};
const TERRAIN={mountain:1,desert:1,wash:1,water:1,dam:1};

// resolve each DISTGEN module's palette by requiring its engine file
const MODCACHE={};
const MODMAP={ suburb:'suburb',gated:'suburb',estate:'suburb',commercial:'commercial',industrial:'industrial',
  medical:'medical',solar:'solar',park:'park',wash:'wash',cemetery:'cemetery',drivein:'drivein',golf:'golf',
  stadium:'stadium',truckstop:'truckstop',school:'school',firestation:'firestation',swapmeet:'swapmeet',
  storage:'storage',watertreat:'watertreat',boneyard:'boneyard',policestation:'policestation',library:'library',
  landfill:'landfill',railyard:'railyard',substation:'substation',chapel:'chapel',courthouse:'courthouse',
  jail:'jail',farm:'farm',downtown:'downtown',trailer:'trailer' };
function modOf(dist){ if(dist in MODCACHE) return MODCACHE[dist];
  let m=null; if(MODMAP[dist]){ try{ m=require(path.join(ROOT,'engine','bohemia_'+MODMAP[dist]+'.js')); }catch(e){ m=null; } }
  return (MODCACHE[dist]=m); }

// run-length-encode a row of colors into rects (keeps the SVG light at native 128px/cell)
function rleRow(colors, px0, py, out){
  let i=0;
  while(i<colors.length){
    let j=i; while(j<colors.length && colors[j]===colors[i]) j++;
    out.push(`<rect x="${px0+i}" y="${py}" width="${j-i}" height="1" fill="${colors[i]}"/>`);
    i=j;
  }
}

const rects=[]; let built=0, filled=0; const histo={};
for(let cy=0; cy<SIZE; cy++){
  for(let cx=0; cx<SIZE; cx++){
    const ox=AX+cx, oy=AY+cy, cell=world.at(ox,oy), px0=cx*CP, py0=cy*CP;
    if(!cell){ rects.push(`<rect x="${px0}" y="${py0}" width="${CP}" height="${CP}" fill="#161410"/>`); continue; }
    const dist=cell.district; histo[dist]=(histo[dist]||0)+1;
    let plot=null; try{ plot=world.plot(ox,oy); }catch(e){ plot=null; }
    if(plot && plot.block && plot.block.grid && plot.legend){
      // REAL generated district at NATIVE resolution — 1 tile = 1 svg pixel, RLE per row
      const g=plot.block.grid, mod=modOf(dist), pal=(mod&&mod.palette)?mod.palette:{};
      for(let ty=0; ty<128; ty++){
        const row=g[ty]||[]; const colors=new Array(128);
        for(let tx=0; tx<128; tx++){ const code=row[tx]!=null?row[tx]:0; colors[tx]=(code===0)?'#231f18':(pal[code]||'#3a352b'); }
        rleRow(colors, px0, py0+ty, rects);
      }
      built++;
    } else if(ROAD[dist]){
      // ROAD cell: readable asphalt base + a dashed centerline + shoulder edge, seeded deterministic
      rects.push(`<rect x="${px0}" y="${py0}" width="${CP}" height="${CP}" fill="${ROADCOL[dist]||ROADCOL.freeway}"/>`);
      const r=rng(seedOf(ox,oy)); const horiz = r()<0.5;
      if(horiz){
        rects.push(`<rect x="${px0}" y="${py0+CP/2-1}" width="${CP}" height="2" fill="#26262c"/>`);
        for(let dx=6; dx<CP; dx+=16) rects.push(`<rect x="${px0+dx}" y="${py0+CP/2-1}" width="8" height="2" fill="#d9c589"/>`);
      } else {
        rects.push(`<rect x="${px0+CP/2-1}" y="${py0}" width="2" height="${CP}" fill="#26262c"/>`);
        for(let dy=6; dy<CP; dy+=16) rects.push(`<rect x="${px0+CP/2-1}" y="${py0+dy}" width="2" height="8" fill="#d9c589"/>`);
      }
      filled++;
    } else {
      // TERRAIN / not-yet-built district: base tone + deterministic speckle so it isn't dead-flat
      const col=FILL[dist]||FILL.default;
      rects.push(`<rect x="${px0}" y="${py0}" width="${CP}" height="${CP}" fill="${col}"/>`);
      const r=rng(seedOf(ox,oy)); const n = TERRAIN[dist] ? 90 : 40;
      const lite = TERRAIN[dist] ? '#00000022' : '#ffffff14', dark='#00000030';
      for(let i=0;i<n;i++){
        const sx=Math.floor(r()*CP), sy=Math.floor(r()*CP), sw=2+Math.floor(r()*4), sh=2+Math.floor(r()*4);
        rects.push(`<rect x="${px0+sx}" y="${py0+sy}" width="${sw}" height="${sh}" fill="${r()<0.5?dark:lite}"/>`);
      }
      filled++;
    }
  }
}

const PX=SIZE*CP, BAR=40;
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${PX}" height="${PX+BAR*2}" viewBox="0 0 ${PX} ${PX+BAR*2}">`+
  `<rect width="${PX}" height="${PX+BAR*2}" fill="#0d0b08"/>`+
  `<text x="14" y="27" font-family="ui-monospace,monospace" font-size="20" letter-spacing="3" fill="#c79a3f">BOHEMIA · THE VALLEY</text>`+
  `<g transform="translate(0,${BAR})">`+rects.join('')+`</g>`+
  `<text x="14" y="${PX+BAR+24}" font-family="ui-monospace,monospace" font-size="11" fill="#6a5a3e">`+
    `${built} districts, each its own generator, native tile resolution · overmap (${AX},${AY}) · ${SIZE}×${SIZE} cells · 96m each</text>`+
  `</svg>`;
fs.writeFileSync(path.join(ROOT,'records','BOHEMIA_VALLEY_AERIAL.svg'),svg);
const top=Object.keys(histo).sort((a,b)=>histo[b]-histo[a]).slice(0,14).map(k=>k+':'+histo[k]).join(' ');
console.log('AERIAL ('+AX+','+AY+') '+SIZE+'x'+SIZE+' @native128px -> '+built+' generated / '+filled+' filled, '+rects.length+' rects');
console.log('  cells: '+top);
