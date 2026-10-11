# PAOLO 10/11: YES TO THE PREPAID TOP-UP, IF THE CHATS RUN IT AND IT IS NOT WORK FOR ME (verbatim, voice-to-text)

> "Yeah, I'm definitely down for this. Is this something that you're gonna be smart with or I have to do? I have to hand. I have to do everything. If it's a tool I can connect that would be awesome. If it's just some bullshit more work for me I cannot do it."

## WHAT I HEARD (rule 91c; correct me with one word)
Yes to the one prepaid balance on Retro Diffusion. Condition: he connects it once and the chats do everything after; if it needs him every time, it is dead.

## HIS PART, ONCE (about five minutes)
1. Make the account at https://retrodiffusion.ai and buy the prepaid balance (about $30).
2. Copy the API key it gives him.
3. In the GitHub repo: Settings, then Secrets and variables, then Actions, then New repository secret. Name: RD_TOKEN. Value: the key. Save.
That is all. He never opens the tool again.

## OUR PART (PLUMBER [the toolchain], first)
A GitHub Action in the repo (the chats' cloud machines cannot reach outside hosts through their proxy, so the call runs on GitHub's own runners, which can): a chat writes a request file (the asset kind, the nine pack reference tiles by key, the palette, the size, the prompt), pushes it, the Action calls Retro Diffusion with RD_TOKEN, snaps the result to the pack palette, runs the seam test, and commits the sheet (pack tile left, new asset right, at 1:1) into the cook folder for the VOTE tab. The key never leaves GitHub's secret store; a dry-run check_cost call guards the balance; a monthly spend cap in the workflow stops at his balance. First assets, one of each kind: a street lamp, a wrecked car, a gun, a portrait, a house face, a street tile.
