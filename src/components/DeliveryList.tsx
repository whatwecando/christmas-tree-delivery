interface Delivery {
  id: number;
  clientName: string;
  phone: string;
  address: string;
  treeSize: 'small' | 'medium' | 'large';
  status: 'pending' | 'delivered';
}

const deliveries: Delivery[] = [
  {
    id: 1,
    clientName: "Marie Dupont",
    phone: "06 12 34 56 78",
    address: "123 rue des Sapins, 75001 Paris",
    treeSize: "medium",
    status: "pending"
  },
  {
    id: 2,
    clientName: "Jean Martin",
    phone: "06 98 76 54 32",
    address: "45 avenue des Pins, 75002 Paris",
    treeSize: "large",
    status: "pending"
  },
  // Ajoutez plus de données de test ici
];

const getSizeColor = (size: string) => {
  switch (size) {
    case 'small':
      return 'bg-blue-100 text-blue-800';
    case 'medium':
      return 'bg-green-100 text-green-800';
    case 'large':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function DeliveryList() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Livraisons</h1>
          <p className="mt-2 text-sm text-gray-700">
            Liste des livraisons de sapins à effectuer
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Client
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Téléphone
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Adresse
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Taille
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {deliveries.map((delivery) => (
                    <tr key={delivery.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {delivery.clientName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {delivery.phone}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {delivery.address}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getSizeColor(delivery.treeSize)}`}>
                          {delivery.treeSize}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          delivery.status === 'delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {delivery.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
