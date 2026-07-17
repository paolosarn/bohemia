const REG=require('../engine/bohemia_light_registry.js');
const fs=require('fs');
const reg=JSON.parse(fs.readFileSync('gates/BOHEMIA_ACT1_LIGHT_SOURCES_v5_7_16_26.txt','utf8'));
const REG_SNAPSHOT=JSON.stringify(reg);  // deep freeze for the purity proof
let f=0,p=0; const ok=(n,c)=>{c?p++:(f++,console.log("FAIL "+n));};

const N=REG.normalize(reg);
const ix=REG.indexOf(N.sources);

console.log("=== NORMALIZE REPORT ("+N.report.length+" corrections) ===");
N.report.forEach(r=>console.log("  "+r[0].padEnd(32)+" | "+r[1]));

// --- law gates ---
ok("firewood stack emits nothing", ix['p_camp_firewood_stack_21'].radius_cells===0 && ix['p_camp_firewood_stack_21'].flicker_amp===0);
ok("firewood stack is fuel awaiting ignition", ix['p_camp_firewood_stack_21'].lights_when==='ignited');
ok("road flare reclassed to fire", ix['p_light_flare_road_05'].type==='fire');
ok("no electric_PENDING left", !N.sources.some(s=>String(s.type).includes('PENDING')));
ok("every electric defaults dark", N.sources.filter(s=>s.type==='electric').every(s=>s.default_state==='dark'&&s.powered_by==='circuit'));
ok("item lights r=3", ['i_survival_lantern_24','i_survival_campstove_25','i_survival_flashlight_36'].every(k=>ix[k].radius_cells===3));
ok("cane post = residential r=8", ix['p_street_lamp_cane_post_03'].radius_cells===8);
ok("tall traffic light = mast r=15", ix['p_street_traffic_light_tall_16'].radius_cells===15);
ok("curved lamp = arterial r=12", ix['p_street_lamp_curved_04'].radius_cells===12);
ok("burning fire barrels still r=4", ix['p_firebarrel_24'].radius_cells===4);
ok("beacons untouched r=2", ix['p_beacon_amber_16'].radius_cells===2);
ok("radius_classes hoisted off rows", !N.sources.some(s=>s.radius_classes));

// --- resolve gates ---
const props=[
 {source:'p_firebarrel_24',x:10,y:10},
 {source:'p_camp_firewood_stack_21',x:11,y:10},
 {source:'p_camp_firewood_stack_21',x:12,y:10,ignited:true},
 {source:'p_lamp_cane_lit_00',x:20,y:20,cell:[3,3]},
 {source:'p_lamp_cane_lit_01',x:22,y:20,cell:[9,9]},
 {source:'p_beacon_red_17',x:30,y:30},
];
// no grid at all -> nothing electric lights
let r=REG.resolve(props,ix,null);
ok("no grid: zero electric emitters", !r.states.some(s=>s.lit&&s.source.startsWith('p_lamp')));
ok("no grid: lamps render DARK sprite", r.states.filter(s=>s.source.startsWith('p_lamp')).every(s=>s.sprite==='dark'));
ok("fire barrel lit regardless of grid", r.states[0].lit===true);
ok("unlit woodpile emits nothing", r.states[1].lit===false);
ok("ignited woodpile emits at fire radius", r.states[2].lit===true && r.emitters.some(e=>e.x===12&&e.r_cells===4));
ok("beacon battery-lit with no grid", r.states[5].lit===true);

// fake powergrid: cell 3,3 live / 9,9 dead
const power={at:(x,y)=>(x===3&&y===3)?{live:true,owner:'RIG'}:{live:false,owner:null}};
r=REG.resolve(props,ix,power);
const lamp0=r.states.find(s=>s.x===20), lamp1=r.states.find(s=>s.x===22);
ok("live circuit -> lamp lit + lit sprite", lamp0.lit===true&&lamp0.sprite==='lit');
ok("live circuit stamps owner (light=territory)", lamp0.owner==='RIG');
ok("dead circuit -> lamp dark", lamp1.lit===false&&lamp1.sprite==='dark');
ok("lit lamp emits at its class radius", r.emitters.some(e=>e.x===20&&e.r_cells===8));
ok("dead lamp emits nothing", !r.emitters.some(e=>e.x===22));

// determinism
const a=JSON.stringify(REG.resolve(props,ix,power)), b=JSON.stringify(REG.resolve(props,ix,power));
ok("resolve deterministic", a===b);
// PURITY, registry-agnostic (7/16): v1 asserted a literal radius, which broke the
// moment v5 baked UNLIT FUEL LAW into the source data. Purity is not "field X still
// equals 4" — it is "normalize mutated NOTHING". Snapshot in, compare out.
ok("normalize is pure (source reg untouched)", JSON.stringify(reg)===REG_SNAPSHOT);

console.log(`\n=== LIGHTREG GATE: ${p} passed, ${f} failed ===`);
fs.writeFileSync('gates/_norm.json',JSON.stringify(N,null,1));
process.exit(f?1:0);
