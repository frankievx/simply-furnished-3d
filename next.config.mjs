/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
