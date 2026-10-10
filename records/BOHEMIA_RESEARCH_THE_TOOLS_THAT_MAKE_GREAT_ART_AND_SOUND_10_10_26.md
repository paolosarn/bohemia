# THE TOOLS THAT MAKE GREAT ART AND SOUND: WHAT TO INSTALL AND WHAT TO BUY (10/10/26)

## HIS QUESTION (verbatim)
"I need you to find out how awesome high-quality people that vibe code. What tools what are they download? What things do I have to buy? What reels [tools] need to get installed in my repo that make great art and great sounds bro because all this time all these months, it's just been failing me so I'm gonna probably need some outside help that can get implemented into our system."

## THE SHORT ANSWER
The good small teams do not draw pixels in code and do not build sounds out of noise formulas. They buy packs (you already did, 87 of them), they feed those packs as reference images into a pixel-art model that was trained only on pixel art, and they clean the result in Aseprite. For sound they start from real recordings (there are free libraries with thousands of them) or a text-to-sound model, then run the file through a tape or reverb effect to get the look they want. Every one of these tools has an API key or a command line, so a Claude chat can call it from a script with no human in the loop. The one thing we did wrong: we treated "make the art" as a programming problem, and the fix is to make our scripts drive real art tools instead of drawing rectangles.

## A. PIXEL ART: THE TOOLS

**PixelLab** (https://www.pixellab.ai) is built for our case: characters in 4 and 8 directions, skeleton animation, square and isometric tiles, Wang tilesets, and an official MCP server for Claude Code (`claude mcp add pixellab https://api.pixellab.ai/mcp -t http -H "Authorization: Bearer KEY"`, https://www.pixellab.ai/vibe-coding). API prices on its page (https://www.pixellab.ai/pixellab-api): 8 rotations $0.03 to $0.04 per character, skeleton animation about $0.014, a tile about $0.08. The web plan is reported near $12 a month for 2,000 generations; https://www.pixellab.ai/pricing is the authority. Commercial use allowed; training other models on its output is not. The catch: outputs are not ours until palette-locked and cleaned to the packs.

**Retro Diffusion** (https://retrodiffusion.ai, by Astropulse) is the strongest pure pixel-art model. The API (https://github.com/Retro-Diffusion/api-examples) runs on a prepaid dollar balance: RD Fast about $0.03 an image, RD Plus $0.06, RD Pro $0.18, a Wang tileset $0.10, animations $0.07 to $0.25. What matters to us: up to 9 REFERENCE IMAGES on RD Pro (our pack tiles), an `input_palette` that locks colours, image-to-image with a strength knob, 8-direction rotate, a Pixel Fixer, and a free `check_cost` dry run. New accounts get 50 free credits; top-ups from $5. An MCP server exists (https://glama.ai/mcp/servers/Retro-Diffusion/retro-diffusion-mcp) and a $65 one-time Aseprite extension generates locally with no credits (https://astropulse.itch.io/retrodiffusion; no animation locally). The catch: draft on Fast, finish on Pro, or $0.18 adds up.

**Scenario** (https://help.scenario.com/articles/4276871610-pricing-plans) trains a custom model ON YOUR OWN PACKS. Starter $15 a month (API keys), Pro $45 (custom training). The catch: not pixel-native, so output needs a pixel-grid pass.

**Layer.ai** (https://layer.ai): from $10 a month for 300 Creative Units, custom training on your art. **Leonardo.ai**: "Elements" LoRA on your images, from $12 a month; free tier non-commercial. **Ludo.ai**: $20 a month, API and MCP, no custom training (https://ludo.ai/compare/best-ai-pixel-art-generators). The catch: none is pixel-native.

**Open-source local (FLUX or SDXL plus a pixel LoRA in ComfyUI).** The most-cited LoRA, nerijs/pixel-art-xl (https://huggingface.co/nerijs/pixel-art-xl), has a disputed licence; a thread says the author asks a fee for commercial use (https://huggingface.co/nerijs/pixel-art-xl/discussions/7). A newer FLUX.2 pixel LoRA exists (https://huggingface.co/Limbicnation/pixel-art-lora). A rented GPU is $0.27 to $0.69 an hour on RunPod (https://www.memetik.ai/guides/runpod-pricing); fal.ai runs a FLUX LoRA at $0.035 per megapixel (https://fal.ai/models/fal-ai/flux-lora/image-to-image). No ready FLUX tileset workflow was found. The catch: a week of setup for what the two above sell for pennies.

**Palette lock and pixel grid (free, local).** `pixelize` (Go, MIT, https://github.com/noelruault/pixelize) snaps any image to a palette file; `MakeItPixel` (https://github.com/MiguelMJ/MakeItPixel) adds dithering and batch. Tilesetter is free with a $12.99 tier (https://www.tilesetter.org); Sprite Fusion's map editor is free (https://www.spritefusion.com); Pyxel Edit $9; LibreSprite and Tiled free (not re-confirmed here).

**Aseprite** ($19.99 one-time, Steam key included, https://dacap.itch.io/aseprite; compiling from source for your own use is allowed). Real headless mode: `aseprite -b file.aseprite --script x.lua --sheet out.png --data out.json` (https://www.aseprite.org/docs/cli/), plus a Lua API that loops files, sets palettes, exports per layer or tag. Two MCP servers drive it: MalloyTheDev/aseprite-mcp (MIT, 156 tools, Python 3.10 and uv, `ASEPRITE_PATH`, https://github.com/MalloyTheDev/aseprite-mcp) and brunosr3003/mcp-aseprite (https://glama.ai/mcp/servers/brunosr3003/mcp-aseprite). The catch: each call is a separate headless run; state lives in the .aseprite file.

## B. SOUND: THE TOOLS

**ElevenLabs Sound Effects API** (https://elevenlabs.io/pricing/api): text in, WAV out; the official page lists sound effects at $0.12 per minute of audio, music about $0.15 a minute, billed in dollars. Plans: Free, Starter $6, Creator $22, Pro $99 a month; free-plan audio is non-commercial. The catch: Eleven Music's self-serve terms exclude games (https://elevenlabs.io/eleven-music-model-specific-terms); games need Enterprise. Sound effects on a paid plan are fine.

**Stable Audio Open 1.0 and Open Small** (https://huggingface.co/stabilityai/stable-audio-open-1.0): open weights, runs on a GPU or in ComfyUI, 47 seconds of effects or ambience per prompt, free for commercial use under $1M a year revenue (Stability Community License). Hosted **Stable Audio 2.5** is $0.20 a generation (https://platform.stability.ai/pricing, https://fal.ai/models/fal-ai/stable-audio-25/text-to-audio). **Meta AudioCraft (MusicGen, AudioGen)** runs free but its weights are CC-BY-NC (https://github.com/facebookresearch/audiocraft): not for a game we sell.

**Suno and Udio**: Suno has no public API as of mid-2026 (https://gptproto.com/blog/suno-api); commercial rights only on Pro $10 or Premier $30 a month; Udio's API is unverified. **Mubert API** from $49 a month, in-game music under its platform licence (https://mubert.com/api/use-cases/developers). **Soundraw**: Creator $11.04 a month; no API found.

**Real recordings.** Sonniss GDC Game Audio Bundles (https://gdc.sonniss.com): the 2026 bundle is 7.47 GB, 347 WAVs, royalty-free, commercial, no attribution; earlier years still posted. Freesound (https://freesound.org): per-sound CC0, CC-BY (credit) or CC-BY-NC (not for us). BBC Sound Effects: 33,000 sounds, RemArc, NON-commercial, paid licence available (https://musictech.com/news/music/the-bbc-sound-effects-archive-over-33000-free-samples/). Boom Library: single libraries from about $65 perpetual, BOOM ONE $495 to $3,495 (https://www.boomlibrary.com/sound-effects/boom-one/). Soundly Pro about $14.99 a month with AI search (https://getsoundly.com). A Sound Effect: not found.

**sfxr family (free).** jsfxr on npm (https://www.npmjs.com/package/jsfxr), bfxr2-cli writes WAVs from JSON (https://github.com/osiriswd/bfxr2-cli), ChipTone with CC0 output (https://sfbgames.itch.io/chiptone). Honest line: these ARE noise recipes, better tuned; good for a coin or a click, never for a Las Vegas wind.

**The analog horror layer (free, offline).** Chow Tape Model, GPLv3, VST3/LV2/CLAP on Linux, real tape hysteresis plus wow and flutter (https://www.musehub.com/plugin/chow-tape-model). Spotify's **Pedalboard** (`pip install pedalboard`, https://github.com/spotify/pedalboard) loads VST3 on Linux and has Convolution, Distortion and Reverb built in, so one Python script batches every WAV through tape and a real room. OpenAIR impulse responses are Creative Commons per file (https://www.openair.hosted.york.ac.uk/); the site was reported suspended this month, mirrors at https://github.com/Graphi07/room-impulse-responses.

## C. WHAT THE GOOD SMALL TEAMS DO
- They buy packs first and treat them as the bar; LimeZu's packs are CC-BY, credit required, no resale (https://limezu.itch.io/moderninteriors). Rule 82a already says this.
- They generate variants with a pixel-native model fed REFERENCE IMAGES from those packs, never a bare text prompt (Retro Diffusion's 9-reference mode, https://github.com/Retro-Diffusion/api-examples).
- They run the model from inside the coding agent: PixelLab's MCP is advertised for Claude Code (https://www.pixellab.ai/vibe-coding); itch.io lists 130 pixel-art tools built with AI code (https://itch.io/tools/ai-code/tag-pixel-art).
- They do a human cleanup pass in Aseprite; a 2026 guide says for small sprites cleanup takes longer than generation (https://gamedevaihub.com/best-ai-pixel-art-generators-for-2d-indie-games/).
- They commission a real artist for the hero pieces: a basic tileset is $10 to $35 on Fiverr (https://www.fiverr.com/gigs/tileset); $3 to $5 per 32 px tile, $5 to $10 per 64 px tile; a full game tileset lands in the thousands (https://2dwillneverdie.com/blog/how-much-do-sprites-cost/).
- They never synthesise ambience; they layer Sonniss and Freesound recordings.
- They respect no-training clauses: Sonniss forbids AI training on its sounds, PixelLab on its outputs; LimeZu is silent, so references are safe and a fine-tune is a question for LimeZu.
- They keep a licence line next to every shipped asset.

## D. HOW IT WIRES INTO OUR REPO

| tool | API / CLI / MCP | the .env key | the one-line install | agent alone |
|---|---|---|---|---|
| PixelLab | REST + MCP | `PIXELLAB_TOKEN` | `claude mcp add pixellab https://api.pixellab.ai/mcp -t http -H "Authorization: Bearer $PIXELLAB_TOKEN"` | yes |
| Retro Diffusion | REST + MCP | `RD_API_KEY` (header `X-RD-Token`) | `pip install requests` then POST `https://api.retrodiffusion.ai/v2/inferences` | yes |
| Scenario | REST | `SCENARIO_API_KEY` | `pip install requests` (REST, Starter plan up) | yes |
| Aseprite | CLI + Lua + MCP | `ASEPRITE_PATH` | `claude mcp add aseprite -- uv --directory aseprite-mcp run aseprite-mcp` | yes |
| pixelize | CLI | none | `go install github.com/noelruault/pixelize@latest` | yes |
| fal.ai FLUX LoRA | REST | `FAL_KEY` | `pip install fal-client` | yes |
| ElevenLabs SFX | REST | `ELEVENLABS_API_KEY` | `pip install elevenlabs` | yes |
| Stable Audio Open | local Python | none (HF token to download) | `pip install stable-audio-tools` | yes, needs GPU |
| Stability API 2.5 | REST | `STABILITY_API_KEY` | `pip install requests` | yes |
| Sonniss / Freesound | download | `FREESOUND_API_KEY` (Freesound has an API) | `curl` the bundle parts into `audio/library/` | yes |
| bfxr2-cli | CLI | none | `git clone https://github.com/osiriswd/bfxr2-cli && npm install` | yes |
| Pedalboard + Chow Tape | Python + VST3 | none | `pip install pedalboard` plus the Chow Tape VST3 | yes |
| Suno / Udio / a human artist | none | n/a | n/a | no |

## THE THREE TIERS

**1. FREE TODAY (install this hour, no purchase)**
- Retro Diffusion's 50 free credits and PixelLab's free trial, both by MCP (https://retrodiffusion.ai, https://www.pixellab.ai/vibe-coding). Fixes: tiles, props, a first 8-direction character.
- pixelize + MakeItPixel (https://github.com/noelruault/pixelize). Fixes: the "AI slop" look; everything snaps to the pack palette.
- Sonniss GDC bundles, all years, plus Freesound CC0 (https://gdc.sonniss.com, https://freesound.org). Fixes: ambience, hits, the city.
- Stable Audio Open 1.0 on a GPU (https://huggingface.co/stabilityai/stable-audio-open-1.0). Fixes: sounds no library has.
- Pedalboard + Chow Tape Model + OpenAIR mirrors (https://github.com/spotify/pedalboard). Fixes: the analog horror layer, offline, in batch.
- bfxr2-cli for UI clicks only (https://github.com/osiriswd/bfxr2-cli).

**2. UNDER 100 DOLLARS A MONTH (the sweet spot)**
- Aseprite, $19.99 one-time (https://dacap.itch.io/aseprite). Fixes: cleanup, sheets, palettes, headless exports.
- Retro Diffusion prepaid, about $30 a month at our volume (RD Pro $0.18 an image, tilesets $0.10). Fixes: tiles, props, cars, house skins that match the packs.
- PixelLab, about $12 a month or API pennies (https://www.pixellab.ai/pricing). Fixes: 8-direction characters, walk and attack animation, Wang tilesets.
- ElevenLabs Starter $6 or Creator $22 (https://elevenlabs.io/pricing/api). Fixes: hits, foley, voice barks; not the game's music.
- Scenario Pro $45 only if we want a model trained on the packs (https://help.scenario.com/articles/4276871610-pricing-plans). Total $65 to $100 a month.

**3. THE SERIOUS KIT (if he wants the best)**
- Tier 2 plus Retro Diffusion's $65 Aseprite extension for unlimited local drafts (https://astropulse.itch.io/retrodiffusion).
- One commissioned artist pass on the hero set, $500 to $2,000 for the main house tiles and five lead characters at the per-tile rates above (https://www.fiverr.com/gigs/tileset). Fixes: the look is OURS and the models copy it from then on.
- Two or three Boom Library single libraries at about $65 each for wind, metal, crowds (https://www.boomlibrary.com/sound-effects/boom-one/); Soundly Pro about $14.99 a month to search them.
- Mubert API $49 a month for in-game music (https://mubert.com/api/use-cases/developers), or a composer. One-time about $700 to $2,300; monthly about $150.

## THE LICENCE LINES
- PixelLab outputs: commercial yes; no training other models on them.
- Retro Diffusion outputs: commercial yes on a paid balance; confirm current terms on the site.
- Scenario, Layer, Leonardo (paid): commercial yes; Leonardo free tier non-commercial.
- nerijs/pixel-art-xl: licence disputed; do not ship from it.
- Stable Audio Open: commercial yes under $1M a year revenue.
- MusicGen / AudioGen weights: CC-BY-NC, not for a sold game.
- ElevenLabs: sound effects commercial on paid plans; music for games needs Enterprise.
- Sonniss GDC: royalty-free, commercial, no credit, unlimited projects; no AI training, no resale.
- Freesound: per file; CC0 and CC-BY ship (CC-BY needs a credit line), CC-BY-NC does not.
- BBC RemArc: non-commercial; buy a licence or skip.
- Boom Library: perpetual per library for games; a developer licence only if we resell sounds.
- Chow Tape Model: GPLv3 plugin; rendering audio through it is fine.
- OpenAIR: Creative Commons per impulse response, credit openairlib.net where asked.
- LimeZu and similar packs: CC-BY or custom, credit required, no resale, silent on AI training.
- Suno Pro/Premier: commercial on downloaded songs during the paid term; no API.

## WHAT CHANGES FOR THE CHATS
- The cooks stop drawing pixels in Python and JavaScript. Every new tile, prop, car and house skin comes from Retro Diffusion or PixelLab with pack tiles as the references and the pack palette locked, snapped by pixelize, then checked against its twin (rule 82).
- DIRECTION owns the reference sets: one folder of 9 pack tiles per asset kind (ground, kerb, wall, roof, car, prop) that every generation call must cite, as the pack gate cites a bank.
- CHARACTER and ANIMATION move 8-direction bodies and walk cycles to PixelLab's rotate and skeleton endpoints, cleaned in Aseprite headless; rig code stitches, never draws.
- SOUNDS stops synthesising noise. Every hit, step, wind and machine starts from a Sonniss or Freesound CC0 recording or an ElevenLabs effect, is rendered through Pedalboard with Chow Tape and a real impulse response, and ships as a WAV with a licence line. sfxr for UI clicks only.
- PLUMBER adds the keys to .env.example, a gate that refuses any new art or sound file without a source line (model, references, licence), and the MCPs in the repo's Claude config so any chat can call them alone.

## FOR PAOLO, IN PLAIN WORDS
The good small teams never draw art in code and never fake sounds with math. They buy packs like you did, feed them to a pixel-art model as the example to copy, clean it up in a $20 program, and pull sounds from free libraries of real recordings. Every tool here has a key a chat can use by itself, so the fix is a few keys and a few scripts, not months. The first thing I would buy is Aseprite for $19.99 and about $30 of Retro Diffusion credit, because that pair turns your 87 packs into unlimited matching tiles this week.
