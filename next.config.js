/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['flm-g-paci.s3.sa-east-1.amazonaws.com'],
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
}

module.exports = nextConfig
