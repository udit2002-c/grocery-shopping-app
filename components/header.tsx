"use client"

import type React from "react"
import { useContext, useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { Heart, ShoppingCart, ShoppingBag, Search, X } from "lucide-react"
import { CartContext } from "@/context/cart-context"
import { FavoritesContext } from "@/context/favorites-context"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { debounce } from "@/utils/helpers"

// Separate component for search functionality that uses useSearchParams
function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize search query from URL params
  useEffect(() => {
    const initialQuery = searchParams?.get("search") || ""
    setSearchQuery(initialQuery)
  }, [searchParams])

  // Debounced search function
  const debouncedSearch = debounce((query: string) => {
    setIsSearching(false)
    if (pathname !== "/") {
      router.push(`/?search=${encodeURIComponent(query)}`)
    } else {
      // Create new URLSearchParams
      const params = new URLSearchParams(searchParams?.toString() || "")
      if (query) {
        params.set("search", query)
      } else {
        params.delete("search")
      }
      router.push(`/?${params.toString()}`)
    }
  }, 500)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    setIsSearching(true)
    debouncedSearch(query)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(false)
    if (pathname !== "/") {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`)
    } else {
      // Create new URLSearchParams
      const params = new URLSearchParams(searchParams?.toString() || "")
      if (searchQuery) {
        params.set("search", searchQuery)
      } else {
        params.delete("search")
      }
      router.push(`/?${params.toString()}`)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setIsSearching(false)
    if (pathname !== "/") {
      router.push("/")
    } else {
      // Create new URLSearchParams
      const params = new URLSearchParams(searchParams?.toString() || "")
      params.delete("search")
      router.push(`/?${params.toString()}`)
    }
  }

  return (
    <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full py-2 px-4 pr-12 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-200"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="absolute right-3 top-2.5">
          {searchQuery ? (
            <button type="button" onClick={clearSearch} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          ) : isSearching ? (
            <div className="animate-bounce">
              <ShoppingCart size={20} className="text-gray-400" />
            </div>
          ) : (
            <Search size={20} className="text-gray-400" />
          )}
        </div>
      </div>
    </form>
  )
}

// Fallback component for when SearchBar is loading
function SearchBarFallback() {
  return (
    <div className="flex-1 max-w-xl mx-4">
      <div className="relative">
        <div className="w-full h-10 bg-gray-100 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}

export default function Header() {
  const { cartItems, isUpdating } = useContext(CartContext)
  const { favorites } = useContext(FavoritesContext)
  const [cartAnimation, setCartAnimation] = useState(false)

  // Calculate total items in cart (excluding offer items)
  const totalItems = cartItems.filter((item) => !item.isOffer).reduce((total, item) => total + item.quantity, 0)

  const totalFavorites = favorites.length

  // Animate cart icon when items are added/removed
  useEffect(() => {
    if (isUpdating) {
      setCartAnimation(true)
      const timer = setTimeout(() => {
        setCartAnimation(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isUpdating, cartItems.length])

  return (
    <header className="py-6 px-8 border-b border-gray-200">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-6 w-6" />
          <span>GROCERIES</span>
        </Link>

        <Suspense fallback={<SearchBarFallback />}>
          <SearchBar />
        </Suspense>

        <div className="flex items-center gap-6">
          <Link href="/favorites" className="relative">
            <Heart className={`h-6 w-6 text-gray-700 ${totalFavorites > 0 ? "fill-red-500 text-red-500" : ""}`} />
            {totalFavorites > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalFavorites}
              </span>
            )}
          </Link>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 21C20 19.8954 16.4183 19 12 19C7.58172 19 4 19.8954 4 21M12 16C8.68629 16 6 13.3137 6 10C6 6.68629 8.68629 4 12 4C15.3137 4 18 6.68629 18 10C18 13.3137 15.3137 16 12 16Z"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <Link href="/checkout" className="relative">
            <ShoppingCart
              className={`h-6 w-6 text-gray-700 transition-transform ${cartAnimation ? "scale-125" : ""}`}
            />
            {totalItems > 0 && (
              <span
                className={`absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-transform ${cartAnimation ? "scale-125" : ""}`}
              >
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
