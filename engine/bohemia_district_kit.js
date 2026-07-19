// BOHEMIA DISTRICT KIT (7/18/26) — the factory. The shared machine every district
// generator extends, so a NEW district is a short config + its unique bits, not a
// from-scratch build. Extracted from suburb + commercial (which share the same bones:
// street-aware gates, dead-world ground, footprints, connectivity, a gate, a palette).
// Paolo 7/18: "get this factory going... we need to speed this up."
//
// A district generator built on the kit exposes: generate(seed,{streets}) -> a result
// {g, W, H, streets, gates, footprints}. It registers a spec {generate, palette, body}
// so the world model + renderers treat every district uniformly.
(function(root){
  var SZ=128, TILE=0.75;
  function M(m){return Math.round(m/TILE);}
  function rng(seed){var s=(seed>>>0)||1;return function(){s=(s*1103515245+12345)>>>0;return s/4294967296;};}
  function blank(w,h){var g=[];for(var y=0;y<h;y++){var r=[];for(var x=0;x<w;x++)r.push(0);g.push(r);}return g;}
  function inb(g,x,y){return x>=0&&y>=0&&x<g[0].length&&y<g.length;}

  // a drawing surface with chainable primitives (the shared vocabulary)
  function grid(seed,w,h){ w=w||SZ; h=h||SZ; var g=blank(w,h);
    var api={ g:g, W:w, H:h, seed:(seed>>>0)||1, rnd:rng(seed),
      set:function(x,y,c){ if(inb(g,x,y))g[y][x]=c; return api; },
      get:function(x,y){ return inb(g,x,y)?g[y][x]:-1; },
      rect:function(x0,y0,x1,y1,c){ for(var y=y0;y<=y1;y++)for(var x=x0;x<=x1;x++)if(inb(g,x,y))g[y][x]=c; return api; },
      hbar:function(x0,x1,y,c,t){ t=t||1; for(var x=x0;x<=x1;x++)for(var d=0;d<t;d++)if(inb(g,x,y+d))g[y+d][x]=c; return api; },
      vbar:function(y0,y1,x,c,t){ t=t||1; for(var y=y0;y<=y1;y++)for(var d=0;d<t;d++)if(inb(g,x+d,y))g[y][x+d]=c; return api; },
      frame:function(c){ var x,y; for(x=0;x<w;x++){g[0][x]=c;g[h-1][x]=c;} for(y=0;y<h;y++){g[y][0]=c;g[y][w-1]=c;} return api; },
      disc:function(cx,cy,r,c){ for(var dy=-r;dy<=r;dy++)for(var dx=-r;dx<=r;dx++)if(dx*dx+dy*dy<=r*r&&inb(g,cx+dx,cy+dy))g[cy+dy][cx+dx]=c; return api; }
    };
    return api;
  }

  // STREET-AWARE: which of a cell's four edges face a street (road-district neighbor).
  // neigh = {N,S,E,W: districtNameOrNull}. Always at least one edge (default S).
  var ROADSET={freeway:1,arterial:1,strip:1,beltway:1};
  function streetEdges(neigh){ var out=[],E=['N','S','E','W'],i;
    for(i=0;i<4;i++){ var d=neigh&&neigh[E[i]]; if(d&&ROADSET[d])out.push(E[i]); }
    return out.length?out:['S']; }

  // connected-component bounding boxes of cells where isBody(code) is true
  function footprints(g,isBody){ var W=g[0].length,H=g.length,seen={},out=[],d4=[[1,0],[-1,0],[0,1],[0,-1]];
    for(var y=0;y<H;y++)for(var x=0;x<W;x++){ if(!isBody(g[y][x])||seen[x+','+y])continue;
      var st=[[x,y]];seen[x+','+y]=1;var x0=x,y0=y,x1=x,y1=y;
      while(st.length){var p=st.pop();if(p[0]<x0)x0=p[0];if(p[1]<y0)y0=p[1];if(p[0]>x1)x1=p[0];if(p[1]>y1)y1=p[1];
        for(var i=0;i<4;i++){var nx=p[0]+d4[i][0],ny=p[1]+d4[i][1],k=nx+','+ny; if(!seen[k]&&nx>=0&&ny>=0&&nx<W&&ny<H&&isBody(g[ny][nx])){seen[k]=1;st.push([nx,ny]);}}}
      out.push({x:x0,y:y0,w:x1-x0+1,h:y1-y0+1}); }
    return out; }

  // fraction of the drive network reachable from a start cell (gate) — connectivity check
  function connectedFrom(g,isStart,isDrive){ var W=g[0].length,H=g.length,start=null,total=0,y,x;
    for(y=0;y<H;y++)for(x=0;x<W;x++){ if(isDrive(g[y][x])){total++; if(!start&&isStart(g[y][x]))start=[x,y];} }
    if(!start)return 0; var seen={},st=[start];seen[start[0]+','+start[1]]=1;var reach=0;
    while(st.length){var p=st.pop();reach++;for(var i=0,d=[[1,0],[-1,0],[0,1],[0,-1]];i<4;i++){var nx=p[0]+d[i][0],ny=p[1]+d[i][1],k=nx+','+ny; if(seen[k]||nx<0||ny<0||nx>=W||ny>=H)continue; if(isDrive(g[ny][nx])){seen[k]=1;st.push([nx,ny]);}}}
    return total?reach/total:0; }

  // DEAD-WORLD ground: 3 dead-dirt shades so every district's code-0 reads as dead earth,
  // never as void (the lesson from the suburb). Renderers call this for code 0.
  function ground(x,y,sun){ var h=((x*73856093)^(y*19349663))>>>0,v=h%3;
    return sun?['#c6bb9c','#bdb191','#cdc3a6'][v]:['#463f30','#3d382a','#4e4838'][v]; }

  // REGISTRY: district type -> {generate, palette, body}. The world model + proof
  // renderers read this, so adding a district = register it (the acceleration).
  var REG={};
  function register(type,spec){ REG[type]=spec; return spec; }
  function get(type){ return REG[type]||null; }
  function types(){ return Object.keys(REG); }

  // 3-ACT scaffold. A generator emits the ACT-1 (dead) base. Act 2/3 restyle rules are
  // CONTENTS-PAOLO'S (never invent them); the kit only guarantees the hook and that act 1
  // is exactly what was built. rules(res, act) -> res'.
  function act(res,a,rules){ if(!a||a===1||typeof rules!=='function')return res; return rules(res,a)||res; }

  // TAXONOMY (Paolo 7/18: "you have to categorize things nicely"). Every district type
  // files into ONE top-level category. Grounded in real land-use zoning (residential /
  // commercial / industrial / institutional / recreational / transportation) + the two
  // Vegas needs: GAMING_RESORT (the tourism economy) and TERRAIN (the raw land).
  // Paolo DECIDES final buckets; this is the mechanism + a sensible default, machine-gated
  // so nothing is ever left uncategorized.
  var CATEGORIES=['residential','commercial','industrial','gaming_resort','civic','leisure','infrastructure','terrain'];
  var TAXONOMY={
    // RESIDENTIAL — where people live
    suburb:'residential', gated:'residential', estate:'residential', town:'residential', trailer:'residential',
    // COMMERCIAL — retail, trade, business
    commercial:'commercial', mall:'commercial', downtown:'commercial', swapmeet:'commercial', truckstop:'commercial',
    // INDUSTRIAL — production, logistics, salvage, storage of goods
    industrial:'industrial', warehouse:'industrial', storage:'industrial', railyard:'industrial',
    robofactory:'industrial', granary:'industrial', boneyard:'industrial', arsenal:'industrial', fueldepot:'industrial',
    // GAMING & RESORT — the Vegas tourism/gaming economy + Strip icons
    strip:'gaming_resort', resort:'gaming_resort', casino:'gaming_resort', highroller:'gaming_resort',
    sphere:'gaming_resort', luxor:'gaming_resort', strat:'gaming_resort', sign:'gaming_resort', springs:'gaming_resort',
    // CIVIC — government, safety, health, education, worship, death, assembly
    medical:'civic', school:'civic', campus:'civic', library:'civic', courthouse:'civic', firestation:'civic',
    policestation:'civic', jail:'civic', prison:'civic', chapel:'civic', cemetery:'civic', convention:'civic', fort:'civic',
    // LEISURE — parks, sports venues, recreation
    park:'leisure', golf:'leisure', stadium:'leisure', ballpark:'leisure', speedway:'leisure',
    minigp:'leisure', waterpark:'leisure', drivein:'leisure',
    // INFRASTRUCTURE — transport, power, water, comms, extraction, agriculture (the systems)
    freeway:'infrastructure', arterial:'infrastructure', beltway:'infrastructure', interchange:'infrastructure',
    rail:'infrastructure', terminal:'infrastructure', airport:'infrastructure', airbase:'infrastructure',
    dam:'infrastructure', solar:'infrastructure', substation:'infrastructure', watertreat:'infrastructure',
    reservoir:'infrastructure', pumpstation:'infrastructure', intake:'infrastructure', basin:'infrastructure',
    battery:'infrastructure', datafort:'infrastructure', radio:'infrastructure', reclaim:'infrastructure',
    landfill:'infrastructure', gypsum:'infrastructure', quarry:'infrastructure', farm:'infrastructure',
    // TERRAIN — the raw land itself (not built)
    mountain:'terrain', desert:'terrain', wash:'terrain', water:'terrain'
  };
  function category(type){ return TAXONOMY[type]||null; }
  function inCategory(cat){ var out=[]; for(var t in TAXONOMY) if(TAXONOMY[t]===cat) out.push(t); return out; }

  // EXPLAIN-EVERY-TILE (Paolo 7/18): every non-ground tile must map to a named thing in the
  // district's legend (palette), and there must be little unexplained void.
  function legendOk(g,palette){ for(var y=0;y<g.length;y++)for(var x=0;x<g[0].length;x++){ var c=g[y][x]; if(c!==0 && !(c in palette)) return false; } return true; }
  function voidFraction(g){ var W=g[0].length,H=g.length,z=0; for(var y=0;y<H;y++)for(var x=0;x<W;x++)if(g[y][x]===0)z++; return z/(W*H); }
  // largest contiguous blob of a single code that isn't a real structure — catches "big blank slabs"
  function largestBlob(g,isBlank){ var W=g[0].length,H=g.length,seen={},best=0,d4=[[1,0],[-1,0],[0,1],[0,-1]];
    for(var y=0;y<H;y++)for(var x=0;x<W;x++){ if(!isBlank(g[y][x])||seen[x+','+y])continue; var st=[[x,y]];seen[x+','+y]=1;var n=0,code=g[y][x];
      while(st.length){var p=st.pop();n++;for(var i=0;i<4;i++){var nx=p[0]+d4[i][0],ny=p[1]+d4[i][1],k=nx+','+ny; if(!seen[k]&&nx>=0&&ny>=0&&nx<W&&ny<H&&g[ny][nx]===code){seen[k]=1;st.push([nx,ny]);}}}
      if(n>best)best=n; }
    return best/(W*H); }

  var API={SZ:SZ,TILE:TILE,M:M,rng:rng,blank:blank,grid:grid,ROADSET:ROADSET,
    streetEdges:streetEdges,footprints:footprints,connectedFrom:connectedFrom,ground:ground,
    register:register,get:get,types:types,act:act,
    CATEGORIES:CATEGORIES,TAXONOMY:TAXONOMY,category:category,inCategory:inCategory,
    legendOk:legendOk,voidFraction:voidFraction,largestBlob:largestBlob};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaDistrictKit=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
