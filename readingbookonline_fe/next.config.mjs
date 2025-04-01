/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Vẫn build nếu có lỗi ESLint
  },
  reactStrictMode: true,
};

export default nextConfig;
