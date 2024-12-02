export function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: 'Commandez la livraison',
      description: 'Remplissez le formulaire avec vos informations et l\'adresse de livraison.',
      icon: '📝',
    },
    {
      id: 2,
      title: 'Planifiez la livraison',
      description: 'Choisissez une date et une plage horaire qui vous conviennent.',
      icon: '📅',
    },
    {
      id: 3,
      title: 'Réception',
      description: 'Nos livreurs professionnels s\'occupent du transport de votre sapin avec soin.',
      icon: '🚚',
    },
  ]

  return (
    <div className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Comment ça marche
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500">
            Un service de livraison simple et efficace
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
              <p className="mt-2 text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
