import { NextResponse, type NextRequest } from 'next/server';

const SUPPORTED = (process.env.SUPPORTED_LOCALES || 'vi,en')
  .split(',')
  .map(s => s.trim());
const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'vi';
const PROTECTED_PREFIXES = ['/dashboard'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const pathParts = pathname.split('/').filter(Boolean);
  const maybeLocale = pathParts[0];

  if (!SUPPORTED.includes(maybeLocale || '')) {
    const url = req.nextUrl.clone();
    url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
    return NextResponse.redirect(url);
  }

  const locale = maybeLocale!;
  const restPath = `/${pathParts.slice(1).join('/')}`;
  const isProtected = PROTECTED_PREFIXES.some(p => restPath.startsWith(p));

  if (isProtected) {
    const token = req.cookies.get('access_token')?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/auth/signin`;
      url.searchParams.set('next', restPath);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};