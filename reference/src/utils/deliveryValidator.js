import { formatPhoneNumber, parseExcelDate, parseScoutDelivery } from './excelParser';
import { validateTreeSize } from './treeSizeUtils';

export const validateDelivery = (delivery, columnMap) => {
  const errors = [];
  let customerName, address, phoneNumber, treeSize, requestedDeliveryDate, scoutDeliveryRequested;
  
  try {
    // Validation du nom du client
    customerName = delivery[columnMap.customerName]?.toString().trim();
    if (!customerName) {
      errors.push("Nom du client manquant");
    } else if (customerName.length < 2) {
      errors.push("Nom du client trop court");
    }

    // Validation de l'adresse
    address = delivery[columnMap.address]?.toString().trim();
    if (!address) {
      errors.push("Adresse manquante");
    } else if (address.length < 5) {
      errors.push("Adresse trop courte");
    }

    // Validation du numéro de téléphone
    phoneNumber = formatPhoneNumber(delivery[columnMap.phoneNumber]);
    if (!phoneNumber || phoneNumber.length !== 14) {
      errors.push("Numéro de téléphone invalide (format attendu: XX XX XX XX XX)");
    }

    // Validation de la taille du sapin
    treeSize = delivery[columnMap.treeSize]?.toString().trim();
    if (!treeSize) {
      errors.push("Taille du sapin manquante");
    } else if (!validateTreeSize(treeSize)) {
      errors.push("Taille du sapin invalide (doit être entre 1m et 3m, format: Xm ou X.XXm)");
    }

    // Validation de la date de livraison
    requestedDeliveryDate = parseExcelDate(delivery[columnMap.requestedDeliveryDate]);
    if (!requestedDeliveryDate) {
      errors.push("Date de livraison invalide (format attendu: JJ/MM/AAAA)");
    }

    // Traitement de la livraison scout (optionnelle)
    scoutDeliveryRequested = columnMap.scoutDeliveryRequested 
      ? parseScoutDelivery(delivery[columnMap.scoutDeliveryRequested])
      : false;

    if (errors.length > 0) {
      throw new Error(`Erreurs pour "${customerName || 'Client inconnu'}": ${errors.join(", ")}`);
    }

    return {
      customerName,
      address,
      phoneNumber,
      treeSize,
      requestedDeliveryDate,
      isDelivered: false,
      scoutDeliveryRequested
    };
  } catch (error) {
    throw new Error(`Erreur de validation: ${error.message}`);
  }
};