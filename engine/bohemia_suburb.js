// BOHEMIA SUBURB (canonical, 7/18/26) — Paolo APPROVED cul-de-sacs + the scale.
// Real dimensions at the game scale (TILE=0.75 m, 128 tiles = 96 m per cell):
// a ~14x8 m house body + a 6x6 m front garage + a 6 m driveway to the street, on
// ~16 m lots, lining cul-de-sac streets off the gate. Cluster-aware (cw,ch) per
// the MERGE LAW: fills the union as ONE connected neighborhood, wall wrapping the
// union, a gate per street-facing cell. Homes are exposed as footprints the world
// model floorplans (residential). Loops + garden were graveyarded (7/18 verdict).
// codes: 0 dead-ground 1 road 2 house 3 driveway 4 wall 5 gate 6 garage
// ACT 1 IS A DEAD WORLD: no vegetation ever (no trees/pools/grass). Backyards are
// dead ground (code 0). Homes NEVER touch the wall — 3-tile dead backyard minimum.
(function(root){
  var SZ=128, TILE=0.75;                                  // tiles/cell, m/tile
  var M=function(m){return Math.round(m/TILE);};          // meters -> tiles
  function rng(seed){var s=(seed>>>0)||1;return function(){s=(s*1103515245+12345)>>>0;return s/4294967296;};}
  function Wd(g){return g[0].length;} function Ht(g){return g.length;}
  function blank(w,h){var g=[];for(var y=0;y<h;y++){var r=[];for(var x=0;x<w;x++)r.push(0);g.push(r);}return g;}
  function inb(g,x,y){return x>=1&&y>=1&&x<Wd(g)-1&&y<Ht(g)-1;}
  function road(g,x,y,w){for(var dy=-w;dy<=w;dy++)for(var dx=-w;dx<=w;dx++){var nx=(x+dx)|0,ny=(y+dy)|0;
    if(inb(g,nx,ny)&&g[ny][nx]!==2&&g[ny][nx]!==6&&g[ny][nx]!==4)g[ny][nx]=1;}}
  function seg(g,x0,y0,x1,y1,w){var n=Math.max(1,Math.max(Math.abs(x1-x0),Math.abs(y1-y0))|0);
    for(var i=0;i<=n;i++)road(g,x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,w);}
  function disc(g,cx,cy,rr){for(var dy=-rr;dy<=rr;dy++)for(var dx=-rr;dx<=rr;dx++)if(dx*dx+dy*dy<=rr*rr)road(g,cx+dx,cy+dy,0);}
  function frame(g,cw){var W=Wd(g),H=Ht(g);
    for(var x=0;x<W;x++){g[0][x]=4;g[H-1][x]=4;}for(var y=0;y<H;y++){g[y][0]=4;g[y][W-1]=4;}
    for(var ci=0;ci<cw;ci++){var gx=(SZ*ci+SZ/2)|0;for(var d=-3;d<=3;d++)g[H-1][gx+d]=5;
      for(var s=1;s<=6;s++)if(inb(g,gx,H-1-s))g[H-1-s][gx]=1;}}
  // Vegas home (top-down): a SHORT driveway (a car apron, 3 tiles long x 4 wide
  // for 2 cars) leads to a garage that is the FRONT CORNER of the house. The
  // house is the bulk; the driveway is tiny. Home faces the street (nx,ny),
  // backyard goes to the wall behind it.
  // GAP = Paolo's law: at worst 3 tiles of backyard AND 3 tiles between neighbors.
  var DRIVE=3, DVW=4, HW=M(14), HD=M(9), GARW=M(5), GARD=M(5), RD=Math.max(2,M(5)>>1), GAP=3, LOTW=M(14)+GAP;
  function isHome(v){return v===2||v===3||v===6;}
  function home(g,rx,ry,nx,ny){var px=-ny,py=nx;
    var h0=-(HW>>1), garOff=h0+HW-GARW;                 // garage at one front corner
    var dv=[],ga=[],bd=[],foot=[];
    for(var d=DRIVE+1;d<DRIVE+1+HD;d++)for(var w=h0;w<h0+HW;w++){
      var c=[(rx+nx*d+px*w)|0,(ry+ny*d+py*w)|0]; foot.push(c);
      ((d<DRIVE+1+GARD && w>=garOff && w<garOff+GARW)?ga:bd).push(c);}
    var dvOff=garOff+((GARW-DVW)>>1);
    for(var d2=1;d2<=DRIVE;d2++)for(var w2=dvOff;w2<dvOff+DVW;w2++){var c2=[(rx+nx*d2+px*w2)|0,(ry+ny*d2+py*w2)|0];dv.push(c2);foot.push(c2);}
    // footprint must sit on open land
    for(var i=0;i<foot.length;i++){var c=foot[i];if(!inb(g,c[0],c[1])||g[c[1]][c[0]]!==0)return false;}
    // 3-tile skirt on the two SIDES + the BACK must be clear of any other home
    for(var d3=1;d3<=DRIVE+HD+GAP;d3++)for(var w3=h0-GAP;w3<h0+HW+GAP;w3++){
      var side=(w3<h0||w3>=h0+HW), back=(d3>DRIVE+HD);
      if(!side&&!back)continue;
      var mx=(rx+nx*d3+px*w3)|0,my=(ry+ny*d3+py*w3)|0;
      if(mx<0||my<0||mx>=Wd(g)||my>=Ht(g))continue;
      if(isHome(g[my][mx]))return false;}
    // NEVER let a home touch the wall: 3-tile DEAD backyard to any wall (Paolo 7/18).
    for(var fi=0;fi<foot.length;fi++){var fc=foot[fi];
      for(var wy=-GAP;wy<=GAP;wy++)for(var wx=-GAP;wx<=GAP;wx++){
        var wxx=fc[0]+wx,wyy=fc[1]+wy;
        if(wxx<0||wyy<0||wxx>=Wd(g)||wyy>=Ht(g))continue;
        if(g[wyy][wxx]===4)return false;}}
    dv.forEach(function(c){g[c[1]][c[0]]=3;});ga.forEach(function(c){g[c[1]][c[0]]=6;});bd.forEach(function(c){g[c[1]][c[0]]=2;});return true;}
  // even lot spacing along every road frontage (position-based, not a global counter)
  function fillHomes(g){var W=Wd(g),H=Ht(g);
    for(var y=1;y<H-1;y++)for(var x=1;x<W-1;x++){if(g[y][x]!==1)continue;
      for(var s=0;s<4;s++){var nx=[1,-1,0,0][s],ny=[0,0,1,-1][s];
        if(!inb(g,x+nx*2,y+ny*2)||g[y+ny*2][x+nx*2]!==0)continue;   // frontage opens to buildable land
        var along=(nx!==0)?y:x;                                     // coordinate running along the road
        if((along%LOTW)!==((nx>0||ny>0)?0:(LOTW>>1)))continue;      // stagger the two sides
        home(g,x,y,nx,ny);}}}
  function ringRect(g,x0,y0,x1,y1,w){seg(g,x0,y0,x1,y0,w);seg(g,x1,y0,x1,y1,w);seg(g,x1,y1,x0,y1,w);seg(g,x0,y1,x0,y0,w);}
  // WALLED NEIGHBORHOOD — LOTS FIRST (Paolo 7/18, calibrated to 89147/Campana Dr:
  // ~0.15 acre lots, 2-story homes, packed). The developer maximizes LOTS; streets
  // exist to give them driveways. So: homes back onto the perimeter wall on all
  // four sides (a ring of lots), and the INTERIOR is packed with rows of lots
  // served by streets spaced exactly one back-to-back lot-pair apart. Houses are
  // the primary unit; roads serve them; every home keeps its 3-tile yards.
  function placeRow(g,streetY,W,lotw,lo,hi){   // pack houses on BOTH sides of a horizontal street
    for(var lx=lo+((lotw/2)|0); lx<hi; lx+=lotw){
      home(g,lx,streetY-RD,0,-1);              // north side: backyard up, driveway down to the street
      home(g,lx,streetY+RD,0, 1);              // south side: backyard down
    }}
  function placeCol(g,streetX,H,lotw,lo,hi){   // pack houses on BOTH sides of a vertical street
    for(var ly=lo+((lotw/2)|0); ly<hi; ly+=lotw){
      home(g,streetX-RD,ly,-1,0); home(g,streetX+RD,ly,1,0);
    }}
  // houses along one straight ring edge, on BOTH sides (outer backs the wall,
  // inner backs the center), packed every LOTW.
  function placeEdge(g,x0,y0,dx,dy,len,nx,ny,lotw){
    for(var t=(lotw>>1); t<len-2; t+=lotw){ var rx=(x0+dx*t)|0, ry=(y0+dy*t)|0;
      home(g,rx+nx*RD,ry+ny*RD,nx,ny);          // outer side: start just past the road edge
      home(g,rx-nx*RD,ry-ny*RD,-nx,-ny); }}      // inner side
  function placeEdge2(g,x0,y0,dx,dy,len,nx,ny,lotw){   // OUTER side only (backs the wall)
    for(var t=(lotw>>1); t<len-2; t+=lotw){ var rx=(x0+dx*t)|0, ry=(y0+dy*t)|0; home(g,rx+nx*RD,ry+ny*RD,nx,ny); }}
  function ringHomes(g,R,W,H,lotw){
    placeEdge(g,R,R,1,0,W-2*R,0,-1,lotw);        // top edge: outer backs up
    placeEdge(g,R,H-R,1,0,W-2*R,0,1,lotw);       // bottom edge: outer backs down
    placeEdge(g,R,R,0,1,H-2*R,-1,0,lotw);        // left edge: outer backs left
    placeEdge(g,W-R,R,0,1,H-2*R,1,0,lotw);       // right edge: outer backs right
  }
  // one column of houses backing a SIDE wall, fronting a vertical rail (outer side only)
  function placeColOuter(g,streetX,dir,lo,hi){
    for(var ly=lo+(LOTW>>1); ly<hi-2; ly+=LOTW) home(g,(streetX+dir*RD)|0,ly,dir,0);
  }
  // THE BLOCK — the canonical Bohemia suburb (Paolo APPROVED 7/18; the central-court
  // variant was rejected -> graveyard). DENSE, HOUSES-FIRST fill of the whole block:
  // a rail+rung LADDER is the minimum road that serves a full block of lots — two
  // vertical rails near the side walls, horizontal rungs between them. Houses pack
  // EVERY frontage: both sides of every rung (top+bottom wall rows and all interior
  // rows), and the outer side of each rail (left+right wall columns). Nothing is left
  // as empty band; every home keeps its 3-tile dead backyard to the wall.
  function denseFill(g,W,H,gx){
    var back=RD+DRIVE+HD, R=back+5;                              // 23: house back stays >=4 tiles off the wall (3-tile dead yard)
    var Lx=R, Rx=W-R, span=(H-R)-R;
    var n=Math.max(2, Math.ceil(span/(2*back+2*GAP))+1);        // as many rung streets as fit with back-to-back yards
    var ys=[]; for(var i=0;i<n;i++) ys.push(Math.round(R+span*i/(n-1)));
    // ROADS FIRST: rails + rungs (a fully connected ladder, no dead ends), gate spoke.
    seg(g,Lx,ys[0],Lx,ys[n-1],RD); seg(g,Rx,ys[0],Rx,ys[n-1],RD);
    for(i=0;i<n;i++) seg(g,Lx,ys[i],Rx,ys[i],RD);
    seg(g,gx,H-4,gx,ys[n-1],RD);                                 // entrance from the gate to the bottom rung
    // THEN houses, packing every frontage.
    for(i=0;i<n;i++) placeRow(g,ys[i],W,LOTW,Lx,Rx);
    placeColOuter(g,Lx,-1,ys[0],ys[n-1]);                        // left wall column
    placeColOuter(g,Rx, 1,ys[0],ys[n-1]);                        // right wall column
  }
  function generate(seed,style,cw,ch){
    if(typeof style!=='string'){ch=cw;cw=style;style='ring';}   // back-compat
    cw=cw||1;ch=ch||1;var g=blank(SZ*cw,SZ*ch);frame(g,cw);
    var W=Wd(g),H=Ht(g);
    for(var ci=0;ci<cw;ci++){ var gx=(SZ*ci+SZ/2)|0; denseFill(g,W,H,gx); }   // the one canonical block, packed

    // NO BACKYARD FILL: Act 1 is a dead world. Water is not wasted on landscaping;
    // there are no trees, no pools, no grass. Backyards are dead ground (code 0).
    var houses=0;
    for(var yy=1;yy<H-1;yy++)for(var xx=1;xx<W-1;xx++)if(g[yy][xx]===2&&g[yy-1][xx]!==2&&g[yy][xx-1]!==2)houses++;
    return {g:g,W:W,H:H,houses:houses,cw:cw,ch:ch};
  }
  // building footprints (house bodies) for the world model: bounding box of each
  function homeFootprints(res){var g=res.g,W=res.W,H=res.H,seen={},out=[];
    var d4=[[1,0],[-1,0],[0,1],[0,-1]];
    for(var y=1;y<H-1;y++)for(var x=1;x<W-1;x++){if(g[y][x]!==2||seen[x+','+y])continue;
      var st=[[x,y]];seen[x+','+y]=1;var x0=x,y0=y,x1=x,y1=y;
      while(st.length){var p=st.pop();if(p[0]<x0)x0=p[0];if(p[1]<y0)y0=p[1];if(p[0]>x1)x1=p[0];if(p[1]>y1)y1=p[1];
        for(var i=0;i<4;i++){var nx=p[0]+d4[i][0],ny=p[1]+d4[i][1],k=nx+','+ny;
          if(!seen[k]&&nx>=0&&ny>=0&&nx<W&&ny<H&&g[ny][nx]===2){seen[k]=1;st.push([nx,ny]);}}}
      out.push({x:x0,y:y0,w:x1-x0+1,h:y1-y0+1});}
    return out;}
  function roadConnected(res){var g=res.g,W=res.W,H=res.H,start=null,total=0;
    for(var y=0;y<H;y++)for(var x=0;x<W;x++){var c=g[y][x];if(c===1||c===5||c===3||c===6){total++;if(!start&&c===5)start=[x,y];}}
    if(!start)return false;var seen={},st=[start];seen[start[0]+','+start[1]]=1;var reach=0;
    while(st.length){var p=st.pop();reach++;for(var i=0,d=[[1,0],[-1,0],[0,1],[0,-1]];i<4;i++){var nx=p[0]+d[i][0],ny=p[1]+d[i][1],k=nx+','+ny;
      if(seen[k]||nx<0||ny<0||nx>=W||ny>=H)continue;var cc=g[ny][nx];if(cc===1||cc===5||cc===3||cc===6){seen[k]=1;st.push([nx,ny]);}}}
    return reach/total>0.9;}
  var API={generate:generate,homeFootprints:homeFootprints,roadConnected:roadConnected,SZ:SZ,TILE:TILE};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaSuburb=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
