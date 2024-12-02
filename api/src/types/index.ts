export interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt: number;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  SCOUT = 'SCOUT'
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email?: string;
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
  history: HistoryEntry[];
  createdBy: string;
  updatedBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface HistoryEntry {
  timestamp: number;
  action: string;
  userId: string;
  previousStatus: DeliveryStatus;
  newStatus: DeliveryStatus;
}

export enum DeliveryStatus {
  PENDING = "À LIVRER",
  DELIVERED = "LIVRÉ"
}
