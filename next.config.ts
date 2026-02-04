import createNextIntlPlugin from 'next-intl/plugin';

// This looks for src/i18n/request.ts by default
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your existing config here (if any)
};

export default withNextIntl(nextConfig);