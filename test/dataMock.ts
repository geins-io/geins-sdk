import {
  CheckoutInputType,
  GeinsAddressTypeType,
  GeinsCustomerType,
  GeinsGender,
  GeinsUserInputTypeType,
} from '@geins/types';

export function randomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function randomNameString(length: number): string {
  let result = randomString(length);
  result = result.toLowerCase();
  result = result.charAt(0).toUpperCase() + result.slice(1);
  return result;
}

export function randomStreetString(length: number): string {
  let result = randomString(length);
  result = result.toLowerCase();
  result = result.charAt(0).toUpperCase() + result.slice(1);

  // if longer than 10 characters, add a space in the middle
  if (result.length > 10) {
    const middle = Math.floor(result.length / 2);
    result = result.slice(0, middle) + ' ' + result.slice(middle);
  }
  result = `${result} street ${randomNumber(2)}`;
  return result;
}

export function randomNumber(length: number): string {
  const chars = '0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
export function randomPropertyString(): string {
  let result = randomString(randomInt(4, 10));
  result = result.toLowerCase();
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
export function randomJson(): any {
  return {
    [randomPropertyString()]: randomString(10),
    [randomPropertyString()]: randomInt(0, 100),
    [randomPropertyString()]: randomBool(),
    [randomPropertyString()]: randomDate(),
    [randomPropertyString()]: randomArray(5, () => randomString(5)),
  };
}

export function randomObject<T>(generator: () => T): T {
  return generator();
}

export function randomAddress(): GeinsAddressTypeType {
  return {
    firstName: randomNameString(randomInt(5, 10)),
    lastName: randomNameString(randomInt(5, 10)),
    company: randomString(randomInt(5, 10)),
    mobile: randomNumber(10),
    phone: randomNumber(10),
    careOf: randomString(randomInt(5, 10)),
    entryCode: randomNumber(4),
    addressLine1: randomStreetString(randomInt(7, 15)),
    addressLine2: randomString(randomInt(7, 15)),
    addressLine3: randomString(randomInt(5, 10)),
    zip: randomNumber(5),
    city: randomString(randomInt(5, 10)),
    state: '',
    country: 'Sweden',
  };
}

function randomCustomerType(): GeinsCustomerType {
  return randomBool() ? GeinsCustomerType.PersonType : GeinsCustomerType.OrganizationType;
}

function randomGender(): GeinsGender {
  return randomBool() ? GeinsGender.ManType : GeinsGender.WomanType;
}

export function randomUserData(): GeinsUserInputTypeType {
  return {
    personalId: randomNumber(10),
    gender: randomGender(),
    customerType: randomCustomerType(),
    address: randomAddress(),
    newsletter: randomBool(),
    metaData: JSON.stringify(randomJson()),
  };
}

export function randomCheckoutData(paymentId?: number): CheckoutInputType {
  return {
    ...(paymentId !== undefined && { paymentId }),
    email: randomString(5) + '.' + randomString(5) + '@example.com',
    billingAddress: randomAddress(),
    //shippingAddress: randomAddress(),
    //merchantData: JSON.stringify(randomJson()),
    //message: randomString(10),
    acceptedConsents: ['order'],
  };
}

export function randomCustomerInfoName(): GeinsUserInputTypeType {
  return {
    address: {
      firstName: randomString(10),
      lastName: randomString(10),
    },
  };
}

export function cleanObject(obj: any): any {
  const newObj: any = {};
  for (const key in obj) {
    if (key === '__typename') {
      continue;
    }
    if (typeof obj[key] === 'object') {
      newObj[key] = cleanObject(obj[key]);
    } else if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}
