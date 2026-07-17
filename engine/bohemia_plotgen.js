// BOHEMIA PLOT GENERATOR (7/14/26) — CELL-IS-PLOT LAW as engine code.
// Each overmap cell IS its assignment (Paolo 7/14). This module generates
// the PLOT-level grid (128x128 fine cells) for non-street cells.
// LOCKED: WALLED SUBURBS LAW — decent+ suburbs get a perimeter wall with
//   gated entries; rough suburbs get open frontage to the arterial.
// LOCKED: legacy commercial = PARKING FRONTS STORES.
// LOCKED (7/14): WALL HEIGHT LAW — perimeter walls render MINIMUM 2 tiles
//   tall (wall prop carries hTiles:2; renderer draws the stacked face).
// PENDING Paolo (tunable params, researched defaults):
//   - quality threshold for walls (default: quality >= 2 of 0..4)
//   - gates per tract (default 2 — real Vegas tracts run 1-2 arterial entries)
//   - stall striping art (gap), block-wall tile choice (gap)
// Interiors are EMPTY by design: houses await part-role labels; storefront
// buildings await building generation. This module owns rings, aprons, bands.
const BOH_PLOTGEN=(()=>{ 
  function rng(seed){let s=seed>>>0;return function(){s=(s*1103515245+12345)>>>0;return s/4294967296;}}
  const N=128;
  // DISTRICT MERGE LAW (7/14): plots can span same-type cell clusters.
  // shape={cw,ch} in overmap cells (1x1 default, up to 2x2). Wall ring
  // wraps the UNION; no interior walls between merged cells.
  function empty(g){const grid=[];for(let y=0;y<N;y++){const r=[];for(let x=0;x<N;x++)r.push({g,props:[]});grid.push(r);}return grid;}
  // SUBURB: perimeter wall ring (1 cell thick) + gates on the street-facing edge.
  function suburbPlot(seed,quality,opts){
    opts=opts||{};
    const cw=(opts.shape&&opts.shape.cw)||1, ch=(opts.shape&&opts.shape.ch)||1;
    const W=N*cw, H=N*ch;
    const wallThreshold=opts.wallThreshold==null?1:opts.wallThreshold;   // most communities are walled
    const gatedThreshold=opts.gatedThreshold==null?4:opts.gatedThreshold; // gates = rich (PENDING exact)
    // streetEdges: which plot edges face streets, e.g. ['S'] or ['S','E'] — entries ONLY there
    const streetEdges=opts.streetEdges&&opts.streetEdges.length?opts.streetEdges:['S'];
    const entriesPerEdge=opts.entriesPerEdge==null?Math.max(1,cw):opts.entriesPerEdge;
    const r=rng(seed);
    // RESIDENTIAL FAMILY (7/14): districts can force character regardless of quality —
    // GATED district = gated by definition; ESTATE = walled+gated deep-setback money;
    // TRAILER = open, unwalled (rough frontage). All obey the same three laws.
    const walled=opts.forceWalled!=null?opts.forceWalled:quality>=wallThreshold;
    const gated=opts.forceGated!=null?opts.forceGated:quality>=gatedThreshold;
    const grid=[];for(let y=0;y<H;y++){const rr=[];for(let x=0;x<W;x++)rr.push({g:'yard_dirt',props:[]});grid.push(rr);}
    // ONE WALL PER COMMUNITY LAW: single seeded wall style index for the whole ring
    const wallStyle=Math.floor(r()*1e6);
    const meta={type:'suburb_plot',quality,walled,gated,wallStyle,shape:{cw,ch},streetEdges,entries:[],
      pending:['yard fill law','interior loops/culs layout (see VEGAS_NEIGHBORHOOD_ANATOMY)','wall/gate quality thresholds','interior houses']};
    if(walled){
      for(let x=0;x<W;x++){grid[0][x].props.push({p:'perimeter_wall',impassable:true,hTiles:2,style:wallStyle});grid[H-1][x].props.push({p:'perimeter_wall',impassable:true,hTiles:2,style:wallStyle});}
      for(let y=0;y<H;y++){grid[y][0].props.push({p:'perimeter_wall',impassable:true,hTiles:2,style:wallStyle});grid[y][W-1].props.push({p:'perimeter_wall',impassable:true,hTiles:2,style:wallStyle});}
      // GATES TOUCH STREETS LAW: entries only on street-facing edges
      for(const edge of streetEdges){
        for(let gi=0;gi<entriesPerEdge;gi++){
          const span=(edge==='N'||edge==='S')?W:H;
          const gp=Math.floor(span*(gi+1)/(entriesPerEdge+1))+Math.floor((r()-0.5)*10);
          const cells=[];
          for(const d of [0,1,2]){
            const p=Math.min(span-2,Math.max(1,gp+d));
            let x,y;
            if(edge==='S'){x=p;y=H-1;} else if(edge==='N'){x=p;y=0;}
            else if(edge==='E'){x=W-1;y=p;} else {x=0;y=p;}
            const c=grid[y][x];
            c.props=c.props.filter(q=>q.p!=='perimeter_wall');
            // entrance IS suburb road (Paolo law) + gate hardware only if rich
            c.g='suburb_road';
            if(gated)c.props.push({p:'gate_hardware',impassable:false,style:wallStyle});
            cells.push([x,y]);
            // road stub runs inward 4 cells from the entrance
            for(let s=1;s<=4;s++){
              const yy=edge==='S'?y-s:edge==='N'?y+s:y;
              const xx=edge==='E'?x-s:edge==='W'?x+s:x;
              if(yy>0&&yy<H-1&&xx>0&&xx<W-1)grid[yy][xx].g='suburb_road';
            }
          }
          meta.entries.push({edge,cells});
        }
      }
    }
    return {W,H,grid,meta};
  }
  // COMMERCIAL: parking apron fronts the storefront band (legacy Vegas law).
  function commercialPlot(seed,quality,opts){
    opts=opts||{};
    const cw=(opts.shape&&opts.shape.cw)||1, ch=(opts.shape&&opts.shape.ch)||1;
    const W=N*cw, H=N*ch;
    const streetEdges=opts.streetEdges&&opts.streetEdges.length?opts.streetEdges:['S'];
    const primary=streetEdges[0]; // apron faces the primary street (PARKING FRONTS STORES toward the street)
    const apron=opts.apronDepth==null?24:opts.apronDepth;
    const bandDepth=opts.bandDepth==null?20:opts.bandDepth;
    const drivesPerEdge=opts.drivesPerEdge==null?Math.max(1,cw):opts.drivesPerEdge;
    const r=rng(seed);
    const grid=[];for(let y=0;y<H;y++){const rr=[];for(let x=0;x<W;x++)rr.push({g:'backlot',props:[]});grid.push(rr);}
    // orient: depth axis runs from the primary street edge inward
    const paint=(d0,d1,g)=>{ // depth range [d0,d1) from primary edge, full breadth
      for(let d=d0;d<d1;d++)for(let b=0;b<((primary==='N'||primary==='S')?W:H);b++){
        let x,y;
        if(primary==='S'){x=b;y=H-1-d;} else if(primary==='N'){x=b;y=d;}
        else if(primary==='E'){x=W-1-d;y=b;} else {x=d;y=b;}
        grid[y][x]={g,props:[]};
      }};
    // PARKING GEOMETRY LAW (Paolo 7/14, blessed): aisle nearest street
    // (band 0, 4 deep), then stall bands 4 deep with vertical lines every
    // 3rd breadth-tile (shared dividers, 2-tile interiors — cars 2 wide).
    const span=(primary==='N'||primary==='S')?W:H;
    for(let d=0;d<apron;d++)for(let b=0;b<span;b++){
      const isStall=(Math.floor(d/4)%2===1);
      const g=(isStall&&b%3===0)?'stall_line':'parking_concrete';
      let x,y;
      if(primary==='S'){x=b;y=H-1-d;} else if(primary==='N'){x=b;y=d;}
      else if(primary==='E'){x=W-1-d;y=b;} else {x=d;y=b;}
      grid[y][x]={g,props:[]};
    }
    const inset=8;
    // storefront band behind the apron (inset from breadth ends)
    for(let d=apron;d<apron+bandDepth;d++)for(let b=inset;b<((primary==='N'||primary==='S')?W:H)-inset;b++){
      let x,y;
      if(primary==='S'){x=b;y=H-1-d;} else if(primary==='N'){x=b;y=d;}
      else if(primary==='E'){x=W-1-d;y=b;} else {x=d;y=b;}
      grid[y][x]={g:'storefront_pad',props:[]};
    }
    // DRIVEWAY CURB CUTS: entries touch streets — 3-cell cuts on every street edge
    const meta={type:'commercial_plot',quality,apron,bandDepth,shape:{cw,ch},streetEdges,primary,entries:[],
      pending:['stall striping art (gap)','storefront buildings','back-lot law']};
    for(const edge of streetEdges){
      for(let gi=0;gi<drivesPerEdge;gi++){
        
        const gp=Math.floor(span*(gi+1)/(drivesPerEdge+1))+Math.floor((r()-0.5)*8);
        const cells=[];
        for(const d of [0,1,2]){
          const p=Math.min(span-2,Math.max(1,gp+d));
          let x,y;
          if(edge==='S'){x=p;y=H-1;} else if(edge==='N'){x=p;y=0;}
          else if(edge==='E'){x=W-1;y=p;} else {x=0;y=p;}
          grid[y][x]={g:'parking_concrete',props:[]};
          cells.push([x,y]);
        }
        meta.entries.push({edge,cells});
      }
    }
    return {W,H,grid,meta};
  }
  // INDUSTRIAL (7/14): Vegas industrial parks = drive apron + loading
  // frontage facing the street, chain-link fenced yard behind (FENCE, not
  // community wall — different family, art PENDING), deep storage backlot.
  function industrialPlot(seed,quality,opts){
    opts=opts||{};
    const cw=(opts.shape&&opts.shape.cw)||1, ch=(opts.shape&&opts.shape.ch)||1;
    const W=N*cw, H=N*ch;
    const streetEdges=opts.streetEdges&&opts.streetEdges.length?opts.streetEdges:['S'];
    const primary=streetEdges[0];
    const apron=opts.apronDepth==null?16:opts.apronDepth;
    const bandDepth=opts.bandDepth==null?28:opts.bandDepth; // big sheds
    const r=rng(seed);
    const grid=[];for(let y=0;y<H;y++){const rr=[];for(let x=0;x<W;x++)rr.push({g:'yard_gravel',props:[]});grid.push(rr);}
    const span=(primary==='N'||primary==='S')?W:H;
    const put=(d,b,cell)=>{
      let x,y;
      if(primary==='S'){x=b;y=H-1-d;} else if(primary==='N'){x=b;y=d;}
      else if(primary==='E'){x=W-1-d;y=b;} else {x=d;y=b;}
      grid[y][x]=cell;};
    for(let d=0;d<apron;d++)for(let b=0;b<span;b++)put(d,b,{g:'drive_concrete',props:[]});
    for(let d=apron;d<apron+bandDepth;d++)for(let b=6;b<span-6;b++)put(d,b,{g:'shed_pad',props:[]});
    // fence ring around the whole plot with 3-cell drive cuts on street edges
    const meta={type:'industrial_plot',quality,shape:{cw,ch},streetEdges,primary,entries:[],
      pending:['chain-link fence art','shed buildings','yard clutter law']};
    for(let x=0;x<W;x++){grid[0][x].props.push({p:'fence',impassable:true});grid[H-1][x].props.push({p:'fence',impassable:true});}
    for(let y=0;y<H;y++){grid[y][0].props.push({p:'fence',impassable:true});grid[y][W-1].props.push({p:'fence',impassable:true});}
    for(const edge of streetEdges){
      const gp=Math.floor(span/2)+Math.floor((r()-0.5)*10);
      const cells=[];
      for(const d of [0,1,2]){
        const p=Math.min(span-2,Math.max(1,gp+d));
        let x,y;
        if(edge==='S'){x=p;y=H-1;} else if(edge==='N'){x=p;y=0;}
        else if(edge==='E'){x=W-1;y=p;} else {x=0;y=p;}
        const c=grid[y][x];
        c.props=c.props.filter(q=>q.p!=='fence');
        c.g='drive_concrete';
        cells.push([x,y]);
      }
      meta.entries.push({edge,cells});
    }
    return {W,H,grid,meta};
  }
  function generate(kind,seed,quality,opts){
    if(kind==='suburb')return suburbPlot(seed,quality,opts);
    if(kind==='commercial')return commercialPlot(seed,quality,opts);
    if(kind==='industrial')return industrialPlot(seed,quality,opts);
    return null;
  }
  return {generate,N};
})();
if(typeof module!=='undefined')module.exports=BOH_PLOTGEN;
