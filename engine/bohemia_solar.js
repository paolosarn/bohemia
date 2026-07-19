// BOHEMIA SOLAR FARM (7/18/26). INFRASTRUCTURE, on the DISTRICT KIT, built to research +
// EXPLAIN-EVERY-TILE. Fits the CLUSTERED-POWER lore: the grid is eerily perfect — this
// plant is intact and generating while the world is dead. Real utility-solar site
// (pvfarm.io / pvcase.com): panel arrays in long rows, ~20-30ft O&M gravel access roads
// splitting the field into blocks, an INVERTER/transformer pad anchoring each block, a
// project SUBSTATION switchyard linking to the grid, a control building, perimeter fence +
// setback + a driveway gate. Every tile is one of those things.
// LEGEND: 0 dead-ground(setback) 1 gravel-access-road 2 control-building 3 fence
//  4 inverter/transformer-pad 5 gate 6 substation-switchgear 7 solar-panel
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, i, x, y;
    var MARGIN=3, ROWH=M(3), GAP=M(4), ROAD=M(3), SUBW=M(22), SUBH=M(16);
    G.frame(3);                                                       // perimeter fence
    var ax0=MARGIN+2, ax1=W-2-MARGIN, ay0=MARGIN+2, ay1=H-2-MARGIN;
    G.rect(ax0,ay0,ax1,ay1,1);                                        // gravel base (O&M ground)

    // SUBSTATION switchyard + CONTROL building in the bottom-left corner (by the gate)
    var sx0=ax0, sy1=ay1, sx1=ax0+SUBW, sy0=ay1-SUBH;
    for(y=sy0+1;y<sy1-1;y+=M(4)) for(x=sx0+1;x<sx1-1;x+=M(5)) G.rect(x,y,x+M(3),y+M(2),6);  // transformer/switchgear rows
    G.rect(sx0,sy0-M(7),sx0+M(10),sy0-1,2);                          // control / O&M building
    G.rect(sx0-1,sy0-M(8),sx1+1,sy1,3);                              // hmm inner fence would overwrite; instead outline below
    // re-lay the switchyard cleanly (the outline above set fence 3 over it) -> restore yard + fence ring only
    G.rect(sx0,sy0,sx1,sy1,1); for(y=sy0+1;y<sy1-1;y+=M(4)) for(x=sx0+1;x<sx1-1;x+=M(5)) G.rect(x,y,x+M(3),y+M(2),6);
    for(x=sx0;x<=sx1;x++){G.set(x,sy0,3);G.set(x,sy1,3);} for(y=sy0;y<=sy1;y++){G.set(sx0,y,3);G.set(sx1,y,3);}  // yard fence
    G.rect(sx0+2,sy0-M(7),sx0+2+M(10),sy0-1,2);                      // control / O&M building (above the yard)

    // PANEL ARRAY FIELD: long rows of panels, vertical O&M access roads split it into blocks,
    // an inverter/transformer pad anchors each block edge.
    var roadXs=[]; for(x=ax0+M(30); x<ax1-M(6); x+=M(30)){ G.rect(x,ay0,x+ROAD-1,ay1,1); roadXs.push(x); }
    var invAt=0;
    for(y=ay0; y+ROWH<=ay1; y+=ROWH+GAP){
      for(x=ax0; x+M(6)<ax1; x+=M(7)){
        // skip access-road columns and the substation footprint
        var onRoad=false; for(i=0;i<roadXs.length;i++) if(x+M(6)>=roadXs[i]-1 && x<=roadXs[i]+ROAD) onRoad=true;
        var inSub=(x<sx1+2 && y>sy0-M(8));
        if(onRoad||inSub) continue;
        G.rect(x,y,x+M(6),y+ROWH-1,7);                               // a panel table (row segment)
      }
      // an inverter/transformer pad tucked beside a road on alternating rows
      if(roadXs.length){ var rX=roadXs[invAt%roadXs.length]; G.rect(rX-M(2),y,rX-1,y+ROWH-1,4); invAt++; }
    }

    // GATE + access driveway from the street(s) to the gravel spine
    var gates=[];
    streets.forEach(function(edge){
      if(edge==='S'||edge==='N'){ var gx=Math.floor(W*0.5), gy=(edge==='S')?H-1:0, dir=(edge==='S')?-1:1;
        for(i=-3;i<=3;i++)G.set(gx+i,gy,5); for(var s=1;s<=M(6);s++){var yy=gy+dir*s; if(!(yy>0&&yy<H-1))break; for(var w=-2;w<=2;w++)if(G.get(gx+w,yy)===7||G.get(gx+w,yy)===0)G.set(gx+w,yy,1);} gates.push({edge:edge,x:gx,y:gy}); }
      else { var gy2=Math.floor(H*0.5), gx2=(edge==='E')?W-1:0, dir2=(edge==='E')?-1:1;
        for(i=-3;i<=3;i++)G.set(gx2,gy2+i,5); for(var s2=1;s2<=M(6);s2++){var xx=gx2+dir2*s2; if(!(xx>0&&xx<W-1))break; for(var w2=-2;w2<=2;w2++)if(G.get(xx,gy2+w2)===7||G.get(xx,gy2+w2)===0)G.set(xx,gy2+w2,1);} gates.push({edge:edge,x:gx2,y:gy2}); }
    });

    return {g:g, W:W, H:H, streets:streets, gates:gates, footprints:K.footprints(g,function(v){return v===2;})};
  }

  // a maintenance vehicle reaches the gravel access roads (code 1) from the street gate, in ANY
  // placement (STREET-AWARE/DRIVABLE LAW 7/19). Solar's roads run edge-to-edge so this is high.
  function driveConnected(res){ return K.driveReachFromStreet(res.g,1)>0.9; }

  var PALETTE={1:'#5a5346',2:'#7a7266',3:'#4a4438',4:'#6b6b74',5:'#c79a3f',6:'#8a8a92',7:'#2e3440'};
  K.register('solar', { generate:generate, body:function(c){return c===2;}, category:'infrastructure', palette:PALETTE });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;},palette:PALETTE};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaSolar=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
