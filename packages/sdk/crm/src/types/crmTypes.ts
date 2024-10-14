import {
  AuthCredentials,
  AuthResponse,
  GeinsUserInputTypeType,
  GeinsUserGetType,
  GeinsUserType,
  GeinsUserOrdersType,
} from '@geins/types';

export interface AuthInterface {
  login(credentials: AuthCredentials): Promise<AuthResponse | undefined>;
  logout(): Promise<AuthResponse | undefined>;
  refresh(refreshToken?: string): Promise<AuthResponse | undefined>;
  getUser(refreshToken?: string, userToken?: string): Promise<AuthResponse | undefined>;
  authorized(refreshToken?: string): Promise<boolean>;
}

/**
 * User interface
 * This interface is used to define the user service
 */
export interface UserInterface {
  get(): Promise<GeinsUserType | undefined>;
  update(user: GeinsUserInputTypeType): Promise<any>;
  create(credentials: AuthCredentials, user?: GeinsUserInputTypeType): Promise<AuthResponse | undefined>;
  remove(): Promise<any>;
  getOrders(): Promise<GeinsUserOrdersType | undefined>;
}
