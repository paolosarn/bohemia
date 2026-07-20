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

    // a GRID of freestanding vault banks, leaving 2-wide aisles between (walk among the crypts)
    var cx=W>>1;
    for(y=4;y<H-4;y+=4)for(x=3;x<W-3;x+=5){
      if(Math.abs(x-cx)<=1) continue;                                                 // keep the central aisle clear
      for(var by=0;by<3&&y+by<H-3;by++)for(var bx=0;bx<3&&x+bx<W-3;bx++) set(x+bx,y+by, r()<0.15?3:2);
    }
    // central AISLE clear (floor) + a colonnade of columns flanking it
    for(y=2;y<H-2;y++){ set(cx,y,1); set(cx-1,y,1); set(cx+1,y,1); }
    for(y=4;y<H-4;y+=4){ set(cx-2,y,6); set(cx+2,y,6); }

    // ALTAR / memorial statue at the far (top) terminus; a couple of sarcophagi in the aisle
    set(cx,2,5); set(cx-1,2,5); set(cx+1,2,5);
    for(y=6;y<H-6;y+=6){ set(cx, y, 7); }

    // ENTRANCE at the front (bottom center) — from the exterior mausoleum door
    set(cx,H-1,4); set(cx-1,H-1,4); set(cx+1,H-1,4); set(cx,H-2,1);
    return { kind:'crypt', W:W, H:H, grid:g, entrance:{x:cx,y:H-1}, altar:{x:cx,y:2} };
  }

  var PALETTE={0:'#2a2824',1:'#4a453c',2:'#6b6358',3:'#201e1a',4:'#39d46a',5:'#8a8276',6:'#5a544a',7:'#7a7266'};
  var API={generate:generate, palette:PALETTE};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaCrypt=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
