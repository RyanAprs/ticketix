import { Principal } from "@dfinity/principal";

export interface UserType {
  id: string;
  username: string;
}

export interface EventType {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  owner: string;
  salesDeadline: number;
  total: number;
  status: TicketStatusInterface;
}

export type EventStatusInterface = "upComing" | "completed";

export type TicketStatusInterface = "owned" | "forSale" | "used";

export interface TicketType {
  id: string;
  owner: string;
  principal: Principal;
  status: TicketStatusInterface;
  price: number;
  total: number;
  eventId: string;
}

export interface TransactionType {
  id: string;
  amount: number;
  sellerUsername: string;
  buyerUsername: string;
  date: string;
}
