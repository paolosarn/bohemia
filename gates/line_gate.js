const G=require('../engine/bohemia_blockgen.js');
let p=0,f=0; const ok=(n,c)=>{c?p++:(f++,console.log("FAIL "+n));};

let blocks=0,bad=0,yellow=0,white=0,cross=0;
for(let seed=0;seed<500;seed++){
  for(const lanes of [1,2,3,4]){
    const b=G.generate('street',seed,24,{lanes,intersection:seed%3===0});
    blocks++;
    const v=G.auditLines(b);
    bad+=v.length;
    if(v.length&&bad<=3)console.log("  violation seed",seed,"lanes",lanes,JSON.stringify(v[0]));
    b.grid.forEach(row=>row.forEach(c=>{
      if(c.color==='yellow_direction')yellow++;
      if(c.color==='white_lane')white++;
      if(c.g==='crosswalk')cross++;}));
  }
}
console.log(`  swept ${blocks} street blocks: ${bad} line violations | yellow cells ${yellow} | white cells ${white} | crosswalk cells ${cross}`);

// TURN POCKET LAW (7/17, markings bank APPROVED): pockets exist only at
// intersections, only on lane cells, arrows only in the certified vocabulary,
// pocket cells only within pocketLen of the crosswalk, dual/triple scale by
// lane count. Marking classes are WHITE-bank classes by construction; yellow
// stays in twlt borders (centerTurn) alone.
{
 const VOCAB=new Set(['pocket_line','turn_arrow_left','turn_arrow_right']);
 let mkTotal=0,mkBad=0,mkOffLane=0,mkFar=0,noIx=0,scaleBad=0;
 for(let seed=0;seed<300;seed++){
  for(const lanes of [1,2,3,4]){
   const ix=seed%2===0;
   const b=G.generate('street',seed*7+1,24,{lanes,median:1,sidewalk:1,intersection:ix});
   let n=0;
   b.grid.forEach((row,y)=>row.forEach((c,x)=>{
    if(!c.mk)return; n++; mkTotal++;
    if(!VOCAB.has(c.mk))mkBad++;
    if(c.g!=='lane')mkOffLane++;
    if(b.meta.crosswalkX<0)mkFar++;
    else{const d=x<b.meta.crosswalkX?b.meta.crosswalkX-x:x-(b.meta.crosswalkX+b.meta.crosswalkW-1);
     if(d>b.meta.pocketLen)mkFar++;}
   }));
   if(!ix&&n>0)noIx++;
   if(ix){
    const wantLeft=(lanes>=4?3:(lanes>=3?2:1));
    if(b.meta.pocketsLeft>2*wantLeft)scaleBad++;
    if(lanes<3&&b.meta.pocketsRight>0)scaleBad++;
   }
  }
 }
 ok("pocket markings appear at intersections", mkTotal>0);
 ok("marking vocabulary is certified (bank classes only)", mkBad===0);
 ok("markings sit on lane cells only", mkOffLane===0);
 ok("no markings on non-intersection streets", noIx===0);
 ok("every pocket cell within pocketLen of the crosswalk", mkFar===0);
 ok("pocket count scales by law (dual at 3, triple at 4, right at 3+)", scaleBad===0);
 console.log(`  pocket sweep: ${mkTotal} marked cells, vocab clean, lane-only, crosswalk-anchored`);
}
ok("zero line-color violations across 500 seeds x 4 lane counts", bad===0);
ok("yellow actually appears", yellow>0);
ok("white actually appears", white>0);
ok("crosswalks actually appear", cross>0);

// the law, checked one claim at a time
const b=G.generate('street',11,24,{lanes:3,median:1,intersection:true});
const rows=b.grid.map(r=>r[0]);
const med=rows.findIndex(c=>c.g==='median');
ok("median exists", med>0);
ok("median is yellow (separates direction)", rows[med].color==='yellow_direction');
const upDir=(()=>{for(let i=med-1;i>=0;i--)if(rows[i].g==='lane')return rows[i].dir;})();
const dnDir=(()=>{for(let i=med+1;i<rows.length;i++)if(rows[i].g==='lane')return rows[i].dir;})();
ok("traffic really does oppose across the median", upDir&&dnDir&&upDir!==dnDir);
const div=rows.findIndex(c=>c.g==='lane_div');
ok("lane divider is white (same direction)", rows[div].color==='white_lane');
const dUp=(()=>{for(let i=div-1;i>=0;i--)if(rows[i].g==='lane')return rows[i].dir;})();
const dDn=(()=>{for(let i=div+1;i<rows.length;i++)if(rows[i].g==='lane')return rows[i].dir;})();
ok("lanes either side of a white divider really do agree", dUp===dDn);
ok("every line cell declares its axis", rows.filter(c=>c.g==='lane_div'||c.g==='median').every(c=>c.axis==='EW'));

// rule 3: a crosswalk is perpendicular by definition
const cw=b.grid.flat().filter(c=>c.g==='crosswalk');
ok("crosswalks exist in this block", cw.length>0);
ok("no crosswalk keeps an inherited with-axis line colour", cw.every(c=>c.color===null));
ok("crosswalk axis is perpendicular to the road", cw.every(c=>c.axis==='NS'));

// a yellow line must NEVER sit between same-direction lanes — forge one and catch it
const forged=G.generate('street',11,24,{lanes:3,median:1});
const dv=forged.grid.findIndex(r=>r[0].g==='lane_div');
forged.grid[dv].forEach(c=>c.color='yellow_direction');
ok("audit catches yellow forged between same-direction lanes", G.auditLines(forged).some(v=>/law says white/.test(v.why)));
// and white must never sit between opposing lanes
const forged2=G.generate('street',11,24,{lanes:3,median:1});
const mv=forged2.grid.findIndex(r=>r[0].g==='median');
forged2.grid[mv].forEach(c=>c.color='white_lane');
ok("audit catches white forged between opposing lanes", G.auditLines(forged2).some(v=>/law says yellow/.test(v.why)));
// and a stale line on a crosswalk
const forged3=G.generate('street',11,24,{lanes:3,intersection:true});
forged3.grid.flat().filter(c=>c.g==='crosswalk')[0].color='white_lane';
ok("audit catches a line colour left on a crosswalk", G.auditLines(forged3).some(v=>/crosswalk carries/.test(v.why)));

ok("determinism survives", JSON.stringify(G.generate('street',7,24,{}))===JSON.stringify(G.generate('street',7,24,{})));
ok("sidewalk sanctity untouched", G.auditSidewalks(G.generate('street',3,24,{})).length===0);

// INTERSECTION LAW (7/17): the box stays clean, crosswalks guard all four
// approaches, yellow lives only on medians, pockets touch only lanes.
{
 const b=G.generate('intersection',4242,24,{lanesEW:3,lanesNS:2});
 const [c0,r0,c1,r1]=b.meta.box;
 let boxDirty=0,yBad=0,cwE=0,cwN=0,mkBad=0,adjBad=0;
 for(let y=0;y<b.H;y++)for(let x=0;x<24;x++){const c=b.grid[y][x];
  if(y>=r0&&y<=r1&&x>=c0&&x<=c1){if(c.mk||c.color)boxDirty++;continue;}
  if(c.color==='yellow_direction'&&c.g!=='median')yBad++;
  if(c.g==='crosswalk'&&c.o==='ew')cwE++;
  if(c.g==='crosswalk'&&c.o==='ns')cwN++;
  if(c.mk&&c.g!=='lane')mkBad++;
 }
 ok('intersection: the box is clean (no paint, no markings inside)',boxDirty===0);
 ok('intersection: yellow only on median cells',yBad===0);
 ok('intersection: EW crosswalk columns guard both sides',cwE===2*(r1-r0+1));
 ok('intersection: NS crosswalk rows guard both sides',cwN===2*(c1-c0+1));
 ok('intersection: markings only on lane cells',mkBad===0);
 ok('intersection: lanes flank the median on all four sides',
    b.grid[b.meta.medRow-1][2].g==='lane'&&b.grid[b.meta.medRow+1][2].g==='lane'&&
    b.grid[2][b.meta.medCol-1].g==='lane'&&b.grid[2][b.meta.medCol+1].g==='lane');
}
console.log(`\n=== LINE COLOR LAW GATE: ${p} passed, ${f} failed ===`);
process.exit(f?1:0);
