"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, FileDown, Printer, User, Building, Briefcase, Users, Clock, Calendar } from "lucide-react"
import { guestService } from "@/lib/data-service"
import { generateGuestDetailPDF } from "@/lib/pdf-generator"
import { useToast } from "@/components/ui/use-toast"

// Sample guest data
const guestData = {
  id: "G001",
  name: "Ahmad Fauzi",
  institution: "PT. Mitra Energi",
  purpose: "Meeting",
  department: "Produksi",
  person: "Budi Santoso",
  date: "2024-04-01",
  checkIn: "08:30",
  checkOut: "10:45",
  duration: "2h 15m",
  identityNumber: "3275012345678901",
  phoneNumber: "081234567890",
  email: "ahmad.fauzi@mitraenergi.com",
  photoUrl: "/images/id-card.jpg",
  visitHistory: [
    {
      id: "V001",
      date: "2024-04-01",
      purpose: "Meeting",
      department: "Produksi",
      person: "Budi Santoso",
      checkIn: "08:30",
      checkOut: "10:45",
      duration: "2h 15m",
    },
    {
      id: "V002",
      date: "2024-03-15",
      purpose: "Delivery",
      department: "Logistik",
      person: "Agus Salim",
      checkIn: "09:00",
      checkOut: "09:45",
      duration: "0h 45m",
    },
    {
      id: "V003",
      date: "2024-02-22",
      purpose: "Meeting",
      department: "Produksi",
      person: "Budi Santoso",
      checkIn: "13:30",
      checkOut: "15:00",
      duration: "1h 30m",
    },
  ],
}

export default function GuestDetailPage() {
  const searchParams = useSearchParams()
  const guestId = searchParams.get("id") || "G001"
  const [guest, setGuest] = useState(guestData)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // In a real app, this would fetch the guest data from an API
  useEffect(() => {
    // Simulate API call
    setIsLoading(true)

    setTimeout(async () => {
      const fetchedGuest = await guestService.getGuestById(guestId)
      if (fetchedGuest) {
        // Ensure all required fields exist with default values if missing
        const completeGuest = {
          ...guestData,
          ...fetchedGuest,
          // @ts-ignore
          duration: fetchedGuest.duration || guestData.duration,
          // @ts-ignore
          visitHistory: Array.isArray(fetchedGuest.visitHistory) ? fetchedGuest.visitHistory : guestData.visitHistory,
        }
        setGuest(completeGuest)
      } else {
        // Fallback to sample data if guest not found
        setGuest(guestData)
      }
      setIsLoading(false)
    }, 1000)
  }, [guestId])

  // Handle print receipt
  const printReceipt = () => {
    const doc = generateGuestDetailPDF(guest)
    doc.save(`Detail_Tamu_${guest.id}.pdf`)

    toast({
      title: "Export Berhasil",
      description: "Detail tamu berhasil diekspor ke PDF",
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Detail Tamu</h1>
            <p className="text-muted-foreground">Memuat informasi tamu dengan ID: {guestId}...</p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-kujang border-t-transparent"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Detail Tamu</h1>
          <p className="text-muted-foreground">Informasi lengkap tamu dengan ID: {guestId}</p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informasi Tamu</CardTitle>
            <CardDescription>Detail informasi tamu dan kunjungan</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Data Pribadi</TabsTrigger>
                <TabsTrigger value="visit">Data Kunjungan</TabsTrigger>
                <TabsTrigger value="history">Riwayat Kunjungan</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-primary-kujang mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                        <p className="font-medium">{guest.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Building className="h-5 w-5 text-primary-kujang mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Instansi/Asal</p>
                        <p className="font-medium">{guest.institution}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 flex items-center justify-center text-primary-kujang">
                        <span className="text-xs font-bold">#</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nomor Identitas</p>
                        <p className="font-medium">{guest.identityNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 flex items-center justify-center text-primary-kujang">
                        <span className="text-xs font-bold">@</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{guest.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-5 w-5 flex items-center justify-center text-primary-kujang">
                        <span className="text-xs font-bold">☏</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nomor HP</p>
                        <p className="font-medium">{guest.phoneNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">Foto ID Card / KTP</p>
                      <div className="relative h-48 w-full">
                        <Image
                          src={guest.photoUrl || "/placeholder.svg"}
                          alt="ID Card"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="visit" className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-primary-kujang mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tujuan Kunjungan</p>
                        <p className="font-medium">{guest.purpose}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-primary-kujang mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Departemen</p>
                        <p className="font-medium">{guest.department}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-primary-kujang mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Orang yang Dituju</p>
                        <p className="font-medium">{guest.person}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary-kujang mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tanggal Kunjungan</p>
                        <p className="font-medium">{guest.date}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary-kujang mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Jam Masuk</p>
                        <p className="font-medium">{guest.checkIn}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary-kujang mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Jam Keluar</p>
                        <p className="font-medium">{guest.checkOut}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary-kujang mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Durasi Kunjungan</p>
                        <p className="font-medium">{guest.duration}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="pt-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Tujuan</TableHead>
                        <TableHead>Departemen</TableHead>
                        <TableHead>Durasi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(guest.visitHistory && Array.isArray(guest.visitHistory) ? guest.visitHistory : []).map((visit) => (
                        <TableRow key={visit.id}>
                          <TableCell className="font-medium">{visit.id}</TableCell>
                          <TableCell>{visit.date}</TableCell>
                          <TableCell>{visit.purpose}</TableCell>
                          <TableCell>{visit.department}</TableCell>
                          <TableCell>{visit.duration}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={printReceipt}>
              <Printer className="mr-2 h-4 w-4" />
              Cetak
            </Button>
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>QR Code Tamu</CardTitle>
            <CardDescription>QR Code untuk verifikasi tamu</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="border p-4 bg-white rounded-lg mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  JSON.stringify({
                    id: guest.id,
                    name: guest.name,
                    timestamp: new Date().toISOString(),
                  }),
                )}`}
                alt="QR Code Tamu"
                className="w-48 h-48"
              />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              QR Code ini digunakan untuk verifikasi tamu saat masuk dan keluar area
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={printReceipt}>
              <Printer className="mr-2 h-4 w-4" />
              Cetak QR Code
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
