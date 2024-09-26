export interface GeinsEventMessage {
  subject: string;
  payload: any;
}

// enum over event types to subscribe to
export enum GeinsEventType {
  // user
  USER = 'USER',
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
}
