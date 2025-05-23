---
title: User Profile
description: How to work with user profile in the Geins CRM Package
tags:
  - sdk
  - crm
  - user
  - profile
  - user-profile
---

# User Profile

The `User Profile` functionality in the Geins CRM package allows managing personal details about the user, such as name, email, address, and other contact information.

## Key Concepts

- **Profile Information**: Stores personal information including name, email, phone number, and address.
- **Profile Update**: The profile data can be updated by the user or an admin to ensure current contact information.

## Retrieving User Profile

To retrieve the current user's profile information, use the `getUser` method.

### Example

```typescript
const userProfile = await geinsCRM.auth.getUser();
console.log('User Profile:', userProfile);
```

## Updating User Profile

To update profile fields, pass an object with updated fields to the `updateUser` method:

```typescript
const updatedProfile = { name: 'Updated Name', city: 'Updated City' };
const updateResult = await geinsCRM.auth.updateUser(updatedProfile);
if (updateResult?.succeeded) {
  console.log('Profile updated successfully');
} else {
  console.error('Failed to update profile');
}
```

## Example JSON Structure of User Profile

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "address": {
    "city": "New York",
    "state": "NY",
    "country": "USA"
  }
}
```

---
