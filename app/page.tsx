import { Suspense } from "react"
import SearchResults from "@/components/search-results"
import Loading from "@/components/loading"

export default function Home() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <SearchResults />
      </Suspense>
    </main>
  )
}
