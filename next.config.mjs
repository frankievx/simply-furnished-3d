import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Byte sizes of every GLB in public/, keyed by URL path. The loader uses them
// to turn streamed bytes into a real progress percentage.
const glbSizes = {};
const walk = (dir, urlPath) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) walk(join(dir, entry.name), `${urlPath}/${entry.name}`);
    else if (entry.name.endsWith(".glb"))
      glbSizes[`${urlPath}/${entry.name}`] = statSync(join(dir, entry.name)).size;
  }
};
walk(join(process.cwd(), "public/models"), "/models");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: { NEXT_PUBLIC_GLB_SIZES: JSON.stringify(glbSizes) },
  async redirects() {
    // The wall landing and product pages were removed; the carousel is the app.
    return [
      { source: "/", destination: "/0/related/0", permanent: false },
      {
        source: "/:productId(\\d+)",
        destination: "/:productId/related/:productId",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
