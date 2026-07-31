  window.wardrobeRefresh = function(){
    var host = document.getElementById('wardrobe');
    if (!host || !window.GARMENTS) return;
    host.innerHTML = '';
    var CATS = [['base','TOPS'],['legs','LEGS'],['feet','FEET'],['outer','OUTER'],
                ['head','HEADWEAR'],['hair','HAIR'],['face','FACE'],['neck','NECK'],
                ['hands','HANDS'],['waist','WAIST'],['gear','GEAR'],['back','BAGS']];
    var canon = window.GARMENTS.filter(function(g){ return g.st === 'canon'; });
    var pdOpts = (typeof slotOptions === 'function') ? slotOptions() : {};

    CATS.forEach(function(cat){
      var key = cat[0], pdSlot = window.PD_FOR_CAT[key];
      var mine = (pdSlot && pdOpts[pdSlot]) ? pdOpts[pdSlot] : [];      /* HIS painted pieces */
      var made = canon.filter(function(g){ return g.layer === key; })
                      .sort(function(a,b){ return a.n.localeCompare(b.n); });  /* 7/30: alphabetical */
      if (!mine.length && !made.length) return;

      /* what this category is wearing, from EITHER mechanism */
      var wornGen = window.G_WORN[key];
      var wornPD  = pdSlot ? G.equipped[pdSlot] : '';
      var label   = wornGen || (wornPD ? wornPD.split('/')[1] : '') || 'none';

      var h = document.createElement('div');
      h.className = 'cloSection cloFold';
      h.style.cssText = 'font-size:11px;cursor:pointer;padding:6px 8px';
      h.innerHTML = '<span class="cloArrow">&#9656;</span> ' + cat[1] +
                    ' <span style="opacity:.55">(' + (mine.length + made.length) + ')</span>' +
                    ' <span style="color:#8fd18f">' + label + '</span>';
      var body = document.createElement('div');
      body.style.display = 'none';
      h.onclick = function(){
        var open = body.style.display === 'none';
        body.style.display = open ? '' : 'none';
        h.querySelector('.cloArrow').innerHTML = open ? '&#9662;' : '&#9656;';
      };

      var mk = function(txt, on, fn, hot){
        var b = document.createElement('button');
        b.className = 'opt' + (on ? ' on' : '');
        b.textContent = txt;
        b.style.cssText = 'margin:2px;font-size:10px' + (hot ? ';border-color:#c86' : '');
        b.onclick = fn;
        return b;
      };

      /* NONE -- takes off whichever mechanism is on */
      body.appendChild(mk('NONE', !wornGen && !wornPD, function(){
        delete window.G_WORN[key];
        if (pdSlot) G.equipped[pdSlot] = '';
        window.wardrobeRefresh();
      }));

      /* HIS PAINTED PIECES FIRST -- they are canon, he drew them */
      mine.forEach(function(k){
        var nm = k.split('/')[1];
        body.appendChild(mk('✦ ' + nm, wornPD === k, function(){
          if (G.equipped[pdSlot] === k) G.equipped[pdSlot] = '';
          else { G.equipped[pdSlot] = k; delete window.G_WORN[key]; }
          window.wardrobeRefresh();
        }, true));
      });

      /* then the generated wardrobe */
      made.forEach(function(g){
        body.appendChild(mk(g.n, wornGen === g.n, function(){
          if (window.G_WORN[key] === g.n) delete window.G_WORN[key];
          else { window.G_WORN[key] = g.n; if (pdSlot) G.equipped[pdSlot] = ''; }
          window.wardrobeRefresh();
        }));
      });

      /* THE COLOURS LIVE WITH THE PIECE (Paolo 7/31: the separate COLORS block is
         gone). Only his painted pieces carry an editable ramp -- a generated
         garment's colour comes from its own ramp, not from a tint he can pick. */
      if (wornPD && typeof openEditor === 'function') {
        var ed = document.createElement('button');
        ed.className = 'opt';
        ed.style.cssText = 'margin:2px;font-size:10px;border-color:#6a8';
        ed.textContent = '✎ COLORS';
        ed.onclick = function(){ openEditor(pdSlot); };
        body.appendChild(ed);
      }

      host.appendChild(h); host.appendChild(body);
    });
  };
