import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return new Response(JSON.stringify({ status: 'ok', service: 'auth' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
