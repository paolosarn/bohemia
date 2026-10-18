# A FACE THAT REMEMBERS WHAT YOU DID
FACTIONS lane, row [faces meet again] (second half of [a house you give a fuck about], rule 80c). 10/10/26. MODE: BUILD. Nothing in the alpha changed.

## Measured first (rule 12)
- The settlement screen already has the shape: KEEPERS[k].who is a key, S.faces[who] is a face the game hands over on `needFace`, and with no face it draws a dim head, never a blank box. So the join is a KEY: my face ids ('face-house-steward', ...) are `who` keys.
- A bug of mine, found again: my first memory bands (unknown, wary, friendly) were not the game's. The real bands are the nine of relations.json. Fixed: three tones (cold 0 to 39, neutral 40 to 59, warm 60 to 100) cover the nine exactly once, and the gate proves it.
- No portrait exists for any of the four; PORTRAIT's lane. So nothing may speak yet (the law: text comes from a mouth with a portrait).

## Built
- factions.json: per faction a draft line per tone (`lines`, ours, Spanglish for the crews and the keeper, plain for the House), the voice equals the neutral line, a beast has no words and names a sound owed to SOUNDS.
- bohemia_factions.js: toneOf, memoryLine (band to tone to line), scene(id, band): {speaks, say, unspoken, why}. Until a portrait id is in the slot the scene answers PORTRAIT_OWED and keeps the line UNSPOKEN; the day one lands the same call speaks. A beast answers NO_WORDS_A_SOUND.
- factions gate 214 to 346 checks; red 43 ways (the 33 before plus 11 data and 8 engine mutations for this part; none silent).
- VOTE: A FACE THAT REMEMBERS: four factions, three states each (wronged 20, neutral 50, kept their roads 80), the lines shown as unspoken beside the dim head and the face slot.

## Better than Battle Brothers (rule 80)
BB's houses are a flag. Ours are one man you meet again, who says a different thing when you have wronged or helped them.

## Routed
- PORTRAIT: four face slots to fill (face-house-steward, face-brigands-boss, face-dead-keeper, face-beast-ground).
- RUN TWO: the board's keeper and the bar's keeper call F.scene(factionId, R.band(score)) and print `say` only when `speaks`; wire the id into KEEPERS as `who`.
- WORDS: the lines are drafts; Spanglish check done by regex only.
- SOUNDS: the beast's growl.
- Next rows written (rule 74): [wants send parties], [more banners], [take a town].
