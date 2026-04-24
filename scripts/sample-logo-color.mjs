import sharp from "sharp"
import { fileURLToPath } from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const logoPath = path.join(__dirname, "..", "public", "images", "loggo.png")

const { data, info } = await sharp(logoPath)
  .raw()
  .toBuffer({ resolveWithObject: true })

const channels = info.channels
const width = info.width
const height = info.height

// Sampla några hörn- och kantspixlar som bör vara ren bakgrund.
const samplePoints = [
  [2, 2],
  [width - 3, 2],
  [2, height - 3],
  [width - 3, height - 3],
  [Math.floor(width / 2), 2],
  [Math.floor(width / 2), height - 3],
  [2, Math.floor(height / 2)],
  [width - 3, Math.floor(height / 2)],
]

const toHex = (n) => n.toString(16).padStart(2, "0").toUpperCase()

let rSum = 0
let gSum = 0
let bSum = 0

for (const [x, y] of samplePoints) {
  const idx = (y * width + x) * channels
  const r = data[idx]
  const g = data[idx + 1]
  const b = data[idx + 2]
  rSum += r
  gSum += g
  bSum += b
  console.log(`[v0] sample (${x},${y}) -> #${toHex(r)}${toHex(g)}${toHex(b)}`)
}

const n = samplePoints.length
const r = Math.round(rSum / n)
const g = Math.round(gSum / n)
const b = Math.round(bSum / n)
console.log(`[v0] average background color: #${toHex(r)}${toHex(g)}${toHex(b)}`)
