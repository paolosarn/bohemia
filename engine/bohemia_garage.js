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

  // one deck grid, EXACTLY W x H (the exterior footprint — never clamped: the interior must
  // match the exterior width x length every time). level 0 = ground (has the entrance).
  // Proportioned to real garage design (Schaefer / THA): a ~24ft (≈9-tile) 90-degree drive
  // AISLE flanked by ~18ft-deep (≈7-tile) stall banks — a double-loaded bay.
  function deck(seed, W, H, level, levels){
    var r=rng(seed ^ (0x9E3779B1*(level+1))), g=[], x, y;
    for(y=0;y<H;y++){ var row=[]; for(x=0;x<W;x++) row.push(0); g.push(row); }   // 0 = wall/column shell
    var set=function(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H) g[y][x]=c; };
    // central DRIVE AISLE — ~24ft real; width scales with the footprint (≈9 tiles typical)
    var aisleW=Math.max(3, Math.min(11, Math.round(Math.min(W,H)*0.30)));
    var ax0=Math.max(1, (W-aisleW)>>1), ax1=Math.min(W-2, ax0+aisleW-1);
    for(y=1;y<H-1;y++)for(x=ax0;x<=ax1;x++) set(x,y,1);
    // 90-degree STALL banks both sides, cars nosed to the aisle, full ~18ft depth; stall pitch
    // ~3 tiles (8.5ft car width) with a marked stripe gap between.
    for(y=1;y+1<H-1;y+=3){
      var carL=r()<0.6, carR=r()<0.6;
      for(x=1;x<=ax0-1;x++){ set(x,y, carL?3:2); set(x,y+1, carL?3:2); }          // left bank stall (2 rows)
      for(x=ax1+1;x<=W-2;x++){ set(x,y, carR?3:2); set(x,y+1, carR?3:2); }        // right bank stall
    }
    // structural COLUMNS on the ~45ft bay grid (blocks standing in the stalls)
    for(y=3;y<H-3;y+=6)for(x=2;x<=W-3;x+=8){ if(x<ax0-1||x>ax1+1) set(x,y,0); }
    // STAIR / ELEVATOR core in a corner, opening onto the aisle end
    if(ax0>=4){ for(y=1;y<=Math.min(4,H-2);y++)for(x=ax0-3;x<ax0;x++) set(x,y,5); set(ax0-1,2,1); }
    // RAMP up to the next deck (except the top) — bottom of the aisle, aligned across levels
    if(level<levels-1 && H>=6){ for(y=H-4;y<=H-2;y++)for(x=ax0;x<=ax1;x++) set(x,y,4); }
    // ground-deck ENTRANCE from the exterior ramp (bottom of the aisle)
    if(level===0){ for(x=ax0;x<=ax1;x++) set(x,H-1,6); set((ax0+ax1)>>1,H-2,1); }
    return g;
  }

  function generate(seed, opts){
    opts=opts||{};
    // EXACT footprint dimensions — the interior is ALWAYS the same width x length as the
    // exterior (Paolo 7/19, LOCKED). No clamping. levels (vertical decks) is separate.
    var W=Math.max(3,Math.round(opts.w||28)), H=Math.max(3,Math.round(opts.h||20));
    var levels=Math.max(2,Math.min(6,opts.decks||3));
    var decks=[]; for(var L=0;L<levels;L++) decks.push(deck(seed,W,H,L,levels));
    return { kind:'garage', W:W, H:H, levels:levels, decks:decks,
      ramp:{x:(W>>1), fromY:H-3}, entrance:{x:(W>>1), y:H-1} };
  }

  var PALETTE={0:'#2a2a30',1:'#4a4a52',2:'#c9c1aa',3:'#55555f',4:'#6a5a3a',5:'#6a6a74',6:'#39d46a'};
  var API={generate:generate, palette:PALETTE};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaGarage=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
