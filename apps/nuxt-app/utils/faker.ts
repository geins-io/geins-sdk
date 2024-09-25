import { faker } from '@faker-js/faker';
import { GeinsCustomerType, GeinsGender } from '@geins/types';
export const fake = {
  user: () => {
    const csex = faker.person.sex() as 'female' | 'male';
    let entityId = faker.string.numeric({ length: 12, exclude: ['0'] });
    let cgender = GeinsGender.UnspecifiedType;
    let ctype = GeinsCustomerType.PersonType;
    let companyName = '';
    if (faker.datatype.boolean()) {
      ctype = GeinsCustomerType.OrganizationType;
      companyName = faker.company.name();
      entityId = faker.string.numeric({ length: 7, exclude: ['0'] });
    } else {
      if (csex === 'male') {
        cgender = GeinsGender.ManType;
      } else if (csex === 'female') {
        cgender = GeinsGender.WomanType;
      }
    }

    const userObject = {
      email: faker.internet.email(),
      user: {
        newsletter: faker.datatype.boolean(),
        customerType: ctype,
        gender: cgender,
        entityId: entityId,
        metaData: JSON.stringify({ bio: faker.person.bio() }),
        address: {
          firstName: faker.person.firstName(csex),
          lastName: faker.person.lastName(),
          company: companyName,
          mobile: faker.phone.number(),
          phone: faker.phone.number(),
          entryCode: faker.string.numeric(4),
          addressLine1: faker.location.streetAddress(),
          addressLine2: faker.location.secondaryAddress(),
          addressLine3: faker.location.buildingNumber(),
          careOf: 'Care Doe',
          city: faker.location.city(),
          state: faker.location.state(),
          zip: faker.location.zipCode('#####'),
          country: faker.location.country(),
        },
      },
    };
    return userObject;
  },
};
