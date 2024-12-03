# Events

This section demonstrates how to work with event listeners and emitters using the Geins SDK.

## Example: Listening for Events

```typescript
geinsCore.events.listnerAdd(event => {
  console.log('Received:', event.subject, event.payload);
}, 'USER_LOGIN');
```


