/* RUN TWO [the town in colour] (VAMILY rule 137(b), Paolo 10/24: 'let's be careful having everything look like a grey yellow sand
   color, I don't want that to flood all of our art'). MEASURES every settlement screen at his phone's size, day and night, and the
   crew screen: what share of the glass is the grey-yellow sand family, COOK's own definition (tools/bohemia_cook_map_colour_spread_
   10_24_26.js: in CIELAB, L* 30 to 86, C* 5 to 40, hue 45 to 105), and how much of it is the backdrop picture (COOK FOUR's) against
   what the screen lays over it (the people, the lead, the bar, the sheet: this lane's).
     node tools/bohemia_run2_the_town_in_colour.js [label]  -> records/target/run2_town_colour/<label>/{*.jpg, spread.json} */
'use strict';
const http = require('http'), fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..'), LABEL = process.argv[2] || 'before', OUT = path.join(ROOT, 'records/target/run2_town_colour', LABEL);
fs.mkdirSync(OUT, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.css': 'text/css' };
const server = http.createServer((req, res) => { const f = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(b); }); });
const PICS = { 'town_0.webp': 'town', 'town_1.webp': 'town', 'camp_0.webp': 'camp', 'camp_1.webp': 'camp', 'fortress_0.webp': 'fortress', 'fortress_1.webp': 'fortress', 'home_0.webp': 'home' };
/* in the page: the families of every pixel of the canvas (the sheet closed), with the picture alone for the backdrop's part */
const FAMILIES = `(function(){
  function lab(r,g,b){ var f=function(c){ c/=255; return c>0.04045?Math.pow((c+0.055)/1.055,2.4):c/12.92; }; r=f(r); g=f(g); b=f(b);
    var x=(r*0.4124+g*0.3576+b*0.1805)/0.95047, y=r*0.2126+g*0.7152+b*0.0722, z=(r*0.0193+g*0.1192+b*0.9505)/1.08883;
    var h=function(t){ return t>0.008856?Math.cbrt(t):7.787*t+16/116; }; var L=116*h(y)-16, A=500*(h(x)-h(y)), B=200*(h(y)-h(z)); return [L,A,B]; }
  window.__fam = function(data){ var n=0, c={sand:0, neutral:0, dark:0, red:0, green:0, blue:0, other:0};
    for(var i=0;i<data.length;i+=16){ var l=lab(data[i],data[i+1],data[i+2]), C=Math.hypot(l[1],l[2]), H=(Math.atan2(l[2],l[1])*180/Math.PI+360)%360; n++;
      if(l[0]<30) c.dark++; else if(C<5) c.neutral++; else if(H>=45&&H<105&&C<=40&&l[0]<=86) c.sand++; else if(H<45||H>=330) c.red++; else if(H<170) c.green++; else if(H<270) c.blue++; else c.other++; }
    var o={}; for(var k in c) o[k]=Math.round(c[k]/n*1000)/10; return o; };
})();`;
(async () => {
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch(), p = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
  await p.goto('http://127.0.0.1:' + server.address().port + '/slices/BOHEMIA_SETTLEMENT_SCREEN.html?place=Church&tier=town');
  for (let i = 0; i < 80; i++) { await p.waitForTimeout(250); if (await p.evaluate(() => { try { return BohemiaSettlement.ready(); } catch (e) { return false; } })) break; }
  await p.addScriptTag({ content: FAMILIES });
  const out = {};
  for (const [src, tier] of Object.entries(PICS)) for (const night of [false, true]) {
    const name = await p.evaluate(async ([src, tier, night]) => { for (let n = 0; n < 60; n++) { const nm = 'COLOUR ' + n; BohemiaSettlement.open({ place: { name: nm, tier }, traits: [], night }); await new Promise(r => setTimeout(r, 30)); if (BohemiaSettlement.lead().src === src) return nm; } return null; }, [src, tier, night]);
    if (!name) continue;
    await p.waitForTimeout(2500);
    const r = await p.evaluate(() => { const cv = document.getElementById('cv'), x = cv.getContext('2d'), d = x.getImageData(0, 0, cv.width, cv.height).data;
      const glass = __fam(d); BohemiaSettlement.lead(false); BohemiaSettlement.walkers(false); return { glass }; });
    await p.waitForTimeout(150);
    const bare = await p.evaluate(() => { const cv = document.getElementById('cv'), x = cv.getContext('2d'); /* the people off: the picture and the dusk around it */
      const L = BohemiaSettlement.folk(); return null; });
    const key = src.replace('.webp', '') + (night ? '_night' : '_day');
    await p.screenshot({ path: path.join(OUT, key + '.jpg'), type: 'jpeg', quality: 70 });
    await p.evaluate(() => { BohemiaSettlement.lead(true); BohemiaSettlement.walkers(true); });
    out[key] = r.glass;
    console.log(key.padEnd(18), JSON.stringify(r.glass));
  }
  fs.writeFileSync(path.join(OUT, 'spread.json'), JSON.stringify({ label: LABEL, rule: '137(b)', sand: 'CIELAB L 30-86, C 5-40, h 45-105 (COOK 10/24)', bar: 'no sand family over a third of the glass', screens: out }, null, 1));
  await browser.close(); server.close();
})();
