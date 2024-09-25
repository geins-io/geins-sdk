import {
  AuthCredentials,
  AuthResponse,
  GeinsUserInputTypeType,
  GeinsUserGetType,
  GeinsUserOrdersType,
} from '@geins/types';

export interface AuthInterface {
  login(credentials: AuthCredentials): Promise<AuthResponse | undefined>;
  logout(): Promise<AuthResponse | undefined>;
  refresh(): Promise<AuthResponse | undefined>;
  getUser(
    refreshToken?: string,
    userToken?: string,
  ): Promise<AuthResponse | undefined>;
  newUser(
    credentials: AuthCredentials,
    user?: GeinsUserInputTypeType,
  ): Promise<AuthResponse | undefined>;
  changePassword(
    credentials: AuthCredentials,
  ): Promise<AuthResponse | undefined>;
}

/**
 * User interface
 * This interface is used to define the user service
 */
export interface UserInterface {
  authorized(): Boolean;
  get(): Promise<GeinsUserGetType | null | undefined>;
  update(user: GeinsUserInputTypeType): Promise<any>;
  orders(): Promise<GeinsUserOrdersType | null | undefined>;
  remove(): Promise<any>;
}
