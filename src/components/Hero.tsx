export function Hero() {
  return (
    <div className="relative bg-green-900 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Livraison de sapins
            <span className="block text-green-400">à votre porte</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-base text-gray-300 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
            Service de livraison professionnel pour votre sapin de Noël.
            Rapide, fiable et soigneux.
          </p>
          <div className="mt-5 flex justify-center">
            <a
              href="/delivery"
              className="rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
            >
              Commander une livraison
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
