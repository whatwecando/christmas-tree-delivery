import { Observable } from '@nativescript/core';
import { Delivery } from './models/delivery.model';
import { DeliveryService } from './services/delivery.service';

export class MainViewModel extends Observable {
    private deliveryService: DeliveryService;
    private _deliveries: Delivery[] = [];

    constructor() {
        super();
        this.deliveryService = new DeliveryService();
        this.loadDeliveries();
        
        this.deliveryService.on('deliveriesUpdated', (args: any) => {
            this.deliveries = args.data;
        });
    }

    get deliveries(): Delivery[] {
        return this._deliveries;
    }

    set deliveries(value: Delivery[]) {
        if (this._deliveries !== value) {
            this._deliveries = value;
            this.notifyPropertyChange('deliveries', value);
        }
    }

    async loadDeliveries() {
        try {
            this.deliveries = await this.deliveryService.getDeliveries();
        } catch (error) {
            console.error('Error loading deliveries:', error);
        }
    }

    async onStatusChange(args) {
        const delivery = args.object.bindingContext;
        try {
            await this.deliveryService.updateDeliveryStatus(delivery.id, !delivery.isDelivered);
        } catch (error) {
            console.error('Error updating delivery status:', error);
        }
    }
}