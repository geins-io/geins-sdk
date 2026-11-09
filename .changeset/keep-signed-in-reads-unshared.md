---
'@geins/core': patch
---

A read sent with headers (a `userToken`, or `requestOptions.context.headers`) now always makes its own
request instead of joining an identical read in flight, with its own timeout and retries, so more requests
can reach the API than before. A caller's `queryDeduplication: true` does not change this. Reads without
headers are unchanged. No API change.
