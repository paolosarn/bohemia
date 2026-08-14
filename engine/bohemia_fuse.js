// BOHEMIA FUSED CONSEQUENCES — not everything waits for you. (8/11/26, WORLD lane.)
//
// LOCKED 7/1: laws/BOHEMIA_ADDENDUM_CAMERA_TIMESTEP_FUSED_7_1_26.md sec 4.
//
//   "Most of the world is I-move-you-move (waits for you). But some events are PLANTED with
//    a fuse: you set something in motion (e.g. kill a leader, cut a deal) and it fires on a
//    delay regardless of what you do... Ties directly to the SUCCESSION system: you tear a
//    hole, the power struggle to fill it has a fuse, and it resolves on its own timeline."
//
// THE WARNING WINDOW IS THE WHOLE DESIGN, and it is his call, locked:
//
//   "a fused consequence is NOT a silent gut-punch and NOT a locked cutscene. As the fuse
//    burns down the game WARNS you: 'hey, you're gonna wanna pull up soon.' You get a window
//    of turns to zoom in and reach it. Make it in time, you can act on it / intervene /
//    change the outcome. Too slow, or too buried in the big-picture view to catch the
//    signal, it resolves without you and you live with it. Skill = attention + position +
//    speed."
//
// So there are exactly three ways a fuse can end and the player earns which one:
//     INTERVENED        you got there in time and acted
//     RESOLVED_WITHOUT   it fired while you were elsewhere, and you live with it
//     CANCELLED          the thing it was about stopped existing
// A fourth outcome -- a fuse that quietly disappears -- is the bug this file exists to make
// impossible. Every planted event ends in exactly one of those, and `orphans()` proves it.
//
// WHY IT IS NOT A CUTSCENE AND NOT A GUT-PUNCH, in his own framing: a locked cutscene takes
// agency away, and a silent resolution teaches the player nothing. The warning respects
// I-MOVE-YOU-MOVE -- the signal gives you TURNS, and the event fires on its fuse if you do
// not spend them getting there. The lesson underneath, never preached (sec 2 of the same
// addendum): move in big steps and you fast-forward past the fine grain. Missing a fuse is
// not the world cheating; it is you having chosen to be somewhere else.
//
// MECHANISM-MINE / CONTENTS-PAOLO'S: nothing here knows what any consequence IS. No event
// list, no outcomes, no text. A host plants {id, fireTurn, lead} and reads back what
// happened; what a struggle or a deal DOES when it lands is faction canon.
//
// HIS TWO OPEN FORKS FROM THE SAME ADDENDUM ARE NOT DECIDED HERE:
//   WARNING_SPECIFICITY -- does the warning tell you WHAT it is ("the east deal's going
//     bad", strategic, you choose what is worth interrupting for) or only THAT something is
//     coming (a direction and a pull, no detail until you arrive, tense and creepy)? He
//     calls it a TONE call. Null = the minimal honest signal: something is coming, and
//     where. The detail is withheld rather than invented.
//   REACHED_IS_PLAYABLE -- once you reach it in time, is it fully playable (fight,
//     intervene) or a shortened beat you nudge? His recorded leaning is playable, and a
//     leaning is not a ruling. Null = the fuse reports INTERVENED and hands the host the
//     moment; it does not decide how much of it you get to play.
(function (root) {
  var HASREQ = (typeof module !== 'undefined' && module.exports && typeof require !== 'undefined');
  var NO_RULING = 'NO_RULING';

  var WARNING_SPECIFICITY = null;   // [PENDING Paolo, fork: tone call]
  var REACHED_IS_PLAYABLE = null;   // [PENDING Paolo, fork: leaning playable]

  var LIT = 'LIT', WARNED = 'WARNED', REACHED = 'REACHED';
  var INTERVENED = 'INTERVENED', RESOLVED_WITHOUT = 'RESOLVED_WITHOUT', CANCELLED = 'CANCELLED';
  var TERMINAL = { INTERVENED: 1, RESOLVED_WITHOUT: 1, CANCELLED: 1 };

  function create(opts) {
    opts = opts || {};
    return { turn: opts.turn || 0, fuses: {}, log: [] };
  }

  /* PLANT ONE. fireTurn is when it goes off no matter where you are; lead is how many turns
     of warning you get before that. A lead of zero would be the silent gut-punch he ruled
     out, so it is floored at one -- the player is always owed at least one turn to react. */
  function plant(state, ev) {
    if (!ev || !ev.id) return { applied: false, reason: 'NO_ID' };
    if (state.fuses[ev.id]) return { applied: false, reason: 'ALREADY_LIT' };
    var fire = ev.fireTurn == null ? state.turn + 2 : ev.fireTurn;
    /* THE WARNING HAS TO BE IN THE FUTURE OR IT IS NOT A WARNING. A caller can ask for more
       lead than the fuse actually has -- a succession struggle that settles in two days with
       a three-turn lead would "warn" a turn before it was planted, which the player can never
       act on and which reads as the silent gut-punch he ruled out. So the lead is clamped to
       the window that exists, and never below one: he is always owed at least one turn. */
    var want = Math.max(1, ev.lead == null ? 2 : ev.lead);
    var lead = Math.max(1, Math.min(want, fire - state.turn));
    var f = {
      id: ev.id, fire: fire, lead: lead, status: LIT,
      at: ev.at || null,                 // where the player has to get to, if anywhere
      about: ev.about || null,           // opaque to this file; the host's business
      warnedOn: null, reachedOn: null, endedOn: null, outcome: null
    };
    state.fuses[ev.id] = f;
    state.log.push({ turn: state.turn, id: ev.id, event: 'planted', fire: fire, lead: lead });
    return { applied: true, fire: fire, warnsOn: fire - lead };
  }

  /* THE SIGNAL. Deliberately thin: something is coming, and where. WHAT it is stays behind
     his unruled fork rather than being invented, and the fork is named in the payload so a
     host cannot mistake the silence for a decision. */
  function signal(f) {
    var out = { id: f.id, turnsLeft: null, at: f.at };
    if (WARNING_SPECIFICITY === 'named') { out.about = f.about; return out; }
    out.detail = NO_RULING;
    out.fork = 'WARNING_SPECIFICITY';
    out.aboutFork = 'whether the warning names WHAT is coming or only THAT something is, is '
                  + "Paolo's tone call (camera/timestep addendum, OPEN FORKS)";
    return out;
  }

  /* ADVANCE THE CLOCK. Everything that crosses its warning line warns; everything that
     crosses its fire turn resolves, whether or not the player is anywhere near. This is the
     LOD forward-compute: a scheduled tick that fires at turn N regardless. */
  function tick(state, toTurn) {
    var turn = Math.max(state.turn, toTurn == null ? state.turn : toTurn);
    var out = [];
    for (var id in state.fuses) {
      if (!Object.prototype.hasOwnProperty.call(state.fuses, id)) continue;
      var f = state.fuses[id];
      if (TERMINAL[f.status]) continue;
      if (f.status === LIT && turn >= f.fire - f.lead && turn < f.fire) {
        f.status = WARNED; f.warnedOn = turn;
        var s = signal(f); s.turnsLeft = f.fire - turn;
        state.log.push({ turn: turn, id: id, event: 'warned' });
        out.push({ kind: 'warning', signal: s });
      }
      if (turn >= f.fire) {
        // it fires on its fuse. Being there is the only thing that changes the ending.
        var reached = f.status === REACHED;
        f.status = reached ? INTERVENED : RESOLVED_WITHOUT;
        f.endedOn = turn;
        f.outcome = f.status;
        state.log.push({ turn: turn, id: id, event: 'fired', outcome: f.status });
        var res = { kind: 'fired', id: id, outcome: f.status, at: f.at };
        if (reached) {
          /* HOW MUCH OF IT YOU GET TO PLAY IS HIS OTHER FORK. The moment is handed back,
             not staged: this file will not decide between a full fight and a nudge. */
          res.playable = NO_RULING;
          res.fork = 'REACHED_IS_PLAYABLE';
        }
        out.push(res);
      }
    }
    state.turn = turn;
    return out;
  }

  /* YOU GOT THERE. Only counts before it fires -- that is the whole skill expression:
     attention to catch the signal, position and speed to arrive inside the window. */
  function reach(state, id) {
    var f = state.fuses[id];
    if (!f) return { applied: false, reason: 'NO_FUSE' };
    if (TERMINAL[f.status]) return { applied: false, reason: 'TOO_LATE', outcome: f.outcome };
    if (state.turn >= f.fire) return { applied: false, reason: 'TOO_LATE' };
    f.status = REACHED; f.reachedOn = state.turn;
    state.log.push({ turn: state.turn, id: id, event: 'reached' });
    return { applied: true, turnsToSpare: f.fire - state.turn };
  }

  /* The thing it was about stopped existing. A legitimate ending, and it must be explicit:
     a fuse that is simply deleted is the disappearing-event bug. */
  function cancel(state, id, why) {
    var f = state.fuses[id];
    if (!f || TERMINAL[f.status]) return { applied: false };
    f.status = CANCELLED; f.outcome = CANCELLED; f.endedOn = state.turn;
    state.log.push({ turn: state.turn, id: id, event: 'cancelled', why: why || null });
    return { applied: true };
  }

  /* THE PROOF THAT NOTHING VANISHES. Any fuse whose fire turn has passed and which is not
     in a terminal state is an event the world forgot -- exactly the silent-disappearance
     failure the warning-window design exists to prevent. Always empty after a tick. */
  function orphans(state) {
    var bad = [];
    for (var id in state.fuses) {
      if (!Object.prototype.hasOwnProperty.call(state.fuses, id)) continue;
      var f = state.fuses[id];
      if (!TERMINAL[f.status] && state.turn >= f.fire) bad.push(id);
    }
    return bad;
  }

  /* THE TIE TO SUCCESSION, which is the reason both systems exist (7/1: "you tear a hole,
     the power struggle to fill it has a fuse"). Plants a fuse for a contested seat using
     the struggle's OWN resolve day, so the warning and the reveal ride the same clock the
     succession module already computed. It reads that module; it does not reimplement it. */
  function plantForSeat(state, succState, roleId, lead) {
    var s = succState && succState.seats && succState.seats[roleId];
    if (!s || s.fuse == null) return { applied: false, reason: 'NOT_CONTESTED' };
    return plant(state, { id: 'seat:' + roleId, fireTurn: s.fuse, lead: lead == null ? 3 : lead,
                          about: 'a power struggle resolves', at: null });
  }

  function pending() {
    return [
      { key: 'WARNING_SPECIFICITY', value: WARNING_SPECIFICITY,
        about: 'does the warning name WHAT is coming, or only THAT something is? A tone '
             + 'call (camera/timestep addendum, OPEN FORKS). Minimal signal until ruled.' },
      { key: 'REACHED_IS_PLAYABLE', value: REACHED_IS_PLAYABLE,
        about: 'reaching it in time: fully playable, or a shortened beat you nudge? His '
             + 'leaning is playable, and a leaning is not a ruling.' }
    ];
  }

  var API = {
    LIT: LIT, WARNED: WARNED, REACHED: REACHED,
    INTERVENED: INTERVENED, RESOLVED_WITHOUT: RESOLVED_WITHOUT, CANCELLED: CANCELLED,
    NO_RULING: NO_RULING,
    WARNING_SPECIFICITY: WARNING_SPECIFICITY, REACHED_IS_PLAYABLE: REACHED_IS_PLAYABLE,
    create: create, plant: plant, tick: tick, reach: reach, cancel: cancel,
    orphans: orphans, plantForSeat: plantForSeat, pending: pending
  };
  if (HASREQ) module.exports = API;
  root.BohemiaFuse = API;
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
