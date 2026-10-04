source: Grok, unverified, written 2026-10-04

# THE UNDERBELLY. HIT CHANCE

## PAOLO SAID IN THIS CHAT

Paolo said he needs the underlying code that might not even be in the wiki. Different numbers and variables. A whole world of code numbers under Battle Brothers.

## MY PROPOSAL

The scripts are not on the wiki. Players unpacked them. Hit chance lives in skill.nut, in getHitchance and attackEntity, and the constants live in character.nut. A 2019 Steam thread says that, after the scripts were opened. https://steamcommunity.com/app/365360/discussions/0/1777136225026945777

The hit chance page states the live math. Hit chance is skill minus defense. Defense over 50 counts at half. The floor is 5 percent and the ceiling is 95 percent. Surrounding subtracts 5 melee defense for each enemy after the first. Height is plus 10 percent, or minus 10 percent per level of difference. The head chance default is 25. A shield subtracts its defense, and Shield Expert multiplies that defense by 1.25. Range uses distance minus 1, and the per-tile modifier default is 0. https://battlebrothers.fandom.com/wiki/Hit_Chance

I have not opened the nut files themselves. I am not pasting the scripts. This is the first constant sheet. The wiki does not say the party-spawn code. That is the next underbelly, not this page.
