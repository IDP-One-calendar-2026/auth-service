import type { APIRoute } from 'astro';
import { jwtVerify, importJWK } from 'jose';
import { db } from '../../../db';
import { jwks } from '../../../db/schema';
import { eq } from 'drizzle-orm';

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

  // Parse header to get key ID and algorithm (JWT uses base64url, not base64)
  let header: { kid?: string; alg?: string };
  try {
    const headerB64url = token.split('.')[0];
    // base64url → base64: replace - with +, _ with /, add padding
    const headerB64 = headerB64url.replace(/-/g, '+').replace(/_/g, '/');
    const padding = headerB64.length % 4;
    const headerB64Padded = padding ? headerB64 + '='.repeat(4 - padding) : headerB64;
    header = JSON.parse(Buffer.from(headerB64Padded, 'base64').toString('utf8'));
  } catch {
    return new Response(
      JSON.stringify({ valid: false, error: 'Malformed token header' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!header.kid) {
    return new Response(
      JSON.stringify({ valid: false, error: 'Token missing key ID' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Fetch the public key from JWKS table
  const jwksRecords = await db.select().from(jwks).where(eq(jwks.id, header.kid));
  const jwksRecord = jwksRecords[0];

  if (!jwksRecord) {
    return new Response(
      JSON.stringify({ valid: false, error: 'Signing key not found' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const jwk = JSON.parse(jwksRecord.publicKey);
    const publicKey = await importJWK(jwk, header.alg || 'EdDSA');
    const { payload } = await jwtVerify(token, publicKey, {
      clockTolerance: 60,
    });
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
