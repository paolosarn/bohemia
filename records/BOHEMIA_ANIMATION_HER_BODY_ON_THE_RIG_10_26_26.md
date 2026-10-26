# [a few women at the post] HER BODY ON THE RIG (ANIMATION, rules 203(a) and 214, 10/26/26)

PAOLO 10/25 and 10/26, LOCKED: "I know Battle Brothers is only men... I'm willing to give a chance to women" and "make it 4
percent... for the women". The ruling (203(a)): each a whole person, her own body on the rig, face, voice and runway clothes,
never a renamed man. The coordinator's NOTE on this board: her body on the rig (her proportions, walk, idle, melee, shield and
two-hand keys, the town's activities too), from the same rig and the same scale law; RUN THREE's roll waits on her body.

## MEASURED FIRST
- No woman's body anywhere. The valley's 152 rolled people (RUN TWO's roll, CHARACTER's builder on DIRECTION's master rig):
  71 marked a man, 81 unset, every one a man's body; RUN THREE's roll at 4 percent played at 0.
- CHARACTER's person builder shapes the rig's man by four dials only (height, shoulders, belly, hips), and the barber writes the
  real height the rig scales to off the model's top, so the height dial never reached the picture: every person stands 1.72 to
  1.77 m whatever his dials.

## WHAT WAS BUILT
THE SOURCE, KEPT (rule 128): records/target/animation/BOHEMIA_HER_BODY.json. THE TOOL: tools/bohemia_animation_her_body.py.
- HER BODY is the same rig, skeleton and 57 px a metre as every man's (THE GROUND MAY ZOOM, THE PERSON MAY NOT), her band's
  own dials moved by hers: a tenth narrower at the shoulders, wider at the seat, a waist, and 0.93 of his height (about 1.62 m
  against 1.75: her real height is the barber's times her height dial, written into her build record). Two things the four
  dials cannot make, added to CHARACTER's own build() in memory (its file never written; a man builds byte for byte as before):
  a BUST, the torso's front pushed out over two soft bumps (the low-poly torso has 13 vertices a 5 cm ring, so it is a
  suggestion the clothes are lifted over), and a WAIST. Every garment is the body's own skin lifted, so her clothes take her
  shape with no garment changed. The first try (a 2.6 cm bust) read flat in profile under a tee; 4.2 cm reads.
- HER WALK on her model's own walk (every lane's tool reads 'Anim_0'): at every key the walk has, her hips list toward the
  swinging leg and turn with the forward leg, her chest counter-turns so she faces where she walks, her ankles land 2.2 cm
  nearer the midline (the idles' two-bone reach, knees forward, each foot keeping its turn), her arms swing closer.
- HER FACE: the barber's own face shapes that are not a man's (no lantern jaw, no broad square, no heavy brow), the jaw and
  chin softened two steps, the brows a step finer, no beard, no stubble; her mouth the rust ramp at her skin's own step and
  two steps narrower (the house mouth, a dark bar, read as a moustache on her: caught on the first close-up); her hair the
  barber's long cuts (the first try let a fifth of them be short: woman_0's half shave read as a young man at the fight's
  pixels, so her cuts are long).
- FOUR WOMEN in the valley's roll, after every man (no man's draw moved), persons of the place (gang Body: no band, so a band of
  enemies never deals her above the post's share), each her own cut, face, skin and clothes off the place's wardrobe:
  woman_0 (a long drop, a burn on her cheek, a white tee and denim cutoffs), woman_1 (a coil crown, a gold shirt under a grass
  wrap coat), woman_2 (box braids, a teal striped tee under a leather half apron), woman_3 (a layered fall, a steel hoodie
  under a brick car coat).
- THE ONE HOOK IN RUN TWO's tool (its build-one): a person whose roll says 'f' is built through dress() and finish(), so every
  lane that builds her again (the idles, the work, the town's activities, the shield arm) builds HER, never a man in her
  name. Two lines more there: the people mix reads her 'f' from the roll, and the fight's board takes the women after every
  man (the post may hire her).
- HER PACKS: RUN TWO's own fight_pack() and walk_sheets() and the idles' people_pack(), run on her alone in memory. Run whole in
  a container that does not hold every person's renders (they are gitignored), they would have dropped every rolled man from
  the fight's sheet index, its face strip and the bands' pools, and the map's people.

## WHERE SHE STANDS
- LIVE 10/26: the four women in the roll and the people mix as 'f', on the fight's board (the post deals her at his 4 percent:
  RUN THREE's gate reads 407 of 10,000 hires women, each her body and a woman's name), her fight sheet (packed by RUN's packer),
  her face in the fight's strip and on the card, her stills, her walk sheet, her map sheet (slices/rig_mix/town_5, baked on her
  alone: no man's map sheet baked again), her idles (bare, gun-held, and on the map: merged into the map's people file beside
  everybody's, 231 entries to 239, nobody's changed).
- CAUGHT ON THE WAY: her idles' pack is the idles' people_pack run on her alone, its source read and patched in memory; I had
  edited the idles' tool (three lines at its head) while her renders ran, so the running process read the new file at the old
  line numbers and refused (its own guard). And the guard saved more: she is on a map sheet now, so the patched pack would have
  written the map's people file with the women alone; it merges into it now.
- RENDERING: her town activities (the same six, her body), then her pistol-in-one-hand and cover keys, then her melee keys
  (the same skeleton: the men's queue renders her). HER BODY gate 8/1 until her town activities land (M1), then into the suite.

## GATE
HER BODY (gates/her_body_gate.py, in the suite): S the source; R the roll (after every man, 'f', no beard); B her body in the
pixels of her stills against the place's men standing in the same frame (0.90 to 0.965 as tall in all eight facings) and her
build record saying she was built as her (her shoulders and seat are 2 to 4 px under the clothes' own noise, measured: the
men's shoulder-to-hip runs 0.64 to 0.89, so the record, not the pixels, carries them); W her walk: facing the glass, her feet
land nearer the line she walks on than the place's men's (under 0.9 of theirs; measured men 8.3 to 10.8 px, median 10.1, hers
8.2; her height alone would make 0.93); M where the screens read her (the mix as 'f' on the board, her fight sheet, face,
walk sheet, idles, town activities). Mutations: a man handed in as her; a man's walk. RUN THREE's own gate (a few women at
the post) moved to its 'she exists' state the same push: 10,000 rolled hires come out at his share, each a woman's body and a
woman's name.

## NOT MINE, NOTED ON THEIR BOARDS
- Her voice in the barks: SOUNDS. Her HD portrait (the talking head): PORTRAIT (her face here is her own model's head, as
  every rolled person's). Her clothes on the runway: COOK THREE and CHARACTER (she wears the place's wardrobe, fitted to her).
- On the map his party marker draws his company off RUN TWO's map sheets (slices/rig_mix): she is on none, RUN's map.

## REFERENCE CHECK
The compare law's twin: a man of the same place built the same way, side by side at the street's pixels (her preview beside
person_town_0). Analog horror AH-01. No reference game (Battle Brothers hires men only; the study names no women).
