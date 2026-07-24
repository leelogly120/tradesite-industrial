import { defineConfig } from 'astro/config';
import baseConfig from '../astro.config.mjs';

const productInquiryFixture = {
  name: 'product-inquiry-playwright-fixture',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      injectRoute({
        pattern: '/__tests__/product-inquiry/',
        entrypoint: './tests/fixtures/product-inquiry.astro',
        prerender: true,
      });
    },
  },
};

export default defineConfig({
  ...baseConfig,
  integrations: [...(baseConfig.integrations || []), productInquiryFixture],
});
