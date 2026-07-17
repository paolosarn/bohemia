const TP=require('../engine/bohemia_tilepool.js');
let p=0,f=0; const ok=(n,c)=>{c?p++:(f++,console.log("FAIL "+n));};
ok("TAN_SHARE = 0.85 (Paolo's wall ruling)", TP.TAN_SHARE===0.85);

// a wall pool: 3 tan repaints + 3 originals, each with a weathered sibling
const walls=[];
for(let i=0;i<3;i++){
  walls.push({key:'W'+i+'_tan',   tan:true,  weathered:false});
  walls.push({key:'W'+i+'_orig',  tan:false, weathered:false});
  walls.push({key:'W'+i+'_tan_w', tan:true,  weathered:true});
  walls.push({key:'W'+i+'_orig_w',tan:false, weathered:true});
}
const pool=TP.makePool(walls);
ok("tan axis detected", pool.tanShare===0.85);

let tan=0,weath=0,N=200000;
for(let i=0;i<N;i++){
  const e=pool.pick(i%512,(i/512)|0,7);
  if(e.tan)tan++; if(e.weathered)weath++;
}
const tr=tan/N, wr=weath/N;
console.log(`  measured over ${N} fine cells: tan ${(tr*100).toFixed(2)}%  weathered ${(wr*100).toFixed(2)}%`);
ok("tan lands at 85% (+-1%)", Math.abs(tr-0.85)<0.01);
ok("weathered still lands at 12% (+-1%) — axes independent", Math.abs(wr-0.12)<0.01);

// independence: tan rate inside the weathered bucket must also be 85%
let tw=0,wn=0;
for(let i=0;i<N;i++){const e=pool.pick(i%512,(i/512)|0,99); if(e.weathered){wn++; if(e.tan)tw++;}}
ok("tan rate inside weathered bucket is still 85% (true independence)", Math.abs(tw/wn-0.85)<0.02);

// keys on FINE CELL, not family (the V6-0 bug)
const a=pool.pick(10,10,1), b=pool.pick(11,10,1);
let diff=0; for(let x=0;x<400;x++){ if(pool.pick(x,0,1).key!==pool.pick(x+1,0,1).key) diff++; }
ok("neighbours vary per cell (no family-wide flip)", diff>100);
// determinism
ok("deterministic per (x,y,seed)", pool.pick(5,5,3).key===pool.pick(5,5,3).key);
ok("seed changes the draw", (()=>{let d=0;for(let x=0;x<200;x++)if(pool.pick(x,0,1).key!==pool.pick(x,0,2).key)d++;return d>20;})());

// pools with no tan siblings must be untouched (ground, street, etc.)
const ground=[{key:'G0',weathered:false},{key:'G1',weathered:false},{key:'G0w',weathered:true}];
const gp=TP.makePool(ground);
ok("pool with no tan siblings has no tan axis", gp.tanShare===null);
let gw=0; for(let i=0;i<N;i++){ if(gp.pick(i%512,(i/512)|0,4).weathered) gw++; }
ok("ground pool weathering unaffected (12%)", Math.abs(gw/N-0.12)<0.01);

// a wall with a tan repaint but no original left must not crash or starve
const onlyTan=TP.makePool([{key:'T',tan:true,weathered:false},{key:'T2',tan:true,weathered:false}]);
ok("all-tan pool does not create a phantom axis", onlyTan.tanShare===null);
ok("all-tan pool still picks", !!onlyTan.pick(1,1,1).key);
console.log(`\n=== TAN WALL GATE: ${p} passed, ${f} failed ===`);
process.exit(f?1:0);
