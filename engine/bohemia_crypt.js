// BOHEMIA CRYPT INTERIOR (7/19/26). The second special interior a portal opens into — the
// MAUSOLEUM in the cemetery (its enter says "CRYPT INTERIOR"). A single-floor stone crypt: a
// central aisle threading a grid of burial-vault banks, the walls lined with stacked vault
// niches, an ALTAR/statue at the far terminus, the ENTRANCE at the front (from the exterior
// door). INTERIOR===EXTERIOR: the crypt floor plate is EXACTLY the mausoleum footprint W x H.
// Act-1 DEAD: dim, dust, cracked marble, some vaults broken open and robbed.
// CODES: 0 wall  1 floor/aisle  2 crypt vault (niche)  3 broken/open vault  4 entrance
//        5 altar / memorial statue  6 column  7 sarcophagus (freestanding tomb)
(function(root){
  function rng(seed){ var s=(seed>>>0)||1; return function(){ s=(s*1103515245+12345)>>>0; return s/4294967296; }; }

  function generate(seed, opts){
    opts=opts||{};
    var W=Math.max(3,Math.round(opts.w||24)), H=Math.max(3,Math.round(opts.h||18));   // EXACT footprint, never clamped
    var r=rng(seed), g=[], x, y;
    for(y=0;y<H;y++){ var row=[]; for(x=0;x<W;x++) row.push(1); g.push(row); }        // 1 = floor
    var set=function(x,y,c){ if(x>=0&&y>=0&&x<W&&y<H) g[y][x]=c; };

    // perimeter WALL, its inner face lined with stacked vault niches (some broken open)
    for(x=0;x<W;x++){ set(x,0,0); set(x,H-1,0); } for(y=0;y<H;y++){ set(0,y,0); set(W-1,y,0); }
    for(x=1;x<W-1;x++){ set(x,1, r()<0.2?3:2); set(x,H-2, r()<0.2?3:2); }
    for(y=1;y<H-1;y++){ set(1,y, r()<0.2?3:2); set(W-2,y, r()<0.2?3:2); }

    // LONG CORRIDORS lined with WALLS OF STACKED CRYPTS (community-mausoleum form, not a maze):
    // vertical crypt-wall bands (2 wide, faced with niches) alternate with 2-wide walkable
    // corridors. Front + back cross-corridors join them all (every corridor reachable).
    var cx=W>>1, y2;
    for(var bx=2; bx<W-3; bx+=4){
      if(Math.abs(bx-cx)<=1) continue;                                                // keep the central corridor open
      for(y2=3;y2<H-3;y2++){ set(bx,y2, r()<0.15?3:2); set(bx+1,y2, r()<0.15?3:2); }  // a 2-wide crypt wall
    }
    for(x=1;x<W-1;x++){ set(x,2,1); set(x,H-3,1); }                                    // back + front cross-corridors
    for(y=2;y<H-2;y++){ set(cx,y,1); set(cx-1<1?1:cx-1,y,1); }                         // main central corridor

    // a colonnade of columns down the central corridor; sarcophagi set into it
    for(y=4;y<H-4;y+=5){ if(cx-2>0)set(cx-2,y,6); if(cx+2<W-1)set(cx+2,y,6); }
    for(y=7;y<H-6;y+=7){ set(cx,y,7); }
    // ALTAR / memorial at the far (top) terminus
    set(cx,1,5); if(cx-1>0)set(cx-1,1,5); if(cx+1<W-1)set(cx+1,1,5);
    // ENTRANCE at the front (bottom center) — from the exterior mausoleum door
    set(cx,H-1,4); if(cx-1>0)set(cx-1,H-1,4); if(cx+1<W-1)set(cx+1,H-1,4); set(cx,H-2,1);
    return { kind:'crypt', W:W, H:H, grid:g, entrance:{x:cx,y:H-1}, altar:{x:cx,y:2} };
  }

  var PALETTE={0:'#2a2824',1:'#4a453c',2:'#6b6358',3:'#201e1a',4:'#39d46a',5:'#8a8276',6:'#5a544a',7:'#7a7266'};
  var API={generate:generate, palette:PALETTE};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaCrypt=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
