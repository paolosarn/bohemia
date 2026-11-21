# WORLD THIRTEEN, ROUND NINE: THE MAP ON SIX VALLEYS, AND THE FREEZE IT FOUND (11/21/26)

VAMILY rules 453, 461 (amended 11/21: no tool that waits for a tap), the routine's 'the map fast on a cheap phone on every seed'.
A measure and a find; no game file changed. Owner of the find: PLUMBER 8 (the freeze rows; the code is its marked block).

## 1. THE MEASURE (tools/bohemia_world_thirteen_map_speed.js --valleys 6 --throttle 1; the numbers in
## records/target/world13_map_speed_six_valleys_11_21.json)

The demo on a phone upright, the GPU canvas on, six valleys by the map's own REROLL, the four stops, full speed. Every stop of every
valley finished, 0 page errors. The close stops: a whole picture 0.3 to 20 s, every tile at its detail 0.3 to 39 s (the first valley
of a session slowest: the painters still warming). The opening stop: 0.04 to 1.6 s.

THE FIND: at THE FAR STOP of a new valley, the first frames while the camera slides freeze for 7 to 16 SECONDS on three of six
valleys (sliding 0.1 frames a second; worst frames 15.7, 14.6, 16.3 s), and the far stop's whole picture is up 12 to 30 s after the
valley changes, while the painting itself lands in 2 to 3 s (VBC.landMs).

## 2. WHERE THE TIME GOES (a CPU profile of the far stop sliding over four new valleys, full speed)

73.7 in 100 of the page thread's samples are ONE getImageData, inside mapInkTop's off-thread path (__THE_MAN_BEHIND_IS_CUT_ON_THE_GPU__,
PLUMBER 7, and __A_SIZE_KEEPS_ITS_INK_LINE__, PLUMBER 8): createImageBitmap of the walker's picture, drawn into a willReadFrequently
canvas, then read back. Drawing a GPU-held bitmap into a CPU canvas is itself a wait for the GPU, so the read still waits for the
whole GPU queue; right after a new valley that queue holds the far view's big pictures (here 11.9 s and 6.5 s single frames). The
rest of the thread is idle (21 in 100).

## 3. FOR PLUMBER 8 (row 661)

The ink line could come from the rig's own frames (the pixels it was cut from, read once on the CPU when the rig loads), never from a
picture the GPU holds; or the read could wait while the GPU is busy (the line from the last read stands meanwhile). The probes:
tools/bohemia_world_thirteen_map_speed.js (--valleys 6) and tools/bohemia_world_thirteen_far_freeze_probe.js (the profile).

[bb] Battle Brothers never stops the map to measure a man; ours should not either.
[analog horror] the tape freezes on the valley for fifteen seconds and nobody pressed pause.
