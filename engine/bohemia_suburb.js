// BOHEMIA SUBURB (canonical, 7/18/26) — Paolo APPROVED cul-de-sacs + the scale.
// Real dimensions at the game scale (TILE=0.75 m, 128 tiles = 96 m per cell):
// a ~14x8 m house body + a 6x6 m front garage + a 6 m driveway to the street, on
// ~16 m lots, lining cul-de-sac streets off the gate. Cluster-aware (cw,ch) per
// the MERGE LAW: fills the union as ONE connected neighborhood, wall wrapping the
// union, a gate per street-facing cell. Homes are exposed as footprints the world
// model floorplans (residential). Loops + garden were graveyarded (7/18 verdict).
// codes: 0 lawn 1 road 2 house 3 driveway 4 wall 5 gate 6 garage
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
  var DRIVE=3, DVW=4, HW=M(14), HD=M(9), GARW=M(5), GARD=M(5), RD=Math.max(2,M(5)>>1), LOTW=M(15);
  function clr(g,cells){for(var i=0;i<cells.length;i++){var c=cells[i];if(!inb(g,c[0],c[1])||g[c[1]][c[0]]!==0)return false;}return true;}
  function home(g,rx,ry,nx,ny){var px=-ny,py=nx;
    var h0=-(HW>>1), garOff=h0+HW-GARW;                 // garage at one front corner
    var dv=[],ga=[],bd=[],all=[];
    // house body rectangle, garage carved into its street-facing front corner
    for(var d=DRIVE+1;d<DRIVE+1+HD;d++)for(var w=h0;w<h0+HW;w++){
      var c=[(rx+nx*d+px*w)|0,(ry+ny*d+py*w)|0]; all.push(c);
      ((d<DRIVE+1+GARD && w>=garOff && w<garOff+GARW)?ga:bd).push(c);}
    // short driveway apron in front of the garage
    var dvOff=garOff+((GARW-DVW)>>1);
    for(var d2=1;d2<=DRIVE;d2++)for(var w2=dvOff;w2<dvOff+DVW;w2++){var c2=[(rx+nx*d2+px*w2)|0,(ry+ny*d2+py*w2)|0];dv.push(c2);all.push(c2);}
    if(!clr(g,all))return false;
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
  // WALLED NEIGHBORHOOD (Paolo 7/18): homes BACK ONTO the perimeter wall, fronts
  // (driveway->garage) facing an interior street. So the streets run INSIDE, one
  // home-depth off the wall, and homes fill the band between street and wall
  // (backs out) plus the interior. cluster-aware: the ring wraps the whole union.
  function generate(seed,style,cw,ch){
    if(typeof style!=='string'){ch=cw;cw=style;style='culs';}   // back-comat: (seed,cw,ch)
    cw=cw||1;ch=ch||1;var g=blank(SZ*cw,SZ*ch);frame(g,cw);
    var W=Wd(g),H=Ht(g), R=DRIVE+HD+M(3);                        // ring inset = home depth + a tiny backyard
    for(var ci=0;ci<cw;ci++){var gx=(SZ*ci+SZ/2)|0;seg(g,gx,H-6,gx,H-R,RD);}   // gate -> perimeter ring
    ringRect(g,R,R,W-R,H-R,RD);                                  // the perimeter street (homes back the wall outside it)
    if(style==='culs'){
      // cul-de-sac fingers reach INTO the interior from the ring; homes line them
      for(var fx=R+M(16);fx<W-R-M(8);fx+=M(20)){var ey=(fx&M(20))?H-R-M(20):R+M(20);seg(g,fx,R,fx,ey,RD);disc(g,fx,ey,M(5));}
    } else if(style==='double'){
      // a second inner ring -> two bands of homes back-to-back, green core
      var R2=R+M(20)+M(10);
      if(W-2*R2>M(20)&&H-2*R2>M(20)){ringRect(g,R2,R2,W-R2,H-R2,RD);
        for(var cc=0;cc<cw;cc++){var lx=(SZ*cc+SZ/2)|0;seg(g,lx,R,lx,R2,RD);}}   // connectors tie inner ring to outer
    } else { // 'court' : short cul courts hanging off the ring, roomier
      for(var cxx=R+M(22);cxx<W-R-M(12);cxx+=M(30)){seg(g,cxx,R,cxx,R+M(18),RD);disc(g,cxx,R+M(18),M(6));}
    }
    fillHomes(g);
    var houses=0,rects=[];var seenH={};
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
