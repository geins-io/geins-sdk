// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import { geinsSharedConfig } from '@geins/eslint-config/eslint-config.js';

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
const config = createConfigForNuxt({
  features: {
    // Rules for module authors
    tooling: true,
  },
  dirs: {
    src: ['./playground'],
  },
});

geinsSharedConfig.forEach((conf) => {
  config.append(conf);
});

export default config;
