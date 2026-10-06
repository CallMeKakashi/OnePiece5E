import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.mjs"],
    testTimeout: 30000,   // the audit tests spawn a TypeScript run; a busy machine (a ship check running) needs more than 5 s
  },
});

