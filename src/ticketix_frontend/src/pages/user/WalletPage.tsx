import React, { useEffect, useState } from "react";

import { CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/Button/button";
import { CustomInput } from "@/components/ui/Input/CustomInput";
import LayoutDashboard from "@/components/ui/Layout/LayoutDashboard";
import ModalCustom from "@/components/ui/Modal/ModalCustom";
import useUser from "@/hooks/useUser";
import { convertToE8s, convertToICP } from "@/lib/utils";
import { useAuthManager } from "@/store/AuthProvider";

const WalletPage = () => {
  const { actor } = useAuthManager();
  //   const { getICPBalance, getCreditBalance, user } = useUser();

  const [icpBalance, setIcpBalance] = useState("0");
  const [creditBalance, setCreditBalance] = useState("0");
  // const [depositAddress, setDepositAddress] = useState(
  //   user?.depositAddress ?? '',
  // );
  const [amount, setAmount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //   useEffect(() => {
  //     getICPBalance().then((result) => {
  //       setIcpBalance(convertToICP(parseInt(result.toString())).toString());
  //     });
  //   }, [getICPBalance]);

  //   useEffect(() => {
  //     getCreditBalance().then((result) => {
  //       setCreditBalance(convertToICP(parseInt(result.toString())).toString());
  //     });
  //   }, [getCreditBalance]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };

  // HANDLE WITHDRAW
  const handleWithdrawal = async () => {
    // if (!actor) return;
    // if (amount <= 0) {
    //   alert('Please enter a valid amount');
    //   return;
    // }
    // // if (!depositAddress) {
    // //   alert('Please enter your withdrawal address');
    // //   return;
    // // }
    // try {
    //   setIsLoading(true);
    //   const amountInE8s = BigInt(convertToE8s(amount));
    //   const result = await actor.withdraw(amountInE8s);
    //   if ('ok' in result) {
    //     getICPBalance().then((result) => {
    //       setIcpBalance(convertToICP(parseInt(result.toString())).toString());
    //     });
    //     getCreditBalance().then((result) => {
    //       setCreditBalance(
    //         convertToICP(parseInt(result.toString())).toString(),
    //       );
    //     });
    //     alert('Withdrawal successful');
    //     setOpenModal(false);
    //   } else if ('err' in result) {
    //     alert(`Withdrawal failed: ${result.err}`);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   alert('An error occurred');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const copyToClipboard = () => {
    // if (user?.depositAddress) {
    //   navigator.clipboard.writeText(user.depositAddress).then(() => {
    //     console.log('Copied to clipboard');
    //   });
    // }
  };

  return (
    <LayoutDashboard title="My Wallet" className="w-full">
      <h1 className="text-2xl font-semibold text-title lg:text-3xl">
        My Wallet
      </h1>
      <div className="mt-3 space-y-5 text-subtext md:w-fit">
        <div className="rounded-lg border p-4 pt-3 shadow-custom">
          <h2 className="text-xl font-semibold text-title">ICP Wallet</h2>
          <div className="mt-2 flex flex-col gap-2 md:flex-row md:gap-5">
            <div>
              <p className="font-medium">Balance</p>
              <p className="font-montserrat text-lg font-medium md:text-xl">
                {icpBalance} ICP
              </p>
            </div>

            <div>
              <p className="font-medium">Deposit Address</p>
              <div className="mt-1 flex items-center gap-3">
                <p className="h-full w-full resize-none break-all rounded-sm bg-mainAccent/30 px-4 py-2 font-montserrat text-sm font-medium focus:outline-none focus:ring-0 md:w-[500px] md:text-base">
                  {/* {user?.depositAddress} */}
                </p>
                <CopyIcon
                  onClick={copyToClipboard}
                  className="cursor-pointer text-subtext hover:text-black"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutDashboard>
  );
};

export default WalletPage;
