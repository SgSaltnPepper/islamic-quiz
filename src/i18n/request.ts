import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'ur'];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  // Validate locale
  if (!locale || !locales.includes(locale as any)) {
    notFound();
  }

  // FAIL-SAFE: Explicitly import each file instead of using a dynamic path
  // This prevents "Module not found" errors during the build
  let messages;
  try {
    if (locale === 'ur') {
      messages = (await import('../../messages/ur.json')).default;
    } else {
      messages = (await import('../../messages/en.json')).default;
    }
  } catch (error) {
    console.error("Translation file not found:", error);
    notFound();
  }

  return {
    locale,
    messages
  };
});