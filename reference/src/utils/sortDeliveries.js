export function sortDeliveries(list, criteria) {
  return [...list].sort((a, b) => {
    switch (criteria) {
      case 'name':
        return a.customerName.localeCompare(b.customerName);
      case 'status':
        return (a.isDelivered === b.isDelivered) ? 0 : a.isDelivered ? 1 : -1;
      case 'size':
        return a.treeSize.localeCompare(b.treeSize);
      default:
        return 0;
    }
  });
}