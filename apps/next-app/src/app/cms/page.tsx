"use client";

import React, { useState } from 'react';
import { GeinsCore, GeinsCredentialsAPI, GeinsAPILocalization } from '@geins/core';
import { GeinsCMS } from '@geins/cms';

const Home = () => {
  const [items, setItems] = useState<string[]>([]);
  const localization: GeinsAPILocalization = {
    channelId: process.env.NEXT_PUBLIC_CHANNEL_ID,
    marketId: process.env.NEXT_PUBLIC_MARKET_ID,
    languageId: process.env.NEXT_PUBLIC_LANGUAGE_ID,
  };
  const geinsCore = new GeinsCore({
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    accountName: process.env.NEXT_PUBLIC_ACCOUNT_NAME,
  });
  const geinsCMS = new GeinsCMS(geinsCore);

  const getContentArea = async () => {
    const response = await geinsCMS.content.area('Frontpage', 'The front page area', {}, localization);
    if (response.loading) {
      console.info('loading');
      return;
    }
    if (!response.data) {
      console.info('no data');
      return;
    }

    const data = response.data;
    setItems(prevItems => [ `${new Date().toISOString()} :: -----------------`, JSON.stringify(data), ...prevItems]);
  };

  const getPage = async () => {
    const response = await geinsCMS.content.page('om-oss', {}, localization);
    if (response.loading) {
      console.info('loading');
      return;
    }
    if (!response.data) {
      console.info('no data');
      return;
    }

    const data = response.data;
    setItems(prevItems => [ `${new Date().toISOString()} :: -----------------`, JSON.stringify(data), ...prevItems]);
  };

  return (
    <main>
      <h2>Next.js @geins/CMS Test</h2>
      <button onClick={getContentArea}>Get Content Area</button>
      <button onClick={getPage}>Get Page</button>
      <div>
        {items.map((item, index) => (
          <>
          <br/>
          <code>
            {item}
           </code>
           </>
        ))}
      </div>
    </main>
  );
};

export default Home;
