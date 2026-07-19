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

    // GATES: public + emergency entrances on the streets this cell touches
    var gates=[];
    function drive(fx,fy,dir,horiz){ for(var s=0;s<=(horiz?W:H);s++){ var xx=horiz?fx+dir*s:fx, yy=horiz?fy:fy+dir*s;
      if(!(xx>0&&yy>0&&xx<W-1&&yy<H-1))break; var cur=G.get(xx,yy); if(cur===1)break; if([2,8].indexOf(cur)>=0)break;
      for(var w=-2;w<=2;w++){ var ax=horiz?xx:xx+w, ay=horiz?yy+w:yy; if([0,10,11,3].indexOf(G.get(ax,ay))>=0)G.set(ax,ay,1); } } }
    streets.forEach(function(edge){
      if(edge==='S'||edge==='N'){ var gy=(edge==='S')?H-1:0,dir=(edge==='S')?-1:1;
        [Math.floor(W*0.4),Math.floor(W*0.72)].forEach(function(gx){ for(i=-3;i<=3;i++)G.set(gx+i,gy,5); drive(gx,gy+dir,dir,false); gates.push({edge:edge,x:gx,y:gy}); }); }
      else { var gx2=(edge==='E')?W-1:0,dir2=(edge==='E')?-1:1, gy2=BANDY+2;
        for(i=-3;i<=3;i++)G.set(gx2,gy2+i,5); drive(gx2+dir2,gy2,dir2,true); gates.push({edge:edge,x:gx2,y:gy2}); }
    });

    return {g:g, W:W, H:H, streets:streets, gates:gates, footprints:K.footprints(g,function(v){return v===2;})};
  }
  function driveConnected(res){ return K.connectedFrom(res.g,function(c){return c===5;},function(c){return c===1||c===5||c===7;})>0.8; }

  var PALETTE={1:'#33333c',2:'#8a8478',3:'#55503f',4:'#c7a24a',5:'#c79a3f',6:'#7a7a80',7:'#9a9088',8:'#4c4c55',9:'#b04038',10:'#c9c1aa',11:'#5a5a64'};
  K.register('medical', { generate:generate, body:function(c){return c===2;}, category:'civic', palette:PALETTE });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaMedical=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
