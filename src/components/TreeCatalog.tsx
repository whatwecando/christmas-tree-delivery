export function TreeCatalog() {
  const trees = [
    {
      id: 1,
      name: 'Épicéa',
      height: '150-175cm',
      price: '49.99€',
      image: '/trees/epicea.jpg',
    },
    {
      id: 2,
      name: 'Nordmann',
      height: '150-175cm',
      price: '69.99€',
      image: '/trees/nordmann.jpg',
    },
    // Ajoutez plus d'arbres ici
  ]

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Notre sélection de sapins
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500">
            Des sapins de qualité, sélectionnés avec soin pour votre Noël
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {trees.map((tree) => (
            <div key={tree.id} className="group relative bg-white border rounded-lg shadow-sm">
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg">
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  Image du sapin
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{tree.name}</h3>
                <p className="mt-1 text-sm text-gray-500">Hauteur: {tree.height}</p>
                <p className="mt-1 text-lg font-medium text-gray-900">{tree.price}</p>
                <button className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
