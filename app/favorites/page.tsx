import { Suspense } from "react"
import FavoritesPage from "@/components/favorites-page"
import Loading from "@/components/loading"

export default function Favorites() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <FavoritesPage />
      </Suspense>
    </main>
  )
}
