# UNLOCK THE LIMITS 03: GIVING THE CHATS EYES
### Research, 10/11/26. How to MEASURE whether a new picture matches the packs, on a free CPU runner, before anyone with taste has to look.

Research only. Nothing here is built. Facts below rest on web-search result text; the container could not fetch most pages directly, and every place a number or licence is secondhand says so.

## 1. THE FINDING

The chats cannot be given taste, but they can be given a ruler, and the packs he bought are the ruler. Three cheap measurements already catch most of the gap EYES measured on 10/10 (his ground had 8,104 colours per ten thousand pixels, ours 2,800; his props 4,819, ours 9): a learned "does this look like that" score (DINOv2 small or DreamSim), a colour-distribution distance against the pack (earth mover's distance in Lab), and the plain texture statistics DIRECTION's twin-sheet tool already computes. All of them run in under two seconds per image on a GitHub free runner, and all of them are free to use commercially (one licence still needs the file read, see the table). A vision-language critic in a retry loop is the only part that reads like taste, and the papers say it is useful exactly when it is scoped to one question and checked by the numbers, not left to free-form opinion. Every score is calibrated from the packs themselves, pack piece against pack piece, so "red" means "further from the pack than the pack is from itself", which is a fact and not a mood.

## 2. THE METRICS

| Name | What it measures | CPU per image | Model size | Licence | URL |
|---|---|---|---|---|---|
| DINOv2 ViT-S/14 embedding cosine | Whole-image look; self-supervised, so it tracks style and texture more than subject (a style-alignment paper chose DINO over CLIP for this reason) | ~0.1 to 0.3 s at 224 px (estimate from 21M params; not benchmarked in results) | 21M params, 384-d | Apache 2.0 per repo mirrors and Lightly docs; older model-card copy says CC-BY-NC. READ THE LICENSE FILE before shipping | https://github.com/facebookresearch/dinov2 |
| DreamSim (dino_vitb16 single branch) | Human-judged "these two look alike" distance, trained on 20k triplets | ~0.3 to 0.6 s (the ~3x speedup over the ensemble is stated; hardware unstated) | ViT-B/16 backbone + LoRA, ~86M | Code MIT (repo and PyPI); weights' terms not confirmed in results | https://github.com/ssundaram21/dreamsim |
| CLIP ViT-B/32 cosine | Content and subject alignment; weak on style (scores content-alike images high even when styles differ) | 50 to 140 ms per image on CPU (two blog benchmarks, differing hardware) | ~86M image tower | MIT (from memory, not confirmed in results) | https://github.com/Lednik7/CLIP-ONNX |
| CSD (contrastive style descriptor) | Style-only similarity, trained to ignore content | ViT-L/14 backbone: ~1 to 2 s on CPU (estimate) | ~300M | Code MIT; weights CC-BY-4.0 (attribution). A 2026 critique says raw CSD cosine is over-read as absolute | https://arxiv.org/abs/2404.01292 |
| LPIPS (alex) | Pixel-neighbourhood perceptual distance, same-size pairs only | tens of ms | ~2.5M (AlexNet trunk) | BSD-2 (aggregator); PyPI says BSD-3. Read the file | https://github.com/richzhang/PerceptualSimilarity |
| DISTS | Structure plus texture distance; the most hack-resistant of the learned pair metrics | ~0.1 s (VGG trunk) | VGG16 features | Not confirmed in results | https://pypi.org/project/piq/ |
| SSIM / MS-SSIM | Structural similarity; also the best detector of hacked learned metrics (2022 paper) | ms | none | scikit-image BSD / torchmetrics Apache | https://pypi.org/project/piq/ |
| Earth mover's distance on Lab histograms | How far a picture's colour distribution is from the pack's | ms (OpenCV cv2.EMD or POT) | none | Apache / MIT | https://peerj.com/articles/6398 |
| Colours per 10k px, colours to cover half, run length, value range, dark-line share, edge density, flat share | DIRECTION's and EYES' own texture ruler, already in the repo (tools/bohemia_direction_twin_sheets.py stats()) | ms | none | ours | records/BOHEMIA_EYES_THE_TWIN_SHEETS_MEASURED_ROUND_1_SCHOOL_DIRECTIONS_OWN_RULER_ALREADY_EXISTS_10_10_26.md |
| Grid scale and phase detection (unfake) | Is the picture on one honest pixel grid; cell size and offset per axis; fractional grids caught | ms | none | unfake.js / unfake.py, open source | https://github.com/jenissimo/unfake.js/ |
| Silhouette at 4x4, 8x8, 12x12, 16x16 | Does the thing still read as a shape when tiny; the repo's squint_gate.py already does this for districts | ms | none | ours | gates/squint_gate.py |
| VLM critic (any hosted vision model) | A scoped yes/no question per asset against its twin crop | 2 to 10 s, network | hosted | per provider; MLLM-as-a-Judge (ICML 2024) found pairwise comparison reliable, absolute scoring not | https://arxiv.org/abs/2402.04788 |

Pixel-art linters (SpriteLint, pixelartlint.com, Orphan Pixel Corrector) exist for stray pixels, banding and outline gaps, but the packs are HD painted surfaces, not 16-colour sprites, so those checks only apply to the character and portrait families where we do draw at a pixel grid.

## 3. THE TWIN GATE

Name: `twin_gate.py`, in the suite, CPU only, one run per new picture in `slices/fight_ground*`, `slices/settlement*`, character and prop cooks. Reads `reference/art_bank/INDEX.json` for the family and `TWINS_OWED.json` for the named twin.

**Step 0, calibrate from the packs (once per family, cached JSON).** For every approved pack piece in a family (door, ground, prop, road, settlement, lamp, marking, map_tile), compute: DINOv2-S embedding, Lab 16x16x16 histogram, and the seven texture numbers. Then compute every pack-vs-pack pair: cosine, EMD, and the per-number ratio. Record the 10th percentile cosine, the 90th percentile EMD and the 90th percentile texture ratio. Those are the family's "how far the pack is from itself" lines. No human picks a threshold.

**Step 1, score the new piece.** Against its named twin AND against the family centroid (mean embedding, pooled histogram), at the same pixel size as the twin (resize ours nearest-neighbour to the twin's box, never the other way):
- `look`: DINOv2 cosine to twin and to centroid.
- `colour`: EMD to twin histogram and to the family pooled histogram.
- `texture`: ratio of each of the seven numbers, ours over twin.
- `grid`: unfake scale detection; the detected cell must equal the family's cell (1 for the HD packs, the sprite cell for characters), phase zero.
- `shape`: silhouette at 8x8 and 16x16 must have ink between the family's 10th and 90th percentile and must not match another piece in the same family above the squint gate's existing MIN_DIFF.

**Step 2, the verdict.** GREEN when every score sits inside the pack's own spread. AMBER when one score is outside but within twice the spread (ships, logged as debt). RED when `look` is below the family's 10th percentile cosine, or `colour` EMD is past the 90th percentile, or any texture ratio is below 0.33 or above 3.0 (the 10/10 gaps were 2.9x, 500x and 160x, so this bites every one of them), or the grid is fractional. RED blocks the commit; the gate prints the twin crop and ours side by side at the same size into the VOTE card so a human can overrule in one tap.

**Step 3, the critic loop (optional, costs network).** Only after the numbers are GREEN or AMBER. The critic gets the twin crop and ours, same size, and ONE question per pass, pairwise, never a 1 to 10 score: "Which of these two is a painted surface and which is flat fill?" or "Do these two read as the same kit?" The generator retries with the critic's one sentence appended. Retry cap: 3. Keep-best: the loop keeps the highest numeric score so far and reverts if a retry scores lower (VisionDirector and RetouchLLM both do this). After 3 the piece ships AMBER with the critic's sentence in the manifest, or is dropped if RED. Free-form critiques are banned; the Blender inverse-graphics paper found they give the generator a moving target and stop convergence.

## 4. WHAT IT FIXES AND WHAT IT DOES NOT

It fixes the thing EYES proved: a cook can ship a six-step flat ramp beside a pack surface with 500x the colours and nothing says no. After this, nothing that is numerically unlike its twin reaches the board. It also ends the self-report problem: the gate measures the pixels, not the lane's printed numbers.

It does not give anyone taste. A score of "as close to the pack as the pack is to itself" can be hit by a picture that is ugly in a new way, and the cheap way to hit it is to copy pack pixels, which rule 82a already allows and prefers. Goodhart is real here: the 2022 metric-hacking paper raised LPIPS on 97.8% of images by optimising against it, and DISTS on 93.6%; CLIP-score shows the same reward-hacking curve. The defences are the ones that paper found: never optimise a cook against one score, run three unrelated families of measurement (learned look, colour distribution, hand texture statistics), and keep SSIM in the set because it is the best hack detector. The VLM critic has its own failure: MLLM-as-a-Judge found hallucinated and inconsistent judgements even in the strongest model on scoring tasks, so it is only trusted in pairwise form, and only after the numbers.

The gate also cannot judge whether a piece belongs in Bohemia. That stays DIRECTION's and his. What it can do is make sure the only pictures that reach his eyes are already in the pack's neighbourhood, so his taste is spent on taste and not on "why is this flat".

## 5. ONE RULE

A NEW PICTURE IS MEASURED AGAINST ITS TWIN WITH THREE RULERS THAT DO NOT SHARE A FORMULA, THE THRESHOLDS COME FROM THE PACK MEASURING ITSELF, AND A CRITIC ONLY EVER ANSWERS ONE PAIRWISE QUESTION AFTER THE NUMBERS PASS.

## 6. SOURCES

- DreamSim repo and paper: https://github.com/ssundaram21/dreamsim , https://arxiv.org/html/2306.09344v3 , https://pypi.org/project/dreamsim/
- DINOv2 repo (ViT-S/14, 21M): https://github.com/facebookresearch/dinov2 ; licence discussion https://github.com/facebookresearch/dinov2/issues/128 ; Lightly docs state Apache 2.0 https://docs.lightly.ai/train/0.17.0/_sources/pretrain_distill/models/dinov2.md.txt
- DINO over CLIP for style consistency (style-aligned autoregressive paper): https://arxiv.org/pdf/2504.06144
- CLIP ViT-B/32 CPU timings: https://theneuralbase.com/clip/learn/advanced/gpu-vs-cpu-for-clip-inference/ , https://github.com/Lednik7/CLIP-ONNX , https://github.com/akorobeinikov/CLIP-VIT-B-32/blob/main/README.md
- CSD, Measuring Style Similarity in Diffusion Models: https://arxiv.org/abs/2404.01292 ; critique of raw CSD cosine: https://arxiv.org/pdf/2605.09030 ; weights mirror with licence notes: https://huggingface.co/bigshanedogg/CSD
- LPIPS: https://github.com/richzhang/PerceptualSimilarity , https://pypi.org/project/lpips/ ; DISTS and SSIM via piq: https://pypi.org/project/piq/
- Metric hacking (LPIPS 97.8%, DISTS 93.6%, SSIM as detector): https://arxiv.org/pdf/2212.05499 ; Goodhart in image benchmarks: https://arxiv.org/pdf/2406.13743 ; reward hacking in CLIP-scored RLHF: https://arxiv.org/pdf/2503.06171
- Earth mover's distance for colour profiles: https://peerj.com/articles/6398 ; palette-to-histogram distance: https://arxiv.org/abs/2509.02000
- Grid scale detection: https://github.com/jenissimo/unfake.js/ , https://github.com/jenissimo/unfake.js/releases/tag/v1.4.0 , https://github.com/painebenjamin/unfake.py
- Pixel-art linters: https://pixelartlint.com/ , https://mtw1man2.itch.io/spritelint-catch-pixel-art-mistakes-before-you-ship-browser-tool , https://blunt76.itch.io/orphan-pixel-corrector
- Silhouette and squint tests: https://the-pixel.art/articles/pixel-art-character-design/ , https://mtw1man2.itch.io/sprite-silhouette-lab-test-sprite-readability-recognition-browser-tool
- Critic loops: Self-Refine https://arxiv.org/abs/2303.17651 ; MLLM-as-a-Judge https://arxiv.org/abs/2402.04788 ; Iterative Refinement Improves Compositional Image Generation https://arxiv.org/abs/2601.15286 ; VisionDirector https://arxiv.org/html/2512.19243v1 ; RetouchLLM https://arxiv.org/pdf/2510.08054 ; staged verifiers and the free-form critique problem https://arxiv.org/pdf/2606.02580
- Studio art QA: golden-image testing in Unity https://docs.unity3d.com/Packages/com.unity.testframework.graphics@9.0/manual/index.html and Unreal https://dev.epicgames.com/documentation/unreal-engine/automation-test-framework-in-unreal-engine ; style-guide review practice https://drmonojog.com/keeping-pixel-art-consistent-across-an-indie-game/ , https://www.athena-productions.com/read/how-to-build-a-consistent-art-style-across-a-video-game-team-67
- In-repo: records/BOHEMIA_EYES_THE_TWIN_SHEETS_MEASURED_ROUND_1_SCHOOL_DIRECTIONS_OWN_RULER_ALREADY_EXISTS_10_10_26.md , reference/art_bank/TWINS_OWED.json , gates/squint_gate.py , gates/pack_gate.js , gates/reference_check_gate.py
