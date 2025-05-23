---
title: Events
description: How to work with event listeners and emitters using the Geins SDK
tags:
  - sdk
  - events
  - core  
---

# Events

This section demonstrates how to work with event listeners and emitters using the Geins SDK.

## Example: Listening for Events

```typescript
geinsCore.events.listnerAdd(event => {
  console.log('Received:', event.subject, event.payload);
}, 'USER_LOGIN');
```


