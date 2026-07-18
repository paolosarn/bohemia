// BOHEMIA SUBURB GENERATOR (candidate, 7/18/26) — pending Paolo's style verdict.
// MODULARITY LAW: genSub(seed,style,cw,ch) fills a cw x ch cell union with ONE
// coherent, connected neighborhood. The judge tool embeds this; gates/suburb_
// modular_gate.js tests it. On approval a style graduates into bohemia_plotgen.
// ===== MODULAR SUBURB generator: fills a cw x ch cell union coherently =====
// codes: 0 lawn 1 road 2 house 3 driveway 4 wall 5 gate 6 garage
var SZ=64;                                  // fine tiles per overmap cell (schematic)
function mkRng(seed){var s=(seed>>>0)||1;return function(){s=(s*1103515245+12345)>>>0;return s/4294967296;};}
function Wd(g){return g[0].length;} function Ht(g){return g.length;}
function blank(w,h){var g=[];for(var y=0;y<h;y++){var r=[];for(var x=0;x<w;x++)r.push(0);g.push(r);}return g;}
function inb(g,x,y){return x>=1&&y>=1&&x<Wd(g)-1&&y<Ht(g)-1;}
function road1(g,x,y,w){for(var dy=-w;dy<=w;dy++)for(var dx=-w;dx<=w;dx++){var nx=(x+dx)|0,ny=(y+dy)|0;
  if(inb(g,nx,ny)&&g[ny][nx]!==2&&g[ny][nx]!==6&&g[ny][nx]!==4)g[ny][nx]=1;}}
function seg(g,x0,y0,x1,y1,w){var n=Math.max(1,Math.max(Math.abs(x1-x0),Math.abs(y1-y0))|0);
  for(var i=0;i<=n;i++)road1(g,x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,w);}
function segCurve(g,x0,y0,x1,y1,amp,w){var n=Math.max(1,Math.abs(y1-y0)|0);
  for(var i=0;i<=n;i++){var t=i/n;var x=x0+(x1-x0)*t+Math.sin(t*Math.PI)*amp;road1(g,x,y0+(y1-y0)*t,w);}}
function ring(g,cx,cy,rx,ry,w){for(var a=0;a<Math.PI*2;a+=0.02)road1(g,cx+Math.cos(a)*rx,cy+Math.sin(a)*ry,w);}
function disc(g,cx,cy,rr){for(var dy=-rr;dy<=rr;dy++)for(var dx=-rr;dx<=rr;dx++)if(dx*dx+dy*dy<=rr*rr)road1(g,cx+dx,cy+dy,0);}   // filled cul-de-sac turnaround
function frame(g,cw){var W=Wd(g),H=Ht(g);
  for(var x=0;x<W;x++){g[0][x]=4;g[H-1][x]=4;}for(var y=0;y<H;y++){g[y][0]=4;g[y][W-1]=4;}
  for(var ci=0;ci<cw;ci++){var gx=(SZ*ci+SZ/2)|0;for(var d=-2;d<=2;d++){g[H-1][gx+d]=5;}
    for(var s=1;s<=4;s++)if(inb(g,gx,H-1-s))g[H-1-s][gx]=1;}}
// ---- Vegas home: street -> driveway -> front garage -> body, both sides of roads ----
function clr(g,cells){for(var i=0;i<cells.length;i++){var c=cells[i];if(!inb(g,c[0],c[1])||g[c[1]][c[0]]!==0)return false;}return true;}
function home(g,rx,ry,nx,ny,drive,gw,hw,hh){var px=-ny,py=nx,gw0=-(gw>>1),hw0=-(hw>>1);
  var dv=[],ga=[],bd=[],all=[];
  for(var d=1;d<=drive;d++)for(var w=gw0;w<gw0+gw;w++){var c=[(rx+nx*d+px*w)|0,(ry+ny*d+py*w)|0];dv.push(c);all.push(c);}
  for(var d=drive+1;d<=drive+2;d++)for(var w=gw0;w<gw0+gw;w++){var c=[(rx+nx*d+px*w)|0,(ry+ny*d+py*w)|0];ga.push(c);all.push(c);}
  for(var d=drive+2;d<drive+2+hh;d++)for(var w=hw0;w<hw0+hw;w++){var c=[(rx+nx*d+px*w)|0,(ry+ny*d+py*w)|0];bd.push(c);all.push(c);}
  if(!clr(g,all))return false;
  dv.forEach(function(c){g[c[1]][c[0]]=3;});ga.forEach(function(c){g[c[1]][c[0]]=6;});bd.forEach(function(c){g[c[1]][c[0]]=2;});return true;}
function fillHomes(g,spacing){var W=Wd(g),H=Ht(g),road=[];
  for(var y=1;y<H-1;y++)for(var x=1;x<W-1;x++)if(g[y][x]===1)road.push([x,y]);
  var k=0;for(var i=0;i<road.length;i++){var x=road[i][0],y=road[i][1];
    for(var s=0;s<4;s++){var nx=[1,-1,0,0][s],ny=[0,0,1,-1][s];
      if(!inb(g,x+nx*2,y+ny*2)||g[y+ny*2][x+nx*2]!==0)continue;
      if((k++%spacing)!==0)continue; home(g,x,y,nx,ny,2,4,7,5);}}}
// ---- road networks (each fills the union, one connected net, curvilinear) ----
function spines(g,cw){var H=Ht(g),xs=[];for(var ci=0;ci<cw;ci++){var gx=(SZ*ci+SZ/2)|0;
  segCurve(g,gx,H-4,gx,8,0,2);xs.push(gx);}if(cw>1)seg(g,xs[0],10,xs[cw-1],10,2);return xs;}
function collectors(g,ch,curve){var W=Wd(g),ys=[];for(var cy=0;cy<ch*2;cy++){var y=(SZ*cy/2+SZ*0.28)|0;
  if(y<14||y>Ht(g)-12)continue;for(var x=8;x<W-8;x++)road1(g,x,(y+(curve?Math.round(Math.sin(x*0.05)*3):0)),2);ys.push(y);}return ys;}
function genSub(seed,style,cw,ch){
  cw=cw||1;ch=ch||1;var g=blank(SZ*cw,SZ*ch);frame(g,cw);var r=mkRng(seed*97+cw*7+ch);
  var W=Wd(g),H=Ht(g);
  if(style==='culs'){
    var xs=spines(g,cw),ys=collectors(g,ch,false);
    ys.forEach(function(y){for(var cx=0;cx<cw*2;cx++){var x=(SZ*cx/2+SZ/4)|0;if(x<14||x>W-14)continue;
      var dir=((x+y)&2)?1:-1;var ey=y+dir*15;seg(g,x,y,x,ey,1);disc(g,x,ey,4);}});
    fillHomes(g,4);
  } else if(style==='loop'){
    spines(g,cw);
    for(var cyy=0;cyy<ch;cyy++)for(var cxx=0;cxx<cw;cxx++){var cx=(SZ*cxx+SZ/2)|0,cy=(SZ*cyy+SZ*0.5)|0;
      ring(g,cx,cy,(SZ*0.28)|0,(SZ*0.24)|0,2);}
    // tie the loops to the spine/gates
    var xs2=[];for(var ci=0;ci<cw;ci++)xs2.push((SZ*ci+SZ/2)|0);
    for(var cyy2=0;cyy2<ch;cyy2++){var cy2=(SZ*cyy2+SZ*0.5)|0;seg(g,8,cy2,W-8,cy2,2);}
    fillHomes(g,4);
  } else { // garden: curvy avenues + parks, sparser homes
    var xs3=spines(g,cw);collectors(g,ch,true);
    for(var ci2=0;ci2<cw;ci2++){var gx=(SZ*ci2+SZ/2)|0;segCurve(g,gx,H-10,gx,14,SZ*0.18,2);}
    fillHomes(g,6);
    // a couple of green pockets stay lawn (already lawn) — sparser reads greener
  }
  var houses=0;for(var y=1;y<H-1;y++)for(var x=1;x<W-1;x++)if(g[y][x]===2&&g[y-1][x]!==2&&g[y][x-1]!==2)houses++;
  return {g:g,houses:houses,cw:cw,ch:ch};
}
// connectivity check exposed for the gate + tool: every road reachable from a gate
function roadConnected(res){var g=res.g,W=Wd(g),H=Ht(g),start=null,total=0;
  for(var y=0;y<H;y++)for(var x=0;x<W;x++){var c=g[y][x];if(c===1||c===5||c===3||c===6){total++;if(!start&&c===5)start=[x,y];}}
  if(!start)return false;var seen={},st=[start];seen[start[0]+','+start[1]]=1;var reach=0;
  while(st.length){var p=st.pop();reach++;var d=[[1,0],[-1,0],[0,1],[0,-1]];
    for(var i=0;i<4;i++){var nx=p[0]+d[i][0],ny=p[1]+d[i][1],k=nx+','+ny;if(seen[k])continue;
      if(nx<0||ny<0||nx>=W||ny>=H)continue;var cc=g[ny][nx];if(cc===1||cc===5||cc===3||cc===6){seen[k]=1;st.push([nx,ny]);}}}
  return reach/total>0.92;   // ~all drivable cells reachable from a street gate
}
if(typeof module!=='undefined')module.exports={genSub:genSub,roadConnected:roadConnected,SZ:SZ};
