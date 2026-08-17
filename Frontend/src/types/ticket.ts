export type PaymentMethod = "cash" | "card" | "transfer";
export type TicketStatus = "waiting_payment" | "paid" | "cancelled";

export interface TicketUser {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface TicketEmployee {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface TicketClient {
  _id: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface TicketAppointment {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface TicketItemService {
  _id: string;
  name: string;
  price: number;
  duration: number;
}

export interface TicketItem {
  service: string | TicketItemService;
  employee: string | TicketEmployee;
  name: string;
  originalPrice: number;
  finalPrice: number;
  duration?: number;
}

export interface TicketEdit {
  editedBy: string | TicketUser;
  editedAt: string;
  previous: {
    items: TicketItem[];
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: PaymentMethod;
    notes?: string;
  };
}

export interface Ticket {
  _id: string;
  ticketNumber: string;

  client: TicketClient;
  employee: TicketEmployee;
  appointment?: TicketAppointment;

  items: TicketItem[];

  subtotal: number;
  discount: number;
  total: number;

  paymentMethod: PaymentMethod;
  status: TicketStatus;

  notes?: string;

  createdBy: TicketUser;
  cancelledBy?: TicketUser;
  cancelledAt?: string;

  edits?: TicketEdit[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketService {
  service: string;
  finalPrice: number;
}

export interface CreateTicketPayload {
  client: string;
  appointment?: string;

  items: {
    service: string;
    employee: string;
    finalPrice: number;
  }[];

  discount?: number;
  notes?: string;

  paymentMethod: "cash" | "card" | "transfer";
}

export interface UpdateTicketPayload {
  items?: {
    service: string;
    employee: string;
    finalPrice: number;
  }[];
  discount?: number;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

export interface PayTicketPayload {
  paymentMethod: PaymentMethod;
}
