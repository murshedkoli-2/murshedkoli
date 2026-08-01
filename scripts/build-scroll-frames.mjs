/**
 * Builds the scroll-scrubbed background sequence in `public/sequence/`.
 *
 * Source is a folder of clip frames (e.g. ezgif-frame-NNN.jpg). We subsample
 * them, re-encode to WebP at two sizes, and emit a manifest the client reads.
 *
 *   node scripts/build-scroll-frames.mjs [sourceDir]
 *
 * Re-run whenever the source clip changes. Output is committed so builds and
 * deploys never depend on the source folder existing.
 */
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const DEFAULT_SOURCE = 'C:/Users/mursh/Desktop/morshed/image'

/** Keep every Nth source frame. 300 -> 100 frames stays smooth at ~40px of scroll per frame. */
const STRIDE = 3

/** Two tiers: `lg` for tablet/desktop, `sm` for phones. Both stay well under budget. */
const TIERS = [
  { name: 'lg', width: 540, quality: 58 },
  { name: 'sm', width: 300, quality: 50 },
]

const OUT_DIR = path.join(process.cwd(), 'public', 'sequence')

/** Numeric-aware sort so frame-2 lands before frame-10 regardless of padding. */
function byFrameNumber(a, b) {
  const na = Number(a.match(/(\d+)/g)?.pop() ?? 0)
  const nb = Number(b.match(/(\d+)/g)?.pop() ?? 0)
  return na - nb
}

async function main() {
  const sourceDir = process.argv[2] || DEFAULT_SOURCE

  let entries
  try {
    entries = await readdir(sourceDir)
  } catch (error) {
    throw new Error(`Cannot read source frames at "${sourceDir}": ${getMessage(error)}`)
  }

  const sources = entries.filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort(byFrameNumber)

  if (sources.length === 0) {
    throw new Error(`No image frames found in "${sourceDir}"`)
  }

  const selected = sources.filter((_, i) => i % STRIDE === 0)
  const meta = await sharp(path.join(sourceDir, selected[0])).metadata()
  const aspect = (meta.height ?? 16) / (meta.width ?? 9)

  await rm(OUT_DIR, { recursive: true, force: true })

  let totalBytes = 0

  for (const tier of TIERS) {
    const dir = path.join(OUT_DIR, tier.name)
    await mkdir(dir, { recursive: true })

    const written = await Promise.all(
      selected.map(async (file, i) => {
        const buffer = await sharp(path.join(sourceDir, file))
          .resize({ width: tier.width, height: Math.round(tier.width * aspect), fit: 'cover' })
          .webp({ quality: tier.quality, effort: 6 })
          .toBuffer()

        await writeFile(path.join(dir, `${String(i).padStart(4, '0')}.webp`), buffer)
        return buffer.byteLength
      })
    )

    const bytes = written.reduce((sum, n) => sum + n, 0)
    totalBytes += bytes
    report(tier, written.length, bytes)
  }

  const manifest = {
    count: selected.length,
    aspect: Number(aspect.toFixed(4)),
    tiers: TIERS.map((t) => ({ name: t.name, width: t.width })),
    generatedAt: new Date().toISOString(),
  }
  await writeFile(path.join(OUT_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

  process.stdout.write(
    `\n${selected.length} frames from ${sources.length} sources -> public/sequence (${mb(totalBytes)} total)\n`
  )
}

function report(tier, count, bytes) {
  process.stdout.write(
    `  ${tier.name.padEnd(3)} ${String(count).padStart(4)} frames  ${tier.width}px  ` +
      `${mb(bytes)} (${Math.round(bytes / count / 1024)} KB avg)\n`
  )
}

function mb(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function getMessage(error) {
  return error instanceof Error ? error.message : String(error)
}

main().catch((error) => {
  process.stderr.write(`build-scroll-frames failed: ${getMessage(error)}\n`)
  process.exitCode = 1
})
