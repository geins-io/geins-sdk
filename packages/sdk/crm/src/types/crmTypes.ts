import {
  AuthCredentials,
  AuthResponse,
  UserInputType,
  UserType,
} from '@geins/types';

export interface AuthInterface {
  login(credentials: AuthCredentials): Promise<AuthResponse | undefined>;
  logout(): Promise<AuthResponse | undefined>;
  refresh(): Promise<AuthResponse | undefined>;
  getUser(): Promise<AuthResponse | undefined>;
  newUser(
    credentials: AuthCredentials,
    user?: UserInputType,
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
  isLoggedIn(): Boolean;
  get(): Promise<UserType | undefined>;
  update(user: UserInputType): Promise<any>;
  orders(): Promise<any>;
  balance(): Promise<any>;
  adress(): Promise<any>;
  remove(): Promise<any>;
}
