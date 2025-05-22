import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { UserRound, ClipboardList, Shield, Clock, BarChart } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-24 lg:pt-32 pb-16 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-primary-kujang/10 to-transparent dark:from-primary-kujang/5 -z-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="text-primary-kujang">SIMTAMU</span> - Sistem Informasi Manajemen Tamu
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                SIMTAMU menyediakan solusi modern untuk pengelolaan tamu perusahaan dengan keamanan, kemudahan, dan
                efisiensi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button asChild size="lg" className="bg-primary-kujang hover:bg-primary-kujang/90">
                  <Link href="/formulir">
                    <ClipboardList className="mr-2 h-5 w-5" />
                    Masuk sebagai Tamu
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">
                    <UserRound className="mr-2 h-5 w-5" />
                    Login Admin
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-xl">
              <Image src="/images/kujang.jpg" alt="PT. Pupuk Kujang Building" fill className="object-cover" priority />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Unggulan</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Sistem kami dirancang untuk memberikan pengalaman terbaik bagi tamu dan pengelola
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-kujang/10 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-primary-kujang" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Keamanan Terjamin</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sistem verifikasi tamu yang komprehensif dengan penyimpanan data yang aman dan terenkripsi.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-secondary-kujang/10 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-secondary-kujang" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Efisiensi Waktu</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Proses check-in dan check-out yang cepat dengan sistem QR code dan notifikasi otomatis.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-kujang/10 rounded-lg flex items-center justify-center mb-6">
                <BarChart className="h-6 w-6 text-primary-kujang" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Analisis Data</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dapatkan insight dari data kunjungan dengan visualisasi statistik yang komprehensif.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Pendaftaran Section */}
      <section className="py-16 md:py-24 bg-primary-kujang/10 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Alur Pendaftaran</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Proses sederhana untuk mendapatkan izin akses masuk sebagai tamu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow relative">
              <div className="w-12 h-12 bg-primary-kujang rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Isi Data Kunjungan</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Masukkan informasi diri dan tujuan kunjungan Anda melalui formulir yang tersedia.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-kujang rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Ajukan Permohonan</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Kirim permohonan izin akses setelah memastikan data sudah benar.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-kujang rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Verifikasi</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tunggu proses verifikasi dan persetujuan dari pihak admin.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-kujang rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3">Terima Izin Akses</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Setelah disetujui, Anda akan menerima izin akses masuk digital yang siap digunakan. Selamat datang dan
                selamat berkunjung di PT Pupuk Kujang.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
