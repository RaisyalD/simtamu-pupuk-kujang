"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, CalendarIcon, FileDown, Printer, Eye, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { guestService } from "@/lib/data-service"
import { generateGuestListPDF } from "@/lib/pdf-generator"
import { generateGuestListExcel } from "@/lib/excel-generator"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ArchivePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [purposeFilter, setPurposeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [archiveData, setArchiveData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch data
  useEffect(() => {
    setIsLoading(true)

    // Simulate API delay
    const timer = setTimeout(async () => {
      // Get all guests with "Selesai" status
      const guestsData = await guestService.getGuests()
      const guests = Array.isArray(guestsData) ? guestsData.filter((guest) => guest.status === "completed") : []
      setArchiveData(guests)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter archive data based on search term, department, purpose, and date filters
  const filteredData = archiveData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment =
      departmentFilter === "all" || item.department.toLowerCase() === departmentFilter.toLowerCase()

    const matchesPurpose = purposeFilter === "all" || item.purpose.toLowerCase() === purposeFilter.toLowerCase()

    const matchesDate = !dateFilter || item.date === format(dateFilter, "yyyy-MM-dd")

    return matchesSearch && matchesDepartment && matchesPurpose && matchesDate
  })

  // Export to Excel
  const exportToExcel = () => {
    generateGuestListExcel(filteredData, "Arsip_Kunjungan")

    toast({
      title: "Export Berhasil",
      description: "Data arsip berhasil diekspor ke Excel",
    })
  }

  // Export to PDF
  const exportToPDF = () => {
    const doc = generateGuestListPDF(filteredData, "Arsip Kunjungan")
    doc.save(`Arsip_Kunjungan_${format(new Date(), "yyyy-MM-dd")}.pdf`)

    toast({
      title: "Export Berhasil",
      description: "Data arsip berhasil diekspor ke PDF",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Arsip Kunjungan</h1>
        <p className="text-muted-foreground">Riwayat kunjungan tamu PT. Pupuk Kujang</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Kunjungan</CardTitle>
          <CardDescription>Daftar riwayat kunjungan tamu yang telah selesai</CardDescription>
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

            <Select value={purposeFilter} onValueChange={setPurposeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter Tujuan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tujuan</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="audit">Audit</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
                <SelectItem value="research">Research</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "dd MMMM yyyy", { locale: id }) : "Pilih Tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
              </PopoverContent>
            </Popover>

            {dateFilter && (
              <Button variant="ghost" size="sm" onClick={() => setDateFilter(undefined)} className="w-full md:w-auto">
                Reset Tanggal
              </Button>
            )}

            <div className="flex ml-auto gap-2">
              <Button variant="outline" size="sm" onClick={exportToExcel}>
                <FileDown className="mr-2 h-4 w-4" />
                Export Excel
              </Button>
              <Button variant="outline" size="sm" onClick={exportToPDF}>
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
                  <TableHead>Durasi</TableHead>
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
                ) : filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/admin/tamu/detail?id=${item.id}`}
                          className="hover:underline hover:text-primary-kujang"
                        >
                          {item.id}
                        </Link>
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.institution}</TableCell>
                      <TableCell className="hidden md:table-cell">{item.purpose}</TableCell>
                      <TableCell>{item.department}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(new Date(item.date), "dd MMM yyyy", { locale: id })}
                      </TableCell>
                      <TableCell>{item.duration}</TableCell>
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
                              <Link href={`/admin/tamu/detail?id=${item.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Lihat Detail</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
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
                      Tidak ada data arsip yang ditemukan.
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
