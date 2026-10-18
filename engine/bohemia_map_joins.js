/* =====================================================================
   BOHEMIA MAP JOINS  (bohemia_map_joins.js)  WORLD lane, 10/18/26
   Row [the map's roads as one kit] (Paolo 10/10: 'BRO ON THE MAP NOT ON
   THE COMBAT'), and the help RUN's [the districts connect on the map] asked
   for (Paolo 10/18: 'the districts look like shit, the streets look like
   shit, doesn't look like shit's connected that smart like it should').

   WHAT WAS MEASURED BEFORE THIS FILE WAS WRITTEN (the game's own seed,
   'bohemia' -> 2691674296, 96 x 96 cells, the generator the CITY frame
   inlines):
     2,515 street cells. 1,804 are straight runs. 563 are JUNCTIONS
     (265 crossings, 228 tees, 70 corners) and 148 are ends.
     The map draws every one of the 2,515 with the same straight picture,
     mirrored for the axis (renderCity -> drawHero(d,p,heroFlip(..))). So
     22 percent of the street cells on screen show a straight road where
     two roads meet. THAT is most of 'doesn't look connected': the grid
     underneath is joined, the picture on top is not.
     Of the 132 ends inside the valley, 43 are a street cut by the railway
     (33) or a wash (10) with the same street picking up again on the far
     side: real Las Vegas crosses the Union Pacific line and bridges its
     washes, so those are crossings the data never named, not ends.

   WHAT THIS FILE GIVES (data, no drawing; RUN draws, rule 77b):
     joinsFor(om) -> {
       cells:  { 'x,y': {x,y,kind,mask,piece,rot,joins:{N,E,S,W}} } for every
               road cell (street, boulevard, freeway, interchange, rail);
               mask is N=1 E=2 S=4 W=8 of the sides that join as road;
               piece is straight | corner | tee | cross | end | lone;
               rot is the quarter turns from the piece's base pose.
       crossings: [{x,y,over,kind:'level'|'bridge'|'over'}]: the cells a
               street passes over (rail, wash) or a deck carries it (freeway).
       stops:  [{x,y,faces}]: an end that meets a landmark, the rim, water
               or the map edge. A road ending at a gate is a real place.
       breaks: [{x,y,faces}]: an end that meets plain ground with no reason.
       counts: the numbers above, for the gate and for a caption. }
     THE RULE, one table (JOIN): which kinds meet edge to edge as one road.
     A street never joins a freeway's side: it goes over or under it (the
     CITY frame's overpassAt already draws the deck), or it meets it at an
     interchange. A street meets the railway as a level crossing and a wash
     as a bridge, and only where the street really carries on.

   Gate: gates/map_joins_gate.js. Pure: same om, same answer, no DOM.
   ===================================================================== */
(function(global){
'use strict';

/* the map's road kinds, from the overmap's district names */
var KIND={arterial:'street',strip:'boulevard',freeway:'freeway',beltway:'freeway',
          interchange:'interchange',rail:'rail'};
/* what a street may run straight through when it picks up again past it */
var PASS={rail:'level',wash:'bridge'};
var PASS_SPAN=4;                       /* the railway and a wash are one to three cells wide */
var FW_SPAN=12;                        /* no freeway band in the valley is near this wide */

/* THE JOIN RULE. Two neighbouring road cells are one road only if their pair
   is here. Anything else touching is two things side by side, never a join. */
var JOIN={
  'street|street':1,'street|boulevard':1,'boulevard|boulevard':1,
  'street|interchange':1,'boulevard|interchange':1,
  'freeway|freeway':1,'freeway|interchange':1,'interchange|interchange':1,
  'rail|rail':1
};
function joinsKinds(a,b){ return !!(JOIN[a+'|'+b]||JOIN[b+'|'+a]); }

/* the places a road may honestly end at: a gate, a lot, a wall of rock or water */
var STOP_AT={mountain:1,water:1,dam:1,basin:1,springs:1,solar:1,airport:1,airbase:1,
  resort:1,casino:1,convention:1,ballpark:1,stadium:1,speedway:1,datafort:1,arsenal:1,
  prison:1,landfill:1,boneyard:1,waterpark:1,minigp:1,quarry:1,intake:1,gypsum:1,
  railyard:1,luxor:1,sphere:1,highroller:1,strat:1,sign:1,town:1,truckstop:1,
  granary:1,pumpstation:1,rail:1,wash:1,freeway:1,beltway:1};

var SIDES=[['N',0,-1,1],['E',1,0,2],['S',0,1,4],['W',-1,0,8]];
var PIECE={0:'lone',1:'end',2:'end',4:'end',8:'end',5:'straight',10:'straight',
  3:'corner',6:'corner',12:'corner',9:'corner',7:'tee',14:'tee',13:'tee',11:'tee',15:'cross'};
/* quarter turns from the base pose: end opens N, straight runs N-S, corner opens N+E,
   tee opens N+E+S (the bar on the west) */
var ROT={1:0,2:1,4:2,8:3,5:0,10:1,3:0,6:1,12:2,9:3,7:0,14:1,13:2,11:3,15:0,0:0};

function kindAt(om,x,y){ var t=om.at(x,y); return t?(KIND[t.district]||null):null; }
function distAt(om,x,y){ var t=om.at(x,y); return t?t.district:'edge'; }

/* a street that stops at rail or a wash: does the same street carry on past it? */
function passFrom(om,x,y,dx,dy){
  var first=distAt(om,x+dx,y+dy), kind=PASS[first];
  if(!kind) return null;
  for(var k=1;k<=PASS_SPAN;k++){
    var d=distAt(om,x+dx*k,y+dy*k);
    var kd=KIND[d];
    if(kd==='street'||kd==='boulevard') return k>1?{kind:kind,len:k-1}:null;
    if(d!==first) return null;          /* rail then a lot: an end, not a crossing */
  }
  return null;
}
/* a street meeting a freeway's side: does it come out the far side of the band? */
function overFrom(om,x,y,dx,dy){
  var k=1; while(k<FW_SPAN && (KIND[distAt(om,x+dx*k,y+dy*k)]==='freeway')) k++;
  if(k===1) return null;
  var kd=KIND[distAt(om,x+dx*k,y+dy*k)];
  return (kd==='street'||kd==='boulevard')?{kind:'over',len:k-1}:null;
}

function joinsFor(om){
  var cells={}, crossings=[], stops=[], breaks=[], seenX={};
  var counts={road:0,street:0,straight:0,corner:0,tee:0,cross:0,end:0,lone:0,
              junction:0,level:0,bridge:0,over:0,stop:0,break:0,sideTouch:0};
  for(var i=0;i<om.tiles.length;i++){
    var t=om.tiles[i], k=KIND[t.district]; if(!k) continue;
    var mask=0, joins={};
    for(var s=0;s<4;s++){
      var S=SIDES[s], nx=t.x+S[1], ny=t.y+S[2], nk=kindAt(om,nx,ny);
      if(nk && joinsKinds(k,nk)){ mask|=S[3]; joins[S[0]]='road'; continue; }
      if(k!=='street'&&k!=='boulevard') continue;
      var p=passFrom(om,t.x,t.y,S[1],S[2]) || (nk==='freeway'?overFrom(om,t.x,t.y,S[1],S[2]):null);
      if(p){
        mask|=S[3]; joins[S[0]]=p.kind;
        for(var j=1;j<=p.len;j++){
          var cx=t.x+S[1]*j, cy=t.y+S[2]*j, ck=cx+','+cy;
          if(seenX[ck]) continue; seenX[ck]=1;
          crossings.push({x:cx,y:cy,over:distAt(om,cx,cy),kind:p.kind,axis:S[1]?'ew':'ns'});
          counts[p.kind]++;
        }
      } else if(nk==='freeway') counts.sideTouch++;
    }
    var piece=PIECE[mask];
    cells[t.x+','+t.y]={x:t.x,y:t.y,kind:k,mask:mask,piece:piece,rot:ROT[mask],joins:joins};
    counts.road++;
    if(k==='street'||k==='boulevard'){
      counts.street++; counts[piece]++;
      if(piece==='corner'||piece==='tee'||piece==='cross') counts.junction++;
      if(piece==='end'||piece==='lone'){
        /* the cell straight ahead of an end: what the road runs into */
        var open=null; for(var s2=0;s2<4;s2++) if(mask&SIDES[s2][3]) open=SIDES[s2];
        var ax=open?t.x-open[1]:t.x, ay=open?t.y-open[2]:t.y-1;
        var faces=distAt(om,ax,ay);
        var atEdge=t.x===0||t.y===0||t.x===om.n-1||t.y===om.n-1;
        /* the generator's own NO-STREET-BREAK LAW (Paolo 7/18) keeps a stub that
           has a landmark at its side: it is that landmark's drive. Same rule here. */
        if(!STOP_AT[faces]) for(var s3=0;s3<4;s3++){
          var sd=distAt(om,t.x+SIDES[s3][1],t.y+SIDES[s3][2]);
          if(sd!=='edge'&&STOP_AT[sd]&&!KIND[sd]){ faces=sd; break; }
        }
        if(atEdge||faces==='edge'||STOP_AT[faces]){ stops.push({x:t.x,y:t.y,faces:atEdge?'edge':faces}); counts.stop++; }
        else { breaks.push({x:t.x,y:t.y,faces:faces}); counts.break++; }
      }
    }
  }
  return {seed:om.seed,n:om.n,cells:cells,crossings:crossings,stops:stops,breaks:breaks,counts:counts};
}

/* the one picture a cell should draw, for a caller that only wants that */
function pieceAt(J,x,y){ var c=J.cells[x+','+y]; return c?{kind:c.kind,piece:c.piece,rot:c.rot,mask:c.mask}:null; }

var API={joinsFor:joinsFor,pieceAt:pieceAt,joinsKinds:joinsKinds,JOIN:JOIN,KIND:KIND,PASS:PASS,
         STOP_AT:STOP_AT,PIECE:PIECE,ROT:ROT};
if(typeof module!=='undefined'&&module.exports){module.exports=API;}
else global.BOH_MAP_JOINS=API;
})(typeof window!=='undefined'?window:this);
