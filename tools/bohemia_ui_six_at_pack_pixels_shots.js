/* THE SIX AT PACK PIXELS, the shots (UI [icons at full pixels] + [the crew button], 10/13/26). Takes the bar on his phone profile
   through the one driver, then the two candidates laid over it IN THE BROWSER ONLY (nothing written to the game): his pack props
   at 32 points = 96 phone pixels, their own size, and a CREW button. node tools/bohemia_ui_six_at_pack_pixels_shots.js <out dir> */
const fs=require('fs'),path=require('path');const ROOT=path.dirname(__dirname);const {open}=require(path.join(ROOT,'tools/bohemia_drive_the_demo.js'));
const B=path.join(ROOT,'reference/art_bank/prop/');
const SETS={A:{batteries:'pack_11_survival_props_045',food:'pack_11_survival_props_042',meds:'pack_12_weapons_and_supplies_030',rounds:'pack_12_weapons_and_supplies_018',tape:'pack_11_survival_props_039',water:'pack_11_survival_props_004'},
            B:{batteries:'pack_11_survival_props_044',food:'pack_11_survival_props_035',meds:'pack_11_survival_props_007',rounds:'pack_11_survival_props_031',tape:'pack_12_weapons_and_supplies_027',water:'pack_16_loot_and_survival_props_032'}};
const out=process.argv[2];
(async()=>{const d=await open({door:120000});const p=d.page,fr=d.fr;
await p.waitForTimeout(7000);
await p.screenshot({path:out+'/bar_now.png',clip:{x:0,y:0,width:390,height:140}});
const res={};
for(const k of ['A','B']){
  const imgs={};for(const [s,f] of Object.entries(SETS[k])) imgs[s]='data:image/png;base64,'+fs.readFileSync(B+f+'.png').toString('base64');
  res[k]=await fr.evaluate(({imgs,k})=>{
    ['bmcand','bmstash','bmcrew'].forEach(id=>{const e=document.getElementById(id);if(e)e.remove();});
    const st=document.createElement('style');st.id='bmcand';st.textContent=''
     +'html body #barread .rd.six{display:none!important}'
     +'#bmstash{display:flex;justify-content:space-between;align-items:center;gap:2px;height:40px;padding:2px 10px;position:relative;z-index:39;'
     +'background:#16130f var(--bm-glass) center/cover;box-shadow:inset 0 1px 0 rgba(255,236,200,.18),0 1px 0 #000;border-top:1px solid #0d0a07}'
     +'#bmstash .s{display:inline-flex;align-items:center;gap:3px;font-family:"BohemiaCasing",sans-serif;font-size:13px;color:#f0c46a;font-weight:bold}'
     +'#bmstash .s.none b{color:#bfb39a;opacity:.6}'
     +'#bmstash img{width:32px;height:32px;object-fit:contain;image-rendering:pixelated;display:block}'
     +'#bmcrew{flex:0 0 auto;min-width:52px;min-height:44px;display:inline-flex;align-items:center;justify-content:center;margin-left:auto;margin-right:6px;padding:0 8px;cursor:pointer;'
     +'font-family:"BohemiaCasing",sans-serif;font-size:11px;letter-spacing:.8px}'
     +(k==='A'
       ?'#bmcrew{color:#f2e4c6;border:1px solid #0d0a07;border-radius:2px;background:#16130f var(--bm-glass) center/cover;box-shadow:inset 0 1px 0 rgba(255,236,200,.18);filter:drop-shadow(0 1px 0 #000)}'
       :'#bmcrew{color:#1f1710;background:#e2dac6 var(--bm-receipt) center/100% 100%;filter:drop-shadow(0 1px 0 rgba(0,0,0,.85))}')
     +'html body #notebtn{margin-left:0!important}';
    document.head.appendChild(st);
    const bar=document.getElementById('menubar'),nb=document.getElementById('notebtn');
    const c=document.createElement('div');c.id='bmcrew';c.textContent='CREW';nb.parentNode.insertBefore(c,nb);
    const row=document.createElement('div');row.id='bmstash';
    [...document.querySelectorAll('#barread .sx')].forEach(sx=>{const s=document.createElement('span');s.className='s'+(sx.classList.contains('none')?' none':'');
      const im=document.createElement('img');im.src=imgs[sx.dataset.s];s.appendChild(im);const b=document.createElement('b');b.textContent=sx.querySelector('b').textContent;s.appendChild(b);row.appendChild(s);});
    bar.parentNode.insertBefore(row,bar.nextSibling);
    window.dispatchEvent(new Event('resize'));
    return new Promise(r=>setTimeout(()=>{const R=e=>{const q=e.getBoundingClientRect();return [q.x,q.y,q.width,q.height].map(Math.round)};
      r({crew:R(c),notes:R(nb),stash:R(row),imgs:[...row.querySelectorAll('img')].map(i=>({r:R(i),nw:i.naturalWidth,nh:i.naturalHeight}))});},400));
  },{imgs,k});
  await p.waitForTimeout(1500);
  await p.screenshot({path:out+'/bar_after_'+k+'.png',clip:{x:0,y:0,width:390,height:140}});
}
console.log(JSON.stringify(res));
await d.close();})().catch(e=>{console.error(e);process.exit(1)});
