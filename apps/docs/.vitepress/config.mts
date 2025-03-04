// import { defineConfig } from 'vitepress'
import { HeadConfig, loadEnv } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import { withMermaid } from 'vitepress-plugin-mermaid';
const env = loadEnv('', process.cwd());
const scripts: HeadConfig[] = [];
if (env.VITE_GA_ID) {
  scripts.push(
    ['script', { async: '', src: `https://www.googletagmanager.com/gtag/js?id=${env.VITE_GA_ID}` }],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${env.VITE_GA_ID}');`,
    ],
  );
}
if (env.VITE_CALARIFY_ID) {
  scripts.push([
    'script',
    {},
    `(function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "${env.VITE_CALARIFY_ID}");`,
  ]);
}

// https://vitepress.dev/reference/site-config
export default withMermaid({
  title: 'Geins SDK',
  description: 'A perfect developer experience',
  lang: 'en-US',
  head: [['link', { rel: 'icon', href: '/favicon.ico' }], ...scripts],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      light: '/logo/geins-g.svg',
      dark: '/logo/geins-g-white.svg',
      alt: 'Geins SDK',
    },
    banner: {
      message: '🚀 Welcome to the Geins SDK documentation! Check out the latest updates.',
      link: '/updates',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Guide', link: '/guide/what-is-geins' },
      { text: 'Package Reference', link: '/packages' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            {
              text: 'What is Geins',
              link: '/guide/what-is-geins',
            },
            {
              text: 'Installation',
              link: '/guide/installation',
            },
            {
              text: 'Quickstart',
              link: '/guide/quickstart',
            },
            {
              text: 'Setting up SDK Docs',
              link: '/guide/setting-up-sdk',
            },
          ],
        },
        {
          text: 'Examples',
          items: [
            {
              text: 'Starters using the SDK',
              link: '/guide/examples/starters',
            },
            {
              text: 'Using custom queries',
              link: '/guide/examples/graphql-client',
            },
            {
              text: 'Generate checkout token',
              link: '/guide/examples/generate-checkout-token',
            },
            /* {
              text: 'Routing',
              link: '/guide/examples/routing',
            },
            {
              text: 'Subscribing to events',
              link: '/guide/examples/events',
            }, */
          ],
        },
      ],
      'packages/': [
        {
          text: 'Packages',
          link: '/packages/',
          items: [
            {
              text: '@geins/core',
              link: '/packages/core',
              items: [
                { text: 'Channels', link: '/packages/core/channel' },
                { text: 'Events', link: '/packages/core/events' },
                { text: 'Cookies', link: '/packages/core/cookies' },
                { text: 'Routing', link: '/packages/core/routing' },
                {
                  text: 'GraphQL Client',
                  link: '/packages/core/graphql-client',
                },
              ],
            },
            {
              text: '@geins/cms',
              link: '/packages/cms',
              items: [
                { text: 'Menus', link: '/packages/cms/menu' },
                { text: 'Content Areas', link: '/packages/cms/content-areas' },
                { text: 'Pages', link: '/packages/cms/pages' },
                { text: 'Content', link: '/packages/cms/content' },
                { text: 'Preview', link: '/packages/cms/preview' },
              ],
            },
            {
              text: '@geins/crm',
              link: '/packages/crm',
              items: [
                {
                  text: 'Authentication',
                  link: '/packages/crm/authentication',
                },
                { text: 'Password mgmt', link: '/packages/crm/password' },
                { text: 'Registration', link: '/packages/crm/registration' },
                {
                  text: 'User',
                  link: '/packages/crm/user',
                  items: [
                    { text: 'Profile', link: '/packages/crm/user/profile' },
                    { text: 'Group', link: '/packages/crm/user/group' },
                    { text: 'Balance', link: '/packages/crm/user/balance' },
                    { text: 'Transactions', link: '/packages/crm/user/transactions' },
                  ],
                },
              ],
            },
            {
              text: '@geins/oms',
              link: '/packages/oms',

              items: [
                { text: 'Merchant data', link: '/packages/oms/merchant-data' },
                {
                  text: 'Cart',
                  link: '/packages/oms/cart',
                  items: [
                    { text: 'Items', link: '/packages/oms/cart/items' },
                    { text: 'Promotions', link: '/packages/oms/cart/promotions' },
                    { text: 'Campaigns', link: '/packages/oms/cart/campaigns' },
                    { text: 'Shipping', link: '/packages/oms/cart/shipping' },
                  ],
                },
                {
                  text: 'Checkout',
                  link: '/packages/oms/checkout',
                  items: [
                    { text: 'Process', link: '/packages/oms/checkout/process' },
                    { text: 'Get Checkout', link: '/packages/oms/checkout/get' },
                    { text: 'Validate', link: '/packages/oms/checkout/validate' },
                    { text: 'Create Order', link: '/packages/oms/checkout/create-order' },
                    { text: 'Summary', link: '/packages/oms/checkout/summary' },
                  ],
                },
                { text: 'Order', link: '/packages/oms/order' },
                /*
                { text: 'Token', link: '/packages/oms/checkout-token' },
                { text: 'Using Geins Checkout', link: '/packages/oms/geins-checkout' },
                 */
              ],
            },
          ],
        },
      ],
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present Geins',
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/geins-io/geins-sdk' }],
    outline: {
      level: [2, 4],
    },

    search: {
      provider: 'local',
    },
  },
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin);
    },
  },
  vite: {
    plugins: [groupIconVitePlugin()],
  },
  mermaid: {},
});
