import { defineMiddleware } from 'astro:middleware';

const ALLOWED_ORIGINS = [process.env.VITE_UI_URL, process.env.VITE_API_URL];

export const onRequest = defineMiddleware(async (context, next) => {
  const origin = context.request.headers.get('origin');

  // Handle CORS preflight
  if (context.request.method === 'OPTIONS') {
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    return new Response(null, { status: 204 });
  }

  const response = await next();

  // Add CORS headers for allowed origins
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  return response;
});
