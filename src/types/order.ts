export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email?: string;
}

export interface HistoryEntry {
  timestamp: number;
  action: string;
  previousStatus: DeliveryStatus;
  newStatus: DeliveryStatus;
}

export interface TreeOrder {
  id: string;
  customer: Customer;
  treeSize: number;
  colorCode: string;
  orderDate: string;
  requestScoutDelivery: boolean;
  deliveryStatus: DeliveryStatus;
  notes?: string;
  history?: HistoryEntry[];
}

export enum DeliveryStatus {
  PENDING = "À LIVRER",
  DELIVERED = "LIVRÉ"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  REFUNDED = "REFUNDED"
}
