import { FullConfig } from '@playwright/test';
import authenticate from './authenticate';

// Resolve local user config with fallback to example
// eslint-disable-next-line @typescript-eslint/no-var-requires
const localUser = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('../config.local').default;
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('../config.local.example').default;
  }
})();

async function globalSetup(config: FullConfig) {
  await authenticate(config, localUser);
}

export default globalSetup;
