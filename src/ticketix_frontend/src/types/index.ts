export interface UserType {
  id: string;
  username: string;
  balance: number;
  tickets: TicketType[];
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
  isSold: boolean;
}
