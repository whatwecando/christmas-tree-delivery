export interface Delivery {
    id: string;
    customerName: string;
    address: string;
    phoneNumber: string;
    treeSize: string;
    isDelivered: boolean;
    deliveryDate?: Date;
}