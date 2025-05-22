import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function KontakPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-1 pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">Kontak Kami</h1>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-10 max-w-2xl mx-auto">
              Jika Anda memiliki pertanyaan atau membutuhkan bantuan terkait sistem penerimaan tamu, silakan hubungi
              kami melalui informasi kontak di bawah ini.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <MapPin className="h-5 w-5 text-primary-kujang mr-2" />
                    Alamat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Jl. Jend. A. Yani No.39, Cikampek, Karawang, Jawa Barat 41373
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Phone className="h-5 w-5 text-primary-kujang mr-2" />
                    Telepon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">(0264) 123456</p>
                  <p className="text-gray-600 dark:text-gray-300">0812-3456-7890</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Mail className="h-5 w-5 text-primary-kujang mr-2" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">info@pupukkujang.com</p>
                  <p className="text-gray-600 dark:text-gray-300">resepsionis@pupukkujang.com</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle>Kirim Pesan</CardTitle>
                  <CardDescription>Isi formulir di bawah ini untuk mengirim pesan kepada kami</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Nama Lengkap
                        </label>
                        <Input id="name" placeholder="Masukkan nama lengkap" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input id="email" type="email" placeholder="Masukkan email" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subjek
                      </label>
                      <Input id="subject" placeholder="Masukkan subjek pesan" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Pesan
                      </label>
                      <Textarea id="message" placeholder="Masukkan pesan Anda" rows={5} />
                    </div>
                    <Button className="w-full bg-primary-kujang hover:bg-primary-kujang/90">Kirim Pesan</Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Jam Operasional</CardTitle>
                    <CardDescription>Jam kerja resepsionis dan penerimaan tamu</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary-kujang mt-0.5" />
                        <div>
                          <p className="font-medium">Senin - Jumat</p>
                          <p className="text-gray-600 dark:text-gray-300">08:00 - 17:00 WIB</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary-kujang mt-0.5" />
                        <div>
                          <p className="font-medium">Sabtu</p>
                          <p className="text-gray-600 dark:text-gray-300">08:00 - 12:00 WIB</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-primary-kujang mt-0.5" />
                        <div>
                          <p className="font-medium">Minggu & Hari Libur</p>
                          <p className="text-gray-600 dark:text-gray-300">Tutup</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Lokasi</CardTitle>
                    <CardDescription>Peta lokasi PT. Pupuk Kujang</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video rounded-md overflow-hidden border">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.9553107040813!2d107.45!3d-6.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjQnMDAuMCJTIDEwN8KwMjcnMDAuMCJF!5e0!3m2!1sid!2sid!4v1650000000000!5m2!1sid!2sid"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                    <div className="mt-4">
                      <Button asChild variant="outline" className="w-full">
                        <Link href="https://goo.gl/maps/123" target="_blank" rel="noopener noreferrer">
                          Buka di Google Maps
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
