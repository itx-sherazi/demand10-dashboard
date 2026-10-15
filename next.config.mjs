/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Internal dashboard: company logos come from many hosts, so serve them as-is.
    // (A remotePatterns entry with hostname '*' turned /_next/image into an open image proxy.)
    unoptimized: true,
  },
};

export default nextConfig;
