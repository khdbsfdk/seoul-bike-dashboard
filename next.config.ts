import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/seoul-bike/:apiKey",
        destination: "http://openapi.seoul.go.kr:8088/:apiKey/json/bikeList/1/1000/",
      },
    ];
  },
};

export default nextConfig;
