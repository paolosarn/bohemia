// BOHEMIA CLOUT, HOW LOUD A THING WAS, AND THE ONE PLACE THAT SAYS SO
// (8/21/26, PEOPLE lane. Extracted, not authored: every number below is Paolo's
//  7/21 ruling, moved, not changed.)
//
// ===== WHY THIS FILE EXISTS, AND IT IS NOT A NEW IDEA =====
// bohemia_deeds.js refuses to run without this table and says why, in an error
// string it throws on purpose:
//
//     "bohemia_deeds needs BohemiaLoop for CLOUT_WEIGHTS; there is no second
//      copy of that table on purpose"
//
// MEASURED 8/21: THERE WERE FOUR COPIES.
//     engine/bohemia_loop.js                  (the canonical one)
//     slices/BOHEMIA_HOW_LOUD_8_6_26.html     retyped into a stub BohemiaLoop
//     slices/BOHEMIA_CURRENT_SLICE.html       retyped
//     slices/BOHEMIA_RUN_CURRENT.html         retyped
//
// They all hold the same numbers today, so nothing is broken this minute. That is
// exactly what makes it dangerous: the 7/21 ruling says in as many words that the
// ORDERING is locked canon and THE EXACT NUMBERS STAY TUNABLE, so the day he
// retunes them, three surfaces keep the old ones and nobody finds out. A drift
// that is invisible until the moment somebody exercises the thing it governs is
// the class of rot the truth hierarchy exists to kill.
//
// AND THE COPIES WERE NOT LAZINESS. bohemia_loop.js is 75 KB and throws at load
// without bohemia_engine, bohemia_scheduler, bohemia_world, bohemia_bq,
// bohemia_quest_runtime and the faction graph. Anybody who wanted four numbers had
// to choose between dragging in most of the engine or retyping the row. Three
// surfaces made the same reasonable choice. THE FIX IS NOT TO SCOLD THE COPIES, IT
// IS TO MAKE THE ORIGINAL REACHABLE: this file has NO dependencies at all, so
// there is no longer a reason to retype it anywhere.
//
// ===== WHAT IS HIS, AND WHAT IS MERELY MOVED =====
// The tags, the weights, the neutral, and the locked ordering are all his 7/21
// ruling, copied verbatim out of bohemia_loop.js. Nothing here is tuned, renamed
// or reinterpreted. bohemia_loop.js still exports CLOUT_TAGS / CLOUT_WEIGHTS /
// cloutWeight / cloutTagFrom exactly as before, so every existing caller is
// untouched; it now reads them from here instead of declaring them.
//
// REUSE CHECK (REUSE-FIRST, Paolo 7/22): cooks nothing and opens no bank. This is
// a MOVE of an existing table, and the gate asserts the moved values are
// identical to the ones bohemia_loop.js used to declare.
(function (root) {
  'use strict';
  var HASREQ = (typeof module !== 'undefined' && module.exports);

  /* HIS SCALE, 7/21. A quest's completing @STAGE line carries ONE of these to
     classify its own outcome. The ORDERING (reckless > risky > notable > quiet)
     is locked canon; the exact numbers stay tunable, which is the whole reason
     there may only ever be one copy of them. */
  var CLOUT_TAGS = ['quiet', 'notable', 'risky', 'reckless'];
  var CLOUT_WEIGHTS = { quiet: 8, notable: 25, risky: 55, reckless: 110 };
  var CLOUT_NEUTRAL = 15;   // untagged stage: a mild default (below 'notable')

  function cloutWeight(tag) {
    return CLOUT_WEIGHTS.hasOwnProperty(tag) ? CLOUT_WEIGHTS[tag] : CLOUT_NEUTRAL;
  }

  /* pick the one clout tag off a raw #hashtag list (first vocabulary hit; a stage
     should only carry one, which is an authoring discipline, not enforced here). */
  function cloutTagFrom(tags) {
    tags = tags || [];
    for (var i = 0; i < CLOUT_TAGS.length; i++)
      if (tags.indexOf(CLOUT_TAGS[i]) >= 0) return CLOUT_TAGS[i];
    return null;
  }

  var API = { CLOUT_TAGS: CLOUT_TAGS, CLOUT_WEIGHTS: CLOUT_WEIGHTS,
              CLOUT_NEUTRAL: CLOUT_NEUTRAL,
              cloutWeight: cloutWeight, cloutTagFrom: cloutTagFrom };
  if (HASREQ) module.exports = API;
  if (typeof root !== 'undefined') root.BohemiaClout = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
