# WHY RETRO DIFFUSION, AND WHAT THE RESEARCH MISSED (coordinator, 10/11, answering Paolo's challenge)

Paolo 10/11, verbatim (voice-to-text): "OK and why was retro diffusion the best option did you just suck at doing online research and you couldn't find any other options like"

A fair challenge. This page is the honest readback: what the field was, why it shrank, where the research was good, and the one place it was not.

## 1. What shrank the field: his own four constraints, not a lack of options

Rule 108 as he amended it: ONE-TIME OR FREE, NO GRAPHICS CARD ON HIS COMPUTER, NO MONTHLY, NO OUTSIDE CREDITS (then one approved exception, a prepaid balance that is only spent after his YES on a free card).

Every picture an AI makes is made on a graphics card somewhere. There are only three places that card can be:

- HIS computer: ruled out by him (he does not want a graphics card on his machine). This kills every free local option (Stable Diffusion with a pixel-art LoRA, the Retro Diffusion Aseprite extension at $65 once, ComfyUI pipelines, Pixel Art Diffusion on Hugging Face run locally).
- A VENDOR'S computer, paid per picture: that is "outside credits," which he banned, then allowed ONCE as a prepaid balance.
- A VENDOR'S computer, paid monthly: banned.

So the honest field for "a machine makes the picture" is: tools with a prepaid, no-subscription, pay-per-picture balance that produce real pixel art on a real pixel grid. That field is two names, not twenty. The fourth road, a human artist paid once, stays open and is in the research (hero set $800 to $2,500, slowest, best consistency).

## 2. What was checked and why it lost (the whole list, so he can see it was looked at)

| Tool | Billing | Why out under rule 108 |
|---|---|---|
| PixelLab web app | $12 to $50 a month, credits expire | monthly |
| Scenario | $15 a month and up, $45 for custom training | monthly |
| SpriteLab, Sprixen, Sprite Fusion ($9 to $49/mo, credits do not roll over), Sprite AI ($8/mo), Ludo | monthly credit plans | monthly |
| Midjourney, OpenAI image models, Leonardo | monthly or per call | not pixel-native: soft pixels that need downscaling and lose the grid; palette cannot be locked to the packs |
| Stable Diffusion + pixel LoRA, ComfyUI, Hugging Face local | free | needs a graphics card on his computer |
| Retro Diffusion Aseprite extension | $65 once | needs a graphics card on his computer |
| Adobe pixel effect | free with account, daily cap | a filter on photos, not a game-asset generator; no palette lock, no tile mode |
| Aseprite | $19.99 once | not a generator; it is the cleanup tool and stays in the plan |
| Tilesetter | $12.99 once | tiles only, a helper, stays optional |
| A human pixel artist | one-time per piece | passes every constraint; slowest; stays on the table for the hero set |
| Retro Diffusion web API | prepaid balance, from $0.03 an image, exact price shown first, refund on failure, 50 free credits, no card | PASSES |
| PixelLab API (per endpoint) | per call, about $0.006 to $0.016 an image; some models gated behind a Tier 1 subscription | MAYBE, see section 4 |

## 3. Why Retro Diffusion still leads for the FIRST balance

- Trained only on pixel art; the output is on a real grid at any size up to 512, so the pack's 96-pixel floor (rule 105) is a setting, not a hope.
- `input_palette`: the pack's palette locks. Rule 82 (the reference twin) and rule 105 are enforced by the tool, not by a chat's taste.
- Up to nine `reference_images`: the pack tiles ride along as the style reference. This is rule 108(a) exactly.
- Tile mode (`tile_x`, `tile_y`) for seamless ground; `rd_pro__topdown` for the 45-degree world; `rd_pro__horror` for the analog horror bible.
- `check_cost` is a free dry run: the request card can carry the exact price before his YES, which is what rule 108's NOTHING CHARGED BEFORE HIS YES needs.
- Failed generations are refunded; a prepaid balance that does not expire; 50 free credits with no card; no subscription; an MCP server a chat drives alone.

No other no-subscription tool has the palette lock plus the reference images plus the free dry run. Those three are the parts that make the ten-step workflow honest.

## 4. The one thing the research under-weighed: PixelLab's per-call API

Rounds two and three filed PixelLab as "subscription, out." That was too fast. PixelLab's own API page lists per-endpoint prices with no plan attached (rotate about $0.011 at 64x64, edit about $0.012, animate with skeleton about $0.014 to $0.016 at 32 to 128 px), and PixelLab is the strongest tool anywhere for the two things rule 107 demands: EIGHT DIRECTIONS from one drawing and skeleton animation. Its FAQ says the company prefers subscriptions, and at least one animation model is gated behind a Tier 1 plan, so whether the API runs on a prepaid balance with NO subscription is NOT CONFIRMED. This container cannot open pixellab.ai (the proxy refuses the host), so the finding rests on search text and third-party pages.

What this means for the plan: Retro Diffusion first, on the free credits, and the first six cards include one EIGHT-FACING turnaround (a person and a beast). If Retro Diffusion holds the eight facings, PixelLab is not needed. If it does not, PixelLab's API becomes a request to him for a SECOND prepaid balance, only after its billing is confirmed from its own site (PLUMBER [the toolchain] carries the check). Not before.

## 5. Straight answer to his question

Did the research miss options? One, and it is named above. Did it "suck"? The three rounds found and corrected real errors in each other (wrong model names, a dead library, the Aseprite extension needing a GPU), and the shortlist is right for the rules he set. The field is small because his constraints are strict, and they are good constraints. The honest gap is: vendor sites could not be opened from here, so every price on these pages comes from search text and should be read on the vendor's page before money moves, which the request card's free dry run does for Retro Diffusion automatically.

Sources (search text; the vendor pages themselves could not be opened from this container):
- https://www.pixellab.ai/pixellab-api (per-endpoint estimated prices; Tier 1 gate on PixMiniMax)
- https://www.pixellab.ai/docs/faq ("we think a subscription is the most consumer-friendly method")
- https://ludo.ai/compare/best-ai-pixel-art-generators and https://ludo.ai/compare/pixellab-alternatives (a competitor's roundup; PixelLab and Scenario tiers)
- https://app.cinevva.com/guides/ai-pixel-art-generators (Retro Diffusion pay-per-generation, Aseprite extension prices)
- https://www.sprite-ai.art/blog/best-pixel-art-generators-2026 (a competitor's roundup; prepaid balance, price shown up front)
- https://phaser.io/news/2026/08/sprite-fusion-tilemap-editor-phaser (Sprite Fusion tiers, credits do not roll over)
- https://gamedevaihub.com/best-ai-pixel-art-generators-for-2d-indie-games/ (free trials and commercial use)
- https://gamelabstudio.co/blog/gamelabs-studio-vs-pixellab (PixelLab subscription plus API pay-per-use)
