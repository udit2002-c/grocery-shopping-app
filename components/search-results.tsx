"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import CategoryFilter from "./category-filter"
import ProductCard from "./product-card"
import type { Product } from "@/types"
import { ShoppingCart } from "lucide-react"

// Sample product data with images for testing
const sampleProducts: Product[] = [
  {
    id: "coca-cola-1",
    name: "Coca-Cola Classic",
    description: "Refreshing cola drink in a can",
    price: 45.0,
    stock: 50,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    keywords: ["drink", "soda", "cola"],
  },
  {
    id: "croissant-1",
    name: "Butter Croissant",
    description: "Freshly baked butter croissant",
    price: 65.0,
    stock: 15,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    keywords: ["bakery", "pastry", "breakfast"],
  },
  {
    id: "coffee-1",
    name: "Arabica Coffee",
    description: "Premium arabica coffee beans",
    price: 120.0,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    keywords: ["drink", "hot", "caffeine"],
  },
  {
    id: "apple-1",
    name: "Granny Smith Apple",
    description: "Fresh green apples",
    price: 25.0,
    stock: 30,
    image:
      "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    keywords: ["fruit", "fresh", "green"],
  },
]

// Separate component that uses useSearchParams
function SearchResultsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")

  const searchParams = useSearchParams()
  const searchQuery = searchParams?.get("search") || ""

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        // Try to fetch from API
        try {
          const response = await fetch(
            `https://uxdlyqjm9i.execute-api.eu-west-1.amazonaws.com/s?category=${activeCategory}`,
            { cache: "no-store" },
          )

          if (response.ok) {
            const data = await response.json()

            // If we got data, use it
            if (data && data.length > 0) {
              setProducts(data)
              setLoading(false)
              return
            }
          }
        } catch (apiError) {
          console.error("API fetch failed, using sample data:", apiError)
        }

        // If API fetch fails or returns empty, use sample data
        // Filter sample data based on category if needed
        let filteredSamples = sampleProducts
        if (activeCategory !== "all") {
          filteredSamples = sampleProducts.filter((product) => {
            if (
              activeCategory === "drinks" &&
              (product.name.toLowerCase().includes("cola") || product.name.toLowerCase().includes("coffee"))
            ) {
              return true
            }
            if (
              activeCategory === "fruit" &&
              (product.name.toLowerCase().includes("apple") || product.keywords?.includes("fruit"))
            ) {
              return true
            }
            if (
              activeCategory === "bakery" &&
              (product.name.toLowerCase().includes("croissant") || product.keywords?.includes("bakery"))
            ) {
              return true
            }
            return false
          })
        }

        setProducts(filteredSamples)
        setLoading(false)
      } catch (err) {
        console.error("Error loading products:", err)
        setError("Failed to load products. Please try again later.")
        setProducts(sampleProducts) // Fallback to sample data
        setLoading(false)
      }
    }

    fetchProducts()
  }, [activeCategory])

  // Apply search filter when products or search query changes
  useEffect(() => {
    if (products.length > 0 && searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase()

      const filtered = products.filter((product) => {
        // Search in name
        if (product.name.toLowerCase().includes(lowercaseQuery)) {
          return true
        }

        // Search in description
        if (product.description.toLowerCase().includes(lowercaseQuery)) {
          return true
        }

        // Search in keywords if available
        if (product.keywords && product.keywords.some((keyword) => keyword.toLowerCase().includes(lowercaseQuery))) {
          return true
        }

        return false
      })

      setFilteredProducts(filtered)
    } else {
      setFilteredProducts(products)
    }
  }, [searchQuery, products])

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
  }

  if (loading) {
    return (
      <div className="p-8">
        <CategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
        <div className="py-16 text-center">
          <div className="mx-auto w-16 h-16 relative">
            <ShoppingCart className="h-16 w-16 text-gray-400 animate-bounce" />
          </div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <CategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
        <div className="py-16 text-center text-red-500">{error}</div>
      </div>
    )
  }

  const displayProducts = filteredProducts
  const isSearching = searchQuery.length > 0

  return (
    <div className="p-8">
      <CategoryFilter activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />

      <h2 className="text-2xl font-bold mt-8 mb-6 px-2">
        {isSearching ? `Search Results for "${searchQuery}"` : "Trending Items"}
      </h2>

      {displayProducts.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-gray-600">
            {isSearching
              ? "No products found. Try a different search or category."
              : "No products available in this category."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

// Fallback component for when SearchResultsContent is loading
function SearchResultsFallback() {
  return (
    <div className="p-8">
      <div className="h-12 bg-gray-100 rounded-lg animate-pulse mb-8"></div>
      <div className="py-16 text-center">
        <div className="mx-auto w-16 h-16 relative">
          <ShoppingCart className="h-16 w-16 text-gray-400 animate-bounce" />
        </div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    </div>
  )
}

export default function SearchResults() {
  return (
    <Suspense fallback={<SearchResultsFallback />}>
      <SearchResultsContent />
    </Suspense>
  )
}
