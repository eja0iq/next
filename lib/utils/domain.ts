export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // Client-side
    return window.location.origin;
  }
  
  // Server-side
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

export function getCallbackUrl() {
  return `${getBaseUrl()}/callback`;
}

export function getApiCallbackUrl() {
  return `${getBaseUrl()}/api/auth/callback`;
}