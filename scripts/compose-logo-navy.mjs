import sharp from "sharp"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = join(__dirname, "..")

const src = join(root, "public", "images", "logo.png")
const dest = join(root, "public", "images", "logo-navy.png")

// Läs in källbilden och hämta dess mått
const input = sharp(src)
const meta = await input.metadata()
const width = meta.width ?? 1024
const height = meta.height ?? 1024

console.log("[v0] Source logo:", width, "x", height)

// Skapa en solid navy-bakgrund i samma mått och komposita loggan ovanpå.
// Navy = #3E4E68 ⇒ rgb(62, 78, 104)
const navyBackground = {
  create: {
    width,
    height,
    channels: 4,
    background: { r: 62, g: 78, b: 104, alpha: 1 },
  },
}

await sharp(navyBackground)
  .composite([{ input: await input.toBuffer() }])
  .png()
  .toFile(dest)

console.log("[v0] Wrote composed logo to:", dest)
