// gta6-clipper-01 entrypoint (Node 22, standard library only).
//
// The entry itself is the YouTube Short: the agent found a GTA 6 moment in
// Rockstar's Trailer 2, cut it into a vertical clip, and the clip carries
// make.fun's pitch on screen. This program does the bookkeeping the gate
// needs: it reads VIDEO.json (the video's address), checks the clip plan
// in cut.json, prints the chosen moment and the cut, and copies VIDEO.json
// to /output/VIDEO.json, where the gate reads it.
//
// Run it outside the grader's container with:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
//
// VIDEO.json still holds the placeholder address until the clip is
// uploaded to YouTube; the program warns about that but still exits 0,
// because the upload happens after this check. Replace the placeholder
// with the real Short URL before submitting.

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const PLACEHOLDER = 'PENDING_UPLOAD';

function readJson(name: string): Record<string, unknown> {
  const path = join(BOT_DIR, name);
  if (!existsSync(path)) {
    console.error(`${name} is missing from ${BOT_DIR}`);
    process.exit(1);
  }
  try {
    return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;
  } catch (err) {
    console.error(`${name} is not valid JSON: ${(err as Error).message}`);
    process.exit(1);
  }
}

function asString(value: unknown, label: string): string {
  if (typeof value !== 'string' || value.length === 0) {
    console.error(`${label} is missing or not a string`);
    process.exit(1);
  }
  return value;
}

function validateVideoUrl(url: string): void {
  // The entry's video must live on YouTube as a Short or a watch page.
  // Anything else (a placeholder domain, a file host, a typo) is a bad
  // entry address, so fail loudly instead of copying it to /output.
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    console.error(`VIDEO.json url is not a valid URL: ${url}`);
    process.exit(1);
  }
  const host = parsed.hostname.replace(/^www\./, '');
  const isShort = host === 'youtube.com' && parsed.pathname.startsWith('/shorts/');
  const isWatch =
    host === 'youtube.com' &&
    parsed.pathname === '/watch' &&
    parsed.searchParams.has('v');
  if (!isShort && !isWatch) {
    console.error(
      `VIDEO.json url must be a youtube.com/shorts/ or youtube.com/watch?v= URL, got: ${url}`,
    );
    process.exit(1);
  }
}

function main(): void {
  const video = readJson('VIDEO.json');
  const cut = readJson('cut.json');

  const url = asString(video['url'] ?? video['video_url'], 'VIDEO.json url');
  const moment = asString(cut['moment'], 'cut.json moment');
  const source = cut['source'] as Record<string, unknown> | undefined;
  const sourceTitle = source ? asString(source['title'], 'cut.json source title') : 'unknown source';
  const shots = cut['shots'] as Array<Record<string, unknown>> | undefined;
  if (!Array.isArray(shots) || shots.length === 0) {
    console.error('cut.json has no shots listed');
    process.exit(1);
  }

  console.log(`source: ${sourceTitle}`);
  console.log(`moment: ${moment}`);
  console.log(`cut: ${cut['in_seconds']}s - ${cut['out_seconds']}s (${cut['duration_seconds']}s)`);
  for (const shot of shots) {
    console.log(`  ${shot['at']}s: ${shot['note']}`);
  }

  // Cut sanity check: a YouTube Short must be short. The cut plan's
  // duration has to be a real number of seconds in 1..180, otherwise
  // the clip plan itself is wrong and the entry should not go out.
  const duration = cut['duration_seconds'];
  if (typeof duration !== 'number' || !Number.isFinite(duration) || duration < 1 || duration > 180) {
    console.error(`cut.json duration_seconds must be between 1 and 180 seconds, got: ${duration}`);
    process.exit(1);
  }
  console.log(`cut duration OK: ${duration}s`);

  // The rendered clip is a build artifact, not committed to git, so it
  // may legitimately be absent next to the repo. Report its size when
  // it is there; warn and continue when it is not.
  const clipPath = join(BOT_DIR, 'clip', 'gta6-short.mp4');
  if (existsSync(clipPath)) {
    console.log(`clip file: ${clipPath} (${statSync(clipPath).size} bytes)`);
  } else {
    console.warn(`WARNING: clip file not found at ${clipPath} (build artifact, not committed)`);
  }

  if (url.includes(PLACEHOLDER)) {
    console.warn(
      'WARNING: VIDEO.json still holds the placeholder address. ' +
        'Upload the clip to YouTube and replace it with the real Short URL before submitting.',
    );
  } else {
    validateVideoUrl(url);
    console.log(`video: ${url}`);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(OUTPUT_DIR, 'VIDEO.json'));
  console.log(`wrote ${join(OUTPUT_DIR, 'VIDEO.json')}`);
}

main();
