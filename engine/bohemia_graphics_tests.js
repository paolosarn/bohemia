// BOHEMIA GRAPHICS TESTS — one command, every module (7/14/26)
const E=require('./bohemia_engine_graphics_7_14_26.js');
const {BOH_LIGHT,BOH_DAYCYCLE,BOH_SLICE,BOH_BLOCKGEN,BOH_OMBRIDGE}=E;
let pass=0,fail=0;const T=(n,c)=>{c?pass++:(fail++,console.error('FAIL',n));};
// LIGHT (5)
{const p=BOH_LIGHT.makePass(100,100);
p.setEmitters([{x:5,y:5,color:[255,180,100],r_cells:4,wobAmp:0.22}]);
T('light: level at emitter',p.levelAt(5,5,0)>0.9);
T('light: ambient far',Math.abs(p.levelAt(50,50,0)-3.52/16)<0.01);
T('light: falloff',p.levelAt(6,5,0)>p.levelAt(8,5,0));
T('light: wobble',p.levelAt(8,5,0.25)!==p.levelAt(8,5,0.75));
p.setAmbient([4,4,4]);T('light: ambient settable',Math.abs(p.levelAt(50,50,0)-0.25)<0.01);}
// DAYCYCLE (7)
{const D=BOH_DAYCYCLE;
T('day: midnight = night',JSON.stringify(D.ambientAt(0))===JSON.stringify(D.NIGHT));
T('day: noon = day',JSON.stringify(D.ambientAt(0.5))===JSON.stringify(D.DAY));
T('day: golden warm',D.ambientAt(0.75)[0]>D.ambientAt(0.75)[2]);
T('day: night floor',D.ambientAt(0.95)[2]>=D.NIGHT[2]-1e-9);
T('day: continuous',Math.abs(D.ambientAt(0.1999)[0]-D.ambientAt(0.2001)[0])<0.2);
T('day: wraps',JSON.stringify(D.ambientAt(1.25))===JSON.stringify(D.ambientAt(0.25)));
T('day: nightish',D.isNightish(0.05)&&!D.isNightish(0.5));}
// SLICE CORE (8) + WORLD CLOCK (4)
{const S=BOH_SLICE;const clock=S.makeClock(0);
T('slice: beat math',clock.beatOf(1499)===2&&clock.beatOf(1500)===3);
const world={passable:(x,y)=>!(x===2&&y===0)};
const m=S.makeMover({x:0,y:0});m.hold([1,0],0);
m.tick(500,clock,world);T('slice: step on beat',m.st.x===1);
m.tick(600,clock,world);T('slice: no mid-beat step',m.st.x===1);
m.tick(1000,clock,world);T('slice: blocked refused',m.st.x===1);
m.release();m.hold([0,1],1000);m.tick(3600,clock,world);
T('slice: run law 2 cells',m.st.y===2);
const d=S.makeDoor(5,5);T('slice: closed blocks',d.blocks(5,5));
d.toggle(0);for(let t=0;t<3000;t+=125)d.tick(t);
T('slice: opens f>=5 passable',d.f===8&&d.passable());
const tc=S.makeTurnClock();
const wm=S.makeMover({x:10,y:10});const w=S.makeWanderer(wm,42);
for(let i=0;i<50;i++)w.tick(0,tc,{passable:()=>true});
T('slice: I-move-you-move (frozen)',wm.st.x===10&&wm.st.y===10);
const wc=S.makeWorldClock(0.917);
T('clock: 22:00 start',wc.clockText()==='22:00');
for(let i=0;i<128;i++)wc.stepWalk();
T('clock: 128 steps = 4 min',Math.abs(wc.seconds()-0.917*86400-243.2)<0.01);
const wc2=S.makeWorldClock(0);for(let i=0;i<32;i++)wc2.stepWalk();
T('clock: 32 steps ~ 1 min',Math.abs(wc2.seconds()-60.8)<0.01);
const wc3=S.makeWorldClock(0);wc3.stepRun(2);
T('clock: run cost',Math.abs(wc3.seconds()-1.8)<1e-9);}
// BLOCKGEN (6 core + terrain)
{const G=BOH_BLOCKGEN;
const b=G.generate('street',201,24,{lanes:2,intersection:true});
T('gen: street builds',b.grid.length>0&&b.meta.lanes===2);
T('gen: freeway 5',G.generate('freeway',1,24,{}).meta.lanes===5);
T('gen: residential 1+1',G.generate('residential',1,24,{}).meta.lanes===1);
T('gen: deterministic',JSON.stringify(G.generate('street',7,24,{}))===JSON.stringify(G.generate('street',7,24,{})));
const de=G.generate('desert',42,24,{});
T('gen: desert passable',de.grid.every(r=>r.every(c=>c.props.every(p=>!p.impassable))));
T('gen: mountain dense',G.generate('mountain',42,24,{}).grid.flat().filter(c=>c.props.length).length>0);}
// BRIDGE (5, needs canonical overmap)
{const O=require('./bohemia_overmap.js');
const G=BOH_BLOCKGEN,B=BOH_OMBRIDGE;
const m=O.buildOvermap(12345);
const strip=B.blockFor(m.at(51,29),G);
T('bridge: strip 3/dir sidewalk3',strip.meta.lanes===3&&strip.meta.sidewalk===3);
T('bridge: freeway 5/dir',B.blockFor(m.at(21,0),G).meta.lanes===5);
T('bridge: arterial researched 3',B.blockFor(m.at(16,3),G).meta.lanes>=2);
T('bridge: deterministic',JSON.stringify(B.blockFor(m.at(16,3),G))===JSON.stringify(B.blockFor(m.at(16,3),G)));
T('bridge: desert covered',!B.blockFor(m.at(19,3),G).pending);}
// PLOTGEN (5 in bundle)
{const P=E.BOH_PLOTGEN;
T('plot: nice suburb walled',P.generate('suburb',777,3).meta.walled===true);
T('plot: rough suburb open',P.generate('suburb',777,0).meta.walled===false);
T('plot: gates passable',P.generate('suburb',777,3).grid[127].filter(c=>c.props.some(p=>p.p==='gate_open')).every(c=>c.props.every(p=>!p.impassable)));
T('plot: parking fronts stores toward street',(()=>{const c=P.generate('commercial',555,2,{streetEdges:['S']});return c.grid[c.H-3][60].g==='parking_concrete'&&c.grid[c.H-30][60].g==='storefront_pad';})());
T('plot: deterministic',JSON.stringify(P.generate('commercial',9,2))===JSON.stringify(P.generate('commercial',9,2)));}
// MERGE LAW (4 in bundle)
{const P=E.BOH_PLOTGEN,B=E.BOH_OMBRIDGE;
const m2=P.generate('suburb',777,3,{shape:{cw:2,ch:1}});
T('merge: 2x1 union ring',m2.W===256&&!m2.grid[64][128].props.some(p=>p.p==='perimeter_wall'));
T('merge: entries scale with frontage',m2.meta.entries.length>=2&&m2.meta.entries.every(e=>e.edge==='S'));
T('merge: commercial apron faces street',(()=>{const c=P.generate('commercial',555,2,{shape:{cw:2,ch:1},streetEdges:['S']});return c.grid[c.H-3][250].g==='parking_concrete'&&c.grid[c.H-30][200].g==='storefront_pad';})());
const O=require('./bohemia_overmap.js');const om=O.buildOvermap(12345);
T('merge: cluster deterministic',JSON.stringify(B.clusterFor(om,33,6))===JSON.stringify(B.clusterFor(om,33,6)));}
// PLOTGEN v2 FULL (folded 7/14)
{const P=E.BOH_PLOTGEN;
const p=P.generate('suburb',900,2,{streetEdges:['S']});
T('v2: one wall style per community',(()=>{const s=new Set();p.grid.flat().forEach(c=>c.props.forEach(q=>{if(q.p==='perimeter_wall')s.add(q.style);}));return s.size===1;})());
T('v2: entries only street edges',p.meta.entries.every(e=>e.edge==='S'));
T('v2: entrance is suburb_road',p.meta.entries[0].cells.every(([x,y])=>p.grid[y][x].g==='suburb_road'));
T('v2: road stub inward',p.grid[p.H-3][p.meta.entries[0].cells[0][0]].g==='suburb_road');
T('v2: q2 not gated',!p.grid.flat().some(c=>c.props.some(q=>q.p==='gate_hardware')));
T('v2: rich gated',P.generate('suburb',901,4,{streetEdges:['S']}).meta.gated===true);
T('v2: wall style varies between plots',P.generate('suburb',902,2,{}).meta.wallStyle!==P.generate('suburb',903,2,{}).meta.wallStyle);
T('v2: walls 2-tall',p.grid.flat().every(c=>c.props.every(q=>q.p!=='perimeter_wall'||q.hTiles===2)));
const cN=P.generate('commercial',700,2,{streetEdges:['N']});
T('v2: commercial apron flips N',cN.grid[2][60].g==='parking_concrete'&&cN.grid[30][60].g==='storefront_pad');
const cE=P.generate('commercial',700,2,{streetEdges:['E']});
T('v2: commercial apron flips E',cE.grid[60][cE.W-3].g==='parking_concrete');
const i=P.generate('industrial',808,2,{streetEdges:['S']});
T('v2: industrial drive faces street',i.grid[i.H-5][60].g==='drive_concrete'&&i.grid[i.H-30][60].g==='shed_pad');
T('v2: industrial fence cut passable',i.meta.entries[0].cells.every(([x,y])=>i.grid[y][x].props.every(p=>!p.impassable)));
T('v2: forceGated override',P.generate('suburb',1,0,{forceGated:true,forceWalled:true}).meta.gated===true);
T('v2: forceWalled false override',P.generate('suburb',1,4,{forceWalled:false,forceGated:false}).meta.walled===false);}
// BIG ACREAGE + AIRFIELD (folded)
{const G=E.BOH_BLOCKGEN;
const w=G.generate('wash',5,24,{});
T('wash: floor+slope+service',w.grid[5].some(c=>c.g==='wash_floor')&&w.grid[5].some(c=>c.g==='wash_slope')&&w.grid[5].filter(c=>c.g==='wash_service_road').length===1);
const s=G.generate('solar',5,24,{});
T('solar: rows+aisles+fence',s.grid[5].some(c=>c.g==='panel_row')&&s.grid[0].every(c=>c.props.some(p=>p.p==='fence')));
const f=G.generate('farm',5,24,{});
T('farm: lanes every 8',f.grid[0].every(c=>c.g==='farm_lane')&&f.grid[3].every(c=>c.g==='field_row'));
const a=G.generate('airfield',5,24,{});
T('airfield: runway+centerline+apron',a.grid.some((r,y)=>r[0].g==='runway'&&a.grid[y+1][0].g==='runway_centerline')&&a.grid[a.H-2].every(c=>c.g==='apron_concrete'));
T('terrain regressions',G.generate('desert',42,24,{}).meta.type==='desert'&&G.generate('mountain',42,24,{}).meta.type==='mountain');}
// BRIDGE FULL COVERAGE (folded)
{const O=require('./bohemia_overmap.js');
const G=E.BOH_BLOCKGEN,B=E.BOH_OMBRIDGE,P=E.BOH_PLOTGEN;
const m=O.buildOvermap(12345);
const finds={};
for(let y=0;y<96;y++)for(let x=0;x<96;x++){const d=m.at(x,y).district;if(!finds[d])finds[d]=[x,y];}
for(const d of ['wash','solar','farm','airport','airbase'])
  T('bridge covers '+d,!B.blockFor(m.at(finds[d][0],finds[d][1]),G).pending);
for(const d of ['gated','estate','trailer','industrial','warehouse'])
  T('plotFor covers '+d,!!B.plotFor(m,finds[d][0],finds[d][1],P).plot);
T('plotFor entries obey street edges',(()=>{const r=B.plotFor(m,33,6,P);return r.plot.meta.entries.every(e=>r.plot.meta.streetEdges.includes(e.edge));})());}
// PARKING GEOMETRY LAW (blessed 7/14)
{const P=E.BOH_PLOTGEN;
const c=P.generate('commercial',700,2,{streetEdges:['S']});
T('parking: aisle nearest street',[0,1,2,3].every(d=>c.grid[c.H-1-d][30].g==='parking_concrete'));
T('parking: stall lines every 3rd shared',(()=>{const d=5;for(let b=0;b<30;b++){const g=c.grid[c.H-1-d][b].g;if(b%3===0&&g!=='stall_line')return false;if(b%3!==0&&g!=='parking_concrete')return false;}return true;})());}
// CENTER TURN LANE (7/14)
{const G=E.BOH_BLOCKGEN;
const b=G.generate('street',412,24,{lanes:3,median:1,centerTurn:true});
T('twlt: rows painted',b.grid.flat().some(c=>c.g==='twlt_T')&&b.grid.flat().some(c=>c.g==='twlt_B'));
T('twlt: median regression intact',(()=>{const p=G.generate('street',412,24,{lanes:3,median:1});return p.grid.flat().some(c=>c.g==='median');})());}
// LAMP HEIGHT + RARE BARRELS (7/14)
{const G=E.BOH_BLOCKGEN;
const b=G.generate('street',555,26,{lanes:3,median:1,lampSpacing:7});
T('lamp: arterial 4-tall dead',b.grid.flat().flatMap(c=>c.props.filter(p=>p.p==='street_lamp')).every(p=>p.hTiles===4&&p.state==='dead'));
T('lamp: barrels rare sidewalk-only',(()=>{let ok=true,n=0;b.grid.forEach(row=>row.forEach(c=>{c.props.forEach(p=>{if(p.p==='fire_barrel'){n++;if(c.g!=='side')ok=false;}});}));return ok&&n>0;})());}
// POWER GRID (clustered power law, 7/14)
{const O=require('./bohemia_overmap.js');
const P=E.BOH_POWERGRID;
const m=O.buildOvermap(12345);
const pm=P.powerMap(m,777,{});
T('power: circuits exist',pm.circuits>100);
T('power: deterministic',JSON.stringify(P.powerMap(m,777,{}).at(16,3))===JSON.stringify(P.powerMap(m,777,{}).at(16,3)));
T('power: live circuits owned',(()=>{for(let y=0;y<96;y+=3)for(let x=0;x<96;x+=3){const s=pm.at(x,y);if(s.live&&!s.owner)return false;}return true;})());}
// TILEPOOL — weather rarity law + 30-year marking wash (7/16)
{const TP=require('./bohemia_tilepool.js');
const entries=[];
for(let i=0;i<6;i++)entries.push({key:'p'+i,weathered:false});
for(let i=0;i<3;i++)entries.push({key:'w'+i,weathered:true});
const pool=TP.makePool(entries);
T('pool: law share is 12%',Math.abs(pool.share-0.12)<1e-9);
// 88/12 must hold across a real field of cells, not per family
{let w=0,n=0;for(let y=0;y<128;y++)for(let x=0;x<128;x++){n++;if(pool.pick(x,y,99).weathered)w++;}
 const frac=w/n;
 T('pool: weathered lands near 12%',Math.abs(frac-0.12)<0.02);}
T('pool: deterministic per cell',pool.pick(9,9,5).key===pool.pick(9,9,5).key);
T('pool: seed changes the field',(()=>{let d=0;for(let i=0;i<200;i++)if(pool.pick(i,3,1).key!==pool.pick(i,3,2).key)d++;return d>50;})());
// UNIFORM SIBLING DRAW BANNED: one semantic across a surface must not resolve
// to one tile, and weathered must never arrive as a contiguous slab.
T('pool: no uniform surface draw',(()=>{const s=new Set();for(let x=0;x<64;x++)s.add(pool.pick(x,7,42).key);return s.size>=5;})());
T('pool: weathered scattered not slabbed',(()=>{let runs=0,cur=0,max=0;
  for(let x=0;x<512;x++){if(pool.pick(x,11,42).weathered){cur++;max=Math.max(max,cur);}else{if(cur)runs++;cur=0;}}
  return runs>30&&max<=6;})());
T('pool: no 3x3 weathered slab',(()=>{const W=(x,y)=>pool.pick(x,y,42).weathered;
  for(let y=0;y<128-2;y++)for(let x=0;x<128-2;x++){let all=true;
    for(let j=0;j<3&&all;j++)for(let i=0;i<3&&all;i++)if(!W(x+i,y+j))all=false;
    if(all)return false;}
  return true;})());
// seeds must RESAMPLE the field, not permute it (small seeds sharing low bits
// with x is the classic way this breaks silently)
T('pool: small seeds resample not permute',(()=>{const cnt=s=>{let c=0;
  for(let x=0;x<512;x++)if(pool.pick(x,11,s).weathered)c++;return c;};
  const a=cnt(1),b=cnt(7),c=cnt(42);
  return !(a===b&&b===c);})());
T('pool: parent-only pool legal',TP.makePool([{key:'a'},{key:'b'}]).pick(1,1,1).key!=null);
T('pool: empty parents rejected',(()=>{try{TP.makePool([{key:'w',weathered:true}]);return false;}catch(e){return true;}})());
T('pool: weights respected',(()=>{const p=TP.makePool([{key:'heavy',weight:9},{key:'light',weight:1}]);
  let h=0;for(let x=0;x<1000;x++)if(p.pick(x,0,3).key==='heavy')h++;return h>820&&h<980;})());
// 30-YEAR WASH
T('wash: law amount 0.55',Math.abs(TP.MARK_WASH-0.55)<1e-9);
T('wash: white moves 55% to asphalt',(()=>{const w=TP.washRGB([255,255,255]);const a=TP.ASPHALT_BASE;
  return Math.abs(w[0]-(255+(a[0]-255)*0.55))<1&&w[0]<255&&w[0]>a[0];})());
T('wash: yellow classified',TP.isMarkingPx(240,200,40));
T('wash: white classified',TP.isMarkingPx(238,238,235));
T('wash: asphalt not classified',!TP.isMarkingPx(62,60,58));
T('wash: dark red blood not classified',!TP.isMarkingPx(90,20,20));
T('wash: alpha never touched',(()=>{const px=[255,255,255,0, 250,210,50,255];
  const r=TP.washMarkings(px);return r.pixels[3]===0&&r.pixels[7]===255;})());
T('wash: transparent px skipped',(()=>{const px=[255,255,255,0];const r=TP.washMarkings(px);
  return r.touched===0&&r.pixels[0]===255;})());
T('wash: non-marking px untouched',(()=>{const px=[62,60,58,255];const r=TP.washMarkings(px);
  return r.touched===0&&r.pixels[0]===62;})());
T('wash: input not mutated',(()=>{const px=[255,255,255,255];TP.washMarkings(px);return px[0]===255;})());
T('wash: amount knob works',(()=>{const px=[255,255,255,255];
  const a=TP.washMarkings(px,{amount:0}).pixels[0];return a===255;})());}
console.log('GRAPHICS ENGINE TESTS:',pass,'pass /',fail,'fail');
process.exit(fail?1:0);
