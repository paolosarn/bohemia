// BOHEMIA MEDICAL — HOSPITAL CAMPUS (7/18/26, v2). CIVIC, on the DISTRICT KIT, built to the
// EXPLAIN-EVERY-TILE law: no blank slabs — every tile is a named thing. Real hospital site
// (healthfacilityguidelines.com / hdrinc.com): a hospital + ER wing; a SEPARATE ambulance
// court with its own canopy, ambulance staging bays + a HELIPAD; a public main-entrance
// canopy + drop-off lane; a full VISITOR PARKING LOT (striped stalls with parked cars, drive
// aisles, dead landscaping islands, walkways/crosswalks); a parking GARAGE (decked, parked
// cars, a ramp); a medical office building. Nothing unexplained.
// LEGEND: 0 dead-ground 1 drive/asphalt 2 building 3 dead-planter-island 4 entrance-door
//  5 gate 6 walkway/crosswalk 7 canopy 8 garage-structure 9 helipad 10 stall-stripe 11 parked-vehicle
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  // fill a region with a full parking lot: stall stripes, parked cars, drive aisles, and a
  // dead-planter cap island at each row end. Every tile is a stall/car/aisle/planter.
  function parkLot(G,x0,y0,x1,y1){
    var g=G.g, r=G.rnd, ROW=4, AIS=4, ry, sx;
    G.rect(x0,y0,x1,y1,1);                                         // drive-aisle base
    for(ry=y0+1; ry+ROW<=y1-1; ry+=ROW+AIS){
      G.vbar(ry,ry+ROW-1,x0,3,1); G.vbar(ry,ry+ROW-1,x1,3,1);      // dead-planter cap islands (row ends)
      for(sx=x0+2; sx+2<x1-1; sx+=3){
        G.vbar(ry,ry+ROW-1,sx,10,1);                              // stall stripe (2-wide stall, shared divider)
        if(r()<0.5) G.rect(sx+1,ry+1,sx+2,ry+ROW-1,11);           // a parked car in the stall
      }
    }
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, i, x, y, r=G.rnd;
    var MARGIN=3, BANDY=H-1-MARGIN-M(5);

    // PARKING GARAGE (right side): decked structure — parked cars in stalls, drive aisles,
    // a ground-floor ramp entrance off the bottom band.
    var garW=M(20), gx0=W-1-MARGIN-garW;
    G.rect(gx0,MARGIN+1,W-1-MARGIN,BANDY-1,8);                     // garage shell / columns
    for(y=MARGIN+2; y+4<BANDY-1; y+=4+3){                          // decks: stall row + drive aisle
      for(x=gx0+2; x<W-MARGIN-1; x+=3){ G.vbar(y,y+3,x,10,1); if(r()<0.6) G.rect(x+1,y+1,x+2,y+3,11); }
    }
    var rampX=gx0+Math.floor(garW/2); G.rect(rampX-2,BANDY-M(6),rampX+2,BANDY,1);   // ramp down to grade

    var rx0=MARGIN+2, rx1=gx0-M(4), erW=M(13);

    // HOSPITAL + ER WING
    var hy0=MARGIN+3, hy1=hy0+M(30);
    G.rect(rx0+erW+2,hy0,rx1,hy1,2);                               // main hospital
    G.rect(rx0,hy1-M(16),rx0+erW,hy1,2);                          // ER wing (front-left)

    // MAIN ENTRANCE canopy + doors (public drop-off)
    var cxc=Math.floor((rx0+erW+2+rx1)/2);
    G.rect(cxc-M(6),hy1+1,cxc+M(6),hy1+1+M(4),7);
    for(x=cxc-M(4);x<cxc+M(4);x+=2) G.set(x,hy1,4);
    // AMBULANCE canopy at the ER (separate entrance)
    G.rect(rx0,hy1+1,rx0+erW-2,hy1+1+M(4),7);
    G.set(Math.floor(rx0+erW/2),hy1,4);

    // FRONT: fill the whole apron so nothing is blank ---------------------------------
    var apY0=hy1+M(5)+1;
    // 1) DROP-OFF LANE right under the canopies + a WALKWAY/crosswalk strip
    G.rect(rx0,apY0,rx1,apY0+M(3),1);                             // drop-off drive lane
    G.rect(rx0,apY0+M(3)+1,rx1,apY0+M(4)+1,6);                    // walkway across the front
    for(x=cxc-1;x<=cxc+1;x++) G.vbar(apY0,apY0+M(4)+1,x,6,1);     // crosswalk to the main entrance
    // 2) AMBULANCE COURT at the ER (left): staging bays (parked ambulances) + the HELIPAD
    var acY0=apY0+M(5), acX1=rx0+erW+M(2);
    G.rect(rx0,acY0,acX1,BANDY-1,1);
    for(y=acY0+1; y+M(4)<BANDY-M(9); y+=M(4)+2){ G.rect(rx0+1,y,rx0+M(4),y+M(4),11); G.set(rx0,y,10); G.set(rx0+M(5),y,10); } // ambulance bays
    G.disc(rx0+Math.floor(erW/2),BANDY-M(5),M(4),9);             // helipad (in the ambulance court)
    // 3) VISITOR PARKING LOT filling the rest of the apron
    parkLot(G, acX1+M(2), apY0+M(5), rx1, BANDY-1);
    // 4) MEDICAL OFFICE BUILDING at a lot corner (explained: an MOB, floorplanned)
    G.rect(rx1-M(13),apY0+M(6),rx1-1,apY0+M(6)+M(11),2);

    // PEDESTRIAN WALKWAY in the gap between the campus and the garage (no dead void)
    G.rect(rx1+1,MARGIN+1,gx0-1,BANDY-1,6);
    // bottom full-width DRIVE BAND (connects gates, apron, garage ramp)
    G.rect(rx0,BANDY,W-1-MARGIN,H-1-MARGIN,1);

    // CAR ENTRANCES (canonical SOUTH): two curb cuts (public + emergency) connecting the south
    // street to the bottom drive band. STREET-AWARE/DRIVABLE LAW (7/19): build canonical-south,
    // then the KIT rotates the whole campus onto whatever street the cell touches (fixes the old
    // bug where a north-only cell left the drive band stranded behind the hospital), and adds a
    // pedestrian gate on any corner side street.
    function carEntranceSouth(gx){ for(var i2=-3;i2<=3;i2++)G.set(gx+i2,H-1,5);
      for(var yy=H-1; yy>=BANDY; yy--) for(var w=-2;w<=2;w++){ var c=G.get(gx+w,yy); if(c===0||c===3)G.set(gx+w,yy,1); } }
    carEntranceSouth(Math.floor(W*0.40)); carEntranceSouth(Math.floor(W*0.72));

    var res=K.rotateToStreet(g, streets, {gate:5, pedWalk:6, pedOver:function(c){return c===0;}, pedInset:12});
    g=res.g;
    return {g:g, W:g[0].length, H:g.length, streets:streets, gates:res.gates,
      footprints:K.footprints(g,function(v){return v===2;})};
  }
  // a car reaches the campus drive network (code 1) from the street curb cut, in ANY placement
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.85; }

  var PALETTE={1:'#33333c',2:'#8a8478',3:'#55503f',4:'#c7a24a',5:'#c79a3f',6:'#7a7a80',7:'#9a9088',8:'#4c4c55',9:'#b04038',10:'#c9c1aa',11:'#5a5a64'};
  // TILE SPEC (the "note section" for tiling): code -> name, kind, ACT-1 dead-world material.
  var LEGEND={
    0:{name:'dead-ground',        kind:'ground',    act1:'bare cracked dirt (setback / unbuilt gaps)'},
    1:{name:'drive / asphalt',    kind:'drive',      act1:'cracked asphalt drive lane / parking aisle (car-drivable)'},
    2:{name:'building',           kind:'building',   act1:'concrete/panel hospital, ER wing, MOB — grimy, dark windows'},
    3:{name:'dead planter island',kind:'tree-dead', act1:'dry curbed planter, dead shrub stumps, gravel'},
    4:{name:'entrance door',      kind:'building',   act1:'boarded / cracked glass main + ambulance doors, amber frame'},
    5:{name:'gate / curb cut',    kind:'gate',       act1:'campus vehicle entrance, amber curb paint'},
    6:{name:'walkway / crosswalk',kind:'walk',       act1:'faded concrete walkway + crosswalk stripes'},
    7:{name:'canopy',             kind:'structure',  act1:'sagging entrance / ambulance drive-through canopy'},
    8:{name:'parking garage',     kind:'structure',  act1:'decked concrete garage shell, columns, ramp'},
    9:{name:'helipad',            kind:'marking',    act1:'faded rooftop-red helipad circle + H, cracked'},
    10:{name:'parking stall',     kind:'marking',    act1:'faded stall stripe on asphalt'},
    11:{name:'parked vehicle',    kind:'vehicle',    act1:'abandoned car / dead ambulance, dust-caked'}
  };
  var NOTES={
    summary:'Hospital campus — hospital + ER wing, a separate ambulance court with a helipad, a parking garage, a visitor lot, and a medical office building.',
    reference:['Real hospital site guides (healthfacilityguidelines.com, hdrinc.com): hospital + ER, a separate ambulance court + canopy + helipad, a main-entrance drop-off, a visitor lot, a decked garage, an MOB'],
    layout:['Big hospital + ER wing back the campus; a main-entrance canopy + drop-off lane + crosswalk across the front.',
      'A SEPARATE ambulance court at the ER: staging bays (parked ambulances) + a helipad.',
      'A decked parking garage (with a ramp) on one side; a full visitor lot (striped stalls, parked cars, dead-planter islands); a medical office building at a lot corner.',
      'A bottom DRIVE BAND ties the gates, the front apron, the lot, and the garage ramp together.'],
    circulation:'Street-aware via canonical-south + K.rotateToStreet — the whole campus rotates onto the real street (this FIXED a real bug where a north-only cell left the drive band stranded behind the hospital). Drive = code 1; a car reaches the drive network from the curb in ANY placement (K.driveReachFromStreet).',
    decisions:['EXPLAIN-EVERY-TILE: no blank slabs — planters/walkways fill the apron.',
      'Retrofit onto rotateToStreet (7/19) FIXED a real drive-disconnect bug for north-only + N+W-corner cells.',
      'Two curb cuts on the PRIMARY street (public + emergency) are allowed (same frontage); corner side streets get a pedestrian gate.']
  };
  K.register('medical', { generate:generate, body:function(c){return c===2;}, category:'civic', palette:PALETTE, legend:LEGEND, notes:NOTES });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE,legend:LEGEND,notes:NOTES};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaMedical=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
