import { GeinsUserInputTypeType, GeinsAddressTypeType } from '@geins/types';

export function randomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomBool(): boolean {
  return Math.random() >= 0.5;
}

export function randomDate(): Date {
  return new Date(randomInt(0, 9999999999999));
}

export function randomArray<T>(length: number, generator: () => T): T[] {
  const result = [];
  for (let i = 0; i < length; i++) {
    result.push(generator());
  }
  return result;
}

export function randomObject<T>(generator: () => T): T {
  return generator();
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export function randomCustomerInfoName(): GeinsUserInputTypeType {
  return {
    address: {
      firstName: randomString(10),
      lastName: randomString(10),
    },
  };
}
