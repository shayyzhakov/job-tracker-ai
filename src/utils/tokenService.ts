export function getTokenPayload(token: string): Record<string, unknown> {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('Invalid token format');
  try {
    const payload = Buffer.from(parts[1], 'base64').toString();
    return JSON.parse(payload);
  } catch (error) {
    throw new Error('Failed to parse token payload');
  }
}

export function getEmailFromToken(token: string): string | null {
  const payload = getTokenPayload(token);
  if (typeof payload.email === 'string' && payload.email.length > 0) {
    return payload.email;
  }
  return null;
}
