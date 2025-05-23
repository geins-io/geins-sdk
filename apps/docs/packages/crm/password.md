---
title: Password Management
description: How to work with password management in the Geins CRM Package
tags:
  - sdk
  - crm
  - password
  - password-management
---

# Password Management

### Change Password

To change a user's password:

```typescript
const changePasswordResult = await geinsCRM.auth.changePassword({
  username: 'user@example.com',
  password: 'newPassword123',
});

if (changePasswordResult?.succeeded) {
  console.log('Password changed successfully');
} else {
  console.error('Failed to change password');
}
```

## Password reset

To to initiate a password reset, call the user.password.requestReset method with the user's email address. This will send an email to the user with a reset key.

```typescript
const resetResult = await geinsCRM.auth.user.password.requestReset('user@example.com');
```

After the user has initiated the password reset, they need to submit a new password. This is done by calling the user.password.commitReset method with the reset key and the new password.

```typescript
const resetResult = await geinsCRM.auth.user.password.commitReset('reset-key', 'newPassword123');
```

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant GeinsCRM
    participant PasswordResetService
    User->>Frontend: Request password reset
    Frontend->>GeinsCRM: user.password.requestReset(email)
    GeinsCRM->>PasswordResetService: request(email)
    PasswordResetService-->>GeinsCRM: Reset token
    GeinsCRM-->>Frontend: Reset token
    Frontend-->>User: Confirmation
    User->>Frontend: Submit new password
    Frontend->>GeinsCRM: user.password.commitReset(token, password)
    GeinsCRM->>PasswordResetService: commit(token, password)
    PasswordResetService-->>GeinsCRM: Result
    GeinsCRM-->>Frontend: Result
    Frontend-->>User: Password reset confirmation

```
