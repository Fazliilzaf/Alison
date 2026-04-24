/** @type {import('next').NextConfig} */
const nextConfig = {
  // Statisk export — bygger till ./out som sedan serveras av GitHub Pages.
  output: "export",

  // GitHub Pages serverar kataloger via /index.html, så vi behöver trailing slash
  // för att direkta URL-besök ska hitta rätt HTML-fil.
  trailingSlash: true,

  images: {
    // Påkrävt för 'output: export' — Next/Image-optimeraren kan inte köras
    // utan en Node-runtime.
    unoptimized: true,
  },

  // basePath/assetPrefix sätts via miljövariabel så samma config
  // fungerar både lokalt (root) och på GitHub Pages (/<repo-namn>).
  // För en "user/organization"-site (t.ex. <user>.github.io) ska basePath vara tom.
  // För en "project"-site (t.ex. <user>.github.io/my-repo) sätts BASE_PATH
  // till "/my-repo" i GitHub Actions.
  basePath: process.env.BASE_PATH || "",
  assetPrefix: process.env.BASE_PATH || "",
}

export default nextConfig
