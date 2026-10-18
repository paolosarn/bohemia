/* NO BROWSER DEFAULTS ON THE HUD, the read and the strip laid in the browser only (UI [no browser defaults on the HUD], rule 114
   tell D10, 10/18). Runs INSIDE a game page (and every same-origin frame under it) and does two things, nothing written to the game:
   window.__bmD10Read()  reads what the browser ACTUALLY resolves on screen, element by element and its ::before and ::after: a
     gradient, a blur, a glow (a shadow with any blur), a corner over 1 px, a panel in hue 250 to 290, and a word whose face is not
     one of the game's own (BohemiaROM, BohemiaCasing, BohemiaBody, BohemiaMono) or whose face never loaded. The file count in
     tools/bohemia_not_vibe_coded.py reads the source; this reads the screen, which is what he sees.
   window.__bmD10Strip(fontCss)  the candidate: every offender rewritten by one stylesheet keyed on a data attribute, so the frozen
     layout (THE FIRST VOTES) does not move a pixel:
     - a gradient becomes the colour of its middle stop, flat, and THE LIGHT IS DRAWN IN PIXELS (ALL THE UI LOOKS 3-D): a 1 px line
       of the gradient's own lightest stop along the top edge and its own darkest along the bottom, never a darkened copy
       (rule 114c: nothing is drawn by darkening; the two lines are colours the author already chose). A see-through gradient (every
       stop under 0.6 alpha: a vignette or a sheen laid over something) is dropped, no lines.
     - a shadow keeps its offset and loses its blur (a hard pixel drop); a pure glow (no offset) is dropped.
     - a blur is dropped from filter and backdrop-filter; a drop-shadow keeps its offset at 0 blur.
     - a corner over 1 px becomes 0.
     - a panel in hue 250 to 290 turns to the same lightness in the receipt's hue (36), saturation held under 0.25.
     - a word in a phone face takes the game's: a monospace face, a running sentence (over 40 letters) and a box he types in take
       BohemiaROM (typewriter width, the frozen LETTERS A, upper and lower case so a paragraph reads), a short label takes
       BohemiaCasing (the capitals); the faces are loaded into the page first from slices/fonts (fontCss) if the page has none. */
(function () {
  'use strict';
  var OURS = /^(BohemiaROM|BohemiaCasing|BohemiaBody|BohemiaMono)$/;
  function docs() {
    var out = [document];
    (function walk(d) { d.querySelectorAll('iframe').forEach(function (f) { try { if (f.contentDocument && f.contentDocument.body) { out.push(f.contentDocument); walk(f.contentDocument); } } catch (e) {} }); })(document);
    return out;
  }
  function splitTop(s) { var out = [], depth = 0, cur = ''; for (var i = 0; i < s.length; i++) { var ch = s[i];
    if (ch === '(') depth++; if (ch === ')') depth--; if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = ''; } else cur += ch; }
    if (cur.trim()) out.push(cur.trim()); return out; }
  function rgba(c) { var m = /rgba?\(([^)]+)\)/.exec(c || ''); if (!m) return null; var p = m[1].split(/[\s,\/]+/).filter(Boolean).map(parseFloat);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
  function lum(c) { return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]; }
  function str(c) { return 'rgba(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ',' + (+c[3].toFixed(3)) + ')'; }
  function hsl(c) { var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, h = 0, s = 0;
    if (mx !== mn) { var d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? ((b - r) / d + 2) : ((r - g) / d + 4); h *= 60; } return [h, s, l]; }
  function fromHsl(h, s, l, a) { var q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    var f = function (t) { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < .5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
    return [f(h / 360 + 1 / 3) * 255, f(h / 360) * 255, f(h / 360 - 1 / 3) * 255, a]; }
  function shadows(v) { if (!v || v === 'none') return []; return splitTop(v).map(function (s) {
    var col = (/rgba?\([^)]*\)/.exec(s) || ['rgba(0,0,0,1)'])[0]; var rest = s.replace(col, ' '); var inset = /\binset\b/.test(rest);
    var n = (rest.match(/-?\d+(?:\.\d+)?px/g) || []).map(parseFloat); return { col: col, x: n[0] || 0, y: n[1] || 0, b: n[2] || 0, s: n[3] || 0, inset: inset }; }); }
  function visible(e, win) { var r = e.getBoundingClientRect(), cs = win.getComputedStyle(e);
    return r.width >= 2 && r.height >= 2 && cs.display !== 'none' && cs.visibility !== 'hidden' && +cs.opacity > 0.02
      && r.right > 0 && r.bottom > 0 && r.left < win.innerWidth && r.top < win.innerHeight; }
  function hasText(e) { if (/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(e.tagName)) return true; for (var n = e.firstChild; n; n = n.nextSibling) if (n.nodeType === 3 && n.textContent.trim()) return true; return false; }
  function face(cs) { return cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(); }

  /* one element (or one of its pseudos): what D10 finds on it */
  function judge(e, cs, pseudo, doc) {
    var f = [], bgi = cs.backgroundImage || 'none';
    if (/gradient\(/.test(bgi)) f.push('gradient');
    if (/blur\(/.test(cs.filter + ' ' + (cs.backdropFilter || cs.webkitBackdropFilter || ''))) f.push('blur');
    if (shadows(cs.boxShadow).concat(shadows(cs.textShadow)).some(function (s) { return s.b > 0; })) f.push('glow');
    if (/drop-shadow\([^)]*\)/.test(cs.filter) && /drop-shadow\((?:[^)]*?-?\d+(?:\.\d+)?px){2}\s+[1-9]/.test(cs.filter)) f.push('glow');
    if (['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomLeftRadius', 'borderBottomRightRadius'].some(function (k) { return (parseFloat(cs[k]) || 0) > 1; })) f.push('radius');
    var bg = rgba(cs.backgroundColor); if (bg && bg[3] > 0.3) { var h = hsl(bg); if (h[0] >= 250 && h[0] <= 290 && h[1] >= 0.15) f.push('hue 250-290'); }
    if (!pseudo && hasText(e)) { var fc = face(cs); if (!OURS.test(fc)) f.push('system font'); else if (!doc.fonts.check('12px "' + fc + '"')) f.push('font not loaded'); }
    if (pseudo && cs.content && cs.content !== 'none' && cs.content !== '""' && cs.content !== 'normal') { var fp = face(cs); if (!OURS.test(fp)) f.push('system font'); }
    return f;
  }
  function sel(e) { return (e.id ? '#' + e.id : e.tagName.toLowerCase()) + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/)[0] : ''); }
  function each(cb) {
    docs().forEach(function (doc, di) { var win = doc.defaultView;
      doc.querySelectorAll('body, body *').forEach(function (e) {
        if (/^(SCRIPT|STYLE|CANVAS|IMG|IFRAME|svg|path|BR)$/i.test(e.tagName)) return;
        if (e.closest('#bmd10css')) return;
        if (!visible(e, win)) return;
        [null, '::before', '::after'].forEach(function (ps) { var cs = win.getComputedStyle(e, ps);
          if (ps && (!cs.content || cs.content === 'none' || cs.content === 'normal')) return;
          cb(doc, di, e, ps, cs); });
      });
    });
  }
  window.__bmD10Read = function () {
    var rows = [], tot = { gradient: 0, blur: 0, glow: 0, radius: 0, 'hue 250-290': 0, 'system font': 0, 'font not loaded': 0 }, faces = {};
    each(function (doc, di, e, ps, cs) { var f = judge(e, cs, ps, doc);
      if (!ps && hasText(e)) { var fc = face(cs); faces[fc] = (faces[fc] || 0) + 1; }
      if (!f.length) return; f.forEach(function (k) { tot[k]++; }); var r = e.getBoundingClientRect();
      rows.push({ frame: di, sel: sel(e) + (ps || ''), find: f, box: [r.x, r.y, r.width, r.height].map(Math.round), font: face(cs) }); });
    return { W: innerWidth, H: innerHeight, frames: docs().length, total: tot, faces: faces, rows: rows };
  };
  /* THE LAYOUT HOLDS: the box of every element with an id, in every frame, so the gate can say the frozen picks did not move */
  window.__bmD10Boxes = function () { var out = {};
    docs().forEach(function (doc, di) { doc.querySelectorAll('[id]').forEach(function (e) { if (!visible(e, doc.defaultView)) return; var r = e.getBoundingClientRect();
      out[di + '#' + e.id] = [r.x, r.y, r.width, r.height].map(Math.round); }); }); return out; };
  window.__bmD10Strip = function (fontCss) {
    var n = window.__bmD10N || 0, per = docs().map(function () { return []; }), fixed = { gradient: 0, blur: 0, glow: 0, radius: 0, 'hue 250-290': 0, 'system font': 0 };
    each(function (doc, di, e, ps, cs) {
      var f = judge(e, cs, ps, doc); if (!f.length) return;
      var id = e.getAttribute('data-d10'); if (!id) { id = 'd' + (n++); e.setAttribute('data-d10', id); }
      var R = [], r = e.getBoundingClientRect();
      var keep = shadows(cs.boxShadow).filter(function (s) { return !(s.b > 0 && !s.x && !s.y); }).map(function (s) {
        return (s.inset ? 'inset ' : '') + s.x + 'px ' + s.y + 'px 0 ' + s.s + 'px ' + s.col; });
      if (f.indexOf('gradient') >= 0) { fixed.gradient++;
        var layers = splitTop(cs.backgroundImage), urls = layers.filter(function (l) { return /^url\(/.test(l); });
        var stops = (cs.backgroundImage.match(/rgba?\([^)]*\)/g) || []).map(rgba).filter(Boolean);
        R.push('background-image:' + (urls.length ? urls.join(',') : 'none'));
        if (stops.length && stops.some(function (c) { return c[3] >= 0.6; })) {
          var mid = stops[Math.floor(stops.length / 2)], bg = rgba(cs.backgroundColor);
          if (!bg || bg[3] < 0.05) R.push('background-color:' + str(mid));
          if (r.height >= 8 && !ps) { var sorted = stops.slice().sort(function (a, b) { return lum(b) - lum(a); });
            keep.push('inset 0 1px 0 0 ' + str(sorted[0]), 'inset 0 -1px 0 0 ' + str(sorted[sorted.length - 1])); }
        }
      }
      if (f.indexOf('glow') >= 0) { fixed.glow++;
        R.push('text-shadow:' + (shadows(cs.textShadow).filter(function (s) { return s.x || s.y; }).map(function (s) { return s.x + 'px ' + s.y + 'px 0 ' + s.col; }).join(',') || 'none'));
        if (/drop-shadow/.test(cs.filter)) R.push('filter:' + cs.filter.replace(/drop-shadow\(([^)]*)\)/g, function (m, a) { var col = (/rgba?\([^)]*\)/.exec(a) || [''])[0];
          var nn = (a.replace(col, '').match(/-?\d+(?:\.\d+)?px/g) || []); return (nn[0] === '0px' && nn[1] === '0px') ? '' : 'drop-shadow(' + col + ' ' + nn[0] + ' ' + nn[1] + ' 0)'; }).replace(/blur\([^)]*\)/g, '').trim() || 'none');
      }
      R.push('box-shadow:' + (keep.join(',') || 'none'));
      if (f.indexOf('blur') >= 0) { fixed.blur++;
        R.push('filter:' + (cs.filter.replace(/blur\([^)]*\)/g, '').trim() || 'none'), 'backdrop-filter:none', '-webkit-backdrop-filter:none'); }
      if (f.indexOf('radius') >= 0) { fixed.radius++; R.push('border-radius:0'); }
      if (f.indexOf('hue 250-290') >= 0) { fixed['hue 250-290']++; var c = rgba(cs.backgroundColor), h = hsl(c); R.push('background-color:' + str(fromHsl(36, Math.min(h[1], 0.25), h[2], c[3]))); }
      if (f.indexOf('system font') >= 0) { fixed['system font']++; R.push('font-family:' + (/mono|courier|consol|menlo/i.test(cs.fontFamily) || (e.textContent || e.placeholder || '').trim().length > 40 || /^(INPUT|TEXTAREA)$/.test(e.tagName) ? '"BohemiaROM"' : '"BohemiaCasing"')); }
      if (f.indexOf('font not loaded') >= 0) R.push('font-family:' + (/ROM|Mono/.test(face(cs)) ? '"BohemiaROM"' : '"BohemiaCasing"'));
      /* on the element itself the fix is written inline with !important (it beats an id rule that is !important too); a ::before
         or ::after cannot carry an inline style, so it goes in the page's one stylesheet keyed on the data attribute */
      if (!ps) R.forEach(function (x) { var i = x.indexOf(':'); e.style.setProperty(x.slice(0, i), x.slice(i + 1), 'important'); });
      else per[di].push('[data-d10="' + id + '"]' + ps + '{' + R.map(function (x) { return x + '!important'; }).join(';') + '}');
    });
    docs().forEach(function (doc, di) {
      /* a second pass ADDS (a screen that fades a panel in after the first pass still gets it); the faces go in once */
      var st = doc.getElementById('bmd10css'); if (!st) { st = doc.createElement('style'); st.id = 'bmd10css'; st.textContent = fontCss; doc.head.appendChild(st); }
      if (per[di].length) st.textContent += '\n' + per[di].join('\n');
    });
    window.__bmD10N = n;
    return { rules: per.reduce(function (a, p) { return a + p.length; }, 0), fixed: fixed };
  };
})();
