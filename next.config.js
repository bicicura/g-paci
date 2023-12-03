/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['flm-g-paci.s3.sa-east-1.amazonaws.com'],
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  webpack: (config, { isServer }) => {
    // Add a new rule for .glsl files
    config.module.rules.push({
      test: /\.glsl$/,
      use: ['raw-loader'],
    })

    // Important: return the modified config
    return config
  },
}

module.exports = nextConfig
