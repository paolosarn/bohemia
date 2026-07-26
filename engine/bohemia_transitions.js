// BOHEMIA transitions — dual-grid corner sampling (render contract layer 2)
// Consumes BOHEMIA_TRANSITION_SET_7_10_26.txt. Engine-first: any zone, any pairs.
// Logic grid = truth (cell terrain ids). Display transition grid = offset half-cell;
// each display node samples its 4 surrounding cells and, when mixed, emits a piece.
const BOH_TRANSITIONS=(function(){
  let PIECES={}; // key: "a~b|piece" -> Image/b64
  function load(setJson){
    for(const p of setJson.pieces){ if(p.pure) PIECES[p.pair+"|"+p.piece]=p.b64; }
  }
  function pieceFor(a,b,kind){
    return PIECES[a+"~"+b+"|"+kind]||PIECES[b+"~"+a+"|"+kind]||null;
  }
  // grid: 2D array of terrain ids; returns draw list [{x,y,b64,kind,pair}]
  // Coordinates are CELL coords of the tile the piece overpaints.
  function computeDraws(grid){
    const H=grid.length,W=grid[0].length,draws=[];
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){
      const t=grid[y][x];
      const R=x+1<W?grid[y][x+1]:t, D=y+1<H?grid[y+1][x]:t, DR=(x+1<W&&y+1<H)?grid[y+1][x+1]:t;
      if(R!==t){const b=pieceFor(t,R,'edge_v'); if(b)draws.push({x,y,b64:b,kind:'edge_v',pair:t+'~'+R});}
      if(D!==t){const b=pieceFor(t,D,'edge_h'); if(b)draws.push({x,y,b64:b,kind:'edge_h',pair:t+'~'+D});}
      if(R===t&&D===t&&DR!==t){const b=pieceFor(t,DR,'corner_inner'); if(b)draws.push({x,y,b64:b,kind:'corner_inner',pair:t+'~'+DR});}
      if(R!==t&&D!==t&&DR!==t){const b=pieceFor(t,DR,'corner_outer'); if(b)draws.push({x,y,b64:b,kind:'corner_outer',pair:t+'~'+DR});}
    }
    return draws;
  }
  return {load, computeDraws, pieceFor};
})();
if(typeof module!=='undefined')module.exports=BOH_TRANSITIONS;
