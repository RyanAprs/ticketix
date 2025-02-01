import { Principal } from "@dfinity/principal";

interface TransferParams {
  to: string;
  amount: number;
  ticketIds: string[];
}

export const getPlugWallet = async () => {
  if (window.ic?.plug) {
    return window.ic.plug;
  }

  return new Promise((resolve) => {
    window.addEventListener("load", () => {
      resolve(window.ic?.plug || null);
    });
  });
};

export const transferIcp = async ({ to, amount }: TransferParams) => {
  try {
    const plugWallet = await getPlugWallet();

    if (!plugWallet) {
      throw new Error("Plug wallet not found");
    }

    const connected = await window.ic?.plug?.requestConnect();
    if (!connected) {
      throw new Error("Failed to connect to Plug wallet");
    }

    const e8sAmount = amount * 100000000;

    const requestTransfer = {
      to: Principal.fromText(to),
      amount: e8sAmount,
    };

    const height = await window.ic?.plug?.requestTransfer(requestTransfer);

    return {
      success: true,
      blockHeight: height,
    };
  } catch (error) {
    console.error("Transfer failer:", error);
    throw error;
  }
};
