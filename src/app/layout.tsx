import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Livraison de Sapins',
  description: 'Application de livraison de sapins de Noël',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#166534', // vert foncé pour la barre de statut mobile
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
