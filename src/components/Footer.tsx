export function Footer() {
  return (
    <footer className="bg-green-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <p className="text-gray-300">
              SapinExpress est votre service de livraison de sapins de Noël de confiance.
              Nous livrons la magie de Noël directement chez vous.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>📞 01 23 45 67 89</li>
              <li>📧 contact@sapinexpress.fr</li>
              <li>📍 Paris, France</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              <li>
                <a href="/faq" className="text-gray-300 hover:text-white">FAQ</a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-white">Conditions générales</a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-white">Politique de confidentialité</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-green-800 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} SapinExpress. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
