// BOHEMIA INDUSTRIAL — WAREHOUSE YARD (7/18/26). Built on the DISTRICT KIT to prove the
// factory: warehouses backing the far edge, a fenced truck yard fronting the street with
// dock doors, drive-in gates, scattered salvage containers. Short because the kit carries
// the bones (street-aware gates, footprints, connectivity, dead-world ground).
// codes: 0 dead-ground 1 yard-asphalt 2 warehouse 3 fence 4 dock-door 5 gate 7 drive 10 container
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, i;
    var isS=function(e){return streets.indexOf(e)>=0;};
    var MARGIN=3, DEEP=M(28), DOCK=M(6);
    G.frame(3);                                                   // perimeter chain-link fence

    // WAREHOUSES back the far edge (N if N is not a street, else S), yard fronts the street
    var backN = !isS('N');
    var by0 = backN ? MARGIN+1 : H-1-MARGIN-DEEP;
    var by1 = backN ? MARGIN+1+DEEP : H-1-MARGIN;
    var dockRow = backN ? by1 : by0;                             // dock face toward the yard
    var n=3, gap=M(3), span=W-2*(MARGIN+1), bw=Math.floor((span-(n-1)*gap)/n);
    for(i=0;i<n;i++){ var bx0=MARGIN+1+i*(bw+gap), bx1=bx0+bw-1;
      G.rect(bx0,by0,bx1,by1,2);                                  // warehouse box
      for(var dx=bx0+2; dx<bx1-1; dx+=M(4)) G.set(dx,dockRow,4);  // loading dock doors on the yard face
    }

    // TRUCK YARD (asphalt) fronting the street
    var yy0 = backN ? by1+2 : MARGIN+1, yy1 = backN ? H-1-MARGIN : by0-2;
    G.rect(MARGIN+1,yy0,W-MARGIN-2,yy1,1);

    // GATES on the streets this cell touches + a drive apron into the yard
    var gates=[];
    streets.forEach(function(edge){
      if(edge==='S'||edge==='N'){ var gx=Math.round(W*(edge==='S'?0.5:0.5)), gy=(edge==='S')?H-1:0, dir=(edge==='S')?-1:1;
        for(i=-4;i<=4;i++)G.set(gx+i,gy,5);
        for(var s=1;s<=H;s++){var yv=gy+dir*s; if(!K.grid&&false)break; if(G.get(gx,yv)===1)break; if(G.get(gx,yv)===2)break; for(var w=-3;w<=3;w++)if(G.get(gx+w,yv)!==2&&G.get(gx+w,yv)!==3)G.set(gx+w,yv,7);}
        gates.push({edge:edge,x:gx,y:gy}); }
      else { var gy2=Math.round(H*0.5), gx2=(edge==='E')?W-1:0, dir2=(edge==='E')?-1:1;
        for(i=-4;i<=4;i++)G.set(gx2,gy2+i,5);
        for(var s2=1;s2<=W;s2++){var xv=gx2+dir2*s2; if(G.get(xv,gy2)===1)break; if(G.get(xv,gy2)===2)break; for(var w2=-3;w2<=3;w2++)if(G.get(xv,gy2+w2)!==2&&G.get(xv,gy2+w2)!==3)G.set(xv,gy2+w2,7);}
        gates.push({edge:edge,x:gx2,y:gy2}); }
    });

    // SALVAGE CONTAINERS scattered on the yard (only on open asphalt)
    var r=G.rnd;
    for(i=0;i<12;i++){ var cx=MARGIN+4+Math.floor(r()*(W-2*MARGIN-14)), cy=yy0+2+Math.floor(r()*Math.max(1,(yy1-yy0-6)));
      if(G.get(cx,cy)===1 && G.get(cx+M(5),cy+M(2))===1) G.rect(cx,cy,cx+M(5),cy+M(2),10); }

    return {g:g, W:W, H:H, streets:streets, gates:gates, footprints:K.footprints(g,function(v){return v===2;})};
  }
  function driveConnected(res){ return K.connectedFrom(res.g,function(c){return c===5;},function(c){return c===1||c===5||c===7;})>0.85; }

  K.register('industrial', { generate:generate, body:function(c){return c===2;},
    palette:{1:'#33333c',2:'#7a7a82',3:'#4a4438',4:'#c7a24a',5:'#c79a3f',7:'#4a4a52',10:'#6b5a3a'} });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;}};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaIndustrial=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
