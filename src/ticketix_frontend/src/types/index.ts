export interface UserType {
  id: string;
  username: string;
}

export interface TicketType {
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

export type TicketStatusInterface = "owned" | "forSale" | "used";
