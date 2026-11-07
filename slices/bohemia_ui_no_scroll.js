/* BOHEMIA -- SMALLER, NEVER PAGES  (UI 9, 11/7/26, rule 402 AMENDED, ask line 481; was UI 8's pager, 11/6, ask line 444)

   PAOLO 11/4: 'scrolling is fucking illegal in my opinion... from the phone to the wide screen laptop, anything that's
   clickable I don't wanna scroll up and down anywhere ever again.'
   PAOLO 11/7: 'I didn't want to scroll during any of the UI of the games. I meant find a way to make things TINIER, you don't
   have to make things half the screen, like displaying new hires or anything else; the purpose was to make the UI smaller,
   not just do a next page bullshit, I can't believe I had to explain that.'

   UI 8 READ IT AS PAGES AND TABS. THAT WAS WRONG, AND IT IS ALL OUT: no page strip, no PAGE 1 OF 8, no settings tabs, no
   one-origin-at-a-time. Measured before (UI 8's build, phone upright): the hall 8 pages, ONE man on the glass at a time, his
   card 386 px tall; the smith and the armourer 2 pages; the stash 7 pages, 6 of 40 pieces on the glass; the settings card
   four tabs; the origins one of fifteen.

   NOW EVERY SCREEN FITS WHOLE BY MAKING ITS PIECES SMALLER (Battle Brothers' dense fixed screens the floor: its hiring list,
   its market, its stash grid, its one options panel):
     THE HALL      a man is a ROW, not a card: a small face, his name and trade, his ceiling, his gun, his trait, his eight in a
                   tight line with the stars, and HIRE with the price and the night on the right. His figure, his words and
                   why he costs more are a held finger away (data-tip). All the men on the glass at once.
     THE SHOPS     the shelf and the bag are 44 px cells (the icon and the price; the name on the piece's card), the strip
                   under them; on a short wide glass the shelf, the bag and the strip stand side by side.
     EVERY SHEET   the keeper's face small, his words in two lines; a sheet that is not a whole screen's job (the board, the
                   bar, the barber, the clinic, the lot) stays under half the glass.
     THE SETTINGS  one card, every row on it, in a grid (two columns on the phone, more on a wide glass).
     THE STASH     every piece in the bag on the glass in cells a thumb can press; the man's eight in two short columns when
                   the bag needs the room.
     THE ORIGINS   (slices/bohemia_ui_crashbox.js) all fifteen as small plates at once, the picked one's facts under them.

   TWO FLOORS, MEASURED, NEVER CROSSED:
     TEXT  11 CSS px on the phone: Apple's smallest text style (Caption 2, 11 pt; one CSS px is one point on an iPhone). Nothing
           this file draws or shrinks is smaller (BohemiaNoScroll.FLOOR).
     TAP   44 CSS px, the common thumb floor: every button keeps 44 in its short side, or the whole row is the target.

   THE FIT: a box is dressed dense (ns-d1); if it still does not fit, the next step (ns-d2, ns-d3) takes words off the rows into
   the held tip, never a page. A box that cannot fit even then is left overflowing (locked, never scrolled) and SAID in
   BohemiaNoScroll.state(box).over, so the gate fails it out loud instead of a pager hiding it.

   BohemiaNoScroll.fit(box, opts)   dress a box and fit it (levels: how many steps the box has)
   BohemiaNoScroll.state(box)       { pages: 1, at: 0, level, fits, over }   (pages is always 1: there are no pages)
   BohemiaNoScroll.reveal(el)       true (everything is on the glass; kept for the gates that call it)
   BohemiaNoScroll.off(true)        a checker's switch only: every dense look off, so the gate can watch the scroll come back
   [bb Battle Brothers: the hiring screen is one list of every recruit with his portrait and price; the market and the stash are
   fixed grids of small cells; the options are one panel. Nothing scrolls because everything is small enough.]
   [analog horror: the hall's list reads like a parole board's clipboard, a row a man, a photo stapled to each.] */
(function () {
  'use strict';
  if (window.BohemiaNoScroll) return;
  var FLOOR = 11, TAP = 44, OFF = false, BOXES = [];

  /* ---------------- THE TOWN'S SHEETS (RUN TWO's settlement file, untouched: this file plants itself in that frame) -------- */
  var WIDE = '(min-width:700px)', SHORT = '(min-aspect-ratio:4/3) and (max-height:620px)';
  var S = 'html body #sheet.ns-d1';   /* every dense rule waits on the class, so off() is one class away */
  var TOWN_CSS = ''
    /* the sheet: it never scrolls; a whole-screen job (the hall, a shop, the stall) may stand the glass's height, every other
       sheet is kept under half of it by its own small pieces */
    + S + '{overflow:hidden!important;padding:6px 10px 8px!important;scrollbar-width:none}'
    + S + '.ns-whole{max-height:calc(100% - 8px)!important}'
    /* the keeper: a small face, his name, his words in three lines at most (the whole line on a held finger) */
    + S + ' #sbody>.who{gap:8px;padding-right:50px}'
    + S + ' #sbody>.who canvas.face,' + S + ' #sbody>.who .face{width:40px!important;height:40px!important;flex:0 0 40px!important}'
    + S + ' #sbody>.who .say .nm{font-size:11px;letter-spacing:.8px}'
    + S + ' #sbody>.who .say p{font-size:13px;line-height:1.3;margin:2px 0 0;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}'
    + S + '.ns-d2 #sbody>.who .say p{-webkit-line-clamp:2}'
    + S + ' .acts{gap:4px;margin-top:6px}'
    + S + ' .act{min-height:44px!important;padding:4px 10px!important}'
    + S + ' .gridh{margin:4px 0 2px;font-size:11px}'
    + S + ' .slots{font-size:11px;margin-top:2px}'
    + S + ' .also{margin-top:6px;font-size:11px}' + S + ' .alsoface{width:40px;height:40px;padding:2px}' + S + ' .alsoface .face{width:34px!important;height:34px!important}'
    /* the board's clients: a small face a row */
    + S + ' .act.client .face.small{width:36px!important;height:36px!important;flex:0 0 36px!important}'
    + S + ' .act.client .cn{font-size:11px}' + S + ' .say .trip{font-size:11px;margin-top:3px}'
    /* ---- THE HALL: a man is a row ---- */
    + S + ' .hsort{gap:4px}' + S + ' .hsort button{min-height:44px!important;font-size:11px!important}'
    + S + ' .hire{display:grid!important;grid-template-columns:40px minmax(0,1fr) 80px;grid-template-areas:"face nm act" "face info act" "st st st";'
    +   'column-gap:6px;row-gap:1px;align-items:center;padding:3px 6px!important;margin-top:0!important;min-height:0!important}'
    + S + '.ns-d2 .hire{grid-template-areas:"face nm act" "face info act" "face st act"}'
    + S + '.ns-d2 .hire .hhead canvas.face{align-self:center}'
    + S + '.ns-d3 #sbody>.who .say p{-webkit-line-clamp:1}' + S + '.ns-d3 .acts:has(>.hire)>.gridh{display:none}'
    + S + ' .hire::before{display:none!important}'   /* the tape: one strip of it on every row is noise at a row's size */
    + S + ' .hire canvas.hfig{display:none!important}'   /* his whole figure is his card's, a held finger away; the row wears his face */
    + S + ' .hire .hiret,' + S + ' .hire .hhead{display:contents!important}'
    + S + ' .hire .hhead canvas.face{grid-area:face;align-self:start;width:40px!important;height:40px!important;flex:none}'
    + S + ' .hire .nm{grid-area:nm;font-size:11px!important;line-height:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}'
    + S + ' .hire .ns-hl{grid-area:info;display:flex;flex-wrap:wrap;align-items:center;gap:0 8px;min-width:0;max-height:30px;overflow:hidden;font-size:11px;line-height:15px}'
    + S + '.ns-d2 .hire .ns-hl{flex-wrap:nowrap;max-height:15px}'
    + S + ' .hire .hceil{display:inline-flex!important;align-items:center;gap:3px;margin:0!important;font-size:11px!important;flex-wrap:nowrap!important}'
    + S + ' .hire .hceil b{font-size:11px!important}' + S + ' .hire .hceil .cprice{display:none!important}'
    + S + ' .hire .hceil .cbar{flex:0 0 30px!important;min-width:30px!important;max-width:30px!important;height:13px!important}'
    + S + ' .hire .hceil .cbar em{font-size:11px!important;line-height:13px!important}'
    + S + ' .hire .hceil .kind{font-size:11px}' + S + ' .hire .hceil .bargain{font-size:11px;padding:0 4px;letter-spacing:1px}'
    + S + ' .hire .hgun{display:inline-flex!important;margin:0!important;gap:3px!important;font-size:11px!important;white-space:nowrap}'
    + S + ' .hire .hgun img,' + S + ' .hire .hgun canvas{width:16px!important;height:16px!important}'
    + S + ' .hire .htrait{display:inline-flex;gap:4px;align-items:center;margin:0!important;font-size:11px!important;white-space:nowrap}'
    + S + ' .hire .htrait>span{display:none}'   /* his trait in words: the held tip */
    + S + ' .hire .htrait em.bst-traitline b.bst-chg{font-size:11px!important}'
    + S + ' .hire .hrare{display:inline-flex;gap:4px;margin:0!important;font-size:11px!important;white-space:nowrap}'
    + S + ' .hire .hrare b{padding:0 4px!important;letter-spacing:1px!important}'
    + S + ' .hire .hwhy,' + S + ' .hire .hsays{display:none!important}'   /* why he costs more, and his own line: the held tip */
    + S + ' .hire .hedge{grid-column:2 / -1;font-size:11px!important;line-height:14px;margin:0!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}'
    + S + '.ns-d2 .hire .hedge,' + S + '.ns-d2 .hire .hgun .arm,' + S + '.ns-d2 .hire .hgun b,' + S + '.ns-d2 .hire .htrait em{display:none!important}'
    + S + '.ns-d2 .hire .ns-hl>*{flex:0 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis}' + S + '.ns-d2 .hire .hgun{flex:none}'
    /* his eight on one line: the icon, the number, the stars as small marks; the bar a thin line under the number */
    + S + ' .hire .hstats{grid-area:st;display:flex!important;flex-wrap:nowrap;justify-content:space-between;gap:0 2px!important;margin:0!important;padding:1px 4px!important;min-width:0;filter:none!important}'
    + S + ' .hire .hstats span.bst-row{display:inline-flex!important;align-items:center;gap:1px!important;height:15px!important;min-height:0!important;flex:0 1 auto;min-width:0}'
    + S + ' .hire .hstats span[data-stat]::before{width:12px!important;height:12px!important;margin:0 1px 0 0!important;flex:none}'
    + S + ' .hire .hstats .bst-st{display:inline-flex;flex-direction:column;gap:0;width:5px;order:3}'
    + S + ' .hire .hstats .bst-st .bmstar{width:5px!important;height:5px!important;margin:0!important}'
    + S + ' .hire .hstats .bst-bar{position:relative;display:inline-block!important;width:auto!important;min-width:18px;height:14px!important;background:none!important;border:0!important;box-shadow:none!important;overflow:visible!important}'
    + S + ' .hire .hstats .bst-bar>.bst-fill,' + S + ' .hire .hstats .bst-bar>.bst-lit{top:auto!important;bottom:0!important;height:2px!important}'
    + S + ' .hire .hstats .bst-bar>.bst-tick{display:none!important}'
    + S + ' .hire .hstats .bst-bar>i.bst-n{position:static!important;display:block;font-size:11px!important;line-height:12px!important;text-align:left;padding:0!important;transform:none!important}'
    + S + ' .hire .hstats b.bst-chg,' + S + ' .hire .hstats .bst-pad{display:none!important}'
    /* HIRE: 'HIRE 50' and his night under it, the money as the bar's battery mark (rule 150), 44 tall */
    + S + ' .hire>.act{grid-area:act;align-self:start;display:grid!important;grid-template-columns:auto auto;justify-content:center;align-content:center;column-gap:5px;row-gap:1px;margin:0!important;padding:2px 4px!important;min-height:44px!important;height:44px}'
    + S + '.ns-d2 .hire>.act{align-self:center}'
    + S + ' .hire>.act>span{flex:none!important;font-size:11px;letter-spacing:1px;text-transform:uppercase;line-height:15px;align-self:center}'
    + S + ' .hire>.act>em{display:contents!important}'
    + S + ' .hire>.act>em .nsw,' + S + ' .hire>.act>em .nss{display:none}'
    + S + ' .hire>.act>em .nsp{display:inline-flex;align-items:center;gap:2px;font-size:13px;line-height:15px;font-weight:bold;color:#3e1608}'
    + S + ' .hire>.act>em .nsn{grid-column:1 / -1;display:inline-flex;align-items:center;justify-content:center;gap:1px;font-size:11px;line-height:13px;font-weight:normal;letter-spacing:0;white-space:nowrap;color:#3e1608}'
    + S + ' .hire>.act>em .nsp::after,' + S + ' .hire>.act>em .nsn i.nsb{content:"";display:inline-block;width:11px;height:11px;background:var(--bm-batt) center/contain no-repeat;image-rendering:pixelated}'
    /* the camp staff and NOT NOW under the men: side by side, a thumb tall */
    + S + ' .acts:has(>.hire){display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:6px;row-gap:4px;align-items:start}'
    + S + ' .acts:has(>.hire)>.hire,' + S + ' .acts:has(>.hire)>.hsort,' + S + ' .acts:has(>.hire)>.gridh,' + S + ' .acts:has(>.hire)>:not(.act){grid-column:1 / -1}'
    + S + ' .acts:has(>.hire)>.act:not(.hire){margin:0!important;flex-wrap:wrap;gap:0 6px;font-size:11px!important}'
    + S + ' .acts:has(>.hire)>.act:not(.hire) span,' + S + ' .acts:has(>.hire)>.act:not(.hire) em{font-size:11px!important;flex:1 1 auto}'
    /* ---- THE SHOPS: the shelf and the bag are thumb-sized cells ---- */
    + S + ' .grid{grid-template-columns:repeat(auto-fill,minmax(44px,1fr))!important;gap:2px!important}'
    + S + ' .slot{aspect-ratio:auto!important;height:44px;min-height:44px!important;padding:1px!important;gap:0}'
    + S + ' .slot span.nm2,' + S + ' .slot>span:not([class]){display:none!important}'   /* the piece's name: its card, on a tap */
    + S + ' .slot img.pk{height:24px!important;max-width:80%}'
    + S + ' .slot em,' + S + ' .grid.bag .slot em{font-size:11px!important;line-height:12px}'
    + S + ' .slot em.money::before{width:9px!important;height:9px!important}'
    + S + ' .slot .kp,' + S + ' .slot .ys{font-size:0!important;width:6px;height:6px;border-radius:50%;background:#9fc38f;left:3px!important;top:3px!important}'   /* KEEP and YOURS: a green mark (the word on the strip) */
    + S + ' .slot .upm{font-size:11px!important}'
    + S + ' .ns-shelf{display:flex;flex-direction:column;gap:2px;min-width:0}'
    + S + ' .ns-bag{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:2px 4px;min-width:0;align-content:start}'
    + S + ' .ns-bag>*{grid-column:1 / -1;margin:0!important}' + S + ' .ns-bag>#selljunk:has(~#sortbag),' + S + ' .ns-bag>#sortbag{grid-column:auto}'
    + S + ' #selljunk{margin:2px 0!important;min-height:44px!important}' + S + ' #selljunk span,' + S + ' #selljunk em{font-size:11px!important}'
    + S + ' .shopstrip{position:static!important;margin:4px 0 0!important;padding:4px 0 0!important;box-shadow:none!important;gap:3px!important}'
    + S + ' .onman.ss-man{height:auto!important;max-height:none}'
    + S + ' .onman.ss-man .fstrip{flex-wrap:wrap!important;overflow:visible!important;gap:2px!important}'   /* every man's face on the glass: they wrap, never a strip that slides */
    + S + ' .onman.ss-man .fstrip button{width:40px!important;min-height:44px;padding:1px!important}'
    + S + ' .onman.ss-man .onwho,' + S + ' .onman.ss-man .lns .ln .k,' + S + ' .onman.ss-man .fstrip .dv,' + S + ' .fstrip button{font-size:11px!important}'
    + S + ' .ss-hint{padding-top:2px!important;font-size:11px!important}'
    + S + ' .act.stline .stl small,' + S + ' .act.stline .sw,' + S + ' .act.stline .sb small{font-size:11px!important}'
    + S + ' .ss-acts{height:44px!important}'
    + S + ' .onman .wcls .k{font-size:11px}' + S + ' .mbars{gap:2px}'
    /* ---- A WIDE GLASS (a computer, a tablet on its side): the keeper's column stays (UI's own two columns), the men in two
       columns of rows ---- */
    + '@media ' + WIDE + '{'
    +   S + ' .acts:has(>.hire)>.hire{grid-column:auto}}'
    /* ---- A SHORT WIDE GLASS (the phone on its side): the keeper is a line across the top, not a column, so the rows and the
       shelf have the whole width ---- */
    + '@media ' + SHORT + '{'
    +   S + '{max-height:calc(100% - 8px)!important}'
    +   S + ' #sbody:has(>.who){display:block!important;padding-right:0!important}'
    +   S + ' #sbody>.who{flex-direction:row!important;align-items:flex-start}'
    +   S + ' #sbody>.who .say p{-webkit-line-clamp:2}'
    +   S + ' #sbody>.who .say{display:flex;flex-wrap:wrap;gap:0 10px;align-items:baseline}' + S + ' #sbody>.who .say p{margin:0}'
    +   S + ' .acts:has(>.hire)>.hire{grid-column:auto}'
    /* the last step on a short glass: three columns of men, each man his name and his eight in two lines of four */
    +   S + '.ns-d3 .acts:has(>.hire){grid-template-columns:repeat(3,minmax(0,1fr));column-gap:6px}'
    +   S + '.ns-d3 .hire{grid-template-columns:32px minmax(0,1fr) 70px;grid-template-areas:"face nm act" "face st act"}'
    +   S + '.ns-d3 .hire .hhead canvas.face{width:32px!important;height:32px!important}'
    +   S + '.ns-d3 .hire .ns-hl{display:none!important}'
    +   S + '.ns-d3 .hire .hstats{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr));row-gap:0!important;padding:0 2px!important}'
    /* a shop on its side: the shelf, the bag and the strip side by side */
    +   S + '.shopping .acts{display:grid!important;grid-template-columns:140px minmax(0,1fr) 172px;column-gap:8px;align-items:start}'
    +   S + '.shopping .ns-bag{grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr) auto}' + S + '.shopping .ns-bag>.ns-bagh{grid-column:1;align-self:center}' + S + '.shopping .ns-bag>#selljunk{grid-column:2}' + S + '.shopping .ns-bag>#sortbag{grid-column:3}'
    +   S + '.stalling .act.stline{min-height:46px!important;padding:1px 4px!important}' + S + '.stalling .stallstrip .ss-facts{height:auto!important;max-height:30px}' + S + '.stalling .acts>.slots{margin:0!important}'
    +   S + '.shopping .acts>#shopstrip{margin:0!important;padding:0!important;border:0!important}'
    +   S + ' #sbody:has(.hsort)>.who{padding-right:min(46%,420px)}'
    +   S + ' .acts>.hsort{position:absolute;top:6px;right:58px;width:min(40%,360px);margin:0!important}'
    +   S + '.stalling .acts{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr);column-gap:8px;row-gap:3px;align-content:start}'
    +   S + '.stalling .acts>:not(.act){grid-column:1 / -1}}';

  /* the hall's row: his ceiling, his gun, his trait and the rare words in one line (ns-hl), HIRE's money as marks; the words
     his row no longer shows are on a held finger (data-tip) */
  function hallRows(doc) {
    var hs = doc.querySelectorAll('#sheet .hire');
    for (var i = 0; i < hs.length; i++) {
      var h = hs[i]; if (h.__nsRow) continue; h.__nsRow = 1;
      var t = h.querySelector('.hiret'), hd = h.querySelector('.hhead'); if (!t) continue;
      var hl = doc.createElement('div'); hl.className = 'ns-hl';
      ['.hrare', '.hceil', '.htrait', '.hgun'].forEach(function (s) { var e = t.querySelector(':scope > ' + s); if (e) hl.appendChild(e); });
      t.insertBefore(hl, hd ? hd.nextSibling : t.firstChild);
      var tip = []; ['.hwhy', '.hedge', '.hsays', '.htrait > span'].forEach(function (s) { var e = h.querySelector(s); if (e && e.textContent.trim()) tip.push(e.textContent.trim()); });
      var tl = h.querySelector('.htrait b'); if (tl) tip.unshift(tl.textContent + ':');
      if (tip.length && !h.dataset.tip) h.dataset.tip = tip.join(' ');   /* draft:true: the card's own words, joined */
      var em = h.querySelector(':scope > .act > em'); if (em && !em.__ns) moneyMarks(doc, em);
    }
  }
  /* '65 batteries  ·  3 batteries a night' -> the same words (textContent unchanged), the word 'batteries' drawn as the mark */
  function moneyMarks(doc, em) {
    em.__ns = 1;
    var m = /^\s*(\d+)\s+(batter(?:y|ies))(\s*·\s*)(\d+)\s+(batter(?:y|ies))(\s+a night)\s*$/.exec(em.textContent);
    var one = m ? null : /^\s*(\d+)\s+(batter(?:y|ies))\s*$/.exec(em.textContent);
    if (!m && !one) return;
    var sp = function (c, txt, kids) { var e = doc.createElement(c === 'nsp' || c === 'nsn' ? 'b' : 'i'); e.className = c; if (txt != null) e.textContent = txt; (kids || []).forEach(function (k) { e.appendChild(k); }); return e; };
    em.textContent = '';
    if (one) { em.appendChild(sp('nsp', null, [doc.createTextNode(one[1]), sp('nsw', ' ' + one[2])])); return; }
    em.appendChild(sp('nsp', null, [doc.createTextNode(m[1]), sp('nsw', ' ' + m[2])]));
    em.appendChild(sp('nss', m[3]));
    var night = sp('nsn', null, [doc.createTextNode(m[4]), sp('nsw', ' ' + m[5]), sp('nsb', ''), doc.createTextNode(m[6].replace(/^\s+/, ' '))]);
    em.appendChild(night);
  }
  /* a shop's sheet in three parts he can see at once: the mending and the shelf (ns-shelf), the bag (ns-bag), the strip. The
     shop is built whole on every open, so the parts are cut again each time; on the phone upright they stack as before */
  function shopCols(doc) {
    var bh = doc.querySelectorAll('#sheet .gridh'); for (var q = 0; q < bh.length; q++) { var nx = bh[q].nextElementSibling; bh[q].classList.toggle('ns-bagh', !!nx && (nx.id === 'selljunk' || nx.id === 'baggrid')); }
    var acts = doc.querySelector('#sheet .acts'), bag = acts && acts.querySelector(':scope > #baggrid');
    if (!acts || !bag || acts.querySelector(':scope > .ns-bag')) return;
    var kids = [].slice.call(acts.children), at = -1;
    for (var i = 0; i < kids.length; i++) { var n = kids[i].nextElementSibling; if (kids[i].classList.contains('gridh') && n && (n.id === 'selljunk' || n.id === 'baggrid')) { at = i; break; } }
    if (at < 0) return;
    var shelf = doc.createElement('div'); shelf.className = 'ns-shelf'; var bg = doc.createElement('div'); bg.className = 'ns-bag';
    var strip = acts.querySelector(':scope > #shopstrip');
    kids.forEach(function (k, j) { if (k === strip) return; (j < at ? shelf : bg).appendChild(k); });
    acts.insertBefore(bg, strip || null); acts.insertBefore(shelf, bg);
  }
  function townSheet() {
    var sh = document.getElementById('sheet'); if (!sh) return false;
    css(document, 'ns-town', TOWN_CSS);
    var whole = function () { var o = ''; try { o = (window.BohemiaSettlement && BohemiaSettlement.state && BohemiaSettlement.state.open) || ''; } catch (e) {} return /^(hall|smith|armourer|arms|stall)$/.test(o) || !!sh.querySelector('.hire, #shelfgrid, #baggrid, #stallstrip'); };
    fit(sh, { levels: 3, before: function () { hallRows(document); shopCols(document); sh.classList.toggle('ns-whole', whole()); } });
    return true;
  }

  /* ---------------- THE SETTINGS CARD (#setcard, the shell's one card): one card, every row, a grid ---------------- */
  var C = 'html body #setwrap.ns-d1 #setcard';
  var SET_CSS = ''
    + C + '{width:min(calc(100% - 16px),760px)!important;max-height:calc(100% - 16px);overflow:hidden!important;display:grid!important;'
    +   'grid-template-columns:repeat(auto-fill,minmax(170px,1fr));column-gap:12px;row-gap:4px;align-content:start;padding:10px 12px!important;box-sizing:border-box}'
    + C + '>*{margin:0!important;min-width:0}'
    + C + '>.seth{grid-column:1 / -1;margin:0 0 2px!important;font-size:11px!important}'
    + C + ' .setrow{gap:6px!important;min-height:44px}'
    + C + ' .setlab{flex:0 0 64px!important;font-size:11px!important;letter-spacing:1px!important;line-height:1.1;overflow-wrap:anywhere}'
    + C + ' .setbtn{padding:0 8px!important;font-size:11px!important}'
    + C + ' .setbars{gap:3px!important}'
    + C + ' .setnum,' + C + ' .setslide span{font-size:11px!important}'
    + C + ' #setcalib{min-height:44px;display:flex;align-items:center;gap:6px}' + C + ' #setcalib span{font-size:11px!important}' + C + ' #setcalib canvas{height:40px!important;width:auto!important}'
    /* the phone's block: its own full-width part of the card, its three apps side by side when there is room */
    + C + '>#setphone{grid-column:1 / -1;display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));column-gap:12px;row-gap:4px}'
    + C + '>#setphone>.seth{grid-column:1 / -1;font-size:11px!important;margin:2px 0 0!important}'
    + C + '>#setphone .pa{min-height:44px;margin:0!important}' + C + '>#setphone .pa span{font-size:11px!important}' + C + '>#setphone .pa img{height:36px!important;width:auto!important}'
    + C + '>#setclose,' + C + '>.setbtn.wide{grid-column:1 / -1}'
    + C + ' small,' + C + ' em{font-size:11px}'
    /* a row wider than a cell (the difficulty, the events, the new game) takes the card's width */
    + C + '>.ns-span{grid-column:1 / -1}';
  function settingsCard() {
    var w = document.getElementById('setwrap'), card = document.getElementById('setcard'); if (!w || !card) return false;
    css(document, 'ns-set', SET_CSS);
    /* the brightness picture stays under its own row (the phone's rows were laid in between them) */
    var bri = document.getElementById('setbright'), cal = document.getElementById('setcalib');
    var mark = function () {
      if (bri && cal && bri.parentNode && bri.parentNode.parentNode === card && cal.parentNode === card && bri.parentNode.nextSibling !== cal) card.insertBefore(cal, bri.parentNode.nextSibling);
      for (var i = 0; i < card.children.length; i++) { var r = card.children[i]; if (!r.classList.contains('setrow')) continue;
        var ctl = r.lastElementChild; r.classList.toggle('ns-span', !!ctl && ctl !== r.firstElementChild && ctl.scrollWidth > 150 && ctl.children.length > 3); }
    };
    fit(w, { box: card, levels: 1, before: mark });
    try { new MutationObserver(function () { if (w.classList.contains('on')) refreshBox(w); }).observe(w, { attributes: true, attributeFilter: ['class'] }); } catch (e) {}
    return true;
  }

  /* ---------------- THE CREW SCREEN (UI's own, slices/BOHEMIA_ROSTER_SCREEN.html) ---------------- */
  var K = 'html body.ns-d1';
  var CREW_CSS = ''
    + K + ' #bag{max-height:none!important;overflow:hidden!important;grid-template-columns:repeat(auto-fill,minmax(44px,1fr))!important;gap:2px!important}'
    + K + ' #bag .slot{height:44px!important;min-height:44px;padding:1px!important;gap:0!important}'
    + K + ' #bag .slot canvas,' + K + ' #bag .slot img,' + K + ' #bag .slot .bm-icon{width:24px!important;height:24px!important}'
    + K + ' #bag .slot b{font-size:11px!important}' + K + ' #bag .slot.off{font-size:11px!important}' + K + ' #bag .none{font-size:11px!important}'
    + K + ' #tabs .n{font-size:11px!important}' + K + ' #tabs button{font-size:11px!important}'
    /* when the bag needs the room: his eight in two short columns (Battle Brothers' character screen lays them in two) */
    + K + '.ns-d2 #card .stats{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;column-gap:8px!important;row-gap:0!important}'
    + K + '.ns-d2 #card .stats>*{min-height:15px!important;height:15px!important}'
    + K + '.ns-d3 #card .gslot{min-height:44px!important;height:44px!important}';
  var CREW = { t: 0, log: [] };
  function crewScreen() {
    css(document, 'ns-crew', CREW_CSS);
    var go = function () { CREW.t = 0; var B = fitBody(); CREW.log.push({ H: innerHeight, level: B.level, fits: B.fits, over: B.over }); if (CREW.log.length > 20) CREW.log.shift(); };
    var soon = function () { if (!CREW.t) CREW.t = requestAnimationFrame(go); };
    try { new MutationObserver(function (ms) { for (var i = 0; i < ms.length; i++) { var t = ms[i].target; if (t && t.closest && t.closest('.ns-tip')) continue; soon(); return; } }).observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    addEventListener('resize', soon); soon(); setTimeout(soon, 600); setTimeout(soon, 2000);
  }
  /* the crew screen is the whole glass: it fits when the page itself does not run past the glass */
  function fitBody() {
    var b = document.body, se = document.scrollingElement || document.documentElement;
    if (OFF) { b.classList.remove('ns-d1', 'ns-d2', 'ns-d3'); return { level: 0, fits: true, over: 0 }; }
    var bag = document.getElementById('bag'); if (bag) { bag.style.maxHeight = ''; }
    b.classList.remove('ns-d2', 'ns-d3'); b.classList.add('ns-d1');
    var over = function () { return Math.max(0, se.scrollHeight - innerHeight) + (bag ? Math.max(0, bag.scrollHeight - bag.clientHeight) : 0); };
    var lv = 1;
    if (over() > 1) { b.classList.add('ns-d2'); lv = 2; }
    if (over() > 1) { b.classList.add('ns-d3'); lv = 3; }
    var o = over(); CREW.state = { level: lv, fits: o <= 1, over: o };
    return CREW.state;
  }

  /* ---------------- THE FIT: dress dense, step down until it fits, never a page ---------------- */
  function css(doc, id, text) { if (doc.getElementById(id)) return; var s = doc.createElement('style'); s.id = id; s.textContent = text; (doc.head || doc.documentElement).appendChild(s); }
  function overOf(el) { return Math.max(0, el.scrollHeight - el.clientHeight - 1) + Math.max(0, el.scrollWidth - el.clientWidth - 1); }
  function cut(B) {
    if (B.busy) return; B.busy = true;
    try {
      var host = B.host, box = B.box;
      host.classList.remove('ns-d1', 'ns-d2', 'ns-d3');
      if (OFF) { B.level = 0; B.over = overOf(box); B.fits = B.over <= 0; return; }
      if (B.opts.before) try { B.opts.before(); } catch (e) {}
      host.classList.add('ns-d1'); if (box.scrollTop) box.scrollTop = 0;
      var lv = 1;
      while (overOf(box) > 0 && lv < (B.opts.levels || 1)) { lv++; host.classList.add('ns-d' + lv); }
      B.level = lv; B.over = overOf(box); B.fits = B.over <= 0;
      if (!B.fits) (window.__NS_LOG = window.__NS_LOG || []).push('does not fit: ' + (box.id || box.className) + ' over by ' + B.over + ' at level ' + lv);
    } catch (e) { (window.__NS_LOG = window.__NS_LOG || []).push(String(e)); }
    finally { B.busy = false; }
  }
  function soon(B) { if (B.t) return; B.t = (window.requestAnimationFrame || setTimeout)(function () { B.t = 0; cut(B); }); }
  function refreshBox(el) { for (var i = 0; i < BOXES.length; i++) if (BOXES[i].host === el || BOXES[i].box === el) cut(BOXES[i]); }
  function fit(host, opts) {
    opts = opts || {}; var box = opts.box || host;
    for (var i = 0; i < BOXES.length; i++) if (BOXES[i].host === host) { BOXES[i].opts = opts; soon(BOXES[i]); return BOXES[i]; }
    var B = { host: host, box: box, opts: opts, level: 0, fits: true, over: 0 }; BOXES.push(B);
    host.setAttribute('data-ns-fit', '1');
    try { new MutationObserver(function () { if (!B.busy) soon(B); }).observe(box, { childList: true, subtree: true }); } catch (e) {}
    try { new ResizeObserver(function () { if (!B.busy) soon(B); }).observe(host.ownerDocument.documentElement); } catch (e) {}
    box.addEventListener('scroll', function () { if (!OFF && box.scrollTop) box.scrollTop = 0; }, { passive: true });
    soon(B); return B;
  }

  /* ---------------- PLANTED IN EVERY FRAME OF THE GAME (from the shell): the same file, in that frame's own window ------------ */
  var SRC = (function () { try { var s = document.currentScript; return s && s.src ? s.src : null; } catch (e) { return null; } })();
  function plant() {
    var visit = function (w, depth) {
      if (depth > 4) return;
      try {
        var d = w.document; if (!d || !d.documentElement || d.readyState === 'loading') return;
        if (w !== window && !w.BohemiaNoScroll && !d.__nsPlanted && SRC && /SETTLEMENT_SCREEN|ROSTER_SCREEN|SPOILS_SCREEN|STASH_SCREEN/.test(w.location.pathname)) {
          d.__nsPlanted = 1; var sc = d.createElement('script'); sc.src = SRC; (d.head || d.documentElement).appendChild(sc);
          /* and the weapon's card (rule 397), the same way, where the page has none of its own */
          if (!w.BohemiaWeaponCard) { var wc = d.createElement('script'); wc.src = SRC.replace(/bohemia_ui_no_scroll\.js.*$/, 'bohemia_ui_weapon_card.js'); (d.head || d.documentElement).appendChild(wc); }
        }
      } catch (e) { return; }
      try { for (var i = 0; i < w.frames.length; i++) visit(w.frames[i], depth + 1); } catch (e) {}
    };
    visit(window, 0);
  }

  function boxOf(el) { for (var i = 0; i < BOXES.length; i++) if (BOXES[i].box === el || BOXES[i].host === el) return BOXES[i]; return null; }
  window.BohemiaNoScroll = {
    FLOOR: FLOOR, TAP: TAP, fit: fit,
    state: function (el) { if (el === document.body && CREW.state) return { pages: 1, at: 0, level: CREW.state.level, fits: CREW.state.fits, over: CREW.state.over };
      var B = boxOf(el); return B ? { pages: 1, at: 0, level: B.level, fits: B.fits, over: B.over } : null; },
    reveal: function () { return true; },   /* nothing is ever off the glass: there is nothing to turn to */
    refresh: function () { BOXES.forEach(cut); if (CREW.state) fitBody(); },
    off: function (on) { OFF = !!on; BOXES.forEach(cut); if (/ROSTER_SCREEN/.test(location.pathname)) fitBody(); return OFF; },
    crew: function () { return { log: CREW.log.slice(), state: CREW.state || null }; }
  };
  function boot() {
    var pg = location.pathname;
    if (/SETTLEMENT_SCREEN/.test(pg)) { townSheet(); return; }
    if (/ROSTER_SCREEN/.test(pg)) { crewScreen(); return; }
    if (/SPOILS_SCREEN|STASH_SCREEN/.test(pg)) return;   /* measured: their own layouts fit the glass (RUN's spoils) */
    settingsCard();
    if (window === window.top) { plant(); setInterval(plant, 700); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
