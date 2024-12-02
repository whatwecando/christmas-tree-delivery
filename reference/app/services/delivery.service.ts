import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-database';
import { Observable } from '@nativescript/core';
import { Delivery } from '../models/delivery.model';

export class DeliveryService extends Observable {
    private database;

    constructor() {
        super();
        this.database = firebase().database();
        this.setupRealtimeUpdates();
    }

    private setupRealtimeUpdates() {
        this.database.ref('deliveries').on('value', (snapshot) => {
            const deliveries = [];
            snapshot.forEach(child => {
                deliveries.push({
                    id: child.key,
                    ...child.val()
                });
            });
            this.notify({ eventName: 'deliveriesUpdated', object: this, data: deliveries });
        });
    }

    async getDeliveries(): Promise<Delivery[]> {
        const snapshot = await this.database.ref('deliveries').once('value');
        const deliveries: Delivery[] = [];
        snapshot.forEach(child => {
            deliveries.push({
                id: child.key,
                ...child.val()
            });
        });
        return deliveries;
    }

    async updateDeliveryStatus(deliveryId: string, isDelivered: boolean): Promise<void> {
        return this.database.ref(`deliveries/${deliveryId}`).update({
            isDelivered,
            deliveryDate: isDelivered ? new Date().toISOString() : null
        });
    }
}