interface Window {
  ic?: {
    plug?: {
      isConnected: boolean;
      requestConnect: (options?: { whitelist: string[] }) => Promise<boolean>;
      createAgent: () => Promise<void>;
      getPrincipal: () => Promise<string>;
      agent?: {
        fetchRootKey: () => Promise<void>;
      };
      requestBalance?: () => Promise<any>;
      transfer?: (options: {
        to: string;
        amount: number;
        memo?: string;
      }) => Promise<any>;
    };
  };
}
