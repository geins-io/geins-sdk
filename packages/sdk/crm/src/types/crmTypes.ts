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
  authorized(userToken?: string): Boolean;
  get(userToken?: string): Promise<GeinsUserType | undefined>;
  update(user: GeinsUserInputTypeType): Promise<any>;
  orders(): Promise<GeinsUserOrdersType | undefined>;
  remove(): Promise<any>;
}
