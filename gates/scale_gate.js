const S=require('../engine/bohemia_prop_scale.js');
const fs=require('fs');
const set=JSON.parse(fs.readFileSync(__dirname+'/../banks/BOHEMIA_ACT1_CONFIRMED_SET_7_13_26.txt','utf8'));
let p=0,f=0; const ok=(n,c)=>{c?p++:(f++,console.log("FAIL "+n));};
const rep=S.load(set);
console.log("=== ITEM SCALE LAW COVERAGE ===");
console.log("  flags:",rep.flags,"| resolved:",rep.resolved,"| unmapped:",rep.unmapped);
Object.entries(rep.byMode).sort((a,b)=>b[1]-a[1]).forEach(([k,n])=>console.log(`   ${String(n).padStart(4)}  ${k}`));
if(rep.unmapped) console.log("  UNMAPPED PACKS:",rep.unmappedPacks);

ok("all 848 flags accounted for", rep.flags===848);
ok("zero unmapped", rep.unmapped===0);
// cars: Paolo locked 2x3
const car=S.sizeFor('10. Abandoned cars',0,null,[1,1]);
ok("car takes 2x3 footprint (3 wide, 2 tall)", car.cellW===3&&car.cellH===2&&car.mode==='FOOTPRINT');
// hand object
const jar=S.sizeFor('Jars, bottles and items',0,null,[1,1]);
ok("jar renders sub-cell at 0.55", jar.drawScale===0.55&&jar.mode==='ITEM');
// wall piece is a surface, not a prop
const wall=S.sizeFor('3. Broken wall tiles',0,null,[1,1]);
ok("broken wall goes to the wall SURFACE layer", wall.mode==='SURFACE'&&wall.layer==='wall');
const roof=S.sizeFor('5. Roof tiles',0,null,[1,1]);
ok("roof goes to the roof SURFACE layer", roof.mode==='SURFACE'&&roof.layer==='roof');
// fence is a run
const fen=S.sizeFor('6. Chain link fences',0,null,[1,1]);
ok("chain link is a RUN piece (fence != wall law)", fen.mode==='RUN'&&fen.family==='fence');
// container
const con=S.sizeFor('Cargo, crates and containers',0,null,[1,1]);
ok("ISO container gets a real 6x2 footprint", con.cellW===6&&con.cellH===2);
// unflagged item still sub-cell
const un=S.sizeFor('11. Survival props',999,null,[1,1]);
ok("unflagged member of an item family still renders sub-cell", un.drawScale===0.55);
// a fire barrel is a hand-scale object (55gal drum ~0.6m in a 1m cell)
const fb=S.sizeFor('18. Light sources and fire barrels',24,null,[1,1]);
ok("fire barrel resolves to item scale, not a full cell", fb.drawScale===0.55);
ok("familyOf never guesses", S.familyOf('completely unknown pack name xyz')===null);
// determinism
ok("deterministic", JSON.stringify(S.sizeFor('10. Abandoned cars',0,null,[1,1]))===JSON.stringify(S.sizeFor('10. Abandoned cars',0,null,[1,1])));
console.log(`\n=== SCALE GATE: ${p} passed, ${f} failed ===`);
process.exit(f?1:0);
