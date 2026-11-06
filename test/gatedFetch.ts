/**
 * A `fetch` mock that holds every request until the test opens the gate, so a test can count the
 * requests while every read is still in flight: the reads provably overlap. Each held request is
 * answered with `answer(auth)`, where `auth` is the `Authorization` header that request carried.
 */
export function gatedFetch(answer: (auth: string | null) => unknown) {
  const held: { auth: string | null; open: () => void }[] = [];
  const spy = jest.spyOn(globalThis, 'fetch').mockImplementation(
    (_input, init) =>
      new Promise((resolve) => {
        const auth = new Headers(init?.headers as HeadersInit).get('authorization');
        held.push({
          auth,
          open: () =>
            resolve(
              new Response(JSON.stringify({ data: answer(auth) }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }),
            ),
        });
      }),
  );

  /** Lets every started read reach `fetch`, or join a call already there. */
  const settle = async () => {
    for (let i = 0; i < 10; i++) await new Promise((resolve) => setTimeout(resolve, 0));
  };

  const open = () => held.forEach((request) => request.open());

  return { spy, held, settle, open };
}
