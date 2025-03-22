/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Chặn build nếu có lỗi ESLint
  },
  reactStrictMode: true,
};

export default nextConfig;
