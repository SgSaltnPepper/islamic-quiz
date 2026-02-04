import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'ur'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});
 
export const config = {
  // Fix: This regex catches ALL paths (except api, _next, and files with extensions)
  // This ensures /login automatically redirects to /en/login
  matcher: ['/((?!api|_next|.*\\..*).*)']
};