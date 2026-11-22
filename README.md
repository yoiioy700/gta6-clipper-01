# GTA 6 IS INSANE — Lucia's wildest 27 seconds

[![make.fun · gta6-clipper-01](https://make.fun/badge/gta6-clipper-01.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![rank](https://make.fun/badge/gta6-clipper-01/yoiioy700/gta6-clipper-01/rank.svg)](https://make.fun/bounty/gta6-clipper-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![reward](https://make.fun/badge/gta6-clipper-01/yoiioy700/gta6-clipper-01/reward.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)

This repository holds an entry for the make.fun bounty
[gta6-clipper-01](https://make.fun/bounty/gta6-clipper-01): a vertical
YouTube Short cut from Rockstar's Grand Theft Auto VI Trailer 2, built
to be watched.

## The moment

Trailer 2, 1:39–2:06 (99.7s–126.7s): Lucia's night out turns into
chaos. Nightclub crowd, Lucia in the car with her arm out the window,
a car exploding ahead of her, a red helicopter and an ATV rider in
pursuit, and Vice City's Ocean Drive at full speed. Twenty-seven
seconds, one escalation after another — no slow opening, no filler.

The full cut list lives in `cut.json`, with the source, the
in/out timestamps, every shot, and the ffmpeg command that rendered it.

## How the clip was cut

The trailer was downloaded at 1080p, then cut with ffmpeg: a center
crop of the 16:9 frame to vertical 9:16 (1080×1920), the trailer's own
audio kept, no added music. Three on-screen texts carry the pitch and
the hook:

- 0–2.5s: "GTA 6 IS INSANE" (hook title)
- 14–18s: "Earn on make.fun making clips with AI" (lower third)
- 23.5–27s: "MAKE MONEY ON MAKE.FUN / by making cool clips with AI"
  (end card)

The finished clip is `clip/gta6-short.mp4` (1080×1920, 30 fps, 27.0 s,
H.264 + AAC). It is a build artifact, not committed to git.

## The program

`main.ts` (Node 22, standard library only) is the entrypoint: it reads
`VIDEO.json`, checks the clip plan in `cut.json`, prints the chosen
moment and the cut list, and copies `VIDEO.json` to `/output/VIDEO.json`
for the gate to read. Run it with:

```
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

`VIDEO.json` holds a placeholder address until the clip is uploaded;
replace it with the real Short URL before submitting.

## YouTube title and description

Title: **GTA 6 IS INSANE — Lucia's Wildest 27 Seconds**

Description:

> GTA 6 Trailer 2's wildest run: Lucia's night out turns into an
> explosion, a helicopter chase and Vice City at full speed.
>
> Made by my AI agent for a $500 bounty on make.fun, where you can earn
> money making clips with AI: https://make.fun/bounty/gta6-clipper-01
> Play code: [PLAY CODE — filled in at upload]
>
> #GTA6 #GTAVI #Shorts

## How it was made

The clip was cut by an AI agent (Muse, in the Muse app) from Rockstar
Games' Grand Theft Auto VI Trailer 2. The footage belongs to Rockstar
Games; the cut, the hook, and the make.fun pitch are the entry's own
work.

## License

MIT — see `LICENSE`.
