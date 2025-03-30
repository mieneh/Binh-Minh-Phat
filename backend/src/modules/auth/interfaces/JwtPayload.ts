export interface JwtPayload {
  sub: string;
  email: string;
  role: 'admin' | 'employee';
  iat?: number;
  exp?: number;
}
