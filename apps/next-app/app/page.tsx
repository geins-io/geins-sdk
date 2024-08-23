'use client';

import { useState } from 'react';

export default function Home() {
  const [myItems, setMyItems] = useState<Array<{ id: number; name: string }>>(
    [],
  );

  const handleClick = () => {};

  return (
    <main>
      <h2>Next.js @geins/core Test</h2>
      <button onClick={handleClick}>Get Data</button>
      <ul>
        {myItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </main>
  );
}
