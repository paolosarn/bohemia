// BOHEMIA DAY CYCLE — ambient light over the day (7/14/26)
// Grounded: sun color temperature (warm at horizon, neutral at noon);
// night floor = Paolo's approved ambient (+10% ruling, 7/14).
const BOH_DAYCYCLE=(function(){
  const NIGHT=[2.42,2.64,3.52];          // Paolo's night (16-level space)
  const DAY=[16,16,16];                  // full bright
  const DUSK=[11.5,8.5,6.5];             // warm horizon light (tunable, flagged)
  function lerp(a,b,t){return a.map((v,i)=>v+(b[i]-v)*t);}
  // t: 0..1 day fraction (0 = midnight)
  function ambientAt(t){
    t=((t%1)+1)%1;
    if(t<0.20) return NIGHT;                                   // deep night
    if(t<0.30) return lerp(NIGHT,DUSK,(t-0.20)/0.10);          // dawn warm-up
    if(t<0.38) return lerp(DUSK,DAY,(t-0.30)/0.08);            // morning
    if(t<0.70) return DAY;                                     // day
    if(t<0.80) return lerp(DAY,DUSK,(t-0.70)/0.10);            // golden hour
    if(t<0.88) return lerp(DUSK,NIGHT,(t-0.80)/0.08);          // dusk fall
    return NIGHT;
  }
  function isNightish(t){const a=ambientAt(t);return (a[0]+a[1]+a[2])/3<8;}
  return {ambientAt,isNightish,NIGHT,DAY,DUSK};
})();
if(typeof module!=='undefined')module.exports=BOH_DAYCYCLE;
