/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud.xm-cdn.com",
      },
    ],
  },
};

export default nextConfig;
