# PAOLO 10/11: WHY NOT A GUN IN THE REPO (verbatim, voice-to-text)

> "Let's see like why does it have to be like a price per generated white like why can't you just be better like why can't I just get you a tutor or something or get something in our system project files where it's like having a gun like I'll buy you a gun if you want like why does it have to keep being this outside option and not being able to implement it into our repo?"

("white" is "picture" garbled; "a gun" is his word for a tool that lives in the repo and is ours.)

## What it is

The fourth round of rule 108, and the sharpest. He is not asking which vendor. He is asking why the thing that makes the picture cannot be OURS: bought once or free, sitting in the project files, driven by the chats, no meter running. He will pay once for it.

## The honest answer, in three parts

1. WHY THE CHATS CANNOT JUST BE BETTER. A chat draws by writing code that places colored squares, and only sees the result afterwards, as one small image. A pixel artist makes a thousand tiny calls by eye while the hand moves. A tutor (a book, a skill file, the pixel tutor row on DIRECTION) gives the chats the RULES: sizes, outlines, palettes, light direction. It cannot give them eyes and a hand. That is why months of code-drawn tiles failed and why rule 108 says nobody draws a tile pixel by pixel in code again. The gun is the hand.

2. WHAT THE GUN IS. The thing that makes a picture from words and reference pictures is a trained model: a file of two to seven gigabytes plus a chip to run it. The file CAN be ours: open pixel-art models exist under free licences (Onodofthenorth's sprite-sheet model, apache-2.0; svntax-dev's four-direction walk LoRA on FLUX.2 klein, apache-2.0; pixel icon LoRAs). A model can also be TAUGHT HIS PACKS once (a LoRA trained on the pack tiles, a 50 to 200 MB file that only draws in the packs' style); the teaching takes one free GPU session (Kaggle gives free GPU hours; the exact weekly quota is unverified) or one rented hour, once, and the result lives in the repo forever. THAT is the gun he is describing.

3. WHY IT STILL WANTED A METER. The chip. Every picture is made on a graphics card somewhere. His computer: no (his rule). A vendor's card per picture: the meter he hates. The road the research missed: NO GRAPHICS CARD AT ALL. The model runs on an ordinary processor, slowly, and GitHub's standard runners are FREE on a public repository, which this one is (the demo is served from it). Two to five minutes a picture on four cores, zero dollars, inside the repo, driven by the same request card. Slower and a notch rougher than Retro Diffusion (no native palette lock; the pixelize palette snap and the clean gate do that after), but it is OURS and it never bills.

## The ruling, as filed (rule 108 ROUND FOUR: THE GUN IN THE REPO)

- The repo gets its own picture engine: an open pixel-art model plus, once it is proven, a LoRA taught on his packs, run on GitHub's free standard runners on CPU, driven by the same free request card and his YES. No per-picture bill. No card on his computer. PLUMBER [the gun in the repo].
- Retro Diffusion stays as the second engine, the prepaid one, used only where the gun fails the pack twin after two tries; the request card says which engine is firing and what it costs (zero for the gun).
- The one-time buys he offered stand as the shopping list, all optional until he says the word: Aseprite $19.99 (the cleanup hand), Pixel Logic $10 (the tutor book), one rented GPU hour or a free Kaggle session to teach the LoRA his packs (one time), an artist for the hero set.
- Nothing changes in the ten steps. Step 5 "one call" now reads "one run of the gun, or one call if the card says Retro Diffusion."

## Honest limits

- Speed: minutes a picture, not seconds. A sweep that makes thirty pictures takes an hour of free runner time. Fine for one-at-a-time sheets (rule 101).
- Quality: open models are a notch under Retro Diffusion at the pixel grid; the LoRA on his packs is what closes that gap, and it is the one piece that needs a GPU for an hour, once.
- Licences ride with every file (the toolchain row's standing constraint).
- Runner specs (4 vCPU, 16 GB) and CPU timings here come from GitHub's docs and vendor benchmarks for 8 vCPUs, not from a run of ours; the first run measures them.
