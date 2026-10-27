// THE FOUR LAYOUTS (the coordinator 10/27, rule 291): every town and the camp, tall and wide, the phone left and right, shot from the settlement screen in a full-glass frame with the phone drawn where it stands.
// Serve the repo first: python3 -m http.server 8765 --bind 127.0.0.1 (from the repo root). Usage: node tools/bohemia_four_layouts_shoot_10_27_26.js OUTDIR [tag]
const { chromium } = require('playwright');
const OUT = process.argv[2]; const TAG = process.argv[3] || 'now';
const TOWNS = [['Anarchists','town'],['Blues','town'],['Caravans','fortress'],['Cartel','fortress'],['Church','town'],['Colorful','camp'],['Custom','camp'],['Homeless','camp'],['Mob','fortress'],['Network','fortress'],['Reds','town'],['Remnants','fortress'],['Trades','camp'],['Volunteers','camp'],['YOUR CAMP','camp']];
const GLASS = { tall: { width: 390, height: 844 }, wide: { width: 844, height: 390 } };
const BASE = 'http://127.0.0.1:8765';
function harness(place, tier, camp) {
  const q = 'place=' + encodeURIComponent(place) + '&tier=' + tier;
  return `<!doctype html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><style>html,body{margin:0;height:100%;overflow:hidden;background:#000}iframe{position:fixed;inset:0;width:100%;height:100%;border:0}#ph{position:fixed;border:2px solid #e8b84a;background:rgba(20,20,20,.88);border-radius:14px;box-sizing:border-box;z-index:9;color:#e8b84a;font:700 11px sans-serif;display:flex;align-items:center;justify-content:center}</style></head><body>
<iframe id=f src="${BASE}/slices/BOHEMIA_SETTLEMENT_SCREEN.html?${q}"></iframe><div id=ph>PHONE</div>
<script>
function place(){ var W=innerWidth,H=innerHeight,land=W>H,small=Math.min(W,H)<500,sc=small?(land?.9:1):1.25,w=124*sc,h=276*sc,side='right';
 try{var c=JSON.parse(localStorage.getItem('bohemia.phone.v1')||'null'); if(c&&c.side==='left')side='left';}catch(e){}
 var p=document.getElementById('ph'); p.style.width=w+'px'; p.style.height=h+'px'; p.style.top=(H-10-h)+'px'; p.style.left=(side==='left'?10:W-10-w)+'px'; }
place();
${camp ? `document.getElementById('f').addEventListener('load',function(){ setTimeout(function(){ document.getElementById('f').contentWindow.postMessage({type:'BOHEMIA_SETTLEMENT_OPEN',camp:true,arrival:false,place:{name:'YOUR CAMP',tier:'camp',district:'desert',block:[40,40]},batteries:20,contracts:[],hired:{},day:3,min:600,night:false,company:[],bill:null,cleared:null,condition:null},'*'); },800); });` : ''}
</script></body></html>`;
}
(async () => {
  const browser = await chromium.launch();
  for (const [place, tier] of TOWNS) {
    for (const shape of ['tall', 'wide']) {
      for (const side of ['left', 'right']) {
        const ctx = await browser.newContext({ viewport: GLASS[shape], deviceScaleFactor: 1, hasTouch: true, isMobile: shape === 'tall' });
        await ctx.addInitScript((s) => { try { localStorage.setItem('bohemia.phone.v1', JSON.stringify({ side: s })); } catch (e) {} }, side);
        const page = await ctx.newPage();
        await page.route(BASE + '/__h.html', r => r.fulfill({ contentType: 'text/html', body: harness(place, tier, place === 'YOUR CAMP') }));
        try { await page.goto(BASE + '/__h.html', { waitUntil: 'load', timeout: 30000 }); } catch (e) {}
        await page.waitForTimeout(place === 'YOUR CAMP' ? 4500 : 3500);
        const name = `${place.replace(/ /g, '_').toLowerCase()}_${shape}_${side}_${TAG}.png`;
        await page.screenshot({ path: OUT + '/' + name });
        await ctx.close();
        process.stdout.write(name + '\n');
      }
    }
  }
  await browser.close();
})();
