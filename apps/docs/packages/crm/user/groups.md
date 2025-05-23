---
title: User Groups
description: How to work with user groups in the Geins CRM Package
tags:
  - sdk
  - crm
  - user
  - groups
  - user-groups
---
# User Groups

The `User Groups` functionality in Geins CRM package allows organizing users into groups, often for permissions or content visibility control. This feature is useful in applications with different access levels or roles.

## Key Concepts

- **Group Assignment**: Users can belong to multiple groups, which define access and permissions.
- **Permissions Control**: User groups help manage which parts of the system are accessible to users.

## Retrieving User Groups

To fetch the groups for the current user, use the `getGroups` method in the `UserService`.

### Example

```typescript
const groups = await geinsCRM.user.getGroups();
console.log('User Groups:', groups);
```

This method returns an array of groups the user belongs to, enabling permission-based access to different sections of the app.

## Example JSON Structure of User Groups

```json
[
  {
    "id": "admin-group",
    "name": "Administrators"
  },
  {
    "id": "member-group",
    "name": "Members"
  }
]
```

---
