import {
  AuthCredentials,
  AuthResponse,
  UserInputType,
  UserType,
  UserAddressType,
  UserOrdersOrderType,
  UserQuery,
  UserOrdersQuery,
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
  get(): Promise<UserQuery['getUser'] | null>;
  update(user: UserInputType): Promise<any>;
  orders(): Promise<UserOrdersQuery['getOrders'] | null>;
  remove(): Promise<any>;
}
