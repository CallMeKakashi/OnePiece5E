declare module "@foundryvtt/foundryvtt-cli" {
  interface CompileOptions {
    yaml?: boolean;
    log?: boolean;
  }

  export function compilePack(
    src: string,
    dest: string,
    options?: CompileOptions,
  ): Promise<void>;

  export function extractPack(
    src: string,
    dest: string,
    options?: CompileOptions,
  ): Promise<void>;
}
