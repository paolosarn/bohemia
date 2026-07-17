# BOHEMIA — DOOR ANIMATION BANK: integration (7/13/26)
File: BOHEMIA_DOOR_ANIM_BANK_7_13_26.txt
Format: {clips: {name: {style, fp, frames:[b64 x9]}}, frames_per_clip:9}

## Engine consumption (render contract layer 5)
- Door entity holds clipName + state (closed|opening|open|closing) + frame.
- 120 BPM LAW: open/close spans 2 beats; scheduler advances frame on
  half-beat subdivisions (9 frames -> 4 per beat + landing frame).
- COLLISION: passable when frame >= 5; blocks light while frame < 5
  (feeds lighting flood-fill re-run on state change).
- Interact verb 'open' from the requirements matrix triggers toggle; sfx
  hook 'door_metal' fires on frames 1 and 8.
- Factory scales to the other 35 confirmed doors after Paolo validates
  motion on these two (verdicts tune header/edge ratios per style).
