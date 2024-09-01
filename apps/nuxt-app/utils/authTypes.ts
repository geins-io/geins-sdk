export interface AuthCredentials {
  username: string;
  password: string;
  newPassword?: string;
  rememberUser?: boolean;
}

export interface AuthResponse {
  succeeded: boolean;
  user?: AuthUser;
  tokens?: AuthTokens;
}

export interface AuthTokens {
  token?: string;
  refreshToken?: string;
  maxAge?: number;
  expired?: boolean;
  expires?: number;
  expiresIn?: number;
  expiresSoon?: boolean;
}

export interface AuthUser {
  authenticated?: boolean;
  userId?: string;
  username?: string;
  customerType?: string;
  memberDiscount?: string;
  memberType?: string;
  memberId?: string;
}
