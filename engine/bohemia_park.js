// BOHEMIA PARK (7/19/26). LEISURE, on the DISTRICT KIT. Research-first (community-park
// design guides: a 9-acre park is PACKED — ball diamond, multipurpose field, hard courts,
// playground, skate park, fenced dog run, community garden, picnic grove, a central plaza
// with pavilion + restrooms, a pond, a loop trail, parking) + EXPLAIN-EVERY-TILE: no ocean
// of blank lawn, every zone is a named amenity laced together by paths. Act-1 DEAD: no
// living grass — dead-brown turf, bare trees, empty pond, dry garden beds; the hardscape
// (courts, paths, plaza, skate concrete, backstops) stands intact.
// LEGEND:
//  0 setback-dead-ground   1 path/plaza/drive        2 building(pavilion/restroom/shade)
//  3 dead-tree             4 field/court marking      5 gate
//  6 sport-court           7 dead-turf(lawn/field)    8 playground safety-surface
//  9 dead-pond            10 parking-stall            11 parked-car
// 12 infield-dirt         13 site-furniture(bench/table/trash)  14 dry-garden-bed
// 15 skate-concrete       16 fence(dog-run/backstop/ballfield)
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, i, x, y, r=G.rnd;
    var MARG=5;
    var IN0=MARG, IN1=W-1-MARG, JN0=MARG, JN1=H-1-MARG;

    // ---- BASE: dead-turf right out to a 1-tile setback edge (no blank frame) ----
    G.rect(1,1,W-2,H-2,7);

    // small helpers ---------------------------------------------------------------
    function isSoft(c){ return c===7||c===0||c===3; }               // overwritable ground
    function path(x,y){ if(G.get(x,y)>=0 && (isSoft(G.get(x,y)))) G.set(x,y,1); }
    function pathH(x0,x1,yy,t){ t=t||2; for(x=Math.min(x0,x1);x<=Math.max(x0,x1);x++)for(var d=0;d<t;d++)path(x,yy+d); }
    function pathV(y0,y1,xx,t){ t=t||2; for(y=Math.min(y0,y1);y<=Math.max(y0,y1);y++)for(var d=0;d<t;d++)path(xx+d,y); }
    function markRect(x0,y0,x1,y1){ for(x=x0;x<=x1;x++){G.set(x,y0,4);G.set(x,y1,4);} for(y=y0;y<=y1;y++){G.set(x0,y,4);G.set(x1,y,4);} }
    function fenceRect(x0,y0,x1,y1){ for(x=x0;x<=x1;x++){G.set(x,y0,16);G.set(x,y1,16);} for(y=y0;y<=y1;y++){G.set(x0,y,16);G.set(x1,y,16);} }
    function trees(x0,y0,x1,y1,n){ for(var k=0;k<n;k++){ var tx=x0+Math.floor(r()*(x1-x0)), ty=y0+Math.floor(r()*(y1-y0));
      if(G.get(tx,ty)===7){ G.set(tx,ty,3); if(r()<0.5)G.set(tx+1,ty,3); } } }
    function bench(x,y){ if(G.get(x,y)===7||G.get(x,y)===1){ G.set(x,y,13); } }

    // ---- 1. LOOP TRAIL (jogging path around the whole park) ----
    var LP=MARG+2;
    pathH(LP,W-1-LP,LP); pathH(LP,W-1-LP,H-1-LP);
    pathV(LP,H-1-LP,LP); pathV(LP,H-1-LP,W-1-LP);

    // ---- 2. MULTIPURPOSE FIELD (top-left): soccer/football, painted boundary + midline ----
    var fx0=IN0+3, fy0=IN0+3, fx1=fx0+M(38), fy1=fy0+M(21);
    markRect(fx0,fy0,fx1,fy1);
    for(x=fx0;x<=fx1;x++)G.set(x,(fy0+fy1)>>1,4);                    // midline
    G.disc((fx0+fx1)>>1,(fy0+fy1)>>1,M(3),4);                        // center circle (as marking ring)
    G.disc((fx0+fx1)>>1,(fy0+fy1)>>1,M(3)-1,7);

    // ---- 3. BASEBALL DIAMOND (top-right): skinned infield, base paths, backstop, foul lines, outfield fence ----
    var hx=Math.floor(W*0.72), hy=IN0+M(38);                        // home plate
    var rd=M(17);                                                   // infield radius
    for(y=hy-2*rd;y<=hy;y++)for(x=hx-rd;x<=hx+rd;x++){              // rotated-square skinned infield above home
      var man=Math.abs(x-hx)+Math.abs(y-hy);
      if(man<=rd && G.get(x,y)===7) G.set(x,y,12);
    }
    for(y=hy-2*rd+4;y<=hy-3;y++)for(x=hx-rd+4;x<=hx+rd-4;x++){     // grass infield inside the dirt
      var man2=Math.abs(x-hx)+Math.abs(y-hy);
      if(man2<=rd-4 && man2>=4 && G.get(x,y)===12) { /* keep base-path ring dirt */ }
      else if(man2<rd-4 && G.get(x,y)===12) G.set(x,y,7);
    }
    // foul lines from home up-left and up-right + outfield fence arc (kept off the soccer field)
    function offField(px,py){ return !(px>=fx0-1&&px<=fx1+1&&py>=fy0-1&&py<=fy1+1); }
    for(i=0;i<=rd+M(12);i++){ var lx=hx-i, rx=hx+i, ly=hy-i;
      if((G.get(lx,ly)===7||G.get(lx,ly)===12)&&offField(lx,ly))G.set(lx,ly,4);
      if((G.get(rx,ly)===7||G.get(rx,ly)===12)&&offField(rx,ly))G.set(rx,ly,4); }
    var of=rd+M(11);
    for(var ang=0;ang<=90;ang++){ var rad=ang*Math.PI/180; var ox=hx-Math.round(Math.cos(rad)*of), oy=hy-Math.round(Math.sin(rad)*of);
      if(G.get(ox,oy)===7)G.set(ox,oy,16); }
    for(ang=0;ang<=90;ang++){ rad=ang*Math.PI/180; ox=hx+Math.round(Math.cos(rad)*of); oy=hy-Math.round(Math.sin(rad)*of);
      if(G.get(ox,oy)===7)G.set(ox,oy,16); }
    fenceRect(hx-4,hy+1,hx+4,hy+3);                                 // backstop behind home
    G.set(hx,hy,4); G.set(hx,hy-rd,12);                             // home plate + pitcher's mound

    // ---- 3b. PICNIC GROVE (below the field): shade shelter, tables under trees ----
    var vx0=IN0+3, vy0=fy1+M(3), vx1=vx0+M(30), vy1=vy0+M(13);
    G.rect(vx0+M(12),vy0,vx0+M(18),vy0+M(4),2);                     // group picnic shelter (shade structure)
    for(y=vy0+2;y<vy1;y+=4)for(x=vx0+2;x<vx1;x+=6){ G.set(x,y,13); G.set(x+1,y,13); } // picnic tables in a grid
    trees(vx0,vy0,vx1,vy1,16);

    // ---- 4. FENCED DOG RUN (left-mid): large + small dog sections ----
    var dx0=IN0+3, dy0=JN0+M(42), dx1=dx0+M(22), dy1=dy0+M(17);
    fenceRect(dx0,dy0,dx1,dy1);
    var dmid=(dy0+dy1)>>1; for(x=dx0;x<=dx1;x++)G.set(x,dmid,16);   // divider between the two runs
    G.set((dx0+dx1)>>1,dy0,1); G.set((dx0+dx1)>>1,dy1,1);           // path openings into the runs
    bench(dx0+2,dy0+2); bench(dx1-2,dy1-2);

    // ---- 5. COMMUNITY GARDEN (left-bottom): grid of dry raised beds w/ path aisles ----
    var gx0=IN0+3, gy0=JN0+M(63), gx1=gx0+M(22), gy1=JN1-M(3);
    G.rect(gx0,gy0,gx1,gy1,1);                                      // gravel base (path code)
    for(y=gy0+1;y+2<=gy1;y+=4) for(x=gx0+1;x+3<=gx1;x+=6){ G.rect(x,y,x+3,y+1,14); } // beds
    bench((gx0+gx1)>>1,gy0-2);

    // ---- 6. HARD COURTS (right column): three stacked basketball/tennis courts ----
    var qx1=IN1-3, qx0=qx1-M(18);
    var cy=JN0+M(42);
    for(i=0;i<3;i++){ var cy1=cy+M(13); G.rect(qx0,cy,qx1,cy1,6); markRect(qx0+1,cy+1,qx1-1,cy1-1);
      for(x=qx0;x<=qx1;x++)G.set(x,(cy+cy1)>>1,4); G.disc((qx0+qx1)>>1,(cy+cy1)>>1,M(2),4);
      cy=cy1+M(3); }

    // ---- 7. CENTRAL PLAZA + PICNIC PAVILION + RESTROOM (the heart) ----
    var pxc=Math.floor(W*0.50), pyc=Math.floor(H*0.60);
    G.disc(pxc,pyc,M(9),1);                                          // paved plaza
    G.disc(pxc,pyc,M(2),13);                                         // centerpiece (fountain/planter, dead)
    G.rect(pxc-M(7),pyc-M(6),pxc-M(1),pyc-M(1),2);                   // picnic pavilion (shade structure)
    G.rect(pxc+M(2),pyc-M(5),pxc+M(7),pyc,2);                        // restroom building
    for(i=0;i<6;i++)bench(pxc-M(6)+i*2,pyc+M(4));                    // benches ringing plaza

    // ---- 8. PLAYGROUND (near plaza, visible) ----
    var yx0=pxc-M(30), yy0=pyc-M(9), yx1=yx0+M(16), yy1=yy0+M(11);
    G.rect(yx0,yy0,yx1,yy1,8);
    G.rect(yx0+2,yy0+2,yx0+4,yy0+4,13); G.rect(yx1-4,yy1-4,yx1-2,yy1-2,13); // play equipment blocks

    // ---- 9. SKATE PARK (concrete bowls + ramps) ----
    var sx0=pxc-M(16), sy0=pyc+M(11), sx1=sx0+M(20), sy1=sy0+M(12);
    G.rect(sx0,sy0,sx1,sy1,15);
    G.disc(sx0+M(5),sy0+M(6),M(4),1); G.disc(sx1-M(5),sy0+M(6),M(3),1); // bowls (recessed floor)

    // ---- 10. DEAD POND (empty basin, stone rim) ----
    var wx=pxc+M(14), wy=pyc+M(15);
    G.disc(wx,wy,M(9),16); G.disc(wx,wy,M(8),9);                     // rim + empty water

    // ---- 11. PARKING LOT (bottom-center, by the entrance): stalls + parked cars ----
    var lx0=pxc-M(20), lx1=pxc+M(20), ly1=JN1-1, ly0=ly1-M(12);
    G.rect(lx0,ly0,lx1,ly1,1);
    for(var ry=ly0+2; ry+M(5)<=ly1-1; ry+=M(5)+M(4)) for(x=lx0+2;x+2<lx1;x+=3){
      G.vbar(ry,ry+M(5),x,10,1); if(r()<0.6)G.rect(x+1,ry+1,x+1,ry+M(5)-1,11); }

    // ---- 12. PATH NETWORK: plaza -> every zone + loop + parking + gate ----
    pathH(fx1,pxc,pyc-M(9));                                         // plaza <- field/playground row
    pathV(fy1,pyc,(fx0+fx1)>>1);                                     // field down to mid
    pathH(pxc,qx0,pyc);                                              // plaza -> courts
    pathH(dx1,pxc,dmid);                                             // plaza -> dog run
    pathV(gy0,dy1,(gx0+gx1)>>1);                                     // garden -> dog run
    pathV(pyc,ly0,pxc);                                              // plaza -> parking
    pathV(sy1,ly0,(sx0+sx1)>>1);                                     // skate -> parking
    pathH(pxc,wx,pyc+M(12));                                         // plaza -> pond
    pathV(LP,fy0,(fx0+fx1)>>1);                                      // loop -> field

    // ---- 13. SITE FURNITURE + DEAD TREES filling the leftover turf (a real park is planted) ----
    trees(IN0,IN0,IN1,JN1,70);
    for(i=0;i<14;i++){ var bx=LP+2+Math.floor(r()*(W-2*LP-4)), by=LP+1+((i%2)?1:-1); }
    // benches along the loop trail
    for(i=0;i<10;i++){ bench(LP+M(8)+i*M(8), LP+1); bench(LP+M(8)+i*M(8), H-1-LP-1); }

    // ---- 14. GATE + drive spur from the street into the parking lot ----
    var gates=[];
    streets.forEach(function(edge){
      if(edge==='S'||edge==='N'){ var gx=Math.floor(W*0.5), gy=(edge==='S')?H-1:0, dir=(edge==='S')?-1:1;
        for(i=-3;i<=3;i++)G.set(gx+i,gy,5);
        for(var s=1;s<=M(12);s++){ var yy=gy+dir*s; if(!(yy>0&&yy<H-1))break; for(var w=-2;w<=2;w++){ var c=G.get(gx+w,yy); if(isSoft(c)||c===16)G.set(gx+w,yy,1); } if(G.get(gx,yy)===1&&s>M(4))break; }
        gates.push({edge:edge,x:gx,y:gy}); }
      else { var gy2=Math.floor(H*0.5), gx2=(edge==='E')?W-1:0, dir2=(edge==='E')?-1:1;
        for(i=-3;i<=3;i++)G.set(gx2,gy2+i,5);
        for(var s2=1;s2<=M(12);s2++){ var xx=gx2+dir2*s2; if(!(xx>0&&xx<W-1))break; for(var w2=-2;w2<=2;w2++){ var c2=G.get(xx,gy2+w2); if(isSoft(c2)||c2===16)G.set(xx,gy2+w2,1); } if(G.get(xx,gy2)===1&&s2>M(4))break; }
        gates.push({edge:edge,x:gx2,y:gy2}); }
    });

    return {g:g, W:W, H:H, streets:streets, gates:gates, footprints:K.footprints(g,function(v){return v===2;})};
  }

  var PALETTE={1:'#6a6a70',2:'#7a7266',3:'#4a4030',4:'#c9c1aa',5:'#c79a3f',6:'#566058',7:'#5a4f38',
    8:'#8a6a5a',9:'#3a4a52',10:'#c9c1aa',11:'#55555f',12:'#7a5f42',13:'#8f8676',14:'#43372a',15:'#808088',16:'#8a8f94'};
  K.register('park', { generate:generate, body:function(c){return c===2;}, category:'leisure', palette:PALETTE });

  var API={generate:generate,footprints:function(r){return r.footprints;},palette:PALETTE};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaPark=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
