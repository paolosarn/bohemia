// BOHEMIA FEED STREAM — one stream, three sources, and the surface just reads it.
// (9/5/26, LIFE + CITY lane. VAMILY job [feed posts] / THE-FEED-STREAM: "one event
//  stream the city-screen feed reads: the deed ledger first (exists), then
//  faction/territory events, then ambient life posts".)
//
// THE LAW ROUTES THIS EXPLICITLY AND THE UI LANE ALREADY BUILT THE OTHER HALF.
// laws/BOHEMIA_ADDENDUM_THE_FEED_ON_THE_CITY_SCREEN_9_4_26.md routes the SURFACE to
// UI (shipped: the phone screen in CITY mode, the scroll, the beat) and THE STREAM
// here. Their own header says it out loud -- "this is a reader, not a source ... it
// consumes whatever the game already writes" -- and names the seam they left open:
// "WORLD/PEOPLE own the faction event stream; when it lands it calls this ... Until
// then that source is EMPTY, on purpose." This is that source landing, and it takes
// over the two stopgaps the surface was carrying meanwhile, because the law says ONE
// stream and two producers for one feed is the bug this repo keeps writing up.
//
// WHAT WAS MEASURED ON THE WALKED SURFACE BEFORE A LINE OF THIS WAS WRITTEN:
//   BOHEMIA_FACTION_GRAPH  present    BohemiaTowns  present, ZERO callers
//   POWER                  358 live cells          prices  water 1, food 1
//   BohemiaCentury/Housing/Production  present (this lane's own, shipped this round)
//   the world source of the feed       0 posts, ever
// Everything the world needs to talk about is in the page and nothing reads it. That
// is the whole job.
//
// AN EVENT STREAM MEANS DIFFS, NOT A DESCRIPTION. A source that re-states the world
// every beat is a status bar, and he asked for a feed: things that HAPPENED. So every
// world source keeps its last-seen value and speaks only when it moves. The first
// drain is the baseline and says nothing about the world, which is correct -- "the
// grid is at 358" is not news, "the grid just lost a block" is.
//
// WHO SAYS IT: faction names come from the graph the world already has, never from a
// name typed here. WHAT THEY SAY is TEXT, so ALWAYS MAKE AN ATTEMPT (8/11) applies --
// every line is a real attempt tagged draft:true and WORDS edits them later. Which
// faction says what ABOUT WHOM is canon and is not decided here: posts report what
// moved, in the valley's mouth, and never put an opinion in a named faction's mouth.
//
// REUSE CHECK: cooks NO pixels, adds NO panel, and owns no memory. It reads the deed
// ledger, the power map, the price table, the faction graph via BohemiaTowns, and this
// lane's own century record. It writes nothing any of them owns.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');

  var MAX_PER_DRAIN = 3;      /* a feed, not a dump: a beat carries a few posts */
  /* TWO CADENCES, AND PUTTING THEM ON ONE BROKE ANOTHER LANE'S GATE. Events are
     events: a deed you just did has to land on the NEXT beat, which is the surface's
     own published contract and what its gate measures. Ambient life is the opposite --
     one every eight beats, or the panel reads as a ticker. The first cut ran the whole
     drain on the slow cadence, so a finished quest waited up to seven beats and UI's
     feed gate went red on latency. THE CADENCE BELONGS TO THE SOURCE, NOT TO THE
     CALLER, so the slow one lives here and the surface simply drains every beat. */
  var LIFE_EVERY = 8;

  function make() {
    return {
      V: 1,
      seenDeeds: 0,
      /* null means "never looked", which is NOT the same as zero and is the whole
         reason the first drain is silent about the world. */
      lit: null, prices: null, seats: null, built: null,
      lifeAt: -1, lastLife: null, lifeBeat: null,
      /* THE CAP DELAYS A POST, IT NEVER DROPS ONE. The first cut capped the RETURN
         while the sources had already advanced their cursors, so on a busy beat the
         fourth thing that happened was gone for good -- a faction taking a seat,
         silently eaten by a price change and two blackouts. An event stream that
         loses events is a status bar with extra steps. */
      pending: []
    };
  }

  function post(who, txt, kind) {
    return { who: who, txt: String(txt), kind: kind || 'world', draft: true };
  }

  /* ---------------------------------------------------------------------------
     1. WHAT YOU DID. The deed ledger, which already exists and already keeps the
        REASON -- the completing stage's own @LOG line -- so a post about your
        standing quotes the quest's own words and never prose written about it.
        That is the 8/11 catalogue rule, and it is why this reads `why` first.
     --------------------------------------------------------------------------- */
  function deeds(st, w) {
    var out = [], log = (w && w.deedLog) || null;
    if (!log || !log.length) return out;
    /* THE LEDGER IS CAPPED AND SHIFTS, so an index is not a safe cursor once it
       wraps. Clamp rather than read off the front of a rotated array. */
    if (st.seenDeeds > log.length) st.seenDeeds = 0;
    while (st.seenDeeds < log.length) {
      var e = log[st.seenDeeds++];
      if (!e) continue;
      var who = e.who || 'somebody';
      var handle = '@' + String(who).toLowerCase().replace(/[^a-z0-9]+/g, '');
      var txt = e.why ? String(e.why)
                      : ((e.d > 0) ? ('word is you did right by ' + who + '.')
                                   : ('word is you burned ' + who + '.'));
      if (e.quest) txt += '  [' + e.quest + ']';
      out.push(post(handle, txt, 'mine'));
    }
    return out;
  }

  /* ---------------------------------------------------------------------------
     2. WHAT THE WORLD DID. Four things that really move on the walked surface,
        each spoken only when it changes.
     --------------------------------------------------------------------------- */
  function world(st, w) {
    var out = [];

    /* THE LIGHTS. Light is territory (COLOUR IS TERRITORY, and the 12% grid), so a
       block coming on or going dark is the most legible thing that can happen to
       this valley without a person in it. */
    if (typeof w.lit === 'number') {
      if (st.lit === null) st.lit = w.lit;                 /* baseline, no post */
      else if (w.lit !== st.lit) {
        var d = w.lit - st.lit;
        st.lit = w.lit;
        out.push(post('@thecircuit', d > 0
          ? ('another ' + d + (d === 1 ? ' block' : ' blocks') + ' came up on the grid tonight.')
          : (Math.abs(d) + (Math.abs(d) === 1 ? ' block' : ' blocks') + ' went dark. nobody is saying why.')));
      }
    }

    /* WHAT THINGS COST. The shop's own quote, never a number typed here -- if the
       valley gets thirstier the sim moves the price and the feed says so. */
    if (w.prices) {
      if (st.prices === null) st.prices = w.prices;
      else {
        for (var g in w.prices) {
          if (!Object.prototype.hasOwnProperty.call(w.prices, g)) continue;
          var was = st.prices[g], now = w.prices[g];
          if (typeof was !== 'number' || typeof now !== 'number' || was === now) continue;
          out.push(post('@nobodysgas', now > was
            ? (g + ' is up to ' + battery(now) + '. it was ' + battery(was) + ' last week.')
            : (g + ' is down to ' + battery(now) + '. somebody got a load in.')));
        }
        st.prices = w.prices;
      }
    }

    /* WHO HOLDS WHAT. The faction seats the world already derives -- FORTRESS, TOWN,
       CAMP. A seat changing tier is a faction rising or falling, which is the
       territory half of his ruling. The NAMES are the graph's; nothing is invented. */
    if (w.seats) {
      if (st.seats === null) st.seats = w.seats;
      else {
        for (var f in w.seats) {
          if (!Object.prototype.hasOwnProperty.call(w.seats, f)) continue;
          var b = st.seats[f], a = w.seats[f];
          if (!a || b === a) continue;
          out.push(post('@thevalley', b
            ? (f + ' is a ' + String(a).toLowerCase() + ' now. it was a ' + String(b).toLowerCase() + '.')
            : (f + ' has put down a ' + String(a).toLowerCase() + '.')));
        }
        st.seats = w.seats;
      }
    }

    /* AND WHAT YOU PUT UP. The century record is this lane's own and it already
       knows, so the valley notices a building the same round it is placed. */
    if (typeof w.built === 'number') {
      if (st.built === null) st.built = w.built;
      else if (w.built > st.built) {
        var n = w.built - st.built;
        st.built = w.built;
        out.push(post('@eastwardEve', n === 1
          ? 'somebody has put a roof up where there was nothing. good.'
          : (n + ' new roofs this week. somebody is building.')));
      } else st.built = w.built;
    }

    return out;
  }

  function battery(n) { return n === 1 ? 'one battery' : (n + ' batteries'); }

  /* ---------------------------------------------------------------------------
     3. AMBIENT LIFE, KEYED OFF WHAT EXISTS -- which is the half of his ruling a
        fixed list of lines cannot satisfy. The law asks for posts "keyed off what
        exists (trade, circuit owner, hour, what you are known for), so the valley
        reads as alive when nothing is happening". So each of these is a sentence
        the CURRENT world makes true: the hour, the light, the price of water. A
        static list says the same things in a dark valley and a lit one.
        draft:true, every one -- WORDS owns the voice.
     --------------------------------------------------------------------------- */
  function life(st, w) {
    var lines = [];
    var hh = (typeof w.min === 'number') ? Math.floor(w.min / 60) : 12;
    var night = (hh >= 20 || hh < 6);
    var lit = (typeof w.lit === 'number') ? w.lit : null;

    /* THE FIRST CUT OF THIS READ AS A LOOP AND I ONLY SAW IT BY WATCHING THE PANEL.
       At six in the morning exactly two of these were true, so the feed alternated
       the same two lines forever -- which is worse than a fixed list, because it is a
       fixed list that took an hour to build. The fix is not more lines, it is more of
       the world: the faction seats and the size of the grid are things the valley can
       always talk about, and they differ between one valley and another. */
    if (w.seats) {
      var names = [], held = {};
      for (var f in w.seats) if (Object.prototype.hasOwnProperty.call(w.seats, f)) {
        names.push(f); held[w.seats[f]] = (held[w.seats[f]] || 0) + 1;
      }
      if (names.length) {
        var pick = names[Math.abs(st.lifeAt + 1) % names.length];
        lines.push(post('@thevalley', 'still no moving the ' + pick + ' off their '
          + String(w.seats[pick]).toLowerCase() + '. everybody knows it.', 'life'));
      }
      if (held.fortress > 1)
        lines.push(post('@nightcount', held.fortress + ' outfits holding a fortress between them. '
          + 'that is a lot of walls for one valley.', 'life'));
    }
    if (lit !== null && lit < 500)
      lines.push(post('@thecircuit', 'most of the valley is still dark. '
        + lit + ' blocks with anything in them at all.', 'life'));

    if (night && lit !== null && lit > 0)
      lines.push(post('@nightcount', 'counting lights from the ridge again. ' + lit
        + ' of them tonight.', 'life'));
    if (night && lit === 0)
      lines.push(post('@nightcount', 'no lights anywhere from the ridge. just the stars, and they do not help.', 'life'));
    if (!night && hh < 10)
      lines.push(post('@waterline', 'queue at the standpipe already. bring something to sit on.', 'life'));
    if (!night && hh >= 15)
      lines.push(post('@duststop', 'wind off the dry lake all afternoon. tape your windows.', 'life'));
    if (w.prices && typeof w.prices.water === 'number')
      lines.push(post('@marisol_v', 'water is ' + battery(w.prices.water) + ' today. no se, pero we drink anyway.', 'life'));
    if (typeof w.built === 'number' && w.built > 0)
      lines.push(post('@thecircuit', 'new build going up on the east side. somebody has plans.', 'life'));
    if (!lines.length)
      lines.push(post('@thevalley', 'quiet day. nobody has anything to say and that is its own news.', 'life'));

    /* ONE AT A TIME, AND NEVER THE SAME ONE TWICE RUNNING. The seed fills the panel
       with three in a row, so a plain rotation over a two-line set printed the same
       sentence back to back the moment he opened it. */
    st.lifeAt = (st.lifeAt + 1) % lines.length;
    var one = lines[st.lifeAt];
    if (lines.length > 1 && st.lastLife === one.txt) {
      st.lifeAt = (st.lifeAt + 1) % lines.length;
      one = lines[st.lifeAt];
    }
    st.lastLife = one.txt;
    return [one];
  }

  /* ---------------------------------------------------------------------------
     THE DRAIN. One call, one stream, newest sources first: what you did leads,
     because it is the thing he came to see; the world next; ambient life only when
     the first two had nothing, which is exactly when the valley needs to sound
     alive. Capped, because a feed is not a dump.
     --------------------------------------------------------------------------- */
  function drain(st, w) {
    if (!st || !w) return [];
    st.pending = (st.pending || []).concat(deeds(st, w)).concat(world(st, w));
    /* ambient life fills a beat when nothing happened, and is NOT queued: a quiet
       line held over and shown three beats later is a lie about a quiet moment. */
    if (!st.pending.length) {
      /* nothing happened: fill the quiet, but only on the slow cadence. A caller that
         does not hand over a beat gets the old behaviour and life every drain. */
      if (typeof w.beat === 'number') {
        if (st.lifeBeat !== null && w.beat - st.lifeBeat < LIFE_EVERY) return [];
        st.lifeBeat = w.beat;
      }
      return life(st, w);
    }
    var out = st.pending.slice(0, MAX_PER_DRAIN);
    st.pending = st.pending.slice(MAX_PER_DRAIN);
    return out;
  }

  /* FILLING AN EMPTY PANEL IS ITS OWN CASE AND IT IS NOT THE SLOW CADENCE. The moment
     he zooms out there is nothing to read, and a blank phone teaches nothing and reads
     as broken -- the surface's own measurement, and why it seeds three posts on open.
     So the burst asks for N lines and the eight-beat rule does not apply to it: the
     rule exists to stop a ticker, and three lines at once is not a ticker, it is the
     panel having something in it. Found by UI's gate going red at ONE post when the
     cadence started gating the seed too. */
  function seed(st, w, n) {
    var out = [], want = n || 3;
    for (var i = 0; i < want; i++) out = out.concat(life(st, w));
    return out;
  }

  /* WHAT THE SURFACE HAS TO HAND OVER. Gathered by the caller, not reached for
     here: this module is loaded headless by its gate and must not know the names of
     a page's globals. */
  function shape() {
    return ['deedLog', 'lit', 'prices', 'seats', 'built', 'min'];
  }

  /* ===========================================================================
     THE FEED ENGINE (10/26/26, FEED lane, row [the feed is alive], rule 215;
     rule 217 for the usernames).

     Paolo 10/26: "a part of the game managing all these mini events and triggers,
     presented in a social media thing, to make it feel alive... pretty much
     tweets... organize it properly so every time we upgrade it gets better."

     WHAT THE OLD STREAM ABOVE GOT RIGHT, AND IS KEPT HERE AS THE RULES:
       - a feed is DIFFS, never a description (watch() below speaks only when a
         value moves, and its first look is a silent baseline);
       - THE CAP DELAYS A POST, IT NEVER DROPS ONE, for the things he did (a kind
         marked must: a deed waits for room, it is never eaten);
       - never the same line twice running (variants rotate, and the last posts'
         words are remembered).
     WHAT IT COULD NOT DO, AND WHY THIS EXISTS: every sentence and every trigger
     was code. Here every post kind is a ROW in ONE data file (records/target/bb/
     feed_kinds.json, the mods law): its trigger, who may post it, how often at
     most, how soon after, its words with variants, what it teaches. A new kind is
     a new row. The engine knows no sentence and no account.

     THE CLOCK IS THE GAME'S. Everything here is in game minutes: the game calls
     tick(minuteNow) and the engine walks the minutes since the last tick, so a
     sleep or a long march fills its hours the way a real feed fills overnight,
     and a paused clock posts nothing. The pace (a handful an hour, more after
     something big, never a wall) is the file's `pace` block.

     ONE FUNCTION FOR THE PHONE: read() answers the posts, newest first, each
     {handle, text, at, kind: mine|world|life, reply_to}; on(fn) hears each new
     one as it lands (the wallpaper's slide). Nothing here draws or pops up.
     =========================================================================== */
  var FE_STEP_CAP = 24 * 60;   /* a jump longer than a day replays only its last day */

  function feHash(s) {
    var h = 2166136261; s = String(s == null ? '' : s);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  function feRng(seed) {                       /* mulberry32: a seed replays a feed exactly (the gate) */
    var a = (seed >>> 0) || 1;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0; var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function feSpan(r, span) {
    if (span == null) return 0;
    if (typeof span === 'number') return span;
    var lo = +span[0] || 0, hi = (span.length > 1) ? +span[1] : lo;
    if (!(hi >= lo)) hi = lo;
    return lo + Math.floor(r() * (hi - lo + 1));
  }
  function feList(v) { return v == null ? [] : (Array.isArray(v) ? v : [v]); }
  function feText(w) { return (w && typeof w === 'object') ? String(w.text || '') : String(w == null ? '' : w); }
  /* a variant is {text, by}: `by` (an account id or 'tag:<tag>') keeps a line in the one
     mouth it belongs to, so one row can carry every faction page's own words */
  function feWord(w) {
    var t = feText(w); if (!t) return null;
    return { text: t, by: (w && typeof w === 'object' && w.by) ? feList(w.by).map(String) : null };
  }
  function feWords(v) { return feList(v).map(feWord).filter(Boolean); }
  function feBy(w, a) {
    if (!w.by) return true;
    for (var i = 0; i < w.by.length; i++) {
      var b = w.by[i];
      if (b === a.id) return true;
      if (b.indexOf('tag:') === 0 && feList(a.tags).indexOf(b.slice(4)) >= 0) return true;
    }
    return false;
  }

  /* {key} from the event's data; a variant naming a key the event does not carry
     is not said (null), never said with a hole in it. */
  function feFill(text, data) {
    var missing = false;
    var out = String(text).replace(/\{([a-z_0-9]+)\}/g, function (m, k) {
      var v = data[k];
      if (v === undefined || v === null || v === '') { missing = true; return m; }
      return String(v);
    });
    return missing ? null : out;
  }

  function feInHours(h, span) {
    var a = +span[0], b = +span[1];
    return a <= b ? (h >= a && h < b) : (h >= a || h < b);
  }
  /* WHEN: the row's own conditions, all plain data. hours [from,to) wraps past
     midnight; night; act; min_day; is {key: value or [values]}; at_least {key: n}. */
  function feWhen(when, data) {
    if (!when) return true;
    if (when.hours && !feInHours(data.hour | 0, when.hours)) return false;
    if (when.night === true && !data.night) return false;
    if (when.night === false && data.night) return false;
    if (when.act != null && feList(when.act).indexOf(data.act | 0) < 0) return false;
    if (when.min_day != null && (data.day | 0) < when.min_day) return false;
    var k;
    if (when.is) for (k in when.is) if (Object.prototype.hasOwnProperty.call(when.is, k)) {
      if (feList(when.is[k]).map(String).indexOf(String(data[k])) < 0) return false;
    }
    if (when.at_least) for (k in when.at_least) if (Object.prototype.hasOwnProperty.call(when.at_least, k)) {
      if (!(+data[k] >= when.at_least[k])) return false;
    }
    if (when.below) for (k in when.below) if (Object.prototype.hasOwnProperty.call(when.below, k)) {
      if (!(+data[k] < when.below[k])) return false;
    }
    return true;
  }

  function feNormalize(file) {
    file = file || {};
    var pace = file.pace || {};
    var P = {
      per_window: pace.per_window || pace.per_hour || { min: 2, max: 5 },
      big: pace.big || { extra: 4, for_min: 120 },
      min_gap_min: pace.min_gap_min == null ? 4 : +pace.min_gap_min,
      reply_gap_min: pace.reply_gap_min == null ? 2 : +pace.reply_gap_min,
      quiet_after_min: pace.quiet_after_min || [14, 26],
      expire_min: pace.expire_min == null ? 120 : +pace.expire_min,
      keep: pace.keep || 80,
      no_repeat: pace.no_repeat || 40,
      reply_chance: pace.reply_chance == null ? 0.3 : +pace.reply_chance,
      big_reply_chance: pace.big_reply_chance == null ? 0.9 : +pace.big_reply_chance,
      title_case: pace.title_case || ['town', 'man', 'client', 'was', 'toward', 'faction_name'],
      real_gap_s: pace.real_gap_s == null ? 0 : +pace.real_gap_s,
      window_min: pace.window_min == null ? 60 : +pace.window_min,
      live_jump_min: pace.live_jump_min == null ? 90 : +pace.live_jump_min
    };
    var accounts = {}, order = [];
    feList(file.accounts).forEach(function (a) {
      if (!a || !a.id || accounts[a.id]) return;
      accounts[a.id] = a; order.push(a.id);
    });
    var kinds = [], byTrigger = {};
    feList(file.kinds).forEach(function (k) {
      if (!k || !k.id || !k.trigger) return;
      var row = {
        id: String(k.id), source: k.source || 'world', trigger: feList(k.trigger).map(String),
        who: feList(k.who), when: k.when || null, chance: k.chance == null ? 1 : +k.chance,
        max_per_window: k.max_per_window != null ? +k.max_per_window : (k.max_per_hour == null ? 3 : +k.max_per_hour),
        cooldown_min: k.cooldown_min == null ? 0 : +k.cooldown_min,
        delay_min: k.delay_min == null ? [1, 6] : k.delay_min,
        big: !!k.big, must: k.must == null ? (k.source === 'mine') : !!k.must,
        expire_min: k.expire_min == null ? P.expire_min : +k.expire_min,
        words: feWords(k.words),
        again_key: k.again_key || null, again_after_min: k.again_after_min == null ? 0 : +k.again_after_min,
        replies: feList(k.replies), follow_up: feList(k.follow_up),
        teaches: k.teaches || ''
      };
      if (!row.words.length) return;
      kinds.push(row);
      row.trigger.forEach(function (t) { (byTrigger[t] = byTrigger[t] || []).push(row); });
    });
    return { pace: P, accounts: accounts, order: order, kinds: kinds, byTrigger: byTrigger,
             byId: kinds.reduce(function (m, k) { m[k.id] = k; return m; }, {}) };
  }

  function engine(file, opts) {
    opts = opts || {};
    var F = feNormalize(file);
    var P = F.pace;
    var r = feRng(opts.seed == null ? (Math.random() * 4294967296) >>> 0 : feHash(opts.seed));
    var say = opts.say || null;              /* the house Spanglish dial, handed in (BohemiaSpanglish.say) */
    var ctx = { company: 'the company', act: 1 };
    var st = {
      seq: 0, now: null, posts: [], queue: [], kindAt: {}, lastVariant: {}, recent: [],
      bigUntil: -1, lastAt: -1e9, nextQuiet: null, seen: {}, hourSeen: null, daySeen: null, again: {}, realAt: -1e15
    };
    var ears = [];

    function clockData(t) {
      var day = Math.floor(t / 1440), m = ((t % 1440) + 1440) % 1440, hour = Math.floor(m / 60);
      /* the game's own dark hours when it hands them over (night_from, night_to) */
      var nf = ctx.night_from == null ? 20 : +ctx.night_from, nt = ctx.night_to == null ? 6 : +ctx.night_to;
      var night = feInHours(hour, [nf, nt]);
      return { day: day, hour: hour, minute: m % 60, night: night,
               hh: (hour < 10 ? '0' : '') + hour + ':' + ((m % 60) < 10 ? '0' : '') + (m % 60) };
    }
    function base(t) {
      var d = clockData(t), k;
      d.act = ctx.act | 0 || 1; d.company = ctx.company;
      for (k in ctx) if (Object.prototype.hasOwnProperty.call(ctx, k) && d[k] === undefined) d[k] = ctx[k];
      return d;
    }
    /* the map writes places and people in capitals (BOULDER CITY); a person typing a post
       writes Boulder City. The file names which keys are names (pace.title_case). */
    function titled(d) {
      (P.title_case || []).forEach(function (k) {
        if (typeof d[k] === 'string' && d[k] === d[k].toUpperCase())
          d[k] = d[k].toLowerCase().replace(/(^|[\s'-])([a-z\u00E0-\u00FF])/g, function (m, a, c) { return a + c.toUpperCase(); });
      });
      return d;
    }
    function merge(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; if (b) for (k in b) if (b[k] !== undefined) o[k] = b[k]; return o; }

    function countSince(t, kindId) {
      var n = 0;
      for (var i = st.posts.length - 1; i >= 0; i--) {
        var p = st.posts[i]; if (p.at <= t - P.window_min) break;
        if (!kindId || p.type === kindId) n++;
      }
      return n;
    }
    function capAt(t) { return (+P.per_window.max || 5) + (t < st.bigUntil ? (+P.big.extra || 0) : 0); }
    /* THE GLASS HAS ITS OWN CLOCK. On the map an in-game hour passes in 2 to 5 real seconds of
       travel (measured, 10/26), so a pace written only in game minutes would be a wall on a
       phone. When the game hands over its real clock (opts.realNow) a post also waits
       pace.real_gap_s real seconds after the last one, while the clock runs live; a long jump
       (a sleep, a march) still fills its hours at once, the way a feed fills overnight. */
    var LIVE = false;
    function realOk() {
      if (!LIVE || !opts.realNow || !P.real_gap_s) return true;
      return opts.realNow() - st.realAt >= P.real_gap_s * 1000;
    }
    function roomAt(t, isReply) {
      if (!realOk()) return false;
      if (t - st.lastAt < (isReply ? P.reply_gap_min : P.min_gap_min)) return false;
      return countSince(t) < capAt(t);
    }
    function kindRoom(k, t) {
      if (k.cooldown_min && st.kindAt[k.id] != null && t - st.kindAt[k.id] < k.cooldown_min) return false;
      return countSince(t, k.id) < k.max_per_window;
    }

    /* WHO MAY POST IT. An entry is an account id, 'tag:<tag>' (any account with
       the tag), 'faction' (the account of the event's faction), 'town' (an account
       of the event's town, else any local), or 'same' (a follow-up's own author). */
    function pickAccount(who, data, author, words) {
      var pool = [], seen = {}, pref = [];
      function add(id, mine) {
        var a = F.accounts[id];
        if (!a || seen[id]) return;
        seen[id] = 1;
        if (words && !words.some(function (w) { return feBy(w, a); })) return;
        pool.push(a);
        if (mine) pref.push(a);
      }
      who.forEach(function (w) {
        w = String(w);
        if (w === 'same') { if (author) add(author); return; }
        if (w.indexOf('tag:') === 0) {
          var tag = w.slice(4);
          F.order.forEach(function (id) { if (feList(F.accounts[id].tags).indexOf(tag) >= 0) add(id); });
          return;
        }
        /* 'faction' is the event's faction's page; 'town' and 'toward' are the PEOPLE of that
           place (a page speaks for its crew, a local speaks for the street) */
        if (w === 'faction' || w === 'town' || w === 'toward') {
          var key = data[w], field = (w === 'toward') ? 'town' : w;
          if (key == null) return;
          key = String(key).toLowerCase();
          F.order.forEach(function (id) {
            var a = F.accounts[id], v = a[field];
            if (v == null || String(v).toLowerCase() !== key) return;
            if (w !== 'faction' && a.kind === 'faction') return;
            add(id, true);
          });
          return;
        }
        add(w);
      });
      if (!pool.length) return null;
      /* the mouth from the place the event happened speaks first, most of the time */
      if (pref.length && r() < 0.65) pool = pref;
      /* not the same mouth twice running, when there is a choice */
      var last = st.posts.length ? st.posts[st.posts.length - 1].account : null;
      var fresh = pool.filter(function (a) { return a.id !== last; });
      var from = fresh.length ? fresh : pool;
      return from[Math.floor(r() * from.length)];
    }
    function handleOf(a) {
      if (!a) return '';
      var h = (a.acts && a.acts[String(ctx.act | 0)]) || a.handle || ('@' + a.id);
      return feFill(h, { company: ctx.company }) || h;
    }

    function render(k, data, all, author) {
      /* the variants this mouth may say, by their index in the row (the rotation's memory) */
      var idx = [];
      for (var j = 0; j < all.length; j++) if (feBy(all[j], author)) idx.push(j);
      var n = idx.length, tried = 0;
      if (!n) return null;
      var lastV = st.lastVariant[k.id] || [];
      var start = Math.floor(r() * n), prev = st.posts.length ? st.posts[st.posts.length - 1].text : null;
      var fallback = null;
      for (var i = 0; i < n; i++) {
        var vi = idx[(start + i) % n];
        var txt = feFill(all[vi].text, data);
        if (txt == null) continue;
        tried++;
        if (n > 1 && lastV.indexOf(vi) >= 0) { if (!fallback) fallback = { vi: vi, txt: txt }; continue; }
        if (st.recent.indexOf(txt) >= 0) { if (!fallback && txt !== prev) fallback = { vi: vi, txt: txt }; continue; }
        return { vi: vi, txt: txt };
      }
      return (fallback && fallback.txt !== prev) ? fallback : null;
    }

    function publish(item, t) {
      var k = item.spec;
      var data = item.data;
      /* a mouth with at least one line of its own in this row */
      var author = pickAccount(item.who, data, item.author, item.words);
      if (!author) return null;
      var d = merge(data, { handle: handleOf(author) });
      if (item.parent) d.parent_handle = item.parent.handle;
      var got = render(k, d, item.words, author);
      if (!got) return null;
      var text = got.txt;
      if (say && author.kind !== 'bot') {
        try {
          text = say({ key: author.id, lang: author.lang || null, player: author.kind === 'company' },
                     text, item.kindId + '|' + got.vi) || text;
          /* the dial capitalises; a feed that is written in lowercase stays lowercase */
          if (/^[a-z]/.test(got.txt))
            text = text.replace(/^([A-Za-z\u00C0-\u00FF]+[.,!] )?([A-Za-z\u00C0-\u00FF])/, function (m, op, c) {
              return (op ? op.toLowerCase() : '') + c.toLowerCase();
            });
        } catch (_e) {}
      }
      st.seq++;
      var c = clockData(t);
      var post = { id: 'f' + st.seq, at: t, day: c.day, hh: c.hh,
                   kind: k.source || item.source, type: item.kindId, account: author.id,
                   handle: handleOf(author), face: author.face || '', text: text,
                   reply_to: item.parent ? item.parent.id : null, teaches: item.teaches || '',
                   draft: true };
      st.posts.push(post);
      if (st.posts.length > P.keep) st.posts.splice(0, st.posts.length - P.keep);
      st.recent.push(got.txt);
      if (st.recent.length > P.no_repeat) st.recent.splice(0, st.recent.length - P.no_repeat);
      var lv = st.lastVariant[item.kindId] = (st.lastVariant[item.kindId] || []);
      lv.push(got.vi); var hold = Math.min(2, item.words.length - 1);
      while (lv.length > hold) lv.shift();
      st.kindAt[item.kindId] = t;
      st.lastAt = t;
      if (opts.realNow) st.realAt = opts.realNow();
      if (item.big) st.bigUntil = Math.max(st.bigUntil, t + (+P.big.for_min || 0));
      if (item.top) {           /* the answers a real feed gives a post: replies, then a follow-up */
        var rc = item.big ? P.big_reply_chance : P.reply_chance;
        feList(k.replies).forEach(function (rs, ri) {
          var ch = rs.chance == null ? rc : +rs.chance;
          if (r() >= ch) return;
          queueItem({ kindId: item.kindId + '.reply' + ri, spec: k, source: k.source,
                      who: feList(rs.who || ['tag:local']), words: feWords(rs.words),
                      data: d, due: t + Math.max(1, feSpan(r, rs.delay_min || [3, 25])),
                      must: false, expire: (rs.expire_min || P.expire_min), parent: post,
                      author: author.id, teaches: '', big: false, top: false });
        });
        feList(k.follow_up).forEach(function (fs, fi) {
          var ch = fs.chance == null ? (item.big ? 1 : 0.25) : +fs.chance;
          if (r() >= ch) return;
          queueItem({ kindId: item.kindId + '.follow' + fi, spec: k, source: k.source,
                      who: feList(fs.who || ['same']), words: feWords(fs.words),
                      data: d, due: t + Math.max(10, feSpan(r, fs.after_min || [60, 180])),
                      must: false, expire: (fs.expire_min || P.expire_min * 2), parent: post,
                      author: author.id, teaches: '', big: false, top: false });
        });
      }
      for (var i = 0; i < ears.length; i++) { try { ears[i](post); } catch (_e) {} }
      return post;
    }

    function queueItem(it) {
      if (!it.words || !it.words.length) return;
      it.expiresAt = it.due + (it.expire == null ? P.expire_min : it.expire);
      st.queue.push(it);
    }

    /* SOMETHING HAPPENED: every row whose trigger it is and whose conditions hold
       schedules its post. A deed (must) always schedules; anything else may be
       skipped by its own chance or its own limit, because not every event is a post
       (WORDS Q15 rule 6). */
    function fire(trigger, data) {
      var rows = F.byTrigger[String(trigger)] || [];
      if (!rows.length) return 0;
      var t = st.now == null ? 0 : st.now;
      var d = titled(merge(base(t), data || {}));
      var n = 0;
      rows.forEach(function (k) {
        if (!feWhen(k.when, d)) return;
        if (!k.must && k.chance < 1 && r() >= k.chance) return;
        /* the same town, the same man, the same crew: once inside its window */
        if (k.again_key && k.again_after_min) {
          var ak = k.id + '|' + String(d[k.again_key]);
          if (st.again[ak] != null && t - st.again[ak] < k.again_after_min) return;
          st.again[ak] = t;
        }
        queueItem({ kindId: k.id, spec: k, source: k.source, who: k.who, words: k.words, data: d,
                    due: t + feSpan(r, k.delay_min), must: k.must, expire: k.expire_min,
                    parent: null, author: null, teaches: k.teaches, big: k.big, top: true });
        n++;
      });
      return n;
    }

    function quietFill(t) {
      var d = titled(base(t));
      var rows = (F.byTrigger.quiet || []).filter(function (k) { return feWhen(k.when, d) && kindRoom(k, t); });
      if (!rows.length) return null;
      /* the row that spoke least lately goes first, so the quiet hours do not loop */
      rows.sort(function (a, b) { return (st.kindAt[a.id] == null ? -1e9 : st.kindAt[a.id]) - (st.kindAt[b.id] == null ? -1e9 : st.kindAt[b.id]); });
      var pick = rows[Math.floor(r() * Math.min(3, rows.length))];
      return publish({ kindId: pick.id, spec: pick, source: pick.source, who: pick.who, words: pick.words,
                       data: d, parent: null, author: null, teaches: pick.teaches, big: pick.big, top: true }, t);
    }

    /* ONE MINUTE OF THE GAME'S CLOCK. */
    function step(t, live) {
      var c = clockData(t);
      if (st.hourSeen !== null && c.hour !== st.hourSeen) fire('clock.hour', { hour: c.hour });
      if (st.daySeen !== null && c.day !== st.daySeen) fire('clock.day', { day: c.day });
      st.hourSeen = c.hour; st.daySeen = c.day;
      if (st.nextQuiet == null) st.nextQuiet = t + feSpan(r, P.quiet_after_min);
      /* due items, deeds first, oldest first */
      st.queue.sort(function (a, b) { return (b.must - a.must) || (a.due - b.due); });
      var posted = false;
      for (var i = 0; i < st.queue.length; i++) {
        var it = st.queue[i];
        if (it.due > t) continue;
        if (!it.must && t > it.expiresAt) { st.queue.splice(i--, 1); continue; }
        if (!roomAt(t, !!it.parent)) break;
        if (it.top && !kindRoom(it.spec, t)) {
          if (it.must) continue;             /* a deed waits for its row's room */
          st.queue.splice(i--, 1); continue;
        }
        st.queue.splice(i--, 1);
        if (publish(it, t)) { posted = true; break; }   /* one post a minute at most: never a wall */
      }
      if (posted) { st.nextQuiet = t + feSpan(r, P.quiet_after_min); return; }
      if (t >= st.nextQuiet && roomAt(t, false) && !st.queue.some(function (q) { return q.due <= t; })) {
        quietFill(t);
        st.nextQuiet = t + feSpan(r, P.quiet_after_min);
      }
    }

    /* THE GAME'S CLOCK MOVED TO minuteNow (absolute game minutes). A pause is a tick
       that did not move: nothing posts. A jump replays its minutes (at most a day). */
    function tick(minuteNow, c) {
      if (c) set(c);
      var now = Math.floor(+minuteNow);
      if (!(now === now)) return 0;
      if (st.now == null || now < st.now) { st.now = now; st.hourSeen = null; st.daySeen = null; step(now, true); return 0; }
      var from = st.now, n0 = st.seq;
      if (now - from > FE_STEP_CAP) from = now - FE_STEP_CAP;
      LIVE = (now - from) <= P.live_jump_min;
      for (var t = from + 1; t <= now; t++) { st.now = t; step(t, LIVE); }
      LIVE = false;
      st.now = now;
      return st.seq - n0;
    }

    /* WATCH: hand over a value every tick; the engine speaks only when it moves.
       A number fires <name>.up / <name>.down {now, was, delta}; a map of numbers
       fires the same per key with {key}; a map of words fires <name>.changed
       {key, now, was}. The first look is a silent baseline. */
    function watch(name, value, extra) {
      if (value == null) return 0;
      var was = st.seen[name], n = 0;
      st.seen[name] = (typeof value === 'object') ? JSON.parse(JSON.stringify(value)) : value;
      if (was === undefined) return 0;
      function one(key, a, b) {
        var ev = merge(extra || {}, key == null ? {} : { key: key });
        if (typeof b === 'number' && typeof a === 'number') {
          if (a === b) return;
          n += fire(name + (b > a ? '.up' : '.down'), merge(ev, { now: b, was: a, delta: Math.abs(b - a) }));
        } else if (a !== b && b != null) {
          n += fire(name + '.changed', merge(ev, { now: b, was: a == null ? '' : a }));
        }
      }
      if (typeof value === 'object') {
        for (var k in value) if (Object.prototype.hasOwnProperty.call(value, k)) one(k, was ? was[k] : undefined, value[k]);
      } else one(null, was, value);
      return n;
    }

    function set(c) { if (c) for (var k in c) if (Object.prototype.hasOwnProperty.call(c, k) && c[k] !== undefined) ctx[k] = c[k]; }

    /* THE ONE FUNCTION THE PHONE READS. Newest first. {limit, account, kind, since} */
    function read(q) {
      q = q || {};
      var out = [];
      for (var i = st.posts.length - 1; i >= 0 && out.length < (q.limit || P.keep); i--) {
        var p = st.posts[i];
        if (q.account && p.account !== q.account) continue;
        if (q.kind && p.kind !== q.kind) continue;
        if (q.since != null && p.at <= q.since) break;
        var o = merge(p, {});
        var a = F.accounts[p.account];
        if (a && a.kind === 'company') o.handle = handleOf(a);   /* his page follows his rename */
        out.push(o);
      }
      return out;
    }
    function on(fn) { if (typeof fn === 'function') ears.push(fn); return function () { var i = ears.indexOf(fn); if (i >= 0) ears.splice(i, 1); }; }

    function save() {
      return { v: 1, seq: st.seq, now: st.now, posts: st.posts, kindAt: st.kindAt, lastVariant: st.lastVariant,
               recent: st.recent, bigUntil: st.bigUntil, lastAt: st.lastAt, nextQuiet: st.nextQuiet, seen: st.seen,
               hourSeen: st.hourSeen, daySeen: st.daySeen, again: st.again,
               queue: st.queue.map(function (q) {
                 return { kindId: q.kindId, data: q.data, due: q.due, must: q.must, expire: q.expire,
                          who: q.who, words: q.words, parent: q.parent ? { id: q.parent.id, handle: q.parent.handle } : null,
                          author: q.author, big: q.big, top: q.top, teaches: q.teaches };
               }) };
    }
    function load(s) {
      if (!s || s.v !== 1) return false;
      ['seq', 'now', 'posts', 'kindAt', 'lastVariant', 'recent', 'bigUntil', 'lastAt', 'nextQuiet', 'seen', 'hourSeen', 'daySeen', 'again']
        .forEach(function (k) { if (s[k] !== undefined) st[k] = s[k]; });
      st.queue = feList(s.queue).map(function (q) {
        var root = String(q.kindId).split('.')[0], spec = F.byId[root];
        if (!spec) return null;
        q.spec = spec; q.source = spec.source;
        q.expiresAt = q.due + (q.expire == null ? P.expire_min : q.expire);
        return q;
      }).filter(Boolean);
      return true;
    }
    function stats() {
      var by = { mine: 0, world: 0, life: 0 };
      st.posts.forEach(function (p) { by[p.kind] = (by[p.kind] || 0) + 1; });
      return { posts: st.seq, kept: st.posts.length, queued: st.queue.length, by: by, now: st.now, bigUntil: st.bigUntil };
    }

    return { fire: fire, tick: tick, watch: watch, set: set, read: read, on: on, save: save, load: load,
             stats: stats, kinds: function () { return F.kinds.map(function (k) { return k.id; }); },
             accounts: function () { return F.order.slice(); }, pace: P, file: F };
  }

  var API = { MAX_PER_DRAIN: MAX_PER_DRAIN, LIFE_EVERY: LIFE_EVERY,
              make: make, drain: drain, shape: shape,
              deeds: deeds, world: world, life: life, seed: seed,
              engine: engine, when: feWhen, fill: feFill };
  if (HASREQ) module.exports = API;
  root.BohemiaFeedStream = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
