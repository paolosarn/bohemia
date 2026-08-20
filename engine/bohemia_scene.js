// BOHEMIA SCENE — the scripted-scene runtime (8/9/26, PEOPLE lane, backlog 0sc)
//
// Paolo 8/9: "the scripted-scene runtime whose first consumer is the Act 1 cold
// open (family defense, the locked 7/19 shape), and dialogue playing clean
// through the one contextual verb so the family can speak."
//
// THE METHOD IS BETHESDA'S, AND THE GDD ALREADY ROUTED IT (v4, backlog 0sc):
// condition met -> scene (camera move, actors posed via the rig, dialogue through
// the runtime this lane already owns). v4's own note: "cutscenes cost almost
// nothing once the rig is locked". The rig is locked and the dialogue player
// exists, so THIS IS ASSEMBLY, NOT INVENTION.
//
// WHAT THIS OWNS AND WHAT IT REFUSES TO OWN
//   OWNS      the ORDER of beats, when a beat is finished, and what the surface
//             is being asked to do this beat.
//   REFUSES   rendering, and words. It never draws a pixel: it reports a beat and
//             the surface obeys, which is why one scene can play identically on
//             the walked world, on the run slice, and headless in a gate.
//             CONTENTS-PAOLO'S: no scene ships inside this file, and no line of
//             dialogue is invented here.
//
// DIALOGUE IS NOT REIMPLEMENTED (REUSE-FIRST). A `say` beat drives
// engine/bohemia_quest_runtime.js (BQRuntime) - the same node-graph player the
// run has used since 7/26, with speaker/says/noverbs/options/silences. Opening a
// second dialogue system would be the exact duplication this repo paid for twice
// in one week.
//
// 120 BPM LAW: every duration is in BEATS, never milliseconds. A scene that
// counts wall-clock would drift out of step with a game that quantizes to
// BEAT=0.5s, and would play differently on a slow phone.
//
// DETERMINISTIC: the same scene stepped twice produces the same beats in the same
// order. No wall clock, no Math.random - a scene the gate can play is a scene
// that plays the same for Paolo.
//
// I-MOVE-YOU-MOVE, AND THE ONE HONEST EXCEPTION. The world advances on the
// player's action. A scripted scene is the declared exception - it advances on
// its own beats - which is why `playerLocked` is reported on every beat: the
// surface must be able to say truthfully whether the player has control. A scene
// that seizes control without saying so is how a game feels broken.
(function (root) {

  var BEAT_MS = 500;                      // 120 BPM LAW. Stated once, never typed again.

  /* ---- THE BEAT KINDS ------------------------------------------------------
     Deliberately few. Every one of these is needed by the locked 7/19 opening;
     none was added speculatively. A kind the opening does not need is a kind
     nobody has asked for yet.
       set     establish place + time + mood (the surface decides how to show it)
       actor   put a named body somewhere, in a pose
       say     a line, played through BQRuntime (never invented here)
       cut     the MATCH-CUT: same framing, different world. The 7/19 open turns
               on this one beat, so it is a first-class kind rather than a
               fade plus a hope.
       camera  frame/move
       wait    hold, in beats
       handoff leave the scene for another system (combat), and come back
       end     the scene is over and control returns
     ------------------------------------------------------------------------ */
  var KINDS = ['set', 'actor', 'say', 'cut', 'camera', 'wait', 'handoff', 'end'];

  function isBeat(b) {
    return !!b && typeof b === 'object' && KINDS.indexOf(b.kind) >= 0;
  }

  /* A scene is DATA: {id, title, cites, beats[]}.
     `cites` is not decoration. A scene is an authored piece of Paolo's canon, so
     it must name the ruling it was built from, the way a canon quest must cite
     the questbook. A scene with no citation is somebody's invention. */
  function validate(scene) {
    var errs = [];
    if (!scene || typeof scene !== 'object') return ['scene is not an object'];
    if (!scene.id) errs.push('scene has no id');
    if (!scene.cites) errs.push('scene ' + (scene.id || '?') + ' cites no ruling - ' +
      'every scene is authored from Paolo canon and must name it');
    if (!Array.isArray(scene.beats) || !scene.beats.length) errs.push('scene has no beats');
    (scene.beats || []).forEach(function (b, i) {
      if (!isBeat(b)) { errs.push('beat ' + i + ' has no legal kind (' + (b && b.kind) + ')'); return; }
      if (b.kind === 'wait' && !(b.beats > 0)) errs.push('beat ' + i + ' waits for no beats');
      if (b.kind === 'say' && !b.speaker) errs.push('beat ' + i + ' says something with no speaker');
      /* THE WORDS ARE HIS. A say beat may carry a line id to look up, or a text
         that came from a ruling - but an EMPTY say is legal and expected while
         his words are unwritten. It is not legal to fill it in here. */
    });
    if ((scene.beats || []).length && scene.beats[scene.beats.length - 1].kind !== 'end')
      errs.push('scene does not end with an `end` beat - control would never return');
    return errs;
  }

  /* ---- THE PLAYER ----------------------------------------------------------
     Steppable, headless, and it renders nothing. step() returns the beat the
     surface should be showing, plus whether the player has control. */
  function Scene(scene, opts) {
    if (!(this instanceof Scene)) return new Scene(scene, opts);
    opts = opts || {};
    var errs = validate(scene);
    if (errs.length) throw new Error('SCENE ' + (scene && scene.id) + ' is illegal: ' + errs.join('; '));
    this.scene = scene;
    this.i = 0;                 // which beat
    this.held = 0;              // beats spent holding on this beat
    this.done = false;
    this.log = [];              // every beat entered, in order - the gate reads this
    /* the dialogue player, injected rather than required, so this module has no
       hard dependency and a gate can drive it with the real BQRuntime. */
    this.bq = opts.bq || (root.BQRuntime || null);
    /* HOW LONG A LINE HOLDS IS A POLICY, NOT A NUMBER IN THE SCENE FILE.
       Paolo 8/12: "understanding how long voices should play compared to how
       long their text shit is." Every say beat used to carry a hand-typed
       `beats: 2`, so a six-word line and a twelve-word line held for exactly
       one second each and the voice ran past both. Injecting the policy keeps
       this module owning ORDER only -- it still knows nothing about reading
       speed, and a scene file never has to be re-timed by hand again.
       engine/bohemia_stage.js supplies the real one (subtitle reading speed,
       quantized up to the beat). */
    this.time = opts.time || null;
    /* WHICH SIBLING WAS LOST. The 7/19 ruling ties it to the player's gender, so
       the SURFACE knows it and this module is told. Defaulting to 'sister' is not
       a decision about his story -- it is the male-player case his own ruling
       spells out first, and it only decides which drafted name prints when a
       caller has not said. */
    /* role -> the name to print. Supplied by whoever knows the player, because
       WHICH sibling was lost is a fact about the save and not about the scene.
       Empty is legal: a token then prints as itself, visibly, instead of
       vanishing. */
    this.names = opts.names || {};
    this.dialogue = null;
  }

  /* ---- THE FAMILY'S NAMES, AND WHY THE SCENE DOES NOT OWN THEM ------------
     Paolo's 7/19 ruling, locked: "the surviving sibling is the SAME GENDER as
     the player. Male player -> older brother survives (sister dies); female
     player -> older sister survives (brother dies)."

     So the sibling who dies on night one is the OPPOSITE gender to the player,
     and a line that says their name out loud cannot be one string. A scene
     writes a TOKEN and the caller supplies the name:

         text:  "{sibling_lost}. Green ones too. We do this every night."
         Scene(scene, { names: { sibling_lost: 'NINA' } })

     *** AND THE NAMES COME FROM FAMILY_CAST, WHICH ALREADY EXISTED. *** The
     first cut of this put the drafted names in the scene file itself, and that
     was a SECOND source of truth for a string this repo already had: the family
     has been named since the cast shipped (RAY, DENISE, MARCO, NINA, all
     draft:true, all in tools/bohemia_family_cast_patch.py, with survivesIf
     carrying the same gender flip). Two places holding one name is not a
     redundancy, it is a guarantee that the day he renames her in one of them the
     other keeps saying the old name. Caught by SCREENSHOTTING THE SCENE and
     reading the speaker label: the mother came back as DENISE, from a table this
     module had never heard of.

     An unknown token is left ALONE rather than blanked, because a visible
     {sibling_lost} on screen is a bug anyone can see and a silently deleted name
     is one nobody can. */
  function fillNames(text, names) {
    if (!text || text.indexOf('{') < 0) return text;
    names = names || {};
    return String(text).replace(/\{([a-z_]+)\}/g, function (m, role) {
      var n = names[role];
      return (n == null || n === '') ? m : n;
    });
  }

  /* WHAT THE SURFACE SHOULD PRINT for this beat, names resolved. Read this
     rather than beat.text: beat.text is the authored line WITH its tokens, and
     printing it raw is how {sibling_lost} reaches a player's screen. */
  Scene.prototype.lineOf = function (b) {
    return b && b.kind === 'say' ? fillNames(b.text, this.names) : null;
  };

  Scene.prototype.current = function () {
    return this.done ? null : (this.scene.beats[this.i] || null);
  };

  /* how many beats this beat holds for. Everything is beat-quantized. */
  Scene.prototype._hold = function (b) {
    if (!b) return 0;
    if (b.kind === 'wait') return b.beats | 0;
    if (b.kind === 'say' && this.time) {
      var n = this.time(b) | 0;
      if (n > 0) return n;
    }
    if (typeof b.beats === 'number') return b.beats | 0;
    return 0;                    // instantaneous beats resolve the turn they enter
  };

  /* the player has control ONLY when nothing is playing. Reported, never assumed. */
  Scene.prototype.playerLocked = function () {
    return !this.done;
  };

  /* ONE STEP = ONE BEAT OF THE 120 BPM CLOCK. */
  Scene.prototype.step = function () {
    if (this.done) return { done: true, beat: null, playerLocked: false };
    var b = this.scene.beats[this.i];
    if (!b) { this.done = true; return { done: true, beat: null, playerLocked: false }; }

    if (this.held === 0) {
      this.log.push({ i: this.i, kind: b.kind, id: b.id || null, speaker: b.speaker || null });
      /* a say beat opens the REAL dialogue runtime if one was supplied and the
         beat names a conversation. No conversation named = a silent beat, which
         is legal and is what an unwritten line looks like. */
      /* OPENING A CONVERSATION IS THREE CALLS, NOT ONE, and the first version of
         this got it wrong: start() alone sets a STAGE and leaves you on no node,
         so view() answers {ended:true, says:[]} and the beat plays silent. That
         is the worst possible failure here - a dialogue beat that swallows its
         own line looks exactly like a line Paolo has not written yet.
         The real sequence, the same one the run has used since 7/26:
             new Runtime(Q).start(stage)  ->  .available()  ->  .begin(nodeId)
         Proved on quests/bq/S02: speaker red_boss, "Batteries. Real ones,
         charged, not the swollen junk...", three options including a silence. */
      if (b.kind === 'say' && b.bq && this.bq && this.bq.Runtime) {
        try {
          var rt = new this.bq.Runtime(b.bq, null, b.shared || {}).start(b.stage);
          var open = rt.available ? rt.available() : [];
          var pick = b.node || open[0];
          if (pick && rt.begin) rt.begin(pick);
          /* a say beat that names a conversation and opens NOTHING is a broken
             beat, not a silent one. Say so rather than playing quietly. */
          this.dialogue = (rt.view && !rt.view().ended) ? rt : null;
          if (!this.dialogue) this.log.push({ i: this.i, kind: 'say', id: b.id || null, opened: false });
        } catch (e) { this.dialogue = null; }
      }
      if (b.kind === 'end') { this.done = true; return { done: true, beat: b, playerLocked: false }; }
    }

    var need = this._hold(b);
    var out = {
      done: false, beat: b, playerLocked: true,
      held: this.held, needs: need,
      /* the line WITH its names filled in, alongside the authored beat. The
         surface prints `line`; `beat.text` stays exactly as he wrote it so the
         WORDS tab shows him the token he can edit rather than one resolution
         of it. */
      line: this.lineOf(b),
      dialogue: this.dialogue ? this.dialogue.view() : null,
    };
    if (this.held >= need) { this.i++; this.held = 0; }
    else this.held++;
    return out;
  };

  /* play the whole thing headless. cap is a guard, not a schedule. */
  Scene.prototype.playAll = function (cap) {
    var n = 0, last = null;
    cap = cap || 4000;
    while (!this.done && n++ < cap) last = this.step();
    return { done: this.done, steps: n, last: last, log: this.log };
  };

  /* wall-clock is DERIVED from beats, for a surface that needs milliseconds.
     The scene never stores one. */
  function beatsToMs(beats) { return (beats | 0) * BEAT_MS; }
  function sceneBeats(scene) {
    return (scene.beats || []).reduce(function (n, b) {
      return n + (b.kind === 'wait' ? (b.beats | 0) : (typeof b.beats === 'number' ? b.beats | 0 : 0)) + 1;
    }, 0);
  }

  var API = {
    BEAT_MS: BEAT_MS, KINDS: KINDS, Scene: Scene, validate: validate,
    beatsToMs: beatsToMs, sceneBeats: sceneBeats, VERSION: 'scene-1.1.0',
    fillNames: fillNames,
    /* SCENES SHIP EMPTY FROM THE ENGINE (contents-Paolo's). The cold open lives
       in records/ as authored canon and is loaded by the surface, so this file
       can never quietly become a place where somebody invents his story. */
    SCENES: {},
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  root.BohemiaScene = API;
})(typeof window !== 'undefined' ? window : globalThis);
