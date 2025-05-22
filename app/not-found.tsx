import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { FileQuestion, Home } from "lucide-react"
import { Slot } from '@radix-ui/react-slot'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-primary-kujang/10 flex items-center justify-center">
              <FileQuestion className="h-12 w-12 text-primary-kujang" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Halaman Tidak Ditemukan</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
          </p>
          <Button asChild size="lg" className="bg-primary-kujang hover:bg-primary-kujang/90">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>

      <Footer />
    </main>
  )
}
