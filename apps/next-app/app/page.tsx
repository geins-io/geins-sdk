"use client";

import { useState } from 'react';
import { GeinsCore } from '@geins/core';
//const geinsAPI = new GeinsCore('CF2FF80B-6F85-4CD9-ACE5-F41962891E07','demogeins');



export default function Home() {
  const [myItems, setMyItems] = useState<Array<{ id: number; name: string }>>([]);

  const handleClick = () => {

  };

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
