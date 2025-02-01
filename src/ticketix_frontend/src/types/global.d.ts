interface Window {
  ic?: {
    plug?: {
      requestConnect: () => Promise<boolean>;
      requestTransfer: (params: {
        to: Principal;
        amount: number;
      }) => Promise<number>;
      getPrincipal: () => Promise<Principal>;
      isConnected: () => Promise<boolean>;
    };
  };
}
