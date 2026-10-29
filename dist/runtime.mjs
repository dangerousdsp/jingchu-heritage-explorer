// A deployment can point this at another host that serves the original build.
export const RUNTIME_BASE = new URL('./runtime/', import.meta.url).href;
export const CORE_TRANSFER_MIB = 348;
