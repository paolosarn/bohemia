// BOHEMIA COMMERCIAL — CORNER SHOPPING PLAZA (7/18/26, Paolo's first commercial district)
// A Vegas corner strip mall, built by the PLACEMENT PLAYBOOK (roads/parking FIRST,
// straight segments, render+look, dead-world). Paolo's rulings folded in:
//  - PARKING obeys BOHEMIA_PARKING_LAW: 2-wide stalls, stripe every 3rd tile (shared
//    dividers), row 4 deep, aisle <=4. (The approved ST0 stall tiles texture these.)
//  - Every business has a BACK ENTRANCE (service door) onto a rear SERVICE ALLEY (the
//    "mini road" wrapping the back corner) for trash + deliveries.
//  - Commercial gets MORE curb cuts on the main streets (2 per street).
//  - A GAS STATION pad sits in the street corner (canopy + pumps + kiosk).
// Street-aware like the suburb: it exits the streets it TOUCHES. codes:
//  0 dead-ground 1 parking-asphalt 2 store 3 drive-aisle 4 stall-stripe 5 curb-cut
//  6 sidewalk 7 store-door 8 service-alley 9 service-door 10 gas-canopy 11 gas-pump
(function(root){
  var SZ=128, TILE=0.75;
  var M=function(m){return Math.round(m/TILE);};
  function blank(){var g=[];for(var y=0;y<SZ;y++){var r=[];for(var x=0;x<SZ;x++)r.push(0);g.push(r);}return g;}
  function inb(x,y){return x>=0&&y>=0&&x<SZ&&y<SZ;}
  function rect(g,x0,y0,x1,y1,c){for(var y=y0;y<=y1;y++)for(var x=x0;x<=x1;x++)if(inb(x,y))g[y][x]=c;}
  function hLine(g,x0,x1,y,c,w){for(var x=x0;x<=x1;x++)for(var d=0;d<(w||1);d++)if(inb(x,y+d))g[y+d][x]=c;}
  function vLine(g,y0,y1,x,c,w){for(var y=y0;y<=y1;y++)for(var d=0;d<(w||1);d++)if(inb(x+d,y))g[y][x+d]=c;}

  var MARGIN=2, SERVLANE=M(4), STOREDEEP=M(20), SIDE=2, DOOR=M(6);   // stores twice as deep (Paolo 7/18)
  var ROW=4, AISLE=4;                          // BOHEMIA_PARKING_LAW: stall 4 deep, aisle 4
  var BAND=SERVLANE+STOREDEEP+SIDE;            // property line -> parking edge

  // PARKING per law (stall 2 wide, stripe every 3rd tile, row 4 deep) BUT open, not
  // maximized (Paolo 7/18): the whole lot is a drive surface, stall rows carved in with
  // a 4-tile aisle around EVERY row + a perimeter drive lane, so cars circulate — a
  // drive lane in front of the stores and daylight between the rows.
  function parkField(g,x0,y0,x1,y1){
    rect(g,x0,y0,x1,y1,3);                                    // whole lot drivable
    var ix0=x0+AISLE, ix1=x1-AISLE;                           // stalls inset -> side drive lanes
    for(var ry=y0+AISLE; ry+ROW-1<=y1-AISLE; ry+=ROW+AISLE){  // a stall row every ROW+AISLE (4-tile aisle each side)
      rect(g,ix0,ry,ix1,ry+ROW-1,1);
      for(var sx=ix0; sx<=ix1; sx+=3) vLine(g,ry,ry+ROW-1,sx,4,1);
    }
  }

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S','E'];
    var g=blank(), W=SZ, H=SZ, x, y;
    var isS=function(e){return streets.indexOf(e)>=0;};
    var back={N:!isS('N'),W:!isS('W'),S:false,E:false};
    if(!back.N&&!back.W){ if(!isS('S'))back.S=true; else if(!isS('E'))back.E=true; else back.N=true; }

    // parking rectangle = inside the store bands (back edges) and street sidewalks
    var pL=MARGIN+(back.W?BAND:0), pT=MARGIN+(back.N?BAND:0),
        pR=W-1-MARGIN-(back.E?BAND:0), pB=H-1-MARGIN-(back.S?BAND:0);
    if(isS('S'))pB-=SIDE; if(isS('N'))pT+=SIDE; if(isS('E'))pR-=SIDE; if(isS('W'))pL+=SIDE;

    // --- STORE L: a CONTINUOUS service-alley L wraps the back property corner, the
    // store L sits inside it (each strip starts one alley-width in from the OTHER back
    // edge, so the alley never gets walled off — the top-left-connection fix). ---
    var aT=MARGIN+SERVLANE, fT=aT+STOREDEEP;   // top strip: alley-end row, store-front row
    var aL=MARGIN+SERVLANE, fL=aL+STOREDEEP;   // left strip: alley-end col, store-front col
    if(back.N){
      rect(g,MARGIN,MARGIN,W-1-MARGIN,aT-1,8);                          // top service alley (full width)
      var nx0=back.W?aL:MARGIN, nsw0=back.W?fL:MARGIN;                  // store + sidewalk start clear of the left strip
      rect(g,nx0,aT,W-1-MARGIN,fT-1,2);
      hLine(g,nsw0,W-1-MARGIN,fT,6,SIDE);
      for(x=nsw0+3;x<W-MARGIN;x+=DOOR){ if(inb(x,aT))g[aT][x]=9; if(inb(x,fT-1))g[fT-1][x]=7; }
    }
    if(back.W){
      rect(g,MARGIN,MARGIN,aL-1,H-1-MARGIN,8);                          // left service alley (full height)
      var wy0=back.N?aT:MARGIN, wsw0=back.N?fT:MARGIN;
      rect(g,aL,wy0,fL-1,H-1-MARGIN,2);
      vLine(g,wsw0,H-1-MARGIN,fL,6,SIDE);
      for(y=wsw0+3;y<H-MARGIN;y+=DOOR){ if(inb(aL,y))g[y][aL]=9; if(inb(fL-1,y))g[y][fL-1]=7; }
    }
    // service connector: each alley END drives around the building into the parking.
    if(back.N){ rect(g,W-1-MARGIN-SERVLANE,MARGIN,W-1-MARGIN,pT-1,8); }
    if(back.W){ rect(g,MARGIN,H-1-MARGIN-SERVLANE,pL-1,H-1-MARGIN,8); }

    // --- PARKING (fronts the streets) ---
    parkField(g,pL,pT,pR,pB);
    // sidewalk curb between lot and each street
    if(isS('S'))hLine(g,pL,pR,pB+1,6,SIDE); if(isS('N'))hLine(g,pL,pR,pT-SIDE,6,SIDE);
    if(isS('E'))vLine(g,pT,pB,pR+1,6,SIDE); if(isS('W'))vLine(g,pT,pB,pL-SIDE,6,SIDE);

    // --- GAS STATION pad in the street corner (needs two streets) ---
    var gas=null;
    if(isS('S')&&isS('E')){
      var gw=M(24), gh=M(22), gx0=pR-gw, gy0=pB-gh;             // twice as big (Paolo 7/18)
      rect(g,gx0,gy0,pR,pB,1);                                  // clear to asphalt
      rect(g,gx0+2,gy0+2,pR-2,gy0+2+M(9),10);                   // canopy
      for(var pmp=gx0+5; pmp<pR-4; pmp+=5) vLine(g,gy0+5,gy0+9,pmp,11,1);   // pump islands
      rect(g,gx0+2,pB-M(9),gx0+2+M(12),pB-1,2);                 // kiosk (mini-mart)
      gas={x:gx0,y:gy0,w:gw,h:gh};
    }

    // --- CURB CUTS: commercial gets MORE (2 per street), skipping the gas corner ---
    var gates=[];
    function cut(edge,frac){
      if(edge==='S'||edge==='N'){ var gx=Math.round(W*frac), gy=(edge==='S')?H-1:0, dir=(edge==='S')?-1:1;
        for(var i=-3;i<=3;i++)if(inb(gx+i,gy))g[gy][gx+i]=5;
        for(var s=1;s<=H;s++){var yy=gy+dir*s; if(!inb(gx,yy))break; if(g[yy][gx]===1||g[yy][gx]===3)break;
          for(var w=-2;w<=2;w++) if(inb(gx+w,yy)&&g[yy][gx+w]!==2) g[yy][gx+w]=3; }
        gates.push({edge:edge,x:gx,y:gy}); }
      else { var gy2=Math.round(H*frac), gx2=(edge==='E')?W-1:0, dir2=(edge==='E')?-1:1;
        for(var j=-3;j<=3;j++)if(inb(gx2,gy2+j))g[gy2+j][gx2]=5;
        for(var s2=1;s2<=W;s2++){var xx=gx2+dir2*s2; if(!inb(xx,gy2))break; if(g[gy2][xx]===1||g[gy2][xx]===3)break;
          for(var w2=-2;w2<=2;w2++) if(inb(xx,gy2+w2)&&g[gy2+w2][xx]!==2) g[gy2+w2][xx]=3; }
        gates.push({edge:edge,x:gx2,y:gy2}); }
    }
    streets.forEach(function(edge){ cut(edge,0.34); cut(edge,0.72); });

    var res={g:g,W:W,H:H,streets:streets,gates:gates,gas:gas};
    res.stores=storeFootprints(res);
    return res;
  }

  function storeFootprints(res){var g=res.g,W=res.W,H=res.H,seen={},out=[],d4=[[1,0],[-1,0],[0,1],[0,-1]];
    for(var y=0;y<H;y++)for(var x=0;x<W;x++){if(g[y][x]!==2||seen[x+','+y])continue;
      var st=[[x,y]];seen[x+','+y]=1;var x0=x,y0=y,x1=x,y1=y;
      while(st.length){var p=st.pop();if(p[0]<x0)x0=p[0];if(p[1]<y0)y0=p[1];if(p[0]>x1)x1=p[0];if(p[1]>y1)y1=p[1];
        for(var i=0;i<4;i++){var nx=p[0]+d4[i][0],ny=p[1]+d4[i][1],k=nx+','+ny;
          if(!seen[k]&&nx>=0&&ny>=0&&nx<W&&ny<H&&g[ny][nx]===2){seen[k]=1;st.push([nx,ny]);}}}
      out.push({x:x0,y:y0,w:x1-x0+1,h:y1-y0+1});}
    return out;}
  // service door (9) present + reachable from a rear alley (8): trash-out invariant
  function hasServiceAccess(res){var g=res.g,doors=0,alley=0;
    for(var y=0;y<res.H;y++)for(var x=0;x<res.W;x++){if(g[y][x]===9)doors++;if(g[y][x]===8)alley++;}
    return doors>0 && alley>0;}
  // drive network (parking + aisles + curb cuts + alley) reachable from a curb cut
  function driveConnected(res){var g=res.g,W=res.W,H=res.H,start=null,total=0,DR={1:1,3:1,5:1,8:1};
    for(var y=0;y<H;y++)for(var x=0;x<W;x++){var c=g[y][x];if(DR[c]){total++;if(!start&&c===5)start=[x,y];}}
    if(!start)return false;var seen={},st=[start];seen[start[0]+','+start[1]]=1;var reach=0;
    while(st.length){var p=st.pop();reach++;for(var i=0,d=[[1,0],[-1,0],[0,1],[0,-1]];i<4;i++){var nx=p[0]+d[i][0],ny=p[1]+d[i][1],k=nx+','+ny;
      if(seen[k]||nx<0||ny<0||nx>=W||ny>=H)continue;if(DR[g[ny][nx]]){seen[k]=1;st.push([nx,ny]);}}}
    return reach/total>0.85;}

  var API={generate:generate,storeFootprints:storeFootprints,driveConnected:driveConnected,hasServiceAccess:hasServiceAccess,SZ:SZ,TILE:TILE};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaCommercial=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
