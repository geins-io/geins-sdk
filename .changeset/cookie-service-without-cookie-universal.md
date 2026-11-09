---
'@geins/core': patch
---

Drop `cookie-universal` from `@geins/core`.

`CookieService` now reads and writes `document.cookie` itself, using `cookie` 1.x for parsing and
serializing. `cookie-universal` pinned `cookie` to 0.4, which is affected by GHSA-pxg6-pf52-xh8x
(`cookie` below 0.7 accepts out-of-bounds characters in a cookie's name, path and domain), and no
`cookie-universal` release moves past it.

Behaviour is unchanged for valid input. Without a `document`, as on a server, every method is
still a no-op: `get` returns `''` and `getAll` returns `{}`. In a browser, `get` and `getAll` still
parse values that are valid JSON, still strip surrounding quotes from a value, and `get` still
returns `''` for a value that parses to a falsy JSON value such as `0` or `false`. `set` writes the
same cookie string as before, still rounds a fractional `maxAge` down, still writes no `Max-Age` for a `null` one, and
still writes an object payload as JSON. An infinite `maxAge` now writes no `Max-Age` instead of
`Max-Age=Infinity`, which browsers ignored, so it stays a session cookie. `getAll` still leaves
out cookies named like an `Object.prototype` member, such as `__proto__`. `remove` still expires
the cookie on path `/`.

Invalid input now throws: `set` now applies `cookie`'s own validation to name, path and domain,
where `cookie-universal` wrote them as is. A name with a space or `=`, or a path or domain
containing `;`, now throws. That is the fix from the advisory.
