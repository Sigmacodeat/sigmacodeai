// Empty shim for Node-only modules when bundling for the browser.
// Used via Vite resolve.alias to satisfy imports requested by node polyfill plugins.
// If a consumer tries to import anything from here, it will get benign defaults.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const empty: any = {};
export default empty;

export const noop = () => {};
export const emptyAsync = async () => undefined;
