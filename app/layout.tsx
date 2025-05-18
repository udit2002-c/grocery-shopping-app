import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { CartProvider } from "@/context/cart-context"
import { FavoritesProvider } from "@/context/favorites-context"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Groceries - Modern Shopping Experience",
  description: "Shop for groceries with our modern web application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <FavoritesProvider>
            <div className="min-h-screen bg-white">
              <div className="max-w-7xl mx-auto">
                <Suspense fallback={<div className="py-6 px-8 border-b border-gray-200 h-[73px]"></div>}>
                  <Header />
                </Suspense>
                {children}
              </div>
            </div>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  )
}
