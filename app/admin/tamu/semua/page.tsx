"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, FileDown, Printer, Eye, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { guestService } from "@/lib/data-service"
import { generateGuestListPDF } from "@/lib/pdf-generator"
import { generateGuestListExcel } from "@/lib/excel-generator"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"

export default function SemuaTamuPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [guests, setGuests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch data
  useEffect(() => {
    const fetchGuests = async () => {
      setIsLoading(true)
      try {
        const guestsData = await guestService.getGuests()
        setGuests(Array.isArray(guestsData) ? guestsData : [])
      } catch (error) {
        console.error("Error fetching guests:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGuests()
  }, [])

  // Filter tamu berdasarkan pencarian, departemen, dan tanggal
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment =
      departmentFilter === "all" || guest.department.toLowerCase() === departmentFilter.toLowerCase()

    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && guest.date === new Date().toISOString().split("T")[0]) ||
      (dateFilter === "week" && new Date(guest.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "month" && new Date(guest.date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))

    return matchesSearch && matchesDepartment && matchesDate
  })

  // Export to Excel
  const exportToExcel = () => {
    generateGuestListExcel(filteredGuests, "Semua_Tamu")

    toast({
      title: "Export Berhasil",
      description: "Data tamu berhasil diekspor ke Excel",
    })
  }

  // Export to PDF
  const exportToPDF = () => {
    const doc = generateGuestListPDF(filteredGuests, "Semua Tamu")
    doc.save(`Semua_Tamu_${format(new Date(), "yyyy-MM-dd")}.pdf`)

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
        <h1 className="text-3xl font-bold tracking-tight">Semua Tamu</h1>
        <p className="text-muted-foreground">Daftar semua tamu yang telah berkunjung</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Tamu</CardTitle>
          <CardDescription>Riwayat kunjungan semua tamu</CardDescription>
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

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Tanggal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Waktu</SelectItem>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="week">Minggu Ini</SelectItem>
                <SelectItem value="month">Bulan Ini</SelectItem>
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
                  <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex justify-center">
                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-kujang border-t-transparent"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredGuests.length > 0 ? (
                  filteredGuests.map((guest) => (
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
                      <TableCell className="hidden md:table-cell">{guest.purpose}</TableCell>
                      <TableCell>{guest.department}</TableCell>
                      <TableCell className="hidden md:table-cell">{guest.date}</TableCell>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/tamu/detail?id=${guest.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Lihat Detail</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={printData}>
                              <Printer className="mr-2 h-4 w-4" />
                              <span>Cetak</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
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
