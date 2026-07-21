// BOHEMIA VALLEY AERIAL (7/21/26). The "holy shit you built the city" shot: take a REAL region of
// the canon overmap and render it as one aerial — every DISTGEN cell built by its OWN generator
// (street-aware, the real grid + the real palette), the road/terrain cells filled from the overmap
// district color, streets meshing between cells. Not a mockup: this is the actual world model
// (engine/bohemia_world.js) composed cell-by-cell. Proof the district factory adds up to a city.
//
//   node tools/bohemia_aerial.js [x0 y0 size cellpx]         (default 46 16 16 34)
const fs=require('fs'), path=require('path'), ROOT=path.dirname(__dirname);
const W=require(path.join(ROOT,'engine','bohemia_world.js'));

const AX=+(process.argv[2]||46), AY=+(process.argv[3]||16), SIZE=+(process.argv[4]||16), CP=+(process.argv[5]||34);
const world=W.world(1337);               // canon overmap seed

// ---- fill tone for non-DISTGEN cells (roads, terrain, not-yet-built district types) seen from air ----
const FILL={
  mountain:'#3b352b', desert:'#8a7a58', wash:'#6f6547', water:'#2f5a6e', dam:'#7a746a',
  strip:'#5a5350', resort:'#6a6050', mall:'#5a544a', casino:'#645a52', stadium:'#4a5a44',
  speedway:'#4a4640', convention:'#54504a', waterpark:'#3a6a72', minigp:'#4a4640', estate:'#6a6250',
  freeway:'#2a2824', arterial:'#33302a', beltway:'#2a2824', interchange:'#242220',
  airport:'#565048', airbase:'#4e4a40', campus:'#5a6250', rail:'#463f36', town:'#5f584c',
  golf:'#4a5e3c', gated:'#6a6250', ballpark:'#4a5a44', fort:'#4e4a40', strat:'#645a58',
  reclaim:'#5a5040', datafort:'#454048', warehouse:'#524c44', railyard:'#463f36', watertreat:'#4c5a58',
  default:'#4a463c'
};
const ROAD={freeway:1,arterial:1,strip:1,beltway:1,interchange:1};   // reads as asphalt whatever's under it

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

const STEP=Math.max(1,Math.floor(128/CP));   // sample every STEP tiles -> CP x CP pixels per cell
const rects=[]; let built=0, filled=0; const histo={};
for(let cy=0; cy<SIZE; cy++){
  for(let cx=0; cx<SIZE; cx++){
    const ox=AX+cx, oy=AY+cy, cell=world.at(ox,oy), px0=cx*CP, py0=cy*CP;
    if(!cell){ rects.push(`<rect x="${px0}" y="${py0}" width="${CP}" height="${CP}" fill="#161410"/>`); continue; }
    const dist=cell.district; histo[dist]=(histo[dist]||0)+1;
    let plot=null; try{ plot=world.plot(ox,oy); }catch(e){ plot=null; }
    if(plot && plot.block && plot.block.grid && plot.legend){
      const g=plot.block.grid, mod=modOf(dist), pal=(mod&&mod.palette)?mod.palette:{};
      for(let ry=0; ry<CP; ry++)for(let rx=0; rx<CP; rx++){
        const tx=Math.min(127,rx*STEP), ty=Math.min(127,ry*STEP);
        const code=(g[ty]&&g[ty][tx]!=null)?g[ty][tx]:0;
        const col=(code===0)?'#231f18':(pal[code]||'#3a352b');
        rects.push(`<rect x="${px0+rx}" y="${py0+ry}" width="1" height="1" fill="${col}"/>`);
      }
      built++;
    } else {
      let col=FILL[dist]||FILL.default; if(ROAD[dist]) col=FILL.freeway;
      rects.push(`<rect x="${px0}" y="${py0}" width="${CP}" height="${CP}" fill="${col}"/>`);
      filled++;
    }
  }
}

const PX=SIZE*CP, BAR=34;
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${PX}" height="${PX+BAR*2}" viewBox="0 0 ${PX} ${PX+BAR*2}">`+
  `<rect width="${PX}" height="${PX+BAR*2}" fill="#0d0b08"/>`+
  `<text x="12" y="23" font-family="ui-monospace,monospace" font-size="17" letter-spacing="3" fill="#c79a3f">BOHEMIA · THE VALLEY</text>`+
  `<g transform="translate(0,${BAR})">`+rects.join('')+`</g>`+
  `<text x="12" y="${PX+BAR+21}" font-family="ui-monospace,monospace" font-size="10" fill="#6a5a3e">`+
    `${built} districts, each its own generator · overmap (${AX},${AY}) · ${SIZE}×${SIZE} cells · 96m each · street-aware · the I-15 spine runs through it</text>`+
  `</svg>`;
fs.writeFileSync(path.join(ROOT,'records','BOHEMIA_VALLEY_AERIAL.svg'),svg);
const top=Object.keys(histo).sort((a,b)=>histo[b]-histo[a]).slice(0,12).map(k=>k+':'+histo[k]).join(' ');
console.log('AERIAL ('+AX+','+AY+') '+SIZE+'x'+SIZE+' @'+CP+'px -> '+built+' generated / '+filled+' filled');
console.log('  cells: '+top);
