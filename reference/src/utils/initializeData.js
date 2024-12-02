import { ref, set } from 'firebase/database';
import { db } from './firebase';

const sampleDeliveries = {
  "delivery1": {
    customerName: "Martin Dupont",
    address: "12 rue des Sapins, 75001 Paris",
    phoneNumber: "0601020304",
    treeSize: "2m",
    isDelivered: false,
    requestedDeliveryDate: "2023-12-20",
    scoutDeliveryRequested: true
  },
  "delivery2": {
    customerName: "Sophie Laurent",
    address: "45 avenue des Pins, 75002 Paris",
    phoneNumber: "0607080910",
    treeSize: "1.5m",
    isDelivered: false,
    requestedDeliveryDate: "2023-12-18",
    scoutDeliveryRequested: false
  },
  "delivery3": {
    customerName: "Jean Dujardin",
    address: "8 boulevard des Épicéas, 75003 Paris",
    phoneNumber: "0611121314",
    treeSize: "3m",
    isDelivered: true,
    requestedDeliveryDate: "2023-12-15",
    scoutDeliveryRequested: true
  }
};

export async function initializeTestData() {
  try {
    await set(ref(db, 'deliveries'), sampleDeliveries);
    console.log('Données de test initialisées avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des données:', error);
  }
}