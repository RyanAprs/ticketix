import React, { useEffect, useState } from "react";
import LayoutDashboard from "@/components/ui/Layout/LayoutDashboard";
import { useAuthManager } from "@/store/AuthProvider";
import { ArrowUpDown, Copy, ExternalLink, Wallet } from "lucide-react";

const WalletPage = () => {
  const { actor, principal } = useAuthManager();
  const [icpBalance, setIcpBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const principalText = principal ? principal.toString() : "Not connected";

  useEffect(() => {
    if (actor && principal) {
      const fetchBalance = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const result = await actor.getUserBalance(principal);
          console.log(result);

          if (result && result.length > 0) {
            const balance = result[0]?.balance;
            const numericBalance = Number(balance);
            setIcpBalance(isNaN(numericBalance) ? 0 : numericBalance);
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch balance"
          );
          console.error("Error fetching balance:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBalance();
    }
  }, [actor, principal]);

  const handleCopyAddress = () => {
    if (principal) {
      navigator.clipboard
        .writeText(principal.toString())
        .then(() => {
          console.log("Address copied to clipboard");
        })
        .catch((err) => {
          console.error("Failed to copy address:", err);
        });
    }
  };

  return (
    <LayoutDashboard>
      <div className="p-6 w-full bg-gray-50">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-title lg:text-3xl">
                Your Wallet
              </h1>
              <p className="mt-1 text-lg text-gray-500">
                Manage your ICP tokens and transactions
              </p>
            </div>
          </div>

          {/* Main Wallet Card */}
          <div>
            <div className="pb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-10 w-10" />
                <p className="text-xl">ICP Wallet</p>
              </div>
            </div>
            <div>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Balance Section */}
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm font-medium text-gray-500">
                      Total Balance
                    </p>
                    <div className="mt-2 flex items-baseline">
                      <span className="text-3xl font-bold">{icpBalance}</span>
                      <span className="ml-2 text-lg font-medium text-gray-500">
                        ICP
                      </span>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xl font-medium text-gray-500">
                      Wallet Address
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-full overflow-hidden text-ellipsis rounded-md bg-white p-2 text-lg">
                        {principalText}
                      </div>
                      <button
                        onClick={handleCopyAddress}
                        className="rounded-md p-2 hover:bg-gray-100"
                        title="Copy address"
                      >
                        <Copy className="h-8 w-h-8" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions Section */}
              <div className="mt-6">
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                  <ArrowUpDown className="h-4 w-4" />
                  Recent Transactions
                </h3>
                <div className="rounded-lg border">
                  <div className="p-4 text-center text-sm text-gray-500">
                    No recent transactions
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="mt-6 flex flex-wrap gap-4">
                <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Send
                  <ArrowUpDown className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
                  View on Explorer
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutDashboard>
  );
};

export default WalletPage;
