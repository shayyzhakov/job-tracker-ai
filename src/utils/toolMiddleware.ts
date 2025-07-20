import { LOGIN_URL } from '../consts';
import { getConfig, setConfig } from './configStore';
import logger from './logger';
import { getTokenPayload } from './tokenService';

// Higher-order function to wrap tool handlers with custom logic
export function withToolMiddleware<TArgs extends unknown[], TResult>(
  handler: (...args: TArgs) => Promise<TResult>,
  middleware: (
    next: (...args: TArgs) => Promise<TResult>,
    ...args: TArgs
  ) => Promise<TResult>,
): (...args: TArgs) => Promise<TResult> {
  return (...args: TArgs) => middleware(handler, ...args);
}

// Middleware: validates access token, refreshes if expired
export async function tokenValidationMiddleware<
  TArgs extends unknown[],
  TResult,
>(
  next: (...args: TArgs) => Promise<TResult>,
  ...args: TArgs
): Promise<TResult> {
  const accessToken = getConfig<string>('access_token');

  // Validate access token expiration
  try {
    const payload = getTokenPayload(accessToken);
    const exp = typeof payload.exp === 'number' ? payload.exp : undefined;
    if (!exp) throw new Error('Token missing exp field');
    const now = Math.floor(Date.now() / 1000);
    if (exp < now) {
      // Token expired, attempt refresh
      // const refreshToken = getConfig<string>('refresh_token');
      // const { data, error } = await supabase.auth.refreshSession({
      //   refresh_token: refreshToken,
      // });
      // if (error) {
      //   throw new Error('Failed to refresh access token');
      // }
      // setConfig('access_token', data.session.access_token);
      // setConfig('refresh_token', data.session.refresh_token);

      // Example stub:
      // const { newAccessToken, newRefreshToken } = await refreshAccessToken(refreshToken);
      // setConfig('access_token', newAccessToken);
      // setConfig('refresh_token', newRefreshToken);
      throw new Error('Access token expired. Refresh logic not implemented.');
    }
  } catch (err) {
    logger.info('[tokenValidationMiddleware] error validating token', err);
    throw new Error(
      `Token validation failed. Please login again at ${LOGIN_URL}. Error: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }

  // Proceed to the next handler
  return next(...args);
}
