<script lang="ts">
  import {
    GeinsCore,
    GeinsRouter,
    type GeinsCredentialsAPI,
    type GeinsAPILocalization,
  } from "@geins/core";
  import { GeinsCMS, type ContentAreaVariabels } from "@geins/cms";

  const API_KEY = "CF2FF80B-6F85-4CD9-ACE5-F41962891E07";
  const ACCOUNT_NAME = "DEMOGEINS";
  const ENVIRONMENT = "PRODUCTION";
  const CHANNEL_ID = "1|se";
  const MARKET_ID = "se";
  const LANGUAGE_ID = "sv-SE";

  const localization: GeinsAPILocalization = {
    channelId: CHANNEL_ID,
    marketId: MARKET_ID,
    languageId: LANGUAGE_ID,
  };
  const geinsCore = new GeinsCore({
    apiKey: API_KEY,
    accountName: ACCOUNT_NAME,
  });

  const geinsCMS = new GeinsCMS(geinsCore);

  let items: any[] = [];
  function getContentArea() {
    geinsCMS.content
      .area("Frontpage", "The front page area", {}, localization)
      .then((response) => {
        if (response.loading) {
          console.info("loading");
          return;
        }
        if (!response.data) {
          console.info("no data");
          return;
        }
        const data = response.data;
        items = [
          `${new Date().toISOString()} :: -----------------`,
          JSON.stringify(data),
          ...items,
        ];
      });
  }
  function getPage() {
    geinsCMS.content.page("om-oss", {}, localization).then((response) => {
      if (response.loading) {
        console.info("loading");
        return;
      }
      if (!response.data) {
        console.info("no data");
        return;
      }
      const data = response.data;
      items = [
        `${new Date().toISOString()} :: -----------------`,
        JSON.stringify(data),
        ...items,
      ];
    });
  }
</script>

<h2>Svelte @geins/CMS Test</h2>
<button on:click={getContentArea}> Get Content Area </button>
<button on:click={getPage}> Get Page</button>
<div>
  <!-- Loop items in <p>-->
  {#each items as item}
    <br />
    <code>{item}</code>
  {/each}
</div>
