import type { APIRoute } from 'astro';
import { jwtVerify } from 'jose';

export const POST: APIRoute = async ({ request }) => {
  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = body.token;
  if (!token || typeof token !== 'string') {
    return new Response(JSON.stringify({ error: 'Token is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const secret = new TextEncoder().encode(import.meta.env.BETTER_AUTH_SECRET);

  try {
    // Do NOT restrict algorithms — let jose auto-detect from the JWT header
    const { payload } = await jwtVerify(token, secret);
    return new Response(
      JSON.stringify({ valid: true, user: payload }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ valid: false, error: 'Invalid or expired token' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
