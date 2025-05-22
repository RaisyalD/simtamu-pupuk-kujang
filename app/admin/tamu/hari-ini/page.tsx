"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileDown, Printer, Eye, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { guestService } from "@/lib/data-service"
import { generateGuestListPDF } from "@/lib/pdf-generator"
import { generateGuestListExcel } from "@/lib/excel-generator"
import { format } from "date-fns"

export default function TamuHariIniPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [guests, setGuests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch data
  useEffect(() => {
    const fetchGuests = async () => {
      setIsLoading(true)
      try {
        const guestsData = await guestService.getTodayGuests()
        setGuests(Array.isArray(guestsData) ? guestsData : [])
      } catch (error) {
        console.error("Error fetching guests:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGuests()
  }, [])

  // Filter tamu berdasarkan pencarian, departemen, dan status
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment =
      departmentFilter === "all" || guest.department.toLowerCase() === departmentFilter.toLowerCase()

    const matchesStatus = statusFilter === "all" || guest.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesDepartment && matchesStatus
  })

  // Check-out tamu
  const checkoutGuest = (id: string) => {
    const updatedGuest = guestService.checkoutGuest(id)

    if (updatedGuest) {
      // Update the local state
      setGuests(guests.map((guest) => (guest.id === id ? updatedGuest : guest)))

      toast({
        title: "Check-out Berhasil",
        description: `Tamu dengan ID ${id} telah berhasil check-out`,
      })
    }
  }

  // Export to Excel
  const exportToExcel = () => {
    generateGuestListExcel(filteredGuests, "Tamu_Hari_Ini")

    toast({
      title: "Export Berhasil",
      description: "Data tamu berhasil diekspor ke Excel",
    })
  }

  // Export to PDF
  const exportToPDF = () => {
    const doc = generateGuestListPDF(filteredGuests, "Tamu Hari Ini")
    doc.save(`Tamu_Hari_Ini_${format(new Date(), "yyyy-MM-dd")}.pdf`)

    toast({
      title: "Export Berhasil",
      description: "Data tamu berhasil diekspor ke PDF",
    })
  }

  // Print data
  const printData = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tamu Hari Ini</h1>
        <p className="text-muted-foreground">Daftar tamu yang berkunjung hari ini</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Tamu Hari Ini</CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
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

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Departemen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Departemen</SelectItem>
                <SelectItem value="produksi">Produksi</SelectItem>
                <SelectItem value="hsse">HSSE</SelectItem>
                <SelectItem value="it">IT</SelectItem>
                <SelectItem value="logistik">Logistik</SelectItem>
                <SelectItem value="pemasaran">Pemasaran</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex ml-auto gap-2">
              <Button variant="outline" size="sm" onClick={exportToExcel}>
                <FileDown className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Button variant="outline" size="sm" onClick={exportToPDF}>
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm" onClick={printData}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead className="hidden md:table-cell">Instansi</TableHead>
                  <TableHead className="hidden md:table-cell">Tujuan</TableHead>
                  <TableHead>Departemen</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <div className="flex justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-kujang border-t-transparent"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredGuests.length > 0 ? (
                  filteredGuests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell className="font-medium">{guest.id}</TableCell>
                      <TableCell>{guest.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{guest.institution}</TableCell>
                      <TableCell className="hidden md:table-cell">{guest.purpose}</TableCell>
                      <TableCell>{guest.department}</TableCell>
                      <TableCell>{guest.checkIn}</TableCell>
                      <TableCell>{guest.checkOut || "-"}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            guest.status === "Aktif"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {guest.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/tamu/detail?id=${guest.id}`}>
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View Details</span>
                            </Link>
                          </Button>

                          {guest.status === "Aktif" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => checkoutGuest(guest.id)}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Tidak ada data tamu yang ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
