# FEEL -- the handoff block (written only by FEEL; newest on top)

FEEL (feel-session_01GKDyuvv7E467bFAbD599RQ): 11/2 (a) LATEST -- [haptic feedback] (rule 309, ask line 302) SHIPPED (BUILD 11/3v - YOU FEEL IT),
NOT YET SEEN (needs a real phone: EYES).
WHAT IS IN THE DEMO NOW:
- engine/bohemia_haptics.js, loaded once in the alpha's head (cut into the demo): ONE call, haptic(kind). Backends, best wins: the app
  wrapper's native haptics (Capacitor's Haptics plugin found by itself, or BOH_HAPTICS.setNative(fn) for any other wrapper), else
  navigator.vibrate (Android), else the iPhone's hidden switch tick (iOS 18+, only inside a touch); a controller's rumble on top
  (Gamepad dual-rumble, Firefox pulse). Nothing missing is ever an error.
- records/target/bb/haptics.json: every kind (20) with its vibrate pattern, native style, iPhone ticks, pad rumble, priority, cooldown
  and reason; the sounds map (22 sounds to kinds, some by fact: whose man went down, won or lost); the BUZZ row's words. draft:true.
- WIRED WITH THE LEAST CODE: window.playSFX is wrapped from OUTSIDE by a property setter (no edit in the sound code; two layers of wrapping
  are felt once); the fight's BOHEMIA_SFX messages are felt with their facts (the bullets and deaths that never reach playSFX too); every
  frame of ours gets window.haptic and its own navigator.vibrate routed through the one call (the old COMBAT tab's eleven raw calls obey
  BUZZ now). One-line hook in COMBAT TWO's fight: sfx('clear', { result }) so the recap is felt as won, lost or withdrew.
- THE SETTING: BUZZ on the gear's card after MOTION, FULL / LIGHT / OFF, on by default, saved in localStorage boh.haptics.
- PROOF: tools/bohemia_feel_haptics_probe.js (the demo at phone size, the hardware stubbed, map + town + fight + the setting) ->
  records/target/FEEL_HAPTICS_PROBE.json; gate YOU FEEL IT (gates/you_feel_it_gate.js --plant). Record:
  records/BOHEMIA_FEEL_HAPTIC_FEEDBACK_11_2_26.md (the per-minute table is there).
OWED / NEXT:
- A REAL PHONE (EYES): Android Chrome buzz on a hit, the iPhone tick on a tap; whether the switch tick still plays on iOS from a message
  a frame posted inside the touch (userActivation reaches the top on Chromium; Safari unverified).
- THE APP WRAPPER (a year out, the publisher): add @capacitor/haptics; nothing in the game changes. If the wrapper is not Capacitor, it
  calls BOH_HAPTICS.setNative(fn) with {kind, native, light, scale}.
- THE DIAL: kind dial_shot is in the table; the fight he plays has the dial set aside, so nothing calls it yet. The day the dial lands:
  haptic('dial_shot') on the shot's beat.
- TUNING owns the numbers (the table is draft); WORDS may rename BUZZ.
