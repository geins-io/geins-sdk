import {
  AuthCredentials,
  AuthResponse,
  UserInputType,
  UserType,
  UserAddressType,
  UserOrdersOrderType,
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
  authorized(): Boolean;
  get(): Promise<UserType | undefined>;
  update(user: UserInputType): Promise<any>;
  orders(): Promise<UserOrdersOrderType[] | undefined>;
  order(id: number): Promise<any>;
  balance(): Promise<any>;
  adress(): Promise<any>;
  remove(): Promise<any>;
}
