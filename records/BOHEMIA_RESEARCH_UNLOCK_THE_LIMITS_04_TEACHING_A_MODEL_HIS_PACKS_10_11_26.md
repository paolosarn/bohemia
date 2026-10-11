# UNLOCK THE LIMITS 04: TEACHING A MODEL HIS PACKS, ONCE (research, 10/11/26)

Lane: research for the coordinator. Angle: fine-tune a picture model on the bought packs in reference/art_bank so it draws only in that style, trained once on a free GPU, run afterwards on a CPU (a GitHub public-repo runner: 4 cores, 16 GB RAM) or a home computer. No subscriptions, no per-call credits. Container note: outbound fetches were blocked for most hosts, so every number below rests on search-result text, not on the page itself; where a number is from a blog rather than the maker, it says so.

## 1. THE FINDING

A style LoRA is the right tool: it is a small add-on file trained on 15 to 40 of his own tiles, and it teaches a base model one look without retraining the whole model. The base model to pick is FLUX.2 klein base 4B, because it is Apache-2.0 (commercial use is clean), it has published pixel-art and sprite-sheet LoRAs already working on it, and its maker says a LoRA run finishes in about an hour on one rented or free GPU. Running it afterwards on a CPU is feasible but slow (one project reports about a minute per 512 picture on Apple Silicon with a 5 GB quantized file; plain x86 CPU is slower and unmeasured), so the fast CPU path for volume is SD 1.5 + a distilled model (SD-Turbo / SDXS under 2 seconds a picture on a desktop i7 with FastSD CPU). The eight facings are not solved by any published tool: the best public sprite LoRAs do four directions, and the best general turnaround tricks (CharTurner + OpenPose ControlNet, IP-Adapter + ControlNet) are blog-rated at 80 to 95 percent consistency, not measured. What a LoRA fixes is the look of every new tile; what it does not fix is the exact pixel grid, which has to be forced afterwards by nearest-neighbour downscale plus a palette lock.

## 2. THE RECIPE

**Dataset.** 15 to 40 images (the klein LoRA blog's number for a style; general Kohya guides say 15 to 30 or 30 to 100). Use the packs themselves: whole props and tiles, one object per image, no near-duplicates, same pixel grid across all of them. The 96-pixel world is far below any model's native size, so every tile is scaled up by a whole number with nearest-neighbour (8x makes a 96 px tile 768 px; 4x makes a 128 px canvas 512 px) and padded on a flat background to a square. The klein blog asks for at least 1024 px on the long edge; published pixel LoRAs on klein trained at 512. Whole-number scaling matters: a non-integer factor staggers straight lines (Pixelera). The 'train at 4x then downscale' question has no published A/B; every working pixel LoRA found trains on upscaled sheets and downscales after, so native-96 training is untested and not the first try.

**Captions.** One .txt per image. A made-up trigger word (the klein blog) plus a plain description of the content ('a broken road median, two lanes, yellow line, 45 degree view'). Do not describe the style; the LoRA learns it. CC0 is the cleanest provenance note; his packs are bought, so note the pack licence per file for the record.

**Base model.** FLUX.2 klein base 4B (the undistilled 'base' build, never the distilled 4B; both BFL and the Limbicnation and svntax model cards say so). Fallback for CPU volume: SD 1.5 (OpenRAIL-M) with the same dataset, trained with Kohya at 512.

**Trainer.** ai-toolkit (BFL lists it; 12 GB+ VRAM; supports klein base 4B and 9B). OneTrainer also covers Flux.2. Kohya sd-scripts has no Flux.2 in its list, so Kohya is the SD 1.5 / SDXL trainer only.

**Steps and settings.** Learning rate 8e-5 to 1e-4 (BFL). The klein blog's 1800-step run takes under an hour on an RTX 4090 and fits in 24 GB VRAM. Published pixel LoRAs on klein: rank 64 at 1000 steps (Limbicnation), 2750 and 3000 steps (svntax). Start at rank 32, 1500 steps, save a checkpoint every 250, pick by eye.

**Where it trains, for free, once.** Kaggle: about 30 GPU hours a week on T4 (reported 2xT4) or P100, 12-hour session cap, free notebook now 29 GB RAM and 4 cores (third-party reports; Kaggle's own doc page did not surface). Colab free: 15 to 30 hours a week, shifts with demand, 12-hour cap, 90-minute idle cut. Lightning AI free: 15 monthly credits, somewhere between 22 T4 hours (conservative) and 80 interruptible hours (their pricing page's own wording); some credits may need a card on file. A T4 has 16 GB VRAM, so the 24 GB figure means the klein run on a T4 needs the quantized/low-VRAM path ai-toolkit offers for 12 GB cards, and will take longer than an hour; the SD 1.5 fallback trains in a T4 comfortably. If free fails, one hour on a rented RTX 4090 is $0.29 to $0.69 (Vast.ai, RunPod community/secure, 2026 listings); the klein blog itself prices the run at about $0.50.

**Output.** One .safetensors file. Kohya's own range is 2 to 200 MB; an SD 1.5 rank-32 LoRA is tens of MB, SDXL rank 32 is reported around 217 MB (crowd estimate), a klein rank-32 file was not measured in any result. Commit it to the repo (under 100 MB) or Git LFS.

## 3. THE EIGHT FACINGS

No published tool does eight consistent facings of a pixel character. What exists:

- **Sprite-sheet LoRAs on klein 4B**: fal's spritesheet LoRA (2x2, four camera angles of an OBJECT: two isometric, side, top-down; its own card says objects, not characters), svntax's 4-walk LoRA (4x4 sheet, down/left/right/up, three walk frames each, back row 'sometimes inconsistent', a self-described first attempt), Limbicnation's 32x32 character LoRA (four walk directions). All four-direction.
- **CharTurner** (an SD 1.5 / 2.1 embedding) paired with OpenPose ControlNet at about 0.6 weight to hold the outfit across a turnaround; the author warns the LoRA version takes over the style at high weight.
- **IP-Adapter (FaceID Plus v2) + Canny ControlNet** on SDXL for identity across angles; one 2026 blog rates these no-training combos at 80 to 95 percent consistency, and that number is a blog's guess, not a benchmark. The same guide notes the two can fight and collapse to one face.
- The 2022 Pixel Art Sprite Diffusion checkpoint's own advice: pick the best view and mirror it for left and right.

Honest reading: with his own LoRA plus a sheet-layout caption, expect four clean facings per roll and the diagonals by img2img from the four, with a human pick between candidates and a palette lock after. Budget a reject rate of about half on the diagonals; nobody has published better. An 8-way walk cycle is beyond any public LoRA found.

## 4. RUNNING IT AFTERWARDS

| Model on CPU | Time per 512 picture | RAM | Fits a 16 GB runner |
|---|---|---|---|
| SD 1.5, 20 steps, PyTorch | 60 to 150 s on 8 vCPU (SSD Nodes guide); slower on the runner's 4 cores, unmeasured | about 8 GB | yes |
| LCM Dreamshaper (SD 1.5 family), 4 steps, OpenVINO | 10 s on i7-12700 (FastSD CPU) | under 8 GB | yes |
| SD-Turbo, 1 step, OpenVINO + tiny decoder | 1.7 s on i7-12700 (FastSD CPU) | under 8 GB | yes |
| SDXS-512, 1 step, OpenVINO + tiny decoder | 0.82 s on i7-12700 (FastSD CPU README) | under 8 GB | yes |
| SDXL-Turbo, 1 step, OpenVINO | 2.5 s on i7-12700 (FastSD CPU) | about 12 GB | tight |
| FLUX.2 klein 4B, q4_0 GGUF, 4 steps | 61 s on Apple Silicon Metal, peak 5 GB (flux2-klein-cpu); pure x86 'slower', unmeasured | 5 GB model, 16 GB total claimed | yes on RAM, time unknown |

The runner is a 4-core, 16 GB machine; every i7-12700 number above is a desktop with more cores, so multiply by two to four for the runner. A LoRA trained on klein only runs with klein; a LoRA trained on SD 1.5 runs with SD 1.5, SD-Turbo and LCM (same family), so the SD 1.5 fallback is the one that gives sub-10-second CPU pictures. After generation every picture goes through nearest-neighbour downscale to the pack's grid and a palette snap to the pack's colours (ComfyUI Pixelate: 2 to 256 colours, optional palette reference image; Palette Apply: nearest mode against a swatch file; PixelArt Detector: removes small colour islands). The same step is a plain Pillow script (agentbus.sh shows it: nearest resize, median-cut quantize, re-attach alpha), which is what the runner should use.

## 5. LICENCES

| Base model | Licence | Commercial game | Note |
|---|---|---|---|
| FLUX.2 klein base 4B | Apache-2.0 | yes | the pick; BFL's own card |
| FLUX.2 klein 9B | FLUX Non-Commercial | no | BFL training doc |
| FLUX.1 schnell | Apache-2.0 | yes | fast, but no base build for training |
| FLUX.1 dev | FLUX Non-Commercial (model) | model no; outputs disputed | avoid |
| SD 1.5 | CreativeML OpenRAIL-M | yes, no revenue cap | behaviour restrictions carry into derivatives |
| SDXL 1.0 | CreativeML OpenRAIL++-M | yes | same |
| SD 3 / 3.5 | Stability Community | yes under $1M revenue | paid above |
| ai-toolkit (trainer) | not confirmed in results | n/a | check the repo before shipping anything built with it |

His LoRA is his own file; its licence is his. The packs' own licences decide whether training on them is allowed; read each pack's terms before the first run.

## 6. WHAT IT FIXES AND WHAT IT DOES NOT

Fixes: the look. New props, variants of a prop, filler tiles, dressing for the house-sized fight boards, in his packs' palette and angle, from a text line or an img2img of one existing tile, on a machine he does not pay per call. Fixes the volume problem: hundreds of candidates a night on the runner with the SD 1.5 path.

Does not fix: the exact pixel grid (always forced after); eight facings (four at best, diagonals by hand-pick); animation (no public LoRA does a consistent walk cycle past four directions); the 45-degree law and the one-pixel border (gates, not the model); taste (every output still passes reference_check and his eye). Also does not fix speed on klein: a klein LoRA on the runner is minutes a picture, so klein is for quality rolls at home and SD 1.5 is for volume on the runner.

## 7. ONE RULE

Train once on klein base 4B with the packs scaled up by a whole number, run the SD 1.5 twin for volume on the runner, and never ship a generated pixel until it has been downscaled by nearest-neighbour and snapped to the pack's palette.

## 8. SOURCES

Read as search-result text, not fetched pages.
- https://docs.bfl.ml/flux_2/flux2_klein_training (ai-toolkit, base vs distilled, LR 8e-5 to 1e-4, 9B non-commercial)
- https://huggingface.co/black-forest-labs/FLUX.2-klein-base-4B (Apache-2.0)
- https://huggingface.co/blog/black-forest-labs/flux-2-klein-lora (15 to 40 images, 1800 steps under an hour on a 4090, 24 GB, about $0.50)
- https://huggingface.co/Limbicnation/pixel-art-lora (klein 4B pixel character LoRA, rank 64, 1000 steps)
- https://huggingface.co/svntax-dev/pixel_spritesheet_4walk_small_lora_v1 (4-walk sheet, 512 training, 2750 and 3000 steps, back row inconsistent)
- https://huggingface.co/fal/flux-2-klein-4b-spritesheet-lora (2x2 object views)
- https://huggingface.co/nerijs/pixel-art-xl (SDXL pixel LoRA; author: SD 1.5 'limited to 64px')
- https://civitai.com/models/3036/charturner-character-turnaround-helper-for-15-and-21
- https://stable-diffusion-art.com/consistent-character-view-angle/ (IP-Adapter + Canny)
- https://digitalzoomstudio.net/2026/02/stable-diffusion-character-consistency/ (the 80 to 95 percent blog estimate)
- https://civitai.com/models/22/pixel-art-sprite-diffusion (mirror advice)
- https://github.com/rupeshs/fastsdcpu (0.82 s SDXS, 1.7 s SD-Turbo, 2.5 s SDXL-Turbo, 10 s LCM on i7-12700)
- https://www.ssdnodes.com/learn/self-hosted-ai-image-generator (SD 1.5 60 to 150 s on 8 vCPU)
- https://github.com/manishdashsharma/flux2-klein-cpu (klein 4B q4_0, 5 GB, 61 s on Metal)
- https://huggingface.co/unsloth/FLUX.2-klein-base-4B-GGUF
- https://docs.github.com/en/actions/reference/runners/github-hosted-runners (4 CPU, 16 GB, free unlimited on public repos)
- https://www.clusy.io/compare/colab-vs-kaggle and https://resourify.com/resources/kaggle (Kaggle 30 h/week, Colab 15 to 30 h; third-party)
- https://lightning.ai/pricing/ and https://aicreditmart.com/ai-credits-providers/lightning-ai-free-plan-22-gpu-hours-month-guide-2026/
- https://www.synpixcloud.com/blog/vast-ai-vs-runpod-rtx-4090-pricing and https://hackceleration.com/labs/runpod-pricing
- https://terms.law/ai-output-rights/stable-diffusion/ and https://willitrunai.com/blog/flux-vs-sdxl-vs-sd35-comparison (licences)
- https://www.mintlify.com/kohya-ss/sd-scripts/training/lora-overview (2 to 200 MB)
- https://agentbus.sh/posts/how-to-build-ai-pixel-art-generation-with-stable-diffusion/ (Pillow downscale + quantize)
- https://pixelera.art/blog/how-to-scale-down-pixel-art (whole-number scaling)
- https://comfydeploy.com/comfy-node/flycarl/ComfyUI-Pixelate and https://github.com/dimtoneff/ComfyUI-PixelArt-Detector and https://comfy.icu/node/PaletteApply
- https://earngenix.com/blog/ai-toolkit-vs-kohya-vs-fluxgym (trainer coverage; blog)
