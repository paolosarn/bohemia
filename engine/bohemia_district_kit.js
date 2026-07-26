// BOHEMIA DISTRICT KIT (7/18/26) — the factory. The shared machine every district
// generator extends, so a NEW district is a short config + its unique bits, not a
// from-scratch build. Extracted from suburb + commercial (which share the same bones:
// street-aware gates, dead-world ground, footprints, connectivity, a gate, a palette).
// Paolo 7/18: "get this factory going... we need to speed this up."
//
// A district generator built on the kit exposes: generate(seed,{streets}) -> a result
// {g, W, H, streets, gates, footprints}. It registers a spec {generate, palette, body}
// so the world model + renderers treat every district uniformly.
// HOW TO BUILD A DISTRICT (the method + this kit's usage): laws/BOHEMIA_HOW_TO_BUILD_A_DISTRICT.md.
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
    suburb:'residential', gated:'residential', estate:'residential', town:'residential', trailer:'residential', apartment:'residential',
    // COMMERCIAL — retail, trade, business
    commercial:'commercial', mall:'commercial', downtown:'commercial', swapmeet:'commercial', truckstop:'commercial',
    // INDUSTRIAL — production, logistics, salvage, storage of goods
    industrial:'industrial', warehouse:'industrial', storage:'industrial', railyard:'industrial',
    robofactory:'industrial', granary:'industrial', boneyard:'industrial', arsenal:'industrial', fueldepot:'industrial',
    // GAMING & RESORT — the Vegas tourism/gaming economy + Strip icons
    strip:'gaming_resort', resort:'gaming_resort', casino:'gaming_resort', highroller:'gaming_resort',
    sphere:'gaming_resort', luxor:'gaming_resort', strat:'gaming_resort', sign:'gaming_resort', springs:'gaming_resort',
    // CIVIC — government, safety, health, education, worship, death, assembly
    medical:'civic', school:'civic', campus:'civic', library:'civic', courthouse:'civic', firestation:'civic', cityhall:'civic',
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

  // STREET-AWARE PLACEMENT + DRIVABLE ACCESS (Paolo 7/19/26, STANDING LAW: "whether it has
  // one street connection or two because it's a corner is gonna be super important... for
  // everything moving forward"). Real districts have ONE car entrance on the street they front,
  // and a corner adds a second frontage. The reusable pattern: a generator builds its layout
  // in a CANONICAL frame with the car entrance at the SOUTH edge, then rotateToStreet() spins
  // it so that entrance lands on whichever street the cell actually touches, and adds a
  // PEDESTRIAN gate on each additional (corner) street. So a district is authored ONCE and is
  // automatically correct for a standalone grid (1 street, any edge) AND a corner (2 streets).
  var STREET_ORDER=['S','E','W','N'];                 // which frontage becomes the car entrance
  function primaryStreet(streets,order){ order=order||STREET_ORDER; streets=streets&&streets.length?streets:['S'];
    for(var i=0;i<order.length;i++) if(streets.indexOf(order[i])>=0) return order[i]; return 'S'; }
  // rotate a square grid 90° clockwise: out[x][n-1-y] = g[y][x]
  function rotateCW(g){ var n=g.length,out=[],y,x; for(y=0;y<n;y++)out.push(new Array(n));
    for(y=0;y<n;y++)for(x=0;x<n;x++)out[x][n-1-y]=g[y][x]; return out; }
  // scan the four borders; each contiguous run of gateCode becomes one gate {edge,x,y}
  function scanGates(g,gateCode){ gateCode=gateCode||5; var n=g.length,out=[],run=null,i,cells=[],x,y;
    for(x=0;x<n;x++)cells.push([x,0,'N']); for(y=0;y<n;y++)cells.push([n-1,y,'E']);
    for(x=n-1;x>=0;x--)cells.push([x,n-1,'S']); for(y=n-1;y>=0;y--)cells.push([0,y,'W']);
    for(i=0;i<cells.length;i++){ var c=cells[i],is=(g[c[1]][c[0]]===gateCode);
      if(is){ if(!run)run={edge:c[2],xs:[c[0]],ys:[c[1]]}; else{run.xs.push(c[0]);run.ys.push(c[1]);} }
      else if(run){ out.push({edge:run.edge,x:Math.round(run.xs.reduce(function(a,b){return a+b;},0)/run.xs.length),y:Math.round(run.ys.reduce(function(a,b){return a+b;},0)/run.ys.length)}); run=null; } }
    if(run)out.push({edge:run.edge,x:run.xs[0],y:run.ys[0]}); return out; }
  // draw a pedestrian gate + short walk-in on an edge (for corner side streets). over(code)->
  // which cells the walk may overwrite; walkCode is what it lays; inset = how far it reaches.
  function pedGate(g,edge,gateCode,walkCode,over,inset){ gateCode=gateCode||5; walkCode=(walkCode==null)?1:walkCode; inset=inset||18;
    var n=g.length,i,s; over=over||function(c){return c===0;};
    if(edge==='N'||edge==='S'){ var gx=Math.round(n*0.5),gy=(edge==='S')?n-1:0,dir=(edge==='S')?-1:1;
      for(i=-3;i<=3;i++)g[gy][gx+i]=gateCode;
      for(s=1;s<=inset;s++){var yy=gy+dir*s; if(yy<=0||yy>=n-1)break; if(over(g[yy][gx]))g[yy][gx]=walkCode; else break;} }
    else { var gy2=Math.round(n*0.5),gx2=(edge==='E')?n-1:0,dir2=(edge==='E')?-1:1;
      for(i=-3;i<=3;i++)g[gy2+i][gx2]=gateCode;
      for(s=1;s<=inset;s++){var xx=gx2+dir2*s; if(xx<=0||xx>=n-1)break; if(over(g[gy2][xx]))g[gy2][xx]=walkCode; else break;} } }
  // spin a canonical (car-entrance-at-SOUTH) grid so the entrance faces the real street, then
  // add pedestrian gates on any side streets. Returns {g, primary, gates}.
  function rotateToStreet(canonicalGrid,streets,opts){ opts=opts||{}; var gateCode=opts.gate||5;
    var primary=primaryStreet(streets,opts.order); var kmap={S:0,W:1,N:2,E:3}, k=kmap[primary], g=canonicalGrid,t;
    for(t=0;t<k;t++) g=rotateCW(g);
    (streets&&streets.length?streets:['S']).forEach(function(e){ if(e!==primary) pedGate(g,e,gateCode,opts.pedWalk==null?1:opts.pedWalk,opts.pedOver,opts.pedInset); });
    return { g:g, primary:primary, gates:scanGates(g,gateCode) }; }

  // DRIVABLE gate helpers (the machine half of the law): a car must reach every stall.
  function driveNetworkOk(g,driveCode){ return connectedFrom(g,function(c){return c===driveCode;},function(c){return c===driveCode;})>=0.999; }
  function driveTouchesEdge(g,driveCode){ var n=g.length,x,y;
    for(x=0;x<n;x++){ if(g[1][x]===driveCode)return 'N'; if(g[n-2][x]===driveCode)return 'S'; }
    for(y=0;y<n;y++){ if(g[y][1]===driveCode)return 'W'; if(g[y][n-2]===driveCode)return 'E'; } return null; }
  function stallsReachable(g,stallCode,driveCode){ var n=g.length,x,y;
    for(y=0;y<n;y++)for(x=0;x<n;x++){ if(g[y][x]!==stallCode)continue;
      if(!((g[y+1]&&g[y+1][x]===driveCode)||(g[y-1]&&g[y-1][x]===driveCode)||g[y][x+1]===driveCode||g[y][x-1]===driveCode))return false; } return true; }
  // fraction of the drive network reachable BY CAR from the street: flood driveCode from every
  // driveCode tile that touches the border (the curb cuts). The realistic "a car gets in from
  // the curb and can move around" check for complex sites where the drive isn't one tidy blob
  // (hospital planters, warehouse yards). High for any placement = street-aware + drivable.
  function driveReachFromStreet(g,driveCode){ var n=g.length,starts=[],total=0,x,y,i;
    for(x=0;x<n;x++){ if(g[1][x]===driveCode)starts.push([x,1]); if(g[n-2][x]===driveCode)starts.push([x,n-2]); }
    for(y=0;y<n;y++){ if(g[y][1]===driveCode)starts.push([1,y]); if(g[y][n-2]===driveCode)starts.push([n-2,y]); }
    for(y=0;y<n;y++)for(x=0;x<n;x++)if(g[y][x]===driveCode)total++;
    if(!starts.length||!total)return 0; var seen={},st=starts.slice(),reach=0;
    starts.forEach(function(s){seen[s[0]+','+s[1]]=1;});
    while(st.length){var p=st.pop();reach++;var d=[[1,0],[-1,0],[0,1],[0,-1]];for(i=0;i<4;i++){var nx=p[0]+d[i][0],ny=p[1]+d[i][1],k=nx+','+ny;if(seen[k]||nx<0||ny<0||nx>=n||ny>=n)continue;if(g[ny][nx]===driveCode){seen[k]=1;st.push([nx,ny]);}}}
    return reach/total; }

  // LAYERING (Paolo 7/19: "you have to understand the layering you're making and what it looks
  // like when the player goes INSIDE — a building, a parking garage, the tunnel — record what
  // tiles, what positions"). Every tile resolves to a render/occupancy LAYER so the ¾-view
  // renderer + the interior/zoom system know how to treat it:
  //   ground   - flat floor plane; walk/drive ON it (roads, invert, paths, turf, markings)
  //   structure- vertical mass with a FRONT FACE in the ¾ view; SOLID at grade; may be enterable
  //   overhead - drawn ABOVE the ground; the player passes UNDER it (canopy, upper parking deck)
  //   prop     - an object sitting on the ground (cart, pump, tree, furniture); solid per its size
  //   portal   - a TRANSITION into an interior (door, garage ramp, tunnel mouth, gate)
  // solid = does the tile block a body's cell (occupancy) at grade. enter = the interior it opens.
  // A tile inherits its layer from its `kind` unless it sets an explicit layer/solid/enter.
  var KIND_LAYER={
    ground:{layer:'ground',solid:false}, drive:{layer:'ground',solid:false}, walk:{layer:'ground',solid:false},
    marking:{layer:'ground',solid:false}, 'turf-dead':{layer:'ground',solid:false}, 'water-dead':{layer:'ground',solid:false},
    court:{layer:'ground',solid:false}, play:{layer:'ground',solid:false},
    building:{layer:'structure',solid:true}, structure:{layer:'structure',solid:true}, fence:{layer:'structure',solid:true},
    panel:{layer:'structure',solid:true}, 'tree-dead':{layer:'prop',solid:true}, prop:{layer:'prop',solid:true},
    vehicle:{layer:'prop',solid:true}, gate:{layer:'portal',solid:false}, overhead:{layer:'overhead',solid:false}, portal:{layer:'portal',solid:false}
  };
  function tileLayer(entry){ var d=KIND_LAYER[entry&&entry.kind]||{layer:'ground',solid:false};
    return { layer: (entry&&entry.layer)||d.layer, solid: (entry&&entry.solid!=null)?entry.solid:d.solid, enter: (entry&&entry.enter)||null }; }

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

  // WALKABLE-LAND LAW (Paolo 7/20/26): a full plot of walkable land can't be mostly parking/driveway
  // with a tiny building. landStats splits the plot into DRIVE (pavement), CONTENT (buildings + used
  // features), and FILLER (drive + desert + bare undifferentiated ground). The gate asserts drive
  // does not dominate content. FILLER_NAME = the bare-ground legend names that DON'T count as content.
  var FILLER_NAME=/lawn|desert|dead-ground|\bapron\b|\bpad\b|sidewalk|plaza|aisle|forecourt|gravel|packed-dirt|drive|parking|\brough\b|\bbare\b|margin|setback/i;
  function landStats(g,legend){ legend=legend||{}; var W=g[0].length,H=g.length,A=W*H,drive=0,content=0,filler=0;
    var driveCodes={}; for(var c in legend){ if(legend[c]&&legend[c].kind==='drive')driveCodes[c]=1; }
    for(var y=0;y<H;y++)for(var x=0;x<W;x++){ var v=g[y][x], e=legend[v]||{};
      if(driveCodes[v]){ drive++; filler++; }
      else if(v===0 || FILLER_NAME.test(e.name||'')){ filler++; }
      else content++; }
    return { drivePct:100*drive/A, contentPct:100*content/A, fillerPct:100*filler/A }; }

  var API={SZ:SZ,TILE:TILE,M:M,rng:rng,blank:blank,grid:grid,ROADSET:ROADSET,landStats:landStats,
    streetEdges:streetEdges,footprints:footprints,connectedFrom:connectedFrom,ground:ground,
    register:register,get:get,types:types,act:act,
    CATEGORIES:CATEGORIES,TAXONOMY:TAXONOMY,category:category,inCategory:inCategory,
    legendOk:legendOk,voidFraction:voidFraction,largestBlob:largestBlob,
    STREET_ORDER:STREET_ORDER,primaryStreet:primaryStreet,rotateCW:rotateCW,scanGates:scanGates,
    pedGate:pedGate,rotateToStreet:rotateToStreet,
    driveNetworkOk:driveNetworkOk,driveTouchesEdge:driveTouchesEdge,stallsReachable:stallsReachable,
    driveReachFromStreet:driveReachFromStreet,KIND_LAYER:KIND_LAYER,tileLayer:tileLayer};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaDistrictKit=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
