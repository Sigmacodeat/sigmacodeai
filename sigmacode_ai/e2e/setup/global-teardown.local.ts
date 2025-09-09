import cleanupUser from './cleanupUser';

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

async function globalTeardown() {
  try {
    await cleanupUser(localUser);
  } catch (error) {
    console.error('Error:', error);
  }
}

export default globalTeardown;
