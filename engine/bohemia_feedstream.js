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

  var API = { MAX_PER_DRAIN: MAX_PER_DRAIN, LIFE_EVERY: LIFE_EVERY,
              make: make, drain: drain, shape: shape,
              deeds: deeds, world: world, life: life, seed: seed };
  if (HASREQ) module.exports = API;
  root.BohemiaFeedStream = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
