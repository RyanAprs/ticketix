import BigNumber from "bignumber.js";

import {
  ticketStatus,
  User,
} from "../../../../declarations/ticketix_backend/ticketix_backend.did";
import { TicketStatus, UserType } from "@/types";

export const generateRandomString = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

export const serializeUser = (user: User): UserType => {
  return {
    id: user.id.toText(),
    username: user.username,
    balance: Number(user.balance),
    tickets: user.tickets.map((ticket) => ({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      price: Number(ticket.price),
      total: Number(ticket.total),
      owner: ticket.owner.toText(),
      imageUrl: ticket.imageUrl || "",
      salesDeadline: Number(ticket.salesDeadline) * 1000,
      status: mapMotokoTicketStatusToFrontend(ticket.status),
    })),
  };
};

const mapMotokoTicketStatusToFrontend = (
  status: ticketStatus
): TicketStatus => {
  if ("owned" in status) return "owned";
  if ("forSale" in status) return "forSale";
  if ("used" in status) return "used";
  throw new Error("Invalid ticket status from backend");
};

export const formatNSToDate = (nanoseconds: bigint): string => {
  // Convert nanoseconds to milliseconds
  const milliseconds = Number(nanoseconds / BigInt(1_000_000));

  // Create a Date object
  const date = new Date(milliseconds);

  // Format the date (e.g., "10 November 2024")
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
};

// Convert ICP to e8s (smallest unit)
export const convertToE8s = (icp: number) => {
  return Math.floor(icp * 10 ** 8);
};

// Convert e8s back to ICP for display
export const convertToICP = (e8s: number) => {
  return e8s / 10 ** 8;
};

export const convertUsdToIcp = (
  usdAmount: number | string,
  icpPrice: number,
  decimals: number = 4
): number => {
  const amount = new BigNumber(usdAmount);
  const price = new BigNumber(icpPrice);

  const icpAmount = amount.dividedBy(price);

  return Number(icpAmount.toFixed(decimals));
};

export const convertIcpToUsd = (
  icpAmount: number | string,
  icpPrice: number,
  decimals: number = 2
): number => {
  const amount = new BigNumber(icpAmount);
  const price = new BigNumber(icpPrice);

  const usdAmount = amount.multipliedBy(price);

  return Number(usdAmount.toFixed(decimals));
};
