export enum DeliveryStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED'
}

export interface Customer {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface TreeSize {
  id: number;
  name: string;
  height: string;
  price: number;
}

export interface TreeOrder {
  id: string;
  customer: Customer;
  treeSize: number;
  colorCode: string;
  price: number;
  orderDate: string;
  requestScoutDelivery: boolean;
  deliveryStatus: DeliveryStatus;
  paymentStatus: PaymentStatus;
  history: {
    timestamp: number;
    action: string;
    previousStatus: DeliveryStatus;
    newStatus: DeliveryStatus;
  }[];
}

export interface OrderUpdate {
  deliveryStatus: DeliveryStatus;
  notes?: string;
}
