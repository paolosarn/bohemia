# PAOLO 10/11: A WEBSITE TO DOWNLOAD EVERY FRAME OF A YOUTUBE VIDEO (verbatim)

> "OK, give me fine online big brain research on on any website that I can download every frame of a YouTube video right now please"

Context: the moodboard intake (records/BOHEMIA_PAOLO_I_MIGHT_GIVE_YOU_20000_PICTURES_10_11_26.md). He wants to feed gameplay videos of the looks he loves.

## The finding (search text; vendor pages could not be opened from the container)

- No website takes a YouTube link and hands back every frame. YouTube blocks downloads from most services; cobalt.tools (the clean open-source downloader) is on-and-off for YouTube in 2026; the ad-heavy downloader sites are a malware risk. YouTube's terms forbid downloading; the frames are private reference only, never in the repo or the game.
- 'Every frame' is the wrong unit anyway: 30 a second, nearly all duplicates. One frame a second, or one per scene change, is what the machine wants.
- The machine cannot pull YouTube from the cloud: the container and GitHub's runners sit on data-center addresses YouTube challenges ('sign in to confirm you're not a bot'). The pull has to happen on a home connection: his computer, or the always-on box if it ever exists.

## THE ROAD WITH THE FEWEST STEPS FOR HIM: give the machine the VIDEOS, not the frames

1. On a computer, one free tool gets the MP4: yt-dlp through a free point-and-click front end (Stacher, https://stacher.io ; or yt-dlp itself, https://github.com/yt-dlp/yt-dlp). Paste the link, get the file.
2. Drop the MP4s into the same Drive folder as the pictures.
3. The coordinator's runner extracts frames with ffmpeg: one per scene change (select='gt(scene,0.3)') plus one a second, dedupes, and they join the picture clusters. Zero frame work for him.

## IF HE WANTS FRAMES FROM A SITE ANYWAY (after step 1)

- https://videotoframes.net and https://videotoframes.com : free, no sign-up, runs in the browser, 'every N frames', ZIP out. Set every 30th frame (one a second).
- https://snaplytics.io/tools/video-frame-extractor/ : the same by interval or count, ZIP.
- Browser tools choke on every frame of a long video (vidshift's own FAQ says so); interval mode only.

## What this does on the board

DIRECTION [the moodboard and the taste session] intake amended: videos accepted in the folder; the coordinator's runner does the frame pull; frames join the clusters. The box page (records/BOHEMIA_RESEARCH_UNLOCK_THE_LIMITS_05_*) gains one more reason for the box: a home connection can pull YouTube, the cloud cannot.
