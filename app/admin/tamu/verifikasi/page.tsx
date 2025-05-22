"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, Phone, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { guestService } from "@/lib/data-service"
import Link from "next/link"

export default function VerifikasiTamuPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [guests, setGuests] = useState<any[]>([])
  const [selectedGuest, setSelectedGuest] = useState<any>(null)
  const [otpCode, setOtpCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch data
  useEffect(() => {
    const fetchGuests = async () => {
      setIsLoading(true)
      try {
        const guestsData = await guestService.getGuests()
        setGuests(
          Array.isArray(guestsData)
            ? guestsData.map((guest) => ({
                ...guest,
                status: "pending",
                verificationMethod: Math.random() > 0.5 ? "email" : "sms",
                registrationTime: new Date().toISOString(),
              }))
            : [],
        )
      } catch (error) {
        console.error("Error fetching guests:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGuests()
  }, [])

  // Filter tamu berdasarkan pencarian
  const filteredGuests = guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Fungsi untuk mengirim OTP
  const sendOTP = (guest: any) => {
    setSelectedGuest(guest)

    // Simulasi pengiriman OTP
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString()
    console.log(`OTP untuk ${guest.name}: ${generatedOTP}`)

    // OTP akan dikirim ke email atau SMS
    toast({
      title: "OTP Terkirim",
      description: `Kode OTP telah dikirim ke ${guest.verificationMethod === "email" ? guest.email : guest.phone}`,
    })
  }

  // Fungsi untuk verifikasi OTP
  const verifyOTP = async () => {
    setIsVerifying(true)

    // Simulasi verifikasi OTP
    setTimeout(async () => {
      if (otpCode.length === 6) {
        try {
          // Update status tamu di Supabase
          await guestService.updateGuest(selectedGuest.id, { status: "active" })

          // Update state lokal
          const updatedGuests = guests.map((g) =>
            g.id === selectedGuest.id ? { ...g, status: "active" } : g,
          )
          setGuests(updatedGuests)

          toast({
            title: "Verifikasi Berhasil",
            description: `Tamu ${selectedGuest.name} telah berhasil diverifikasi`,
          })

          // Reset form
          setSelectedGuest(null)
          setOtpCode("")
        } catch (error) {
          console.error("Error updating guest status:", error)
          toast({
            title: "Verifikasi Gagal",
            description: "Terjadi kesalahan saat memperbarui status tamu.",
            variant: "destructive",
          })
        } finally {
          setIsVerifying(false)
        }
      } else {
        setIsVerifying(false)
        toast({
          title: "Verifikasi Gagal",
          description: "Kode OTP tidak valid. Silakan coba lagi.",
          variant: "destructive",
        })
      }
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Verifikasi Tamu</h1>
        <p className="text-muted-foreground">Verifikasi tamu yang telah mendaftar</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Menunggu Verifikasi</TabsTrigger>
          <TabsTrigger value="verified">Terverifikasi</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tamu Menunggu Verifikasi</CardTitle>
              <CardDescription>Daftar tamu yang perlu diverifikasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Cari tamu..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead className="hidden md:table-cell">Institusi</TableHead>
                      <TableHead className="hidden md:table-cell">Departemen</TableHead>
                      <TableHead>Metode Verifikasi</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="flex justify-center">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-kujang border-t-transparent"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : filteredGuests.filter((g) => g.status === "pending").length > 0 ? (
                      filteredGuests
                        .filter((g) => g.status === "pending")
                        .map((guest) => (
                          <TableRow key={guest.id}>
                            <TableCell className="font-medium">
                              <Link
                                href={`/admin/tamu/detail?id=${guest.id}`}
                                className="hover:underline hover:text-primary-kujang"
                              >
                                {guest.id}
                              </Link>
                            </TableCell>
                            <TableCell>{guest.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{guest.institution}</TableCell>
                            <TableCell className="hidden md:table-cell">{guest.department}</TableCell>
                            <TableCell>
                              {guest.verificationMethod === "email" ? (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  Email
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  SMS
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={guest.status === "active" ? "default" : "secondary"}
                                className={guest.status === "active" ? "bg-green-500" : ""}
                              >
                                {guest.status === "active" ? "Terverifikasi" : "Menunggu"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/admin/tamu/detail?id=${guest.id}`}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View Details</span>
                                  </Link>
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => sendOTP(guest)}
                                  disabled={guest.status === "active"}
                                >
                                  Verifikasi
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Tidak ada tamu yang menunggu verifikasi.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {selectedGuest && (
            <Card>
              <CardHeader>
                <CardTitle>Verifikasi OTP</CardTitle>
                <CardDescription>
                  Masukkan kode OTP yang telah dikirim ke{" "}
                  {selectedGuest.verificationMethod === "email" ? selectedGuest.email : selectedGuest.phone}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium">Kode OTP</p>
                    <div className="flex gap-4">
                      <Input
                        type="text"
                        placeholder="Masukkan kode OTP"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        maxLength={6}
                        className="text-center text-lg tracking-widest"
                      />
                      <Button onClick={verifyOTP} disabled={isVerifying || otpCode.length !== 6}>
                        {isVerifying ? <>Memverifikasi...</> : <>Verifikasi</>}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => setSelectedGuest(null)}>
                      Batal
                    </Button>
                    <Button variant="link" onClick={() => sendOTP(selectedGuest)}>
                      Kirim Ulang OTP
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="verified">
          <Card>
            <CardHeader>
              <CardTitle>Tamu Terverifikasi</CardTitle>
              <CardDescription>Daftar tamu yang telah diverifikasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead className="hidden md:table-cell">Institusi</TableHead>
                      <TableHead className="hidden md:table-cell">Departemen</TableHead>
                      <TableHead>Metode Verifikasi</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.filter((g) => g.status === "active").length > 0 ? (
                      guests
                        .filter((g) => g.status === "active")
                        .map((guest) => (
                          <TableRow key={guest.id}>
                            <TableCell className="font-medium">
                              <Link
                                href={`/admin/tamu/detail?id=${guest.id}`}
                                className="hover:underline hover:text-primary-kujang"
                              >
                                {guest.id}
                              </Link>
                            </TableCell>
                            <TableCell>{guest.name}</TableCell>
                            <TableCell className="hidden md:table-cell">{guest.institution}</TableCell>
                            <TableCell className="hidden md:table-cell">{guest.department}</TableCell>
                            <TableCell>
                              {guest.verificationMethod === "email" ? (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  Email
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  SMS
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="default" className="bg-green-500">
                                Terverifikasi
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/tamu/detail?id=${guest.id}`}>
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View Details</span>
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Tidak ada tamu yang terverifikasi.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
