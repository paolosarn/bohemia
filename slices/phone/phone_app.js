/* THE PHONE — in-alpha screen. Self-contained IIFE, event-delegated (no global
   name collisions with the alpha). Runs on a MINIMAL context: only save.choices +
   the quest manager, so it does NOT depend on the alpha's older engine. Drives the
   real BohemiaLoop feed/quest/profile functions. Demo quests are throwaway, NOT canon. */
(function(){
  var Loop = window.BohemiaLoop;
  var host = document.getElementById('phoneApp');
  if(!Loop || !host) { if(host) host.innerHTML='<div style="padding:30px;color:#e77;font-family:sans-serif">phone modules failed to load</div>'; return; }

  /* minimal self-contained ctx (no engine Save / scheduler needed) */
  var ctx = { save:{ choices:[], seed:'bohemia', beat:0, meta:{gen:1} }, folds:null,
              clock:{ snapshot:function(){ return {beat:0}; } } };
  ctx.quests = Loop.makeQuestManager({ record:function(evt){
    var id = evt.kind==='outcome' ? 'quest:'+evt.questId+':'+String(evt.outcome||'END').toLowerCase()
                                  : 'quest:'+evt.questId+':'+evt.node+':'+evt.choiceId;
    ctx.save.choices.push({ id:id, beat:0, gen:1, recorded:true,
      effect: evt.kind==='outcome' ? {quest:evt.questId,outcome:evt.outcome}
                                   : {quest:evt.questId,node:evt.node,to:evt.to} });
  }});

  function FOLLOWER_SCORE(p){ return (p.kind==='outcome'&&p.outcome==='COMPLETE')?50:5; }

  function demoQuest(id,title,who,l1,o1,l2,l3){
    return ['@QUEST '+id+'  '+title,'@ACT 1','@ONCE true',
      '@STAGE 10','  @DO show_objective 10','@STAGE 20 COMPLETE','@OBJ 10 "'+o1+'"',
      '@TALK hi speaker='+who+' entry=stage>=10','  @SAY '+l1,
      '  @OPT "'+l2+'" [gate: none] -> hi2','@END',
      '@TALK hi2 speaker='+who,'  @SAY "so that is the ask. you in?"',
      '  @OPT "'+l3+'" [gate: none] @DO complete_objective 10 @DO set_stage 20 -> END','@END'].join('\n');
  }
  ctx.quests.place(demoQuest('waterrun','Water Run','trader',
    '"my hauler cracked a valve near the wash. cap it and the block drinks tonight."',
    'Cap the valve at the wash','how bad is it?','i will cap it'),
    { x:40,y:40, speaker:'trader', channel:'feed' });
  ctx.quests.place(demoQuest('rooftop','Rooftop Antenna','signalman',
    '"the feed goes dead on the east blocks. help me raise the antenna."',
    'Raise the east antenna','what is out there?','lets raise it'),
    { x:44,y:41, speaker:'signalman', channel:'feed' });
  ctx.quests.place(demoQuest('tunnelfavor','Tunnel Favor','king_hobo',
    '"no phones down here, kid. thats why you had to walk. carry a word up for me."',
    'Carry the tunnel word up','who are you?','ill carry it'),
    { x:90,y:90, speaker:'king_hobo', channel:'inperson' });

  var TAB='feed', online=true, openQuestId=null, player={x:0,y:0};
  function esc(s){ return String(s).replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }
  var AV=['#e9b24a','#57c6d6','#d98a3a','#8bc34a','#c98bde','#e77b7b','#6fa8ff'];
  function initials(n){ var p=String(n).replace(/[@_]/g,' ').trim().split(/\s+/); return (p[0]?p[0][0]:'?').toUpperCase()+(p[1]?p[1][0].toUpperCase():''); }
  function hash(s){ var h=0; for(var i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return h; }
  function av(n,big){ return '<div class="ph-av'+(big?' big':'')+'" style="background:'+AV[hash(n)%AV.length]+'">'+esc(initials(n))+'</div>'; }
  function photoFor(q){ var c1=AV[hash(q)%AV.length],c2=AV[hash(q+'x')%AV.length],rt=ctx.quests.get(q),t=rt&&rt.Q?rt.Q.title:q;
    return '<div class="ph-photo" style="background:linear-gradient(135deg,'+c1+'33,'+c2+'22)"><span class="pt">'+esc(t)+'</span><span class="pg">field photo · placeholder</span></div>'; }
  var CMR=['@wash_rat','@nell_87','@dust_ryder','@saltflat','@neon_mona','@tunnel_ed','@vato_prime','@grid_sis'];
  var CBD=['carried us fr','respect','this the one','you built diff','saw the smoke, glad ur ok','bohemia stand up','goat behavior','need more like u'];
  function commentsFor(q,f){ var count=Math.max(0,Math.floor(f/12)),n=Math.min(3,count),b=hash(q),s=[];
    for(var i=0;i<n;i++) s.push({who:CMR[(b+i*3)%CMR.length],text:CBD[(b+i*5)%CBD.length]}); return {count:count,sample:s}; }

  host.innerHTML =
    '<div class="ph-root"><div class="ph-status"><span>BOHEMIA</span><span class="ph-sig" data-act="signal"><span class="d">●</span> the valley · live</span></div>'+
    '<div class="ph-hero"><div class="ph-hrow">'+av('@founder_gen1',true)+'<div><div class="ph-name">Founder</div><div class="ph-sub">@founder_gen1 · post-collapse Las Vegas</div></div></div>'+
    '<div class="ph-stats"><div class="ph-st foll"><b id="ph-foll">0</b><span>followers</span></div><div class="ph-st"><b id="ph-posts">0</b><span>posts</span></div><div class="ph-st"><b id="ph-done">0</b><span>quests done</span></div></div></div>'+
    '<div class="ph-obj" id="ph-obj" style="display:none"></div>'+
    '<div class="ph-screen" id="ph-screen"></div>'+
    '<div class="ph-tabs">'+
      '<div class="ph-tab on" data-tab="feed">Feed</div><div class="ph-tab" data-tab="offers">Quests</div>'+
      '<div class="ph-tab" data-tab="log">Log</div><div class="ph-tab" data-tab="profile">Me</div></div>'+
    '<div class="ph-overlay" id="ph-overlay"><div class="ph-sheet" id="ph-sheet"></div></div></div>';

  var scr=document.getElementById('ph-screen');
  function top(){ var pr=Loop.socialProfile(ctx,FOLLOWER_SCORE);
    document.getElementById('ph-foll').textContent=pr.reach;
    document.getElementById('ph-posts').textContent=pr.posts;
    document.getElementById('ph-done').textContent=pr.questsCompleted;
    var objs=ctx.quests.activeObjectives(),o=document.getElementById('ph-obj');
    if(objs.length){ o.style.display='flex'; o.innerHTML='<span class="r">◎</span> '+esc(objs[0].text)+(objs.length>1?('   +'+(objs.length-1)+' more'):''); } else o.style.display='none';
  }
  function render(){
    top(); var h='';
    if(TAB==='feed'){
      if(!online) h+='<div class="ph-off">📵 No signal in the tunnels. Posts save and go up when you\'re back in range. Everything else on the phone still works.</div>';
      var feed=Loop.buildFeed(ctx), f=Loop.socialProfile(ctx,FOLLOWER_SCORE).reach;
      if(!feed.length) h+='<div class="ph-empty">Your feed is quiet.<br>Complete a quest and it posts here.</div>';
      feed.forEach(function(p,idx){ var gain=FOLLOWER_SCORE(p),likes=Math.max(1,Math.round(f*0.4)),ci=commentsFor(p.questId,f);
        h+='<div class="ph-card ph-post"><div class="ph-head">'+av('@founder_gen1')+'<div><div class="hn">Founder <span class="at">@founder_gen1</span></div></div><div class="tm">'+(idx===0?'now':('beat '+p.beat))+'</div></div>'+
           '<div class="bd">Wrapped up <b>'+esc(p.title)+'</b>. It is done. <span class="tg done">'+esc(p.outcome)+'</span></div>'+photoFor(p.questId)+
           '<div class="eng"><span>♥ '+likes+'</span><span>💬 '+ci.count+'</span><span class="g">+'+gain+' followers</span></div>'+
           (ci.count?('<div class="cmts">'+ci.sample.map(function(c){return '<div class="cm"><span class="cw">'+esc(c.who)+'</span> '+esc(c.text)+'</div>';}).join('')+(ci.count>ci.sample.length?('<div class="cmore">View all '+ci.count+' comments</div>'):'')+'</div>'):'')+'</div>';
      });
    } else if(TAB==='offers'){
      h+='<h2 class="ph-sec">Available over the phone</h2>';
      if(!online) h+='<div class="ph-off">📵 No signal. Can\'t pull quests off the feed down here — find people in person.</div>';
      var offers=ctx.quests.feedOffers();
      if(!offers.length) h+='<div class="ph-empty" style="padding:18px">No open quests on the feed.</div>';
      offers.forEach(function(o){ h+='<div class="ph-card ph-offer"'+(online?'':' style="opacity:.5"')+'><div class="ot">'+av('@'+(o.speaker||'x'))+'<div><div class="oti">'+esc(o.title)+'</div><div class="oby">from @'+esc(o.speaker||'someone')+'</div></div></div>'+
        '<div class="orow"><span class="chip feed">📱 over the phone</span>'+(online?'<button data-act="pick" data-q="'+o.questId+'">Pick up</button>':'<button disabled>No signal</button>')+'</div></div>'; });
      h+='<h2 class="ph-sec">Not on the feed · go find them</h2>';
      var any=false;
      ctx.quests.placements().forEach(function(pl){ if(pl.channel!=='inperson') return; var rt=ctx.quests.get(pl.questId); if(!rt||rt.state.done) return; any=true;
        var near=Loop.talkablesNear(ctx,player.x,player.y,1).some(function(t){return t.questId===pl.questId;});
        h+='<div class="ph-card ph-offer"><div class="ot">'+av('@'+(pl.speaker||'x'))+'<div><div class="oti">'+esc(rt.Q.title)+'</div><div class="oby">@'+esc(pl.speaker||'?')+' has no phone</div></div></div>'+
           '<div class="orow"><span class="chip inp">🚶 in person only</span>'+(near?'<button data-act="pick" data-q="'+pl.questId+'">Talk</button>':'<button class="ghost" data-act="pullup" data-q="'+pl.questId+'">Pull up on them</button>')+'</div>'+(near?'':'<div class="lock">Can\'t get this over the phone. Walk over to them.</div>')+'</div>'; });
      if(!any) h+='<div class="ph-empty" style="padding:14px">(none nearby)</div>';
    } else if(TAB==='log'){
      var j=ctx.quests.journal(); if(!j.length) h+='<div class="ph-empty">No quests yet.</div>';
      j.forEach(function(q){ var st=q.done?('<span class="tg done">'+esc(q.outcome)+'</span>'):'<span class="tg act">active</span>';
        var objs=q.objectives.map(function(o){return '<div class="lob'+(o.status==='done'?' d':'')+'">'+(o.status==='done'?'✅':'◎')+' '+esc(o.text)+'</div>';}).join('');
        h+='<div class="ph-card ph-log"><div class="lh">'+esc(q.title)+' '+st+'</div>'+objs+'<div class="via">picked up '+(q.channel==='inperson'?'in person':'over the phone')+'</div></div>'; });
    } else {
      var pr=Loop.socialProfile(ctx,FOLLOWER_SCORE);
      h+='<div class="ph-card"><div class="ph-head">'+av('@founder_gen1',true)+'<div><div class="hn" style="font-size:16px">Founder <span class="at">@founder_gen1</span></div><div class="oby">generation 1 · the founding</div></div></div>'+
         '<div class="ph-stats" style="margin-top:12px"><div class="ph-st foll"><b>'+pr.reach+'</b><span>followers</span></div><div class="ph-st"><b>'+pr.posts+'</b><span>posts</span></div><div class="ph-st"><b>'+pr.questsCompleted+'</b><span>done</span></div><div class="ph-st"><b>'+pr.questsTouched+'</b><span>touched</span></div></div></div>'+
         '<div class="ph-note">Follower count uses a PLACEHOLDER score (complete = 50). What counts as cool shit, and its worth, is your call. Feed / pickups / log / profile are all live off the real engine.</div>';
    }
    scr.innerHTML=h;
  }
  function setTab(t){ TAB=t; [].forEach.call(host.querySelectorAll('.ph-tab'),function(x){ x.classList.toggle('on',x.dataset.tab===t); }); scr.scrollTop=0; render(); }
  function drawSheet(v){ var sh=document.getElementById('ph-sheet'),h='<div class="grab"></div>';
    if(!v||v.ended){ h+='<div class="ban">'+(v&&v.outcome?esc(v.outcome):'DONE')+'</div><button style="width:100%;margin-top:12px" data-act="close">Back to the phone</button>'; sh.innerHTML=h; return; }
    h+='<div class="spk">'+av('@'+(v.speaker||'x'))+'<div class="nm">'+esc(v.speaker||'')+'<small>talking · in person</small></div></div>';
    (v.says||[]).forEach(function(s){ h+='<div class="say">'+esc(s)+'</div>'; });
    (v.options||[]).forEach(function(o){ h+='<button class="opt" data-act="choose" data-i="'+o.i+'">'+esc(o.text)+(o.to&&o.to!=='END'?'<span class="ar">›</span>':'')+'</button>'; });
    if(!(v.options||[]).length) h+='<button class="opt" data-act="close">(leave)</button>';
    sh.innerHTML=h;
  }
  function openTalk(q){ var rt=ctx.quests.get(q); if(!rt) return; openQuestId=q; drawSheet(Loop.talkTo(ctx,q,rt.available()[0]||'hi')); document.getElementById('ph-overlay').classList.add('on'); }
  function closeTalk(){ document.getElementById('ph-overlay').classList.remove('on'); openQuestId=null; render(); }

  host.addEventListener('click',function(e){
    var t=e.target.closest('[data-act]'); if(!t) return; var a=t.dataset.act;
    if(a==='signal'){ online=!online; t.innerHTML=online?'<span class="d">●</span> the valley · live':'<span class="d off">●</span> the tunnels · NO SIGNAL'; render(); }
    else if(a==='pick'){ openTalk(t.dataset.q); }
    else if(a==='pullup'){ var pl=ctx.quests.placements().filter(function(p){return p.questId===t.dataset.q;})[0]; if(pl){ player.x=pl.x-1; player.y=pl.y; render(); } }
    else if(a==='choose'){ var rt=ctx.quests.get(openQuestId); if(rt){ var v=rt.choose(+t.dataset.i); drawSheet(v&&v.ended?{ended:true,outcome:v.outcome}:v); top(); } }
    else if(a==='close'){ closeTalk(); }
  });
  host.addEventListener('click',function(e){ var t=e.target.closest('.ph-tab'); if(t) setTab(t.dataset.tab); });
  document.getElementById('ph-overlay').addEventListener('click',function(e){ if(e.target.id==='ph-overlay') closeTalk(); });

  render();
  window.__phoneReady = true;
})();
