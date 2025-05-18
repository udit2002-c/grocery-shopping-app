import { ShoppingCart } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <ShoppingCart className="h-16 w-16 text-gray-400 animate-bounce" />
      </div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  )
}
