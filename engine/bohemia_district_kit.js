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

  /* ================= A DISTRICT BIGGER THAN ONE CELL ================= (8/26)
     THE SAME MECHANISM, WRITTEN THREE TIMES BY HAND BEFORE IT EARNED A HOME. The solar farm
     (8/24), the wash (8/25) and the railyard (8/26) each grew their own copy of it, and the
     next four districts on the list want it too -- four stadiums in a 2x2, nine golf courses
     in a 3x3, four landfills, four cemeteries. Copying it a fourth time is how a mechanism
     rots into four slightly different mechanisms.

     WHAT IT IS. A district generator is handed ONE cell and draws 128x128 tiles. When the
     same district covers a BLOB of cells, every cell builds a complete copy of the whole
     thing -- its own stadium bowl, its own clubhouse, its own fence. The fix is always the
     same shape: lay the district out ONCE in VALLEY tiles against the blob's bounds, and let
     each cell keep only the window that falls inside it. The seams then line up by
     construction rather than by anybody being careful.

     WHAT THIS GIVES YOU. `f` is the whole district in valley tiles, `c` is this cell's
     window. vset/vrect/vell/vline all take VALLEY coordinates and clip to the window, so a
     generator can draw a bowl 300 tiles across and never think about which cell it is in.

     AND A SEED THAT BELONGS TO THE BLOB, NOT THE CELL. Every cell carries its own seed, so
     anything decided with the cell's rng exists in one cell and not in its neighbour -- a
     boxcar cut in half at the boundary, a tree that grows out of one side of a seam. `rnd(a,b)`
     is a hash of a VALLEY position and the blob's own corner: same answer from every cell.
     Use it for anything the neighbour also has to agree about, and the cell's own `rnd` only
     for dressing that nobody can line up anyway.

     ONE CELL IS NOT A BLOB. `many` is false when the bounds are a single cell, and every
     district that uses this keeps its original single-cell build for that case -- the art
     already shipped, and there is no neighbour to line up with. */
  function blob(seed, opts){
    opts = opts || {};
    var g = grid(seed >>> 0), W = g.W, H = g.H;
    var cellX = opts.cellX || 0, cellY = opts.cellY || 0;
    var b = opts.bounds || { x0: cellX, x1: cellX, y0: cellY, y1: cellY };
    var cx = cellX * W, cy = cellY * H, cx1 = cx + W - 1, cy1 = cy + H - 1;
    var f = { x0: b.x0 * W, y0: b.y0 * H, x1: (b.x1 + 1) * W - 1, y1: (b.y1 + 1) * H - 1 };
    f.w = f.x1 - f.x0 + 1; f.h = f.y1 - f.y0 + 1;
    f.mx = (f.x0 + f.x1) >> 1; f.my = (f.y0 + f.y1) >> 1;
    var bseed = ((b.x0 * 73856093) ^ (b.y0 * 19349663) ^ ((seed >>> 0) & 0xffff)) >>> 0;
    var A = {
      g: g.g, W: W, H: H, cells: g, bounds: b, f: f,
      c: { x0: cx, y0: cy, x1: cx1, y1: cy1 },
      many: (b.x1 > b.x0 || b.y1 > b.y0),
      /* is this cell on the named side of the whole district? A gate, a fence run or an
         entrance belongs on the DISTRICT's edge -- an interior cell punching one puts a gate
         in the middle of a stadium car park. */
      onEdge: function (e) {
        return e === 'N' ? cy === f.y0 : e === 'S' ? cy1 === f.y1
             : e === 'W' ? cx === f.x0 : e === 'E' ? cx1 === f.x1 : false;
      },
      rnd: function (a, c2) {
        var n = (bseed ^ Math.imul(a | 0, 2654435761) ^ Math.imul(c2 | 0, 40503)) >>> 0;
        n = Math.imul(n ^ (n >>> 16), 2246822507); n = Math.imul(n ^ (n >>> 13), 3266489909);
        return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
      },
      /* the first value of a `from + k*step` series at or past `atLeast` -- so a loop that
         begins outside this cell still lands on exactly the rows the neighbour's does */
      firstAt: function (from, step, atLeast) {
        return (atLeast <= from) ? from : (from + Math.ceil((atLeast - from) / step) * step);
      },
      vget: function (vx, vy) { var lx = vx - cx, ly = vy - cy;
        return (lx >= 0 && ly >= 0 && lx < W && ly < H) ? g.g[ly][lx] : -1; },
      vset: function (vx, vy, code) { var lx = vx - cx, ly = vy - cy;
        if (lx >= 0 && ly >= 0 && lx < W && ly < H) g.g[ly][lx] = code; return A; },
      vrect: function (x0, y0, x1, y1, code) {
        if (x1 < cx || x0 > cx1 || y1 < cy || y0 > cy1) return A;   // clip before walking
        var xa = Math.max(x0, cx), xb = Math.min(x1, cx1);
        var ya = Math.max(y0, cy), yb = Math.min(y1, cy1), xx, yy;
        for (yy = ya; yy <= yb; yy++) for (xx = xa; xx <= xb; xx++) g.g[yy - cy][xx - cx] = code;
        return A;
      },
      /* a filled ellipse in valley tiles -- the shape a stadium bowl, a pond and a landfill
         cap are all made of, and the reason this is here rather than in three generators */
      vell: function (ex, ey, rx, ry, code, onto) {
        if (rx <= 0 || ry <= 0) return A;
        var ya = Math.max(ey - ry, cy), yb = Math.min(ey + ry, cy1);
        var xa = Math.max(ex - rx, cx), xb = Math.min(ex + rx, cx1), xx, yy;
        for (yy = ya; yy <= yb; yy++) for (xx = xa; xx <= xb; xx++) {
          var dx = (xx - ex) / rx, dy = (yy - ey) / ry;
          if (dx * dx + dy * dy > 1) continue;
          if (onto !== undefined && g.g[yy - cy][xx - cx] !== onto) continue;
          g.g[yy - cy][xx - cx] = code;
        }
        return A;
      },
      /* the OUTLINE of an ellipse, walked by angle -- aisle rings, running tracks, a fence
         following a pond. `onto` restricts it so a ring only marks what it is allowed to. */
      vring: function (ex, ey, rx, ry, code, onto, step) {
        step = step || 1;
        for (var a = 0; a < 360; a += step) {
          var rad = a * Math.PI / 180;
          var px = Math.round(ex + Math.cos(rad) * rx), py = Math.round(ey + Math.sin(rad) * ry);
          if (onto !== undefined && A.vget(px, py) !== onto) continue;
          A.vset(px, py, code);
        }
        return A;
      },
      vline: function (x0, y0, x1, y1, code, onto) {
        var n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) || 1;
        for (var i = 0; i <= n; i++) {
          var px = Math.round(x0 + (x1 - x0) * i / n), py = Math.round(y0 + (y1 - y0) * i / n);
          if (onto !== undefined && A.vget(px, py) !== onto) continue;
          A.vset(px, py, code);
        }
        return A;
      },
      /* THE DISTRICT'S OWN PERIMETER, never the cell's. This is the line that used to be
         drawn with G.frame() and became a fence through the middle of one facility. */
      vframe: function (code, inset) {
        inset = inset || 0;
        var x0 = f.x0 + inset, x1 = f.x1 - inset, y0 = f.y0 + inset, y1 = f.y1 - inset;
        A.vrect(x0, y0, x1, y0, code); A.vrect(x0, y1, x1, y1, code);
        A.vrect(x0, y0, x0, y1, code); A.vrect(x1, y0, x1, y1, code);
        return A;
      },
      /* SCATTERED DRESSING, KEPT OFF THE SEAM. Confetti does not line up with the
         neighbour's, and one tumbleweed on the boundary row makes one cell's ballast meet the
         next cell's desert -- that broke seven of the wash's forty-four seams before it was
         inset. So dressing stays one tile inside this cell, always. */
      dress: function (code, count, onto) {
        for (var k = 0; k < count; k++) {
          var px = cx + 1 + Math.floor(g.rnd() * (W - 2)), py = cy + 1 + Math.floor(g.rnd() * (H - 2));
          if (onto === undefined || A.vget(px, py) === onto) A.vset(px, py, code);
        }
        return A;
      },
      /* A GATE ON A STREET THIS CELL ACTUALLY FRONTS, and only on the district's own edge.
         `paveOver` is the set of codes an apron may eat on its way in. */
      gates: function (streets, gateCode, driveCode, paveOver, reach) {
        var out = [], gg = g.g, i, s, w;
        reach = reach || 14;
        (streets || []).forEach(function (e) {
          if (!A.onEdge(e)) return;
          if (e === 'S' || e === 'N') {
            var gx = W >> 1, gy = (e === 'S') ? H - 1 : 0, dir = (e === 'S') ? -1 : 1;
            for (i = -2; i <= 2; i++) if (gx + i >= 0 && gx + i < W) gg[gy][gx + i] = gateCode;
            for (s = 1; s <= reach; s++) { var yy = gy + dir * s; if (yy <= 0 || yy >= H - 1) break;
              for (w = -2; w <= 2; w++) { var cc = gg[yy][gx + w];
                if (paveOver.indexOf(cc) >= 0) gg[yy][gx + w] = driveCode; } }
            out.push({ edge: e, x: gx, y: gy });
          } else {
            var gy2 = H >> 1, gx2 = (e === 'E') ? W - 1 : 0, dir2 = (e === 'E') ? -1 : 1;
            for (i = -2; i <= 2; i++) if (gy2 + i >= 0 && gy2 + i < H) gg[gy2 + i][gx2] = gateCode;
            for (s = 1; s <= reach; s++) { var xx = gx2 + dir2 * s; if (xx <= 0 || xx >= W - 1) break;
              for (w = -2; w <= 2; w++) { var c3 = gg[gy2 + w][xx];
                if (paveOver.indexOf(c3) >= 0) gg[gy2 + w][xx] = driveCode; } }
            out.push({ edge: e, x: gx2, y: gy2 });
          }
        });
        return out;
      }
    };
    return A;
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

  /* THE DRIVE NETWORK IS ONE NETWORK (Paolo 7/31/26).
     "how dare you continue to like make streets in in a district that like don't connect
     with each other like that's like the rule number one bro like what's wrong with you?"
     He was right, and it was worse than the two districts he was looking at: measured
     across the valley, 23 of them had drive surface a car could see and never reach.

     THE BUG BEHIND THE BUG was this function's absence. Every district asked
     driveReachFromStreet(g, ONE_CODE) -- so a mall asked whether its ring road connected
     and never asked about the parking fields the ring exists to serve, because those are a
     different code. Each district was checking one limb and calling the body healthy.

     So: take EVERY code the legend calls a drive surface, plus every MARKING, because a
     stall stripe is paint on asphalt and a car drives straight over it -- treating paint as
     a wall was inventing pockets that are not there -- and ask one question about the lot:
     starting from the plot edges, can a car reach all of it? */
  function driveMask(legend){
    var S = {}, any = false;
    for (var c in legend) {
      if (!legend[c]) continue;
      var k = legend[c].kind, layer = tileLayer(legend[c]).layer;
      if (k === 'drive') { S[c] = 1; any = true; }
      /* PAINT IS NOT A WALL, AND IT IS NOT A ROAD EITHER (amended 8/24). The original rule
         is untouched and still right: a stall stripe is a marking painted on asphalt, a car
         drives straight over it, and treating it as an obstacle invents pockets that are not
         there -- that is what stranded ten tiles of the commercial lot behind its own parking
         stripes. So paint still CONDUCTS a path; see driveConductors.
         WHAT WAS WRONG WAS COUNTING IT AS SURFACE THAT MUST BE REACHED. The moment nine
         districts started stencilling a magazine number on a headwall and hazard paint on
         gravel (8/24), every one of those stencils became an unreachable "road" in the middle
         of a yard and nine districts read 99.8% instead of 100%. A car was never denied
         anything; the METRIC was counting paint as pavement. The distinction the kit already
         draws for overheads -- conducts, is not counted -- is exactly the one paint needs, and
         nothing is lost by it: a genuinely stranded parking stall sits ON drive-kind asphalt,
         and the asphalt is still in the denominator. */
      /* overheads are handled separately -- see driveConductors below. They are not drive
         surface and must not be counted as such: an awning over a sidewalk is not road. */
    }
    return any ? S : null;
  }
  /* AN OVERHEAD IS NOT ROAD, BUT IT IS NOT A WALL EITHER. A skybridge, a fuel canopy, a
     shop awning is drawn ABOVE the ground plane and you pass BENEATH it. In a single-layer
     grid it overwrites whatever it spans, so treating it as solid severs the very thing it
     crosses -- downtown's skybridge cut its own north street arm off from the grid, 260
     tiles marooned by a bridge a car is meant to drive under. So overheads CONDUCT a path
     without being counted as drive surface themselves. Counting them as road was the first
     fix and it was wrong in the other direction: it made awnings over sidewalks into
     unreachable roads and took the broken-district count from 22 to 25. */
  function driveConductors(legend){
    var C = {};
    for (var c in legend) {
      if (!legend[c]) continue;
      if (tileLayer(legend[c]).layer === 'overhead') C[c] = 1;
      /* AND PAINT (8/24). A car drives over a stall stripe, a lane line, a stencilled bay
         number -- so the path goes through it and a road split by its own markings is still
         one road, which is the whole point of the 7/31 ruling. It just is not itself road. */
      else if (legend[c].kind === 'marking') C[c] = 1;
      /* AND THE GATE (8/25). A GATE IS THE HOLE YOU DRIVE THROUGH. It was counted as a wall,
         so any district whose road meets the street THROUGH its gate tile read as sealed off.
         The dam was reported 0.0% reachable -- 239 tiles of access road a car could supposedly
         never touch -- and it is 100% the moment the gate conducts. Nothing was wrong with the
         dam. Measured across every registered district before changing this: exactly TWO move,
         so it is not a loosening, it is the one case a gate exists for. STREET-AWARE ACCESS
         LAW says one car entrance on the primary street; this is that entrance. */
      else if (legend[c].kind === 'gate') C[c] = 1;
    }
    return C;
  }
  function driveNetworkReach(g, legend){
    legend = legend || {};
    var S = driveMask(legend);
    if (!S) return 1;
    var C = driveConductors(legend);
    var n = g.length, x, y, i, total = 0, st = [], seen = {};
    for (y = 0; y < n; y++) for (x = 0; x < n; x++) if (S[g[y][x]]) total++;
    if (!total) return 1;
    function pass(v){ return S[v] || C[v]; }
    function seed(px, py){ if (pass(g[py][px]) && !seen[px + ',' + py]) { seen[px + ',' + py] = 1; st.push([px, py]); } }
    for (x = 0; x < n; x++) { seed(x, 1); seed(x, n - 2); }
    for (y = 0; y < n; y++) { seed(1, y); seed(n - 2, y); }
    if (!st.length) return 0;
    var reach = 0, d4 = [[1,0],[-1,0],[0,1],[0,-1]];
    while (st.length) {
      var p = st.pop();
      if (S[g[p[1]][p[0]]]) reach++;          /* only real drive surface counts as reached */
      for (i = 0; i < 4; i++) {
        var nx = p[0] + d4[i][0], ny = p[1] + d4[i][1], k = nx + ',' + ny;
        if (seen[k] || nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
        if (pass(g[ny][nx])) { seen[k] = 1; st.push([nx, ny]); }
      }
    }
    return reach / total;
  }

  /* A LANE HAS TO BE WIDE ENOUGH TO BE A LANE. Paolo circled two vertical lines running
     down the mall and asked what they were supposed to be; they were drive lanes ONE TILE
     WIDE. At 0.75 m a tile that is a 30-inch road -- no car fits, and it reads as a mystery
     stripe rather than a street, which is exactly how he read it. This returns the share of
     drive tiles sitting in a 3x3 block of drive, so a district made of hairlines scores
     near zero however connected it is. */
  function driveWidthScore(g, legend){
    legend = legend || {};
    var S = driveMask(legend);
    if (!S) return 1;
    /* A LANE LINE DOES NOT MAKE A LANE NARROWER (8/24). Paint moved out of the drive mask
       and into the conductors the same day, and this function reads the mask -- so a stripe
       painted down the middle of a road suddenly punched a hole in that road's 3x3
       neighbourhood and the road started scoring as a hairline. It is the same tile a car
       drives over; for the WIDTH question it is unambiguously part of the lane. So the
       neighbourhood test unions paint back in. The DENOMINATOR stays real drive tiles only,
       which is the half that had to change: paint is measured as part of a lane, never as a
       lane of its own. */
    var P = {}, c;
    for (c in S) P[c] = 1;
    for (c in legend) if (legend[c] && legend[c].kind === 'marking') P[c] = 1;
    var n = g.length, tot = 0, core = 0, x, y, dx, dy;
    for (y = 1; y < n - 1; y++) for (x = 1; x < n - 1; x++) {
      if (!S[g[y][x]]) continue;
      tot++;
      var all = true;
      for (dy = -1; dy <= 1 && all; dy++) for (dx = -1; dx <= 1; dx++)
        if (!P[g[y + dy][x + dx]]) { all = false; break; }
      if (all) core++;
    }
    return tot ? core / tot : 1;
  }

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
  /* A HOLE IS NOT A WALL AND IT IS NOT A FLOOR (8/20, WORLD lane).
     Until today every tile in the valley was one of two things: something you stand on, or
     something you bump into. That is two states, and the three most genuinely lethal pieces
     of ground in this world need a THIRD.

     `quarry:7 bench lip / crest`, `intake:13 intake shaft / main` and `reclaim:6 crusted
     pond centre` are a quarry edge, a shaft down to the tunnel, and a crust that will not
     hold you. All three were `kind:'structure'`, which defaults SOLID, so the game modelled
     the deepest hole in the valley as a wall you bounce off. MEASURED before this: zero
     tiles in sixty-six legends declared structure-and-not-solid, so nothing anywhere was
     using this encoding and nothing downstream could be relying on it.

     THE THIRD STATE IS A VOID, and it is defined by what it does to a BODY:
       solid    NO  -- it does not stop you. A hole cannot block anything.
       walkable NO  -- pathing refuses it. You do not stroll into a shaft by accident,
                       and nothing that walks will ever choose to.
     Which is exactly the shape of the FORCED ENTRY rule the hazard classes already carry
     (his own "knocked or charging in"): CONSENT is the test, not depth. Walking in is not
     something the game lets you do; being put in is, and that is the one that kills.

     DECLARED, NEVER DERIVED. It would have been cheaper to say "structure that does not
     block IS a hole" -- zero tiles collide, it would work today. It is also a trap: the
     first author who writes a knee-high wall as structure+solid:false silently digs a pit
     under it, and nothing would ever say so. A hole is a thing somebody MEANT, so it is
     written down: `void:true` in the legend entry. */
  function tileLayer(entry){ var d=KIND_LAYER[entry&&entry.kind]||{layer:'ground',solid:false};
    var isVoid = !!(entry && entry['void']);
    return { layer: (entry&&entry.layer)||d.layer,
             /* a void never blocks, whatever its kind would have defaulted to */
             solid: isVoid ? false : ((entry&&entry.solid!=null)?entry.solid:d.solid),
             'void': isVoid,
             enter: (entry&&entry.enter)||null }; }

  // ROOFS AND DOORS (Paolo 7/30-31). He circled three objects on the school plot and asked
  // WHAT THEY WERE. All three were flat colour rectangles, which is the Pocket City bar
  // failing out loud: "everything looks unique enough to know what it is at a glance."
  // He approved the fixed school at 89% and said move on, and APPROVE UNLOCKS VOLUME, so
  // the fix is a SHARED MACHINE rather than 40 hand-drawn roofs.
  //
  // WHAT MAKES A BUILDING READ FROM ABOVE, and it is not its fill colour:
  //   THE EAVE   the bright line where the roof edge meets the wall, all the way round.
  //              This is the outline, and it is the whole reason two neighbouring masses
  //              stop being one blob. Works on ANY shape because it is computed from the
  //              blob's own boundary, not from a rectangle.
  //   THE RIDGE  a line down the long axis that STOPS SHORT of both ends, the way a real
  //              hip does. A line that spans edge to edge is not a roof, it is a STRIPE --
  //              the barcode mistake that made the parking lot "dogshit" (7/29) and the
  //              tennis courts unreadable (7/30). Outline first, detail second.
  //   THE DOOR   a way in, punched on the side that actually faces somewhere you can walk.
  //
  // Roof and door tiles are BODY tiles: they must be inside the caller's body predicate so
  // they never punch a hole in a footprint or split one building into two.
  function roofsAndDoors(g, opt){
    opt = opt || {};
    var W=g[0].length, H=g.length, x, y, i;
    var isB = opt.building || function(){ return false; };
    var ROOF = opt.roof, DOOR = opt.door;
    var MIN = opt.min != null ? opt.min : 100;          // below this it is a shed, not a mass
    var outside = opt.outside || function(c){ return !isB(c); };
    var seen = {}, d4=[[1,0],[-1,0],[0,1],[0,-1]], made={roofs:0,doors:0,masses:0,ribbons:0};
    for(y=0;y<H;y++) for(x=0;x<W;x++){
      if(!isB(g[y][x]) || seen[x+','+y]) continue;
      var st=[[x,y]], cells=[]; seen[x+','+y]=1;
      while(st.length){ var p=st.pop(); cells.push(p);
        for(i=0;i<4;i++){ var nx=p[0]+d4[i][0], ny=p[1]+d4[i][1], k=nx+','+ny;
          if(!seen[k] && nx>=0 && ny>=0 && nx<W && ny<H && isB(g[ny][nx])){ seen[k]=1; st.push([nx,ny]); } } }
      if(cells.length < MIN) continue;                   // sheds and kiosks keep their fill
      made.masses++;
      var inB={}; cells.forEach(function(p){ inB[p[0]+','+p[1]]=1; });
      var x0=1e9,y0=1e9,x1=-1,y1=-1, edge=[];
      cells.forEach(function(p){
        if(p[0]<x0)x0=p[0]; if(p[0]>x1)x1=p[0]; if(p[1]<y0)y0=p[1]; if(p[1]>y1)y1=p[1];
        for(var j=0;j<4;j++){ var nx=p[0]+d4[j][0], ny=p[1]+d4[j][1];
          if(nx<0||ny<0||nx>=W||ny>=H||!inB[nx+','+ny]){ edge.push(p); return; } }
      });

      /* THE DOOR FIRST, chosen before the eave overwrites the boundary. It goes where the
         building actually meets somewhere you can stand, and canonical-south is the front,
         so a south-facing edge wins -- that is the face the street is on before rotation. */
      var cand=[];
      edge.forEach(function(p){
        for(var j=0;j<4;j++){ var nx=p[0]+d4[j][0], ny=p[1]+d4[j][1];
          if(nx<0||ny<0||nx>=W||ny>=H) continue;
          if(!inB[nx+','+ny] && outside(g[ny][nx])){ cand.push([p[0],p[1],ny>p[1]?2:(ny<p[1]?1:0)]); return; } }
      });
      if(cand.length){
        cand.sort(function(a,b){ return (b[2]-a[2]) || (b[1]-a[1]) || (a[0]-b[0]); });
        var best=cand[0], run=[best];
        for(i=0;i<cand.length && run.length<3;i++)
          if(cand[i][1]===best[1] && Math.abs(cand[i][0]-best[0])<=2 && cand[i]!==best) run.push(cand[i]);
        run.forEach(function(p){ g[p[1]][p[0]]=DOOR; made.doors++; });
      }

      /* THE EAVE: every boundary cell that is still building.
         NOT ON A RIBBON. A stadium bowl, a storage unit row and a trailer skirt are one or
         two tiles thick -- their boundary IS the whole mass, so an eave would eat the
         building and leave an outline of nothing. A ribbon already reads as an outline;
         it needs a door and nothing else. Measured on the real set: without this guard the
         stadium loses 91% of its body and self-storage 80%. */
      if(edge.length <= cells.length*0.55)
        edge.forEach(function(p){ if(isB(g[p[1]][p[0]])){ g[p[1]][p[0]]=ROOF; made.roofs++; } });
      else { made.ribbons++; continue; }

      /* THE RIDGE: down the long axis, inset 3 from each end so it never reads as a stripe. */
      var w=x1-x0, h=y1-y0;
      if(Math.max(w,h) >= 9){
        if(w>=h){ var my=Math.round((y0+y1)/2);
          for(x=x0+3;x<=x1-3;x++) if(isB(g[my][x])){ g[my][x]=ROOF; made.roofs++; } }
        else { var mx=Math.round((x0+x1)/2);
          for(y=y0+3;y<=y1-3;y++) if(isB(g[y][mx])){ g[y][mx]=ROOF; made.roofs++; } }
      }
    }
    return made;
  }

  /* THE EAVE PASS (Paolo 7/30-31). He circled three buildings on a district plot and asked
     WHAT THEY WERE, and the answer was that they were flat colour rectangles. He approved
     the fixed school at 89% and said move on -- APPROVE UNLOCKS VOLUME -- so the fix has to
     reach all 42 districts that have buildings, not one.

     IT IS A RENDER RULE, NOT DATA, AND THAT IS THE WHOLE POINT. Baking an outline into the
     tile grid would convert 9-60% of every building's tiles to a new code, which shrinks
     every FOOTPRINT, and INTERIOR-MATCHES-EXTERIOR (Paolo 7/19, LOCKED) says an interior is
     always exactly its footprint -- so every building in the valley would quietly get a
     smaller interior, and 42 district gates would go red over an encoding change that
     changes nothing about the world. An eave is where the roof edge catches the light. That
     is a LIGHTING concern, and SHADING SEPARATION already says light lives on its own layer
     and is never baked into the asset.

     So: this returns the boundary of every building/structure mass, and the painters draw
     it brighter. One answer, every surface, no district module touched, no footprint moved.

     buildingEdges(g, legend) -> {key:'x,y' -> true} for every mass tile that touches
     something that is not part of the mass (including the plot edge). */
  function buildingEdges(g, legend){
    legend = legend || {};
    var W=g[0].length, H=g.length, x, y, i, out={};
    var solidKind={building:1, structure:1, fence:1, panel:1};
    var mass={}; for(var c in legend){ if(legend[c] && solidKind[legend[c].kind]) mass[c]=1; }
    var d4=[[1,0],[-1,0],[0,1],[0,-1]];
    for(y=0;y<H;y++) for(x=0;x<W;x++){
      if(!mass[g[y][x]]) continue;
      for(i=0;i<4;i++){ var nx=x+d4[i][0], ny=y+d4[i][1];
        if(nx<0||ny<0||nx>=W||ny>=H || !mass[g[ny][nx]]){ out[x+','+y]=1; break; } }
    }
    return out;
  }

  // lift a hex swatch toward the light by f (the eave catches the sky). Pure colour maths,
  // no palette is edited -- the district's own colour still decides what the roof IS.
  function lighten(hex, f){
    if(typeof hex!=='string' || hex.charAt(0)!=='#' || hex.length<7) return hex;
    var v=[1,3,5].map(function(i){ return parseInt(hex.substr(i,2),16); });
    return '#'+v.map(function(n){ n=Math.round(n+(255-n)*f); return (n<16?'0':'')+n.toString(16); }).join('');
  }

  /* D1: NO BUILDING EVER SITS ON A SIDEWALK. ANYWHERE IN THE WORLD.
     Paolo 7/31, LOCKED, his caps: "houses or buildings should NEVER SIT ON THE SIDEWALK
     EVER ANYWHERE IN THE WORLD." laws/BOHEMIA_THE_BUILT_WORLD_LAW_7_31_26.md clause D1.

     It was true in ONE district out of forty, and the reason was this function's ADDRESS:
     layWalks() lived PRIVATE inside bohemia_suburb.js, unexported, so no other generator
     could lay a walk even if it wanted to. Promoted verbatim here - proved byte-identical
     to the suburb's own on 32 blocks / 786,432 cells, so nothing in the suburb moves.

     WHICH DRIVE TILES DEMAND A WALK IS DECLARED, NEVER GUESSED. A legend drive entry that
     says `street:true` is a public right-of-way and wears a walk. Anything else - a
     driveway apron, a lot aisle, a truck court, a haul road - does not, and D1 itself says
     the apron is allowed to cross the walk. That declaration is not decoration: without it
     the only rule you could write fails the SUBURB, the one district that is correct,
     because a suburb GARAGE touches its own APRON 1,928 times per 24 blocks.
     DEFAULT IS FALSE. A district that declares nothing is unchanged and ungated. */
  function streetCodes(legend){ var S={},any=false; for(var c in legend){ var e=legend[c];
    if(e && e.kind==='drive' && e.street===true){ S[c]=1; any=true; } } return any?S:null; }
  /* ONE GRID OF WALK hugging every declared street. Only `over` cells convert, so a
     driveway apron keeps its cells and the walk breaks where a car crosses it - which is
     what a real street does. */
  function layWalks(g,opt){ opt=opt||{};
    var road=opt.road||{1:1}, walk=(opt.walk==null)?10:opt.walk;
    var over=opt.over||function(c){ return c===0; };
    var W=g[0].length,H=g.length,add=[],x,y;
    for(y=1;y<H-1;y++)for(x=1;x<W-1;x++){
      if(!over(g[y][x])) continue;
      if(road[g[y][x+1]]||road[g[y][x-1]]||road[g[y+1][x]]||road[g[y-1][x]]) add.push([x,y]);
    }
    for(var i=0;i<add.length;i++) g[add[i][1]][add[i][0]]=walk;
    return add.length; }
  /* THE ORDER IS THE ENFORCEMENT, not an audit afterwards. The walk goes down first and
     this refuses the WHOLE footprint if any cell of it lands on one - the generalised form
     of the suburb's home() check (bohemia_suburb.js:90-96). You cannot build on the walk
     because the walk is there first. */
  function canPlaceMass(g,cells,opt){ opt=opt||{};
    var free=opt.free||function(c){ return c===0; };
    var W=g[0].length,H=g.length,i;
    for(i=0;i<cells.length;i++){ var x=cells[i][0],y=cells[i][1];
      if(x<0||y<0||x>=W||y>=H) return false;
      if(!free(g[y][x])) return false; }
    return true; }
  /* D1-EXEMPT (Paolo 7/31, LOCKED, verbatim: "OK, freeways and railyards do not get
     sidewalks"). A surface whose whole purpose is vehicles or rail wears no pedestrian
     walk. THIS LIST IS HIS, NOT MINE TO EXTEND - a session that wants another district on
     it ASKS HIM, it does not reason by analogy. */
  var D1_EXEMPT={freeway:1,interchange:1,rail:1,railyard:1,speedway:1,airport:1,airbase:1,
                 drivein:1,truckstop:1,garage:1};

  // EXPLAIN-EVERY-TILE (Paolo 7/18): every non-ground tile must map to a named thing in the
  // district's legend (palette), and there must be little unexplained void.
  /* legendOk EXEMPTED CODE 0 BY NAME and hid an uncoloured tile in SIXTEEN districts --
     70% of every mountain plot, 45% of every suburb. 0 meant "void" once; every module
     gives it a real legend entry now ("bedrock face", "open water", "dead-ground"), so
     the exemption was checking that a tile nobody had coloured was allowed to stay
     uncoloured. A GATE THAT EXEMPTS THE MOST-USED CODE IS NOT CHECKING ANYTHING. */
  function legendOk(g,palette){ for(var y=0;y<g.length;y++)for(var x=0;x<g[0].length;x++){ var c=g[y][x]; if(!(c in palette)) return false; } return true; }
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

  /* STENCIL: the small human mark somebody left on a piece of infrastructure.
     (8/23, WORLD lane.)

     NINE DISTRICTS AUTHORED ONE AND NOT ONE OF THEM WAS EVER PLACED. arsenal, basin, gypsum,
     quarry, radio, reclaim, reservoir, substation and watertreat each carry `11 = marking`
     with its own specific line -- "the magazine number stencilled on the headwall", "the
     elevation marks on the outlet box, the record of every flood that filled this basin",
     "call letters stencilled on a hut door". A whole authoring pass of the small human detail
     that makes infrastructure feel USED, written into nine legends and then never written
     into a single generator. gates/dead_code_gate.js found it; this is the machine that fixes
     the class rather than nine bespoke patches (FACTORY LAW).

     It is deliberately SPARSE. A stencil is one number on one headwall, not a texture: a mark
     on every magazine reads as wallpaper and says nobody chose where to put it. Deterministic
     from the seed, so a plot always wears the same marks.

     `on` is the host code the mark sits on; `near`, when given, requires the host cell to
     touch that code, which is how a mark lands on the FACE of a structure (the side you can
     read from the yard) rather than buried in its middle. */
  function stencil(g,opts){
    opts=opts||{}; var W=g[0].length,H=g.length;
    var on=opts.on, mark=opts.mark, want=opts.count||3, near=opts.near;
    var r=rng((opts.seed||1)*2654435761>>>0), spots=[], x, y, i;
    for(y=1;y<H-1;y++)for(x=1;x<W-1;x++){
      if(g[y][x]!==on) continue;
      if(near!=null){
        var touch=false;
        for(i=0;i<4;i++){ var nx=x+[1,-1,0,0][i], ny=y+[0,0,1,-1][i];
          if(nx<0||ny<0||nx>=W||ny>=H) continue;
          if(g[ny][nx]===near) touch=true; }
        if(!touch) continue;
      }
      spots.push([x,y]);
    }
    if(!spots.length) return 0;
    /* spread them: take from evenly-spaced positions in the candidate list rather than the
       first N, or every mark lands in the same corner of the plot */
    var n=0, step=Math.max(1,Math.floor(spots.length/want));
    for(i=0;i<spots.length && n<want;i+=step){
      var p=spots[(i+((r()*step)|0))%spots.length];
      if(g[p[1]][p[0]]!==on) continue;
      g[p[1]][p[0]]=mark; n++;
    }
    return n;
  }

  var API={SZ:SZ,TILE:TILE,M:M,rng:rng,blank:blank,grid:grid,blob:blob,ROADSET:ROADSET,landStats:landStats,stencil:stencil,
    streetEdges:streetEdges,footprints:footprints,connectedFrom:connectedFrom,ground:ground,
    register:register,get:get,types:types,act:act,
    CATEGORIES:CATEGORIES,TAXONOMY:TAXONOMY,category:category,inCategory:inCategory,
    legendOk:legendOk,voidFraction:voidFraction,largestBlob:largestBlob,roofsAndDoors:roofsAndDoors,buildingEdges:buildingEdges,lighten:lighten,
    STREET_ORDER:STREET_ORDER,primaryStreet:primaryStreet,rotateCW:rotateCW,scanGates:scanGates,
    pedGate:pedGate,rotateToStreet:rotateToStreet,
    streetCodes:streetCodes,layWalks:layWalks,canPlaceMass:canPlaceMass,D1_EXEMPT:D1_EXEMPT,
    driveNetworkOk:driveNetworkOk,driveTouchesEdge:driveTouchesEdge,stallsReachable:stallsReachable,
    driveReachFromStreet:driveReachFromStreet,driveNetworkReach:driveNetworkReach,driveWidthScore:driveWidthScore,driveMask:driveMask,driveConductors:driveConductors,KIND_LAYER:KIND_LAYER,tileLayer:tileLayer};
  if(typeof module!=='undefined')module.exports=API;
  root.BohemiaDistrictKit=API;
})(typeof window!=='undefined'?window:(typeof globalThis!=='undefined'?globalThis:this));
