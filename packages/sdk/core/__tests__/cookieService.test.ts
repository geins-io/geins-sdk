import { CookieService } from '@geins/core';

type DocumentStub = { cookie: string };
const globalWithDocument = globalThis as { document?: DocumentStub };

/** A document whose cookie string is fixed and whose writes are recorded verbatim. */
function stubDocument(cookieString = ''): string[] {
  const writes: string[] = [];
  globalWithDocument.document = {
    get cookie() {
      return cookieString;
    },
    set cookie(value: string) {
      writes.push(value);
    },
  };
  return writes;
}

afterEach(() => {
  delete globalWithDocument.document;
});

describe('CookieService on a server without a document', () => {
  it('get returns an empty string', () => {
    expect(new CookieService().get('anything')).toBe('');
  });

  it('getAll returns an empty object', () => {
    expect(new CookieService().getAll()).toEqual({});
  });

  it('set and remove do nothing and do not throw', () => {
    const service = new CookieService();
    expect(() => service.set({ name: 'a', payload: 'b' })).not.toThrow();
    expect(() => service.remove('a')).not.toThrow();
  });
});

describe('CookieService in a browser', () => {
  describe('set', () => {
    it('writes the default options, including Max-Age=0 when no maxAge is given', () => {
      const writes = stubDocument();
      new CookieService().set({ name: 'n', payload: 'v' });
      expect(writes).toEqual(['n=v; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax']);
    });

    it('writes no Max-Age when the cookie passes maxAge as undefined', () => {
      const writes = stubDocument();
      new CookieService().set({ name: 'n', payload: 'v', maxAge: undefined });
      expect(writes).toEqual(['n=v; Path=/; HttpOnly; Secure; SameSite=Lax']);
    });

    it('applies the constructor config', () => {
      const writes = stubDocument();
      new CookieService({
        path: '/shop',
        domain: 'example.com',
        secure: false,
        httpOnly: false,
        sameSite: 'strict',
        maxAge: '3600',
      }).set({ name: 'n', payload: 'v' });
      expect(writes).toEqual(['n=v; Max-Age=3600; Domain=example.com; Path=/shop; SameSite=Strict']);
    });

    it('lets the call config override the constructor, and the cookie override both', () => {
      const writes = stubDocument();
      new CookieService({ path: '/a', sameSite: 'strict', maxAge: 10 }).set(
        { name: 'n', payload: 'v', maxAge: 30 },
        { path: '/b', sameSite: 'none', maxAge: 20 },
      );
      expect(writes).toEqual(['n=v; Max-Age=30; Path=/b; HttpOnly; Secure; SameSite=None']);
    });

    it('URL-encodes the payload', () => {
      const writes = stubDocument();
      new CookieService({ httpOnly: false }).set({ name: 'n', payload: 'v w;=' });
      expect(writes).toEqual(['n=v%20w%3B%3D; Max-Age=0; Path=/; Secure; SameSite=Lax']);
    });

    it('writes an object payload as JSON, as untyped callers may pass one', () => {
      const writes = stubDocument();
      const payload = { id: 1 } as unknown as string;
      new CookieService({ httpOnly: false, secure: false }).set({ name: 'n', payload });
      expect(writes).toEqual([`n=${encodeURIComponent('{"id":1}')}; Max-Age=0; Path=/; SameSite=Lax`]);
    });

    it('writes an undefined payload as an empty value', () => {
      const writes = stubDocument();
      const payload = undefined as unknown as string;
      new CookieService({ httpOnly: false, secure: false }).set({ name: 'n', payload });
      expect(writes).toEqual(['n=; Max-Age=0; Path=/; SameSite=Lax']);
    });

    it('floors a fractional maxAge and treats an unparsable one as 0', () => {
      const writes = stubDocument();
      const service = new CookieService({ secure: false, httpOnly: false });
      service.set({ name: 'a', payload: 'v', maxAge: 1.7 });
      service.set({ name: 'b', payload: 'v', maxAge: 'abc' });
      expect(writes).toEqual([
        'a=v; Max-Age=1; Path=/; SameSite=Lax',
        'b=v; Max-Age=0; Path=/; SameSite=Lax',
      ]);
    });

    it('writes no Max-Age for a null or infinite maxAge', () => {
      const writes = stubDocument();
      const service = new CookieService({ secure: false, httpOnly: false, maxAge: 10 });
      const nullMaxAge = null as unknown as number;
      service.set({ name: 'a', payload: 'v', maxAge: nullMaxAge });
      service.set({ name: 'b', payload: 'v', maxAge: Infinity });
      service.set({ name: 'c', payload: 'v', maxAge: -Infinity });
      expect(writes).toEqual([
        'a=v; Path=/; SameSite=Lax',
        'b=v; Path=/; SameSite=Lax',
        'c=v; Path=/; SameSite=Lax',
      ]);
    });

    it('throws for a NaN maxAge', () => {
      stubDocument();
      expect(() => new CookieService().set({ name: 'a', payload: 'v', maxAge: NaN })).toThrow();
    });
  });

  describe('get', () => {
    it('returns the decoded value of the named cookie', () => {
      stubDocument('a=1x; b=v%20w%3B%3D');
      expect(new CookieService().get('b')).toBe('v w;=');
    });

    it('returns an empty string for a missing cookie', () => {
      stubDocument('a=1x');
      expect(new CookieService().get('missing')).toBe('');
    });

    it('returns the first value when a name occurs twice', () => {
      stubDocument('a=first; a=second');
      expect(new CookieService().get('a')).toBe('first');
    });

    it('parses JSON values and falls back to the raw string', () => {
      stubDocument(`num=123; arr=${encodeURIComponent('[{"id":1}]')}; text=abc; bad=%E0%A4%A`);
      const service = new CookieService();
      expect(service.get('num') as unknown).toBe(123);
      expect(service.get('arr') as unknown).toEqual([{ id: 1 }]);
      expect(service.get('text')).toBe('abc');
      expect(service.get('bad')).toBe('%E0%A4%A');
    });

    it('returns an empty string for values that parse to a falsy JSON value', () => {
      stubDocument('zero=0; no=false; nil=null; empty=');
      const service = new CookieService();
      expect(['zero', 'no', 'nil', 'empty'].map((name) => service.get(name))).toEqual(['', '', '', '']);
    });

    it('strips the surrounding quotes of a quoted value before decoding it', () => {
      stubDocument('q="quoted%20v"; open="abc');
      const service = new CookieService();
      expect(service.get('q')).toBe('quoted v');
      expect(service.get('open')).toBe('ab');
    });
  });

  describe('getAll', () => {
    it('returns every cookie with JSON values parsed', () => {
      stubDocument('a=v%20w; num=123; no=false; empty=; q="quoted"');
      const all = new CookieService().getAll();
      expect(all).toEqual({ a: 'v w', num: 123, no: false, empty: '', q: 'quoted' });
      expect(Object.getPrototypeOf(all)).toBe(Object.prototype);
    });

    it('drops cookies named like Object.prototype members, so __proto__ cannot set the prototype', () => {
      stubDocument(`__proto__=${encodeURIComponent('{"polluted":1}')}; toString=1; constructor=x; a=1`);
      const all = new CookieService().getAll();
      expect(Object.keys(all)).toEqual(['a']);
      expect(Object.getPrototypeOf(all)).toBe(Object.prototype);
      expect((all as Record<string, unknown>).polluted).toBeUndefined();
      expect(typeof all.hasOwnProperty).toBe('function');
    });

    it('returns an empty object when the document has no cookies', () => {
      stubDocument('');
      expect(new CookieService().getAll()).toEqual({});
    });
  });

  describe('remove', () => {
    it('expires the cookie on path / regardless of the service config', () => {
      const writes = stubDocument('n=v');
      new CookieService({ path: '/shop', domain: 'example.com' }).remove('n');
      expect(writes).toEqual(['n=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT']);
    });
  });
});
