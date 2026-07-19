// BOHEMIA MEDICAL — HOSPITAL CAMPUS (7/18/26). CIVIC category, built on the DISTRICT KIT
// from real hospital site-plan research (Paolo: research first). Real campus anatomy: a big
// hospital building, a SEPARATE emergency/ambulance entrance with its own canopy, a HELIPAD
// out in front of the ambulance bay, a public main-entrance drop-off canopy, a parking
// garage + surface parking, drive loops. Sources: healthfacilityguidelines.com (separate
// ambulance vs public entrances), hdrinc.com (helipad in front of the ambulance canopy).
// codes: 0 ground 1 drive 2 building 4 entrance 5 gate 6 plaza 7 canopy 8 garage 9 helipad 10 stall
(function(root){
  var K = (typeof module!=='undefined') ? require('./bohemia_district_kit.js')
        : (typeof BohemiaDistrictKit!=='undefined'?BohemiaDistrictKit:root.BohemiaDistrictKit);
  var M=K.M;

  function generate(seed,opts){
    opts=opts||{}; var streets=opts.streets||['S'];
    var G=K.grid(seed), g=G.g, W=G.W, H=G.H, i, x, y;
    var MARGIN=3, BANDY=H-1-MARGIN-M(5);

    // PARKING GARAGE down the right side (above the bottom drive band)
    var garW=M(20), gx0=W-1-MARGIN-garW;
    G.rect(gx0,MARGIN+1,W-1-MARGIN,BANDY-1,8);
    for(y=MARGIN+3;y<BANDY-2;y+=M(5)+1) for(x=gx0+1;x<W-MARGIN;x+=3) G.set(x,y,10);

    var rx0=MARGIN+2, rx1=gx0-M(4), erW=M(13);

    // HOSPITAL — the big building across the back; ER WING attached at the front-left
    var hy0=MARGIN+3, hy1=hy0+M(32);
    G.rect(rx0+erW+2,hy0,rx1,hy1,2);                                  // main hospital
    G.rect(rx0,hy1-M(16),rx0+erW,hy1,2);                             // ER wing (front-left)

    // MAIN ENTRANCE canopy + doors (public drop-off), center of the hospital front
    var cxc=Math.floor((rx0+erW+2+rx1)/2);
    G.rect(cxc-M(6),hy1+1,cxc+M(6),hy1+1+M(4),7);
    for(x=cxc-M(4);x<cxc+M(4);x+=2) G.set(x,hy1,4);

    // AMBULANCE canopy at the ER (separate entrance) + a HELIPAD out in front of it
    G.rect(rx0,hy1+1,rx0+erW-2,hy1+1+M(5),7);                        // ambulance canopy
    G.set(Math.floor(rx0+erW/2),hy1,4);                             // ER door

    // APRON drive (starts right under the entrance canopies so drop-offs connect) + bottom band
    G.rect(rx0,hy1+M(5)+1,rx1,H-1-MARGIN,1);
    // HELIPAD out in front of the ambulance canopy (a marked pad sitting in the drive court)
    G.disc(rx0+Math.floor(erW/2),hy1+M(11),M(4),9);
    G.rect(rx0,BANDY,W-1-MARGIN,H-1-MARGIN,1);                       // full-width entrance drive band
    function lot(lx0,lx1,ly0,ly1){ for(var yy=ly0;yy+M(5)<=ly1;yy+=M(5)+M(4)) for(var xx=lx0;xx<lx1;xx+=3) G.vbar(yy,yy+M(5),xx,10,1); }
    lot(cxc+M(9),rx1, hy1+M(15), BANDY-M(2));                        // public surface lot (right of the entrance)
    G.rect(rx1-M(14),hy1+M(9),rx1-2,hy1+M(9)+M(11),2);              // medical office building (MOB)

    // GATES: a public main gate + an emergency gate on the streets this cell touches
    var gates=[];
    function drive(fromx,fromy,dir,horiz){ for(var s=0;s<=(horiz?W:H);s++){ var xx=horiz?fromx+dir*s:fromx, yy=horiz?fromy:fromy+dir*s;
      if(!(xx>0&&yy>0&&xx<W-1&&yy<H-1))break; if([1].indexOf(G.get(xx,yy))>=0)break; if([2,8].indexOf(G.get(xx,yy))>=0)break;
      for(var w=-2;w<=2;w++){ var ax=horiz?xx:xx+w, ay=horiz?yy+w:yy; if([0,10].indexOf(G.get(ax,ay))>=0)G.set(ax,ay,1); } } }
    streets.forEach(function(edge){
      if(edge==='S'||edge==='N'){ var gy=(edge==='S')?H-1:0,dir=(edge==='S')?-1:1;
        [Math.floor(W*0.4),Math.floor(W*0.72)].forEach(function(gx){ for(i=-3;i<=3;i++)G.set(gx+i,gy,5); drive(gx,gy+dir,dir,false); gates.push({edge:edge,x:gx,y:gy}); }); }
      else { var gx2=(edge==='E')?W-1:0,dir2=(edge==='E')?-1:1, gy2=BANDY+2;
        for(i=-3;i<=3;i++)G.set(gx2,gy2+i,5); drive(gx2+dir2,gy2,dir2,true); gates.push({edge:edge,x:gx2,y:gy2}); }
    });

    return {g:g, W:W, H:H, streets:streets, gates:gates, footprints:K.footprints(g,function(v){return v===2;})};
  }
  function driveConnected(res){ return K.connectedFrom(res.g,function(c){return c===5;},function(c){return c===1||c===5||c===7;})>0.8; }

  K.register('medical', { generate:generate, body:function(c){return c===2;}, category:'civic',
    palette:{1:'#33333c',2:'#8a8478',4:'#c7a24a',5:'#c79a3f',6:'#6a6a70',7:'#9a9088',8:'#55555e',9:'#b04038',10:'#c9c1aa'} });

  var API={generate:generate,driveConnected:driveConnected,footprints:function(r){return r.footprints;}};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaMedical=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
