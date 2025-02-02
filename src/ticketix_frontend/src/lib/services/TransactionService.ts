import { Principal } from "@dfinity/principal";
import { _SERVICE } from "../../../../declarations/ticketix_backend/ticketix_backend.did";
import { getUserById } from "./UserService";
import { formatNSToDate } from "../utils";

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

export const getTransactions = async (actor: _SERVICE, userId: Principal) => {
  try {
    const transactions = await actor.getTransactionByUserId(userId);

    if ("ok" in transactions) {
      const transactionsData = transactions.ok;

      const owners = [
        ...new Set(
          transactionsData.flatMap((tx: any) => [
            tx.buyer.toString(),
            tx.seller.toString(),
          ])
        ),
      ];

      const users = await Promise.all(
        owners.map(async (owner: string) => {
          try {
            const ownerPrincipal = Principal.fromText(owner);
            const user = await getUserById(actor, ownerPrincipal);
            return {
              owner,
              username: user?.username || "Unknown User",
            };
          } catch (error) {
            console.error(`Error fetching user for owner ${owner}:`, error);
            return { owner, username: "Error" };
          }
        })
      );

      const userMap = users.reduce(
        (acc, { owner, username }) => ({ ...acc, [owner]: username }),
        {} as Record<string, string>
      );

      return transactionsData.map((tx: any) => ({
        id: tx.id,
        amount: tx.amount,
        sellerUsername: userMap[tx.seller.toString()] || "Unknown Seller",
        buyerUsername: userMap[tx.buyer.toString()] || "Unknown Buyer",
        date: formatNSToDate(BigInt(tx.timestamp)),
      }));
    } else {
      console.error("Error fetching transactions:", transactions);
      return [];
    }
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
};
