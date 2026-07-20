// BOHEMIA GARAGE INTERIOR (7/19/26). The first SPECIAL interior a portal opens into (Paolo:
// "understand what it looks like when the player goes inside... a parking garage"). A multi-DECK
// parking structure — NOT rooms (the generic BSP floorplan can't model this): each level is a
// central drive aisle with 90-degree parking stalls both sides, structural columns, a stair/
// elevator core, and a RAMP that connects to the deck above (aligned across levels so a car
// drives up). The ground deck has the ENTRANCE where the exterior ramp comes in — so the solid
// garage shell you saw from the overworld becomes the deck you stand on. Act-1 DEAD: abandoned
// dust-caked cars, dark, dead.
// DECK CODES: 0 wall/column  1 drive aisle  2 empty stall  3 parked car  4 ramp(to next deck)
//             5 stair/elevator core  6 entrance (ground deck only, from the exterior ramp)
(function(root){
  function rng(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1103515245+12345)>>>0; return s/4294967296; }; }

  // one deck grid, level 0 = ground (has the entrance), top level = roof deck
  function deck(seed, W, H, level, levels){
    var r=rng(seed ^ (0x9E3779B1*(level+1))), g=[], x, y;
    for(y=0;y<H;y++){ var row=[]; for(x=0;x<W;x++) row.push(0); g.push(row); }   // 0 = wall shell
    var cx=W>>1, aisle0=cx-1, aisle1=cx+1;                                        // central drive aisle (3 wide)
    for(y=1;y<H-1;y++)for(x=aisle0;x<=aisle1;x++) g[y][x]=1;
    // 90-degree stalls both banks: each row (every 2 tiles) is a run of stall/car nosed to the aisle
    for(y=1;y<H-1;y+=2){
      var carL=r()<0.6, carR=r()<0.6;
      for(x=2;x<=aisle0-1;x++) g[y][x]= carL?3:2;                                 // left bank
      for(x=aisle1+1;x<=W-3;x++) g[y][x]= carR?3:2;                               // right bank
    }
    // structural COLUMNS at a grid (blocks in the stalls)
    for(y=2;y<H-2;y+=4)for(x=3;x<=W-4;x+=6){ if(x<aisle0-1||x>aisle1+1) g[y][x]=0; }
    // STAIR / ELEVATOR core, top-left, opening onto the aisle end
    for(y=1;y<=3;y++)for(x=aisle0-3;x<aisle0;x++) g[y][x]=5;
    g[2][aisle0-1]=1;                                                             // core doorway to the aisle
    // RAMP to the deck above (except the top deck) — bottom of the aisle, aligned across levels
    if(level<levels-1){ for(y=H-4;y<=H-2;y++)for(x=aisle0;x<=aisle1;x++) g[y][x]=4; }
    // ground-deck ENTRANCE from the exterior ramp (bottom of the aisle)
    if(level===0){ for(x=aisle0;x<=aisle1;x++) g[H-1][x]=6; g[H-2][cx]=1; }
    return g;
  }

  function generate(seed, opts){
    opts=opts||{}; var W=Math.max(18,Math.min(40,opts.w||28)), H=Math.max(14,Math.min(40,opts.h||20));
    var levels=Math.max(2,Math.min(5,opts.decks||3));
    var decks=[]; for(var L=0;L<levels;L++) decks.push(deck(seed,W,H,L,levels));
    return { kind:'garage', W:W, H:H, levels:levels, decks:decks,
      ramp:{x:(W>>1), fromY:H-3}, entrance:{x:(W>>1), y:H-1} };
  }

  var PALETTE={0:'#2a2a30',1:'#4a4a52',2:'#c9c1aa',3:'#55555f',4:'#6a5a3a',5:'#6a6a74',6:'#39d46a'};
  var API={generate:generate, palette:PALETTE};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaGarage=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
