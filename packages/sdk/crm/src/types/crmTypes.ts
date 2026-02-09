import {
  AuthCredentials,
  AuthResponse,
  GeinsUserInputTypeType,
  GeinsUserType,
  GeinsUserOrdersType,
} from '@geins/types';

/**
 * Stateless auth interface.
 * All methods require tokens to be passed explicitly — no stored state.
 */
export interface AuthInterface {
  login(credentials: AuthCredentials): Promise<AuthResponse | undefined>;
  logout(): Promise<AuthResponse | undefined>;
  refresh(refreshToken: string): Promise<AuthResponse | undefined>;
  getUser(refreshToken: string, userToken?: string): Promise<AuthResponse | undefined>;
  authorized(refreshToken: string): Promise<boolean>;
}

/**
 * Stateless user interface.
 * All read/write methods require a userToken for authorization.
 */
export interface UserInterface {
  get(userToken: string): Promise<GeinsUserType | undefined>;
  update(user: GeinsUserInputTypeType, userToken: string): Promise<GeinsUserType | undefined>;
  create(credentials: AuthCredentials, user?: GeinsUserInputTypeType): Promise<AuthResponse | undefined>;
  remove(userToken: string): Promise<boolean>;
  password: UserPasswordInterface;
  orders: UserOrdersInterface;
}

/**
 * User password interface.
 * changePassword requires a refreshToken for re-authentication.
 */
export interface UserPasswordInterface {
  change(credentials: AuthCredentials, refreshToken: string): Promise<AuthResponse | undefined>;
  requestReset(email: string): Promise<boolean>;
  commitReset(resetKey: string, password: string): Promise<boolean>;
}

/**
 * User orders interface.
 * Requires userToken to fetch orders for the authenticated user.
 */
export interface UserOrdersInterface {
  get(userToken: string): Promise<GeinsUserOrdersType | undefined>;
}
