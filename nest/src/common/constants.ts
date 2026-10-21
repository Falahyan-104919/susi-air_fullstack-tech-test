export const APP_TODAY = process.env.APP_TODAY || '2026-05-15';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('[FATAL] JWT_SECRET environment variable must be explicitly defined in production!');
}

export const JWT_SECRET = process.env.JWT_SECRET || 'susi-air-pilot-app-dev-secret-2026';
export const IS_PUBLIC_KEY = 'isPublic';
