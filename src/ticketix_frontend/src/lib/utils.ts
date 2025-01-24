import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from "../../../declarations/ticketix_backend/ticketix_backend.did";
import { UserType } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
      isSold: ticket.isSold || false,
    })),
  };
};
