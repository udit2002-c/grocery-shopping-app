"use client"

import { useContext } from "react"
import { FavoritesContext } from "@/context/favorites-context"
import ProductCard from "./product-card"
import { Heart } from "lucide-react"
import Link from "next/link"

export default function FavoritesPage() {
  const { favorites } = useContext(FavoritesContext)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Favorites</h1>

      {favorites.length === 0 ? (
        <div className="py-16 text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-bold mb-4">You haven't added any favorites yet</h2>
          <p className="mb-8 text-gray-600">Add products to your favorites to see them here.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
