import {
  AuthCredentials,
  AuthResponse,
  GeinsUserInputTypeType,
  GeinsUserType,
  GeinsUserOrdersType,
} from '@geins/types';

export interface AuthInterface {
  get(refreshToken?: string, userToken?: string): Promise<AuthResponse | undefined>;
  login(credentials: AuthCredentials): Promise<AuthResponse | undefined>;
  logout(): Promise<AuthResponse | undefined>;
  refresh(refreshToken?: string): Promise<AuthResponse | undefined>;
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
  password: UserPasswordInterface;
  orders: UserOrdersInterface;
}

/**
 * User password interface
 * This interface is used to define the user password service
 */
export interface UserPasswordInterface {
  change(credentials: AuthCredentials): Promise<AuthResponse | undefined>;
  requestReset(email: string): Promise<any>;
  commitReset(token: string, password: string): Promise<any>;
}

/**
 * User orders interface
 * This interface is used to define the user orders service
 */
export interface UserOrdersInterface {
  get(): Promise<GeinsUserOrdersType | undefined>;
}
