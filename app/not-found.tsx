import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8">
      <ShoppingBag className="h-16 w-16 text-gray-400 mb-6" />
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
      >
        Return to Home
      </Link>
    </div>
  )
}
