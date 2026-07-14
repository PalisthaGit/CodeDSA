import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/learn',
        destination: '/learn/what-is-dsa',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
