import sharp from "sharp"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const src = path.join(__dirname, "..", "public", "images", "loggo.png")
const out = path.join(__dirname, "..", "public", "images", "tree-only.png")

// Läs ut bildens verkliga storlek och klipp ut övre delen där trädet sitter.
// "Alison Thomas" + "SPIRITUAL MEDIUM & HEALER" tar upp ungefär nedre
// 40 % av bilden, så vi behåller övre 60 % och klipper sedan till kvadrat.
const meta = await sharp(src).metadata()
const w = meta.width ?? 0
const h = meta.height ?? 0
if (!w || !h) {
  throw new Error("Kunde inte läsa bildstorlek")
}

// Övre 60 % av bilden, centrerad horisontellt, klippt till kvadrat.
const topHeight = Math.round(h * 0.6)
const size = Math.min(w, topHeight)
const left = Math.round((w - size) / 2)
const top = Math.round(topHeight * 0.05) // lite marginal uppe
const cropHeight = Math.min(size, topHeight - top)

await sharp(src)
  .extract({ left, top, width: size, height: cropHeight })
  .toFile(out)

console.log(`[v0] Skrev ${out} (${size}×${cropHeight})`)
